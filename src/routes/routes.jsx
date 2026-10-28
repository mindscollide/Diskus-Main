/**
 * @file routes.js
 * @description Application route definitions using React Router v6.
 *
 * Uses `createBrowserRouter` (HTML5 history API).
 *
 * Route categories:
 *  - Public routes: accessible without authentication (login, signup, password reset, etc.)
 *  - Private user routes: wrapped in <PrivateRoutes>, nested under /Diskus/
 *  - Private admin routes: wrapped in <PrivateAdminRoute>, nested under /Admin/
 *  - Private video route: wrapped in <PrivateVideoMeeting>, at /Diskus/video
 *
 * Every route element is wrapped in:
 *  - <RouteWrapperUser> or <RouteWrapperAdmin> — page-level concerns (title, layout)
 *  - <ErrorBoundary> — catches render errors and shows <ErrorFallback>
 *
 * Some routes inject additional scoped Context providers:
 *  - <NewMeetingProvider> on /Diskus/Meeting
 *  - <AuthorityProvider> on /Admin/manageAuthority
 *  - <ComlianceProvider> on /Diskus/compliance (local scope)
 */
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
} from "react-router-dom";
import { getLocalStorageItemNonActiveCheck } from "../commen/functions/utils";
import React from "react";
import { lazyPage } from "./lazyPage.js";
import "./pageTransition.css";

import PrivateAdminRoute from "./privateadmin_routes";
import PrivateRoutes from "./private_routes";
import RouteWrapperUser from "./RouteWrapperUser";
import RouteWrapperAdmin from "./RouteWrapperAdmin";
import PrivateVideoMeeting from "./PrivateVideoMeetingRoute";

import NotFound from "../container/page_404/Page_404.jsx";
// import NewMeeting from "../container/pages/meeting/MeetingTwo.js";
// import NewMeeting from "../container/pages/meeting/MeetingTwo.js";
import RouteBoundary from "./RouteBoundary.jsx";
import { AuthorityProvider } from "../context/AuthorityContext.jsx";
import { NewMeetingProvider } from "../context/NewMeetingContext.jsx";
import { TalkProvider } from "../context/TalkContext.jsx";
import { MeetingProvider } from "../context/MeetingContext.jsx";
import { GroupsProvider } from "../context/GroupsContext.jsx";
import { CommitteeProvider } from "../context/CommitteeContext.jsx";
import { DataroomProvider } from "../context/DataroomContext.jsx";
import { PollsProvider } from "../context/PollsContext.jsx";
import { NotesProvider } from "../context/NotesContext.jsx";
import { ResolutionProvider } from "../context/ResolutionContext.jsx";
import { ComlianceProvider } from "../context/ComplianceContext.jsx";
import { DocumentProvider } from "../context/DocumentContext.jsx";

// Pages are loaded on demand: each becomes its own chunk, fetched the first
// time its route renders (RouteBoundary supplies the Suspense fallback).
const SignatureViewer = lazyPage(() => import("../container/DataRoom/SignatureFlow/signaturewebviewer/signatureviewer"));
const PendingSignature = lazyPage(() => import("../container/DataRoom/SignatureFlow/pendingSignature/pendingSignatrue"));
const ViewSignatureDocument = lazyPage(() => import("../container/DataRoom/SignatureFlow/ViewSIgnatureDocument/ViewSignatureDocument"));
const NewDashobard = lazyPage(() => import("../container/NewDashboardLayout/NewDashobard"));
const SubscriptionDetailsUserManagement = lazyPage(() => import("../container/pages/UserMangement/AdminUserManagement/SubscriptionDetailsUserManagement/SubscriptionDetailsUserManagement"));
const DowngradeSubscription = lazyPage(() => import("../container/pages/UserMangement/AdminUserManagement/SubscriptionDetailsUserManagement/DowngradeSubscription/DowngradeSubscription"));
const UpdatedCancelSubscription = lazyPage(() => import("../container/pages/UserMangement/AdminUserManagement/UpdatedCancelSubscription/UpdatedCancelSubscription"));
const VideoMeetingBoardDeck = lazyPage(() => import("../container/VideoMeetingBoardDeck/VideoMeetingBoardDeck"));
const DocumentViewer = lazyPage(() => import("../components/elements/webviewer/DocumentViewer"));
const GuestVideoCall = lazyPage(() => import("../components/layout/talk/GuestVideo/GuestVideoCall/GuestVideoCall"));
const ChangePassword = lazyPage(() => import("../container/Admin/ChangePassword/ChangePassword.jsx"));
const CustomMiscellaneous = lazyPage(() => import("../container/miscellaneous/Miscellaneous.jsx"));
const Dashboard = lazyPage(() => import("../container/dashboard/Dashboard.jsx"));
const DeleteOrganization = lazyPage(() => import("../container/Admin/Subscriptions/DeleteOrganization/DeleteOrganization.jsx"));
const OnBoard = lazyPage(() => import("../container/pages/onBoard/OnBoard.jsx"));
const TodoList = lazyPage(() => import("../container/pages/todolist/Todolist.jsx"));
const PaymentHistory = lazyPage(() => import("../container/Admin/BillingInfo/PaymentHistory/PaymentHistory.jsx"));
const PayOutstanding = lazyPage(() => import("../container/Admin/BillingInfo/PayOutstanding/PayOutstanding.jsx"));
const Summary = lazyPage(() => import("../container/Admin/BillingInfo/Summary/Summary.jsx"));
const CustomerInformation = lazyPage(() => import("../container/Admin/CustomerInfo/CustomerInformation/CustomerInformation.jsx"));
const AdminHome = lazyPage(() => import("../container/Admin/Main/AdminHome.jsx"));
const Groups = lazyPage(() => import("../container/Groups/Groups.jsx"));
const AllMeetings = lazyPage(() => import("../container/Admin/Meetings/AllMeeting/AllMeetings.jsx"));
const CancelSubs = lazyPage(() => import("../container/Admin/Subscriptions/CancelSub/CancelSubs.jsx"));
const PackageDetails = lazyPage(() => import("../container/Admin/Subscriptions/PackageDetail/PackageDetails.jsx"));
const PackageUpgrade = lazyPage(() => import("../container/Admin/Subscriptions/PackageUpgrade/PackageUpgrade.jsx"));
const PackageUpgradeDetail = lazyPage(() => import("../container/Admin/Subscriptions/PackageUpgradeDetail/PackageUpgradeDetail.jsx"));
const PackageUpgradeSelect = lazyPage(() => import("../container/Admin/Subscriptions/PackageUpgradeSelected/PackageUpgradeSelect.jsx"));
const PasswordUpdateMessage = lazyPage(() => import("../container/authentication/password_update_message/Password_Update_Message.jsx"));
const Notes = lazyPage(() => import("../container/notes/Notes.jsx"));
const CalendarPage = lazyPage(() => import("../container/calendarpage/CalendarPage.jsx"));
const ForgotPasswordVerification = lazyPage(() => import("../container/authentication/ForgotpasswordVerification/ForgotPasswordVerification.jsx"));
const UpdatePasswordSuccessfully = lazyPage(() => import("../container/authentication/UpdatedPasswordSuccessfully/UpdatePasswordSuccessfully.jsx"));
const Committee = lazyPage(() => import("../container/Committee/Committee.jsx"));
const Resolution = lazyPage(() => import("../container/Resolution/Resolution.jsx"));
const DataRoom = lazyPage(() => import("../container/DataRoom/DataRoom.jsx"));
const Polling = lazyPage(() => import("../container/Polling/Polling.jsx"));
const PaymentForm2 = lazyPage(() => import("../container/Admin/Subscriptions/PaymentForm2/PaymentForm2.jsx"));
const EmptyState = lazyPage(() => import("../container/Admin/Subscriptions/PackageDetail/EmptyStatePage/EmptyState.jsx"));
const RSVP = lazyPage(() => import("@/container/meeting/commonComponents/RSVP.jsx"));
const MinutesFlow = lazyPage(() => import("../container/MinutesNewFlow/Main.jsx"));
const UserManagementProcess = lazyPage(() => import("../container/pages/UserManagementProcess/UserManagementProcess.jsx"));
const SignupProcessUserManagement = lazyPage(() => import("../container/pages/SignUpProcessUserManagement/SignupProcessUserManagement.jsx"));
const PakageDetailsUserManagement = lazyPage(() => import("../container/pages/UserMangement/PakageDetailsUserManagement/PakageDetailsUserManagement.jsx"));
const BillingMethodUsermanagement = lazyPage(() => import("../container/pages/UserMangement/BillingMethodUserManagement/BillingMethodUsermanagement.jsx"));
const ManageUsers = lazyPage(() => import("../container/pages/UserMangement/AdminUserManagement/ManageUsers/ManageUsers"));
const Reports = lazyPage(() => import("../container/Admin/Reports/Reports.jsx"));
const PakageDetailsUMUpgrade = lazyPage(() => import("../container/pages/UserMangement/AdminUserManagement/PackageDetailsUMUpgrade/PackageDetailsUMUpgrade.jsx"));
const AddUsers = lazyPage(() => import("../container/pages/UserMangement/AdminUserManagement/AddUsers/AddUsers.jsx"));
const UserLevelConfigUM = lazyPage(() => import("../container/pages/UserMangement/UserLevelConfigUM/UserLevelConfigUM.jsx"));
const AddUserMain = lazyPage(() => import("../container/pages/UserMangement/AdminUserManagement/AddUserMain/AddUserMain.jsx"));
const PaymentMethodBillInfo = lazyPage(() => import("../container/pages/UserMangement/AdminUserManagement/PaymentMethodBillInfoUserManagement/PaymentMethodBillInfo.jsx"));
const OrganizationLevelConfigUM = lazyPage(() => import("../container/pages/UserMangement/OrganziationLevelConfigUM/OrganizationLevelConfigUM.jsx"));
const CancelSubscriptionAdmin = lazyPage(() => import("../container/pages/UserMangement/AdminUserManagement/CancelSubscriptionAdmin/CancelSubscriptionAdmin.jsx"));
const PakageDetailsAdmin = lazyPage(() => import("../container/pages/UserMangement/AdminUserManagement/PakageDetailsAdmin/PakageDetailsAdmin.jsx"));
const DeleteOrganizationAdmin = lazyPage(() => import("../container/pages/UserMangement/AdminUserManagement/DeleteOrganizationAdmin/DeleteOrganizationAdmin.jsx"));
const AuditTrial = lazyPage(() => import("../container/Admin/Reports/AuditTrial/AuditTrial.jsx"));
const UserSettingsWrapper = lazyPage(() => import("./UserSettingsWrapper.jsx"));
const MeetingDocumentViewer = lazyPage(() => import("../components/elements/meetingDocumentViewer/meetingDocumentViewer.jsx"));
const AlreadyInGroupAndOtoCall = lazyPage(() => import("../components/layout/talk/videoCallScreen/alreadyInGroupAndOtoCall/AlreadyInGroupAndOtoCall.jsx"));
const ManageAuthority = lazyPage(() => import("../container/Admin/Compliance/Authority/index.jsx"));
const GeneralSetting = lazyPage(() => import("../container/Admin/Compliance/GeneralSettings/index.jsx"));
const MainCompliance = lazyPage(() => import("../container/ComplianceUser/index.jsx"));
const EmailActionHandler = lazyPage(() => import("../container/emailAction/EmailActionHandler.jsx"));
const MainMeeting = lazyPage(() => import("../container/meeting/index.jsx"));

const roleRoute = getLocalStorageItemNonActiveCheck("VERIFICATION");

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Video Meeting Route */}
      <Route element={<PrivateVideoMeeting />}>
        <Route
          path='/Diskus/video'
          element={
            <RouteBoundary>
              <VideoMeetingBoardDeck />
            </RouteBoundary>
          }
        />
      </Route>
      <Route
        path='/GuestVideoCall'
        element={
          <RouteBoundary>
            <GuestVideoCall />
          </RouteBoundary>
        }
      />
      <Route
        path='/AlreadyInGroupAndOtoCall'
        element={
          <RouteBoundary>
            <AlreadyInGroupAndOtoCall />
          </RouteBoundary>
        }
      />
      {/* for all login Routes  */}
      <Route
        path='/'
        element={
          <RouteBoundary>
            <UserManagementProcess />
          </RouteBoundary>
        }
      />
      {/* For All Signup Route */}
      <Route
        path='/Signup'
        element={
          <RouteBoundary>
            <SignupProcessUserManagement />{" "}
          </RouteBoundary>
        }
      />
      {/* ============================================================ */}
      <Route
        path='/PakageDetailsUserManagement'
        element={
          <RouteBoundary>
            <PakageDetailsUserManagement />{" "}
          </RouteBoundary>
        }
      />
      <Route
        path='/forgotpasswordVerification'
        element={
          <RouteBoundary>
            <ForgotPasswordVerification />{" "}
          </RouteBoundary>
        }
      />
      <Route
        path='/updatepassword'
        element={
          <RouteBoundary>
            <UpdatePasswordSuccessfully />{" "}
          </RouteBoundary>
        }
      />
      <Route
        path='/PaymentFormUserManagement'
        element={
          <RouteBoundary>
            <BillingMethodUsermanagement />
          </RouteBoundary>
        }
      />
      <Route
        path='/updatePasswordSuccess'
        element={
          <RouteBoundary>
            <PasswordUpdateMessage />{" "}
          </RouteBoundary>
        }
      />
      <Route path='/404' element={<NotFound />} />
      <Route path='*' element={<NotFound />} />
      <Route
        path='/onboard'
        element={
          <RouteBoundary>
            <OnBoard />{" "}
          </RouteBoundary>
        }
      />
      {/* ============================================================ */}
      <Route element={<PrivateRoutes />}>
        <Route
          path='/Diskus/'
          element={
            <RouteWrapperUser name='Diskus'>
              <RouteBoundary>
                <NewMeetingProvider>
                  <DocumentProvider>
                    <TalkProvider>
                      <MeetingProvider>
                        <GroupsProvider>
                          <CommitteeProvider>
                            <DataroomProvider>
                              <PollsProvider>
                                <NotesProvider>
                                  <ResolutionProvider>
                                    <ComlianceProvider>
                                      <Dashboard />
                                    </ComlianceProvider>
                                  </ResolutionProvider>
                                </NotesProvider>
                              </PollsProvider>
                            </DataroomProvider>
                          </CommitteeProvider>
                        </GroupsProvider>
                      </MeetingProvider>
                    </TalkProvider>
                  </DocumentProvider>
                </NewMeetingProvider>
              </RouteBoundary>
            </RouteWrapperUser>
          }>
          <Route
            path=''
            element={
              <RouteWrapperUser name=''>
                <RouteBoundary>
                  <NewDashobard />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='Minutes'
            element={
              <RouteWrapperUser name='Minutes'>
                <RouteBoundary>
                  <MinutesFlow />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='home'
            element={
              <RouteWrapperUser name='home'>
                <RouteBoundary>
                  <NewDashobard />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />

          <Route
            path='todolist'
            element={
              <RouteWrapperUser name='todolist'>
                <RouteBoundary>
                  <TodoList />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='documentViewer'
            element={
              <RouteWrapperUser name='documentViewer'>
                <RouteBoundary>
                  <DocumentViewer />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='meetingDocumentViewer'
            element={
              <RouteWrapperUser name='documentViewer'>
                <RouteBoundary>
                  <MeetingDocumentViewer />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />

          <Route
            path='signatureviewer'
            element={
              <RouteWrapperUser name='signatureviewer'>
                <RouteBoundary>
                  <SignatureViewer />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='signeddocument'
            element={
              <RouteWrapperUser name='signatureviewer'>
                <RouteBoundary>
                  <PendingSignature />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='viewSignDocument'
            element={
              <RouteWrapperUser name='signatureviewer'>
                <RouteBoundary>
                  <ViewSignatureDocument />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='calendar'
            element={
              <RouteWrapperUser name='calendar'>
                <RouteBoundary>
                  <CalendarPage />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='Meeting'
            element={
              <RouteWrapperUser name='Meeting'>
                <RouteBoundary>
                  <NewMeetingProvider>
                    <MainMeeting />
                    {/* <NewMeeting /> */}
                  </NewMeetingProvider>
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='Meeting/Useravailabilityformeeting'
            element={
              <RouteWrapperUser name='Meeting'>
                <RouteBoundary>
                  <RSVP />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='setting'
            element={
              <RouteWrapperUser name='setting'>
                <RouteBoundary>
                  <UserSettingsWrapper />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="faq's"
            element={
              <RouteWrapperUser name="faq's">
                <RouteBoundary>
                  <CustomMiscellaneous />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='groups'
            element={
              <RouteWrapperUser name='groups'>
                <RouteBoundary>
                  <Groups />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='changePassword'
            element={
              <RouteWrapperUser name='changePassword'>
                <RouteBoundary>
                  <ChangePassword />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='notes'
            element={
              <RouteWrapperUser name='notes'>
                <RouteBoundary>
                  <Notes />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='committee'
            element={
              <RouteWrapperUser name='committee'>
                <RouteBoundary>
                  <Committee />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='resolution'
            element={
              <RouteWrapperUser name='resolution'>
                <RouteBoundary>
                  <Resolution />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='dataroom'
            element={
              <RouteWrapperUser name='dataroom'>
                <RouteBoundary>
                  <DataRoom />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='polling'
            element={
              <RouteWrapperUser name='polling'>
                <RouteBoundary>
                  <Polling />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='compliance'
            element={
              <RouteWrapperUser name='compliance'>
                <RouteBoundary>
                  <MainCompliance />
                </RouteBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='Redirected'
            element={
              <RouteBoundary>
                <EmailActionHandler />
              </RouteBoundary>
            }
          />
        </Route>
      </Route>
      <Route element={<PrivateAdminRoute />}>
        <Route
          exact
          path='/Admin/'
          element={
            <RouteWrapperAdmin name='Admin'>
              <RouteBoundary>
                <NewMeetingProvider>
                  <TalkProvider>
                    <MeetingProvider>
                      <GroupsProvider>
                        <CommitteeProvider>
                          <DataroomProvider>
                            <PollsProvider>
                              <NotesProvider>
                                <ResolutionProvider>
                                  <ComlianceProvider>
                                    <AdminHome />
                                  </ComlianceProvider>
                                </ResolutionProvider>
                              </NotesProvider>
                            </PollsProvider>
                          </DataroomProvider>
                        </CommitteeProvider>
                      </GroupsProvider>
                    </MeetingProvider>
                  </TalkProvider>
                </NewMeetingProvider>
              </RouteBoundary>
            </RouteWrapperAdmin>
          }>
          <Route
            path='manageAuthority'
            element={
              <RouteWrapperAdmin name='Admin'>
                <RouteBoundary>
                  <AuthorityProvider>
                    <ManageAuthority />
                  </AuthorityProvider>
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='generalSetting'
            element={
              <RouteWrapperAdmin name='Admin'>
                <RouteBoundary>
                  <GeneralSetting />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />

          <Route
            path=''
            element={
              <RouteWrapperAdmin name='Admin'>
                <RouteBoundary>
                  {roleRoute ? <PayOutstanding /> : <ManageUsers />}
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PaymentFormUserManagement'
            element={
              <RouteWrapperAdmin name='PaymentFormUserManagement'>
                <RouteBoundary>
                  <BillingMethodUsermanagement />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          {/* Route For Payment Processs end */}

          <Route
            path='PakageDetailsUserManagement'
            element={
              <RouteWrapperAdmin name='PakageDetailsUserManagement'>
                <RouteBoundary>
                  <PakageDetailsUserManagement />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='loginreport'
            element={
              <RouteWrapperAdmin name='loginreport'>
                <RouteBoundary>
                  <Reports />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PackageDetailUMupgrade'
            element={
              <RouteWrapperAdmin name='PackageDetailUMupgrade'>
                <RouteBoundary>
                  <PakageDetailsUMUpgrade />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />

          <Route
            path='AddUsers'
            element={
              <RouteWrapperAdmin name='AddUsers'>
                <RouteBoundary>
                  <AddUsers />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='ManageUsers'
            element={
              <RouteWrapperAdmin name='ManageUsers'>
                <RouteBoundary>
                  <ManageUsers />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='UserLevelConfigUM'
            element={
              <RouteWrapperAdmin name='UserLevelConfigUM'>
                <RouteBoundary>
                  <UserLevelConfigUM />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='AddUsersUsermanagement'
            element={
              <RouteWrapperAdmin name='AddUsersUsermanagement'>
                <RouteBoundary>
                  <AddUserMain />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PayOutstanding'
            element={
              <RouteWrapperAdmin name='PayOutstanding'>
                <RouteBoundary>
                  <PayOutstanding />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PaymentHistory'
            element={
              <RouteWrapperAdmin name='PaymentHistory'>
                <RouteBoundary>
                  <PaymentHistory />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PaymentHistoryusermanagement'
            element={
              <RouteWrapperAdmin name='PaymentHistoryusermanagement'>
                <RouteBoundary>
                  <PaymentMethodBillInfo />
                </RouteBoundary>{" "}
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='Summary'
            element={
              <RouteWrapperAdmin name='Summary'>
                <RouteBoundary>
                  <Summary />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='OrganizationlevelConfigUM'
            element={
              <RouteWrapperAdmin name='OrganizationlevelConfigUM'>
                <RouteBoundary>
                  <OrganizationLevelConfigUM />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='AllMeeting'
            element={
              <RouteWrapperAdmin name='AllMeeting'>
                <RouteBoundary>
                  <AllMeetings />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='CancelSub'
            element={
              <RouteWrapperAdmin name='CancelSub'>
                <RouteBoundary>
                  <CancelSubs />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='CancelSubscriptionUserManagement'
            element={
              <RouteWrapperAdmin name='CancelSubscriptionUserManagement'>
                <RouteBoundary>
                  <CancelSubscriptionAdmin />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PackageDetail'
            element={
              <RouteWrapperAdmin name='PackageDetail'>
                <RouteBoundary>
                  <PackageDetails />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PackageDetailsUserManagement'
            element={
              <RouteWrapperAdmin name='PackageDetailsUserManagement'>
                <RouteBoundary>
                  <PakageDetailsAdmin />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='subscriptionDetailsUserManagement'
            element={
              <RouteWrapperAdmin name='subscriptionDetailsUserManagement'>
                <RouteBoundary>
                  <SubscriptionDetailsUserManagement />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='downgradeSubscription'
            element={
              <RouteWrapperAdmin name='downgradeSubscription'>
                <RouteBoundary>
                  <DowngradeSubscription />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='updatedCancelSubscription'
            element={
              <RouteWrapperAdmin name='updatedCancelSubscription'>
                <RouteBoundary>
                  <UpdatedCancelSubscription />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='EmptyState'
            element={
              <RouteWrapperAdmin name='EmptyState'>
                <RouteBoundary>
                  <EmptyState />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='UpgradePackage'
            element={
              <RouteWrapperAdmin name='UpgradePackage'>
                <RouteBoundary>
                  <PackageUpgrade />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='changePassword'
            element={
              <RouteWrapperAdmin name='changePassword'>
                <RouteBoundary>
                  <ChangePassword />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="faq's"
            element={
              <RouteWrapperAdmin name="faq's">
                <RouteBoundary>
                  <CustomMiscellaneous />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='deleteorganization'
            element={
              <RouteWrapperAdmin name='deleteorganization'>
                <RouteBoundary>
                  <DeleteOrganization />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='deleteorganizationUserMangement'
            element={
              <RouteWrapperAdmin name='deleteorganizationUserMangement'>
                <RouteBoundary>
                  <DeleteOrganizationAdmin />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='paymentForm'
            element={
              <RouteWrapperAdmin name='paymentForm'>
                <RouteBoundary>
                  <PaymentForm2 />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='UpgradePackageDetail'
            element={
              <RouteWrapperAdmin name='UpgradePackageDetail'>
                <RouteBoundary>
                  <PackageUpgradeDetail />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='UpgradePackageSelect'
            element={
              <RouteWrapperAdmin name='UpgradePackageSelect'>
                <RouteBoundary>
                  <PackageUpgradeSelect />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='CustomerInformation'
            element={
              <RouteWrapperAdmin name='CustomerInformation'>
                <RouteBoundary>
                  <CustomerInformation />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='AuditTrial'
            element={
              <RouteWrapperAdmin name='AuditTrial'>
                <RouteBoundary>
                  <AuditTrial />
                </RouteBoundary>
              </RouteWrapperAdmin>
            }
          />
        </Route>
      </Route>
    </>,
  ),
);
