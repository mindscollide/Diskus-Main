import React, { useEffect, useState } from "react";
import styles from "./BillProcessStepThree.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, TableToDo, Loader } from "../../../../../components/elements";
import ellipses from "../../../../../assets/images/ellipses.svg";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationSelectedPakagesAPI } from "../../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
import { convertUTCDateToLocalDate } from "../../../../../commen/functions/date_formater";
const BillProcessStepThree = ({ updateTotalYearlyCharges }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let currentLanguage = localStorage.getItem("i18nextLng");

  const { UserMangementReducer, LanguageReducer } = useSelector(
    (state) => state
  );

  const organizationName = localStorage.getItem("organizatioName");
  //States
  const [getAllPakagesData, setGetAllPakagesData] = useState([]);
  const [expiryDate, setExpiryDate] = useState(null);

  //UseEffect For Get All Organziation Selected Pakages

  useEffect(() => {
    try {
      let data = { OrganizationName: organizationName };
      dispatch(getOrganizationSelectedPakagesAPI(navigate, t, data));
    } catch (error) {
      console.log(error);
    }
  }, []);

  //excreting the data for  Get All Organziation Selected Pakages

  useEffect(() => {
    try {
      if (
        UserMangementReducer.getAllSelectedPakagesData !== null &&
        UserMangementReducer.getAllSelectedPakagesData !== undefined
      ) {
        setGetAllPakagesData(
          UserMangementReducer.getAllSelectedPakagesData
            .organizationSelectedPackages
        );

        setExpiryDate(
          UserMangementReducer.getAllSelectedPakagesData
            .organizationSubscription.subscriptionExpiryDate
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [UserMangementReducer.getAllSelectedPakagesData]);

  const ColumnsPakageSelection = [
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Pakage-details")}
        </span>
      ),
      width: 100,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <span className={styles["Tableheading"]}>{record.name}</span>
          </>
        );
      },
    },
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Charges-per-license-US$")}
        </span>
      ),
      dataIndex: "price",
      key: "price",
      width: 100,
      align: "center",
      render: (text, record) => {
        return (
          <>
            <span className={styles["ChargesPerLicesense"]}>
              {record.price}
            </span>
          </>
        );
      },
    },
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Number-of-licenses")}
        </span>
      ),
      width: 100,
      dataIndex: "headCount",
      key: "headCount",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <span className={styles["ChargesPerLicesense"]}>
              {record.headCount}
            </span>
          </>
        );
      },
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
      render: (text, record) => {
        if (record.name === "Total") {
          // For the total row, directly use the calculated value
          return (
            <span className={styles["ChargesPerLicesense"]}>
              {record.Yearlycharges.toLocaleString()}
            </span>
          );
        } else {
          // For regular rows, calculate the yearly charges
          const yearlyCharge = (record.price * record.headCount || 0) * 12;
          return (
            <span className={styles["ChargesPerLicesense"]}>
              {yearlyCharge.toLocaleString()}
            </span>
          );
        }
      },
    },
  ];

  const calculateTotals = (data) => {
    const totalLicenses = data.reduce(
      (acc, cur) => acc + (Number(cur.headCount) || 0),
      0
    );

    const totalYearlyCharges = data.reduce(
      (acc, cur) => acc + (Number(cur.price * cur.headCount) * 12 || 0),
      0
    );

    updateTotalYearlyCharges(totalYearlyCharges);

    // Return an object with the totals that can be used as a row in your table.
    return {
      name: "Total",
      headCount: totalLicenses,
      Yearlycharges: totalYearlyCharges, // Format to string with thousand separators.
    };
  };

  const totalRow = calculateTotals(getAllPakagesData);

  return (
    <>
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
                  rows={[...getAllPakagesData, totalRow]}
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
                        {convertUTCDateToLocalDate(
                          expiryDate + "000000",
                          currentLanguage
                        )}
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
      {UserMangementReducer.Loading || LanguageReducer.Loading ? (
        <Loader />
      ) : null}
    </>
  );
};

export default BillProcessStepThree;