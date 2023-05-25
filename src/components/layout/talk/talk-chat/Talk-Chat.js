import React, { useState, useEffect, useRef } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import moment from 'moment'
import './Talk-Chat.css'
import { Triangle } from 'react-bootstrap-icons'
import {
  GetAllUserChats,
  GetBlockedUsers,
  GetOTOUserMessages,
  GetGroupMessages,
  GetAllUsers,
  GetFlagMessages,
  GetBroadcastMessages,
  InsertOTOMessages,
  BlockUnblockUser,
  DeleteSingleMessage,
  GetAllUsersGroupsRoomsList,
  InsertPrivateGroupMessages,
  InsertBroadcastMessages,
  CreatePrivateGroup,
  GetAllPrivateGroupMembers,
  MarkStarredUnstarredMessage,
  activeChatID,
  activeMessageID,
} from '../../../../store/actions/Talk_action'
import {
  newTimeFormaterAsPerUTCTalkTime,
  newTimeFormaterAsPerUTCTalkDate,
  newTimeFormaterAsPerUTCTalkDateTime,
} from './../../../../commen/functions/date_formater'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container, Form } from 'react-bootstrap'
import { Select, Checkbox } from 'antd'
import {
  DateDisplayFormat,
  DateSendingFormat,
} from '../../../../commen/functions/date_formater'
import {
  TextField,
  ChatModal,
  InputDatePicker,
  Button,
  NotificationBar,
} from '../../../elements'
// import Highlighter from 'react-highlight-words'
import CustomUploadChat from '../../../elements/chat_upload/Chat-Upload'
import Keywords from 'react-keywords'
import { Spin } from 'antd'
import SearchIcon from '../../../../assets/images/Search-Icon.png'
import SecurityIcon from '../../../../assets/images/Security-Icon.png'
import FullScreenIcon from '../../../../assets/images/Fullscreen-Icon.png'
import DoubleTickIcon from '../../../../assets/images/DoubleTick-Icon.png'
import DoubleTickDeliveredIcon from '../../../../assets/images/DoubleTickDelivered-Icon.png'
import SingleTickIcon from '../../../../assets/images/SingleTick-Icon.png'
import TimerIcon from '../../../../assets/images/Timer-Icon.png'
import CrossIcon from '../../../../assets/images/Cross-Icon.png'
import SecurityIconMessasgeBox from '../../../../assets/images/SecurityIcon-MessasgeBox.png'
import MenuIcon from '../../../../assets/images/Menu-Chat-Icon.png'
import VideoCallIcon from '../../../../assets/images/VideoCall-Icon.png'
import CloseChatIcon from '../../../../assets/images/Cross-Chat-Icon.png'
import SearchChatIcon from '../../../../assets/images/Search-Chat-Icon.png'
import AddChatIcon from '../../../../assets/images/Add-Plus-Icon.png'
import EmojiIcon from '../../../../assets/images/Emoji-Select-Icon.png'
import UploadChatIcon from '../../../../assets/images/Upload-Chat-Icon.png'
import MicIcon from '../../../../assets/images/Mic-Icon.png'
import DeleteUploadIcon from '../../../../assets/images/Delete-Upload-Icon.png'
import DeleteChatFeature from '../../../../assets/images/Delete-ChatFeature-Icon.png'
import ChatSendIcon from '../../../../assets/images/Chat-Send-Icon.png'
import DocumentIcon from '../../../../assets/images/Document-Icon.png'
import DropDownIcon from '../../../../assets/images/dropdown-icon.png'
import DropDownChatIcon from '../../../../assets/images/dropdown-icon-chatmessage.png'
import UploadContact from '../../../../assets/images/Upload-Contact.png'
import UploadDocument from '../../../../assets/images/Upload-Document.png'
import UploadPicVid from '../../../../assets/images/Upload-PicVid.png'
import UploadSticker from '../../../../assets/images/Upload-Sticker.png'
import SingleIcon from '../../../../assets/images/Single-Icon.png'
import GroupIcon from '../../../../assets/images/Group-Icon.png'
import ShoutIcon from '../../../../assets/images/Shout-Icon.png'
import StarredMessageIcon from '../../../../assets/images/Starred-Message-Icon.png'
import EditIcon from '../../../../assets/images/Edit-Icon.png'
import { useTranslation } from 'react-i18next'
import {
  oneToOneMessages,
  groupMessages,
  unreadMessageCountFunction,
  groupCreationFunction,
  markStarUnstarFunction,
} from './oneToOneMessage'
import { sendChatFunction } from './sendChat'

const TalkChat = () => {
  //Current User ID
  let currentUserId = localStorage.getItem('userID')

  //Current Organization
  let currentOrganizationId = localStorage.getItem('organizationID')

  //Current UserName
  let currentUserName = localStorage.getItem('name')

  //Translation
  const { t } = useTranslation()

  //Current language
  let lang = localStorage.getItem('i18nextLng')

  // Using dispatch To Call APIs
  const dispatch = useDispatch()

  //Getting api result from the reducer
  const { talkStateData } = useSelector((state) => state)

  //Current Date Time in variable
  // var currentDateTime = moment().format('YYYYMMDDHHmmss')
  // var currentDateYesterday = moment().subtract(1, 'days').format('YYYYMMDD')
  // var currentDate = moment().format('YYYYMMDD')
  // var currentTime = moment().format('HHmmss')

  const date = new Date()

  //CURRENT DATE TIME UTC
  let currentDateTime = new Date()
  let changeDateFormatCurrent = moment(currentDateTime).utc()
  let currentDateTimeUtc = moment(changeDateFormatCurrent).format(
    'YYYYMMDDHHmmss',
  )

  let currentUtcDate = currentDateTimeUtc.slice(0, 8)
  let currentUtcTime = currentDateTimeUtc.slice(8, 15)

  //YESTERDAY'S DATE
  let yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1) // Subtract 1 day
  let changeDateFormatYesterday = moment(yesterdayDate).utc()
  let yesterdayDateUtc = moment(changeDateFormatYesterday).format('YYYYMMDD')

  //Opening Chat States
  const [activeChat, setActiveChat] = useState([])
  const [chatOpen, setChatOpen] = useState(false)

  //Scroll down state
  const chatMessages = useRef()

  //search chat states
  const [searchChatValue, setSearchChatValue] = useState('')
  const [allChatData, setAllChatData] = useState([])

  //search group user states
  const [searchGroupUserValue, setSearchGroupUserValue] = useState('')

  //Loading State
  const [isLoading, setIsLoading] = useState(true)

  //Opening Encryption Message
  const [openEncryptionDialogue, setOpenEncryptionDialogue] = useState(false)

  //File Upload
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  })

  //Show Emoji or Not
  const [emojiActive, setEmojiActive] = useState(false)

  //Add User Chat States
  const [addNewChat, setAddNewChat] = useState(false)

  //Create Group States
  const [activeCreateGroup, setActiveCreateGroup] = useState(false)

  //Global Search Filter
  const [globalSearchFilter, setGlobalSearchFilter] = useState(false)

  //Dropdown state of chat menu (Dot wali)
  const [chatMenuActive, setChatMenuActive] = useState(false)

  //Dropdown state of chat head menu (Dropdown icon wali)
  const [chatHeadMenuActive, setChatHeadMenuActive] = useState(false)

  //Enable Chat feature Options
  const [chatFeatures, setChatFeatures] = useState(false)

  //Create Group Participant Check
  const [noParticipant, setNoParticipant] = useState(false)

  //Menus of the state
  const [save, setSave] = useState(false)
  const [print, setPrint] = useState(false)
  const [email, setEmail] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState(false)
  const [messageInfo, setMessageInfo] = useState(false)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [showGroupEdit, setShowGroupEdit] = useState(false)

  //Popup Options
  const [todayCheckState, setTodayCheckState] = useState(false)
  const [allCheckState, setAllCheckState] = useState(false)
  const [customCheckState, setCustomCheckState] = useState(false)

  //Checkbox of sender receiver
  const [senderCheckbox, setSenderCheckbox] = useState(false)
  // const [receiverCheckbox, setReceiverCheckbox] = useState(false);

  //reveal checkboxes state
  const [showCheckboxes, setShowCheckboxes] = useState(false)

  // Modal Date States
  const [endDatedisable, setEndDatedisable] = useState(true)
  const [chatDateState, setChatDateState] = useState({
    StartDate: '',
    EndDate: '',
  })

  //delete chat
  const [deleteChat, setDeleteChat] = useState(false)

  //Upload Options
  const [uploadOptions, setUploadOptions] = useState(false)

  //Enable Chat Feature Options
  const [chatFeatureActive, setChatFeatureActive] = useState(false)

  //Reply Option
  const [replyFeature, setReplyFeature] = useState(false)

  //Blocked Users State
  const [blockedUsersData, setBlockedUsersData] = useState([])

  //Shoutall Messages State
  const [shoutAllData, setShoutAllData] = useState([])

  //Private Messages State
  const [privateMessageData, setPrivateMessageData] = useState([])

  //Private Groups State
  const [privateGroupsData, setPrivateGroupsData] = useState([])

  //Starred Messages State
  const [starredMessagesData, setStarredMessagesData] = useState([])

  // Chat Filter Options
  const chatFilterOptions = [
    { className: 'talk-chat-filter', label: 'Recent Chats', value: 1 },
    { className: 'talk-chat-filter', label: 'Private Message', value: 2 },
    { className: 'talk-chat-filter', label: 'Private Group', value: 3 },
    // { className: 'talk-chat-filter', label: 'Meetings Group', value: 4 },
    { className: 'talk-chat-filter', label: 'Starred Message', value: 5 },
    { className: 'talk-chat-filter', label: 'Shout All', value: 6 },
    // { className: 'talk-chat-filter', label: 'Hashtag', value: 7 },
    { className: 'talk-chat-filter', label: 'Blocked User', value: 8 },
  ]

  // for   select Chat Filter Name
  const [chatFilterName, setChatFilterName] = useState(chatFilterOptions[0])

  //Chat Filter State
  const [chatFilter, setChatFilter] = useState({
    value: chatFilterOptions[0].value,
    label: chatFilterOptions[0].label,
  })

  //all oto messages
  const [allOtoMessages, setAllOtoMessages] = useState([])

  //Group Messages State
  const [allGroupMessages, setAllGroupMessages] = useState([])

  //Broadcast Messages State
  const [allBroadcastMessages, setAllBroadcastMessages] = useState([])

  //all users states
  const [allUsers, setAllUsers] = useState([])

  //all users states
  const [allUsersGroupsRooms, setAllUsersGroupsRooms] = useState([])

  //reply state data
  const [replyData, setReplyData] = useState({
    messageID: 0,
    senderName: '',
    messageBody: '',
  })

  //messages checked
  const [messagesChecked, setMessagesChecked] = useState([])

  //group users checked
  const [groupUsersChecked, setGroupUsersChecked] = useState([])

  //Group Name State for Creation/Modification
  const [groupNameValue, setGroupNameValue] = useState('')

  //forward users checked
  const [forwardUsersChecked, setForwardUsersChecked] = useState([])

  //forward message user list section
  const [forwardMessageUsersSection, setForwardMessageUsersSection] = useState(
    false,
  )

  //group edit users state
  const [editGroupUsersChecked, setEditGroupUsersChecked] = useState([])

  //Message info data
  const [messageInfoData, setMessageInfoData] = useState({
    sentDate: '',
    receivedDate: '',
    seenDate: '',
  })

  //Message Insert Data
  const [messageSendData, setMessageSendData] = useState({
    SenderID: currentUserId.toString(),
    ReceiverID: '0',
    Body: '',
    MessageActivity: 'Direct Message',
    FileName: '',
    FileGeneratedName: '',
    Extension: '',
    AttachmentLocation: '',
  })

  //saving chat click data in a state
  const [chatClickData, setChatClickData] = useState({
    id: 0,
    fullName: '',
    imgURL: '',
    messageBody: '',
    messageDate: '',
    notiCount: 0,
    messageType: '',
    isOnline: true,
    companyName: '',
    sentDate: '',
    receivedDate: '',
    seenDate: '',
    attachmentLocation: '',
    senderID: 0,
    admin: 0,
    isBlock: 0,
  })

  //Current Group Members State
  const [groupInfoData, setGroupInfoData] = useState([])

  const [searchGroupUserInfoValue, setSearchGroupUserInfoValue] = useState('')

  //unblock user id states
  const [unblockUserId, setUnblockUserId] = useState(null)

  //message click data
  const [messageClickData, setMessageClickData] = useState([])

  //Unread Message Count State MQTT
  const [mqttUnreadMessageData, setMqttUnreadMessageData] = useState([])

  const [showEditGroupField, setShowEditGroupField] = useState(false)

  //Chat Search
  const [showChatSearch, setShowChatSearch] = useState(false)

  const [searchChatWord, setSearchChatWord] = useState('')

  //Notification States
  var min = 10000
  var max = 90000
  var id = min + Math.random() * (max - min)

  const [notification, setNotification] = useState({
    notificationShow: false,
    message: '',
  })

  const [notificationID, setNotificationID] = useState(0)

  //Calling API
  useEffect(() => {
    dispatch(
      GetAllUserChats(
        parseInt(currentUserId),
        parseInt(currentOrganizationId),
        t,
      ),
    )
    dispatch(GetBlockedUsers(currentUserId, currentOrganizationId, t))
    dispatch(GetFlagMessages(currentUserId, currentOrganizationId, t))
    dispatch(
      GetAllUsers(parseInt(currentUserId), parseInt(currentOrganizationId), t),
    )
    dispatch(
      GetAllUsersGroupsRoomsList(
        parseInt(currentUserId),
        parseInt(currentOrganizationId),
        t,
      ),
    )
    // let Data = {
    //   GroupID: activeChat.id,
    //   ChannelID: currentOrganizationId,
    // }
    // dispatch(GetAllPrivateGroupMembers(Data, t))
  }, [])

  //Single Message Entire Data
  useEffect(() => {
    if (
      talkStateData.activeMessageIdData !== undefined &&
      talkStateData.activeMessageIdData !== null &&
      talkStateData.activeMessageIdData.length !== 0
    ) {
      setMessageClickData(talkStateData?.activeMessageIdData)
    }
  }, [talkStateData?.activeMessageIdData])

  //Setting state data of global response all chat to chatdata
  useEffect(() => {
    if (
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      setAllChatData(talkStateData?.AllUserChats?.AllUserChatsData?.allMessages)
    }
  }, [talkStateData?.AllUserChats?.AllUserChatsData?.allMessages])

  //All group members info data
  useEffect(() => {
    if (
      talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse !==
        undefined &&
      talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse !==
        null &&
      talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse !==
        []
    ) {
      setGroupInfoData(
        talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
          ?.groupUsers,
      )
    }
  }, [
    talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
      ?.groupUsers,
  ])

  //Setting state data of all users
  useEffect(() => {
    if (
      talkStateData.AllUsers.AllUsersData !== undefined &&
      talkStateData.AllUsers.AllUsersData !== null &&
      talkStateData.AllUsers.AllUsersData !== []
    ) {
      setAllUsers(talkStateData.AllUsers.AllUsersData.allUsers)
    }
  }, [talkStateData?.AllUsers?.AllUsersData?.allUsers])

  //Auto store in state
  useEffect(() => {
    let privateGroupMembers =
      talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
        .groupUsers
    let allUsers = talkStateData.AllUsers.AllUsersData.allUsers
    if (
      privateGroupMembers !== undefined &&
      privateGroupMembers !== null &&
      allUsers !== undefined &&
      allUsers !== null
    ) {
      let groupMembersArray = privateGroupMembers
        .filter((item) => {
          return allUsers.some((user) => user.id === item.userID)
        })
        .map((item) => item.userID)

      setEditGroupUsersChecked(groupMembersArray)
    }
  }, [
    talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
      .groupUsers,
  ])

  //All users groups rooms
  useEffect(() => {
    if (
      talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData !==
        undefined &&
      talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData !==
        null &&
      talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData !== []
    ) {
      setAllUsersGroupsRooms(
        talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData
          .userInformation,
      )
    }
  }, [
    talkStateData?.AllUsersGroupsRoomsList?.AllUsersGroupsRoomsListData
      ?.userInformation,
  ])

  //Storing all users in a variable
  // const allChatsList = talkStateData.AllUserChats.AllUserChatsData.allMessages

  //Clicking on Security Icon
  const securityDialogue = () => {
    setOpenEncryptionDialogue(true)
  }

  //Clicking on Close Security Icon
  const closeSecurityDialogue = () => {
    setOpenEncryptionDialogue(false)
  }

  //Emoji on click function
  const emojiClick = () => {
    if (emojiActive === false) {
      setEmojiActive(true)
    } else {
      setEmojiActive(false)
    }
  }

  const [uploadFileTalk, setUploadFileTalk] = useState([])

  //File Upload click Function
  const fileUploadTalk = (data) => {
    const uploadFilePath = data.target.value
    const uploadedFile = data.target.files[0]
    var ext = uploadedFile.name.split('.').pop()
    let file = []
    if (
      ext === 'doc' ||
      ext === 'docx' ||
      ext === 'xls' ||
      ext === 'xlsx' ||
      ext === 'pdf' ||
      ext === 'png' ||
      ext === 'txt' ||
      ext === 'jpg' ||
      ext === 'jpeg' ||
      ext === 'gif'
    ) {
      let data
      let sizezero
      let size
      if (file.length > 0) {
        file.map((filename, index) => {
          if (filename.DisplayFileName === uploadedFile.name) {
            data = false
          }
        })
        if (uploadedFile.size > 10000000) {
          size = false
        } else if (uploadedFile.size === 0) {
          sizezero = false
        }
        if (data === false) {
        } else if (size === false) {
        } else if (sizezero === false) {
        } else {
          setUploadFileTalk(uploadedFile)
        }

        if (size === false) {
        } else if (sizezero === false) {
        } else {
          setUploadFileTalk(uploadedFile)
        }
      }
    }
    setTasksAttachments({ ['TasksAttachments']: file })
    setUploadOptions(false)
    setUploadFileTalk(uploadedFile)
  }

  //Delete uploaded File
  const deleteFilefromAttachments = (data, index) => {
    let searchIndex = tasksAttachments.TasksAttachments
    searchIndex.splice(index, 1)
    setTasksAttachments({
      ...tasksAttachments,
      ['TasksAttachments']: searchIndex,
    })
  }

  //ChatFilter Selection Handler
  const chatFilterHandler = (e, value) => {
    setChatFilterName(value.label)
    let filters = chatFilterOptions
    if (filters != undefined) {
      if (chatFilterOptions.length > 0) {
        chatFilterOptions.filter((data, index) => {
          if (data.label === value.label) {
            setChatFilter({
              label: data.label,
              value: data.value,
            })
          }
        })
      }
      if (value.value === 1) {
        if (
          talkStateData.AllUserChats.AllUserChatsData !== undefined &&
          talkStateData.AllUserChats.AllUserChatsData !== null &&
          talkStateData.AllUserChats.AllUserChatsData.length !== 0
        ) {
          setAllChatData(
            talkStateData?.AllUserChats?.AllUserChatsData?.allMessages,
          )
        } else {
          setAllChatData([])
        }
        setBlockedUsersData([])
        setShoutAllData([])
        setPrivateMessageData([])
        setPrivateGroupsData([])
        setStarredMessagesData([])
      } else if (value.value === 2) {
        if (
          talkStateData.AllUserChats.AllUserChatsData !== undefined &&
          talkStateData.AllUserChats.AllUserChatsData !== null &&
          talkStateData.AllUserChats.AllUserChatsData.length !== 0
        ) {
          let privateAllMessages = talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
            (data, index) => data.messageType === 'O',
          )
          setPrivateMessageData(privateAllMessages)
        } else {
          setPrivateMessageData([])
        }
        setBlockedUsersData([])
        setShoutAllData([])
        setPrivateGroupsData([])
        setStarredMessagesData([])
        setAllChatData([])
      } else if (value.value === 3) {
        if (
          talkStateData.AllUserChats.AllUserChatsData !== undefined &&
          talkStateData.AllUserChats.AllUserChatsData !== null &&
          talkStateData.AllUserChats.AllUserChatsData.length !== 0
        ) {
          let privateGroupsMessages = talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
            (data, index) => data.messageType === 'G',
          )
          setPrivateGroupsData(privateGroupsMessages)
        } else {
          setPrivateGroupsData([])
        }

        setPrivateMessageData([])
        setBlockedUsersData([])
        setShoutAllData([])
        setStarredMessagesData([])
        setAllChatData([])
      } else if (value.value === 5) {
        setPrivateMessageData([])
        setBlockedUsersData([])
        setShoutAllData([])
        setPrivateGroupsData([])
        if (
          talkStateData?.FlagMessages?.FlagMessagesData !== undefined &&
          talkStateData?.FlagMessages?.FlagMessagesData !== null &&
          talkStateData?.FlagMessages?.FlagMessagesData.length !== 0
        ) {
          setStarredMessagesData(
            talkStateData?.FlagMessages?.FlagMessagesData?.flagMessages,
          )
        } else {
          setStarredMessagesData([])
        }
        setAllChatData([])
      } else if (value.value === 6) {
        if (
          talkStateData.AllUserChats.AllUserChatsData !== undefined &&
          talkStateData.AllUserChats.AllUserChatsData !== null &&
          talkStateData.AllUserChats.AllUserChatsData.length !== 0
        ) {
          let shoutAllMessages = talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
            (data, index) => data.messageType === 'B',
          )
          setShoutAllData(shoutAllMessages)
        } else {
          setShoutAllData([])
        }

        setBlockedUsersData([])
        setPrivateMessageData([])
        setPrivateGroupsData([])
        setStarredMessagesData([])
        setAllChatData([])
      } else if (value.value === 8) {
        if (
          talkStateData.BlockedUsers.BlockedUsersData !== undefined &&
          talkStateData.BlockedUsers.BlockedUsersData !== null &&
          talkStateData.BlockedUsers.BlockedUsersData.length !== 0
        ) {
          setBlockedUsersData(
            talkStateData?.BlockedUsers?.BlockedUsersData?.blockedUsers,
          )
        }
        setShoutAllData([])
        setPrivateMessageData([])
        setPrivateGroupsData([])
        setStarredMessagesData([])
        setAllChatData([])
      } else {
      }
    }
  }

  //Clicking on Chat Function
  const chatClick = (record) => {
    dispatch(
      GetAllUserChats(
        parseInt(currentUserId),
        parseInt(currentOrganizationId),
        t,
      ),
    )

    let chatOTOData = {
      UserID: currentUserId,
      ChannelID: currentOrganizationId,
      OpponentUserId: record.id,
      NumberOfMessages: 50,
      OffsetMessage: 0,
    }

    let chatGroupData = {
      UserID: parseInt(currentUserId),
      ChannelID: currentOrganizationId,
      GroupID: record.id,
      NumberOfMessages: 50,
      OffsetMessage: 0,
    }

    let broadcastMessagesData = {
      UserID: currentUserId,
      BroadcastID: record.id,
      NumberOfMessages: 10,
      OffsetMessage: 5,
    }

    if (record.messageType === 'O') {
      setAllGroupMessages([])
      setAllBroadcastMessages([])
      dispatch(GetOTOUserMessages(chatOTOData, t))
    } else if (record.messageType === 'G') {
      setAllOtoMessages([])
      setAllBroadcastMessages([])
      dispatch(GetGroupMessages(chatGroupData, t))
    } else if (record.messageType === 'B') {
      setAllOtoMessages([])
      setAllGroupMessages([])
      dispatch(GetBroadcastMessages(broadcastMessagesData, t))
    }
    try {
      if (
        record.messageType != '' &&
        record.messageType &&
        record.id &&
        record.id != 0
      ) {
        let newData = {
          messageType: record.messageType,
          id: record.id,
        }
        dispatch(activeChatID(newData))
      }
    } catch {
      console.log('error on open chat data slection')
    }

    setMessageSendData({
      ...messageSendData,
      ReceiverID: record.id.toString(),
    })

    setChatClickData({
      ...chatClickData,
      id: record.id,
      fullName: record.fullName,
      imgURL: record.imgURL,
      messageBody: record.messageBody,
      messageDate: record.messageDate,
      notiCount: record.notiCount,
      messageType: record.messageType,
      isOnline: record.isOnline,
      companyName: record.companyName,
      sentDate: record.sentDate,
      receivedDate: record.receivedDate,
      seenDate: record.seenDate,
      attachmentLocation: record.attachmentLocation,
      senderID: record.senderID,
      admin: record.admin,
      isBlock: record.isBlock,
    })
    console.log('recordrecordrecordrecordrecord', record)

    setActiveChat(record)
    setChatOpen(true)
    setAddNewChat(false)
    setActiveCreateGroup(false)
    setGlobalSearchFilter(false)
    setSearchChatValue('')
    if (
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      setAllChatData(talkStateData?.AllUserChats?.AllUserChatsData?.allMessages)
    } else {
      setAllChatData([])
    }
    setShoutAllData([])
    setPrivateMessageData([])
    setPrivateGroupsData([])
    setStarredMessagesData([])
    setBlockedUsersData([])
  }

  const chatClickNewChat = (record) => {
    setAllOtoMessages([])
    let newChatData = {
      admin: 0,
      attachmentLocation: '',
      companyName: record.companyName,
      fullName: record.fullName,
      id: record.id,
      imgURL: record.imgURL,
      isOnline: false,
      messageBody: '',
      messageDate: '',
      messageType: 'O',
      notiCount: 0,
      receivedDate: '',
      seenDate: '',
      senderID: 0,
      sentDate: '',
    }
    setMessageSendData({
      ...messageSendData,
      ReceiverID: record.id.toString(),
    })
    setActiveChat(newChatData)
    setChatClickData({
      ...chatClickData,
      messageType: 'O',
    })
    let chatOTOData = {
      UserID: currentUserId,
      ChannelID: currentOrganizationId,
      OpponentUserId: record.id,
      NumberOfMessages: 50,
      OffsetMessage: 0,
    }
    dispatch(GetOTOUserMessages(chatOTOData, t))

    setChatOpen(true)
    setAddNewChat(false)
    setActiveCreateGroup(false)
    setGlobalSearchFilter(false)
    setSearchChatValue('')
    if (
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      setAllChatData(talkStateData.AllUserChats.AllUserChatsData.allMessages)
    } else {
      setAllChatData([])
    }
    setShoutAllData([])
    setPrivateMessageData([])
    setPrivateGroupsData([])
    setStarredMessagesData([])
    setBlockedUsersData([])
  }

  const closeChat = () => {
    setChatOpen(false)
    setSave(false)
    setPrint(false)
    setEmail(false)
    setDeleteMessage(false)
    setMessageInfo(false)
    setShowGroupInfo(false)
    setTodayCheckState(false)
    setAllCheckState(false)
    setCustomCheckState(false)
    setChatDateState({
      ...chatDateState,
      StartDate: '',
      EndDate: '',
    })
    setEndDatedisable(true)
    setDeleteChat(false)
    setShowGroupEdit(false)
    setShowEditGroupField(false)
    setEmojiActive(false)
    setAddNewChat(false)
    setActiveCreateGroup(false)
    setGlobalSearchFilter(false)
    setChatMenuActive(false)
    setChatHeadMenuActive(false)
    setChatFeatures(false)
    setNoParticipant(false)
    setDeleteMessage(false)
    setMessageInfo(false)
    setShowGroupInfo(false)
    setShowGroupEdit(false)
    setTodayCheckState(false)
    setAllCheckState(false)
    setCustomCheckState(false)
    setSenderCheckbox(false)
    setShowCheckboxes(false)
    setEndDatedisable(false)
    setDeleteChat(false)
    setUploadOptions(false)
    setChatFeatureActive(false)
    setReplyFeature(false)
    setShowChatSearch(false)
    setAllOtoMessages([])
    setAllGroupMessages([])
    let newData = {
      messageType: '',
      id: 0,
    }
    dispatch(activeChatID(newData))
  }

  //Add Click Function
  const addChat = () => {
    dispatch(
      GetAllUsers(parseInt(currentUserId), parseInt(currentOrganizationId), t),
    )
    setAddNewChat(true)
    setActiveCreateGroup(false)
  }

  //Create Group Screen
  const createGroupScreen = () => {
    setActiveCreateGroup(true)
    setAddNewChat(false)
    setPrivateGroupsData([])
  }

  //Close Add Chat
  const closeAddChat = () => {
    setAddNewChat(false)
  }

  const closeAddGroupScreen = () => {
    let privateGroupsMessages = talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
      (data, index) => data.messageType === 'G',
    )
    setPrivateGroupsData(privateGroupsMessages)
    setActiveCreateGroup(false)
    setGroupNameValue('')
    setSearchGroupUserValue('')
    setGroupUsersChecked([])
  }

  //Search Chat
  const searchChat = (e) => {
    setSearchChatValue(e)
    if (e !== '') {
      let filteredData = talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
        (value) => {
          return value.fullName.toLowerCase().includes(e.toLowerCase())
        },
      )
      setAllChatData(filteredData)
    } else if (e === '' || e === null) {
      let data = talkStateData.AllUserChats.AllUserChatsData.allMessages
      setSearchChatValue('')
      setAllChatData(data)
    }
  }

  //Search Group Chat
  const searchGroupUser = (e) => {
    if (e !== '') {
      setSearchGroupUserValue(e)
      let filteredData = talkStateData.AllUsers.AllUsersData.allUsers.filter(
        (value) => {
          return value.fullName
            .toLowerCase()
            .includes(searchGroupUserValue.toLowerCase())
        },
      )
      setAllUsers(filteredData)
    } else if (e === '' || e === null) {
      let data = talkStateData.AllUsers.AllUsersData.allUsers
      setSearchGroupUserValue('')
      setAllUsers(data)
    }
  }

  //search filter global chat
  const searchFilterChat = () => {
    if (globalSearchFilter === false) {
      setGlobalSearchFilter(true)
    } else {
      setGlobalSearchFilter(false)
    }
  }

  //Managing that state, if show or hide
  const activateChatMenu = () => {
    if (chatMenuActive === false) {
      setChatMenuActive(true)
    } else {
      setChatMenuActive(false)
    }
  }

  //Managing that state of chat head, if show or hide
  const activateChatHeadMenu = (id) => {
    if (chatHeadMenuActive === false) {
      setChatHeadMenuActive(id)
    } else {
      setChatHeadMenuActive(false)
    }
  }

  //Delete Chat Function
  const deleteChatHandler = () => {
    if (deleteChat === false) {
      setDeleteChat(true)
    } else {
      setDeleteChat(false)
    }
  }

  //Managing that state of chat head, if show or hide
  const activateChatFeatures = () => {
    if (chatFeatures === false) {
      setChatFeatures(true)
    } else {
      setChatFeatures(false)
    }
  }

  // for save chat
  const modalHandlerSave = async (e) => {
    setSave(true)
    setPrint(false)
    setEmail(false)
    setDeleteMessage(false)
    setMessageInfo(false)
    setShowGroupInfo(false)
  }

  // for print chat
  const modalHandlerPrint = async (e) => {
    setSave(false)
    setPrint(true)
    setEmail(false)
    setDeleteMessage(false)
    setMessageInfo(false)
    setShowGroupInfo(false)
  }

  // for email chat
  const modalHandlerEmail = async (e) => {
    setSave(false)
    setPrint(false)
    setEmail(true)
    setDeleteMessage(false)
    setMessageInfo(false)
    setShowGroupInfo(false)
  }

  // on change checkbox today
  function onChangeToday(e) {
    setTodayCheckState(e.target.checked)
    setAllCheckState(false)
    setCustomCheckState(false)
  }

  // on change checkbox All
  function onChangeAll(e) {
    setAllCheckState(e.target.checked)
    setTodayCheckState(false)
    setCustomCheckState(false)
  }

  // on change checkbox Custom
  function onChangeCustom(e) {
    setCustomCheckState(e.target.checked)
    setTodayCheckState(false)
    setAllCheckState(false)
  }

  // Cancel Modal
  const handleCancel = () => {
    setSave(false)
    setPrint(false)
    setEmail(false)
    setDeleteMessage(false)
    setMessageInfo(false)
    setShowGroupInfo(false)
    setTodayCheckState(false)
    setAllCheckState(false)
    setCustomCheckState(false)
    setChatDateState({
      ...chatDateState,
      StartDate: '',
      EndDate: '',
    })
    setEndDatedisable(true)
    setDeleteChat(false)
    setShowGroupEdit(false)
    setShowEditGroupField(false)
    setEmojiActive(false)
    setAddNewChat(false)
    setActiveCreateGroup(false)
    setGlobalSearchFilter(false)
    setChatMenuActive(false)
    setChatHeadMenuActive(false)
    setChatFeatures(false)
    setNoParticipant(false)
    setDeleteMessage(false)
    setMessageInfo(false)
    setShowGroupInfo(false)
    setShowGroupEdit(false)
    setTodayCheckState(false)
    setAllCheckState(false)
    setCustomCheckState(false)
    setSenderCheckbox(false)
    setShowCheckboxes(false)
    setEndDatedisable(false)
    setDeleteChat(false)
    setUploadOptions(false)
    setChatFeatureActive(false)
    setReplyFeature(false)
    setShowChatSearch(false)
    setForwardUsersChecked([])
    setMessagesChecked([])
    setGroupNameValue('')
    setSearchGroupUserValue('')
    setGroupUsersChecked([])
  }

  const cancelForwardSection = () => {
    setForwardMessageUsersSection(false)
    setShowCheckboxes(false)
    setForwardUsersChecked([])
    setGroupUsersChecked([])
    setMessagesChecked([])
  }

  //Edit Group Title Activator
  const editGroupTitle = () => {
    setShowEditGroupField(true)
  }

  //On Change Dates
  const onChangeDate = (e) => {
    let value = e.target.value
    let name = e.target.name
    if (name === 'StartDate' && value != '') {
      setChatDateState({
        ...chatDateState,
        [name]: DateSendingFormat(value),
      })
      setEndDatedisable(false)
    }
    if (name === 'EndDate' && value != '') {
      setChatDateState({
        ...chatDateState,
        [name]: DateSendingFormat(value),
      })
    }
    // if (chatDateState.StartDate !== "") {
    //   setEndDatedisable(false);
    // } else {
    //   setEndDatedisable(true);
    // }
  }

  //Show upload options or Hide
  const showUploadOptions = () => {
    if (uploadOptions === false && chatClickData.isBlock === 0) {
      setUploadOptions(true)
    } else {
      setUploadOptions(false)
    }
  }

  //Chat Message json set
  const chatMessageHandler = (e) => {
    setMessageSendData({
      ...messageSendData,
      Body: e.target.value,
    })
  }

  //Response return on click of emoji
  const selectedEmoji = (e) => {
    let sym = e.unified.split('-')
    let codesArray = []
    sym.forEach((el) => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)
    if (chatClickData.isBlock === 0) {
      setMessageSendData({
        ...messageSendData,
        Body: messageSendData.Body + emoji,
      })
    }
    setEmojiActive(false)
  }

  //Selected Option of the chat
  const chatFeatureSelected = (record, id) => {
    dispatch(activeMessageID(record))
    if (chatFeatureActive === false) {
      setChatFeatureActive(id)
    } else {
      setChatFeatureActive(false)
    }
  }

  //Onclick Of Reply Feature
  const replyFeatureHandler = (record) => {
    chatMessages.current?.scrollIntoView({ behavior: 'auto' })
    let senderNameReply
    if (record.senderName === currentUserName) {
      senderNameReply = 'You'
    } else {
      senderNameReply = record.senderName
    }
    if (replyFeature === false) {
      setReplyFeature(true)
      setReplyData({
        ...replyData,
        messageID: record.messageID,
        senderName: record.senderName,
        messageBody: record.messageBody,
      })
      setMessageSendData({
        ...messageSendData,
        MessageActivity:
          record.messageID +
          '|' +
          '' +
          '|' +
          chatClickData.messageType +
          '|' +
          senderNameReply +
          '|' +
          record.fileName +
          '|' +
          record.attachmentLocation +
          '|' +
          'Reply Message',
      })
    } else {
      setReplyFeature(false)
      setReplyData({
        ...replyData,
        messageID: 0,
        senderName: '',
        messageBody: '',
      })
      setMessageSendData({
        ...messageSendData,
        MessageActivity: 'Direct Message',
      })
    }
  }

  const [deleteMessageData, setDeleteMessageData] = useState([])

  //On Click of Delete Feature
  const deleteFeatureHandler = (record) => {
    if (deleteMessage === false) {
      setDeleteMessage(true)
      setDeleteMessageData(record)
    } else {
      setDeleteMessage(false)
    }
  }

  //On Click of Forward Feature
  const forwardFeatureHandler = () => {
    if (showCheckboxes === false) {
      setShowCheckboxes(true)
    } else {
      setShowCheckboxes(false)
    }
  }

  //On Click of Forward Feature
  const messageInfoHandler = (record) => {
    if (messageInfo === false) {
      setMessageInfoData({
        ...messageInfoData,
        sentDate: record.sentDate,
        receivedDate: record.receivedDate,
        seenDate: record.seenDate,
      })
      setMessageInfo(true)
    } else {
      setMessageInfo(false)
      setMessageInfoData({
        ...messageInfoData,
        sentDate: '',
        receivedDate: '',
        seenDate: '',
      })
    }
  }

  //mark starred message handler
  const markUnmarkStarMessageHandler = (record) => {
    setMessageClickData(record)
    let Data = {
      UserID: parseInt(currentUserId),
      MessageID: record.messageID,
      MessageType: chatClickData.messageType,
      IsFlag: record.isFlag === 0 ? true : false,
    }
    dispatch(MarkStarredUnstarredMessage(Data, t))
  }

  // on change checkbox sender
  function onChangeSender(e) {
    setSenderCheckbox(e.target.checked)
  }

  // on change checkbox receiver
  const messagesCheckedHandler = (data, id, index) => {
    if (messagesChecked.includes(data)) {
      let messageIndex = messagesChecked.findIndex(
        (data2, index) => data === data2,
      )
      if (messageIndex !== -1) {
        messagesChecked.splice(messageIndex, 1)
        setMessagesChecked([...messagesChecked])
      }
    } else {
      messagesChecked.push(data)
      setMessagesChecked([...messagesChecked])
    }
  }

  //on change groups users
  const groupUsersCheckedHandler = (data, id, index) => {
    if (groupUsersChecked.includes(id)) {
      let groupUserIndex = groupUsersChecked.findIndex(
        (data2, index) => data2 === id,
      )
      if (groupUserIndex !== -1) {
        groupUsersChecked.splice(groupUserIndex, 1)
        setGroupUsersChecked([...groupUsersChecked])
      }
    } else {
      groupUsersChecked.push(id)
      setGroupUsersChecked([...groupUsersChecked])
    }
  }

  // on change forward users list
  const forwardUsersCheckedHandler = (data, id, index) => {
    if (forwardUsersChecked.includes(data)) {
      let forwardUserIndex = forwardUsersChecked.findIndex(
        (data2, index) => data === data2,
      )
      if (forwardUserIndex !== -1) {
        forwardUsersChecked.splice(forwardUserIndex, 1)
        setForwardUsersChecked([...forwardUsersChecked])
      }
    } else {
      forwardUsersChecked.push(data)
      setForwardUsersChecked([...forwardUsersChecked])
    }
  }

  //on change groups users
  const editGroupUsersCheckedHandler = (data, id, index) => {
    if (editGroupUsersChecked.includes(id)) {
      let editGroupUserIndex = editGroupUsersChecked.findIndex(
        (data2) => data2 === id,
      )
      if (editGroupUserIndex !== -1) {
        editGroupUsersChecked.splice(editGroupUserIndex, 1)
        setEditGroupUsersChecked([...editGroupUsersChecked])
      }
    } else {
      editGroupUsersChecked.push(id)
      setEditGroupUsersChecked([...editGroupUsersChecked])
    }
  }

  const blockContactHandler = (record) => {
    let Data = {
      senderID: currentUserId,
      channelID: currentOrganizationId,
      opponentUserId: record.id,
    }
    dispatch(BlockUnblockUser(Data, t))
    setChatHeadMenuActive(false)
  }

  const unblockblockContactHandler = (record) => {
    let Data = {
      senderID: currentUserId,
      channelID: currentOrganizationId,
      opponentUserId: record.id,
    }
    setUnblockUserId(record.id)
    dispatch(BlockUnblockUser(Data, t))
  }

  const deleteSingleMessage = (record) => {
    let Data = {
      UserID: parseInt(currentUserId),
      MessageType: chatClickData.messageType,
      MessageIds: record.messageID,
    }
    dispatch(DeleteSingleMessage(Data, t))
    setDeleteMessage(false)
  }

  const prepareMessageBody = (channelId, senderId, receiverId, messageBody) => {
    return {
      TalkRequest: {
        ChannelID: channelId,
        Message: {
          SenderID: String(senderId),
          ReceiverID: String(receiverId),
          Body: messageBody,
          MessageActivity: 'Direct Message',
          FileName: '',
          FileGeneratedName: '',
          Extension: '',
          AttachmentLocation: '',
        },
      },
    }
  }

  const submitForwardMessages = () => {
    setForwardMessageUsersSection(false)
    setShowCheckboxes(false)
    forwardUsersChecked?.map((user) => {
      let { id, type } = user
      if (type == 'U') {
        messagesChecked?.map((message) =>
          dispatch(
            InsertOTOMessages(
              prepareMessageBody(
                parseInt(currentOrganizationId),
                parseInt(currentUserId),
                id,
                message.messageBody,
              ),
              tasksAttachments.TasksAttachments,
              t,
            ),
          ),
        )
      } else if (type == 'B') {
        messagesChecked?.map((message) =>
          dispatch(
            InsertBroadcastMessages(
              prepareMessageBody(
                parseInt(currentOrganizationId),
                parseInt(currentUserId),
                id,
                message.messageBody,
              ),
              t,
            ),
          ),
        )
      } else if (type == 'G') {
        messagesChecked?.map((message) =>
          dispatch(
            InsertPrivateGroupMessages(
              prepareMessageBody(
                parseInt(currentOrganizationId),
                parseInt(currentUserId),
                id,
                message.messageBody,
              ),
              t,
            ),
          ),
        )
      }
    })
    setForwardUsersChecked([])
  }

  const createPrivateGroup = () => {
    if (groupUsersChecked.length === 0) {
      setNoParticipant(true)
    } else {
      setNoParticipant(false)
      let Data = {
        TalkRequest: {
          UserID: parseInt(currentUserId),
          ChannelID: parseInt(currentOrganizationId),
          Group: {
            GroupName: groupNameValue,
            Users: groupUsersChecked.toString(),
            IsPublic: false,
          },
        },
      }
      dispatch(CreatePrivateGroup(Data, t))
      setChatFilter({
        ...chatFilter,
        value: chatFilterOptions[0].value,
        label: chatFilterOptions[0].label,
      })
      setChatFilterName(chatFilterOptions[0])
      setActiveCreateGroup(false)
      setBlockedUsersData([])
      setShoutAllData([])
      setPrivateMessageData([])
      setPrivateGroupsData([])
      setStarredMessagesData([])
      setAllChatData(talkStateData.AllUserChats.AllUserChatsData.allMessages)
      setGroupUsersChecked([])
    }
  }

  const modalHandlerGroupInfo = () => {
    let Data = {
      GroupID: activeChat.id,
      ChannelID: currentOrganizationId,
    }
    dispatch(GetAllPrivateGroupMembers(Data, t))
    setShowGroupInfo(true)
    setMessageInfo(false)
    setShowGroupEdit(false)
  }

  const modalHandlerGroupEdit = () => {
    let Data = {
      GroupID: activeChat.id,
      ChannelID: currentOrganizationId,
    }
    dispatch(GetAllPrivateGroupMembers(Data, t))
    setShowGroupEdit(true)
    setShowGroupInfo(false)
    setMessageInfo(false)
  }

  //Search Group Chat
  const searchGroupInfoUser = (e) => {
    if (e !== '' && groupInfoData !== undefined && groupInfoData.length !== 0) {
      setSearchGroupUserInfoValue(e)
      let filteredData = talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse.groupUsers.filter(
        (value) => {
          return value.userName
            .toLowerCase()
            .includes(searchGroupUserInfoValue.toLowerCase())
        },
      )
      setGroupInfoData(filteredData)
    } else if (
      e === '' ||
      (e === null && groupInfoData !== undefined && groupInfoData.length !== 0)
    ) {
      let data =
        talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
          .groupUsers
      setSearchGroupUserInfoValue('')
      setGroupInfoData(data)
    } else {
      setGroupInfoData([])
    }
  }

  const showChatSearchHandler = () => {
    if (showChatSearch === true) {
      setShowChatSearch(false)
      setSearchChatWord('')
    } else {
      setShowChatSearch(true)
      setSearchChatWord('')
    }
  }

  const highlight = (txt) => (
    <span style={{ background: 'red', color: '#fff' }}>{txt}</span>
  )

  // Saving All OTO Messages in single state
  useEffect(() => {
    let allotomessages =
      talkStateData.UserOTOMessages.UserOTOMessagesData.oneToOneMessages
    if (allotomessages !== undefined) {
      oneToOneMessages(setAllOtoMessages, allotomessages)
    }
  }, [talkStateData.UserOTOMessages.UserOTOMessagesData])

  //chat messages
  useEffect(() => {
    chatMessages.current?.scrollIntoView({ behavior: 'auto' })
  }, [allOtoMessages, allGroupMessages, allBroadcastMessages])

  // Saving All Group Messages in single state
  useEffect(() => {
    let allGroupMessagesReducer =
      talkStateData.GroupMessages.GroupMessagesData.groupMessages
    if (allGroupMessagesReducer !== undefined) {
      groupMessages(allGroupMessagesReducer, setAllGroupMessages)
    }
  }, [talkStateData.GroupMessages.GroupMessagesData])

  // Saving All Broadcast Messages in single state
  useEffect(() => {
    let allMessagesBroadcast =
      talkStateData.BroadcastMessages.BroadcastMessagesData.broadcastMessages
    if (allMessagesBroadcast != undefined) {
      let allBroadcastMessagesArr = []
      allMessagesBroadcast.map((messagesData) => {
        if (messagesData.frMessages !== 'Direct Message') {
          messagesData.frMessages = messagesData.frMessages.split('|')
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
        })
      })
      setAllBroadcastMessages([...allBroadcastMessagesArr])
    }
  }, [talkStateData.BroadcastMessages.BroadcastMessagesData])

  //Making Data from MQTT Response
  useEffect(() => {
    if (
      talkStateData.talkSocketData.socketInsertOTOMessageData !== null &&
      talkStateData.talkSocketData.socketInsertOTOMessageData !== undefined &&
      talkStateData.talkSocketData.socketInsertOTOMessageData.length !== 0
    ) {
      console.log('talkStateData.talkSocketData.socketInsertOTOMessageData')
      try {
        if (talkStateData.activeChatIdData.messageType === 'O') {
          console.log(
            'talkStateData.talkSocketData.socketInsertOTOMessageData 1',
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID,
          )
          console.log(
            'talkStateData.talkSocketData.socketInsertOTOMessageData 2',
            talkStateData.activeChatIdData.id,
          )

          if (
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != undefined &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != null &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != 0 &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != '' &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != '0' &&
            talkStateData.activeChatIdData.id ===
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
                .receiverID
          ) {
            console.log('This is Senders end Check')
            let mqttInsertOtoMessageData =
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
            let insertMqttOtoMessageData = {
              attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
              blockCount: 0,
              broadcastName: mqttInsertOtoMessageData.broadcastName,
              currDate: mqttInsertOtoMessageData.currDate,
              fileGeneratedName: mqttInsertOtoMessageData.fileGeneratedName,
              fileName: mqttInsertOtoMessageData.fileName,
              frMessages: mqttInsertOtoMessageData.frMessages,
              isFlag: 0,
              messageBody: mqttInsertOtoMessageData.messageBody,
              messageCount: 0,
              messageID: mqttInsertOtoMessageData.messageID,
              messageStatus: mqttInsertOtoMessageData.messageStatus,
              receivedDate: mqttInsertOtoMessageData.receivedDate,
              receiverID: mqttInsertOtoMessageData.receiverID,
              receiverName: mqttInsertOtoMessageData.receiverName,
              seenDate: mqttInsertOtoMessageData.seenDate,
              senderID: mqttInsertOtoMessageData.senderID,
              senderName: mqttInsertOtoMessageData.senderName,
              sentDate: mqttInsertOtoMessageData.sentDate,
              shoutAll: mqttInsertOtoMessageData.shoutAll,
              uid: '',
            }
            let allChatNewMessageOtoData = {
              id:
                parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                  ? mqttInsertOtoMessageData.receiverID
                  : parseInt(currentUserId) ===
                    mqttInsertOtoMessageData.receiverID
                  ? mqttInsertOtoMessageData.senderID
                  : null,
              fullName:
                parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                  ? mqttInsertOtoMessageData.receiverName
                  : parseInt(currentUserId) ===
                    mqttInsertOtoMessageData.receiverID
                  ? mqttInsertOtoMessageData.senderName
                  : null,
              imgURL: 'O.jpg',
              messageBody: mqttInsertOtoMessageData.messageBody,
              messageDate: mqttInsertOtoMessageData.sentDate,
              notiCount: 0,
              messageType: 'O',
              isOnline: true,
              isBlock: 0,
              companyName: 'Tresmark',
              sentDate: mqttInsertOtoMessageData.sentDate,
              receivedDate: mqttInsertOtoMessageData.receivedDate,
              seenDate: mqttInsertOtoMessageData.seenDate,
              attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
              senderID: mqttInsertOtoMessageData.senderID,
              admin: 0,
            }
            if (Object.keys(insertMqttOtoMessageData) !== null) {
              if (
                insertMqttOtoMessageData !== undefined &&
                insertMqttOtoMessageData !== null &&
                insertMqttOtoMessageData.hasOwnProperty('messageBody') &&
                insertMqttOtoMessageData.messageBody !== undefined &&
                allOtoMessages.length > 0 &&
                allOtoMessages[allOtoMessages.length - 1] !== undefined &&
                allOtoMessages[allOtoMessages.length - 1] !== null &&
                allOtoMessages[allOtoMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                allOtoMessages[allOtoMessages.length - 1].messageBody !==
                  undefined &&
                insertMqttOtoMessageData.messageBody ===
                  allOtoMessages[allOtoMessages.length - 1].messageBody
              ) {
                setAllOtoMessages((prevState) => {
                  const updatedMessages = [...prevState]
                  updatedMessages[
                    updatedMessages.length - 1
                  ] = insertMqttOtoMessageData
                  return updatedMessages
                })
                let updatedArray = [...allChatData]
                if (
                  updatedArray.length > 0 &&
                  updatedArray[0].hasOwnProperty('messageBody')
                ) {
                  const index = updatedArray.findIndex(
                    (item) => item.id === allChatNewMessageOtoData.id,
                  )
                  if (index !== -1) {
                    updatedArray[index] = allChatNewMessageOtoData
                  } else {
                    updatedArray[0] = allChatNewMessageOtoData
                  }
                }
                setAllChatData(updatedArray)
              } else if (
                insertMqttOtoMessageData !== undefined &&
                insertMqttOtoMessageData !== null &&
                insertMqttOtoMessageData.hasOwnProperty('messageBody') &&
                insertMqttOtoMessageData.messageBody !== undefined &&
                allOtoMessages.length > 0 &&
                allOtoMessages[allOtoMessages.length - 1] !== undefined &&
                allOtoMessages[allOtoMessages.length - 1] !== null &&
                allOtoMessages[allOtoMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                insertMqttOtoMessageData.messageBody !==
                  allOtoMessages[allOtoMessages.length - 1].messageBody
              ) {
                setAllOtoMessages((prevState) => {
                  const updatedMessages = [...prevState]
                  updatedMessages[
                    updatedMessages.length - 1
                  ] = insertMqttOtoMessageData
                  return updatedMessages
                })
                let updatedArray = [...allChatData]
                if (
                  updatedArray.length > 0 &&
                  updatedArray[0].hasOwnProperty('messageBody')
                ) {
                  updatedArray[0] = allChatNewMessageOtoData
                }
                setAllChatData(updatedArray)
              }
            } else {
              let allotomessages =
                talkStateData.UserOTOMessages.UserOTOMessagesData
                  .oneToOneMessages
              if (allotomessages != undefined) {
                let allMessagesArr = []
                allotomessages.map((messagesData) => {
                  allMessagesArr.push({
                    attachmentLocation: messagesData.attachmentLocation,
                    blockCount: messagesData.blockCount,
                    broadcastName: messagesData.broadcastName,
                    currDate: messagesData.currDate,
                    fileGeneratedName: messagesData.fileGeneratedName,
                    fileName: messagesData.fileName,
                    frMessages: messagesData.frMessages,
                    isFlag: messagesData.isFlag,
                    messageBody: messagesData.messageBody,
                    messageCount: messagesData.messageCount,
                    messageID: messagesData.messageID,
                    messageStatus: messagesData.messageStatus,
                    receivedDate: messagesData.receivedDate,
                    receiverID: messagesData.receiverID,
                    receiverName: messagesData.receiverName,
                    seenDate: messagesData.seenDate,
                    senderID: messagesData.senderID,
                    senderName: messagesData.senderName,
                    sentDate: messagesData.sentDate,
                    shoutAll: messagesData.shoutAll,
                    uid: messagesData.uid,
                  })
                })
                setAllOtoMessages([...allMessagesArr])
              }
            }
            // } else {
            //   console.log('reciver id not found')
            // }
          } else if (
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != undefined &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != null &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != 0 &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != '' &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != '0' &&
            parseInt(currentUserId) !==
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
                .senderID
          ) {
            console.log('This is Receivers end Check')

            let mqttInsertOtoMessageData =
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
            let insertMqttOtoMessageData = {
              attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
              blockCount: 0,
              broadcastName: mqttInsertOtoMessageData.broadcastName,
              currDate: mqttInsertOtoMessageData.currDate,
              fileGeneratedName: mqttInsertOtoMessageData.fileGeneratedName,
              fileName: mqttInsertOtoMessageData.fileName,
              frMessages: mqttInsertOtoMessageData.frMessages,
              isFlag: 0,
              messageBody: mqttInsertOtoMessageData.messageBody,
              messageCount: 0,
              messageID: mqttInsertOtoMessageData.messageID,
              messageStatus: mqttInsertOtoMessageData.messageStatus,
              receivedDate: mqttInsertOtoMessageData.receivedDate,
              receiverID: mqttInsertOtoMessageData.receiverID,
              receiverName: mqttInsertOtoMessageData.receiverName,
              seenDate: mqttInsertOtoMessageData.seenDate,
              senderID: mqttInsertOtoMessageData.senderID,
              senderName: mqttInsertOtoMessageData.senderName,
              sentDate: mqttInsertOtoMessageData.sentDate,
              shoutAll: mqttInsertOtoMessageData.shoutAll,
              uid: '',
            }
            let allChatNewMessageOtoData = {
              id:
                parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                  ? mqttInsertOtoMessageData.receiverID
                  : parseInt(currentUserId) ===
                    mqttInsertOtoMessageData.receiverID
                  ? mqttInsertOtoMessageData.senderID
                  : null,
              fullName:
                parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                  ? mqttInsertOtoMessageData.receiverName
                  : parseInt(currentUserId) ===
                    mqttInsertOtoMessageData.receiverID
                  ? mqttInsertOtoMessageData.senderName
                  : null,
              imgURL: 'O.jpg',
              messageBody: mqttInsertOtoMessageData.messageBody,
              messageDate: mqttInsertOtoMessageData.sentDate,
              notiCount: 0,
              messageType: 'O',
              isOnline: true,
              isBlock: 0,
              companyName: 'Tresmark',
              sentDate: mqttInsertOtoMessageData.sentDate,
              receivedDate: mqttInsertOtoMessageData.receivedDate,
              seenDate: mqttInsertOtoMessageData.seenDate,
              attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
              senderID: mqttInsertOtoMessageData.senderID,
              admin: 0,
            }
            if (Object.keys(insertMqttOtoMessageData) !== null) {
              if (
                insertMqttOtoMessageData !== undefined &&
                insertMqttOtoMessageData !== null &&
                insertMqttOtoMessageData.hasOwnProperty('messageBody') &&
                insertMqttOtoMessageData.messageBody !== undefined &&
                allOtoMessages.length > 0 &&
                allOtoMessages[allOtoMessages.length - 1] !== undefined &&
                allOtoMessages[allOtoMessages.length - 1] !== null &&
                allOtoMessages[allOtoMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                allOtoMessages[allOtoMessages.length - 1].messageBody !==
                  undefined &&
                insertMqttOtoMessageData.messageBody ===
                  allOtoMessages[allOtoMessages.length - 1].messageBody
              ) {
                setAllOtoMessages((prevState) => {
                  const updatedMessages = [...prevState]
                  updatedMessages[
                    updatedMessages.length - 1
                  ] = insertMqttOtoMessageData
                  return updatedMessages
                })
                let updatedArray = [...allChatData]
                if (
                  updatedArray.length > 0 &&
                  updatedArray[0].hasOwnProperty('messageBody')
                ) {
                  const index = updatedArray.findIndex(
                    (item) => item.id === allChatNewMessageOtoData.id,
                  )
                  if (index !== -1) {
                    updatedArray[index] = allChatNewMessageOtoData
                  } else {
                    updatedArray[0] = allChatNewMessageOtoData
                  }
                }
                setAllChatData(updatedArray)
              } else if (
                insertMqttOtoMessageData !== undefined &&
                insertMqttOtoMessageData !== null &&
                insertMqttOtoMessageData.hasOwnProperty('messageBody') &&
                insertMqttOtoMessageData.messageBody !== undefined &&
                allOtoMessages.length > 0 &&
                allOtoMessages[allOtoMessages.length - 1] !== undefined &&
                allOtoMessages[allOtoMessages.length - 1] !== null &&
                allOtoMessages[allOtoMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                insertMqttOtoMessageData.messageBody !==
                  allOtoMessages[allOtoMessages.length - 1].messageBody
              ) {
                setAllOtoMessages((prevState) => {
                  const updatedMessages = [...prevState]
                  updatedMessages[
                    updatedMessages.length - 1
                  ] = insertMqttOtoMessageData
                  return updatedMessages
                })
                let updatedArray = [...allChatData]
                if (
                  updatedArray.length > 0 &&
                  updatedArray[0].hasOwnProperty('messageBody')
                ) {
                  updatedArray[0] = allChatNewMessageOtoData
                }
                setAllChatData(updatedArray)
              }
            } else {
              let allotomessages =
                talkStateData.UserOTOMessages.UserOTOMessagesData
                  .oneToOneMessages
              if (allotomessages != undefined) {
                let allMessagesArr = []
                allotomessages.map((messagesData) => {
                  allMessagesArr.push({
                    attachmentLocation: messagesData.attachmentLocation,
                    blockCount: messagesData.blockCount,
                    broadcastName: messagesData.broadcastName,
                    currDate: messagesData.currDate,
                    fileGeneratedName: messagesData.fileGeneratedName,
                    fileName: messagesData.fileName,
                    frMessages: messagesData.frMessages,
                    isFlag: messagesData.isFlag,
                    messageBody: messagesData.messageBody,
                    messageCount: messagesData.messageCount,
                    messageID: messagesData.messageID,
                    messageStatus: messagesData.messageStatus,
                    receivedDate: messagesData.receivedDate,
                    receiverID: messagesData.receiverID,
                    receiverName: messagesData.receiverName,
                    seenDate: messagesData.seenDate,
                    senderID: messagesData.senderID,
                    senderName: messagesData.senderName,
                    sentDate: messagesData.sentDate,
                    shoutAll: messagesData.shoutAll,
                    uid: messagesData.uid,
                  })
                })
                setAllOtoMessages([...allMessagesArr])
              }
            }
          }
        } else if (
          talkStateData.activeChatIdData.messageType === '' &&
          talkStateData.activeChatIdData.id === 0
        ) {
          if (
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != undefined &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != null &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != 0 &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != '' &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != '0' &&
            talkStateData.activeChatIdData.id === 0 &&
            talkStateData.activeChatIdData.messageType === ''
          ) {
            console.log('This is Receivers end Check when chat not open')

            let mqttInsertOtoMessageData =
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
            let allChatNewMessageOtoData = {
              id:
                parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                  ? mqttInsertOtoMessageData.receiverID
                  : parseInt(currentUserId) ===
                    mqttInsertOtoMessageData.receiverID
                  ? mqttInsertOtoMessageData.senderID
                  : null,
              fullName:
                parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                  ? mqttInsertOtoMessageData.receiverName
                  : parseInt(currentUserId) ===
                    mqttInsertOtoMessageData.receiverID
                  ? mqttInsertOtoMessageData.senderName
                  : null,
              imgURL: 'O.jpg',
              messageBody: mqttInsertOtoMessageData.messageBody,
              messageDate: mqttInsertOtoMessageData.sentDate,
              notiCount: 0,
              messageType: 'O',
              isOnline: true,
              isBlock: 0,
              companyName: 'Tresmark',
              sentDate: mqttInsertOtoMessageData.sentDate,
              receivedDate: mqttInsertOtoMessageData.receivedDate,
              seenDate: mqttInsertOtoMessageData.seenDate,
              attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
              senderID: mqttInsertOtoMessageData.senderID,
              admin: 0,
            }
            if (Object.keys(mqttInsertOtoMessageData) !== null) {
              let updatedArray = [...allChatData]
              if (
                updatedArray.length > 0 &&
                updatedArray[0].hasOwnProperty('messageBody')
              ) {
                const index = updatedArray.findIndex(
                  (item) => item.id === allChatNewMessageOtoData.id,
                )
                if (index !== -1) {
                  updatedArray[index] = allChatNewMessageOtoData
                } else {
                  updatedArray[0] = allChatNewMessageOtoData
                }
              }
              setAllChatData(updatedArray)
            } else {
              let allotomessages =
                talkStateData.UserOTOMessages.UserOTOMessagesData
                  .oneToOneMessages
              if (allotomessages != undefined) {
                let allMessagesArr = []
                allotomessages.map((messagesData) => {
                  allMessagesArr.push({
                    attachmentLocation: messagesData.attachmentLocation,
                    blockCount: messagesData.blockCount,
                    broadcastName: messagesData.broadcastName,
                    currDate: messagesData.currDate,
                    fileGeneratedName: messagesData.fileGeneratedName,
                    fileName: messagesData.fileName,
                    frMessages: messagesData.frMessages,
                    isFlag: messagesData.isFlag,
                    messageBody: messagesData.messageBody,
                    messageCount: messagesData.messageCount,
                    messageID: messagesData.messageID,
                    messageStatus: messagesData.messageStatus,
                    receivedDate: messagesData.receivedDate,
                    receiverID: messagesData.receiverID,
                    receiverName: messagesData.receiverName,
                    seenDate: messagesData.seenDate,
                    senderID: messagesData.senderID,
                    senderName: messagesData.senderName,
                    sentDate: messagesData.sentDate,
                    shoutAll: messagesData.shoutAll,
                    uid: messagesData.uid,
                  })
                })
                setAllOtoMessages([...allMessagesArr])
              }
            }
          }
        }
      } catch {
        console.log(
          'ERROR talkStateData.talkSocketData.socketInsertOTOMessageData',
        )
      }
    }
    //
  }, [talkStateData.talkSocketData.socketInsertOTOMessageData])

  console.log('This is All Chat Data', allChatData)

  useEffect(() => {
    if (
      talkStateData.talkSocketData.socketInsertGroupMessageData !== null &&
      talkStateData.talkSocketData.socketInsertGroupMessageData !== undefined &&
      talkStateData.talkSocketData.socketInsertGroupMessageData.length !== 0
    ) {
      try {
        if (talkStateData.activeChatIdData.messageType === 'G') {
          if (
            talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
              .senderID != undefined &&
            talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
              .senderID != null &&
            talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
              .senderID != 0 &&
            talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
              .senderID != '' &&
            talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
              .senderID != '0' &&
            talkStateData.activeChatIdData.id ===
              talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
                .receiverID
          ) {
            let mqttInsertGroupMessageData =
              talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
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
              frMessages: mqttInsertGroupMessageData.frMessages,
              messageCount: 0,
              attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
            }

            let newGroupMessageChat = {
              id: mqttInsertGroupMessageData.receiverID,
              fullName: mqttInsertGroupMessageData.groupName,
              imgURL: 'O.jpg',
              messageBody: mqttInsertGroupMessageData.messageBody,
              messageDate: mqttInsertGroupMessageData.sentDate,
              notiCount: 0,
              messageType: 'G',
              isOnline: true,
              companyName: 'Tresmark',
              sentDate: mqttInsertGroupMessageData.sentDate,
              receivedDate: '',
              seenDate: '',
              attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
              senderID: parseInt(messageSendData.SenderID),
              admin: mqttInsertGroupMessageData.admin,
            }

            if (Object.keys(insertMqttGroupMessageData) !== null) {
              if (
                insertMqttGroupMessageData !== undefined &&
                insertMqttGroupMessageData !== null &&
                insertMqttGroupMessageData.hasOwnProperty('messageBody') &&
                insertMqttGroupMessageData.messageBody !== undefined &&
                allGroupMessages.length > 0 &&
                allGroupMessages[allGroupMessages.length - 1] !== undefined &&
                allGroupMessages[allGroupMessages.length - 1] !== null &&
                allGroupMessages[allGroupMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                allGroupMessages[allGroupMessages.length - 1].messageBody !==
                  undefined &&
                insertMqttGroupMessageData.messageBody ===
                  allGroupMessages[allGroupMessages.length - 1].messageBody
              ) {
                if (
                  activeChat.id === insertMqttGroupMessageData.receiverID ||
                  activeChat.id === insertMqttGroupMessageData.senderID
                ) {
                  setAllGroupMessages((prevState) => {
                    const updatedMessages = [...prevState]
                    updatedMessages[
                      updatedMessages.length - 1
                    ] = insertMqttGroupMessageData
                    return updatedMessages
                  })
                  let updatedArray = [...allChatData]
                  if (
                    updatedArray.length > 0 &&
                    updatedArray[0].hasOwnProperty('messageBody')
                  ) {
                    updatedArray[0] = newGroupMessageChat
                  }
                  setAllChatData(updatedArray)

                  // allGroupMessages.push(insertMqttGroupMessageData)
                  // setAllGroupMessages([...allGroupMessages])
                }
              } else if (
                insertMqttGroupMessageData !== undefined &&
                insertMqttGroupMessageData !== null &&
                insertMqttGroupMessageData.hasOwnProperty('messageBody') &&
                insertMqttGroupMessageData.messageBody !== undefined &&
                allGroupMessages.length > 0 &&
                allGroupMessages[allGroupMessages.length - 1] !== undefined &&
                allGroupMessages[allGroupMessages.length - 1] !== null &&
                allGroupMessages[allGroupMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                insertMqttGroupMessageData.messageBody !==
                  allGroupMessages[allGroupMessages.length - 1].messageBody
              ) {
                setAllGroupMessages([
                  ...allGroupMessages,
                  insertMqttGroupMessageData,
                ])
                let updatedArray = [...allChatData]
                if (
                  updatedArray.length > 0 &&
                  updatedArray[0].hasOwnProperty('messageBody') &&
                  updatedArray[0].messageBody === allChatData[0].messageBody
                ) {
                  updatedArray[0] = newGroupMessageChat
                }
                setAllChatData(updatedArray)
              }
            } else {
              let allGroupMessages =
                talkStateData.GroupMessages.GroupMessagesData.groupMessages
              if (allGroupMessages != undefined) {
                let allGroupMessagesArr = []
                allGroupMessages.map((messagesData) => {
                  allGroupMessagesArr.push({
                    attachmentLocation: messagesData.attachmentLocation,
                    currDate: messagesData.currDate,
                    fileGeneratedName: messagesData.fileGeneratedName,
                    fileName: messagesData.fileName,
                    frMessages: messagesData.frMessages,
                    isFlag: messagesData.isFlag,
                    messageBody: messagesData.messageBody,
                    messageCount: messagesData.messageCount,
                    messageID: messagesData.messageID,
                    receiverID: messagesData.receiverID,
                    senderID: messagesData.senderID,
                    senderName: messagesData.senderName,
                    sentDate: messagesData.sentDate,
                    shoutAll: messagesData.shoutAll,
                  })
                })
                setAllGroupMessages([...allGroupMessagesArr])
              }
              // }
            }
          } else if (
            talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
              .senderID != undefined &&
            talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
              .senderID != null &&
            talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
              .senderID != 0 &&
            talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
              .senderID != '' &&
            talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
              .senderID != '0' &&
            parseInt(currentUserId) !==
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
                .senderID
          ) {
            let mqttInsertGroupMessageData =
              talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]
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
              frMessages: mqttInsertGroupMessageData.frMessages,
              messageCount: 0,
              attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
            }

            let newGroupMessageChat = {
              id: mqttInsertGroupMessageData.receiverID,
              fullName: mqttInsertGroupMessageData.groupName,
              imgURL: 'O.jpg',
              messageBody: mqttInsertGroupMessageData.messageBody,
              messageDate: mqttInsertGroupMessageData.sentDate,
              notiCount: 0,
              messageType: 'G',
              isOnline: true,
              companyName: 'Tresmark',
              sentDate: mqttInsertGroupMessageData.sentDate,
              receivedDate: '',
              seenDate: '',
              attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
              senderID: parseInt(messageSendData.SenderID),
              admin: mqttInsertGroupMessageData.admin,
            }

            if (Object.keys(insertMqttGroupMessageData) !== null) {
              if (
                insertMqttGroupMessageData !== undefined &&
                insertMqttGroupMessageData !== null &&
                insertMqttGroupMessageData.hasOwnProperty('messageBody') &&
                insertMqttGroupMessageData.messageBody !== undefined &&
                allGroupMessages.length > 0 &&
                allGroupMessages[allGroupMessages.length - 1] !== undefined &&
                allGroupMessages[allGroupMessages.length - 1] !== null &&
                allGroupMessages[allGroupMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                allGroupMessages[allGroupMessages.length - 1].messageBody !==
                  undefined &&
                insertMqttGroupMessageData.messageBody ===
                  allGroupMessages[allGroupMessages.length - 1].messageBody
              ) {
                if (
                  activeChat.id === insertMqttGroupMessageData.receiverID ||
                  activeChat.id === insertMqttGroupMessageData.senderID
                ) {
                  setAllGroupMessages((prevState) => {
                    const updatedMessages = [...prevState]
                    updatedMessages[
                      updatedMessages.length - 1
                    ] = insertMqttGroupMessageData
                    return updatedMessages
                  })
                  let updatedArray = [...allChatData]
                  if (
                    updatedArray.length > 0 &&
                    updatedArray[0].hasOwnProperty('messageBody')
                  ) {
                    updatedArray[0] = newGroupMessageChat
                  }
                  setAllChatData(updatedArray)

                  // allGroupMessages.push(insertMqttGroupMessageData)
                  // setAllGroupMessages([...allGroupMessages])
                }
              } else if (
                insertMqttGroupMessageData !== undefined &&
                insertMqttGroupMessageData !== null &&
                insertMqttGroupMessageData.hasOwnProperty('messageBody') &&
                insertMqttGroupMessageData.messageBody !== undefined &&
                allGroupMessages.length > 0 &&
                allGroupMessages[allGroupMessages.length - 1] !== undefined &&
                allGroupMessages[allGroupMessages.length - 1] !== null &&
                allGroupMessages[allGroupMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                insertMqttGroupMessageData.messageBody !==
                  allGroupMessages[allGroupMessages.length - 1].messageBody
              ) {
                setAllGroupMessages([
                  ...allGroupMessages,
                  insertMqttGroupMessageData,
                ])
                let updatedArray = [...allChatData]
                if (
                  updatedArray.length > 0 &&
                  updatedArray[0].hasOwnProperty('messageBody') &&
                  updatedArray[0].messageBody === allChatData[0].messageBody
                ) {
                  updatedArray[0] = newGroupMessageChat
                }
                setAllChatData(updatedArray)
              }
            } else {
              let allGroupMessages =
                talkStateData.GroupMessages.GroupMessagesData.groupMessages
              if (allGroupMessages != undefined) {
                let allGroupMessagesArr = []
                allGroupMessages.map((messagesData) => {
                  allGroupMessagesArr.push({
                    attachmentLocation: messagesData.attachmentLocation,
                    currDate: messagesData.currDate,
                    fileGeneratedName: messagesData.fileGeneratedName,
                    fileName: messagesData.fileName,
                    frMessages: messagesData.frMessages,
                    isFlag: messagesData.isFlag,
                    messageBody: messagesData.messageBody,
                    messageCount: messagesData.messageCount,
                    messageID: messagesData.messageID,
                    receiverID: messagesData.receiverID,
                    senderID: messagesData.senderID,
                    senderName: messagesData.senderName,
                    sentDate: messagesData.sentDate,
                    shoutAll: messagesData.shoutAll,
                  })
                })
                setAllGroupMessages([...allGroupMessagesArr])
              }
              // }
            }
          } else if (
            talkStateData.activeChatIdData.messageType === '' &&
            talkStateData.activeChatIdData.id === 0
          ) {
            let mqttInsertGroupMessageData =
              talkStateData.talkSocketData.socketInsertGroupMessageData.data[0]

            let newGroupMessageChat = {
              id: mqttInsertGroupMessageData.receiverID,
              fullName: mqttInsertGroupMessageData.groupName,
              imgURL: 'O.jpg',
              messageBody: mqttInsertGroupMessageData.messageBody,
              messageDate: mqttInsertGroupMessageData.sentDate,
              notiCount: 0,
              messageType: 'G',
              isOnline: true,
              companyName: 'Tresmark',
              sentDate: mqttInsertGroupMessageData.sentDate,
              receivedDate: '',
              seenDate: '',
              attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
              senderID: parseInt(messageSendData.SenderID),
              admin: mqttInsertGroupMessageData.admin,
            }

            if (Object.keys(mqttInsertGroupMessageData) !== null) {
              if (
                mqttInsertGroupMessageData !== undefined &&
                mqttInsertGroupMessageData !== null &&
                mqttInsertGroupMessageData.hasOwnProperty('messageBody') &&
                mqttInsertGroupMessageData.messageBody !== undefined &&
                allGroupMessages.length > 0 &&
                allGroupMessages[allGroupMessages.length - 1] !== undefined &&
                allGroupMessages[allGroupMessages.length - 1] !== null &&
                allGroupMessages[allGroupMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                allGroupMessages[allGroupMessages.length - 1].messageBody !==
                  undefined &&
                mqttInsertGroupMessageData.messageBody ===
                  allGroupMessages[allGroupMessages.length - 1].messageBody
              ) {
                let updatedArray = [...allChatData]
                if (
                  updatedArray.length > 0 &&
                  updatedArray[0].hasOwnProperty('messageBody')
                ) {
                  updatedArray[0] = newGroupMessageChat
                }
                setAllChatData(updatedArray)
              } else if (
                mqttInsertGroupMessageData !== undefined &&
                mqttInsertGroupMessageData !== null &&
                mqttInsertGroupMessageData.hasOwnProperty('messageBody') &&
                mqttInsertGroupMessageData.messageBody !== undefined &&
                allGroupMessages.length > 0 &&
                allGroupMessages[allGroupMessages.length - 1] !== undefined &&
                allGroupMessages[allGroupMessages.length - 1] !== null &&
                allGroupMessages[allGroupMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                mqttInsertGroupMessageData.messageBody !==
                  allGroupMessages[allGroupMessages.length - 1].messageBody
              ) {
                let updatedArray = [...allChatData]
                if (
                  updatedArray.length > 0 &&
                  updatedArray[0].hasOwnProperty('messageBody') &&
                  updatedArray[0].messageBody === allChatData[0].messageBody
                ) {
                  updatedArray[0] = newGroupMessageChat
                }
                setAllChatData(updatedArray)
              }
            } else {
              let allGroupMessages =
                talkStateData.GroupMessages.GroupMessagesData.groupMessages
              if (allGroupMessages != undefined) {
                let allGroupMessagesArr = []
                allGroupMessages.map((messagesData) => {
                  allGroupMessagesArr.push({
                    attachmentLocation: messagesData.attachmentLocation,
                    currDate: messagesData.currDate,
                    fileGeneratedName: messagesData.fileGeneratedName,
                    fileName: messagesData.fileName,
                    frMessages: messagesData.frMessages,
                    isFlag: messagesData.isFlag,
                    messageBody: messagesData.messageBody,
                    messageCount: messagesData.messageCount,
                    messageID: messagesData.messageID,
                    receiverID: messagesData.receiverID,
                    senderID: messagesData.senderID,
                    senderName: messagesData.senderName,
                    sentDate: messagesData.sentDate,
                    shoutAll: messagesData.shoutAll,
                  })
                })
                setAllGroupMessages([...allGroupMessagesArr])
              }
              // }
            }
          }
        }
      } catch {
        console.log(
          'ERROR talkStateData.talkSocketData.socketInsertGroupMessageData',
        )
      }
    }
  }, [talkStateData.talkSocketData.socketInsertGroupMessageData])

  //Blocking a User MQTT
  useEffect(() => {
    if (
      talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser !== null &&
      talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser !==
        undefined &&
      talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser.length !== 0
    ) {
      let mqttBlockedUserData =
        talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser.data[0]
      let blockedUsersDataForMqtt = {
        fullName: '',
        id: mqttBlockedUserData.blockUserID,
        imgURL: 'null',
      }
      if (Object.keys(blockedUsersDataForMqtt) !== null) {
        setChatFilter({
          ...chatFilter,
          value: 8,
          label: 'Blocked User',
        })
        setChatFilterName('Blocked User')
        blockedUsersData.push(blockedUsersDataForMqtt)
        setBlockedUsersData([...blockedUsersData])
      } else {
        setBlockedUsersData(
          talkStateData?.BlockedUsers?.BlockedUsersData?.blockedUsers,
        )
      }
    }
  }, [
    talkStateData?.BlockedUsers?.BlockedUsersData?.blockedUsers,
    talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser,
  ])

  //Unblocking a User MQTT
  useEffect(() => {
    if (
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser !== null &&
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser !==
        undefined &&
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser.length !==
        0
    ) {
      let mqttBlockedUserData =
        talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser.data[0]
      let blockedUsersDataForMqtt = {
        fullName: '',
        id: mqttBlockedUserData.blockUserID,
        imgURL: 'null',
      }
      if (Object.keys(blockedUsersDataForMqtt) !== null) {
        setBlockedUsersData(
          blockedUsersData.filter(
            (item) => item.id !== blockedUsersDataForMqtt.id,
          ),
        )
        // blockedUsersData.push(blockedUsersDataForMqtt)
        // setBlockedUsersData([...blockedUsersData])
      } else {
        setBlockedUsersData(
          talkStateData?.BlockedUsers?.BlockedUsersData?.blockedUsers,
        )
      }
    }
  }, [
    talkStateData?.BlockedUsers?.BlockedUsersData?.blockedUsers,
    talkStateData?.talkSocketDataUserBlockUnblock?.socketUnblockUser,
  ])

  //Marking a message as Starred
  useEffect(() => {
    if (
      talkStateData.talkSocketDataStarUnstar.socketStarMessage !== null &&
      talkStateData.talkSocketDataStarUnstar.socketStarMessage !== undefined &&
      talkStateData.talkSocketDataStarUnstar.socketStarMessage.length !== 0
    ) {
      let mqttStarMessageData =
        talkStateData.talkSocketDataStarUnstar.socketStarMessage
      if (Object.keys(mqttStarMessageData) !== null) {
        if (mqttStarMessageData.messageType === 'O') {
          let messageOtoStarred = allOtoMessages.find(
            (item) => item.messageID === mqttStarMessageData.messageID,
          )
          if (messageOtoStarred !== undefined) {
            if (messageOtoStarred.isFlag === 1) {
              messageOtoStarred.isFlag = 0
            } else if (messageOtoStarred.isFlag === 0) {
              messageOtoStarred.isFlag = 1
            }
          }
          setAllOtoMessages(
            allOtoMessages.map((data) =>
              data.messageID === messageOtoStarred.messageID
                ? messageOtoStarred
                : data,
            ),
          )
        } else if (mqttStarMessageData.messageType === 'G') {
          let messageGroupStarred = allGroupMessages.find(
            (item) => item.messageID === mqttStarMessageData.messageID,
          )
          if (messageGroupStarred !== undefined) {
            if (messageGroupStarred.isFlag === 1) {
              messageGroupStarred.isFlag = 0
            } else if (messageGroupStarred.isFlag === 0) {
              messageGroupStarred.isFlag = 1
            }
          }
          setAllGroupMessages(
            allGroupMessages.map((data) =>
              data.messageID === messageGroupStarred.messageID
                ? messageGroupStarred
                : data,
            ),
          )
        }
      }
    }
  }, [talkStateData?.talkSocketDataStarUnstar?.socketStarMessage])

  //Marking a message as Unstarred
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
        setAllOtoMessages,
        allOtoMessages,
        allGroupMessages,
        setAllGroupMessages,
      )
    }
  }, [talkStateData?.talkSocketDataStarUnstar?.socketUnstarMessage])

  //Creating group and appending in real time
  //Marking a message as Unstarred
  useEffect(() => {
    if (
      talkStateData.talkSocketGroupCreation.groupCreatedData !== null &&
      talkStateData.talkSocketGroupCreation.groupCreatedData !== undefined &&
      talkStateData.talkSocketGroupCreation.groupCreatedData.length !== 0
    ) {
      groupCreationFunction(talkStateData, setAllChatData, allChatData)
    }
  }, [talkStateData?.talkSocketGroupCreation?.groupCreatedData])

  //MQTT Unread Message Count
  useEffect(() => {
    if (
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData !== null &&
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData !==
        undefined &&
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData.length !== 0
    ) {
      unreadMessageCountFunction(talkStateData, allChatData, setAllChatData)
    }
  }, [
    talkStateData?.talkSocketData?.socketInsertOTOMessageData,
    talkStateData?.talkSocketUnreadMessageCount?.unreadMessageData,
  ])

  localStorage.setItem('activeChatID', activeChat.id)
  // localStorage.setItem('activeChatMessageType', activeChat.messageType)

  const closeNotification = () => {
    setNotification({
      notificationShow: false,
      message: '',
    })
  }

  //Blocking user Notification
  useEffect(() => {
    if (talkStateData.MessageSendOTO.ResponseMessage === 'User-is-blocked') {
      setNotification({
        notificationShow: true,
        message: talkStateData.MessageSendOTO.ResponseMessage,
      })
      setNotificationID(id)
    }
  }, [talkStateData.MessageSendOTO])

  //Send Chat
  const sendChat = async (e) => {
    e.preventDefault()
    // sendChatFunction(
    //   t,
    //   setReplyFeature,
    //   setAllChatData,
    //   allChatData,
    //   messageSendData,
    //   setMessageSendData,
    //   allBroadcastMessages,
    //   setAllBroadcastMessages,
    //   chatClickData,
    //   allGroupMessages,
    //   setAllGroupMessages,
    //   allOtoMessages,
    //   setAllOtoMessages,
    //   uploadFileTalk,
    //   activeChat,
    // )

    dispatch(activeChatID(activeChat))
    if (messageSendData.Body !== '') {
      if (chatClickData.messageType === 'O') {
        let Data = {
          TalkRequest: {
            ChannelID: parseInt(currentOrganizationId),
            Message: messageSendData,
          },
        }
        dispatch(InsertOTOMessages(Data, uploadFileTalk, t))

        let newMessageOto = {
          messageID: 0,
          senderID: parseInt(currentUserId),
          receiverID: parseInt(messageSendData.ReceiverID),
          messageBody: messageSendData.Body,
          senderName: 'Ali Mamdani',
          receiverName: chatClickData.fullName,
          shoutAll: 0,
          frMessages: 'Direct Message',
          broadcastName: '',
          isFlag: 0,
          sentDate: '',
          receivedDate: '',
          seenDate: '',
          currDate: currentDateTimeUtc,
          messageStatus: 'Undelivered',
          fileGeneratedName: '',
          fileName: '',
          messageCount: 0,
          attachmentLocation: '',
          uid: '',
          blockCount: 0,
          sourceMessageBody: 'Direct Message',
          sourceMessageId: 0,
        }

        let newChat = {
          id: parseInt(messageSendData.ReceiverID),
          fullName: chatClickData.fullName,
          imgURL: chatClickData.imgURL,
          messageBody: messageSendData.Body,
          messageDate: chatClickData.messageDate,
          notiCount: chatClickData.notiCount,
          messageType: chatClickData.messageType,
          isOnline: chatClickData.isOnline,
          isBlock: 0,
          companyName: chatClickData.companyName,
          sentDate: '',
          receivedDate: '',
          seenDate: '',
          attachmentLocation: messageSendData.AttachmentLocation,
          senderID: parseInt(messageSendData.SenderID),
          admin: chatClickData.admin,
        }
        setMessageSendData({
          ...messageSendData,
          SenderID: currentUserId.toString(),
          ReceiverID: messageSendData.ReceiverID,
          Body: '',
          MessageActivity: 'Direct Message',
          FileName: '',
          FileGeneratedName: '',
          Extension: '',
          AttachmentLocation: '',
        })
        let updatedArray = allChatData.map((obj) => {
          if (obj.id === newChat.id) {
            return newChat
          } else {
            return obj
          }
        })
        updatedArray = [
          newChat,
          ...updatedArray.filter((obj) => obj.id !== newChat.id),
        ]
        setAllChatData(updatedArray)
        setAllOtoMessages([...allOtoMessages, newMessageOto])
      } else if (chatClickData.messageType === 'G') {
        let Data = {
          TalkRequest: {
            ChannelID: parseInt(currentOrganizationId),
            Message: messageSendData,
          },
        }
        dispatch(InsertPrivateGroupMessages(Data, t))

        let newMessageGroup = {
          messageID: 0,
          senderID: parseInt(currentUserId),
          receiverID: parseInt(messageSendData.ReceiverID),
          messageBody: messageSendData.Body,
          senderName: 'Ali Mamdani',
          isFlag: 0,
          sentDate: currentDateTimeUtc,
          currDate: '',
          fileGeneratedName: '',
          fileName: '',
          shoutAll: 0,
          frMessages: 'Direct Message',
          messageCount: 0,
          attachmentLocation: '',
          sourceMessageBody: 'Direct Message',
          sourceMessageId: 0,
        }

        setAllGroupMessages([...allGroupMessages, newMessageGroup])

        let newChat = {
          id: parseInt(messageSendData.ReceiverID),
          fullName: chatClickData.fullName,
          imgURL: chatClickData.imgURL,
          messageBody: messageSendData.Body,
          messageDate: chatClickData.messageDate,
          notiCount: chatClickData.notiCount,
          messageType: chatClickData.messageType,
          isOnline: chatClickData.isOnline,
          companyName: chatClickData.companyName,
          sentDate: '',
          receivedDate: '',
          seenDate: '',
          attachmentLocation: messageSendData.AttachmentLocation,
          senderID: parseInt(messageSendData.SenderID),
          admin: chatClickData.admin,
        }
        setMessageSendData({
          ...messageSendData,
          SenderID: currentUserId.toString(),
          ReceiverID: messageSendData.ReceiverID,
          Body: '',
          MessageActivity: 'Direct Message',
          FileName: '',
          FileGeneratedName: '',
          Extension: '',
          AttachmentLocation: '',
        })
        let updatedArray = allChatData.map((obj) => {
          if (obj.id === newChat.id) {
            return newChat
          } else {
            return obj
          }
        })
        updatedArray = [
          newChat,
          ...updatedArray.filter((obj) => obj.id !== newChat.id),
        ]
        setAllChatData(updatedArray)
      } else if (chatClickData.messageType === 'B') {
        let Data = {
          TalkRequest: {
            ChannelID: parseInt(currentOrganizationId),
            Message: messageSendData,
          },
        }
        dispatch(InsertBroadcastMessages(Data, t))
        let newMessage = {
          attachmentLocation: messageSendData.AttachmentLocation,
          blockCount: 0,
          broadcastName: '',
          currDate: currentDateTimeUtc,
          fileGeneratedName: messageSendData.FileGeneratedName,
          fileName: messageSendData.FileName,
          frMessages: 'Direct Message',
          isFlag: 0,
          messageBody: messageSendData.Body,
          messageCount: 0,
          messageID: 0,
          messageStatus: 'Undelivered',
          receivedDate: '',
          receiverID: parseInt(messageSendData.ReceiverID),
          receiverName: '',
          seenDate: '',
          senderID: parseInt(messageSendData.SenderID),
          senderName: 'Muhammad Ovais',
          sentDate: '',
          shoutAll: 0,
          uid: '',
        }
        let newChat = {
          id: parseInt(messageSendData.ReceiverID),
          fullName: chatClickData.fullName,
          imgURL: chatClickData.imgURL,
          messageBody: messageSendData.Body,
          messageDate: chatClickData.messageDate,
          notiCount: chatClickData.notiCount,
          messageType: chatClickData.messageType,
          isOnline: chatClickData.isOnline,
          companyName: chatClickData.companyName,
          sentDate: '',
          receivedDate: '',
          seenDate: '',
          attachmentLocation: messageSendData.AttachmentLocation,
          senderID: parseInt(messageSendData.SenderID),
          admin: chatClickData.admin,
        }
        allBroadcastMessages.push(newMessage)
        setAllBroadcastMessages(allBroadcastMessages)
        setMessageSendData({
          ...messageSendData,
          SenderID: currentUserId.toString(),
          ReceiverID: messageSendData.ReceiverID,
          Body: '',
          MessageActivity: 'Direct Message',
          FileName: '',
          FileGeneratedName: '',
          Extension: '',
          AttachmentLocation: '',
        })
        let updatedArray = allChatData.map((obj) => {
          if (obj.id === newChat.id) {
            return newChat
          } else {
            return obj
          }
        })
        setAllChatData(updatedArray)
        let broadcastMessagesData = {
          UserID: currentUserId,
          BroadcastID: newChat.id,
          NumberOfMessages: 10,
          OffsetMessage: 5,
        }
        dispatch(GetBroadcastMessages(broadcastMessagesData, t))
      } else {
      }
    } else {
    }
    setReplyFeature(false)
  }

  //Set Timer For Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  console.log('Talk State Data', talkStateData)

  return (
    <>
      <div className={chatOpen === true ? 'chatBox height' : 'chatBox'}>
        {blockedUsersData.length > 0 &&
        shoutAllData.length === 0 &&
        privateMessageData.length === 0 &&
        privateGroupsData.length === 0 &&
        starredMessagesData.length === 0 &&
        allChatData.length === 0 &&
        activeCreateGroup === false &&
        addNewChat === false ? (
          <div className="chat-inner-content">
            <span className="triangle-overlay-chat"></span>
            <Triangle className="pointer-chat-icon" />
            <Container>
              <Row className={deleteChat === false ? '' : 'applyBlur'}>
                <Col lg={3} md={3} sm={12}>
                  <Select
                    options={chatFilterOptions}
                    onChange={chatFilterHandler}
                    className="chatFilter"
                    popupClassName="talk-chat-filter"
                    value={chatFilterName}
                  />
                </Col>
                <Col lg={6} md={6} sm={12}></Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons">
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={securityDialogue}
                    >
                      <img src={SecurityIcon} className="img-cover" />
                    </span>
                  </div>
                </Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons" onClick={searchFilterChat}>
                    <img src={SearchIcon} className="img-cover" />
                  </div>
                </Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons">
                    <img src={FullScreenIcon} className="img-cover" />
                  </div>
                </Col>
              </Row>
              {blockedUsersData !== undefined &&
              blockedUsersData !== null &&
              blockedUsersData.length > 0
                ? blockedUsersData.map((dataItem) => {
                    return (
                      <>
                        <Row
                          className={
                            deleteChat === true
                              ? 'single-chat applyBlur'
                              : 'single-chat'
                          }
                        >
                          <Col lg={2} md={2} sm={2} className="bottom-border">
                            <div className="chat-profile-icon">
                              <img src={SingleIcon} width={25} />
                            </div>
                          </Col>
                          <Col
                            lg={10}
                            md={10}
                            sm={10}
                            className="bottom-border"
                          >
                            <div className="chat-block blocked-users">
                              <p className="chat-username blocked-users m-0">
                                {' '}
                                {dataItem.fullName}
                              </p>
                              <Button
                                className="MontserratRegular Unblock-btn"
                                text="Unblock"
                                onClick={() =>
                                  unblockblockContactHandler(dataItem)
                                }
                              />
                            </div>
                          </Col>
                        </Row>
                      </>
                    )
                  })
                : null}
            </Container>
          </div>
        ) : blockedUsersData.length === 0 &&
          shoutAllData.length > 0 &&
          privateMessageData.length === 0 &&
          privateGroupsData.length === 0 &&
          starredMessagesData.length === 0 &&
          allChatData.length === 0 &&
          activeCreateGroup === false &&
          addNewChat === false ? (
          <div className="chat-inner-content">
            <span className="triangle-overlay-chat"></span>
            <Triangle className="pointer-chat-icon" />
            <Container>
              <Row className={deleteChat === false ? '' : 'applyBlur'}>
                <Col lg={3} md={3} sm={12}>
                  <Select
                    options={chatFilterOptions}
                    // defaultValue={chatFilterOptions[0]}
                    onChange={chatFilterHandler}
                    className="chatFilter"
                    popupClassName="talk-chat-filter"
                    value={chatFilterName}
                  />
                </Col>
                <Col lg={6} md={6} sm={12}></Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons">
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={securityDialogue}
                    >
                      <img src={SecurityIcon} className="img-cover" />
                    </span>
                  </div>
                </Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons" onClick={searchFilterChat}>
                    <img src={SearchIcon} className="img-cover" />
                  </div>
                </Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons">
                    <img src={FullScreenIcon} className="img-cover" />
                  </div>
                </Col>
              </Row>
              {shoutAllData !== undefined &&
              shoutAllData !== null &&
              shoutAllData.length > 0
                ? shoutAllData.map((dataItem) => {
                    return (
                      <Row
                        className={
                          deleteChat === true
                            ? 'single-chat applyBlur'
                            : 'single-chat'
                        }
                      >
                        <Col lg={2} md={2} sm={2} className="bottom-border">
                          <div className="chat-profile-icon">
                            {dataItem.messageType === 'O' ? (
                              <>
                                <img src={SingleIcon} width={25} />
                              </>
                            ) : dataItem.messageType === 'G' ? (
                              <>
                                <img src={GroupIcon} width={35} />
                              </>
                            ) : dataItem.messageType === 'B' ? (
                              <>
                                <img src={ShoutIcon} width={25} />
                              </>
                            ) : (
                              <img src={SingleIcon} width={25} />
                            )}
                            {/* {dataItem.isOnline === true ? (
                              <span className="user-active-status"></span>
                            ) : (
                              <span className="user-active-status offline"></span>
                            )} */}
                          </div>
                        </Col>
                        <Col lg={10} md={10} sm={10} className="bottom-border">
                          <div className={'chat-block'}>
                            <p
                              onClick={() => chatClick(dataItem)}
                              className="chat-username m-0"
                            >
                              {' '}
                              {dataItem.fullName}
                            </p>
                            <p
                              onClick={() => chatClick(dataItem)}
                              className="chat-message m-0"
                            >
                              <span className="chat-tick-icon">
                                {dataItem.senderID === currentUserId &&
                                dataItem.sentDate === '' &&
                                dataItem.receivedDate === '' &&
                                dataItem.seenDate === '' ? (
                                  <img src={TimerIcon} className="img-cover" />
                                ) : dataItem.senderID === currentUserId &&
                                  dataItem.sentDate !== '' &&
                                  dataItem.receivedDate === '' &&
                                  dataItem.seenDate === '' ? (
                                  <img
                                    src={SingleTickIcon}
                                    className="img-cover"
                                  />
                                ) : dataItem.senderID === currentUserId &&
                                  dataItem.sentDate !== '' &&
                                  dataItem.receivedDate !== '' &&
                                  dataItem.seenDate === '' ? (
                                  <img
                                    src={DoubleTickDeliveredIcon}
                                    className="img-cover"
                                  />
                                ) : dataItem.senderID === currentUserId &&
                                  dataItem.sentDate !== '' &&
                                  dataItem.receivedDate !== '' &&
                                  dataItem.seenDate !== '' ? (
                                  <img
                                    src={DoubleTickIcon}
                                    className="img-cover"
                                  />
                                ) : null}
                              </span>
                              {dataItem.messageBody}
                            </p>
                            <p className="chat-date m-0">
                              {dataItem.messageDate.slice(0, 8) ===
                              currentUtcDate ? (
                                <>
                                  {/* {moment(
                                    dataItem.messageDate.slice(8, 15),
                                    'hhmmss',
                                  ).format('hh:mm a')} */}
                                  {newTimeFormaterAsPerUTCTalkTime(
                                    dataItem.messageDate,
                                  )}
                                </>
                              ) : dataItem.messageDate.slice(0, 8) ===
                                yesterdayDateUtc ? (
                                <>
                                  {/* {moment(
                                    dataItem.messageDate.slice(0, 8),
                                  ).format('DD-MMM-YYYY')} */}
                                  {newTimeFormaterAsPerUTCTalkDate(
                                    dataItem.messageDate,
                                  ) + ' '}
                                  | Yesterday
                                </>
                              ) : (
                                <>
                                  {newTimeFormaterAsPerUTCTalkDate(
                                    dataItem.messageDate,
                                  )}
                                </>
                              )}
                            </p>
                            {dataItem.notiCount > 0 ? (
                              <span className="new-message-count">
                                {dataItem.notiCount}
                              </span>
                            ) : null}

                            <div className="chathead-box-icons">
                              <img
                                src={DropDownIcon}
                                onClick={() =>
                                  activateChatHeadMenu(dataItem.id)
                                }
                              />
                              {chatHeadMenuActive === dataItem.id ? (
                                <div className="dropdown-menus-chathead">
                                  <span onClick={deleteChatHandler}>
                                    Delete Chat
                                  </span>
                                  <span
                                    onClick={() =>
                                      blockContactHandler(dataItem)
                                    }
                                    style={{ borderBottom: 'none' }}
                                  >
                                    Block
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    )
                  })
                : null}
            </Container>
          </div>
        ) : blockedUsersData.length === 0 &&
          shoutAllData.length === 0 &&
          privateMessageData.length > 0 &&
          privateGroupsData.length === 0 &&
          starredMessagesData.length === 0 &&
          allChatData.length === 0 &&
          activeCreateGroup === false &&
          addNewChat === false ? (
          <div className="chat-inner-content">
            <span className="triangle-overlay-chat"></span>
            <Triangle className="pointer-chat-icon" />
            <Container>
              <Row className={deleteChat === false ? '' : 'applyBlur'}>
                <Col lg={3} md={3} sm={12}>
                  <Select
                    options={chatFilterOptions}
                    // defaultValue={chatFilterOptions[0]}
                    onChange={chatFilterHandler}
                    className="chatFilter"
                    popupClassName="talk-chat-filter"
                    value={chatFilterName}
                  />
                </Col>
                <Col lg={6} md={6} sm={12}></Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons">
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={securityDialogue}
                    >
                      <img src={SecurityIcon} className="img-cover" />
                    </span>
                  </div>
                </Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons" onClick={searchFilterChat}>
                    <img src={SearchIcon} className="img-cover" />
                  </div>
                </Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons">
                    <img src={FullScreenIcon} className="img-cover" />
                  </div>
                </Col>
              </Row>
              {privateMessageData !== undefined &&
              privateMessageData !== null &&
              privateMessageData.length > 0
                ? privateMessageData.map((dataItem) => {
                    return (
                      <Row
                        className={
                          deleteChat === true
                            ? 'single-chat applyBlur'
                            : 'single-chat'
                        }
                      >
                        <Col lg={2} md={2} sm={2} className="bottom-border">
                          <div className="chat-profile-icon">
                            {dataItem.messageType === 'O' ? (
                              <>
                                <img src={SingleIcon} width={25} />
                              </>
                            ) : dataItem.messageType === 'G' ? (
                              <>
                                <img src={GroupIcon} width={35} />
                              </>
                            ) : dataItem.messageType === 'B' ? (
                              <>
                                <img src={ShoutIcon} width={25} />
                              </>
                            ) : (
                              <img src={SingleIcon} width={25} />
                            )}
                            {/* {dataItem.isOnline === true ? (
                              <span className="user-active-status"></span>
                            ) : (
                              <span className="user-active-status offline"></span>
                            )} */}
                          </div>
                        </Col>
                        <Col lg={10} md={10} sm={10} className="bottom-border">
                          <div className={'chat-block'}>
                            <p
                              onClick={() => chatClick(dataItem)}
                              className="chat-username m-0"
                            >
                              {' '}
                              {dataItem.fullName}
                            </p>
                            <p
                              onClick={() => chatClick(dataItem)}
                              className="chat-message m-0"
                            >
                              <span className="chat-tick-icon">
                                {dataItem.senderID === currentUserId &&
                                dataItem.sentDate === '' &&
                                dataItem.receivedDate === '' &&
                                dataItem.seenDate === '' ? (
                                  <img src={TimerIcon} className="img-cover" />
                                ) : dataItem.senderID === currentUserId &&
                                  dataItem.sentDate !== '' &&
                                  dataItem.receivedDate === '' &&
                                  dataItem.seenDate === '' ? (
                                  <img
                                    src={SingleTickIcon}
                                    className="img-cover"
                                  />
                                ) : dataItem.senderID === currentUserId &&
                                  dataItem.sentDate !== '' &&
                                  dataItem.receivedDate !== '' &&
                                  dataItem.seenDate === '' ? (
                                  <img
                                    src={DoubleTickDeliveredIcon}
                                    className="img-cover"
                                  />
                                ) : dataItem.senderID === currentUserId &&
                                  dataItem.sentDate !== '' &&
                                  dataItem.receivedDate !== '' &&
                                  dataItem.seenDate !== '' ? (
                                  <img
                                    src={DoubleTickIcon}
                                    className="img-cover"
                                  />
                                ) : null}
                              </span>
                              {dataItem.messageBody}
                            </p>
                            <p
                              onClick={() => chatClick(dataItem)}
                              className="chat-date m-0"
                            >
                              {dataItem.messageDate.slice(0, 8) ===
                              currentUtcDate ? (
                                <>
                                  {/* {moment(
                                    dataItem.messageDate.slice(8, 15),
                                    'hhmmss',
                                  ).format('hh:mm a')} */}
                                  {newTimeFormaterAsPerUTCTalkTime(
                                    dataItem.messageDate,
                                  )}
                                </>
                              ) : dataItem.messageDate.slice(0, 8) ===
                                yesterdayDateUtc ? (
                                <>
                                  {/* {moment(
                                    dataItem.messageDate.slice(0, 8),
                                  ).format('DD-MMM-YYYY')}{' '} */}
                                  {newTimeFormaterAsPerUTCTalkDate(
                                    dataItem.messageDate,
                                  ) + ' '}
                                  | Yesterday
                                </>
                              ) : (
                                <>
                                  {newTimeFormaterAsPerUTCTalkDate(
                                    dataItem.messageDate,
                                  )}
                                </>
                              )}
                            </p>
                            {dataItem.notiCount > 0 ? (
                              <span className="new-message-count">
                                {dataItem.notiCount}
                              </span>
                            ) : null}

                            <div className="chathead-box-icons">
                              <img
                                src={DropDownIcon}
                                onClick={() =>
                                  activateChatHeadMenu(dataItem.id)
                                }
                              />
                              {chatHeadMenuActive === dataItem.id ? (
                                <div className="dropdown-menus-chathead">
                                  <span onClick={deleteChatHandler}>
                                    Delete Chat
                                  </span>
                                  {dataItem.isBlock === 0 ? (
                                    <span
                                      onClick={() =>
                                        blockContactHandler(dataItem)
                                      }
                                      style={{ borderBottom: 'none' }}
                                    >
                                      Block
                                    </span>
                                  ) : (
                                    <span
                                      onClick={() =>
                                        blockContactHandler(dataItem)
                                      }
                                      style={{ borderBottom: 'none' }}
                                    >
                                      Unblock
                                    </span>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    )
                  })
                : null}
            </Container>
          </div>
        ) : blockedUsersData.length === 0 &&
          shoutAllData.length === 0 &&
          privateMessageData.length === 0 &&
          privateGroupsData.length > 0 &&
          starredMessagesData.length === 0 &&
          allChatData.length === 0 &&
          activeCreateGroup === false &&
          addNewChat === false ? (
          <div className="chat-inner-content">
            <div
              className={
                chatOpen === true && deleteChat === true
                  ? 'add-chat height applyBlur'
                  : chatOpen === true && deleteChat === false
                  ? 'add-chat height'
                  : chatOpen === false && deleteChat === true
                  ? 'add-chat applyBlur'
                  : 'add-chat'
              }
              onClick={createGroupScreen}
            >
              <img
                className={deleteChat === false ? '' : 'applyBlur'}
                src={AddChatIcon}
                alt=""
              />
            </div>
            <span className="triangle-overlay-chat"></span>
            <Triangle className="pointer-chat-icon" />
            <Container>
              <Row className={deleteChat === false ? '' : 'applyBlur'}>
                <Col lg={3} md={3} sm={12}>
                  <Select
                    options={chatFilterOptions}
                    // defaultValue={chatFilterOptions[0]}
                    onChange={chatFilterHandler}
                    className="chatFilter"
                    popupClassName="talk-chat-filter"
                    value={chatFilterName}
                  />
                </Col>
                <Col lg={6} md={6} sm={12}></Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons">
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={securityDialogue}
                    >
                      <img src={SecurityIcon} className="img-cover" />
                    </span>
                  </div>
                </Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons" onClick={searchFilterChat}>
                    <img src={SearchIcon} className="img-cover" />
                  </div>
                </Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons">
                    <img src={FullScreenIcon} className="img-cover" />
                  </div>
                </Col>
              </Row>
              {privateGroupsData !== undefined &&
              privateGroupsData !== null &&
              privateGroupsData.length > 0
                ? privateGroupsData.map((dataItem) => {
                    return (
                      <Row
                        className={
                          deleteChat === true
                            ? 'single-chat applyBlur'
                            : 'single-chat'
                        }
                      >
                        <Col lg={2} md={2} sm={2} className="bottom-border">
                          <div className="chat-profile-icon">
                            {dataItem.messageType === 'O' ? (
                              <>
                                <img src={SingleIcon} width={25} />
                              </>
                            ) : dataItem.messageType === 'G' ? (
                              <>
                                <img src={GroupIcon} width={35} />
                              </>
                            ) : dataItem.messageType === 'B' ? (
                              <>
                                <img src={ShoutIcon} width={25} />
                              </>
                            ) : (
                              <img src={SingleIcon} width={25} />
                            )}
                            {/* {dataItem.isOnline === true ? (
                              <span className="user-active-status"></span>
                            ) : (
                              <span className="user-active-status offline"></span>
                            )} */}
                          </div>
                        </Col>
                        <Col lg={10} md={10} sm={10} className="bottom-border">
                          <div className={'chat-block'}>
                            <p
                              onClick={() => chatClick(dataItem)}
                              className="chat-username m-0"
                            >
                              {' '}
                              {dataItem.fullName}
                            </p>
                            <p
                              onClick={() => chatClick(dataItem)}
                              className="chat-message m-0"
                            >
                              <span className="chat-tick-icon">
                                {dataItem.senderID === currentUserId &&
                                dataItem.sentDate === '' &&
                                dataItem.receivedDate === '' &&
                                dataItem.seenDate === '' ? (
                                  <img src={TimerIcon} className="img-cover" />
                                ) : dataItem.senderID === currentUserId &&
                                  dataItem.sentDate !== '' &&
                                  dataItem.receivedDate === '' &&
                                  dataItem.seenDate === '' ? (
                                  <img
                                    src={SingleTickIcon}
                                    className="img-cover"
                                  />
                                ) : dataItem.senderID === currentUserId &&
                                  dataItem.sentDate !== '' &&
                                  dataItem.receivedDate !== '' &&
                                  dataItem.seenDate === '' ? (
                                  <img
                                    src={DoubleTickDeliveredIcon}
                                    className="img-cover"
                                  />
                                ) : dataItem.senderID === currentUserId &&
                                  dataItem.sentDate !== '' &&
                                  dataItem.receivedDate !== '' &&
                                  dataItem.seenDate !== '' ? (
                                  <img
                                    src={DoubleTickIcon}
                                    className="img-cover"
                                  />
                                ) : null}
                              </span>
                              {dataItem.messageBody}
                            </p>
                            <p
                              onClick={() => chatClick(dataItem)}
                              className="chat-date m-0"
                            >
                              {dataItem.messageDate.slice(0, 8) ===
                              currentUtcDate ? (
                                <>
                                  {newTimeFormaterAsPerUTCTalkTime(
                                    dataItem.messageDate,
                                  )}
                                </>
                              ) : dataItem.messageDate.slice(0, 8) ===
                                yesterdayDateUtc ? (
                                <>
                                  {newTimeFormaterAsPerUTCTalkDate(
                                    dataItem.messageDate,
                                  ) + ' '}
                                  | Yesterday
                                </>
                              ) : (
                                <>
                                  {newTimeFormaterAsPerUTCTalkDate(
                                    dataItem.messageDate,
                                  )}
                                </>
                              )}
                            </p>
                            {dataItem.notiCount > 0 ? (
                              <span className="new-message-count">
                                {dataItem.notiCount}
                              </span>
                            ) : null}

                            <div className="chathead-box-icons">
                              <img
                                src={DropDownIcon}
                                onClick={() =>
                                  activateChatHeadMenu(dataItem.id)
                                }
                              />
                              {chatHeadMenuActive === dataItem.id ? (
                                <div className="dropdown-menus-chathead">
                                  <span onClick={deleteChatHandler}>
                                    Delete Chat
                                  </span>
                                  {dataItem.isBlock === 0 ? (
                                    <span
                                      onClick={() =>
                                        blockContactHandler(dataItem)
                                      }
                                      style={{ borderBottom: 'none' }}
                                    >
                                      Block
                                    </span>
                                  ) : (
                                    <span
                                      onClick={() =>
                                        blockContactHandler(dataItem)
                                      }
                                      style={{ borderBottom: 'none' }}
                                    >
                                      Unblock
                                    </span>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    )
                  })
                : null}
            </Container>
          </div>
        ) : blockedUsersData.length === 0 &&
          shoutAllData.length === 0 &&
          privateMessageData.length === 0 &&
          privateGroupsData.length === 0 &&
          starredMessagesData.length > 0 &&
          allChatData.length === 0 &&
          activeCreateGroup === false &&
          addNewChat === false ? (
          <div className="chat-inner-content">
            <span className="triangle-overlay-chat"></span>
            <Triangle className="pointer-chat-icon" />
            <Container>
              <Row
                className={deleteChat === false ? '' : 'applyBlur'}
                style={{ marginBottom: '15px' }}
              >
                <Col lg={3} md={3} sm={12}>
                  <Select
                    options={chatFilterOptions}
                    // defaultValue={chatFilterOptions[0]}
                    onChange={chatFilterHandler}
                    className="chatFilter"
                    popupClassName="talk-chat-filter"
                    value={chatFilterName}
                  />
                </Col>
                <Col lg={6} md={6} sm={12}></Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons">
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={securityDialogue}
                    >
                      <img src={SecurityIcon} className="img-cover" />
                    </span>
                  </div>
                </Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons" onClick={searchFilterChat}>
                    <img src={SearchIcon} className="img-cover" />
                  </div>
                </Col>
                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons">
                    <img src={FullScreenIcon} className="img-cover" />
                  </div>
                </Col>
              </Row>
              {starredMessagesData !== undefined &&
              starredMessagesData !== null &&
              starredMessagesData.length > 0
                ? starredMessagesData.map((dataItem) => {
                    return (
                      <>
                        <Row>
                          <Col lg={1} md={1} sm={1}>
                            <div className="chat-profile-icon starred-message">
                              <img src={SingleIcon} width={10} />
                            </div>
                          </Col>
                          <Col lg={7} md={7} sm={7}>
                            <p className="chat-username starred-message m-0">
                              {dataItem.fullName}
                            </p>
                          </Col>
                          <Col lg={4} md={4} sm={4} className="text-end">
                            <p className="date starred-message m-0">
                              {newTimeFormaterAsPerUTCTalkDate(
                                dataItem.sentDate,
                              )}
                            </p>
                          </Col>
                        </Row>
                        <Row className="bottom-border-starred">
                          <Col lg={12} md={12} sm={12}>
                            <div className="reply-message">
                              <p className="m-0">{dataItem.messageBody}</p>
                              <div className="starred-icon-date">
                                <span>
                                  <img src={StarredMessageIcon} alt="" />
                                </span>
                                <p className="m-0">
                                  {' '}
                                  {dataItem.sentDate !== ''
                                    ? newTimeFormaterAsPerUTCTalkDate(
                                        dataItem.sentDate,
                                      )
                                    : // moment(
                                      //     dataItem.sentDate.slice(0, 8),
                                      //   ).format('DD-MMM-YYYY')
                                      ''}
                                </p>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </>
                    )
                  })
                : null}
            </Container>
          </div>
        ) : blockedUsersData.length === 0 &&
          shoutAllData.length === 0 &&
          privateMessageData.length === 0 &&
          privateGroupsData.length === 0 &&
          starredMessagesData.length === 0 &&
          allChatData.length === 0 &&
          activeCreateGroup === false &&
          addNewChat === false ? (
          <>
            {talkStateData.AllUserChats.Loading === true ? (
              <Spin className="talk-overallchat-spinner" />
            ) : (
              <>
                <div className="chat-inner-content">
                  <div
                    className={
                      chatOpen === true && deleteChat === true
                        ? 'add-chat height applyBlur'
                        : chatOpen === true && deleteChat === false
                        ? 'add-chat height'
                        : chatOpen === false && deleteChat === true
                        ? 'add-chat applyBlur'
                        : 'add-chat'
                    }
                    onClick={addChat}
                  >
                    <img
                      className={deleteChat === false ? '' : 'applyBlur'}
                      src={AddChatIcon}
                      alt=""
                    />
                  </div>
                  <span className="triangle-overlay-chat"></span>
                  <Triangle className="pointer-chat-icon" />
                  <Container>
                    {/* <Spin className="talk-overallchat-spinner" /> */}
                    <Row className={deleteChat === false ? '' : 'applyBlur'}>
                      <Col lg={3} md={3} sm={12}>
                        <Select
                          options={chatFilterOptions}
                          onChange={chatFilterHandler}
                          className="chatFilter"
                          popupClassName="talk-chat-filter"
                          value={chatFilterName}
                        />
                      </Col>
                      <Col lg={6} md={6} sm={12}></Col>
                      <Col lg={1} md={1} sm={12} className="p-0">
                        <div className="chat-icons">
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={securityDialogue}
                          >
                            <img src={SecurityIcon} className="img-cover" />
                          </span>
                        </div>
                      </Col>
                      <Col lg={1} md={1} sm={12} className="p-0">
                        <div className="chat-icons" onClick={searchFilterChat}>
                          <img src={SearchIcon} className="img-cover" />
                        </div>
                      </Col>
                      <Col lg={1} md={1} sm={12} className="p-0">
                        <div className="chat-icons">
                          <img src={FullScreenIcon} className="img-cover" />
                        </div>
                      </Col>
                    </Row>
                    <p>No Data Available</p>
                  </Container>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="chat-inner-content">
            <div
              className={
                chatOpen === true && deleteChat === true
                  ? 'add-chat height applyBlur'
                  : chatOpen === true && deleteChat === false
                  ? 'add-chat height'
                  : chatOpen === false && deleteChat === true
                  ? 'add-chat applyBlur'
                  : 'add-chat'
              }
              onClick={addChat}
            >
              <img
                className={deleteChat === false ? '' : 'applyBlur'}
                src={AddChatIcon}
                alt=""
              />
            </div>
            <span className="triangle-overlay-chat"></span>
            <Triangle className="pointer-chat-icon" />
            {addNewChat === true && activeCreateGroup === false ? (
              <>
                <Container>
                  <Row className="margin-top-10">
                    <Col lg={6} md={6} sm={12}>
                      <div className="new-chat">
                        <p className="fw-bold m-0">New Conversation</p>
                      </div>
                    </Col>
                    <Col lg={5} md={5} sm={12}></Col>

                    <Col lg={1} md={1} sm={12} className="p-0">
                      <div
                        className="close-addChat-filter"
                        onClick={closeAddChat}
                      >
                        <img src={CloseChatIcon} />
                      </div>
                    </Col>
                  </Row>
                  <Row className="margin-top-10">
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        maxLength={200}
                        applyClass="form-control2"
                        name="Name"
                        change={(e) => {
                          searchChat(e.target.value)
                        }}
                        value={searchChatValue}
                      />
                    </Col>
                  </Row>
                </Container>
                <Container>
                  {allUsers !== undefined &&
                  allUsers !== null &&
                  allUsers.length > 0
                    ? allUsers.map((dataItem) => {
                        return (
                          <Row className="single-chat">
                            <Col lg={2} md={2} sm={2} className="bottom-border">
                              <div className="chat-profile-icon">
                                {/* Bell Notification SVG Code */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="31.188"
                                  height="31.186"
                                  viewBox="0 0 31.188 31.186"
                                >
                                  <g
                                    id="Group_1683"
                                    data-name="Group 1683"
                                    transform="translate(-189.415 78.235)"
                                  >
                                    <path
                                      id="Path_594"
                                      data-name="Path 594"
                                      d="M220.6-47.049H218.18a13.038,13.038,0,0,0-4.892-10.2,12.728,12.728,0,0,0-8.892-2.939,12.681,12.681,0,0,0-6.291,1.95,13.229,13.229,0,0,0-4.581,4.787,13.087,13.087,0,0,0-1.674,6.385h-2.434a15.387,15.387,0,0,1,2.885-9.01,15.6,15.6,0,0,1,7.585-5.709c-.09-.076-.145-.129-.207-.175a8.863,8.863,0,0,1-3.339-9.641,8.764,8.764,0,0,1,6.6-6.379c.477-.127.975-.171,1.464-.254h1.218c.489.083.987.128,1.464.254a8.694,8.694,0,0,1,6.591,6.382A8.679,8.679,0,0,1,211-62.5c-.261.247-.554.459-.854.705.09.041.151.073.215.1a15.292,15.292,0,0,1,5.562,3.519,15.27,15.27,0,0,1,4.436,8.416c.1.6.164,1.2.244,1.8ZM205.008-75.8a6.6,6.6,0,0,0-6.576,6.563,6.6,6.6,0,0,0,6.579,6.591,6.6,6.6,0,0,0,6.576-6.563A6.6,6.6,0,0,0,205.008-75.8Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </svg>
                                {/* <span className="user-active-status"></span> */}
                              </div>
                            </Col>
                            <Col
                              lg={10}
                              md={10}
                              sm={10}
                              className="bottom-border"
                            >
                              <div
                                className={'chat-block add-user-section'}
                                onClick={() => chatClickNewChat(dataItem)}
                              >
                                <p className="chat-username m-0">
                                  {' '}
                                  {dataItem.fullName}
                                </p>
                                {/* <p className="chat-message m-0">
                              <span className="chat-tick-icon">
                                <img
                                  src={DoubleTickIcon}
                                  className="img-cover"
                                />
                              </span>
                              {dataItem.messageBody}
                            </p> */}
                                {/* <p className="chat-date m-0">
                              10 Jan, 2023 | Yesterday
                            </p> */}
                              </div>
                            </Col>
                          </Row>
                        )
                      })
                    : null}
                </Container>
              </>
            ) : addNewChat === false && activeCreateGroup === true ? (
              <>
                <Container>
                  <Row className="margin-top-10">
                    <Col lg={6} md={6} sm={12}>
                      <div className="new-chat">
                        <p className="fw-bold m-0">Create a Group</p>
                      </div>
                    </Col>
                    <Col lg={5} md={5} sm={12}></Col>

                    <Col lg={1} md={1} sm={12} className="p-0">
                      <div
                        className="close-addChat-filter"
                        onClick={closeAddGroupScreen}
                      >
                        <img src={CloseChatIcon} />
                      </div>
                    </Col>
                  </Row>
                  <Row className="margin-top-10">
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        maxLength={200}
                        applyClass="form-control2"
                        name="Name"
                        placeholder={'Group Name'}
                        change={(e) => {
                          setGroupNameValue(e.target.value)
                        }}
                        value={groupNameValue}
                      />
                    </Col>
                  </Row>
                  <Row className="margin-top-5">
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        maxLength={200}
                        applyClass="form-control2"
                        name="Name"
                        placeholder={'Search User'}
                        change={(e) => {
                          searchGroupUser(e.target.value)
                        }}
                        value={searchGroupUserValue}
                      />
                    </Col>
                  </Row>
                </Container>
                <Container>
                  <div className="add-group-members-list">
                    {allUsers !== undefined &&
                    allUsers !== null &&
                    allUsers.length > 0
                      ? allUsers.map((dataItem, index) => {
                          return (
                            <Row className="single-user">
                              <Col lg={2} md={2} sm={2}>
                                <div className="user-profile-icon">
                                  {/* Bell Notification SVG Code */}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="31.188"
                                    height="31.186"
                                    viewBox="0 0 31.188 31.186"
                                  >
                                    <g
                                      id="Group_1683"
                                      data-name="Group 1683"
                                      transform="translate(-189.415 78.235)"
                                    >
                                      <path
                                        id="Path_594"
                                        data-name="Path 594"
                                        d="M220.6-47.049H218.18a13.038,13.038,0,0,0-4.892-10.2,12.728,12.728,0,0,0-8.892-2.939,12.681,12.681,0,0,0-6.291,1.95,13.229,13.229,0,0,0-4.581,4.787,13.087,13.087,0,0,0-1.674,6.385h-2.434a15.387,15.387,0,0,1,2.885-9.01,15.6,15.6,0,0,1,7.585-5.709c-.09-.076-.145-.129-.207-.175a8.863,8.863,0,0,1-3.339-9.641,8.764,8.764,0,0,1,6.6-6.379c.477-.127.975-.171,1.464-.254h1.218c.489.083.987.128,1.464.254a8.694,8.694,0,0,1,6.591,6.382A8.679,8.679,0,0,1,211-62.5c-.261.247-.554.459-.854.705.09.041.151.073.215.1a15.292,15.292,0,0,1,5.562,3.519,15.27,15.27,0,0,1,4.436,8.416c.1.6.164,1.2.244,1.8ZM205.008-75.8a6.6,6.6,0,0,0-6.576,6.563,6.6,6.6,0,0,0,6.579,6.591,6.6,6.6,0,0,0,6.576-6.563A6.6,6.6,0,0,0,205.008-75.8Z"
                                        fill="#fff"
                                      />
                                    </g>
                                  </svg>
                                  {/* <span className="user-active-status-group"></span> */}
                                </div>
                              </Col>
                              <Col lg={8} md={8} sm={8}>
                                <div className={'group-add-user'}>
                                  <p className="chat-username-group m-0">
                                    {dataItem.fullName}
                                  </p>
                                  <span>{dataItem.companyName}</span>
                                </div>
                              </Col>
                              <Col lg={2} md={2} sm={2}>
                                <Checkbox
                                  checked={
                                    groupUsersChecked.includes(dataItem.id)
                                      ? true
                                      : false
                                  }
                                  onChange={() =>
                                    groupUsersCheckedHandler(
                                      dataItem,
                                      dataItem.id,
                                      index,
                                    )
                                  }
                                  className="chat-message-checkbox-group"
                                />
                              </Col>
                            </Row>
                          )
                        })
                      : null}
                  </div>
                </Container>
                <Container>
                  <Row>
                    <Col className="text-center">
                      {noParticipant === true ? (
                        <p className="m-0">At least add one participant</p>
                      ) : null}
                      <Button
                        className="MontserratSemiBold Ok-btn forward-user"
                        text="Create Group"
                        onClick={createPrivateGroup}
                      />
                    </Col>
                  </Row>
                </Container>
              </>
            ) : addNewChat === false && activeCreateGroup === false ? (
              <>
                <Container>
                  <Row className={deleteChat === false ? '' : 'applyBlur'}>
                    <Col lg={3} md={3} sm={12}>
                      <Select
                        options={chatFilterOptions}
                        // defaultValue={chatFilterOptions[0]}
                        onChange={chatFilterHandler}
                        className="chatFilter"
                        popupClassName="talk-chat-filter"
                        value={chatFilterName}
                      />
                    </Col>
                    <Col lg={6} md={6} sm={12}></Col>
                    <Col lg={1} md={1} sm={12} className="p-0">
                      <div className="chat-icons">
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={securityDialogue}
                        >
                          <img src={SecurityIcon} className="img-cover" />
                        </span>
                      </div>
                    </Col>
                    <Col lg={1} md={1} sm={12} className="p-0">
                      <div className="chat-icons" onClick={searchFilterChat}>
                        <img src={SearchIcon} className="img-cover" />
                      </div>
                    </Col>
                    <Col lg={1} md={1} sm={12} className="p-0">
                      <div className="chat-icons">
                        <img src={FullScreenIcon} className="img-cover" />
                      </div>
                    </Col>
                  </Row>
                  {globalSearchFilter === true ? (
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <TextField
                          maxLength={200}
                          applyClass="form-control2"
                          name="Name"
                          change={(e) => {
                            searchChat(e.target.value)
                          }}
                          value={searchChatValue}
                          placeholder="Search Chat"
                        />
                      </Col>
                    </Row>
                  ) : null}
                  {openEncryptionDialogue === true ? (
                    <Row className="encryption-box">
                      <Col lg={12} md={12} sm={12} className="text-end">
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={closeSecurityDialogue}
                        >
                          <img src={CrossIcon} style={{ width: '10px' }} />
                        </span>
                      </Col>
                      <Col lg={12} md={12} sm={12}>
                        <div className="encryption-level">
                          <Row>
                            <Col lg={7} md={7} sm={12}>
                              <p className="level-heading">Crypto Level:</p>
                            </Col>
                            <Col
                              lg={5}
                              md={5}
                              sm={12}
                              className="positionRelative"
                            >
                              <p className="level">NIAP + PQC</p>
                              <span className="securityicon-box">
                                {' '}
                                <img
                                  src={SecurityIconMessasgeBox}
                                  style={{ width: '17px' }}
                                />
                              </span>
                            </Col>
                          </Row>
                        </div>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <div className="encryption-message">
                              <p>
                                We realize & understand that privacy & security
                                of data is of pivotal requirement for any
                                organization and its users. It is of utmost
                                importance that data flowing between the end
                                user device and the Talk Server is immune to
                                data breaches, data exposure & data leakages.
                                That’s why at Diskus we practice protecting
                                digital information throughout its lifecycle by
                                utilizing multilayered security approach.
                              </p>
                              <p>
                                {' '}
                                Following the NIAP benchmark, that requires
                                outermost layer of all communicating devices
                                must be secured by TLS using NIST validated
                                algorithms (i.e. ECC-384 & AES-256) we make sure
                                that the data in motion is protected to the
                                classification level of Official Top Secret.
                                Securing the communicating endpoints only is not
                                sufficient and doesn’t guarantee end-to-end
                                privacy and authentication and that’s where we
                                utilize Post Quantum Cryptography (PQC)
                                “Crystals - Kyber” for end-to-end encryption of
                                data.
                              </p>{' '}
                              <p>
                                PQC are the advanced form of encryption &
                                cryptography algorithms that ensure security and
                                reliability against any threat/attack conducted
                                using any available Quantum Computer A NIST
                                compliant Key agreement along with PQC key
                                agreement generates a unique once per session
                                key and ensures data encrypted using these keys
                                can only be decrypted by intended recipient thus
                                ensuring mutual authentication of a
                                per session basis.
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ) : null}
                </Container>
                <Container>
                  {deleteChat === true ? (
                    <>
                      <div className="delete-chat-popup">
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <div className="chat-modal-Heading">
                              <h1>Delete Chat</h1>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={2} md={2} sm={12}></Col>
                          <Col lg={4} md={4} sm={12}>
                            <Button
                              className="MontserratSemiBold Cancel-btn-delete"
                              text="Cancel"
                              onClick={handleCancel}
                            />
                          </Col>
                          <Col lg={4} md={4} sm={12}>
                            <Button
                              className="MontserratSemiBold Delete-btn-delete"
                              text="Delete"
                              onClick={handleCancel}
                            />
                          </Col>
                          <Col lg={2} md={2} sm={12}></Col>
                        </Row>
                      </div>
                    </>
                  ) : null}

                  {allChatData !== undefined &&
                  allChatData !== null &&
                  allChatData.length > 0
                    ? allChatData.map((dataItem) => {
                        return (
                          <Row
                            className={
                              deleteChat === true
                                ? 'single-chat applyBlur'
                                : 'single-chat'
                            }
                          >
                            <Col lg={2} md={2} sm={2} className="bottom-border">
                              <div className="chat-profile-icon">
                                {dataItem.messageType === 'O' ? (
                                  <>
                                    <img src={SingleIcon} width={25} />
                                  </>
                                ) : dataItem.messageType === 'G' ? (
                                  <>
                                    <img src={GroupIcon} width={35} />
                                  </>
                                ) : dataItem.messageType === 'B' ? (
                                  <>
                                    <img src={ShoutIcon} width={25} />
                                  </>
                                ) : (
                                  <img src={SingleIcon} width={25} />
                                )}
                                {/* {dataItem.isOnline === true ? (
                                  <span className="user-active-status"></span>
                                ) : (
                                  <span className="user-active-status offline"></span>
                                )} */}
                              </div>
                            </Col>
                            <Col
                              lg={10}
                              md={10}
                              sm={10}
                              className="bottom-border"
                            >
                              <div className={'chat-block'}>
                                <p
                                  onClick={() => chatClick(dataItem)}
                                  className="chat-username m-0"
                                >
                                  {' '}
                                  {dataItem.fullName}
                                </p>
                                <p
                                  onClick={() => chatClick(dataItem)}
                                  className="chat-message m-0"
                                >
                                  <span className="chat-tick-icon">
                                    {dataItem.senderID ===
                                      parseInt(currentUserId) &&
                                    dataItem.sentDate === '' &&
                                    dataItem.receivedDate === '' &&
                                    dataItem.seenDate === '' ? (
                                      <img
                                        src={TimerIcon}
                                        className="img-cover"
                                      />
                                    ) : dataItem.senderID ===
                                        parseInt(currentUserId) &&
                                      dataItem.sentDate !== '' &&
                                      dataItem.receivedDate === '' &&
                                      dataItem.seenDate === '' ? (
                                      <img
                                        src={SingleTickIcon}
                                        className="img-cover"
                                      />
                                    ) : dataItem.senderID ===
                                        parseInt(currentUserId) &&
                                      dataItem.sentDate !== '' &&
                                      dataItem.receivedDate !== '' &&
                                      dataItem.seenDate === '' ? (
                                      <img
                                        src={DoubleTickDeliveredIcon}
                                        className="img-cover"
                                      />
                                    ) : dataItem.senderID ===
                                        parseInt(currentUserId) &&
                                      dataItem.sentDate !== '' &&
                                      dataItem.receivedDate !== '' &&
                                      dataItem.seenDate !== '' ? (
                                      <img
                                        src={DoubleTickIcon}
                                        className="img-cover"
                                      />
                                    ) : null}
                                  </span>
                                  {dataItem.messageBody}
                                </p>
                                <p
                                  onClick={() => chatClick(dataItem)}
                                  className="chat-date m-0"
                                >
                                  {dataItem.messageDate.slice(0, 8) ===
                                    currentUtcDate &&
                                  dataItem.messageDate !== '' &&
                                  dataItem.messageDate !== undefined ? (
                                    <>
                                      {/* {moment(
                                        dataItem.messageDate.slice(8, 15),
                                        'hhmmss',
                                      ).format('hh:mm a')} */}
                                      {newTimeFormaterAsPerUTCTalkTime(
                                        dataItem.messageDate,
                                      )}
                                    </>
                                  ) : dataItem.messageDate.slice(0, 8) ===
                                      yesterdayDateUtc &&
                                    dataItem.messageDate !== '' &&
                                    dataItem.messageDate !== undefined ? (
                                    <>
                                      {/* {moment(
                                        dataItem.messageDate.slice(0, 8),
                                      ).format('DD-MMM-YYYY')}{' '} */}
                                      {newTimeFormaterAsPerUTCTalkDate(
                                        dataItem.messageDate,
                                      ) + ' '}
                                      | Yesterday
                                    </>
                                  ) : (
                                    <>
                                      {dataItem.messageDate !== '' &&
                                      dataItem.messageDate !== undefined
                                        ? newTimeFormaterAsPerUTCTalkDate(
                                            dataItem.messageDate,
                                          )
                                        : ''}
                                    </>
                                  )}
                                </p>
                                {dataItem.notiCount > 0 ? (
                                  <span className="new-message-count">
                                    {dataItem.notiCount}
                                  </span>
                                ) : null}

                                <div className="chathead-box-icons">
                                  <img
                                    src={DropDownIcon}
                                    onClick={() =>
                                      activateChatHeadMenu(dataItem.id)
                                    }
                                  />
                                  {chatHeadMenuActive === dataItem.id ? (
                                    <div className="dropdown-menus-chathead">
                                      <span onClick={deleteChatHandler}>
                                        Delete Chat
                                      </span>
                                      {dataItem.messageType === 'O' &&
                                      dataItem.isBlock === 0 ? (
                                        <span
                                          onClick={() =>
                                            blockContactHandler(dataItem)
                                          }
                                          style={{ borderBottom: 'none' }}
                                        >
                                          Block
                                        </span>
                                      ) : dataItem.messageType === 'O' &&
                                        dataItem.isBlock === 1 ? (
                                        <span
                                          onClick={() =>
                                            blockContactHandler(dataItem)
                                          }
                                          style={{ borderBottom: 'none' }}
                                        >
                                          Unblock
                                        </span>
                                      ) : dataItem.messageType === 'G' &&
                                        dataItem.isBlock === 0 ? (
                                        <span
                                          // onClick={() =>
                                          // blockContactHandler(dataItem)
                                          // }
                                          style={{ borderBottom: 'none' }}
                                        >
                                          Leave Group
                                        </span>
                                      ) : null}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        )
                      })
                    : null}
                </Container>{' '}
              </>
            ) : null}
          </div>
        )}
      </div>

      <div className="positionRelative">
        {chatOpen === true ? (
          <div className="chat-messenger-head">
            <Container>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <div
                    className={
                      save === true ||
                      print === true ||
                      email === true ||
                      deleteMessage === true
                        ? 'chat-header applyBlur'
                        : 'chat-header'
                    }
                  >
                    <Row>
                      <Col lg={1} md={1} sm={12}>
                        <div className="chat-profile-icon">
                          {activeChat.messageType === 'O' ? (
                            <img src={SingleIcon} width={25} />
                          ) : activeChat.messageType === 'G' ? (
                            <img src={GroupIcon} width={30} />
                          ) : null}
                          {/* <span className="user-active-status"></span> */}
                        </div>
                      </Col>
                      <Col lg={6} md={6} sm={12}>
                        <p className="chat-username chathead">
                          {activeChat.fullName}
                        </p>
                      </Col>
                      <Col lg={1} md={1} sm={12}>
                        {' '}
                        <div className="chat-box-icons">
                          <img src={SecurityIcon} />
                        </div>
                      </Col>
                      <Col lg={1} md={1} sm={12}>
                        {' '}
                        <div className="chat-box-icons">
                          <img
                            onClick={showChatSearchHandler}
                            src={SearchChatIcon}
                          />
                        </div>
                      </Col>
                      <Col lg={1} md={1} sm={12}>
                        {' '}
                        <div
                          className="chat-box-icons positionRelative"
                          onClick={activateChatMenu}
                        >
                          <img src={MenuIcon} />
                          {chatMenuActive === true &&
                          activeChat.messageType === 'O' ? (
                            <div className="dropdown-menus-chat">
                              <span onClick={modalHandlerSave}>Save</span>
                              <span onClick={modalHandlerPrint}>Print</span>
                              <span
                                onClick={modalHandlerEmail}
                                style={{ borderBottom: 'none' }}
                              >
                                Email
                              </span>
                            </div>
                          ) : chatMenuActive === true &&
                            activeChat.messageType === 'G' ? (
                            <div className="dropdown-menus-chat">
                              <span onClick={modalHandlerSave}>Save </span>
                              <span onClick={modalHandlerPrint}>Print </span>
                              <span onClick={modalHandlerEmail}>Email</span>
                              <span onClick={modalHandlerGroupInfo}>
                                Group Info
                              </span>
                              <span
                              // onClick={modalHandlerEmail}
                              >
                                Delete Group
                              </span>
                              <span
                              // onClick={modalHandlerEmail}
                              >
                                Leave Group
                              </span>{' '}
                              <span
                                span
                                onClick={modalHandlerGroupEdit}
                                style={{ borderBottom: 'none' }}
                              >
                                Edit Info
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={1} md={1} sm={12}>
                        {' '}
                        <div className="chat-box-icons">
                          <img src={VideoCallIcon} />
                        </div>
                      </Col>
                      <Col lg={1} md={1} sm={12}>
                        {' '}
                        <div className="chat-box-icons" onClick={closeChat}>
                          <img
                            src={CloseChatIcon}
                            // className="img-cover"
                            // style={{ width: "20px", marginTop: "16px" }}
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
                        <p className="level-heading">Crypto Level:</p>
                      </Col>
                      <Col lg={5} md={5} sm={12} className="positionRelative">
                        <p className="level">NIAP + PQC</p>

                        <span className="securityicon-box">
                          <img
                            src={SecurityIconMessasgeBox}
                            style={{ width: '17px' }}
                          />
                        </span>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              {showChatSearch === true ? (
                <>
                  <div className="chat-searchfield">
                    <Row>
                      <Col>
                        <TextField
                          maxLength={200}
                          applyClass="form-control2"
                          name="Name"
                          change={(e) => setSearchChatWord(e.target.value)}
                          value={searchChatWord}
                          placeholder="Search Chat"
                        />
                      </Col>
                    </Row>
                  </div>
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
                          deleteMessage === true
                            ? 'chat-section applyBlur'
                            : 'chat-section'
                        }
                      >
                        <>
                          <div className="chat-messages-section">
                            {allOtoMessages.length > 0 &&
                            allGroupMessages.length === 0 ? (
                              allOtoMessages.map((messageData, index) => {
                                if (
                                  messageData.senderID ===
                                  parseInt(currentUserId)
                                ) {
                                  return (
                                    <>
                                      <div className="direct-chat-msg text-right mb-2 ">
                                        <div className="direct-chat-text message-outbox message-box text-start">
                                          <div
                                            className="chatmessage-box-icons"
                                            onClick={() =>
                                              chatFeatureSelected(
                                                messageData,
                                                messageData.messageID,
                                              )
                                            }
                                          >
                                            <img
                                              className="dropdown-icon"
                                              src={DropDownIcon}
                                            />
                                            {chatFeatureActive ===
                                            messageData.messageID ? (
                                              <div className="dropdown-menus-chatmessage">
                                                <span
                                                  onClick={() =>
                                                    replyFeatureHandler(
                                                      messageData,
                                                    )
                                                  }
                                                >
                                                  Reply
                                                </span>
                                                <span
                                                  onClick={
                                                    forwardFeatureHandler
                                                  }
                                                >
                                                  Forward
                                                </span>
                                                <span
                                                  onClick={() =>
                                                    deleteFeatureHandler(
                                                      messageData,
                                                    )
                                                  }
                                                >
                                                  Delete
                                                </span>
                                                <span
                                                  onClick={() =>
                                                    messageInfoHandler(
                                                      messageData,
                                                    )
                                                  }
                                                >
                                                  Message Info
                                                </span>
                                                <span
                                                  onClick={() =>
                                                    markUnmarkStarMessageHandler(
                                                      messageData,
                                                    )
                                                  }
                                                  style={{
                                                    borderBottom: 'none',
                                                  }}
                                                >
                                                  {messageData.isFlag === 0 ? (
                                                    <>Star Message</>
                                                  ) : (
                                                    <>Unstar Message</>
                                                  )}
                                                </span>
                                              </div>
                                            ) : null}
                                          </div>
                                          {messageData.frMessages ===
                                          'Direct Message' ? (
                                            <span className="direct-chat-body color-5a5a5a">
                                              <Keywords
                                                value={searchChatWord}
                                                render={highlight}
                                              >
                                                {messageData.messageBody}
                                              </Keywords>
                                            </span>
                                          ) : (
                                            <>
                                              <div className="replied-message-send">
                                                <p className="replied-message-sender m-0">
                                                  {messageData.frMessages[3]}
                                                </p>
                                                <p className="replied-message m-0">
                                                  {
                                                    messageData.sourceMessageBody
                                                  }
                                                </p>
                                              </div>
                                              <span className="direct-chat-body color-5a5a5a">
                                                <Keywords
                                                  value={searchChatWord}
                                                  render={highlight}
                                                >
                                                  {messageData.messageBody}
                                                </Keywords>
                                              </span>
                                            </>
                                          )}

                                          <div className="d-flex mt-1 justify-content-end">
                                            <div className="star-time-status ml-auto text-end">
                                              <span className="starred-status">
                                                {messageData.isFlag === 1 ? (
                                                  <img
                                                    src={StarredMessageIcon}
                                                    alt=""
                                                  />
                                                ) : null}
                                              </span>
                                              <span className="direct-chat-sent-time chat-datetime">
                                                {messageData.sentDate.slice(
                                                  0,
                                                  8,
                                                ) === currentUtcDate ? (
                                                  <>
                                                    {/* {moment(
                                                      messageData.sentDate.slice(
                                                        8,
                                                        15,
                                                      ),
                                                      'hhmmss',
                                                    ).format('hh:mm a')} */}
                                                    {newTimeFormaterAsPerUTCTalkTime(
                                                      messageData.sentDate,
                                                    )}
                                                  </>
                                                ) : messageData.sentDate.slice(
                                                    0,
                                                    8,
                                                  ) === yesterdayDateUtc ? (
                                                  <>
                                                    {/* {moment(
                                                      messageData.sentDate.slice(
                                                        0,
                                                        8,
                                                      ),
                                                    ).format(
                                                      'DD-MMM-YYYY',
                                                    )}{' '} */}
                                                    {newTimeFormaterAsPerUTCTalkDate(
                                                      messageData.sentDate,
                                                    ) + ' '}
                                                    | Yesterday
                                                  </>
                                                ) : messageData.sentDate ===
                                                  '' ? null : (
                                                  <>
                                                    {/* {moment(
                                                      messageData.sentDate.slice(
                                                        0,
                                                        8,
                                                      ),
                                                    ).format('DD-MMM-YYYY')} */}
                                                    {newTimeFormaterAsPerUTCTalkDate(
                                                      messageData.sentDate,
                                                    )}
                                                  </>
                                                )}
                                              </span>
                                              <div className="message-status">
                                                {messageData.messageStatus ===
                                                'Sent' ? (
                                                  <img
                                                    src={SingleTickIcon}
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  'Delivered' ? (
                                                  <img
                                                    src={
                                                      DoubleTickDeliveredIcon
                                                    }
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  'Seen' ? (
                                                  <img
                                                    src={DoubleTickIcon}
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  'Undelivered' ? (
                                                  <img src={TimerIcon} alt="" />
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {showCheckboxes === true ? (
                                          <Checkbox
                                            // checked={receiverCheckbox}
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
                                            className="chat-message-checkbox-receiver"
                                          />
                                        ) : null}
                                      </div>
                                    </>
                                  )
                                } else if (
                                  messageData.senderID !==
                                  parseInt(currentUserId)
                                ) {
                                  return (
                                    <div className="direct-chat-msg text-left mb-2 ">
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
                                          className="chat-message-checkbox-sender"
                                        />
                                      ) : null}

                                      <div className="direct-chat-text message-inbox message-box text-start">
                                        <div
                                          className="chatmessage-box-icons"
                                          onClick={() =>
                                            chatFeatureSelected(
                                              messageData,
                                              messageData.messageID,
                                            )
                                          }
                                        >
                                          <img
                                            className="dropdown-icon"
                                            src={DropDownChatIcon}
                                          />
                                          {chatFeatureActive ===
                                          messageData.messageID ? (
                                            <div className="dropdown-menus-chatmessage">
                                              <span
                                                onClick={() =>
                                                  replyFeatureHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                Reply
                                              </span>
                                              <span
                                                onClick={forwardFeatureHandler}
                                              >
                                                Forward
                                              </span>
                                              <span
                                                onClick={() =>
                                                  deleteFeatureHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                Delete
                                              </span>
                                              <span
                                                onClick={() =>
                                                  messageInfoHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                Message Info
                                              </span>
                                              <span
                                                onClick={() =>
                                                  markUnmarkStarMessageHandler(
                                                    messageData,
                                                  )
                                                }
                                                style={{
                                                  borderBottom: 'none',
                                                }}
                                              >
                                                {messageData.isFlag === 0 ? (
                                                  <>Star Message</>
                                                ) : (
                                                  <>Unstar Message</>
                                                )}
                                              </span>
                                            </div>
                                          ) : null}
                                        </div>
                                        {messageData.frMessages ===
                                        'Direct Message' ? (
                                          <span className="direct-chat-body color-white">
                                            <Keywords
                                              value={searchChatWord}
                                              render={highlight}
                                            >
                                              {messageData.messageBody}
                                            </Keywords>
                                          </span>
                                        ) : (
                                          <>
                                            <div className="replied-message-receive">
                                              <p className="replied-message-receiver m-0">
                                                {messageData.frMessages[3]}
                                              </p>
                                              <p className="replied-message m-0">
                                                {messageData.sourceMessageBody}
                                              </p>
                                            </div>
                                            <span className="direct-chat-body color-white">
                                              <Keywords
                                                value={searchChatWord}
                                                render={highlight}
                                              >
                                                {messageData.messageBody}
                                              </Keywords>
                                            </span>
                                          </>
                                        )}
                                        <div className="d-flex mt-1 justify-content-end">
                                          <div className="star-time-status ml-auto text-end">
                                            <span className="starred-status">
                                              {messageData.isFlag === 1 ? (
                                                <img
                                                  src={StarredMessageIcon}
                                                  alt=""
                                                />
                                              ) : null}
                                            </span>
                                            <span className="direct-chat-sent-time chat-datetime">
                                              {messageData.sentDate.slice(
                                                0,
                                                8,
                                              ) === currentUtcDate ? (
                                                <>
                                                  {/* {moment(
                                                    messageData.sentDate.slice(
                                                      8,
                                                      15,
                                                    ),
                                                    'hhmmss',
                                                  ).format('hh:mm a')} */}
                                                  {newTimeFormaterAsPerUTCTalkTime(
                                                    messageData.sentDate,
                                                  )}
                                                </>
                                              ) : messageData.sentDate.slice(
                                                  0,
                                                  8,
                                                ) === yesterdayDateUtc ? (
                                                <>
                                                  {/* {moment(
                                                    messageData.sentDate.slice(
                                                      0,
                                                      8,
                                                    ),
                                                  ).format('DD-MMM-YYYY')}{' '} */}
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                  ) + ' '}
                                                  | Yesterday
                                                </>
                                              ) : (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                  )}
                                                </>
                                              )}
                                            </span>
                                            <div className="message-status"></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }
                              })
                            ) : allOtoMessages.length === 0 &&
                              allGroupMessages.length > 0 ? (
                              allGroupMessages.map((messageData, index) => {
                                if (
                                  messageData.senderID ===
                                  parseInt(currentUserId)
                                ) {
                                  return (
                                    <div className="direct-chat-msg text-right mb-2 ">
                                      <div className="direct-chat-text message-outbox message-box text-start">
                                        <p className="group-sender-name">
                                          {messageData.senderName}
                                        </p>
                                        <div
                                          className="chatmessage-box-icons"
                                          onClick={() =>
                                            chatFeatureSelected(
                                              messageData,
                                              messageData.messageID,
                                            )
                                          }
                                        >
                                          <img
                                            className="dropdown-icon"
                                            src={DropDownIcon}
                                          />
                                          {chatFeatureActive ===
                                          messageData.messageID ? (
                                            <div className="dropdown-menus-chatmessage">
                                              <span
                                                onClick={() =>
                                                  replyFeatureHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                Reply
                                              </span>
                                              <span
                                                onClick={forwardFeatureHandler}
                                              >
                                                Forward
                                              </span>
                                              <span
                                                onClick={() =>
                                                  deleteFeatureHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                Delete
                                              </span>
                                              <span
                                                onClick={() =>
                                                  messageInfoHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                Message Info
                                              </span>
                                              <span
                                                onClick={() =>
                                                  markUnmarkStarMessageHandler(
                                                    messageData,
                                                  )
                                                }
                                                style={{
                                                  borderBottom: 'none',
                                                }}
                                              >
                                                {messageData.isFlag === 0 ? (
                                                  <>Star Message</>
                                                ) : (
                                                  <>Unstar Message</>
                                                )}
                                              </span>
                                            </div>
                                          ) : null}
                                        </div>
                                        {messageData.frMessages ===
                                        'Direct Message' ? (
                                          <span className="direct-chat-body color-5a5a5a">
                                            <Keywords
                                              value={searchChatWord}
                                              render={highlight}
                                            >
                                              {messageData.messageBody}
                                            </Keywords>
                                          </span>
                                        ) : (
                                          <>
                                            <div className="replied-message-send">
                                              <p className="replied-message-sender m-0">
                                                {messageData.frMessages[3]}
                                              </p>
                                              <p className="replied-message m-0">
                                                {messageData.sourceMessageBody}
                                              </p>
                                            </div>
                                            <span className="direct-chat-body color-5a5a5a">
                                              <Keywords
                                                value={searchChatWord}
                                                render={highlight}
                                              >
                                                {messageData.messageBody}
                                              </Keywords>
                                            </span>
                                          </>
                                        )}
                                        <div className="d-flex mt-1 justify-content-end">
                                          <div className="star-time-status ml-auto text-end">
                                            <span className="starred-status">
                                              {messageData.isFlag === 1 ? (
                                                <img
                                                  src={StarredMessageIcon}
                                                  alt=""
                                                />
                                              ) : null}
                                            </span>
                                            <span className="direct-chat-sent-time chat-datetime">
                                              {messageData.sentDate.slice(
                                                0,
                                                8,
                                              ) === currentUtcDate ? (
                                                <>
                                                  {/* {moment(
                                                    messageData.sentDate.slice(
                                                      8,
                                                      15,
                                                    ),
                                                    'hhmmss',
                                                  ).format('hh:mm a')} */}
                                                  {newTimeFormaterAsPerUTCTalkTime(
                                                    messageData.sentDate,
                                                  )}
                                                </>
                                              ) : messageData.sentDate.slice(
                                                  0,
                                                  8,
                                                ) === yesterdayDateUtc ? (
                                                <>
                                                  {/* {moment(
                                                    messageData.sentDate.slice(
                                                      0,
                                                      8,
                                                    ),
                                                  ).format('DD-MMM-YYYY')}{' '} */}
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                  ) + ' '}
                                                  | Yesterday
                                                </>
                                              ) : (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                  )}
                                                </>
                                              )}
                                            </span>
                                            <div className="message-status">
                                              {messageData.messageStatus ===
                                              'Sent' ? (
                                                <img
                                                  src={SingleTickIcon}
                                                  alt=""
                                                />
                                              ) : messageData.messageStatus ===
                                                'Delivered' ? (
                                                <img
                                                  src={DoubleTickDeliveredIcon}
                                                  alt=""
                                                />
                                              ) : messageData.messageStatus ===
                                                'Seen' ? (
                                                <img
                                                  src={DoubleTickIcon}
                                                  alt=""
                                                />
                                              ) : messageData.messageStatus ===
                                                'Undelivered' ? (
                                                <img src={TimerIcon} alt="" />
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
                                          className="chat-message-checkbox-receiver"
                                        />
                                      ) : null}
                                    </div>
                                  )
                                } else {
                                  return (
                                    <div className="direct-chat-msg text-left mb-2 ">
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
                                          className="chat-message-checkbox-sender"
                                        />
                                      ) : null}

                                      <div className="direct-chat-text message-inbox message-box text-start">
                                        <div
                                          className="chatmessage-box-icons"
                                          onClick={() =>
                                            chatFeatureSelected(
                                              messageData,
                                              messageData.messageID,
                                            )
                                          }
                                        >
                                          <img
                                            className="dropdown-icon"
                                            src={DropDownChatIcon}
                                          />
                                          {chatFeatureActive ===
                                          messageData.messageID ? (
                                            <div className="dropdown-menus-chatmessage">
                                              <span
                                                onClick={() =>
                                                  replyFeatureHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                Reply
                                              </span>
                                              <span
                                                onClick={forwardFeatureHandler}
                                              >
                                                Forward
                                              </span>
                                              <span
                                                onClick={() =>
                                                  deleteFeatureHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                Delete
                                              </span>
                                              <span
                                                onClick={() =>
                                                  messageInfoHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                Message Info
                                              </span>
                                              <span
                                                onClick={() =>
                                                  markUnmarkStarMessageHandler(
                                                    messageData,
                                                  )
                                                }
                                                style={{
                                                  borderBottom: 'none',
                                                }}
                                              >
                                                {messageData.isFlag === 0 ? (
                                                  <>Star Message</>
                                                ) : (
                                                  <>Unstar Message</>
                                                )}
                                              </span>
                                            </div>
                                          ) : null}
                                        </div>
                                        {messageData.frMessages ===
                                        'Direct Message' ? (
                                          <>
                                            <p className="group-sender-name">
                                              {messageData.senderName}
                                            </p>
                                            <span className="direct-chat-body color-white">
                                              <Keywords
                                                value={searchChatWord}
                                                render={highlight}
                                              >
                                                {messageData.messageBody}
                                              </Keywords>
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
                                                {messageData.sourceMessageBody}
                                              </p>
                                            </div>
                                            <span className="direct-chat-body color-white">
                                              <Keywords
                                                value={searchChatWord}
                                                render={highlight}
                                              >
                                                {messageData.messageBody}
                                              </Keywords>
                                            </span>
                                          </>
                                        )}
                                        <div className="d-flex mt-1 justify-content-end">
                                          <div className="star-time-status ml-auto text-end">
                                            <span className="starred-status">
                                              {messageData.isFlag === 1 ? (
                                                <img
                                                  src={StarredMessageIcon}
                                                  alt=""
                                                />
                                              ) : null}
                                            </span>
                                            <span className="direct-chat-sent-time chat-datetime">
                                              {messageData.sentDate.slice(
                                                0,
                                                8,
                                              ) === currentUtcDate ? (
                                                <>
                                                  {/* {moment(
                                                    messageData.sentDate.slice(
                                                      8,
                                                      15,
                                                    ),
                                                    'hhmmss',
                                                  ).format('hh:mm a')} */}
                                                  {newTimeFormaterAsPerUTCTalkTime(
                                                    messageData.sentDate,
                                                  )}
                                                </>
                                              ) : messageData.sentDate.slice(
                                                  0,
                                                  8,
                                                ) === yesterdayDateUtc ? (
                                                <>
                                                  {/* {moment(
                                                    messageData.sentDate.slice(
                                                      0,
                                                      8,
                                                    ),
                                                  ).format('DD-MMM-YYYY')}{' '} */}
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                  ) + ' '}
                                                  | Yesterday
                                                </>
                                              ) : (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                  )}
                                                </>
                                              )}
                                            </span>
                                            <div className="message-status"></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }
                              })
                            ) : (
                              <>
                                {isLoading ? (
                                  <Spin className="talk-overallchat-spinner" />
                                ) : (
                                  <p>No Chat Messages</p>
                                )}
                              </>
                            )}
                            <div ref={chatMessages} />
                          </div>
                        </>

                        {replyFeature === true ? (
                          <div className="chat-feature-action">
                            <p className="feature-name">Replying to</p>
                            <div className="chat-feature">
                              <div className="chat-feature-option">
                                <p className="chat-feature-text">
                                  <span>
                                    {replyData.senderName === currentUserName
                                      ? 'You'
                                      : replyData.senderName}
                                    <br />
                                  </span>
                                  {replyData.messageBody}
                                </p>
                                <div className="positionRelative">
                                  {/* <img
                                    src={MicIcon}
                                    className="chat-feature-image"
                                    alt=""
                                  /> */}
                                </div>
                              </div>
                            </div>
                            <div className="remove-chat-feature">
                              <img
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
                                  {' '}
                                  <div className="chat-modal-Heading">
                                    <h1>Save Messages</h1>
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
                                      Today
                                    </Checkbox>
                                    <Checkbox
                                      checked={allCheckState}
                                      onChange={onChangeAll}
                                    >
                                      All
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
                                      <Col lg={1} md={1} sm={12}></Col>
                                      <Col lg={5} md={5} sm={12}>
                                        <label style={{ marginLeft: '5px' }}>
                                          <b style={{ fontSize: '0.7rem' }}>
                                            {t('Date-from')}
                                          </b>
                                        </label>{' '}
                                        <InputDatePicker
                                          name="StartDate"
                                          size="large"
                                          width="100%"
                                          value={
                                            chatDateState.StartDate
                                              ? DateDisplayFormat(
                                                  chatDateState.StartDate,
                                                )
                                              : null
                                          }
                                          DateRange
                                          placeholder={t('Select-date')}
                                          change={onChangeDate}
                                        />
                                      </Col>
                                      <Col lg={5} md={5} sm={12}>
                                        <label style={{ marginLeft: '5px' }}>
                                          <b style={{ fontSize: '0.7rem' }}>
                                            {t('Date-to')}
                                          </b>
                                        </label>
                                        <InputDatePicker
                                          name="EndDate"
                                          size="large"
                                          width="100%"
                                          value={
                                            chatDateState.EndDate
                                              ? DateDisplayFormat(
                                                  chatDateState.EndDate,
                                                )
                                              : null
                                          }
                                          DateRange
                                          placeholder={'Select Date'}
                                          change={onChangeDate}
                                          disable={endDatedisable}
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
                                    className="MontserratSemiBold Ok-btn"
                                    text="Okay"
                                    onClick={handleCancel}
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
                                  {' '}
                                  <div className="chat-modal-Heading">
                                    <h1>Print Messages</h1>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  {' '}
                                  <div className="chat-options">
                                    <Checkbox
                                      checked={todayCheckState}
                                      onChange={onChangeToday}
                                    >
                                      Today
                                    </Checkbox>
                                    <Checkbox
                                      checked={allCheckState}
                                      onChange={onChangeAll}
                                    >
                                      All
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
                                        <label style={{ marginLeft: '5px' }}>
                                          <b style={{ fontSize: '0.7rem' }}>
                                            Date From
                                          </b>
                                        </label>{' '}
                                        <InputDatePicker
                                          name="StartDate"
                                          size="large"
                                          width="100%"
                                          value={
                                            chatDateState.StartDate
                                              ? DateDisplayFormat(
                                                  chatDateState.StartDate,
                                                )
                                              : null
                                          }
                                          DateRange
                                          placeholder={'Select Date'}
                                          change={onChangeDate}
                                        />
                                      </Col>
                                      <Col lg={6} md={6} sm={12}>
                                        <label style={{ marginLeft: '5px' }}>
                                          <b style={{ fontSize: '0.7rem' }}>
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
                                                  chatDateState.EndDate,
                                                )
                                              : null
                                          }
                                          DateRange
                                          placeholder={'Select Date'}
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
                                    className="MontserratSemiBold Ok-btn"
                                    text="Okay"
                                    onClick={handleCancel}
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
                                  {' '}
                                  <div className="chat-modal-Heading">
                                    <h1>Email Messages</h1>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  {' '}
                                  <div className="chat-options">
                                    <Checkbox
                                      checked={todayCheckState}
                                      onChange={onChangeToday}
                                    >
                                      Today
                                    </Checkbox>
                                    <Checkbox
                                      checked={allCheckState}
                                      onChange={onChangeAll}
                                    >
                                      All
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
                                        <label style={{ marginLeft: '5px' }}>
                                          <b style={{ fontSize: '0.7rem' }}>
                                            Date From
                                          </b>
                                        </label>{' '}
                                        <InputDatePicker
                                          name="StartDate"
                                          size="large"
                                          width="100%"
                                          value={
                                            chatDateState.StartDate
                                              ? DateDisplayFormat(
                                                  chatDateState.StartDate,
                                                )
                                              : null
                                          }
                                          DateRange
                                          placeholder={'Select Date'}
                                          change={onChangeDate}
                                        />
                                      </Col>
                                      <Col lg={6} md={6} sm={12}>
                                        <label style={{ marginLeft: '5px' }}>
                                          <b style={{ fontSize: '0.7rem' }}>
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
                                                  chatDateState.EndDate,
                                                )
                                              : null
                                          }
                                          DateRange
                                          placeholder={'Select Date'}
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
                                    className="MontserratSemiBold Ok-btn"
                                    text="Okay"
                                    onClick={handleCancel}
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
                                    className="MontserratSemiBold Ok-btn"
                                    text="Delete"
                                    onClick={() =>
                                      deleteSingleMessage(deleteMessageData)
                                    }
                                  />
                                </Col>
                                <Col lg={4} md={4} sm={12}>
                                  <Button
                                    className="MontserratSemiBold White-btn"
                                    text="Cancel"
                                    onClick={handleCancel}
                                  />
                                </Col>
                                <Col lg={2} md={2} sm={12}></Col>
                              </Row>
                              {/* <Row>
                                <Col lg={4} md={4} sm={12}></Col>
                                <Col lg={4} md={4} sm={12}>
                                  <Button
                                    className="MontserratSemiBold White-btn"
                                    text="Cancel"
                                    onClick={handleCancel}
                                  />
                                </Col>
                                <Col lg={4} md={4} sm={12}></Col>
                              </Row> */}
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
                            ? 'chat-input-section applyBlur'
                            : 'chat-input-section'
                        }
                      >
                        {showCheckboxes === false ? (
                          <>
                            {tasksAttachments.TasksAttachments.length > 0 ? (
                              <div className="uploaded-file-section">
                                <div className="file-upload">
                                  <Row>
                                    {tasksAttachments.TasksAttachments.length >
                                    0
                                      ? tasksAttachments.TasksAttachments.map(
                                          (data, index) => {
                                            var ext = data.DisplayAttachmentName.split(
                                              '.',
                                            ).pop()

                                            const first = data.DisplayAttachmentName.split(
                                              ' ',
                                            )[0]
                                            return (
                                              <Col
                                                sm={12}
                                                lg={3}
                                                md={3}
                                                className="chat-upload-icon"
                                              >
                                                <img
                                                  src={DocumentIcon}
                                                  className="attachment-icon"
                                                  extension={ext}
                                                />
                                                <p className="chat-upload-text">
                                                  {first}
                                                </p>
                                                <div className="delete-uplaoded-file">
                                                  <img
                                                    src={DeleteUploadIcon}
                                                    className="delete-upload-file"
                                                    onClick={() =>
                                                      deleteFilefromAttachments(
                                                        data,
                                                        index,
                                                      )
                                                    }
                                                    alt=""
                                                  />
                                                </div>
                                              </Col>
                                            )
                                          },
                                        )
                                      : null}
                                  </Row>
                                </div>
                              </div>
                            ) : null}
                            <div className="emoji-click" onClick={emojiClick}>
                              <img src={EmojiIcon} alt="" />
                            </div>
                            {emojiActive === true ? (
                              <Picker
                                data={data}
                                onEmojiSelect={selectedEmoji}
                                disabled={true}
                              />
                            ) : null}
                            <div className="upload-click positionRelative">
                              <span className="custom-upload-input">
                                <img
                                  src={UploadChatIcon}
                                  onClick={showUploadOptions}
                                />
                                {uploadOptions === true ? (
                                  <div className="upload-options">
                                    <CustomUploadChat
                                      change={fileUploadTalk}
                                      onClick={(event) => {
                                        event.target.value = null
                                      }}
                                      className="UploadFileButton"
                                      uploadIcon={UploadContact}
                                    />
                                    <CustomUploadChat
                                      change={fileUploadTalk}
                                      onClick={(event) => {
                                        event.target.value = null
                                      }}
                                      className="UploadFileButton"
                                      uploadIcon={UploadDocument}
                                    />
                                    <CustomUploadChat
                                      change={fileUploadTalk}
                                      onClick={(event) => {
                                        event.target.value = null
                                      }}
                                      className="UploadFileButton"
                                      uploadIcon={UploadSticker}
                                    />
                                    <CustomUploadChat
                                      change={fileUploadTalk}
                                      onClick={(event) => {
                                        event.target.value = null
                                      }}
                                      className="UploadFileButton"
                                      uploadIcon={UploadPicVid}
                                    />
                                  </div>
                                ) : null}
                              </span>
                            </div>
                            <div className="chat-input-field">
                              <Form onSubmit={sendChat}>
                                <Form.Control
                                  value={messageSendData.Body}
                                  className="chat-message-input"
                                  name="ChatMessage"
                                  placeholder={'Type a Message'}
                                  maxLength={200}
                                  onChange={chatMessageHandler}
                                  autoComplete="off"
                                  disabled={
                                    chatClickData.isBlock === 1 ? true : false
                                  }
                                />
                              </Form>
                            </div>
                            <div className="sendChat-click">
                              <img
                                onClick={sendChat}
                                src={ChatSendIcon}
                                alt=""
                              />
                            </div>
                          </>
                        ) : (
                          <Button
                            className="MontserratSemiBold Ok-btn"
                            text="Forward"
                            onClick={() => setForwardMessageUsersSection(true)}
                            disableBtn={
                              messagesChecked.length > 0 ? false : true
                            }
                          />
                        )}
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
                      <span className="text-left heading-info">
                        Message info
                      </span>
                      <span className="text-right ml-auto">
                        <img
                          onClick={handleCancel}
                          src={CloseChatIcon}
                          alt=""
                          width={10}
                        />
                      </span>
                    </div>
                    <div className="message-info-item">
                      <div className="Sent-with-icon">
                        <div className="heading-info status">Sent</div>
                        <img src={SingleTickIcon} alt="" />
                      </div>
                      <div className="time-info">
                        {messageInfoData.sentDate === undefined ? (
                          <p className="m-0">No Date Available</p>
                        ) : (
                          // moment(messageInfoData.sentDate.slice(0, 8)).format(
                          //   'DD-MMM-YYYY',
                          // )
                          newTimeFormaterAsPerUTCTalkDate(
                            messageInfoData.sentDate,
                          )
                        )}
                      </div>
                    </div>
                    <div className="message-info-item">
                      <div className="Sent-with-icon">
                        <div className="heading-info status">Delivered</div>
                        <img src={DoubleTickDeliveredIcon} alt="" />
                      </div>
                      <div className="time-info">
                        {messageInfoData.receivedDate === undefined ? (
                          <p className="m-0">No Date Available</p>
                        ) : (
                          // moment(
                          //   messageInfoData.receivedDate.slice(0, 8),
                          // ).format('DD-MMM-YYYY')
                          newTimeFormaterAsPerUTCTalkDate(
                            messageInfoData.receivedDate,
                          )
                        )}
                      </div>
                    </div>
                    <div className="message-info-item">
                      <div className="Sent-with-icon">
                        <div className="heading-info status">Read</div>
                        <img src={DoubleTickIcon} alt="" />
                      </div>
                      <div className="time-info">
                        {messageInfoData.seenDate === undefined ? (
                          <p className="m-0">No Date Available</p>
                        ) : (
                          // moment(messageInfoData.seenDate.slice(0, 8)).format(
                          //   'DD-MMM-YYYY',
                          // )
                          newTimeFormaterAsPerUTCTalkDate(
                            messageInfoData.seenDate,
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
                        onClick={cancelForwardSection}
                        src={CloseChatIcon}
                        width={10}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      style={{ marginTop: '-22px', marginBottom: '10px' }}
                    >
                      <TextField
                        maxLength={200}
                        applyClass="form-control2"
                        name="Name"
                        change={(e) => {
                          searchChat(e.target.value)
                        }}
                        value={searchChatValue}
                        placeholder="Search Users"
                      />
                    </Col>
                  </Row>
                  <div className="users-list-forward">
                    {allUsersGroupsRooms !== undefined &&
                    allUsersGroupsRooms !== null &&
                    allUsersGroupsRooms.length > 0
                      ? allUsersGroupsRooms.map((dataItem, index) => {
                          return (
                            <Row style={{ alignItems: 'center' }}>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                style={{ paddingTop: '5px' }}
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
                                      index,
                                    )
                                  }
                                  className=""
                                />
                              </Col>
                              <Col lg={10} md={10} sm={10}>
                                <div className="users-forward">
                                  <div className="chat-profile-icon forward">
                                    {dataItem.messageType === 'O' ? (
                                      <>
                                        <img src={SingleIcon} width={15} />
                                      </>
                                    ) : dataItem.messageType === 'G' ? (
                                      <>
                                        <img src={GroupIcon} width={15} />
                                      </>
                                    ) : dataItem.messageType === 'B' ? (
                                      <>
                                        <img src={ShoutIcon} width={15} />
                                      </>
                                    ) : (
                                      <img src={SingleIcon} width={15} />
                                    )}
                                  </div>
                                  <p className=" m-0">{dataItem.name}</p>
                                </div>
                              </Col>
                            </Row>
                          )
                        })
                      : null}
                  </div>
                  <Row>
                    <Col className="text-center">
                      <Button
                        className="MontserratSemiBold Ok-btn forward-user"
                        text="Forward"
                        onClick={submitForwardMessages}
                        disableBtn={
                          forwardUsersChecked.length > 0 ? false : true
                        }
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
                        <img src={GroupIcon} width={28} />
                      </div>
                    </Col>
                    <Col lg={4} md={4} sm={12} className="text-end">
                      <img
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
                        {groupInfoData === undefined ||
                        groupInfoData.length === 0
                          ? ''
                          : groupInfoData[0].name}
                      </p>
                      <p className="groupinfo-createdon m-0">
                        Created on:{' '}
                        {groupInfoData === undefined ||
                        groupInfoData.length === 0
                          ? ''
                          : // moment(
                            //     groupInfoData[0].createdOn,
                            //     'YYYYMMDDkkmmss',
                            //   ).format('h:mm A, Do MMM, YYYY')}
                            newTimeFormaterAsPerUTCTalkDateTime(
                              messageInfoData.seenDate,
                            )}
                      </p>
                    </Col>
                    <Col lg={2} md={2} sm={12} className="text-end"></Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      style={{ marginTop: '-22px', marginBottom: '5px' }}
                    >
                      <TextField
                        maxLength={200}
                        applyClass="form-control2"
                        name="Name"
                        change={(e) => {
                          searchGroupInfoUser(e.target.value)
                        }}
                        value={searchGroupUserInfoValue}
                        placeholder="Search Users"
                      />
                    </Col>
                  </Row>
                  <div className="users-list-groupinfo">
                    {groupInfoData !== undefined &&
                    groupInfoData !== null &&
                    groupInfoData.length > 0
                      ? groupInfoData.map((dataItem, index) => {
                          return (
                            <Row style={{ alignItems: 'center' }}>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                style={{ paddingRight: '20px' }}
                              >
                                <div className="users-groupinfo">
                                  <div className="chat-profile-icon groupinfo">
                                    <img src={SingleIcon} width={15} />
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
                          )
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
                        <img src={GroupIcon} width={28} />
                      </div>
                    </Col>
                    <Col lg={4} md={4} sm={12} className="text-end">
                      <img
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
                          {groupInfoData !== undefined
                            ? groupInfoData[0].name
                            : null}
                        </p>
                        <img
                          onClick={editGroupTitle}
                          className="Edit-Group-Title-Icon"
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
                          // value={messageSendData.Body}
                          className="chat-message-input"
                          name="ChatMessage"
                          placeholder={groupInfoData[0].name}
                          maxLength={200}
                          onChange={chatMessageHandler}
                          autoComplete="off"
                        />
                      </Col>
                    )}
                    <Col lg={2} md={2} sm={12} className="text-end"></Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      style={{ marginTop: '-22px', marginBottom: '5px' }}
                    >
                      <TextField
                        maxLength={200}
                        applyClass="form-control2"
                        name="Name"
                        change={(e) => {
                          searchGroupInfoUser(e.target.value)
                        }}
                        value={searchGroupUserInfoValue}
                        placeholder="Search Users"
                      />
                    </Col>
                  </Row>
                  <div className="users-list-groupinfo">
                    {allUsers !== undefined &&
                    allUsers !== null &&
                    allUsers.length > 0
                      ? allUsers.map((dataItem, index) => {
                          return (
                            <Row style={{ alignItems: 'center' }}>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                style={{ paddingRight: '20px' }}
                              >
                                <div className="users-groupinfo">
                                  <Checkbox
                                    checked={
                                      Array.isArray(editGroupUsersChecked) &&
                                      (editGroupUsersChecked.some(
                                        (item) => item === dataItem.id,
                                      ) ||
                                        (Array.isArray(groupInfoData) &&
                                          groupInfoData.some(
                                            (item) =>
                                              item.userID === dataItem.id,
                                          )))
                                    }
                                    onChange={() =>
                                      editGroupUsersCheckedHandler(
                                        dataItem,
                                        dataItem.id,
                                        index,
                                      )
                                    }
                                    className="group-edit-users-add"
                                  />
                                  <div className="chat-profile-icon groupinfo">
                                    <img src={SingleIcon} width={15} />
                                  </div>
                                  <p className="groupinfo-groupusersname m-0">
                                    {dataItem.fullName}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                          )
                        })
                      : null}
                  </div>
                </>
              ) : null}
            </Container>
          </div>
        ) : null}
      </div>

      <NotificationBar
        iconName={<img src={SecurityIcon} />}
        notificationMessage={notification.message}
        notificationState={notification.notificationShow}
        setNotification={setNotification}
        handleClose={closeNotification}
        id={notificationID}
      />
    </>
  )
}

export default TalkChat
