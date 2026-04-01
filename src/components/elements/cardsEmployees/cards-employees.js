import { Col, Row, Container } from "react-bootstrap";
import { Check2 } from "react-bootstrap-icons";
import "./cards-employees.css";
import deleteButtonCreateMeeting from "../../../assets/images/cancel_meeting_icon.svg";

/**
 * @component EmployeeCard
 * @description Renders a card for an employee/participant in a meeting context.
 * Displays the employee's profile picture (from a base64 string), name, and
 * designation. A checkmark icon is always visible. When the current user is the
 * meeting organizer, a delete/remove button is shown for all participants except
 * the organizer themselves — preventing self-removal.
 *
 * @param {string} props.employeeName - Full name of the employee.
 * @param {string} props.employeeDesignation - Job designation of the employee.
 * @param {boolean} props.organizer - Whether the currently logged-in user is the
 *   meeting organizer. Controls visibility of the remove button.
 * @param {Function} props.IconOnClick - Callback fired when the remove/delete icon
 *   is clicked, typically used to remove the employee from the meeting.
 * @param {string} props.UserProfilePic - Base64-encoded JPEG image string for the
 *   employee's profile picture.
 *
 * @localStorage UserName - Used to compare against employeeName to hide the delete
 *   button for the organizer's own card.
 * @localStorage i18nextLng - Current language code applied as a CSS class to support
 *   locale-specific text styling.
 *
 * @example
 * <EmployeeCard
 *   employeeName="Ali Hassan"
 *   employeeDesignation="Senior Developer"
 *   organizer={true}
 *   IconOnClick={() => handleRemove(userId)}
 *   UserProfilePic={base64ImageString}
 * />
 */
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
            <label className={" card-employee-name" + " " + currentLanguage}>
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
                  alt=""
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
