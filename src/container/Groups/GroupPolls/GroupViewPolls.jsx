import React, { useEffect, useState } from "react";
import styles from "./GroupViewPolls.module.css";
import { useTranslation } from "react-i18next";
import PollStatusBadge from "../../../components/elements/pollStatus/PollStatusBadge";
import PollActionsCell from "../../Polling/commonPolls/PollActionsCell";
import PollVoteCell from "../../Polling/commonPolls/PollVoteCell";
import usePollStatusFilter from "../../Polling/commonPolls/usePollStatusFilter";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { truncateString } from "../../../commen/functions/regex";
import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import addmore from "../../../assets/images/addmore.png";
import { Col, Row } from "react-bootstrap";
import { Button, Table } from "../../../components/elements";
import emtystate from "../../../assets/images/EmptyStatesMeetingPolls.svg";
import Createpolls from "../GroupPolls/CreatePolls/CreateGrouppolls";
import CastVotePollsMeeting from "./CastVotePollsMeeting/CastVotePollsMeeting";
import { showUnsavedPollsMeeting } from "../../../store/actions/NewMeetingActions";
import EditPollsMeeting from "./EditPollsMeeting/EditPollsMeeting";
import CancelPolls from "./CancelPolls/CancelPolls";
import ViewPollsUnPublished from "./VIewPollsUnPublished/ViewPollsUnPublished";
import ViewPollsPublishedScreen from "./ViewPollsPublishedScreen/ViewPollsPublishedScreen";
import {
  _justShowDateformatBilling,
  resolutionResultTable,
} from "../../../commen/functions/date_formater";
import {
  clearPollsLists,
  createPollGroupsMQTT,
  deleteGroupPollApi,
  deletePollsMQTT,
  getPollByPollIdforGroups,
  getPollsByGroupMainApi,
  viewVotesApi,
} from "../../../store/actions/Polls_actions";
import CustomPagination from "../../../commen/functions/customPagination/Paginations";
import DescendIcon from "../../../assets/images/sortingIcons/SorterIconDescend.png";
import AscendIcon from "../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowDownIcon from "../../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../../assets/images/sortingIcons/Arrow-up.png";
import { usePollsContext } from "../../../context/PollsContext";
import { useMeetingContext } from "../../../context/MeetingContext";
import ViewVotesScreen from "./ViewVotes/ViewVotesScreen";
const GroupViewPolls = ({ groupStatus }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { viewPublishedPoll, setViewPublishedPoll } = useMeetingContext();
  let CurrentLanguage = localStorage.getItem("i18nextLng");
  const { viewVotes, setviewVotes } = usePollsContext();
  const cancelPolls = useSelector(
    (state) => state.NewMeetingreducer.cancelPolls,
  );
  const getPollByGroupID = useSelector(
    (state) => state.PollsReducer.getPollByGroupID,
  );
  const newPollGroups = useSelector(
    (state) => state.PollsReducer.newPollGroups,
  );
  const pollingSocket = useSelector(
    (state) => state.PollsReducer.pollingSocket,
  );
  const newPollDelete = useSelector(
    (state) => state.PollsReducer.newPollDelete,
  );

  const [votePolls, setvotePolls] = useState(false);
  const [createpoll, setCreatepoll] = useState(false);
  const [editPolls, setEditPolls] = useState(false);
  const [pollsRows, setPollsRows] = useState([]);
  const [dublicatedrows, setDublicatedrows] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [viewUnnPublished, setViewUnPublished] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortOrderCreatedBy, setSortOrderCreatedBy] = useState(null);
  const [sortOrderPollingTitle, setSortOrderPollingTitle] = useState(null);

  const [sortOrderDueDate, setSortOrderDueDate] = useState(null);
  let OrganizationID = localStorage.getItem("organizationID");
  let userID = localStorage.getItem("userID");
  let ViewGroupID = localStorage.getItem("ViewGroupID");

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("NotificationClickAddedIntoGroup")) ===
      true
    ) {
      let NotificationClickGroupID = localStorage.getItem(
        "NotifcationClickViewGroupID",
      );
      let Data = {
        GroupID: Number(NotificationClickGroupID),
        OrganizationID: Number(OrganizationID),
        CreatorName: "",
        PollTitle: "",
        PageNumber: 1,
        Length: 50,
      };
      dispatch(getPollsByGroupMainApi(navigate, t, Data));
    } else {
      let Data = {
        GroupID: Number(ViewGroupID),
        OrganizationID: Number(OrganizationID),
        CreatorName: "",
        PollTitle: "",
        PageNumber: 1,
        Length: 50,
      };
      dispatch(getPollsByGroupMainApi(navigate, t, Data));
    }
    return () => {
      dispatch(clearPollsLists());
      dispatch(showUnsavedPollsMeeting(false));
      setvotePolls(false);
      setCreatepoll(false);
      setEditPolls(false);
      setviewVotes(false);
      setViewPublishedPoll(false);
      setViewUnPublished(false);
    };
  }, []);

  useEffect(() => {
    try {
      if (getPollByGroupID !== undefined && getPollByGroupID !== null) {
        setTotalRecords(getPollByGroupID.totalRecords);
        let pollsData = getPollByGroupID.polls;
        let newPollsArray = [];
        pollsData.forEach((data, index) => {
          newPollsArray.push(data);
        });

        setPollsRows(newPollsArray);
        setDublicatedrows(newPollsArray);
      } else {
        setPollsRows([]);
        setDublicatedrows([]);
      }
    } catch (error) {
      console.error("src/container/Groups/GroupPolls/GroupViewPolls.js:", error);
    }
  }, [getPollByGroupID]);

  // MQTT Response of Polls for Groups
  useEffect(() => {
    try {
      if (newPollGroups !== null) {
        let PollData = newPollGroups;
        if (Number(PollData.groupID) === Number(ViewGroupID)) {
          setPollsRows([PollData.polls, ...pollsRows]);
        }
        dispatch(createPollGroupsMQTT(null));
      }
    } catch (error) {
      console.error("src/container/Groups/GroupPolls/GroupViewPolls.js:", error);
    }
  }, [newPollGroups]);

  useEffect(() => {
    try {
      if (pollingSocket && Object.keys(pollingSocket).length > 0) {
        const { polls } = pollingSocket;

        let updatedRows = [...pollsRows];

        const findIndex = updatedRows.findIndex(
          (rowData) => rowData?.pollID === polls?.pollID,
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
      console.error("src/container/Groups/GroupPolls/GroupViewPolls.js:", error);
    }
  }, [pollingSocket]);

  useEffect(() => {
    try {
      if (newPollDelete !== null) {
        const polls = newPollDelete;

        setPollsRows((pollingDataDelete) => {
          return pollingDataDelete.filter(
            (newData2, index) =>
              Number(newData2.pollID) !== Number(polls?.pollID),
          );
        });
        dispatch(deletePollsMQTT(null));
      }
    } catch (error) {
      console.error("src/container/Groups/GroupPolls/GroupViewPolls.js:", error);
    }
  }, [newPollDelete]);

  const handleEditBtn = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    dispatch(
      getPollByPollIdforGroups(
        navigate,
        data,
        1,
        t,
        setEditPolls,
        setvotePolls,
        setViewUnPublished,
        setViewPublishedPoll,
      ),
    );
  };

  const handleDeletePoll = (record) => {
    let data = {
      PollID: record.pollID,
      GroupID: parseInt(ViewGroupID),
    };
    dispatch(deleteGroupPollApi(navigate, t, data));
  };

  const handleClickonTitle = (record) => {
    // // getPollsByGroupMainApi;
    // let data = {
    //   PollID: record.pollID,
    //   UserID: parseInt(userID),
    // };
    // if (record.pollStatus.pollStatusId === 1) {
    //   // UnPublished Poll
    //   dispatch(
    //     getPollByPollIdforGroups(
    //       navigate,
    //       data,
    //       3,
    //       t,
    //       setEditPolls,
    //       setvotePolls,
    //       setViewUnPublished,
    //       setViewPublishedPoll,
    //       setviewVotes
    //     )
    //   );
    // } else if (record.pollStatus.pollStatusId === 2) {
    //   // Poll Published
    //   dispatch(
    //     getPollByPollIdforGroups(
    //       navigate,
    //       data,
    //       4,
    //       t,
    //       setEditPolls,
    //       setvotePolls,
    //       setViewUnPublished,
    //       setViewPublishedPoll,
    //       setviewVotes
    //     )
    //   );
    // } else if (record.pollStatus.pollStatusId === 3) {
    //   // Expired Poll
    //   if (Number(record?.pollCreatorID) === Number(userID)) {
    //     // if User is Poll Creator then poll should modal should open same like published view poll with View Votes Button
    //     dispatch(
    //       getPollByPollIdforGroups(
    //         navigate,
    //         data,
    //         4,
    //         t,
    //         setEditPolls,
    //         setvotePolls,
    //         setViewUnPublished,
    //         setViewPublishedPoll,
    //         setviewVotes
    //       )
    //     );
    //   } else {
    //     // If User is just a Participant then modal should open like Unpublished Poll
    //     dispatch(
    //       getPollByPollIdforGroups(
    //         navigate,
    //         data,
    //         3,
    //         t,
    //         setEditPolls,
    //         setvotePolls,
    //         setViewUnPublished,
    //         setViewPublishedPoll
    //       )
    //     );
    //   }
    // }
    let data = {
      PollID: record.pollID,
    };
    dispatch(
      viewVotesApi(navigate, data, t, 1, setviewVotes, setViewPublishedPoll),
    );
  };

  const handleClickonTitleBeforeDueDate = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    dispatch(
      getPollByPollIdforGroups(
        navigate,
        data,
        2,
        t,
        setEditPolls,
        setvotePolls,
        setViewUnPublished,
        setViewPublishedPoll,
      ),
    );
  };

  const handleClickVoteCast = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    dispatch(
      getPollByPollIdforGroups(
        navigate,
        data,
        2,
        t,
        setEditPolls,
        setvotePolls,
        setViewUnPublished,
        setViewPublishedPoll,
      ),
    );
  };

  const handleViewVotes = (record) => {
    let data = {
      PollID: record.pollID,
    };
    dispatch(
      viewVotesApi(navigate, data, t, 1, setviewVotes, setViewPublishedPoll),
    );
  };

  //Status filter of the table (shared with the other polls tables)
  const statusFilterProps = usePollStatusFilter({
    allRows: dublicatedrows,
    setRows: setPollsRows,
    resetClassName: styles["FilterResetBtn"],
    okClassName: styles["ResetOkBtn"],
  });

  //Scroll for Polls table

  const PollsColoumn = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className='d-flex gap-2'>
                {t("Poll-title")}{" "}
                {sortOrderPollingTitle === "descend" ? (
                  <img src={DescendIcon} alt='' />
                ) : (
                  <img src={AscendIcon} alt='' />
                )}
              </span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "pollTitle",
      key: "pollTitle",
      width: 300,
      align: "start",
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrderPollingTitle((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => {
        const currentDate = new Date();
        const convertIntoGmt = resolutionResultTable(record.dueDate);

        if (
          currentDate < convertIntoGmt &&
          record.isVoter &&
          groupStatus === 3 &&
          record.pollStatus.status === "Published"
        ) {
          return (
            <span
              className={styles["DateClass"]}
              onClick={() => handleClickonTitleBeforeDueDate(record)}>
              {truncateString(text, 50)}
            </span>
          );
        } else {
          return (
            <span
              className={styles["DateClass"]}
              onClick={() => handleClickonTitle(record)}>
              {truncateString(text, 50)}
            </span>
          );
        }
      },
    },

    {
      title: t("Status"),
      dataIndex: "Status",
      key: "Status",
      width: 100,
      align: "center",
      ...statusFilterProps,
      render: (text, record) => (
        <PollStatusBadge
          pollStatusId={record.pollStatus?.pollStatusId}
          center
        />
      ),
    },
    {
      title: (
        <>
          <span className='d-flex gap-2 justify-content-center align-items-center'>
            {t("Due-date")}
            {sortOrderDueDate === "descend" ? (
              <img src={ArrowDownIcon} alt='' />
            ) : (
              <img src={ArrowUpIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "dueDate",
      key: "dueDate",
      width: 100,
      align: "center",
      sorter: (a, b) =>
        new Date(
          a.dueDate.slice(0, 4),
          a.dueDate.slice(4, 6) - 1,
          a.dueDate.slice(6, 8),
        ) -
        new Date(
          b.dueDate.slice(0, 4),
          b.dueDate.slice(4, 6) - 1,
          b.dueDate.slice(6, 8),
        ),
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrderDueDate((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => {
        return (
          <span className={styles["poll_status"]}>
            {_justShowDateformatBilling(text, CurrentLanguage)}
          </span>
        );
      },
    },

    {
      title: (
        <>
          <span className='d-flex gap-2 justify-content-center align-items-center'>
            {" "}
            {t("Created-by")}
            {sortOrderCreatedBy === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "pollCreator",
      key: "pollCreator",
      width: 100,
      align: "center",
      sorter: (a, b) => a.pollCreator.localeCompare(b.pollCreator),
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrderCreatedBy((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => {
        return <span className={styles["poll_status"]}>{text}</span>;
      },
    },
    {
      title: t("Vote"),
      dataIndex: "Vote",
      width: 100,
      align: "center",
      render: (text, record) => (
        <PollVoteCell
          record={record}
          canVote={groupStatus === 3}
          voteClassName={styles["Not_Vote_Button_Polls"]}
          viewVotesClassName={styles["ViewVotesButtonStyles"]}
          onVote={handleClickVoteCast}
          onViewVotes={handleViewVotes}
        />
      ),
    },
    {
      dataIndex: "Edit",
      width: 100,
      render: (text, record) => (
        <PollActionsCell
          record={record}
          userID={userID}
          enabled={groupStatus === 3}
          onEdit={handleEditBtn}
          onDelete={handleDeletePoll}
        />
      ),
    },
  ];

  const handleCreatepolls = () => {
    dispatch(showUnsavedPollsMeeting(false));
    setCreatepoll(true);
  };
  const handleChangePagination = (current, pageSize) => {
    setPageNumber(current);
    setPageSize(pageSize);
    let Data = {
      GroupID: Number(ViewGroupID),
      OrganizationID: Number(OrganizationID),
      CreatorName: "",
      PollTitle: "",
      PageNumber: 1,
      Length: 50,
    };
    dispatch(getPollsByGroupMainApi(navigate, t, Data));
  };

  return (
    <>
      <section>
        {createpoll ? (
          <Createpolls setCreatepoll={setCreatepoll} />
        ) : votePolls ? (
          <CastVotePollsMeeting setvotePolls={setvotePolls} />
        ) : editPolls ? (
          <EditPollsMeeting setEditPolls={setEditPolls} />
        ) : viewUnnPublished ? (
          <ViewPollsUnPublished setViewUnPublished={setViewUnPublished} />
        ) : viewPublishedPoll ? (
          <ViewPollsPublishedScreen
            setViewPublishedPoll={setViewPublishedPoll}
          />
        ) : viewVotes ? (
          <ViewVotesScreen />
        ) : viewVotes ? (
          <ViewVotesScreen setviewVotes={setviewVotes} />
        ) : (
          <>
            <Row className='mt-4'>
              <Col
                lg={12}
                md={12}
                sm={12}
                className='d-flex justify-content-end '>
                {groupStatus === 3 && (
                  <Button
                    text={t("Create-polls")}
                    icon={<img draggable={false} src={addmore} alt='' />}
                    className={styles["Create_polls_Button"]}
                    onClick={handleCreatepolls}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <section className={styles["MaintainingHeight"]}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <Table
                        column={PollsColoumn}
                        rows={pollsRows}
                        scroll={{ y: "45vh", x: "800px" }}
                        pagination={false}
                        className='newMeetingTable'
                        locale={{
                          emptyText: (
                            <>
                              <Row className='mt-3'>
                                <Col
                                  lg={12}
                                  ms={12}
                                  sm={12}
                                  className='d-flex justify-content-center'>
                                  <img
                                    draggable={false}
                                    src={emtystate}
                                    height='230px'
                                    width='293.93px'
                                    alt=''
                                  />
                                </Col>
                              </Row>
                              <Row className='mt-2'>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className='d-flex justify-content-center'>
                                  <span
                                    className={styles["EmptyState_heading"]}>
                                    {t("No-polls")}
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className='d-flex justify-content-center'>
                                  <span
                                    className={styles["EmptyState_subHeading"]}>
                                    {t(
                                      "Be-the-first-to-create-a-poll-and-spark-the-conversation",
                                    )}
                                  </span>
                                </Col>
                              </Row>
                            </>
                          ),
                        }}
                      />
                    </Col>
                  </Row>
                </section>
              </Col>
            </Row>
            {pollsRows.length > 0 && (
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className='pagination-groups-table d-flex justify-content-center my-3'>
                  <CustomPagination
                    pageSizeOptionsValues={["30", "50", "100", "200"]}
                    current={pageNumber}
                    pageSize={pageSize}
                    total={totalRecords}
                    showSizer={totalRecords >= 9 ? true : false}
                    onChange={handleChangePagination}
                  />
                </Col>
              </Row>
            )}
          </>
        )}
        {cancelPolls && <CancelPolls />}
      </section>
    </>
  );
};

export default GroupViewPolls;
