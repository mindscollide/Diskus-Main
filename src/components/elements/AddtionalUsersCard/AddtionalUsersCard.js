import { Col, Row } from "react-bootstrap";
import styles from "./AddtionalUsersCard.module.css";

const AddtionalUserCard = ({
  Employeename,
  Employeeemail,
  Icon,
  EmployeePic,
}) => {
  return (
    <>
      <Row>
        <Col lg={7} md={12} sm={12} className={styles["Lineheight"]}>
          <Row className="mt-1">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["name_participant"]}>{Employeename}</span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["email_participant"]}>
                {Employeeemail}
              </span>
            </Col>
          </Row>
        </Col>
        <Col
          lg={2}
          md={12}
          sm={12}
          className="d-flex justify-content-start align-items-center"
        >
          <span>{Icon}</span>
          {/* <img src={thumbsup} width="20px" height="20px" /> */}
        </Col>
      </Row>
    </>
  );
};
export default AddtionalUserCard;
