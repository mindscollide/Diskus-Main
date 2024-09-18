import React, { useEffect, useState } from "react";
import styles from "./Attendees.module.css";
import { Col, Row } from "react-bootstrap";
import AttendeesCard from "../../../../../components/elements/attendeesCard/AttendeesCard";
import { Button } from "../../../../../components/elements";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllMeetingUsersRSVPApi } from "../../../../../store/actions/NewMeetingActions";
import { useSelector } from "react-redux";

const Attendees = ({ MeetingID }) => {
  const dispatch = useDispatch();
  const [organizersData, setOrganizersData] = useState([]);
  const [participantsData, setParticipantsData] = useState([]);
  const [agendaContributorsData, setAgendaContributorsData] = useState([]);
  const [Attending, setAttending] = useState(0);
  const [mayBe, setMayBe] = useState(0);
  const [notAttending, setNotAttending] = useState(0);
  const [notResponded, setNotResponded] = useState(0);

  const { getMeetingUsersRSVP } = useSelector(
    (state) => state.NewMeetingreducer
  );
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    let MeetingData = { MeetingID: Number(MeetingID) };
    dispatch(getAllMeetingUsersRSVPApi(navigate, t, MeetingData));
  }, []);

  useEffect(() => {
    if (getMeetingUsersRSVP !== null) {
      try {
        const {
          organizers,
          participants,
          agendaContributors,
          awaitingCount,
          declinedCount,
          acceptedCount,
          tentativeCount,
        } = getMeetingUsersRSVP;
        setOrganizersData(organizers);
        setParticipantsData(participants);
        setAgendaContributorsData(agendaContributors);
        setAttending(acceptedCount);
        setMayBe(tentativeCount);
        setNotAttending(declinedCount);
        setNotResponded(awaitingCount);
      } catch (error) {}
    }
  }, [getMeetingUsersRSVP]);
  return (
    <Row>
      <Col sm={12} md={12} lg={12} className={` ${"my-2"}`}>
        <section className={styles["Attendees_bar"]}>
          <Row>
            <Col sm={12} md={3} lg={3} className={styles["AttendingBox"]}>
              <span className={styles["AttendeesCount_Attending"]}>
                {Attending < 10 ? `0${Attending}` : Attending}
              </span>
              <span className={styles["AttendeesCount_Attending_tagline"]}>
                {t("Attending")}
              </span>
            </Col>
            <Col sm={12} md={3} lg={3} className={styles["AttendingBox"]}>
              <span className={styles["AttendeesCount_Maybe"]}>
                {" "}
                {mayBe < 10 ? `0${mayBe}` : mayBe}
              </span>
              <span className={styles["AttendeesCount_Maybe_tagline"]}>
                {t("Maybe")}
              </span>
            </Col>

            <Col sm={12} md={3} lg={3} className={styles["AttendingBox"]}>
              <span className={styles["AttendeesCount_NotAttending"]}>
                {" "}
                {notAttending < 10 ? `0${notAttending}` : notAttending}
              </span>
              <span className={styles["AttendeesCount_NotAttending_tagline"]}>
                {t("Not-attending")}
              </span>
            </Col>

            <Col sm={12} md={3} lg={3} className={styles["AttendingBox"]}>
              <span className={styles["AttendeesCount_NotResponded"]}>
                {notResponded < 10 ? `0${notResponded}` : notResponded}
              </span>
              <span className={styles["AttendeesCount_NotResponded_tagline"]}>
                {t("Not-responded")}
              </span>
            </Col>
          </Row>
        </section>
      </Col>

      <Col
        sm={12}
        md={12}
        lg={12}
        className={`${styles["Attendees_container"]}`}>
        <section className={styles["Members_Area"]}>
          <p className={styles["AttendeesAreaHeading"]}>Organizers</p>
          {/* Organizers Data */}
          <div className={styles["Cards"]}>
            {organizersData.length > 0 &&
              organizersData.map((data) => {
                return <AttendeesCard CardData={data} />;
              })}
          </div>
        </section>
        <section className={styles["Members_Area"]}>
          <p className={styles["AttendeesAreaHeading"]}>Agenda Contributors</p>
          <div className={styles["Cards"]}>
            {agendaContributorsData.length > 0 &&
              agendaContributorsData.map((data) => {
                return <AttendeesCard CardData={data} />;
              })}
          </div>
        </section>
        <section className={styles["Members_Area"]}>
          <p className={styles["AttendeesAreaHeading"]}>Participants</p>
          <div className={styles["Cards"]}>
            {participantsData.length > 0 &&
              participantsData.map((data) => {
                return <AttendeesCard CardData={data} />;
              })}
          </div>
        </section>
      </Col>
      <Col
        sm={12}
        md={12}
        lg={12}
        className={` ${"d-flex justify-content-end align-items-center mt-2"}`}>
        <Button text={"Cancel"} className={styles["CancelAttendeesBtn"]} />
      </Col>
    </Row>
  );
};

export default Attendees;
