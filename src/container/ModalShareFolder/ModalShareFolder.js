import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalShareFolder.module.css";
import newprofile from "../../assets/images/Mask Group 67.svg";
import crossIcon from "../../assets/images/CrossIcon.svg";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import {
  Button,
  InputSearchFilter,
  Checkbox,
  SelectBox,
  Modal,
  TextField,
} from "../../components/elements";
import { style } from "@mui/system";
import ParticipantInfoShareFolder from "../../components/elements/ParticipantInfoShareFolder/ParticipantInfoShareFolder";

const ModalShareFolder = ({ ModalTitle, sharefolder, setSharefolder }) => {
  const [showaccessrequest, setShowaccessrequest] = useState(false);
  const [showrequestsend, setShowrequestsend] = useState(false);
  const [generalaccessdropdown, setGeneralaccessdropdown] = useState(false);
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
          centered
          size={sharefolder === true ? "md" : "md"}
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
