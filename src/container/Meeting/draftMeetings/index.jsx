import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { Popover, Menu, Checkbox } from "antd";
import { ChevronDown } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import {
  GetAllMeetingTypesNewFunction,
  searchNewUserMeeting,
} from "../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import rspvGreenIcon from "../../../assets/images/rspvGreen.svg";
import ChevronDownIcon from "../../../assets/images/dropdown-icon.png";

import { useNewMeetingContext } from "../../../context/NewMeetingContext";
import { StatusValue } from "../../pages/meeting/statusJson";
import styles from "./draftMeetings.module.css";
import "./../Meetings.css";
import CustomButton from "../../../components/elements/button/Button";
import moment from "moment";
import {
  dateTime,
  forRecentActivity,
} from "../../../commen/functions/date_formater";
import { convertToArabicNumerals } from "../../../commen/functions/regex";
const userID = localStorage.getItem("userID");
const currentLanguage = localStorage.getItem("i18nextLng");

const DraftMeeting = () => {
  const { publishMeetingData, isMeetingTypeFilter } = useNewMeetingContext();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [meetingTitleSort, setMeetingTitleSort] = useState("ascend");
  const [organizerNameSort, setOrganizerNameSort] = useState("ascend");
  const [meetingTimeSort, setMeetingTimeSort] = useState("ascend");
  const [meetingDateSort, setMeetingDateSort] = useState("ascend");
  const [rows, setRows] = useState([]);
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
      PublishedMeetings: false,
      ProposedMeetings: false,
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
        : [...prevValues, String(filterValue)],
    );
  };

  const handleApplyStatusFilter = () => {
    const filteredData = duplicatedRows.filter((item) =>
      selectedStatusValues.includes(item.status?.toString()),
    );
    setRows(filteredData);
    setStatusFilterVisible(false);
  };

  const resetStatusFilter = () => {
    setSelectedStatusValues(["10", "1", "9", "8", "4"]);
    setRows(duplicatedRows);
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
        : [...prevValues, String(filterValue)],
    );
  };

  const handleApplyMeetingTypeFilter = () => {
    const filteredData = duplicatedRows.filter((item) =>
      selectedMeetingTypeValues.includes(item.meetingtype?.toString()),
    );
    setRows(filteredData);
    setMeetingTypeFilterVisible(false);
  };

  const resetMeetingTypeFilter = () => {
    setSelectedMeetingTypeValues(["1", "2", "3"]);
    setRows(duplicatedRows);
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
          onClick={() => handleStatusMenuClick(filter.value)}
        >
          <Checkbox checked={selectedStatusValues.includes(filter.value)}>
            {filter.text}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className="d-flex align-items-center justify-content-between p-1">
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
          onClick={() => handleMeetingTypeMenuClick(filter.value)}
        >
          <Checkbox checked={selectedMeetingTypeValues.includes(filter.value)}>
            {filter.text}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className="d-flex align-items-center justify-content-between p-1">
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
    const handleEdit = () => {
      console.log("Edit Meeting", record);
    };

    const handleCancel = () => {
      console.log("Cancel Meeting", record);
    };

    const handleClickPublish = () => {
      console.log("Talk", record);
    };

    return (
      <div className={styles.morebuttons}>
        <div className={styles.morebtn} onClick={handleEdit}>
          <img src={EditIcon} alt="" width="16" height="16" />
          <span>{t("Edit-meeting")}</span>
        </div>

        <div className={styles.morebtn} onClick={handleCancel}>
          <img src={CancelMeetingIcon} alt="" width="16" height="16" />
          <span>{t("Delete-meeting")}</span>
        </div>

        <div className={styles.morebtn} onClick={handleClickPublish}>
          <img src={ChatIcon} alt="" width="16" height="16" />
          <span>{t("Publish-meeting")}</span>
        </div>
      </div>
    );
  };

  const columns = useMemo(() => {
    return [
      {
        title: (
          <>
            <div className="d-flex align-items-center gap-2">
              <span>Meeting Title</span>
              {meetingTitleSort === "ascend" ? (
                <img src={SortIconAscend} alt="SortIconAscend" />
              ) : (
                <img src={SortIconDescend} alt="SortIconDescend" />
              )}
            </div>
          </>
        ),
        dataIndex: "title",
        key: "title",
        width: 350,
        sorter: true,
        ellipsis: true,
        render: (text) => {
          return <span className={styles.tableRow}>{text}</span>;
        },
      },
      {
        title: (
          <>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span>Organizer</span>
              {organizerNameSort === "ascend" ? (
                <img src={SortIconAscend} alt="SortIconAscend" />
              ) : (
                <img src={SortIconDescend} alt="SortIconDescend" />
              )}
            </div>
          </>
        ),
        dataIndex: "host",
        key: "host",
        width: 150,
        align: "center",
      },
      {
        title: (
          <>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span>Time</span>
              {meetingTimeSort === "ascend" ? (
                <img src={ArrowDownIcon} alt="ArrowUpIcon" />
              ) : (
                <img src={ArrowUpIcon} alt="ArrowDownIcon" />
              )}
            </div>
          </>
        ),
        dataIndex: "time",
        key: "time",
        width: 180,
        align: "center",

        render: (text, record) => {
          let meetingStartTime = forRecentActivity(
            record.dateOfMeeting + record.meetingStartTime,
          );
          let meetingEndTime = forRecentActivity(
            record.dateOfMeeting + record.meetingEndTime,
          );
          if (!meetingStartTime && !meetingEndTime) return;
          return (
            <>{`${moment(meetingStartTime).format("hh:mm a")} - ${moment(meetingEndTime).format("hh:mm a")}`}</>
          );
        },
      },
      {
        title: (
          <>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span>Date</span>
              {meetingDateSort === "ascend" ? (
                <img src={ArrowDownIcon} alt="ArrowUpIcon" />
              ) : (
                <img src={ArrowUpIcon} alt="ArrowDownIcon" />
              )}
            </div>
          </>
        ),
        dataIndex: "date",
        key: "date",
        width: 150,
        align: "center",

        render: (text, record) => {
          let meetingDate = forRecentActivity(
            record.dateOfMeeting + record.meetingStartTime,
          );
          return <>{`${moment(meetingDate).format("Do MMM, YYYY")}`}</>;
        },
      },
      {
        title: (
          <span className="d-flex justify-content-center align-items-center">
            Meeting Type
          </span>
        ),
        dataIndex: "meetingtype",
        key: "meetingtype",
        width: 150,
        align: "center",

        filters: meetingTypeFilters.map((filter) => ({
          text: filter.text,
          value: filter.value,
        })),
        defaultFilteredValue: ["1", "2", "3"],
        filterResetToDefaultFilteredValue: true,
        filterIcon: (filtered) => (
          <ChevronDown
            className="filter-chevron-icon-todolist"
            onClick={handleClickMeetingTypeChevron}
          />
        ),
        filterDropdown: () => meetingTypeMenu,
        render: (text, record) => {
          const meetingType = Number(record.meetingType);
          const matchedFilter = isMeetingTypeFilter?.find(
            (data) => meetingType === Number(data.value),
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
        dataIndex: "meetingAction",
        width: 140,
        key: "meetingAction",
        render: (text, record) => {
          let meetingCurrentStatus = Number(record.status);
          let isOrganizer = record.isOrganizer;
          let isParticipant = record.isParticipant;
          let isAgendaContributor = record.isAgendaContributor;
          let isPrimaryOrganizer = record.isPrimaryOrganizer;

          return (
            <div className="d-flex justify-content-center align-items-center gap-2">
              <div>
                <Popover
                  content={moreButtons(record)}
                  trigger="click"
                  overlayClassName="MoreButtons_overlay"
                  showArrow={false}
                  placement="bottomRight"
                >
                  <CustomButton
                    className={styles.MoreMeetingButton}
                    text="More"
                    icon2={<img src={ChevronDownIcon} width={10} />}
                  />
                </Popover>
              </div>
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
    <div>
      <Table
        onChange={handleChangeMeetingTable}
        className="MeetingTable"
        column={columns}
        size={"small"}
        rows={publishMeetingData}
        sticky={true}
        pagination={false}
        scroll={{
          y: 450,
        }}
      />
    </div>
  );
};

export default DraftMeeting;
