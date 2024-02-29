import React, { useState } from "react";
import {
  Modal,
  Button,
  Switch,
  TextField,
  Table,
  Radio,
} from "../../../../../../components/elements";
import styles from "./SelectAgendaModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

const SelectAgendaModal = ({ setAgendaSelectOptionView }) => {
  return (
    <section>
      <Modal
        show={true}
        // setShow={dispatch(showVoteAgendaModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => setAgendaSelectOptionView(false)}
        size={"md"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className={styles["OVer_padding"]}>
                Select Option
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Vote_title"]}>
                  Get new computers from Techno City Mall. Also, Get a ne... Get
                  new computers from Techno City Mall. Also, Get a ne... Get new
                  computers from Techno City Mall. Also, Get a ne... Get new
                  computers from Techno City Mall. Also, Get a ne... Get new
                  computers from Techno City Mall. Also, Get a ne...
                </span>
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
                <Button text="Cancel" className={styles["Cancel_Vote_Modal"]} />
                <Button text="Save" className={styles["Save_Vote_Modal"]} />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default SelectAgendaModal;
