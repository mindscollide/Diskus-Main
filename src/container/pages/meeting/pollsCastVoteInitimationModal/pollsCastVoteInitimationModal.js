import React from "react";
import styles from "./pollsCastVoteInitimationModal.module.css";
import { useSelector } from "react-redux";
import { castYourVotePollModal } from "../../../../store/actions/Polls_actions";
import { Col, Row } from "react-bootstrap";
import { Button, Modal } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
const PollsCastVoteInitimationModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const castYourVotePollModalState = useSelector(
    (state) => state.PollsReducer.castPollVoteModal
  );
  console.log(castYourVotePollModalState, )
  const newPollMeeting = useSelector(
    (state) => state.PollsReducer.newPollMeeting
  );
  console.log(
    castYourVotePollModal,
    newPollMeeting,
    "PollsCastVoteInitimationModal"
  );
  return (
    <Modal
      show={castYourVotePollModalState}
      setShow={dispatch(castYourVotePollModal)}
      modalFooterClassName={"d-block"}
      modalHeaderClassName={"d-block"}
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
                {t("Voting-for-the-agenda-of-the-meeting-has-now-started")}
              </span>
              <span className={styles["MeetingTitleSubheading"]}>
                {t("Meeting-title")}&nbsp;:&nbsp;
                <span className={styles["meetingTitleInnerSpan"]}>
                  {/* {AgendaVotingModalStartedData.meetingTitle} */}
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
                // onClick={handleDiscardFunction}
              />
              <Button
                text={t("Cast-your-vote")}
                className={styles["CastVoteButtonVotingStartedModal"]}
                // onClick={handleCastYourAgendaVoteBtn}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default PollsCastVoteInitimationModal;
