import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
} from "../../../../../components/elements";
import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./VerificationCodeThree.css";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
// import img2 from "../../../../../assets/images/2.png";
// import img3 from "../../../../../assets/images/3.png";
// import img4 from "../../../../assets/images/4.png";
// import img5 from "../../../../../assets/images/5.png";
// import img6 from "../../../../../assets/images/6.png";
import img9 from "../../../../../assets/images/9.png";
import img10 from "../../../../../assets/images/10.png";

import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";

const VerificationCodeThree = () => {
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  return (
    <Container fluid className="VerificationCodeThree">
      <Row>
        <Col
          lg={5}
          md={5}
          sm={12}
          className="d-flex justify-content-center align-items-center min-vh-100"
        >
          <Paper className="loginbox_auth_paperForVerificationCodeThree">
            <Col
              sm={12}
              lg={12}
              md={12}
              className="EmailVerifyBoxVerificationCodeThree"
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
                <Row className="mt-4 ">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center flex-column"
                  >
                    <h3 className="MainHeadingVerificationCodeThree">
                      2FA Verification
                    </h3>
                    <span className="SubHeadingVerificationCodeThree">
                      A Notification Has Been Sent To Your Device
                    </span>
                  </Col>
                </Row>

                <Row className="EmailBoxverifcationCodeThree">
                  <Col sm={12} md={12} lg={12} className="mt-2">
                    <Row>
                      <Col sm={12} md={5} lg={5}></Col>
                      <Col>
                        <img width={"35px"} src={img10} alt="" />
                      </Col>
                      <Col sm={12} md={2} lg={2}></Col>
                    </Row>
                  </Col>
                  <Col sm={12} md={12} lg={12} className="mt-0">
                    <Row>
                      <Col sm={12} ms={3} lg={3}></Col>
                      <Col className="mt-1" sm={12} ms={8} lg={8}>
                        <span>Realme Xtra Zoom</span>
                      </Col>
                      <Col sm={12} ms={1} lg={1}></Col>
                    </Row>
                  </Col>
                  <Col sm={12} md={12} lg={12} className="mt-1">
                    <Row>
                      <Col sm={12} md={4} lg={4}></Col>
                      <Col className="my-1 mr-1" sm={12} md={8} lg={8}>354 098</Col>
                      <Col ></Col>
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
                      text="SEND AGAIN"
                      className="Next_button_EmailVerifyVerificationCodeThree"
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
            <Row className="mt-1">
              <Col sm={12} md={12} lg={12} className="forogt_email_link_verification_Code_Three">
                <Link to="/forgotpasssowrd2">Go Back</Link>
              </Col>
            </Row>
          </Paper>
        </Col>
        <Col md={7} lg={7} sm={12} className="p-0">
          <div className="parent-class-images positionRelative">
            <div className="Auth_Icon1SendEmailVerificationCodeThree">
              <img src={img9} alt="auth_icon" width="250px" />
            </div>
            <div className="circle-imageVerifcationCodeThree">
              <img
                src={DiskusAuthPageLogo}
                alt="auth_icon"
                width="600px"
                className="Auth_Icon"
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VerificationCodeThree;
