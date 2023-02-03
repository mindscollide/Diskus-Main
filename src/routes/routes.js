import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  createHashRouter,
} from "react-router-dom";
import {
  ChangePassword,
  CustomMiscellaneous,
  CustomSetting,
  Dashboard,
  Home,
  Login,
  Meeting,
  NotFound,
  OnBoard,
  SignUp,
  TodoList,
  VerificationSignUp,
} from "../container";

import AddUser from "../container/Admin/AllUsers/AddUser/AddUser";
import AllUserPage from "../container/Admin/AllUsers/AllUserPage/AllUserPage";
import EditUser from "../container/Admin/AllUsers/EditUser/EditUser";
import Invoice from "../container/Admin/BillingInfo/Invoice/Invoice";
import PaymentHistory from "../container/Admin/BillingInfo/PaymentHistory/PaymentHistory";
import PayOutstanding from "../container/Admin/BillingInfo/PayOutstanding/PayOutstanding";
import Summary from "../container/Admin/BillingInfo/Summary/Summary";
import Organization from "../container/Admin/Configurations/Organization/Organization";
import CustomerInformation from "../container/Admin/CustomerInfo/CustomerInformation/CustomerInformation";
import AdminHome from "../container/Admin/Main/AdminHome";
import AllMeetings from "../container/Admin/Meetings/AllMeeting/AllMeetings";
import CancelSubs from "../container/Admin/Subscriptions/CancelSub/CancelSubs";
import PackageDetails from "../container/Admin/Subscriptions/PackageDetail/PackageDetails";
import PackageUpgrade from "../container/Admin/Subscriptions/PackageUpgrade/PackageUpgrade";
import PackageUpgradeDetail from "../container/Admin/Subscriptions/PackageUpgradeDetail/PackageUpgradeDetail";
import PackageUpgradeSelect from "../container/Admin/Subscriptions/PackageUpgradeSelected/PackageUpgradeSelect";
import AccountCreated from "../container/authentication/account_created/Account_Created";
import ForgotPassword from "../container/authentication/forgot_password/Forgot_password";
import PasswordUpdateMessage from "../container/authentication/password_update_message/Password_Update_Message";
import UpdatePassword from "../container/authentication/update_password/Update_Password";
import VerificationModal from "../container/authentication/verficationmodal/VerificationModal";
import CreatePassword from "../container/pages/organizationRegister/createPassword/CreatePassword";
import PackageSelection from "../container/pages/organizationRegister/packageSelection/PackageSelection";
import PaymentForm from "../container/pages/organizationRegister/paymentform/PaymentForm";
import PackageSelected from "../container/pages/organizationRegister/selectedPackage/PackageSelected";
import EnterPassword from "../container/pages/organizationRegister/signIn/enterPassword/EnterPassword";
import Signup from "../container/pages/organizationRegister/signup/Signup";
import VerifyEmailOTP from "../container/pages/organizationRegister/verifyEmailOTP/VerifyEmailOTP";
import VideoChat from "../container/pages/videoChat/VideoChat";
import PrivateAdminRoute from "./privateadmin_routes";
import PrivateRoutes from "./private_routes";
import ValidateEmail from "../container/pages/organizationRegister/signIn/emailValidate/EmailValidation";
import CalendarPage from "../container/calendarpage/CalendarPage";


export const router = createHashRouter(
  createRoutesFromElements(
    <>
      {/* <Route exact path="/" element={<Login />} /> */}
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/verification" element={<VerificationModal />} />
      <Route path="/updateNewPassword" element={<UpdatePassword />} />
      <Route path="/verificationSignUp" element={<VerificationSignUp />} />
      <Route path="/AccountCreated" element={<AccountCreated />} />
      <Route path="/packageselection" element={<PackageSelection />} />
      <Route path="/signuporganization" element={<Signup />} />
      <Route path="/" element={<ValidateEmail />} />
      <Route path="/forgotpasssowrd2" element={<ForgotPassword />} />
      <Route path="/enterPassword" element={<EnterPassword />} />
      <Route path="/createpasswordorganization" element={<CreatePassword />} />
      <Route path="/verifyEmailOTP" element={<VerifyEmailOTP />} />
      <Route path="/selectedpackage" element={<PackageSelected />} />
      <Route path="/paymentForm" element={<PaymentForm />} />
      <Route
        path="/updatePasswordSuccess"
        element={<PasswordUpdateMessage />}
      />
      <Route element={<PrivateRoutes />}>
        <Route exact path="/Diskus/" element={<Dashboard />}>
          <Route path="" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="todolist" element={<TodoList />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="meeting" element={<Meeting />} />
          <Route path="videochat" element={<VideoChat />} />
          <Route path="setting" element={<CustomSetting />} />
          <Route path="faq's" element={<CustomMiscellaneous />} />
          <Route path="changePassword" element={<ChangePassword />} />
        </Route>
      </Route>
      <Route element={<PrivateAdminRoute />}>
        <Route exact path="/Diskus/Admin/" element={<AdminHome />}>
          <Route path="" element={<Summary />} />
          <Route path="AllUserPage" element={<AllUserPage />} />
          <Route path="AddUser" element={<AddUser />} />
          <Route path="EditUser" element={<EditUser />} />
          <Route path="Invoice" element={<Invoice />} />
          <Route path="PayOutstanding" element={<PayOutstanding />} />
          <Route path="PaymentHistory" element={<PaymentHistory />} />
          <Route path="Summary" element={<Summary />} />
          <Route path="Organization" element={<Organization />} />
          <Route path="AllMeeting" element={<AllMeetings />} />
          <Route path="CancelSub" element={<CancelSubs />} />
          <Route path="PackageDetail" element={<PackageDetails />} />
          <Route path="UpgradePackage" element={<PackageUpgrade />} />
          <Route path="changePassword" element={<ChangePassword />} />
          <Route
            path="UpgradePackageDetail"
            element={<PackageUpgradeDetail />}
          />
          <Route
            path="UpgradePackageSelect"
            element={<PackageUpgradeSelect />}
          />
          <Route path="CustomerInformation" element={<CustomerInformation />} />
          <Route path="setting" element={<CustomSetting />} />
        </Route>
      </Route>
      <Route Route element={<PrivateRoutes />}>
        <Route path="/onboard" element={<OnBoard />} />
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);
