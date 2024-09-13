import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // Importing translation hook
import styles from "./ReviewMinutes.module.css"; // Importing CSS module
import { useDispatch } from "react-redux"; // Importing Redux hook
import { useNavigate } from "react-router-dom"; // Importing navigation hook
import { Paper, Button, AttachmentViewer } from "../../../components/elements";
import {
  reviewMinutesPage,
  pendingApprovalPage,
  rejectCommentModal,
  editCommentModal,
  deleteCommentModal,
  currentMeetingMinutesToReview,
  GetMinutesForReviewerByMeetingId,
  acceptCommentModal,
  AcceptRejectMinuteReview,
  RejectMinute,
} from "../../../store/actions/Minutes_action";
import DefaultAvatar from "./../Images/avatar.png";
import RejectCommentModal from "./rejectCommentModal/RejectCommentModal";
import EditCommentModal from "./editCommentModal/EditCommentModal";
import DeleteCommentModal from "./deleteCommentModal/DeleteCommentModal";
import AcceptCommentModal from "./acceptAllCommentsModal/AcceptCommentModal.js";
import {
  AllDocumentsForAgendaWiseMinutesApiFunc,
  DocumentsOfMeetingGenralMinutesApiFunc,
} from "../../../store/actions/NewMeetingActions.js";
import {
  convertDateToGMTMinute,
  convertToGMTMinuteTime,
} from "../../../commen/functions/time_formatter";
import { DataRoomDownloadFileApiFunc } from "../../../store/actions/DataRoom_actions.js";
import { getFileExtension } from "../../DataRoom/SearchFunctionality/option.js";

// Functional component for pending approvals section
const ReviewMinutes = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook
  const navigate = useNavigate(); // Navigation hook

  let currentUserID = Number(localStorage.getItem("userID"));
  let currentUserName = localStorage.getItem("name");

  const { MinutesReducer, NewMeetingreducer } = useSelector((state) => state);

  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");

  const [reviewWrapperScroll, setReviewWrapperScroll] = useState(false);

  const [workflowID, setWorkflowID] = useState(0);
  const [minutesAgenda, setMinutesAgenda] = useState([]);
  const [minutesAgendaHierarchy, setMinutesAgendaHierarchy] = useState([]);
  const [minutesGeneral, setMinutesGeneral] = useState([]);
  const [minutesToReview, setMinutesToReview] = useState(0);
  const [minuteDataToReject, setMinuteDataToReject] = useState(null);
  const [visibleParentMinuteIDs, setVisibleParentMinuteIDs] = useState([]);
  const [deleteCommentLocal, setDeleteCommentLocal] = useState(null);
  const [editCommentLocal, setEditCommentLocal] = useState(null);
  const [parentMinuteID, setParentMinuteID] = useState(0);
  const [isAgenda, setIsAgenda] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

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
        // if (minute.agendaMinutesVersionHistory) {
        //   minute.agendaMinutesVersionHistory.forEach((history) => {
        //     if (history.actorBundleStatusID === 2) {
        //       count++;
        //     }
        //   });
        // }
      });
    }
    return count;
  };

  // Extract minuteData from all agendas and their subMinutes
  const extractMinuteData = (agendas) => {
    let allMinuteData = [];

    agendas.forEach((agenda) => {
      // Add main agenda's minuteData
      if (Array.isArray(agenda.minuteData)) {
        allMinuteData = [...allMinuteData, ...agenda.minuteData];
      }

      // Add subMinutes' minuteData
      if (Array.isArray(agenda.subMinutes)) {
        agenda.subMinutes.forEach((subMinute) => {
          if (Array.isArray(subMinute.minuteData)) {
            allMinuteData = [...allMinuteData, ...subMinute.minuteData];
          }
        });
      }
    });

    return allMinuteData;
  };

  const checkActorBundleStatus = (minutesAgenda, minutesGeneral) => {
    // Extract minute data from agendas
    const allMinuteData = extractMinuteData(minutesAgenda);

    // Combine all minute data with the minutesGeneral data
    const combinedMinuteData = [...allMinuteData, ...minutesGeneral];

    // Check if all actorBundleStatusID are 2
    const allStatusAreTwo = combinedMinuteData.every(
      (minute) => minute.actorBundleStatusID === 2
    );

    return allStatusAreTwo;
  };

  useEffect(() => {
    let result = checkActorBundleStatus(minutesAgenda, minutesGeneral);
    setDisableSubmit(result);
  }, [minutesAgenda, minutesGeneral]);

  const submitReviews = () => {
    const allMinuteData = extractMinuteData(minutesAgenda);

    // Transform the first state data to the required format
    const actorMinuteReviewsFromState1 = allMinuteData.map((minute) => ({
      ActionableBundleID: minute.actionableBundleID,
      StatusID: minute.actorBundleStatusID,
      DeclineReason: minute.reason || "",
    }));

    // Transform the second state data to the required format
    const actorMinuteReviewsFromState2 = minutesGeneral.map((minute) => ({
      ActionableBundleID: minute.actionableBundleID,
      StatusID: minute.actorBundleStatusID,
      DeclineReason: minute.reason || "",
    }));

    // Combine the transformed data from both states
    const ActorMinuteReviews = [
      ...actorMinuteReviewsFromState1,
      ...actorMinuteReviewsFromState2,
    ];

    let Data = {
      WorkFlowID: workflowID,
      MeetingID: MinutesReducer?.currentMeetingMinutesToReviewData?.meetingID,
      ActorMinuteReviews,
    };

    dispatch(AcceptRejectMinuteReview(Data, navigate, t));
  };

  const updateRejectMinutes = (minutesData, rejectData) => {
    const newDeclinedReview = {
      fK_ActorBundlesStatus_ID: 0,
      fK_UID: currentUserID,
      fK_WorkFlowActor_ID: 0,
      fK_WorkFlowActionableBundle_ID: 0,
      fK_ActorBundlesStatusState_ID: 2,
      actorName: currentUserName,
      reason: rejectData.reason,
      modifiedOn: new Date()
        .toISOString()
        .replace(/[-:T.]/g, "")
        .slice(0, -3), // current UTC datetime in yyyymmddhhmmss format
      userProfilePicture: rejectData.userProfilePicture,
    };

    return minutesData.map((agenda) => {
      // Update main minuteData
      const updatedMinuteData = agenda.minuteData.map((minute) => {
        if (minute.minuteID === rejectData.minuteID) {
          const updatedDeclinedReviews = [
            ...minute.declinedReviews,
            newDeclinedReview,
          ];
          return {
            ...minute,
            reason: rejectData.reason,
            actorBundleStatusID: rejectData.actorBundleStatusID,
            declinedReviews: updatedDeclinedReviews,
          };
        }
        return minute;
      });

      // Update subMinutes if they exist
      const updatedSubMinutes = agenda.subMinutes?.map((subAgenda) => {
        const updatedSubMinuteData = subAgenda.minuteData.map((subMinute) => {
          if (subMinute.minuteID === rejectData.minuteID) {
            const updatedDeclinedReviews = [
              ...subMinute.declinedReviews,
              newDeclinedReview,
            ];
            return {
              ...subMinute,
              reason: rejectData.reason,
              actorBundleStatusID: rejectData.actorBundleStatusID,
              declinedReviews: updatedDeclinedReviews,
            };
          }
          return subMinute;
        });
        return { ...subAgenda, minuteData: updatedSubMinuteData };
      });

      return {
        ...agenda,
        minuteData: updatedMinuteData,
        subMinutes: updatedSubMinutes,
      };
    });
  };

  const updateRejectMinutesGeneral = (minutesData, rejectData) => {
    const newDeclinedReview = {
      fK_ActorBundlesStatus_ID: 0,
      fK_UID: currentUserID,
      fK_WorkFlowActor_ID: 0,
      fK_WorkFlowActionableBundle_ID: 0,
      fK_ActorBundlesStatusState_ID: 2,
      actorName: currentUserName,
      reason: rejectData.reason,
      modifiedOn: new Date()
        .toISOString()
        .replace(/[-:T.]/g, "")
        .slice(0, -3), // current UTC datetime in yyyymmddhhmmss format
      userProfilePicture: rejectData.userProfilePicture,
    };

    return minutesData.map((minute) => {
      if (minute.minuteID === rejectData.minuteID) {
        const updatedDeclinedReviews = [
          ...minute.declinedReviews,
          newDeclinedReview,
        ];
        return {
          ...minute,
          reason: rejectData.reason,
          actorBundleStatusID: rejectData.actorBundleStatusID,
          declinedReviews: updatedDeclinedReviews,
        };
      }
      return minute;
    });
  };

  const updateAcceptMinutes = (minutesData, rejectData) => {
    return minutesData.map((agenda) => {
      // Update main minuteData
      const updatedMinuteData = agenda.minuteData.map((minute) => {
        if (minute.minuteID === rejectData.minuteID) {
          return {
            ...minute,
            reason: "",
            actorBundleStatusID: 3,
          };
        }
        return minute;
      });

      // Update subMinutes if they exist
      const updatedSubMinutes = agenda.subMinutes?.map((subAgenda) => {
        const updatedSubMinuteData = subAgenda.minuteData.map((subMinute) => {
          if (subMinute.minuteID === rejectData.minuteID) {
            return {
              ...subMinute,
              reason: "",
              actorBundleStatusID: 3,
            };
          }
          return subMinute;
        });
        return { ...subAgenda, minuteData: updatedSubMinuteData };
      });

      return {
        ...agenda,
        minuteData: updatedMinuteData,
        subMinutes: updatedSubMinutes,
      };
    });
  };

  const acceptMinute = (data) => {
    // Update MinutesAgenda
    const updatedMinutesAgenda = updateAcceptMinutes(minutesAgenda, data);

    // Update MinutesGeneral
    const updatedMinutesGeneral = minutesGeneral.map((minute) => {
      if (minute.minuteID === data.minuteID) {
        return {
          ...minute,
          reason: "",
          actorBundleStatusID: 3,
        };
      }
      return minute;
    });

    setMinutesAgenda(updatedMinutesAgenda);
    setMinutesGeneral(updatedMinutesGeneral);
    if (minutesToReview !== 0) {
      setMinutesToReview(minutesToReview - 1);
    }
  };

  const toggleShowHide = (parentMinuteID) => {
    const isVisible = visibleParentMinuteIDs.includes(parentMinuteID);
    if (isVisible) {
      // Remove from visible list
      setVisibleParentMinuteIDs(
        visibleParentMinuteIDs.filter((id) => id !== parentMinuteID)
      );
    } else {
      // Add to visible list
      setVisibleParentMinuteIDs([...visibleParentMinuteIDs, parentMinuteID]);
    }
  };

  const rejectGeneralComment = (data) => {
    dispatch(rejectCommentModal(true));
    // setMinuteDataToReject(
    //   JSON.parse(JSON.stringify(data))
    // );
    setMinuteDataToReject(data);
    // dispatch(RejectMinute(data));
  };

  //Download the document
  const downloadDocument = (record) => {
    let data = {
      FileID: record.pK_FileID,
    };
    dispatch(
      DataRoomDownloadFileApiFunc(navigate, data, t, record.displayFileName)
    );
  };

  const pdfData = (record, ext) => {
    console.log("PDFDATAPDFDATA", record);
    let Data = {
      taskId: 2,
      commingFrom: 4,
      fileName: record.displayFileName,
      attachmentID: record.pK_FileID,
    };
    let pdfDataJson = JSON.stringify(Data);
    if (
      ext === "pdf" ||
      ext === "doc" ||
      ext === "docx" ||
      ext === "xlx" ||
      ext === "xlsx"
    ) {
      window.open(
        `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };

  useEffect(() => {
    const div = divRef.current;

    if (div.scrollHeight > div.clientHeight) {
      setReviewWrapperScroll(true);
    } else {
      setReviewWrapperScroll(false);
    }
    return () => {
      dispatch(reviewMinutesPage(false));
      dispatch(pendingApprovalPage(true));
      setMinutesAgenda([]);
      setMinutesAgendaHierarchy([]);
      setMinutesGeneral([]);
      setMinutesToReview([]);
    };
  }, []); // This effect runs once after the component mounts

  useEffect(() => {
    try {
      let allAgendaWiseDocs = {
        MDID: MinutesReducer?.currentMeetingMinutesToReviewData?.meetingID,
      };
      let Data = {
        MeetingID: MinutesReducer?.currentMeetingMinutesToReviewData?.meetingID,
      };
      dispatch(
        AllDocumentsForAgendaWiseMinutesApiFunc(navigate, allAgendaWiseDocs, t)
      );

      dispatch(
        DocumentsOfMeetingGenralMinutesApiFunc(navigate, allAgendaWiseDocs, t)
      );

      dispatch(GetMinutesForReviewerByMeetingId(Data, navigate, t));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const reducerData = MinutesReducer.GetMinutesForReviewerByMeetingIdData;
      if (reducerData !== null) {
        const { agendaHierarchyList, agendaMinutes, generalMinutes } =
          reducerData;
        let newGeneralMeetingData = generalMinutes.map(
          (generalMinteData, index) => {
            return {
              ...generalMinteData,
              declinedReviews: [...generalMinteData.declinedReviews],
            };
          }
        );
        setMinutesGeneral(newGeneralMeetingData);
        setMinutesToReview(countActorBundleStatusID2(reducerData));
        setWorkflowID(reducerData.workFlowID);
        try {
          let transformedData = agendaHierarchyList?.map((parentAgenda) => {
            let parentAgendaMinutes = agendaMinutes?.filter(
              (minute) => minute.agendaID === parentAgenda.pK_MAID
            );

            let subMinutes = parentAgenda.childAgendas.flatMap(
              (childAgenda) => {
                return agendaMinutes
                  ?.filter((minute) => minute.agendaID === childAgenda.pK_MAID)
                  .map((minute) => {
                    const foundEntry =
                      NewMeetingreducer?.getallDocumentsForAgendaWiseMinutes?.data?.find(
                        (entry) =>
                          entry.pK_MeetingAgendaMinutesID === minute.minuteID
                      );

                    return {
                      ...minute,
                      attachments: foundEntry?.files || [],
                    };
                  });
              }
            );

            let agendaTitle =
              parentAgendaMinutes.length > 0
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
                ...minute,
                attachments:
                  NewMeetingreducer.getallDocumentsForAgendaWiseMinutes.data.find(
                    (entry) =>
                      entry.pK_MeetingAgendaMinutesID === minute.minuteID
                  )?.files || [],
              })),
              subMinutes: parentAgenda.childAgendas.map((childAgenda) => {
                let childMinutes = subMinutes.filter(
                  (minute) => minute.agendaID === childAgenda.pK_MAID
                );
                return {
                  agendaID: childAgenda.pK_MAID,
                  agendaTitle: childMinutes[0]?.agendaTitle || "",
                  minuteData: childMinutes,
                };
              }),
            };

            return parentAgendaObj;
          });
          setMinutesAgenda(transformedData);
        } catch (error) {}
      } else {
      }
      // else {
      //   setMinutesAgenda([]);
      //   setMinutesAgendaHierarchy([]);
      //   setMinutesGeneral([]);
      //   setMinutesToReview(0);
      // }
    } catch (error) {
      console.error("Error transforming data", error);
    }
  }, [MinutesReducer.GetMinutesForReviewerByMeetingIdData]);

  function filterEmptyReasons(state) {
    // Iterate through the main state
    state.forEach((item) => {
      // Iterate through minuteData
      item.minuteData.forEach((minute) => {
        // Filter declinedReviews where reason is not empty
        minute.declinedReviews = minute.declinedReviews.filter(
          (review) => review.reason !== ""
        );
      });

      // Iterate through subMinutes
      item.subMinutes.forEach((subItem) => {
        subItem.minuteData.forEach((minute) => {
          // Filter declinedReviews where reason is not empty
          minute.declinedReviews = minute.declinedReviews.filter(
            (review) => review.reason !== ""
          );
        });
      });
    });

    return state;
  }

  function filterEmptyReasonsForStateGeneral(state) {
    // Iterate through the state array
    state.forEach((item) => {
      // Filter declinedReviews where reason is not empty
      item.declinedReviews = item.declinedReviews.filter(
        (review) => review.reason !== ""
      );
    });

    return state;
  }

  useEffect(() => {
    try {
      if (minuteDataToReject) {
        const rejectMinuteData = minuteDataToReject;

        // Update MinutesAgenda
        let updatedMinutesAgenda = updateRejectMinutes(
          minutesAgenda,
          rejectMinuteData
        );

        updatedMinutesAgenda = filterEmptyReasons(updatedMinutesAgenda);

        // Update MinutesGeneral
        let updatedMinutesData = updateRejectMinutesGeneral(
          minutesGeneral,
          rejectMinuteData
        );

        updatedMinutesData =
          filterEmptyReasonsForStateGeneral(updatedMinutesData);

        setMinutesAgenda(updatedMinutesAgenda);
        setMinutesGeneral(updatedMinutesData);
      }
    } catch {}
  }, [minuteDataToReject]);

  console.log("NewMeetingreducerNewMeetingreducer", NewMeetingreducer);

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
              <Button
                onClick={() => dispatch(acceptCommentModal(true))}
                text={t("Accept All")}
                disableBtn={minutesToReview === 0 ? true : false}
                className={styles["Accept-all"]}
              />
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
            {minutesAgenda.length > 0
              ? minutesAgenda?.map((data, index) => {
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
                        {data?.minuteData?.map((parentMinutedata, index) => {
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
                                    .length === 0 &&
                                  parentMinutedata.declinedReviews.length ===
                                    0 ? null : (
                                    <div
                                      className={
                                        styles[
                                          "version-control-wrapper-with-more"
                                        ]
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
                                        : parentMinutedata.actorBundleStatusID ===
                                          4
                                        ? styles["uploaded-details-rejected"]
                                        : styles["uploaded-details"]
                                    }
                                  >
                                    <Row className={styles["inherit-height"]}>
                                      <Col lg={8} md={8} sm={12}>
                                        <p
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              parentMinutedata.minutesDetails,
                                          }}
                                          className={styles["minutes-text"]}
                                        ></p>
                                        <Row>
                                          {parentMinutedata
                                            .minuteAttachmentFiles.length > 0 &&
                                            parentMinutedata.minuteAttachmentFiles.map(
                                              (filesData, index) => {
                                                return (
                                                  <Col sm={3} md={3} lg={3}>
                                                    <AttachmentViewer
                                                      handleClickDownload={() =>
                                                        downloadDocument(
                                                          filesData
                                                        )
                                                      }
                                                      fk_UID={0}
                                                      data={data.attachments}
                                                      id={filesData.pK_FileID}
                                                      name={
                                                        filesData.displayFileName
                                                      }
                                                      handleEyeIcon={() =>
                                                        pdfData(
                                                          filesData,
                                                          getFileExtension(
                                                            filesData?.displayFileName
                                                          )
                                                        )
                                                      }
                                                    />
                                                    {/* <AttachmentViewer
                                                      name={
                                                        filesData.displayFileName
                                                      }
                                                    /> */}
                                                  </Col>
                                                );
                                              }
                                            )}
                                        </Row>
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
                                            <div className={styles["gap-ti"]}>
                                              <img
                                                src={`data:image/jpeg;base64,${parentMinutedata?.userProfilePicture?.displayProfilePictureName}`}
                                                className={styles["Image"]}
                                                alt=""
                                                draggable={false}
                                              />
                                              <p
                                                className={
                                                  styles["agendaCreater"]
                                                }
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
                                                className={
                                                  styles["Accept-comment"]
                                                }
                                                onClick={() =>
                                                  acceptMinute(parentMinutedata)
                                                }
                                              />
                                            ) : parentMinutedata.actorBundleStatusID ===
                                              4 ? (
                                              <Button
                                                text={t("Accept")}
                                                className={
                                                  styles["Reject-comment"]
                                                }
                                                onClick={() =>
                                                  acceptMinute(parentMinutedata)
                                                }
                                              />
                                            ) : null}

                                            {parentMinutedata.actorBundleStatusID ===
                                            3 ? (
                                              <Button
                                                text={t("Reject")}
                                                className={
                                                  styles["Reject-comment"]
                                                }
                                                disableBtn={true}
                                              />
                                            ) : parentMinutedata.actorBundleStatusID ===
                                              2 ? (
                                              <Button
                                                text={t("Reject")}
                                                className={
                                                  styles["Reject-comment"]
                                                }
                                                onClick={() => {
                                                  dispatch(
                                                    rejectCommentModal(true)
                                                  );
                                                  setMinuteDataToReject(
                                                    parentMinutedata
                                                  );

                                                  // dispatch(
                                                  //   RejectMinute(
                                                  //     parentMinutedata
                                                  //   )
                                                  // );
                                                }}
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
                                                parentMinutedata.lastUpdatedTime
                                              )}
                                              ,
                                            </p>
                                            <p
                                              className={
                                                styles["date-uploader"]
                                              }
                                            >
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
                              {parentMinutedata.declinedReviews.length > 0 ? (
                                <Row className="mx-50">
                                  <Col lg={12} md={12} sm={12}>
                                    <div className={styles["wrapper-userlist"]}>
                                      <p>
                                        {t("This minute is rejected by: ")}
                                        {parentMinutedata.declinedReviews
                                          .slice(0, 5)
                                          .map((usersList, index) => (
                                            <React.Fragment key={index}>
                                              {usersList.actorName}
                                              {index !== 4 &&
                                                index <
                                                  parentMinutedata
                                                    .declinedReviews.length -
                                                    1 &&
                                                ", "}
                                            </React.Fragment>
                                          ))}
                                        {parentMinutedata.declinedReviews
                                          .length > 5 && (
                                          <>
                                            {" and "}
                                            {parentMinutedata.declinedReviews
                                              .length - 5}{" "}
                                            {parentMinutedata.declinedReviews
                                              .length -
                                              5 ===
                                            1
                                              ? "more"
                                              : "more"}
                                          </>
                                        )}
                                      </p>
                                      <p
                                        className="text-decoration-underline cursor-pointer"
                                        onClick={() =>
                                          toggleShowHide(
                                            parentMinutedata.minuteID
                                          )
                                        }
                                      >
                                        {visibleParentMinuteIDs.includes(
                                          parentMinutedata.minuteID
                                        )
                                          ? t("Hide-comments")
                                          : t("Show-comments")}
                                      </p>
                                    </div>
                                  </Col>
                                </Row>
                              ) : null}

                              {visibleParentMinuteIDs.includes(
                                parentMinutedata.minuteID
                              ) &&
                                parentMinutedata.declinedReviews.map(
                                  (declinedData, index) => {
                                    const isLastIndex =
                                      index ===
                                      parentMinutedata.declinedReviews.length -
                                        1;
                                    return (
                                      <>
                                        <Row>
                                          <Col
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            className="position-relative"
                                          >
                                            {declinedData.length === 0 ? (
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
                                              ></div>
                                            ) : (
                                              <div
                                                className={
                                                  !isLastIndex ||
                                                  parentMinutedata
                                                    .agendaMinutesVersionHistory
                                                    .length > 0
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
                                                styles["uploaded-details"]
                                              }
                                            >
                                              <Row
                                                className={
                                                  styles["inherit-height"]
                                                }
                                              >
                                                <Col lg={8} md={8} sm={12}>
                                                  <p
                                                    className={
                                                      styles["minutes-text"]
                                                    }
                                                  >
                                                    {declinedData.reason}
                                                  </p>
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
                                                        {t("Reviewed-by")}
                                                      </p>
                                                      <div
                                                        className={
                                                          styles["gap-ti"]
                                                        }
                                                      >
                                                        <img
                                                          src={`data:image/jpeg;base64,${declinedData?.userProfilePicture?.displayProfilePictureName}`}
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
                                                            declinedData.actorName
                                                          }
                                                        </p>
                                                      </div>
                                                    </Col>
                                                    {declinedData.fK_WorkFlowActor_ID !==
                                                      0 &&
                                                    Number(
                                                      declinedData.fK_UID
                                                    ) === currentUserID ? (
                                                      <Col
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        className="d-grid justify-content-end p-0"
                                                      >
                                                        <Button
                                                          // onClick={() => {
                                                          //   dispatch(
                                                          //     editCommentModal(
                                                          //       true
                                                          //     )
                                                          //   );
                                                          //   setEditCommentLocal(
                                                          //     declinedData
                                                          //   );
                                                          // }}
                                                          onClick={() => {
                                                            dispatch(
                                                              editCommentModal(
                                                                true
                                                              )
                                                            );
                                                            setEditCommentLocal(
                                                              declinedData
                                                            );
                                                            setParentMinuteID(
                                                              parentMinutedata
                                                            );
                                                            setIsAgenda(true);
                                                          }}
                                                          text={t("Edit")}
                                                          className={
                                                            styles[
                                                              "Reject-comment"
                                                            ]
                                                          }
                                                        />
                                                        <Button
                                                          // onClick={() => {
                                                          //   dispatch(
                                                          //     deleteCommentModal(
                                                          //       true
                                                          //     )
                                                          //   );
                                                          //   setDeleteCommentLocal(
                                                          //     declinedData
                                                          //   );
                                                          // }}
                                                          onClick={() => {
                                                            dispatch(
                                                              deleteCommentModal(
                                                                true
                                                              )
                                                            );
                                                            setDeleteCommentLocal(
                                                              declinedData
                                                            );
                                                            setParentMinuteID(
                                                              parentMinutedata
                                                            );
                                                            setIsAgenda(true);
                                                          }}
                                                          text={t("Delete")}
                                                          className={
                                                            styles[
                                                              "Reject-comment"
                                                            ]
                                                          }
                                                        />
                                                      </Col>
                                                    ) : null}
                                                    {declinedData.fK_WorkFlowActor_ID ===
                                                    0 ? (
                                                      <Col
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        className="d-grid justify-content-end p-0"
                                                      >
                                                        <Button
                                                          // onClick={() => {
                                                          //   dispatch(
                                                          //     editCommentModal(
                                                          //       true
                                                          //     )
                                                          //   );
                                                          //   setEditCommentLocal(
                                                          //     declinedData
                                                          //   );
                                                          // }}
                                                          onClick={() => {
                                                            dispatch(
                                                              editCommentModal(
                                                                true
                                                              )
                                                            );
                                                            setEditCommentLocal(
                                                              declinedData
                                                            );
                                                            setParentMinuteID(
                                                              parentMinutedata
                                                            );
                                                            setIsAgenda(true);
                                                          }}
                                                          text={t("Edit")}
                                                          className={
                                                            styles[
                                                              "Reject-comment"
                                                            ]
                                                          }
                                                        />
                                                        <Button
                                                          // onClick={() => {
                                                          //   dispatch(
                                                          //     deleteCommentModal(
                                                          //       true
                                                          //     )
                                                          //   );
                                                          //   setDeleteCommentLocal(
                                                          //     declinedData
                                                          //   );
                                                          // }}
                                                          onClick={() => {
                                                            dispatch(
                                                              deleteCommentModal(
                                                                true
                                                              )
                                                            );
                                                            setDeleteCommentLocal(
                                                              declinedData
                                                            );
                                                            setParentMinuteID(
                                                              parentMinutedata
                                                            );
                                                            setIsAgenda(true);
                                                          }}
                                                          text={t("Delete")}
                                                          className={
                                                            styles[
                                                              "Reject-comment"
                                                            ]
                                                          }
                                                        />
                                                      </Col>
                                                    ) : null}
                                                  </Row>
                                                </Col>
                                              </Row>
                                            </div>
                                          </Col>
                                        </Row>
                                      </>
                                    );
                                  }
                                )}
                              {parentMinutedata.agendaMinutesVersionHistory
                                .slice()
                                .reverse()
                                .map((historyData, index) => {
                                  const isLastIndex =
                                    index ===
                                    parentMinutedata.agendaMinutesVersionHistory
                                      .length -
                                      1;
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
                                              historyData.declinedReviews
                                                .length > 0 || !isLastIndex
                                                ? styles[
                                                    "version-control-wrapper-with-more"
                                                  ]
                                                : styles[
                                                    "version-control-wrapper-with-more-last"
                                                  ]
                                            }
                                          >
                                            <span
                                              className={styles["with-text"]}
                                            >
                                              {historyData.versionNumber}.0
                                            </span>
                                          </div>
                                          <div
                                            className={
                                              historyData.actorBundleStatusID ===
                                              3
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
                                                        styles["uploadedbyuser"]
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
                                                        src={`data:image/jpeg;base64,${minutesAgenda[0]?.minuteData[0]?.userProfilePicture?.displayProfilePictureName}`}
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
                                                            ?.minuteData[0]
                                                            ?.userName
                                                        }
                                                      </p>
                                                    </div>
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

                                      {historyData.declinedReviews.length >
                                      0 ? (
                                        <Row className="mx-50">
                                          <Col lg={12} md={12} sm={12}>
                                            <div
                                              className={
                                                styles["wrapper-userlist"]
                                              }
                                            >
                                              <p>
                                                {t(
                                                  "This minute is rejected by: "
                                                )}
                                                {historyData.declinedReviews
                                                  .slice(0, 5)
                                                  ?.map((usersList, index) => (
                                                    <React.Fragment key={index}>
                                                      {usersList.actorName}
                                                      {index !== 4 &&
                                                        index <
                                                          historyData
                                                            .declinedReviews
                                                            .length -
                                                            1 &&
                                                        ", "}
                                                    </React.Fragment>
                                                  ))}
                                                {historyData.declinedReviews
                                                  .length > 5 && (
                                                  <>
                                                    {" and "}
                                                    {historyData.declinedReviews
                                                      .length - 5}{" "}
                                                    {historyData.declinedReviews
                                                      .length -
                                                      5 ===
                                                    1
                                                      ? "more"
                                                      : "more"}
                                                  </>
                                                )}
                                              </p>
                                              <p
                                                className="text-decoration-underline cursor-pointer"
                                                onClick={() =>
                                                  toggleShowHide(
                                                    historyData.minuteID
                                                  )
                                                }
                                              >
                                                {visibleParentMinuteIDs.includes(
                                                  historyData.minuteID
                                                )
                                                  ? t("Hide-comments")
                                                  : t("Show-comments")}
                                              </p>
                                            </div>
                                          </Col>
                                        </Row>
                                      ) : null}
                                      {visibleParentMinuteIDs.includes(
                                        historyData.minuteID
                                      ) &&
                                        historyData?.declinedReviews?.map(
                                          (declinedDataHistory, index) => {
                                            const isLastIndexx =
                                              index ===
                                              historyData.declinedReviews
                                                .length -
                                                1;
                                            return (
                                              <>
                                                <Row>
                                                  <Col
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    className="position-relative"
                                                  >
                                                    {declinedDataHistory.length ===
                                                    0 ? (
                                                      <div
                                                        className={
                                                          !isLastIndexx
                                                            ? styles[
                                                                "version-control-wrapper-with-more"
                                                              ]
                                                            : styles[
                                                                "version-control-wrapper-with-more-last"
                                                              ]
                                                        }
                                                      ></div>
                                                    ) : (
                                                      <div
                                                        className={
                                                          !isLastIndexx
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
                                                        styles[
                                                          "uploaded-details"
                                                        ]
                                                      }
                                                    >
                                                      <Row
                                                        className={
                                                          styles[
                                                            "inherit-height"
                                                          ]
                                                        }
                                                      >
                                                        <Col
                                                          lg={8}
                                                          md={8}
                                                          sm={12}
                                                        >
                                                          <p
                                                            className={
                                                              styles[
                                                                "minutes-text"
                                                              ]
                                                            }
                                                          >
                                                            {
                                                              declinedDataHistory.reason
                                                            }
                                                          </p>
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
                                                                  styles[
                                                                    "bar-line"
                                                                  ]
                                                                }
                                                              ></span>
                                                              <p
                                                                className={
                                                                  styles[
                                                                    "uploadedbyuser"
                                                                  ]
                                                                }
                                                              >
                                                                {t(
                                                                  "Reviewed-by"
                                                                )}
                                                              </p>
                                                              <div
                                                                className={
                                                                  styles[
                                                                    "gap-ti"
                                                                  ]
                                                                }
                                                              >
                                                                <img
                                                                  src={`data:image/jpeg;base64,${declinedDataHistory?.userProfilePicture?.displayProfilePictureName}`}
                                                                  className={
                                                                    styles[
                                                                      "Image"
                                                                    ]
                                                                  }
                                                                  alt=""
                                                                  draggable={
                                                                    false
                                                                  }
                                                                />
                                                                <p
                                                                  className={
                                                                    styles[
                                                                      "agendaCreater"
                                                                    ]
                                                                  }
                                                                >
                                                                  {
                                                                    declinedDataHistory.actorName
                                                                  }
                                                                </p>
                                                              </div>
                                                            </Col>
                                                            {declinedDataHistory.fK_WorkFlowActor_ID !==
                                                              0 &&
                                                            Number(
                                                              declinedDataHistory.fK_UID
                                                            ) ===
                                                              currentUserID ? (
                                                              <Col
                                                                lg={6}
                                                                md={6}
                                                                sm={12}
                                                                className="d-grid justify-content-end p-0"
                                                              >
                                                                <Button
                                                                  // onClick={() => {
                                                                  //   dispatch(
                                                                  //     editCommentModal(
                                                                  //       true
                                                                  //     )
                                                                  //   );
                                                                  //   setEditCommentLocal(
                                                                  //     declinedData
                                                                  //   );
                                                                  // }}
                                                                  onClick={() => {
                                                                    dispatch(
                                                                      editCommentModal(
                                                                        true
                                                                      )
                                                                    );
                                                                    setEditCommentLocal(
                                                                      declinedDataHistory
                                                                    );
                                                                    setParentMinuteID(
                                                                      parentMinutedata
                                                                    );
                                                                    setIsAgenda(
                                                                      true
                                                                    );
                                                                  }}
                                                                  text={t(
                                                                    "Edit"
                                                                  )}
                                                                  className={
                                                                    styles[
                                                                      "Reject-comment"
                                                                    ]
                                                                  }
                                                                />
                                                                <Button
                                                                  // onClick={() => {
                                                                  //   dispatch(
                                                                  //     deleteCommentModal(
                                                                  //       true
                                                                  //     )
                                                                  //   );
                                                                  //   setDeleteCommentLocal(
                                                                  //     declinedData
                                                                  //   );
                                                                  // }}
                                                                  onClick={() => {
                                                                    dispatch(
                                                                      deleteCommentModal(
                                                                        true
                                                                      )
                                                                    );
                                                                    setDeleteCommentLocal(
                                                                      declinedDataHistory
                                                                    );
                                                                    setParentMinuteID(
                                                                      parentMinutedata
                                                                    );
                                                                    setIsAgenda(
                                                                      true
                                                                    );
                                                                  }}
                                                                  text={t(
                                                                    "Delete"
                                                                  )}
                                                                  className={
                                                                    styles[
                                                                      "Reject-comment"
                                                                    ]
                                                                  }
                                                                />
                                                              </Col>
                                                            ) : null}
                                                            {declinedDataHistory.fK_WorkFlowActor_ID ===
                                                            0 ? (
                                                              <Col
                                                                lg={6}
                                                                md={6}
                                                                sm={12}
                                                                className="d-grid justify-content-end p-0"
                                                              >
                                                                <Button
                                                                  onClick={() => {
                                                                    dispatch(
                                                                      editCommentModal(
                                                                        true
                                                                      )
                                                                    );
                                                                    setEditCommentLocal(
                                                                      declinedDataHistory
                                                                    );
                                                                  }}
                                                                  className={
                                                                    styles[
                                                                      "Reject-comment"
                                                                    ]
                                                                  }
                                                                />
                                                                <Button
                                                                  // onClick={() => {
                                                                  //   dispatch(
                                                                  //     deleteCommentModal(
                                                                  //       true
                                                                  //     )
                                                                  //   );
                                                                  //   setDeleteCommentLocal(
                                                                  //     declinedDataHistory
                                                                  //   );
                                                                  // }}
                                                                  onClick={() => {
                                                                    dispatch(
                                                                      deleteCommentModal(
                                                                        true
                                                                      )
                                                                    );
                                                                    setDeleteCommentLocal(
                                                                      declinedDataHistory
                                                                    );
                                                                    setParentMinuteID(
                                                                      historyData
                                                                    );
                                                                    setIsAgenda(
                                                                      true
                                                                    );
                                                                  }}
                                                                  text={t(
                                                                    "Delete"
                                                                  )}
                                                                  className={
                                                                    styles[
                                                                      "Reject-comment"
                                                                    ]
                                                                  }
                                                                />
                                                              </Col>
                                                            ) : null}
                                                          </Row>
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </Col>
                                                </Row>
                                              </>
                                            );
                                          }
                                        )}
                                    </>
                                  );
                                })}
                            </>
                          );
                        })}

                        {data?.subMinutes?.map((subMinuteData, index) => {
                          return (
                            <>
                              {subMinuteData.minuteData.length === 0 ? null : (
                                <Row className="mx-50">
                                  <Col lg={12} md={12} sm={12}>
                                    <p className={styles["SUB-title-heading"]}>
                                      {index +
                                        1 +
                                        "." +
                                        index +
                                        1 +
                                        " " +
                                        subMinuteData.agendaTitle}
                                    </p>
                                  </Col>
                                </Row>
                              )}
                              {subMinuteData?.minuteData?.map(
                                (minuteDataSubminute, index) => {
                                  return (
                                    <>
                                      <Row
                                        className={
                                          currentLanguage === "ar"
                                            ? "mxr-50"
                                            : "mxl-50"
                                        }
                                      >
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="position-relative"
                                        >
                                          {minuteDataSubminute
                                            .agendaMinutesVersionHistory
                                            .length === 0 &&
                                          minuteDataSubminute.declinedReviews
                                            .length === 0 ? null : (
                                            <div
                                              className={
                                                styles[
                                                  "version-control-wrapper-with-more"
                                                ]
                                              }
                                            >
                                              <span
                                                className={styles["with-text"]}
                                              >
                                                {
                                                  minuteDataSubminute.versionNumber
                                                }
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
                                              className={
                                                styles["inherit-height"]
                                              }
                                            >
                                              <Col lg={8} md={8} sm={12}>
                                                <p
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      minuteDataSubminute.minutesDetails,
                                                  }}
                                                  className={
                                                    styles["minutes-text"]
                                                  }
                                                ></p>
                                                <Row>
                                                  {minuteDataSubminute
                                                    .minuteAttachmentFiles
                                                    .length > 0 &&
                                                    minuteDataSubminute.minuteAttachmentFiles.map(
                                                      (filesData, index) => {
                                                        return (
                                                          <Col
                                                            sm={3}
                                                            md={3}
                                                            lg={3}
                                                          >
                                                            <AttachmentViewer
                                                              handleClickDownload={() =>
                                                                downloadDocument(
                                                                  filesData
                                                                )
                                                              }
                                                              fk_UID={0}
                                                              data={
                                                                data.attachments
                                                              }
                                                              id={
                                                                filesData.pK_FileID
                                                              }
                                                              name={
                                                                filesData.displayFileName
                                                              }
                                                              handleEyeIcon={() =>
                                                                pdfData(
                                                                  filesData,
                                                                  getFileExtension(
                                                                    filesData?.displayFileName
                                                                  )
                                                                )
                                                              }
                                                            />
                                                            {/* <AttachmentViewer
                                                      name={
                                                        filesData.displayFileName
                                                      }
                                                    /> */}
                                                          </Col>
                                                        );
                                                      }
                                                    )}
                                                </Row>
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
                                                        styles["uploadedbyuser"]
                                                      }
                                                    >
                                                      {t("Uploaded-by")}
                                                    </p>
                                                    <div
                                                      className={
                                                        styles["gap-ti"]
                                                      }
                                                    >
                                                      <img
                                                        src={`data:image/jpeg;base64,${minuteDataSubminute?.userProfilePicture?.displayProfilePictureName}`}
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
                                                          styles[
                                                            "Accepted-comment"
                                                          ]
                                                        }
                                                        disableBtn={true}
                                                      />
                                                    ) : minuteDataSubminute.actorBundleStatusID ===
                                                      2 ? (
                                                      <Button
                                                        text={t("Accept")}
                                                        className={
                                                          styles[
                                                            "Accept-comment"
                                                          ]
                                                        }
                                                        onClick={() =>
                                                          acceptMinute(
                                                            minuteDataSubminute
                                                          )
                                                        }
                                                      />
                                                    ) : minuteDataSubminute.actorBundleStatusID ===
                                                      4 ? (
                                                      <Button
                                                        text={t("Accept")}
                                                        className={
                                                          styles[
                                                            "Reject-comment"
                                                          ]
                                                        }
                                                        onClick={() =>
                                                          acceptMinute(
                                                            minuteDataSubminute
                                                          )
                                                        }
                                                      />
                                                    ) : null}

                                                    {minuteDataSubminute.actorBundleStatusID ===
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
                                                    ) : minuteDataSubminute.actorBundleStatusID ===
                                                      2 ? (
                                                      <Button
                                                        text={t("Reject")}
                                                        className={
                                                          styles[
                                                            "Reject-comment"
                                                          ]
                                                        }
                                                        onClick={() => {
                                                          dispatch(
                                                            rejectCommentModal(
                                                              true
                                                            )
                                                          );
                                                          setMinuteDataToReject(
                                                            minuteDataSubminute
                                                          );

                                                          // dispatch(
                                                          //   RejectMinute(
                                                          //     minuteDataSubminute
                                                          //   )
                                                          // );
                                                        }}
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
                                      {minuteDataSubminute.declinedReviews
                                        .length > 0 ? (
                                        <Row
                                          className={
                                            currentLanguage === "ar"
                                              ? "mxr-50"
                                              : "mxl-50"
                                          }
                                        >
                                          <Col lg={12} md={12} sm={12}>
                                            <div
                                              className={
                                                styles[
                                                  "wrapper-userlist-subagenda"
                                                ]
                                              }
                                            >
                                              <p>
                                                {t(
                                                  "This minute is rejected by: "
                                                )}
                                                {minuteDataSubminute.declinedReviews
                                                  .slice(0, 5)
                                                  .map((usersList, index) => (
                                                    <React.Fragment key={index}>
                                                      {usersList.actorName}
                                                      {index !== 4 &&
                                                        index <
                                                          minuteDataSubminute
                                                            .declinedReviews
                                                            .length -
                                                            1 &&
                                                        ", "}
                                                    </React.Fragment>
                                                  ))}
                                                {minuteDataSubminute
                                                  .declinedReviews.length >
                                                  5 && (
                                                  <>
                                                    {" and "}
                                                    {minuteDataSubminute
                                                      .declinedReviews.length -
                                                      5}{" "}
                                                    {minuteDataSubminute
                                                      .declinedReviews.length -
                                                      5 ===
                                                    1
                                                      ? "more"
                                                      : "more"}
                                                  </>
                                                )}
                                              </p>
                                              <p
                                                className="text-decoration-underline cursor-pointer"
                                                onClick={() =>
                                                  toggleShowHide(
                                                    minuteDataSubminute.minuteID
                                                  )
                                                }
                                              >
                                                {visibleParentMinuteIDs.includes(
                                                  minuteDataSubminute.minuteID
                                                )
                                                  ? t("Hide-comments")
                                                  : t("Show-comments")}
                                              </p>
                                            </div>
                                          </Col>
                                        </Row>
                                      ) : null}

                                      {visibleParentMinuteIDs.includes(
                                        minuteDataSubminute.minuteID
                                      ) &&
                                        minuteDataSubminute.declinedReviews.map(
                                          (declinedData, index) => {
                                            const isLastIndex =
                                              index ===
                                              minuteDataSubminute
                                                .declinedReviews.length -
                                                1;
                                            return (
                                              <>
                                                <Row
                                                  className={
                                                    currentLanguage === "ar"
                                                      ? "mxr-50"
                                                      : "mxl-50"
                                                  }
                                                >
                                                  <Col
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    className="position-relative"
                                                  >
                                                    {declinedData.length ===
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
                                                      ></div>
                                                    ) : (
                                                      <div
                                                        className={
                                                          !isLastIndex ||
                                                          minuteDataSubminute
                                                            .agendaMinutesVersionHistory
                                                            .length > 0
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
                                                        styles[
                                                          "uploaded-details"
                                                        ]
                                                      }
                                                    >
                                                      <Row
                                                        className={
                                                          styles[
                                                            "inherit-height"
                                                          ]
                                                        }
                                                      >
                                                        <Col
                                                          lg={8}
                                                          md={8}
                                                          sm={12}
                                                        >
                                                          <p
                                                            className={
                                                              styles[
                                                                "minutes-text"
                                                              ]
                                                            }
                                                          >
                                                            {
                                                              declinedData.reason
                                                            }
                                                          </p>
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
                                                                  styles[
                                                                    "bar-line"
                                                                  ]
                                                                }
                                                              ></span>
                                                              <p
                                                                className={
                                                                  styles[
                                                                    "uploadedbyuser"
                                                                  ]
                                                                }
                                                              >
                                                                {t(
                                                                  "Reviewed-by"
                                                                )}
                                                              </p>
                                                              <div
                                                                className={
                                                                  styles[
                                                                    "gap-ti"
                                                                  ]
                                                                }
                                                              >
                                                                <img
                                                                  src={`data:image/jpeg;base64,${declinedData?.userProfilePicture?.displayProfilePictureName}`}
                                                                  className={
                                                                    styles[
                                                                      "Image"
                                                                    ]
                                                                  }
                                                                  alt=""
                                                                  draggable={
                                                                    false
                                                                  }
                                                                />
                                                                <p
                                                                  className={
                                                                    styles[
                                                                      "agendaCreater"
                                                                    ]
                                                                  }
                                                                >
                                                                  {
                                                                    declinedData.actorName
                                                                  }
                                                                </p>
                                                              </div>
                                                            </Col>
                                                            {declinedData.fK_WorkFlowActor_ID !==
                                                              0 &&
                                                            Number(
                                                              declinedData.fK_UID
                                                            ) ===
                                                              currentUserID ? (
                                                              <>
                                                                <Col
                                                                  lg={6}
                                                                  md={6}
                                                                  sm={12}
                                                                  className="d-grid justify-content-end p-0"
                                                                >
                                                                  <Button
                                                                    // onClick={() => {
                                                                    //   dispatch(
                                                                    //     editCommentModal(
                                                                    //       true
                                                                    //     )
                                                                    //   );
                                                                    //   setEditCommentLocal(
                                                                    //     declinedDataHistory
                                                                    //   );
                                                                    // }}
                                                                    onClick={() => {
                                                                      dispatch(
                                                                        editCommentModal(
                                                                          true
                                                                        )
                                                                      );
                                                                      setEditCommentLocal(
                                                                        declinedData
                                                                      );
                                                                      setParentMinuteID(
                                                                        minuteDataSubminute
                                                                      );
                                                                      setIsAgenda(
                                                                        true
                                                                      );
                                                                    }}
                                                                    text={t(
                                                                      "Edit"
                                                                    )}
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
                                                                    text={t(
                                                                      "Delete"
                                                                    )}
                                                                    className={
                                                                      styles[
                                                                        "Reject-comment"
                                                                      ]
                                                                    }
                                                                  />
                                                                </Col>
                                                              </>
                                                            ) : null}
                                                            {declinedData.fK_WorkFlowActor_ID ===
                                                            0 ? (
                                                              <Col
                                                                lg={6}
                                                                md={6}
                                                                sm={12}
                                                                className="d-grid justify-content-end p-0"
                                                              >
                                                                <Button
                                                                  // onClick={() => {
                                                                  //   dispatch(
                                                                  //     editCommentModal(
                                                                  //       true
                                                                  //     )
                                                                  //   );
                                                                  //   setEditCommentLocal(
                                                                  //     declinedData
                                                                  //   );
                                                                  // }}
                                                                  onClick={() => {
                                                                    dispatch(
                                                                      editCommentModal(
                                                                        true
                                                                      )
                                                                    );
                                                                    setEditCommentLocal(
                                                                      declinedData
                                                                    );
                                                                    setParentMinuteID(
                                                                      minuteDataSubminute
                                                                    );
                                                                    setIsAgenda(
                                                                      true
                                                                    );
                                                                  }}
                                                                  text={t(
                                                                    "Edit"
                                                                  )}
                                                                  className={
                                                                    styles[
                                                                      "Reject-comment"
                                                                    ]
                                                                  }
                                                                />
                                                                <Button
                                                                  // onClick={() => {
                                                                  //   dispatch(
                                                                  //     deleteCommentModal(
                                                                  //       true
                                                                  //     )
                                                                  //   );
                                                                  //   setDeleteCommentLocal(
                                                                  //     declinedData
                                                                  //   );
                                                                  // }}
                                                                  onClick={() => {
                                                                    dispatch(
                                                                      deleteCommentModal(
                                                                        true
                                                                      )
                                                                    );
                                                                    setDeleteCommentLocal(
                                                                      declinedData
                                                                    );
                                                                    setParentMinuteID(
                                                                      minuteDataSubminute
                                                                    );
                                                                    setIsAgenda(
                                                                      true
                                                                    );
                                                                  }}
                                                                  text={t(
                                                                    "Delete"
                                                                  )}
                                                                  className={
                                                                    styles[
                                                                      "Reject-comment"
                                                                    ]
                                                                  }
                                                                />
                                                              </Col>
                                                            ) : null}
                                                          </Row>
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </Col>
                                                </Row>
                                              </>
                                            );
                                          }
                                        )}
                                      {minuteDataSubminute.agendaMinutesVersionHistory
                                        .slice()
                                        .reverse()
                                        .map((historyData, index) => {
                                          const isLastIndex =
                                            index ===
                                            minuteDataSubminute
                                              .agendaMinutesVersionHistory
                                              .length -
                                              1;
                                          return (
                                            <>
                                              <Row
                                                className={
                                                  currentLanguage === "ar"
                                                    ? "mxr-50"
                                                    : "mxl-50"
                                                }
                                              >
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className="position-relative"
                                                >
                                                  <div
                                                    className={
                                                      historyData
                                                        .declinedReviews
                                                        .length > 0 ||
                                                      !isLastIndex
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
                                                      {
                                                        historyData.versionNumber
                                                      }
                                                      .0
                                                    </span>
                                                  </div>
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
                                                        : styles[
                                                            "uploaded-details"
                                                          ]
                                                    }
                                                  >
                                                    <Row
                                                      className={
                                                        styles["inherit-height"]
                                                      }
                                                    >
                                                      <Col
                                                        lg={8}
                                                        md={8}
                                                        sm={12}
                                                      >
                                                        <p
                                                          dangerouslySetInnerHTML={{
                                                            __html:
                                                              historyData.minutesDetails,
                                                          }}
                                                          className={
                                                            styles[
                                                              "minutes-text"
                                                            ]
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
                                                                styles[
                                                                  "bar-line"
                                                                ]
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
                                                                ? t(
                                                                    "Uploaded-by"
                                                                  )
                                                                : t(
                                                                    "Reviewed-by"
                                                                  )}
                                                            </p>
                                                            <div
                                                              className={
                                                                styles["gap-ti"]
                                                              }
                                                            >
                                                              <img
                                                                src={`data:image/jpeg;base64,${minutesAgenda[0]?.minuteData[0]?.userProfilePicture?.displayProfilePictureName}`}
                                                                className={
                                                                  styles[
                                                                    "Image"
                                                                  ]
                                                                }
                                                                alt=""
                                                                draggable={
                                                                  false
                                                                }
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
                                                                    ?.minuteData[0]
                                                                    ?.userName
                                                                }
                                                              </p>
                                                            </div>
                                                          </Col>
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
                                              {historyData.declinedReviews
                                                .length > 0 ? (
                                                <Row className="mx-50">
                                                  <Col lg={12} md={12} sm={12}>
                                                    <div
                                                      className={
                                                        styles[
                                                          "wrapper-userlist"
                                                        ]
                                                      }
                                                    >
                                                      <p>
                                                        {t(
                                                          "This minute is rejected by: "
                                                        )}
                                                        {historyData.declinedReviews
                                                          .slice(0, 5)
                                                          .map(
                                                            (
                                                              usersList,
                                                              index
                                                            ) => (
                                                              <React.Fragment
                                                                key={index}
                                                              >
                                                                {
                                                                  usersList.actorName
                                                                }
                                                                {index !== 4 &&
                                                                  index <
                                                                    historyData
                                                                      .declinedReviews
                                                                      .length -
                                                                      1 &&
                                                                  ", "}
                                                              </React.Fragment>
                                                            )
                                                          )}
                                                        {historyData
                                                          .declinedReviews
                                                          .length > 5 && (
                                                          <>
                                                            {" and "}
                                                            {historyData
                                                              .declinedReviews
                                                              .length - 5}{" "}
                                                            {historyData
                                                              .declinedReviews
                                                              .length -
                                                              5 ===
                                                            1
                                                              ? "more"
                                                              : "more"}
                                                          </>
                                                        )}
                                                      </p>
                                                      <p
                                                        className="text-decoration-underline cursor-pointer"
                                                        onClick={() =>
                                                          toggleShowHide(
                                                            historyData.minuteID
                                                          )
                                                        }
                                                      >
                                                        {visibleParentMinuteIDs.includes(
                                                          historyData.minuteID
                                                        )
                                                          ? t("Hide-comments")
                                                          : t("Show-comments")}
                                                      </p>
                                                    </div>
                                                  </Col>
                                                </Row>
                                              ) : null}
                                              {visibleParentMinuteIDs.includes(
                                                historyData.minuteID
                                              ) &&
                                                historyData.declinedReviews.map(
                                                  (
                                                    declinedDataHistory,
                                                    index
                                                  ) => {
                                                    const isLastIndexx =
                                                      index ===
                                                      historyData
                                                        .declinedReviews
                                                        .length -
                                                        1;
                                                    return (
                                                      <>
                                                        <Row
                                                          className={
                                                            currentLanguage ===
                                                            "ar"
                                                              ? "mxr-50"
                                                              : "mxl-50"
                                                          }
                                                        >
                                                          <Col
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            className="position-relative"
                                                          >
                                                            {declinedDataHistory.length ===
                                                            0 ? (
                                                              <div
                                                                className={
                                                                  !isLastIndexx
                                                                    ? styles[
                                                                        "version-control-wrapper-with-more"
                                                                      ]
                                                                    : styles[
                                                                        "version-control-wrapper-with-more-last"
                                                                      ]
                                                                }
                                                              ></div>
                                                            ) : (
                                                              <div
                                                                className={
                                                                  !isLastIndexx
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
                                                                styles[
                                                                  "uploaded-details"
                                                                ]
                                                              }
                                                            >
                                                              <Row
                                                                className={
                                                                  styles[
                                                                    "inherit-height"
                                                                  ]
                                                                }
                                                              >
                                                                <Col
                                                                  lg={8}
                                                                  md={8}
                                                                  sm={12}
                                                                >
                                                                  <p
                                                                    className={
                                                                      styles[
                                                                        "minutes-text"
                                                                      ]
                                                                    }
                                                                  >
                                                                    {
                                                                      declinedDataHistory.reason
                                                                    }
                                                                  </p>
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
                                                                          styles[
                                                                            "bar-line"
                                                                          ]
                                                                        }
                                                                      ></span>
                                                                      <p
                                                                        className={
                                                                          styles[
                                                                            "uploadedbyuser"
                                                                          ]
                                                                        }
                                                                      >
                                                                        {t(
                                                                          "Reviewed-by"
                                                                        )}
                                                                      </p>
                                                                      <div
                                                                        className={
                                                                          styles[
                                                                            "gap-ti"
                                                                          ]
                                                                        }
                                                                      >
                                                                        <img
                                                                          src={`data:image/jpeg;base64,${declinedDataHistory?.userProfilePicture?.displayProfilePictureName}`}
                                                                          className={
                                                                            styles[
                                                                              "Image"
                                                                            ]
                                                                          }
                                                                          alt=""
                                                                          draggable={
                                                                            false
                                                                          }
                                                                        />
                                                                        <p
                                                                          className={
                                                                            styles[
                                                                              "agendaCreater"
                                                                            ]
                                                                          }
                                                                        >
                                                                          {
                                                                            declinedDataHistory.actorName
                                                                          }
                                                                        </p>
                                                                      </div>
                                                                    </Col>

                                                                    {declinedDataHistory.fK_WorkFlowActor_ID ===
                                                                    0 ? (
                                                                      <Col
                                                                        lg={6}
                                                                        md={6}
                                                                        sm={12}
                                                                        className="d-grid justify-content-end p-0"
                                                                      >
                                                                        <Button
                                                                          // onClick={() => {
                                                                          //   dispatch(
                                                                          //     editCommentModal(
                                                                          //       true
                                                                          //     )
                                                                          //   );
                                                                          //   setEditCommentLocal(
                                                                          //     declinedDataHistory
                                                                          //   );
                                                                          // }}
                                                                          onClick={() => {
                                                                            dispatch(
                                                                              editCommentModal(
                                                                                true
                                                                              )
                                                                            );
                                                                            setEditCommentLocal(
                                                                              declinedDataHistory
                                                                            );
                                                                            setParentMinuteID(
                                                                              minuteDataSubminute
                                                                            );
                                                                            setIsAgenda(
                                                                              true
                                                                            );
                                                                          }}
                                                                          text={t(
                                                                            "Edit"
                                                                          )}
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
                                                                          text={t(
                                                                            "Delete"
                                                                          )}
                                                                          className={
                                                                            styles[
                                                                              "Reject-comment"
                                                                            ]
                                                                          }
                                                                        />
                                                                      </Col>
                                                                    ) : null}
                                                                  </Row>
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                      </>
                                                    );
                                                  }
                                                )}
                                            </>
                                          );
                                        })}
                                    </>
                                  );
                                }
                              )}
                            </>
                          );
                        })}
                      </>
                    </>
                  );
                })
              : null}

            {minutesGeneral?.map((data, index) => {
              return (
                <>
                  <Row className="mx-50">
                    <Col lg={12} md={12} sm={12}>
                      <p className={styles["Parent-title-heading"]}>
                        {index + 1 + ". " + t("General-minutes")}
                      </p>
                    </Col>
                  </Row>
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="position-relative"
                      >
                        {data.generalMinutesVersionHistory.length === 0 &&
                        data.declinedReviews.length === 0 ? null : (
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
                              <Row>
                                {data.minuteAttachmentFiles.length > 0 &&
                                  data.minuteAttachmentFiles.map(
                                    (filesData, index) => {
                                      return (
                                        <Col sm={3} md={3} lg={3}>
                                          <AttachmentViewer
                                            handleClickDownload={() =>
                                              downloadDocument(filesData)
                                            }
                                            fk_UID={0}
                                            data={data.attachments}
                                            id={filesData.pK_FileID}
                                            name={filesData.displayFileName}
                                            handleEyeIcon={() =>
                                              pdfData(
                                                filesData,
                                                getFileExtension(
                                                  filesData?.displayFileName
                                                )
                                              )
                                            }
                                          />
                                          {/* <AttachmentViewer
                                                      name={
                                                        filesData.displayFileName
                                                      }
                                                    /> */}
                                        </Col>
                                      );
                                    }
                                  )}
                              </Row>
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
                                      onClick={() => acceptMinute(data)}
                                    />
                                  ) : data.actorBundleStatusID === 4 ? (
                                    <Button
                                      text={t("Accept")}
                                      className={styles["Reject-comment"]}
                                      onClick={() => acceptMinute(data)}
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
                                      onClick={() => rejectGeneralComment(data)}
                                    />
                                  ) : data.actorBundleStatusID === 4 ? (
                                    <>
                                      <Button
                                        text={t("Rejected")}
                                        className={styles["Rejected-comment"]}
                                      />
                                    </>
                                  ) : null}
                                </Col>
                              </Row>

                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <p className={styles["time-uploader"]}>
                                    {convertToGMTMinuteTime(
                                      data.lastUpdatedTime
                                    )}
                                    ,
                                  </p>
                                  <p className={styles["date-uploader"]}>
                                    {convertDateToGMTMinute(
                                      data.lastUpdatedDate
                                    )}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                    {data.declinedReviews.length > 0 ? (
                      <Row className="mx-50">
                        <Col lg={12} md={12} sm={12}>
                          <div className={styles["wrapper-userlist"]}>
                            <p>
                              {t("This minute is rejected by: ")}
                              {data.declinedReviews
                                .slice(0, 5)
                                .map((usersList, index) => (
                                  <React.Fragment key={index}>
                                    {usersList.actorName}
                                    {index !== 4 &&
                                      index < data.declinedReviews.length - 1 &&
                                      ", "}
                                  </React.Fragment>
                                ))}
                              {data.declinedReviews.length > 5 && (
                                <>
                                  {" and "}
                                  {data.declinedReviews.length - 5}{" "}
                                  {data.declinedReviews.length - 5 === 1
                                    ? "more"
                                    : "more"}
                                </>
                              )}
                            </p>
                            <p
                              className="text-decoration-underline cursor-pointer"
                              onClick={() => toggleShowHide(data.minuteID)}
                            >
                              {visibleParentMinuteIDs.includes(data.minuteID)
                                ? t("Hide-comments")
                                : t("Show-comments")}
                            </p>
                          </div>
                        </Col>
                      </Row>
                    ) : null}

                    {visibleParentMinuteIDs.includes(data.minuteID) &&
                      data?.declinedReviews.map((declinedData, index) => {
                        const isLastIndex =
                          index === data.declinedReviews.length - 1;
                        return (
                          <>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="position-relative"
                              >
                                {declinedData.length === 0 ? (
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
                                  ></div>
                                ) : (
                                  <div
                                    className={
                                      !isLastIndex ||
                                      data.generalMinutesVersionHistory.length >
                                        0
                                        ? styles["version-control-wrapper"]
                                        : styles["version-control-wrapper-last"]
                                    }
                                  ></div>
                                )}
                                <div className={styles["uploaded-details"]}>
                                  <Row className={styles["inherit-height"]}>
                                    <Col lg={8} md={8} sm={12}>
                                      <p className={styles["minutes-text"]}>
                                        {declinedData.reason}
                                      </p>
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
                                            className={styles["uploadedbyuser"]}
                                          >
                                            {t("Reviewed-by")}
                                          </p>
                                          <div className={styles["gap-ti"]}>
                                            <img
                                              src={`data:image/jpeg;base64,${declinedData?.userProfilePicture?.displayProfilePictureName}`}
                                              className={styles["Image"]}
                                              alt=""
                                              draggable={false}
                                            />
                                            <p
                                              className={
                                                styles["agendaCreater"]
                                              }
                                            >
                                              {declinedData.actorName}
                                            </p>
                                          </div>
                                        </Col>
                                        {declinedData.fK_WorkFlowActor_ID !==
                                          0 &&
                                        Number(declinedData.fK_UID) ===
                                          currentUserID ? (
                                          <Col
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            className="d-grid justify-content-end p-0"
                                          >
                                            <Button
                                              onClick={() => {
                                                dispatch(
                                                  editCommentModal(true)
                                                );
                                                setEditCommentLocal(
                                                  declinedData
                                                );
                                                setParentMinuteID(data);
                                                setIsAgenda(false);
                                              }}
                                              text={t("Edit")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                            />
                                            <Button
                                              // onClick={() => {
                                              //   dispatch(
                                              //     deleteCommentModal(true)
                                              //   );
                                              //   setDeleteCommentLocal(
                                              //     declinedData
                                              //   );
                                              // }}
                                              onClick={() => {
                                                dispatch(
                                                  deleteCommentModal(true)
                                                );
                                                setDeleteCommentLocal(
                                                  declinedData
                                                );
                                                setParentMinuteID(data);
                                                setIsAgenda(false);
                                              }}
                                              text={t("Delete")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                            />
                                          </Col>
                                        ) : null}
                                        {declinedData.fK_WorkFlowActor_ID ===
                                        0 ? (
                                          <Col
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            className="d-grid justify-content-end p-0"
                                          >
                                            <Button
                                              onClick={() => {
                                                dispatch(
                                                  editCommentModal(true)
                                                );
                                                setEditCommentLocal(
                                                  declinedData
                                                );
                                                setParentMinuteID(data);
                                                setIsAgenda(false);
                                              }}
                                              text={t("Edit")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                            />
                                            <Button
                                              // onClick={() => {
                                              //   dispatch(
                                              //     deleteCommentModal(true)
                                              //   );
                                              //   setDeleteCommentLocal(
                                              //     declinedData
                                              //   );
                                              // }}
                                              onClick={() => {
                                                dispatch(
                                                  deleteCommentModal(true)
                                                );
                                                setDeleteCommentLocal(
                                                  declinedData
                                                );
                                                setParentMinuteID(data);
                                                setIsAgenda(false);
                                              }}
                                              text={t("Delete")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                            />
                                          </Col>
                                        ) : null}
                                      </Row>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                          </>
                        );
                      })}
                    {data?.generalMinutesVersionHistory
                      .slice()
                      .reverse()
                      .map((historyData, index) => {
                        const isLastIndex =
                          index ===
                          data.generalMinutesVersionHistory.length - 1;
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
                                    historyData.declinedReviews.length > 0 ||
                                    !isLastIndex
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
                                          <p
                                            className={styles["uploadedbyuser"]}
                                          >
                                            {historyData.declinedReviews
                                              .length === 0
                                              ? t("Uploaded-by")
                                              : t("Reviewed-by")}
                                          </p>
                                          <div className={styles["gap-ti"]}>
                                            <img
                                              src={`data:image/jpeg;base64,${minutesAgenda[0]?.minuteData[0]?.userProfilePicture?.displayProfilePictureName}`}
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
                                                minutesAgenda[0]?.minuteData[0]
                                                  ?.userName
                                              }
                                            </p>
                                          </div>
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col lg={12} md={12} sm={12}>
                                          <p
                                            className={styles["time-uploader"]}
                                          >
                                            {convertToGMTMinuteTime(
                                              historyData.lastUpdatedTime
                                            )}
                                            ,
                                          </p>
                                          <p
                                            className={styles["date-uploader"]}
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

                            {historyData.declinedReviews.length > 0 ? (
                              <Row className="mx-50">
                                <Col lg={12} md={12} sm={12}>
                                  <div className={styles["wrapper-userlist"]}>
                                    <p>
                                      {t("This minute is rejected by: ")}
                                      {historyData.declinedReviews
                                        .slice(0, 5)
                                        .map((usersList, index) => (
                                          <React.Fragment key={index}>
                                            {usersList.actorName}
                                            {index !== 4 &&
                                              index <
                                                historyData.declinedReviews
                                                  .length -
                                                  1 &&
                                              ", "}
                                          </React.Fragment>
                                        ))}
                                      {historyData.declinedReviews.length >
                                        5 && (
                                        <>
                                          {" and "}
                                          {historyData.declinedReviews.length -
                                            5}{" "}
                                          {historyData.declinedReviews.length -
                                            5 ===
                                          1
                                            ? "more"
                                            : "more"}
                                        </>
                                      )}
                                    </p>
                                    <p
                                      className="text-decoration-underline cursor-pointer"
                                      onClick={() =>
                                        toggleShowHide(historyData.minuteID)
                                      }
                                    >
                                      {visibleParentMinuteIDs.includes(
                                        historyData.minuteID
                                      )
                                        ? t("Hide-comments")
                                        : t("Show-comments")}
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                            ) : null}
                            {visibleParentMinuteIDs.includes(
                              historyData.minuteID
                            ) &&
                              historyData.declinedReviews.map(
                                (declinedDataHistory, index) => {
                                  const isLastIndexx =
                                    index ===
                                    historyData.declinedReviews.length - 1;
                                  return (
                                    <>
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="position-relative"
                                        >
                                          {declinedDataHistory.length === 0 ? (
                                            <div
                                              className={
                                                !isLastIndexx
                                                  ? styles[
                                                      "version-control-wrapper-with-more"
                                                    ]
                                                  : styles[
                                                      "version-control-wrapper-with-more-last"
                                                    ]
                                              }
                                            ></div>
                                          ) : (
                                            <div
                                              className={
                                                !isLastIndexx
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
                                              styles["uploaded-details"]
                                            }
                                          >
                                            <Row
                                              className={
                                                styles["inherit-height"]
                                              }
                                            >
                                              <Col lg={8} md={8} sm={12}>
                                                <p
                                                  className={
                                                    styles["minutes-text"]
                                                  }
                                                >
                                                  {declinedDataHistory.reason}
                                                </p>
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
                                                        src={`data:image/jpeg;base64,${declinedDataHistory?.userProfilePicture?.displayProfilePictureName}`}
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
                                                          declinedDataHistory.actorName
                                                        }
                                                      </p>
                                                    </div>
                                                  </Col>
                                                  {declinedDataHistory.fK_WorkFlowActor_ID ===
                                                  0 ? (
                                                    <Col
                                                      lg={6}
                                                      md={6}
                                                      sm={12}
                                                      className="d-grid justify-content-end p-0"
                                                    >
                                                      <Button
                                                        onClick={() => {
                                                          dispatch(
                                                            editCommentModal(
                                                              true
                                                            )
                                                          );
                                                          setEditCommentLocal(
                                                            declinedDataHistory
                                                          );
                                                          setParentMinuteID(
                                                            data
                                                          );
                                                          setIsAgenda(false);
                                                        }}
                                                        text={t("Edit")}
                                                        className={
                                                          styles[
                                                            "Reject-comment"
                                                          ]
                                                        }
                                                      />
                                                      <Button
                                                        onClick={() => {
                                                          dispatch(
                                                            deleteCommentModal(
                                                              true
                                                            )
                                                          );
                                                          setDeleteCommentLocal(
                                                            declinedDataHistory
                                                          );
                                                          setParentMinuteID(
                                                            historyData
                                                          );
                                                          setIsAgenda(false);
                                                        }}
                                                        text={t("Delete")}
                                                        className={
                                                          styles[
                                                            "Reject-comment"
                                                          ]
                                                        }
                                                      />
                                                    </Col>
                                                  ) : null}
                                                </Row>
                                              </Col>
                                            </Row>
                                          </div>
                                        </Col>
                                      </Row>
                                    </>
                                  );
                                }
                              )}
                          </>
                        );
                      })}
                  </>
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
                onClick={submitReviews}
                disableBtn={disableSubmit}
              />
            </Col>
          </Row>
        </div>
      </Paper>
      {MinutesReducer.rejectCommentModal ? (
        <RejectCommentModal
          minuteDataToReject={minuteDataToReject}
          setMinuteDataToReject={setMinuteDataToReject}
          isAgenda={isAgenda}
          setIsAgenda={setIsAgenda}
          setMinutesToReview={setMinutesToReview}
          minutesToReview={minutesToReview}
          currentUserID={currentUserID}
          deleteCommentLocal={deleteCommentLocal}
        />
      ) : null}
      {MinutesReducer.editCommentModal ? (
        <EditCommentModal
          minutesAgenda={minutesAgenda}
          setMinutesAgenda={setMinutesAgenda}
          minutesGeneral={minutesGeneral}
          setMinutesGeneral={setMinutesGeneral}
          editCommentLocal={editCommentLocal}
          setEditCommentLocal={setEditCommentLocal}
          parentMinuteID={parentMinuteID}
          setParentMinuteID={setParentMinuteID}
          currentUserID={currentUserID}
          currentUserName={currentUserName}
          isAgenda={isAgenda}
        />
      ) : null}
      {MinutesReducer.deleteCommentModal ? (
        <DeleteCommentModal
          minutesAgenda={minutesAgenda}
          setMinutesAgenda={setMinutesAgenda}
          minutesGeneral={minutesGeneral}
          setMinutesGeneral={setMinutesGeneral}
          deleteCommentLocal={deleteCommentLocal}
          setDeleteCommentLocal={setDeleteCommentLocal}
          editCommentLocal={editCommentLocal}
          setEditCommentLocal={setEditCommentLocal}
          parentMinuteID={parentMinuteID}
          setParentMinuteID={setParentMinuteID}
          currentUserID={currentUserID}
          currentUserName={currentUserName}
          isAgenda={isAgenda}
          minutesToReview={minutesToReview}
          setMinutesToReview={setMinutesToReview}
        />
      ) : null}
      {MinutesReducer.acceptCommentModal ? (
        <AcceptCommentModal
          minutesAgenda={minutesAgenda}
          setMinutesAgenda={setMinutesAgenda}
          minutesGeneral={minutesGeneral}
          setMinutesGeneral={setMinutesGeneral}
          minutesToReview={minutesToReview}
          setMinutesToReview={setMinutesToReview}
          currentUserID={currentUserID}
        />
      ) : null}
    </section>
  );
};
export default ReviewMinutes; // Exporting pending approval component
