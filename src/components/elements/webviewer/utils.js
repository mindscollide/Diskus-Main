/**
 * @module webviewer/utils
 * @description Utility functions shared by WebViewer-based components in
 * the Diskus platform for inspecting XFDF annotation data.
 */

/**
 * Parses an XFDF string and reports whether it contains any annotations or
 * form fields. Use this to determine whether annotation data needs to be
 * imported or saved in a PDFTron WebViewer session.
 *
 * @param {string} xfdfString - A valid XFDF XML string exported by PDFTron WebViewer.
 * @returns {{ hasAnnots: boolean, hasFields: boolean }} An object where
 *   `hasAnnots` is true when the `<annots>` element has at least one child,
 *   and `hasFields` is true when the `<fields>` element has at least one child.
 */
export const checkXFDFContent = (xfdfString) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xfdfString, "text/xml");
  
    const annots = xml.getElementsByTagName("annots")[0];
    const fields = xml.getElementsByTagName("fields")[0];
  
    const hasAnnots = annots && annots.children.length > 0;
    const hasFields = fields && fields.children.length > 0;
  
    return { hasAnnots, hasFields };
  };