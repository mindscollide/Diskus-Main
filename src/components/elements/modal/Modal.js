// import { keyboard } from "@testing-library/user-event/dist/types/keyboard";
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
  closeButton,
  dialogClassName,
  modalTitleClassName,
  fullscreen,
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
          dialogClassName={dialogClassName}
          fullscreen={fullscreen}
        >
          <Modal.Header
            className={modalHeaderClassName}
            closeButton={closeButton}
            // onClick={() => setShow(false)}
          >
            <Modal.Title className={modalTitleClassName}>
              {ModalTitle}
            </Modal.Title>
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
