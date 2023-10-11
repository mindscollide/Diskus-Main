import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import moment from 'moment'
import { Row, Col, Container, Form } from 'react-bootstrap'
import Keywords from 'react-keywords'
import { Checkbox } from 'antd'
import { Spin } from 'antd'
import {
  oneToOneMessages,
  groupMessages,
  unreadMessageCountFunction,
  groupCreationFunction,
  markStarUnstarFunction,
  groupUpdationFunction,
} from '../../functions/oneToOneMessage'
import {
  GetAllUsers,
  InsertOTOMessages,
  DeleteSingleMessage,
  GetAllUsersGroupsRoomsList,
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
  DeleteShout,
  UpdateShoutAll,
  OtoMessageRetryFlag,
  DownloadChat,
  EmailChat,
  pushChatData,
  activeMessage,
  downloadChatEmptyObject,
  DeleteMultipleMessages,
  activeChat,
} from '../../../../../../store/actions/Talk_action'
import {
  normalizeVideoPanelFlag,
  videoChatPanel,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  leaveCallModal,
  participantPopup,
  videoChatMessagesFlag,
} from '../../../../../../store/actions/VideoFeature_actions'
import {
  GetAllVideoCallUsers,
  InitiateVideoCall,
  getVideoRecipentData,
  groupCallRecipients,
  callRequestReceivedMQTT,
  LeaveCall,
} from '../../../../../../store/actions/VideoMain_actions'
import { resetCloseChatFlags } from '../../../../../../store/actions/Talk_Feature_actions'
import {
  newTimeFormaterAsPerUTCTalkTime,
  newTimeFormaterAsPerUTCTalkDate,
  newTimeFormaterAsPerUTCTalkDateTime,
} from '../../../../../../commen/functions/date_formater'
import {
  DateDisplayFormat,
  DateSendingFormat,
} from '../../../../../../commen/functions/date_formater'
import {
  TextField,
  InputDatePicker,
  Button,
  NotificationBar,
} from '../../../../../elements'
import SecurityIcon from '../../../../../../assets/images/Security-Icon.png'
import DoubleTickIcon from '../../../../../../assets/images/DoubleTick-Icon.png'
import DoubleTickDeliveredIcon from '../../../../../../assets/images/DoubleTickDelivered-Icon.png'
import SingleTickIcon from '../../../../../../assets/images/SingleTick-Icon.png'
import TimerIcon from '../../../../../../assets/images/Timer-Icon.png'
import CrossIcon from '../../../../../../assets/images/Cross-Icon.png'
import SecurityIconMessasgeBox from '../../../../../../assets/images/SecurityIcon-MessasgeBox.png'
import MenuIcon from '../../../../../../assets/images/Menu-Chat-Icon.png'
import VideoCallIcon from '../../../../../../assets/images/VideoCall-Icon.png'
import CloseChatIcon from '../../../../../../assets/images/Cross-Chat-Icon.png'
import SearchChatIcon from '../../../../../../assets/images/Search-Chat-Icon.png'
import EmojiIcon from '../../../../../../assets/images/Emoji-Select-Icon.png'
import UploadChatIcon from '../../../../../../assets/images/Upload-Chat-Icon.png'
import DeleteUploadIcon from '../../../../../../assets/images/Delete-Upload-Icon.png'
import DeleteChatFeature from '../../../../../../assets/images/Delete-ChatFeature-Icon.png'
import ChatSendIcon from '../../../../../../assets/images/Chat-Send-Icon.png'
import DownloadIcon from '../../../../../../assets/images/Download-Icon.png'
import DocumentIcon from '../../../../../../assets/images/Document-Icon.png'
import DropDownIcon from '../../../../../../assets/images/dropdown-icon.png'
import DropDownChatIcon from '../../../../../../assets/images/dropdown-icon-chatmessage.png'
import UploadContact from '../../../../../../assets/images/Upload-Contact.png'
import UploadDocument from '../../../../../../assets/images/Upload-Document.png'
import UploadPicVid from '../../../../../../assets/images/Upload-PicVid.png'
import UploadSticker from '../../../../../../assets/images/Upload-Sticker.png'
import SingleIcon from '../../../../../../assets/images/Single-Icon.png'
import GroupIcon from '../../../../../../assets/images/Group-Icon.png'
import ShoutIcon from '../../../../../../assets/images/Shout-Icon.png'
import StarredMessageIcon from '../../../../../../assets/images/Starred-Message-Icon.png'
import EditIcon from '../../../../../../assets/images/Edit-Icon.png'
import { useTranslation } from 'react-i18next'
import { filesUrlTalk } from '../../../../../../commen/apis/Api_ends_points'
import enUS from 'antd/es/date-picker/locale/en_US'

const ChatMainBody = ({ chatMessageClass }) => {
  //Use Navigate
  const navigate = useNavigate()

  //Current User ID
  let currentUserId = localStorage.getItem('userID')

  //Current Organization
  let currentOrganizationId = localStorage.getItem('organizationID')

  //Current UserName
  let currentUserName = localStorage.getItem('name')

  //active call status
  let activeCall = JSON.parse(localStorage.getItem('activeCall'))

  let activeChatType = localStorage.getItem('ActiveChatType')

  //Translation
  const { t } = useTranslation()

  //Current language
  let lang = localStorage.getItem('i18nextLng')

  // Using dispatch To Call APIs
  const dispatch = useDispatch()

  //Getting api result from the reducer
  const { talkFeatureStates, talkStateData } = useSelector((state) => state)

  //Current Date Time in variable
  var currentDateToday = moment().format('YYYYMMDD')

  const date = new Date()

  //CURRENT DATE TIME UTC
  let currentDateTime = new Date()
  let changeDateFormatCurrent = moment(currentDateTime).utc()
  let currentDateTimeUtc = moment(changeDateFormatCurrent).format(
    'YYYYMMDDHHmmss',
  )

  let currentUtcDate = currentDateTimeUtc.slice(0, 8)

  //YESTERDAY'S DATE
  let yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1) // Subtract 1 day
  let changeDateFormatYesterday = moment(yesterdayDate).utc()
  let yesterdayDateUtc = moment(changeDateFormatYesterday).format('YYYYMMDD')

  function generateGUID() {
    const alphanumericChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const randomChars = Array.from(
      { length: 14 },
      () =>
        alphanumericChars[Math.floor(Math.random() * alphanumericChars.length)],
    )
    const currentDate = new Date()
    const currentUTCDateTime = currentDate.toISOString().replace(/[-:.TZ]/g, '')

    return `${randomChars.join('')}_${currentUTCDateTime}_${currentUserId}_${
      talkStateData.ActiveChatData.id
    }`
  }

  const [chatOpen, setChatOpen] = useState(false)

  //Generate Unique ID
  const [guID, setGUID] = useState('')

  //Scroll down state
  const chatMessages = useRef()

  //Chat Message Feature
  const chatMessageRefs = useRef(0)

  //Input refs
  const inputRef = useRef(null)

  //search chat states
  const [searchChatValue, setSearchChatValue] = useState('')
  const [allChatData, setAllChatData] = useState([])

  //File Thumbnail States
  const [file, setFile] = useState('')

  console.log('file', file)

  //Input Chat Autofocus state
  const [inputChat, setInputChat] = useState(true)

  //search group user states
  const [searchGroupUserValue, setSearchGroupUserValue] = useState('')

  //search shout all user states
  const [searchShoutAllUserValue, setSearchShoutAllUserValue] = useState('')

  //Loading State
  const [isLoading, setIsLoading] = useState(true)

  //File Upload
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  })
  const uploadFileRef = useRef()

  //Show Emoji or Not
  const [emojiActive, setEmojiActive] = useState(false)
  const emojiMenuRef = useRef()

  //Add User Chat States
  const [addNewChat, setAddNewChat] = useState(false)

  //Create Group States
  const [activeCreateGroup, setActiveCreateGroup] = useState(false)

  //Create Shout All
  const [activeCreateShoutAll, setActiveCreateShoutAll] = useState(false)

  //Global Search Filter
  const [globalSearchFilter, setGlobalSearchFilter] = useState(false)

  //Dropdown state of chat menu (Dot wali)
  const [chatMenuActive, setChatMenuActive] = useState(false)
  const chatMenuRef = useRef(null)

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
  const [showShoutEdit, setShowShoutEdit] = useState(false)

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
  const [chatFeatureActive, setChatFeatureActive] = useState(0)

  //Reply Option
  const [replyFeature, setReplyFeature] = useState(false)

  //Blocked Users State
  const [blockedUsersData, setBlockedUsersData] = useState([])

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

  //All Messages State
  const [allMessages, setAllMessages] = useState([])

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

  //Shout Name State for Creation/Modification
  const [shoutNameValue, setShoutNameValue] = useState('')

  //forward users checked
  const [forwardUsersChecked, setForwardUsersChecked] = useState([])

  //forward message user list section
  const [forwardMessageUsersSection, setForwardMessageUsersSection] = useState(
    false,
  )

  //group edit users state
  const [editGroupUsersChecked, setEditGroupUsersChecked] = useState([])

  //Shout Users Check Uncheck
  const [editShoutUsersChecked, setEditShoutUsersChecked] = useState([])

  //Forward MEssages Flag
  const [forwardFlag, setForwardFlag] = useState(false)

  //Delete MEssages Flag
  const [deleteFlag, setDeleteFlag] = useState(false)

  //Message info data
  const [messageInfoData, setMessageInfoData] = useState({
    sentDate: '',
    receivedDate: '',
    seenDate: '',
  })

  //Message Insert Data
  const [messageSendData, setMessageSendData] = useState({
    SenderID:
      currentUserId != null && currentUserId != undefined
        ? currentUserId.toString()
        : '',
    ReceiverID: '0',
    Body: '',
    MessageActivity: 'Direct Message',
    FileName: '',
    FileGeneratedName: '',
    Extension: '',
    AttachmentLocation: '',
    UID: '',
    MessageID: 0,
  })

  //Current Group Members State
  const [groupInfoData, setGroupInfoData] = useState([])

  //Current Broadcast Members State
  const [shoutAllUsersData, setShoutAllUsersData] = useState([])

  //Saving Group Name in a state so that it can be used for various functionalities
  const [groupName, setGroupName] = useState('')

  //Saving Shout Name in a state so that it can be used for various functionalities
  const [shoutName, setShoutName] = useState('')

  const [searchGroupUserInfoValue, setSearchGroupUserInfoValue] = useState('')

  const [searchUserShoutValue, setSearchUserShoutValue] = useState('')

  //message click data
  const [messageClickData, setMessageClickData] = useState([])

  //Unread Message Count State MQTT
  const [mqttUnreadMessageData, setMqttUnreadMessageData] = useState([])

  const [showEditGroupField, setShowEditGroupField] = useState(false)

  const [showEditShoutField, setShowEditShoutField] = useState(false)

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

  const closeNotification = () => {
    setNotification({
      notificationShow: false,
      message: '',
    })
  }

  const autoResize = (event) => {
    const textarea = event.target
    textarea.style.height = 'auto' // Reset the height to auto to calculate the new height
    textarea.style.height = `${textarea.scrollHeight}px` // Set the height to fit the content

    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10)
    const maxHeight = lineHeight * 4 // Limit the input to 4 lines
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.overflowY = 'scroll' // Enable vertical scrolling
      textarea.style.height = `${maxHeight}px` // Set the fixed height
    } else {
      textarea.style.overflowY = 'hidden' // Disable vertical scrolling
    }
  }

  //Calling API
  useEffect(() => {
    if (talkStateData.ActiveChatData.messageType === 'G') {
      let Data = {
        GroupID: talkStateData.ActiveChatData.id,
        ChannelID: parseInt(currentOrganizationId),
      }
      dispatch(GetAllPrivateGroupMembers(navigate, Data, t))
    }
  }, [])

  useEffect(() => {
    try {
      setMessageSendData({
        ...messageSendData,
        ReceiverID: talkStateData.ActiveChatData.id.toString(),
      })
    } catch {}
  }, [talkStateData.ActiveChatData])

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
      talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
        .length !== 0
    ) {
      setGroupInfoData(
        talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
          ?.groupUsers,
      )
      const firstGroupUser =
        talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
          ?.groupUsers[0]

      if (firstGroupUser && firstGroupUser.name) {
        setGroupName(firstGroupUser.name)
      }
    }
  }, [
    talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
      ?.groupUsers,
  ])

  //All shout members data
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
          ?.broadcastUsers,
      )
      const firstShoutUser =
        talkStateData?.ActiveUsersByBroadcastID?.ActiveUsersByBroadcastIDData
          ?.broadcastUsers[0]

      if (firstShoutUser && firstShoutUser.name) {
        setShoutName(firstShoutUser.name)
      }
    }
  }, [
    talkStateData?.ActiveUsersByBroadcastID?.ActiveUsersByBroadcastIDData
      ?.broadcastUsers,
  ])

  //Group Name Change Handler
  const groupNameHandler = (e) => {
    setGroupName(e.target.value)
  }

  //Shout Name Change Handler
  const shoutNameHandler = (e) => {
    setShoutName(e.target.value)
  }

  //Setting state data of all users
  useEffect(() => {
    if (
      talkStateData.AllUsers.AllUsersData !== undefined &&
      talkStateData.AllUsers.AllUsersData !== null &&
      talkStateData.AllUsers.AllUsersData.length !== 0
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

  //Auto store in state
  // Broadcast EDIT IDHAR HOGA
  useEffect(() => {
    let shoutMembersData =
      talkStateData.ActiveUsersByBroadcastID.ActiveUsersByBroadcastIDData
        .broadcastUsers
    let allUsers = talkStateData.AllUsers.AllUsersData.allUsers
    if (
      shoutMembersData !== undefined &&
      shoutMembersData !== null &&
      allUsers !== undefined &&
      allUsers !== null
    ) {
      let groupMembersArray = shoutMembersData
        .filter((item) => {
          return allUsers.some((user) => user.id === item.userID)
        })
        .map((item) => item.userID)

      setEditShoutUsersChecked(groupMembersArray)
    }
  }, [
    talkStateData.ActiveUsersByBroadcastID.ActiveUsersByBroadcastIDData
      .broadcastUsers,
  ])

  //All users groups rooms
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
          .userInformation,
      )
    }
  }, [
    talkStateData?.AllUsersGroupsRoomsList?.AllUsersGroupsRoomsListData
      ?.userInformation,
  ])

  //Emoji on click function
  const emojiClick = () => {
    if (emojiActive === false) {
      setEmojiActive(true)
    } else {
      setEmojiActive(false)
    }
  }

  const [uploadFileTalk, setUploadFileTalk] = useState({})

  console.log('Task Attachments', tasksAttachments)

  const handleFileUpload = (data, uploadType) => {
    // Your common logic for file upload

    // Different logic for the specific upload type
    if (uploadType === 'document') {
      // Handle document upload
      console.log('function fileUploadTalk')
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
      file.push({
        DisplayAttachmentName: uploadedFile.name,
        OriginalAttachmentName: uploadFilePath,
      })
      setTasksAttachments({ ['TasksAttachments']: file })
      setUploadOptions(false)
      setUploadFileTalk(uploadedFile)
    } else if (uploadType === 'image') {
      // Handle image upload
      console.log('function fileUploadTalkImage')
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
      // file.push({
      //   DisplayAttachmentName: uploadedFile.name,
      //   OriginalAttachmentName: uploadFilePath,
      // })
      setFile(URL.createObjectURL(data.target.files[0]))
      // setTasksAttachments({ ['TasksAttachments']: file })
      setUploadOptions(false)
      setUploadFileTalk(uploadedFile)
    }
  }

  const deleteFilefromAttachments = (data, index) => {
    let searchIndex = tasksAttachments.TasksAttachments
    searchIndex.splice(index, 1)
    setTasksAttachments({
      ...tasksAttachments,
      ['TasksAttachments']: searchIndex,
    })
    setUploadFileTalk({})
  }

  const closeChat = () => {
    dispatch(videoChatMessagesFlag(false))
    dispatch(resetCloseChatFlags())
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
    setShowEditShoutField(false)
    setEmojiActive(false)
    setAddNewChat(false)
    setActiveCreateGroup(false)
    setActiveCreateShoutAll(false)
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
    setDeleteFlag(false)
    setForwardFlag(false)
    setEndDatedisable(false)
    setDeleteChat(false)
    setUploadOptions(false)
    setChatFeatureActive(0)
    setReplyFeature(false)
    setShowChatSearch(false)
    setAllMessages([])
    setMessageSendData({
      ...messageSendData,
      Body: '',
    })
    localStorage.setItem('activeChatID', null)
    localStorage.setItem('activeOtoChatID', 0)
  }

  //Search Chats
  const searchChat = (e) => {
    setSearchChatValue(e)
    try {
      if (
        talkStateData.AllUserChats.AllUserChatsData !== undefined &&
        talkStateData.AllUserChats.AllUserChatsData !== null &&
        talkStateData.AllUserChats.AllUserChatsData.length !== 0
      ) {
        if (e !== '') {
          let filteredData = talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
            (value) => {
              return value.fullName.toLowerCase().includes(e.toLowerCase())
            },
          )

          if (filteredData.length === 0) {
            setAllChatData(
              talkStateData.AllUserChats.AllUserChatsData.allMessages,
            )
          } else {
            setAllChatData(filteredData)
          }
        } else if (e === '' || e === null) {
          let data = talkStateData.AllUserChats.AllUserChatsData.allMessages
          setSearchChatValue('')
          setAllChatData(data)
        }
      }
    } catch {}
  }

  //Managing that state, if show or hide
  const activateChatMenu = () => {
    setChatMenuActive(!chatMenuActive)
  }

  // for save chat
  const modalHandlerSave = async (data) => {
    console.log('modalHandlerSave', data)
    setSave(true)
    setPrint(false)
    setEmail(false)
    setDeleteMessage(false)
    setMessageInfo(false)
    setShowGroupInfo(false)
    setChatMenuActive(false)
    setChatDateState({
      ...chatDateState,
      StartDate: '',
      EndDate: '',
    })
  }

  // for print chat
  const modalHandlerPrint = async (e) => {
    setSave(false)
    setPrint(true)
    setEmail(false)
    setDeleteMessage(false)
    setMessageInfo(false)
    setShowGroupInfo(false)
    setChatMenuActive(false)
    setChatDateState({
      ...chatDateState,
      StartDate: '',
      EndDate: '',
    })
  }

  // for email chat
  const modalHandlerEmail = async (e) => {
    setSave(false)
    setPrint(false)
    setEmail(true)
    setDeleteMessage(false)
    setMessageInfo(false)
    setShowGroupInfo(false)
    setChatMenuActive(false)
    setChatDateState({
      ...chatDateState,
      StartDate: '',
      EndDate: '',
    })
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

  console.log(
    'todayCheckState',
    todayCheckState,
    allCheckState,
    customCheckState,
  )

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
              ? '19700101'
              : todayCheckState === false &&
                allCheckState === false &&
                customCheckState === true
              ? chatDateState.StartDate
              : '',
          ToDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                allCheckState === true &&
                customCheckState === false
              ? '20991231'
              : todayCheckState === false &&
                allCheckState === false &&
                customCheckState === true
              ? chatDateState.EndDate
              : '',
          IsEmail: false,
        },
      },
    }
    dispatch(DownloadChat(Data, t, navigate))
    console.log('downloadChat', Data)
    setSave(false)
    setTodayCheckState(false)
    setAllCheckState(false)
    setCustomCheckState(false)
  }

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
              ? '19700101'
              : todayCheckState === false &&
                allCheckState === false &&
                customCheckState === true
              ? chatDateState.StartDate
              : '',
          ToDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                allCheckState === true &&
                customCheckState === false
              ? '20991231'
              : todayCheckState === false &&
                allCheckState === false &&
                customCheckState === true
              ? chatDateState.EndDate
              : '',
          IsEmail: false,
        },
      },
    }
    dispatch(DownloadChat(Data, t, navigate))
    console.log('downloadChat', Data)
    setPrint(false)
    setTodayCheckState(false)
    setAllCheckState(false)
    setCustomCheckState(false)
  }

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
              ? '19700101'
              : todayCheckState === false &&
                allCheckState === false &&
                customCheckState === true
              ? chatDateState.StartDate
              : '',
          ToDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                allCheckState === true &&
                customCheckState === false
              ? '20991231'
              : todayCheckState === false &&
                allCheckState === false &&
                customCheckState === true
              ? chatDateState.EndDate
              : '',
          IsEmail: true,
        },
      },
    }
    dispatch(EmailChat(Data, t, navigate))
    console.log('downloadChat', Data)
    setEmail(false)
    setTodayCheckState(false)
    setAllCheckState(false)
    setCustomCheckState(false)
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
    setShowEditShoutField(false)
    setEmojiActive(false)
    setAddNewChat(false)
    setActiveCreateGroup(false)
    setActiveCreateShoutAll(false)
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
    setDeleteFlag(false)
    setForwardFlag(false)
    setEndDatedisable(false)
    setDeleteChat(false)
    setUploadOptions(false)
    setChatFeatureActive(0)
    setReplyFeature(false)
    setShowChatSearch(false)
    setForwardUsersChecked([])
    setMessagesChecked([])
    setGroupNameValue('')
    setShoutNameValue('')
    setSearchGroupUserValue('')
    setSearchShoutAllUserValue('')
    setGroupUsersChecked([])
    setShowShoutEdit(false)
    localStorage.setItem('activeChatID', null)
  }

  const cancelForwardSection = () => {
    setForwardMessageUsersSection(false)
    setShowCheckboxes(false)
    setDeleteFlag(false)
    setForwardFlag(false)
    setForwardUsersChecked([])
    setGroupUsersChecked([])
    setMessagesChecked([])
  }

  //Edit Group Title Activator
  const editGroupTitle = () => {
    setShowEditGroupField(true)
  }

  //Edit Shout Title Activator
  const editShoutTitle = () => {
    setShowEditShoutField(true)
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
    console.log('Custom Dates', chatDateState.StartDate, chatDateState.EndDate)
  }

  //Show upload options or Hide
  const showUploadOptions = () => {
    console.log('Upload Option Clicked')
    if (uploadOptions === false && talkStateData.ActiveChatData.isBlock === 0) {
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

  //Selected Emoji
  const [emojiSelected, setEmojiSelected] = useState(false)

  //Response return on click of emoji
  const selectedEmoji = (e) => {
    let sym = e.unified.split('-')
    let codesArray = []
    sym.forEach((el) => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)
    if (talkStateData.ActiveChatData.isBlock === 0) {
      setMessageSendData({
        ...messageSendData,
        Body: messageSendData.Body + emoji,
      })
      setInputChat(true)
    }
    setEmojiSelected(true)
    setEmojiActive(false)
    setInputChat(true)
  }

  //Selected Option of the chat
  const chatFeatureSelected = (record, id) => {
    dispatch(activeMessage(record))
    console.log('chatFeatureSelected', record, id)
    if (chatFeatureActive === id) {
      setChatFeatureActive(0)
    } else {
      setChatFeatureActive(id)
    }
  }
  console.log('chatFeatureSelected', chatFeatureActive)

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
          talkStateData.ActiveChatData.messageType +
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
      setForwardFlag(true)
    } else {
      setShowCheckboxes(false)
      setForwardFlag(false)
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
      MessageType: talkStateData.ActiveChatData.messageType,
      IsFlag: record.isFlag === 0 ? true : false,
    }
    dispatch(MarkStarredUnstarredMessage(navigate, Data, t))
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
      let findIndexgroupInfoData = groupInfoData.findIndex(
        (data3, index) => data3.userID === id,
      )
      if (findIndexgroupInfoData !== -1) {
        groupInfoData.splice(findIndexgroupInfoData, 1)
        setGroupInfoData([...groupInfoData])
      }
      if (editGroupUserIndex !== -1) {
        editGroupUsersChecked.splice(editGroupUserIndex, 1)
        setEditGroupUsersChecked([...editGroupUsersChecked])
      }
    } else {
      setEditGroupUsersChecked([...editGroupUsersChecked, id])
    }
  }

  //on change groups users
  const editShoutUsersCheckedHandler = (data, id, index) => {
    if (editShoutUsersChecked.includes(id)) {
      let editGroupUserIndex = editShoutUsersChecked.findIndex(
        (data2) => data2 === id,
      )
      let findIndexShoutInfoData = shoutAllUsersData.findIndex(
        (data3, index) => data3.userID === id,
      )
      if (findIndexShoutInfoData !== -1) {
        shoutAllUsersData.splice(findIndexShoutInfoData, 1)
        setGroupInfoData([...shoutAllUsersData])
      }
      if (editGroupUserIndex !== -1) {
        editShoutUsersChecked.splice(editGroupUserIndex, 1)
        setEditShoutUsersChecked([...editShoutUsersChecked])
      }
    } else {
      setEditShoutUsersChecked([...editShoutUsersChecked, id])
    }
  }

  const deleteSingleMessage = (record) => {
    let Data = {
      UserID: parseInt(currentUserId),
      MessageType: talkStateData.ActiveChatData.messageType,
      MessageIds: record.messageID,
    }
    dispatch(DeleteSingleMessage(navigate, Data, t))
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
          UID: uniqueId,
          MessageID: 0,
        },
      },
    }
  }

  const submitForwardMessages = () => {
    setForwardMessageUsersSection(false)
    setShowCheckboxes(false)
    setForwardFlag(false)
    forwardUsersChecked?.map((user) => {
      let { id, type } = user
      console.log('Forward Messages', id, type, user)
      if (type == 'U') {
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
        )
      } else if (type == 'B') {
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
        )
      } else if (type == 'G') {
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
        )
      }
    })
    setForwardUsersChecked([])
  }

  const modalHandlerGroupInfo = () => {
    setShowGroupInfo(true)
    setMessageInfo(false)
    setShowGroupEdit(false)
    setChatMenuActive(false)
  }

  const deleteMultipleMessages = () => {
    setShowCheckboxes(true)
    setDeleteFlag(true)
    setChatMenuActive(false)
  }

  const deleteMultipleMessagesButton = () => {
    const messageIDs = messagesChecked.map((obj) => obj.messageID)
    const messageDeleteIDs = messageIDs.join('$')
    console.log('Messages Checked For Deletion', messageDeleteIDs)
    let Data = {
      TalkRequest: {
        UserID: Number(currentUserId),
        Message: {
          MessageType: 'G',
          MessageIds: messageDeleteIDs,
        },
      },
    }
    dispatch(DeleteMultipleMessages(Data, t, navigate))
    const filteredMessages = allMessages.filter((message1) => {
      return !messagesChecked.some(
        (message2) => message2.messageID === message1.messageID,
      )
    })

    setAllMessages(filteredMessages)

    setNotification({
      notificationShow: true,
      message: 'Messages Deleted',
    })
    setNotificationID(id)

    setDeleteFlag(false)
    setShowCheckboxes(false)
    console.log('Messages Checked For Deletion', Data)
  }

  const modalHandlerGroupEdit = () => {
    let Data = {
      GroupID: talkStateData.ActiveChatData.id,
      ChannelID: currentOrganizationId,
    }
    dispatch(GetAllPrivateGroupMembers(navigate, Data, t))
    setShowGroupEdit(true)
    setShowGroupInfo(false)
    setMessageInfo(false)
    setChatMenuActive(false)
  }

  //Search Group Chat
  const searchGroupEditUser = (e) => {
    setSearchGroupUserInfoValue(e)
    try {
      if (
        talkStateData.AllUsers.AllUsersData !== undefined &&
        (talkStateData.AllUsers.AllUsersData !== null) &
          (talkStateData.AllUsers.AllUsersData.length !== 0)
      ) {
        if (e !== '') {
          let filteredData = talkStateData.AllUsers.AllUsersData.allUsers.filter(
            (value) => {
              return value.fullName.toLowerCase().includes(e.toLowerCase())
            },
          )
          if (filteredData.length === 0) {
            setAllUsers(talkStateData.AllUsers.AllUsersData.allUsers)
          } else {
            setAllUsers(filteredData)
          }
        } else if (e === '' || e === null) {
          let data = talkStateData.AllUsers.AllUsersData.allUsers
          setSearchGroupUserInfoValue('')
          setAllUsers(data)
        }
      }
    } catch {}
  }

  //Search Shout Chat
  const searchShoutEditUser = (e) => {
    setSearchUserShoutValue(e)
    try {
      if (
        talkStateData.AllUsers.AllUsersData !== undefined &&
        (talkStateData.AllUsers.AllUsersData !== null) &
          (talkStateData.AllUsers.AllUsersData.length !== 0)
      ) {
        if (e !== '') {
          let filteredData = talkStateData.AllUsers.AllUsersData.allUsers.filter(
            (value) => {
              return value.fullName.toLowerCase().includes(e.toLowerCase())
            },
          )
          if (filteredData.length === 0) {
            setAllUsers(talkStateData.AllUsers.AllUsersData.allUsers)
          } else {
            setAllUsers(filteredData)
          }
        } else if (e === '' || e === null) {
          let data = talkStateData.AllUsers.AllUsersData.allUsers
          setSearchUserShoutValue('')
          setAllUsers(data)
        }
      }
    } catch {}
  }

  //Search Group Chat
  const searchGroupInfoUser = (e) => {
    setSearchGroupUserInfoValue(e)
    try {
      if (
        talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse !==
          undefined &&
        talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse !==
          null &&
        talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
          .length !== 0
      ) {
        if (e !== '') {
          let filteredData = talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse.groupUsers.filter(
            (value) => {
              return value.userName
                .toLowerCase()
                .includes(searchGroupUserInfoValue.toLowerCase())
            },
          )
          if (filteredData.length === 0) {
            setGroupInfoData(
              talkStateData.GetPrivateGroupMembers
                .GetPrivateGroupMembersResponse.groupUsers,
            )
          } else {
            setGroupInfoData(filteredData)
          }
        } else if (e === '' || e === null) {
          let data =
            talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
              .groupUsers
          setSearchGroupUserInfoValue('')
          setGroupInfoData(data)
        }
      }
    } catch {}
  }

  const deleteShoutFunction = () => {
    let Data = {
      TalkRequest: {
        UserID: parseInt(currentUserId),
        ChannelID: parseInt(currentOrganizationId),
        Group: {
          GroupID: talkStateData.ActiveChatData.id,
        },
      },
    }
    dispatch(DeleteShout(navigate, Data, t))
    setChatMenuActive(false)
  }

  const editShoutFunction = () => {
    let Data = {
      TalkRequest: {
        BroadcastID: talkStateData.ActiveChatData.id,
        ChannelID: parseInt(currentOrganizationId),
      },
    }
    dispatch(GetActiveUsersByBroadcastID(navigate, Data, t))
    setShowShoutEdit(true)
    setChatMenuActive(false)
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

  //All Messages State
  useEffect(() => {
    let allChatMessages = talkStateData.AllMessagesData
    if (
      allChatMessages !== undefined &&
      allChatMessages !== null &&
      // allChatMessages.length !== 0 &&
      talkStateData.ActiveChatData.messageType === 'O'
    ) {
      oneToOneMessages(setAllMessages, allChatMessages.oneToOneMessages)
    } else if (
      allChatMessages !== undefined &&
      allChatMessages !== null &&
      // allChatMessages.length !== 0 &&
      talkStateData.ActiveChatData.messageType === 'G'
    ) {
      groupMessages(allChatMessages.groupMessages, setAllMessages)
    } else if (
      allChatMessages !== undefined &&
      allChatMessages !== null &&
      // allChatMessages.length !== 0 &&
      talkStateData.ActiveChatData.messageType === 'B'
    ) {
      let allBroadcastMessagesArr = []
      if (
        allChatMessages.broadcastMessages !== undefined &&
        allChatMessages.broadcastMessages !== null &&
        allChatMessages.broadcastMessages.length !== 0
      ) {
        allChatMessages.broadcastMessages.map((messagesData) => {
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
      } else {
        allBroadcastMessagesArr = []
      }
      setAllMessages([...allBroadcastMessagesArr])
    }
  }, [talkStateData.AllMessagesData])

  console.log('All Messages State', allMessages)

  //Message send oto api response data
  useEffect(() => {
    if (
      talkStateData.MessageSendOTO.MessageSendResponseData !== null &&
      talkStateData.MessageSendOTO.MessageSendResponseData !== undefined &&
      talkStateData.MessageSendOTO.MessageSendResponseData.length !== 0
    ) {
      try {
        if (talkStateData.ActiveChatData.messageType === 'O') {
          console.log('Try 1')
          if (
            talkStateData.MessageSendOTO.MessageSendResponseData
              .oneToOneMessages[0].senderID != undefined &&
            talkStateData.MessageSendOTO.MessageSendResponseData
              .oneToOneMessages[0].senderID != null &&
            talkStateData.MessageSendOTO.MessageSendResponseData
              .oneToOneMessages[0].senderID != 0 &&
            talkStateData.MessageSendOTO.MessageSendResponseData
              .oneToOneMessages[0].senderID != '' &&
            talkStateData.MessageSendOTO.MessageSendResponseData
              .oneToOneMessages[0].senderID != '0' &&
            talkStateData.ActiveChatData.id ===
              talkStateData.MessageSendOTO.MessageSendResponseData
                .oneToOneMessages[0].receiverID
          ) {
            console.log('Try 2')
            let apiInsertOtoMessageData =
              talkStateData.MessageSendOTO.MessageSendResponseData
                .oneToOneMessages[0]
            let insertApiOtoMessageData = {
              attachmentLocation: apiInsertOtoMessageData.attachmentLocation,
              blockCount: 0,
              broadcastName: apiInsertOtoMessageData.broadcastName,
              currDate: apiInsertOtoMessageData.currDate,
              fileGeneratedName: apiInsertOtoMessageData.fileGeneratedName,
              fileName: apiInsertOtoMessageData.fileName,
              frMessages: apiInsertOtoMessageData.frMessages,
              isFlag: 0,
              messageBody: apiInsertOtoMessageData.messageBody,
              messageCount: 0,
              messageID: apiInsertOtoMessageData.messageID,
              messageStatus: apiInsertOtoMessageData.messageStatus,
              receivedDate: apiInsertOtoMessageData.receivedDate,
              receiverID: apiInsertOtoMessageData.receiverID,
              receiverName: apiInsertOtoMessageData.receiverName,
              seenDate: apiInsertOtoMessageData.seenDate,
              senderID: apiInsertOtoMessageData.senderID,
              senderName: apiInsertOtoMessageData.senderName,
              sentDate: apiInsertOtoMessageData.sentDate,
              shoutAll: apiInsertOtoMessageData.shoutAll,
              uid: apiInsertOtoMessageData.uid,
            }
            console.log('Try 3')
            let allChatNewMessageOtoData = {
              id:
                parseInt(currentUserId) === apiInsertOtoMessageData.senderID
                  ? apiInsertOtoMessageData.receiverID
                  : parseInt(currentUserId) ===
                    apiInsertOtoMessageData.receiverID
                  ? apiInsertOtoMessageData.senderID
                  : null,
              fullName:
                parseInt(currentUserId) === apiInsertOtoMessageData.senderID
                  ? apiInsertOtoMessageData.receiverName
                  : parseInt(currentUserId) ===
                    apiInsertOtoMessageData.receiverID
                  ? apiInsertOtoMessageData.senderName
                  : null,
              imgURL: 'O.jpg',
              messageBody: apiInsertOtoMessageData.messageBody,
              messageDate: apiInsertOtoMessageData.sentDate,
              notiCount: 0,
              messageType: 'O',
              isOnline: true,
              isBlock: 0,
              companyName: 'Tresmark',
              sentDate: apiInsertOtoMessageData.sentDate,
              receivedDate: apiInsertOtoMessageData.receivedDate,
              seenDate: apiInsertOtoMessageData.seenDate,
              attachmentLocation: apiInsertOtoMessageData.attachmentLocation,
              senderID: apiInsertOtoMessageData.senderID,
              admin: 0,
            }
            console.log('Try 4')
            if (Object.keys(insertApiOtoMessageData) !== null) {
              if (
                insertApiOtoMessageData !== undefined &&
                insertApiOtoMessageData !== null &&
                insertApiOtoMessageData.hasOwnProperty('messageBody') &&
                insertApiOtoMessageData.messageBody !== undefined &&
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                allMessages[allMessages.length - 1].messageBody !== undefined &&
                insertApiOtoMessageData.messageBody ===
                  allMessages[allMessages.length - 1].messageBody
              ) {
                console.log('Try 5')
                setAllMessages((prevState) => {
                  const updatedMessages = [...prevState]
                  updatedMessages[
                    updatedMessages.length - 1
                  ] = insertApiOtoMessageData
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
                insertApiOtoMessageData !== undefined &&
                insertApiOtoMessageData !== null &&
                insertApiOtoMessageData.hasOwnProperty('messageBody') &&
                insertApiOtoMessageData.messageBody !== undefined &&
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                insertApiOtoMessageData.messageBody !==
                  allMessages[allMessages.length - 1].messageBody
              ) {
                setAllMessages([...allMessages, insertApiOtoMessageData])
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
                  .oneToOneMessages[0]
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
                setAllMessages([...allMessagesArr])
              }
            }
          }
          console.log('Try End Before Catch')
        }
        console.log('Try End Before Catch')
      } catch {
        console.log('Error MessageSendOTO')
      }
    }
    //
  }, [talkStateData.MessageSendOTO.MessageSendResponseData])

  //Making Data from MQTT Response
  useEffect(() => {
    if (
      talkStateData.talkSocketData.socketInsertOTOMessageData !== null &&
      talkStateData.talkSocketData.socketInsertOTOMessageData !== undefined &&
      talkStateData.talkSocketData.socketInsertOTOMessageData.length !== 0
    ) {
      try {
        if (
          talkStateData.ActiveChatData.id ===
          talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
            .receiverID
        ) {
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
            uid: mqttInsertOtoMessageData.uid,
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
              allMessages.length > 0 &&
              allMessages[allMessages.length - 1] !== undefined &&
              allMessages[allMessages.length - 1] !== null &&
              allMessages[allMessages.length - 1].hasOwnProperty(
                'messageBody',
              ) &&
              allMessages[allMessages.length - 1].messageBody !== undefined &&
              insertMqttOtoMessageData.messageBody ===
                allMessages[allMessages.length - 1].messageBody
            ) {
              setAllMessages((prevState) => {
                const updatedMessages = [...prevState]
                updatedMessages[
                  updatedMessages.length - 1
                ] = insertMqttOtoMessageData
                return updatedMessages
              })
              dispatch(pushChatData(allChatNewMessageOtoData))
            } else if (
              insertMqttOtoMessageData !== undefined &&
              insertMqttOtoMessageData !== null &&
              insertMqttOtoMessageData.hasOwnProperty('messageBody') &&
              insertMqttOtoMessageData.messageBody !== undefined &&
              allMessages.length > 0 &&
              allMessages[allMessages.length - 1] !== undefined &&
              allMessages[allMessages.length - 1] !== null &&
              allMessages[allMessages.length - 1].hasOwnProperty(
                'messageBody',
              ) &&
              insertMqttOtoMessageData.messageBody !==
                allMessages[allMessages.length - 1].messageBody
            ) {
              setAllMessages([...allMessages, insertMqttOtoMessageData])
              dispatch(pushChatData(allChatNewMessageOtoData))
            }
          } else {
            let allotomessages =
              talkStateData.UserOTOMessages.UserOTOMessagesData.oneToOneMessages
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
              setAllMessages([...allMessagesArr])
            }
          }
        } else if (
          parseInt(currentUserId) ===
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .receiverID &&
          talkStateData.ActiveChatData.id ===
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID
        ) {
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
            uid: mqttInsertOtoMessageData.uid,
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
              allMessages.length > 0 &&
              allMessages[allMessages.length - 1] !== undefined &&
              allMessages[allMessages.length - 1] !== null &&
              allMessages[allMessages.length - 1].hasOwnProperty(
                'messageBody',
              ) &&
              allMessages[allMessages.length - 1].messageBody !== undefined &&
              insertMqttOtoMessageData.messageBody !==
                allMessages[allMessages.length - 1].messageBody
            ) {
              setAllMessages([...allMessages, insertMqttOtoMessageData])
              dispatch(pushChatData(allChatNewMessageOtoData))
            } else if (
              insertMqttOtoMessageData !== undefined &&
              insertMqttOtoMessageData !== null &&
              insertMqttOtoMessageData.hasOwnProperty('messageBody') &&
              insertMqttOtoMessageData.messageBody !== undefined &&
              allMessages.length > 0 &&
              allMessages[allMessages.length - 1] !== undefined &&
              allMessages[allMessages.length - 1] !== null &&
              allMessages[allMessages.length - 1].hasOwnProperty(
                'messageBody',
              ) &&
              insertMqttOtoMessageData.messageBody !==
                allMessages[allMessages.length - 1].messageBody
            ) {
              setAllMessages((prevState) => {
                const updatedMessages = [...prevState]
                updatedMessages[
                  updatedMessages.length - 1
                ] = insertMqttOtoMessageData
                return updatedMessages
              })
              dispatch(pushChatData(allChatNewMessageOtoData))
            }
          } else {
            let allotomessages =
              talkStateData.UserOTOMessages.UserOTOMessagesData.oneToOneMessages
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
              setAllMessages([...allMessagesArr])
            }
          }
        } else if (
          parseInt(currentUserId) ===
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .receiverID &&
          talkStateData.ActiveChatData.id !==
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID
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
            talkStateData.ActiveChatData.id === 0 &&
            talkStateData.ActiveChatData.messageType === ''
          ) {
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
              dispatch(pushChatData(allChatNewMessageOtoData))
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
                setAllMessages([...allMessagesArr])
              }
            }
          }
        }
      } catch {
        console.log('Error in MQTT OTO')
      }
    }
    //
  }, [talkStateData.talkSocketData.socketInsertOTOMessageData])

  useEffect(() => {
    if (
      talkStateData.talkSocketData.socketInsertGroupMessageData !== null &&
      talkStateData.talkSocketData.socketInsertGroupMessageData !== undefined &&
      talkStateData.talkSocketData.socketInsertGroupMessageData.length !== 0
    ) {
      try {
        if (talkStateData.ActiveChatData.messageType === 'G') {
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
            talkStateData.ActiveChatData.id ===
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
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                allMessages[allMessages.length - 1].messageBody !== undefined &&
                insertMqttGroupMessageData.messageBody ===
                  allMessages[allMessages.length - 1].messageBody
              ) {
                if (
                  talkStateData.ActiveChatData.id ===
                    insertMqttGroupMessageData.receiverID ||
                  talkStateData.ActiveChatData.id ===
                    insertMqttGroupMessageData.senderID
                ) {
                  setAllMessages((prevState) => {
                    const updatedMessages = [...prevState]
                    updatedMessages[
                      updatedMessages.length - 1
                    ] = insertMqttGroupMessageData
                    return updatedMessages
                  })
                  dispatch(pushChatData(newGroupMessageChat))
                }
              } else if (
                insertMqttGroupMessageData !== undefined &&
                insertMqttGroupMessageData !== null &&
                insertMqttGroupMessageData.hasOwnProperty('messageBody') &&
                insertMqttGroupMessageData.messageBody !== undefined &&
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                insertMqttGroupMessageData.messageBody !==
                  allMessages[allMessages.length - 1].messageBody
              ) {
                setAllMessages([...allMessages, insertMqttGroupMessageData])
                dispatch(pushChatData(newGroupMessageChat))
              }
            } else {
              let allMessages =
                talkStateData.GroupMessages.GroupMessagesData.groupMessages
              if (allMessages != undefined) {
                let allGroupMessagesArr = []
                allMessages.map((messagesData) => {
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
                setAllMessages([...allGroupMessagesArr])
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
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                allMessages[allMessages.length - 1].messageBody !== undefined &&
                insertMqttGroupMessageData.messageBody ===
                  allMessages[allMessages.length - 1].messageBody
              ) {
                if (
                  talkStateData.ActiveChatData.id ===
                    insertMqttGroupMessageData.receiverID ||
                  talkStateData.ActiveChatData.id ===
                    insertMqttGroupMessageData.senderID
                ) {
                  setAllMessages((prevState) => {
                    const updatedMessages = [...prevState]
                    updatedMessages[
                      updatedMessages.length - 1
                    ] = insertMqttGroupMessageData
                    return updatedMessages
                  })
                  dispatch(pushChatData(newGroupMessageChat))
                }
              } else if (
                insertMqttGroupMessageData !== undefined &&
                insertMqttGroupMessageData !== null &&
                insertMqttGroupMessageData.hasOwnProperty('messageBody') &&
                insertMqttGroupMessageData.messageBody !== undefined &&
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                insertMqttGroupMessageData.messageBody !==
                  allMessages[allMessages.length - 1].messageBody
              ) {
                setAllMessages([...allMessages, insertMqttGroupMessageData])
                dispatch(pushChatData(newGroupMessageChat))
              }
            } else {
              let allMessages =
                talkStateData.GroupMessages.GroupMessagesData.groupMessages
              if (allMessages != undefined) {
                let allGroupMessagesArr = []
                allMessages.map((messagesData) => {
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
                setAllMessages([...allGroupMessagesArr])
              }
              // }
            }
          } else if (
            talkStateData.ActiveChatData.messageType === '' &&
            talkStateData.ActiveChatData.id === 0
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
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                allMessages[allMessages.length - 1].messageBody !== undefined &&
                mqttInsertGroupMessageData.messageBody ===
                  allMessages[allMessages.length - 1].messageBody
              ) {
                dispatch(pushChatData(newGroupMessageChat))
              } else if (
                mqttInsertGroupMessageData !== undefined &&
                mqttInsertGroupMessageData !== null &&
                mqttInsertGroupMessageData.hasOwnProperty('messageBody') &&
                mqttInsertGroupMessageData.messageBody !== undefined &&
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                mqttInsertGroupMessageData.messageBody !==
                  allMessages[allMessages.length - 1].messageBody
              ) {
                dispatch(pushChatData(newGroupMessageChat))
              }
            } else {
              let allMessages =
                talkStateData.GroupMessages.GroupMessagesData.groupMessages
              if (allMessages != undefined) {
                let allGroupMessagesArr = []
                allMessages.map((messagesData) => {
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
                setAllMessages([...allGroupMessagesArr])
              }
              // }
            }
          }
        }
      } catch {}
    }
  }, [talkStateData.talkSocketData.socketInsertGroupMessageData])

  //Socket Insert Broadcast Message
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
        if (talkStateData.ActiveChatData.messageType === 'B') {
          if (
            talkStateData.talkSocketInsertBroadcastMessage
              .MessageSendBroadcastResponseData.data[0].senderID != undefined &&
            talkStateData.talkSocketInsertBroadcastMessage
              .MessageSendBroadcastResponseData.data[0].senderID != null &&
            talkStateData.talkSocketInsertBroadcastMessage
              .MessageSendBroadcastResponseData.data[0].senderID != 0 &&
            talkStateData.talkSocketInsertBroadcastMessage
              .MessageSendBroadcastResponseData.data[0].senderID != '' &&
            talkStateData.talkSocketInsertBroadcastMessage
              .MessageSendBroadcastResponseData.data[0].senderID != '0' &&
            talkStateData.ActiveChatData.id ===
              talkStateData.talkSocketInsertBroadcastMessage
                .MessageSendBroadcastResponseData.data[0].receiverID
          ) {
            let mqttInsertBroadcastMessageData =
              talkStateData.talkSocketInsertBroadcastMessage
                .MessageSendBroadcastResponseData.data[0]
            let insertMqttBroadcastMessageData = {
              messageID: mqttInsertBroadcastMessageData.messageID,
              senderID: mqttInsertBroadcastMessageData.senderID,
              receiverID: mqttInsertBroadcastMessageData.receiverID,
              messageBody: mqttInsertBroadcastMessageData.messageBody,
              senderName: mqttInsertBroadcastMessageData.senderName,
              isFlag: 0,
              sentDate: mqttInsertBroadcastMessageData.sentDate,
              currDate: mqttInsertBroadcastMessageData.currDate,
              fileGeneratedName:
                mqttInsertBroadcastMessageData.fileGeneratedName,
              fileName: mqttInsertBroadcastMessageData.fileName,
              shoutAll: mqttInsertBroadcastMessageData.shoutAll,
              frMessages: mqttInsertBroadcastMessageData.frMessages,
              messageCount: 0,
              attachmentLocation:
                mqttInsertBroadcastMessageData.attachmentLocation,
            }
            let newBroadcastMessageChat = {
              id: mqttInsertBroadcastMessageData.receiverID,
              fullName: mqttInsertBroadcastMessageData.broadcastName,
              imgURL: 'O.jpg',
              messageBody: mqttInsertBroadcastMessageData.messageBody,
              messageDate: mqttInsertBroadcastMessageData.sentDate,
              notiCount: 0,
              messageType: 'B',
              isOnline: true,
              companyName: 'Tresmark',
              sentDate: mqttInsertBroadcastMessageData.sentDate,
              receivedDate: '',
              seenDate: '',
              attachmentLocation:
                mqttInsertBroadcastMessageData.attachmentLocation,
              senderID: parseInt(messageSendData.SenderID),
              admin: mqttInsertBroadcastMessageData.admin,
            }

            if (Object.keys(insertMqttBroadcastMessageData) !== null) {
              if (
                insertMqttBroadcastMessageData !== undefined &&
                insertMqttBroadcastMessageData !== null &&
                insertMqttBroadcastMessageData.hasOwnProperty('messageBody') &&
                insertMqttBroadcastMessageData.messageBody !== undefined &&
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                allMessages[allMessages.length - 1].messageBody !== undefined &&
                insertMqttBroadcastMessageData.messageBody ===
                  allMessages[allMessages.length - 1].messageBody
              ) {
                if (
                  talkStateData.ActiveChatData.id ===
                    insertMqttBroadcastMessageData.receiverID ||
                  talkStateData.ActiveChatData.id ===
                    insertMqttBroadcastMessageData.senderID
                ) {
                  setAllMessages((prevState) => {
                    const updatedMessages = [...prevState]
                    updatedMessages[
                      updatedMessages.length - 1
                    ] = insertMqttBroadcastMessageData
                    return updatedMessages
                  })
                  let updatedArray = [...allChatData]
                  if (
                    updatedArray.length > 0 &&
                    updatedArray[0].hasOwnProperty('messageBody')
                  ) {
                    updatedArray[0] = newBroadcastMessageChat
                  }
                  setAllChatData(updatedArray)

                  // allMessages.push(insertMqttBroadcastMessageData)
                  // setAllMessages([...allMessages])
                }
              } else if (
                insertMqttBroadcastMessageData !== undefined &&
                insertMqttBroadcastMessageData !== null &&
                insertMqttBroadcastMessageData.hasOwnProperty('messageBody') &&
                insertMqttBroadcastMessageData.messageBody !== undefined &&
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                insertMqttBroadcastMessageData.messageBody !==
                  allMessages[allMessages.length - 1].messageBody
              ) {
                setAllMessages([...allMessages, insertMqttBroadcastMessageData])
                let updatedArray = [...allChatData]
                if (
                  updatedArray.length > 0 &&
                  updatedArray[0].hasOwnProperty('messageBody') &&
                  updatedArray[0].messageBody === allChatData[0].messageBody
                ) {
                  updatedArray[0] = newBroadcastMessageChat
                }
                setAllChatData(updatedArray)
              }
            } else {
              let allMessages =
                talkStateData.BroadcastMessages.BroadcastMessagesData
                  .broadcastMessages
              if (allMessages != undefined) {
                let allBroadcastMessagesArr = []
                allMessages.map((messagesData) => {
                  allBroadcastMessagesArr.push({
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
                setAllMessages([...allBroadcastMessagesArr])
              }
              // }
            }
          } else if (
            talkStateData.talkSocketInsertBroadcastMessage
              .MessageSendBroadcastResponseData.data[0].senderID != undefined &&
            talkStateData.talkSocketInsertBroadcastMessage
              .MessageSendBroadcastResponseData.data[0].senderID != null &&
            talkStateData.talkSocketInsertBroadcastMessage
              .MessageSendBroadcastResponseData.data[0].senderID != 0 &&
            talkStateData.talkSocketInsertBroadcastMessage
              .MessageSendBroadcastResponseData.data[0].senderID != '' &&
            talkStateData.talkSocketInsertBroadcastMessage
              .MessageSendBroadcastResponseData.data[0].senderID != '0' &&
            parseInt(currentUserId) !==
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
                .senderID
          ) {
            let mqttInsertBroadcastMessageData =
              talkStateData.talkSocketInsertBroadcastMessage
                .MessageSendBroadcastResponseData.data[0]
            let insertMqttBroadcastMessageData = {
              messageID: mqttInsertBroadcastMessageData.messageID,
              senderID: mqttInsertBroadcastMessageData.senderID,
              receiverID: mqttInsertBroadcastMessageData.receiverID,
              messageBody: mqttInsertBroadcastMessageData.messageBody,
              senderName: mqttInsertBroadcastMessageData.senderName,
              isFlag: 0,
              sentDate: mqttInsertBroadcastMessageData.sentDate,
              currDate: mqttInsertBroadcastMessageData.currDate,
              fileGeneratedName:
                mqttInsertBroadcastMessageData.fileGeneratedName,
              fileName: mqttInsertBroadcastMessageData.fileName,
              shoutAll: mqttInsertBroadcastMessageData.shoutAll,
              frMessages: mqttInsertBroadcastMessageData.frMessages,
              messageCount: 0,
              attachmentLocation:
                mqttInsertBroadcastMessageData.attachmentLocation,
            }

            let newBroadcastMessageChat = {
              id: mqttInsertBroadcastMessageData.receiverID,
              fullName: mqttInsertBroadcastMessageData.broadcastName,
              imgURL: 'O.jpg',
              messageBody: mqttInsertBroadcastMessageData.messageBody,
              messageDate: mqttInsertBroadcastMessageData.sentDate,
              notiCount: 0,
              messageType: 'B',
              isOnline: true,
              companyName: 'Tresmark',
              sentDate: mqttInsertBroadcastMessageData.sentDate,
              receivedDate: '',
              seenDate: '',
              attachmentLocation:
                mqttInsertBroadcastMessageData.attachmentLocation,
              senderID: parseInt(messageSendData.SenderID),
              admin: mqttInsertBroadcastMessageData.admin,
            }

            if (Object.keys(insertMqttBroadcastMessageData) !== null) {
              if (
                insertMqttBroadcastMessageData !== undefined &&
                insertMqttBroadcastMessageData !== null &&
                insertMqttBroadcastMessageData.hasOwnProperty('messageBody') &&
                insertMqttBroadcastMessageData.messageBody !== undefined &&
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                allMessages[allMessages.length - 1].messageBody !== undefined &&
                insertMqttBroadcastMessageData.messageBody ===
                  allMessages[allMessages.length - 1].messageBody
              ) {
                if (
                  talkStateData.ActiveChatData.id ===
                    insertMqttBroadcastMessageData.receiverID ||
                  talkStateData.ActiveChatData.id ===
                    insertMqttBroadcastMessageData.senderID
                ) {
                  setAllMessages((prevState) => {
                    const updatedMessages = [...prevState]
                    updatedMessages[
                      updatedMessages.length - 1
                    ] = insertMqttBroadcastMessageData
                    return updatedMessages
                  })
                  let updatedArray = [...allChatData]
                  if (
                    updatedArray.length > 0 &&
                    updatedArray[0].hasOwnProperty('messageBody')
                  ) {
                    updatedArray[0] = newBroadcastMessageChat
                  }
                  setAllChatData(updatedArray)
                }
              } else if (
                insertMqttBroadcastMessageData !== undefined &&
                insertMqttBroadcastMessageData !== null &&
                insertMqttBroadcastMessageData.hasOwnProperty('messageBody') &&
                insertMqttBroadcastMessageData.messageBody !== undefined &&
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                insertMqttBroadcastMessageData.messageBody !==
                  allMessages[allMessages.length - 1].messageBody
              ) {
                setAllMessages([...allMessages, insertMqttBroadcastMessageData])
                let updatedArray = [...allChatData]
                if (
                  updatedArray.length > 0 &&
                  updatedArray[0].hasOwnProperty('messageBody') &&
                  updatedArray[0].messageBody === allChatData[0].messageBody
                ) {
                  updatedArray[0] = newBroadcastMessageChat
                }
                setAllChatData(updatedArray)
              }
            } else {
              let allMessages =
                talkStateData.BroadcastMessages.BroadcastMessagesData
                  .broadcastMessages
              if (allMessages != undefined) {
                let allBroadcastMessagesArr = []
                allMessages.map((messagesData) => {
                  allBroadcastMessagesArr.push({
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
                setAllMessages([...allBroadcastMessagesArr])
              }
              // }
            }
          } else if (
            talkStateData.ActiveChatData.messageType === '' &&
            talkStateData.ActiveChatData.id === 0
          ) {
            let mqttInsertBroadcastMessageData =
              talkStateData.talkSocketInsertBroadcastMessage
                .MessageSendBroadcastResponseData.data[0]

            let newBroadcastMessageChat = {
              id: mqttInsertBroadcastMessageData.receiverID,
              fullName: mqttInsertBroadcastMessageData.broadcastName,
              imgURL: 'O.jpg',
              messageBody: mqttInsertBroadcastMessageData.messageBody,
              messageDate: mqttInsertBroadcastMessageData.sentDate,
              notiCount: 0,
              messageType: 'B',
              isOnline: true,
              companyName: 'Tresmark',
              sentDate: mqttInsertBroadcastMessageData.sentDate,
              receivedDate: '',
              seenDate: '',
              attachmentLocation:
                mqttInsertBroadcastMessageData.attachmentLocation,
              senderID: parseInt(messageSendData.SenderID),
              admin: mqttInsertBroadcastMessageData.admin,
            }

            if (Object.keys(mqttInsertBroadcastMessageData) !== null) {
              if (
                mqttInsertBroadcastMessageData !== undefined &&
                mqttInsertBroadcastMessageData !== null &&
                mqttInsertBroadcastMessageData.hasOwnProperty('messageBody') &&
                mqttInsertBroadcastMessageData.messageBody !== undefined &&
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                allMessages[allMessages.length - 1].messageBody !== undefined &&
                mqttInsertBroadcastMessageData.messageBody ===
                  allMessages[allMessages.length - 1].messageBody
              ) {
                let updatedArray = [...allChatData]
                if (
                  updatedArray.length > 0 &&
                  updatedArray[0].hasOwnProperty('messageBody')
                ) {
                  updatedArray[0] = newBroadcastMessageChat
                }
                setAllChatData(updatedArray)
              } else if (
                mqttInsertBroadcastMessageData !== undefined &&
                mqttInsertBroadcastMessageData !== null &&
                mqttInsertBroadcastMessageData.hasOwnProperty('messageBody') &&
                mqttInsertBroadcastMessageData.messageBody !== undefined &&
                allMessages.length > 0 &&
                allMessages[allMessages.length - 1] !== undefined &&
                allMessages[allMessages.length - 1] !== null &&
                allMessages[allMessages.length - 1].hasOwnProperty(
                  'messageBody',
                ) &&
                mqttInsertBroadcastMessageData.messageBody !==
                  allMessages[allMessages.length - 1].messageBody
              ) {
                let updatedArray = [...allChatData]
                if (
                  updatedArray.length > 0 &&
                  updatedArray[0].hasOwnProperty('messageBody') &&
                  updatedArray[0].messageBody === allChatData[0].messageBody
                ) {
                  updatedArray[0] = newBroadcastMessageChat
                }
                setAllChatData(updatedArray)
              }
            } else {
              let allMessages =
                talkStateData.BroadcastMessages.BroadcastMessagesData
                  .broadcastMessages
              if (allMessages != undefined) {
                let allBroadcastMessagesArr = []
                allMessages.map((messagesData) => {
                  allBroadcastMessagesArr.push({
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
                setAllMessages([...allBroadcastMessagesArr])
              }
              // }
            }
          }
        }
      } catch {}
    }
  }, [
    talkStateData.talkSocketInsertBroadcastMessage
      .MessageSendBroadcastResponseData,
  ])

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
      }
      if (talkStateData.ActiveChatData.id === mqttBlockedUserData.blockUserID) {
        dispatch(activeChat(activeChatData))
      }
      // let blockedUsersDataForMqtt = {
      //   fullName: '',
      //   id: mqttBlockedUserData.blockUserID,
      //   imgURL: 'null',
      // }
      // if (Object.keys(blockedUsersDataForMqtt) !== null) {
      //   setChatFilter({
      //     ...chatFilter,
      //     value: 8,
      //     label: 'Blocked User',
      //   })
      //   setChatFilterName('Blocked User')
      //   blockedUsersData.push(blockedUsersDataForMqtt)
      //   setBlockedUsersData([...blockedUsersData])
      // }
      // else {
      //   setBlockedUsersData(
      //     talkStateData?.BlockedUsers?.BlockedUsersData?.blockedUsers,
      //   )
      // }
    }
  }, [talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser])

  useEffect(() => {}, [talkStateData.ActiveChatData])

  //Unblocking a User MQTT
  useEffect(() => {
    if (
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser !== null &&
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser !==
        undefined &&
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser.length !==
        0
    ) {
      let mqttUnblockedUserData =
        talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser.data[0]
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
      }
      if (
        talkStateData.ActiveChatData.id === mqttUnblockedUserData.blockUserID
      ) {
        dispatch(activeChat(activeChatData))
      }
      // let blockedUsersDataForMqtt = {
      //   fullName: '',
      //   id: mqttBlockedUserData.blockUserID,
      //   imgURL: 'null',
      // }
      // if (Object.keys(blockedUsersDataForMqtt) !== null) {
      //   setBlockedUsersData(
      //     blockedUsersData.filter(
      //       (item) => item.id !== blockedUsersDataForMqtt.id,
      //     ),
      //   )
      //   // blockedUsersData.push(blockedUsersDataForMqtt)
      //   // setBlockedUsersData([...blockedUsersData])
      // } else {
      //   setBlockedUsersData(
      //     talkStateData?.BlockedUsers?.BlockedUsersData?.blockedUsers,
      //   )
      // }
    }
  }, [
    // talkStateData?.BlockedUsers?.BlockedUsersData?.blockedUsers,
    talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser,
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
          let messageOtoStarred = allMessages.find(
            (item) => item.messageID === mqttStarMessageData.messageID,
          )
          if (messageOtoStarred !== undefined) {
            if (messageOtoStarred.isFlag === 1) {
              messageOtoStarred.isFlag = 0
            } else if (messageOtoStarred.isFlag === 0) {
              messageOtoStarred.isFlag = 1
            }
          }
          setAllMessages(
            allMessages.map((data) =>
              data.messageID === messageOtoStarred.messageID
                ? messageOtoStarred
                : data,
            ),
          )
        } else if (mqttStarMessageData.messageType === 'G') {
          let messageGroupStarred = allMessages.find(
            (item) => item.messageID === mqttStarMessageData.messageID,
          )
          if (messageGroupStarred !== undefined) {
            if (messageGroupStarred.isFlag === 1) {
              messageGroupStarred.isFlag = 0
            } else if (messageGroupStarred.isFlag === 0) {
              messageGroupStarred.isFlag = 1
            }
          }
          setAllMessages(
            allMessages.map((data) =>
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
        setAllMessages,
        allMessages,
        allMessages,
        setAllMessages,
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

  //Group Updation In Real Time
  useEffect(() => {
    if (
      talkStateData.talkSocketGroupUpdation.groupUpdatedData !== null &&
      talkStateData.talkSocketGroupUpdation.groupUpdatedData !== undefined &&
      talkStateData.talkSocketGroupUpdation.groupUpdatedData.length !== 0
    ) {
      groupUpdationFunction(talkStateData, setAllChatData, allChatData)
    }
  }, [talkStateData?.talkSocketGroupUpdation?.groupUpdatedData])

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

  // console.log(
  //   'acknowledgedMessage',
  //   talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse,
  //   acknowledgedMessage,
  //   talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse.data,
  //   talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse.data
  //     .length,
  //   typeof talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse
  //     .data,
  // )

  //MQTT Message Status Update
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
        talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse.data

      if (Array.isArray(acknowledgedMessages)) {
        const updatedAllOtoMessages = allMessages.map((message) => {
          const matchingAcknowledgedMessage = acknowledgedMessages.find(
            (acknowledgedMessage) =>
              acknowledgedMessage.messageID === message.messageID,
          )

          if (matchingAcknowledgedMessage) {
            return {
              ...message,
              messageStatus: matchingAcknowledgedMessage.messageStatus,
              sentDate: matchingAcknowledgedMessage.sentDate,
              receivedDate: matchingAcknowledgedMessage.receivedDate,
              seenDate: matchingAcknowledgedMessage.seenDate,
              currDate: matchingAcknowledgedMessage.currDate,
            }
          }
          return message
        })
        setAllMessages(updatedAllOtoMessages)
      }
    }
  }, [talkStateData?.MessageStatusUpdateData?.MessageStatusUpdateResponse])

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

  // Generate the unique ID
  const uniqueId = generateGUID()

  console.log('uploadFileTalk', uploadFileTalk)

  //Send Chat
  const sendChat = async () => {
    // e.preventDefault()
    console.log('Message Sent Striked')
    if (
      (messageSendData.Body !== '' && uploadFileTalk !== {}) ||
      (messageSendData.Body === '' && uploadFileTalk !== {}) ||
      messageSendData.Body !== ''
    ) {
      console.log('uniqueId', uniqueId)

      if (talkStateData.ActiveChatData.messageType === 'O') {
        let Data = {
          TalkRequest: {
            ChannelID: parseInt(currentOrganizationId),
            Message: {
              ...messageSendData,
              UID: uniqueId,
            },
          },
        }
        console.log('Insert OTO Message Response', Data)
        dispatch(InsertOTOMessages(navigate, Data, uploadFileTalk, t))

        let newMessageOto = {
          messageID: 0,
          senderID: parseInt(currentUserId),
          receiverID: parseInt(messageSendData.ReceiverID),
          messageBody: messageSendData.Body,
          senderName: currentUserName,
          receiverName: talkStateData.ActiveChatData.fullName,
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
          fullName: talkStateData.ActiveChatData.fullName,
          imgURL: talkStateData.ActiveChatData.imgURL,
          messageBody: messageSendData.Body,
          messageDate: talkStateData.ActiveChatData.messageDate,
          notiCount: talkStateData.ActiveChatData.notiCount,
          messageType: talkStateData.ActiveChatData.messageType,
          isOnline: talkStateData.ActiveChatData.isOnline,
          isBlock: 0,
          companyName: talkStateData.ActiveChatData.companyName,
          sentDate: '',
          receivedDate: '',
          seenDate: '',
          attachmentLocation: messageSendData.AttachmentLocation,
          senderID: parseInt(messageSendData.SenderID),
          admin: talkStateData.ActiveChatData.admin,
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
          UID: '',
          MessageID: 0,
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
        setAllMessages([...allMessages, newMessageOto])
      } else if (talkStateData.ActiveChatData.messageType === 'G') {
        let Data = {
          TalkRequest: {
            ChannelID: parseInt(currentOrganizationId),
            Message: messageSendData,
          },
        }
        dispatch(InsertPrivateGroupMessages(navigate, Data, uploadFileTalk, t))

        let newMessageGroup = {
          messageID: 0,
          senderID: parseInt(currentUserId),
          receiverID: parseInt(messageSendData.ReceiverID),
          messageBody: messageSendData.Body,
          senderName: currentUserName,
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

        setAllMessages([...allMessages, newMessageGroup])

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
          sentDate: '',
          receivedDate: '',
          seenDate: '',
          attachmentLocation: messageSendData.AttachmentLocation,
          senderID: parseInt(messageSendData.SenderID),
          admin: talkStateData.ActiveChatData.admin,
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
          MessageID: 0,
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
      } else if (talkStateData.ActiveChatData.messageType === 'B') {
        let Data = {
          TalkRequest: {
            ChannelID: parseInt(currentOrganizationId),
            Message: messageSendData,
          },
        }
        dispatch(InsertBroadcastMessages(navigate, Data, uploadFileTalk, t))
        let newMessage = {
          attachmentLocation: '',
          blockCount: 0,
          broadcastName: talkStateData.ActiveChatData.fullName,
          currDate: currentDateTimeUtc,
          fileGeneratedName: '',
          fileName: '',
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
          senderName: currentUserName,
          sentDate: '',
          shoutAll: 0,
          uid: '',
        }
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
          sentDate: '',
          receivedDate: '',
          seenDate: '',
          attachmentLocation: messageSendData.AttachmentLocation,
          senderID: parseInt(messageSendData.SenderID),
          admin: talkStateData.ActiveChatData.admin,
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
          MessageID: 0,
          UID: '',
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
        setAllMessages([...allMessages, newMessage])
      } else {
      }
    } else {
    }
    setReplyFeature(false)
    setInputChat(true)
    setFile('')
    setTasksAttachments({
      ...tasksAttachments,
      ['TasksAttachments']: [],
    })
    setUploadFileTalk({})
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.overflowY = 'hidden'
    }
  }

  //Set Timer For Loading
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false)
  //   }, 5000)

  //   return () => {
  //     clearTimeout(timer)
  //   }
  // }, [])

  console.log('Talk State Data', talkStateData)

  console.log('Message Send Data', messageSendData)

  const handleOutsideClick = (event) => {
    if (
      chatMenuRef.current &&
      !chatMenuRef.current.contains(event.target) &&
      chatMenuActive
    ) {
      setChatMenuActive(false)
    }
    if (
      emojiMenuRef.current &&
      !emojiMenuRef.current.contains(event.target) &&
      emojiActive
    ) {
      setEmojiActive(false)
    }
    if (
      uploadFileRef.current &&
      !uploadFileRef.current.contains(event.target) &&
      uploadOptions
    ) {
      setUploadOptions(false)
    }
    // if (
    //   chatMessageRefs.current &&
    //   !chatMessageRefs.current.contains(event.target) &&
    //   chatFeatureActive
    // ) {
    //   setChatFeatureActive(0)
    // }

    // Close the menu if the clicked element is not within the menu
    if (!event.target.closest('.chatmessage-box-icons')) {
      setChatFeatureActive(0)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [chatMenuActive, emojiActive, uploadOptions])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputChat])

  useEffect(() => {
    if (emojiSelected) {
      inputRef.current.focus()
      setEmojiSelected(false)
    }
  }, [emojiSelected])

  const editGroup = () => {
    let editGroupUsersHashCheck = editGroupUsersChecked.map((value, index) => {
      return value + '#' + 0
    })
    setEditGroupUsersChecked(editGroupUsersHashCheck)
    let data = {
      TalkRequest: {
        UserID: parseInt(currentUserId),
        Group: {
          GroupID: talkStateData.ActiveChatData.id,
          GroupName: groupName,
          Users: editGroupUsersHashCheck.join(','),
        },
      },
    }
    dispatch(UpdatePrivateGroup(data, t, navigate))
    setShowGroupEdit(false)
  }

  const editShoutAll = () => {
    // editShoutUsersChecked
    let Data = {
      TalkRequest: {
        UserID: parseInt(currentUserId),
        ChannelID: parseInt(currentOrganizationId),
        Group: {
          GroupID: talkStateData.ActiveChatData.id,
          GroupName: shoutName,
          Users: editShoutUsersChecked.join(','),
        },
      },
    }
    dispatch(UpdateShoutAll(Data, t, navigate))
    setShowShoutEdit(false)
  }

  //Group Modification
  useEffect(() => {
    if (
      talkStateData.UpdatePrivateGroup.UpdatePrivateGroupResponseMessage ===
      'Group-modified'
    ) {
      setNotification({
        notificationShow: true,
        message:
          talkStateData.UpdatePrivateGroup.UpdatePrivateGroupResponseMessage,
      })
      setNotificationID(id)
    }
    dispatch(ResetGroupModify())
  }, [])

  const leaveGroupHandler = (record) => {
    let data = {
      UserID: parseInt(currentUserId),
      GroupID: record.id,
    }
    dispatch(LeaveGroup(navigate, data, t))
    setChatHeadMenuActive(false)
  }

  const leaveGroupHandlerChat = (record) => {
    let data = {
      UserID: parseInt(currentUserId),
      GroupID: record.id,
    }
    dispatch(LeaveGroup(navigate, data, t))
    setChatMenuActive(false)
    dispatch(videoChatMessagesFlag(false))
    dispatch(resetCloseChatFlags())
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
    setShowEditShoutField(false)
    setEmojiActive(false)
    setAddNewChat(false)
    setActiveCreateGroup(false)
    setActiveCreateShoutAll(false)
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
    setDeleteFlag(false)
    setForwardFlag(false)
    setEndDatedisable(false)
    setDeleteChat(false)
    setUploadOptions(false)
    setChatFeatureActive(0)
    setReplyFeature(false)
    setShowChatSearch(false)
    setAllMessages([])
    setMessageSendData({
      ...messageSendData,
      Body: '',
    })
    localStorage.setItem('activeChatID', null)
    localStorage.setItem('activeOtoChatID', 0)
  }

  //Group Left
  useEffect(() => {
    if (talkStateData.LeaveGroup.LeaveGroupResponseMessage === 'Group-left') {
      setNotification({
        notificationShow: true,
        message: talkStateData.LeaveGroup.LeaveGroupResponseMessage,
      })
      setNotificationID(id)
    }
    dispatch(ResetLeaveGroupMessage())
  }, [talkStateData.LeaveGroup.LeaveGroupResponseMessage])

  useEffect(() => {
    if (
      talkStateData.CreateShoutAllList.CreateShoutAllListResponseMessage ===
      'Broadcast-list-created'
    ) {
      setNotification({
        notificationShow: true,
        message:
          talkStateData.CreateShoutAllList.CreateShoutAllListResponseMessage,
      })
      setNotificationID(id)
    }
    dispatch(ResetShoutAllCreated())
  }, [talkStateData.CreateShoutAllList.CreateShoutAllListResponseMessage])

  let messageSendDataLS = JSON.parse(localStorage.getItem('messageArray')) || []

  const [isRetryAttemptComplete, setIsRetryAttemptComplete] = useState(false)

  const storeDataInAPI = async (counter, flag) => {
    try {
      console.log('LocalStorageManagement Interval', counter)
      let newMessageData = [...messageSendDataLS]
      let dataItem
      if (flag) {
        for (let i = 0; i < newMessageData.length; i++) {
          dataItem = newMessageData[i]
          console.log('LocalStorageManagement Interval', i)

          console.log('LocalStorageManagement dataItem', dataItem)
          await dispatch(
            InsertOTOMessages(navigate, dataItem, uploadFileTalk, t, counter),
          )
        }
      } else {
      }

      console.log('Maximum retries reached. Stopping API calls.', counter)
      // Check if maximum retries reached
      if (counter >= 16) {
        console.log('Maximum retries reached. Stopping API calls.')
        setIsRetryAttemptComplete(true)
      }

      // Increment retry count
    } catch (error) {
      console.error('LocalStorageManagement Error', error)
      // Handle error if needed
    }
  }

  //Current MQTT Connection State
  let currentMqttState = localStorage.getItem('MqttConnectionState')

  console.log('mqttState', currentMqttState)

  useEffect(() => {}, [currentMqttState])

  useEffect(() => {
    let interval
    if (talkStateData.OtoMessageFlag === true) {
      let counter = 0
      interval = setInterval(() => {
        console.log('LocalStorageManagement Interval')

        storeDataInAPI(counter, false)
        counter += 4
        if (counter >= 20) {
          clearInterval(interval)
          dispatch(OtoMessageRetryFlag(false))
        }
      }, 4000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [talkStateData.OtoMessageFlag])

  const removeFileFunction = () => {
    setFile('')
    chatMessages.current?.scrollIntoView({ behavior: 'auto' })
  }

  console.log('All Messages State', allMessages)

  // console.log('All Group Messages', allMessages)

  // console.log('All Broadcast messages', allMessages)

  useEffect(() => {
    // Check the condition to trigger the link
    if (
      talkStateData.DownloadChatData.DownloadChatResponse !== null &&
      talkStateData.DownloadChatData.DownloadChatResponse !== undefined &&
      talkStateData.DownloadChatData.DownloadChatResponse.length !== 0
    ) {
      let fileDownloadURL =
        filesUrlTalk +
        talkStateData.DownloadChatData.DownloadChatResponse.filePath
      window.open(fileDownloadURL, '_blank')
      dispatch(downloadChatEmptyObject([]))
    }
  }, [talkStateData?.DownloadChatData?.DownloadChatResponse])

  useEffect(() => {
    // Check the condition to trigger the link
    if (
      talkStateData.MqttMessageDeleteData !== null &&
      talkStateData.MqttMessageDeleteData !== undefined &&
      talkStateData.MqttMessageDeleteData.length !== 0
    ) {
      if (talkStateData.MqttMessageDeleteData.data[0].messageType === 'O') {
        const updatedMessages = allMessages.filter(
          (message) =>
            message.messageID !==
            talkStateData.MqttMessageDeleteData.data[0].messageID,
        )
        setAllMessages(updatedMessages)
      }
      if (talkStateData.MqttMessageDeleteData.data[0].messageType === 'G') {
        const updatedMessages = allMessages.filter(
          (message) =>
            message.messageID !==
            talkStateData.MqttMessageDeleteData.data[0].messageID,
        )
        setAllMessages(updatedMessages)
      }
      if (talkStateData.MqttMessageDeleteData.data[0].messageType === 'B') {
        const updatedMessages = allMessages.filter(
          (message) =>
            message.messageID !==
            talkStateData.MqttMessageDeleteData.data[0].messageID,
        )
        setAllMessages(updatedMessages)
      }
    }
  }, [talkStateData?.MqttMessageDeleteData])

  useEffect(() => {}, [activeCall])

  const initiateOtoCall = () => {
    console.log('InitiateOTOCall', talkStateData.ActiveChatData)
    let recipientData = {
      userID: talkStateData.ActiveChatData.id,
      userName: talkStateData.ActiveChatData.fullName,
      email: '',
      designation: '',
      organizationName: talkStateData.ActiveChatData.companyName,
      profilePicture: {
        profilePictureID: '',
        displayProfilePictureName: '',
        orignalProfilePictureName: '',
        creationDate: '',
        creationTime: '',
      },
      userRole: {
        roleID: 1,
        role: 'Board Member',
      },
      userStatus: {
        statusID: 1,
        status: 'Enabled',
      },
    }
    dispatch(getVideoRecipentData(recipientData))
    let Data = {
      RecipentIDs: [talkStateData.ActiveChatData.id],
      CallTypeID: 1,
      OrganizationID: Number(currentOrganizationId),
    }
    localStorage.setItem('CallType', Data.CallTypeID)
    dispatch(InitiateVideoCall(Data, navigate, t))
    localStorage.setItem('activeCall', true)
    localStorage.setItem('callerID', Number(currentUserId))
    localStorage.setItem('recipentCalledID', talkStateData.ActiveChatData.id)
    dispatch(callRequestReceivedMQTT({}, ''))
    dispatch(normalizeVideoPanelFlag(true))
    dispatch(videoChatPanel(false))
    // dispatch(videoChatMessagesFlag(false))
    dispatch(resetCloseChatFlags())
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
    setShowEditShoutField(false)
    setEmojiActive(false)
    setAddNewChat(false)
    setActiveCreateGroup(false)
    setActiveCreateShoutAll(false)
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
    setDeleteFlag(false)
    setForwardFlag(false)
    setEndDatedisable(false)
    setDeleteChat(false)
    setUploadOptions(false)
    setChatFeatureActive(0)
    setReplyFeature(false)
    setShowChatSearch(false)
    setAllMessages([])
    setMessageSendData({
      ...messageSendData,
      Body: '',
    })
    localStorage.setItem('activeChatID', null)
    localStorage.setItem('activeOtoChatID', 0)
  }

  const initiateGroupCall = () => {
    let newArray = []
    let originalArray =
      talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
        .groupUsers
    for (let i = 0; i < originalArray.length; i++) {
      let newObj = {
        userID: originalArray[i].userID,
        userName: originalArray[i].userName,
        email: originalArray[i].userEmail,
        designation: '',
        organizationName: originalArray[i].companyName,
        profilePicture: {
          profilePictureID: 0,
          displayProfilePictureName: '',
          orignalProfilePictureName: '',
          creationDate: '',
          creationTime: '',
        },
        userRole: {
          roleID: 1,
          role: 'Board Member',
        },
        userStatus: {
          statusID: 1,
          status: 'Enabled',
        },
      }
      newArray.push(newObj)
    }
    const filteredArray = newArray.filter(
      (item) => item.userID !== Number(currentUserId),
    )

    const recipientIDs = filteredArray.map((item) => item.userID)

    let Data = {
      RecipentIDs: recipientIDs,
      CallTypeID: 2,
      OrganizationID: Number(currentOrganizationId),
    }
    localStorage.setItem('CallType', Data.CallTypeID)
    dispatch(InitiateVideoCall(Data, navigate, t))
    localStorage.setItem('activeCall', true)
    localStorage.setItem('callerID', Number(currentUserId))
    dispatch(callRequestReceivedMQTT({}, ''))
    dispatch(groupCallRecipients(filteredArray))
    // dispatch(getVideoRecipentData(userData))
    dispatch(normalizeVideoPanelFlag(true))
    dispatch(videoChatPanel(false))
    dispatch(resetCloseChatFlags())
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
    setShowEditShoutField(false)
    setEmojiActive(false)
    setAddNewChat(false)
    setActiveCreateGroup(false)
    setActiveCreateShoutAll(false)
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
    setDeleteFlag(false)
    setForwardFlag(false)
    setEndDatedisable(false)
    setDeleteChat(false)
    setUploadOptions(false)
    setChatFeatureActive(0)
    setReplyFeature(false)
    setShowChatSearch(false)
    setAllMessages([])
    setMessageSendData({
      ...messageSendData,
      Body: '',
    })
    localStorage.setItem('activeChatID', null)
    localStorage.setItem('activeOtoChatID', 0)
  }

  // useEffect(() => {
  //   const updatedMessages = allMessages.map((message) => ({
  //     ...message,
  //     messageStatus: 'Seen',
  //   }))

  //   setAllMessages(updatedMessages)
  // }, [])

  // console.log('LeaveGroup talkStateData', talkStateData)

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
                    deleteMessage === true
                      ? 'chat-header applyBlur'
                      : 'chat-header'
                  }
                >
                  <Row>
                    <Col lg={1} md={1} sm={12}>
                      <div className="chat-profile-icon">
                        {talkStateData.ActiveChatData.messageType === 'O' ? (
                          <img draggable="false" src={SingleIcon} width={25} />
                        ) : talkStateData.ActiveChatData.messageType === 'G' ? (
                          <img draggable="false" src={GroupIcon} width={30} />
                        ) : talkStateData.ActiveChatData.messageType === 'B' ? (
                          <img draggable="false" src={ShoutIcon} width={20} />
                        ) : null}
                        {/* <span className="user-active-status"></span> */}
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
                    <Col lg={1} md={1} sm={12}>
                      {' '}
                      {/* <div className="chat-box-security">
                        <img draggable="false" src={SecurityIcon} />
                      </div> */}
                    </Col>
                    <Col lg={1} md={1} sm={12}>
                      {' '}
                      <div className="chat-box-icons">
                        <img
                          draggable="false"
                          onClick={showChatSearchHandler}
                          src={SearchChatIcon}
                        />
                      </div>
                    </Col>
                    <Col lg={1} md={1} sm={12}>
                      {' '}
                      <div
                        className="chat-box-icons cursor-pointer positionRelative"
                        ref={chatMenuRef}
                        onClick={activateChatMenu}
                      >
                        <img draggable="false" src={MenuIcon} />
                        {chatMenuActive && (
                          <div className="dropdown-menus-chat">
                            {talkStateData.ActiveChatData.messageType ===
                              'O' && (
                              <>
                                <span
                                  onClick={() =>
                                    modalHandlerSave(
                                      talkStateData.ActiveChatData,
                                    )
                                  }
                                >
                                  {t('Save')}
                                </span>
                                <span
                                  onClick={() =>
                                    modalHandlerPrint(
                                      talkStateData.ActiveChatData,
                                    )
                                  }
                                >
                                  {t('Print')}
                                </span>
                                <span
                                  style={{ borderBottom: 'none' }}
                                  onClick={() =>
                                    modalHandlerEmail(
                                      talkStateData.ActiveChatData,
                                    )
                                  }
                                >
                                  {t('Email')}
                                </span>
                              </>
                            )}
                            {talkStateData.ActiveChatData.messageType ===
                              'G' && (
                              <>
                                <span
                                  onClick={() =>
                                    modalHandlerSave(
                                      talkStateData.ActiveChatData,
                                    )
                                  }
                                >
                                  {t('Save')}
                                </span>
                                <span
                                  onClick={() =>
                                    modalHandlerPrint(
                                      talkStateData.ActiveChatData,
                                    )
                                  }
                                >
                                  {t('Print')}
                                </span>
                                <span
                                  onClick={() =>
                                    modalHandlerEmail(
                                      talkStateData.ActiveChatData,
                                    )
                                  }
                                >
                                  {t('Email')}
                                </span>
                                <span onClick={modalHandlerGroupInfo}>
                                  {t('Group-Info')}
                                </span>
                                <span onClick={deleteMultipleMessages}>
                                  {t('Delete-messages')}
                                </span>
                                <span
                                  onClick={() =>
                                    leaveGroupHandlerChat(
                                      talkStateData.ActiveChatData,
                                    )
                                  }
                                >
                                  {t('Leave-Group')}
                                </span>
                                <span
                                  style={{ borderBottom: 'none' }}
                                  onClick={modalHandlerGroupEdit}
                                >
                                  {t('Edit-Info')}
                                </span>
                              </>
                            )}
                            {talkStateData.ActiveChatData.messageType ===
                              'B' && (
                              <>
                                <span
                                  onClick={() =>
                                    modalHandlerSave(
                                      talkStateData.ActiveChatData,
                                    )
                                  }
                                >
                                  {t('Save')}
                                </span>
                                <span
                                  onClick={() =>
                                    modalHandlerPrint(
                                      talkStateData.ActiveChatData,
                                    )
                                  }
                                >
                                  {t('Print')}
                                </span>
                                <span
                                  onClick={() =>
                                    modalHandlerEmail(
                                      talkStateData.ActiveChatData,
                                    )
                                  }
                                >
                                  {t('Email')}
                                </span>
                                <span onClick={deleteShoutFunction}>
                                  {t('Delete-Shout')}
                                </span>
                                <span onClick={editShoutFunction}>
                                  {t('Edit-Shout')}
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
                              activeChatType === 'O'
                                ? initiateOtoCall
                                : activeChatType === 'G'
                                ? initiateGroupCall
                                : null
                            }
                            draggable="false"
                            src={VideoCallIcon}
                          />
                        </div>
                      </Col>
                    ) : null}
                    <Col lg={1} md={1} sm={12}>
                      {' '}
                      <div
                        className="chat-box-icons closechat"
                        onClick={closeChat}
                      >
                        <img
                          width={14}
                          draggable="false"
                          src={CloseChatIcon}
                          className="cursor-pointer"
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
                      <p className="level-heading">{t('Crypto-Level')}</p>
                    </Col>
                    <Col lg={5} md={5} sm={12} className="positionRelative">
                      <p className="level">{t('NIAP-+-PQC')}</p>

                      <span className="securityicon-box">
                        <img
                          draggable="false"
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
                        placeholder={t('Search-Chat')}
                        labelClass={'d-none'}
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
                        {file === '' ? (
                          <div className="chat-messages-section">
                            {allMessages.length > 0 &&
                            talkStateData.ActiveChatData.messageType === 'O' &&
                            talkStateData.ChatSpinner === false ? (
                              // allMessages.length === 0 &&
                              // allMessages.length === 0
                              allMessages.map((messageData, index) => {
                                var ext = messageData.attachmentLocation
                                  .split('.')
                                  .pop()
                                if (
                                  messageData.senderID ===
                                  parseInt(currentUserId)
                                ) {
                                  return (
                                    <>
                                      <div
                                        key={index}
                                        className="direct-chat-msg text-right mb-2 "
                                      >
                                        <div className="direct-chat-text message-outbox message-box text-start">
                                          <div
                                            className="chatmessage-box-icons"
                                            onClick={() =>
                                              chatFeatureSelected(
                                                messageData,
                                                messageData.messageID,
                                              )
                                            }
                                            ref={
                                              chatMessageRefs[
                                                messageData.messageID
                                              ]
                                            }
                                          >
                                            <img
                                              draggable="false"
                                              className="dropdown-icon"
                                              src={DropDownIcon}
                                            />
                                            {/* {dropeDownModalChat(messageData)} */}
                                            {chatFeatureActive != 0 &&
                                            Number(chatFeatureActive) ===
                                              Number(messageData.messageID) ? (
                                              <>
                                                <div className="dropdown-menus-chatmessage">
                                                  {console.log(
                                                    'chatFeatureSelected',
                                                  )}
                                                  <span
                                                    onClick={() =>
                                                      replyFeatureHandler(
                                                        messageData,
                                                      )
                                                    }
                                                  >
                                                    {t('Reply')}
                                                  </span>
                                                  <span
                                                    onClick={
                                                      forwardFeatureHandler
                                                    }
                                                  >
                                                    {t('Forward')}
                                                  </span>
                                                  <span
                                                    onClick={() =>
                                                      deleteFeatureHandler(
                                                        messageData,
                                                      )
                                                    }
                                                  >
                                                    {t('Delete for me')}
                                                  </span>
                                                  <span
                                                    onClick={() =>
                                                      messageInfoHandler(
                                                        messageData,
                                                      )
                                                    }
                                                  >
                                                    {t('Message-Info')}
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
                                                    {messageData.isFlag ===
                                                    0 ? (
                                                      <>{t('Star-Message')}</>
                                                    ) : (
                                                      <>{t('Unstar-Message')}</>
                                                    )}
                                                  </span>
                                                </div>
                                              </>
                                            ) : null}
                                          </div>
                                          {messageData.frMessages ===
                                          'Direct Message' ? (
                                            <>
                                              {messageData.attachmentLocation !==
                                                '' &&
                                              (ext === 'jpg' ||
                                                ext === 'png' ||
                                                ext === 'jpeg') ? (
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
                                                  '' &&
                                                (ext === 'doc' ||
                                                  ext === 'docx' ||
                                                  ext === 'xls' ||
                                                  ext === 'xlsx' ||
                                                  ext === 'pdf' ||
                                                  ext === 'txt' ||
                                                  ext === 'gif') ? (
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
                                                          '/',
                                                        ) + 1,
                                                      )
                                                      .replace(/^\d+_/, '')}
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
                                                <Keywords
                                                  value={searchChatWord}
                                                  render={highlight}
                                                >
                                                  {messageData.messageBody}
                                                </Keywords>
                                              </span>
                                            </>
                                          ) : messageData.frMessages ===
                                            'Broadcast Message' ? (
                                            <>
                                              {messageData.attachmentLocation !==
                                                '' &&
                                              (ext === 'jpg' ||
                                                ext === 'png' ||
                                                ext === 'jpeg') ? (
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
                                                  '' &&
                                                (ext === 'doc' ||
                                                  ext === 'docx' ||
                                                  ext === 'xls' ||
                                                  ext === 'xlsx' ||
                                                  ext === 'pdf' ||
                                                  ext === 'txt' ||
                                                  ext === 'gif') ? (
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
                                                          '/',
                                                        ) + 1,
                                                      )
                                                      .replace(/^\d+_/, '')}
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
                                                    {
                                                      messageData.sourceMessageBody
                                                    }
                                                  </p>
                                                </div>
                                              )}

                                              <span className="direct-chat-body color-5a5a5a">
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
                                                    draggable="false"
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
                                                    {newTimeFormaterAsPerUTCTalkTime(
                                                      messageData.sentDate,
                                                    )}
                                                  </>
                                                ) : messageData.sentDate.slice(
                                                    0,
                                                    8,
                                                  ) === yesterdayDateUtc ? (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkDate(
                                                      messageData.sentDate,
                                                    ) + ' '}
                                                    | {t('Yesterday')}
                                                  </>
                                                ) : messageData.sentDate ===
                                                  '' ? null : (
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
                                                    draggable="false"
                                                    src={SingleTickIcon}
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  'Delivered' ? (
                                                  <img
                                                    draggable="false"
                                                    src={
                                                      DoubleTickDeliveredIcon
                                                    }
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  'Seen' ? (
                                                  <img
                                                    draggable="false"
                                                    src={DoubleTickIcon}
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  'Undelivered' ? (
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
                                          ref={
                                            chatMessageRefs[
                                              messageData.messageID
                                            ]
                                          }
                                        >
                                          <img
                                            draggable="false"
                                            className="dropdown-icon"
                                            src={DropDownChatIcon}
                                          />
                                          {chatFeatureActive != 0 &&
                                          Number(chatFeatureActive) ===
                                            Number(messageData.messageID) ? (
                                            <div className="dropdown-menus-chatmessage">
                                              <span
                                                onClick={() =>
                                                  replyFeatureHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                {t('Reply')}
                                              </span>
                                              <span
                                                onClick={forwardFeatureHandler}
                                              >
                                                {t('Forward')}
                                              </span>
                                              <span
                                                onClick={() =>
                                                  deleteFeatureHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                {t('Delete for me')}
                                              </span>
                                              <span
                                                onClick={() =>
                                                  messageInfoHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                {t('Message-Info')}
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
                                                  <>{t('Star-Message')}</>
                                                ) : (
                                                  <>{t('Unstar-Message')}</>
                                                )}
                                              </span>
                                            </div>
                                          ) : null}
                                        </div>
                                        {messageData.frMessages ===
                                          'Direct Message' ||
                                        messageData.frMessages ===
                                          'Broadcast Message' ? (
                                          <>
                                            {messageData.attachmentLocation !==
                                              '' &&
                                            (ext === 'jpg' ||
                                              ext === 'png' ||
                                              ext === 'jpeg') ? (
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
                                                '' &&
                                              (ext === 'doc' ||
                                                ext === 'docx' ||
                                                ext === 'xls' ||
                                                ext === 'xlsx' ||
                                                ext === 'pdf' ||
                                                ext === 'txt' ||
                                                ext === 'gif') ? (
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
                                                        '/',
                                                      ) + 1,
                                                    )
                                                    .replace(/^\d+_/, '')}
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
                                                  draggable="false"
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
                                                  {newTimeFormaterAsPerUTCTalkTime(
                                                    messageData.sentDate,
                                                  )}
                                                </>
                                              ) : messageData.sentDate.slice(
                                                  0,
                                                  8,
                                                ) === yesterdayDateUtc ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                  ) + ' '}
                                                  | {t('Yesterday')}
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
                            ) : allMessages.length > 0 &&
                              talkStateData.ActiveChatData.messageType ===
                                'G' &&
                              talkStateData.ChatSpinner === false ? (
                              // allMessages.length === 0 &&
                              // allMessages.length > 0
                              allMessages.map((messageData, index) => {
                                var ext = messageData.attachmentLocation
                                  .split('.')
                                  .pop()
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
                                          ref={
                                            chatMessageRefs[
                                              messageData.messageID
                                            ]
                                          }
                                        >
                                          <img
                                            draggable="false"
                                            className="dropdown-icon"
                                            src={DropDownIcon}
                                          />
                                          {chatFeatureActive != 0 &&
                                          Number(chatFeatureActive) ===
                                            Number(messageData.messageID) ? (
                                            <div className="dropdown-menus-chatmessage">
                                              <span
                                                onClick={() =>
                                                  replyFeatureHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                {t('Reply')}
                                              </span>
                                              <span
                                                onClick={forwardFeatureHandler}
                                              >
                                                {t('Forward')}
                                              </span>
                                              <span
                                                onClick={() =>
                                                  deleteFeatureHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                {t('Delete for me')}
                                              </span>
                                              <span
                                                onClick={() =>
                                                  messageInfoHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                {t('Message-Info')}
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
                                                  <>{t('Star-Message')}</>
                                                ) : (
                                                  <>{t('Unstar-Message')}</>
                                                )}
                                              </span>
                                            </div>
                                          ) : null}
                                        </div>
                                        {messageData.frMessages ===
                                          'Direct Message' ||
                                        messageData.frMessages ===
                                          'Broadcast Message' ? (
                                          <>
                                            {messageData.attachmentLocation !==
                                              '' &&
                                            (ext === 'jpg' ||
                                              ext === 'png' ||
                                              ext === 'jpeg') ? (
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
                                                '' &&
                                              (ext === 'doc' ||
                                                ext === 'docx' ||
                                                ext === 'xls' ||
                                                ext === 'xlsx' ||
                                                ext === 'pdf' ||
                                                ext === 'txt' ||
                                                ext === 'gif') ? (
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
                                                        '/',
                                                      ) + 1,
                                                    )
                                                    .replace(/^\d+_/, '')}
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
                                                  draggable="false"
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
                                                  {newTimeFormaterAsPerUTCTalkTime(
                                                    messageData.sentDate,
                                                  )}
                                                </>
                                              ) : messageData.sentDate.slice(
                                                  0,
                                                  8,
                                                ) === yesterdayDateUtc ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                  ) + ' '}
                                                  | {t('Yesterday')}
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
                                                  draggable="false"
                                                  src={SingleTickIcon}
                                                  alt=""
                                                />
                                              ) : messageData.messageStatus ===
                                                'Delivered' ? (
                                                <img
                                                  draggable="false"
                                                  src={DoubleTickDeliveredIcon}
                                                  alt=""
                                                />
                                              ) : messageData.messageStatus ===
                                                'Seen' ? (
                                                <img
                                                  draggable="false"
                                                  src={DoubleTickIcon}
                                                  alt=""
                                                />
                                              ) : messageData.messageStatus ===
                                                'Undelivered' ? (
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
                                          ref={
                                            chatMessageRefs[
                                              messageData.messageID
                                            ]
                                          }
                                        >
                                          <img
                                            draggable="false"
                                            className="dropdown-icon"
                                            src={DropDownChatIcon}
                                          />
                                          {chatFeatureActive != 0 &&
                                          Number(chatFeatureActive) ===
                                            Number(messageData.messageID) ? (
                                            <div className="dropdown-menus-chatmessage">
                                              <span
                                                onClick={() =>
                                                  replyFeatureHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                {t('Reply')}
                                              </span>
                                              <span
                                                onClick={forwardFeatureHandler}
                                              >
                                                {t('Forward')}
                                              </span>
                                              <span
                                                onClick={() =>
                                                  deleteFeatureHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                {t('Delete for me')}
                                              </span>
                                              <span
                                                onClick={() =>
                                                  messageInfoHandler(
                                                    messageData,
                                                  )
                                                }
                                              >
                                                {t('Message-Info')}
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
                                                  <>{t('Star-Message')}</>
                                                ) : (
                                                  <>{t('Unstar-Message')}</>
                                                )}
                                              </span>
                                            </div>
                                          ) : null}
                                        </div>
                                        {messageData.frMessages ===
                                          'Direct Message' ||
                                        messageData.frMessages ===
                                          'Broadcast Message' ? (
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
                                                  draggable="false"
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
                                                  {newTimeFormaterAsPerUTCTalkTime(
                                                    messageData.sentDate,
                                                  )}
                                                </>
                                              ) : messageData.sentDate.slice(
                                                  0,
                                                  8,
                                                ) === yesterdayDateUtc ? (
                                                <>
                                                  {newTimeFormaterAsPerUTCTalkDate(
                                                    messageData.sentDate,
                                                  ) + ' '}
                                                  | {t('Yesterday')}
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
                            ) : allMessages.length > 0 &&
                              talkStateData.ActiveChatData.messageType ===
                                'B' &&
                              talkStateData.ChatSpinner === false ? (
                              allMessages.map((messageData, index) => {
                                console.log(
                                  'All Broadcast Messages',
                                  messageData,
                                )
                                var ext = messageData.attachmentLocation
                                  .split('.')
                                  .pop()
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
                                            ref={
                                              chatMessageRefs[
                                                messageData.messageID
                                              ]
                                            }
                                          >
                                            <img
                                              draggable="false"
                                              className="dropdown-icon"
                                              src={DropDownIcon}
                                            />
                                            {chatFeatureActive != 0 &&
                                            Number(chatFeatureActive) ===
                                              Number(messageData.messageID) ? (
                                              <div className="dropdown-menus-chatmessage">
                                                <span
                                                  onClick={() =>
                                                    replyFeatureHandler(
                                                      messageData,
                                                    )
                                                  }
                                                >
                                                  {t('Reply')}
                                                </span>
                                                <span
                                                  onClick={
                                                    forwardFeatureHandler
                                                  }
                                                >
                                                  {t('Forward')}
                                                </span>
                                                <span
                                                  onClick={() =>
                                                    deleteFeatureHandler(
                                                      messageData,
                                                    )
                                                  }
                                                >
                                                  {t('Delete for me')}
                                                </span>
                                                <span
                                                  onClick={() =>
                                                    messageInfoHandler(
                                                      messageData,
                                                    )
                                                  }
                                                >
                                                  {t('Message-Info')}
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
                                                    <>{t('Star-Message')}</>
                                                  ) : (
                                                    <>{t('Unstar-Message')}</>
                                                  )}
                                                </span>
                                              </div>
                                            ) : null}
                                          </div>
                                          {messageData.frMessages ===
                                            'Direct Message' ||
                                          messageData.frMessages ===
                                            'Broadcast Message' ? (
                                            <>
                                              {messageData.attachmentLocation !==
                                                '' &&
                                              (ext === 'jpg' ||
                                                ext === 'png' ||
                                                ext === 'jpeg') ? (
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
                                                  '' &&
                                                (ext === 'doc' ||
                                                  ext === 'docx' ||
                                                  ext === 'xls' ||
                                                  ext === 'xlsx' ||
                                                  ext === 'pdf' ||
                                                  ext === 'txt' ||
                                                  ext === 'gif') ? (
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
                                                          '/',
                                                        ) + 1,
                                                      )
                                                      .replace(/^\d+_/, '')}
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
                                                    draggable="false"
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
                                                    {newTimeFormaterAsPerUTCTalkTime(
                                                      messageData.sentDate,
                                                    )}
                                                  </>
                                                ) : messageData.sentDate.slice(
                                                    0,
                                                    8,
                                                  ) === yesterdayDateUtc ? (
                                                  <>
                                                    {newTimeFormaterAsPerUTCTalkDate(
                                                      messageData.sentDate,
                                                    ) + ' '}
                                                    | {t('Yesterday')}
                                                  </>
                                                ) : messageData.sentDate ===
                                                  '' ? null : (
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
                                                    draggable="false"
                                                    src={SingleTickIcon}
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  'Delivered' ? (
                                                  <img
                                                    draggable="false"
                                                    src={
                                                      DoubleTickDeliveredIcon
                                                    }
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  'Seen' ? (
                                                  <img
                                                    draggable="false"
                                                    src={DoubleTickIcon}
                                                    alt=""
                                                  />
                                                ) : messageData.messageStatus ===
                                                  'Undelivered' ? (
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
                                    ? 'You'
                                    : replyData.senderName}
                                  <br />
                                </span>
                                {replyData.messageBody}
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
                                {' '}
                                <div className="chat-modal-Heading">
                                  <h1>{t('Save-Messages')}</h1>
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
                                    {t('Today')}
                                  </Checkbox>
                                  <Checkbox
                                    checked={allCheckState}
                                    onChange={onChangeAll}
                                  >
                                    {t('All')}
                                  </Checkbox>
                                  <Checkbox
                                    checked={customCheckState}
                                    onChange={onChangeCustom}
                                  >
                                    {t('Custom')}
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
                                        locale={enUS}
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
                                        placeholder={t('Select Date')}
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
                                  className="MontserratSemiBold Ok-btn"
                                  text={t('Okay')}
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
                                {' '}
                                <div className="chat-modal-Heading">
                                  <h1>{t('Print-Messages')}</h1>
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
                                    {t('Today')}
                                  </Checkbox>
                                  <Checkbox
                                    checked={allCheckState}
                                    onChange={onChangeAll}
                                  >
                                    {t('All')}
                                  </Checkbox>
                                  <Checkbox
                                    checked={customCheckState}
                                    onChange={onChangeCustom}
                                  >
                                    {t('Custom')}
                                  </Checkbox>
                                </div>
                                {customCheckState === true ? (
                                  <Row>
                                    <Col lg={6} md={6} sm={12}>
                                      <label style={{ marginLeft: '5px' }}>
                                        <b style={{ fontSize: '0.7rem' }}>
                                          {t('Date-From')}
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
                                        placeholder={t('Select-Date')}
                                        change={onChangeDate}
                                      />
                                    </Col>
                                    <Col lg={6} md={6} sm={12}>
                                      <label style={{ marginLeft: '5px' }}>
                                        <b style={{ fontSize: '0.7rem' }}>
                                          {t('Date-To')}
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
                                        placeholder={t('Select-Date')}
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
                                  text={t('Okay')}
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
                                {' '}
                                <div className="chat-modal-Heading">
                                  <h1>{t('Email-Messages')}</h1>
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
                                    {t('Today')}
                                  </Checkbox>
                                  <Checkbox
                                    checked={allCheckState}
                                    onChange={onChangeAll}
                                  >
                                    {t('All')}
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
                          {file === '' &&
                          tasksAttachments.TasksAttachments.length > 0 ? (
                            <div className="uploaded-file-section">
                              <div className="file-upload">
                                <Row>
                                  {tasksAttachments.TasksAttachments.length > 0
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
                          {file === '' ? (
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
                                    {/* <div className="file-upload-options">
                                      <label
                                        className="image-upload"
                                        htmlFor="document-upload"
                                      >
                                        <img
                                          draggable="false"
                                          src={UploadContact}
                                          alt=""
                                        />
                                      </label>
                                      <input
                                        id="document-upload"
                                        type="file"
                                        onChange={(event) =>
                                          handleFileUpload(event, 'document')
                                        }
                                        onClick={(event) => {
                                          event.target.value = null
                                        }}
                                        maxfilesize={10000000}
                                        accept=".doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg, .gif"
                                        style={{ display: 'none' }}
                                      />
                                    </div> */}
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
                                          handleFileUpload(event, 'document')
                                        }
                                        onClick={(event) => {
                                          event.target.value = null
                                        }}
                                        maxfilesize={10000000}
                                        accept=".doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg, .gif"
                                        style={{ display: 'none' }}
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
                                          handleFileUpload(event, 'document')
                                        }
                                        onClick={(event) => {
                                          event.target.value = null
                                        }}
                                        maxfilesize={10000000}
                                        accept=".doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg, .gif"
                                        style={{ display: 'none' }}
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
                                          handleFileUpload(event, 'image')
                                        }
                                        onClick={(event) => {
                                          event.target.value = null
                                        }}
                                        maxfilesize={10000000}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                      />
                                    </div>
                                  </div>
                                ) : null}
                              </span>
                            </div>
                          ) : null}

                          <div
                            className={
                              file === ''
                                ? 'chat-input-field'
                                : 'chat-input-field no-upload-options'
                            }
                          >
                            <Form>
                              <Form.Control
                                ref={inputRef}
                                value={messageSendData.Body}
                                className="chat-message-input"
                                name="ChatMessage"
                                placeholder={'Type a Message'}
                                maxLength={200}
                                onChange={chatMessageHandler}
                                autoComplete="off"
                                disabled={
                                  talkStateData.ActiveChatData.isBlock === 1
                                    ? true
                                    : false
                                }
                                autoFocus={inputChat}
                                style={{ resize: 'none', height: '100%' }} // Update the style of the input field
                                as="textarea" // Use textarea instead of input for multi-line input
                                rows={1} // Start with a single row
                                onInput={autoResize} // Call autoResize function when input changes
                                onKeyPress={(event) => {
                                  // Check if the key pressed is "Enter" (keyCode 13) and trigger sendChat function
                                  if (event.key === 'Enter') {
                                    event.preventDefault() // Prevent the default behavior (e.g., new line)
                                    sendChat() // Call your sendChat function
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
                        <Button
                          className="MontserratSemiBold Ok-btn"
                          text="Forward"
                          onClick={
                            forwardMessageUsersSection === true
                              ? submitForwardMessages
                              : () => setForwardMessageUsersSection(true)
                          }
                          disableBtn={messagesChecked.length > 0 ? false : true}
                        />
                      ) : deleteFlag === true ? (
                        <Button
                          className="MontserratSemiBold Ok-btn"
                          text="Delete"
                          onClick={deleteMultipleMessagesButton}
                          disableBtn={messagesChecked.length > 0 ? false : true}
                        />
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
                      <img
                        draggable="false"
                        src={DoubleTickDeliveredIcon}
                        alt=""
                      />
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
                      <img draggable="false" src={DoubleTickIcon} alt="" />
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
                      draggable="false"
                      onClick={cancelForwardSection}
                      src={CloseChatIcon}
                      width={10}
                      className="cursor-pointer"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} style={{ marginBottom: '10px' }}>
                    <TextField
                      maxLength={200}
                      applyClass="form-control2"
                      name="Name"
                      change={(e) => {
                        searchChat(e.target.value)
                      }}
                      value={searchChatValue}
                      placeholder="Search Users"
                      labelClass={'d-none'}
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
                                      <img
                                        draggable="false"
                                        src={SingleIcon}
                                        width={15}
                                      />
                                    </>
                                  ) : dataItem.messageType === 'G' ? (
                                    <>
                                      <img
                                        draggable="false"
                                        src={GroupIcon}
                                        width={15}
                                      />
                                    </>
                                  ) : dataItem.messageType === 'B' ? (
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
                        ? ''
                        : groupInfoData[0].name}
                    </p>
                    <p className="groupinfo-createdon m-0">
                      Created on:{' '}
                      {groupInfoData === undefined || groupInfoData.length === 0
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
                  <Col lg={12} md={12} sm={12} style={{ marginBottom: '5px' }}>
                    <TextField
                      maxLength={200}
                      applyClass="form-control2"
                      name="Name"
                      change={(e) => {
                        searchGroupInfoUser(e.target.value)
                      }}
                      value={searchGroupUserInfoValue}
                      placeholder="Search Users"
                      labelClass={'d-none'}
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
                        placeholder={'Group Name'}
                        maxLength={200}
                        change={groupNameHandler}
                        autoComplete="off"
                        labelClass={'d-none'}
                      />
                    </Col>
                  )}
                  <Col lg={2} md={2} sm={12} className="text-end"></Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} style={{ marginBottom: '5px' }}>
                    <TextField
                      maxLength={200}
                      applyClass="form-control2"
                      name="Name"
                      change={(e) => {
                        searchGroupEditUser(e.target.value)
                      }}
                      value={searchGroupUserInfoValue}
                      placeholder="Search Users"
                      labelClass={'d-none'}
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
                                          (item) => item.userID === dataItem.id,
                                        )))
                                      ? true
                                      : false
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
                        )
                      })
                    : null}
                </div>
                <Row>
                  <Col>
                    <div className="edit-group-button">
                      <Button
                        className="MontserratSemiBold Ok-btn forward-user"
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
                        placeholder={'Shout Name'}
                        maxLength={200}
                        change={shoutNameHandler}
                        autoComplete="off"
                        labelClass={'d-none'}
                      />
                    </Col>
                  )}
                  <Col lg={2} md={2} sm={12} className="text-end"></Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} style={{ marginBottom: '5px' }}>
                    <TextField
                      maxLength={200}
                      applyClass="form-control2"
                      name="Name"
                      change={(e) => {
                        searchShoutEditUser(e.target.value)
                      }}
                      value={searchUserShoutValue}
                      placeholder="Search Users"
                      labelClass={'d-none'}
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
                                    Array.isArray(editShoutUsersChecked) &&
                                    (editShoutUsersChecked.some(
                                      (item) => item === dataItem.id,
                                    ) ||
                                      (Array.isArray(shoutAllUsersData) &&
                                        shoutAllUsersData.some(
                                          (item) => item.userID === dataItem.id,
                                        )))
                                      ? true
                                      : false
                                  }
                                  onChange={() =>
                                    editShoutUsersCheckedHandler(
                                      dataItem,
                                      dataItem.id,
                                      index,
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
                        )
                      })
                    : null}
                </div>
                <Row>
                  <Col>
                    <div className="edit-group-button">
                      <Button
                        className="MontserratSemiBold Ok-btn forward-user"
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
  )
}

export default ChatMainBody
