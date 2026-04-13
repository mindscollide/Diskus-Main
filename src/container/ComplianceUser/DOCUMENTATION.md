# ComplianceUser Module — Developer Documentation

## Table of Contents
1. [Module Overview](#1-module-overview)
2. [Folder Structure](#2-folder-structure)
3. [State Management](#3-state-management)
4. [Routing & Navigation](#4-routing--navigation)
5. [Component Reference](#5-component-reference)
   - 5.1 [MainCompliance (index.jsx)](#51-maincompliance-indexjsx)
   - 5.2 [Dashboard](#52-dashboard)
   - 5.3 [ComplianceByMe](#53-compliancebyme)
   - 5.4 [CreateEditCompliance](#54-createeditcompliance)
   - 5.5 [ComplianceDetails](#55-compliancedetails)
   - 5.6 [CreateEditViewComplianceChecklist](#56-createeditviewcompliancechecklist)
   - 5.7 [CreateEditViewComplianceTask](#57-createeditviewcompliancetask)
   - 5.8 [ComplianceForMe](#58-complianceforme)
   - 5.9 [ViewCompliance](#59-viewcompliance)
   - 5.10 [ViewComplianceDetails](#510-viewcompliancedetails)
   - 5.11 [ViewComplianceTasks](#511-viewcompliancetasks)
   - 5.12 [Reports](#512-reports)
6. [Common Components](#6-common-components)
7. [Status Machines](#7-status-machines)
8. [Common Functions](#8-common-functions)
9. [API Actions Reference](#9-api-actions-reference)
10. [Data Flow Diagrams](#10-data-flow-diagrams)

---

## 1. Module Overview

The **ComplianceUser** module is the front-end for the Axi Compliance Management system, integrated into Diskus. It allows organizations to create, track and report on regulatory compliance items.

**Two user roles within this module:**
| Role | Access | View Type |
|------|--------|-----------|
| Manager (Compliance Creator) | Create / Edit / View compliance, generate reports | `viewType = 1` |
| User (Task Assignee) | View assigned compliances and update task statuses | `viewType = 2` |

**Hierarchy of data:**
```
Compliance
  └── Checklist (1 or more)
        └── Task (1 or more)
```

**Key constraint:** A compliance needs at least 1 checklist and 1 task before its status can move from "Not Started".

---

## 2. Folder Structure

```
ComplianceUser/
├── index.jsx                          # Root entry point — tab layout, fiscal year
├── mainCompliance.module.css

├── Tabs/
│   ├── Dashboard/                     # Tab 1 — 6 dashboard tiles
│   │   ├── index.jsx                  # Orchestrates all tile API calls
│   │   ├── QuarterlySubmittedCompliance/
│   │   ├── UpcomingComplianceDeadline/
│   │   ├── QuarterlyTask/
│   │   ├── ComplianceBy/              # Dynamic sort tile (Progress/Due Date/Criticality/Authority)
│   │   ├── Tasks/                     # Overdue / Upcoming tasks tile
│   │   └── ReopenedCompliance/

│   ├── ComplainceByMe/                # Tab 2 — Manager view
│   │   ├── index.jsx                  # Compliance listing table
│   │   └── createEditCompliance/      # Full create/edit form (3 sub-tabs)
│   │       ├── index.jsx              # Tab switcher: Details / Checklists / Tasks
│   │       ├── ComplianceDetails/     # Sub-tab 1 — compliance form fields
│   │       ├── CreateEditViewComplianceChecklist/  # Sub-tab 2
│   │       └── CreateEditViewComplianceTask/       # Sub-tab 3

│   ├── ComplainceForMe/               # Tab 3 — User (assignee) view
│   │   └── index.jsx                  # Read-only compliance listing

│   └── Reports/                       # Tab 4
│       ├── index.jsx                  # Report listing table
│       ├── viewReport/                # Router component for report types
│       ├── endOfComplianceReport/
│       ├── endOfQuarterReport/
│       ├── accumulativeReport/
│       └── complianceStandingReport/  # Live on-demand report

├── CommonComponents/
│   ├── commonFunctions.js             # Pure date/status utility functions
│   ├── FiscalYearComponent/           # useFiscalYearRange hook
│   ├── viewCompliance/                # Shared ViewCompliance screen
│   │   ├── index.jsx                  # Container — tabs + progress bar + back icon
│   │   ├── VIewComplianceDetails/     # Details tab — status dropdown, checklists accordion
│   │   └── ViewComplianceTasks/       # Tasks tab — checklist panels with task table
│   ├── ViewComplianceChecklistAccordian/  # Reusable accordion for checklist panels
│   ├── searchComplianceBoxModal/      # Search/filter modal for By Me / For Me tabs
│   ├── searchComplianceReportModal/   # Search/filter modal for Reports tab
│   ├── TagSelectDropdown/             # Async creatable tag input
│   ├── ReopenOrOnHoldDetailsModal/    # Modal showing history of Reopen/On Hold changes
│   ├── ComplianceCloseConfirmationModal/  # "Discard changes?" dialog
│   └── StatusChangeModals/
│       ├── SubmitForApproval/         # Pending checklist warning modal
│       ├── ComplianceStatusCompleteModal/   # Cannot complete — tasks pending
│       ├── ComplianceStatusOnHoldModal/     # Select scope: compliance only vs with items
│       ├── ComplianceStatusOnHoldReasonModal/  # Reason text input
│       ├── ComplianceStatusCancel/    # Cancel scope + reason
│       └── ComplianceStatusReopenedModal/   # Reopen form: reason, new due date, attachments
```

---

## 3. State Management

### 3.1 ComplianceContext (`src/context/ComplianceContext`)

All shared state is managed in `ComplianceContext`. Components consume it via `useComplianceContext()`. **No prop drilling.**

#### Tab Navigation State
| Variable | Type | Default | Purpose |
|----------|------|---------|---------|
| `mainComplianceTabs` | `number` | `1` | Active top-level tab: 1=Dashboard, 2=ByMe, 3=ForMe, 4=Reports |
| `checkListTabs` | `number` | `1` | Active create/edit sub-tab: 1=Details, 2=Checklists, 3=Tasks |
| `viewComplianceDetailsTab` | `number` | `1` | Active view compliance tab: 1=Details, 2=Tasks |

#### View Mode State
| Variable | Type | Default | Purpose |
|----------|------|---------|---------|
| `viewTypeDashboard` | `number` | `1` | `1`=Manager view, `2`=User view. Persisted in `localStorage` |
| `complianceViewMode` | `string` | `"byMe"` | `"byMe"` or `"forMe"` — controls which API is called in ViewCompliance |

#### Compliance Form State
| Variable | Type | Purpose |
|----------|------|---------|
| `complianceInfo` | `{ complianceId, complianceName }` | ID and title of the currently open compliance |
| `complianceDetailsState` | `object` | All form fields for Details tab (title, desc, authority, criticality, dueDate, tags, status, progress, etc.) |
| `complianceDetailsViewState` | `number` | Internal state for view compliance mode (`1`=view, `2`=edit) |
| `complianceAddEditViewState` | `number` | `1`=create, `2`=edit, `3`=view |

#### Checklist/Task State
| Variable | Type | Purpose |
|----------|------|---------|
| `checkListData` | `array` | List of checklists for current compliance |
| `checklistCount` | `number` | Count shown on Checklists tab button |
| `taskCount` | `number` | Count shown on Tasks tab button |
| `allCheckListByComplianceId` | `array` | Full checklist data including tasks (for ViewCompliance) |
| `expandChecklistOnTasksPage` | `number\|null` | Which checklist ID to auto-expand on Tasks tab |

#### List State (By Me / For Me)
| Variable | Purpose |
|----------|---------|
| `complianceByMeList` / `complianceByMeTotal` | Data + total count for By Me table (infinite scroll) |
| `complianceForMeList` / `complianceForMeTotal` | Data + total count for For Me table |
| `searchCompliancePayload` | Current search/filter payload shared between search modal and listing |

#### Modal State (Status Changes)
| Variable | Controls |
|----------|----------|
| `submitForApprovalModal` | "Some checklists pending" warning |
| `complianceOnHoldModal` | On Hold scope selection |
| `complianceStatusChangeReasonModal` | Reason text input (On Hold / Cancel) |
| `comlianceCompleteExceptionModal` | "Cannot complete — tasks pending" |
| `complianceCancelModal` | Cancel scope selection |
| `comlianceStatusReopenedModal` | Reopen form (reason, new due date, attachments) |
| `isViewDetailsOpen` | Reopen/On Hold history modal |

#### Dashboard Filter State
| Variable | Type | Purpose |
|----------|------|---------|
| `complianceDashboardFilter` | `string` | Filter for ComplianceBy tile (e.g. `"Progress"`, `"DueDate"`) |
| `complianceTaskDashboardFilter` | `string` | Filter for Tasks tile (`"Overdue"`, `"Upcoming"`) |
| `reopendComplianceDashboardFilter` | `string` | Filter for Reopened tile |

#### Report State
| Variable | Purpose |
|----------|---------|
| `complianceStatndingReport` | Show ComplianceStandingReport fullscreen |
| `endOfComplianceReport` | Show EndOfComplianceReport fullscreen |
| `endOfQuarterReport` | Show EndOfQuarterReport fullscreen |
| `accumulativeReport` | Show AccumulativeReport fullscreen |

### 3.2 Redux Store (`ComplainceSettingReducerReducer`)

All API responses land in Redux. Key selectors:

| Selector key | Populated by | Consumed by |
|-------------|--------------|-------------|
| `listOfComplianceByCreator` | `listOfComplianceByCreatorApi` | ComplianceByMe listing |
| `SearchComplianceForMe` | `SearchComplianceForMeApi` | ComplianceForMe listing |
| `ViewComplianceByMeDetails` | `ViewComplianceDetailsByViewTypeAPI` | ViewCompliance |
| `GetComplianceChecklistsByComplianceId` | `GetComplianceChecklistsByComplianceIdAPI` | Checklists sub-tab |
| `GetComplianceChecklistsWithTasksByComplianceId` | `GetComplianceChecklistsWithTasksByComplianceIdAPI` | ViewComplianceTasks |
| `GetComplianceAndTaskStatuses` | `GetComplianceAndTaskStatusesAPI` | Status filter dropdowns |
| `MqttOrganizationSettingUpdated` | MQTT payload | Fiscal year live update |
| `ResponseMessage` + `severity` | Any mutating API | Toast notifications |

---

## 4. Routing & Navigation

This module does **not use React Router routes**. Navigation between screens is handled entirely via context state booleans and tab numbers:

```
mainComplianceTabs = 1  →  Dashboard
mainComplianceTabs = 2  →  ComplianceByMe listing
  createEditCompliance = true  →  CreateEditCompliance form (overlays everything)
  showViewCompliance = true    →  ViewCompliance screen (overlays everything)
mainComplianceTabs = 3  →  ComplianceForMe listing
  showViewCompliance = true    →  ViewCompliance screen
mainComplianceTabs = 4  →  Reports listing
  complianceStatndingReport = true  →  fullscreen ComplianceStandingReport
  endOfComplianceReport = true      →  fullscreen EndOfComplianceReport
  endOfQuarterReport = true         →  fullscreen EndOfQuarterReport
  accumulativeReport = true         →  fullscreen AccumulativeReport
```

**Back navigation** is always handled by resetting the relevant boolean to `false` and calling `emptyComplianceState()`.

---

## 5. Component Reference

### 5.1 MainCompliance (`index.jsx`)

**Role:** Root shell — header row, tab buttons, fiscal year display, conditional rendering.

**Key responsibilities:**
- Reads `viewTypeDashboard` from `localStorage` on mount; saves it on change
- Fetches all compliance + task statuses once on mount (`GetComplianceAndTaskStatusesAPI`)
- Renders `CreateEditCompliance` or `ViewCompliance` as full-page overlays when their flags are true
- Renders report screens as full-page overlays when report flags are true
- Otherwise renders the 4-tab layout

**Switch to User View toggle:** Only visible on Dashboard tab (tab 1). Switching resets all three dashboard filters.

**Fiscal Year display:** Driven by `useFiscalYearRange` hook which accepts `fiscalYearStartDay` and `fiscalStartMonth` from the MQTT `MqttOrganizationSettingUpdated` payload.

---

### 5.2 Dashboard (`Tabs/Dashboard/index.jsx`)

**Role:** Orchestrates data fetching for all 6 dashboard tiles.

**Tiles layout:**
```
Row 1: QuarterlySubmittedCompliance | UpcomingComplianceDeadline | QuarterlyTask
Row 2: ComplianceBy                 | Tasks                      | ReopenedCompliance
```

**API fetch strategy:**
- On mount: resets all filters, reads `viewType` from localStorage
- `fetchStaticDashboardData` — called when `viewTypeDashboard` changes → fetches QuarterlySubmitted, UpcomingDeadline, QuarterlyTasks
- `fetchComplianceByData` — called when `complianceDashboardFilter` changes → fetches ComplianceBy tile only
- `fetchComplianceTaskDashboardData` — called when `complianceTaskDashboardFilter` changes → fetches Tasks tile only
- `fetchReopenedComplianceDashboardData` — called when `reopendComplianceDashboardFilter` changes → fetches Reopened tile only

**Guard:** All fetches are gated by `isViewTypeReady` flag (set after localStorage is read) to prevent fetching with the wrong `viewType` on first render.

---

### 5.3 ComplianceByMe (`Tabs/ComplainceByMe/index.jsx`)

**Role:** Paginated, sortable, filterable table of all compliances created by the current user.

**Columns:** Compliance Title | Criticality | Status | Due Date | Authority | Actions (Edit / View Details)

**Sorting:** Manual (not Ant Design's built-in sorter). `sortConfig` state drives a `useMemo` sort on the local list. Columns: Compliance Title, Due Date, Authority.

**Filtering:**
- **Criticality** — local filter via Ant Design `filterDropdown` (values: 1=High, 2=Medium, 3=Low)
- **Status** — local filter, options populated from `allComplianceStatusForFilter` (Redux)

**Infinite scroll:** `useAntTableScrollBottomVirtual` hook detects scroll-to-bottom, increments `pageNumber`, appends results to `complianceByMeList`.

**Special case:** If opened via "View All Reopened Compliances" button from Dashboard, `viewAllReopenDashboardButtonFlag` is `true` → initial fetch uses `statusIds: [6]` (Reopened only).

**Navigation to Edit/View:**
- `handleEditCompliance` → dispatches `ViewComplianceDetailsByViewTypeAPI` with mode `1` → sets `complianceAddEditViewState(2)` + `setCreateEditComplaince(true)`
- `handleViewCompliance` → dispatches same API with mode `2` → sets `setShowViewCompliance(true)`

---

### 5.4 CreateEditCompliance (`Tabs/ComplainceByMe/createEditCompliance/index.jsx`)

**Role:** Three-tab shell for creating or editing a compliance.

**Tab buttons:**
| Tab | Key | Enabled when |
|-----|-----|-------------|
| Compliance Details | `checkListTabs = 1` | Always |
| `N Checklists` | `checkListTabs = 2` | Edit mode OR `complianceId !== 0` (after first save) |
| `N Tasks` | `checkListTabs = 3` | Edit mode OR (complianceId exists AND checklistCount > 0) |

**Mode detection:** `modeRef.current = complianceAddEditViewState` — captured once on mount so heading doesn't flicker on state changes.

**On mount:** If `complianceInfo.complianceId !== 0` (edit/reopen), fetches checklists via `GetComplianceChecklistsByComplianceIdAPI`.

**Heading logic:**
- `complianceAddEditViewState = 1` → "Create New Compliance"
- `complianceAddEditViewState = 2` → "Edit: [title]"
- otherwise → compliance title only

---

### 5.5 ComplianceDetails (`createEditCompliance/ComplianceDetails/index.js`)

**Role:** The compliance Details form — handles both create and edit.

**Form fields:**
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| Compliance Title | Text input (100 chars) | Yes | Unique within same Authority (checked on blur via `CheckComplianceTitleExistsAPI`) |
| Description | Textarea (500 chars) | Yes | — |
| Authority | Searchable dropdown | Yes | Only active authorities |
| Criticality | Dropdown | Yes | High / Medium / Low |
| Due Date | Date picker | Yes | Future dates only |
| Tags | Async Creatable Select | No | Max 5 tags, min 3 chars for suggestions |
| Status | Dropdown (edit only) | — | Only allowed transitions shown |

**Key behaviours:**
- Tags: uses `AsyncCreatableSelect` — shows existing tags from DB as suggestions (after 3 chars), allows creating new tags inline
- On **Create → Next**: calls `AddComplianceAPI`, saves compliance to DB, moves to Checklists tab; default status is "Not Started"
- On **Edit → Next**: calls `EditComplianceAPI`, updates DB
- **Close button**: shows `ComplianceCloseConfirmationModal` ("Discard changes?")
- Status changes in edit mode route through status modals (same pattern as ViewComplianceDetails)
- For **Reopened compliance**: calls `AddReopenComplianceAPI`; attachments handled via `SaveComplianceFilesAPI` + `SaveComplianceDocumentsAndMappingsAPI`

---

### 5.6 CreateEditViewComplianceChecklist (`CreateEditViewComplianceChecklist/index.jsx`)

**Role:** Add / edit / delete checklists within a compliance.

**Form fields:**
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| Checklist Title | Text input (100 chars) | Yes | Unique within same compliance (blur check via `CheckChecklistTitleExistsAPI`) |
| Description | Textarea (500 chars) | Yes | — |
| Due Date | Date picker | Yes | Future date AND must be before compliance due date |

**List behaviour:**
- Checklists appear as collapsible accordion panels below the form
- Panels sorted in order of creation
- Expanded panel shows title, due date, description + collapse icon
- Buttons: Edit icon (pre-fills form, Add → Update), Delete icon (confirmation modal)

**Delete:** Shows `DeleteChecklistConfirmationModal` → calls `DeleteCheckListAPI` → also deletes all tasks in that checklist → Tasks tab becomes disabled if no checklists remain.

**API calls:**
- Add: `AddComplianceChecklistAPI`
- Edit: `EditComplianceChecklistAPI`
- Delete: `DeleteCheckListAPI`
- Refresh: `GetComplianceChecklistsByComplianceIdAPI` (after any mutation)

---

### 5.7 CreateEditViewComplianceTask (`CreateEditViewComplianceTask/index.jsx`)

**Role:** Add / delete tasks within checklists.

**Behaviour:**
- All checklists shown as expanded accordion panels
- Each panel has an "Add Task" button → opens the standard Diskus Task modal
- Tasks appear as rows (title + delete icon) within the panel
- Task count on tab header updates in real time
- No editing of existing tasks — only create new or delete
- Task due date must be before compliance due date (validated in modal)

**Constraint:** Cannot add tasks if compliance or checklist status is Completed, On Hold, or Cancelled.

---

### 5.8 ComplianceForMe (`Tabs/ComplainceForMe/index.jsx`)

**Role:** Read-only listing of compliances where the current user has assigned tasks.

**Differences from ComplianceByMe:**
- No "Edit" button — only "View Details"
- `viewType: 2` passed to `ViewComplianceDetailsByViewTypeAPI`
- Initial fetch uses `SearchComplianceForMeApi` (different endpoint)
- Status filter: `onFilter` matches on `record.status` (not `record.complianceStatusTitle`)
- Status filter not auto-populated from `allComplianceStatusForFilter` (commented out — uses manual filter state)

**Infinite scroll:** Same pattern as ComplianceByMe using `useAntTableScrollBottomVirtual`.

---

### 5.9 ViewCompliance (`CommonComponents/viewCompliance/index.jsx`)

**Role:** Shared read-only compliance viewer — used from both By Me and For Me tabs.

**Layout:**
```
← [Compliance Title]                    [Reopen/OnHold Banner?] [Progress Bar / "No tasks created"]
[Details tab] [Tasks tab]
─────────────────────────────
Tab 1: ViewComplianceDetails
Tab 2: ViewComplianceTasks
```

**Progress bar:** Only shown if `complianceDetailsState.showProgressBar` is true (at least one task exists). Label changes based on tab: "Compliance Progress" (By Me) vs "My Progress" (For Me).

**Reopen/OnHold banner:** Shown if `complianceStatusChangeHistory` contains any entry with `toStatus.statusId === 6` (Reopened) or `7` (On Hold). Clicking "View Details" opens `ReopenOrOnHoldDetailsModal`.

**Back navigation:** Resets `showViewCompliance`, `viewComplianceDetailsTab`, and calls `emptyComplianceState()`.

**Details tab click:** Re-fetches compliance data via `ViewComplianceDetailsByViewTypeAPI` to ensure fresh data.

**Redux:** Watches `ViewComplianceByMeDetails` — on change, maps all fields into `complianceDetailsState` and `allowedComplianceStatusOptions`.

---

### 5.10 ViewComplianceDetails (`viewCompliance/VIewComplianceDetails/index.jsx`)

**Role:** The Details tab content within ViewCompliance — compliance info + checklists accordion + status change.

**Displayed fields:**
- Description, Authority (shortCode - fullName), Status dropdown, Criticality, Due Date, Tags

**Status dropdown:** Shows only allowed transitions (from `allowedComplianceStatusOptions`). Selecting a new status triggers the appropriate modal:

| Target Status | Modal shown |
|---------------|-------------|
| Submitted for Approval | `SubmitForApprovalModal` (warns if checklists pending) |
| Completed | `ComplianceStatusCompleteExceptionModal` (blocks if tasks pending) |
| On Hold | `ComplianceStatusOnHoldModal` → `ComplianceStatusChangeReasonModal` |
| Cancelled | `ComplianceStatusCancelModal` → `ComplianceStatusChangeReasonModal` |
| Reopened | `ComplianceStatusReopenedModal` (reason + new due date + attachments) |

**Checklists accordion:** Uses `ViewComplianceChecklistAccordian` component. Sorted by status order: In Progress → Pending → On Hold → Completed → Cancelled, then Due Date descending.

**Reopen compliance flow:** File uploads handled via `uploadDocumentsTaskApi` → `SaveComplianceFilesAPI` → `SaveComplianceDocumentsAndMappingsAPI` → `AddReopenComplianceAPI`.

---

### 5.11 ViewComplianceTasks (`viewCompliance/ViewComplianceTasks/index.jsx`)

**Role:** The Tasks tab — all checklists as collapsible panels, each showing a task table.

**Task table columns:** Task Title (link) | Assigned To | Due Date | Status (dropdown)

**Sorting:** Available on Task Title, Assigned To, Due Date. Default: Due Date descending.

**Status filter:** Multi-select column filter on Status column. Values: In Progress, Pending, Cancelled, Completed.

**Task status transitions (inline):**
```
Pending (2)     → In Progress (1) or Cancelled (4)
In Progress (1) → Completed (5) or Cancelled (4)
Completed (5)   → no further
Cancelled (4)   → no further
```
Status change dispatches `ChangeTaskStatusAPI`.

**Task title click:** Opens `TaskDetailsViewModal` (dispatches `ViewToDoList`).

**Attachment icon:** Shown on task row if task has attachments.

**By Me vs For Me:** Fetches from different APIs:
- By Me → `GetComplianceChecklistsWithTasksByComplianceIdAPI`
- For Me → `GetComplianceChecklistsWithTasksByComplianceIdForMeAPI`

**Auto-expand:** The checklist panel whose ID matches `expandChecklistOnTasksPage` is auto-expanded on mount.

---

### 5.12 Reports (`Tabs/Reports/index.jsx`)

**Role:** Report listing table + navigation to individual report views.

**Columns:** Type | Report Title (80 chars + ellipsis) | Generated On | Start Date | End Date | View Report | Download

**Report types:**
| Type | Trigger | Auto-generated |
|------|---------|----------------|
| End of Compliance | Compliance marked Completed | Yes |
| End of Quarter | End of each fiscal quarter | Yes |
| Accumulative Quarter | End of each fiscal quarter (cumulative from year start) | Yes |
| Compliance Standing | On demand — "View Report" button | No |

**Compliance Standing Report** opens in a new tab (`window.open`) or fullscreen overlay. Supports date range filter (Fiscal Year start → today, user adjustable).

**Download:** Downloads PDF to local machine via the Download button.

**Search options:** Report Title (partial), Report Type (multi-select), Date Range on Generated On.

**Individual report screens** (EndOfComplianceReport, EndOfQuarterReport, AccumulativeReport, ComplianceStandingReport) render fullscreen when their context boolean is true, and have a back icon that resets the boolean.

---

## 6. Common Components

### ComplianceCloseConfirmationModal
**Purpose:** "All your changes will be lost. Are you sure you want to discard them?" dialog.
**Props:** `show`, `onHide`, `onConfirm`
**Used in:** ComplianceDetails, CreateEditViewComplianceChecklist

### DeleteChecklistConfirmationModal
**Purpose:** "All tasks within this checklist will also be deleted." confirmation.
**Props:** `show`, `onHide`, `onConfirm`

### ReopenOrOnHoldDetailsModal
**Purpose:** Shows history of all Reopen / On Hold status changes with reason, date, and attachments.
**Controlled by:** `isViewDetailsOpen` in context.
**Data source:** `complianceDetailsState.complianceStatusChangeHistory`

### SearchComplianceBoxModal
**Purpose:** Search panel for By Me and For Me tabs.
**Search fields:** Compliance Title, Date Range (Due Date), Authority Short Code, Tags.
**On Search:** Updates `searchCompliancePayload` context + dispatches listing API.
**On Reset:** Clears all fields, refetches with empty payload.

### SearchComplianceReportModal
**Purpose:** Search panel for Reports tab.
**Search fields:** Report Title, Report Type (multi-select), Date Range (Generated On).

### TagSelectDropdown
**Purpose:** Async creatable tag selector.
**Behaviour:** Starts suggesting after 3 chars typed. Tags sorted by creation date (newest first). Max 5 tags. Allows inline creation of new tags.

### ViewComplianceChecklistAccordian
**Purpose:** Collapsible accordion for displaying checklist panels in ViewCompliance Details tab.
**Features:** Expand All / Collapse All button, multiple panels expandable simultaneously, shows checklist progress bar, checklist status dropdown, Re-opened/On-Hold banner per checklist.

### FiscalYearComponent / useFiscalYearRange
**Purpose:** Hook that calculates fiscal year start/end date string for display.
**Input:** `fiscalYearStartDay`, `fiscalStartMonth` (from MQTT or localStorage).
**Output:** Formatted string e.g. `"01 Jul 2025 - 30 Jun 2026"`.

---

## 7. Status Machines

### 7.1 Compliance Status Transitions

```
NOT STARTED ──→ IN PROGRESS ──→ SUBMITTED FOR APPROVAL ──→ COMPLETED ──→ REOPENED ─┐
     │               │                    │                                           │
     └──→ ON HOLD ←──┘              ON HOLD / REOPENED                              │
               │                                                                      │
               └──→ IN PROGRESS / CANCELLED                                          │
                                                                                      │
OVERDUE ──→ SUBMITTED FOR APPROVAL / ON HOLD / CANCELLED                             │
                                                                                      │
REOPENED ──→ SUBMITTED FOR APPROVAL / ON HOLD / CANCELLED ────────────────────────────┘
```

**Status IDs (from API):**
| ID | Name |
|----|------|
| 1 | Not Started |
| 2 | In Progress |
| 3 | Completed |
| 5 | Submitted for Approval |
| 6 | Reopened |
| 7 | On Hold |
| 8 | Overdue *(auto-set by system)* |
| 9 | Cancelled |

**`getAllowedStatuses(currentStatusId)`** in `commonFunctions.js` returns `{ currentStatus, allowedStatuses }` for driving the status dropdown.

### 7.2 Checklist Status Transitions
```
PENDING → IN PROGRESS (requires ≥1 task) / CANCELLED / ON HOLD
IN PROGRESS → COMPLETED / ON HOLD / CANCELLED
ON HOLD → IN PROGRESS / CANCELLED
COMPLETED → no further
CANCELLED → no further
```

### 7.3 Task Status Transitions
```
PENDING (2) → IN PROGRESS (1) / CANCELLED (4)
IN PROGRESS (1) → COMPLETED (5) / CANCELLED (4)
COMPLETED / CANCELLED → no further
```

**Note:** Task status IDs in the task view component differ from compliance:
`1=In Progress, 2=Pending, 4=Cancelled, 5=Completed`

---

## 8. Common Functions (`CommonComponents/commonFunctions.js`)

| Function | Input | Output | Use |
|----------|-------|--------|-----|
| `formatDateToYMD(value)` | `Date` or `"yyyymmdd"` string | `"07 Jun 2025"` | Display dates in tables and detail views |
| `parseUTCDateString(dateStr)` | 14-char string `"yyyymmddHHmmss"` | `Date` object | Parse API timestamps |
| `parseYYYYMMDDToEndOfDay(dateString)` | `"yyyymmdd"` | `Date` at 23:59:58 | Date picker max/min bounds |
| `parseYYYYMMDDHHmmssToDate(dateString)` | `"yyyymmddHHmmss"` | `Date` | General timestamp parsing |
| `getDueDateTimeNumber(dueDate, dueTime)` | `"yyyymmdd"`, `"HHmmss"` | `number` (ms) | Used in manual sort comparator |
| `getAllowedStatuses(currentStatusId)` | `number` | `{ currentStatus, allowedStatuses[] }` | Drives compliance status dropdown |
| `formatGeneratedOnDateTime(dateStr, timeStr)` | `"yyyymmdd"`, `"HHmmss"` | `"10:30 AM 07 Jun 2025"` | Report "Generated On" display |
| `parseBackendDate(dateStr)` | `"yyyymmddHHmmss"` | `Date` | General backend date parse |

**Date format used throughout:** All dates from the API arrive as `"yyyymmdd"` (8 chars) or `"yyyymmddHHmmss"` (14 chars) strings. Never ISO format.

---

## 9. API Actions Reference

All actions are in `src/store/actions/ComplainSettingActions.js`.

### Read APIs
| Action | Payload | Updates Redux key |
|--------|---------|-------------------|
| `GetComplianceAndTaskStatusesAPI` | — | `GetComplianceAndTaskStatuses` |
| `listOfComplianceByCreatorApi` | `{ complianceTitle, dueDateFrom, dueDateTo, authorityShortCode, tagsCSV, criticalityIds, statusIds, pageNumber, length }` | `listOfComplianceByCreator` |
| `SearchComplianceForMeApi` | `{ complianceTitle, dueDateFrom, dueDateTo, authorityShortCode, sRow, length }` | `SearchComplianceForMe` |
| `ViewComplianceDetailsByViewTypeAPI` | `{ complianceId, viewType }` | `ViewComplianceByMeDetails` |
| `GetComplianceChecklistsByComplianceIdAPI` | `{ complianceId }` | `GetComplianceChecklistsByComplianceId` |
| `GetComplianceChecklistsWithTasksByComplianceIdAPI` | `{ complianceId }` | `GetComplianceChecklistsWithTasksByComplianceId` |
| `GetComplianceChecklistsWithTasksByComplianceIdForMeAPI` | `{ complianceId }` | same key |
| `GetAllAuthoritiesWithoutPaginationAPI` | — | `AllAuthoritiesWithoutPagination` |
| `GetAllTagsByOrganizationIDAPI` | `{ searchText }` | `AllTagsByOrganizationID` |
| `CheckComplianceTitleExistsAPI` | `{ complianceTitle, authorityId, complianceId? }` | — (returns boolean inline) |
| `CheckChecklistTitleExistsAPI` | `{ checklistTitle, complianceId }` | — (returns boolean inline) |

### Dashboard APIs
| Action | Payload |
|--------|---------|
| `GetQuarterlySubmittedComplianceAPI` | `{ viewType }` |
| `GetComplianceUpcomingDeadlineAPI` | `{ viewType }` |
| `GetComplianceQuarterlyTasksDashboardAPI` | `{ viewType }` |
| `GetComplianceByDashboardAPI` | `{ viewType, filterBy }` |
| `GetComplianceTasksDashboardAPI` | `{ viewType, filterBy }` |
| `GetComplianceReopenDashboardAPI` | `{ viewType, filterBy }` |

### Write APIs
| Action | When called |
|--------|-------------|
| `AddComplianceAPI` | Create compliance (Details tab → Next) |
| `EditComplianceAPI` | Edit compliance (Details tab → Next) |
| `AddReopenComplianceAPI` | Reopen compliance modal → Save |
| `AddComplianceChecklistAPI` | Add checklist |
| `EditComplianceChecklistAPI` | Edit checklist |
| `DeleteCheckListAPI` | Delete checklist |
| `ChangeTaskStatusAPI` | Inline task status change in task table |
| `SaveComplianceFilesAPI` | Upload attachment files |
| `SaveComplianceDocumentsAndMappingsAPI` | Map uploaded files to compliance |
| `clearAuthorityMessage` | Clear toast message from Redux after display |

---

## 10. Data Flow Diagrams

### Create Compliance Flow
```
User clicks "Create Compliance"
  → setCreateEditComplaince(true) + setComplianceAddEditViewState(1)
  → CreateEditCompliance renders (tab 1: ComplianceDetails)
  → User fills form → clicks "Next"
  → AddComplianceAPI called
  → complianceId set in context
  → checkListTabs = 2 (Checklists tab unlocked)
  → User adds checklists → AddComplianceChecklistAPI
  → checklistCount > 0 → Tasks tab unlocked
  → User adds tasks → standard Task modal → ChangeTaskStatusAPI etc.
  → User closes → setCreateEditComplaince(false) → back to ComplianceByMe list
```

### View Compliance Flow
```
User clicks "View Details" in ComplianceByMe or ComplianceForMe
  → ViewComplianceDetailsByViewTypeAPI dispatched (viewType: 1 or 2)
  → setShowViewCompliance(true)
  → ViewCompliance renders
  → Redux: ViewComplianceByMeDetails populated
  → useEffect maps data → setComplianceDetailsState + setAllCheckListByComplianceId
  → Tab 1 (Details): ViewComplianceDetails renders
  → Tab 2 (Tasks): ViewComplianceTasks renders
      → GetComplianceChecklistsWithTasksByComplianceIdAPI dispatched
```

### Status Change Flow (e.g. On Hold)
```
User selects "On Hold" in status dropdown (ViewComplianceDetails)
  → setTempSelectedComplianceStatus({ value: 7, label: "On Hold" })
  → setComplianceOnHoldModal(true)
  → ComplianceStatusOnHoldModal: user selects scope
  → setComplianceStatusChangeReasonModal(true)
  → ComplianceStatusOnHoldReasonModal: user enters reason → Proceed
  → EditComplianceAPI called with new status + reason
  → ViewComplianceDetailsByViewTypeAPI re-fetched to refresh data
  → Toast notification shown via ResponseMessage
```

### Dashboard Filter Flow
```
User selects "Criticality" in ComplianceBy dropdown
  → setComplianceDashboardFilter("Criticality")
  → context change triggers fetchComplianceByData useCallback
  → GetComplianceByDashboardAPI dispatched with { viewType, filterBy: "Criticality" }
  → ComplianceBy tile re-renders with new top-3 records
  (Other tiles are NOT re-fetched)
```

---

*Document covers ComplianceUser v5.0 — Axi Compliance Module for Diskus.*
*Last updated: March 2026*
