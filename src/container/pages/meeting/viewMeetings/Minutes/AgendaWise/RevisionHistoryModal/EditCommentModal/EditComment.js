import React, { useEffect, useRef } from "react";
import { Button, TextField } from "../../../../../../../../components/elements"; // Importing necessary components
import styles from "./EditComment.module.css"; // Importing CSS styles
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useSelector } from "react-redux"; // Importing Redux hooks
import { Col, Row } from "react-bootstrap"; // Importing Bootstrap components
import ReactQuill from "react-quill";
import { removeHTMLTagsAndTruncate } from "../../../../../../../../commen/functions/utils";

// Functional component for editing a comment
const EditCommentModal = ({
  setEditMinute,
  confirmationEdit,
  setConfirmationEdit,
  setResendMinuteForReview,
  updateMinuteData,
  setUpdateMinutedata,
}) => {
  const { t } = useTranslation(); // Translation hook

  let currentLanguage = localStorage.getItem("i18nextLng");
  const editorRef = useRef(null);

  const { currentMeetingMinutesToReviewData } = useSelector(
    (state) => state.MinutesReducer
  );

  
  const minutesDetails = useSelector(
    (state) =>
      state.MinutesReducer.currentMeetingMinutesToReviewData.minutesDetails
  );
  const minuteID = useSelector(
    (state) => state.MinutesReducer.currentMeetingMinutesToReviewData.minuteID
  );
  const agendaDetails = useSelector(
    (state) =>
      state.MinutesReducer.currentMeetingMinutesToReviewData.agendaDetails
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
        let isEmptyContent = content === "<p><br></p>";
        if (String(content).length >= 501) {
          setUpdateMinutedata((prevState) => ({
            ...prevState,
            MinuteText: isEmptyContent
              ? ""
              : removeHTMLTagsAndTruncate(String(content)),
          }));
        } else {
          setUpdateMinutedata((prevState) => ({
            ...prevState,
            MinuteText: isEmptyContent ? "" : content,
          }));
        }
      }
    }
  };

  useEffect(() => {
    setUpdateMinutedata((prevState) => ({
      ...prevState,
      MinuteText: minutesDetails,
      MinuteID: minuteID,
    }));
  }, []);

  return (
    <>
      <h1 className={styles["Edit-Heading"]}>{t("Edit-minute")}</h1>
      {/* Text area for entering comment */}
      <TextField
        name="textField-RejectComment"
        applyClass={"textField-RejectComment"} // CSS class for text area
        type="text"
        value={
          agendaDetails !== null
            ? // agendaDetails !== undefined
              agendaDetails?.agendaTitle
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
