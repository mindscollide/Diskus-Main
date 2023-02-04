import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PackageCards from "../../../../components/elements/packageselection/PackageCards";

import styles from "./PackageSelection.module.css";
import Button from "../../../../components/elements/button/Button";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import PackageCardRibbon from "../../../../assets/images/newElements/PackageCardRibbon.svg";
import { useDispatch, useSelector } from "react-redux";
import { getSubscriptionDetails } from "../../../../store/actions/GetSubscriptionPackages";
import Loader from "../../../../components/elements/loader/Loader";
import {
  organizationPackageReselection,
  setLoader,
} from "../../../../store/actions/Auth2_actions";
const PackageSelection = () => {
  const navigate = useNavigate();
  const { GetSubscriptionPackage, Authreducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [currentPackageId, setCurrentPackageId] = useState(0);
  const [annualPackageShow, setAnnualPackageShow] = useState(false);
  const [monthlyPackageShow, setMonthlyPackageShow] = useState(true);
  const [packageDetail, setPackageDetail] = useState([]);
  const handleManualPackage = (packageId) => {
    setCurrentPackageId(packageId);
    console.log(packageId);
    setAnnualPackageShow(false);
    setMonthlyPackageShow(true);
  };
  const handleAnnualPackage = (packageId) => {
    setCurrentPackageId(packageId);
    console.log(packageId);
    setAnnualPackageShow(true);
    setMonthlyPackageShow(false);
  };

  let flagForSelectedPackeg = localStorage.getItem("flagForSelectedPackeg");
  console.log("flagForSelectedPackeg", flagForSelectedPackeg);
  const handleClickPackage = (id) => {
    localStorage.setItem("PackageID", JSON.parse(id));
    if (flagForSelectedPackeg != undefined) {
      dispatch(setLoader(true));
      dispatch(organizationPackageReselection(parseInt(id, navigate, t)));
    } else {
      dispatch(setLoader(true));
      navigate("/signuporganization");
    }
  };
  useEffect(() => {
    dispatch(getSubscriptionDetails());
  }, []);
  useEffect(() => {
    if (GetSubscriptionPackage.PackageDetails.length > 0) {
      let packageData = [];
      GetSubscriptionPackage.PackageDetails.map((data, index) => {
        packageData.push(data);
      });
      setPackageDetail(packageData);
    }
  }, [GetSubscriptionPackage.Loading]);
  console.log(packageDetail, "packageDetailpackageDetail ");
  return (
    <Container>
      <Row>
        <Col sm={12} className="mt-4">
          <h2 className={styles["packageselection_heading"]}>Select Package</h2>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={12} lg={12} className={styles["packageselection_bar"]}>
          enjoy extra discount on first annual subscription
        </Col>
      </Row>
      <Row className="mt-3">
        {packageDetail.length > 0 ? (
          packageDetail.map((data, index) => {
            return (
              <Col
                sm={12}
                lg={4}
                md={4}
                className="my-2"
                key={data.pK_SubscriptionPackageID}
              >
                <Row className="g-4">
                  <Col sm={12}>
                    <Card className={styles["packagecard"]}>
                      <Row>
                        <Col>
                          <img
                            src={PackageCardRibbon}
                            className={styles["packageRibbon"]}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={12}>
                          <h4 className="text-center">{data.packageName}</h4>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={12}>
                          <Col
                            className={`${styles["packagecard_priceBox_container"]}`}
                          >
                            <div className={styles["packagecard_one"]}>
                              <div className={styles["packagecard_pricebox"]}>
                                <h4
                                  className={
                                    monthlyPackageShow
                                      ? `${styles["package_actualPrice"]}`
                                      : currentPackageId ===
                                        data.pK_SubscriptionPackageID
                                      ? `${styles["package_actualPrice_active"]}`
                                      : `${styles["package_actualPrice"]}`
                                  }
                                >
                                  ${data.packageActualPrice}/<p>{t("month")}</p>
                                </h4>
                              </div>
                              <div className="d-flex">
                                <span
                                  className={
                                    monthlyPackageShow &&
                                    currentPackageId ===
                                      data.pK_SubscriptionPackageID
                                      ? `${styles["spanActive"]}`
                                      : monthlyPackageShow &&
                                        currentPackageId ===
                                          data.pK_SubscriptionPackageID
                                      ? `${styles["spanActive"]}`
                                      : `${styles["span"]}`
                                  }
                                  onClick={() =>
                                    handleManualPackage(
                                      data.pK_SubscriptionPackageID
                                    )
                                  }
                                >
                                  {t("Monthly")}
                                </span>
                                <span
                                  className={
                                    annualPackageShow &&
                                    currentPackageId ===
                                      data.pK_SubscriptionPackageID
                                      ? `${styles["spanActive"]}`
                                      : `${styles["span"]}`
                                  }
                                  onClick={() =>
                                    handleAnnualPackage(
                                      data.pK_SubscriptionPackageID
                                    )
                                  }
                                >
                                  {t("Annually")}
                                </span>
                              </div>
                            </div>

                            <Col
                              className={
                                annualPackageShow &&
                                currentPackageId ===
                                  data.pK_SubscriptionPackageID
                                  ? `${styles["packagecard_two"]}`
                                  : ` ${styles["packagecard_two_visible"]}`
                              }
                            >
                              <Col
                                className={styles["packagecard_disoucntprice"]}
                              >
                                <p
                                  className={
                                    styles["packagecard_disoucntprice_para"]
                                  }
                                >
                                  {t("PayOnly")}
                                </p>
                                <h4 className="d-flex justify-content-center align-items-center mt-1">
                                  ${data.firstYearDiscountPercentage}/
                                  <p>{t("month")}</p>
                                </h4>
                                <p
                                  className={
                                    styles["packagecard_disoucntprice_para"]
                                  }
                                >
                                  {t("forFirstYear")}
                                </p>
                              </Col>
                            </Col>
                          </Col>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={12}>
                          <div className={styles["packagecard_usersallows"]}>
                            <Row>
                              <Col sm={12}>
                                <Col
                                  className={styles["packagecard_usersallows"]}
                                >
                                  <h6
                                    className={
                                      styles["packagecard_usersallows_heading"]
                                    }
                                  >
                                    {t("AllowedUser")}
                                  </h6>
                                  <Row className="mx-auto">
                                    <Col sm={12} md={6} lg={6}>
                                      <Col
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className={
                                          styles["package_membersHeading"]
                                        }
                                      >
                                        Board Members
                                      </Col>
                                      <Col
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className={
                                          styles[
                                            "package_membersHeading_values"
                                          ]
                                        }
                                      >
                                        {data.packageAllowedBoardMemberUsers}
                                      </Col>
                                    </Col>
                                    <Col sm={12} md={6} lg={6}>
                                      <Col
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className={
                                          styles["package_membersHeading"]
                                        }
                                      >
                                        Admin Users
                                      </Col>
                                      <Col
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className={
                                          styles[
                                            "package_membersHeading_values"
                                          ]
                                        }
                                      >
                                        {data.packageAllowedAdminUsers}
                                      </Col>
                                    </Col>
                                  </Row>
                                </Col>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col className={styles["selected-package-text"]}>
                          <p>{data.packageDescriptiveDetails}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={12}>
                          <Button
                            text={" Package"}
                            className={styles["packagecard_btn"]}
                            onClick={() =>
                              handleClickPackage(data.pK_SubscriptionPackageID)
                            }
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </Col>
            );
          })
        ) : (
          <Loader />
        )}
      </Row>
      <Row>
        <Col className="d-flex justify-content-center ">
          <Link to="/" className={styles["goBackPackageSelectionBtn"]}>
            Go Back
          </Link>
        </Col>
      </Row>
      {Authreducer.Loading ? <Loader /> : null}
    </Container>
  );
};

export default PackageSelection;
