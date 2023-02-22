// import { keyboard } from "@testing-library/user-event/dist/types/keyboard";
import setRecentActivity from "react";
import Modal from "react-bootstrap/Modal";
import "./Modal.css";

const CustomModal = ({
  ModalTitle,
  ModalBody,
  ModalFooter,
  show,
  setShow,
  onHide,
  size,
  backdrop,
  modalBodyClassName,
  modalParentClass,
  modalFooterClassName,
  modalHeaderClassName,
  className,
}) => {
  // const [show, setShow] = useState(false);
  // console.log("viewmodalo", show);

  const handleClose = () => {
    // console.log("viewmodalo", show);
    setShow(false);
  };

  // console.log("modalTitle", ModalTitle);

  // console.log("modalBody", ModalBody);

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow} data-tut="meetingbtn" >
        {ButtonTitle}
      </Button> */}
      <div className={modalParentClass}>
        <Modal
          show={show}
          onHide={onHide}
          backdrop={backdrop}
          data-backdrop="false"
          size={size}
          centered={true}
          className={className}
        >
          <Modal.Header
            className={modalHeaderClassName}
            closeButton
            onClick={() => setShow(false)}
          >
            <Modal.Title>{ModalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body className={modalBodyClassName}>{ModalBody}</Modal.Body>
          <Modal.Footer className={modalFooterClassName}>
            {ModalFooter}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CustomModal;
