/**
 * @file OnBoardStates.js
 * @description Lightweight Redux UI-state actions for controlling the onboarding modal
 * step, overall visibility, and detail-view flag. No API calls.
 * Dispatches: STEPS_MODAL_STATE, SHOW_MODAL_STATE, ISDETAIL_MODAL_STATE.
 */
import * as actions from "../action_types";

const showModalStepsOnboard = (response) => {
  return {
    type: actions.STEPS_MODAL_STATE,
    response: response,
  };
};

const showModalOnboard = (response) => {
  return {
    type: actions.SHOW_MODAL_STATE,
    response: response,
  };
};
const showIsDetailOnboard = (response) => {
  return {
    type: actions.ISDETAIL_MODAL_STATE,
    response: response,
  };
};
const showIsAgendaOnboard = (response) => {
  return {
    type: actions.ISAGENDA_MODAL_STATE,
    response: response,
  };
};
const showIsAttendeesOnboard = (response) => {
  return {
    type: actions.ISATTENDEES_MODAL_STATE,
    response: response,
  };
};
const currentURLCheck = (response) => {
  return {
    type: actions.CURRENT_URL_CHECK,
    response: response,
  };
};
export {
  showModalOnboard,
  showIsDetailOnboard,
  showIsAgendaOnboard,
  showIsAttendeesOnboard,
  showModalStepsOnboard,
  currentURLCheck,
};
