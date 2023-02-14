import React, { useState, useEffect } from "react";
import "./../../../i18n.js";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { Button, Paper } from "./../../../components/elements";

import Accountcreatedlogo from "../../../assets/images/Accountcreate-logo.svg";
import logo from "./../../../assets/images/diskuslogo-forsigncard.svg";
import { Row, Col, Image, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Account_Created.css";

const AccountCreated = () => {
  const navigate = useNavigate();

  //For Localization
  const { t, i18n } = useTranslation();

  // Languages
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const [language, setLanguage] = useState(currentLocale);

  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  // useEffect(() => {
  //   document.body.dir = currentLangObj.dir || "ltr";
  //   // document.title = t("app_title");
  // }, [currentLangObj, t]);

  return (
    <>
      <Row>
        <Col lg={2} md={2} sm={12}></Col>
        <Col lg={8} md={8} sm={12}>
          <Row>
            <Col
              lg={12}
              md={12}
              xs={12}
              className="body-inner d-flex justify-content-center align-items-center"
            >
              <Row>
                <Col
                  lg={12}
                  md={12}
                  xs={12}
                  className="AccountVerification border"
                >
                  <Paper>
                    <Row className="Account-created-logo">
                      <Col lg={12} md={12} xs={12}>
                        <Image src={Accountcreatedlogo} fluid />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg={12} md={12} xs={12} className="Successtitle">
                        {t("Success")}
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="VerificationWidth text-center"
                      >
                        <Form.Text className="verfication-Text">
                          {t("Account-be-created-text")}
                        </Form.Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="backtosignInButton"
                      >
                        <Button
                          className="Back-to-signIn-btn "
                          text={t("Back-to-signin")}
                          onClick={() => navigate("/")}
                        />
                      </Col>
                    </Row>
                  </Paper>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col lg={2} md={2} sm={12} className="text-end mt-3">
          {/* <select
            className="language-dropdown"
            onChange={handleChangeLocale}
            value={language}
          >
            {languages.map(({ name, code }) => (
              <option
                className="language-dropdown-value"
                key={code}
                value={code}
              >
                {name}
              </option>
            ))}
          </select> */}
        </Col>
      </Row>
    </>
  );
};

export default AccountCreated;
