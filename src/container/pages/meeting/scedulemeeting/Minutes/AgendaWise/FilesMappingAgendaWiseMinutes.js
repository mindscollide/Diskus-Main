import React from "react";
import styles from "./AgendaWise.module.css";
import { Col, Row } from "react-bootstrap";
import { AttachmentViewer } from "../../../../../../components/elements";
const FilesMappingAgendaWiseMinutes = ({
  showMoreIndex,
  Itemsdata,
  showMore,
  detailIndex,
}) => {
  return (
    <>
      {showMoreIndex === detailIndex && showMore === true ? (
        <section className={styles["viewAgendaWiseFiles"]}>
          <Row>
            {Itemsdata.minutesAttachmets.map((filesname, parentIndex) => {
              return filesname.files.map((data, index) => (
                <Col lg={4} md={4} sm={4} key={`${parentIndex}-${index}`}>
                  <AttachmentViewer
                    data={data}
                    id={0}
                    name={data.displayFileName}
                  />
                </Col>
              ));
            })}
          </Row>
        </section>
      ) : null}
    </>
  );
};

export default FilesMappingAgendaWiseMinutes;
