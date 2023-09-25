import React from "react";
import { Col, Row } from "react-bootstrap";
import { TextField } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";

const SubRequestContributor = ({
  setRows,
  rows,
  subAgendaData,
  index,
  subIndex,
}) => {
  const { t } = useTranslation();

  // Function to handle changes in sub-agenda additional Request Contributor Enter URl Radio text field
  const handleSubAgendaRequestContributorEnterUrl = (index, subIndex, e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(value, name, "valuevaluevalue");

    const updatedRows = [...rows];

    if (name === "SubAgendaRequestContributorUrlField") {
      updatedRows[index].subAgenda[subIndex].subAgendarequestContributorUrl =
        value;
    }
    console.log(updatedRows, "SubAgendaRequestContributorUrlField");
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda additional Request Contributor Enter Note Radio text field
  const handleSubAgendaRequestContributorEnterNote = (index, subIndex, e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(value, name, "valuevaluevalue");

    const updatedRows = [...rows];

    if (name === "SubAgendaRequestContributorEnterNotesFiled") {
      updatedRows[index].subAgenda[
        subIndex
      ].subAgendarequestContributorEnterNotes = value;
    }
    console.log(updatedRows, "SubAgendaRequestContributorEnterNotesFiled");
    setRows(updatedRows);
  };

  return (
    <>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12}>
          <TextField
            labelClass={"d-none"}
            placeholder={"Enter-url"}
            name={"SubAgendaRequestContributorUrlField"}
            value={subAgendaData.subAgendarequestContributorUrl}
            change={(e) => {
              handleSubAgendaRequestContributorEnterUrl(index, subIndex, e);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <TextField
            applyClass="text-area-create-resolution"
            type="text"
            as={"textarea"}
            rows="4"
            placeholder={t("Enter-notes")}
            name={"SubAgendaRequestContributorEnterNotesFiled"}
            required={true}
            maxLength={500}
            value={subAgendaData.subAgendarequestContributorEnterNotes}
            change={(e) =>
              handleSubAgendaRequestContributorEnterNote(index, subIndex, e)
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default SubRequestContributor;
