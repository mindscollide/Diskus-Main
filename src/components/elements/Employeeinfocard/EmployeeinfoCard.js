import { Col, Row, Container } from "react-bootstrap";
import userImage from "./../../../assets/images/user.png";
import newprofile from "../../../assets/images/newprofile.png";
import thumbsup from "../../../assets/images/thumbsup.svg";
import styles from "./EmployeeinfoCard.module.css";

const EmployeeinfoCard = ({
  Employeename,
  Employeeemail,   
  Icon,
  EmployeePic,
}) => {
  return (
    <>
      <Row>
        <Col lg={2} md={12} sm={12}>
          <img
            src={`data:image/jpeg;base64,${EmployeePic}`}
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
          {/* <img src={thumbsup} width="20px" height="20px" /> */}
        </Col>
      </Row>
    </>
  );
};
export default EmployeeinfoCard;
