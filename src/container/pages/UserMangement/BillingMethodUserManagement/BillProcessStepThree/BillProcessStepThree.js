import React, { useEffect, useState } from "react";
import styles from "./BillProcessStepThree.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, TableToDo, Loader } from "../../../../../components/elements";
import ellipses from "../../../../../assets/images/ellipses.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrganizationSelectedPakagesAPI,
  signUpFlowRoutes,
} from "../../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
import { convertUTCDateToLocalDate } from "../../../../../commen/functions/date_formater";
const BillProcessStepThree = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let currentLanguage = localStorage.getItem("i18nextLng");
  const SignupPage = localStorage.getItem("SignupFlowPageRoute");

  const { UserMangementReducer, LanguageReducer } = useSelector(
    (state) => state
  );

  const organizationName = localStorage.getItem("organizatioName");
  const organizationSubscriptionID = localStorage.getItem(
    "organizationSubscriptionID"
  );
  //States
  const [getAllPakagesData, setGetAllPakagesData] = useState([]);
  const [expiryDate, setExpiryDate] = useState(null);
  const [tenureID, setTenureID] = useState(0);

  //UseEffect For Get All Organziation Selected Pakages

  useEffect(() => {
    try {
      if (SignupPage === 5) {
        let data = {
          OrganizationName: organizationName,
          OrganizationSubscriptionID: Number(organizationSubscriptionID),
        };
        dispatch(getOrganizationSelectedPakagesAPI(navigate, t, data));
      } else {
        let data = {
          OrganizationName: organizationName,
          OrganizationSubscriptionID: Number(organizationSubscriptionID),
        };
        dispatch(getOrganizationSelectedPakagesAPI(navigate, t, data));
      }
    } catch (error) {
      console.log(error);
    }
    return () => {
      setGetAllPakagesData([]);
      setExpiryDate(null);
    };
  }, []);

  //excreting the data for  Get All Organziation Selected Pakages
  useEffect(() => {
    try {
      if (
        UserMangementReducer.getAllSelectedPakagesData !== null &&
        UserMangementReducer.getAllSelectedPakagesData !== undefined
      ) {
        if (
          UserMangementReducer.getAllSelectedPakagesData
            .organizationSubscription.organizationSelectedPackages !== null &&
          UserMangementReducer.getAllSelectedPakagesData
            .organizationSubscription.organizationSelectedPackages !==
            undefined &&
          UserMangementReducer.getAllSelectedPakagesData
            .organizationSubscription.organizationSelectedPackages.length > 0
        ) {
          console.log(
            UserMangementReducer.getAllSelectedPakagesData
              .organizationSubscription.fK_TenureOfSubscriptionID,
            "setGetAllPakagesData"
          );
          setTenureID(
            UserMangementReducer.getAllSelectedPakagesData
              .organizationSubscription.fK_TenureOfSubscriptionID
          );
          setGetAllPakagesData(
            UserMangementReducer.getAllSelectedPakagesData
              .organizationSubscription.organizationSelectedPackages
          );
        }
        if (
          UserMangementReducer.getAllSelectedPakagesData
            .organizationSubscription.subscriptionExpiryDate !== null
        ) {
          setExpiryDate(
            UserMangementReducer.getAllSelectedPakagesData
              .organizationSubscription.subscriptionExpiryDate
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [UserMangementReducer.getAllSelectedPakagesData]);

  const ColumnsPakageSelection = [
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Package-details")}
        </span>
      ),
      width: 100,
      dataIndex: "name",
      key: "name",
      ellipses: true,
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
      ellipses: true,
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
      ellipses: true,
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
  ];

  if (tenureID === 1) {
    ColumnsPakageSelection.push({
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Yearly-charges-in")}
        </span>
      ),
      dataIndex: "Yearlycharges",
      key: "Yearlycharges",
      align: "center",
      ellipses: true,
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
    });
  } else if (tenureID === 2) {
    ColumnsPakageSelection.push({
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Monthly-charges-in")}
        </span>
      ),
      dataIndex: "Monthlycharges",
      key: "Monthlycharges",
      align: "center",
      ellipses: true,
      width: 100,
      render: (text, record) => {
        if (record.name === "Total") {
          // For the total row, directly use the calculated value
          return (
            <span className={styles["ChargesPerLicesense"]}>
              {record.Monthlycharges.toLocaleString()}
            </span>
          );
        } else {
          // For regular rows, calculate the yearly charges
          const MonthlyCharge = record.price * record.headCount || 0;
          return (
            <span className={styles["ChargesPerLicesense"]}>
              {MonthlyCharge.toLocaleString()}
            </span>
          );
        }
      },
    });
  } else if (tenureID === 3) {
    ColumnsPakageSelection.push({
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Quaterly-charges-in")}
        </span>
      ),
      dataIndex: "Quaterlycharges",
      key: "Quaterlycharges",
      align: "center",
      ellipses: true,
      width: 100,
      render: (text, record) => {
        if (record.name === "Total") {
          return (
            <span className={styles["ChargesPerLicesense"]}>
              {record.Quaterlycharges.toLocaleString()}
            </span>
          );
        } else {
          const QuaterlyCharge = (record.price * record.headCount || 0) * 3;
          return (
            <span className={styles["ChargesPerLicesense"]}>
              {QuaterlyCharge.toLocaleString()}
            </span>
          );
        }
      },
    });
  }
  const calculateTotals = (data) => {
    try {
      const totalLicenses = data.reduce(
        (acc, cur) => acc + (Number(cur.headCount) || 0),
        0
      );

      const totalYearlyCharges = data.reduce(
        (acc, cur) => acc + (Number(cur.price * cur.headCount) * 12 || 0),
        0
      );

      const totalQuaterlyCharges = data.reduce(
        (acc, cur) => acc + (Number(cur.price * cur.headCount) * 3 || 0),
        0
      );

      const totalMontlyCharges = data.reduce(
        (acc, cur) => acc + (Number(cur.price * cur.headCount) * 3 || 0),
        0
      );
      // Return an object with the totals that can be used as a row in your table.
      return {
        name: "Total",
        headCount: totalLicenses,
        Yearlycharges: totalYearlyCharges,
        Quaterlycharges: totalQuaterlyCharges,
        Monthlycharges: totalMontlyCharges,
      };
    } catch (error) {
      console.log(error, "errorerrorerror");
    }
  };

  const totalRow = calculateTotals(getAllPakagesData);

  const handleChangePackageSelected = () => {
    localStorage.setItem("changePacakgeFlag", true);
    localStorage.setItem("SignupFlowPageRoute", 1);
    dispatch(signUpFlowRoutes(1));
  };

  return (
    <>
      <section className={styles["sectionstyles"]}>
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
                  scroll={{ x: "max-content" }}
                  rowHoverBg="none"
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
                        onClick={handleChangePackageSelected}
                      />
                    </Col>
                  </Row>
                </section>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>
      {UserMangementReducer.Loading || LanguageReducer.Loading ? (
        <Loader />
      ) : null}
    </>
  );
};

export default BillProcessStepThree;
