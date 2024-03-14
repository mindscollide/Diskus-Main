import React from "react";
import styles from "./PakageDetailsAdmin.module.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, TableToDo } from "../../../../../components/elements";
const PakageDetailsAdmin = () => {
  const { t } = useTranslation();

  const ColumnsPakageSelection = [
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Pakage-details")}
        </span>
      ),
      width: 100,
      dataIndex: "Pakagedetails",
      key: "Pakagedetails",
      align: "center",
    },
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Charges-per-license-US$")}
        </span>
      ),
      dataIndex: "Chargesperlicense",
      key: "Chargesperlicense",
      width: 100,
      align: "center",
    },
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Number-of-licenses")}
        </span>
      ),
      width: 100,
      dataIndex: "Numberoflicenses",
      key: "Numberoflicenses",
      align: "center",
    },
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Yearly-charges-in")}
        </span>
      ),
      dataIndex: "Yearlycharges",
      key: "Yearlycharges",
      align: "center",
      width: 100,
    },
  ];
  const Data = [
    {
      Pakagedetails: (
        <span className={styles["Tableheading"]}>{t("Essential")}</span>
      ),
      Chargesperlicense: (
        <>
          <span className={styles["ChargesPerLicesense"]}>25</span>
        </>
      ),
      Numberoflicenses: (
        <>
          <span className={styles["ChargesPerLicesense"]}>12</span>
        </>
      ),

      Yearlycharges: (
        <>
          <span className={styles["ChargesPerLicesense"]}>1,024</span>
        </>
      ),
    },
    {
      Pakagedetails: (
        <span className={styles["Tableheading"]}>{t("Professional")}</span>
      ),
      Chargesperlicense: (
        <>
          <span className={styles["ChargesPerLicesense"]}>35</span>
        </>
      ),
      Numberoflicenses: (
        <>
          <span className={styles["ChargesPerLicesense"]}>35</span>
        </>
      ),

      Yearlycharges: (
        <>
          <span className={styles["ChargesPerLicesense"]}>875</span>
        </>
      ),
    },
    {
      Pakagedetails: (
        <span className={styles["Tableheading"]}>{t("Premium")}</span>
      ),
      Chargesperlicense: (
        <>
          <span className={styles["ChargesPerLicesense"]}>45</span>
        </>
      ),
      Numberoflicenses: (
        <span className={styles["ChargesPerLicesense"]}>45</span>
      ),
      Yearlycharges: (
        <>
          <span className={styles["ChargesPerLicesense"]}>9,024</span>
        </>
      ),
    },
  ];

  const defaultRow = {
    Pakagedetails: <span className={styles["TableheadingTotal"]}>Total</span>,
    Numberoflicenses: (
      <span className={styles["ChargesPerLicesensetotal"]}>43</span>
    ),
    Yearlycharges: (
      <span className={styles["ChargesPerLicesensetotal"]}>13,072</span>
    ),
  };
  return (
    <Container className="p-3">
      <Row className="mt-3">
        <Col
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="d-flex justify-content-center"
        >
          <span className={styles["PakageDetailsHeading"]}>
            {t("Pakage-details")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col xl={4} lg={4} md={4} sm={12} xs={12}>
          <Card className={styles["packagecard"]}>
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
            <Row className="mt-5">
              <Col xs={12} sm={12} md={1} lg={1}></Col>
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["UpgradePlanHeading"]}>
                  {t("Upgrade-your-plan")}
                </span>
              </Col>
              <Col xs={12} sm={12} md={1} lg={1}></Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Row className="mt-4">
                  <Col xs={12} sm={12} md={2} lg={2}></Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={8}
                    lg={8}
                    className="text-center m-0 p-0 "
                  >
                    <p className={styles["subcriptionkey_1"]}>
                      {t("Subscription-date")}
                    </p>
                    <p className={styles["subcriptionvalue_1"]}>
                      22 December 2023
                    </p>
                  </Col>
                  <Col xs={12} sm={12} md={2} lg={2}></Col>
                </Row>
                <Row className="mt-4">
                  <Col xs={12} sm={12} md={2} lg={2}></Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={8}
                    lg={8}
                    className="text-center m-0 p-0 "
                  >
                    <p className={styles["subcriptionkey_2"]}>
                      {t("Expiry-date")}
                    </p>
                    <p className={styles["subcriptionvalue_2"]}>
                      21 December 2024
                    </p>
                  </Col>
                  <Col xs={12} sm={12} md={2} lg={2}></Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className="d-flex justify-content-center"
              >
                <Button
                  text={t("Upgrade")}
                  className={styles["UpdateButtonPakageDetails"]}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xl={8} lg={8} md={8} sm={12} xs={12}>
          <Card className={styles["DetailsCard"]}>
            <Row className="mt-4">
              <Col lg={12} md={12} sm={12} xs={12}></Col>
            </Row>
            <Row className="mt-5">
              <Col lg={12} md={12} sm={12} xs={12}>
                <TableToDo
                  column={ColumnsPakageSelection}
                  className={"Billing_TablePakageSelection"}
                  rows={[...Data, defaultRow]}
                  pagination={false}
                  id="UpgradePakageDetails"
                  rowHoverBg="none"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PakageDetailsAdmin;
