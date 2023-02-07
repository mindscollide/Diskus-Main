import React, { useEffect, useState } from "react";
import styles from "./ChangePassword.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { Button, TextField, Loader, Notification } from "../../../components/elements";
import PasswordChecklist from "react-password-checklist";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { changePasswordFunc } from "../../../store/actions/Auth2_actions";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PasswordEyeIcon from "../../../assets/images/newElements/password.svg";
import PasswordHideEyeIcon from "../../../assets/images/newElements/password_hide.svg";
const ChangePassword = () => {
  const { t } = useTranslation();
  const { Authreducer } = useSelector(state => state)
  console.log(Authreducer, "AuthReducerAuthReducer")
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPasssword] = useState(false);
  const [showNewPasswordIcon, setShowNewPasswordIcon] = useState(false);
  const [showConfirmPasswordIcon, setConfirmShowPasswordIcon] = useState(false);
  const [isPasswordStrong, setPasswordStrong] = useState(false);
  const [Password, setPassword] = useState({
    newPassword: "",
    ConfirmPassword: "",
  });
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const dispatch = useDispatch();
  const passwordChangeHandler = (e) => {
    setOldPassword(e.target.value);
  };
  const handleNewPasswordChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setPassword({
      ...Password,
      [name]: value,
    });
  };

  const handleshowOldPassword = () => {
    setShowOldPasssword(!showOldPassword);
  };
  const showNewPassowrd = () => {
    setShowNewPasswordIcon(!showNewPasswordIcon);
  };
  const showConfirmPassowrd = () => {
    setConfirmShowPasswordIcon(!showConfirmPasswordIcon);
  };
  const handleUpdate = () => {
    dispatch(changePasswordFunc(oldPassword, Password.newPassword, t));
  };
  useEffect(() => {
    if(Authreducer.ChangeUserPasswordResponseMessage !== "") {
      setOpen({
        flag: true,
        message: Authreducer.ChangeUserPasswordResponseMessage
      })
      setTimeout(() => {
        setOpen({
          flag: true,
          message: ""
        })
      }, 3000)
    }
  }, [Authreducer.ChangeUserPasswordResponseMessage])
  return (
    <>
      <Container>
        <Row>
          <Col sm={12} md={6} lg={6} className="py-3">
            <Row>
              <Col sm={12} md={12} lg={12} className="mb-5 p-0">
                <h4 className={styles["changePasswordTitle"]}>Change Password</h4>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={6} lg={6} className="MontserratSemiBold">
                Old Password
              </Col>
              <Col sm={12} md={6} lg={6} className="p-0 position-relative">
                <TextField
                  applyClass="form-control2"
                  className="PasswordTextField"
                  type={showOldPassword ? "text" : "password"}
                  name="Password"
                  // width="285px"
                  value={oldPassword || ""}
                  change={passwordChangeHandler}
                  placeholder="Old Password"
                  inputIcon={showOldPassword ? <img src={PasswordEyeIcon} /> :  <img src={PasswordHideEyeIcon} />}
                  iconClassName="eye_icon"
                  labelClass="d-none"
                  autoComplete="false"
                  clickIcon={handleshowOldPassword}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col sm={12} md={6} lg={6} className="MontserratSemiBold">
                New Password
              </Col>
              <Col sm={12} md={6} lg={6} className="p-0 position-relative">
                {" "}
                <TextField
                  applyClass="form-control2"
                  className="PasswordTextField"
                  type={showNewPasswordIcon ? "text" : "password"}
                  name="newPassword"
                  // width="285px"
                  value={Password.newPassword || ""}
                  change={handleNewPasswordChange}
                  placeholder="New Password"
                  inputIcon={showNewPasswordIcon ?<img src={PasswordEyeIcon} /> : <img src={PasswordHideEyeIcon} />}
                  iconClassName="eye_icon"
                  labelClass="d-none"
                  autoComplete="false"
                  clickIcon={showNewPassowrd}
                />
                <span>(maximum characters 25)</span>
              </Col>
            </Row>
            <Row className="my-2">
              <Col sm={12} md={6} lg={6}></Col>
              <Col sm={12} md={6} lg={6} className={styles["passwordCheckBox"]}>
                <p className={"password-must m-0 fw-bold"}>Password must be</p>
                <PasswordChecklist
                  rules={["minLength", "specialChar", "letter", "match"]}
                  minLength={8}
                  className={styles["passwordTextHandler"]}
                  value={Password.newPassword}
                  valueAgain={Password.ConfirmPassword}
                  onChange={(isValid) => {
                    console.log(isValid, "isValid", setPasswordStrong(isValid));
                  }}
                  invalidColor="#ff0000"
                  validColor="#5F78D6"
                  iconSize={"14px"}
                />
              </Col>
            </Row>
            <Row className="my-2">
              <Col sm={12} md={6} lg={6} className="MontserratSemiBold">
                Confirm Password
              </Col>
              <Col sm={12} md={6} lg={6} className="p-0 position-relative">
                {" "}
                <TextField
                  applyClass="form-control2"
                  className="PasswordTextField"
                  type={showConfirmPasswordIcon ? "text" : "password"}
                  name="ConfirmPassword"
                  // width="285px"
                  value={Password.ConfirmPassword || ""}
                  change={handleNewPasswordChange}
                  placeholder="Confirm Password"
                  inputIcon={showConfirmPasswordIcon ? <img src={PasswordEyeIcon} /> : <img src={PasswordHideEyeIcon} />}
                  iconClassName="eye_icon"
                  labelClass="d-none"
                  autoComplete="false"
                  clickIcon={showConfirmPassowrd}
                />
              </Col>
            </Row>
            <Row className={styles["changePasswordButtons"]}>
              <Col sm={12} md={6} lg={6}>
                <Button
                  text={"Revert"}
                  className={`${"MontserratSemiBold"} ${styles["Revert"]}`}
                />
              </Col>
              <Col
                sm={12}
                md={6}
                lg={6}
                className="d-flex justify-content-end p-0"
              >
                <Button
                  disableBtn={
                    oldPassword === ""
                      ? true
                      : Password.newPassword === ""
                        ? true
                        : Password.ConfirmPassword === ""
                          ? true
                          : !isPasswordStrong
                            ? true
                            : false
                  }
                  text={"Update"}
                  onClick={handleUpdate}
                  className={`${"MontserratSemiBold"} ${styles["Update"]}`}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      {Authreducer.Loading ? <Loader /> : null}
      <Notification open={open.flag} message={open.message} setOpen={open.flag} />
    </>
  );
};

export default ChangePassword;
