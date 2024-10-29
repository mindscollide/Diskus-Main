import { Container, Row, Col } from "react-bootstrap";
import styles from "./Committee.module.css";
import { Button, Notification } from "../../components/elements";
import React, { useEffect, useState } from "react";
import NoCommitteeImg from "../../assets/images/No-Committee.svg";
import { useTranslation } from "react-i18next";
import archivedbtn from "../../assets/images/archivedbtn.png";
import plusbutton from "../../assets/images/Group 119.svg";
import ModalActivegroup from "../ModalActiveGroup/ModalActivegroup";
import CreateCommittee from "./MainCommittee/CreateCommittee/CreateCommittee";
import UpdateCommittee from "./MainCommittee/UpdateCommittee/UpdateCommittee";
import ViewUpdateCommittee from "./MainCommittee/ViewUpdateCommittee/ViewUpdateCommittee";
import ModalMarketingTeamCommittee from "../ModalMarketingTeamCommittee/ModalMarketingTeamCommittee";
import committeeicon from "../../assets/images/Group 2584.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getallcommitteebyuserid_clear,
  getCommitteesbyCommitteeId,
  realtimeCommitteeStatusResponse,
  createCommitteePageFlag,
  viewCommitteePageFlag,
  realtimeCommitteeResponse,
} from "../../store/actions/Committee_actions";
import { getAllCommitteesByUserIdActions } from "../../store/actions/Committee_actions";
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
import Card from "../../components/elements/Card/Card";
import ModalArchivedCommittee from "../ModalArchivedCommittee/ModalArchivedCommittee";
import { useNavigate } from "react-router-dom";
import CommitteeStatusModal from "../../components/elements/committeeChangeStatusModal/CommitteeStatusModal";
import CustomPagination from "../../commen/functions/customPagination/Paginations";
import { showMessage } from "../../components/elements/snack_bar/utill";

const Committee = () => {
  const { CommitteeReducer, talkStateData } = useSelector((state) => state);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showActiveGroup, setShowActivegroup] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  let currentPage = JSON.parse(localStorage.getItem("CocurrentPage"));
  const [editFlag, setEditFlag] = useState(false);
  const [changeStatusModal, setChangeStatusModal] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState(null);
  const [updateComponentpage, setUpdateComponentpage] = useState(false);
  const [ViewGroupPage, setViewGroupPage] = useState(false);
  const [creategrouppage, setCreategrouppage] = useState(false);
  const [marketingTeamModal, setMarketingTeamModal] = useState(false);
  const [committeeID, setCommitteeID] = useState(0);
  const [viewCommitteeTab, setViewCommitteeViewTab] = useState(0);
  const [getcommitteedata, setGetCommitteeData] = useState([]);
  const [uniqCardID, setUniqCardID] = useState(0);
  const [ViewcommitteeID, setViewCommitteeID] = useState(0);
  //Current User ID
  let currentUserId = localStorage.getItem("userID");

  //Current Organization
  let currentOrganizationId = localStorage.getItem("organizationID");
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [mapgroupsData, setMapGroupData] = useState(null);

  useEffect(() => {
    try {
      if (currentPage !== null) {
        dispatch(getAllCommitteesByUserIdActions(navigate, t, currentPage));
      } else {
        localStorage.removeItem("CoArcurrentPage");
        localStorage.setItem("CocurrentPage", 1);
        dispatch(getAllCommitteesByUserIdActions(navigate, t, 1));
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, []);

  useEffect(() => {
    try {
      if (
        CommitteeReducer.GetAllCommitteesByUserIDResponse !== null &&
        CommitteeReducer.GetAllCommitteesByUserIDResponse !== undefined
      ) {
        setTotalRecords(
          CommitteeReducer.GetAllCommitteesByUserIDResponse.totalRecords
        );

        if (
          CommitteeReducer.GetAllCommitteesByUserIDResponse.committees.length >
          0
        ) {
          let copyData = [
            ...CommitteeReducer.GetAllCommitteesByUserIDResponse?.committees,
          ];
          // Create a new copy of committeeMembers array for each committee
          const updatedCommittees = copyData.map((committee) => ({
            ...committee,
            committeeMembers: [...committee.committeeMembers],
          }));

          setGetCommitteeData(updatedCommittees);
        } else {
          setGetCommitteeData([]);
        }
      } else {
        setGetCommitteeData([]);
      }
    } catch {}
  }, [CommitteeReducer.GetAllCommitteesByUserIDResponse]);

  useEffect(() => {
    try {
      if (CommitteeReducer.realtimeCommitteeStatus !== null) {
        let status = CommitteeReducer.realtimeCommitteeStatus.committeeStatusID;
        if (status === 2) {
          let findINdexCommitteeStatus = getcommitteedata.findIndex(
            (data, index) =>
              data.committeeID ===
              CommitteeReducer.realtimeCommitteeStatus.commmitteeID
          );
          if (findINdexCommitteeStatus !== -1) {
            let newData = [...getcommitteedata];
            newData.splice(findINdexCommitteeStatus, 1);
            setGetCommitteeData(newData);
            dispatch(realtimeCommitteeStatusResponse(null));
          }
        } else if (status === 1 || status === 3) {
          if (
            CommitteeReducer.ArcheivedCommittees !== null &&
            CommitteeReducer.ArcheivedCommittees.committees.length > 0
          ) {
            let findisExist =
              CommitteeReducer.ArcheivedCommittees.committees.findIndex(
                (data, index) =>
                  Number(data.groupID) ===
                  Number(CommitteeReducer.realtimeCommitteeStatus.commmitteeID)
              );
            if (findisExist !== -1) {
              let findGroupData =
                CommitteeReducer.ArcheivedCommittees.committees[findisExist];
              let modifiedData = {
                ...findGroupData,
                groupStatusID: status,
              };
              setGetCommitteeData([modifiedData, ...getcommitteedata]);
            }
          } else {
            let findINdexCommitteeStatus = getcommitteedata.findIndex(
              (data, index) =>
                data.committeeID ===
                CommitteeReducer.realtimeCommitteeStatus.commmitteeID
            );
            if (findINdexCommitteeStatus !== -1) {
              let newArr = getcommitteedata.map((committeeCard, index) => {
                if (findINdexCommitteeStatus === index) {
                  let newData = {
                    ...committeeCard,
                    committeeStatusID:
                      CommitteeReducer.realtimeCommitteeStatus
                        .committeeStatusID,
                  };
                  return newData;
                }
                return committeeCard;
              });
              setGetCommitteeData(newArr);
              dispatch(realtimeCommitteeStatusResponse(null));
            }
          }
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [CommitteeReducer.realtimeCommitteeStatus]);

  useEffect(() => {
    try {
      if (CommitteeReducer.realtimeCommitteeCreateResponse !== null) {
        let committeeData = CommitteeReducer.realtimeCommitteeCreateResponse;
        let CommitteeMembers = [...committeeData.committeeMembers];
        let newCommitteeData = {
          committeesTitle: committeeData.committeesTitle,
          committeeID: committeeData.committeeID,
          userCount: committeeData.userCount,
          committeeMembers: CommitteeMembers,
          committeeStatusID: committeeData.committeeStatusID,
          listofGroups: committeeData.listOfGroups,
          creatorId: committeeData.creatorID,
        };

        setGetCommitteeData([newCommitteeData, ...getcommitteedata]);

        dispatch(realtimeCommitteeResponse(null));
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [CommitteeReducer.realtimeCommitteeCreateResponse]);

  useEffect(() => {
    try {
      if (CommitteeReducer.removeCommitteeMember !== null) {
        let committeeDataR = CommitteeReducer.removeCommitteeMember.committees;
        let ViewCommitteeIDOpened = localStorage.getItem("ViewCommitteeID");
        setGetCommitteeData((committeeremover) => {
          return committeeremover.filter((commiteeData, index) => {
            return commiteeData.committeeID !== committeeDataR.committeeID;
          });
        });
        if (ViewGroupPage && CommitteeReducer.viewCommitteePageFlag === true) {
          if (
            Number(committeeDataR.committeeID) === Number(ViewCommitteeIDOpened)
          ) {
            setViewGroupPage(false);
            dispatch(viewCommitteePageFlag(false));
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [CommitteeReducer.removeCommitteeMember]);

  const archivedmodaluser = async (e) => {
    setShowModal(true);
  };

  const groupModal = async (e) => {
    setCreategrouppage(true);
    dispatch(createCommitteePageFlag(true));
  };

  const showMarketingModal = (id) => {
    setMarketingTeamModal(true);
    setCommitteeID(id);
    if (getcommitteedata.length > 0) {
      let findMapGroups = getcommitteedata.filter(
        (data, index) => data.committeeID === id
      );
      setMapGroupData(findMapGroups);
    }
  };

  // Click on Documents Tab
  const handleDocumentsClickTab = (data) => {
    setViewCommitteeViewTab(1);
    localStorage.setItem("ViewCommitteeID", data.committeeID);
    setViewGroupPage(true);
    dispatch(viewCommitteePageFlag(true));
  };

  // Click on title
  const viewTitleModal = (data) => {
    setViewCommitteeViewTab(1);
    localStorage.setItem("ViewCommitteeID", data.committeeID);
    setViewGroupPage(true);
    dispatch(viewCommitteePageFlag(true));
  };

  const viewUpdateModal = (committeeID, CommitteeStatusID) => {
    if (CommitteeStatusID === 1) {
      setViewCommitteeViewTab(1);
      localStorage.setItem("ViewCommitteeID", CommitteeStatusID);
      setViewGroupPage(true);
      dispatch(viewCommitteePageFlag(true));
    } else {
      let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
      let Data = {
        CommitteeID: JSON.parse(committeeID),
        OrganizationId: OrganizationID,
      };
      dispatch(
        getCommitteesbyCommitteeId(
          navigate,
          Data,
          t,
          setViewGroupPage,
          setUpdateComponentpage,
          CommitteeStatusID
        )
      );
    }
  };

  const discussionGroupChat = (data) => {
    if (data.talkGroupID !== 0) {
      let allChatMessages =
        talkStateData.AllUserChats.AllUserChatsData.allMessages;
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
        showMessage(t("No-talk-group-created"), "error", setOpen);
      }
    } else {
      showMessage(t("No-talk-group-created"), "error", setOpen);
    }
  };

  const handlechange = (value) => {
    localStorage.setItem("CocurrentPage", value);
    dispatch(getAllCommitteesByUserIdActions(navigate, t, value));
  };

  const changeHandleStatus = (e, CardID) => {
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
      CommitteeId: JSON.parse(CardID),
      CommitteeStatusId: JSON.parse(e.value),
      OrganizationID: JSON.parse(OrganizationID),
    };
    setStatusUpdateData(Data);
    setChangeStatusModal(true);
  };

  const handleClickMeetingTab = (data) => {
    setViewCommitteeViewTab(4);
    localStorage.setItem("ViewCommitteeID", data.committeeID);
    setViewGroupPage(true);
    dispatch(viewCommitteePageFlag(true));
  };
  const handlePollsClickTab = (data) => {
    localStorage.setItem("ViewCommitteeID", data.committeeID);
    setViewCommitteeViewTab(3);
    setViewGroupPage(true);
    dispatch(viewCommitteePageFlag(true));
  };
  const handleTasksClickTab = (data) => {
    setViewCommitteeViewTab(2);
    setViewGroupPage(true);
    dispatch(viewCommitteePageFlag(true));
    localStorage.setItem("ViewCommitteeID", data.committeeID);
  };
  useEffect(() => {
    try {
      if (
        CommitteeReducer.ResponseMessage !== "" &&
        CommitteeReducer.ResponseMessage !== undefined &&
        CommitteeReducer.ResponseMessage !== t("No-data-available")
      ) {
        showMessage(CommitteeReducer.ResponseMessage, "success", setOpen);

        dispatch(getallcommitteebyuserid_clear());
      } else {
        dispatch(getallcommitteebyuserid_clear());
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [CommitteeReducer.ResponseMessage]);

  const isCurrentUserCreator = (data) => {
    return (
      data.creatorID === Number(currentUserId) && isCurrentUserMember(data)
    );
  };

  // Define a function to check if the current user is a member
  const isCurrentUserMember = (data) => {
    return data.committeeMembers.some(
      (member) => member.pK_UID === Number(currentUserId)
    );
  };

  const openNotification = () => {
    showMessage(t("Not-a-member-of-talk-group"), "error", setOpen);
  };

  return (
    <>
      <div className={styles["CommitteeContainer"]}>
        {creategrouppage &&
        CommitteeReducer.createCommitteePageFlag === true ? (
          <>
            <CreateCommittee setCreategrouppage={setCreategrouppage} />
          </>
        ) : updateComponentpage &&
          CommitteeReducer.updateCommitteePageFlag === true ? (
          <>
            <UpdateCommittee setUpdateComponentpage={setUpdateComponentpage} />
          </>
        ) : ViewGroupPage && CommitteeReducer.viewCommitteePageFlag === true ? (
          <>
            <ViewUpdateCommittee
              setViewGroupPage={setViewGroupPage}
              viewCommitteeTab={viewCommitteeTab}
              ViewcommitteeID={ViewcommitteeID}
            />
          </>
        ) : (
          <>
            <Row className="mt-3">
              <Col md={6} sm={6} lg={6} className="d-flex gap-3 ">
                <span className={styles["Committee-heading-size"]}>
                  {t("Committees")}
                </span>
                <Button
                  className={styles["create-Committee-btn"]}
                  text={t("Create-new-committee")}
                  onClick={groupModal}
                  icon={
                    <img
                      draggable="false"
                      src={plusbutton}
                      height="7.6px"
                      width="7.6px"
                      className={styles["PLusICon"]}
                      alt=""
                    />
                  }
                />
              </Col>

              <Col
                lg={6}
                md={6}
                sm={6}
                className="d-flex justify-content-end mt-2 "
              >
                <Button
                  className={styles["Archived-Group-btn-Committee-section"]}
                  text={t("Archived-committees")}
                  onClick={archivedmodaluser}
                  icon={
                    <img
                      draggable="false"
                      src={archivedbtn}
                      width="18px"
                      height="18px"
                      className={styles["archivedbtnIcon"]}
                      alt=""
                    />
                  }
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={12} md={12} sm={12}>
                <Row
                  className={`${"d-flex text-center committees_box   color-5a5a5a m-0 p-0  mt-1"} ${
                    styles["committess_box"]
                  }`}
                >
                  <Col sm={12} md={12} lg={12} className="m-0 p-0 mt-2 ">
                    <Row>
                      {getcommitteedata.length > 0 ? (
                        getcommitteedata.map((data, index) => {
                          return (
                            <Col
                              lg={3}
                              md={3}
                              sm={12}
                              className="mb-3"
                              key={index}
                            >
                              <Card
                                setUniqCardID={setUniqCardID}
                                uniqCardID={uniqCardID}
                                key={index}
                                CardID={data.committeeID}
                                StatusID={data.committeeStatusID}
                                CardHeading={data.committeesTitle}
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
                                groupState={false}
                                onClickFunction={() =>
                                  viewUpdateModal(
                                    data.committeeID,
                                    data.committeeStatusID
                                  )
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
                                associatedTags={data.listofGroups}
                                flag={true}
                                assignGroupBtn={() =>
                                  showMarketingModal(data.committeeID)
                                }
                                profile={data.committeeMembers}
                                changeHandleStatus={changeHandleStatus}
                                Icon={
                                  <img
                                    draggable="false"
                                    src={committeeicon}
                                    width="32.88px"
                                    height="28.19px"
                                    alt=""
                                  />
                                }
                                BtnText={
                                  data.committeeStatusID === 1
                                    ? t("View-committee")
                                    : data.committeeStatusID === 2
                                    ? ""
                                    : data.committeeStatusID === 3
                                    ? t("Update-committee")
                                    : ""
                                }
                              />
                            </Col>
                          );
                        })
                      ) : (
                        <Col
                          sm={12}
                          lg={12}
                          md={12}
                          className={styles["CommiiteeNotFoundContainer"]}
                        >
                          <Row>
                            <Col sm={12} md={12} lg={12} className="mb-3">
                              <img
                                draggable="false"
                                src={NoCommitteeImg}
                                alt=""
                              />
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className={styles["CommitteeNotFoundText"]}
                            >
                              {t("You-dont-have-any-committee-yet")}
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className={styles["CommitteeNotFoundText"]}
                            >
                              {t("Click-create-new-committee")}
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className="d-flex justify-content-center mt-3"
                            >
                              <Button
                                className={styles["create-Committee-btn"]}
                                text={t("Create-new-committee")}
                                onClick={groupModal}
                                icon={
                                  <img
                                    draggable="false"
                                    src={plusbutton}
                                    height="7.6px"
                                    width="7.6px"
                                    className={styles["PLusICon"]}
                                    alt=""
                                  />
                                }
                              />
                            </Col>
                          </Row>

                          <p></p>
                          <p></p>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            {getcommitteedata.length > 0 && (
              <Row className="mt-2">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center "
                >
                  <Container className={styles["PaginationStyle-Committee"]}>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={"pagination-groups-table"}
                      >
                        <CustomPagination
                          total={totalRecords}
                          current={currentPage}
                          pageSize={8}
                          onChange={handlechange}
                          showSizer={false}
                        />
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            )}
          </>
        )}
      </div>
      <Notification open={open} setOpen={setOpen} />
      {showModal ? (
        <ModalArchivedCommittee
          archivedCommittee={showModal}
          setArchivedCommittee={setShowModal}
          setViewGroupPage={setViewGroupPage}
          setUpdateComponentpage={setUpdateComponentpage}
        />
      ) : null}
      {showActiveGroup ? (
        <ModalActivegroup
          Activegroup={showActiveGroup}
          setActivegroup={setShowActivegroup}
        />
      ) : null}
      {marketingTeamModal ? (
        <ModalMarketingTeamCommittee
          MarketingTeam={marketingTeamModal}
          setMarketingTeam={setMarketingTeamModal}
          editFlag={editFlag}
          committeeID={committeeID}
          setEditFlag={setEditFlag}
          mapgroupsData={mapgroupsData}
        />
      ) : null}
      {changeStatusModal && (
        <CommitteeStatusModal
          statusUpdateData={statusUpdateData}
          isActive={changeStatusModal}
          setIsActive={setChangeStatusModal}
        />
      )}
    </>
  );
};

export default Committee;
