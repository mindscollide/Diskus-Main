import React from "react";
import { Modal, Button } from "../../../../../../components/elements"; // Importing necessary components
import styles from "./PublishAnywayModal.module.css"; // Importing CSS styles
import AllReviewed from "./../Images/All-reviewed.png";
import { MeetingPublishedMinutesApi } from "../../../../../../store/actions/Minutes_action"; // Importing action creator
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch } from "react-redux"; // Importing Redux hooks
import { Col, Row } from "react-bootstrap"; // Importing Bootstrap components

// Functional component for deleting a comment
const PublishAnywayModal = ({
  setPublishAnywayModal,
  setApprovalModal,
  advanceMeetingModalID,
}) => {
  const { t } = useTranslation(); // Translation hook

  const dispatch = useDispatch(); // Redux dispatch hook

  const navigate = useNavigate();

  const publishMinutes = () => {
    let Data = { MeetingID: Number(advanceMeetingModalID) };
    dispatch(
      MeetingPublishedMinutesApi(
        Data,
        navigate,
        t,
        setApprovalModal,
        setPublishAnywayModal
      )
    );
  };

  return (
    <section>
      {/* Modal component */}
      <Modal
        show={true} // Show modal
        setShow={() => setPublishAnywayModal(false)} // Set show modal action
        modalFooterClassName={"d-block"} // CSS class for modal footer
        modalHeaderClassName={"d-block"} // CSS class for modal header
        className="AllReviewedModal" // Additional CSS class for modal
        onHide={() => {
          setPublishAnywayModal(false); // Hide modal action
        }}
        size={"md"} // Modal size
        ModalBody={
          // Modal body section
          <>
            {/* Delete comment message */}
            <div className="d-flex justify-content-center align-items-center">
              <img src={AllReviewed} alt="" />
            </div>
            <div className={styles["text-section"]}>
              <p className={styles["delete-comment-message"]}>
                {t("All-minutes-reviewed-go-publish")}
              </p>
            </div>
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
                <Button
                  onClick={() => {
                    setPublishAnywayModal(false);
                  }} // Click handler for canceling deletion and closing modal
                  text={t("Cancel")} // Translation for "Yes" button
                  className={styles["Yes_Modal"]} // CSS class for "Yes" button
                />
                <Button
                  onClick={publishMinutes}
                  text={t("Publish")} // Translation for "No" button
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

export default PublishAnywayModal; // Exporting the component
