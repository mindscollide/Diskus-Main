import React, { Fragment, useEffect, useState } from "react";
import styles from "./Resolution.module.css";
import {
  Button,
  TextField,
  TableToDo,
  Loader,
  Notification,
  SelectBox,
} from "../../components/elements";
import { Col, Row } from "react-bootstrap";
import searchicon from "../../assets/images/searchicon.svg";
import results from "../../assets/images/results.svg";
import edit from "../../assets/images/Groupedit.svg";
import thumbsup from "../../assets/images/thumbsup.svg";
import thumbsdown from "../../assets/images/thumbsdown.svg";
import { useTranslation } from "react-i18next";
import ScheduleNewResolution from "../../components/elements/ScheduleNewResolution/ScheduleNewResolution";
import ViewResolution from "../../components/elements/ViewResolution/ViewResolution";
import ResultResolution from "../../components/elements/ResultsPageResoution/ResultResolution";
import VotingPage from "../VotingPage/VotingPage";
import attachment from "../../assets/images/attch.svg";
import ModalResolutionUpdated from "../ModalResolutionUpdated/ModalResolutionUpdated";
import ViewAttachments from "../../components/elements/ViewAttachments/ViewAttachments";
import Cross from "../../assets/images/Cross-Chat-Icon.png";
import EditResolution from "../../components/elements/EditResolution/EditResolution";
import {
  clearResponseMessage,
  getResolutionbyResolutionID,
  getResolutionResult,
  getResolutions,
  getVotesDetails,
} from "../../store/actions/Resolution_actions";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import {
  newTimeFormaterAsPerUTCFullDate,
  newTimeFormaterForResolutionAsPerUTCFullDate,
  _justShowDateformat,
} from "../../commen/functions/date_formater";
import EditResolutionIcon from "../../assets/images/Edit_Resolution_Icon.svg";
import ResultResolutionIcon from "../../assets/images/Result_Resolution_Icon.svg";

const Resolution = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { ResolutionReducer } = useSelector((state) => state);
  const [newresolution, setNewresolution] = useState(false);
  const [viewresolution, setViewresolution] = useState(false);
  const [resultresolution, setResultresolution] = useState(false);
  const [voteresolution, setVoteresolution] = useState(false);
  const [closedbtntable, setClosedbtntable] = useState(false);
  const [currentbtn, setCurrentbtn] = useState(false);
  const [getAll, setGetAll] = useState(true);
  const [searchIcon, setSearchIcon] = useState(false);
  const [rows, setRows] = useState([]);
  const [resolutionmodalupdated, setRresolutionmodalupdated] = useState(false);
  const [viewattachmentpage, setViewattachmentpage] = useState(false);
  const [editresolutionPage, setEditResoutionPage] = useState(false);
  const [searchResultsArea, setSearchResultsArea] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const showSearchOptions = () => {
    setSearchResultsArea(true);
  };

  const hideSearchOptions = () => {
    setSearchResultsArea(false);
  };

  // const resolutionEdit = () => {
  //   setEditResoutionPage(true);
  // };
  // const viewAttachmentPageopen = () => {
  //   setViewattachmentpage(true);
  // };
  // const resolutionupdatedbtn = () => {
  //   setRresolutionmodalupdated(true);
  // };

  const closeSeachBar = () => {
    setSearchIcon(false);
  };

  const openSearchBox = () => {
    setSearchIcon(true);
  };
  const currentbuttontable = () => {
    setClosedbtntable(false);
    setCurrentbtn(true);
    setGetAll(false);
    dispatch(getResolutions(1, t));
  };
  const allbtntable = () => {
    setClosedbtntable(false);
    setCurrentbtn(false);
    setGetAll(true);
    dispatch(getResolutions(3, t));
  };
  const createresolution = () => {
    setNewresolution(true);
  };

  const buttonclosed = () => {
    setClosedbtntable(true);
    setCurrentbtn(false);
    setGetAll(false);
    // setClosedbtntable(true);
    dispatch(getResolutions(2, t));
  };
  const resultpage = () => {
    setResultresolution(true);
    console.log("i am clicked ");
  };
  const viewresolutionpage = () => {
    setViewresolution(true);
  };

  const handleUpdateResolutionAction = (id) => {
    console.log(id, "Asdasdasd");
    dispatch(
      getResolutionbyResolutionID(
        id,
        t,
        setEditResoutionPage,
        setViewresolution,
        1
      )
    );
  };
  const viewResolution = (id) => {
    dispatch(
      getResolutionbyResolutionID(
        id,
        t,
        setEditResoutionPage,
        setViewresolution,
        2
      )
    );
  };
  const getResultHandle = (id) => {
    dispatch(getResolutionResult(id, t, setResultresolution));
  };
  const getVoteDetailHandler = (id) => {
    dispatch(getVotesDetails(id, t, setVoteresolution));
  };
  const filterResolution = (e) => {
    console.log(
      e.target.value,
      "filterResolutionfilterResolutionfilterResolutionfilterResolution"
    );
    let searchValue = e.target.value;
    // let rowsCopy = [...rows]
    // let newArr = [];
    // if (rows.length > 0) {
    //   rowsCopy.filter((data, index) =>  data.resolutionTitle.toLowerCase().includes(searchValue.toLowerCase())).map((data2, index) =>  newArr.push(data2))
    // }
    // if(newArr.length > 0) {
    //   setRows(newArr)
    // } else {
    //   setRows(rows)
    // }
  };
  
  const columnsToDo = [
    {
      title: t("Resolution-title"),
      dataIndex: "resolutionTitle",
      key: "resolutionTitle",
      align: "left",
      width: "365px",
      render: (table, data) => {
        console.log(table, data, "checking");
        return (
          <span
            className={styles["resolution_title"]}
            onClick={() => viewResolution(data.resolutionID)}
          >
            {table}
          </span>
        );
      },
    },

    {
      title: t("Circulation-date"),
      dataIndex: "circulationDate",
      key: "circulationDate",
      align: "center",
      width: "134px",
      render: (table, data) => {
        console.log(table, data, "checking");
        return (
          <span className={styles["resolution_date"]}>
            {_justShowDateformat(table)}
          </span>
        );
      },
    },
    {
      title: t("Voting-deadline"),
      dataIndex: "votingDeadline",
      key: "votingDeadline",
      align: "center",
      width: "153px",
      render: (table, data) => {
        console.log(table, data, "checking");
        return (
          <span className={styles["resolution_date"]}>
            {newTimeFormaterForResolutionAsPerUTCFullDate(table)}
          </span>
        );
      },
    },
    {
      title: t("Decision-date"),
      dataIndex: "decisionDate",
      key: "decisionDate",
      align: "center",
      width: "153px",
      render: (table, data) => {
        console.log(table, data, "checking");
        return (
          <span className={styles["resolution_date"]}>
            {newTimeFormaterForResolutionAsPerUTCFullDate(table)}
          </span>
        );
      },
    },
    {
      title: t("Decision"),
      dataIndex: "decision",
      key: "decision",
      align: "center",
      width: "71px",
      render: (text, data) => {
        if (text === "Approved" || text === "Not Approved") {
          return <span className={styles["decision_Approved"]}>{text}</span>;
        } else {
          <span className={styles["decision_text"]}>{text}</span>;
        }
        //  return <span>{text}</span>
      },
    },
    {
      title: t("Vote"),
      dataIndex: "isVoter",
      align: "Vote",
      key: "isVoter",
      width: "59px",
      render: (table, data) => {
        console.log(table, data, "VoteResolution");
        if (table === false) {
          return (
            <Button
              text="Vote"
              className={styles["Resolution-vote-btn"]}
              onClick={() => getVoteDetailHandler(data.resolutionID)}
            />
          );
        } else return;
      },
    },
    {
      title: t("Vote-count"),
      dataIndex: "voteCount",
      align: "center",
      key: "voteCount",
      width: "94px",
    },
    {
      title: t("Result"),
      dataIndex: "Result",
      align: "center",
      key: "Result",
      width: "53px",
      render: (table, data) => {
        console.log(table, data, "ResultResolution");
        return (
          <img
            src={ResultResolutionIcon}
            onClick={() => getResultHandle(data.resolutionID)}
          />
        );
      },
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
      width: "33px",
      render: (table, data) => {
        console.log(table, data, "EditResolution");
        if (
          data.resolutionStatus === "Circulated" ||
          data.resolutionStatus === "Closed"
        ) {
        } else {
          return (
            <img
              src={EditResolutionIcon}
              onClick={() => handleUpdateResolutionAction(data.resolutionID)}
            />
          );
        }
      },
    },
  ];

  useEffect(() => {
    if (ResolutionReducer.ResponseMessage !== null) {
      setOpen({
        flag: true,
        message: ResolutionReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          flag: false,
          message: "",
        });
      }, 4000);
      dispatch(clearResponseMessage());
    }
  }, [ResolutionReducer.ResponseMessage]);

  useEffect(() => {
    dispatch(getResolutions(3, t));
  }, []);
  useEffect(() => {
    if (ResolutionReducer.GetResolutions !== null) {
      setRows(ResolutionReducer.GetResolutions);
    }
  }, [ResolutionReducer.GetResolutions]);
  return (
    <>
      <section className={styles["resolution_container"]}>
        {newresolution ? (
          <>
            <ScheduleNewResolution
              setEditResoutionPage={setEditResoutionPage}
              newresolution={newresolution}
              setNewresolution={setNewresolution}
            />
          </>
        ) : viewresolution ? (
          <>
            <ViewResolution
              viewresolution={viewresolution}
              setViewresolution={setViewresolution}
            />
          </>
        ) : resultresolution ? (
          <>
            <ResultResolution
              setResultresolution={setResultresolution}
              resultresolution={resultresolution}
            />
          </>
        ) : voteresolution ? (
          <>
            <VotingPage
              setVoteresolution={setVoteresolution}
              voteresolution={voteresolution}
            />
          </>
        ) : viewattachmentpage ? (
          <>
            <ViewAttachments
              setViewattachmentpage={setViewattachmentpage}
              viewattachmentpage={viewattachmentpage}
            />
          </>
        ) : editresolutionPage ? (
          <>
            <EditResolution
              setEditResoutionPage={setEditResoutionPage}
              setNewresolution={setNewresolution}
              editresolutionPage={editresolutionPage}
            />
          </>
        ) : (
          <>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <Row>
                  <Col
                    lg={7}
                    md={12}
                    sm={12}
                    className=" d-flex justify-content-start align-items-center  gap-3 "
                  >
                    <span className={styles["Resolution-heading-size"]}>
                      {t("Resolution")}
                    </span>
                    <Button
                      className={styles["create-Resolution-btn"]}
                      text={t("Create-new-resolution")}
                      onClick={createresolution}
                    />
                    <Button
                      className={
                        getAll
                          ? styles["Resolution-All-btn_Active"]
                          : styles["Resolution-All-btn"]
                      }
                      text={t("All")}
                      onClick={allbtntable}
                    />
                    <Button
                      className={
                        closedbtntable
                          ? styles["Resolution-closed-btn_Active"]
                          : styles["Resolution-closed-btn"]
                      }
                      text={t("Closed")}
                      // onClick={viewresolutionpage}
                      onClick={buttonclosed}
                    />
                    <Button
                      className={
                        currentbtn
                          ? styles["Resolution-Current-btn_Active"]
                          : styles["Resolution-Current-btn"]
                      }
                      text={t("Current")}
                      onClick={currentbuttontable}
                    />
                  </Col>

                  <Col
                    lg={5}
                    md={12}
                    sm={12}
                    className=" d-flex justify-content-end  align-items-center resolution-search-input"
                  >
                    <TextField
                      width="455px"
                      name="Title"
                      placeholder={t("Search")}
                      labelClass="textFieldSearch d-none"
                      change={filterResolution}
                      // inputIcon={<img src={searchicon} />}
                      // clickIcon={openSearchBox}
                      // iconClassName={styles["Search_Icon"]}
                    />
                    <img
                      src={searchicon}
                      height="19px"
                      width="19px"
                      className={styles["Search_Icon"]}
                      onClick={openSearchBox}
                    />
                  </Col>
                  {searchIcon ? (
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["Search_Box_Main_Resolution_page"]}
                        >
                          <Row className="mt-0">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-end pe-4 "
                            >
                              <span>
                                <img
                                  src={Cross}
                                  height="16px"
                                  width="16px"
                                  onClick={closeSeachBar}
                                />
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12} className="pe-4">
                              <Row>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={6}
                                  className="CreateMeetingReminder  select-participant-box group-type-select-field "
                                >
                                  <SelectBox
                                    name="Participant"
                                    placeholder={t("Circulation-date")}
                                  />
                                </Col>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={6}
                                  className="CreateMeetingReminder  select-participant-box group-type-select-field"
                                >
                                  <SelectBox
                                    name="Participant"
                                    placeholder={t("Voting-deadline")}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="mt-4">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-end gap-3"
                            >
                              <Button
                                text={t("Reset")}
                                className={
                                  styles["ResetButton_SearchBar_Resolution"]
                                }
                                onClick={hideSearchOptions}
                              />
                              <Button
                                text={t("Search")}
                                className={
                                  styles["SearchButton_SearchBar_Resolution"]
                                }
                                onClick={showSearchOptions}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </>
                  ) : null}
                </Row>
              </Col>
            </Row>
            {searchResultsArea ? (
              <>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Search_results"]}>
                      {t("Search-results")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={3} md={3} sm={3}>
                    <Row>
                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        className="CreateMeetingReminder  select-participant-box"
                      >
                        <SelectBox
                          name="Participant"
                          placeholder={t("Circulation-date")}
                        />
                      </Col>
                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        className="CreateMeetingReminder  select-participant-box"
                      >
                        <SelectBox
                          name="Participant"
                          placeholder={t("Voting-deadline")}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            ) : null}
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <TableToDo
                  sortDirections={["descend", "ascend"]}
                  column={columnsToDo}
                  className="Resolution_table"
                  scroll={{ x: 500 }}
                  pagination={{
                    pageSize: 50,
                    showSizeChanger: true,
                    pageSizeOptions: ["100 ", "150", "200"],
                  }}
                  loading={{
                    indicator: (
                      <div className={styles["resolution_spinner"]}>
                        <Spin />
                      </div>
                    ),
                    spinning: ResolutionReducer.Loading,
                  }}
                  rows={rows}
                />
              </Col>
            </Row>
          </>
        )}
      </section>
      {resolutionmodalupdated ? (
        <ModalResolutionUpdated
          resolutionupdated={resolutionmodalupdated}
          setResolutionupdated={setRresolutionmodalupdated}
        />
      ) : null}
      {ResolutionReducer.Loading ? <Loader /> : null}
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </>
  );
};

export default Resolution;
