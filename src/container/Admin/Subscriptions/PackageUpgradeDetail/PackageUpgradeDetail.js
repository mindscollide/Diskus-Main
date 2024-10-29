import React, { useEffect, useState } from "react";
import styles from "./PackageUpgradeDetail.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import { Button, Loader, Notification } from "../../../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import { cleareMessage } from "../../../../store/actions/Admin_PackageUpgrade";
import { getSubscriptionUpgradeAmountInfoApi } from "../../../../store/actions/Admin_PackageDetail";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

const PackageUpgradeDetail = () => {
  const Data = useSelector((state) => state);
  const { GetSubscriptionPackage, Authreducer, LanguageReducer } = Data;
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  let tenureId = JSON.parse(localStorage.getItem("TenureOfSuscriptionID"));
  let packageColorPath1 = "";
  let packageColorPath2 = "";
  console.log(
    packageColorPath1,
    packageColorPath2,
    "packageColorPath2packageColorPath2packageColorPath2"
  );
  const { state } = location;
  console.log(state, "statestatestate");
  //for Translation
  const upgradePackage = (id) => {
    dispatch(getSubscriptionUpgradeAmountInfoApi(navigate, id, tenureId, t));
  };
  const { t } = useTranslation();

  useEffect(() => {
    if (state !== null && state !== undefined) {
      packageColorPath1 = state.PackageBadgeColor.split("_SEPERATOR_")[0];
      packageColorPath2 = state.PackageBadgeColor.split("_SEPERATOR_")[1];
    }
  }, [state]);

  useEffect(() => {
    if (
      GetSubscriptionPackage.upgradeSubscriptionPackageResponseMessage !== "" &&
      GetSubscriptionPackage.upgradeSubscriptionPackageResponseMessage !==
        t("Organization-subscription-update")
    ) {
      showMessage(
        GetSubscriptionPackage.upgradeSubscriptionPackageResponseMessage,
        "success",
        setOpen
      );
      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [GetSubscriptionPackage.upgradeSubscriptionPackageResponseMessage]);

  return (
    <>
      <Container className="py-4">
        <Row>
          <Col
            sm={12}
            md={12}
            lg={12}
            className={styles["upgradePackageDetailTitle"]}
          >
            {t("Upgrade-your-package")}
          </Col>
        </Row>
        <Row>
          <Col sm={12} lg={12} md={12} className="mb-4">
            <Card className={styles["UpgradePackageCard"]}>
              <Row>
                <Col sm={12} md={12} lg={12}>
                  {state !== null && state !== undefined ? (
                    <>
                      <span class="icon-star package-icon-style">
                        <span
                          class="path1"
                          style={{
                            color:
                              state.PackageBadgeColor.split("_SEPERATOR_")[0],
                          }}
                        ></span>
                        <span
                          class="path2"
                          style={{
                            color:
                              state.PackageBadgeColor.split("_SEPERATOR_")[1],
                          }}
                        ></span>
                        <span
                          class="path3"
                          style={{
                            color:
                              state.PackageBadgeColor.split("_SEPERATOR_")[1],
                          }}
                        ></span>
                      </span>
                    </>
                  ) : null}
                </Col>
              </Row>
              <Row className={styles["cardHeight"]}>
                <Col
                  sm={12}
                  md={4}
                  lg={4}
                  className="border-right-0 position-relative"
                >
                  <h3 className={styles["packageheading"]}>
                    {state.PackageTitle}
                  </h3>
                  <h4 className={styles["packageheading_amount"]}>
                    $
                    {tenureId !== null &&
                    tenureId !== undefined &&
                    tenureId === 1
                      ? state.FirstYearDiscountedPrice
                      : state.PackageAmount}
                    /<span className="fs-6">{t("Month")}</span>
                  </h4>
                  {tenureId !== null &&
                  tenureId !== undefined &&
                  tenureId === 1 ? (
                    <p className={styles["packageheading_desciprtion"]}>
                      {t("Annually-subscription")}
                    </p>
                  ) : null}

                  <div className={styles["packageDetails"]}>
                    <p>{t("Get-more-users")}</p>
                    <p className="text-center">
                      {state.UsersRangeBoardMembers} {t("Board-members")}
                      <br />
                      {state.UsersRangeAdmin} {t("Executives")} {t("And")}
                      <br /> {state.OtherUsersRange} {t("Other-users")}
                    </p>
                  </div>
                  <span className={styles["lineBar"]}></span>
                </Col>
                <Col sm={12} md={8} lg={8}>
                  <Row>
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className={styles["upgradePackageAmoutnandList"]}
                    >
                      <h4>{t("Included-features")}</h4>
                      <p>{t("Get-more-features-by-upgrading-your-plan")}</p>
                      <ul>
                        <li>{t("Get-more-users")}</li>
                        <li>{t("Theme-customization")}</li>
                        <li>{t("Marketing-tools")}</li>
                        <li>{t("Analytics")}</li>
                      </ul>
                    </Col>
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        text={t("Proceed-to-payment")}
                        className={styles["UpgradeBtnCard"]}
                        onClick={() => upgradePackage(state.PackageID)}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col
            sm={12}
            md={12}
            lg={12}
            className="d-flex justify-content-center text-decoration-underline"
          >
            <Link className={styles["goBackLink"]} to="/Admin/UpgradePackage">
              {t("Go-back")}
            </Link>
          </Col>
        </Row>
      </Container>
      {GetSubscriptionPackage.Loading ||
      Authreducer.Loading ||
      LanguageReducer.Loading ? (
        <Loader />
      ) : null}
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default PackageUpgradeDetail;
