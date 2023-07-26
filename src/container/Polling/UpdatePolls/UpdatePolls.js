import React, { useEffect } from "react";
import {
  Checkbox,
  Modal,
  MultiDatePickers,
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
import GroupIcon from "../../../assets/images/groupdropdown.svg";
import committeeicon from "../../../assets/images/committeedropdown.svg";
import profilepic from "../../../assets/images/profiledropdown.svg";
import { useState } from "react";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditpollModal,
  updatePollsApi,
} from "../../../store/actions/Polls_actions";
import { useNavigate } from "react-router-dom";
import {
  convertintoGMTCalender,
  newDateFormaterAsPerUTC,
} from "../../../commen/functions/date_formater";

const UpdatePolls = () => {
  const animatedComponents = makeAnimated();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const { PollsReducer } = useSelector((state) => state);
  console.log(PollsReducer, "UPdateReducerUPdateReducerUPdateReducer");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const optionsNewUpdatePolls = [
    {
      value: "chocolateUpdatedPolls",
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-start align-items-center gap-2"
            >
              <img src={profile} />
              <span>SaifEnterprisesasasdasdasdasd</span>
            </Col>
          </Row>
        </>
      ),
    },
    { value: "VanillaUpdatedPolls", label: "chocolateUpdatedPolls" },
    { value: "zeroxUpdatedPolls", label: "chocolateUpdatedPolls" },
  ];

  const [updatepollsdetails, setUpdatepollsdetails] = useState();
  const [polloptions, setPolloptions] = useState([]);
  const [selectedsearch, setSelectedsearch] = useState([]);

  const [dropdowndata, setDropdowndata] = useState([]);
  const [pollmembers, setPollmembers] = useState([]);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  useEffect(() => {
    if (currentLanguage != undefined) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(arabic);
        setLocalValue(arabic_ar);
      }
    }
  }, [currentLanguage]);

  useEffect(() => {
    let pollsData = PollsReducer.gellAllCommittesandGroups;
    console.log(pollsData, "pollsDatapollsDatapollsDatapollsData");
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

  useEffect(() => {
    if (PollsReducer.Allpolls != null && PollsReducer.Allpolls != undefined) {
      if (Object.keys(PollsReducer.Allpolls).length > 0) {
        console.log(
          PollsReducer.Allpolls,
          "pollOptionspollOptionspollOptionspollOptions"
        );
        let Options = [];
        PollsReducer.Allpolls.poll.pollOptions.map((data, index) => {
          console.log(data, "datadatadatadata");
          Options.push(data);
        });
        setPolloptions(Options);
      }
    }
  }, [PollsReducer.Allpolls]);

  console.log(
    dropdowndata,
    "PollsReducerPollsReducer1212PollsReducerPollsReducer1212"
  );

  console.log(
    polloptions,
    "polloptionspolloptionspolloptionspolloptionspolloptions"
  );

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
                  let check2 = pollmembers.find(
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
      setPollmembers(result);
      setSelectedsearch([]);
    } else {
      // setopen notionation work here
    }
  };

  console.log(pollmembers, "pollmemberspollmemberspollmembers");

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const { t } = useTranslation();
  const [defineUnsaveModal, setDefineUnsaveModal] = useState(false);
  const [assignees, setAssignees] = useState("");

  // const [members, setMembers] = useState([
  //   {
  //     id: 1,
  //     name: "Saad Fudda",
  //   },
  //   {
  //     id: 2,
  //     name: "Salman Memon",
  //   },
  //   {
  //     id: 3,
  //     name: "Talha Qamar",
  //   },
  //   {
  //     id: 4,
  //     name: "Saif Rehman",
  //   },
  //   {
  //     id: 5,
  //     name: "Saif Rehman",
  //   },
  //   {
  //     id: 6,
  //     name: "Saif test1",
  //   },
  //   {
  //     id: 7,
  //     name: "Saif test2",
  //   },
  //   {
  //     id: 8,
  //     name: "Saif test3",
  //   },
  // ]);

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
    date: "",
    pollID: 0,
  });

  useEffect(() => {
    if (PollsReducer.Allpolls != null && PollsReducer.Allpolls != undefined) {
      let pollsDetails = PollsReducer.Allpolls;
      if (Object.keys(PollsReducer.Allpolls).length > 0) {
        console.log(
          PollsReducer.Allpolls.poll.pollParticipants,
          "PollsReducerPollsReducerPollsReducerPollsReducer"
        );
        let members = [];
        PollsReducer.Allpolls.poll.pollParticipants.map((data, index) => {
          console.log(data, "datadatadatadata");
          members.push(data);
        });
        setPollmembers(members);
        let newDateGmt = convertintoGMTCalender(
          pollsDetails.poll.pollDetails.dueDate
        );
        console.log(newDateGmt, "newDateGmt");

        setUpdatePolls({
          ...UpdatePolls,
          TypingTitle: pollsDetails.poll.pollDetails.pollTitle,
          AllowMultipleUser: pollsDetails.poll.pollDetails.allowMultipleAnswers,
          date: newDateGmt,
          pollID: pollsDetails.poll.pollDetails.pollID,
        });
        setOptions({
          ...options,
          pollOptions: pollsDetails.poll.pollOptions.answer,
        });
      }
    }
  }, [PollsReducer.Allpolls]);

  const addNewRow = () => {
    if (polloptions.length > 1) {
      let lastIndex = polloptions.length - 1;
      if (polloptions[lastIndex].value != "") {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        let newOptions = { name: randomNumber, value: "" };
        setPolloptions([...polloptions, newOptions]);
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

  const cancellAnyUser = (index) => {
    console.log("indexindexindex", index);
    let removeData = [...pollmembers];
    removeData.splice(index, 1);
    setPollmembers(removeData);
  };

  const HandleOptionChange = (e) => {
    let name = parseInt(e.target.name);
    let newValue = e.target.value;

    setPolloptions((prevState) =>
      prevState.map((item) => {
        console.log(item, "HandleOptionChange");
        return item.name === name ? { ...item, value: newValue } : item;
      })
    );
  };

  const handleSelectValue = (value) => {
    setSelectedsearch(value);
  };

  const changeDateStartHandler = (date) => {
    let newDate = moment(date).format("YYYYMMDD");
    console.log(date, "SavePollsButtonFunc");

    // let newDate = new DateObject(date).format("YYYYMMDD");
    console.log(newDate, "SavePollsButtonFunc");

    setUpdatePolls({
      ...UpdatePolls,
      date: newDate,
    });
    console.log(newDate, "changeDateStartHandler");
  };

  const HandleCancelFunction = (index) => {
    options.splice(index, 1);
    setOptions([...options]);
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
      AllowMultipleUsera: !UpdatePolls.AllowMultipleUsera,
    });
  };

  const handleUpdateClick = (value) => {
    const organizationid = localStorage.getItem("organizationID");
    const createrid = localStorage.getItem("userID");
    let users = [];
    let optionsListData = [];

    if (Object.keys(pollmembers).length > 0) {
      pollmembers.map((data, index) => {
        console.log(data, "datadatadatadatadata");
        users.push(data.userID);
      });
    }
    if (polloptions.length > 0) {
      polloptions.map((optionData, index) => {
        if (optionData.answer !== "") {
          optionsListData.push(optionData.answer);
        }
      });
    } else {
      setOpen({
        flag: true,
        message: t("Required-atleast-two-options"),
      });
    }

    let data = {
      PollDetails: {
        PollTitle: UpdatePolls.TypingTitle,
        DueDate: newDateFormaterAsPerUTC(UpdatePolls.date),
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
                              {changeDateStartHandler2(UpdatePolls.date)}
                            </span>
                          </span>
                          <MultiDatePickers
                            // onChange={meetingDateHandler}
                            value={UpdatePolls.date}
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
                      className="d-flex justify-content-end"
                    >
                      <img
                        src={BlackCrossIcon}
                        className={
                          styles["Cross_Icon_Styling_Update_Poll_Modal"]
                        }
                        width="16px"
                        height="16px"
                        onClick={() => {
                          dispatch(setEditpollModal(false));
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["Overall_padding"]}
                    >
                      <Row className="d-flex">
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Update_Poll_Heading"]}>
                            {t("Update-poll")}
                          </span>
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
                                disable={PollsReducer.editPollModalFlag}
                                value={UpdatePolls.TypingTitle}
                                change={HandleChangeUpdatePolls}
                              />
                            </Col>
                          </Row>

                          {polloptions.length > 0
                            ? polloptions.map((data, index) => {
                                console.log(
                                  data,
                                  "datadatadatadatadatadatadata"
                                );
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
                                                applyClass={
                                                  "PollingCreateModal"
                                                }
                                                labelClass="d-none"
                                                name={data.name}
                                                disable={
                                                  PollsReducer.editPollModalFlag
                                                }
                                                value={data.answer}
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
                                                applyClass={
                                                  "PollingCreateModal"
                                                }
                                                disable={
                                                  PollsReducer.editPollModalFlag
                                                }
                                                labelClass="d-none"
                                                name={data.name}
                                                value={data.answer}
                                                change={(e) =>
                                                  HandleOptionChange(e)
                                                }
                                                inputicon={
                                                  <img
                                                    src={BlackCrossIcon}
                                                    width="31.76px"
                                                    height="31.76px"
                                                    onClick={
                                                      HandleCancelFunction
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
                                      </>
                                    )}
                                  </>
                                );
                              })
                            : null}
                          {PollsReducer.editPollModalFlag === false ? (
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
                                      <span
                                        className={styles["Add_another_field"]}
                                      >
                                        {t("Add-another-field")}
                                      </span>
                                    </Col>
                                  </Row>
                                </span>
                              </Col>
                            </Row>
                          ) : (
                            <></>
                          )}
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
                            disable={PollsReducer.editPollModalFlag}
                          />
                          <p className={styles["CheckBoxTitle"]}>
                            {t("Allow-multiple-answers")}
                          </p>
                        </Col>
                      </Row>

                      {PollsReducer.editPollModalFlag === false ? (
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
                              // isDisabled={
                              //   PollsReducer.gellAllCommittesandGroups === null
                              //     ? true
                              //     : false
                              // }
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
                      ) : (
                        <></>
                      )}

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
                                        {PollsReducer.editPollModalFlag ===
                                        false ? (
                                          <Col sm={12} md={2} lg={2}>
                                            <img
                                              src={CrossIcon}
                                              width="14px"
                                              height="14px"
                                              onClick={cancellAnyUser}
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
    </>
  );
};

export default UpdatePolls;
