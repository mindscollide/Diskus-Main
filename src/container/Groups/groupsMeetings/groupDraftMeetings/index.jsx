import moment from "moment";
import React, {  useMemo, useState } from "react";
import { forRecentActivity } from "@/commen/functions/date_formater";
import { Popover } from "antd";
import CustomButton from "@/components/elements/button/Button";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import {Table } from "@/components/elements";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNewMeetingContext } from "@/context/NewMeetingContext";
import { useMeetingContext } from "@/context/MeetingContext";
import CustomPagination from "@/commen/functions/customPagination/Paginations";

// Icons
import SortIconAscend from "@/assets/images/sortingIcons/SorterIconAscend.png";
import SortIconDescend from "@/assets/images/sortingIcons/SorterIconDescend.png";
import ArrowUpIcon from "@/assets/images/sortingIcons/Arrow-up.png";
import ArrowDownIcon from "@/assets/images/sortingIcons/Arrow-down.png";
import CancelMeetingIcon from "@/assets/images/New Meeting Listing Icons/CancelMeeting.png";
import ChevronDownIcon from "@/assets/images/dropdown-icon.png";
import EditIcon from "@/assets/images/New Meeting Listing Icons/EditMeeting.png";


// Styles (reuse DraftMeeting styles from existing component)
import styles from "./groupDraftMeetings.module.css";
import {
  UpdateMeetingStatusApi,
  getMeetingDetailsByMeetingIdApi,
  setCurrentMeetingInfo,
} from "@/store/actions/NewMeeting2.actions";
import {
  setViewTab,
  toggleViewMeetingModal,
} from "@/store/actions/ModalStates_actions";
import DeleteMeetingConfirmationModal from "../../../meeting/commonComponents/deleteMeetingConfirmationModal/deleteMeetingConfirmationModal";
import { getViewMeetingByMeetingIdApi } from "../../../../store/actions/NewMeeting2.actions";
import { useGroupsContext } from "../../../../context/GroupsContext";
import { getMeetingbyGroupIdApi } from "../../../../store/actions/Groups_actions";

const buildEditorRole = (record) => ({
  status: record.status,
  role: record.isParticipant
    ? "Participant"
    : record.isAgendaContributor
      ? "Agenda Contributor"
      : "Organizer",
  isPrimaryOrganizer: record.isPrimaryOrganizer,
});

const buildVideoTalk = (record) => ({
  isChat: record.isChat,
  isVideoCall: record.isVideoCall,
  talkGroupID: record.talkGroupID,
});
const GroupDraftMeetings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    groupDraftMeetingData,
    setGroupDraftMeetingData,
    groupDraftMeetingDataRecord,
    setGroupDraftMeetingDataRecord,
    currentGroupMeetingPage,
    setCurrentGroupMeetingPage,
    currentGroupMeetingLength,
    setCurrentGroupMeetingLength,
  } = useGroupsContext();

  // ─── Context ───
  const { isMeetingTypeFilter } = useNewMeetingContext();
  const {
    setDeleteMeetingRecord,
    setDeleteMeetingConfirmationModal,
    deleteMeetingConfirmationModal,
    setEditorRole,
    setVideoTalk,
  } = useMeetingContext();

  const groupInfo = useSelector(
    (state) => state.GroupsReducer.viewGroupDetails,
  );

  // ─── Local state ───
  const [meetingTitleSort, setMeetingTitleSort] = useState(null);
  const [organizerNameSort, setOrganizerNameSort] = useState(null);
  const [meetingTimeSort, setMeetingTimeSort] = useState(null);
  const [meetingDateSort, setMeetingDateSort] = useState(null);

  // ─── Handle table sorting ───
  const handleChangeMeetingTable = (pagination, filters, sorter) => {
    setMeetingTitleSort(null);
    setOrganizerNameSort(null);
    setMeetingTimeSort(null);
    setMeetingDateSort(null);
    if (sorter.order) {
      switch (sorter.columnKey) {
        case "title":
          setMeetingTitleSort(sorter.order);
          break;
        case "host":
          setOrganizerNameSort(sorter.order);
          break;
        case "time":
          setMeetingTimeSort(sorter.order);
          break;
        case "date":
          setMeetingDateSort(sorter.order);
          break;
        default:
          break;
      }
    }
  };

  // ─── More popover content ───
  const moreButtons = (record) => {
    const handleEdit = async () => {
      let Data = { MeetingID: Number(record.pK_MDID) };
      const context = "EditMeetingFromMainListing";
      const role = record.isAgendaContributor
        ? "Agenda Contributor"
        : "Organizer";
      if (record.isQuickMeeting) {
        await dispatch(
          getViewMeetingByMeetingIdApi(
            navigate,
            t,
            Data,
            "",
            {}
            // setViewFlag,
            // setEditFlag,
            // setSceduleMeeting,
            // 2,
          ),
        );
      } else if (record.isQuickMeeting === false) {
        // Set state synchronously BEFORE dispatch — no stale closure issue
        localStorage.setItem("videoCallURL", record.videoCallURL);
        setVideoTalk(buildVideoTalk(record));
        setEditorRole(buildEditorRole(record));

        // callFunc now a no-op (or pass empty function if API requires it)
        await dispatch(
          getMeetingDetailsByMeetingIdApi(
            navigate,
            t,
            { MeetingID: record.pK_MDID },
            context,
            { role, callFunc: () => {} },
          ),
        );
      }
    };

    const handleCancel = () => {
      let Data = {
        MeetingID: record.pK_MDID,
        StatusID: 4,
      };

      setDeleteMeetingRecord(Data);
      setDeleteMeetingConfirmationModal(true);
    };

    const handleClickPublish = () => {
      dispatch(
        UpdateMeetingStatusApi(
          navigate,
          t,
          { MeetingID: record.pK_MDID, StatusID: 1 },
          "publishMeetingFromdraftTable",
          { setEditorRole },
        ),
      );
    };

    return (
      <div className={styles.morebuttons}>
        <div className={styles.morebtn} onClick={handleEdit}>
          <img src={EditIcon} alt='' width='16' height='16' />
          <span>{t("Edit-meeting")}</span>
        </div>
        <div className={styles.morebtn} onClick={handleCancel}>
          <img src={CancelMeetingIcon} alt='' width='16' height='16' />
          <span>{t("Delete-meeting")}</span>
        </div>
        <div className={styles.morebtn} onClick={handleClickPublish}>
          <img src={CancelMeetingIcon} alt='' width='16' height='16' />
          <span>{t("Publish-meeting")}</span>
        </div>
      </div>
    );
  };

  const handelChangePagination = async (current, PageSize) => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(localStorage.getItem("userID")),
      PageNumber: Number(current),
      Length: Number(PageSize),
      PublishedMeetings: false,
      ProposedMeetings: false,
    };
    setCurrentGroupMeetingPage(current);
    setCurrentGroupMeetingLength(PageSize);
    await dispatch(getMeetingbyGroupIdApi(navigate, t, searchData));
  };

  const handleClickTitle = (record) => {
    dispatch(toggleViewMeetingModal(true));
    dispatch(setViewTab("meetingDetails"));
    dispatch(
      setCurrentMeetingInfo({
        meetingID: record.pK_MDID,
      }),
    );
    setEditorRole((prev) => ({
      ...prev,
      status: record.status,
      role: record.isParticipant
        ? "Participant"
        : record.isAgendaContributor
          ? "Agenda Contributor"
          : "Organizer",
      isPrimaryOrganizer: record.isPrimaryOrganizer,
    }));
  };

  // ─── Table columns ───
  const columns = useMemo(() => {
    return [
      // Meeting Title
      {
        title: (
          <div className='d-flex align-items-center gap-2'>
            <span>{t("Meeting-title")}</span>
            {meetingTitleSort === "ascend" ? (
              <img src={SortIconAscend} alt='SortIconAscend' />
            ) : (
              <img src={SortIconDescend} alt='SortIconDescend' />
            )}
          </div>
        ),
        dataIndex: "title",
        key: "title",
        width: 350,
        ellipsis: true,
        sorter: (a, b) => a.title.localeCompare(b.title),
        sortOrder: meetingTitleSort,
        render: (text) => (
          <span onClick={handleClickTitle} className={styles.tableRow}>
            {text}
          </span>
        ),
      },

      // Organizer
      {
        title: (
          <div className='d-flex align-items-center justify-content-center gap-2'>
            <span>{t("Organizer")}</span>
            {organizerNameSort === "ascend" ? (
              <img src={SortIconAscend} alt='SortIconAscend' />
            ) : (
              <img src={SortIconDescend} alt='SortIconDescend' />
            )}
          </div>
        ),
        dataIndex: "host",
        key: "host",
        width: 150,
        align: "center",
        sorter: (a, b) =>
          a.host.toLowerCase().localeCompare(b.host.toLowerCase()),
        sortOrder: organizerNameSort,
      },

      // Time
      {
        title: (
          <div className='d-flex align-items-center justify-content-center gap-2'>
            <span>{t("Time")}</span>
            {meetingTimeSort === "ascend" ? (
              <img src={ArrowDownIcon} alt='ArrowUpIcon' />
            ) : (
              <img src={ArrowUpIcon} alt='ArrowDownIcon' />
            )}
          </div>
        ),
        dataIndex: "time",
        key: "time",
        width: 180,
        align: "center",
        sorter: (a, b) => {
          const dateA = new Date(a.dateOfMeeting + a.meetingStartTime);
          const dateB = new Date(b.dateOfMeeting + b.meetingStartTime);
          return dateA - dateB;
        },
        sortOrder: meetingTimeSort,
        render: (text, record) => {
          let meetingStartTime = forRecentActivity(
            record.dateOfMeeting + record.meetingStartTime,
          );
          let meetingEndTime = forRecentActivity(
            record.dateOfMeeting + record.meetingEndTime,
          );
          if (!meetingStartTime && !meetingEndTime) return;
          return (
            <>{`${moment(meetingStartTime).format("hh:mm a")} - ${moment(
              meetingEndTime,
            ).format("hh:mm a")}`}</>
          );
        },
      },

      // Date
      {
        title: (
          <div className='d-flex align-items-center justify-content-center gap-2'>
            <span>{t("Date")}</span>
            {meetingDateSort === "ascend" ? (
              <img src={ArrowDownIcon} alt='ArrowUpIcon' />
            ) : (
              <img src={ArrowUpIcon} alt='ArrowDownIcon' />
            )}
          </div>
        ),
        dataIndex: "date",
        key: "date",
        width: 150,
        align: "center",
        sorter: (a, b) => {
          const dateA = new Date(
            a.dateOfMeeting.substring(0, 4),
            parseInt(a.dateOfMeeting.substring(4, 6)) - 1,
            a.dateOfMeeting.substring(6, 8),
          );
          const dateB = new Date(
            b.dateOfMeeting.substring(0, 4),
            parseInt(b.dateOfMeeting.substring(4, 6)) - 1,
            b.dateOfMeeting.substring(6, 8),
          );
          return dateA - dateB;
        },
        sortOrder: meetingDateSort,
        render: (text, record) => {
          let meetingDate = forRecentActivity(
            record.dateOfMeeting + record.meetingStartTime,
          );
          return <>{`${moment(meetingDate).format("Do MMM, YYYY")}`}</>;
        },
      },

      // More Popover
      {
        title: "",
        dataIndex: "meetingAction",
        width: 140,
        key: "meetingAction",
        render: (text, record) => (
          <div className='d-flex justify-content-center align-items-center gap-2'>
            <div>
              <Popover
                content={moreButtons(record)}
                trigger='click'
                overlayClassName='MoreButtons_overlay'
                className='moreOptionsPopover'
                showArrow={false}
                placement='bottomRight'>
                <CustomButton
                  className={styles.MoreMeetingButton}
                  text='More'
                  icon2={<img src={ChevronDownIcon} alt="Chevron Down" width={10} />}
                />
              </Popover>
            </div>
          </div>
        ),
      },
    ];
  }, [
    meetingTitleSort,
    organizerNameSort,
    meetingTimeSort,
    meetingDateSort,
    isMeetingTypeFilter,
  ]);

  return (
    <>
      <div className='position-relative'>
        <Row>
          <Col
            sm={12}
            md={12}
            lg={12}
            className={styles["MainMeetingTablePublished"]}>
            <Table
              onChange={handleChangeMeetingTable}
              className='MeetingTable'
              column={columns}
              size={"small"}
              rows={groupDraftMeetingData}
              sticky={true}
              pagination={false}
              scroll={{
                y: 400,
              }}
            />
          </Col>
          {groupDraftMeetingData.length > 0 && (
            <Col className={styles["Meeting_Pagination"]}>
              <div className='d-flex justify-content-center mt-2 '>
                <Row className={styles["PaginationStyle-Meeting"]}>
                  <Col
                    className={"pagination-groups-table"}
                    sm={12}
                    md={12}
                    lg={12}>
                    <CustomPagination
                      current={currentGroupMeetingPage}
                      pageSize={currentGroupMeetingLength}
                      onChange={handelChangePagination}
                      total={groupDraftMeetingDataRecord}
                      showSizer={true}
                      pageSizeOptionsValues={["30", "50", "100", "200"]}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          )}
        </Row>
      </div>
      {deleteMeetingConfirmationModal && <DeleteMeetingConfirmationModal />}
    </>
  );
};

export default GroupDraftMeetings;
