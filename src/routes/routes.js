import {
  Route,
  createRoutesFromElements,
  createHashRouter,
} from "react-router-dom";
import {
  ChangePassword,
  CustomMiscellaneous,
  Dashboard,
  DeleteOrganization,
  Home,
  NotFound,
  OnBoard,
  TodoList,
  Invoice,
  PaymentHistory,
  PayOutstanding,
  Summary,
  CustomerInformation,
  AdminHome,
  Groups,
  AllMeetings,
  CancelSubs,
  PackageDetails,
  PackageUpgrade,
  PackageUpgradeDetail,
  PackageUpgradeSelect,
  PasswordUpdateMessage,
  Notes,
  CalendarPage,
  ForgotPasswordVerification,
  UpdatePasswordSuccessfully,
  Committee,
  Resolution,
  DataRoom,
  Polling,
  PaymentForm2,
  NewMeeting,
  UserSettings,
  OrganizationLevelSetting,
  EmptyState,
  RSVP,
  MinutesFlow,
  UserManagementProcess,
  SignupProcessUserManagement,
  PakageDetailsUserManagement,
  BillingMethodUsermanagement,
  PaymentTest,
  ManageUsers,
  PaymentProcess,
  Reports,
  PakageDetailsUMUpgrade,
  AddUsers,
  UserLevelConfigUM,
  AddUserMain,
  PaymentMethodBillInfo,
  OrganizationLevelConfigUM,
  CancelSubscriptionAdmin,
  PakageDetailsAdmin,
  DeleteOrganizationAdmin,
} from "../container";

import PrivateAdminRoute from "./privateadmin_routes";
import PrivateRoutes from "./private_routes";
import SignatureViewer from "../container/DataRoom/SignatureFlow/signaturewebviewer/signatureviewer";
import PendingSignature from "../container/DataRoom/SignatureFlow/pendingSignature/pendingSignatrue";
import ViewSignatureDocument from "../container/DataRoom/SignatureFlow/ViewSIgnatureDocument/ViewSignatureDocument";
import RouteWrapperUser from "./RouteWrapperUser";
import RouteWrapperAdmin from "./RouteWrapperAdmin";
import { getLocalStorageItemNonActiveCheck } from "../commen/functions/utils";
//import PaymentTest from "../container/pages/UserMangement/PaymentTestPage/PaymentTest";
import ReviewSignature from "../container/DataRoom/SignatureApproval/ReviewAndSign/ReviewSignature";
import PendingApproval from "../container/MinutesNewFlow/pendingApprovals/PendingApprovals";
import NewDashobard from "../container/NewDashboardLayout/NewDashobard";
import SubscriptionDetailsUserManagement from "../container/pages/UserMangement/AdminUserManagement/SubscriptionDetailsUserManagement/SubscriptionDetailsUserManagement";
import DowngradeSubscription from "../container/pages/UserMangement/AdminUserManagement/SubscriptionDetailsUserManagement/DowngradeSubscription/DowngradeSubscription";
import UpdatedCancelSubscription from "../container/pages/UserMangement/AdminUserManagement/UpdatedCancelSubscription/UpdatedCancelSubscription";
import PrivateVideoMeeting from "./PrivateVideoMeetingRoute";
import VideoMeetingBoardDeck from "../container/VideoMeetingBoardDeck/VideoMeetingBoardDeck";
import { DocumentViewer } from "../components/elements";

const roleRoute = getLocalStorageItemNonActiveCheck("VERIFICATION");

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      {/* Video Meeting Route */}
      <Route element={<PrivateVideoMeeting />}>
        <Route path='/Diskus/video' element={<VideoMeetingBoardDeck />} />
      </Route>

      <Route>
        <Route path='/GuestVideoCall' element={<VideoMeetingBoardDeck />} />
      </Route>
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
      {/* ============================================================ */}

      <Route element={<PrivateRoutes />}>
        <Route
          exact
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
                {/* <Home /> */}

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
                {/* <Home /> */}
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
            path='Payment'
            element={
              <RouteWrapperUser name='Payment'>
                <PaymentTest />
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
                <DataRoom />
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

          {/* Route For Payment Processs start */}
          <Route
            path='PaymentProcess'
            element={
              <RouteWrapperAdmin name='PaymentProcess'>
                <PaymentProcess />
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
            path='Invoice'
            element={
              <RouteWrapperAdmin name='Invoice'>
                <Invoice />
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
            path='Organization'
            element={
              <RouteWrapperAdmin name='Organization'>
                <OrganizationLevelSetting />
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
      <Route Route element={<PrivateRoutes />}>
        <Route path='/onboard' element={<OnBoard />} />
      </Route>
    </>
  )
);
