import { Col, Row } from "react-bootstrap";
import "./Todo_cards-employees.css";

/**
 * @component TodoAssgineeEmployeeCard
 * @description Displays an assignee row card for a To-Do item. The left column shows
 * the assignee's profile picture, name, and designation. The right column renders a
 * contextual icon and label (e.g. status badge, due date, priority indicator) whose
 * appearance is controlled by the caller via the cardTextIconStyle prop.
 *
 * @param {string} props.employeeName - Full name of the assignee.
 * @param {string} props.employeeDesignation - Job designation of the assignee.
 * @param {React.ReactNode} props.cardIcon - Icon element displayed before the card text
 *   in the right column (e.g. a status or priority icon).
 * @param {string} props.cardText - Text label displayed next to the cardIcon in the
 *   right column (e.g. "High Priority", "Due Today").
 * @param {string} props.cardTextIconStyle - CSS class name applied to the right column
 *   container, used to control text alignment, color, or icon styling.
 * @param {string} props.userImage - Base64-encoded JPEG string for the assignee's
 *   profile picture. Rendered directly as a data URI.
 *
 * @example
 * <TodoAssgineeEmployeeCard
 *   employeeName="Omar Khan"
 *   employeeDesignation="Developer"
 *   cardIcon={<FlagIcon />}
 *   cardText="High Priority"
 *   cardTextIconStyle="priority-high"
 *   userImage={base64ImageString}
 * />
 */
const TodoAssgineeEmployeeCard = ({
  employeeName,
  employeeDesignation,
  cardIcon,
  cardText,
  cardTextIconStyle,
  userImage,
}) => {
  return (
    <>
      <Row className="d-flex justify-content-start align-items-center my-2">
        <Col
          lg={6}
          md={6}
          sm={6}
          xs={12}
          className="d-flex justify-content-start gap-1 align-items-center"
        >
          <img
            src={`data:image/jpeg;base64,${userImage}`}
            className="todo-employee-name-image"
            alt=""
            draggable="false"
          />
          <span>
            <label className=" todo-employee-name-card">{employeeName}</label>
            <br />
            <label className=" todo-employee-label-card">
              {employeeDesignation}
            </label>
          </span>
        </Col>

        <Col lg={6} md={6} xs={12} sm={12} className={cardTextIconStyle}>
          <p>
            {cardIcon}
            {cardText}
          </p>
        </Col>
      </Row>
    </>
  );
};
export default TodoAssgineeEmployeeCard;
