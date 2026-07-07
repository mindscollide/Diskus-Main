import * as actions from "../action_types";

const initialState = {
  loading: false,
  responseMessage: "",
  errorSeverity: null,
  AllAgendas: [],
};

const AgendaWiseAgendaListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ALL_AGENDAWISE_AGENDA_INIT:
      return {
        ...state,
        loading: true,
      };

    case actions.GET_ALL_AGENDAWISE_AGENDA_SUCCESS:
      return {
        ...state,
        loading: false,
        AllAgendas: action.response,
        responseMessage: action.message,
        errorSeverity: "success",
      };

    case actions.GET_ALL_AGENDAWISE_AGENDA_FAILED:
      return {
        ...state,
        loading: false,
        AllAgendas: [],
        responseMessage: action.message,
        errorSeverity: "error",
      };

    default:
      return state;
  }
};

export default AgendaWiseAgendaListReducer;
