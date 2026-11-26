import { useSelector } from "react-redux";

/**
 * How many months before / after today the calendar APIs (GetCalenderList) ask for.
 *
 * The value comes from the user settings API (GetUserSettings). Right after login it is
 * not known yet, and the calendars used to read localStorage straight away: with nothing
 * stored they requested a span of 1, and a moment later (once the settings arrived and
 * localStorage was filled) the dashboard calendar re-requested with the real span, so the
 * same screen sent two different request payloads. Now every calendar waits for the value.
 *
 * Returns a positive integer, or null while the settings are still unknown (the caller
 * should not call the API yet). A stored 0 is treated as 1, as the dashboard always did.
 */
const toSpan = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return null;
  return n === 0 ? 1 : n;
};

const useCalendarMonthsSpan = () => {
  // the settings in the store are the freshest source; localStorage (filled by the same
  // API) covers a page refresh before the store is loaded again
  const fromStore = useSelector(
    (state) => state.settingReducer?.UserProfileData?.userSettings?.calenderMonthsSpan,
  );
  let fromStorage = null;
  try {
    fromStorage = localStorage.getItem("calenderMonthsSpan");
  } catch (e) {
    fromStorage = null;
  }
  return toSpan(fromStore) ?? toSpan(fromStorage);
};

export default useCalendarMonthsSpan;
