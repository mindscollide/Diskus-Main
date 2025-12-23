import {
  Route,
  createRoutesFromElements,
  createHashRouter,
  createBrowserRouter,
} from "react-router-dom";
import { getLocalStorageItemNonActiveCheck } from "../commen/functions/utils";
import React, { lazy } from "react";

import PrivateAdminRoute from "./privateadmin_routes";
import PrivateRoutes from "./private_routes";
import SignatureViewer from "../container/DataRoom/SignatureFlow/signaturewebviewer/signatureviewer";
import PendingSignature from "../container/DataRoom/SignatureFlow/pendingSignature/pendingSignatrue";
import ViewSignatureDocument from "../container/DataRoom/SignatureFlow/ViewSIgnatureDocument/ViewSignatureDocument";
import RouteWrapperUser from "./RouteWrapperUser";
import RouteWrapperAdmin from "./RouteWrapperAdmin";
import NewDashobard from "../container/NewDashboardLayout/NewDashobard";
import SubscriptionDetailsUserManagement from "../container/pages/UserMangement/AdminUserManagement/SubscriptionDetailsUserManagement/SubscriptionDetailsUserManagement";
import DowngradeSubscription from "../container/pages/UserMangement/AdminUserManagement/SubscriptionDetailsUserManagement/DowngradeSubscription/DowngradeSubscription";
import UpdatedCancelSubscription from "../container/pages/UserMangement/AdminUserManagement/UpdatedCancelSubscription/UpdatedCancelSubscription";
import PrivateVideoMeeting from "./PrivateVideoMeetingRoute";
import VideoMeetingBoardDeck from "../container/VideoMeetingBoardDeck/VideoMeetingBoardDeck";
import DocumentViewer from "../components/elements/webviewer/DocumentViewer";
import GuestVideoCall from "../components/layout/talk/GuestVideo/GuestVideoCall/GuestVideoCall";

import ChangePassword from "../container/Admin/ChangePassword/ChangePassword.js";
import CustomMiscellaneous from "../container/miscellaneous/Miscellaneous.js";
import Dashboard from "../container/dashboard/Dashboard.js";
import DeleteOrganization from "../container/Admin/Subscriptions/DeleteOrganization/DeleteOrganization.js";
import NotFound from "../container/page_404/Page_404.js";
import OnBoard from "../container/pages/onBoard/OnBoard.js";
import TodoList from "../container/pages/todolist/Todolist.js";
import PaymentHistory from "../container/Admin/BillingInfo/PaymentHistory/PaymentHistory.js";
import PayOutstanding from "../container/Admin/BillingInfo/PayOutstanding/PayOutstanding.js";
import Summary from "../container/Admin/BillingInfo/Summary/Summary.js";
import CustomerInformation from "../container/Admin/CustomerInfo/CustomerInformation/CustomerInformation.js";
import AdminHome from "../container/Admin/Main/AdminHome.js";
import Groups from "../container/Groups/Groups.js";
import AllMeetings from "../container/Admin/Meetings/AllMeeting/AllMeetings.js";
import CancelSubs from "../container/Admin/Subscriptions/CancelSub/CancelSubs.js";
import PackageDetails from "../container/Admin/Subscriptions/PackageDetail/PackageDetails.js";
import PackageUpgrade from "../container/Admin/Subscriptions/PackageUpgrade/PackageUpgrade.js";
import PackageUpgradeDetail from "../container/Admin/Subscriptions/PackageUpgradeDetail/PackageUpgradeDetail.js";
import PackageUpgradeSelect from "../container/Admin/Subscriptions/PackageUpgradeSelected/PackageUpgradeSelect.js";
import PasswordUpdateMessage from "../container/authentication/password_update_message/Password_Update_Message.js";
import Notes from "../container/notes/Notes.js";
import CalendarPage from "../container/calendarpage/CalendarPage.js";
import ForgotPasswordVerification from "../container/authentication/ForgotpasswordVerification/ForgotPasswordVerification.js";
import UpdatePasswordSuccessfully from "../container/authentication/UpdatedPasswordSuccessfully/UpdatePasswordSuccessfully.js";
import Committee from "../container/Committee/Committee.js";
import Resolution from "../container/Resolution/Resolution.js";
import DataRoom from "../container/DataRoom/DataRoom.js";
import Polling from "../container/Polling/Polling.js";
import PaymentForm2 from "../container/Admin/Subscriptions/PaymentForm2/PaymentForm2.js";
import NewMeeting from "../container/pages/meeting/MeetingTwo.js";
import UserSettings from "../container/setting/UserLevelSettings/UserSettings.js";
import EmptyState from "../container/Admin/Subscriptions/PackageDetail/EmptyStatePage/EmptyState.js";
import RSVP from "../container/pages/meeting/RSVP.js";
import MinutesFlow from "../container/MinutesNewFlow/Main.js";
import UserManagementProcess from "../container/pages/UserManagementProcess/UserManagementProcess.js";
import SignupProcessUserManagement from "../container/pages/SignUpProcessUserManagement/SignupProcessUserManagement.js";
import PakageDetailsUserManagement from "../container/pages/UserMangement/PakageDetailsUserManagement/PakageDetailsUserManagement.js";
import BillingMethodUsermanagement from "../container/pages/UserMangement/BillingMethodUserManagement/BillingMethodUsermanagement.js";
import ManageUsers from "../container/pages/UserMangement/AdminUserManagement/ManageUsers/ManageUsers";
import Reports from "../container/Admin/Reports/Reports.js";
import PakageDetailsUMUpgrade from "../container/pages/UserMangement/AdminUserManagement/PackageDetailsUMUpgrade/PackageDetailsUMUpgrade.js";
import AddUsers from "../container/pages/UserMangement/AdminUserManagement/AddUsers/AddUsers.js";
import UserLevelConfigUM from "../container/pages/UserMangement/UserLevelConfigUM/UserLevelConfigUM.js";
import AddUserMain from "../container/pages/UserMangement/AdminUserManagement/AddUserMain/AddUserMain.js";
import PaymentMethodBillInfo from "../container/pages/UserMangement/AdminUserManagement/PaymentMethodBillInfoUserManagement/PaymentMethodBillInfo.js";
import OrganizationLevelConfigUM from "../container/pages/UserMangement/OrganziationLevelConfigUM/OrganizationLevelConfigUM.js";
import CancelSubscriptionAdmin from "../container/pages/UserMangement/AdminUserManagement/CancelSubscriptionAdmin/CancelSubscriptionAdmin.js";
import PakageDetailsAdmin from "../container/pages/UserMangement/AdminUserManagement/PakageDetailsAdmin/PakageDetailsAdmin.js";
import DeleteOrganizationAdmin from "../container/pages/UserMangement/AdminUserManagement/DeleteOrganizationAdmin/DeleteOrganizationAdmin.js";
import {
  ErrorFallback,
  logErrors,
} from "../components/elements/ErrorFallBack/index.jsx";
import { ErrorBoundary } from "react-error-boundary";
import AuditTrial from "../container/Admin/Reports/AuditTrial/AuditTrial.js";
import UserSettingsWrapper from "./UserSettingsWrapper.js";
import MeetingDocumentViewer from "../components/elements/meetingDocumentViewer/meetingDocumentViewer.js";
import ManageAuthority from "../container/Admin/Compliance/Authority/index.jsx";
import GeneralSetting from "../container/Admin/Compliance/GeneralSettings/index.jsx";
import { AuthorityProvider } from "../context/AuthorityContext.js";
import MainCompliance from "../container/ComplianceUser/index.jsx";

const roleRoute = getLocalStorageItemNonActiveCheck("VERIFICATION");

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Video Meeting Route */}
      <Route element={<PrivateVideoMeeting />}>
        <Route
          path="/Diskus/video"
          element={
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onError={logErrors}
            >
              <VideoMeetingBoardDeck />
            </ErrorBoundary>
          }
        />
      </Route>
      <Route
        path="/GuestVideoCall"
        element={
          <ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrors}>
            <GuestVideoCall />
          </ErrorBoundary>
        }
      />
      {/* for all login Routes  */}
      <Route
        path="/"
        element={
          <ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrors}>
            <UserManagementProcess />
          </ErrorBoundary>
        }
      />
      {/* For All Signup Route */}
      <Route
        path="/Signup"
        element={
          <ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrors}>
            <SignupProcessUserManagement />{" "}
          </ErrorBoundary>
        }
      />
      {/* ============================================================ */}
      <Route
        path="/PakageDetailsUserManagement"
        element={
          <ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrors}>
            <PakageDetailsUserManagement />{" "}
          </ErrorBoundary>
        }
      />
      {/* <Route path="/signuporganization" element={<Signup />} /> */}
      <Route
        path="/forgotpasswordVerification"
        element={
          <ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrors}>
            <ForgotPasswordVerification />{" "}
          </ErrorBoundary>
        }
      />
      <Route
        path="/updatepassword"
        element={
          <ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrors}>
            <UpdatePasswordSuccessfully />{" "}
          </ErrorBoundary>
        }
      />
      Ï
      <Route
        path="/PaymentFormUserManagement"
        element={
          <ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrors}>
            <BillingMethodUsermanagement />
          </ErrorBoundary>
        }
      />
      <Route
        path="/updatePasswordSuccess"
        element={
          <ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrors}>
            <PasswordUpdateMessage />{" "}
          </ErrorBoundary>
        }
      />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
      <Route
        path="/onboard"
        element={
          <ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrors}>
            <OnBoard />{" "}
          </ErrorBoundary>
        }
      />
      {/* ============================================================ */}
      <Route element={<PrivateRoutes />}>
        <Route
          path="/Diskus/"
          element={
            <RouteWrapperUser name="Diskus">
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={logErrors}
              >
                <Dashboard />
              </ErrorBoundary>
            </RouteWrapperUser>
          }
        >
          <Route
            path=""
            element={
              <RouteWrapperUser name="">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <NewDashobard />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="Minutes"
            element={
              <RouteWrapperUser name="Minutes">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <MinutesFlow />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="home"
            element={
              <RouteWrapperUser name="home">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <NewDashobard />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />

          <Route
            path="todolist"
            element={
              <RouteWrapperUser name="todolist">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <TodoList />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="documentViewer"
            element={
              <RouteWrapperUser name="documentViewer">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <DocumentViewer />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="meetingDocumentViewer"
            element={
              <RouteWrapperUser name="documentViewer">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <MeetingDocumentViewer />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />

          <Route
            path="signatureviewer"
            element={
              <RouteWrapperUser name="signatureviewer">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <SignatureViewer />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="signeddocument"
            element={
              <RouteWrapperUser name="signatureviewer">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <PendingSignature />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="viewSignDocument"
            element={
              <RouteWrapperUser name="signatureviewer">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <ViewSignatureDocument />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          {/* <Route path="forgotpassword" element={<ForgotPassword />} /> */}
          <Route
            path="calendar"
            element={
              <RouteWrapperUser name="calendar">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <CalendarPage />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="Meeting"
            element={
              <RouteWrapperUser name="Meeting">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <NewMeeting />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="Meeting/Useravailabilityformeeting"
            element={
              <RouteWrapperUser name="Meeting">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <RSVP />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="setting"
            element={
              <RouteWrapperUser name="setting">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <UserSettingsWrapper />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="faq's"
            element={
              <RouteWrapperUser name="faq's">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <CustomMiscellaneous />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="groups"
            element={
              <RouteWrapperUser name="groups">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <Groups />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="changePassword"
            element={
              <RouteWrapperUser name="changePassword">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <ChangePassword />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="notes"
            element={
              <RouteWrapperUser name="notes">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <Notes />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="committee"
            element={
              <RouteWrapperUser name="committee">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <Committee />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="resolution"
            element={
              <RouteWrapperUser name="resolution">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <Resolution />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="dataroom"
            element={
              <RouteWrapperUser name="dataroom">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <DataRoom />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path="polling"
            element={
              <RouteWrapperUser name="polling">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <Polling />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
            <Route
            path="compliance"
            element={
              <RouteWrapperUser name="polling">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <MainCompliance />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
        </Route>
      </Route>
      <Route element={<PrivateAdminRoute />}>
        <Route
          exact
          path="/Admin/"
          element={
            <RouteWrapperAdmin name="Admin">
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={logErrors}
              >
                <AdminHome />
              </ErrorBoundary>
            </RouteWrapperAdmin>
          }
        >
          <Route
            path="manageAuthority"
            element={
              <RouteWrapperAdmin name="Admin">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <AuthorityProvider>
                    <ManageAuthority />
                  </AuthorityProvider>
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="generalSetting"
            element={
              <RouteWrapperAdmin name="Admin">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <GeneralSetting />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />

          <Route
            path=""
            element={
              <RouteWrapperAdmin name="Admin">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  {roleRoute ? <PayOutstanding /> : <ManageUsers />}
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PaymentFormUserManagement"
            element={
              <RouteWrapperAdmin name="PaymentFormUserManagement">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <BillingMethodUsermanagement />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          {/* Route For Payment Processs end */}

          <Route
            path="PakageDetailsUserManagement"
            element={
              <RouteWrapperAdmin name="PakageDetailsUserManagement">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <PakageDetailsUserManagement />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="loginreport"
            element={
              <RouteWrapperAdmin name="loginreport">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <Reports />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PackageDetailUMupgrade"
            element={
              <RouteWrapperAdmin name="PackageDetailUMupgrade">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <PakageDetailsUMUpgrade />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />

          <Route
            path="AddUsers"
            element={
              <RouteWrapperAdmin name="AddUsers">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <AddUsers />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="ManageUsers"
            element={
              <RouteWrapperAdmin name="ManageUsers">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <ManageUsers />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="UserLevelConfigUM"
            element={
              <RouteWrapperAdmin name="UserLevelConfigUM">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <UserLevelConfigUM />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="AddUsersUsermanagement"
            element={
              <RouteWrapperAdmin name="AddUsersUsermanagement">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <AddUserMain />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PayOutstanding"
            element={
              <RouteWrapperAdmin name="PayOutstanding">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <PayOutstanding />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PaymentHistory"
            element={
              <RouteWrapperAdmin name="PaymentHistory">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <PaymentHistory />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PaymentHistoryusermanagement"
            element={
              <RouteWrapperAdmin name="PaymentHistoryusermanagement">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <PaymentMethodBillInfo />
                </ErrorBoundary>{" "}
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="Summary"
            element={
              <RouteWrapperAdmin name="Summary">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <Summary />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="OrganizationlevelConfigUM"
            element={
              <RouteWrapperAdmin name="OrganizationlevelConfigUM">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <OrganizationLevelConfigUM />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="AllMeeting"
            element={
              <RouteWrapperAdmin name="AllMeeting">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <AllMeetings />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="CancelSub"
            element={
              <RouteWrapperAdmin name="CancelSub">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <CancelSubs />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="CancelSubscriptionUserManagement"
            element={
              <RouteWrapperAdmin name="CancelSubscriptionUserManagement">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <CancelSubscriptionAdmin />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PackageDetail"
            element={
              <RouteWrapperAdmin name="PackageDetail">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <PackageDetails />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PackageDetailsUserManagement"
            element={
              <RouteWrapperAdmin name="PackageDetailsUserManagement">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <PakageDetailsAdmin />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="subscriptionDetailsUserManagement"
            element={
              <RouteWrapperAdmin name="subscriptionDetailsUserManagement">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <SubscriptionDetailsUserManagement />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="downgradeSubscription"
            element={
              <RouteWrapperAdmin name="downgradeSubscription">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <DowngradeSubscription />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="updatedCancelSubscription"
            element={
              <RouteWrapperAdmin name="updatedCancelSubscription">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <UpdatedCancelSubscription />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="EmptyState"
            element={
              <RouteWrapperAdmin name="EmptyState">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <EmptyState />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="UpgradePackage"
            element={
              <RouteWrapperAdmin name="UpgradePackage">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <PackageUpgrade />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="changePassword"
            element={
              <RouteWrapperAdmin name="changePassword">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <ChangePassword />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="faq's"
            element={
              <RouteWrapperAdmin name="faq's">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <CustomMiscellaneous />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="deleteorganization"
            element={
              <RouteWrapperAdmin name="deleteorganization">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <DeleteOrganization />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="deleteorganizationUserMangement"
            element={
              <RouteWrapperAdmin name="deleteorganizationUserMangement">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <DeleteOrganizationAdmin />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="paymentForm"
            element={
              <RouteWrapperAdmin name="paymentForm">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <PaymentForm2 />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="UpgradePackageDetail"
            element={
              <RouteWrapperAdmin name="UpgradePackageDetail">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <PackageUpgradeDetail />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="UpgradePackageSelect"
            element={
              <RouteWrapperAdmin name="UpgradePackageSelect">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <PackageUpgradeSelect />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="CustomerInformation"
            element={
              <RouteWrapperAdmin name="CustomerInformation">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <CustomerInformation />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="AuditTrial"
            element={
              <RouteWrapperAdmin name="AuditTrial">
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  onError={logErrors}
                >
                  <AuditTrial />
                </ErrorBoundary>
              </RouteWrapperAdmin>
            }
          />
        </Route>
      </Route>
    </>
  )
);
