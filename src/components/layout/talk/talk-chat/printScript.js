import { useEffect } from "react";

/**
 * @component PrintPage
 * @description Headless utility component that triggers the browser print
 * dialog for a downloaded chat file. When the Redux state contains a valid
 * file path from a DownloadChat response, an invisible iframe is appended to
 * the document body pointing to that file URL. Once the iframe loads, the
 * browser's native print dialog is invoked automatically. The component
 * renders nothing to the DOM (returns null).
 *
 * @param {string} filesUrlTalk - Base URL for Talk file assets, prepended to the file path.
 * @param {Object} talkStateData - The Talk Redux state slice; must contain
 *   `DownloadChatData.DownloadChatResponse.filePath` to trigger the print flow.
 */
const PrintPage = ({ filesUrlTalk, talkStateData }) => {
  useEffect(() => {
    if (
      talkStateData &&
      talkStateData.DownloadChatData &&
      talkStateData.DownloadChatData.DownloadChatResponse &&
      talkStateData.DownloadChatData.DownloadChatResponse.filePath
    ) {
      let fileDownloadURL =
        filesUrlTalk +
        talkStateData.DownloadChatData.DownloadChatResponse.filePath;

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = fileDownloadURL;

      iframe.onload = function () {
        setTimeout(() => {
          iframe.contentWindow.print();
        }, 1000); // Adjust the delay (in milliseconds) as needed
      };

      document.body.appendChild(iframe);
    }
  }, [filesUrlTalk, talkStateData?.DownloadChatData?.DownloadChatResponse]);

  return null;
};

export default PrintPage;
