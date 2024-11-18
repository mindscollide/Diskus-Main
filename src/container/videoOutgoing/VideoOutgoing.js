import styles from "./VideoOutgoing.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { Button } from "../../components/elements";
import videoEndIcon from "../../assets/images/newElements/VideoEndIcon.png";
import videoAvatar from "../../assets/images/newElements/VideoAvatar.png";

const VideoOutgoing = () => {
  return (
    <Container className={styles["videoOutgoing"]}>
      <Row className="mt-5">
        <Col sm={12} md={12} lg={12} className={styles["avatar-column"]}>
          <img src={videoAvatar} width={150} alt="" />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col sm={12} md={12} lg={12} className={styles["outgoing-title"]}>
          <p className={styles["outgoing-call-text"]}>Talha Qamar</p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col sm={12} md={12} lg={12} className={styles["calling-title"]}>
          <p className={styles["Ringing-text"]}>Ringing...</p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col sm={12} md={12} lg={12} className="d-flex justify-content-center">
          <Button
            className={styles["button-img"]}
            icon={
              <>
                <img src={videoEndIcon} width={50} alt="" />
              </>
            }
          ></Button>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoOutgoing;
