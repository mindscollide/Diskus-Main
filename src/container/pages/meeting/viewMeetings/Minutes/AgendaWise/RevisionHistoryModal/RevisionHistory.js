import React, { useState, useEffect, useRef } from "react";
import styles from "./RevisionHistory.module.css";
import { Container, Col, Row } from "react-bootstrap";
import {
  Modal,
  Button,
  AttachmentViewer,
} from "../../../../../../../components/elements";
import DropdownPurple from "./../../Images/Dropdown-Purple.png";
import EditIcon from "./../../Images/Edit-Icon.png";
import { useTranslation } from "react-i18next";
import DefaultAvatar from "./../../../../../../MinutesNewFlow/Images/avatar.png";
import EditCommentModal from "./EditCommentModal/EditComment";
import ConfirmationEditData from "./ConfirmationEdit/ConfirmationEdit";
import ResendMinuteReviewModal from "./ResendForReview/ResendReview";
import {
  _justShowDateformatBilling,
  newDateFormatForMinutes,
  newTimeFormaterAsPerUTCTalkDate,
  newTimeFormaterAsPerUTCTalkTime,
  utcConvertintoGMT,
} from "../../../../../../../commen/functions/date_formater";
import { useSelector } from "react-redux";

const RevisionHistory = ({ showRevisionHistory, setShowRevisionHistory }) => {
  const { t } = useTranslation();
  const { GetMinuteReviewDetailsForOrganizerbyMinuteId } = useSelector(
    (state) => state.MinutesReducer
  );
  let currentLanguage = localStorage.getItem("i18nextLng");

  const [reviewHistory, setReviewHistory] = useState([
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
  console.log(reviewHistory, "reviewHistoryreviewHistoryreviewHistory");

  const [editMinute, setEditMinute] = useState(false);
  const [confirmationEdit, setConfirmationEdit] = useState(false);
  const [resendMinuteForReview, setResendMinuteForReview] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(null);

  const editMinuteFunction = () => {
    if (editMinute === false) {
      setEditMinute(true);
    } else {
      setEditMinute(false);
    }
  };

  const openCloseReviewerDetail = (index) => {
    if (isDrawerOpen === index) {
      setIsDrawerOpen(null);
    } else {
      setIsDrawerOpen(index);
    }
  };

  useEffect(() => {
    if (GetMinuteReviewDetailsForOrganizerbyMinuteId !== null) {
      try {
        // if(GetMinuteReviewDetailsForOrganizerbyMinuteId.)
        console.log(
          GetMinuteReviewDetailsForOrganizerbyMinuteId,
          "GetMinuteReviewDetailsForOrganizerbyMinuteIdGetMinuteReviewDetailsForOrganizerbyMinuteId"
        );
      } catch (error) {}
    }
  }, [GetMinuteReviewDetailsForOrganizerbyMinuteId]);

  return (
    <Modal
      onHide={
        editMinute
          ? () => {
              setEditMinute(false);
              setConfirmationEdit(true);
              setResendMinuteForReview(false);
            }
          : confirmationEdit
          ? () => {
              setEditMinute(true);
              setConfirmationEdit(false);
              setResendMinuteForReview(false);
            }
          : () => setShowRevisionHistory(false)
      }
      show={true}
      className={
        editMinute || confirmationEdit || resendMinuteForReview
          ? ""
          : "FullScreenModal"
      }
      fullscreen={
        editMinute || confirmationEdit || resendMinuteForReview ? false : true
      }
      size={
        editMinute || confirmationEdit || resendMinuteForReview ? "md" : "lg"
      }
      ModalBody={
        editMinute ? (
          <EditCommentModal
            editMinute={editMinute}
            setEditMinute={setEditMinute}
            confirmationEdit={confirmationEdit}
            setConfirmationEdit={setConfirmationEdit}
            resendMinuteForReview={resendMinuteForReview}
            setResendMinuteForReview={setResendMinuteForReview}
          />
        ) : confirmationEdit ? (
          <ConfirmationEditData
            editMinute={editMinute}
            setEditMinute={setEditMinute}
            confirmationEdit={confirmationEdit}
            setConfirmationEdit={setConfirmationEdit}
            resendMinuteForReview={resendMinuteForReview}
            setResendMinuteForReview={setResendMinuteForReview}
          />
        ) : resendMinuteForReview ? (
          <ResendMinuteReviewModal
            editMinute={editMinute}
            setEditMinute={setEditMinute}
            confirmationEdit={confirmationEdit}
            setConfirmationEdit={setConfirmationEdit}
            resendMinuteForReview={resendMinuteForReview}
            setResendMinuteForReview={setResendMinuteForReview}
          />
        ) : (
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div className={styles["gap-subcomments"]}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <p className={styles["Parent-title-heading"]}>
                        {t("Revision-history")}
                      </p>
                    </Col>
                  </Row>
                  <div className={`${styles["barline"]} position-relative`}>
                    <span className={styles["barlinespan"]}></span>
                    {reviewHistory
                      .sort((a, b) => b.versionNumber - a.versionNumber)
                      .map((reviewData, index) => {
                        console.log(reviewData, "reviewDatareviewData");
                        return (
                          <>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <div
                                  className={
                                    styles["reviewer-progress-wrapper"]
                                  }
                                >
                                  <Row>
                                    <Col lg={11} md={11} sm={12}>
                                      <div
                                        className={
                                          styles["reviewer-progress-text"]
                                        }
                                      >
                                        <p>
                                          Total:{" "}
                                          {reviewData.reviewStats.totalReviews}
                                        </p>
                                        <span>|</span>
                                        <p>
                                          Accepted:{" "}
                                          {reviewData.reviewStats.accepted}
                                        </p>
                                        <span>|</span>
                                        <p>
                                          Rejected:{" "}
                                          {reviewData.reviewStats.rejected}
                                        </p>
                                        <span>|</span>
                                        <p>
                                          Pending:{" "}
                                          {reviewData.reviewStats.pending}
                                        </p>
                                      </div>
                                    </Col>
                                    <Col
                                      lg={1}
                                      md={1}
                                      sm={12}
                                      className="text-end"
                                    >
                                      <img
                                        alt=""
                                        src={DropdownPurple}
                                        className={
                                          isDrawerOpen === index
                                            ? `${styles["Arrow"]} cursor-pointer`
                                            : `${styles["Arrow_Expanded"]} cursor-pointer`
                                        }
                                        onClick={() =>
                                          openCloseReviewerDetail(index)
                                        }
                                      />
                                    </Col>
                                  </Row>
                                  {isDrawerOpen === index && (
                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <p
                                          className={`${styles["text-wrapper-review"]}`}
                                        >
                                          <span
                                            className={
                                              styles["Review-accepted"]
                                            }
                                          >
                                            Review Accepted:
                                          </span>{" "}
                                          {reviewData.reviewStats
                                            .acceptedByUsers.length > 0 &&
                                            reviewData.reviewStats.acceptedByUsers.map(
                                              (userName) => userName
                                            )}
                                        </p>
                                        <p
                                          className={`${styles["text-wrapper-review"]}`}
                                        >
                                          <span
                                            className={
                                              styles["Review-declined"]
                                            }
                                          >
                                            Review Rejected:
                                          </span>{" "}
                                          {reviewData.reviewStats
                                            .rejectedByUsers.length > 0 &&
                                            reviewData.reviewStats.rejectedByUsers.map(
                                              (userName) => userName
                                            )}
                                        </p>
                                        <p
                                          className={`${styles["text-wrapper-review"]}`}
                                        >
                                          <span
                                            className={styles["Review-pending"]}
                                          >
                                            Review Pending:
                                          </span>{" "}
                                          {reviewData.reviewStats.pendingUsers
                                            .length > 0 &&
                                            reviewData.reviewStats.pendingUsers.map(
                                              (userName) => userName
                                            )}
                                        </p>
                                      </Col>
                                    </Row>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="position-relative"
                              >
                                {/* First */}

                                <div
                                  className={
                                    styles["version-control-wrapper-with-more"]
                                  }
                                >
                                  <span className={styles["with-text"]}>
                                    V{reviewData.versionNumber}
                                  </span>
                                </div>

                                <div className={styles["uploaded-details"]}>
                                  <Row className={styles["inherit-height"]}>
                                    <Col lg={9} md={9} sm={12}>
                                      <p
                                        className={styles["minutes-text"]}
                                        dangerouslySetInnerHTML={{
                                          __html: reviewData.minutesDetails,
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
                                          <p
                                            className={styles["uploadedbyuser"]}
                                          >
                                            Uploaded By
                                          </p>{" "}
                                          {index === 0 && (
                                            <img
                                              className={styles["edit-icon"]}
                                              src={EditIcon}
                                              alt=""
                                              onClick={editMinuteFunction}
                                            />
                                          )}
                                          <div className={styles["gap-ti"]}>
                                            <img
                                              src={DefaultAvatar}
                                              className={styles["Image"]}
                                              alt=""
                                              draggable={false}
                                            />
                                            <p
                                              className={
                                                styles["agendaCreater"]
                                              }
                                            >
                                              Alex Rodriguez
                                            </p>
                                          </div>
                                        </Col>
                                      </Row>
                                      <Row
                                        className={`${styles["positioning-tb"]} m-0`}
                                      >
                                        <Col lg={12} md={12} sm={12}>
                                          <p
                                            className={styles["time-uploader"]}
                                          >
                                            {
                                              newDateFormatForMinutes(
                                                reviewData.lastUpdatedDate +
                                                  reviewData.lastUpdatedTime
                                              )?.TimeVal
                                            }
                                            ,
                                          </p>
                                          <p
                                            className={styles["date-uploader"]}
                                          >
                                            {
                                              newDateFormatForMinutes(
                                                reviewData.lastUpdatedDate +
                                                  reviewData.lastUpdatedTime
                                              )?.DateVal
                                            }
                                          </p>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                            {reviewData.declinedReviews.length > 0 &&
                              reviewData.declinedReviews.map(
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
                                          <Row
                                            className={styles["inherit-height"]}
                                          >
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
                                                    Reviewed by
                                                  </p>
                                                  <div
                                                    className={styles["gap-ti"]}
                                                  >
                                                    <img
                                                      src={DefaultAvatar}
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
                                                        declineReviewData?.actorName
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
                                                    {
                                                      newDateFormatForMinutes(
                                                        declineReviewData.modifiedOn
                                                      )?.TimeVal
                                                    }
                                                    ,
                                                  </p>
                                                  <p
                                                    className={
                                                      styles["date-uploader"]
                                                    }
                                                  >
                                                    {
                                                      newDateFormatForMinutes(
                                                        declineReviewData.modifiedOn
                                                      )?.DateVal
                                                    }
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
                              )}
                          </>
                        );
                      })}

                    {/* {openReviewerDetail === false ? (
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <div className={styles["reviewer-progress-wrapper"]}>
                            <Row>
                              <Col lg={11} md={11} sm={12}>
                                <div
                                  className={styles["reviewer-progress-text"]}
                                >
                                  <p className="m-0">Total: 03</p>
                                  <span>|</span>
                                  <p className="m-0">Accepted: 01</p>
                                  <span>|</span>
                                  <p className="m-0">Rejected: 01</p>
                                  <span>|</span>
                                  <p className="m-0">Pending: 01</p>
                                </div>
                              </Col>
                              <Col lg={1} md={1} sm={12} className="text-end">
                                <img
                                  alt=""
                                  src={DropdownPurple}
                                  className={
                                    openReviewerDetail
                                      ? `${styles["Arrow"]} cursor-pointer`
                                      : `${styles["Arrow_Expanded"]} cursor-pointer`
                                  }
                                  onClick={openCloseReviewerDetail}
                                />
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    ) : (
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <div className={styles["reviewer-progress-wrapper"]}>
                            <Row>
                              <Col lg={11} md={11} sm={12}>
                                <div
                                  className={styles["reviewer-progress-text"]}
                                >
                                  <p>Total: 03</p>
                                  <span>|</span>
                                  <p>Accepted: 01</p>
                                  <span>|</span>
                                  <p>Rejected: 01</p>
                                  <span>|</span>
                                  <p>Pending: 01</p>
                                </div>
                              </Col>
                              <Col lg={1} md={1} sm={12} className="text-end">
                                <img
                                  alt=""
                                  src={DropdownPurple}
                                  className={
                                    openReviewerDetail
                                      ? `${styles["Arrow"]} cursor-pointer`
                                      : `${styles["Arrow_Expanded"]} cursor-pointer`
                                  }
                                  onClick={openCloseReviewerDetail}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-accepted"]}>
                                    Review Accepted:
                                  </span>{" "}
                                  Alessandra Costa, Emily Davis, Matthew Jones,
                                  Christopher Martinez, Elizabeth Garcia, Olivia
                                  Nguyen, Ethan Patel, Madison Kim, Tyler Chen,
                                  Sophia Gupta, Mason Kumar, Ava Wong, Logan
                                  Singh, Jackson Li, Chloe Patel, Noah Patel,
                                  Lily Chang, Lucas Patel, Amelia Tran.
                                </p>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-declined"]}>
                                    Review Rejected:
                                  </span>{" "}
                                  Alex Rodriguez, Samantha Lee.
                                </p>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-pending"]}>
                                    Review Pending:
                                  </span>{" "}
                                  Sarah Jenkins, Joshua Clark, Megan Rodriguez,
                                  Brandon Young.
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    )}
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
                          <span className={styles["with-text"]}>V2.0</span>
                        </div>
                        <div className={styles["uploaded-details"]}>
                          <Row className={styles["inherit-height"]}>
                            <Col lg={9} md={9} sm={12}>
                              <p className={styles["minutes-text"]}>
                                Task updates: Design phase completed, moving to
                                development, discussed resource reallocation to
                                address delays and decided unknown unknown
                                printer took a galley of type a printer took a
                                galley of type a to hold daily check-ins for
                                quicker progress Design phase completed, moving
                                to development, discussed resource reallocation
                                to address delays and decided unknown unknown
                                printer took a galley of type a printer took a
                                galley of type a to hold daily check-ins for
                                quicker progress Design phase completed, moving
                                to development, discussed resource reallocation
                                to address delays and decided unknown unknown
                                printer took a galley of type a printer took a
                                galley of type a to update.
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
                                  <img
                                    className={styles["edit-icon"]}
                                    src={EditIcon}
                                    alt=""
                                    onClick={editMinuteFunction}
                                  />
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
                              <Row
                                className={`${styles["positioning-tb"]} m-0`}
                              >
                                <Col lg={12} md={12} sm={12}>
                                  <p className={styles["time-uploader"]}>
                                    4:00pm,
                                  </p>
                                  <p className={styles["date-uploader"]}>
                                    18th May, 2024
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                    {openReviewerDetail === false ? (
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <div className={styles["reviewer-progress-wrapper"]}>
                            <Row>
                              <Col lg={11} md={11} sm={12}>
                                <div
                                  className={styles["reviewer-progress-text"]}
                                >
                                  <p className="m-0">Total: 03</p>
                                  <span>|</span>
                                  <p className="m-0">Accepted: 01</p>
                                  <span>|</span>
                                  <p className="m-0">Rejected: 01</p>
                                  <span>|</span>
                                  <p className="m-0">Pending: 01</p>
                                </div>
                              </Col>
                              <Col lg={1} md={1} sm={12} className="text-end">
                                <img
                                  alt=""
                                  src={DropdownPurple}
                                  className={
                                    openReviewerDetail
                                      ? `${styles["Arrow"]} cursor-pointer`
                                      : `${styles["Arrow_Expanded"]} cursor-pointer`
                                  }
                                  onClick={openCloseReviewerDetail}
                                />
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    ) : (
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <div className={styles["reviewer-progress-wrapper"]}>
                            <Row>
                              <Col lg={11} md={11} sm={12}>
                                <div
                                  className={styles["reviewer-progress-text"]}
                                >
                                  <p>Total: 03</p>
                                  <span>|</span>
                                  <p>Accepted: 01</p>
                                  <span>|</span>
                                  <p>Rejected: 01</p>
                                  <span>|</span>
                                  <p>Pending: 01</p>
                                </div>
                              </Col>
                              <Col lg={1} md={1} sm={12} className="text-end">
                                <img
                                  alt=""
                                  src={DropdownPurple}
                                  className={
                                    openReviewerDetail
                                      ? `${styles["Arrow"]} cursor-pointer`
                                      : `${styles["Arrow_Expanded"]} cursor-pointer`
                                  }
                                  onClick={openCloseReviewerDetail}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-accepted"]}>
                                    Review Accepted:
                                  </span>{" "}
                                  Alessandra Costa, Emily Davis, Matthew Jones,
                                  Christopher Martinez, Elizabeth Garcia, Olivia
                                  Nguyen, Ethan Patel, Madison Kim, Tyler Chen,
                                  Sophia Gupta, Mason Kumar, Ava Wong, Logan
                                  Singh, Jackson Li, Chloe Patel, Noah Patel,
                                  Lily Chang, Lucas Patel, Amelia Tran.
                                </p>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-declined"]}>
                                    Review Rejected:
                                  </span>{" "}
                                  Alex Rodriguez, Samantha Lee.
                                </p>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-pending"]}>
                                    Review Pending:
                                  </span>{" "}
                                  Sarah Jenkins, Joshua Clark, Megan Rodriguez,
                                  Brandon Young.
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    )}
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
                          <span className={styles["with-text"]}>V1.0</span>
                        </div>
                        <div className={styles["uploaded-details"]}>
                          <Row className={styles["inherit-height"]}>
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
                                  <img
                                    className={styles["edit-icon"]}
                                    src={EditIcon}
                                    alt=""
                                    onClick={editMinuteFunction}
                                  />
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
                              <Row
                                className={`${styles["positioning-tb"]} m-0`}
                              >
                                <Col lg={12} md={12} sm={12}>
                                  <p className={styles["time-uploader"]}>
                                    4:00pm,
                                  </p>
                                  <p className={styles["date-uploader"]}>
                                    18th May, 2024
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row> */}
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )
      }
    />
  );
};

export default RevisionHistory;
