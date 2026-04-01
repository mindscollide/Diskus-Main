# React Context Providers Guide

## Overview

Diskus uses React Context alongside Redux for state management. While Redux handles global, persistent state that spans the entire app, Contexts handle domain-specific state tightly coupled to specific feature trees.

All providers are mounted in `src/index.js`, wrapping the entire application.

---

## Context Provider Reference

### `AuthContext`
- **File:** `src/context/AuthContext.js`
- **Hook:** `useAuthContext()`
- **Purpose:** Manages authentication state and exposes the `signOut` helper function.
- **Key values exposed:**
  - `signOut(dispatch)` — clears tokens from localStorage/sessionStorage, resets Redux state, and redirects to login
- **Used by:** `App.js` (for cross-tab logout via BroadcastChannel), any component needing auth-aware actions

---

### `TalkContext`
- **File:** `src/context/TalkContext.js`
- **Hook:** `useTalkContext()` (if defined)
- **Purpose:** Manages state for the real-time Talk (messaging) feature. Handles Socket.io connection lifecycle and messaging state that needs to be shared across the Talk sidebar and other parts of the UI.
- **Used by:** Talk layout components, chat windows, notification badges

---

### `MeetingContext`
- **File:** `src/context/MeetingContext.js`
- **Purpose:** Shared state for the meeting module — active meeting data, modal states, and UI flags used across meeting-related components.
- **Used by:** Meeting containers, meeting modals, calendar module

---

### `GroupsContext`
- **File:** `src/context/GroupsContext.js`
- **Purpose:** State for the Groups module — group lists, selected group, membership data.
- **Used by:** Groups container, group modals, Talk (groups appear as chat rooms)

---

### `CommitteeContext`
- **File:** `src/context/CommitteeContext.js`
- **Purpose:** State for the Committee module — committee lists, active committee, membership.
- **Used by:** Committee container and related modals

---

### `DataroomContext`
- **File:** `src/context/DataroomContext.js`
- **Purpose:** State for the Data Room — current folder, selected files, upload queue, viewer state.
- **Used by:** DataRoom container, document viewer, signature flow components

---

### `PollsContext`
- **File:** `src/context/PollsContext.js`
- **Purpose:** State for the Polling module — poll list, active poll, voting state.
- **Used by:** Polling container and related modals

---

### `NotesContext`
- **File:** `src/context/NotesContext.js`
- **Purpose:** State for the Notes module — notes list, active note, editor state.
- **Used by:** Notes container

---

### `ResolutionContext`
- **File:** `src/context/ResolutionContext.js`
- **Purpose:** State for the Resolutions module — resolution list, approval workflow state.
- **Used by:** Resolution container and related modals

---

### `ComplianceContext`
- **File:** `src/context/ComplianceContext.js`
- **Purpose:** State for the Compliance module — compliance items, status tracking.
- **Used by:** `MainCompliance` (user compliance view), mounted globally in `index.js` and also scoped in `routes.js`
- **Note:** This context is mounted **twice** — once globally at the app root, and once locally in routes. The local mount ensures compliance state is reset when navigating away.

---

### `AuthorityContext`
- **File:** `src/context/AuthorityContext.js`
- **Purpose:** State for admin-level compliance authority management.
- **Used by:** `/Admin/manageAuthority` route only — scoped to that route via the `<AuthorityProvider>` wrapper in `routes.js`
- **Note:** Unlike other contexts, this is **not** mounted globally. It's scoped to the admin compliance routes.

---

### `NewMeetingContext`
- **File:** `src/context/NewMeetingContext.js`
- **Purpose:** State specific to the new meeting creation flow.
- **Used by:** `/Diskus/Meeting` route only — scoped to that route via `<NewMeetingProvider>` wrapper in `routes.js`
- **Note:** Scoped to the meeting route to keep meeting-creation state isolated and reset on navigation.

---

## When to Use Context vs Redux

| Scenario | Use |
|----------|-----|
| Data needed across unrelated components (e.g., user profile in navbar and settings page) | Redux |
| Data that persists across route changes | Redux |
| Complex async operations with loading/error states | Redux (with Thunk) |
| State tightly scoped to a single feature module | Context |
| State that should reset when leaving a module | Context (scoped to route) |
| Simple state passed only a few levels deep | Local `useState` |

---

## Accessing Context in Components

```jsx
import { useAuthContext } from '../context/AuthContext';

const MyComponent = () => {
  const { signOut } = useAuthContext();
  // ...
};
```

---

## Adding a New Context

1. Create `src/context/MyContext.js`:

```jsx
import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [myState, setMyState] = useState(null);

  return (
    <MyContext.Provider value={{ myState, setMyState }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
```

2. Mount the provider:
   - **Globally** (needed across many modules): add `<MyProvider>` in `src/index.js`
   - **Scoped to a route**: wrap the route element in `routes.js` with `<MyProvider>`
