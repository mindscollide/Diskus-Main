import React, { useEffect } from "react";
import "./App.css";
import "./fr.css";
import "./ar.css";

import PrivateRoutes from "./routes/private_routes";
import { Route, Routes } from "react-router-dom";
import { logoutAllTabs } from "./store/actions/Auth_Sign_Out";
import Login from "./container/authentication/sign_in/Sign_in";
import SignUp from "./container/authentication/sign_up/Sign_up";
import NotFound from "./container/page_404/Page_404";
import Forgot from "./container/authentication/forgot_password/Forgot_password";
import VerificationSignUp from "./container/authentication/signup_verification/SignUp_Verification";
import AccountCreated from "./container/authentication/account_created/Account_Created";
import { CustomSetting as Setting, OnBoard } from "./container";
import { CustomMiscellaneous as Miscellaneous } from "./container";
import { CustomCalendar as Calendar } from "./container";
import { TodoList } from "./container";
import { Meeting } from "./container";
import VideoChat from "./container/pages/videoChat/VideoChat";
import Dashboard from "./container/dashboard/Dashboard";
import { Home } from "./container";
import VerificationModal from "./container/authentication/verficationmodal/VerificationModal";
import UpdatePassword from "./container/authentication/update_password/Update_Password";
import PasswordUpdateMessage from "./container/authentication/password_update_message/Password_Update_Message";
import PackageSelection from "./container/pages/organizationRegister/packageSelection/PackageSelection";
import Signup from "./container/pages/organizationRegister/signup/Signup";
import ValidateEmail from "./container/pages/organizationRegister/signIn/emailValidate/EmailValidation";
import CreatePassword from "./container/pages/organizationRegister/createPassword/CreatePassword";
import EnterPassword from "./container/pages/organizationRegister/signIn/enterPassword/EnterPassword";
import VerifyEmailOTP from "./container/pages/organizationRegister/verifyEmailOTP/VerifyEmailOTP";
import PackageSelected from "./container/pages/organizationRegister/selectedPackage/PackageSelected";
import PaymentForm from "./container/pages/organizationRegister/paymentform/PaymentForm";
import ForgotPassword from "./container/pages/organizationRegister/signIn/forgotpassword/ForgotPassword";
import Header2 from "./components/layout/header2/Header2";

// for admin //
import AddUser from "./container/Admin/AllUsers/AddUser/AddUser";
import EditUser from "./container/Admin/AllUsers/EditUser/EditUser";
import Invoice from "./container/Admin/BillingInfo/Invoice/Invoice";
import PayOutstanding from "./container/Admin/BillingInfo/PayOutstanding/PayOutstanding";
import PaymentHistory from "./container/Admin/BillingInfo/PaymentHistory/PaymentHistory";
import Summary from "./container/Admin/BillingInfo/Summary/Summary";
import Organization from "./container/Admin/Configurations/Organization/Organization";
import AllMeeting from "./container/Admin/Meetings/AllMeeting/AllMeetings";
import CancelSub from "./container/Admin/Subscriptions/CancelSub/CancelSubs";
import PackageDetail from "./container/Admin/Subscriptions/PackageDetail/PackageDetails";
import CustomerInformation from "./container/Admin/CustomerInfo/CustomerInformation/CustomerInformation";
import PrivateAdminRoute from "./routes/privateadmin_routes";
import AdminHome from "./container/Admin/Main/AdminHome";

//Adding Comment Again
const App = () => {
  useEffect(() => {
    logoutAllTabs();
  }, []);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/forgotpassword" element={<Forgot />} />
        <Route path="/verification" element={<VerificationModal />} />
        <Route path="/updateNewPassword" element={<UpdatePassword />} />
        <Route path="/verificationSignUp" element={<VerificationSignUp />} />
        <Route path="/AccountCreated" element={<AccountCreated />} />
        <Route path="/packageselection" element={<PackageSelection />} />
        <Route path="/signuporganization" element={<Signup />} />
        <Route path="/validateemailorganization" element={<ValidateEmail />} />
        <Route path="/forgotpasssowrd2" element={<ForgotPassword />} />
        <Route path="/enterPassword" element={<EnterPassword />} />
        <Route
          path="/createpasswordorganization"
          element={<CreatePassword />}
        />
        <Route path="/verifyEmailOTP" element={<VerifyEmailOTP />} />
        <Route path="/selectedpackage" element={<PackageSelected />} />
        <Route path="/paymentForm" element={<PaymentForm />} />
        <Route exact path="/Diskus/Admin/" element={<AdminHome />}>
          <Route path="" element={<Summary />} />
          <Route path="AddUser" element={<AddUser />} />
          <Route path="EditUser" element={<EditUser />} />
          <Route path="Invoice" element={<Invoice />} />
          <Route path="PayOutstanding" element={<PayOutstanding />} />
          <Route path="PaymentHistory" element={<PaymentHistory />} />
          <Route path="Summary" element={<Summary />} />
          <Route path="Organization" element={<Organization />} />
          <Route path="AllMeeting" element={<AllMeeting />} />
          <Route path="CancelSub" element={<CancelSub />} />
          <Route path="PackageDetail" element={<PackageDetail />} />
          <Route path="setting" element={<Setting />} />
          <Route path="CustomerInformation" element={<CustomerInformation />} />
        </Route>
        <Route
          path="/updatePasswordSuccess"
          element={<PasswordUpdateMessage />}
        />
        <Route element={<PrivateRoutes />}>
          <Route exact path="/Diskus/" element={<Dashboard />}>
            <Route path="" element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="todolist" element={<TodoList />} />
            <Route path="forgotpassword" element={<Forgot />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="meeting" element={<Meeting />} />
            <Route path="videochat" element={<VideoChat />} />
            <Route path="setting" element={<Setting />} />
            <Route path="faq's" element={<Miscellaneous />} />
          </Route>
        </Route>
        {/* Routes for Admin Pages */}
        <Route element={<PrivateAdminRoute />}>
          <Route exact path="/Diskus/Admin/" element={<AdminHome />}>
            <Route path="" element={<Summary />} />
            <Route path="AddUser" element={<AddUser />} />
            <Route path="EditUser" element={<EditUser />} />
            <Route path="Invoice" element={<Invoice />} />
            <Route path="PayOutstanding" element={<PayOutstanding />} />
            <Route path="Summary" element={<Summary />} />
            <Route path="Organization" element={<Organization />} />
            <Route path="AllMeeting" element={<AllMeeting />} />
            <Route path="CancelSub" element={<CancelSub />} />
            <Route path="PackageDetail" element={<PackageDetail />} />
            <Route
              path="CustomerInformation"
              element={<CustomerInformation />}
            />
          </Route>
        </Route>
        {/* Private Route */}
        <Route element={<PrivateRoutes />}>
          <Route path="/onboard" element={<OnBoard />} />
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
