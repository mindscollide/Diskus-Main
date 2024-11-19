import React, { useState } from "react";
import styles from "./UnpublishedProposedMeeting.module.css";
import { Col, Row, ProgressBar } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import NoMeetingsIcon from "../../../../../../assets/images/No-Meetings.png";
import { ChevronDown } from "react-bootstrap-icons";
import {
  Button,
  ResultMessage,
  Table,
} from "../../../../../../components/elements";
import rspvGreenIcon from "../../../../../../assets/images/rspvGreen.svg";
import DeleteMeetingModal from "./DeleteMeetingModal/DeleteMeetingModal";
import { useSelector } from "react-redux";
import {
  GetAllMeetingDetailsApiFunc,
  showSceduleProposedMeeting,
  scheduleMeetingPageFlag,
  viewProposeDateMeetingPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewProposeOrganizerMeetingPageFlag,
  viewMeetingFlag,
  meetingDetailsGlobalFlag,
  organizersGlobalFlag,
  agendaContributorsGlobalFlag,
  participantsGlobalFlag,
  agendaGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  actionsGlobalFlag,
  pollsGlobalFlag,
  attendanceGlobalFlag,
  uploadGlobalFlag,
  meetingAgendaContributorAdded,
  meetingAgendaContributorRemoved,
  meetingOrganizerAdded,
  meetingOrganizerRemoved,
  validateStringParticipantProposedApi,
  GetAllProposedMeetingDateApiFunc,
  GetAllSavedparticipantsAPI,
  validateStringUserMeetingProposedDatesPollsApi,
} from "../../../../../../store/actions/NewMeetingActions";
import {
  GetAllUserChats,
  activeChat,
} from "../../../../../../store/actions/Talk_action";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SceduleProposedmeeting from "./SceduleProposedMeeting/SceduleProposedmeeting";
import { useEffect } from "react";
import { StatusValue } from "../../../statusJson";
import {
  forRecentActivity,
  getDifferentisDateisPassed,
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../../../../commen/functions/date_formater";
import { UpdateOrganizersMeeting } from "../../../../../../store/actions/MeetingOrganizers_action";
import moment from "moment";
import {
  convertToArabicNumerals,
  truncateString,
} from "../../../../../../commen/functions/regex";
import { Checkbox, Dropdown, Menu, Tooltip } from "antd";
import {
  getAllUnpublishedMeetingData,
  mqttMeetingData,
} from "../../../../../../hooks/meetingResponse/response";
import { checkFeatureIDAvailability } from "../../../../../../commen/functions/utils";
import DescendIcon from "../../../../../../assets/images/sortingIcons/SorterIconDescend.png";
import AscendIcon from "../../../../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowDownIcon from "../../../../../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../../../../../assets/images/sortingIcons/Arrow-up.png";

const UnpublishedProposedMeeting = ({
  setViewProposeDatePoll,
  setViewProposeOrganizerPoll,
  setAdvanceMeetingModalID,
  setViewAdvanceMeetingModalUnpublish,
  setSceduleMeeting,
  setEdiorRole,
  setEditMeeting,
  setCurrentMeetingID,
  setDataroomMapFolderId,
  setResponseByDate,
  setVideoTalk,
  setProposedNewMeeting,
  setIsProposedMeetEdit,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  let currentUserId = localStorage.getItem("userID");
  let currentOrganizationId = localStorage.getItem("organizationID");
  let MeetingProp = localStorage.getItem("meetingprop");
  let UserMeetPropoDatPoll = localStorage.getItem("UserMeetPropoDatPoll");
  const currentLanguage = localStorage.getItem("i18nextLng");

  const searchMeetings = useSelector(
    (state) => state.NewMeetingreducer.searchMeetings
  );
  const sceduleproposedMeeting = useSelector(
    (state) => state.NewMeetingreducer.sceduleproposedMeeting
  );
  const deleteMeetingModal = useSelector(
    (state) => state.NewMeetingreducer.deleteMeetingModal
  );
  const allMeetingsSocketData = useSelector(
    (state) => state.meetingIdReducer.allMeetingsSocketData
  );
  const meetingStatusProposedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusProposedMqttData
  );
  const meetingStatusPublishedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusPublishedMqttData
  );
  const mqttMeetingAcAdded = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingAcAdded
  );
  const mqttMeetingAcRemoved = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingAcRemoved
  );
  const mqttMeetingOrgAdded = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingOrgAdded
  );
  const mqttMeetingOrgRemoved = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingOrgRemoved
  );

  const [rows, setRow] = useState([]);
  const [dublicatedrows, setDublicatedrows] = useState([]);
  const [publishState, setPublishState] = useState(null);
  const [meetingTitleSort, setMeetingTitleSort] = useState(null);
  const [meetingOrganizerSort, setMeetingOrganizerSort] = useState(null);
  const [meetingDateTimeSort, setMeetingDateTimeSort] = useState(null);

  // Empty text data
  const emptyText = () => {
    return (
      <ResultMessage
        icon={
          <img
            src={NoMeetingsIcon}
            alt=""
            draggable="false"
            className="nodata-table-icon"
          />
        }
        title={t("No-new-meetings")}
        subTitle={t("Anything-important-thats-needs-discussion")}
      />
    );
  };

  const viewProposeDatePollHandler = (
    isParticipant,
    isAgendaContributor,
    isOrganiser,
    id,
    responseDeadLine
  ) => {
    localStorage.setItem("viewProposeDatePollMeetingID", id);
    if (isParticipant) {
      setResponseByDate(responseDeadLine);
      setViewProposeDatePoll(true);
      dispatch(viewProposeDateMeetingPageFlag(true));
      dispatch(meetingDetailsGlobalFlag(false));
      dispatch(organizersGlobalFlag(false));
      dispatch(agendaContributorsGlobalFlag(false));
      dispatch(participantsGlobalFlag(false));
      dispatch(agendaGlobalFlag(false));
      dispatch(meetingMaterialGlobalFlag(false));
      dispatch(minutesGlobalFlag(false));
      dispatch(proposedMeetingDatesGlobalFlag(true));
      dispatch(actionsGlobalFlag(false));
      dispatch(pollsGlobalFlag(false));
      dispatch(attendanceGlobalFlag(false));
      dispatch(uploadGlobalFlag(false));
    } else if (isAgendaContributor) {
    } else if (isOrganiser) {
      dispatch(showSceduleProposedMeeting(true));
      setViewProposeOrganizerPoll(false);
      dispatch(viewProposeOrganizerMeetingPageFlag(false));
      dispatch(meetingDetailsGlobalFlag(false));
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
  };

  const handleOpenViewModal = async (data) => {
    setAdvanceMeetingModalID(data.pK_MDID);
    setViewAdvanceMeetingModalUnpublish(true);
    dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
  };

  const handleEditMeeting = async (id, agendaContributorFlag, record) => {
    if (agendaContributorFlag === false && record.status === "12") {
      let Data = {
        MeetingID: Number(id),
      };

      await dispatch(
        GetAllMeetingDetailsApiFunc(
          navigate,
          t,
          Data,
          false,
          setCurrentMeetingID,
          setSceduleMeeting,
          setDataroomMapFolderId,
          0,
          2
        )
      );
      await dispatch(GetAllSavedparticipantsAPI(Data, navigate, t, true));
      await dispatch(GetAllProposedMeetingDateApiFunc(Data, navigate, t, true));
      setIsProposedMeetEdit(true);
      setProposedNewMeeting(true);
    } else {
      let Data = {
        MeetingID: Number(id),
      };
      await dispatch(
        GetAllMeetingDetailsApiFunc(
          navigate,
          t,
          Data,
          false,
          setCurrentMeetingID,
          setSceduleMeeting,
          setDataroomMapFolderId,
          0,
          1
        )
      );
      dispatch(scheduleMeetingPageFlag(true));
    }
  };

  const changeDateStartHandler2 = (date) => {
    let newDate = moment(date).format("DD MMMM YYYY");
    return newDate;
  };

  //Filteration Work Meeting
  const [visible, setVisible] = useState(false);
  const [selectedValues, setSelectedValues] = useState(["12", "11"]);

  const filters = [
    {
      value: "12",
      text: t("Proposed"),
    },
    {
      value: "11",
      text: t("Unpublished"),
    },
  ];

  // Menu click handler for selecting filters
  const handleMenuClick = (filterValue) => {
    setSelectedValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)]
    );
  };

  const handleApplyFilter = () => {
    const filteredData = dublicatedrows.filter((item) =>
      selectedValues.includes(item.status.toString())
    );
    console.log(filteredData, "filteredDatafilteredData");

    setRow(filteredData);
    setVisible(false);
  };

  const resetFilter = () => {
    setSelectedValues(["12", "11"]);
    setRow(dublicatedrows);
    setVisible(false);
  };

  const handleClickChevron = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const menu = (
    <Menu>
      {filters.map((filter) => (
        <Menu.Item
          key={filter.value}
          onClick={() => handleMenuClick(filter.value)}
        >
          <Checkbox checked={selectedValues.includes(filter.value)}>
            {t(filter.text)}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className="d-flex  align-items-center justify-content-between p-1">
        <Button
          text={t("Reset")}
          className={styles["FilterResetBtn"]}
          onClick={resetFilter}
        />
        <Button
          text={t("Ok")}
          disableBtn={selectedValues.length === 0}
          className={styles["ResetOkBtn"]}
          onClick={handleApplyFilter}
        />
      </div>
    </Menu>
  );

  const MeetingColoumns = [
    {
      title: (
        <span className="d-flex gap-2 align-items-center">
          {" "}
          {t("Title")}{" "}
          {meetingTitleSort === "descend" ? (
            <img src={DescendIcon} alt="" />
          ) : (
            <img src={AscendIcon} alt="" />
          )}
        </span>
      ),
      dataIndex: "title",
      key: "title",
      width: "115px",
      align: currentLanguage === "en" ? "left" : "right",
      render: (text, record) => {
        return (
          <span
            className={styles["meetingTitle_view"]}
            onClick={() => {
              setEdiorRole({
                status: record.status,
                role: record.isParticipant
                  ? "Participant"
                  : record.isAgendaContributor
                  ? "Agenda Contributor"
                  : "Organizer",
              });
              setVideoTalk({
                isChat: record.isChat,
                isVideoCall: record.isVideoCall,
                talkGroupID: record.talkGroupID,
              });
              localStorage.setItem("videoCallURL", record.videoCallURL);
              handleOpenViewModal(record);
              dispatch(viewMeetingFlag(true));
              dispatch(
                GetAllUserChats(
                  navigate,
                  parseInt(currentUserId),
                  parseInt(currentOrganizationId),
                  t
                )
              );
              let activeChatData = {
                id: record.talkGroupID,
                fullName: record.title,
                imgURL: "",
                messageBody: "",
                messageDate: "",
                notiCount: 0,
                messageType: "G",
                isOnline: false,
                companyName: "",
                sentDate: "",
                receivedDate: "",
                seenDate: "",
                attachmentLocation: "",
                senderID: 0,
                admin: 0,
                isBlock: 0,
              };
              dispatch(activeChat(activeChatData));
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
            }}
          >
            {truncateString(text, 35)}
          </span>
        );
      },
      onHeaderCell: () => ({
        onClick: () => {
          setMeetingTitleSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      sorter: (a, b) => {
        return a?.title.toLowerCase().localeCompare(b?.title.toLowerCase());
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "90px",
      align: "center",
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <ChevronDown
          className="filter-chevron-icon-todolist"
          onClick={handleClickChevron}
        />
      ),
      filterDropdown: () => (
        <Dropdown
          overlay={menu}
          visible={visible}
          onVisibleChange={(open) => setVisible(open)}
        >
          <div />
        </Dropdown>
      ),
      render: (text, record) => {
        return StatusValue(t, record.status);
      },
    },
    {
      title: (
        <span className="d-flex gap-2 align-items-center justify-content-center">
          {t("Organizer")}
          {meetingOrganizerSort === "descend" ? (
            <img src={DescendIcon} alt="" />
          ) : (
            <img src={AscendIcon} alt="" />
          )}
        </span>
      ),
      dataIndex: "meetingAttendees",
      key: "meetingAttendees",
      width: "110px",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          setMeetingOrganizerSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      align: "center",
      sorter: (a, b) => {
        const nameA = a.userDetails?.name || "";
        const nameB = b.userDetails?.name || "";
        return nameA.localeCompare(nameB);
      },
      render: (text, record) => {
        return <span className={styles["orgaizer_value"]}>{record.host}</span>;
      },
    },
    {
      title: (
        <span className="d-flex gap-2 align-items-center justify-content-center">
          {t("Date-time")}
          {meetingDateTimeSort === "descend" ? (
            <img src={ArrowDownIcon} alt="" />
          ) : (
            <img src={ArrowUpIcon} alt="" />
          )}
        </span>
      ),
      dataIndex: "Date",
      key: "Date",
      width: "155px",
      ellipsis: true,
      align: "center",
      onHeaderCell: () => ({
        onClick: () => {
          setMeetingDateTimeSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => {
        if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
          return (
            <span className="text-truncate d-block ">
              {newTimeFormaterAsPerUTCFullDate(
                record.dateOfMeeting + record.meetingStartTime,
                currentLanguage
              )}
            </span>
          );
        }
      },
      sorter: (a, b, sortOrder) => {
        const dateA = utcConvertintoGMT(
          `${a?.dateOfMeeting}${a?.meetingStartTime}`
        );
        const dateB = utcConvertintoGMT(
          `${b?.dateOfMeeting}${b?.meetingStartTime}`
        );
        return dateA - dateB;
      },
    },
    {
      title: (
        <>
          <span className="d-flex justify-content-center">{t("Polls")}</span>
        </>
      ),
      dataIndex: "getAllMeetingDetails",
      key: "MeetingPoll",
      width: "115px",
      align: "center",
      render: (text, record) => {
        let maxValue = record.meetingPoll?.totalNoOfDirectors;
        let value = record.meetingPoll?.totalNoOfDirectorsVoted;
        if (record.meetingPoll) {
          return (
            <>
              <Row>
                <Col lg={12} md={12} sm={12} className="text-center">
                  {value === maxValue &&
                  value === 0 &&
                  maxValue === 0 ? null : record.meetingPoll
                      ?.totalNoOfDirectors ===
                    record.meetingPoll?.totalNoOfDirectorsVoted ? (
                    <img
                      src={rspvGreenIcon}
                      height="17.06px"
                      width="17.06px"
                      alt=""
                      draggable="false"
                    />
                  ) : (
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={
                            "d-flex justify-content-center flex-column"
                          }
                        >
                          <span className={styles["RatioClass"]}>
                            {currentLanguage === "en"
                              ? `${record.meetingPoll?.totalNoOfDirectorsVoted} / ${record.meetingPoll?.totalNoOfDirectors}`
                              : `${convertToArabicNumerals(
                                  record.meetingPoll?.totalNoOfDirectorsVoted
                                )} / ${convertToArabicNumerals(
                                  record.meetingPoll?.totalNoOfDirectors
                                )}`}
                          </span>
                          <ProgressBar
                            now={value}
                            max={maxValue}
                            className={"newMeetingProgressbar"}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                </Col>
              </Row>
            </>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: (
        <>
          <span className="d-flex justify-content-center">
            {t("Send-reponse-by")}
          </span>
        </>
      ),
      dataIndex: "responseDeadLine",
      key: "responseDeadLine",
      width: "125px",
      align: "center",
      render: (text, record) => {
        return (
          <>
            {record.status === "12" ? (
              <span className="d-flex justify-content-center">
                {changeDateStartHandler2(record.responseDeadLine)}
              </span>
            ) : (
              ""
            )}
          </>
        );
      },
    },

    {
      dataIndex: "Edit",
      key: "Edit",
      width: "33px",
      render: (text, record) => {
        return (
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex  align-items-center justify-content-center gap-4"
              >
                {record.isAgendaContributor ? (
                  <Tooltip placement="bottomLeft" title={t("Edit")}>
                    <img
                      src={EditIcon}
                      className="cursor-pointer"
                      width="17.03px"
                      height="17.03px"
                      alt=""
                      draggable="false"
                      onClick={() => {
                        handleEditMeeting(
                          record.pK_MDID,
                          record.isAgendaContributor,
                          record
                        );
                        setVideoTalk({
                          isChat: record.isChat,
                          isVideoCall: record.isVideoCall,
                          talkGroupID: record.talkGroupID,
                        });
                        localStorage.setItem(
                          "videoCallURL",
                          record.videoCallURL
                        );
                        setEdiorRole({
                          status: record.status,
                          role: "Agenda Contributor",
                          isPrimaryOrganizer: record.isPrimaryOrganizer,
                        });
                        setEditMeeting(true);
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
                      }}
                    />
                  </Tooltip>
                ) : record.isOrganizer ? (
                  <>
                    <Tooltip placement="bottomLeft" title={t("Edit")}>
                      <img
                        src={EditIcon}
                        className="cursor-pointer"
                        width="17.03px"
                        height="17.03px"
                        alt=""
                        draggable="false"
                        onClick={() => {
                          handleEditMeeting(
                            record.pK_MDID,
                            record.isAgendaContributor,
                            record
                          );
                          setVideoTalk({
                            isChat: record.isChat,
                            isVideoCall: record.isVideoCall,
                            talkGroupID: record.talkGroupID,
                          });
                          localStorage.setItem(
                            "videoCallURL",
                            record.videoCallURL
                          );
                          setEdiorRole({
                            status: record.status,
                            role: "Organizer",
                            isPrimaryOrganizer: record.isPrimaryOrganizer,
                          });
                          setEditMeeting(true);
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
                        }}
                      />
                    </Tooltip>
                  </>
                ) : null}
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      dataIndex: "Edit",
      key: "Edit",
      width: "115px",
      align: "center",
      render: (text, record) => {
        const isResponseDateGone = forRecentActivity(
          `${record.responseDeadLine}000000`
        );
        const currentDateObj = new Date();

        const isViewPollShown = getDifferentisDateisPassed(
          currentDateObj,
          isResponseDateGone
        );

        let apiData = {
          MeetingID: Number(record.pK_MDID),
          StatusID: 1,
        };
        return (
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex  align-items-center justify-content-center gap-4"
              >
                {record.status === "11" ? (
                  record.isParticipant ? null : record.isAgendaContributor ? null : (
                    <Button
                      text={t("Publish-meeting")}
                      className={styles["publish_meeting_btn"]}
                      onClick={() => {
                        console.log("end meeting chaek");
                        dispatch(
                          UpdateOrganizersMeeting(
                            false,
                            navigate,
                            t,
                            5,
                            apiData
                          )
                        );
                      }}
                    />
                  )
                ) : record.status === "12" ? (
                  record.isParticipant ? (
                    <Button
                      text={t("Send-reply")}
                      className={styles["publish_meeting_btn_View_poll"]}
                      disableBtn={isViewPollShown ? true : false}
                      onClick={() =>
                        viewProposeDatePollHandler(
                          true,
                          false,
                          false,
                          record.pK_MDID,
                          record.responseDeadLine
                        )
                      }
                    />
                  ) : record.isAgendaContributor ? null : (
                    <Button
                      text={t("View-poll")}
                      className={styles["publish_meeting_btn_View_poll"]}
                      // disableBtn={isViewPollShown ? true : false}
                      onClick={() =>
                        viewProposeDatePollHandler(
                          false,
                          false,
                          true,
                          record.pK_MDID
                        )
                      }
                    />
                  )
                ) : null}
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (allMeetingsSocketData !== null) {
      let tableRowsData = [...rows];
      var foundIndex = tableRowsData.findIndex(
        (x) => x.pK_MDID === allMeetingsSocketData.pK_MDID
      );
      if (foundIndex !== -1) {
        const newState = tableRowsData.map((obj, index) => {
          // 👇️ if id equals 2 replace object
          if (foundIndex === index) {
            return allMeetingsSocketData;
          }

          // 👇️ otherwise return object as is
          return obj;
        });
        setRow(newState);
      } else {
        setRow([allMeetingsSocketData, ...rows]);
      }
    }
  }, [allMeetingsSocketData]);

  useEffect(() => {
    try {
      if (searchMeetings !== null && searchMeetings !== undefined) {
        if (
          searchMeetings.meetings !== null &&
          searchMeetings.meetings !== undefined &&
          searchMeetings.meetings.length > 0
        ) {
          console.log(searchMeetings.meetings, "searchMeetingssearchMeetings");
          // Create a deep copy of the meetings array
          let copyMeetingData = searchMeetings.meetings.map((meeting) => ({
            ...meeting,
            meetingAgenda: meeting.meetingAgenda.filter(
              (agenda) => agenda.objMeetingAgenda.canView
            ),
          }));
          copyMeetingData.forEach((data) => {
            data.meetingAgenda = data.meetingAgenda.filter((agenda) => {
              return agenda.objMeetingAgenda.canView === true;
            });
          });
          console.log(copyMeetingData, "searchMeetingssearchMeetings");

          if (checkFeatureIDAvailability(12)) {
            setRow(copyMeetingData);
            setDublicatedrows(copyMeetingData);
          } else {
            let filterOutPropsed = copyMeetingData.filter((data) => {
              return data.status !== "12";
            });

            setRow(filterOutPropsed);
            setDublicatedrows(filterOutPropsed);
          }
        } else {
          setRow([]);
          setDublicatedrows([]);
        }
      } else {
        setRow([]);
        setDublicatedrows([]);
      }
    } catch (error) {
      // Handle errors here
    }
  }, [searchMeetings]);

  useEffect(() => {
    if (publishState) {
      const filteredArray = rows.filter(
        (item) => item.pK_MDID !== publishState
      );
      setRow(filteredArray);
      setPublishState(null);
    }
  }, [publishState]);

  useEffect(() => {
    const updateMeetingData = async () => {
      if (
        meetingStatusProposedMqttData !== null &&
        meetingStatusProposedMqttData !== undefined
      ) {
        let meetingData = meetingStatusProposedMqttData;
        const indexToUpdate = rows.findIndex(
          (obj) => obj.pK_MDID === meetingData.pK_MDID
        );

        // Fetching unpublished meeting data
        let getMeetingDataArray = await getAllUnpublishedMeetingData(
          [meetingData],
          1
        );

        // Assuming getMeetingDataArray is an array with a single object
        const getMeetingData = getMeetingDataArray[0];

        // Check if the meeting exists in the current rows
        if (indexToUpdate !== -1) {
          let updatedRows = [...rows];
          updatedRows[indexToUpdate] = getMeetingData;
          setRow(updatedRows);
        } else {
          let updatedRows = [getMeetingData, ...rows];
          setRow(updatedRows);
        }
      }
    };

    updateMeetingData();
  }, [meetingStatusProposedMqttData]);

  useEffect(() => {
    if (
      meetingStatusPublishedMqttData !== null &&
      meetingStatusPublishedMqttData !== undefined
    ) {
      let meetingData = meetingStatusPublishedMqttData;
      try {
        const updatedRows = rows.filter(
          (obj) => obj.pK_MDID !== meetingData.pK_MDID
        );
        setRow(updatedRows);
      } catch {}
    }
  }, [meetingStatusPublishedMqttData]);

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
          (obj) => obj.pK_MDID !== meetingData.pK_MDID
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
          (obj) => obj.pK_MDID !== meetingData.pK_MDID
        );
        setRow(updatedRows);
        dispatch(meetingAgendaContributorAdded(null));
        dispatch(meetingAgendaContributorRemoved(null));
        dispatch(meetingOrganizerAdded(null));
        dispatch(meetingOrganizerRemoved(null));
      } catch {}
    }
  }, [mqttMeetingOrgRemoved]);

  useEffect(() => {
    if (MeetingProp !== null) {
      const callApi = async () => {
        try {
          let getApiResponse = await validateStringParticipantProposedApi(
            MeetingProp,
            navigate,
            t
          )(dispatch); // Ensure you're passing dispatch here
          if (getApiResponse) {
            localStorage.setItem(
              "viewProposeDatePollMeetingID",
              getApiResponse.meetingID
            );
            localStorage.removeItem("meetingprop");
            setResponseByDate(getApiResponse.deadline);
            setViewProposeDatePoll(true);
            dispatch(viewProposeDateMeetingPageFlag(true));
            dispatch(meetingDetailsGlobalFlag(false));
            dispatch(organizersGlobalFlag(false));
            dispatch(agendaContributorsGlobalFlag(false));
            dispatch(participantsGlobalFlag(false));
            dispatch(agendaGlobalFlag(false));
            dispatch(meetingMaterialGlobalFlag(false));
            dispatch(minutesGlobalFlag(false));
            dispatch(proposedMeetingDatesGlobalFlag(true));
            dispatch(actionsGlobalFlag(false));
            dispatch(pollsGlobalFlag(false));
            dispatch(attendanceGlobalFlag(false));
            dispatch(uploadGlobalFlag(false));
          }
        } catch (error) {
          console.error("Error in API call:", error);
          localStorage.removeItem("meetingprop");
        }
      };

      callApi();
    }
  }, [MeetingProp]); // Add `dispatch` to the dependency array

  useEffect(() => {
    if (UserMeetPropoDatPoll !== null) {
      try {
        const callApi1 = async () => {
          try {
            let getApiResponse =
              await validateStringUserMeetingProposedDatesPollsApi(
                UserMeetPropoDatPoll,
                navigate,
                t
              )(dispatch); // Ensure you're passing dispatch here

            if (getApiResponse) {
              localStorage.setItem(
                "viewProposeDatePollMeetingID",
                getApiResponse.meetingID
              );
              localStorage.removeItem("UserMeetPropoDatPoll");
              dispatch(showSceduleProposedMeeting(true));
              setViewProposeOrganizerPoll(false);
              dispatch(viewProposeOrganizerMeetingPageFlag(false));
              dispatch(meetingDetailsGlobalFlag(false));
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
          } catch (error) {
            console.error("Error in API call:", error);
            localStorage.removeItem("UserMeetPropoDatPoll");
          }
        };

        callApi1();
      } catch (error) {}
    }
  }, [UserMeetPropoDatPoll]);
  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className="w-100">
          <Table
            column={MeetingColoumns}
            scroll={{ y: "54vh", x: false }}
            pagination={false}
            className="newMeetingTable"
            rows={rows}
            locale={{
              emptyText: emptyText(), // Set your custom empty text here
            }}
          />
        </Col>
      </Row>
      {sceduleproposedMeeting && (
        <SceduleProposedmeeting
          setDataroomMapFolderId={setDataroomMapFolderId}
          setCurrentMeetingID={setCurrentMeetingID}
          setSceduleMeeting={setSceduleMeeting}
        />
      )}
      {deleteMeetingModal && <DeleteMeetingModal />}
    </section>
  );
};

export default UnpublishedProposedMeeting;
