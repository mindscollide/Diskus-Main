import {
  Route,
  createRoutesFromElements,
  createHashRouter,
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

const roleRoute = getLocalStorageItemNonActiveCheck("VERIFICATION");

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      {/* Video Meeting Route */}
      <Route element={<PrivateVideoMeeting />}>
        <Route path='/Diskus/video' element={<VideoMeetingBoardDeck />} />
      </Route>
      <Route path='/GuestVideoCall' element={<GuestVideoCall />} />
      {/* for all login Routes  */}
      <Route path='/' element={<UserManagementProcess />} />
      {/* For All Signup Route */}
      <Route path='/Signup' element={<SignupProcessUserManagement />} />
      {/* ============================================================ */}
      <Route
        path='/PakageDetailsUserManagement'
        element={<PakageDetailsUserManagement />}
      />
      {/* <Route path="/signuporganization" element={<Signup />} /> */}
      <Route
        path='/forgotpasswordVerification'
        element={<ForgotPasswordVerification />}
      />
      <Route path='/updatepassword' element={<UpdatePasswordSuccessfully />} />
      Ï
      <Route
        path='/PaymentFormUserManagement'
        element={<BillingMethodUsermanagement />}
      />
      <Route
        path='/updatePasswordSuccess'
        element={<PasswordUpdateMessage />}
      />
      <Route path='/404' element={<NotFound />} />
      <Route path='*' element={<NotFound />} />
      <Route path='/onboard' element={<OnBoard />} />
      {/* ============================================================ */}
      <Route element={<PrivateRoutes />}>
        <Route
          path='/Diskus/'
          element={
            <RouteWrapperUser name='Diskus'>
              <Dashboard />
            </RouteWrapperUser>
          }>
          <Route
            path=''
            element={
              <RouteWrapperUser name=''>
                <NewDashobard />
              </RouteWrapperUser>
            }
          />
          <Route
            path='Minutes'
            element={
              <RouteWrapperUser name='Minutes'>
                <MinutesFlow />
              </RouteWrapperUser>
            }
          />
          <Route
            path='home'
            element={
              <RouteWrapperUser name='home'>
                <NewDashobard />
              </RouteWrapperUser>
            }
          />

          <Route
            path='todolist'
            element={
              <RouteWrapperUser name='todolist'>
                <TodoList />
              </RouteWrapperUser>
            }
          />
          <Route
            path='documentViewer'
            element={
              <RouteWrapperUser name='documentViewer'>
                <DocumentViewer />
              </RouteWrapperUser>
            }
          />

          <Route
            path='signatureviewer'
            element={
              <RouteWrapperUser name='signatureviewer'>
                <SignatureViewer />
              </RouteWrapperUser>
            }
          />
          <Route
            path='signeddocument'
            element={
              <RouteWrapperUser name='signatureviewer'>
                <PendingSignature />
              </RouteWrapperUser>
            }
          />
          <Route
            path='viewSignDocument'
            element={
              <RouteWrapperUser name='signatureviewer'>
                <ViewSignatureDocument />
              </RouteWrapperUser>
            }
          />
          {/* <Route path="forgotpassword" element={<ForgotPassword />} /> */}
          <Route
            path='calendar'
            element={
              <RouteWrapperUser name='calendar'>
                <CalendarPage />
              </RouteWrapperUser>
            }
          />
          <Route
            path='Meeting'
            element={
              <RouteWrapperUser name='Meeting'>
                <NewMeeting />
              </RouteWrapperUser>
            }
          />
          <Route
            path='Meeting/Useravailabilityformeeting'
            element={
              <RouteWrapperUser name='Meeting'>
                <RSVP />
              </RouteWrapperUser>
            }
          />
          <Route
            path='setting'
            element={
              <RouteWrapperUser name='setting'>
                <UserSettings />
              </RouteWrapperUser>
            }
          />
          <Route
            path="faq's"
            element={
              <RouteWrapperUser name="faq's">
                <CustomMiscellaneous />
              </RouteWrapperUser>
            }
          />
          <Route
            path='groups'
            element={
              <RouteWrapperUser name='groups'>
                <Groups />
              </RouteWrapperUser>
            }
          />
          <Route
            path='changePassword'
            element={
              <RouteWrapperUser name='changePassword'>
                <ChangePassword />
              </RouteWrapperUser>
            }
          />
          <Route
            path='notes'
            element={
              <RouteWrapperUser name='notes'>
                <Notes />
              </RouteWrapperUser>
            }
          />
          <Route
            path='committee'
            element={
              <RouteWrapperUser name='committee'>
                <Committee />
              </RouteWrapperUser>
            }
          />
          <Route
            path='resolution'
            element={
              <RouteWrapperUser name='resolution'>
                <Resolution />
              </RouteWrapperUser>
            }
          />
          <Route
            path='dataroom'
            element={
              <RouteWrapperUser name='dataroom'>
                <ErrorBoundary fallback={ErrorFallback} onError={logErrors}>
                  <DataRoom />
                </ErrorBoundary>
              </RouteWrapperUser>
            }
          />
          <Route
            path='polling'
            element={
              <RouteWrapperUser name='polling'>
                <Polling />
              </RouteWrapperUser>
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
              <AdminHome />
            </RouteWrapperAdmin>
          }>
          <Route
            path=''
            element={
              <RouteWrapperAdmin name='Admin'>
                {roleRoute ? <PayOutstanding /> : <ManageUsers />}
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PaymentFormUserManagement'
            element={
              <RouteWrapperAdmin name='PaymentFormUserManagement'>
                <BillingMethodUsermanagement />
              </RouteWrapperAdmin>
            }
          />
          {/* Route For Payment Processs end */}

          <Route
            path='PakageDetailsUserManagement'
            element={
              <RouteWrapperAdmin name='PakageDetailsUserManagement'>
                <PakageDetailsUserManagement />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='loginreport'
            element={
              <RouteWrapperAdmin name='loginreport'>
                <Reports />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PackageDetailUMupgrade'
            element={
              <RouteWrapperAdmin name='PackageDetailUMupgrade'>
                <PakageDetailsUMUpgrade />
              </RouteWrapperAdmin>
            }
          />

          <Route
            path='AddUsers'
            element={
              <RouteWrapperAdmin name='AddUsers'>
                <AddUsers />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='ManageUsers'
            element={
              <RouteWrapperAdmin name='ManageUsers'>
                <ManageUsers />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='UserLevelConfigUM'
            element={
              <RouteWrapperAdmin name='UserLevelConfigUM'>
                <UserLevelConfigUM />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='AddUsersUsermanagement'
            element={
              <RouteWrapperAdmin name='AddUsersUsermanagement'>
                <AddUserMain />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PayOutstanding'
            element={
              <RouteWrapperAdmin name='PayOutstanding'>
                <PayOutstanding />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PaymentHistory'
            element={
              <RouteWrapperAdmin name='PaymentHistory'>
                <PaymentHistory />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PaymentHistoryusermanagement'
            element={
              <RouteWrapperAdmin name='PaymentHistoryusermanagement'>
                <PaymentMethodBillInfo />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='Summary'
            element={
              <RouteWrapperAdmin name='Summary'>
                <Summary />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='OrganizationlevelConfigUM'
            element={
              <RouteWrapperAdmin name='OrganizationlevelConfigUM'>
                <OrganizationLevelConfigUM />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='AllMeeting'
            element={
              <RouteWrapperAdmin name='AllMeeting'>
                <AllMeetings />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='CancelSub'
            element={
              <RouteWrapperAdmin name='CancelSub'>
                <CancelSubs />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='CancelSubscriptionUserManagement'
            element={
              <RouteWrapperAdmin name='CancelSubscriptionUserManagement'>
                <CancelSubscriptionAdmin />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PackageDetail'
            element={
              <RouteWrapperAdmin name='PackageDetail'>
                <PackageDetails />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='PackageDetailsUserManagement'
            element={
              <RouteWrapperAdmin name='PackageDetailsUserManagement'>
                <PakageDetailsAdmin />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='subscriptionDetailsUserManagement'
            element={
              <RouteWrapperAdmin name='subscriptionDetailsUserManagement'>
                <SubscriptionDetailsUserManagement />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='downgradeSubscription'
            element={
              <RouteWrapperAdmin name='downgradeSubscription'>
                <DowngradeSubscription />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='updatedCancelSubscription'
            element={
              <RouteWrapperAdmin name='updatedCancelSubscription'>
                <UpdatedCancelSubscription />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='EmptyState'
            element={
              <RouteWrapperAdmin name='EmptyState'>
                <EmptyState />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='UpgradePackage'
            element={
              <RouteWrapperAdmin name='UpgradePackage'>
                <PackageUpgrade />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='changePassword'
            element={
              <RouteWrapperAdmin name='changePassword'>
                <ChangePassword />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="faq's"
            element={
              <RouteWrapperAdmin name="faq's">
                <CustomMiscellaneous />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='deleteorganization'
            element={
              <RouteWrapperAdmin name='deleteorganization'>
                <DeleteOrganization />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='deleteorganizationUserMangement'
            element={
              <RouteWrapperAdmin name='deleteorganizationUserMangement'>
                <DeleteOrganizationAdmin />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='paymentForm'
            element={
              <RouteWrapperAdmin name='paymentForm'>
                <PaymentForm2 />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='UpgradePackageDetail'
            element={
              <RouteWrapperAdmin name='UpgradePackageDetail'>
                <PackageUpgradeDetail />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='UpgradePackageSelect'
            element={
              <RouteWrapperAdmin name='UpgradePackageSelect'>
                <PackageUpgradeSelect />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path='CustomerInformation'
            element={
              <RouteWrapperAdmin name='CustomerInformation'>
                <CustomerInformation />
              </RouteWrapperAdmin>
            }
          />
        </Route>
      </Route>
    </>
  )
);
