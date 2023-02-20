import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
} from "../../../../../components/elements";
import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./VerificationIphone.css";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img2 from "../../../../../assets/images/2.png";
import img10 from "../../../../../assets/images/10.png";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { sendTwoFacAction } from "../../../../../store/actions/TwoFactorsAuthenticate_actions";
import { useDispatch, useSelector } from "react-redux";

import LanguageChangeIcon from '../../../../../assets/images/newElements/Language.svg'

const VerificationIphone = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [xtrazoom1, setXtrazoom1] = useState(false);
  const [oneplus, setOneplus] = useState(false);
  const [iphone, setIphone] = useState(false);
  const { Authreducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const location = useLocation();
  const [devices, setDevices] = useState([]);
  const [selectDevice, setSelectDevice] = useState(null);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const onChangeHandlerVerificationIphone = (e) => {
    console.log(e.target.value);
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
  const onChangeHandlerVerificationIphone1 = (e) => {
    console.log(e.target.value);
    setSelectDevice(JSON.parse(e.target.value));
    // setXtrazoom1(true);
    // setOneplus(false);
    // setIphone(false);
  };
  const onChangeHandlerVerificationIphone2 = (e) => {
    setOneplus(true);
    setXtrazoom1(false);
    setIphone(false);
  };
  const onChangeHandlerVerificationIphone3 = () => {
    setIphone(true);
    setXtrazoom1(false);
    setOneplus(false);
  };
  const onClickIphone = (e) => {
    e.preventDefault();
    if (selectDevice !== null) {
      let UserID = JSON.parse(localStorage.getItem("userID"));
      let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
      // navigate("/2FAverificationdevieotp", {
      //   state: { currentDevice: selectDevice },
      // });
      let Data = {
        UserID: JSON.parse(UserID),
        Device: "POSTMAN",
        DeviceID: "c",
        OrganizationID: OrganizationID,
        isEmail: false,
        isSMS: false,
        isDevice: true,
        UserDevices: [
          {
            DeviceName: selectDevice.DeviceName,
            DeviceToken: selectDevice.DeviceRegistrationToken,
          },
        ],
      };
      dispatch(sendTwoFacAction(t, navigate, Data, selectDevice));
    }
    // navigate("/2FAverificationotp")
  };
  useEffect(() => {
    if (location.state !== null) {
      console.log(location, "location");
      let devices = location.state.currentDevice;
      let currentDevices = [];
      devices.map((data, index) => {
        currentDevices.push(data);
      });
      setDevices(currentDevices);
    }
  }, [location.state]);

  return (
    <>
      <Row>
        <Col className="languageselect-box">

          <select
            className="select-language-signin"
            onChange={handleChangeLocale}
            value={language}
          >
            {languages.map(({ name, code }) => (
              <option key={code} value={code} className="language_options">
                {name}
              </option>
            ))}

          </select>
          <img src={LanguageChangeIcon} className="languageIcon" />
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
            <Paper className="loginbox_auth_paperForiphone">
              <Col
                sm={12}
                lg={12}
                md={12}
                className="EmailVerifyBoxVerificationIphone"
              >
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
                      className="d-flex justify-content-start flex-column"
                    >
                      <h3 className=" VerifyHeadingIphone ">
                        {t("2fa-verification")}
                      </h3>
                      <span className="SelectLineIphone">
                        {t("Select-any-device")}
                      </span>
                    </Col>
                  </Row>

                  <Row className="EmailBoxverifcationIphone">
                    {devices !== null && devices.length > 0
                      ? devices.map((data, index) => {
                        return (
                          <Col sm={12} md={12} lg={12} className="mt-2">
                            <Row key={index}>
                              <Col sm={12} md={1} lg={1}>
                                {" "}
                                <img width={"15px"} src={img10} alt="" />
                              </Col>
                              <Col sm={12} md={9} lg={9}>
                                <span
                                  className={
                                    "verificationIphoneLabels_active"
                                    // data.UserDeviceID === data.UserDeviceID
                                    // ? "verificationIphoneLabels_active"
                                    //   : "verificationIphoneLabels"
                                  }
                                >
                                  {data.DeviceName}
                                </span>
                              </Col>
                              <Col sm={12} md={2} lg={2}>
                                <Form.Check
                                  type="radio"
                                  name="2faVerificationIphone"
                                  value={JSON.stringify(data)}
                                  onChange={
                                    onChangeHandlerVerificationIphone1
                                  }
                                />
                              </Col>
                            </Row>
                          </Col>
                        );
                      })
                      : null}
                  </Row>
                  <Row className="mt-5 d-flex justify-content-center">
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-center "
                    >
                      <Button
                        disableBtn={selectDevice !== null ? false : true}
                        text="SEND CODE"
                        className="Next_button_EmailVerifyVerificationIphone"
                        onClick={onClickIphone}
                      />
                    </Col>
                  </Row>
                </Form>
                <Row className="mt-1">
                  <Col sm={12} md={12} lg={12} className="forogt_email_link">
                    <Link to="/twofacmultidevice">{t("Go-back")}</Link>
                  </Col>
                </Row>
              </Col>
            </Paper>
          </Col>
          <Col md={7} lg={7} sm={12} className="p-0">
            <Row>
              <Col sm={12} md={6} lg={6} className="position-relative" >
                <img src={img2} alt="auth_icon" width="380px" className="phone-image" />
              </Col>
              <Col sm={12} md={6} lg={6} className="position-relative vh-100" >
                <img
                  src={DiskusAuthPageLogo}
                  alt="auth_icon"
                  width="600px"
                  className="Auth_Icon"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      {Authreducer.Loading ? <Loader /> : null}
    </>
  );
};

export default VerificationIphone;
