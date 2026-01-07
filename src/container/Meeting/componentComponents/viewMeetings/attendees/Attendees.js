import React, { useEffect, useState } from "react";
import styles from "./Attendees.module.css";
import { Col, Row } from "react-bootstrap";
import AttendeesCard from "../../../../../components/elements/attendeesCard/AttendeesCard";
import { Button } from "../../../../../components/elements";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LeaveCurrentMeeting,
  getAllMeetingUsersRSVPApi,
  searchNewUserMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../../store/actions/NewMeetingActions";
import { useSelector } from "react-redux";
import { getCurrentDateTimeUTC } from "../../../../../commen/functions/date_formater";
import { useMeetingContext } from "../../../../../context/MeetingContext";
import { convertToArabicNumerals } from "../../../../../commen/functions/regex";

const Attendees = () => {
  const dispatch = useDispatch();
  const [organizersData, setOrganizersData] = useState([]);
  const [participantsData, setParticipantsData] = useState([]);
  const [agendaContributorsData, setAgendaContributorsData] = useState([]);
  const {
    editorRole,
    setEditorRole,
    advanceMeetingModalID,
    setViewAdvanceMeetingModal,
    setAttendees,
  } = useMeetingContext();

  const [Attending, setAttending] = useState(0);
  const [mayBe, setMayBe] = useState(0);
  const [notAttending, setNotAttending] = useState(0);
  const [notResponded, setNotResponded] = useState(0);
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");
  const { getMeetingUsersRSVP } = useSelector(
    (state) => state.NewMeetingreducer
  );
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("AdvanceMeetingOperations")) === true) {
      let NotificationClickMeetingID = localStorage.getItem(
        "NotificationAdvanceMeetingID"
      );
      let MeetingData = { MeetingID: Number(NotificationClickMeetingID) };
      dispatch(getAllMeetingUsersRSVPApi(navigate, t, MeetingData));
    } else {
      let MeetingData = { MeetingID: Number(advanceMeetingModalID) };
      dispatch(getAllMeetingUsersRSVPApi(navigate, t, MeetingData));
    }
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

  const handleCancelAttendees = () => {
    if (JSON.parse(localStorage.getItem("AdvanceMeetingOperations")) === true) {
      localStorage.removeItem("AdvanceMeetingOperations");
      localStorage.removeItem("NotificationAdvanceMeetingID");
      let searchData = {
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber:
          meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
        PublishedMeetings:
          currentView && Number(currentView) === 1 ? true : false,
      };
      console.log("chek search meeting");
      dispatch(searchNewUserMeeting(navigate, searchData, t));
      localStorage.removeItem("folderDataRoomMeeting");
      setEditorRole({ status: null, role: null });
      setViewAdvanceMeetingModal(false);
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      setAttendees(false);
    } else {
      if (editorRole.status === 10 || editorRole.status === "10") {
        let leaveMeetingData = {
          FK_MDID: Number(advanceMeetingModalID),
          DateTime: getCurrentDateTimeUTC(),
        };
        dispatch(
          LeaveCurrentMeeting(
            navigate,
            t,
            leaveMeetingData,
            false,
            false,
            setEditorRole,
            advanceMeetingModalID,
            false
          )
        );
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
        localStorage.removeItem("AdvanceMeetingOperations");
        localStorage.removeItem("NotificationAdvanceMeetingID");
      } else {
        let searchData = {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(userID),
          PageNumber:
            meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
          Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
          PublishedMeetings:
            currentView && Number(currentView) === 1 ? true : false,
        };
        console.log("chek search meeting");
        dispatch(searchNewUserMeeting(navigate, searchData, t));
        localStorage.removeItem("folderDataRoomMeeting");
        setEditorRole({ status: null, role: null });
        setViewAdvanceMeetingModal(false);
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
        dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      }
      setAttendees(false);
    }
  };
  let currentLanauge = localStorage.getItem("i18nextLng");
  return (
    <Row>
      <Col sm={12} md={12} lg={12} className={` ${"my-2"}`}>
        <section className={styles["Attendees_bar"]}>
          <Row>
            <Col
              sm={12}
              md={3}
              lg={3}
              className={
                currentLanauge === "ar"
                  ? styles["AttendingBox_Ar"]
                  : styles["AttendingBox"]
              }>
              <span className={styles["AttendeesCount_Attending"]}>
                {Attending < 10
                  ? convertToArabicNumerals(`0${Attending}`)
                  : convertToArabicNumerals(`${Attending}`)}
              </span>
              <span className={styles["AttendeesCount_Attending_tagline"]}>
                {t("Attending")}
              </span>
            </Col>
            <Col
              sm={12}
              md={3}
              lg={3}
              className={
                currentLanauge === "ar"
                  ? styles["AttendingBox_Ar"]
                  : styles["AttendingBox"]
              }>
              <span className={styles["AttendeesCount_Maybe"]}>
                {" "}
                {mayBe < 10 ? convertToArabicNumerals(`0${mayBe}`) : convertToArabicNumerals(mayBe)}
              </span>
              <span className={styles["AttendeesCount_Maybe_tagline"]}>
                {t("Maybe")}
              </span>
            </Col>

            <Col
              sm={12}
              md={3}
              lg={3}
              className={
                currentLanauge === "ar"
                  ? styles["AttendingBox_Ar"]
                  : styles["AttendingBox"]
              }>
              <span className={styles["AttendeesCount_NotAttending"]}>
                {" "}
                {notAttending < 10 ? convertToArabicNumerals(`0${notAttending}`) : convertToArabicNumerals(notAttending)}
              </span>
              <span className={styles["AttendeesCount_NotAttending_tagline"]}>
                {t("Not-attending")}
              </span>
            </Col>

            <Col
              sm={12}
              md={3}
              lg={3}
              className={
                currentLanauge === "ar"
                  ? styles["AttendingBox_Ar"]
                  : styles["AttendingBox"]
              }>
              <span className={styles["AttendeesCount_NotResponded"]}>
                {notResponded < 10 ? convertToArabicNumerals(`0${notResponded}`) : convertToArabicNumerals(notResponded)}
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
          <p className={styles["AttendeesAreaHeading"]}>{t("Organizers")}</p>
          <div className={styles["Cards"]}>
            {organizersData.length > 0 &&
              organizersData.map((data) => {
                return <AttendeesCard CardData={data} />;
              })}
          </div>
        </section>
        <section className={styles["Members_Area"]}>
          <p className={styles["AttendeesAreaHeading"]}>
            {t("Agenda-contributors")}
          </p>
          <div className={styles["Cards"]}>
            {agendaContributorsData.length > 0 &&
              agendaContributorsData.map((data) => {
                return <AttendeesCard CardData={data} />;
              })}
          </div>
        </section>
        <section className={styles["Members_Area"]}>
          <p className={styles["AttendeesAreaHeading"]}>{t("Participants")}</p>
          <div className={styles["Cards"]}>
            {participantsData.length > 0 &&
              participantsData.map((data) => {
                return <AttendeesCard CardData={data} />;
              })}
          </div>
        </section>
      </Col>
      {/* <Col
        sm={12}
        md={12}
        lg={12}
        className={` ${"d-flex justify-content-end align-items-center mt-2"}`}
      >
        <Button
          onClick={handleCancelAttendees}
          text={"Cancel"}
          className={styles["CancelAttendeesBtn"]}
        />
      </Col> */}
    </Row>
  );
};

export default Attendees;
