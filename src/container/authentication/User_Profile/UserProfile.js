import React, { useState, useRef } from "react";
import UserProfileSetting from "../../../../src/assets/images/Userprofile-1.png";
import {
  TextField,
  Button,
  Modal,
  Notification,
  EmployeeCard,
} from "./../../../components/elements";
import { Row, Col, Container } from "react-bootstrap";
import styles from "./UserProfile.module.css";
import Form from "react-bootstrap/Form";
// import { countryName } from "../../AllUsers/AddUser/CountryJson";
import { countryName } from "../../Admin/AllUsers/AddUser/CountryJson";
import ReactFlagsSelect from "react-flags-select";
import { useTranslation } from "react-i18next";

const ModalMeeting = ({
  ModalTitle,
  user,
  setUser,
  userProfileModal,
  setUserProfileModal,
  calenderFlag,
}) => {
  // states for UserProfile
  const [userProfileEdit, setUserProfileEdit] = useState({
    Name: "",
    Designation: "",
    Mobile: "",
    SelectFlag: "",
  });

  //For Localization
  const { t } = useTranslation();

  // for enable states
  const [nameEnable, setNameEanble] = useState(false);
  const [designationEnable, setDesignationEnable] = useState(false);
  const [mobileEnable, setMobileEnable] = useState(false);
  const [isFlagEnable, setIsFlagEnable] = useState(false);

  const [selected, setSelected] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState({});

  const handleSelect = (country) => {
    setSelected(country);
    setSelectedCountry(country);
    let a = Object.values(countryName).find((obj) => {
      return obj.primary == country;
    });
    console.log("Selected-Values", a);
  };

  // for edit User Input Fields
  const Name = useRef(null);
  const Designation = useRef(null);
  const Mobile = useRef(null);
  const SelectFlag = useRef(null);

  // for UserProfile edit handler
  const userProfileEditHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "Name" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setUserProfileEdit({
          ...userProfileEdit,
          Name: valueCheck.trimStart(),
        });
      }
    } else if (name === "Name" && value === "") {
      setUserProfileEdit({
        ...userProfileEdit,
        Name: "",
      });
    }

    if (name === "Designation" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setUserProfileEdit({
          ...userProfileEdit,
          Designation: valueCheck.trimStart(),
        });
      }
    } else if (name === "Designation" && value === "") {
      setUserProfileEdit({
        ...userProfileEdit,
        Designation: "",
      });
    }

    if (name === "Mobile" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setUserProfileEdit({
          ...userProfileEdit,
          Mobile: valueCheck.trimStart(),
        });
      }
    } else if (name === "Mobile" && value === "") {
      setUserProfileEdit({
        ...userProfileEdit,
        Mobile: "",
      });
    }
  };

  // Reset Input fields
  const userProfileReset = () => {
    // setSelected("");
    if (isFlagEnable === true) {
      setSelected("");
      setUserProfileEdit({
        ...userProfileEdit,
        Name: "",
        Designation: "",
        Mobile: "",
      });
    } else if (isFlagEnable !== true) {
      setUserProfileEdit({
        ...userProfileEdit,
        Name: "",
        Designation: "",
        Mobile: "",
      });
    }
  };

  // for edit name field
  const nameHandler = () => {
    Name.current.disabled = false;
    Name.current.focus();
    setNameEanble(true);
  };

  //for edit Designation field
  const designationHandler = () => {
    Designation.current.disabled = false;
    Designation.current.focus();
    setDesignationEnable(true);
  };

  //for edit Mobile field
  const mobileHandler = () => {
    Mobile.current.disabled = false;
    Mobile.current.focus();
    setMobileEnable(true);
    setIsFlagEnable(true);
  };

  //for next enter key
  const enterKeyHandler = (event, nextInput) => {
    if (event.key === "Enter") {
      nextInput.current.focus();
    }
  };

  //For Localization
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  return (
    <>
      <Container>
        <Modal
          show={user}
          setShow={setUser}
          ButtonTitle={ModalTitle}
          centered
          modalFooterClassName={styles["modal-userprofile-footer"]}
          size={"md"}
          ModalBody={
            <>
              <Container className={styles["user-container"]}>
                <Row className="mb-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <img src={UserProfileSetting} width={100} />
                  </Col>
                </Row>

                <Row className={styles["User-bottom-line"]}>
                  <Col lg={4} md={4} sm={4} xs={12}>
                    <p className={styles["Name-label-User"]}>{t("Name")}</p>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Form.Control
                      ref={Name}
                      onKeyDown={(event) => enterKeyHandler(event, Designation)}
                      name="Name"
                      maxLength={200}
                      disabled={true}
                      autocomplete="off"
                      value={userProfileEdit.Name}
                      onChange={userProfileEditHandler}
                      placeholder={t("Enter-name")}
                      applyClass="form-control2"
                      className={styles["text-fields-name"]}
                    />
                  </Col>

                  <Col
                    lg={2}
                    md={2}
                    sm={2}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <p
                      className={styles["label-Edit-user"]}
                      onClick={nameHandler}
                    >
                      {t("Edit")}
                    </p>
                  </Col>
                </Row>

                <Row className={styles["User-bottom-line"]}>
                  <Col lg={4} md={4} sm={4} xs={12}>
                    <p className={styles["Designation-label-User"]}>
                      {t("Designation")}
                    </p>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Form.Control
                      ref={Designation}
                      onKeyDown={(event) => enterKeyHandler(event, Mobile)}
                      name="Designation"
                      value={userProfileEdit.Designation}
                      autocomplete="off"
                      onChange={userProfileEditHandler}
                      disabled={true}
                      maxLength={200}
                      placeholder={t("Enter-designation")}
                      applyClass="form-control2"
                      className={styles["text-fields-designation"]}
                    />
                  </Col>

                  <Col
                    lg={2}
                    md={2}
                    sm={2}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <p
                      className={styles["label-Edit-user"]}
                      onClick={designationHandler}
                    >
                      {t("Edit")}
                    </p>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col lg={3} md={3} sm={3} xs={12} className="mb-5 mt-2">
                    <p className={styles["Mobile-label-User"]}>{t("Mobile")}</p>
                  </Col>
                  <Col lg={1} md={1} sm={1} xs={12}></Col>

                  <Col
                    lg={2}
                    md={2}
                    sm={2}
                    xs={12}
                    className={styles["react-User-Profile"]}
                  >
                    <ReactFlagsSelect
                      // ref={Mobile}
                      // name="Mobile"
                      disabled={!isFlagEnable}
                      fullWidth={false}
                      selected={selected}
                      // onSelect={(code) => setSelected(code)}
                      onSelect={handleSelect}
                      searchable={true}
                      placeholder={"Select Co...."}
                      customLabels={countryName}
                    />
                  </Col>

                  <Col lg={4} md={4} sm={4} xs={12} className="mt-1">
                    <Form.Control
                      ref={Mobile}
                      onKeyDown={(event) => enterKeyHandler(event, Name)}
                      name="Mobile"
                      disabled={true}
                      value={userProfileEdit.Mobile}
                      autocomplete="off"
                      onChange={userProfileEditHandler}
                      maxLength={10}
                      placeholder={t("Enter-number")}
                      applyClass="form-control2"
                      className={styles["text-fields-Mobile"]}
                    />
                  </Col>

                  <Col
                    lg={2}
                    md={2}
                    sm={2}
                    xs={12}
                    className="d-flex justify-content-end mt-2"
                  >
                    <p
                      className={styles["label-Edit-user"]}
                      onClick={mobileHandler}
                    >
                      {t("Edit")}
                    </p>
                  </Col>
                </Row>

                <Row className="mt-5 mb-2">
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <Button
                      text={t("Reset")}
                      className={styles["reset-User-btn"]}
                      onClick={userProfileReset}
                    />
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Button text={t("Save")} className={styles["save-User-btn"]} />
                  </Col>
                </Row>
              </Container>
            </>
          }
          // ModalFooter={
          //   <>
          //     <Row className="mt-5 mb-5">
          //       <Col
          //         lg={3}
          //         md={3}
          //         sm={3}
          //         xs={12}
          //         className="d-flex justify-content-start"
          //       >
          //         <Button text="Reset" className={styles["reset-User-btn"]} />
          //       </Col>
          //       <Col lg={6} md={6} sm={6} xs={12}></Col>
          //       <Col
          //         lg={3}
          //         md={3}
          //         sm={3}
          //         xs={12}
          //         className="d-flex justify-content-end"
          //       >
          //         <Button text="Save" className={styles["save-User-btn"]} />
          //       </Col>
          //     </Row>
          //   </>
          // }
        />
      </Container>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default ModalMeeting;
