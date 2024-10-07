import React from "react";
import { Modal, Button } from "../../../../../../components/elements";
import styles from "./ExportAgendaModal.module.css";
import { Col, Row } from "react-bootstrap";

const ExportAgendaModal = ({ setExportAgendaView }) => {
  return (
    <section>
      <Modal
        show={true}
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
