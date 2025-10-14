import React from "react";
import styles from "./AlreadyInMeeting.module.css";
import Cross_Icon from "../../../assets/images/Cross_Icon.png";
import { useTranslation } from "react-i18next";
import WarningIcon from "../../../assets/images/WarningIcon.png";
import CustomButton from "../button/Button";

const AlreadyInMeeting = ({ handleClickClose }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.ChromeExperience_Wrapper}>
      <div className={styles.Chrome_Backdrop}></div>
      <div className={styles.ChromeExperience_Box}>
        {/* <img
          src={Cross_Icon}
          onClick={handleClickClose}
          className={styles.ChromeExperience_Box_Cross}
          alt='Cross Icon '
        /> */}
        <img
          src={WarningIcon}
          width={32}
          height={32}
          alt='warning_icon'
          className='mt-4'
        />
        <p className={styles.Chrome_Tagline}>
          {t("This-tab-will-become-active-again-once-you-leave-the-meeting")}
        </p>
        {/* <CustomButton onClick={handleClickClose} className={styles.Closebtn} text={"Close"} /> */}
      </div>
    </div>
  );
};

export default AlreadyInMeeting;
