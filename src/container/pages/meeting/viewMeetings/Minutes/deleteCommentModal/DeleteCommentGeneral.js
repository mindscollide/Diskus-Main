import React from "react";
import { Modal, Button } from "../../../../../../components/elements"; // Importing necessary components
import styles from "./DeleteCommentModal.module.css"; // Importing CSS styles
import {
  DeleteMinuteReducer,
  deleteCommentModalGeneral,
} from "../../../../../../store/actions/Minutes_action"; // Importing action creator
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks
import { Col, Row } from "react-bootstrap"; // Importing Bootstrap components
import { DeleteGeneralMinuteDocumentsApiFunc } from "../../../../../../store/actions/NewMeetingActions";

// Functional component for deleting a comment
const DeleteCommentGeneral = ({ advanceMeetingModalID }) => {
  const { MinutesReducer } = useSelector((state) => state);

  const { t } = useTranslation(); // Translation hook

  const dispatch = useDispatch(); // Redux dispatch hook

  const navigate = useNavigate();

  const handleRemovingTheMinutes = () => {
    let MinuteData = MinutesReducer?.DeleteMinuteReducerData;
    let Data = {
      MDID: Number(advanceMeetingModalID),
      MeetingGeneralMinutesID: MinuteData.minuteID,
    };
    dispatch(
      DeleteGeneralMinuteDocumentsApiFunc(
        navigate,
        Data,
        t,
        advanceMeetingModalID,
        MinuteData
      )
    );
    dispatch(deleteCommentModalGeneral(false));
  };

  console.log("This is Delete Modal of General");

  return (
    <section>
      {/* Modal component */}
      <Modal
        show={true} // Show modal
        setShow={dispatch(deleteCommentModalGeneral)} // Set show modal action
        modalFooterClassName={"d-block"} // CSS class for modal footer
        modalHeaderClassName={"d-block"} // CSS class for modal header
        className="DeleteCommentModal" // Additional CSS class for modal
        onHide={() => {
          dispatch(deleteCommentModalGeneral(false)); // Hide modal action
        }}
        size={"md"} // Modal size
        ModalBody={
          // Modal body section
          <>
            {/* Delete comment message */}
            <div className="d-flex justify-content-center align-items-center">
              <p className={styles["delete-comment-message"]}>
                {t("Are-you-sure-you-want-to-delete-this-minute")}
                {/* Translation for delete comment message */}
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
                {/* Button for confirming deletion */}
                <Button
                  onClick={handleRemovingTheMinutes} // Click handler for confirming deletion and closing modal
                  text={t("Yes")} // Translation for "Yes" button
                  className={styles["Yes_Modal"]} // CSS class for "Yes" button
                />
                {/* Button for canceling deletion */}
                <Button
                  onClick={() => {
                    dispatch(deleteCommentModalGeneral(false));
                    dispatch(DeleteMinuteReducer(null));
                  }} // Click handler for canceling deletion and closing modal
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

export default DeleteCommentGeneral; // Exporting the component
