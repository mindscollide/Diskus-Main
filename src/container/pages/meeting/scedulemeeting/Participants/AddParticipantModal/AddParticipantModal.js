import React, { useEffect, useState } from "react";
import styles from "./AddParticipant.module.css";
import {
  Modal,
  Button,
  Notification,
} from "../../../../../../components/elements";
import {
  GetAllCommitteesUsersandGroupsParticipants,
  showAddParticipantsModal,
} from "../../../../../../store/actions/NewMeetingActions";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import { useDispatch, useSelector } from "react-redux";
import GroupIcon from "../../../../../../assets/images/GroupSetting.svg";
import committeeicon from "../../../../../../assets/images/committeedropdown.svg";
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
        selectedsearch.map((seledtedData) => {
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
                      attendeeAvailability: 1,
                    };
                    tem.push(newUser);
                  }
                });
              }
            }
          } else if (seledtedData.type === 2) {
            let check1 = newOrganizersData.committees.find(
              (data) => data.committeeID === seledtedData.value
            );
            if (check1 !== undefined) {
              let committeesUsers = check1.committeeUsers;
              if (Object.keys(committeesUsers).length > 0) {
                committeesUsers.forEach((cUser) => {
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
                      attendeeAvailability: 1,
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
                  attendeeAvailability: 1,
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

  useEffect(() => {
    let newOrganizersData =
      NewMeetingreducer.getAllCommitteeAndGroupPartcipants;
    if (newOrganizersData !== null && newOrganizersData !== undefined) {
      let temp = [];
      if (Object.keys(newOrganizersData).length > 0) {
        if (Object.keys(newOrganizersData.groups).length > 0) {
          newOrganizersData.groups.map((a) => {
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
                        alt=""
                        height="16.45px"
                        width="18.32px"
                        draggable="false"
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
        if (Object.keys(newOrganizersData.committees).length > 0) {
          newOrganizersData.committees.map((a) => {
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
                        alt=""
                        width="21.71px"
                        height="18.61px"
                        draggable="false"
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
        if (Object.keys(newOrganizersData.organizationUsers).length > 0) {
          newOrganizersData.organizationUsers.map((a) => {
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
                        alt=""
                        className={styles["UserProfilepic"]}
                        width="18px"
                        height="18px"
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
        setAddParticipantDropdown(temp);
      } else {
        setAddParticipantDropdown([]);
      }
    }
  }, [NewMeetingreducer.getAllCommitteeAndGroupPartcipants]);

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

  const customFilter = (options, searchText) => {
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
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
                      alt=""
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
                    <Select
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
                      filterOption={customFilter}
                      isSearchable={true}
                    />
                    <Button
                      text={t("ADD")}
                      className={styles["ADD_Btn_CreatePool_Modal"]}
                      onClick={handleAddUsers}
                    />
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
                                            alt=""
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
                                            alt=""
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
