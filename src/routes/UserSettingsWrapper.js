/**
 * @file UserSettingsWrapper.js
 * @description Lazy-loading wrapper around the `UserSettings` page that defers
 * rendering until both required pieces of Redux state are available:
 *
 *  1. `settingReducer.UserProfileData` — the user's profile/settings record.
 *  2. `settingReducer.googleClientID`  — the Google OAuth client ID needed for
 *     the Google Calendar sync toggle (only required when
 *     `userAllowGoogleCalendarSynch` is truthy).
 *
 * While waiting, a centred `<Spin />` (Ant Design) is shown.  This prevents
 * `UserSettings` from mounting with `undefined` props and avoids a flash of
 * empty content.
 *
 * Mounted at the `/Diskus/setting` route inside `routes.js`.
 */
import { useSelector } from "react-redux";
import UserSettings from "../container/setting/UserLevelSettings/UserSettings";
import { Spin } from "antd";

/**
 * Renders a loading spinner until profile data (and optionally the Google
 * client ID) is ready, then renders `<UserSettings>`.
 *
 * @returns {JSX.Element} Spinner or `<UserSettings>`.
 */
const UserSettingsWrapper = () => {
  const googleClientID = useSelector(
    (state) => state.settingReducer.googleClientID
  );
  const settingReducerData = useSelector(
    (state) => state.settingReducer.UserProfileData
  );

  // If settingReducerData hasn't loaded yet, wait
  if (!settingReducerData) {
    return (
      <section className="userSettingDataLoading">
        <Spin />
      </section>
    );
  }

  const isGoogleSyncAllowed = settingReducerData.userAllowGoogleCalendarSynch;

  // Wait until googleClientID is loaded if sync is allowed
  if (isGoogleSyncAllowed !== null && googleClientID === null) {
    return (
      <section className="userSettingDataLoading">
        <Spin />
      </section>
    ); // or your custom spinner
  }
  console.log("googleClientID", googleClientID);

  return (
    <UserSettings googleClientIDs={googleClientID ? googleClientID : null} />
  );
};

export default UserSettingsWrapper;
