import React from "react";
import { Modal, Button } from "../../../../components/elements"; // Importing necessary components
import styles from "./DeleteCommentModal.module.css"; // Importing CSS styles
import { deleteCommentModal } from "../../../../store/actions/Minutes_action"; // Importing action creator
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch } from "react-redux"; // Importing Redux hooks
import { Col, Row } from "react-bootstrap"; // Importing Bootstrap components
import {
  updateCommentMinutesGeneral,
  updateRejectMinutesAgenda,
} from "../utilsFunction";

// Functional component for deleting a comment
const DeleteCommentModal = ({
  deleteCommentLocal,
  minutesAgenda,
  setMinutesAgenda,
  minutesGeneral,
  setMinutesGeneral,
  parentMinuteID,
  isAgenda,
  minutesToReview,
  setMinutesToReview,
}) => {
  const { t } = useTranslation(); // Translation hook

  const dispatch = useDispatch(); // Redux dispatch hook

  // Example usage
  const deleteComment = () => {
    if (isAgenda === false) {
      const updatedMinutesData = updateCommentMinutesGeneral(
        minutesGeneral,
        deleteCommentLocal,
        parentMinuteID,
        deleteCommentLocal
      );
      setMinutesGeneral(updatedMinutesData);
      setMinutesToReview(minutesToReview + 1);
      dispatch(deleteCommentModal(false));
    } else {
      const updatedMinutesData = updateRejectMinutesAgenda(
        minutesAgenda,
        deleteCommentLocal,
        parentMinuteID,
        deleteCommentLocal
      );
      setMinutesAgenda(updatedMinutesData);
      setMinutesToReview(minutesToReview + 1);
      dispatch(deleteCommentModal(false));
    }
  };

  return (
    <section>
      {/* Modal component */}
      <Modal
        show={true} // Show modal
        setShow={dispatch(deleteCommentModal)} // Set show modal action
        modalFooterClassName={"d-block"} // CSS class for modal footer
        modalHeaderClassName={"d-block"} // CSS class for modal header
        className="DeleteCommentModal" // Additional CSS class for modal
        onHide={() => {
          dispatch(deleteCommentModal(false)); // Hide modal action
        }}
        size={"md"} // Modal size
        ModalBody={
          // Modal body section
          <>
            {/* Delete comment message */}
            <p className={styles["delete-comment-message"]}>
              {t("Are-you-sure-you-want-to-delete-your-comment")}{" "}
              {/* Translation for delete comment message */}
            </p>
          </>
        }
        ModalFooter={
          // Modal footer section
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center gap-2" // CSS class for flex layout
              >
                {/* Button for confirming deletion */}
                <Button
                  onClick={deleteComment} // Click handler for confirming deletion and closing modal
                  text={t("Yes")} // Translation for "Yes" button
                  className={styles["Yes_Modal"]} // CSS class for "Yes" button
                />
                {/* Button for canceling deletion */}
                <Button
                  onClick={() => dispatch(deleteCommentModal(false))} // Click handler for canceling deletion and closing modal
                  text={t("No")} // Translation for "No" button
                  className={styles["No_Modal"]} // CSS class for "No" button
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default DeleteCommentModal; // Exporting the component
