import { Navigate, Outlet } from "react-router-dom";

const PrivateAdminRoute = () => {
  const blur = localStorage.getItem("blur");
  const roleID = localStorage.getItem("roleID");

  const token = JSON.parse(localStorage.getItem("token"));

  const twoFA = JSON.parse(localStorage.getItem("2fa"));
  const twoApproval = JSON.parse(localStorage.getItem("TowApproval"));

  const currentUser =
    (roleID === "4" || roleID === "1") && blur === null;

  const twoFaApproval =
    (twoFA === true && twoApproval === true) ||
    (twoFA === null && twoApproval === null);

  return currentUser && token && twoFaApproval ? (
    <Outlet />
  ) : (
    <Navigate to="*" replace />
  );
};

export default PrivateAdminRoute;