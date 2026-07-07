import { useSelector } from "react-redux";
import UserSettings from "../container/setting/UserLevelSettings/UserSettings";
import { Spin } from "antd";

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
  

  return (
    <UserSettings googleClientIDs={googleClientID ? googleClientID : null} />
  );
};

export default UserSettingsWrapper;
