import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./Agenda.module.css";
import { TextField } from "../../../../../components/elements";

const RequestContributor = ({ data, index, setRows, rows }) => {
  const { t } = useTranslation();
  // Function to handle changes in main agenda additional text field Main Request Contributor Note
  const handleMainAgendaAdditionalMainReqNotes = (index, e) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedRows = [...rows];
    if (name === "MainNoteReqContributor") {
      updatedRows[index].MainNote = value;
    }
    setRows(updatedRows);
    console.log(updatedRows, "MainNoteReqContributor");
  };
  // Function to handle changes in main agenda Main Request Contributor Url text field
  const handleMainAgendaAdditionalFieldChangeRequestContributorURL = (
    index,
    e
  ) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedRows = [...rows];
    if (name === "MainRequestContributorName") {
      updatedRows[index].requestContributorURl = value;
    }
    setRows(updatedRows);
    console.log(updatedRows, "MainRequestContributorName");
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

export default RequestContributor;
