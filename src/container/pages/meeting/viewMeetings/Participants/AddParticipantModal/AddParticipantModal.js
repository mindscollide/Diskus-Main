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

const AddParticipantModal = ({ setrspvRows, rspvRows }) => {
  const animatedComponents = makeAnimated();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  console.log(NewMeetingreducer, "statestatestate");
  let currentMeetingID = Number(localStorage.getItem("meetingID"));
  const [addParticipantDropdown, setAddParticipantDropdown] = useState([]);
  const [selectedsearch, setSelectedsearch] = useState([]);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [membersParticipants, setMembersParticipants] = useState([]);
  console.log(
    { membersParticipants },
    "membersParticipantsmembersParticipants"
  );
  const RemovedParticipant = (index) => {
    const updatedPartipants = [...membersParticipants];
    updatedPartipants.splice(index, 1);
    setMembersParticipants(updatedPartipants);
  };

  const [addParticipant, setAddParticipant] = useState({
    SearhParticipant: "",
  });

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
          console.log(
            seledtedData,
            "seledtedDataseledtedDataseledtedDataseledtedData"
          );
          if (seledtedData.type === 1) {
            let check1 = newOrganizersData.groups.find(
              (data, index) => data.groupID === seledtedData.value
            );
            if (check1 !== undefined) {
              let groupUsers = check1.groupUsers;
              if (Object.keys(groupUsers).length > 0) {
                groupUsers.map((gUser, index) => {
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
                      participantRole: {},
                      isComingApi: false,
                    };
                    tem.push(newUser);
                  }
                });
              }
            }
          } else if (seledtedData.type === 2) {
            console.log("membersOrganizers check");
            let check1 = newOrganizersData.committees.find(
              (data, index) => data.committeeID === seledtedData.value
            );
            if (check1 != undefined) {
              let committeesUsers = check1.committeeUsers;
              if (Object.keys(committeesUsers).length > 0) {
                committeesUsers.map((cUser, index) => {
                  let check2 = membersParticipants.find(
                    (data, index) => data.UserID === cUser.userID
                  );
                  if (check2 != undefined) {
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
                      participantRole: {},
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
            if (check1 != undefined) {
            } else {
              let check2 = newOrganizersData.organizationUsers.find(
                (data, index) => data.userID === seledtedData.value
              );
              console.log(check2, "check2check2check2");
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
                  participantRole: {},
                  isComingApi: false,
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
      console.log("membersOrganizers check", tem);
      const uniqueData = new Set(tem.map(JSON.stringify));

      // Convert the Set back to an array of objects
      const result = Array.from(uniqueData).map(JSON.parse);
      setMembersParticipants(result);
      setSelectedsearch([]);
      console.log("Add Button output", membersParticipants);
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
      MeetingID: currentMeetingID,
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
          newOrganizersData.groups.map((a, index) => {
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
                      <img
                        src={GroupIcon}
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
          newOrganizersData.committees.map((a, index) => {
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
          console.log(
            newOrganizersData.organizationUsers,
            "organizationUsersorganizationUsersorganizationUsers"
          );
          newOrganizersData.organizationUsers.map((a, index) => {
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
                        src={`data:image/jpeg;base64,${a?.profilePicture?.displayProfilePictureName}`}
                        // src={}
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
                        console.log(data, "indexindexindexindex");
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
              <Col lg={12} md={12} sm={12}>
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={t("Done")}
                      className={styles["Done_btn_organizor_modal"]}
                      onClick={handleClickDone}
                    />
                  </Col>
                </Row>
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
