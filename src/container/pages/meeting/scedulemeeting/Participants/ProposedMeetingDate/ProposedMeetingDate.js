import React from "react";
import styles from "./ProposedMeetingDate.module.css";
import { Col, Row } from "react-bootstrap";
import BackArrow from "../../../../../../assets/images/Back Arrow.svg";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { style } from "@mui/system";
const ProposedMeetingDate = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <section>
      <Row className="mt-2">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex align-items-center align-items-center gap-2"
        >
          <img src={BackArrow} width="20.5px" height="18.13px" />
          <span className={styles["Prposed_Meeting_heading"]}>
            {t("Propose-meeting-date")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["Paper_styling"]}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Heading_prposed_meeting"]}>
                  IT Departmental Meeting lorem. Aenean posuere libero vel ipsum
                  digniss IT Departmental Meeting lorem. Aenean posuere libero
                  vel ipsum digniss
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Staff_meeting_Heading"]}>
                  Staff Meeting <span>(Conference Room)</span>
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}></Col>
            </Row>
          </Paper>
        </Col>
      </Row>
    </section>
  );
};

export default ProposedMeetingDate;
