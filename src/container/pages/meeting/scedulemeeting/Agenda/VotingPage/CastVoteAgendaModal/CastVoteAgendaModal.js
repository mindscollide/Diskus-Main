import React, { useState, useEffect } from "react";
import styles from "./CastVoteAgendaModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../../../components/elements";
import { showCastVoteAgendaModal } from "../../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import { Radio } from "antd";
import {
  CasteVoteForAgenda,
  GetAgendaAndVotingInfo,
} from "../../../../../../../store/actions/MeetingAgenda_action";

const CastVoteAgendaModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const castVoteAgendaPage = useSelector(
    (state) => state.NewMeetingreducer.castVoteAgendaPage
  );
  const AgendaVotingInfoData = useSelector(
    (state) => state.MeetingAgendaReducer.AgendaVotingInfoData
  );
  let currentUserID = Number(localStorage.getItem("userID"));

  const [castVoteData, setCastVoteData] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (
      AgendaVotingInfoData !== undefined &&
      AgendaVotingInfoData !== null &&
      AgendaVotingInfoData.length !== 0
    ) {
      setCastVoteData(AgendaVotingInfoData);
    } else {
      setCastVoteData([]);
    }
  }, [AgendaVotingInfoData]);

  const handleRadioChange = (e) => {
    const selectedAnswerID = e.target.value;
    const selectedObject = castVoteData.votingAnswers.find(
      (votingAnswer) => votingAnswer.votingAnswerID === selectedAnswerID
    );
    setSelectedAnswer(selectedObject);

    console.log("selectedAnswer", selectedAnswer);
  };

  const castVoteHandler = () => {
    let Data = {
      AgendaID: "1222",
      AgendaVotingID: 1,
      Votes: [
        {
          UserID: currentUserID,
          SelectedAnswerID: selectedAnswer.votingAnswerID,
        },
      ],
    };
    dispatch(CasteVoteForAgenda(Data, navigate, t));
    dispatch(showCastVoteAgendaModal(false));
  };

  console.log("Cast Vote Data", castVoteData);

  return (
    <section>
      <Modal
        show={castVoteAgendaPage}
        setShow={dispatch(showCastVoteAgendaModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showCastVoteAgendaModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["IntroHeading"]}>
                  {castVoteData.agendaTitle}
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["MainHeading"]}>
                  {castVoteData.voteQuestion}
                </span>
              </Col>
            </Row>
            {castVoteData !== null &&
            castVoteData !== undefined &&
            castVoteData.length !== 0
              ? castVoteData.votingAnswers.map((votingAnswerData, index) => (
                  <Row key={index} className="mt-3">
                    <Col
                      lg={1}
                      md={1}
                      sm={1}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <Radio
                        value={votingAnswerData.votingAnswerID}
                        onChange={handleRadioChange}
                        checked={
                          selectedAnswer &&
                          selectedAnswer.votingAnswerID ===
                            votingAnswerData.votingAnswerID
                        }
                      />
                    </Col>
                    <Col lg={11} md={11} sm={11}>
                      <section className={styles["outerboxForOptions"]}>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <span className={styles["AnswerStyles"]}>
                              {votingAnswerData.votingAnswer}
                            </span>
                          </Col>
                        </Row>
                      </section>
                    </Col>
                  </Row>
                ))
              : null}
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Cancel")}
                  className={styles["Cast_vote_CancelButton"]}
                  onClick={() => {
                    dispatch(showCastVoteAgendaModal(false));
                  }}
                />
                <Button
                  text={t("Save")}
                  className={styles["Cast_vote_SaveButton"]}
                  onClick={castVoteHandler}
                />
              </Col>
            </Row>
          </>
        }
        size={"md"}
      />
    </section>
  );
};

export default CastVoteAgendaModal;
