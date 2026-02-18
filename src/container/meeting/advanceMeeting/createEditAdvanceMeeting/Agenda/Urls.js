import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { TextField } from "../../../../../components/elements";

const Urls = ({ data, index, setRows, rows, editorRole }) => {
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
      <Col lg={12} md={12} sm={12}>
        <TextField
          applyClass={"AgendaTextField"}
          labelclass={"d-none"}
          placeholder={t("Enter-url")}
          name={"UrlMainAgenda"}
          value={data.urlFieldMain}
          change={(e) => handleMainAgendaAdditionalFieldChange(index, e)}
          disable={
            editorRole.role === "Participant" ||
            editorRole.role === "Agenda Contributor"
              ? true
              : editorRole.status === 9 || editorRole.status === "9"
              ? true
              : false
          }
        />
      </Col>
    </Row>
  );
};

export default Urls;
