// Values of the polls status filter (match pollStatus.status from the API).
export const POLL_STATUS_VALUES = ["Published", "UnPublished", "Expired"];

// Filter menu entries: { text, value } with translated text.
export const getPollStatusFilters = (t) =>
  POLL_STATUS_VALUES.map((value) => ({ text: t(value), value }));
