import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
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
  Loader,
} from "./../../../components/elements";
import styles from "./CreateGroup.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  createGroup,
  getGroupMembersRoles,
  getOrganizationGroupTypes,
} from "../../../store/actions/Groups_actions";
import { render } from "@testing-library/react";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { useRef } from "react";
const CreateGroup = ({ setCreategrouppage }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const { assignees, GroupsReducer } = useSelector((state) => state);
  console.log("GroupsReducerGroupsReducer", GroupsReducer);
  const dispatch = useDispatch();
  let creatorID = JSON.parse(localStorage.getItem("userID"));
  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [erorbar, setErrorBar] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [createGroupDetails, setCreateGroupDetails] = useState({
    Title: "",
    Description: "",
    isGroupChat: true,
    GroupTypeID: 0,
    CreatorID: 0,
    GroupStatusID: 0,
    GroupMembers: [],
  });
  console.log("createGroupDetails", createGroupDetails);
  const GroupeTitle = useRef(null);
  const [groupMembers, setGroupMembers] = useState([]);
  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("");
  const participantOptions = [t("Head"), t("Regular")];
  const [groupTypeOptions, setGroupTypeOptions] = useState([]);
  const [participantRoles, setParticipantRoles] = useState([]);
  const [groupTypeValue, setGroupTypeValue] = useState("");
  const [organizationGroupType, setOrganizationGroupType] = useState([]);
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
  useEffect(() => {
    let UserID = JSON.parse(localStorage.getItem("userID"));
    dispatch(allAssignessList(t));
  }, []);

  const onSearch = (name, id) => {
    console.log("name id", name, id);
    setTaskAssignedToInput(name);
    setTaskAssignedTo(id);
    setTaskAssignedName(name);
  };
  console.log("name id", taskAssignedTo);

  // for Participant id's
  const participantOptionsWithIDs = [
    { label: t("Head"), id: 2 },
    { label: t("Regular"), id: 1 },
  ];
  // for meatings  Attendees

  // for attendies Role handler
  const assigntRoleAttendies = (e, value) => {
    console.log(value, "valuevaluevaluevalue");
    setParticipantRoleName(value);
  };
  // Add Attendees Hanlder
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
    } else if (participantRoleName === "") {
      setOpen({
        flag: true,
        message: t("Please-select-group-member-type-also"),
      });
    } else if (taskAssignedTo != 0) {
      var foundIndex = meetingAttendees.findIndex(
        (x) => x.FK_UID === taskAssignedTo
      );
      console.log("taskAssignedTo", foundIndex);
      if (foundIndex === -1) {
        let roleID;
        participantRoles.map((data, index) => {
          if (data.label === participantRoleName) {
            roleID = data.id;
            meetingAttendees.push({
              FK_UID: taskAssignedTo, //userid
              FK_GRMRID: data.id, //group member role id
              FK_GRID: 0, //group id
            });
            setMeetingAttendees([...meetingAttendees]);
          }
          setCreateGroupDetails({
            ...createGroupDetails,
            GroupMembers: meetingAttendees,
          });
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
        setAttendees([]);
      } else {
        setOpen({
          flag: true,
          message: t("User-already-exist"),
        });
        setTaskAssignedTo(0);
        setParticipantRoleName("");
        setTaskAssignedToInput("");
        setAttendees([]);
      }
    } else if (attendees.length > 0) {
      let check = false;
      let participantOptionsWithID =
        participantOptionsWithIDs &&
        participantOptionsWithIDs.find(
          (data, index) => data.label === participantRoleName
        );
      console.log("found2found2found2", attendees);
      groupMembers.map((data, index) => {
        attendees.map((data2, index) => {
          console.log(
            "found2found2found2",
            data,
            data2,
            data.data.pK_UID,
            data2.FK_UID
          );
          if (data.data.pK_UID === data2) {
            check = true;
          }
        });
      });
      if (check === true) {
        console.log("found2found2found2");

        setOpen({
          flag: true,
          message: t("User-already-exist"),
        });
        setAttendees([]);
        setTaskAssignedTo(0);
        setParticipantRoleName("");
        setTaskAssignedToInput("");
      } else {
        if (participantOptionsWithID !== undefined) {
          attendees.map((dataID, index) => {
            meetingAttendees.push({
              FK_UID: dataID, //userid
              FK_GRMRID: participantOptionsWithID.id, //group member role id
              FK_GRID: 0, //group id
            });
            setMeetingAttendees([...meetingAttendees]);
            meetingAttendeesList.map((data, index) => {
              console.log("meetingAttendeesmeetingAttendees", data);
              if (data.pK_UID === dataID) {
                console.log("meetingAttendeesmeetingAttendees", data);
                groupMembers.push({
                  data,
                  role: participantOptionsWithID.id,
                });
                setGroupMembers([...groupMembers]);
              }
            });
            setCreateGroupDetails({
              ...createGroupDetails,
              GroupMembers: meetingAttendees,
            });
            setAttendees([]);
            setParticipantRoleName("");
          });
        } else {
          setOpen({
            flag: true,
            message: t("Please-select-group-member-type-also"),
          });
          setTaskAssignedTo(0);
          setParticipantRoleName("");
          setTaskAssignedToInput("");
          setAttendees([]);
        }
      }
    } else {
      setOpen({
        flag: true,
        message: t("Please-select-atleast-one-members"),
      });
      setTaskAssignedTo(0);
      setParticipantRoleName("");
      setTaskAssignedToInput("");
      setAttendees([]);
    }
  };

  // Group type Change Handler
  const groupTypeChangeHandler = (e, value) => {
    setGroupTypeValue(value);
    console.log(e.target.name, value, "groupTypeChangeHandler");
    let findID = organizationGroupType.find(
      (data, index) => data.label === value
    );
    console.log(findID, "findIDfindIDfindIDfindID");
    setCreateGroupDetails({
      ...createGroupDetails,
      GroupTypeID: findID.id,
    });
  };

  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assignees.user).length > 0) {
        setMeetingAttendeesList(assignees.user);
      }
    } catch (error) { }
  }, [assignees.user]);

  // for api response of list group roles
  useEffect(() => {
    if (
      GroupsReducer.getOrganizationGroupRoles !== null &&
      GroupsReducer.getOrganizationGroupRoles.length > 0
    ) {
      let newArr = [];
      GroupsReducer.getOrganizationGroupRoles.map((data, index) => {
        // if (data.groupRoleID != 3) {
        newArr.push({
          label: data.role,
          id: data.groupRoleID,
        });
        // }
      });
      console.log(
        "GroupsReducer.getOrganizationGroupRoles",
        GroupsReducer.getOrganizationGroupRoles
      );
      setParticipantRoles([...newArr]);
    }
  }, [GroupsReducer.getOrganizationGroupRoles]);

  // for api response of list group Types
  useEffect(() => {
    if (GroupsReducer.getOrganizationGroupTypes !== null) {
      let newArr = [];
      let newArrGroupType = [];
      GroupsReducer.getOrganizationGroupTypes.map((data, index) => {
        console.log("datadatagetOrganizationGroupTypes", data);
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
  // set Meeting Attendees By default creator
  useEffect(() => {
    if (
      meetingAttendeesList !== null &&
      meetingAttendeesList !== undefined &&
      meetingAttendeesList.length > 0
    ) {
      let newList = [];
      let newList2 = [];
      meetingAttendeesList.map((data, index) => {
        if (data.pK_UID === creatorID) {
          console.log("groupMembers", groupMembers);
          if (Object.keys(groupMembers).length > 0) {
            console.log("groupMembers", groupMembers);

            groupMembers.map((datacheck, i) => {
              if (datacheck.data.pK_UID === creatorID) {
                console.log("groupMembers", groupMembers);
              } else {
                console.log("groupMembers", groupMembers);
                newList.push({
                  data,
                  role: 2,
                });
              }
            });
          } else {
            console.log("groupMembers", groupMembers);

            newList.push({
              data,
              role: 2,
            });
          }
          if (Object.keys(newList).length > 0) {
            console.log("groupMembers", groupMembers);

            setGroupMembers(newList);
          }
        }
      });
      if (newList.length > 0) {
        let newData = {
          FK_UID: creatorID, //userid
          FK_GRMRID: 2, //group member role id
          FK_GRID: 0, //group id
        };
        newList2.push(newData);
        setMeetingAttendees(newList2);
        setCreateGroupDetails({
          ...createGroupDetails,
          CreatorID: creatorID,
          GroupMembers: newList2,
        });
      }
    }
  }, [meetingAttendeesList]);

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    if (e.target.value.trimStart() != "") {
      setTaskAssignedToInput(e.target.value.trimStart());
    } else {
      setTaskAssignedToInput("");
      setTaskAssignedTo(0);
      setTaskAssignedName("");
    }
    console.log("setTaskAssignedToInput", e.target.value.trimStart());
  };

  // onChange Function for set input values in state
  const onChangeFunc = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(name, value, "onChangeFunconChangeFunconChangeFunc");
    if (name === "tasktitle") {
      setCreateGroupDetails({
        ...createGroupDetails,
        Title: value,
      });
    }
    if (name === "groupdescription") {
      setCreateGroupDetails({
        ...createGroupDetails,
        Description: value,
      });
    }
  };

  // onChange function for group chat
  const CheckBoxHandler = (e) => {
    setCreateGroupDetails({
      ...createGroupDetails,
      isGroupChat: e.target.checked,
    });
  };

  useEffect(() => {
    GroupeTitle.current.focus();
  }, []);

  // remove member handler
  const removeMemberHandler = (id) => {
    console.log("id", id);
    let createGroupMembers = createGroupDetails.GroupMembers;
    let getGroupMemberIndex = groupMembers.findIndex(
      (groupmemberdata, index) => groupmemberdata.data.pK_UID === id
    );
    let getIndexCreateGroupDetails = createGroupMembers.findIndex(
      (data, index) => data.FK_UID === id
    );
    groupMembers.splice(getGroupMemberIndex, 1);
    createGroupMembers.splice(getIndexCreateGroupDetails, 1);
    setGroupMembers([...groupMembers]);
    setCreateGroupDetails({
      ...createGroupDetails,
      GroupMembers: createGroupMembers,
    });
  };
  console.log("found2found2found2", createGroupDetails.GroupMembers);
  console.log("found2found2found2", groupMembers);
  console.log("found2found2found2", attendees);
  const handleSubmitCreateGroup = async () => {
    if (
      createGroupDetails.Title !== "" &&
      createGroupDetails.Description !== "" &&
      createGroupDetails.GroupTypeID !== 0 &&
      createGroupDetails.CreatorID !== 0
    ) {
      setErrorBar(false);
      let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
      let Data = {
        GroupDetails: {
          CreatorID: createGroupDetails.CreatorID,
          title: createGroupDetails.Title,
          Description: createGroupDetails.Description,
          FK_GRTID: createGroupDetails.GroupTypeID,
          FK_GRSID: 1,
          IsTalk: createGroupDetails.isGroupChat,
          OrganizationID: OrganizationID,
        },
        GroupMembers: createGroupDetails.GroupMembers,
      };
      dispatch(createGroup(Data, t, setCreategrouppage));
    } else {
      setErrorBar(true);
      setOpen({
        flag: true,
        message: t("Please-fill-all-the-fields"),
      });
    }
  };

  const checkAttendeeBox = (data, id, index) => {
    console.log("found2found2found2", attendees);

    if (attendees.includes(id)) {
      let attendIndex = attendees.findIndex((data, index) => data === id);
      console.log("found2found2found2", attendIndex);
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
            <span className={styles["Create-Group-Heading"]}>
              {t("Create-new-group")}
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
                      <Row className="mt-3">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="Group_input_field Create_group_Title_filed_margin"
                        >
                          <Form.Control
                            applyClass="form-control2"
                            ref={GroupeTitle}
                            // className="Focuson"
                            type="text"
                            maxLength={300}
                            placeholder={t("Group-title")}
                            required={true}
                            value={createGroupDetails.Title}
                            onChange={onChangeFunc}
                            name="tasktitle"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar && createGroupDetails.Title === ""
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }
                          >
                            {t("Group-title-is-required")}
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
                            rows="4"
                            value={createGroupDetails.Description}
                            maxLength={500}
                            placeholder={t("Description")}
                            required={true}
                            change={onChangeFunc}
                            name="groupdescription"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar && createGroupDetails.Description === ""
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }
                          >
                            {t("Group-description-is-required")}
                          </p>
                        </Col>
                      </Row>
                      <Row className="mt-1">
                        <Col
                          lg={6}
                          md={6}
                          sm={6}
                          className={styles["CheckBoxalign"]}
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
                                checked={createGroupDetails.isGroupChat}
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
                          className="group-type-select-field m-0 CreateMeetingReminder "
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
                        <Row>
                          <Col
                            className={styles["create-grouperror-type-heading"]}
                          >
                            <p
                              className={
                                erorbar && groupTypeValue === ""
                                  ? styles["errorMessage"]
                                  : styles["errorMessage_hidden"]
                              }
                            >
                              {t("Group-type-is-required")}
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
                          className={styles["scroll-bar-creategroup"]}
                        >
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["Create-group-Head-Heading"]}
                              >
                                {t("Group-head")}
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            {groupMembers.length > 0 ? (
                              groupMembers.map((renderdata, index) => {
                                if (
                                  renderdata.role === 2 ||
                                  renderdata.role === creatorID
                                ) {
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
                                                className={
                                                  styles["name-create-group"]
                                                }
                                              >
                                                {renderdata.data.name}
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
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
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles["email-create-group"]
                                                }
                                              >
                                                <a>
                                                  {" "}
                                                  {renderdata.data.emailAddress}
                                                </a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col
                                          lg={2}
                                          md={2}
                                          sm={2}
                                          className="d-flex align-items-center"
                                        >
                                          {renderdata.data.pK_UID !=
                                            creatorID ? (
                                            <img
                                              src={deleteButtonCreateMeeting}
                                              className="cursor-pointer"
                                              width={20}
                                              height={20}
                                              onClick={() =>
                                                removeMemberHandler(
                                                  renderdata.data.pK_UID
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
                              <>
                                <Col sm={12} md={12} lg={12}>
                                  {t("No-group-heads-found")}
                                </Col>
                              </>
                            )}
                          </Row>
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["members-create-group-page"]}
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
                                                className={
                                                  styles["name-create-group"]
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
                                                  "Designation-create-group"
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
                                                  styles["email-create-group"]
                                                }
                                              >
                                                <a> {data.data.emailAddress}</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col
                                          lg={2}
                                          md={2}
                                          sm={2}
                                          className="d-flex align-items-center"
                                        >
                                          <img
                                            src={deleteButtonCreateMeeting}
                                            width={20}
                                            className="cursor-pointer"
                                            height={20}
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
                                {t("Add-members")}
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
                              className="group-select-field  CreateMeetingReminder   "
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
                              className=" d-flex justify-content-end"
                            >
                              <Button
                                className={styles["ADD-Group-btn"]}
                                text={t("ADD")}
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
                                                <Col lg={12} md={12} sm={12}>
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
                                                <Col lg={12} md={12} sm={12}>
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
                                                <Col lg={12} md={12} sm={12}>
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
                            className={styles["Cancell-CreateGroup-btn"]}
                            text={t("Cancel")}
                            onClick={() => setCreategrouppage(false)}
                          />
                          <Button
                            className={styles["Create-CreateGroup-btn"]}
                            text={t("Create")}
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
      </section>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />

      {/* {GroupsReducer.Loading ? (
        <Loader />
     ) : null} */}
    </>
  );
};

export default CreateGroup;
