import React, { useState } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { Button, Paper, TextField, Checkbox, Notification } from '../../../../../components/elements'
import { Link, useNavigate } from 'react-router-dom';
import DiskusLogo from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import styles from './EmailValidation.module.css'
import DiskusAuthPageLogo from '../../../../../assets/images/newElements/Diskus_newRoundIcon.svg';
import ErrorBar from '../../../../authentication/sign_up/errorbar/ErrorBar';
import { validationEmail } from '../../../../../commen/functions/validations';
const EmailValidation = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [errorBar, setErrorBar] = useState(false)
    const [errorMessage, setErrorMessage] = useState("There was something wrong")
    const [open, setOpen] = useState({
        open: false,
        message: "",
    });

    const emailChangeHandler = (e) => {
        if (email.trim() > 0 && validationEmail(email)) {
            setErrorBar(true)
        } else {
            setErrorBar(false)
            setEmail(e.target.value)
        }
    }

    const loginHandler = (e) => {
        e.preventDefault()
        if (email === "") {
            setOpen({
                ...open,
                open: true,
                message: "Please Enter Email"
            })
        } else if (validationEmail(email) === false) {
            setErrorBar(true)
        } else {
            setOpen({
                ...open,
                open: false,
                message: ""
            })
            setErrorBar(false)
            navigate("/enterPassword")
        }
    }
    const goForSignUp = () => {
        navigate("/signuporganization")
    }
    return (
        <>
            <Container fluid className={styles["auth_container"]}>
                <Row>
                    <Col lg={4} md={4} sm={12} className="d-flex justify-content-center align-items-center min-vh-100">

                        <Paper className={styles["loginbox_auth_paper"]}>
                            <Col sm={12} lg={12} md={12} className={styles["EmailVerifyBox"]}>
                                <Row>
                                    <Col sm={12} md={12} lg={12} className="d-flex justify-content-center">
                                        <img src={DiskusLogo} alt="diskus_logo" />
                                    </Col>
                                </Row>
                                <Row className='my-3 text-center'>
                                    <Col>
                                        <span className={styles["signIn_heading"]}>Sign In</span>
                                    </Col>
                                </Row>
                                <Form onSubmit={loginHandler}>
                                    <Row className='my-0'>
                                        <Col sm={12} md={12} lg={12} className="d-flex justify-content-center flex-column" >
                                            <TextField required applyClass="form-control2" change={emailChangeHandler} value={email || ""} width="335px" placeholder="Email" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <p className={errorBar ? ` ${styles["errorMessage-inLogin"]} ` : `${styles["errorMessage-inLogin_hidden"]}`}>{errorMessage}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12} md={12} lg={12} className="mt-2" >
                                            <span className="d-flex flex-row mr-2" ><Checkbox classNameDiv="me-2" />Remember Email</span>
                                        </Col>
                                    </Row>

                                    <Row className='mt-4 d-flex justify-content-center'>
                                        <Col sm={12} lg={12} md={12} className="d-flex justify-content-center ">
                                            <Button text="Next" onClick={loginHandler} className={styles["Next_button_EmailVerify"]} />
                                        </Col>
                                    </Row>
                                </Form>
                                <Row className='mt-1' >
                                    <Col sm={12} md={12} lg={12} className={styles["forogt_email_link"]}>
                                        <Link to="/forgotpasssowrd2">Forgot Email</Link>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col sm={12} md={12} lg={12}> <span className={styles["signup-text-inloginpage"]}>Haven't subscribed yet?</span></Col>
                                </Row>
                                <Row className='d-flex justify-content-center'>
                                    <Col sm={12} lg={12} md={12} className="w-100 d-flex justify-content-center">
                                        <Button text="Subscribe Now" onClick={goForSignUp} className={styles["subscribNow_button_EmailVerify"]} />
                                    </Col>
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
            <Notification setOpen={setOpen} open={open.open} message={open.message} />
        </>
    )
}

export default EmailValidation