import React from "react";

import { Row, Col, Nav, Container, Navbar, NavDropdown } from "react-bootstrap";
import Logo from "../../../assets/images/sidebar-menu-icon.png";
import { Link, useLocation } from "react-router-dom";

import "./Navbar.css";

const NavbarAdmin = () => {
  const location = useLocation();

  return (
    <>
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
                    <Nav className="me-auto">
                      {/* <Nav.Link href="#pricing">Pricing</Nav.Link> */}
                      <NavDropdown
                        title="All User"
                        id="collasible-nav-dropdown"
                        className="dropItems1 navbar"
                      >
                        <NavDropdown.Item
                          as={Link}
                          to="AddUser"
                          eventKey="link-7"
                          className="text-black border-none "
                        >
                          Add User
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={Link}
                          to="EditUser"
                          eventKey="link-8"
                          className="text-black border-none "
                        >
                          Edit User
                        </NavDropdown.Item>
                      </NavDropdown>

                      <NavDropdown
                        title="Meetings"
                        id="collasible-nav-dropdown"
                        className="dropItems2 navbar"
                      >
                        <NavDropdown.Item
                          as={Link}
                          to="AllMeeting"
                          eventKey="link-8"
                          className="text-black border-none"
                        >
                          All Meeting
                        </NavDropdown.Item>
                      </NavDropdown>

                      <NavDropdown
                        title="Configurations"
                        id="collasible-nav-dropdown"
                        className="dropItems3 text-black navbar"
                      >
                        <NavDropdown.Item
                          as={Link}
                          to="Organization"
                          eventKey="link-8"
                          className="text-black border-none "
                        >
                          Organization Level Configurations
                        </NavDropdown.Item>
                      </NavDropdown>

                      <NavDropdown
                        title="Subscriptions"
                        id="collasible-nav-dropdown"
                        className="dropItems4 p-0  navbar"
                      >
                        <NavDropdown.Item
                          as={Link}
                          to="PackageDetail"
                          eventKey="link-8"
                          className="text-black border-none  bg-white"
                        >
                          Package Detail
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          as={Link}
                          to="CancelSub"
                          eventKey="link-8"
                          className="text-black border-none "
                        >
                          Cancel Subscriptions
                        </NavDropdown.Item>
                      </NavDropdown>

                      <NavDropdown
                        title="Billing Information"
                        id="collasible-nav-dropdown"
                        className="dropItems4 navbar"
                      >
                        <NavDropdown.Item
                          as={Link}
                          to="Summary"
                          eventKey="link-8"
                          className="text-black border-none "
                        >
                          Summary
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          as={Link}
                          to="PayOutstanding"
                          eventKey="link-8"
                          className="text-black border-none "
                        >
                          Pay Outstanding
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          as={Link}
                          to="Invoice"
                          eventKey="link-8"
                          className="text-black border-none"
                          to="PaymentHistory"
                          eventKey="link-8"
                        >
                          Invoice & Payment History
                        </NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </>
          </Nav>
        </Col>
        <Col sm={10} className={""}></Col>
      </Row>
    </>
  );
};

export default NavbarAdmin;
