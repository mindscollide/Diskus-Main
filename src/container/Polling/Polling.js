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
import { useTranslation } from "react-i18next";
import searchicon from "../../assets/images/searchicon.svg";
import CreatePolling from "./CreatePolling/CreatePollingModal";
import { ChevronDown, Plus } from "react-bootstrap-icons";
import BlackCrossIcon from "../../assets/images/BlackCrossIconModals.svg";
import EditIcon from "../../assets/images/Edit-Icon.png";
import UpdatePolls from "./UpdatePolls/UpdatePolls";
import plusbutton from "../../assets/images/Group 119.svg";
import ViewPoll from "./ViewPoll/ViewPoll";
import ViewPollProgress from "./ViewPoll/ViewPollProgress/ViewPollProgress";
import PollDetails from "./PollDetails/PollDetails";
import Votepoll from "./VotePoll/Votepoll";
import UpdateSecond from "./UpdateSecond/UpdateSecond";
import { useDispatch, useSelector } from "react-redux";
import {
  LoaderState,
  castVoteApi,
  globalFlag,
  searchPollsApi,
  setCreatePollModal,
  setEditpollModal,
} from "../../store/actions/Polls_actions";
import { useNavigate } from "react-router-dom";
import {
  _justShowDateformatBilling,
  resolutionResultTable,
} from "../../commen/functions/date_formater";
import { clearMessagesGroup } from "../../store/actions/Groups_actions";

const Polling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { PollsReducer } = useSelector((state) => state);
  const [isUpdatePoll, setIsUpdatePoll] = useState(false);
  const [viewprogress, setViewprogress] = useState(false);
  const [pollData, setPollData] = useState([]);
  const [updatePublished, setUpdatePublished] = useState(false);
  const [isVotePoll, setisVotePoll] = useState(false);
  const [viewPollsDetails, setViewPollsDetails] = useState(false);
  const [isViewPoll, setIsViewPoll] = useState(false);
  const [totalRecords, setTotalRecord] = useState(0);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [pollsState, setPollsState] = useState({
    searchValue: "",
  });
  const [rows, setRows] = useState([]);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [searchBoxState, setsearchBoxState] = useState({
    searchByName: "",
    searchByTitle: "",
  });

  const [searchpoll, setSearchpoll] = useState(false);

  const showViewProgressBarModal = () => {
    setViewprogress(true);
  };

  const ShowPollsDetailsModal = () => {
    setViewPollsDetails(true);
  };

  const OpenVotePollModal = () => {
    setisVotePoll(true);
  };

  const OpenUpdatePublished = () => {
    setUpdatePublished(true);
  };

  const handleEditpollModal = (record) => {
    if (record.wasPollPublished === false) {
      dispatch(setEditpollModal(true));
      dispatch(globalFlag(true));
    } else {
      dispatch(setEditpollModal(true));
      dispatch(globalFlag(true));
    }
  };

  useEffect(() => {
    console.log(PollsReducer.SearchPolls, "PollsReducerPollsReducer");
    let userIds = [];
    if (
      PollsReducer.SearchPolls !== null &&
      PollsReducer.SearchPolls !== undefined
    ) {
      if (Object.keys(PollsReducer.SearchPolls.polls).length > 0) {
        PollsReducer.SearchPolls.polls.map((data, index) => {
          console.log(data, "datadatadatadata");
          userIds.push(data.pollID);
        });
        setPollData(userIds);
      }
    }
  }, [PollsReducer.SearchPolls]);

  console.log(pollData, "pollDatapollDatapollData");

  const handleVotePolls = () => {
    let userID = localStorage.getItem("userID");

    let data = {
      PollID: 1,
      UserID: parseInt(userID),
      PollOptionIDs: [4, 5, 6],
    };
    dispatch(castVoteApi(navigate, data, t));
  };

  const handleSearchEvent = () => {
    let userID = localStorage.getItem("userID");
    let organizationID = localStorage.getItem("organizationID");
    let data = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      CreatorName: searchBoxState.searchByName,
      PageNumber: 1,
      Length: 3,
    };
    dispatch(searchPollsApi(navigate, t, data));
  };

  const PollTableColumns = [
    {
      title: t("Post-title"),
      dataIndex: "pollTitle",
      key: "pollTitle",
      width: "365px",
      render: (text, record) => {
        let newDate = new Date();
        let checkDate = resolutionResultTable(record.dueDate + "000000");
        if (checkDate < newDate) {
          return (
            <span
              className="cursor-pointer"
              onClick={() => setViewPollsDetails(true)}
            >
              {text}
            </span>
          );
        } else {
          return (
            <span
              className="cursor-pointer"
              onClick={() => setisVotePoll(true)}
            >
              {" "}
              {text}
            </span>
          );
        }
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "62px",
      filters: [
        {
          text: t("Published"),
          value: "Published",
          className: currentLanguage,
        },
        {
          text: t("Unpublished"),
          value: "Unpublished",
        },
      ],
      defaultFilteredValue: ["Published", "Unpublished"],
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      render: (text, record) => {
        if (record.pollStatus.pollStatusId === 1) {
          return <span className="text-success">{t("Published")}</span>;
        } else if (record.pollStatus.pollStatusId === 2) {
          return <span className="text-success">{t("Unpublished")}</span>;
        }
      },
    },
    {
      title: t("Due-date"),
      dataIndex: "dueDate",
      key: "dueDate",
      width: "89px",
      render: (text, record) => {
        return _justShowDateformatBilling(text + "000000");
      },
    },
    {
      title: t("Created-by"),
      dataIndex: "pollCreator",
      key: "pollCreator",
      width: "97px",
    },
    {
      title: t("Vote"),
      dataIndex: "vote",
      key: "vote",
      width: "59px",
      render: (text, record) => {
        if (record.pollStatus.pollStatusId === 2) {
          if (record.voteStatus === "Not Voted") {
            return (
              <Button
                className={styles["voteBtn"]}
                text={"Vote"}
                onClick={handleVotePolls}
              />
            );
          } else if (record.voteStatus === "Voted") {
            return <Button className={styles["votedBtn"]} text={"Voted"} />;
          }
        } else {
          return "";
        }
      },
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      width: "33px",
      render: (text, record) => {
        return (
          <img
            src={EditIcon}
            className="cursor-pointer"
            width="21.59px"
            height="21.59px"
            onClick={() => {
              handleEditpollModal(record);
            }}
          />
        );
      },
    },
  ];

  const HandleSearchPollsMain = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "SearchVal") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (value !== "") {
        setPollsState({
          ...pollsState,
          searchValue: valueCheck,
        });
      } else {
        setPollsState({
          ...pollsState,
          searchValue: "",
        });
      }
    }
  };

  const HandleSearchboxNameTitle = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "searchbytitle") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (value !== "") {
        setsearchBoxState({
          ...searchBoxState,
          searchByTitle: valueCheck,
        });
      } else {
        setsearchBoxState({
          ...searchBoxState,
          searchByTitle: "",
        });
      }
    }
    if (name === "seachbyname") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (value !== "") {
        setsearchBoxState({
          ...searchBoxState,
          searchByName: valueCheck,
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
  };

  const HandleShowSearch = () => {
    setSearchpoll(true);
  };

  useEffect(() => {
    try {
      if (
        PollsReducer.SearchPolls !== null &&
        PollsReducer.SearchPolls !== undefined
      ) {
        setTotalRecord(PollsReducer.SearchPolls.totalRecords);
        if (PollsReducer.SearchPolls.polls.length > 0) {
          setRows(PollsReducer.SearchPolls.polls);
        } else {
          setRows([]);
        }
      }
    } catch (error) {}
  }, [PollsReducer.SearchPolls]);

  useEffect(() => {
    if (
      PollsReducer.ResponseMessage !== "" &&
      PollsReducer.ResponseMessage !== t("Data-available") &&
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

  let userID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  useEffect(() => {
    let data = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      CreatorName: searchBoxState.searchByName,
      PageNumber: 1,
      Length: 50,
    };
    dispatch(searchPollsApi(navigate, t, data));
  }, []);

  const HandleCloseSearchModal = () => {
    setSearchpoll(false);
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
                // value={filterVal}
                width={"502px"}
                // change={handleFilter}
                placeholder={t("Search")}
                applyClass={"PollingSearchInput"}
                name={"SearchVal"}
                value={pollsState.searchValue}
                change={HandleSearchPollsMain}
                labelClass="d-none"
                clickIcon={HandleShowSearch}
                // onDoubleClick={searchbardropdownShow}

                inputicon={
                  <img
                    src={searchicon}
                    className={styles["Search_Bar_icon_class"]}
                    // className={styles["GlobalSearchFieldICon"]}
                  />
                }
                // clickIcon={SearchiconClickOptions}
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
                            placeholder={t("Search-by-Title")}
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
            <Table column={PollTableColumns} rows={rows} />
          </Col>
        </Row>
      </section>
      {PollsReducer.createPollmodal && <CreatePolling />}
      {PollsReducer.editpollmodal && <UpdatePolls />}

      {isViewPoll ? (
        <>
          <ViewPoll
            showViewPollModal={isViewPoll}
            setShowViewPollModal={setIsViewPoll}
          />
        </>
      ) : null}
      {viewprogress ? (
        <>
          <ViewPollProgress
            showViewProgress={viewprogress}
            setShowViewProgress={setViewprogress}
          />
        </>
      ) : null}
      {viewPollsDetails ? (
        <>
          <PollDetails
            showpollDetails={viewPollsDetails}
            setShowpollDetails={setViewPollsDetails}
          />
        </>
      ) : null}
      {isVotePoll ? (
        <>
          <Votepoll showVotePoll={isVotePoll} setShowVotePoll={setisVotePoll} />
        </>
      ) : null}
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
