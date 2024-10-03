import * as actions from "../action_types";

const updateCurrentEditorRole = (payload) => {
  return {
    type: actions.MEETING_EDITOR_ROLE_STATE,
    response: payload,
  };
};

export { updateCurrentEditorRole };
