const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function base64UrlToFile(base64Url, fileName, mimeType) {
  const byteCharacters = atob(base64Url.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new File(byteArrays, fileName, { type: mimeType });
}

const base64ToBlob = (base64, mimeType) => {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

const displayBlobAsHtml = (blob) => {
  const reader = new FileReader();

  reader.onload = function (event) {
    // Get the HTML content from the Blob
    const htmlContent = event.target.result;

    return htmlContent;
  };

  reader.readAsText(blob);
};
const openHtmlInNewPage = (htmlContent) => {
  // Open a new window
  const newWindow = window.open("", "_blank");

  // Write HTML content into the new window
  newWindow.document.open();
  newWindow.document.write(htmlContent);
};

export {
  getBase64,
  base64UrlToFile,
  base64ToBlob,
  displayBlobAsHtml,
  openHtmlInNewPage,
};
