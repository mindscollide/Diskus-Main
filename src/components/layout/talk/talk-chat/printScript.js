import { useEffect } from "react";

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
