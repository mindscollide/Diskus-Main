import React, { useEffect, useMemo, useState } from "react";
import { Table, Button } from "../../../components/elements";
import SortIconAscend from "../../../assets/images/sortingIcons/SorterIconAscend.png";
import SortIconDescend from "../../../assets/images/sortingIcons/SorterIconDescend.png";
import ArrowUpIcon from "../../../assets/images/sortingIcons/Arrow-up.png";
import ArrowDownIcon from "../../../assets/images/sortingIcons/Arrow-down.png";
import EditIcon from "../../../assets/images/New Meeting Listing Icons/EditMeeting.png";
import CancelMeetingIcon from "../../../assets/images/New Meeting Listing Icons/CancelMeeting.png";
import ChatIcon from "../../../assets/images/New Meeting Listing Icons/Talk.png";
import AgendaIcon from "../../../assets/images/New Meeting Listing Icons/ViewAgenda.png";
import ClipboardIcon from "../../../assets/images/New Meeting Listing Icons/Attendance.png";
import DownloadVideoIcon from "../../../assets/images/New Meeting Listing Icons/VideoRecording.png";
import ChevronDownIcon from "../../../assets/images/dropdown-icon.png";
import { Popover, Menu, Checkbox } from "antd";
import { ChevronDown } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import {
  GetAllMeetingTypesNewFunction,
  searchNewUserMeeting,
} from "../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNewMeetingContext } from "../../../context/NewMeetingContext";
import { StatusValue } from "../componentComponents/statusJson";
import styles from "../Meeting.module.css";
import "./../Meetings.css";
import CustomButton from "../../../components/elements/button/Button";
import moment from "moment";
import {
  forRecentActivity,
  getCurrentDateTimeUTC,
} from "../../../commen/functions/date_formater";
import CustomPagination from "../../../commen/functions/customPagination/Paginations";
import SceduleMeeting from "../componentComponents/scedulemeeting/SceduleMeeting";
let userID = localStorage.getItem("userID");

const PublishedMeeting = () => {
  const {
    meetingsRecords,
    totalMeetingRecords,
    setMeetingsRecords,
    isMeetingTypeFilter,
    minutesAgo,
    startMeetingButton,
    createEditMeeting,
    setCreateEditMeeting,
  } = useNewMeetingContext();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  const [meetingTitleSort, setMeetingTitleSort] = useState("ascend");
  const [organizerNameSort, setOrganizerNameSort] = useState("ascend");
  const [meetingTimeSort, setMeetingTimeSort] = useState("ascend");
  const [meetingDateSort, setMeetingDateSort] = useState("ascend");
  const [duplicatedRows, setDuplicatedRows] = useState([]);

  // Status Filter State
  const [statusFilterVisible, setStatusFilterVisible] = useState(false);
  const [selectedStatusValues, setSelectedStatusValues] = useState([
    "10",
    "1",
    "9",
    "8",
    "4",
  ]);

  // Meeting Type Filter State
  const [meetingTypeFilterVisible, setMeetingTypeFilterVisible] =
    useState(false);
  const [selectedMeetingTypeValues, setSelectedMeetingTypeValues] = useState([
    "1",
    "2",
    "3",
  ]);

  // Status Filter Options
  const statusFilters = [
    { value: "10", text: "Active" },
    { value: "1", text: "Upcoming" },
    { value: "9", text: "Ended" },
    { value: "8", text: "Not-conducted" },
    { value: "4", text: "Cancelled" },
  ];

  // Meeting Type Filter Options
  const meetingTypeFilters = [
    { value: "1", text: "Board Meeting" },
    { value: "2", text: "Committee Meeting" },
    { value: "3", text: "Group Meeting" },
  ];
  useEffect(() => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 30,
      PublishedMeetings: true,
    };
    dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    dispatch(searchNewUserMeeting(navigate, searchData, t));
  }, []);
  const handleChangeMeetingTable = () => {};

  // Status Filter Handlers
  const handleStatusMenuClick = (filterValue) => {
    setSelectedStatusValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)]
    );
  };

  const handleApplyStatusFilter = () => {
    const filteredData = duplicatedRows.filter((item) =>
      selectedStatusValues.includes(item.status?.toString())
    );
    setMeetingsRecords(filteredData);
    setStatusFilterVisible(false);
  };

  const resetStatusFilter = () => {
    setSelectedStatusValues(["10", "1", "9", "8", "4"]);
    setMeetingsRecords(duplicatedRows);
    setStatusFilterVisible(false);
  };

  const handleClickStatusChevron = () => {
    setStatusFilterVisible((prevVisible) => !prevVisible);
  };

  // Meeting Type Filter Handlers
  const handleMeetingTypeMenuClick = (filterValue) => {
    setSelectedMeetingTypeValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)]
    );
  };

  const handleApplyMeetingTypeFilter = () => {
    const filteredData = duplicatedRows.filter((item) =>
      selectedMeetingTypeValues.includes(item.meetingtype?.toString())
    );
    setMeetingsRecords(filteredData);
    setMeetingTypeFilterVisible(false);
  };

  const resetMeetingTypeFilter = () => {
    setSelectedMeetingTypeValues(["1", "2", "3"]);
    setMeetingsRecords(duplicatedRows);
    setMeetingTypeFilterVisible(false);
  };

  const handleClickMeetingTypeChevron = () => {
    setMeetingTypeFilterVisible((prevVisible) => !prevVisible);
  };

  // Status Filter Menu
  const statusMenu = (
    <Menu>
      {statusFilters.map((filter) => (
        <Menu.Item
          key={filter.value}
          onClick={() => handleStatusMenuClick(filter.value)}>
          <Checkbox checked={selectedStatusValues.includes(filter.value)}>
            {filter.text}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className='d-flex align-items-center justify-content-between p-1'>
        <Button
          text={"Reset"}
          className={"FilterResetBtn"}
          onClick={resetStatusFilter}
        />
        <Button
          text={"Ok"}
          disableBtn={selectedStatusValues.length === 0}
          className={"ResetOkBtn"}
          onClick={handleApplyStatusFilter}
        />
      </div>
    </Menu>
  );

  // Meeting Type Filter Menu
  const meetingTypeMenu = (
    <Menu>
      {meetingTypeFilters.map((filter) => (
        <Menu.Item
          key={filter.value}
          onClick={() => handleMeetingTypeMenuClick(filter.value)}>
          <Checkbox checked={selectedMeetingTypeValues.includes(filter.value)}>
            {filter.text}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className='d-flex align-items-center justify-content-between p-1'>
        <Button
          text={"Reset"}
          className={"FilterResetBtn"}
          onClick={resetMeetingTypeFilter}
        />
        <Button
          text={"Ok"}
          disableBtn={selectedMeetingTypeValues.length === 0}
          className={"ResetOkBtn"}
          onClick={handleApplyMeetingTypeFilter}
        />
      </div>
    </Menu>
  );
  const moreButtons = (record) => {
    const STATUS = {
      UPCOMING: 1,
      ACTIVE: 10,
      ENDED: 9,
      NOT_CONDUCTED: 8,
      CANCELLED: 4,
    };
    const status = Number(record.status);

    const isOrganizer = record.isOrganizer;
    const isParticipant = record.isParticipant;
    const isAgendaContributor = record.isAgendaContributor;

    const canShow = {
      edit:
        (status === STATUS.UPCOMING || status === STATUS.ACTIVE) && isOrganizer,

      cancel: status === STATUS.UPCOMING && isOrganizer,

      talk: status !== STATUS.NOT_CONDUCTED && status !== STATUS.CANCELLED,

      viewAgenda:
        status !== STATUS.NOT_CONDUCTED && status !== STATUS.CANCELLED,

      attendance: status === STATUS.ENDED && isOrganizer,

      recording: status === STATUS.ENDED && isOrganizer,
    };

    return (
      <div className={styles.morebuttons}>
        {canShow.edit && (
          <div
            className={styles.morebtn}
            onClick={() => console.log("Edit", record)}>
            <img src={EditIcon} alt='' width='16' height='16' />
            <span>{t("Edit-meeting")}</span>
          </div>
        )}

        {canShow.cancel && (
          <div
            className={styles.morebtn}
            onClick={() => console.log("Cancel", record)}>
            <img src={CancelMeetingIcon} alt='' width='16' height='16' />
            <span>{t("Cancel-meeting")}</span>
          </div>
        )}

        {canShow.talk && (
          <div
            className={styles.morebtn}
            onClick={() => console.log("Talk", record)}>
            <img src={ChatIcon} alt='' width='16' height='16' />
            <span>{t("Talk")}</span>
          </div>
        )}

        {canShow.viewAgenda && (
          <div
            className={styles.morebtn}
            onClick={() => console.log("Agenda", record)}>
            <img src={AgendaIcon} alt='' width='16' height='16' />
            <span>{t("View-agenda")}</span>
          </div>
        )}

        {canShow.attendance && (
          <div
            className={styles.morebtn}
            onClick={() => console.log("Attendance", record)}>
            <img src={ClipboardIcon} alt='' width='16' height='16' />
            <span>{t("Attendance-report")}</span>
          </div>
        )}

        {canShow.recording && (
          <div
            className={styles.morebtn}
            onClick={() => console.log("Recording", record)}>
            <img src={DownloadVideoIcon} alt='' width='16' height='16' />
            <span>{t("Download-view-recording")}</span>
          </div>
        )}
      </div>
    );
  };

  const onMeetingAction = (actionType, record) => {
    console.log(actionType, record);

    switch (actionType) {
      case "START_MEETING":
        // startMeeting(record);
        break;
      case "EDIT_MEETING":
        // editMeeting(record);
        break;
      case "JOIN_MEETING":
        // joinMeeting(record);
        break;
      case "END_MEETING":
        // endMeeting(record);
        break;
      default:
        break;
    }
  };
  const handelChangePagination = async (current, PageSize) => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: Number(current),
      Length: Number(PageSize),
      PublishedMeetings: true,
    };
    localStorage.setItem("MeetingPageRows", PageSize);
    localStorage.setItem("MeetingPageCurrent", current);
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
  };

  const columns = useMemo(() => {
    return [
      {
        title: (
          <>
            <div className='d-flex align-items-center gap-2'>
              <span>Meeting Title</span>
              {meetingTitleSort === "ascend" ? (
                <img src={SortIconAscend} alt='SortIconAscend' />
              ) : (
                <img src={SortIconDescend} alt='SortIconDescend' />
              )}
            </div>
          </>
        ),
        dataIndex: "title",
        key: "title",
        width: 180,
        sorter: true,
        ellipsis: true,
        render: (text) => {
          return <span className={styles.tableRow}>{text}</span>;
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 90,
        filters: statusFilters.map((filter) => ({
          text: filter.text,
          value: filter.value,
        })),
        defaultFilteredValue: ["10", "1", "9", "8", "4"],
        filterResetToDefaultFilteredValue: true,
        filterIcon: (filtered) => (
          <ChevronDown
            className='filter-chevron-icon-todolist'
            onClick={handleClickStatusChevron}
          />
        ),
        filterDropdown: () => statusMenu,
        render: (text, record) => {
          return (
            <div className='d-flex justify-content-center align-items-center gap-1'>
              {StatusValue(t, text)}
            </div>
          );
        },
      },
      {
        title: (
          <>
            <div className='d-flex align-items-center justify-content-center gap-2'>
              <span>Organizer</span>
              {organizerNameSort === "ascend" ? (
                <img src={SortIconAscend} alt='SortIconAscend' />
              ) : (
                <img src={SortIconDescend} alt='SortIconDescend' />
              )}
            </div>
          </>
        ),
        dataIndex: "host",
        key: "host",
        width: 105,
        align: "center",
        ellipsis: true,
      },
      {
        title: (
          <>
            <div className='d-flex align-items-center justify-content-center gap-2'>
              <span>Time</span>
              {meetingTimeSort === "ascend" ? (
                <img src={ArrowDownIcon} alt='ArrowUpIcon' />
              ) : (
                <img src={ArrowUpIcon} alt='ArrowDownIcon' />
              )}
            </div>
          </>
        ),
        dataIndex: "time",
        key: "time",
        width: 120,
        align: "center",
        ellipsis: true,

        render: (text, record) => {
          let meetingStartTime = forRecentActivity(
            record.dateOfMeeting + record.meetingStartTime
          );
          let meetingEndTime = forRecentActivity(
            record.dateOfMeeting + record.meetingEndTime
          );
          if (!meetingStartTime && !meetingEndTime) return;
          return (
            <>{`${moment(meetingStartTime).format("hh:mm a")} - ${moment(
              meetingEndTime
            ).format("hh:mm a")}`}</>
          );
        },
      },
      {
        title: (
          <>
            <div className='d-flex align-items-center justify-content-center gap-2'>
              <span>Date</span>
              {meetingDateSort === "ascend" ? (
                <img src={ArrowDownIcon} alt='ArrowUpIcon' />
              ) : (
                <img src={ArrowUpIcon} alt='ArrowDownIcon' />
              )}
            </div>
          </>
        ),
        dataIndex: "date",
        key: "date",
        width: 95,
        align: "center",
        ellipsis: true,

        render: (text, record) => {
          let meetingDate = forRecentActivity(
            record.dateOfMeeting + record.meetingStartTime
          );
          return <>{`${moment(meetingDate).format("Do MMM, YYYY")}`}</>;
        },
      },
      {
        title: (
          <span className='d-flex justify-content-center align-items-center'>
            Meeting Type
          </span>
        ),
        dataIndex: "meetingtype",
        key: "meetingtype",
        width: 140,
        align: "center",

        filters: meetingTypeFilters.map((filter) => ({
          text: filter.text,
          value: filter.value,
        })),
        defaultFilteredValue: ["1", "2", "3"],
        filterResetToDefaultFilteredValue: true,
        filterIcon: (filtered) => (
          <ChevronDown
            className='filter-chevron-icon-todolist'
            onClick={handleClickMeetingTypeChevron}
          />
        ),
        filterDropdown: () => meetingTypeMenu,
        render: (text, record) => {
          const meetingType = Number(record.meetingType);
          const matchedFilter = isMeetingTypeFilter?.find(
            (data) => meetingType === Number(data.value)
          );

          return record.isQuickMeeting && meetingType === 1
            ? t("Quick-meeting")
            : t(matchedFilter)
            ? t(matchedFilter.text)
            : "";
        },
      },
      {
        title: "",
        width: 110,
        key: "action",
        align: "center",
        render: (_, record) => {
          let meetingDateTime = record.dateOfMeeting + record.meetingStartTime;
          let currentUTCDateTime = getCurrentDateTimeUTC();
          const currentDateObj = new Date(
            currentUTCDateTime.substring(0, 4), // Year
            parseInt(currentUTCDateTime.substring(4, 6)) - 1, // Month (0-based)
            currentUTCDateTime.substring(6, 8), // Day
            currentUTCDateTime.substring(8, 10), // Hours
            currentUTCDateTime.substring(10, 12), // Minutes
            currentUTCDateTime.substring(12, 14) // Seconds
          );

          const meetingDateObj = new Date(
            meetingDateTime.substring(0, 4), // Year
            parseInt(meetingDateTime.substring(4, 6)) - 1, // Month (0-based)
            meetingDateTime.substring(6, 8), // Day
            meetingDateTime.substring(8, 10), // Hours
            meetingDateTime.substring(10, 12), // Minutes
            meetingDateTime.substring(12, 14) // Seconds
          );

          // Calculate the time difference in milliseconds
          const timeDifference = meetingDateObj - currentDateObj;

          // Convert milliseconds to minutes
          const minutesDifference = Math.floor(timeDifference / (1000 * 60));
          const meetingCurrentStatus = Number(record.status);

          const isOrganizer = record.isOrganizer;
          const isParticipant = record.isParticipant;
          const isAgendaContributor = record.isAgendaContributor;

          const canStartMeeting =
            meetingCurrentStatus === 1 &&
            isOrganizer &&
            minutesDifference <= 30;

          const handleClick = (actionType) => {
            onMeetingAction(actionType, record); // ⬅️ back to parent
          };

          // ===== UPCOMING =====
          if (meetingCurrentStatus === 1) {
            if (isOrganizer) {
              return (
                <div className='d-flex justify-content-center align-items-center'>
                  <CustomButton
                    text={
                      canStartMeeting ? t("Start-meeting") : t("Edit-meeting")
                    }
                    className={
                      canStartMeeting
                        ? styles.StartMeetingButton
                        : styles.EditMeetingButton
                    }
                    onClick={() =>
                      handleClick(
                        canStartMeeting ? "START_MEETING" : "EDIT_MEETING"
                      )
                    }
                  />
                </div>
              );
            }

            if (isAgendaContributor) {
              return (
                <div className='d-flex justify-content-center align-items-center'>
                  <CustomButton
                    text={t("Contribute-agenda")}
                    className={styles.ContributeAgendaButton}
                    onClick={() => handleClick("CONTRIBUTE_AGENDA")}
                  />
                </div>
              );
            }

            if (isParticipant) {
              return (
                <div className='d-flex justify-content-center align-items-center'>
                  <CustomButton
                    text={t("View-meeting")}
                    className={styles.ViewMeetingButton}
                    onClick={() => handleClick("VIEW_MEETING")}
                  />
                </div>
              );
            }
          }

          // ===== ACTIVE =====
          if (meetingCurrentStatus === 10) {
            return (
              <div className='d-flex justify-content-center align-items-center'>
                <CustomButton
                  text={t("Join-meeting")}
                  className={styles.JoinMeetingButton}
                  onClick={() => handleClick("JOIN_MEETING")}
                />
              </div>
            );
          }

          // ===== ENDED =====
          if (meetingCurrentStatus === 9 && isOrganizer) {
            return (
              <div className='d-flex justify-content-center align-items-center'>
                <CustomButton
                  text={t("Board-deck")}
                  className={styles.BoardDeckButton}
                  onClick={() => handleClick("BOARD_DECK")}
                />
              </div>
            );
          }

          // ===== NOT CONDUCTED =====
          if (meetingCurrentStatus === 8 && isOrganizer) {
            return (
              <div className='d-flex justify-content-center align-items-center'>
                <CustomButton
                  text={t("Edit-meeting")}
                  className={styles.EditMeetingButton}
                  onClick={() => handleClick("EDIT_MEETING")}
                />
              </div>
            );
          }

          // ===== Cancelled or others =====
          return null; // keep blank
        },
      },

      {
        title: (
          <>
            <div></div>
          </>
        ),
        dataIndex: "meetingAction",
        width: 110,
        align: "center",
        key: "meetingAction",
        render: (text, record) => {
          return (
            <div className='d-flex justify-content-center align-items-center'>
              <Popover
                content={moreButtons(record)}
                trigger='click'
                overlayClassName='MoreButtons_overlay'
                showArrow={false}
                placement='bottomRight'>
                <CustomButton
                  className={styles.MoreMeetingButton}
                  text='More'
                  icon2={<img src={ChevronDownIcon} width={10} alt='' />}
                />
              </Popover>
            </div>
          );
        },
      },
    ];
  }, [
    meetingTitleSort,
    organizerNameSort,
    meetingTimeSort,
    meetingDateSort,
    statusFilterVisible,
    selectedStatusValues,
    meetingTypeFilterVisible,
    selectedMeetingTypeValues,
  ]);

  return (
    isMeetingTypeFilter.length > 0 && (
      <div>
        <Table
          onChange={handleChangeMeetingTable}
          className='MeetingTable'
          column={columns}
          size={"small"}
          rows={meetingsRecords}
          sticky={true}
          pagination={false}
          scroll={{
            y: "60vh",
          }}
        />
        {meetingsRecords.length > 0 ? (
          <>
            <section
              className={
                "pagination-groups-table d-flex justify-content-center align-items-center my-3"
              }>
              <div className='border py-2 px-4'>
                <CustomPagination
                  current={
                    meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1
                  }
                  pageSize={
                    meetingpageRow !== null ? Number(meetingpageRow) : 50
                  }
                  onChange={handelChangePagination}
                  total={totalMeetingRecords}
                  showSizer={true}
                  pageSizeOptionsValues={["30", "50", "100", "200"]}
                />
              </div>
            </section>
          </>
        ) : null}
      </div>
    )
  );
};

export default PublishedMeeting;
