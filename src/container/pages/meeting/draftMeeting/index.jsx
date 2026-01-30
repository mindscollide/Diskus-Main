import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { forRecentActivity } from "../../../../commen/functions/date_formater";
import { ChevronDown } from "react-bootstrap-icons";
import { Checkbox, Menu, Popover } from "antd";
import CustomButton from "../../../../components/elements/button/Button";
import styles from "./draft.module.css";
import { StatusValue } from "../statusJson";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { Button, Table } from "../../../../components/elements";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNewMeetingContext } from "../../../../context/NewMeetingContext";
import SortIconAscend from "../../../../assets/images/sortingIcons/SorterIconAscend.png";
import SortIconDescend from "../../../../assets/images/sortingIcons/SorterIconDescend.png";
import ArrowUpIcon from "../../../../assets/images/sortingIcons/Arrow-up.png";
import CancelMeetingIcon from "../../../../assets/images/New Meeting Listing Icons/CancelMeeting.png";
import ChevronDownIcon from "../../../../assets/images/dropdown-icon.png";

import EditIcon from "../../../../assets/images/New Meeting Listing Icons/EditMeeting.png";
import ArrowDownIcon from "../../../../assets/images/sortingIcons/Arrow-down.png";
import { ViewMeeting } from "../../../../store/actions/Get_List_Of_Assignees";
import { useMeetingContext } from "../../../../context/MeetingContext";
import {
  GetAllMeetingDetailsApiFunc,
  actionsGlobalFlag,
  agendaContributorsGlobalFlag,
  agendaGlobalFlag,
  attendanceGlobalFlag,
  meetingDetailsGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  organizersGlobalFlag,
  participantsGlobalFlag,
  pollsGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  scheduleMeetingPageFlag,
  uploadGlobalFlag,
  viewMeetingFlag,
} from "../../../../store/actions/NewMeetingActions";
const userID = localStorage.getItem("userID");

const DraftMeeting = () => {
  const { t } = useTranslation();
  const {
    meetingsRecords,
    totalMeetingRecords,
    setMeetingsRecords,
    isMeetingTypeFilter,
  } = useNewMeetingContext();
  const {
    editorRole,
    setEditorRole,
    setVideoTalk,
    videoTalk,
    viewAdvanceMeetingModal,
    setViewAdvanceMeetingModal,
    viewProposeDatePoll,
    setViewProposeDatePoll,
    viewFlag,
    setViewFlag,
    setAdvanceMeetingModalID,
    advanceMeetingModalID,
    setSceduleMeeting,
    sceduleMeeting,
    setDataroomMapFolderId,
    dataroomMapFolderId,
    isEditMeeting,
    setEditMeeting,
    setPolls,
    boardDeckMeetingID,
    setmeetingDetails,
    boardDeckMeetingTitle,
    setDownloadMeeting,
    setDeleteMeetingRecord,
    setDeleteMeetingConfirmationModal,
    deleteMeetingConfirmationModal,
    viewAdvanceMeetingModalUnpublish,
    setViewAdvanceMeetingModalUnpublish,
    editFlag,
    setEditFlag,
    setCurrentMeetingID,
  } = useMeetingContext();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [meetingTitleSort, setMeetingTitleSort] = useState("ascend");
  const [organizerNameSort, setOrganizerNameSort] = useState("ascend");
  const [meetingTimeSort, setMeetingTimeSort] = useState("ascend");
  const [meetingDateSort, setMeetingDateSort] = useState("ascend");
  const [duplicatedRows, setDuplicatedRows] = useState([]);
  const handleChangeMeetingTable = () => {};
  // Meeting Type Filter Options
  const meetingTypeFilters = [
    { value: "1", text: "Board Meeting" },
    { value: "2", text: "Committee Meeting" },
    { value: "3", text: "Group Meeting" },
  ];
  // Meeting Type Filter State
  const [meetingTypeFilterVisible, setMeetingTypeFilterVisible] =
    useState(false);
  const [selectedMeetingTypeValues, setSelectedMeetingTypeValues] = useState([
    "1",
    "2",
    "3",
  ]);

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
  const handleMeetingTypeMenuClick = (filterValue) => {
    setSelectedMeetingTypeValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)]
    );
  };
  const moreButtons = (record) => {
    const handleEdit = async () => {
      // const handleEditMeeting = async (record.pK_MDID, record.isQuickMeeting, "Organizer", record) => {
      let Data = { MeetingID: Number(record.pK_MDID) };

      if (record.isQuickMeeting) {
        await dispatch(
          ViewMeeting(
            navigate,
            Data,
            t,
            setViewFlag,
            setEditFlag,
            setSceduleMeeting,
            2
          )
        );
      } else if (record.isQuickMeeting === false) {
        if (record.isAgendaContributor) {
          dispatch(scheduleMeetingPageFlag(true));
          dispatch(viewMeetingFlag(false));
          dispatch(meetingDetailsGlobalFlag(false));
          dispatch(organizersGlobalFlag(false));
          dispatch(agendaContributorsGlobalFlag(false));
          dispatch(participantsGlobalFlag(false));
          dispatch(agendaGlobalFlag(true));
          dispatch(meetingMaterialGlobalFlag(false));
          dispatch(minutesGlobalFlag(false));
          dispatch(proposedMeetingDatesGlobalFlag(false));
          dispatch(actionsGlobalFlag(false));
          dispatch(pollsGlobalFlag(false));
          dispatch(attendanceGlobalFlag(false));
          dispatch(uploadGlobalFlag(false));
          let Data = {
            MeetingID: Number(record.pK_MDID),
          };
          await dispatch(
            GetAllMeetingDetailsApiFunc(
              navigate,
              t,
              Data,
              true,
              setCurrentMeetingID,
              setSceduleMeeting,
              setDataroomMapFolderId,
              0,
              1,
              "Agenda Contributor"
            )
          );
        } else {
          let Data = {
            MeetingID: Number(record.pK_MDID),
          };
          await dispatch(
            GetAllMeetingDetailsApiFunc(
              navigate,
              t,
              Data,
              true,
              setCurrentMeetingID,
              setSceduleMeeting,
              setDataroomMapFolderId,
              0,
              1,
              "Organizer"
            )
          );
          dispatch(scheduleMeetingPageFlag(true));
          dispatch(viewMeetingFlag(false));
          dispatch(meetingDetailsGlobalFlag(true));
          dispatch(organizersGlobalFlag(false));
          dispatch(agendaContributorsGlobalFlag(false));
          dispatch(participantsGlobalFlag(false));
          dispatch(agendaGlobalFlag(false));
          dispatch(meetingMaterialGlobalFlag(false));
          dispatch(minutesGlobalFlag(false));
          dispatch(proposedMeetingDatesGlobalFlag(false));
          dispatch(actionsGlobalFlag(false));
          dispatch(pollsGlobalFlag(false));
          dispatch(attendanceGlobalFlag(false));
          dispatch(uploadGlobalFlag(false));
        }
      }
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
          <img src={EditIcon} alt='' width='16' height='16' />
          <span>{t("Edit-meeting")}</span>
        </div>

        <div className={styles.morebtn} onClick={handleCancel}>
          <img src={CancelMeetingIcon} alt='' width='16' height='16' />
          <span>{t("Delete-meeting")}</span>
        </div>
        <div className={styles.morebtn} onClick={handleCancel}>
          <img src={CancelMeetingIcon} alt='' width='16' height='16' />
          <span>{t("Publish-meeting")}</span>
        </div>
      </div>
    );
  };
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
        width: 150,
        align: "center",
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
        width: 180,
        align: "center",

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
        width: 150,
        align: "center",

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
            <div className='d-flex justify-content-center align-items-center gap-2'>
              <div>
                <Popover
                  content={moreButtons(record)}
                  trigger='click'
                  overlayClassName='MoreButtons_overlay'
                  showArrow={false}
                  placement='bottomRight'>
                  <CustomButton
                    className={styles.MoreMeetingButton}
                    text='More'
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
    meetingTypeFilterVisible,
    selectedMeetingTypeValues,
  ]);

  return (
    <Row>
      <Col sm={12} md={12} lg={12}>
        <Table
          onChange={handleChangeMeetingTable}
          className='MeetingTable'
          column={columns}
          size={"small"}
          rows={meetingsRecords}
          sticky={true}
          pagination={false}
          scroll={{
            y: 450,
          }}
        />
      </Col>
    </Row>
  );
};

export default DraftMeeting;
