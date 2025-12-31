import React, { useEffect, useState } from "react";
import styles from "./createEditViewComplianceChecklist.module.css";
import { Col, Row } from "react-bootstrap";
import {
  InputfieldwithCount,
  TextAreafieldwithCount,
} from "../../../../../../components/elements/input_field/Input_field_withCount";
import { useTranslation } from "react-i18next";
import { useComplianceContext } from "../../../../../../context/ComplianceContext";
import InputIcon from "react-multi-date-picker/components/input_icon";
import DatePicker from "react-multi-date-picker";
import moment from "moment";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { Accordian, Button } from "../../../../../../components/elements";
import { multiDatePickerDateChangIntoUTC } from "../../../../../../commen/functions/date_formater";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AddComplianceChecklistAPI } from "../../../../../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";

const CreateEditViewComplianceChecklist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [checklistDueDate, setChecklistDueDate] = useState("");
  const [allChecklist, setAllChecklist] = useState([]);

  const GetComplianceChecklistsByComplianceId = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsByComplianceId
  );
  console.log(
    GetComplianceChecklistsByComplianceId,
    "GetComplianceChecklistsByComplianceId"
  );

  const { complianceAddEditViewState, complianceInfo } = useComplianceContext();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [checkListData, setChecklistData] = useState({
    checklistTitle: "",
    checklistDescription: "",
  });
  const changeComplainceDueDate = (date) => {
    let meetingDateValueFormat2 = new Date(date);
    meetingDateValueFormat2.setHours(23);
    meetingDateValueFormat2.setMinutes(59);
    meetingDateValueFormat2.setSeconds(58);
    setChecklistDueDate(meetingDateValueFormat2);
  };

  const handleValueChange = (event) => {
    const { name, value } = event.target;
    console.log("handleValueChange", name, value);
    let error = "";

    switch (name) {
      case "checklistTitle":
        if (!value.trim()) {
          error = "Checklist Title is required";
        }
        break;
      case "checklistDescription":
        if (!value.trim()) {
          error = "Checklist Description is required";
        }
        break;

      default:
        break;
    }
    setChecklistData((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };
  const handleClickSaveBtn = () => {
    if (complianceInfo.complianceId !== 0) {
      const Data = {
        checkListTitle: checkListData.checklistTitle,
        description: checkListData.checklistDescription,
        complianceId: complianceInfo.complianceId,
        dueDate: multiDatePickerDateChangIntoUTC(checklistDueDate),
      };
      console.log(Data, "handleClickSaveBtn");
      dispatch(AddComplianceChecklistAPI(navigate, Data, t, complianceInfo));
    }
  };

  useEffect(() => {
    if (
      GetComplianceChecklistsByComplianceId &&
      GetComplianceChecklistsByComplianceId !== null
    ) {
      console.log(
        GetComplianceChecklistsByComplianceId,
        "GetComplianceChecklistsByComplianceIdGetComplianceChecklistsByComplianceId"
      );
      // setAllChecklist();
    }
  });
  return (
    <>
      <Row className="mt-2">
        <Col sm={12} md={9} lg={9}>
          <InputfieldwithCount
            label={
              <>
                {t("Checklist-title")}
                <span className={styles["sterick"]}>
                  {complianceAddEditViewState !== 3 ? " *" : ""}
                </span>
              </>
            }
            placeholder={
              complianceAddEditViewState !== 3 ? t("Checklist-title") : ""
            }
            showCount={complianceAddEditViewState === 3 ? false : true}
            maxLength={100}
            onChange={handleValueChange}
            name="checklistTitle"
            preFixClas={
              complianceAddEditViewState === 3
                ? "viewField_Name"
                : "AddEditAuthorityCounterInputField"
            }
            value={checkListData.checklistTitle}
            labelClass={styles["labelStyle"]}
          />
        </Col>
        <Col sm={12} md={3} lg={3}>
          <div className={`${styles["labelStyle"]} ${styles["Select_label"]}`}>
            {t("Due-date")}
            <span className={styles["sterick"]}>
              {complianceAddEditViewState !== 3 ? " *" : ""}
            </span>
          </div>
          <DatePicker
            value={checklistDueDate}
            format={"DD/MM/YYYY"}
            minDate={moment().toDate()}
            placeholder={t("Due-date")}
            render={
              <InputIcon
                placeholder={t("Due-date")}
                className={styles["datepicker_input"]}
              />
            }
            editable={false}
            className="datePickerTodoCreate2"
            containerClassName={"Complaince_createEditDueDate"}
            onOpenPickNewDate={true}
            inputMode=""
            calendarPosition="bottom-center"
            calendar={gregorian}
            locale={currentLanguage === "en" ? gregorian_en : gregorian_ar}
            // ref={calendRef}
            onFocusedDateChange={changeComplainceDueDate}
            onChange={changeComplainceDueDate}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm={12} md={12} lg={12}>
          <TextAreafieldwithCount
            label={
              <>
                {t("Checklist-description")}
                <span className={styles["sterick"]}>
                  {complianceAddEditViewState !== 3 ? " *" : ""}
                </span>
              </>
            }
            labelClass={styles["labelStyle"]}
            placeholder={
              complianceAddEditViewState !== 3 ? t("Checklist-description") : ""
            }
            showCount={complianceAddEditViewState === 3 ? false : true}
            maxLength={500}
            onChange={handleValueChange}
            name="checklistDescription"
            preFixClas={
              complianceAddEditViewState === 3
                ? "viewField_TextArea_Name"
                : "AddEditAuthorityCounterInputFieldTextArea"
            }
            value={checkListData.checklistDescription}
          />
        </Col>
      </Row>
      <div className={styles["ChecklistButtonPosition"]}>
        <Button
          text={t("Close")}
          className={styles["Compliance_CloseButton"]}
          // onClick={handleCloseButton}
        />
        <Button
          text={t("Save")}
          className={styles["Compliance_NextButton"]}
          onClick={handleClickSaveBtn}
          disableBtn={
            checkListData.checklistDescription !== "" &&
            checklistDueDate !== "" &&
            checkListData.checklistTitle !== ""
              ? false
              : true
          }
        />
      </div>
      <Row>
        <Col sm={12} md={12} lg={12} className={styles["labelStyle"]}>
          {t("Checklists")}
        </Col>
      </Row>

      <div className={styles["checklistAccordian"]}>
        {GetComplianceChecklistsByComplianceId &&
        GetComplianceChecklistsByComplianceId?.checklistList?.length > 0
          ? GetComplianceChecklistsByComplianceId.checklistList.map(
              (data, index) => {
                return (
                  <div className="margin-top-20" key={index}>
                    <Accordian
                      // AccordioonHeader={data.ObjMeetingAgenda.Title}
                      className={`Setting ${currentLanguage}`}
                      AccordioonBody={
                        <>
                          <Row>
                            <Col lg={2} md={2} xs={6}>
                              <Button
                                className={"btn editAgendaGridBtn"}
                                variant={"Primary"}
                                text={t("Edit")}
                                // onClick={() => editGrid(data, index)}
                                datatut="show-agenda"
                              />
                            </Col>
                            <Col lg={2} md={2} xs={6}>
                              <Button
                                className={"btn  deleteAgendaGridBtn"}
                                variant={"Primary"}
                                text={t("Delete")}
                                // onClick={() => deleteGrid(data, index)}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={7} md={7} xs={12}>
                              <TextAreafieldwithCount
                                disable={true}
                                name={"Title"}
                                // value={data.ObjMeetingAgenda.Title}
                                applyClass="form-control2"
                                type="text"
                                placeholder={t("Agenda-title")}
                              />
                            </Col>
                            <Col lg={5} md={5} xs={12}>
                              <TextAreafieldwithCount
                                disable={true}
                                name={"PresenterName"}
                                // value={data.ObjMeetingAgenda.PresenterName}
                                applyClass="form-control2"
                                type="text"
                                placeholder={t("Presenter-Title-Placeholder")}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} xs={12}>
                              <TextAreafieldwithCount
                                disable={true}
                                name={"URLs"}
                                // value={data.ObjMeetingAgenda.URLs}
                                applyClass="form-control2"
                                type="text"
                                placeholder={t("URL-Title-Placeholder")}
                              />
                            </Col>
                          </Row>
                          {/* <Row>
                            {data.MeetingAgendaAttachments.length > 0
                              ? data.MeetingAgendaAttachments.map(
                                  (MeetingAgendaAttachmentsData, index) => {
                                    return (
                                      <Col sm={4} lg={4} md={4} key={index}>
                                        <AttachmentViewer
                                          id={Number(
                                            MeetingAgendaAttachmentsData.OriginalAttachmentName
                                          )}
                                          handleEyeIcon={() =>
                                            handeClickView(
                                              MeetingAgendaAttachmentsData
                                            )
                                          }
                                          handleClickDownload={() =>
                                            downloadClick(
                                              MeetingAgendaAttachmentsData
                                            )
                                          }
                                          data={MeetingAgendaAttachmentsData}
                                          name={
                                            MeetingAgendaAttachmentsData.DisplayAttachmentName
                                          }
                                        />
                                      </Col>
                                    );
                                  }
                                )
                              : null}
                          </Row> */}
                        </>
                      }
                    />
                  </div>
                );
              }
            )
          : null}
      </div>

      {/* Main Button */}
      <div className={styles["mainButtonPosition"]}>
        <Button
          text={t("Close")}
          className={styles["Compliance_CloseButton"]}
          // onClick={handleCloseButton}
        />
        <Button
          text={t("Previous")}
          className={styles["Compliance_CloseButton"]}
          // onClick={handleClickNextBtn}
          // disableBtn={
          //   complianceDetails.complianceTitle !== "" &&
          //   complianceDetails.complianceDescription !== "" &&
          //   selectAuthority !== "" &&
          //   selectCriticality !== "" &&
          //   complianceDueDate !== ""
          //     ? false
          //     : true
          // }
        />
      </div>
    </>
  );
};

export default CreateEditViewComplianceChecklist;
