/**
 * Shared helpers for the Notes module, extracted to remove duplication
 * between Notes.js, the dashboard Notes widget, and their various
 * search/pagination/reset handlers. Behavior-preserving: field names,
 * defaults, and localStorage keys match the original inline objects.
 */

// Default search payload for the GetNotes API. Pass `overrides` to change
// only the fields that vary per call site (Title, CreatedDate, PageNumber,
// Length, the is* filter flags).
export const buildNotesSearchPayload = (overrides = {}) => {
  const createrID = localStorage.getItem("userID");
  const OrganizationID = localStorage.getItem("organizationID");
  return {
    UserID: parseInt(createrID),
    OrganizationID: JSON.parse(OrganizationID),
    Title: "",
    isDocument: false,
    isSpreadSheet: false,
    isPresentation: false,
    isForms: false,
    isImages: false,
    isPDF: false,
    isVideos: false,
    isAudios: false,
    isSites: false,
    CreatedDate: "",
    PageNumber: 1,
    Length: 50,
    ...overrides,
  };
};

// Maps raw GetNotes API note records to the shape the Notes list UI expects.
export const normalizeNotesList = (rawNotes) => {
  const notes = [];
  rawNotes.forEach((data) => {
    notes.push({
      date: data.date,
      description: data.description,
      fK_NotesStatus: data.fK_NotesStatus,
      fK_OrganizationID: data.fK_OrganizationID,
      fK_UserID: data.fK_UserID,
      isAttachment: data.isAttachment,
      isStarred: data.isStarred,
      modifiedDate: data.modifiedDate,
      modifiedTime: data.modifiedTime,
      notesAttachments: data.notesAttachments,
      notesStatus: data.notesStatus,
      organizationName: data.organizationName,
      pK_NotesID: data.pK_NotesID,
      time: data.time,
      title: data.title,
      username: data.username,
    });
  });
  return notes;
};
