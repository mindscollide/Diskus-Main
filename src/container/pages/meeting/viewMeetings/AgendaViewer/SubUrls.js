import React from "react";
import { Col, Row } from "react-bootstrap";
import { TextField } from "../../../../../components/elements";
import styles from "./Agenda.module.css";
import { useTranslation } from "react-i18next";

const SubUrls = ({ subAgendaData, rows, setRows, index, subIndex }) => {
  const { t } = useTranslation();
  // Function to handle changes in sub-agenda additional Enter URl Radio text field
  const handleSubAgendaUrlEnterUrlField = (index, subIndex, e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(value, name, "valuevaluevalue");

    const updatedRows = [...rows];
    console.log(
      updatedRows[index].subAgenda[subIndex].SubAgendaUrlFieldRadio,
      "updatedRowsupdatedRows"
    );
    if (name === "SubAgendaUrlRadioField") {
      updatedRows[index].subAgenda[subIndex].SubAgendaUrlFieldRadio = value;
      console.log(
        updatedRows[index].subAgenda[subIndex].SubAgendaUrlFieldRadio,
        "updatedRowsupdatedRows"
      );
    }
    console.log(updatedRows, "SubAgendaUrlRadioField");
    setRows(updatedRows);
  };

  let currentLanguage = localStorage.getItem("i18nextLng");

  return (
    <Row className="mt-2">
      <Col
        lg={8}
        md={8}
        sm={12}
        className={currentLanguage === "ar" ? "p-0" : ""}
      >
        <span
          className={styles["URLTitle_Heading"]}
          onClick={() =>
            window.open(subAgendaData.subAgendaUrlFieldRadio, "_blank")
          }
        >
          {subAgendaData.subAgendaUrlFieldRadio}
        </span>
      </Col>
    </Row>
  );
};

export default SubUrls;
