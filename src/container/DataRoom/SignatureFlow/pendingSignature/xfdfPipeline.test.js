import { describe, it, expect } from "vitest";
import {
  processXmlToHideFields,
  revertProcessXmlToHideFields,
  hideFreetextElements,
  revertHideFreetextElements,
  processXmlForReadOnly,
} from "./pendingSIgnatureFunctions";

/**
 * The XFDF hide/restore pipeline.
 *
 * On load, fields belonging to signers whose turn has not come are stripped out
 * of the XFDF; on submit they are put back, because the server must always
 * receive the complete document. Two real defects motivated these tests:
 *
 *   1. The original implementation round-tripped the XFDF through xml-js with
 *      `spaces: 4`, which pretty-printed the WHOLE document. The XFDF root sets
 *      xml:space="preserve", so that inserted whitespace landed inside <field>
 *      elements and changed their values.
 *   2. Restore blindly re-inserted the saved copies. Because the widgets also
 *      live in the PDF, the viewer exports them again — so the server received
 *      DUPLICATE entries for the same field.
 *
 * The signature appearance is the highest-value thing flowing through here: it
 * is a multi-kilobyte base64 blob and the only representation of a signed
 * signature, so several cases assert it survives byte-for-byte.
 */

/** Stand-in for a real signature appearance: big, and must survive untouched. */
const APPEARANCE = "PD94bWwgdmVyc2lvbj0iMS4wIj8+" + "QUJDREVGR0g".repeat(2000);

/**
 * XFDF shaped like a real Apryse export: two signers (A visible, B to be
 * hidden), a signed Sig field, text/checkbox values, and freetext labels.
 */
const buildXfdf = () =>
  '<?xml version="1.0" encoding="UTF-8"?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">' +
  '<pdf-info xmlns="http://www.pdftron.com/pdfinfo" version="2" import-version="4">' +
  '<ffield type="Sig" name="SigA"/>' +
  '<ffield type="Tx" name="TxA"><font name="Helvetica" size="12"/></ffield>' +
  '<ffield type="Sig" name="SigB"/>' +
  '<ffield type="Tx" name="TxB"><font name="Helvetica" size="12"/></ffield>' +
  '<widget field="SigA" name="w1" page="1"><rect x1="1" x2="2" y1="3" y2="4"/>' +
  "<appearance>" + APPEARANCE + "</appearance>" +
  '<trn-custom-data bytes="{&quot;diskusSignerUserId&quot;:&quot;1567&quot;}"/></widget>' +
  '<widget field="TxA" name="w2" page="1"><rect x1="5" x2="6" y1="7" y2="8"/></widget>' +
  '<widget field="SigB" name="w3" page="1"><rect x1="9" x2="10" y1="11" y2="12"/></widget>' +
  '<widget field="TxB" name="w4" page="1"><rect x1="13" x2="14" y1="15" y2="16"/></widget>' +
  "</pdf-info>" +
  "<fields>" +
  '<field name="SigA"><value/></field>' +
  '<field name="TxA"><value>as</value></field>' +
  '<field name="SigB"><value/></field>' +
  '<field name="TxB"><value/></field>' +
  "</fields>" +
  '<annots><freetext name="ft1" subject="Title-1567" page="1"/>' +
  '<freetext name="ft2" subject="Name-1568" page="1"/>' +
  '<freetext name="ft3" subject="Email-1567" page="1"/></annots>' +
  '<pages><defmtx matrix="1,0,0,-1,0,595.28"/></pages></xfdf>';

/** Attribute values for a tag, in document order — parsed, not regexed. */
const attrs = (xml, tag, attr) =>
  Array.from(new DOMParser().parseFromString(xml, "text/xml").getElementsByTagName(tag))
    .map((el) => el.getAttribute(attr))
    .join();

const HIDDEN_FIELDS = ["SigB", "TxB"];

describe("processXmlToHideFields", () => {
  it("removes the hidden signer's field, ffield and widget", () => {
    const { updatedXmlString } = processXmlToHideFields(buildXfdf(), HIDDEN_FIELDS);
    expect(attrs(updatedXmlString, "widget", "field")).toBe("SigA,TxA");
    expect(attrs(updatedXmlString, "ffield", "name")).toBe("SigA,TxA");
    expect(attrs(updatedXmlString, "field", "name")).toBe("SigA,TxA");
  });

  it("leaves the signature appearance byte-for-byte intact", () => {
    const { updatedXmlString } = processXmlToHideFields(buildXfdf(), HIDDEN_FIELDS);
    expect(updatedXmlString).toContain(APPEARANCE);
  });

  it("does not disturb field values", () => {
    // The xml-js round trip used to reflow these into "\n    as\n  ".
    const { updatedXmlString } = processXmlToHideFields(buildXfdf(), HIDDEN_FIELDS);
    expect(updatedXmlString).toContain("<value>as</value>");
  });

  it("records what it removed, with position", () => {
    const { removedItems } = processXmlToHideFields(buildXfdf(), HIDDEN_FIELDS);
    expect(removedItems.fields).toHaveLength(2);
    expect(removedItems.ffields).toHaveLength(2);
    expect(removedItems.widgets).toHaveLength(2);
  });

  it("is an exact identity when there is nothing to hide", () => {
    const xfdf = buildXfdf();
    expect(processXmlToHideFields(xfdf, []).updatedXmlString).toBe(xfdf);
  });

  it("handles hiding the FIRST element, not just trailing ones", () => {
    // Index-based restore is only exercised properly by a non-trailing removal.
    const { updatedXmlString } = processXmlToHideFields(buildXfdf(), ["SigA"]);
    expect(attrs(updatedXmlString, "widget", "field")).toBe("TxA,SigB,TxB");
  });
});

describe("hideFreetextElements", () => {
  it("removes only the hidden user's labels", () => {
    const { hideFreetextXmlString } = hideFreetextElements(buildXfdf(), [1568]);
    expect(attrs(hideFreetextXmlString, "freetext", "subject")).toBe(
      "Title-1567,Email-1567",
    );
  });

  it("leaves the signature appearance intact", () => {
    // This function has nothing to do with signatures, but the xml-js version
    // reformatted the entire document anyway.
    const { hideFreetextXmlString } = hideFreetextElements(buildXfdf(), [1568]);
    expect(hideFreetextXmlString).toContain(APPEARANCE);
  });

  it("is an exact identity when there is nothing to hide", () => {
    const xfdf = buildXfdf();
    expect(hideFreetextElements(xfdf, []).hideFreetextXmlString).toBe(xfdf);
  });
});

describe("restore round trip", () => {
  it("puts every element back in its original position", () => {
    const xfdf = buildXfdf();
    const hidden = processXmlToHideFields(xfdf, HIDDEN_FIELDS);
    const hiddenFt = hideFreetextElements(hidden.updatedXmlString, [1568]);

    let back = revertProcessXmlToHideFields(hiddenFt.hideFreetextXmlString, hidden.removedItems);
    back = revertHideFreetextElements(back, hiddenFt.removedHideFreetextElements);

    expect(attrs(back, "ffield", "name")).toBe("SigA,TxA,SigB,TxB");
    expect(attrs(back, "widget", "field")).toBe("SigA,TxA,SigB,TxB");
    expect(attrs(back, "field", "name")).toBe("SigA,TxA,SigB,TxB");
    expect(attrs(back, "freetext", "subject")).toBe("Title-1567,Name-1568,Email-1567");
  });

  it("preserves the appearance, values and custom data end to end", () => {
    const xfdf = buildXfdf();
    const hidden = processXmlToHideFields(xfdf, HIDDEN_FIELDS);
    const back = revertProcessXmlToHideFields(hidden.updatedXmlString, hidden.removedItems);

    expect(back).toContain(APPEARANCE);
    expect(back).toContain("<value>as</value>");
    expect(back).toContain("diskusSignerUserId");
    expect(back).not.toContain("parsererror");
  });

  it("restores a leading element back to index 0", () => {
    const first = processXmlToHideFields(buildXfdf(), ["SigA"]);
    const back = revertProcessXmlToHideFields(first.updatedXmlString, first.removedItems);
    expect(attrs(back, "widget", "field")).toBe("SigA,TxA,SigB,TxB");
  });

  it("is an identity when nothing was removed", () => {
    const xfdf = buildXfdf();
    expect(
      revertProcessXmlToHideFields(xfdf, { fields: [], ffields: [], widgets: [] }),
    ).toBe(xfdf);
  });

  /**
   * The duplication defect. Hiding only strips the XFDF — the widget still
   * exists in the PDF, so the viewer exports it again on submit. Restore must
   * REPLACE, not append, or the server receives two entries per field.
   */
  it("replaces rather than duplicates when the viewer re-exports a hidden field", () => {
    const hidden = processXmlToHideFields(buildXfdf(), HIDDEN_FIELDS);

    // What the viewer actually exports: SigB/TxB are back, and carry a
    // display-only flag picked up while they were hidden.
    const reExported = buildXfdf().replace(
      '<ffield type="Sig" name="SigB"/>',
      '<ffield type="Sig" name="SigB" flags="Hidden"/>',
    );

    const back = revertProcessXmlToHideFields(reExported, hidden.removedItems);

    expect(attrs(back, "ffield", "name")).toBe("SigA,TxA,SigB,TxB");
    expect(attrs(back, "widget", "field")).toBe("SigA,TxA,SigB,TxB");
    expect(attrs(back, "field", "name")).toBe("SigA,TxA,SigB,TxB");
  });

  it("lets the pristine pre-hide snapshot win over the viewer's round trip", () => {
    // So a display-only flag applied while hidden cannot leak into what is saved.
    const hidden = processXmlToHideFields(buildXfdf(), HIDDEN_FIELDS);
    const reExported = buildXfdf().replace(
      '<ffield type="Sig" name="SigB"/>',
      '<ffield type="Sig" name="SigB" flags="Hidden"/>',
    );
    const back = revertProcessXmlToHideFields(reExported, hidden.removedItems);

    const sigB = Array.from(
      new DOMParser().parseFromString(back, "text/xml").getElementsByTagName("ffield"),
    ).find((el) => el.getAttribute("name") === "SigB");

    expect(sigB.getAttribute("flags")).toBeNull();
  });
});

describe("processXmlForReadOnly", () => {
  it("flags the named fields ReadOnly and leaves the rest alone", () => {
    const out = processXmlForReadOnly(buildXfdf(), ["SigA"]);
    const ffields = Array.from(
      new DOMParser().parseFromString(out, "text/xml").getElementsByTagName("ffield"),
    );
    const byName = (n) => ffields.find((el) => el.getAttribute("name") === n);

    expect(byName("SigA").getAttribute("flags")).toBe("ReadOnly");
    expect(byName("TxA").getAttribute("flags")).toBeNull();
  });

  it("does not disturb the signature appearance", () => {
    expect(processXmlForReadOnly(buildXfdf(), ["SigA"])).toContain(APPEARANCE);
  });
});
