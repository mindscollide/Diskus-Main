import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Newprofile from "../../../assets/images/newprofile.png";
import { Paper } from "@material-ui/core";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
} from "./../../../components/elements";
import userImage from "../../../assets/images/user.png";
import styles from "./UpadateGroup.module.css";
import CrossIcon from "../../../assets/images/cancel_meeting_icon.svg";
import Groups from "../../../container/Groups/Groups";
import { useDispatch, useSelector } from "react-redux";
import {
  getGroupMembersRoles,
  getOrganizationGroupTypes,
  updateGroup,
} from "../../../store/actions/Groups_actions";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
const UpdateGroupPage = ({ setUpdateComponentpage }) => {
  const creatorID = JSON.parse(localStorage.getItem("userID"));
  const [viewUpdateGroup, setViewUpdateGroup] = useState(true);
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const { assignees, GroupsReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  let createrID = JSON.parse(localStorage.getItem("userID"));
  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [GroupDetails, setGroupDetails] = useState({
    Title: "",
    GroupID: 0,
    Description: "",
    isGroupChat: true,
    GroupTypeID: 0,
    GroupStatusID: 0,
  });
  console.log("GroupDetailsGroupDetails", GroupDetails);
  const [membersData, setMembersData] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("");
  const participantOptions = [t("Group-head"), t("Regular")];
  const [groupTypeOptions, setGroupTypeOptions] = useState([]);
  const [participantRoles, setParticipantRoles] = useState([]);
  const [groupTypeValue, setGroupTypeValue] = useState("");
  const [organizationGroupType, setOrganizationGroupType] = useState([]);
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

  // for Participant id's
  const participantOptionsWithIDs = [
    { label: t("Group Head"), id: 2 },
    { label: t("Regular"), id: 1 },
  ];
  // for meatings  Attendees

  const [meetingAttendees, setMeetingAttendees] = useState([]);

  // for attendies Role handler
  const assigntRoleAttendies = (e, value) => {
    setParticipantRoleName(value);
  };

  const handleAddAttendees = () => {
    let findRoleID =
      participantOptionsWithIDs &&
      participantOptionsWithIDs.find(
        (data, index) => data.label === participantRoleName
      );
    let participantOptionsWithID =
      participantOptionsWithIDs &&
      participantOptionsWithIDs.find(
        (data, index) => data.label === participantRoleName
      );
    let newDataForMembers = [];
    if (
      participantOptionsWithIDs !== undefined &&
      participantOptionsWithIDs.length !== null
    ) {
      if (
        attendees !== null &&
        attendees !== undefined &&
        attendees.length > 0
      ) {
        if (participantOptionsWithID !== undefined) {
          attendees.map((dataID, index) => {
            newDataForMembers.push({
              FK_UID: dataID, //userid
              FK_GRMRID: participantOptionsWithID.id, //group member role id
              FK_GRID: 0, //group id
            });
            setMembersData([...membersData, ...newDataForMembers]);
            meetingAttendeesList.map((data, index) => {
              if (data.pK_UID === dataID) {
                groupMembers.push({
                  data,
                  role: findRoleID.id,
                });
                setGroupMembers([...groupMembers]);
              }
            });
            setGroupDetails({
              ...GroupDetails,
              GroupMembers: [...meetingAttendees, newDataForMembers],
            });
            setAttendees([]);
          });
        } else {
          setOpen({
            flag: true,
            message: "Please Select group member type also",
          });
        }
      }
      if (participantRoles.length > 0 && attendees.length === 0) {
        participantRoles.map((data, index) => {
          if (data.label === participantRoleName) {
            let newData = {
              FK_UID: taskAssignedTo, //userid
              FK_GRMRID: data.id, //group member role id
              FK_GRID: 0, //group id
            };
            meetingAttendees.push(newData);
            setMeetingAttendees([...meetingAttendees]);
          }
          setGroupDetails({
            ...GroupDetails,
            GroupMembers: meetingAttendees,
          });
        });
        if (meetingAttendeesList.length > 0) {
          meetingAttendeesList.map((data, index) => {
            if (data.pK_UID === taskAssignedTo) {
              groupMembers.push({
                data,
                role: findRoleID.id,
              });
              setGroupMembers([...groupMembers]);
            }
          });
        }
      }
    }
    setTaskAssignedTo(0);
    setParticipantRoleName("");
    setTaskAssignedToInput("");
  };

  const groupTypeChangeHandler = (e, value) => {
    setGroupTypeValue(value);
    let findID = organizationGroupType.find(
      (data, index) => data.label === value
    );
    setGroupDetails({
      ...GroupDetails,
      GroupStatusID: findID.id,
    });
  };
  useEffect(() => {
    let UserID = JSON.parse(localStorage.getItem("userID"));
    dispatch(allAssignessList(parseInt(UserID), t));
  }, []);
  // for api reponce of list of all assignees
  useEffect(() => {
    if (assignees.user.length > 0) {
      setMeetingAttendeesList(assignees.user);
    }
  }, [assignees.user]);

  // for api response of list group roles
  useEffect(() => {
    if (
      GroupsReducer.getOrganizationGroupRoles !== null &&
      GroupsReducer.getOrganizationGroupRoles.length > 0
    ) {
      let newArr = [];
      GroupsReducer.getOrganizationGroupRoles.map((data, index) => {
        if (data.groupRoleID != 3) {
          newArr.push({
            label: data.role,
            id: data.groupRoleID,
          });
        }
      });
      setParticipantRoles([...newArr]);
    }
  }, [GroupsReducer.getOrganizationGroupRoles]);

  // for api response of list group Types
  useEffect(() => {
    if (GroupsReducer.getOrganizationGroupTypes !== null) {
      let newArr = [];
      let newArrGroupType = [];
      GroupsReducer.getOrganizationGroupTypes.map((data, index) => {
        newArr.push({
          label: data.type,
          id: data.groupTypeID,
        });
        newArrGroupType.push(data.type);
      });
      setGroupTypeOptions([...newArrGroupType]);
      setOrganizationGroupType([...newArr]);
    }
  }, [GroupsReducer.getOrganizationGroupTypes]);

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setTaskAssignedToInput(e.target.value.trimStart());
  };

  // onChange Function for set input values in state
  const onChangeFunc = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "tasktitle") {
      setGroupDetails({
        ...GroupDetails,
        Title: value,
      });
    }
    if (name === "groupdescription") {
      setGroupDetails({
        ...GroupDetails,
        Description: value,
      });
    }
  };

  // onChange function for group chat
  const CheckBoxHandler = (e) => {
    setGroupDetails({
      ...GroupDetails,
      isGroupChat: e.target.checked,
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

  const handleUpdateGroup = () => {
    let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
    let Data = {
      GroupDetails: {
        PK_GRID: GroupDetails.GroupID,
        title: GroupDetails.Title,
        Description: GroupDetails.Description,
        FK_GRTID: GroupDetails.GroupTypeID,
        FK_GRSID: GroupDetails.GroupStatusID,
        IsTalk: GroupDetails.isGroupChat,
        OrganizationID: OrganizationID,
      },
      GroupMembers: membersData,
    };
    dispatch(updateGroup(Data, t, setViewUpdateGroup));
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

  useEffect(() => {
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let Data = {
      OrganizationID: organizationID,
    };
    dispatch(getGroupMembersRoles(Data, t));
    dispatch(getOrganizationGroupTypes(Data, t));
  }, []);

  useEffect(() => {
    if (GroupsReducer.getGroupByGroupIdResponse !== null) {
      let groupDetails = GroupsReducer.getGroupByGroupIdResponse;
      console.log(groupDetails, "groupDetailsgroupDetailsgroupDetails");
      let newArr = [];
      let newData = [];
      if (groupDetails.groupMembers.length > 0) {
        groupDetails.groupMembers.map((memberData, index) => {
          newArr.push({
            FK_UID: memberData.pK_UID,
            FK_GRMRID: memberData.groupRole.groupRoleID,
            FK_GRID: memberData.groupID,
          });
          if (meetingAttendeesList.length > 0) {
            meetingAttendeesList.map((data, index) => {
              if (data.pK_UID === memberData.pK_UID) {
                return newData.push({
                  data,
                  role: memberData.groupRole.groupRoleID,
                });
              }
            });
          }
        });
      }
      setMembersData([...newArr]);
      setGroupMembers([...newData]);
      setGroupTypeValue(groupDetails.groupType.type);
      setGroupDetails({
        GroupID: groupDetails.groupID,
        Title: groupDetails.title,
        Description: groupDetails.description,
        isGroupChat: groupDetails.isTalk,
        GroupTypeID: groupDetails.groupType.groupTypeID,
        GroupStatusID: groupDetails.groupStatus.groupStatusID,
      });
    }
  }, [GroupsReducer.getGroupByGroupIdResponse, meetingAttendeesList]);
  return (
    <>
      {viewUpdateGroup ? (
        <>
          {" "}
          <Container className="MontserratSemiBold-600 color-5a5a5a">
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-start "
              >
                <span className={styles["Create-Group-Heading"]}>
                  {t("Update-group")}
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <Paper className={styles["Create-Group-paper"]}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <Row>
                        <Col lg={8} md={8} sm={8}>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["details-class"]}>
                                {t("Details")}
                              </span>
                            </Col>
                          </Row>

                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="group-fields CreateMeetingInput"
                            >
                              <TextField
                                applyClass="form-control2"
                                type="text"
                                placeholder={t("Task-title")}
                                required={true}
                                name="tasktitle"
                                change={onChangeFunc}
                                value={GroupDetails.Title}
                              />
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
                                rows="4"
                                name="groupdescription"
                                change={onChangeFunc}
                                placeholder={t("Description")}
                                required={true}
                                value={GroupDetails.Description}
                                // className={styles["Height-of-textarea"]
                              />
                            </Col>
                          </Row>

                          <Row className="mt-1">
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className={styles["Checkbox"]}
                            >
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="UpdateCheckbox"
                                >
                                  <Checkbox
                                    className="SearchCheckbox MontserratSemiBold-600"
                                    name="IsChat"
                                    label2Class={styles["Label_Of_CheckBox"]}
                                    label2={t("Create-talk-group")}
                                    // checked={createMeeting.IsChat}
                                    onChange={CheckBoxHandler}
                                    checked={GroupDetails.isGroupChat}
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
                              className="group-select-field m-0 select-participant-box"
                            >
                              <SelectBox
                                name="grouptype"
                                placeholder={t("Group-type")}
                                option={groupTypeOptions}
                                change={groupTypeChangeHandler}
                                value={groupTypeValue}
                              />
                            </Col>
                          </Row>
                          {/* this is members shown area on which the scroll will applied */}
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={styles["scroll-bar-creategroup"]}
                            >
                              <Row className="mt-1">
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={
                                      styles["Create-group-Head-Heading"]
                                    }
                                  >
                                    {t("Group-head")}
                                  </span>
                                </Col>
                              </Row>

                              {/* Group Heads */}
                              <Row className="mt-2">
                                {groupMembers.length > 0 ? (
                                  groupMembers.map((data, index) => {
                                    if (data.role === 2 || data.role === 3) {
                                      return (
                                        <Col lg={4} md={4} sm={12}>
                                          <Row>
                                            <Col lg={3} md={3} sm={12}>
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
                                                styles["group-head-info"]
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
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "name-create-group"
                                                          ]
                                                        }
                                                      >
                                                        {data.data.name}
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "Designation-create-group"
                                                          ]
                                                        }
                                                      >
                                                        Designer
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "email-create-group"
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
                                              {data.role != 3 ? (
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
                                              ) : null}
                                            </Col>
                                          </Row>
                                        </Col>
                                      );
                                    }
                                  })
                                ) : (
                                  <Col sm={12} md={12} lg={12}>
                                    {t("No-group-heads-found")}
                                  </Col>
                                )}
                              </Row>

                              <Row className="mt-3">
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={
                                      styles["members-create-group-page"]
                                    }
                                  >
                                    {t("Members")}
                                  </span>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                {groupMembers.length > 0 ? (
                                  groupMembers.map((data, index) => {
                                    if (data.role === 1) {
                                      return (
                                        <Col lg={4} md={4} sm={12}>
                                          <Row>
                                            <Col lg={3} md={3} sm={12}>
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
                                                styles["group-head-info"]
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
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "name-create-group"
                                                          ]
                                                        }
                                                      >
                                                        {data.data.name}
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "Designation-create-group"
                                                          ]
                                                        }
                                                      >
                                                        Designer
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "email-create-group"
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
                                    }
                                  })
                                ) : (
                                  <Col sm={12} md={12} lg={12}>
                                    {t("No-group-memebers-found")}
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
                                  <span className={styles["Addmembers-class"]}>
                                    {t("Add-Members")}
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  md={12}
                                  lg={12}
                                  sm={12}
                                  className="group-fields"
                                >
                                  <InputSearchFilter
                                    placeholder="Search member here"
                                    value={taskAssignedToInput}
                                    filteredDataHandler={searchFilterHandler(
                                      taskAssignedToInput
                                    )}
                                    change={onChangeSearch}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  lg={9}
                                  md={9}
                                  sm={9}
                                  className="group-select-field  m-0 select-participant-box"
                                >
                                  <SelectBox
                                    name="Participant"
                                    placeholder={t("Type")}
                                    option={participantOptions}
                                    value={participantRoleName}
                                    change={assigntRoleAttendies}
                                  />
                                </Col>
                                <Col
                                  lg={3}
                                  md={3}
                                  sm={3}
                                  className="mt-2 d-flex justify-content-start p-0 "
                                >
                                  <Button
                                    className={styles["ADD-Group-btn"]}
                                    text={t("Add")}
                                    onClick={handleAddAttendees}
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
                                    styles["scrollbar-addmember-creategroup"]
                                  }
                                >
                                  <Row className="mt-4">
                                    <Col lg={12} md={12} sm={12}>
                                      {meetingAttendeesList.length > 0
                                        ? meetingAttendeesList.map(
                                            (attendeelist, index) => {
                                              return (
                                                <Row className="d-flex gap-2 my-3">
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
                                                        "group-head-info-Add-Members"
                                                      ]
                                                    }
                                                  >
                                                    <Row className="mt-1">
                                                      <Col
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                      >
                                                        <span
                                                          className={
                                                            styles[
                                                              "name-create-group"
                                                            ]
                                                          }
                                                        >
                                                          {attendeelist.name}
                                                        </span>
                                                      </Col>
                                                    </Row>
                                                    <Row>
                                                      <Col
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                      >
                                                        <span
                                                          className={
                                                            styles[
                                                              "Designation-create-group"
                                                            ]
                                                          }
                                                        >
                                                          Designer
                                                        </span>
                                                      </Col>
                                                    </Row>
                                                    <Row>
                                                      <Col
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                      >
                                                        <span
                                                          className={
                                                            styles[
                                                              "email-create-group"
                                                            ]
                                                          }
                                                        >
                                                          <a>
                                                            {
                                                              attendeelist.emailAddress
                                                            }
                                                          </a>
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
                                                      // checked={false}
                                                      checked={
                                                        attendees.includes(
                                                          attendeelist.pK_UID
                                                        )
                                                          ? true
                                                          : false
                                                      }
                                                      classNameDiv=""
                                                      onChange={() =>
                                                        checkAttendeeBox(
                                                          attendeelist,
                                                          attendeelist.pK_UID,
                                                          index
                                                        )
                                                      }
                                                      className={
                                                        styles["RememberEmail"]
                                                      }
                                                    />
                                                  </Col>
                                                </Row>
                                              );
                                            }
                                          )
                                        : null}
                                    </Col>
                                  </Row>
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
                                className={styles["Cancell-UpgradeGroup-btn"]}
                                text={t("Cancel")}
                                onClick={() => setUpdateComponentpage(false)}
                              />
                              <Button
                                className={styles["Create-UpgradeGroup-btn"]}
                                text={t("Update")}
                                onClick={handleUpdateGroup}
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
          </Container>
        </>
      ) : (
        <Groups />
      )}
    </>
  );
};

export default UpdateGroupPage;
