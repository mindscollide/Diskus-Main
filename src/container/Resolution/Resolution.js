import React, { useEffect, useRef, useState } from "react";
import styles from "./Resolution.module.css";
import {
  Button,
  TextField,
  TableToDo,
  Notification,
} from "../../components/elements";
import { Col, Row } from "react-bootstrap";
import searchicon from "../../assets/images/searchicon.svg";
import plusbutton from "../../assets/images/Group 119.svg";
import BlackCrossIcon from "../../assets/images/BlackCrossIconModals.svg";
import thumbsup from "../../assets/images/thumbsup.svg";
import thumbsdown from "../../assets/images/thumbsdown.svg";
import AbstainvoterIcon from "../../assets/images/resolutions/Abstainvoter_icon.svg";
import { useTranslation } from "react-i18next";
import ScheduleNewResolution from "./ScheduleNewResolution/ScheduleNewResolution";
import ViewResolution from "./ViewResolution/ViewResolution";
import ResultResolution from "./ResultsPageResoution/ResultResolution";
import VotingPage from "../VotingPage/VotingPage";
import ModalResolutionUpdated from "./ModalResolutionUpdated/ModalResolutionUpdated";
import ViewAttachments from "./ViewAttachments/ViewAttachments";
import Cross from "../../assets/images/Cross-Chat-Icon.png";
import EditResolution from "./EditResolution/EditResolution";
import {
  getResolutionbyResolutionID,
  getResolutionResult,
  getResolutions,
  getVotesDetails,
  getVoterResolution,
  createResolutionModal,
  resultResolutionFlag,
  voteResolutionFlag,
  viewAttachmentFlag,
  resolutionMQTTCreate,
  validateStringResolutionApi,
} from "../../store/actions/Resolution_actions";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip } from "antd";
import {
  newTimeFormaterForResolutionAsPerUTCFullDate,
  resolutionResultTable,
  _justShowDateformat,
  createConvert,
  forRecentActivity,
} from "../../commen/functions/date_formater";
import EditResolutionIcon from "../../assets/images/Edit_Resolution_Icon.svg";
import ResultResolutionIcon from "../../assets/images/Result_Resolution_Icon.svg";
import AttachmentIcon from "../../assets/images/resolutions/Attachment_Resolution.svg";
import EmptyResolution from "../../assets/images/resolutions/Empty_Resolution.svg";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ModalCancellResolution2 from "./ModalCancellResolution2/ModalCancellResolution";
import CrossResolution from "../../assets/images/resolutions/cross_icon_resolution.svg";
import { updateResolutionModal } from "../../store/actions/Resolution_actions";
import { viewResolutionModal } from "../../store/actions/Resolution_actions";
import {
  convertToArabicNumerals,
  validateInput,
} from "../../commen/functions/regex";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import DatePicker, { DateObject } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import CustomPagination from "../../commen/functions/customPagination/Paginations";
import { useResolutionContext } from "../../context/ResolutionContext";
import AccessDeniedModal from "../../components/layout/WebNotfication/AccessDeniedModal/AccessDeniedModal";
import SpinComponent from "../../components/elements/mainLoader/loader";
const Resolution = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let CurrentLanguage = localStorage.getItem("i18nextLng");
  const { resultresolution, setResultresolution } = useResolutionContext();
  const ResolutionReducersearchVoterResolution = useSelector(
    (state) => state.ResolutionReducer.searchVoterResolution
  );
  const ResolutionReducerGetResolutions = useSelector(
    (state) => state.ResolutionReducer.GetResolutions
  );
  const ResolutionReducermqttResolutionCreated = useSelector(
    (state) => state.ResolutionReducer.mqttResolutionCreated
  );
  const ResolutionReducermqttResolutionCancelled = useSelector(
    (state) => state.ResolutionReducer.mqttResolutionCancelled
  );
  const ResolutionReducermqttResolutionClosed = useSelector(
    (state) => state.ResolutionReducer.mqttResolutionClosed
  );
  const ResolutionReducercreateResolutionModal = useSelector(
    (state) => state.ResolutionReducer.createResolutionModal
  );
  const ResolutionReducerviewResolutionModal = useSelector(
    (state) => state.ResolutionReducer.viewResolutionModal
  );
  const ResolutionReducerresultResolutionFlag = useSelector(
    (state) => state.ResolutionReducer.resultResolutionFlag
  );
  const ResolutionReducervoteResolutionFlag = useSelector(
    (state) => state.ResolutionReducer.voteResolutionFlag
  );
  const ResolutionReducerviewAttachmentFlag = useSelector(
    (state) => state.ResolutionReducer.viewAttachmentFlag
  );
  const ResolutionReducerupdateResolutionModal = useSelector(
    (state) => state.ResolutionReducer.updateResolutionModal
  );
  const ResolutionReducerLoading = useSelector(
    (state) => state.ResolutionReducer.Loading
  );
  const AccessDeniedGlobalState = useSelector(
    (state) => state.PollsReducer.AccessDeniedPolls
  );
  const [totalResolution, setTotalResolution] = useState(0);
  const [totalVoterResolution, setTotalVoterResolution] = useState(0);
  const [cancelResolutionModal, setCancelResolutionModal] = useState(false);
  const [resolutionIDForCancel, setResolutionIDForCancel] = useState(0);
  let currentLanguage = localStorage.getItem("i18nextLng");
  moment.locale(currentLanguage);
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();
  const [voteresolution, setVoteresolution] = useState(false);
  const [searchIcon, setSearchIcon] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [enterpressed, setEnterpressed] = useState(false);
  const [rows, setRows] = useState([]);
  console.log(rows, "rowsrowsrowsrows");
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
  let resolutionVoter = localStorage.getItem("resVot");
  let resolutionNonVoter = localStorage.getItem("resNonVot");

  useEffect(() => {
    try {
      if (resolutionVoter !== null) {
        try {
          try {
            validateStringResolutionApi(
              resolutionVoter,
              navigate,
              t,
              1,
              dispatch
            )
              .then((response) => {
                dispatch(
                  getVotesDetails(
                    navigate,
                    response.resolutionID,
                    t,
                    setVoteresolution
                  )
                );
                localStorage.removeItem("resVot");
              })
              .catch((error) => {
                console.log(error);
              });
          } catch (error) {
            console.log(error);
          }
        } catch (error) {}
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [resolutionVoter]);

  useEffect(() => {
    if (resolutionNonVoter !== null) {
      try {
        validateStringResolutionApi(
          resolutionNonVoter,
          navigate,
          t,
          1,
          dispatch
        )
          .then((response) => {
            viewResolution(response.resolutionID);
            localStorage.removeItem("resNonVot");
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [resolutionNonVoter]);

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
        localStorage.setItem("resolutionView", 2);
        localStorage.setItem("ButtonTab", 1);
        dispatch(getVoterResolution(navigate, 1, t));
      }
    } catch {}

    return () => {
      localStorage.removeItem("moderatorPage");
      localStorage.removeItem("moderatorRows");
      localStorage.removeItem("resolutionView");
      localStorage.removeItem("ButtonTab");
      localStorage.removeItem("voterPage");
      localStorage.removeItem("voterRows");
      localStorage.removeItem("ResolutionID");
      localStorage.removeItem("ResolutionAccessDenied");
      dispatch(createResolutionModal(false));
      dispatch(updateResolutionModal(false));
      dispatch(viewResolutionModal(false));
      dispatch(resultResolutionFlag(false));
      dispatch(voteResolutionFlag(false));
      dispatch(viewAttachmentFlag(false));
    };
  }, []);

  useEffect(() => {
    try {
      if (currentLanguage !== undefined && currentLanguage !== null) {
        if (currentLanguage === "en") {
          setCalendarValue(gregorian);
          setLocalValue(gregorian_en);
        } else if (currentLanguage === "ar") {
          setCalendarValue(gregorian);
          setLocalValue(gregorian_ar);
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [currentLanguage]);

  const [searchModalDates, setSearchModalDates] = useState({
    circulationDate: "",
    votingDate: "",
  });

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showSearchOptions = () => {
    setIsSearching(true);
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
    setIsSearching(false);
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

  const handleResettingPage = () => {
    setIsSearching(false);
    setEnterpressed(false);
    dispatch(getResolutions(navigate, buttonTab, t));
    dispatch(getVoterResolution(navigate, buttonTab, t));
  };

  const closeSeachBar = () => {
    setSearchIcon(false);
    setIsSearching(false);
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
      dispatch(getResolutions(navigate, 1, t));
    } else if (resolutionView !== null && resolutionView === 2) {
      dispatch(getVoterResolution(navigate, 1, t));
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

  const viewResolutionCancelled = (id) => {
    console.log(id, "viewResolutionCancelled");
    localStorage.setItem("resolutionDeleted", true);
    dispatch(getResolutionbyResolutionID(navigate, id, t, 3));
  };

  const getResultHandle = (id) => {
    dispatch(getResolutionResult(navigate, id, t, setResultresolution));
  };

  const getVoteDetailHandler = (id, data) => {
    dispatch(getVotesDetails(navigate, id, t, setVoteresolution));
  };

  const filterResolution = (e) => {
    let value = validateInput(e.target.value);
    setAllSearchInput(value);
  };
  const handleClickSearch = (event) => {
    if (event.key === "Enter") {
      setEnterpressed(true);
      setIsSearching(true);
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

  const changeCirculateDateHandler = (e) => {
    let toDoDateSaveFormat = new DateObject(e).format("YYYY-MM-DD");

    setSearchModalDates({
      ...searchModalDates,
      circulationDate: toDoDateSaveFormat,
    });
  };

  const changeSearchDateHandler = (e) => {
    let toDoDateSaveFormat = new DateObject(e).format("YYYY-MM-DD");
    setSearchModalDates({
      ...searchModalDates,
      votingDate: toDoDateSaveFormat,
    });
  };

  const viewAttachmentHandle = (data) => {
    setViewattachmentpage(true);
    dispatch(viewAttachmentFlag(true));
    setResolutionAttachments(data);
  };

  // moderator all and current columns
  const columnsModerator = [
    {
      title: t("Resolution-title"),
      dataIndex: "resolutionTitle",
      key: "resolutionTitle",
      align: "start",
      width: "365px",
      render: (table, data) => {
        return (
          <span
            className={styles["resolution_title"]}
            onClick={() => viewResolution(data.resolutionID)}>
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
      render: (table) => {
        return (
          <span className={styles["resolution_date"]}>
            {_justShowDateformat(table, CurrentLanguage)}
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
      render: (table) => {
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
      render: (table) => {
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
      render: (text) => {
        if (text === "Approved") {
          return <span className={styles["decision_Approved"]}>{t(text)}</span>;
        } else if (text === "Not Approved") {
          return (
            <span className={styles["decision_non_Approved"]}>{t(text)}</span>
          );
        } else if (text === "Tie") {
          return (
            <span className={styles["decision_text_Pending"]}>{t(text)}</span>
          );
        } else {
          return (
            <span className={styles["decision_text_Pending"]}>{t(text)}</span>
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
      render: (text) => (
        <span className={styles["voterCountStyle"]}>
          {convertToArabicNumerals(text, CurrentLanguage)}
        </span>
      ),
    },
    {
      title: t("Result"),
      dataIndex: "Result",
      align: "center",
      key: "Result",
      width: "78px",
      render: (table, data) => {
        // if (data.resolutionStatus === "Closed") {
        //   return (
        //     <Tooltip placement="bottomLeft" title={t("Result")}>
        //       <img
        //         draggable="false"
        //         src={ResultResolutionIcon}
        //         onClick={() => getResultHandle(data.resolutionID)}
        //         className={styles["Result_icon"]}
        //         alt=""
        //       />
        //     </Tooltip>
        //   );
        // }
        // else if (data.resolutionStatus === "Closed") {
        //   return (
        //     <Tooltip placement="bottomLeft" title={t("Result")}>
        //       <img
        //         draggable="false"
        //         src={ResultResolutionIcon}
        //         onClick={() => getResultHandle(data.resolutionID)}
        //         className={styles["Result_icon"]}
        //         alt=""
        //       />
        //     </Tooltip>
        //   );
        // }
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
              <Tooltip placement='bottomLeft' title={t("Cancel")}>
                <img
                  draggable='false'
                  src={CrossResolution}
                  width={22}
                  height={22}
                  alt=''
                  onClick={() => OpenCancelModal(data.resolutionID)}
                />
              </Tooltip>
            </span>
          );
        } else {
          return (
            <Tooltip placement='bottomLeft' title={t("Edit")}>
              <img
                draggable='false'
                src={EditResolutionIcon}
                onClick={() => handleUpdateResolutionAction(data.resolutionID)}
                className={styles["Edit_Icon_moderator"]}
                alt=''
              />
            </Tooltip>
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
      align: "start",
      width: "365px",
      render: (table, data) => {
        console.log(data, "datadatadata");
        if (data.resolutionStatus === "Cancelled") {
          console.log(data.resolutionStatus, "viewResolutionCancelled");
          return (
            <span
              className={styles["resolution_title"]}
              onClick={() => viewResolutionCancelled(data.resolutionID)}>
              {table}
            </span>
          );
        } else {
          return (
            <span
              className={styles["resolution_title"]}
              onClick={() => viewResolution(data.resolutionID)}>
              {table}
            </span>
          );
        }
      },
    },
    {
      title: t("Circulation-date"),
      dataIndex: "circulationDate",
      key: "circulationDate",
      align: "center",
      width: "140px",
      render: (table) => {
        return (
          <span className={styles["resolution_date"]}>
            {_justShowDateformat(table, CurrentLanguage)}
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
      render: (table) => {
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
      render: (table) => {
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
      render: (text) => {
        if (text === "Approved") {
          return <span className={styles["decision_Approved"]}>{t(text)}</span>;
        } else if (text === "Not Approved") {
          return (
            <span className={styles["decision_non_Approved"]}>{t(text)}</span>
          );
        } else if (text === "Tie") {
          return (
            <span className={styles["decision_text_Pending"]}>{t(text)}</span>
          );
        } else {
          return (
            <span className={styles["decision_text_Pending"]}>{t(text)}</span>
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
      render: (text) => {
        return (
          <span className='d-flex justify-content-center Saved_money_Tagline '>
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
      render: (text, data) => {
        let newDate = new Date();
        let votingDeadline = resolutionResultTable(data.votingDeadline);
        if (votingDeadline < newDate) {
          return (
            <img
              draggable='false'
              className={styles["Result_Icon_cursor_pointer"]}
              src={ResultResolutionIcon}
              alt=''
              onClick={() => getResultHandle(data.resolutionID)}
            />
          );
        } else {
          return "";
        }
      },
    },
    {
      title: t("Status"),
      dataIndex: "resolutionStatus",
      align: "center",
      key: "resolutionStatus",
      width: "78px",
      render: (text, data) => {
        console.log(data, "datadata");
        return (
          <>
            <span className={styles["resolution_date"]}>
              {data.resolutionStatus}
            </span>
          </>
        );
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
      align: "start",
      sortDirections: ["descend", "ascend"],
      render: (table, data) => {
        return (
          <span
            className={styles["resolution_title"]}
            onClick={() => viewResolution(data.resolutionID)}>
            {table}
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
      render: (table) => {
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
      render: (table) => {
        return (
          <span className={styles["resolution_date_Decision_date"]}>
            {_justShowDateformat(table, CurrentLanguage)}
          </span>
        );
      },
    },
    {
      title: t("Voting-method"),
      dataIndex: "votingMethod",
      key: "votingMethod",
      width: "145px",
      align: "center",
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return <span className={styles["voterCountStyle"]}>{text}</span>;
      },
    },
    {
      title: (
        <span className='d-flex justify-content-center'>{t("Attachment")}</span>
      ),
      dataIndex: "Attachment",
      key: "Attachment",
      width: "125px",
      text: "center",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        if (data.isAttachmentAvailable) {
          return (
            <span className='d-flex justify-content-center'>
              <img
                draggable='false'
                className='text-center cursor-pointer'
                src={AttachmentIcon}
                alt=''
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
        console.log(data.votingDeadline, "renderrender");
        let getVotignDeadline = forRecentActivity(data.votingDeadline);
        // Get the current date in "YYYYMMDDHHmmss" format
        const now = new Date();
        const currentDateString =
          now.getFullYear().toString() +
          String(now.getMonth() + 1).padStart(2, "0") + // Month is 0-based
          String(now.getDate()).padStart(2, "0") +
          String(now.getHours()).padStart(2, "0") +
          String(now.getMinutes()).padStart(2, "0") +
          String(now.getSeconds()).padStart(2, "0");
        if (data.resolutionStatusID === 2) {
          if (data.isVoter === 1) {
            if (now <= getVotignDeadline) {
              return (
                <Button
                  text={t("Vote")}
                  className={styles["Resolution-vote-btn"]}
                  onClick={() => getVoteDetailHandler(data.resolutionID, data)}
                />
              );
            }
            // if (data.fK_VotingStatus_ID === 1) {
            //   return (
            //     <span className="d-flex justify-content-center">
            //       <img draggable="false" src={thumbsup} alt="" />
            //     </span>
            //   );
            // } else if (data.fK_VotingStatus_ID === 2) {
            //   return (
            //     <span className="d-flex justify-content-center">
            //       <img draggable="false" src={thumbsdown} alt="" />
            //     </span>
            //   );
            // } else if (data.fK_VotingStatus_ID === 3) {
            //   if (currentDateString <= data.votingDeadline) {
            //     return (
            //       <Button
            //         text={t("Vote")}
            //         className={styles["Resolution-vote-btn"]}
            //         onClick={() =>
            //           getVoteDetailHandler(data.resolutionID, data)
            //         }
            //       />
            //     );
            //   }
            // } else if (data.fK_VotingStatus_ID === 4) {
            //   return (
            //     <span className="d-flex justify-content-center">
            //       <img draggable="false" src={AbstainvoterIcon} alt="" />
            //     </span>
            //   );
            // }
          } else {
            return <p className='text-center'></p>;
          }
        }
      },
    },
    {
      title: (
        <>
          <span className='d-flex justify-content-center'>{t("Decision")}</span>
        </>
      ),
      dataIndex: "decision",
      key: "decision",
      width: "90px",
      align: "center",
      sortDirections: ["descend", "ascend"],
      render: (text) => {
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
      align: "start",
      sortDirections: ["descend", "ascend"],
      render: (table, data) => {
        return (
          <span
            className={styles["resolution_title"]}
            onClick={() => viewResolution(data.resolutionID)}>
            {table}
          </span>
        );
      },
    },
    {
      title: t("Voting-deadline"),
      dataIndex: "votingDeadline",
      key: "votingDeadline",
      align: "center",
      width: "155px",
      render: (text) => {
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
      align: "center",
      width: "153px",
      render: (text) => {
        return (
          <span className={styles["voterCountStyle"]}>
            {_justShowDateformat(text, CurrentLanguage)}
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
      render: (text) => {
        return <span className={styles["voterCountStyle"]}>{text}</span>;
      },
    },
    {
      title: (
        <>
          <span className='d-flex justify-content-center'>
            {t("Attachment")}
          </span>
        </>
      ),
      dataIndex: "Attachment",
      key: "Attachment",
      width: "90px",
      align: "center",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        if (data.isAttachmentAvailable) {
          return (
            <img
              draggable='false'
              className='text-center cursor-pointer'
              src={AttachmentIcon}
              onClick={() => viewAttachmentHandle(data.attachments)}
              alt=''
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
      align: "center",
      width: "120px",
      sortDirections: ["descend", "ascend"],
      render: (data) => {
        if (data.resolutionStatusID === 3) {
          if (data.isVoter === 1) {
            if (data.fK_VotingStatus_ID === 1) {
              return (
                <span className='d-flex justify-content-center'>
                  <img draggable='false' src={thumbsup} alt='' />
                </span>
              );
            } else if (data.fK_VotingStatus_ID === 2) {
              return (
                <span className='d-flex justify-content-center'>
                  <img draggable='false' src={thumbsdown} alt='' />
                </span>
              );
            } else if (data.fK_VotingStatus_ID === 3) {
              return <p className='text-center'></p>;
            } else if (data.fK_VotingStatus_ID === 4) {
              return (
                <span className='d-flex justify-content-center'>
                  <img draggable='false' src={AbstainvoterIcon} alt='' />
                </span>
              );
            }
          } else {
            return <p className='text-center'></p>;
          }
        }
      },
    },
    {
      title: (
        <>
          <span className='d-flex justify-content-center'>{t("Decision")}</span>
        </>
      ),
      dataIndex: "decision",
      key: "decision",
      width: "73px",
      sortDirections: ["descend", "ascend"],
      render: (text) => {
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

  // voter resolution state manage
  useEffect(() => {
    try {
      if (ResolutionReducersearchVoterResolution !== null) {
        setSearchVoter(ResolutionReducersearchVoterResolution.resolutionTable);
        setTotalVoterResolution(
          ResolutionReducersearchVoterResolution.totalRecords
        );
      } else {
        setSearchVoter([]);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [ResolutionReducersearchVoterResolution]);

  // moderator resolution state manage
  useEffect(() => {
    try {
      if (ResolutionReducerGetResolutions !== null) {
        setTotalResolution(ResolutionReducerGetResolutions.totalRecords);
        setRows(ResolutionReducerGetResolutions.resolutionTable);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [ResolutionReducerGetResolutions]);

  useEffect(() => {
    try {
      if (ResolutionReducermqttResolutionCreated !== null) {
        try {
          let getData = ResolutionReducermqttResolutionCreated;
          let findIndexModerator = isSearchVoter.findIndex(
            (data, index) =>
              data.resolutionID === getData.resolution.pK_ResolutionID
          );
          if (resolutionView === 2 && (buttonTab === 1 || buttonTab === 3)) {
            // Check if the user is a valid voter or non-voter
            const findVoterisValid =
              getData?.voters.find((obj) => obj.fK_UID === Number(userID)) ||
              getData?.nonVoters.find((obj) => obj.fK_UID === Number(userID));
            console.log(
              findIndexModerator,
              findVoterisValid,
              getData,
              "findIndexModeratorfindIndexModerator"
            );
            if (findVoterisValid) {
              const voterResolution = {
                attachments: getData.attachments,
                decision: getData.resolution.resolutionDecision,
                decisionDate: getData.resolution.decisionAnnouncementDateTime,
                fK_VotingStatus_ID: findVoterisValid.fK_VotingStatus_ID,
                isAlreadyVoted: findVoterisValid.isAlreadyVoted,
                isAttachmentAvailable: getData.resolution.isAttachmentAvailable,
                isVoter: findVoterisValid.isVoter === true ? 1 : 0,
                resolutionID: getData.resolution.pK_ResolutionID,
                resolutionStatusID: getData.resolution.fK_ResolutionStatusID,
                resolutionTitle: getData.resolution.title,
                voterID: findVoterisValid.pK_RV_ID,
                votingDeadline: getData.resolution.votingDeadline,
                votingMethod: getData.resolution.votingMethod,
                votingStatus: findVoterisValid.status,
              };

              if (findIndexModerator === -1) {
                setSearchVoter((prev) => [voterResolution, ...prev]);
              } else {
                setSearchVoter((prev) => {
                  const copyData = [...prev];
                  copyData.splice(findIndexModerator, 1, voterResolution);
                  return copyData;
                });
              }
            }
          }
        } catch {}
        dispatch(resolutionMQTTCreate(null));
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [ResolutionReducermqttResolutionCreated]);

  useEffect(() => {
    try {
      if (ResolutionReducermqttResolutionCancelled !== null) {
        try {
          let findCancelledResolution = isSearchVoter.filter(
            (obj) =>
              obj.resolutionID !==
              ResolutionReducermqttResolutionCancelled.resolution
                .pK_ResolutionID
          );
          setSearchVoter(findCancelledResolution);
        } catch {}
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [ResolutionReducermqttResolutionCancelled]);

  useEffect(() => {
    if (ResolutionReducermqttResolutionClosed !== null) {
      try {
        let getData = ResolutionReducermqttResolutionCreated;
        let findIndexResolution = isSearchVoter.findIndex(
          (data, index) =>
            data.resolutionID === getData.resolution.pK_ResolutionID
        );
        if (resolutionView === 2) {
          if (buttonTab === 1) {
            let findCancelledResolution = isSearchVoter.filter(
              (obj) =>
                obj.resolutionID !==
                ResolutionReducermqttResolutionCancelled.resolution
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
  }, [ResolutionReducermqttResolutionClosed]);

  //Scroll for table
  const scroll = {
    y: "51vh",
    scrollbar: {
      verticalWidth: 20, // Width of the vertical scrollbar
      handleSize: 10, // Distance between data and scrollbar
    },
  };

  return (
    <>
      <section className={styles["resolution_container"]}>
        {ResolutionReducercreateResolutionModal ? (
          <>
            <ScheduleNewResolution />
          </>
        ) : ResolutionReducerviewResolutionModal ? (
          <>
            <ViewResolution />
          </>
        ) : resultresolution &&
          ResolutionReducerresultResolutionFlag === true ? (
          <>
            <ResultResolution
              setResultresolution={setResultresolution}
              resultresolution={resultresolution}
            />
          </>
        ) : voteresolution && ResolutionReducervoteResolutionFlag === true ? (
          <>
            <VotingPage
              setVoteresolution={setVoteresolution}
              voteresolution={voteresolution}
            />
          </>
        ) : viewattachmentpage &&
          ResolutionReducerviewAttachmentFlag === true ? (
          <>
            <ViewAttachments
              setViewattachmentpage={setViewattachmentpage}
              viewattachmentpage={viewattachmentpage}
              resolutionAttachments={resolutionAttachments}
            />
          </>
        ) : ResolutionReducerupdateResolutionModal ? (
          <>
            <EditResolution setCancelresolution={setCancelResolutionModal} />
          </>
        ) : (
          <>
            <Row className='mt-3'>
              <Col lg={12} md={12} sm={12}>
                <Row>
                  <Col
                    lg={7}
                    md={7}
                    sm={12}
                    className=' d-flex justify-content-start align-items-center  gap-3 '>
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
                          draggable='false'
                          src={plusbutton}
                          height='7.6px'
                          width='7.6px'
                          alt=''
                          className='align-items-center'
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
                    className=' d-flex justify-content-end  align-items-center  position-relative Search-filed-resolution'>
                    <span className={styles["search_input"]}>
                      <TextField
                        width='455px'
                        name='Title'
                        placeholder={t("Search")}
                        labelclass='textFieldSearch d-none'
                        value={allSearchInput}
                        change={(e) => filterResolution(e)}
                        onKeyDown={handleClickSearch}
                        applyClass={"resolution-search-input"}
                        iconclassname={
                          isSearching
                            ? styles["Search_IconWithCrossIcon"]
                            : styles["Search_Icon"]
                        }
                        inputicon={
                          <>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className='d-flex gap-1 align-items-center'>
                                {allSearchInput && enterpressed ? (
                                  <>
                                    <img
                                      src={BlackCrossIcon}
                                      className={styles["BlackCrossiconClass"]}
                                      draggable='false'
                                      alt=''
                                      onClick={handleResettingPage}
                                    />
                                  </>
                                ) : null}
                                <Tooltip
                                  placement='bottomLeft'
                                  title={t("Search-filters")}>
                                  <img
                                    draggable='false'
                                    src={searchicon}
                                    alt=''
                                    className={styles["searchIcon"]}
                                    onClick={openSearchBox}
                                  />
                                </Tooltip>
                              </Col>
                            </Row>
                          </>
                        }
                      />
                      {searchIcon ? (
                        <>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={
                                styles["Search_Box_Main_Resolution_page"]
                              }>
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className='d-flex justify-content-end'>
                                  <span>
                                    <img
                                      draggable='false'
                                      src={Cross}
                                      height='16px'
                                      alt=''
                                      width='16px'
                                      onClick={closeSeachBar}
                                    />
                                  </span>
                                </Col>
                              </Row>
                              <Row className='mt-3 d-flex justify-content-start align-items-start '>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={6}
                                  className='CreateMeetingReminder searchBox-dropdowns-resolution FontArabicRegular '>
                                  <span>
                                    {resolutionView === 2
                                      ? t("Decision-date")
                                      : t("Circulation-date")}
                                  </span>
                                  <DatePicker
                                    onFocusedDateChange={
                                      changeCirculateDateHandler
                                    }
                                    format={"DD/MM/YYYY"}
                                    minDate={moment().toDate()}
                                    placeholder='DD/MM/YYYY'
                                    render={
                                      <InputIcon
                                        placeholder='DD/MM/YYYY'
                                        className='datepicker_input'
                                      />
                                    }
                                    editable={false}
                                    className='datePickerTodoCreate2'
                                    onOpenPickNewDate={false}
                                    inputMode=''
                                    calendar={calendarValue}
                                    locale={localValue}
                                    ref={calendRef}
                                  />
                                </Col>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={6}
                                  className='CreateMeetingReminder  searchBox-dropdowns-resolution FontArabicRegular'>
                                  <span>{t("Voting-deadline")}</span>
                                  <DatePicker
                                    onFocusedDateChange={
                                      changeSearchDateHandler
                                    }
                                    format={"DD/MM/YYYY"}
                                    minDate={moment().toDate()}
                                    placeholder='DD/MM/YYYY'
                                    render={
                                      <InputIcon
                                        placeholder='DD/MM/YYYY'
                                        className='datepicker_input'
                                      />
                                    }
                                    editable={false}
                                    className='datePickerTodoCreate2'
                                    onOpenPickNewDate={false}
                                    inputMode=''
                                    calendar={calendarValue}
                                    locale={localValue}
                                    ref={calendRef}
                                  />
                                </Col>
                              </Row>
                              <Row className='mt-3'>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className='d-flex justify-content-end gap-3'>
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
                                      styles[
                                        "SearchButton_SearchBar_Resolution"
                                      ]
                                    }
                                    onClick={showSearchOptions}
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
              </Col>
            </Row>

            <Row className='mt-3'>
              <Col sm={12} md={12} lg={12} className='d-flex gap-2'>
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
              <Row className='mt-3'>
                <Col lg={12} md={12} sm={12}>
                  <>
                    <TableToDo
                      sortDirections={["descend", "ascend"]}
                      column={
                        buttonTab !== null && buttonTab === 2
                          ? columnsModeratorClosed
                          : columnsModerator
                      }
                      className='Resolution_table'
                      scroll={scroll}
                      pagination={false}
                      // loading={{
                      //   spinning: ResolutionReducerLoading,
                      // }}
                      rows={rows}
                      locale={{
                        emptyText: (
                          <>
                            <Row>
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["empty_Resolutions"]}>
                                <img
                                  draggable='false'
                                  src={EmptyResolution}
                                  width={200}
                                  alt=''
                                />
                                <h2 className={styles["NoResolutionHeading"]}>
                                  {t("No-resolution-to-display")}
                                </h2>
                                <p className={styles["NoResolution_Tagline"]}>
                                  {t("Seeking-opinions-on-something")}
                                </p>
                                {!isSearching && (
                                  <Button
                                    className={styles["create-Resolution-btn"]}
                                    text={
                                      <span
                                        className={styles["Btn_create_text"]}>
                                        {t("Create-new-resolution")}
                                      </span>
                                    }
                                    icon={
                                      <img
                                        draggable='false'
                                        src={plusbutton}
                                        height='7.6px'
                                        width='7.6px'
                                        alt=''
                                        className='align-items-center'
                                      />
                                    }
                                    onClick={() => createresolution()}
                                  />
                                )}
                                <div>
                                  <SpinComponent />
                                </div>
                              </Col>
                            </Row>
                          </>
                        ),
                      }}
                    />
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className='d-flex justify-content-center my-3 pagination-groups-table'>
                        <CustomPagination
                          current={
                            moderatorPage !== null ? Number(moderatorPage) : 1
                          }
                          onChange={handleChangeResolutionPagination}
                          pageSizeOptionsValues={["30", "50", "100", "200"]}
                          showSizer={true}
                          pageSize={
                            moderatorRows !== null ? Number(moderatorRows) : 50
                          }
                          className={styles["PaginationStyle-Resolution"]}
                          total={totalResolution}
                        />
                      </Col>
                    </Row>
                  </>
                </Col>
              </Row>
            ) : resolutionView !== null && resolutionView === 2 ? (
              <Row className='mt-3'>
                <Col lg={12} md={12} sm={12}>
                  <TableToDo
                    sortDirections={["descend", "ascend"]}
                    column={
                      buttonTab !== null && buttonTab === 2
                        ? columnsVotersClosed
                        : columnsvoters
                    }
                    className='Resolution_table'
                    scroll={scroll}
                    pagination={false}
                    // loading={{
                    //   indicator: (
                    //     <div className={styles["resolution_spinner"]}>
                    //       <SpinComponent />
                    //     </div>
                    //   ),
                    //   spinning: ResolutionReducerLoading,
                    // }}
                    rows={isSearchVoter}
                    locale={{
                      emptyText: (
                        <>
                          <Row>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className={styles["empty_Resolutions"]}>
                              <img
                                draggable='false'
                                src={EmptyResolution}
                                width={200}
                                alt=''
                              />
                              <h2 className={styles["NoResolutionHeading"]}>
                                {t("No-resolution-to-display")}
                              </h2>
                              <p className={styles["NoResolution_Tagline"]}>
                                {t("Seeking-opinions-on-something")}
                              </p>
                              {!isSearching && (
                                <Button
                                  className={styles["create-Resolution-btn"]}
                                  text={
                                    <span className={styles["Btn_create_text"]}>
                                      {t("Create-new-resolution")}
                                    </span>
                                  }
                                  icon={
                                    <img
                                      draggable='false'
                                      src={plusbutton}
                                      height='7.6px'
                                      width='7.6px'
                                      alt=''
                                      className='align-items-center'
                                    />
                                  }
                                  onClick={() => createresolution()}
                                />
                              )}
                              <div>
                                <SpinComponent />
                              </div>
                            </Col>
                          </Row>
                        </>
                      ),
                    }}
                  />
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className='d-flex justify-content-center my-3 pagination-groups-table'>
                      <CustomPagination
                        current={voterPage !== null ? Number(voterPage) : 1}
                        total={totalVoterResolution}
                        pageSize={voterRows !== null ? Number(voterRows) : 50}
                        pageSizeOptionsValues={["30", "50", "100", "200"]}
                        className={styles["PaginationStyle-Resolution"]}
                        onChange={handleChangeVoterResolutionPagination}
                        showSizer={true}
                      />
                    </Col>
                  </Row>
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
      <Notification open={open} setOpen={setOpen} />
      {AccessDeniedGlobalState && <AccessDeniedModal />}
    </>
  );
};

export default Resolution;
