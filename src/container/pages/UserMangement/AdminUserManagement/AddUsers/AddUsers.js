import React from "react";
import styles from "./AddUsers.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import AddUsericon from "../../../../../assets/images/AddusersIcon.svg";
import {
  Button,
  Checkbox,
  TextField,
} from "../../../../../components/elements";
import { useNavigate } from "react-router-dom";
const AddUsers = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleCancelButton = () => {
    navigate("/Admin/ManageUsers");
  };
  return (
    <Container className={styles["PageAlignment"]}>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12} xs={12}>
          <span className={styles["AddUserheading"]}>{t("Add-user")}</span>
        </Col>
      </Row>
      <Row>
        <Col lg={4} md={4} sm={12} xs={12}>
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12} xs={12}>
              <TextField
                placeholder={t("Full-name")}
                label={
                  <>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["NameCreateAddtional"]}>
                          {t("Name")}{" "}
                          <span className={styles["Steric"]}>*</span>
                        </span>
                      </Col>
                    </Row>
                  </>
                }
                applyClass={"updateNotes_titleInput"}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex flex-column flex-wrap"
            >
              <span className={styles["NameCreateAddtional"]}>
                {t("Organization")}
              </span>
              <span className={styles["NameClass"]}>Waqas Associates</span>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12} className="flex-column flex-wrap">
              <span className={styles["NameCreateAddtional"]}>
                {t("Organization-role")}
              </span>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12} className="d-flex gap-2">
                  <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                  <span className={styles["AdminAlsoClass"]}>
                    {t("Is-admin-also")}
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12} xs={12}>
              <TextField
                placeholder={t("Designation")}
                label={
                  <>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["NameCreateAddtional"]}>
                          {t("Designation")}{" "}
                          <span className={styles["Steric"]}>*</span>
                        </span>
                      </Col>
                    </Row>
                  </>
                }
                applyClass={"updateNotes_titleInput"}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12} xs={12}>
              <TextField
                placeholder={t("Email")}
                label={
                  <>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["NameCreateAddtional"]}>
                          {t("Email")}{" "}
                          <span className={styles["Steric"]}>*</span>
                        </span>
                      </Col>
                    </Row>
                  </>
                }
                applyClass={"updateNotes_titleInput"}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={8} md={8} sm={12} xs={12}>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex align-items-center justify-content-end"
            >
              <img src={AddUsericon} alt="" />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={t("Cancel")}
            className={styles["AddUserCancelButton"]}
            onClick={handleCancelButton}
          />

          <Button
            text={t("Create")}
            className={styles["AddUserCreateButton"]}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AddUsers;
