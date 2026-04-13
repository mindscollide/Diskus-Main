import React, { useState, useEffect } from "react";
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
import { meetingOrganizers } from "../../../../../../store/actions/MeetingOrganizers_action";
import { showNotifyOrganizors } from "../../../../../../store/actions/NewMeetingActions";
import UpperArrow from "../../../../../../assets/images/UpperArrow.svg";
import { Col, Row } from "react-bootstrap";
import { validateInput } from "../../../../../../commen/functions/regex";
import downdirect from "../../../../../../assets/images/downDirect.png";

const NotifyOrganizers = ({
  setNotificationMessage,
  notificationMessage,
  setIsEdit,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state
  );
  const [notifyOrganizerData, setNotifyOrganizerData] = useState({
    Messege: "",
    allOrganizersAccept: false,
  });

  const [membersHide, setMembersHide] = useState(false);
  const [allOrganizersAccept, setAllOrganizersAccept] = useState(true);

  // Initialize membersOrganizers state with the modified 'isOrganizerNotified' property
  const initialMembersOrganizers =
    MeetingOrganizersReducer.MeetingOrganizersData.map((member) => ({
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
    dispatch(showNotifyOrganizors(false));
  };

  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Message") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setNotificationMessage(valueCheck);
        setNotifyOrganizerData({
          ...notifyOrganizerData,
          Messege: valueCheck,
        });
      } else {
        setNotificationMessage("");
        setNotifyOrganizerData({
          ...notifyOrganizerData,
          Messege: "",
        });
      }
    }
  };

  const handleAllowOrganizerCheck = () => {
    const newState = !allOrganizersAccept;
    setAllOrganizersAccept(newState);
    const updatedCheckboxes = membersOrganizers.map(() => newState);
    const updatedMembers = membersOrganizers.map((member) => ({
      ...member,
      isOrganizerNotified: newState,
    }));
    setMemberCheckboxes(updatedCheckboxes);
    setMembersOrganizers(updatedMembers);
  };

  const handleHideItems = () => {
    setMembersHide(!membersHide);
  };

  const handleCheckboxChange = (index, isChecked, data) => {
    const updatedCheckboxes = [...memberCheckboxes];
    updatedCheckboxes[index] = isChecked;

    const updatedMembers = [...membersOrganizers];
    updatedMembers[index] = { ...data, isOrganizerNotified: isChecked };

    const areAllChecked = updatedCheckboxes.every((checkbox) => checkbox);
    const areAnyUnchecked = updatedCheckboxes.some((checkbox) => !checkbox);

    // If any single checkbox is unchecked, uncheck the checkbox outside the mapping
    if (areAnyUnchecked) {
      setAllOrganizersAccept(false);
    } else if (areAllChecked) {
      // If all checkboxes are checked, check the checkbox outside the mapping
      setAllOrganizersAccept(true);
    }

    setMemberCheckboxes(updatedCheckboxes);
    setMembersOrganizers(updatedMembers);
  };

  const sendNotification = () => {
    setIsEdit(true);
    dispatch(showNotifyOrganizors(false));
    const updatedMembersOrganizers = membersOrganizers.map((member) => ({
      ...member,
      NotificationMessage: notifyOrganizerData.Messege,
    }));
    console.log(updatedMembersOrganizers, "updatedMembersOrganizers");
    dispatch(meetingOrganizers(updatedMembersOrganizers));
  };

  const handleCancelButton = () => {
    setIsEdit(true);
    dispatch(showNotifyOrganizors(false));
    dispatch(meetingOrganizers([]));
    setNotificationMessage("");
  };

  useEffect(() => {
    if (
      MeetingOrganizersReducer.MeetingOrganizersData !== undefined &&
      MeetingOrganizersReducer.MeetingOrganizersData !== null &&
      MeetingOrganizersReducer.MeetingOrganizersData.length !== 0
    ) {
      // Map over the data and set isOrganizerNotified to true for all objects
      const modifiedData = MeetingOrganizersReducer.MeetingOrganizersData.map(
        (member) => ({
          ...member,
          isOrganizerNotified: true,
        })
      );

      setMembersOrganizers(modifiedData);
    }
  }, [MeetingOrganizersReducer.MeetingOrganizersData]);

  return (
    <section>
      <Modal
        show={NewMeetingreducer.notifyOrganizors}
        setShow={dispatch(showNotifyOrganizors)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showNotifyOrganizors(false));
          setIsEdit(true);
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
                  value={notificationMessage}
                  required={true}
                  name="Message"
                  maxLength={500}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col
                lg={6}
                md={6}
                sm={12}
                className="d-flex align-items-center gap-2"
              >
                <Checkbox
                  checked={allOrganizersAccept}
                  onChange={handleAllowOrganizerCheck}
                />
                <p className={styles["Check_box_title"]}>
                  {t("All-organizers")}
                </p>
              </Col>
              <Col
                lg={6}
                md={6}
                sm={12}
                className="d-flex justify-content-end align-items-center cursor-pointer"
              >
                <img
                  draggable={false}
                  src={membersHide ? downdirect : UpperArrow}
                  width="18.4px"
                  height="9.2px"
                  alt=""
                  className={styles["UparrowClasss"]}
                  onClick={handleHideItems}
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
                    <Row>
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
                                    src={`data:image/jpeg;base64,${data.displayPicture}`}
                                    width="33px"
                                    alt=""
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

export default NotifyOrganizers;
