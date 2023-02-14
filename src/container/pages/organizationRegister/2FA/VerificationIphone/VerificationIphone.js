import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
} from "../../../../../components/elements";
import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./VerificationIphone.css";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img2 from "../../../../../assets/images/2.png";
import img10 from "../../../../../assets/images/10.png";
// import img3 from "../../../../../assets/images/3.png";
// import img4 from "../../../../assets/images/4.png";
import img5 from "../../../../../assets/images/5.png";
import img6 from "../../../../../assets/images/6.png";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerificationIphone = () => {
  const navigate = useNavigate();
  const [xtrazoom1, setXtrazoom1] = useState(false);
  const [oneplus, setOneplus] = useState(false);
  const [iphone, setIphone] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const onChangeHandlerVerificationIphone = (e) => {
    console.log(e.target.value);
  };
  const onChangeHandlerVerificationIphone1 = (e) => {
    setXtrazoom1(true);
    setOneplus(false);
    setIphone(false);
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
  const onClickIphone = () =>{
    navigate("/verifycodeone")
  }
  return (
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
                    <h3 className=" VerifyHeadingIphone ">2FA Verification</h3>
                    <span className="SelectLineIphone">Select Any device</span>
                  </Col>
                </Row>

                <Row className="EmailBoxverifcationIphone">
                  <Col sm={12} md={12} lg={12} className="mt-2">
                    <Row>
                      <Col sm={12} md={1} lg={1}>
                        {" "}
                        <img width={"15px"} src={img10} alt="" />
                      </Col>
                      <Col sm={12} md={9} lg={9}>
                        <span
                          className={
                            !xtrazoom1
                              ? "verificationIphoneLabels_active"
                              : "verificationIphoneLabels"
                          }
                        >
                          REALME XTRA ZOOM
                        </span>
                      </Col>
                      <Col sm={12} md={2} lg={2}>
                        <Form.Check
                          type="radio"
                          name="2faVerificationIphone"
                          value={"REALME XTRA ZOOM"}
                          onChange={onChangeHandlerVerificationIphone1}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={12} md={12} lg={12} className="mt-0">
                    <Row className="my-1">
                      <Col sm={12} md={1} lg={1}>
                        <img width={"15px"} src={img10} alt="" />
                      </Col>
                      <Col sm={12} md={9} lg={9}>
                        <span
                          className={
                            !oneplus
                              ? "verificationIphoneLabels_active"
                              : "verificationIphoneLabels"
                          }
                        >
                          OnePlus J9
                        </span>
                      </Col>
                      <Col sm={12} md={2} lg={2}>
                        <Form.Check
                          type="radio"
                          name="2faVerificationIphone"
                          value={"OnePlus J9"}
                          onChange={onChangeHandlerVerificationIphone2}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={12} md={12} lg={12} className="mt-1">
                    <Row>
                      <Col sm={12} md={1} lg={1}>
                        <img width={"15px"} src={img10} alt="" />
                      </Col>
                      <Col sm={12} md={9} lg={9}>
                        {" "}
                        <span
                          className={
                            !iphone
                              ? "verificationIphoneLabels_active"
                              : "verificationIphoneLabels"
                          }
                        >
                          Iphone 6s
                        </span>
                      </Col>
                      <Col sm={12} md={2} lg={2}>
                        {" "}
                        <Form.Check
                          type="radio"
                          name="2faVerificationIphone"
                          value={"Iphone 6s"}
                          onChange={onChangeHandlerVerificationIphone3}
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
                      text="SEND CODE"
                      className="Next_button_EmailVerifyVerificationIphone"
                      onClick={onClickIphone}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </Paper>
        </Col>
        <Col md={7} lg={7} sm={12} className="p-0">
          <div className="parent-class-images positionRelative">
            <div className="Auth_Icon1SendEmailVerificationIphone">
              <img src={img2} alt="auth_icon" width="380px" />
            </div>
            <div className="circle-imageVerifcationIphone">
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

export default VerificationIphone;
