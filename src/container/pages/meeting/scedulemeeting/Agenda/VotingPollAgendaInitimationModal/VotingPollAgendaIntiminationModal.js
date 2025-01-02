import React, { useEffect } from "react";
import styles from "./VotingPollAgendaIntiminationModal.module.css";
import { useSelector } from "react-redux";
import {
  AgendaPollVotingStartedAction,
  showCastVoteAgendaModal,
} from "../../../../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GetAgendaAndVotingInfo } from "../../../../../../store/actions/MeetingAgenda_action";
const VotingPollAgendaIntiminationModal = ({
  AgendaVotingModalStartedData,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  //Global Stated for this Initmination Modal
  const votingStartedAgendaIntiminationModalState = useSelector(
    (state) => state.NewMeetingreducer.agendavotingPollStartedData
  );

  console.log(
    AgendaVotingModalStartedData,
    "AgendaVotingModalStartedDataAgendaVotingModalStartedData"
  );
  //Handle Discard Button
  const handleCastYourAgendaVoteBtn = () => {
    localStorage.setItem("CastedAgendaVoteFromIntimination", true);
    let Data = {
      MeetingID: Number(AgendaVotingModalStartedData.meetingID),
      AgendaID: AgendaVotingModalStartedData.agendaID,
      AgendaVotingID: Number(AgendaVotingModalStartedData.votingID),
    };
    dispatch(GetAgendaAndVotingInfo(Data, navigate, t));
  };

  const handleDiscardFunction = () => {
    dispatch(AgendaPollVotingStartedAction(false));
  };

  return (
    <section>
      <Modal
        show={votingStartedAgendaIntiminationModalState}
        setShow={dispatch(AgendaPollVotingStartedAction)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        centered={false}
        className={styles["MainVotingPollStartedParentClass"]}
        onHide={() => {
          dispatch(AgendaPollVotingStartedAction(false));
        }}
        size={"xl"}
        ModalBody={
          <>
            <Row>
              <Col
                lg={8}
                md={8}
                sm={8}
                className="d-flex flex-column flex-wrap"
              >
                <span className={styles["VotingStartedModalheading"]}>
                  {t("Voting-for-the-agenda-of-the-meeting-has-now-started")}
                </span>
                <span className={styles["MeetingTitleSubheading"]}>
                  {t("Meeting-title")}&nbsp;:&nbsp;
                  <span className={styles["meetingTitleInnerSpan"]}>
                    IT Department Meeting
                  </span>
                </span>
              </Col>
              <Col
                lg={4}
                md={4}
                sm={4}
                className="d-flex gap-3 align-items-center justify-content-center"
              >
                <Button
                  text={t("Discard")}
                  className={styles["DiscardButtonVotingStartedModal"]}
                  onClick={handleDiscardFunction}
                />
                <Button
                  text={t("Cast-your-vote")}
                  className={styles["CastVoteButtonVotingStartedModal"]}
                  onClick={handleCastYourAgendaVoteBtn}
                />
              </Col>
            </Row>
          </>
        }
        ModalFooter={<></>}
      />
    </section>
  );
};

export default VotingPollAgendaIntiminationModal;
