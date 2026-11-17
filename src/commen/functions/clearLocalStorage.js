// Keys that are not user/session data and must survive logout / login-flow
// resets (e.g. the system language list is the same for everyone and only
// needs to be fetched once).
const PERSISTENT_KEYS = ["systemSupportedLanguages"];

// Drop-in replacement for localStorage.clear() that keeps PERSISTENT_KEYS.
export const clearLocalStorage = () => {
  const kept = {};
  PERSISTENT_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) kept[key] = value;
  });
  localStorage.clear();
  Object.entries(kept).forEach(([key, value]) =>
    localStorage.setItem(key, value),
  );
};
