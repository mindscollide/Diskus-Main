import React, { useState, useEffect } from 'react'
import { Row, Col, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { Button, Paper } from '../../../components/elements'
import './Password_Update_Message.css'
import './../../../i18n.js'
import logo from './../../../assets/images/diskuslogo-forsigncard.svg'
import { useTranslation } from 'react-i18next'
import Cookies from 'js-cookie'

const PasswordUpdateMessage = () => {
  const navigate = useNavigate()
  const handleGoLogin = () => {
    navigate('/')
  }

  //For Localization
  const { t, i18n } = useTranslation()

  // Languages
  // const languages = [
  //   { name: "English", code: "en" },
  //   { name: "Français", code: "fr" },
  // ];

  // const currentLocale = Cookies.get("i18next") || "en";

  // const [language, setLanguage] = useState(currentLocale);

  // const handleChangeLocale = (e) => {
  //   const lang = e.target.value;
  //   setLanguage(lang);
  //   localStorage.setItem("i18nextLng", lang);
  //   i18n.changeLanguage(lang);
  // };

  // const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  // useEffect(() => {
  //   document.body.dir = currentLangObj.dir || "ltr";
  //   // document.title = t("app_title");
  // }, [currentLangObj, t]);

  return (
    <>
      <Row>
        <Col xs={2}></Col>
        <Col xs={8}>
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
                  className="verification-box border"
                >
                  <Paper>
                    <Row>
                      <Col lg={12} md={12} xs={12}>
                        <Image src={logo} fluid />
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="verification-box-heading color-primary fw-600 my-3"
                      >
                        {/* Your Password has been updated */}
                        {t('Your-password-has-been-updated')}
                      </Col>
                    </Row>

                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="passwordUpdateMessageBtn"
                      >
                        <Button
                          className="SignInButton"
                          text={t('Back-to-signin')}
                          onClick={handleGoLogin}
                        />
                      </Col>
                    </Row>
                  </Paper>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={2} className="text-end mt-3">
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
  )
}

export default PasswordUpdateMessage
