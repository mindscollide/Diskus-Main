import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./AddReviewers.module.css";
import { Container, Col, Row } from "react-bootstrap";
import { Button, Modal } from "./../../../../../../components/elements";
import {
  SaveMinutesReviewFlow,
  UpdateMinuteFlag,
  GetMinuteReviewFlowByMeetingId,
} from "../../../../../../store/actions/Minutes_action";
import { ChevronDown } from "react-bootstrap-icons";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import moment from "moment";
import DatePicker, { DateObject } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import {
  get_CurrentDateTime,
  multiDatePickerDateChangIntoUTC,
} from "../../../../../../commen/functions/date_formater";
import { useTranslation } from "react-i18next";
import SelectMinutes from "./SelectMinutes/SelectMinutes";
import SelectReviewers from "./SelectReviewers/SelectReviewers";
import SendReviewers from "./SendReviewers/SendReviewers";
import EditReviewers from "./EditReviewers/EditReviewers";
import AddDateModal from "./AddDateModal/AddDateModal";

const AddReviewers = ({
  addReviewers,
  setAddReviewers,
  advanceMeetingModalID,
}) => {
  const { t } = useTranslation();

  const { MinutesReducer, NewMeetingreducer } = useSelector((state) => state);

  const generalminutesDocumentForMeeting = useSelector(
    (state) => state.NewMeetingreducer.generalminutesDocumentForMeeting
  );

  let currentMeetingTitle = localStorage.getItem("meetingTitle");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let currentLanguage = localStorage.getItem("i18nextLng");

  //Select Minutes Checkboxes
  const [selectMinutes, setSelectMinutes] = useState(true);

  //Select Reviewers Checkboxes
  const [selectReviewers, setSelectReviewers] = useState(false);

  //Send Reviewers
  const [sendReviewers, setSendReviewers] = useState(false);

  //Edit Reviewer
  const [editReviewer, setEditReviewer] = useState(false);

  //Add Date
  const [addDateModal, setAddDateModal] = useState(false);

  //Minute To Edit
  const [minuteToEdit, setMinuteToEdit] = useState(null);

  //All Minute IDs
  const [selectedMinuteIDs, setSelectedMinuteIDs] = useState([]);

  //New Selected Minutes
  const [newSelectedMinutes, setNewSelectedMinutes] = useState([]);

  //All Reviewers IDs
  const [selectReviewersArray, setSelectReviewersArray] = useState([]);

  //Minute Date
  const [minuteDate, setMinuteDate] = useState("");

  //All Agenda wise minutes
  const [minuteDataAgenda, setMinuteDataAgenda] = useState(null);

  //All general minutes
  const [minuteDataGeneral, setMinuteDataGeneral] = useState(null);

  //All REviewers List
  const [allReviewers, setAllReviewers] = useState([]);

  //Is agenda minute or not check
  const [isAgendaMinute, setIsAgendaMinute] = useState(false);

  //More Reviewers to add to other minutes
  const [moreMinutes, setMoreMinutes] = useState(false);

  //Check if All Minutes Are selected or not
  const [checkIsCheckAll, setCheckIsCheckAll] = useState(false);

  //Edit Reviewer
  const [selectedReviewersToEdit, setSelectedReviewersToEdit] = useState(
    minuteToEdit?.reviewersList || []
  );

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();

  const handleClose = () => {
    setAddReviewers(false);
    dispatch(UpdateMinuteFlag(false));
  };

  const addReviewerScreen = () => {
    if (selectMinutes) {
      setSelectMinutes(false);
      setSelectReviewers(true);
      setSendReviewers(false);
      setEditReviewer(false);
    } else if (selectReviewers) {
      setSelectMinutes(false);
      setSelectReviewers(false);
      setSendReviewers(true);
      setEditReviewer(false);
      updateMinutesData(
        minuteDataAgenda,
        minuteDataGeneral,
        selectReviewersArray
      );
      setMoreMinutes(false);
    } else if (sendReviewers) {
      setSelectMinutes(false);
      setSelectReviewers(false);
      setSendReviewers(true);
      setEditReviewer(false);
      dispatch(UpdateMinuteFlag(false));
    } else if (editReviewer) {
      setSelectMinutes(false);
      setSelectReviewers(false);
      setSendReviewers(true);
      setEditReviewer(false);
      dispatch(UpdateMinuteFlag(true));
    }
  };

  const addMoreMinutesForReview = () => {
    setMoreMinutes(true);
    setSelectMinutes(false);
    setSelectReviewers(true);
    setSendReviewers(false);
    setEditReviewer(false);
    updateMinutesData(
      minuteDataAgenda,
      minuteDataGeneral,
      selectReviewersArray
    );
  };

  // Assuming minuteDataAgenda and minuteDataGeneral are your existing states

  // Function to create the desired data format
  function createListOfActionAbleBundle(minuteDataAgenda, minuteDataGeneral) {
    let resultList = [];

    // Process minuteDataAgenda
    minuteDataAgenda.forEach((parentAgenda) => {
      // Check if the parent agenda is checked
      if (parentAgenda.isChecked) {
        // Process minuteData within parent agenda
        parentAgenda.minuteData.forEach((minute) => {
          // Check if minute is checked
          if (minute.isChecked) {
            resultList.push({
              // ID: minute.minuteID.toString(),
              ID: "0",
              Title: "", // Set title as needed
              BundleDeadline: multiDatePickerDateChangIntoUTC(minuteDate), // Set bundle deadline as needed
              ListOfUsers: minute.reviewersList,
              Entity: {
                EntityID: minute.minuteID,
                EntityTypeID: 3, // Assuming EntityTypeID for minuteDataAgenda is 3
              },
            });
          }
        });

        // Process subMinutes within parent agenda
        parentAgenda.subMinutes.forEach((subAgenda) => {
          // Check if sub agenda is checked
          if (subAgenda.isChecked) {
            subAgenda.minuteData.forEach((minute) => {
              // Check if minute is checked
              if (minute.isChecked) {
                resultList.push({
                  // ID: minute.minuteID.toString(),
                  ID: "0",
                  Title: "", // Set title as needed
                  BundleDeadline: multiDatePickerDateChangIntoUTC(minuteDate), // Set bundle deadline as needed
                  ListOfUsers: minute.reviewersList,
                  Entity: {
                    EntityID: minute.minuteID,
                    EntityTypeID: 3, // Assuming EntityTypeID for minuteDataAgenda is 3
                  },
                });
              }
            });
          }
        });
      }
    });

    // Process minuteDataGeneral
    minuteDataGeneral.forEach((minute) => {
      // Check if minute is checked
      if (minute.isChecked) {
        resultList.push({
          // ID: minute.minuteID.toString(),
          ID: "0",
          Title: "", // Set title as needed
          BundleDeadline: multiDatePickerDateChangIntoUTC(minuteDate), // Set bundle deadline as needed
          ListOfUsers: minute.reviewersList,
          Entity: {
            EntityID: minute.minuteID,
            EntityTypeID: 2, // Assuming EntityTypeID for minuteDataGeneral is 2
          },
        });
      }
    });

    return resultList;
  }

  const sendReviewerScreen = () => {
    if (minuteDate === "") {
      setAddDateModal(true);
    } else {
      let resultedActionableBundle = createListOfActionAbleBundle(
        minuteDataAgenda,
        minuteDataGeneral
      );
      let Data = {
        MeetingID: Number(advanceMeetingModalID),
        WorkFlowTitle: currentMeetingTitle,
        Description: "",
        isDeadline: true,
        DeadlineDateTime: multiDatePickerDateChangIntoUTC(minuteDate),
        ListOfActionAbleBundle: resultedActionableBundle,
      };

      console.log("DataDataData", Data);
      dispatch(SaveMinutesReviewFlow(Data, navigate, t, setAddReviewers));
      // setSelectMinutes(false);
      // setSelectReviewers(false);
      // setSendReviewers(true);
      // setEditReviewer(false);
    }
  };

  const cancelEditScreen = () => {
    setSelectMinutes(false);
    setSelectReviewers(false);
    setSendReviewers(true);
    setEditReviewer(false);
    dispatch(UpdateMinuteFlag(false));
  };

  //DatePicker Stuff
  const minuteDateHandler = (date, format = "YYYYMMDD") => {
    let minuteDateValueFormat = new Date(date);
    setMinuteDate(minuteDateValueFormat);
    if (calendRef.current.isOpen) {
      calendRef.current.closeCalendar();
    }
  };

  // const transformDataGeneral = (data) => {
  //   try {
  //     return data.map((item) => ({
  //       minuteID: item.minuteID,
  //       description: item.minutesDetails,
  //       attachments: item.minutesAttachmets,
  //       uploader: {
  //         userID: item.userID,
  //         orignalProfilePictureName:
  //           item.userProfilePicture.orignalProfilePictureName,
  //         displayProfilePictureName:
  //           item.userProfilePicture.displayProfilePictureName,
  //       },
  //       lastUpdatedDate: item.lastUpdatedDate,
  //       lastUpdatedTime: item.lastUpdatedTime,
  //       userID: item.userID,
  //       userName: item.userName,
  //       reviewersList: [],
  //     }));
  //   } catch {}
  // };

  const updateMinutesData = (
    minuteDataAgenda,
    minuteDataGeneral,
    reviewersList
  ) => {
    try {
      // Helper function to update minuteData with reviewersList based on isChecked value
      const updateMinuteData = (minuteData) => {
        return minuteData.map((minute) => {
          return {
            ...minute,
            reviewersList: minute.isChecked ? reviewersList : [],
          };
        });
      };

      // Process the first state
      const updatedState1 = minuteDataAgenda.map((agenda) => {
        // Update minuteData at the top level
        let updatedAgenda = {
          ...agenda,
          minuteData: updateMinuteData(agenda.minuteData),
        };

        // Update subMinutes if they exist
        if (agenda.subMinutes) {
          updatedAgenda.subMinutes = agenda.subMinutes.map((subAgenda) => ({
            ...subAgenda,
            minuteData: updateMinuteData(subAgenda.minuteData),
          }));
        }

        return updatedAgenda;
      });

      // Process the second state
      const updatedState2 = minuteDataGeneral.map((minute) => {
        return {
          ...minute,
          reviewersList: minute.isChecked ? reviewersList : [],
        };
      });

      setMinuteDataAgenda(updatedState1);
      setMinuteDataGeneral(updatedState2);
    } catch (error) {
      console.error("Error updating minutes data:", error);
    }
  };

  const allUnchecked = (data) => {
    try {
      return data.every((item) => !item.isChecked);
    } catch {
      return false; // Return false in case of any error
    }
  };

  const allUncheckedReviewers = (data, reviewers) => {
    try {
      return reviewers.length === 0 && data.every((item) => !item.isChecked);
    } catch {
      return false; // Return false in case of any error
    }
  };

  const allUncheckedReviewersMinuteDataAgenda = (minuteDataAgenda) => {
    try {
      return minuteDataAgenda.every((minuteDataItem) => {
        const { minuteData, subMinutes } = minuteDataItem;
        const allMinuteDataUnchecked = minuteData.every(
          (item) =>
            !item.isChecked ||
            (item.isChecked && item.reviewersList.length === 0)
        );
        const allSubMinutesUnchecked = subMinutes.every((subMinute) => {
          const { minuteData: subMinuteData } = subMinute;
          return (
            !subMinute.isChecked ||
            (subMinute.isChecked &&
              subMinuteData.every(
                (item) =>
                  !item.isChecked ||
                  (item.isChecked && item.reviewersList.length === 0)
              ))
          );
        });
        return allMinuteDataUnchecked && allSubMinutesUnchecked;
      });
    } catch (error) {
      console.error("Error checking allUncheckedReviewers:", error);
      return false; // Return false in case of any error
    }
  };

  useEffect(() => {
    if (currentLanguage !== undefined && currentLanguage !== null) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);

  const transformDataGeneral = (data, generalMinutesData) => {
    if (!data || !generalMinutesData) return [];

    return data.map((item) => {
      const matchedMinute = generalMinutesData.find(
        (minute) => minute.pK_MeetingGeneralMinutesID === item.minuteID
      );

      const updatedAttachments = matchedMinute
        ? (item.minutesAttachmets || []).map((attachment) => {
            const matchedFile = (matchedMinute.files || []).find(
              (file) => file.pK_FileID === attachment.fileID
            );
            return matchedFile ? matchedFile : attachment;
          })
        : item.minutesAttachmets || [];

      return {
        minuteID: item.minuteID,
        description: item.minutesDetails || "",
        attachments: updatedAttachments,
        uploader: {
          userID: item.userID || null,
          orignalProfilePictureName:
            item.userProfilePicture?.orignalProfilePictureName || "",
          displayProfilePictureName:
            item.userProfilePicture?.displayProfilePictureName || "",
        },
        lastUpdatedDate: item.lastUpdatedDate || "",
        lastUpdatedTime: item.lastUpdatedTime || "",
        userID: item.userID || null,
        userName: item.userName || "",
      };
    });
  };

  useEffect(() => {
    try {
      const generalMinutes = NewMeetingreducer.generalMinutes;

      if (generalMinutes && Object.keys(generalMinutes).length > 0) {
        const minutesData = generalMinutes.meetingMinutes;
        const documentsData = generalminutesDocumentForMeeting.data;
        console.log(
          "minutesDataminutesDataminutesData",
          minutesData,
          documentsData
        );
        const combinedData = transformDataGeneral(minutesData, documentsData);
        setMinuteDataGeneral(combinedData);
      } else {
        setMinuteDataGeneral(null);
      }
    } catch (error) {
      console.error("Error transforming data:", error);
      setMinuteDataGeneral(null);
    }
  }, [NewMeetingreducer.generalMinutes]);

  useEffect(() => {
    try {
      // Check if agendaWiseMinutesReducer is not null, undefined, and has at least one key
      if (
        NewMeetingreducer.agendaWiseMinutesReducer !== null &&
        NewMeetingreducer.agendaWiseMinutesReducer !== undefined &&
        Object.keys(NewMeetingreducer.agendaWiseMinutesReducer).length > 0
      ) {
        // Store agendaWiseMinutesReducer in a local variable
        let reducerData = NewMeetingreducer.agendaWiseMinutesReducer;
        // Initialize an empty array to hold the transformed data
        let transformedData = [];
        console.log("transformedDatatransformedData", transformedData);
        // Iterate through each parent agenda in the agenda hierarchy list
        reducerData.agendaHierarchyList.forEach((parentAgenda) => {
          // Find the parent agenda details in the agendaWiseMinutes array
          let parentAgendaMinutes = reducerData.agendaWiseMinutes.filter(
            (minute) => minute.agendaID === parentAgenda.pK_MAID
          );

          // Initialize an array to hold sub-minutes of the parent agenda
          let subMinutes = [];
          // Iterate through each child agenda of the parent agenda
          parentAgenda.childAgendas.forEach((childAgenda) => {
            // Filter the minutes that match the child agenda ID and push to subMinutes
            let childMinutes = reducerData.agendaWiseMinutes.filter(
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
              isParentData: isParentData,
              minuteData: parentAgendaMinutes.map((minute) => ({
                minuteID: minute.minuteID,
                description: minute.minutesDetails,
                attachments: minute.minutesAttachmets,
                uploader: minute.userProfilePicture,
                lastUpdatedDate: minute.lastUpdatedDate,
                lastUpdatedTime: minute.lastUpdatedTime,
                userID: minute.userID,
                userName: minute.userName,
              })),
              subMinutes: parentAgenda.childAgendas.map((childAgenda) => {
                let childMinutes = subMinutes.filter(
                  (minute) => minute.agendaID === childAgenda.pK_MAID
                );
                return {
                  agendaID: childAgenda.pK_MAID,
                  agendaTitle: childMinutes[0]?.agendaTitle || "",
                  minuteData: childMinutes.map((minute) => ({
                    minuteID: minute.minuteID,
                    description: minute.minutesDetails,
                    attachments: minute.minutesAttachmets,
                    uploader: minute.userProfilePicture,
                    lastUpdatedDate: minute.lastUpdatedDate,
                    lastUpdatedTime: minute.lastUpdatedTime,
                    userID: minute.userID,
                    userName: minute.userName,
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
                  (entry) => entry.pK_MeetingAgendaMinutesID === minute.minuteID
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
        setMinuteDataAgenda(transformedData);
        console.log("transformedDatatransformedData", transformedData);
      }
    } catch (error) {
      console.error("Error transforming data:", error);
      setMinuteDataAgenda(null);
    }
  }, [
    NewMeetingreducer.agendaWiseMinutesReducer,
    NewMeetingreducer.getallDocumentsForAgendaWiseMinutes,
  ]);

  // useEffect(() => {
  //   if (
  //     NewMeetingreducer.generalMinutes !== undefined &&
  //     NewMeetingreducer.generalMinutes !== null &&
  //     NewMeetingreducer.generalMinutes.length !== 0
  //   ) {
  //     let data = NewMeetingreducer?.generalMinutes?.meetingMinutes;
  //     const transformedData = transformDataGeneral(data);
  //     setMinuteDataGeneral(transformedData);
  //   } else {
  //     setMinuteDataGeneral(null);
  //   }
  //   return () => {
  //     setMinuteDataGeneral(null);
  //   };
  // }, [NewMeetingreducer.generalMinutes]);

  // useEffect(() => {
  //   // Check if agendaWiseMinutesReducer is not null, undefined, and has at least one key
  //   if (
  //     NewMeetingreducer.agendaWiseMinutesReducer !== null &&
  //     NewMeetingreducer.agendaWiseMinutesReducer !== undefined &&
  //     Object.keys(NewMeetingreducer.agendaWiseMinutesReducer).length > 0
  //   ) {
  //     // Store agendaWiseMinutesReducer in a local variable
  //     let reducerData = NewMeetingreducer.agendaWiseMinutesReducer;
  //     // Initialize an empty array to hold the transformed data
  //     let transformedData = [];

  //     // Iterate through each parent agenda in the agenda hierarchy list
  //     reducerData.agendaHierarchyList.forEach((parentAgenda) => {
  //       // Find the parent agenda details in the agendaWiseMinutes array
  //       let parentAgendaMinutes = reducerData.agendaWiseMinutes.filter(
  //         (minute) => minute.agendaID === parentAgenda.pK_MAID
  //       );

  //       // Initialize an array to hold sub-minutes of the parent agenda
  //       let subMinutes = [];
  //       // Iterate through each child agenda of the parent agenda
  //       parentAgenda.childAgendas.forEach((childAgenda) => {
  //         // Filter the minutes that match the child agenda ID and push to subMinutes
  //         let childMinutes = reducerData.agendaWiseMinutes.filter(
  //           (minute) => minute.agendaID === childAgenda.pK_MAID
  //         );
  //         subMinutes.push(...childMinutes);
  //       });

  //       // Check if parent agenda details exist to determine if it's parent data
  //       let isParentData = parentAgendaMinutes.length > 0;

  //       // If there are parent agenda details or sub-minutes, create a parent agenda object
  //       if (isParentData || subMinutes.length > 0) {
  //         // If parent agenda details exist, use them, otherwise use childAgenda's parentTitle
  //         let agendaTitle = isParentData
  //           ? parentAgendaMinutes[0].agendaTitle
  //           : parentAgenda.childAgendas.find((childAgenda) =>
  //               subMinutes.some(
  //                 (minute) => minute.agendaID === childAgenda.pK_MAID
  //               )
  //             )?.parentTitle || "";

  //         let parentAgendaObj = {
  //           agendaID: parentAgenda.pK_MAID,
  //           agendaTitle: agendaTitle,
  //           isParentData: isParentData,
  //           minuteData: parentAgendaMinutes.map((minute) => ({
  //             minuteID: minute.minuteID,
  //             description: minute.minutesDetails,
  //             attachments: minute.minutesAttachmets,
  //             uploader: minute.userProfilePicture,
  //             lastUpdatedDate: minute.lastUpdatedDate,
  //             lastUpdatedTime: minute.lastUpdatedTime,
  //             userID: minute.userID,
  //             userName: minute.userName,
  //             reviewersList: [],
  //           })),
  //           subMinutes: parentAgenda.childAgendas.map((childAgenda) => {
  //             let childMinutes = subMinutes.filter(
  //               (minute) => minute.agendaID === childAgenda.pK_MAID
  //             );
  //             return {
  //               agendaID: childAgenda.pK_MAID,
  //               agendaTitle: childMinutes[0]?.agendaTitle || "",
  //               minuteData: childMinutes.map((minute) => ({
  //                 minuteID: minute.minuteID,
  //                 description: minute.minutesDetails,
  //                 attachments: minute.minutesAttachmets,
  //                 uploader: minute.userProfilePicture,
  //                 lastUpdatedDate: minute.lastUpdatedDate,
  //                 lastUpdatedTime: minute.lastUpdatedTime,
  //                 userID: minute.userID,
  //                 userName: minute.userName,
  //                 reviewersList: [],
  //               })),
  //             };
  //           }),
  //         };

  //         // Push the parent agenda object to the transformed data array
  //         transformedData.push(parentAgendaObj);
  //       }
  //     });

  //     // Log the transformed data to the console
  //     setMinuteDataAgenda(transformedData);
  //   }
  // }, [NewMeetingreducer.agendaWiseMinutesReducer]);

  useEffect(() => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(GetMinuteReviewFlowByMeetingId(Data, navigate, t));
    return () => {
      dispatch(UpdateMinuteFlag(false));
    };
  }, []);

  useEffect(() => {
    if (
      MinutesReducer.GetMinuteReviewFlowByMeetingIdData !== null &&
      MinutesReducer.GetMinuteReviewFlowByMeetingIdData !== undefined
    ) {
      setSelectMinutes(false);
      setSelectReviewers(false);
      setSendReviewers(true);
      setEditReviewer(false);
      dispatch(UpdateMinuteFlag(false));
    }
  }, [MinutesReducer.GetMinuteReviewFlowByMeetingIdData]);

  console.log("MinutesReducerMinutesReducerMinutesReducer", MinutesReducer);

  console.log("Add Reviewer Disable Button Logic");

  return (
    <Modal
      show={true}
      modalBodyClassName={
        selectMinutes ? "scrollStyle mr-20 mt-16p" : "scrollStyle mr-20 "
      }
      modalFooterClassName={"d-block"}
      modalHeaderClassName={"d-none"}
      onHide={handleClose}
      fullscreen={true}
      className={addDateModal === true ? "d-none" : "FullScreenModal"}
      ModalBody={
        selectMinutes === true &&
        selectReviewers === false &&
        sendReviewers === false &&
        editReviewer === false &&
        (minuteDataAgenda !== null || minuteDataGeneral !== null) ? (
          <SelectMinutes
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
            setSelectReviewers={setSelectReviewers}
            selectReviewers={selectReviewers}
            sendReviewers={sendReviewers}
            setSendReviewers={setSendReviewers}
            setEditReviewer={setEditReviewer}
            editReviewer={editReviewer}
            setMinuteDataAgenda={setMinuteDataAgenda}
            minuteDataAgenda={minuteDataAgenda}
            setMinuteDataGeneral={setMinuteDataGeneral}
            minuteDataGeneral={minuteDataGeneral}
            selectedMinuteIDs={selectedMinuteIDs}
            setSelectedMinuteIDs={setSelectedMinuteIDs}
            selectReviewersArray={selectReviewersArray}
            setSelectReviewersArray={setSelectReviewersArray}
            allReviewers={allReviewers}
            setAllReviewers={setAllReviewers}
            isAgendaMinute={isAgendaMinute}
            setIsAgendaMinute={setIsAgendaMinute}
            moreMinutes={moreMinutes}
            setMoreMinutes={setMoreMinutes}
          />
        ) : selectMinutes === false &&
          selectReviewers === true &&
          sendReviewers === false &&
          editReviewer === false &&
          (minuteDataAgenda !== null || minuteDataGeneral !== null) ? (
          <SelectReviewers
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
            setSelectReviewers={setSelectReviewers}
            selectReviewers={selectReviewers}
            sendReviewers={sendReviewers}
            setSendReviewers={setSendReviewers}
            setEditReviewer={setEditReviewer}
            editReviewer={editReviewer}
            setMinuteDataAgenda={setMinuteDataAgenda}
            minuteDataAgenda={minuteDataAgenda}
            setMinuteDataGeneral={setMinuteDataGeneral}
            minuteDataGeneral={minuteDataGeneral}
            selectedMinuteIDs={selectedMinuteIDs}
            setSelectedMinuteIDs={setSelectedMinuteIDs}
            selectReviewersArray={selectReviewersArray}
            setSelectReviewersArray={setSelectReviewersArray}
            allReviewers={allReviewers}
            setAllReviewers={setAllReviewers}
            isAgendaMinute={isAgendaMinute}
            setIsAgendaMinute={setIsAgendaMinute}
            moreMinutes={moreMinutes}
            setMoreMinutes={setMoreMinutes}
            newSelectedMinutes={newSelectedMinutes}
            setNewSelectedMinutes={setNewSelectedMinutes}
          />
        ) : selectMinutes === false &&
          selectReviewers === false &&
          sendReviewers === true &&
          editReviewer === false &&
          (minuteDataAgenda !== null || minuteDataGeneral !== null) ? (
          <SendReviewers
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
            setSelectReviewers={setSelectReviewers}
            selectReviewers={selectReviewers}
            sendReviewers={sendReviewers}
            setSendReviewers={setSendReviewers}
            setEditReviewer={setEditReviewer}
            editReviewer={editReviewer}
            setMinuteDataAgenda={setMinuteDataAgenda}
            minuteDataAgenda={minuteDataAgenda}
            setMinuteDataGeneral={setMinuteDataGeneral}
            minuteDataGeneral={minuteDataGeneral}
            selectedMinuteIDs={selectedMinuteIDs}
            setSelectedMinuteIDs={setSelectedMinuteIDs}
            selectReviewersArray={selectReviewersArray}
            setSelectReviewersArray={setSelectReviewersArray}
            setMinuteToEdit={setMinuteToEdit}
            minuteToEdit={minuteToEdit}
            allReviewers={allReviewers}
            setAllReviewers={setAllReviewers}
            isAgendaMinute={isAgendaMinute}
            setIsAgendaMinute={setIsAgendaMinute}
            moreMinutes={moreMinutes}
            setMoreMinutes={setMoreMinutes}
            checkIsCheckAll={checkIsCheckAll}
            setCheckIsCheckAll={setCheckIsCheckAll}
            newSelectedMinutes={newSelectedMinutes}
            setNewSelectedMinutes={setNewSelectedMinutes}
          />
        ) : selectMinutes === false &&
          selectReviewers === false &&
          sendReviewers === false &&
          editReviewer === true &&
          (minuteDataAgenda !== null || minuteDataGeneral !== null) ? (
          <EditReviewers
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
            setSelectReviewers={setSelectReviewers}
            selectReviewers={selectReviewers}
            sendReviewers={sendReviewers}
            setSendReviewers={setSendReviewers}
            setEditReviewer={setEditReviewer}
            editReviewer={editReviewer}
            setMinuteToEdit={setMinuteToEdit}
            minuteToEdit={minuteToEdit}
            allReviewers={allReviewers}
            setAllReviewers={setAllReviewers}
            isAgendaMinute={isAgendaMinute}
            setIsAgendaMinute={setIsAgendaMinute}
            moreMinutes={moreMinutes}
            setMoreMinutes={setMoreMinutes}
            selectedReviewersToEdit={selectedReviewersToEdit}
            setSelectedReviewersToEdit={setSelectedReviewersToEdit}
          />
        ) : (
          <p>No minutes to send for review</p>
        )
      }
      ModalFooter={
        <>
          {selectMinutes === true &&
          selectReviewers === false &&
          sendReviewers === false &&
          editReviewer === false ? (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex gap-3 justify-content-end"
              >
                <Button
                  onClick={() => setAddReviewers(false)}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button"]}
                  text={t("Add-reviewers")}
                  onClick={addReviewerScreen}
                  disableBtn={selectedMinuteIDs.length === 0 ? true : false}
                />
              </Col>
            </Row>
          ) : selectMinutes === false &&
            selectReviewers === true &&
            sendReviewers === false &&
            editReviewer === false ? (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex gap-3 justify-content-end"
              >
                <Button
                  onClick={() => setAddReviewers(false)}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button-Reviewers"]}
                  text={t("Add")}
                  onClick={addReviewerScreen}
                  disableBtn={selectReviewersArray.length > 0 ? false : true}
                />
              </Col>
            </Row>
          ) : selectMinutes === false &&
            selectReviewers === false &&
            sendReviewers === true &&
            editReviewer === false ? (
            <Row>
              <Col
                lg={6}
                md={6}
                sm={12}
                className="position-relative d-flex gap-3 justify-content-start"
              >
                <label className={styles["label-datePicker"]}>
                  {t("Deadline")} <span className="text-danger">*</span>
                </label>
                <DatePicker
                  onFocusedDateChange={minuteDateHandler}
                  format={"DD MMMM YYYY"}
                  value={minuteDate}
                  minDate={moment().toDate()}
                  placeholder={t("Select-date")}
                  editable={false}
                  className="datePickerTodoCreate2"
                  onOpenPickNewDate={true}
                  inputMode=""
                  calendar={calendarValue}
                  locale={localValue}
                  ref={calendRef}
                  render={
                    <InputIcon
                      placeholder={t("Select-date")}
                      className="datepicker_input_minute"
                    />
                  }
                />
              </Col>
              <Col
                lg={6}
                md={6}
                sm={12}
                className="d-flex gap-3 justify-content-end"
              >
                <Button
                  onClick={() => setAddReviewers(false)}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button-Reviewerss"]}
                  text={t("Add-reviewers")}
                  onClick={addMoreMinutesForReview}
                  disableBtn={selectedMinuteIDs.length === 0 ? true : false}
                />
                <Button
                  className={styles["Add-Button-Reviewers"]}
                  text={t("Send")}
                  onClick={sendReviewerScreen}
                />
              </Col>
            </Row>
          ) : selectMinutes === false &&
            selectReviewers === false &&
            sendReviewers === false &&
            editReviewer === true ? (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex gap-3 justify-content-end"
              >
                <Button
                  onClick={cancelEditScreen}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button-Reviewers"]}
                  text={t("Update")}
                  onClick={addReviewerScreen}
                  disableBtn={
                    selectedReviewersToEdit.length === 0 ? true : false
                  }
                />
              </Col>
            </Row>
          ) : null}
          {addDateModal ? (
            <AddDateModal
              addDateModal={addDateModal}
              setAddDateModal={setAddDateModal}
              sendReviewers={sendReviewers}
              setSendReviewers={setSendReviewers}
            />
          ) : null}
        </>
      }
    />
  );
};

export default AddReviewers;
