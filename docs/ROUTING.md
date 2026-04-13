# Routing Guide

## Router Type

Diskus uses **React Router v6** with `createBrowserRouter` (HTML5 history API). All routes are defined in `src/routes/routes.js`.

---

## Route Guards

### `PrivateRoutes` (`routes/private_routes.js`)
Protects all user routes under `/Diskus/`. Checks for a valid auth token in `localStorage`/`sessionStorage`. Redirects to `/` (login) if not authenticated.

### `PrivateAdminRoute` (`routes/privateadmin_routes.js`)
Protects all admin routes under `/Admin/`. Requires admin-level permissions in addition to authentication.

### `PrivateVideoMeeting` (`routes/PrivateVideoMeetingRoute.js`)
Protects the `/Diskus/video` route. Separate guard because video meetings may have a different token flow.

---

## Route Wrappers

### `RouteWrapperUser` (`routes/RouteWrapperUser.js`)
Wraps each user-facing route. Handles page-level concerns like document title, analytics, or layout injection.

### `RouteWrapperAdmin` (`routes/RouteWrapperAdmin.js`)
Same as above but for the admin section.

### `UserSettingsWrapper` (`routes/UserSettingsWrapper.js`)
Specific wrapper for the settings page — handles settings-specific layout or data preloading.

---

## Error Handling

Every route element is wrapped in an `<ErrorBoundary>`:

```jsx
<ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrors}>
  <YourComponent />
</ErrorBoundary>
```

- `ErrorFallback` — user-facing error UI (`components/elements/ErrorFallBack/index.jsx`)
- `logErrors` — logs error details (likely to an error tracking service)

---

## Full Route Table

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `UserManagementProcess` | Login page |
| `/Signup` | `SignupProcessUserManagement` | Registration flow |
| `/PakageDetailsUserManagement` | `PakageDetailsUserManagement` | Package selection (signup) |
| `/forgotpasswordVerification` | `ForgotPasswordVerification` | Password reset OTP |
| `/updatepassword` | `UpdatePasswordSuccessfully` | Password updated confirmation |
| `/updatePasswordSuccess` | `PasswordUpdateMessage` | Success message page |
| `/PaymentFormUserManagement` | `BillingMethodUsermanagement` | Billing info (signup) |
| `/onboard` | `OnBoard` | Post-signup onboarding |
| `/404` | `NotFound` | 404 error page |
| `*` | `NotFound` | Catch-all → 404 |
| `/GuestVideoCall` | `GuestVideoCall` | Unauthenticated guest video call |
| `/AlreadyInGroupAndOtoCall` | `AlreadyInGroupAndOtoCall` | Already-in-call blocker page |

### Private User Routes (under `/Diskus/`, requires auth)

| Path | Component | Description |
|------|-----------|-------------|
| `/Diskus/` | `NewDashobard` | Dashboard (default) |
| `/Diskus/home` | `NewDashobard` | Dashboard (alias) |
| `/Diskus/Minutes` | `MinutesFlow` | Meeting minutes workflow |
| `/Diskus/todolist` | `TodoList` | To-do list |
| `/Diskus/documentViewer` | `DocumentViewer` | Generic document viewer |
| `/Diskus/meetingDocumentViewer` | `MeetingDocumentViewer` | Document viewer in meeting context |
| `/Diskus/signatureviewer` | `SignatureViewer` | E-signature viewer (PDFTron) |
| `/Diskus/signeddocument` | `PendingSignature` | Pending signature documents |
| `/Diskus/viewSignDocument` | `ViewSignatureDocument` | View signed document |
| `/Diskus/calendar` | `CalendarPage` | Calendar |
| `/Diskus/Meeting` | `NewMeeting` | Meetings (with `NewMeetingContext`) |
| `/Diskus/Meeting/Useravailabilityformeeting` | `RSVP` | Meeting RSVP |
| `/Diskus/setting` | `UserSettingsWrapper` | User settings |
| `/Diskus/faq's` | `CustomMiscellaneous` | FAQ / miscellaneous |
| `/Diskus/groups` | `Groups` | Groups |
| `/Diskus/changePassword` | `ChangePassword` | Change password |
| `/Diskus/notes` | `Notes` | Notes |
| `/Diskus/committee` | `Committee` | Committees |
| `/Diskus/resolution` | `Resolution` | Resolutions |
| `/Diskus/dataroom` | `DataRoom` | Data room |
| `/Diskus/polling` | `Polling` | Polling |
| `/Diskus/compliance` | `MainCompliance` | Compliance (user) |

### Private Video Route

| Path | Component | Description |
|------|-----------|-------------|
| `/Diskus/video` | `VideoMeetingBoardDeck` | Video conference room |

### Private Admin Routes (under `/Admin/`, requires admin auth)

| Path | Component | Description |
|------|-----------|-------------|
| `/Admin/` | `ManageUsers` or `PayOutstanding` | Admin home (role-dependent) |
| `/Admin/manageAuthority` | `ManageAuthority` | Compliance authority management |
| `/Admin/generalSetting` | `GeneralSetting` | General compliance settings |
| `/Admin/ManageUsers` | `ManageUsers` | User management |
| `/Admin/AddUsers` | `AddUsers` | Add new users |
| `/Admin/AddUsersUsermanagement` | `AddUserMain` | Add users (UM flow) |
| `/Admin/UserLevelConfigUM` | `UserLevelConfigUM` | User-level configuration |
| `/Admin/OrganizationlevelConfigUM` | `OrganizationLevelConfigUM` | Org-level configuration |
| `/Admin/PakageDetailsUserManagement` | `PakageDetailsUserManagement` | Package details (UM) |
| `/Admin/PackageDetailsUserManagement` | `PakageDetailsAdmin` | Package details (admin) |
| `/Admin/PackageDetail` | `PackageDetails` | Package detail |
| `/Admin/PackageDetailUMupgrade` | `PakageDetailsUMUpgrade` | Package upgrade details (UM) |
| `/Admin/UpgradePackage` | `PackageUpgrade` | Upgrade package |
| `/Admin/UpgradePackageDetail` | `PackageUpgradeDetail` | Upgrade package detail |
| `/Admin/UpgradePackageSelect` | `PackageUpgradeSelect` | Select upgrade package |
| `/Admin/subscriptionDetailsUserManagement` | `SubscriptionDetailsUserManagement` | Subscription details |
| `/Admin/downgradeSubscription` | `DowngradeSubscription` | Downgrade subscription |
| `/Admin/updatedCancelSubscription` | `UpdatedCancelSubscription` | Updated cancel subscription |
| `/Admin/CancelSub` | `CancelSubs` | Cancel subscription |
| `/Admin/CancelSubscriptionUserManagement` | `CancelSubscriptionAdmin` | Cancel subscription (UM) |
| `/Admin/PaymentFormUserManagement` | `BillingMethodUsermanagement` | Payment form (UM) |
| `/Admin/PayOutstanding` | `PayOutstanding` | Pay outstanding balance |
| `/Admin/PaymentHistory` | `PaymentHistory` | Payment history |
| `/Admin/PaymentHistoryusermanagement` | `PaymentMethodBillInfo` | Payment history (UM) |
| `/Admin/Summary` | `Summary` | Billing summary |
| `/Admin/AllMeeting` | `AllMeetings` | All organization meetings |
| `/Admin/loginreport` | `Reports` | Login reports |
| `/Admin/AuditTrial` | `AuditTrial` | Audit trail |
| `/Admin/CustomerInformation` | `CustomerInformation` | Customer info |
| `/Admin/deleteorganization` | `DeleteOrganization` | Delete organization |
| `/Admin/deleteorganizationUserMangement` | `DeleteOrganizationAdmin` | Delete organization (UM) |
| `/Admin/paymentForm` | `PaymentForm2` | Payment form |
| `/Admin/changePassword` | `ChangePassword` | Change password (admin) |
| `/Admin/faq's` | `CustomMiscellaneous` | FAQ (admin) |
| `/Admin/EmptyState` | `EmptyState` | Empty state placeholder |

---

## Adding a New Route

1. Create your component in `src/container/<ModuleName>/`
2. Import it in `src/routes/routes.js`
3. Add the route inside the appropriate guard wrapper (`PrivateRoutes`, `PrivateAdminRoute`, or public)
4. Wrap with `<ErrorBoundary>` and `<RouteWrapperUser>` / `<RouteWrapperAdmin>`

Example:

```jsx
<Route
  path="myFeature"
  element={
    <RouteWrapperUser name="myFeature">
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrors}>
        <MyFeatureComponent />
      </ErrorBoundary>
    </RouteWrapperUser>
  }
/>
```
