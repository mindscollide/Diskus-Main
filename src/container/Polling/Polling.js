import React, { useState, useEffect } from "react";
import styles from "./Polling.module.css";
import { Row, Col } from "react-bootstrap";
import {
  Button,
  Table,
  TextField,
  Notification,
} from "../../components/elements";
import { Dropdown, Menu, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import searchicon from "../../assets/images/searchicon.svg";
import CreatePolling from "./CreatePolling/CreatePollingModal";
import { ChevronDown, Plus } from "react-bootstrap-icons";
import BlackCrossIcon from "../../assets/images/BlackCrossIconModals.svg";
import EditIcon from "../../assets/images/Edit-Icon.png";
import BinIcon from "../../assets/images/bin.svg";
import UpdatePolls from "./UpdatePolls/UpdatePolls";
import plusbutton from "../../assets/images/Group 119.svg";
import ViewPoll from "./ViewPoll/ViewPoll";
import ViewPollProgress from "./ViewPoll/ViewPollProgress/ViewPollProgress";
import moment from "moment";
import { registerLocale } from "react-datepicker";
import PollDetails from "./PollDetails/PollDetails";
import Votepoll from "./VotePoll/Votepoll";
import { enGB, ar } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux";
import Tick from "../../assets/images/Tick-Icon.png";
import PollsEmpty from "../../assets/images/Poll_emptyState.svg";
import {
  LoaderState,
  deletePollsMQTT,
  getPollsByPollIdApi,
  globalFlag,
  notifyPollingSocket,
  searchPollsApi,
  setCreatePollModal,
  setDeltePollModal,
  setEditpollModal,
  setVotePollModal,
  setviewpollModal,
  setviewpollProgressModal,
  validateStringPollApi,
  viewVotesDetailsModal,
} from "../../store/actions/Polls_actions";
import { useLocation, useNavigate } from "react-router-dom";

import {
  _justShowDateformatBilling,
  resolutionResultTable,
  utcConvertintoGMT,
} from "../../commen/functions/date_formater";
import { clearMessagesGroup } from "../../store/actions/Groups_actions";
import DeletePoll from "./DeletePolls/DeletePoll";
import { regexOnlyForNumberNCharacters } from "../../commen/functions/regex";
import CustomPagination from "../../commen/functions/customPagination/Paginations";
import { showMessage } from "../../components/elements/snack_bar/utill";

import DescendIcon from "../MinutesNewFlow/Images/SorterIconDescend.png";
import AscendIcon from "../MinutesNewFlow/Images/SorterIconAscend.png";
import ArrowDownIcon from "../MinutesNewFlow/Images/Arrow-down.png";
import ArrowUpIcon from "../MinutesNewFlow/Images/Arrow-up.png";
import AccessDeniedModal from "../../components/layout/WebNotfication/AccessDeniedModal/AccessDeniedModal";
import SpinComponent from "../../components/elements/mainLoader/loader";
const Polling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();
  const PollsReducerSearchPolls = useSelector(
    (state) => state.PollsReducer.SearchPolls
  );
  const PollsReducerpollingSocket = useSelector(
    (state) => state.PollsReducer.pollingSocket
  );
  const PollsReducernewPollDelete = useSelector(
    (state) => state.PollsReducer.newPollDelete
  );
  const PollsReducerResponseMessage = useSelector(
    (state) => state.PollsReducer.ResponseMessage
  );
  const PollsReducereditpollmodal = useSelector(
    (state) => state.PollsReducer.editpollmodal
  );
  const PollsReducerviewPollModal = useSelector(
    (state) => state.PollsReducer.viewPollModal
  );
  const PollsReducerviewPollProgress = useSelector(
    (state) => state.PollsReducer.viewPollProgress
  );
  const PollsReducerisVotePollModal = useSelector(
    (state) => state.PollsReducer.isVotePollModal
  );
  const PollsReducercreatePollmodal = useSelector(
    (state) => state.PollsReducer.createPollmodal
  );
  const PollsReducerviewVotesDetails = useSelector(
    (state) => state.PollsReducer.viewVotesDetails
  );

  console.log(PollsReducerviewVotesDetails, "PollsReducerviewVotes");
  const PollsReducerdeletePollsModal = useSelector(
    (state) => state.PollsReducer.deletePollsModal
  );

  const AccessDeniedGlobalState = useSelector(
    (state) => state.PollsReducer.AccessDeniedPolls
  );
  const [enterpressed, setEnterpressed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [pollsState, setPollsState] = useState({
    searchValue: "",
  });
  const [rows, setRows] = useState([]);
  const [dublicatedrows, setDublicatedrows] = useState([]);
  let currentLanguage = localStorage.getItem("i18nextLng");
  registerLocale("ar", ar);
  registerLocale("en", enGB);
  const [searchBoxState, setsearchBoxState] = useState({
    searchByName: "",
    searchByTitle: "",
  });
  const [sortOrderCreatedBy, setSortOrderCreatedBy] = useState(null);
  const [sortOrderPollingTitle, setSortOrderPollingTitle] = useState(null);

  const [sortOrderDueDate, setSortOrderDueDate] = useState(null);

  let organizationID = localStorage.getItem("organizationID");
  let pollPub = localStorage.getItem("poPub");
  let pollUpda = localStorage.getItem("poUpda");
  let pollExpire = localStorage.getItem("pollExpire");
  let userID = localStorage.getItem("userID");
  const [isTotalRecords, setTotalRecords] = useState(0);

  const [searchpoll, setSearchpoll] = useState(false);
  console.log(searchpoll, "searchpollsearchpoll");
  const [idForDelete, setIdForDelete] = useState(0);

  const currentPage = JSON.parse(localStorage.getItem("pollingPage"));
  const currentPageSize = localStorage.getItem("pollingPageSize");
  useEffect(() => {
    if (currentPage !== null && currentPageSize !== null) {
      let data = {
        UserID: parseInt(userID),
        PollTitle: "",
        OrganizationID: parseInt(organizationID),
        CreatorName: "",
        PageNumber: JSON.parse(currentPage),
        Length: JSON.parse(currentPageSize),
      };
      dispatch(searchPollsApi(navigate, t, data));
    } else {
      localStorage.setItem("pollingPage", 1);
      localStorage.setItem("pollingPageSize", 50);
      let data = {
        UserID: parseInt(userID),
        PollTitle: "",
        OrganizationID: parseInt(organizationID),
        CreatorName: "",
        PageNumber: 1,
        Length: 50,
      };
      dispatch(searchPollsApi(navigate, t, data));
    }

    dispatch(setEditpollModal(false));
    dispatch(setCreatePollModal(false));
    dispatch(setviewpollProgressModal(false));
    dispatch(globalFlag(false));
    dispatch(viewVotesDetailsModal(false));
    dispatch(setviewpollModal(false));
    dispatch(setVotePollModal(false));

    return () => {
      localStorage.removeItem("pollingPage");
      localStorage.removeItem("pollingPageSize");
    };
  }, []);

  useEffect(() => {
    if (state !== null) {
      let check = 0;
      let data = {
        PollID: Number(state.record.pollID),
        UserID: parseInt(userID),
      };
      if (state.isVote) {
        check = 5;
      } else {
        if (state.record.wasPollPublished) {
          if (state.record.pollStatus.pollStatusId === 3) {
            check = 4;
          } else {
            check = 3;
          }
        } else {
          check = 4;
        }
      }
      if (Object.keys(state.record).length > 0) {
        dispatch(getPollsByPollIdApi(navigate, data, check, t));
      }
    }
  }, [state]);

  // Email Route for poll Published
  useEffect(() => {
    if (pollPub !== null) {
      validateStringPollApi(pollPub, navigate, t, 2, dispatch)
        .then(async (result) => {
          localStorage.removeItem("poPub");
          let data = {
            PollID: result.pollID,
            UserID: parseInt(result.userID),
          };
          await dispatch(getPollsByPollIdApi(navigate, data, 5, t));
        })
        .catch((error) => {
          console.log(error, "result");
        });
    }
  }, [pollPub]);
  useEffect(() => {
    if (pollExpire !== null) {
      validateStringPollApi(pollExpire, navigate, t, 2, dispatch)
        .then(async (result) => {
          localStorage.removeItem("pollExpire");
          let data = {
            PollID: result.pollID,
            UserID: parseInt(result.userID),
          };
          await dispatch(getPollsByPollIdApi(navigate, data, 4, t));
        })
        .catch((error) => {
          console.log(error, "result");
        });
    }
  }, [pollExpire]);

  useEffect(() => {
    if (pollUpda !== null) {
      validateStringPollApi(pollUpda, navigate, t, 2, dispatch)
        .then(async (result) => {
          let data = {
            PollID: result.pollID,
            UserID: parseInt(result.userID),
          };
          await dispatch(getPollsByPollIdApi(navigate, data, 4, t));
          localStorage.removeItem("poUpda");
        })
        .catch((error) => {
          console.log(error, "result");
        });
    }
  }, [pollUpda]);

  useEffect(() => {
    try {
      if (
        PollsReducerSearchPolls !== null &&
        PollsReducerSearchPolls !== undefined
      ) {
        if (PollsReducerSearchPolls.polls.length > 0) {
          setTotalRecords(PollsReducerSearchPolls.totalRecords);
          setRows(PollsReducerSearchPolls.polls);
          setDublicatedrows(PollsReducerSearchPolls.polls);
        } else {
          setRows([]);
          setDublicatedrows([]);
        }
      } else {
        setRows([]);
        setDublicatedrows([]);
      }
    } catch (error) {}
  }, [PollsReducerSearchPolls]);

  useEffect(() => {
    if (currentLanguage === "ar") {
      moment.locale(currentLanguage);
    } else if (currentLanguage === "fr") {
      moment.locale(currentLanguage);
    } else {
      moment.locale(currentLanguage);
    }
  }, [currentLanguage]);

  // MQTT for Polls Add , Update & Delete
  useEffect(() => {
    if (
      PollsReducerpollingSocket &&
      Object.keys(PollsReducerpollingSocket).length > 0
    ) {
      try {
        const { committeeID, groupID, meetingID, polls } =
          PollsReducerpollingSocket;

        if (committeeID === -1 && groupID === -1 && meetingID === -1) {
          setRows((prevRows) => {
            const updatedRows = [...prevRows];
            const findIndex = updatedRows.findIndex(
              (rowData) => Number(rowData?.pollID) === Number(polls?.pollID)
            );
            if (findIndex !== -1) {
              if (Number(polls.pollStatus.pollStatusId) === 4) {
                updatedRows.splice(findIndex, 1); // Remove the poll
              } else if (Number(polls.pollStatus.pollStatusId) === 3) {
                updatedRows[findIndex] = polls; // Update the existing poll
              } else if (Number(polls.pollStatus.pollStatusId) === 2) {
                updatedRows[findIndex] = polls; // Update the existing poll
              }
            } else {
              updatedRows.unshift(polls);
            }
            return updatedRows;
          });
          dispatch(notifyPollingSocket(null));
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    }
  }, [PollsReducerpollingSocket]);

  useEffect(() => {
    try {
      if (PollsReducernewPollDelete !== null) {
        const polls = PollsReducernewPollDelete;

        setRows((pollingDataDelete) => {
          return pollingDataDelete.filter(
            (newData2) => Number(newData2.pollID) !== Number(polls?.pollID)
          );
        });
        dispatch(deletePollsMQTT(null));
      }
    } catch (error) {
      console.log(error);
    }
  }, [PollsReducernewPollDelete]);

  const handleEditpollModal = (record) => {
    let check = 0;

    if (record.wasPollPublished) {
      check = 1;
    } else {
      check = 2;
    }

    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };

    if (Object.keys(record).length > 0) {
      dispatch(getPollsByPollIdApi(navigate, data, check, t));
    }
  };

  const handleViewModal = (record) => {
    let userId = localStorage.getItem("userID");
    let check = 0;
    if (record.wasPollPublished) {
      // Poll was published is meant that Poll status is Published or Expired
      if (record.pollStatus.pollStatusId === 3) {
        // Poll Expired
        if (Number(record.pollCreatorID) === Number(userId)) {
          // if User is Poll Creator then poll should modal should open same like published view poll with View Votes Button
          check = 3;
        } else {
          // If User is just a Participant then modal should open like Unpublished Poll
          check = 4;
        }
      } else {
        // if User is Poll Creator then poll should modal should open same like published view poll with View Votes Button
        check = 3;
      }
    } else {
      // UnPublished Poll
      check = 4;
    }

    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    console.log(check, "PollsReducerviewVotes");
    if (Object.keys(record).length > 0) {
      dispatch(getPollsByPollIdApi(navigate, data, check, t));
    }
  };

  const ViewTitleBeforeDueDatePassed = (record) => {
    if (Object.keys(record).length > 0) {
      let data = {
        PollID: record.pollID,
        UserID: parseInt(userID),
      };
      dispatch(getPollsByPollIdApi(navigate, data, 5, t));
    }
  };

  const deletePollingModal = (record) => {
    setIdForDelete(record.pollID);
    dispatch(setDeltePollModal(true));
  };

  const handleSearchEvent = () => {
    setSearchpoll(false);
    setIsSearching(true);
    setPollsState({
      ...pollsState,
      searchValue: searchBoxState.searchByTitle,
    });

    let data = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      PollTitle: searchBoxState.searchByTitle,
      CreatorName: searchBoxState.searchByName,
      Title: searchBoxState.searchByTitle,
      PageNumber: 1,
      Length: 50,
    };
    dispatch(searchPollsApi(navigate, t, data));
  };

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
    setRows(filteredData);
    setVisible(false);
  };

  const resetFilter = () => {
    setSelectedValues(["Published", "UnPublished", "Expired"]);
    setRows(dublicatedrows);
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

  //Handle View Votes Buttton

  const handleViewVotesButton = (ID) => {
    // let data = {
    //   PollID: Number(ID),
    // };
    let data = {
      PollID: Number(ID),
      UserID: parseInt(userID),
    };
    dispatch(getPollsByPollIdApi(navigate, data, 3, t));
  };

  const PollTableColumns = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className="d-flex gap-2">
                {t("Poll-title")}{" "}
                {sortOrderPollingTitle === "descend" ? (
                  <img src={DescendIcon} alt="" />
                ) : (
                  <img src={AscendIcon} alt="" />
                )}
              </span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "pollTitle",
      key: "pollTitle",
      width: "365px",
      align: "start",
      sorter: (a, b) =>
        a.pollTitle.toLowerCase().localeCompare(b.pollTitle.toLowerCase()),
      sortOrderPollingTitle,
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
        console.log(record, "recordrecordrecord");
        console.log(text, "recordrecordrecord");
        const currentDate = new Date();
        const convertIntoGmt = resolutionResultTable(record.dueDate);
        if (
          currentDate < convertIntoGmt &&
          record.isVoter &&
          record.pollStatus.status === "Published"
        ) {
          return (
            <span
              className={styles["Ellipses_Class"]}
              onClick={() => {
                ViewTitleBeforeDueDatePassed(record);
              }}
            >
              {text}
            </span>
          );
        } else {
          console.log(text, "recordrecordrecord");
          return (
            <span
              className={styles["Ellipses_Class"]}
              onClick={() => {
                handleViewModal(record);
              }}
            >
              {text}
            </span>
          );
        }
      },
    },
    {
      title: t("Status"),
      dataIndex: "pollStatus",
      key: "pollStatus",
      width: "78px",
      align: currentLanguage === "en" ? "left" : "right",
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
            <div className="d-flex">
              <span className="userstatus-signal-PublishedPolls"></span>
              <p className="m-0 userName FontArabicRegular">{t("Published")}</p>
            </div>
          );
        } else if (record.pollStatus?.pollStatusId === 1) {
          return (
            <div className="d-flex">
              <span className="userstatus-signal-Unpublished"></span>
              <p className="m-0 userName FontArabicRegular">
                {t("Unpublished")}
              </p>
            </div>
          );
        } else if (record.pollStatus?.pollStatusId === 3) {
          return (
            <div className="d-flex">
              <span className="userstatus-signal-disabled"></span>
              <p className="m-0 userName FontArabicRegular">{t("Expired")}</p>
            </div>
          );
        }
      },
    },
    {
      title: (
        <>
          <span className="d-flex gap-2 align-items-center">
            {t("Due-date")}
            {sortOrderDueDate === "descend" ? (
              <img src={ArrowDownIcon} alt="" />
            ) : (
              <img src={ArrowUpIcon} alt="" />
            )}
          </span>
        </>
      ),
      dataIndex: "dueDate",
      key: "dueDate",
      width: "89px",
      align: currentLanguage === "en" ? "left" : "right",
      sorter: (a, b) =>
        utcConvertintoGMT(a.dueDate) - utcConvertintoGMT(b.dueDate),
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
        return _justShowDateformatBilling(text, currentLanguage);
      },
    },
    {
      title: (
        <>
          <span className="d-flex gap-2 align-items-center">
            {" "}
            {t("Created-by")}
            {sortOrderCreatedBy === "descend" ? (
              <img src={DescendIcon} alt="" />
            ) : (
              <img src={AscendIcon} alt="" />
            )}
          </span>
        </>
      ),
      dataIndex: "pollCreator",
      key: "pollCreator",
      width: "97px",
      align: currentLanguage === "en" ? "left" : "right",
      sorter: (a, b) =>
        a.pollCreator.toLowerCase().localeCompare(b.pollCreator.toLowerCase()),
      sortOrderCreatedBy,
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
        return <span className="text-truncate d-block">{text}</span>;
      },
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Vote")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "vote",
      key: "vote",
      width: "69px",
      align: "center",
      render: (text, record) => {
        console.log(record, "centercentercentercenter");

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
                  className={styles["voteBtn"]}
                  text={
                    record.voteStatus === "Not Voted" ? t("Vote") : t("Voted")
                  }
                  onClick={() => {
                    handleVotePolls(record);
                  }}
                />
              );
            } else
              return (
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-start"
                >
                  <Button
                    text={t("View-votes")}
                    className={styles["ViewVotesButtonStyles"]}
                    onClick={() => handleViewVotesButton(record.pollID)}
                  />
                </Col>
              );
          } else {
            return "";
          }
        } else if (record.pollStatus.pollStatusId === 3) {
          if (record.isVoter) {
            if (record.wasPollPublished) {
              if (record.voteStatus === "Not Voted") {
                return (
                  <Col lg={12} md={12} sm={12}>
                    <Button
                      text={t("View-votes")}
                      className={styles["ViewVotesButtonStyles"]}
                      onClick={() => handleViewVotesButton(record.pollID)}
                    />
                  </Col>
                );
              } else {
                return (
                  <Button
                    text={t("View-votes")}
                    className={styles["ViewVotesButtonStyles"]}
                    onClick={() => handleViewVotesButton(record.pollID)}
                  />
                );
              }
            } else {
              return "";
            }
          } else {
            return (
              <Button
                text={t("View-votes")}
                className={styles["ViewVotesButtonStyles"]}
                onClick={() => handleViewVotesButton(record.pollID)}
              />
            );
          }
        } else {
          return "";
        }
      },
    },
    {
      dataIndex: "Edit",
      key: "Edit",
      width: "53px",
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
                                onClick={() => {
                                  handleEditpollModal(record);
                                }}
                                draggable="false"
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
                                onClick={() => {
                                  deletePollingModal(record);
                                }}
                                draggable="false"
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
                            onClick={() => {
                              handleEditpollModal(record);
                            }}
                            draggable="false"
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
                            onClick={() => {
                              deletePollingModal(record);
                            }}
                            draggable="false"
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

  const HandleSearchPollsMain = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "SearchVal") {
      if (value !== "") {
        setPollsState({
          ...pollsState,
          searchValue: value,
        });
      } else {
        setPollsState({
          ...pollsState,
          searchValue: "",
        });
      }
    }
  };

  const handleKeyDownSearch = (e) => {
    if (e.key === "Enter") {
      setEnterpressed(true);
      setIsSearching(true);
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        CreatorName: "",
        PollTitle: pollsState.searchValue,
        PageNumber: 1,
        Length: 50,
      };
      dispatch(searchPollsApi(navigate, t, data));
    }
  };

  const HandleSearchboxNameTitle = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "searchbytitle") {
      let UpdateValue = regexOnlyForNumberNCharacters(value);
      if (UpdateValue !== "") {
        setsearchBoxState({
          ...searchBoxState,
          searchByTitle: UpdateValue,
        });
      } else {
        setsearchBoxState({
          ...searchBoxState,
          searchByTitle: "",
        });
      }
    }
    if (name === "seachbyname") {
      let UpdateValue = regexOnlyForNumberNCharacters(value);
      if (UpdateValue !== "") {
        setsearchBoxState({
          ...searchBoxState,
          searchByName: UpdateValue,
        });
      } else {
        setsearchBoxState({
          ...searchBoxState,
          searchByName: "",
        });
      }
    }
  };

  const ResetSearchBtn = () => {
    setsearchBoxState({
      ...searchBoxState,
      searchByName: "",
      searchByTitle: "",
    });
    setSearchpoll(false);
  };

  const HandleShowSearch = () => {
    setPollsState({
      ...pollsState,
      searchValue: "",
    });
    setSearchpoll(true);
  };

  const handleChangePagination = (current, pageSize) => {
    let data = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      CreatorName: searchBoxState.searchByName,
      PollTitle: searchBoxState.searchByTitle,
      PageNumber: Number(current),
      Length: Number(pageSize),
    };
    localStorage.setItem("pollingPage", Number(current));
    localStorage.setItem("pollingPageSize", Number(pageSize));
    dispatch(searchPollsApi(navigate, t, data));
  };

  useEffect(() => {
    if (
      PollsReducerResponseMessage !== "" &&
      PollsReducerResponseMessage !== "" &&
      PollsReducerResponseMessage !== t("No-records-found") &&
      PollsReducerResponseMessage !== t("No-data-available")
    ) {
      showMessage(PollsReducerResponseMessage, "Success", setOpen);
      dispatch(clearMessagesGroup());
    } else {
      dispatch(clearMessagesGroup());
    }
  }, [PollsReducerResponseMessage]);

  const handleVotePolls = (record) => {
    if (Object.keys(record).length > 0) {
      let data = {
        PollID: record.pollID,
        UserID: parseInt(userID),
      };
      dispatch(getPollsByPollIdApi(navigate, data, 5, t));
    }
  };

  const HandleCloseSearchModal = () => {
    setsearchBoxState({
      ...searchBoxState,
      searchByName: "",
      searchByTitle: "",
    });
    setSearchpoll(false);
    setIsSearching(false);
    let data = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      CreatorName: "",
      PollTitle: "",
      PageNumber: 1,
      Length: 50,
    };
    dispatch(searchPollsApi(navigate, t, data));
  };

  const handleResettingPage = () => {
    setPollsState({
      ...pollsState,
      searchValue: "",
    });
    setIsSearching(false);
    setSearchpoll(false);
    let data = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      CreatorName: "",
      PollTitle: "",
      PageNumber: 1,
      Length: 50,
    };
    dispatch(searchPollsApi(navigate, t, data));
  };

  return (
    <>
      <section className={styles["Poll_Container"]}>
        <Row className="my-3 d-flex align-items-center">
          <Col
            sm={12}
            md={7}
            lg={7}
            className="d-flex align-items-center gap-4"
          >
            <span className={styles["Poll_Container__heading"]}>
              {t("Polls")}
            </span>
            <Button
              text={t("New")}
              className={styles["new_Poll_Button"]}
              icon={<Plus width={20} height={20} fontWeight={800} />}
              onClick={() =>
                dispatch(setCreatePollModal(true), dispatch(LoaderState(true)))
              }
            />
          </Col>

          <Col sm={12} md={5} lg={5}>
            <span className="position-relative w-100">
              <TextField
                width={"100%"}
                placeholder={t("Search-on-poll-title")}
                applyClass={"PollingSearchInput"}
                name={"SearchVal"}
                value={pollsState.searchValue}
                change={HandleSearchPollsMain}
                onKeyDown={handleKeyDownSearch}
                labelclass="d-none"
                inputicon={
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex gap-2 align-items-center"
                      >
                        {pollsState.searchValue && enterpressed ? (
                          <>
                            <img
                              src={BlackCrossIcon}
                              className="cursor-pointer"
                              draggable="false"
                              alt=""
                              onClick={handleResettingPage}
                            />
                          </>
                        ) : null}
                        <Tooltip
                          placement="bottomLeft"
                          title={t("Search-filters")}
                        >
                          <img
                            src={searchicon}
                            alt=""
                            className={styles["Search_Bar_icon_class"]}
                            draggable="false"
                            onClick={HandleShowSearch}
                          />
                        </Tooltip>
                      </Col>
                    </Row>
                  </>
                }
                iconclassname={styles["polling_searchinput"]}
              />
              {searchpoll ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["SearhBar_Polls"]}
                    >
                      <Row className="mt-2">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-end"
                        >
                          <img
                            src={BlackCrossIcon}
                            className={styles["Cross_Icon_Styling"]}
                            width="16px"
                            height="16px"
                            alt=""
                            onClick={HandleCloseSearchModal}
                            draggable="false"
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={6} md={6} sm={6}>
                          <TextField
                            placeholder={t("Search-by-title")}
                            applyClass={"Search_Modal_Fields"}
                            labelclass="d-none"
                            name={"searchbytitle"}
                            value={searchBoxState.searchByTitle}
                            change={HandleSearchboxNameTitle}
                          />
                        </Col>
                        <Col lg={6} md={6} sm={6}>
                          <TextField
                            placeholder={t("Search-by-name")}
                            applyClass={"Search_Modal_Fields"}
                            labelclass="d-none"
                            name={"seachbyname"}
                            value={searchBoxState.searchByName}
                            change={HandleSearchboxNameTitle}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-end gap-2"
                        >
                          <Button
                            text={t("Reset")}
                            className={styles["Reset_Button_polls_SearchModal"]}
                            onClick={ResetSearchBtn}
                          />
                          <Button
                            text={t("Search")}
                            type={"submit"}
                            className={
                              styles["Search_Button_polls_SearchModal"]
                            }
                            onClick={handleSearchEvent}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : null}
            </span>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={12}>
            <Table
              column={PollTableColumns}
              scroll={{ y: rows.length > 0 ? "55vh" : "auto" }}
              pagination={false}
              className={"Polling_main_table"}
              rows={rows}
              locale={{
                emptyText: (
                  <>
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className="d-flex justify-content-center align-items-center flex-column gap-2"
                      >
                        <img
                          src={PollsEmpty}
                          alt="poll_icon"
                          draggable="false"
                        />
                        <span className={styles["No_Poll_Heading"]}>
                          {t("No-polls")}
                        </span>
                        <span className={styles["No_Poll_Text"]}>
                          {t(
                            "Be-the-first-to-create-a-poll-and-spark-the-conversation"
                          )}
                        </span>
                        {!isSearching && (
                          <Button
                            text={t("New")}
                            className={styles["new_Poll_Button"]}
                            icon={
                              <img
                                src={plusbutton}
                                height="7.6px"
                                width="7.6px"
                                alt=""
                                className="align-items-center"
                                draggable="false"
                              />
                            }
                            onClick={() =>
                              dispatch(
                                setCreatePollModal(true),
                                dispatch(LoaderState(true))
                              )
                            }
                          />
                        )}
                        <div className="mt-2"></div>
                      </Col>
                    </Row>
                  </>
                ),
              }}
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-center"
          >
            {rows.length > 0 && (
              <Row className={styles["PaginationStyle-Committee"]}>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={"pagination-groups-table"}
                >
                  <CustomPagination
                    current={currentPage !== null ? currentPage : 1}
                    pageSize={currentPageSize !== null ? currentPageSize : 50}
                    pageSizeOptionsValues={["30", "50", "100", "200"]}
                    showSizer={true}
                    onChange={handleChangePagination}
                    total={isTotalRecords}
                  />
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </section>
      {PollsReducercreatePollmodal && <CreatePolling />}
      {PollsReducereditpollmodal && <UpdatePolls />}
      {PollsReducerviewPollModal && <ViewPoll />}
      {PollsReducerviewPollProgress && <ViewPollProgress />}
      {PollsReducerisVotePollModal && <Votepoll />}
      {PollsReducerviewVotesDetails && <PollDetails />}
      {PollsReducerdeletePollsModal && <DeletePoll id={idForDelete} />}
      {AccessDeniedGlobalState && <AccessDeniedModal />}

      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default Polling;
