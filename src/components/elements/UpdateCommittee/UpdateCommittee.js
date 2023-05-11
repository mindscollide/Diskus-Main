import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Newprofile from "../../../assets/images/newprofile.png";
import userImage from "../../../assets/images/user.png";
import { Paper } from "@material-ui/core";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
  Notification,
} from "./../../../components/elements";
import styles from "./UpdateCommittee.module.css";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import { useSelector, useDispatch } from "react-redux";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import {
  getCommitteeMembersRole,
  getCommitteeTypes,
  updateCommittee,
} from "../../../store/actions/Committee_actions";
const UpdateCommittee = ({ setUpdateComponentpage }) => {
  const { CommitteeReducer, assignees } = useSelector((state) => state);
  const dispatch = useDispatch();
  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [erorbar, setErrorBar] = useState(false);
  const [committeeTypesOptions, setCommitteeTypesOptions] = useState([]);
  const [committeeTypesValues, setCommitteeTypesValues] = useState([]);
  const [committeeMemberRolesOptions, setCommitteeMemberRolesOptions] =
    useState([]);
  const [committeeMemberRolesValues, setCommitteeMemberRolesValues] = useState(
    []
  );
  let creatorID = JSON.parse(localStorage.getItem("userID"));
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [participantRoleName, setParticipantRoleName] = useState("");
  const { t } = useTranslation();
  const [committeeData, setCommitteeData] = useState({
    committeeTitle: "",
    committeeDescription: "",
    isTalkGroup: false,
    committeeType: "",
    committeeStatus: 0,
    committeeID: 0,
    committeeTypeValue: null,
    CreatorID: 0,
  });

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const closebtn = async () => {
    setUpdateComponentpage(false);
  };
  const InputFielsChangeHandler = (event) => {
    console.log("eventeventevent", event);
    let name = event.target.name;
    let value = event.target.value;
    if (name === "committeeTitle") {
      setCommitteeData({
        ...committeeData,
        committeeTitle: value,
      });
    }
    if (name === "committeeDescription") {
      setCommitteeData({
        ...committeeData,
        committeeDescription: value,
      });
    }
  };

  // onChange function for group chat
  const CheckBoxHandler = (e) => {
    setCommitteeData({
      ...committeeData,
      isTalkGroup: e.target.checked,
    });
  };
  //Drop Down Values
  const searchFilterHandler = (value) => {
    let allAssignees = assignees.user;
    if (
      allAssignees != undefined &&
      allAssignees != null &&
      allAssignees != NaN &&
      allAssignees != []
    ) {
      return allAssignees
        .filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.name.toLowerCase();
          return (
            searchTerm &&
            assigneesName.startsWith(searchTerm) &&
            assigneesName !== searchTerm
          );
        })
        .slice(0, 3)
        .map((item) => (
          <div
            onClick={() => onSearch(item.name, item.pK_UID)}
            className="dropdown-row-assignee d-flex flex-row align-items-center"
            key={item.pK_UID}
          >
            <img src={userImage} />
            <p className="p-0 m-0">{item.name}</p>
          </div>
        ));
    } else {
    }
  };

  const onSearch = (name, id) => {
    setTaskAssignedToInput(name);
    setTaskAssignedTo(id);
    setTaskAssignedName(name);
  };

  // for attendies Role handler
  const assigntRoleAttendies = (e, value) => {
    setParticipantRoleName(value);
  };

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    if (e.target.value.trimStart() != "") {
      setTaskAssignedToInput(e.target.value.trimStart());
    } else {
      setTaskAssignedToInput("");
      setTaskAssignedTo(0);
      setTaskAssignedName("");
    }
  };

  const checkAttendeeBox = (data, id, index) => {
    if (attendees.includes(id)) {
      let attendIndex = attendees.findIndex((data, index) => data === id);
      if (attendIndex !== -1) {
        attendees.splice(attendIndex, 1);
        setAttendees([...attendees]);
      }
    } else {
      attendees.push(id);
      setAttendees([...attendees]);
    }
  };

  const changeCommitteeType = (e, value) => {
    let findID = committeeTypesOptions.find(
      (data, index) => data.label === value
    );
    console.log("findIDfindIDfindID", findID);
    setCommitteeData({
      ...committeeData,
      committeeType: findID.id,
      committeeTypeValue: findID.label,
    });
  };
  const removeMemberHandler = (id) => {
    let getGroupMemberIndex = groupMembers.findIndex(
      (groupmemberdata, index) => groupmemberdata.data.pK_UID === id
    );
    let getIndexCreateGroupDetails = membersData.findIndex(
      (data, index) => data.FK_UID === id
    );
    groupMembers.splice(getGroupMemberIndex, 1);
    membersData.splice(getIndexCreateGroupDetails, 1);
    setGroupMembers([...groupMembers]);
    setMembersData([...membersData]);
  };
  console.log("splicesplicesplice", groupMembers);
  console.log("splicesplicesplice", membersData);
  // add members in state
  const handleAddAttendees = () => {
    if (taskAssignedTo != 0 && attendees.length > 0) {
      setOpen({
        flag: true,
        message: t("You-can-add-data-only-from-one-form-option-at-a-time"),
      });
      setAttendees([]);
      setTaskAssignedTo(0);
      setParticipantRoleName("");
      setTaskAssignedToInput("");
    } else if (taskAssignedTo != 0) {
      var foundIndex = membersData.findIndex(
        (x) => x.FK_UID === taskAssignedTo
      );
      if (participantRoleName != "") {
        if (foundIndex === -1) {
          let roleID;
          let newDataForMembers = [];
          committeeMemberRolesOptions.map((data, index) => {
            if (data.label === participantRoleName) {
              roleID = data.id;
              newDataForMembers.push({
                FK_UID: taskAssignedTo, //userid
                FK_CMMRID: data.id, //group member role id
                FK_CMID: 0, //group id
              });
              setMembersData([...membersData, ...newDataForMembers]);
            }
          });
          if (meetingAttendeesList.length > 0) {
            meetingAttendeesList.map((data, index) => {
              if (data.pK_UID === taskAssignedTo) {
                groupMembers.push({
                  data,
                  role: roleID,
                });
                setGroupMembers([...groupMembers]);
              }
            });
          }
          setTaskAssignedTo(0);
          setParticipantRoleName("");
          setTaskAssignedToInput("");
        } else {
          setOpen({
            flag: true,
            message: t("User-already-exist"),
          });
          setTaskAssignedTo(0);
          setParticipantRoleName("");
          setTaskAssignedToInput("");
        }
      } else {
        setOpen({
          flag: true,
          message: t("Please-select-committee-member-type-also"),
        });
      }
    } else if (attendees.length > 0) {
      let check = false;
      let participantOptionsWithID =
        committeeMemberRolesOptions &&
        committeeMemberRolesOptions.find(
          (data, index) => data.label === participantRoleName
        );
      attendees.map((data, index) => {
        membersData.map((data2, index) => {
          console.log("found2found2found2", data, data2, data === data2.FK_UID);
          if (data === data2.FK_UID) {
            check = true;
          }
        });
      });
      if (check === true) {
        setOpen({
          flag: true,
          message: t("User-already-exist"),
        });
        setAttendees([]);
        setParticipantRoleName("");
      } else {
        if (participantOptionsWithID !== undefined) {
          let newDataForMembers = [];
          attendees.map((dataID, index) => {
            newDataForMembers.push({
              FK_UID: dataID, //userid
              FK_CMMRID: participantOptionsWithID.id, //group member role id
              FK_CMID: 0, //group id
            });
            setMembersData([...membersData, ...newDataForMembers]);
            meetingAttendeesList.map((data, index) => {
              if (data.pK_UID === dataID) {
                groupMembers.push({
                  data,
                  role: participantOptionsWithID.id,
                });
                setGroupMembers([...groupMembers]);
              }
            });
            setAttendees([]);
            setParticipantRoleName("");
          });
        } else {
          setOpen({
            flag: true,
            message: t("Please-select-committee-member-type-also"),
          });
        }
      }
    } else {
      setOpen({
        flag: true,
        message: t("Please-select-atleast-one-members"),
      });
    }
  };
  // for api response of list group roles
  useEffect(() => {
    if (CommitteeReducer.getCommitteeMembersRoles !== null) {
      let committeeMembersRoleValues = [];
      let committeeMembersRoleOptions = [];
      CommitteeReducer.getCommitteeMembersRoles.map((data, index) => {
        committeeMembersRoleOptions.push({
          label: data.role,
          id: data.committeeRoleID,
        });
        committeeMembersRoleValues.push(data.role);
      });
      setCommitteeMemberRolesOptions(committeeMembersRoleOptions);
      setCommitteeMemberRolesValues(committeeMembersRoleValues);
    }
  }, [CommitteeReducer.getCommitteeMembersRoles]);

  // for api response of list group Types
  useEffect(() => {
    if (CommitteeReducer.getCommitteeTypes !== null) {
      let committeeTypeValues = [];
      let committeeTypeOptions = [];
      CommitteeReducer.getCommitteeTypes.map((data, index) => {
        committeeTypeOptions.push({
          label: data.type,
          id: data.committeeTypeId,
        });
        committeeTypeValues.push(data.type);
      });
      setCommitteeTypesOptions(committeeTypeOptions);
      setCommitteeTypesValues(committeeTypeValues);
    }
  }, [CommitteeReducer.getCommitteeTypes]);

  const handleClickUpdate = () => {
    if (
      committeeData.committeeTitle !== "" &&
      committeeData.committeeDescription !== "" &&
      committeeData.committeeType !== 0 &&
      committeeData.CreatorID !== 0
    ) {
      setErrorBar(false);
      let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
      let Data = {
        CommitteeDetails: {
          CreatorID: committeeData.CreatorID,
          PK_CMID: committeeData.committeeID,
          CommitteesTitle: committeeData.committeeTitle,
          FK_CMSID: committeeData.committeeStatus,
          FK_CMTID: committeeData.committeeType,
          CommitteesDescription: committeeData.committeeDescription,
          ISTalkChatGroup: committeeData.isTalkGroup,
          OrganizationID: OrganizationID,
        },
        CommitteeMembers: membersData,
      };
      dispatch(updateCommittee(Data, t, setUpdateComponentpage));
    } else {
      setErrorBar(true);
      setOpen({
        flag: true,
        message: t("Please fill all the fields"),
      });
    }
  };

  // for api reponce of list of all assignees
  useEffect(() => {
    if (assignees.user.length > 0) {
      setMeetingAttendeesList(assignees.user);
    }
  }, [assignees.user]);

  // dispatch apis for committee types and committee member roles
  useEffect(() => {
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let Data = {
      OrganizationID: organizationID,
    };
    dispatch(allAssignessList(t));
    dispatch(getCommitteeTypes(Data, t));
    dispatch(getCommitteeMembersRole(Data, t));
  }, []);

  useEffect(() => {
    if (
      CommitteeReducer.getCommitteeByCommitteeID !== null &&
      CommitteeReducer.getCommitteeByCommitteeID !== undefined
    ) {
      let committeedetails = CommitteeReducer.getCommitteeByCommitteeID;
      console.log("taskAssignedTo23", committeedetails);

      let newArr = [];
      let newData = [];
      let committeeID = 0;
      if (committeedetails.committeMembers.length > 0) {
        committeedetails.committeMembers.map((memberData, index) => {
          committeeID = memberData.committeeID;
          console.log("taskAssignedTo23", meetingAttendeesList);
          if (meetingAttendeesList.length > 0) {
            console.log("taskAssignedTo23", meetingAttendeesList);

            meetingAttendeesList.map((data, index) => {
              console.log("taskAssignedTo23", data);

              if (data.pK_UID === memberData.pK_UID) {
                console.log(
                  "taskAssignedTo233",
                  data.pK_UID === memberData.pK_UID
                );
                newArr.push({
                  FK_UID: memberData.pK_UID,
                  FK_CMMRID: memberData.committeeRole.committeeRoleID,
                  FK_CMID: memberData.committeeID,
                });
                newData.push({
                  data,
                  role: memberData.committeeRole.committeeRoleID,
                });
                console.log("taskAssignedTo233", newData);
              }
            });
          }
        });
      }

      setMembersData(newArr);
      console.log("taskAssignedTo233", newData);

      setGroupMembers(newData);
      console.log("committeedetailscommitteedetails", committeedetails);

      setCommitteeData({
        ...committeeData,
        CreatorID: committeedetails.creatorID,
        committeeTitle: committeedetails.committeeTitle,
        committeeDescription: committeedetails.committeeDescription,
        isTalkGroup: committeedetails.isTalkChatGroup,
        committeeType: committeedetails.committeeType.committeeTypeId,
        committeeStatus: committeedetails.committeeStatus.committeeStatusID,
        committeeTypeValue: committeedetails.committeeType.type,
        committeeID: committeeID,
      });
    }
  }, [CommitteeReducer.getCommitteeByCommitteeID, meetingAttendeesList]);

  return (
    <>
      <section className="MontserratSemiBold-600 color-5a5a5a">
        <Row className="mt-3">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-start "
          >
            <span className={styles["Update-Committee-Heading"]}>
              {t("Update-committee")}
            </span>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg={12} md={12} sm={12}>
            <Paper className={styles["Update-Committee-paper"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Row>
                    <Col lg={8} md={8} sm={8}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={styles["details-class-Update-Committee"]}
                          >
                            {t(" Details")}
                          </span>
                        </Col>
                      </Row>

                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="create-committee-fields CreateMeetingInput"
                        >
                          <TextField
                            applyClass="form-control2"
                            type="text"
                            name="committeeTitle"
                            placeholder={t("Task-title")}
                            maxLength={300}
                            required={true}
                            change={InputFielsChangeHandler}
                            value={committeeData.committeeTitle}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar && committeeData.committeeTitle === ""
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }
                          >
                            {t("Committee-title-is-required")}
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="CreateMeetingInput "
                        >
                          <TextField
                            applyClass="text-area-create-group"
                            type="text"
                            as={"textarea"}
                            name="committeeDescription"
                            maxLength={500}
                            rows="4"
                            placeholder={t("Description")}
                            required={true}
                            change={InputFielsChangeHandler}
                            value={committeeData.committeeDescription}
                            // className={styles["Height-of-textarea"]
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar &&
                              committeeData.committeeDescription === ""
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }
                          >
                            {t("Committee-description-is-required")}
                          </p>
                        </Col>
                      </Row>

                      <Row className="mt-1">
                        <Col
                          lg={6}
                          md={6}
                          sm={6}
                          className={styles["CheckboxAlignment"]}
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="Update-committee-Checkbox"
                            >
                              <Checkbox
                                className="SearchCheckbox MontserratSemiBold-600"
                                name="IsChat"
                                label2={t("Create-talk-group")}
                                label2Class={styles["Label_Of_CheckBox"]}
                                checked={committeeData.isTalkGroup}
                                onChange={CheckBoxHandler}
                                classNameDiv="checkboxParentClass"
                              ></Checkbox>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={2} md={2} sm={2}></Col>
                        <Col
                          lg={4}
                          md={4}
                          sm={4}
                          className="committee-update-type-select-fields CreateMeetingReminder ml-0 select-participant-box"
                        >
                          <SelectBox
                            name="Participant"
                            placeholder={t("Committee Type")}
                            value={committeeData.committeeTypeValue || ""}
                            option={committeeTypesValues}
                            change={changeCommitteeType}
                          />
                        </Col>
                        <Row>
                          <Col className="d-flex justify-content-end">
                            <p
                              className={
                                erorbar &&
                                committeeData.committeeTypeValue === ""
                                  ? styles["errorMessage"]
                                  : styles["errorMessage_hidden"]
                              }
                            >
                              {t("Committee-type-is-required")}
                            </p>
                          </Col>
                        </Row>
                      </Row>
                      {/* this is members shown area on which the scroll will applied */}
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["scroll-bar-Update-Committee"]}
                        >
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Update-Committee-Head-Heading"]
                                }
                              >
                                {t("Executive-member")}
                              </span>
                            </Col>
                          </Row>

                          {/* Group Heads */}
                          <Row className="mt-2">
                            {groupMembers.length > 0 ? (
                              groupMembers.map((data, index) => {
                                if (data.role === 2) {
                                  return (
                                    <Col lg={4} md={4} sm={12}>
                                      <Row>
                                        <Col lg={3} md={3} sm={12}>
                                          <img src={Newprofile} width={50} />
                                        </Col>
                                        <Col
                                          lg={7}
                                          md={7}
                                          sm={12}
                                          className={
                                            styles["Executive-Member-info"]
                                          }
                                        >
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="mt-1"
                                            >
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "name-Update-Committee"
                                                      ]
                                                    }
                                                  >
                                                    {data.data.name}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "Designation-Update-Committee"
                                                      ]
                                                    }
                                                  >
                                                    Designer
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "email-Update-Committee"
                                                      ]
                                                    }
                                                  >
                                                    <a>Waleed@gmail.com</a>
                                                  </span>
                                                </Col>
                                              </Row>
                                            </Col>
                                          </Row>
                                        </Col>
                                        {data.data.pK_UID !=
                                        committeeData.CreatorID ? (
                                          <Col
                                            lg={2}
                                            md={2}
                                            sm={12}
                                            className="mt-0  d-flex justify-content-center"
                                          >
                                            {console.log(
                                              "datadatadatadatadata",
                                              data,
                                              data.data.pK_UID,
                                              committeeData.CreatorID
                                            )}
                                            <img
                                              src={CrossIcon}
                                              className="cursor-pointer"
                                              width={18}
                                              onClick={() =>
                                                removeMemberHandler(
                                                  data.data.pK_UID
                                                )
                                              }
                                            />
                                          </Col>
                                        ) : null}
                                      </Row>
                                    </Col>
                                  );
                                } else {
                                }
                              })
                            ) : (
                              <Col sm={12} md={12} lg={12}>
                                {t("No-member-selected")}
                              </Col>
                            )}
                          </Row>
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["members-Upadate-Committee-page"]
                                }
                              >
                                {t("Regular-members")}
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            {groupMembers.length > 0 ? (
                              groupMembers.map((data, index) => {
                                if (data.role === 1) {
                                  return (
                                    <Col lg={4} md={4} sm={4} className="mt-2">
                                      <Row>
                                        <Col lg={3} md={3} sm={12}>
                                          <img src={Newprofile} width={50} />
                                        </Col>
                                        <Col
                                          lg={7}
                                          md={7}
                                          sm={12}
                                          className={
                                            styles["Executive-Member-info"]
                                          }
                                        >
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="mt-1"
                                            >
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "name-Update-Committee"
                                                      ]
                                                    }
                                                  >
                                                    {data.data.name}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "Designation-Update-Committee"
                                                      ]
                                                    }
                                                  >
                                                    Designer
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "email-Update-Committee"
                                                      ]
                                                    }
                                                  >
                                                    <a>Waleed@gmail.com</a>
                                                  </span>
                                                </Col>
                                              </Row>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col
                                          lg={2}
                                          md={2}
                                          sm={12}
                                          className="mt-0  d-flex justify-content-center"
                                        >
                                          <img
                                            src={CrossIcon}
                                            width={18}
                                            className="cursor-pointer"
                                            onClick={() =>
                                              removeMemberHandler(
                                                data.data.pK_UID
                                              )
                                            }
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  );
                                } else {
                                }
                              })
                            ) : (
                              <Col sm={12} md={12} lg={12}>
                                {t("No-member-selected")}
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </Row>
                      {/* till this point the scroll will be applied  */}
                    </Col>
                    <Col lg={1} md={1} sm={1}></Col>
                    <Col lg={3} md={3} sm={3}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Addmembers-class-Update-Committee"]
                                }
                              >
                                {t("Add-members")}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              md={12}
                              lg={12}
                              sm={12}
                              className="create-committee-fields Update_committee_input_searchfield"
                            >
                              <InputSearchFilter
                                placeholder={t("Search-member-here")}
                                value={taskAssignedToInput}
                                filteredDataHandler={searchFilterHandler(
                                  taskAssignedToInput
                                )}
                                change={onChangeSearch}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-4">
                            <Col
                              lg={8}
                              md={8}
                              sm={8}
                              className="committee-select-fields CreateMeetingReminder"
                            >
                              <SelectBox
                                name="Participant"
                                placeholder={t("Type")}
                                option={committeeMemberRolesValues}
                                change={assigntRoleAttendies}
                                value={participantRoleName}
                              />
                            </Col>
                            <Col
                              lg={4}
                              md={4}
                              sm={4}
                              className=" d-flex justify-content-start  "
                            >
                              <Button
                                className={styles["ADD-Update-Committee-btn"]}
                                onClick={handleAddAttendees}
                                text={t(" ADD")}
                              />
                            </Col>
                          </Row>
                          {/* from this point add members are starting */}
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={
                                styles["scrollbar-addmember-Update-Committee"]
                              }
                            >
                              {meetingAttendeesList.length > 0
                                ? meetingAttendeesList.map((data, index) => {
                                    console.log(
                                      "meetingAttendeesListmeetingAttendeesList",
                                      data
                                    );
                                    return (
                                      <Row className="mt-4">
                                        <Col lg={12} md={12} sm={12}>
                                          <Row className="d-flex gap-2">
                                            <Col lg={2} md={2} sm={12}>
                                              <img
                                                src={Newprofile}
                                                width={50}
                                              />
                                            </Col>

                                            <Col
                                              lg={7}
                                              md={7}
                                              sm={12}
                                              className={
                                                styles[
                                                  "Update-Committee-head-info-Add-Members"
                                                ]
                                              }
                                            >
                                              <Row className="mt-1">
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "name-Update-Committee"
                                                      ]
                                                    }
                                                  >
                                                    {data?.name}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "Designation-Update-Committee"
                                                      ]
                                                    }
                                                  >
                                                    Designer
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "email-Update-Committee"
                                                      ]
                                                    }
                                                  >
                                                    <a>{data.emailAddress}</a>
                                                  </span>
                                                </Col>
                                              </Row>
                                            </Col>
                                            <Col
                                              lg={2}
                                              md={2}
                                              sm={12}
                                              className="mt-2 "
                                            >
                                              <Checkbox
                                                checked={
                                                  attendees.includes(
                                                    data.pK_UID
                                                  )
                                                    ? true
                                                    : false
                                                }
                                                classNameDiv=""
                                                onChange={() =>
                                                  checkAttendeeBox(
                                                    data,
                                                    data.pK_UID,
                                                    index
                                                  )
                                                }
                                                className={
                                                  styles["RememberEmail"]
                                                }
                                              />
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    );
                                  })
                                : null}
                            </Col>
                          </Row>
                          {/* at this point it is ending  */}
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-end gap-3 mt-4"
                        >
                          <Button
                            className={styles["Cancell-updatecommittee-btn"]}
                            text={t("Cancel")}
                            onClick={closebtn}
                          />
                          <Button
                            className={styles["Create-updatecommittee-btn"]}
                            text={t("Update")}
                            onClick={handleClickUpdate}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Paper>
          </Col>
        </Row>
      </section>
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </>
  );
};

export default UpdateCommittee;
