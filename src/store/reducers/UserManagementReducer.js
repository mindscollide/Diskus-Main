import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
};

const UserMangementReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return { ...state };
  }
};

export default UserMangementReducer;
