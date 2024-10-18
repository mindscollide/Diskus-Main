import React from "react";
import styles from "./UpgradePackageDetail.module.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./../../../i18n";
import { useTranslation } from "react-i18next";
import Button from "../../elements/button/Button";
import { useLocation } from "react-router-dom";
const UpgradePackageDetail = () => {
  // for translation
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <Container>
      <Card className={styles["UpgradePackageCard"]}>
        <Row>
          <Col
            sm={12}
            md={4}
            lg={4}
            className="border-right-0 position-relative"
          >
            {location.pathname.includes("/UpgradePackageDetail") ? (
              <>
                <h3 className={styles["packageheading"]}>{t("Premium")}</h3>
                <h4 className="text-center fw-900 m-0 p-0">
                  ${t("55")}/<span className="fs-6">{t("Month")}</span>
                </h4>
                <p className="mx-auto text-center m-0 p-0">
                  {t("Annually-subscription")}
                </p>
                <div className={styles["packageDetails"]}>
                  <p>{t("Get-more-users")}</p>
                  <p>
                    {t("2-board-members")} <br /> {t("And-3-executives")}
                  </p>
                </div>
                <span className={styles["lineBar"]}></span>
              </>
            ) : (
              <>
                <Row>
                  <Col>
                    <h3 className={styles["packageheading"]}>{t("Premium")}</h3>
                    <div className="border w-50 mx-auto p-2">
                      <h4 className="text-center fw-900 m-0 p-0">
                        $55/<span className="fs-6">{t("Month")}</span>
                      </h4>
                      <p className="mx-auto text-center m-0 p-0">
                        {t("Annually-subscription")}
                      </p>
                    </div>
                    <Row className="px-5 mt-4">
                      <Row>
                        <Col className="text-center fw-900 mb-2 text-uppercase text-black">
                          {t("Allowed-users")}
                        </Col>
                      </Row>
                      <Col
                        sm={12}
                        md={6}
                        lg={6}
                        className="text-center m-0 p-0"
                      >
                        <p
                          className={`${
                            styles["backgroundcolor_title"]
                          } ${"border m-0 p-0"}`}
                        >
                          {t("Board-members")}
                        </p>
                        <p className="border">07</p>
                      </Col>
                      <Col
                        sm={12}
                        md={6}
                        lg={6}
                        className="text-center m-0 p-0"
                      >
                        <p
                          className={`${
                            styles["backgroundcolor_title"]
                          } ${"border m-0 p-0"}`}
                        >
                          {t("Executives")}
                        </p>
                        <p className="border">08</p>
                      </Col>
                    </Row>
                    <span className={styles["lineBar"]}></span>
                  </Col>
                </Row>
              </>
            )}
          </Col>
          <Col sm={12} md={8} lg={8}>
            <Row>
              <Col
                sm={12}
                lg={12}
                md={12}
                className={styles["upgradePackageAmoutnandList"]}
              >
                <h4>{t("Included-features")}</h4>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s
                </p>
                <ul>
                  <li>{t("Get-more-users")}</li>
                  <li>{t("Theme-customization")}</li>
                  <li>{t("Marketing-tools")}</li>
                  <li>{t("Analytics")}</li>
                </ul>
              </Col>
              <Col
                sm={12}
                lg={12}
                md={12}
                className="d-flex justify-content-end"
              >
                <Button
                  text={t("Proceed-to-payment")}
                  className={styles["UpgradeBtnCard"]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default UpgradePackageDetail;
