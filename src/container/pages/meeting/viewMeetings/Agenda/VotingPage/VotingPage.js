import React from "react";
import styles from "./VotingPage.module.css";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../../../../../components/elements";
import dropmdownblack from "../../../../../../assets/images/whitedown.png";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ViewVoteModal from "./ViewVoteModal/ViewVoteModal";
import { useSelector } from "react-redux";
import {
  showCastVoteAgendaModal,
  showviewVotesAgenda,
} from "../../../../../../store/actions/NewMeetingActions";
// import CastVoteAgendaModal from "./CastVoteAgendaModal/CastVoteAgendaModal";

const VotingPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);

  const EnableViewVoteModal = () => {
    dispatch(showviewVotesAgenda(true));
  };

  const EnableCastVoteModal = () => {
    dispatch(showCastVoteAgendaModal(true));
  };
  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["ScrollerForVotes"]}>
          <Row className="mt-3">
            <Col lg={12} md={12} sm={12}>
              <section className={styles["OuterBoxForVoting"]}>
                <Row className="mt-3">
                  <Col lg={9} md={9} sm={9}>
                    <span className={styles["HeadingVotes"]}>
                      1. Get new computers from Techno City Mall. Also, Get a
                      new graphics card for the desgraphics card for the desew
                      computers from Techno City Mall. Also, Get
                    </span>
                  </Col>
                  <Col
                    lg={3}
                    md={3}
                    sm={3}
                    className="d-flex gap-2 align-items-center"
                  >
                    {/* <Button
                      text={t("End-voting")}
                      className={styles["EndVotingButton"]}
                    /> */}

                    <Button
                      text={t("Cast-your-vote")}
                      className={styles["CastYourVoteButton"]}
                      onClick={EnableCastVoteModal}
                    />

                    {/* <Button
                      text={t("Start-voting")}
                      className={styles["startVotingButton"]}
                    /> */}
                    <Button
                      text={t("View-votes")}
                      className={styles["ViewVoteButton"]}
                      onClick={EnableViewVoteModal}
                    />
                    <img src={dropmdownblack} width="18.4px" height="9.2px" />
                  </Col>
                </Row>
              </section>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col
          lg={12}
          sm={12}
          md={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button text={t("Cancel")} className={styles["Cancel_button"]} />
          <Button text={t("Next")} className={styles["Next_button"]} />
        </Col>
      </Row>
      {NewMeetingreducer.viewVotesAgenda && <ViewVoteModal />}
    </section>
  );
};

export default VotingPage;
