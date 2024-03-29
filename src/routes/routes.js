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
  VideoPanelMaximize,
  VideoScreens,
  VideoMultiple,
  VideoIncoming,
  VideoOutgoing,
  AddUser,
  AllUserPage,
  EditUser,
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
  ForgotPassword,
  PasswordUpdateMessage,
  CreatePassword,
  PackageSelection,
  PaymentForm,
  PackageSelected,
  EnterPassword,
  Signup,
  VerifyEmailOTP,
  VideoChat,
  Notes,
  ValidateEmail,
  CalendarPage,
  TwoFactor,
  TwoFacSendEmail,
  SendEmailRealmeXtra,
  VerificationIphone,
  VerificationCodeOne,
  VerificationCodeThree,
  SigninDenied,
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
} from "../container";

import DocumentViewer from "../components/elements/webviewer/DocumentViewer";
import PrivateNonActive from "./PrivateNonActive";
import PrivateAdminRoute from "./privateadmin_routes";
import PrivateAdminRouteNonActive from "./privateadminNonactive_routes";
import PrivateParAdminRouteNonActive from "./PrivateParAdminRouteNonActive";
import PrivateRoutes from "./private_routes";
import PrivateRouteDataroom from "./private_route_dataroom";
import Reports from "../container/Admin/Reports/Reports";
import SignatureViewer from "../components/elements/signaturewebviewer/signatureviewer";
import SignUpOrganizationUM from "../container/pages/UserMangement/SignUpOrganizationUM/SignUpOrganizationUM";
import VerifyOTPUM from "../container/pages/UserMangement/VerifyOTPUM/VerifyOTPUM";
import PasswordCreationUM from "../container/pages/UserMangement/PasswordCreationUM/PasswordCreationUM";
import ManageUsers from "../container/pages/UserMangement/AdminUserManagement/ManageUsers/ManageUsers";
import AddUsers from "../container/pages/UserMangement/AdminUserManagement/AddUsers/AddUsers";
import OrganizationLevelConfigUM from "../container/pages/UserMangement/OrganziationLevelConfigUM/OrganizationLevelConfigUM";
import UserLevelConfigUM from "../container/pages/UserMangement/UserLevelConfigUM/UserLevelConfigUM";
import PakageDetailsUserManagement from "../container/pages/UserMangement/PakageDetailsUserManagement/PakageDetailsUserManagement";
import BillingMethodUsermanagement from "../container/pages/UserMangement/BillingMethodUserManagement/BillingMethodUsermanagement";
import PakageDetailsAdmin from "../container/pages/UserMangement/AdminUserManagement/PakageDetailsAdmin/PakageDetailsAdmin";
import CancelSubscriptionAdmin from "../container/pages/UserMangement/AdminUserManagement/CancelSubscriptionAdmin/CancelSubscriptionAdmin";
import DeleteOrganizationAdmin from "../container/pages/UserMangement/AdminUserManagement/DeleteOrganizationAdmin/DeleteOrganizationAdmin";
import PaymentMethodBillInfo from "../container/pages/UserMangement/AdminUserManagement/PaymentMethodBillInfoUserManagement/PaymentMethodBillInfo";
import AddUserMain from "../container/pages/UserMangement/AdminUserManagement/AddUserMain/AddUserMain";
import UserManagementProcess from "../container/pages/UserManagementProcess/UserManagementProcess";
import PasswordVerification from "../container/pages/UserMangement/PasswordVerification/PasswordVerification";
import SignupProcessUserManagement from "../container/pages/SignUpProcessUserManagement/SignupProcessUserManagement";

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/packageselection" element={<PackageSelection />} />
      <Route
        path="/PakageDetailsUserManagement"
        element={<PakageDetailsUserManagement />}
      />
      <Route path="/signuporganization" element={<Signup />} />
      {/* <Route path="/" element={<ValidateEmail />} /> */}
      {/* <Route path="/forgotpasssowrd" element={<ForgotPassword />} /> */}
      <Route
        path="/forgotpasswordVerification"
        element={<ForgotPasswordVerification />}
      />
      <Route path="/updatepassword" element={<UpdatePasswordSuccessfully />} />
      {/* <Route path="/enterPassword" element={<EnterPassword />} /> */}
      <Route path="/createpasswordorganization" element={<CreatePassword />} />
      <Route path="/verifyEmailOTP" element={<VerifyEmailOTP />} />
      <Route path="/selectedpackage" element={<PackageSelected />} />
      <Route path="/paymentForm" element={<PaymentForm />} />
      <Route
        path="/PaymentFormUserManagement"
        element={<BillingMethodUsermanagement />}
      />
      <Route
        path="/updatePasswordSuccess"
        element={<PasswordUpdateMessage />}
      />
      {/* Two Fac Routes */}
      <Route path="/twofac" element={<TwoFactor />} />
      {/* <Route path="/sendmailwithdevice" element={<SendEmailRealmeXtra />} /> */}
      <Route path="/twofacmultidevice" element={<TwoFacSendEmail />} />
      <Route path="/selectfrommultidevices" element={<VerificationIphone />} />
      {/* <Route path="/2FAverificationotp" element={<VerificationCodeOne />} /> */}
      <Route
        path="/2FAverificationdevieotp"
        element={<VerificationCodeThree />}
      />
      <Route path="/SigninDenied" element={<SigninDenied />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />

      <Route element={<PrivateRoutes />}>
        <Route exact path="/Diskus/" element={<Dashboard />}>
          <Route path="maximizePanel" element={<VideoPanelMaximize />} />
          <Route path="" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="todolist" element={<TodoList />} />
          <Route path="documentViewer" element={<DocumentViewer />} />
          <Route path="signatureviewer" element={<SignatureViewer />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="Meeting" element={<NewMeeting />} />
          <Route path="Meeting/Useravailabilityformeeting" element={<RSVP />} />
          <Route path="videochat" element={<VideoChat />} />
          <Route path="setting" element={<UserSettings />} />
          <Route path="faq's" element={<CustomMiscellaneous />} />
          <Route path="groups" element={<Groups />} />
          <Route path="changePassword" element={<ChangePassword />} />
          <Route path="notes" element={<Notes />} />
          <Route path="VideoIncoming" element={<VideoIncoming />} />
          <Route path="VideoOutgoing" element={<VideoOutgoing />} />
          <Route path="VideoMultiple" element={<VideoMultiple />} />
          <Route path="VideoScreens" element={<VideoScreens />} />
          <Route path="committee" element={<Committee />} />
          <Route path="resolution" element={<Resolution />} />
          <Route path="dataroom" element={<DataRoom />} />
          <Route path="polling" element={<Polling />} />
        </Route>
      </Route>
      <Route element={<PrivateAdminRoute />}>
        <Route exact path="/Diskus/Admin/" element={<AdminHome />}>
          <Route path="" element={<Summary />} />
          <Route path="AllUserPage" element={<AllUserPage />} />
          <Route path="loginreport" element={<Reports />} />
          <Route path="AddUser" element={<AddUser />} />
          <Route path="EditUser" element={<EditUser />} />
          <Route path="ManageUsers" element={<ManageUsers />} />{" "}
          <Route path="UserLevelConfigUM" element={<UserLevelConfigUM />} />
          <Route path="AddUsersUsermanagement" element={<AddUserMain />} />
          <Route path="Invoice" element={<Invoice />} />
          <Route path="PayOutstanding" element={<PayOutstanding />} />
          <Route path="PaymentHistory" element={<PaymentHistory />} />
          <Route
            path="PaymentHistoryusermanagement"
            element={<PaymentMethodBillInfo />}
          />
          <Route path="Summary" element={<Summary />} />
          <Route path="Organization" element={<OrganizationLevelSetting />} />
          <Route
            path="OrganizationlevelConfigUM"
            element={<OrganizationLevelConfigUM />}
          />
          <Route path="AllMeeting" element={<AllMeetings />} />
          <Route path="CancelSub" element={<CancelSubs />} />
          <Route
            path="CancelSubscriptionUserManagement"
            element={<CancelSubscriptionAdmin />}
          />
          <Route path="PackageDetail" element={<PackageDetails />} />
          <Route
            path="PackageDetailsUserManagement"
            element={<PakageDetailsAdmin />}
          />
          <Route path="EmptyState" element={<EmptyState />} />
          <Route path="UpgradePackage" element={<PackageUpgrade />} />
          <Route path="changePassword" element={<ChangePassword />} />
          <Route path="faq's" element={<CustomMiscellaneous />} />
          <Route path="deleteorganization" element={<DeleteOrganization />} />
          <Route
            path="deleteorganizationUserMangement"
            element={<DeleteOrganizationAdmin />}
          />
          <Route path="paymentForm" element={<PaymentForm2 />} />
          <Route
            path="UpgradePackageDetail"
            element={<PackageUpgradeDetail />}
          />
          <Route
            path="UpgradePackageSelect"
            element={<PackageUpgradeSelect />}
          />
          <Route path="CustomerInformation" element={<CustomerInformation />} />
          <Route path="setting" element={<UserSettings />} />
        </Route>
      </Route>
      <Route element={<PrivateAdminRouteNonActive />}>
        <Route exact path="/DisKus/Admin/Payment/" element={<AdminHome />}>
          <Route path="PayOutstanding" element={<PayOutstanding />} />
          <Route path="/DisKus/Admin/Payment/" element={<PayOutstanding />} />
        </Route>
      </Route>
      <Route element={<PrivateNonActive />}>
        <Route exact path="/DisKus/Nonactive/" element={<Dashboard />}>
          <Route path="" element={<Home />} />
        </Route>
      </Route>
      <Route element={<PrivateParAdminRouteNonActive />}>
        <Route exact path="/DisKus/Admin/Nonactive/" element={<AdminHome />}>
          <Route path="" element={<Summary />} />
        </Route>
      </Route>
      <Route Route element={<PrivateRoutes />}>
        <Route path="/onboard" element={<OnBoard />} />
      </Route>
      {/* for all login Routes  */}
      <Route path="/" element={<UserManagementProcess />} />

      {/* For All Signup Route */}
      <Route path="/Signup" element={<SignupProcessUserManagement />} />

      <Route path="/signupUsermanagement" element={<SignUpOrganizationUM />} />
      <Route
        path="/PasswordVerificationUM"
        element={<PasswordVerification />}
      />
    </>
  )
);
