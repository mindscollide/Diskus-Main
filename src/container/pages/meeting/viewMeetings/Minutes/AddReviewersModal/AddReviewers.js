import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./AddReviewers.module.css";
import { Col, Row } from "react-bootstrap";
import { Button, Modal } from "./../../../../../../components/elements";
import { SaveMinutesReviewFlow } from "../../../../../../store/actions/Minutes_action";
import NoMinutes from "./../Images/No-Minutes.png";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import moment from "moment";
import DatePicker from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import {
  formatDateToYYYYMMDD,
  multiDatePickerDateChangIntoUTC,
  resolutionResultTable,
  utcConvertintoGMT,
} from "../../../../../../commen/functions/date_formater";
import { useTranslation } from "react-i18next";
import SelectMinutes from "./SelectMinutes/SelectMinutes";
import SelectReviewers from "./SelectReviewers/SelectReviewers";
import AddDateModal from "./AddDateModal/AddDateModal";
import {
  updateMinutesData,
  checkReviewersListAgenda,
  checkReviewersListGeneral,
  createListOfActionAbleBundle,
  checkReviewersListSubAgenda,
  extractPKUIDsFromActors,
  findEntityIndexByMinuteID,
} from "./functionsAddReviewers";

const AddReviewers = ({
  addReviewers,
  setAddReviewers,
  advanceMeetingModalID,
  allReviewers,
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

  //Add Date
  const [addDateModal, setAddDateModal] = useState(false);

  //All Minute IDs
  const [selectedMinuteIDs, setSelectedMinuteIDs] = useState([]);

  //All Reviewers IDs
  const [selectReviewersArray, setSelectReviewersArray] = useState([]);

  //Minute Date
  const [minuteDate, setMinuteDate] = useState("");

  //All Agenda wise minutes
  const [minuteDataAgenda, setMinuteDataAgenda] = useState([]);

  //All general minutes
  const [minuteDataGeneral, setMinuteDataGeneral] = useState([]);

  const [minuteReviewDataCheckForEdit, setMinuteReviewDataCheckForEdit] =
    useState([]);

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();

  const handleClose = () => {
    setAddReviewers(false);
  };

  async function backFunctionMinutes() {
    console.log("minuteDataAgenda");
    setSelectedMinuteIDs([]);
    setSelectReviewersArray([]);
    setSelectReviewers(false);
    setSelectMinutes(true);
  }

  const addReviewerScreen = async (data) => {
    if (data === "selectMinutes") {
      setSelectMinutes(false);
      setSelectReviewers(true);
    } else if (data === "selectReviewers") {
      await updateMinutesData(
        minuteDataAgenda,
        minuteDataGeneral,
        selectReviewersArray,
        selectedMinuteIDs,
        setMinuteDataAgenda,
        setMinuteDataGeneral,
        setSelectedMinuteIDs,
        setSelectReviewersArray,
        minuteReviewDataCheckForEdit,
        setMinuteReviewDataCheckForEdit
      );
      setSelectReviewers(false);
      setSelectMinutes(true);
    }
  };

  const minuteDateHandler = (date, format = "YYYYMMDD") => {
    let minuteDateValueFormat = new Date(date);
    console.log(minuteDateValueFormat, "utcFormattedutcFormattedutcFormatted");
    minuteDateValueFormat.setHours(23);
    minuteDateValueFormat.setMinutes(59);
    minuteDateValueFormat.setSeconds(59);
    setMinuteDate(minuteDateValueFormat);
    if (calendRef.current.isOpen) {
      calendRef.current.closeCalendar();
    }
  };
  const sendReviewerScreen = () => {
    if (minuteDate === "") {
      setAddDateModal(true);
    } else {
      let resultedActionableBundle = createListOfActionAbleBundle(
        minuteDataAgenda,
        minuteDataGeneral,
        minuteDate
      );
      let Data = {
        MeetingID: Number(advanceMeetingModalID),
        WorkFlowTitle: currentMeetingTitle,
        Description: "",
        isDeadline: true,
        DeadlineDateTime: multiDatePickerDateChangIntoUTC(minuteDate),
        ListOfActionAbleBundle: resultedActionableBundle,
      };

      dispatch(SaveMinutesReviewFlow(Data, navigate, t, setAddReviewers));
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
        apiCheck: false,
        isEdit: false,
        reviewersList: [],
        bundleID: 0,
      };
    });
  };

  useEffect(() => {
    try {
      const generalMinutes = NewMeetingreducer.generalMinutes;

      if (generalMinutes && Object.keys(generalMinutes).length > 0) {
        const minutesData = generalMinutes.meetingMinutes;
        const documentsData = generalminutesDocumentForMeeting.data;
        const combinedData = transformDataGeneral(minutesData, documentsData);
        if (
          MinutesReducer.GetMinuteReviewFlowByMeetingIdData !== null &&
          MinutesReducer.GetMinuteReviewFlowByMeetingIdData !== undefined &&
          Object.keys(MinutesReducer.GetMinuteReviewFlowByMeetingIdData)
            .length > 0
        ) {
          let date = resolutionResultTable(
            MinutesReducer?.GetMinuteReviewFlowByMeetingIdData?.workFlow
              ?.workFlow?.deadlineDatetime
          );
          setMinuteDate(date);

          let convertFinalData = combinedData;

          // Update attachments in transformedData based on data state
          let check =
            MinutesReducer.GetMinuteReviewFlowByMeetingIdData.workFlow;

          convertFinalData.forEach((agenda) => {
            console.log("resultresultresult", agenda);
            let result = findEntityIndexByMinuteID(check, agenda.minuteID);
            // // If matchingData found, update attachments in minuteData
            if (result.found) {
              agenda.apiCheck = true;
              agenda.reviewersList = extractPKUIDsFromActors(
                check.bundleModels[result.index]
              );
              agenda.bundleID =
                check.bundleModels[
                  result.index
                ].entities[0].fK_WorkFlowActionableBundle_ID;
            }
          });
          // Log the transformed data to the console
          setMinuteDataGeneral(convertFinalData);
        } else {
          setMinuteDataGeneral(combinedData);
        }
      } else {
        setMinuteDataGeneral([]);
      }
    } catch (error) {
      console.error("Error transforming data:", error);
      setMinuteDataGeneral([]);
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
        if (
          MinutesReducer.GetMinuteReviewFlowByMeetingIdData !== null &&
          MinutesReducer.GetMinuteReviewFlowByMeetingIdData !== undefined &&
          Object.keys(MinutesReducer.GetMinuteReviewFlowByMeetingIdData)
            .length > 0
        ) {
          // Store agendaWiseMinutesReducer in a local variable
          let reducerData = NewMeetingreducer.agendaWiseMinutesReducer;
          // Initialize an empty array to hold the transformed data
          let transformedData = [];
          let convertFinalData = transformedData;
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
                apiCheck: false,
                minuteData: parentAgendaMinutes.map((minute) => ({
                  minuteID: minute.minuteID,
                  description: minute.minutesDetails,
                  attachments: minute.minutesAttachmets,
                  uploader: minute.userProfilePicture,
                  lastUpdatedDate: minute.lastUpdatedDate,
                  lastUpdatedTime: minute.lastUpdatedTime,
                  userID: minute.userID,
                  apiCheck: false,
                  userName: minute.userName,
                  isEdit: false,
                  reviewersList: [],
                  bundleID: 0,
                })),
                subMinutes: parentAgenda.childAgendas.map((childAgenda) => {
                  let childMinutes = subMinutes.filter(
                    (minute) => minute.agendaID === childAgenda.pK_MAID
                  );
                  return {
                    agendaID: childAgenda.pK_MAID,
                    agendaTitle: childMinutes[0]?.agendaTitle || "",
                    apiCheck: false,
                    minuteData: childMinutes.map((minute) => ({
                      minuteID: minute.minuteID,
                      description: minute.minutesDetails,
                      attachments: minute.minutesAttachmets,
                      uploader: minute.userProfilePicture,
                      lastUpdatedDate: minute.lastUpdatedDate,
                      lastUpdatedTime: minute.lastUpdatedTime,
                      userID: minute.userID,
                      userName: minute.userName,
                      apiCheck: false,
                      isEdit: false,
                      reviewersList: [],
                      bundleID: 0,
                    })),
                  };
                }),
              };

              // Push the parent agenda object to the transformed data array
              transformedData.push(parentAgendaObj);
            }
          });

          // Update attachments in transformedData based on data state

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
          // Update attachments in transformedData based on data state
          let check =
            MinutesReducer.GetMinuteReviewFlowByMeetingIdData.workFlow;

          convertFinalData.forEach((agenda) => {
            agenda.minuteData.forEach((minute) => {
              let result = findEntityIndexByMinuteID(check, minute.minuteID);
              // // If matchingData found, update attachments in minuteData
              if (result.found) {
                minute.apiCheck = true;
                minute.reviewersList = extractPKUIDsFromActors(
                  check.bundleModels[result.index]
                );
                minute.bundleID =
                  check.bundleModels[
                    result.index
                  ].entities[0].fK_WorkFlowActionableBundle_ID;
              }
            });

            agenda.subMinutes.forEach((subAgenda) => {
              subAgenda.minuteData.forEach((minute) => {
                // Find matching entry in data state by pK_MeetingAgendaMinutesID
                let result = findEntityIndexByMinuteID(check, minute.minuteID);
                // // If matchingData found, update attachments in minuteData
                if (result.found) {
                  minute.apiCheck = true;
                  minute.reviewersList = extractPKUIDsFromActors(
                    check.bundleModels[result.index]
                  );
                  minute.bundleID =
                    check.bundleModels[
                      result.index
                    ].entities[0].fK_WorkFlowActionableBundle_ID;
                }
              });
            });
          });
          // Log the transformed data to the console
          setMinuteDataAgenda(convertFinalData);
        } else {
          console.log("extractPKUIDsFromActors", MinutesReducer);

          // Store agendaWiseMinutesReducer in a local variable
          let reducerData = NewMeetingreducer.agendaWiseMinutesReducer;
          // Initialize an empty array to hold the transformed data
          let transformedData = [];
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
                apiCheck: false,
                minuteData: parentAgendaMinutes.map((minute) => ({
                  minuteID: minute.minuteID,
                  description: minute.minutesDetails,
                  attachments: minute.minutesAttachmets,
                  uploader: minute.userProfilePicture,
                  lastUpdatedDate: minute.lastUpdatedDate,
                  lastUpdatedTime: minute.lastUpdatedTime,
                  userID: minute.userID,
                  apiCheck: false,
                  userName: minute.userName,
                  isEdit: false,
                  reviewersList: [],
                  bundleID: 0,
                })),
                subMinutes: parentAgenda.childAgendas.map((childAgenda) => {
                  let childMinutes = subMinutes.filter(
                    (minute) => minute.agendaID === childAgenda.pK_MAID
                  );
                  return {
                    agendaID: childAgenda.pK_MAID,
                    agendaTitle: childMinutes[0]?.agendaTitle || "",
                    apiCheck: false,
                    minuteData: childMinutes.map((minute) => ({
                      minuteID: minute.minuteID,
                      description: minute.minutesDetails,
                      attachments: minute.minutesAttachmets,
                      uploader: minute.userProfilePicture,
                      lastUpdatedDate: minute.lastUpdatedDate,
                      lastUpdatedTime: minute.lastUpdatedTime,
                      userID: minute.userID,
                      userName: minute.userName,
                      apiCheck: false,
                      isEdit: false,
                      reviewersList: [],
                      bundleID: 0,
                    })),
                  };
                }),
              };

              // Push the parent agenda object to the transformed data array
              transformedData.push(parentAgendaObj);
            }
          });

          // Update attachments in transformedData based on data state

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

          // Log the transformed data to the console
          setMinuteDataAgenda(transformedData);
        }
      }
    } catch (error) {
      console.error("Error transforming data:", error);
      setMinuteDataAgenda([]);
    }
  }, [
    NewMeetingreducer.agendaWiseMinutesReducer,
    NewMeetingreducer.getallDocumentsForAgendaWiseMinutes,
    NewMeetingreducer.GetMinuteReviewFlowByMeetingIdData,
  ]);

  console.log("Data being passed minuteDataAgenda", minuteDataAgenda);
  console.log("Data being passed minuteDataGeneral", minuteDataGeneral);
  console.log("Data being passed selectedMinuteIDs", selectedMinuteIDs);

  return (
    <Modal
      show={true}
      closeButton={true}
      modalBodyClassName={
        selectMinutes &&
        currentLanguage === "en" &&
        (minuteDataAgenda.length !== 0 || minuteDataGeneral.length !== 0)
          ? "scrollStyle mr-20 mt-16p"
          : !selectMinutes &&
            currentLanguage === "en" &&
            (minuteDataAgenda.length !== 0 || minuteDataGeneral.length !== 0)
          ? "scrollStyle mr-20 "
          : selectMinutes &&
            currentLanguage === "ar" &&
            (minuteDataAgenda.length !== 0 || minuteDataGeneral.length !== 0)
          ? "scrollStyle ml-20 mt-16p"
          : !selectMinutes &&
            currentLanguage === "ar" &&
            (minuteDataAgenda.length !== 0 || minuteDataGeneral.length !== 0)
          ? "scrollStyle ml-20 "
          : minuteDataAgenda.length === 0 || minuteDataGeneral.length === 0
          ? "emptystatereviewers"
          : ""
      }
      modalFooterClassName={
        minuteDataAgenda.length === 0 && minuteDataGeneral.length === 0
          ? "d-none"
          : "d-block"
      }
      modalHeaderClassName={
        minuteDataAgenda.length === 0 && minuteDataGeneral.length === 0
          ? "d-block text-end"
          : "d-none"
      }
      onHide={handleClose}
      fullscreen={true}
      className={addDateModal === true ? "d-none" : "FullScreenModal"}
      ModalBody={
        minuteDataAgenda.length === 0 && minuteDataGeneral.length === 0 ? (
          <>
            <img src={NoMinutes} alt='' />
            <p className={styles["nominutes-text"]}>{t("No-minutes")}</p>
          </>
        ) : (
          <>
            {selectMinutes === true &&
              selectReviewers === false &&
              (minuteDataAgenda !== null || minuteDataGeneral !== null) && (
                <SelectMinutes
                  minuteDataAgenda={minuteDataAgenda}
                  minuteDataGeneral={minuteDataGeneral}
                  selectedMinuteIDs={selectedMinuteIDs}
                  setSelectedMinuteIDs={setSelectedMinuteIDs}
                  allReviewers={allReviewers}
                  setMinuteDataAgenda={setMinuteDataAgenda}
                  setMinuteDataGeneral={setMinuteDataGeneral}
                  setSelectReviewersArray={setSelectReviewersArray}
                  setSelectMinutes={setSelectMinutes}
                  setSelectReviewers={setSelectReviewers}
                />
              )}
            {selectReviewers === true && selectMinutes === false && (
              <SelectReviewers
                minuteDataAgenda={minuteDataAgenda}
                minuteDataGeneral={minuteDataGeneral}
                selectedMinuteIDs={selectedMinuteIDs}
                selectReviewersArray={selectReviewersArray}
                setSelectReviewersArray={setSelectReviewersArray}
                allReviewers={allReviewers}
                setSelectMinutes={setSelectMinutes}
                setSelectReviewers={setSelectReviewers}
                setMinuteReviewDataCheckForEdit={
                  setMinuteReviewDataCheckForEdit
                }
              />
            )}
          </>
        )
      }
      ModalFooter={
        <>
          {selectMinutes === true && selectReviewers === false ? (
            <Row>
              {checkReviewersListAgenda(minuteDataAgenda) ||
              checkReviewersListSubAgenda(minuteDataAgenda) ||
              checkReviewersListGeneral(minuteDataGeneral) ? (
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  className='d-grid justify-content-start'>
                  <label className={styles["label-datePicker"]}>
                    {t("Deadline")} <span className='text-danger'>*</span>
                  </label>
                  <DatePicker
                    onFocusedDateChange={minuteDateHandler}
                    format={"DD MMMM YYYY"}
                    value={minuteDate}
                    minDate={moment().toDate()}
                    placeholder={t("Select-date")}
                    editable={false}
                    className='datePickerTodoCreate2'
                    onOpenPickNewDate={true}
                    inputMode=''
                    calendar={calendarValue}
                    locale={localValue}
                    ref={calendRef}
                    render={
                      <InputIcon
                        placeholder={t("Select-date")}
                        className='datepicker_input_minute'
                      />
                    }
                  />
                </Col>
              ) : null}
              <Col
                lg={
                  checkReviewersListAgenda(minuteDataAgenda) ||
                  checkReviewersListSubAgenda(minuteDataAgenda) ||
                  checkReviewersListGeneral(minuteDataGeneral)
                    ? 6
                    : 12
                }
                md={
                  checkReviewersListAgenda(minuteDataAgenda) ||
                  checkReviewersListSubAgenda(minuteDataAgenda) ||
                  checkReviewersListGeneral(minuteDataGeneral)
                    ? 6
                    : 12
                }
                sm={12}
                className='d-flex gap-3 justify-content-end'>
                <Button
                  onClick={() => setAddReviewers(false)}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button"]}
                  text={t("Add-reviewers")}
                  onClick={() => addReviewerScreen("selectMinutes")}
                  disableBtn={selectedMinuteIDs.length === 0 ? true : false}
                />

                {checkReviewersListAgenda(minuteDataAgenda) ||
                checkReviewersListSubAgenda(minuteDataAgenda) ||
                checkReviewersListGeneral(minuteDataGeneral) ? (
                  <Button
                    className={styles["Add-Button-Reviewers"]}
                    text={t("Send")}
                    onClick={sendReviewerScreen}
                  />
                ) : null}
              </Col>
            </Row>
          ) : selectMinutes === false && selectReviewers === true ? (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className='d-flex gap-3 justify-content-end'>
                <Button
                  onClick={backFunctionMinutes}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button-Reviewers"]}
                  text={t("Add")}
                  onClick={() => addReviewerScreen("selectReviewers")}
                  // disableBtn={selectReviewersArray.length > 0 ? false : true}
                />
              </Col>
            </Row>
          ) : null}
          {addDateModal ? (
            <AddDateModal
              addDateModal={addDateModal}
              setAddDateModal={setAddDateModal}
            />
          ) : null}
        </>
      }
    />
  );
};

export default AddReviewers;
