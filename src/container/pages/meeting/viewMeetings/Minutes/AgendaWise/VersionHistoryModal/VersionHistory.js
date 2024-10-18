import React, { useState, useEffect } from "react";
import styles from "./VersionHistory.module.css";
import {
  Modal,
  Button,
  AttachmentViewer,
} from "../../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { newTimeFormaterForImportMeetingAgenda } from "../../../../../../../commen/functions/date_formater";
import { Col, Row } from "react-bootstrap";

const VersionHistory = ({ setShowVersionHistory }) => {
  const { t } = useTranslation();
  const { GetMinutesVersionHistorywithCommentsData } = useSelector(
    (state) => state.MinutesReducer
  );
  const [newVersionHistoryData, setNewVersionHistoryData] = useState({
    mainVersionHistory: null,
    minuteVersionHistory: [],
  });

  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (GetMinutesVersionHistorywithCommentsData !== null) {
      try {
        setNewVersionHistoryData({
          mainVersionHistory:
            GetMinutesVersionHistorywithCommentsData.mainMinute,
          minuteVersionHistory:
            GetMinutesVersionHistorywithCommentsData.minuteVersionHistory,
        });
      } catch (error) {}
    }
  }, [GetMinutesVersionHistorywithCommentsData]);

  const moreComments = () => {
    if (showComments === false) {
      setShowComments(true);
    } else {
      setShowComments(false);
    }
  };

  return (
    <Modal
      onHide={() => setShowVersionHistory(false)}
      show={true}
      className={"FullScreenModal"}
      fullscreen={true}
      closeButton={true}
      ModalBody={
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div className={styles["gap-subcomments"]}>
                {/* First */}
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <p className={styles["Parent-title-heading"]}>
                      {t("Version-history")}
                    </p>
                  </Col>
                </Row>
                {newVersionHistoryData.mainVersionHistory !== null && (
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="position-relative"
                      >
                        <div
                          className={
                            styles["version-control-wrapper-with-more"]
                          }
                        >
                          <span className={styles["with-text"]}>
                            V
                            {
                              newVersionHistoryData?.mainVersionHistory
                                ?.versionNumber
                            }
                          </span>
                        </div>
                        <div className={styles["uploaded-details"]}>
                          <Row>
                            <Col lg={9} md={9} sm={12}>
                              <p
                                className={styles["minutes-text"]}
                                dangerouslySetInnerHTML={{
                                  __html:
                                    newVersionHistoryData?.mainVersionHistory
                                      ?.minutesDetails,
                                }}
                              ></p>
                              <Row className="mt-1">
                                {newVersionHistoryData?.mainVersionHistory
                                  ?.minuteAttachmentFiles.length > 0
                                  ? newVersionHistoryData?.mainVersionHistory?.minuteAttachmentFiles.map(
                                      (data, index) => {
                                        console.log(data, "datadatadata");
                                        return (
                                          <>
                                            <Col lg={3} md={3} sm={3}>
                                              <AttachmentViewer
                                                name={data?.displayFileName}
                                                id={data?.pK_FileID}
                                                fk_UID={data?.fK_UserID}
                                                data={data}
                                              />
                                            </Col>
                                          </>
                                        );
                                      }
                                    )
                                  : null}
                              </Row>
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={12}
                              className="position-relative"
                            >
                              <Row className="m-0">
                                <Col lg={12} md={12} sm={12} className="p-0">
                                  <span className={styles["bar-line"]}></span>
                                  <p className={styles["uploadedbyuser"]}>
                                    {t("Uploaded-by")}
                                  </p>
                                  <div className={styles["gap-ti"]}>
                                    <img
                                      src={`data:image/jpeg;base64,${newVersionHistoryData?.mainVersionHistory?.userProfilePicture?.displayProfilePictureName}`}
                                      className={styles["Image"]}
                                      alt=""
                                      draggable={false}
                                    />
                                    <p className={styles["agendaCreater"]}>
                                      {
                                        newVersionHistoryData
                                          ?.mainVersionHistory?.userName
                                      }
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                              <Row
                                className={`${styles["positioning-tb"]} m-0`}
                              >
                                <Col lg={12} md={12} sm={12}>
                                  <p className={styles["time-uploader"]}>
                                    {newTimeFormaterForImportMeetingAgenda(
                                      newVersionHistoryData?.mainVersionHistory
                                        ?.lastUpdatedDate +
                                        newVersionHistoryData
                                          ?.mainVersionHistory?.lastUpdatedTime
                                    )}
                                  </p>
                                  {newVersionHistoryData?.mainVersionHistory
                                    ?.declinedReviews.length > 0 && (
                                    <Button
                                      text={
                                        showComments
                                          ? t("Hide-comments")
                                          : t("Show-comments")
                                      }
                                      className={styles["Reject-comment"]}
                                      onClick={moreComments}
                                    />
                                  )}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>

                    {newVersionHistoryData?.mainVersionHistory?.declinedReviews
                      .length > 0 && showComments
                      ? newVersionHistoryData?.mainVersionHistory?.declinedReviews.map(
                          (declineReviewData) => {
                            return (
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="position-relative"
                                >
                                  <div
                                    className={
                                      styles["version-control-wrapper"]
                                    }
                                  >
                                    <span></span>
                                  </div>
                                  <div
                                    className={
                                      styles["uploaded-details-rejected"]
                                    }
                                  >
                                    <Row>
                                      <Col lg={9} md={9} sm={12}>
                                        <p
                                          className={styles["minutes-text"]}
                                          dangerouslySetInnerHTML={{
                                            __html: declineReviewData.reason,
                                          }}
                                        ></p>
                                      </Col>
                                      <Col
                                        lg={3}
                                        md={3}
                                        sm={12}
                                        className="position-relative"
                                      >
                                        <Row className="m-0">
                                          <Col
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            className="p-0"
                                          >
                                            <span
                                              className={styles["bar-line"]}
                                            ></span>
                                            <p
                                              className={
                                                styles["uploadedbyuser"]
                                              }
                                            >
                                              {t("Commented-by")}
                                            </p>
                                            <div className={styles["gap-ti"]}>
                                              <img
                                                src={`data:image/jpeg;base64,${declineReviewData?.userProfilePicture?.displayProfilePictureName}`}
                                                className={styles["Image"]}
                                                alt=""
                                                draggable={false}
                                              />
                                              <p
                                                className={
                                                  styles["agendaCreater"]
                                                }
                                              >
                                                {declineReviewData.actorName}
                                              </p>
                                            </div>
                                          </Col>
                                        </Row>
                                        <Row
                                          className={`${styles["positioning-tb"]} m-0`}
                                        >
                                          <Col lg={12} md={12} sm={12}>
                                            <p
                                              className={
                                                styles["time-uploader"]
                                              }
                                            >
                                              {newTimeFormaterForImportMeetingAgenda(
                                                declineReviewData.modifiedOn
                                              )}
                                            </p>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            );
                          }
                        )
                      : null}
                  </>
                )}
                {newVersionHistoryData?.minuteVersionHistory?.length > 0 &&
                  newVersionHistoryData?.minuteVersionHistory
                    .sort((a, b) => b.versionNumber - a.versionNumber)
                    .map((versionData, index) => {
                      return (
                        <>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="position-relative"
                            >
                              <div
                                className={
                                  styles["version-control-wrapper-with-more"]
                                }
                              >
                                <span className={styles["with-text"]}>
                                  V{versionData.versionNumber}
                                </span>
                              </div>
                              <div className={styles["uploaded-details"]}>
                                <Row>
                                  <Col lg={9} md={9} sm={12}>
                                    <p
                                      className={styles["minutes-text"]}
                                      dangerouslySetInnerHTML={{
                                        __html: versionData.minutesDetails,
                                      }}
                                    ></p>
                                  </Col>
                                  <Col
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    className="position-relative"
                                  >
                                    <Row className="m-0">
                                      <Col
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        className="p-0"
                                      >
                                        <span
                                          className={styles["bar-line"]}
                                        ></span>
                                        <p className={styles["uploadedbyuser"]}>
                                          {t("Uploaded-by")}
                                        </p>
                                        <div className={styles["gap-ti"]}>
                                          <img
                                            src={`data:image/jpeg;base64,${newVersionHistoryData?.mainVersionHistory?.userProfilePicture?.displayProfilePictureName}`}
                                            className={styles["Image"]}
                                            alt=""
                                            draggable={false}
                                          />
                                          <p
                                            className={styles["agendaCreater"]}
                                          >
                                            {
                                              newVersionHistoryData
                                                ?.mainVersionHistory?.userName
                                            }
                                          </p>
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row
                                      className={`${styles["positioning-tb"]} m-0`}
                                    >
                                      <Col lg={12} md={12} sm={12}>
                                        <p className={styles["time-uploader"]}>
                                          {newTimeFormaterForImportMeetingAgenda(
                                            versionData.lastUpdatedDate +
                                              versionData.lastUpdatedTime
                                          )}
                                        </p>
                                        {versionData.declinedReviews.length >
                                          0 && (
                                          <Button
                                            text={
                                              showComments
                                                ? t("Hide-comments")
                                                : t("Show-comments")
                                            }
                                            className={styles["Reject-comment"]}
                                            onClick={moreComments}
                                          />
                                        )}
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </Row>

                          {versionData.declinedReviews.length > 0 &&
                          showComments
                            ? versionData.declinedReviews.map(
                                (declineReviewData, index) => {
                                  return (
                                    <Row>
                                      <Col
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        className="position-relative"
                                      >
                                        <div
                                          className={
                                            styles["version-control-wrapper"]
                                          }
                                        >
                                          <span></span>
                                        </div>
                                        <div
                                          className={
                                            styles["uploaded-details-rejected"]
                                          }
                                        >
                                          <Row>
                                            <Col lg={9} md={9} sm={12}>
                                              <p
                                                className={
                                                  styles["minutes-text"]
                                                }
                                                dangerouslySetInnerHTML={{
                                                  __html:
                                                    declineReviewData.reason,
                                                }}
                                              ></p>
                                            </Col>
                                            <Col
                                              lg={3}
                                              md={3}
                                              sm={12}
                                              className="position-relative"
                                            >
                                              <Row className="m-0">
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className="p-0"
                                                >
                                                  <span
                                                    className={
                                                      styles["bar-line"]
                                                    }
                                                  ></span>
                                                  <p
                                                    className={
                                                      styles["uploadedbyuser"]
                                                    }
                                                  >
                                                    {t("Commented-by")}
                                                  </p>
                                                  <div
                                                    className={styles["gap-ti"]}
                                                  >
                                                    <img
                                                      src={`data:image/jpeg;base64,${declineReviewData?.userProfilePicture?.displayProfilePictureName}`}
                                                      className={
                                                        styles["Image"]
                                                      }
                                                      alt=""
                                                      draggable={false}
                                                    />
                                                    <p
                                                      className={
                                                        styles["agendaCreater"]
                                                      }
                                                    >
                                                      {
                                                        declineReviewData.actorName
                                                      }
                                                    </p>
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row
                                                className={`${styles["positioning-tb"]} m-0`}
                                              >
                                                <Col lg={12} md={12} sm={12}>
                                                  <p
                                                    className={
                                                      styles["time-uploader"]
                                                    }
                                                  >
                                                    {newTimeFormaterForImportMeetingAgenda(
                                                      declineReviewData.modifiedOn
                                                    )}
                                                  </p>
                                                </Col>
                                              </Row>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  );
                                }
                              )
                            : null}
                        </>
                      );
                    })}
              </div>
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default VersionHistory;
