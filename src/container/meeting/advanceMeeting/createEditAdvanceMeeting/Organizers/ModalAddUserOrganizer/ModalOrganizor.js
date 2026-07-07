import React, { useState, useEffect, useMemo } from "react";
import styles from "./ModalOrganizor.module.css";
import { Modal, Button } from "../../../../../../components/elements";
import {
  showAddUserModal,
  showNotifyOrganizors,
} from "../../../../../../store/actions/NewMeetingActions";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import committeeicon from "../../../../../../assets/images/committeedropdown.svg";
import CrossIcon from "../../../../../../assets/images/CrossIcon.svg";
import {
  GetAllCommitteesUsersandGroups,
  meetingOrganizers,
  selectedMeetingOrganizers,
} from "../../../../../../store/actions/MeetingOrganizers_action";
import { useDispatch, useSelector } from "react-redux";
import GroupIcon from "../../../../../../assets/images/groupdropdown.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const ModalOrganizor = () => {
  const { t } = useTranslation();
  const animatedComponents = makeAnimated();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state,
  );

  const committeeInfo = useSelector(
    (state) => state.CommitteeReducer.viewCommitteeDetails,
  );

  const groupInfo = useSelector(
    (state) => state.GroupsReducer.viewGroupDetails,
  );

  const currentMeetingInfo = useSelector(
    (state) => state.NewMeetingreducer.currentMeetingInfo,
  );

  const [membersOrganizers, setMembersOrganizers] = useState([]);
  const [organizersSave, setOrganizersSave] = useState([]);
  const [selectedsearch, setSelectedsearch] = useState([]);

  // -------------------------
  // dropdown
  // -------------------------
  const dropdowndata = useMemo(() => {
    const data = MeetingOrganizersReducer.AllUserCommitteesGroupsData;
    if (!data) return [];

    let temp = [];

    if (groupInfo) {
      const group = data.groups?.find((g) => g.groupID === groupInfo.groupID);

      return (
        group?.groupUsers?.map((u) => ({
          value: u.userID,
          name: u.userName,
          label: (
            <Row>
              <Col className='d-flex gap-2 align-items-center'>
                <img
                  src={`data:image/jpeg;base64,${u?.profilePicture?.displayProfilePictureName}`}
                  className={styles["UserProfilepic"]}
                  width='18'
                  height='18'
                  alt=''
                />
                <span className={styles["NameDropDown"]}>{u.userName}</span>
              </Col>
            </Row>
          ),
          type: 3,
        })) || []
      );
    }

    if (committeeInfo) {
      const committee = data.committees?.find(
        (c) => c.committeeID === committeeInfo.committeeID,
      );

      return (
        committee?.committeeUsers?.map((u) => ({
          value: u.userID,
          name: u.userName,
          label: (
            <Row>
              <Col className='d-flex gap-2 align-items-center'>
                <img
                  src={`data:image/jpeg;base64,${u?.profilePicture?.displayProfilePictureName}`}
                  className={styles["UserProfilepic"]}
                  width='18'
                  height='18'
                  alt=''
                />
                <span className={styles["NameDropDown"]}>{u.userName}</span>
              </Col>
            </Row>
          ),
          type: 3,
        })) || []
      );
    }

    data.groups?.forEach((g) =>
      temp.push({
        value: g.groupID,
        name: g.groupName,
        label: (
          <Row>
            <Col className='d-flex gap-2 align-items-center'>
              <img src={GroupIcon} width='18' height='18' alt='' />
              <span>{g.groupName}</span>
            </Col>
          </Row>
        ),
        type: 1,
      }),
    );

    data.committees?.forEach((c) =>
      temp.push({
        value: c.committeeID,
        name: c.committeeName,
        label: (
          <Row>
            <Col className='d-flex gap-2 align-items-center'>
              <img src={committeeicon} width='18' height='18' alt='' />
              <span>{c.committeeName}</span>
            </Col>
          </Row>
        ),
        type: 2,
      }),
    );

    data.organizationUsers?.forEach((u) =>
      temp.push({
        value: u.userID,
        name: u.userName,
        label: (
          <Row>
            <Col className='d-flex gap-2 align-items-center'>
              <img
                src={`data:image/jpeg;base64,${u?.profilePicture?.displayProfilePictureName}`}
                width='18'
                height='18'
                alt=''
              />
              <span>{u.userName}</span>
            </Col>
          </Row>
        ),
        type: 3,
      }),
    );

    return temp;
  }, [MeetingOrganizersReducer, committeeInfo, groupInfo]);

  // -------------------------
  // ADD USERS (FIXED)
  // -------------------------
  const handleAddUsers = () => {
    const data = MeetingOrganizersReducer.AllUserCommitteesGroupsData;

    if (!selectedsearch?.length) return;

    let tem = [...membersOrganizers];
    let tem2 = [...organizersSave];

    const ids = new Set(tem.map((u) => u.userID));

    const addUser = (user) => {
      const id = user.userID || user.pK_UID;
      if (!id || ids.has(id)) return;

      tem.push({
        userName: user.userName,
        userID: id,
        displayPicture: user?.profilePicture?.displayProfilePictureName || "",
        email: user.emailAddress,
        isPrimaryOrganizer: false,
        isOrganizerNotified: true,
        organizerTitle: "",
        rsvp: false,
        isDeletable: true,
        disabledTitle: false,
        disabledRSVP: true,
        disabledNotification: true,
        disabledSwitch: true,
        NotificationMessage: "",
        isEdit: false,
        attendeeAvailability: 1,
      });

      tem2.push({
        UserID: id,
        isPrimaryOrganizer: false,
        isOrganizerNotified: true,
        organizerTitle: "",
      });

      ids.add(id);
    };

    selectedsearch.forEach((s) => {
      if (s.type === 1) {
        data.groups
          ?.find((g) => g.groupID === s.value)
          ?.groupUsers?.forEach(addUser);
      }

      if (s.type === 2) {
        data.committees
          ?.find((c) => c.committeeID === s.value)
          ?.committeeUsers?.forEach(addUser);
      }

      if (s.type === 3) {
        const user = data.organizationUsers?.find((u) => u.userID === s.value);
        if (user) addUser(user);
      }
    });

    setMembersOrganizers([...tem]);
    setOrganizersSave([...tem2]);
    setSelectedsearch([]);
  };

  // -------------------------
  // API CALL
  // -------------------------
  useEffect(() => {
    if (currentMeetingInfo?.meetingID) {
      dispatch(
        GetAllCommitteesUsersandGroups(
          { MeetingID: currentMeetingInfo.meetingID },
          navigate,
          t,
        ),
      );
    }
  }, [currentMeetingInfo?.meetingID]);

  useEffect(() => {
    return () => dispatch(meetingOrganizers([]));
  }, []);

  const saveOrganizers = () => {
    dispatch(showAddUserModal(false));
    dispatch(showNotifyOrganizors(true));
    dispatch(meetingOrganizers(membersOrganizers));
    dispatch(selectedMeetingOrganizers(organizersSave));
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <Modal
      show={NewMeetingreducer.adduserModal}
      onHide={() => dispatch(showAddUserModal(false))}
      size='md'
      modalFooterClassName={"d-block"}
      ModalBody={
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className={styles["OverAll_styling"]}>
              {/* HEADER */}
              <Row>
                <Col lg={5} md={5} sm={12}>
                  <span className={styles["Add_organization"]}>
                    {t("Add-organizers")}
                  </span>
                </Col>

                <Col
                  lg={7}
                  md={7}
                  sm={12}
                  className='d-flex justify-content-end'>
                  <img
                    draggable={false}
                    src={BlackCrossIcon}
                    alt=''
                    className='cursor-pointer'
                    width='16px'
                    height='16px'
                    onClick={() => dispatch(showAddUserModal(false))}
                  />
                </Col>
              </Row>

              {/* SELECT ROW */}
              <Row className='mt-3'>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='group-fields d-flex align-items-center gap-2'>
                  <Select
                    onChange={setSelectedsearch}
                    value={selectedsearch}
                    classNamePrefix='selectMember'
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={dropdowndata}
                    isSearchable
                  />

                  <Button
                    text={t("ADD")}
                    className={styles["ADD_Btn_CreatePool_Modal"]}
                    onClick={handleAddUsers}
                  />
                </Col>
              </Row>

              {/* USERS LIST */}
              <Row className={styles["Scroller_For_CreatePollModal2"]}>
                {membersOrganizers.map((data, index) => (
                  <Col lg={6} md={6} sm={12} className='mt-2' key={data.userID}>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Padding_Class"]}>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <Row className={styles["Card_border2"]}>
                              {/* LEFT SIDE USER INFO */}
                              <Col
                                sm={10}
                                md={10}
                                lg={10}
                                className='d-flex align-items-center'>
                                <img
                                  draggable={false}
                                  src={`data:image/jpeg;base64,${data.displayPicture}`}
                                  width='33px'
                                  height='33px'
                                  alt=''
                                />

                                <span className={styles["Name_cards"]}>
                                  {data.userName}
                                </span>
                              </Col>

                              {/* DELETE ICON */}
                              <Col sm={2} md={2} lg={2}>
                                <img
                                  src={CrossIcon}
                                  width='14px'
                                  height='14px'
                                  draggable='false'
                                  style={{ cursor: "pointer" }}
                                  alt=''
                                  onClick={() => {
                                    setMembersOrganizers((prev) =>
                                      prev.filter((_, i) => i !== index),
                                    );

                                    setOrganizersSave((prev) =>
                                      prev.filter((_, i) => i !== index),
                                    );
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </>
      }
      ModalFooter={
        <Row>
          <Col lg={12} md={12} sm={12} className='d-flex justify-content-end'>
            {membersOrganizers.length > 0 && (
              <Button
                text={t("Done")}
                className={styles["Done_btn_organizor_modal"]}
                onClick={saveOrganizers}
              />
            )}
          </Col>
        </Row>
      }
    />
  );
};

export default ModalOrganizor;
