import React, { useEffect, useState } from "react";
import styles from "./AddParticipant.module.css";
import {
  Modal,
  Button,
  Notification,
  InputSearchFilter,
} from "../../../../../../components/elements";
import {
  GetAllCommitteesUsersandGroupsParticipants,
  showAddParticipantsModal,
  showAddUserModal,
} from "../../../../../../store/actions/NewMeetingActions";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import committeicon from "../../../../../../assets/images/Group 2584.png";
import { useDispatch, useSelector } from "react-redux";
import GroupIcon from "../../../../../../assets/images/Path 636.png";
import committeeicon from "../../../../../../assets/images/committeedropdown.svg";
import profile from "../../../../../../assets/images/newprofile.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CrossIcon from "../../../../../../assets/images/CrossIcon.svg";

const AddParticipantModal = ({ setrspvRows, rspvRows, currentMeeting }) => {
  const animatedComponents = makeAnimated();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  // let currentMeetingID = Number(localStorage.getItem("meetingID"));
  const [dropdowndata, setDropdowndata] = useState([]);
  const [participantUsers, setParticipantUsers] = useState("");
  const [addParticipantDropdown, setAddParticipantDropdown] = useState([]);
  const [selectedsearch, setSelectedsearch] = useState([]);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [membersParticipants, setMembersParticipants] = useState([]);
  const RemovedParticipant = (index) => {
    const updatedPartipants = [...membersParticipants];
    updatedPartipants.splice(index, 1);
    setMembersParticipants(updatedPartipants);
  };

  const handleCrossIcon = () => {
    dispatch(showAddParticipantsModal(false));
  };

  const handleAddUsers = () => {
    let newOrganizersData =
      NewMeetingreducer.getAllCommitteeAndGroupPartcipants;
    let tem = [...membersParticipants];
    if (Object.keys(selectedsearch).length > 0) {
      try {
        selectedsearch.map((seledtedData, index) => {
          if (seledtedData.type === 1) {
            let check1 = newOrganizersData.groups.find(
              (data, index) => data.groupID === seledtedData.value
            );
            if (check1 !== undefined) {
              let groupUsers = check1.groupUsers;
              if (Object.keys(groupUsers).length > 0) {
                groupUsers.forEach((gUser, index) => {
                  let check2 = membersParticipants.find(
                    (data, index) => data.UserID === gUser.userID
                  );
                  if (check2 !== undefined) {
                  } else {
                    let newUser = {
                      userName: gUser.userName,
                      userID: gUser.userID,
                      displayPicture:
                        gUser.profilePicture.displayProfilePictureName,
                      email: gUser.emailAddress,
                      IsPrimaryOrganizer: false,
                      IsOrganizerNotified: false,
                      Title: "",
                      isRSVP: false,
                      participantRole: {
                        participantRole: "Participant",
                        participantRoleID: 2,
                      },
                      isComingApi: false,
                    };
                    tem.push(newUser);
                  }
                });
              }
            }
          } else if (seledtedData.type === 2) {
            let check1 = newOrganizersData.committees.find(
              (data, index) => data.committeeID === seledtedData.value
            );
            if (check1 !== undefined) {
              let committeesUsers = check1.committeeUsers;
              if (Object.keys(committeesUsers).length > 0) {
                committeesUsers.forEach((cUser, index) => {
                  let check2 = membersParticipants.find(
                    (data, index) => data.UserID === cUser.userID
                  );
                  if (check2 !== undefined) {
                  } else {
                    let newUser = {
                      userName: cUser.userName,
                      userID: cUser.userID,
                      displayPicture:
                        cUser.profilePicture.displayProfilePictureName,
                      email: cUser.emailAddress,
                      IsPrimaryOrganizer: false,
                      IsOrganizerNotified: false,
                      Title: "",
                      isRSVP: false,
                      participantRole: {
                        participantRole: "Participant",
                        participantRoleID: 2,
                      },
                      isComingApi: false,
                    };
                    tem.push(newUser);
                  }
                });
              }
            }
          } else if (seledtedData.type === 3) {
            let check1 = membersParticipants.find(
              (data, index) => data.UserID === seledtedData.value
            );
            if (check1 !== undefined) {
            } else {
              let check2 = newOrganizersData.organizationUsers.find(
                (data, index) => data.userID === seledtedData.value
              );

              if (check2 !== undefined) {
                let newUser = {
                  userName: check2.userName,
                  userID: check2.userID,
                  displayPicture:
                    check2.profilePicture.displayProfilePictureName,
                  email: check2.emailAddress,
                  IsPrimaryOrganizer: false,
                  IsOrganizerNotified: false,
                  Title: "",
                  isRSVP: false,
                  participantRole: {
                    participantRole: "Participant",
                    participantRoleID: 2,
                  },
                  isComingApi: false,
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
      setMembersParticipants(result);
      setSelectedsearch([]);
    } else {
      // setopen notionation work here
    }
  };

  // for selection of data
  const handleSelectValue = (value) => {
    setSelectedsearch(value);
  };

  useEffect(() => {
    let Data = {
      MeetingID: currentMeeting,
    };
    dispatch(GetAllCommitteesUsersandGroupsParticipants(Data, navigate, t));
  }, []);
  console.log(
    NewMeetingreducer,
    " NewMeetingreducer.AllUserCommitteesGroupsData"
  );
  console.log(dropdowndata, "dropdowndatadropdowndata");
  useEffect(() => {
    let newParticpantData =
      NewMeetingreducer.getAllCommitteeAndGroupPartcipants;
    console.log(newParticpantData, "newParticpantDatanewParticpantData");
    if (newParticpantData !== null && newParticpantData !== undefined) {
      let temp = [];
      if (Object.keys(newParticpantData).length > 0) {
        if (Object.keys(newParticpantData.groups).length > 0) {
          newParticpantData.groups.forEach((a, index) => {
            let newData = {
              value: a.groupID,
              label: a.groupName,
              profilePic: GroupIcon,
              type: 1,
            };
            temp.push(newData);
          });
        }
        if (Object.keys(newParticpantData.committees).length > 0) {
          newParticpantData.committees.forEach((a, index) => {
            let newData = {
              value: a.committeeID,
              label: a.committeeName,
              profilePic: committeeicon,

              type: 2,
            };
            temp.push(newData);
          });
        }
        if (Object.keys(newParticpantData.organizationUsers).length > 0) {
          newParticpantData.organizationUsers.forEach((a, index) => {
            let newData = {
              value: a.userID,
              label: a.userName,
              profilePic: a?.profilePicture?.displayProfilePictureName,
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
  }, [NewMeetingreducer.AllUserCommitteesGroupsData]);

  const onChangeSearch = (e) => {
    setParticipantUsers(e.target.value.trimStart());
  };

  const onSearch = (name, id, type, item) => {
    let newOrganizersData =
      NewMeetingreducer.getAllCommitteeAndGroupPartcipants;
    let tem = [...membersParticipants];
    if (type === 1) {
      // Groups Search
      let check1 = newOrganizersData.groups.find(
        (data, index) => data.groupID === id
      );
      if (check1 !== undefined) {
        let groupUsers = check1.groupUsers;
        if (Object.keys(groupUsers).length > 0) {
          groupUsers.forEach((gUser, index) => {
            let check2 = membersParticipants.find(
              (data, index) => data.UserID === gUser.userID
            );
            if (check2 !== undefined) {
            } else {
              let newUser = {
                userName: gUser.userName,
                userID: gUser.userID,
                displayPicture: gUser.profilePicture.displayProfilePictureName,
                email: gUser.emailAddress,
                IsPrimaryOrganizer: false,
                IsOrganizerNotified: false,
                Title: "",
                isRSVP: false,
                participantRole: {
                  participantRole: "Participant",
                  participantRoleID: 2,
                },
                isComingApi: false,
              };
              tem.push(newUser);
            }
          });
        }
      }
    } else if (type === 2) {
      // Committees Search
      let check1 = newOrganizersData.committees.find(
        (data, index) => data.committeeID === id
      );

      if (check1 !== undefined) {
        let committeesUsers = check1.committeeUsers;
        if (Object.keys(committeesUsers).length > 0) {
          committeesUsers.forEach((cUser, index) => {
            let check2 = membersParticipants.find(
              (data, index) => data.UserID === cUser.userID
            );
            if (check2 !== undefined) {
            } else {
              let newUser = {
                userName: cUser.userName,
                userID: cUser.userID,
                displayPicture: cUser.profilePicture.displayProfilePictureName,
                email: cUser.emailAddress,
                IsPrimaryOrganizer: false,
                IsOrganizerNotified: false,
                Title: "",
                isRSVP: false,
                participantRole: {
                  participantRole: "Participant",
                  participantRoleID: 2,
                },
                isComingApi: false,
              };
              tem.push(newUser);
            }
          });
        }
      }
    } else if (type === 3) {
      // User Search
      let check1 = membersParticipants.find(
        (data, index) => data.UserID === id
      );

      if (check1 !== undefined) {
      } else {
        let check2 = newOrganizersData.organizationUsers.find(
          (data, index) => data.userID === id
        );
        if (check2 !== undefined) {
          let newUser = {
            userName: check2.userName,
            userID: check2.userID,
            displayPicture: check2.profilePicture.displayProfilePictureName,
            email: check2.emailAddress,
            IsPrimaryOrganizer: false,
            IsOrganizerNotified: false,
            Title: "",
            isRSVP: false,
            participantRole: {
              participantRole: "Participant",
              participantRoleID: 2,
            },
            isComingApi: false,
          };
          tem.push(newUser);
        }
      }
    }
    const uniqueData = new Set(tem.map(JSON.stringify));

    const result = Array.from(uniqueData).map(JSON.parse);
    setMembersParticipants(result);
    setParticipantUsers("");
  };
  const handleClickDone = () => {
    let rspvRowsCopy = [...rspvRows, ...membersParticipants];

    const uniqueData = new Set(rspvRowsCopy.map((obj) => obj.userID));

    // Convert the Set back to an array
    rspvRowsCopy = [...uniqueData].map((userID) =>
      rspvRowsCopy.find((obj) => obj.userID === userID)
    );
    if (membersParticipants.length === 0) {
      setOpen({
        flag: true,
        message: t("Atleast-one-participant-should-be-selected"),
      });
    } else {
      setrspvRows(rspvRowsCopy);
      dispatch(showAddParticipantsModal(false));
    }
  };
  //Drop Down Values
  const searchFilterHandler = (value) => {
    let allAssignees = dropdowndata;
    try {
      if (
        allAssignees !== undefined &&
        allAssignees !== null &&
        allAssignees !== []
      ) {
        return allAssignees
          .filter((item) => {
            const searchValue = value.toLowerCase();
            const agendaContributorValue = item.label.toLowerCase();
            return (
              searchValue && agendaContributorValue.startsWith(searchValue)
            );
          })
          .slice(0, 10)
          .map((item) => (
            <div
              onClick={() => onSearch(item.label, item.value, item.type, item)}
              className="dropdown-row-assignee d-flex align-items-center flex-row"
              key={item.pK_UID}
            >
              <img
                draggable="false"
                src={
                  item.type === 3
                    ? `data:image/jpeg;base64,${item?.profilePic}`
                    : item.profilePic
                }
                alt=""
                className="user-img"
              />
              <p className="p-0 m-0">{item.label}</p>
            </div>
          ));
      } else {
      }
    } catch (error) {}
  };

  return (
    <section>
      <Modal
        show={NewMeetingreducer.participantModal}
        setShow={dispatch(showAddParticipantsModal)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showAddParticipantsModal(false));
        }}
        size={"md"}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OverAll_padding"]}
              >
                <Row>
                  <Col lg={5} md={5} sm={12}>
                    <span className={styles["Add_organization"]}>
                      {t("Add-participants")}
                    </span>
                  </Col>
                  <Col
                    lg={7}
                    md={7}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <img
                      draggable={false}
                      src={BlackCrossIcon}
                      className={"cursor-pointer"}
                      width="16px"
                      height="16px"
                      onClick={handleCrossIcon}
                    />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="group-fields d-flex align-items-center gap-2"
                  >
                    <InputSearchFilter
                      placeholder={t("Add-participant")}
                      value={participantUsers}
                      filteredDataHandler={searchFilterHandler(
                        participantUsers
                      )}
                      // applyClass="assigneeFindInCreateToDo"
                      applyClass={"searchFilterAgendaContributor"}
                      labelClass={"searchFilterAgendaContributorLabel"}
                      disable={dropdowndata.length === 0 ? true : false}
                      change={onChangeSearch}
                    />
                    {/* <Select
                      closeMenuOnSelect={false}
                      onChange={handleSelectValue}
                      value={selectedsearch}
                      classNamePrefix={"ModalOrganizerSelect"}
                      isDisabled={
                        NewMeetingreducer.getAllCommitteeAndGroupPartcipants
                          .length === 0
                          ? true
                          : false
                      }
                      components={animatedComponents}
                      options={addParticipantDropdown}
                      isMulti
                      isSearchable={false}
                    /> */}
                    {/* <Button
                      text={t("ADD")}
                      className={styles["ADD_Btn_CreatePool_Modal"]}
                      onClick={handleAddUsers}
                    /> */}
                  </Col>
                </Row>
                <Row className={styles["Scroller_For_CreatePollModal2"]}>
                  {membersParticipants.length > 0
                    ? membersParticipants.map((data, index) => {
                        return (
                          <>
                            <Col lg={6} md={6} sm={12} className="mt-2">
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={styles["OverAll_Padding"]}
                                >
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className={styles["Card_border2"]}>
                                        <Col sm={12} md={10} lg={10}>
                                          <img
                                            draggable={false}
                                            src={`data:image/jpeg;base64,${data?.displayPicture}`}
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
                                            draggable={false}
                                            src={CrossIcon}
                                            width="14px"
                                            height="14px"
                                            className="cursor-pointer"
                                            onClick={() =>
                                              RemovedParticipant(index)
                                            }
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
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
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end"
              >
                {membersParticipants.length > 0 && (
                  <Button
                    text={t("Done")}
                    className={styles["Done_btn_organizor_modal"]}
                    onClick={handleClickDone}
                  />
                )}
              </Col>
            </Row>
          </>
        }
      />
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </section>
  );
};

export default AddParticipantModal;
