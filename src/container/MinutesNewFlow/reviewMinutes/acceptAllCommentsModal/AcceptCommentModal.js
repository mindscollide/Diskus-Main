import React, { useState } from "react";
import {
  Modal,
  Button,
  TextArea,
  SelectComment,
} from "../../../../components/elements"; // Importing necessary components
import styles from "./AcceptCommentModal.module.css"; // Importing CSS styles
import { acceptCommentModal } from "../../../../store/actions/Minutes_action"; // Importing action creator
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks
import { Col, Row } from "react-bootstrap"; // Importing Bootstrap components
import CrossIcon from "./../../Images/Cross_Icon.png"; // Importing image

// Functional component for deleting a comment
const AcceptCommentModal = ({
  minutesAgenda,
  setMinutesAgenda,
  minutesGeneral,
  setMinutesGeneral,
}) => {
  const { t } = useTranslation(); // Translation hook

  const dispatch = useDispatch(); // Redux dispatch hook

  const acceptAllComments = () => {
    try {
      // Update minutesAgenda
      const updatedState1 = minutesAgenda.map((agenda) => ({
        ...agenda,
        minuteData:
          agenda?.minuteData?.map((minute) => ({
            ...minute,
            actorBundleStatusID: 3,
          })) || [], // Default to empty array if minuteData is undefined
        subMinutes:
          agenda?.subMinutes?.map((subMinute) => ({
            ...subMinute,
            minuteData:
              subMinute?.minuteData?.map((minute) => ({
                ...minute,
                actorBundleStatusID: 3,
              })) || [], // Default to empty array if minuteData is undefined
          })) || [], // Default to empty array if subMinutes is undefined
      }));

      // Update minutesGeneral
      const updatedState2 =
        minutesGeneral?.map((minute) => ({
          ...minute,
          actorBundleStatusID: 3,
        })) || []; // Default to empty array if minutesGeneral is undefined

      // Set the updated states
      setMinutesAgenda(updatedState1);
      setMinutesGeneral(updatedState2);
      dispatch(acceptCommentModal(false));
    } catch (error) {
      console.log("Error", error);
    }
  };

  console.log("MinutesReducerMinutesReducer", minutesAgenda, minutesGeneral);

  return (
    <section>
      {/* Modal component */}
      <Modal
        show={true} // Show modal
        setShow={dispatch(acceptCommentModal)} // Set show modal action
        modalFooterClassName={"d-block"} // CSS class for modal footer
        modalHeaderClassName={"d-block"} // CSS class for modal header
        className="AcceptCommentModal" // Additional CSS class for modal
        onHide={() => {
          dispatch(acceptCommentModal(false)); // Hide modal action
        }}
        size={"md"} // Modal size
        ModalBody={
          // Modal body section
          <>
            {/* Delete comment message */}
            <p className={styles["delete-comment-message"]}>
              {t("If-you-accept-all-minutes")}
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
                {/* Button for confirming acceptance */}
                <Button
                  onClick={acceptAllComments} // Click handler for confirming acceptance and closing modal
                  text={t("Yes")} // Translation for "Yes" button
                  className={styles["Yes_Modal"]} // CSS class for "Yes" button
                />
                {/* Button for canceling acceptance */}
                <Button
                  onClick={() => dispatch(acceptCommentModal(false))} // Click handler for canceling acceptance and closing modal
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

export default AcceptCommentModal; // Exporting the component
