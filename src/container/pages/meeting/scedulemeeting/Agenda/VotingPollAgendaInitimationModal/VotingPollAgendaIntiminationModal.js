import React from "react";
import styles from "./VotingPollAgendaIntiminationModal.module.css";
import { useSelector } from "react-redux";
import { AgendaPollVotingStartedAction } from "../../../../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import { Modal } from "../../../../../../components/elements";
const VotingPollAgendaIntiminationModal = () => {
  const dispatch = useDispatch();
  //Global Stated for this Initmination Modal
  const votingStartedAgendaIntiminationModalState = useSelector(
    (state) => state.NewMeetingreducer.agendavotingPollStartedData
  );
  return (
    <section>
      <Modal
        show={votingStartedAgendaIntiminationModalState}
        setShow={dispatch(AgendaPollVotingStartedAction)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {}}
        size={"lg"}
        ModalBody={<></>}
        ModalFooter={<></>}
      />
    </section>
  );
};

export default VotingPollAgendaIntiminationModal;
