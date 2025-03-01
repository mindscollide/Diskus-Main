import { Navigate, Outlet } from "react-router-dom";

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
