import React, { useState, useEffect } from "react";

import { Row, Col, Nav, Container, Navbar, NavDropdown } from "react-bootstrap";
import Logo from "../../../assets/images/sidebar-menu-icon.png";
import { Link, useLocation } from "react-router-dom";
import "./../../../i18n";
import { useTranslation } from "react-i18next";

import "./Navbar.css";

const NavbarAdmin = () => {
  const location = useLocation();
  const [activateBlur, setActivateBlur] = useState(false);

  let Blur = localStorage.getItem("blur");

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
                      <Nav className="me-auto d-flex justify-content-evenly w-100 py-1">
                        <NavDropdown
                          disabled={true}
                          title="All User"
                          id="collasible-nav-dropdown"
                          className="DiskusAdminNavBar"
                          // as={Link}
                          to="AllUserPage"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="AddUser"
                            eventKey="link-7"
                            className="text-black border-none"
                          >
                            {t("Add-User")}
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            as={Link}
                            to="EditUser"
                            eventKey="link-8"
                            className="text-black border-none"
                          >
                            {t("Edit-User")}
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
                            {t("All-Meeting")}
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
                            to="Organization"
                            eventKey="link-8"
                            className="text-black border-none "
                          >
                            {t("Organization-Level-Configurations")}
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
                            to="PackageDetail"
                            eventKey="link-8"
                            className="text-black border-none  bg-white"
                          >
                            {t("Package-Detail")}
                          </NavDropdown.Item>

                          <NavDropdown.Item
                            as={Link}
                            to="CancelSub"
                            eventKey="link-8"
                            className="text-black border-none "
                          >
                            {t("Cancel-Subscriptions")}
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          disabled={true}
                          title={t("Billing-Information")}
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
                            {t("Pay-Outstanding")}
                          </NavDropdown.Item>

                          <NavDropdown.Item
                            as={Link}
                            eventKey="link-8"
                            className="text-black border-none"
                            to="PaymentHistory"
                          >
                            {t("Invoice-Payment-History")}
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
                        <NavDropdown
                          title="All User"
                          id="collasible-nav-dropdown"
                          className="DiskusAdminNavBar"
                          as={Link}
                          to="AllUserPage"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="AddUser"
                            eventKey="link-7"
                            className="text-black border-none"
                          >
                            {t("Add-User")}
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            as={Link}
                            to="EditUser"
                            eventKey="link-8"
                            className="text-black border-none"
                          >
                            {t("Edit-User")}
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
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
                            {t("All-Meeting")}
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          title={t("Configurations")}
                          id="collasible-nav-dropdown"
                          className="DiskusAdminNavBar"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="Organization"
                            eventKey="link-8"
                            className="text-black border-none "
                          >
                            {t("Organization-Level-Configurations")}
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          title={t("Subscriptions")}
                          id="collasible-nav-dropdown"
                          className="DiskusAdminNavBar"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="PackageDetail"
                            eventKey="link-8"
                            className="text-black border-none  bg-white"
                          >
                            {t("Package-Detail")}
                          </NavDropdown.Item>

                          <NavDropdown.Item
                            as={Link}
                            to="CancelSub"
                            eventKey="link-8"
                            className="text-black border-none "
                          >
                            {t("Cancel-Subscriptions")}
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          title={t("Billing-Information")}
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
                            {t("Pay-Outstanding")}
                          </NavDropdown.Item>

                          <NavDropdown.Item
                            as={Link}
                            eventKey="link-8"
                            className="text-black border-none"
                            to="PaymentHistory"
                          >
                            {t("Invoice-Payment-History")}
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
      )}
    </>
  );
};

export default NavbarAdmin;
