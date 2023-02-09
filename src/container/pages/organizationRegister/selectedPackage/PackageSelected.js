import React, { useState, useEffect } from "react";
import styles from "./PackageSelected.module.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import SelectedPackageCard from "../../../../components/elements/selectedpackagecard/SelectedPackageCard";
import { Button, Loader, Notification } from "../../../../components/elements";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  cleareMessage,
  getSelectedPacakgeDetail,
} from "../../../../store/actions/Auth2_actions";

const PackageSelected = () => {
  const { Authreducer } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [organizationData, setOrganizationData] = useState({
    Company: "",
    Country: "",
    Address1: "",
    Address2: "",
    Email: "",
    State: "",
    City: "",
    PostalCode: "",
  });
  const [organizationDataRole, setorganizationDataRole] = useState({});
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [organizationDataSelectedPackage, setorganizationDataSelectedPackage] =
    useState({
      PackageTitle: "",
      SelectedPackageAmount: "",
      PackageAllowedBoardMembers: "",
      PackageAllowedAdminMembers: "",
      PackageDescriptive: "",
    });
  const [organizationDataSubscription, setorganizationDataSubscription] =
    useState({});
  const [
    organizationDataSubscriptionType,
    setorganizationDataSubscriptionType,
  ] = useState({});
  const { t } = useTranslation();
  const [packageSelectedData, setPackageSelectedData] = useState({
    Company: "",
    Country: "",
    Address1: "",
    Address2: "",
    Email: "",
    State: "",
    City: "",
    PostalCode: "",
  });
  console.log(Authreducer, "AuthreducerAuthreducer");
  useEffect(() => {
    localStorage.removeItem("flagForSelectedPackeg");
  }, []);
  useEffect(() => {
    if (Authreducer.GetSelectedPacakgeDetails !== null) {
      let Organizationdata = {
        Company:
          Authreducer.GetSelectedPacakgeDetails.organization.organizationName,
        Country: "United State",
        Address1:
          Authreducer.GetSelectedPacakgeDetails.organization
            .organizationAddress1,
        Address2:
          Authreducer.GetSelectedPacakgeDetails.organization
            .organizationAddress2,
        Email:
          Authreducer.GetSelectedPacakgeDetails.organization.contactPersonEmail,
        State: Authreducer.GetSelectedPacakgeDetails.organization.stateProvince,
        City: Authreducer.GetSelectedPacakgeDetails.organization.city,
        PostalCode:
          Authreducer.GetSelectedPacakgeDetails.organization.postalCode,
      };
      setPackageSelectedData(Organizationdata);

      let PackageDetails = {
        PackageTitle:
          Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage
            .packageName,
        SelectedPackageAmount:
          Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage
            .packageActualPrice,
        PackageAllowedBoardMembers:
          Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage
            .packageAllowedBoardMemberUsers,
        PackageAllowedAdminMembers:
          Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage
            .packageAllowedAdminUsers,
        PackageDescriptive:
          Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage
            .packageDescriptiveDetails,
      };
      setorganizationDataSelectedPackage(PackageDetails);
    }
  }, [Authreducer.GetSelectedPacakgeDetails]);
  const goBacktoSignUp = () => {
    localStorage.setItem("flagForSelectedPackeg", true);
    navigate("/packageselection");
  };
  const goForPayment = () => {
    navigate("/paymentForm");
  };
  useEffect(() => {
    dispatch(getSelectedPacakgeDetail(navigate, t));
  }, []);
  useEffect(() => {
    if (Authreducer.VerifyOTPEmailResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.VerifyOTPEmailResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.EnterPasswordResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.EnterPasswordResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.OrganizationCreateResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.OrganizationCreateResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.CreatePasswordResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.CreatePasswordResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.GetSelectedPackageResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.GetSelectedPackageResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.EmailValidationResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.EmailValidationResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else {
    }
  }, [
    Authreducer.EnterPasswordResponseMessage,
    Authreducer.VerifyOTPEmailResponseMessage,
    Authreducer.OrganizationCreateResponseMessage,
    Authreducer.CreatePasswordResponseMessage,
    Authreducer.EmailValidationResponseMessage,
    Authreducer.GetSelectedPackageResponseMessage,
  ]);
  return (
    <Container>
      <Row>
        <Col sm={12} lg={10} md={10} className="mx-auto my-auto">
          <Row>
            <Col className="d-flex justify-content-center mb-3 mt-5">
              <h2 className={styles["selectedpackagepage_heading"]}>
                Subscription Details
              </h2>
            </Col>
          </Row>
          <Row>
            <Col sm={12} lg={5} md={5}>
              <Card className={styles["packagecard"]}>
                <Row>
                  <Col sm={12}>
                    <h4
                      className={`${"text-center"} ${
                        styles["selectPackage_title"]
                      }`}
                    >
                      {organizationDataSelectedPackage.PackageTitle}
                    </h4>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <div
                      className={`${styles["packagecard_priceBox_container"]}`}
                    >
                      <div className={styles["selectedPackage_priceDetails"]}>
                        <div className={styles["packagecard_disoucntprice"]}>
                          <h4 className="d-flex justify-content-center align-items-end text-capitalize mb-2">
                            $
                            {
                              organizationDataSelectedPackage.SelectedPackageAmount
                            }
                            /<p className=" m-0 p-0">{t("month")}</p>
                          </h4>
                          <p
                            className={
                              styles["selectedpackagecard_disoucntprice_para"]
                            }
                          >
                            {t("subscriptions")}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div
                  className={`${"MontserratMedium-500"} ${
                    styles["selected-package-text"]
                  }`}
                >
                  <p>{organizationDataSelectedPackage.PackageDescriptive}</p>
                </div>
                <Col sm={12}>
                  <div className={styles["packagecard_usersallows"]}>
                    <Row>
                      <Col sm={12}>
                        <Col className={styles["packagecard_usersallows"]}>
                          <h1
                            className={`${"MontserratBold-700"} ${
                              styles["packagecard_usersallows_heading"]
                            }`}
                          >
                            {t("AllowedUser")}
                          </h1>
                          <Row className="mx-auto">
                            <Col sm={12} md={6} lg={6}>
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["package_membersHeading"]}
                              >
                                Board Members
                              </Col>
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={`${"MontserratBold-700"} ${
                                  styles["package_membersHeading_values"]
                                }`}
                              >
                                {
                                  organizationDataSelectedPackage.PackageAllowedBoardMembers
                                }
                              </Col>
                            </Col>
                            <Col sm={12} md={6} lg={6}>
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["package_membersHeading"]}
                              >
                                Admin Users
                              </Col>
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={`${"MontserratBold-700"} ${
                                  styles["package_membersHeading_values"]
                                }`}
                              >
                                {
                                  organizationDataSelectedPackage.PackageAllowedAdminMembers
                                }
                              </Col>
                            </Col>
                          </Row>
                        </Col>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col sm={12} lg={7} md={7}>
              <SelectedPackageCard
                RowsData={
                  <>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="MontserratMedium-500">Company</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.Company}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="MontserratMedium-500">Country</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.Country}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="MontserratMedium-500">Address1</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.Address1}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="MontserratMedium-500">Address2</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.Address2}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="MontserratMedium-500">Email</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.Email}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="MontserratMedium-500">State</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.State}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="MontserratMedium-500">City</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.City}</p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={4}>
                        <p className="MontserratMedium-500">Postal/Zip Code</p>
                      </Col>
                      <Col sm={8}>
                        <p>{packageSelectedData.PostalCode}</p>
                      </Col>
                    </Row>
                  </>
                }
              />
            </Col>
          </Row>
          <Row className="my-3">
            <Col sm={12} md={6} lg={6} className="d-flex justify-content-start">
              <Button
                text={t("Change-package")}
                onClick={goBacktoSignUp}
                className={styles["goBack_SelectedPackage"]}
              />
            </Col>
            <Col
              sm={12}
              md={6}
              lg={6}
              className="d-flex justify-content-end p-0"
            >
              <Button
                text="Process To Payment"
                onClick={goForPayment}
                className={styles["ProcessToPayment_SelectedPackage"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {Authreducer.Loading && <Loader />}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </Container>
  );
};

export default PackageSelected;
