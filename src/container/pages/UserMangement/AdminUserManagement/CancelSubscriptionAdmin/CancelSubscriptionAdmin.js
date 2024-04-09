import React, { useEffect } from "react";
import styles from "./CancelSubscriptionAdmin.module.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, TableToDo } from "../../../../../components/elements";
import CancelSubscriptionModal from "../../ModalsUserManagement/CancelSubscriptionModal/CancelSubscriptionModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showCancelSubscriptionModal } from "../../../../../store/actions/UserMangementModalActions";
import { useDispatch } from "react-redux";
import ReasonForCancelSubs from "../../ModalsUserManagement/ResonsForCancelSubscriptionModal/ReasonForCancelSubs";
import { GetOrganizationSelectedPackagesByOrganizationIDApi } from "../../../../../store/actions/UserManagementActions";
const CancelSubscriptionAdmin = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { UserManagementModals } = useSelector((state) => state);

  useEffect(() => {
    let data = {
      OrganizationID: 471,
    };
    dispatch(
      GetOrganizationSelectedPackagesByOrganizationIDApi(navigate, t, data)
    );
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
    Numberoflicenses: (
      <span className={styles["ChargesPerLicesensetotal"]}>43</span>
    ),
    Yearlycharges: (
      <span className={styles["ChargesPerLicesensetotal"]}>13,072</span>
    ),
  };

  const handleCancelSubsModal = () => {
    dispatch(showCancelSubscriptionModal(true));
  };

  const handleCompletionofContract = () => {
    dispatch(showCancelSubscriptionModal(true));
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
        <Col lg={1} md={1} sm={12} xs={12}></Col>
        <Col lg={10} md={10} sm={12} xs={12}>
          <Card className={styles["CardCancelSubscription"]}>
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
            <Row>
              <Col xs={12} sm={12} md={6} lg={6} className="text-center pe-0">
                <p className={styles["subcriptionkey_1"]}>
                  {t("Subscription-date")}
                </p>
                <p className={styles["subcriptionvalue_1"]}>22 December 2023</p>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} className="text-center ps-0">
                <p className={styles["subcriptionkey_2"]}>{t("Expiry-date")}</p>
                <p className={styles["subcriptionvalue_2"]}>21 December 2024</p>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={1} md={1} sm={12} xs={12}></Col>
      </Row>
      <Row className="mt-3">
        <Col lg={1} md={1} sm={12} xs={12}></Col>
        <Col lg={5} md={5} sm={12} xs={12}>
          <Button
            text={t("Cancel-now")}
            className={styles["CancelNowClassstyles"]}
            onClick={handleCancelSubsModal}
          />
        </Col>
        <Col lg={5} md={5} sm={12} xs={12}>
          <Button
            text={t("Completion-of-contract")}
            className={styles["ConfirmSubsStyles"]}
            onClick={handleCompletionofContract}
          />
        </Col>
        <Col lg={1} md={1} sm={12} xs={12}></Col>
      </Row>
      {UserManagementModals.cancelSubscriptionModal && (
        <CancelSubscriptionModal />
      )}
      {UserManagementModals.reasonForleavingModal && <ReasonForCancelSubs />}
    </Container>
  );
};

export default CancelSubscriptionAdmin;
