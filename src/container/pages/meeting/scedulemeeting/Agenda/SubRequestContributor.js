import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Agenda.module.css";
import { useNavigate } from "react-router-dom";
import { getAllAgendaContributorApi } from "../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { TextField } from "../../../../../components/elements";

const SubRequestContributor = ({
  setRows,
  rows,
  subAgendaData,
  index,
  subIndex,
  allUsersRC,
  setAllUsersRC,
  ediorRole,
}) => {
  const { t } = useTranslation();

  const { NewMeetingreducer } = useSelector((state) => state);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let currentMeetingID = Number(localStorage.getItem("meetingID"));

  const [agendaContributors, setAgendaContributors] = useState([]);

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

  // useEffect(() => {
  //   let getAllData = {
  //     MeetingID: currentMeetingID !== null ? currentMeetingID : 0,
  //   };
  //   dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
  // }, []);

  useEffect(() => {
    if (
      NewMeetingreducer.getAllAgendaContributors !== undefined &&
      NewMeetingreducer.getAllAgendaContributors !== null &&
      NewMeetingreducer.getAllAgendaContributors.length !== 0
    ) {
      setAgendaContributors(NewMeetingreducer.getAllAgendaContributors);
    } else {
      setAgendaContributors([]);
    }
  }, [NewMeetingreducer.getAllAgendaContributors]);

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
              <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                <img
                  alt=""
                  src={`data:image/jpeg;base64,${usersRC.userProfilePicture.displayProfilePictureName}`}
                  width="17px"
                  height="17px"
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

  console.log("New Meeting Reducer", NewMeetingreducer);

  return (
    <>
      <Row className="mt-2">
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
              ediorRole.role === "Participant" ||
              ediorRole.role === "Agenda Contributor"
                ? true
                : false
            }
          />
          {/* <TextField
            labelClass={"d-none"}
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
            disable={
              ediorRole.role === "Participant" ||
              ediorRole.role === "Agenda Contributor"
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
