export const signuprequest = {
  RequestMethod: "ServiceManager.SignUp",
};

export const signinauthenication = {
  RequestMethod: "ServiceManager.Login",
};

export const forgetpassword = {
  RequestMethod: "ServiceManager.ForgotPassword",
};

export const verifyOTPSignUp = {
  RequestMethod: "ServiceManager.OTPVerification",
};

export const resendOTP = {
  RequestMethod: "ServiceManager.GenerateOTP",
};

export const resendOTPForgotPassword = {
  RequestMethod: "ServiceManager.ResendPassConfirmationOTP",
};

export const changepassword = {
  RequestMethod: "ServiceManager.ChangePassword",
};

export const authenticationRefreshToken = {
  RequestMethod: "ServiceManager.RefreshToken",
};

// schedule new metings
export const scheduleNewMeeting = {
  RequestMethod: "ServiceManager.ScheduleNewMeeting",
};
// update metings
export const updateMeeting = {
  RequestMethod: "ServiceManager.UpdateMeeting",
};
//To-Do List APIs
//Get List By ID
export const getToDoListByUserID = {
  RequestMethod: "ServiceManager.GetToDoListByUserID",
};

//Create To-Do List
export const createToDoList = {
  RequestMethod: "ServiceManager.CreateToDoList",
};

//Create To-Do List
export const uploadDocument = {
  RequestMethod: "ServiceManager.UploadDocument",
};

//Get All Assignees for To-Do List
export const getAllAssigneesToDoList = {
  RequestMethod: "ServiceManager.GetAllAssignees",
};

// ali work
export const getUserSettings = {
  RequestMethod: "ServiceManager.GetUserSettings",
};
export const updateUserNotificationSetting = {
  RequestMethod: "ServiceManager.UpdateUserNotificationSettings",
};
export const updateUserGeneralSetting = {
  RequestMethod: "ServiceManager.UpdateUserGeneralSettings",
};
export const updateUserProfileSetting = {
  RequestMethod: "ServiceManager.UpdateUserProfileSettings",
};
export const getUserNotifcations = {
  RequestMethod: "ServiceManager.GetUserNotifications",
};
export const getCountryCode = {
  RequestMethod: "ServiceManager.GetAllCountryCodes",
};
export const getTimeZOne = {
  RequestMethod: "ServiceManager.GetAllTimeZones",
};
// aun
//Get FAQ's
export const getFaqs = {
  RequestMethod: "ServiceManager.GetFAQs",
};

//aun
// Get Meeting Id By User id
export const getMeetingId = {
  RequestMethod: "ServiceManager.GetMeetingsByUserID",
};

//startMeeting
export const startMeeting = {
  RequestMethod: "ServiceManager.StartMeeting",
};

//endMeeting
export const endMeeting = {
  RequestMethod: "ServiceManager.EndMeeting",
};

// schedule View metings
export const getMeetingByMeetingID = {
  RequestMethod: "ServiceManager.GetMeetingByMeetingID",
};

// View To-Do List
export const getToDoListByToDoListID = {
  RequestMethod: "ServiceManager.GetToDoListByToDoListID",
};

// Edit To-Do List
export const updateToDoList = {
  RequestMethod: "ServiceManager.UpdateToDoList",
};

// Edit To-Do List
export const cancelMeeting = {
  RequestMethod: "ServiceManager.CancelMeeting",
};
// Get Data for Calender

export const calendarDataRequest = {
  RequestMethod: "ServiceManager.GetCalenderList",
};

//search todolist by userId
export const searchTodoList = {
  RequestMethod: "ServiceManager.SearchToDoList",
};

// search Meeting Id By User id
export const searchMeetingId = {
  RequestMethod: "ServiceManager.SearchMeetings",
};

export const todosStatus = {
  RequestMethod: "ServiceManager.GetAllTodoStatus",
};
export const updateTodoStatus = {
  RequestMethod: "ServiceManager.UpdateTaskStatus",
};

//Download File
export const downloadDocument = {
  RequestMethod: "ServiceManager.FileDownload",
};

export const postComment = {
  RequestMethod: "ServiceManager.CreateComment",
};

//Dashboard APIs
//Meeting Count
export const getWeekMeetings = {
  RequestMethod: "ServiceManager.GetWeekMeetings",
};

//Upcoming Events
export const upcomingEvents = {
  RequestMethod: "ServiceManager.GetUpcomingMeetingEventsByUserId",
};

//Upcoming Events
export const getWeekToDo = {
  RequestMethod: "ServiceManager.GetNumberOfToDoListInWeekByUserIDAndDate",
};

export const getAttachmentByMeetingId = {
  RequestMethod: "ServiceManager.GetAgendaAttachmentsByMeetingId",
};
export const getAgendasByMeetingId = {
  RequestMethod: "ServiceManager.GetMeetingAgendasByMeetingId",
};
export const updateAgendaAttachments = {
  RequestMethod: "ServiceManager.AgendaAttachments",
};

export const getAllReminders = {
  RequestMethod: "ServiceManager.GetMeetingReminders",
};
export const addMinuteofMeetings = {
  RequestMethod: "ServiceManager.RecordMinutesofMeeting",
};
export const updateMinuteofMeetings = {
  RequestMethod: "ServiceManager.UpdateRecordMinutesofMeeting",
};
export const getCountryNames = {
  RequestMethod: "ServiceManager.GetWorldCountries",
};
export const getSubscriptionDetailRequestMethod = {
  RequestMethod: "ServiceManager.GetSubscriptionPackages",
};
export const createOrganizationRequestMethod = {
  RequestMethod: "ServiceManager.SaveOrganizationAndSelectedPackage",
};
export const userEmailVerification = {
  RequestMethod: "ServiceManager.UserEmailVerification",
};
export const userPasswordCreation = {
  RequestMethod: "ServiceManager.UsersPasswordCreation",
};
export const userEmailValidation = {
  RequestMethod: "ServiceManager.LoginWithUserEmail",
};
export const userPasswordVerify = {
  RequestMethod: "ServiceManager.UserPasswordVerification",
  // RequestMethod: "ServiceManager.PasswordVerification",
};
export const getSelectedPacakge_Detail = {
  RequestMethod: "ServiceManager.GetOrganizationSeletedPackage",
};
// For Check Is Organization Exsists or NOT
export const IsOrganizationExsists = {
  RequestMethod: "ServiceManager.IsOrganizationExsists",
};
// For Check Is Organization Email Exsists or NOT
export const IsOrganizationEmailExsists = {
  RequestMethod: "ServiceManager.IsUserEmailExsists",
};

// schedule View metings
export const OrganizationUserListStatistics = {
  RequestMethod: "ServiceManager.OrganizationUserListStatistics",
};
// schedule AddOrganizationUser
export const AddOrganizationUser = {
  RequestMethod: "ServiceManager.AddOrganizationUser",
};
// schedule GetAllOrganizationRoles
export const getAllOrganizationRoles = {
  RequestMethod: "ServiceManager.GetAllOrganizationRoles",
};
// schedule GetAllUserRoles
export const getAllUserRoles = {
  RequestMethod: "ServiceManager.GetAllUserRoles",
};
// schedule GetAllUserRoles
export const getOrganizationByID = {
  RequestMethod: "ServiceManager.GetOrganizationByID",
};
// GET AddOrganizationUser
export const allOrganizationUsers = {
  RequestMethod: "ServiceManager.AllOrganizationUsers",
};
// schedule GetAllUserRoles
export const getAllUserStatus = {
  RequestMethod: "ServiceManager.GetAllUserStatus",
};

//  Edit Organization User
export const editOrganizationUser = {
  RequestMethod: "ServiceManager.EditOrganizationUser",
};

// Dlete Organization User
export const deleteOrganizationUser = {
  RequestMethod: "ServiceManager.DeleteOrganizationUser",
};

export const IsPackageExpiryDetail = {
  RequestMethod: "ServiceManager.GetOrganizationSubscriptionExpiryDetails",
};
export const AllMeetingOrganization = {
  RequestMethod: "ServiceManager.SearchOrganizationMeetings",
};
export const OrganizationMeetingStatus = {
  RequestMethod: "ServiceManager.OrganizationMeetingStatusUpdate",
};

export const deleteOrganizationMeeting = {
  RequestMethod: "ServiceManager.DeleteOrganizationMeeting",
};
export const updateOrganizationLevelSettings = {
  RequestMethod: "ServiceManager.UpdateOrganizationSettings",
};
export const getOrganizationLevelSettings = {
  RequestMethod: "ServiceManager.GetOrganizationSettings",
};
export const GetOrganizationSeletedPackageByOrganizationID = {
  RequestMethod: "ServiceManager.GetOrganizationSeletedPackageByOrganizationID",
};
export const GetSubscriptionPackagesByOrganizationID = {
  RequestMethod: "ServiceManager.GetSubscriptionPackagesForUpgrade",
};
export const getMeetingStatus = {
  RequestMethod: "ServiceManager.GetMeetingStatus",
};
export const cancelSubscription = {
  RequestMethod: "ServiceManager.CancelOrganizationSubscription",
};
export const updateSubscriptionPackage = {
  RequestMethod: "ServiceManager.UpgradeOrganizationSubscription",
};
export const updateOrganizationUserSetting = {
  RequestMethod: "ServiceManager.UpdateOrganizationUserSettings",
};
export const OrganizationPackageReselection = {
  RequestMethod: "ServiceManager.OrganizationPackageReselection",
};
export const TwoFaAuthenticateRequestMethod = {
  RequestMethod: "ServiceManager.Authenticate2FA",
};
export const sendTwoFacOTP = {
  RequestMethod: "ServiceManager.Send2FAOTP",
};
export const verifyTwoFacOTP = {
  RequestMethod: "ServiceManager.Verify2FAOTP",
};
export const resendTwoFacOTP = {
  RequestMethod: "ServiceManager.Resend2FAOTP",
};

//for get Admin customer info userDetails organization Api
export const CustomerInfoOrganization = {
  RequestMethod: "ServiceManager.GetOrganizationDetails",
};

export const updateCustomerOrganizationProfile = {
  RequestMethod: "ServiceManager.UpdateOrganizationProfile",
};

export const passswordUpdationOnForgetPassword = {
  RequestMethod: "ServiceManager.PasswordUpdationOnForgetPassword",
};

export const revokeProcess = {
  RequestMethod: "ServiceManager.RevokeCancelation",
};
export const getuserdetails = {
  RequestMethod: "ServiceManager.GetUserDetails",
};

export const updateProfileData = {
  RequestMethod: "ServiceManager.UpdateUserProfile",
};
export const deleteOrganizationAPI = {
  RequestMethod: "ServiceManager.DeleteOrganization",
};
export const SavesNotesRequestMethod = {
  RequestMethod: "ServiceManager.SaveNotes",
};
export const GetNotesByUserIDAndOrganizationID = {
  RequestMethod: "ServiceManager.GetNotesByUserIDAndOrganizationID",
};
export const UpdateNotesRequestMethod = {
  RequestMethod: "ServiceManager.UpdateNotes",
};
export const GetNotesByNotesIDRequestMethod = {
  RequestMethod: "ServiceManager.GetNotesByNotesID",
};

//Refresh Token Talk
export const refreshTokenTalk = {
  // RequestMethod: "ServiceManager.GetRecentAllMessagesWithUserDetails",
};

//Get All User Chats Talk
export const getAllUserChats = {
  RequestMethod: "ServiceManager.GetRecentAllMessagesWithUserDetails",
};

//GetUserOTOMessages
export const getUserOTOMessages = {
  RequestMethod: "ServiceManager.GetUserOTOMessages",
};

//GetUndeliveredUserOTOMessages
export const getUndeliveredUserOTOMessages = {
  RequestMethod: "ServiceManager.GetUndeliveredUserOTOMessages",
};

//GetGroupMessages
export const getGroupMessages = {
  RequestMethod: "ServiceManager.GetGroupMessages",
};

//Get Broadcast Messages
export const getBroadCastMessages = {
  RequestMethod: "ServiceManager.GetBroadcastMessages",
};

//Get Archived Data By User ID
export const getArchivedDataByUserID = {
  RequestMethod: "ServiceManager.GetRecentArchiveDataByUserID",
};

//Get Flag Messages
export const getFlagMessages = {
  RequestMethod: "ServiceManager.GetRecentFlag",
};

//Get Follow Messages
export const getFollowMessages = {
  RequestMethod: "ServiceManager.GetRecentFollowDataByUserID",
};

//Get Recent Tags
export const getAllRecentTags = {
  RequestMethod: "ServiceManager.GetAllRecentTags",
};

//Get Tags Messages
export const getTagsMessages = {
  RequestMethod: "ServiceManager.GetTagsMessages",
};

//Get Message Seen Receive Time
export const getMessageSentReceivedTime = {
  RequestMethod: "ServiceManager.GetSentReceiveSeenTime",
};

//Get Recent Flag Count
export const getRecentFlagCount = {
  RequestMethod: "ServiceManager.GetRecentFlagCount",
};

//getRecentFollowDataCountByUserID
export const getRecentFollowDataCountByUserID = {
  RequestMethod: "ServiceManager.GetRecentFollowDataCountByUserID",
};

//GetAllRecentTagsCount
export const getAllRecentTagsCount = {
  RequestMethod: "ServiceManager.GetAllRecentTagsCount",
};

//GetAllRecentTagsCount
export const getRecentArchiveDataCountByUserID = {
  RequestMethod: "ServiceManager.GetRecentArchiveDataCountByUserID",
};

//GetBlockedUsersCount
export const getBlockedUsersCount = {
  RequestMethod: "ServiceManager.GetBlockedUsersCount",
};

//getBlockedUsers
export const getBlockedUsers = {
  RequestMethod: "ServiceManager.GetBlockedUsers",
};

//GetAllUsers
export const getAllUsers = {
  RequestMethod: "ServiceManager.GetAllUsers",
};

//GetAllUsersGroupsRoomsList
export const getAllUsersGroupsRoomsList = {
  RequestMethod: "ServiceManager.GetAllUsersGroupsRoomsList",
};

//GetActiveUsersByGroupID
export const getActiveUsersByGroupID = {
  RequestMethod: "ServiceManager.GetActiveUsersByGroupID",
};

//GetActiveUsersByRoomID
export const getActiveUsersByRoomID = {
  RequestMethod: "ServiceManager.GetActiveUsersByRoomID",
};

//GetActiveUsersByBroadcastID
export const getActiveUsersByBroadcastID = {
  RequestMethod: "ServiceManager.GetActiveUsersByBroadcastID",
};

//InsertOTOMessages
export const insertOTOMessages = {
  RequestMethod: "ServiceManager.InsertOTOMessages",
};

export const getCommitteeByIdRequestMethod = {
  RequestMethod: "ServiceManager.GetCommitteeByCommitteeID",
};
export const getGroupsByUserIdRequestMethod = {
  RequestMethod: "ServiceManager.SearchGroups",
};
export const getGroupsByGroupIdRequestMethod = {
  RequestMethod: "ServiceManager.GetGroupByGroupID",
};
export const creategroupRequestMethod = {
  RequestMethod: "ServiceManager.CreateNewGroup",
};
export const getAllOrganizationGroupRoles = {
  RequestMethod: "ServiceManager.GetAllOrganizationGroupRoles",
};
export const getAllOrganizationGroupTypes = {
  RequestMethod: "ServiceManager.GetAllOrgainzationGroupTypes",
};
export const updateGroupRequestMethod = {
  RequestMethod: "ServiceManager.UpdateGroup",
};
export const updateGroupStatusRequestMethod = {
  RequestMethod: "ServiceManager.UpdateGroupStatus",
};
export const getCommitteesByUserID = {
  RequestMethod: "ServiceManager.SearchCommittees",
};
export const getallOrganizationCommitteType = {
  RequestMethod: "ServiceManager.GetallOrganizationCommitteType",
};
export const getallOrganizationCommitteMemberRole = {
  RequestMethod: "ServiceManager.GetallOrganizationCommitteMemberRole",
};
export const createCommitteeRequestMethod = {
  RequestMethod: "ServiceManager.CreateNewcommittee",
};
export const updateCommitteeStatusRequestMethod = {
  RequestMethod: "ServiceManager.UpdateCommitteeStatus",
};
export const updateCommitteeRequestMethod = {
  RequestMethod: "ServiceManager.UpdateCommittee",
};

export const insertPrivateGroupMessage = {
  RequestMethod: "ServiceManager.InsertGroupMessage",
};

//Block & Unblock User
export const blockUnblockUser = {
  RequestMethod: "ServiceManager.BlockUnBlockUser",
};

export const scheduleResolutionRequestMethod = {
  RequestMethod: "ServiceManager.AddUpdateScheduleResolution",
};

export const addUpdateResolutionRequestMethod = {
  RequestMethod: "ServiceManager.AddUpdateResolutionDetails",
};
export const getAllVotingRequestMethod = {
  RequestMethod: "ServiceManager.GetAllVotingMethod",
};
export const getAllVotingStatusRequestMethod = {
  RequestMethod: "ServiceManager.GetAllResolutionStatus",
};
export const getResolutionsRequestMethod = {
  RequestMethod: "ServiceManager.SearchResolutions",
};

export const getVoterResolutionRequestMethod = {
  RequestMethod: "ServiceManager.SearchVoterResolutions",
};
export const getResolutionByIDRequestMethod = {
  RequestMethod: "ServiceManager.GetResolutionByID",
};
//Delete Single Message
export const deleteSingleMessage = {
  RequestMethod: "ServiceManager.SetMessageDelete",
};

//Broadcast Message
export const insertBroadcastMessage = {
  RequestMethod: "ServiceManager.InsertBroadcastMessage",
};

//Create Talk Group
export const createTalkPrivateGroup = {
  RequestMethod: "ServiceManager.InsertGroup",
};

//Get Private Group Members
export const getPrivateGroupMembers = {
  RequestMethod: "ServiceManager.GetActiveUsersByGroupID",
};

//Edit Group
export const updatePrivateGroup = {
  RequestMethod: "ServiceManager.ModifyGroup",
};

export const deleteNotes = {
  RequestMethod: "ServiceManager.DeleteNotes",
};

export const getAllOrganizationGroups = {
  RequestMethod: "ServiceManager.GetAllOrganizationGroups",
};

export const CommitteeAndGroupMappingRequestMethod = {
  RequestMethod: "ServiceManager.CommitteeAndGroupMapping",
};
export const getResolutionResultsDetails = {
  RequestMethod: "ServiceManager.GetResultDetails",
};
export const getVoteDetailsByID = {
  RequestMethod: "ServiceManager.GetVoteDetailsByID",
};
export const cancelResolutionRequestMethod = {
  RequestMethod: "ServiceManager.CancelResolution",
};
export const updateVoteRequestMethod = {
  RequestMethod: "ServiceManager.UpdateVote",
};
export const closeResolutionRequestMethod = {
  RequestMethod: "ServiceManager.CloseResolution",
};

export const getBillingInformationRequestMethod = {
  RequestMethod: "ServiceManager.GetBillingInformation",
};
export const payOutStandingRequestMethod = {
  RequestMethod: "ServiceManager.PayOustanding",
};

export const invoiceandPaymentHistoryRequestMethod = {
  RequestMethod: "ServiceManager.InvoicesAndPaymentHistory",
};
export const markStarredMessage = {
  RequestMethod: "ServiceManager.SetMessageFlag",
};

export const saveFilesRequestMethod = {
  RequestMethod: "ServiceManager.SaveFiles",
};

export const uploadDocumentsRequestMethod = {
  RequestMethod: "ServiceManager.UploadDocuments",
};

export const saveFolderRequestMethod = {
  RequestMethod: "ServiceManager.SaveFolder",
};

export const getFolderDocumentsRequestMethod = {
  RequestMethod: "ServiceManager.GetFolderDocuments",
};

export const createFolderRequestMethod = {
  RequestMethod: "ServiceManager.CreateFolder",
};

export const getDocumentsAndFolderRequestMethod = {
  RequestMethod: "ServiceManager.GetDocumentsAndFolders",
};

export const shareFilesRequestMethod = {
  RequestMethod: "ServiceManager.ShareFiles",
};

export const shareFolderRequestMethod = {
  RequestMethod: "ServiceManager.ShareFolders",
};

export const deleteFileRequestMethod = {
  RequestMethod: "ServiceManager.DeleteFile",
};
export const FolderisExistRequestMethod = {
  RequestMethod: "ServiceManager.FolderExist",
};
export const FileisExistRequestMethod = {
  RequestMethod: "ServiceManager.FileExist",
};
export const deleteFolderRequestMethod = {
  RequestMethod: "ServiceManager.DeleteFolder",
};

export const leaveGroup = {
  RequestMethod: "ServiceManager.RemoveUserFromGroup",
};

export const createShoutAll = {
  RequestMethod: "ServiceManager.InsertBroadcast",
};

export const deleteShoutAll = {
  RequestMethod: "ServiceManager.RemoveUserFromShout",
};

export const updateShoutAll = {
  RequestMethod: "ServiceManager.UpdateBroadcast",
};

export const insertBulkMessages = {
  RequestMethod: "ServiceManager.InsertBulkMessages",
};

export const googleValidToken = {
  RequestMethod: "ServiceManager.GetGoogleValidToken",
};
export const revoketoken = {
  RequestMethod: "ServiceManager.RevokeToken",
};
export const searchUserMeetings = {
  RequestMethod: "ServiceManager.SearchMeetings",
};

export const searchTodoListRequestMethod = {
  RequestMethod: "ServiceManager.SearchToDoList",
};

export const searchNoteRequetMethod = {
  RequestMethod: "ServiceManager.SearchNotes",
};
export const paymentMethodsRequestMethod = {
  RequestMethod: "ServiceManager.GetPaymentMethods",
};

export const downloadChat = {
  RequestMethod: "ServiceManager.DownloadChat",
};

export const searchPaymentHistoryRequestMethod = {
  RequestMethod: "ServiceManager.InvoicesAndPaymentHistory",
};

export const searcPollsRequestMethod = {
  RequestMethod: "ServiceManager.SearchPolls",
};

export const savePollsRequestMethod = {
  RequestMethod: "ServiceManager.SavePoll",
};

export const getAllCommittesandGroupsforPolls = {
  RequestMethod: "ServiceManager.GetAllGroupsAndCommitteesByOrganizaitonID",
};

export const renameFolderRequestMethod = {
  RequestMethod: "ServiceManager.RenameFolder",
};
export const renameFileRequestMethod = {
  RequestMethod: "ServiceManager.RenameFile",
};
export const subscriptiondetailsRequestMethod = {
  RequestMethod: "ServiceManager.SubscriptionDetail",
};

export const searchPolls = {
  RequestMethod: "ServiceManager.SearchPolls",
};

export const castVote = {
  RequestMethod: "ServiceManager.CastVote",
};

export const getAllPollStatus = {
  RequestMethod: "ServiceManager.GetAllPollStatus",
};

export const getPollByPollID = {
  RequestMethod: "ServiceManager.GetPollByPollID",
};

export const updatePolls = {
  RequestMethod: "ServiceManager.UpdatePoll",
};

export const getPollByPollId = {
  RequestMethod: "ServiceManager.GetAllPollOptionsByPollId",
};

export const subscriptionPackageUpgradeAmount = {
  RequestMethod: "ServiceManager.GetPackageUpgradeTotalAmount",
};

export const subscriptionPackageUpgradePayment = {
  RequestMethod: "ServiceManager.PackageUpgradePaymentComplete",
};
export const paymentCompleteMethod = {
  RequestMethod: "ServiceManager.PaymentComplete",
};

export const viewvotes = {
  RequestMethod: "ServiceManager.ViewVotes",
};
export const deltePolls = {
  RequestMethod: "ServiceManager.UpdatePollStatusByPollId",
};

export const updateMessageAcknowledgement = {
  RequestMethod: "ServiceManager.UpdateMessageAcknowledgement",
};

export const getAllStarredMessages = {
  RequestMethod: "ServiceManager.GetAllFlaggedMessages",
};

export const saveFilesandFolderRM = {
  RequestMethod: "ServiceManager.SaveFileAndFolder",
};

export const DeleteCommentRM = {
  RequestMethod: "ServiceManager.DeleteComment",
};

export const getSystemSupportedLanguage = {
  RequestMethod: "ServiceManager.GetSystemSupportedLanguage",
};

export const getLastSelectedLanguage = {
  RequestMethod: "ServiceManager.GetLastSelectedLanguage",
};

export const setLastSelectedLanguage = {
  RequestMethod: "ServiceManager.SetLastSelectedLanguage",
};

export const getAllVideoCallUsers = {
  RequestMethod: "ServiceManager.GetAllUsers",
};

export const initiateVideoCall = {
  RequestMethod: "ServiceManager.InitiateVideoCall",
};

export const videoCallResponse = {
  RequestMethod: "ServiceManager.VideoCallResponse",
};

export const getUserRecentCalls = {
  RequestMethod: "ServiceManager.GetUserRecetCalls",
};

export const updateProfilePictureRM = {
  RequestMethod: "ServiceManager.UpdateProfilePicture",
};

export const callRequestReceived = {
  RequestMethod: "ServiceManager.CallRequestReceived",
};

export const getUserMissedCallCount = {
  RequestMethod: "ServiceManager.GetUserMissedCallCount",
};

export const searchDocumentsFoldersAPI = {
  RequestMethod: "ServiceManager.SearchDocumentsAndFolders",
};

export const leaveCall = {
  RequestMethod: "ServiceManager.LeaveCall",
};

export const getAnnotationOfToDoAttachement = {
  RequestMethod: "ServiceManager.GetAnnotationOfToDoAttachement",
};
export const addAnnotationOnToDoAttachement = {
  RequestMethod: "ServiceManager.AddAnnotationOnToDoAttachement",
};

export const getEventsTypeRM = {
  RequestMethod: "ServiceManager.GetAllEventTypes",
};
export const GetDiskusEventDetailsRM = {
  RequestMethod: "ServiceManager.GetDiskusEventDetails",
};

export const getAnnotationOfNotesAttachment = {
  RequestMethod: "ServiceManager.GetAnnotationOfNotesAttachement",
};

export const addAnnotationOnNotesAttachment = {
  RequestMethod: "ServiceManager.AddAnnotationOnNotesAttachement",
};

export const getAnnotationOfResolutionAttachment = {
  RequestMethod: "ServiceManager.GetAnnotationOfResolutionAttachement",
};

export const addAnnotationOnResolutionAttachment = {
  RequestMethod: "ServiceManager.AddAnnotationOnResolutionAttachement",
};

export const getAnnotationOfDataroomAttachment = {
  RequestMethod: "ServiceManager.GetAnnotationOfFilesAttachement",
};

export const addAnnotationOnDataroomAttachment = {
  RequestMethod: "ServiceManager.AddAnnotationOnFilesAttachement",
};

export const deleteMultipleGroupMessages = {
  RequestMethod: "ServiceManager.DeleteMultipleMessages",
};

export const getRecentDocumentsRM = {
  RequestMethod: "ServiceManager.GetRecentDocuments",
};

export const getAllGroupsUsersAndCommitteesByOrganizaitonID = {
  RequestMethod: "ServiceManager.GetAllGroupsAndCommitteesByOrganizaitonID",
};

export const saveMeetingOrganizers = {
  RequestMethod: "ServiceManager.SaveMeetingOrganizers",
};

export const getallMeetingType = {
  RequestMethod: "ServiceManager.GetAllMeetingTypes",
};

export const saveMeetingDetials = {
  RequestMethod: "ServiceManager.SaveMeetingDetails",
};

export const GetMeetingNewFrequencyReminder = {
  RequestMethod: "ServiceManager.GetMeetingReminders",
};

export const GetAllRecurringNewMeeting = {
  RequestMethod: "ServiceManager.GetAllRecurringFactor",
};

export const meetingStatusUpdate = {
  RequestMethod: "ServiceManager.MeetingStatusUpdate",
};

export const getParticipantsRoles = {
  RequestMethod: "ServiceManager.GetAllParticipantRoles",
};

export const saveAgendaContributorsRM = {
  RequestMethod: "ServiceManager.SaveAgendaContributors",
};

// export const FetchVideoUrl = {
//   RequestMethod: "ServiceManager.GetMeetingVideoURL",
// };

export const FetchVideoUrl = {
  RequestMethod: "ServiceManager.GetMeetingVideoURLNew",
};

export const saveParticipantsMeeting = {
  RequestMethod: "ServiceManager.SaveMeetingParticipants",
};

export const getAllAgendaContributorRM = {
  RequestMethod: "ServiceManager.GetAllMeetingAgendaContributors",
};

export const getAllSavedParticipants = {
  RequestMethod: "ServiceManager.GetAllMeetingParticipants",
};

export const getAllMeetingOrganizers = {
  RequestMethod: "ServiceManager.GetAllMeetingOrganizers",
};

export const getUserAgainstShareFileRM = {
  RequestMethod: "ServiceManager.GetUsersAgainstSharedFile",
};

export const getUserAgainstShareFolderRM = {
  RequestMethod: "ServiceManager.GetUsersAgainstSharedFolder",
};

export const createFileLinkRM = {
  RequestMethod: "ServiceManager.CreateFileLink",
};

export const createFolderLinkRM = {
  RequestMethod: "ServiceManager.CreateFolderFileLink",
};

export const updateGeneralAccessRM = {
  RequestMethod: "ServiceManager.UpdateGeneralAccess",
};

export const updateFolderGeneralAccessRM = {
  RequestMethod: "ServiceManager.UpdateFolderGeneralAccess",
};

export const checkFileLinkRM = {
  RequestMethod: "ServiceManager.CreateFileLink",
};

export const requestAccessRM = {
  RequestMethod: "ServiceManager.RequestAccess",
};

export const sendNotification = {
  RequestMethod: "ServiceManager.SendRecentNotifications",
};

export const getAllMeetingDetailsByMeetingID = {
  RequestMethod: "ServiceManager.GetAdvanceMeetingDetailsByMeetingID",
};

export const getPollsByMeetingID = {
  RequestMethod: "ServiceManager.GetPollsByMeetingID",
};

export const getAllmeetingUsers = {
  RequestMethod: "ServiceManager.GetAllMeetingUsers",
};

export const SetMeetingPolls = {
  RequestMethod: "ServiceManager.SetMeetingPolls",
};

export const SettingMeetingProposedDates = {
  RequestMethod: "ServiceManager.SetMeetingProposedDates",
};

export const getAllPropsedMeetingdates = {
  RequestMethod: "ServiceManager.GetAllMeetingProposedDates",
};

//AUN working on Attendance Meeting
export const getAllAttendanceMeeting = {
  RequestMethod: "ServiceManager.GetAllMeetingAttendanceReport",
};

//Aun working on Save Attendance Meeting
export const saveMeetingAttendance = {
  RequestMethod: "ServiceManager.SaveMeetingAttendanceReport",
};

export const updateResolutionDataRoomMapRM = {
  RequestMethod: "ServiceManager.UpdateResolutionDataRoomMap",
};

export const saveResolutionDocumentsRM = {
  RequestMethod: "ServiceManager.SaveResolutionDocuments",
};

export const setMeetingProposedDatesResponse = {
  RequestMethod: "ServiceManager.SetMeetingProposedDatesResponse",
};

export const CreateUpdateCommitteeDatarRoomRM = {
  RequestMethod: "ServiceManager.CreateUpdateCommiteeDataRoomMap",
};
export const saveCommitteeDocumentsRM = {
  RequestMethod: "ServiceManager.SaveCommitteeDocuments",
};

export const reteriveCommitteeDocumentsRM = {
  RequestMethod: "ServiceManager.ReteriveCommitteeDocuments",
};

//Aun work on Get meetingMaterial
export const getAllMeetingMaterial = {
  RequestMethod: "ServiceManager.GetAllMeetingMaterial",
};

//Aun working on download Attendance Report
export const downloadMeetingAttendanceReport = {
  RequestMethod: "ServiceManager.DownloadMeetingAttendanceReportExcel",
};

export const CreateUpdateGroupDataRoadMap = {
  RequestMethod: "ServiceManager.CreateUpdateGroupDataRoomMap",
};

export const SaveTheGroupsDocuments = {
  RequestMethod: "ServiceManager.SaveGroupsDocuments",
};

export const RetrieveGroupDocuments = {
  RequestMethod: "ServiceManager.ReteriveGroupDocuments",
};

export const MeetingAgendaLock = {
  RequestMethod: "ServiceManager.UpdateMeetingAgendaLockStatus",
};

export const GetAllUserAgendaRights = {
  RequestMethod: "ServiceManager.GetAllUserAgendaRights",
};

export const saveUserAttachmentPermission = {
  RequestMethod: "ServiceManager.SaveUserAttachmentPermission",
};

export const getPollbyCommitteeIdRM = {
  RequestMethod: "ServiceManager.GetPollsByComitteeID",
};
export const setCommitteePollsRM = {
  RequestMethod: "ServiceManager.SetCommitteePolls",
};

export const getAgendaVotingDetails = {
  RequestMethod: "ServiceManager.GetAgendaVotingDetails",
};

export const getAllVotingResultDisplay = {
  RequestMethod: "ServiceManager.GetAllVotingResultDisplay",
};

export const saveAgendaVoting = {
  RequestMethod: "ServiceManager.SaveAgendaVoting",
};

export const getAgendaAndVotingInfo = {
  RequestMethod: "ServiceManager.GetAgendaAndVotingInfo",
};

export const casteVoteForAgenda = {
  RequestMethod: "ServiceManager.CasteVoteForAgenda",
};

export const viewAgendaVotingResults = {
  RequestMethod: "ServiceManager.ViewAgendaVotingResults",
};

export const getPollByGroupIDApi = {
  RequestMethod: "ServiceManager.GetPollsByGroupID",
};

export const setGroupPollsApi = {
  RequestMethod: "ServiceManager.SetGroupPolls",
};

export const getGeneralMinutes = {
  RequestMethod: "ServiceManager.GetMeetingGeneralMinutes",
};

export const SaveminutesGeneral = {
  RequestMethod: "ServiceManager.AddGeneralMinute",
};

export const SaveGeneralWiseSavingDocuments = {
  RequestMethod: "ServiceManager.SaveGeneralMinutesDocuments",
};

export const RetriveGeneralMinutesDocuments = {
  RequestMethod: "ServiceManager.ReteriveGeneralMinuteDocuments",
};

export const getAllGeneralMiintuesDocument = {
  RequestMethod: "ServiceManager.GetAllGeneralMiuteDocumentsForMeeting",
};

export const getTaskGroupIDApi = {
  RequestMethod: "ServiceManager.GetTasksByGroupID",
};

export const setGroupTaskApi = {
  RequestMethod: "ServiceManager.SetGroupTasks",
};

export const getTaskByCommitteeIDApi = {
  RequestMethod: "ServiceManager.GetTasksByCommitteeID",
};

export const setCommitteeTaskApi = {
  RequestMethod: "ServiceManager.SetCommitteeTasks",
};

export const DeleteGeneralMinutes = {
  RequestMethod: "ServiceManager.DeleteGeneralMinute",
};

export const UpdateGeneralMinutes = {
  RequestMethod: "ServiceManager.UpdateGeneralMinute",
};

export const agenwiseMinutes = {
  RequestMethod: "ServiceManager.AddAgendaWiseMinutes",
};

export const DeleteagendaWiseMinutes = {
  RequestMethod: "ServiceManager.DeleteAgendaWiseMinute",
};

export const updateAgendaWiseMinutes = {
  RequestMethod: "ServiceManager.UpdateAgendaWiseMinute",
};

export const getAllAgendaWiseMinutes = {
  RequestMethod: "ServiceManager.GetAllMeetingAgendaWiseMinutes",
};
export const deleteCommitteePollRM = {
  RequestMethod: "ServiceManager.DeleteCommitteePolls",
};

export const deleteGroupPollsRM = {
  RequestMethod: "ServiceManager.DeleteGroupPolls",
};

export const deleteMeetingPollsRM = {
  RequestMethod: "ServiceManager.DeleteMeetingPolls",
};

export const deleteCommitteeTaskRM = {
  RequestMethod: "ServiceManager.DeleteCommitteeTasks",
};

export const deleteGroupTaskRM = {
  RequestMethod: "ServiceManager.DeleteGroupTasks",
};

export const getUserWiseProposeDate = {
  RequestMethod: "ServiceManager.GetParticipantWiseProposedDates",
};

export const getAdvanceMeetingAgendabyMeetingID = {
  RequestMethod: "ServiceManager.GetAdvanceMeetingAgendabyMeetingID",
};

export const saveDocumentAgendaWiseMinutes = {
  RequestMethod: "ServiceManager.SaveAgendaWiseMinutesDocuments",
};

export const RetriveAgendaWiseDocuments = {
  RequestMethod: "ServiceManager.ReteriveAgendaWiseMiuteDocuments",
};

export const DeleteDocumentGenralMinute = {
  RequestMethod: "ServiceManager.DeleteGeneralMinuteDocuments",
};

export const createUpdateMeetingDataRoomMap = {
  RequestMethod: "ServiceManager.CreateUpdateMeetingDataRoomMap",
};

export const ScheduleMeetingOnSelectedDate = {
  RequestMethod: "ServiceManager.ScheduleMeetingOnSelectedDate",
};

export const getMeetingbyGroupIDRM = {
  RequestMethod: "ServiceManager.GetMeetingsByGroupID",
};

export const getMeetingbyCommitteeIDRM = {
  RequestMethod: "ServiceManager.GetMeetingsByCommitteeID",
};

export const setMeetingbyGroupIDRM = {
  RequestMethod: "ServiceManager.SetGroupMeeting",
};

export const setMeetingbyCommitteeIDRM = {
  RequestMethod: "ServiceManager.SetCommitteeMeetings",
};
export const DeleteAgendaWiseDocuments = {
  RequestMethod: "ServiceManager.DeleteAgendaWiseMinuteDocuments",
};

export const CreateUpdateMeetingDataroomMapped = {
  RequestMethod: "ServiceManager.CreateUpdateMeetingDataRoomMap",
};

export const UpdateMeetingUserhit = {
  RequestMethod: "ServiceManager.UpdateMeetingUsers",
};

export const addUpdateAdvanceMeetingAgenda = {
  RequestMethod: "ServiceManager.AddUpdateAdvanceMeetingAgenda",
};

// report download Attendance in Excel
export const downloadAttendanceReport = {
  RequestMethod: "ServiceManager.DownloadAttendenceReportPDF",
};

export const agendaVotingStatusUpdate = {
  RequestMethod: "ServiceManager.AgendaVotingStatusUpdate",
};

export const saveMeetingDocuments = {
  RequestMethod: "ServiceManager.SaveMeetingDocuments",
};

// get All Meeting Tasks in Action
export const getMeetingTasksAction = {
  RequestMethod: "ServiceManager.GetMeetingTasks",
};

export const dataRoomFileDownloadService = {
  RequestMethod: "ServiceManager.DownloadFile",
};

export const dataRoomFolderDownloadService = {
  RequestMethod: "ServiceManager.DownloadFolder",
};

export const saveTaskandAssgineesRM = {
  RequestMethod: "ServiceManager.SaveTaskDocumentsAndAssignees",
};

export const createupdateTaskDataroom = {
  RequestMethod: "ServiceManager.CreateUpdateToDoDataRoomMap",
};

export const saveTaskDocuments = {
  RequestMethod: "ServiceManager.SaveToDoDocuments",
};

export const mapTaskWithMeetingAgenda = {
  RequestMethod: "ServiceManager.MapTaskWithMeetingAndAgenda",
};

export const removeTaskMeetingMapping = {
  RequestMethod: "ServiceManager.RemoveTaskMeetingMapping",
};

export const getAllagendaWiseDocumentsApi = {
  RequestMethod: "ServiceManager.GetAllAgendaWiseMinuteDocumentsForMeeting",
};

export const getAllAgendaForAgendaWise = {
  RequestMethod: "ServiceManager.GetAdvanceMeetingAgendabyMeetingID",
};

export const getAllMeetingForAgendaImport = {
  RequestMethod: "ServiceManager.GetAllMeetingForAgendaImport",
};

export const getAgendaWithMeetingIDForImport = {
  RequestMethod: "ServiceManager.GetAgendaWithMeetingIDForImport",
};

export const inviteForCollaboration = {
  RequestMethod: "ServiceManager.InviteForMinuteCollaboration",
};

export const getFileFolderDetailsRM = {
  RequestMethod: "ServiceManager.GetFileFolderDetails",
};

export const updateAndOpenByAndDescriptionRM = {
  RequestMethod: "ServiceManager.UpdateOpenedByAndDescription",
};

export const getDataAnalyticsRM = {
  RequestMethod: "ServiceManager.GetDataAnalytics",
};

export const getDataAnalyticsCountRM = {
  RequestMethod: "ServiceManager.GetDataAnalyticsCount",
};

export const validateEncryptedStringUserAvailabilityForMeeting = {
  RequestMethod:
    "ServiceManager.ValidateEncryptedStringUserAvailabilityForMeeting",
};

export const validateEncyptedStringUserDataRoom = {
  RequestMethod:
    "ServiceManager.ValidateEncryptedStringUserAvailabilityForDataRoom",
};

export const validateMicrosoftToken = {
  RequestMethod: "ServiceManager.GetMicrosoftValidToken",
};

// when organizer hit the view button in unpublished meeting
export const getUserWiseProposeDateOrganizer = {
  RequestMethod: "ServiceManager.GetUserWiseProposedDates",
};
export const UserLoginHistoryRM = {
  RequestMethod: "ServiceManager.GetUserLoginHistoryForOA",
};
export const UserLogout = {
  RequestMethod: "ServiceManager.LogOut",
};

export const createWorkFlowRM = {
  RequestMethod: "ServiceManager.CreateSignatureFlow",
};

export const saveWorkFlowRM = {
  RequestMethod: "ServiceManager.SaveWorkFlow",
};

export const updateActorBundleStatusRM = {
  RequestMethod: "ServiceManager.UpdateActorBundleStatus",
};

export const getActorBundleStatusStateRM = {
  RequestMethod: "ServiceManager.GetActorBundleStatusState",
};

export const getActionableBundleStatusStateRM = {
  RequestMethod: "ServiceManager.GetActionableBundleStatusState",
};

export const getEntityTypesRM = {
  RequestMethod: "ServiceManager.GetEntityTypes",
};
export const getWorkFlowRM = {
  RequestMethod: "ServiceManager.GetWorkFlow",
};
export const getWorkFlowsRM = {
  RequestMethod: "ServiceManager.GetWorkFlows",
};
export const saveActorRM = {
  RequestMethod: "ServiceManager.SaveActorColor",
};

export const saveActorColorRM = {
  RequestMethod: "ServiceManager.SaveActorColor",
};
export const saveAndEditFormFieldsRM = {
  RequestMethod: "ServiceManager.SaveAndEditFormFields",
};

export const sendDocumentRM = {
  RequestMethod: "ServiceManager.SendDocument",
};

export const DeclineReason = {
  RequestMethod: "ServiceManager.DeclineReason",
};

export const getAllFieldsByWorkFlowIdRM = {
  RequestMethod: "ServiceManager.GetAllFieldsByWorkFlowID",
};

export const addUpdateFieldValueRM = {
  RequestMethod: "ServiceManager.AddUpdateFieldValue",
};

export const saveAuditTrailRM = {
  RequestMethod: "ServiceManager.SaveAuditTrail",
};

export const getAllAuditTrailByWorkFlowIdRM = {
  RequestMethod: "ServiceManager.GetAllAuditTrailByWorkFlowID",
};

export const getDeclineReasonRM = {
  RequestMethod: "ServiceManager.GetDeclineReason",
};
export const getSignatureFormFieldTypesRM = {
  RequestMethod: "ServiceManager.GetSignatureFormFieldTypes",
};
export const getColorPlattesRM = {
  RequestMethod: "ServiceManager.GetColorPalettes",
};
export const getAuditTrailActionsRM = {
  RequestMethod: "ServiceManager.GetAuditTrailActions",
};
export const getActorFieldValuesRM = {
  RequestMethod: "ServiceManager.GetActorFieldValues",
};

export const addNewSignatureRM = {
  RequestMethod: "ServiceManager.AddANewSignature",
};

export const getAllSignaturesRM = {
  RequestMethod: "ServiceManager.GetAllSignatures",
};

export const getUserSignatureRM = {
  RequestMethod: "ServiceManager.GetUserSignature",
};

export const deleteUserSignatureRM = {
  RequestMethod: "ServiceManager.DeleteUserSignature",
};

export const getWorkFlowByFileIdRM = {
  RequestMethod: "ServiceManager.GetWorkFlowByFileID",
};
// new api for end quick meeting
export const endMeetingStatus = {
  RequestMethod: "ServiceManager.MeetingStatusUpdate",
};

export const saveSignatureDocumentRM = {
  RequestMethod: "ServiceManager.SaveSignatureDocument",
};

export const getMeetingParticipantsInfo = {
  RequestMethod: "ServiceManager.GetMeetingParticipantsInfo",
};

export const sendAgendaPDFAsEmail = {
  RequestMethod: "ServiceManager.SendAgendaPDFAsEmail",
};

export const exportAgendaAsPDF = {
  RequestMethod: "ServiceManager.ExportAgendaAsPDF",
};

export const printMeetingAgenda = {
  RequestMethod: "ServiceManager.PrintMeetingAgenda",
};

export const SaveOrganizationAndPakageSelection = {
  RequestMethod: "ServiceManager.SaveOrganizationsAndSelectedPackage",
};

export const ExtendOrganizationTrial = {
  RequestMethod: "ServiceManager.ExtendOrganizationTrial",
};

export const AddOrganizationsUser = {
  RequestMethod: "ServiceManager.AddOrganizationsUsers",
};

export const EditOrganizationsUser = {
  RequestMethod: "ServiceManager.EditOrganizationsUser",
};

export const AllOrganizationsUsers = {
  RequestMethod: "ServiceManager.ManageUserScreen",
};

export const OrganizationPackageDetailsAndUserStats = {
  RequestMethod: "ServiceManager.OrganizationPackageDetailsAndUserStats",
};

export const GetOrganizationSelectedPackagesByOrganizationID = {
  RequestMethod:
    "ServiceManager.GetOrganizationSelectedPackagesByOrganizationID",
};

export const joinMeeting = {
  RequestMethod: "ServiceManager.JoinMeeting",
};

export const leaveMeeting = {
  RequestMethod: "ServiceManager.LeaveMeeting",
};

export const getOrganizationSelectedPakages = {
  RequestMethod: "ServiceManager.GetOrganizationSelectedPackages",
};

export const GetAllUserTypePackages = {
  RequestMethod: "ServiceManager.GetAllUserTypePackages",
};

export const leaveFileSharingRM = {
  RequestMethod: "ServiceManager.DeleteFileSharing",
};

// export const delete organization User for Admin

export const ResendForgotPasswordCode = {
  RequestMethod: "ServiceManager.ResendForgotPasswordCode",
};

export const DeleteOrganizationsUser = {
  RequestMethod: "ServiceManager.DeleteOrganizationsUser",
};

export const leaveFolderSharingRM = {
  RequestMethod: "ServiceManager.DeleteFolderSharing",
};

export const PaymentInitiateStepperThree = {
  RequestMethod: "ServiceManager.PaymentInitiate",
};

// for get Cancel Subscription Reasons
export const CancelSubReasons = {
  RequestMethod: "ServiceManager.GetCancelSubscriptionReasons",
};

// for cancel subscription
export const CancelOrganizationsSubscriptions = {
  RequestMethod: "ServiceManager.CancelOrganizationsSubscription",
};

// Api for upgrade button on package details which is not ready yet but structure should be ready when Api will implemented ready to go
// export const upgradePackageApiCallOnPackageDetailPage = {
//   RequestMethod: ""
// };

export const revokeMicrosoftToken = {
  RequestMethod: "ServiceManager.RevokeMicrosoftToken",
};

export const requestOrganizationTrialExtend = {
  RequestMethod: "ServiceManager.RequestOrganizationTrialExtend",
};

export const paymentStatus = {
  RequestMethod: "ServiceManager.PaymentStatus",
};

export const ValidateEmailRelatedString = {
  RequestMethod:
    "ServiceManager.ValidateEncryptedStringMeetingRelatedEmailData",
};

export const ValidateEmailRelatedStringPolls = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringPollRelatedEmailData",
};

export const downloadAttachmentTalk = {
  RequestMethod: "ServiceManager.DownloadAttachment",
};

export const changeSelectedSubscription = {
  RequestMethod: "ServiceManager.ChangeSelectedSubscriptionDetails",
};
export const CancelTrailandUpdageOrganiztionRM = {
  RequestMethod: "ServiceManager.CancelTrialAndUpgradeOrganizationSubscription",
};

export const GetAllSignatureFlowDocumentsForCreatorRM = {
  RequestMethod:
    "ServiceManager.GetAllSignatureFlowDocumentsForCreatorWithFilters",
};

export const ListOfPendingForApprovalSignaturesRM = {
  RequestMethod: "ServiceManager.ListOfPendingForApprovalSignatures",
};
export const GetInvoiceHTMLByOrganizatonID = {
  RequestMethod: "ServiceManager.GetInvoiceHtmlByOrganizationID",
};
export const LoginHistoryReportExporttoExcel = {
  RequestMethod: "ServiceManager.LoginHistoryReport",
};
export const GetAllPendingForApprovalStatsRM = {
  RequestMethod: "ServiceManager.GetAllPendingForApprovalStats",
};
//Minutes APIs

export const listOfDefaultRejectionComments = {
  RequestMethod: "ServiceManager.ListOfDefaultRejectionComments",
};

export const pendingApprovalsCount = {
  RequestMethod: "ServiceManager.PendingApprovalsCount",
};

export const getMinuteReviewStatsForOrganizerByMeetingId = {
  RequestMethod: "ServiceManager.GetMinuteReviewStatsForOrganizerByMeetingId",
};

export const getAllOrganizationUsersForReview = {
  RequestMethod: "ServiceManager.GetAllOrganizationUsersForReview",
};

export const getMinutesForReviewerByMeetingId = {
  RequestMethod: "ServiceManager.GetMinutesForReviewerByMeetingId",
};

export const getMinuteReviewPendingApprovalsStatsByReviewerId = {
  RequestMethod:
    "ServiceManager.GetMinuteReviewPendingApprovalsStatsByReviewerId",
};

export const getMinuteReviewPendingApprovalsByReviewerId = {
  RequestMethod: "ServiceManager.GetMinuteReviewPendingApprovalsByReviewerId",
};

export const saveMinutesReviewFlow = {
  RequestMethod: "ServiceManager.SaveMinutesReviewFlow",
};

export const getPendingApprovalStatusesForMinuteReview = {
  RequestMethod: "ServiceManager.GetPendingApprovalStatusesForMinuteReview",
};

export const acceptRejectMinuteReview = {
  RequestMethod: "ServiceManager.AcceptRejectMinuteReview",
};

export const resendUpdatedMinuteForReview = {
  RequestMethod: "ServiceManager.ResendUpdatedMinuteForReview",
};

export const getMinuteVersionHistoryWithComments = {
  RequestMethod: "ServiceManager.GetMinuteVersionHistoryWithComments",
};

export const getMinuteReviewFlowByMeetingId = {
  RequestMethod: "ServiceManager.GetMinuteReviewFlowByMeetingId",
};

export const updateCommentForRejectedMinute = {
  RequestMethod: "ServiceManager.UpdateCommentForRejectedMinute",
};

export const getMinuteReviewDetailsForOrganizerByMinuteId = {
  RequestMethod: "ServiceManager.GetMinuteReviewDetailsForOrganizerByMinuteId",
};

export const deleteMinuteReviewByReviewer = {
  RequestMethod: "ServiceManager.DeleteMinuteReviewByReviewer",
};

export const downgradeOrganizationSubscription = {
  RequestMethod: "ServiceManager.DowngradeOrganizationSubscription",
};

export const getOrganizationWallet = {
  RequestMethod: "ServiceManager.GetOrganizationWallet",
};

export const BoardDeckSendEmail = {
  RequestMethod: "ServiceManager.SendBoardDeckPDFAsEmail",
};

export const DownloadBoarddeckPDF = {
  RequestMethod: "ServiceManager.DownloadBoardDeckPDF",
};

export const GetPendingApprovalStatusforSignatureFlowRM = {
  RequestMethod: "ServiceManager.GetPendingApprovalStatusesForSignatureFlow",
};
export const DeleteSignatureDocumentRM = {
  RequestMethod: "ServiceManager.DeleteSignatureFlowByWorkFlowId",
};

export const GetAllSignatoriesStatusRM = {
  RequestMethod: "ServiceManager.GetAllSignatoriesStatus",
};

export const PublishMeetingMinutesRM = {
  RequestMethod: "ServiceManager.PublishMeetingMinutes",
};
export const GetAllPublishedMeetingMinutesRM = {
  RequestMethod: "ServiceManager.GetAllPublishedMinutes",
};
export const DownloadInvoiceRM = {
  RequestMethod: "ServiceManager.DownloadInvoiceForOA",
};

export const publishMeetingMinutes = {
  RequestMethod: "ServiceManager.PublishMeetingMinutes",
};

export const getDataForResendMinuteReview = {
  RequestMethod: "ServiceManager.GetDataForResendMinuteReview",
};

export const validateVideoRecordingURL = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringVideoURlBoardDeck",
};

export const getMinuteAndSignatureApprovalThisWeekRM = {
  RequestMethod: "ServiceManager.GetMinuteAndSignatureApprovalsThisWeek",
};
export const getDashboardMeetingStatsRM = {
  RequestMethod: "ServiceManager.GetDashboardMeetingData",
};
export const getDashboardTaskStatsRM = {
  RequestMethod: "ServiceManager.GetDashboardToDoListData",
};
export const getDashboardPendingApprovalStatsRM = {
  RequestMethod: "ServiceManager.GetDashboardMinuteAndSignatureApprovals",
};

export const ValidateEncryptedStringForOTPEmailLinkRM = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringForOTPEmailLink",
};

export const getAdvanceMeetingAgendabyMeetingIDForView = {
  RequestMethod: "ServiceManager.GetAdvanceMeetingAgendabyMeetingIDForView",
};

export const getStatsForPublishingMinutesByWorkFlowId = {
  RequestMethod: "ServiceManager.GetStatsForPublishingMinutesByWorkFlowId",
};
export const GetMeetingBoardDeckCredentialsStatus = {
  RequestMethod: "ServiceManager.GetMeetingBoardDeckCredentialsStatus",
};

export const validateEncryptedStringParticipantProposedRM = {
  RequestMethod:
    "ServiceManager.ValidateEncryptedStringUserMeetingProposeDatesSelection",
};

export const validateEncryptedStringResolutionRelatedEmailDataRM = {
  RequestMethod:
    "ServiceManager.ValidateEncryptedStringResolutionRelatedEmailData",
};

export const getAllMeetingUsersRSVPDetailsRM = {
  RequestMethod: "ServiceManager.GetAllMeetingUserRSVPDetails",
};

export const downloadCallRecording = {
  RequestMethod: "ServiceManager.DownloadCallRecording",
};

export const downloadMeetingRecording = {
  RequestMethod: "ServiceManager.DownloadMeetingRecording",
};

export const leaveMeetingVideo = {
  RequestMethod: "ServiceManager.LeaveMeetingVideo",
};

export const getMeetingGuestVideoURL = {
  RequestMethod: "ServiceManager.GetMeetingGuestVideoURL",
};

export const ValidateEncryptedStringGuestVideoLink = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringGuestVideoLink",
};

export const joinGuestVideo = {
  RequestMethod: "ServiceManager.JoinGuestVideo",
};

export const admitRejectAttendee = {
  RequestMethod: "ServiceManager.AdmitRejectAttendee",
};

export const raiseUnRaisedHand = {
  RequestMethod: "ServiceManager.RaiseUnRaiseHand",
};

export const muteUnMuteParticipant = {
  RequestMethod: "ServiceManager.MuteUnMuteParticpant",
};

export const transferMeetingHost = {
  RequestMethod: "ServiceManager.TransferMeetingHost",
};

export const removeParticipantMeeting = {
  RequestMethod: "ServiceManager.RemoveParticipantFromMeeting",
};

export const guestLeaveMeetingVideo = {
  RequestMethod: "ServiceManager.GuestLeaveMeetingVideo",
};

export const muteUnMuteSelf = {
  RequestMethod: "ServiceManager.MuteUnMuteSelf",
};

export const hideUnHideVideoSelf = {
  RequestMethod: "ServiceManager.HideUnHideVideo",
};

export const hideUnHidePaticipantVideo = {
  RequestMethod: "ServiceManager.HideUnHideParticpantVideo",
};

export const ProposeNewMeetingSaveParticipants = {
  RequestMethod: "ServiceManager.SaveMeetingParticipantsForProposedMeeting",
};

export const ValidateEncryptedStringUserMeetingProposeDatesPollRM = {
  RequestMethod:
    "ServiceManager.ValidateEncryptedStringUserMeetingProposeDatesPoll",
};

export const getVideoCallParticipantsForGuest = {
  RequestMethod: "ServiceManager.GetVideoCallParticipants",
};

export const joinMeetingVideoRequest = {
  RequestMethod: "ServiceManager.JoinMeetingVideoRequest",
};

// for host waitingList and Participant List
export const getVideoCallParticipantsAndWaitingList = {
  RequestMethod: "ServiceManager.GetVideoCallParticipantsAndWaitingList",
};

export const GetSignatureFileAnnotationRM = {
  RequestMethod: "ServiceManager.GetSignatureFileAnnotation",
};
export const AddUpdateSignatureFileAnnotationRM = {
  RequestMethod: "ServiceManager.AddUpdateSignatureFileAnnotation",
};

//Web Notfication
export const DiskusWebNotification = {
  RequestMethod: "ServiceManager.GetUserWebNotifications",
};

export const DiskusWebNotificationMarkAsRead = {
  RequestMethod: "ServiceManager.MarkNotificationsAsRead",
};

//Get Meeting Status
export const GetMeetingStatus = {
  RequestMethod: "ServiceManager.GetMeetingAttendeeAndStatusData",
};

//Get DataRoom File Shared Persmission

export const GetDataRoomFileSharedPersmission = {
  RequestMethod: "ServiceManager.GetDataRoomSharedFilePermission",
};

//Minutes Work Flow Actor Status WebNotification

export const MinutesWorkFlowActorStatusNotification = {
  RequestMethod: "ServiceManager.GetWorkFlowStatusForActor",
};

// Email Related Api for Committees
export const ValidateEncryptedStringViewCommitteeListLinkRM = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringViewCommitteeListLink",
};
export const ValidateEncryptedStringViewCommitteeDetailLinkRM = {
  RequestMethod:
    "ServiceManager.ValidateEncryptedStringViewCommitteeDetailsLink",
};

export const ValidateEncryptedStringViewGroupDetailsLinkRM = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringViewGroupDetailsLink",
};
export const ValidateEncryptedStringViewGroupListLinkRM = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringViewGroupListLink",
};
export const ValidateEncryptedStringViewTaskListLinkRM = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringViewTaskListLink",
};

export const ValidateEncryptedStringViewTaskDetailsLinkRM = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringViewTaskDetailsLink",
};

export const ValidateEncryptedStringViewFileLinkRM = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringViewFileLink",
};

export const ValidateEncryptedStringViewFolderLinkRM = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringViewFolderLink",
};

export const CreateUpdateNotesDataRoomMap = {
  RequestMethod: "ServiceManager.CreateUpdateNotesDataRoomMap",
};

export const SaveNotesDocument = {
  RequestMethod: "ServiceManager.SaveNotesDocuments",
};

export const RetrieveNotesDocument = {
  RequestMethod: "ServiceManager.ReteriveNotesDocuments",
};

export const ValidateEncryptedStringMeetingRelatedEmailDataRM = {
  RequestMethod:
    "ServiceManager.ValidateEncryptedStringMeetingRelatedEmailData",
};

export const MoveFilesToFoldersRM = {
  RequestMethod: "ServiceManager.MoveFilesToFolders",
};

// Delete Notes Document
export const DeleteNotesDocuments = {
  RequestMethod: "ServiceManager.DeleteNotesDocuments",
};

//update cast vote
export const updateCastVotePolls = {
  RequestMethod: "ServiceManager.UpdateCastedVote",
};

//Open Presenter View
export const openPresenterView = {
  RequestMethod: "ServiceManager.OpenPresenterView",
};

//Start Presenter View
export const startPresenterView = {
  RequestMethod: "ServiceManager.StartPresenterView",
};

//Stop Presenter View
export const stopPresenterView = {
  RequestMethod: "ServiceManager.StopPresenterView",
};

//Join Presenter View
export const joinPresenterView = {
  RequestMethod: "ServiceManager.JoinPresenterView",
};

//Leave Presenter View
export const leavePresenterView = {
  RequestMethod: "ServiceManager.LeavePresenterView",
};

export const ValidateEncryptedStringMinuteReviewDataRM = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringMinuteReviewData",
};

export const ValidateEncryptedStringSignatureDataRM = {
  RequestMethod: "ServiceManager.ValidateEncryptedStringSignatureData",
};
export const GetMeetingRecordingFilesRM = {
  RequestMethod: "ServiceManager.GetMeetingRecordingFiles",
};
export const RequestMeetingRecordingTranscriptRM = {
  RequestMethod: "ServiceManager.RequestMeetingRecordingTranscript",
};

export const ValidateUserPasswordRM = {
  RequestMethod: "ServiceManager.ValidateUserPassword",
};

export const participantOfGroupCall = {
  RequestMethod: "ServiceManager.GetGroupCallParticipants",
};

// For Shared Screen when someone share screen then others need to Disable
export const isSharedScreenCall = {
  RequestMethod: "ServiceManager.IsSharedScreen",
};

//Save Audit log
export const SaveAuditLog = {
  RequestMethod: "ServiceManager.SaveAuditLog",
};

// Audit listing
export const GetUsersAuditListing = {
  RequestMethod: "ServiceManager.GetUsersAuditListing",
};

// Audit Actions
export const GetUsersAuditActions = {
  RequestMethod: "ServiceManager.GetUserAuditActionsForOA",
};

export const AuditTrialReportExporttoExcel = {
  RequestMethod: "ServiceManager.DownloadAuditReportForOA",
};

// Authority Work
export const GetAllAuthority = {
  RequestMethod: "ServiceManager.GetAllAuthority",
};

export const GetAuthorityByID = {
  RequestMethod: "ServiceManager.GetAuthorityByID",
};

export const DeleteAuthority = {
  RequestMethod: "ServiceManager.DeleteAuthority",
};

export const UpdateAuthority = {
  RequestMethod: "ServiceManager.UpdateAuthority",
};
export const AddAuthority = {
  RequestMethod: "ServiceManager.AddAuthority",
};
export const IsShortCodeExists = {
  RequestMethod: "ServiceManager.IsShortCodeExists",
};

export const IsAuthorityNameExists = {
  RequestMethod: "ServiceManager.IsAuthorityNameExists",
};

export const GetAllAuthoritiesDropdown = {
  RequestMethod: "ServiceManager.GetAllAuthoritiesWithoutPagination",
};

export const GetAllTagsByOrganizationID = {
  RequestMethod: "ServiceManager.GetAllTagsByOrganizationID",
};

export const AddCompliance = {
  RequestMethod: "ServiceManager.AddCompliance",
};

export const AddComplianceChecklist = {
  RequestMethod: "ServiceManager.AddComplianceChecklist",
};
export const GetComplianceChecklistsByComplianceId = {
  RequestMethod: "ServiceManager.GetComplianceChecklistsByComplianceId",
};
export const CheckComplianceTitleExists = {
  RequestMethod: "ServiceManager.CheckComplianceTitleExists",
};
export const ViewComplianceById = {
  RequestMethod: "ServiceManager.ViewComplianceById",
};

export const CheckChecklistTitleExists = {
  RequestMethod: "ServiceManager.CheckChecklistTitleExists",
};

export const AddTaskMappingToChecklist = {
  RequestMethod: "ServiceManager.AddTaskMappingToChecklist",
};

export const GetComplianceChecklistsWithTasksByComplianceId = {
  RequestMethod:
    "ServiceManager.GetComplianceChecklistsWithTasksByComplianceId",
};

export const EditComplianceChecklist = {
  RequestMethod: "ServiceManager.EditComplianceChecklist",
};

export const SearchCompliancesByCreatorIdRM = {
  RequestMethod: "ServiceManager.SearchCompliancesByCreatorId",
};

export const ViewComplianceByMeDetailsRM = {
  RequestMethod: "ServiceManager.ViewComplianceByMeDetails",
};

// to be replaced by

export const ViewComplianceDetailsByViewTypeRM = {
  RequestMethod: "ServiceManager.ViewComplianceDetailsByViewType",
};

export const ViewComplianceForMeById = {
  RequestMethod: "ServiceManager.ViewComplianceForMeById",
};

export const SearchComplianceForMe = {
  RequestMethod: "ServiceManager.SearchComplianceForMe",
};
export const GetComplianceChecklistsWithTasksByComplianceIdForMe = {
  RequestMethod:
    "ServiceManager.GetComplianceChecklistsWithTasksByComplianceIdForMe",
};

export const GetComplianceAndTaskStatuses = {
  RequestMethod: "ServiceManager.GetComplianceAndTaskStatuses",
};

//Api For Compliance Dashboard Quarterly Submitted
export const GetComplianceQuarterlySubmitted = {
  RequestMethod: "ServiceManager.QuarterlySubmittedCompliances",
};

//Api For Compliance Dashboard Upcoming Deadline
export const GetUpcomingComplianceDeadline = {
  RequestMethod: "ServiceManager.UpcomingCompliancesDeadline",
};

//Api For Compliance By Dashboard
export const GetComplianceByDashboard = {
  RequestMethod: "ServiceManager.ComplianceByForDashboard",
};

//Api For Compliance Tasks Dashboard
export const GetComplianceTasksDashboard = {
  RequestMethod: "ServiceManager.TasksDashboard",
};

//Api For Compliance Reopen Dashboard
export const GetComplianceReopenDashboard = {
  RequestMethod: "ServiceManager.ReopenedCompliancesForDashboard",
};

//Api For Compliance Quarterly Tasks Dashboard
export const GetComplianceQuarterlyTasksDashboard = {
  RequestMethod: "ServiceManager.QuarterlyComplianceTasksSummary",
};
