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
import {
  boardDeckEmailModal,
  boardDeckShareModal,
} from "../../../store/actions/NewMeetingActions";
import crossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { validateInput } from "../../../commen/functions/regex";
import { Checkbox } from "antd";
import { BoardDeckSendEmailApi } from "../../../store/actions/UserManagementActions";
import { GetAllCommitteesUsersandGroups } from "../../../store/actions/MeetingOrganizers_action";
import { showMessage } from "../../../components/elements/snack_bar/utill";
const BoardDeckSendEmail = ({
  boardDeckMeetingID,
  boarddeckOptions,
  radioValue,
  setBoarddeckOptions,
  editorRole,
  boardDeckMeetingTitle,
}) => {
  console.log(boardDeckMeetingID, "radioValueradioValue");
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const animatedComponents = makeAnimated();

  const OrganizationID = localStorage.getItem("organizationID");

  const boardDeckEmailModal = useSelector(
    (state) => state.NewMeetingreducer.boardDeckEmailModal
  );
  const AllUserCommitteesGroupsData = useSelector(
    (state) => state.MeetingOrganizersReducer.AllUserCommitteesGroupsData
  );
  const [selectedsearch, setSelectedsearch] = useState([]);
  const [dropdowndata, setDropdowndata] = useState([]);
  const [tags, setTags] = useState([]);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notifyPeople, setNotifyPeople] = useState({
    notifyPeople: false,
  });

  //For All Organizational Users
  useEffect(() => {
    let Data = {
      OrganizationID: Number(OrganizationID),
    };
    dispatch(GetAllCommitteesUsersandGroups(Data, navigate, t));
  }, []);

  // for selection of data
  const handleSelectValue = (value) => {
    console.log(value, "handleSelectValue");
    setSelectedsearch(value);
  };

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

  //Onchange Notify People
  const onChangenotifyPeople = (e) => {
    let value = e.target.checked;
    setNotifyPeople({
      ...notifyPeople,
      notifyPeople: value,
    });
  };

  const customFilter = (options, searchText) => {
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  //Handling removing Email Tags
  const removeTag = (indexToRemove) => {
    setTags((prevTags) =>
      prevTags.filter((_, index) => index !== indexToRemove)
    );
  };

  //handle Black Cross Icon of Main Modal
  const handleBlackCrossIcon = () => {
    dispatch(boardDeckEmailModal(false));
    dispatch(boardDeckShareModal(true));
  };

  //Sending Email Function
  const handleSendEmailButton = () => {
    let organizationalUsers = selectedsearch.map((item) => item.value);

    let mergedUserEmails = organizationalUsers.concat(tags);

    if (mergedUserEmails.length !== 0) {
      let data = {
        ListOfEmailAddresses: mergedUserEmails,
        Messege: notificationMessage,
        isNotify: notifyPeople.notifyPeople,
        BoarddeckFileParams: {
          PK_MDID: boardDeckMeetingID,
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
      console.log(data, "datadatadatadatadata");
      dispatch(BoardDeckSendEmailApi(navigate, t, data, setBoarddeckOptions));
    } else {
      showMessage(t("Atleast-add-one-user"), "error", setOpen);
    }
  };

  //Enter Email Functionality non Organizational Users
  const handleInputChange = (e) => {
    const value = e.target.value.trim();

    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value.endsWith(".com")) {
      if (!emailRegex.test(value)) {
        showMessage(t("Invalid-email-format"), "error", setOpen);
        return;
      }
      setTags([...tags, value]);
      e.target.value = "";
    }
  };
  useEffect(() => {
    let newOrganizersData = AllUserCommitteesGroupsData;
    if (newOrganizersData !== null && newOrganizersData !== undefined) {
      let temp = [];
      if (Object.keys(newOrganizersData).length > 0) {
        if (Object.keys(newOrganizersData.organizationUsers).length > 0) {
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
  }, [AllUserCommitteesGroupsData]);

  return (
    <Container>
      <Modal
        show={boardDeckEmailModal}
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
                <p className={styles["FileModalTitle"]}>
                  {t("Board-deck")} - {boardDeckMeetingTitle}
                </p>
                <i
                  className={styles["image-close"]}
                  src={crossIcon}
                  alt=""
                  onClick={handleBlackCrossIcon}
                />
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
                        onChange={handleInputChange}
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
            {radioValue === 1 ? (
              <>
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
            ) : null}
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
      <Notification open={open} setOpen={setOpen} />
    </Container>
  );
};

export default BoardDeckSendEmail;
