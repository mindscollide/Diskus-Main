import React from "react";
import styles from "./CancelSubscriptionAdmin.module.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const CancelSubscriptionAdmin = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Row className="mt-3">
        <Col
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="d-flex justify-content-center"
        >
          <span className={styles["CancelSubscriptionHeading"]}>
            {t("Cancel-subscription")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={1} md={1} sm={12} xs={12}></Col>
        <Col lg={10} md={10} sm={12} xs={12}>
          <Card className={styles["CardCancelSubscription"]}>
            <Row className="mt-3">
              <Col sm={12}>
                <span class="icon-star package-icon-style">
                  <span
                    class="path1"
                    // style={{ color: packageColorPath1 }}
                  ></span>
                  <span
                    class="path2"
                    // style={{ color: packageColorPath2 }}
                  ></span>
                  <span
                    class="path3"
                    // style={{ color: packageColorPath2 }}
                  ></span>
                </span>
                <h3 className={styles["packageCard_title"]}>
                  {/* {isPackageDetail.PackageTitle} */}
                </h3>{" "}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={1} md={1} sm={12} xs={12}></Col>
      </Row>
    </Container>
  );
};

export default CancelSubscriptionAdmin;
