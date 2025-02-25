import React, { useState, useRef, useEffect, useCallback } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // Importing translation hook
import styles from "./ReviewMinutes.module.css"; // Importing CSS module
import { useDispatch } from "react-redux"; // Importing Redux hook
import { useNavigate } from "react-router-dom"; // Importing navigation hook
import { Button, AttachmentViewer } from "../../../components/elements";
import {
  reviewMinutesPage,
  pendingApprovalPage,
  rejectCommentModal,
  editCommentModal,
  deleteCommentModal,
  GetMinutesForReviewerByMeetingId,
  acceptCommentModal,
  AcceptRejectMinuteReview,
} from "../../../store/actions/Minutes_action";
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
import { fileFormatforSignatureFlow } from "../../../commen/functions/utils.js";
import { forRecentActivity } from "../../../commen/functions/date_formater.js";

// Functional component for pending approvals section
const ReviewMinutes = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook
  const navigate = useNavigate(); // Navigation hook
  const [minuteStatus, setMinuteStatus] = useState(0); // Local state for minute status
  let MinutesPublishedNotificationStatus = JSON.parse(
    localStorage.getItem("MinutesPublishedStatus")
  );
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentUserName = localStorage.getItem("name");
  console.log(minuteStatus, "minuteStatusminuteStatus");
  console.log(MinutesPublishedNotificationStatus, "minuteStatusminuteStatus");

  const currentMeetingMinutesToReviewData = useSelector(
    (state) => state.MinutesReducer.currentMeetingMinutesToReviewData
  );

  const GetMinutesForReviewerByMeetingIdData = useSelector(
    (state) => state.MinutesReducer.GetMinutesForReviewerByMeetingIdData
  );
  const CurrentUserPicture = useSelector(
    (state) => state.MinutesReducer.CurrentUserPicture
  );

  const RejectCommentModalReducer = useSelector(
    (state) => state.MinutesReducer.rejectCommentModal
  );
  const EditCommentModalReducer = useSelector(
    (state) => state.MinutesReducer.editCommentModal
  );
  const DeleteCommentModalReducer = useSelector(
    (state) => state.MinutesReducer.deleteCommentModal
  );
  const AcceptCommentModalReducer = useSelector(
    (state) => state.MinutesReducer.acceptCommentModal
  );
  const getallDocumentsForAgendaWiseMinutes = useSelector(
    (state) => state.NewMeetingreducer.getallDocumentsForAgendaWiseMinutes
  );

  //Web Notification Click Actor Status ID
  const WebNotificationClickActorStatusIDMinutes = useSelector(
    (state) => state.MinutesReducer.WorkFlowActorStatusData?.data ?? null
  );

  console.log(
    WebNotificationClickActorStatusIDMinutes,
    "currentMeetingMinutesToReviewData"
  );
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
  const [minuteViewFlag, setMinuteViewFlag] = useState(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  console.log(
    { minutesAgenda, minutesGeneral },
    "minutesGeneralminutesGeneral"
  );
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
    if (
      currentMeetingMinutesToReviewData !== null &&
      currentMeetingMinutesToReviewData !== undefined
    ) {
      let getDeadlineformated = forRecentActivity(
        currentMeetingMinutesToReviewData.deadline
      );
      console.log(
        currentMeetingMinutesToReviewData,
        "currentMeetingMinutesToReviewDatacurrentMeetingMinutesToReviewData"
      );
      let currentDate = new Date();
      let getDeadlineIsPassed = currentDate > getDeadlineformated;
      setMinuteStatus(currentMeetingMinutesToReviewData.statusID);
      if (getDeadlineIsPassed === true) {
        setDisableSubmit(getDeadlineIsPassed);
      } else {
        let result = checkActorBundleStatus(minutesAgenda, minutesGeneral);
        console.log(result, "resultresult");
        setDisableSubmit(result);
      }
      console.log(
        getDeadlineIsPassed,
        "currentMeetingMinutesToReviewDatacurrentMeetingMinutesToReviewData"
      );
    }
  }, [currentMeetingMinutesToReviewData, minutesAgenda, minutesGeneral]);
  // useEffect(() => {

  // }, [minutesAgenda, minutesGeneral]);

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
      MeetingID: currentMeetingMinutesToReviewData?.meetingID,
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
    console.log(minutesData, "minutesDataminutesData updateAcceptMinutes");
    return minutesData.map((agenda) => {
      // Update main minuteData
      const updatedMinuteData = agenda.minuteData.map((minute) => {
        if (minute.minuteID === rejectData.minuteID) {
          console.log(
            minute.minuteID,
            rejectData.minuteID,
            minute,
            "minutesDataminutesData updateAcceptMinutes"
          );

          return {
            ...minute,
            reason: "",
            actorBundleStatusID: 3,
            declinedReviews:
              minute.declinedReviews.length > 0
                ? minute.declinedReviews.filter(
                    (userReview, index) => currentUserID !== userReview.fK_UID
                  )
                : [],
          };
        }
        return minute;
      });

      // Update subMinutes if they exist
      const updatedSubMinutes = agenda.subMinutes?.map((subAgenda) => {
        const updatedSubMinuteData = subAgenda.minuteData.map((subMinute) => {
          if (subMinute.minuteID === rejectData.minuteID) {
            console.log(
              subMinute.minuteID,
              rejectData.minuteID,
              subMinute,
              "minutesDataminutesData updateAcceptMinutes"
            );

            return {
              ...subMinute,
              reason: "",
              actorBundleStatusID: 3,
              declinedReviews:
                subMinute.declinedReviews.length > 0
                  ? subMinute.declinedReviews.filter(
                      (userReview, index) => currentUserID !== userReview.fK_UID
                    )
                  : [],
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
        console.log(
          minute.minuteID,
          data.minuteID,
          minute,
          "acceptMinuteacceptMinute minuteminute"
        );
        return {
          ...minute,
          reason: "",
          actorBundleStatusID: 3,
          declinedReviews:
            minute.declinedReviews.length > 0
              ? minute.declinedReviews.filter(
                  (userReview, index) => currentUserID !== userReview.fK_UID
                )
              : [],
        };
      }
      console.log(minute, "acceptMinuteacceptMinute minuteminute");

      return minute;
    });
    console.log(
      { updatedMinutesGeneral },
      "acceptMinuteacceptMinute minuteminute"
    );

    setMinutesAgenda(updatedMinutesAgenda);
    setMinutesGeneral(updatedMinutesGeneral);
    if (minutesToReview !== 0) {
      setMinutesToReview(minutesToReview - 1 !== 0 ? minutesToReview - 1 : 0);
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

  const rejectGeneralComment = (data, minuteflag, isAgenda) => {
    dispatch(rejectCommentModal(true));
    // 0 for general
    // 1 for Agenda Minutes
    // 2 for Sub Agenda Minute
    setMinuteDataToReject(data);
    setIsAgenda(isAgenda);
    setMinuteViewFlag(minuteflag);
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
    if (fileFormatforSignatureFlow.includes(ext)) {
      window.open(
        `/#/Diskus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };
  console.log("minutesToReview", minutesToReview);
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
      setMinutesToReview(0);
      dispatch(rejectCommentModal(false));
    };
  }, []); // This effect runs once after the component mounts

  useEffect(() => {
    try {
      //If the User Been Redirected By Clicking on the Notification that has been Added as a reviewer in the Particular meeting minutes
      if (JSON.parse(localStorage.getItem("MinutesOperations")) === true) {
        let NotificationClickMeetingMinutesID = localStorage.getItem(
          "NotificationClickMinutesMeetingID"
        );
        let allAgendaWiseDocs = {
          MDID: Number(NotificationClickMeetingMinutesID),
        };
        let Data = {
          MeetingID: Number(NotificationClickMeetingMinutesID),
        };
        dispatch(
          AllDocumentsForAgendaWiseMinutesApiFunc(
            navigate,
            allAgendaWiseDocs,
            t
          )
        );

        dispatch(
          DocumentsOfMeetingGenralMinutesApiFunc(navigate, allAgendaWiseDocs, t)
        );

        dispatch(GetMinutesForReviewerByMeetingId(Data, navigate, t));
      } else {
        let allAgendaWiseDocs = {
          MDID: currentMeetingMinutesToReviewData?.meetingID,
        };
        let Data = {
          MeetingID: currentMeetingMinutesToReviewData?.meetingID,
        };
        dispatch(
          AllDocumentsForAgendaWiseMinutesApiFunc(
            navigate,
            allAgendaWiseDocs,
            t
          )
        );

        dispatch(
          DocumentsOfMeetingGenralMinutesApiFunc(navigate, allAgendaWiseDocs, t)
        );

        dispatch(GetMinutesForReviewerByMeetingId(Data, navigate, t));
      }
    } catch {}
    return () => {
      localStorage.removeItem("MinutesOperations");
      localStorage.removeItem("NotificationClickMinutesMeetingID");
      localStorage.removeItem("MinutesPublishedStatus");
      dispatch(reviewMinutesPage(false));
    };
  }, []);

  useEffect(() => {
    try {
      const reducerData = GetMinutesForReviewerByMeetingIdData;
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
                      getallDocumentsForAgendaWiseMinutes?.data?.find(
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
                  getallDocumentsForAgendaWiseMinutes.data.find(
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
    } catch (error) {
      console.error("Error transforming data", error);
    }
  }, [GetMinutesForReviewerByMeetingIdData]);

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

  // useEffect(() => {
  //   try {
  //     if (minuteDataToReject) {
  //       const rejectMinuteData = minuteDataToReject;

  //       // Update MinutesAgenda
  //       let updatedMinutesAgenda = updateRejectMinutes(
  //         minutesAgenda,
  //         rejectMinuteData
  //       );

  //       updatedMinutesAgenda = filterEmptyReasons(updatedMinutesAgenda);

  //       // Update MinutesGeneral
  //       let updatedMinutesData = updateRejectMinutesGeneral(
  //         minutesGeneral,
  //         rejectMinuteData
  //       );

  //       updatedMinutesData =
  //         filterEmptyReasonsForStateGeneral(updatedMinutesData);

  //       setMinutesAgenda(updatedMinutesAgenda);
  //       setMinutesGeneral(updatedMinutesData);
  //     }
  //   } catch {}
  // }, [minuteDataToReject]);

  const handleClickRejectMinuteBtn = useCallback(
    (commentText) => {
      if (minuteViewFlag === 0) {
        const updatedMinuteData = {
          ...minuteDataToReject,
          reason: commentText,
          actorBundleStatusID: 4,
          userProfilePicture: {
            userID: currentUserID,
            orignalProfilePictureName: "",
            displayProfilePictureName:
              CurrentUserPicture?.displayProfilePictureName,
          },
        };
        // there should be a for general minute
        let updatedMinutesData = updateRejectMinutesGeneral(
          minutesGeneral,
          updatedMinuteData
        );
        console.log(
          { updatedMinutesData },
          "updatedMinutesAgendaupdatedMinutesAgenda"
        );
        setMinutesGeneral(updatedMinutesData);
        setMinutesToReview(minutesToReview - 1 !== 0 ? minutesToReview - 1 : 0);
      } else if (minuteViewFlag === 2 || minuteViewFlag === 1) {
        const updatedMinuteData = {
          ...minuteDataToReject,
          reason: commentText,
          actorBundleStatusID: 4,
          userProfilePicture: {
            userID: currentUserID,
            orignalProfilePictureName: "",
            displayProfilePictureName:
              CurrentUserPicture?.displayProfilePictureName,
          },
        };
        // there should be for subAgenda Minute
        let updatedMinutesAgenda = updateRejectMinutes(
          minutesAgenda,
          updatedMinuteData
        );
        console.log(
          { updatedMinutesAgenda },
          "updatedMinutesAgendaupdatedMinutesAgenda"
        );
        setMinutesAgenda(updatedMinutesAgenda);
        setMinutesToReview(minutesToReview - 1 !== 0 ? minutesToReview - 1 : 0);
      }
      dispatch(rejectCommentModal(false));
    },
    [minuteDataToReject, minuteViewFlag]
  );

  //Disable Function for Accept All
  const calculateIsDisabled = () => {
    const minutesOperations = JSON.parse(
      localStorage.getItem("MinutesOperations")
    );

    if (minutesOperations === true) {
      return minutesToReview === 0
        ? true
        : Number(
            WebNotificationClickActorStatusIDMinutes?.workFlowStatusID ?? 0
          ) === 2;
    } else {
      return minutesToReview === 0
        ? true
        : Number(currentMeetingMinutesToReviewData?.statusID ?? 0) === 2;
    }
  };

  return (
    <section className={styles["pendingApprovalContainer"]}>
      {/* Container for pending approval section */}
      <Row className="my-3 d-flex align-items-center">
        <Col sm={12} md={12} lg={12}>
          <span className={styles["pendingApprovalHeading"]}>
            {currentMeetingMinutesToReviewData?.title}
          </span>
        </Col>
      </Row>
      <span className={styles["pendingApprovalPaper"]}>
        {/* Paper component for styling */}
        <div className={styles["main-wrapper"]}>
          <Row className="py-3 mx-50">
            <Col sm={12} md={6} lg={6}>
              <span className={styles["pendingApprovalHeading"]}>
                {t("Review-minutes")}
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
                text={t("Accept-all")}
                disableBtn={calculateIsDisabled()}
                //Disabled Due To Web Notification
                // disableBtn={
                //   minutesToReview === 0
                //     ? true
                //     : Number(currentMeetingMinutesToReviewData.statusID) === 2
                //     ? true
                //     : false
                // }
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
                          console.log(parentMinutedata, "parentMinutedata");
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
                                          {minuteStatus !== 2 && (
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
                                                    acceptMinute(
                                                      parentMinutedata
                                                    )
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
                                                    acceptMinute(
                                                      parentMinutedata
                                                    )
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
                                                  // disableBtn={true}
                                                  onClick={() =>
                                                    rejectGeneralComment(
                                                      parentMinutedata,
                                                      1,
                                                      true
                                                    )
                                                  }
                                                />
                                              ) : parentMinutedata.actorBundleStatusID ===
                                                2 ? (
                                                <Button
                                                  text={t("Reject")}
                                                  className={
                                                    styles["Reject-comment"]
                                                  }
                                                  onClick={() =>
                                                    rejectGeneralComment(
                                                      parentMinutedata,
                                                      1,
                                                      true
                                                    )
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
                                                </>
                                              ) : null}
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
                                                parentMinutedata.lastUpdatedDate +
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
                                                parentMinutedata.lastUpdatedDate +
                                                  parentMinutedata.lastUpdatedTime
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
                                                    {minuteStatus !== 2 && (
                                                      <>
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
                                                                setIsAgenda(
                                                                  true
                                                                );
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
                                                                  declinedData
                                                                );
                                                                setParentMinuteID(
                                                                  parentMinutedata
                                                                );
                                                                setIsAgenda(
                                                                  true
                                                                );
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
                                                                setIsAgenda(
                                                                  true
                                                                );
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
                                                                  declinedData
                                                                );
                                                                setParentMinuteID(
                                                                  parentMinutedata
                                                                );
                                                                setIsAgenda(
                                                                  true
                                                                );
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
                                                      </>
                                                    )}
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
                                  console.log(
                                    historyData,
                                    "parentMinutedataparentMinutedata"
                                  );
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
                                                        historyData.lastUpdatedDate +
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
                                                        historyData.lastUpdatedDate +
                                                          historyData.lastUpdatedTime
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
                                                            {minuteStatus !==
                                                              2 && (
                                                              <>
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
                                                              </>
                                                            )}
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
                                                        onClick={() =>
                                                          rejectGeneralComment(
                                                            minuteDataSubminute,
                                                            2,
                                                            true
                                                          )
                                                        }
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
                                                        onClick={() =>
                                                          rejectGeneralComment(
                                                            minuteDataSubminute,
                                                            2,
                                                            true
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
                                                          // onClick={() => rejectGeneralComment(minuteDataSubminute,2, true)}
                                                          disableBtn={true}
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
                                                        minuteDataSubminute.lastUpdatedDate +
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
                                                        minuteDataSubminute.lastUpdatedDate +
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
                                                                historyData.lastUpdatedDate +
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
                                                                historyData.lastUpdatedDate +
                                                                  historyData.lastUpdatedTime
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
              console.log(data, "datadatadatadata");
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
                                {minuteStatus !== 2 && (
                                  <>
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
                                          // disableBtn={true}
                                          onClick={() =>
                                            rejectGeneralComment(data, 0, false)
                                          }
                                        />
                                      ) : data.actorBundleStatusID === 2 ? (
                                        <Button
                                          text={t("Reject")}
                                          className={styles["Reject-comment"]}
                                          onClick={() =>
                                            rejectGeneralComment(data, 0, false)
                                          }
                                        />
                                      ) : data.actorBundleStatusID === 4 ? (
                                        <>
                                          <Button
                                            text={t("Rejected")}
                                            className={
                                              styles["Rejected-comment"]
                                            }
                                            disableBtn={true}
                                          />
                                        </>
                                      ) : null}
                                    </Col>
                                  </>
                                )}
                              </Row>

                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <p className={styles["time-uploader"]}>
                                    {convertToGMTMinuteTime(
                                      data.lastUpdatedDate +
                                        data.lastUpdatedTime
                                    )}
                                    ,
                                  </p>
                                  <p className={styles["date-uploader"]}>
                                    {convertDateToGMTMinute(
                                      data.lastUpdatedDate +
                                        data.lastUpdatedTime
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
                                        {minuteStatus !== 2 && (
                                          <>
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
                                          </>
                                        )}
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
                                              historyData.lastUpdatedDate +
                                                historyData.lastUpdatedTime
                                            )}
                                            ,
                                          </p>
                                          <p
                                            className={styles["date-uploader"]}
                                          >
                                            {convertDateToGMTMinute(
                                              historyData.lastUpdatedDate +
                                                historyData.lastUpdatedTime
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
                  localStorage.removeItem("MinutesPublishedStatus");
                }}
                text={t("Cancel")}
                className={styles["Cancel"]}
              />
              <Button
                text={t("Submit-review")}
                className={styles["Submit-review"]}
                onClick={submitReviews}
                disableBtn={
                  minuteStatus === 2 || MinutesPublishedNotificationStatus
                    ? true
                    : disableSubmit
                }
              />
            </Col>
          </Row>
        </div>
      </span>
      {RejectCommentModalReducer && (
        <RejectCommentModal
          handleClickRejectButton={handleClickRejectMinuteBtn}
          // minuteDataToReject={minuteDataToReject}
          // setMinuteDataToReject={setMinuteDataToReject}
          // isAgenda={isAgenda}
          // setIsAgenda={setIsAgenda}
          // setMinutesToReview={setMinutesToReview}
          // minutesToReview={minutesToReview}
          // currentUserID={currentUserID}
          // deleteCommentLocal={deleteCommentLocal}
        />
      )}
      {EditCommentModalReducer && (
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
      )}
      {DeleteCommentModalReducer && (
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
      )}
      {AcceptCommentModalReducer && (
        <AcceptCommentModal
          minutesAgenda={minutesAgenda}
          setMinutesAgenda={setMinutesAgenda}
          minutesGeneral={minutesGeneral}
          setMinutesGeneral={setMinutesGeneral}
          minutesToReview={minutesToReview}
          setMinutesToReview={setMinutesToReview}
          currentUserID={currentUserID}
        />
      )}
    </section>
  );
};
export default ReviewMinutes; // Exporting pending approval component
