import React, { useState, useEffect, useRef } from "react";
import styles from "./VersionHistory.module.css";
import { Container, Col, Row } from "react-bootstrap";
import {
  Modal,
  Button,
  AttachmentViewer,
} from "../../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import DefaultAvatar from "./../../../../../../MinutesNewFlow/Images/avatar.png";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { newTimeFormaterForImportMeetingAgenda } from "../../../../../../../commen/functions/date_formater";

const VersionHistory = ({ showVersionHistory, setShowVersionHistory }) => {
  const { t } = useTranslation();
  const { GetMinutesVersionHistorywithCommentsData } = useSelector(
    (state) => state.MinutesReducer
  );
  const dispatch = useDispatch();
  const [newVersionHistoryData, setNewVersionHistoryData] = useState({
    mainVersionHistory: null,
    minuteVersionHistory: [],
  });
  const [verionHistoryData, setVersionHistoryData] = useState([
    {
      versionNumber: 1,
      minuteID: 129,
      minutesDetails: "<p>Agenda Wise minutes 1</p>",
      actionableBundleID: 218,
      lastUpdatedDate: "20240620",
      lastUpdatedTime: "140754",
      declinedReviews: [],
      reviewStats: {
        minuteVersionID: 1,
        totalReviews: 0,
        rejected: 0,
        accepted: 0,
        pending: 2,
        acceptedByUsers: [],
        rejectedByUsers: [],
        pendingUsers: ["Test User Diskus", "Stagging user test "],
      },
    },
    {
      versionNumber: 2,
      minuteID: 129,
      minutesDetails: "<p>Agenda Wise minutes 1 updated</p>",
      actionableBundleID: 256,
      lastUpdatedDate: "20240624",
      lastUpdatedTime: "095740",
      declinedReviews: [
        {
          fK_ActorBundlesStatus_ID: 260,
          fK_UID: 1270,
          fK_WorkFlowActor_ID: 105,
          fK_WorkFlowActionableBundle_ID: 256,
          fK_ActorBundlesStatusState_ID: 4,
          actorName: "Stagging user test ",
          reason: "Not Enough Info",
          modifiedOn: "20240624105753",
        },
      ],
      reviewStats: {
        minuteVersionID: 2,
        totalReviews: 0,
        rejected: 1,
        accepted: 0,
        pending: 1,
        acceptedByUsers: [],
        rejectedByUsers: ["Stagging user test "],
        pendingUsers: ["Test User Diskus"],
      },
    },
  ]);

  console.log(verionHistoryData, "verionHistoryDataverionHistoryData");

  console.log(
    GetMinutesVersionHistorywithCommentsData,
    "GetMinutesVersionHistorywithCommentsData"
  );

  let currentLanguage = localStorage.getItem("i18nextLng");

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
      console.log(
        GetMinutesVersionHistorywithCommentsData,
        "GetMinutesVersionHistorywithCommentsDataGetMinutesVersionHistorywithCommentsData"
      );
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
                                      // src={DefaultAvatar}
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
                                                // src={DefaultAvatar}
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
                                    <Row className="mt-1">
                                      {/* {fileAttachments.length > 0
                        ? fileAttachments.map((data, index) => {
                            console.log(data, "datadatadata");
                            return (
                              <> */}
                                      <Col lg={3} md={3} sm={3}>
                                        <AttachmentViewer
                                          // data={data}
                                          id={0}
                                          name={"DummyFile.pdf"}
                                          fk_UID={"1233"}
                                          // handleClickRemove={() => handleRemoveFile(data)}
                                        />
                                      </Col>
                                      <Col lg={3} md={3} sm={3}>
                                        <AttachmentViewer
                                          // data={data}
                                          id={0}
                                          name={"DummyFile.xls"}
                                          fk_UID={"1233"}
                                          // handleClickRemove={() => handleRemoveFile(data)}
                                        />
                                      </Col>
                                      <Col lg={3} md={3} sm={3}>
                                        <AttachmentViewer
                                          // data={data}
                                          id={0}
                                          name={"DummyFile.doc"}
                                          fk_UID={"1233"}
                                          // handleClickRemove={() => handleRemoveFile(data)}
                                        />
                                      </Col>
                                      {/* </>
                            );
                          })
                        : null} */}
                                    </Row>
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
                                            // src={DefaultAvatar}
                                            src={`data:image/jpeg;base64,${versionData?.userProfilePicture?.displayProfilePictureName}`}
                                            className={styles["Image"]}
                                            alt=""
                                            draggable={false}
                                          />
                                          <p
                                            className={styles["agendaCreater"]}
                                          >
                                            {versionData.userName}
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
                                                      // src={DefaultAvatar}
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

                {/* <Row>
                  <Col lg={12} md={12} sm={12} className="position-relative">
                    <div
                      className={styles["version-control-wrapper-with-more"]}
                    >
                      <span className={styles["with-text"]}>V2.0</span>
                    </div>
                    <div className={styles["uploaded-details"]}>
                      <Row>
                        <Col lg={9} md={9} sm={12}>
                          <p className={styles["minutes-text"]}>
                            Task updates: Design phase completed, moving to
                            development, discussed resource reallocation to
                            address delays and decided unknown unknown printer
                            took a galley of type a printer took a galley of
                            type a to hold daily check-ins for quicker progress
                            Design phase completed, moving to development,
                            discussed resource reallocation to address delays
                            and decided unknown unknown printer took a galley of
                            type a printer took a galley of type a to hold daily
                            check-ins for quicker progress Design phase
                            completed, moving to development, discussed resource
                            reallocation to address delays and decided unknown
                            unknown printer took a galley of type a printer took
                            a galley of type a to update.
                          </p>
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
                                Uploaded By
                              </p>
                              <div className={styles["gap-ti"]}>
                                <img
                                  src={DefaultAvatar}
                                  className={styles["Image"]}
                                  alt=""
                                  draggable={false}
                                />
                                <p className={styles["agendaCreater"]}>
                                  Alex Rodriguez
                                </p>
                              </div>
                            </Col>
                          </Row>
                          <Row className={`${styles["positioning-tb"]} m-0`}>
                            <Col lg={12} md={12} sm={12}>
                              <p className={styles["time-uploader"]}>
                                4:00pm, 18th May, 2024
                              </p>
                            
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={12} md={12} sm={12} className="position-relative">
                    <div
                      className={
                        styles["version-control-wrapper-last"]
                      }
                    >
                      <span className={styles["with-text"]}>V1.0</span>
                    </div>
                    <div className={styles["uploaded-details"]}>
                      <Row>
                        <Col lg={9} md={9} sm={12}>
                          <p className={styles["minutes-text"]}>
                            Task updates: Design phase completed, moving to
                            development, discussed resource reallocation
                          </p>
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
                                Uploaded By
                              </p>
                              <div className={styles["gap-ti"]}>
                                <img
                                  src={DefaultAvatar}
                                  className={styles["Image"]}
                                  alt=""
                                  draggable={false}
                                />
                                <p className={styles["agendaCreater"]}>
                                  Alex Rodriguez
                                </p>
                              </div>
                            </Col>
                          </Row>
                          <Row className={`${styles["positioning-tb"]} m-0`}>
                            <Col lg={12} md={12} sm={12}>
                              <p className={styles["time-uploader"]}>
                                4:00pm, 18th May, 2024
                              </p>
                           
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row> */}
              </div>
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default VersionHistory;
