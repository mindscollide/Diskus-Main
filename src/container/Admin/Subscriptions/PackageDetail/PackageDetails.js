import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button, Loader } from "../../../../components/elements";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import styles from "./PackageDetail.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getSubscribeOrganizationPackage } from "../../../../store/actions/Admin_PackageDetail";
import { _justShowDateformat } from "../../../../commen/functions/date_formater";
import { isHTML } from "../../../../commen/functions/html_formater";
import { packagesforUpgrade } from "../../../../store/actions/Admin_PackageUpgrade";
const PackageDetails = () => {
  const dispatch = useDispatch();
  const { GetSubscriptionPackage, LanguageReducer } = useSelector(
    (state) => state
  );
  const [maxAdminUser, setMaxAdminUser] = useState(0);
  const [maxBoardMembers, setBoardMembers] = useState(0);
  const [maxOtherUsers, setOtherUsers] = useState(0);
  const [packageColorPath1, setPackageColorPath1] = useState("");
  const [packageColorPath2, setPackageColorPath2] = useState("");
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

  useEffect(() => {
    dispatch(getSubscribeOrganizationPackage(navigate, t));
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
      setPackageColorPath1(
        packageDetails.organizationSelectedPackage.badgeColor.split(
          "_SEPERATOR_"
        )[0]
      );
      setPackageColorPath2(
        packageDetails.organizationSelectedPackage.badgeColor.split(
          "_SEPERATOR_"
        )[1]
      );

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

  const navigatetoUpgrade = () => {
    dispatch(packagesforUpgrade(navigate, t));
  };

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
                    undefined ? (
                    <>
                      <span class="icon-star package-icon-style">
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
                          <p className="fs-6 FontArabicRegular">{t("Month")}</p>
                        </h4>
                        <p
                          className={
                            styles["selectedpackagecard_disoucntprice_para"]
                          }
                        >
                          {t("Annual-Subscriptions")}{" "}
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
                        {_justShowDateformat(
                          isPackageDetail.PackageSubscriptionDate + "000000"
                        )}
                      </p>
                    </Col>
                    <Col sm={12} md={6} lg={6} className="text-center m-0 p-0 ">
                      <p className={styles["subcriptionkey_2"]}>
                        {t("Expiry-date")}
                      </p>
                      <p className={styles["subcriptionvalue_2"]}>
                        {_justShowDateformat(
                          isPackageDetail.PackageExpiryDate + "000000"
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
                  {isHTML(isPackageDetail.PackageDescription) ? (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: isPackageDetail.PackageDescription,
                      }}
                    ></p>
                  ) : (
                    <p>{isPackageDetail.PackageDescription}</p>
                  )}
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
                            className="color-5a5a5a text-center text-uppercase fw-bold my-2 Arabicstyles_Subtotal_Not_include_taxes"
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
                            {maxAdminUser} {t("Admin-users")}
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
                            {isPackageDetail.UsersRangeBoardMembers} {t("Of")}{" "}
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
                            {isPackageDetail.OtherUsersRange} {t("Of")}{" "}
                            {maxOtherUsers} {t("Other-users")}
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
              <h4 className="fw-900 mt-4 text-color  Saved_money_Tagline ">
                {t("Upgrade-your-plan")}
              </h4>
              <p className={styles["upgradeplandetail_line"]}>
                {t("Get-more-features-by-upgrading-your-plan")}
              </p>
              <ul className="mt-5 text-color MontserratMedium ">
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
      {GetSubscriptionPackage.Loading || LanguageReducer.Loading ? (
        <Loader />
      ) : null}
    </>
  );
};

export default PackageDetails;
