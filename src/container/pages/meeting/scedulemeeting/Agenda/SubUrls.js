import React from "react";
import { Col, Row } from "react-bootstrap";
import { TextField } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";

const SubUrls = ({
  subAgendaData,
  rows,
  setRows,
  index,
  subIndex,
  editorRole,
}) => {
  const { t } = useTranslation();
  // Function to handle changes in sub-agenda additional Enter URl Radio text field
  const handleSubAgendaUrlEnterUrlField = (index, subIndex, e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(value, name, "valuevaluevalue");

    const updatedRows = [...rows];

    if (name === "SubAgendaUrlRadioField") {
      updatedRows[index].subAgenda[subIndex].subAgendaUrlFieldRadio = value;
      console.log(
        updatedRows[index].subAgenda[subIndex].subAgendaUrlFieldRadio,
        "updatedRowsupdatedRows"
      );
    }
    setRows(updatedRows);
  };
  return (
    <Row className="mt-2">
      <Col lg={12} md={12} sm={12}>
        <TextField
          labelclass={"d-none"}
          placeholder={t("Enter-url")}
          name={"SubAgendaUrlRadioField"}
          value={subAgendaData.subAgendaUrlFieldRadio}
          change={(e) => handleSubAgendaUrlEnterUrlField(index, subIndex, e)}
          disable={
            editorRole.role === "Participant" ||
            editorRole.role === "Agenda Contributor" ||
            editorRole.status === "9" ||
            editorRole.status === 9
              ? true
              : false
          }
        />
      </Col>
    </Row>
  );
};

export default SubUrls;
