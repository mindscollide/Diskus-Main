import React from "react";
import { Col, Row } from "react-bootstrap";
import { TextField } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import styles from "./Agenda.module.css";

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
      <Row key={index + 5} className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["ContributorTitle_Heading"]}>
            Get new computers from Techno City Mall. Also, Get a new graphics
            card for the designer.
          </span>
        </Col>
      </Row>
      <Row className="mt-2 mb-2">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["ContributorDescription"]}>
            https://www.youtube.com/watch
          </span>
        </Col>
      </Row>
    </>
  );
};

export default SubRequestContributor;
