import React, { useEffect, useRef, useState } from "react";
import {
  AttachmentViewer,
  Button,
  Modal,
} from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { Col, Row } from "react-bootstrap";
import styles from "./complianceStatusReopenedModal.module.css";
import { TextAreafieldwithCount } from "../../../../../components/elements/input_field/Input_field_withCount";
import DatePicker from "react-multi-date-picker";
import moment from "moment";
import InputIcon from "react-multi-date-picker/components/input_icon";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import CustomUpload from "../../../../../components/elements/upload/Upload";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import { maxFileSize } from "../../../../../commen/functions/utils";
import {
  formatDateToYMD,
  parseUTCDateString,
  parseYYYYMMDDHHmmssToDate,
  parseYYYYMMDDToEndOfDay,
} from "../../commonFunctions";
const ComplianceStatusReopenedModal = ({ view, handleProceedButtonView }) => {
  const { t } = useTranslation();
  const [tempDueDateChange, setTempDueDateChange] = useState("");

  const [fileForSend, setFileForSend] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const calendRef = useRef();
  //Upload File States
  const [openCalendarValue, setOpenCalendarValue] = useState(null);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  let createrID = localStorage.getItem("userID");
  const {
    complianceReopenDetailsState,
    setComplianceReopenDetailsState,
    setComplianceDetailsState,
    tempSelectComplianceStatus,
    resetModalStates,
    complianceDetailsState,
    comlianceStatusReopenedModal,
    setComlianceStatusReopenedModal,
    complianceAddEditViewState,
  } = useComplianceContext();
  console.log(
    complianceReopenDetailsState,
    complianceDetailsState,
    "complianceReopenDetailsState",
  );

  const handleCloseButton = () => {
    if (complianceDetailsState.status.value === 7)
      setComlianceStatusReopenedModal(false);
    else {
      resetModalStates();
    }
  };

  const handleProceedButton = () => {
    console.log(comlianceStatusReopenedModal, "comlianceStatusReopenedModal");
    setComlianceStatusReopenedModal(false);
    setComplianceDetailsState((prev) => ({
      ...prev,
      status: tempSelectComplianceStatus,
      dueDate: tempDueDateChange,
    }));
  };

  const handleValueChange = (event) => {
    const { value, name } = event.target;

    // Remove leading spaces
    const trimmedValue = value.replace(/^\s+/, "");
    if (name === "reason") {
      // reason
      setComplianceReopenDetailsState((prev) => ({
        ...prev,
        reason: trimmedValue,
      }));
    }
  };

  const changeComplainceDueDate = (date) => {
    let meetingDateValueFormat2 = new Date(date);
    meetingDateValueFormat2.setHours(23);
    meetingDateValueFormat2.setMinutes(59);
    meetingDateValueFormat2.setSeconds(58);

    console.log(meetingDateValueFormat2, "meetingDateValueFormat2");

    setComplianceReopenDetailsState((prev) => ({
      ...prev,
      dueDate: meetingDateValueFormat2,
    }));
    setTempDueDateChange(meetingDateValueFormat2);
  };

  let previousFileList = [];

  //Upload File Handler
  const uploadFilesToDo = (data) => {
    console.log(data, "uploadFilesToDouploadFilesToDo");
    let filesArray = Object.values(data.target.files);
    let totalFiles =
      filesArray.length + complianceReopenDetailsState.attachments.length;
    let sizezero = true;
    let size = true;

    if (totalFiles > 10) {
      showMessage(t("Not-allowed-more-than-10-files"), "error", setOpen);
      return;
    }
    filesArray.forEach((fileData, index) => {
      if (fileData.size > maxFileSize) {
        size = false;
      } else if (fileData.size === 0) {
        sizezero = false;
      }

      let fileExists = complianceReopenDetailsState.attachments.some(
        (oldFileData) => oldFileData.name === fileData.name,
      );

      if (!size) {
        showMessage(
          t("File-size-should-not-be-greater-than-1-5GB"),
          "error",
          setOpen,
        );
      } else if (!sizezero) {
        showMessage(t("File-size-should-not-be-zero"), "error", setOpen);
      } else if (fileExists) {
        showMessage(t("File-already-exists"), "error", setOpen);
      } else {
        setComplianceReopenDetailsState((prev) => ({
          ...prev,
          attachments: [...prev.attachments, fileData],
        }));
      }
      // Update previousFileList to current fileList
      previousFileList = filesArray;
    });
  };
  const deleteFilefromAttachments = (data) => {
    setComplianceReopenDetailsState((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((file) => file.name !== data.name),
    }));
  };

  // const currentDueDateObj = parseYYYYMMDDToEndOfDay(
  //   complianceDetailsState?.dueDate,
  // );

  // Make it strictly greater than current due date by adding 1 day
  let minSelectableDate;

  if (complianceDetailsState?.dueDate && complianceAddEditViewState === 2) {
    const currentDueDate = new Date(complianceDetailsState.dueDate);

    // Validate the date
    if (currentDueDate instanceof Date && !isNaN(currentDueDate.getTime())) {
      minSelectableDate = new Date(currentDueDate);
      minSelectableDate.setDate(minSelectableDate.getDate() + 1);
      minSelectableDate.setHours(0, 0, 0, 0); // start of the day
    }
  } else if (
    complianceAddEditViewState === 3 &&
    complianceDetailsState?.dueDate
  ) {
    const currentDueDateObj = parseYYYYMMDDToEndOfDay(
      complianceDetailsState?.dueDate,
    );

    // Validate the parsed date
    if (
      currentDueDateObj instanceof Date &&
      !isNaN(currentDueDateObj.getTime())
    ) {
      minSelectableDate = new Date(currentDueDateObj);
      minSelectableDate.setDate(minSelectableDate.getDate() + 1);
      minSelectableDate.setHours(0, 0, 0, 0); // start of the day
    }
  }

  return (
    <Modal
      show={comlianceStatusReopenedModal}
      setShow={setComlianceStatusReopenedModal}
      modalFooterClassName={"d-block border-0"}
      // modalHeaderClassName={"d-block border-0"}
      modalTitleClassName={styles.StatusTitle}
      contentClassName={styles["StatusChangeModal"]}
      onHide={handleCloseButton}
      ModalTitle={`${t("Edit: ")} ${complianceDetailsState.complianceTitle}`}
      size={"lg"}
      ModalBody={
        <>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <TextAreafieldwithCount
                label={
                  <>
                    {t("Reason")}
                    <span className={styles["sterick"]}>{" *"}</span>
                  </>
                }
                labelClass={styles["labelStyle"]}
                placeholder={t("Reason")}
                showCount={true}
                maxLength={500}
                onChange={handleValueChange}
                name="reason"
                preFixClas={"AddEditAuthorityCounterInputFieldTextArea"}
                value={complianceReopenDetailsState.reason}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={6}>
              <div
                className={`${styles["labelStyle"]} ${styles["Select_label"]}`}
              >
                {t("Due-date")}
                <span className={styles["sterick"]}>{" *"}</span>
              </div>
              <DatePicker
                value={
                  openCalendarValue ||
                  complianceReopenDetailsState?.dueDate ||
                  ""
                }
                format={"DD/MM/YYYY"}
                // minDate={moment().toDate()}
                minDate={minSelectableDate}
                currentDate={minSelectableDate}
                placeholder={t("Due-date")}
                render={
                  <InputIcon
                    placeholder={t("Due-date")}
                    className={`${styles["datepicker_input"]} ${
                      complianceDetailsState?.authority?.value === 0
                        ? styles["disabledInput"]
                        : ""
                    }`}
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
                ref={calendRef}
                default
                onOpen={() => {
                  setOpenCalendarValue(minSelectableDate); // forces calendar to open on April
                  setTimeout(() => setOpenCalendarValue(null), 0); // clears field so no date selected
                }}
                // onFocusedDateChange={changeComplainceDueDate}
                onChange={changeComplainceDueDate}
              />
            </Col>
            <Col sm={12} md={6} lg={6}>
              <div
                className={`d-flex align-items-center justify-content-center ${styles["labelStyle"]} ${styles["Select_label"]}`}
              >
                {t("Current-due-date")}
              </div>
              <div className="d-flex align-items-center justify-content-center">
                {formatDateToYMD(complianceDetailsState.dueDate)}
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12} md={12} xs={12} className=" attachmentCon ">
              <label className="ArabicFontSemiBold">{t("Attachement")}</label>
              <span className="custom-upload-input">
                <CustomUpload
                  multiple={true}
                  change={uploadFilesToDo}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  className="UploadFileButton"
                />
              </span>
              <section className="todolist_files ">
                {complianceReopenDetailsState.attachments.length > 0
                  ? complianceReopenDetailsState.attachments.map(
                      (data, index) => {
                        return (
                          <AttachmentViewer
                            name={data.name}
                            data={data}
                            id={0}
                            fk_UID={createrID}
                            handleClickRemove={() => {
                              deleteFilefromAttachments(data, index);
                            }}
                          />
                        );
                      },
                    )
                  : null}
              </section>
            </Col>
          </Row>
        </>
      }
      ModalFooter={
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex justify-content-center gap-2"
            >
              <Button
                text={t("Close")}
                className={styles["CancelButton"]}
                onClick={handleCloseButton}
              />
              <Button
                text={t("Proceed")}
                className={styles["ProceedButtonStyles"]}
                onClick={view ? handleProceedButtonView : handleProceedButton}
                disableBtn={
                  complianceReopenDetailsState.reason === "" ||
                  complianceReopenDetailsState.dueDate === ""
                }
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default ComplianceStatusReopenedModal;
