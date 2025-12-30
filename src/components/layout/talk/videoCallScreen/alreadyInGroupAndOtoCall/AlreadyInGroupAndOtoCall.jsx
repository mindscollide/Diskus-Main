import React from "react";
import styles from "./AlreadyInGroupAndOtoCall.module.css";
import { useTranslation } from "react-i18next";
import AlreadyInMeeting from "../../../../elements/alreadyInMeeting/AlreadyInMeeting";

const AlreadyInGroupAndOtoCall = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.ChromeExperience_Wrapper}>
      <AlreadyInMeeting />
    </div>
  );
};

export default AlreadyInGroupAndOtoCall;
