/**
 * @component AuthLayout
 * @description Shared frame for the login-flow screens (sign in, password, OTP,
 * forgot password, ...). Owns everything that is identical across them: the
 * full-viewport container, the language selector, and the right-hand column
 * with the "Simplify / Collaborate / Prioritize" text, the decorative swirl and
 * the PSO "powered by" mark. Each screen only supplies its own card.
 *
 * @param {ReactNode} children - The card column(s), rendered to the left of the
 *   marketing column. Pass a <Col> (e.g. `<Col lg={4} md={4} sm={12}>`).
 * @param {ReactNode} [banner] - Optional row rendered above everything (the
 *   sign-in screen's free-trial bar).
 * @param {ReactNode} [overlay] - Optional element rendered inside the container
 *   before the content (e.g. the "switch to Chrome" box).
 * @param {boolean} [hidden] - Render only the empty container (+ overlay) and
 *   none of the content; used while the sign-in screen is handing off to a
 *   payment or email-verification redirect.
 */
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./AuthLayout.module.css";
import LanguageSelector from "../../elements/languageSelector/Language-selector";
import DiskusAuthPageLogo from "../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import PSOPowerdBy from "../../../assets/images/Logos/PowerdByDiskus.png";
import { PSO_LOGO } from "../../../commen/featureFlags";

// The screens are designed for a 1600x900 viewport.
const DESIGN_WIDTH = 1600;
const DESIGN_HEIGHT = 900;
const MAX_SCALE = 1.6;

/**
 * How much to enlarge the card relative to the design size: it grows with the
 * viewport (limited by whichever of width/height is the tighter fit so it never
 * overflows), but never shrinks below 1 - on small screens the card is already
 * at a usable size and only the marketing text shrinks.
 */
const getCardScale = () => {
  const fit = Math.min(
    window.innerWidth / DESIGN_WIDTH,
    window.innerHeight / DESIGN_HEIGHT,
  );
  return Math.min(MAX_SCALE, Math.max(1, Number(fit.toFixed(3))));
};

const AuthLayout = ({ children, banner = null, overlay = null, hidden = false }) => {
  const { t } = useTranslation();
  const [cardScale, setCardScale] = useState(getCardScale);

  useEffect(() => {
    const onResize = () => setCardScale(getCardScale());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Container
      fluid
      className={styles["auth_container"]}
      style={{ "--auth-card-scale": cardScale }}>
      {overlay}
      {!hidden && (
        <>
          {banner}
          <Row className='position-relative'>
            <Col className={styles["languageSelector"]}>
              <LanguageSelector />
            </Col>
          </Row>
          <Row className={styles["auth_row"]}>
            {children}
            <Col
              lg={8}
              md={8}
              sm={8}
              className={`position-relative d-flex ${styles["marketing_column"]}`}>
              <Col md={8} lg={8} sm={12} className={styles["Login_page_text"]}>
                <h1 className={styles["heading-1"]}>
                  {t("Simplify-management")}
                </h1>
                <h1 className={styles["heading-2"]}>{t("Collaborate")}</h1>
                <h1 className={styles["heading-1"]}>{t("Prioritize")}</h1>
              </Col>
              <Col md={4} lg={4} sm={12} className='position-relative'>
                <img
                  draggable='false'
                  src={DiskusAuthPageLogo}
                  alt='auth_icon'
                  width='600px'
                  className={styles["Auth_Icon"]}
                />
                {PSO_LOGO && (
                  <img
                    className={styles["PoweredIcon_Diskus_Icon"]}
                    src={PSOPowerdBy}
                    alt=''
                    draggable='false'
                  />
                )}
              </Col>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default AuthLayout;
