/**
 * @component Dragger
 * @description A drag-and-drop file upload zone built on top of the Ant Design
 * Upload.Dragger component. The native file list UI is suppressed so the parent
 * component can manage display. Upload progress is reported through the
 * `setProgress` callback, and the actual upload logic is delegated to the
 * `handleFileDraggerUploadRequest` custom request handler.
 *
 * @param {Function}    setProgress                    - Callback that receives the current upload percentage (0-100).
 * @param {Function}    handleFileDraggerUploadRequest - Custom request handler called by Ant Design when a file is dropped or selected.
 * @param {JSX.Element} Icon                           - Icon or content element rendered inside the drop zone.
 * @param {string}      className                      - Optional CSS class name applied to the Dragger element.
 * @returns {JSX.Element} A styled drag-and-drop upload area.
 */
import React from "react";
import { Upload } from "antd";

const Dragger = ({
  setProgress,
  handleFileDraggerUploadRequest,
  Icon,
  className,
}) => {
  const { Dragger } = Upload;

  return (
    <Dragger
      className={className}
      showUploadList={false}
      onProgress={(onprogress) => setProgress(onprogress.percent)}
      customRequest={handleFileDraggerUploadRequest}
    >
      {Icon}
    </Dragger>
  );
};

export default Dragger;
