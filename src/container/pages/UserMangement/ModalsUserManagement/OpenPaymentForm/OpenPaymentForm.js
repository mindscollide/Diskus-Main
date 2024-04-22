import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Loader, Modal } from "../../../../../components/elements";

const OpenPaymentForm = ({
  openPaymentModal,
  setOpenPaymentModal,
  sourceLink,
}) => {
  // const { UserManagementModals } = useSelector((state) => state);

  const onCloseModal = () => {
    setOpenPaymentModal(false);
  };

  return (
    <>
      <Container>
        <Modal
          show={openPaymentModal}
          setShow={setOpenPaymentModal}
          size="lg"
          onHide={onCloseModal}
          ModalBody={
            <>
              {sourceLink !== null && (
                <iframe width={"100%"} height="550px" src={sourceLink}></iframe>
              )}
            </>
          }
        />
      </Container>
    </>
  );
};

export default OpenPaymentForm;
