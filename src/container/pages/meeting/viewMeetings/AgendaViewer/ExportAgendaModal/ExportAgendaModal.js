import React, { useState } from "react";
import {
  Modal,
  Button,
  Switch,
  TextField,
  Table,
} from "../../../../../../components/elements";
import { Checkbox } from "antd";
import styles from "./ExportAgendaModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Cast from "../../../../../../assets/images/CAST.svg";
import {
  showVoteAgendaModal,
  showVoteConfirmationModal,
} from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import redcrossIcon from "../../../../../../assets/images/Artboard 9.png";
import Leftploygon from "../../../../../../assets/images/leftdirection.svg";
import Rightploygon from "../../../../../../assets/images/rightdirection.svg";
import Plus from "../../../../../../assets/images/Meeting plus.png";
import profile from "../../../../../../assets/images/newprofile.png";
import { validateInput } from "../../../../../../commen/functions/regex";

const ExportAgendaModal = ({ setExportAgendaView }) => {
  return (
    <section>
      <Modal
        show={true}
        // setShow={dispatch(showVoteAgendaModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => setExportAgendaView(false)}
        size={"xl"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className={styles["OVer_padding"]}>
                Export Modal
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

export default ExportAgendaModal;
