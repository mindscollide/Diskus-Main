import React from "react";
import styles from "./ImportPrevious.module.css";
import { Modal, Button } from "../../../../../../components/elements";
import { showImportPreviousAgendaModal } from "../../../../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const ImportPrevious = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  return (
    <section>
      <Modal
        show={NewMeetingreducer.importPreviousAgendaModal}
        setShow={dispatch(showImportPreviousAgendaModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showImportPreviousAgendaModal(false));
        }}
        size={"lg"}
      />
    </section>
  );
};

export default ImportPrevious;
