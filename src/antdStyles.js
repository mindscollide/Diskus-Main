// Ant Design styles, only for the components the app uses.
//
// This replaces `import "antd/dist/antd.min.css"` (the stylesheet of ALL antd
// components, ~590 KB) that Time_picker, CommitteeTodo, ViewGroupTodo and Todolist
// used to import. Each "<component>/style/css" also pulls in its own style
// dependencies (Table -> Pagination, Select, Dropdown, ...) and antd's base styles.
//
// When a component from "antd" is used for the first time, add its style here.
import "antd/es/breadcrumb/style/css";
import "antd/es/button/style/css";
import "antd/es/checkbox/style/css";
import "antd/es/collapse/style/css";
import "antd/es/config-provider/style/css";
import "antd/es/date-picker/style/css";
import "antd/es/dropdown/style/css";
import "antd/es/grid/style/css"; // Row, Col
import "antd/es/input/style/css";
import "antd/es/layout/style/css";
import "antd/es/menu/style/css";
import "antd/es/message/style/css";
import "antd/es/notification/style/css";
import "antd/es/pagination/style/css";
import "antd/es/popover/style/css";
import "antd/es/progress/style/css";
import "antd/es/radio/style/css";
import "antd/es/result/style/css";
import "antd/es/select/style/css";
import "antd/es/space/style/css";
import "antd/es/spin/style/css";
import "antd/es/switch/style/css";
import "antd/es/table/style/css";
import "antd/es/tag/style/css";
import "antd/es/time-picker/style/css";
import "antd/es/tooltip/style/css";
import "antd/es/typography/style/css";
import "antd/es/upload/style/css";
