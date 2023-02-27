import { Button, Paper, Loader } from "../../../../../components/elements";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./TwoFactor.css";
import DiskusLogo from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img2 from "../../../../../assets/images/2.png";
import img3 from "../../../../../assets/images/3.png";
// import img4 from "../../../../assets/images/4.png";
import img5 from "../../../../../assets/images/5.png";
import img10 from "../../../../../assets/images/10.png";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";

import LanguageChangeIcon from '../../../../../assets/images/newElements/Language.svg'
import { sendTwoFacAction } from "../../../../../store/actions/TwoFactorsAuthenticate_actions";
// import DiskusAuthPageLogo from "../../../../../assets/images/newElements/DiskusAuthPageLogo.svg";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
const TwoFactor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const { Authreducer } = useSelector((state) => state);
  const [sendCodeEmailPhone, setSendCodeEmailPhone] = useState(false);
  const [sendCodeEmail, setSendCodeEmail] = useState(false);
  const onChangeHandlerTwoFactor = (e) => {
    setSendCodeEmailPhone(true);
    setSendCodeEmail(false);
  };
  const onChangeHandlerSendEmail = (e) => {
    setSendCodeEmail(true);
    setSendCodeEmailPhone(false);
  };

  // translate Languages start
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];
  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4
  );
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60
  );
  
  const currentLocale = Cookies.get("i18next") || "en";

  const [language, setLanguage] = useState(currentLocale);

  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };
  const currentLangObj = languages.find((lang) => lang.code === currentLocale);
  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);
  console.log("currentLocale", currentLocale);
  let currentLanguage = localStorage.getItem("i18nextLng");

  // translate Languages end

  const onClickHnadler = (e) => {
    e.preventDefault();
    let userID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
      UserID: JSON.parse(userID),
      Device: "Browser",
      DeviceID: "c",
      OrganizationID: JSON.parse(OrganizationID),
      isEmail: sendCodeEmail,
      isSMS: sendCodeEmailPhone,
      isDevice: false,
      UserDevices: [],
    };
    localStorage.setItem("GobackSelection", 1);
    dispatch(sendTwoFacAction(t, navigate, Data, setSeconds, setMinutes));
  };

  return (
    <>

      <Row>
        <Col className="languageselect-box">

          <select
            className="select-language-signin_twofac"
            onChange={handleChangeLocale}
            value={language}
          >
            {languages.map(({ name, code }) => (
              <option key={code} value={code} className="language_options">
                {name}
              </option>
            ))}

          </select>
          <img src={LanguageChangeIcon} className="languageIcon_twofac" />
        </Col>
      </Row>
      <Container fluid className="auth_container">
        <Row>
          <Col
            lg={5}
            md={5}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100"
          >
            <Paper className="Two_fac_auth_paper">
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="d-flex justify-content-center "
                >
                  <img src={DiskusLogo} alt="diskus_logo" width={220} />
                </Col>
              </Row>

              <Form>
                <Row className="my-0">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center flex-column "
                  >
                    <h3 className="VerifyHeadingtwofac">{t("2fa-verification")}</h3>
                    <span className="SelectLinetwofac">
                      {t("Select-any-one-option")}
                    </span>
                  </Col>
                </Row>

                <Row className="EmailBoxtwofac">
                  <Col sm={12} md={12} lg={12} className="mt-2">
                  <Row className="px-2">
                      <Col sm={12} md={1} lg={1}>
                        {" "}
                        <img width={"15px"} className={!sendCodeEmailPhone ? "two_fac_image" : "two_fac_image_active"  } src={img10} alt="" />
                      </Col>
                      <Col sm={12} md={9} lg={9}>
                        {" "}
                        <span
                          className={
                            !sendCodeEmailPhone
                              ? "EmailLabeltwofacboth_active "
                              : " EmailLabeltwofacboth"
                          }
                        >
                          {t("Send-code-on-sms")}
                        </span>
                      </Col>
                      <Col sm={12} md={2} lg={2} className="d-flex justify-content-end">
                        <Form.Check
                          type="radio"
                          name="TwoFactor"
                          onChange={onChangeHandlerTwoFactor}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2 px-2">
                      <Col sm={12} md={1} lg={1}>
                        <img width={"17px"} src={img5} className={!sendCodeEmail ? "two_fac_image" : "two_fac_image_active"  } alt="" />
                      </Col>
                      <Col sm={12} md={9} lg={9}>
                        <span
                          className={
                            !sendCodeEmail
                              ? "sendCodeEmail_active"
                              : "sendCodeEmail"
                          }
                        >
                          {t("Send-code-on-email")}
                        </span>
                      </Col>
                      <Col sm={12} md={2} lg={2} className="d-flex justify-content-end">
                        <Form.Check
                          type="radio"
                          name="TwoFactor"
                          onChange={onChangeHandlerSendEmail}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-5 d-flex justify-content-center">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="d-flex justify-content-center Next_button_EmailVerifyForTwoFac "
                  >
                    <Button
                      text={t("Verify").toUpperCase()}
                      onClick={onClickHnadler}
                      disableBtn={
                        sendCodeEmail || sendCodeEmailPhone ? false : true
                      }
                      iconClass="d-none"
                      pdfIconClass="d-none"
                      align="center"
                    />
                  </Col>
                </Row>
              </Form>
              <Row className="mt-1">
                <Col sm={12} md={12} lg={12} className="forogt_email_link">
                  <Link to="/">{t("Go-back")}</Link>
                </Col>
              </Row>
            </Paper>
          </Col>
          <Col md={7} lg={7} sm={12} className="p-0">
            <Row>
              <Col sm={12} md={6} lg={6} className="position-relative" >
                <img src={img2} alt="auth_icon" width="380px" className="phone-image user-select-none" />
              </Col>
              <Col sm={12} md={6} lg={6} className="position-relative vh-100" >
                <img
                  src={img3}
                  alt="auth_icon"
                  width="600px"
                  className="Auth_Icon"
                />
              </Col>
            </Row>
            {/* <div className="parent-class-images positionRelative">
              <div className="Auth_Icon1_Two_fac">
         
              </div>
              <div className="circle-image_Two_Fac">
             
              </div>
            </div> */}
          </Col>
        </Row>
      </Container>
      {Authreducer.Loading ? <Loader /> : null}
    </>
  );
};

export default TwoFactor;
