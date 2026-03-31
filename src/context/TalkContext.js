import React, { createContext, useContext, useState } from "react";

/**
 * @context TalkContext
 * @description Provides state for the in-app video/talk feature icon visibility
 * to the component tree, allowing components to reactively toggle the active
 * state of the video icon in the navigation or toolbar.
 *
 * @provides {boolean}  activeVideoIcon    - Whether the video icon is currently active
 * @provides {Function} setActiveVideoIcon - Setter to toggle the video icon active state
 *
 * Usage:
 *   import { useTalkContext } from '../context/TalkContext';
 *   const { activeVideoIcon, setActiveVideoIcon } = useTalkContext();
 */

// Create a Context
const TalkContext = createContext();

// Create a Provider component
export const TalkProvider = ({ children }) => {
  const [activeVideoIcon, setActiveVideoIcon] = useState(false);

  return (
    <TalkContext.Provider value={{ activeVideoIcon, setActiveVideoIcon }}>
      {children}
    </TalkContext.Provider>
  );
};

/**
 * @hook useTalkContext
 * @description Consumes TalkContext and returns the video/talk icon state and
 *   its setter. Does not guard against usage outside the provider.
 * @returns {{ activeVideoIcon: boolean, setActiveVideoIcon: Function }} TalkContext value
 */
// Custom hook to use the TalkContext
export const useTalkContext = () => {
  return useContext(TalkContext);
};
