import React, { useEffect, useState } from "react";
import styles from "./Polls.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BinIcon from "../../../../../assets/images/bin.svg";
import { Pagination, Tooltip } from "antd";
import { useSelector } from "react-redux";
import addmore from "../../../../../assets/images/addmore.png";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Table,
  Notification,
} from "../../../../../components/elements";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import { ChevronDown } from "react-bootstrap-icons";
import emtystate from "../../../../../assets/images/EmptyStatesMeetingPolls.svg";
import Createpolls from "./CreatePolls/Createpolls";
import CastVotePollsMeeting from "./CastVotePollsMeeting/CastVotePollsMeeting";
import {
  CleareMessegeNewMeeting,
  GetAllPollsByMeetingIdApiFunc,
  showCancelPolls,
  showUnsavedPollsMeeting,
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
  editFlowDeleteSavedPollsMeeting,
} from "../../../../../store/actions/NewMeetingActions";
import EditPollsMeeting from "./EditPollsMeeting/EditPollsMeeting";
import AfterViewPolls from "./AfterViewPolls/AfterViewPolls";
import CancelPolls from "./CancelPolls/CancelPolls";
import { _justShowDateformatBilling } from "../../../../../commen/functions/date_formater";
import {
  createPollMeetingMQTT,
  deleteMeetingPollApi,
  deletePollsMQTT,
  getPollByPollIdforMeeting,
  getPollsByPollIdApi,
} from "../../../../../store/actions/Polls_actions";
import CustomPagination from "../../../../../commen/functions/customPagination/Paginations";
import ViewPollsPublishedScreen from "./ViewPollsPublishedScreen/ViewPollsPublishedScreen";
import ViewPollsUnPublished from "./VIewPollsUnPublished/ViewPollsUnPublished";
import EditDeletePollConfirm from "./EditDeletePollConfirm/EditDeletePollConfirm";
const Polls = ({
  setSceduleMeeting,
  setPolls,
  setAttendance,
  currentMeeting,
  editorRole,
  setEditMeeting,
  isEditMeeting,
  setactionsPage,
  setDataroomMapFolderId,
  setEdiorRole,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer, CommitteeReducer, PollsReducer } = useSelector(
    (state) => state
  );
  const [votePolls, setvotePolls] = useState(false);
  const [createpoll, setCreatepoll] = useState(false);
  const [editPolls, setEditPolls] = useState(false);
  const [pollsRows, setPollsRows] = useState([]);
  const [afterViewPolls, setafterViewPolls] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewPublishedPoll, setViewPublishedPoll] = useState(false);
  console.log(currentMeeting, "currentMeetingcurrentMeeting");
  // Unpublished Poll
  const [unPublished, setUnPublished] = useState(false);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  let OrganizationID = localStorage.getItem("organizationID");
  let userID = localStorage.getItem("userID");

  const handleCacnelbutton = () => {
    dispatch(showCancelPolls(true));
  };

  const handleEditMeetingPoll = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    dispatch(getPollsByPollIdApi(navigate, data, 0, t, setEditPolls));
  };
  const [pollID, setPollId] = useState(0);

  const handleDeletePoll = (record) => {
    dispatch(editFlowDeleteSavedPollsMeeting(true));
    setPollId(record.pollID);
  };

  useEffect(() => {
    let Data = {
      MeetingID: currentMeeting,
      OrganizationID: Number(OrganizationID),
      CreatorName: "",
      PollTitle: "",
      PageNumber: 1,
      Length: 50,
    };
    dispatch(GetAllPollsByMeetingIdApiFunc(Data, navigate, t));
  }, []);

  const handleChangePagination = (current, pageSize) => {
    setPageNumber(current);
    setPageSize(pageSize);
    let Data = {
      MeetingID: currentMeeting,
      OrganizationID: Number(OrganizationID),
      CreatorName: "",
      PollTitle: "",
      PageNumber: Number(current),
      Length: Number(pageSize),
    };
    dispatch(GetAllPollsByMeetingIdApiFunc(Data, navigate, t));
  };
  useEffect(() => {
    try {
      if (
        NewMeetingreducer.getPollsMeetingID !== undefined &&
        NewMeetingreducer.getPollsMeetingID !== null
      ) {
        let pollsData = NewMeetingreducer.getPollsMeetingID.polls;
        setTotalRecords(NewMeetingreducer.getPollsMeetingID.totalRecords);

        let newPollsArray = [];
        pollsData.forEach((data, index) => {
          newPollsArray.push(data);
        });
        setPollsRows(newPollsArray);
      } else {
        setPollsRows([]);
        setTotalRecords(0);
      }
    } catch {}
  }, [NewMeetingreducer.getPollsMeetingID]);

  // MQTT Response of Polls for Meeting
  useEffect(() => {
    try {
      if (PollsReducer.newPollMeeting !== null) {
        let PollData = PollsReducer.newPollMeeting;
        if (Number(PollData.meetingID) === Number(currentMeeting)) {
          setPollsRows([PollData.polls, ...pollsRows]);
        }
        dispatch(createPollMeetingMQTT(null));
      }
    } catch (error) {
      console.log(error);
    }
  }, [PollsReducer.newPollMeeting]);

  useEffect(() => {
    try {
      if (
        PollsReducer.pollingSocket &&
        Object.keys(PollsReducer.pollingSocket).length > 0
      ) {
        const { pollingSocket } = PollsReducer;
        const { polls } = pollingSocket;

        let updatedRows = [...pollsRows];

        const findIndex = updatedRows.findIndex(
          (rowData) => rowData?.pollID === polls?.pollID
        );

        if (findIndex !== -1) {
          if (Number(polls.pollStatus.pollStatusId) === 4) {
            updatedRows.splice(findIndex, 1); // Remove the poll
          } else if (Number(polls.pollStatus.pollStatusId) === 3) {
            updatedRows[findIndex] = polls; // Update the existing poll
          }
        } 

        setPollsRows(updatedRows);
      }
    } catch (error) {
      console.log(error, "errorerror");
    }
  }, [PollsReducer.pollingSocket]);

  useEffect(() => {
    try {
      if (PollsReducer.newPollDelete !== null) {
        const polls = PollsReducer.newPollDelete;

        setPollsRows((pollingDataDelete) => {
          return pollingDataDelete.filter(
            (newData2, index) =>
              Number(newData2.pollID) !== Number(polls?.pollID)
          );
        });
        dispatch(deletePollsMQTT(null));
      }
    } catch (error) {
      console.log(error);
    }
  }, [PollsReducer.newPollDelete]);


  const handleClickTitle = (record) => {
    if (
      Number(record.pollStatus.pollStatusId) === 1 ||
      Number(record.pollStatus.pollStatusId) === 3
    ) {
      let data = {
        PollID: record.pollID,
        UserID: parseInt(userID),
      };
      dispatch(
        getPollByPollIdforMeeting(
          navigate,
          data,
          3,
          t,
          setEditPolls,
          setvotePolls,
          setUnPublished,
          setViewPublishedPoll
        )
      );
    } else if (record.pollStatus.pollStatusId === 2) {
      let data = {
        PollID: record.pollID,
        UserID: parseInt(userID),
      };
      dispatch(
        getPollByPollIdforMeeting(
          navigate,
          data,
          4,
          t,
          setEditPolls,
          setvotePolls,
          setUnPublished,
          setViewPublishedPoll
        )
      );
    }
  };

  const voteCastModal = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    dispatch(
      getPollByPollIdforMeeting(
        navigate,
        data,
        2,
        t,
        setEditPolls,
        setvotePolls,
        setUnPublished,
        setViewPublishedPoll
      )
    );
  };
  const PollsColoumn = [
    {
      title: t("Poll-title"),
      dataIndex: "pollTitle",
      key: "pollTitle",
      width: "300px",
      render: (text, record) => {
        return (
          <span
            className={styles["DateClass"]}
            onClick={
              () => handleClickTitle(record)
              // navigate("/DisKus/polling", { state: { record, isVote: false } })
            }
          >
            {text}
          </span>
        );
      },
    },

    {
      title: t("Status"),
      dataIndex: "Status",
      key: "Status",
      width: "120px",
      filters: [
        {
          text: t("Published"),
          value: "Published", // Use the actual status value
        },
        {
          text: t("UnPublished"),
          value: "UnPublished", // Use the actual status value
        },
        {
          text: t("Expired"),
          value: "Expired", // Use the actual status value
        },
      ],
      defaultFilteredValue: ["Published", "UnPublished", "Expired"], // Use the actual status values here
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      onFilter: (value, record) =>
        record.pollStatus.status.indexOf(value) === 0,
      render: (text, record) => {
        if (record.pollStatus?.pollStatusId === 2) {
          return <span className="text-success">{t("Published")}</span>;
        } else if (record.pollStatus?.pollStatusId === 1) {
          return <span className="text-success">{t("Unpublished")}</span>;
        } else if (record.pollStatus?.pollStatusId === 3) {
          return <span className="text-success">{t("Expired")}</span>;
        }
      },
    },
    {
      title: t("Due-date"),
      dataIndex: "dueDate",
      key: "dueDate",
      width: "90px",
      sorter: (a, b) =>
        new Date(
          a.dueDate.slice(0, 4),
          a.dueDate.slice(4, 6) - 1,
          a.dueDate.slice(6, 8)
        ) -
        new Date(
          b.dueDate.slice(0, 4),
          b.dueDate.slice(4, 6) - 1,
          b.dueDate.slice(6, 8)
        ),
      sortDirections: ["ascend", "descend"],
      render: (text, record) => {
        return _justShowDateformatBilling(text);
      },
    },

    // {
    //   title: t("Poll-type"),
    //   dataIndex: "PollType",
    //   key: "PollType",
    //   width: "90px",
    // },
    {
      title: t("Created-by"),
      dataIndex: "pollCreator",
      key: "pollCreator",
      width: "110px",
      sorter: (a, b) => a.pollCreator.localeCompare(b.pollCreator),
    },
    {
      title: t("Vote"),
      dataIndex: "Vote",
      width: "70px",
      render: (text, record) => {
        if (
          (Number(editorRole.status) === 10 ||
            Number(editorRole.status) === 9) &&
          (editorRole.role === "Organizer" ||
            editorRole.role === "Agenda Contributor" ||
            editorRole?.role === "Participant") &&
          isEditMeeting === true
        ) {
          if (record.pollStatus.pollStatusId === 2) {
            if (record.isVoter) {
              if (record.voteStatus === "Not Voted") {
                return (
                  <Button
                    className={styles["Not_Vote_Button_Polls"]}
                    text={t("Vote")}
                    onClick={() => voteCastModal(record)}
                  />
                );
              } else if (record.voteStatus === "Voted") {
                return <span className={styles["votedBtn"]}>{t("Voted")}</span>;
              }
            } else {
              return "";
            }
          } else if (record.pollStatus.pollStatusId === 1) {
            return "";
          } else if (record.pollStatus.pollStatusId === 3) {
            if (record.isVoter) {
              if (record.wasPollPublished) {
                if (record.voteStatus === "Not Voted") {
                  return (
                    <span className={styles["Not-voted"]}>
                      {t("Not-voted")}
                    </span>
                  );
                } else {
                  return (
                    <span className={styles["votedBtn"]}>{t("Voted")}</span>
                  );
                }
              } else {
                return "";
              }
            } else {
              return "";
            }
          } else {
            return "";
          }
        } else {
          return null;
        }
      },
    },
    {
      dataIndex: "Edit",
      width: "50px",
      render: (text, record) => {
        if (
          Number(editorRole.status) === 10 &&
          (editorRole.role === "Organizer" ||
            editorRole.role === "Agenda Contributor" ||
            editorRole?.role === "Participant") &&
          isEditMeeting === true &&
          Number(editorRole.status) !== 9
        ) {
          return (
            <>
              {Number(record.pollCreatorID) === Number(userID) ? (
                <>
                  <Row>
                    {record.pollStatus.pollStatusId === 3 ? (
                      <>
                        {!record.wasPollPublished ? (
                          <>
                            <Col sm={12} md={5} lg={5}>
                              <Tooltip placement="topRight" title={t("Edit")}>
                                <img
                                  src={EditIcon}
                                  className="cursor-pointer"
                                  width="21.59px"
                                  height="21.59px"
                                  alt=""
                                  draggable="false"
                                  onClick={() => handleEditMeetingPoll(record)}
                                />
                              </Tooltip>
                            </Col>
                            <Col sm={12} md={5} lg={5}></Col>
                          </>
                        ) : (
                          <>
                            <Col sm={12} md={5} lg={5}></Col>
                            <Col sm={12} md={5} lg={5}>
                              <Tooltip placement="topLeft" title={t("Delete")}>
                                <img
                                  src={BinIcon}
                                  alt=""
                                  className="cursor-pointer"
                                  width="21.59px"
                                  height="21.59px"
                                  draggable="false"
                                  onClick={() => handleDeletePoll(record)}
                                />
                              </Tooltip>
                            </Col>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <Col sm={12} md={5} lg={5}>
                          <Tooltip placement="topRight" title={t("Edit")}>
                            <img
                              src={EditIcon}
                              className="cursor-pointer"
                              width="21.59px"
                              height="21.59px"
                              alt=""
                              draggable="false"
                              onClick={() => handleEditMeetingPoll(record)}
                            />
                          </Tooltip>
                        </Col>
                        <Col sm={12} md={5} lg={5}>
                          <Tooltip placement="topLeft" title={t("Delete")}>
                            <img
                              src={BinIcon}
                              alt=""
                              className="cursor-pointer"
                              width="21.59px"
                              height="21.59px"
                              draggable="false"
                              onClick={() => handleDeletePoll(record)}
                            />
                          </Tooltip>
                        </Col>
                      </>
                    )}
                  </Row>
                </>
              ) : null}
            </>
          );
        } else {
        }
      },
    },
  ];

  const handleCreatepolls = () => {
    dispatch(showUnsavedPollsMeeting(false));
    setCreatepoll(true);
  };

  const handleClickPrevPolls = () => {
    setactionsPage(true);
    setPolls(false);
    // if(editorRole.statu)
  };

  const handleNextButtonPolls = () => {
    setPolls(false);
    setAttendance(true);
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
    dispatch(attendanceGlobalFlag(true));
    dispatch(uploadGlobalFlag(false));
  };

  useEffect(() => {
    if (
      NewMeetingreducer.ResponseMessage !== "" &&
      NewMeetingreducer.ResponseMessage !== t("Record-not-found") &&
      NewMeetingreducer.ResponseMessage !== t("Record-found")
    ) {
      setOpen({
        ...open,
        flag: true,
        message: NewMeetingreducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
      }, 3000);
      dispatch(CleareMessegeNewMeeting());
    } else {
      dispatch(CleareMessegeNewMeeting());
    }
  }, [NewMeetingreducer.ResponseMessage]);

  return (
    <>
      {afterViewPolls ? (
        <AfterViewPolls />
      ) : (
        <>
          <section>
            {createpoll ? (
              <Createpolls
                setCreatepoll={setCreatepoll}
                currentMeeting={currentMeeting}
              />
            ) : votePolls ? (
              <CastVotePollsMeeting
                setvotePolls={setvotePolls}
                currentMeeting={currentMeeting}
              />
            ) : editPolls ? (
              <EditPollsMeeting
                setEditPolls={setEditPolls}
                currentMeeting={currentMeeting}
              />
            ) : viewPublishedPoll ? (
              <ViewPollsPublishedScreen
                setViewPublishedPoll={setViewPublishedPoll}
                currentMeeting={currentMeeting}
              />
            ) : unPublished ? (
              <ViewPollsUnPublished
                setUnPublished={setUnPublished}
                currentMeeting={currentMeeting}
              />
            ) : (
              <>
                {Number(editorRole.status) === 10 &&
                (editorRole.role === "Organizer" ||
                  editorRole.role === "Agenda Contributor" ||
                  editorRole?.role === "Participant") &&
                isEditMeeting === true ? (
                  <Row className="mt-4">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-end "
                    >
                      <Button
                        text={t("Create-polls")}
                        icon={<img draggable={false} src={addmore} alt="" />}
                        className={styles["Create_polls_Button"]}
                        onClick={handleCreatepolls}
                      />
                    </Col>
                  </Row>
                ) : null}
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    {pollsRows.length > 0 ? (
                      <>
                        <section className={styles["MaintainingHeight"]}>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <Table
                                column={PollsColoumn}
                                rows={pollsRows}
                                scroll={{ y: "40vh" }}
                                pagination={false}
                                className="Polling_table"
                              />
                            </Col>
                          </Row>
                        </section>
                      </>
                    ) : (
                      <>
                        <Row className="mt-3">
                          <Col
                            lg={12}
                            ms={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <img
                              draggable={false}
                              src={emtystate}
                              height="230px"
                              width="293.93px"
                              alt=""
                            />
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <span className={styles["EmptyState_heading"]}>
                              {t("No-polls")}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <span className={styles["EmptyState_subHeading"]}>
                              {t(
                                "Be-the-first-to-create-a-poll-and-spark-the-conversation"
                              )}
                            </span>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Col>
                </Row>
                {pollsRows.length > 0 && (
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="pagination-groups-table d-flex justify-content-center mt-5"
                    >
                      <CustomPagination
                        pageSizeOptionsValues={["30", "50", "100", "200"]}
                        current={pageNumber}
                        pageSize={pageSize}
                        total={totalRecords}
                        showSizer={totalRecords >= 9 ? true : false}
                        className={styles["PaginationStyle-Resolution"]}
                        onChange={handleChangePagination}
                      />
                    </Col>
                  </Row>
                )}
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end gap-2"
                  >
                    {/* <Button
                      text={t("Clone-meeting")}
                      className={styles["Cancel_Button_Polls_meeting"]}
                      onClick={enableAfterSavedViewPolls}
                    /> */}

                    <Button
                      text={t("Cancel")}
                      className={styles["Cancel_Button_Polls_meeting"]}
                      onClick={handleCacnelbutton}
                    />
                    {/* <Button
                      text={t("Previous")}
                      className={styles["Save_Button_Polls_meeting"]}
                      onClick={handleClickPrevPolls}
                    /> */}
                    {Number(editorRole.status) === 10 &&
                    editorRole.role === "Agenda Contributor" ? null : (
                      <Button
                        text={t("Next")}
                        className={styles["Save_Button_Polls_meeting"]}
                        onClick={handleNextButtonPolls}
                      />
                    )}

                    {Number(editorRole.status) === 11 ||
                    Number(editorRole.status) === 12 ? (
                      <Button
                        text={t("Publish")}
                        className={styles["Save_Button_Polls_meeting"]}
                      />
                    ) : null}

                    {/* <Button
                      text={t("Save-and-publish")}
                      className={styles["Cancel_Button_Polls_meeting"]}
                    />

                    <Button
                      text={t("Save-and-next")}
                      className={styles["Save_Button_Polls_meeting"]}
                      onClick={handleSaveAndnext}
                    /> */}
                  </Col>
                </Row>
              </>
            )}

            {NewMeetingreducer.cancelPolls && (
              <CancelPolls setSceduleMeeting={setSceduleMeeting} />
            )}
            {NewMeetingreducer.editFlowDeletePollsMeeting && (
              <EditDeletePollConfirm
                pollID={pollID}
                currentMeeting={currentMeeting}
              />
            )}
            <Notification
              setOpen={setOpen}
              open={open.flag}
              message={open.message}
            />
          </section>
        </>
      )}
    </>
  );
};

export default Polls;
