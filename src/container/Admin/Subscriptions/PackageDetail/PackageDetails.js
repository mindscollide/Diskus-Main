import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button, Loader } from "../../../../components/elements";
import PackageCard from "../../../../components/elements/packageselection/PackageCards";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import styles from "./PackageDetail.module.css";
import SilverPackage from "./../../../../assets/images/Silver-Package.png";
import GoldPackage from "./../../../../assets/images/Gold-Package.png";
import PremiumPackage from "./../../../../assets/images/Premium-Package.png";
import { useDispatch, useSelector } from "react-redux";
import { getSubscribeOrganizationPackage } from "../../../../store/actions/Admin_PackageDetail";
import {
  dateforCalendar,
  TimeDisplayFormat,
} from "../../../../commen/functions/date_formater";
import moment from "moment";
const PackageDetails = () => {
  const dispatch = useDispatch();
  const { GetSubscriptionPackage } = useSelector((state) => state);
  const [maxAdminUser, setMaxAdminUser] = useState(0);
  const [maxBoardMembers, setBoardMembers] = useState(0);
  const [maxOtherUsers, setOtherUsers] = useState(0);
  // console.log(GetSubscriptionPackage, "GetSubscriptionPackage");
  const [isPackageDetail, setPackageDetail] = useState({
    PackageTitle: "",
    PackageExpiryDate: "",
    PackageSubscriptionDate: "",
    PackageAmount: "",
    PackageDescription: "",
    UsersRangeAdmin: 0,
    UsersRangeBoardMembers: 0,
    OtherUsersRange: 0,
  });

  //for translation
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigatetoUpgrade = () => {
    navigate("/Diskus/Admin/UpgradePackage");
  };
  useEffect(() => {
    dispatch(getSubscribeOrganizationPackage(t));
  }, []);
  useEffect(() => {
    let packageDetails =
      GetSubscriptionPackage.getCurrentActiveSubscriptionPackage;
    if (packageDetails !== null && packageDetails !== undefined) {
      setPackageDetail({
        PackageTitle: packageDetails.organizationSelectedPackage.packageName,
        PackageExpiryDate:
          packageDetails.organizationSubscription.subscriptionExpiryDate,
        PackageAmount:
          packageDetails.organizationSelectedPackage.packageActualPrice,
        PackageSubscriptionDate:
          packageDetails.organizationSubscription.subscriptionStartDate,
        PackageDescription:
          packageDetails.organizationSelectedPackage.packageDescriptiveDetails,
        UsersRangeAdmin:
          packageDetails.organizationSelectedPackage.packageOccupiedAdminUsers,
        UsersRangeBoardMembers:
          packageDetails.organizationSelectedPackage
            .packageOccupiedBoardMemberUsers,
        OtherUsersRange:
          packageDetails.organizationSelectedPackage.packageOccupiedOtherUsers,
      });
      setMaxAdminUser(
        packageDetails.organizationSelectedPackage.packageAllowedAdminUsers
      );
      setBoardMembers(
        packageDetails.organizationSelectedPackage
          .packageAllowedBoardMemberUsers
      );
      setOtherUsers(
        packageDetails.organizationSelectedPackage.packageAllowedOtherUsers
      );
    }
  }, [GetSubscriptionPackage.getCurrentActiveSubscriptionPackage]);
  let newDate = moment(isPackageDetail.PackageSubscriptionDate).format("LL");
  console.log(newDate, "newDatenewDatenewDatenewDate");
  return (
    <>
      <Container>
        <Row>
          <Col sm={12} lg={12} md={12} className={styles["Package_title"]}>
            <h2>{t("Package-details")}</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} lg={4} className="mb-3">
            <Card className={styles["packagecard"]}>
              <Row>
                <Col sm={12}>
                  {GetSubscriptionPackage.getCurrentActiveSubscriptionPackage !==
                    null &&
                  GetSubscriptionPackage.getCurrentActiveSubscriptionPackage !==
                    undefined &&
                  GetSubscriptionPackage.getCurrentActiveSubscriptionPackage
                    .organizationSelectedPackage.packageName === "gold" ? (
                    <>
                      <img
                        className={styles["package-icon"]}
                        src={GoldPackage}
                        alt=""
                      />
                      <h3 className={styles["packageCard_title"]}>
                        {isPackageDetail.PackageTitle}
                      </h3>{" "}
                    </>
                  ) : GetSubscriptionPackage.getCurrentActiveSubscriptionPackage !==
                      null &&
                    GetSubscriptionPackage.getCurrentActiveSubscriptionPackage !==
                      undefined &&
                    GetSubscriptionPackage.getCurrentActiveSubscriptionPackage
                      .organizationSelectedPackage.packageName === "basic" &&
                    GetSubscriptionPackage.getCurrentActiveSubscriptionPackage !==
                      null ? (
                    <>
                      {" "}
                      <img
                        className={styles["package-icon"]}
                        src={SilverPackage}
                        alt=""
                      />
                      <h3 className={styles["packageCard_title"]}>
                        {isPackageDetail.PackageTitle}
                      </h3>{" "}
                    </>
                  ) : GetSubscriptionPackage.getCurrentActiveSubscriptionPackage !==
                      null &&
                    GetSubscriptionPackage.getCurrentActiveSubscriptionPackage !==
                      undefined &&
                    GetSubscriptionPackage.getCurrentActiveSubscriptionPackage
                      .organizationSelectedPackage.packageName === "premium" &&
                    GetSubscriptionPackage.getCurrentActiveSubscriptionPackage !==
                      null ? (
                    <>
                      <img
                        className={styles["package-icon"]}
                        src={PremiumPackage}
                        alt=""
                      />
                      <h3 className={styles["packageCard_title"]}>
                        {isPackageDetail.PackageTitle}
                      </h3>{" "}
                    </>
                  ) : null}
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <div
                    className={`${styles["packagecard_priceBox_container"]}`}
                  >
                    <div className={styles["selectedPackage_priceDetails"]}>
                      <div className={styles["packagecard_disoucntprice"]}>
                        <h4 className="d-flex justify-content-center  align-items-center mt-2 text-capitalize">
                          ${isPackageDetail.PackageAmount}/
                          <p className="fs-6">{t("Month")}</p>
                        </h4>
                        <p
                          className={
                            styles["selectedpackagecard_disoucntprice_para"]
                          }
                        >
                          {t("Subscriptions")}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col sm={12}>
                  <Row>
                    <Col sm={12} md={6} lg={6} className="text-center m-0 p-0 ">
                      <p className={styles["subcriptionkey_1"]}>
                        {t("Subscription-date")}
                      </p>
                      <p className={styles["subcriptionvalue_1"]}>
                        {moment(isPackageDetail.PackageSubscriptionDate).format(
                          "do MMM, YYYY"
                        )}
                      </p>
                    </Col>
                    <Col sm={12} md={6} lg={6} className="text-center m-0 p-0 ">
                      <p className={styles["subcriptionkey_2"]}>
                        {t("Expiry-date")}
                      </p>
                      <p className={styles["subcriptionvalue_2"]}>
                        {moment(isPackageDetail.PackageExpiryDate).format(
                          "do MMM, YYYY"
                        )}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className={styles["selected-package-text"]}
                >
                  <p>{isPackageDetail.PackageDescription}</p>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <div className={styles["packagecard_usersallows"]}>
                    <Row>
                      <Col sm={12}>
                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className="color-5a5a5a text-center text-uppercase fw-bold my-2"
                          >
                            {t("Users")}
                          </Col>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className="m-0 p-0 text-left"
                          >
                            <ProgressBar
                              now={isPackageDetail.UsersRangeAdmin}
                              max={maxAdminUser}
                              className={styles["ExecutiveMembersRange"]}
                            />
                          </Col>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className={styles["progressbar-text"]}
                          >
                            {isPackageDetail.UsersRangeAdmin} {t("Of")}{" "}
                            {maxAdminUser} Admin Users
                          </Col>
                          <Col sm={12} md={12} lg={12} className={"m-0 p-0"}>
                            <ProgressBar
                              now={isPackageDetail.UsersRangeBoardMembers}
                              max={maxBoardMembers}
                              className={styles["BoardMembersRange"]}
                            />
                          </Col>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className={styles["progressbar-text"]}
                          >
                            {isPackageDetail.UsersRangeBoardMembers} {t("To")}{" "}
                            {maxBoardMembers} {t("Board-members")}
                          </Col>
                          <Col sm={12} md={12} lg={12} className="m-0 p-0">
                            <ProgressBar
                              now={isPackageDetail.OtherUsersRange}
                              max={maxOtherUsers}
                              className={styles["BoardMembersRange"]}
                            />
                          </Col>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className={styles["progressbar-text"]}
                          >
                            {isPackageDetail.OtherUsersRange} {t("To")}{" "}
                            {maxOtherUsers} {t("Board-members")}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col sm={12} md={8} lg={8} className="mb-3">
            <Col
              className={`${
                styles["upgrade_planBox"]
              } ${"border py-5 px-5 bg-white h-100"}`}
              sm={12}
              md={12}
              lg={12}
            >
              <h4 className="fw-900 mt-4 text-color MontserratSemiBold">
                {t("Upgrade-your-plan")}
              </h4>
              <p className={styles["upgradeplandetail_line"]}>
                {t("Get-more-features-by-upgrading-your-plan")}
              </p>
              <ul className="mt-5 text-color MontserratMedium">
                <li>{t("Get-more-users")}</li>
                <li>{t("Theme-customization")}</li>
                <li>{t("Marketing-tools")}</li>
                <li>{t("Analytics")}</li>
              </ul>
              <Button
                onClick={navigatetoUpgrade}
                text={t("Upgrade")}
                className={styles["upgrade_button"]}
              />
            </Col>
          </Col>
        </Row>
      </Container>
      {GetSubscriptionPackage.Loading ? <Loader /> : null}
    </>
  );
};

export default PackageDetails;
