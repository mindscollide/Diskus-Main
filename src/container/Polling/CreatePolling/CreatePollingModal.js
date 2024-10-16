import React, { useEffect, useRef } from "react";
import { Checkbox, Modal, Notification } from "../../../components/elements";
import DatePicker, { DateObject } from "react-multi-date-picker";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import styles from "./CreatePolling.module.css";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import WhiteCrossIcon from "../../../assets/images/PollCrossIcon.svg";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import AlarmClock from "../../../assets/images/AlarmOptions.svg";
import { Button, TextField } from "../../../components/elements";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import plusFaddes from "../../../assets/images/PlusFadded.svg";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GroupIcon from "../../../assets/images/groupdropdown.svg";
import committeeicon from "../../../assets/images/committeedropdown.svg";
import { enGB, ar } from "date-fns/locale";
import {
  SavePollsApi,
  getAllCommitteesandGroups,
  setCreatePollModal,
} from "../../../store/actions/Polls_actions";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import {
  DateFormatForPolls,
  multiDatePickerDateChangIntoUTC,
} from "../../../commen/functions/date_formater";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import {
  regexOnlyForNumberNCharacters,
  validateInput,
} from "../../../commen/functions/regex";
import { showMessage } from "../../../components/elements/snack_bar/utill";

const CreatePolling = () => {
  const datePickerRef = useRef();
  const animatedComponents = makeAnimated();
  let dateFormat = "DD/MM/YYYY";
  let currentLanguage = localStorage.getItem("i18nextLng");
  registerLocale("ar", ar);
  registerLocale("en", enGB);
  //For Custom language datepicker
  const { PollsReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const { t } = useTranslation();
  const [defineUnsaveModal, setDefineUnsaveModal] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [members, setMembers] = useState([]);
  const [dropdowndata, setDropdowndata] = useState([]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [selectedsearch, setSelectedsearch] = useState([]);

  const [error, setError] = useState(false);

  const [createPollData, setcreatePollData] = useState({
    TypingTitle: "",
    InputSearch: "",
    date: "",
    AllowMultipleAnswers: true,
  });

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

  const CustomIcon = () => (
    <div className="custom-icon-wrapper">
      <img
        src={EditIcon}
        alt="Edit Icon"
        height="11.11px"
        width="11.54px"
        className="custom-icon cursor-pointer"
        onClick={handleIconClick}
        draggable="false"
      />
    </div>
  );
  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.openCalendar();
    }
  };
  const allValuesNotEmpty = options.every((item) => item.value !== "");

  const allValuesNotEmptyAcceptLastOne = options.every((item, index) => {
    if (index === options.length - 1) {
      return true; // Allow the last object's value to be empty
    }
    return item.value !== "";
  });

  useEffect(() => {
    if (currentLanguage === "ar") {
      moment.locale(currentLanguage);
    } else if (currentLanguage === "fr") {
      moment.locale(currentLanguage);
    } else {
      moment.locale(currentLanguage);
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (currentLanguage !== null) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);

  useEffect(() => {
    dispatch(getAllCommitteesandGroups(navigate, t, false));
  }, []);

  useEffect(() => {
    let pollsData = PollsReducer.gellAllCommittesandGroups;
    if (pollsData !== null && pollsData !== undefined) {
      let temp = [];
      if (Object.keys(pollsData).length > 0) {
        if (Object.keys(pollsData.groups).length > 0) {
          pollsData.groups.map((a, index) => {
            let newData = {
              value: a.groupID,
              name: a.groupName,
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
                        src={GroupIcon}
                        height="16.45px"
                        width="18.32px"
                        draggable="false"
                        alt=""
                      />
                      <span className={styles["NameDropDown"]}>
                        {a.groupName}
                      </span>
                    </Col>
                  </Row>
                </>
              ),
              type: 1,
            };
            temp.push(newData);
          });
        }
        if (Object.keys(pollsData.committees).length > 0) {
          pollsData.committees.map((a, index) => {
            let newData = {
              value: a.committeeID,
              name: a.committeeName,

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
                        src={committeeicon}
                        width="21.71px"
                        height="18.61px"
                        draggable="false"
                        alt=""
                      />
                      <span className={styles["NameDropDown"]}>
                        {a.committeeName}
                      </span>
                    </Col>
                  </Row>
                </>
              ),
              type: 2,
            };
            temp.push(newData);
          });
        }
        if (Object.keys(pollsData.organizationUsers).length > 0) {
          console.log(
            pollsData.organizationUsers,
            "organizationUsersorganizationUsersorganizationUsers"
          );
          pollsData.organizationUsers.map((a, index) => {
            let newData = {
              value: a.userID,
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
  }, [PollsReducer.gellAllCommittesandGroups]);

  // for selection of data
  const handleSelectValue = (value) => {
    setSelectedsearch(value);
  };

  // for add user for assignes
  const handleAddUsers = () => {
    let pollsData = PollsReducer.gellAllCommittesandGroups;
    let tem = [...members];
    if (Object.keys(selectedsearch).length > 0) {
      try {
        selectedsearch.map((seledtedData, index) => {
          console.log(
            seledtedData,
            "seledtedDataseledtedDataseledtedDataseledtedData"
          );
          if (seledtedData.type === 1) {
            let check1 = pollsData.groups.find(
              (data, index) => data.groupID === seledtedData.value
            );
            if (check1 !== undefined) {
              let groupUsers = check1.groupUsers;
              if (Object.keys(groupUsers).length > 0) {
                groupUsers.map((gUser, index) => {
                  let check2 = members.find(
                    (data, index) => data.UserID === gUser.userID
                  );
                  if (check2 !== undefined) {
                  } else {
                    let newUser = {
                      userName: gUser.userName,
                      userID: gUser.userID,
                      displayPicture: "",
                    };
                    tem.push(newUser);
                  }
                });
              }
            }
          } else if (seledtedData.type === 2) {
            let check1 = pollsData.committees.find(
              (data, index) => data.committeeID === seledtedData.value
            );
            if (check1 != undefined) {
              let committeesUsers = check1.committeeUsers;
              if (Object.keys(committeesUsers).length > 0) {
                committeesUsers.map((cUser, index) => {
                  let check2 = members.find(
                    (data, index) => data.UserID === cUser.userID
                  );
                  if (check2 != undefined) {
                  } else {
                    let newUser = {
                      userName: cUser.userName,
                      userID: cUser.userID,
                      displayPicture: "",
                    };
                    tem.push(newUser);
                  }
                });
              }
            }
          } else if (seledtedData.type === 3) {
            let check1 = members.find(
              (data, index) => data.UserID === seledtedData.value
            );
            if (check1 != undefined) {
            } else {
              let check2 = pollsData.organizationUsers.find(
                (data, index) => data.userID === seledtedData.value
              );

              if (check2 !== undefined) {
                let newUser = {
                  userName: check2.userName,
                  userID: check2.userID,
                  displayPicture:
                    check2.profilePicture.displayProfilePictureName,
                };
                tem.push(newUser);
              }
            }
          } else {
          }
        });
      } catch {}

      const uniqueData = new Set(tem.map(JSON.stringify));

      // Convert the Set back to an array of objects
      const result = Array.from(uniqueData).map(JSON.parse);
      setMembers(result);
      setSelectedsearch([]);
    } else {
      // setopen notionation work here
    }
  };

  const changeDateStartHandler = (date) => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let DateDate = new Date(date);
    DateDate.setHours(23, 59, 0, 0); // Set the time to 23:59:00

    setMeetingDate(meetingDateValueFormat);
    setcreatePollData({
      ...createPollData,
      date: DateDate,
    });
  };
  console.log(createPollData, "createPollDatacreatePollData");
  const changeDateStartHandler2 = (date) => {
    let newDate = moment(date).format("DD MMMM YYYY");
    return newDate;
  };

  // for create polls
  const SavePollsButtonFunc = async (value) => {
    const organizationid = localStorage.getItem("organizationID");
    const createrid = localStorage.getItem("userID");
    let users = [];
    let optionsListData = [];
    if (
      createPollData.date !== "" &&
      createPollData.TypingTitle !== "" &&
      Object.keys(members).length > 0 &&
      Object.keys(options).length >= 2 &&
      allValuesNotEmpty
    ) {
      members.forEach((userdata, index) => {
        users.push(userdata.userID);
      });
      options.forEach((optionData, index) => {
        if (optionData.value !== "") {
          optionsListData.push(optionData.value);
        }
      });

      let data = {
        PollDetails: {
          PollTitle: createPollData.TypingTitle,
          DueDate: multiDatePickerDateChangIntoUTC(createPollData.date),
          AllowMultipleAnswers: createPollData.AllowMultipleAnswers,
          CreatorID: parseInt(createrid),
          PollStatusID: parseInt(value),
          OrganizationID: parseInt(organizationid),
        },
        ParticipantIDs: users,
        PollAnswers: optionsListData,
      };

      await dispatch(SavePollsApi(navigate, data, t, 1));
    } else {
      setError(true);

      if (createPollData.TypingTitle === "") {
        showMessage(t("Title-is-required"), "error", setOpen);
      } else if (createPollData.date === "") {
        showMessage(t("Select-date"), "error", setOpen);
      } else if (Object.keys(members).length === 0) {
        showMessage(t("Atleat-one-member-required"), "error", setOpen);
      } else if (Object.keys(options).length <= 1) {
        showMessage(t("Required-atleast-two-options"), "error", setOpen);
      } else if (!allValuesNotEmpty) {
        showMessage(t("Please-fill-all-open-option-fields"), "error", setOpen);
      } else {
        showMessage(t("Please-fill-all-reqired-fields"), "error", setOpen);
      }
    }
  };

  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "TypingTitle") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
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
    // let valueCheck = regexOnlyForNumberNCharacters(newValue);
    setOptions((prevState) =>
      prevState.map((item) => {
        return item.name === name ? { ...item, value: newValue } : item;
      })
    );
  };

  const addNewRow = () => {
    if (options.length > 1) {
      if (allValuesNotEmpty) {
        let lastIndex = options.length - 1;
        if (options[lastIndex].value !== "") {
          const randomNumber = Math.floor(Math.random() * 100) + 1;
          let newOptions = { name: randomNumber, value: "" };
          setOptions([...options, newOptions]);
        }
      } else {
        showMessage(t("Please-fill-options"), "error", setOpen);
      }
    } else {
      showMessage(t("Please-fill-options"), "error", setOpen);
    }
  };

  const HandleCancelFunction = (index) => {
    let optionscross = [...options];
    optionscross.splice(index, 1);
    setOptions(optionscross);
  };

  const cancellAnyUser = (index) => {
    let removeData = [...members];
    removeData.splice(index, 1);
    setMembers(removeData);
  };

  const HandlecancellButton = () => {
    setDefineUnsaveModal(true);
  };

  const HandleCheck = () => {
    setcreatePollData({
      ...createPollData,
      AllowMultipleAnswers: !createPollData.AllowMultipleAnswers,
    });
  };

  const customFilter = (options, searchText) => {
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Container>
        <Modal
          show={PollsReducer.createPollmodal}
          setShow={dispatch(setCreatePollModal)}
          modalTitleClassName={styles["ModalHeader_create_poll"]}
          modalHeaderClassName={styles["ModalRequestHeader_polling"]}
          modalFooterClassName={"d-block"}
          onHide={() => {
            setDefineUnsaveModal(true);
            // dispatch(setCreatePollModal(false));
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
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-center gap-2 align-items-center"
                        >
                          <span className="cursor-pointer d-flex gap-2 align-items-center">
                            <img
                              src={AlarmClock}
                              width="14.97px"
                              height="14.66px"
                              className={styles["classOFImage"]}
                              onClick={handleIconClick}
                              alt=""
                              draggable="false"
                            />
                            <span
                              className={styles["Due_Date_heading"]}
                              onClick={handleIconClick}
                            >
                              {t("Due-date")}
                              {"* "}
                              {createPollData.date !== ""
                                ? changeDateStartHandler2(createPollData.date)
                                : ""}
                            </span>

                            <DatePicker
                              selected={createPollData.date}
                              format={dateFormat}
                              minDate={moment().toDate()}
                              placeholder="DD/MM/YYYY"
                              render={<CustomIcon />}
                              calendarPosition="bottom-right"
                              editable={true}
                              className="datePickerTodoCreate2"
                              onOpenPickNewDate={false}
                              highlightToday={true}
                              inputMode=""
                              showOtherDays
                              calendar={calendarValue}
                              locale={localValue}
                              ref={datePickerRef}
                              onClick={handleIconClick}
                              onFocusedDateChange={(value) =>
                                changeDateStartHandler(value)
                              }
                            />
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p
                        className={
                          error && meetingDate === ""
                            ? ` ${styles["errorMessage-inLogin_1"]} `
                            : `${styles["errorMessage-inLogin_1_hidden"]}`
                        }
                      >
                        {t("Please-select-due-date")}
                      </p>
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
                        alt=""
                        onClick={() => {
                          setDefineUnsaveModal(true);
                        }}
                        draggable="false"
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
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <TextField
                            placeholder={t("Title") + "*"}
                            applyClass={"PollingCreateModal"}
                            labelclass="d-none"
                            maxLength={140}
                            name={"TypingTitle"}
                            value={createPollData.TypingTitle}
                            change={HandleChange}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              error && createPollData.TypingTitle === ""
                                ? ` ${styles["errorMessage-inLogin"]} `
                                : `${styles["errorMessage-inLogin_hidden"]}`
                            }
                          >
                            {t("Please-enter-title")}
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["Scroller_For_CreatePollModal"]}
                        >
                          {options.length > 0
                            ? options.map((data, index) => {
                                return (
                                  <>
                                    {index <= 1 ? (
                                      <Row key={index} className="mt-2">
                                        <Col lg={12} md={12} sm={12}>
                                          <span className="position-relative">
                                            <TextField
                                              placeholder={
                                                "Option" +
                                                " " +
                                                parseInt(index + 1) +
                                                "*"
                                              }
                                              applyClass={"PollingCreateModal"}
                                              labelclass="d-none"
                                              name={data.name}
                                              maxLength={100}
                                              value={data.value}
                                              change={(e) =>
                                                HandleOptionChange(e)
                                              }
                                            />
                                          </span>
                                        </Col>
                                      </Row>
                                    ) : (
                                      <Row key={index} className="mt-2">
                                        <Col lg={12} md={12} sm={12}>
                                          <span className="position-relative">
                                            <TextField
                                              placeholder={
                                                "Option" +
                                                " " +
                                                parseInt(index + 1) +
                                                "*"
                                              }
                                              applyClass={"PollingCreateModal"}
                                              labelclass="d-none"
                                              name={data.name}
                                              value={data.value}
                                              maxLength={100}
                                              change={(e) =>
                                                HandleOptionChange(e)
                                              }
                                              inputicon={
                                                <img
                                                  src={WhiteCrossIcon}
                                                  width="31.76px"
                                                  alt=""
                                                  height="31.76px"
                                                  onClick={() =>
                                                    HandleCancelFunction(index)
                                                  }
                                                  className={
                                                    styles[
                                                      "Cross-icon-Create_poll"
                                                    ]
                                                  }
                                                  draggable="false"
                                                />
                                              }
                                              iconclassname={
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
                                          alt=""
                                          draggable="false"
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
                          <Row>
                            <Col>
                              <p
                                className={
                                  error && allValuesNotEmpty === false
                                    ? ` ${styles["errorMessage-inLogin"]} `
                                    : `${styles["errorMessage-inLogin_hidden"]}`
                                }
                              >
                                {t("Options-must-be-more-than-2")}
                              </p>
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
                          <Select
                            onChange={handleSelectValue}
                            isDisabled={
                              PollsReducer.gellAllCommittesandGroups === null
                                ? true
                                : false
                            }
                            value={selectedsearch}
                            classNamePrefix={"selectMember"}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            filterOption={customFilter}
                            isMulti
                            options={dropdowndata}
                          />
                          <Button
                            text={t("ADD")}
                            className={styles["ADD_Btn_CreatePool_Modal"]}
                            onClick={handleAddUsers}
                          />
                        </Col>
                        <Row>
                          <Col>
                            <p
                              className={
                                error && members.length === 0
                                  ? ` ${styles["errorMessage-inLogin"]} `
                                  : `${styles["errorMessage-inLogin_hidden"]}`
                              }
                            >
                              {t("Select-atleast-one-participants")}
                            </p>
                          </Col>
                        </Row>
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className={styles["Participant_heading"]}
                        >
                          {t("Participants")}
                        </Col>
                      </Row>
                      <Row className="mt-1">
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
                                        <Col
                                          sm={12}
                                          md={10}
                                          lg={10}
                                          className="d-flex align-items-center"
                                        >
                                          <img
                                            src={`data:image/jpeg;base64,${data.displayPicture}`}
                                            width="33px"
                                            height="33px"
                                            alt=""
                                            draggable="false"
                                          />
                                          <span
                                            className={styles["Name_cards"]}
                                          >
                                            {data.userName}
                                          </span>
                                        </Col>
                                        <Col sm={12} md={2} lg={2}>
                                          <img
                                            src={CrossIcon}
                                            width="14px"
                                            height="14px"
                                            onClick={cancellAnyUser}
                                            alt=""
                                            draggable="false"
                                            style={{ cursor: "pointer" }}
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
                        onClick={() => {
                          dispatch(setCreatePollModal(false));
                          setDefineUnsaveModal(false);
                        }}
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
                            onClick={() => SavePollsButtonFunc(1)}
                          />
                          <Button
                            text={t("Publish")}
                            className={styles["Save_Publish_btn_class"]}
                            onClick={() => SavePollsButtonFunc(2)}
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
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.flag })}
        severity={open.severity}
      />
    </>
  );
};

export default CreatePolling;
