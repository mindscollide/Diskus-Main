import React from "react";
import { Col, Row } from "react-bootstrap";
import { TextField } from "../../../../../components/elements";
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
  return (
    <Row className="mt-2">
      <Col lg={12} md={12} sm={12}>
        <TextField
          labelClass={"d-none"}
          placeholder={t("Enter-url")}
          name={"SubAgendaUrlRadioField"}
          value={subAgendaData.SubAgendaUrlFieldRadio}
          change={(e) => handleSubAgendaUrlEnterUrlField(index, subIndex, e)}
        />
      </Col>
    </Row>
  );
};

export default SubUrls;
