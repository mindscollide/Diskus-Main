import React, { useEffect } from "react";
import {
  Checkbox,
  InputSearchFilter,
  Modal,
  MultiDatePicker,
} from "../../../components/elements";
import styles from "./CreatePolling.module.css";
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCommitteesandGroups } from "../../../store/actions/Polls_actions";
import Select from "react-select";
import makeAnimated from "react-select/animated";


const CreatePolling = ({ showPollingModal, setShowPollingModal }) => {
  const animatedComponents = makeAnimated();
  const optionsNew = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  //For Custom language datepicker
  const { PollsReducer } = useSelector(state => state);
  console.log(PollsReducer, "PollsReducerPollsReducer")
  const dispatch = useDispatch();
  const navigat = useNavigate();

  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const { t } = useTranslation();
  const [defineUnsaveModal, setDefineUnsaveModal] = useState(false);
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
      id: 22,
      name: "Saif Rehman",
    },
    {
      id: 222,
      name: "Saif Rehman",
    },
    {
      id: 121,
      name: "Saif Rehman",
    },
    {
      id: 12121,
      name: "Saif Rehman",
    },
    {
      id: 222111,
      name: "Saif Rehman",
    },
  ]);

  const [createPollData, setcreatePollData] = useState({
    TypingTitle: "",
    InputSearch: "",
    AllowMultipleAnswers: true,
  });

  const [assignees, setAssignees] = useState("");


  useEffect(() => {
    dispatch(getAllCommitteesandGroups())
  }, [])
  const HandleSearch = (e) => {
    if (e.target.value.trimStart() != "") {
      setAssignees(e.target.value.trimStart());
    } else {
      setAssignees("");
    }

    console.log(assignees, "assigneesassignees");
  };

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
  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(name, value, index, "checkvalue");
    if (name === "TypingTitle") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (value !== "") {
        setcreatePollData({
          ...createPollData,
          TypingTitle: valueCheck,
        });
      } else {
        setcreatePollData({
          ...createPollData,
          TypingTitle: "",
        });
      }
    }
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
  console.log("HandleOptionChange", options);

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

  const HandleCancelFunction = (index) => {
    options.splice(index, 1);
    setOptions([...options]);
  };

  const HandlecancellButton = () => {
    // setShowPollingModal(false);
    setDefineUnsaveModal(true);
  };

  const HandleCheck = () => {
    setcreatePollData({
      ...createPollData,
      AllowMultipleAnswers: !createPollData.AllowMultipleAnswers,
    });
  };
  return (
    <>
      <Container>
        <Modal
          show={showPollingModal}
          setShow={setShowPollingModal}
          modalTitleClassName={styles["ModalHeader_create_poll"]}
          modalHeaderClassName={styles["ModalRequestHeader_polling"]}
          modalFooterClassName={"d-block"}
          onHide={() => {
            setShowPollingModal(false);
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
                            className={styles["classOFImage"]}
                          />
                          <span className={styles["Due_Date_heading"]}>
                            {t("Due-date")}
                          </span>
                          <MultiDatePicker
                            // onChange={meetingDateHandler}
                            name="MeetingDate"
                            check={true}
                            // IconName={
                            //   <img
                            //     src={EditIcon}
                            //     width="11.54px"
                            //     height="11.11px"
                            //   />
                            // }
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
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-end align-items-center "
                    >
                      <img
                        src={BlackCrossIcon}
                        className={
                          styles["Cross_Icon_Styling_Create_Poll_Modal"]
                        }
                        width="16px"
                        height="16px"
                        onClick={() => {
                          setShowPollingModal(false);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["OverAll_padding"]}
                    >
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Create_Poll_Heading"]}>
                            {t("Create-new-poll")}
                          </span>
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
                                name={"TypingTitle"}
                                value={createPollData.TypingTitle}
                                change={HandleChange}
                              />
                            </Col>
                          </Row>
                          {options.length > 0
                            ? options.map((data, index) => {
                              return (
                                <>
                                  {index <= 1 ? (
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
                                  ) : (
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
                                  )}
                                </>
                              );
                            })
                            : null}

                          <Row className="mt-2">
                            <Col lg={12} md={12} sm={12}>
                              <Button
                                text={
                                  <>
                                    <Row>
                                      <Col
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        className={styles["ClassAddButton"]}
                                      >
                                        <img
                                          src={plusFaddes}
                                          width="15.87px"
                                          height="15.87px"
                                        />
                                        <span>{t("Add-another-field")}</span>
                                      </Col>
                                    </Row>
                                  </>
                                }
                                onClick={addNewRow}
                                className={styles["Add_another_options"]}
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
                          className="d-flex align-items-center gap-2"
                        >
                          <Checkbox
                            checked={createPollData.AllowMultipleAnswers}
                            onChange={HandleCheck}
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
                          className="group-fields d-flex align-items-center gap-2  "
                        >
                          {/* <InputSearchFilter
                            labelClass="d-none"
                            placeholder={t("Enter-name-or-email")}
                            change={HandleSearch}
                            value={assignees}
                          /> */}
                          <Select
                            classNamePrefix={"selectMember"}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={optionsNew}
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
                                          <span
                                            className={styles["Name_cards"]}
                                          >
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
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["OverAll_padding"]}
                    >
                      <Row className="mt-5">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-end gap-2  m-0 p-0"
                        >
                          <Button
                            text={t("Cancel")}
                            className={styles["Cancell_btn_class"]}
                            onClick={HandlecancellButton}
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
                    </Col>
                  </Row>
                </>
              )}
            </>
          }
          size={"md"}
        />
      </Container>
    </>
  );
};

export default CreatePolling;
