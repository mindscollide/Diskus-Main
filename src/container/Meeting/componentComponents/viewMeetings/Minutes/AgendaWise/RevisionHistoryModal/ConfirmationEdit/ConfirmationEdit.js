import React from "react";
import { Button } from "../../../../../../../../components/elements/index.js"; // Importing necessary components
import styles from "./ConfirmationEdit.module.css"; // Importing CSS styles
import { useTranslation } from "react-i18next"; // Importing translation hook
import { Col, Row } from "react-bootstrap"; // Importing Bootstrap components

// Functional component for editing a comment
const ConfirmationEditData = ({
  setEditMinute,
  setConfirmationEdit,
  setResendMinuteForReview,
}) => {
  const { t } = useTranslation(); // Translation hook

  return (
    <>
      {/* Delete comment message */}
      <div className="d-flex justify-content-center align-items-center">
        <p className={styles["delete-comment-message"]}>
          {t("Any-unsaved-changes-will-be-lost-continue")}
          {/* Translation for delete comment message */}
        </p>
      </div>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-center gap-2" // CSS class for flex layout
        >
          {/* Button for confirming deletion */}
          <Button
            text={t("Cancel")} // Translation for "Yes" button
            className={styles["Yes_Modal"]} // CSS class for "Yes" button
            onClick={() => {
              setEditMinute(true);
              setConfirmationEdit(false);
              setResendMinuteForReview(false);
            }}
          />
          {/* Button for canceling deletion */}
          <Button
            text={t("Continue")} // Translation for "No" button
            onClick={() => {
              setEditMinute(false);
              setConfirmationEdit(false);
              setResendMinuteForReview(false);
            }}
            className={styles["No_Modal"]} // CSS class for "No" button
          />
        </Col>
      </Row>
    </>
  );
};

export default ConfirmationEditData; // Exporting the component
