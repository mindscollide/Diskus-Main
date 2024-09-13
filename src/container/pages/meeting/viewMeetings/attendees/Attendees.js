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
  const [barStatsValue, setBarStatsValue] = useState({
    attending: 0,
    mayBe: 0,
    notAttending: 0,
  });
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
      } catch (error) {}
    }
  }, [getMeetingUsersRSVP]);
  return (
    <Row>
      <Col sm={12} md={12} lg={12} className={` ${"my-2"}`}>
        <section className={styles["Attendees_bar"]}></section>
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
                return <AttendeesCard CardData={data}/>;
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
