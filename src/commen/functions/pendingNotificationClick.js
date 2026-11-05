// A notification click that was held back because the user is inside another
// meeting ("Are you sure you want to leave the meeting?"). If the user confirms, the
// leave flow runs the click afterwards; if they decline, it is dropped.
//
// Kept outside React state on purpose: the notification list that owns the click
// handler is a popover that can be unmounted by the time the leave finishes.
let pendingClick = null;

export const setPendingNotificationClick = (run) => {
  pendingClick = run;
};

export const clearPendingNotificationClick = () => {
  pendingClick = null;
};

// Returns the held click (and forgets it) so it can only run once.
export const takePendingNotificationClick = () => {
  const run = pendingClick;
  pendingClick = null;
  return run;
};
