import React from "react";
import styles from "./PackageUpgradeDetail.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./../../../../i18n";


import { useTranslation } from "react-i18next";
import UpgradePackageDetail from "../../../../components/elements/upgradePackageDetail/UpgradePackageDetail";
import { Button } from "../../../../components/elements";
import { useDispatch } from "react-redux";
import { updateSubscribePackage } from "../../../../store/actions/Admin_PackageUpgrade";
const PackageUpgradeDetail = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();
  const { state } = location;
  //for Translation
  const upgradePackage = (id) => {
    dispatch(updateSubscribePackage(id, navigate, t))
  }
  const { t } = useTranslation();
  return (
    <Container className="py-3">
      <Row>
        <Col sm={12} md={12} lg={12} className="text-center fs-3 fw-500 mb-4">
          {t("Upgrade-Your-Package")}
        </Col>
      </Row>
      <Row>
        <Col sm={12} lg={12} md={12} className="mb-4">
          <Card className={styles["UpgradePackageCard"]}>
            <Row>
              <Col
                sm={12}
                md={4}
                lg={4}
                className="border-right-0 position-relative"
              >

                <h3 className={styles["packageheading"]}>{state.PackageTitle}</h3>
                <h4 className="text-center fw-900 m-0 p-0">
                  ${state.PackageAmount}/<span className="fs-6">{t("month")}</span>
                </h4>
                <p className="mx-auto text-center m-0 p-0">
                  {/* {t("Annually-subscription")} */}
                </p>
                <div className={styles["packageDetails"]}>
                  <p>{t("GET-5-more-users")}</p>
                  <p className="text-center">
                    {state.UsersRangeBoardMembers} {t("Boardmembers")} ,<br />{state.UsersRangeAdmin} {t("Executives")} {t("And")}<br /> {state.OtherUsersRange} {t("Otherusers")}
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
                    <h4>{t("Included-Features")}</h4>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s
                    </p>
                    <ul>
                      <li>{t("Get-More-Users")}</li>
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
                      text={t("ProceedtoPayment")}
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
          <Link className="text-black fs-5" to="/Diskus/Admin/UpgradePackage">
            {t("Back")}
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default PackageUpgradeDetail;
