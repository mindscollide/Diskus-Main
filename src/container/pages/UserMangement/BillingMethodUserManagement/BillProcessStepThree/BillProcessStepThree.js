import React, { useEffect, useState } from "react";
import styles from "./BillProcessStepThree.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, TableToDo } from "../../../../../components/elements";
import ellipses from "../../../../../assets/images/ellipses.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrganizationSelectedPakagesAPI,
  signUpFlowRoutes,
} from "../../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
import { convertUTCDateToLocalDate } from "../../../../../commen/functions/date_formater";
import { calculateTotalsBillingStepper } from "../../../../../commen/functions/TableDataCalculation";
import { convertToArabicNumerals } from "../../../../../commen/functions/regex";
const BillProcessStepThree = ({setStoredStep}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let currentLanguage = localStorage.getItem("i18nextLng");
  const SignupPage = localStorage.getItem("SignupFlowPageRoute");

  const { UserMangementReducer } = useSelector((state) => state);

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
      
    }
  }, [UserMangementReducer.getAllSelectedPakagesData]);

  const ColumnsPakageSelection = [
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Package-details")}
        </span>
      ),
      width: 120,
      dataIndex: "name",
      key: "name",
      ellipses: true,
      align: "center",
      render: (text, record) => {
        const { name } = calculateTotalsBillingStepper(getAllPakagesData);
        
        if (record?.isTotalRow) {
          return (
            <span className={styles["ChargesPerLicesense"]}>{t(name)}</span>
          );
        } else {
          return (
            <>
              <span className={styles["Tableheading"]}>{t(record?.name)}</span>
            </>
          );
        }
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
      width: 130,
      ellipses: true,
      align: "center",
      render: (text, record) => {
        return (
          <>
            <span className={styles["ChargesPerLicesense"]}>
              {convertToArabicNumerals(record?.price, currentLanguage)}
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
      width: 120,
      dataIndex: "headCount",
      key: "headCount",
      ellipses: true,
      align: "center",
      render: (text, record) => {
        return (
          <>
            <span className={styles["ChargesPerLicesense"]}>
              {convertToArabicNumerals(record?.headCount, currentLanguage)}
            </span>
          </>
        );
      },
    },
  ];

  //Columns Rendering on the tenureID
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
      width: 130,
      render: (text, record) => {
        const { Yearlycharges } =
          calculateTotalsBillingStepper(getAllPakagesData);
        if (record?.isTotalRow) {
          // For the total row, directly use the calculated value
          return (
            <span className={styles["ChargesPerLicesense"]}>
              {convertToArabicNumerals(Yearlycharges, currentLanguage)}
            </span>
          );
        } else {
          // For regular rows, calculate the yearly charges
          const yearlyCharge = (record?.price * record?.headCount || 0) * 12;
          return (
            <span className={styles["ChargesPerLicesense"]}>
              {convertToArabicNumerals(yearlyCharge, currentLanguage)}
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
        const { Monthlycharges } =
          calculateTotalsBillingStepper(getAllPakagesData);
        if (record?.isTotalRow) {
          return (
            <span className={styles["ChargesPerLicesense"]}>
              {convertToArabicNumerals(Monthlycharges, currentLanguage)}
            </span>
          );
        } else {
          // For regular rows, calculate the yearly charges
          const MonthlyCharge = record?.price * record?.headCount || 0;
          return (
            <span className={styles["ChargesPerLicesense"]}>
              {convertToArabicNumerals(MonthlyCharge, currentLanguage)}
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
        const { Quaterlycharges } =
          calculateTotalsBillingStepper(getAllPakagesData);
        if (record?.isTotalRow) {
          return (
            <span className={styles["ChargesPerLicesense"]}>
              {convertToArabicNumerals(Quaterlycharges, currentLanguage)}
            </span>
          );
        } else {
          const QuaterlyCharge = (record?.price * record?.headCount || 0) * 3;
          return (
            <span className={styles["ChargesPerLicesense"]}>
              {convertToArabicNumerals(QuaterlyCharge, currentLanguage)}
            </span>
          );
        }
      },
    });
  }

  const showTotalValues = {
    isTotalRow: true,
  };

  const handleChangePackageSelected = () => {
    localStorage.setItem("changePacakgeFlag", true);
    localStorage.setItem("SignupFlowPageRoute", 1);
    setStoredStep(1)
    dispatch(signUpFlowRoutes(1));
  };

  //Scroll for table
  const scroll = {
    y: "49vh",
    scrollbar: {
      verticalWidth: 20, // Width of the vertical scrollbar
      handleSize: 10, // Distance between data and scrollbar
    },
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
                  className={"package-TablePakageSelection"}
                  rows={[...getAllPakagesData, showTotalValues]}
                  pagination={false}
                  id="PakageDetails"
                  scroll={scroll}
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
    </>
  );
};

export default BillProcessStepThree;
