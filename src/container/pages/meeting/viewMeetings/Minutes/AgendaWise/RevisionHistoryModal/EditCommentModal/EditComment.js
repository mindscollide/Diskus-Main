import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  TextArea,
  SelectComment,
  TextField,
} from "../../../../../../../../components/elements"; // Importing necessary components
import styles from "./EditComment.module.css"; // Importing CSS styles
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks
import { Col, Row } from "react-bootstrap"; // Importing Bootstrap components
import CrossIcon from "./../../../../../../../MinutesNewFlow/Images/Cross_Icon.png";
import ReactQuill, { Quill } from "react-quill";

// Functional component for editing a comment
const EditCommentModal = ({
  editMinute,
  setEditMinute,
  confirmationEdit,
  setConfirmationEdit,
  resendMinuteForReview,
  setResendMinuteForReview,
  editMinuteData,
  updateMinuteData,
  setUpdateMinutedata,
}) => {
  const { t } = useTranslation(); // Translation hook

  const dispatch = useDispatch(); // Redux dispatch hook
  let currentLanguage = localStorage.getItem("i18nextLng");
  const editorRef = useRef(null);

  const { currentMeetingMinutesToReviewData } = useSelector(
    (state) => state.MinutesReducer
  );

  const cancelEditMinute = () => {
    if (confirmationEdit === false) {
      setConfirmationEdit(true);
      setEditMinute(false);
    } else {
      setConfirmationEdit(false);
    }
  };

  const resendMinuteReview = () => {
    setEditMinute(false);
    setResendMinuteForReview(true);
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setUpdateMinutedata((prevState) => ({
      ...prevState,
      MinuteText: value,
    }));
  };

  const onTextChange = (content, delta, source) => {
    const deltaOps = delta.ops || [];

    // Check if any image is being pasted
    const containsImage = deltaOps.some((op) => op.insert && op.insert.image);
    if (containsImage) {
      setUpdateMinutedata((prevState) => ({
        ...prevState,
        MinuteText: "",
      }));
    } else {
      if (source === "user") {
        const isEmptyContent = content === "<p><br></p>";
        setUpdateMinutedata((prevState) => ({
          ...prevState,
          MinuteText: isEmptyContent ? "" : content,
        }));
      }
    }
  };

  useEffect(() => {
    setUpdateMinutedata((prevState) => ({
      ...prevState,
      MinuteText: currentMeetingMinutesToReviewData.minutesDetails,
      MinuteID: currentMeetingMinutesToReviewData.minuteID,
    }));
  }, []);

  console.log("EditMinuteDataEditMinuteData", editMinuteData, updateMinuteData);

  console.log(
    "currentMeetingMinutesToReviewData",
    currentMeetingMinutesToReviewData
  );

  return (
    <>
      <h1 className={styles["Edit-Heading"]}>{t("Edit-minute")}</h1>
      {/* Text area for entering comment */}
      <TextField
        name="textField-RejectComment"
        applyClass={"textField-RejectComment"} // CSS class for text area
        type="text"
        value={
          currentMeetingMinutesToReviewData.agendaDetails !== null
            ? // currentMeetingMinutesToReviewData.agendaDetails !== undefined
              currentMeetingMinutesToReviewData.agendaDetails.agendaTitle
            : t("General-minute")
        }
        placeholder={t("Write-a-comment")} // Placeholder text for text area
        disable={true}
      />

      <ReactQuill
        ref={editorRef}
        theme="snow"
        value={updateMinuteData.MinuteText || ""}
        placeholder={t("Minutes-details")}
        onChange={onTextChange}
        className={styles["quill-height-addNote"]}
        style={{
          direction: currentLanguage === "ar" ? "rtl" : "ltr",
        }}
      />

      {/* <TextArea
        name="textField-RejectComment"
        className={styles["textField-RejectComment"]} // CSS class for text area
        type="text"
        value={updateMinuteData.MinuteText}
        placeholder={t("Write-a-comment")} // Placeholder text for text area
        labelClassName={"d-none"} // CSS class for label
        timeClass={"d-none"} // CSS class for time
        onChange={handleChange}
      /> */}

      <Row className="mt-4">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2" // CSS class for flex layout
        >
          {/* Button for saving changes */}
          <Button
            text={t("Cancel")} // Translation for button text
            className={styles["Cancel_Button"]} // CSS class for button
            onClick={cancelEditMinute}
          />
          <Button
            text={t("Resend")} // Translation for button text
            className={styles["Resend_Button"]} // CSS class for button
            onClick={resendMinuteReview}
          />
        </Col>
      </Row>
    </>
  );
};

export default EditCommentModal; // Exporting the component
