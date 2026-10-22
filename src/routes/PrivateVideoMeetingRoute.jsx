import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateVideoMeeting = () => {
  const location = useLocation();
  let checkisVideo = location.pathname.includes("/Diskus/video");
  return checkisVideo ? <Outlet /> : <Navigate to={"*"} />;
};
export default PrivateVideoMeeting;
