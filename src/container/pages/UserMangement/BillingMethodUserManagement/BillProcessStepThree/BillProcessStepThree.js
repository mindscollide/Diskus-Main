import React, { useEffect, useState } from "react";
import styles from "./BillProcessStepThree.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, TableToDo } from "../../../../../components/elements";
import ellipses from "../../../../../assets/images/ellipses.svg";
import { useDispatch } from "react-redux";
import { getOrganizationSelectedPakagesAPI } from "../../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
const BillProcessStepThree = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  //States
  const [getAllPakagesData, setGetAllPakagesData] = useState([]);

  //UseEffect For Get All Organziation Selected Pakages

  useEffect(() => {
    let data = {};
    dispatch(getOrganizationSelectedPakagesAPI(navigate, t, data));
  }, []);

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
    Numberoflicenses: <span className={styles["ChargesPerLicesense"]}>43</span>,
    Yearlycharges: (
      <span className={styles["ChargesPerLicesense"]}>13,072</span>
    ),
  };
  return (
    <Container>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className={styles["outerBoxForBilling"]}
        >
          <Row className="mt-3">
            <Col lg={9} md={9} sm={12} xs={12}>
              <TableToDo
                column={ColumnsPakageSelection}
                className={"Billing_TablePakageSelection"}
                rows={[...Data, defaultRow]}
                pagination={false}
                id="PakageDetails"
                rowHoverBg="none"
                scroll={{ x: true }}
              />
            </Col>
            <Col lg={3} md={3} sm={12} xs={12}>
              <section className={styles["OuterBoxExpiryNotification"]}>
                <Row className="mt-0">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <img src={ellipses} alt="" />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <span className={styles["AlertHeading"]}>
                      {t("Your-subscription-will-expire-on")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <span className={styles["dateStyles"]}>
                      20 December 2024
                    </span>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <Button
                      text={t("Change-pakage-details")}
                      className={styles["ChangePakageDetailsButton"]}
                    />
                  </Col>
                </Row>
              </section>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BillProcessStepThree;
