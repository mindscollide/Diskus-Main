import React, { useEffect, useState } from "react";
import styles from "./Polls.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BinIcon from "../../../../assets/images/bin.svg";
import { Dropdown, Menu, Tooltip } from "antd";
import { useSelector } from "react-redux";
import Tick from "../../../../assets/images/Tick-Icon.png";
import addmore from "../../../../assets/images/addmore.png";
import { Col, Row } from "react-bootstrap";
import { Button, Table } from "../../../../components/elements";
import EditIcon from "../../../../assets/images/Edit-Icon.png";
import { ChevronDown } from "react-bootstrap-icons";
import emtystate from "../../../../assets/images/EmptyStatesMeetingPolls.svg";
import Createpolls from "./CreatePolls/Createpolls";
import CastVotePollsMeeting from "./CastVotePollsMeeting/CastVotePollsMeeting";
import {
  showUnsavedPollsMeeting,
  showunsavedEditPollsMeetings,
} from "../../../../store/actions/NewMeetingActions";
import EditPollsMeeting from "./EditPollsMeeting/EditPollsMeeting";
import CancelPolls from "./CancelPolls/CancelPolls";
import {
  _justShowDateformatBilling,
  resolutionResultTable,
} from "../../../../commen/functions/date_formater";
import {
  GetPollsByCommitteeIDapi,
  createPollCommitteesMQTT,
  deleteCommitteePollApi,
  deletePollsMQTT,
  getPollsByPollIdforCommitteeApi,
  viewVotesApi,
} from "../../../../store/actions/Polls_actions";
import ViewPollsPublishedScreen from "./ViewPollsPublishedScreen/ViewPollsPublishedScreen";
import CustomPagination from "../../../../commen/functions/customPagination/Paginations";
import ViewPollsUnPublished from "./VIewPollsUnPublished/ViewPollsUnPublished";
import { truncateString } from "../../../../commen/functions/regex";
import { usePollsContext } from "../../../../context/PollsContext";
import { useMeetingContext } from "../../../../context/MeetingContext";
import ViewVotesScreen from "./ViewVotes/ViewVotesScreen";
const Polls = ({ committeeStatus }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { viewVotes, setviewVotes } = usePollsContext();
  const { viewPublishedPoll, setViewPublishedPoll } = useMeetingContext();
  let CurrentLanguage = localStorage.getItem("i18nextLng");
  const cancelPolls = useSelector(
    (state) => state.NewMeetingreducer.cancelPolls
  );
  const getPollByCommitteeID = useSelector(
    (state) => state.PollsReducer.getPollByCommitteeID
  );
  const newPollCommittees = useSelector(
    (state) => state.PollsReducer.newPollCommittees
  );
  const pollingSocket = useSelector(
    (state) => state.PollsReducer.pollingSocket
  );
  const newPollDelete = useSelector(
    (state) => state.PollsReducer.newPollDelete
  );
  // Vote Cast Polls
  const [votePolls, setvotePolls] = useState(false);
  // Create Poll
  const [createpoll, setCreatepoll] = useState(false);
  // Edit Polls
  const [editPolls, setEditPolls] = useState(false);
  const [pollsRows, setPollsRows] = useState([]);
  const [dublicatedrows, setDublicatedrows] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);
  // Unpublished Poll
  const [unPublished, setUnPublished] = useState(false);
  let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
  let OrganizationID = localStorage.getItem("organizationID");
  let userID = localStorage.getItem("userID");

  const handleCastVotePollMeeting = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    dispatch(
      getPollsByPollIdforCommitteeApi(
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
    let data = {
      PollID: record.pollID,
    };
    dispatch(
      viewVotesApi(navigate, data, t, 1, setviewVotes, setViewPublishedPoll)
    );
  };

  const handleEditPollsMeeting = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    dispatch(
      getPollsByPollIdforCommitteeApi(
        navigate,
        data,
        1,
        t,
        setEditPolls,
        setvotePolls,
        setUnPublished
      )
    );
    dispatch(showunsavedEditPollsMeetings(false));
    setCreatepoll(false);
  };

  const handleDeletePoll = (record) => {
    let data = {
      PollID: record.pollID,
      CommitteeID: parseInt(ViewCommitteeID),
    };
    dispatch(deleteCommitteePollApi(navigate, t, data));
  };

  const handleClickonTitle = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    if (record.pollStatus.pollStatusId === 1) {
      // UnPublished Poll
      dispatch(
        getPollsByPollIdforCommitteeApi(
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
        getPollsByPollIdforCommitteeApi(
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
      if (Number(record?.pollCreatorID) === Number(userID)) {
        // if User is Poll Creator then poll should modal should open same like published view poll with View Votes Button
        dispatch(
          getPollsByPollIdforCommitteeApi(
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
          getPollsByPollIdforCommitteeApi(
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

  const handleClickonTitleForVotingScreenBeforeDueDate = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    dispatch(
      getPollsByPollIdforCommitteeApi(
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

  useEffect(() => {
    let Data = {
      CommitteeID: Number(ViewCommitteeID),
      OrganizationID: Number(OrganizationID),
      CreatorName: "",
      PollTitle: "",
      PageNumber: 1,
      Length: 50,
    };
    dispatch(GetPollsByCommitteeIDapi(navigate, t, Data));
    return () => {
      setEditPolls(false);
      setvotePolls(false);
      setUnPublished(false);
      setViewPublishedPoll(false);
      setCreatepoll(false);
    };
  }, []);

  useEffect(() => {
    try {
      if (getPollByCommitteeID !== undefined && getPollByCommitteeID !== null) {
        setTotalRecords(getPollByCommitteeID.totalRecords);
        let pollsData = getPollByCommitteeID.polls;
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
    } catch {}
  }, [getPollByCommitteeID]);

  // MQTT Response of Polls for Committees
  useEffect(() => {
    try {
      if (newPollCommittees !== null) {
        let PollData = newPollCommittees;
        console.log("New Poll Added", PollData);
        if (Number(PollData.committeeID) === Number(ViewCommitteeID)) {
          setPollsRows([PollData.polls, ...pollsRows]);
        }
        dispatch(createPollCommitteesMQTT(null));
      }
    } catch (error) {
      console.log(error);
    }
  }, [newPollCommittees]);

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
            (newData2, index) =>
              Number(newData2.pollID) !== Number(polls?.pollID)
          );
        });
        dispatch(deletePollsMQTT(null));
      }
    } catch (error) {
      console.log(error);
    }
  }, [newPollDelete]);

  //Filteration Work polls
  const [visible, setVisible] = useState(false);
  const [selectedValues, setSelectedValues] = useState([
    "Published",
    "UnPublished",
    "Expired",
  ]);

  const filters = [
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
      selectedValues.includes(item.pollStatus.status.toString())
    );
    setPollsRows(filteredData);
    setVisible(false);
  };

  const resetFilter = () => {
    setSelectedValues(["Published", "UnPublished", "Expired"]);
    setPollsRows(dublicatedrows);
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
          onClick={() => {
            console.log(filter, "filterfilterfilter");
            handleMenuClick(filter.value);
          }}
          className="d-flex align-items-center justify-content-between"
        >
          <div className="Polls_Menu_items">
            <span
              className={
                filter.value === "Published"
                  ? "userstatus-signal-PublishedPolls_Menu"
                  : filter.value === "UnPublished"
                  ? "userstatus-signal-Unpublished_Menu"
                  : "userstatus-signal-disabled_Menu"
              }
            ></span>
            <span className="menu-text">{filter.text}</span>
            {selectedValues.includes(filter.value) && (
              <span className="checkmark">
                <img src={Tick} alt="" />
              </span>
            )}
          </div>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className="d-flex align-items-center justify-content-between p-2">
        <Button
          text={"Reset"}
          className={styles["FilterResetBtn"]}
          onClick={resetFilter}
        />
        <Button
          text="Ok"
          disableBtn={selectedValues.length === 0}
          className={styles["ResetOkBtn"]}
          onClick={handleApplyFilter}
        />
      </div>
    </Menu>
  );

  const PollsColoumn = [
    {
      title: t("Poll-title"),
      dataIndex: "pollTitle",
      key: "pollTitle",
      width: "300px",
      render: (text, record) => {
        const currentDate = new Date();
        const convertIntoGmt = resolutionResultTable(record.dueDate);
        if (
          currentDate < convertIntoGmt &&
          record.isVoter &&
          committeeStatus === 3 &&
          record.pollStatus.status === "Published"
        ) {
          return (
            <span
              className={styles["DateClass"]}
              onClick={() =>
                handleClickonTitleForVotingScreenBeforeDueDate(record)
              }
            >
              {truncateString(text, 55)}
            </span>
          );
        } else {
          return (
            <span
              className={styles["DateClass"]}
              onClick={() => ViewVoteButtonOnClick(record)}
            >
              {truncateString(text, 55)}
            </span>
          );
        }
      },
    },

    {
      title: t("Status"),
      dataIndex: "Status",
      key: "Status",
      align: "center",
      width: "120px",
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <ChevronDown className="ChevronPolls" onClick={handleClickChevron} />
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
        if (record.pollStatus?.pollStatusId === 2) {
          return (
            <div className="d-flex justify-content-center">
              <span className="userstatus-signal-PublishedPolls"></span>
              <p className="m-0 userName FontArabicRegular">{t("Published")}</p>
            </div>
          );
        } else if (record.pollStatus?.pollStatusId === 1) {
          return (
            <div className="d-flex justify-content-center">
              <span className="userstatus-signal-Unpublished"></span>
              <p className="m-0 userName FontArabicRegular">
                {t("Unpublished")}
              </p>
            </div>
          );
        } else if (record.pollStatus?.pollStatusId === 3) {
          return (
            <div className="d-flex justify-content-center">
              <span className="userstatus-signal-disabled"></span>
              <p className="m-0 userName FontArabicRegular">{t("Expired")}</p>
            </div>
          );
        }
      },
    },
    {
      title: t("Due-date"),
      dataIndex: "dueDate",
      key: "dueDate",
      align: "center",

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
        return (
          <span className={styles["text-success"]}>
            {_justShowDateformatBilling(text, CurrentLanguage)}
          </span>
        );
      },
    },

    {
      title: t("Created-by"),
      dataIndex: "pollCreator",
      key: "pollCreator",
      align: "center",
      width: "110px",
      sorter: (a, b) => a.pollCreator.localeCompare(b.pollCreator),
      render: (text, record) => {
        return <span className={styles["text-success"]}>{text}</span>;
      },
    },
    {
      title: t("Vote"),
      dataIndex: "Vote",
      align: "center",
      width: "70px",
      render: (text, record) => {
        const currentDate = new Date();
        const convertIntoGmt = resolutionResultTable(record.dueDate);

        if (record.pollStatus.pollStatusId === 2) {
          if (record.isVoter) {
            if (currentDate < convertIntoGmt && committeeStatus === 3) {
              return (
                <Button
                  className={styles["Not_Vote_Button_Polls"]}
                  text={
                    record.voteStatus === "Not Voted" ? t("Vote") : t("Voted")
                  }
                  onClick={() => handleCastVotePollMeeting(record)}
                />
              );
            } else {
              return (
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
                  <Button
                    className={styles["ViewVotesButtonStyles"]}
                    text={t("View-votes")}
                    onClick={() => ViewVoteButtonOnClick(record)}
                  />
                );
              } else {
                return (
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
      width: "50px",
      render: (text, record) => {
        return (
          <>
            {Number(record.pollCreatorID) === Number(userID) &&
            committeeStatus === 3 ? (
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
                                onClick={() => handleEditPollsMeeting(record)}
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
                            onClick={() => handleEditPollsMeeting(record)}
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

  const handleChangePagination = (current, pageSize) => {
    setPageNumber(current);
    setPageSize(pageSize);
    let Data = {
      CommitteeID: Number(ViewCommitteeID),
      OrganizationID: Number(OrganizationID),
      CreatorName: "",
      PollTitle: "",
      PageNumber: Number(current),
      Length: Number(pageSize),
    };
    dispatch(GetPollsByCommitteeIDapi(navigate, t, Data));
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
        ) : unPublished ? (
          <ViewPollsUnPublished setUnPublished={setUnPublished} />
        ) : viewPublishedPoll ? (
          <ViewPollsPublishedScreen
            setSavePollsPublished={setViewPublishedPoll}
          />
        ) : viewVotes ? (
          <ViewVotesScreen />
        ) : (
          <>
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end "
              >
                {committeeStatus === 3 && (
                  <Button
                    text={t("Create-polls")}
                    icon={<img draggable={false} src={addmore} alt="" />}
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
                        scroll={{ y: "45vh", x: false }}
                        pagination={false}
                        className="newMeetingTable"
                        locale={{
                          emptyText: (
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
                                  <span
                                    className={styles["EmptyState_heading"]}
                                  >
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
                                  <span
                                    className={styles["EmptyState_subHeading"]}
                                  >
                                    {t(
                                      "Be-the-first-to-create-a-poll-and-spark-the-conversation"
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
          </>
        )}
        {cancelPolls && <CancelPolls />}
      </section>
    </>
  );
};

export default Polls;
