import React from "react";
import {
  Checkbox,
  InputSearchFilter,
  Modal,
  MultiDatePicker,
} from "../../../components/elements";
import styles from "./UpdatePolls.module.css";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import AlarmClock from "../../../assets/images/AlarmOptions.svg";
import { Button, TextField } from "../../../components/elements";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import plusFaddes from "../../../assets/images/PlusFadded.svg";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import profile from "../../../assets/images/profile_polls.svg";
import { useState } from "react";
import EditIcon from "../../../assets/images/Edit-Icon.png";

const UpdatePolls = ({ showUpdatepollModal, setShowUpdatepollModal }) => {
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const { t } = useTranslation();
  const [defineUnsaveModal, setDefineUnsaveModal] = useState(false);
  const [assignees, setAssignees] = useState("");
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
    {
      id: 5,
      name: "Saif Rehman",
    },
    {
      id: 6,
      name: "Saif test1",
    },
    {
      id: 7,
      name: "Saif test2",
    },
    {
      id: 8,
      name: "Saif test3",
    },
  ]);

  const [options, setOptions] = useState([
    {
      name: 1,
      value: "",
    },
    {
      name: 2,
      value: "",
    },
    {
      name: 3,
      value: "",
    },
  ]);

  const [UpdatePolls, setUpdatePolls] = useState({
    TypingTitle: "",
    AllowMultipleUser: false,
  });
  const addNewRow = () => {
    if (options.length > 1) {
      let lastIndex = options.length - 1;
      if (options[lastIndex].value != "") {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        let newOptions = { name: randomNumber, value: "" };
        setOptions([...options, newOptions]);
      }
    }
  };

  const HandleSearchUpdatePolls = (e) => {
    if (e.target.value.trimStart() != "") {
      setAssignees(e.target.value.trimStart());
    } else {
      setAssignees("");
    }

    console.log(assignees, "assigneesassignees");
  };

  const HandleOptionChange = (e) => {
    let name = parseInt(e.target.name);
    let newValue = e.target.value;

    setOptions((prevState) =>
      prevState.map((item) => {
        console.log(item, "HandleOptionChange");
        return item.name === name ? { ...item, value: newValue } : item;
      })
    );
  };

  const HandleCancelFunction = (index) => {
    options.splice(index, 1);
    setOptions([...options]);
  };

  const HandlecancellButton = () => {
    // setShowUpdatepollModal(false);
    setDefineUnsaveModal(true);
  };

  const HandleChangeUpdatePolls = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "TypingTitle") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (value !== "") {
        setUpdatePolls({
          ...UpdatePolls,
          TypingTitle: valueCheck,
        });
      } else {
        setUpdatePolls({
          ...UpdatePolls,
          TypingTitle: "",
        });
      }
    }
  };

  const HandleCheckBox = () => {
    setUpdatePolls({
      ...UpdatePolls,
      AllowMultipleUser: !UpdatePolls.AllowMultipleUser,
    });
  };
  console.log(options, "optionsFieldsoptionsFields");
  return (
    <>
      <Container>
        <Modal
          show={showUpdatepollModal}
          setShow={setShowUpdatepollModal}
          modalTitleClassName={styles["ModalHeader_Update_poll"]}
          modalHeaderClassName={
            styles["ModalRequestHeader_polling_update_modal"]
          }
          modalFooterClassName={"d-block"}
          onHide={() => {
            setShowUpdatepollModal(false);
          }}
          ModalTitle={
            <>
              {defineUnsaveModal ? null : (
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
                          <img
                            src={AlarmClock}
                            width="14.97px"
                            height="14.66px"
                          />
                          <span className={styles["Due_Date_heading"]}>
                            {t("Due-date-on")}{" "}
                            <span className={styles["Date_update_poll"]}>
                              34 May 2023
                            </span>
                          </span>
                          <MultiDatePicker
                            // onChange={meetingDateHandler}
                            name="MeetingDate"
                            check={true}
                            IconName={
                              <img
                                src={EditIcon}
                                width="11.54px"
                                height="11.11px"
                              />
                            }
                            // value={meetingDate}
                            calendar={calendarValue}
                            locale={localValue}
                            // newValue={createMeeting.MeetingDate}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              )}
            </>
          }
          ModalBody={
            <>
              {defineUnsaveModal ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <span className={styles["Unsaved_heading"]}>
                        {t("Any-unsaved-changes-will-be")}
                        <br />
                        <span className={styles["LostClass"]}>
                          {t("Lost-continue")}
                        </span>
                      </span>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row className="d-flex">
                    <Col lg={11} md={11} sm={12}>
                      <span className={styles["Update_Poll_Heading"]}>
                        {t("Update-poll")}
                      </span>
                    </Col>

                    <Col lg={1} ms={1} sm={12}>
                      <img
                        src={BlackCrossIcon}
                        className={
                          styles["Cross_Icon_Styling_Update_Poll_Modal"]
                        }
                        width="16px"
                        height="16px"
                        onClick={() => {
                          setShowUpdatepollModal(false);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["Scroller_For_UpdatePollModal"]}
                    >
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <TextField
                            placeholder={t("Typing-tile")}
                            applyClass={"PollingCreateModal"}
                            labelClass="d-none"
                            name={"TypingTitle"}
                            value={UpdatePolls.TypingTitle}
                            change={HandleChangeUpdatePolls}
                          />
                        </Col>
                      </Row>

                      {options.length > 0
                        ? options.map((data, index) => {
                            return (
                              <>
                                {index <= 1 ? (
                                  <>
                                    <Row className="mt-2">
                                      <Col lg={12} md={12} sm={12}>
                                        <span className="position-relative">
                                          <TextField
                                            placeholder={
                                              "Option" +
                                              " " +
                                              parseInt(index + 1)
                                            }
                                            applyClass={"PollingCreateModal"}
                                            labelClass="d-none"
                                            name={data.name}
                                            value={data.value}
                                            change={(e) =>
                                              HandleOptionChange(e)
                                            }
                                          />
                                        </span>
                                      </Col>
                                    </Row>
                                  </>
                                ) : (
                                  <>
                                    <Row className="mt-2">
                                      <Col lg={12} md={12} sm={12}>
                                        <span className="position-relative">
                                          <TextField
                                            placeholder={
                                              "Option" +
                                              " " +
                                              parseInt(index + 1)
                                            }
                                            applyClass={"PollingCreateModal"}
                                            labelClass="d-none"
                                            name={data.name}
                                            value={data.value}
                                            change={(e) =>
                                              HandleOptionChange(e)
                                            }
                                            inputicon={
                                              <img
                                                src={BlackCrossIcon}
                                                width="31.76px"
                                                height="31.76px"
                                                onClick={HandleCancelFunction}
                                                className={
                                                  styles[
                                                    "Cross-icon-Create_poll"
                                                  ]
                                                }
                                              />
                                            }
                                            iconClassName={
                                              styles[
                                                "polling_Options_backGround"
                                              ]
                                            }
                                          />
                                        </span>
                                      </Col>
                                    </Row>
                                  </>
                                )}
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
                      <Checkbox
                        checked={UpdatePolls.AllowMultipleUser}
                        onChange={HandleCheckBox}
                      />
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
                        value={assignees}
                        change={HandleSearchUpdatePolls}
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
                      className={
                        styles["Scroller_For_CreatePollModal2_Update_poll"]
                      }
                    >
                      <Row>
                        {members.map((data, index) => {
                          return (
                            <Col lg={6} md={6} sm={12} className="mt-2">
                              <Row>
                                <Col lg={11} md={11} sm={12}>
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
                </>
              )}
            </>
          }
          ModalFooter={
            <>
              {defineUnsaveModal ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center gap-3"
                    >
                      <Button
                        text={t("No")}
                        className={styles["No_Btn_polls_delModal"]}
                        onClick={() => {
                          setDefineUnsaveModal(false);
                        }}
                      />
                      <Button
                        text={t("Yes")}
                        className={styles["Yes_Btn_polls_delModal"]}
                      />
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row className="mt-5">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-end gap-2"
                    >
                      <Button
                        text={t("Cancel")}
                        className={styles["Cancell_btn_class_Update_polls"]}
                        onClick={HandlecancellButton}
                      />
                      <Button
                        text={t("Update")}
                        className={styles["Update_btn_class"]}
                      />
                      <Button
                        text={t("Update-and-publish")}
                        className={styles["Update_Publish_btn_class"]}
                      />
                    </Col>
                  </Row>
                </>
              )}
            </>
          }
          size={defineUnsaveModal ? "md" : "md"}
        />
      </Container>
    </>
  );
};

export default UpdatePolls;
