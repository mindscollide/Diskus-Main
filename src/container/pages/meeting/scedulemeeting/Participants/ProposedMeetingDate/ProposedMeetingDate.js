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
          className="d-flex align-items-center align-items-center gap-3"
        >
          <img
            src={BackArrow}
            width="20.5px"
            height="18.13px"
            className="cursor-pointer"
          />
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
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <p className={styles["Paragraph_Styles"]}>
                  Description fits in here. Proin at malesuada lorem. Aenean
                  posuere libero vel ipsum dignissim ultricies viverra non
                  tellus. Fusce aliquet finibus nisl, et hendrerit nisl
                  dignissim at. Praesent luctus rutrum lacinia. Nulla lacinia
                  feugiat sagittis. Aenean at magna aliquet, dignissim ligula
                  quis, ornare ante. Interdum et malesuada fames ac ante ipsum
                  primis in faucibus. Ut diam dui, iaculis nec dui vel, commodo
                  dapibus libero.Vivamus interdum purus sed pellentesque
                  ultricies. Nullam ut nulla libero. Nam libero urna, pharetra
                  et dignissim in, malesuada at urna. Aliquam erat volutpat.
                  Curabitur molestie congue ipsum vitae luctus. Cras sed dolor
                  eget turpis condimentum maximus et sit amet ipsum. Suspendisse
                  non nulla vitae metus tincidunt vulputate. Aenean malesuada
                  lacinia ipsum, vitae porta ex elementum ac. Nulla vestibulum
                  cursus felis, vel molestie nibh mollis sit amet. Suspendisse
                  nec dui semper, lobortis est nec, aliquet felis. Etiam sed
                  odio in diam faucibus pretium.
                </p>
              </Col>
            </Row>
            <Row>
              <Col lg={8} md={8} sm={8}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Prposed_On_Heading"]}>
                      {t("Proposed-on")}{" "}
                      <span className={styles["Steric_Color"]}>*</span>
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col lg={4} md={4} sm={4}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Prposed_On_Heading"]}>
                      {t("Send-response-by")}{" "}
                      <span className={styles["Steric_Color"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row className="m-0 p-0 mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Box_for_Send_Request"]}
                  >
                    <span className={styles["Date_Year_Styles"]}>
                      21st May, 2020
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>
    </section>
  );
};

export default ProposedMeetingDate;
