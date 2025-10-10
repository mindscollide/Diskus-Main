import React from "react";
import styles from "./AlreadyInMeeting.module.css";
import Cross_Icon from "../../../assets/images/Cross_Icon.png";
import { useTranslation } from "react-i18next";

const AlreadyInMeeting = () => {
  const { t } = useTranslation();

  const handleClickClose = () => {
    window.close();
  }
  return (
    <div className={styles.ChromeExperience_Wrapper}>
      <div className={styles.Chrome_Backdrop}></div>
      <div className={styles.ChromeExperience_Box}>
        <img
          src={Cross_Icon}
          onClick={handleClickClose}
          className={styles.ChromeExperience_Box_Cross}
          alt='Cross Icon '
        />
        <p className={styles.Chrome_Tagline}>
          {t("You-are-already-in-a-meeting")}
        </p>
      </div>
    </div>
  );
};

export default AlreadyInMeeting;
