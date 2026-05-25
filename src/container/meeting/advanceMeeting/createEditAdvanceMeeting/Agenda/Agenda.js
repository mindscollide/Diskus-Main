import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import styles from "./Agenda.module.css";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Button, Notification } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import {
  convertDateFieldsToUTC,
  convertUtcToGmt,
  resolutionResultTable,
} from "../../../../../commen/functions/date_formater";
import plusFaddes from "../../../../../assets/images/PlusFadded.svg";
import emptyContributorState from "../../../../../assets/images/Empty_Agenda_Meeting_view.svg";

// Modals / child views
import AgenItemremovedModal from "./AgendaItemRemovedModal/AgenItemremovedModal";
import MainAjendaItemRemoved from "./MainAgendaItemsRemove/MainAjendaItemRemoved";
import AdvancePersmissionModal from "./AdvancePermissionModal/AdvancePersmissionModal";
import PermissionConfirmation from "./AdvancePermissionModal/PermissionConfirmModal/PermissionConfirmation";
import VoteModal from "./VoteModal/VoteModal";
import VoteModalConfirm from "./VoteModal/VoteModalConfirmation/VoteModalConfirm";
import ImportPrevious from "./ImportPreviousAgenda/ImportPrevious";
import SaveAgendaView from "./SavedAgendaView/SaveAgendaView";
import AgendaView from "./AgendaView/AgendaView";
import ParentAgenda from "./ParentAgenda";
import VotingPage from "./VotingPage/VotingPage";
import CancelAgenda from "./CancelAgenda/CancelAgenda";
import NextAgenda from "./NextAgenda/NextAgenda";
import PreviousAgenda from "./PreviousAgenda/PreviousAgenda";

// Redux actions
import {
  showImportPreviousAgendaModal,
  GetAllMeetingUserApiFunc,
  CleareMessegeNewMeeting,
} from "../../../../../store/actions/NewMeetingActions";
import {
  clearResponseMessage,
  GetAdvanceMeetingAgendabyMeetingID,
} from "../../../../../store/actions/MeetingAgenda_action";
import {
  AddUpdateAdvanceMeetingAgendaApi,
  GetAdvanceMeetingAgendabyMeetingIdApi,
  SaveMeetingAgendaFilesApi,
  UploadDocumentsMeetingAgendaApi,
  getAllAgendaContributorsApi,
  getMeetingDetailsByMeetingIdApi,
} from "../../../../../store/actions/NewMeeting2.actions";

import { MeetingContext } from "../../../../../context/MeetingContext";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import { getRandomUniqueNumber, onDragEnd } from "./drageFunction";

/* ============================================================================
 * CONSTANTS
 * ============================================================================
 * Pulling magic numbers/strings out of JSX makes the intent obvious and
 * prevents typos from silently breaking role checks.
 * ========================================================================= */

const ROLES = {
  AGENDA_CONTRIBUTOR: "Agenda Contributor",
  PARTICIPANT: "Participant",
};

const STATUS = {
  END: 9, // meeting is finished — read-only
  UPCOMING: 1,
  ACTIVE: 10, // ongoing meeting — edit only allowed if flag is on
};

const AGENDA_SOURCE = {
  ATTACHMENT: 1, // user uploads files
  URL: 2, // user provides a link
  CONTRIBUTOR: 3, // delegate to an agenda contributor
};

const SAVE_FLAG = {
  SAVE_ONLY: 1, // "Next" — save and move to next tab
  SAVE_AND_PUBLISH: 2, // "Publish" — save and publish meeting
};

const MAX_FILES_PER_AGENDA = 10;

/* ============================================================================
 * PURE HELPER FUNCTIONS
 * ============================================================================
 * These have no dependency on component state, so they live outside the
 * component to avoid being re-created on every render.
 * ========================================================================= */

/**
 * Capitalizes the first letter of a key. Special-cases "id" → "ID" to match
 * the backend's Pascal-case contract (the API expects `ID`, not `Id`).
 */
const capitalizeFirstLetter = (str) => {
  if (str.toLowerCase() === "id") return str.toUpperCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Recursively converts all object keys from camelCase to PascalCase.
 * The backend expects PascalCase; we keep camelCase in React for convention.
 */
const capitalizeKeys = (obj) => {
  if (Array.isArray(obj)) return obj.map(capitalizeKeys);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[capitalizeFirstLetter(key)] = capitalizeKeys(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

/**
 * Strips UI-only fields before sending to the backend.
 * These properties are derived client-side (e.g. presenter name from a lookup)
 * and should never be persisted.
 */
const UI_ONLY_KEYS = [
  "presenterName",
  "requestContributorURlName",
  "subAgendarequestContributorUrlName",
  "userProfilePicture",
  "contributor",
];

const removeProperties = (data) => {
  if (Array.isArray(data)) return data.map(removeProperties);
  if (data !== null && typeof data === "object") {
    const cleaned = {};
    for (const key in data) {
      if (UI_ONLY_KEYS.includes(key)) continue;
      cleaned[key] = removeProperties(data[key]);
    }
    return cleaned;
  }
  return data;
};

/**
 * Determines whether an agenda row (parent + its sub-agendas) is effectively
 * empty — i.e. the user hasn't filled in anything meaningful.
 * Used when merging imported agendas to avoid keeping blank placeholder rows.
 */
const isAgendaRowEmpty = (agendaItem) => {
  const parentEmpty =
    agendaItem.title === "" &&
    agendaItem.description === "" &&
    agendaItem.startDate === "" &&
    agendaItem.endDate === "" &&
    agendaItem.urlFieldMain === "" &&
    agendaItem.mainNote === "" &&
    agendaItem.requestContributorURlName === "" &&
    agendaItem.files.length === 0 &&
    agendaItem.isLocked === false &&
    agendaItem.voteOwner === null &&
    agendaItem.isAttachment === false &&
    agendaItem.userID === 0;

  // If there are no sub-agendas, the parent's emptiness decides.
  if (!agendaItem.subAgenda || agendaItem.subAgenda.length === 0) {
    return parentEmpty;
  }

  // Otherwise, every sub-agenda must also be empty for the whole row to count as empty.
  const allSubsEmpty = agendaItem.subAgenda.every(
    (sub) =>
      sub.subTitle === "" &&
      sub.description === "" &&
      sub.startDate === "" &&
      sub.endDate === "" &&
      sub.subAgendarequestContributorUrlName === "" &&
      sub.subAgendarequestContributorEnterNotes === "" &&
      sub.subAgendaUrlFieldRadio === "" &&
      sub.subfiles.length === 0 &&
      sub.isLocked === false &&
      sub.voteOwner === null &&
      sub.isAttachment === false &&
      sub.userID === 0,
  );

  return parentEmpty && allSubsEmpty;
};

/**
 * Builds a blank main-agenda row. Centralized so both the "Add" button and
 * the fallback "empty agenda" path produce identical shapes — which matters
 * because the backend is strict about field presence.
 */
const buildEmptyAgendaRow = (defaultPresenter, meetingTime) => ({
  iD: getRandomUniqueNumber().toString() + "A",
  title: "",
  agendaVotingID: 0,
  presenterID: defaultPresenter?.value ?? 0,
  presenterName: defaultPresenter?.label ?? "",
  description: "",
  startDate: meetingTime?.meetingStartTime ?? "",
  endDate: meetingTime?.meetingEndTime ?? "",
  selectedRadio: AGENDA_SOURCE.ATTACHMENT,
  urlFieldMain: "",
  mainNote: "",
  requestContributorURlName: "",
  files: [],
  isLocked: false,
  voteOwner: null,
  isAttachment: false,
  userID: 0,
  subAgenda: [],
  canEdit: true,
  canView: true,
});

/**
 * Validates a single agenda row. Returns null if valid, otherwise returns
 * a translation key + params describing the first failure.
 *
 * Data-driven so adding a new rule = adding one entry, not another if-block.
 */
const validateAgendaRow = (row, rowIndex) => {
  const idx = { rowIndex: rowIndex + 1 };

  if (row.files.length > MAX_FILES_PER_AGENDA)
    return { key: "Files-should-not-more-than-10", params: idx };
  if (row.title === "")
    return { key: "Title-is-missing-in-agenda", params: idx };
  if (row.startDate === "")
    return { key: "start-time-is-missing-in-agenda", params: idx };
  if (row.endDate === "")
    return { key: "End-time-is-missing-in-agenda ", params: idx };
  if (row.presenterID === 0)
    return { key: "Presenter-is-missing-in-agenda ", params: idx };
  if (row.selectedRadio === AGENDA_SOURCE.URL && row.urlFieldMain === "")
    return { key: "URL-is-missing-in-agenda ", params: idx };
  if (
    row.selectedRadio === AGENDA_SOURCE.CONTRIBUTOR &&
    (row.userID === 0 || row.mainNote === "")
  )
    return { key: "UserID/Note-is-missing-in-agenda ", params: idx };
  return null;
};

/**
 * Same idea as validateAgendaRow but for sub-agendas. Index is included so
 * the error message can say "Sub-agenda 2 of Agenda 1 is missing a title".
 */
const validateSubAgendaRow = (sub, rowIndex, subIndex) => {
  const idx = { rowIndex: rowIndex + 1, subIndex: subIndex + 1 };

  if (sub.subfiles.length > MAX_FILES_PER_AGENDA)
    return { key: "Files-should-not-more-than-10", params: idx };
  if (sub.subTitle === "")
    return { key: "Title-is-missing-in-agenda", params: idx };
  if (sub.startDate === "")
    return { key: "Start-date-is-missing-in-agenda", params: idx };
  if (sub.endDate === "")
    return { key: "End-date-is-missing-in-agenda", params: idx };
  if (sub.presenterID === 0)
    return { key: "Presenter-is-missing-in-agenda", params: idx };
  if (
    sub.subSelectRadio === AGENDA_SOURCE.URL &&
    sub.subAgendaUrlFieldRadio === ""
  )
    return { key: "URL-is-missing-in-agenda", params: idx };
  if (
    sub.subSelectRadio === AGENDA_SOURCE.CONTRIBUTOR &&
    (sub.userID === 0 || sub.subAgendarequestContributorEnterNotes === "")
  )
    return { key: "UserID/Note-is-missing-in-agenda", params: idx };
  return null;
};

/* ============================================================================
 * MAIN COMPONENT
 * ========================================================================= */

const Agenda = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* --------------------------------------------------------------------------
   * Redux selectors
   * ------------------------------------------------------------------------ */
  const meetingId = useSelector(
    (state) => state.NewMeetingreducer.currentMeetingInfo.meetingID,
  );
  const { NewMeetingreducer, MeetingAgendaReducer } = useSelector((s) => s);
  const getAllMeetingDetails = useSelector(
    (state) => state.NewMeetingreducer.getAllMeetingDetails,
  );

  const MeetingAgendaData =
    MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData;

  /* --------------------------------------------------------------------------
   * Context — provides role info and "cancel/go back" modal trigger
   * ------------------------------------------------------------------------ */
  const {
    isAgendaUpdateWhenMeetingActive,
    editorRole,
    setGoBackCancelModal,
    setEditorRole,
  } = useContext(MeetingContext);

  /* --------------------------------------------------------------------------
   * Local state
   * ------------------------------------------------------------------------ */
  const [enableVotingPage, setenableVotingPage] = useState(false);
  const [agendaViewPage, setagendaViewPage] = useState(false);
  const [savedViewAgenda, setsavedViewAgenda] = useState(false);

  const [fileForSend, setFileForSend] = useState([]); // pending uploads
  const [isPublishedState, setIsPublishedState] = useState(false);
  const [allSavedPresenters, setAllSavedPresenters] = useState([]);
  const [allUsersRC, setAllUsersRC] = useState([]); // request-contributor users

  // Indices of rows pending removal — passed to removal modals
  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);

  const [selectedID, setSelectedID] = useState(0);
  const [emptyStateRows, setEmptyStateRows] = useState(false);
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [meetingTime, setMeetingTime] = useState({
    meetingStartTime: "",
    meetingEndTime: "",
  });

  /* --------------------------------------------------------------------------
   * Derived values — memoized so expensive role checks don't re-run every render
   * ------------------------------------------------------------------------ */
  const isContributor = editorRole.role === ROLES.AGENDA_CONTRIBUTOR;
  const isParticipant = editorRole.role === ROLES.PARTICIPANT;
  const isEnded = Number(editorRole.status) === STATUS.END;
  // const canPublish =
  //   (Number(editorRole.status) === STATUS.PUBLISHED ||
  //     Number(editorRole.status) === STATUS.IN_PROGRESS) &&
  //   !isEnded &&
  //   !isContributor;

  /* --------------------------------------------------------------------------
   * Initial data load — fires once on mount
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    const payload = { MeetingID: meetingId ?? 0 };
    dispatch(GetAdvanceMeetingAgendabyMeetingIdApi(navigate, t, payload));
    dispatch(getAllAgendaContributorsApi(navigate, t, payload));
    dispatch(GetAllMeetingUserApiFunc(payload, navigate, t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --------------------------------------------------------------------------
   * Meeting time setup
   * Fetches meeting details if missing, then extracts start/end times for
   * use as default values on new agenda rows.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    try {
      if (getAllMeetingDetails === null) {
        dispatch(
          getMeetingDetailsByMeetingIdApi(
            navigate,
            t,
            { MeetingID: meetingId },
            "getMeetingDetailsFromAgendaTab",
            {},
          ),
        );
        return;
      }
    } catch (error) {}
  }, [getAllMeetingDetails, dispatch, meetingId, navigate, t]);

  useEffect(() => {
    if (!meetingTime.meetingStartTime) return;

    setRows((prevRows) =>
      prevRows.map((row) => {
        // only update empty rows (don't overwrite user data)
        if (!row.startDate && !row.endDate) {
          return {
            ...row,
            startDate: meetingTime.meetingStartTime,
            endDate: meetingTime.meetingEndTime,
          };
        }
        return row;
      }),
    );
  }, [meetingTime]);

  useEffect(() => {
    const firstDate =
      getAllMeetingDetails?.advanceMeetingDetails?.meetingDates?.[0];

    if (!firstDate) return;

    setMeetingTime({
      meetingStartTime: resolutionResultTable(
        firstDate.meetingDate + firstDate.startTime,
      ),
      meetingEndTime: resolutionResultTable(
        firstDate.meetingDate + firstDate.endTime,
      ),
    });
  }, [getAllMeetingDetails]);

  /* --------------------------------------------------------------------------
   * Presenter dropdown options
   * Combines organizers + participants + agenda contributors into a single
   * dropdown list, formatted with avatar + name in a React node for `label`.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    const users = NewMeetingreducer?.getMeetingusers;
    if (!users) return;

    const merged = [
      ...users.meetingOrganizers,
      ...users.meetingParticipants,
      ...users.meetingAgendaContributors,
    ];
    if (merged.length === 0) return;

    const mapped = merged.map((p) => ({
      value: p.userID,
      name: p.userName,
      label: (
        <Row>
          <Col lg={12} md={12} sm={12} className="d-flex gap-2">
            <img
              alt=""
              src={`data:image/jpeg;base64,${p.userProfilePicture.displayProfilePictureName}`}
              width="17px"
              height="17px"
              className={styles["Image_class_Agenda"]}
            />
            <span className={styles["Name_Class"]}>{p.userName}</span>
          </Col>
        </Row>
      ),
    }));

    setAllSavedPresenters(mapped);
  }, [NewMeetingreducer?.getMeetingusers]);

  /* --------------------------------------------------------------------------
   * Add a new (blank) main agenda row
   * ------------------------------------------------------------------------ */
  const addRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      buildEmptyAgendaRow(allSavedPresenters[0], meetingTime),
    ]);
  }, [allSavedPresenters, meetingTime]);

  /* --------------------------------------------------------------------------
   * Open the "Import previous agenda" modal
   * ------------------------------------------------------------------------ */
  const importPreviousAgenda = useCallback(() => {
    dispatch(showImportPreviousAgendaModal(true));
  }, [dispatch]);

  /* --------------------------------------------------------------------------
   * Cancel — triggers the "are you sure?" modal via context
   * ------------------------------------------------------------------------ */
  const handleCancelClick = useCallback(() => {
    setGoBackCancelModal(true);
  }, [setGoBackCancelModal]);

  /* --------------------------------------------------------------------------
   * The actual save/upload orchestration.
   * Flow:
   *   1. Upload any pending files → collect server-generated IDs into `newFolder`
   *   2. Save the file metadata records
   *   3. Build a clean payload (UTC dates, no UI-only fields, PascalCase keys)
   *   4. Swap local display names for the real file IDs
   *   5. Dispatch the "save agenda" API
   * ------------------------------------------------------------------------ */
  const updateSave = async (flag) => {
    const newFolder = []; // populated by SaveMeetingAgendaFilesApi via closure
    const newfile = []; // populated by UploadDocumentsMeetingAgendaApi via closure

    // ---- Step 1 & 2: upload + persist files only if there are any ---------
    if (fileForSend.length > 0) {
      // Upload every file in parallel rather than sequentially — they're independent.
      await Promise.all(
        fileForSend.map((file) =>
          dispatch(
            UploadDocumentsMeetingAgendaApi(
              navigate,
              t,
              file,
              "uploadDocumentsFromAgenda",
              { newfile },
            ),
          ),
        ),
      );

      // Then register the uploaded files as a single batch.
      await dispatch(
        SaveMeetingAgendaFilesApi(navigate, t, newfile, "saveFilesFromAgenda", {
          newFolder,
        }),
      );
    }

    // ---- Step 3: normalize dates to UTC + strip UI-only props -------------
    const convertedRows = convertDateFieldsToUTC(rows);
    const cleanedData = removeProperties(convertedRows);

    // ---- Step 4: map each file's displayName → its persisted file ID ------
    // Files are initially tagged by displayAttachmentName (a UI-side string);
    // after upload, the backend returns a real pK_FileID we must swap in.
    const displayNameToFileId = newFolder.reduce((acc, folder) => {
      acc[folder.displayAttachmentName] = folder.pK_FileID.toString();
      return acc;
    }, {});

    const resolveFileId = (file) => ({
      ...file,
      originalAttachmentName:
        displayNameToFileId[file.displayAttachmentName] ??
        file.originalAttachmentName,
    });

    const updatedData = cleanedData.map((item) => ({
      ...item,
      files: item.files.map(resolveFileId),
      subAgenda: item.subAgenda.map((sub) => ({
        ...sub,
        subfiles: sub.subfiles.map(resolveFileId),
      })),
    }));

    // Reset pending-files queue — they're saved now.
    setFileForSend([]);

    // ---- Step 5: dispatch the final save/publish API ----------------------
    const payload = capitalizeKeys({
      MeetingID: meetingId,
      AgendaList: updatedData,
    });

    const routeValue =
      flag === SAVE_FLAG.SAVE_ONLY
        ? "saveMeetingAgenda"
        : "saveAgendaAndPublishMeeting";

    await dispatch(
      AddUpdateAdvanceMeetingAgendaApi(navigate, t, payload, routeValue, {
        setEditorRole,
      }),
    );
  };

  /* --------------------------------------------------------------------------
   * Save entry point — validates every row (and its sub-rows) before calling
   * updateSave. Short-circuits on the first failure.
   *
   * Also: if no row requires attachments, we can safely drop `fileForSend`
   *       (the user changed their mind about uploading).
   * ------------------------------------------------------------------------ */
  const saveAgendaData = async (flag) => {
    let shouldResetFileForSend = true;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const rowError = validateAgendaRow(row, i);
      if (rowError) {
        showMessage(t(rowError.key, rowError.params), "error", setOpen);
        return; // fail-fast
      }

      // Any attachment-mode row means the pending-file queue is still relevant.
      if (row.selectedRadio === AGENDA_SOURCE.ATTACHMENT) {
        shouldResetFileForSend = false;
      }

      // Validate every sub-agenda of this row.
      if (row.subAgenda?.length) {
        for (let j = 0; j < row.subAgenda.length; j++) {
          const sub = row.subAgenda[j];
          const subError = validateSubAgendaRow(sub, i, j);
          if (subError) {
            showMessage(t(subError.key, subError.params), "error", setOpen);
            return;
          }
          if (sub.subSelectRadio === AGENDA_SOURCE.ATTACHMENT) {
            shouldResetFileForSend = false;
          }
        }
      }
    }

    if (shouldResetFileForSend) setFileForSend([]);
    await updateSave(flag);
  };

  /* --------------------------------------------------------------------------
   * Seed default presenter on the first (blank) row once presenter list loads.
   * Only runs when there's no existing agenda data from the server.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    const hasServerData =
      MeetingAgendaData &&
      Object.keys(MeetingAgendaData).length > 0 &&
      MeetingAgendaData.agendaList?.length > 0;

    if (hasServerData) return;
    if (rows.length !== 1) return;
    if (!allSavedPresenters[0]) return;

    setRows((prev) => {
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        presenterID: allSavedPresenters[0].value,
        presenterName: allSavedPresenters[0].label,
      };
      return updated;
    });
  }, [allSavedPresenters, allUsersRC, MeetingAgendaData, rows.length]);

  /* --------------------------------------------------------------------------
   * Hydrate `rows` from the server response.
   * - If server has agendas → map them, resolving presenter/contributor labels
   *   from their IDs and converting UTC dates back to local GMT display.
   * - Otherwise → start with one empty row.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    if (MeetingAgendaData == null) return;

    if (
      !MeetingAgendaData.agendaList ||
      MeetingAgendaData.agendaList.length === 0
    ) {
      setRows([buildEmptyAgendaRow(allSavedPresenters[0], meetingTime)]);
      setIsPublishedState(false);
      return;
    }

    try {
      const hydrated = MeetingAgendaData.agendaList.map((item) => {
        const { id, presenterID, userID, subAgenda, ...rest } = item;

        // Find presenter & contributor display labels from our dropdown data.
        const presenter = allSavedPresenters.find(
          (p) => p.value === presenterID,
        );
        const contributor = allUsersRC.find((u) => u.value === userID);

        // Recurse for sub-agendas (same lookup + date conversion).
        const hydratedSubs = subAgenda
          ? subAgenda.map((sub) => {
              const {
                subAgendaID,
                presenterID: sPid,
                userID: sUid,
                ...subRest
              } = sub;
              const subPresenter = allSavedPresenters.find(
                (p) => p.value === sPid,
              );
              const subContributor = allUsersRC.find((u) => u.value === sUid);

              return {
                subAgendaID,
                ...subRest,
                presenterID: sPid,
                userID: sUid,
                subAgendarequestContributorUrlName: subContributor?.label ?? "",
                presenterName: subPresenter?.label ?? "",
                startDate: sub.startDate
                  ? convertUtcToGmt(sub.startDate)
                  : null,
                endDate: sub.endDate ? convertUtcToGmt(sub.endDate) : null,
                subfiles: sub.subfiles ? [...sub.subfiles] : [],
              };
            })
          : null;

        return {
          iD: id,
          ...rest,
          presenterID,
          presenterName: presenter?.label ?? "",
          userID,
          requestContributorURlName: contributor?.label ?? "",
          startDate: item.startDate ? convertUtcToGmt(item.startDate) : null,
          endDate: item.endDate ? convertUtcToGmt(item.endDate) : null,
          subAgenda: hydratedSubs,
          files: item.files ? [...item.files] : [],
        };
      });

      setRows(hydrated);
      setIsPublishedState(MeetingAgendaData.isPublished);
    } catch (error) {}
    // We intentionally omit allSavedPresenters/allUsersRC: hydration should
    // run when server data arrives, not whenever the dropdowns refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MeetingAgendaData]);

  /* --------------------------------------------------------------------------
   * Handle "Import previous agenda" result.
   * The imported data is appended to the current rows, but:
   *   - Presenter/contributor/vote/file fields are reset (they're meeting-specific)
   *   - Fully-empty rows (both current and imported) are filtered out so the
   *     user doesn't get stuck with a blank placeholder after importing.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    const importData = MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData;
    if (!importData || importData.length === 0 || !importData.agendaList)
      return;

    setRows((prevRows) => {
      // Re-shape each imported agenda into our UI format, clearing fields
      // that shouldn't carry over between meetings.
      const imported = importData.agendaList.map((item) => {
        const { id, title, description, subAgenda, ...rest } = item;

        const clearedSubs = subAgenda
          ? subAgenda.map((sub) => ({
              subAgendaID: sub.subAgendaID,
              agendaVotingID: 0,
              subTitle: sub.subTitle,
              description: sub.description,
              presenterID: 0,
              presenterName: "",
              startDate: sub.startDate ? convertUtcToGmt(sub.startDate) : null,
              endDate: sub.endDate ? convertUtcToGmt(sub.endDate) : null,
              subSelectRadio: AGENDA_SOURCE.ATTACHMENT,
              subAgendaUrlFieldRadio: "",
              subAgendarequestContributorUrlName: "",
              subAgendarequestContributorEnterNotes: "",
              subfiles: [],
              isLocked: sub.isLocked,
              voteOwner: null,
              isAttachment: false,
              userID: 0,
            }))
          : null;

        return {
          ...rest,
          iD: id,
          title,
          agendaVotingID: 0,
          presenterID: 0,
          description,
          presenterName: "",
          startDate: item.startDate ? convertUtcToGmt(item.startDate) : null,
          endDate: item.endDate ? convertUtcToGmt(item.endDate) : null,
          selectedRadio: AGENDA_SOURCE.ATTACHMENT,
          urlFieldMain: "",
          mainNote: "",
          requestContributorURlName: "",
          files: [],
          isLocked: false,
          voteOwner: null,
          isAttachment: false,
          userID: 0,
          subAgenda: clearedSubs,
        };
      });

      // Drop blank rows on both sides before merging.
      const keptExisting = prevRows.filter((r) => !isAgendaRowEmpty(r));
      const keptImported = imported.filter((r) => !isAgendaRowEmpty(r));
      return [...keptExisting, ...keptImported];
    });
  }, [MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData]);

  /* --------------------------------------------------------------------------
   * Response-message snackbar handler.
   * Uses a lookup table instead of an if/else chain — easier to extend.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    const msg = MeetingAgendaReducer.ResponseMessage;
    if (!msg) return;

    const messageMap = {
      [t("Record-saved")]: { text: t("Record-saved"), type: "success" },
      [t("Record-updated")]: { text: t("Record-updated"), type: "success" },
      [t("Agendas-imported-successfully")]: {
        text: t("Agendas-imported-successfully"),
        type: "success",
      },
      [t("No-agendas-exist")]: { text: t("No-agendas-exist"), type: "error" },
      [t("Voting-saved")]: {
        text: t("Agenda-voting-details-saved-successfully"),
        type: "success",
      },
      [t("Voting-updated")]: {
        text: t("Agenda-voting-details-updated-successfully"),
        type: "success",
      },
    };

    const match = messageMap[msg];
    if (match) showMessage(match.text, match.type, setOpen);

    dispatch(clearResponseMessage(""));
  }, [MeetingAgendaReducer.ResponseMessage, dispatch, t]);

  /* --------------------------------------------------------------------------
   * Generic snackbar handler for NewMeetingreducer response messages.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    const msg = NewMeetingreducer.ResponseMessage;
    if (typeof msg === "string" && msg !== "") {
      showMessage(msg, "success", setOpen);
      dispatch(CleareMessegeNewMeeting());
    }
  }, [NewMeetingreducer.ResponseMessage, dispatch]);

  /* --------------------------------------------------------------------------
   * MQTT-pushed updates — another user modified this meeting's agenda.
   * Re-fetch so our view stays in sync.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    const mqtt = MeetingAgendaReducer.MeetingAgendaUpdatedMqtt;
    if (!mqtt) return;
    if (meetingId !== mqtt.meetingID) return;
    dispatch(
      GetAdvanceMeetingAgendabyMeetingID({ MeetingID: meetingId }, navigate, t),
    );
  }, [
    MeetingAgendaReducer.MeetingAgendaUpdatedMqtt,
    dispatch,
    meetingId,
    navigate,
    t,
  ]);

  /* --------------------------------------------------------------------------
   * Render helpers
   * Pulled out so the JSX tree below stays readable.
   * ------------------------------------------------------------------------ */

  // Should the drag-drop area be hidden entirely? Happens for contributors
  // whose only row is still blank (they can't add agendas, so nothing to show).
  const hideDragArea =
    isContributor && rows.length > 0 && rows[0]?.title === "";

  // Should we show the empty-state illustration?
  const showEmptyState =
    (emptyStateRows && (isContributor || isParticipant)) ||
    (isContributor && rows.length > 0 && rows[0].title === "");

  // Should the "Add Agenda" button render?
  const showAddAgendaBtn = !isParticipant && !isContributor && !isEnded;

  // Should the "Import previous" button render?
  const showImportBtn = !isEnded && !isContributor;

  /* --------------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------------ */

  // Full-page view overrides (the normal agenda editor is hidden when any of
  // these are active).
  if (savedViewAgenda) return <SaveAgendaView />;
  if (agendaViewPage) return <AgendaView />;
  if (enableVotingPage) return <VotingPage />;

  return (
    <>
      <section>
        {/* Draggable agenda list ------------------------------------------ */}
        {!hideDragArea && (
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, rows, setRows)}
          >
            {!showEmptyState && (
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={
                    rows.length > 1
                      ? `${styles["Scroller_Agenda"]} d-flex flex-column-reverse`
                      : styles["Scroller_Agenda"]
                  }
                >
                  <Droppable droppableId="board" type="PARENT">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {rows.map((data, index) => (
                          <div
                            key={data.iD ?? index}
                            className={
                              data.canView === false && isContributor
                                ? "d-none"
                                : styles["agenda-border-class"]
                            }
                          >
                            <ParentAgenda
                              fileForSend={fileForSend}
                              setFileForSend={setFileForSend}
                              // currentMeeting={currentMeeting}
                              data={data}
                              allUsersRC={allUsersRC}
                              setAllUsersRC={setAllUsersRC}
                              index={index}
                              allSavedPresenters={allSavedPresenters}
                              setAllSavedPresenters={setAllSavedPresenters}
                              rows={rows}
                              setRows={setRows}
                              setMainAgendaRemovalIndex={
                                setMainAgendaRemovalIndex
                              }
                              agendaItemRemovedIndex={agendaItemRemovedIndex}
                              setAgendaItemRemovedIndex={
                                setAgendaItemRemovedIndex
                              }
                              setSubajendaRemoval={setSubajendaRemoval}
                              editorRole={editorRole}
                              setSelectedID={setSelectedID}
                            />
                          </div>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Col>
              </Row>
            )}
          </DragDropContext>
        )}

        {/* Empty-state illustration -------------------------------------- */}
        {showEmptyState && (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center mt-3"
              >
                <img
                  draggable={false}
                  src={emptyContributorState}
                  width="274.05px"
                  height="230.96px"
                  alt=""
                  className={styles["Image-Add-Agenda"]}
                />
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center mt-3"
              >
                <span className={styles["Empty_state_heading"]}>
                  {t("No-agenda-availabe-to-discuss").toUpperCase()}
                </span>
              </Col>
            </Row>
          </>
        )}

        {/* "Add Agenda" button ------------------------------------------- */}
        {showAddAgendaBtn && (
          <Row className="mt-3">
            <Col lg={12} md={12} sm={12}>
              <Button
                text={
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center gap-2 align-items-center"
                    >
                      <img
                        draggable={false}
                        src={plusFaddes}
                        height="10.77px"
                        width="10.77px"
                        alt=""
                      />
                      <span className={styles["Add_Agen_Heading"]}>
                        {t("Add-agenda")}
                      </span>
                    </Col>
                  </Row>
                }
                className={styles["AddMoreBtnAgenda"]}
                // Active meetings can only add rows if the feature flag is on.
                disableBtn={
                  Number(editorRole.status) === STATUS.ACTIVE &&
                  !isAgendaUpdateWhenMeetingActive
                }
                onClick={addRow}
              />
            </Col>
          </Row>
        )}

        {/* Footer action buttons ---------------------------------------- */}
        <Row className="mt-4">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            {showImportBtn && (
              <Button
                text={t("Import-previous-agenda")}
                className={styles["Agenda_Buttons"]}
                onClick={importPreviousAgenda}
              />
            )}
            <Button
              text={t("Cancel")}
              className={styles["Agenda_Buttons"]}
              onClick={handleCancelClick}
            />
            {!isEnded && (
              <Button
                text={t("Next")}
                className={styles["Save_Agenda_btn"]}
                onClick={() => saveAgendaData(SAVE_FLAG.SAVE_ONLY)}
              />
            )}
            {editorRole?.role === "Organizer" &&
              editorRole?.status === "11" && (
                <Button
                  // Can't publish until the meeting has an ID and the agenda
                  // has actually been saved at least once.
                  disableBtn={
                    Number(meetingId) === 0 || isPublishedState === false
                  }
                  text={t("Publish")}
                  className={styles["Save_Agenda_btn"]}
                  onClick={() => saveAgendaData(SAVE_FLAG.SAVE_AND_PUBLISH)}
                />
              )}
          </Col>
        </Row>
      </section>

      {/* ----- Modals — rendered conditionally from Redux flags -------- */}
      {NewMeetingreducer.agendaItemRemoved && (
        <AgenItemremovedModal
          setRows={setRows}
          rows={rows}
          setSubajendaRemoval={setSubajendaRemoval}
          subajendaRemoval={subajendaRemoval}
          setAgendaItemRemovedIndex={setAgendaItemRemovedIndex}
          agendaItemRemovedIndex={agendaItemRemovedIndex}
        />
      )}
      {NewMeetingreducer.mainAgendaItemRemoved && (
        <MainAjendaItemRemoved
          mainAgendaRemovalIndex={mainAgendaRemovalIndex}
          setMainAgendaRemovalIndex={setMainAgendaRemovalIndex}
          rows={rows}
          setRows={setRows}
        />
      )}
      {NewMeetingreducer.advancePermissionModal && (
        <AdvancePersmissionModal
          setSelectedID={setSelectedID}
          selectedID={selectedID}
        />
      )}
      {NewMeetingreducer.advancePermissionConfirmation && (
        <PermissionConfirmation />
      )}
      {NewMeetingreducer.voteAgendaModal && (
        <VoteModal
          setenableVotingPage={setenableVotingPage}
          // currentMeeting={currentMeeting}
        />
      )}
      {NewMeetingreducer.voteConfirmationModal && <VoteModalConfirm />}
      {NewMeetingreducer.importPreviousAgendaModal && <ImportPrevious />}
      {NewMeetingreducer.cancelAgenda && <CancelAgenda />}
      {MeetingAgendaReducer.PreviousTabAgenda && (
        <PreviousAgenda
        // setAgenda={setAgenda}
        // setParticipants={setParticipants}
        />
      )}
      {MeetingAgendaReducer.NextTabAgenda && (
        <NextAgenda
        // setMeetingMaterial={setMeetingMaterial}
        // setAgenda={setAgenda}
        />
      )}

      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default Agenda;
