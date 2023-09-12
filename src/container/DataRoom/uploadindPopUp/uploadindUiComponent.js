import { Progress, Space } from "antd";
import { Col, Row } from "react-bootstrap";
import styles from "../DataRoom.module.css";
import featherfolder from "../../../assets/images/feather-folder.svg";
import chevdown from "../../../assets/images/chevron_down_white.svg";
import chevronUp from "../../../assets/images/chevron_up.svg";
import { CircularProgressbar } from "react-circular-progressbar";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import PDFICON from "../../../assets/images/pdf_icon.svg";
import { useTranslation } from "react-i18next";

const UploadindUiComponent = ({
  detaUplodingForFOlder,
  tasksAttachments,
  setCollapes,
  remainingTime,
  cancelUpload,
  collapes,
  closeSearchBar,
  Cancellicon,
  progress,
}) => {
  const { t } = useTranslation();

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
                  <span className={styles["Uploading"]}>
                    {`${t("Uploading")} ${tasksAttachments.length} ${t(
                      "items"
                    )}`}
                  </span>
                  <Space className={styles["Progress_bar"]}>
                    {parseInt(progress) + "%"}
                  </Space>
                  <Space className={styles["Progress_bar"]}>
                    {`${remainingTime} ${t("Sec-remaining")}`}
                  </Space>
                </Col>

                <Col
                  lg={3}
                  md={3}
                  sm={3}
                  className="d-flex justify-content-end gap-2 mt-1"
                >
                  {collapes ? (
                    <img
                      src={chevronUp}
                      width={9}
                      alt=""
                      className="cursor-pointer"
                      onClick={() => setCollapes(false)}
                    />
                  ) : (
                    <img
                      src={chevdown}
                      alt=""
                      width={9}
                      className="cursor-pointer"
                      onClick={() => setCollapes(true)}
                    />
                  )}
                  <img
                    src={Cancellicon}
                    width={9}
                    alt=""
                    className="cursor-pointer"
                    onClick={closeSearchBar}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <span className={styles["Scroller_bar_of_BarUploder_folder"]}>
            {Object.values(detaUplodingForFOlder).length > 0
              ? detaUplodingForFOlder.map((data, index) => {
                  return (
                    <Row key={index}>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className={styles["showUploadBar"]}
                      >
                        <Row>
                          <Col
                            sm={9}
                            md={9}
                            lg={9}
                            className="d-flex align-items-center gap-3"
                          >
                            <img src={featherfolder} width={20} alt="" />
                            <span> {data.FolderName}</span>
                            {data.UploadCancel ? (
                              t("Upload-canceled")
                            ) : (
                              <span>
                                {`${data.UploadedAttachments}  ${"Of"}  ${
                                  data.FileList.length
                                }  `}{" "}
                              </span>
                            )}
                          </Col>
                          {data.UploadCancel ? (
                            <></>
                          ) : (
                            <Col
                              sm={3}
                              md={3}
                              lg={3}
                              className={styles["progress_bar"]}
                            >
                              <CircularProgressbar
                                value={data.UploadedAttachments}
                                maxValue={data.FileList.length}
                                // text={`${percentage}%`}
                                className={styles["folderProgress"]}
                                // value={progress}
                              />
                              <img
                                src={CrossIcon}
                                alt=""
                                onClick={() => cancelUpload(data)}
                                className={styles["crossIcon"]}
                              />
                            </Col>
                          )}
                        </Row>
                      </Col>
                    </Row>
                  );
                })
              : null}
            {Object.values(tasksAttachments).length > 0
              ? tasksAttachments.map((data, index) => {
                  return (
                    <>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        key={index}
                        className="d-flex gap-1 mt-2 flex-column mb-3"
                      >
                        <Space direction="vertical" className="d-flex flex-row">
                          <img
                            src={PDFICON}
                            height="16px"
                            alt=""
                            width="16px"
                            className={styles["Icon_in_Bar"]}
                          />
                          <span className={styles["name_of_life_in_Bar"]}>
                            {data.name}
                          </span>
                        </Space>
                        {progress > 0 && <Progress percent={progress} />}
                      </Col>
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
