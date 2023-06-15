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
import { Pagination } from 'antd'
import searchicon from "../../assets/images/searchicon.svg";
import plusbutton from "../../assets/images/Group 119.svg";
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
  cancelResolutionApi,
} from "../../store/actions/Resolution_actions";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import {
  editResolutionDate,
  newTimeFormaterAsPerUTCFullDate,
  newTimeFormaterForResolutionAsPerUTCFullDate,
  removeDashesFromDate,
  resolutionResultTable,
  _justShowDateformat,
} from "../../commen/functions/date_formater";
import EditResolutionIcon from "../../assets/images/Edit_Resolution_Icon.svg";
import ResultResolutionIcon from "../../assets/images/Result_Resolution_Icon.svg";
import AttachmentIcon from "../../assets/images/resolutions/Attachment_Resolution.svg";
import EmptyResolution from "../../assets/images/resolutions/Empty_Resolution.svg";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { XSquare } from 'react-bootstrap-icons'

const Resolution = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ResolutionReducer } = useSelector((state) => state);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResolution, setTotalResolution] = useState(0)
  const [currentPageVoter, setCurrentPageVoter] = useState(1)
  const [totalVoterResolution, setTotalVoterResolution] = useState(0)
  console.log(currentPage, totalResolution, "totalResolutiontotalResolutiontotalResolution")
  const [newresolution, setNewresolution] = useState(false);
  const [viewresolution, setViewresolution] = useState(false);
  const [resultresolution, setResultresolution] = useState(false);
  const [voteresolution, setVoteresolution] = useState(false);
  // const [closedbtntable, setClosedbtntable] = useState(false);
  // const [currentbtn, setCurrentbtn] = useState(true);
  // const [getAll, setGetAll] = useState(false);
  const [searchIcon, setSearchIcon] = useState(false);
  const [rows, setRows] = useState([]);
  const [isSearchVoter, setSearchVoter] = useState([]);
  const [resolutionmodalupdated, setRresolutionmodalupdated] = useState(false);
  const [resolutionAttachments, setResolutionAttachments] = useState([]);
  const [viewattachmentpage, setViewattachmentpage] = useState(false);
  const [editresolutionPage, setEditResoutionPage] = useState(false);
  const [searchResultsArea, setSearchResultsArea] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [allSearchInput, setAllSearchInput] = useState("");
  let resolutionView = JSON.parse(localStorage.getItem("resolutionView"));
  let voterView = JSON.parse(localStorage.getItem("voterResolutionView"));
  let moderatorPage = JSON.parse(localStorage.getItem("moderatorPage"));
  let moderatorRows = JSON.parse(localStorage.getItem("moderatorRows"));
  let voterPage = JSON.parse(localStorage.getItem("voterPage"));
  let voterRows = JSON.parse(localStorage.getItem("voterRows"));
  let CurrentBtn = JSON.parse(localStorage.getItem("CurrentBtn"));
  let AllBtn = JSON.parse(localStorage.getItem("AllBtn"));
  let CloseBtn = JSON.parse(localStorage.getItem("CloseBtn"));
  console.log(resolutionView, "voterViewvoterViewvoterView")
  console.log(voterView, "voterViewvoterViewvoterView")
  console.log(moderatorPage, "voterViewvoterViewvoterView")
  console.log(moderatorRows, "voterViewvoterViewvoterView")
  console.log(voterPage, "voterViewvoterViewvoterView")
  console.log(voterRows, "voterViewvoterViewvoterView")
  console.log(CurrentBtn, "voterViewvoterViewvoterView")
  console.log(AllBtn, "voterViewvoterViewvoterView")
  console.log(CloseBtn, "voterViewvoterViewvoterView")

  const [searchModalDates, setSearchModalDates] = useState({
    circulationDate: "",
    votingDate: "",
  });
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const showSearchOptions = () => {
    if (ResolutionReducer.currentResolutionView === 1) {
      let moderatordata = [...ResolutionReducer.GetResolutions];
      let data = moderatordata.filter((a) => {
        console.log(
          removeDashesFromDate(editResolutionDate(a.circulationDate)) ===
          removeDashesFromDate(
            editResolutionDate(searchModalDates.circulationDate)
          ),
          "datadatadatadata"
        );
        // console.log(a, "datadatadatadata")
        // console.log(removeDashesFromDate(
        //   editResolutionDate(a.circulationDate)), "datadatadatadata")
        return (
          (searchModalDates.circulationDate != "" &&
            searchModalDates.votingDate != ""
            ? removeDashesFromDate(editResolutionDate(a.circulationDate)) ===
            removeDashesFromDate(
              editResolutionDate(searchModalDates.circulationDate)
            ) &&
            removeDashesFromDate(editResolutionDate(a.votingDeadline)) ===
            removeDashesFromDate(
              editResolutionDate(searchModalDates.votingDate)
            )
            : a) &&
          (searchModalDates.circulationDate != "" &&
            searchModalDates.votingDate === ""
            ? removeDashesFromDate(editResolutionDate(a.circulationDate)) ===
            removeDashesFromDate(
              editResolutionDate(searchModalDates.circulationDate)
            )
            : removeDashesFromDate(editResolutionDate(a.circulationDate))) &&
          (searchModalDates.votingDate != "" &&
            searchModalDates.circulationDate === ""
            ? removeDashesFromDate(editResolutionDate(a.votingDeadline)) ===
            removeDashesFromDate(
              editResolutionDate(searchModalDates.votingDate)
            )
            : removeDashesFromDate(editResolutionDate(a.votingDeadline)))
        );
      });
      console.log(data, "datadatadatadata");
      setRows(data);
      setSearchIcon(false);
    } else if (ResolutionReducer.currentResolutionView === 2) {
      let voterData = [...ResolutionReducer.searchVoterResolution];
      let data = voterData.filter((a) => {
        console.log(
          removeDashesFromDate(editResolutionDate(a.decisionDate)) ===
          removeDashesFromDate(
            editResolutionDate(searchModalDates.circulationDate)
          ),
          "datadatadatadata"
        );
        console.log(a, "datadatadatadata");
        console.log(
          removeDashesFromDate(editResolutionDate(a.decisionDate)),
          "datadatadatadata"
        );
        return (
          (searchModalDates.circulationDate != "" &&
            searchModalDates.votingDate != ""
            ? removeDashesFromDate(editResolutionDate(a.decisionDate)) ===
            removeDashesFromDate(
              editResolutionDate(searchModalDates.circulationDate)
            ) &&
            removeDashesFromDate(editResolutionDate(a.votingDeadline)) ===
            removeDashesFromDate(
              editResolutionDate(searchModalDates.votingDate)
            )
            : a) &&
          (searchModalDates.circulationDate != "" &&
            searchModalDates.votingDate === ""
            ? removeDashesFromDate(editResolutionDate(a.decisionDate)) ===
            removeDashesFromDate(
              editResolutionDate(searchModalDates.circulationDate)
            )
            : removeDashesFromDate(editResolutionDate(a.decisionDate))) &&
          (searchModalDates.votingDate != "" &&
            searchModalDates.circulationDate === ""
            ? removeDashesFromDate(editResolutionDate(a.votingDeadline)) ===
            removeDashesFromDate(
              editResolutionDate(searchModalDates.votingDate)
            )
            : removeDashesFromDate(editResolutionDate(a.votingDeadline)))
        );
      });
      console.log(data, "datadatadatadata");
      setSearchIcon(false);
      setSearchVoter(data);
    }
  };

  const hideSearchOptions = () => {
    setSearchModalDates({
      circulationDate: "",
      votingDate: "",
    });
    setAllSearchInput("");
    setSearchResultsArea(false);
    setSearchIcon(false);
    let moderatordata = [...ResolutionReducer.GetResolutions];
    setRows(moderatordata);
    let voterData = [...ResolutionReducer.searchVoterResolution];
    setSearchVoter(voterData);
  };

  const closeSeachBar = () => {
    setSearchIcon(false);
  };

  const openSearchBox = () => {
    setAllSearchInput("");
    setSearchModalDates({
      circulationDate: "",
      votingDate: "",
    });
    setSearchIcon(true);

    let moderatordata = [...ResolutionReducer.GetResolutions];
    setRows(moderatordata);
    let voterData = [...ResolutionReducer.searchVoterResolution];
    setSearchVoter(voterData);
  };

  const currentbuttontable = () => {
    localStorage.setItem("CurrentBtn", 1);
    localStorage.removeItem("AllBtn");
    localStorage.removeItem("CloseBtn");
    setAllSearchInput("");
    setSearchIcon(false);
    if (resolutionView !== null && resolutionView === 1) {
      if (moderatorPage !== null && moderatorRows !== null) {
        dispatch(getResolutions(navigate, 1, t));
        // dispatch(currentClosedView(1));
      }
    } else if (voterView !== null && voterView === 2) {
      if (voterPage !== null && voterRows !== null) {
        dispatch(getVoterResolution(navigate, 1, t));
      }
    }
    // dispatch(currentClosedView(1));
  };

  const allbtntable = () => {
    localStorage.setItem("AllBtn", 3);
    localStorage.removeItem("CloseBtn");
    localStorage.removeItem("CurrentBtn");
    setAllSearchInput("");
    setSearchIcon(false);
    if (resolutionView !== null && resolutionView === 1) {
      dispatch(getResolutions(navigate, 3, t));
      // dispatch(currentClosedView(1));
    } else if (voterView !== null && voterView === 2) {
      dispatch(getVoterResolution(navigate, 3, t));
      // dispatch(currentClosedView(1));
    }
  };

  const buttonclosed = () => {
    localStorage.setItem("CloseBtn", 2);
    localStorage.removeItem("AllBtn");
    localStorage.removeItem("CurrentBtn");
    setAllSearchInput("");
    setSearchIcon(false);
    if (resolutionView !== null && resolutionView === 1) {
      dispatch(getResolutions(navigate, 2, t));
    } else if (voterView !== null && voterView === 2) {
      dispatch(getVoterResolution(navigate, 2, t));
    }
  };

  const createresolution = () => {
    setAllSearchInput("");
    setSearchModalDates({
      circulationDate: "",
      votingDate: "",
    });
    setSearchIcon(false);
    setNewresolution(true);
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
        navigate,
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
        navigate,
        id,
        t,
        setEditResoutionPage,
        setViewresolution,
        2
      )
    );
  };

  const getResultHandle = (id) => {
    dispatch(getResolutionResult(navigate, id, t, setResultresolution));
  };

  const getVoteDetailHandler = (id) => {
    dispatch(getVotesDetails(navigate, id, t, setVoteresolution));
  };

  const filterResolution = (e) => {
    let value = e.target.value;
    setAllSearchInput(value);
    console.log(
      ResolutionReducer.currentResolutionView,
      value,
      "moderatorDatamoderatorDatamoderatorDatavalue"
    );
    if (voterView !== null && voterView === 2) {
      let y = [...ResolutionReducer.searchVoterResolution];
      if (value != "") {
        let x = y.filter((a) => {
          console.log(a, "moderatorDatamoderatorDatamoderatorDatavalue");
          return (
            (value != ""
              ? a.resolutionTitle.toLowerCase().includes(value.toLowerCase())
              : a.resolutionTitle) ||
            (value != ""
              ? a.votingMethod.toLowerCase().includes(value.toLowerCase())
              : a.votingMethod) ||
            (value != ""
              ? a.decision.toLowerCase().includes(value.toLowerCase())
              : a.decision)
          );
        });
        setSearchVoter(x);
      } else {
        setSearchVoter(ResolutionReducer.searchVoterResolution);
      }
    } else if (resolutionView !== null && resolutionView === 1) {
      // isSearchVoter
      let moderatordata = [...ResolutionReducer.GetResolutions];
      console.log(
        moderatordata,
        "moderatorDatamoderatorDatamoderatorDatavalue"
      );
      if (value != "") {
        let x = moderatordata.filter((a) => {
          console.log(a, "moderatorDatamoderatorDatamoderatorDatavalue");
          return (
            (value != ""
              ? a.resolutionTitle.toLowerCase().includes(value.toLowerCase())
              : a.resolutionTitle) ||
            (value != ""
              ? a.decision.toLowerCase().includes(value.toLowerCase())
              : a.decision)
          );
        });
        setRows(x);
      } else {
        setRows(ResolutionReducer.GetResolutions);
      }
    }
    console.log(
      e.target.value,
      "filterResolutionfilterResolutionfilterResolutionfilterResolution"
    );
  };

  const changeSearchDateHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setSearchModalDates({
      ...searchModalDates,
      [name]: value,
    });
    console.log(
      searchModalDates,
      name,
      value,
      "searchModalDatessearchModalDates"
    );
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
          return <span className={styles["decision_text"]}>{text}</span>;
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
        let newDate = new Date();
        let votingDeadline = resolutionResultTable(data.votingDeadline);
        console.log(
          "ResultResolution",
          votingDeadline,
          newDate,
          data,
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
      title: "",
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
      width: "78px",
      render: (table, data) => {
        if (data.resolutionStatus === "Closed") {
        } else if (data.resolutionStatus === "Circulated") {
          return <span className={styles["Edit_Icon_moderator"]}><XSquare className="cursor-pointer" width={22} height={22} onClick={() => dispatch(cancelResolutionApi(navigate, data.resolutionID, t, setEditResoutionPage))} /></span>
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
      width: "140px",
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
      width: "140px",
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
      width: "140px",
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
          <span className={styles["decision_text_Moderator_closed"]}>
            {text}
          </span>;
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
      render: (text, data) => {
        return (
          <span className="d-flex justify-content-center Saved_money_Tagline ">
            {text}
          </span>
        );
      },
    },
    {
      title: t("Result"),
      dataIndex: "Result",
      align: "center",
      key: "Result",
      width: "78px",
      render: (table, data) => {
        let newDate = new Date();
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
              className={styles["Result_Icon_cursor_pointer"]}
              src={ResultResolutionIcon}
              onClick={() => getResultHandle(data.resolutionID)}
            />
          );
        } else {
          return (
            <img
              className={styles["Result_Icon_cursor_pointer"]}
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
                className="text-center cursor-pointer"
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
    // dispatch(currentResolutionView(viewID));
    setAllSearchInput("");
    setSearchModalDates({
      circulationDate: "",
      votingDate: "",
    });
    setSearchIcon(false);
    if (viewID === 1) {
      localStorage.setItem("resolutionView", 1)
      localStorage.removeItem("voterResolutionView");
      if (AllBtn !== null && AllBtn === 3) {
        dispatch(getResolutions(navigate, 3, t))
      } else if (CurrentBtn !== null && CurrentBtn === 1) {
        dispatch(getResolutions(navigate, 1, t))
      } else if (CloseBtn !== null && CloseBtn === 2) {
        dispatch(getResolutions(navigate, 2, t))
      }
      // dispatch(getResolutions(navigate, 1, t));
      // dispatch(currentClosedView(1));
    } else {
      localStorage.setItem("voterResolutionView", 2)
      localStorage.removeItem("resolutionView")
      if (AllBtn !== null && AllBtn === 3) {
        dispatch(getVoterResolution(navigate, 3, t))
      } else if (CurrentBtn !== null && CurrentBtn === 1) {
        dispatch(getVoterResolution(navigate, 1, t))
      } else if (CloseBtn !== null && CloseBtn === 2) {
        dispatch(getVoterResolution(navigate, 2, t))
      }
      // dispatch(currentClosedView(1));
    }
  };

  // voters closed
  const columnsVotersClosed = [
    {
      title: t("Resolution-title"),
      dataIndex: "resolutionTitle",
      key: "resolutionTitle",
      width: "350px",
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
      width: "120px",
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
      width: "90px",
      align: "center",
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

  // change resoltion moderator pagination
  const handleChangeResolutionPagination = async (current, pageSize) => {
    await localStorage.setItem("moderatorPage", current)
    await localStorage.setItem("moderatorRows", pageSize)
    if (AllBtn !== null && AllBtn === 3) {
      dispatch(getResolutions(navigate, 3, t))
    } else if (CurrentBtn !== null && CurrentBtn === 1) {
      dispatch(getResolutions(navigate, 1, t))
    } else if (CloseBtn !== null && CloseBtn === 2) {
      dispatch(getResolutions(navigate, 2, t))
    }
  }

  // change resolution voter pagination
  const handleChangeVoterResolutionPagination = async (current, pageSize) => {
    await localStorage.setItem("voterPage", current)
    await localStorage.setItem("voterRows", pageSize)
    if (AllBtn !== null && AllBtn === 3) {
      dispatch(getVoterResolution(navigate, 3, t))
    } else if (CurrentBtn !== null && CurrentBtn === 1) {
      dispatch(getVoterResolution(navigate, 1, t))
    } else if (CloseBtn !== null && CloseBtn === 2) {
      dispatch(getVoterResolution(navigate, 2, t))
    }
  }

  // Resolution reducer ResponseMessage
  useEffect(() => {
    if (ResolutionReducer.ResponseMessage !== "" && ResolutionReducer.ResponseMessage !== t("Data-available") && ResolutionReducer.ResponseMessage !== t("No-data-available")) {
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

  // call resolution
  useEffect(() => {
    localStorage.setItem("moderatorPage", 1)
    localStorage.setItem("moderatorRows", 50)
    localStorage.setItem("voterPage", 1)
    localStorage.setItem("voterRows", 50)
    localStorage.setItem("resolutionView", 1);
    localStorage.setItem("CurrentBtn", 1);
    localStorage.removeItem("voterResolutionView")
    localStorage.removeItem("AllBtn");
    localStorage.removeItem("CloseBtn");
    dispatch(getResolutions(navigate, 1, t));
  }, []);

  // voter resolution state manage
  useEffect(() => {
    if (ResolutionReducer.searchVoterResolution !== null) {
      setSearchVoter(ResolutionReducer.searchVoterResolution.resolutionTable);
      setTotalVoterResolution(ResolutionReducer.searchVoterResolution.totalRecords)
      setCurrentPageVoter(ResolutionReducer.searchVoterResolution.pageNumbers)
    } else {
      setSearchVoter([]);
    }
  }, [ResolutionReducer.searchVoterResolution]);

  // moderator resolution state manage
  useEffect(() => {
    if (ResolutionReducer.GetResolutions !== null) {
      setCurrentPage(ResolutionReducer.GetResolutions.pageNumbers)
      setTotalResolution(ResolutionReducer.GetResolutions.totalRecords)
      setRows(ResolutionReducer.GetResolutions.resolutionTable);
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
                      text={
                        <span className={styles["Btn_create_text"]}>
                          {t("Create-new-resolution")}
                        </span>
                      }
                      icon={
                        <img
                          src={plusbutton}
                          height="7.6px"
                          width="7.6px"
                          className="align-items-center"
                        />
                      }
                      onClick={createresolution}
                    />
                    <Button
                      className={
                        AllBtn !== null && AllBtn === 3
                          ? styles["Resolution-All-btn_Active"]
                          : styles["Resolution-All-btn"]
                      }
                      text={t("All")}
                      onClick={allbtntable}
                    />
                    <Button
                      className={
                        CloseBtn !== null && CloseBtn === 2
                          ? styles["Resolution-closed-btn_Active"]
                          : styles["Resolution-closed-btn"]
                      }
                      text={t("Closed")}
                      onClick={buttonclosed}
                    />
                    <Button
                      className={
                        CurrentBtn !== null && CurrentBtn === 1
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
                    <span>
                      <TextField
                        width="455px"
                        name="Title"
                        placeholder={t("Search")}
                        labelClass="textFieldSearch d-none"
                        change={filterResolution}
                        applyClass={"resolution-search-input"}
                        value={allSearchInput}
                        iconClassName={styles["Search_Icon"]}
                        inputicon={<img src={searchicon} />}
                        clickIcon={openSearchBox}
                      />
                      {/* <SearchInputSuggestion /> */}

                      {/* {searchIcon ? (
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
                                  <span className="position-relative">
                                    <img
                                      src={Cross}
                                      height="16px"
                                      className={styles["searchBox_CrossIcon"]}
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
                                  className="CreateMeetingReminder searchBox-dropdowns-resolution FontArabicRegular "
                                >
                                  <TextField
                                    label={
                                      ResolutionReducer.currentResolutionView === 2
                                        ? t("Decision-date")
                                        : t("Circulation-date")
                                    }
                                    type="date"
                                    name="circulationDate"
                                    change={changeSearchDateHandler}
                                  />
                                </Col>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={6}
                                  className="CreateMeetingReminder  searchBox-dropdowns-resolution FontArabicRegular"
                                >
                                  <TextField
                                    label={t("Voting-deadline")}
                                    type="date"
                                    name="votingDate"
                                    change={changeSearchDateHandler}
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
                      ) : null} */}
                    </span>
                  </Col>

                  {/* {searchIcon ? (
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
                              className="CreateMeetingReminder searchBox-dropdowns-resolution FontArabicRegular "
                            >
                              <TextField
                                label={
                                  ResolutionReducer.currentResolutionView === 2
                                    ? t("Decision-date")
                                    : t("Circulation-date")
                                }
                                type="date"
                                name="circulationDate"
                                change={changeSearchDateHandler}
                              />
                            </Col>
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className="CreateMeetingReminder  searchBox-dropdowns-resolution FontArabicRegular"
                            >
                              <TextField
                                label={t("Voting-deadline")}
                                type="date"
                                name="votingDate"
                                change={changeSearchDateHandler}
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
                  ) : null} */}
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
                        className="CreateMeetingReminder Atteendees-organizer-participant "
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
                        className="CreateMeetingReminder Atteendees-organizer-participant"
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
              <Col sm={12} md={12} lg={12} className="d-flex gap-2">
                <Button
                  className={
                    resolutionView !== null && resolutionView === 1
                      ? styles["Resolution-moderator-btn_Active"]
                      : styles["Resolution-moderator-btn"]
                  }
                  text={t("Moderator")}
                  onClick={() => resolutionTable(1)}
                />
                <Button
                  className={
                    voterView !== null && voterView === 2
                      ? styles["Resolution-closed-btn_Active"]
                      : styles["Resolution-closed-btn"]
                  }
                  text={t("Voter")}
                  onClick={() => resolutionTable(2)}
                />
              </Col>
            </Row>
            {resolutionView !== null && resolutionView === 1 ? (
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  {rows !== null && rows !== undefined && rows.length > 0 ? (
                    <>
                      <TableToDo
                        sortDirections={["descend", "ascend"]}
                        column={
                          CloseBtn !== null && CloseBtn === 2
                            ? columnsModeratorClosed
                            : columnsModerator
                        }
                        className="Resolution_table"
                        scroll={{ y: "53vh" }}
                        pagination={false}
                        // pagination={{
                        //   pageSize: 50,
                        //   showSizeChanger: true,
                        //   pageSizeOptions: ["100 ", "150", "200"],
                        // }}
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
                      <Row>
                        <Col sm={12} md={12} lg={12} className="d-flex justify-content-center my-3 pagination-groups-table">
                          <Pagination
                            current={currentPage}
                            total={totalResolution}
                            className={styles["PaginationStyle-Resolution"]}
                            onChange={handleChangeResolutionPagination}
                          />
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className={styles["empty_Resolutions"]}
                      >
                        <img src={EmptyResolution} />
                        <h2 className={styles["NoResolutionHeading"]}>
                          {t("No-resolution-to-display")}
                        </h2>
                        <p className={styles["NoResolution_Tagline"]}>
                          {t("Planning-to-get-a-thought-on-something?")}
                        </p>
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            ) : voterView !== null && voterView === 2 ? (
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  {isSearchVoter !== null && isSearchVoter !== undefined && isSearchVoter.length > 0 ? (
                    <>
                      <TableToDo
                        sortDirections={["descend", "ascend"]}
                        column={
                          CloseBtn !== null && CloseBtn === 2
                            ? columnsVotersClosed
                            : columnsvoters
                        }
                        className="Resolution_table"
                        scroll={{ y: "53vh" }}
                        pagination={false}
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
                      <Row>
                        <Col sm={12} md={12} lg={12} className="d-flex justify-content-center my-3 pagination-groups-table">
                          <Pagination
                            current={currentPageVoter}
                            total={totalVoterResolution}
                            className={styles["PaginationStyle-Resolution"]}
                            selectComponentClass={"pagination_resolution"}
                            onChange={handleChangeVoterResolutionPagination}
                          />
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className={styles["empty_Resolutions"]}
                      >
                        <img src={EmptyResolution} />
                        <h2 className={styles["NoResolutionHeading"]}>
                          {t("No-resolution-to-display")}
                        </h2>
                        <p className={styles["NoResolution_Tagline"]}>
                          {t("Planning-to-get-a-thought-on-something?")}
                        </p>
                      </Col>
                    </Row>
                  )}
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
