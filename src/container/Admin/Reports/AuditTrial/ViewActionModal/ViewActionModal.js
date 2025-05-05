import React from "react";
import styles from "./ViewActionModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../../../components/elements";
import { useSelector } from "react-redux";
import { AuditTrialViewActionModal } from "../../../../../store/actions/Admin_Organization";
const ViewActionModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ViewActionModalGlobalState = useSelector(
    (state) => state.adminReducer.auditTrialViewActionModal
  );

  return (
    <div>
      <Modal
        show={ViewActionModalGlobalState}
        setShow={dispatch(AuditTrialViewActionModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(AuditTrialViewActionModal(false));
        }}
        size={"md"}
        ModalBody={<></>}
        ModalFooter={<></>}
      />
    </div>
  );
};

export default ViewActionModal;
