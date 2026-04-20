/**
 * @file privateadmin_routes.js
 * @description Route guard for all admin pages (`/Admin/*`).
 *
 * Auth logic:
 *  - `roleID` must be `"4"` (organisation admin) or `"1"` (super-admin).
 *  - `blur` must be `null` (active, non-blurred account).
 *  - `token` must be a truthy JSON-parsed value.
 *  - `twoFaAproval` — if 2-FA is enabled (`2fa === true`), the `TowApproval`
 *    flag must also be `true`; if 2-FA is not configured the gate passes.
 *
 * When all conditions are met renders `<Outlet />`, otherwise redirects to `*`.
 */
import { Navigate, Outlet } from "react-router-dom";

/**
 * Route guard component for admin-only routes.
 *
 * Checks role, token, and optional two-factor approval before rendering the
 * admin outlet.
 *
 * @returns {JSX.Element} `<Outlet />` when authorised, or `<Navigate to="*" />`.
 */
const PrivateAdminRoute = () => {
  let Blur = localStorage.getItem("blur");
  let RoleID = localStorage.getItem("roleID");
  const token = JSON.parse(localStorage.getItem("token"));
  const currentUser=(
    (RoleID === "4" || RoleID === "1") && Blur === null ? true : null
  );
  let TwoFA = JSON.parse(localStorage.getItem("2fa"));
  let TowApproval = JSON.parse(localStorage.getItem("TowApproval"));
  const twoFaAproval =
    TwoFA !== undefined &&
    TwoFA != null &&
    TwoFA === true &&
    TowApproval !== undefined &&
    TowApproval != null &&
    TowApproval === true
      ? true
      : (TwoFA === undefined || TwoFA === null) &&
        (TowApproval === undefined || TowApproval === null)
      ? true
      : false;
  return currentUser && token && twoFaAproval ? (
    <Outlet />
  ) : (
    <Navigate to="*" />
  );
};

export default PrivateAdminRoute;
