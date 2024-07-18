import React, { useState, useEffect } from "react";
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
      minuteText: value,
    }));
  };

  useEffect(() => {
    setUpdateMinutedata((prevState) => ({
      ...prevState,
      minuteText: currentMeetingMinutesToReviewData.minutesDetails,
      minuteID: currentMeetingMinutesToReviewData.minuteID,
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
            ? currentMeetingMinutesToReviewData.agendaDetails.agendaTitle
            : t("General-minute")
        }
        placeholder={t("Write-a-comment")} // Placeholder text for text area
        disable={true}
      />

      <TextArea
        name="textField-RejectComment"
        className={styles["textField-RejectComment"]} // CSS class for text area
        type="text"
        value={updateMinuteData.minuteText}
        placeholder={t("Write-a-comment")} // Placeholder text for text area
        labelClassName={"d-none"} // CSS class for label
        timeClass={"d-none"} // CSS class for time
        onChange={handleChange}
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
