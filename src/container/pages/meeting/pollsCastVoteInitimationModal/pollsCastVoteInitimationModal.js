import React, { useEffect, useState } from "react";
import styles from "./pollsCastVoteInitimationModal.module.css";
import { useSelector } from "react-redux";
import {
  castYourVotePollModal,
  setCastVoteID,
} from "../../../../store/actions/Polls_actions";
import { Col, Row } from "react-bootstrap";
import { Button, Modal } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
} from "../../../../store/actions/VideoFeature_actions";
const PollsCastVoteInitimationModal = ({
  setAgenda,
  setParticipants,
  setAgendaContributors,
  setorganizers,
  setmeetingDetails,
  setMinutes,
  setactionsPage,
  setAttendance,
  setPolls,
  setMeetingMaterial,
  setAttendees,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [pollDetails, setPollDetails] = useState(null);
  const castYourVotePollModalState = useSelector(
    (state) => state.PollsReducer.castPollVoteModal
  );
  console.log(castYourVotePollModalState);
  const newPollMeeting = useSelector(
    (state) => state.PollsReducer.newPollMeeting
  );
  console.log(newPollMeeting, "PollsCastVoteInitimationModal");

  useEffect(() => {
    try {
      if (newPollMeeting !== null) {
        let currentMeetingActive =
          localStorage.getItem("currentMeetingID") !== null
            ? Number(localStorage.getItem("currentMeetingID"))
            : 0;
        let meetingTitle =
          localStorage.getItem("meetingTitle") !== null
            ? localStorage.getItem("meetingTitle")
            : "";
        if (newPollMeeting.meetingID === currentMeetingActive) {
          let pollData = {
            title: newPollMeeting.polls.pollTitle,
            pollId: newPollMeeting.polls.pollID,
            isVoter: newPollMeeting.polls.isVoter,
            meetingTitle: meetingTitle,
          };
          setPollDetails(pollData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [newPollMeeting]);

  const handleClickCastYourVote = () => {
    try {
      dispatch(setCastVoteID(pollDetails));
      setAgenda(false);
      setParticipants(false);
      setAgendaContributors(false);
      setorganizers(false);
      setmeetingDetails(false);
      setMinutes(false);
      setactionsPage(false);
      setAttendance(false);
      setPolls(true);
      setMeetingMaterial(false);
      setAttendees(false);
      console.log(
        localStorage.getItem("isMeeting") === "true" &&
          localStorage.getItem("isMeetingVideo") === "true",
        localStorage.getItem("isMeeting") === "true",
        localStorage.getItem("isMeetingVideo") === "true",
        typeof localStorage.getItem("isMeeting") === "true",
        typeof localStorage.getItem("isMeetingVideo") === "true"
      );
      if (
        localStorage.getItem("isMeeting") === "true" &&
        localStorage.getItem("isMeetingVideo") === "true"
      ) {
        dispatch(maximizeVideoPanelFlag(false));
        dispatch(minimizeVideoPanelFlag(true));
        dispatch(normalizeVideoPanelFlag(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(pollDetails, "pollDetailspollDetailspollDetails");
  return (
    <Modal
      show={castYourVotePollModalState}
      setShow={dispatch(castYourVotePollModal)}
      modalFooterClassName={"d-none"}
      modalHeaderClassName={"d-none"}
      centered={false}
      className={styles["MainVotingPollStartedParentClass"]}
      onHide={() => {
        dispatch(castYourVotePollModal(false));
      }}
      size={"xl"}
      ModalBody={
        <>
          <Row>
            <Col lg={8} md={8} sm={8} className='d-flex flex-column flex-wrap'>
              <span className={styles["VotingStartedModalheading"]}>
              {pollDetails?.title}
              </span>
              <span className={styles["MeetingTitleSubheading"]}>
                {/* `${}: ` */}
                {`${t("Meeting-title")} : `}
                <span className={styles["meetingTitleInnerSpan"]}>
                  {pollDetails?.meetingTitle}
                </span>
              </span>
            </Col>
            <Col
              lg={4}
              md={4}
              sm={4}
              className='d-flex gap-3 align-items-center justify-content-center'>
              <Button
                text={t("Discard")}
                className={styles["DiscardButtonVotingStartedModal"]}
                onClick={() => dispatch(castYourVotePollModal(false))}
              />
              <Button
                text={t("Cast-your-vote")}
                className={styles["CastVoteButtonVotingStartedModal"]}
                onClick={handleClickCastYourVote}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default PollsCastVoteInitimationModal;
