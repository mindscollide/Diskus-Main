/**
 * @file PrivateVideoMeetingRoute.js
 * @description Lightweight route guard for the in-meeting board-deck view
 * (`/Diskus/video`).
 *
 * Unlike the standard auth guards, this one does **not** check tokens or roles.
 * It simply verifies that the current pathname contains `/Diskus/video` before
 * allowing access — preventing accidental direct navigation to the video deck
 * from unrelated paths.
 *
 * This is intentionally permissive: the actual session credentials are
 * validated at a deeper level inside `VideoMeetingBoardDeck`.
 */
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Route guard that allows rendering only when the pathname includes
 * `/Diskus/video`.
 *
 * @returns {JSX.Element} `<Outlet />` when the path matches, otherwise
 *   `<Navigate to="*" />`.
 */
const PrivateVideoMeeting = () => {
  const location = useLocation();
  let checkisVideo = location.pathname.includes("/Diskus/video");
  return checkisVideo ? <Outlet /> : <Navigate to={"*"} />;
};
export default PrivateVideoMeeting;
