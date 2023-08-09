import React from "react";
import styles from "./AgendaItemRemovedModal.module.css";
import {
  Modal,
  Button,
  TextField,
  Checkbox,
} from "../../../../../../components/elements";
import { showAgenItemsRemovedModal } from "../../../../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
const AgenItemremovedModal = ({
  setSubAjendaRows,
  subAjendaRows,
  agendaItemRemovedIndex,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);

  const handleYesButton = (agendaItemRemovedIndex) => {
    let optionscross = [...subAjendaRows];
    optionscross.splice(agendaItemRemovedIndex, 1);
    setSubAjendaRows(optionscross);
    dispatch(showAgenItemsRemovedModal(false));
  };
  console.log(handleYesButton, "handleYesButtonhandleYesButton");
  return (
    <section>
      <Modal
        show={NewMeetingreducer.agendaItemRemoved}
        setShow={dispatch(showAgenItemsRemovedModal)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showAgenItemsRemovedModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["Agenda_items_removed_heading"]}>
                  {t("The-agenda-item-will-be")}
                </span>
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["Agenda_items_removed_heading"]}>
                  {t("removed-Continue")}
                </span>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center gap-2"
              >
                <Button
                  text={t("Discard")}
                  className={styles["Discard_Btn_Agendaremovel"]}
                  onClick={() => {
                    dispatch(showAgenItemsRemovedModal(false));
                  }}
                />
                <Button
                  text={t("Proceed")}
                  className={styles["Proceed_Btn_Agendaremovel"]}
                  onClick={() => {
                    handleYesButton(agendaItemRemovedIndex);
                  }}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default AgenItemremovedModal;
