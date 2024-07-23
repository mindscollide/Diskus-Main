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
  parentMinuteID,
  setParentMinuteID,
  currentUserID,
  currentUserName,
  isAgenda,
}) => {
  const { t } = useTranslation(); // Translation hook

  const dispatch = useDispatch(); // Redux dispatch hook

  // const [editComment, setEditComment] = useState("")

  const { MinutesReducer } = useSelector((state) => state);

  const updateRejectMinutesAgenda = (
    minutesData,
    updateData,
    parentMinuteID
  ) => {
    return minutesData.map((agenda) => {
      // Update main minuteData
      const updatedMinuteData = agenda.minuteData.map((minute) => {
        if (minute.minuteID === parentMinuteID.minuteID) {
          const updatedDeclinedReviews = minute.declinedReviews.map(
            (review) => {
              if (review.fK_WorkFlowActor_ID === 0) {
                return {
                  ...review,
                  fK_ActorBundlesStatus_ID: 0,
                  fK_UID: currentUserID,
                  fK_WorkFlowActor_ID: 0,
                  fK_WorkFlowActionableBundle_ID: 0,
                  fK_ActorBundlesStatusState_ID: 2,
                  actorName: currentUserName,
                  reason: updateData.reason,
                  modifiedOn: new Date()
                    .toISOString()
                    .replace(/[-:T.]/g, "")
                    .slice(0, -3), // current UTC datetime in yyyymmddhhmmss format
                  userProfilePicture: {
                    userID: currentUserID,
                    orignalProfilePictureName: "",
                    displayProfilePictureName:
                      MinutesReducer?.CurrentUserPicture
                        ?.displayProfilePictureName,
                  },
                };
              } else if (
                review.fK_WorkFlowActor_ID ===
                editCommentLocal.fK_WorkFlowActor_ID
              ) {
                return {
                  ...review,
                  fK_ActorBundlesStatus_ID:
                    editCommentLocal.fK_ActorBundlesStatus_ID,
                  fK_UID: editCommentLocal.fK_UID,
                  fK_WorkFlowActor_ID: editCommentLocal.fK_WorkFlowActor_ID,
                  fK_WorkFlowActionableBundle_ID:
                    editCommentLocal.fK_WorkFlowActionableBundle_ID,
                  fK_ActorBundlesStatusState_ID:
                    editCommentLocal.fK_ActorBundlesStatusState_ID,
                  actorName: editCommentLocal.actorName,
                  reason: updateData.reason,
                  modifiedOn: editCommentLocal.modifiedOn,
                  userProfilePicture: editCommentLocal.userProfilePicture,
                };
              }
              return review;
            }
          );

          return {
            ...minute,
            reason: updateData.reason,
            actorBundleStatusID: 4,
            declinedReviews: updatedDeclinedReviews,
          };
        }
        return minute;
      });

      // Update subMinutes if they exist
      const updatedSubMinutes = agenda.subMinutes?.map((subAgenda) => {
        const updatedSubMinuteData = subAgenda.minuteData.map((subMinute) => {
          if (subMinute.minuteID === parentMinuteID.minuteID) {
            const updatedDeclinedReviews = subMinute.declinedReviews.map(
              (review) => {
                if (review.fK_WorkFlowActor_ID === 0) {
                  return {
                    ...review,
                    fK_ActorBundlesStatus_ID: 0,
                    fK_UID: currentUserID,
                    fK_WorkFlowActor_ID: 0,
                    fK_WorkFlowActionableBundle_ID: 0,
                    fK_ActorBundlesStatusState_ID: 2,
                    actorName: currentUserName,
                    reason: updateData.reason,
                    modifiedOn: new Date()
                      .toISOString()
                      .replace(/[-:T.]/g, "")
                      .slice(0, -3), // current UTC datetime in yyyymmddhhmmss format
                    userProfilePicture: {
                      userID: currentUserID,
                      orignalProfilePictureName: "",
                      displayProfilePictureName:
                        MinutesReducer?.CurrentUserPicture
                          ?.displayProfilePictureName,
                    },
                  };
                } else if (
                  review.fK_WorkFlowActor_ID ===
                  editCommentLocal.fK_WorkFlowActor_ID
                ) {
                  return {
                    ...review,
                    fK_ActorBundlesStatus_ID:
                      editCommentLocal.fK_ActorBundlesStatus_ID,
                    fK_UID: editCommentLocal.fK_UID,
                    fK_WorkFlowActor_ID: editCommentLocal.fK_WorkFlowActor_ID,
                    fK_WorkFlowActionableBundle_ID:
                      editCommentLocal.fK_WorkFlowActionableBundle_ID,
                    fK_ActorBundlesStatusState_ID:
                      editCommentLocal.fK_ActorBundlesStatusState_ID,
                    actorName: editCommentLocal.actorName,
                    reason: updateData.reason,
                    modifiedOn: editCommentLocal.modifiedOn,
                    userProfilePicture: editCommentLocal.userProfilePicture,
                  };
                }
                return review;
              }
            );

            return {
              ...subMinute,
              reason: updateData.reason,
              actorBundleStatusID: 4,
              declinedReviews: updatedDeclinedReviews,
            };
          }
          return subMinute;
        });
        return { ...subAgenda, minuteData: updatedSubMinuteData };
      });

      return {
        ...agenda,
        minuteData: updatedMinuteData,
        subMinutes: updatedSubMinutes,
      };
    });
  };

  const updateCommentMinutesGeneral = (
    minutesData,
    updateData,
    parentMinuteID
  ) => {
    return minutesData.map((minute) => {
      if (minute.minuteID === parentMinuteID.minuteID) {
        const updatedDeclinedReviews = minute.declinedReviews.map((review) => {
          if (review.fK_WorkFlowActor_ID === 0) {
            return {
              ...review,
              fK_ActorBundlesStatus_ID: 0,
              fK_UID: currentUserID,
              fK_WorkFlowActor_ID: 0,
              fK_WorkFlowActionableBundle_ID: 0,
              fK_ActorBundlesStatusState_ID: 2,
              actorName: currentUserName,
              reason: updateData.reason,
              modifiedOn: new Date()
                .toISOString()
                .replace(/[-:T.]/g, "")
                .slice(0, -3), // current UTC datetime in yyyymmddhhmmss format
              userProfilePicture: {
                userID: currentUserID,
                orignalProfilePictureName: "",
                displayProfilePictureName:
                  MinutesReducer?.CurrentUserPicture?.displayProfilePictureName,
              },
            };
          } else if (
            review.fK_WorkFlowActor_ID === editCommentLocal.fK_WorkFlowActor_ID
          ) {
            return {
              ...review,
              fK_ActorBundlesStatus_ID:
                editCommentLocal.fK_ActorBundlesStatus_ID,
              fK_UID: editCommentLocal.fK_UID,
              fK_WorkFlowActor_ID: editCommentLocal.fK_WorkFlowActor_ID,
              fK_WorkFlowActionableBundle_ID:
                editCommentLocal.fK_WorkFlowActionableBundle_ID,
              fK_ActorBundlesStatusState_ID:
                editCommentLocal.fK_ActorBundlesStatusState_ID,
              actorName: editCommentLocal.actorName,
              reason: updateData.reason,
              modifiedOn: editCommentLocal.modifiedOn,
              userProfilePicture: editCommentLocal.userProfilePicture,
            };
          }
          return review;
        });

        return {
          ...minute,
          reason: updateData.reason,
          actorBundleStatusID: 4,
          declinedReviews: updatedDeclinedReviews,
        };
      }
      return minute;
    });
  };

  const handleCommentChange = (event) => {
    const { value } = event.target;
    setEditCommentLocal((prevState) => ({
      ...prevState,
      reason: value,
    }));
  };

  const editComment = () => {
    console.log("editCommentLocaleditCommentLocal", editCommentLocal);
    if (isAgenda === false) {
      const updatedMinutesData = updateCommentMinutesGeneral(
        minutesGeneral,
        editCommentLocal,
        parentMinuteID
      );
      console.log("Updated minutes data:", updatedMinutesData);
      setMinutesGeneral(updatedMinutesData);
      dispatch(editCommentModal(false));
    } else {
      const updatedMinutesData = updateRejectMinutesAgenda(
        minutesAgenda,
        editCommentLocal,
        parentMinuteID
      );
      console.log("Updated minutes data:", updatedMinutesData);
      setMinutesAgenda(updatedMinutesData);
      dispatch(editCommentModal(false));
    }
  };

  console.log("editCommentLocaleditCommentLocal", editCommentLocal);

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
                  onClick={editComment} // Click handler for saving changes and closing modal
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
