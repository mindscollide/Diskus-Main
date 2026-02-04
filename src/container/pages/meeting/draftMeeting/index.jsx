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
  meetingAgendaContributorAdded,
  meetingAgendaContributorRemoved,
  meetingDetailsGlobalFlag,
  meetingMaterialGlobalFlag,
  meetingOrganizerAdded,
  meetingOrganizerRemoved,
  minutesGlobalFlag,
  organizersGlobalFlag,
  participantsGlobalFlag,
  pollsGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  scheduleMeetingPageFlag,
  uploadGlobalFlag,
  viewMeetingFlag,
} from "../../../../store/actions/NewMeetingActions";
import { useSelector } from "react-redux";
import { mqttMeetingData } from "../../../../hooks/meetingResponse/response";

const DraftMeeting = () => {
  const { t } = useTranslation();
  const { isMeetingTypeFilter } = useNewMeetingContext();

  const searchMeetings = useSelector(
    (state) => state.NewMeetingreducer.searchMeetings,
  );

  const mqttMeetingAcAdded = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingAcAdded,
  );
  const mqttMeetingAcRemoved = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingAcRemoved,
  );
  const mqttMeetingOrgAdded = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingOrgAdded,
  );
  const mqttMeetingOrgRemoved = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingOrgRemoved,
  );
  const {
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
  const [rows, setRow] = useState([]);

  console.log(rows, "rows");
  const [dublicatedrows, setDublicatedrows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    try {
      if (searchMeetings !== null && searchMeetings !== undefined) {
        setTotalRecords(searchMeetings.totalRecords);
        if (searchMeetings.meetings.length > 0) {
          // Create a deep copy of the meetings array
          let copyMeetingData = searchMeetings.meetings.map((meeting) => ({
            ...meeting,
            meetingAgenda: meeting.meetingAgenda.filter(
              (agenda) => agenda.objMeetingAgenda.canView,
            ),
          }));
          copyMeetingData.forEach((data) => {
            data.meetingAgenda = data.meetingAgenda.filter((agenda) => {
              return agenda.objMeetingAgenda.canView === true;
            });
          });
          console.log("handleViewMeeting", copyMeetingData);
          setRow(copyMeetingData);
          // setDublicatedrows(copyMeetingData);
        }
      } else {
        setRow([]);
        setDublicatedrows([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [searchMeetings]);

  // Handle table sorting and filtering changes
  const handleChangeMeetingTable = (pagination, filters, sorter) => {
    console.log("Table change:", { pagination, filters, sorter });

    // Reset all sort states first
    setMeetingTitleSort(null);
    setOrganizerNameSort(null);
    setMeetingTimeSort(null);
    setMeetingDateSort(null);

    // Set the active sort based on which column is sorted
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

  useEffect(() => {
    try {
      const callAddAgendaContributor = async () => {
        if (mqttMeetingAcAdded !== null && mqttMeetingAcAdded !== undefined) {
          let newObj = mqttMeetingAcAdded;
          try {
            let getData = await mqttMeetingData(newObj, 2);
            setRow([getData, ...rows]);
          } catch (error) {
            console.log(error, "getDatagetDatagetData");
          }
          dispatch(meetingAgendaContributorAdded(null));
          dispatch(meetingAgendaContributorRemoved(null));
          dispatch(meetingOrganizerAdded(null));
          dispatch(meetingOrganizerRemoved(null));
        }
      };
      callAddAgendaContributor();
    } catch (error) {
      console.log(error);
    }
  }, [mqttMeetingAcAdded]);

  useEffect(() => {
    if (mqttMeetingAcRemoved !== null && mqttMeetingAcRemoved !== undefined) {
      let meetingData = mqttMeetingAcRemoved;
      try {
        const updatedRows = rows.filter(
          (obj) => obj.pK_MDID !== meetingData.pK_MDID,
        );
        setRow(updatedRows);
        dispatch(meetingAgendaContributorAdded(null));
        dispatch(meetingAgendaContributorRemoved(null));
        dispatch(meetingOrganizerAdded(null));
        dispatch(meetingOrganizerRemoved(null));
      } catch {}
    }
  }, [mqttMeetingAcRemoved]);

  useEffect(() => {
    try {
      const callAddOrganizer = async () => {
        if (mqttMeetingOrgAdded !== null && mqttMeetingOrgAdded !== undefined) {
          let newObj = mqttMeetingOrgAdded;
          try {
            let getData = await mqttMeetingData(newObj, 2);
            setRow([getData, ...rows]);
            console.log(getData, "getDatagetDatagetData");
          } catch (error) {
            console.log(error, "getDatagetDatagetData");
          }
          dispatch(meetingAgendaContributorAdded(null));
          dispatch(meetingAgendaContributorRemoved(null));
          dispatch(meetingOrganizerAdded(null));
          dispatch(meetingOrganizerRemoved(null));
        }
      };
      callAddOrganizer();
    } catch (error) {
      console.error(error);
    }
  }, [mqttMeetingOrgAdded]);

  useEffect(() => {
    if (mqttMeetingOrgRemoved !== null && mqttMeetingOrgRemoved !== undefined) {
      let meetingData = mqttMeetingOrgRemoved;
      try {
        const updatedRows = rows.filter(
          (obj) => obj.pK_MDID !== meetingData.pK_MDID,
        );
        setRow(updatedRows);
        dispatch(meetingAgendaContributorAdded(null));
        dispatch(meetingAgendaContributorRemoved(null));
        dispatch(meetingOrganizerAdded(null));
        dispatch(meetingOrganizerRemoved(null));
      } catch {}
    }
  }, [mqttMeetingOrgRemoved]);

  const handleApplyMeetingTypeFilter = () => {
    const filteredData = duplicatedRows.filter((item) =>
      selectedMeetingTypeValues.includes(item.meetingtype?.toString()),
    );
    setRow(filteredData);
    setMeetingTypeFilterVisible(false);
  };

  const resetMeetingTypeFilter = () => {
    setSelectedMeetingTypeValues(["1", "2", "3"]);
    setRow(duplicatedRows);
    setMeetingTypeFilterVisible(false);
  };

  const handleClickMeetingTypeChevron = () => {
    setMeetingTypeFilterVisible((prevVisible) => !prevVisible);
  };
  const handleMeetingTypeMenuClick = (filterValue) => {
    setSelectedMeetingTypeValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)],
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
            2,
          ),
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
              "Agenda Contributor",
            ),
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
              "Organizer",
            ),
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
          <img src={EditIcon} alt="" width="16" height="16" />
          <span>{t("Edit-meeting")}</span>
        </div>

        <div className={styles.morebtn} onClick={handleCancel}>
          <img src={CancelMeetingIcon} alt="" width="16" height="16" />
          <span>{t("Delete-meeting")}</span>
        </div>
        <div className={styles.morebtn} onClick={handleCancel}>
          <img src={CancelMeetingIcon} alt="" width="16" height="16" />
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
  const columns = useMemo(() => {
    return [
      {
        title: (
          <>
            <div className="d-flex align-items-center gap-2">
              <span>{t("Meeting-title")}</span>
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
        ellipsis: true,
        sorter: (a, b) => a.title.localeCompare(b.title),
        sortOrder: meetingTitleSort,
        render: (text) => {
          return <span className={styles.tableRow}>{text}</span>;
        },
      },
      {
        title: (
          <>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span>{t("Organizer")}</span>
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
        sorter: (a, b) =>
          a.host.toLowerCase().localeCompare(b.host.toLowerCase()),
        sortOrder: organizerNameSort,
      },
      {
        title: (
          <>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span>{t("Time")}</span>
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
      {
        title: (
          <>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span>{t("Date")}</span>
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
      {
        title: (
          <span className="d-flex justify-content-center align-items-center">
            {t("Meeting-type")}
          </span>
        ),
        dataIndex: "meetingType",
        key: "meetingType",
        width: 140,
        align: "center",

        filters: isMeetingTypeFilter.map((filter) => ({
          text: filter.text,
          value: filter.value,
        })),

        // ⭐ default selected values
        defaultFilteredValue: isMeetingTypeFilter.map((f) => f.value),

        filterResetToDefaultFilteredValue: true,

        // ⭐ REQUIRED: actual filtering logic
        onFilter: (value, record) => {
          console.log(value, record, "onFilteronFilter");
          return Number(record.meetingType) === Number(value);
        },

        filterIcon: (filtered) => (
          <ChevronDown
            className={`filter-chevron-icon-todolist ${
              filtered ? "active" : ""
            }`}
          />
        ),

        // ⭐ custom dropdown UI
        // filterDropdown: () => meetingTypeMenu,

        render: (_, record) => {
          const meetingType = Number(record.meetingType);
          const matchedFilter = isMeetingTypeFilter.find(
            (f) => Number(f.value) === meetingType,
          );

          if (record.isQuickMeeting && meetingType === 1) {
            return t("Quick-meeting");
          }

          return matchedFilter ? t(matchedFilter.text) : "";
        },
      },

      {
        title: "",
        dataIndex: "meetingAction",
        width: 140,
        key: "meetingAction",
        render: (text, record) => {
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
    meetingTypeFilterVisible,
    isMeetingTypeFilter,
    selectedMeetingTypeValues,
  ]);

  return (
    <Row>
      <Col sm={12} md={12} lg={12}>
        <Table
          onChange={handleChangeMeetingTable}
          className="MeetingTable"
          column={columns}
          size={"small"}
          rows={rows}
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
