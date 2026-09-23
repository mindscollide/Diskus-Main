import Modal from "react-bootstrap/Modal";
import "./Modal.css";
import CrossIcon from "../../../assets/images/Cross_Icon.png";
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
  contentClassName,
  centered,
}) => {
  return (
    <>
      <div className={modalParentClass}>
        <Modal
          show={show}
          onHide={onHide}
          backdrop={backdrop}
          data-backdrop='false'
          size={size}
          centered={centered ?? true}
          className={className}
          dialogClassName={dialogClassName}
          fullscreen={fullscreen}
          contentClassName={contentClassName}>
          <Modal.Header
            className={`${modalHeaderClassName} ${"border-0"}`}
            dir='rtl'>
            {localStorage.getItem("i18nextLng") === "en" ? (
              <>
                   {closeButton && <img src={CrossIcon} alt='' onClick={onHide} />}
                <Modal.Title className={modalTitleClassName}>
                  {ModalTitle}
                </Modal.Title>
           
              </>
            ) : (
              <>
                <Modal.Title className={modalTitleClassName}>
                  {ModalTitle}
                </Modal.Title>
                {closeButton && <img src={CrossIcon} onClick={onHide} alt='' /> }{" "}
              </>
            )}
          </Modal.Header>
          {htmlCode !== "" && htmlCode !== null && htmlCode !== undefined ? (
            <Modal.Body
              dangerouslySetInnerHTML={{
                __html: htmlCode !== "" ? htmlCode : null,
              }}
              className={modalBodyClassName}>
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
