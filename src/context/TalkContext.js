/**
 * @file TalkContext.js
 * @description Manages UI state for the Talk (video/audio communication) feature.
 * Tracks whether the video icon in the talk interface is in an active (highlighted) state.
 *
 * Exposed values:
 * - `activeVideoIcon` {boolean} - Whether the video icon is currently marked as active.
 * - `setActiveVideoIcon` {Function} - Setter to toggle the active state of the video icon.
 *
 * Consumed by Talk/chat components that render a video call button or icon and need
 * to reflect the current active state of the video feature.
 */

import React, { createContext, useContext, useState } from "react";

// Create a Context
const TalkContext = createContext();

/**
 * TalkProvider component that supplies video icon active state
 * to the component tree via TalkContext.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components that will have access to the context.
 * @returns {JSX.Element}
 */
export const TalkProvider = ({ children }) => {
  const [activeVideoIcon, setActiveVideoIcon] = useState(false);

  return (
    <TalkContext.Provider value={{ activeVideoIcon, setActiveVideoIcon }}>
      {children}
    </TalkContext.Provider>
  );
};

/**
 * Custom hook to consume TalkContext.
 * Must be used within a {@link TalkProvider}.
 *
 * @returns {{ activeVideoIcon: boolean, setActiveVideoIcon: Function }} The talk context value.
 */
export const useTalkContext = () => {
  return useContext(TalkContext);
};
