import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Newprofile from "../../../assets/images/newprofile.png";
import { Paper } from "@material-ui/core";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import userImage from "../../../assets/images/user.png";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
  Notification,
} from "./../../../components/elements";
import styles from "./CreateCommittee.module.css";
import Committee from "../../../container/Committee/Committee";

import { useSelector, useDispatch } from "react-redux";
import {
  createcommittee,
  getCommitteeMembersRole,
  getCommitteeTypes,
} from "../../../store/actions/Committee_actions";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";
const CreateCommittee = ({ setCreategrouppage }) => {
  const navigate = useNavigate();
  const [viewCreateCommittee, setViewCreateCommittee] = useState(true);
  const { assignees, CommitteeReducer } = useSelector((state) => state);
  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [erorbar, setErrorBar] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [meetingAttendees, setMeetingAttendees] = useState([]);
  const [committeeTypeValue, setCommitteeTypeValue] = useState("");
  const [committeeTypesOptions, setCommitteeTypesOptions] = useState([]);
  const [committeeTypesValues, setCommitteeTypesValues] = useState([]);
  const [committeeMemberRolesOptions, setCommitteeMemberRolesOptions] =
    useState([]);
  const [committeeMemberRolesValues, setCommitteeMemberRolesValues] = useState(
    []
  );

  const CommitteeTitle = useRef(null);
  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let creatorID = JSON.parse(localStorage.getItem("userID"));
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  // for initial State
  const [createCommitteeDetails, setCreateCommitteeDetails] = useState({
    PK_CMID: 0,
    CommitteesTitle: "",
    FK_CMSID: 0,
    CommitteeType: 0,
    CommitteesDescription: "",
    ISTalkChatGroup: true,
    OrganizationID: 0,
    CreatorID: 0,
    CommitteeMembers: [],
  });
  console.log("createGroupDetails", createCommitteeDetails);

  useEffect(() => {
    CommitteeTitle.current.focus();
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let Data = {
      OrganizationID: organizationID,
    };
    dispatch(allAssignessList(navigate, t));
    dispatch(getCommitteeTypes(navigate, Data, t));
    dispatch(getCommitteeMembersRole(navigate, Data, t));
  }, []);

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
      console.log(
        "CommitteeReducer.getCommitteeMembersRoles",
        CommitteeReducer.getCommitteeMembersRoles
      );
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

  //Drop Down Values
  const searchFilterHandler = (value) => {
    if (
      meetingAttendeesList != undefined &&
      meetingAttendeesList != null &&
      meetingAttendeesList != NaN &&
      meetingAttendeesList != []
    ) {
      return meetingAttendeesList
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

  // Group type Change Handler
  const CommitteeTypeChangeHandler = (e, value) => {
    setCommitteeTypeValue(value);
    console.log(e.target.name, value, "setCommitteeTypeValue");
    let findID = committeeTypesOptions.find(
      (data, index) => data.label === value
    );
    console.log(findID, "findIDfindIDfindIDfindID");
    setCreateCommitteeDetails({
      ...createCommitteeDetails,
      CommitteeType: findID.id,
    });
  };

  // on Search filter for add members
  const onSearch = (name, id) => {
    console.log("name id", name, id);
    setTaskAssignedToInput(name);
    setTaskAssignedTo(id);
    setTaskAssignedName(name);
  };
  console.log("name id", taskAssignedTo);

  // onChange Function for set input values in state
  const onChangeFunc = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "committeetitle") {
      setCreateCommitteeDetails({
        ...createCommitteeDetails,
        CommitteesTitle: value,
      });
    }
    if (name === "committeedescription") {
      setCreateCommitteeDetails({
        ...createCommitteeDetails,
        CommitteesDescription: value,
      });
    }
  };

  // remove member handler
  const removeMemberHandler = (id) => {
    let createCommitteeMembers = createCommitteeDetails.CommitteeMembers;
    let getGroupMemberIndex = groupMembers.findIndex(
      (groupmemberdata, index) => groupmemberdata.data.pK_UID === id
    );
    let getIndexCreateGroupDetails = createCommitteeMembers.findIndex(
      (data, index) => data.FK_UID === id
    );
    groupMembers.splice(getGroupMemberIndex, 1);
    createCommitteeMembers.splice(getIndexCreateGroupDetails, 1);
    meetingAttendees.splice(getIndexCreateGroupDetails, 1);
    setGroupMembers([...groupMembers]);
    setCreateCommitteeDetails({
      ...createCommitteeDetails,
      CommitteeMembers: meetingAttendees,
    });
  };
  console.log("splicesplicesplice", groupMembers);
  console.log("splicesplicesplice", createCommitteeDetails.CommitteeMembers);
  // change handler changeHandlerCommitteeMemberRole
  const changeHandlerCommitteeMemberRole = (e, value) => {
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
    } else if (taskAssignedTo != 0) {
      var foundIndex = meetingAttendees.findIndex(
        (x) => x.FK_UID === taskAssignedTo
      );
      console.log("taskAssignedTo", foundIndex);
      if (participantRoleName != "") {
        if (foundIndex === -1) {
          let roleID;
          committeeMemberRolesOptions.map((data, index) => {
            if (data.label === participantRoleName) {
              roleID = data.id;
              meetingAttendees.push({
                FK_UID: taskAssignedTo, //userid
                FK_CMMRID: data.id, //group member role id
                FK_CMID: 0, //group id
              });
              setMeetingAttendees([...meetingAttendees]);
            }
            setCreateCommitteeDetails({
              ...createCommitteeDetails,
              CommitteeMembers: meetingAttendees,
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
          setAttendees([]);
          setTaskAssignedTo(0);
          setParticipantRoleName("");
          setTaskAssignedToInput("");
        } else {
          setOpen({
            flag: true,
            message: t("User-already-exist"),
          });
          setAttendees([]);
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
        meetingAttendees.map((data2, index) => {
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
          attendees.map((dataID, index) => {
            meetingAttendees.push({
              FK_UID: dataID, //userid
              FK_CMMRID: participantOptionsWithID.id, //group member role id
              FK_CMID: 0, //group id
            });
            setMeetingAttendees([...meetingAttendees]);
            meetingAttendeesList.map((data, index) => {
              if (data.pK_UID === dataID) {
                groupMembers.push({
                  data,
                  role: participantOptionsWithID.id,
                });
                setGroupMembers([...groupMembers]);
              }
            });
            setCreateCommitteeDetails({
              ...createCommitteeDetails,
              CommitteeMembers: meetingAttendees,
            });
            setAttendees([]);
            setTaskAssignedTo(0);
            setParticipantRoleName("");
            setTaskAssignedToInput("");
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
      setAttendees([]);
      setTaskAssignedTo(0);
      setParticipantRoleName("");
      setTaskAssignedToInput("");
    }
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

  // onChange function for group chat
  const CheckBoxHandler = (e) => {
    setCreateCommitteeDetails({
      ...createCommitteeDetails,
      ISTalkChatGroup: e.target.checked,
    });
  };

  const handleCloseBtn = () => {
    setCreategrouppage(false);
  };

  const checkAttendeeBox = (data, id, index) => {
    if (attendees.includes(id)) {
      let attendIndex = attendees.findIndex((data, index) => data === id);
      console.log("attendIndexattendIndexattendIndex", attendIndex);
      if (attendIndex !== -1) {
        attendees.splice(attendIndex, 1);
        setAttendees([...attendees]);
      }
    } else {
      attendees.push(id);
      setAttendees([...attendees]);
    }
  };

  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assignees.user).length > 0) {
        setMeetingAttendeesList(assignees.user);
      }
    } catch (error) {}
  }, [assignees.user]);

  const checkGroupMembers = (GroupMembers) => {
    console.log("checkGroupMembers", GroupMembers);
    if (Object.keys(GroupMembers).length > 0) {
      let flag1 = GroupMembers.find((data, index) => data.FK_CMMRID === 1);
      let flag2 = GroupMembers.find((data, index) => data.FK_CMMRID === 2);
      console.log("checkGroupMembers", flag1, flag2);

      if (flag1 != undefined && flag2 != undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handleSubmitCreateGroup = async () => {
    if (
      createCommitteeDetails.CommitteesTitle !== "" &&
      createCommitteeDetails.CommitteesDescription !== "" &&
      createCommitteeDetails.CommitteeType !== 0 &&
      createCommitteeDetails.CreatorID !== 0
    ) {
      if (Object.keys(createCommitteeDetails.CommitteeMembers).length === 0) {
        setOpen({
          flag: true,
          message: t("Please-add-atleast-one-group-head-and-one-group-member"),
        });
      } else {
        if (!checkGroupMembers(createCommitteeDetails.CommitteeMembers)) {
          console.log(
            "checkGroupMembers",
            checkGroupMembers(createCommitteeDetails.CommitteeMembers)
          );
          setOpen({
            flag: true,
            message: t(
              "Please-add-atleast-one-group-head-and-one-group-member"
            ),
          });
        } else {
          setErrorBar(false);
          let OrganizationID = JSON.parse(
            localStorage.getItem("organizationID")
          );
          let Data = {
            CommitteeDetails: {
              CreatorID: createCommitteeDetails.CreatorID,
              CommitteesTitle: createCommitteeDetails.CommitteesTitle,
              CommitteesDescription:
                createCommitteeDetails.CommitteesDescription,
              PK_CMID: 0,
              FK_CMSID: 3,
              FK_CMTID: createCommitteeDetails.CommitteeType,
              ISTalkChatGroup: createCommitteeDetails.ISTalkChatGroup,
              OrganizationID: OrganizationID,
            },
            CommitteeMembers: createCommitteeDetails.CommitteeMembers,
          };
          dispatch(createcommittee(navigate, Data, t, setCreategrouppage));
        }
      }
    } else {
      setErrorBar(true);
      setOpen({
        flag: true,
        message: t("Please fill all the fields"),
      });
    }
  };

  // set Meeting Attendees By default creator
  useEffect(() => {
    if (
      meetingAttendeesList !== null &&
      meetingAttendeesList !== undefined &&
      meetingAttendeesList.length > 0
    ) {
      setCreateCommitteeDetails({
        ...createCommitteeDetails,
        CreatorID: creatorID,
      });
    }
  }, [meetingAttendeesList]);

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
            <span className={styles["Create-Committee-Heading"]}>
              {t("Create-new-committee")}
            </span>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg={12} md={12} sm={12}>
            <Paper className={styles["Create-Committee-paper"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Row>
                    <Col lg={8} md={8} sm={8}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={styles["details-class-Create-Committee"]}
                          >
                            {t("Details")}
                          </span>
                        </Col>
                      </Row>

                      <Row className="mt-4">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="create-committee-fields CreateMeetingInput"
                        >
                          <Form.Control
                            ref={CommitteeTitle}
                            applyClass="form-control2"
                            type="text"
                            placeholder={t("Committee-title")}
                            required={true}
                            name="committeetitle"
                            maxLength={300}
                            value={createCommitteeDetails.CommitteesTitle}
                            onChange={onChangeFunc}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar &&
                              createCommitteeDetails.CommitteesTitle === ""
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
                          className="CreateMeetingInput Saved_money_Tagline "
                        >
                          <TextField
                            applyClass="text-area-create-group"
                            type="text"
                            as={"textarea"}
                            maxLength={500}
                            value={createCommitteeDetails.CommitteesDescription}
                            rows="4"
                            placeholder={t("Description")}
                            required={true}
                            name="committeedescription"
                            change={onChangeFunc}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar &&
                              createCommitteeDetails.CommitteesDescription ===
                                ""
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
                          className={styles["CheckAlignment"]}
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="UpdateCheckbox Saved_money_Tagline"
                            >
                              <Checkbox
                                className="SearchCheckbox MontserratSemiBold-600"
                                name="IsChat"
                                label2Class={styles["Label_Of_CheckBox"]}
                                label2={t("Create-talk-group")}
                                checked={createCommitteeDetails.ISTalkChatGroup}
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
                          className="commmittee-type-select-field CreateMeetingReminder Saved_money_Tagline"
                        >
                          <SelectBox
                            name="Participant"
                            placeholder={t("Committee-type")}
                            option={committeeTypesValues}
                            value={committeeTypeValue}
                            change={CommitteeTypeChangeHandler}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col className={styles["Committee_error_coloumn"]}>
                          <p
                            className={
                              erorbar && committeeTypeValue === ""
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }
                          >
                            {t("Committee-type-is-required")}
                          </p>
                        </Col>
                      </Row>
                      {/* this is members shown area on which the scroll will applied */}
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["scroll-bar-createCommittee"]}
                        >
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Create-Committee-Head-Heading"]
                                }
                              >
                                {t("Executive-member")}
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            {groupMembers.length > 0 ? (
                              groupMembers.map((data, index) => {
                                if (data.role === 2) {
                                  return (
                                    <Col lg={4} md={4} sm={4} className="my-2">
                                      <Row>
                                        <Col lg={3} md={3} sm={12}>
                                          <img src={Newprofile} width={50} />
                                        </Col>
                                        <Col
                                          lg={7}
                                          md={7}
                                          sm={7}
                                          className={
                                            styles[
                                              "group-head-info-Create-Committee"
                                            ]
                                          }
                                        >
                                          <Row className="mt-1">
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-create-Committee"
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
                                                    "Designation-create-Committee"
                                                  ]
                                                }
                                              >
                                                {data.data.designation}
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-create-Committee"
                                                  ]
                                                }
                                              >
                                                <a>{data.data.emailAddress}</a>
                                              </span>
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
                              <>
                                <Col
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  className={styles["No-member"]}
                                >
                                  {t("No-member-selected")}
                                </Col>
                              </>
                            )}
                          </Row>
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["members-create-Committee-page"]
                                }
                              >
                                {t("Regular-members")}
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            {groupMembers.length > 0 ? (
                              groupMembers.map((data, index) => {
                                console.log("datadatadatadata", data);
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
                                          sm={7}
                                          className={
                                            styles[
                                              "group-head-info-Create-Committee"
                                            ]
                                          }
                                        >
                                          <Row className="mt-1">
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-create-Committee"
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
                                                    "Designation-create-Committee"
                                                  ]
                                                }
                                              >
                                                {data.data.designation}
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-create-Committee"
                                                  ]
                                                }
                                              >
                                                <a>{data.data.emailAddress}</a>
                                              </span>
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
                              <>
                                <Col
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  className={styles["No-member"]}
                                >
                                  {t("No-member-selected")}
                                </Col>
                              </>
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
                                  styles["Addmembers-class-Create-Committee"]
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
                              className="create-committee-fields InputSearchForCreateCommittee"
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

                          <Row className="mt-3">
                            <Col
                              lg={8}
                              md={8}
                              sm={8}
                              className="committee-select-fields CreateMeetingReminder   "
                            >
                              <SelectBox
                                name="Participant"
                                placeholder={t("Type")}
                                option={committeeMemberRolesValues}
                                value={participantRoleName}
                                change={changeHandlerCommitteeMemberRole}
                                // change={assigntRoleAttendies}
                              />
                            </Col>
                            <Col
                              lg={4}
                              md={4}
                              sm={4}
                              className="d-flex justify-content-end "
                            >
                              <Button
                                className={styles["ADD-Committee-btn"]}
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
                                styles["scrollbar-addmember-createcommittee"]
                              }
                            >
                              {" "}
                              {meetingAttendeesList.length > 0
                                ? meetingAttendeesList.map(
                                    (attendeelist, index) => {
                                      return (
                                        <Row className="mt-4" key={index}>
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
                                                    "group-head-info-Add-Members-Create-Committee"
                                                  ]
                                                }
                                              >
                                                <Row className="mt-1">
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "name-create-Committee"
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
                                                          "Designation-create-Committee"
                                                        ]
                                                      }
                                                    >
                                                      {attendeelist.designation}
                                                    </span>
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "email-create-Committee"
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
                                                  // checked={rememberEmail}
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
                                                    styles[
                                                      "RememberEmail-Create-Committee"
                                                    ]
                                                  }
                                                />
                                              </Col>
                                            </Row>
                                          </Col>
                                        </Row>
                                      );
                                    }
                                  )
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
                            className={styles["Cancell-CreateCommittee-btn"]}
                            text={t("Cancel")}
                            onClick={handleCloseBtn}
                          />
                          <Button
                            className={styles["Create-CreateCommittee-btn"]}
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

      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </>
  );
};

export default CreateCommittee;
