import React, { useEffect, useState } from "react";
import { Button, Notification } from "../../../components/elements";

import ViewModal from "../../meeting/quickMeeting/ViewQuickMeeting";
import { Col, Row } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import styles from "./Meeting.module.css";
import { useSelector } from "react-redux";
import ReactBootstrapDropdown from "react-bootstrap/Dropdown";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import UpdateQuickMeeting from "../../meeting/quickMeeting/UpdateQuickMeeting/UpdateQuickMeeting";
import CreateQuickMeeting from "../../meeting/quickMeeting/CreateQuickMeeting/CreateQuickMeeting";
import {
  activeChatBoxGS,
  addNewChatScreen,
  chatBoxActiveFlag,
  createGroupScreen,
  createShoutAllScreen,
  footerActionStatus,
  footerShowHideStatus,
  headerShowHideStatus,
  recentChatFlag,
} from "../../../store/actions/Talk_Feature_actions";
import { getMeetingByCommitteeIdApi } from "../../../store/actions/Committee_actions";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import {
  setAdvanceMeetingRoute,
  setProposedMeetingRoute,
  toggleCreateEditMeetingModal,
  toggleCreateEditProposedMeetingModal,
} from "../../../store/actions/ModalStates_actions";
import CommitteePublishedMeetingList from "./committeePublishMeetings";
import CommitteeProposedMeetings from "./committeeProposedMeetings";
import CommitteeDraftMeetings from "./committeeDraftMeetings";
import { useCommitteeContext } from "../../../context/CommitteeContext";
import { activeChat } from "../../../store/actions/Talk_action";
import { useMeetingContext } from "../../../context/MeetingContext";
import { useNewMeetingContext } from "../../../context/NewMeetingContext";
import { showMessage } from "../../../components/elements/snack_bar/utill";
import { clearMessegesUserManagement } from "../../../store/actions/UserManagementActions";
import { clearResponseNewMeetingReducerMessage } from "../../../store/actions/NewMeetingActions";
import { clearResponseMessage } from "../../../store/actions/MeetingAgenda_action";

const CommitteeMeetingTab = ({ committeeStatus }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ResponseMessages = useSelector(
    (state) => state.MeetingOrganizersReducer.ResponseMessage,
  );
  const ResponseMessage = useSelector(
    (state) => state.NewMeetingreducer.ResponseMessage,
  );
  const ResponseMessageUserMangementReducer = useSelector(
    (state) => state.UserMangementReducer.ResponseMessage,
  );
  const {
    currentCommitteeMeetingTabActive,
    setCurrentCommitteeMeetingTabActive,
  } = useCommitteeContext();
  const {
    isQuickMeetingCreate,
    isQuickMeetingUpdate,
    isQuickMeetingView,
    setIsQuickMeetingCreate,
  } = useNewMeetingContext();
  const AllUserChats = useSelector((state) => state.talkStateData.AllUserChats);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  let userID = localStorage.getItem("userID");

  let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

  useEffect(() => {
    let searchData = {
      CommitteeID: Number(ViewCommitteeID),
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 30,
      PublishedMeetings:
        currentCommitteeMeetingTabActive === 2
          ? false
          : currentCommitteeMeetingTabActive === 1
            ? true
            : false,
      ProposedMeetings: currentCommitteeMeetingTabActive === 2 ? true : false,
    };
    dispatch(getMeetingByCommitteeIdApi(navigate, t, searchData));

    return () => {
      setCurrentCommitteeMeetingTabActive(1);
    };
  }, []);

  const handleClickTabNavigate = (value) => {
    setCurrentCommitteeMeetingTabActive(value);

    let searchData = {
      CommitteeID: Number(ViewCommitteeID),
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 30,
      PublishedMeetings: value === 2 ? false : value === 1 ? true : false,
      ProposedMeetings: value === 2 ? true : false,
    };
    dispatch(getMeetingByCommitteeIdApi(navigate, t, searchData));
  };

  const [talkGroupID, setTalkGroupID] = useState(0);

  useEffect(() => {
    if (
      AllUserChats?.AllUserChatsData !== null &&
      AllUserChats?.AllUserChatsData !== undefined &&
      Object.keys(AllUserChats?.AllUserChatsData).length > 0 &&
      talkGroupID !== 0
    ) {
      let allChatMessages = AllUserChats?.AllUserChatsData;
      const foundRecord = allChatMessages.allMessages.find(
        (item) => item.id === talkGroupID,
      );
      if (foundRecord) {
        dispatch(activeChat(foundRecord));
      }
      localStorage.setItem("activeOtoChatID", talkGroupID);
      setTalkGroupID(0);
    }
  }, [AllUserChats.AllUserChatsData, talkGroupID]);

  useEffect(() => {
    try {
      if (
        ResponseMessages !== "" &&
        ResponseMessages !== undefined &&
        ResponseMessages !== "" &&
        ResponseMessages !== t("No-records-found") &&
        ResponseMessages !== t("No-record-found")
      ) {
        showMessage(ResponseMessages, "success", setOpen);
        dispatch(clearResponseMessage(""));
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  }, [ResponseMessages]);

  useEffect(() => {
    try {
      if (
        ResponseMessage !== "" &&
        ResponseMessage !== t("No-record-found") &&
        ResponseMessage !== t("No-records-found") &&
        ResponseMessage !== "" &&
        ResponseMessage !== t("List-updated-successfully") &&
        ResponseMessage !== t("No-data-available") &&
        ResponseMessage !== t("Successful") &&
        ResponseMessage !== t("Record-updated") &&
        ResponseMessage !== t("Something-went-wrong") &&
        ResponseMessage !== undefined
      ) {
        showMessage(ResponseMessages, "success", setOpen);
        dispatch(clearResponseNewMeetingReducerMessage(""));
      }
    } catch (error) {
      console.log(error);
    }
  }, [ResponseMessage]);

  useEffect(() => {
    try {
      if (
        ResponseMessageUserMangementReducer !== "" &&
        ResponseMessageUserMangementReducer !== undefined
      ) {
        showMessage(ResponseMessageUserMangementReducer, "error", setOpen);
        dispatch(clearMessegesUserManagement());
      }
    } catch (error) {
      console.log(error);
    }
  }, [ResponseMessageUserMangementReducer]);

  const handelCreateMeeting = () => {
    setIsQuickMeetingCreate(true);
  };

  const handleCreateAdvanceMeeting = () => {
    dispatch(setAdvanceMeetingRoute(1));
    dispatch(toggleCreateEditMeetingModal(true));
  };

  const openProposedNewMeetingPage = () => {
    dispatch(setProposedMeetingRoute(1));
    dispatch(toggleCreateEditProposedMeetingModal(true));
  };

  return (
    <>
      {isQuickMeetingCreate && (
        <CreateQuickMeeting
          show={isQuickMeetingCreate}
          // this is check from where its called 6 is from committee create
          checkFlag={6}
        />
      )}
      {isQuickMeetingView && <ViewModal viewFlag={isQuickMeetingView} />}
      {isQuickMeetingUpdate && (
        <UpdateQuickMeeting
          editFlag={isQuickMeetingUpdate}
          // this is check from where its called 6 is from committee create
          checkFlag={6}
        />
      )}
      <Row>
        <Col lg={6} md={6} sm={6}>
          <span className={styles["PaperStylesMeetingTwoPage"]}>
            {/* Tab navigation buttons */}
            <Row>
              <Col lg={12} md={12} sm={12} className='d-flex gap-2'>
                <Button
                  text={t("Published")}
                  className={
                    currentCommitteeMeetingTabActive === 1
                      ? styles["meetingTab-active"]
                      : styles["meetingTab"]
                  }
                  onClick={() => handleClickTabNavigate(1)}
                />
                <Button
                  text={t("Draft")}
                  className={
                    currentCommitteeMeetingTabActive === 3
                      ? styles["meetingTab-active"]
                      : styles["meetingTab"]
                  }
                  onClick={() => handleClickTabNavigate(3)}
                />
                <Button
                  text={t("Proposed")}
                  className={
                    currentCommitteeMeetingTabActive === 2
                      ? styles["meetingTab-active"]
                      : styles["meetingTab"]
                  }
                  onClick={() => handleClickTabNavigate(2)}
                />
              </Col>
            </Row>

            {/* Pagination section - Currently commented out */}
          </span>
        </Col>
        <Col sm={6} md={6} lg={6} className='d-flex justify-content-end'>
          {committeeStatus === 3 && (
            <ReactBootstrapDropdown
              className='SceduleMeetingButton d-inline-block position-relative ms-2'
              // onClick={eventClickHandler}
            >
              <ReactBootstrapDropdown.Toggle title={t("Schedule-a-meeting")}>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["schedule_button"]}>
                    <Plus width={20} height={20} fontWeight={800} />
                    <span> {t("Schedule-a-meeting")}</span>
                  </Col>
                </Row>
              </ReactBootstrapDropdown.Toggle>

              <ReactBootstrapDropdown.Menu>
                {/* Quick meeting option - Feature ID 1 */}
                {checkFeatureIDAvailability(1) ? (
                  <ReactBootstrapDropdown.Item
                    className={styles["dropdown-item"]}
                    onClick={handelCreateMeeting}>
                    {t("Quick-meeting")}
                  </ReactBootstrapDropdown.Item>
                ) : null}

                {/* Advance meeting option - Feature ID 9 */}
                {checkFeatureIDAvailability(9) ? (
                  <ReactBootstrapDropdown.Item
                    className={styles["dropdown-item"]}
                    onClick={handleCreateAdvanceMeeting}>
                    {t("Advance-meeting")}
                  </ReactBootstrapDropdown.Item>
                ) : null}

                {/* Propose new meeting option - Feature ID 12 */}
                {checkFeatureIDAvailability(12) ? (
                  <>
                    <ReactBootstrapDropdown.Item
                      className={styles["dropdown-item"]}
                      onClick={openProposedNewMeetingPage}>
                      {t("Propose-new-meeting")}
                    </ReactBootstrapDropdown.Item>
                  </>
                ) : null}
              </ReactBootstrapDropdown.Menu>
            </ReactBootstrapDropdown>
            // <Button
            //   text={t("Create-Meeting")}
            //   icon={<img draggable={false} src={addmore} alt='' />}
            //   className={styles["Create_Meeting_Button"]}
            //   onClick={handelCreateMeeting}
            // />
          )}
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={12} lg={12}>
          {/* Conditional rendering of meeting lists based on selected tab */}
          {currentCommitteeMeetingTabActive === 2 ? (
            <CommitteeProposedMeetings />
          ) : currentCommitteeMeetingTabActive === 3 ? (
            <CommitteeDraftMeetings />
          ) : currentCommitteeMeetingTabActive === 1 ? (
            <CommitteePublishedMeetingList />
          ) : null}
        </Col>
      </Row>
      {/* <Row>
        <Col sm={12} md={12} lg={12}>
          <Table
            column={MeetingColoumns}
            scroll={scroll}
            rows={rows}
            pagination={false}
            size='small'
            className='newMeetingTable'
            locale={{
              emptyText: emptyText(),
            }}
          />
        </Col>
        {rows && rows.length > 0 ? (
          <Col
            sm={12}
            md={12}
            lg={12}
            className={
              "pagination-groups-table position-absolute bottom-20  d-flex justify-content-center"
            }>
            <span className='PaginationStyle-TodoList'>
              <CustomPagination
                current={Number(currentPage)}
                showSizer={true}
                onChange={handleChangePagination}
                pageSizeOptionsValues={["30", "50", "100", "200"]}
                total={totalRecords}
                pageSize={pageSize}
              />
            </span>
          </Col>
        ) : null}
      </Row> */}
      <Notification open={open} setOpen={setOpen}  />
    </>
  );
};

export default CommitteeMeetingTab;
