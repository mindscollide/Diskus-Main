import { Col, Row } from "react-bootstrap";
import styles from "./EmployeeinfoCard.module.css";
import { isBase64 } from "../../../commen/functions/validations";

const EmployeeinfoCard = ({
  Employeename,
  Employeeemail,
  Icon,
  EmployeePic,
}) => {
  let isBase64Pic = EmployeePic !== undefined && isBase64(EmployeePic);
  return (
    <>
      <Row>
        <Col lg={2} md={12} sm={12}>
          <img
            src={isBase64Pic ? `data:image/jpeg;base64,${EmployeePic}` : null}
            width="50px"
            height="50px"
            className="rounded-circle"
            alt=""
            draggable="false"
          />
        </Col>
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
        </Col>
      </Row>
    </>
  );
};
export default EmployeeinfoCard;
