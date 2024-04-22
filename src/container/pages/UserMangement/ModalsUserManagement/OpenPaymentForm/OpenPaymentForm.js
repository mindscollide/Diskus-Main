import React from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Loader, Modal } from "../../../../../components/elements";
import { openPaymentProcessModal } from "../../../../../store/actions/UserMangementModalActions";

const OpenPaymentForm = ({ sourceLink }) => {
  const dispatch = useDispatch();
  const { UserManagementModals } = useSelector((state) => state);

  const onCloseModal = () => {
    dispatch(openPaymentProcessModal(false));
  };

  return (
    <>
      <Container>
        <Modal
          show={UserManagementModals.paymentProcessModal}
          setShow={dispatch(openPaymentProcessModal)}
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
