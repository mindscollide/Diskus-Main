import {
  Route,
  createRoutesFromElements,
  createHashRouter,
} from "react-router-dom";
import { getLocalStorageItemNonActiveCheck } from "../commen/functions/utils";
import React, { lazy, Suspense } from "react";
import { Loader } from "../components/elements/index.js";
const PrivateAdminRoute = lazy(() => import("./privateadmin_routes"));
const PrivateRoutes = lazy(() => import("./private_routes"));
const SignatureViewer = lazy(() =>
  import(
    "../container/DataRoom/SignatureFlow/signaturewebviewer/signatureviewer"
  )
);
const PendingSignature = lazy(() =>
  import(
    "../container/DataRoom/SignatureFlow/pendingSignature/pendingSignatrue"
  )
);
const ViewSignatureDocument = lazy(() =>
  import(
    "../container/DataRoom/SignatureFlow/ViewSIgnatureDocument/ViewSignatureDocument"
  )
);
const RouteWrapperUser = lazy(() => import("./RouteWrapperUser"));
const RouteWrapperAdmin = lazy(() => import("./RouteWrapperAdmin"));
const NewDashobard = lazy(() =>
  import("../container/NewDashboardLayout/NewDashobard")
);
const SubscriptionDetailsUserManagement = lazy(() =>
  import(
    "../container/pages/UserMangement/AdminUserManagement/SubscriptionDetailsUserManagement/SubscriptionDetailsUserManagement"
  )
);
const DowngradeSubscription = lazy(() =>
  import(
    "../container/pages/UserMangement/AdminUserManagement/SubscriptionDetailsUserManagement/DowngradeSubscription/DowngradeSubscription"
  )
);
const UpdatedCancelSubscription = lazy(() =>
  import(
    "../container/pages/UserMangement/AdminUserManagement/UpdatedCancelSubscription/UpdatedCancelSubscription"
  )
);
const PrivateVideoMeeting = lazy(() => import("./PrivateVideoMeetingRoute"));
const VideoMeetingBoardDeck = lazy(() =>
  import("../container/VideoMeetingBoardDeck/VideoMeetingBoardDeck")
);
const DocumentViewer = lazy(() =>
  import("../components/elements/webviewer/DocumentViewer")
);
const GuestVideoCall = lazy(() =>
  import("../components/layout/talk/GuestVideo/GuestVideoCall/GuestVideoCall")
);

// Lazy load components
const ChangePassword = lazy(() =>
  import("../container/Admin/ChangePassword/ChangePassword.js")
);
const CustomMiscellaneous = lazy(() =>
  import("../container/miscellaneous/Miscellaneous.js")
);
const Dashboard = lazy(() => import("../container/dashboard/Dashboard.js"));
const DeleteOrganization = lazy(() =>
  import(
    "../container/Admin/Subscriptions/DeleteOrganization/DeleteOrganization.js"
  )
);
const NotFound = lazy(() => import("../container/page_404/Page_404.js"));
const OnBoard = lazy(() => import("../container/pages/onBoard/OnBoard.js"));
const TodoList = lazy(() => import("../container/pages/todolist/Todolist.js"));
const PaymentHistory = lazy(() =>
  import("../container/Admin/BillingInfo/PaymentHistory/PaymentHistory.js")
);
const PayOutstanding = lazy(() =>
  import("../container/Admin/BillingInfo/PayOutstanding/PayOutstanding.js")
);
const Summary = lazy(() =>
  import("../container/Admin/BillingInfo/Summary/Summary.js")
);
const CustomerInformation = lazy(() =>
  import(
    "../container/Admin/CustomerInfo/CustomerInformation/CustomerInformation.js"
  )
);
const AdminHome = lazy(() => import("../container/Admin/Main/AdminHome.js"));
const Groups = lazy(() => import("../container/Groups/Groups.js"));
const AllMeetings = lazy(() =>
  import("../container/Admin/Meetings/AllMeeting/AllMeetings.js")
);
const CancelSubs = lazy(() =>
  import("../container/Admin/Subscriptions/CancelSub/CancelSubs.js")
);
const PackageDetails = lazy(() =>
  import("../container/Admin/Subscriptions/PackageDetail/PackageDetails.js")
);
const PackageUpgrade = lazy(() =>
  import("../container/Admin/Subscriptions/PackageUpgrade/PackageUpgrade.js")
);
const PackageUpgradeDetail = lazy(() =>
  import(
    "../container/Admin/Subscriptions/PackageUpgradeDetail/PackageUpgradeDetail.js"
  )
);
const PackageUpgradeSelect = lazy(() =>
  import(
    "../container/Admin/Subscriptions/PackageUpgradeSelected/PackageUpgradeSelect.js"
  )
);
const PasswordUpdateMessage = lazy(() =>
  import(
    "../container/authentication/password_update_message/Password_Update_Message.js"
  )
);
const Notes = lazy(() => import("../container/notes/Notes.js"));
const CalendarPage = lazy(() =>
  import("../container/calendarpage/CalendarPage.js")
);
const ForgotPasswordVerification = lazy(() =>
  import(
    "../container/authentication/ForgotpasswordVerification/ForgotPasswordVerification.js"
  )
);
const UpdatePasswordSuccessfully = lazy(() =>
  import(
    "../container/authentication/UpdatedPasswordSuccessfully/UpdatePasswordSuccessfully.js"
  )
);
const Committee = lazy(() => import("../container/Committee/Committee.js"));
const Resolution = lazy(() => import("../container/Resolution/Resolution.js"));
const DataRoom = lazy(() => import("../container/DataRoom/DataRoom.js"));
const Polling = lazy(() => import("../container/Polling/Polling.js"));
const PaymentForm2 = lazy(() =>
  import("../container/Admin/Subscriptions/PaymentForm2/PaymentForm2.js")
);
const NewMeeting = lazy(() =>
  import("../container/pages/meeting/MeetingTwo.js")
);
const UserSettings = lazy(() =>
  import("../container/setting/UserLevelSettings/UserSettings.js")
);
const EmptyState = lazy(() =>
  import(
    "../container/Admin/Subscriptions/PackageDetail/EmptyStatePage/EmptyState.js"
  )
);
const RSVP = lazy(() => import("../container/pages/meeting/RSVP.js"));
const MinutesFlow = lazy(() => import("../container/MinutesNewFlow/Main.js"));
const UserManagementProcess = lazy(() =>
  import("../container/pages/UserManagementProcess/UserManagementProcess.js")
);
const SignupProcessUserManagement = lazy(() =>
  import(
    "../container/pages/SignUpProcessUserManagement/SignupProcessUserManagement.js"
  )
);
const PakageDetailsUserManagement = lazy(() =>
  import(
    "../container/pages/UserMangement/PakageDetailsUserManagement/PakageDetailsUserManagement.js"
  )
);
const BillingMethodUsermanagement = lazy(() =>
  import(
    "../container/pages/UserMangement/BillingMethodUserManagement/BillingMethodUsermanagement.js"
  )
);
const ManageUsers = lazy(() =>
  import(
    "../container/pages/UserMangement/AdminUserManagement/ManageUsers/ManageUsers"
  )
);
const Reports = lazy(() => import("../container/Admin/Reports/Reports.js"));
const PakageDetailsUMUpgrade = lazy(() =>
  import(
    "../container/pages/UserMangement/AdminUserManagement/PackageDetailsUMUpgrade/PackageDetailsUMUpgrade.js"
  )
);
const AddUsers = lazy(() =>
  import(
    "../container/pages/UserMangement/AdminUserManagement/AddUsers/AddUsers.js"
  )
);
const UserLevelConfigUM = lazy(() =>
  import(
    "../container/pages/UserMangement/UserLevelConfigUM/UserLevelConfigUM.js"
  )
);
const AddUserMain = lazy(() =>
  import(
    "../container/pages/UserMangement/AdminUserManagement/AddUserMain/AddUserMain.js"
  )
);
const PaymentMethodBillInfo = lazy(() =>
  import(
    "../container/pages/UserMangement/AdminUserManagement/PaymentMethodBillInfoUserManagement/PaymentMethodBillInfo.js"
  )
);
const OrganizationLevelConfigUM = lazy(() =>
  import(
    "../container/pages/UserMangement/OrganziationLevelConfigUM/OrganizationLevelConfigUM.js"
  )
);
const CancelSubscriptionAdmin = lazy(() =>
  import(
    "../container/pages/UserMangement/AdminUserManagement/CancelSubscriptionAdmin/CancelSubscriptionAdmin.js"
  )
);
const PakageDetailsAdmin = lazy(() =>
  import(
    "../container/pages/UserMangement/AdminUserManagement/PakageDetailsAdmin/PakageDetailsAdmin.js"
  )
);
const DeleteOrganizationAdmin = lazy(() =>
  import(
    "../container/pages/UserMangement/AdminUserManagement/DeleteOrganizationAdmin/DeleteOrganizationAdmin.js"
  )
);

const roleRoute = getLocalStorageItemNonActiveCheck("VERIFICATION");

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      {/* Video Meeting Route */}
      <Route element={<PrivateVideoMeeting />}>
        <Route
          path="/Diskus/video"
          element={
            <Suspense fallback={<Loader />}>
              <VideoMeetingBoardDeck />
            </Suspense>
          }
        />
      </Route>
        <Route
          path="/GuestVideoCall"
          element={
            <Suspense fallback={<Loader />}>
              <GuestVideoCall />
            </Suspense>
          }
        />
      {/* for all login Routes  */}
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader />}>
            <UserManagementProcess />
          </Suspense>
        }
      />
      {/* For All Signup Route */}
      <Route
        path="/Signup"
        element={
          <Suspense fallback={<Loader />}>
            <SignupProcessUserManagement />
          </Suspense>
        }
      />
      {/* ============================================================ */}
      <Route
        path="/PakageDetailsUserManagement"
        element={
          <Suspense fallback={<Loader />}>
            <PakageDetailsUserManagement />
          </Suspense>
        }
      />
      {/* <Route path="/signuporganization" element={<Signup />} /> */}
      <Route
        path="/forgotpasswordVerification"
        element={
          <Suspense fallback={<Loader />}>
            <ForgotPasswordVerification />
          </Suspense>
        }
      />
      <Route
        path="/updatepassword"
        element={
          <Suspense fallback={<Loader />}>
            <UpdatePasswordSuccessfully />
          </Suspense>
        }
      />
      Ï
      <Route
        path="/PaymentFormUserManagement"
        element={
          <Suspense fallback={<Loader />}>
            <BillingMethodUsermanagement />
          </Suspense>
        }
      />
      <Route
        path="/updatePasswordSuccess"
        element={
          <Suspense fallback={<Loader />}>
            <PasswordUpdateMessage />
          </Suspense>
        }
      />
      <Route
        path="/404"
        element={
          <Suspense fallback={<Loader />}>
            <NotFound />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={<Loader />}>
            <NotFound />
          </Suspense>
        }
      />
      {/* ============================================================ */}
      <Route element={<PrivateRoutes />}>
        <Route
          exact
          path="/Diskus/"
          element={
            <Suspense fallback={<Loader />}>
              <RouteWrapperUser name="Diskus">
                <Dashboard />
              </RouteWrapperUser>
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="">
                  <NewDashobard />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="Minutes"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="Minutes">
                  <MinutesFlow />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="home"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="home">
                  <NewDashobard />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="Minutes"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="Minutes">
                  <MinutesFlow />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="todolist"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="todolist">
                  <TodoList />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="documentViewer"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="documentViewer">
                  <DocumentViewer />
                </RouteWrapperUser>
              </Suspense>
            }
          />

          <Route
            path="signatureviewer"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="signatureviewer">
                  <SignatureViewer />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="signeddocument"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="signatureviewer">
                  <PendingSignature />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="viewSignDocument"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="signatureviewer">
                  <ViewSignatureDocument />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          {/* <Route path="forgotpassword" element={<ForgotPassword />} /> */}
          <Route
            path="calendar"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="calendar">
                  <CalendarPage />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="Meeting"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="Meeting">
                  <NewMeeting />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="Meeting/Useravailabilityformeeting"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="Meeting">
                  <RSVP />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="setting"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="setting">
                  <UserSettings />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="faq's"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="faq's">
                  <CustomMiscellaneous />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="groups"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="groups">
                  <Groups />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="changePassword"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="changePassword">
                  <ChangePassword />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="notes"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="notes">
                  <Notes />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="committee"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="committee">
                  <Committee />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="resolution"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="resolution">
                  <Resolution />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="dataroom"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="dataroom">
                  <DataRoom />
                </RouteWrapperUser>
              </Suspense>
            }
          />
          <Route
            path="polling"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperUser name="polling">
                  <Polling />
                </RouteWrapperUser>
              </Suspense>
            }
          />
        </Route>
      </Route>
      <Route element={<PrivateAdminRoute />}>
        <Route
          exact
          path="/Admin/"
          element={
            <Suspense fallback={<Loader />}>
              <RouteWrapperAdmin name="Admin">
                <AdminHome />
              </RouteWrapperAdmin>
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="Admin">
                  {roleRoute ? <PayOutstanding /> : <ManageUsers />}
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="PaymentFormUserManagement"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="PaymentFormUserManagement">
                  <BillingMethodUsermanagement />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          {/* Route For Payment Processs end */}

          <Route
            path="PakageDetailsUserManagement"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="PakageDetailsUserManagement">
                  <PakageDetailsUserManagement />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="loginreport"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="loginreport">
                  <Reports />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="PackageDetailUMupgrade"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="PackageDetailUMupgrade">
                  <PakageDetailsUMUpgrade />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />

          <Route
            path="AddUsers"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="AddUsers">
                  <AddUsers />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="ManageUsers"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="ManageUsers">
                  <ManageUsers />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="UserLevelConfigUM"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="UserLevelConfigUM">
                  <UserLevelConfigUM />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="AddUsersUsermanagement"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="AddUsersUsermanagement">
                  <AddUserMain />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="PayOutstanding"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="PayOutstanding">
                  <PayOutstanding />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="PaymentHistory"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="PaymentHistory">
                  <PaymentHistory />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="PaymentHistoryusermanagement"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="PaymentHistoryusermanagement">
                  <PaymentMethodBillInfo />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="Summary"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="Summary">
                  <Summary />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="OrganizationlevelConfigUM"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="OrganizationlevelConfigUM">
                  <OrganizationLevelConfigUM />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="AllMeeting"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="AllMeeting">
                  <AllMeetings />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="CancelSub"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="CancelSub">
                  <CancelSubs />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="CancelSubscriptionUserManagement"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="CancelSubscriptionUserManagement">
                  <CancelSubscriptionAdmin />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="PackageDetail"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="PackageDetail">
                  <PackageDetails />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="PackageDetailsUserManagement"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="PackageDetailsUserManagement">
                  <PakageDetailsAdmin />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="subscriptionDetailsUserManagement"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="subscriptionDetailsUserManagement">
                  <SubscriptionDetailsUserManagement />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="downgradeSubscription"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="downgradeSubscription">
                  <DowngradeSubscription />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="updatedCancelSubscription"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="updatedCancelSubscription">
                  <UpdatedCancelSubscription />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="EmptyState"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="EmptyState">
                  <EmptyState />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="UpgradePackage"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="UpgradePackage">
                  <PackageUpgrade />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="changePassword"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="changePassword">
                  <ChangePassword />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="faq's"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="faq's">
                  <CustomMiscellaneous />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="deleteorganization"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="deleteorganization">
                  <DeleteOrganization />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="deleteorganizationUserMangement"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="deleteorganizationUserMangement">
                  <DeleteOrganizationAdmin />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="paymentForm"
            element={
              <Suspense fallback={<Loader />}>
                <RouteWrapperAdmin name="paymentForm">
                  <PaymentForm2 />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="UpgradePackageDetail"
            element={
              <Suspense fallback={<Loader />}>
                {" "}
                <RouteWrapperAdmin name="UpgradePackageDetail">
                  <PackageUpgradeDetail />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="UpgradePackageSelect"
            element={
              <Suspense fallback={<Loader />}>
                {" "}
                <RouteWrapperAdmin name="UpgradePackageSelect">
                  <PackageUpgradeSelect />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
          <Route
            path="CustomerInformation"
            element={
              <Suspense fallback={<Loader />}>
                {" "}
                <RouteWrapperAdmin name="CustomerInformation">
                  <CustomerInformation />
                </RouteWrapperAdmin>
              </Suspense>
            }
          />
        </Route>
      </Route>
      <Route
        Route
        element={
          <Suspense fallback={<Loader />}>
            <PrivateRoutes />
          </Suspense>
        }
      >
        <Route
          path="/onboard"
          element={
            <Suspense fallback={<Loader />}>
              <OnBoard />
            </Suspense>
          }
        />
      </Route>
    </>
  )
);
