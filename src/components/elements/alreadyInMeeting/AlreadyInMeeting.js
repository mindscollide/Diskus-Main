import React from "react";
import styles from "./AlreadyInMeeting.module.css";
import Cross_Icon from "../../../assets/images/Cross_Icon.png";
import { useTranslation } from "react-i18next";
import WarningIcon from "../../../assets/images/Exlimatry Icon.svg";
import CustomButton from "../button/Button";

const AlreadyInMeeting = ({ handleClickClose }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.ChromeExperience_Wrapper}>
      <div className={styles.Chrome_Backdrop}></div>
      <div className={styles.ChromeExperience_Box}>
    
        <img
          src={WarningIcon}
          width={88}
          height={62}
          alt='warning_icon'
        />
        <p className={styles.Chrome_Tagline}>
          {t("You-are-currently-in-a-meeting-this-feature-cannot-be-accessed-right-now")}
        </p>
      </div>
    </div>
  );
};

export default AlreadyInMeeting;
