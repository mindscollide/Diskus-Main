/**
 * TodoList.jsx
 * ============
 * Displays and manages the authenticated user's task (to-do) list.
 *
 * Features
 * ─────────
 * - View, create, update and soft-delete tasks
 * - Search tasks by date, title, and assigned-to name
 * - Filter visible rows by status via a dropdown
 * - Sort by title, assigned-by, assigned-to, or deadline
 * - Pagination with page/size persisted in localStorage
 * - Real-time row updates via Redux-bound socket events
 * - Full i18n support (English / Arabic)
 *
 * TODO — replace mock dispatches with real API calls
 * ──────────────────────────────────────────────────
 * - SearchTodoListApi      → GET  /api/todos?page=&size=&title=&...
 * - ViewToDoList           → GET  /api/todos/:id
 * - saveTaskDocumentsApi   → DELETE /api/todos/:id  (status = 6 path)
 * - validateEncrypted*Api  → GET  /api/auth/validate-link
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {
  ArrowCounterclockwise,
  CalendarFill,
  ChevronDown,
  Plus,
  Search,
  ArrowRight,
} from "react-bootstrap-icons";
import { Checkbox, Dropdown, Menu, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DatePicker from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import gregorian_ar from "react-date-object/locales/gregorian_ar";

import {
  Button,
  TableToDo,
  TextField,
  Notification,
} from "../../../components/elements";
import {
  ViewToDoList,
  SearchTodoListApi,
  saveTaskDocumentsApi,
  validateEncryptedStringViewTaskDetailLinkApi,
  validateEncryptedStringViewTaskListLinkApi,
} from "../../../store/actions/ToDoList_action";
import {
  cleareMessage,
  getTodoStatus,
  updateTodoStatusFunc,
} from "../../../store/actions/GetTodos";
import {
  multiDatePickerDateChangIntoUTC,
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";
import { sortTasksByDeadline } from "../../../commen/functions/utils";
import { showMessage } from "../../../components/elements/snack_bar/utill";
import CustomPagination from "../../../commen/functions/customPagination/Paginations";

import ModalToDoList from "../../todolistModal/ModalToDoList";
import ModalViewToDo from "../../todolistviewModal/ModalViewToDo";
import ModalUpdateToDo from "../../todolistupdateModal/ModalUpdateToDo";

import TodoMessageIcon1 from "../../../assets/images/Todomsg-1.png";
import del from "../../../assets/images/del.png";
import DescendIcon from "../../../assets/images/sortingIcons/SorterIconDescend.png";
import AscendIcon from "../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowDownIcon from "../../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../../assets/images/sortingIcons/Arrow-up.png";

import "antd/dist/antd.min.css";
import "./Todolist.css";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_SEARCH = { Date: "", Title: "", AssignedToName: "", UserID: 0 };
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 15;

/** Maps status ID → CSS class name for both the Select and plain-text renders */
const STATUS_CLASS_MAP = {
  1: "InProgress",
  2: "Pending",
  3: "Upcoming",
  4: "Cancelled",
  5: "Completed",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Reads a persisted pagination value from localStorage with a safe fallback */
const getStoredPage = () =>
  Number(localStorage.getItem("todoListPage")) || DEFAULT_PAGE;
const getStoredSize = () =>
  Number(localStorage.getItem("todoListRow")) || DEFAULT_PAGE_SIZE;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const TodoList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const datePickerRef = useRef(null);

  /** Authenticated user ID — stable for the session */
  const creatorID = Number(localStorage.getItem("userID"));

  /** Active language — drives date-picker locale and column rendering */
  const currentLanguage = localStorage.getItem("i18nextLng") ?? "en";

  /** Date-picker locale object derived from language; not stored in state */
  const locale = currentLanguage === "ar" ? gregorian_ar : gregorian_en;

  // ── Redux selectors ──────────────────────────────────────────────────────
  const SearchTodolist = useSelector((s) => s.toDoListReducer.SearchTodolist);
  const SocketTodoActivityData = useSelector(
    (s) => s.toDoListReducer.SocketTodoActivityData,
  );
  const socketTodoStatusData = useSelector(
    (s) => s.toDoListReducer.socketTodoStatusData,
  );
  const ToDoDetails = useSelector((s) => s.toDoListReducer.ToDoDetails);
  const ResponseStatusReducer = useSelector((s) => s.todoStatus.Response);
  const UpdateTodoStatusMessage = useSelector(
    (s) => s.getTodosStatus.UpdateTodoStatusMessage,
  );
  const ResponseMessageTodoStatusReducer = useSelector(
    (s) => s.getTodosStatus.ResponseMessage,
  );
  const UpdateTodoStatus = useSelector(
    (s) => s.getTodosStatus.UpdateTodoStatus,
  );

  // ── UI state ─────────────────────────────────────────────────────────────
  const [isExpand, setExpand] = useState(false);
  const [show, setShow] = useState(false); // create-task modal
  const [viewFlagToDo, setViewFlagToDo] = useState(false);
  const [updateFlagToDo, setUpdateFlagToDo] = useState(false);
  /** Set true so the next ToDoDetails change triggers the update modal */
  const [pendingUpdate, setPendingUpdate] = useState(false);

  // ── Snack-bar notification ───────────────────────────────────────────────
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // ── Table data ───────────────────────────────────────────────────────────
  const [rowsToDo, setRowToDo] = useState([]);
  /** Unfiltered snapshot used as the source for the status filter */
  const [originalData, setOriginalData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  // ── Search form ──────────────────────────────────────────────────────────
  const [searchData, setSearchData] = useState(EMPTY_SEARCH);

  // ── Status dropdown filter ───────────────────────────────────────────────
  const [statusOptions, setStatusOptions] = useState([]);
  /**
   * Sparse array where index === pK_TSID → status label string.
   * Used by the socket effect to label incoming status updates.
   */
  const [statusValues, setStatusValues] = useState([]);
  const [selectedValues, setSelectedValues] = useState(["1", "2", "4", "5"]);
  const [filterVisible, setFilterVisible] = useState(false);

  // ── Column sort indicators ───────────────────────────────────────────────
  const [taskTitleSort, setTaskTitleSort] = useState(null);
  const [taskAssignedBySort, setTaskAssignedBySort] = useState(null);
  const [taskAssignedToSort, setTaskAssignedToSort] = useState(null);
  const [taskDeadlineSort, setDeadlineSort] = useState(null);

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECT: Initial load
  // Fetches status lookup data and the first page of todos.
  // Also handles deep-link query params stored in localStorage by the router.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true; // prevents state updates after unmount

    const savedPage = getStoredPage();
    const savedSize = getStoredSize();
    localStorage.setItem("todoListPage", savedPage);
    localStorage.setItem("todoListRow", savedSize);

    // Fetch status options only when not already in Redux
    if (!ResponseStatusReducer?.length) {
      dispatch(getTodoStatus(navigate, t));
    }

    dispatch(SearchTodoListApi(navigate, searchData, savedPage, savedSize, t));

    // Deep-link: open a specific task's detail view
    const taskViewId = localStorage.getItem("taskListView_Id");
    if (taskViewId) {
      (async () => {
        const res = await dispatch(
          validateEncryptedStringViewTaskDetailLinkApi(taskViewId, navigate, t),
        );
        if (mounted && res?.isExecuted && res?.responseCode === 1) {
          dispatch(
            ViewToDoList(
              navigate,
              { ToDoListID: res.response.taskID },
              t,
              setViewFlagToDo,
            ),
          );
        }
        localStorage.removeItem("taskListView_Id");
      })();
    }

    // Deep-link: validate a task-list share link (validation only, no UI change)
    const taskListLink = localStorage.getItem("taskListView");
    if (taskListLink) {
      (async () => {
        await dispatch(
          validateEncryptedStringViewTaskListLinkApi(taskListLink, navigate, t),
        );
        localStorage.removeItem("taskListView");
      })();
    }

    return () => {
      // ── Unmount cleanup ────────────────────────────────────────────────
      // Prevents:
      //   • setState calls on an unmounted component (memory leak)
      //   • Stale data flashing on the next mount (e.g. navigating away
      //     and back shows the previous search results for a frame)
      //   • Stale pagination position being restored from localStorage
      //     when the user returns to the page intentionally fresh

      mounted = false;

      // Remove persisted pagination so the next mount starts from page 1
      localStorage.removeItem("todoListPage");
      localStorage.removeItem("todoListRow");

      // Reset all local component state so re-mounting is always clean
      setRowToDo([]);
      setOriginalData([]);
      setTotalRecords(0);
      setSearchData(EMPTY_SEARCH);
      setStatusOptions([]);
      setStatusValues([]);
      setSelectedValues(["1", "2", "4", "5"]);
      setFilterVisible(false);
      setExpand(false);
      setShow(false);
      setViewFlagToDo(false);
      setUpdateFlagToDo(false);
      setPendingUpdate(false);
      setOpen({ open: false, message: "", severity: "error" });
      setTaskTitleSort(null);
      setTaskAssignedBySort(null);
      setTaskAssignedToSort(null);
      setDeadlineSort(null);

      // Clear any pending Redux notification messages so they don't
      // re-trigger the snack-bar effect on the next mount
      dispatch(cleareMessage());

      // TODO: dispatch(clearTodoList()) — add a Redux action that resets
      // SearchTodolist, ToDoDetails, SocketTodoActivityData, and
      // socketTodoStatusData back to their initial state so the next
      // mount always fetches fresh data from the server.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once on mount

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECT: Sync table rows when API data arrives
  // FIX: original code spread into `dataToSort` then called `.sort()` which
  // mutates in place, making `dataToSort` and `sortedTasks` the same reference.
  // Both `rowsToDo` and `originalData` ended up with identical sorted data.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!SearchTodolist) {
      setRowToDo([]);
      return;
    }

    setTotalRecords(SearchTodolist.totalRecords ?? 0);

    if (SearchTodolist.toDoLists?.length > 0) {
      // Spread first to avoid mutating the Redux payload, then sort
      const sorted = [...SearchTodolist.toDoLists].sort(
        (a, b) =>
          parseInt(b.deadlineDateTime, 10) - parseInt(a.deadlineDateTime, 10),
      );
      setRowToDo(sorted);
      setOriginalData(sorted);
    } else {
      setRowToDo([]);
      setOriginalData([]);
    }
  }, [SearchTodolist]);

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECT: Real-time — prepend new standalone task pushed via socket
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!SocketTodoActivityData) return;

    const { comitteeID, groupID, meetingID, todoList } = SocketTodoActivityData;

    // Only handle tasks not tied to a committee, group, or meeting
    if (comitteeID === -1 && groupID === -1 && meetingID === -1) {
      setRowToDo((prev) => [todoList, ...sortTasksByDeadline(prev)]);
    }
  }, [SocketTodoActivityData]);

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECT: Real-time — update or remove a row when its status changes via socket
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socketTodoStatusData) return;

    const { todoStatusID, todoid } = socketTodoStatusData;

    setRowToDo((prev) => {
      // Status 6 = deleted — remove from list entirely
      if (Number(todoStatusID) === 6) {
        return prev.filter((item) => item.pK_TID !== todoid);
      }
      // Otherwise patch the matching row's status object in place
      return prev.map((item) =>
        item.pK_TID === todoid
          ? {
              ...item,
              status: {
                pK_TSID: todoStatusID,
                status: statusValues[todoStatusID],
              },
            }
          : item,
      );
    });
  }, [socketTodoStatusData, statusValues]);

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECT: Build status select options from the Redux status lookup
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ResponseStatusReducer?.length) return;

    const options = [];
    const indexMap = [""]; // slot 0 unused; pK_TSID maps directly to label

    ResponseStatusReducer.forEach(({ pK_TSID, status }) => {
      indexMap[pK_TSID] = status; // keep full map for socket updates
      // Exclude 3 (Upcoming) and 6 (Deleted) from the editable dropdown
      if (pK_TSID !== 3 && pK_TSID !== 6) {
        options.push({ id: pK_TSID, status });
      }
    });

    setStatusOptions(options);
    setStatusValues(indexMap);
  }, [ResponseStatusReducer]);

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECT: Open the update modal once ToDoDetails loads after an edit intent
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ToDoDetails || !Object.keys(ToDoDetails).length) return;

    setViewFlagToDo(false);
    if (pendingUpdate) {
      setUpdateFlagToDo(true);
      setPendingUpdate(false);
    }
  }, [ToDoDetails, pendingUpdate]);

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECT: Show snack-bar notification for status update messages
  // FIX: original code had triple-redundant !== "" checks and three separate
  // if/else branches for the same showMessage call.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const noRecord = t("No-records-found");
    const msg =
      ResponseMessageTodoStatusReducer ||
      UpdateTodoStatusMessage ||
      UpdateTodoStatus;

    if (msg && msg !== noRecord) {
      showMessage(msg, "success", setOpen);
    }
    dispatch(cleareMessage());
  }, [
    ResponseMessageTodoStatusReducer,
    UpdateTodoStatusMessage,
    UpdateTodoStatus,
  ]); // eslint-disable-line

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // Wrapped in useCallback so stable references are passed to memoised children
  // ─────────────────────────────────────────────────────────────────────────

  /** Toggle the search bar; reset form fields when collapsing */
  const toggleSearch = useCallback(() => {
    setExpand((prev) => !prev);
    setSearchData(EMPTY_SEARCH);
  }, []);

  /** Controlled input handler for title and assigned-to search fields */
  const searchHandler = useCallback(
    (e) => {
      const { name, value } = e.target;
      setSearchData((prev) => ({
        ...prev,
        [name]: value.trimStart(),
        UserID: creatorID,
      }));
    },
    [creatorID],
  );

  /** Update the date field from the DatePicker (set to end-of-day for range coverage) */
  const searchHandlerDate = useCallback(
    (date) => {
      const d = new Date(date);
      d.setHours(23, 59, 0, 0);
      setSearchData((prev) => ({ ...prev, Date: d, UserID: creatorID }));
    },
    [creatorID],
  );

  /** Execute search — builds payload and dispatches API call */
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const isEmpty =
        !searchData.Date && !searchData.Title && !searchData.AssignedToName;

      const payload = isEmpty
        ? { ...EMPTY_SEARCH, UserID: creatorID }
        : {
            Date: searchData.Date
              ? multiDatePickerDateChangIntoUTC(searchData.Date).slice(0, 8)
              : "",
            Title: searchData.Title,
            AssignedToName: searchData.AssignedToName,
            UserID: creatorID,
          };

      dispatch(
        SearchTodoListApi(
          navigate,
          payload,
          DEFAULT_PAGE,
          DEFAULT_PAGE_SIZE,
          t,
        ),
      );
    },
    [searchData, creatorID, dispatch, navigate, t],
  );

  /** Reset search form and reload the default first page */
  const resetSearchBar = useCallback(
    (e) => {
      e.preventDefault();
      localStorage.setItem("todoListPage", DEFAULT_PAGE);
      localStorage.setItem("todoListRow", DEFAULT_PAGE_SIZE);
      setSearchData(EMPTY_SEARCH);
      dispatch(
        SearchTodoListApi(
          navigate,
          { ...EMPTY_SEARCH, UserID: creatorID },
          DEFAULT_PAGE,
          DEFAULT_PAGE_SIZE,
          t,
        ),
      );
    },
    [creatorID, dispatch, navigate, t],
  );

  /** Open the view modal for a given task ID */
  const viewModalHandler = useCallback(
    (id) => {
      dispatch(ViewToDoList(navigate, { ToDoListID: id }, t, setViewFlagToDo));
    },
    [dispatch, navigate, t],
  );

  /**
   * Soft-delete a task by setting its status to 6.
   * The row is removed immediately from local state; the socket event
   * will confirm the deletion for other connected clients.
   */
  const deleteTodolist = useCallback(
    (record) => {
      dispatch(
        saveTaskDocumentsApi(
          navigate,
          { ToDoID: Number(record.pK_TID), UpdateFileList: [] },
          t,
          2,
          setShow,
          6,
        ),
      );
    },
    [dispatch, navigate, t],
  );

  /**
   * Update a task's status.
   *
   * Flow:
   *  1. If the new status is 6 (deleted), optimistically remove the row from
   *     local state so the UI responds instantly without waiting for the socket.
   *  2. Dispatch the API call.
   *  3. If the search form currently has any active criteria, clear it and
   *     reload the full unfiltered list so the updated row is visible in context.
   *     Without this reset the user would be looking at stale filtered results
   *     that no longer match the server state.
   */
  const statusChangeHandler = useCallback(
    (newStatusID, taskID) => {
      // Optimistic delete — removes row immediately without a round-trip
      if (newStatusID === 6) {
        setRowToDo((prev) => prev.filter((r) => r.pK_TID !== taskID));
      }

      dispatch(updateTodoStatusFunc(navigate, newStatusID, taskID, t, false));

      // Clear active search if any field has a value so the re-fetched list
      // is not constrained to the previous search criteria
      const hasActiveSearch =
        searchData.Date || searchData.Title || searchData.AssignedToName;

      if (hasActiveSearch) {
        const freshSearch = { ...EMPTY_SEARCH, UserID: creatorID };
        setSearchData(freshSearch);
        dispatch(
          SearchTodoListApi(
            navigate,
            freshSearch,
            DEFAULT_PAGE,
            DEFAULT_PAGE_SIZE,
            t,
          ),
        );
      }
    },
    [dispatch, navigate, t, searchData, creatorID],
  );

  /** Persist page/size and reload on pagination change */
  const paginationChangeHandler = useCallback(
    (current, pageSize) => {
      localStorage.setItem("todoListPage", current);
      localStorage.setItem("todoListRow", pageSize);
      dispatch(SearchTodoListApi(navigate, searchData, current, pageSize, t));
    },
    [dispatch, navigate, searchData, t],
  );

  // ── Status filter dropdown ───────────────────────────────────────────────

  const handleMenuClick = useCallback((value) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  const handleApplyFilter = useCallback(() => {
    setRowToDo(
      originalData.filter((item) =>
        selectedValues.includes(String(item.status.pK_TSID)),
      ),
    );
    setFilterVisible(false);
  }, [originalData, selectedValues]);

  const resetFilter = useCallback(() => {
    setSelectedValues(["1", "2", "3", "4", "5", "6"]);
    setRowToDo(originalData);
    setFilterVisible(false);
  }, [originalData]);

  /** Open the calendar programmatically when the icon is clicked */
  const handleIconClick = useCallback(() => {
    datePickerRef.current?.openCalendar();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // MEMOISED VALUES
  // Prevents child table and dropdown from re-rendering on unrelated state changes
  // ─────────────────────────────────────────────────────────────────────────

  /** Table scroll config — stable object reference */
  const scroll = useMemo(() => ({ y: "64vh" }), []);

  /** Status filter options — only changes when language changes */
  const filterOptions = useMemo(
    () => [
      { value: "1", text: t("In-progress") },
      { value: "2", text: t("Pending") },
      { value: "4", text: t("Cancelled") },
      { value: "5", text: t("Completed") },
    ],
    [t],
  );

  /** Ant Design Menu for the status column filter dropdown */
  const filterMenu = useMemo(
    () => (
      <Menu>
        {filterOptions.map((f) => (
          <Menu.Item key={f.value} onClick={() => handleMenuClick(f.value)}>
            <Checkbox checked={selectedValues.includes(f.value)}>
              {f.text}
            </Checkbox>
          </Menu.Item>
        ))}
        <Menu.Divider />
        <div className="d-flex gap-3 align-items-center justify-content-center">
          <Button
            text={t("Reset")}
            className="FilterResetBtn"
            onClick={resetFilter}
          />
          <Button
            text={t("Ok")}
            disableBtn={selectedValues.length === 0}
            className="ResetOkBtn"
            onClick={handleApplyFilter}
          />
        </div>
      </Menu>
    ),
    [
      filterOptions,
      selectedValues,
      handleMenuClick,
      resetFilter,
      handleApplyFilter,
      t,
    ],
  );

  /**
   * Column definitions.
   * Memoised so the table only re-renders when sort indicators, status options,
   * filter visibility, or any handler reference actually changes.
   *
   * FIX (Assigned-to column): original code had an identical JSX branch for
   * both `currentLanguage === "ar"` and the else case — the duplicate was removed.
   *
   * FIX (Assigned-by sorter): original sorter had a stray comma expression
   * `(localeCompare(...), taskAssignedBySort)` which evaluated to the sort state
   * value rather than the comparison result — corrected to a proper return.
   */
  const columnsToDo = useMemo(
    () => [
      // ── Task title ────────────────────────────────────────────────────────
      {
        title: (
          <span className="d-flex gap-2 align-items-center">
            {t("Task")}
            <img
              src={taskTitleSort === "descend" ? DescendIcon : AscendIcon}
              alt=""
            />
          </span>
        ),
        dataIndex: "title",
        key: "title",
        width: "30%",
        ellipsis: true,
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) =>
          a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
        onHeaderCell: () => ({
          onClick: () =>
            setTaskTitleSort((o) =>
              o === "descend" ? "ascend" : o === "ascend" ? null : "descend",
            ),
        }),
        render: (text, record) => (
          <p
            className="todolist-title-col"
            title={text}
            onClick={() => viewModalHandler(record.pK_TID)}
          >
            {text}
          </p>
        ),
      },

      // ── Assigned by ───────────────────────────────────────────────────────
      {
        title: (
          <span className="d-flex gap-2 justify-content-center align-items-center">
            {t("Assigned-by")}
            <img
              src={taskAssignedBySort === "descend" ? DescendIcon : AscendIcon}
              alt=""
            />
          </span>
        ),
        dataIndex: "taskCreator",
        key: "taskCreator",
        align: "center",
        width: "20%",
        sortDirections: ["descend", "ascend"],
        // FIX: original had `(localeCompare(...), taskAssignedBySort)` — a comma
        // expression that returned the sort state, not the comparison value.
        sorter: (a, b) =>
          a.taskCreator?.name
            ?.toLowerCase()
            .localeCompare(b.taskCreator?.name?.toLowerCase()),
        onHeaderCell: () => ({
          onClick: () =>
            setTaskAssignedBySort((o) =>
              o === "descend" ? "ascend" : o === "ascend" ? null : "descend",
            ),
        }),
        render: (creator) => (
          <p className="m-0 d-flex justify-content-center MontserratRegular color-5a5a5a FontArabicRegular text-nowrap">
            <img
              draggable="false"
              className="data-img"
              src={`data:image/jpeg;base64,${creator?.displayProfilePictureName}`}
              alt=""
            />
            {creator?.name}
          </p>
        ),
      },

      // ── Assigned to ───────────────────────────────────────────────────────
      {
        title: (
          <span className="d-flex gap-2 justify-content-center align-items-center">
            {t("Assigned-to")}
            <img
              src={taskAssignedToSort === "descend" ? DescendIcon : AscendIcon}
              alt=""
            />
          </span>
        ),
        dataIndex: "taskAssignedTo",
        key: "taskAssignedTo",
        align: "center",
        width: "20%",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) =>
          a.taskAssignedTo?.[0]?.name
            ?.toLowerCase()
            .localeCompare(b.taskAssignedTo?.[0]?.name?.toLowerCase()),
        onHeaderCell: () => ({
          onClick: () =>
            setTaskAssignedToSort((o) =>
              o === "descend" ? "ascend" : o === "ascend" ? null : "descend",
            ),
        }),
        // FIX: original had an identical JSX branch for both ar and en — removed the dead branch.
        render: (assignees) => {
          if (!assignees?.length) return null;
          const first = assignees[0];
          return (
            <p className="m-0 MontserratRegular d-flex justify-content-center color-505050 FontArabicRegular text-nowrap">
              <img
                draggable="false"
                className="data-img"
                src={`data:image/jpeg;base64,${first.displayProfilePictureName}`}
                alt=""
              />
              {first.name}
            </p>
          );
        },
      },

      // ── Deadline ──────────────────────────────────────────────────────────
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-center">
            {t("Deadline")}
            <img
              src={taskDeadlineSort === "descend" ? ArrowDownIcon : ArrowUpIcon}
              alt=""
            />
          </span>
        ),
        dataIndex: "deadlineDateTime",
        key: "deadlineDateTime",
        ellipsis: true,
        width: "20%",
        align: "center",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) =>
          utcConvertintoGMT(a.deadlineDateTime) -
          utcConvertintoGMT(b.deadlineDateTime),
        onHeaderCell: () => ({
          onClick: () =>
            setDeadlineSort((o) =>
              o === "descend" ? "ascend" : o === "ascend" ? null : "descend",
            ),
        }),
        render: (_, record) => (
          <span className="text-nowrap text-center">
            {newTimeFormaterAsPerUTCFullDate(
              record.deadlineDateTime,
              currentLanguage,
            )}
          </span>
        ),
      },

      // ── Status ────────────────────────────────────────────────────────────
      {
        title: t("Status"),
        dataIndex: "status",
        key: "status",
        align: "center",
        width: "10%",
        filterMultiple: true,
        filterIcon: () => (
          <ChevronDown
            className="filter-chevron-icon-todolist"
            onClick={() => setFilterVisible((v) => !v)}
          />
        ),
        filterDropdown: () => (
          <Dropdown
            overlay={filterMenu}
            visible={filterVisible}
            onVisibleChange={setFilterVisible}
          >
            <div />
          </Dropdown>
        ),
        render: (status, record) => {
          const cls = `${STATUS_CLASS_MAP[status.pK_TSID] ?? ""} custom-class`;
          const isOwner = Number(record.taskCreator?.pK_UID) === creatorID;

          return isOwner ? (
            <Select
              value={t(status.status)}
              bordered={false}
              popupClassName="Status-Todo"
              className={cls}
              onChange={(val) => statusChangeHandler(val, record.pK_TID)}
            >
              {statusOptions.map(({ id, status: label }) => (
                <option key={id} value={id}>
                  {t(label)}
                </option>
              ))}
            </Select>
          ) : (
            <p className={`${cls} color-5a5a5a text-center my-1`}>
              {t(status.status)}
            </p>
          );
        },
      },

      // ── Delete action ─────────────────────────────────────────────────────
      {
        title: "",
        dataIndex: "taskCreator",
        key: "actions",
        align: "center",
        width: "5%",
        render: (creator, record) =>
          Number(creator?.pK_UID) === creatorID ? (
            <i
              className="meeting-editbutton cursor-pointer"
              onClick={() => deleteTodolist(record)}
            >
              <img draggable="false" src={del} alt="delete" />
            </i>
          ) : null,
      },
    ],
    [
      t,
      currentLanguage,
      creatorID,
      taskTitleSort,
      taskAssignedBySort,
      taskAssignedToSort,
      taskDeadlineSort,
      statusOptions,
      filterMenu,
      filterVisible,
      viewModalHandler,
      statusChangeHandler,
      deleteTodolist,
    ],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="todolistContainer">
        {/* ── Header: title, create button, expandable search bar ── */}
        <Row className="d-flex justify-content-start align-items-center">
          <Col md={2} sm={4} lg={2} className="todolist-heading-size">
            {t("Tasks")}
          </Col>

          <Col lg={2} md={2} sm={4} className="todolist-create-btn">
            <Button
              className="btn btn-primary"
              icon={<Plus width={20} height={20} fontWeight={800} />}
              variant="Primary"
              text={t("Create-a-task")}
              onClick={() => setShow(true)}
            />
          </Col>

          <Col
            md={8}
            lg={8}
            sm={4}
            className="todo-list-field todolist-search-row"
          >
            <Search
              width="24px"
              height="24px"
              className="search-Icon toExpandSearch Meeting"
              onClick={toggleSearch}
            />

            {isExpand && (
              <div className="expandableMenuSearch">
                <Form className="d-flex">
                  <DatePicker
                    selected={searchData.Date}
                    format="DD/MM/YYYY"
                    placeholder="DD/MM/YYYY"
                    render={
                      <div className="iconForDatePicker margin-right-20">
                        <CalendarFill
                          className="DatePickerIcon"
                          size={34}
                          onClick={handleIconClick}
                        />
                      </div>
                    }
                    calendarPosition="bottom-right"
                    editable
                    className="datePickerTodoCreate2"
                    onOpenPickNewDate={false}
                    highlightToday
                    showOtherDays
                    calendar={gregorian}
                    locale={locale}
                    ref={datePickerRef}
                    onFocusedDateChange={searchHandlerDate}
                  />
                  <TextField
                    applyClass="form-control2"
                    width="250px"
                    name="Title"
                    value={searchData.Title}
                    className="mx-2"
                    placeholder={t("Task")}
                    labelclass="textFieldSearch"
                    change={searchHandler}
                  />
                  <TextField
                    applyClass="form-control2"
                    width="180px"
                    name="AssignedToName"
                    value={searchData.AssignedToName}
                    className="mx-2"
                    placeholder={t("Assigned-to")}
                    labelclass="textFieldSearch"
                    change={searchHandler}
                  />
                  <Button
                    className="btn btn-primary meeting search me-3"
                    variant="Primary"
                    text={<ArrowRight />}
                    onClick={handleSearch}
                  />
                  <Button
                    className="btn btn-primary meeting search"
                    variant="Primary"
                    type="reset"
                    text={<ArrowCounterclockwise />}
                    onClick={resetSearchBar}
                  />
                </Form>
              </div>
            )}
          </Col>
        </Row>

        {/* ── Main table ── */}
        <section className="todolist_main_section">
          <Row>
            <Col sm={12} md={12} lg={12}>
              <TableToDo
                column={columnsToDo}
                className="ToDo"
                pagination={false}
                rows={rowsToDo}
                scroll={scroll}
                locale={{
                  emptyText: (
                    <section className="d-flex flex-column align-items-center justify-content-center">
                      <img
                        src={TodoMessageIcon1}
                        width="250px"
                        alt="No tasks available"
                      />
                      <span className="NotaskTodolist">{t("No-Task")}</span>
                    </section>
                  ),
                }}
              />
            </Col>
          </Row>

          {rowsToDo.length > 0 && (
            <Row className="mt-2">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="pagination-groups-table d-flex justify-content-center"
              >
                <span className="PaginationStyle-TodoList">
                  <CustomPagination
                    onChange={paginationChangeHandler}
                    current={getStoredPage()}
                    showSizer
                    total={totalRecords}
                    pageSizeOptionsValues={["15", "30", "50", "100"]}
                    pageSize={getStoredSize()}
                  />
                </span>
              </Col>
            </Row>
          )}
        </section>
      </div>

      {/*
       * ── Modals (mutually exclusive priority: create > view > update) ──
       * Using explicit conditionals instead of chained ternaries for readability.
       */}
      {show && (
        <ModalToDoList
          show={show}
          setShow={setShow}
          updateFlagToDo={updateFlagToDo}
          setUpdateFlagToDo={setUpdateFlagToDo}
          className="toDoViewModal"
        />
      )}
      {!show && viewFlagToDo && (
        <ModalViewToDo
          viewFlagToDo={viewFlagToDo}
          setViewFlagToDo={setViewFlagToDo}
        />
      )}
      {!show && !viewFlagToDo && updateFlagToDo && (
        <ModalUpdateToDo
          updateFlagToDo={updateFlagToDo}
          setUpdateFlagToDo={setUpdateFlagToDo}
          setModalsflag={setPendingUpdate}
        />
      )}

      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default TodoList;
