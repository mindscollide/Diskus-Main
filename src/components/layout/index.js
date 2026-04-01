/**
 * @module layout
 * @description Barrel export for all top-level layout components used to
 * compose the main application shell, including the sidebar navigation,
 * top navbar, real-time Talk (messaging/video) panel, and the web
 * notification system.
 */
import Sidebar from "./sidebar/Sidebar";
import NavbarAdmin from "./navbar/Navbar";
import Talk from "./talk/Talk";
import WebNotification from "./WebNotfication/WebNotfication";
export { Sidebar, NavbarAdmin, Talk, WebNotification };
