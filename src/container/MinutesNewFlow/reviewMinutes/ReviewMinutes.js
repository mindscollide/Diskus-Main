import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // Importing translation hook
import styles from "./ReviewMinutes.module.css"; // Importing CSS module
import { useDispatch } from "react-redux"; // Importing Redux hook
import { useNavigate } from "react-router-dom"; // Importing navigation hook
import { Paper, Button } from "../../../components/elements";
import {
  reviewMinutesPage,
  pendingApprovalPage,
  rejectCommentModal,
  editCommentModal,
  deleteCommentModal,
  currentMeetingMinutesToReview,
  GetMinutesForReviewerByMeetingId,
} from "../../../store/actions/Minutes_action";
import DefaultAvatar from "./../Images/avatar.png";
import RejectCommentModal from "./rejectCommentModal/RejectCommentModal";
import EditCommentModal from "./editCommentModal/EditCommentModal";
import DeleteCommentModal from "./deleteCommentModal/DeleteCommentModal";
import { AllDocumentsForAgendaWiseMinutesApiFunc } from "../../../store/actions/NewMeetingActions.js";
import {
  convertDateToGMTMinute,
  convertToGMTMinuteTime,
} from "../../../commen/functions/time_formatter";

// Functional component for pending approvals section
const ReviewMinutes = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook
  const navigate = useNavigate(); // Navigation hook

  const { MinutesReducer, NewMeetingreducer } = useSelector((state) => state);

  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");

  const [reviewWrapperScroll, setReviewWrapperScroll] = useState(false);
  // const [demoData, setDemoData] = useState({
  //   workFlowID: 65,
  //   generalMinutes: [
  //     {
  //       generalMinutesVersionHistory: [],
  //       versionNumber: 1,
  //       minuteID: 86,
  //       meetingID: 0,
  //       minutesDetails: "<p>General Minutes 1 one</p>",
  //       userID: 954,
  //       actionableBundleID: 216,
  //       actorBundleStatusID: 3,
  //       reason: "",
  //       userName: "Ali Mamdani",
  //       lastUpdatedDate: "20240620",
  //       lastUpdatedTime: "140650",
  //       userProfilePicture: {
  //         userID: 954,
  //         orignalProfilePictureName: "20240614102831931.jpg",
  //         displayProfilePictureName: "20240614102831931.jpg",
  //       },
  //       minuteAttachmentFiles: [
  //         {
  //           minuteID: 86,
  //           pK_FileID: 3007,
  //           displayFileName: "featurewise_ids.pdf",
  //           diskusFileName: 2024060609035371313,
  //           diskusFileNameString: "",
  //           shareAbleLink: "2024060609035371313",
  //           fileSize: 0,
  //           fileSizeOnDisk: 0,
  //           fK_UserID: 954,
  //           fK_OrganizationID: 399,
  //           uriPath: null,
  //           fK_GAID: 0,
  //           createdDate: "",
  //           modifiedDate: "",
  //           modifiedByUser: "",
  //           openedDateTime: "",
  //           openedByUser: "",
  //           location: "",
  //           type: "",
  //           description: "",
  //         },
  //       ],
  //       declinedReviews: [],
  //     },
  //     {
  //       generalMinutesVersionHistory: [],
  //       versionNumber: 1,
  //       minuteID: 87,
  //       meetingID: 0,
  //       minutesDetails: "<p>General Minutes two </p>",
  //       userID: 954,
  //       actionableBundleID: 217,
  //       actorBundleStatusID: 2,
  //       reason: "",
  //       userName: "Ali Mamdani",
  //       lastUpdatedDate: "20240606",
  //       lastUpdatedTime: "090412",
  //       userProfilePicture: {
  //         userID: 954,
  //         orignalProfilePictureName: "20240614102831931.jpg",
  //         displayProfilePictureName: "20240614102831931.jpg",
  //       },
  //       minuteAttachmentFiles: [
  //         {
  //           minuteID: 87,
  //           pK_FileID: 3008,
  //           displayFileName: "SQA Assignment One (2).docx",
  //           diskusFileName: 2024060609041292090,
  //           diskusFileNameString: "",
  //           shareAbleLink: "2024060609041292090",
  //           fileSize: 0,
  //           fileSizeOnDisk: 0,
  //           fK_UserID: 954,
  //           fK_OrganizationID: 399,
  //           uriPath: null,
  //           fK_GAID: 0,
  //           createdDate: "",
  //           modifiedDate: "",
  //           modifiedByUser: "",
  //           openedDateTime: "",
  //           openedByUser: "",
  //           location: "",
  //           type: "",
  //           description: "",
  //         },
  //       ],
  //       declinedReviews: [],
  //     },
  //   ],
  //   agendaMinutes: [],
  //   agendaHierarchyList: [
  //     {
  //       pK_MAID: 3740,
  //       title: "Agenda Main One",
  //       childAgendas: [
  //         {
  //           pK_MAID: 3741,
  //           parentID: 3740,
  //           title: "Agenda Main One SubAgenda",
  //           parentTitle: "Agenda Main One",
  //         },
  //         {
  //           pK_MAID: 3742,
  //           parentID: 3740,
  //           title: "Subagenda Second ",
  //           parentTitle: "Agenda Main One",
  //         },
  //       ],
  //     },
  //     {
  //       pK_MAID: 3743,
  //       title: "Second Main agenda ",
  //       childAgendas: [
  //         {
  //           pK_MAID: 3744,
  //           parentID: 3743,
  //           title: "Second main subagenda ",
  //           parentTitle: "Second Main agenda ",
  //         },
  //       ],
  //     },
  //   ],
  // });

  const [minutesAgenda, setMinutesAgenda] = useState([]);
  const [minutesAgendaHierarchy, setMinutesAgendaHierarchy] = useState([]);
  const [minutesGeneral, setMinutesGeneral] = useState([]);
  const [minutesToReview, setMinutesToReview] = useState(0);

  const divRef = useRef(null);

  const countActorBundleStatusID2 = (data) => {
    let count = 0;
    // Traverse generalMinutes
    if (data.generalMinutes) {
      data.generalMinutes.forEach((minute) => {
        if (minute.actorBundleStatusID === 2) {
          count++;
        }
      });
    }
    // Traverse agendaMinutes
    if (data.agendaMinutes) {
      data.agendaMinutes.forEach((minute) => {
        if (minute.actorBundleStatusID === 2) {
          count++;
        }
        // Check version history in agendaMinutes
        if (minute.agendaMinutesVersionHistory) {
          minute.agendaMinutesVersionHistory.forEach((history) => {
            if (history.actorBundleStatusID === 2) {
              count++;
            }
          });
        }
      });
    }
    return count;
  };

  useEffect(() => {
    const div = divRef.current;

    if (div.scrollHeight > div.clientHeight) {
      console.log("Div has scroll");
      setReviewWrapperScroll(true);
    } else {
      console.log("Div doesn't have scroll");
      setReviewWrapperScroll(false);
    }
  }, []); // This effect runs once after the component mounts

  useEffect(() => {
    let allAgendaWiseDocs = {
      MDID: MinutesReducer?.currentMeetingMinutesToReviewData?.meetingID,
    };
    let Data = {
      MeetingID: MinutesReducer?.currentMeetingMinutesToReviewData?.meetingID,
    };
    dispatch(
      AllDocumentsForAgendaWiseMinutesApiFunc(navigate, allAgendaWiseDocs, t)
    );

    dispatch(GetMinutesForReviewerByMeetingId(Data, navigate, t));

    // return () => {
    //   dispatch(currentMeetingMinutesToReview(null));
    // };
  }, []);

  useEffect(() => {
    try {
      if (
        MinutesReducer.GetMinutesForReviewerByMeetingIdData !== null &&
        MinutesReducer.GetMinutesForReviewerByMeetingIdData !== undefined
      ) {
        let reducerData = MinutesReducer.GetMinutesForReviewerByMeetingIdData;
        setMinutesAgenda(reducerData.agendaMinutes);
        setMinutesAgendaHierarchy(reducerData.agendaHierarchyList);
        setMinutesGeneral(reducerData.generalMinutes);
        setMinutesToReview(countActorBundleStatusID2(reducerData));

        {
          // Initialize an empty array to hold the transformed data
          let transformedData = [];
          console.log("transformedDatatransformedData", transformedData);
          // Iterate through each parent agenda in the agenda hierarchy list
          minutesAgendaHierarchy.forEach((parentAgenda) => {
            // Find the parent agenda details in the agendaWiseMinutes array
            let parentAgendaMinutes = reducerData.agendaMinutes.filter(
              (minute) => minute.agendaID === parentAgenda.pK_MAID
            );

            // Initialize an array to hold sub-minutes of the parent agenda
            let subMinutes = [];
            // Iterate through each child agenda of the parent agenda
            parentAgenda.childAgendas.forEach((childAgenda) => {
              // Filter the minutes that match the child agenda ID and push to subMinutes
              let childMinutes = reducerData.agendaMinutes.filter(
                (minute) => minute.agendaID === childAgenda.pK_MAID
              );
              subMinutes.push(...childMinutes);
            });

            // Check if parent agenda details exist to determine if it's parent data
            let isParentData = parentAgendaMinutes.length > 0;

            // If there are parent agenda details or sub-minutes, create a parent agenda object
            if (isParentData || subMinutes.length > 0) {
              // If parent agenda details exist, use them, otherwise use childAgenda's parentTitle
              let agendaTitle = isParentData
                ? parentAgendaMinutes[0].agendaTitle
                : parentAgenda.childAgendas.find((childAgenda) =>
                    subMinutes.some(
                      (minute) => minute.agendaID === childAgenda.pK_MAID
                    )
                  )?.parentTitle || "";

              let parentAgendaObj = {
                agendaID: parentAgenda.pK_MAID,
                agendaTitle: agendaTitle,
                minuteData: parentAgendaMinutes.map((minute) => ({
                  agendaMinutesVersionHistory:
                    minute.agendaMinutesVersionHistory,
                  versionNumber: minute.versionNumber,
                  minuteID: minute.minuteID,
                  actionableBundleID: minute.actionableBundleID,
                  minutesDetails: minute.minutesDetails,
                  actorBundleStatusID: minute.actorBundleStatusID,
                  reason: minute.reason,
                  userID: minute.userID,
                  userName: minute.userName,
                  lastUpdatedDate: minute.lastUpdatedDate,
                  lastUpdatedTime: minute.lastUpdatedTime,
                  userProfilePicture: minute.userProfilePicture,
                  minuteAttachmentFiles: minute.minuteAttachmentFiles,
                  declinedReviews: minute.declinedReviews,
                })),
                subMinutes: parentAgenda.childAgendas.map((childAgenda) => {
                  let childMinutes = subMinutes.filter(
                    (minute) => minute.agendaID === childAgenda.pK_MAID
                  );
                  return {
                    agendaID: childAgenda.pK_MAID,
                    agendaTitle: childMinutes[0]?.agendaTitle || "",
                    minuteData: childMinutes.map((minute) => ({
                      agendaMinutesVersionHistory:
                        minute.agendaMinutesVersionHistory,
                      versionNumber: minute.versionNumber,
                      minuteID: minute.minuteID,
                      actionableBundleID: minute.actionableBundleID,
                      minutesDetails: minute.minutesDetails,
                      actorBundleStatusID: minute.actorBundleStatusID,
                      reason: minute.reason,
                      userID: minute.userID,
                      userName: minute.userName,
                      lastUpdatedDate: minute.lastUpdatedDate,
                      lastUpdatedTime: minute.lastUpdatedTime,
                      userProfilePicture: minute.userProfilePicture,
                      minuteAttachmentFiles: minute.minuteAttachmentFiles,
                      declinedReviews: minute.declinedReviews,
                    })),
                  };
                }),
              };

              // Push the parent agenda object to the transformed data array
              transformedData.push(parentAgendaObj);
            }
          });
          console.log("transformedDatatransformedData", transformedData);

          // Update attachments in transformedData based on data state
          console.log("transformedDatatransformedData", transformedData);

          transformedData.forEach((agenda) => {
            agenda.minuteData.forEach((minute) => {
              // Find matching entry in data state by pK_MeetingAgendaMinutesID
              let matchingData =
                NewMeetingreducer.getallDocumentsForAgendaWiseMinutes.data.find(
                  (entry) => entry.pK_MeetingAgendaMinutesID === minute.minuteID
                );

              // If matchingData found, update attachments in minuteData
              if (matchingData) {
                minute.attachments = matchingData.files || [];
              }
            });

            agenda.subMinutes.forEach((subAgenda) => {
              subAgenda.minuteData.forEach((minute) => {
                // Find matching entry in data state by pK_MeetingAgendaMinutesID
                let matchingData =
                  NewMeetingreducer.getallDocumentsForAgendaWiseMinutes.data.find(
                    (entry) =>
                      entry.pK_MeetingAgendaMinutesID === minute.minuteID
                  );

                // If matchingData found, update attachments in minuteData
                if (matchingData) {
                  minute.attachments = matchingData.files || [];
                }
              });
            });
          });
          console.log("transformedDatatransformedData", transformedData);

          // Log the transformed data to the console
          setMinutesAgenda(transformedData);
          console.log("transformedDatatransformedData", transformedData);
        }
      } else {
        setMinutesAgenda([]);
        setMinutesAgendaHierarchy([]);
        setMinutesGeneral([]);
        setMinutesToReview([]);
        console.log("transformedDatatransformedData");
      }
    } catch (error) {
      console.log("transformedDatatransformedData", error);
    }
  }, [MinutesReducer.GetMinutesForReviewerByMeetingIdData]);

  console.log("MinutesReducerMinutesReducer", MinutesReducer);

  return (
    <section className={styles["pendingApprovalContainer"]}>
      {/* Container for pending approval section */}
      <Row className="my-3 d-flex align-items-center">
        <Col sm={12} md={12} lg={12}>
          <span className={styles["pendingApprovalHeading"]}>
            {MinutesReducer.currentMeetingMinutesToReviewData.title}
          </span>
        </Col>
      </Row>
      <Paper className={styles["pendingApprovalPaper"]}>
        {/* Paper component for styling */}
        <div className={styles["main-wrapper"]}>
          <Row className="py-3 mx-50">
            <Col sm={12} md={6} lg={6}>
              <span className={styles["pendingApprovalHeading"]}>
                {t("Review Minutes")}
              </span>
            </Col>
            <Col
              sm={12}
              md={6}
              lg={6}
              className="justify-content-end d-flex align-items-center"
            >
              <span className={styles["No-of-reviews"]}>
                {t("Remaining-minutes-to-review") + minutesToReview}
              </span>
              <Button text={t("Accept All")} className={styles["Accept-all"]} />
            </Col>
          </Row>
          <div
            className={
              reviewWrapperScroll
                ? styles["review-minutes-wrapper-scroll"]
                : styles["review-minutes-wrapper"]
            }
            ref={divRef}
          >
            {/* CONTENT */}
            {minutesAgenda.map((data, index) => {
              return (
                <>
                  <Row className="mx-50">
                    <Col lg={12} md={12} sm={12}>
                      <p className={styles["Parent-title-heading"]}>
                        {data.agendaTitle}
                      </p>
                    </Col>
                  </Row>
                  <>
                    {data.minuteData.map((parentMinutedata, index) => {
                      return (
                        <>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="position-relative"
                            >
                              {parentMinutedata.agendaMinutesVersionHistory
                                .length === 0 ? null : (
                                <div
                                  className={
                                    styles["version-control-wrapper-with-more"]
                                  }
                                >
                                  <span className={styles["with-text"]}>
                                    {parentMinutedata.versionNumber}.0
                                  </span>
                                </div>
                              )}
                              <div
                                className={
                                  parentMinutedata.actorBundleStatusID === 3
                                    ? styles["uploaded-details-accepted"]
                                    : parentMinutedata.actorBundleStatusID === 4
                                    ? styles["uploaded-details-rejected"]
                                    : styles["uploaded-details"]
                                }
                              >
                                <Row className={styles["inherit-height"]}>
                                  <Col lg={8} md={8} sm={12}>
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: parentMinutedata.minutesDetails,
                                      }}
                                      className={styles["minutes-text"]}
                                    ></p>
                                  </Col>
                                  <Col
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    className="position-relative"
                                  >
                                    <Row className="m-0">
                                      <Col
                                        lg={6}
                                        md={6}
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
                                            src={`data:image/jpeg;base64,${parentMinutedata?.userProfilePicture?.displayProfilePictureName}`}
                                            className={styles["Image"]}
                                            alt=""
                                            draggable={false}
                                          />
                                          <p
                                            className={styles["agendaCreater"]}
                                          >
                                            {parentMinutedata.userName}
                                          </p>
                                        </div>
                                      </Col>
                                      <Col
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        className="d-grid justify-content-end p-0"
                                      >
                                        {parentMinutedata.actorBundleStatusID ===
                                        3 ? (
                                          <Button
                                            text={t("Accepted")}
                                            className={
                                              styles["Accepted-comment"]
                                            }
                                            disableBtn={true}
                                          />
                                        ) : parentMinutedata.actorBundleStatusID ===
                                          2 ? (
                                          <Button
                                            text={t("Accept")}
                                            className={styles["Accept-comment"]}
                                          />
                                        ) : parentMinutedata.actorBundleStatusID ===
                                          4 ? (
                                          <Button
                                            text={t("Accept")}
                                            className={styles["Reject-comment"]}
                                          />
                                        ) : null}

                                        {parentMinutedata.actorBundleStatusID ===
                                        3 ? (
                                          <Button
                                            text={t("Reject")}
                                            className={styles["Reject-comment"]}
                                            disableBtn={true}
                                          />
                                        ) : parentMinutedata.actorBundleStatusID ===
                                          2 ? (
                                          <Button
                                            text={t("Reject")}
                                            className={styles["Reject-comment"]}
                                            onClick={() =>
                                              dispatch(rejectCommentModal(true))
                                            }
                                          />
                                        ) : parentMinutedata.actorBundleStatusID ===
                                          4 ? (
                                          <>
                                            <Button
                                              text={t("Rejected")}
                                              className={
                                                styles["Rejected-comment"]
                                              }
                                            />

                                            <Button
                                              text={t("Hide-comment")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                              onClick={() =>
                                                dispatch(
                                                  rejectCommentModal(true)
                                                )
                                              }
                                            />
                                          </>
                                        ) : null}
                                      </Col>
                                    </Row>

                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <p className={styles["time-uploader"]}>
                                          {convertToGMTMinuteTime(
                                            parentMinutedata.lastUpdatedTime
                                          )}
                                          ,
                                        </p>
                                        <p className={styles["date-uploader"]}>
                                          {convertDateToGMTMinute(
                                            parentMinutedata.lastUpdatedDate
                                          )}
                                        </p>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                          {parentMinutedata.agendaMinutesVersionHistory
                            .slice()
                            .reverse()
                            .map((historyData, index) => {
                              return (
                                <>
                                  <Row>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="position-relative"
                                    >
                                      {historyData.declinedReviews.length ===
                                      0 ? (
                                        <div
                                          className={
                                            index === 0
                                              ? styles[
                                                  "version-control-wrapper-with-more"
                                                ]
                                              : styles[
                                                  "version-control-wrapper-with-more-last"
                                                ]
                                          }
                                        >
                                          <span className={styles["with-text"]}>
                                            {historyData.versionNumber}.0
                                          </span>
                                        </div>
                                      ) : (
                                        <div
                                          className={
                                            index === 0
                                              ? styles[
                                                  "version-control-wrapper"
                                                ]
                                              : styles[
                                                  "version-control-wrapper-last"
                                                ]
                                          }
                                        ></div>
                                      )}
                                      <div
                                        className={
                                          historyData.actorBundleStatusID === 3
                                            ? styles[
                                                "uploaded-details-accepted"
                                              ]
                                            : historyData.actorBundleStatusID ===
                                                4 &&
                                              historyData.declinedReviews
                                                .length === 0
                                            ? styles[
                                                "uploaded-details-rejected"
                                              ]
                                            : styles["uploaded-details"]
                                        }
                                      >
                                        <Row
                                          className={styles["inherit-height"]}
                                        >
                                          <Col lg={8} md={8} sm={12}>
                                            <p
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  historyData.minutesDetails,
                                              }}
                                              className={styles["minutes-text"]}
                                            ></p>
                                          </Col>
                                          <Col
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            className="position-relative"
                                          >
                                            <Row className="m-0">
                                              <Col
                                                lg={6}
                                                md={6}
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
                                                  {historyData.declinedReviews
                                                    .length === 0
                                                    ? t("Uploaded-by")
                                                    : t("Reviewed-by")}
                                                </p>
                                                <div
                                                  className={styles["gap-ti"]}
                                                >
                                                  <img
                                                    src={`data:image/jpeg;base64,${minutesAgenda[0].userProfilePicture.displayProfilePictureName}`}
                                                    className={styles["Image"]}
                                                    alt=""
                                                    draggable={false}
                                                  />
                                                  <p
                                                    className={
                                                      styles["agendaCreater"]
                                                    }
                                                  >
                                                    {minutesAgenda[0].userName}
                                                  </p>
                                                </div>
                                              </Col>
                                              {historyData.declinedReviews
                                                .length === 0 ? (
                                                <Col
                                                  lg={6}
                                                  md={6}
                                                  sm={12}
                                                  className="d-grid justify-content-end p-0"
                                                >
                                                  {historyData.actorBundleStatusID ===
                                                  3 ? (
                                                    <Button
                                                      text={t("Accepted")}
                                                      className={
                                                        styles[
                                                          "Accepted-comment"
                                                        ]
                                                      }
                                                      disableBtn={true}
                                                    />
                                                  ) : historyData.actorBundleStatusID ===
                                                    2 ? (
                                                    <Button
                                                      text={t("Accept")}
                                                      className={
                                                        styles["Accept-comment"]
                                                      }
                                                    />
                                                  ) : historyData.actorBundleStatusID ===
                                                    4 ? (
                                                    <Button
                                                      text={t("Accept")}
                                                      className={
                                                        styles["Reject-comment"]
                                                      }
                                                    />
                                                  ) : null}

                                                  {historyData.actorBundleStatusID ===
                                                  3 ? (
                                                    <Button
                                                      text={t("Reject")}
                                                      className={
                                                        styles["Reject-comment"]
                                                      }
                                                      disableBtn={true}
                                                    />
                                                  ) : historyData.actorBundleStatusID ===
                                                    2 ? (
                                                    <Button
                                                      text={t("Reject")}
                                                      className={
                                                        styles["Reject-comment"]
                                                      }
                                                      onClick={() =>
                                                        dispatch(
                                                          rejectCommentModal(
                                                            true
                                                          )
                                                        )
                                                      }
                                                    />
                                                  ) : historyData.actorBundleStatusID ===
                                                    4 ? (
                                                    <>
                                                      <Button
                                                        text={t("Rejected")}
                                                        className={
                                                          styles[
                                                            "Rejected-comment"
                                                          ]
                                                        }
                                                      />

                                                      <Button
                                                        text={t("Hide-comment")}
                                                        className={
                                                          styles[
                                                            "Reject-comment"
                                                          ]
                                                        }
                                                        onClick={() =>
                                                          dispatch(
                                                            rejectCommentModal(
                                                              true
                                                            )
                                                          )
                                                        }
                                                      />
                                                    </>
                                                  ) : null}
                                                </Col>
                                              ) : (
                                                <Col
                                                  lg={6}
                                                  md={6}
                                                  sm={12}
                                                  className="d-grid justify-content-end p-0"
                                                >
                                                  <Button
                                                    onClick={() =>
                                                      dispatch(
                                                        editCommentModal(true)
                                                      )
                                                    }
                                                    text={t("Edit")}
                                                    className={
                                                      styles["Reject-comment"]
                                                    }
                                                  />
                                                  <Button
                                                    onClick={() =>
                                                      dispatch(
                                                        deleteCommentModal(true)
                                                      )
                                                    }
                                                    text={t("Delete")}
                                                    className={
                                                      styles["Reject-comment"]
                                                    }
                                                  />
                                                </Col>
                                              )}
                                            </Row>

                                            <Row>
                                              <Col lg={12} md={12} sm={12}>
                                                <p
                                                  className={
                                                    styles["time-uploader"]
                                                  }
                                                >
                                                  {convertToGMTMinuteTime(
                                                    historyData.lastUpdatedTime
                                                  )}
                                                  ,
                                                </p>
                                                <p
                                                  className={
                                                    styles["date-uploader"]
                                                  }
                                                >
                                                  {convertDateToGMTMinute(
                                                    historyData.lastUpdatedDate
                                                  )}
                                                </p>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </Row>
                                      </div>
                                    </Col>
                                  </Row>
                                </>
                              );
                            })}
                        </>
                      );
                    })}

                    {data.subMinutes.map((subMinuteData, subMinuteIndex) => {
                      return (
                        <div>
                          {subMinuteData.minuteData.length === 0 ? null : (
                            <Row className="mx-50">
                              <Col lg={12} md={12} sm={12}>
                                <p className={styles["SUB-title-heading"]}>
                                  {index +
                                    1 +
                                    "." +
                                    subMinuteIndex +
                                    1 +
                                    " " +
                                    subMinuteData.agendaTitle}
                                </p>
                              </Col>
                            </Row>
                          )}
                          {subMinuteData.minuteData.map(
                            (minuteDataSubminute) => {
                              return (
                                <>
                                  <Row className="mxl-50">
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="position-relative"
                                    >
                                      {minuteDataSubminute
                                        .agendaMinutesVersionHistory.length ===
                                      0 ? null : (
                                        <div
                                          className={
                                            styles[
                                              "version-control-wrapper-with-more"
                                            ]
                                          }
                                        >
                                          <span className={styles["with-text"]}>
                                            {minuteDataSubminute.versionNumber}
                                            .0
                                          </span>
                                        </div>
                                      )}
                                      <div
                                        className={
                                          minuteDataSubminute.actorBundleStatusID ===
                                          3
                                            ? styles[
                                                "uploaded-details-accepted"
                                              ]
                                            : minuteDataSubminute.actorBundleStatusID ===
                                              4
                                            ? styles[
                                                "uploaded-details-rejected"
                                              ]
                                            : styles["uploaded-details"]
                                        }
                                      >
                                        <Row
                                          className={styles["inherit-height"]}
                                        >
                                          <Col lg={8} md={8} sm={12}>
                                            <p
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  minuteDataSubminute.minutesDetails,
                                              }}
                                              className={styles["minutes-text"]}
                                            ></p>
                                          </Col>
                                          <Col
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            className="position-relative"
                                          >
                                            <Row className="m-0">
                                              <Col
                                                lg={6}
                                                md={6}
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
                                                </p>
                                                <div
                                                  className={styles["gap-ti"]}
                                                >
                                                  <img
                                                    src={`data:image/jpeg;base64,${minuteDataSubminute?.userProfilePicture?.displayProfilePictureName}`}
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
                                                      minuteDataSubminute.userName
                                                    }
                                                  </p>
                                                </div>
                                              </Col>
                                              <Col
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                className="d-grid justify-content-end p-0"
                                              >
                                                {minuteDataSubminute.actorBundleStatusID ===
                                                3 ? (
                                                  <Button
                                                    text={t("Accepted")}
                                                    className={
                                                      styles["Accepted-comment"]
                                                    }
                                                    disableBtn={true}
                                                  />
                                                ) : minuteDataSubminute.actorBundleStatusID ===
                                                  2 ? (
                                                  <Button
                                                    text={t("Accept")}
                                                    className={
                                                      styles["Accept-comment"]
                                                    }
                                                  />
                                                ) : minuteDataSubminute.actorBundleStatusID ===
                                                  4 ? (
                                                  <Button
                                                    text={t("Accept")}
                                                    className={
                                                      styles["Reject-comment"]
                                                    }
                                                  />
                                                ) : null}

                                                {minuteDataSubminute.actorBundleStatusID ===
                                                3 ? (
                                                  <Button
                                                    text={t("Reject")}
                                                    className={
                                                      styles["Reject-comment"]
                                                    }
                                                    disableBtn={true}
                                                  />
                                                ) : minuteDataSubminute.actorBundleStatusID ===
                                                  2 ? (
                                                  <Button
                                                    text={t("Reject")}
                                                    className={
                                                      styles["Reject-comment"]
                                                    }
                                                    onClick={() =>
                                                      dispatch(
                                                        rejectCommentModal(true)
                                                      )
                                                    }
                                                  />
                                                ) : minuteDataSubminute.actorBundleStatusID ===
                                                  4 ? (
                                                  <>
                                                    <Button
                                                      text={t("Rejected")}
                                                      className={
                                                        styles[
                                                          "Rejected-comment"
                                                        ]
                                                      }
                                                    />

                                                    <Button
                                                      text={t("Hide-comment")}
                                                      className={
                                                        styles["Reject-comment"]
                                                      }
                                                      onClick={() =>
                                                        dispatch(
                                                          rejectCommentModal(
                                                            true
                                                          )
                                                        )
                                                      }
                                                    />
                                                  </>
                                                ) : null}
                                              </Col>
                                            </Row>

                                            <Row>
                                              <Col lg={12} md={12} sm={12}>
                                                <p
                                                  className={
                                                    styles["time-uploader"]
                                                  }
                                                >
                                                  {convertToGMTMinuteTime(
                                                    minuteDataSubminute.lastUpdatedTime
                                                  )}
                                                  ,
                                                </p>
                                                <p
                                                  className={
                                                    styles["date-uploader"]
                                                  }
                                                >
                                                  {convertDateToGMTMinute(
                                                    minuteDataSubminute.lastUpdatedDate
                                                  )}
                                                </p>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </Row>
                                      </div>
                                    </Col>
                                  </Row>
                                  {minuteDataSubminute.agendaMinutesVersionHistory
                                    .slice()
                                    .reverse()
                                    .map((historyData, index) => {
                                      return (
                                        <>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="position-relative"
                                            >
                                              {historyData.declinedReviews
                                                .length === 0 ? (
                                                <div
                                                  className={
                                                    index === 0
                                                      ? styles[
                                                          "version-control-wrapper-with-more"
                                                        ]
                                                      : styles[
                                                          "version-control-wrapper-with-more-last"
                                                        ]
                                                  }
                                                >
                                                  <span
                                                    className={
                                                      styles["with-text"]
                                                    }
                                                  >
                                                    {historyData.versionNumber}
                                                    .0
                                                  </span>
                                                </div>
                                              ) : (
                                                <div
                                                  className={
                                                    index === 0
                                                      ? styles[
                                                          "version-control-wrapper"
                                                        ]
                                                      : styles[
                                                          "version-control-wrapper-last"
                                                        ]
                                                  }
                                                ></div>
                                              )}
                                              <div
                                                className={
                                                  historyData.actorBundleStatusID ===
                                                  3
                                                    ? styles[
                                                        "uploaded-details-accepted"
                                                      ]
                                                    : historyData.actorBundleStatusID ===
                                                        4 &&
                                                      historyData
                                                        .declinedReviews
                                                        .length === 0
                                                    ? styles[
                                                        "uploaded-details-rejected"
                                                      ]
                                                    : styles["uploaded-details"]
                                                }
                                              >
                                                <Row
                                                  className={
                                                    styles["inherit-height"]
                                                  }
                                                >
                                                  <Col lg={8} md={8} sm={12}>
                                                    <p
                                                      dangerouslySetInnerHTML={{
                                                        __html:
                                                          historyData.minutesDetails,
                                                      }}
                                                      className={
                                                        styles["minutes-text"]
                                                      }
                                                    ></p>
                                                  </Col>
                                                  <Col
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    className="position-relative"
                                                  >
                                                    <Row className="m-0">
                                                      <Col
                                                        lg={6}
                                                        md={6}
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
                                                            styles[
                                                              "uploadedbyuser"
                                                            ]
                                                          }
                                                        >
                                                          {historyData
                                                            .declinedReviews
                                                            .length === 0
                                                            ? t("Uploaded-by")
                                                            : t("Reviewed-by")}
                                                        </p>
                                                        <div
                                                          className={
                                                            styles["gap-ti"]
                                                          }
                                                        >
                                                          <img
                                                            src={`data:image/jpeg;base64,${minutesAgenda[0].userProfilePicture.displayProfilePictureName}`}
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
                                                              minutesAgenda[0]
                                                                .userName
                                                            }
                                                          </p>
                                                        </div>
                                                      </Col>
                                                      {historyData
                                                        .declinedReviews
                                                        .length === 0 ? (
                                                        <Col
                                                          lg={6}
                                                          md={6}
                                                          sm={12}
                                                          className="d-grid justify-content-end p-0"
                                                        >
                                                          {historyData.actorBundleStatusID ===
                                                          3 ? (
                                                            <Button
                                                              text={t(
                                                                "Accepted"
                                                              )}
                                                              className={
                                                                styles[
                                                                  "Accepted-comment"
                                                                ]
                                                              }
                                                              disableBtn={true}
                                                            />
                                                          ) : historyData.actorBundleStatusID ===
                                                            2 ? (
                                                            <Button
                                                              text={t("Accept")}
                                                              className={
                                                                styles[
                                                                  "Accept-comment"
                                                                ]
                                                              }
                                                            />
                                                          ) : historyData.actorBundleStatusID ===
                                                            4 ? (
                                                            <Button
                                                              text={t("Accept")}
                                                              className={
                                                                styles[
                                                                  "Reject-comment"
                                                                ]
                                                              }
                                                            />
                                                          ) : null}

                                                          {historyData.actorBundleStatusID ===
                                                          3 ? (
                                                            <Button
                                                              text={t("Reject")}
                                                              className={
                                                                styles[
                                                                  "Reject-comment"
                                                                ]
                                                              }
                                                              disableBtn={true}
                                                            />
                                                          ) : historyData.actorBundleStatusID ===
                                                            2 ? (
                                                            <Button
                                                              text={t("Reject")}
                                                              className={
                                                                styles[
                                                                  "Reject-comment"
                                                                ]
                                                              }
                                                              onClick={() =>
                                                                dispatch(
                                                                  rejectCommentModal(
                                                                    true
                                                                  )
                                                                )
                                                              }
                                                            />
                                                          ) : historyData.actorBundleStatusID ===
                                                            4 ? (
                                                            <>
                                                              <Button
                                                                text={t(
                                                                  "Rejected"
                                                                )}
                                                                className={
                                                                  styles[
                                                                    "Rejected-comment"
                                                                  ]
                                                                }
                                                              />

                                                              <Button
                                                                text={t(
                                                                  "Hide-comment"
                                                                )}
                                                                className={
                                                                  styles[
                                                                    "Reject-comment"
                                                                  ]
                                                                }
                                                                onClick={() =>
                                                                  dispatch(
                                                                    rejectCommentModal(
                                                                      true
                                                                    )
                                                                  )
                                                                }
                                                              />
                                                            </>
                                                          ) : null}
                                                        </Col>
                                                      ) : (
                                                        <Col
                                                          lg={6}
                                                          md={6}
                                                          sm={12}
                                                          className="d-grid justify-content-end p-0"
                                                        >
                                                          <Button
                                                            onClick={() =>
                                                              dispatch(
                                                                editCommentModal(
                                                                  true
                                                                )
                                                              )
                                                            }
                                                            text={t("Edit")}
                                                            className={
                                                              styles[
                                                                "Reject-comment"
                                                              ]
                                                            }
                                                          />
                                                          <Button
                                                            onClick={() =>
                                                              dispatch(
                                                                deleteCommentModal(
                                                                  true
                                                                )
                                                              )
                                                            }
                                                            text={t("Delete")}
                                                            className={
                                                              styles[
                                                                "Reject-comment"
                                                              ]
                                                            }
                                                          />
                                                        </Col>
                                                      )}
                                                    </Row>

                                                    <Row>
                                                      <Col
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                      >
                                                        <p
                                                          className={
                                                            styles[
                                                              "time-uploader"
                                                            ]
                                                          }
                                                        >
                                                          {convertToGMTMinuteTime(
                                                            historyData.lastUpdatedTime
                                                          )}
                                                          ,
                                                        </p>
                                                        <p
                                                          className={
                                                            styles[
                                                              "date-uploader"
                                                            ]
                                                          }
                                                        >
                                                          {convertDateToGMTMinute(
                                                            historyData.lastUpdatedDate
                                                          )}
                                                        </p>
                                                      </Col>
                                                    </Row>
                                                  </Col>
                                                </Row>
                                              </div>
                                            </Col>
                                          </Row>
                                        </>
                                      );
                                    })}
                                </>
                              );
                            }
                          )}
                        </div>
                      );
                    })}
                  </>
                </>
              );
            })}

            {minutesGeneral.map((data, index) => {
              console.log("minutesGeneral", data);
              return (
                <>
                  <Row className="mx-50">
                    <Col lg={12} md={12} sm={12}>
                      <p className={styles["Parent-title-heading"]}>
                        {index + 1 + ". " + t("General-minutes")}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="position-relative">
                      {data.generalMinutesVersionHistory.length === 0 ? null : (
                        <div
                          className={
                            styles["version-control-wrapper-with-more"]
                          }
                        >
                          <span className={styles["with-text"]}>
                            {data.versionNumber}.0
                          </span>
                        </div>
                      )}
                      <div
                        className={
                          data.actorBundleStatusID === 3
                            ? styles["uploaded-details-accepted"]
                            : data.actorBundleStatusID === 4
                            ? styles["uploaded-details-rejected"]
                            : styles["uploaded-details"]
                        }
                      >
                        <Row className={styles["inherit-height"]}>
                          <Col lg={8} md={8} sm={12}>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: data.minutesDetails,
                              }}
                              className={styles["minutes-text"]}
                            ></p>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            className="position-relative"
                          >
                            <Row className="m-0">
                              <Col lg={6} md={6} sm={12} className="p-0">
                                <span className={styles["bar-line"]}></span>
                                <p className={styles["uploadedbyuser"]}>
                                  {t("Uploaded-by")}
                                </p>
                                <div className={styles["gap-ti"]}>
                                  <img
                                    src={`data:image/jpeg;base64,${data?.userProfilePicture?.displayProfilePictureName}`}
                                    className={styles["Image"]}
                                    alt=""
                                    draggable={false}
                                  />
                                  <p className={styles["agendaCreater"]}>
                                    {data.userName}
                                  </p>
                                </div>
                              </Col>
                              <Col
                                lg={6}
                                md={6}
                                sm={12}
                                className="d-grid justify-content-end p-0"
                              >
                                {data.actorBundleStatusID === 3 ? (
                                  <Button
                                    text={t("Accepted")}
                                    className={styles["Accepted-comment"]}
                                    disableBtn={true}
                                  />
                                ) : data.actorBundleStatusID === 2 ? (
                                  <Button
                                    text={t("Accept")}
                                    className={styles["Accept-comment"]}
                                  />
                                ) : data.actorBundleStatusID === 4 ? (
                                  <Button
                                    text={t("Accept")}
                                    className={styles["Reject-comment"]}
                                  />
                                ) : null}

                                {data.actorBundleStatusID === 3 ? (
                                  <Button
                                    text={t("Reject")}
                                    className={styles["Reject-comment"]}
                                    disableBtn={true}
                                  />
                                ) : data.actorBundleStatusID === 2 ? (
                                  <Button
                                    text={t("Reject")}
                                    className={styles["Reject-comment"]}
                                    onClick={() =>
                                      dispatch(rejectCommentModal(true))
                                    }
                                  />
                                ) : data.actorBundleStatusID === 4 ? (
                                  <>
                                    <Button
                                      text={t("Rejected")}
                                      className={styles["Rejected-comment"]}
                                    />

                                    <Button
                                      text={t("Hide-comment")}
                                      className={styles["Reject-comment"]}
                                      onClick={() =>
                                        dispatch(rejectCommentModal(true))
                                      }
                                    />
                                  </>
                                ) : null}
                              </Col>
                            </Row>

                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <p className={styles["time-uploader"]}>
                                  {convertToGMTMinuteTime(data.lastUpdatedTime)}
                                  ,
                                </p>
                                <p className={styles["date-uploader"]}>
                                  {convertDateToGMTMinute(data.lastUpdatedDate)}
                                </p>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  {data.generalMinutesVersionHistory
                    .slice()
                    .reverse()
                    .map((historyData, index) => {
                      return (
                        <>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="position-relative"
                            >
                              {historyData.declinedReviews.length === 0 ? (
                                <div
                                  className={
                                    index === 0
                                      ? styles[
                                          "version-control-wrapper-with-more"
                                        ]
                                      : styles[
                                          "version-control-wrapper-with-more-last"
                                        ]
                                  }
                                >
                                  <span className={styles["with-text"]}>
                                    {historyData.versionNumber}.0
                                  </span>
                                </div>
                              ) : (
                                <div
                                  className={
                                    index === 0
                                      ? styles["version-control-wrapper"]
                                      : styles["version-control-wrapper-last"]
                                  }
                                ></div>
                              )}
                              <div
                                className={
                                  historyData.actorBundleStatusID === 3
                                    ? styles["uploaded-details-accepted"]
                                    : historyData.actorBundleStatusID === 4 &&
                                      historyData.declinedReviews.length === 0
                                    ? styles["uploaded-details-rejected"]
                                    : styles["uploaded-details"]
                                }
                              >
                                <Row className={styles["inherit-height"]}>
                                  <Col lg={8} md={8} sm={12}>
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: historyData.minutesDetails,
                                      }}
                                      className={styles["minutes-text"]}
                                    ></p>
                                  </Col>
                                  <Col
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    className="position-relative"
                                  >
                                    <Row className="m-0">
                                      <Col
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        className="p-0"
                                      >
                                        <span
                                          className={styles["bar-line"]}
                                        ></span>
                                        <p className={styles["uploadedbyuser"]}>
                                          {historyData.declinedReviews
                                            .length === 0
                                            ? t("Uploaded-by")
                                            : t("Reviewed-by")}
                                        </p>
                                        <div className={styles["gap-ti"]}>
                                          <img
                                            src={`data:image/jpeg;base64,${minutesAgenda[0].userProfilePicture.displayProfilePictureName}`}
                                            className={styles["Image"]}
                                            alt=""
                                            draggable={false}
                                          />
                                          <p
                                            className={styles["agendaCreater"]}
                                          >
                                            {minutesAgenda[0].userName}
                                          </p>
                                        </div>
                                      </Col>
                                      {historyData.declinedReviews.length ===
                                      0 ? (
                                        <Col
                                          lg={6}
                                          md={6}
                                          sm={12}
                                          className="d-grid justify-content-end p-0"
                                        >
                                          {historyData.actorBundleStatusID ===
                                          3 ? (
                                            <Button
                                              text={t("Accepted")}
                                              className={
                                                styles["Accepted-comment"]
                                              }
                                              disableBtn={true}
                                            />
                                          ) : historyData.actorBundleStatusID ===
                                            2 ? (
                                            <Button
                                              text={t("Accept")}
                                              className={
                                                styles["Accept-comment"]
                                              }
                                            />
                                          ) : historyData.actorBundleStatusID ===
                                            4 ? (
                                            <Button
                                              text={t("Accept")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                            />
                                          ) : null}

                                          {historyData.actorBundleStatusID ===
                                          3 ? (
                                            <Button
                                              text={t("Reject")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                              disableBtn={true}
                                            />
                                          ) : historyData.actorBundleStatusID ===
                                            2 ? (
                                            <Button
                                              text={t("Reject")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                              onClick={() =>
                                                dispatch(
                                                  rejectCommentModal(true)
                                                )
                                              }
                                            />
                                          ) : historyData.actorBundleStatusID ===
                                            4 ? (
                                            <>
                                              <Button
                                                text={t("Rejected")}
                                                className={
                                                  styles["Rejected-comment"]
                                                }
                                              />

                                              <Button
                                                text={t("Hide-comment")}
                                                className={
                                                  styles["Reject-comment"]
                                                }
                                                onClick={() =>
                                                  dispatch(
                                                    rejectCommentModal(true)
                                                  )
                                                }
                                              />
                                            </>
                                          ) : null}
                                        </Col>
                                      ) : (
                                        <Col
                                          lg={6}
                                          md={6}
                                          sm={12}
                                          className="d-grid justify-content-end p-0"
                                        >
                                          <Button
                                            onClick={() =>
                                              dispatch(editCommentModal(true))
                                            }
                                            text={t("Edit")}
                                            className={styles["Reject-comment"]}
                                          />
                                          <Button
                                            onClick={() =>
                                              dispatch(deleteCommentModal(true))
                                            }
                                            text={t("Delete")}
                                            className={styles["Reject-comment"]}
                                          />
                                        </Col>
                                      )}
                                    </Row>

                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <p className={styles["time-uploader"]}>
                                          {convertToGMTMinuteTime(
                                            historyData.lastUpdatedTime
                                          )}
                                          ,
                                        </p>
                                        <p className={styles["date-uploader"]}>
                                          {convertDateToGMTMinute(
                                            historyData.lastUpdatedDate
                                          )}
                                        </p>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        </>
                      );
                    })}
                </>
              );
            })}
          </div>

          <Row className="mx-50">
            <Col
              lg={12}
              md={12}
              sm={12}
              className={currentLanguage === "ar" ? "text-start" : "text-end"}
            >
              <Button
                onClick={() => {
                  dispatch(reviewMinutesPage(false));
                  dispatch(pendingApprovalPage(true));
                }}
                text={t("Cancel")}
                className={styles["Cancel"]}
              />
              <Button
                text={t("Submit-review")}
                className={styles["Submit-review"]}
              />
            </Col>
          </Row>
        </div>
      </Paper>
      {MinutesReducer.rejectCommentModal ? <RejectCommentModal /> : null}
      {MinutesReducer.editCommentModal ? <EditCommentModal /> : null}
      {MinutesReducer.deleteCommentModal ? <DeleteCommentModal /> : null}
    </section>
  );
};

export default ReviewMinutes; // Exporting pending approval component
