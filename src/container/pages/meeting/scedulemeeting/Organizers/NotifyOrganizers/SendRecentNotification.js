import React, { useState } from "react";
import {
  Modal,
  Button,
  TextField,
  Checkbox,
} from "../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import styles from "./NotifyOrganizors.module.css";
import { useDispatch, useSelector } from "react-redux";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import {
  sendNotificationOrganizer,
  notificationUpdateData,
} from "../../../../../../store/actions/MeetingOrganizers_action";
import { useNavigate } from "react-router-dom";
import { sendRecentNotificationOrganizerModal } from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import { validateInput } from "../../../../../../commen/functions/regex";

const SendNotificationOrganizer = ({ currentMeeting }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state
  );
  const [notifyOrganizerData, setNotifyOrganizerData] = useState({
    Messege: "",
    allOrganizersAccept: false,
  });

  const [membersHide, setMembersHide] = useState(false);

  // Initialize membersOrganizers state with the modified 'isOrganizerNotified' property
  const initialMembersOrganizers =
    MeetingOrganizersReducer.NotificationSendData.map((member) => ({
      ...member,
      isOrganizerNotified: true,
    }));

  const [membersOrganizers, setMembersOrganizers] = useState(
    initialMembersOrganizers
  );

  // Initialize memberCheckboxes with all checkboxes initially checked
  const [memberCheckboxes, setMemberCheckboxes] = useState(
    Array(initialMembersOrganizers.length).fill(true)
  );

  const handleCrossIcon = () => {
    dispatch(sendRecentNotificationOrganizerModal(false));
  };

  const HandleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Message") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setNotifyOrganizerData({
          ...notifyOrganizerData,
          Messege: valueCheck,
        });
      } else {
        setNotifyOrganizerData({
          ...notifyOrganizerData,
          Messege: "",
        });
      }
    }
  };

  const handleCheckboxChange = (index, isChecked, data) => {
    const updatedCheckboxes = [...memberCheckboxes];
    updatedCheckboxes[index] = isChecked;

    const updatedMembers = [...membersOrganizers];
    updatedMembers[index] = { ...data, isOrganizerNotified: true };

    setMemberCheckboxes(updatedCheckboxes);
    setMembersOrganizers(updatedMembers);
  };

  const sendNotification = () => {
    let Data = {
      UserID: MeetingOrganizersReducer.NotificationSendData[0].userID,
      Message: notifyOrganizerData.Messege,
      IsAgendaContributor: false,
      MeetingID: Number(currentMeeting),
    };
    dispatch(sendNotificationOrganizer(Data, navigate, t));
    dispatch(notificationUpdateData(membersOrganizers));
    dispatch(sendRecentNotificationOrganizerModal(false));
  };

  const handleCancelButton = () => {
    dispatch(sendRecentNotificationOrganizerModal(false));
  };

  return (
    <section>
      <Modal
        show={NewMeetingreducer.sendNotificationOrganizerModal}
        setShow={dispatch(sendRecentNotificationOrganizerModal)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(sendRecentNotificationOrganizerModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col lg={5} md={5} sm={12}>
                <span className={styles["Notify_organisors"]}>
                  {t("Notify-organizers")}
                </span>
              </Col>
              <Col lg={7} md={7} sm={12} className="d-flex justify-content-end">
                <img
                  draggable={false}
                  src={BlackCrossIcon}
                  className="cursor-pointer"
                  alt=""
                  width="16px"
                  height="16px"
                  onClick={handleCrossIcon}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <TextField
                  applyClass="text-area-create-Notify-organizors"
                  type="text"
                  as={"textarea"}
                  rows="4"
                  placeholder={t("Message-for-organizer")}
                  change={HandleChange}
                  value={notifyOrganizerData.Messege}
                  required={true}
                  name="Message"
                  maxLength={500}
                />
              </Col>
            </Row>

            {membersHide ? null : (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_notify"]}
                  >
                    <Row className="mt-3">
                      {membersOrganizers.map((data, index) => (
                        <Col lg={6} md={6} sm={12} className="mt-2" key={index}>
                          <Row className="m-0 p-0">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={styles["Box_for_Assignee"]}
                            >
                              <Row>
                                <Col
                                  lg={10}
                                  md={10}
                                  sm={12}
                                  className="d-flex gap-2 align-items-center"
                                >
                                  <img
                                    draggable={false}
                                    alt=""
                                    src={`data:image/jpeg;base64,${data.userProfilePicture.displayProfilePictureName}`}
                                    width="33px"
                                    height="33px"
                                    className={styles["ProfilePic"]}
                                  />
                                  <span>{data.userName}</span>
                                </Col>
                                <Col lg={2} md={2} sm={12}>
                                  <Checkbox
                                    checked={memberCheckboxes[index]}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        index,
                                        e.target.checked,
                                        data
                                      )
                                    }
                                    disabled={true}
                                    className="sendNotificationOrganizer"
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </>
            )}
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Cancel")}
                  className={styles["Cancel_button_Notify"]}
                  onClick={handleCancelButton}
                />
                <Button
                  text={t("Send")}
                  onClick={sendNotification}
                  className={styles["Send_Notify"]}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default SendNotificationOrganizer;
