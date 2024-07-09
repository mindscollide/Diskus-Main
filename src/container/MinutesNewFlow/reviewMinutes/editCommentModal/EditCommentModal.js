import React, { useState } from "react";
import {
  Modal,
  Button,
  TextArea,
  SelectComment,
} from "../../../../components/elements"; // Importing necessary components
import styles from "./EditCommentModa.module.css"; // Importing CSS styles
import { editCommentModal } from "../../../../store/actions/Minutes_action"; // Importing action creator
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks
import { Col, Row } from "react-bootstrap"; // Importing Bootstrap components
import CrossIcon from "./../../Images/Cross_Icon.png"; // Importing image

// Functional component for editing a comment
const EditCommentModal = ({
  minutesAgenda,
  setMinutesAgenda,
  minutesGeneral,
  setMinutesGeneral,
  editCommentLocal,
  setEditCommentLocal,
}) => {
  const { t } = useTranslation(); // Translation hook

  const dispatch = useDispatch(); // Redux dispatch hook

  const handleCommentChange = (event) => {
    const { value } = event.target;
    setEditCommentLocal((prevState) => ({
      ...prevState,
      reason: value,
    }));
  };

  return (
    <section>
      {/* Modal component */}
      <Modal
        show={true} // Show modal
        setShow={dispatch(editCommentModal)} // Set show modal action
        modalFooterClassName={"d-block"} // CSS class for modal footer
        modalHeaderClassName={"d-block"} // CSS class for modal header
        className="SelectAgendaModal" // Additional CSS class for modal
        onHide={() => {
          dispatch(editCommentModal(false)); // Hide modal action
        }}
        size={"md"} // Modal size
        ModalTitle={
          // Modal title section
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className="position-relative">
                {/* Title */}
                <p className={styles["EditCommentTitle"]}>
                  {t("Edit-comment")} {/* Translation for title */}
                </p>
                {/* Close icon */}
                <img
                  onClick={() => dispatch(editCommentModal(false))} // Click handler for closing modal
                  className={styles["image-close"]} // CSS class for close icon
                  src={CrossIcon} // Image source
                  alt="" // Image alt text
                />
              </Col>
            </Row>
          </>
        }
        ModalBody={
          // Modal body section
          <>
            {/* Text area for entering comment */}
            <TextArea
              name="textField-RejectComment"
              className={styles["textField-RejectComment"]} // CSS class for text area
              type="text"
              value={editCommentLocal.reason}
              placeholder={t("Write-a-comment")} // Placeholder text for text area
              labelClassName={"d-none"} // CSS class for label
              timeClass={"d-none"} // CSS class for time
              onChange={handleCommentChange}
              // onChange={(e) => setCommentText(e.target.value)}
            />
          </>
        }
        ModalFooter={
          // Modal footer section
          <>
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2" // CSS class for flex layout
              >
                {/* Button for saving changes */}
                <Button
                  onClick={() => dispatch(editCommentModal(false))} // Click handler for saving changes and closing modal
                  text={t("Save-changes")} // Translation for button text
                  className={styles["Edit_Comment_Modal"]} // CSS class for button
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default EditCommentModal; // Exporting the component
