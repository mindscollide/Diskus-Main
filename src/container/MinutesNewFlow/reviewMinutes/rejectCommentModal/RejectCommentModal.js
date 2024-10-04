import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  TextArea,
  SelectComment,
} from "../../../../components/elements"; // Importing necessary components
import styles from "./RejectCommentModal.module.css"; // Importing CSS module for styling
import { useNavigate } from "react-router-dom";
import { rejectCommentModal } from "../../../../store/actions/Minutes_action"; // Importing action creator
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks
import { Col, Row } from "react-bootstrap"; // Importing Bootstrap components
import CrossIcon from "./../../Images/Cross_Icon.png"; // Importing cross icon image
import { ListOfDefaultRejectionComments } from "../../../../store/actions/Minutes_action";

// RejectCommentModal component definition
const RejectCommentModal = ({
  minuteDataToReject,
  setMinuteDataToReject,
  setMinutesToReview,
  minutesToReview,
  currentUserID,
}) => {
  const { t } = useTranslation(); // Initializing translation function

  const { MinutesReducer } = useSelector((state) => state);

  const dispatch = useDispatch(); // Initializing dispatch function from Redux

  const navigate = useNavigate();

  const [commentText, setCommentText] = useState(""); // State for comment text

  const [commentsList, setCommentsList] = useState(null);

  // Function to handle selection of predefined comments
  const handleCommentSelect = (selectedText) => {
    setCommentText((prevText) => prevText + selectedText + " ");
  };

  useEffect(() => {
    dispatch(ListOfDefaultRejectionComments(navigate, t));
  }, []);

  useEffect(() => {
    if (
      MinutesReducer.ListOfDefaultRejectionCommentsData !== undefined &&
      MinutesReducer.ListOfDefaultRejectionCommentsData !== null
    ) {
      setCommentsList(
        MinutesReducer.ListOfDefaultRejectionCommentsData.defaultCommentsList
      );
    } else {
      setCommentsList(null);
    }
    return () => {
      setCommentsList(null);
    };
  }, [MinutesReducer.ListOfDefaultRejectionCommentsData]);

  useEffect(() => {
    if (
      MinutesReducer.RejectMinuteData !== null &&
      MinutesReducer.RejectMinuteData !== undefined
    ) {
      setMinuteDataToReject(MinutesReducer.RejectMinuteData);
    }
  }, [MinutesReducer.RejectMinuteData]);

  const RejectButton = () => {
    // Update state
    const updatedMinuteData = {
      ...minuteDataToReject,
      reason: commentText,
      actorBundleStatusID: 4,
      userProfilePicture: {
        userID: currentUserID,
        orignalProfilePictureName: "",
        displayProfilePictureName:
          MinutesReducer?.CurrentUserPicture?.displayProfilePictureName,
      },
    };

    // Optional: Update local state if needed
    setMinuteDataToReject(updatedMinuteData);
    dispatch(rejectCommentModal(false));
    setMinutesToReview(minutesToReview - 1);
    console.log("Updated Minute Data to Reject:", MinutesReducer);
  };

  return (
    <section>
      {/* Modal component */}
      <Modal
        show={true} // Hardcoded to always show modal
        setShow={dispatch(rejectCommentModal)} // Dispatching action to set modal state
        modalFooterClassName={"d-block"} // Custom CSS class for modal footer
        modalHeaderClassName={"d-block"} // Custom CSS class for modal header
        className="SelectAgendaModal" // Additional CSS classes for modal
        onHide={() => {
          dispatch(rejectCommentModal(false)); // Dispatching action to hide modal
        }}
        size={"md"} // Size of the modal
        ModalTitle={
          // JSX for modal title
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className="position-relative">
                <p className={styles["RejectCommentTitle"]}>
                  {t("Leave-a-comment")} {/* Translation for title */}
                </p>
                <img
                  onClick={() => dispatch(rejectCommentModal(false))}
                  className={styles["image-close"]} // Styling for close icon
                  src={CrossIcon} // Image for close icon
                  alt=""
                />
              </Col>
            </Row>
          </>
        }
        ModalBody={
          // JSX for modal body
          <>
            <TextArea
              name="textField-RejectComment"
              className={styles["textField-RejectComment"]} // Styling for text area
              type="text"
              placeholder={t("Write-a-reason")} // Translation for placeholder
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)} // Update text area value if typed directly
              labelClassName={"d-none"} // Custom CSS class for label (hidden)
              timeClass={"d-none"} // Custom CSS class for time (hidden)
            />
            {/* Predefined comment options */}
            {commentsList !== null && commentsList !== undefined
              ? commentsList.map((item) => (
                  <SelectComment
                    key={item.id}
                    text={item.comment}
                    onClick={() => handleCommentSelect(item.comment)}
                  />
                ))
              : null}
          </>
        }
        ModalFooter={
          // JSX for modal footer
          <>
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  onClick={RejectButton}
                  text={t("Reject")} // Translation for button text
                  className={styles["Reject_Comment_Modal"]} // Styling for reject button
                  disableBtn={commentText === ""}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default RejectCommentModal; // Exporting RejectCommentModal component
