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
      <Row className='d-flex justify-content-start align-items-center my-2'>
        <Col
          lg={6}
          md={6}
          sm={6}
          xs={12}
          className='d-flex justify-content-start gap-1 align-items-center'>
          <img
            src={`data:image/jpeg;base64,${userImage}`}
            className='todo-employee-name-image'
            alt=''
            draggable='false'
          />
          <span>
            <label className=' todo-employee-name-card'>{employeeName}</label>
            <br />
            <label className=' todo-employee-label-card'>
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
