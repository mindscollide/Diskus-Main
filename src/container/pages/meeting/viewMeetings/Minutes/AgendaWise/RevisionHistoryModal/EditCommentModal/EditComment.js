import React, { useState } from "react";
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
}) => {
  const { t } = useTranslation(); // Translation hook

  const dispatch = useDispatch(); // Redux dispatch hook

  const cancelEditMinute = () => {
    if (confirmationEdit === false) {
      setConfirmationEdit(true);
      setEditMinute(false);
    } else {
      setConfirmationEdit(false);
    }
  };

  return (
    <>
      <h1 className={styles["Edit-Heading"]}>{t("Edit-minute")}</h1>
      {/* Text area for entering comment */}
      <TextField
        name="textField-RejectComment"
        applyClass={"textField-RejectComment"} // CSS class for text area
        type="text"
        value={"CEO Speech"}
        placeholder={t("Write-a-comment")} // Placeholder text for text area
      />
      <TextArea
        name="textField-RejectComment"
        className={styles["textField-RejectComment"]} // CSS class for text area
        type="text"
        // value={"I reject this minute as it appears to be a repetitive copy-and-paste error, with the same text repeated three times. It lacks clarity and coherence, and it does not provide any meaningful information or updates on the task. Additionally, the reference to the "unknown unknown printer took a galley of type a printer took a galley of type a" seems to be a nonsensical placeholder or mistake. Please provide a revised and accurate update for the task."}
        value={
          "I reject this minute as it appears to be a repetitive copy-and-paste error, with the same text repeated three times. It lacks clarity and coherence, and it does not provide any meaningful information or updates on the task. Additionally, the reference to the unknown unknown printer took a galley of type a printer took a galley of type a seems to be a nonsensical placeholder or mistake. Please provide a revised and accurate update for the task."
        }
        placeholder={t("Write-a-comment")} // Placeholder text for text area
        labelClassName={"d-none"} // CSS class for label
        timeClass={"d-none"} // CSS class for time
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
          />
        </Col>
      </Row>
    </>
  );
};

export default EditCommentModal; // Exporting the component
