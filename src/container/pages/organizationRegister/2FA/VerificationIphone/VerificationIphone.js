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

import LanguageChangeIcon from "../../../../../assets/images/newElements/Language.svg";
import { mqttConnection } from "../../../../../commen/functions/mqttconnection";
import Helper from "../../../../../commen/functions/history_logout";

const VerificationIphone = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { Authreducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const location = useLocation();
  const [devices, setDevices] = useState([]);
  const [selectDevice, setSelectDevice] = useState(null);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4
  );
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60
  );
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
  const onChangeHandlerVerificationIphone1 = (e) => {
    setSelectDevice(JSON.parse(e.target.value));
  };
  const onClickIphone = (e) => {
    e.preventDefault();
    if (selectDevice !== null) {
      let UserID = JSON.parse(localStorage.getItem("userID"));
      let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
      let data = {
        DeviceName: selectDevice.DeviceName,
        UserDeviceID: selectDevice.UserDeviceID,
        DeviceRegistrationToken: selectDevice.DeviceRegistrationToken,
      };
      localStorage.setItem("currentDevice", JSON.stringify(data));
      let Data = {
        UserID: JSON.parse(UserID),
        Device: "BROWSER",
        DeviceID: "c",
        OrganizationID: OrganizationID,
        isEmail: false,
        isSMS: false,
        isDevice: true,
        UserDevices: [
          {
            DeviceName: selectDevice.DeviceName,
            UserDeviceID: selectDevice.UserDeviceID,
            DeviceRegistrationToken: selectDevice.DeviceRegistrationToken,
          },
        ],
      };
      dispatch(
        sendTwoFacAction(
          t,
          navigate,
          Data,
          selectDevice,
          setSeconds,
          setMinutes
        )
      );
    }
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

  let newClient = Helper.socket;
  useEffect(() => {
    if (newClient != null && newClient != "" && newClient != undefined) {
    } else {
      let userID = localStorage.getItem("userID");
      mqttConnection(userID);
    }
  }, [Helper.socket]);

  return (
    <>
      <Row>
        <Col className="languageselect-box">
          <select
            className="select-language-signin_selectfrommultidevices"
            onChange={handleChangeLocale}
            value={language}
          >
            {languages.map(({ name, code }) => (
              <option key={code} value={code} className="language_options">
                {name}
              </option>
            ))}
          </select>
          <img
            src={LanguageChangeIcon}
            className="languageIcon_selectfrommultidevices"
          />
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
                    <img src={img1} width={220} alt="diskus_logo" />
                  </Col>
                </Row>

                <Form>
                  <Row className="mt-5">
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex justify-content-start flex-column"
                    >
                      <h3 className="VerifyHeadingIphone">
                        {t("2fa-verification")}
                      </h3>
                      <span className="SelectLineIphone">
                        {t("Select-any-device")}
                      </span>
                    </Col>
                  </Row>

                  <Row className="Scroll_bar_For_devices mt-3">
                    {devices !== null && devices.length > 0
                      ? devices.map((data, index) => {
                          return (
                            <Col sm={12} lg={12} md={12} className="mx-2">
                              <Row key={index} className="my-2">
                                <Col sm={12} md={1} lg={1}>
                                  <img
                                    width={"15px"}
                                    className={
                                      selectDevice?.UserDeviceID ===
                                      data?.UserDeviceID
                                        ? "two_fac_image_active"
                                        : "two_fac_image"
                                    }
                                    src={img10}
                                    alt=""
                                  />
                                </Col>
                                <Col sm={12} md={9} lg={9}>
                                  <span
                                    className={
                                      selectDevice?.UserDeviceID ===
                                      data?.UserDeviceID
                                        ? "verificationIphoneLabels"
                                        : "verificationIphoneLabels_active"
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
                  <Row className="mt-4 d-flex justify-content-center">
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-center "
                    >
                      <Button
                        disableBtn={selectDevice !== null ? false : true}
                        text={t("Send-code").toUpperCase()}
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
              <Col sm={12} md={6} lg={6} className="position-relative">
                <img
                  src={img2}
                  alt="auth_icon"
                  width="380px"
                  className="phone-image"
                />
              </Col>
              <Col sm={12} md={6} lg={6} className="position-relative vh-100">
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
