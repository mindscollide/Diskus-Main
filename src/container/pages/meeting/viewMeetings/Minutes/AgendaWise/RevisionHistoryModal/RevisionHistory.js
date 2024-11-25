import React, { useState, useEffect } from "react";
import styles from "./RevisionHistory.module.css";
import { Col, Row } from "react-bootstrap";
import {
  Modal,
  AttachmentViewer,
} from "../../../../../../../components/elements";
import DropdownPurple from "./../../Images/Dropdown-Purple.png";
import EditIcon from "./../../Images/Edit-Icon.png";
import { useTranslation } from "react-i18next";
import EditCommentModal from "./EditCommentModal/EditComment";
import ConfirmationEditData from "./ConfirmationEdit/ConfirmationEdit";
import ResendMinuteReviewModal from "./ResendForReview/ResendReview";
import { newDateFormatForMinutes } from "../../../../../../../commen/functions/date_formater";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  GetDataForResendMinuteReview,
  currentMeetingMinutesToReview,
} from "../../../../../../../store/actions/Minutes_action";

const RevisionHistory = ({
  showRevisionHistory,
  setShowRevisionHistory,
  isAgenda,
  advanceMeetingModalID,
}) => {
  const { t } = useTranslation();

  const { GetMinuteReviewDetailsForOrganizerbyMinuteId } = useSelector(
    (state) => state.MinutesReducer
  );

  const { GetDataForResendMinuteReviewData } = useSelector(
    (state) => state.MinutesReducer
  );

  let currentLanguage = localStorage.getItem("i18nextLng");

  const navigate = useNavigate();

  const dispatch = useDispatch();

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
  const [revisionHistoryData, setRevisionHistoryData] = useState({
    mainMinute: null,
    minuteVersionHistory: [],
  });

  const [editMinuteData, setEditMinuteData] = useState(null);

  const [updateMinuteData, setUpdateMinutedata] = useState({
    MinuteID: 0,
    MinuteText: "",
  });

  const [minuteDate, setMinuteDate] = useState("");

  console.log(revisionHistoryData, "revisionHistoryDatarevisionHistoryData");
  const editMinuteFunction = (Editdata) => {
    console.log("editMinuteFunctioneditMinuteFunction", Editdata);
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
      MinuteID: Editdata.minuteID,
      IsAgenda: isAgenda,
    };
    dispatch(
      GetDataForResendMinuteReview(Data, navigate, t, setEditMinute, Editdata)
    );
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
        setRevisionHistoryData({
          mainMinute: GetMinuteReviewDetailsForOrganizerbyMinuteId.mainMinute,
          minuteVersionHistory:
            GetMinuteReviewDetailsForOrganizerbyMinuteId.minuteVersionHistory,
        });
      } catch (error) {}
    }
  }, [GetMinuteReviewDetailsForOrganizerbyMinuteId]);

  useEffect(() => {
    if (
      GetDataForResendMinuteReviewData !== null &&
      GetDataForResendMinuteReviewData !== undefined
    ) {
      setEditMinuteData(GetDataForResendMinuteReviewData.minuteBundle);
    }
  }, [GetDataForResendMinuteReviewData]);
  console.log(editMinute, "editMinuteeditMinuteeditMinuteeditMinute");
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
          ? "removeEditors"
          : "removeEditors FullScreenModal"
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
            editMinuteData={editMinuteData}
            updateMinuteData={updateMinuteData}
            setUpdateMinutedata={setUpdateMinutedata}
            minuteDate={minuteDate}
            setMinuteDate={setMinuteDate}
            isAgenda={isAgenda}
            showRevisionHistory={showRevisionHistory}
            setShowRevisionHistory={setShowRevisionHistory}
          />
        ) : confirmationEdit ? (
          <ConfirmationEditData
            editMinute={editMinute}
            setEditMinute={setEditMinute}
            confirmationEdit={confirmationEdit}
            setConfirmationEdit={setConfirmationEdit}
            resendMinuteForReview={resendMinuteForReview}
            setResendMinuteForReview={setResendMinuteForReview}
            editMinuteData={editMinuteData}
            updateMinuteData={updateMinuteData}
            setUpdateMinutedata={setUpdateMinutedata}
            minuteDate={minuteDate}
            setMinuteDate={setMinuteDate}
            isAgenda={isAgenda}
            showRevisionHistory={showRevisionHistory}
            setShowRevisionHistory={setShowRevisionHistory}
          />
        ) : resendMinuteForReview ? (
          <ResendMinuteReviewModal
            editMinute={editMinute}
            setEditMinute={setEditMinute}
            confirmationEdit={confirmationEdit}
            setConfirmationEdit={setConfirmationEdit}
            resendMinuteForReview={resendMinuteForReview}
            setResendMinuteForReview={setResendMinuteForReview}
            editMinuteData={editMinuteData}
            updateMinuteData={updateMinuteData}
            setUpdateMinutedata={setUpdateMinutedata}
            minuteDate={minuteDate}
            setMinuteDate={setMinuteDate}
            advanceMeetingModalID={advanceMeetingModalID}
            isAgenda={isAgenda}
            showRevisionHistory={showRevisionHistory}
            setShowRevisionHistory={setShowRevisionHistory}
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
                  {revisionHistoryData.mainMinute !== null && (
                    <div>
                      <>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <div
                              className={styles["reviewer-progress-wrapper"]}
                            >
                              <Row>
                                <Col lg={11} md={11} sm={12}>
                                  <div
                                    className={styles["reviewer-progress-text"]}
                                  >
                                    <p>
                                      {t("Total")}:{" "}
                                      {
                                        revisionHistoryData?.mainMinute
                                          ?.reviewStats?.totalReviews
                                      }
                                    </p>
                                    <span>|</span>
                                    <p>
                                      {t("Pending")}:{" "}
                                      {
                                        revisionHistoryData?.mainMinute
                                          ?.reviewStats?.pending
                                      }
                                    </p>
                                    <span>|</span>
                                    <p>
                                      {t("Accepted")}:{" "}
                                      {
                                        revisionHistoryData?.mainMinute
                                          ?.reviewStats?.accepted
                                      }
                                    </p>
                                    <span>|</span>
                                    <p>
                                      {t("Rejected")}:{" "}
                                      {
                                        revisionHistoryData?.mainMinute
                                          ?.reviewStats?.rejected
                                      }
                                    </p>
                                  </div>
                                </Col>
                                <Col
                                  lg={1}
                                  md={1}
                                  sm={12}
                                  className={
                                    currentLanguage === "ar"
                                      ? "text-start"
                                      : "text-end"
                                  }
                                >
                                  <img
                                    alt=""
                                    src={DropdownPurple}
                                    className={
                                      isDrawerOpen === "main"
                                        ? `${styles["Arrow"]} cursor-pointer`
                                        : `${styles["Arrow_Expanded"]} cursor-pointer`
                                    }
                                    onClick={() =>
                                      openCloseReviewerDetail("main")
                                    }
                                  />
                                </Col>
                              </Row>
                              {isDrawerOpen === "main" && (
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <p
                                      className={`${styles["text-wrapper-review"]}`}
                                    >
                                      <span
                                        className={styles["Review-pending"]}
                                      >
                                        Review Pending:
                                      </span>{" "}
                                      {revisionHistoryData?.mainMinute
                                        ?.reviewStats?.pendingUsers?.length >
                                        0 &&
                                        revisionHistoryData?.mainMinute?.reviewStats?.pendingUsers.map(
                                          (userName, index) =>
                                            index ===
                                            revisionHistoryData?.mainMinute
                                              ?.reviewStats?.pendingUsers
                                              ?.length -
                                              1
                                              ? `${userName}`
                                              : `${userName}, `
                                        )}
                                    </p>
                                    <p
                                      className={`${styles["text-wrapper-review"]}`}
                                    >
                                      <span
                                        className={styles["Review-accepted"]}
                                      >
                                        Review Accepted:
                                      </span>{" "}
                                      {revisionHistoryData?.mainMinute
                                        ?.reviewStats?.acceptedByUsers?.length >
                                        0 &&
                                        revisionHistoryData?.mainMinute?.reviewStats?.acceptedByUsers.map(
                                          (userName, index) =>
                                            index ===
                                            revisionHistoryData?.mainMinute
                                              ?.reviewStats?.acceptedByUsers
                                              ?.length -
                                              1
                                              ? `${userName}`
                                              : `${userName}, `
                                        )}
                                    </p>
                                    <p
                                      className={`${styles["text-wrapper-review"]}`}
                                    >
                                      <span
                                        className={styles["Review-declined"]}
                                      >
                                        Review Rejected:
                                      </span>{" "}
                                      {revisionHistoryData?.mainMinute
                                        ?.reviewStats?.rejectedByUsers?.length >
                                        0 &&
                                        revisionHistoryData?.mainMinute?.reviewStats?.rejectedByUsers.map(
                                          (userName, index) =>
                                            index ===
                                            revisionHistoryData?.mainMinute
                                              ?.reviewStats?.rejectedByUsers
                                              ?.length -
                                              1
                                              ? `${userName}`
                                              : `${userName}, `
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
                                V
                                {revisionHistoryData?.mainMinute?.versionNumber}
                              </span>
                            </div>

                            <div className={styles["uploaded-details"]}>
                              <Row className={styles["inherit-height"]}>
                                <Col lg={9} md={9} sm={12}>
                                  <p
                                    className={styles["minutes-text"]}
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        revisionHistoryData?.mainMinute
                                          ?.minutesDetails,
                                    }}
                                  ></p>
                                  <Row className="mt-1">
                                    {revisionHistoryData?.mainMinute
                                      ?.minuteAttachmentFiles.length > 0
                                      ? revisionHistoryData?.mainMinute?.minuteAttachmentFiles.map(
                                          (data, index) => {
                                            console.log(data, "datadatadata");
                                            return (
                                              <>
                                                <Col lg={3} md={3} sm={3}>
                                                  <AttachmentViewer
                                                    data={data}
                                                    id={data.pK_FileID}
                                                    name={data.displayFileName}
                                                    fk_UID={data.fK_UserID}
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
                                      </p>{" "}
                                      <img
                                        className={styles["edit-icon"]}
                                        src={EditIcon}
                                        alt=""
                                        onClick={() =>
                                          editMinuteFunction(
                                            revisionHistoryData?.mainMinute
                                          )
                                        }
                                      />
                                      {/* )} */}
                                      <div className={styles["gap-ti"]}>
                                        <img
                                          src={`data:image/jpeg;base64,${revisionHistoryData?.mainMinute?.userProfilePicture?.displayProfilePictureName}`}
                                          className={styles["Image"]}
                                          alt=""
                                          draggable={false}
                                        />
                                        <p className={styles["agendaCreater"]}>
                                          {
                                            revisionHistoryData?.mainMinute
                                              ?.userName
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
                                        {
                                          newDateFormatForMinutes(
                                            revisionHistoryData.mainMinute
                                              ?.lastUpdatedDate +
                                              revisionHistoryData.mainMinute
                                                ?.lastUpdatedTime
                                          )?.TimeVal
                                        }
                                        ,
                                      </p>
                                      <p className={styles["date-uploader"]}>
                                        {
                                          newDateFormatForMinutes(
                                            revisionHistoryData.mainMinute
                                              ?.lastUpdatedDate +
                                              revisionHistoryData.mainMinute
                                                ?.lastUpdatedTime
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
                        {revisionHistoryData.mainMinute.declinedReviews.length >
                          0 &&
                          revisionHistoryData.mainMinute.declinedReviews.map(
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
                                      <Row className={styles["inherit-height"]}>
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
                                                {t("Reviewed-by")}
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
                                                  {declineReviewData?.actorName}
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
                    </div>
                  )}

                  <div className={`${styles["barline"]} position-relative`}>
                    <span className={styles["barlinespan"]}></span>
                    {revisionHistoryData.minuteVersionHistory?.length > 0 &&
                      revisionHistoryData.minuteVersionHistory
                        ?.sort((a, b) => b.versionNumber - a.versionNumber)
                        .map((reviewData, index) => {
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
                                            {
                                              reviewData.reviewStats
                                                .totalReviews
                                            }
                                          </p>
                                          <span>|</span>
                                          <p>
                                            Pending:{" "}
                                            {reviewData.reviewStats.pending}
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
                                        </div>
                                      </Col>
                                      <Col
                                        lg={1}
                                        md={1}
                                        sm={12}
                                        className={
                                          currentLanguage === "ar"
                                            ? "text-start"
                                            : "text-end"
                                        }
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
                                                styles["Review-pending"]
                                              }
                                            >
                                              Review Pending:
                                            </span>{" "}
                                            {reviewData.reviewStats.pendingUsers
                                              .length > 0 &&
                                              reviewData.reviewStats.pendingUsers.map(
                                                (userName) => userName
                                              )}
                                          </p>
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
                                      styles[
                                        "version-control-wrapper-with-more"
                                      ]
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
                                              {t("Uploaded-by")}
                                            </p>{" "}
                                            {index === 0 && (
                                              <img
                                                className={styles["edit-icon"]}
                                                src={EditIcon}
                                                alt=""
                                                onClick={() =>
                                                  editMinuteFunction(reviewData)
                                                }
                                              />
                                            )}
                                            <div className={styles["gap-ti"]}>
                                              <img
                                                src={`data:image/jpeg;base64,${reviewData?.mainMinute?.userProfilePicture?.displayProfilePictureName}`}
                                                className={styles["Image"]}
                                                alt=""
                                                draggable={false}
                                              />
                                              <p
                                                className={
                                                  styles["agendaCreater"]
                                                }
                                              >
                                                {
                                                  reviewData?.mainMinute
                                                    ?.userName
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
                                                  reviewData.lastUpdatedDate +
                                                    reviewData.lastUpdatedTime
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
                                              styles[
                                                "uploaded-details-rejected"
                                              ]
                                            }
                                          >
                                            <Row
                                              className={
                                                styles["inherit-height"]
                                              }
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
                                                      {t("Reviewed-by")}
                                                    </p>
                                                    <div
                                                      className={
                                                        styles["gap-ti"]
                                                      }
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
                                                          styles[
                                                            "agendaCreater"
                                                          ]
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
