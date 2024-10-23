import styles from "./VideoScreens.module.css";
import { Container, Row, Col } from "react-bootstrap";

import ProfileAvatar from "../../assets/images/newElements/profileAvatar.svg";

const VideoScreens = ({ show, setShow, ModalTitle }) => {
  return (
    <>
      <Container>
        <Row className="mt-3">
          <Col
            lg={5}
            md={5}
            sm={5}
            className={styles["avatar-background-screens"]}
          >
            <img src={ProfileAvatar} width={140} alt="" />
          </Col>
          <Col lg={1} md={1} sm={1} />
          <Col
            lg={5}
            md={5}
            sm={5}
            className={styles["avatar-background-screens"]}
          >
            <img src={ProfileAvatar} width={140} alt="" />
          </Col>
          <Col lg={1} md={1} sm={1} />
        </Row>

        <Row className="mt-3">
          <Col
            lg={5}
            md={5}
            sm={5}
            className={styles["avatar-background-screens"]}
          >
            <img src={ProfileAvatar} width={140} alt="" />
          </Col>
          <Col lg={1} md={1} sm={1} />
          <Col
            lg={5}
            md={5}
            sm={5}
            className={styles["avatar-background-screens"]}
          >
            <img src={ProfileAvatar} width={140} alt="" />
          </Col>
          <Col lg={1} md={1} sm={1} />
        </Row>
      </Container>
    </>
  );
};

export default VideoScreens;
