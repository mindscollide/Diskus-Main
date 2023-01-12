import * as actions from '../action_types'

const initialState = {
    Loading: false,
    OrganizationCreateResponse: null,
    OrganizationCreateResponseMessage: ""
}


const createOrganizationReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SIGNUPORGANIZATION_INIT:
            return {
                ...state,
                Loading: true
            }
        case actions.SIGNUPORGANIZATION_SUCCESS:
            return {
                ...state,
                Loading: false,
                OrganizationCreateResponse: action.response,
                OrganizationCreateResponseMessage: action.message
            }
        case actions.SIGNUPORGANIZATION_FAIL:
            return {
                ...state,
                Loading: false,
                OrganizationCreateResponse: null,
                OrganizationCreateResponseMessage: action.message
            }
        default:
            return {
                ...state
            }
    }
}

export default createOrganizationReducer