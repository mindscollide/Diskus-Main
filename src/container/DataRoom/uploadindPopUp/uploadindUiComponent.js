import { Progress, Space } from "antd";
import { Col, Row } from "react-bootstrap";
import styles from "../DataRoom.module.css";
import chevdown from "../../../assets/images/chevron_down_white.svg";
import chevronUp from "../../../assets/images/chevron_up.svg";
import { CircularProgressbar } from "react-circular-progressbar";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import Greentick from "../../../assets/images/Greentick.svg";
import ErrorIcon from "../../../assets/images/ErrorIcon.svg";
import folderColor from "../../../assets/images/folder_color.svg";
import { useTranslation } from "react-i18next";
import { getFileExtension, getIconSource } from "../SearchFunctionality/option";

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

  // Calculate total counts
  let totalFileListLength = 0;
  let totalUploadedFiles = 0;
  let totalObjectsToCount = 0;
  let percentageUploaded = 0;
  const dataArray = Object.values(tasksAttachments);

  if (Object.keys(detaUplodingForFOlder).length > 0) {
    // This code will run before the component renders
    for (const item of detaUplodingForFOlder) {
      if ((item.Uploading || item.Uploaded) && item.UploadCancel === false) {
        totalObjectsToCount += 1;
      }
      if ((item.Uploading || item.Uploaded) && item.UploadCancel === false) {
        totalFileListLength += item.FileList.length;
        totalUploadedFiles += item.UploadedAttachments;
      }
    }
  }
  if (Object.keys(dataArray).length > 0) {
    // This code will run before the component renders
    for (const item of dataArray) {
      if (
        (item.Uploading || item.Uploaded) &&
        item.UploadCancel === false &&
        item.UploadingError === false
      ) {
        totalObjectsToCount += 1;
        totalFileListLength += 1;
      }
      if (item.Uploaded) {
        totalUploadedFiles += 1;
      }
    }
  }
  percentageUploaded =
    totalFileListLength > 0
      ? Math.round((totalUploadedFiles / totalFileListLength) * 100)
      : 0;

  const item = totalObjectsToCount > 1 ? t("Items") : t("item");
  const itemCancel = detaUplodingForFOlder.length > 1 ? t("Items") : t("item");

  function isAnyUploadNotCanceled(data1, data2) {
    const combinedArray = [...data1, ...data2];
    // Check if any object in the combined array has UploadCancel set to true
    return combinedArray.some((obj) => obj.UploadCancel === true);
  }
  
  return (
    <>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className={
            collapes
              ? styles["Back_ground_For_uploader_active"]
              : styles["Back_ground_For_uploader_folder"]
          }
        >
          <Row>
            <Col lg={12} md={12} sm={12} className={styles["Blue_Strip"]}>
              <Row className="mt-2">
                <Col
                  lg={9}
                  md={9}
                  sm={9}
                  className="d-flex justify-content-start gap-3"
                >
                  {isAnyUploadNotCanceled(detaUplodingForFOlder, dataArray) ? (
                    <>
                      <span className={styles["Uploading"]}>
                        {`${detaUplodingForFOlder.length} ${itemCancel} ${t(
                          "Uploading-cancel"
                        )}`}
                      </span>
                    </>
                  ) : (
                    <>
                      {isNaN(percentageUploaded) === false &&
                      percentageUploaded < 100 ? (
                        <span className={styles["Uploading"]}>
                          {`${t("Uploading")} ${totalObjectsToCount} ${item}`}
                        </span>
                      ) : null}
                      {isNaN(percentageUploaded) === false &&
                      percentageUploaded === 100 ? (
                        <span className={styles["Uploading"]}>
                          {`${totalObjectsToCount} ${item} ${t("Uploaded")}`}
                        </span>
                      ) : null}
                      <Space className={styles["Progress_bar"]}>
                        {isNaN(percentageUploaded)
                          ? 0 + " %"
                          : percentageUploaded + " %"}
                      </Space>
                    </>
                  )}
                </Col>

                <Col
                  lg={3}
                  md={3}
                  sm={3}
                  className="d-flex justify-content-end gap-2 mt-1"
                >
                  {collapes ? (
                    <img
                      draggable="false"
                      src={chevronUp}
                      width={9}
                      alt=""
                      className="cursor-pointer"
                      onClick={() => setCollapes(false)}
                    />
                  ) : (
                    <img
                      draggable="false"
                      src={chevdown}
                      alt=""
                      width={9}
                      className="cursor-pointer"
                      onClick={() => setCollapes(true)}
                    />
                  )}
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
            {Object.values(detaUplodingForFOlder).length > 0
              ? detaUplodingForFOlder.map((data, index) => {
                  return (
                    <>
                      {(data.Uploaded !== true || data.UploadCancel) &&
                      data.NetDisconnect === false ? (
                        <Row key={index}>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className={styles["showUploadBar"]}
                          >
                            <Row>
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className="d-flex justify-content-between align-items-center gap-3"
                              >
                                <div className="d-flex align-items-center gap-3">
                                  <img
                                    draggable="false"
                                    src={folderColor}
                                    width={20}
                                    alt=""
                                  />
                                  <span> {data.FolderName}</span>
                                  {data.UploadCancel ? null : (
                                    <span>
                                      {`${data.UploadedAttachments}  ${"Of"}  ${
                                        data.FileList.length
                                      }  `}{" "}
                                    </span>
                                  )}
                                </div>

                                {data.UploadCancel
                                  ? t("Upload-canceled")
                                  : null}
                                {data.UploadCancel ? null : (
                                  <Col
                                    sm={3}
                                    md={3}
                                    lg={3}
                                    className={styles["progress_bar"]}
                                  >
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
                      ) : null}
                    </>
                  );
                })
              : null}
            {Object.values(dataArray).length > 0
              ? dataArray.map((data, index) => {
                  return (
                    <>
                      {(data.Uploaded !== true || data.UploadCancel) &&
                      data.UploadingError === false &&
                      data.NetDisconnect === false ? (
                        <Row key={index}>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            key={index}
                            className={`${"d-flex justify-content-between"} ${
                              styles["showUploadBarUploaded-file"]
                            }`}
                          >
                            <Space
                              direction="vertical"
                              className="d-flex  gap-3 flex-row"
                            >
                              <img
                                draggable="false"
                                src={getIconSource(
                                  getFileExtension(data.FileName)
                                )}
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
                            ) : data.Progress === 100 &&
                              data.UploadCancel !== true ? (
                              <img
                                draggable="false"
                                src={Greentick}
                                alt=""
                                className={styles["GreentickIcon_forfile"]}
                              />
                            ) : data.Progress < 100 ? (
                              <img
                                draggable="false"
                                src={CrossIcon}
                                width={"20px"}
                                height={"20px"}
                                alt=""
                                onClick={() => cancelFileUpload(data)}
                                className={styles["crossIcon-file"]}
                              />
                            ) : null}
                          </Col>
                          <Col sm={12} md={12} lg={12}>
                            {data.Progress < 100 &&
                              data.UploadCancel !== true && (
                                <div>
                                  <Progress percent={data.Progress} />
                                </div>
                              )}
                          </Col>
                        </Row>
                      ) : null}
                    </>
                  );
                })
              : null}
            {Object.values(detaUplodingForFOlder).length > 0
              ? detaUplodingForFOlder.map((data, index) => {
                  return (
                    <>
                      {(data.Uploaded === true &&
                        data.UploadCancel === false) ||
                      data.NetDisconnect === true ? (
                        <Row key={index}>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className={styles["showUploadBarUploaded"]}
                          >
                            <Row>
                              <Col
                                sm={9}
                                md={9}
                                lg={9}
                                className="d-flex align-items-center gap-3"
                              >
                                <img
                                  draggable="false"
                                  src={folderColor}
                                  width={20}
                                  alt=""
                                />
                                <span> {data.FolderName}</span>
                                <span>
                                  {`${data.UploadedAttachments}  ${"Of"}  ${
                                    data.FileList.length
                                  }  `}{" "}
                                </span>
                              </Col>
                              <Col
                                sm={3}
                                md={3}
                                lg={3}
                                className={styles["progress_bar"]}
                              >
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
                      ) : null}
                    </>
                  );
                })
              : null}
            {Object.values(dataArray).length > 0
              ? dataArray.map((data, index) => {
                  return (
                    <>
                      {(data.Uploaded === true ||
                        data.UploadingError === true ||
                        data.NetDisconnect === true) &&
                      data.UploadCancel === false ? (
                        <Row key={index}>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            key={index}
                            className={`${"d-flex justify-content-between"} ${
                              styles["showUploadBarUploaded"]
                            }`}
                          >
                            <Space
                              direction="vertical"
                              className="d-flex  gap-3 flex-row "
                            >
                              <img
                                draggable="false"
                                src={getIconSource(
                                  getFileExtension(data.FileName)
                                )}
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
                      ) : null}
                    </>
                  );
                })
              : null}
          </span>
        </Col>
      </Row>
    </>
  );
};
export default UploadindUiComponent;
