import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Notification,
  TextField,
} from "../../../../../../components/elements";
import { validateInput } from "../../../../../../commen/functions/regex";
import { useTranslation } from "react-i18next";
import styles from "./ShareEmailModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import CrossIcon from "./../AV-Images/Cross_Icon.png";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { GetAllCommitteesUsersandGroups } from "../../../../../../store/actions/MeetingOrganizers_action";
import {
  SendAgendaPDFAsEmail,
  clearResponseMessage,
} from "../../../../../../store/actions/MeetingAgenda_action";
import CrossEmail from "./../AV-Images/Cross-Email.png";
import { showMessage } from "../../../../../../components/elements/snack_bar/utill";

const ShareEmailModal = ({ setShareEmailView }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();

  let currentMeeting = Number(localStorage.getItem("currentMeetingID"));

  let meetingTitle = localStorage.getItem("meetingTitle");

  const { MeetingOrganizersReducer, MeetingAgendaReducer } = useSelector(
    (state) => state
  );

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [notificationMessage, setNotificationMessage] = useState("");

  const [selectedsearch, setSelectedsearch] = useState([]);

  const [dropdowndata, setDropdowndata] = useState([]);

  // for selection of data
  const handleSelectValue = (value) => {
    setSelectedsearch(value);
  };

  useEffect(() => {
    let Data = {
      MeetingID: currentMeeting,
    };
    dispatch(GetAllCommitteesUsersandGroups(Data, navigate, t));
  }, []);

  const customFilter = (options, searchText) => {
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    let newOrganizersData =
      MeetingOrganizersReducer.AllUserCommitteesGroupsData;
    if (newOrganizersData !== null && newOrganizersData !== undefined) {
      let temp = [];
      if (Object.keys(newOrganizersData).length > 0) {
        if (Object.keys(newOrganizersData.organizationUsers).length > 0) {
          newOrganizersData.organizationUsers.map((a) => {
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

  const [tags, setTags] = useState([]);

  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const value = e.target.value.trim();

    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      showMessage(t("Invalid-email-format"), "error", setOpen);
      return;
    }

    setTags([...tags, value]);
    e.target.value = "";
  }

  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index));
  }

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

  const sendEmail = () => {
    let organizationalUsers = selectedsearch.map((item) => item.value);

    let mergedUserEmails = organizationalUsers.concat(tags);

    if (mergedUserEmails.length !== 0) {
      let Data = {
        PK_MDID: currentMeeting,
        ListOfEmailAddresses: mergedUserEmails,
        MeetingTitle: meetingTitle,
        IsSubAgendaNeeded: true,
        EmailMessage: notificationMessage,
      };

      dispatch(SendAgendaPDFAsEmail(Data, navigate, t, setShareEmailView));
    } else {
      showMessage(t("Atleast-add-one-user"), "error", setOpen);
    }
  };

  useEffect(() => {
    if (MeetingAgendaReducer.ResponseMessage === t("Invalid-data")) {
      showMessage(t("Invalid-data"), "error", setOpen);
      dispatch(clearResponseMessage(""));
    }
  }, [MeetingAgendaReducer.ResponseMessage]);

  

  return (
    <section>
      <Modal
        show={true}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          setShareEmailView(false);
        }}
        size="md"
        className="ShareEmailAgendaModal"
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className="position-relative">
                <p className={styles["FileModalTitle"]}>{t("Share-email")}</p>
                <img
                  onClick={() => setShareEmailView(false)}
                  className={styles["image-close"]}
                  src={CrossIcon}
                  alt=""
                />
              </Col>
            </Row>
          </>
        }
        ModalBody={
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
                  isDisabled={
                    MeetingOrganizersReducer.AllUserCommitteesGroupsData
                      .length === 0
                      ? true
                      : false
                  }
                  value={selectedsearch}
                  classNamePrefix={"selectMemberAgendaView"}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  placeholder={`${t("Select")}...`}
                  options={dropdowndata}
                  isSearchable={true}
                  filterOption={customFilter}
                />
              </Col>
            </Row>
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
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2 p-0"
              >
                <Button
                  text={t("Send")}
                  onClick={sendEmail}
                  className={styles["Send_Notify"]}
                />
              </Col>
            </Row>
          </>
        }
      />

      <Notification open={open} setOpen={setOpen} />
    </section>
  );
};

export default ShareEmailModal;
