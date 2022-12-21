import { DiskusLinks } from "./links";
import {
  CustomMiscellaneous,
  TodoList,
  Meeting,
  CustomCalendar,
  CustomSetting,
  Home,
} from "../container";
// import { TodoList } from "../container/pages/todolist/Todolist";
// import { Meeting } from "../container/pages/meeting/Meeting";
// import { CustomSetting } from "../container/setting";

const dashBoardLinks = [
  { component: Meeting, path: "/meeting" },
  { component: TodoList, path: "/todolist" },
  { component: CustomCalendar, path: "/calendar" },
  { component: CustomMiscellaneous, path: "/faq's" },
  { component: CustomSetting, path: "/settings" },
  { component: Home, path: "/home" },
];

const UserSelection = (token, role, title) => {
  // let SidebarData = DiskusLinks;
  // let MainMenu = DiskusRoute;
  let Title = title;
  let UserRoleId = role;
  let SidebarData = DiskusLinks;
  let MainMenu = dashBoardLinks;
  let Notification = true;
  return {
    SidebarData,
    MainMenu,
    Notification,
    UserRoleId,
    Title,
  };
};

export { UserSelection };
