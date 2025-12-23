import * as actions from "../action_types";

//Manage Authority
const showDeleteAuthorityModal = (response) => {
  return {
    type: actions.DELETE_AUTHORITY_MODAL,
    response: response,
  };
};
const showAddEditViewAuthorityModal = (response) => {
  return {
    type: actions.ADD_EDIT_VIEW_AUTHORITY_MODAL,
    response: response,
  };
};

export { showDeleteAuthorityModal, showAddEditViewAuthorityModal };
