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
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const { meetingID = 0 } = useSelector(
    (state) => state.NewMeetingreducer.currentMeetingInfo
  );
  const committeeInfo = useSelector(
    (state) => state.CommitteeReducer.viewCommitteeDetails
  );

  const groupInfo = useSelector(
    (state) => state.GroupsReducer.viewGroupDetails
  );

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
    let Data = {
      MeetingID: meetingID,
    };
    dispatch(GetAllCommitteesUsersandGroups(Data, navigate, t));
  }, [meetingID]);


  useEffect(() => {
    const data = MeetingOrganizersReducer.AllUserCommitteesGroupsData;

    if (!data || Object.keys(data).length === 0) {
      setDropdowndata([]);
      return;
    }

    let temp = [];

    // Groups
    if (data.groups && data.groups.length > 0) {
      if (groupInfo) {
        const selectedGroup = data.groups.find(
          (c) => c.groupID === groupInfo.groupID
        );

        if (selectedGroup && selectedGroup.groupUsers.length > 0) {
          selectedGroup.groupUsers.forEach((member) => {
            temp.push({
              value: member.userID,
              name: member.userName,
              label: (
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex gap-2 align-items-center'>
                    <img
                      src={`data:image/jpeg;base64,${member?.profilePicture?.displayProfilePictureName}`}
                      alt=''
                      className={styles["UserProfilepic"]}
                      width='18px'
                      height='18px'
                      draggable='false'
                    />
                    <span className={styles["NameDropDown"]}>
                      {member.userName}
                    </span>
                  </Col>
                </Row>
              ),
              type: 3,
            });
          });
          setDropdowndata(temp);
          return;
        } else {
          data.groups.forEach((a) => {
            temp.push({
              value: a.groupID,
              name: a.groupName,
              label: (
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex gap-2 align-items-center'>
                    <img
                      src={GroupIcon}
                      alt=''
                      height='16.45px'
                      width='18.32px'
                      draggable='false'
                    />
                    <span className={styles["NameDropDown"]}>
                      {a.groupName}
                    </span>
                  </Col>
                </Row>
              ),
              type: 1,
            });
          });
        }
      }
    }

    // Committees
    if (data.committees && data.committees.length > 0) {
      if (committeeInfo) {
        const selectedCommittee = data.committees.find(
          (c) => c.committeeID === committeeInfo.committeeID
        );

        if (selectedCommittee?.committeeUsers?.length > 0) {
          selectedCommittee.committeeUsers.forEach((member) => {
            temp.push({
              value: member.userID,
              name: member.userName,
              label: (
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex gap-2 align-items-center'>
                    <img
                      src={`data:image/jpeg;base64,${member?.profilePicture?.displayProfilePictureName}`}
                      alt=''
                      className={styles["UserProfilepic"]}
                      width='18px'
                      height='18px'
                      draggable='false'
                    />
                    <span className={styles["NameDropDown"]}>
                      {member.userName}
                    </span>
                  </Col>
                </Row>
              ),
              type: 3,
            });
          });
          
    setDropdowndata(temp);
    return;
        }
      } else {
        data.committees.forEach((a) => {
          temp.push({
            value: a.committeeID,
            name: a.committeeName,
            label: (
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='d-flex gap-2 align-items-center'>
                  <img
                    src={committeeicon}
                    alt=''
                    width='21.71px'
                    height='18.61px'
                    draggable='false'
                  />
                  <span className={styles["NameDropDown"]}>
                    {a.committeeName}
                  </span>
                </Col>
              </Row>
            ),
            type: 2,
          });
        });
      }
    }

    // Organization Users
    if (data.organizationUsers && data.organizationUsers.length > 0 && groupInfo === null && committeeInfo === null) {
      data.organizationUsers.forEach((a) => {
        temp.push({
          value: a.userID,
          name: a.userName,
          label: (
            <Row>
              <Col lg={12} md={12} sm={12} className="d-flex gap-2 align-items-center">
                <img
                  src={`data:image/jpeg;base64,${a?.profilePicture?.displayProfilePictureName}`}
                  alt=""
                  className={styles["UserProfilepic"]}
                  width="18px"
                  height="18px"
                  draggable="false"
                />
                <span className={styles["NameDropDown"]}>{a.userName}</span>
              </Col>
            </Row>
          ),
          type: 3,
        });
      });
    }

    setDropdowndata(temp);
  }, [MeetingOrganizersReducer.AllUserCommitteesGroupsData, committeeInfo, groupInfo]);
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
    const data = MeetingOrganizersReducer.AllUserCommitteesGroupsData;
  
    if (!selectedsearch?.length) {
      // TODO: show notification
      return;
    }
  
    let tem = [...membersOrganizers];
  
    // 🔥 Use Set for fast duplicate check
    const existingUserIds = new Set(tem.map((u) => u.userID));
  
    const createUserObject = (user) => ({
      userName: user.userName,
      userID: user.userID,
      displayPicture: user.profilePicture?.displayProfilePictureName,
      email: user.emailAddress,
      Title: "",
      agendaListRightsAll: Number(SelectedRSVP.value) === 1,
      isEdit: false,
      isContributorNotified: true,
      attendeeAvailability: 1,
    });
  
    try {
      selectedsearch.forEach((selected) => {
        // 🔹 GROUP
        if (selected.type === 1) {
          const group = data.groups?.find(
            (g) => g.groupID === selected.value
          );
  
          group?.groupUsers?.forEach((user) => {
            if (!existingUserIds.has(user.userID)) {
              tem.push(createUserObject(user));
              existingUserIds.add(user.userID);
            }
          });
        }
  
        // 🔹 COMMITTEE
        else if (selected.type === 2) {
          const committee = data.committees?.find(
            (c) => c.committeeID === selected.value
          );
  
          committee?.committeeUsers?.forEach((user) => {
            if (!existingUserIds.has(user.userID)) {
              tem.push(createUserObject(user));
              existingUserIds.add(user.userID);
            }
          });
        }
  
        // 🔹 SINGLE USER
        else if (selected.type === 3) {
          const user = data.organizationUsers?.find(
            (u) => u.userID === selected.value
          );
  
          if (user && !existingUserIds.has(user.userID)) {
            tem.push(createUserObject(user));
            existingUserIds.add(user.userID);
          }
        }
      });
  
      setMembersOrganizers(tem);
      setSelectedsearch([]);
    } catch (error) {
      console.error("handleAddUsers error:", error);
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
                className={styles["OverAll_Padding"]}>
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
                    className='d-flex justify-content-end'>
                    <img
                      draggable={false}
                      src={BlackCrossIcon}
                      className={"cursor-pointer"}
                      width='16px'
                      height='16px'
                      alt=''
                      onClick={handleCrossIcon}
                    />
                  </Col>
                </Row>
                <Row className='mt-5'>
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

                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex justify-content-center align-items-center mt-3'></Col>
                </Row>

                <Row className={styles["Scroller_For_CreatePollModal2"]}>
                  {membersOrganizers.length > 0
                    ? membersOrganizers.map((data, index) => {
                        return (
                          <>
                            <Col lg={6} md={6} sm={6} className='mt-2'>
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={styles["padding_class"]}>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className={styles["Card_border2"]}>
                                        <Col sm={10} md={10} lg={10}>
                                          <img
                                            draggable={false}
                                            src={`data:image/jpeg;base64,${data?.displayPicture}`}
                                            width='33px'
                                            height='33px'
                                            alt=''
                                          />
                                          <span
                                            className={styles["Name_cards"]}>
                                            {data.userName}
                                          </span>
                                        </Col>
                                        <Col sm={2} md={2} lg={2}>
                                          <img
                                            draggable={false}
                                            src={CrossIcon}
                                            className='cursor-pointer'
                                            width='14px'
                                            alt=''
                                            height='14px'
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
                className='d-flex justify-content-end'>
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
      <Notification open={open} setOpen={setOpen} />
    </section>
  );
};

export default AgendaContributorsModal;
