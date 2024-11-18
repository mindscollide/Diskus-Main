import { Col, Row, Container } from "react-bootstrap";
import userImage from "./../../../assets/images/user.png";
import currentUserImage from "./../../../assets/images/avatar.png";
import { Check2 } from "react-bootstrap-icons";
import "./cards-employees.css";
import deleteButtonCreateMeeting from "../../../assets/images/cancel_meeting_icon.svg";

const EmployeeCard = ({
  employeeName,
  employeeDesignation,
  organizer,
  IconOnClick,
  UserProfilePic,
}) => {
  let UserName = localStorage.getItem("UserName");
  let currentLanguage = localStorage.getItem("i18nextLng");
  return (
    <>
      <Container className="employeecard_Card cards-container">
        <Row>
          <Col
            lg={2}
            md={2}
            xs={12}
            className="p-0 margin-bottom-15margin-bottom-15"
          >
            <img
              src={`data:image/jpeg;base64,${UserProfilePic}`}
              className="card-employee-image"
              alt=""
              draggable="false"
            />
          </Col>
          <Col lg={8} md={8} xs={12}>
            <label
              className={
                " card-employee-name" +
                " " +
                currentLanguage
              }
            >
              {employeeName}
            </label>
            <br />
            <label
              className={"card-employee-desgination" + " " + currentLanguage}
            >
              {employeeDesignation}
            </label>
          </Col>
          <Col lg={2} md={2} xs={12} className="card-employee-checkIcon">
            <Check2 />
          </Col>
          {organizer ? (
            UserName !== employeeName ? (
              <span className="employeecard_deletebtn">
                <img
                  width={20}
                  height={20}
                  src={deleteButtonCreateMeeting}
                  onClick={IconOnClick}
                  draggable="false"
                />
              </span>
            ) : null
          ) : null}
        </Row>
      </Container>
    </>
  );
};
export default EmployeeCard;
