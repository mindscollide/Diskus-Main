import React, { useEffect, useState } from 'react'
import styles from './VerifyEmailOTP.module.css'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { Button, Paper, TextField, VerificationInputField } from '../../../../components/elements'
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
import { useNavigate } from 'react-router-dom';
import DiskusAuthPageLogo from '../../../../assets/images/newElements/Diskus_newRoundIcon.svg';
import { verificationEmailOTP } from '../../../../store/actions/Auth2_actions';
import { useDispatch } from 'react-redux';

const VerifyEmailOTP = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [errorBar, setErrorBar] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyOTP, setVerifyOTP] = useState("");
  const [minutes, setMinutes] = useState(1)
  const [seconds, setSeconds] = useState(30)
  const changeHandler = (e) => {
    setVerifyOTP(e)
  }
  const verifyOTPClickHandler = (e) => {
    e.preventDefault()
    if (verifyOTP.length !== 6) {
      setErrorBar(true)
      setErrorMessage("OTP should be a 6 digit code")
    } else {
      setErrorBar(false)
      setErrorMessage("")
      dispatch(verificationEmailOTP(verifyOTP, navigate))
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
        localStorage.setItem("seconds", seconds)
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval)
        } else {
          localStorage.setItem("minutes", minutes)
          setSeconds(59)
          setMinutes(minutes - 1)
        }
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [seconds])
  return (
    <Container fluid>
      <Row>
        <Col lg={4} md={4} sm={12} className="d-flex justify-content-center align-items-center min-vh-100">
          <Paper className={styles["OTP_auth_paper"]}>
            <Col sm={12} lg={12} md={12} className={styles["EmailVerifyOTPbox"]}>
              <Row>
                <Col sm={12} md={12} lg={12} className="d-flex justify-content-center mb-3">
                  <img src={DiskusLogo} alt="diskus_logo" width="225px" height="80px" />
                </Col>
              </Row>

              <Row >
                <Col>
                  <span className={styles["signIn_heading"]}>Verify Your Email</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>6 digit code has sent on your E-mail</span>
                </Col>
              </Row>
              <Row className='mt-4'>
                <Col sm={12} md={12} lg={12}>
                  <VerificationInputField label="Enter Code" fields={6} change={changeHandler} />
                </Col>
              </Row>

              <Row>
                <Col className='text-left d-flex justify-content-between'>
                  <span className={styles["resendCode_btn"]}>Generate OTP</span> <span>0{minutes}: {seconds < 10 ? "0" + seconds : seconds}</span></Col>
              </Row>
              <Row className='mt-2'>
                <Col>
                  <p className={errorBar ? ` ${styles["errorMessage-OTP"]} ` : `${styles["errorMessage-OTP_hidden"]}`}>{errorMessage}</p>
                </Col>
              </Row>
              <Row className=' mt-5 d-flex justify-content-center'>
                <Col sm={12} lg={12} md={12} className="d-flex justify-content-center">
                  <Button text="Verify" onClick={verifyOTPClickHandler} className={styles["subscribNow_button_EmailVerify"]} />
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col sm={12} md={12} lg={12} className="d-flex justify-content-start">  <span className='text-center text-decoration-underline'>Go Back</span></Col>
              </Row>
            </Col>
          </Paper>
        </Col>
        <Col lg={8} md={8} sm={8} className="position-relative d-flex  overflow-hidden">

          <Col md={8} lg={8} sm={12} className={styles["Login_page_text"]}>
            <h1 className={styles["heading-1"]}>Simplify Management.</h1>
            <h1 className={styles["heading-2"]}>Collaborate.</h1>
            <h1 className={styles["heading-1"]}>Prioritize.</h1>
          </Col>
          <Col md={4} lg={4} sm={12} className="position-relative">
            <img src={DiskusAuthPageLogo} alt="auth_icon" width="600px" className={styles["Auth_Icon"]} />
          </Col>


        </Col>
      </Row>
    </Container>
  )
}

export default VerifyEmailOTP