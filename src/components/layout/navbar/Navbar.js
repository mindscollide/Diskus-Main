import React, { useState, useEffect } from "react";

import { Row, Col, Nav, Container, Navbar, NavDropdown } from "react-bootstrap";
import Logo from "../../../assets/images/sidebar-menu-icon.png";
import { Link, useLocation } from "react-router-dom";
import "./../../../i18n";
import { useTranslation } from "react-i18next";

import "./Navbar.css";
import {
  checkFeatureIDAvailability,
  getLocalStorageItemNonActiveCheck,
} from "../../../commen/functions/utils";

const NavbarAdmin = () => {
  const location = useLocation();
  const [activateBlur, setActivateBlur] = useState(false);

  let Blur = localStorage.getItem("blur");
  const roleRoute = getLocalStorageItemNonActiveCheck("VERIFICATION");
  const TrialExpireSelectPac = getLocalStorageItemNonActiveCheck(
    "TrialExpireSelectPac"
  );

  useEffect(() => {
    if (Blur != undefined) {
      console.log("Blur", Blur);

      setActivateBlur(true);
    } else {
      console.log("Blur", Blur);

      setActivateBlur(false);
    }
  }, [Blur]);
  //for translation
  const { t } = useTranslation();

  return (
    <>
      {activateBlur ? (
        <Row className="m-0 p-0 sidebar-row">
          <Col
            sm={2}
            className="justify-content-start align-items-start admin-width"
          >
            <Nav className=" m-0 p-0 d-flex justify-content-center flex-column ">
              <>
                <Navbar collapseOnSelect expand="lg" className="adminNavbar">
                  <Container className="containerAd">
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                      <Nav className=" me-auto d-flex justify-content-evenly w-100 py-1">
                        <NavDropdown
                          disabled={true}
                          title={t("Manage-users")}
                          id="collasible-nav-dropdown"
                          className="DiskusAdminNavBar"
                          // as={Link}
                          // to="AllUserPage"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="AllUserPage"
                            eventKey="link-7"
                            className="text-black border-none"
                          >
                            {t("All-user")}
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            as={Link}
                            to="AddUser"
                            eventKey="link-7"
                            className="text-black border-none"
                          >
                            {t("Add-user")}
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            as={Link}
                            to="ManageUsers"
                            eventKey="link-8"
                            className="text-black border-none"
                          >
                            {t("Edit-user")}
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          disabled={true}
                          title={t("Meetings")}
                          id="collasible-nav-dropdown"
                          className="DiskusAdminNavBar"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="AllMeeting"
                            eventKey="link-8"
                            className="text-black border-none"
                          >
                            {t("All-meeting")}
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          disabled={true}
                          title={t("Configurations")}
                          id="collasible-nav-dropdown"
                          className="DiskusAdminNavBar"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="OrganizationlevelConfigUM"
                            eventKey="link-8"
                            className="text-black border-none "
                          >
                            {t("Organization-level-configurations")}
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          disabled={true}
                          title={t("Subscriptions")}
                          id="collasible-nav-dropdown"
                          className="DiskusAdminNavBar"
                        >
                          {/* <NavDropdown.Item
                            as={Link}
                            // to="PackageDetail"
                            to="PackageDetailsUserManagement"
                            eventKey="link-8"
                            className="text-black border-none  bg-white"
                          >
                            {t("Package-detail")}
                          </NavDropdown.Item> */}

                          <NavDropdown.Item
                            as={Link}
                            to="subscriptionDetailsUserManagement"
                            eventKey="link-8"
                            className="text-black border-none  bg-white"
                          >
                            {t("Subscription-details")}
                          </NavDropdown.Item>

                          <NavDropdown.Item
                            as={Link}
                            // to="CancelSub"
                            to="CancelSubscriptionUserManagement"
                            eventKey="link-8"
                            className="text-black border-none "
                          >
                            {t("Cancel-subscriptions")}
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          disabled={true}
                          title={t("Billing-information")}
                          id="collasible-nav-dropdown"
                          className="DiskusAdminNavBar"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="Summary"
                            eventKey="link-8"
                            className="text-black border-none "
                          >
                            {t("Summary")}
                          </NavDropdown.Item>

                          <NavDropdown.Item
                            as={Link}
                            to="PayOutstanding"
                            eventKey="link-8"
                            className="text-black border-none "
                          >
                            {t("Pay-outstanding")}
                          </NavDropdown.Item>

                          <NavDropdown.Item
                            as={Link}
                            eventKey="link-8"
                            className="text-black border-none"
                            to="PaymentHistory"
                          >
                            {t("Invoice-&-payment-history")}
                          </NavDropdown.Item>
                        </NavDropdown>
                      </Nav>
                    </Navbar.Collapse>
                  </Container>
                </Navbar>
              </>
            </Nav>
          </Col>
        </Row>
      ) : (
        <Row className="m-0 p-0 sidebar-row">
          <Col
            sm={2}
            className="justify-content-start align-items-start admin-width"
          >
            <Nav className=" m-0 p-0 d-flex justify-content-center flex-column ">
              <>
                <Navbar collapseOnSelect expand="lg" className="adminNavbar">
                  <Container className="containerAd">
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                      <Nav className="me-auto d-flex justify-content-evenly w-100 py-1">
                        {roleRoute ? (
                          <Nav.Link
                            as={Link}
                            to="PayOutstanding"
                            id="collasible-nav-dropdown"
                            className="DiskusAdminNavBar nav-link"
                          >
                            {t("Pay-outstanding")}
                          </Nav.Link>
                        ) : TrialExpireSelectPac ? (
                          <Nav.Link
                            as={Link}
                            to="PakageDetailsUserManagement"
                            id="collasible-nav-dropdown"
                            className="DiskusAdminNavBar nav-link"
                          >
                            {t("Billing-subscription")}
                          </Nav.Link>
                        ) : (
                          <>
                            <Nav.Link
                              as={Link}
                              to="ManageUsers"
                              className="DiskusAdminNavBar"
                              id="collasible-nav-dropdown"
                            >
                              {t("Manage-users")}
                            </Nav.Link>

                            {/* Meeting Drop down Comment */}
                            <NavDropdown
                              title={t("Configurations")}
                              id="collasible-nav-dropdown"
                              className="DiskusAdminNavBar"
                            >
                              {checkFeatureIDAvailability(36) ? (
                                <NavDropdown.Item
                                  as={Link}
                                  to="OrganizationlevelConfigUM"
                                  eventKey="link-8"
                                  className="text-black border-none "
                                >
                                  {t("Organization-level-configurations")}
                                </NavDropdown.Item>
                              ) : null}
                            </NavDropdown>
                            {JSON.parse(localStorage.getItem("isTrial")) ? (
                              <>
                                {" "}
                                {checkFeatureIDAvailability(28) ? (
                                  <Nav.Link
                                    as={Link}
                                    to="PakageDetailsUserManagement"
                                    id="collasible-nav-dropdown"
                                    className="DiskusAdminNavBar nav-link"
                                  >
                                    {t("Billing-subscription")}
                                  </Nav.Link>
                                ) : null}
                                {/* <Nav.Link
                            title={t("Billing-Subscription")}
                            id="collasible-nav-dropdown"
                            className="DiskusAdminNavBar"
                            as={Link}
                            // to="PackageDetail"
                            to="PackageDetailsUserManagement"
                          /> */}
                              </>
                            ) : (
                              <>
                                {" "}
                                <NavDropdown
                                  title={t("Subscriptions")}
                                  id="collasible-nav-dropdown"
                                  className="DiskusAdminNavBar"
                                >
                                  {/* <NavDropdown.Item
                                    as={Link}
                                    // to="PackageDetail"
                                    to="PackageDetailsUserManagement"
                                    eventKey="link-8"
                                    className="text-black border-none  bg-white"
                                  >
                                    {t("Package-detail")}
                                  </NavDropdown.Item> */}
                                  <NavDropdown.Item
                                    as={Link}
                                    to="subscriptionDetailsUserManagement"
                                    eventKey="link-8"
                                    className="text-black border-none  bg-white"
                                  >
                                    {t("Subscription-details")}
                                  </NavDropdown.Item>
                                  {checkFeatureIDAvailability(29) ? (
                                    <NavDropdown.Item
                                      as={Link}
                                      to="CancelSubscriptionUserManagement"
                                      eventKey="link-8"
                                      className="text-black border-none "
                                    >
                                      {t("Cancel-subscriptions")}
                                    </NavDropdown.Item>
                                  ) : null}

                                  {checkFeatureIDAvailability(30) ? (
                                    <NavDropdown.Item
                                      as={Link}
                                      to="deleteorganizationUserMangement"
                                      eventKey="link-8"
                                      className="text-black border-none "
                                    >
                                      {t("Delete Organization")}
                                    </NavDropdown.Item>
                                  ) : null}
                                </NavDropdown>
                                <NavDropdown
                                  title={t("Billing-information")}
                                  id="collasible-nav-dropdown"
                                  className="DiskusAdminNavBar"
                                >
                                  {checkFeatureIDAvailability(34) ? (
                                    <NavDropdown.Item
                                      as={Link}
                                      to="Summary"
                                      eventKey="link-8"
                                      className="text-black border-none "
                                    >
                                      {t("Summary")}
                                    </NavDropdown.Item>
                                  ) : null}

                                  {checkFeatureIDAvailability(33) ? (
                                    <NavDropdown.Item
                                      as={Link}
                                      to="PayOutstanding"
                                      eventKey="link-8"
                                      className="text-black border-none "
                                    >
                                      {t("Pay-outstanding")}
                                    </NavDropdown.Item>
                                  ) : null}

                                  <NavDropdown.Item
                                    as={Link}
                                    eventKey="link-8"
                                    className="text-black border-none"
                                    to="PaymentHistory"
                                  >
                                    {t("Invoice-&-payment-history")}
                                  </NavDropdown.Item>
                                </NavDropdown>
                              </>
                            )}

                            <NavDropdown
                              title={t("Reports")}
                              id="collasible-nav-dropdown"
                              className="DiskusAdminNavBar"
                            >
                              {checkFeatureIDAvailability(35) ? (
                                <NavDropdown.Item
                                  as={Link}
                                  to="loginreport"
                                  eventKey="link-8"
                                  className="text-black border-none "
                                >
                                  {t("User-login-history")}
                                </NavDropdown.Item>
                              ) : null}
                            </NavDropdown>
                          </>
                        )}
                      </Nav>
                    </Navbar.Collapse>
                  </Container>
                </Navbar>
              </>
            </Nav>
          </Col>
        </Row>
      )}
    </>
  );
};

export default NavbarAdmin;
