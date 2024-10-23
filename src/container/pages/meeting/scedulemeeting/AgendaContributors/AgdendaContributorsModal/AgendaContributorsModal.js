import React, { useEffect, useState } from "react";
import styles from "./AgendaContritbutorsModal.module.css";
import {
  Modal,
  Button,
  Notification,
} from "../../../../../../components/elements";
import {
  showAddAgendaContributor,
  showAgendaContributorsModals,
} from "../../../../../../store/actions/NewMeetingActions";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import { useDispatch, useSelector } from "react-redux";
import CrossIcon from "../../../../../../assets/images/CrossIcon.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { GetAllCommitteesUsersandGroups } from "../../../../../../store/actions/MeetingOrganizers_action";
import GroupIcon from "../../../../../../assets/images/GroupSetting.svg";
import committeeicon from "../../../../../../assets/images/committeedropdown.svg";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { showMessage } from "../../../../../../components/elements/snack_bar/utill";

const AgendaContributorsModal = ({
  SelectedRSVP,
  rowsData,
  setRowsData,
  setNotificedMembersData,
  currentMeeting,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();

  const [selectedsearch, setSelectedsearch] = useState([]);
  const [dropdowndata, setDropdowndata] = useState([]);
  const [membersOrganizers, setMembersOrganizers] = useState([]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state
  );

  useEffect(() => {
    try {
      let newOrganizersData =
        MeetingOrganizersReducer.AllUserCommitteesGroupsData;
      if (newOrganizersData !== null && newOrganizersData !== undefined) {
        let temp = [];
        if (Object.keys(newOrganizersData).length > 0) {
          if (Object.keys(newOrganizersData.groups).length > 0) {
            newOrganizersData.groups.map((a, index) => {
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
                          height="16.45px"
                          width="18.32px"
                          draggable="false"
                          alt=""
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
                          width="21.71px"
                          height="18.61px"
                          draggable="false"
                          alt=""
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
            newOrganizersData.organizationUsers.map((a, index) => {
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
          setDropdowndata(temp);
        } else {
          setDropdowndata([]);
        }
      }
    } catch {}
  }, [MeetingOrganizersReducer.AllUserCommitteesGroupsData]);

  useEffect(() => {
    let Data = {
      MeetingID: currentMeeting !== null ? Number(currentMeeting) : 0,
    };
    dispatch(GetAllCommitteesUsersandGroups(Data, navigate, t));
  }, []);

  const handleCrossIcon = () => {
    dispatch(showAddAgendaContributor(false));
  };

  const removeContributor = (record) => {
    let removemembersOrganizers = membersOrganizers.filter(
      (data, index) => data.userID !== record.userID
    );
    setMembersOrganizers(removemembersOrganizers);
  };
  // for selection of data
  const handleSelectValue = (value) => {
    setSelectedsearch(value);
  };
  const handleAddUsers = () => {
    let newOrganizersData =
      MeetingOrganizersReducer.AllUserCommitteesGroupsData;
    let tem = [...membersOrganizers];

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
                groupUsers.map((gUser, index) => {
                  let check2 = membersOrganizers.find(
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
                      Title: "",
                      agendaListRightsAll:
                        Number(SelectedRSVP.value) === 1 ? true : false,
                      isEdit: false,
                      isContributorNotified: true,
                      attendeeAvailability: 1,
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
                committeesUsers.map((cUser, index) => {
                  let check2 = membersOrganizers.find(
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
                      isContributorNotified: true,
                      Title: "",
                      agendaListRightsAll:
                        Number(SelectedRSVP.value) === 1 ? true : false,
                      isEdit: false,
                      attendeeAvailability: 1,
                    };
                    tem.push(newUser);
                  }
                });
              }
            }
          } else if (seledtedData.type === 3) {
            let check1 = membersOrganizers.find(
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
                  isContributorNotified: true,
                  Title: "",
                  agendaListRightsAll:
                    Number(SelectedRSVP.value) === 1 ? true : false,
                  isEdit: false,
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

      const result = Array.from(uniqueData).map(JSON.parse);
      setMembersOrganizers(result);
      setSelectedsearch([]);
    } else {
      // setopen notionation work here
    }
  };
  const handleClickDone = () => {
    let newData = [...rowsData, ...membersOrganizers];
    // Create a Set to remove duplicates based on userID
    const uniqueData = new Set(newData.map((obj) => obj.userID));
    // Convert the Set back to an array
    newData = [...uniqueData].map((userID) =>
      newData.find((obj) => obj.userID === userID)
    );

    if (membersOrganizers.length === 0) {
      showMessage(
        t("Atleast-one-agenda-contributor-should-be-selected"),
        "error",
        setOpen
      );
    } else {
      setRowsData(newData);
      dispatch(showAddAgendaContributor(false));
      dispatch(showAgendaContributorsModals(true));
      setNotificedMembersData(newData);
      // Combine the arrays into newData
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
        show={NewMeetingreducer.agendaContributors}
        setShow={dispatch(showAddAgendaContributor)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showAddAgendaContributor(false));
        }}
        size={"md"}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OverAll_Padding"]}
              >
                <Row>
                  <Col lg={7} md={7} sm={12}>
                    <span className={styles["Add_organization"]}>
                      {t("Add-agenda-contributors")}
                    </span>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <img
                      draggable={false}
                      src={BlackCrossIcon}
                      className={"cursor-pointer"}
                      width="16px"
                      height="16px"
                      alt=""
                      onClick={handleCrossIcon}
                    />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg={10} md={10} sm={10}>
                    <Select
                      isDisabled={dropdowndata.length === 0 ? true : false}
                      closeMenuOnSelect={false}
                      classNamePrefix={"ModalOrganizerSelect"}
                      components={animatedComponents}
                      isMulti
                      options={dropdowndata}
                      onChange={handleSelectValue}
                      value={selectedsearch}
                      isSearchable={true}
                      filterOption={customFilter}
                    />
                  </Col>
                  <Col md={2} lg={2} sm={2}>
                    <Button
                      text={t("ADD")}
                      className={styles["ADD_Btn_CreatePool_Modal"]}
                      onClick={handleAddUsers}
                    />
                  </Col>
                </Row>

                <Row className={styles["Scroller_For_CreatePollModal2"]}>
                  {membersOrganizers.length > 0
                    ? membersOrganizers.map((data, index) => {
                        return (
                          <>
                            <Col lg={6} md={6} sm={6} className="mt-2">
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={styles["padding_class"]}
                                >
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className={styles["Card_border2"]}>
                                        <Col sm={10} md={10} lg={10}>
                                          <img
                                            draggable={false}
                                            src={`data:image/jpeg;base64,${data?.displayPicture}`}
                                            width="33px"
                                            height="33px"
                                            alt=""
                                          />
                                          <span
                                            className={styles["Name_cards"]}
                                          >
                                            {data.userName}
                                          </span>
                                        </Col>
                                        <Col sm={2} md={2} lg={2}>
                                          <img
                                            draggable={false}
                                            src={CrossIcon}
                                            className="cursor-pointer"
                                            width="14px"
                                            alt=""
                                            height="14px"
                                            onClick={() =>
                                              removeContributor(data)
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
                {membersOrganizers.length > 0 && (
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
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
    </section>
  );
};

export default AgendaContributorsModal;
