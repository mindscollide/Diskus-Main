import React, { useEffect, useState, useMemo } from "react";
import styles from "./AddParticipant.module.css";
import {
  Modal,
  Button,
  Notification,
} from "../../../../../../components/elements";
import {
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
import { showMessage } from "../../../../../../components/elements/snack_bar/utill";
import { GetAllCommitteesUsersandGroups } from "../../../../../../store/actions/MeetingOrganizers_action";
const AddParticipantModal = ({ setrspvRows, rspvRows }) => {
  const animatedComponents = makeAnimated();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state
  );

  const committeeInfo = useSelector(
    (state) => state.CommitteeReducer.viewCommitteeDetails
  );

  const groupInfo = useSelector(
    (state) => state.GroupsReducer.viewGroupDetails
  );

  const { meetingID = 0 } = useSelector(
    (state) => state.NewMeetingreducer.currentMeetingInfo
  );

  const [selectedsearch, setSelectedsearch] = useState([]);
  const [membersParticipants, setMembersParticipants] = useState([]);
  const [addParticipantDropdown, setAddParticipantDropdown] = useState([]);
  const [open, setOpen] = useState({ open: false, message: "", severity: "error" });


  useEffect(() => {
    let Data = {
      MeetingID: meetingID,
    };
    dispatch(GetAllCommitteesUsersandGroups(Data, navigate, t));
  },[])
  // ===============================
  // LABEL HELPER (REMOVE DUPLICATION)
  // ===============================
  const renderLabel = (img, name, isBase64 = false) => (
    <Row>
      <Col className="d-flex gap-2 align-items-center">
        <img
          src={isBase64 ? `data:image/jpeg;base64,${img}` : img}
          alt=""
          className={styles["UserProfilepic"]}
          width="18"
          height="18"
        />
        <span className={styles["NameDropDown"]}>{name}</span>
      </Col>
    </Row>
  );

  // ===============================
  // ADD PARTICIPANTS (FIXED + SAFE)
  // ===============================
  const handleAddUsers = () => {
    
  
    const data = MeetingOrganizersReducer.AllUserCommitteesGroupsData;
  
    const safeSelected = Array.isArray(selectedsearch)
      ? selectedsearch
      : [];
  
    
    
  
    if (!safeSelected.length) {
      
      return;
    }
  
    if (!data) {
      
      return;
    }
  
    let tem = [...membersParticipants];
  
    safeSelected.forEach((item) => {
      
  
      if (item.type === 3) {
        const user = data.organizationUsers?.find(
          (u) => u.userID === item.value
        );
  
        
  
        if (user) {
          tem.push({
            userName: user.userName,
            userID: user.userID,
            displayPicture:
              user?.profilePicture?.displayProfilePictureName,
            email: user.emailAddress,
            isRSVP: false,
            participantRole: {
              participantRole: "Participant",
              participantRoleID: 2,
            },
            isComingApi: false,
            attendeeAvailability: 1,
            Title: "",
          });
        }
      }
    });
  
    
  
    setMembersParticipants([...tem]);
    setSelectedsearch([]);
  };
  // ===============================
  // LOAD DROPDOWN (FIXED FLOW)
  // ===============================
  useEffect(() => {
    const data = MeetingOrganizersReducer.AllUserCommitteesGroupsData;
    if (!data) return;

    let temp = [];

    // GROUP MODE
    if (groupInfo) {
      const group = data.groups?.find(
        (g) => g.groupID === groupInfo.groupID
      );

      if (group?.groupUsers?.length) {
        temp = group.groupUsers.map((u) => ({
          value: u.userID,
          name: u.userName,
          label: renderLabel(
            u?.profilePicture?.displayProfilePictureName,
            u.userName,
            true
          ),
          type: 3,
        }));
      }
    }

    // COMMITTEE MODE
    else if (committeeInfo) {
      const committee = data.committees?.find(
        (c) => c.committeeID === committeeInfo.committeeID
      );

      if (committee?.committeeUsers?.length) {
        temp = committee.committeeUsers.map((u) => ({
          value: u.userID,
          name: u.userName,
          label: renderLabel(
            u?.profilePicture?.displayProfilePictureName,
            u.userName,
            true
          ),
          type: 3,
        }));
      }
    }

    // DEFAULT MODE
    else {
      data.groups?.forEach((g) =>
        temp.push({
          value: g.groupID,
          name: g.groupName,
          label: renderLabel(GroupIcon, g.groupName),
          type: 1,
        })
      );

      data.committees?.forEach((c) =>
        temp.push({
          value: c.committeeID,
          name: c.committeeName,
          label: renderLabel(committeeicon, c.committeeName),
          type: 2,
        })
      );

      data.organizationUsers?.forEach((u) =>
        temp.push({
          value: u.userID,
          name: u.userName,
          label: renderLabel(
            u?.profilePicture?.displayProfilePictureName,
            u.userName,
            true
          ),
          type: 3,
        })
      );
    }

    setAddParticipantDropdown(temp);
  }, [MeetingOrganizersReducer.AllUserCommitteesGroupsData, committeeInfo, groupInfo]);

  // ===============================
  // FILTER FIX (SAFE)
  // ===============================
  const customFilter = (option, input) =>
    option?.data?.name?.toLowerCase?.().includes(input.toLowerCase());

  // ===============================
  // REMOVE PARTICIPANT
  // ===============================
  const RemovedParticipant = (index) => {
    const updated = [...membersParticipants];
    updated.splice(index, 1);
    setMembersParticipants(updated);
  };

  // ===============================
  // DONE BUTTON
  // ===============================
  const handleClickDone = () => {
    if (!membersParticipants.length) {
      showMessage(
        t("Atleast-one-participant-should-be-selected"),
        "error",
        setOpen
      );
      return;
    }

    const merged = [...rspvRows, ...membersParticipants];

    const unique = [
      ...new Map(merged.map((item) => [item.userID, item])).values(),
    ];

    setrspvRows(unique);
    dispatch(showAddParticipantsModal(false));
  };

  // ===============================
  // UI
  // ===============================
  return (
    <section>
      <Modal
        show={NewMeetingreducer.participantModal}
        setShow={dispatch(showAddParticipantsModal)}
        size="md"
        onHide={() => dispatch(showAddParticipantsModal(false))}
        ModalBody={
          <>
            <Row>
              <Col className={styles["OverAll_padding"]}>
                <Row>
                  <Col>
                    <span className={styles["Add_organization"]}>
                      {t("Add-participants")}
                    </span>
                  </Col>
                  <Col className="text-end">
                    <img
                      src={BlackCrossIcon}
                      onClick={() => dispatch(showAddParticipantsModal(false))}
                      className="cursor-pointer"
                      width="16"
                      height="16"
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col className="d-flex gap-2">
                    <Select
                      isMulti
                      options={addParticipantDropdown}
                      value={selectedsearch}
                      onChange={setSelectedsearch}
                      className="w-100"
                      classNamePrefix="selectMember"
                      components={animatedComponents}
                      filterOption={customFilter}
                      closeMenuOnSelect={false}
                      isSearchable={true}
                    />

                    <Button
                      text={t("ADD")}
                      onClick={handleAddUsers}
                      className={styles["ADD_Btn_CreatePool_Modal"]}
                    />
                  </Col>
                </Row>

                <Row className={styles["Scroller_For_CreatePollModal2"]}>
                  {membersParticipants.map((data, index) => (
                    <Col lg={6} key={data.userID}>
                      <Row className={styles["Card_border2"]}>
                        <Col className="d-flex align-items-center">
                          <img
                            src={`data:image/jpeg;base64,${data.displayPicture}`}
                            width="33"
                            height="33"
                          />
                          <span className={styles["Name_cards"]}>
                            {data.userName}
                          </span>
                        </Col>

                        <Col className="text-end">
                          <img
                            src={CrossIcon}
                            onClick={() => RemovedParticipant(index)}
                            width="14"
                            height="14"
                            className="cursor-pointer"
                          />
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
          membersParticipants.length > 0 && (
            <Button
              text={t("Done")}
              onClick={handleClickDone}
              className={styles["Done_btn_organizor_modal"]}
            />
          )
        }
      />

      <Notification open={open} setOpen={setOpen} />
    </section>
  );
};

export default AddParticipantModal;