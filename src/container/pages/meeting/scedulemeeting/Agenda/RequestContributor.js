import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
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
      <Row key={index + 5} className="mt-2">
        <Col lg={12} md={12} sm={12}>
          <TextField
            applyClass={"AgendaTextField"}
            labelClass={"d-none"}
            placeholder={t("Enter-email-address-here")}
            name={"MainRequestContributorName"}
            value={data.requestContributorURl}
            change={(e) => {
              handleMainAgendaAdditionalFieldChangeRequestContributorURL(
                index,
                e
              );
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
            name={"MainNoteReqContributor"}
            value={data.MainNote}
            change={(e) => handleMainAgendaAdditionalMainReqNotes(index, e)}
            rows="4"
            placeholder={t("Enter-notes")}
            required={true}
            maxLength={500}
          />
        </Col>
      </Row>
    </>
  );
};

export default RequestContributor;
