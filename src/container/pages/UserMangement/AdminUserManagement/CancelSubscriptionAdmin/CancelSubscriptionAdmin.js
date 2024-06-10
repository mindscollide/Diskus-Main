import React, { useState, useEffect } from "react";
import styles from "./CancelSubscriptionAdmin.module.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, Loader, TableToDo } from "../../../../../components/elements";
import CancelSubscriptionModal from "../../ModalsUserManagement/CancelSubscriptionModal/CancelSubscriptionModal";
import { useSelector } from "react-redux";
import { showCancelSubscriptionModal } from "../../../../../store/actions/UserMangementModalActions";
import { useDispatch } from "react-redux";
import ReasonForCancelSubs from "../../ModalsUserManagement/ResonsForCancelSubscriptionModal/ReasonForCancelSubs";
import { GetOrganizationSelectedPackagesByOrganizationIDApi } from "../../../../../store/actions/UserManagementActions";
import { _justShowDateformat } from "../../../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
const CancelSubscriptionAdmin = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const organizationID = localStorage.getItem("organizationID");

  const { UserManagementModals, UserMangementReducer } = useSelector(
    (state) => state
  );

  // state for passing SubscriptionStatusID
  const [completionContract, setCompletionContract] = useState(false);

  const [cancelSubsDetail, setCancelSubsDetail] = useState({
    cancelPackageName: "",
    cancelSubscriptionDate: "",
    cancelExpiryDate: "",
  });

  // useEffect to hit an API
  useEffect(() => {
    let data = {
      // OrganizationID: 634,
      // OrganizationID: Number(organizationID),
    };
    dispatch(
      GetOrganizationSelectedPackagesByOrganizationIDApi(navigate, t, data)
    );
  }, []);

  //useEffect to render data in expiry and subscription date

  useEffect(() => {
    let cancelPackage =
      UserMangementReducer.organizationSelectedPakagesByOrganizationIDData;
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
  }, [UserMangementReducer.organizationSelectedPakagesByOrganizationIDData]);

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
    UserMangementReducer.organizationSelectedPakagesByOrganizationIDData
      ?.organizationSubscriptions;

  let Data = [];

  if (organizationPackages) {
    organizationPackages.map((subscription) => {
      Data = subscription.organizationSelectedPackages.map((packages) => ({
        Pakagedetails: (
          <span className={styles["Tableheading"]}>{packages.name}</span>
        ),
        Chargesperlicense: (
          <span className={styles["ChargesPerLicesense"]}>
            {packages.price}
          </span>
        ),
        Numberoflicenses: (
          <span className={styles["ChargesPerLicesense"]}>
            {packages.headCount}
          </span>
        ),
        Yearlycharges: (
          <span className={styles["ChargesPerLicesense"]}>
            {packages.price * packages.headCount * 12}
          </span>
        ),
      }));
    });
  }

  // COunt number or add number of Number of license and Yearly Charges
  let totalLicenses = 0;
  let totalYearlyCharges = 0;

  UserMangementReducer.organizationSelectedPakagesByOrganizationIDData?.organizationSubscriptions.map(
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
    UserMangementReducer.organizationSelectedPakagesByOrganizationIDData?.organizationSubscriptions.map(
      (SubsID) => SubsID.pK_OrganizationsSubscriptionID
    );

  console.log(subscriptionID, "subscriptionIDsubscriptionID");

  const defaultRow = {
    Pakagedetails: (
      <span className={styles["TableheadingTotal"]}>{t("Total")}</span>
    ),
    Numberoflicenses: (
      <span className={styles["ChargesPerLicesensetotal"]}>
        {totalLicenses}
      </span>
    ),
    Yearlycharges: (
      <span className={styles["ChargesPerLicesensetotal"]}>
        {totalYearlyCharges}
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
          <Card className={styles["CardCancelSubscription"]}>
            <Row className="mt-5">
              <Col lg={12} md={12} sm={12}>
                <table className={styles["single-cell-table"]}>
                  <tr>
                    <th>{t("Subscription-number")}</th>
                  </tr>
                  <tr>
                    <td>2024-08-24-991-150</td>
                  </tr>
                </table>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={12} md={12} sm={12}>
                <table className={styles["single-cell-table"]}>
                  <tr>
                    <th>{t("Subscription-date")}</th>
                  </tr>
                  <tr>
                    <td>22 December 2023</td>
                  </tr>
                </table>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={12} md={12} sm={12}>
                <table className={styles["single-cell-table"]}>
                  <tr>
                    <th>{t("Expiry-date")}</th>
                  </tr>
                  <tr>
                    <td>21 December 2024</td>
                  </tr>
                </table>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={12} md={12} sm={12} className="text-center pe-0">
                <p className={styles["subcriptionkey_1"]}>
                  {t("Subscription-date")}
                </p>
                <p className={styles["subcriptionvalue_1"]}>
                  {_justShowDateformat(
                    cancelSubsDetail.cancelSubscriptionDate + "000000"
                  )}
                </p>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={8} md={8} sm={12} xs={12}>
          <Card className={styles["CardCancelSubscription"]}>
            <Row className="mt-3">
              <Col sm={12}>
                {/* <span class="icon-star package-icon-style">
                  <span
                    class="path1"
                    style={{ color: packageColorPath1 }}
                  ></span>
                  <span
                    class="path2"
                    style={{ color: packageColorPath2 }}
                  ></span>
                  <span
                    class="path3"
                    style={{ color: packageColorPath2 }}
                  ></span>
                </span>
                <h3 className={styles["packageCard_title"]}>
                  {isPackageDetail.PackageTitle}
                </h3>{" "} */}
              </Col>
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
                    scroll={{ x: "max-content" }}
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

      {UserManagementModals.cancelSubscriptionModal && (
        <CancelSubscriptionModal />
      )}
      {UserManagementModals.reasonForleavingModal && (
        <ReasonForCancelSubs
          completionContract={completionContract}
          subscriptionID={subscriptionID}
        />
      )}
      {UserMangementReducer.Loading ? <Loader /> : null}
    </Container>
  );
};

export default CancelSubscriptionAdmin;
