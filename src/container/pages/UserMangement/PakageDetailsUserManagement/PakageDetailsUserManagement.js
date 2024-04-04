import React, { useEffect, useState } from "react";
import styles from "./PakageDetailsUserManagement.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../../../../components/elements/loader/Loader";
import Card from "react-bootstrap/Card";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, TableToDo, TextField } from "../../../../components/elements";
const PakageDetailsUserManagement = ({ setSignupStep }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { GetSubscriptionPackage, Authreducer, LanguageReducer } = useSelector(
    (state) => state
  );

  let flagForSelectedPackeg = localStorage.getItem("flagForSelectedPackeg");
  const [currentPackageId, setCurrentPackageId] = useState(0);
  const [annualPackageShow, setAnnualPackageShow] = useState(false);
  const [monthlyPackageShow, setMonthlyPackageShow] = useState(true);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  //   const [packageDetail, setPackageDetail] = useState([
  //     {
  //       PackageName: "",
  //       PackageID: 0,
  //       MontlyPackageAmount: 0,
  //       AnnuallyPackageAmount: 0,
  //       BoardMembers: 0,
  //       AdminMembers: 0,
  //       PackageDescription: "",
  //       PackageBadgeColor: "",
  //       PackageAnuallyDiscountAmount: 0,
  //       PackageVisibility: false,
  //       yearlyDiscountedPrice: 0,
  //       FirstYearDiscountedPrice: 0,
  //     },
  //   ]);

  const [packageDetail, setPackageDetail] = useState([
    {
      name: "Essential",
      price: "10",
    },
    {
      name: "Professional",
      price: "22",
    },
    {
      name: "Premium",
      price: "35",
    },
  ]);
  const handleManualPackage = (packageId) => {
    setCurrentPackageId(packageId);
    setAnnualPackageShow(false);
    setMonthlyPackageShow(true);
  };

  // translate Languages start
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

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
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Charges-per")}
          <span className="pakageselectionSpanUsermanagement">
            {t("License-US$")}
          </span>
        </span>
      ),
      dataIndex: "Chargesperlicense",
      key: "Chargesperlicense",
      width: 100,
      align: "center",
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Number")}
          <span className="pakageselectionSpanUsermanagement">
            {t("of-licenses")}
          </span>
        </span>
      ),
      width: 100,
      dataIndex: "Numberoflicenses",
      key: "Numberoflicenses",
      align: "center",
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Monthly")}
          <span className="pakageselectionSpanUsermanagement">
            {t("charges-in")}
          </span>
        </span>
      ),
      dataIndex: "Monthlycharges",
      key: "Monthlycharges",
      width: 100,
      align: "center",
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Quarterly")}
          <span className="pakageselectionSpanUsermanagement">
            {t("charges-in")}
          </span>
        </span>
      ),
      dataIndex: "Quarterlycharges",
      key: "Quarterlycharges",
      align: "center",
      width: 100,
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Yearly")}
          <span className="pakageselectionSpanUsermanagement">
            {t("charges-in")}
          </span>
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
          <Row>
            <Col className="d-flex justify-content-center">
              <TextField labelClass={"d-none"} applyClass={"PakageDetails"} />
            </Col>
          </Row>
        </>
      ),
      Monthlycharges: (
        <>
          <span className={styles["ChargesPerLicesense"]}>4,432</span>
        </>
      ),
      Quarterlycharges: (
        <>
          <span className={styles["ChargesPerLicesense"]}>906</span>
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
          <Row>
            <Col className="d-flex justify-content-center">
              <TextField labelClass={"d-none"} applyClass={"PakageDetails"} />
            </Col>
          </Row>
        </>
      ),
      Monthlycharges: (
        <>
          <span className={styles["ChargesPerLicesense"]}>2,222</span>
        </>
      ),
      Quarterlycharges: (
        <>
          <span className={styles["ChargesPerLicesense"]}>567</span>
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
        <>
          <Row>
            <Col className="d-flex justify-content-center">
              <TextField labelClass={"d-none"} applyClass={"PakageDetails"} />
            </Col>
          </Row>
        </>
      ),
      Monthlycharges: (
        <>
          <span className={styles["ChargesPerLicesense"]}>967</span>
        </>
      ),
      Quarterlycharges: (
        <>
          <span className={styles["ChargesPerLicesense"]}>906</span>
        </>
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
    Monthlycharges: (
      <span className={styles["ChargesPerLicesense"]}>5,786</span>
    ),
    Quarterlycharges: (
      <span className={styles["ChargesPerLicesense"]}>2,718</span>
    ),
    Yearlycharges: <span className={styles["ChargesPerLicesense"]}>3,072</span>,
  };

  const handlePayNowClick = () => {
    localStorage.setItem("signupCurrentPage", 2);
    navigate("/Signup");
  };

  const defaultRowWithButtons = {
    Monthlycharges: (
      <>
        <span className={styles["ButtonsArabicStylesSpan"]}>
          <Button
            text={t("Pay-now")}
            className={styles["PayNowButtons"]}
            onClick={handlePayNowClick}
          />
        </span>
      </>
    ),
    Quarterlycharges: (
      <>
        <span className={styles["ButtonsArabicStylesSpan"]}>
          <Button
            text={t("Pay-now")}
            className={styles["PayNowButtons"]}
            onClick={handlePayNowClick}
          />
        </span>
      </>
    ),
    Yearlycharges: (
      <>
        <span className={styles["ButtonsArabicStylesSpan"]}>
          <Button
            text={t("Pay-now")}
            className={styles["PayNowButtons"]}
            onClick={handlePayNowClick}
          />
        </span>
      </>
    ),
  };

  return (
    <Container>
      <Row className="position-relative">
        <Col className={styles["languageSelector"]}>
          <LanguageSelector />
        </Col>
      </Row>
      <Row>
        <Col sm={12} className="mt-4">
          <h2
            className={`${"MontserratSemiBold"} ${
              styles["packageselection_heading"]
            }`}
          >
            {t("Diskus-pakage-details")}
          </h2>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={12} lg={12} className="d-flex justify-content-center">
          <span className={styles["PerUserheading"]}>
            {t("Per-user-per-month-billed-annually")}
          </span>
        </Col>
      </Row>
      <Row className="mt-3 ">
        {packageDetail.length > 0 ? (
          packageDetail.map((data, index) => {
            // let packageColorPath1 =
            //   data.PackageBadgeColor.split("_SEPERATOR_")[0];
            // let packageColorPath2 =
            //   data.PackageBadgeColor.split("_SEPERATOR_")[1];
            return (
              <Col
                sm={12}
                lg={4}
                md={4}
                className={index === 1 && index === 3 ? "p-0" : "my-2"}
                // key={data.pK_SubscriptionPackageID}
              >
                <Row className="g-4">
                  <Col sm={12} className={styles["packageCardBox"]}>
                    <Card className={styles["packagecard"]}>
                      <Row className="mt-3">
                        <Col sm={12}>
                          <>
                            <span className="icon-star package-icon-style">
                              <span
                                className="path1"
                                // style={{ color: packageColorPath1 }}
                              ></span>
                              <span
                                className="path2"
                                // style={{ color: packageColorPath2 }}
                              ></span>
                              <span
                                className="path3"
                                // style={{ color: packageColorPath2 }}
                              ></span>
                            </span>
                            <span className={styles["package_title"]}>
                              {/* {t("Gold")} */}
                              {/* {data.PackageName} */}
                              {data.name}
                            </span>{" "}
                          </>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col sm={false} md={2} lg={2}></Col>
                        <Col sm={12} md={8} lg={8}>
                          <div className={styles["packagecard_pricebox"]}>
                            <span className={styles["package_actualPrice"]}>
                              ${data.price}/
                              <p className={styles["package_actualPrice_p"]}>
                                {t("Month")}
                              </p>
                            </span>
                          </div>
                        </Col>
                        <Col sm={false} md={2} lg={2}></Col>
                      </Row>
                      <Row className="mt-5">
                        <Col lg={1} md={1} sm={1}></Col>
                        <Col
                          lg={11}
                          md={11}
                          sm={11}
                          className="d-flex flex-column flex-wrap gap-2"
                        >
                          <span className={styles["MeetingHeading"]}>
                            {t("Meeting")}
                          </span>
                          <span className={styles["keypoints"]}>
                            Meeting Organizer (Quick Meeting)
                          </span>
                          <span className={styles["keypoints"]}>
                            View Document & Files
                          </span>
                          <span className={styles["keypoints"]}>
                            Secured Instant Messaging
                          </span>
                          <span className={styles["keypoints"]}>
                            Video Conferencing & Recording
                          </span>
                          <span className={styles["keypoints"]}>
                            Screen Sharing
                          </span>
                          <span className={styles["keypoints"]}>Notes</span>
                          <span className={styles["keypoints"]}>
                            Calendar with two way Syncs
                          </span>
                          <span className={styles["keypoints"]}>
                            Organization Admin
                          </span>
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
      <Row className="mt-4">
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-center">
          <span className={styles["BillingHeading"]}>
            {t("Billing-calculator")}
          </span>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <TableToDo
            column={ColumnsPakageSelection}
            className={"Billing_TablePakageSelection"}
            rows={[...Data, defaultRow, defaultRowWithButtons]}
            pagination={false}
            id="saif"
            rowHoverBg="none"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default PakageDetailsUserManagement;
