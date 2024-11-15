import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { TextField } from "../../../../../components/elements";
import styles from "./Agenda.module.css";

const Urls = ({ data, index, setRows, rows }) => {
  const { t } = useTranslation();
  // Function to handle changes in main agenda additional text field
  const handleMainAgendaAdditionalFieldChange = (index, e) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedRows = [...rows];
    if (name === "UrlMainAgenda") {
      updatedRows[index].urlFieldMain = value;
    }
    setRows(updatedRows);
    console.log(updatedRows, "UrlMainAgendaUrlMainAgenda");
  };

  return (
    <Row key={index + 5} className="mt-3 mb-2">
      <Col lg={8} md={8} sm={12}>
        <span
          className={styles["URLTitle_Heading"]}
          onClick={() => window.open(data.urlFieldMain, "_blank")}
        >
          {data.urlFieldMain}
        </span>
      </Col>
    </Row>
  );
};

export default Urls;
