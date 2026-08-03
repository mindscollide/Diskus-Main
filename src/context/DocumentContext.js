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

export const useApryseDocument = () => {
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error("useApryseDocument must be used within a DocumentProvider");
  }

  return context;
};