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
          <Col
            lg={1}
            md={1}
            sm={12}
            xs={12}
            className="p-0"
          >
            <img src={userImage} className="todo-employee-name-image" />
          </Col>
          <Col lg={6} md={6} xs={12} sm={12}>
            <label className="todo-employee-name-card">{employeeName}</label>
            <br />
            <label className="todo-employee-label-card">
              {employeeDesignation}
            </label>
          </Col>
          <Col lg={5} md={5} xs={12} sm={5} className={cardTextIconStyle}>
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
