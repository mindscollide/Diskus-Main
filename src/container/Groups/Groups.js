import { Container, Row, Col } from "react-bootstrap";
import styles from "./Groups.module.css";
import { Button, Modal, Notification } from "../../components/elements";
import NoGroupsData from "../../assets/images/No-Group.svg";
import React, { useEffect, useState } from "react";
import ModalArchivedGroups from "../ModalArchivedGroups/ModalArchivedGroups";
import { useTranslation } from "react-i18next";
import CreateGroup from "./MainGroup/CreateGroup/CreateGroup";
import UpdateGroupPage from "./MainGroup/UpdateGroup/UpdateGroupPage";
import ViewGrouppage from "./MainGroup/ViewGrouppage/ViewGrouppage";
import archivedbtn from "../../assets/images/archivedbtn.png";
import ModalActivegroup from "../ModalActiveGroup/ModalActivegroup";
import Card from "../../components/elements/Card/Card";
import { useDispatch, useSelector } from "react-redux";
import GroupIcon from "../../assets/images/Path 636.png";
import {
  clearMessagesGroup,
  getbyGroupID,
  getGroups,
  realtimeGroupStatusResponse,
  updateGroupStatus,
  createGroupPageFlag,
  updateGroupPageFlag,
  viewGroupPageFlag,
  validateEncryptedStringViewGroupsListLinkApi,
  validateEncryptedStringViewGroupDetailLinkApi,
} from "../../store/actions/Groups_actions";
import {
  GetAllUsers,
  GetAllUsersGroupsRoomsList,
  GetGroupMessages,
  activeChat,
} from "../../store/actions/Talk_action";
import {
  recentChatFlag,
  headerShowHideStatus,
  footerShowHideStatus,
  createShoutAllScreen,
  addNewChatScreen,
  footerActionStatus,
  createGroupScreen,
  chatBoxActiveFlag,
  activeChatBoxGS,
} from "../../store/actions/Talk_Feature_actions";
import { Plus } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../commen/functions/customPagination/Paginations";
import { showMessage } from "../../components/elements/snack_bar/utill";
import { useGroupsContext } from "../../context/GroupsContext";

const Groups = () => {
  const { t } = useTranslation();

  //Context For Groups
  const { ViewGroupPage, setViewGroupPage, showModal, setShowModal } =
    useGroupsContext();
  const GroupsReducerrealtimeGroupStatus = useSelector(
    (state) => state.GroupsReducer.realtimeGroupStatus
  );

  const GroupsReducerArcheivedGroups = useSelector(
    (state) => state.GroupsReducer.ArcheivedGroups
  );

  const GroupsReducerrealtimeGroupCreateResponse = useSelector(
    (state) => state.GroupsReducer.realtimeGroupCreateResponse
  );

  const GroupsReducergetAllGroupsResponse = useSelector(
    (state) => state.GroupsReducer.getAllGroupsResponse
  );

  const GroupsReducerremoveGroupMember = useSelector(
    (state) => state.GroupsReducer.removeGroupMember
  );

  const GroupsReducerResponseMessage = useSelector(
    (state) => state.GroupsReducer.ResponseMessage
  );

  const GroupsReducercreateGroupPageFlag = useSelector(
    (state) => state.GroupsReducer.createGroupPageFlag
  );

  const GroupsReducerupdateGroupPageFlag = useSelector(
    (state) => state.GroupsReducer.updateGroupPageFlag
  );

  const GroupsReducerviewGroupPageFlag = useSelector(
    (state) => state.GroupsReducer.viewGroupPageFlag
  );

  const talkStateDataAllUserChats = useSelector(
    (state) => state.talkStateData.AllUserChats
  );

  const [modalStatusChange, setModalStatusChange] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [showActiveGroup, setShowActivegroup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewGroupTab, setViewGroupTab] = useState(0);
  const [ViewGroupID, setViewGroupID] = useState(0);
  const [updateComponentpage, setUpdateComponentpage] = useState(false);
  const [creategrouppage, setCreategrouppage] = useState(false);
  const [groupsData, setgroupsData] = useState([]);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [totalLength, setTotalLength] = useState(0);
  const [groupStatusUpdateData, setGroupStatusUpdateData] = useState({
    StatusID: 0,
    GroupID: 0,
  });
  const [uniqCardID, setUniqCardID] = useState(0);
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));

  //Current User ID
  let currentUserId = localStorage.getItem("userID");

  //Current Organization
  let currentOrganizationId = localStorage.getItem("organizationID");

  useEffect(() => {
    const groupList = localStorage.getItem("groupList");
    const groupListViewId = localStorage.getItem("groupView_Id");
    if (
      JSON.parse(localStorage.getItem("NotificationClickArchivedGroup")) ===
      true
    ) {
      setShowModal(true);
    }
    if (
      JSON.parse(localStorage.getItem("NotificationClickAddedIntoGroup")) ===
      true
    ) {
      // For Notification Added in the Group
      setViewGroupPage(true);
      dispatch(viewGroupPageFlag(true));
    }
    localStorage.setItem("groupsCurrent", 1);
    dispatch(getGroups(navigate, t, 1));

    if (groupList !== null) {
      const callApi = async () => {
        // Validate the encrypted committee view ID
        const getResponse = await dispatch(
          validateEncryptedStringViewGroupsListLinkApi(groupList, navigate, t)
        );

        if (getResponse.isExecuted === true && getResponse.responseCode === 1) {
          localStorage.setItem("groupsCurrent", 1);
          dispatch(getGroups(navigate, t, 1));
        }
        localStorage.removeItem("groupList"); // Cleanup the localStorage key
      };
      callApi(); // Invoke the API call
    }
    if (groupListViewId !== null) {
      const callApi = async () => {
        // Validate the encrypted committee view ID
        const getResponse = await dispatch(
          validateEncryptedStringViewGroupDetailLinkApi(
            groupListViewId,
            navigate,
            t
          )
        );

        if (getResponse.isExecuted === true && getResponse.responseCode === 1) {
          localStorage.setItem("ViewGroupID", getResponse.response.groupID);
          setViewGroupTab(1);
          setViewGroupPage(true);
          dispatch(viewGroupPageFlag(true));
        } else if (
          getResponse.isExecuted === false &&
          getResponse.responseCode === 2
        ) {
          localStorage.setItem("groupsCurrent", 1);
          dispatch(getGroups(navigate, t, 1));
        }
        localStorage.removeItem("groupView_Id"); // Cleanup the localStorage key
      };
      callApi(); // Invoke the API call
    }
    return () => {
      setShowModal(false);
      localStorage.removeItem("NotificationClickArchivedGroup", false);
      setUpdateComponentpage(false);
      setViewGroupPage(false);
      dispatch(createGroupPageFlag(false));
      dispatch(updateGroupPageFlag(false));
      dispatch(viewGroupPageFlag(false));
      localStorage.removeItem("groupsArCurrent");
      localStorage.removeItem("ViewGroupID");
    };
  }, []);

  useEffect(() => {
    if (GroupsReducerrealtimeGroupStatus !== null) {
      let status = GroupsReducerrealtimeGroupStatus.groupStatusID;
      if (status === 2) {
        let findGroupIndex = groupsData.findIndex(
          (data, index) =>
            data.groupID === GroupsReducerrealtimeGroupStatus.groupID
        );
        if (findGroupIndex !== -1) {
          let newArr = [...groupsData];
          newArr.splice(findGroupIndex, 1);
          setgroupsData(newArr);
          dispatch(realtimeGroupStatusResponse(null));
        }
      } else if (status === 1 || status === 3) {
        if (
          GroupsReducerArcheivedGroups !== null &&
          GroupsReducerArcheivedGroups.groups.length > 0
        ) {
          let findisExist = GroupsReducerArcheivedGroups.groups.findIndex(
            (data, index) =>
              Number(data.groupID) ===
              Number(GroupsReducerrealtimeGroupStatus.groupID)
          );
          if (findisExist !== -1) {
            let findGroupData =
              GroupsReducerArcheivedGroups.groups[findisExist];
            let modifiedData = { ...findGroupData, groupStatusID: status };
            setgroupsData([modifiedData, ...groupsData]);
          }
        } else {
          let findGroupIndex = groupsData.findIndex(
            (data, index) =>
              data.groupID === GroupsReducerrealtimeGroupStatus.groupID
          );
          if (findGroupIndex !== -1) {
            let newArr = groupsData.map((data, index) => {
              if (findGroupIndex === index) {
                let newData = {
                  ...data,
                  groupStatusID: GroupsReducerrealtimeGroupStatus.groupStatusID,
                };
                return newData;
              }
              return data;
            });
            setgroupsData(newArr);
          }
        }
      }
    }
  }, [GroupsReducerrealtimeGroupStatus]);

  const handleClickMeetingTab = (data) => {
    setViewGroupTab(4);
    localStorage.setItem("ViewGroupID", data.groupID);
    setViewGroupPage(true);
    dispatch(viewGroupPageFlag(true));
  };

  const handlePollsClickTab = (data) => {
    setViewGroupTab(3);
    localStorage.setItem("ViewGroupID", data.groupID);
    setViewGroupPage(true);
    dispatch(viewGroupPageFlag(true));
  };
  const handleTasksClickTab = (data) => {
    setViewGroupTab(2);
    localStorage.setItem("ViewGroupID", data.groupID);
    setViewGroupPage(true);
    dispatch(viewGroupPageFlag(true));
  };

  useEffect(() => {
    if (GroupsReducerrealtimeGroupCreateResponse !== null) {
      let MQttgroupData = GroupsReducerrealtimeGroupCreateResponse;
      let newData = {
        ...MQttgroupData,
        groupMembers: [...MQttgroupData.groupMembers],
      };
      setgroupsData([newData, ...groupsData]);
    }
  }, [GroupsReducerrealtimeGroupCreateResponse]);

  useEffect(() => {
    try {
      if (
        GroupsReducergetAllGroupsResponse !== null &&
        GroupsReducergetAllGroupsResponse !== undefined
      ) {
        if (GroupsReducergetAllGroupsResponse?.groups?.length > 0) {
          setTotalLength(GroupsReducergetAllGroupsResponse.totalRecords);
          let copyData = [...GroupsReducergetAllGroupsResponse?.groups];
          // Create a new copy of committeeMembers array for each committee
          const updateGroups = copyData.map((groups) => ({
            ...groups,
            groupMembers: [...groups.groupMembers],
          }));

          setgroupsData(updateGroups);
        } else {
          setgroupsData([]);
        }
      } else {
        setgroupsData([]);
      }
    } catch (error) {}
  }, [GroupsReducergetAllGroupsResponse]);

  useEffect(() => {
    try {
      if (GroupsReducerremoveGroupMember !== null) {
        let groupRemoveMemberData = GroupsReducerremoveGroupMember.groups;
        setgroupsData((groupremover) => {
          return groupremover.filter((groupData, index) => {
            return groupData.groupID !== groupRemoveMemberData.groupID;
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [GroupsReducerremoveGroupMember]);

  const handlechange = (value) => {
    localStorage.setItem("groupsCurrent", value);
    dispatch(getGroups(navigate, t, value));
  };

  const archivedmodaluser = (e) => {
    setShowModal(true);
  };

  const groupModal = async (e) => {
    dispatch(createGroupPageFlag(true));
    setCreategrouppage(true);
  };

  const viewTitleModal = (data) => {
    localStorage.setItem("ViewGroupID", data.groupID);
    setViewGroupTab(1);
    setViewGroupPage(true);
    dispatch(viewGroupPageFlag(true));
  };
  const viewmodal = (groupID, statusID) => {
    if (statusID === 1) {
      localStorage.setItem("ViewGroupID", groupID);
      setViewGroupTab(1);
      dispatch(viewGroupPageFlag(true));
      setViewGroupPage(true);
    } else if (statusID === 2) {
    } else if (statusID === 3) {
      dispatch(
        getbyGroupID(
          navigate,
          groupID,
          t,
          setViewGroupPage,
          setUpdateComponentpage,
          statusID
        )
      );
    }
  };

  const discussionGroupChat = (data) => {
    if (data.talkGroupID !== 0) {
      let allChatMessages =
        talkStateDataAllUserChats.AllUserChatsData.allMessages;
      const foundRecord = allChatMessages.find(
        (item) => item.id === data.talkGroupID
      );
      if (foundRecord) {
        dispatch(activeChat(foundRecord));
        localStorage.setItem("activeOtoChatID", data.talkGroupID);
        dispatch(createShoutAllScreen(false));
        dispatch(addNewChatScreen(false));
        dispatch(footerActionStatus(false));
        dispatch(createGroupScreen(false));
        dispatch(chatBoxActiveFlag(false));
        dispatch(recentChatFlag(true));
        dispatch(activeChatBoxGS(true));
        dispatch(chatBoxActiveFlag(true));
        dispatch(headerShowHideStatus(true));
        dispatch(footerShowHideStatus(true));
        let chatGroupData = {
          UserID: parseInt(currentUserId),
          ChannelID: currentOrganizationId,
          GroupID: data.talkGroupID,
          NumberOfMessages: 50,
          OffsetMessage: 0,
        };
        dispatch(GetGroupMessages(navigate, chatGroupData, t));
        dispatch(
          GetAllUsers(
            navigate,
            parseInt(currentUserId),
            parseInt(currentOrganizationId),
            t
          )
        );
        dispatch(
          GetAllUsersGroupsRoomsList(
            navigate,
            parseInt(currentUserId),
            parseInt(currentOrganizationId),
            t
          )
        );
      } else {
        showMessage(t("Talk-group-doesnt-exist"), "error", setOpen);
      }
    } else {
      showMessage(t("No-talk-group-created"), "error", setOpen);
    }
  };

  const handleDocumentsClickTab = (data) => {
    localStorage.setItem("ViewGroupID", data.groupID);
    setViewGroupTab(1);
    setViewGroupPage(true);
    dispatch(viewGroupPageFlag(true));
  };

  const changeHandleStatus = (e, CardID, setEditdropdown) => {
    setStatusValue(e.key);
    setModalStatusChange(true);
    setEditdropdown(false);
    setGroupStatusUpdateData({
      GroupID: JSON.parse(CardID),
      StatusID: JSON.parse(e.value),
    });
  };

  const handleStatusUpdate = async () => {
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
      GroupID: groupStatusUpdateData.GroupID,
      GroupStatusId: groupStatusUpdateData.StatusID,
      OrganizationID: JSON.parse(OrganizationID),
    };
    await dispatch(updateGroupStatus(navigate, Data, t, setModalStatusChange));
    setGroupStatusUpdateData({
      GroupID: 0,
      StatusID: 0,
    });
    setStatusValue("");
  };

  useEffect(() => {
    if (
      GroupsReducerResponseMessage !== "" &&
      GroupsReducerResponseMessage !== t("No-data-available")
    ) {
      showMessage(GroupsReducerResponseMessage, "success", setOpen);
      dispatch(clearMessagesGroup());
    } else {
      dispatch(clearMessagesGroup());
    }
  }, [GroupsReducerResponseMessage]);

  const isCurrentUserCreator = (data) => {
    return (
      data.creatorID === Number(currentUserId) && isCurrentUserMember(data)
    );
  };

  // Define a function to check if the current user is a member
  const isCurrentUserMember = (data) => {
    return data.groupMembers.some(
      (member) => member.pK_UID === Number(currentUserId)
    );
  };

  const openNotification = () => {
    showMessage(t("Not-a-member-of-talk-group"), "success", setOpen);
  };

  return (
    <>
      <div className={styles["Groupscontainer"]}>
        {creategrouppage && GroupsReducercreateGroupPageFlag === true ? (
          <>
            <CreateGroup setCreategrouppage={setCreategrouppage} />
          </>
        ) : updateComponentpage && GroupsReducerupdateGroupPageFlag === true ? (
          <>
            <UpdateGroupPage setUpdateComponentpage={setUpdateComponentpage} />
          </>
        ) : ViewGroupPage && GroupsReducerviewGroupPageFlag === true ? (
          <>
            <ViewGrouppage
              setViewGroupPage={setViewGroupPage}
              viewGroupTab={viewGroupTab}
              ViewGroupID={ViewGroupID}
            />
          </>
        ) : (
          <>
            <Row className='mt-3'>
              <Col
                md={4}
                sm={4}
                lg={4}
                className='d-flex gap-3 align-items-center '>
                <span className={styles["Groups-heading-size"]}>
                  {t("Groups")}
                </span>
                <Button
                  className={styles["create-Group-btn"]}
                  text={t("Create-new-group")}
                  onClick={groupModal}
                  icon={<Plus width={20} height={20} fontWeight={800} />}
                />
              </Col>

              <Col
                lg={8}
                md={8}
                sm={8}
                className='d-flex justify-content-end align-items-center gap-1 mt-2 '>
                <Button
                  className={styles["Archived-Group-btn"]}
                  text={t("Archived-groups")}
                  onClick={archivedmodaluser}
                  icon={
                    <img
                      draggable='false'
                      src={archivedbtn}
                      className={styles["archivedbtnIcon"]}
                      alt=''
                    />
                  }
                />
              </Col>
            </Row>

            <Row className='mt-4'>
              <Col lg={12} sm={12} md={12}>
                <Row
                  className={`${"d-flex text-center  color-5a5a5a m-0 p-0"} ${
                    styles["groups_box"]
                  }`}>
                  <Col sm={12} md={12} lg={12} className='m-0 p-0'>
                    <Row>
                      {groupsData.length > 0 ? (
                        groupsData.map((data, index) => {
                          return (
                            <Col lg={3} md={3} sm={12} className='mb-3'>
                              <Card
                                setUniqCardID={setUniqCardID}
                                uniqCardID={uniqCardID}
                                key={index}
                                groupState={true}
                                CardID={data.groupID}
                                StatusID={data.groupStatusID}
                                associatedTags={data.listOfCommittees}
                                handleMeetingClickOption={() => {
                                  handleClickMeetingTab(data);
                                }}
                                handleTasksClickOption={() => {
                                  handleTasksClickTab(data);
                                }}
                                handlePollsClickOption={() => {
                                  handlePollsClickTab(data);
                                }}
                                handleClickDocumentOption={() => {
                                  handleDocumentsClickTab(data);
                                }}
                                creatorId={data.creatorID}
                                flag={false}
                                Icon={
                                  <img
                                    draggable='false'
                                    src={GroupIcon}
                                    height='29.23px'
                                    width='32.39px'
                                    alt=''
                                  />
                                }
                                handleClickDiscussion={
                                  data.talkGroupID !== 0
                                    ? isCurrentUserCreator(data)
                                      ? () => discussionGroupChat(data)
                                      : isCurrentUserMember(data)
                                      ? () => discussionGroupChat(data)
                                      : () => openNotification()
                                    : null
                                }
                                discussionMenuClass={
                                  data.talkGroupID !== 0
                                    ? isCurrentUserCreator(data) ||
                                      isCurrentUserMember(data)
                                      ? "discussion-menu"
                                      : "discussion-menu disabled"
                                    : "discussion-menu disabled"
                                }
                                titleOnCLick={() => viewTitleModal(data)}
                                profile={data.groupMembers}
                                onClickFunction={() =>
                                  viewmodal(data.groupID, data.groupStatusID)
                                }
                                BtnText={
                                  data.groupStatusID === 1
                                    ? t("View-group")
                                    : data.groupStatusID === 2
                                    ? t("View-group")
                                    : data.groupStatusID === 3
                                    ? t("Update-group")
                                    : ""
                                }
                                CardHeading={data?.groupTitle}
                                changeHandleStatus={changeHandleStatus}
                              />
                            </Col>
                          );
                        })
                      ) : (
                        <Col
                          sm={12}
                          lg={12}
                          md={12}
                          className={styles["NoGroupsData"]}>
                          <Row>
                            <Col>
                              <img
                                draggable='false'
                                src={NoGroupsData}
                                alt=''
                              />
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className={styles["NoGroupsDataFoundText"]}>
                              {t("You-dont-have-any-group-yet")}
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className={styles["NoGroupsDataFoundText"]}>
                              {t("Click-create-new-group")}
                            </Col>

                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className='d-flex justify-content-center mt-3'>
                              <Button
                                className={styles["create-Group-btn"]}
                                text={t("Create-new-group")}
                                onClick={groupModal}
                                icon={
                                  <Plus
                                    width={20}
                                    height={20}
                                    fontWeight={800}
                                  />
                                }
                              />
                            </Col>
                          </Row>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* pagination */}
            {groupsData.length > 0 && (
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={
                    "pagination-groups-table d-flex justify-content-center"
                  }>
                  <span className={styles["PaginationStyle-Committee"]}>
                    <CustomPagination
                      total={totalLength}
                      current={currentPage}
                      pageSize={8}
                      onChange={handlechange}
                      showSizer={false}
                    />
                  </span>
                </Col>
              </Row>
            )}
          </>
        )}
      </div>
      {showModal ? (
        <ModalArchivedGroups
          archivedCommittee={showModal}
          setArchivedCommittee={setShowModal}
          setViewGroupPage={setViewGroupPage}
          setUpdateComponentpage={setUpdateComponentpage}
        />
      ) : null}
      {modalStatusChange ? (
        <Modal
          show={modalStatusChange}
          onHide={() => {
            setModalStatusChange(false);
          }}
          setShow={setModalStatusChange}
          modalFooterClassName='d-block'
          centered
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col
                    lg={12}
                    sm={12}
                    md={12}
                    className='d-flex justify-content-center'>
                    <span
                      className={styles["heading-modal-active-contfirmation"]}>
                      {t("Are-you-sure-you-want-to")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    sm={12}
                    md={12}
                    className='d-flex justify-content-center'>
                    <span
                      className={styles["heading-modal-active-contfirmation"]}>
                      {statusValue || ""} {t("this-group?")}
                    </span>
                  </Col>
                </Row>
              </Container>
            </>
          }
          ModalFooter={
            <>
              <Row>
                <Col
                  lg={6}
                  sm={6}
                  md={6}
                  className='d-flex justify-content-end'>
                  <Button
                    text={t("Confirm")}
                    className={styles["Confirm-activegroup-modal"]}
                    onClick={handleStatusUpdate}
                  />
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={6}
                  className='d-flex justify-content-start'>
                  <Button
                    text={t("Cancel")}
                    className={styles["Cancel-activegroup-modal"]}
                    onClick={() => setModalStatusChange(false)}
                  />
                </Col>
              </Row>
            </>
          }
        />
      ) : null}
      {showActiveGroup ? (
        <ModalActivegroup
          Activegroup={showActiveGroup}
          setActivegroup={setShowActivegroup}
          setViewGroupPage={setViewGroupPage}
        />
      ) : null}

      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default Groups;
