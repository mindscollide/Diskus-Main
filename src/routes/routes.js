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
  PasswordUpdateMessage,
  CreatePassword,
  PackageSelection,
  PaymentForm,
  PackageSelected,
  Signup,
  VerifyEmailOTP,
  Notes,
  CalendarPage,
  TwoFactor,
  TwoFacSendEmail,
  VerificationIphone,
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
import RouteWrapperUser from "./RouteWrapperUser";
import RouteWrapperAdmin from "./RouteWrapperAdmin";
import PakageDetailsUMUpgrade from "../container/pages/UserMangement/AdminUserManagement/PackageDetailsUMUpgrade/PackageDetailsUMUpgrade";
import PaymentProcess from "../container/pages/UserMangement/PaymentProcess/PaymentProcess";
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
        <Route
          exact
          path="/Diskus/"
          element={
            <RouteWrapperUser name="Diskus">
              <Dashboard />
            </RouteWrapperUser>
          }
        >
          <Route
            path=""
            element={
              <RouteWrapperUser name="">
                <Home />
              </RouteWrapperUser>
            }
          />
          <Route
            path="home"
            element={
              <RouteWrapperUser name="home">
                <Home />
              </RouteWrapperUser>
            }
          />
          <Route
            path="todolist"
            element={
              <RouteWrapperUser name="todolist">
                <TodoList />
              </RouteWrapperUser>
            }
          />
          <Route
            path="documentViewer"
            element={
              <RouteWrapperUser name="documentViewer">
                <DocumentViewer />
              </RouteWrapperUser>
            }
          />
          <Route
            path="signatureviewer"
            element={
              <RouteWrapperUser name="signatureviewer">
                <SignatureViewer />
              </RouteWrapperUser>
            }
          />
          {/* <Route path="forgotpassword" element={<ForgotPassword />} /> */}
          <Route
            path="calendar"
            element={
              <RouteWrapperUser name="calendar">
                <CalendarPage />
              </RouteWrapperUser>
            }
          />
          <Route
            path="Meeting"
            element={
              <RouteWrapperUser name="Meeting">
                <NewMeeting />
              </RouteWrapperUser>
            }
          />
          <Route
            path="Meeting/Useravailabilityformeeting"
            element={
              <RouteWrapperUser name="Meeting/Useravailabilityformeeting">
                <RSVP />
              </RouteWrapperUser>
            }
          />
          <Route
            path="setting"
            element={
              <RouteWrapperUser name="setting">
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
            path="groups"
            element={
              <RouteWrapperUser name="groups">
                <Groups />
              </RouteWrapperUser>
            }
          />
          <Route
            path="changePassword"
            element={
              <RouteWrapperUser name="changePassword">
                <ChangePassword />
              </RouteWrapperUser>
            }
          />
          <Route
            path="notes"
            element={
              <RouteWrapperUser name="notes">
                <Notes />
              </RouteWrapperUser>
            }
          />
          <Route
            path="committee"
            element={
              <RouteWrapperUser name="committee">
                <Committee />
              </RouteWrapperUser>
            }
          />
          <Route
            path="resolution"
            element={
              <RouteWrapperUser name="resolution">
                <Resolution />
              </RouteWrapperUser>
            }
          />
          <Route
            path="dataroom"
            element={
              <RouteWrapperUser name="dataroom">
                <DataRoom />
              </RouteWrapperUser>
            }
          />
          <Route
            path="polling"
            element={
              <RouteWrapperUser name="polling">
                <Polling />
                <Polling />
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
              <AdminHome />
            </RouteWrapperAdmin>
          }
        >
          <Route
            path=""
            element={
              <RouteWrapperAdmin name="Admin">
                <ManageUsers />
              </RouteWrapperAdmin>
            }
          />

          {/* Route For Payment Processs start */}
          <Route
            path="PaymentProcess"
            element={
              <RouteWrapperAdmin name="PaymentProcess">
                <PaymentProcess />
              </RouteWrapperAdmin>
            }
          />
          {/* Route For Payment Processs end */}

          <Route
            path="PakageDetailsUserManagement"
            element={
              <RouteWrapperAdmin name="PakageDetailsUserManagement">
                <PakageDetailsUserManagement />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="loginreport"
            element={
              <RouteWrapperAdmin name="loginreport">
                <Reports />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PackageDetailUMupgrade"
            element={
              <RouteWrapperAdmin name="PackageDetailUMupgrade">
                <PakageDetailsUMUpgrade />
              </RouteWrapperAdmin>
            }
          />

          <Route
            path="AddUsers"
            element={
              <RouteWrapperAdmin name="AddUsers">
                <AddUsers />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="ManageUsers"
            element={
              <RouteWrapperAdmin name="ManageUsers">
                <ManageUsers />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="UserLevelConfigUM"
            element={
              <RouteWrapperAdmin name="UserLevelConfigUM">
                <UserLevelConfigUM />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="AddUsersUsermanagement"
            element={
              <RouteWrapperAdmin name="AddUsersUsermanagement">
                <AddUserMain />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="Invoice"
            element={
              <RouteWrapperAdmin name="Invoice">
                <Invoice />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PayOutstanding"
            element={
              <RouteWrapperAdmin name="PayOutstanding">
                <PayOutstanding />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PaymentHistory"
            element={
              <RouteWrapperAdmin name="PaymentHistory">
                <PaymentHistory />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PaymentHistoryusermanagement"
            element={
              <RouteWrapperAdmin name="PaymentHistoryusermanagement">
                <PaymentMethodBillInfo />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="Summary"
            element={
              <RouteWrapperAdmin name="Summary">
                <Summary />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="Organization"
            element={
              <RouteWrapperAdmin name="Organization">
                <OrganizationLevelSetting />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="OrganizationlevelConfigUM"
            element={
              <RouteWrapperAdmin name="OrganizationlevelConfigUM">
                <OrganizationLevelConfigUM />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="AllMeeting"
            element={
              <RouteWrapperAdmin name="AllMeeting">
                <AllMeetings />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="CancelSub"
            element={
              <RouteWrapperAdmin name="CancelSub">
                <CancelSubs />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="CancelSubscriptionUserManagement"
            element={
              <RouteWrapperAdmin name="CancelSubscriptionUserManagement">
                <CancelSubscriptionAdmin />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PackageDetail"
            element={
              <RouteWrapperAdmin name="PackageDetail">
                <PackageDetails />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="PackageDetailsUserManagement"
            element={
              <RouteWrapperAdmin name="PackageDetailsUserManagement">
                <PakageDetailsAdmin />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="EmptyState"
            element={
              <RouteWrapperAdmin name="EmptyState">
                <EmptyState />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="UpgradePackage"
            element={
              <RouteWrapperAdmin name="UpgradePackage">
                <PackageUpgrade />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="changePassword"
            element={
              <RouteWrapperAdmin name="changePassword">
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
            path="deleteorganization"
            element={
              <RouteWrapperAdmin name="deleteorganization">
                <DeleteOrganization />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="deleteorganizationUserMangement"
            element={
              <RouteWrapperAdmin name="deleteorganizationUserMangement">
                <DeleteOrganizationAdmin />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="paymentForm"
            element={
              <RouteWrapperAdmin name="paymentForm">
                <PaymentForm2 />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="UpgradePackageDetail"
            element={
              <RouteWrapperAdmin name="UpgradePackageDetail">
                <PackageUpgradeDetail />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="UpgradePackageSelect"
            element={
              <RouteWrapperAdmin name="UpgradePackageSelect">
                <PackageUpgradeSelect />
              </RouteWrapperAdmin>
            }
          />
          <Route
            path="CustomerInformation"
            element={
              <RouteWrapperAdmin name="CustomerInformation">
                <CustomerInformation />
              </RouteWrapperAdmin>
            }
          />
          {/* <Route
            path="setting"
            element={
              <RouteWrapperAdmin name="setting">
                <UserSettings />
              </RouteWrapperAdmin>
            }
          /> */}
        </Route>
      </Route>
      <Route element={<PrivateAdminRouteNonActive />}>
        <Route exact path="/Admin/Payment/" element={<AdminHome />}>
          <Route path="PayOutstanding" element={<PayOutstanding />} />
          <Route path="/Admin/Payment/" element={<PayOutstanding />} />
        </Route>
      </Route>
      <Route element={<PrivateNonActive />}>
        <Route exact path="/DisKus/Nonactive/" element={<Dashboard />}>
          <Route path="" element={<Home />} />
        </Route>
      </Route>
      <Route element={<PrivateParAdminRouteNonActive />}>
        <Route exact path="/Admin/Nonactive/" element={<AdminHome />}>
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
