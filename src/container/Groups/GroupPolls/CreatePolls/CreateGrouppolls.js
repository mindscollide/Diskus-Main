import React, { useEffect, useState } from "react";
import styles from "./CreateGroupPolls.module.css";
import gregorian_en from "react-date-object/locales/gregorian_en";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

import {
  Button,
  TextField,
  Checkbox,
  Notification,
} from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import {
  regexOnlyForNumberNCharacters,
  validateInput,
} from "../../../../commen/functions/regex";
import WhiteCrossIcon from "../../../../assets/images/PollCrossIcon.svg";
import plusFaddes from "../../../../assets/images/NewBluePLus.svg";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useRef } from "react";
import InputIcon from "react-multi-date-picker/components/input_icon";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import RedCross from "../../../../assets/images/CrossIcon.svg";
import UnsavedPollsMeeting from "./UnsavedPollsMeeting/UnsavedPollsMeeting";
import { showUnsavedPollsMeeting } from "../../../../store/actions/NewMeetingActions";
import ViewPollsUnPublished from "../VIewPollsUnPublished/ViewPollsUnPublished";
import ViewPollsPublishedScreen from "../ViewPollsPublishedScreen/ViewPollsPublishedScreen";
import { multiDatePickerDateChangIntoUTC } from "../../../../commen/functions/date_formater";
import { SavePollsApi } from "../../../../store/actions/Polls_actions";
import EnglishCalendar from "react-date-object/calendars/gregorian";
import ArabicCalendar from "react-date-object/calendars/arabic";

const CreateGroupPolls = ({ setCreatepoll, view }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const unsavedPollsMeeting = useSelector(
    (state) => state.NewMeetingreducer.unsavedPollsMeeting
  );
  const getGroupByGroupIdResponse = useSelector(
    (state) => state.GroupsReducer.getGroupByGroupIdResponse
  );
  const [savedPolls, setSavedPolls] = useState(false);
  const [savePollsPublished, setSavePollsPublished] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [selectedsearch, setSelectedsearch] = useState([]);
  const [memberSelect, setmemberSelect] = useState([]); //For Custom language datepicker
  const [pollsData, setPollsData] = useState({
    Title: "",
    AllowMultipleAnswer: false,
    date: "",
  });
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(EnglishCalendar);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();
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
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [members, setMembers] = useState([]);

  const HandleCancelFunction = (index) => {
    let optionscross = [...options];
    optionscross.splice(index, 1);
    setOptions(optionscross);
  };

  const HandleOptionChange = (e) => {
    let name = parseInt(e.target.name);
    let newValue = e.target.value;
    let valueCheck = regexOnlyForNumberNCharacters(newValue);
    setOptions((prevState) =>
      prevState.map((item) => {
        return item.name === name ? { ...item, value: valueCheck } : item;
      })
    );
  };
  const allValuesNotEmpty = options.every((item) => item.value !== "");
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

  const RemoveMembers = (index) => {
    const updateMember = [...members];
    updateMember.splice(index, 1);
    setMembers(updateMember);
  };

  const handleCancelButton = () => {
    dispatch(showUnsavedPollsMeeting(true));
  };

  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "TitlePolls") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setPollsData({
          ...pollsData,
          Title: valueCheck,
        });
      } else {
        setPollsData({
          ...pollsData,
          Title: "",
        });
      }
    }
  };

  const HandleCheckMultipleAnswers = () => {
    setPollsData({
      ...pollsData,
      AllowMultipleAnswer: !pollsData.AllowMultipleAnswer,
    });
  };

  const changeDateStartHandler = (date) => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let DateDate = new Date(date);
    DateDate.setHours(23, 59, 0, 0);
    setMeetingDate(meetingDateValueFormat);
    setPollsData({
      ...pollsData,
      date: DateDate,
    });
  };

  useEffect(() => {
    if (currentLanguage !== null) {
      if (currentLanguage === "en") {
        setCalendarValue(EnglishCalendar);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(ArabicCalendar);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (
      getGroupByGroupIdResponse !== null &&
      getGroupByGroupIdResponse !== undefined
    ) {
      try {
        let newArr = [];
        let getUserDetails = getGroupByGroupIdResponse.groupMembers;
        getUserDetails.forEach((data, index) => {
          newArr.push({
            value: data.pK_UID,
            name: data.userName,
            label: (
              <>
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      <img
                        src={`data:image/jpeg;base64,${data.userProfilePicture.displayProfilePictureName}`}
                        height="16.45px"
                        width="18.32px"
                        draggable="false"
                        alt=""
                      />
                      <span className={styles["NameDropDown"]}>
                        {data.userName}
                      </span>
                    </Col>
                  </Row>
                </>
              </>
            ),
            type: 1,
          });
        });
        let sortAssginersArr = newArr.sort(
          (a, b) =>  a.name.localeCompare(b.name)
        );
        setmemberSelect(sortAssginersArr);
      } catch (error) {}
    }
  }, [getGroupByGroupIdResponse]);

  // for selection of data
  const handleSelectValue = (value) => {
    setSelectedsearch(value);
  };

  const handleAddUsers = () => {
    let getUserDetails = getGroupByGroupIdResponse.groupMembers;

    let tem = [...members];
    let newarr = [];
    try {
      if (Object.keys(selectedsearch).length > 0) {
        try {
          selectedsearch.forEach((seledtedData, index) => {
            if (seledtedData.type === 1) {
              let check1 = getUserDetails.find(
                (data) => data.pK_UID === seledtedData.value
              );

              if (check1 !== undefined) {
                newarr.push(check1);

                if (newarr.length > 0) {
                  newarr.forEach((morganizer) => {
                    let check2 = newarr.find(
                      (data) => data.UserID === morganizer.pK_UID
                    );
                    if (check2 !== undefined) {
                    } else {
                      let newUser = {
                        userName: morganizer.userName,
                        userID: morganizer.pK_UID,
                        displayPicture:
                          morganizer.userProfilePicture
                            .displayProfilePictureName,
                      };
                      tem.push(newUser);
                    }
                  });
                }
              }
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
    } catch {}
  };

  // for create polls
  const SavePollsButtonFunc = async (value) => {
    const organizationid = localStorage.getItem("organizationID");
    const createrid = localStorage.getItem("userID");
    let users = [];
    let optionsListData = [];
    if (
      pollsData.date !== "" &&
      pollsData.Title !== "" &&
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
          PollTitle: pollsData.Title,
          DueDate: multiDatePickerDateChangIntoUTC(pollsData.date),
          AllowMultipleAnswers: pollsData.AllowMultipleAnswer,
          CreatorID: parseInt(createrid),
          PollStatusID: parseInt(value),
          OrganizationID: parseInt(organizationid),
        },
        ParticipantIDs: users,
        PollAnswers: optionsListData,
      };
      await dispatch(SavePollsApi(navigate, data, t, 4));
      setCreatepoll(false);
    } else {
      if (pollsData.Title === "") {
        showMessage(t("Title-is-required"), "error", setOpen);
      } else if (pollsData.date === "") {
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

  const customFilter = (options, searchText) => {
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {savedPolls ? (
        <ViewPollsUnPublished setSavedPolls={setSavedPolls} />
      ) : savePollsPublished ? (
        <ViewPollsPublishedScreen
          setSavePollsPublished={setSavePollsPublished}
        />
      ) : (
        <>
          <section>
            <Row>
              <Col lg={6} md={6} sm={6}>
                <Row className="mt-5">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Title_heading"]}>
                      {t("Title")} <span className={styles["steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      labelclass={"d-none"}
                      name={"TitlePolls"}
                      maxLength={140}
                      applyClass={"PollingCreateModal"}
                      value={pollsData.Title}
                      change={HandleChange}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Title_heading"]}>
                      {t("Options")} <span className={styles["steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_Meeting_polls"]}
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
                                        change={(e) => HandleOptionChange(e)}
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
                                        change={(e) => HandleOptionChange(e)}
                                        inputicon={
                                          <img
                                            draggable={false}
                                            src={WhiteCrossIcon}
                                            width="31.76px"
                                            height="31.76px"
                                            alt=""
                                            onClick={() =>
                                              HandleCancelFunction(index)
                                            }
                                            className={
                                              styles["Cross-icon-Create_poll"]
                                            }
                                          />
                                        }
                                        iconclassname={
                                          styles["polling_Options_backGround"]
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
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <Button
                      text={
                        <>
                          <Row className="mt-1">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex gap-2"
                            >
                              <img
                                draggable={false}
                                src={plusFaddes}
                                alt=""
                                width="15.87px"
                                height="15.87px"
                              />
                              <span className={styles["Add_Button_Heading"]}>
                                {t("Add-another-field")}
                              </span>
                            </Col>
                          </Row>
                        </>
                      }
                      onClick={addNewRow}
                      className={styles["Add_another_options"]}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    className="d-flex align-items-start flex-column justify-content-start"
                  >
                    <span className={styles["Title_heading"]}>
                      {t("Due-date") + "*"}
                    </span>
                    <DatePicker
                      value={meetingDate}
                      format={"DD/MM/YYYY"}
                      minDate={new Date()}
                      placeholder="DD/MM/YYYY"
                      render={
                        <InputIcon
                          placeholder="DD/MM/YYYY"
                          className="datepicker_input"
                        />
                      }
                      editable={false}
                      className="datePickerTodoCreate2"
                      onOpenPickNewDate={true}
                      calendar={calendarValue}
                      locale={localValue}
                      ref={calendRef}
                      onFocusedDateChange={changeDateStartHandler}
                    />
                  </Col>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    className="d-flex justify-content-end"
                  >
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex align-items-center gap-2"
                      >
                        <Checkbox
                          onChange={HandleCheckMultipleAnswers}
                          checked={pollsData.AllowMultipleAnswer}
                        />
                        <p className={styles["CheckBoxTitle"]}>
                          {t("Allow-multiple-answers")}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col lg={6} md={6} sm={6}>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["MarginSection"]}
                  >
                    <Row className="mt-5">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="group-fields d-flex align-items-center gap-2"
                      >
                        <Select
                          classNamePrefix={"Polls_Meeting"}
                          options={memberSelect}
                          value={selectedsearch}
                          closeMenuOnSelect={false}
                          components={animatedComponents}
                          isMulti
                          onChange={handleSelectValue}
                          filterOption={customFilter}
                        />
                        <Button
                          text={t("ADD")}
                          className={styles["ADD_Btn_CreatePool_Modal"]}
                          onClick={handleAddUsers}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_Members"]}
                  >
                    <Row>
                      {members.length > 0
                        ? members.map((data, index) => {
                            return (
                              <>
                                <Col lg={6} md={6} sm={6} className="mt-3">
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <section
                                        className={styles["Outer_Box_Members"]}
                                      >
                                        <Row className="mt-2">
                                          <Col
                                            lg={10}
                                            md={10}
                                            sm={10}
                                            className="d-flex gap-2 align-items-center"
                                          >
                                            <img
                                              src={`data:image/jpeg;base64,${data?.displayPicture}`}
                                              draggable={false}
                                              height="33px"
                                              width="33px"
                                              alt=""
                                              className={
                                                styles["ProfileStyles"]
                                              }
                                            />
                                            <span
                                              className={styles["Name_Members"]}
                                            >
                                              {data.userName}
                                            </span>
                                          </Col>
                                          <Col
                                            lg={2}
                                            md={2}
                                            sm={2}
                                            className="d-flex align-items-center"
                                          >
                                            <img
                                              draggable={false}
                                              src={RedCross}
                                              alt=""
                                              height="14px"
                                              width="14px"
                                              className="cursor-pointer"
                                              onClick={() =>
                                                RemoveMembers(index)
                                              }
                                            />
                                          </Col>
                                        </Row>
                                      </section>
                                    </Col>
                                  </Row>
                                </Col>
                              </>
                            );
                          })
                        : null}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Cancel")}
                  className={styles["Cancel_Button_Meeting_Creat_Polls"]}
                  onClick={handleCancelButton}
                />
                <Button
                  text={t("Save")}
                  className={styles["Save_Button_Meeting_Creat_Polls"]}
                  onClick={() => SavePollsButtonFunc(1)}
                />
                <Button
                  text={t("Publish")}
                  className={styles["Save_Button_Meeting_Creat_Polls"]}
                  onClick={() => SavePollsButtonFunc(2)}
                />
              </Col>
            </Row>
            <Notification open={open} setOpen={setOpen} />

            {unsavedPollsMeeting && (
              <UnsavedPollsMeeting setCreatepoll={setCreatepoll} />
            )}
          </section>
        </>
      )}
    </>
  );
};

export default CreateGroupPolls;
