import React, { useEffect, useState } from "react";
import styles from "./ShareModalBoarddeck.module.css";
import { Button, Modal } from "@/components/elements";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  boardDeckEmailModal,
  boardDeckShareModal,
} from "@/store/actions/NewMeetingActions";
import crossIcon from "@/assets/images/BlackCrossIconModals.svg";
import CustomRadioGroup from "@/components/elements/radio/CustomRadioGroup";
const ShareModalBoarddeck = ({ radioValue, setRadioValue }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const boarddeckSharableModal = useSelector(
    (state) => state.NewMeetingreducer.boarddeckShareModal,
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
        show={boarddeckSharableModal}
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
                <CustomRadioGroup
                  onChange={(e) => handleRadioChange(e.target.value)}
                  value={radioValue}
                  className="AgendaSelectGroup"
                  options={[
                    { value: 1, label: t("Share-via-dataroom") },
                    { value: 2, label: t("Share-via-email") },
                  ]}
                />
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
