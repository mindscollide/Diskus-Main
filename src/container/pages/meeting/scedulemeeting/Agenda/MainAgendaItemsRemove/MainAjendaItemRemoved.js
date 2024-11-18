import React from "react";
import { Modal, Button } from "../../../../../../components/elements";
import styles from "./MainAjendaItemItemRemoved.module.css";
import { showMainAgendaItemRemovedModal } from "../../../../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
const MainAjendaItemRemoved = ({
  setRows,
  rows,
  mainAgendaRemovalIndex,
  setMainAgendaRemovalIndex,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { NewMeetingreducer } = useSelector((state) => state);

  const handleProceesBtn = () => {
    let mainRemoveAgenda = [...rows];
    mainRemoveAgenda.splice(mainAgendaRemovalIndex, 1);
    setRows(mainRemoveAgenda);
    setMainAgendaRemovalIndex(0);
    dispatch(showMainAgendaItemRemovedModal(false));
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.mainAgendaItemRemoved}
        setShow={dispatch(showMainAgendaItemRemovedModal)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showMainAgendaItemRemovedModal(false));
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
                <span className={styles["Main_Agenda_items_removed_heading"]}>
                  {t("The-agenda-item-along-with-all-its-sub-agenda")}
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
                <span className={styles["Main_Agenda_items_removed_heading"]}>
                  {t("Items-if-any-will-be-removed-continue")}
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
                  text={t("Cancel")}
                  className={styles["Discard_Btn_Agendaremovel"]}
                  onClick={() => {
                    dispatch(showMainAgendaItemRemovedModal(false));
                  }}
                />
                <Button
                  text={t("Proceed")}
                  className={styles["Proceed_Btn_Agendaremovel"]}
                  onClick={() => {
                    handleProceesBtn();
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

export default MainAjendaItemRemoved;
