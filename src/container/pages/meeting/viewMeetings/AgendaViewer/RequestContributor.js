import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./Agenda.module.css";

const RequestContributor = ({ data, index, setRows, rows }) => {
  return (
    <>
      <Row key={index + 5} className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["ContributorTitle_Heading"]}>
            <div className={styles["agendaCreationDetail"]}>
              <img
                src={`data:image/jpeg;base64,${data?.contributor?.displayProfilePictureName}`}
                className={styles["Image"]}
                alt=""
                draggable={false}
              />
              <p className={styles["agendaCreater"]}>
                {data?.contributor?.contributorName}
              </p>
            </div>
          </span>
        </Col>
      </Row>
      <Row className="mt-2 mb-2">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["ContributorDescription"]}>
            {data.mainNote}
          </span>
        </Col>
      </Row>
    </>
  );
};

export default RequestContributor;
