import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Agenda.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { TextField } from "../../../../../components/elements";
import { useMeetingContext } from "../../../../../context/MeetingContext";

const SubRequestContributor = ({
  setRows,
  rows,
  subAgendaData,
  index,
  subIndex,
  allUsersRC,
  setAllUsersRC,
}) => {
  const { t } = useTranslation();
  const { editorRole } = useMeetingContext();
  const getAllAgendaContributors = useSelector(
    (state) => state.NewMeetingreducer.getAllAgendaContributors
  );
  const [agendaContributors, setAgendaContributors] = useState([]);

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

  // useEffect(() => {
  //   let getAllData = {
  //     MeetingID: currentMeetingID !== null ? currentMeetingID : 0,
  //   };
  //   dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
  // }, []);

  useEffect(() => {
    if (
      getAllAgendaContributors !== undefined &&
      getAllAgendaContributors !== null &&
      getAllAgendaContributors.length !== 0
    ) {
      setAgendaContributors(getAllAgendaContributors);
    } else {
      setAgendaContributors([]);
    }
  }, [getAllAgendaContributors]);

  const handleSelectChange = (index, subIndex, value) => {
    console.log(value, "valuevaluevalue");
    const updatedAgendaItems = [...rows];
    let SelectValue = {
      value: value.value,
      label: value.label,
    };
    // updatedAgendaItems[index].subAgenda[
    //   subIndex
    // ].subAgendarequestContributorUrl = SelectValue.value;
    updatedAgendaItems[index].subAgenda[subIndex].userID = SelectValue.value;
    updatedAgendaItems[index].subAgenda[
      subIndex
    ].subAgendarequestContributorUrlName = SelectValue.label;
    setRows(updatedAgendaItems);
  };

  useEffect(() => {
    if (
      agendaContributors.lenth > 0 ||
      Object.keys(agendaContributors).length > 0
    ) {
      const mappedUsers = agendaContributors.map((usersRC) => ({
        value: usersRC.userID,
        label: (
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className='d-flex gap-2'>
                <img
                  alt=''
                  src={`data:image/jpeg;base64,${usersRC.userProfilePicture.displayProfilePictureName}`}
                  width='17px'
                  height='17px'
                  className={styles["Image_class_Agenda"]}
                />
                <span className={styles["Name_Class"]}>{usersRC.userName}</span>
              </Col>
            </Row>
          </>
        ),
      }));
      setAllUsersRC((prevUsersRC) => {
        if (JSON.stringify(prevUsersRC) !== JSON.stringify(mappedUsers)) {
          return mappedUsers;
        }
        return prevUsersRC; // No change, return the current state
      });
    }
  }, [agendaContributors]);

  // const allAgendaContributors = agendaContributors.map((contributor) => ({
  //   value: contributor.userID,
  //   label: (
  //     <>
  //       <Row>
  //         <Col lg={12} md={12} sm={12} className="d-flex gap-2">
  //           <img
  //             src={`data:image/jpeg;base64,${contributor.userProfilePicture.displayProfilePictureName}`}
  //             width="17px"
  //             height="17px"
  //             className={styles["Image_class_Agenda"]}
  //           />
  //           <span className={styles["Name_Class"]}>{contributor.userName}</span>
  //         </Col>
  //       </Row>
  //     </>
  //   ),
  // }));

  return (
    <>
      <Row className='mt-2'>
        <Col lg={12} md={12} sm={12}>
          <Select
            options={allUsersRC}
            value={{
              value: subAgendaData.subAgendarequestContributorUrl,
              label: subAgendaData.subAgendarequestContributorUrlName,
            }}
            onChange={(value) => handleSelectChange(index, subIndex, value)}
            classNamePrefix={"SelectOrganizersSelect_active"}
            isDisabled={
              editorRole.role === "Participant" ||
              editorRole.role === "Agenda Contributor"
                ? true
                : false
            }
            isSearchable={false}
          />
          {/* <TextField
            labelclass={"d-none"}
            placeholder={"Enter-url"}
            name={"SubAgendaRequestContributorUrlField"}
            value={subAgendaData.subAgendarequestContributorUrl}
            change={(e) => {
              handleSubAgendaRequestContributorEnterUrl(index, subIndex, e);
            }}
          /> */}
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <TextField
            applyClass='text-area-create-resolution'
            type='text'
            as={"textarea"}
            rows='4'
            placeholder={t("Enter-notes")}
            name={"SubAgendaRequestContributorEnterNotesFiled"}
            required={true}
            maxLength={500}
            value={subAgendaData.subAgendarequestContributorEnterNotes}
            change={(e) =>
              handleSubAgendaRequestContributorEnterNote(index, subIndex, e)
            }
            disable={
              editorRole.role === "Participant" ||
              editorRole.role === "Agenda Contributor"
                ? true
                : false
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default SubRequestContributor;
