import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Agenda.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { TextField } from "../../../../../components/elements";
import { useMeetingContext } from "../../../../../context/MeetingContext";

const RequestContributor = ({
  data,
  index,
  setRows,
  rows,
  allUsersRC,
  setAllUsersRC,
}) => {
  const { t } = useTranslation();
  const { editorRole } = useMeetingContext();
  const getAllAgendaContributors = useSelector(
    (state) => state.NewMeetingreducer.getAllAgendaContributors
  );
  const [agendaContributors, setAgendaContributors] = useState([]);

  // Function to handle changes in main agenda additional text field Main Request Contributor Note
  const handleMainAgendaAdditionalMainReqNotes = (index, e) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedRows = [...rows];
    if (name === "MainNoteReqContributor") {
      updatedRows[index].mainNote = value;
    }
    setRows(updatedRows);
    console.log(updatedRows, "MainNoteReqContributor");
  };
  // Function to handle changes in main agenda Main Request Contributor Url text field
  // const handleMainAgendaAdditionalFieldChangeRequestContributorURL = (
  //   index,
  //   e
  // ) => {
  //   let name = e.target.name;
  //   let value = e.target.value;
  //   const updatedRows = [...rows];
  //   if (name === "MainRequestContributorName") {
  //     updatedRows[index].requestContributorURl = value;
  //   }
  //   setRows(updatedRows);
  //   console.log(updatedRows, "MainRequestContributorName");
  // };

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

  const handleSelectChange = (index, value) => {
    console.log(value, "valuevaluevalue");
    const updatedAgendaItems = [...rows];
    let SelectValue = {
      value: value.value,
      label: value.label,
    };
    // updatedAgendaItems[index].requestContributorURl = SelectValue.value;
    updatedAgendaItems[index].userID = SelectValue.value;
    updatedAgendaItems[index].requestContributorURlName = SelectValue.label;
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
      <Row key={index + 5} className='mt-2'>
        <Col lg={12} md={12} sm={12}>
          <Select
            options={allUsersRC}
            value={{
              value: data.requestContributorURl,
              label: data.requestContributorURlName,
            }}
            onChange={(value) => handleSelectChange(index, value)}
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
            applyClass={"AgendaTextField"}
            labelclass={"d-none"}
            placeholder={t("Enter-email-address-here")}
            name={"MainRequestContributorName"}
            value={data.requestContributorURl}
            change={(e) => {
              handleMainAgendaAdditionalFieldChangeRequestContributorURL(
                index,
                e
              );
            }}
          /> */}
        </Col>
      </Row>
      <Row className='mb-2'>
        <Col lg={12} md={12} sm={12}>
          <TextField
            applyClass='text-area-create-resolution'
            type='text'
            as={"textarea"}
            name={"MainNoteReqContributor"}
            value={data.mainNote}
            change={(e) => handleMainAgendaAdditionalMainReqNotes(index, e)}
            rows='4'
            placeholder={t("Enter-notes")}
            required={true}
            maxLength={500}
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

export default RequestContributor;
