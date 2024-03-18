import React, { useState } from "react";
import {
  Modal,
  Button,
  Switch,
  TextField,
  Table,
} from "../../../../../../components/elements";
import { Radio } from "antd";
import styles from "./SelectAgendaModal.module.css";
import {
  agendaViewFlag,
  printAgenda,
  exportAgenda,
} from "../../../../../../store/actions/MeetingAgenda_action";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import CrossIcon from "./../AV-Images/Cross_Icon.png";

const SelectAgendaModal = ({
  setAgendaSelectOptionView,
  setPrintAgendaView,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [radioValue, setRadioValue] = useState(1);

  const handleRadioChange = (value) => {
    setRadioValue(value);
    console.log("valuevaluevalue", value);
  };

  const printFlag = useSelector(
    (state) => state.MeetingAgendaReducer.PrintAgendaFlag
  );

  const exportFlag = useSelector(
    (state) => state.MeetingAgendaReducer.ExportAgendaFlag
  );

  const selectAgendaFunction = () => {
    setAgendaSelectOptionView(false);
    dispatch(agendaViewFlag(radioValue));
    setPrintAgendaView(true);
  };

  return (
    <section>
      <Modal
        show={true}
        // setShow={dispatch(showVoteAgendaModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        className="SelectAgendaModal"
        onHide={() => {
          setAgendaSelectOptionView(false);
          dispatch(printAgenda(false));
          dispatch(exportAgenda(false));
        }}
        size={"sm"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className="position-relative">
                <p className={styles["FileModalTitle"]}>{t("Select-option")}</p>
                <img
                  onClick={() => setAgendaSelectOptionView(false)}
                  className={styles["image-close"]}
                  src={CrossIcon}
                  alt=""
                />
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Radio.Group
                  // onChange={(e) => handleRadioChange(index, e.target.value)}
                  onChange={(e) => handleRadioChange(e.target.value)}
                  value={radioValue}
                  className="AgendaSelectGroup"
                >
                  <Radio value={1}>
                    <span>{t("Main-agenda-items")}</span>
                  </Radio>
                  <Radio value={2}>
                    <span>{t("Agenda-with-sub-agenda")}</span>
                  </Radio>
                </Radio.Group>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  onClick={selectAgendaFunction}
                  text={
                    printFlag ? t("Print") : exportFlag ? t("Export") : null
                  }
                  className={styles["Cancel_Vote_Modal"]}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default SelectAgendaModal;
