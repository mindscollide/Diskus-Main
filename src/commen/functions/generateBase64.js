export const generateBase64FromBlob = async (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
};

export const convertDocumentintoBase64 = async (documentViewer) => {
  const doc = documentViewer.getDocument();
  const data = await doc.getFileData({}); // No xfdfString for annotations
  const arr = new Uint8Array(data);
  const blob = new Blob([arr], { type: "application/pdf" });
  let fileString;
  generateBase64FromBlob(blob)
    .then((base64String) => {
      fileString = base64String;
      
      // Here you can use the base64String as needed
    })
    .catch((error) => {
      console.error("Error generating base64 string:", error);
    });
  return fileString;
};

export const getfieldValue = (stringValue, value) => {
  const string = stringValue;
  const regex = `/${value}=\"([^\"]+)\"/;`;
  const match = string.match(regex);

  if (match && match[1]) {
    const nameValue = match[1];
    return nameValue;
    //      // Output: SignatureFormField 2
  } else {
    return null;
    //     
  }
};
