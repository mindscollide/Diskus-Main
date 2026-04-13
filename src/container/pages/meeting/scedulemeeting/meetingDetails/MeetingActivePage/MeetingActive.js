import React from "react";
import styles from "./MeetingActive.module.css";
import { Button } from "../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import Messegeblue from "../../../../../../assets/images/blue Messege.svg";
import BlueCamera from "../../../../../../assets/images/blue Camera.svg";

const MeetingActive = () => {
  const { t } = useTranslation();

  return (
    <section>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
          <Button
            text={t("Leave-meeting")}
            className={styles["LeaveMeetinButton"]}
          />
        </Col>
      </Row>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className={styles["ScrollerMeeting_Active"]}
        >
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Heading_Gray_meeting"]}>
                Departmental Meeting | Conference Room 1
              </span>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["MeetingTitle_Heading"]}>
                IT Departmental Meeting lorem. Aenean posuere libero vel ipsum
                dignissim ultricies viverra non
              </span>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["ParaGraph_SavedMeeting"]}>
                Description fits in here. Proin at malesuada lorem. Aenean
                posuere libero vel ipsum dignissim ultricies viverra non tellus.
                Fusce aliquet finibus nisl, et hendrerit nisl dignissim at.
                Praesent luctus rutrum lacinia. Nulla lacinia feugiat sagittis.
                Aenean at magna aliquet, dignissim ligula quis, ornare ante.
                Interdu et malesuada fames ac ante ipsum primis in faucibus. Ut
                diam dui, iaculis nec dui vel, commodo dapibus libero. Vivamus
                interdum purus sed pellentesque ultricies. Nullam ut nulla
                libero. Nam libero urna, pharetra et dignissim in, malesuada at
                urna. Aliquam erat volutpat. Curabitur molestie congue ipsum
                vitae luctus. Cras sed dolor eget turpis condimentum maximus et
                sit amet ipsum. Suspendisse non nulla vitae metus tincidunt
                vulputate. Aenean malesuada lacinia ipsum, vitae porta ex
                elementum ac. Nulla vestibulum cursus felis, vel molestie nibh
                mollis sit amet. Suspendisse nec dui semper, lobortis est nec,
                aliquet felis. Etiam sed odio in diam faucibus pretium.
              </span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col lg={5} md={5} sm={5}>
              <Row className="mt-1">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["NOtes_heading"]}>{t("Notes")}</span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["ParaGraph_SavedMeeting"]}>
                    Description fits in here. Proin at malesuada lorem. Aenean
                    posuere libero vel ipsum dignissim ultricies viverra non
                    tellus. Fusce aliquet finibus nisl, et hendrerit nisl
                    dignissim at. Praesent luctus rutrum lacinia. Nulla lacinia
                    feugiat sagittis. Aenean at magna aliquet, dignissim ligula
                    quis, ornare ante. Interdu et malesuada fames ac ante ipsum
                    primis in faucibus. Ut diam dui, iaculis nec dui vel,
                    commodo dapibus libero. Vivamus interdum purus sed
                    pellentesque ultricies. Nullam ut nulla libero. Nam libero
                    urna, pharetra et dignissim in, malesuada at urna.
                  </span>
                </Col>
              </Row>
            </Col>
            <Col lg={7} md={7} sm={7}>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex align-items-center gap-1"
                >
                  <img
                    src={Messegeblue}
                    height="20.44px"
                    width="25.68px"
                    alt=""
                  />
                  <img
                    src={BlueCamera}
                    height="17.84px"
                    width="27.19px"
                    alt=""
                  />
                  <span className={styles["LinkClass"]}>
                    https://meet.google.com/hak-qtiz-swr?authuser=0&pli=1
                  </span>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["NOtes_heading"]}>{t("RSVP")}</span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["RspvClassDetails"]}>
                    RSVP allowed and notify meeting organizer when members RSVP
                  </span>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col lg={6} md={6} sm={6}>
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["NOtes_heading"]}>
                        {t("Reminder-frequency")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["RspvClassDetails"]}>
                        5, 15 and 30 minutes before reminder
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} md={6} sm={6}>
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["NOtes_heading"]}>
                        {t("Recurring")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["ParaGraph_SavedMeeting"]}>
                        Non-Recurring
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={t("Clone-meeting")}
            className={styles["Cancel_Meeting_SaveMeeting"]}
          />
          <Button
            text={t("Cancel")}
            className={styles["Cancel_Meeting_SaveMeeting"]}
          />
          <Button
            text={t("Next")}
            className={styles["Next_Meeting_SaveMeeting"]}
          />
        </Col>
      </Row>
    </section>
  );
};

export default MeetingActive;
