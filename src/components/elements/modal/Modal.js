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
  htmlCode,
}) => {
  return (
    <>
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
          {htmlCode !== "" && htmlCode !== null && htmlCode !== undefined ? (
            <Modal.Body
              dangerouslySetInnerHTML={{
                __html: htmlCode !== "" ? htmlCode : null,
              }}
              className={modalBodyClassName}
            >
              {ModalBody}
            </Modal.Body>
          ) : (
            <Modal.Body className={modalBodyClassName}>{ModalBody}</Modal.Body>
          )}

          <Modal.Footer className={modalFooterClassName}>
            {ModalFooter}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CustomModal;
