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
            <div className={styles["agendaCreationDetail"]}>
              <img
                src={`data:image/jpeg;base64,${subAgendaData?.contributor?.displayProfilePictureName}`}
                className={styles["Image"]}
                alt=""
                draggable={false}
              />
              <p className={styles["agendaCreater"]}>
                {subAgendaData?.contributor?.displayProfilePictureName}
              </p>
              {/* <span className={styles["agendaCreationTime"]}>
                {subAgendaData?.contributor?.displayProfilePictureName}
              </span> */}
            </div>
            .
          </span>
        </Col>
      </Row>
      <Row className="mt-2 mb-2">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["ContributorDescription"]}>
            {subAgendaData.subAgendarequestContributorEnterNotes}
          </span>
        </Col>
      </Row>
    </>
  );
};

export default SubRequestContributor;
