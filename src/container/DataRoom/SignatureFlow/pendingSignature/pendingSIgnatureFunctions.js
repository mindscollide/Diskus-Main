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

export const processXmlToHideFields = (xmlString, nameValues) => {
  console.log(
    xmlString,
    nameValues,
    "processXmlToHideFieldsprocessXmlToHideFields"
  );
  try {
    // Parse the XML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Array to store removed fields along with their parent nodes and siblings
    const removedFields = [];

    // Iterate over each name value in the array
    nameValues.forEach((nameValue) => {
      // Find the ffield with the specified name attribute
      const ffields = xmlDoc.querySelectorAll(`ffield[name="${nameValue}"]`);
      const widgets = xmlDoc.querySelectorAll(`widget[field="${nameValue}"]`);
      console.log(
        ffields,
        widgets,
        "processXmlToHideFieldsprocessXmlToHideFields"
      );
      // Iterate through each matching ffield
      ffields.forEach((ffield) => {
        // Find the associated widget element
        const widget = ffield.nextElementSibling;

        // Prepare the object to store removed fields
        const removedField = {
          parent: ffield.parentNode,
          prevSibling: ffield.previousSibling,
          ffield: ffield.cloneNode(true),
        };

        // If there is an associated widget, add it to the removedField object
        if (
          widget &&
          widget.tagName.toLowerCase() === "widget" &&
          widget.getAttribute("field") === nameValue
        ) {
          removedField.widget = widget.cloneNode(true);
          // Remove the widget element
          widget.parentNode.removeChild(widget);
        }

        // Remove the ffield element
        ffield.parentNode.removeChild(ffield);

        // Push the removed field object to the array
        removedFields.push(removedField);
      });
      console.log(widgets, "processXmlToHideFieldsprocessXmlToHideFields");
      // Iterate through each matching widget (in case widget exists without ffield)
      widgets.forEach((widget) => {
        // Prepare the object to store removed fields
        const removedField = {
          parent: widget.parentNode,
          prevSibling: widget.previousSibling,
          widget: widget.cloneNode(true),
        };

        // Remove the widget element
        widget.parentNode.removeChild(widget);

        // Push the removed field object to the array
        removedFields.push(removedField);
      });
    });

    // Serialize the updated XML back to string
    const updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);

    // Return the updated XML string and the removed fields
    return { updatedXmlString, removedFields };
  } catch (error) {
    console.error(error);
  }
};

export const revertProcessXmlToHideFields = (xmlString, removedFields) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    console.log("revertProcessXmlToHideFields removedFields", removedFields);

    removedFields.forEach((removedField) => {
      const parent = xmlDoc.querySelector(removedField.parent.nodeName);
      const prevSibling = xmlDoc.querySelector(
        removedField.prevSibling?.nodeName
      );
      const ffield = removedField.ffield;
      const widget = removedField.widget;
      console.log("Save Button Clicked parent", parent);
      console.log("Save Button Clicked prevSibling", prevSibling);
      console.log("Save Button Clicked ffield", ffield);
      console.log("Save Button Clicked ffield", ffield);
      // If there was a previous sibling, insert before it; otherwise, append to parent
      if (prevSibling) {
        parent.insertBefore(widget, prevSibling.nextSibling);
      } else {
        parent.appendChild(ffield);
      }
    });
    // Serialize the updated XML back to string
    const revertedXmlString = new XMLSerializer().serializeToString(xmlDoc);
    return revertedXmlString;
  } catch (error) {
    console.log(error);
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
      console.log("revertReadOnlyFreetextElements", userId);
      console.log(
        "getDataroomAnnotation.annotationString  revertReadOnlyFreetextElements",
        userDataRead.includes(Number(userId))
      );
      if (userDataRead.includes(Number(userId))) {
        // User ID matches, set the annotation flags to "print"
        console.log("revertReadOnlyFreetextElements");
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

export const hideFreetextElements = (xmlString, userDataRead) => {
  try {
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
          freetextElement.setAttribute("opacity", "0");
        }
      }
    });

    // Serialize the modified XML back to a string
    const filteredXmlString = serializer.serializeToString(xmlDoc);
    return filteredXmlString;
  } catch (error) {
    console.error(error);
  }
};

export const revertHideFreetextElements = (xmlString, userDataRead) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const freetextElements = xmlDoc.querySelectorAll("freetext");
    const serializer = new XMLSerializer();

    freetextElements.forEach((freetextElement) => {
      const subject = freetextElement.getAttribute("subject");
      const userIdIndex = subject.split("-")[1];
      if (userIdIndex !== -1) {
        const userId = subject.substring(userIdIndex + 1);
        if (userDataRead.includes(Number(userId))) {
          // User ID matches, set the annotation as read-only
          freetextElement.setAttribute("flags", "print");
          freetextElement.setAttribute("opacity", "10");
        }
      }
    });
    // Serialize the modified XML back to a string
    const filteredXmlString = serializer.serializeToString(xmlDoc);
    return filteredXmlString;
  } catch (error) {
    console.error(error);
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
