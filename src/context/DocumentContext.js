import { createContext, useContext, useRef } from "react";

const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const documentApryseViewer = useRef(null);
  const signatureDocumentViewer = useRef(null);
  const pendingSignatureViewer = useRef(null);
  const SignedDocumentViewer = useRef(null);

  const changeApryseLanguage = async (lang) => {
  const viewers = [
    documentApryseViewer.current,
    signatureDocumentViewer.current,
    pendingSignatureViewer.current,
    SignedDocumentViewer.current,
  ];

  for (const viewer of viewers) {
    if (viewer) {
      await viewer.UI.setLanguage(lang);
    }
  }
};
  return (
    <DocumentContext.Provider
      value={{
        SignedDocumentViewer,
        pendingSignatureViewer,
        signatureDocumentViewer,
        documentApryseViewer,
        changeApryseLanguage
      }}>
      {children}
    </DocumentContext.Provider>
  );
};

// Fallback used outside a DocumentProvider (e.g. auth/2FA/public screens,
// where LanguageSelector is also rendered but there's no document viewer to
// update) — refs stay null forever and changeApryseLanguage is a no-op,
// instead of throwing and crashing those screens.
const noopApryseDocument = {
  SignedDocumentViewer: { current: null },
  pendingSignatureViewer: { current: null },
  signatureDocumentViewer: { current: null },
  documentApryseViewer: { current: null },
  changeApryseLanguage: async () => {},
};

export const useApryseDocument = () => {
  const context = useContext(DocumentContext);

  return context ?? noopApryseDocument;
};