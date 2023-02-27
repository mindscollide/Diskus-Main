import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { Button } from "bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import "./Header.css";
import { useTour } from "@reactour/tour";
import TextField from "../../../../components/elements/input_field/Input_field";
import { Bell, Search } from "react-bootstrap-icons";
import { CustomDatePicker, TimePickers } from "../../../../components/elements";
import ModalMeeting from "../modalmeeting/ModalMeeting";
import { useSelector, useDispatch } from "react-redux";
import {
  showModalOnboard,
  showIsDetailOnboard,
  showIsAgendaOnboard,
  showIsAttendeesOnboard,
} from "../../../../store/actions/OnBoardStates";
import { useTranslation } from "react-i18next";
import Header2 from "../../../../components/layout/header2/Header2";
import Sidebar from "../../../../components/layout/sidebar/Sidebar";
// import Sidebar from "../../onBoard/Sidebar/Sidebar";

const Header = ({ heading, user, currentUserImage, searchVisible }) => {
  //For Localization
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { OnBoardModal } = state;
  const location = useLocation();
  console.log("CurrentLocation", location.pathname)
  useEffect(() => {
    if(location.pathname === "/onboard") {
      document.body.style.overflow = "hidden"
    }
    else {
      document.body.style.overflow = "auto"
    }
  }, [])
  
  const { setCurrentStep, currentStep } = useTour();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isExpand, setExpand] = useState(false);
  const [isMeeting, setMeeting] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const { setIsOpen } = useTour();
  const [showUserDropDown, setShowUserDropDown] = useState(false);
  const ShowHide = () => {
    setExpand(!isExpand);
    console.log(isExpand);
  };
  const startTour = () => {
    setIsOpen(true);
    setCurrentStep(0);
  };
  const showUserDrodDown = () => {
    setShowUserDropDown(!showUserDropDown);
  };
  const notificationBar = () => {
    setNotificationDropdown(!notificationDropdown);
  };
  useEffect(() => {
    console.log(location);
    console.log(isMeeting);
    location.pathname == "/onboard" ? setMeeting(true) : setMeeting(false);
    setIsOpen(true);
  }, [location]);

  console.log(currentStep);

  return (
    <>
      {/* <Row>
        <Col lg={12} md={12} sm={12} className="sidebar-for-onboard">
          <Sidebar />
        </Col>
      </Row> */}

      <Row>
        <Col lg={12} md={12} sm={12} className="header-navbar-show">
          <Header2 />
        </Col>
      </Row>
      <Container>
        {/* <button onClick={startTour}>Start Tour</button> */}
        <Row
          className={
            currentStep === 0 && currentStep === 1 && currentStep === 4
              ? "header-schedule-meeting-btn"
              : "header-schedule-meeting-btn-show"
          }
        >
          <Col
            sm={5}
            className="d-flex justify-content-start align-items-center mt-3"
          >
            {/* <div className="heading  color-primary fw-600">{heading}</div> */}
            {isMeeting && (
              <ModalMeeting ModalTitle={"+ " + t("Schedule-a-meeting")} />
            )}
          </Col>
          <Col sm={7} className="d-flex align-items-center justify-content-end">
            {isExpand && (
              <>
                <CustomDatePicker />
                <TextField width="200px" className="mx-2" placeholder="Task" />
                <TextField
                  width="200px"
                  className="mx-2"
                  placeholder="Assigned To"
                />
              </>
            )}
            {searchVisible && (
              <Search
                width="24px"
                height="24px"
                className="search-Icon"
                onClick={ShowHide}
              />
            )}

            {/* <Dropdown className="notification-dropdowns">
              <Dropdown.Toggle className="notification-dropdowntoggle">
                <Bell width="24px" height="24" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="notification-dropdown_menu">
                <Dropdown.Item>
                  <p className="notification-day">Today</p>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Row className="d-flex">
                    <Col sm={2}>
                      <div className="desc-notification-user"></div>
                    </Col>
                    <Col sm={10}>
                      <p className="desc-item-text">
                        Routine Checkstart in 30 mins. Go to Meeting Details to
                        run through any attachments before the metting
                      </p>
                      <p className="desc-item-time">12:13</p>
                    </Col>
                  </Row>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Row className="d-flex">
                    <Col sm={2}>
                      <div className="desc-notification-user"></div>
                    </Col>
                    <Col sm={10}>
                      <p className="desc-item-text">
                        Routine Checkstart in 30 mins. Go to Meeting Details to
                        run through any attachments before the metting
                      </p>
                      <p className="desc-item-time">12:13</p>
                    </Col>
                  </Row>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Row className="d-flex">
                    <Col sm={2}>
                      <div className="desc-notification-user"></div>
                    </Col>
                    <Col sm={10}>
                      <p className="desc-item-text">
                        Routine Checkstart in 30 mins. Go to Meeting Details to
                        run through any attachments before the metting
                      </p>
                      <p className="desc-item-time">12:13</p>
                    </Col>
                  </Row>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Row className="d-flex">
                    <Col sm={2}>
                      <div className="desc-notification-user"></div>
                    </Col>
                    <Col sm={10}>
                      <p className="desc-item-text">
                        Routine Checkstart in 30 mins. Go to Meeting Details to
                        run through any attachments before the metting
                      </p>
                      <p className="desc-item-time">12:13</p>
                    </Col>
                  </Row>
                </Dropdown.Item>
                <Dropdown.Item>
                  <p className="notification-day">Yesterday</p>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Row className="d-flex">
                    <Col sm={2}>
                      <div className="desc-notification-user"></div>
                    </Col>
                    <Col sm={10}>
                      <p className="desc-item-text">
                        Routine Checkstart in 30 mins. Go to Meeting Details to
                        run through any attachments before the metting
                      </p>
                      <p className="desc-item-time">12:13</p>
                    </Col>
                  </Row>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Row className="d-flex">
                    <Col sm={2}>
                      <div className="desc-notification-user"></div>
                    </Col>
                    <Col sm={10}>
                      <p className="desc-item-text">
                        Routine Checkstart in 30 mins. Go to Meeting Details to
                        run through any attachments before the metting
                      </p>
                      <p className="desc-item-time">12:13</p>
                    </Col>
                  </Row>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Row className="d-flex">
                    <Col sm={2}>
                      <div className="desc-notification-user"></div>
                    </Col>
                    <Col sm={10}>
                      <p className="desc-item-text">
                        Routine Checkstart in 30 mins. Go to Meeting Details to
                        run through any attachments before the metting
                      </p>
                      <p className="desc-item-time">12:13</p>
                    </Col>
                  </Row>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}

            {/* <Dropdown className="profilebtn-dropdown">
              <Dropdown.Toggle className="dropdown-toggle">
                <img src={currentUserImage} className="user-img " />

                <p className="user-name">{user}</p>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown_menu">
                <Dropdown.Item href="#/action-2" className="my-2">
                  Change Password
                </Dropdown.Item>
                <Dropdown.Item href="#/action-3">Sign Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Header;
