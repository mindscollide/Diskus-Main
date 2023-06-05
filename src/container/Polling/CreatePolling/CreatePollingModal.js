import React from "react";
import {
  Checkbox,
  InputSearchFilter,
  Modal,
} from "../../../components/elements";
import styles from "./CreatePolling.module.css";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import AlarmClock from "../../../assets/images/AlarmOptions.svg";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import { Button, TextField } from "../../../components/elements";
import plusFaddes from "../../../assets/images/PlusFadded.svg";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import profile from "../../../assets/images/profile_polls.svg";
import whitePlus from "../../../assets/images/Whiteplus.svg";
import { useState } from "react";

const CreatePolling = ({ showPollingModal, setShowPollingModal }) => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Saad Fudda",
    },
    {
      id: 2,
      name: "Salman Memon",
    },
    {
      id: 3,
      name: "Talha Qamar",
    },
    {
      id: 4,
      name: "Saif Rehman",
    },
  ]);
  const [optionsFields, setOptionsFields] = useState([1]);
  const addNewRow = () => {
    let optionsLenth = optionsFields.length + 1;
    setOptionsFields([...optionsFields, optionsLenth]);
  };

  const HandleCancelFunction = (index) => {
    optionsFields.splice(index, 1);
    setOptionsFields([...optionsFields]);
  };
  console.log(optionsFields, "optionsFieldsoptionsFields");
  return (
    <>
      <Container>
        <Modal
          show={showPollingModal}
          setShow={setShowPollingModal}
          modalTitleClassName={styles["ModalHeader_create_poll"]}
          modalHeaderClassName={styles["ModalRequestHeader_polling"]}
          onHide={() => {
            setShowPollingModal(false);
          }}
          ModalTitle={
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={styles["Back_Ground_strip_Create_Poll_modal"]}
                >
                  <Row className="mt-2">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center gap-2 align-items-center"
                    >
                      <img src={AlarmClock} width="14.97px" height="14.66px" />
                      <span className={styles["Due_Date_heading"]}>
                        {t("Due-date")}
                      </span>
                      <img src={EditIcon} width="11.54px" height="11.11px" />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          }
          ModalFooter={""}
          ModalBody={
            <>
              <Row className="d-flex">
                <Col lg={11} md={11} sm={12}>
                  <span className={styles["Create_Poll_Heading"]}>
                    {t("Create-new-poll")}
                  </span>
                </Col>

                <Col lg={1} ms={1} sm={12}>
                  <img
                    src={BlackCrossIcon}
                    className={styles["Cross_Icon_Styling_Create_Poll_Modal"]}
                    width="16px"
                    height="16px"
                  />
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={styles["Scroller_For_CreatePollModal"]}
                >
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        placeholder={t("Typing-tile")}
                        applyClass={"PollingCreateModal"}
                        labelClass="d-none"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        placeholder={t("Option-1")}
                        applyClass={"PollingCreateModal"}
                        labelClass="d-none"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        placeholder={t("Option-2")}
                        applyClass={"PollingCreateModal"}
                        labelClass="d-none"
                      />
                    </Col>
                  </Row>
                  {optionsFields.length > 0
                    ? optionsFields.map((data, index) => {
                        return (
                          <>
                            <Row className="mt-2">
                              <Col lg={12} md={12} sm={12}>
                                <span className="position-relative">
                                  <TextField
                                    placeholder={`Options ${index + 3}`}
                                    applyClass={"PollingCreateModal"}
                                    labelClass="d-none"
                                    inputicon={
                                      <img
                                        src={BlackCrossIcon}
                                        width="31.76px"
                                        height="31.76px"
                                        onClick={HandleCancelFunction}
                                        className={
                                          styles["Cross-icon-Create_poll"]
                                        }
                                      />
                                    }
                                    iconClassName={
                                      styles["polling_Options_backGround"]
                                    }
                                  />
                                </span>
                              </Col>
                            </Row>
                          </>
                        );
                      })
                    : null}

                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <span
                        className={styles["Add_Another_field"]}
                        onClick={addNewRow}
                      >
                        <Row className="mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex gap-1 align-items-center"
                          >
                            <img
                              src={plusFaddes}
                              height="15px"
                              width="15.87px"
                              className={styles["PlusFaddedClass"]}
                            />
                            <span className={styles["Add_another_field"]}>
                              {t("Add-another-field")}
                            </span>
                          </Col>
                        </Row>
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex align-items-center gap-2"
                >
                  <Checkbox />
                  <p className={styles["CheckBoxTitle"]}>
                    {t("Allow-multiple-answers")}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="group-fields d-flex align-items-center gap-2 "
                >
                  <InputSearchFilter
                    labelClass="d-none"
                    placeholder={t("Enter-name-or-email")}
                  />
                  <Button
                    text={t("ADD")}
                    className={styles["ADD_Btn_CreatePool_Modal"]}
                  />
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={styles["Scroller_For_CreatePollModal2"]}
                >
                  <Row>
                    {members.map((data, index) => {
                      return (
                        <Col lg={5} md={5} sm={12} className="mt-2">
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <Row className={styles["Card_border2"]}>
                                <Col sm={12} md={10} lg={10}>
                                  <img
                                    src={profile}
                                    width="33px"
                                    height="33px"
                                  />
                                  <span className={styles["Name_cards"]}>
                                    {data.name}
                                  </span>
                                </Col>
                                <Col sm={12} md={2} lg={2}>
                                  <img
                                    src={CrossIcon}
                                    width="14px"
                                    height="14px"
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      );
                    })}
                  </Row>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-end gap-2"
                >
                  <Button
                    text={t("Cancel")}
                    className={styles["Cancell_btn_class"]}
                  />
                  <Button
                    text={t("Save")}
                    className={styles["Save_btn_class"]}
                  />
                  <Button
                    text={t("Save-and-publish")}
                    className={styles["Save_Publish_btn_class"]}
                  />
                </Col>
              </Row>
            </>
          }
          size={"md"}
        />
      </Container>
    </>
  );
};

export default CreatePolling;
