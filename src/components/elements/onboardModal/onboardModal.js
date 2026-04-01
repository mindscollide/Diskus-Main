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
/**
 * @component CustomOnboardModal
 * @description Provides an onboarding modal tied to the React Tour walkthrough flow.
 * When the tour is at step index 2, a trigger button labelled with `ButtonTitle` is
 * rendered. Clicking it advances the tour to step 3, marks the detail onboard state
 * as active, and opens the modal via Redux actions. The modal itself is always static
 * (non-dismissible) and its visibility is driven by the `OnBoardModal.show` Redux state.
 *
 * @param {React.ReactNode} ModalTitle - Content rendered in the modal header title.
 * @param {React.ReactNode} ModalBody - Content rendered inside the modal body.
 * @param {React.ReactNode} ModalFooter - Content rendered inside the modal footer.
 * @param {string} ButtonTitle - Label text for the trigger button shown during tour step 2.
 * @param {boolean} show - Passed through but currently only used for a console log; modal
 *   visibility is controlled by Redux (`OnBoardModal.show`).
 * @param {string} size - Bootstrap Modal size prop (e.g. `"lg"`, `"xl"`).
 * @param {string} datatut - Value for the `data-tut` attribute on the modal, used by
 *   React Tour to identify the element during the walkthrough.
 *
 * @example
 * <CustomOnboardModal
 *   ModalTitle="Create your first meeting"
 *   ModalBody={<p>Follow these steps to schedule a meeting.</p>}
 *   ModalFooter={<Button>Next</Button>}
 *   ButtonTitle="New Meeting"
 *   show={false}
 *   size="lg"
 *   datatut="onboard-meeting-modal"
 * />
 */
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

  const handleShow = () => {
    console.log("modalTitle", show);
    dispatch(showModalStepsOnboard(true));
    setCurrentStep(3);
    dispatch(showIsDetailOnboard(true));
    dispatch(showModalOnboard(true));
  };

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
