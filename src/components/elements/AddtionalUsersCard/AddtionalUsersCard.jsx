import { Col, Row } from "react-bootstrap";
import styles from "./AddtionalUsersCard.module.css";

/**
 * @component AddtionalUserCard
 * @description Displays a compact card for an additional (external or guest) user,
 * showing their name, email, and an action icon. Typically used in participant/attendee
 * lists where extra users beyond the core team are shown. The profile picture prop is
 * accepted but not rendered in this component's current layout.
 *
 * @param {string} props.Employeename - Full name of the additional user.
 * @param {string} props.Employeeemail - Email address of the additional user.
 * @param {React.ReactNode} props.Icon - An icon element (e.g. a remove/add button)
 *   displayed to the right of the user's info.
 * @param {string} [props.EmployeePic] - Base64-encoded profile picture string
 *   (accepted but not rendered in the current implementation).
 *
 * @example
 * <AddtionalUserCard
 *   Employeename="Jane Smith"
 *   Employeeemail="jane@example.com"
 *   Icon={<RemoveIcon />}
 * />
 */
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
        </Col>
      </Row>
    </>
  );
};
export default AddtionalUserCard;
