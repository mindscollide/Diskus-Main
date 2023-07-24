import React, { useEffect } from "react";
import {
  Checkbox,
  Modal,
  Loader,
  Notification,
  MultiDatePickers,
} from "../../../components/elements";
import { DateObject } from "react-multi-date-picker";

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
import GroupIcon from "../../../assets/images/groupdropdown.svg";
import committeeicon from "../../../assets/images/committeedropdown.svg";
import profilepic from "../../../assets/images/profiledropdown.svg";
import {
  SavePollsApi,
  getAllCommitteesandGroups,
  setCreatePollModal,
} from "../../../store/actions/Polls_actions";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import moment from "moment";
import { newDateFormaterAsPerUTC } from "../../../commen/functions/date_formater";
import { clearResponseMessage } from "../../../store/actions/Get_List_Of_Assignees";
import { clearMessagesGroup } from "../../../store/actions/Groups_actions";

const CreatePolling = () => {
  const animatedComponents = makeAnimated();
  //For Custom language datepicker
  const { PollsReducer } = useSelector((state) => state);
  console.log(PollsReducer, "PollsReducerPollsReducer");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const { t } = useTranslation();
  const [defineUnsaveModal, setDefineUnsaveModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [dropdowndata, setDropdowndata] = useState([]);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [selectedsearch, setSelectedsearch] = useState([]);
  const [createPollData, setcreatePollData] = useState({
    TypingTitle: "",
    InputSearch: "",
    date: "",
    AllowMultipleAnswers: true,
  });
  const [assignees, setAssignees] = useState("");
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
  useEffect(() => {
    dispatch(getAllCommitteesandGroups(navigate, t));
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
              label: (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      <img src={GroupIcon} height="16.45px" width="18.32px" />
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
                        src={profilepic}
                        className={styles["UserProfilepic"]}
                        width="18px"
                        height="18px"
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

  console.log(dropdowndata, "PollsReducerPollsReducer1212");
  // for selecgtion of data
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
          if (seledtedData.type === 1) {
            let check1 = pollsData.groups.find(
              (data, index) => data.groupID === seledtedData.value
            );
            if (check1 != undefined) {
              let groupUsers = check1.groupUsers;
              if (Object.keys(groupUsers).length > 0) {
                groupUsers.map((gUser, index) => {
                  let check2 = members.find(
                    (data, index) => data.UserID === gUser.userID
                  );
                  if (check2 != undefined) {
                  } else {
                    let newUser = {
                      userName: gUser.userName,
                      userID: gUser.userID,
                    };
                    tem.push(newUser);
                  }
                });
              }
            }
          } else if (seledtedData.type === 2) {
            console.log("members check");
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
              if (check2 != undefined) {
                let newUser = {
                  userName: check2.userName,
                  userID: check2.userID,
                };
                tem.push(newUser);
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
  };
  console.log(members, "checkcheckcheckcheck");

  const changeDateStartHandler = (date) => {
    let newDate = moment(date).format("YYYYMMDD");
    console.log(date, "SavePollsButtonFunc");

    // let newDate = new DateObject(date).format("YYYYMMDD");
    console.log(newDate, "SavePollsButtonFunc");

    setcreatePollData({
      ...createPollData,
      date: newDate,
    });
    console.log(newDate, "changeDateStartHandler");
  };
  const changeDateStartHandler2 = (date) => {
    let newDate = moment(date).format("DD MMMM YYYY");

    return newDate;
  };
  // for create polls
  const SavePollsButtonFunc = async (value) => {
    console.log(value, "SavePollsButtonFunc");

    const organizationid = localStorage.getItem("organizationID");
    const createrid = localStorage.getItem("userID");
    let users = [];
    let optionsListData = [];
    console.log(value, "SavePollsButtonFunc");
    console.log(options.length, "SavePollsButtonFunc");
    if (Object.keys(options).length >= 2) {
      console.log(value, "SavePollsButtonFunc");
      if (Object.keys(members).length > 0) {
        console.log(value, "SavePollsButtonFunc");
        members.map((userdata, index) => {
          users.push(userdata.userID);
        });
        console.log(value, "SavePollsButtonFunc");
        options.map((optionData, index) => {
          if (optionData.value != "") {
            optionsListData.push(optionData.value);
          } else if (index === 1) {
            return setOpen({
              flag: true,
              message: t("Required-atleast-two-options"),
            });
          }
        });
        if (createPollData.date != "") {
          console.log(createPollData.date, "SavePollsButtonFunc");
          let data = {
            PollDetails: {
              PollTitle: createPollData.TypingTitle,
              DueDate: newDateFormaterAsPerUTC(createPollData.date),
              AllowMultipleAnswers: createPollData.AllowMultipleAnswers,
              CreatorID: parseInt(createrid),
              PollStatusID: parseInt(value),
              OrganizationID: parseInt(organizationid),
            },
            ParticipantIDs: users,
            PollAnswers: optionsListData,
          };
          console.log(data, "SavePollsButtonFunc");
          await dispatch(SavePollsApi(navigate, data, t));
        } else {
          // setopen notfication for date
          setOpen({
            flag: true,
            message: t("Select-date"),
          });
        }
      } else {
        // setopen notfication for error no assigni assiened
        setOpen({
          flag: true,
          message: t("No-assignee-assigned"),
        });
      }
    } else {
      // console.log("Hellothereiamcoming");
      // setopen notfication for polls add atlese 2 option
    }
  };
  const HandleSearch = (e) => {
    if (e.target.value.trimStart() != "") {
      setAssignees(e.target.value.trimStart());
    } else {
      setAssignees("");
    }

    console.log(assignees, "assigneesassignees");
  };

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
    let optionscross = [...options];
    optionscross.splice(index, 1);
    setOptions(optionscross);
  };

  const cancellAnyUser = (index) => {
    console.log("indexindexindex", index);
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
            dispatch(setCreatePollModal(false));
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
                            {t("Due-date")}{" "}
                            {changeDateStartHandler2(createPollData.date)}
                          </span>
                          <MultiDatePickers
                            // onChange={meetingDateHandler}
                            value={createPollData.date}
                            name="MeetingDate"
                            check={true}
                            // value={meetingDate}
                            calendar={calendarValue}
                            locale={localValue}
                            onChange={(value) =>
                              changeDateStartHandler(
                                value?.toDate?.().toString()
                              )
                            }
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
                          dispatch(setCreatePollModal(false));
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
                                maxLength={500}
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
                                              maxLength={500}
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
                                                  onClick={() =>
                                                    HandleCancelFunction(index)
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
                            isMulti
                            options={dropdowndata}
                          />
                          <Button
                            text={t("ADD")}
                            className={styles["ADD_Btn_CreatePool_Modal"]}
                            onClick={handleAddUsers}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
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
                                            {data.userName}
                                          </span>
                                        </Col>
                                        <Col sm={12} md={2} lg={2}>
                                          <img
                                            src={CrossIcon}
                                            width="14px"
                                            height="14px"
                                            onClick={cancellAnyUser}
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
                            onClick={() => SavePollsButtonFunc(1)}
                          />
                          <Button
                            text={t("Save-and-publish")}
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
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
      {/* {PollsReducer.Loading ? <Loader /> : null} */}
    </>
  );
};

export default CreatePolling;
