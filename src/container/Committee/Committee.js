import { Container, Row, Col } from "react-bootstrap";
import styles from "./Committee.module.css";
import { Button, Loader, Notification } from "../../components/elements";
import React, { useEffect, useState } from "react";
import NoCommitteeImg from "../../assets/images/No-Committee.svg";
import { useTranslation } from "react-i18next";
import archivedbtn from "../../assets/images/archivedbtn.png";
import plusbutton from "../../assets/images/Group 119.svg";
import ModalActivegroup from "../ModalActiveGroup/ModalActivegroup";
import CreateCommittee from "../../components/elements/CreateCommittee/CreateCommittee";
import UpdateCommittee from "../../components/elements/UpdateCommittee/UpdateCommittee";
import ViewUpdateCommittee from "../../components/elements/ViewUpdateCommittee/ViewUpdateCommittee";
import ModalMarketingTeamCommittee from "../ModalMarketingTeamCommittee/ModalMarketingTeamCommittee";
import committeeicon from "../../assets/images/Group 2584.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getallcommitteebyuserid_clear,
  getCommitteesbyCommitteeId,
  realtimeCommitteeStatusResponse,
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

const Committee = () => {
  const { CommitteeReducer, LanguageReducer, talkStateData, DataRoomReducer } =
    useSelector((state) => state);
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
  });
  const [mapgroupsData, setMapGroupData] = useState(null);

  useEffect(() => {
    if (currentPage !== null) {
      dispatch(getAllCommitteesByUserIdActions(navigate, t, currentPage));
    } else {
      localStorage.removeItem("CoArcurrentPage");
      localStorage.setItem("CocurrentPage", 1);
      dispatch(getAllCommitteesByUserIdActions(navigate, t, 1));
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
                  CommitteeReducer.realtimeCommitteeStatus.committeeStatusID,
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
  }, [CommitteeReducer.realtimeCommitteeStatus]);

  useEffect(() => {
    if (CommitteeReducer.realtimeCommitteeCreateResponse !== null) {
      let committeeData = CommitteeReducer.realtimeCommitteeCreateResponse;
      let newCommitteeData = {
        committeesTitle: committeeData.committeesTitle,
        committeeID: committeeData.committeeID,
        userCount: committeeData.userCount,
        committeeMembers: committeeData.committeeMembers,
        committeeStatusID: committeeData.committeeStatusID,
        listofGroups: committeeData.listOfGroups,
      };

      setGetCommitteeData([newCommitteeData, ...getcommitteedata]);
    }
  }, [CommitteeReducer.realtimeCommitteeCreateResponse]);

  const archivedmodaluser = async (e) => {
    setShowModal(true);
  };

  const groupModal = async (e) => {
    setCreategrouppage(true);
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
    // let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
    // let Data = {
    //   CommitteeID: JSON.parse(data.committeeID),
    //   OrganizationId: OrganizationID,
    // };
    // dispatch(
    //   getCommitteesbyCommitteeId(
    //     navigate,
    //     Data,
    //     t,
    //     setViewGroupPage,
    //     setUpdateComponentpage,
    //     1
    //   )
    // );
  };

  // Click on title
  const viewTitleModal = (data) => {
    setViewCommitteeViewTab(1);
    localStorage.setItem("ViewCommitteeID", data.committeeID);
    setViewGroupPage(true);
    // let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
    // let Data = {
    //   CommitteeID: JSON.parse(data.committeeID),
    //   OrganizationId: OrganizationID,
    // };
    // dispatch(
    //   getCommitteesbyCommitteeId(
    //     navigate,
    //     Data,
    //     t,
    //     setViewGroupPage,
    //     setUpdateComponentpage,
    //     1
    //   )
    // );
  };

  const viewUpdateModal = (committeeID, CommitteeStatusID) => {
    if (CommitteeStatusID === 1) {
      setViewCommitteeViewTab(1);
      localStorage.setItem("ViewCommitteeID", CommitteeStatusID);
      setViewGroupPage(true);
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
      console.log("discussionGroupChat", data);
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
      let allChatMessages =
        talkStateData.AllUserChats.AllUserChatsData.allMessages;
      const foundRecord = allChatMessages.find(
        (item) => item.id === data.talkGroupID
      );
      if (foundRecord) {
        dispatch(activeChat(foundRecord));
      }
      localStorage.setItem("activeOtoChatID", data.talkGroupID);
    } else {
      setOpen({
        ...open,
        flag: true,
        message: "No Talk Group Created",
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
      }, 3000);
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
    // dispatch(viewDetailsCommitteeID(data.committeeID));
    // setViewCommitteeID(data.committeeID);
    // dispatch(
    //   getCommitteesbyCommitteeId(
    //     navigate,
    //     Data,
    //     t,
    //     setViewGroupPage,
    //     setUpdateComponentpage,
    //     CommitteeStatusID
    //   )
    // );
  };
  const handlePollsClickTab = (data) => {
    // setViewCommitteeID(data.committeeID);
    localStorage.setItem("ViewCommitteeID", data.committeeID);
    setViewCommitteeViewTab(3);
    setViewGroupPage(true);
    // dispatch(viewDetailsCommitteeID(data.committeeID));
    // dispatch(
    //   getCommitteesbyCommitteeId(
    //     navigate,
    //     Data,
    //     t,
    //     setViewGroupPage,
    //     setUpdateComponentpage,
    //     CommitteeStatusID
    //   )
    // );
  };
  const handleTasksClickTab = (data) => {
    setViewCommitteeViewTab(2);
    setViewGroupPage(true);
    localStorage.setItem("ViewCommitteeID", data.committeeID);
    // dispatch(viewDetailsCommitteeID(data.committeeID));
    // setViewCommitteeID(data.committeeID);

    // dispatch(
    //   getCommitteesbyCommitteeId(
    //     navigate,
    //     Data,
    //     t,
    //     setViewGroupPage,
    //     setUpdateComponentpage,
    //     CommitteeStatusID
    //   )
    // );
  };
  useEffect(() => {
    if (
      CommitteeReducer.ResponseMessage !== "" &&
      CommitteeReducer.ResponseMessage !== undefined &&
      CommitteeReducer.ResponseMessage !== t("Data-available") &&
      CommitteeReducer.ResponseMessage !== t("No-data-available")
    ) {
      setOpen({
        ...open,
        open: true,
        message: CommitteeReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(getallcommitteebyuserid_clear());
    } else {
      dispatch(getallcommitteebyuserid_clear());
    }
  }, [CommitteeReducer.ResponseMessage]);

  return (
    <>
      <div className={styles["CommitteeContainer"]}>
        {creategrouppage ? (
          <>
            <CreateCommittee setCreategrouppage={setCreategrouppage} />
          </>
        ) : updateComponentpage ? (
          <>
            <UpdateCommittee setUpdateComponentpage={setUpdateComponentpage} />
          </>
        ) : ViewGroupPage ? (
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
              <Col
                lg={12}
                md={12}
                sm={12}
                // className={styles["Committee-Main_Scrollbar"]}
              >
                <Row
                  className={`${"d-flex text-center committees_box  MontserratSemiBold-600 color-5a5a5a m-0 p-0  mt-1"} ${
                    styles["committess_box"]
                  }`}
                >
                  <Col sm={12} md={12} lg={12} className="m-0 p-0 mt-2 ">
                    <Row>
                      {getcommitteedata.length > 0 ? (
                        getcommitteedata.map((data, index) => {
                          return (
                            <Col lg={3} md={3} sm={12} className="mb-3">
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
                                    ? () => discussionGroupChat(data)
                                    : null
                                }
                                discussionMenuClass={
                                  data.talkGroupID !== 0
                                    ? "discussion-menu"
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
                              {t("Click-create-new-committee-to-get-started.")}
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
                <Col lg={4} md={4} sm={4}></Col>
                <Col
                  lg={4}
                  md={4}
                  sm={4}
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
                <Col lg={4} md={4} sm={4}></Col>
              </Row>
            )}
            {/* pagination */}
          </>
        )}
      </div>
      {LanguageReducer.Loading || DataRoomReducer.Loading ? <Loader /> : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
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
      {/* {modalsure ? (
        <ModalAreyousureActive
          Activegroup={modalsure}
          setActivegroup={setModalsure}
          editFlag={editFlag}
          setEditFlag={setEditFlag}
        />
      ) : null} */}
    </>
  );
};

export default Committee;
