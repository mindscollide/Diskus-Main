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
import SearchInputSuggestion from "../../components/elements/searchInputResolution/searchInputsuggestion";
import numeral from "numeral";
import ModalCancellResolution from "../ModalCancellResolution/ModalCancellResolution";

const Resolution = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ResolutionReducer } = useSelector((state) => state);
  const [resolutionID, setResolutionID] = useState(0)
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [totalResolution, setTotalResolution] = useState(0)
  const [currentPageVoter, setCurrentPageVoter] = useState(1)
  const [totalVoterResolution, setTotalVoterResolution] = useState(0)
  const [newresolution, setNewresolution] = useState(false);
  let currentLanguage = localStorage.getItem("i18nextLng");
  moment.locale(currentLanguage)
  const [viewresolution, setViewresolution] = useState(false);
  const [resultresolution, setResultresolution] = useState(false);
  const [voteresolution, setVoteresolution] = useState(false);
  const [voterID, setVoterID] = useState(0);
  const [searchIcon, setSearchIcon] = useState(false);
  const [rows, setRows] = useState([]);
  const [isSearchVoter, setSearchVoter] = useState([]);
  const [resolutionmodalupdated, setRresolutionmodalupdated] = useState(false);
  const [resolutionAttachments, setResolutionAttachments] = useState([]);
  const [viewattachmentpage, setViewattachmentpage] = useState(false);
  const [editresolutionPage, setEditResoutionPage] = useState(false);
  const [searchResultsArea, setSearchResultsArea] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [cancelResolutionModal, setCancelResolutionModal] = useState(false)
  const [allSearchInput, setAllSearchInput] = useState("");
  let resolutionView = JSON.parse(localStorage.getItem("resolutionView"));
  let moderatorPage = localStorage.getItem("moderatorPage");
  let moderatorRows = localStorage.getItem("moderatorRows");
  let voterPage = JSON.parse(localStorage.getItem("voterPage"));
  let voterRows = localStorage.getItem("voterRows");
  let buttonTab = JSON.parse(localStorage.getItem("ButtonTab"))


  // call resolution
  useEffect(() => {
    try {
      if (resolutionView === 1 && buttonTab !== null) {
        dispatch(getResolutions(navigate, buttonTab, t));
        localStorage.setItem("resolutionView", resolutionView);
        localStorage.setItem("ButtonTab", buttonTab);
      } else if (resolutionView === 2 && buttonTab !== null) {
        localStorage.setItem("resolutionView", resolutionView);
        localStorage.setItem("ButtonTab", buttonTab);
        dispatch(getVoterResolution(navigate, buttonTab, t))
      } else {
        localStorage.setItem("moderatorPage", 1)
        localStorage.setItem("moderatorRows", 50)
        localStorage.setItem("voterPage", 1)
        localStorage.setItem("voterRows", 50)
        localStorage.setItem("resolutionView", 1);
        localStorage.setItem("ButtonTab", 1);
        dispatch(getResolutions(navigate, 1, t));
      }
    } catch { }

    return () => {
      localStorage.removeItem("moderatorPage")
      localStorage.removeItem("moderatorRows")
      localStorage.removeItem("voterPage")
      localStorage.removeItem("voterRows")
      localStorage.removeItem("resolutionView")
      localStorage.removeItem("ButtonTab")
      localStorage.removeItem("ResolutionID")
    }
  }, []);


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
    localStorage.setItem("ButtonTab", 1);
    setAllSearchInput("");
    setSearchIcon(false);
    if (resolutionView !== null && resolutionView === 1) {
      if (moderatorPage !== null && moderatorRows !== null) {
        dispatch(getResolutions(navigate, 1, t));
      }
    } else if (resolutionView !== null && resolutionView === 2) {
      if (voterPage !== null && voterRows !== null) {
        dispatch(getVoterResolution(navigate, 1, t));
      }
    }
  };

  const allbtntable = () => {
    localStorage.setItem("ButtonTab", 3);
    setAllSearchInput("");
    setSearchIcon(false);
    if (resolutionView !== null && resolutionView === 1) {
      dispatch(getResolutions(navigate, 3, t));
    } else if (resolutionView !== null && resolutionView === 2) {
      dispatch(getVoterResolution(navigate, 3, t));
    }
  };

  const buttonclosed = () => {
    localStorage.setItem("ButtonTab", 2);
    setAllSearchInput("");
    setSearchIcon(false);
    if (resolutionView !== null && resolutionView === 1) {
      dispatch(getResolutions(navigate, 2, t));
    } else if (resolutionView !== null && resolutionView === 2) {
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

  const getVoteDetailHandler = (id, data) => {
    dispatch(getVotesDetails(navigate, id, t, setVoteresolution));
    setVoterID(data.voterID)
  };

  const filterResolution = (e) => {
    let value = e.target.value;
    setAllSearchInput(value);
    console.log(
      ResolutionReducer.currentResolutionView,
      value,
      "moderatorDatamoderatorDatamoderatorDatavalue"
    );
    if (resolutionView !== null && resolutionView === 2) {
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

  const handleClickCancelModal = (id) => {
    setResolutionID(id)
    setCancelResolutionModal(true)

  }

  const handleClickCancelResolution = () => {
    if (resolutionID !== 0) {
      dispatch(cancelResolutionApi(navigate, resolutionID, t, setEditResoutionPage, setCancelResolutionModal))
    }
  }

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
        console.log(text, "texttexttexttexttext")
        if (text === "Approved") {
          return <span className={styles["decision_Approved"]}>{text}</span>;
        } else if (text === "Not Approved") {
          return <span className={styles["decision_non_Approved"]}>{text}</span>;
        } else if (text === "Pending") {
          return <span className={styles["decision_text_Pending"]}>{text}</span>;
        } else {
          return <span className={styles["decision_text_Pending"]}>{text}</span>;
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
        if (data.resolutionStatus === "Circulated") {
          if (votingDeadline < newDate) {
            return (
              <img
                src={ResultResolutionIcon}
                onClick={() => getResultHandle(data.resolutionID)}
                className={styles["Result_icon"]}
              />
            );
          } else {
            return "";
          }
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
          return <span className={styles["Edit_Icon_moderator"]}><XSquare className="cursor-pointer" width={22} height={22} onClick={() => {
            handleClickCancelModal(data.resolutionID)
            // dispatch(cancelResolutionApi(navigate, data.resolutionID, t, setEditResoutionPage))
          }
          } /></span>
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
        if (text === "Approved") {
          return <span className={styles["decision_Approved"]}>{text}</span>;
        } else if (text === "Not Approved") {
          return <span className={styles["decision_non_Approved"]}>{text}</span>;
        } else {
          <span className={styles["decision_text_Pending"]}>{text}</span>;
        }
      },
    },
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
        if (votingDeadline < newDate) {
          return (
            <img
              className={styles["Result_Icon_cursor_pointer"]}
              src={ResultResolutionIcon}
              onClick={() => getResultHandle(data.resolutionID)}
            />
          );
        } else {
          return ""
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
        console.log(data, text, "checkvotevote");
        console.log(data, "checkvotevote2");
        if (data.resolutionStatusID === 2) {
          if (data.isVoter === 1) {
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
                  onClick={() => getVoteDetailHandler(data.resolutionID, data)}
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
          } else {
            return <p className="text-center"></p>;
          }
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
        if (text === "Approved") {
          return <span className={styles["decision_Approved"]}>{text}</span>;
        } else if (text === "Not Approved") {
          return <span className={styles["decision_non_Approved"]}>{text}</span>;
        } else {
          <span className={styles["decision_text_Pending"]}>{text}</span>;
        }
      },
    },
  ];

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
          return <img className="text-center cursor-pointer"
            src={AttachmentIcon}
            onClick={() => viewAttachmentHandle(data.attachments)} />;
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
        if (data.resolutionStatusID === 3) {
          if (data.isVoter === 1) {
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
              return <p className="text-center"></p>;
            } else if (data.fK_VotingStatus_ID === 4) {
              console.log(data.fK_VotingStatus_ID, "checkvote");

              return (
                <span className="d-flex justify-content-center">
                  <img src={AbstainvoterIcon} />
                </span>
              );
            }
          } else {
            return <p className="text-center"></p>;
          }
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

  // resolution view
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
      if (buttonTab !== null && buttonTab === 3) {
        dispatch(getResolutions(navigate, 3, t))
      } else if (buttonTab !== null && buttonTab === 1) {
        dispatch(getResolutions(navigate, 1, t))
      } else if (buttonTab !== null && buttonTab === 2) {
        dispatch(getResolutions(navigate, 2, t))
      }
      // dispatch(getResolutions(navigate, 1, t));
      // dispatch(currentClosedView(1));
    } else {
      localStorage.setItem("resolutionView", 2)
      if (buttonTab !== null && buttonTab === 3) {
        dispatch(getVoterResolution(navigate, 3, t))
      } else if (buttonTab !== null && buttonTab === 1) {
        dispatch(getVoterResolution(navigate, 1, t))
      } else if (buttonTab !== null && buttonTab === 2) {
        dispatch(getVoterResolution(navigate, 2, t))
      }
      // dispatch(currentClosedView(1));
    }
  };

  // change resoltion moderator pagination
  const handleChangeResolutionPagination = async (current, pageSize) => {
    console.log(current, pageSize, "handleChangeResolutionPagination")
    await localStorage.setItem("moderatorPage", current)
    await localStorage.setItem("moderatorRows", pageSize)
    if (buttonTab !== null && buttonTab === 3) {
      dispatch(getResolutions(navigate, 3, t))
    } else if (buttonTab !== null && buttonTab === 1) {
      dispatch(getResolutions(navigate, 1, t))
    } else if (buttonTab !== null && buttonTab === 2) {
      dispatch(getResolutions(navigate, 2, t))
    }
  }

  // change resolution voter pagination
  const handleChangeVoterResolutionPagination = async (current, pageSize) => {
    await localStorage.setItem("voterPage", current)
    await localStorage.setItem("voterRows", pageSize)
    if (buttonTab !== null && buttonTab === 3) {
      dispatch(getVoterResolution(navigate, 3, t))
    } else if (buttonTab !== null && buttonTab === 1) {
      dispatch(getVoterResolution(navigate, 1, t))
    } else if (buttonTab !== null && buttonTab === 2) {
      dispatch(getVoterResolution(navigate, 2, t))
    }
  }

  // Resolution reducer ResponseMessage
  useEffect(() => {
    console.log(ResolutionReducer, "ResolutionReducerResolutionReducerResolutionReducerResolutionReducer")
    if (ResolutionReducer.ResponseMessage !== "" && ResolutionReducer.ResponseMessage !== t("Data-available") && ResolutionReducer.ResponseMessage !== t("No-data-available") && ResolutionReducer.ResponseMessage !== undefined) {
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
      // setCurrentPage(ResolutionReducer.GetResolutions.pageNumbers)
      setTotalResolution(ResolutionReducer.GetResolutions.totalRecords)
      setRows(ResolutionReducer.GetResolutions.resolutionTable);
    } else {
      setRows([]);
    }
  }, [ResolutionReducer.GetResolutions]);

  const formatNumber = (value) => {
    return numeral(value).format();
  }
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
              voterID={voterID}
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
              setCancelResolutionModal={setCancelResolutionModal}
            />
          </>
        ) : (
          <>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <Row>
                  <Col
                    lg={7}
                    md={7}
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
                        buttonTab !== null && buttonTab === 3
                          ? styles["Resolution-All-btn_Active"]
                          : styles["Resolution-All-btn"]
                      }
                      text={t("All")}
                      onClick={allbtntable}
                    />
                    <Button
                      className={
                        buttonTab !== null && buttonTab === 2
                          ? styles["Resolution-closed-btn_Active"]
                          : styles["Resolution-closed-btn"]
                      }
                      text={t("Closed")}
                      onClick={buttonclosed}
                    />
                    <Button
                      className={
                        buttonTab !== null && buttonTab === 1
                          ? styles["Resolution-Current-btn_Active"]
                          : styles["Resolution-Current-btn"]
                      }
                      text={t("Current")}
                      onClick={currentbuttontable}
                    />
                  </Col>

                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className=" d-flex justify-content-end  align-items-center  Search-filed-resolution"
                  >
                    <span className={styles["search_input"]}>
                      {/* <TextField
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
                      /> */}
                      <SearchInputSuggestion />

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
                    resolutionView !== null && resolutionView === 2
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
                          buttonTab !== null && buttonTab === 2
                            ? columnsModeratorClosed
                            : columnsModerator
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
                        rows={rows}
                      />
                      <Row>
                        <Col sm={12} md={12} lg={12} className="d-flex justify-content-center my-3 pagination-groups-table">
                          <Pagination
                            defaultCurrent={moderatorPage !== null ? moderatorPage : 1}
                            // totalBoundaryShowSizeChanger={}
                            total={totalResolution}
                            showSizeChanger
                            locale={{
                              items_per_page: t('items_per_page'),
                              page: t('page')
                            }}
                            pageSizeOptions={["30", "50", "100", "200"]}
                            className={styles["PaginationStyle-Resolution"]}
                            onChange={handleChangeResolutionPagination}
                            defaultPageSize={moderatorRows !== null ? moderatorRows : 50}
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
            ) : resolutionView !== null && resolutionView === 2 ? (
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  {isSearchVoter !== null && isSearchVoter !== undefined && isSearchVoter.length > 0 ? (
                    <>
                      <TableToDo
                        sortDirections={["descend", "ascend"]}
                        column={
                          buttonTab !== null && buttonTab === 2
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
                            defaultCurrent={voterPage}
                            total={totalVoterResolution}
                            defaultPageSize={voterRows}
                            locale={{
                              items_per_page: t('items_per_page'),
                              page: t('page')
                            }}
                            showSizeChanger
                            pageSizeOptions={["30", "50", "100", "200"]}
                            className={styles["PaginationStyle-Resolution"]}
                            // selectComponentClass={"pagination_resolution"}
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
      {cancelResolutionModal && <ModalCancellResolution handleCancelResolution={handleClickCancelResolution} text={true} cancelresolution={cancelResolutionModal} setCancelresolution={setCancelResolutionModal} />}

      {ResolutionReducer.Loading ? <Loader /> : null}
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </>
  );
};

export default Resolution;
