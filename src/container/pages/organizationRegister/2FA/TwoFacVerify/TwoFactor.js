import { Button, Paper, Loader } from "../../../../../components/elements";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./TwoFactor.css";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img2 from "../../../../../assets/images/2.png";
import img3 from "../../../../../assets/images/3.png";
// import img4 from "../../../../assets/images/4.png";
import img5 from "../../../../../assets/images/5.png";
import img10 from "../../../../../assets/images/10.png";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
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
    dispatch(sendTwoFacAction(t, navigate, Data));
  };

  return (
    <>
      <Container fluid className="auth_container">
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <select
              className="Twofactor-language"
              onChange={handleChangeLocale}
              value={language}
            >
              {languages.map(({ name, code }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </Col>
        </Row>
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
                  <img src={img1} alt="diskus_logo" />
                </Col>
              </Row>

              <Form>
                <Row className="my-0">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center flex-column"
                  >
                    <h3 className=" VerifyHeadingtwofac ">2FA Verification</h3>
                    <span className="SelectLinetwofac">
                      Select Any One Option
                    </span>
                  </Col>
                </Row>

                <Row className="EmailBoxtwofac">
                  <Col sm={12} md={12} lg={12} className="mt-2">
                    <Row>
                      <Col sm={12} md={1} lg={1}>
                        {" "}
                        <img width={"15px"} src={img10} alt="" />
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
                          SEND CODE ON SMS
                        </span>
                      </Col>
                      <Col sm={12} md={2} lg={2}>
                        {" "}
                        <Form.Check
                          type="radio"
                          name="TwoFactor"
                          value={"SEND CODE ON SMS"}
                          onChange={onChangeHandlerTwoFactor}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm={12} md={1} lg={1}>
                        {" "}
                        <img width={"17px"} src={img5} alt="" />
                      </Col>
                      <Col sm={12} md={9} lg={9}>
                        {" "}
                        <span
                          className={
                            !sendCodeEmail
                              ? "sendCodeEmail_active "
                              : " sendCodeEmail"
                          }
                        >
                          SEND CODE ON EMAIL
                        </span>
                      </Col>
                      <Col sm={12} md={2} lg={2}>
                        <Form.Check
                          type="radio"
                          name="TwoFactor"
                          value={"SEND CODE ON EMAIL"}
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
                    className="d-flex justify-content-center "
                  >
                    <Button
                      text="VERIFY"
                      className="Next_button_EmailVerifyForTwoFac "
                      onClick={onClickHnadler}
                    />
                  </Col>
                </Row>
              </Form>
              <Row className="mt-1">
                <Col sm={12} md={12} lg={12} className="forogt_email_link">
                  <Link to="/forgotpasssowrd2">Go Back</Link>
                </Col>
              </Row>
            </Paper>
          </Col>
          <Col md={7} lg={7} sm={12} className="p-0">
            <div className="parent-class-images positionRelative">
              <div className="Auth_Icon1_Two_fac">
                <img src={img2} alt="auth_icon" width="380px" />
              </div>
              <div className="circle-image_Two_Fac">
                <img
                  src={img3}
                  alt="auth_icon"
                  width="600px"
                  className="Auth_Icon"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {Authreducer.Loading ? <Loader /> : null}
    </>
  );
};

export default TwoFactor;
