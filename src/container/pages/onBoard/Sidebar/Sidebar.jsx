import React from "react";
import "./onboard_sidebar.css";
import { Row, Col, Nav } from "react-bootstrap";
import { useTour } from "@reactour/tour";
import MeetingIconSvg from "../../../../assets/images/newElements/MeetingIcon.svg";
import NewTodoIcon from "../../../../assets/images/newElements/newTodoIcon.svg";
import NewCalendarIcon from "../../../../assets/images/newElements/newCalenderIcon.svg";
import NewLockIcon from "../../../../assets/images/newElements/newlockIcon.svg";

const Sidebar = () => {
  const { setCurrentStep } = useTour();

  return (
    <>
      <Row className="m-0 p-0 sidebar-row">
        <Col sm={1} className="diskus-sidebar">
          <Nav className=" mb-5 p-0 d-flex justify-content-center align-items-center flex-column mt-5">
            {/* Meeting Menu */}
            <Nav.Link
              className="m-0 p-0 ms-4"
              eventKey="link-2"
              onClick={() => setCurrentStep(2)}
            >
              <img
                draggable="false"
                alt=""
                src={MeetingIconSvg}
                data-tut="meeting-icon"
                className="meeting-icon-tut"
              />
            </Nav.Link>
            {/* Todo Menu */}
            <Nav.Link eventKey="link-3" className="m-0 p-0 ms-4">
              <img
                draggable="false"
                src={NewTodoIcon}
                alt=""
                data-tut="meeting-icon"
                className="meeting-icon-tut"
              />
            </Nav.Link>
            {/* Calendar Menu */}
            <Nav.Link eventKey="link-4" className="m-0 p-0 ms-4">
              <img
                draggable="false"
                alt=""
                src={NewCalendarIcon}
                data-tut="meeting-icon"
                className="meeting-icon-tut"
              />
            </Nav.Link>
            {/* FAQ Menu */}
            <Nav.Link eventKey="link-5" className="m-0 p-0 ms-4">
              <img
                draggable="false"
                src={NewLockIcon}
                alt=""
                data-tut="meeting-icon"
                className="meeting-icon-tut"
              />
            </Nav.Link>
            {/* Setting Menu */}
            <Nav.Link eventKey="link-6"></Nav.Link>
          </Nav>
        </Col>
        <Col sm={11} className={""}></Col>
      </Row>
    </>
  );
};

export default Sidebar;
