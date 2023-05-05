import * as actions from '../action_types'


const initialState = {
    Loading: false,
    ResponseMessage: "",
    SaveFilesResponse: null,
    UploadDocumentsResponse: null,
    SaveFolderResponse: null,
    getMyDocumentsResponse: null,
    getFolderDocumentResponse: null,
    createFolderResponse: null,
    getAllDocumentandShareFolderResponse: null,
    shareFilesResponse: null,
    shareFilesandFoldersResponse: null
}


const DataRoomReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SAVEFILES_DATAROOM_INIT:
        case actions.SAVEFILES_DATAROOM_SUCCESS:
        case actions.SAVEFILES_DATAROOM_FAIL:
        case actions.UPLOAD_DOCUMENTS_DATAROOM_INIT:
        case actions.UPLOAD_DOCUMENTS_DATAROOM_SUCCESS:
        case actions.UPLOAD_DOCUMENTS_DATAROOM_FAIL:
        case actions.SAVE_FOLDER_DATAROOM_INIT:
        case actions.SAVE_FOLDER_DATAROOM_SUCCESS:
        case actions.SAVE_FOLDER_DATAROOM_FAIL:
        case actions.GETMYDOCUMENTS_DATAROOM_INIT:
        case actions.GETMYDOCUMENTS_DATAROOM_SUCCESS:
        case actions.GETMYDOCUMENTS_DATAROOM_FAIL:
        case actions.GET_FOLDER_DOCUMENTS_DATAROOM_INIT:
        case actions.GET_FOLDER_DOCUMENTS_DATAROOM_SUCCESS:
        case actions.GET_FOLDER_DOCUMENTS_DATAROOM_FAIL:
        case actions.CREATE_FOLDER_DATAROOM_INIT:
        case actions.CREATE_FOLDER_DATAROOM_SUCCESS:
        case actions.CREATE_FOLDER_DATAROOM_FAIL:
        case actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_INIT:
        case actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_SUCCESS:
        case actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_FAIL:
        case actions.SHAREFILES_DATAROOM_INIT:
        case actions.SHAREFILES_DATAROOM_SUCCESS:
        case actions.SHAREFILES_DATAROOM_FAIL:
        case actions.GET_ALLSHAREDFILESANDFOLDER_DATAROOM_INIT:
        case actions.GET_ALLSHAREDFILESANDFOLDER_DATAROOM_SUCCESS:
        case actions.GET_ALLSHAREDFILESANDFOLDER_DATAROOM_FAIL:


        default: return { ...state }
    }
}
export default DataRoomReducer