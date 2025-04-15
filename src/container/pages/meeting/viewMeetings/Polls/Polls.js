import React, { useContext, useEffect, useState } from "react";
import styles from "./Polls.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BinIcon from "../../../../../assets/images/bin.svg";
import { Tooltip } from "antd";
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
  GetAllPollsByMeetingIdApiFunc,
  clearResponseNewMeetingReducerMessage,
  cleareAllState,
  deleteSavedPollsMeeting,
  searchNewUserMeeting,
  showUnsavedPollsMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../../store/actions/NewMeetingActions";
import EditPollsMeeting from "./EditPollsMeeting/EditPollsMeeting";
import CancelPolls from "./CancelPolls/CancelPolls";
import {
  _justShowDateformatBilling,
  resolutionResultTable,
} from "../../../../../commen/functions/date_formater";
import {
  castYourVotePollModal,
  clearPollsMesseges,
  createPollMeetingMQTT,
  deletePollsMQTT,
  getPollByPollIdforMeeting,
  getPollsByPollIdApi,
  setCastVoteID,
  viewVotesApi,
} from "../../../../../store/actions/Polls_actions";
import CustomPagination from "../../../../../commen/functions/customPagination/Paginations";
import ViewPollsPublishedScreen from "./ViewPollsPublishedScreen/ViewPollsPublishedScreen";
import ViewPollsUnPublished from "./VIewPollsUnPublished/ViewPollsUnPublished";
import DeletePollConfirmModal from "./DeletePollsConfirmationModal/DeletePollConfirmModal";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import {
  MeetingContext,
  useMeetingContext,
} from "../../../../../context/MeetingContext";
import { usePollsContext } from "../../../../../context/PollsContext";
import ViewVotesScreen from "./ViewVotes/ViewVotesScreen";
import AccessDeniedModal from "../../../../../components/layout/WebNotfication/AccessDeniedModal/AccessDeniedModal";

const Polls = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    editorRole,
    editPolls,
    setEditPolls,
    votePolls,
    setvotePolls,
    unPublished,
    setUnPublished,
    viewPublishedPoll,
    setViewPublishedPoll,
    advanceMeetingModalID,
    setViewAdvanceMeetingModal,
    setPolls,
    setAttendance,
    currentMeeting,
    setAdvanceMeetingModalID,
    setactionsPage,
  } = useMeetingContext();

  const { viewVotes, setviewVotes } = usePollsContext();

  const getPollsMeetingID = useSelector(
    (state) => state.NewMeetingreducer.getPollsMeetingID
  );
  const setPollIdForCastVote = useSelector(
    (state) => state.PollsReducer.setPollIdForCastVote
  );

  console.log(setPollIdForCastVote, "setPollIdForCastVotesetPollIdForCastVote");
  const ResponseMessageMeeting = useSelector(
    (state) => state.NewMeetingreducer.ResponseMessage
  );
  const cancelPolls = useSelector(
    (state) => state.NewMeetingreducer.cancelPolls
  );
  const deletPollsMeeting = useSelector(
    (state) => state.NewMeetingreducer.deletPollsMeeting
  );
  const newPollMeeting = useSelector(
    (state) => state.PollsReducer.newPollMeeting
  );
  const pollingSocket = useSelector(
    (state) => state.PollsReducer.pollingSocket
  );
  const newPollDelete = useSelector(
    (state) => state.PollsReducer.newPollDelete
  );
  const ResponseMessagePoll = useSelector(
    (state) => state.PollsReducer.ResponseMessage
  );

  const AccessDeniedGlobalState = useSelector(
    (state) => state.PollsReducer.AccessDeniedPolls
  );
  console.log(AccessDeniedGlobalState, "AccessDeniedGlobalState");
  const { setEditorRole } = useContext(MeetingContext);

  const [createpoll, setCreatepoll] = useState(false);

  const [pollsRows, setPollsRows] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [totalRecords, setTotalRecords] = useState(0);
  let OrganizationID = localStorage.getItem("organizationID");
  let currentLanguage = localStorage.getItem("i18nextLng");
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");
  const [pollID, setPollID] = useState(0);

  // Unpublished Poll

  const handleEditMeetingPoll = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    dispatch(getPollsByPollIdApi(navigate, data, 0, t, setEditPolls));
  };

  const handleDeletePoll = (record) => {
    console.log(record, "handleDeletePoll");
    dispatch(deleteSavedPollsMeeting(true));
    setPollID(record.pollID);
  };

  //Notification Click on View Polls in Advance meeting
  // useEffect(() => {
  //   if (JSON.parse(localStorage.getItem("viewadvanceMeetingPolls")) === true) {
  //     // let data = {
  //     //   PollID: record.pollID,
  //     //   UserID: parseInt(userID),
  //     // };
  //     // if (Number(record.pollStatus.pollStatusId) === 1) {
  //     //   // UnPublished Poll
  //     //   dispatch(
  //     //     getPollByPollIdforMeeting(
  //     //       navigate,
  //     //       data,
  //     //       3,
  //     //       t,
  //     //       setEditPolls,
  //     //       setvotePolls,
  //     //       setUnPublished,
  //     //       setViewPublishedPoll
  //     //     )
  //     //   );
  //     // } else if (record.pollStatus.pollStatusId === 2) {
  //     //   // Poll Published
  //     //   dispatch(
  //     //     getPollByPollIdforMeeting(
  //     //       navigate,
  //     //       data,
  //     //       4,
  //     //       t,
  //     //       setEditPolls,
  //     //       setvotePolls,
  //     //       setUnPublished,
  //     //       setViewPublishedPoll
  //     //     )
  //     //   );
  //     // } else if (record.pollStatus.pollStatusId === 3) {
  //     //   // Expired Poll
  //     //   if (Number(record.pollCreatorID) === Number(userID)) {
  //     //     // if User is Poll Creator then poll should modal should open same like published view poll with View Votes Button
  //     //     dispatch(
  //     //       getPollByPollIdforMeeting(
  //     //         navigate,
  //     //         data,
  //     //         4,
  //     //         t,
  //     //         setEditPolls,
  //     //         setvotePolls,
  //     //         setUnPublished,
  //     //         setViewPublishedPoll
  //     //       )
  //     //     );
  //     //   } else {
  //     //     // If User is just a Participant then modal should open like Unpublished Poll
  //     //     dispatch(
  //     //       getPollByPollIdforMeeting(
  //     //         navigate,
  //     //         data,
  //     //         3,
  //     //         t,
  //     //         setEditPolls,
  //     //         setvotePolls,
  //     //         setUnPublished,
  //     //         setViewPublishedPoll
  //     //       )
  //     //     );
  //     //   }
  //     // }
  //   }
  // }, []);

  const handleClickTitle = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    if (Number(record.pollStatus.pollStatusId) === 1) {
      // UnPublished Poll
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
      // Poll Published
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
    } else if (record.pollStatus.pollStatusId === 3) {
      // Expired Poll
      if (Number(record.pollCreatorID) === Number(userID)) {
        // if User is Poll Creator then poll should modal should open same like published view poll with View Votes Button
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
      } else {
        // If User is just a Participant then modal should open like Unpublished Poll
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
      }
    }
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("AdvanceMeetingOperations")) === true) {
      //For Polls Notification Click Handling
      if (
        JSON.parse(localStorage.getItem("viewadvanceMeetingPolls")) === true
      ) {
        let data = {
          PollID: Number(localStorage.getItem("NotificationClickPollID")),
          UserID: parseInt(userID),
        };

        console.log(data, "datagetPollByPollIdforMeetingdatadata");
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
      }
      let NotificationClickMeetingID = localStorage.getItem(
        "NotificationAdvanceMeetingID"
      );
      console.log("Coming here");
      let Data = {
        MeetingID: Number(NotificationClickMeetingID),
        OrganizationID: Number(OrganizationID),
        CreatorName: "",
        PollTitle: "",
        PageNumber: 1,
        Length: 50,
      };
      dispatch(GetAllPollsByMeetingIdApiFunc(Data, navigate, t));
    } else {
      console.log("Coming here");
      // After Consulting mamdani getting the current meet ID from LocalStorage
      let Data = {
        MeetingID: Number(advanceMeetingModalID),
        OrganizationID: Number(OrganizationID),
        CreatorName: "",
        PollTitle: "",
        PageNumber: 1,
        Length: 50,
      };
      dispatch(GetAllPollsByMeetingIdApiFunc(Data, navigate, t));
    }

    return () => {
      dispatch(cleareAllState());
      setPollsRows([]);
      setvotePolls(false);
    };
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
      if (getPollsMeetingID !== undefined && getPollsMeetingID !== null) {
        if (getPollsMeetingID.polls.length > 0) {
          let pollsData = getPollsMeetingID.polls;
          setTotalRecords(getPollsMeetingID.totalRecords);
          let newPollsArray = [];
          pollsData.forEach((data, index) => {
            console.log(data, "datadatadatadata");
            newPollsArray.push(data);
          });
          setPollsRows(newPollsArray);
        } else {
          setPollsRows([]);
        }
      } else {
        setPollsRows([]);
      }
    } catch {}
  }, [getPollsMeetingID]);

  // MQTT Response of Polls for Meeting
  useEffect(() => {
    try {
      if (newPollMeeting !== null) {
        let PollData = newPollMeeting;
        if (Number(PollData.meetingID) === Number(currentMeeting)) {
          setPollsRows([PollData.polls, ...pollsRows]);
        }
        dispatch(createPollMeetingMQTT(null));
      }
    } catch (error) {
      console.log(error);
    }
  }, [newPollMeeting]);

  useEffect(() => {
    try {
      if (pollingSocket && Object.keys(pollingSocket).length > 0) {
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
          } else if (Number(polls.pollStatus.pollStatusId) === 2) {
            updatedRows[findIndex] = polls; // Update the existing poll
          }
        }

        setPollsRows(updatedRows);
      }
    } catch (error) {
      console.log(error, "errorerror");
    }
  }, [pollingSocket]);

  useEffect(() => {
    try {
      if (newPollDelete !== null) {
        const polls = newPollDelete;

        setPollsRows((pollingDataDelete) => {
          return pollingDataDelete.filter(
            (newData2) => Number(newData2.pollID) !== Number(polls?.pollID)
          );
        });
        dispatch(deletePollsMQTT(null));
      }
    } catch (error) {
      console.log(error);
    }
  }, [newPollDelete]);

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

  const voteCastModalBeforeDueDateOnTitle = (record) => {
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

  const ViewVoteButtonOnClick = (record) => {
    console.log(record, "ViewVoteButtonOnClick");
    let data = {
      PollID: record.pollID,
    };
    dispatch(
      viewVotesApi(navigate, data, t, 1, setviewVotes, setViewPublishedPoll)
    );
  };

  useEffect(() => {
    try {
      if (setPollIdForCastVote !== null) {
        dispatch(castYourVotePollModal(false));
        let data = {
          PollID: setPollIdForCastVote.pollId,
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
      }
    } catch (error) {
      console.log(error);
    }
    return () => {
      dispatch(setCastVoteID(null));
    };
  }, [setPollIdForCastVote]);
  const PollsColoumn = [
    {
      title: t("Poll-title"),
      dataIndex: "pollTitle",
      key: "pollTitle",
      width: "25%",
      align: currentLanguage === "en" ? "left" : "right",
      render: (text, record) => {
        const currentDate = new Date();
        const convertIntoGmt = resolutionResultTable(record.dueDate);
        if (
          currentDate < convertIntoGmt &&
          record.isVoter &&
          record.pollStatus.status === "Published"
        ) {
          return (
            <span
              className={styles["DateClass"]}
              onClick={() => voteCastModalBeforeDueDateOnTitle(record)}
            >
              {text}
            </span>
          );
        } else {
          return (
            <span
              className={styles["DateClass"]}
              onClick={() => handleClickTitle(record)}
            >
              {text}
            </span>
          );
        }
      },
    },

    {
      title: t("Status"),
      dataIndex: "Status",
      key: "Status",
      width: "15%",
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
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      onFilter: (value, record) =>
        record.pollStatus.status.indexOf(value) === 0,
      render: (text, record) => {
        console.log(record, "recordrecord");
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
      width: "20%",
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

    {
      title: t("Created-by"),
      dataIndex: "pollCreator",
      key: "pollCreator",
      width: "15%",
      sorter: (a, b) => a.pollCreator.localeCompare(b.pollCreator),
      render: (text, record) => (
        <span className="text-truncate d-block">{text}</span>
      ),
    },
    {
      title: t("Vote"),
      dataIndex: "Vote",
      align: "center",
      width: "15%",
      render: (text, record) => {
        console.log("votevotevotevote", record);
        console.log("votevotevotevote", record.isVoter);
        console.log(record.dueDate, "recordrecordrecord");

        const currentDate = new Date();
        const convertIntoGmt = resolutionResultTable(record.dueDate);
        console.log(
          currentDate,
          convertIntoGmt,
          "convertIntoGmtconvertIntoGmtconvertIntoGmt"
        );
        if (record.pollStatus.pollStatusId === 2) {
          if (record.isVoter) {
            if (currentDate < convertIntoGmt) {
              return (
                <Button
                  className={styles["Not_Vote_Button_Polls"]}
                  text={
                    record.voteStatus === "Not Voted" ? t("Vote") : t("Voted")
                  }
                  onClick={() => voteCastModal(record)}
                />
              );
            } else if (record.voteStatus === "Voted") {
              return (
                // <span className={styles["votedBtn"]}></span>
                <Button
                  className={styles["ViewVotesButtonStyles"]}
                  text={t("View-votes")}
                  onClick={() => ViewVoteButtonOnClick(record)}
                />
              );
            }
          } else {
            return "";
          }
        } else if (record.pollStatus.pollStatusId === 3) {
          if (record.isVoter) {
            if (record.wasPollPublished) {
              if (record.voteStatus === "Not Voted") {
                return (
                  <span className={styles["Not-voted"]}>{t("Not-voted")}</span>
                );
              } else {
                <Button
                  className={styles["ViewVotesButtonStyles"]}
                  text={t("View-votes")}
                  onClick={() => ViewVoteButtonOnClick(record)}
                />;
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
      },
    },
    {
      dataIndex: "Edit",
      width: "10%",
      render: (text, record) => {
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
      },
    },
  ];

  const handleCreatepolls = () => {
    dispatch(showUnsavedPollsMeeting(false));
    setCreatepoll(true);
  };

  const handleCancelPolls = () => {
    setViewAdvanceMeetingModal(false);
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    console.log("chek search meeting");
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.removeItem("folderDataRoomMeeting");
    setEditorRole({ status: null, role: null });
    setAdvanceMeetingModalID(null);
    localStorage.removeItem("AdvanceMeetingOperations");
    localStorage.removeItem("NotificationAdvanceMeetingID");
    localStorage.removeItem("viewadvanceMeetingPolls");
    localStorage.removeItem("NotificationClickPollID");
  };

  const navigatetoAttendance = () => {
    setAttendance(true);
    setPolls(false);
  };

  useEffect(() => {
    if (
      ResponseMessagePoll !== "" &&
      ResponseMessagePoll !== t("No-data-available") &&
      ResponseMessagePoll !== "" &&
      ResponseMessagePoll !== t("No-records-found") &&
      ResponseMessagePoll !== t("No-record-found")
    ) {
      showMessage(ResponseMessagePoll, "success", setOpen);
      dispatch(clearPollsMesseges());
    } else {
      dispatch(clearPollsMesseges());
    }
  }, [ResponseMessagePoll]);

  useEffect(() => {
    if (
      ResponseMessageMeeting !== "" &&
      ResponseMessageMeeting !== t("No-data-available") &&
      ResponseMessageMeeting !== "" &&
      ResponseMessageMeeting !== t("No-records-found") &&
      ResponseMessageMeeting !== t("No-record-found")
    ) {
      showMessage(ResponseMessageMeeting, "success", setOpen);
      dispatch(clearResponseNewMeetingReducerMessage());
    } else {
      dispatch(clearResponseNewMeetingReducerMessage());
    }
  }, [ResponseMessageMeeting]);

  return (
    <>
      <section>
        {createpoll ? (
          <Createpolls setCreatepoll={setCreatepoll} />
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
        ) : viewVotes ? (
          <ViewVotesScreen />
        ) : (
          <>
            {Number(editorRole.status) === 10 &&
            (editorRole.role === "Organizer" ||
              editorRole.role === "Agenda Contributor" ||
              editorRole?.role === "Participant") ? (
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
                  className="pagination-groups-table d-flex justify-content-center my-3"
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
            {/* <Row className='mt-5'>
              <Col
                lg={12}
                md={12}
                sm={12}
                className='d-flex justify-content-end gap-2'>
                <Button
                  text={t("Cancel")}
                  className={styles["Cancel_Button_Polls_meeting"]}
                  onClick={handleCancelPolls}
                />

                {Number(editorRole.status) === 10 &&
                editorRole.role === "Organizer" ? (
                  <Button
                    text={t("Next")}
                    className={styles["Save_Button_Polls_meeting"]}
                    onClick={navigatetoAttendance}
                  />
                ) : null}
              </Col>
            </Row> */}
          </>
        )}

        {cancelPolls && (
          <CancelPolls
            setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          />
        )}
        {deletPollsMeeting && <DeletePollConfirmModal pollID={pollID} />}

        <Notification open={open} setOpen={setOpen} />
        {AccessDeniedGlobalState && <AccessDeniedModal />}
      </section>
    </>
  );
};

export default Polls;
