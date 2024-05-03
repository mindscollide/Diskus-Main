import React, { useEffect, useState } from "react";
import styles from "./CreatePolls.module.css";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import {
  Button,
  TextField,
  Checkbox,
  Notification,
} from "../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import {
  regexOnlyForNumberNCharacters,
  validateInput,
} from "../../../../../../commen/functions/regex";
import WhiteCrossIcon from "../../../../../../assets/images/PollCrossIcon.svg";
import plusFaddes from "../../../../../../assets/images/NewBluePLus.svg";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useRef } from "react";
import moment from "moment";
import InputIcon from "react-multi-date-picker/components/input_icon";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Profile from "../../../../../../assets/images/newprofile.png";
import GroupIcon from "../../../../../../assets/images/groupdropdown.svg";
import RedCross from "../../../../../../assets/images/CrossIcon.svg";
import UnsavedPollsMeeting from "./UnsavedPollsMeeting/UnsavedPollsMeeting";
import {
  CleareMessegeNewMeeting,
  GetAllMeetingUserApiFunc,
  showUnsavedPollsMeeting,
} from "../../../../../../store/actions/NewMeetingActions";
import ViewPollsUnPublished from "../VIewPollsUnPublished/ViewPollsUnPublished";
import ViewPollsPublishedScreen from "../ViewPollsPublishedScreen/ViewPollsPublishedScreen";
import { multiDatePickerDateChangIntoUTC } from "../../../../../../commen/functions/date_formater";
import {
  SavePollsApi,
  clearPollsMesseges,
} from "../../../../../../store/actions/Polls_actions";

const Createpolls = ({ setCreatepoll, currentMeeting }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const { NewMeetingreducer, PollsReducer } = useSelector((state) => state);
  const [savedPolls, setSavedPolls] = useState(false);
  const [savePollsPublished, setSavePollsPublished] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [selectedsearch, setSelectedsearch] = useState([]);
  const [memberSelect, setmemberSelect] = useState([]);
  console.log(memberSelect, "memberSelectmemberSelectmemberSelect");
  const [pollsData, setPollsData] = useState({
    Title: "",
    AllowMultipleAnswer: false,
    date: "",
  });
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
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
    flag: false,
    message: "",
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
    // let valueCheck = regexOnlyForNumberNCharacters(newValue);
    setOptions((prevState) =>
      prevState.map((item) => {
        return item.name === name ? { ...item, value: newValue } : item;
      })
    );
  };

  const allValuesNotEmpty = options.every((item) => item.value !== "");

  const addNewRow = () => {
    console.log("iam clicked");
    if (options.length > 1) {
      if (allValuesNotEmpty) {
        let lastIndex = options.length - 1;
        if (options[lastIndex].value != "") {
          const randomNumber = Math.floor(Math.random() * 100) + 1;
          let newOptions = { name: randomNumber, value: "" };
          setOptions([...options, newOptions]);
        }
      } else {
        setOpen({
          flag: true,
          message: t("Please-fill-options"),
        });
      }
    } else {
      setOpen({
        flag: true,
        message: t("Please-fill-options"),
      });
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

  const handleViewPollsUnPublished = () => {
    setSavedPolls(true);
  };

  const handleViewPollsPublished = () => {
    setSavePollsPublished(true);
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
    setMeetingDate(meetingDateValueFormat);
    setPollsData({
      ...pollsData,
      date: DateDate,
    });
  };

  useEffect(() => {
    let Data = {
      MeetingID: currentMeeting,
    };
    dispatch(GetAllMeetingUserApiFunc(Data, navigate, t));
  }, []);

  useEffect(() => {
    let pollMeetingData = NewMeetingreducer.getMeetingusers;
    if (pollMeetingData !== undefined && pollMeetingData !== null) {
      let newmembersArray = [];
      if (Object.keys(pollMeetingData).length > 0) {
        if (pollMeetingData.meetingOrganizers.length > 0) {
          pollMeetingData.meetingOrganizers.map(
            (MorganizerData, MorganizerIndex) => {
              let MeetingOrganizerData = {
                value: MorganizerData.userID,
                name: MorganizerData.userName,
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
                            src={`data:image/jpeg;base64,${MorganizerData.userProfilePicture.displayProfilePictureName}`}
                            height="16.45px"
                            width="18.32px"
                            draggable="false"
                            alt=""
                          />
                          <span className={styles["NameDropDown"]}>
                            {MorganizerData.userName}
                          </span>
                        </Col>
                      </Row>
                    </>
                  </>
                ),
                type: 1,
              };
              newmembersArray.push(MeetingOrganizerData);
            }
          );
        }
        if (pollMeetingData.meetingAgendaContributors.length > 0) {
          pollMeetingData.meetingAgendaContributors.map(
            (meetAgendaContributor, meetAgendaContributorIndex) => {
              let MeetingAgendaContributorData = {
                value: meetAgendaContributor.userID,
                name: meetAgendaContributor.userName,
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
                            src={`data:image/jpeg;base64,${meetAgendaContributor.userProfilePicture.displayProfilePictureName}`}
                            height="16.45px"
                            alt=""
                            width="18.32px"
                            draggable="false"
                          />
                          <span className={styles["NameDropDown"]}>
                            {meetAgendaContributor.userName}
                          </span>
                        </Col>
                      </Row>
                    </>
                  </>
                ),
                type: 2,
              };
              newmembersArray.push(MeetingAgendaContributorData);
            }
          );
        }
        if (pollMeetingData.meetingParticipants.length > 0) {
          pollMeetingData.meetingParticipants.map(
            (meetParticipants, meetParticipantsIndex) => {
              let MeetingParticipantsData = {
                value: meetParticipants.userID,
                name: meetParticipants.userName,
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
                            // src={GroupIcon}
                            src={`data:image/jpeg;base64,${meetParticipants.userProfilePicture.displayProfilePictureName}`}
                            height="16.45px"
                            width="18.32px"
                            alt=""
                            draggable="false"
                          />
                          <span className={styles["NameDropDown"]}>
                            {meetParticipants.userName}
                          </span>
                        </Col>
                      </Row>
                    </>
                  </>
                ),
                type: 3,
              };
              newmembersArray.push(MeetingParticipantsData);
            }
          );
        }
      }
      console.log(newmembersArray, "pollMeetingDatapollMeetingData");

      setmemberSelect(newmembersArray);
    } else {
      setmemberSelect([]);
    }
  }, [NewMeetingreducer.getMeetingusers]);

  // for selection of data
  const handleSelectValue = (value) => {
    setSelectedsearch(value);
  };

  const handleAddUsers = () => {
    let pollsData = NewMeetingreducer.getMeetingusers;
    console.log(pollsData, "pollsDatapollsData");
    let tem = [...members];
    let newarr = [];
    try {
      if (Object.keys(selectedsearch).length > 0) {
        try {
          selectedsearch.map((seledtedData, index) => {
            console.log(
              seledtedData,
              "seledtedDataseledtedDataseledtedDataseledtedData"
            );
            if (seledtedData.type === 1) {
              let check1 = pollsData.meetingOrganizers.find(
                (data, index) => data.userID === seledtedData.value
              );
              console.log(check1, "check1check1");
              if (check1 !== undefined) {
                console.log(check1, "check1check1");
                newarr.push(check1);
                console.log(newarr, "newarrnewarr");

                let meetingOrganizers = check1;
                console.log(meetingOrganizers, "check1check1");

                if (newarr.length > 0) {
                  newarr.map((morganizer, index) => {
                    console.log(morganizer, "UserIDUserID");
                    let check2 = newarr.find(
                      (data, index) => data.UserID === morganizer.userID
                    );
                    if (check2 !== undefined) {
                      console.log(check2, "check2check2");
                    } else {
                      let newUser = {
                        userName: morganizer.userName,
                        userID: morganizer.userID,
                        displayPicture:
                          morganizer.userProfilePicture
                            .displayProfilePictureName,
                      };
                      tem.push(newUser);
                      console.log(tem, "temtemtemtemtem");
                    }
                  });
                }
              }
            } else if (seledtedData.type === 2) {
              let check1 = pollsData.meetingAgendaContributors.find(
                (data, index) => data.userID === seledtedData.value
              );
              console.log(check1, "check1check1");
              if (check1 !== undefined) {
                console.log(check1, "check1check1");
                newarr.push(check1);
                console.log(newarr, "newarrnewarr");

                let meetingOrganizers = check1;
                console.log(meetingOrganizers, "check1check1");

                if (newarr.length > 0) {
                  newarr.map((morganizer, index) => {
                    console.log(morganizer, "UserIDUserID");
                    let check2 = newarr.find(
                      (data, index) => data.UserID === morganizer.userID
                    );
                    if (check2 !== undefined) {
                      console.log(check2, "check2check2");
                    } else {
                      let newUser = {
                        userName: morganizer.userName,
                        userID: morganizer.userID,
                        displayPicture:
                          morganizer.userProfilePicture
                            .displayProfilePictureName,
                      };
                      tem.push(newUser);
                      console.log(tem, "temtemtemtemtem");
                    }
                  });
                }
              }
            } else if (seledtedData.type === 3) {
              let check1 = pollsData.meetingParticipants.find(
                (data, index) => data.userID === seledtedData.value
              );
              if (check1 !== undefined) {
                newarr.push(check1);

                let meetingOrganizers = check1;

                if (newarr.length > 0) {
                  newarr.map((morganizer, index) => {
                    console.log(morganizer, "UserIDUserID");
                    let check2 = newarr.find(
                      (data, index) => data.UserID === morganizer.userID
                    );
                    if (check2 !== undefined) {
                      console.log(check2, "check2check2");
                    } else {
                      let newUser = {
                        userName: morganizer.userName,
                        userID: morganizer.userID,
                        displayPicture:
                          morganizer.userProfilePicture
                            .displayProfilePictureName,
                      };
                      tem.push(newUser);
                      console.log(tem, "temtemtemtemtem");
                    }
                  });
                }
              }
            } else {
            }
          });
        } catch {
          console.log("error in add");
        }
        console.log("members check", tem);
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

  //For Saving the polls

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

      await dispatch(SavePollsApi(navigate, data, t, 2, currentMeeting));
      setCreatepoll(false);
    } else {
      // setError(true);

      if (pollsData.Title === "") {
        setOpen({
          ...open,
          flag: true,
          message: t("Title-is-required"),
        });
      } else if (pollsData.date === "") {
        setOpen({
          ...open,
          flag: true,
          message: t("Select-date"),
        });
      } else if (Object.keys(members).length === 0) {
        setOpen({
          ...open,
          flag: true,
          message: t("Atleat-one-member-required"),
        });
      } else if (Object.keys(options).length <= 1) {
        setOpen({
          ...open,
          flag: true,
          message: t("Required-atleast-two-options"),
        });
      } else if (!allValuesNotEmpty) {
        setOpen({
          ...open,
          flag: true,
          message: t("Please-fill-all-open-option-fields"),
        });
      } else {
        setOpen({
          ...open,
          flag: true,
          message: t("Please-fill-all-reqired-fields"),
        });
      }
    }
  };

  useEffect(() => {
    if (
      PollsReducer.ResponseMessage !== "" &&
      PollsReducer.ResponseMessage !== t("Data-available") &&
      PollsReducer.ResponseMessage !== t("No-data-available") &&
      PollsReducer.ResponseMessage !== t("Record-found") &&
      PollsReducer.ResponseMessage !== t("No-record-found")
    ) {
      setOpen({
        ...open,
        flag: true,
        message: PollsReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
      }, 3000);
      dispatch(clearPollsMesseges());
    } else {
      dispatch(clearPollsMesseges());
    }
  }, [PollsReducer.ResponseMessage]);

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
                      labelClass={"d-none"}
                      name={"TitlePolls"}
                      maxLength={490}
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
                                        placeholder={`${"Option"}  ${parseInt(
                                          index + 1
                                        )}`}
                                        applyClass={"PollingCreateModal"}
                                        labelClass="d-none"
                                        name={data.name}
                                        maxLength={490}
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
                                          "Option" + " " + parseInt(index + 1)
                                        }
                                        applyClass={"PollingCreateModal"}
                                        labelClass="d-none"
                                        name={data.name}
                                        value={data.value}
                                        maxLength={490}
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
                                        iconClassName={
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
                                width="15.87px"
                                height="15.87px"
                                alt=""
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
                      minDate={moment().toDate()}
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
                      inputMode=""
                      calendar={calendarValue}
                      locale={localValue}
                      ref={calendRef}
                      onFocusedDateChange={(value) => changeDateStartHandler(value)}
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
                          isSearchable={true}
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
                            console.log(data, "membersmembersmembers");
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
                  // onClick={handleViewPollsUnPublished}
                />
                <Button
                  text={t("Save-and-published")}
                  className={styles["Save_Button_Meeting_Creat_Polls"]}
                  onClick={() => SavePollsButtonFunc(2)}

                  // onClick={handleViewPollsPublished}
                />
              </Col>
            </Row>
            <Notification
              setOpen={setOpen}
              open={open.flag}
              message={open.message}
            />

            {NewMeetingreducer.unsavedPollsMeeting && (
              <UnsavedPollsMeeting setCreatepoll={setCreatepoll} />
            )}
          </section>
        </>
      )}
    </>
  );
};

export default Createpolls;
