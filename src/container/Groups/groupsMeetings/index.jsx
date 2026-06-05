import React, { useEffect, useState } from "react";
import { Button } from "../../../components/elements";

import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./Meeting.module.css";
import { useSelector } from "react-redux";
import ReactBootstrapDropdown from "react-bootstrap/Dropdown";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import UpdateQuickMeeting from "../../meeting/quickMeeting/UpdateQuickMeeting/UpdateQuickMeeting";
import CreateQuickMeeting from "../../meeting/quickMeeting/CreateQuickMeeting/CreateQuickMeeting";
import ViewModal from "../../meeting/quickMeeting/ViewQuickMeeting";

import { activeChat } from "../../../store/actions/Talk_action";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import {
  setAdvanceMeetingRoute,
  setProposedMeetingRoute,
  toggleCreateEditMeetingModal,
  toggleCreateEditProposedMeetingModal,
} from "../../../store/actions/ModalStates_actions";

import {
  getMeetingbyGroupIdApi,
  resetViewGroupDetails,
} from "../../../store/actions/Groups_actions";
import { useGroupsContext } from "../../../context/GroupsContext";
import GroupProposedMeetings from "./groupProposedMeetings";
import GroupDraftMeetings from "./groupDraftMeetings";
import GroupPublishedMeetingList from "./groupPublishMeetings";
import { useNewMeetingContext } from "../../../context/NewMeetingContext";
import { Plus } from "react-bootstrap-icons";

const GroupMeetingTab = ({ groupStatus }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentGroupMeetingTabActive, setCurrentGroupMeetingTabActive } =
    useGroupsContext();
  // Context for meeting state management
  const {
    isQuickMeetingCreate,
    setIsQuickMeetingCreate,
    isQuickMeetingUpdate,
    isQuickMeetingView,
  } = useNewMeetingContext();
  const AllUserChats = useSelector((state) => state.talkStateData.AllUserChats);

  let userID = localStorage.getItem("userID");

  let ViewGroupID = localStorage.getItem("ViewGroupID");

  useEffect(() => {
    let searchData = {
      GroupID: Number(ViewGroupID),
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 30,
      PublishedMeetings: currentGroupMeetingTabActive === 1 ? true : false,
      ProposedMeetings: currentGroupMeetingTabActive === 2 ? true : false,
    };
    dispatch(getMeetingbyGroupIdApi(navigate, t, searchData));
  }, []);

  const handleClickTabNavigate = (value) => {
    setCurrentGroupMeetingTabActive(value);

    let searchData = {
      GroupID: Number(ViewGroupID),
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 30,
      PublishedMeetings: value === 1 ? true : false,
      ProposedMeetings: value === 2 ? true : false,
    };
    dispatch(getMeetingbyGroupIdApi(navigate, t, searchData));
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
          // this is check from where its called 6 is from group create
          checkFlag={7}
        />
      )}
      {isQuickMeetingView && <ViewModal />}
      {isQuickMeetingUpdate && (
        <UpdateQuickMeeting
          // this is check from where its called 6 is from group create
          checkFlag={8}
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
                    currentGroupMeetingTabActive === 1
                      ? styles["meetingTab-active"]
                      : styles["meetingTab"]
                  }
                  onClick={() => handleClickTabNavigate(1)}
                />
                <Button
                  text={t("Draft")}
                  className={
                    currentGroupMeetingTabActive === 3
                      ? styles["meetingTab-active"]
                      : styles["meetingTab"]
                  }
                  onClick={() => handleClickTabNavigate(3)}
                />
                <Button
                  text={t("Proposed")}
                  className={
                    currentGroupMeetingTabActive === 2
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
          {groupStatus === 3 && (
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
          {currentGroupMeetingTabActive === 2 ? (
            <GroupProposedMeetings />
          ) : currentGroupMeetingTabActive === 3 ? (
            <GroupDraftMeetings />
          ) : currentGroupMeetingTabActive === 1 ? (
            <GroupPublishedMeetingList />
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
    </>
  );
};

export default GroupMeetingTab;
