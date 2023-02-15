import React, { useState } from "react";
import styles from "./PackageCards.module.css";
import { useLocation } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Row, Col, Button, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./../../../i18n";

import { useTranslation } from "react-i18next";

const PackageCards = ({
  packageTitle,
  actualAmount,
  para,
  discountAmount,
  selectedPackageAmount,
  SelectedPackgeSubscription,
}) => {
  const [annualPackageShow, setAnnualPackageShow] = useState(false);
  const location = useLocation();
  // for translation
  const { t } = useTranslation();
  const handleManualPackage = () => {
    setAnnualPackageShow(false);
  };
  const handleAnnualPackage = () => {
    setAnnualPackageShow(true);
  };
  return (
    <Row className="g-4">
      <Col sm={12}>
        <Card className={styles["packagecard"]}>
          <Row>
            <Col sm={12}>
              <h4 className="text-center">{packageTitle}</h4>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {location.pathname === "/packageselection" ? (
                <>
                  <div
                    className={`${styles["packagecard_priceBox_container"]}`}
                  >
                    <div className={styles["packagecard_one"]}>
                      <div className={styles["packagecard_pricebox"]}>
                        <h4 className="d-flex justify-content-center align-items-center  h-100">
                          ${actualAmount}/<p>{t("Month")}</p>
                        </h4>
                      </div>
                      <div className="d-flex">
                        <span
                          className="border border-1 w-100"
                          onClick={handleManualPackage}
                        >
                          {t("Monthly")}
                        </span>
                        <span
                          className=" border border-1 w-100"
                          onClick={handleAnnualPackage}
                        >
                          {t("Annually")}
                        </span>
                      </div>
                    </div>

                    <div
                      className={
                        annualPackageShow
                          ? `${styles["packagecard_two"]}`
                          : ` ${styles["packagecard_two_visible"]}`
                      }
                    >
                      <div className={styles["packagecard_disoucntprice"]}>
                        <p className={styles["packagecard_disoucntprice_para"]}>
                          {t("Pay-only")}
                        </p>
                        <h4 className="d-flex justify-content-center align-items-center mt-2">
                          ${discountAmount}/<p>{t("Month")}</p>
                        </h4>
                        <p className={styles["packagecard_disoucntprice_para"]}>
                          {t("For-first-year")}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`${styles["packagecard_priceBox_container"]}`}
                  >
                    <div className={styles["selectedPackage_priceDetails"]}>
                      <div className={styles["packagecard_disoucntprice"]}>
                        <h4 className="d-flex justify-content-center align-items-center mt-2">
                          ${selectedPackageAmount}/<p>{t("Month")}</p>
                        </h4>
                        <p
                          className={
                            styles["selectedpackagecard_disoucntprice_para"]
                          }
                        >
                          {`${SelectedPackgeSubscription}`} {t("Subscriptions")}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Col>
            <Col sm={12} className="my-3">
              <Row>
                <Col sm={12} md={6} lg={6} className="text-center m-0 p-0 ">
                  <p className="border m-0 p-0">{t("Subscription-date")}</p>
                  <p className="border">19-Dec-22</p>
                </Col>
                <Col sm={12} md={6} lg={6} className="text-center m-0 p-0 ">
                  <p className="border m-0 p-0">{t("Expiry-date")}</p>
                  <p className="border">18-Dec-23</p>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className={styles["selected-package-text"]}>
            <p>{para}</p>
          </div>
          <Row>
            <Col sm={12}>
              {!location.pathname.includes("/PackageDetail") &&
              !location.pathname.includes("/CancelSub") ? (
                <div className={styles["packagecard_usersallows"]}>
                  <Row>
                    <Col sm={12}>
                      {!location.pathname.includes("/PackageDetail") &&
                      !location.pathname.includes("/CancelSub") ? (
                        <div className={styles["packagecard_usersallows"]}>
                          <h6
                            className={
                              styles["packagecard_usersallows_heading"]
                            }
                          >
                            {t(" AllowedUsers")}
                          </h6>
                          <Row>
                            <Col sm={12} md={6} lg={6} className="m-0 p-0">
                              <p
                                className={
                                  styles["packagecard_usersallows_members"]
                                }
                              >
                                {t("BoardMembers")}
                              </p>
                              <span>02</span>
                            </Col>
                            <Col sm={12} md={6} lg={6} className="m-0 p-0">
                              <p
                                className={
                                  styles["packagecard_usersallows_members"]
                                }
                              >
                                {t("Executives")}
                              </p>
                              <span>03</span>
                            </Col>
                          </Row>

                          <Row className="mt-4 m-0">
                            {location.pathname === "/selectedpackage" ? null : (
                              <>
                                {" "}
                                <Col sm={12}>
                                  <Button className={styles["packagecard_btn"]}>
                                    {" "}
                                    Package
                                  </Button>
                                </Col>
                                <Col>
                                  <Link to="">View Package Details</Link>
                                </Col>
                              </>
                            )}
                          </Row>
                        </div>
                      ) : (
                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className="text-center text-uppercase fw-bold my-2"
                          >
                            {t("Users")}
                          </Col>
                          <Col sm={12} md={12} lg={12} className="m-0 p-0">
                            <ProgressBar
                              now={2}
                              max={3}
                              className={styles["ExecutiveMembersRange"]}
                            />
                          </Col>
                          <Col sm={12} md={12} lg={12} className="m-0">
                            2 of 3 Executives
                          </Col>
                          <Col sm={12} md={12} lg={12} className="m-0 p-0">
                            <ProgressBar
                              now={1}
                              max={2}
                              className={styles["BoardMembersRange"]}
                            />
                          </Col>
                          <Col sm={12} md={12} lg={12} className="m-0">
                            1 to 2 Board memebers
                          </Col>
                        </Row>
                      )}
                    </Col>
                  </Row>
                  <Row className="mt-4 m-0">
                    {!location.pathname === "/selectedpackage" ? (
                      <>
                        {" "}
                        <Col sm={12}>
                          <Button className={styles["packagecard_btn"]}>
                            {" "}
                            Package
                          </Button>
                        </Col>
                        <Col>
                          <Link to="">View Package Details</Link>
                        </Col>
                      </>
                    ) : null}
                  </Row>
                </div>
              ) : (
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="text-center text-uppercase fw-bold my-2"
                  >
                    {t("Users")}
                  </Col>
                  <Col sm={12} md={12} lg={12} className="m-0 p-0">
                    <ProgressBar
                      now={2}
                      max={3}
                      className={styles["ExecutiveMembersRange"]}
                    />
                  </Col>
                  <Col sm={12} md={12} lg={12} className="m-0">
                    {t("2-of-3-executives")}
                  </Col>
                  <Col sm={12} md={12} lg={12} className="m-0 p-0">
                    <ProgressBar
                      now={1}
                      max={2}
                      className={styles["BoardMembersRange"]}
                    />
                  </Col>
                  <Col sm={12} md={12} lg={12} className="m-0">
                    {t("1-to-2-board-memebers")}
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default PackageCards;
