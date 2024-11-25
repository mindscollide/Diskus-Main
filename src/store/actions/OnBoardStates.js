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
