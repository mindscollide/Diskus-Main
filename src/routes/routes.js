import {
  Route,
  createRoutesFromElements,
  createHashRouter,
} from "react-router-dom";
import {
  ChangePassword,
  CustomMiscellaneous,
  CustomSetting,
  Dashboard,
  DeleteOrganization,
  Home,
  Meeting,
  NotFound,
  OnBoard,
  TodoList,
} from "../container";

import VideoScreens from "../container/videoMultipleScreens/VideoScreens";
import VideoMultiple from "../container/videoMultiple/VideoMultiple";
import VideoIncoming from "../container/videoIncoming/VideoIncoming";
import VideoOutgoing from "../container/videoOutgoing/VideoOutgoing";
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
import Groups from "../container/Groups/Groups";
import AllMeetings from "../container/Admin/Meetings/AllMeeting/AllMeetings";
import CancelSubs from "../container/Admin/Subscriptions/CancelSub/CancelSubs";
import PackageDetails from "../container/Admin/Subscriptions/PackageDetail/PackageDetails";
import PackageUpgrade from "../container/Admin/Subscriptions/PackageUpgrade/PackageUpgrade";
import PackageUpgradeDetail from "../container/Admin/Subscriptions/PackageUpgradeDetail/PackageUpgradeDetail";
import PackageUpgradeSelect from "../container/Admin/Subscriptions/PackageUpgradeSelected/PackageUpgradeSelect";
import ForgotPassword from "../container/authentication/forgot_password/Forgot_password";
import PasswordUpdateMessage from "../container/authentication/password_update_message/Password_Update_Message";
import CreatePassword from "../container/pages/organizationRegister/createPassword/CreatePassword";
import PackageSelection from "../container/pages/organizationRegister/packageSelection/PackageSelection";
import PaymentForm from "../container/pages/organizationRegister/paymentform/PaymentForm";
import PackageSelected from "../container/pages/organizationRegister/selectedPackage/PackageSelected";
import EnterPassword from "../container/pages/organizationRegister/signIn/enterPassword/EnterPassword";
import Signup from "../container/pages/organizationRegister/signup/Signup";
import VerifyEmailOTP from "../container/pages/organizationRegister/verifyEmailOTP/VerifyEmailOTP";
import VideoChat from "../container/pages/videoChat/VideoChat";
import PrivateAdminRoute from "./privateadmin_routes";
import PrivateAdminRouteNonActive from "./privateadminNonactive_routes";
import PrivateParAdminRouteNonActive from "./PrivateParAdminRouteNonActive";
import PrivateRoutes from "./private_routes";
import Notes from "../container/notes/Notes";
import PrivateNonActive from "./PrivateNonActive";
import ValidateEmail from "../container/pages/organizationRegister/signIn/emailValidate/EmailValidation";
import CalendarPage from "../container/calendarpage/CalendarPage";
import TwoFactor from "../container/pages/organizationRegister/2FA/TwoFacVerify/TwoFactor";
import TwoFacSendEmail from "../container/pages/organizationRegister/2FA/TwoFacSendEmail/TwoFacSendEmail";
import SendEmailRealmeXtra from "../container/pages/organizationRegister/2FA/SendEmailRealmeXtra/SendEmailRealmeXtra";
import VerificationIphone from "../container/pages/organizationRegister/2FA/VerificationIphone/VerificationIphone";
import VerificationCodeOne from "../container/pages/organizationRegister/2FA/VericationCodeOne/VerificationCodeOne";
import VerificationCodeThree from "../container/pages/organizationRegister/2FA/VerficationCodeThree/VerificationCodeThree";
import SigninDenied from "../container/pages/organizationRegister/2FA/VerificationFaild/SignInDenied";
import ForgotPasswordVerification from "../container/authentication/ForgotpasswordVerification/ForgotPasswordVerification";
import UpdatePasswordSuccessfully from "../container/authentication/UpdatedPasswordSuccessfully/UpdatePasswordSuccessfully";
import Committee from "../container/Committee/Committee";
import Resolution from "../container/Resolution/Resolution";
import DataRoom from "../container/DataRoom/DataRoom";
import Polling from "../container/Polling/Polling";
import PaymentForm2 from "../container/Admin/Subscriptions/PaymentForm2/PaymentForm2";
import NewMeeting from "../container/pages/meeting/MeetingTwo";
import UserSettings from "../container/setting/UserLevelSettings/UserSettings";
import OrganizationLevelSetting from "../container/setting/OrganizationLevelSetting/OrganizationLevelSetting";

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/packageselection" element={<PackageSelection />} />
      <Route path="/signuporganization" element={<Signup />} />
      <Route path="/" element={<ValidateEmail />} />
      <Route path="/forgotpasssowrd" element={<ForgotPassword />} />
      <Route
        path="/forgotpasswordVerification"
        element={<ForgotPasswordVerification />}
      />
      <Route path="/updatepassword" element={<UpdatePasswordSuccessfully />} />
      <Route path="/enterPassword" element={<EnterPassword />} />
      <Route path="/createpasswordorganization" element={<CreatePassword />} />
      <Route path="/verifyEmailOTP" element={<VerifyEmailOTP />} />
      <Route path="/selectedpackage" element={<PackageSelected />} />
      <Route path="/paymentForm" element={<PaymentForm />} />
      <Route
        path="/updatePasswordSuccess"
        element={<PasswordUpdateMessage />}
      />
      {/* Two Fac Routes */}
      <Route path="/twofac" element={<TwoFactor />} />
      <Route path="/sendmailwithdevice" element={<SendEmailRealmeXtra />} />
      <Route path="/twofacmultidevice" element={<TwoFacSendEmail />} />
      <Route path="/selectfrommultidevices" element={<VerificationIphone />} />
      <Route path="/2FAverificationotp" element={<VerificationCodeOne />} />
      <Route
        path="/2FAverificationdevieotp"
        element={<VerificationCodeThree />}
      />
      <Route path="/SigninDenied" element={<SigninDenied />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
      <Route element={<PrivateRoutes />}>
        <Route exact path="/Diskus/" element={<Dashboard />}>
          <Route path="" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="todolist" element={<TodoList />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="meeting" element={<Meeting />} />
          <Route path="Meeting2" element={<NewMeeting />} />
          <Route path="videochat" element={<VideoChat />} />
          {/* <Route path="setting" element={<CustomSetting />} /> */}
          <Route path="setting" element={<UserSettings />} />
          {/* <Route path="UserNewSettings" element={<UserSettings />} /> */}
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
          <Route path="AddUser" element={<AddUser />} />
          <Route path="EditUser" element={<EditUser />} />
          <Route path="Invoice" element={<Invoice />} />
          <Route path="PayOutstanding" element={<PayOutstanding />} />
          <Route path="PaymentHistory" element={<PaymentHistory />} />
          <Route path="Summary" element={<Summary />} />
          {/* OrganizationLevelSetting */}
          {/* <Route path="OrganizationLevelSetting" element={<OrganizationLevelSetting />} /> */}
          <Route path="Organization" element={<OrganizationLevelSetting />} />
          <Route path="AllMeeting" element={<AllMeetings />} />
          <Route path="CancelSub" element={<CancelSubs />} />
          <Route path="PackageDetail" element={<PackageDetails />} />
          <Route path="UpgradePackage" element={<PackageUpgrade />} />
          <Route path="changePassword" element={<ChangePassword />} />
          <Route path="faq's" element={<CustomMiscellaneous />} />
          <Route path="deleteorganization" element={<DeleteOrganization />} />
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
          {/* <Route path="setting" element={<CustomSetting />} /> */}
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

      {/* <Route path="CustomerInformation" element={<CustomerInformation />} /> */}
    </>
  )
);
