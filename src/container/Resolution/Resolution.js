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
import AbstainvoterIcon from "../../assets/images/resolutions/Abstainvoter_icon.svg";
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
  currentResolutionView,
  getResolutionbyResolutionID,
  getResolutionResult,
  getResolutions,
  getVotesDetails,
  getVoterResolution,
  currentClosedView,
} from "../../store/actions/Resolution_actions";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import {
  newTimeFormaterAsPerUTCFullDate,
  newTimeFormaterForResolutionAsPerUTCFullDate,
  resolutionResultTable,
  _justShowDateformat,
} from "../../commen/functions/date_formater";
import EditResolutionIcon from "../../assets/images/Edit_Resolution_Icon.svg";
import ResultResolutionIcon from "../../assets/images/Result_Resolution_Icon.svg";
import AttachmentIcon from "../../assets/images/resolutions/Attachment_Resolution.svg";
import moment from "moment";

const Resolution = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { ResolutionReducer } = useSelector((state) => state);
  const [newresolution, setNewresolution] = useState(false);
  const [viewresolution, setViewresolution] = useState(false);
  const [resultresolution, setResultresolution] = useState(false);
  const [voteresolution, setVoteresolution] = useState(false);
  const [closedbtntable, setClosedbtntable] = useState(false);
  const [currentbtn, setCurrentbtn] = useState(true);
  const [getAll, setGetAll] = useState(false);
  const [searchIcon, setSearchIcon] = useState(false);
  const [rows, setRows] = useState([]);
  const [isSearchVoter, setSearchVoter] = useState([]);
  const [resolutionmodalupdated, setRresolutionmodalupdated] = useState(false);
  const [resolutionAttachments, setResolutionAttachments] = useState([]);
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
    if (ResolutionReducer.currentResolutionView === 1) {
      dispatch(getResolutions(1, t));
      dispatch(currentClosedView(1));
    } else if (ResolutionReducer.currentResolutionView === 2) {
      dispatch(getVoterResolution(1, t));
    }
    dispatch(currentClosedView(1));
  };
  const allbtntable = () => {
    setClosedbtntable(false);
    setCurrentbtn(false);
    setGetAll(true);
    if (ResolutionReducer.currentResolutionView === 1) {
      dispatch(getResolutions(3, t));
      dispatch(currentClosedView(1));
    } else if (ResolutionReducer.currentResolutionView === 2) {
      dispatch(getVoterResolution(3, t));
      dispatch(currentClosedView(1));
    }
  };
  const createresolution = () => {
    setNewresolution(true);
  };

  const buttonclosed = () => {
    setClosedbtntable(true);
    setCurrentbtn(false);
    setGetAll(false);
    if (ResolutionReducer.currentResolutionView === 1) {
      dispatch(getResolutions(2, t));
      dispatch(currentClosedView(2));
    } else if (ResolutionReducer.currentResolutionView === 2) {
      dispatch(getVoterResolution(2, t));
      dispatch(currentClosedView(2));
    }
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

  const viewAttachmentHandle = (data) => {
    setViewattachmentpage(true);
    setResolutionAttachments(data);
  };
  // moderator all and current columns
  const columnsModerator = [
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
      width: "128px",
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
      width: "134px",
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
      width: "134px",
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
      width: "76px",
      render: (text, data) => {
        if (text === "Approved" || text === "Not Approved") {
          return <span className={styles["decision_Approved"]}>{text}</span>;
        } else {
          <span className={styles["decision_text"]}>{text}</span>;
        }
        //  return <span>{text}</span>
      },
    },
    // {
    //   title: t("Vote"),
    //   dataIndex: "isVoter",
    //   align: "Vote",
    //   key: "isVoter",
    //   width: "55px",
    //   render: (table, data) => {
    //     console.log(table, data, "VoteResolution");
    //     if (table) {
    //       return (
    //         <Button
    //           text="Vote"
    //           className={styles["Resolution-vote-btn"]}
    //           onClick={() => getVoteDetailHandler(data.resolutionID)}
    //         />
    //       );
    //     } else return;
    //   },
    // },
    {
      title: t("Vote-count"),
      dataIndex: "voteCount",
      align: "center",
      key: "voteCount",
      width: "110px",
      render: (text, data) => (
        <span className={styles["voterCountStyle"]}>{text}</span>
      ),
    },
    {
      title: t("Result"),
      dataIndex: "Result",
      align: "center",
      key: "Result",
      width: "78px",
      render: (table, data) => {
        let newDate = new Date().toString();
        let votingDeadline = resolutionResultTable(data.votingDeadline);
        console.log(
          "ResultResolution",
          votingDeadline,
          newDate,
          newDate > votingDeadline
        );
        if (newDate > votingDeadline) {
          return (
            <img
              src={ResultResolutionIcon}
              onClick={() => getResultHandle(data.resolutionID)}
              className={styles["Result_icon"]}
            />
          );
        } else {
          return (
            <img src={ResultResolutionIcon} className={styles["Result_icon"]} />
          );
        }
      },
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
      width: "78px",
      render: (table, data) => {
        if (
          data.resolutionStatus === "Circulated" ||
          data.resolutionStatus === "Closed"
        ) {
        } else {
          return (
            <img
              src={EditResolutionIcon}
              onClick={() => handleUpdateResolutionAction(data.resolutionID)}
              className={styles["Edit_Icon_moderator"]}
            />
          );
        }
      },
    },
  ];

  // moderator closed
  const columnsModeratorClosed = [
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
      width: "125px",
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
      width: "134px",
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
      width: "134px",
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
      width: "76px",
      render: (text, data) => {
        if (text === "Approved" || text === "Not Approved") {
          return <span className={styles["decision_Approved"]}>{text}</span>;
        } else {
          <span className={styles["decision_text"]}>{text}</span>;
        }
      },
    },
    // {
    //   title: t("Vote"),
    //   dataIndex: "isVoter",
    //   align: "Vote",
    //   key: "isVoter",
    //   width: "55px",
    //   render: (table, data) => {
    //     console.log(table, data, "VoteResolution");
    //     if (table === false) {
    //       return (
    //         <Button
    //           text="Vote"
    //           className={styles["Resolution-vote-btn"]}
    //           onClick={() => getVoteDetailHandler(data.resolutionID)}
    //         />
    //       );
    //     } else return;
    //   },
    // },
    {
      title: t("Vote-count"),
      dataIndex: "voteCount",
      align: "center",
      key: "voteCount",
      width: "110px",
    },
    {
      title: t("Result"),
      dataIndex: "Result",
      align: "center",
      key: "Result",
      width: "78px",
      render: (table, data) => {
        let newDate = new Date().toString();
        let votingDeadline = resolutionResultTable(data.votingDeadline);
        console.log(
          "ResultResolution",
          votingDeadline,
          newDate,
          newDate > votingDeadline
        );
        if (newDate > votingDeadline) {
          return (
            <img
              src={ResultResolutionIcon}
              onClick={() => getResultHandle(data.resolutionID)}
            />
          );
        } else {
          return (
            <img
              src={ResultResolutionIcon}
              // onClick={() => getResultHandle(data.resolutionID)}
            />
          );
        }
      },
    },
  ];

  // voters all and current columns
  const columnsvoters = [
    {
      title: t("Resolution-title"),
      dataIndex: "resolutionTitle",
      key: "resolutionTitle",
      width: "365px",
      sortDirections: ["descend", "ascend"],
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
      title: t("Voting-deadline"),
      dataIndex: "votingDeadline",
      key: "votingDeadline",
      align: "left",
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
      align: "left",
      width: "153px",
      render: (table, data) => {
        console.log(table, data, "checking");
        return (
          <span className={styles["resolution_date_Decision_date"]}>
            {_justShowDateformat(table)}
          </span>
        );
      },
    },
    {
      title: t("Voting-method"),
      dataIndex: "votingMethod",
      key: "votingMethod",
      width: "131px",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        return <span className={styles["voterCountStyle"]}>{text}</span>;
      },
    },
    {
      title: t("Attachment"),
      dataIndex: "Attachment",
      key: "Attachment",
      width: "104px",
      text: "center",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        if (data.isAttachmentAvailable) {
          return (
            <span className="d-flex justify-content-center">
              <img
                className="text-center"
                src={AttachmentIcon}
                onClick={() => viewAttachmentHandle(data.attachments)}
              />
            </span>
          );
        } else {
        }
      },
    },
    {
      title: t("Vote"),
      dataIndex: "isVoter",
      key: "isVoter",
      width: "120px",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        console.log(data, text, "checkvote");
        if (text === 1) {
          console.log(data, text, "checkvote");
          if (!data.isAlreadyVoted) {
            console.log(data.fK_VotingStatus_ID, "checkvote");
            if (data.fK_VotingStatus_ID === 1) {
              console.log(data.fK_VotingStatus_ID, "checkvote");

              return (
                <span className="d-flex justify-content-center">
                  <img src={thumbsup} />
                </span>
              );
            } else if (data.fK_VotingStatus_ID === 2) {
              console.log(data.fK_VotingStatus_ID, "checkvote");
              return (
                <span className="d-flex justify-content-center">
                  <img src={thumbsdown} />
                </span>
              );
            } else if (data.fK_VotingStatus_ID === 3) {
              console.log(data.fK_VotingStatus_ID, "checkvote");

              return (
                <Button
                  text={t("Vote")}
                  className={styles["Resolution-vote-btn"]}
                  onClick={() => getVoteDetailHandler(data.resolutionID)}
                />
              );
            } else if (data.fK_VotingStatus_ID === 4) {
              console.log(data.fK_VotingStatus_ID, "checkvote");

              return (
                <span className="d-flex justify-content-center">
                  <img src={AbstainvoterIcon} />
                </span>
              );
            }
          } else if (data.isAlreadyVoted === false) {
          }
        } else if (data.isVoter === 0) {
          return <p className="text-center"></p>;
        }
      },
    },
    {
      title: t("Decision"),
      dataIndex: "decision",
      key: "decision",
      width: "90px",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        if (text === "Approved" || text === "Not Approved") {
          return <span className={styles["decision_Approved"]}>{text}</span>;
        } else {
          <span className={styles["decision_text"]}>{text}</span>;
        }
      },
    },
  ];

  const resolutionTable = (viewID) => {
    dispatch(currentResolutionView(viewID))
    if(viewID === 1) {
      dispatch(getResolutions(1, t));
      dispatch(currentClosedView(1));
    } else {
      dispatch(getVoterResolution(1, t));
      dispatch(currentClosedView(1));
    }
  }
  // voters closed
  const columnsVotersClosed = [
    {
      title: t("Resolution-title"),
      dataIndex: "resolutionTitle",
      key: "resolutionTitle",
      width: "365px",
      sortDirections: ["descend", "ascend"],
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
      title: t("Voting-deadline"),
      dataIndex: "votingDeadline",
      key: "votingDeadline",
      align: "left",
      width: "155px",
      render: (text, data) => {
        return (
          <span className={styles["voterCountStyle"]}>
            {newTimeFormaterForResolutionAsPerUTCFullDate(text)}
          </span>
        );
      },
    },
    {
      title: t("Decision-date"),
      dataIndex: "decisionDate",
      key: "decisionDate",
      align: "left",
      width: "153px",
      render: (text, data) => {
        return (
          <span className={styles["voterCountStyle"]}>
            {_justShowDateformat(text)}
          </span>
        );
      },
    },
    {
      title: t("Voting-method"),
      dataIndex: "votingMethod",
      key: "votingMethod",
      width: "131px",
      align: "center",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        return <span className={styles["voterCountStyle"]}>{text}</span>;
      },
    },
    {
      title: t("Attachment"),
      dataIndex: "Attachment",
      key: "Attachment",
      width: "104px",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        console.log(data, "datadatadatadatadatadata");
        if (data.isAttachmentAvailable) {
          return <img src={AttachmentIcon} />;
        } else {
        }
      },
    },
    {
      title: t("Vote"),
      dataIndex: "isVoter",
      key: "isVoter",
      width: "120px",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        console.log(data, text, "checkvote");
        if (text === 1) {
          if (!data.isAlreadyVoted === true) {
            if (data.fK_VotingStatus_ID === 1) {
              return (
                <span className="d-flex justify-content-center">
                  <img src={thumbsup} />
                </span>
              );
            } else if (data.fK_VotingStatus_ID === 2) {
              return (
                <span className="d-flex justify-content-center">
                  <img src={thumbsdown} />
                </span>
              );
            } else if (data.fK_VotingStatus_ID === 3) {
              return (
                <Button
                  text={t("Vote")}
                  className={styles["Resolution-vote-btn"]}
                  onClick={() => getVoteDetailHandler(data.resolutionID)}
                />
              );
            } else if (data.fK_VotingStatus_ID === 4) {
              return (
                <span className="d-flex justify-content-center">
                  <img src={AbstainvoterIcon} />
                </span>
              );
            }
          } else if (data.isAlreadyVoted === false) {
          }
        } else if (text === 0) {
          return <p className="text-center"></p>;
        }
      },
    },
    {
      title: t("Decision"),
      dataIndex: "decision",
      key: "decision",
      width: "73px",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        if (text === "Approved" || text === "Not Approved") {
          return <span className={styles["decision_Approved"]}>{text}</span>;
        } else {
          <span className={styles["decision_text"]}>{text}</span>;
        }
        //  return <span>{text}</span>
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
    dispatch(getResolutions(1, t));
  }, []);

  useEffect(() => {
    if (ResolutionReducer.searchVoterResolution !== null) {
      setSearchVoter(ResolutionReducer.searchVoterResolution);
    } else {
      setSearchVoter([]);
    }
  }, [ResolutionReducer.searchVoterResolution]);

  useEffect(() => {
    if (ResolutionReducer.GetResolutions !== null) {
      setRows(ResolutionReducer.GetResolutions);
    } else {
      setRows([]);
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
              resolutionAttachments={resolutionAttachments}
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
                    className=" d-flex justify-content-end  align-items-center  Search-filed-resolution"
                  >
                    <TextField
                      width="455px"
                      name="Title"
                      placeholder={t("Search")}
                      labelClass="textFieldSearch d-none"
                      change={filterResolution}
                      applyClass={"resolution-search-input"}
                      // inputicon={<img src={searchicon} />}
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
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-end"
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
                          <Row className="mt-3 d-flex justify-content-start align-items-start ">
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className="CreateMeetingReminder searchBox-dropdowns-resolution "
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
                              className="CreateMeetingReminder  searchBox-dropdowns-resolution"
                            >
                              <SelectBox
                                name="Participant"
                                placeholder={t("Voting-deadline")}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-3">
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
            <Row>
              <Col sm={12} md={12} lg={12} className="d-flex gap-2">
                <Button
                  className={
                    ResolutionReducer.currentResolutionView === 1
                      ? styles["Resolution-All-btn_Active"]
                      : styles["Resolution-All-btn"]
                  }
                  text={t("Moderator")}
                  onClick={() => resolutionTable(1)}
                />
                <Button
                  className={
                    ResolutionReducer.currentResolutionView === 2
                      ? styles["Resolution-closed-btn_Active"]
                      : styles["Resolution-closed-btn"]
                  }
                  text={t("Voter")}
                  onClick={() => resolutionTable(2)}
                />
              </Col>
            </Row>
            {ResolutionReducer.currentResolutionView === 1 ? (
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  <TableToDo
                    sortDirections={["descend", "ascend"]}
                    column={
                      ResolutionReducer.resoultionClosed === 2
                        ? columnsModeratorClosed
                        : columnsModerator
                    }
                    className="Resolution_table"
                    scroll={{ y: 500 }}
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
            ) : ResolutionReducer.currentResolutionView === 2 ? (
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  <TableToDo
                    sortDirections={["descend", "ascend"]}
                    column={
                      ResolutionReducer.resoultionClosed === 2
                        ? columnsVotersClosed
                        : columnsvoters
                    }
                    className="Resolution_table"
                    scroll={{ y: 500 }}
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
                    rows={isSearchVoter}
                  />
                </Col>
              </Row>
            ) : null}
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
