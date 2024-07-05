import React, { useEffect, useState } from "react";
import styles from "./BoardDeckSendEmail.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import CrossEmail from "./../../pages/meeting/viewMeetings/AgendaViewer/AV-Images/Cross-Email.png";
import { Col, Container, Row } from "react-bootstrap";
import {
  Button,
  Modal,
  TextField,
  Notification,
} from "../../../components/elements";
import { boardDeckEmailModal } from "../../../store/actions/NewMeetingActions";
import crossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { validateInput } from "../../../commen/functions/regex";
import blueCrossIcon from "../../../assets/images/BlueCross.png";
import { Checkbox } from "antd";
import { BoardDeckSendEmailApi } from "../../../store/actions/UserManagementActions";
import { GetAllCommitteesUsersandGroups } from "../../../store/actions/MeetingOrganizers_action";
const BoardDeckSendEmail = ({
  boardDeckMeetingID,
  boarddeckOptions,
  radioValue,
}) => {
  console.log(radioValue, "radioValueradioValue");
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const animatedComponents = makeAnimated();

  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state
  );

  const [selectedsearch, setSelectedsearch] = useState([]);
  const [dropdowndata, setDropdowndata] = useState([]);
  const [tags, setTags] = useState([]);

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [notificationMessage, setNotificationMessage] = useState("");
  console.log(notificationMessage, "notificationMessage");
  const [notifyPeople, setNotifyPeople] = useState({
    notifyPeople: false,
  });

  //For All Organizational Users

  useEffect(() => {
    let Data = {
      MeetingID: Number(boardDeckMeetingID),
    };
    dispatch(GetAllCommitteesUsersandGroups(Data, navigate, t));
  }, []);

  // for selection of data
  const handleSelectValue = (value) => {
    console.log(value, "handleSelectValue");
    setSelectedsearch(value);
  };

  console.log(tags, "tagstags");

  //Default options react select
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  //handle Change For TextArea
  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Message") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setNotificationMessage(valueCheck);
      } else {
        setNotificationMessage("");
      }
    }
  };

  const onChangenotifyPeople = (e) => {
    let value = e.target.checked;
    setNotifyPeople({
      ...notifyPeople,
      notifyPeople: value,
    });
  };

  const customFilter = (option, searchText) => {
    if (searchText) {
      return option.label.toLowerCase().includes(searchText.toLowerCase());
    }
    return true;
  };

  const handleAddTag = () => {
    if (selectedsearch && selectedsearch.length > 0) {
      const newTags = selectedsearch.map((tag) =>
        typeof tag === "string" ? { value: tag, label: tag } : tag
      );
      setTags((prevTags) => [...prevTags, ...newTags]);
      setSelectedsearch([]);
    }
  };

  const removeTag = (indexToRemove) => {
    setTags((prevTags) =>
      prevTags.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSendEmailButton = () => {
    let organizationalUsers = selectedsearch.map((item) => item.value);

    let mergedUserEmails = organizationalUsers.concat(tags);

    console.log(mergedUserEmails, "mergedUserEmailsmergedUserEmails");

    if (mergedUserEmails.length !== 0) {
      let data = {
        ListOfEmailAddresses: mergedUserEmails,
        Messege: notificationMessage,
        BoarddeckFileParams: {
          PK_MDID: Number(boardDeckMeetingID),
          fetchOrganizers: boarddeckOptions.Organizer,
          fetchAgendaContributors: boarddeckOptions.AgendaContributor,
          fetchParticipants: boarddeckOptions.Participants,
          fetchMinutes: boarddeckOptions.Minutes,
          fetchTasks: boarddeckOptions.Task,
          fetchPolls: boarddeckOptions.polls,
          fetchAttendance: boarddeckOptions.attendeceReport,
          fetchVideo: boarddeckOptions.video,
          fetchAgenda: boarddeckOptions.Agenda,
          fetchAgendaWithAttachments: boarddeckOptions.Agenda,
          fetchAdvanceMeetingDetails: true,
        },
      };

      dispatch(BoardDeckSendEmailApi(navigate, t, data));
    } else {
      setTimeout(
        setOpen({
          open: true,
          message: t("Atleast-add-one-user"),
        }),
        3000
      );
    }
  };

  //Newly Component

  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const value = e.target.value.trim();

    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      setTimeout(
        setOpen({
          open: true,
          message: t("Invalid-email-format"),
        }),
        3000
      );
      return;
    }

    setTags([...tags, value]);
    e.target.value = "";
  }

  //Organizational Users
  useEffect(() => {
    let newOrganizersData =
      MeetingOrganizersReducer.AllUserCommitteesGroupsData;
    if (newOrganizersData !== null && newOrganizersData !== undefined) {
      let temp = [];
      if (Object.keys(newOrganizersData).length > 0) {
        if (Object.keys(newOrganizersData.organizationUsers).length > 0) {
          console.log(
            newOrganizersData.organizationUsers,
            "organizationUsersorganizationUsersorganizationUsers"
          );
          newOrganizersData.organizationUsers.map((a, index) => {
            let newData = {
              value: a.emailAddress,
              name: a.userName,
              label: (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      <img
                        src={`data:image/jpeg;base64,${a?.profilePicture?.displayProfilePictureName}`}
                        // src={}
                        alt=""
                        className={styles["UserProfilepic"]}
                        width="18px"
                        height="18px"
                        draggable="false"
                      />
                      <span className={styles["NameDropDown"]}>
                        {a.userName}
                      </span>
                    </Col>
                  </Row>
                </>
              ),
              type: 3,
            };
            temp.push(newData);
          });
        }
        setDropdowndata(temp);
      } else {
        setDropdowndata([]);
      }
    }
  }, [MeetingOrganizersReducer.AllUserCommitteesGroupsData]);

  return (
    <Container>
      <Modal
        show={NewMeetingreducer.boardDeckEmailModal}
        setShow={dispatch(boardDeckEmailModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(boardDeckEmailModal(false));
        }}
        size={"md"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className="position-relative">
                <p className={styles["FileModalTitle"]}>{t("Board-deck-IT")}</p>
                <img className={styles["image-close"]} src={crossIcon} alt="" />
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            {radioValue === 1 ? (
              <>
                <Row className="m-0">
                  <Col className="p-0">
                    <p className={`${styles["organizationUsers"]} m-0`}>
                      {t("Select-organization-users")}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Select
                      onChange={handleSelectValue}
                      value={selectedsearch}
                      classNamePrefix={"selectMemberAgendaView"}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isMulti
                      options={dropdowndata}
                      isSearchable={true}
                      filterOption={customFilter}
                    />
                  </Col>
                </Row>
              </>
            ) : null}

            {radioValue === 2 ? (
              <>
                <Row className="m-0">
                  <Col className="p-0">
                    <p className={`${styles["NonOrganizationUsers"]} m-0`}>
                      {t("Select-non-organization-users")}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div
                      className={
                        tags.length <= 4
                          ? styles["tags-input-container"]
                          : styles["tags-input-containerr"]
                      }
                    >
                      {tags.map((tag, index) => (
                        <div className={styles["tag-item"]} key={index}>
                          <span className={styles["text"]}>{tag}</span>
                          <span
                            className={styles["close"]}
                            onClick={() => removeTag(index)}
                          >
                            <img src={CrossEmail} alt="" />
                          </span>
                        </div>
                      ))}
                      <input
                        onKeyDown={handleKeyDown}
                        type="text"
                        className={styles["tags-input"]}
                      />
                    </div>
                  </Col>
                </Row>
              </>
            ) : null}

            <Row className="m-0">
              <Col className="p-0">
                <p className={`${styles["NonOrganizationUsers"]} m-0`}>
                  {t("Message-optional")}
                </p>
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["text-area-organizer"]}
              >
                <TextField
                  applyClass="text-area-create-Notify-organizors"
                  type="text"
                  as={"textarea"}
                  rows="4"
                  placeholder={t("Message")}
                  change={HandleChange}
                  value={notificationMessage}
                  required={true}
                  name="Message"
                  maxLength={500}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <Checkbox
                  onChange={onChangenotifyPeople}
                  checked={notifyPeople.notifyPeople}
                >
                  <span className={styles["Class_CheckBox_notify_people"]}>
                    {t("Notify-people")}
                  </span>
                </Checkbox>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end"
              >
                <Button
                  text={t("Send")}
                  className={styles["Send_Notify"]}
                  onClick={handleSendEmailButton}
                />
              </Col>
            </Row>
          </>
        }
      />
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </Container>
  );
};

export default BoardDeckSendEmail;
