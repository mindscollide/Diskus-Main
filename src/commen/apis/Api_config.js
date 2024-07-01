const signuprequest = {
  RequestMethod: "ServiceManager.SignUp",
};

const signinauthenication = {
  RequestMethod: "ServiceManager.Login",
};

const forgetpassword = {
  RequestMethod: "ServiceManager.ForgotPassword",
};

const verifyOTPSignUp = {
  RequestMethod: "ServiceManager.OTPVerification",
};

const resendOTP = {
  RequestMethod: "ServiceManager.GenerateOTP",
};

const resendOTPForgotPassword = {
  RequestMethod: "ServiceManager.ResendPassConfirmationOTP",
};

const changepassword = {
  RequestMethod: "ServiceManager.ChangePassword",
};

const authenticationRefreshToken = {
  RequestMethod: "ServiceManager.RefreshToken",
};

// schedule new metings
const scheduleNewMeeting = {
  RequestMethod: "ServiceManager.ScheduleNewMeeting",
};
// update metings
const updateMeeting = {
  RequestMethod: "ServiceManager.UpdateMeeting",
};
//To-Do List APIs
//Get List By ID
const getToDoListByUserID = {
  RequestMethod: "ServiceManager.GetToDoListByUserID",
};

//Create To-Do List
const createToDoList = {
  RequestMethod: "ServiceManager.CreateToDoList",
};

//Create To-Do List
const uploadDocument = {
  RequestMethod: "ServiceManager.UploadDocument",
};

//Get All Assignees for To-Do List
const getAllAssigneesToDoList = {
  RequestMethod: "ServiceManager.GetAllAssignees",
};

// ali work
const getUserSettings = {
  RequestMethod: "ServiceManager.GetUserSettings",
};
const updateUserNotificationSetting = {
  RequestMethod: "ServiceManager.UpdateUserNotificationSettings",
};
const updateUserGeneralSetting = {
  RequestMethod: "ServiceManager.UpdateUserGeneralSettings",
};
const updateUserProfileSetting = {
  RequestMethod: "ServiceManager.UpdateUserProfileSettings",
};
const getUserNotifcations = {
  RequestMethod: "ServiceManager.GetUserNotifications",
};
const getCountryCode = {
  RequestMethod: "ServiceManager.GetAllCountryCodes",
};
const getTimeZOne = {
  RequestMethod: "ServiceManager.GetAllTimeZones",
};
// aun
//Get FAQ's
const getFaqs = {
  RequestMethod: "ServiceManager.GetFAQs",
};

//aun
// Get Meeting Id By User id
const getMeetingId = {
  RequestMethod: "ServiceManager.GetMeetingsByUserID",
};

//startMeeting
const startMeeting = {
  RequestMethod: "ServiceManager.StartMeeting",
};

//endMeeting
const endMeeting = {
  RequestMethod: "ServiceManager.EndMeeting",
};

// schedule View metings
const getMeetingByMeetingID = {
  RequestMethod: "ServiceManager.GetMeetingByMeetingID",
};

// View To-Do List
const getToDoListByToDoListID = {
  RequestMethod: "ServiceManager.GetToDoListByToDoListID",
};

// Edit To-Do List
const updateToDoList = {
  RequestMethod: "ServiceManager.UpdateToDoList",
};

// Edit To-Do List
const cancelMeeting = {
  RequestMethod: "ServiceManager.CancelMeeting",
};
// Get Data for Calender

const calendarDataRequest = {
  RequestMethod: "ServiceManager.GetCalenderList",
};

//search todolist by userId
const searchTodoList = {
  RequestMethod: "ServiceManager.SearchToDoList",
};

// search Meeting Id By User id
const searchMeetingId = {
  RequestMethod: "ServiceManager.SearchMeetings",
};

const todosStatus = {
  RequestMethod: "ServiceManager.GetAllTodoStatus",
};
const updateTodoStatus = {
  RequestMethod: "ServiceManager.UpdateTaskStatus",
};

//Download File
const downloadDocument = {
  RequestMethod: "ServiceManager.FileDownload",
};

const postComment = {
  RequestMethod: "ServiceManager.CreateComment",
};

//Dashboard APIs
//Meeting Count
const getWeekMeetings = {
  RequestMethod: "ServiceManager.GetWeekMeetings",
};

//Upcoming Events
const upcomingEvents = {
  RequestMethod: "ServiceManager.GetUpcomingMeetingEventsByUserId",
};

//Upcoming Events
const getWeekToDo = {
  RequestMethod: "ServiceManager.GetNumberOfToDoListInWeekByUserIDAndDate",
};

const getAttachmentByMeetingId = {
  RequestMethod: "ServiceManager.GetAgendaAttachmentsByMeetingId",
};
const getAgendasByMeetingId = {
  RequestMethod: "ServiceManager.GetMeetingAgendasByMeetingId",
};
const updateAgendaAttachments = {
  RequestMethod: "ServiceManager.AgendaAttachments",
};

const getAllReminders = {
  RequestMethod: "ServiceManager.GetMeetingReminders",
};
const addMinuteofMeetings = {
  RequestMethod: "ServiceManager.RecordMinutesofMeeting",
};
const updateMinuteofMeetings = {
  RequestMethod: "ServiceManager.UpdateRecordMinutesofMeeting",
};
const getCountryNames = {
  RequestMethod: "ServiceManager.GetWorldCountries",
};
const getSubscriptionDetailRequestMethod = {
  RequestMethod: "ServiceManager.GetSubscriptionPackages",
};
const createOrganizationRequestMethod = {
  RequestMethod: "ServiceManager.SaveOrganizationAndSelectedPackage",
};
const userEmailVerification = {
  RequestMethod: "ServiceManager.UserEmailVerification",
};
const userPasswordCreation = {
  RequestMethod: "ServiceManager.UsersPasswordCreation",
};
const userEmailValidation = {
  RequestMethod: "ServiceManager.LoginWithUserEmail",
};
const userPasswordVerify = {
  RequestMethod: "ServiceManager.UserPasswordVerification",
  // RequestMethod: "ServiceManager.PasswordVerification",
};
const getSelectedPacakge_Detail = {
  RequestMethod: "ServiceManager.GetOrganizationSeletedPackage",
};
// For Check Is Organization Exsists or NOT
const IsOrganizationExsists = {
  RequestMethod: "ServiceManager.IsOrganizationExsists",
};
// For Check Is Organization Email Exsists or NOT
const IsOrganizationEmailExsists = {
  RequestMethod: "ServiceManager.IsUserEmailExsists",
};

// schedule View metings
const OrganizationUserListStatistics = {
  RequestMethod: "ServiceManager.OrganizationUserListStatistics",
};
// schedule AddOrganizationUser
const AddOrganizationUser = {
  RequestMethod: "ServiceManager.AddOrganizationUser",
};
// schedule GetAllOrganizationRoles
const getAllOrganizationRoles = {
  RequestMethod: "ServiceManager.GetAllOrganizationRoles",
};
// schedule GetAllUserRoles
const getAllUserRoles = {
  RequestMethod: "ServiceManager.GetAllUserRoles",
};
// schedule GetAllUserRoles
const getOrganizationByID = {
  RequestMethod: "ServiceManager.GetOrganizationByID",
};
// GET AddOrganizationUser
const allOrganizationUsers = {
  RequestMethod: "ServiceManager.AllOrganizationUsers",
};
// schedule GetAllUserRoles
const getAllUserStatus = {
  RequestMethod: "ServiceManager.GetAllUserStatus",
};

//  Edit Organization User
const editOrganizationUser = {
  RequestMethod: "ServiceManager.EditOrganizationUser",
};

// Dlete Organization User
const deleteOrganizationUser = {
  RequestMethod: "ServiceManager.DeleteOrganizationUser",
};

const IsPackageExpiryDetail = {
  RequestMethod: "ServiceManager.GetOrganizationSubscriptionExpiryDetails",
};
const AllMeetingOrganization = {
  RequestMethod: "ServiceManager.SearchOrganizationMeetings",
};
const OrganizationMeetingStatus = {
  RequestMethod: "ServiceManager.OrganizationMeetingStatusUpdate",
};

const deleteOrganizationMeeting = {
  RequestMethod: "ServiceManager.DeleteOrganizationMeeting",
};
const updateOrganizationLevelSettings = {
  RequestMethod: "ServiceManager.UpdateOrganizationSettings",
};
const getOrganizationLevelSettings = {
  RequestMethod: "ServiceManager.GetOrganizationSettings",
};
const GetOrganizationSeletedPackageByOrganizationID = {
  RequestMethod: "ServiceManager.GetOrganizationSeletedPackageByOrganizationID",
};
const GetSubscriptionPackagesByOrganizationID = {
  RequestMethod: "ServiceManager.GetSubscriptionPackagesForUpgrade",
};
const getMeetingStatus = {
  RequestMethod: "ServiceManager.GetMeetingStatus",
};
const cancelSubscription = {
  RequestMethod: "ServiceManager.CancelOrganizationSubscription",
};
const updateSubscriptionPackage = {
  RequestMethod: "ServiceManager.UpgradeOrganizationSubscription",
};
const updateOrganizationUserSetting = {
  RequestMethod: "ServiceManager.UpdateOrganizationUserSettings",
};
const OrganizationPackageReselection = {
  RequestMethod: "ServiceManager.OrganizationPackageReselection",
};
const TwoFaAuthenticateRequestMethod = {
  RequestMethod: "ServiceManager.Authenticate2FA",
};
const sendTwoFacOTP = {
  RequestMethod: "ServiceManager.Send2FAOTP",
};
const verifyTwoFacOTP = {
  RequestMethod: "ServiceManager.Verify2FAOTP",
};
const resendTwoFacOTP = {
  RequestMethod: "ServiceManager.Resend2FAOTP",
};

//for get Admin customer info userDetails organization Api
const CustomerInfoOrganization = {
  RequestMethod: "ServiceManager.GetOrganizationDetails",
};

const updateCustomerOrganizationProfile = {
  RequestMethod: "ServiceManager.UpdateOrganizationProfile",
};

const passswordUpdationOnForgetPassword = {
  RequestMethod: "ServiceManager.PasswordUpdationOnForgetPassword",
};

const revokeProcess = {
  RequestMethod: "ServiceManager.RevokeCancelation",
};
const getuserdetails = {
  RequestMethod: "ServiceManager.GetUserDetails",
};

const updateProfileData = {
  RequestMethod: "ServiceManager.UpdateUserProfile",
};
const deleteOrganizationAPI = {
  RequestMethod: "ServiceManager.DeleteOrganization",
};
const SavesNotesRequestMethod = {
  RequestMethod: "ServiceManager.SaveNotes",
};
const GetNotesByUserIDAndOrganizationID = {
  RequestMethod: "ServiceManager.GetNotesByUserIDAndOrganizationID",
};
const UpdateNotesRequestMethod = {
  RequestMethod: "ServiceManager.UpdateNotes",
};
const GetNotesByNotesIDRequestMethod = {
  RequestMethod: "ServiceManager.GetNotesByNotesID",
};

//Refresh Token Talk
const refreshTokenTalk = {
  // RequestMethod: "ServiceManager.GetRecentAllMessagesWithUserDetails",
};

//Get All User Chats Talk
const getAllUserChats = {
  RequestMethod: "ServiceManager.GetRecentAllMessagesWithUserDetails",
};

//GetUserOTOMessages
const getUserOTOMessages = {
  RequestMethod: "ServiceManager.GetUserOTOMessages",
};

//GetUndeliveredUserOTOMessages
const getUndeliveredUserOTOMessages = {
  RequestMethod: "ServiceManager.GetUndeliveredUserOTOMessages",
};

//GetGroupMessages
const getGroupMessages = {
  RequestMethod: "ServiceManager.GetGroupMessages",
};

//Get Broadcast Messages
const getBroadCastMessages = {
  RequestMethod: "ServiceManager.GetBroadcastMessages",
};

//Get Archived Data By User ID
const getArchivedDataByUserID = {
  RequestMethod: "ServiceManager.GetRecentArchiveDataByUserID",
};

//Get Flag Messages
const getFlagMessages = {
  RequestMethod: "ServiceManager.GetRecentFlag",
};

//Get Follow Messages
const getFollowMessages = {
  RequestMethod: "ServiceManager.GetRecentFollowDataByUserID",
};

//Get Recent Tags
const getAllRecentTags = {
  RequestMethod: "ServiceManager.GetAllRecentTags",
};

//Get Tags Messages
const getTagsMessages = {
  RequestMethod: "ServiceManager.GetTagsMessages",
};

//Get Message Seen Receive Time
const getMessageSentReceivedTime = {
  RequestMethod: "ServiceManager.GetSentReceiveSeenTime",
};

//Get Recent Flag Count
const getRecentFlagCount = {
  RequestMethod: "ServiceManager.GetRecentFlagCount",
};

//getRecentFollowDataCountByUserID
const getRecentFollowDataCountByUserID = {
  RequestMethod: "ServiceManager.GetRecentFollowDataCountByUserID",
};

//GetAllRecentTagsCount
const getAllRecentTagsCount = {
  RequestMethod: "ServiceManager.GetAllRecentTagsCount",
};

//GetAllRecentTagsCount
const getRecentArchiveDataCountByUserID = {
  RequestMethod: "ServiceManager.GetRecentArchiveDataCountByUserID",
};

//GetBlockedUsersCount
const getBlockedUsersCount = {
  RequestMethod: "ServiceManager.GetBlockedUsersCount",
};

//getBlockedUsers
const getBlockedUsers = {
  RequestMethod: "ServiceManager.GetBlockedUsers",
};

//GetAllUsers
const getAllUsers = {
  RequestMethod: "ServiceManager.GetAllUsers",
};

//GetAllUsersGroupsRoomsList
const getAllUsersGroupsRoomsList = {
  RequestMethod: "ServiceManager.GetAllUsersGroupsRoomsList",
};

//GetActiveUsersByGroupID
const getActiveUsersByGroupID = {
  RequestMethod: "ServiceManager.GetActiveUsersByGroupID",
};

//GetActiveUsersByRoomID
const getActiveUsersByRoomID = {
  RequestMethod: "ServiceManager.GetActiveUsersByRoomID",
};

//GetActiveUsersByBroadcastID
const getActiveUsersByBroadcastID = {
  RequestMethod: "ServiceManager.GetActiveUsersByBroadcastID",
};

//InsertOTOMessages
const insertOTOMessages = {
  RequestMethod: "ServiceManager.InsertOTOMessages",
};

const getCommitteeByIdRequestMethod = {
  RequestMethod: "ServiceManager.GetCommitteeByCommitteeID",
};
const getGroupsByUserIdRequestMethod = {
  RequestMethod: "ServiceManager.SearchGroups",
};
const getGroupsByGroupIdRequestMethod = {
  RequestMethod: "ServiceManager.GetGroupByGroupID",
};
const creategroupRequestMethod = {
  RequestMethod: "ServiceManager.CreateNewGroup",
};
const getAllOrganizationGroupRoles = {
  RequestMethod: "ServiceManager.GetAllOrganizationGroupRoles",
};
const getAllOrganizationGroupTypes = {
  RequestMethod: "ServiceManager.GetAllOrgainzationGroupTypes",
};
const updateGroupRequestMethod = {
  RequestMethod: "ServiceManager.UpdateGroup",
};
const updateGroupStatusRequestMethod = {
  RequestMethod: "ServiceManager.UpdateGroupStatus",
};
const getCommitteesByUserID = {
  RequestMethod: "ServiceManager.SearchCommittees",
};
const getallOrganizationCommitteType = {
  RequestMethod: "ServiceManager.GetallOrganizationCommitteType",
};
const getallOrganizationCommitteMemberRole = {
  RequestMethod: "ServiceManager.GetallOrganizationCommitteMemberRole",
};
const createCommitteeRequestMethod = {
  RequestMethod: "ServiceManager.CreateNewcommittee",
};
const updateCommitteeStatusRequestMethod = {
  RequestMethod: "ServiceManager.UpdateCommitteeStatus",
};
const updateCommitteeRequestMethod = {
  RequestMethod: "ServiceManager.UpdateCommittee",
};

const insertPrivateGroupMessage = {
  RequestMethod: "ServiceManager.InsertGroupMessage",
};

//Block & Unblock User
const blockUnblockUser = {
  RequestMethod: "ServiceManager.BlockUnBlockUser",
};

const scheduleResolutionRequestMethod = {
  RequestMethod: "ServiceManager.AddUpdateScheduleResolution",
};

const addUpdateResolutionRequestMethod = {
  RequestMethod: "ServiceManager.AddUpdateResolutionDetails",
};
const getAllVotingRequestMethod = {
  RequestMethod: "ServiceManager.GetAllVotingMethod",
};
const getAllVotingStatusRequestMethod = {
  RequestMethod: "ServiceManager.GetAllResolutionStatus",
};
const getResolutionsRequestMethod = {
  RequestMethod: "ServiceManager.SearchResolutions",
};

const getVoterResolutionRequestMethod = {
  RequestMethod: "ServiceManager.SearchVoterResolutions",
};
const getResolutionByIDRequestMethod = {
  RequestMethod: "ServiceManager.GetResolutionByID",
};
//Delete Single Message
const deleteSingleMessage = {
  RequestMethod: "ServiceManager.SetMessageDelete",
};

//Broadcast Message
const insertBroadcastMessage = {
  RequestMethod: "ServiceManager.InsertBroadcastMessage",
};

//Create Talk Group
const createTalkPrivateGroup = {
  RequestMethod: "ServiceManager.InsertGroup",
};

//Get Private Group Members
const getPrivateGroupMembers = {
  RequestMethod: "ServiceManager.GetActiveUsersByGroupID",
};

//Edit Group
const updatePrivateGroup = {
  RequestMethod: "ServiceManager.ModifyGroup",
};

const deleteNotes = {
  RequestMethod: "ServiceManager.DeleteNotes",
};

const getAllOrganizationGroups = {
  RequestMethod: "ServiceManager.GetAllOrganizationGroups",
};

const CommitteeAndGroupMappingRequestMethod = {
  RequestMethod: "ServiceManager.CommitteeAndGroupMapping",
};
const getResolutionResultsDetails = {
  RequestMethod: "ServiceManager.GetResultDetails",
};
const getVoteDetailsByID = {
  RequestMethod: "ServiceManager.GetVoteDetailsByID",
};
const cancelResolutionRequestMethod = {
  RequestMethod: "ServiceManager.CancelResolution",
};
const updateVoteRequestMethod = {
  RequestMethod: "ServiceManager.UpdateVote",
};
const closeResolutionRequestMethod = {
  RequestMethod: "ServiceManager.CloseResolution",
};

const getBillingInformationRequestMethod = {
  RequestMethod: "ServiceManager.GetBillingInformation",
};
const payOutStandingRequestMethod = {
  RequestMethod: "ServiceManager.PayOustanding",
};

const invoiceandPaymentHistoryRequestMethod = {
  RequestMethod: "ServiceManager.InvoicesAndPaymentHistory",
};
const markStarredMessage = {
  RequestMethod: "ServiceManager.SetMessageFlag",
};

const saveFilesRequestMethod = {
  RequestMethod: "ServiceManager.SaveFiles",
};

const uploadDocumentsRequestMethod = {
  RequestMethod: "ServiceManager.UploadDocuments",
};

const saveFolderRequestMethod = {
  RequestMethod: "ServiceManager.SaveFolder",
};

const getFolderDocumentsRequestMethod = {
  RequestMethod: "ServiceManager.GetFolderDocuments",
};

const createFolderRequestMethod = {
  RequestMethod: "ServiceManager.CreateFolder",
};

const getDocumentsAndFolderRequestMethod = {
  RequestMethod: "ServiceManager.GetDocumentsAndFolders",
};

const shareFilesRequestMethod = {
  RequestMethod: "ServiceManager.ShareFiles",
};

const shareFolderRequestMethod = {
  RequestMethod: "ServiceManager.ShareFolders",
};

const deleteFileRequestMethod = {
  RequestMethod: "ServiceManager.DeleteFile",
};
const FolderisExistRequestMethod = {
  RequestMethod: "ServiceManager.FolderExist",
};
const FileisExistRequestMethod = {
  RequestMethod: "ServiceManager.FileExist",
};
const deleteFolderRequestMethod = {
  RequestMethod: "ServiceManager.DeleteFolder",
};

const leaveGroup = {
  RequestMethod: "ServiceManager.RemoveUserFromGroup",
};

const createShoutAll = {
  RequestMethod: "ServiceManager.InsertBroadcast",
};

const deleteShoutAll = {
  RequestMethod: "ServiceManager.RemoveUserFromShout",
};

const updateShoutAll = {
  RequestMethod: "ServiceManager.UpdateBroadcast",
};

const insertBulkMessages = {
  RequestMethod: "ServiceManager.InsertBulkMessages",
};

const googleValidToken = {
  RequestMethod: "ServiceManager.GetGoogleValidToken",
};
const revoketoken = {
  RequestMethod: "ServiceManager.RevokeToken",
};
const searchUserMeetings = {
  RequestMethod: "ServiceManager.SearchMeetings",
};

const searchTodoListRequestMethod = {
  RequestMethod: "ServiceManager.SearchToDoList",
};

const searchNoteRequetMethod = {
  RequestMethod: "ServiceManager.SearchNotes",
};
const paymentMethodsRequestMethod = {
  RequestMethod: "ServiceManager.GetPaymentMethods",
};

const downloadChat = {
  RequestMethod: "ServiceManager.DownloadChat",
};

const searchPaymentHistoryRequestMethod = {
  RequestMethod: "ServiceManager.InvoicesAndPaymentHistory",
};

const searcPollsRequestMethod = {
  RequestMethod: "ServiceManager.SearchPolls",
};

const savePollsRequestMethod = {
  RequestMethod: "ServiceManager.SavePoll",
};

const getAllCommittesandGroupsforPolls = {
  RequestMethod: "ServiceManager.GetAllGroupsAndCommitteesByOrganizaitonID",
};

const renameFolderRequestMethod = {
  RequestMethod: "ServiceManager.RenameFolder",
};
const renameFileRequestMethod = {
  RequestMethod: "ServiceManager.RenameFile",
};
const subscriptiondetailsRequestMethod = {
  RequestMethod: "ServiceManager.SubscriptionDetail",
};

const searchPolls = {
  RequestMethod: "ServiceManager.SearchPolls",
};

const castVote = {
  RequestMethod: "ServiceManager.CastVote",
};

const getAllPollStatus = {
  RequestMethod: "ServiceManager.GetAllPollStatus",
};

const getPollByPollID = {
  RequestMethod: "ServiceManager.GetPollByPollID",
};

const updatePolls = {
  RequestMethod: "ServiceManager.UpdatePoll",
};

const getPollByPollId = {
  RequestMethod: "ServiceManager.GetAllPollOptionsByPollId",
};

const subscriptionPackageUpgradeAmount = {
  RequestMethod: "ServiceManager.GetPackageUpgradeTotalAmount",
};

const subscriptionPackageUpgradePayment = {
  RequestMethod: "ServiceManager.PackageUpgradePaymentComplete",
};
const paymentCompleteMethod = {
  RequestMethod: "ServiceManager.PaymentComplete",
};

const viewvotes = {
  RequestMethod: "ServiceManager.ViewVotes",
};
const deltePolls = {
  RequestMethod: "ServiceManager.UpdatePollStatusByPollId",
};

const updateMessageAcknowledgement = {
  RequestMethod: "ServiceManager.UpdateMessageAcknowledgement",
};

const getAllStarredMessages = {
  RequestMethod: "ServiceManager.GetAllFlaggedMessages",
};

const saveFilesandFolderRM = {
  RequestMethod: "ServiceManager.SaveFileAndFolder",
};

const DeleteCommentRM = {
  RequestMethod: "ServiceManager.DeleteComment",
};

const getSystemSupportedLanguage = {
  RequestMethod: "ServiceManager.GetSystemSupportedLanguage",
};

const getLastSelectedLanguage = {
  RequestMethod: "ServiceManager.GetLastSelectedLanguage",
};

const setLastSelectedLanguage = {
  RequestMethod: "ServiceManager.SetLastSelectedLanguage",
};

const getAllVideoCallUsers = {
  RequestMethod: "ServiceManager.GetAllUsers",
};

const initiateVideoCall = {
  RequestMethod: "ServiceManager.InitiateVideoCall",
};

const videoCallResponse = {
  RequestMethod: "ServiceManager.VideoCallResponse",
};

const getUserRecentCalls = {
  RequestMethod: "ServiceManager.GetUserRecetCalls",
};

const updateProfilePictureRM = {
  RequestMethod: "ServiceManager.UpdateProfilePicture",
};

const callRequestReceived = {
  RequestMethod: "ServiceManager.CallRequestReceived",
};

const getUserMissedCallCount = {
  RequestMethod: "ServiceManager.GetUserMissedCallCount",
};

const searchDocumentsFoldersAPI = {
  RequestMethod: "ServiceManager.SearchDocumentsAndFolders",
};

const leaveCall = {
  RequestMethod: "ServiceManager.LeaveCall",
};

const getAnnotationOfToDoAttachement = {
  RequestMethod: "ServiceManager.GetAnnotationOfToDoAttachement",
};
const addAnnotationOnToDoAttachement = {
  RequestMethod: "ServiceManager.AddAnnotationOnToDoAttachement",
};

const getEventsTypeRM = {
  RequestMethod: "ServiceManager.GetAllEventTypes",
};
const GetDiskusEventDetailsRM = {
  RequestMethod: "ServiceManager.GetDiskusEventDetails",
};

const getAnnotationOfNotesAttachment = {
  RequestMethod: "ServiceManager.GetAnnotationOfNotesAttachement",
};

const addAnnotationOnNotesAttachment = {
  RequestMethod: "ServiceManager.AddAnnotationOnNotesAttachement",
};

const getAnnotationOfResolutionAttachment = {
  RequestMethod: "ServiceManager.GetAnnotationOfResolutionAttachement",
};

const addAnnotationOnResolutionAttachment = {
  RequestMethod: "ServiceManager.AddAnnotationOnResolutionAttachement",
};

const getAnnotationOfDataroomAttachment = {
  RequestMethod: "ServiceManager.GetAnnotationOfFilesAttachement",
};

const addAnnotationOnDataroomAttachment = {
  RequestMethod: "ServiceManager.AddAnnotationOnFilesAttachement",
};

const deleteMultipleGroupMessages = {
  RequestMethod: "ServiceManager.DeleteMultipleMessages",
};

const getRecentDocumentsRM = {
  RequestMethod: "ServiceManager.GetRecentDocuments",
};

const getAllGroupsUsersAndCommitteesByOrganizaitonID = {
  RequestMethod: "ServiceManager.GetAllGroupsAndCommitteesByOrganizaitonID",
};

const saveMeetingOrganizers = {
  RequestMethod: "ServiceManager.SaveMeetingOrganizers",
};

const getallMeetingType = {
  RequestMethod: "ServiceManager.GetAllMeetingTypes",
};

const saveMeetingDetials = {
  RequestMethod: "ServiceManager.SaveMeetingDetails",
};

const GetMeetingNewFrequencyReminder = {
  RequestMethod: "ServiceManager.GetMeetingReminders",
};

const GetAllRecurringNewMeeting = {
  RequestMethod: "ServiceManager.GetAllRecurringFactor",
};

const meetingStatusUpdate = {
  RequestMethod: "ServiceManager.MeetingStatusUpdate",
};

const getParticipantsRoles = {
  RequestMethod: "ServiceManager.GetAllParticipantRoles",
};

const saveAgendaContributorsRM = {
  RequestMethod: "ServiceManager.SaveAgendaContributors",
};

const FetchVideoUrl = {
  RequestMethod: "ServiceManager.GetMeetingVideoURL",
};

const saveParticipantsMeeting = {
  RequestMethod: "ServiceManager.SaveMeetingParticipants",
};

const getAllAgendaContributorRM = {
  RequestMethod: "ServiceManager.GetAllMeetingAgendaContributors",
};

const getAllSavedParticipants = {
  RequestMethod: "ServiceManager.GetAllMeetingParticipants",
};

const getAllMeetingOrganizers = {
  RequestMethod: "ServiceManager.GetAllMeetingOrganizers",
};

const getUserAgainstShareFileRM = {
  RequestMethod: "ServiceManager.GetUsersAgainstSharedFile",
};

const getUserAgainstShareFolderRM = {
  RequestMethod: "ServiceManager.GetUsersAgainstSharedFolder",
};

const createFileLinkRM = {
  RequestMethod: "ServiceManager.CreateFileLink",
};

const createFolderLinkRM = {
  RequestMethod: "ServiceManager.CreateFolderFileLink",
};

const updateGeneralAccessRM = {
  RequestMethod: "ServiceManager.UpdateGeneralAccess",
};

const updateFolderGeneralAccessRM = {
  RequestMethod: "ServiceManager.UpdateFolderGeneralAccess",
};

const checkFileLinkRM = {
  RequestMethod: "ServiceManager.CreateFileLink",
};

const requestAccessRM = {
  RequestMethod: "ServiceManager.RequestAccess",
};

const sendNotification = {
  RequestMethod: "ServiceManager.SendRecentNotifications",
};

const getAllMeetingDetailsByMeetingID = {
  RequestMethod: "ServiceManager.GetAdvanceMeetingDetailsByMeetingID",
};

const getPollsByMeetingID = {
  RequestMethod: "ServiceManager.GetPollsByMeetingID",
};

const getAllmeetingUsers = {
  RequestMethod: "ServiceManager.GetAllMeetingUsers",
};

const SetMeetingPolls = {
  RequestMethod: "ServiceManager.SetMeetingPolls",
};

const SettingMeetingProposedDates = {
  RequestMethod: "ServiceManager.SetMeetingProposedDates",
};

const getAllPropsedMeetingdates = {
  RequestMethod: "ServiceManager.GetAllMeetingProposedDates",
};

//AUN working on Attendance Meeting
const getAllAttendanceMeeting = {
  RequestMethod: "ServiceManager.GetAllMeetingAttendanceReport",
};

//Aun working on Save Attendance Meeting
const saveMeetingAttendance = {
  RequestMethod: "ServiceManager.SaveMeetingAttendanceReport",
};

const updateResolutionDataRoomMapRM = {
  RequestMethod: "ServiceManager.UpdateResolutionDataRoomMap",
};

const saveResolutionDocumentsRM = {
  RequestMethod: "ServiceManager.SaveResolutionDocuments",
};

const setMeetingProposedDatesResponse = {
  RequestMethod: "ServiceManager.SetMeetingProposedDatesResponse",
};

const CreateUpdateCommitteeDatarRoomRM = {
  RequestMethod: "ServiceManager.CreateUpdateCommiteeDataRoomMap",
};
const saveCommitteeDocumentsRM = {
  RequestMethod: "ServiceManager.SaveCommitteeDocuments",
};

const reteriveCommitteeDocumentsRM = {
  RequestMethod: "ServiceManager.ReteriveCommitteeDocuments",
};

//Aun work on Get meetingMaterial
const getAllMeetingMaterial = {
  RequestMethod: "ServiceManager.GetAllMeetingMaterial",
};

//Aun working on download Attendance Report
const downloadMeetingAttendanceReport = {
  RequestMethod: "ServiceManager.DownloadMeetingAttendanceReportExcel",
};

const CreateUpdateGroupDataRoadMap = {
  RequestMethod: "ServiceManager.CreateUpdateGroupDataRoomMap",
};

const SaveTheGroupsDocuments = {
  RequestMethod: "ServiceManager.SaveGroupsDocuments",
};

const RetrieveGroupDocuments = {
  RequestMethod: "ServiceManager.ReteriveGroupDocuments",
};

const MeetingAgendaLock = {
  RequestMethod: "ServiceManager.UpdateMeetingAgendaLockStatus",
};

const GetAllUserAgendaRights = {
  RequestMethod: "ServiceManager.GetAllUserAgendaRights",
};

const saveUserAttachmentPermission = {
  RequestMethod: "ServiceManager.SaveUserAttachmentPermission",
};

const getPollbyCommitteeIdRM = {
  RequestMethod: "ServiceManager.GetPollsByComitteeID",
};
const setCommitteePollsRM = {
  RequestMethod: "ServiceManager.SetCommitteePolls",
};

const getAgendaVotingDetails = {
  RequestMethod: "ServiceManager.GetAgendaVotingDetails",
};

const getAllVotingResultDisplay = {
  RequestMethod: "ServiceManager.GetAllVotingResultDisplay",
};

const saveAgendaVoting = {
  RequestMethod: "ServiceManager.SaveAgendaVoting",
};

const getAgendaAndVotingInfo = {
  RequestMethod: "ServiceManager.GetAgendaAndVotingInfo",
};

const casteVoteForAgenda = {
  RequestMethod: "ServiceManager.CasteVoteForAgenda",
};

const viewAgendaVotingResults = {
  RequestMethod: "ServiceManager.ViewAgendaVotingResults",
};

const getPollByGroupIDApi = {
  RequestMethod: "ServiceManager.GetPollsByGroupID",
};

const setGroupPollsApi = {
  RequestMethod: "ServiceManager.SetGroupPolls",
};

const getGeneralMinutes = {
  RequestMethod: "ServiceManager.GetMeetingGeneralMinutes",
};

const SaveminutesGeneral = {
  RequestMethod: "ServiceManager.AddGeneralMinute",
};

const SaveGeneralWiseSavingDocuments = {
  RequestMethod: "ServiceManager.SaveGeneralMinutesDocuments",
};

const RetriveGeneralMinutesDocuments = {
  RequestMethod: "ServiceManager.ReteriveGeneralMinuteDocuments",
};

const getAllGeneralMiintuesDocument = {
  RequestMethod: "ServiceManager.GetAllGeneralMiuteDocumentsForMeeting",
};

const getTaskGroupIDApi = {
  RequestMethod: "ServiceManager.GetTasksByGroupID",
};

const setGroupTaskApi = {
  RequestMethod: "ServiceManager.SetGroupTasks",
};

const getTaskByCommitteeIDApi = {
  RequestMethod: "ServiceManager.GetTasksByCommitteeID",
};

const setCommitteeTaskApi = {
  RequestMethod: "ServiceManager.SetCommitteeTasks",
};

const DeleteGeneralMinutes = {
  RequestMethod: "ServiceManager.DeleteGeneralMinute",
};

const UpdateGeneralMinutes = {
  RequestMethod: "ServiceManager.UpdateGeneralMinute",
};

const agenwiseMinutes = {
  RequestMethod: "ServiceManager.AddAgendaWiseMinutes",
};

const DeleteagendaWiseMinutes = {
  RequestMethod: "ServiceManager.DeleteAgendaWiseMinute",
};

const updateAgendaWiseMinutes = {
  RequestMethod: "ServiceManager.UpdateAgendaWiseMinute",
};

const getAllAgendaWiseMinutes = {
  RequestMethod: "ServiceManager.GetAllMeetingAgendaWiseMinutes",
};
const deleteCommitteePollRM = {
  RequestMethod: "ServiceManager.DeleteCommitteePolls",
};

const deleteGroupPollsRM = {
  RequestMethod: "ServiceManager.DeleteGroupPolls",
};

const deleteMeetingPollsRM = {
  RequestMethod: "ServiceManager.DeleteMeetingPolls",
};

const deleteCommitteeTaskRM = {
  RequestMethod: "ServiceManager.DeleteCommitteeTasks",
};

const deleteGroupTaskRM = {
  RequestMethod: "ServiceManager.DeleteGroupTasks",
};

const getUserWiseProposeDate = {
  RequestMethod: "ServiceManager.GetParticipantWiseProposedDates",
};

const getAdvanceMeetingAgendabyMeetingID = {
  RequestMethod: "ServiceManager.GetAdvanceMeetingAgendabyMeetingID",
};

const saveDocumentAgendaWiseMinutes = {
  RequestMethod: "ServiceManager.SaveAgendaWiseMinutesDocuments",
};

const RetriveAgendaWiseDocuments = {
  RequestMethod: "ServiceManager.ReteriveAgendaWiseMiuteDocuments",
};

const DeleteDocumentGenralMinute = {
  RequestMethod: "ServiceManager.DeleteGeneralMinuteDocuments",
};

const createUpdateMeetingDataRoomMap = {
  RequestMethod: "ServiceManager.CreateUpdateMeetingDataRoomMap",
};

const ScheduleMeetingOnSelectedDate = {
  RequestMethod: "ServiceManager.ScheduleMeetingOnSelectedDate",
};

const getMeetingbyGroupIDRM = {
  RequestMethod: "ServiceManager.GetMeetingsByGroupID",
};

const getMeetingbyCommitteeIDRM = {
  RequestMethod: "ServiceManager.GetMeetingsByCommitteeID",
};

const setMeetingbyGroupIDRM = {
  RequestMethod: "ServiceManager.SetGroupMeeting",
};

const setMeetingbyCommitteeIDRM = {
  RequestMethod: "ServiceManager.SetCommitteeMeetings",
};
const DeleteAgendaWiseDocuments = {
  RequestMethod: "ServiceManager.DeleteAgendaWiseMinuteDocuments",
};

const CreateUpdateMeetingDataroomMapped = {
  RequestMethod: "ServiceManager.CreateUpdateMeetingDataRoomMap",
};

const UpdateMeetingUserhit = {
  RequestMethod: "ServiceManager.UpdateMeetingUsers",
};

const addUpdateAdvanceMeetingAgenda = {
  RequestMethod: "ServiceManager.AddUpdateAdvanceMeetingAgenda",
};

// report download Attendance in Excel
const downloadAttendanceReport = {
  RequestMethod: "ServiceManager.AttendanceReport",
};

const agendaVotingStatusUpdate = {
  RequestMethod: "ServiceManager.AgendaVotingStatusUpdate",
};

const saveMeetingDocuments = {
  RequestMethod: "ServiceManager.SaveMeetingDocuments",
};

// get All Meeting Tasks in Action
const getMeetingTasksAction = {
  RequestMethod: "ServiceManager.GetMeetingTasks",
};

const dataRoomFileDownloadService = {
  RequestMethod: "ServiceManager.DownloadFile",
};

const dataRoomFolderDownloadService = {
  RequestMethod: "ServiceManager.DownloadFolder",
};

const saveTaskandAssgineesRM = {
  RequestMethod: "ServiceManager.SaveTaskDocumentsAndAssignees",
};

const createupdateTaskDataroom = {
  RequestMethod: "ServiceManager.CreateUpdateToDoDataRoomMap",
};
const saveTaskDocuments = {
  RequestMethod: "ServiceManager.SaveToDoDocuments",
};

const mapTaskWithMeetingAgenda = {
  RequestMethod: "ServiceManager.MapTaskWithMeetingAndAgenda",
};

const removeTaskMeetingMapping = {
  RequestMethod: "ServiceManager.RemoveTaskMeetingMapping",
};

const getAllagendaWiseDocumentsApi = {
  RequestMethod: "ServiceManager.GetAllAgendaWiseMinuteDocumentsForMeeting",
};

const getAllAgendaForAgendaWise = {
  RequestMethod: "ServiceManager.GetAdvanceMeetingAgendabyMeetingID",
};

const getAllMeetingForAgendaImport = {
  RequestMethod: "ServiceManager.GetAllMeetingForAgendaImport",
};

const getAgendaWithMeetingIDForImport = {
  RequestMethod: "ServiceManager.GetAgendaWithMeetingIDForImport",
};

const inviteForCollaboration = {
  RequestMethod: "ServiceManager.InviteForMinuteCollaboration",
};

const getFileFolderDetailsRM = {
  RequestMethod: "ServiceManager.GetFileFolderDetails",
};

const updateAndOpenByAndDescriptionRM = {
  RequestMethod: "ServiceManager.UpdateOpenedByAndDescription",
};

const getDataAnalyticsRM = {
  RequestMethod: "ServiceManager.GetDataAnalytics",
};

const getDataAnalyticsCountRM = {
  RequestMethod: "ServiceManager.GetDataAnalyticsCount",
};

const validateEncryptedStringUserAvailabilityForMeeting = {
  RequestMethod:
    "ServiceManager.ValidateEncryptedStringUserAvailabilityForMeeting",
};

const validateEncyptedStringUserDataRoom = {
  RequestMethod:
    "ServiceManager.ValidateEncryptedStringUserAvailabilityForDataRoom",
};

const validateMicrosoftToken = {
  RequestMethod: "ServiceManager.GetMicrosoftValidToken",
};

// when organizer hit the view button in unpublished meeting
const getUserWiseProposeDateOrganizer = {
  RequestMethod: "ServiceManager.GetUserWiseProposedDates",
};
const UserLoginHistoryRM = {
  RequestMethod: "ServiceManager.GetUserLoginHistory",
};
const UserLogout = {
  RequestMethod: "ServiceManager.LogOut",
};

const createWorkFlowRM = {
  RequestMethod: "ServiceManager.CreateSignatureFlow",
};

const saveWorkFlowRM = {
  RequestMethod: "ServiceManager.SaveWorkFlow",
};

const updateActorBundleStatusRM = {
  RequestMethod: "ServiceManager.UpdateActorBundleStatus",
};

const getActorBundleStatusStateRM = {
  RequestMethod: "ServiceManager.GetActorBundleStatusState",
};

const getActionableBundleStatusStateRM = {
  RequestMethod: "ServiceManager.GetActionableBundleStatusState",
};

const getEntityTypesRM = {
  RequestMethod: "ServiceManager.GetEntityTypes",
};
const getWorkFlowRM = {
  RequestMethod: "ServiceManager.GetWorkFlow",
};
const getWorkFlowsRM = {
  RequestMethod: "ServiceManager.GetWorkFlows",
};
const saveActorRM = {
  RequestMethod: "ServiceManager.SaveActorColor",
};

const saveActorColorRM = {
  RequestMethod: "ServiceManager.SaveActorColor",
};
const saveAndEditFormFieldsRM = {
  RequestMethod: "ServiceManager.SaveAndEditFormFields",
};

const sendDocumentRM = {
  RequestMethod: "ServiceManager.SendDocument",
};

const DeclineReason = {
  RequestMethod: "ServiceManager.DeclineReason",
};

const getAllFieldsByWorkFlowIdRM = {
  RequestMethod: "ServiceManager.GetAllFieldsByWorkFlowID",
};

const addUpdateFieldValueRM = {
  RequestMethod: "ServiceManager.AddUpdateFieldValue",
};

const saveAuditTrailRM = {
  RequestMethod: "ServiceManager.SaveAuditTrail",
};

const getAllAuditTrailByWorkFlowIdRM = {
  RequestMethod: "ServiceManager.GetAllAuditTrailByWorkFlowID",
};

const getDeclineReasonRM = {
  RequestMethod: "ServiceManager.GetDeclineReason",
};
const getSignatureFormFieldTypesRM = {
  RequestMethod: "ServiceManager.GetSignatureFormFieldTypes",
};
const getColorPlattesRM = {
  RequestMethod: "ServiceManager.GetColorPalettes",
};
const getAuditTrailActionsRM = {
  RequestMethod: "ServiceManager.GetAuditTrailActions",
};
const getActorFieldValuesRM = {
  RequestMethod: "ServiceManager.GetActorFieldValues",
};

const addNewSignatureRM = {
  RequestMethod: "ServiceManager.AddANewSignature",
};

const getAllSignaturesRM = {
  RequestMethod: "ServiceManager.GetAllSignatures",
};

const getUserSignatureRM = {
  RequestMethod: "ServiceManager.GetUserSignature",
};
const deleteUserSignatureRM = {
  RequestMethod: "ServiceManager.DeleteUserSignature",
};

const getWorkFlowByFileIdRM = {
  RequestMethod: "ServiceManager.GetWorkFlowByFileID",
};
// new api for end quick meeting
const endMeetingStatus = {
  RequestMethod: "ServiceManager.MeetingStatusUpdate",
};

const saveSignatureDocumentRM = {
  RequestMethod: "ServiceManager.SaveSignatureDocument",
};

const getMeetingParticipantsInfo = {
  RequestMethod: "ServiceManager.GetMeetingParticipantsInfo",
};

const sendAgendaPDFAsEmail = {
  RequestMethod: "ServiceManager.SendAgendaPDFAsEmail",
};

const exportAgendaAsPDF = {
  RequestMethod: "ServiceManager.ExportAgendaAsPDF",
};

const printMeetingAgenda = {
  RequestMethod: "ServiceManager.PrintMeetingAgenda",
};

const SaveOrganizationAndPakageSelection = {
  RequestMethod: "ServiceManager.SaveOrganizationsAndSelectedPackage",
};

const ExtendOrganizationTrial = {
  RequestMethod: "ServiceManager.ExtendOrganizationTrial",
};

const AddOrganizationsUser = {
  RequestMethod: "ServiceManager.AddOrganizationsUsers",
};

const EditOrganizationsUser = {
  RequestMethod: "ServiceManager.EditOrganizationsUser",
};

const AllOrganizationsUsers = {
  RequestMethod: "ServiceManager.AllOrganizationsUsers",
};

const OrganizationPackageDetailsAndUserStats = {
  RequestMethod: "ServiceManager.OrganizationPackageDetailsAndUserStats",
};

const GetOrganizationSelectedPackagesByOrganizationID = {
  RequestMethod:
    "ServiceManager.GetOrganizationSelectedPackagesByOrganizationID",
};

const joinMeeting = {
  RequestMethod: "ServiceManager.JoinMeeting",
};

const leaveMeeting = {
  RequestMethod: "ServiceManager.LeaveMeeting",
};

const getOrganizationSelectedPakages = {
  RequestMethod: "ServiceManager.GetOrganizationSelectedPackages",
};

const GetAllUserTypePackages = {
  RequestMethod: "ServiceManager.GetAllUserTypePackages",
};

const leaveFileSharingRM = {
  RequestMethod: "ServiceManager.DeleteFileSharing",
};

// const delete organization User for Admin

const ResendForgotPasswordCode = {
  RequestMethod: "ServiceManager.ResendForgotPasswordCode",
};

const DeleteOrganizationsUser = {
  RequestMethod: "ServiceManager.DeleteOrganizationsUser",
};

const leaveFolderSharingRM = {
  RequestMethod: "ServiceManager.DeleteFolderSharing",
};

const PaymentInitiateStepperThree = {
  RequestMethod: "ServiceManager.PaymentInitiate",
};

// for get Cancel Subscription Reasons
const CancelSubReasons = {
  RequestMethod: "ServiceManager.GetCancelSubscriptionReasons",
};

// for cancel subscription
const CancelOrganizationsSubscriptions = {
  RequestMethod: "ServiceManager.CancelOrganizationsSubscription",
};

// Api for upgrade button on package details which is not ready yet but structure should be ready when Api will implemented ready to go
// const upgradePackageApiCallOnPackageDetailPage = {
//   RequestMethod: ""
// };

const revokeMicrosoftToken = {
  RequestMethod: "ServiceManager.RevokeMicrosoftToken",
};

const requestOrganizationTrialExtend = {
  RequestMethod: "ServiceManager.RequestOrganizationTrialExtend",
};

const paymentStatus = {
  RequestMethod: "ServiceManager.PaymentStatus",
};

const ValidateEmailRelatedString = {
  RequestMethod:
    "ServiceManager.ValidateEncryptedStringMeetingRelatedEmailData",
};

const ValidateEmailRelatedStringPolls = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringPollRelatedEmailData",
};

const downloadAttachmentTalk = {
  RequestMethod: "ServiceManager.DownloadAttachment",
};

const changeSelectedSubscription = {
  RequestMethod: "ServiceManager.ChangeSelectedSubscriptionDetails",
};
const CancelTrailandUpdageOrganiztionRM = {
  RequestMethod: "ServiceManager.CancelTrialAndUpgradeOrganizationSubscription",
};

const GetAllSignatureFlowDocumentsForCreatorRM = {
  RequestMethod: "ServiceManager.GetAllSignatureFlowDocumentsForCreator",
};

const ListOfPendingForApprovalSignaturesRM = {
  RequestMethod: "ServiceManager.ListOfPendingForApprovalSignatures",
};
const GetInvoiceHTMLByOrganizatonID = {
  RequestMethod: "ServiceManager.GetInvoiceHtmlByOrganizationID",
};
const LoginHistoryReportExporttoExcel = {
  RequestMethod: "ServiceManager.LoginHistoryReport",
};
const GetAllPendingForApprovalStatsRM = {
  RequestMethod: "ServiceManager.GetAllPendingForApprovalStats",
};
const downgradeOrganizationSubscription = {
  RequestMethod: "ServiceManager.DowngradeOrganizationSubscription",
};

const cancelOrganizationSubscription = {
  RequestMethod: "ServiceManager.CancelOrganizationsSubscription",
};

const getOrganizationWallet = {
  RequestMethod: "ServiceManager.GetOrganizationWallet",
};
export {
  GetAllPendingForApprovalStatsRM,
  ListOfPendingForApprovalSignaturesRM,
  LoginHistoryReportExporttoExcel,
  GetInvoiceHTMLByOrganizatonID,
  GetAllSignatureFlowDocumentsForCreatorRM,
  ValidateEmailRelatedStringPolls,
  ValidateEmailRelatedString,
  revokeMicrosoftToken,
  leaveFolderSharingRM,
  leaveFileSharingRM,
  UserLoginHistoryRM,
  getDataAnalyticsCountRM,
  updateAndOpenByAndDescriptionRM,
  getFileFolderDetailsRM,
  getDataAnalyticsRM,
  saveTaskandAssgineesRM,
  saveTaskDocuments,
  createupdateTaskDataroom,
  setMeetingbyCommitteeIDRM,
  setMeetingbyGroupIDRM,
  getMeetingbyCommitteeIDRM,
  getMeetingbyGroupIDRM,
  deleteCommitteeTaskRM,
  deleteGroupTaskRM,
  deleteMeetingPollsRM,
  deleteGroupPollsRM,
  deleteCommitteePollRM,
  setCommitteePollsRM,
  getPollbyCommitteeIdRM,
  saveCommitteeDocumentsRM,
  reteriveCommitteeDocumentsRM,
  CreateUpdateCommitteeDatarRoomRM,
  saveResolutionDocumentsRM,
  updateResolutionDataRoomMapRM,
  updateGeneralAccessRM,
  checkFileLinkRM,
  requestAccessRM,
  updateFolderGeneralAccessRM,
  createFileLinkRM,
  createFolderLinkRM,
  getUserAgainstShareFolderRM,
  getUserAgainstShareFileRM,
  getAllAgendaContributorRM,
  saveAgendaContributorsRM,
  getRecentDocumentsRM,
  updateProfilePictureRM,
  DeleteCommentRM,
  subscriptionPackageUpgradeAmount,
  paymentCompleteMethod,
  subscriptionPackageUpgradePayment,
  revoketoken,
  googleValidToken,
  signuprequest,
  signinauthenication,
  forgetpassword,
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
  markStarredMessage,
  getVoterResolutionRequestMethod,
  saveFilesRequestMethod,
  uploadDocumentsRequestMethod,
  saveFolderRequestMethod,
  getFolderDocumentsRequestMethod,
  createFolderRequestMethod,
  getDocumentsAndFolderRequestMethod,
  shareFilesRequestMethod,
  shareFolderRequestMethod,
  FileisExistRequestMethod,
  FolderisExistRequestMethod,
  deleteFileRequestMethod,
  deleteFolderRequestMethod,
  updatePrivateGroup,
  leaveGroup,
  createShoutAll,
  deleteShoutAll,
  updateShoutAll,
  insertBulkMessages,
  searchUserMeetings,
  searchTodoListRequestMethod,
  searchNoteRequetMethod,
  paymentMethodsRequestMethod,
  searchPaymentHistoryRequestMethod,
  searcPollsRequestMethod,
  savePollsRequestMethod,
  getAllCommittesandGroupsforPolls,
  renameFolderRequestMethod,
  renameFileRequestMethod,
  downloadChat,
  subscriptiondetailsRequestMethod,
  searchPolls,
  castVote,
  getAllPollStatus,
  getPollByPollID,
  updatePolls,
  getPollByPollId,
  viewvotes,
  deltePolls,
  updateMessageAcknowledgement,
  getAllStarredMessages,
  saveFilesandFolderRM,
  //Languages
  getSystemSupportedLanguage,
  getLastSelectedLanguage,
  setLastSelectedLanguage,
  //Video Panel
  getAllVideoCallUsers,
  initiateVideoCall,
  videoCallResponse,
  getUserRecentCalls,
  callRequestReceived,
  getUserMissedCallCount,
  searchDocumentsFoldersAPI,
  leaveCall,
  getAnnotationOfToDoAttachement,
  addAnnotationOnToDoAttachement,
  getEventsTypeRM,
  GetDiskusEventDetailsRM,
  getAnnotationOfNotesAttachment,
  addAnnotationOnNotesAttachment,
  addAnnotationOnResolutionAttachment,
  getAnnotationOfResolutionAttachment,
  addAnnotationOnDataroomAttachment,
  getAnnotationOfDataroomAttachment,
  deleteMultipleGroupMessages,
  getAllGroupsUsersAndCommitteesByOrganizaitonID,
  saveMeetingOrganizers,
  getallMeetingType,
  saveMeetingDetials,
  GetMeetingNewFrequencyReminder,
  GetAllRecurringNewMeeting,
  meetingStatusUpdate,
  getParticipantsRoles,
  FetchVideoUrl,
  saveParticipantsMeeting,
  getAllSavedParticipants,
  getAllMeetingOrganizers,
  sendNotification,
  getAllMeetingDetailsByMeetingID,
  getPollsByMeetingID,
  getAllmeetingUsers,
  SetMeetingPolls,
  SettingMeetingProposedDates,
  getAllPropsedMeetingdates,
  //Aun attendance
  getAllAttendanceMeeting,
  saveMeetingAttendance,
  setMeetingProposedDatesResponse,

  //Agenda Voting
  getAgendaVotingDetails,
  getAllVotingResultDisplay,
  saveAgendaVoting,
  getAgendaAndVotingInfo,
  casteVoteForAgenda,
  viewAgendaVotingResults,
  //Aun MeetingMaterial
  getAllMeetingMaterial,
  downloadMeetingAttendanceReport,
  CreateUpdateGroupDataRoadMap,
  SaveTheGroupsDocuments,
  RetrieveGroupDocuments,
  MeetingAgendaLock,
  GetAllUserAgendaRights,
  saveUserAttachmentPermission,
  getPollByGroupIDApi,
  setGroupPollsApi,
  getGeneralMinutes,
  SaveminutesGeneral,
  SaveGeneralWiseSavingDocuments,
  RetriveGeneralMinutesDocuments,
  getAllGeneralMiintuesDocument,
  getTaskGroupIDApi,
  setGroupTaskApi,
  getTaskByCommitteeIDApi,
  setCommitteeTaskApi,
  DeleteGeneralMinutes,
  UpdateGeneralMinutes,
  agenwiseMinutes,
  DeleteagendaWiseMinutes,
  updateAgendaWiseMinutes,
  getAllAgendaWiseMinutes,
  getUserWiseProposeDate,
  getAdvanceMeetingAgendabyMeetingID,
  saveDocumentAgendaWiseMinutes,
  RetriveAgendaWiseDocuments,
  DeleteDocumentGenralMinute,
  createUpdateMeetingDataRoomMap,
  ScheduleMeetingOnSelectedDate,
  DeleteAgendaWiseDocuments,
  CreateUpdateMeetingDataroomMapped,
  UpdateMeetingUserhit,
  addUpdateAdvanceMeetingAgenda,
  downloadAttendanceReport,
  agendaVotingStatusUpdate,
  saveMeetingDocuments,
  getMeetingTasksAction,
  dataRoomFileDownloadService,
  dataRoomFolderDownloadService,
  mapTaskWithMeetingAgenda,
  removeTaskMeetingMapping,
  getAllagendaWiseDocumentsApi,
  getAllAgendaForAgendaWise,
  //Import Agenda
  getAllMeetingForAgendaImport,
  getAgendaWithMeetingIDForImport,
  inviteForCollaboration,
  validateEncryptedStringUserAvailabilityForMeeting,
  //Validate userAvailibility Encrypted String
  validateEncyptedStringUserDataRoom,
  //Validate Microsoft Token
  validateMicrosoftToken,
  getUserWiseProposeDateOrganizer,
  UserLogout,
  createWorkFlowRM,
  saveWorkFlowRM,
  updateActorBundleStatusRM,
  getActorBundleStatusStateRM,
  getActionableBundleStatusStateRM,
  getEntityTypesRM,
  getWorkFlowRM,
  getWorkFlowsRM,
  saveActorRM,
  saveActorColorRM,
  saveAndEditFormFieldsRM,
  sendDocumentRM,
  DeclineReason,
  getAllFieldsByWorkFlowIdRM,
  addUpdateFieldValueRM,
  saveAuditTrailRM,
  getAllAuditTrailByWorkFlowIdRM,
  getDeclineReasonRM,
  getSignatureFormFieldTypesRM,
  getColorPlattesRM,
  getAuditTrailActionsRM,
  getActorFieldValuesRM,
  addNewSignatureRM,
  getAllSignaturesRM,
  getUserSignatureRM,
  deleteUserSignatureRM,
  getWorkFlowByFileIdRM,
  endMeetingStatus,
  saveSignatureDocumentRM,
  getMeetingParticipantsInfo,
  sendAgendaPDFAsEmail,
  exportAgendaAsPDF,
  printMeetingAgenda,
  SaveOrganizationAndPakageSelection,
  ExtendOrganizationTrial,
  AddOrganizationsUser,
  EditOrganizationsUser,
  AllOrganizationsUsers,
  OrganizationPackageDetailsAndUserStats,
  GetOrganizationSelectedPackagesByOrganizationID,
  joinMeeting,
  leaveMeeting,
  getOrganizationSelectedPakages,
  GetAllUserTypePackages,
  ResendForgotPasswordCode,
  DeleteOrganizationsUser,
  PaymentInitiateStepperThree,
  CancelSubReasons,
  CancelOrganizationsSubscriptions,
  // upgradePackageApiCallOnPackageDetailPage,
  requestOrganizationTrialExtend,
  paymentStatus,
  downloadAttachmentTalk,
  changeSelectedSubscription,
  CancelTrailandUpdageOrganiztionRM,
  downgradeOrganizationSubscription,
  cancelOrganizationSubscription,
  getOrganizationWallet,
};
