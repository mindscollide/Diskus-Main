import React, { useState, useEffect } from "react";
import styles from "./Polling.module.css";
import { Row, Col } from "react-bootstrap";
import {
  Button,
  Table,
  TextField,
  Loader,
  Notification,
} from "../../components/elements";
import { Pagination, Tooltip } from "antd";
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
import UpdateSecond from "./UpdateSecond/UpdateSecond";
import { enGB, ar } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux";
import {
  LoaderState,
  castVoteApi,
  getPollsByPollIdApi,
  globalFlag,
  searchPollsApi,
  setCreatePollModal,
  setDeltePollModal,
  setEditpollModal,
  setVotePollModal,
  setviewpollModal,
  setviewpollProgressModal,
  viewVotesDetailsModal,
} from "../../store/actions/Polls_actions";
import { useNavigate } from "react-router-dom";

import {
  _justShowDateformatBilling,
  resolutionResultTable,
} from "../../commen/functions/date_formater";
import { clearMessagesGroup } from "../../store/actions/Groups_actions";
import DeletePoll from "./DeletePolls/DeletePoll";
import {
  regexOnlyCharacters,
  regexOnlyForNumberNCharacters,
} from "../../commen/functions/regex";

const Polling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { PollsReducer } = useSelector((state) => state);
  const [updatePublished, setUpdatePublished] = useState(false);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [pollsState, setPollsState] = useState({
    searchValue: "",
  });
  const [rows, setRows] = useState([]);
  let currentLanguage = localStorage.getItem("i18nextLng");
  registerLocale("ar", ar);
  registerLocale("en", enGB);
  const [searchBoxState, setsearchBoxState] = useState({
    searchByName: "",
    searchByTitle: "",
  });
  let organizationID = localStorage.getItem("organizationID");
  let userID = localStorage.getItem("userID");
  const [isTotalRecords, setTotalRecords] = useState(0);

  const [searchpoll, setSearchpoll] = useState(false);
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
    console.log("PollsReducerPollsReducer", PollsReducer.SearchPolls);
    try {
      if (
        PollsReducer.SearchPolls !== null &&
        PollsReducer.SearchPolls !== undefined
      ) {
        console.log("PollsReducerPollsReducer", PollsReducer.SearchPolls);
        if (PollsReducer.SearchPolls.polls.length > 0) {
          console.log("PollsReducerPollsReducer", PollsReducer.SearchPolls);
          setTotalRecords(PollsReducer.SearchPolls.totalRecords);
          setRows(PollsReducer.SearchPolls.polls);
        } else {
          console.log("PollsReducerPollsReducer", PollsReducer.SearchPolls);
          setRows([]);
        }
      } else {
        console.log("PollsReducerPollsReducer", PollsReducer.SearchPolls);
        setRows([]);
      }
    } catch (error) {}
  }, [PollsReducer.SearchPolls]);
  console.log("PollsReducerPollsReducer", rows);

  useEffect(() => {
    if (currentLanguage === "ar") {
      moment.locale(currentLanguage);
    } else if (currentLanguage === "fr") {
      moment.locale(currentLanguage);
    } else {
      moment.locale(currentLanguage);
    }
  }, [currentLanguage]);

  useEffect(() => {
    try {
      if (
        PollsReducer.pollingSocket !== null &&
        PollsReducer.pollingSocket !== undefined
      ) {
        if (Object.keys(PollsReducer.pollingSocket).length > 0) {
          let pollData = PollsReducer.pollingSocket;
          console.log("Mqtt", pollData);
          let rowCopy = [...rows];
          let findIndex = rowCopy.findIndex(
            (rowData, index) => rowData?.pollID === pollData?.pollID
          );
          if (findIndex !== -1) {
            console.log("Mqtt");
            const newState = rowCopy.map((obj, index) => {
              // 👇️ if id equals 2 replace object
              if (
                findIndex === index &&
                Number(pollData.pollStatus.pollStatusId) === 4
              ) {
                console.log("Mqtt");
                rowCopy.splice(findIndex, 1);
                // return rowCopy;
              } else if (
                findIndex === index &&
                Number(pollData.pollStatus.pollStatusId) === 3
              ) {
                console.log("Mqtt");
                rowCopy[index] = pollData;
                // return rowCopy;
              } else {
                console.log("Mqtt");
                // return obj;
              }
            });
            setRows(rowCopy);
          } else {
            setRows([pollData, ...rowCopy]);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [PollsReducer.pollingSocket]);

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
    let check = 0;
    if (record.wasPollPublished) {
      if (record.pollStatus.pollStatusId === 3) {
        check = 4;
      } else {
        check = 3;
      }
    } else {
      check = 4;
    }

    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };

    if (Object.keys(record).length > 0) {
      dispatch(getPollsByPollIdApi(navigate, data, check, t));
    }
  };

  const deletePollingModal = (record) => {
    setIdForDelete(record.pollID);
    dispatch(setDeltePollModal(true));

    // setIdForDelete
  };

  const handleSearchEvent = () => {
    setSearchpoll(false);
    setsearchBoxState({
      ...searchBoxState,
      searchByName: "",
      searchByTitle: "",
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

  const PollTableColumns = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Post-title")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "pollTitle",
      key: "pollTitle",
      width: "365px",
      sorter: (a, b) => a.pollTitle.localeCompare(b.pollTitle),
      render: (text, record) => {
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
      },
    },
    {
      title: t("Status"),
      dataIndex: "pollStatus",
      key: "pollStatus",
      width: "78px",
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
      width: "89px",
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
        return _justShowDateformatBilling(text + "000000");
      },
    },
    {
      title: t("Created-by"),
      dataIndex: "pollCreator",
      key: "pollCreator",
      width: "97px",
      sorter: (a, b) => a.pollCreator.localeCompare(b.pollCreator),
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
      render: (text, record) => {
        console.log("votevotevotevote", record);
        console.log("votevotevotevote", record.isVoter);
        if (record.pollStatus.pollStatusId === 2) {
          if (record.isVoter) {
            if (record.voteStatus === "Not Voted") {
              return (
                <Button
                  className={styles["voteBtn"]}
                  text={t("Vote")}
                  onClick={() => {
                    handleVotePolls(record);
                  }}
                />
              );
            } else if (record.voteStatus === "Voted") {
              return (
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={styles["Background-nonvoted-Button"]}
                >
                  <span className={styles["Not-voted"]}>{t("Voted")}</span>
                </Col>
              );
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
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Background-nonvoted-Button"]}
                  >
                    <span className={styles["Not-voted"]}>
                      {t("Not-voted")}
                    </span>
                  </Col>
                );
              } else {
                return (
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Background-nonvoted-Button"]}
                  >
                    <span className={styles["Not-voted"]}>{t("Voted")}</span>
                  </Col>
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
      key: "Edit",
      width: "53px",
      render: (text, record) => {
        return (
          <>
            {Number(record.pollCreatorID) === Number(userID) ? (
              <>
                <Row>
                  <Col sm={12} md={5} lg={5}>
                    <Tooltip placement="topRight" title={t("Edit")}>
                      <img
                        src={EditIcon}
                        className="cursor-pointer"
                        width="21.59px"
                        height="21.59px"
                        onClick={() => {
                          handleEditpollModal(record);
                        }}
                      />
                    </Tooltip>
                  </Col>
                  <Col sm={12} md={5} lg={5}>
                    <Tooltip placement="topLeft" title={t("Delete")}>
                      <img
                        src={BinIcon}
                        className="cursor-pointer"
                        width="21.59px"
                        height="21.59px"
                        onClick={() => {
                          deletePollingModal(record);
                        }}
                      />
                    </Tooltip>
                  </Col>
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
      let UpdateValue = regexOnlyForNumberNCharacters(value);
      if (UpdateValue !== "") {
        setPollsState({
          ...pollsState,
          searchValue: UpdateValue,
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
      setPollsState({
        ...pollsState,
        searchValue: "",
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        CreatorName: "",
        PollTitle: pollsState.searchValue,
        PageNumber: JSON.parse(currentPage),
        Length: JSON.parse(currentPageSize),
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
      let UpdateValue = regexOnlyCharacters(value);
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
    let data = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      CreatorName: "",
      PollTitle: "",
      PageNumber: JSON.parse(currentPage),
      Length: JSON.parse(currentPageSize),
    };
    dispatch(searchPollsApi(navigate, t, data));
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
      PageNumber: current,
      Length: pageSize,
    };
    dispatch(searchPollsApi(navigate, t, data));
  };

  useEffect(() => {
    if (
      PollsReducer.ResponseMessage !== "" &&
      PollsReducer.ResponseMessage !== t("Record-found") &&
      PollsReducer.ResponseMessage !== t("No-record-found") &&
      PollsReducer.ResponseMessage !== t("No-data-available")
    ) {
      setOpen({
        ...open,
        flag: true,
        message: PollsReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
      }, 3000);
      dispatch(clearMessagesGroup());
    } else {
      dispatch(clearMessagesGroup());
    }
  }, [PollsReducer.ResponseMessage]);

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
    setSearchpoll(false);
    setsearchBoxState({
      ...searchBoxState,
      searchByName: "",
      searchByTitle: "",
    });
  };

  return (
    <>
      <section className={styles["Poll_Container"]}>
        <Row className="my-3 d-flex align-items-center">
          <Col sm={12} md={1} lg={1}>
            <span className={styles["Poll_Container__heading"]}>
              {t("Polls")}
            </span>
          </Col>
          <Col sm={12} md={2} lg={2}>
            <Button
              text={t("New")}
              className={styles["new_Poll_Button"]}
              icon={
                <img
                  src={plusbutton}
                  height="7.6px"
                  width="7.6px"
                  className="align-items-center"
                />
              }
              onClick={() =>
                dispatch(setCreatePollModal(true), dispatch(LoaderState(true)))
              }
            />
          </Col>
          <Col sm={12} md={9} lg={9} className="justify-content-end d-flex ">
            <span className="position-relative">
              <TextField
                width={"502px"}
                placeholder={t("Search")}
                applyClass={"PollingSearchInput"}
                name={"SearchVal"}
                value={pollsState.searchValue}
                change={HandleSearchPollsMain}
                onKeyDown={handleKeyDownSearch}
                labelClass="d-none"
                clickIcon={HandleShowSearch}
                inputicon={
                  <img
                    src={searchicon}
                    className={styles["Search_Bar_icon_class"]}
                  />
                }
                iconClassName={styles["polling_searchinput"]}
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
                            onClick={HandleCloseSearchModal}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={6} md={6} sm={6}>
                          <TextField
                            placeholder={t("Search-by-title")}
                            applyClass={"Search_Modal_Fields"}
                            labelClass="d-none"
                            name={"searchbytitle"}
                            value={searchBoxState.searchByTitle}
                            change={HandleSearchboxNameTitle}
                          />
                        </Col>
                        <Col lg={6} md={6} sm={6}>
                          <TextField
                            placeholder={t("Search-by-name")}
                            applyClass={"Search_Modal_Fields"}
                            labelClass="d-none"
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
              scroll={{ y: "62vh" }}
              pagination={false}
              className="Polling_table"
              rows={rows}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="pagination-groups-table d-flex justify-content-center">
            <Pagination
              className={styles["PaginationStyle-Meeting"]}
              pageSize={currentPageSize !== null ? currentPageSize : 50}
              showSizeChanger
              onChange={handleChangePagination}
              pageSizeOptions={["30", "50", "100", "200"]}
              current={currentPage !== null ? currentPage : 1}
              locale={{
                items_per_page: t("items_per_page"),
                page: t("page"),
              }}
              total={isTotalRecords}
            />
          </Col>
        </Row>
      </section>
      {PollsReducer.createPollmodal && <CreatePolling />}
      {PollsReducer.editpollmodal && <UpdatePolls />}
      {PollsReducer.viewPollModal && <ViewPoll />}
      {PollsReducer.viewPollProgress && <ViewPollProgress />}
      {PollsReducer.isVotePollModal && <Votepoll />}
      {PollsReducer.viewVotesDetails && <PollDetails />}
      {PollsReducer.deletePollsModal && <DeletePoll id={idForDelete} />}

      {updatePublished ? (
        <>
          <UpdateSecond
            showUpdateAfterPublished={updatePublished}
            setShowUpdateAfterPublished={setUpdatePublished}
          />
        </>
      ) : null}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
      {PollsReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default Polling;
