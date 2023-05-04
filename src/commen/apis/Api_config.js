const signuprequest = {
  RequestMethod: 'ServiceManager.SignUp',
}

const signinauthenication = {
  RequestMethod: 'ServiceManager.Login',
}

const forgetpassword = {
  RequestMethod: 'ServiceManager.ForgotPassword',
}

const verifyotp = {
  RequestMethod: 'ServiceManager.VerifyOTP',
}

const verifyOTPSignUp = {
  RequestMethod: 'ServiceManager.OTPVerification',
}

const resendOTP = {
  RequestMethod: 'ServiceManager.GenerateOTP',
}

const resendOTPForgotPassword = {
  RequestMethod: 'ServiceManager.ResendPassConfirmationOTP',
}

const changepassword = {
  RequestMethod: 'ServiceManager.ChangePassword',
}

const authenticationRefreshToken = {
  RequestMethod: 'ServiceManager.RefreshToken',
}

// schedule new metings
const scheduleNewMeeting = {
  RequestMethod: 'ServiceManager.ScheduleNewMeeting',
}
// update metings
const updateMeeting = {
  RequestMethod: 'ServiceManager.UpdateMeeting',
}
//To-Do List APIs
//Get List By ID
const getToDoListByUserID = {
  RequestMethod: 'ServiceManager.GetToDoListByUserID',
}

//Create To-Do List
const createToDoList = {
  RequestMethod: 'ServiceManager.CreateToDoList',
}

//Create To-Do List
const uploadDocument = {
  RequestMethod: 'ServiceManager.UploadDocument',
}

//Get All Assignees for To-Do List
const getAllAssigneesToDoList = {
  RequestMethod: 'ServiceManager.GetAllAssignees',
}

// ali work
const getUserSettings = {
  RequestMethod: 'ServiceManager.GetUserSettings',
}
const updateUserNotificationSetting = {
  RequestMethod: 'ServiceManager.UpdateUserNotificationSettings',
}
const updateUserGeneralSetting = {
  RequestMethod: 'ServiceManager.UpdateUserGeneralSettings',
}
const updateUserProfileSetting = {
  RequestMethod: 'ServiceManager.UpdateUserProfileSettings',
}
const getUserNotifcations = {
  RequestMethod: 'ServiceManager.GetUserNotifications',
}
const getCountryCode = {
  RequestMethod: 'ServiceManager.GetAllCountryCodes',
}
const getTimeZOne = {
  RequestMethod: 'ServiceManager.GetAllTimeZones',
}
// aun
//Get FAQ's
const getFaqs = {
  RequestMethod: 'ServiceManager.GetFAQs',
}

//aun
// Get Meeting Id By User id
const getMeetingId = {
  RequestMethod: 'ServiceManager.GetMeetingsByUserID',
}

//startMeeting
const startMeeting = {
  RequestMethod: 'ServiceManager.StartMeeting',
}

//endMeeting
const endMeeting = {
  RequestMethod: 'ServiceManager.EndMeeting',
}

// schedule View metings
const getMeetingByMeetingID = {
  RequestMethod: 'ServiceManager.GetMeetingByMeetingID',
}

// View To-Do List
const getToDoListByToDoListID = {
  RequestMethod: 'ServiceManager.GetToDoListByToDoListID',
}

// Edit To-Do List
const updateToDoList = {
  RequestMethod: 'ServiceManager.UpdateToDoList',
}

// Edit To-Do List
const cancelMeeting = {
  RequestMethod: 'ServiceManager.CancelMeeting',
}
// Get Data for Calender

const calendarDataRequest = {
  RequestMethod: 'ServiceManager.GetMeetingEventsByUserId',
}

//search todolist by userId
const searchTodoList = {
  RequestMethod: 'ServiceManager.SearchToDoList',
}

// search Meeting Id By User id
const searchMeetingId = {
  RequestMethod: 'ServiceManager.SearchMeetings',
}

const todosStatus = {
  RequestMethod: 'ServiceManager.GetAllTodoStatus',
}
const updateTodoStatus = {
  RequestMethod: 'ServiceManager.UpdateTaskStatus',
}

//Download File
const downloadDocument = {
  RequestMethod: 'ServiceManager.FileDownload',
}

const postComment = {
  RequestMethod: 'ServiceManager.CreateComment',
}

//Dashboard APIs
//Meeting Count
const getWeekMeetings = {
  RequestMethod: 'ServiceManager.GetWeekMeetings',
}

//Upcoming Events
const upcomingEvents = {
  RequestMethod: 'ServiceManager.GetUpcomingMeetingEventsByUserId',
}

//Upcoming Events
const getWeekToDo = {
  RequestMethod: 'ServiceManager.GetNumberOfToDoListInWeekByUserIDAndDate',
}

const getAttachmentByMeetingId = {
  RequestMethod: 'ServiceManager.GetAgendaAttachmentsByMeetingId',
}
const getAgendasByMeetingId = {
  RequestMethod: 'ServiceManager.GetMeetingAgendasByMeetingId',
}
const updateAgendaAttachments = {
  RequestMethod: 'ServiceManager.AgendaAttachments',
}

const getAllReminders = {
  RequestMethod: 'ServiceManager.GetMeetingReminders',
}
const addMinuteofMeetings = {
  RequestMethod: 'ServiceManager.RecordMinutesofMeeting',
}
const updateMinuteofMeetings = {
  RequestMethod: 'ServiceManager.UpdateRecordMinutesofMeeting',
}
const getCountryNames = {
  RequestMethod: 'ServiceManager.GetWorldCountries',
}
const getSubscriptionDetailRequestMethod = {
  RequestMethod: 'ServiceManager.GetSubscriptionPackages',
}
const createOrganizationRequestMethod = {
  RequestMethod: 'ServiceManager.SaveOrganizationAndSelectedPackage',
}
const userEmailVerification = {
  RequestMethod: 'ServiceManager.UserEmailVerification',
}
const userPasswordCreation = {
  RequestMethod: 'ServiceManager.UserPasswordCreation',
}
const userEmailValidation = {
  RequestMethod: 'ServiceManager.LoginWithEmail',
}
const userPasswordVerify = {
  RequestMethod: 'ServiceManager.PasswordVerification',
}
const getSelectedPacakge_Detail = {
  RequestMethod: 'ServiceManager.GetOrganizationSeletedPackage',
}
// For Check Is Organization Exsists or NOT
const IsOrganizationExsists = {
  RequestMethod: 'ServiceManager.IsOrganizationExsists',
}
// For Check Is Organization Email Exsists or NOT
const IsOrganizationEmailExsists = {
  RequestMethod: 'ServiceManager.IsUserEmailExsists',
}

// schedule View metings
const OrganizationUserListStatistics = {
  RequestMethod: 'ServiceManager.OrganizationUserListStatistics',
}
// schedule AddOrganizationUser
const AddOrganizationUser = {
  RequestMethod: 'ServiceManager.AddOrganizationUser',
}
// schedule GetAllOrganizationRoles
const getAllOrganizationRoles = {
  RequestMethod: 'ServiceManager.GetAllOrganizationRoles',
}
// schedule GetAllUserRoles
const getAllUserRoles = {
  RequestMethod: 'ServiceManager.GetAllUserRoles',
}
// schedule GetAllUserRoles
const getOrganizationByID = {
  RequestMethod: 'ServiceManager.GetOrganizationByID',
}
// GET AddOrganizationUser
const allOrganizationUsers = {
  RequestMethod: 'ServiceManager.AllOrganizationUsers',
}
// schedule GetAllUserRoles
const getAllUserStatus = {
  RequestMethod: 'ServiceManager.GetAllUserStatus',
}

//  Edit Organization User
const editOrganizationUser = {
  RequestMethod: 'ServiceManager.EditOrganizationUser',
}

// Dlete Organization User
const deleteOrganizationUser = {
  RequestMethod: 'ServiceManager.DeleteOrganizationUser',
}

const IsPackageExpiryDetail = {
  RequestMethod: 'ServiceManager.GetOrganizationSelectedPackageExpiryDetails',
}
const AllMeetingOrganization = {
  RequestMethod: 'ServiceManager.AllOrganizationMeetings',
}
const OrganizationMeetingStatus = {
  RequestMethod: 'ServiceManager.OrganizationMeetingStatusUpdate',
}

const deleteOrganizationMeeting = {
  RequestMethod: 'ServiceManager.DeleteOrganizationMeeting',
}
const updateOrganizationLevelSettings = {
  RequestMethod: 'ServiceManager.UpdateOrganizationSettings',
}
const getOrganizationLevelSettings = {
  RequestMethod: 'ServiceManager.GetOrganizationSettings',
}
const GetOrganizationSeletedPackageByOrganizationID = {
  RequestMethod: 'ServiceManager.GetOrganizationSeletedPackageByOrganizationID',
}
const GetSubscriptionPackagesByOrganizationID = {
  RequestMethod: 'ServiceManager.GetSubscriptionPackagesByOrganizationID',
}
const getMeetingStatus = {
  RequestMethod: 'ServiceManager.GetMeetingStatus',
}
const cancelSubscription = {
  RequestMethod: 'ServiceManager.CancelOrganizationSubscription',
}
const updateSubscriptionPackage = {
  RequestMethod: 'ServiceManager.UpgradeOrganizationSubscription',
}
const updateOrganizationUserSetting = {
  RequestMethod: 'ServiceManager.UpdateOrganizationUserSettings',
}
const OrganizationPackageReselection = {
  RequestMethod: 'ServiceManager.OrganizationPackageReselection',
}
const TwoFaAuthenticateRequestMethod = {
  RequestMethod: 'ServiceManager.Authenticate2FA',
}
const sendTwoFacOTP = {
  RequestMethod: 'ServiceManager.Send2FAOTP',
}
const verifyTwoFacOTP = {
  RequestMethod: 'ServiceManager.Verify2FAOTP',
}
const resendTwoFacOTP = {
  RequestMethod: 'ServiceManager.Resend2FAOTP',
}

//for get Admin customer info userDetails organization Api
const CustomerInfoOrganization = {
  RequestMethod: 'ServiceManager.GetOrganizationDetails',
}

const updateCustomerOrganizationProfile = {
  RequestMethod: 'ServiceManager.UpdateOrganizationProfile',
}

const passswordUpdationOnForgetPassword = {
  RequestMethod: 'ServiceManager.PasswordUpdationOnForgetPassword',
}

const revokeProcess = {
  RequestMethod: 'ServiceManager.RevokeCancelation',
}
const getuserdetails = {
  RequestMethod: 'ServiceManager.GetUserDetails',
}

const updateProfileData = {
  RequestMethod: 'ServiceManager.UpdateUserProfile',
}
const deleteOrganizationAPI = {
  RequestMethod: 'ServiceManager.DeleteOrganization',
}
const SavesNotesRequestMethod = {
  RequestMethod: 'ServiceManager.SaveNotes',
}
const GetNotesByUserIDAndOrganizationID = {
  RequestMethod: 'ServiceManager.GetNotesByUserIDAndOrganizationID',
}
const UpdateNotesRequestMethod = {
  RequestMethod: 'ServiceManager.UpdateNotes',
}
const GetNotesByNotesIDRequestMethod = {
  RequestMethod: 'ServiceManager.GetNotesByNotesID',
}

//Refresh Token Talk
const refreshTokenTalk = {
  // RequestMethod: "ServiceManager.GetRecentAllMessagesWithUserDetails",
}

//Get All User Chats Talk
const getAllUserChats = {
  RequestMethod: 'ServiceManager.GetRecentAllMessagesWithUserDetails',
}

//GetUserOTOMessages
const getUserOTOMessages = {
  RequestMethod: 'ServiceManager.GetUserOTOMessages',
}

//GetUndeliveredUserOTOMessages
const getUndeliveredUserOTOMessages = {
  RequestMethod: 'ServiceManager.GetUndeliveredUserOTOMessages',
}

//GetGroupMessages
const getGroupMessages = {
  RequestMethod: 'ServiceManager.GetGroupMessages',
}

//Get Broadcast Messages
const getBroadCastMessages = {
  RequestMethod: 'ServiceManager.GetBroadcastMessages',
}

//Get Archived Data By User ID
const getArchivedDataByUserID = {
  RequestMethod: 'ServiceManager.GetRecentArchiveDataByUserID',
}

//Get Flag Messages
const getFlagMessages = {
  RequestMethod: 'ServiceManager.GetRecentFlag',
}

//Get Follow Messages
const getFollowMessages = {
  RequestMethod: 'ServiceManager.GetRecentFollowDataByUserID',
}

//Get Recent Tags
const getAllRecentTags = {
  RequestMethod: 'ServiceManager.GetAllRecentTags',
}

//Get Tags Messages
const getTagsMessages = {
  RequestMethod: 'ServiceManager.GetTagsMessages',
}

//Get Message Seen Receive Time
const getMessageSentReceivedTime = {
  RequestMethod: 'ServiceManager.GetSentReceiveSeenTime',
}

//Get Recent Flag Count
const getRecentFlagCount = {
  RequestMethod: 'ServiceManager.GetRecentFlagCount',
}

//getRecentFollowDataCountByUserID
const getRecentFollowDataCountByUserID = {
  RequestMethod: 'ServiceManager.GetRecentFollowDataCountByUserID',
}

//GetAllRecentTagsCount
const getAllRecentTagsCount = {
  RequestMethod: 'ServiceManager.GetAllRecentTagsCount',
}

//GetAllRecentTagsCount
const getRecentArchiveDataCountByUserID = {
  RequestMethod: 'ServiceManager.GetRecentArchiveDataCountByUserID',
}

//GetBlockedUsersCount
const getBlockedUsersCount = {
  RequestMethod: 'ServiceManager.GetBlockedUsersCount',
}

//getBlockedUsers
const getBlockedUsers = {
  RequestMethod: 'ServiceManager.GetBlockedUsers',
}

//GetAllUsers
const getAllUsers = {
  RequestMethod: 'ServiceManager.GetAllUsers',
}

//GetAllUsersGroupsRoomsList
const getAllUsersGroupsRoomsList = {
  RequestMethod: 'ServiceManager.GetAllUsersGroupsRoomsList',
}

//GetActiveUsersByGroupID
const getActiveUsersByGroupID = {
  RequestMethod: 'ServiceManager.GetActiveUsersByGroupID',
}

//GetActiveUsersByRoomID
const getActiveUsersByRoomID = {
  RequestMethod: 'ServiceManager.GetActiveUsersByRoomID',
}

//GetActiveUsersByBroadcastID
const getActiveUsersByBroadcastID = {
  RequestMethod: 'ServiceManager.GetActiveUsersByBroadcastID',
}

//InsertOTOMessages
const insertOTOMessages = {
  RequestMethod: 'ServiceManager.InsertOTOMessages',
}

const getCommitteeByIdRequestMethod = {
  RequestMethod: 'ServiceManager.GetCommitteeByCommitteeID',
}
const getGroupsByUserIdRequestMethod = {
  RequestMethod: 'ServiceManager.GetGroupByUserID',
}
const getGroupsByGroupIdRequestMethod = {
  RequestMethod: 'ServiceManager.GetGroupByGroupID',
}
const creategroupRequestMethod = {
  RequestMethod: 'ServiceManager.CreateNewGroup',
}
const getAllOrganizationGroupRoles = {
  RequestMethod: 'ServiceManager.GetAllOrganizationGroupRoles',
}
const getAllOrganizationGroupTypes = {
  RequestMethod: 'ServiceManager.GetAllOrgainzationGroupTypes',
}
const updateGroupRequestMethod = {
  RequestMethod: 'ServiceManager.UpdateGroup',
}
const updateGroupStatusRequestMethod = {
  RequestMethod: 'ServiceManager.UpdateGroupStatus',
}
const getCommitteesByUserID = {
  RequestMethod: 'ServiceManager.GetCommitteesByUserID',
}
const getallOrganizationCommitteType = {
  RequestMethod: 'ServiceManager.GetallOrganizationCommitteType',
}
const getallOrganizationCommitteMemberRole = {
  RequestMethod: 'ServiceManager.GetallOrganizationCommitteMemberRole',
}
const createCommitteeRequestMethod = {
  RequestMethod: 'ServiceManager.CreateNewcommittee',
}
const updateCommitteeStatusRequestMethod = {
  RequestMethod: 'ServiceManager.UpdateCommitteeStatus',
}
const updateCommitteeRequestMethod = {
  RequestMethod: 'ServiceManager.UpdateCommittee',
}

const insertPrivateGroupMessage = {
  RequestMethod: 'ServiceManager.InsertGroupMessage',
}

//Block & Unblock User
const blockUnblockUser = {
  RequestMethod: 'ServiceManager.BlockUnBlockUser',
}

const scheduleResolutionRequestMethod = {
  RequestMethod: 'ServiceManager.AddUpdateScheduleResolution',
}

const addUpdateResolutionRequestMethod = {
  RequestMethod: 'ServiceManager.AddUpdateResolutionDetails',
}
const getAllVotingRequestMethod = {
  RequestMethod: 'ServiceManager.GetAllVotingMethod',
}
const getAllVotingStatusRequestMethod = {
  RequestMethod: 'ServiceManager.GetAllResolutionStatus',
}
const getResolutionsRequestMethod = {
  RequestMethod: 'ServiceManager.SearchResolutions',
}

const getResolutionByIDRequestMethod = {
  RequestMethod: 'ServiceManager.GetResolutionByID',
}
//Delete Single Message
const deleteSingleMessage = {
  RequestMethod: 'ServiceManager.SetMessageDelete',
}

//Broadcast Message
const insertBroadcastMessage = {
  RequestMethod: 'ServiceManager.InsertBroadcastMessage',
}

//Create Talk Group
const createTalkPrivateGroup = {
  RequestMethod: 'ServiceManager.InsertGroup',
}

//Get Private Group Members
const getPrivateGroupMembers = {
  RequestMethod: 'ServiceManager.GetActiveUsersByGroupID',
}

const deleteNotes = {
  RequestMethod: 'ServiceManager.DeleteNotes',
}

const getAllOrganizationGroups = {
  RequestMethod: 'ServiceManager.GetAllOrganizationGroups',
}

const CommitteeAndGroupMappingRequestMethod = {
  RequestMethod: 'ServiceManager.CommitteeAndGroupMapping',
}
const getResolutionResultsDetails = {
  RequestMethod: 'ServiceManager.GetResultDetails',
}
const getVoteDetailsByID = {
  RequestMethod: 'ServiceManager.GetVoteDetailsByID',
}
const cancelResolutionRequestMethod = {
  RequestMethod: 'ServiceManager.CancelResolution',
}
const updateVoteRequestMethod = {
  RequestMethod: 'ServiceManager.UpdateVote',
}
const closeResolutionRequestMethod = {
  RequestMethod: 'ServiceManager.CloseResolution',
}

const getBillingInformationRequestMethod = {
  RequestMethod: "ServiceManager.GetBillingInformation"
}
const payOutStandingRequestMethod = {
  RequestMethod: "ServiceManager.PayOustanding"
}

const invoiceandPaymentHistoryRequestMethod = {
  RequestMethod : "ServiceManager.InvoicesAndPaymentHistory"
}
const markStarredMessage = {
  RequestMethod: 'ServiceManager.SetMessageFlag',
}

export {
  signuprequest,
  signinauthenication,
  forgetpassword,
  verifyotp,
  verifyOTPSignUp,
  resendOTP,
  resendOTPForgotPassword,
  changepassword,
  authenticationRefreshToken,
  scheduleNewMeeting,
  getToDoListByUserID,
  createToDoList,
  uploadDocument,
  downloadDocument,
  getAllAssigneesToDoList,
  passswordUpdationOnForgetPassword,
  // ali work
  getUserSettings,
  updateUserNotificationSetting,
  updateUserGeneralSetting,
  updateUserProfileSetting,
  getUserNotifcations,
  getCountryCode,
  getTimeZOne,
  todosStatus,
  updateTodoStatus,
  postComment,
  getAttachmentByMeetingId,
  getAgendasByMeetingId,
  updateAgendaAttachments,
  addMinuteofMeetings,
  updateMinuteofMeetings,
  getCountryNames,
  getSubscriptionDetailRequestMethod,
  createOrganizationRequestMethod,
  userEmailVerification,
  userPasswordCreation,
  userEmailValidation,
  userPasswordVerify,
  getSelectedPacakge_Detail,
  IsPackageExpiryDetail,
  updateOrganizationLevelSettings,
  getOrganizationLevelSettings,
  GetOrganizationSeletedPackageByOrganizationID,
  GetSubscriptionPackagesByOrganizationID,
  cancelSubscription,
  updateSubscriptionPackage,
  updateOrganizationUserSetting,
  // Aun
  getFaqs,
  getMeetingId,
  // view meetings
  getMeetingByMeetingID,
  getToDoListByToDoListID,
  updateMeeting,
  updateToDoList,
  cancelMeeting,
  startMeeting,
  endMeeting,
  // calender data
  calendarDataRequest,
  searchTodoList,
  searchMeetingId,
  //Dashboard APIs
  getWeekMeetings,
  upcomingEvents,
  getWeekToDo,
  getAllReminders,
  // organisation check
  IsOrganizationExsists,
  IsOrganizationEmailExsists,
  OrganizationUserListStatistics,
  AddOrganizationUser,
  getAllUserRoles,
  getAllOrganizationRoles,
  getOrganizationByID,
  allOrganizationUsers,
  getAllUserStatus,
  editOrganizationUser,
  deleteOrganizationUser,
  AllMeetingOrganization,
  OrganizationMeetingStatus,
  deleteOrganizationMeeting,
  getMeetingStatus,
  OrganizationPackageReselection,
  TwoFaAuthenticateRequestMethod,
  sendTwoFacOTP,
  verifyTwoFacOTP,
  resendTwoFacOTP,
  revokeProcess,
  // CustomerInfo
  CustomerInfoOrganization,
  updateCustomerOrganizationProfile,
  getuserdetails,
  updateProfileData,
  deleteOrganizationAPI,
  //notes implementation
  SavesNotesRequestMethod,
  GetNotesByUserIDAndOrganizationID,
  UpdateNotesRequestMethod,
  GetNotesByNotesIDRequestMethod,
  //talk implementation
  refreshTokenTalk,
  getAllUserChats,
  getUserOTOMessages,
  getUndeliveredUserOTOMessages,
  getGroupMessages,
  getBroadCastMessages,
  getArchivedDataByUserID,
  getFlagMessages,
  getFollowMessages,
  getAllRecentTags,
  getTagsMessages,
  getMessageSentReceivedTime,
  getRecentFlagCount,
  getRecentFollowDataCountByUserID,
  getAllRecentTagsCount,
  getRecentArchiveDataCountByUserID,
  getBlockedUsersCount,
  getBlockedUsers,
  getAllUsers,
  getAllUsersGroupsRoomsList,
  getActiveUsersByGroupID,
  getActiveUsersByRoomID,
  getActiveUsersByBroadcastID,
  insertOTOMessages,
  getCommitteeByIdRequestMethod,
  getGroupsByUserIdRequestMethod,
  getGroupsByGroupIdRequestMethod,
  creategroupRequestMethod,
  getAllOrganizationGroupRoles,
  getAllOrganizationGroupTypes,
  updateGroupRequestMethod,
  updateGroupStatusRequestMethod,
  getCommitteesByUserID,
  getallOrganizationCommitteType,
  getallOrganizationCommitteMemberRole,
  createCommitteeRequestMethod,
  updateCommitteeStatusRequestMethod,
  updateCommitteeRequestMethod,
  insertPrivateGroupMessage,
  blockUnblockUser,
  scheduleResolutionRequestMethod,
  getAllVotingRequestMethod,
  getAllVotingStatusRequestMethod,
  getResolutionsRequestMethod,
  deleteSingleMessage,
  insertBroadcastMessage,
  addUpdateResolutionRequestMethod,
  deleteNotes,
  getAllOrganizationGroups,
  CommitteeAndGroupMappingRequestMethod,
  getResolutionByIDRequestMethod,
  getResolutionResultsDetails,
  getVoteDetailsByID,
  cancelResolutionRequestMethod,
  updateVoteRequestMethod,
  closeResolutionRequestMethod,
  createTalkPrivateGroup,
  getPrivateGroupMembers,
  invoiceandPaymentHistoryRequestMethod,
  payOutStandingRequestMethod,
  getBillingInformationRequestMethod,
  markStarredMessage
};



