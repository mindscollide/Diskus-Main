import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
} from "../../../../../components/elements";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./SignInDenied.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img9 from "../../../../../assets/images/9.png";
import img10 from "../../../../../assets/images/10.png";
import { useSelector, useDispatch } from "react-redux";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import logo from "../../../../../assets/images/signinlogo.svg";
import { useTranslation } from "react-i18next";
import LanguageChangeIcon from "../../../../../assets/images/newElements/Language.svg";
import Helper from "../../../../../commen/functions/history_logout";
import LanguageSelector from "../../../../../components/elements/languageSelector/Language-selector";

const SigninDenied = () => {
  const { t, i18n } = useTranslation();
  const { Authreducer } = useSelector((state) => state);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [verifyOTP, setVerifyOTP] = useState(null);
  let GobackSelection = localStorage.getItem("GobackSelection");
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  // translate Languages start
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const [language, setLanguage] = useState(currentLocale);

  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    i18n.changeLanguage(lang);
  };

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);
  console.log("currentLocale", currentLocale);
  let currentLanguage = localStorage.getItem("i18nextLng");

  // translate Languages end

  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4
  );
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60
  );

  useEffect(() => {
    // if (startTimer) {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
        localStorage.setItem("seconds", seconds - 1);
        localStorage.setItem("minutes", minutes);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
          // setStartTimer(false)
          localStorage.removeItem("seconds");
          localStorage.removeItem("minutes");
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
          localStorage.setItem("seconds", 59);
          localStorage.setItem("minutes", minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  useEffect(() => {
    let s = localStorage.getItem("seconds");
    let m = localStorage.getItem("minutes");
    window.addEventListener("beforeunload ", (e) => {
      console.log("ttt");
      e.preventDefault();
      if (m != undefined && s != undefined) {
        if (s === 1) {
          setSeconds(59);
          setMinutes(m - 1);
        } else {
          setSeconds(s - 1);
          setMinutes(minutes);
        }
      } else {
        setSeconds(59);
        setMinutes(4);
      }
    });
  }, []);

  useEffect(() => {
    Helper.socket = null;
    let RememberEmailLocal = JSON.parse(localStorage.getItem("rememberEmail"));
    let RememberPasswordLocal = JSON.parse(
      localStorage.getItem("remeberPassword")
    );
    let reLang = localStorage.getItem("i18nextLng");
    if (RememberEmailLocal === true && RememberPasswordLocal === true) {
      let RememberEmailLocalValue = localStorage.getItem("rememberEmailValue");

      let RememberPasswordLocalValue = localStorage.getItem(
        "rememberPasswordValue"
      );
      
      localStorage.clear();
      if (reLang !== undefined && reLang != null) {
        localStorage.setItem("i18nextLng", reLang);
      }
      localStorage.setItem("remeberPassword", RememberPasswordLocal);
      localStorage.setItem("rememberPasswordValue", RememberPasswordLocalValue);
      localStorage.setItem("rememberEmail", RememberEmailLocal);
      localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
    } else if (RememberEmailLocal === true) {
      let RememberEmailLocalValue = localStorage.getItem("rememberEmailValue");
      
      localStorage.clear();
      if (reLang !== undefined && reLang != null) {
        localStorage.setItem("i18nextLng", reLang);
      }
      localStorage.setItem("rememberEmail", RememberEmailLocal);
      localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
    } else if (RememberPasswordLocal === true) {
      let RememberPasswordLocalValue = localStorage.getItem(
        "rememberPasswordValue"
      );
      
      localStorage.clear();
      if (reLang !== undefined && reLang != null) {
        localStorage.setItem("i18nextLng", reLang);
      }
      localStorage.setItem("remeberPassword", RememberPasswordLocal);
      localStorage.setItem("rememberPasswordValue", RememberPasswordLocalValue);
    } else {
      
      localStorage.clear();
      if (reLang !== undefined && reLang != null) {
        localStorage.setItem("i18nextLng", reLang);
      }
      localStorage.setItem("rememberEmail", false);
      localStorage.setItem("rememberEmailValue", "");
      localStorage.setItem("remeberPassword", false);
      localStorage.setItem("rememberPasswordValue", "");
    }
  }, []);

  return (
    <>
      {/* <Row>
        <Col className="languageselect-box">
          <select
            className="select-language-signin_2FAverificationdevieotp"
            onChange={handleChangeLocale}
            value={language}
          >
            {languages.map(({ name, code }) => (
              <option key={code} value={code} className="language_options">
                {name}
              </option>
            ))}
          </select>
          <img draggable="false"
            src={LanguageChangeIcon}
            className="languageIcon_2FAverificationdevieotp"
          />
        </Col>
      </Row> */}
      <Container fluid className="SigninDenied">
        <Row className="position-relative">
          <Col className="languageSelector">
            <LanguageSelector />
          </Col>
        </Row>
        <Row>
          <Col
            lg={5}
            md={5}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100"
          >
            <Paper className="loginbox_auth_paper_for_SignInDenied">
              <Col
                sm={12}
                lg={12}
                md={12}
                className="EmailVerifyBox_for_SignInDenied"
              >
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center "
                  >
                    <img
                      draggable="false"
                      src={img1}
                      width="220px"
                      height="69px"
                      alt="diskus_logo"
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center text-center "
                  >
                    <span className="MainHeading_For_SigninDenied">
                      {t("Your-sign-in-was-denied")}
                    </span>
                  </Col>
                </Row>

                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center align-item-center mt-2"
                  >
                    <img
                      draggable="false"
                      width="116px"
                      height="120.92px"
                      src={logo}
                      className="Image_logo_singin_denied"
                      alt=""
                    />
                  </Col>
                </Row>

                <Row className="mt-0 mb-2 d-flex justify-content-center">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="d-flex justify-content-center mt-5 "
                  >
                    <Button
                      text={t("Back-to-sign-in").toUpperCase()}
                      className="Next_button_EmailVerify_For_SignInDenied"
                      onClick={() => navigate("/")}
                    />
                  </Col>
                </Row>
              </Col>
            </Paper>
          </Col>

          <Col md={7} lg={7} sm={12} className="">
            <Row>
              <Col sm={12} md={6} lg={6} className="position-relative">
                <img
                  draggable="false"
                  src={img9}
                  alt="auth_icon"
                  className="phone-image"
                  width="320px"
                  height="417px"
                />
              </Col>
              <Col sm={12} md={6} lg={6} className="position-relative vh-100">
                <img
                  draggable="false"
                  src={DiskusAuthPageLogo}
                  alt="auth_icon"
                  width="600px"
                  className="denied_signIn_Auth_Icon"
                />
              </Col>
            </Row>
          </Col>

          {/* <Col
            md={7}
            lg={7}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100 roundspinner-image-SigninDenied"
          >
            <img draggable="false"
              src={img9}
              alt="auth_icon"
              className="mobile_image_two"
              width="372.81px"
              height="612.4px"
            />
          </Col> */}
        </Row>
      </Container>
    </>
  );
};

export default SigninDenied;
