import { Progress, Space } from "antd";
import { Col, Row } from "react-bootstrap";
import styles from "./uploadindUiComponent.module.css";
import chevdown from "../../../assets/images/chevron_down_white.svg";
import chevronUp from "../../../assets/images/chevron_up.svg";
import { CircularProgressbar } from "react-circular-progressbar";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import Greentick from "../../../assets/images/Greentick.svg";
import ErrorIcon from "../../../assets/images/ErrorIcon.svg";
import folderColor from "../../../assets/images/folder_color.svg";
import { useTranslation } from "react-i18next";
import { getFileExtension, getIconSource } from "../SearchFunctionality/option";
import { formatNumber } from "../../../commen/functions/utils";

/** A folder upload that's still in progress (or was just canceled). */
const FolderInProgressRow = ({ data, t, cancelUpload }) => {
  if (data.Uploaded === true && !data.UploadCancel) return null;
  if (data.NetDisconnect) return null;

  return (
    <Row>
      <Col sm={12} md={12} lg={12} className={styles["showUploadBar"]}>
        <Row>
          <Col
            sm={12}
            md={12}
            lg={12}
            className="d-flex justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <img draggable="false" src={folderColor} width={20} alt="" />
              <span className={styles["folderUploadName"]}> {data.FolderName}</span>
              {!data.UploadCancel && (
                <span className={styles["folderUpload_attachments"]}>
                  {`${formatNumber(data.UploadedAttachments)} ${t("Of")} ${formatNumber(
                    data.FileList.length,
                  )}`}
                </span>
              )}
            </div>

            {data.UploadCancel && t("Upload-canceled")}
            {!data.UploadCancel && (
              <Col sm={3} md={3} lg={3} className={styles["progress_bar"]}>
                <CircularProgressbar
                  value={data.UploadedAttachments}
                  maxValue={data.FileList.length}
                  className={styles["folderProgress"]}
                />
                <img
                  draggable="false"
                  src={CrossIcon}
                  alt=""
                  onClick={() => cancelUpload(data)}
                  className={styles["crossIcon"]}
                />
              </Col>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

/** A single file upload that's still in progress (or was just canceled). */
const FileInProgressRow = ({ data, t, cancelFileUpload }) => {
  if (data.Uploaded === true && !data.UploadCancel) return null;
  if (data.UploadingError || data.NetDisconnect) return null;

  return (
    <Row>
      <Col
        lg={12}
        md={12}
        sm={12}
        className={`d-flex justify-content-between ${styles["showUploadBarUploaded-file"]}`}>
        <Space direction="vertical" className="d-flex gap-3 flex-row">
          <img
            draggable="false"
            src={getIconSource(getFileExtension(data.FileName))}
            height="20px"
            alt=""
            width="20px"
            className={styles["Icon_in_Bar"]}
          />
          <span className={styles["name_of_life_in_Bar"]}>
            {`${data.FileName.substring(0, 28)}...`}
          </span>
        </Space>
        {data.UploadCancel ? (
          t("Upload-canceled")
        ) : data.Progress === 100 ? (
          <img
            draggable="false"
            src={Greentick}
            alt=""
            className={styles["GreentickIcon_forfile"]}
          />
        ) : (
          <img
            draggable="false"
            src={CrossIcon}
            width="20px"
            height="20px"
            alt=""
            onClick={() => cancelFileUpload(data)}
            className={styles["crossIcon-file"]}
          />
        )}
      </Col>
      <Col sm={12} md={12} lg={12}>
        {data.Progress < 100 && !data.UploadCancel && (
          <div>
            <Progress percent={data.Progress} />
          </div>
        )}
      </Col>
    </Row>
  );
};

/** A folder upload that finished (or hit a network disconnect). */
const FolderCompletedRow = ({ data, t }) => {
  const isDone = data.Uploaded === true && data.UploadCancel === false;
  if (!isDone && !data.NetDisconnect) return null;

  return (
    <Row>
      <Col sm={12} md={12} lg={12} className={styles["showUploadBarUploaded"]}>
        <Row>
          <Col sm={9} md={9} lg={9} className="d-flex align-items-center gap-3">
            <img draggable="false" src={folderColor} width={20} alt="" />
            <span className={styles["folderUploadName"]}> {data.FolderName}</span>
            <span className={styles["folderUpload_attachments"]}>
              {`${formatNumber(data.UploadedAttachments)} ${t("Of")} ${formatNumber(
                data.FileList.length,
              )}`}
            </span>
          </Col>
          <Col sm={3} md={3} lg={3} className={styles["progress_bar"]}>
            {data.NetDisconnect ? (
              <img
                draggable="false"
                src={ErrorIcon}
                alt=""
                className={styles["GreentickIcon_forfile"]}
              />
            ) : (
              <img
                draggable="false"
                src={Greentick}
                alt=""
                className={styles["GreentickIcon"]}
              />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

/** A single file upload that finished, failed, or hit a network disconnect. */
const FileCompletedRow = ({ data }) => {
  const isRelevant =
    (data.Uploaded === true || data.UploadingError === true || data.NetDisconnect === true) &&
    data.UploadCancel === false;
  if (!isRelevant) return null;

  return (
    <Row>
      <Col
        lg={12}
        md={12}
        sm={12}
        className={`d-flex justify-content-between ${styles["showUploadBarUploaded"]}`}>
        <Space direction="vertical" className="d-flex gap-3 flex-row">
          <img
            draggable="false"
            src={getIconSource(getFileExtension(data.FileName))}
            height="20px"
            alt=""
            width="20px"
            className={styles["Icon_in_Bar"]}
          />
          <span className={styles["name_of_life_in_Bar"]}>
            {`${data.FileName.substring(0, 28)}...`}
          </span>
        </Space>
        {data.UploadingError || data.NetDisconnect ? (
          <img
            draggable="false"
            src={ErrorIcon}
            alt=""
            className={styles["GreentickIcon_forfile"]}
          />
        ) : data.Progress === 100 ? (
          <img
            draggable="false"
            src={Greentick}
            alt=""
            className={styles["GreentickIcon_forfile"]}
          />
        ) : null}
      </Col>
    </Row>
  );
};

/** Counts in-flight/uploaded items across both the folder and file upload queues. */
const useUploadCounts = (folderUploads, fileUploads) => {
  let totalObjectsToCount = 0;
  let totalFileListLength = 0;
  let totalUploadedFiles = 0;

  for (const item of folderUploads) {
    if (item.UploadCancel === false && (item.Uploading || item.Uploaded)) {
      totalObjectsToCount += 1;
      totalFileListLength += item.FileList.length;
      totalUploadedFiles += item.UploadedAttachments;
    }
  }

  for (const item of fileUploads) {
    if (
      item.UploadCancel === false &&
      item.UploadingError === false &&
      (item.Uploading || item.Uploaded)
    ) {
      totalObjectsToCount += 1;
      totalFileListLength += 1;
    }
    if (item.Uploaded) {
      totalUploadedFiles += 1;
    }
  }

  const percentageUploaded =
    totalFileListLength > 0
      ? Math.round((totalUploadedFiles / totalFileListLength) * 100)
      : 0;

  return { totalObjectsToCount, percentageUploaded };
};

const hasAnyCanceledUpload = (folderUploads, fileUploads) =>
  [...folderUploads, ...fileUploads].some((item) => item.UploadCancel === true);

const UploadindUiComponent = ({
  detaUplodingForFOlder,
  tasksAttachments,
  setCollapes,
  cancelUpload,
  collapes,
  Cancellicon,
  CanceUpload,
  cancelFileUpload,
}) => {
  const { t } = useTranslation();

  const fileUploads = Object.values(tasksAttachments);
  const { totalObjectsToCount, percentageUploaded } = useUploadCounts(
    detaUplodingForFOlder,
    fileUploads,
  );

  const itemLabel = totalObjectsToCount > 1 ? t("Items") : t("item");
  const canceledItemLabel = detaUplodingForFOlder.length > 1 ? t("Items") : t("item");
  const anyCanceled = hasAnyCanceledUpload(detaUplodingForFOlder, fileUploads);

  return (
    <Row>
      <Col
        lg={12}
        md={12}
        sm={12}
        className={
          collapes
            ? styles["Back_ground_For_uploader_active"]
            : styles["Back_ground_For_uploader_folder"]
        }>
        <Row>
          <Col lg={12} md={12} sm={12} className={styles["Blue_Strip"]}>
            <Row className="mt-2">
              <Col lg={9} md={9} sm={9} className="d-flex justify-content-start gap-3">
                {anyCanceled ? (
                  <span className={styles["Uploading"]}>
                    {`${formatNumber(detaUplodingForFOlder.length)} ${canceledItemLabel} ${t("Uploading-cancel")}`}
                  </span>
                ) : (
                  <>
                    {!isNaN(percentageUploaded) && percentageUploaded < 100 && (
                      <span className={styles["Uploading"]}>
                        {`${t("Uploading")} ${formatNumber(totalObjectsToCount)} ${itemLabel}`}
                      </span>
                    )}
                    {!isNaN(percentageUploaded) && percentageUploaded === 100 && (
                      <span className={styles["Uploading"]}>
                        {`${formatNumber(totalObjectsToCount)} ${itemLabel} ${t("Uploaded")}`}
                      </span>
                    )}
                    <Space className={styles["Progress_bar"]}>
                      {formatNumber(isNaN(percentageUploaded) ? 0 : percentageUploaded)} %
                    </Space>
                  </>
                )}
              </Col>

              <Col lg={3} md={3} sm={3} className="d-flex justify-content-end gap-2 mt-1">
                <img
                  draggable="false"
                  src={collapes ? chevronUp : chevdown}
                  width={9}
                  alt=""
                  className="cursor-pointer"
                  onClick={() => setCollapes(!collapes)}
                />
                <img
                  draggable="false"
                  src={Cancellicon}
                  width={9}
                  alt=""
                  className="cursor-pointer"
                  onClick={CanceUpload}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <span className={styles["Scroller_bar_of_BarUploder_folder"]}>
          {detaUplodingForFOlder.map((data, index) => (
            <FolderInProgressRow key={index} data={data} t={t} cancelUpload={cancelUpload} />
          ))}
          {fileUploads.map((data, index) => (
            <FileInProgressRow
              key={index}
              data={data}
              t={t}
              cancelFileUpload={cancelFileUpload}
            />
          ))}
          {detaUplodingForFOlder.map((data, index) => (
            <FolderCompletedRow key={index} data={data} t={t} />
          ))}
          {fileUploads.map((data, index) => (
            <FileCompletedRow key={index} data={data} />
          ))}
        </span>
      </Col>
    </Row>
  );
};

export default UploadindUiComponent;
