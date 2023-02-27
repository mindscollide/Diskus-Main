import { useTour } from "@reactour/tour";
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./onBoard_Modal.css";
import { useSelector, useDispatch } from "react-redux";
import {
  showModalOnboard,
  showIsDetailOnboard,
  showModalStepsOnboard,
} from "../../../store/actions/OnBoardStates";
const CustomOnboardModal = ({
  ModalTitle,
  ModalBody,
  ModalFooter,
  ButtonTitle,
  show,
  size,
  datatut,
}) => {
  const { currentStep, setCurrentStep } = useTour();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { OnBoardModal } = state;
  console.log("OnBoardModalOnBoardModalOnBoardModal", OnBoardModal.show);
  // const [show, setShow] = useState(false);
  const handleShow = () => {
    console.log("modalTitle", show);
    dispatch(showModalStepsOnboard(true));
    setCurrentStep(3);
    // setShow(true);
    dispatch(showIsDetailOnboard(true));
    dispatch(showModalOnboard(true));
  };

  console.log("modalTitle", show);

  console.log("modalBody", ModalBody);

  return (
    <>
      {currentStep === 2 ? (
        <Button
          onClick={handleShow}
          data-tut="meetingbtn"
          className="newMeetingBtn"
          disabled={false}
        >
          {ButtonTitle}
        </Button>
      ) : null}

      <Modal
        show={OnBoardModal.show}
        className="onboard-modal"
        // onHide={handleClose}
        size={size}
        data-tut={datatut}
        data-backdrop="false"
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>{ModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{ModalBody}</Modal.Body>
        <Modal.Footer>{ModalFooter}</Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomOnboardModal;
