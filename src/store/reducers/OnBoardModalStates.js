import * as actions from "../action_types";

const initialState = {
  show: false,
  isDetails: true,
  isAgenda: false,
  isAttendees: false,
  modalSteps: false,
  Loader: false,
};
const OnBoardModalStates = (state = initialState, action) => {
  switch (action.type) {
    case actions.STEPS_MODAL_STATE: {
      return {
        ...state,
        modalSteps: action.response,
      };
    }
    case actions.SHOW_MODAL_STATE: {
      return {
        ...state,
        show: action.response,
      };
    }
    case actions.ISDETAIL_MODAL_STATE: {
      return {
        ...state,
        isDetails: action.response,
      };
    }
    case actions.ISAGENDA_MODAL_STATE: {
      return {
        ...state,
        isAgenda: action.response,
      };
    }
    case actions.ISATTENDEES_MODAL_STATE: {
      return {
        ...state,
        isAttendees: action.response,
      };
    }
    case actions.CURRENT_URL_CHECK: {
      return {
        ...state,
        Loader: action.response,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default OnBoardModalStates;
