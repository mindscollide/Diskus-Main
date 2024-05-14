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
  const { UserManagementModals, UserMangementReducer } = useSelector(
    (state) => state
  );

  useEffect(() => {
    try {
      if (UserMangementReducer.paymentInitiateData !== null) {
        let apiResponse = UserMangementReducer.paymentInitiateData;
        setSourceLink(apiResponse.paymentRedirectionLink);
      }
    } catch {}
  }, [UserMangementReducer.paymentInitiateData]);

  const onCloseModal = () => {
    dispatch(openPaymentProcessModal(false));
  };

  console.log(sourceLink, "sourceLinksourceLink");

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
      {UserManagementModals.Loading ? <Loader /> : null}
    </>
  );
};

export default OpenPaymentForm;
