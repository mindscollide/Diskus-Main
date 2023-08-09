import React from "react";
import styles from "./AdvancePermissionModal.module.css";
import { Modal, Button } from "../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showAdvancePermissionModal } from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
const AdvancePersmissionModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  return (
    <section>
      <Modal
        show={NewMeetingreducer.advancePermissionModal}
        setShow={dispatch(showAdvancePermissionModal)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showAdvancePermissionModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}></Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default AdvancePersmissionModal;
