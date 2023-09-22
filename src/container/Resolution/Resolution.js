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
import { Pagination } from "antd";
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
  getVoterResolution,
  createResolutionModal,
} from "../../store/actions/Resolution_actions";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import {
  newTimeFormaterForResolutionAsPerUTCFullDate,
  resolutionResultTable,
  _justShowDateformat,
  createConvert,
} from "../../commen/functions/date_formater";
import EditResolutionIcon from "../../assets/images/Edit_Resolution_Icon.svg";
import ResultResolutionIcon from "../../assets/images/Result_Resolution_Icon.svg";
import AttachmentIcon from "../../assets/images/resolutions/Attachment_Resolution.svg";
import EmptyResolution from "../../assets/images/resolutions/Empty_Resolution.svg";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ModalCancellResolution2 from "../ModalCancellResolution2/ModalCancellResolution";
import CrossResolution from "../../assets/images/resolutions/cross_icon_resolution.svg";
import { updateResolutionModal } from "../../store/actions/Resolution_actions";
import { viewResolutionModal } from "../../store/actions/Resolution_actions";
import { validateInput } from "../../commen/functions/regex";
const Resolution = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ResolutionReducer, LanguageReducer } = useSelector((state) => state);
  const [totalResolution, setTotalResolution] = useState(0);
  const [totalVoterResolution, setTotalVoterResolution] = useState(0);
  const [cancelResolutionModal, setCancelResolutionModal] = useState(false);
  const [resolutionIDForCancel, setResolutionIDForCancel] = useState(0);
  let currentLanguage = localStorage.getItem("i18nextLng");
  moment.locale(currentLanguage);
  const [resultresolution, setResultresolution] = useState(false);
  const [voteresolution, setVoteresolution] = useState(false);
  const [voterID, setVoterID] = useState(0);
  const [searchIcon, setSearchIcon] = useState(false);
  const [rows, setRows] = useState([]);
  const [isSearchVoter, setSearchVoter] = useState([]);
  const [resolutionmodalupdated, setRresolutionmodalupdated] = useState(false);
  const [resolutionAttachments, setResolutionAttachments] = useState([]);
  const [viewattachmentpage, setViewattachmentpage] = useState(false);
  const [searchResultsArea, setSearchResultsArea] = useState(false);
  const [allSearchInput, setAllSearchInput] = useState("");
  let resolutionView = JSON.parse(localStorage.getItem("resolutionView"));
  let moderatorPage = localStorage.getItem("moderatorPage");
  let moderatorRows = localStorage.getItem("moderatorRows");
  let voterPage = localStorage.getItem("voterPage");
  let voterRows = localStorage.getItem("voterRows");
  let buttonTab = JSON.parse(localStorage.getItem("ButtonTab"));
  let userID = localStorage.getItem("userID");
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
        dispatch(getVoterResolution(navigate, buttonTab, t));
      } else {
        localStorage.setItem("moderatorPage", 1);
        localStorage.setItem("moderatorRows", 50);
        localStorage.setItem("voterPage", 1);
        localStorage.setItem("voterRows", 50);
        localStorage.setItem("resolutionView", 1);
        localStorage.setItem("ButtonTab", 1);
        dispatch(getResolutions(navigate, 1, t));
      }
    } catch {}

    return () => {
      localStorage.removeItem("moderatorPage");
      localStorage.removeItem("moderatorRows");
      localStorage.removeItem("voterPage");
      localStorage.removeItem("voterRows");
      localStorage.removeItem("ResolutionID");
      dispatch(createResolutionModal(false));
      dispatch(updateResolutionModal(false));
      dispatch(viewResolutionModal(false));
    };
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
    let getUserID = JSON.parse(localStorage.getItem("userID"));
    let resolutionView = JSON.parse(localStorage.getItem("resolutionView"));
    let buttonTab = JSON.parse(localStorage.getItem("ButtonTab"));

    if (resolutionView === 1) {
      let Data = {
        FK_UID: getUserID,
        ResolutionStatus: buttonTab,
        Title: "",
        PageNumber: moderatorPage !== null ? moderatorPage : 1,
        Length: moderatorRows !== null ? moderatorRows : 50,
        CirculationDate: `${createConvert(searchModalDates.circulationDate)}`,
        VotingDeadlineDate: `${createConvert(searchModalDates.votingDate)}`,
      };
      dispatch(
        getResolutions(
          navigate,
          buttonTab,
          t,
          Data.Title,
          Data.CirculationDate,
          Data.VotingDeadlineDate
        )
      );
      setSearchResultsArea(false);
      setSearchIcon(false);
    } else {
      let Data = {
        FK_UID: getUserID,
        ResolutionStatus: buttonTab,
        Title: "",
        PageNumber: moderatorPage !== null ? moderatorPage : 1,
        Length: moderatorRows !== null ? moderatorRows : 50,
        CirculationDate: `${createConvert(searchModalDates.circulationDate)}`,
        VotingDeadlineDate: `${createConvert(searchModalDates.votingDate)}`,
      };
      setSearchResultsArea(false);
      setSearchIcon(false);
      dispatch(
        getVoterResolution(
          navigate,
          buttonTab,
          t,
          Data.Title,
          Data.CirculationDate,
          Data.VotingDeadlineDate
        )
      );
    }
  };

  const hideSearchOptions = () => {
    if (resolutionView === 1) {
      dispatch(getResolutions(navigate, buttonTab, t));
    } else {
      dispatch(getVoterResolution(navigate, buttonTab, t));
    }
    setSearchModalDates({
      circulationDate: "",
      votingDate: "",
    });
    setAllSearchInput("");
    setSearchResultsArea(false);
    setSearchIcon(false);
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
  };

  const currentbuttontable = () => {
    localStorage.setItem("ButtonTab", 1);
    setAllSearchInput("");
    setSearchModalDates({
      circulationDate: "",
      votingDate: "",
    });
    setSearchIcon(false);
    if (resolutionView !== null && resolutionView === 1) {
      // if (moderatorPage !== null && moderatorRows !== null) {
      dispatch(getResolutions(navigate, 1, t));
      // }
    } else if (resolutionView !== null && resolutionView === 2) {
      // if (voterPage !== null && voterRows !== null) {
      dispatch(getVoterResolution(navigate, 1, t));
      // }
    }
  };

  const allbtntable = () => {
    localStorage.setItem("ButtonTab", 3);
    setAllSearchInput("");
    setSearchIcon(false);
    setSearchModalDates({
      circulationDate: "",
      votingDate: "",
    });
    if (resolutionView !== null && resolutionView === 1) {
      dispatch(getResolutions(navigate, 3, t));
    } else if (resolutionView !== null && resolutionView === 2) {
      dispatch(getVoterResolution(navigate, 3, t));
    }
  };

  const buttonclosed = () => {
    localStorage.setItem("ButtonTab", 2);
    setAllSearchInput("");
    setSearchModalDates({
      circulationDate: "",
      votingDate: "",
    });
    setSearchIcon(false);
    if (resolutionView !== null && resolutionView === 1) {
      dispatch(getResolutions(navigate, 2, t));
    } else if (resolutionView !== null && resolutionView === 2) {
      dispatch(getVoterResolution(navigate, 2, t));
    }
  };

  const createresolution = async () => {
    await dispatch(createResolutionModal(true));
    setAllSearchInput("");
    setSearchModalDates({
      circulationDate: "",
      votingDate: "",
    });
    setSearchIcon(false);
  };
  const handleUpdateResolutionAction = (id) => {
    dispatch(getResolutionbyResolutionID(navigate, id, t, 1));
  };

  const viewResolution = (id) => {
    dispatch(getResolutionbyResolutionID(navigate, id, t, 2));
  };

  const getResultHandle = (id) => {
    dispatch(getResolutionResult(navigate, id, t, setResultresolution));
  };

  const getVoteDetailHandler = (id, data) => {
    dispatch(getVotesDetails(navigate, id, t, setVoteresolution));
    setVoterID(data.voterID);
  };

  const filterResolution = (e) => {
    let value = validateInput(e.target.value);
    setAllSearchInput(value);
  };
  const handleClickSearch = (event) => {
    if (event.key === "Enter") {
      let getUserID = JSON.parse(localStorage.getItem("userID"));
      let resolutionView = JSON.parse(localStorage.getItem("resolutionView"));
      let buttonTab = JSON.parse(localStorage.getItem("ButtonTab"));
      if (resolutionView === 1) {
        if (allSearchInput !== "") {
          let Data = {
            FK_UID: getUserID,
            ResolutionStatus: buttonTab,
            Title: allSearchInput,
            PageNumber: moderatorPage !== null ? moderatorPage : 1,
            Length: moderatorRows !== null ? moderatorRows : 50,
            CirculationDate: "",
            VotingDeadlineDate: "",
          };
          dispatch(getResolutions(navigate, buttonTab, t, Data.Title));
          setAllSearchInput("");
        } else {
          dispatch(getResolutions(navigate, buttonTab, t));
        }
      } else {
        if (allSearchInput !== "") {
          let Data = {
            FK_UID: getUserID,
            ResolutionStatus: buttonTab,
            Title: allSearchInput,
            PageNumber: moderatorPage !== null ? moderatorPage : 1,
            Length: moderatorRows !== null ? moderatorRows : 50,
            CirculationDate: "",
            VotingDeadlineDate: "",
          };
          dispatch(getVoterResolution(navigate, buttonTab, t, Data.Title));
          setAllSearchInput("");
        } else {
          dispatch(getVoterResolution(navigate, buttonTab, t));
        }
      }
    }
  };

  const OpenCancelModal = (id) => {
    setResolutionIDForCancel(id);
    setCancelResolutionModal(true);
  };

  const changeSearchDateHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setSearchModalDates({
      ...searchModalDates,
      [name]: value,
    });
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
          return (
            <span className={styles["decision_non_Approved"]}>{text}</span>
          );
        } else if (text === "Tie") {
          return (
            <span className={styles["decision_text_Pending"]}>{text}</span>
          );
        } else {
          return (
            <span className={styles["decision_text_Pending"]}>{text}</span>
          );
        }
      },
    },
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
        let votingDeadline = resolutionResultTable(data?.votingDeadline);
        if (data.resolutionStatus === "Circulated") {
          if (votingDeadline < newDate) {
            return (
              <img
                draggable="false"
                src={ResultResolutionIcon}
                onClick={() => getResultHandle(data.resolutionID)}
                className={styles["Result_icon"]}
                alt=""
              />
            );
          } else {
            return "";
          }
        } else if (data.resolutionStatus === "Closed") {
          if (votingDeadline < newDate) {
            return (
              <img
                draggable="false"
                src={ResultResolutionIcon}
                onClick={() => getResultHandle(data.resolutionID)}
                className={styles["Result_icon"]}
                alt=""
              />
            );
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
          return (
            <span className={styles["Edit_Icon_moderator"]}>
              <img
                draggable="false"
                src={CrossResolution}
                width={22}
                height={22}
                alt=""
                onClick={() => OpenCancelModal(data.resolutionID)}
              />
            </span>
          );
        } else {
          return (
            <img
              draggable="false"
              src={EditResolutionIcon}
              onClick={() => handleUpdateResolutionAction(data.resolutionID)}
              className={styles["Edit_Icon_moderator"]}
              alt=""
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
          return (
            <span className={styles["decision_non_Approved"]}>{text}</span>
          );
        } else if (text === "Tie") {
          return (
            <span className={styles["decision_text_Pending"]}>{text}</span>
          );
        } else {
          return (
            <span className={styles["decision_text_Pending"]}>{text}</span>
          );
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
              draggable="false"
              className={styles["Result_Icon_cursor_pointer"]}
              src={ResultResolutionIcon}
              alt=""
              onClick={() => getResultHandle(data.resolutionID)}
            />
          );
        } else {
          return "";
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
                draggable="false"
                className="text-center cursor-pointer"
                src={AttachmentIcon}
                alt=""
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
        if (data.resolutionStatusID === 2) {
          if (data.isVoter === 1) {
            if (data.fK_VotingStatus_ID === 1) {
              return (
                <span className="d-flex justify-content-center">
                  <img draggable="false" src={thumbsup} alt="" />
                </span>
              );
            } else if (data.fK_VotingStatus_ID === 2) {
              return (
                <span className="d-flex justify-content-center">
                  <img draggable="false" src={thumbsdown} alt="" />
                </span>
              );
            } else if (data.fK_VotingStatus_ID === 3) {
              return (
                <Button
                  text={t("Vote")}
                  className={styles["Resolution-vote-btn"]}
                  onClick={() => getVoteDetailHandler(data.resolutionID, data)}
                />
              );
            } else if (data.fK_VotingStatus_ID === 4) {
              return (
                <span className="d-flex justify-content-center">
                  <img draggable="false" src={AbstainvoterIcon} alt="" />
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
          return (
            <span className={styles["decision_non_Approved"]}>{text}</span>
          );
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
        if (data.isAttachmentAvailable) {
          return (
            <img
              draggable="false"
              className="text-center cursor-pointer"
              src={AttachmentIcon}
              onClick={() => viewAttachmentHandle(data.attachments)}
              alt=""
            />
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
        if (data.resolutionStatusID === 3) {
          if (data.isVoter === 1) {
            if (data.fK_VotingStatus_ID === 1) {
              return (
                <span className="d-flex justify-content-center">
                  <img draggable="false" src={thumbsup} alt="" />
                </span>
              );
            } else if (data.fK_VotingStatus_ID === 2) {
              return (
                <span className="d-flex justify-content-center">
                  <img draggable="false" src={thumbsdown} alt="" />
                </span>
              );
            } else if (data.fK_VotingStatus_ID === 3) {
              return <p className="text-center"></p>;
            } else if (data.fK_VotingStatus_ID === 4) {
              return (
                <span className="d-flex justify-content-center">
                  <img draggable="false" src={AbstainvoterIcon} alt="" />
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
      },
    },
  ];

  // resolution view
  const resolutionTable = (viewID) => {
    setAllSearchInput("");
    setSearchModalDates({
      circulationDate: "",
      votingDate: "",
    });
    setSearchIcon(false);
    if (viewID === 1) {
      localStorage.setItem("resolutionView", 1);
      if (buttonTab !== null && buttonTab === 3) {
        dispatch(getResolutions(navigate, 3, t));
      } else if (buttonTab !== null && buttonTab === 1) {
        dispatch(getResolutions(navigate, 1, t));
      } else if (buttonTab !== null && buttonTab === 2) {
        dispatch(getResolutions(navigate, 2, t));
      }
    } else {
      localStorage.setItem("resolutionView", 2);
      if (buttonTab !== null && buttonTab === 3) {
        dispatch(getVoterResolution(navigate, 3, t));
      } else if (buttonTab !== null && buttonTab === 1) {
        dispatch(getVoterResolution(navigate, 1, t));
      } else if (buttonTab !== null && buttonTab === 2) {
        dispatch(getVoterResolution(navigate, 2, t));
      }
    }
  };

  // change resoltion moderator pagination
  const handleChangeResolutionPagination = async (current, pageSize) => {
    await localStorage.setItem("moderatorPage", current);
    await localStorage.setItem("moderatorRows", pageSize);
    if (buttonTab !== null && buttonTab === 3) {
      dispatch(getResolutions(navigate, 3, t));
    } else if (buttonTab !== null && buttonTab === 1) {
      dispatch(getResolutions(navigate, 1, t));
    } else if (buttonTab !== null && buttonTab === 2) {
      dispatch(getResolutions(navigate, 2, t));
    }
  };

  // change resolution voter pagination
  const handleChangeVoterResolutionPagination = async (current, pageSize) => {
    await localStorage.setItem("voterPage", current);
    await localStorage.setItem("voterRows", pageSize);
    if (buttonTab !== null && buttonTab === 3) {
      dispatch(getVoterResolution(navigate, 3, t));
    } else if (buttonTab !== null && buttonTab === 1) {
      dispatch(getVoterResolution(navigate, 1, t));
    } else if (buttonTab !== null && buttonTab === 2) {
      dispatch(getVoterResolution(navigate, 2, t));
    }
  };

  // Resolution reducer ResponseMessage
  useEffect(() => {
    if (
      ResolutionReducer.ResponseMessage !== "" &&
      ResolutionReducer.ResponseMessage !== t("Data-available") &&
      ResolutionReducer.ResponseMessage !== t("No-data-available") &&
      ResolutionReducer.ResponseMessage !== undefined
    ) {
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
      setTotalVoterResolution(
        ResolutionReducer.searchVoterResolution.totalRecords
      );
    } else {
      setSearchVoter([]);
    }
  }, [ResolutionReducer.searchVoterResolution]);

  // moderator resolution state manage
  useEffect(() => {
    if (ResolutionReducer.GetResolutions !== null) {
      setTotalResolution(ResolutionReducer.GetResolutions.totalRecords);
      setRows(ResolutionReducer.GetResolutions.resolutionTable);
    } else {
      setRows([]);
    }
  }, [ResolutionReducer.GetResolutions]);

  useEffect(() => {
    if (ResolutionReducer.mqttResolutionCreated !== null) {
      try {
        let getData = ResolutionReducer.mqttResolutionCreated;
        let findIndexModerator = isSearchVoter.findIndex(
          (data, index) =>
            data.resolutionID === getData.resolution.pK_ResolutionID
        );
        if (resolutionView === 2) {
          if (buttonTab === 3 || buttonTab === 1) {
            let findVoterisValid =
              getData?.voters.filter((obj) => obj.fK_UID === Number(userID)) ||
              getData?.nonVoters.filter((obj) => obj.fK_UID === Number(userID));
            if (findIndexModerator === -1) {
              let voterResolution = {
                attachments: getData.attachments,
                decision: getData.resolution.resolutionDecision,
                decisionDate: getData.resolution.decisionAnnouncementDateTime,
                fK_VotingStatus_ID: findVoterisValid[0].fK_VotingStatus_ID,
                isAlreadyVoted: findVoterisValid[0].isAlreadyVoted,
                isAttachmentAvailable: getData.isAttachmentAvailable,
                isVoter: findVoterisValid[0].isVoter,
                resolutionID: getData.resolution.pK_ResolutionID,
                resolutionStatusID: getData.resolution.fK_ResolutionStatusID,
                resolutionTitle: getData.resolution.title,
                voterID: findVoterisValid[0].pK_RV_ID,
                votingDeadline: getData.resolution.votingDeadline,
                votingMethod: getData.resolution.votingMethod,
                votingStatus: findVoterisValid[0].status,
              };
              setSearchVoter([voterResolution, ...isSearchVoter]);
            } else {
              let voterResolution = {
                attachments: getData.attachments,
                decision: getData.resolution.resolutionDecision,
                decisionDate: getData.resolution.decisionAnnouncementDateTime,
                fK_VotingStatus_ID: findVoterisValid[0].fK_VotingStatus_ID,
                isAlreadyVoted: findVoterisValid[0].isAlreadyVoted,
                isAttachmentAvailable: getData.isAttachmentAvailable,
                isVoter: findVoterisValid[0].isVoter,
                resolutionID: getData.resolution.pK_ResolutionID,
                resolutionStatusID: getData.resolution.fK_ResolutionStatusID,
                resolutionTitle: getData.resolution.title,
                voterID: findVoterisValid[0].pK_RV_ID,
                votingDeadline: getData.resolution.votingDeadline,
                votingMethod: getData.resolution.votingMethod,
                votingStatus: findVoterisValid[0].status,
              };
              let copyData = [...isSearchVoter];
              copyData.splice(findIndexModerator, 1, voterResolution);
              setSearchVoter(copyData);
            }
          }
        }
      } catch {}
    }
  }, [ResolutionReducer.mqttResolutionCreated]);

  useEffect(() => {
    if (ResolutionReducer.mqttResolutionCancelled !== null) {
      try {
        let findCancelledResolution = isSearchVoter.filter(
          (obj) =>
            obj.resolutionID !==
            ResolutionReducer.mqttResolutionCancelled.resolution.pK_ResolutionID
        );
        setSearchVoter(findCancelledResolution);
      } catch {}
    }
  }, [ResolutionReducer.mqttResolutionCancelled]);

  useEffect(() => {
    if (ResolutionReducer.mqttResolutionClosed !== null) {
      try {
        let getData = ResolutionReducer.mqttResolutionCreated;
        let findIndexResolution = isSearchVoter.findIndex(
          (data, index) =>
            data.resolutionID === getData.resolution.pK_ResolutionID
        );
        if (resolutionView === 2) {
          if (buttonTab === 1) {
            let findCancelledResolution = isSearchVoter.filter(
              (obj) =>
                obj.resolutionID !==
                ResolutionReducer.mqttResolutionCancelled.resolution
                  .pK_ResolutionID
            );
            setSearchVoter(findCancelledResolution);
          } else if (buttonTab === 2) {
            let findVoterisValid =
              getData?.voters.filter((obj) => obj.fK_UID === Number(userID)) ||
              getData?.nonVoters.filter((obj) => obj.fK_UID === Number(userID));
            let voterResolution = {
              attachments: getData.attachments,
              decision: getData.resolution.resolutionDecision,
              decisionDate: getData.resolution.decisionAnnouncementDateTime,
              fK_VotingStatus_ID: findVoterisValid[0].fK_VotingStatus_ID,
              isAlreadyVoted: findVoterisValid[0].isAlreadyVoted,
              isAttachmentAvailable: getData.isAttachmentAvailable,
              isVoter: findVoterisValid[0].isVoter,
              resolutionID: getData.resolution.pK_ResolutionID,
              resolutionStatusID: getData.resolution.fK_ResolutionStatusID,
              resolutionTitle: getData.resolution.title,
              voterID: findVoterisValid[0].pK_RV_ID,
              votingDeadline: getData.resolution.votingDeadline,
              votingMethod: getData.resolution.votingMethod,
              votingStatus: findVoterisValid[0].status,
            };
            setSearchVoter([voterResolution, ...isSearchVoter]);
          } else if (buttonTab === 3) {
            let findVoterisValid =
              getData?.voters.filter((obj) => obj.fK_UID === Number(userID)) ||
              getData?.nonVoters.filter((obj) => obj.fK_UID === Number(userID));
            let voterResolution = {
              attachments: getData.attachments,
              decision: getData.resolution.resolutionDecision,
              decisionDate: getData.resolution.decisionAnnouncementDateTime,
              fK_VotingStatus_ID: findVoterisValid[0].fK_VotingStatus_ID,
              isAlreadyVoted: findVoterisValid[0].isAlreadyVoted,
              isAttachmentAvailable: getData.isAttachmentAvailable,
              isVoter: findVoterisValid[0].isVoter,
              resolutionID: getData.resolution.pK_ResolutionID,
              resolutionStatusID: getData.resolution.fK_ResolutionStatusID,
              resolutionTitle: getData.resolution.title,
              voterID: findVoterisValid[0].pK_RV_ID,
              votingDeadline: getData.resolution.votingDeadline,
              votingMethod: getData.resolution.votingMethod,
              votingStatus: findVoterisValid[0].status,
            };
            let copyData = [...isSearchVoter];
            copyData.splice(findIndexResolution, 1, voterResolution);
            setSearchVoter(copyData);
          }
        }
      } catch {}
    }
  }, [ResolutionReducer.mqttResolutionClosed]);
  console.log(ResolutionReducer, "ResolutionReducerResolutionReducer");
  return (
    <>
      <section className={styles["resolution_container"]}>
        {ResolutionReducer.createResolutionModal ? (
          <>
            <ScheduleNewResolution />
          </>
        ) : ResolutionReducer.viewResolutionModal ? (
          <>
            <ViewResolution />
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
        ) : ResolutionReducer.updateResolutionModal ? (
          <>
            <EditResolution setCancelresolution={setCancelResolutionModal} />
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
                          draggable="false"
                          src={plusbutton}
                          height="7.6px"
                          width="7.6px"
                          alt=""
                          className="align-items-center"
                        />
                      }
                      onClick={() => createresolution()}
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
                      <TextField
                        width="455px"
                        name="Title"
                        placeholder={t("Search")}
                        labelClass="textFieldSearch d-none"
                        value={allSearchInput}
                        change={(e) => filterResolution(e)}
                        // onClick={handleClickSearch}
                        onKeyDown={handleClickSearch}
                        applyClass={"resolution-search-input"}
                        iconClassName={styles["Search_Icon"]}
                        inputicon={
                          <img draggable="false" src={searchicon} alt="" />
                        }
                        clickIcon={openSearchBox}
                      />
                      {/* <SearchInputSuggestion /> */}
                    </span>
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
                                  draggable="false"
                                  src={Cross}
                                  height="16px"
                                  alt=""
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
                                  resolutionView === 2
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
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className="d-flex justify-content-center my-3 pagination-groups-table"
                        >
                          <Pagination
                            defaultCurrent={
                              moderatorPage !== null ? moderatorPage : 1
                            }
                            // totalBoundaryShowSizeChanger={}
                            total={totalResolution}
                            showSizeChanger
                            locale={{
                              items_per_page: t("items_per_page"),
                              page: t("page"),
                            }}
                            pageSizeOptions={["30", "50", "100", "200"]}
                            className={styles["PaginationStyle-Resolution"]}
                            onChange={handleChangeResolutionPagination}
                            defaultPageSize={
                              moderatorRows !== null ? moderatorRows : 50
                            }
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
                        <img draggable="false" src={EmptyResolution} alt="" />
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
                  {isSearchVoter !== null &&
                  isSearchVoter !== undefined &&
                  isSearchVoter.length > 0 ? (
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
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className="d-flex justify-content-center my-3 pagination-groups-table"
                        >
                          <Pagination
                            defaultCurrent={voterPage !== null ? voterPage : 1}
                            total={totalVoterResolution}
                            defaultPageSize={
                              voterRows !== null ? voterRows : 50
                            }
                            locale={{
                              items_per_page: t("items_per_page"),
                              page: t("page"),
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
                        <img draggable="false" src={EmptyResolution} alt="" />
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
      <ModalCancellResolution2
        cancelresolution={cancelResolutionModal}
        setCancelresolution={setCancelResolutionModal}
        Id={resolutionIDForCancel}
      />
      {ResolutionReducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </>
  );
};

export default Resolution;
