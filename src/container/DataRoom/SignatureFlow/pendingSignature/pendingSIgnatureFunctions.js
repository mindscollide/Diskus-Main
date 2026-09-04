/**
 * Work out which signers' turn has NOT arrived yet, from the bundle dependency
 * graph on GetWorkFlowByFileID.
 *
 * This used to be read straight off the API as
 * `getAllFieldsByWorkflowID.hiddenUsers`, but that key does not exist on that
 * response — everything real on it sits one level down under
 * `signatureWorkFlowFieldDetails`. So it was always undefined, `?? []` swallowed
 * it, and nothing was ever hidden: in an ordered workflow signer 2 could see
 * signer 3's fields (locked, but visible), which is exactly what ordering is
 * supposed to prevent.
 *
 * The bundles carry the ordering explicitly, e.g. for a 3-signer chain:
 *   { pK_WorkFlowActionableBundle_ID: 3021, actors:[1567], dependencies: [] }
 *   { pK_WorkFlowActionableBundle_ID: 3022, actors:[1566],
 *     dependencies: [{ bundleID: 3022, dependenceID: 3021 }] }
 *   { pK_WorkFlowActionableBundle_ID: 3023, actors:[1568],
 *     dependencies: [{ bundleID: 3023, dependenceID: 3022 }] }
 * `dependenceID` is the bundle that must finish first, so walking dependants
 * forward from the current user's bundle yields everyone downstream of them.
 *
 * Deliberately derived from the dependency edges alone, not from bundle status
 * codes: the edges are unambiguous, whereas the status enum's meaning would
 * have to be assumed — and hiding the wrong bundle would take a signer's own
 * fields away and wedge the workflow.
 *
 * Fails OPEN (returns []) for an unordered workflow, an unknown current user,
 * or missing data — showing a field that could have been hidden is a privacy
 * nit; hiding one that shouldn't be is a signer who cannot sign.
 */
export const deriveHiddenUsers = (bundleModels, currentUserID) => {
  if (!Array.isArray(bundleModels) || !bundleModels.length) return [];

  // No edges at all → unordered workflow → everyone acts in parallel.
  const hasOrdering = bundleModels.some((b) => b.dependencies?.length > 0);
  if (!hasOrdering) return [];

  const usersOf = (b) =>
    (b.actors ?? []).map((a) => a.pK_UID).filter((id) => id != null);

  const currentBundle = bundleModels.find((b) =>
    usersOf(b).includes(currentUserID),
  );
  if (!currentBundle) return [];

  // dependenceID → the bundles waiting on it.
  const dependants = new Map();
  bundleModels.forEach((b) => {
    (b.dependencies ?? []).forEach((d) => {
      if (d?.dependenceID == null) return;
      const list = dependants.get(d.dependenceID) ?? [];
      list.push(b);
      dependants.set(d.dependenceID, list);
    });
  });

  // Breadth-first over everything downstream of the current user's bundle.
  // `seen` also makes a malformed cyclic graph terminate instead of hanging.
  const hidden = new Set();
  const seen = new Set([currentBundle.pK_WorkFlowActionableBundle_ID]);
  const queue = [currentBundle.pK_WorkFlowActionableBundle_ID];

  while (queue.length) {
    const bundleID = queue.shift();
    (dependants.get(bundleID) ?? []).forEach((b) => {
      const id = b.pK_WorkFlowActionableBundle_ID;
      if (seen.has(id)) return;
      seen.add(id);
      queue.push(id);
      usersOf(b).forEach((uid) => hidden.add(uid));
    });
  }

  // A user assigned to more than one bundle must never hide themselves.
  hidden.delete(currentUserID);
  return [...hidden];
};

// === used for read only Form Fields=== //

export const processXmlForReadOnly = (xmlString, nameValues) => {
  // Parse the XML string
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // Iterate through each name value
  nameValues.forEach((nameValue) => {
    // Find the ffield with the specified name attribute value
    const ffield = xmlDoc.querySelector(`ffield[name="${nameValue}"]`);

    if (ffield) {
      // Check if the ffield already has a flags attribute
      const flagsAttribute = ffield.getAttribute("flags");

      if (!flagsAttribute) {
        // If flags attribute does not exist, add it with value "ReadOnly"
        ffield.setAttribute("flags", "ReadOnly");
      } else {
        // If flags attribute exists, append "ReadOnly" to its value if it's not already there
        if (!flagsAttribute.includes("ReadOnly")) {
          ffield.setAttribute("flags", `${flagsAttribute} ReadOnly`);
        }
      }
    }
  });

  // Serialize the updated XML back to string
  const updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);
  return updatedXmlString;
};
export const revertProcessXmlForReadOnly = (xmlString, nameValues) => {
  // Parse the XML string
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // Iterate through each name value
  nameValues.forEach((nameValue) => {
    // Find the ffield with the specified name attribute value
    const ffield = xmlDoc.querySelector(`ffield[name="${nameValue}"]`);

    if (ffield) {
      // Check if the ffield has a flags attribute
      const flagsAttribute = ffield.getAttribute("flags");

      if (flagsAttribute) {
        // Remove "ReadOnly" from the flags attribute value
        const newFlagsAttribute = flagsAttribute
          .replace(/\bReadOnly\b/, "")
          .trim();

        // If the new flags attribute is empty, remove it completely
        if (newFlagsAttribute) {
          ffield.setAttribute("flags", newFlagsAttribute);
        } else {
          ffield.removeAttribute("flags");
        }
      }
    }
  });

  // Serialize the XML document back to a string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(xmlDoc);
};
// === End === //

// === used for Hide Form Fields === //

/**
 * The three (parent selector, child tag, identifying attribute) triples that
 * make up one form field in an XFDF, in the order they are removed/restored.
 * `bucket` is the key its removals are recorded under in `removedItems`.
 */
const HIDEABLE_PARTS = [
  { parent: "fields", tag: "field", attr: "name", bucket: "fields" },
  { parent: "pdf-info", tag: "ffield", attr: "name", bucket: "ffields" },
  { parent: "pdf-info", tag: "widget", attr: "field", bucket: "widgets" },
];

/** Same-tag children of `parent`, in document order. */
const childrenByTag = (parent, tag) =>
  Array.from(parent.children).filter((el) => el.localName === tag);

/**
 * Remove the <field> / <ffield> / <widget> elements belonging to the given
 * field names, remembering each one and its index among its same-tag siblings
 * so revertProcessXmlToHideFields can splice it back exactly where it was.
 *
 * Implemented with DOMParser/XMLSerializer rather than the xml-js JSON round
 * trip this used to use. xml-js was configured with `spaces: 4`, so
 * re-serialising PRETTY-PRINTED the whole document — every element got newlines
 * and indentation inserted around it, whether or not it had anything to do with
 * the fields being hidden. The XFDF root carries xml:space="preserve", so that
 * inserted whitespace is significant, and it lands inside <field> elements:
 *
 *   before:  <field name="CheckBoxFormField 3"><value>Yes</value></field>
 *   after:   <field name="CheckBoxFormField 3">\n    <value>Yes</value>\n  </field>
 *
 * (Measured on a real response: the base64 <appearance> blob carrying a
 * signature does survive the round trip byte-for-byte — the risk here is the
 * value whitespace, not the signature.)
 *
 * Editing the DOM in place changes nothing except the elements actually
 * removed, so there is no whitespace question to reason about at all.
 *
 * @param {string} xmlString  - XFDF string
 * @param {string[]} nameValues - field names to strip out entirely
 * @returns {{updatedXmlString: string, removedItems: object}}
 */
export const processXmlToHideFields = (xmlString, nameValues) => {
  const removedItems = { fields: [], ffields: [], widgets: [] };

  if (!Array.isArray(nameValues) || nameValues.length === 0) {
    return { updatedXmlString: xmlString, removedItems };
  }

  try {
    const doc = new DOMParser().parseFromString(xmlString, "text/xml");
    const serializer = new XMLSerializer();

    HIDEABLE_PARTS.forEach(({ parent, tag, attr, bucket }) => {
      const parentEl = doc.querySelector(parent);
      if (!parentEl) return;

      // Indices are taken against the ORIGINAL sibling list, so they stay
      // meaningful no matter how many later siblings are also removed.
      childrenByTag(parentEl, tag).forEach((el, index) => {
        if (!nameValues.includes(el.getAttribute(attr))) return;
        removedItems[bucket].push({ index, xml: serializer.serializeToString(el) });
        el.parentNode.removeChild(el);
      });
    });

    return { updatedXmlString: serializer.serializeToString(doc), removedItems };
  } catch {
    // Parsing failed — hide nothing rather than hand back a broken XFDF.
    return {
      updatedXmlString: xmlString,
      removedItems: { fields: [], ffields: [], widgets: [] },
    };
  }
};

/**
 * Put back everything processXmlToHideFields took out, at its original index
 * among its same-tag siblings, so the server always receives the complete XFDF.
 *
 * Runs against the XFDF freshly exported from the viewer, not the one the
 * removals were taken from, so elements are re-parsed and imported into that
 * document. Ascending index order matters: restoring low indices first keeps
 * the later ones valid.
 */
export const revertProcessXmlToHideFields = (xml, removedItems) => {
  const hasRemovals =
    removedItems &&
    ((removedItems.fields?.length ?? 0) > 0 ||
      (removedItems.ffields?.length ?? 0) > 0 ||
      (removedItems.widgets?.length ?? 0) > 0);
  if (!hasRemovals) return xml;

  try {
    const parser = new DOMParser();
    const serializer = new XMLSerializer();
    const doc = parser.parseFromString(xml, "text/xml");

    HIDEABLE_PARTS.forEach(({ parent, tag, attr, bucket }) => {
      const removed = removedItems[bucket] ?? [];
      if (!removed.length) return;

      const parentEl = doc.querySelector(parent);
      if (!parentEl) return;

      [...removed]
        .sort((a, b) => a.index - b.index)
        .forEach(({ index, xml: elementXml }) => {
          const parsed = parser.parseFromString(elementXml, "text/xml");
          const node = parsed.documentElement;
          // A parse failure yields a <parsererror> root — never insert that.
          if (!node || node.localName !== tag) return;

          // Restore REPLACES rather than adds. Hiding a field only removes it
          // from the XFDF; the widget itself lives in the PDF, so the viewer
          // still holds it and exports it again. Blindly re-inserting the saved
          // copy would then leave two entries for the same field in what gets
          // sent to the server. Dropping any element that already claims this
          // name also means the pristine pre-hide snapshot wins over whatever
          // the viewer round-tripped, so display-only flags applied while it was
          // hidden cannot leak into the saved document.
          const key = node.getAttribute(attr);
          if (key !== null) {
            childrenByTag(parentEl, tag)
              .filter((el) => el.getAttribute(attr) === key)
              .forEach((el) => el.parentNode.removeChild(el));
          }

          const siblings = childrenByTag(parentEl, tag);
          const before = siblings[index];
          const imported = doc.importNode(node, true);

          if (before) {
            parentEl.insertBefore(imported, before);
          } else if (siblings.length) {
            // Index ran past the end — append after the last same-tag sibling
            // so the element stays inside its own run of siblings.
            parentEl.insertBefore(
              imported,
              siblings[siblings.length - 1].nextSibling,
            );
          } else {
            parentEl.appendChild(imported);
          }
        });
    });

    return serializer.serializeToString(doc);
  } catch {
    return xml;
  }
};
// === End === //

// === used for read only Freetext Fields === //

export const readOnlyFreetextElements = (xmlString, userDataRead) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const freetextElements = xmlDoc.querySelectorAll("freetext");
  const serializer = new XMLSerializer();

  freetextElements.forEach((freetextElement) => {
    const subject = freetextElement.getAttribute("subject");
    const userIdIndex = subject.lastIndexOf("-");
    
    if (userIdIndex !== -1) {
      const userId = subject.substring(userIdIndex + 1);
      if (userDataRead.includes(Number(userId))) {
        // User ID matches, set the annotation as read-only
        freetextElement.setAttribute("flags", "print,locked,lockedcontents");
      }
    }
  });

  // Serialize the modified XML back to a string
  const filteredXmlString = serializer.serializeToString(xmlDoc);
  return filteredXmlString;
};

export const revertReadOnlyFreetextElements = (xmlString, userDataRead) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const freetextElements = xmlDoc.querySelectorAll("freetext");
  const serializer = new XMLSerializer();

  freetextElements.forEach((freetextElement) => {
    const subject = freetextElement.getAttribute("subject");
    const userIdIndex = subject.lastIndexOf("-");
    if (userIdIndex !== -1) {
      const userId = subject.substring(userIdIndex + 1);
      if (userDataRead.includes(Number(userId))) {
        // User ID matches, set the annotation flags to "print"
        freetextElement.setAttribute("flags", "print");
      }
    }
  });

  // Serialize the modified XML back to a string
  const filteredXmlString = serializer.serializeToString(xmlDoc);
  return filteredXmlString;
};

// === End === //

// === used for hide Freetext Fields === //

/**
 * Parse the owner user id out of a freetext annotation's `subject`
 * ("<label>-<userID>", e.g. "Title-1566"). Returns null when absent.
 */
const freetextOwnerID = (el) => {
  const subject = el.getAttribute("subject") ?? "";
  const dash = subject.lastIndexOf("-");
  if (dash === -1) return null;
  const parsed = Number(subject.substring(dash + 1));
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Remove the <freetext> label annotations belonging to hidden users,
 * remembering each one and its index among its <freetext> siblings.
 *
 * DOM-based for the same reason as processXmlToHideFields: the xml-js JSON
 * round trip this replaced pretty-printed the WHOLE document — reflowing form
 * field values it had no business touching — even though this function only
 * cares about <freetext>.
 */
export const hideFreetextElements = (xmlString, userDataRead) => {
  if (!Array.isArray(userDataRead) || userDataRead.length === 0) {
    return {
      hideFreetextXmlString: xmlString,
      removedHideFreetextElements: [],
    };
  }

  try {
    const doc = new DOMParser().parseFromString(xmlString, "text/xml");
    const serializer = new XMLSerializer();
    const annots = doc.querySelector("annots");
    const removedHideFreetextElements = [];

    if (annots) {
      childrenByTag(annots, "freetext").forEach((el, index) => {
        const ownerID = freetextOwnerID(el);
        if (ownerID === null || !userDataRead.includes(ownerID)) return;
        removedHideFreetextElements.push({
          index,
          xml: serializer.serializeToString(el),
        });
        el.parentNode.removeChild(el);
      });
    }

    return {
      hideFreetextXmlString: serializer.serializeToString(doc),
      removedHideFreetextElements,
    };
  } catch {
    return {
      hideFreetextXmlString: xmlString,
      removedHideFreetextElements: [],
    };
  }
};

/**
 * Put back the <freetext> annotations hideFreetextElements removed, at their
 * original index among their <freetext> siblings.
 */
export const revertHideFreetextElements = (
  originalXmlString,
  removedItemsToRestore
) => {
  if (
    !Array.isArray(removedItemsToRestore) ||
    removedItemsToRestore.length === 0
  ) {
    return originalXmlString;
  }

  try {
    const parser = new DOMParser();
    const serializer = new XMLSerializer();
    const doc = parser.parseFromString(originalXmlString, "text/xml");

    let annots = doc.querySelector("annots");
    if (!annots) {
      // The viewer exports an <annots> element even when empty, but if the
      // freetext annotations were the only ones in it and it came back absent,
      // recreate it rather than silently dropping the restored labels.
      annots = doc.createElement("annots");
      doc.documentElement.appendChild(annots);
    }

    [...removedItemsToRestore]
      .sort((a, b) => a.index - b.index)
      .forEach(({ index, xml: elementXml }) => {
        const parsed = parser.parseFromString(elementXml, "text/xml");
        const node = parsed.documentElement;
        if (!node || node.localName !== "freetext") return;

        // Replace, don't duplicate — see revertProcessXmlToHideFields. A
        // freetext annotation baked into the saved PDF comes back on export
        // even though it was stripped from the imported XFDF.
        const key = node.getAttribute("name");
        if (key !== null) {
          childrenByTag(annots, "freetext")
            .filter((el) => el.getAttribute("name") === key)
            .forEach((el) => el.parentNode.removeChild(el));
        }

        const siblings = childrenByTag(annots, "freetext");
        const before = siblings[index];
        const imported = doc.importNode(node, true);

        if (before) {
          annots.insertBefore(imported, before);
        } else if (siblings.length) {
          annots.insertBefore(imported, siblings[siblings.length - 1].nextSibling);
        } else {
          annots.appendChild(imported);
        }
      });

    return serializer.serializeToString(doc);
  } catch {
    return originalXmlString;
  }
};

// === End === //

export const handleBlobFiles = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: "application/pdf" });
};


export const sanitizeXFDF = (xfdfString, documentViewer) => {
  const parser = new DOMParser();
  const xfdfDoc = parser.parseFromString(xfdfString, "text/xml");

  const pageCount = documentViewer.getPageCount();
  const annots = xfdfDoc.querySelectorAll("annots > *");

  annots.forEach((annot) => {
    let pageIndex = parseInt(annot.getAttribute("page"), 10);

    // auto-correct 1-based indexes
    if (pageIndex > 0 && pageIndex <= pageCount) {
      annot.setAttribute("page", pageIndex - 1);
    }

    // drop invalid pages
    if (isNaN(pageIndex) || pageIndex >= pageCount) {
      
      annot.parentNode.removeChild(annot);
    }
  });

  return new XMLSerializer().serializeToString(xfdfDoc);
};


export const isUserSigned = (xfdfString) => {
    // Method 1: Check for appearance tag (most reliable)
    if (xfdfString.includes('<appearance>')) {
        return true;
    }
    
    // Method 2: Check for ink signature annotations
    if (xfdfString.includes('<inklist>') && xfdfString.includes('<gesture>')) {
        return true;
    }
    
    // Method 3: Check if annots section is not empty
    const annotsMatch = xfdfString.match(/<annots>(.*?)<\/annots>/);
    if (annotsMatch && annotsMatch[1] && annotsMatch[1].trim() !== '') {
        return true;
    }
    
    // Method 4: Check for signature field with appearance
    if (xfdfString.includes('type="Sig"') && xfdfString.includes('<appearance')) {
        return true;
    }
    
    return false;
}