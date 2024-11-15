import React, { useState, useEffect } from "react";
import styles from "./CancelSubscriptionAdmin.module.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, TableToDo } from "../../../../../components/elements";
import CancelSubscriptionModal from "../../ModalsUserManagement/CancelSubscriptionModal/CancelSubscriptionModal";
import { useSelector } from "react-redux";
import { showCancelSubscriptionModal } from "../../../../../store/actions/UserMangementModalActions";
import { useDispatch } from "react-redux";
import ReasonForCancelSubs from "../../ModalsUserManagement/ResonsForCancelSubscriptionModal/ReasonForCancelSubs";
import { GetOrganizationSelectedPackagesByOrganizationIDApi } from "../../../../../store/actions/UserManagementActions";
import {
  formatDateDownGradeSubscription,
  formatDateToDDMMYYYYDownGradeSubscription,
} from "../../../../../commen/functions/date_formater";
import { useLocation, useNavigate } from "react-router-dom";
import { convertToArabicNumerals } from "../../../../../commen/functions/regex";
const CancelSubscriptionAdmin = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  let lang = localStorage.getItem("i18nextLng");

  const { CancellationDetials } = location.state;

  const UserManagementModalscancelSubscriptionModal = useSelector(
    (state) => state.UserManagementModals.cancelSubscriptionModal
  );

  const UserManagementModalreasonForleavingModal = useSelector(
    (state) => state.UserManagementModals.reasonForleavingModal
  );

  const UserMangementReducerorganizationSelectedPakagesByOrganizationIDData =
    useSelector(
      (state) =>
        state.UserMangementReducer
          .organizationSelectedPakagesByOrganizationIDData
    );

  // state for passing SubscriptionStatusID
  const [completionContract, setCompletionContract] = useState(false);

  const [cancelSubsDetail, setCancelSubsDetail] = useState({
    cancelPackageName: "",
    cancelSubscriptionDate: "",
    cancelExpiryDate: "",
  });

  const [cancelSubscriptionDetails, setCancelSubscriptionDetails] = useState({
    SubscriptionNumber: 0,
    subscriptionStartDate: "",
    ExpiryDate: "",
    tenure: "",
  });

  // useEffect to hit an API
  useEffect(() => {
    dispatch(GetOrganizationSelectedPackagesByOrganizationIDApi(navigate, t));
  }, []);

  //useEffect to render data in expiry and subscription date

  useEffect(() => {
    let cancelPackage =
      UserMangementReducerorganizationSelectedPakagesByOrganizationIDData;
    if (cancelPackage !== null && cancelPackage !== undefined) {
      cancelPackage.organizationSubscriptions?.map((subscription) => {
        setCancelSubsDetail((prevState) => ({
          ...prevState,
          cancelSubscriptionDate: subscription.subscriptionStartDate,
          cancelExpiryDate: subscription.subscriptionExpiryDate,
          cancelPackageName: subscription.organizationSelectedPackages
            .map((pkg) => pkg.name)
            .join(", "),
        }));
      });
    }
  }, [UserMangementReducerorganizationSelectedPakagesByOrganizationIDData]);

  //Extracting the PakageDetials Data

  useEffect(() => {
    if (
      CancellationDetials &&
      CancellationDetials.organizationSelectedPackages
    ) {
      const startdate = CancellationDetials.subscriptionStartDate;
      const orgnizationID = CancellationDetials.fK_OrganizationsID;
      const organizationSubscriptionID =
        CancellationDetials.fK_SubscriptionStatusID;
      setCancelSubscriptionDetails({
        SubscriptionNumber: `${formatDateToDDMMYYYYDownGradeSubscription(
          startdate
        )}-${orgnizationID}-${organizationSubscriptionID}`,
        subscriptionStartDate: CancellationDetials.subscriptionStartDate,
        ExpiryDate: CancellationDetials.subscriptionExpiryDate,
        tenure: CancellationDetials.tenure,
      });
    }
  }, [CancellationDetials]);

  // col for Cancel Subs package details
  const ColumnsPakageSelection = [
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Package-details")}
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

  // col data in package details
  const organizationPackages =
    UserMangementReducerorganizationSelectedPakagesByOrganizationIDData?.organizationSubscriptions;

  let Data = [];

  if (organizationPackages) {
    organizationPackages.map((subscription) => {
      Data = subscription.organizationSelectedPackages.map((packages) => ({
        Pakagedetails: (
          <span className={styles["Tableheading"]}>{packages.name}</span>
        ),
        Chargesperlicense: (
          <span className={styles["ChargesPerLicesense"]}>
            {convertToArabicNumerals(packages.price, lang)}
          </span>
        ),
        Numberoflicenses: (
          <span className={styles["ChargesPerLicesense"]}>
            {convertToArabicNumerals(packages.headCount, lang)}
          </span>
        ),
        Yearlycharges: (
          <span className={styles["ChargesPerLicesense"]}>
            {convertToArabicNumerals(
              packages.price * packages.headCount * 12,
              lang
            )}
          </span>
        ),
      }));
    });
  }

  // COunt number or add number of Number of license and Yearly Charges
  let totalLicenses = 0;
  let totalYearlyCharges = 0;

  UserMangementReducerorganizationSelectedPakagesByOrganizationIDData?.organizationSubscriptions.map(
    (packageses) => {
      packageses.organizationSelectedPackages.map((totals) => {
        let totalofLicences = totals.headCount;
        let totalOfYearlyPrices = totals.price * totals.headCount * 12;
        totalLicenses += totalofLicences;
        totalYearlyCharges += totalOfYearlyPrices;
      });
    }
  );

  // for ServiceManager.CancelOrganizationsSubscription pass as a request data
  const subscriptionID =
    UserMangementReducerorganizationSelectedPakagesByOrganizationIDData?.organizationSubscriptions.map(
      (SubsID) => SubsID.pK_OrganizationsSubscriptionID
    );

  const defaultRow = {
    Pakagedetails: (
      <span className={styles["TableheadingTotal"]}>{t("Total")}</span>
    ),
    Numberoflicenses: (
      <span className={styles["ChargesPerLicesensetotal"]}>
        {convertToArabicNumerals(totalLicenses, lang)}
      </span>
    ),
    Yearlycharges: (
      <span className={styles["ChargesPerLicesensetotal"]}>
        {convertToArabicNumerals(totalYearlyCharges, lang)}
      </span>
    ),
  };

  const handleCancelSubsModal = () => {
    dispatch(showCancelSubscriptionModal(true));
    setCompletionContract(false);
  };

  const handleCompletionofContract = () => {
    dispatch(showCancelSubscriptionModal(true));
    setCompletionContract(true);
  };

  //Scroll for table
  const scroll = {
    y: "39vh",
    scrollbar: {
      verticalWidth: 20, // Width of the vertical scrollbar
      handleSize: 10, // Distance between data and scrollbar
    },
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
          <span className={styles["CancelSubscriptionHeading"]}>
            {t("Cancel-subscription")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={4} md={4} sm={12} xs={12}>
          <Card className={styles["CardCancelSubscriptionLeft"]}>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12} className="text-center">
                <p className={styles["subcriptionkey_1"]}>
                  {t("Subscription-number")}
                </p>
                <p className={styles["subcriptionvalue_1"]}>
                  {cancelSubscriptionDetails.SubscriptionNumber}
                </p>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col lg={12} md={12} sm={12} className="text-center">
                <p className={styles["subcriptionkey_1"]}>
                  {t("Subscription-date")}
                </p>
                <p className={styles["subcriptionvalue_1"]}>
                  {formatDateDownGradeSubscription(
                    cancelSubscriptionDetails.subscriptionStartDate,
                    lang
                  )}
                </p>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col lg={12} md={12} sm={12} className="text-center">
                <p className={styles["subcriptionkey_1"]}>{t("Expiry-date")}</p>
                <p className={styles["subcriptionvalue_1"]}>
                  {formatDateDownGradeSubscription(
                    cancelSubscriptionDetails.ExpiryDate,
                    lang
                  )}
                </p>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col lg={12} md={12} sm={12} className="text-center">
                <p className={styles["subcriptionkey_1"]}>{t("Duration")}</p>
                <p className={styles["subcriptionvalue_1"]}>
                  {cancelSubscriptionDetails.tenure}
                </p>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={8} md={8} sm={12} xs={12}>
          <Card className={styles["CardCancelSubscription"]}>
            <Row className="mt-3">
              <Col sm={12}></Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["subheadingCancelsubscription"]}>
                  {t("These-are-your-current-subscription-details")}
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12} xs={12}>
                <div className="Billing_TableContainer">
                  <TableToDo
                    column={ColumnsPakageSelection}
                    className={"package-TablePakageSelection"}
                    rows={[...Data, defaultRow]}
                    pagination={false}
                    scroll={scroll}
                    id="UpgradePakageDetails"
                    rowHoverBg="none"
                  />
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg={6} md={6} sm={12} xs={12}>
                <Button
                  text={t("Cancel-now")}
                  className={styles["CancelNowClassstyles"]}
                  onClick={handleCancelSubsModal}
                />
              </Col>
              <Col lg={6} md={6} sm={12} xs={12}>
                <Button
                  text={t("Completion-of-contract")}
                  className={styles["ConfirmSubsStyles"]}
                  onClick={handleCompletionofContract}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {UserManagementModalscancelSubscriptionModal && (
        <CancelSubscriptionModal />
      )}
      {UserManagementModalreasonForleavingModal && (
        <ReasonForCancelSubs
          completionContract={completionContract}
          subscriptionID={subscriptionID}
        />
      )}
    </Container>
  );
};

export default CancelSubscriptionAdmin;
