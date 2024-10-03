import * as actions from "../action_types";

const initalState = {
  editorRole: {
    status: null,
    role: null,
    isPrimaryOrganizer: false,
  },
  currentMeetingId: 0,
};

const MeetingGlobalStateReducer = (state = initalState, action) => {
  switch (action.type) {
    case actions.MEETING_EDITOR_ROLE_STATE: {
      return {
        ...state,
        editorRole: {
          status: action.response.status,
          role: action.response.role,
          isPrimaryOrganizer: action.response.isPrimaryOrganizer,
        },
      };
    }

    case actions.CURRENT_ACTIVE_MEETING_ID:
      {
        return {
          ...state,
          currentMeetingId: action.payload,
        };
      }


    default:
      return {...state};
  }
};

export default MeetingGlobalStateReducer;
