import React, { useContext, useMemo, useState } from "react";
import styles from "./groupProposedMeetings.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CancelMeetingIcon from "@/assets/images/New Meeting Listing Icons/CancelMeeting.png";
import SortIconAscend from "@/assets/images/sortingIcons/SorterIconAscend.png";
import SortIconDescend from "@/assets/images/sortingIcons/SorterIconDescend.png";
import EditIcon from "@/assets/images/New Meeting Listing Icons/EditMeeting.png";
import { ChevronDown } from "react-bootstrap-icons";
import ChevronDownIcon from "@/assets/images/dropdown-icon.png";
import DoubleArrowIcon from "@/assets/images/sortingIcons/Double Arrow2.svg";
import { Button, Table } from "@/components/elements";
import rspvGreenIcon from "@/assets/images/rspvGreen.svg";
import { useSelector } from "react-redux";
import {
  validateStringParticipantProposedApi,
  validateStringUserMeetingProposedDatesPollsApi,
} from "@/store/actions/NewMeetingActions";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import moment from "moment";
import { convertToArabicNumerals } from "@/commen/functions/regex";
import { Checkbox, Menu, Popover } from "antd";
import ArrowDownIcon from "@/assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "@/assets/images/sortingIcons/Arrow-up.png";
import { MeetingContext } from "@/context/MeetingContext";

import { useNewMeetingContext } from "@/context/NewMeetingContext";
import CustomButton from "@/components/elements/button/Button";
import CustomPagination from "@/commen/functions/customPagination/Paginations";
import {
  forRecentActivity,
  getDifferentisDateisPassed,
} from "@/commen/functions/date_formater";

import {
  getMeetingDetailsByMeetingIdApi,
  getUserWiseProposedDatesForOrganizerApi,
} from "@/store/actions/NewMeeting2.actions";
import {
  toggleIsOrganizerProposedMeetingDates,
  toggleIsParticipantProposedMeetingDates,
} from "@/store/actions/ModalStates_actions";
import { useCommitteeContext } from "@/context/CommitteeContext";
import DeleteMeetingConfirmationModal from "../../../meeting/commonComponents/deleteMeetingConfirmationModal/deleteMeetingConfirmationModal";
import EmptyTableComponent from "../../../meeting/commonComponents/EmptyTableComponent/EmptyTableComponent";
import SceduleProposedmeeting from "../../../meeting/proposedMeetingFlow/SceduleProposedMeeting/SceduleProposedmeeting";
import DeleteMeetingModal from "../../../meeting/proposedMeetingFlow/DeleteMeetingModal/DeleteMeetingModal";
const GroupProposedMeetings = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    isMeetingTypeFilter,
    setProposedMeetingData,
    proposedMeetingData,
    setProposedMeetingDataRecord,
    setResponseByDate,
  } = useNewMeetingContext();
  const { committeeProposedMeetingData, committeeProposedMeetingDataRecord } =
    useCommitteeContext();
  //Current User ID
  //Current Organization
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let MeetingProp = localStorage.getItem("meetingprop");
  let UserMeetPropoDatPoll = localStorage.getItem("UserMeetPropoDatPoll");
  const currentLanguage = localStorage.getItem("i18nextLng");
  const {
    deleteMeetingConfirmationModal,
    setDeleteMeetingConfirmationModal,
    setDeleteMeetingRecord,
  } = useContext(MeetingContext);
  //Proposed Meeting View Flag
  const isOrganizerViewPollProposedMeeting = useSelector(
    (state) => state.ModalStatesReducer.isOrganizerRespondProposedMeeting,
  );

  const deleteMeetingModal = useSelector(
    (state) => state.NewMeetingreducer.deleteMeetingModal,
  );

  const meetingStatusProposedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusProposedMqttData,
  );

  const handleClickActions = (record) => {
    if (record.isParticipant) {
      // record.responseDeadLine
      // record.pK_MDID
      dispatch(
        getMeetingDetailsByMeetingIdApi(
          navigate,
          t,
          { MeetingID: record.pK_MDID },
          "ProposedMeetingViewForParticipant",
          {
            responseDeadline: record.responseDeadLine,
            meetingId: record.pK_MDID,
            setResponseByDate,
          },
        ),
      );
      return;
    }
    if (record.isOrganizer) {
      dispatch(
        getUserWiseProposedDatesForOrganizerApi(
          navigate,
          t,
          { MeetingID: record.pK_MDID },
          "",
        ),
      );

      return;
    }
  };

  const [meetingTitleSort, setMeetingTitleSort] = useState(null);
  const [meetingDateSort, setMeetingDateSort] = useState(null);
  const [duplicatedRows, setDuplicatedRows] = useState([]);

  // Meeting Type Filter State
  const [meetingTypeFilterVisible, setMeetingTypeFilterVisible] =
    useState(false);
  const [selectedMeetingTypeValues, setSelectedMeetingTypeValues] = useState([
    "1",
    "2",
    "3",
  ]);
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
    setProposedMeetingData(filteredData);
    setMeetingTypeFilterVisible(false);
  };

  const resetMeetingTypeFilter = () => {
    setSelectedMeetingTypeValues(["1", "2", "3"]);
    setProposedMeetingData(duplicatedRows);
    setMeetingTypeFilterVisible(false);
  };

  const handleClickMeetingTypeChevron = () => {
    setMeetingTypeFilterVisible((prevVisible) => !prevVisible);
  };
  // Meeting Type Filter Options
  const meetingTypeFilters = [
    { value: "1", text: "Board Meeting" },
    { value: "2", text: "Committee Meeting" },
    { value: "3", text: "Group Meeting" },
  ];
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

  // Handle table sorting and filtering changes
  const handleChangeMeetingTable = (pagination, filters, sorter) => {
    console.log("Table change:", { pagination, filters, sorter });

    // Reset all sort states first
    setMeetingTitleSort(null);
    setMeetingDateSort(null);

    // Set the active sort based on which column is sorted
    if (sorter.order) {
      switch (sorter.columnKey) {
        case "title":
          setMeetingTitleSort(sorter.order);
          break;
        case "date":
          setMeetingDateSort(sorter.order);
          break;
        default:
          break;
      }
    }
  };
  const handleCLickView = (record) => {
    console.log("Edit Meeting", record);
    if (record.isOrganizer) {
      dispatch(
        getMeetingDetailsByMeetingIdApi(
          navigate,
          t,
          { MeetingID: record.pK_MDID },
          "ProposedMeetingFromListingView",
          {},
        ),
      );
    }
  };
  const moreButtons = (record) => {
    const handleEdit = () => {
      console.log("Edit Meeting", record);
      if (record.isOrganizer) {
        dispatch(
          getMeetingDetailsByMeetingIdApi(
            navigate,
            t,
            { MeetingID: record.pK_MDID },
            "EditProposedMeetingFromListing",
            {},
          ),
        );
      }
    };

    const handleDelete = () => {
      console.log("Cancel Meeting", record);
      let Data = {
        MeetingID: record.pK_MDID,
        StatusID: 4,
      };

      setDeleteMeetingRecord(Data);
      setDeleteMeetingConfirmationModal(true);
    };

    return (
      <div className={styles.morebuttons}>
        <div className={styles.morebtn} onClick={handleEdit}>
          <img src={EditIcon} alt='' width='16' height='16' />
          <span>{t("Edit-meeting")}</span>
        </div>

        <div className={styles.morebtn} onClick={handleDelete}>
          <img src={CancelMeetingIcon} alt='' width='16' height='16' />
          <span>{t("Delete-meeting")}</span>
        </div>
      </div>
    );
  };
  const columns = useMemo(() => {
    return [
      {
        title: (
          <>
            <div className='d-flex align-items-center gap-2'>
              <span>{t("Meeting-title")}</span>
              {meetingTitleSort === null ? (
                <img src={DoubleArrowIcon} alt='DoubleArrowIcon' />
              ) : meetingTitleSort === "ascend" ? (
                <img src={SortIconAscend} alt='SortIconAscend' />
              ) : (
                <img src={SortIconDescend} alt='SortIconDescend' />
              )}
            </div>
          </>
        ),
        dataIndex: "title",
        key: "title",
        width: 300,
        ellipsis: true,
        sorter: (a, b) => a.title.localeCompare(b.title),
        sortOrder: meetingTitleSort,
        render: (text, record) => {
          return (
            <span
              onClick={() => {
                handleCLickView(record);
                // try {
                //   let Data = {
                //     MeetingID: Number(record.pK_MDID),
                //   };
                //   dispatch(
                //     GetAllMeetingDetailsApiFunc(
                //       navigate,
                //       t,
                //       Data,
                //       false,
                //       setCurrentMeetingID,
                //       setSceduleMeeting,
                //       setDataroomMapFolderId,
                //       0,
                //       6 /*When User click on title from proposed Tab  */,
                //     ),
                //   );
                //   dispatch(GetAllSavedparticipantsAPI(Data, navigate, t, true));
                //   dispatch(
                //     GetAllProposedMeetingDateApiFunc(Data, navigate, t, true),
                //   );
                // } catch (error) {
                //   console.log(error, "apis call Error");
                // }
              }}
              className={styles.tableRow}>
              {text}
            </span>
          );
        },
      },

      {
        title: (
          <>
            <div className='d-flex align-items-center justify-content-center gap-2'>
              <span>{t("Deadline")}</span>
              {meetingDateSort === null ? (
                <img src={DoubleArrowIcon} alt='DoubleArrowIcon' />
              ) : meetingDateSort === "ascend" ? (
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
          return (
            <span className={styles.columnValue}>{`${moment(meetingDate).format(
              "Do MMM, YYYY",
            )}`}</span>
          );
        },
      },

      {
        title: (
          <>
            <span className='d-flex justify-content-center align-items-center'>
              {t("Vote")}
            </span>
          </>
        ),
        dataIndex: "meetingAction",
        width: 90,
        align: "center",

        key: "meetingAction",
        render: (text, record) => {
          let maxValue = record.meetingPoll?.totalNoOfDirectors;
          let value = record.meetingPoll?.totalNoOfDirectorsVoted;
          let allVoterVotedCompleted =
            value === maxValue && value === 0 && maxValue === 0
              ? null
              : record.meetingPoll?.totalNoOfDirectors ===
                record.meetingPoll?.totalNoOfDirectorsVoted;
          if (record.meetingPoll) {
            return (
              allVoterVotedCompleted && (
                <>
                  {" "}
                  <img
                    src={rspvGreenIcon}
                    height='17.06px'
                    width='17.06px'
                    alt=''
                    draggable='false'
                  />
                </>
              )
            );
          } else {
            return "-";
          }
        },
      },
      {
        title: (
          <span className='d-flex justify-content-center align-items-center'>
            {t("Poll")}
          </span>
        ),
        dataIndex: "meetingAction",
        width: 110,
        align: "center",
        key: "meetingAction",
        render: (text, record) => {
          let maxValue = record.meetingPoll?.totalNoOfDirectors;
          let value = record.meetingPoll?.totalNoOfDirectorsVoted;
          let allVoterVotedCompleted =
            value === maxValue && value === 0 && maxValue === 0
              ? null
              : record.meetingPoll?.totalNoOfDirectors ===
                record.meetingPoll?.totalNoOfDirectorsVoted;
          if (record.meetingPoll) {
            return allVoterVotedCompleted ? (
              <>
                {" "}
                <img
                  src={rspvGreenIcon}
                  height='17.06px'
                  width='17.06px'
                  alt=''
                  draggable='false'
                />
              </>
            ) : (
              <>
                {" "}
                <span className={styles["PollRatioValue"]}>
                  {currentLanguage === "en"
                    ? `${record.meetingPoll?.totalNoOfDirectorsVoted} / ${record.meetingPoll?.totalNoOfDirectors}`
                    : `${convertToArabicNumerals(
                        record.meetingPoll?.totalNoOfDirectorsVoted,
                      )} / ${convertToArabicNumerals(
                        record.meetingPoll?.totalNoOfDirectors,
                      )}`}
                </span>
              </>
            );
          } else {
            return null;
          }
        },
      },
      {
        title: "",
        dataIndex: "meetingAction",
        width: 130,
        key: "meetingAction",
        render: (text, record) => {
          const isResponseDateGone = forRecentActivity(
            `${record.responseDeadLine}000000`,
          );
          const currentDateObj = new Date();

          const isViewPollShown = getDifferentisDateisPassed(
            currentDateObj,
            isResponseDateGone,
          );

          return record.isParticipant ? (
            <div className='d-flex justify-content-center align-items-center gap-2'>
              <div>
                <CustomButton
                  className={styles.MoreMeetingButton}
                  text='Send Reply'
                  disableBtn={isViewPollShown ? true : false}
                  onClick={
                    () => handleClickActions(record)
                    // viewProposeDatePollHandler(
                    //   true,
                    //   false,
                    //   false,
                    //   record.pK_MDID,
                    //   record.responseDeadLine,
                    // )
                  }
                />
              </div>
            </div>
          ) : record.isOrganizer ? (
            <div className='d-flex justify-content-center align-items-center gap-2'>
              <div>
                <CustomButton
                  className={styles.MoreMeetingButton}
                  text={t("View-poll")}
                  onClick={
                    () => handleClickActions(record)

                    // onClick={() =>
                    //   viewProposeDatePollHandler(
                    //     false,
                    //     false,
                    //     true,
                    //     record.pK_MDID,
                    //   )
                  }
                />
              </div>
            </div>
          ) : null;
        },
      },
      {
        title: "",
        dataIndex: "meetingAction",
        width: 130,
        key: "meetingAction",
        render: (text, record) => {
          let isOrganizer = record.isOrganizer;

          return (
            isOrganizer && (
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
                      icon2={
                        <img
                          src={ChevronDownIcon}
                          alt='Chevron Down'
                          width={10}
                        />
                      }
                    />
                  </Popover>
                </div>
              </div>
            )
          );
        },
      },
    ];
  }, [
    meetingTitleSort,
    meetingDateSort,
    selectedMeetingTypeValues,
    isMeetingTypeFilter,
  ]);

  //

  useEffect(() => {
    if (MeetingProp !== null) {
      const callApi = async () => {
        try {
          let getApiResponse = await validateStringParticipantProposedApi(
            MeetingProp,
            navigate,
            t,
          )(dispatch); // Ensure you're passing dispatch here
          if (getApiResponse) {
            localStorage.setItem(
              "viewProposeDatePollMeetingID",
              getApiResponse.meetingID,
            );
            localStorage.removeItem("meetingprop");
            setResponseByDate(getApiResponse.deadline);
            dispatch(toggleIsParticipantProposedMeetingDates(true));
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
                t,
              )(dispatch); // Ensure you're passing dispatch here

            if (getApiResponse) {
              localStorage.setItem(
                "viewProposeDatePollMeetingID",
                getApiResponse.meetingID,
              );
              localStorage.removeItem("UserMeetPropoDatPoll");
              dispatch(toggleIsOrganizerProposedMeetingDates(true));
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
    <>
      <Row>
        <Col lg={12} md={12} sm={12} className='w-100'>
          <Table
            onChange={handleChangeMeetingTable}
            className='MeetingTable'
            column={columns}
            size={"small"}
            rows={committeeProposedMeetingData}
            sticky={true}
            pagination={false}
            scroll={{
              y: 400,
            }}
            locale={{
              emptyText: <EmptyTableComponent />, // Set your custom empty text here
            }}
          />
        </Col>{" "}
        {committeeProposedMeetingData.length > 0 && (
          <Col className={styles["ProposedMeeting_Pagination"]}>
            <div className='d-flex justify-content-center mt-2 '>
              <Row className={styles["PaginationStyle-Committee"]}>
                <Col
                  className={"pagination-groups-table"}
                  sm={12}
                  md={12}
                  lg={12}>
                  <CustomPagination
                    current={
                      meetingPageCurrent !== null
                        ? Number(meetingPageCurrent)
                        : 1
                    }
                    pageSize={
                      meetingpageRow !== null ? Number(meetingpageRow) : 50
                    }
                    // onChange={handelChangePagination}
                    total={committeeProposedMeetingDataRecord}
                    showSizer={true}
                    pageSizeOptionsValues={["30", "50", "100", "200"]}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        )}
      </Row>
      {isOrganizerViewPollProposedMeeting && <SceduleProposedmeeting />}
      {deleteMeetingModal && <DeleteMeetingModal />}
      {deleteMeetingConfirmationModal && <DeleteMeetingConfirmationModal />}
    </>
  );
};

export default GroupProposedMeetings;
