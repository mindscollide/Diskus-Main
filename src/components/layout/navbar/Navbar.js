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
                          className="dropItems1"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="Admin/AddUser"
                            eventKey="link-7"
                          >
                            Add User
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            as={Link}
                            to="Admin/EditUser"
                            eventKey="link-8"
                          >
                            Edit User
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          title="Meetings"
                          id="collasible-nav-dropdown"
                          className="dropItems2"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="Admin/AllMeeting"
                            eventKey="link-8"
                          >
                            All Meeting
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          title="Configurations"
                          id="collasible-nav-dropdown"
                          className="dropItems3"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="Admin/Organization"
                            eventKey="link-8"
                          >
                            Organization Level Configurations
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          title="Subscriptions"
                          id="collasible-nav-dropdown"
                          className="dropItems4"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="Admin/PackageDetail"
                            eventKey="link-8"
                          >
                            Package Detail
                          </NavDropdown.Item>

                          <NavDropdown.Item
                            as={Link}
                            to="Admin/CancelSub"
                            eventKey="link-8"
                          >
                            Cancel Subscriptions
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                          title="Billing Information"
                          id="collasible-nav-dropdown"
                          className="dropItems4"
                        >
                          <NavDropdown.Item
                            as={Link}
                            to="Admin/Summary"
                            eventKey="link-8"
                          >
                            Summary
                          </NavDropdown.Item>

                          <NavDropdown.Item
                            as={Link}
                            to="Admin/PayOutstanding"
                            eventKey="link-8"
                          >
                            Pay Outstanding
                          </NavDropdown.Item>

                          <NavDropdown.Item
                            as={Link}
                            to="Admin/Invoice"
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
        <Col sm={11} className={""}></Col>
      </Row>
    </>
  );
};

export default NavbarAdmin;