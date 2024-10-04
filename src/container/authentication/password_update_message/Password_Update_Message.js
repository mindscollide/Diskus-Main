import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button, Paper } from "../../../components/elements";
import "./Password_Update_Message.css";
import "./../../../i18n.js";
import logo from "./../../../assets/images/diskuslogo-forsigncard.svg";
import { useTranslation } from "react-i18next";

const PasswordUpdateMessage = () => {
  const navigate = useNavigate();
  const handleGoLogin = () => {
    navigate("/");
  };

  //For Localization
  const { t } = useTranslation();

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
                        {t("Your-password-has-been-updated")}
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
                          text={t("Back-to-signin")}
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
        <Col xs={2} className="text-end mt-3"></Col>
      </Row>
    </>
  );
};

export default PasswordUpdateMessage;
