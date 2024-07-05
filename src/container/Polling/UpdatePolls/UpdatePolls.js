import React, { useEffect, useRef } from "react";
import { Checkbox, Modal, Notification } from "../../../components/elements";
import styles from "./UpdatePolls.module.css";
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
import EditIcon from "../../../assets/images/Edit-Icon.png";
import GroupIcon from "../../../assets/images/groupdropdown.svg";
import committeeicon from "../../../assets/images/committeedropdown.svg";
import { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import {
  setEditpollModal,
  updatePollsApi,
} from "../../../store/actions/Polls_actions";
import { useNavigate } from "react-router-dom";
import {
  multiDatePickerDateChangIntoUTC,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";
import { validateInput } from "../../../commen/functions/regex";
import DatePicker from "react-multi-date-picker";

const UpdatePolls = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  const animatedComponents = makeAnimated();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const { PollsReducer } = useSelector((state) => state);
  const datePickerRef = useRef();
  let dateFormat = "DD/MM/YYYY";
  const [polloptions, setPolloptions] = useState([]);
  const [selectedsearch, setSelectedsearch] = useState([]);
  const [dropdowndata, setDropdowndata] = useState([]);
  const [pollmembers, setPollmembers] = useState([]);

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [defineUnsaveModal, setDefineUnsaveModal] = useState(false);
  const [checkForPollStatus, setCheckForPollStatus] = useState(false);
  const [options, setOptions] = useState([]);

  const [UpdatePolls, setUpdatePolls] = useState({
    TypingTitle: "",
    AllowMultipleUser: false,
    date: "",
    pollID: 0,
  });

  useEffect(() => {
    if (currentLanguage !== undefined) {
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
                        className={styles["UserProfilepic"]}
                        width="18px"
                        height="18px"
                        alt=""
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

  useEffect(() => {
    if (PollsReducer.Allpolls != null && PollsReducer.Allpolls != undefined) {
      let pollsDetails = PollsReducer.Allpolls;
      if (Object.keys(PollsReducer.Allpolls).length > 0) {
        let members = [];
        PollsReducer.Allpolls.poll.pollParticipants.map((data, index) => {
          members.push(data);
        });
        setPollmembers(members);
        // let newDateGmt = convertintoGMTCalender(
        //   pollsDetails.poll.pollDetails.dueDate
        // );
        let DateDate = utcConvertintoGMT(
          pollsDetails.poll.pollDetails.dueDate.slice(0, 8) + "000000"
        );
        // let DateDate = new Date(newDateGmt);
        if (pollsDetails.poll.pollDetails.pollStatus.pollStatusId === 2) {
          setCheckForPollStatus(true);
        } else {
          setCheckForPollStatus(false);
        }
        setUpdatePolls({
          ...UpdatePolls,
          TypingTitle: pollsDetails.poll.pollDetails.pollTitle,
          AllowMultipleUser: pollsDetails.poll.pollDetails.allowMultipleAnswers,
          date: DateDate,
          pollID: pollsDetails.poll.pollDetails.pollID,
        });
        try {
          // if (Object.keys(PollsReducer.Allpolls.poll.pollOptions).length > 2) {
          let Option = [];
          PollsReducer.Allpolls.poll.pollOptions.map((data, index) => {
            let dataAdd = { name: index + 1, value: data.answer };
            Option.push(dataAdd);
          });
          setOptions(Option);
          // } else if (
          //   Object.keys(PollsReducer.Allpolls.poll.pollOptions).length <= 2
          // ) {
          //   const updatedOptions = options.map((option) => {
          //     const apiData = PollsReducer.Allpolls.poll.pollOptions.find(
          //       (apiOption, index) => index + 1 === option.name
          //     );
          //     return apiData ? { ...option, value: apiData.answer } : option;
          //   });
          //   setOptions(updatedOptions);
          // }
        } catch {}
      }
    }
  }, [PollsReducer.Allpolls]);

  const allValuesNotEmpty = options.every((item) => item.value !== "");

  const allValuesNotEmptyAcceptLastOne = options.every((item, index) => {
    if (index === options.length - 1) {
      return true; // Allow the last object's value to be empty
    }
    return item.value !== "";
  });

  // for add user for assignes
  const handleAddUsers = () => {
    let pollsData = PollsReducer.gellAllCommittesandGroups;
    let tem = [...pollmembers];
    if (Object.keys(selectedsearch).length > 0) {
      try {
        selectedsearch.map((seledtedData, index) => {
          if (seledtedData.type === 1) {
            let check1 = pollsData.groups.find(
              (data, index) => data.groupID === seledtedData.value
            );
            if (check1 != undefined) {
              let groupUsers = check1.groupUsers;
              if (Object.keys(groupUsers).length > 0) {
                groupUsers.map((gUser, index) => {
                  let check2 = pollmembers.find(
                    (data, index) => data.UserID === gUser.userID
                  );
                  if (check2 != undefined) {
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
                  let check2 = pollmembers.find(
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
            let check1 = pollmembers.find(
              (data, index) => data.UserID === seledtedData.value
            );
            if (check1 != undefined) {
            } else {
              let check2 = pollsData.organizationUsers.find(
                (data, index) => data.userID === seledtedData.value
              );
              if (check2 != undefined) {
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
      setPollmembers(result);
      setSelectedsearch([]);
    } else {
      // setopen notionation work here
    }
  };

  const addNewRow = () => {
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

  const cancellAnyUser = (index) => {
    let removeData = [...pollmembers];
    removeData.splice(index, 1);
    setPollmembers(removeData);
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

  const handleSelectValue = (value) => {
    setSelectedsearch(value);
  };

  const changeDateStartHandler = (date) => {
    let DateDate = new Date(date);
    setUpdatePolls({
      ...UpdatePolls,
      date: DateDate,
    });
  };

  const HandleCancelFunction = (index) => {
    let optionscross = [...options];
    optionscross.splice(index, 1);
    setOptions(optionscross);
  };

  const changeDateStartHandler2 = (date) => {
    let newDate = moment(date).format("DD MMMM YYYY");
    return newDate;
  };

  const HandlecancellButton = () => {
    setDefineUnsaveModal(true);
  };

  const HandleChangeUpdatePolls = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "TypingTitle") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
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
      AllowMultipleUser: !UpdatePolls.AllowMultipleUser, // Corrected property name
    });
  };
  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.openCalendar();
    }
  };
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

  const handleUpdateClick = (value) => {
    const organizationid = localStorage.getItem("organizationID");
    const createrid = localStorage.getItem("userID");
    let users = [];
    let optionsListData = [];
    if (
      UpdatePolls.TypingTitle !== "" &&
      UpdatePolls.datepoll !== "" &&
      Object.keys(pollmembers).length > 0 &&
      Object.keys(options).length >= 2 &&
      (checkForPollStatus || allValuesNotEmpty)
    ) {
      if (Object.keys(pollmembers).length > 0) {
        pollmembers.forEach((data, index) => {
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
          PollTitle: UpdatePolls.TypingTitle,
          DueDate: multiDatePickerDateChangIntoUTC(UpdatePolls.date),
          AllowMultipleAnswers: UpdatePolls.AllowMultipleUser,
          CreatorID: parseInt(createrid),
          PollStatusID: parseInt(value),
          OrganizationID: parseInt(organizationid),
          PollID: parseInt(UpdatePolls.pollID),
        },
        ParticipantIDs: users,
        PollAnswers: optionsListData,
      };

      dispatch(updatePollsApi(navigate, data, t));
    } else {
      setError(true);

      if (UpdatePolls.TypingTitle === "") {
        setOpen({
          ...open,
          flag: true,
          message: t("Title-is-required"),
        });
      } else if (UpdatePolls.datepoll === "") {
        setOpen({
          ...open,
          flag: true,
          message: t("Select-date"),
        });
      } else if (Object.keys(pollmembers).length === 0) {
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
          show={PollsReducer.editpollmodal}
          setShow={dispatch(setEditpollModal)}
          modalTitleClassName={styles["ModalHeader_Update_poll"]}
          modalHeaderClassName={
            styles["ModalRequestHeader_polling_update_modal"]
          }
          modalFooterClassName={"d-block"}
          onHide={() => {
            setDefineUnsaveModal(true);
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
                              alt=""
                              draggable="false"
                              onClick={handleIconClick}
                            />
                            <span
                              className={styles["Due_Date_heading"]}
                              onClick={handleIconClick}
                            >
                              {t("Due-date-on")}
                              {"* "}
                              <span className={styles["Date_update_poll"]}>
                                {changeDateStartHandler2(UpdatePolls.date)}
                              </span>
                            </span>
                            <DatePicker
                              highlightToday={true}
                              onOpenPickNewDate={true}
                              ref={datePickerRef}
                              render={<CustomIcon />}
                              onFocusedDateChange={(value) =>
                                changeDateStartHandler(
                                  value?.toDate?.().toString()
                                )
                              }
                              format={dateFormat}
                              value={UpdatePolls.date}
                              calendarPosition="bottom-center"
                              minDate={moment().toDate()}
                              className="datePickerTodoCreate2"
                              calendar={calendarValue}
                              onClick={handleIconClick}
                              locale={localValue}
                            />
                          </span>

                          {/* <MultiDatePickers
                            value={UpdatePolls.date}
                            name="MeetingDate"
                            highlightToday={false}
                            onOpenPickNewDate={false}
                            multiple={false}
                            calendar={calendarValue}
                            locale={localValue}
                            onChange={(value) =>
                              changeDateStartHandler(
                                value?.toDate?.().toString()
                              )
                            }
                          /> */}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p
                        className={
                          error && UpdatePolls.date === ""
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
                      className="d-flex justify-content-end"
                    >
                      <img
                        src={BlackCrossIcon}
                        className={
                          styles["Cross_Icon_Styling_Update_Poll_Modal"]
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
                  <Row className={styles["Overall_padding"]}>
                    <Col lg={12} md={12} sm={12}>
                      <Row className="d-flex">
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Update_Poll_Heading"]}>
                            {t("Update-poll")}
                          </span>
                        </Col>
                      </Row>
                      {PollsReducer.editPollModalFlag ? (
                        <Row className="mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={`${styles["BOx_for_yes"]} d-flex`}
                          >
                            <Row className="mt-2">
                              <Col lg={12} md={12} sm={12}>
                                {UpdatePolls.TypingTitle.length > 100 ? (
                                  // Add d-flex class and justify-content-center to center the text
                                  <div
                                    className={`${styles["scrollable-title"]} d-flex justify-content-center`}
                                  >
                                    <p>{UpdatePolls.TypingTitle}</p>
                                  </div>
                                ) : (
                                  <div
                                    className={`${styles["scrollable-title2"]} d-flex align-items-center`}
                                  >
                                    <p>{UpdatePolls.TypingTitle}</p>
                                  </div>
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      ) : (
                        <Row className="mt-2">
                          <Col lg={12} md={12} sm={12}>
                            <TextField
                              placeholder={t("Title") + "*"}
                              applyClass={"PollingCreateModal"}
                              labelClass="d-none"
                              name={"TypingTitle"}
                              maxLength={140}
                              value={UpdatePolls.TypingTitle}
                              change={HandleChangeUpdatePolls}
                            />
                          </Col>
                        </Row>
                      )}

                      <Row>
                        <Col>
                          <p
                            className={
                              error && UpdatePolls.TypingTitle === ""
                                ? ` ${styles["errorMessage-inLogin"]} `
                                : `${styles["errorMessage-inLogin_hidden"]}`
                            }
                          >
                            {t("Please-enter-title")}
                          </p>
                        </Col>
                      </Row>

                      {PollsReducer.editPollModalFlag ? (
                        <Row className="mt-2">
                          <Col
                            className={styles["scroll-height"]}
                            sm={12}
                            md={12}
                            lg={12}
                          >
                            {options.length > 0 &&
                              options.map((list, index) => {
                                return (
                                  <>
                                    {list.value != "" ? (
                                      <span
                                        key={index}
                                        className={`${styles["BOx_for_yes"]} d-flex`}
                                      >
                                        {list.value.length > 100 ? (
                                          <div
                                            className={`${styles["scrollable-title"]} d-flex justify-content-center `}
                                          >
                                            {list.value}
                                          </div>
                                        ) : (
                                          <div
                                            className={`${styles["scrollable-title2"]} d-flex align-items-center`}
                                          >
                                            {list.value}
                                          </div>
                                        )}
                                      </span>
                                    ) : null}
                                  </>
                                );
                              })}
                          </Col>
                        </Row>
                      ) : (
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={styles["Scroller_For_UpdatePollModal"]}
                          >
                            {options.length > 0
                              ? options.map((data, index) => {
                                  return (
                                    <>
                                      {index <= 1 ? (
                                        <>
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
                                                  applyClass={
                                                    "PollingCreateModal"
                                                  }
                                                  labelClass="d-none"
                                                  maxLength={100}
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
                                          <Row key={index} className="mt-2">
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="position-relative"
                                            >
                                              <TextField
                                                placeholder={
                                                  "Option" +
                                                  " " +
                                                  parseInt(index + 1) +
                                                  "*"
                                                }
                                                applyClass={
                                                  "PollingCreateModal"
                                                }
                                                labelClass="d-none"
                                                maxLength={100}
                                                name={data.name}
                                                value={data.value}
                                                change={(e) =>
                                                  HandleOptionChange(e)
                                                }
                                                inputicon={
                                                  <img
                                                    draggable="false"
                                                    src={WhiteCrossIcon}
                                                    width="31.76px"
                                                    height="31.76px"
                                                    alt=""
                                                    onClick={() =>
                                                      HandleCancelFunction(
                                                        index
                                                      )
                                                    }
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
                                            </Col>
                                          </Row>
                                        </>
                                      )}
                                    </>
                                  );
                                })
                              : null}
                            {PollsReducer.editPollModalFlag === false ? (
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
                                            <span>
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
                            ) : (
                              <></>
                            )}
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
                      )}
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
                            disabled={
                              PollsReducer.editPollModalFlag ? true : false
                            }
                          />
                          <p className={styles["CheckBoxTitle"]}>
                            {t("Allow-multiple-answers")}
                          </p>
                        </Col>
                      </Row>

                      {PollsReducer.editPollModalFlag === false ? (
                        <>
                          <Row>
                            {" "}
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="group-fields d-flex align-items-center gap-2 "
                            >
                              <Select
                                onChange={handleSelectValue}
                                value={selectedsearch}
                                classNamePrefix={"selectMember"}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                filterOption={customFilter}
                                options={dropdowndata}
                              />
                              <Button
                                text={t("ADD")}
                                className={styles["ADD_Btn_CreatePool_Modal"]}
                                onClick={handleAddUsers}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <p
                                className={
                                  error && pollmembers.length === 0
                                    ? ` ${styles["errorMessage-inLogin"]} `
                                    : `${styles["errorMessage-inLogin_hidden"]}`
                                }
                              >
                                {t("Select-atleast-one-participants")}
                              </p>
                            </Col>
                          </Row>
                        </>
                      ) : (
                        <></>
                      )}
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className={styles["Participant_heading"]}
                      >
                        {t("Participants")}
                      </Col>
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
                            {pollmembers.map((data, index) => {
                              console.log(
                                data.profilePicture,
                                "pollmemberspollmembers"
                              );
                              return (
                                <Col
                                  key={index}
                                  lg={6}
                                  md={6}
                                  sm={12}
                                  className="mt-2"
                                >
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
                                            src={`data:image/jpeg;base64,${data?.profilePicture?.displayProfilePictureName}`}
                                            width="33px"
                                            height="33px"
                                            className="rounded-circle"
                                            alt=""
                                            draggable="false"
                                          />
                                          <span
                                            className={styles["Name_cards"]}
                                          >
                                            {data.userName}
                                          </span>
                                        </Col>
                                        {PollsReducer.editPollModalFlag ===
                                        false ? (
                                          <Col sm={12} md={2} lg={2}>
                                            <img
                                              src={CrossIcon}
                                              width="14px"
                                              height="14px"
                                              onClick={cancellAnyUser}
                                              draggable="false"
                                              style={{ cursor: "pointer" }}
                                            />
                                          </Col>
                                        ) : (
                                          <></>
                                        )}
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
                          setDefineUnsaveModal(false);
                          dispatch(setEditpollModal(false));
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
                      className={styles["Overall_padding"]}
                    >
                      <Row className="mt-5">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-end gap-2 m-0 p-0"
                        >
                          <Button
                            text={t("Cancel")}
                            className={styles["Cancell_btn_class_Update_polls"]}
                            onClick={HandlecancellButton}
                          />
                          {checkForPollStatus ? (
                            <Button
                              text={t("Update")}
                              className={styles["Update_btn_class"]}
                              onClick={() => handleUpdateClick(2)}
                            />
                          ) : (
                            <>
                              <Button
                                text={t("Update")}
                                className={styles["Update_btn_class"]}
                                onClick={() => handleUpdateClick(1)}
                              />
                              <Button
                                text={t("Update-and-publish")}
                                className={styles["Update_Publish_btn_class"]}
                                onClick={() => handleUpdateClick(2)}
                              />
                            </>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              )}
            </>
          }
          size={defineUnsaveModal ? null : "md"}
        />
      </Container>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default UpdatePolls;
