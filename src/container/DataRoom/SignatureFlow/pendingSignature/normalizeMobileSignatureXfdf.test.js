// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { normalizeMobileSignatureXfdf } from "./pendingSIgnatureFunctions";

const PNG = "data:image/png;base64,iVBORw0KGgo=";

const ipadXfdf =
  '<?xml version="1.0" encoding="UTF-8"?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">' +
  '<fields><field name="Sig1"/></fields><annots></annots>' +
  '<pages><defmtx matrix="1.333333,0,0,-1.333333,0,816"/></pages>' +
  '<pdf-info xmlns="http://www.pdftron.com/pdfinfo" version="2" import-version="4">' +
  '<ffield name="Sig1" type="Sig"/>' +
  '<widget name="w1" appearance="BLANK" modified-date="D:20261126115902Z" page="8" field="Sig1">' +
  '<rect y2="541.06" x2="332.2" y1="501.06" x1="152.2"/>' +
  '<appearances><aappearance name="_DEFAULT"><Normal>' + PNG + "</Normal></aappearance></appearances>" +
  '<apref y="541.06" x="152.2" gennum="0" objnum="75"/>' +
  '<trn-custom-data bytes="{&quot;diskusSignerUserId&quot;:&quot;449&quot;}"/>' +
  "</widget></pdf-info></xfdf>";

describe("normalizeMobileSignatureXfdf", () => {
  it("turns the iPad widget PNG into a stamp over the widget rect", () => {
    const out = new DOMParser().parseFromString(
      normalizeMobileSignatureXfdf(ipadXfdf),
      "text/xml",
    );
    const stamp = out.querySelector("annots > stamp");
    expect(stamp).not.toBeNull();
    expect(stamp.getAttribute("page")).toBe("7");
    expect(stamp.getAttribute("rect")).toBe("152.2,501.06,332.2,541.06");
    expect(stamp.querySelector("imagedata").textContent).toBe(PNG);
    expect(stamp.querySelector("trn-custom-data").getAttribute("bytes")).toContain("449");
    const widget = out.querySelector("widget");
    expect(widget.querySelector("appearances")).toBeNull();
    expect(widget.querySelector("apref")).toBeNull();
    expect(widget.hasAttribute("appearance")).toBe(false);
  });

  it("leaves web XFDF (no <appearances>) untouched", () => {
    const web = '<xfdf xmlns="http://ns.adobe.com/xfdf/"><annots><ink page="7"/></annots></xfdf>';
    expect(normalizeMobileSignatureXfdf(web)).toBe(web);
  });

  it("returns bad input unchanged", () => {
    expect(normalizeMobileSignatureXfdf("")).toBe("");
    expect(normalizeMobileSignatureXfdf("<appearances><oops")).toBe("<appearances><oops");
  });
});
