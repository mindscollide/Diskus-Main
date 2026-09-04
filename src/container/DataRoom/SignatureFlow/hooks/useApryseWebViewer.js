import { useCallback, useEffect, useRef, useState } from "react";
import WebViewer from "@pdftron/webviewer";

/**
 * Silences Apryse's internal "Cannot read properties of undefined (reading
 * 'children')" crash. It fires when imported XFDF contains an <apref>
 * pointing at a PDF appearance object that no longer resolves in the XRef
 * table (a stale pointer left over from a previous revision or server-side
 * reprocessing). The rejection is thrown inside webviewer-core.min.js's own
 * Promise.all and never reaches our try/catch around importAnnotations, so
 * it has to be caught here. Only that specific rejection is silenced —
 * everything else passes through untouched.
 */
const useSuppressApryseChildrenError = () => {
  useEffect(() => {
    const handler = (event) => {
      const reason = event?.reason;
      if (
        reason instanceof TypeError &&
        typeof reason.message === "string" &&
        reason.message.includes("children") &&
        typeof reason.stack === "string" &&
        reason.stack.includes("webviewer-core.min.js")
      ) {
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handler);
    return () => window.removeEventListener("unhandledrejection", handler);
  }, []);
};

/**
 * Strip only the <apref> elements whose referenced PDF object no longer
 * exists in the document's XRef table — the root cause of the crash above.
 * Valid appearance references (including signed Sig fields, which rely
 * entirely on <apref> to render their visual) are preserved.
 *
 * @param {string} xfdfStr - XFDF string to clean
 * @param {object} [pdfDoc] - Apryse PDFDoc (documentViewer.getDocument().getPDFDoc()), requires fullAPI: true
 * @param {Array}  [userAnnotations] - userAnnotations state; used only in the
 *   no-pdfDoc fallback so <apref> on Sig-type fields isn't stripped
 * @returns {Promise<string>}
 */
export const stripInvalidAppearanceRefs = async (
  xfdfStr,
  pdfDoc,
  userAnnotations,
) => {
  const getSigFieldNames = () => {
    const sigNames = new Set();
    const parser = new DOMParser();
    (userAnnotations || []).forEach(({ xml }) => {
      (xml || []).forEach(({ ffield }) => {
        if (!ffield) return;
        try {
          const d = parser.parseFromString(ffield, "text/xml");
          const name = d.documentElement.getAttribute("name");
          const type = d.documentElement.getAttribute("type");
          if (name && type === "Sig") sigNames.add(name);
        } catch {
          /* ignore malformed ffield */
        }
      });
    });
    return sigNames;
  };

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xfdfStr, "text/xml");
    const aprefs = Array.from(doc.querySelectorAll("apref"));

    if (!aprefs.length) return xfdfStr;

    if (pdfDoc) {
      for (const apref of aprefs) {
        const objnum = parseInt(apref.getAttribute("objnum") ?? "0", 10);

        // PDF object 0 is the null/free object — never a valid appearance stream
        if (objnum === 0) {
          apref.remove();
          continue;
        }

        try {
          const obj = await pdfDoc.getXRefTableEntry(objnum);
          const missing =
            !obj || (typeof obj.isNull === "function" && (await obj.isNull()));
          if (missing) apref.remove();
        } catch {
          apref.remove();
        }
      }
      return new XMLSerializer().serializeToString(doc);
    }

    // No pdfDoc available — strip apref from non-Sig fields only (safe fallback).
    // When called without userAnnotations, sigFieldNames is empty and every
    // apref gets stripped, matching the plain "strip everything" fallback
    // used by the read-only viewer.
    const sigFieldNames = getSigFieldNames();
    doc.querySelectorAll("widget").forEach((widget) => {
      const fieldName = widget.getAttribute("field");
      if (!sigFieldNames.has(fieldName)) {
        widget.querySelectorAll("apref").forEach((node) => node.remove());
      }
    });

    return new XMLSerializer().serializeToString(doc);
  } catch {
    return xfdfStr; // parsing failed — return original unchanged
  }
};

/**
 * Shared Apryse WebViewer bootstrap for the SignatureFlow module
 * (signatureviewer.js, pendingSignatrue.js, ViewSignatureDocument.js).
 *
 * Owns the parts that were previously duplicated across all three:
 *   - WebViewer instantiation (path/fullAPI/licenseKey + per-mode overrides)
 *   - the double-init guard (StrictMode / effect re-run safe)
 *   - the Apryse "reading children" crash suppression
 *
 * Mode-specific behaviour (toolbar buttons, panels, locking, validation)
 * stays in each route component — this hook only owns the viewer lifecycle.
 */
const useApryseWebViewer = () => {
  const viewerRef = useRef(null);
  const [instance, setInstance] = useState(null);
  const initializedRef = useRef(false);

  useSuppressApryseChildrenError();

  /**
   * @param {object} [options] - extra/overriding WebViewer options,
   *   e.g. { showLocalFilePicker: true }
   * @returns {Promise<object|null>} the WebViewer instance, or null if
   *   already initialized / the container ref isn't mounted yet
   */
  const initWebViewer = useCallback(async (options = {}) => {
    if (initializedRef.current || !viewerRef.current) return null;
    initializedRef.current = true;

    const inst = await WebViewer(
      {
        path: "/webviewer/lib",
        fullAPI: true,
        licenseKey: process.env.REACT_APP_APRYSEKEY,
        ...options,
      },
      viewerRef.current,
    );

    setInstance(inst);
    return inst;
  }, []);

  return { viewerRef, instance, setInstance, initWebViewer, initializedRef };
};

export default useApryseWebViewer;
