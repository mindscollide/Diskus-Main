import * as actions from "../action_types";


const showModalStepsOnboard = (response) => {
    console.log("showModalStepsOnboard", response);
    return {
        type: actions.STEPS_MODAL_STATE,
        response: response,
    };
};

const showModalOnboard = (response) => {
    console.log("showModalOnboard", response);
    return {
        type: actions.SHOW_MODAL_STATE,
        response: response,
    };
};
const showIsDetailOnboard = (response) => {
    console.log("showIsDetailOnboard", response);
    return {
        type: actions.ISDETAIL_MODAL_STATE,
        response: response,
    };
};
const showIsAgendaOnboard = (response) => {
    console.log("showIsAgendaOnboard", response);
    return {
        type: actions.ISAGENDA_MODAL_STATE,
        response: response,
    };
};
const showIsAttendeesOnboard = (response) => {
    console.log("showIsAttendeesOnboard", response);
    return {
        type: actions.ISATTENDEES_MODAL_STATE,
        response: response,
    };
};
export {
    showModalOnboard,
    showIsDetailOnboard,
    showIsAgendaOnboard,
    showIsAttendeesOnboard,
    showModalStepsOnboard
};
