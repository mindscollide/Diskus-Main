import React from "react";
import styles from "./AgendaWise.module.css";
import { Col, Row } from "react-bootstrap";
import { AttachmentViewer } from "../../../../../../components/elements";

const ViewAgendaFilesMinutes = ({
  showMoreIndex,
  Itemsdata,
  showMore,
  detailIndex,
}) => {
  return (
    <>
      {showMoreIndex === detailIndex && showMore === true ? (
        <>
          <section className={styles["viewAgendaWiseFiles"]}>
            <Row>
              {Itemsdata.minutesAttachmets.map((filesname, index) => {
                return (
                  <>
                    <Col lg={4} md={4} sm={4}>
                      <AttachmentViewer
                        data={filesname}
                        id={0}
                        name={filesname.displayFileName}
                      />
                    </Col>
                  </>
                );
              })}
            </Row>
          </section>
        </>
      ) : null}
    </>
  );
};

export default ViewAgendaFilesMinutes;
