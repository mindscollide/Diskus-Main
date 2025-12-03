export const checkXFDFContent = (xfdfString) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xfdfString, "text/xml");
  
    const annots = xml.getElementsByTagName("annots")[0];
    const fields = xml.getElementsByTagName("fields")[0];
  
    const hasAnnots = annots && annots.children.length > 0;
    const hasFields = fields && fields.children.length > 0;
  
    return { hasAnnots, hasFields };
  };