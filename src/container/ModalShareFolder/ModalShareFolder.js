import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalShareFolder.module.css";
import newprofile from "../../assets/images/Mask Group 67.svg";
import clock from "../../assets/images/Icon metro-alarm.svg";
import DeleteiCon from "../../assets/images/Icon material-delete.svg";
import crossIcon from "../../assets/images/CrossIcon.svg";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import download from "../../assets/images/Icon feather-download.svg";
import star from "../../assets/images/startd.png";
import pdf from "../../assets/images/222.svg";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  MultiDatePicker,
  Modal,
  TextField,
} from "../../components/elements";
import { style } from "@mui/system";
import ParticipantInfoShareFolder from "../../components/elements/ParticipantInfoShareFolder/ParticipantInfoShareFolder";
import { useEffect } from "react";
import EditIconNote from "../../assets/images/EditIconNotes.svg";

const ModalShareFolder = ({ ModalTitle, sharefolder, setSharefolder }) => {
  const [showaccessrequest, setShowaccessrequest] = useState(false);
  const [showrequestsend, setShowrequestsend] = useState(false);
  const [generalaccessdropdown, setGeneralaccessdropdown] = useState(false);
  const [linkedcopied, setLinkedcopied] = useState(false);
  const [expirationheader, setExpirationheader] = useState(false);
  const [calenderdate, setCalenderdate] = useState(false);
  const [inviteedit, setInviteedit] = useState(false);
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [meetingDate, setMeetingDate] = useState("");
  const [EditNotification, setEditNotification] = useState(false);
  const [accessupdate, setAccessupdate] = useState(false);

  const showcalender = () => {
    // setCalenderdate(!calenderdate);
    setInviteedit(!inviteedit);
    setExpirationheader(false);
  };
  useEffect(() => {
    if (linkedcopied === true) {
      setTimeout(() => {
        setLinkedcopied(false);
      }, 2000);
    }
  }, []);

  const handlechange = (SelectedOptions) => {
    console.log("handlechangehandlechange", SelectedOptions);
    if (SelectedOptions.value === "Add Expiration") {
      console.log("yes add expiration selected ");
      setExpirationheader(true);
      setEditNotification(false);
      setAccessupdate(false);
    } else if (SelectedOptions.value === "Viewer") {
      setExpirationheader(false);
      setEditNotification(false);
      setAccessupdate(true);
    } else if (SelectedOptions.value === "Editor") {
      setExpirationheader(false);
      setEditNotification(true);
      setAccessupdate(false);
    }
  };
  const NotificationForlinkCopied = () => {
    setLinkedcopied(true);
  };
  const options = [
    { value: "Viewer", label: "Viewer" },
    { value: "Editor", label: "Editor" },
    { value: "Add Expiration", label: "Add Expiration" },
  ];
  const optionsgeneralAccess = [
    { value: "Restricted", label: "Restricted" },
    { value: "My Organization", label: "My Organization" },
    { value: "Any One With link", label: "Any One With link" },
  ];

  const Notificationnaccessrequest = () => {
    console.log("hnbhaiclicktuhorahahy");
    setShowrequestsend(true);
  };
  const openAccessRequestModalClick = () => {
    setShowaccessrequest(true);
  };

  const { t } = useTranslation();
  const closebtn = async () => {
    setSharefolder(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={sharefolder}
          onHide={() => {
            setSharefolder(false);
          }}
          setShow={setSharefolder}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          modalTitleClassName={styles["ModalHeader"]}
          modalHeaderClassName={styles["ModalRequestHeader"]}
          centered
          size={sharefolder === true ? "md" : "md"}
          ModalTitle={
            <>
              {expirationheader ? (
                <>
                  {calenderdate ? (
                    <>
                      <MultiDatePicker
                        // onChange={meetingDateHandler}
                        name="MeetingDate"
                        value={meetingDate}
                        calendar={calendarValue}
                        locale={localValue}
                        // newValue={createMeeting.MeetingDate}
                      />
                    </>
                  ) : null}
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["Expiration_header_background"]}
                    >
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-center gap-3"
                        >
                          <img src={clock} height="14.66px" width="14.97px" />
                          <span
                            className={styles["Text_for_header_expiration"]}
                          >
                            Access Expires on Apr 20 11:11PM
                          </span>
                          <Row className={styles["margin"]}>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex gap-2"
                            >
                              <img
                                src={EditIconNote}
                                height="11.11px"
                                width="11.54px"
                                onClick={showcalender}
                              />
                              <img
                                src={DeleteiCon}
                                width="9.47px"
                                height="11.75px"
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          }
          ModalBody={
            <>
              {showaccessrequest ? (
                showrequestsend ? (
                  <>
                    <Container>
                      {generalaccessdropdown}
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Request_send_heading"]}>
                            Request Send
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col md={12} sm={12} lg={12}>
                          <span className={styles["description_request_send"]}>
                            You will get an email letting you know if file is
                            shared with you
                          </span>
                        </Col>
                      </Row>
                    </Container>
                  </>
                ) : (
                  <>
                    <Container>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={styles["Access_request_modal_heading"]}
                          >
                            You need Acccess
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={styles["Sub_line_access_request_modal"]}
                          >
                            Ask for access or switch account with access
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="CreateMeetingInput "
                        >
                          <TextField
                            applyClass="text-area-create-group"
                            type="text"
                            as={"textarea"}
                            rows="11"
                            placeholder={t("Messege(optional)")}
                            required={true}
                          />
                        </Col>
                      </Row>
                    </Container>
                  </>
                )
              ) : inviteedit ? (
                <>
                  <Container>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Shared_Document_Heading"]}>
                          Saad Fudda shared a document
                        </span>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                        <img src={newprofile} height="40px" width="41px" />
                        <Row className="mt-1">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={styles["Line-height"]}
                          >
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span
                                  className={styles["InvitetoEdit_Heading"]}
                                >
                                  Saad Fudda (Saad@gmail.com) has invited you to
                                  <span className={styles["Edit_options"]}>
                                    Edit
                                  </span>
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span
                                  className={styles["InvitetoEdit_Heading"]}
                                >
                                  the following document Until 27 Apr 2023,
                                  11:59 GMT
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Box_for_attachments"]}
                      >
                        <Row className="mt-2">
                          <Col lg={12} md={12} sm={12}>
                            <Row>
                              <Col
                                lg={10}
                                md={10}
                                sm={10}
                                className="d-flex justify-content-start gap-2 "
                              >
                                <img src={pdf} height="16px" width="14.23px" />
                                <span className={styles["File_name"]}>
                                  Merger proposal for ABC Industries.pdf
                                </span>
                              </Col>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                className="d-flex justify-content-end gap-2 mt-1"
                              >
                                <img
                                  src={download}
                                  height="11px"
                                  width="12.15px"
                                />
                                <img
                                  src={star}
                                  height="10.22px"
                                  width="12.07px"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Container>
                </>
              ) : (
                <>
                  <Container>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Share_folder_modal_Heading"]}>
                          Share <span>"folder 1"</span>
                        </span>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col lg={5} md={5} sm={5}>
                        <TextField
                          placeholder={t("Enter name or email")}
                          labelClass="textFieldSearch d-none"
                        />
                      </Col>
                      <Col lg={3} md={3} sm={3}>
                        <Select
                          options={options}
                          placeholder="Editor"
                          className={styles["Editor_select"]}
                          onChange={handlechange}
                        />
                      </Col>
                      <Col lg={4} md={4} sm={4}>
                        <Select
                          options={optionsgeneralAccess}
                          placeholder="General Access"
                          className={styles["Editor_select"]}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Scroller_particiapnt_shared_folder"]}
                      >
                        <Row>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              //   icon={
                              //     <img src={crossIcon} height="14px" width="14px" />
                              //   }
                            />
                          </Col>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                          <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="CreateMeetingInput "
                      >
                        <TextField
                          applyClass="text-area-create-group"
                          type="text"
                          as={"textarea"}
                          rows="4"
                          placeholder={t("Messege")}
                          required={true}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col lg={12} md={12} sm={12} className="d-flex gap-3">
                        <Checkbox />
                        <span className={styles["Notify_people_styles"]}>
                          Notify People
                        </span>
                      </Col>
                    </Row>
                  </Container>
                </>
              )}
            </>
          }
          ModalFooter={
            <>
              {showaccessrequest ? (
                showrequestsend ? null : (
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-end"
                      >
                        <Button
                          text="Request Access"
                          className={styles["Request_Access_btn"]}
                          onClick={Notificationnaccessrequest}
                        />
                      </Col>
                    </Row>
                  </>
                )
              ) : inviteedit ? (
                <>
                  <Row>
                    <Col
                      lg={11}
                      md={11}
                      sm={11}
                      className="d-flex justify-content-end"
                    >
                      <Button text="Open" className={styles["Open_button"]} />
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      className="d-flex justify-content-start"
                    >
                      <Button
                        text="Copy Link"
                        className={styles["Copy_Link_btn"]}
                        onClick={NotificationForlinkCopied}
                      />
                    </Col>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        text="Send"
                        className={styles["send_btn"]}
                        onClick={openAccessRequestModalClick}
                      />
                    </Col>
                  </Row>
                  {linkedcopied ? (
                    <>
                      <Row>
                        <Col
                          lg={12}
                          sm={12}
                          md={12}
                          className={styles["Background_notification"]}
                        >
                          <Row className="mt-2">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center"
                            >
                              <span className={styles["Link_copied"]}>
                                Link Copied
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </>
                  ) : null}
                  {EditNotification ? (
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["Back_ground_editNotification"]}
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center mt-2"
                            >
                              <span className={styles["Edit_notification"]}>
                                You don't have permission to edit "Folder 1"
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </>
                  ) : null}
                  {accessupdate ? (
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["Back_ground_accessupdate"]}
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center mt-2"
                            >
                              <span className={styles["Access_updated"]}>
                                Access Updated
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </>
                  ) : null}
                </>
              )}
            </>
          }
        />
      </Container>
    </>
  );
};

export default ModalShareFolder;
