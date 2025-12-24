import React, { useState, useEffect } from "react";
import { Row, Col, Nav, Container, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./../../../i18n";
import { useTranslation } from "react-i18next";
import "./Navbar.css";
import {
  checkFeatureIDAvailability,
  getLocalStorageItemNonActiveCheck,
} from "../../../commen/functions/utils";

const NavbarAdmin = () => {
  const { t } = useTranslation();
  const [activateBlur, setActivateBlur] = useState(false);
  let Blur = localStorage.getItem("blur");
  const roleRoute = getLocalStorageItemNonActiveCheck("VERIFICATION");
  const TrialExpireSelectPac = getLocalStorageItemNonActiveCheck(
    "TrialExpireSelectPac"
  );

  useEffect(() => {
    if (Blur != undefined) {
      setActivateBlur(true);
    } else {
      setActivateBlur(false);
    }
  }, [Blur]);

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
                          active={true}
                          title={t("Complaince-setting")}
                          id="collasible-nav-dropdown"
                          className="DiskusAdminNavBar"
                        >
                          {/* {checkFeatureIDAvailability(35) ? ( */}
                          <NavDropdown.Item
                            as={Link}
                            // to="loginreport"
                            eventKey="link-8"
                            className="text-black border-none "
                          >
                            {t("Manage-authority")}
                          </NavDropdown.Item>
                          {/* ) : null} */}

                          <NavDropdown.Item
                            as={Link}
                            // to="AuditTrial"
                            eventKey="link-8"
                            className="text-black border-none"
                          >
                            {t("General-settings")}
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          disabled={true}
                          title={t("Manage-users")}
                          id="collasible-nav-dropdown"
                          className="DiskusAdminNavBar"
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
                            <NavDropdown
                              title={t("Complaince-setting")}
                              id="collasible-nav-dropdown"
                              className="DiskusAdminNavBar"
                            >
                              <NavDropdown.Item
                                as={Link}
                                to="manageAuthority"
                                eventKey="link-8"
                                className="text-black border-none "
                              >
                                {t("Manage-authority")}
                              </NavDropdown.Item>

                              <NavDropdown.Item
                                as={Link}
                                to="generalSetting"
                                eventKey="link-8"
                                className="text-black border-none"
                              >
                                {t("General-settings")}
                              </NavDropdown.Item>
                            </NavDropdown>
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
                              </>
                            ) : (
                              <>
                                {" "}
                                <NavDropdown
                                  title={t("Subscriptions")}
                                  id="collasible-nav-dropdown"
                                  className="DiskusAdminNavBar"
                                >
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
                                      to="updatedCancelSubscription"
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

                              <NavDropdown.Item
                                as={Link}
                                to="AuditTrial"
                                eventKey="link-8"
                                className="text-black border-none"
                              >
                                {t("Audit-trial")}
                              </NavDropdown.Item>
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
