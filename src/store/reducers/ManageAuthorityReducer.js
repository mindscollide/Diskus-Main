import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  deleteAuthorityModal: false,
  addEditViewAuthorityModal: false,
};

const ManageAuthorityReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.DELETE_AUTHORITY_MODAL: {
      return {
        ...state,
        deleteAuthorityModal: action.response,
      };
    }
    case actions.ADD_EDIT_VIEW_AUTHORITY_MODAL: {
      return {
        ...state,
        addEditViewAuthorityModal: action.response,
      };
    }

    default:
      return { ...state };
  }
};

export default ManageAuthorityReducer;
