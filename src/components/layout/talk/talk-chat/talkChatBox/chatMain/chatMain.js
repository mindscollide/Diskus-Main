import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import moment from "moment";
import { Row, Col, Container, Form, Dropdown } from "react-bootstrap";
import { Checkbox, Tooltip, Spin } from "antd";
import {
  oneToOneMessages,
  groupMessages,
} from "../../functions/oneToOneMessage";
import {
  InsertOTOMessages,
  DeleteSingleMessage,
  InsertPrivateGroupMessages,
  InsertBroadcastMessages,
  GetAllPrivateGroupMembers,
  GetActiveUsersByBroadcastID,
  MarkStarredUnstarredMessage,
  UpdatePrivateGroup,
  LeaveGroup,
  ResetLeaveGroupMessage,
  ResetGroupModify,
  ResetShoutAllCreated,
  PrintChat,
  DeleteShout,
  UpdateShoutAll,
  DownloadChat,
  EmailChat,
  pushChatData,
  downloadChatEmptyObject,
  DeleteMultipleMessages,
  getImageData,
  DownloadTalkFile,
} from "../../../../../../store/actions/Talk_action";
import {
  normalizeVideoPanelFlag,
  videoChatPanel,
  videoChatMessagesFlag,
} from "../../../../../../store/actions/VideoFeature_actions";
import {
  InitiateVideoCall,
  getVideoRecipentData,
  groupCallRecipients,
  callRequestReceivedMQTT,
} from "../../../../../../store/actions/VideoMain_actions";
import { checkFeatureIDAvailability } from "../../../../../../commen/functions/utils";
import { resetCloseChatFlags } from "../../../../../../store/actions/Talk_Feature_actions";
import {
  newTimeFormaterAsPerUTCTalkTime,
  newTimeFormaterAsPerUTCTalkDate,
  newTimeFormaterAsPerUTCTalkDateTime,
} from "../../../../../../commen/functions/date_formater";
import { DateSendingFormat } from "../../../../../../commen/functions/date_formater";
import {
  TextField,
  Button,
  NotificationBar,
  Modal,
  Notification,
} from "../../../../../elements";
import SecurityIcon from "../../../../../../assets/images/Security-Icon.png";
import CrossIcon from "../../../../../../assets/images/Cross_Icon.png";
import DoubleTickIcon from "../../../../../../assets/images/DoubleTick-Icon.png";
import DoubleTickDeliveredIcon from "../../../../../../assets/images/DoubleTickDelivered-Icon.png";
import SingleTickIcon from "../../../../../../assets/images/SingleTick-Icon.png";
import TimerIcon from "../../../../../../assets/images/Timer-Icon.png";
import CrossIconn from "../../../../../../assets/images/Cross_Icon.png";
import SecurityIconMessasgeBox from "../../../../../../assets/images/SecurityIcon-MessasgeBox.png";
import MenuIcon from "../../../../../../assets/images/Menu-Chat-Icon.png";
import VideoCallIcon from "../../../../../../assets/images/VideoCall-Icon.png";
import CloseChatIcon from "../../../../../../assets/images/Cross-Chat-Icon.png";
import SearchChatIcon from "../../../../../../assets/images/Search-Chat-Icon.png";
import EmojiIcon from "../../../../../../assets/images/Emoji-Select-Icon.png";
import UploadChatIcon from "../../../../../../assets/images/Upload-Chat-Icon.png";
import DeleteUploadIcon from "../../../../../../assets/images/Delete-Upload-Icon.png";
import DeleteChatFeature from "../../../../../../assets/images/Delete-ChatFeature-Icon.png";
import ChatSendIcon from "../../../../../../assets/images/Chat-Send-Icon.png";
import DownloadIcon from "../../../../../../assets/images/Download-Icon.png";
import DocumentIcon from "../../../../../../assets/images/Document-Icon.png";
import DropDownIcon from "../../../../../../assets/images/dropdown-icon.png";
import UploadDocument from "../../../../../../assets/images/Upload-Document.png";
import UploadPicVid from "../../../../../../assets/images/Upload-PicVid.png";
import SingleIcon from "../../../../../../assets/images/Single-Icon.png";
import GroupIcon from "../../../../../../assets/images/Group-Icon.png";
import ShoutIcon from "../../../../../../assets/images/Shout-Icon.png";
import StarredMessageIcon from "../../../../../../assets/images/Starred-Message-Icon.png";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import { useTranslation } from "react-i18next";
import { filesUrlTalk } from "../../../../../../commen/apis/Api_ends_points";
import useSnackbar from "../../../../../elements/snack_bar/useSnackbar";
import MessageInfoPanel from "./MessageInfoPanel";
import ForwardPanel from "./ForwardPanel";
import GroupInfoPanel from "./GroupInfoPanel";
import GroupEditPanel from "./GroupEditPanel";
import ShoutEditPanel from "./ShoutEditPanel";
import ChatActionModals from "./ChatActionModals";
import useChatMessagesSync from "./useChatMessagesSync";
import { HIDE_VIDEO } from "../../../../../../commen/featureFlags";

const ChatMainBody = ({ chatMessageClass }) => {
  const navigate = useNavigate();
  const [show, SnackBar] = useSnackbar();
  let currentUserId = localStorage.getItem("userID");

  let currentOrganizationId = localStorage.getItem("organizationID");

  let currentUserName = localStorage.getItem("name");

  let activeCall = JSON.parse(localStorage.getItem("activeCall"));

  let activeChatType = localStorage.getItem("ActiveChatType");

  const { t } = useTranslation();

  const dispatch = useDispatch();

  //Current language
  let lang = localStorage.getItem("i18nextLng");

  const { talkStateData } = useSelector((state) => state);
  var currentDateToday = moment().format("YYYYMMDD");

  let currentDateTime = new Date();
  let changeDateFormatCurrent = moment(currentDateTime).utc();
  let currentDateTimeUtc = moment(changeDateFormatCurrent).format(
    "YYYYMMDDHHmmss",
  );

  let currentUtcDate = currentDateTimeUtc.slice(0, 8);

  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1); // Subtract 1 day
  let changeDateFormatYesterday = moment(yesterdayDate).utc();
  let yesterdayDateUtc = moment(changeDateFormatYesterday).format("YYYYMMDD");

  function generateGUID() {
    const alphanumericChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomChars = Array.from(
      { length: 14 },
      () =>
        alphanumericChars[Math.floor(Math.random() * alphanumericChars.length)],
    );
    const currentDate = new Date();
    const currentUTCDateTime = currentDate
      .toISOString()
      .replace(/[-:.TZ]/g, "");

    return `${randomChars.join("")}_${currentUTCDateTime}_${currentUserId}_${
      talkStateData.ActiveChatData.id
    }`;
  }

  const chatMessages = useRef();

  const chatMessageRefs = useRef(0);

  const inputRef = useRef(null);

  const [file, setFile] = useState("");

  const [inputChat, setInputChat] = useState(true);

  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });
  const uploadFileRef = useRef();

  const [emojiActive, setEmojiActive] = useState(false);
  const emojiMenuRef = useRef();

  // Which side panel is showing (mutually exclusive):
  // null | "messageInfo" | "forward" | "groupInfo" | "groupEdit" | "shoutEdit"
  const [activePanel, setActivePanel] = useState(null);
  const closeAllPanels = () => setActivePanel(null);
  const openPanel = (name) => setActivePanel(name);

  // Which export/confirm modal is showing (mutually exclusive; only ever
  // rendered while activePanel === null):
  // null | "save" | "print" | "email" | "deleteSingle" | "leave"
  const [activeModal, setActiveModal] = useState(null);
  const closeModal = () => setActiveModal(null);
  const openModal = (name) => setActiveModal(name);

  const [todayCheckState, setTodayCheckState] = useState(false);
  const [allCheckState, setAllCheckState] = useState(false);
  const [customCheckState, setCustomCheckState] = useState(false);

  // Bulk message-select mode (checkboxes on messages + composer-footer
  // buttons): null | "forward" | "delete". Derive showCheckboxes from it.
  const [bulkSelectMode, setBulkSelectMode] = useState(null);
  const showCheckboxes = bulkSelectMode !== null;

  const [endDatedisable, setEndDatedisable] = useState(true);
  const [chatDateState, setChatDateState] = useState({
    StartDate: "",
    EndDate: "",
  });

  const [uploadOptions, setUploadOptions] = useState(false);

  // const [chatFeatureActive, setChatFeatureActive] = useState(0);

  const [replyFeature, setReplyFeature] = useState(false);

  const [replyData, setReplyData] = useState({
    messageID: 0,
    senderName: "",
    messageBody: "",
    fileName: "",
  });

  const [messagesChecked, setMessagesChecked] = useState([]);

  const [forwardUsersChecked, setForwardUsersChecked] = useState([]);

  const [messageInfoData, setMessageInfoData] = useState({
    sentDate: "",
    receivedDate: "",
    seenDate: "",
  });

  const [messageSendData, setMessageSendData] = useState({
    SenderID:
      currentUserId != null && currentUserId != undefined
        ? currentUserId.toString()
        : "",
    ReceiverID: "0",
    Body: "",
    MessageActivity: "Direct Message",
    FileName: "",
    FileGeneratedName: "",
    Extension: "",
    AttachmentLocation: "",
    UID: "",
    MessageID: 0,
  });

  const [showChatSearch, setShowChatSearch] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);

  const [searchChatWord, setSearchChatWord] = useState("");

  var min = 10000;
  var max = 90000;
  var id = min + Math.random() * (max - min);

  const [notification, setNotification] = useState({
    notificationShow: false,
    message: "",
  });

  const [notificationID, setNotificationID] = useState(0);

  const closeNotification = () => {
    setNotification({
      notificationShow: false,
      message: "",
    });
  };

  const autoResize = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset the height to auto to calculate the new height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to fit the content

    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
    const maxHeight = lineHeight * 4; // Limit the input to 4 lines
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.overflowY = "scroll"; // Enable vertical scrolling
      textarea.style.height = `${maxHeight}px`; // Set the fixed height
    } else {
      textarea.style.overflowY = "hidden"; // Disable vertical scrolling
    }
  };

  useEffect(() => {
    if (talkStateData.ActiveChatData !== null) {
      console.log(talkStateData.ActiveChatData, "ActiveChatDataActiveChatData");
    }
  }, [talkStateData.ActiveChatData]);
  useEffect(() => {
    if (talkStateData.ActiveChatData.messageType === "G") {
      let Data = {
        GroupID: talkStateData.ActiveChatData.id,
        ChannelID: parseInt(currentOrganizationId),
      };
      dispatch(GetAllPrivateGroupMembers(navigate, Data, t));
    }
  }, []);

  useEffect(() => {
    try {
      setMessageSendData({
        ...messageSendData,
        ReceiverID: talkStateData.ActiveChatData.id.toString(),
      });
    } catch {}
  }, [talkStateData.ActiveChatData]);

  const emojiClick = () => {
    if (emojiActive === false) {
      setEmojiActive(true);
    } else {
      setEmojiActive(false);
    }
  };

  const [uploadFileTalk, setUploadFileTalk] = useState({});

  const { allMessages, setAllMessages, allChatData, setAllChatData } =
    useChatMessagesSync({ uploadFileTalk });

  // Scroll to the bottom-of-list anchor (<div ref={chatMessages} /> at the
  // end of the message list) whenever the message list changes — covers
  // both sending/receiving a new message and switching to a different chat.
  useEffect(() => {
    chatMessages.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const ALLOWED_ATTACHMENT_EXTENSIONS = [
    "doc",
    "docx",
    "xls",
    "xlsx",
    "pdf",
    "png",
    "txt",
    "jpg",
    "jpeg",
    "gif",
  ];
  const MAX_ATTACHMENT_SIZE = 10000000; // 10MB

  const handleFileUpload = (data, uploadType) => {
    const uploadFilePath = data.target.value;
    const uploadedFile = data.target.files[0];
    const ext = uploadedFile.name.split(".").pop().toLowerCase();

    if (!ALLOWED_ATTACHMENT_EXTENSIONS.includes(ext)) {
      show(t("This file type is not supported."), "error");
      return;
    }
    if (uploadedFile.size === 0) {
      show(t("This file is empty."), "error");
      return;
    }
    if (uploadedFile.size > MAX_ATTACHMENT_SIZE) {
      show(t("File size must not exceed 10MB."), "error");
      return;
    }
    const isDuplicate = tasksAttachments.TasksAttachments.some(
      (attachment) => attachment.DisplayAttachmentName === uploadedFile.name,
    );
    if (isDuplicate) {
      show(t("This file has already been attached."), "error");
      return;
    }

    if (uploadType === "document") {
      setTasksAttachments({
        TasksAttachments: [
          ...tasksAttachments.TasksAttachments,
          {
            DisplayAttachmentName: uploadedFile.name,
            OriginalAttachmentName: uploadFilePath,
          },
        ],
      });
    } else if (uploadType === "image") {
      setFile(URL.createObjectURL(data.target.files[0]));
      setTasksAttachments({
        TasksAttachments: [
          ...tasksAttachments.TasksAttachments,
          {
            DisplayAttachmentName: uploadedFile.name,
            OriginalAttachmentName: uploadFilePath,
          },
        ],
      });
    }
    setUploadOptions(false);
    setUploadFileTalk(uploadedFile);
  };

  const deleteFilefromAttachments = (data, index) => {
    setTasksAttachments({
      ...tasksAttachments,
      TasksAttachments: [],
    });
    setUploadFileTalk({});
    setFile("");
  };

  const closeChat = () => {
    dispatch(videoChatMessagesFlag(false));
    dispatch(resetCloseChatFlags());
    closeAllPanels();
    closeModal();
    setBulkSelectMode(null);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
    setEmojiActive(false);
    setEndDatedisable(false);
    setUploadOptions(false);
    // setChatFeatureActive(0);
    setReplyFeature(false);
    setShowChatSearch(false);
    setAllMessages([]);
    setMessageSendData({
      ...messageSendData,
      Body: "",
    });
    localStorage.setItem("activeChatID", null);
    localStorage.setItem("activeOtoChatID", 0);
  };

  const modalHandlerSave = async (data) => {
    openModal("save");
    closeAllPanels();
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
  };

  const modalHandlerPrint = async (e) => {
    openModal("print");
    closeAllPanels();
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
  };

  const modalHandlerEmail = async (e) => {
    openModal("email");
    closeAllPanels();
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
  };

  function onChangeToday(e) {
    setTodayCheckState(e.target.checked);
    setAllCheckState(false);
    setCustomCheckState(false);
  }

  function onChangeAll(e) {
    setAllCheckState(e.target.checked);
    setTodayCheckState(false);
    setCustomCheckState(false);
  }

  function onChangeCustom(e) {
    setCustomCheckState(e.target.checked);
    setTodayCheckState(false);
    setAllCheckState(false);
  }

  const downloadChat = () => {
    let Data = {
      TalkRequest: {
        AdditionalChatFunctionsModel: {
          MyID: parseInt(currentUserId),
          ChatID: talkStateData.ActiveChatData.id,
          ChatType: talkStateData.ActiveChatData.messageType,
          ChannelID: parseInt(currentOrganizationId),
          FromDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                  allCheckState === true &&
                  customCheckState === false
                ? "19700101"
                : todayCheckState === false &&
                    allCheckState === false &&
                    customCheckState === true
                  ? chatDateState.StartDate
                  : "",
          ToDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                  allCheckState === true &&
                  customCheckState === false
                ? "20991231"
                : todayCheckState === false &&
                    allCheckState === false &&
                    customCheckState === true
                  ? chatDateState.EndDate
                  : "",
          IsEmail: false,
        },
      },
    };
    dispatch(DownloadChat(Data, t, navigate));
    closeModal();
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
  };

  const cancelButtonHandler = () => {
    closeModal();
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
  };

  const printChat = () => {
    let Data = {
      TalkRequest: {
        AdditionalChatFunctionsModel: {
          MyID: parseInt(currentUserId),
          ChatID: talkStateData.ActiveChatData.id,
          ChatType: talkStateData.ActiveChatData.messageType,
          ChannelID: parseInt(currentOrganizationId),
          FromDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                  allCheckState === true &&
                  customCheckState === false
                ? "19700101"
                : todayCheckState === false &&
                    allCheckState === false &&
                    customCheckState === true
                  ? chatDateState.StartDate
                  : "",
          ToDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                  allCheckState === true &&
                  customCheckState === false
                ? "20991231"
                : todayCheckState === false &&
                    allCheckState === false &&
                    customCheckState === true
                  ? chatDateState.EndDate
                  : "",
          IsEmail: false,
        },
      },
    };
    dispatch(PrintChat(Data, t, navigate));
    closeModal();
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
  };

  const cancelPrintHandler = () => {
    closeModal();
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
  };

  const emailChat = () => {
    let Data = {
      TalkRequest: {
        AdditionalChatFunctionsModel: {
          MyID: parseInt(currentUserId),
          ChatID: talkStateData.ActiveChatData.id,
          ChatType: talkStateData.ActiveChatData.messageType,
          ChannelID: parseInt(currentOrganizationId),
          FromDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                  allCheckState === true &&
                  customCheckState === false
                ? "19700101"
                : todayCheckState === false &&
                    allCheckState === false &&
                    customCheckState === true
                  ? chatDateState.StartDate
                  : "",
          ToDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                  allCheckState === true &&
                  customCheckState === false
                ? "20991231"
                : todayCheckState === false &&
                    allCheckState === false &&
                    customCheckState === true
                  ? chatDateState.EndDate
                  : "",
          IsEmail: true,
        },
      },
    };
    dispatch(EmailChat(Data, t, navigate));
    setNotification({
      notificationShow: true,
      message: t("Email-initiated"),
    });
    setNotificationID(id);
    closeModal();
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
  };
  const cancelPrintemailChatHandler = () => {
    closeModal();
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
  };

  const handleCancel = () => {
    closeAllPanels();
    closeModal();
    setBulkSelectMode(null);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
    setEmojiActive(false);
    setEndDatedisable(false);
    setUploadOptions(false);
    // setChatFeatureActive(0);
    setReplyFeature(false);
    setShowChatSearch(false);
    setForwardUsersChecked([]);
    setMessagesChecked([]);
    localStorage.setItem("activeChatID", null);
  };

  const cancelForwardSection = () => {
    closeAllPanels();
    setBulkSelectMode(null);
    setForwardUsersChecked([]);
    setMessagesChecked([]);
  };

  const onChangeDate = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    if (name === "StartDate" && value != "") {
      setChatDateState({
        ...chatDateState,
        [name]: DateSendingFormat(value),
      });
      setEndDatedisable(false);
    }
    if (name === "EndDate" && value != "") {
      setChatDateState({
        ...chatDateState,
        [name]: DateSendingFormat(value),
      });
    }
  };

  const showUploadOptions = () => {
    if (uploadOptions === false && talkStateData.ActiveChatData.isBlock === 0) {
      setUploadOptions(true);
    } else {
      setUploadOptions(false);
    }
  };

  const chatMessageHandler = (e) => {
    setMessageSendData((prevData) => ({
      ...prevData,
      Body: e.target.value,
    }));
  };

  const [emojiSelected, setEmojiSelected] = useState(false);

  const selectedEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    if (talkStateData.ActiveChatData.isBlock === 0) {
      setMessageSendData({
        ...messageSendData,
        Body: messageSendData.Body + emoji,
      });
      setInputChat(true);
    }
    setEmojiSelected(true);
    setEmojiActive(false);
    setInputChat(true);
  };

  const replyFeatureHandler = (record) => {
    // chatMessages.current?.scrollIntoView({ behavior: "auto" });
    let senderNameReply;
    if (record.senderName === currentUserName) {
      senderNameReply = "You";
    } else {
      senderNameReply = record.senderName;
    }
    if (replyFeature === false) {
      setReplyFeature(true);
      setReplyData({
        ...replyData,
        messageID: record.messageID,
        senderName: record.senderName,
        messageBody: record.messageBody,
        fileName: record.fileName,
      });
      setMessageSendData({
        ...messageSendData,
        MessageActivity:
          record.messageID +
          "|" +
          "" +
          "|" +
          talkStateData.ActiveChatData.messageType +
          "|" +
          senderNameReply +
          "|" +
          record.fileName +
          "|" +
          record.attachmentLocation +
          "|" +
          "Reply Message",
      });
    } else {
      setReplyFeature(false);
      setReplyData({
        ...replyData,
        messageID: 0,
        senderName: "",
        messageBody: "",
        fileName: "",
      });
      setMessageSendData({
        ...messageSendData,
        MessageActivity: "Direct Message",
      });
    }
  };

  const [deleteMessageData, setDeleteMessageData] = useState([]);

  const deleteFeatureHandler = (record) => {
    if (activeModal !== "deleteSingle") {
      openModal("deleteSingle");
      setDeleteMessageData(record);
    } else {
      closeModal();
    }
  };

  const forwardFeatureHandler = () => {
    if (bulkSelectMode === null) {
      setBulkSelectMode("forward");
    } else {
      setBulkSelectMode(null);
    }
  };

  const messageInfoHandler = (record) => {
    if (activePanel !== "messageInfo") {
      setMessageInfoData({
        ...messageInfoData,
        sentDate: record.sentDate,
        receivedDate: record.receivedDate,
        seenDate: record.seenDate,
      });
      openPanel("messageInfo");
    } else {
      closeAllPanels();
      setMessageInfoData({
        ...messageInfoData,
        sentDate: "",
        receivedDate: "",
        seenDate: "",
      });
    }
  };

  const markUnmarkStarMessageHandler = (record) => {
    let Data = {
      UserID: parseInt(currentUserId),
      MessageID: record.messageID,
      MessageType: talkStateData.ActiveChatData.messageType,
      IsFlag: record.isFlag === 0 ? true : false,
    };
    dispatch(MarkStarredUnstarredMessage(navigate, Data, t));
  };

  const messagesCheckedHandler = (data, id, index) => {
    if (messagesChecked.includes(data)) {
      let messageIndex = messagesChecked.findIndex(
        (data2, index) => data === data2,
      );
      if (messageIndex !== -1) {
        messagesChecked.splice(messageIndex, 1);
        setMessagesChecked([...messagesChecked]);
      }
    } else {
      messagesChecked.push(data);
      setMessagesChecked([...messagesChecked]);
    }
  };

  const deleteSingleMessage = (record) => {
    let Data = {
      UserID: parseInt(currentUserId),
      MessageType: talkStateData.ActiveChatData.messageType,
      MessageIds: record.messageID,
    };
    dispatch(DeleteSingleMessage(navigate, Data, t));
    closeModal();
  };

  const prepareMessageBody = (channelId, senderId, receiverId, messageBody) => {
    return {
      TalkRequest: {
        ChannelID: channelId,
        Message: {
          SenderID: String(senderId),
          ReceiverID: String(receiverId),
          Body: messageBody,
          MessageActivity: "Direct Message",
          FileName: "",
          FileGeneratedName: "",
          Extension: "",
          AttachmentLocation: "",
          UID: uniqueId,
          MessageID: 0,
        },
      },
    };
  };

  const submitForwardMessages = () => {
    closeAllPanels();
    setBulkSelectMode(null);
    forwardUsersChecked?.forEach((user) => {
      let { id, messageType } = user;
      if (messageType === "O") {
        messagesChecked?.map((message) =>
          dispatch(
            InsertOTOMessages(
              navigate,
              prepareMessageBody(
                parseInt(currentOrganizationId),
                parseInt(currentUserId),
                id,
                message.messageBody,
              ),
              uploadFileTalk,
              t,
            ),
          ),
        );
      } else if (messageType === "B") {
        messagesChecked?.map((message) =>
          dispatch(
            InsertBroadcastMessages(
              navigate,
              prepareMessageBody(
                parseInt(currentOrganizationId),
                parseInt(currentUserId),
                id,
                message.messageBody,
              ),
              t,
            ),
          ),
        );
      } else if (messageType === "G") {
        messagesChecked?.map((message) =>
          dispatch(
            InsertPrivateGroupMessages(
              navigate,
              prepareMessageBody(
                parseInt(currentOrganizationId),
                parseInt(currentUserId),
                id,
                message.messageBody,
              ),
              t,
            ),
          ),
        );
      }
    });
    setForwardUsersChecked([]);
  };

  const cancelMessagesCheck = () => {
    setBulkSelectMode(null);
  };

  const modalHandlerGroupInfo = () => {
    openPanel("groupInfo");
  };

  const deleteMultipleMessages = () => {
    setBulkSelectMode("delete");
  };

  const deleteMultipleMessagesButton = () => {
    // ✅ Remove duplicates based on messageID
    const uniqueMessages = Object.values(
      messagesChecked.reduce((acc, curr) => {
        acc[curr.messageID] = curr;
        return acc;
      }, {}),
    );

    const messageIDs = uniqueMessages.map((obj) => obj.messageID);

    console.log("Clean messageIDs:", messageIDs);

    const messageDeleteIDs = messageIDs.join("$");

    let Data = {
      TalkRequest: {
        UserID: Number(currentUserId),
        Message: {
          MessageType: talkStateData.ActiveChatData.messageType,
          MessageIds: messageDeleteIDs,
        },
      },
    };

    dispatch(DeleteMultipleMessages(Data, t, navigate));

    // ✅ Filter using CLEAN data
    const filteredMessages = allMessages.filter((message1) => {
      return !uniqueMessages.some(
        (message2) => message2.messageID === message1.messageID,
      );
    });

    setAllMessages(filteredMessages);

    // ✅ Fix notification (dynamic)
    const isSingleDelete = messageIDs.length === 1;

    setNotification({
      notificationShow: true,
      message: isSingleDelete ? "Message Deleted" : "Messages Deleted",
    });

    setNotificationID(id);

    setBulkSelectMode(null);

    // ✅ Reset selection
    setMessagesChecked([]);
  };

  const modalHandlerGroupEdit = () => {
    openPanel("groupEdit");
  };

  const deleteShoutFunction = () => {
    let Data = {
      TalkRequest: {
        UserID: parseInt(currentUserId),
        ChannelID: parseInt(currentOrganizationId),
        Group: {
          GroupID: talkStateData.ActiveChatData.id,
        },
      },
    };
    dispatch(DeleteShout(navigate, Data, t));
  };

  const editShoutFunction = () => {
    openPanel("shoutEdit");
  };

  const showChatSearchHandler = () => {
    if (showChatSearch === true) {
      setShowChatSearch(false);
      setSearchChatWord("");
    } else {
      setShowChatSearch(true);
      setSearchChatWord("");
    }
  };

  const chatSearchChange = (e) => {
    const searchedKeyword = e.target.value.toLowerCase();
    const allChatMessages = talkStateData.AllMessagesData;

    const originalCopy = allChatMessages ? [...getOriginalMessages()] : [];

    if (searchedKeyword !== "") {
      const filteredData = originalCopy.filter((message) =>
        message.messageBody.toLowerCase().includes(searchedKeyword),
      );
      setAllMessages(filteredData);
    } else {
      setAllMessages(originalCopy);
    }

    setSearchChatWord(e.target.value);
  };

  const getOriginalMessages = () => {
    const messageType = talkStateData.ActiveChatData.messageType;
    const allChatMessages = talkStateData.AllMessagesData;

    switch (messageType) {
      case "O":
        return allChatMessages.oneToOneMessages || [];
      case "G":
        return allChatMessages.groupMessages || [];
      case "B":
        if (allChatMessages.broadcastMessages) {
          return allChatMessages.broadcastMessages
            .filter(
              (messagesData) => messagesData.frMessages !== "Direct Message",
            )
            .map((messagesData) => ({
              messageID: messagesData.messageID,
              senderID: messagesData.senderID,
            }));
        }
        return [];
      default:
        return [];
    }
  };

  const closeChatSearch = () => {
    let allChatMessages = talkStateData.AllMessagesData;
    if (
      allChatMessages !== undefined &&
      allChatMessages !== null &&
      talkStateData.ActiveChatData.messageType === "O"
    ) {
      oneToOneMessages(setAllMessages, allChatMessages.oneToOneMessages);
    } else if (
      allChatMessages !== undefined &&
      allChatMessages !== null &&
      talkStateData.ActiveChatData.messageType === "G"
    ) {
      groupMessages(allChatMessages.groupMessages, setAllMessages);
    } else if (
      allChatMessages !== undefined &&
      allChatMessages !== null &&
      talkStateData.ActiveChatData.messageType === "B"
    ) {
      let allBroadcastMessagesArr = [];
      if (
        allChatMessages.broadcastMessages !== undefined &&
        allChatMessages.broadcastMessages !== null &&
        allChatMessages.broadcastMessages.length !== 0
      ) {
        allChatMessages.broadcastMessages.map((messagesData) => {
          if (messagesData.frMessages !== "Direct Message") {
            messagesData.frMessages = messagesData.frMessages.split("|");
          }
          allBroadcastMessagesArr.push({
            messageID: messagesData.messageID,
            senderID: messagesData.senderID,
            receiverID: messagesData.receiverID,
            messageBody: messagesData.messageBody,
            senderName: messagesData.senderName,
            isFlag: messagesData.isFlag,
            sentDate: messagesData.sentDate,
            currDate: messagesData.currDate,
            fileGeneratedName: messagesData.fileGeneratedName,
            fileName: messagesData.fileName,
            frMessages: messagesData.frMessages,
            broadcastName: messagesData.broadcastName,
            messageCount: messagesData.messageCount,
            attachmentLocation: messagesData.attachmentLocation,
            base64Image: messagesData.base64Image,
            attachmentId: messagesData.attachmentId,
            sourceMessageBody: messagesData.sourceMessageBody,
            sourceMessageId: messagesData.sourceMessageId,
          });
        });
      } else {
        allBroadcastMessagesArr = [];
      }
      setAllMessages([...allBroadcastMessagesArr]);
    }
    setShowChatSearch(false);
    setSearchChatWord("");
  };

  const uniqueId = generateGUID();

  const sendChat = async () => {
    if (
      messageSendData.Body !== "" ||
      (messageSendData.Body === "" &&
        tasksAttachments.TasksAttachments.length > 0)
    ) {
      let otoMessageLocal =
        JSON.parse(localStorage.getItem("singleMessageObject")) || [];

      let chatMessagesLocal =
        JSON.parse(localStorage.getItem("chatMessagesLocal")) || [];

      if (talkStateData.ActiveChatData.messageType === "O") {
        let Message = [];

        let chatMessage = [];

        let newMessageOto = {
          messageID: 0,
          senderID: parseInt(currentUserId),
          receiverID: parseInt(messageSendData.ReceiverID),
          messageBody: messageSendData.Body,
          senderName: currentUserName,
          receiverName: talkStateData.ActiveChatData.fullName,
          shoutAll: 0,
          frMessages: "Direct Message",
          broadcastName: "",
          isFlag: 0,
          sentDate: "",
          receivedDate: "",
          seenDate: "",
          currDate: currentDateTimeUtc,
          messageStatus: "Undelivered",
          fileGeneratedName: "",
          fileName: "",
          messageCount: 0,
          attachmentLocation: "",
          base64Image: "",
          attachmentId: 0,
          uid: uniqueId,
          blockCount: 0,
          sourceMessageBody: "",
          sourceMessageId: 0,
          isRetry: false,
        };

        let newMessageOtoLocal = {
          messageID: 0,
          senderID: parseInt(currentUserId),
          receiverID: parseInt(messageSendData.ReceiverID),
          messageBody: messageSendData.Body,
          senderName: currentUserName,
          receiverName: talkStateData.ActiveChatData.fullName,
          shoutAll: 0,
          frMessages: "Direct Message",
          broadcastName: "",
          isFlag: 0,
          sentDate: "",
          receivedDate: "",
          seenDate: "",
          currDate: currentDateTimeUtc,
          messageStatus: "Undelivered",
          fileGeneratedName: "",
          fileName: "",
          messageCount: 0,
          attachmentLocation: "",
          base64Image: "",
          attachmentId: 0,
          uid: uniqueId,
          blockCount: 0,
          sourceMessageBody: "",
          sourceMessageId: 0,
          isRetry: true,
        };

        let newChat = {
          id: parseInt(messageSendData.ReceiverID),
          fullName: talkStateData.ActiveChatData.fullName,
          imgURL: talkStateData.ActiveChatData.imgURL,
          messageBody: messageSendData.Body,
          messageDate: "",
          notiCount: talkStateData.ActiveChatData.notiCount,
          messageType: talkStateData.ActiveChatData.messageType,
          isOnline: talkStateData.ActiveChatData.isOnline,
          isBlock: 0,
          companyName: talkStateData.ActiveChatData.companyName,
          sentDate: "",
          receivedDate: "",
          seenDate: "",
          attachmentLocation: messageSendData.AttachmentLocation,
          base64Image: "",
          attachmentId: 0,
          senderID: parseInt(messageSendData.SenderID),
          admin: talkStateData.ActiveChatData.admin,
        };

        let Data = {
          TalkRequest: {
            ChannelID: parseInt(currentOrganizationId),
            Message: {
              ...messageSendData,
              UID: uniqueId,
            },
          },
        };

        if (otoMessageLocal) {
          Message = [...otoMessageLocal];
          Message.push(Data);
        } else {
          Message.push(Data);
        }

        if (chatMessagesLocal) {
          chatMessage = [...chatMessagesLocal];
          chatMessage.push(newMessageOtoLocal);
        } else {
          chatMessage.push(newMessageOtoLocal);
        }

        localStorage.setItem("singleMessageObject", JSON.stringify(Message));

        localStorage.setItem("chatMessagesLocal", JSON.stringify(chatMessage));

        dispatch(InsertOTOMessages(navigate, Data, uploadFileTalk, t));

        dispatch(pushChatData(newChat));

        setMessageSendData({
          ...messageSendData,
          SenderID: currentUserId.toString(),
          ReceiverID: messageSendData.ReceiverID,
          Body: "",
          MessageActivity: "Direct Message",
          FileName: "",
          FileGeneratedName: "",
          Extension: "",
          AttachmentLocation: "",
          UID: "",
          MessageID: 0,
        });

        setAllMessages((prevMessages) => [...prevMessages, newMessageOto]);
      }

      if (talkStateData.ActiveChatData.messageType === "G") {
        let Message = [];

        let Data = {
          TalkRequest: {
            ChannelID: parseInt(currentOrganizationId),
            Message: {
              ...messageSendData,
              UID: uniqueId,
            },
          },
        };

        if (otoMessageLocal) {
          Message = [...otoMessageLocal];
          Message.push(Data);
        } else {
          Message.push(Data);
        }

        dispatch(InsertPrivateGroupMessages(navigate, Data, uploadFileTalk, t));

        let newMessageGroup = {
          messageID: 0,
          senderID: parseInt(currentUserId),
          receiverID: parseInt(messageSendData.ReceiverID),
          messageBody: messageSendData.Body,
          senderName: currentUserName,
          shoutAll: 0,
          frMessages: "Direct Message",
          broadcastName: "",
          isFlag: 0,
          sentDate: currentDateTimeUtc,
          receivedDate: "",
          currDate: "",
          messageCount: 0,
          attachmentLocation: "",
          base64Image: "",
          attachmentId: 0,
          uid: uniqueId,
          sourceMessageBody: "",
          sourceMessageId: 0,
          isRetry: false,
        };

        let newChat = {
          id: parseInt(messageSendData.ReceiverID),
          fullName: talkStateData.ActiveChatData.fullName,
          imgURL: talkStateData.ActiveChatData.imgURL,
          messageBody: messageSendData.Body,
          messageDate: talkStateData.ActiveChatData.messageDate,
          notiCount: talkStateData.ActiveChatData.notiCount,
          messageType: talkStateData.ActiveChatData.messageType,
          isOnline: talkStateData.ActiveChatData.isOnline,
          companyName: talkStateData.ActiveChatData.companyName,
          sentDate: "",
          receivedDate: "",
          seenDate: "",
          attachmentLocation: messageSendData.AttachmentLocation,
          base64Image: "",
          attachmentId: 0,
          senderID: parseInt(messageSendData.SenderID),
          admin: talkStateData.ActiveChatData.admin,
        };

        dispatch(pushChatData(newChat));

        setMessageSendData({
          ...messageSendData,
          SenderID: currentUserId.toString(),
          ReceiverID: messageSendData.ReceiverID,
          Body: "",
          MessageActivity: "Direct Message",
          FileName: "",
          FileGeneratedName: "",
          Extension: "",
          AttachmentLocation: "",
          UID: "",
          MessageID: 0,
        });
        setAllMessages((prevMessages) => [...prevMessages, newMessageGroup]);
      } else if (talkStateData.ActiveChatData.messageType === "B") {
        let Message = [];

        let Data = {
          TalkRequest: {
            ChannelID: parseInt(currentOrganizationId),
            Message: {
              ...messageSendData,
              UID: uniqueId,
            },
          },
        };

        if (otoMessageLocal) {
          Message = [...otoMessageLocal];
          Message.push(Data);
        } else {
          Message.push(Data);
        }

        dispatch(InsertBroadcastMessages(navigate, Data, uploadFileTalk, t));

        let newMessageBroadcast = {
          attachmentLocation: "",
          base64Image: "",
          attachmentId: 0,
          blockCount: 0,
          broadcastName: talkStateData.ActiveChatData.fullName,
          currDate: currentDateTimeUtc,
          fileGeneratedName: "",
          fileName: "",
          frMessages: "Direct Message",
          isFlag: 0,
          messageBody: messageSendData.Body,
          messageCount: 0,
          messageID: 0,
          messageStatus: "Undelivered",
          receivedDate: "",
          receiverID: parseInt(messageSendData.ReceiverID),
          receiverName: "",
          seenDate: "",
          senderID: parseInt(messageSendData.SenderID),
          senderName: currentUserName,
          sentDate: "",
          shoutAll: 0,
          uid: uniqueId,
          isRetry: false,
        };

        let newChat = {
          id: parseInt(messageSendData.ReceiverID),
          fullName: talkStateData.ActiveChatData.fullName,
          imgURL: talkStateData.ActiveChatData.imgURL,
          messageBody: messageSendData.Body,
          messageDate: talkStateData.ActiveChatData.messageDate,
          notiCount: talkStateData.ActiveChatData.notiCount,
          messageType: talkStateData.ActiveChatData.messageType,
          isOnline: talkStateData.ActiveChatData.isOnline,
          companyName: talkStateData.ActiveChatData.companyName,
          sentDate: "",
          receivedDate: "",
          seenDate: "",
          attachmentLocation: messageSendData.AttachmentLocation,
          base64Image: "",
          attachmentId: 0,
          senderID: parseInt(messageSendData.SenderID),
          admin: talkStateData.ActiveChatData.admin,
        };

        dispatch(pushChatData(newChat));

        setMessageSendData({
          ...messageSendData,
          SenderID: currentUserId.toString(),
          ReceiverID: messageSendData.ReceiverID,
          Body: "",
          MessageActivity: "Direct Message",
          FileName: "",
          FileGeneratedName: "",
          Extension: "",
          AttachmentLocation: "",
          UID: "",
          MessageID: 0,
        });
        setAllMessages((prevMessages) => [
          ...prevMessages,
          newMessageBroadcast,
        ]);
      }

      setReplyFeature(false);
      setInputChat(true);
      setFile("");
      setTasksAttachments({
        ...tasksAttachments,
        TasksAttachments: [],
      });
      setUploadFileTalk({});
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.overflowY = "hidden";
      }
    }
  };

  const handleOutsideClick = (event) => {
    if (
      emojiMenuRef.current &&
      !emojiMenuRef.current.contains(event.target) &&
      emojiActive
    ) {
      setEmojiActive(false);
    }
    if (
      uploadFileRef.current &&
      !uploadFileRef.current.contains(event.target) &&
      uploadOptions
    ) {
      setUploadOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [emojiActive, uploadOptions]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputChat]);

  useEffect(() => {
    if (emojiSelected) {
      inputRef.current.focus();
      setEmojiSelected(false);
    }
  }, [emojiSelected]);

  useEffect(() => {
    if (
      talkStateData.UpdatePrivateGroup.UpdatePrivateGroupResponseMessage ===
      t("Group-modified")
    ) {
      setNotification({
        notificationShow: true,
        message:
          talkStateData.UpdatePrivateGroup.UpdatePrivateGroupResponseMessage,
      });
      setNotificationID(id);
      // Refresh the group's member list so Group Info reflects newly
      // added/removed members immediately, instead of only updating after
      // the chat is fully closed and reopened (which re-fetches on mount).
      if (talkStateData.ActiveChatData.messageType === "G") {
        dispatch(
          GetAllPrivateGroupMembers(
            navigate,
            {
              GroupID: talkStateData.ActiveChatData.id,
              ChannelID: parseInt(currentOrganizationId),
            },
            t,
          ),
        );
      }
      dispatch(ResetGroupModify());
    }
  }, [talkStateData.UpdatePrivateGroup.UpdatePrivateGroupResponseMessage]);

  const leaveGroupHandlerChat = (record) => {
    let data = {
      UserID: parseInt(currentUserId),
      GroupID: record.id,
    };
    dispatch(LeaveGroup(navigate, data, t));
    dispatch(videoChatMessagesFlag(false));
    dispatch(resetCloseChatFlags());
    closeAllPanels();
    closeModal();
    setBulkSelectMode(null);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
    setEmojiActive(false);
    setEndDatedisable(false);
    setUploadOptions(false);
    // setChatFeatureActive(0);
    setReplyFeature(false);
    setShowChatSearch(false);
    setAllMessages([]);
    setMessageSendData({
      ...messageSendData,
      Body: "",
    });
    localStorage.setItem("activeChatID", null);
    localStorage.setItem("activeOtoChatID", 0);
  };

  // Routes ChatActionModals' generic onConfirm/onCancel to the right
  // kind-specific handler based on which modal is currently active.
  const handleModalConfirm = () => {
    if (activeModal === "save") downloadChat();
    else if (activeModal === "print") printChat();
    else if (activeModal === "email") emailChat();
    else if (activeModal === "deleteSingle")
      deleteSingleMessage(deleteMessageData);
    else if (activeModal === "leave")
      leaveGroupHandlerChat(talkStateData.ActiveChatData);
  };

  const handleModalCancel = () => {
    if (activeModal === "save") cancelButtonHandler();
    else if (activeModal === "print") cancelPrintHandler();
    else if (activeModal === "email") cancelPrintemailChatHandler();
    else if (activeModal === "deleteSingle") handleCancel();
    else closeModal();
  };

  useEffect(() => {
    if (talkStateData.LeaveGroup.LeaveGroupResponseMessage === "Group-left") {
      setNotification({
        notificationShow: true,
        message: talkStateData.LeaveGroup.LeaveGroupResponseMessage,
      });
      setNotificationID(id);
    }
    dispatch(ResetLeaveGroupMessage());
  }, [talkStateData.LeaveGroup.LeaveGroupResponseMessage]);

  useEffect(() => {
    if (
      talkStateData.CreateShoutAllList.CreateShoutAllListResponseMessage ===
      t("Broadcast-list-created")
    ) {
      setNotification({
        notificationShow: true,
        message:
          talkStateData.CreateShoutAllList.CreateShoutAllListResponseMessage,
      });
      setNotificationID(id);
    }
    dispatch(ResetShoutAllCreated());
  }, [talkStateData.CreateShoutAllList.CreateShoutAllListResponseMessage]);

  const removeFileFunction = () => {
    setFile("");
    setUploadFileTalk({});
    setTasksAttachments({
      ...tasksAttachments,
      TasksAttachments: [],
    });
    // chatMessages.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    if (
      talkStateData.DownloadChatData.DownloadChatResponse !== null &&
      talkStateData.DownloadChatData.DownloadChatResponse !== undefined &&
      talkStateData.DownloadChatData.DownloadChatResponse.length !== 0
    ) {
      let fileDownloadURL =
        filesUrlTalk +
        talkStateData.DownloadChatData.DownloadChatResponse.filePath;
      window.open(fileDownloadURL, "_blank");
      dispatch(downloadChatEmptyObject([]));
    }
  }, [talkStateData?.DownloadChatData?.DownloadChatResponse]);

  const initiateOtoCall = () => {
    let recipientData = {
      userID: talkStateData.ActiveChatData.id,
      userName: talkStateData.ActiveChatData.fullName,
      email: "",
      designation: "",
      organizationName: talkStateData.ActiveChatData.companyName,
      profilePicture: {
        profilePictureID: "",
        displayProfilePictureName: "",
        orignalProfilePictureName: "",
        creationDate: "",
        creationTime: "",
      },
      userRole: {
        roleID: 1,
        role: "Board Member",
      },
      userStatus: {
        statusID: 1,
        status: "Enabled",
      },
    };
    dispatch(getVideoRecipentData(recipientData));
    let Data = {
      RecipentIDs: [talkStateData.ActiveChatData.id],
      CallTypeID: 1,
      OrganizationID: Number(currentOrganizationId),
    };
    localStorage.setItem("CallType", Data.CallTypeID);
    dispatch(InitiateVideoCall(Data, navigate, t));
    localStorage.setItem("activeCall", true);
    sessionStorage.setItem("activeCallSessionforOtoandGroup", true);

    localStorage.setItem("callerID", Number(currentUserId));
    localStorage.setItem("recipentCalledID", talkStateData.ActiveChatData.id);
    localStorage.setItem("isCaller", true);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(videoChatPanel(false));
    dispatch(resetCloseChatFlags());
    closeAllPanels();
    closeModal();
    setBulkSelectMode(null);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
    setEmojiActive(false);
    setEndDatedisable(false);
    setUploadOptions(false);
    // setChatFeatureActive(0);
    setReplyFeature(false);
    setShowChatSearch(false);
    setAllMessages([]);
    setMessageSendData({
      ...messageSendData,
      Body: "",
    });
    localStorage.setItem("activeChatID", null);
    localStorage.setItem("activeOtoChatID", 0);
  };

  const initiateGroupCall = () => {
    let newArray = [];
    let originalArray =
      talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
        .groupUsers;
    for (let i = 0; i < originalArray.length; i++) {
      let newObj = {
        userID: originalArray[i].userID,
        userName: originalArray[i].userName,
        email: originalArray[i].userEmail,
        designation: "",
        organizationName: originalArray[i].companyName,
        profilePicture: {
          profilePictureID: 0,
          displayProfilePictureName: "",
          orignalProfilePictureName: "",
          creationDate: "",
          creationTime: "",
        },
        userRole: {
          roleID: 1,
          role: "Board Member",
        },
        userStatus: {
          statusID: 1,
          status: "Enabled",
        },
      };
      newArray.push(newObj);
    }
    const filteredArray = newArray.filter(
      (item) => item.userID !== Number(currentUserId),
    );
    let newData = [];
    filteredArray.map((data) => {
      newData.push({
        RecipientName: data.userName,
        RecipientID: data.userID,
        CallStatus: "Ringging...",
        RoomID: 0,
      });
    });
    localStorage.setItem("callerStatusObject", JSON.stringify(newData));
    const recipientIDs = filteredArray.map((item) => item.userID);

    let Data = {
      RecipentIDs: recipientIDs,
      CallTypeID: 2,
      OrganizationID: Number(currentOrganizationId),
    };
    localStorage.setItem("CallType", Data.CallTypeID);
    dispatch(InitiateVideoCall(Data, navigate, t));
    localStorage.setItem("activeCall", true);
    sessionStorage.setItem("activeCallSessionforOtoandGroup", true);

    localStorage.setItem("callerID", Number(currentUserId));
    localStorage.setItem("isCaller", true);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(groupCallRecipients(filteredArray));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(videoChatPanel(false));
    dispatch(resetCloseChatFlags());
    closeAllPanels();
    closeModal();
    setBulkSelectMode(null);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
    setEmojiActive(false);
    setEndDatedisable(false);
    setUploadOptions(false);
    // setChatFeatureActive(0);
    setReplyFeature(false);
    setShowChatSearch(false);
    setAllMessages([]);
    setMessageSendData({
      ...messageSendData,
      Body: "",
    });
    localStorage.setItem("activeChatID", null);
    localStorage.setItem("activeOtoChatID", 0);
  };

  const retrySendingMessage = (data) => {
    let otoMessageLocal = JSON.parse(
      localStorage.getItem("singleMessageObject"),
    );
    let objectRemoved = false;
    let currentConnection = JSON.parse(
      localStorage.getItem("MqttConnectionState"),
    );

    if (Array.isArray(otoMessageLocal)) {
      for (let i = 0; i < otoMessageLocal.length; i++) {
        if (otoMessageLocal[i].TalkRequest.Message.UID === data.uid) {
          data.isRetry = false;
          if (currentConnection === true) {
            dispatch(
              InsertOTOMessages(
                navigate,
                otoMessageLocal[i],
                uploadFileTalk,
                t,
              ),
            );
          } else {
            data.isRetry = true;
          }
          objectRemoved = true; // Set the flag to true if the object is removed
          break; // Exit the loop once the object is found
        }
      }
    }
  };

  const deleteSingleMessageLocal = (data) => {
    let otoMessageLocal = JSON.parse(
      localStorage.getItem("singleMessageObject"),
    );

    let chatMessageLocal = JSON.parse(
      localStorage.getItem("chatMessagesLocal"),
    );

    let objectRemoved = false;

    if (Array.isArray(chatMessageLocal)) {
      for (let i = 0; i < chatMessageLocal.length; i++) {
        if (chatMessageLocal[i].uid === data.uid) {
          chatMessageLocal.splice(i, 1);
          objectRemoved = true; // Set the flag to true if the object is removed
          break; // Exit the loop once the object is found
        }
      }

      if (objectRemoved) {
        const updatedState = allMessages.filter(
          (item) => item.uid !== data.uid,
        );
        setAllMessages(updatedState);
        localStorage.setItem(
          "chatMessagesLocal",
          JSON.stringify(chatMessageLocal),
        );
      }
    } else {
    }

    if (Array.isArray(otoMessageLocal)) {
      for (let i = 0; i < otoMessageLocal.length; i++) {
        if (otoMessageLocal[i].TalkRequest.Message.UID === data.uid) {
          otoMessageLocal.splice(i, 1);
          objectRemoved = true; // Set the flag to true if the object is removed
          break; // Exit the loop once the object is found
        }
      }

      if (objectRemoved) {
        const updatedState = allMessages.filter(
          (item) => item.uid !== data.uid,
        );
        setAllMessages(updatedState);
        localStorage.setItem(
          "singleMessageObject",
          JSON.stringify(otoMessageLocal),
        );
      }
    } else {
    }
  };

  const handlePaste = (event) => {
    const clipboardItems = event.clipboardData && event.clipboardData.items;

    if (clipboardItems) {
      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          const fakeFileEvent = {
            target: {
              value: "",
              files: [blob],
            },
          };
          handleFileUpload(fakeFileEvent, "image");
          break;
        }
      }
    }
  };

  const imageClickFunction = (messageData) => {
    dispatch(getImageData(messageData));
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    dispatch(getImageData(null));
    setShowImageModal(false);
  };

  const DownloadFileFunction = (data, ext) => {
    console.log("DataDataData", data);
    let Data = {
      TalkRequest: {
        AttachmentId: data.attachmentId,
      },
    };
    dispatch(DownloadTalkFile(navigate, Data, ext, data.fileName, t));
  };

  return (
    <>
      <div className='positionRelative'>
        <div className={chatMessageClass}>
          <Container>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div
                  className={
                    activeModal !== null
                      ? "chat-header applyBlur"
                      : "chat-header"
                  }>
                  <Row>
                    <Col lg={1} md={1} sm={12}>
                      <div className='chat-profile-icon'>
                        {talkStateData.ActiveChatData.messageType === "O" ? (
                          <img
                            draggable='false'
                            src={SingleIcon}
                            width={25}
                            alt=''
                          />
                        ) : talkStateData.ActiveChatData.messageType === "G" ? (
                          <img
                            draggable='false'
                            src={GroupIcon}
                            width={30}
                            alt=''
                          />
                        ) : talkStateData.ActiveChatData.messageType === "B" ? (
                          <img
                            draggable='false'
                            src={ShoutIcon}
                            width={20}
                            alt=''
                          />
                        ) : null}
                      </div>
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                      <p className='chat-username chathead'>
                        {talkStateData.ActiveChatData.fullName}
                      </p>
                    </Col>
                    <Col lg={5} md={5} sm={12} className="d-flex justify-content-end align-items-center">
                      {" "}
                      <span>
                        <img
                          draggable='false'
                          onClick={showChatSearchHandler}
                          src={SearchChatIcon}
                          alt=''
                        />
                      </span>
                      <Dropdown className=' cursor-pointer positionRelative'>
                        <Dropdown.Toggle
                          // as="div"
                          className='talk-dropdown-toggle'
                          id='dropdown-basic'>
                          <img draggable='false' src={MenuIcon} alt='' />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {talkStateData.ActiveChatData.messageType === "O" && (
                            <>
                              <Dropdown.Item
                                onClick={() =>
                                  modalHandlerSave(talkStateData.ActiveChatData)
                                }>
                                {t("Save")}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  modalHandlerPrint(
                                    talkStateData.ActiveChatData,
                                  )
                                }>
                                {t("Print")}
                              </Dropdown.Item>
                              <Dropdown.Item
                                style={{ borderBottom: "none" }}
                                onClick={() =>
                                  modalHandlerEmail(
                                    talkStateData.ActiveChatData,
                                  )
                                }>
                                {t("Email")}
                              </Dropdown.Item>
                            </>
                          )}
                          {talkStateData.ActiveChatData.messageType === "G" && (
                            <>
                              <Dropdown.Item
                                onClick={() =>
                                  modalHandlerSave(talkStateData.ActiveChatData)
                                }>
                                {t("Save")}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  modalHandlerPrint(
                                    talkStateData.ActiveChatData,
                                  )
                                }>
                                {t("Print")}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  modalHandlerEmail(
                                    talkStateData.ActiveChatData,
                                  )
                                }>
                                {t("Email")}
                              </Dropdown.Item>
                              <Dropdown.Item onClick={modalHandlerGroupInfo}>
                                {t("Group-Info")}
                              </Dropdown.Item>
                              <Dropdown.Item onClick={deleteMultipleMessages}>
                                {t("Delete-messages")}
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => openModal("leave")}>
                                {t("Leave-Group")}
                              </Dropdown.Item>
                              <Dropdown.Item
                                style={{ borderBottom: "none" }}
                                onClick={modalHandlerGroupEdit}>
                                {t("Edit-Info")}
                              </Dropdown.Item>
                            </>
                          )}
                          {talkStateData.ActiveChatData.messageType === "B" && (
                            <>
                              <Dropdown.Item
                                onClick={() =>
                                  modalHandlerSave(talkStateData.ActiveChatData)
                                }>
                                {t("Save")}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  modalHandlerPrint(
                                    talkStateData.ActiveChatData,
                                  )
                                }>
                                {t("Print")}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  modalHandlerEmail(
                                    talkStateData.ActiveChatData,
                                  )
                                }>
                                {t("Email")}
                              </Dropdown.Item>
                              <Dropdown.Item onClick={deleteShoutFunction}>
                                {t("Delete-Shout")}
                              </Dropdown.Item>
                              <Dropdown.Item onClick={editShoutFunction}>
                                {t("Edit-shout")}
                              </Dropdown.Item>
                            </>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                      {activeCall === false &&
                      checkFeatureIDAvailability(5) &&
                      !HIDE_VIDEO ? (
                        <span>
                          <img
                            onClick={
                              activeChatType === "O"
                                ? initiateOtoCall
                                : activeChatType === "G"
                                  ? initiateGroupCall
                                  : null
                            }
                            draggable='false'
                            src={VideoCallIcon}
                            alt=''
                          />
                        </span>
                      ) : null}{" "}
                      <span className=' closechat' onClick={closeChat}>
                        <img
                          width={14}
                          draggable='false'
                          src={CloseChatIcon}
                          className='cursor-pointer'
                          alt=''
                        />
                      </span>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} className='p-0'>
                <div className='encryption-level-chat'>
                  <Row>
                    <Col lg={7} md={7} sm={12}>
                      <p className='level-heading'>{t("Crypto-Level")}</p>
                    </Col>
                    <Col lg={5} md={5} sm={12} className='positionRelative'>
                      <p className='level'>{t("NIAP-+-PQC")}</p>

                      <span className='securityicon-box'>
                        <img
                          draggable='false'
                          src={SecurityIconMessasgeBox}
                          style={{ width: "17px" }}
                          alt=''
                        />
                      </span>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            {showChatSearch === true ? (
              <>
                <Row>
                  <Col className='p-0'>
                    <div className='chat-searchfield'>
                      <TextField
                        maxLength={200}
                        applyClass='form-control2'
                        autoComplete='off'
                        name='Name'
                        change={chatSearchChange}
                        value={searchChatWord}
                        placeholder={t("Search-Chat")}
                        labelclass={"d-none"}
                        inputicon={
                          <span className='background-close-search'>
                            <img
                              onClick={closeChatSearch}
                              className='cursor-pointer'
                              src={CrossIcon}
                              alt=''
                            />
                          </span>
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </>
            ) : null}
            {/* Starting point  */}
            {activePanel === null ? (
              <>
                <Row>
                  <Col className='p-0'>
                    <div
                      className={
                        activeModal !== null
                          ? "chat-section applyBlur"
                          : showChatSearch === true
                            ? "chat-section searchField"
                            : "chat-section"
                      }
                      // key={Math.random()}
                    >
                      <>
                        {file === "" ? (
                          <div
                            className={
                              replyFeature === true ||
                              (file === "" &&
                                tasksAttachments.TasksAttachments.length > 0)
                                ? "chat-messages-section"
                                : ""
                            }>
                            {allMessages.length > 0 &&
                            talkStateData.ActiveChatData.messageType === "O" &&
                            talkStateData.ChatSpinner === false ? (
                              allMessages.map((messageData, index) => {
                                var ext = messageData.attachmentLocation
                                  .split(".")
                                  .pop();
                                if (
                                  messageData.senderID ===
                                  parseInt(currentUserId)
                                ) {
                                  const isLastMessage =
                                    index === allMessages.length - 1;
                                  return (
                                    <>
                                      <div
                                        key={index}
                                        className={`direct-chat-msg text-right mb-2 ${
                                          isLastMessage ? "last-message" : ""
                                        }`}>
                                        <div className='direct-chat-text message-outbox message-box text-start'>
                                          <div
                                            className='chatmessage-box-icons'
                                            ref={
                                              chatMessageRefs[
                                                messageData.messageID
                                              ]
                                            }>
                                            <Dropdown className='ChatsOneToOneDropDownSender border-none'>
                                              <Dropdown.Toggle id='dropdown-basic'>
                                                <img
                                                  draggable='false'
                                                  className='dropdown-icon'
                                                  src={DropDownIcon}
                                                  alt=''
                                                />
                                              </Dropdown.Toggle>
                                              <Dropdown.Menu
                                                className={
                                                  isLastMessage
                                                    ? "dropdown-menu-upwardsSender"
                                                    : "ChatsOneToOneDropDownMenuSender"
                                                }>
                                                <>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      replyFeatureHandler(
                                                        messageData,
                                                      )
                                                    }>
                                                    {t("Reply")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={
                                                      forwardFeatureHandler
                                                    }>
                                                    {t("Forward")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      deleteFeatureHandler(
                                                        messageData,
                                                      )
                                                    }>
                                                    {t("Delete for me")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      messageInfoHandler(
                                                        messageData,
                                                      )
                                                    }>
                                                    {t("Message-Info")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      markUnmarkStarMessageHandler(
                                                        messageData,
                                                      )
                                                    }
                                                    style={{
                                                      borderBottom: "none",
                                                    }}>
                                                    {messageData.isFlag ===
                                                    0 ? (
                                                      <>{t("Star-Message")}</>
                                                    ) : (
                                                      <>{t("Unstar-Message")}</>
                                                    )}
                                                  </Dropdown.Item>
                                                </>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </div>
                                          {messageData.frMessages ===
                                          "Direct Message" ? (
                                            <>
                                              {messageData.attachmentLocation !==
                                                "" &&
                                              (ext === "jpg" ||
                                                ext === "JPG" ||
                                                ext === "png" ||
                                                ext === "PNG" ||
                                                ext === "jpeg" ||
                                                ext === "JPEG") ? (
                                                <div
                                                  className='image-thumbnail-chat'
                                                  onClick={() =>
                                                    imageClickFunction(
                                                      messageData,
                                                    )
                                                  }>
                                                  {/* <a
                                                    href={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  > */}
                                                  <img
                                                    draggable='false'
                                                    // src={
                                                    //   filesUrlTalk +
                                                    //   messageData.attachmentLocation
                                                    // }
                                                    src={`data:image/jpeg;base64,${messageData.base64Image}`}
                                                    alt=''
                                                    className='cursor-pointer'
                                                  />
                                                  {/* </a> */}
                                                </div>
                                              ) : messageData.attachmentLocation !==
                                                  "" &&
                                                (ext === "doc" ||
                                                  ext === "docx" ||
                                                  ext === "xls" ||
                                                  ext === "xlsx" ||
                                                  ext === "pdf" ||
                                                  ext === "txt" ||
                                                  ext === "gif") ? (
                                                <div
                                                  className='file-uploaded-chat cursor-pointer'
                                                  onClick={() =>
                                                    DownloadFileFunction(
                                                      messageData,
                                                      ext,
                                                    )
                                                  }>
                                                  <img
                                                    draggable='false'
                                                    src={DocumentIcon}
                                                    alt=''
                                                  />
                                                  <span className='attached-file'>
                                                    {messageData.attachmentLocation
                                                      .substring(
                                                        messageData.attachmentLocation.lastIndexOf(
                                                          "/",
                                                        ) + 1,
                                                      )
                                                      .replace(/^\d+_/, "")}
                                                  </span>
                                                  {/* <a
                                                    href={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  > */}
                                                  <img
                                                    draggable='false'
                                                    src={DownloadIcon}
                                                    alt=''
                                                  />
                                                  {/* </a> */}
                                                </div>
                                              ) : null}
                                              <span className='direct-chat-body color-5a5a5a'>
                                                {messageData.messageBody}
                                              </span>
                                            </>
                                          ) : messageData.frMessages ===
                                            "Broadcast Message" ? (
                                            <>
                                              {messageData.attachmentLocation !==
                                                "" &&
                                              (ext === "jpg" ||
                                                ext === "JPG" ||
                                                ext === "png" ||
                                                ext === "PNG" ||
                                                ext === "jpeg" ||
                                                ext === "JPEG") ? (
                                                <div
                                                  onClick={() =>
                                                    imageClickFunction(
                                                      messageData,
                                                    )
                                                  }
                                                  className='image-thumbnail-chat'>
                                                  {/* <a
                                                    href={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  > */}
                                                  <img
                                                    draggable='false'
                                                    // src={
                                                    //   filesUrlTalk +
                                                    //   messageData.attachmentLocation
                                                    // }
                                                    src={`data:image/jpeg;base64,${messageData.base64Image}`}
                                                    alt=''
                                                    className='cursor-pointer'
                                                  />
                                                  {/* </a> */}
                                                </div>
                                              ) : messageData.attachmentLocation !==
                                                  "" &&
                                                (ext === "doc" ||
                                                  ext === "docx" ||
                                                  ext === "xls" ||
                                                  ext === "xlsx" ||
                                                  ext === "pdf" ||
                                                  ext === "txt" ||
                                                  ext === "gif") ? (
                                                <div
                                                  className='file-uploaded-chat cursor-pointer'
                                                  onClick={() =>
                                                    DownloadFileFunction(
                                                      messageData,
                                                      ext,
                                                    )
                                                  }>
                                                  <img
                                                    draggable='false'
                                                    src={DocumentIcon}
                                                    alt=''
                                                  />
                                                  <span className='attached-file'>
                                                    {messageData.attachmentLocation
                                                      .substring(
                                                        messageData.attachmentLocation.lastIndexOf(
                                                          "/",
                                                        ) + 1,
                                                      )
                                                      .replace(/^\d+_/, "")}
                                                  </span>
                                                  {/* <a
                                                    href={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  > */}
                                                  <img
                                                    draggable='false'
                                                    src={DownloadIcon}
                                                    alt=''
                                                  />
                                                  {/* </a> */}
                                                </div>
                                              ) : (
                                                <div className='replied-message-send'>
                                                  <p className='replied-message-sender m-0'>
                                                    {messageData.frMessages[3]}
                                                  </p>
                                                  <p className='replied-message m-0'>
                                                    {messageData.sourceMessageBody !==
                                                    ""
                                                      ? messageData.sourceMessageBody
                                                      : messageData
                                                          .frMessages[4]}
                                                  </p>
                                                </div>
                                              )}

                                              <span className='direct-chat-body color-5a5a5a'>
                                                {messageData.messageBody}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <div className='replied-message-send'>
                                                <p className='replied-message-sender m-0'>
                                                  {messageData.frMessages[3]}
                                                </p>
                                                <p className='replied-message m-0'>
                                                  {messageData.sourceMessageBody !==
                                                  ""
                                                    ? messageData.sourceMessageBody
                                                    : messageData.frMessages[4]}
                                                </p>
                                              </div>
                                              <span className='direct-chat-body color-5a5a5a'>
                                                {messageData.messageBody}
                                              </span>
                                            </>
                                          )}

                                          <div className='d-flex mt-1 justify-content-end'>
                                            <div className='star-time-status ml-auto text-end'>
                                              <span className='starred-status'>
                                                {messageData.isFlag === 1 ? (
                                                  <img
                                                    draggable='false'
                                                    src={StarredMessageIcon}
                                                    alt=''
                                                  />
                                                ) : null}
                                              </span>
                                              <span className='direct-chat-sent-time chat-datetime'>
                                                {messageData.sentDate.slice(
                                                  0,
                                                  8,
                                                ) === currentUtcDate ? (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkTime(
                                                      messageData.sentDate,
                                                      lang,
                                                    )}
                                                  </>
                                                ) : messageData.sentDate.slice(
                                                    0,
                                                    8,
                                                  ) === yesterdayDateUtc ? (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkDate(
                                                      messageData.sentDate,
                                                      lang,
                                                    ) + " "}
                                                    | {t("Yesterday")}
                                                  </>
                                                ) : messageData.sentDate ===
                                                  "" ? null : (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkDate(
                                                      messageData.sentDate,
                                                      lang,
                                                    )}
                                                  </>
                                                )}
                                              </span>
                                              <div className='message-status'>
                                                {messageData.messageStatus ===
                                                "Sent" ? (
                                                  <img
                                                    draggable='false'
                                                    src={SingleTickIcon}
                                                    alt=''
                                                  />
                                                ) : messageData.messageStatus ===
                                                  "Delivered" ? (
                                                  <img
                                                    draggable='false'
                                                    src={
                                                      DoubleTickDeliveredIcon
                                                    }
                                                    alt=''
                                                  />
                                                ) : messageData.messageStatus ===
                                                  "Seen" ? (
                                                  <img
                                                    draggable='false'
                                                    src={DoubleTickIcon}
                                                    alt=''
                                                  />
                                                ) : messageData.messageStatus ===
                                                    "Undelivered" &&
                                                  talkStateData.ActiveChatData
                                                    .messageType === "O" &&
                                                  messageData.isRetry ===
                                                    false ? (
                                                  <img
                                                    draggable='false'
                                                    src={TimerIcon}
                                                    alt=''
                                                  />
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                          {messageData.isRetry === true ? (
                                            <div className='options-rd'>
                                              <span
                                                onClick={() =>
                                                  retrySendingMessage(
                                                    messageData,
                                                    messageData.messageID,
                                                  )
                                                }
                                                className='option-r'>
                                                Retry
                                              </span>
                                              <span
                                                onClick={() =>
                                                  deleteSingleMessageLocal(
                                                    messageData,
                                                    messageData.messageID,
                                                  )
                                                }
                                                className='option-d'>
                                                Delete
                                              </span>
                                            </div>
                                          ) : null}
                                        </div>
                                        {showCheckboxes === true ? (
                                          <Checkbox
                                            checked={
                                              messagesChecked.includes(
                                                messageData,
                                              )
                                                ? true
                                                : false
                                            }
                                            onChange={() =>
                                              messagesCheckedHandler(
                                                messageData,
                                                index,
                                              )
                                            }
                                            className='chat-message-checkbox-receiver'
                                          />
                                        ) : null}
                                      </div>
                                    </>
                                  );
                                } else if (
                                  messageData.senderID !==
                                  parseInt(currentUserId)
                                ) {
                                  const isLastMessage =
                                    index === allMessages.length - 1;
                                  return (
                                    <div
                                      className={`direct-chat-msg text-left mb-2 ${
                                        isLastMessage ? "last-message" : ""
                                      }`}>
                                      {showCheckboxes === true ? (
                                        <Checkbox
                                          checked={
                                            messagesChecked.includes(
                                              messageData,
                                            )
                                              ? true
                                              : false
                                          }
                                          onChange={() =>
                                            messagesCheckedHandler(
                                              messageData,
                                              index,
                                            )
                                          }
                                          className='chat-message-checkbox-sender'
                                        />
                                      ) : null}

                                      <div className='direct-chat-text message-inbox message-box text-start ChatsOneToOne'>
                                        <div
                                          className='chatmessage-box-icons'
                                          ref={
                                            chatMessageRefs[
                                              messageData.messageID
                                            ]
                                          }>
                                          <Dropdown className='ChatsOneToOneDropDownReciever border-none'>
                                            <Dropdown.Toggle id='ChatsOneToOneDropDownRecieverToggle'>
                                              <img
                                                draggable='false'
                                                className='dropdown-icon'
                                                src={DropDownIcon}
                                                alt=''
                                              />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu
                                              className={
                                                isLastMessage
                                                  ? "dropdown-menu-upwardsReciever"
                                                  : "ChatsOneToOneDropDownMenuReciever"
                                              }
                                              popperConfig={{
                                                modifiers: [
                                                  {
                                                    name: "flip",
                                                    enabled: false,
                                                  },
                                                ],
                                              }}>
                                              <>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    replyFeatureHandler(
                                                      messageData,
                                                    )
                                                  }>
                                                  {t("Reply")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={
                                                    forwardFeatureHandler
                                                  }>
                                                  {t("Forward")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    deleteFeatureHandler(
                                                      messageData,
                                                    )
                                                  }>
                                                  {t("Delete for me")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    messageInfoHandler(
                                                      messageData,
                                                    )
                                                  }>
                                                  {t("Message-Info")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    markUnmarkStarMessageHandler(
                                                      messageData,
                                                    )
                                                  }
                                                  style={{
                                                    borderBottom: "none",
                                                  }}>
                                                  {messageData.isFlag === 0 ? (
                                                    <>{t("Star-Message")}</>
                                                  ) : (
                                                    <>{t("Unstar-Message")}</>
                                                  )}
                                                </Dropdown.Item>
                                              </>
                                            </Dropdown.Menu>
                                          </Dropdown>
                                        </div>
                                        {messageData.frMessages ===
                                          "Direct Message" ||
                                        messageData.frMessages ===
                                          "Broadcast Message" ? (
                                          <>
                                            {messageData.attachmentLocation !==
                                              "" &&
                                            (ext === "jpg" ||
                                              ext === "JPG" ||
                                              ext === "png" ||
                                              ext === "PNG" ||
                                              ext === "jpeg" ||
                                              ext === "JPEG") ? (
                                              <div
                                                onClick={() =>
                                                  imageClickFunction(
                                                    messageData,
                                                  )
                                                }
                                                className='image-thumbnail-chat'>
                                                {/* <a
                                                  href={
                                                    filesUrlTalk +
                                                    messageData.attachmentLocation
                                                  }
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                > */}
                                                <img
                                                  draggable='false'
                                                  // src={
                                                  //   filesUrlTalk +
                                                  //   messageData.attachmentLocation
                                                  // }
                                                  src={`data:image/jpeg;base64,${messageData.base64Image}`}
                                                  alt=''
                                                  className='cursor-pointer'
                                                />
                                                {/* </a> */}
                                              </div>
                                            ) : messageData.attachmentLocation !==
                                                "" &&
                                              (ext === "doc" ||
                                                ext === "docx" ||
                                                ext === "xls" ||
                                                ext === "xlsx" ||
                                                ext === "pdf" ||
                                                ext === "txt" ||
                                                ext === "gif") ? (
                                              <div
                                                className='file-uploaded-chat received cursor-pointer'
                                                onClick={() =>
                                                  DownloadFileFunction(
                                                    messageData,
                                                    ext,
                                                  )
                                                }>
                                                <img
                                                  draggable='false'
                                                  src={DocumentIcon}
                                                  alt=''
                                                />
                                                <span className='attached-file'>
                                                  {messageData.attachmentLocation
                                                    .substring(
                                                      messageData.attachmentLocation.lastIndexOf(
                                                        "/",
                                                      ) + 1,
                                                    )
                                                    .replace(/^\d+_/, "")}
                                                </span>
                                                {/* <a
                                                  href={
                                                    filesUrlTalk +
                                                    messageData.attachmentLocation
                                                  }
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                > */}
                                                <img
                                                  draggable='false'
                                                  src={DownloadIcon}
                                                  alt=''
                                                />
                                                {/* </a> */}
                                              </div>
                                            ) : null}
                                            <span className='direct-chat-body color-white'>
                                              {messageData.messageBody}
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <div className='replied-message-receive'>
                                              <p className='replied-message-receiver m-0'>
                                                {messageData.frMessages[3]}
                                              </p>
                                              <p className='replied-message m-0'>
                                                {messageData.sourceMessageBody !==
                                                ""
                                                  ? messageData.sourceMessageBody
                                                  : messageData.frMessages[4]}
                                              </p>
                                            </div>
                                            <span className='direct-chat-body color-white'>
                                              {messageData.messageBody}
                                            </span>
                                          </>
                                        )}
                                        <div className='d-flex mt-1 justify-content-end'>
                                          <div className='star-time-status ml-auto text-end'>
                                            <span className='starred-status'>
                                              {messageData.isFlag === 1 ? (
                                                <img
                                                  draggable='false'
                                                  src={StarredMessageIcon}
                                                  alt=''
                                                />
                                              ) : null}
                                            </span>
                                            <span className='direct-chat-sent-time chat-datetime'>
                                              {messageData.sentDate.slice(
                                                0,
                                                8,
                                              ) === currentUtcDate ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkTime(
                                                    messageData.sentDate,
                                                    lang,
                                                  )}
                                                </>
                                              ) : messageData.sentDate.slice(
                                                  0,
                                                  8,
                                                ) === yesterdayDateUtc ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                    lang,
                                                  ) + " "}
                                                  | {t("Yesterday")}
                                                </>
                                              ) : (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                    lang,
                                                  )}
                                                </>
                                              )}
                                            </span>
                                            <div className='message-status'></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              })
                            ) : allMessages.length > 0 &&
                              talkStateData.ActiveChatData.messageType ===
                                "G" &&
                              talkStateData.ChatSpinner === false ? (
                              allMessages.map((messageData, index) => {
                                console.log(
                                  messageData,
                                  "messageDatamessageDatamessageData",
                                );
                                var ext = messageData.attachmentLocation
                                  .split(".")
                                  .pop();
                                if (
                                  messageData.senderID ===
                                  parseInt(currentUserId)
                                ) {
                                  const isLastMessage =
                                    index === allMessages.length - 1;
                                  return (
                                    <div
                                      className={`direct-chat-msg text-right mb-2 ${
                                        isLastMessage ? "last-message" : ""
                                      }`}>
                                      <div className='direct-chat-text message-outbox message-box text-start'>
                                        <p className='group-sender-name'>
                                          {messageData.senderName}
                                        </p>
                                        <div
                                          className='chatmessage-box-icons'
                                          ref={
                                            chatMessageRefs[
                                              messageData.messageID
                                            ]
                                          }>
                                          <Dropdown className='border-none'>
                                            <Dropdown.Toggle id='dropdown-basic'>
                                              <img
                                                draggable='false'
                                                className='dropdown-icon'
                                                src={DropDownIcon}
                                                alt=''
                                              />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu
                                              className={
                                                isLastMessage
                                                  ? "dropdown-menu-upwards"
                                                  : ""
                                              }>
                                              <>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    replyFeatureHandler(
                                                      messageData,
                                                    )
                                                  }>
                                                  {t("Reply")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={
                                                    forwardFeatureHandler
                                                  }>
                                                  {t("Forward")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    deleteFeatureHandler(
                                                      messageData,
                                                    )
                                                  }>
                                                  {t("Delete for me")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    messageInfoHandler(
                                                      messageData,
                                                    )
                                                  }>
                                                  {t("Message-Info")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    markUnmarkStarMessageHandler(
                                                      messageData,
                                                    )
                                                  }
                                                  style={{
                                                    borderBottom: "none",
                                                  }}>
                                                  {messageData.isFlag === 0 ? (
                                                    <>{t("Star-Message")}</>
                                                  ) : (
                                                    <>{t("Unstar-Message")}</>
                                                  )}
                                                </Dropdown.Item>
                                              </>
                                            </Dropdown.Menu>
                                          </Dropdown>
                                        </div>
                                        {messageData.frMessages ===
                                          "Direct Message" ||
                                        messageData.frMessages ===
                                          "Broadcast Message" ? (
                                          <>
                                            {messageData.attachmentLocation !==
                                              "" &&
                                            (ext === "jpg" ||
                                              ext === "JPG" ||
                                              ext === "png" ||
                                              ext === "PNG" ||
                                              ext === "jpeg" ||
                                              ext === "JPEG") ? (
                                              <div
                                                onClick={() =>
                                                  imageClickFunction(
                                                    messageData,
                                                  )
                                                }
                                                className='image-thumbnail-chat'>
                                                <img
                                                  draggable='false'
                                                  src={`data:image/jpeg;base64,${messageData.base64Image}`}
                                                  alt=''
                                                  className='cursor-pointer'
                                                />
                                              </div>
                                            ) : messageData.attachmentLocation !==
                                                "" &&
                                              (ext === "doc" ||
                                                ext === "docx" ||
                                                ext === "xls" ||
                                                ext === "xlsx" ||
                                                ext === "pdf" ||
                                                ext === "txt" ||
                                                ext === "gif") ? (
                                              <div
                                                className='file-uploaded-chat cursor-pointer'
                                                onClick={() =>
                                                  DownloadFileFunction(
                                                    messageData,
                                                    ext,
                                                  )
                                                }>
                                                <img
                                                  draggable='false'
                                                  src={DocumentIcon}
                                                  alt=''
                                                />
                                                <span className='attached-file'>
                                                  {messageData.attachmentLocation
                                                    .substring(
                                                      messageData.attachmentLocation.lastIndexOf(
                                                        "/",
                                                      ) + 1,
                                                    )
                                                    .replace(/^\d+_/, "")}
                                                </span>
                                                <img
                                                  draggable='false'
                                                  src={DownloadIcon}
                                                  alt=''
                                                />
                                              </div>
                                            ) : null}
                                            <span className='direct-chat-body color-5a5a5a'>
                                              {messageData.messageBody}
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <div className='replied-message-send'>
                                              <p className='replied-message-sender m-0'>
                                                {messageData.frMessages[3]}
                                              </p>
                                              <p className='replied-message m-0'>
                                                {messageData.sourceMessageBody !==
                                                ""
                                                  ? messageData.sourceMessageBody
                                                  : messageData.frMessages[4]}
                                              </p>
                                            </div>
                                            <span className='direct-chat-body color-5a5a5a'>
                                              {messageData.messageBody}
                                            </span>
                                          </>
                                        )}
                                        <div className='d-flex mt-1 justify-content-end'>
                                          <div className='star-time-status ml-auto text-end'>
                                            <span className='starred-status'>
                                              {messageData.isFlag === 1 ? (
                                                <img
                                                  draggable='false'
                                                  src={StarredMessageIcon}
                                                  alt=''
                                                />
                                              ) : null}
                                            </span>
                                            <span className='direct-chat-sent-time chat-datetime'>
                                              {messageData.sentDate.slice(
                                                0,
                                                8,
                                              ) === currentUtcDate ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkTime(
                                                    messageData.sentDate,
                                                    lang,
                                                  )}
                                                </>
                                              ) : messageData.sentDate.slice(
                                                  0,
                                                  8,
                                                ) === yesterdayDateUtc ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                    lang,
                                                  ) + " "}
                                                  | {t("Yesterday")}
                                                </>
                                              ) : (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                    lang,
                                                  )}
                                                </>
                                              )}
                                            </span>
                                            <div className='message-status'>
                                              {messageData.messageStatus ===
                                              "Sent" ? (
                                                <img
                                                  draggable='false'
                                                  src={SingleTickIcon}
                                                  alt=''
                                                />
                                              ) : messageData.messageStatus ===
                                                "Delivered" ? (
                                                <img
                                                  draggable='false'
                                                  src={DoubleTickDeliveredIcon}
                                                  alt=''
                                                />
                                              ) : messageData.messageStatus ===
                                                "Seen" ? (
                                                <img
                                                  draggable='false'
                                                  src={DoubleTickIcon}
                                                  alt=''
                                                />
                                              ) : messageData.messageStatus ===
                                                  "Undelivered" &&
                                                talkStateData.ActiveChatData
                                                  .messageType === "O" &&
                                                messageData.isRetry ===
                                                  false ? (
                                                <img
                                                  draggable='false'
                                                  src={TimerIcon}
                                                  alt=''
                                                />
                                              ) : null}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {showCheckboxes === true ? (
                                        <Checkbox
                                          checked={
                                            messagesChecked.includes(
                                              messageData,
                                            )
                                              ? true
                                              : false
                                          }
                                          onChange={() =>
                                            messagesCheckedHandler(
                                              messageData,
                                              index,
                                            )
                                          }
                                          className='chat-message-checkbox-receiver'
                                        />
                                      ) : null}
                                    </div>
                                  );
                                } else {
                                  const isLastMessage =
                                    index === allMessages.length - 1;
                                  return (
                                    <div
                                      className={`direct-chat-msg text-left mb-2 ${
                                        isLastMessage ? "last-message" : ""
                                      }`}>
                                      {showCheckboxes === true ? (
                                        <Checkbox
                                          checked={
                                            messagesChecked.includes(
                                              messageData,
                                            )
                                              ? true
                                              : false
                                          }
                                          onChange={() =>
                                            messagesCheckedHandler(
                                              messageData,
                                              index,
                                            )
                                          }
                                          className='chat-message-checkbox-sender'
                                        />
                                      ) : null}

                                      <div className='direct-chat-text message-inbox message-box text-start'>
                                        <div
                                          className='chatmessage-box-icons'
                                          ref={
                                            chatMessageRefs[
                                              messageData.messageID
                                            ]
                                          }>
                                          <Dropdown className='border-none'>
                                            <Dropdown.Toggle id='dropdown-basic'>
                                              <img
                                                draggable='false'
                                                className='dropdown-icon'
                                                src={DropDownIcon}
                                                alt=''
                                              />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu
                                              className={
                                                isLastMessage
                                                  ? "dropdown-menu-upwards"
                                                  : ""
                                              }>
                                              <>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    replyFeatureHandler(
                                                      messageData,
                                                    )
                                                  }>
                                                  {t("Reply")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={
                                                    forwardFeatureHandler
                                                  }>
                                                  {t("Forward")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    deleteFeatureHandler(
                                                      messageData,
                                                    )
                                                  }>
                                                  {t("Delete for me")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    messageInfoHandler(
                                                      messageData,
                                                    )
                                                  }>
                                                  {t("Message-Info")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    markUnmarkStarMessageHandler(
                                                      messageData,
                                                    )
                                                  }
                                                  style={{
                                                    borderBottom: "none",
                                                  }}>
                                                  {messageData.isFlag === 0 ? (
                                                    <>{t("Star-Message")}</>
                                                  ) : (
                                                    <>{t("Unstar-Message")}</>
                                                  )}
                                                </Dropdown.Item>
                                              </>
                                            </Dropdown.Menu>
                                          </Dropdown>
                                        </div>
                                        {messageData.frMessages ===
                                          "Direct Message" ||
                                        messageData.frMessages ===
                                          "Broadcast Message" ? (
                                          <>
                                            <p className='group-sender-name'>
                                              {messageData.senderName}
                                            </p>
                                            <span className='direct-chat-body color-white'>
                                              {messageData.messageBody}
                                            </span>
                                            {messageData.attachmentLocation !==
                                              "" &&
                                            (ext === "jpg" ||
                                              ext === "JPG" ||
                                              ext === "png" ||
                                              ext === "PNG" ||
                                              ext === "jpeg" ||
                                              ext === "JPEG") ? (
                                              <div
                                                onClick={() =>
                                                  imageClickFunction(
                                                    messageData,
                                                  )
                                                }
                                                className='image-thumbnail-chat'>
                                                <img
                                                  draggable='false'
                                                  src={`data:image/jpeg;base64,${messageData.base64Image}`}
                                                  alt=''
                                                  className='cursor-pointer'
                                                />
                                              </div>
                                            ) : messageData.attachmentLocation !==
                                                "" &&
                                              (ext === "doc" ||
                                                ext === "docx" ||
                                                ext === "xls" ||
                                                ext === "xlsx" ||
                                                ext === "pdf" ||
                                                ext === "txt" ||
                                                ext === "gif") ? (
                                              <div
                                                className='file-uploaded-chat cursor-pointer'
                                                onClick={() =>
                                                  DownloadFileFunction(
                                                    messageData,
                                                    ext,
                                                  )
                                                }>
                                                <img
                                                  draggable='false'
                                                  src={DocumentIcon}
                                                  alt=''
                                                />
                                                <span className='attached-file'>
                                                  {messageData.attachmentLocation
                                                    .substring(
                                                      messageData.attachmentLocation.lastIndexOf(
                                                        "/",
                                                      ) + 1,
                                                    )
                                                    .replace(/^\d+_/, "")}
                                                </span>
                                                <img
                                                  draggable='false'
                                                  src={DownloadIcon}
                                                  alt=''
                                                />
                                              </div>
                                            ) : null}
                                            {/* <span className="direct-chat-body color-5a5a5a">
                                              {messageData.messageBody}
                                            </span> */}
                                          </>
                                        ) : (
                                          <>
                                            <p className='group-sender-name'>
                                              {messageData.senderName}
                                            </p>
                                            <div className='replied-message-receive'>
                                              <p className='replied-message-receiver m-0'>
                                                {messageData.frMessages[3]}
                                              </p>
                                              <p className='replied-message m-0'>
                                                {messageData.sourceMessageBody !==
                                                ""
                                                  ? messageData.sourceMessageBody
                                                  : messageData.frMessages[4]}
                                              </p>
                                            </div>
                                            <span className='direct-chat-body color-white'>
                                              {messageData.messageBody}
                                            </span>
                                          </>
                                        )}
                                        <div className='d-flex mt-1 justify-content-end'>
                                          <div className='star-time-status ml-auto text-end'>
                                            <span className='starred-status'>
                                              {messageData.isFlag === 1 ? (
                                                <img
                                                  draggable='false'
                                                  src={StarredMessageIcon}
                                                  alt=''
                                                />
                                              ) : null}
                                            </span>
                                            <span className='direct-chat-sent-time chat-datetime'>
                                              {messageData.sentDate.slice(
                                                0,
                                                8,
                                              ) === currentUtcDate ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkTime(
                                                    messageData.sentDate,
                                                    lang,
                                                  )}
                                                </>
                                              ) : messageData.sentDate.slice(
                                                  0,
                                                  8,
                                                ) === yesterdayDateUtc ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                    lang,
                                                  ) + " "}
                                                  | {t("Yesterday")}
                                                </>
                                              ) : (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                    lang,
                                                  )}
                                                </>
                                              )}
                                            </span>
                                            <div className='message-status'></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              })
                            ) : allMessages.length > 0 &&
                              talkStateData.ActiveChatData.messageType ===
                                "B" &&
                              talkStateData.ChatSpinner === false ? (
                              allMessages.map((messageData, index) => {
                                var ext = messageData.attachmentLocation
                                  .split(".")
                                  .pop();
                                if (
                                  messageData.senderID ===
                                  parseInt(currentUserId)
                                ) {
                                  const isLastMessage =
                                    index === allMessages.length - 1;
                                  return (
                                    <>
                                      <div
                                        className={`direct-chat-msg text-right mb-2 ${
                                          isLastMessage ? "last-message" : ""
                                        }`}>
                                        <div className='direct-chat-text message-outbox message-box text-start'>
                                          <div
                                            className='chatmessage-box-icons'
                                            ref={
                                              chatMessageRefs[
                                                messageData.messageID
                                              ]
                                            }>
                                            <Dropdown className='border-none'>
                                              <Dropdown.Toggle id='dropdown-basic'>
                                                <img
                                                  draggable='false'
                                                  className='dropdown-icon'
                                                  src={DropDownIcon}
                                                  alt=''
                                                />
                                              </Dropdown.Toggle>
                                              <Dropdown.Menu
                                                className={
                                                  isLastMessage
                                                    ? "dropdown-menu-upwards"
                                                    : ""
                                                }>
                                                <>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      replyFeatureHandler(
                                                        messageData,
                                                      )
                                                    }>
                                                    {t("Reply")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={
                                                      forwardFeatureHandler
                                                    }>
                                                    {t("Forward")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      deleteFeatureHandler(
                                                        messageData,
                                                      )
                                                    }>
                                                    {t("Delete for me")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      messageInfoHandler(
                                                        messageData,
                                                      )
                                                    }>
                                                    {t("Message-Info")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      markUnmarkStarMessageHandler(
                                                        messageData,
                                                      )
                                                    }
                                                    style={{
                                                      borderBottom: "none",
                                                    }}>
                                                    {messageData.isFlag ===
                                                    0 ? (
                                                      <>{t("Star-Message")}</>
                                                    ) : (
                                                      <>{t("Unstar-Message")}</>
                                                    )}
                                                  </Dropdown.Item>
                                                </>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </div>
                                          {messageData.frMessages ===
                                            "Direct Message" ||
                                          messageData.frMessages ===
                                            "Broadcast Message" ? (
                                            <>
                                              {messageData.attachmentLocation !==
                                                "" &&
                                              (ext === "jpg" ||
                                                ext === "JPG" ||
                                                ext === "png" ||
                                                ext === "PNG" ||
                                                ext === "jpeg" ||
                                                ext === "JPEG") ? (
                                                <div
                                                  onClick={() =>
                                                    imageClickFunction(
                                                      messageData,
                                                    )
                                                  }
                                                  className='image-thumbnail-chat'>
                                                  {/* <a
                                                    href={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  > */}
                                                  <img
                                                    draggable='false'
                                                    // src={
                                                    //   filesUrlTalk +
                                                    //   messageData.attachmentLocation
                                                    // }
                                                    src={`data:image/jpeg;base64,${messageData.base64Image}`}
                                                    alt=''
                                                    className='cursor-pointer'
                                                  />
                                                  {/* </a> */}
                                                </div>
                                              ) : messageData.attachmentLocation !==
                                                  "" &&
                                                (ext === "doc" ||
                                                  ext === "docx" ||
                                                  ext === "xls" ||
                                                  ext === "xlsx" ||
                                                  ext === "pdf" ||
                                                  ext === "txt" ||
                                                  ext === "gif") ? (
                                                <div
                                                  className='file-uploaded-chat cursor-pointer'
                                                  onClick={() =>
                                                    DownloadFileFunction(
                                                      messageData,
                                                      ext,
                                                    )
                                                  }>
                                                  <img
                                                    draggable='false'
                                                    src={DocumentIcon}
                                                    alt=''
                                                  />
                                                  <span className='attached-file'>
                                                    {messageData.attachmentLocation
                                                      .substring(
                                                        messageData.attachmentLocation.lastIndexOf(
                                                          "/",
                                                        ) + 1,
                                                      )
                                                      .replace(/^\d+_/, "")}
                                                  </span>
                                                  {/* <a
                                                    href={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  > */}
                                                  <img
                                                    draggable='false'
                                                    src={DownloadIcon}
                                                    alt=''
                                                  />
                                                  {/* </a> */}
                                                </div>
                                              ) : null}
                                              <span className='direct-chat-body color-5a5a5a'>
                                                {messageData.messageBody}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <div className='replied-message-send'>
                                                <p className='replied-message-sender m-0'>
                                                  {messageData.frMessages[3]}
                                                </p>
                                                <p className='replied-message m-0'>
                                                  {messageData.sourceMessageBody !==
                                                  ""
                                                    ? messageData.sourceMessageBody
                                                    : messageData.frMessages[4]}
                                                </p>
                                              </div>
                                              <span className='direct-chat-body color-5a5a5a'>
                                                {messageData.messageBody}
                                              </span>
                                            </>
                                          )}

                                          <div className='d-flex mt-1 justify-content-end'>
                                            <div className='star-time-status ml-auto text-end'>
                                              <span className='starred-status'>
                                                {messageData.isFlag === 1 ? (
                                                  <img
                                                    draggable='false'
                                                    src={StarredMessageIcon}
                                                    alt=''
                                                  />
                                                ) : null}
                                              </span>
                                              <span className='direct-chat-sent-time chat-datetime'>
                                                {messageData.sentDate.slice(
                                                  0,
                                                  8,
                                                ) === currentUtcDate ? (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkTime(
                                                      messageData.sentDate,
                                                      lang,
                                                    )}
                                                  </>
                                                ) : messageData.sentDate.slice(
                                                    0,
                                                    8,
                                                  ) === yesterdayDateUtc ? (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkDate(
                                                      messageData.sentDate,
                                                      lang,
                                                    ) + " "}
                                                    | {t("Yesterday")}
                                                  </>
                                                ) : messageData.sentDate ===
                                                  "" ? null : (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkDate(
                                                      messageData.sentDate,
                                                      lang,
                                                    )}
                                                  </>
                                                )}
                                              </span>
                                              <div className='message-status'>
                                                {messageData.messageStatus ===
                                                "Sent" ? (
                                                  <img
                                                    draggable='false'
                                                    src={SingleTickIcon}
                                                    alt=''
                                                  />
                                                ) : messageData.messageStatus ===
                                                  "Delivered" ? (
                                                  <img
                                                    draggable='false'
                                                    src={
                                                      DoubleTickDeliveredIcon
                                                    }
                                                    alt=''
                                                  />
                                                ) : messageData.messageStatus ===
                                                  "Seen" ? (
                                                  <img
                                                    draggable='false'
                                                    src={DoubleTickIcon}
                                                    alt=''
                                                  />
                                                ) : messageData.messageStatus ===
                                                    "Undelivered" &&
                                                  talkStateData.ActiveChatData
                                                    .messageType === "O" &&
                                                  messageData.isRetry ===
                                                    false ? (
                                                  <img
                                                    draggable='false'
                                                    src={TimerIcon}
                                                    alt=''
                                                  />
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {showCheckboxes === true ? (
                                          <Checkbox
                                            checked={
                                              messagesChecked.includes(
                                                messageData,
                                              )
                                                ? true
                                                : false
                                            }
                                            onChange={() =>
                                              messagesCheckedHandler(
                                                messageData,
                                                index,
                                              )
                                            }
                                            className='chat-message-checkbox-receiver'
                                          />
                                        ) : null}
                                      </div>
                                    </>
                                  );
                                }
                              })
                            ) : talkStateData.ChatSpinner === true ? (
                              <>
                                <Spin className='talk-overallchat-spinner' />
                              </>
                            ) : null}
                            <div ref={chatMessages} />
                          </div>
                        ) : (
                          <>
                            <div className='removeImage-thumbnail'>
                              <img
                                draggable='false'
                                onClick={removeFileFunction}
                                src={CrossIcon}
                                className='cursor-pointer'
                                alt=''
                              />
                            </div>
                            <div className='image-thumbnail'>
                              <img
                                draggable='false'
                                className='img-cover thumbnailImage'
                                src={file}
                                alt=''
                              />
                            </div>
                          </>
                        )}
                      </>

                      {replyFeature === true ? (
                        <div className='chat-feature-action'>
                          <p className='feature-name'>{t("Replying-to")}</p>
                          <div className='chat-feature'>
                            <div className='chat-feature-option'>
                              <p className='chat-feature-text'>
                                <span>
                                  {replyData.senderName === currentUserName
                                    ? "You"
                                    : replyData.senderName}
                                  <br />
                                </span>
                                {replyData.messageBody !== ""
                                  ? replyData.messageBody
                                  : replyData.fileName}
                              </p>
                              <div className='positionRelative'></div>
                            </div>
                          </div>
                          <div className='remove-chat-feature'>
                            <img
                              draggable='false'
                              src={DeleteChatFeature}
                              className='Remove-feature'
                              onClick={replyFeatureHandler}
                              alt=''
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col className='p-0'>
                    <>
                      {activeModal !== null ? (
                        <ChatActionModals
                          kind={activeModal}
                          todayCheckState={todayCheckState}
                          allCheckState={allCheckState}
                          customCheckState={customCheckState}
                          onCheckToday={onChangeToday}
                          onCheckAll={onChangeAll}
                          onCheckCustom={onChangeCustom}
                          chatDateState={chatDateState}
                          endDatedisable={endDatedisable}
                          onDateChange={onChangeDate}
                          onConfirm={handleModalConfirm}
                          onCancel={handleModalCancel}
                        />
                      ) : null}
                    </>
                  </Col>
                </Row>

                <Row>
                  <Col className='positionRelative p-0'>
                    <div
                      className={
                        activeModal !== null && activeModal !== "leave"
                          ? "chat-input-section applyBlur"
                          : "chat-input-section"
                      }>
                      {showCheckboxes === false ? (
                        <>
                          {file === "" &&
                          tasksAttachments.TasksAttachments.length > 0 ? (
                            <div className='uploaded-file-section'>
                              <div className='file-upload'>
                                <Row>
                                  {tasksAttachments.TasksAttachments.length > 0
                                    ? tasksAttachments.TasksAttachments.map(
                                        (data, index) => {
                                          var ext =
                                            data.DisplayAttachmentName.split(
                                              ".",
                                            ).pop();

                                          const first =
                                            data.DisplayAttachmentName.split(
                                              " ",
                                            )[0];
                                          return (
                                            <Col
                                              sm={12}
                                              lg={3}
                                              md={3}
                                              className='chat-upload-icon'>
                                              <img
                                                draggable='false'
                                                src={DocumentIcon}
                                                className='attachment-icon'
                                                extension={ext}
                                                alt=''
                                              />
                                              <p className='chat-upload-text'>
                                                {first}
                                              </p>
                                              <div className='delete-uplaoded-file'>
                                                <img
                                                  draggable='false'
                                                  src={DeleteUploadIcon}
                                                  className='delete-upload-file cursor-pointer'
                                                  onClick={() =>
                                                    deleteFilefromAttachments(
                                                      data,
                                                      index,
                                                    )
                                                  }
                                                  alt=''
                                                />
                                              </div>
                                            </Col>
                                          );
                                        },
                                      )
                                    : null}
                                </Row>
                              </div>
                            </div>
                          ) : null}
                          <div className='emoji-section' ref={emojiMenuRef}>
                            <div className='emoji-click' onClick={emojiClick}>
                              <img draggable='false' src={EmojiIcon} alt='' />
                            </div>
                            {emojiActive === true ? (
                              <Picker
                                data={data}
                                onEmojiSelect={selectedEmoji}
                                disabled={false}
                              />
                            ) : null}
                          </div>
                          {file === "" ? (
                            <div
                              className='upload-click positionRelative'
                              ref={uploadFileRef}>
                              <span className='custom-upload-input'>
                                <img
                                  draggable='false'
                                  src={UploadChatIcon}
                                  alt=''
                                  onClick={showUploadOptions}
                                />
                                {uploadOptions === true ? (
                                  <div className='upload-options'>
                                    <Tooltip
                                      placement='topRight'
                                      title={t("Document")}>
                                      <div className='file-upload-options'>
                                        <label
                                          className='image-upload'
                                          htmlFor='document-upload'>
                                          <img
                                            draggable='false'
                                            src={UploadDocument}
                                            alt=''
                                          />
                                        </label>
                                        <input
                                          id='document-upload'
                                          type='file'
                                          onChange={(event) =>
                                            handleFileUpload(event, "document")
                                          }
                                          onClick={(event) => {
                                            event.target.value = null;
                                          }}
                                          maxfilesize={10000000}
                                          accept='.doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg, .gif'
                                          style={{ display: "none" }}
                                        />
                                      </div>
                                    </Tooltip>

                                    <Tooltip
                                      placement='topRight'
                                      title={t("Upload-image")}>
                                      <div className='file-upload-options'>
                                        <label
                                          className='image-upload'
                                          htmlFor='image-upload'>
                                          <img
                                            draggable='false'
                                            src={UploadPicVid}
                                            alt=''
                                          />
                                        </label>
                                        <input
                                          id='image-upload'
                                          type='file'
                                          onChange={(event) =>
                                            handleFileUpload(event, "image")
                                          }
                                          onClick={(event) => {
                                            event.target.value = null;
                                          }}
                                          maxfilesize={10000000}
                                          accept='image/*'
                                          style={{ display: "none" }}
                                        />
                                      </div>
                                    </Tooltip>
                                  </div>
                                ) : null}
                              </span>
                            </div>
                          ) : null}

                          <div
                            className={
                              file === ""
                                ? "chat-input-field"
                                : "chat-input-field no-upload-options"
                            }>
                            <Form>
                              <Form.Control
                                onPaste={handlePaste}
                                ref={inputRef}
                                value={messageSendData.Body}
                                className='chat-message-input'
                                name='ChatMessage'
                                placeholder={"Type a Message"}
                                maxLength={200}
                                onChange={chatMessageHandler}
                                autoComplete='off'
                                disabled={
                                  talkStateData.ActiveChatData.isBlock === 1
                                    ? true
                                    : false
                                }
                                autoFocus={inputChat}
                                style={{ resize: "none", height: "100%" }}
                                as='textarea'
                                rows={1}
                                onInput={autoResize}
                                onKeyPress={(event) => {
                                  if (event.key === "Enter") {
                                    event.preventDefault();
                                    sendChat();
                                  }
                                }}
                              />
                            </Form>
                          </div>
                          <div className='sendChat-click'>
                            <img
                              draggable='false'
                              onClick={sendChat}
                              src={ChatSendIcon}
                              alt=''
                            />
                          </div>
                        </>
                      ) : bulkSelectMode === "forward" ? (
                        <>
                          <Button
                            className=' White-btn'
                            text={t("Cancel")}
                            onClick={cancelMessagesCheck}
                          />
                          <Button
                            className=' Ok-btn'
                            text={t("Forward")}
                            onClick={
                              activePanel === "forward"
                                ? submitForwardMessages
                                : () => openPanel("forward")
                            }
                            disableBtn={
                              messagesChecked.length > 0 ? false : true
                            }
                          />
                        </>
                      ) : bulkSelectMode === "delete" ? (
                        <>
                          <Button
                            className=' White-btn'
                            text={t("Cancel")}
                            onClick={cancelMessagesCheck}
                          />
                          <Button
                            className=' Ok-btn'
                            text={t("Delete")}
                            onClick={deleteMultipleMessagesButton}
                            disableBtn={
                              messagesChecked.length > 0 ? false : true
                            }
                          />
                        </>
                      ) : null}
                    </div>
                  </Col>
                </Row>
              </>
            ) : activePanel === "messageInfo" ? (
              <MessageInfoPanel
                messageInfoData={messageInfoData}
                lang={lang}
                onClose={handleCancel}
              />
            ) : activePanel === "forward" ? (
              <ForwardPanel
                forwardUsersChecked={forwardUsersChecked}
                setForwardUsersChecked={setForwardUsersChecked}
                onSubmit={submitForwardMessages}
                onCancel={cancelForwardSection}
              />
            ) : activePanel === "groupInfo" ? (
              <GroupInfoPanel
                groupId={talkStateData.ActiveChatData.id}
                channelId={parseInt(currentOrganizationId)}
                // NOTE: preserved as-is from before this extraction — this
                // reads the last-viewed MESSAGE's seen-date, not an actual
                // group creation date. Looks like a pre-existing bug (wrong
                // data source), left unfixed here since the correct field
                // isn't visible from this file; flagging rather than guessing.
                groupCreatedDate={messageInfoData.seenDate}
                lang={lang}
                onClose={handleCancel}
              />
            ) : activePanel === "groupEdit" ? (
              <GroupEditPanel
                groupId={talkStateData.ActiveChatData.id}
                channelId={parseInt(currentOrganizationId)}
                onClose={handleCancel}
              />
            ) : activePanel === "shoutEdit" ? (
              <ShoutEditPanel
                broadcastId={talkStateData.ActiveChatData.id}
                channelId={parseInt(currentOrganizationId)}
                onClose={handleCancel}
              />
            ) : null}
          </Container>
        </div>
      </div>
      <NotificationBar
        iconName={<img draggable='false' src={SecurityIcon} alt='' />}
        notificationMessage={notification.message}
        notificationState={notification.notificationShow}
        setNotification={setNotification}
        handleClose={closeNotification}
        id={notificationID}
      />
      {/* Toast Messege Notificaiton Component */}

      <Modal
        show={showImageModal}
        size='lg'
        modalHeaderClassName='image-modal'
        setShow={setShowImageModal}
        onHide={() => dispatch(getImageData(null), setShowImageModal(false))}
        ModalTitle={
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className='position-relative'
              onClick={closeImageModal}>
              <img className={"image-close"} src={CrossIconn} alt='' />
            </Col>
          </Row>
        }
        ModalBody={
          <img
            className='w-100'
            src={`data:image/jpeg;base64,${talkStateData?.imageData?.base64Image}`}
            alt=''
          />
        }
      />
      {SnackBar}
    </>
  );
};

export default ChatMainBody;
