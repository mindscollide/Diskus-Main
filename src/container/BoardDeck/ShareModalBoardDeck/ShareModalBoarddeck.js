import React, { useEffect, useState } from "react";
import styles from "./ShareModalBoarddeck.module.css";
import { Button, Modal } from "../../../components/elements";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Radio } from "antd";
import { useNavigate } from "react-router-dom";
import {
  boardDeckEmailModal,
  boardDeckShareModal,
} from "../../../store/actions/NewMeetingActions";
import crossIcon from "../../../assets/images/BlackCrossIconModals.svg";
const ShareModalBoarddeck = ({ radioValue, setRadioValue }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const boarddeckShareModal = useSelector(
    (state) => state.NewMeetingreducer.boarddeckShareModal
  );
  const handleRadioChange = (value) => {
    setRadioValue(value);
    console.log("valuevaluevalue", value);
  };

  useEffect(() => {
    setRadioValue(1);
  }, []);

  const handleSharebutton = () => {
    dispatch(boardDeckShareModal(false));
    dispatch(boardDeckEmailModal(true));
  };

  const handleCrossButton = () => {
    dispatch(boardDeckShareModal(false));
  };

  return (
    <Container>
      <Modal
        show={boarddeckShareModal}
        setShow={dispatch(boardDeckShareModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        // className="SelectAgendaModal"
        onHide={() => {
          dispatch(boardDeckShareModal(false));
        }}
        size={"sm"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className="position-relative">
                <p className={styles["FileModalTitle"]}>{t("Share")}</p>
                <img
                  className={styles["image-close"]}
                  src={crossIcon}
                  alt=""
                  onClick={handleCrossButton}
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
                    <span>{t("Share-via-dataroom")}</span>
                  </Radio>
                  <Radio value={2}>
                    <span>{t("Share-via-email")}</span>
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
                  text={"Share"}
                  className={styles["Cancel_Vote_Modal"]}
                  onClick={handleSharebutton}
                />
              </Col>
            </Row>
          </>
        }
      />
    </Container>
  );
};

export default ShareModalBoarddeck;
