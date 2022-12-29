import React, { useState } from "react";
import styles from "./PackageSelected.module.css";
import { Container, Row, Col } from "react-bootstrap";

import PackageCards from "../../../../components/elements/packageselection/PackageCards";
import SelectedPackageCard from "../../../../components/elements/selectedpackagecard/SelectedPackageCard";
import { Button } from "../../../../components/elements";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PackageSelected = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [packageSelectedData, setPackageSelectedData] = useState({
    Company: "Handmade Graphics",
    Country: "United State",
    Address1: "3292 Stiles Street Pittsbrugh, PA 15203",
    Address2: "3292 Stiles Street Pittsbrugh, PA 15203",
    Email: "test@gmail.com",
    State: "New York",
    City: "New York City",
    PostalCode: "10001",
  });
  const goBacktoSignUp = () => {
    navigate("/packageselection");
  };
  const goForPayment = () => {
    navigate("/paymentForm");
  };
  return (
    <Container>
      <Row>
        <Col sm={12} lg={10} md={10} className="mx-auto">
          <Row>
            <Col className="d-flex justify-content-center mt-2">
              <h2 className={styles["selectedpackagepage_heading"]}>
                Selected Package
              </h2>
            </Col>
          </Row>
          <Row>
            <Col sm={12} lg={5} md={5}>
              <PackageCards
                packageTitle="PREMIUM"
                selectedPackageAmount={t("55")}
                SelectedPackgeSubscription="Yearly"
              />
            </Col>
            <Col sm={12} lg={7} md={7}>
              <SelectedPackageCard
                RowsData={
                  <>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="fw-bold">Company</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.Company}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="fw-bold">Country</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.Country}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="fw-bold">Address1</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.Address1}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="fw-bold">Address2</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.Address2}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="fw-bold">Email</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.Email}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="fw-bold">State</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.State}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="fw-bold">City</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.City}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="fw-bold">Postal/Zip Code</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.PostalCode}</p>
                      </Col>
                    </Row>
                  </>
                }
              />
            </Col>
          </Row>
          <Row className="my-3">
            <Col sm={12} md={6} lg={6} className="d-flex justify-content-start">
              <Button
                text="Go Back"
                onClick={goBacktoSignUp}
                className={styles["goBack_SelectedPackage"]}
              />
            </Col>
            <Col
              sm={12}
              md={6}
              lg={6}
              className="d-flex justify-content-end p-0"
            >
              <Button
                text="Process To Payment"
                onClick={goForPayment}
                className={styles["ProcessToPayment_SelectedPackage"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default PackageSelected;
