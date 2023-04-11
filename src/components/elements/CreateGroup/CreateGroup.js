import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Newprofile from "../../../assets/images/newprofile.png";
import { Paper } from "@material-ui/core";
import userImage from "../../../assets/images/user.png";
import deleteButtonCreateMeeting from "../../../assets/images/cancel_meeting_icon.svg";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
  Notification,
  Loader
} from "./../../../components/elements";
import styles from "./CreateGroup.module.css";
import { useSelector, useDispatch } from "react-redux";
import { createGroup, getGroupMembersRoles, getOrganizationGroupTypes } from "../../../store/actions/Groups_actions";
import { render } from "@testing-library/react";
const CreateGroup = ({ setCreategrouppage }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    flag: false,
    message: ""
  })
  const { assignees, GroupsReducer } = useSelector((state) => state);
  console.log("GroupsReducerGroupsReducer", GroupsReducer)
  const dispatch = useDispatch()
  let createrID = JSON.parse(localStorage.getItem("userID"))
  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [attendees, setAttendees] = useState([])
  const [createGroupDetails, setCreateGroupDetails] = useState({
    Title: "",
    Description: "",
    isGroupChat: true,
    GroupTypeID: 0,
    GroupStatusID: 0,
    GroupMembers: []
  })
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupHeads, setGroupHeads] = useState([])
  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("");
  const participantOptions = [t("Group-head"), t("Regular")];
  const [groupTypeOptions, setGroupTypeOptions] = useState([])
  const [attendeeCheckbox, setAttendeeCheckbox] = useState([])
  const [participantRoles, setParticipantRoles] = useState([])
  const [groupTypeValue, setGroupTypeValue] = useState("")
  const [organizationGroupType, setOrganizationGroupType] = useState([])
  const [meetingAttendees, setMeetingAttendees] = useState([]);
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
    console.log("name id", name, id)
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



  // for attendies Role handler
  const assigntRoleAttendies = (e, value) => {
    setParticipantRoleName(value);
  };
  // Add Attendees Hanlder
  const handleAddAttendees = () => {
    let findUserisExist = groupMembers.length > 0 ? groupMembers.find((data, index) => data.data.pK_UID === taskAssignedTo) : null;
    console.log("findUserisExistfindUserisExist", findUserisExist)
    let findRoleID = participantOptionsWithIDs && participantOptionsWithIDs.find((data, index) => data.label === participantRoleName);
    let participantOptionsWithID = participantOptionsWithIDs && participantOptionsWithIDs.find((data, index) => data.label === participantRoleName)
    if (participantOptionsWithIDs !== undefined && participantOptionsWithIDs.length !== null) {
      if (attendees !== null && attendees !== undefined && attendees.length > 0) {
        if (participantOptionsWithID !== undefined) {
          attendees.map((dataID, index) => {
            meetingAttendees.push({
              FK_UID: dataID, //userid
              FK_GRMRID: participantOptionsWithID.id, //group member role id
              FK_GRID: 0 //group id
            })
            setMeetingAttendees([...meetingAttendees])
            meetingAttendeesList.map((data, index) => {
              console.log("meetingAttendeesmeetingAttendees", data)
              if (data.pK_UID === dataID) {
                console.log("meetingAttendeesmeetingAttendees", data)
                groupMembers.push({
                  data,
                  role: findRoleID.id,
                })
                setGroupMembers([...groupMembers])
              }

            })
            setCreateGroupDetails({
              ...createGroupDetails,
              GroupMembers: meetingAttendees
            })
            setAttendees([])
          })
        } else {
          setOpen({
            flag: true,
            message: "Please Select group member type also"
          })
        }
      }
      if (participantRoles.length > 0 && attendees.length === 0) {

        participantRoles.map((data, index) => {
          if (data.label === participantRoleName) {
            let newData = {
              FK_UID: taskAssignedTo, //userid
              FK_GRMRID: data.id, //group member role id
              FK_GRID: 0 //group id
            };
            meetingAttendees.push(newData);
            setMeetingAttendees([...meetingAttendees])
          }
          setCreateGroupDetails({
            ...createGroupDetails,
            GroupMembers: meetingAttendees
          })
        });
        if (meetingAttendeesList.length > 0) {
          meetingAttendeesList.map((data, index) => {
            if (data.pK_UID === taskAssignedTo) {
              groupMembers.push({
                data,
                role: findRoleID.id,
              })
              setGroupMembers([...groupMembers])
            }
          })
        }
      }
    }
    setTaskAssignedTo(0)
    setParticipantRoleName("")
    setTaskAssignedToInput("")
  }

  // Group type Change Handler
  const groupTypeChangeHandler = (e, value) => {
    setGroupTypeValue(value)
    console.log(e.target.name, value, "groupTypeChangeHandler")
    let findID = organizationGroupType.find((data, index) => data.label === value);
    console.log(findID, "findIDfindIDfindIDfindID")
    setCreateGroupDetails({
      ...createGroupDetails,
      GroupTypeID: findID.id
    })
  }

  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assignees.user).length > 0) {
        setMeetingAttendeesList(assignees.user);
      }
    } catch (error) {
    }
  }, [assignees.user]);

  // for api response of list group roles
  useEffect(() => {
    if (GroupsReducer.getOrganizationGroupRoles !== null && GroupsReducer.getOrganizationGroupRoles.length > 0) {
      let newArr = [];
      GroupsReducer.getOrganizationGroupRoles
        .map((data, index) => {
          newArr.push({
            label: data.role,
            id: data.groupRoleID
          })
        })
      setParticipantRoles([...newArr])
    }
  }, [GroupsReducer.getOrganizationGroupRoles])

  // for api response of list group Types
  useEffect(() => {
    if (GroupsReducer.getOrganizationGroupTypes !== null) {
      let newArr = [];
      let newArrGroupType = [];
      GroupsReducer.getOrganizationGroupTypes.map((data, index) => {
        newArr.push({
          label: data.type,
          id: data.groupTypeID
        })
        newArrGroupType.push(data.type)
      })
      setGroupTypeOptions([...newArrGroupType])
      setOrganizationGroupType([...newArr])
    }
  }, [GroupsReducer.getOrganizationGroupTypes])
  // set Meeting Attendees By default creator 
  useEffect(() => {
    if ((meetingAttendeesList !== null && meetingAttendeesList !== undefined) && meetingAttendeesList.length > 0) {
      meetingAttendeesList.map((data, index) => {
        if (data.pK_UID === createrID) {
          groupMembers.push({
            data,
            role: 2,
          })
          setGroupMembers([...groupMembers])
        }
      })

      let newData = {
        FK_UID: createrID, //userid
        FK_GRMRID: 2, //group member role id
        FK_GRID: 0 //group id
      };
      meetingAttendees.push(newData);
      setMeetingAttendees([...meetingAttendees])
      setCreateGroupDetails({
        ...createGroupDetails,
        GroupMembers: meetingAttendees
      })
    }
  }, [meetingAttendeesList])

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setTaskAssignedToInput(e.target.value.trimStart());
  };

  // onChange Function for set input values in state 
  const onChangeFunc = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(name, value, "onChangeFunconChangeFunconChangeFunc")
    if (name === "tasktitle") {
      setCreateGroupDetails({
        ...createGroupDetails,
        Title: value
      })
    }
    if (name === "groupdescription") {
      setCreateGroupDetails({
        ...createGroupDetails,
        Description: value
      })
    }
  }

  // onChange function for group chat 
  const CheckBoxHandler = (e) => {
    setCreateGroupDetails({
      ...createGroupDetails,
      isGroupChat: e.target.checked
    })
  }

  // remove member handler
  const removeMemberHandler = (id) => {
    console.log("id", id);
    let createGroupMembers = createGroupDetails.GroupMembers;
    let getGroupMemberIndex = groupMembers.findIndex((groupmemberdata, index) => groupmemberdata.data.pK_UID === id);
    let getIndexCreateGroupDetails = createGroupMembers.findIndex((data, index) => data.FK_UID === id)
    console.log(getGroupMemberIndex, "getGroupMemberIndexgetGroupMemberIndex")
    console.log(getIndexCreateGroupDetails, "getGroupMemberIndexgetGroupMemberIndex")
    groupMembers.splice(getGroupMemberIndex, 1)
    createGroupMembers.splice(getIndexCreateGroupDetails, 1)
    setGroupMembers([...groupMembers])
    setCreateGroupDetails({
      ...createGroupDetails,
      GroupMembers: createGroupMembers
    })
  }

  const handleSubmitCreateGroup = async () => {
    if(createGroupDetails.Title !== "" && createGroupDetails.Description !== "" && createGroupDetails.GroupTypeID !== 0) {
      let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
      let Data = {
        GroupDetails: {
          title: createGroupDetails.Title,
          Description: createGroupDetails.Description,
          FK_GRTID: createGroupDetails.GroupTypeID,
          FK_GRSID: 1,
          IsTalk: createGroupDetails.isGroupChat,
          OrganizationID: OrganizationID
        },
        GroupMembers: createGroupDetails.GroupMembers
      }
      dispatch(createGroup(Data, t, setCreategrouppage))
    } else {
      setOpen({
        flag: true,
        message: t("Please-fill-all-the-fields")
      })
    }
  
  }

  const checkAttendeeBox = (data, id, index) => {
    if (attendees.includes(id)) {
      let attendIndex = attendees.findIndex((data, index) => data === id)
      console.log("attendIndexattendIndexattendIndex", attendIndex)
      if (attendIndex !== -1) {
        attendees.splice(attendIndex, 1)
        setAttendees([...attendees])
      }
    } else {
      attendees.push(id)
      setAttendees([...attendees])
    }
  }

  useEffect(() => {
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let Data = {
      OrganizationID: organizationID
    }
    dispatch(getGroupMembersRoles(Data, t))
    dispatch(getOrganizationGroupTypes(Data, t))
  }, [])

  return (
    <>
      <Container className="MontserratSemiBold-600 color-5a5a5a">
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12} className="d-flex justify-content-start ">
            <span className={styles["Create-Group-Heading"]}>
              Create New Group
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
                          <span className={styles["details-class"]}>Details</span>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="CreateMeetingInput"
                        >
                          <TextField
                            applyClass="form-control2"
                            type="text"
                            placeholder={t("Task-title")}
                            required={true}
                            value={createGroupDetails.Title}
                            change={onChangeFunc}
                            name="tasktitle"
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
                            value={createGroupDetails.Description}
                            placeholder={t("Description")}
                            required={true}
                            change={onChangeFunc}
                            name="groupdescription"
                          // className={styles["Height-of-textarea"]
                          />
                        </Col>
                      </Row>

                      <Row className="mt-1">
                        <Col
                          lg={6}
                          md={6}
                          sm={6}
                          className="UpdateCheckbox  d-flex justify-content-start"
                        >
                          <Checkbox
                            className="SearchCheckbox MontserratSemiBold-600"
                            name="IsChat"
                            label={t("Create-talk-group")}
                            checked={createGroupDetails.isGroupChat}
                            onChange={CheckBoxHandler}
                            classNameDiv="checkboxParentClass"
                          ></Checkbox>
                        </Col>
                        <Col lg={2} md={2} sm={2}></Col>
                        <Col
                          lg={4}
                          md={4}
                          sm={4}
                          className="CreateMeetingReminder m-0 select-participant-box"
                        >
                          <SelectBox
                            name="grouptype"
                            placeholder={t("Group-type")}
                            option={groupTypeOptions}
                            change={groupTypeChangeHandler}
                            value={groupTypeValue}
                          // change={assigntRoleAttendies}
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
                                className={styles["Create-group-Head-Heading"]}
                              >
                                Group Head
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-2">

                            {groupMembers.length > 0 ? groupMembers.map((renderdata, index) => {
                              if (renderdata.role === 2) {
                                return (
                                  <Col lg={4} md={4} sm={4} className="mb-3">
                                    <Row>
                                      <Col lg={3} md={3} sm={12}>
                                        <img src={Newprofile} width={50} />
                                      </Col>
                                      <Col
                                        lg={7}
                                        md={7}
                                        sm={7}
                                        className={styles["group-head-info"]}
                                      >
                                        <Row className="mt-1">
                                          <Col lg={12} md={12} sm={12}>
                                            <span
                                              className={styles["name-create-group"]}
                                            >
                                              {renderdata.data.name}
                                            </span>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col lg={12} md={12} sm={12}>
                                            <span
                                              className={
                                                styles["Designation-create-group"]
                                              }
                                            >
                                              Designer
                                            </span>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col lg={12} md={12} sm={12}>
                                            <span
                                              className={styles["email-create-group"]}
                                            >
                                              <a>Waleed@gmail.com</a>
                                            </span>
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col lg={2} md={2} sm={2} className="d-flex align-items-center">
                                        {renderdata.data.pK_UID !== createrID ? <img src={deleteButtonCreateMeeting} className="cursor-pointer" width={20} height={20} onClick={() => removeMemberHandler(renderdata.data.pK_UID)} /> : null}

                                      </Col>
                                    </Row>
                                  </Col>
                                )
                              }
                            })
                              : "No Group Heads Found"}

                          </Row>
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["members-create-group-page"]}
                              >
                                Memebers
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            {groupMembers.length > 0 ? groupMembers.map((data, index) => {
                              if (data.role === 1) {
                                return (
                                  <Col lg={4} md={4} sm={4} className="mb-3">
                                    <Row>
                                      <Col lg={3} md={3} sm={12}>
                                        <img src={Newprofile} width={50} />
                                      </Col>
                                      <Col
                                        lg={7}
                                        md={7}
                                        sm={7}
                                        className={styles["group-head-info"]}
                                      >
                                        <Row className="mt-1">
                                          <Col lg={12} md={12} sm={12}>
                                            <span
                                              className={styles["name-create-group"]}
                                            >
                                              {data.data.name}
                                            </span>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col lg={12} md={12} sm={12}>
                                            <span
                                              className={
                                                styles["Designation-create-group"]
                                              }
                                            >
                                              Designer
                                            </span>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col lg={12} md={12} sm={12}>
                                            <span
                                              className={styles["email-create-group"]}
                                            >
                                              <a>Waleed@gmail.com</a>
                                            </span>
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col lg={2} md={2} sm={2} className="d-flex align-items-center">
                                        <img src={deleteButtonCreateMeeting} width={20} className="cursor-pointer" height={20} onClick={() => removeMemberHandler(data.data.pK_UID)} />
                                      </Col>
                                    </Row>
                                  </Col>
                                )
                              }
                            }) : null}


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
                                Add Members
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12} lg={12} sm={12}>
                              <InputSearchFilter
                                placeholder="Search member here"
                                value={taskAssignedToInput}
                                filteredDataHandler={searchFilterHandler(
                                  taskAssignedToInput
                                )}
                                change={onChangeSearch} />
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              lg={8}
                              md={8}
                              sm={8}
                              className="CreateMeetingReminder m-0 select-participant-box "
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
                              lg={4}
                              md={4}
                              sm={4}
                              className="mt-2 d-flex justify-content-end"
                            >
                              <Button
                                className={styles["ADD-Group-btn"]}
                                text="ADD"
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
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  {meetingAttendeesList.length > 0 ? meetingAttendeesList.map((attendeelist, index) => {
                                    return <Row className="d-flex gap-2 my-3">
                                      <Col lg={2} md={2} sm={12}>
                                        <img src={Newprofile} width={50} />
                                      </Col>

                                      <Col
                                        lg={7}
                                        md={7}
                                        sm={12}
                                        className={
                                          styles["group-head-info-Add-Members"]
                                        }
                                      >
                                        <Row className="mt-1">
                                          <Col lg={12} md={12} sm={12}>
                                            <span
                                              className={
                                                styles["name-create-group"]
                                              }
                                            >
                                              {attendeelist.name}
                                            </span>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col lg={12} md={12} sm={12}>
                                            <span
                                              className={
                                                styles["Designation-create-group"]
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
                                                styles["email-create-group"]
                                              }
                                            >
                                              <a>{attendeelist.emailAddress}</a>
                                            </span>
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col lg={2} md={2} sm={12} className="mt-2 ">
                                        <Checkbox
                                          // checked={false}
                                          checked={attendees.includes(attendeelist.pK_UID) ? true : false}
                                          classNameDiv=""
                                          onChange={() => checkAttendeeBox(attendeelist, attendeelist.pK_UID, index)}
                                          className={styles["RememberEmail"]}
                                        />
                                      </Col>
                                    </Row>
                                  }) : null}

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
                            className={styles["Cancell-CreateGroup-btn"]}
                            text="Cancel"
                            onClick={() => setCreategrouppage(false)}
                          />
                          <Button
                            className={styles["Create-CreateGroup-btn"]}
                            text="Create"
                            onClick={handleSubmitCreateGroup}
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
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />

      {GroupsReducer.Loading ? <Loader /> : assignees.Loading ? <Loader /> : null}
    </>
  );
};

export default CreateGroup;
