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
  centered,
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
          centered={centered ?? true}
          className={className}
          dialogClassName={dialogClassName}
          fullscreen={fullscreen}
        >
          <Modal.Header
            className={`${modalHeaderClassName} ${"border-0"}`}
            closeButton={closeButton}
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

          <Modal.Footer className={`${modalFooterClassName} ${"border-0"}`}>
            {ModalFooter}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CustomModal;
