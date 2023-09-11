import React from "react";
import styles from "./CreateTask.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Button, TextField } from "../../../../../../components/elements";
import Select from "react-select";
import { style } from "@mui/system";
const CreateTask = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  return (
    <section>
      <Row className="mt-4">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["MainHeading_Create_Action"]}>
            ext ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </span>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["SubHeading"]}>
            {t("Actions-to-take")} <span className={styles["Steric"]}>*</span>
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <TextField labelClass={"d-none"} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg={5} md={5} sm={5}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["SubHeading"]}>
                {t("Assigned-to")}
                <span className={styles["Steric"]}>*</span>
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Select />
            </Col>
          </Row>
        </Col>
        <Col lg={5} md={5} sm={5}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["SubHeading"]}>
                {t("Select-agenda")}
                <span className={styles["Steric"]}>*</span>
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Select />
            </Col>
          </Row>
        </Col>
        <Col lg={2} md={2} sm={2}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["SubHeading"]}>
                {t("Due-date")}
                <span className={styles["Steric"]}>*</span>
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Select />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["SubHeading"]}>
            {t("Description")} <span className={styles["Steric"]}>*</span>
          </span>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col lg={12} md={12} sm={12}>
          <TextField
            applyClass="Polls_meeting"
            type="text"
            as={"textarea"}
            maxLength={500}
            rows="4"
            placeholder={t("Description")}
            labelClass={"d-none"}
            required={true}
            name="committeedescription"
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={"Cancel"}
            className={styles["Cancel_Button_Polls_meeting"]}
          />
          <Button
            text={"Save"}
            className={styles["Save_Button_Polls_meeting"]}
          />
        </Col>
      </Row>
    </section>
  );
};

export default CreateTask;
