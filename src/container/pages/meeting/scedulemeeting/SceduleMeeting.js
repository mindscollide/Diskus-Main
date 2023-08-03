import React, { useState } from "react";
import styles from "./SceduleMeeting.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import {
  Button,
  TextField,
  Loader,
  Notification,
} from "../../../../components/elements";
import MeetingDetails from "./meetingDetails/MeetingDetails";
const SceduleMeeting = ({ setSceduleMeeting }) => {
  const { t } = useTranslation();
  const [meetingDetails, setmeetingDetails] = useState(false);

  const showMeetingDeitals = () => {
    setmeetingDetails(true);
  };
  return (
    <section>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["Scedule_newMeeting_Heading"]}>
            {t("Schedule-new-meeting")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["Scedule_meeting_paper"]}>
            <Row>
              <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                <Button
                  text={t("Meeting-details")}
                  className={styles["Schedule_meetings_options"]}
                  onClick={showMeetingDeitals}
                />
                <Button
                  text={t("Organizers")}
                  className={styles["Schedule_meetings_options"]}
                />
                <Button
                  text={t("Agenda-contributors")}
                  className={styles["Schedule_meetings_options"]}
                />
                <Button
                  text={t("Participants")}
                  className={styles["Schedule_meetings_options"]}
                />
                <Button
                  text={t("Agenda")}
                  className={styles["Schedule_meetings_options"]}
                />
                <Button
                  text={t("Meeting-material")}
                  className={styles["Schedule_meetings_options"]}
                />
                <Button
                  text={t("Minutes")}
                  className={styles["Schedule_meetings_options"]}
                />
                <Button
                  text={t("Actions")}
                  className={styles["Schedule_meetings_options"]}
                />
                <Button
                  text={t("Polls")}
                  className={styles["Schedule_meetings_options"]}
                />
              </Col>
            </Row>
            {meetingDetails ? <MeetingDetails /> : null}
          </Paper>
        </Col>
      </Row>
    </section>
  );
};

export default SceduleMeeting;
