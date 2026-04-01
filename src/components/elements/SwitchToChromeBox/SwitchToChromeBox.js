import React from "react";
import styles from "./SwitchToChromeBox.module.css";
import Chrome_Logo from "../../../assets/images/Chrome_Logo.png";
import Cross_Icon from "../../../assets/images/Cross_Icon.png";
import { useTranslation } from "react-i18next";

/**
 * @component SwitchToChromeBox
 * @description Renders an overlay prompt that encourages users who are not on Google Chrome
 * to switch browsers for the best Diskus experience. The overlay consists of a semi-transparent
 * backdrop and a centred box displaying the Chrome logo, a heading, and a tagline sourced from
 * i18n strings. A close (cross) icon allows the user to dismiss the prompt.
 *
 * @param {Function} handleClickClose - Callback invoked when the cross icon is clicked,
 *   used to hide this overlay from the parent.
 *
 * @example
 * <SwitchToChromeBox handleClickClose={() => setShowChromePrompt(false)} />
 */
const SwitchToChromeBox = ({ handleClickClose }) => {
  const { t } = useTranslation();
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
        <img src={Chrome_Logo} width={68} alt='Chrome Logo' />
        <h2 className={styles.Chrome_Heading}>{t("Switch-to-chrome")}</h2>
        <p className={styles.Chrome_Tagline}>
          {t("For-the-best-experience-please-use-diskus-in-google-chrome")}
        </p>
      </div>
    </div>
  );
};

export default SwitchToChromeBox;
