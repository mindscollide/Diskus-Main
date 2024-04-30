import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import moment from "moment";
import { Row, Col, Container, Form, Dropdown } from "react-bootstrap";
import { Checkbox } from "antd";
import { Spin } from "antd";
import {
  oneToOneMessages,
  groupMessages,
  unreadMessageCountFunction,
  groupCreationFunction,
  markStarUnstarFunction,
  groupUpdationFunction,
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
  activeMessage,
  downloadChatEmptyObject,
  DeleteMultipleMessages,
  activeChat,
  OTOMessageSendSuccess,
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
import {
  resetCloseChatFlags,
  retryFlagState,
} from "../../../../../../store/actions/Talk_Feature_actions";
import {
  newTimeFormaterAsPerUTCTalkTime,
  newTimeFormaterAsPerUTCTalkDate,
  newTimeFormaterAsPerUTCTalkDateTime,
  newTimeFormaterMIAsPerUTCTalkDateTime,
} from "../../../../../../commen/functions/date_formater";
import {
  DateDisplayFormat,
  DateSendingFormat,
} from "../../../../../../commen/functions/date_formater";
import {
  TextField,
  InputDatePicker,
  Button,
  NotificationBar,
} from "../../../../../elements";
import SecurityIcon from "../../../../../../assets/images/Security-Icon.png";
import DoubleTickIcon from "../../../../../../assets/images/DoubleTick-Icon.png";
import DoubleTickDeliveredIcon from "../../../../../../assets/images/DoubleTickDelivered-Icon.png";
import SingleTickIcon from "../../../../../../assets/images/SingleTick-Icon.png";
import TimerIcon from "../../../../../../assets/images/Timer-Icon.png";
import CrossIcon from "../../../../../../assets/images/Cross-Icon.png";
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
import DropDownChatIcon from "../../../../../../assets/images/dropdown-icon-chatmessage.png";
import UploadDocument from "../../../../../../assets/images/Upload-Document.png";
import UploadPicVid from "../../../../../../assets/images/Upload-PicVid.png";
import UploadSticker from "../../../../../../assets/images/Upload-Sticker.png";
import SingleIcon from "../../../../../../assets/images/Single-Icon.png";
import GroupIcon from "../../../../../../assets/images/Group-Icon.png";
import ShoutIcon from "../../../../../../assets/images/Shout-Icon.png";
import StarredMessageIcon from "../../../../../../assets/images/Starred-Message-Icon.png";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import { useTranslation } from "react-i18next";
import { filesUrlTalk } from "../../../../../../commen/apis/Api_ends_points";
import enUS from "antd/es/date-picker/locale/en_US";
import { clippingParents } from "@popperjs/core";

const ChatMainBody = ({ chatMessageClass }) => {
  const navigate = useNavigate();

  let currentUserId = localStorage.getItem("userID");

  let currentOrganizationId = localStorage.getItem("organizationID");

  let currentUserName = localStorage.getItem("name");

  let activeCall = JSON.parse(localStorage.getItem("activeCall"));

  let activeChatType = localStorage.getItem("ActiveChatType");

  let currentConnection = JSON.parse(
    localStorage.getItem("MqttConnectionState")
  );

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { talkStateData, talkFeatureStates } = useSelector((state) => state);
  var currentDateToday = moment().format("YYYYMMDD");

  let currentDateTime = new Date();
  let changeDateFormatCurrent = moment(currentDateTime).utc();
  let currentDateTimeUtc = moment(changeDateFormatCurrent).format(
    "YYYYMMDDHHmmss"
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
        alphanumericChars[Math.floor(Math.random() * alphanumericChars.length)]
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

  const [searchUserValue, setSearchUserValue] = useState("");
  const [allChatData, setAllChatData] = useState([]);

  const [file, setFile] = useState("");

  const [inputChat, setInputChat] = useState(true);

  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });
  const uploadFileRef = useRef();

  const [emojiActive, setEmojiActive] = useState(false);
  const emojiMenuRef = useRef();
  const chatMenuRef = useRef(null);

  const [chatMenuActive, setChatMenuActive] = useState(false);

  const [save, setSave] = useState(false);
  const [print, setPrint] = useState(false);
  const [email, setEmail] = useState(false);
  const [leave, setLeave] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [messageInfo, setMessageInfo] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showGroupEdit, setShowGroupEdit] = useState(false);

  const [todayCheckState, setTodayCheckState] = useState(false);
  const [allCheckState, setAllCheckState] = useState(false);
  const [customCheckState, setCustomCheckState] = useState(false);

  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const [endDatedisable, setEndDatedisable] = useState(true);
  const [chatDateState, setChatDateState] = useState({
    StartDate: "",
    EndDate: "",
  });

  const [uploadOptions, setUploadOptions] = useState(false);

  const [isRetryFlag, setIsRetryFlag] = useState(false);

  // const [chatFeatureActive, setChatFeatureActive] = useState(0);

  const [replyFeature, setReplyFeature] = useState(false);

  const [allMessages, setAllMessages] = useState([]);

  const [allUsers, setAllUsers] = useState([]);

  const [allUsersGroupsRooms, setAllUsersGroupsRooms] = useState([]);

  const [replyData, setReplyData] = useState({
    messageID: 0,
    senderName: "",
    messageBody: "",
    fileName: "",
  });

  const [messagesChecked, setMessagesChecked] = useState([]);

  const [forwardUsersChecked, setForwardUsersChecked] = useState([]);

  const [forwardMessageUsersSection, setForwardMessageUsersSection] =
    useState(false);

  const [editGroupUsersChecked, setEditGroupUsersChecked] = useState([]);

  const [editShoutUsersChecked, setEditShoutUsersChecked] = useState([]);

  const [forwardFlag, setForwardFlag] = useState(false);

  const [deleteFlag, setDeleteFlag] = useState(false);

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

  const [groupInfoData, setGroupInfoData] = useState([]);

  const [shoutAllUsersData, setShoutAllUsersData] = useState([]);

  const [groupName, setGroupName] = useState("");

  const [shoutName, setShoutName] = useState("");

  const [searchGroupUserInfoValue, setSearchGroupUserInfoValue] = useState("");

  const [searchUserShoutValue, setSearchUserShoutValue] = useState("");

  const [showEditGroupField, setShowEditGroupField] = useState(false);

  const [showEditShoutField, setShowEditShoutField] = useState(false);

  const [showChatSearch, setShowChatSearch] = useState(false);

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

  useEffect(() => {
    if (
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      setAllChatData(
        talkStateData?.AllUserChats?.AllUserChatsData?.allMessages
      );
    }
  }, [talkStateData?.AllUserChats?.AllUserChatsData?.allMessages]);

  useEffect(() => {
    if (
      talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse !==
        undefined &&
      talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse !==
        null &&
      talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
        .length !== 0
    ) {
      setGroupInfoData(
        talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
          ?.groupUsers
      );
      const firstGroupUser =
        talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
          ?.groupUsers[0];

      if (firstGroupUser && firstGroupUser.name) {
        setGroupName(firstGroupUser.name);
      }
    }
  }, [
    talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
      ?.groupUsers,
  ]);

  useEffect(() => {
    if (
      talkStateData?.ActiveUsersByBroadcastID?.ActiveUsersByBroadcastIDData !==
        undefined &&
      talkStateData?.ActiveUsersByBroadcastID?.ActiveUsersByBroadcastIDData !==
        null &&
      talkStateData?.ActiveUsersByBroadcastID?.ActiveUsersByBroadcastIDData
        .length !== 0
    ) {
      setShoutAllUsersData(
        talkStateData?.ActiveUsersByBroadcastID?.ActiveUsersByBroadcastIDData
          ?.broadcastUsers
      );
      const firstShoutUser =
        talkStateData?.ActiveUsersByBroadcastID?.ActiveUsersByBroadcastIDData
          ?.broadcastUsers[0];

      if (firstShoutUser && firstShoutUser.name) {
        setShoutName(firstShoutUser.name);
      }
    }
  }, [
    talkStateData?.ActiveUsersByBroadcastID?.ActiveUsersByBroadcastIDData
      ?.broadcastUsers,
  ]);

  const groupNameHandler = (e) => {
    setGroupName(e.target.value);
  };

  const shoutNameHandler = (e) => {
    setShoutName(e.target.value);
  };

  useEffect(() => {
    if (
      talkStateData.AllUsers.AllUsersData !== undefined &&
      talkStateData.AllUsers.AllUsersData !== null &&
      talkStateData.AllUsers.AllUsersData.length !== 0
    ) {
      setAllUsers(talkStateData.AllUsers.AllUsersData.allUsers);
    }
  }, [talkStateData?.AllUsers?.AllUsersData?.allUsers]);

  useEffect(() => {
    let privateGroupMembers =
      talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
        .groupUsers;
    let allUsers = talkStateData.AllUsers.AllUsersData.allUsers;
    if (
      privateGroupMembers !== undefined &&
      privateGroupMembers !== null &&
      allUsers !== undefined &&
      allUsers !== null
    ) {
      let groupMembersArray = privateGroupMembers
        .filter((item) => {
          return allUsers.some((user) => user.id === item.userID);
        })
        .map((item) => item.userID);

      setEditGroupUsersChecked(groupMembersArray);
    }
  }, [
    talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
      .groupUsers,
  ]);

  useEffect(() => {
    let shoutMembersData =
      talkStateData.ActiveUsersByBroadcastID.ActiveUsersByBroadcastIDData
        .broadcastUsers;
    let allUsers = talkStateData.AllUsers.AllUsersData.allUsers;
    if (
      shoutMembersData !== undefined &&
      shoutMembersData !== null &&
      allUsers !== undefined &&
      allUsers !== null
    ) {
      let groupMembersArray = shoutMembersData
        .filter((item) => {
          return allUsers.some((user) => user.id === item.userID);
        })
        .map((item) => item.userID);

      setEditShoutUsersChecked(groupMembersArray);
    }
  }, [
    talkStateData.ActiveUsersByBroadcastID.ActiveUsersByBroadcastIDData
      .broadcastUsers,
  ]);

  useEffect(() => {
    if (
      talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData !==
        undefined &&
      talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData !==
        null &&
      talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData
        .length !== 0
    ) {
      setAllUsersGroupsRooms(
        talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData
          .userInformation
      );
    }
  }, [
    talkStateData?.AllUsersGroupsRoomsList?.AllUsersGroupsRoomsListData
      ?.userInformation,
  ]);

  const emojiClick = () => {
    if (emojiActive === false) {
      setEmojiActive(true);
    } else {
      setEmojiActive(false);
    }
  };

  const [uploadFileTalk, setUploadFileTalk] = useState({});

  const handleFileUpload = (data, uploadType) => {
    if (uploadType === "document") {
      const uploadFilePath = data.target.value;
      const uploadedFile = data.target.files[0];
      var ext = uploadedFile.name.split(".").pop();
      let file = [];
      if (
        ext === "doc" ||
        ext === "docx" ||
        ext === "xls" ||
        ext === "xlsx" ||
        ext === "pdf" ||
        ext === "png" ||
        ext === "txt" ||
        ext === "jpg" ||
        ext === "jpeg" ||
        ext === "gif"
      ) {
        let data;
        let sizezero;
        let size;
        if (file.length > 0) {
          file.map((filename, index) => {
            if (filename.DisplayFileName === uploadedFile.name) {
              data = false;
            }
          });
          if (uploadedFile.size > 10000000) {
            size = false;
          } else if (uploadedFile.size === 0) {
            sizezero = false;
          }
          if (data === false) {
          } else if (size === false) {
          } else if (sizezero === false) {
          } else {
            setUploadFileTalk(uploadedFile);
          }

          if (size === false) {
          } else if (sizezero === false) {
          } else {
            setUploadFileTalk(uploadedFile);
          }
        }
      }
      file.push({
        DisplayAttachmentName: uploadedFile.name,
        OriginalAttachmentName: uploadFilePath,
      });
      setTasksAttachments({ ["TasksAttachments"]: file });
      setUploadOptions(false);
      setUploadFileTalk(uploadedFile);
    } else if (uploadType === "image") {
      const uploadFilePath = data.target.value;
      const uploadedFile = data.target.files[0];
      var ext = uploadedFile.name.split(".").pop();
      let file = [];
      if (
        ext === "doc" ||
        ext === "docx" ||
        ext === "xls" ||
        ext === "xlsx" ||
        ext === "pdf" ||
        ext === "png" ||
        ext === "txt" ||
        ext === "jpg" ||
        ext === "jpeg" ||
        ext === "gif"
      ) {
        let data;
        let sizezero;
        let size;
        if (file.length > 0) {
          file.map((filename, index) => {
            if (filename.DisplayFileName === uploadedFile.name) {
              data = false;
            }
          });
          if (uploadedFile.size > 10000000) {
            size = false;
          } else if (uploadedFile.size === 0) {
            sizezero = false;
          }
          if (data === false) {
          } else if (size === false) {
          } else if (sizezero === false) {
          } else {
            setUploadFileTalk(uploadedFile);
          }

          if (size === false) {
          } else if (sizezero === false) {
          } else {
            setUploadFileTalk(uploadedFile);
          }
        }
      }
      setFile(URL.createObjectURL(data.target.files[0]));
      setUploadOptions(false);
      setUploadFileTalk(uploadedFile);
      file.push({
        DisplayAttachmentName: uploadedFile.name,
        OriginalAttachmentName: uploadFilePath,
      });
      setTasksAttachments({ ["TasksAttachments"]: file });
    }
  };

  const deleteFilefromAttachments = (data, index) => {
    setTasksAttachments({
      ...tasksAttachments,
      ["TasksAttachments"]: [],
    });
    setUploadFileTalk({});
    setFile("");
  };

  const closeChat = () => {
    dispatch(videoChatMessagesFlag(false));
    dispatch(resetCloseChatFlags());
    setSave(false);
    setPrint(false);
    setEmail(false);
    setLeave(false);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
    setEndDatedisable(true);
    setShowGroupEdit(false);
    setShowEditGroupField(false);
    setShowEditShoutField(false);
    setEmojiActive(false);
    setChatMenuActive(false);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setShowGroupEdit(false);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setShowCheckboxes(false);
    setDeleteFlag(false);
    setForwardFlag(false);
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

  const searchUsers = (e) => {
    setSearchUserValue(e);
    try {
      if (
        talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData !==
          undefined &&
        talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData !==
          null &&
        talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData
          .length !== 0
      ) {
        if (e !== "") {
          let filteredData =
            talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData.userInformation.filter(
              (value) => {
                return value.name.toLowerCase().includes(e.toLowerCase());
              }
            );
          if (filteredData.length === 0) {
            setAllUsersGroupsRooms(
              talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData
                .userInformation
            );
          } else {
            setAllUsersGroupsRooms(filteredData);
          }
        } else if (e === "" || e === null) {
          let data =
            talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData
              .userInformation;
          setSearchUserValue("");
          setAllUsersGroupsRooms(data);
        }
      }
    } catch {}
  };

  const activateChatMenu = () => {
    setChatMenuActive(!chatMenuActive);
  };

  const modalHandlerSave = async (data) => {
    setSave(true);
    setPrint(false);
    setLeave(false);
    setEmail(false);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setChatMenuActive(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
  };

  const modalHandlerPrint = async (e) => {
    setSave(false);
    setPrint(true);
    setLeave(false);
    setEmail(false);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setChatMenuActive(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
  };

  const modalHandlerEmail = async (e) => {
    setSave(false);
    setLeave(false);
    setPrint(false);
    setEmail(true);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setChatMenuActive(false);
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
    setSave(false);
    setTodayCheckState(false);
    setLeave(false);
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
    setPrint(false);
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
    setEmail(false);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
  };

  const handleCancel = () => {
    setSave(false);
    setPrint(false);
    setLeave(false);
    setEmail(false);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
    setEndDatedisable(true);
    setShowGroupEdit(false);
    setShowEditGroupField(false);
    setShowEditShoutField(false);
    setEmojiActive(false);
    setChatMenuActive(false);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setShowGroupEdit(false);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setShowCheckboxes(false);
    setDeleteFlag(false);
    setForwardFlag(false);
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
    setForwardMessageUsersSection(false);
    setShowCheckboxes(false);
    setDeleteFlag(false);
    setForwardFlag(false);
    setForwardUsersChecked([]);
    setMessagesChecked([]);
  };

  const editGroupTitle = () => {
    setShowEditGroupField(true);
  };

  const editShoutTitle = () => {
    setShowEditShoutField(true);
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

  // const chatFeatureSelected = (record, id) => {
  //   dispatch(activeMessage(record));
  //   if (chatFeatureActive === id) {
  //     setChatFeatureActive(0);
  //   } else {
  //     setChatFeatureActive(id);
  //   }
  // };

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
    if (deleteMessage === false) {
      setDeleteMessage(true);
      setDeleteMessageData(record);
    } else {
      setDeleteMessage(false);
    }
  };

  const forwardFeatureHandler = () => {
    if (showCheckboxes === false) {
      setShowCheckboxes(true);
      setForwardFlag(true);
    } else {
      setShowCheckboxes(false);
      setForwardFlag(false);
    }
  };

  const messageInfoHandler = (record) => {
    if (messageInfo === false) {
      setMessageInfoData({
        ...messageInfoData,
        sentDate: record.sentDate,
        receivedDate: record.receivedDate,
        seenDate: record.seenDate,
      });
      setMessageInfo(true);
    } else {
      setMessageInfo(false);
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
        (data2, index) => data === data2
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

  const forwardUsersCheckedHandler = (data, id, index) => {
    if (forwardUsersChecked.includes(data)) {
      let forwardUserIndex = forwardUsersChecked.findIndex(
        (data2, index) => data === data2
      );
      if (forwardUserIndex !== -1) {
        forwardUsersChecked.splice(forwardUserIndex, 1);
        setForwardUsersChecked([...forwardUsersChecked]);
      }
    } else {
      forwardUsersChecked.push(data);
      setForwardUsersChecked([...forwardUsersChecked]);
    }
  };

  const editGroupUsersCheckedHandler = (data, id, index) => {
    if (editGroupUsersChecked.includes(id)) {
      let editGroupUserIndex = editGroupUsersChecked.findIndex(
        (data2) => data2 === id
      );
      let findIndexgroupInfoData = groupInfoData.findIndex(
        (data3, index) => data3.userID === id
      );
      if (findIndexgroupInfoData !== -1) {
        groupInfoData.splice(findIndexgroupInfoData, 1);
        setGroupInfoData([...groupInfoData]);
      }
      if (editGroupUserIndex !== -1) {
        editGroupUsersChecked.splice(editGroupUserIndex, 1);
        setEditGroupUsersChecked([...editGroupUsersChecked]);
      }
    } else {
      setEditGroupUsersChecked([...editGroupUsersChecked, id]);
    }
  };

  const editShoutUsersCheckedHandler = (data, id, index) => {
    if (editShoutUsersChecked.includes(id)) {
      let editGroupUserIndex = editShoutUsersChecked.findIndex(
        (data2) => data2 === id
      );
      let findIndexShoutInfoData = shoutAllUsersData.findIndex(
        (data3, index) => data3.userID === id
      );
      if (findIndexShoutInfoData !== -1) {
        shoutAllUsersData.splice(findIndexShoutInfoData, 1);
        setGroupInfoData([...shoutAllUsersData]);
      }
      if (editGroupUserIndex !== -1) {
        editShoutUsersChecked.splice(editGroupUserIndex, 1);
        setEditShoutUsersChecked([...editShoutUsersChecked]);
      }
    } else {
      setEditShoutUsersChecked([...editShoutUsersChecked, id]);
    }
  };

  const deleteSingleMessage = (record) => {
    let Data = {
      UserID: parseInt(currentUserId),
      MessageType: talkStateData.ActiveChatData.messageType,
      MessageIds: record.messageID,
    };
    dispatch(DeleteSingleMessage(navigate, Data, t));
    setDeleteMessage(false);
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
    setForwardMessageUsersSection(false);
    setShowCheckboxes(false);
    setForwardFlag(false);
    forwardUsersChecked?.map((user) => {
      let { id, type } = user;
      if (type == "U") {
        messagesChecked?.map((message) =>
          dispatch(
            InsertOTOMessages(
              navigate,
              prepareMessageBody(
                parseInt(currentOrganizationId),
                parseInt(currentUserId),
                id,
                message.messageBody
              ),
              uploadFileTalk,
              t
            )
          )
        );
      } else if (type == "B") {
        messagesChecked?.map((message) =>
          dispatch(
            InsertBroadcastMessages(
              navigate,
              prepareMessageBody(
                parseInt(currentOrganizationId),
                parseInt(currentUserId),
                id,
                message.messageBody
              ),
              t
            )
          )
        );
      } else if (type == "G") {
        messagesChecked?.map((message) =>
          dispatch(
            InsertPrivateGroupMessages(
              navigate,
              prepareMessageBody(
                parseInt(currentOrganizationId),
                parseInt(currentUserId),
                id,
                message.messageBody
              ),
              t
            )
          )
        );
      }
    });
    setForwardUsersChecked([]);
  };

  const cancelMessagesCheck = () => {
    setForwardFlag(false);
    setShowCheckboxes(false);
    setDeleteFlag(false);
  };

  const modalHandlerGroupInfo = () => {
    setShowGroupInfo(true);
    setMessageInfo(false);
    setShowGroupEdit(false);
    setChatMenuActive(false);
  };

  const deleteMultipleMessages = () => {
    setShowCheckboxes(true);
    setDeleteFlag(true);
    setChatMenuActive(false);
  };

  const deleteMultipleMessagesButton = () => {
    const messageIDs = messagesChecked.map((obj) => obj.messageID);
    const messageDeleteIDs = messageIDs.join("$");
    let Data = {
      TalkRequest: {
        UserID: Number(currentUserId),
        Message: {
          MessageType: "G",
          MessageIds: messageDeleteIDs,
        },
      },
    };
    dispatch(DeleteMultipleMessages(Data, t, navigate));
    const filteredMessages = allMessages.filter((message1) => {
      return !messagesChecked.some(
        (message2) => message2.messageID === message1.messageID
      );
    });

    setAllMessages(filteredMessages);

    setNotification({
      notificationShow: true,
      message: "Messages Deleted",
    });
    setNotificationID(id);

    setDeleteFlag(false);
    setShowCheckboxes(false);
  };

  const modalHandlerGroupEdit = () => {
    let Data = {
      GroupID: talkStateData.ActiveChatData.id,
      ChannelID: currentOrganizationId,
    };
    dispatch(GetAllPrivateGroupMembers(navigate, Data, t));
    setShowGroupEdit(true);
    setShowGroupInfo(false);
    setMessageInfo(false);
    setChatMenuActive(false);
  };

  const searchGroupEditUser = (e) => {
    setSearchGroupUserInfoValue(e);
    try {
      if (
        talkStateData.AllUsers.AllUsersData !== undefined &&
        (talkStateData.AllUsers.AllUsersData !== null) &
          (talkStateData.AllUsers.AllUsersData.length !== 0)
      ) {
        if (e !== "") {
          let filteredData =
            talkStateData.AllUsers.AllUsersData.allUsers.filter((value) => {
              return value.fullName.toLowerCase().includes(e.toLowerCase());
            });
          if (filteredData.length === 0) {
            setAllUsers(talkStateData.AllUsers.AllUsersData.allUsers);
          } else {
            setAllUsers(filteredData);
          }
        } else if (e === "" || e === null) {
          let data = talkStateData.AllUsers.AllUsersData.allUsers;
          setSearchGroupUserInfoValue("");
          setAllUsers(data);
        }
      }
    } catch {}
  };

  const searchShoutEditUser = (e) => {
    setSearchUserShoutValue(e);
    try {
      if (
        talkStateData.AllUsers.AllUsersData !== undefined &&
        (talkStateData.AllUsers.AllUsersData !== null) &
          (talkStateData.AllUsers.AllUsersData.length !== 0)
      ) {
        if (e !== "") {
          let filteredData =
            talkStateData.AllUsers.AllUsersData.allUsers.filter((value) => {
              return value.fullName.toLowerCase().includes(e.toLowerCase());
            });
          if (filteredData.length === 0) {
            setAllUsers(talkStateData.AllUsers.AllUsersData.allUsers);
          } else {
            setAllUsers(filteredData);
          }
        } else if (e === "" || e === null) {
          let data = talkStateData.AllUsers.AllUsersData.allUsers;
          setSearchUserShoutValue("");
          setAllUsers(data);
        }
      }
    } catch {}
  };

  const searchGroupInfoUser = (e) => {
    setSearchGroupUserInfoValue(e);
    try {
      if (
        talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse !==
          undefined &&
        talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse !==
          null &&
        talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
          .length !== 0
      ) {
        if (e !== "") {
          let filteredData =
            talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse.groupUsers.filter(
              (value) => {
                return value.userName
                  .toLowerCase()
                  .includes(searchGroupUserInfoValue.toLowerCase());
              }
            );
          if (filteredData.length === 0) {
            setGroupInfoData(
              talkStateData.GetPrivateGroupMembers
                .GetPrivateGroupMembersResponse.groupUsers
            );
          } else {
            setGroupInfoData(filteredData);
          }
        } else if (e === "" || e === null) {
          let data =
            talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
              .groupUsers;
          setSearchGroupUserInfoValue("");
          setGroupInfoData(data);
        }
      }
    } catch {}
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
    setChatMenuActive(false);
  };

  const editShoutFunction = () => {
    let Data = {
      TalkRequest: {
        BroadcastID: talkStateData.ActiveChatData.id,
        ChannelID: parseInt(currentOrganizationId),
      },
    };
    dispatch(GetActiveUsersByBroadcastID(navigate, Data, t));
    setChatMenuActive(false);
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

  useEffect(() => {
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
            sourceMessageBody: messagesData.sourceMessageBody,
            sourceMessageId: messagesData.sourceMessageId,
          });
        });
      } else {
        allBroadcastMessagesArr = [];
      }
      setAllMessages([...allBroadcastMessagesArr]);
    }
  }, [talkStateData.AllMessagesData]);

  const chatSearchChange = (e) => {
    const searchedKeyword = e.target.value.toLowerCase();
    const allChatMessages = talkStateData.AllMessagesData;

    const originalCopy = allChatMessages ? [...getOriginalMessages()] : [];

    if (searchedKeyword !== "") {
      const filteredData = originalCopy.filter((message) =>
        message.messageBody.toLowerCase().includes(searchedKeyword)
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
              (messagesData) => messagesData.frMessages !== "Direct Message"
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

  useEffect(() => {
    if (
      talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser !== null &&
      talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser !==
        undefined &&
      talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser.length !== 0
    ) {
      let mqttBlockedUserData =
        talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser.data[0];
      let activeChatData = {
        id: talkStateData.ActiveChatData.id,
        fullName: talkStateData.ActiveChatData.fullName,
        imgURL: talkStateData.ActiveChatData.imgURL,
        messageBody: talkStateData.ActiveChatData.messageBody,
        messageDate: talkStateData.ActiveChatData.messageDate,
        notiCount: talkStateData.ActiveChatData.notiCount,
        messageType: talkStateData.ActiveChatData.messageType,
        isOnline: talkStateData.ActiveChatData.isOnline,
        companyName: talkStateData.ActiveChatData.companyName,
        sentDate: talkStateData.ActiveChatData.sentDate,
        receivedDate: talkStateData.ActiveChatData.receivedDate,
        seenDate: talkStateData.ActiveChatData.seenDate,
        attachmentLocation: talkStateData.ActiveChatData.attachmentLocation,
        senderID: talkStateData.ActiveChatData.senderID,
        admin: talkStateData.ActiveChatData.admin,
        isBlock: 1,
      };
      if (talkStateData.ActiveChatData.id === mqttBlockedUserData.blockUserID) {
        dispatch(activeChat(activeChatData));
      }
    }
  }, [talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser]);

  useEffect(() => {}, [talkStateData.ActiveChatData]);

  useEffect(() => {
    if (
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser !== null &&
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser !==
        undefined &&
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser.length !==
        0
    ) {
      let mqttUnblockedUserData =
        talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser.data[0];
      let activeChatData = {
        id: talkStateData.ActiveChatData.id,
        fullName: talkStateData.ActiveChatData.fullName,
        imgURL: talkStateData.ActiveChatData.imgURL,
        messageBody: talkStateData.ActiveChatData.messageBody,
        messageDate: talkStateData.ActiveChatData.messageDate,
        notiCount: talkStateData.ActiveChatData.notiCount,
        messageType: talkStateData.ActiveChatData.messageType,
        isOnline: talkStateData.ActiveChatData.isOnline,
        companyName: talkStateData.ActiveChatData.companyName,
        sentDate: talkStateData.ActiveChatData.sentDate,
        receivedDate: talkStateData.ActiveChatData.receivedDate,
        seenDate: talkStateData.ActiveChatData.seenDate,
        attachmentLocation: talkStateData.ActiveChatData.attachmentLocation,
        senderID: talkStateData.ActiveChatData.senderID,
        admin: talkStateData.ActiveChatData.admin,
        isBlock: 0,
      };
      if (
        talkStateData.ActiveChatData.id === mqttUnblockedUserData.blockUserID
      ) {
        dispatch(activeChat(activeChatData));
      }
    }
  }, [talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser]);

  useEffect(() => {
    if (
      talkStateData.talkSocketDataStarUnstar.socketStarMessage !== null &&
      talkStateData.talkSocketDataStarUnstar.socketStarMessage !== undefined &&
      talkStateData.talkSocketDataStarUnstar.socketStarMessage.length !== 0
    ) {
      let mqttStarMessageData =
        talkStateData.talkSocketDataStarUnstar.socketStarMessage;
      if (Object.keys(mqttStarMessageData) !== null) {
        if (mqttStarMessageData.messageType === "O") {
          let messageOtoStarred = allMessages.find(
            (item) => item.messageID === mqttStarMessageData.messageID
          );
          if (messageOtoStarred !== undefined) {
            if (messageOtoStarred.isFlag === 1) {
              messageOtoStarred.isFlag = 0;
            } else if (messageOtoStarred.isFlag === 0) {
              messageOtoStarred.isFlag = 1;
            }
          }
          setAllMessages(
            allMessages.map((data) =>
              data.messageID === messageOtoStarred.messageID
                ? messageOtoStarred
                : data
            )
          );
        } else if (mqttStarMessageData.messageType === "G") {
          let messageGroupStarred = allMessages.find(
            (item) => item.messageID === mqttStarMessageData.messageID
          );
          if (messageGroupStarred !== undefined) {
            if (messageGroupStarred.isFlag === 1) {
              messageGroupStarred.isFlag = 0;
            } else if (messageGroupStarred.isFlag === 0) {
              messageGroupStarred.isFlag = 1;
            }
          }
          setAllMessages(
            allMessages.map((data) =>
              data.messageID === messageGroupStarred.messageID
                ? messageGroupStarred
                : data
            )
          );
        }
      }
    }
  }, [talkStateData?.talkSocketDataStarUnstar?.socketStarMessage]);

  useEffect(() => {
    if (
      talkStateData.talkSocketDataStarUnstar.socketUnstarMessage !== null &&
      talkStateData.talkSocketDataStarUnstar.socketUnstarMessage !==
        undefined &&
      talkStateData.talkSocketDataStarUnstar.socketUnstarMessage.length !== 0
    ) {
      markStarUnstarFunction(
        talkStateData,
        allChatData,
        setAllMessages,
        allMessages,
        allMessages,
        setAllMessages
      );
    }
  }, [talkStateData?.talkSocketDataStarUnstar?.socketUnstarMessage]);

  useEffect(() => {
    if (
      talkStateData.talkSocketGroupCreation.groupCreatedData !== null &&
      talkStateData.talkSocketGroupCreation.groupCreatedData !== undefined &&
      talkStateData.talkSocketGroupCreation.groupCreatedData.length !== 0
    ) {
      groupCreationFunction(talkStateData, setAllChatData, allChatData);
    }
  }, [talkStateData?.talkSocketGroupCreation?.groupCreatedData]);

  useEffect(() => {
    if (
      talkStateData.talkSocketGroupUpdation.groupUpdatedData !== null &&
      talkStateData.talkSocketGroupUpdation.groupUpdatedData !== undefined &&
      talkStateData.talkSocketGroupUpdation.groupUpdatedData.length !== 0
    ) {
      groupUpdationFunction(talkStateData, setAllChatData, allChatData);
    }
  }, [talkStateData?.talkSocketGroupUpdation?.groupUpdatedData]);

  useEffect(() => {
    if (
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData !== null &&
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData !==
        undefined &&
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData.length !== 0
    ) {
      unreadMessageCountFunction(talkStateData, allChatData, setAllChatData);
    }
  }, [
    talkStateData?.talkSocketData?.socketInsertOTOMessageData,
    talkStateData?.talkSocketUnreadMessageCount?.unreadMessageData,
  ]);

  useEffect(() => {
    if (
      talkStateData?.MessageStatusUpdateData.MessageStatusUpdateResponse !==
        null &&
      talkStateData?.MessageStatusUpdateData.MessageStatusUpdateResponse !==
        undefined &&
      talkStateData?.MessageStatusUpdateData.MessageStatusUpdateResponse
        .length !== 0
    ) {
      const acknowledgedMessages =
        talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse.data;

      if (Array.isArray(acknowledgedMessages)) {
        const updatedAllOtoMessages = allMessages.map((message) => {
          const matchingAcknowledgedMessage = acknowledgedMessages.find(
            (acknowledgedMessage) =>
              acknowledgedMessage.messageID === message.messageID
          );

          if (matchingAcknowledgedMessage) {
            return {
              ...message,
              messageStatus: matchingAcknowledgedMessage.messageStatus,
              sentDate: matchingAcknowledgedMessage.sentDate,
              receivedDate: matchingAcknowledgedMessage.receivedDate,
              seenDate: matchingAcknowledgedMessage.seenDate,
              currDate: matchingAcknowledgedMessage.currDate,
            };
          }
          return message;
        });
        setAllMessages(updatedAllOtoMessages);
      }
    }
  }, [talkStateData?.MessageStatusUpdateData?.MessageStatusUpdateResponse]);

  // useEffect(() => {
  //

  //   if (
  //     talkStateData.MessageSendOTO.ResponseMessage !==
  //       t("User-is-not-in-channel") &&
  //     talkStateData.MessageSendOTO.ResponseMessage !==
  //       t("OTO-message-inserted") &&
  //     talkStateData.MessageSendOTO.ResponseMessage !==
  //       t("OTO-message-not-inserted") &&
  //     talkStateData.MessageSendOTO.ResponseMessage !==
  //       t("Something-went-wrong") &&
  //     talkStateData.MessageSendOTO.ResponseMessage !== ""
  //   ) {
  //     setNotification({
  //       notificationShow: true,
  //       message: talkStateData.MessageSendOTO.ResponseMessage,
  //     });
  //     setNotificationID(id);
  //   }
  //   setTimeout(() => {
  //     setNotification({
  //       notificationShow: false,
  //       message: "",
  //     });
  //     dispatch(OTOMessageSendSuccess("", []));
  //   }, 3000);
  // }, [talkStateData.MessageSendOTO]);

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
        ["TasksAttachments"]: [],
      });
      setUploadFileTalk({});
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.overflowY = "hidden";
      }
    }
  };

  let unsentMessageObject =
    JSON.parse(localStorage.getItem("unsentMessage")) || [];
  let checkunsentMessageObject = [];
  // useEffect(() => {
  //

  //   if (Object.keys(unsentMessageObject).length > 0) {
  //     if (checkunsentMessageObject !== unsentMessageObject) {
  //       checkunsentMessageObject = unsentMessageObject;
  //     }
  //   }
  // }, [unsentMessageObject]);

  useEffect(() => {
    if (
      talkStateData.talkSocketData.socketInsertOTOMessageData !== null &&
      talkStateData.talkSocketData.socketInsertOTOMessageData !== undefined &&
      talkStateData.talkSocketData.socketInsertOTOMessageData.length !== 0
    ) {
      let mqttResponseSingleMessage =
        talkStateData.talkSocketData.socketInsertOTOMessageData.data[0];

      const uidToMatch = mqttResponseSingleMessage.uid;

      const existingMessages =
        JSON.parse(localStorage.getItem("singleMessageObject")) || [];

      const existingChatMessages =
        JSON.parse(localStorage.getItem("chatMessagesLocal")) || [];

      const updatedMessages = existingMessages.filter((message) => {
        return message.TalkRequest.Message.UID !== uidToMatch;
      });

      const updatedChatMessages = existingChatMessages.filter((message) => {
        return message.uid !== uidToMatch;
      });

      localStorage.setItem(
        "singleMessageObject",
        JSON.stringify(updatedMessages)
      );

      localStorage.setItem(
        "chatMessagesLocal",
        JSON.stringify(updatedChatMessages)
      );

      if (
        talkStateData.ActiveChatData.id ===
        talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
          .receiverID
      ) {
        let frMessages = mqttResponseSingleMessage.frMessages;

        if (
          frMessages !== "Direct Message" &&
          frMessages.length > 0 &&
          frMessages !== undefined &&
          typeof frMessages !== "object"
        ) {
          frMessages = frMessages.split("|");
        }
        let insertMqttOtoMessageData = {
          attachmentLocation: mqttResponseSingleMessage.attachmentLocation,
          blockCount: 0,
          broadcastName: mqttResponseSingleMessage.broadcastName,
          currDate: mqttResponseSingleMessage.currDate,
          fileGeneratedName: mqttResponseSingleMessage.fileGeneratedName,
          fileName: mqttResponseSingleMessage.fileName,
          frMessages: frMessages,
          isFlag: 0,
          messageBody: mqttResponseSingleMessage.messageBody,
          messageCount: 0,
          messageID: mqttResponseSingleMessage.messageID,
          messageStatus: mqttResponseSingleMessage.messageStatus,
          receivedDate: mqttResponseSingleMessage.receivedDate,
          receiverID: mqttResponseSingleMessage.receiverID,
          receiverName: mqttResponseSingleMessage.receiverName,
          seenDate: mqttResponseSingleMessage.seenDate,
          senderID: mqttResponseSingleMessage.senderID,
          senderName: mqttResponseSingleMessage.senderName,
          sentDate: mqttResponseSingleMessage.sentDate,
          shoutAll: mqttResponseSingleMessage.shoutAll,
          uid: mqttResponseSingleMessage.uid,
          sourceMessageBody: mqttResponseSingleMessage.sourceMessageBody,
          isRetry: false,
        };

        setAllMessages((prevAllMessages) => {
          const updatedMessages = prevAllMessages.map((message) => {
            if (message.uid === insertMqttOtoMessageData.uid) {
              return {
                ...message,
                ...insertMqttOtoMessageData,
              };
            }
            return message;
          });

          const isUIDInArray = updatedMessages.some(
            (message) => message.uid === insertMqttOtoMessageData.uid
          );
          if (!isUIDInArray) {
            updatedMessages.push(insertMqttOtoMessageData);
          }

          return updatedMessages;
        });
      } else if (
        parseInt(currentUserId) ===
          talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
            .receiverID &&
        talkStateData.ActiveChatData.id ===
          talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
            .senderID
      ) {
        let frMessages = mqttResponseSingleMessage.frMessages;

        if (
          frMessages !== "Direct Message" &&
          frMessages.length > 0 &&
          frMessages !== undefined &&
          typeof frMessages !== "object"
        ) {
          frMessages = frMessages.split("|");
        }
        let insertMqttOtoMessageData = {
          attachmentLocation: mqttResponseSingleMessage.attachmentLocation,
          blockCount: 0,
          broadcastName: mqttResponseSingleMessage.broadcastName,
          currDate: mqttResponseSingleMessage.currDate,
          fileGeneratedName: mqttResponseSingleMessage.fileGeneratedName,
          fileName: mqttResponseSingleMessage.fileName,
          frMessages: frMessages,
          isFlag: 0,
          messageBody: mqttResponseSingleMessage.messageBody,
          messageCount: 0,
          messageID: mqttResponseSingleMessage.messageID,
          messageStatus: mqttResponseSingleMessage.messageStatus,
          receivedDate: mqttResponseSingleMessage.receivedDate,
          receiverID: mqttResponseSingleMessage.receiverID,
          receiverName: mqttResponseSingleMessage.receiverName,
          seenDate: mqttResponseSingleMessage.seenDate,
          senderID: mqttResponseSingleMessage.senderID,
          senderName: mqttResponseSingleMessage.senderName,
          sentDate: mqttResponseSingleMessage.sentDate,
          shoutAll: mqttResponseSingleMessage.shoutAll,
          uid: mqttResponseSingleMessage.uid,
          isRetry: false,
          sourceMessageBody: mqttResponseSingleMessage.sourceMessageBody,
        };
        setAllMessages((prevAllMessages) => {
          const updatedMessages = prevAllMessages.map((message) => {
            if (message.uid === insertMqttOtoMessageData.uid) {
              return {
                ...message,
                ...insertMqttOtoMessageData,
              };
            }
            return message;
          });

          const isUIDInArray = updatedMessages.some(
            (message) => message.uid === insertMqttOtoMessageData.uid
          );
          if (!isUIDInArray) {
            updatedMessages.push(insertMqttOtoMessageData);
          }

          return updatedMessages;
        });
      }
    }
  }, [talkStateData.talkSocketData.socketInsertOTOMessageData]);

  useEffect(() => {
    if (
      talkStateData.talkSocketData.socketInsertGroupMessageData !== null &&
      talkStateData.talkSocketData.socketInsertGroupMessageData !== undefined &&
      talkStateData.talkSocketData.socketInsertGroupMessageData.length !== 0
    ) {
      let mqttInsertGroupMessageData =
        talkStateData.talkSocketData.socketInsertGroupMessageData.data[0];
      let frMessages = mqttInsertGroupMessageData.frMessages;
      console.log(
        "mqttInsertGroupMessageDatamqttInsertGroupMessageData",
        mqttInsertGroupMessageData
      );
      if (
        frMessages !== "Direct Message" &&
        frMessages.length > 0 &&
        frMessages !== undefined &&
        typeof frMessages !== "object"
      ) {
        frMessages = frMessages.split("|");
      }
      if (talkStateData.ActiveChatData.messageType === "G") {
        if (
          mqttInsertGroupMessageData.senderID !== undefined &&
          mqttInsertGroupMessageData.senderID !== null &&
          mqttInsertGroupMessageData.senderID !== 0 &&
          mqttInsertGroupMessageData.senderID !== "" &&
          mqttInsertGroupMessageData.senderID !== "0" &&
          talkStateData.ActiveChatData.id ===
            mqttInsertGroupMessageData.receiverID
        ) {
          let insertMqttGroupMessageData = {
            messageID: mqttInsertGroupMessageData.messageID,
            senderID: mqttInsertGroupMessageData.senderID,
            receiverID: mqttInsertGroupMessageData.receiverID,
            messageBody: mqttInsertGroupMessageData.messageBody,
            senderName: mqttInsertGroupMessageData.senderName,
            isFlag: 0,
            sentDate: mqttInsertGroupMessageData.sentDate,
            currDate: mqttInsertGroupMessageData.currDate,
            fileGeneratedName: mqttInsertGroupMessageData.fileGeneratedName,
            fileName: mqttInsertGroupMessageData.fileName,
            shoutAll: mqttInsertGroupMessageData.shoutAll,
            frMessages: frMessages,
            messageCount: 0,
            attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
            uid: mqttInsertGroupMessageData.uid,
            isRetry: false,
            sourceMessageBody: mqttInsertGroupMessageData.sourceMessageBody,
          };
          setAllMessages((prevAllMessages) => {
            const updatedMessages = prevAllMessages.map((message) => {
              if (message.uid === insertMqttGroupMessageData.uid) {
                return {
                  ...message,
                  ...insertMqttGroupMessageData,
                };
              }
              return message;
            });

            const isUIDInArray = updatedMessages.some(
              (message) => message.uid === insertMqttGroupMessageData.uid
            );
            if (!isUIDInArray) {
              updatedMessages.push(insertMqttGroupMessageData);
            }

            return updatedMessages;
          });
        } else if (
          mqttInsertGroupMessageData.senderID !== undefined &&
          mqttInsertGroupMessageData.senderID !== null &&
          mqttInsertGroupMessageData.senderID !== 0 &&
          mqttInsertGroupMessageData.senderID !== "" &&
          mqttInsertGroupMessageData.senderID !== "0" &&
          parseInt(currentUserId) !== mqttInsertGroupMessageData.senderID
        ) {
          let insertMqttGroupMessageData = {
            messageID: mqttInsertGroupMessageData.messageID,
            senderID: mqttInsertGroupMessageData.senderID,
            receiverID: mqttInsertGroupMessageData.receiverID,
            messageBody: mqttInsertGroupMessageData.messageBody,
            senderName: mqttInsertGroupMessageData.senderName,
            isFlag: 0,
            sentDate: mqttInsertGroupMessageData.sentDate,
            currDate: mqttInsertGroupMessageData.currDate,
            fileGeneratedName: mqttInsertGroupMessageData.fileGeneratedName,
            fileName: mqttInsertGroupMessageData.fileName,
            shoutAll: mqttInsertGroupMessageData.shoutAll,
            frMessages: frMessages,
            messageCount: 0,
            attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
            uid: mqttInsertGroupMessageData.uid,
            sourceMessageBody: mqttInsertGroupMessageData.sourceMessageBody,
            isRetry: false,
          };
          setAllMessages((prevAllMessages) => {
            const updatedMessages = prevAllMessages.map((message) => {
              if (message.uid === insertMqttGroupMessageData.uid) {
                return {
                  ...message,
                  ...insertMqttGroupMessageData,
                };
              }
              return message;
            });

            const isUIDInArray = updatedMessages.some(
              (message) => message.uid === insertMqttGroupMessageData.uid
            );
            if (!isUIDInArray) {
              updatedMessages.push(insertMqttGroupMessageData);
            }

            return updatedMessages;
          });
        } else if (
          mqttInsertGroupMessageData.senderID !== undefined &&
          mqttInsertGroupMessageData.senderID !== null &&
          mqttInsertGroupMessageData.senderID !== 0 &&
          mqttInsertGroupMessageData.senderID !== "" &&
          mqttInsertGroupMessageData.senderID !== "0" &&
          parseInt(currentUserId) !== mqttInsertGroupMessageData.senderID
        ) {
          let insertMqttGroupMessageData = {
            messageID: mqttInsertGroupMessageData.messageID,
            senderID: mqttInsertGroupMessageData.senderID,
            receiverID: mqttInsertGroupMessageData.receiverID,
            messageBody: mqttInsertGroupMessageData.messageBody,
            senderName: mqttInsertGroupMessageData.senderName,
            isFlag: 0,
            sentDate: mqttInsertGroupMessageData.sentDate,
            currDate: mqttInsertGroupMessageData.currDate,
            fileGeneratedName: mqttInsertGroupMessageData.fileGeneratedName,
            fileName: mqttInsertGroupMessageData.fileName,
            shoutAll: mqttInsertGroupMessageData.shoutAll,
            frMessages: frMessages,
            messageCount: 0,
            attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
            uid: mqttInsertGroupMessageData.uid,
            sourceMessageBody: mqttInsertGroupMessageData.sourceMessageBody,
            isRetry: false,
          };
          setAllMessages((prevAllMessages) => {
            const updatedMessages = prevAllMessages.map((message) => {
              if (message.uid === insertMqttGroupMessageData.uid) {
                return {
                  ...message,
                  ...insertMqttGroupMessageData,
                };
              }
              return message;
            });

            const isUIDInArray = updatedMessages.some(
              (message) => message.uid === insertMqttGroupMessageData.uid
            );
            if (!isUIDInArray) {
              updatedMessages.push(insertMqttGroupMessageData);
            }

            return updatedMessages;
          });
        } else if (
          talkStateData.ActiveChatData.messageType === "" &&
          talkStateData.ActiveChatData.id === 0
        ) {
          let newGroupMessageChat = {
            id: mqttInsertGroupMessageData.receiverID,
            fullName: mqttInsertGroupMessageData.groupName,
            imgURL: "O.jpg",
            messageBody: mqttInsertGroupMessageData.messageBody,
            messageDate: mqttInsertGroupMessageData.sentDate,
            notiCount: 0,
            messageType: "G",
            isOnline: true,
            companyName: "Tresmark",
            sentDate: mqttInsertGroupMessageData.sentDate,
            receivedDate: "",
            seenDate: "",
            attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
            senderID: parseInt(messageSendData.SenderID),
            admin: mqttInsertGroupMessageData.admin,
            uid: mqttInsertGroupMessageData.uid,
            isRetry: false,
          };
          setAllMessages((prevAllMessages) => {
            const updatedMessages = prevAllMessages.map((message) => {
              if (message.uid === newGroupMessageChat.uid) {
                return {
                  ...message,
                  ...newGroupMessageChat,
                };
              }
              return message;
            });

            const isUIDInArray = updatedMessages.some(
              (message) => message.uid === newGroupMessageChat.uid
            );
            if (!isUIDInArray) {
              updatedMessages.push(newGroupMessageChat);
            }

            return updatedMessages;
          });
        }
      }
    }
  }, [talkStateData.talkSocketData.socketInsertGroupMessageData]);

  useEffect(() => {
    if (
      talkStateData.talkSocketInsertBroadcastMessage
        .MessageSendBroadcastResponseData !== null &&
      talkStateData.talkSocketInsertBroadcastMessage
        .MessageSendBroadcastResponseData !== undefined &&
      talkStateData.talkSocketInsertBroadcastMessage
        .MessageSendBroadcastResponseData.length !== 0
    ) {
      try {
        if (talkStateData.ActiveChatData.messageType === "B") {
        }
      } catch {}
    }
  }, [
    talkStateData.talkSocketInsertBroadcastMessage
      .MessageSendBroadcastResponseData,
  ]);

  const handleOutsideClick = (event) => {
    if (
      chatMenuRef.current &&
      !chatMenuRef.current.contains(event.target) &&
      chatMenuActive
    ) {
      setChatMenuActive(false);
    }
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
  }, [chatMenuActive, emojiActive, uploadOptions]);

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

  const editGroup = () => {
    let editGroupUsersHashCheck = editGroupUsersChecked.map((value, index) => {
      return value + "#" + 0;
    });
    setEditGroupUsersChecked(editGroupUsersHashCheck);
    let data = {
      TalkRequest: {
        UserID: parseInt(currentUserId),
        Group: {
          GroupID: talkStateData.ActiveChatData.id,
          GroupName: groupName,
          Users: editGroupUsersHashCheck.join(","),
        },
      },
    };
    dispatch(UpdatePrivateGroup(data, t, navigate));
    setShowGroupEdit(false);
  };

  const editShoutAll = () => {
    let Data = {
      TalkRequest: {
        UserID: parseInt(currentUserId),
        ChannelID: parseInt(currentOrganizationId),
        Group: {
          GroupID: talkStateData.ActiveChatData.id,
          GroupName: shoutName,
          Users: editShoutUsersChecked.join(","),
        },
      },
    };
    dispatch(UpdateShoutAll(Data, t, navigate));
  };

  useEffect(() => {
    if (
      talkStateData.UpdatePrivateGroup.UpdatePrivateGroupResponseMessage ===
      "Group-modified"
    ) {
      setNotification({
        notificationShow: true,
        message:
          talkStateData.UpdatePrivateGroup.UpdatePrivateGroupResponseMessage,
      });
      setNotificationID(id);
    }
    dispatch(ResetGroupModify());
  }, []);

  const leaveGroupHandlerChat = (record) => {
    let data = {
      UserID: parseInt(currentUserId),
      GroupID: record.id,
    };
    dispatch(LeaveGroup(navigate, data, t));
    setChatMenuActive(false);
    dispatch(videoChatMessagesFlag(false));
    dispatch(resetCloseChatFlags());
    setLeave(false);
    setSave(false);
    setPrint(false);
    setEmail(false);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
    setEndDatedisable(true);
    setShowGroupEdit(false);
    setShowEditGroupField(false);
    setShowEditShoutField(false);
    setEmojiActive(false);
    setChatMenuActive(false);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setShowGroupEdit(false);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setShowCheckboxes(false);
    setDeleteFlag(false);
    setForwardFlag(false);
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
      "Broadcast-list-created"
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
      ["TasksAttachments"]: [],
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

  useEffect(() => {
    if (
      talkStateData.MqttMessageDeleteData !== null &&
      talkStateData.MqttMessageDeleteData !== undefined &&
      talkStateData.MqttMessageDeleteData.length !== 0
    ) {
      if (talkStateData.MqttMessageDeleteData.data[0].messageType === "O") {
        const updatedMessages = allMessages.filter(
          (message) =>
            message.messageID !==
            talkStateData.MqttMessageDeleteData.data[0].messageID
        );
        setAllMessages(updatedMessages);
      }
      if (talkStateData.MqttMessageDeleteData.data[0].messageType === "G") {
        const updatedMessages = allMessages.filter(
          (message) =>
            message.messageID !==
            talkStateData.MqttMessageDeleteData.data[0].messageID
        );
        setAllMessages(updatedMessages);
      }
      if (talkStateData.MqttMessageDeleteData.data[0].messageType === "B") {
        const updatedMessages = allMessages.filter(
          (message) =>
            message.messageID !==
            talkStateData.MqttMessageDeleteData.data[0].messageID
        );
        setAllMessages(updatedMessages);
      }
    }
  }, [talkStateData?.MqttMessageDeleteData]);

  useEffect(() => {}, [activeCall]);

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
    localStorage.setItem("callerID", Number(currentUserId));
    localStorage.setItem("recipentCalledID", talkStateData.ActiveChatData.id);
    localStorage.setItem("isCaller", true);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(videoChatPanel(false));
    dispatch(resetCloseChatFlags());
    setSave(false);
    setPrint(false);
    setLeave(false);
    setEmail(false);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
    setEndDatedisable(true);
    setShowGroupEdit(false);
    setShowEditGroupField(false);
    setShowEditShoutField(false);
    setEmojiActive(false);
    setChatMenuActive(false);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setShowGroupEdit(false);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setShowCheckboxes(false);
    setDeleteFlag(false);
    setForwardFlag(false);
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
      (item) => item.userID !== Number(currentUserId)
    );

    const recipientIDs = filteredArray.map((item) => item.userID);

    let Data = {
      RecipentIDs: recipientIDs,
      CallTypeID: 2,
      OrganizationID: Number(currentOrganizationId),
    };
    localStorage.setItem("CallType", Data.CallTypeID);
    dispatch(InitiateVideoCall(Data, navigate, t));
    localStorage.setItem("activeCall", true);
    localStorage.setItem("callerID", Number(currentUserId));
    localStorage.setItem("isCaller", true);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(groupCallRecipients(filteredArray));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(videoChatPanel(false));
    dispatch(resetCloseChatFlags());
    setSave(false);
    setPrint(false);
    setLeave(false);
    setEmail(false);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
    setEndDatedisable(true);
    setShowGroupEdit(false);
    setShowEditGroupField(false);
    setShowEditShoutField(false);
    setEmojiActive(false);
    setChatMenuActive(false);
    setDeleteMessage(false);
    setMessageInfo(false);
    setShowGroupInfo(false);
    setShowGroupEdit(false);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setShowCheckboxes(false);
    setDeleteFlag(false);
    setForwardFlag(false);
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
      localStorage.getItem("singleMessageObject")
    );
    let objectRemoved = false;
    let currentConnection = JSON.parse(
      localStorage.getItem("MqttConnectionState")
    );

    if (Array.isArray(otoMessageLocal)) {
      for (let i = 0; i < otoMessageLocal.length; i++) {
        if (otoMessageLocal[i].TalkRequest.Message.UID === data.uid) {
          data.isRetry = false;
          if (currentConnection === true) {
            dispatch(
              InsertOTOMessages(navigate, otoMessageLocal[i], uploadFileTalk, t)
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
      localStorage.getItem("singleMessageObject")
    );

    let chatMessageLocal = JSON.parse(
      localStorage.getItem("chatMessagesLocal")
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
          (item) => item.uid !== data.uid
        );
        setAllMessages(updatedState);
        localStorage.setItem(
          "chatMessagesLocal",
          JSON.stringify(chatMessageLocal)
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
          (item) => item.uid !== data.uid
        );
        setAllMessages(updatedState);
        localStorage.setItem(
          "singleMessageObject",
          JSON.stringify(otoMessageLocal)
        );
      }
    } else {
    }
  };

  useEffect(() => {
    if (talkFeatureStates.RetryFlagState === true) {
      const storedSingleMessageObject =
        JSON.parse(localStorage.getItem("singleMessageObject")) || [];
      const uidSet = new Set(
        storedSingleMessageObject.map((item) => item.TalkRequest.Message.UID)
      );
      const updatedAllMessages = allMessages.map((message) => {
        if (uidSet.has(message.uid)) {
          return {
            ...message,
            isRetry: true,
          };
        }
        return message;
      });
      setAllMessages(updatedAllMessages);
    }
  }, [talkFeatureStates.RetryFlagState]);

  useEffect(() => {
    let singleMessageObject = JSON.parse(
      localStorage.getItem("singleMessageObject")
    );

    let interval;

    if (currentConnection === false) {
      interval = setInterval(() => {
        if (singleMessageObject.length !== 0) {
          let otoMessageLocal = JSON.parse(
            localStorage.getItem("singleMessageObject")
          );

          if (Array.isArray(otoMessageLocal)) {
            for (let i = 0; i < otoMessageLocal.length; i++) {
              // Dispatch each object separately
              dispatch(
                InsertOTOMessages(
                  navigate,
                  otoMessageLocal[i],
                  uploadFileTalk,
                  t
                )
              );
            }
          }
        }
      }, 5000);

      setTimeout(() => {
        dispatch(retryFlagState(true));
        clearInterval(interval);
      }, 20000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [currentConnection, allMessages]);

  useEffect(() => {
    // Check if all objects have isRetry: false
    const allObjectsHaveIsRetryFalse = allMessages.every(
      (message) => !message.isRetry
    );

    if (allObjectsHaveIsRetryFalse) {
      dispatch(retryFlagState(false));
    } else {
      // Do something else when at least one object has isRetry: true
      // Your code here...
    }
  }, [allMessages.length]);

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

  return (
    <>
      <div className="positionRelative">
        <div className={chatMessageClass}>
          <Container>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div
                  className={
                    save === true ||
                    print === true ||
                    email === true ||
                    deleteMessage === true ||
                    leave === true
                      ? "chat-header applyBlur"
                      : "chat-header"
                  }
                >
                  <Row>
                    <Col lg={1} md={1} sm={12}>
                      <div className="chat-profile-icon">
                        {talkStateData.ActiveChatData.messageType === "O" ? (
                          <img
                            draggable="false"
                            src={SingleIcon}
                            width={25}
                            alt=""
                          />
                        ) : talkStateData.ActiveChatData.messageType === "G" ? (
                          <img
                            draggable="false"
                            src={GroupIcon}
                            width={30}
                            alt=""
                          />
                        ) : talkStateData.ActiveChatData.messageType === "B" ? (
                          <img
                            draggable="false"
                            src={ShoutIcon}
                            width={20}
                            alt=""
                          />
                        ) : null}
                      </div>
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                      <p className="chat-username chathead">
                        {talkStateData.ActiveChatData.fullName}
                      </p>
                    </Col>
                    {activeCall === true ? (
                      <Col lg={1} md={1} sm={12}></Col>
                    ) : null}
                    <Col lg={1} md={1} sm={12}></Col>
                    <Col lg={1} md={1} sm={12}>
                      {" "}
                      <div className="chat-box-icons">
                        <img
                          draggable="false"
                          onClick={showChatSearchHandler}
                          src={SearchChatIcon}
                          alt=""
                        />
                      </div>
                    </Col>
                    <Col lg={1} md={1} sm={12}>
                      {" "}
                      <div
                        className="chat-box-icons cursor-pointer positionRelative"
                        onClick={activateChatMenu}
                        ref={chatMenuRef}
                      >
                        <img draggable="false" src={MenuIcon} alt="" />
                        {chatMenuActive && (
                          <div className="dropdown-menus-chat">
                            {talkStateData.ActiveChatData.messageType ===
                              "O" && (
                              <>
                                <span
                                  onClick={() =>
                                    modalHandlerSave(
                                      talkStateData.ActiveChatData
                                    )
                                  }
                                >
                                  {t("Save")}
                                </span>
                                <span
                                  onClick={() =>
                                    modalHandlerPrint(
                                      talkStateData.ActiveChatData
                                    )
                                  }
                                >
                                  {t("Print")}
                                </span>
                                <span
                                  style={{ borderBottom: "none" }}
                                  onClick={() =>
                                    modalHandlerEmail(
                                      talkStateData.ActiveChatData
                                    )
                                  }
                                >
                                  {t("Email")}
                                </span>
                              </>
                            )}
                            {talkStateData.ActiveChatData.messageType ===
                              "G" && (
                              <>
                                <span
                                  onClick={() =>
                                    modalHandlerSave(
                                      talkStateData.ActiveChatData
                                    )
                                  }
                                >
                                  {t("Save")}
                                </span>
                                <span
                                  onClick={() =>
                                    modalHandlerPrint(
                                      talkStateData.ActiveChatData
                                    )
                                  }
                                >
                                  {t("Print")}
                                </span>
                                <span
                                  onClick={() =>
                                    modalHandlerEmail(
                                      talkStateData.ActiveChatData
                                    )
                                  }
                                >
                                  {t("Email")}
                                </span>
                                <span onClick={modalHandlerGroupInfo}>
                                  {t("Group-Info")}
                                </span>
                                <span onClick={deleteMultipleMessages}>
                                  {t("Delete-messages")}
                                </span>
                                <span onClick={() => setLeave(true)}>
                                  {t("Leave-Group")}
                                </span>
                                <span
                                  style={{ borderBottom: "none" }}
                                  onClick={modalHandlerGroupEdit}
                                >
                                  {t("Edit-Info")}
                                </span>
                              </>
                            )}
                            {talkStateData.ActiveChatData.messageType ===
                              "B" && (
                              <>
                                <span
                                  onClick={() =>
                                    modalHandlerSave(
                                      talkStateData.ActiveChatData
                                    )
                                  }
                                >
                                  {t("Save")}
                                </span>
                                <span
                                  onClick={() =>
                                    modalHandlerPrint(
                                      talkStateData.ActiveChatData
                                    )
                                  }
                                >
                                  {t("Print")}
                                </span>
                                <span
                                  onClick={() =>
                                    modalHandlerEmail(
                                      talkStateData.ActiveChatData
                                    )
                                  }
                                >
                                  {t("Email")}
                                </span>
                                <span onClick={deleteShoutFunction}>
                                  {t("Delete-Shout")}
                                </span>
                                <span onClick={editShoutFunction}>
                                  {t("Edit-Shout")}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </Col>
                    {activeCall === false ? (
                      <Col lg={1} md={1} sm={12}>
                        <div className="chat-box-icons">
                          <img
                            onClick={
                              activeChatType === "O"
                                ? initiateOtoCall
                                : activeChatType === "G"
                                ? initiateGroupCall
                                : null
                            }
                            draggable="false"
                            src={VideoCallIcon}
                            alt=""
                          />
                        </div>
                      </Col>
                    ) : null}
                    <Col lg={1} md={1} sm={12}>
                      {" "}
                      <div
                        className="chat-box-icons closechat"
                        onClick={closeChat}
                      >
                        <img
                          width={14}
                          draggable="false"
                          src={CloseChatIcon}
                          className="cursor-pointer"
                          alt=""
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} className="p-0">
                <div className="encryption-level-chat">
                  <Row>
                    <Col lg={7} md={7} sm={12}>
                      <p className="level-heading">{t("Crypto-Level")}</p>
                    </Col>
                    <Col lg={5} md={5} sm={12} className="positionRelative">
                      <p className="level">{t("NIAP-+-PQC")}</p>

                      <span className="securityicon-box">
                        <img
                          draggable="false"
                          src={SecurityIconMessasgeBox}
                          style={{ width: "17px" }}
                          alt=""
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
                  <Col className="p-0">
                    <div className="chat-searchfield">
                      <TextField
                        maxLength={200}
                        applyClass="form-control2"
                        autoComplete="off"
                        name="Name"
                        change={chatSearchChange}
                        value={searchChatWord}
                        placeholder={t("Search-Chat")}
                        labelClass={"d-none"}
                        inputicon={
                          <span className="background-close-search">
                            <img
                              onClick={closeChatSearch}
                              className="cursor-pointer"
                              src={CrossIcon}
                              alt=""
                            />
                          </span>
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </>
            ) : null}

            {messageInfo === false &&
            forwardMessageUsersSection === false &&
            showGroupInfo === false &&
            showGroupEdit === false ? (
              <>
                <Row>
                  <Col className="p-0">
                    <div
                      className={
                        save === true ||
                        print === true ||
                        email === true ||
                        deleteMessage === true ||
                        leave === true
                          ? "chat-section applyBlur"
                          : showChatSearch === true
                          ? "chat-section searchField"
                          : "chat-section"
                      }
                      key={Math.random()}
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
                            }
                          >
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
                                        }`}
                                      >
                                        <div className="direct-chat-text message-outbox message-box text-start">
                                          <div
                                            className="chatmessage-box-icons"
                                            ref={
                                              chatMessageRefs[
                                                messageData.messageID
                                              ]
                                            }
                                          >
                                            <Dropdown className="border-none">
                                              <Dropdown.Toggle id="dropdown-basic">
                                                <img
                                                  draggable="false"
                                                  className="dropdown-icon"
                                                  src={DropDownIcon}
                                                  alt=""
                                                />
                                              </Dropdown.Toggle>
                                              <Dropdown.Menu
                                                className={
                                                  isLastMessage
                                                    ? "dropdown-menu-upwards"
                                                    : ""
                                                }
                                              >
                                                <>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      replyFeatureHandler(
                                                        messageData
                                                      )
                                                    }
                                                  >
                                                    {t("Reply")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={
                                                      forwardFeatureHandler
                                                    }
                                                  >
                                                    {t("Forward")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      deleteFeatureHandler(
                                                        messageData
                                                      )
                                                    }
                                                  >
                                                    {t("Delete for me")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      messageInfoHandler(
                                                        messageData
                                                      )
                                                    }
                                                  >
                                                    {t("Message-Info")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      markUnmarkStarMessageHandler(
                                                        messageData
                                                      )
                                                    }
                                                    style={{
                                                      borderBottom: "none",
                                                    }}
                                                  >
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
                                                <div className="image-thumbnail-chat">
                                                  <a
                                                    href={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  >
                                                    <img
                                                      draggable="false"
                                                      src={
                                                        filesUrlTalk +
                                                        messageData.attachmentLocation
                                                      }
                                                      alt=""
                                                    />
                                                  </a>
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
                                                <div className="file-uploaded-chat">
                                                  <img
                                                    draggable="false"
                                                    src={DocumentIcon}
                                                    alt=""
                                                  />
                                                  <span className="attached-file">
                                                    {messageData.attachmentLocation
                                                      .substring(
                                                        messageData.attachmentLocation.lastIndexOf(
                                                          "/"
                                                        ) + 1
                                                      )
                                                      .replace(/^\d+_/, "")}
                                                  </span>
                                                  <a
                                                    href={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  >
                                                    <img
                                                      draggable="false"
                                                      src={DownloadIcon}
                                                      alt=""
                                                    />
                                                  </a>
                                                </div>
                                              ) : null}
                                              <span className="direct-chat-body color-5a5a5a">
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
                                                <div className="image-thumbnail-chat">
                                                  <a
                                                    href={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  >
                                                    <img
                                                      draggable="false"
                                                      src={
                                                        filesUrlTalk +
                                                        messageData.attachmentLocation
                                                      }
                                                      alt=""
                                                    />
                                                  </a>
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
                                                <div className="file-uploaded-chat">
                                                  <img
                                                    draggable="false"
                                                    src={DocumentIcon}
                                                    alt=""
                                                  />
                                                  <span className="attached-file">
                                                    {messageData.attachmentLocation
                                                      .substring(
                                                        messageData.attachmentLocation.lastIndexOf(
                                                          "/"
                                                        ) + 1
                                                      )
                                                      .replace(/^\d+_/, "")}
                                                  </span>
                                                  <a
                                                    href={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  >
                                                    <img
                                                      draggable="false"
                                                      src={DownloadIcon}
                                                      alt=""
                                                    />
                                                  </a>
                                                </div>
                                              ) : (
                                                <div className="replied-message-send">
                                                  <p className="replied-message-sender m-0">
                                                    {messageData.frMessages[3]}
                                                  </p>
                                                  <p className="replied-message m-0">
                                                    {messageData.sourceMessageBody !==
                                                    ""
                                                      ? messageData.sourceMessageBody
                                                      : messageData
                                                          .frMessages[4]}
                                                  </p>
                                                </div>
                                              )}

                                              <span className="direct-chat-body color-5a5a5a">
                                                {messageData.messageBody}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <div className="replied-message-send">
                                                <p className="replied-message-sender m-0">
                                                  {messageData.frMessages[3]}
                                                </p>
                                                <p className="replied-message m-0">
                                                  {messageData.sourceMessageBody !==
                                                  ""
                                                    ? messageData.sourceMessageBody
                                                    : messageData.frMessages[4]}
                                                </p>
                                              </div>
                                              <span className="direct-chat-body color-5a5a5a">
                                                {messageData.messageBody}
                                              </span>
                                            </>
                                          )}

                                          <div className="d-flex mt-1 justify-content-end">
                                            <div className="star-time-status ml-auto text-end">
                                              <span className="starred-status">
                                                {messageData.isFlag === 1 ? (
                                                  <img
                                                    draggable="false"
                                                    src={StarredMessageIcon}
                                                    alt=""
                                                  />
                                                ) : null}
                                              </span>
                                              <span className="direct-chat-sent-time chat-datetime">
                                                {messageData.sentDate.slice(
                                                  0,
                                                  8
                                                ) === currentUtcDate ? (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkTime(
                                                      messageData.sentDate
                                                    )}
                                                  </>
                                                ) : messageData.sentDate.slice(
                                                    0,
                                                    8
                                                  ) === yesterdayDateUtc ? (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkDate(
                                                      messageData.sentDate
                                                    ) + " "}
                                                    | {t("Yesterday")}
                                                  </>
                                                ) : messageData.sentDate ===
                                                  "" ? null : (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkDate(
                                                      messageData.sentDate
                                                    )}
                                                  </>
                                                )}
                                              </span>
                                              <div className="message-status">
                                                {messageData.messageStatus ===
                                                "Sent" ? (
                                                  <img
                                                    draggable="false"
                                                    src={SingleTickIcon}
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  "Delivered" ? (
                                                  <img
                                                    draggable="false"
                                                    src={
                                                      DoubleTickDeliveredIcon
                                                    }
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  "Seen" ? (
                                                  <img
                                                    draggable="false"
                                                    src={DoubleTickIcon}
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                    "Undelivered" &&
                                                  talkStateData.ActiveChatData
                                                    .messageType === "O" &&
                                                  messageData.isRetry ===
                                                    false ? (
                                                  <img
                                                    draggable="false"
                                                    src={TimerIcon}
                                                    alt=""
                                                  />
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                          {messageData.isRetry === true ? (
                                            <div className="options-rd">
                                              <span
                                                onClick={() =>
                                                  retrySendingMessage(
                                                    messageData,
                                                    messageData.messageID
                                                  )
                                                }
                                                className="option-r"
                                              >
                                                Retry
                                              </span>
                                              <span
                                                onClick={() =>
                                                  deleteSingleMessageLocal(
                                                    messageData,
                                                    messageData.messageID
                                                  )
                                                }
                                                className="option-d"
                                              >
                                                Delete
                                              </span>
                                            </div>
                                          ) : null}
                                        </div>
                                        {showCheckboxes === true ? (
                                          <Checkbox
                                            checked={
                                              messagesChecked.includes(
                                                messageData
                                              )
                                                ? true
                                                : false
                                            }
                                            onChange={() =>
                                              messagesCheckedHandler(
                                                messageData,
                                                index
                                              )
                                            }
                                            className="chat-message-checkbox-receiver"
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
                                      }`}
                                    >
                                      {showCheckboxes === true ? (
                                        <Checkbox
                                          checked={
                                            messagesChecked.includes(
                                              messageData
                                            )
                                              ? true
                                              : false
                                          }
                                          onChange={() =>
                                            messagesCheckedHandler(
                                              messageData,
                                              index
                                            )
                                          }
                                          className="chat-message-checkbox-sender"
                                        />
                                      ) : null}

                                      <div className="direct-chat-text message-inbox message-box text-start">
                                        <div
                                          className="chatmessage-box-icons"
                                          ref={
                                            chatMessageRefs[
                                              messageData.messageID
                                            ]
                                          }
                                        >
                                          <Dropdown className="border-none">
                                            <Dropdown.Toggle id="dropdown-basic">
                                              <img
                                                draggable="false"
                                                className="dropdown-icon"
                                                src={DropDownIcon}
                                              />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu
                                              className={
                                                isLastMessage
                                                  ? "dropdown-menu-upwards"
                                                  : ""
                                              }
                                            >
                                              <>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    replyFeatureHandler(
                                                      messageData
                                                    )
                                                  }
                                                >
                                                  {t("Reply")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={
                                                    forwardFeatureHandler
                                                  }
                                                >
                                                  {t("Forward")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    deleteFeatureHandler(
                                                      messageData
                                                    )
                                                  }
                                                >
                                                  {t("Delete for me")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    messageInfoHandler(
                                                      messageData
                                                    )
                                                  }
                                                >
                                                  {t("Message-Info")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    markUnmarkStarMessageHandler(
                                                      messageData
                                                    )
                                                  }
                                                  style={{
                                                    borderBottom: "none",
                                                  }}
                                                >
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
                                              <div className="image-thumbnail-chat">
                                                <a
                                                  href={
                                                    filesUrlTalk +
                                                    messageData.attachmentLocation
                                                  }
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                >
                                                  <img
                                                    draggable="false"
                                                    src={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    alt=""
                                                  />
                                                </a>
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
                                              <div className="file-uploaded-chat received">
                                                <img
                                                  draggable="false"
                                                  src={DocumentIcon}
                                                  alt=""
                                                />
                                                <span className="attached-file">
                                                  {messageData.attachmentLocation
                                                    .substring(
                                                      messageData.attachmentLocation.lastIndexOf(
                                                        "/"
                                                      ) + 1
                                                    )
                                                    .replace(/^\d+_/, "")}
                                                </span>
                                                <a
                                                  href={
                                                    filesUrlTalk +
                                                    messageData.attachmentLocation
                                                  }
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                >
                                                  <img
                                                    draggable="false"
                                                    src={DownloadIcon}
                                                    alt=""
                                                  />
                                                </a>
                                              </div>
                                            ) : null}
                                            <span className="direct-chat-body color-white">
                                              {messageData.messageBody}
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <div className="replied-message-receive">
                                              <p className="replied-message-receiver m-0">
                                                {messageData.frMessages[3]}
                                              </p>
                                              <p className="replied-message m-0">
                                                {messageData.sourceMessageBody !==
                                                ""
                                                  ? messageData.sourceMessageBody
                                                  : messageData.frMessages[4]}
                                              </p>
                                            </div>
                                            <span className="direct-chat-body color-white">
                                              {messageData.messageBody}
                                            </span>
                                          </>
                                        )}
                                        <div className="d-flex mt-1 justify-content-end">
                                          <div className="star-time-status ml-auto text-end">
                                            <span className="starred-status">
                                              {messageData.isFlag === 1 ? (
                                                <img
                                                  draggable="false"
                                                  src={StarredMessageIcon}
                                                  alt=""
                                                />
                                              ) : null}
                                            </span>
                                            <span className="direct-chat-sent-time chat-datetime">
                                              {messageData.sentDate.slice(
                                                0,
                                                8
                                              ) === currentUtcDate ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkTime(
                                                    messageData.sentDate
                                                  )}
                                                </>
                                              ) : messageData.sentDate.slice(
                                                  0,
                                                  8
                                                ) === yesterdayDateUtc ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate
                                                  ) + " "}
                                                  | {t("Yesterday")}
                                                </>
                                              ) : (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate
                                                  )}
                                                </>
                                              )}
                                            </span>
                                            <div className="message-status"></div>
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
                                      }`}
                                    >
                                      <div className="direct-chat-text message-outbox message-box text-start">
                                        <p className="group-sender-name">
                                          {messageData.senderName}
                                        </p>
                                        <div
                                          className="chatmessage-box-icons"
                                          ref={
                                            chatMessageRefs[
                                              messageData.messageID
                                            ]
                                          }
                                        >
                                          <Dropdown className="border-none">
                                            <Dropdown.Toggle id="dropdown-basic">
                                              <img
                                                draggable="false"
                                                className="dropdown-icon"
                                                src={DropDownIcon}
                                              />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu
                                              className={
                                                isLastMessage
                                                  ? "dropdown-menu-upwards"
                                                  : ""
                                              }
                                            >
                                              <>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    replyFeatureHandler(
                                                      messageData
                                                    )
                                                  }
                                                >
                                                  {t("Reply")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={
                                                    forwardFeatureHandler
                                                  }
                                                >
                                                  {t("Forward")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    deleteFeatureHandler(
                                                      messageData
                                                    )
                                                  }
                                                >
                                                  {t("Delete for me")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    messageInfoHandler(
                                                      messageData
                                                    )
                                                  }
                                                >
                                                  {t("Message-Info")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    markUnmarkStarMessageHandler(
                                                      messageData
                                                    )
                                                  }
                                                  style={{
                                                    borderBottom: "none",
                                                  }}
                                                >
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
                                              <div className="image-thumbnail-chat">
                                                <a
                                                  href={
                                                    filesUrlTalk +
                                                    messageData.attachmentLocation
                                                  }
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                >
                                                  <img
                                                    draggable="false"
                                                    src={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    alt=""
                                                  />
                                                </a>
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
                                              <div className="file-uploaded-chat">
                                                <img
                                                  draggable="false"
                                                  src={DocumentIcon}
                                                  alt=""
                                                />
                                                <span className="attached-file">
                                                  {messageData.attachmentLocation
                                                    .substring(
                                                      messageData.attachmentLocation.lastIndexOf(
                                                        "/"
                                                      ) + 1
                                                    )
                                                    .replace(/^\d+_/, "")}
                                                </span>
                                                <a
                                                  href={
                                                    filesUrlTalk +
                                                    messageData.attachmentLocation
                                                  }
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                >
                                                  <img
                                                    draggable="false"
                                                    src={DownloadIcon}
                                                    alt=""
                                                  />
                                                </a>
                                              </div>
                                            ) : null}
                                            <span className="direct-chat-body color-5a5a5a">
                                              {messageData.messageBody}
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <div className="replied-message-send">
                                              <p className="replied-message-sender m-0">
                                                {messageData.frMessages[3]}
                                              </p>
                                              <p className="replied-message m-0">
                                                {messageData.sourceMessageBody !==
                                                ""
                                                  ? messageData.sourceMessageBody
                                                  : messageData.frMessages[4]}
                                              </p>
                                            </div>
                                            <span className="direct-chat-body color-5a5a5a">
                                              {messageData.messageBody}
                                            </span>
                                          </>
                                        )}
                                        <div className="d-flex mt-1 justify-content-end">
                                          <div className="star-time-status ml-auto text-end">
                                            <span className="starred-status">
                                              {messageData.isFlag === 1 ? (
                                                <img
                                                  draggable="false"
                                                  src={StarredMessageIcon}
                                                  alt=""
                                                />
                                              ) : null}
                                            </span>
                                            <span className="direct-chat-sent-time chat-datetime">
                                              {messageData.sentDate.slice(
                                                0,
                                                8
                                              ) === currentUtcDate ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkTime(
                                                    messageData.sentDate
                                                  )}
                                                </>
                                              ) : messageData.sentDate.slice(
                                                  0,
                                                  8
                                                ) === yesterdayDateUtc ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate
                                                  ) + " "}
                                                  | {t("Yesterday")}
                                                </>
                                              ) : (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate
                                                  )}
                                                </>
                                              )}
                                            </span>
                                            <div className="message-status">
                                              {messageData.messageStatus ===
                                              "Sent" ? (
                                                <img
                                                  draggable="false"
                                                  src={SingleTickIcon}
                                                  alt=""
                                                />
                                              ) : messageData.messageStatus ===
                                                "Delivered" ? (
                                                <img
                                                  draggable="false"
                                                  src={DoubleTickDeliveredIcon}
                                                  alt=""
                                                />
                                              ) : messageData.messageStatus ===
                                                "Seen" ? (
                                                <img
                                                  draggable="false"
                                                  src={DoubleTickIcon}
                                                  alt=""
                                                />
                                              ) : messageData.messageStatus ===
                                                  "Undelivered" &&
                                                talkStateData.ActiveChatData
                                                  .messageType === "O" &&
                                                messageData.isRetry ===
                                                  false ? (
                                                <img
                                                  draggable="false"
                                                  src={TimerIcon}
                                                  alt=""
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
                                              messageData
                                            )
                                              ? true
                                              : false
                                          }
                                          onChange={() =>
                                            messagesCheckedHandler(
                                              messageData,
                                              index
                                            )
                                          }
                                          className="chat-message-checkbox-receiver"
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
                                      }`}
                                    >
                                      {showCheckboxes === true ? (
                                        <Checkbox
                                          checked={
                                            messagesChecked.includes(
                                              messageData
                                            )
                                              ? true
                                              : false
                                          }
                                          onChange={() =>
                                            messagesCheckedHandler(
                                              messageData,
                                              index
                                            )
                                          }
                                          className="chat-message-checkbox-sender"
                                        />
                                      ) : null}

                                      <div className="direct-chat-text message-inbox message-box text-start">
                                        <div
                                          className="chatmessage-box-icons"
                                          ref={
                                            chatMessageRefs[
                                              messageData.messageID
                                            ]
                                          }
                                        >
                                          <Dropdown className="border-none">
                                            <Dropdown.Toggle id="dropdown-basic">
                                              <img
                                                draggable="false"
                                                className="dropdown-icon"
                                                src={DropDownIcon}
                                              />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu
                                              className={
                                                isLastMessage
                                                  ? "dropdown-menu-upwards"
                                                  : ""
                                              }
                                            >
                                              <>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    replyFeatureHandler(
                                                      messageData
                                                    )
                                                  }
                                                >
                                                  {t("Reply")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={
                                                    forwardFeatureHandler
                                                  }
                                                >
                                                  {t("Forward")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    deleteFeatureHandler(
                                                      messageData
                                                    )
                                                  }
                                                >
                                                  {t("Delete for me")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    messageInfoHandler(
                                                      messageData
                                                    )
                                                  }
                                                >
                                                  {t("Message-Info")}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() =>
                                                    markUnmarkStarMessageHandler(
                                                      messageData
                                                    )
                                                  }
                                                  style={{
                                                    borderBottom: "none",
                                                  }}
                                                >
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
                                            <p className="group-sender-name">
                                              {messageData.senderName}
                                            </p>
                                            <span className="direct-chat-body color-white">
                                              {messageData.messageBody}
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <p className="group-sender-name">
                                              {messageData.senderName}
                                            </p>
                                            <div className="replied-message-receive">
                                              <p className="replied-message-receiver m-0">
                                                {messageData.frMessages[3]}
                                              </p>
                                              <p className="replied-message m-0">
                                                {messageData.sourceMessageBody !==
                                                ""
                                                  ? messageData.sourceMessageBody
                                                  : messageData.frMessages[4]}
                                              </p>
                                            </div>
                                            <span className="direct-chat-body color-white">
                                              {messageData.messageBody}
                                            </span>
                                          </>
                                        )}
                                        <div className="d-flex mt-1 justify-content-end">
                                          <div className="star-time-status ml-auto text-end">
                                            <span className="starred-status">
                                              {messageData.isFlag === 1 ? (
                                                <img
                                                  draggable="false"
                                                  src={StarredMessageIcon}
                                                  alt=""
                                                />
                                              ) : null}
                                            </span>
                                            <span className="direct-chat-sent-time chat-datetime">
                                              {messageData.sentDate.slice(
                                                0,
                                                8
                                              ) === currentUtcDate ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkTime(
                                                    messageData.sentDate
                                                  )}
                                                </>
                                              ) : messageData.sentDate.slice(
                                                  0,
                                                  8
                                                ) === yesterdayDateUtc ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate
                                                  ) + " "}
                                                  | {t("Yesterday")}
                                                </>
                                              ) : (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate
                                                  )}
                                                </>
                                              )}
                                            </span>
                                            <div className="message-status"></div>
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
                                        }`}
                                      >
                                        <div className="direct-chat-text message-outbox message-box text-start">
                                          <div
                                            className="chatmessage-box-icons"
                                            ref={
                                              chatMessageRefs[
                                                messageData.messageID
                                              ]
                                            }
                                          >
                                            <Dropdown className="border-none">
                                              <Dropdown.Toggle id="dropdown-basic">
                                                <img
                                                  draggable="false"
                                                  className="dropdown-icon"
                                                  src={DropDownIcon}
                                                />
                                              </Dropdown.Toggle>
                                              <Dropdown.Menu
                                                className={
                                                  isLastMessage
                                                    ? "dropdown-menu-upwards"
                                                    : ""
                                                }
                                              >
                                                <>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      replyFeatureHandler(
                                                        messageData
                                                      )
                                                    }
                                                  >
                                                    {t("Reply")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={
                                                      forwardFeatureHandler
                                                    }
                                                  >
                                                    {t("Forward")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      deleteFeatureHandler(
                                                        messageData
                                                      )
                                                    }
                                                  >
                                                    {t("Delete for me")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      messageInfoHandler(
                                                        messageData
                                                      )
                                                    }
                                                  >
                                                    {t("Message-Info")}
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      markUnmarkStarMessageHandler(
                                                        messageData
                                                      )
                                                    }
                                                    style={{
                                                      borderBottom: "none",
                                                    }}
                                                  >
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
                                                <div className="image-thumbnail-chat">
                                                  <a
                                                    href={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  >
                                                    <img
                                                      draggable="false"
                                                      src={
                                                        filesUrlTalk +
                                                        messageData.attachmentLocation
                                                      }
                                                      alt=""
                                                    />
                                                  </a>
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
                                                <div className="file-uploaded-chat">
                                                  <img
                                                    draggable="false"
                                                    src={DocumentIcon}
                                                    alt=""
                                                  />
                                                  <span className="attached-file">
                                                    {messageData.attachmentLocation
                                                      .substring(
                                                        messageData.attachmentLocation.lastIndexOf(
                                                          "/"
                                                        ) + 1
                                                      )
                                                      .replace(/^\d+_/, "")}
                                                  </span>
                                                  <a
                                                    href={
                                                      filesUrlTalk +
                                                      messageData.attachmentLocation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  >
                                                    <img
                                                      draggable="false"
                                                      src={DownloadIcon}
                                                      alt=""
                                                    />
                                                  </a>
                                                </div>
                                              ) : null}
                                              <span className="direct-chat-body color-5a5a5a">
                                                {messageData.messageBody}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <div className="replied-message-send">
                                                <p className="replied-message-sender m-0">
                                                  {messageData.frMessages[3]}
                                                </p>
                                                <p className="replied-message m-0">
                                                  {messageData.sourceMessageBody !==
                                                  ""
                                                    ? messageData.sourceMessageBody
                                                    : messageData.frMessages[4]}
                                                </p>
                                              </div>
                                              <span className="direct-chat-body color-5a5a5a">
                                                {messageData.messageBody}
                                              </span>
                                            </>
                                          )}

                                          <div className="d-flex mt-1 justify-content-end">
                                            <div className="star-time-status ml-auto text-end">
                                              <span className="starred-status">
                                                {messageData.isFlag === 1 ? (
                                                  <img
                                                    draggable="false"
                                                    src={StarredMessageIcon}
                                                    alt=""
                                                  />
                                                ) : null}
                                              </span>
                                              <span className="direct-chat-sent-time chat-datetime">
                                                {messageData.sentDate.slice(
                                                  0,
                                                  8
                                                ) === currentUtcDate ? (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkTime(
                                                      messageData.sentDate
                                                    )}
                                                  </>
                                                ) : messageData.sentDate.slice(
                                                    0,
                                                    8
                                                  ) === yesterdayDateUtc ? (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkDate(
                                                      messageData.sentDate
                                                    ) + " "}
                                                    | {t("Yesterday")}
                                                  </>
                                                ) : messageData.sentDate ===
                                                  "" ? null : (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkDate(
                                                      messageData.sentDate
                                                    )}
                                                  </>
                                                )}
                                              </span>
                                              <div className="message-status">
                                                {messageData.messageStatus ===
                                                "Sent" ? (
                                                  <img
                                                    draggable="false"
                                                    src={SingleTickIcon}
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  "Delivered" ? (
                                                  <img
                                                    draggable="false"
                                                    src={
                                                      DoubleTickDeliveredIcon
                                                    }
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  "Seen" ? (
                                                  <img
                                                    draggable="false"
                                                    src={DoubleTickIcon}
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                    "Undelivered" &&
                                                  talkStateData.ActiveChatData
                                                    .messageType === "O" &&
                                                  messageData.isRetry ===
                                                    false ? (
                                                  <img
                                                    draggable="false"
                                                    src={TimerIcon}
                                                    alt=""
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
                                                messageData
                                              )
                                                ? true
                                                : false
                                            }
                                            onChange={() =>
                                              messagesCheckedHandler(
                                                messageData,
                                                index
                                              )
                                            }
                                            className="chat-message-checkbox-receiver"
                                          />
                                        ) : null}
                                      </div>
                                    </>
                                  );
                                }
                              })
                            ) : talkStateData.ChatSpinner === true ? (
                              <>
                                <Spin className="talk-overallchat-spinner" />
                              </>
                            ) : null}
                            <div ref={chatMessages} />
                          </div>
                        ) : (
                          <>
                            <div className="removeImage-thumbnail">
                              <img
                                draggable="false"
                                onClick={removeFileFunction}
                                src={CrossIcon}
                                className="cursor-pointer"
                              />
                            </div>
                            <div className="image-thumbnail">
                              <img
                                draggable="false"
                                className="img-cover thumbnailImage"
                                src={file}
                              />
                            </div>
                          </>
                        )}
                      </>

                      {replyFeature === true ? (
                        <div className="chat-feature-action">
                          <p className="feature-name">Replying to</p>
                          <div className="chat-feature">
                            <div className="chat-feature-option">
                              <p className="chat-feature-text">
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
                              <div className="positionRelative"></div>
                            </div>
                          </div>
                          <div className="remove-chat-feature">
                            <img
                              draggable="false"
                              src={DeleteChatFeature}
                              className="Remove-feature"
                              onClick={replyFeatureHandler}
                              alt=""
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col className="p-0">
                    <>
                      {save === true ? (
                        <>
                          <div className="chat-menu-popups">
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                {" "}
                                <div className="chat-modal-Heading">
                                  <h1>{t("Save-Messages")}</h1>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <div className="chat-options">
                                  <Checkbox
                                    checked={todayCheckState}
                                    onChange={onChangeToday}
                                  >
                                    {t("Today")}
                                  </Checkbox>
                                  <Checkbox
                                    checked={allCheckState}
                                    onChange={onChangeAll}
                                  >
                                    {t("All")}
                                  </Checkbox>
                                  <Checkbox
                                    checked={customCheckState}
                                    onChange={onChangeCustom}
                                  >
                                    {t("Custom")}
                                  </Checkbox>
                                </div>
                                {customCheckState === true ? (
                                  <Row>
                                    <Col lg={1} md={1} sm={12}></Col>
                                    <Col lg={5} md={5} sm={12}>
                                      <label style={{ marginLeft: "5px" }}>
                                        <b style={{ fontSize: "0.7rem" }}>
                                          {t("Date-from")}
                                        </b>
                                      </label>{" "}
                                      <InputDatePicker
                                        name="StartDate"
                                        size="large"
                                        width="100%"
                                        value={
                                          chatDateState.StartDate
                                            ? DateDisplayFormat(
                                                chatDateState.StartDate
                                              )
                                            : null
                                        }
                                        DateRange
                                        placeholder={t("Select-date")}
                                        change={onChangeDate}
                                        locale={enUS}
                                      />
                                    </Col>
                                    <Col lg={5} md={5} sm={12}>
                                      <label style={{ marginLeft: "5px" }}>
                                        <b style={{ fontSize: "0.7rem" }}>
                                          {t("Date-to")}
                                        </b>
                                      </label>
                                      <InputDatePicker
                                        name="EndDate"
                                        size="large"
                                        width="100%"
                                        value={
                                          chatDateState.EndDate
                                            ? DateDisplayFormat(
                                                chatDateState.EndDate
                                              )
                                            : null
                                        }
                                        DateRange
                                        placeholder={t("Select Date")}
                                        change={onChangeDate}
                                        disable={endDatedisable}
                                        locale={enUS}
                                      />
                                    </Col>
                                    <Col lg={1} md={1} sm={12}></Col>
                                  </Row>
                                ) : null}
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="text-center"
                              >
                                <Button
                                  className=" Ok-btn"
                                  text={t("Okay")}
                                  onClick={downloadChat}
                                />
                              </Col>
                            </Row>
                          </div>
                        </>
                      ) : print === true ? (
                        <>
                          <div className="chat-menu-popups">
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                {" "}
                                <div className="chat-modal-Heading">
                                  <h1>{t("Print-Messages")}</h1>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                {" "}
                                <div className="chat-options">
                                  <Checkbox
                                    checked={todayCheckState}
                                    onChange={onChangeToday}
                                  >
                                    {t("Today")}
                                  </Checkbox>
                                  <Checkbox
                                    checked={allCheckState}
                                    onChange={onChangeAll}
                                  >
                                    {t("All")}
                                  </Checkbox>
                                  <Checkbox
                                    checked={customCheckState}
                                    onChange={onChangeCustom}
                                  >
                                    {t("Custom")}
                                  </Checkbox>
                                </div>
                                {customCheckState === true ? (
                                  <Row>
                                    <Col lg={6} md={6} sm={12}>
                                      <label style={{ marginLeft: "5px" }}>
                                        <b style={{ fontSize: "0.7rem" }}>
                                          {t("Date-From")}
                                        </b>
                                      </label>{" "}
                                      <InputDatePicker
                                        name="StartDate"
                                        size="large"
                                        width="100%"
                                        value={
                                          chatDateState.StartDate
                                            ? DateDisplayFormat(
                                                chatDateState.StartDate
                                              )
                                            : null
                                        }
                                        DateRange
                                        placeholder={t("Select-Date")}
                                        change={onChangeDate}
                                      />
                                    </Col>
                                    <Col lg={6} md={6} sm={12}>
                                      <label style={{ marginLeft: "5px" }}>
                                        <b style={{ fontSize: "0.7rem" }}>
                                          {t("Date-to")}
                                        </b>
                                      </label>
                                      <InputDatePicker
                                        name="EndDate"
                                        size="large"
                                        width="100%"
                                        value={
                                          chatDateState.EndDate
                                            ? DateDisplayFormat(
                                                chatDateState.EndDate
                                              )
                                            : null
                                        }
                                        DateRange
                                        placeholder={t("Select-Date")}
                                        change={onChangeDate}
                                        disable={endDatedisable}
                                      />
                                    </Col>
                                  </Row>
                                ) : null}
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="text-center"
                              >
                                <Button
                                  className=" Ok-btn"
                                  text={t("Okay")}
                                  onClick={printChat}
                                />
                              </Col>
                            </Row>
                          </div>
                        </>
                      ) : email === true ? (
                        <>
                          <div className="chat-menu-popups">
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                {" "}
                                <div className="chat-modal-Heading">
                                  <h1>{t("Email-Messages")}</h1>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                {" "}
                                <div className="chat-options">
                                  <Checkbox
                                    checked={todayCheckState}
                                    onChange={onChangeToday}
                                  >
                                    {t("Today")}
                                  </Checkbox>
                                  <Checkbox
                                    checked={allCheckState}
                                    onChange={onChangeAll}
                                  >
                                    {t("All")}
                                  </Checkbox>
                                  <Checkbox
                                    checked={customCheckState}
                                    onChange={onChangeCustom}
                                  >
                                    Custom
                                  </Checkbox>
                                </div>
                                {customCheckState === true ? (
                                  <Row>
                                    <Col lg={6} md={6} sm={12}>
                                      <label style={{ marginLeft: "5px" }}>
                                        <b style={{ fontSize: "0.7rem" }}>
                                          Date From
                                        </b>
                                      </label>{" "}
                                      <InputDatePicker
                                        name="StartDate"
                                        size="large"
                                        width="100%"
                                        value={
                                          chatDateState.StartDate
                                            ? DateDisplayFormat(
                                                chatDateState.StartDate
                                              )
                                            : null
                                        }
                                        DateRange
                                        placeholder={"Select Date"}
                                        change={onChangeDate}
                                      />
                                    </Col>
                                    <Col lg={6} md={6} sm={12}>
                                      <label style={{ marginLeft: "5px" }}>
                                        <b style={{ fontSize: "0.7rem" }}>
                                          Date To
                                        </b>
                                      </label>
                                      <InputDatePicker
                                        name="EndDate"
                                        size="large"
                                        width="100%"
                                        value={
                                          chatDateState.EndDate
                                            ? DateDisplayFormat(
                                                chatDateState.EndDate
                                              )
                                            : null
                                        }
                                        DateRange
                                        placeholder={"Select Date"}
                                        change={onChangeDate}
                                        disable={endDatedisable}
                                      />
                                    </Col>
                                  </Row>
                                ) : null}
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="text-center"
                              >
                                <Button
                                  className=" Ok-btn"
                                  text="Okay"
                                  onClick={emailChat}
                                />
                              </Col>
                            </Row>
                          </div>
                        </>
                      ) : deleteMessage === true ? (
                        <>
                          <div className="chat-menu-popups">
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <div className="chat-modal-Heading">
                                  <h1>Delete Messages</h1>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={2} md={2} sm={12}></Col>
                              <Col lg={4} md={4} sm={12}>
                                <Button
                                  className=" Ok-btn"
                                  text="Delete"
                                  onClick={() =>
                                    deleteSingleMessage(deleteMessageData)
                                  }
                                />
                              </Col>
                              <Col lg={4} md={4} sm={12}>
                                <Button
                                  className=" White-btn"
                                  text="Cancel"
                                  onClick={handleCancel}
                                />
                              </Col>
                              <Col lg={2} md={2} sm={12}></Col>
                            </Row>
                          </div>
                        </>
                      ) : leave === true ? (
                        <>
                          <div className="chat-menu-popups">
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                {" "}
                                <div className="chat-modal-Heading">
                                  <h1>
                                    {t("Are-you-sure-you-want-to-leave-group")}
                                  </h1>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="text-center"
                              >
                                <Button
                                  className=" Ok-btn mx-2"
                                  text={t("Yes")}
                                  onClick={() =>
                                    leaveGroupHandlerChat(
                                      talkStateData.ActiveChatData
                                    )
                                  }
                                />
                                <Button
                                  className=" White-btn"
                                  text={t("Cancel")}
                                  onClick={() => setLeave(false)}
                                />
                              </Col>
                            </Row>
                          </div>
                        </>
                      ) : null}
                    </>
                  </Col>
                </Row>

                <Row>
                  <Col className="positionRelative p-0">
                    <div
                      className={
                        save === true ||
                        print === true ||
                        email === true ||
                        deleteMessage === true
                          ? "chat-input-section applyBlur"
                          : "chat-input-section"
                      }
                    >
                      {showCheckboxes === false ? (
                        <>
                          {file === "" &&
                          tasksAttachments.TasksAttachments.length > 0 ? (
                            <div className="uploaded-file-section">
                              <div className="file-upload">
                                <Row>
                                  {tasksAttachments.TasksAttachments.length > 0
                                    ? tasksAttachments.TasksAttachments.map(
                                        (data, index) => {
                                          var ext =
                                            data.DisplayAttachmentName.split(
                                              "."
                                            ).pop();

                                          const first =
                                            data.DisplayAttachmentName.split(
                                              " "
                                            )[0];
                                          return (
                                            <Col
                                              sm={12}
                                              lg={3}
                                              md={3}
                                              className="chat-upload-icon"
                                            >
                                              <img
                                                draggable="false"
                                                src={DocumentIcon}
                                                className="attachment-icon"
                                                extension={ext}
                                              />
                                              <p className="chat-upload-text">
                                                {first}
                                              </p>
                                              <div className="delete-uplaoded-file">
                                                <img
                                                  draggable="false"
                                                  src={DeleteUploadIcon}
                                                  className="delete-upload-file cursor-pointer"
                                                  onClick={() =>
                                                    deleteFilefromAttachments(
                                                      data,
                                                      index
                                                    )
                                                  }
                                                  alt=""
                                                />
                                              </div>
                                            </Col>
                                          );
                                        }
                                      )
                                    : null}
                                </Row>
                              </div>
                            </div>
                          ) : null}
                          <div className="emoji-section" ref={emojiMenuRef}>
                            <div className="emoji-click" onClick={emojiClick}>
                              <img draggable="false" src={EmojiIcon} alt="" />
                            </div>
                            {emojiActive === true ? (
                              <Picker
                                data={data}
                                onEmojiSelect={selectedEmoji}
                                disabled={true}
                              />
                            ) : null}
                          </div>
                          {file === "" ? (
                            <div
                              className="upload-click positionRelative"
                              ref={uploadFileRef}
                            >
                              <span className="custom-upload-input">
                                <img
                                  draggable="false"
                                  src={UploadChatIcon}
                                  onClick={showUploadOptions}
                                />
                                {uploadOptions === true ? (
                                  <div className="upload-options">
                                    <div className="file-upload-options">
                                      <label
                                        className="image-upload"
                                        htmlFor="document-upload"
                                      >
                                        <img
                                          draggable="false"
                                          src={UploadDocument}
                                          alt=""
                                        />
                                      </label>
                                      <input
                                        id="document-upload"
                                        type="file"
                                        onChange={(event) =>
                                          handleFileUpload(event, "document")
                                        }
                                        onClick={(event) => {
                                          event.target.value = null;
                                        }}
                                        maxfilesize={10000000}
                                        accept=".doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg, .gif"
                                        style={{ display: "none" }}
                                      />
                                    </div>
                                    <div className="file-upload-options">
                                      <label
                                        className="image-upload"
                                        htmlFor="sticker-upload"
                                      >
                                        <img
                                          draggable="false"
                                          src={UploadSticker}
                                          alt=""
                                        />
                                      </label>
                                      <input
                                        id="sticker-upload"
                                        type="file"
                                        onChange={(event) =>
                                          handleFileUpload(event, "document")
                                        }
                                        onClick={(event) => {
                                          event.target.value = null;
                                        }}
                                        maxfilesize={10000000}
                                        accept=".doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg, .gif"
                                        style={{ display: "none" }}
                                      />
                                    </div>
                                    <div className="file-upload-options">
                                      <label
                                        className="image-upload"
                                        htmlFor="image-upload"
                                      >
                                        <img
                                          draggable="false"
                                          src={UploadPicVid}
                                          alt=""
                                        />
                                      </label>
                                      <input
                                        id="image-upload"
                                        type="file"
                                        onChange={(event) =>
                                          handleFileUpload(event, "image")
                                        }
                                        onClick={(event) => {
                                          event.target.value = null;
                                        }}
                                        maxfilesize={10000000}
                                        accept="image/*"
                                        style={{ display: "none" }}
                                      />
                                    </div>
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
                            }
                          >
                            <Form>
                              <Form.Control
                                onPaste={handlePaste}
                                ref={inputRef}
                                value={messageSendData.Body}
                                className="chat-message-input"
                                name="ChatMessage"
                                placeholder={"Type a Message"}
                                maxLength={200}
                                onChange={chatMessageHandler}
                                autoComplete="off"
                                disabled={
                                  talkStateData.ActiveChatData.isBlock === 1
                                    ? true
                                    : false
                                }
                                autoFocus={inputChat}
                                style={{ resize: "none", height: "100%" }}
                                as="textarea"
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
                          <div className="sendChat-click">
                            <img
                              draggable="false"
                              onClick={sendChat}
                              src={ChatSendIcon}
                              alt=""
                            />
                          </div>
                        </>
                      ) : forwardFlag === true ? (
                        <>
                          <Button
                            className=" White-btn"
                            text="Cancel"
                            onClick={cancelMessagesCheck}
                          />
                          <Button
                            className=" Ok-btn"
                            text="Forward"
                            onClick={
                              forwardMessageUsersSection === true
                                ? submitForwardMessages
                                : () => setForwardMessageUsersSection(true)
                            }
                            disableBtn={
                              messagesChecked.length > 0 ? false : true
                            }
                          />
                        </>
                      ) : deleteFlag === true ? (
                        <>
                          <Button
                            className=" White-btn"
                            text="Cancel"
                            onClick={cancelMessagesCheck}
                          />
                          <Button
                            className=" Ok-btn"
                            text="Delete"
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
            ) : messageInfo === true &&
              forwardMessageUsersSection === false &&
              showGroupInfo === false &&
              showGroupEdit === false ? (
              <div className="talk-screen-innerwrapper">
                <div className="message-body talk-screen-content">
                  <div className="message-heading d-flex mb-2">
                    <span className="text-left heading-info">Message info</span>
                    <span className="text-right ml-auto">
                      <img
                        draggable="false"
                        onClick={handleCancel}
                        src={CloseChatIcon}
                        alt=""
                        width={10}
                        className="cursor-pointer"
                      />
                    </span>
                  </div>
                  <div className="message-info-item">
                    <div className="Sent-with-icon">
                      <div className="heading-info status">Sent</div>
                      <img draggable="false" src={SingleTickIcon} alt="" />
                    </div>
                    <div className="time-info">
                      {messageInfoData.sentDate === undefined ? (
                        <p className="m-0">-</p>
                      ) : (
                        newTimeFormaterMIAsPerUTCTalkDateTime(
                          messageInfoData.sentDate
                        )
                      )}
                    </div>
                  </div>
                  <div className="message-info-item">
                    <div className="Sent-with-icon">
                      <div className="heading-info status">Delivered</div>
                      <img
                        draggable="false"
                        src={DoubleTickDeliveredIcon}
                        alt=""
                      />
                    </div>
                    <div className="time-info">
                      {messageInfoData.receivedDate === undefined ? (
                        <p className="m-0">-</p>
                      ) : (
                        newTimeFormaterMIAsPerUTCTalkDateTime(
                          messageInfoData.receivedDate
                        )
                      )}
                    </div>
                  </div>
                  <div className="message-info-item">
                    <div className="Sent-with-icon">
                      <div className="heading-info status">Read</div>
                      <img draggable="false" src={DoubleTickIcon} alt="" />
                    </div>
                    <div className="time-info">
                      {messageInfoData.seenDate === undefined ? (
                        <p className="m-0">-</p>
                      ) : (
                        newTimeFormaterMIAsPerUTCTalkDateTime(
                          messageInfoData.seenDate
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : messageInfo === false &&
              forwardMessageUsersSection === true &&
              showGroupInfo === false &&
              showGroupEdit === false ? (
              <>
                <Row className="mt-1">
                  <Col lg={6} md={6} sm={12}>
                    <p className="fw-bold">Forward to:</p>
                  </Col>
                  <Col lg={6} md={6} sm={12} className="text-end">
                    <img
                      draggable="false"
                      onClick={cancelForwardSection}
                      src={CloseChatIcon}
                      width={10}
                      className="cursor-pointer"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} style={{ marginBottom: "10px" }}>
                    <TextField
                      maxLength={200}
                      applyClass="form-control2"
                      name="Name"
                      change={(e) => {
                        searchUsers(e.target.value);
                      }}
                      value={searchUserValue}
                      placeholder="Search Users"
                      labelClass={"d-none"}
                    />
                  </Col>
                </Row>
                <div className="users-list-forward">
                  {allUsersGroupsRooms !== undefined &&
                  allUsersGroupsRooms !== null &&
                  allUsersGroupsRooms.length > 0
                    ? allUsersGroupsRooms.map((dataItem, index) => {
                        return (
                          <Row style={{ alignItems: "center" }}>
                            <Col
                              lg={2}
                              md={2}
                              sm={2}
                              style={{ paddingTop: "5px" }}
                            >
                              <Checkbox
                                checked={
                                  forwardUsersChecked.includes(dataItem)
                                    ? true
                                    : false
                                }
                                onChange={() =>
                                  forwardUsersCheckedHandler(
                                    dataItem,
                                    dataItem.id,
                                    index
                                  )
                                }
                                className=""
                              />
                            </Col>
                            <Col lg={10} md={10} sm={10}>
                              <div className="users-forward">
                                <div className="chat-profile-icon forward">
                                  {dataItem.messageType === "O" ? (
                                    <>
                                      <img
                                        draggable="false"
                                        src={SingleIcon}
                                        width={15}
                                      />
                                    </>
                                  ) : dataItem.messageType === "G" ? (
                                    <>
                                      <img
                                        draggable="false"
                                        src={GroupIcon}
                                        width={15}
                                      />
                                    </>
                                  ) : dataItem.messageType === "B" ? (
                                    <>
                                      <img
                                        draggable="false"
                                        src={ShoutIcon}
                                        width={15}
                                      />
                                    </>
                                  ) : (
                                    <img
                                      draggable="false"
                                      src={SingleIcon}
                                      width={15}
                                    />
                                  )}
                                </div>
                                <p className=" m-0">{dataItem.name}</p>
                              </div>
                            </Col>
                          </Row>
                        );
                      })
                    : null}
                </div>
                <Row>
                  <Col className="text-center">
                    <Button
                      className=" Ok-btn forward-user"
                      text="Forward"
                      onClick={submitForwardMessages}
                      disableBtn={forwardUsersChecked.length > 0 ? false : true}
                    />
                  </Col>
                </Row>
              </>
            ) : messageInfo === false &&
              forwardMessageUsersSection === false &&
              showGroupInfo === true &&
              showGroupEdit === false ? (
              <>
                <Row className="mt-1">
                  <Col lg={4} md={4} sm={12}></Col>
                  <Col
                    lg={4}
                    md={4}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <div className="chat-groupinfo-icon">
                      <img draggable="false" src={GroupIcon} width={28} />
                    </div>
                  </Col>
                  <Col lg={4} md={4} sm={12} className="text-end">
                    <img
                      className="cursor-pointer"
                      draggable="false"
                      onClick={handleCancel}
                      src={CloseChatIcon}
                      width={10}
                    />
                  </Col>
                </Row>
                <Row className="">
                  <Col lg={2} md={2} sm={12}></Col>
                  <Col lg={8} md={8} sm={12} className="text-center">
                    <p className="groupinfo-groupname m-0">
                      {groupInfoData === undefined || groupInfoData.length === 0
                        ? ""
                        : groupInfoData[0].name}
                    </p>
                    <p className="groupinfo-createdon m-0">
                      Created on:{" "}
                      {groupInfoData === undefined || groupInfoData.length === 0
                        ? ""
                        : newTimeFormaterAsPerUTCTalkDateTime(
                            messageInfoData.seenDate
                          )}
                    </p>
                  </Col>
                  <Col lg={2} md={2} sm={12} className="text-end"></Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} style={{ marginBottom: "5px" }}>
                    <TextField
                      maxLength={200}
                      applyClass="form-control2"
                      name="Name"
                      change={(e) => {
                        searchGroupInfoUser(e.target.value);
                      }}
                      value={searchGroupUserInfoValue}
                      placeholder="Search Users"
                      labelClass={"d-none"}
                    />
                  </Col>
                </Row>
                <div className="users-list-groupinfo">
                  {groupInfoData !== undefined &&
                  groupInfoData !== null &&
                  groupInfoData.length > 0
                    ? [
                        ...new Map(
                          groupInfoData.map((item) => [item.userID, item])
                        ).values(),
                      ].map((dataItem, index) => {
                        return (
                          <Row style={{ alignItems: "center" }}>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              style={{ paddingRight: "20px" }}
                            >
                              <div className="users-groupinfo">
                                <div className="chat-profile-icon groupinfo">
                                  <img
                                    draggable="false"
                                    src={SingleIcon}
                                    width={15}
                                  />
                                </div>
                                <p className="groupinfo-groupusersname m-0">
                                  {dataItem.userName}

                                  {dataItem.adminUser === dataItem.userID ? (
                                    <span className="groupinfo-admin">
                                      Admin
                                    </span>
                                  ) : null}
                                </p>
                              </div>
                            </Col>
                          </Row>
                        );
                      })
                    : null}
                </div>
              </>
            ) : messageInfo === false &&
              forwardMessageUsersSection === false &&
              showGroupInfo === false &&
              showGroupEdit === true ? (
              <>
                <Row className="mt-1">
                  <Col lg={4} md={4} sm={12}></Col>
                  <Col
                    lg={4}
                    md={4}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <div className="chat-groupinfo-icon">
                      <img draggable="false" src={GroupIcon} width={28} />
                    </div>
                  </Col>
                  <Col lg={4} md={4} sm={12} className="text-end">
                    <img
                      className="cursor-pointer"
                      draggable="false"
                      onClick={handleCancel}
                      src={CloseChatIcon}
                      width={10}
                    />
                  </Col>
                </Row>
                <Row className="">
                  <Col lg={2} md={2} sm={12}></Col>
                  {showEditGroupField === false ? (
                    <Col
                      lg={8}
                      md={8}
                      sm={12}
                      className="text-center d-flex align-items-center justify-content-center"
                    >
                      <p className="groupinfo-groupname m-0">
                        {groupName !== undefined && groupName !== null
                          ? groupName
                          : null}
                      </p>
                      <img
                        draggable="false"
                        onClick={editGroupTitle}
                        className="Edit-Group-Title-Icon cursor-pointer"
                        src={EditIcon}
                        alt=""
                      />
                    </Col>
                  ) : (
                    <Col
                      lg={8}
                      md={8}
                      sm={12}
                      className="text-center d-flex align-items-center justify-content-center"
                    >
                      <TextField
                        value={groupName}
                        className="chat-message-input"
                        name="ChatMessage"
                        placeholder={"Group Name"}
                        maxLength={200}
                        change={groupNameHandler}
                        autoComplete="off"
                        labelClass={"d-none"}
                      />
                    </Col>
                  )}
                  <Col lg={2} md={2} sm={12} className="text-end"></Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} style={{ marginBottom: "5px" }}>
                    <TextField
                      maxLength={200}
                      applyClass="form-control2"
                      name="Name"
                      change={(e) => {
                        searchGroupEditUser(e.target.value);
                      }}
                      value={searchGroupUserInfoValue}
                      placeholder="Search Users"
                      labelClass={"d-none"}
                    />
                  </Col>
                </Row>
                <div className="users-list-groupinfo">
                  {allUsers !== undefined &&
                  allUsers !== null &&
                  allUsers.length > 0
                    ? allUsers.map((dataItem, index) => {
                        return (
                          <Row style={{ alignItems: "center" }}>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              style={{ paddingRight: "20px" }}
                            >
                              <div className="users-groupinfo">
                                <Checkbox
                                  checked={
                                    Array.isArray(editGroupUsersChecked) &&
                                    (editGroupUsersChecked.some(
                                      (item) => item === dataItem.id
                                    ) ||
                                      (Array.isArray(groupInfoData) &&
                                        groupInfoData.some(
                                          (item) => item.userID === dataItem.id
                                        )))
                                      ? true
                                      : false
                                  }
                                  onChange={() =>
                                    editGroupUsersCheckedHandler(
                                      dataItem,
                                      dataItem.id,
                                      index
                                    )
                                  }
                                  className="group-edit-users-add"
                                />
                                <div className="chat-profile-icon groupinfo">
                                  <img
                                    draggable="false"
                                    src={SingleIcon}
                                    width={15}
                                  />
                                </div>
                                <p className="groupinfo-groupusersname m-0">
                                  {dataItem.fullName}
                                </p>
                              </div>
                            </Col>
                          </Row>
                        );
                      })
                    : null}
                </div>
                <Row>
                  <Col>
                    <div className="edit-group-button">
                      <Button
                        className=" Ok-btn forward-user"
                        text="Edit Group"
                        onClick={editGroup}
                      />
                    </div>
                  </Col>
                </Row>
              </>
            ) : messageInfo === false &&
              forwardMessageUsersSection === false &&
              showGroupInfo === false &&
              showGroupEdit === false ? (
              <>
                <Row className="mt-1">
                  <Col lg={4} md={4} sm={12}></Col>
                  <Col
                    lg={4}
                    md={4}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <div className="chat-groupinfo-icon">
                      <img draggable="false" src={ShoutIcon} width={20} />
                    </div>
                  </Col>
                  <Col lg={4} md={4} sm={12} className="text-end">
                    <img
                      draggable="false"
                      onClick={handleCancel}
                      src={CloseChatIcon}
                      width={10}
                      className="cursor-pointer"
                    />
                  </Col>
                </Row>
                <Row className="">
                  <Col lg={2} md={2} sm={12}></Col>
                  {showEditShoutField === false ? (
                    <Col
                      lg={8}
                      md={8}
                      sm={12}
                      className="text-center d-flex align-items-center justify-content-center"
                    >
                      <p className="groupinfo-groupname m-0">
                        {shoutName !== undefined && shoutName !== null
                          ? shoutName
                          : null}
                      </p>
                      <img
                        draggable="false"
                        onClick={editShoutTitle}
                        className="Edit-Group-Title-Icon cursor-pointer"
                        src={EditIcon}
                        alt=""
                      />
                    </Col>
                  ) : (
                    <Col
                      lg={8}
                      md={8}
                      sm={12}
                      className="text-center d-flex align-items-center justify-content-center"
                    >
                      <TextField
                        value={shoutName}
                        className="chat-message-input"
                        name="ChatMessage"
                        placeholder={"Shout Name"}
                        maxLength={200}
                        change={shoutNameHandler}
                        autoComplete="off"
                        labelClass={"d-none"}
                      />
                    </Col>
                  )}
                  <Col lg={2} md={2} sm={12} className="text-end"></Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} style={{ marginBottom: "5px" }}>
                    <TextField
                      maxLength={200}
                      applyClass="form-control2"
                      name="Name"
                      change={(e) => {
                        searchShoutEditUser(e.target.value);
                      }}
                      value={searchUserShoutValue}
                      placeholder="Search Users"
                      labelClass={"d-none"}
                    />
                  </Col>
                </Row>
                <div className="users-list-groupinfo">
                  {allUsers !== undefined &&
                  allUsers !== null &&
                  allUsers.length > 0
                    ? allUsers.map((dataItem, index) => {
                        return (
                          <Row style={{ alignItems: "center" }}>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              style={{ paddingRight: "20px" }}
                            >
                              <div className="users-groupinfo">
                                <Checkbox
                                  checked={
                                    Array.isArray(editShoutUsersChecked) &&
                                    (editShoutUsersChecked.some(
                                      (item) => item === dataItem.id
                                    ) ||
                                      (Array.isArray(shoutAllUsersData) &&
                                        shoutAllUsersData.some(
                                          (item) => item.userID === dataItem.id
                                        )))
                                      ? true
                                      : false
                                  }
                                  onChange={() =>
                                    editShoutUsersCheckedHandler(
                                      dataItem,
                                      dataItem.id,
                                      index
                                    )
                                  }
                                  className="group-edit-users-add"
                                />
                                <div className="chat-profile-icon groupinfo">
                                  <img
                                    draggable="false"
                                    src={SingleIcon}
                                    width={15}
                                  />
                                </div>
                                <p className="groupinfo-groupusersname m-0">
                                  {dataItem.fullName}
                                </p>
                              </div>
                            </Col>
                          </Row>
                        );
                      })
                    : null}
                </div>
                <Row>
                  <Col>
                    <div className="edit-group-button">
                      <Button
                        className=" Ok-btn forward-user"
                        text="Edit Shout"
                        onClick={editShoutAll}
                      />
                    </div>
                  </Col>
                </Row>
              </>
            ) : null}
          </Container>
        </div>
      </div>

      <NotificationBar
        iconName={<img draggable="false" src={SecurityIcon} />}
        notificationMessage={notification.message}
        notificationState={notification.notificationShow}
        setNotification={setNotification}
        handleClose={closeNotification}
        id={notificationID}
      />
    </>
  );
};

export default ChatMainBody;
