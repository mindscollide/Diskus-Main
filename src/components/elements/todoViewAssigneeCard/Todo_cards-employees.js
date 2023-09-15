import { Col, Row, Container } from "react-bootstrap";
import "./Todo_cards-employees.css";

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
      <Container className="todo-employee-container ">
        <Row className="d-flex justify-content-start align-items-center">
          <Col lg={1} md={1} sm={12} xs={12} className="p-0">
            <img
              src={`data:image/jpeg;base64,${userImage}`}
              className="todo-employee-name-image"
              alt=""
            />
          </Col>
          <Col
            lg={6}
            md={6}
            xs={12}
            sm={12}
            className="d-flex justify-content-start"
          >
            <label className="MontserratSemiBold-600 todo-employee-name-card">
              {employeeName}
            </label>
            <br />
            <label className="MontserratSemiBold-600 todo-employee-label-card">
              {employeeDesignation}
            </label>
          </Col>
          <Col lg={5} md={5} xs={12} sm={12} className={cardTextIconStyle}>
            <p>
              {cardIcon}
              {cardText}
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default TodoAssgineeEmployeeCard;
