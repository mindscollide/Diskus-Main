import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Loader, Modal } from "../../../../../components/elements";
import { openPaymentProcessModal } from "../../../../../store/actions/UserMangementModalActions";

const OpenPaymentForm = () => {
  const dispatch = useDispatch();
  const [sourceLink, setSourceLink] = useState(null);

  const UserManagementModalspaymentProcessModalData = useSelector(
    (state) => state.UserManagementModals.paymentProcessModal
  );

  const UserMangementReducerpaymentInitiateDataData = useSelector(
    (state) => state.UserMangementReducer.paymentInitiateData
  );

  const UserManagementModalsLoadingData = useSelector(
    (state) => state.UserManagementModals.Loading
  );

  useEffect(() => {
    try {
      if (UserMangementReducerpaymentInitiateDataData !== null) {
        let apiResponse = UserMangementReducerpaymentInitiateDataData;
        setSourceLink(apiResponse.paymentRedirectionLink);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [UserMangementReducerpaymentInitiateDataData]);

  const onCloseModal = () => {
    dispatch(openPaymentProcessModal(false));
  };

  return (
    <>
      <Container>
        <Modal
          show={UserManagementModalspaymentProcessModalData}
          setShow={dispatch(openPaymentProcessModal)}
          size="lg"
          onHide={onCloseModal}
          ModalBody={
            <>
              {sourceLink !== null && (
                <iframe
                  id="paymentFrame"
                  width="100%"
                  height="550px"
                  src={sourceLink}
                  sandbox="allow-scripts allow-same-origin allow-top-navigation allow-forms"
                ></iframe>
              )}
            </>
          }
        />
      </Container>
      {UserManagementModalsLoadingData ? <Loader /> : null}
    </>
  );
};

export default OpenPaymentForm;
