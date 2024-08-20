import React, { useEffect, useState } from "react";
import styles from "./EditPollsMeeting.module.css";
import gregorian from "react-date-object/calendars/gregorian";
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
import RedCross from "../../../../../../assets/images/CrossIcon.svg";
import UnsavedEditPollsMeeting from "./UnsavedEditPollsMeeting/UnsavedEditPollsMeeting";
import {
  CleareMessegeNewMeeting,
  showunsavedEditPollsMeetings,
} from "../../../../../../store/actions/NewMeetingActions";
import {
  convertGMTDateintoUTC,
  convertintoGMTCalender,
  multiDatePickerDateChangIntoUTC,
  resolutionResultTable,
  utcConvertintoGMT,
} from "../../../../../../commen/functions/date_formater";
import {
  clearPollsMesseges,
  updatePollsApi,
} from "../../../../../../store/actions/Polls_actions";

const EditPollsMeeting = ({ setEditPolls, currentMeeting }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const { NewMeetingreducer, PollsReducer, GroupsReducer } = useSelector(
    (state) => state
  );
  const [meetingDate, setMeetingDate] = useState("");
  const [error, setError] = useState(false);

  const [updatePolls, setupdatePolls] = useState({
    Title: "",
    AllowMultipleAnswers: false,
    date: "",
    PollID: 0,
  });
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();
  const [memberSelect, setmemberSelect] = useState([]);
  const [checkForPollStatus, setCheckForPollStatus] = useState(false);

  const [selectedsearch, setSelectedsearch] = useState([]);
  const [members, setMembers] = useState([]);

  const [options, setOptions] = useState([
    // {
    //   name: 1,
    //   value: "",
    // },
    // {
    //   name: 2,
    //   value: "",
    // },
    // {
    //   name: 3,
    //   value: "",
    // },
  ]);

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

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
        if (options[lastIndex].value !== "") {
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
    dispatch(showunsavedEditPollsMeetings(true));
  };

  const HandleChangeUpdatePolls = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "UpdatePollsTitle") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setupdatePolls({
          ...updatePolls,
          Title: valueCheck,
        });
      } else {
        setupdatePolls({
          ...updatePolls,
          Title: "",
        });
      }
    }
  };

  const HandleCheckMultipleAnswersUpdatePolls = () => {
    setupdatePolls({
      ...updatePolls,
      AllowMultipleAnswers: !updatePolls.AllowMultipleAnswers,
    });
  };

  const changeDateStartHandlerUpdatePolls = (date) => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let newDate = new Date(date);
    newDate.setHours(23, 59, 0, 0);
    setMeetingDate(meetingDateValueFormat);
    setupdatePolls({
      ...updatePolls,
      date: newDate,
    });
  };

  const handleSelectValue = (value) => {
    setSelectedsearch(value);
  };

  const handleAddUsers = () => {
    let getUserDetails = [...NewMeetingreducer.getMeetingusers];
    let tem = [...members];
    let newarr = [];
    try {
      if (Object.keys(selectedsearch).length > 0) {
        try {
          selectedsearch.forEach((seledtedData, index) => {
            let check1 = getUserDetails.find(
              (data, index) => data.pK_UID === seledtedData.value
            );

            if (check1 !== undefined) {
              newarr.push(check1);

              if (newarr.length > 0) {
                newarr.forEach((morganizer, index) => {
                  let check2 = newarr.find(
                    (data, index) => data.UserID === morganizer.pK_UID
                  );
                  if (check2 !== undefined) {
                  } else {
                    let newUser = {
                      userName: morganizer.userName,
                      userID: morganizer.pK_UID,
                      displayPicture:
                        morganizer.userProfilePicture.displayProfilePictureName,
                    };
                    tem.push(newUser);
                  }
                });
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

  const handleUpdateClick = (pollStatusValue) => {
    const organizationid = localStorage.getItem("organizationID");
    const createrid = localStorage.getItem("userID");
    let users = [];
    let optionsListData = [];
    if (
      updatePolls.Title !== "" &&
      updatePolls.date !== "" &&
      Object.keys(members).length > 0 &&
      Object.keys(options).length >= 2 &&
      (checkForPollStatus || allValuesNotEmpty)
    ) {
      if (Object.keys(members).length > 0) {
        members.forEach((data, index) => {
          users.push(data.userID);
        });
      }
      if (Object.keys(options).length > 0) {
        options.forEach((optionData, index) => {
          if (optionData.value !== "") {
            optionsListData.push(optionData.value);
          }
        });
      }
      let data = {
        PollDetails: {
          PollTitle: updatePolls.Title,
          DueDate: multiDatePickerDateChangIntoUTC(updatePolls.date),
          AllowMultipleAnswers: updatePolls.AllowMultipleAnswers,
          CreatorID: parseInt(createrid),
          PollStatusID: parseInt(pollStatusValue),
          OrganizationID: parseInt(organizationid),
          PollID: parseInt(updatePolls.PollID),
        },
        ParticipantIDs: users,
        PollAnswers: optionsListData,
      };

      dispatch(
        updatePollsApi(navigate, data, t, 2, setEditPolls, currentMeeting)
      );
    } else {
      setError(true);

      if (updatePolls.Title === "") {
        setOpen({
          ...open,
          flag: true,
          message: t("Title-is-required"),
        });
      } else if (updatePolls.date === "") {
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
      } else if (Object.keys(options).length <= 2) {
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
      GroupsReducer.getGroupByGroupIdResponse !== null &&
      GroupsReducer.getGroupByGroupIdResponse !== undefined
    ) {
      let newArr = [];
      let getUserDetails = GroupsReducer.getGroupByGroupIdResponse.groupMembers;
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
      setmemberSelect(newArr);
    }
  }, [GroupsReducer.getGroupByGroupIdResponse]);

  const customFilter = (options, searchText) => {
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    try {
      if (
        PollsReducer.Allpolls !== null &&
        PollsReducer.Allpolls !== undefined
      ) {
        let pollsDetailsData = PollsReducer.Allpolls.poll;
        let pollMembers = [];
        let newDateGmt = pollsDetailsData.pollDetails.dueDate;
        setupdatePolls({
          ...updatePolls,
          Title: pollsDetailsData.pollDetails.pollTitle,
          AllowMultipleAnswers:
            pollsDetailsData.pollDetails.allowMultipleAnswers,
          date: utcConvertintoGMT(newDateGmt, 1),
          PollID: pollsDetailsData.pollDetails.pollID,
        });

        let DateDate = utcConvertintoGMT(newDateGmt);
        setMeetingDate(DateDate);
        if (pollsDetailsData.pollDetails.pollStatus.pollStatusId === 2) {
          setCheckForPollStatus(true);
        } else {
          setCheckForPollStatus(false);
        }
        if (pollsDetailsData.pollParticipants.length > 0) {
          pollsDetailsData.pollParticipants.forEach((particpantData, index) => {
            pollMembers.push({
              userName: particpantData.userName,
              userID: particpantData.userID,
              displayPicture:
                particpantData.profilePicture.displayProfilePictureName,
              emailAddress: particpantData.emailAddress,
            });
          });
          setMembers(pollMembers);
        }
        try {
          // if (Object.keys(pollsDetailsData.pollOptions).length > 2) {
          let Option = [];
          pollsDetailsData.pollOptions.map((data, index) => {
            let dataAdd = { name: index + 1, value: data.answer };
            Option.push(dataAdd);
          });
          setOptions(Option);
          // } else if (Object.keys(pollsDetailsData.pollOptions).length <= 2) {
          //   const updatedOptions = options.map((option) => {
          //     const apiData = pollsDetailsData.pollOptions.find(
          //       (apiOption, index) => index + 1 === option.name
          //     );
          //     return apiData ? { ...option, value: apiData.answer } : option;
          //   });
          //   setOptions(updatedOptions);
          // }
        } catch {}
      }
    } catch {}
  }, [PollsReducer.Allpolls]);

  useEffect(() => {
    if (
      PollsReducer.ResponseMessage !== "" &&
      PollsReducer.ResponseMessage !== t("No-data-available") &&
      PollsReducer.ResponseMessage !== "" &&
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

  return (
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
                value={updatePolls.Title}
                name={"UpdatePollsTitle"}
                maxLength={140}
                change={HandleChangeUpdatePolls}
                disable={checkForPollStatus}
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
                                    "Option" + " " + parseInt(index + 1)
                                  }
                                  applyClass={"PollingCreateModal"}
                                  labelClass="d-none"
                                  name={data.name}
                                  disable={checkForPollStatus}
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
                                    "Option" + " " + parseInt(index + 1)
                                  }
                                  applyClass={"PollingCreateModal"}
                                  labelClass="d-none"
                                  name={data.name}
                                  disable={checkForPollStatus}
                                  value={data.value}
                                  maxLength={100}
                                  change={(e) => HandleOptionChange(e)}
                                  inputicon={
                                    checkForPollStatus ? null : (
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
                                    )
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
                disableBtn={checkForPollStatus}
                text={
                  <>
                    <Row className="mt-1">
                      <Col lg={12} md={12} sm={12} className="d-flex gap-2">
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
            <Col lg={6} md={6} sm={6} className="d-flex align-items-center">
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
                onFocusedDateChange={(value) =>
                  changeDateStartHandlerUpdatePolls(value)
                }
              />
            </Col>
            <Col lg={6} md={6} sm={6} className="d-flex justify-content-end">
              <Row className="mt-2">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex align-items-center gap-2"
                >
                  <Checkbox
                    onChange={HandleCheckMultipleAnswersUpdatePolls}
                    checked={updatePolls.AllowMultipleAnswers}
                    disabled={checkForPollStatus}
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
            <Col lg={12} md={12} sm={12} className={styles["MarginSection"]}>
              <Row className="mt-5">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="group-fields d-flex align-items-center gap-2"
                >
                  <Select
                    classNamePrefix={"Polls_Meeting"}
                    closeMenuOnSelect={false}
                    options={memberSelect}
                    components={animatedComponents}
                    filterOption={customFilter}
                    isMulti
                    value={selectedsearch}
                    onChange={handleSelectValue}
                    isSearchable={false}
                  />
                  <Button
                    text={t("ADD")}
                    className={styles["ADD_Btn_CreatePool_Modal"]}
                    disableBtn={checkForPollStatus}
                    onClick={handleAddUsers}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} className={styles["Scroller_Members"]}>
              <Row>
                {members.length > 0
                  ? members.map((data, index) => {
                      console.log("datadatadatamembers", data);
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
                                        draggable={false}
                                        src={`data:image/jpeg;base64,${data.displayPicture}`}
                                        height="33px"
                                        alt=""
                                        width="33px"
                                        className={styles["ProfileStyles"]}
                                      />
                                      <span className={styles["Name_Members"]}>
                                        {data.userName}
                                      </span>
                                    </Col>
                                    <Col
                                      lg={2}
                                      md={2}
                                      sm={2}
                                      className="d-flex align-items-center"
                                    >
                                      {checkForPollStatus ? null : (
                                        <img
                                          draggable={false}
                                          src={RedCross}
                                          height="14px"
                                          alt=""
                                          width="14px"
                                          className="cursor-pointer"
                                          onClick={() => RemoveMembers(index)}
                                        />
                                      )}
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
            text={t("Update")}
            className={styles["Save_Button_Meeting_Creat_Polls"]}
            onClick={() => handleUpdateClick(1)}
          />
          <Button
            text={t("Update-and-published")}
            className={styles["Save_Button_Meeting_Creat_Polls"]}
            onClick={() => handleUpdateClick(2)}
          />
        </Col>
      </Row>
      {NewMeetingreducer.unsavedEditPollsMeeting && (
        <UnsavedEditPollsMeeting setEditPolls={setEditPolls} />
      )}

      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </section>
  );
};

export default EditPollsMeeting;
