import React, { useState } from "react";
import styles from "./Participants.module.css";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import addmore from "../../../../../assets/images/addmore.png";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import { Col, Row } from "react-bootstrap";
import { Button, Table, TextField } from "../../../../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ModalCrossIcon from "../Organizers/ModalCrossIconClick/ModalCrossIcon";
import {
  GetAllParticipantsRoleNew,
  GetAllSavedparticipantsAPI,
  SaveparticipantsApi,
  showAddParticipantsModal,
  showCancelModalPartipants,
  showCrossConfirmationModal,
} from "../../../../../store/actions/NewMeetingActions";
import AddParticipantModal from "./AddParticipantModal/AddParticipantModal";
import { CancelParticipants } from "./CancelParticipants/CancelParticipants";
import { useEffect } from "react";

const Participants = ({
  setParticipants,
  setAgenda,
  setProposedMeetingDates,
  setSceduleMeeting,
  currentMeeting,
  setAgendaContributors,
  ediorRole,
  setEditMeeting,
  isEditMeeting,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [menuIsOpen, setMenuIsOpen] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [particpantsRole, setParticpantsRole] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [editableSave, setEditableSave] = useState(0);
  const [rspvRows, setrspvRows] = useState([]);
  //open row icon cross modal
  const openCrossIconModal = () => {
    dispatch(showCrossConfirmationModal(true));
  };

  //Opens Add more modal
  const openAddPartcipantModal = () => {
    dispatch(showAddParticipantsModal(true));
  };

  // handling save and next button
  const handleNextButton = () => {
    setParticipants(false);
    setAgenda(true);
  };

  //For menu Portal of the React select
  const customStyles = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  useEffect(() => {
    setMenuIsOpen(true);
  }, []);

  //For participants Role
  useEffect(() => {
    dispatch(GetAllParticipantsRoleNew(navigate, t));
  }, []);

  //Roles Drop Down Data
  useEffect(() => {
    try {
      if (
        NewMeetingreducer.getAllPartiicpantsRoles.participantRoles !== null &&
        NewMeetingreducer.getAllPartiicpantsRoles.participantRoles !== undefined
      ) {
        let Newdata = [];
        NewMeetingreducer.getAllPartiicpantsRoles.participantRoles.map(
          (data, index) => {
            console.log(data, "datadatadatas");
            Newdata.push({
              value: data.participantRoleID,
              label: data.participantRole,
            });
          }
        );
        setParticpantsRole(Newdata);
      }
    } catch (error) {}
  }, [NewMeetingreducer.getAllPartiicpantsRoles]);

  //get all saved participants

  useEffect(() => {
    let Data = {
      MeetingID: Number(currentMeeting),
    };
    dispatch(GetAllSavedparticipantsAPI(Data, navigate, t));
  }, []);

  useEffect(() => {
    let getAllData = [];
    if (
      NewMeetingreducer.getAllSavedparticipants !== null &&
      NewMeetingreducer.getAllSavedparticipants !== undefined &&
      NewMeetingreducer.getAllSavedparticipants.length > 0
    ) {
      if (NewMeetingreducer.getAllSavedparticipants.length > 0) {
        NewMeetingreducer.getAllSavedparticipants.forEach((data, index) => {
          getAllData.push({
            IsOrganizerNotified: false,
            IsPrimaryOrganizer: false,
            Title: data.participantTitle,
            displayPicture: "",
            email: data.emailAddress,
            isRSVP: data.rsvp,
            participantRole: data.participantRole,
            userID: data.userID,
            userName: data.userName,
            isComingApi: true,
          });
        });
      } else {
        // IsParticipantsAddFlow;
      }

      setrspvRows(getAllData);
    }
  }, [NewMeetingreducer.getAllSavedparticipants]);

  const handleSelectChange = (userID, selectedOption) => {
    setrspvRows((prevRowsData) => {
      return prevRowsData.map((row) => {
        if (row.userID === userID) {
          return {
            ...row,
            participantRole: {
              participantRole: selectedOption.label,
              participantRoleID: selectedOption.value,
            },
          };
        }
        return row;
      });
    });
  };

  const handleCancelingRow = (record) => {
    let removingfromrow = rspvRows.filter(
      (data, index) => data.userID !== record.userID
    );
    setrspvRows(removingfromrow);
  };

  console.log("handleSelectChange", rspvRows);

  // Table coloumn
  const ParticipantsColoumn = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Name")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "userName",
      key: "userName",
      width: "80px",
    },

    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      width: "80px",
    },
    {
      title: t("Participant-title"),
      dataIndex: "Title",
      key: "Title",
      width: "80px",

      render: (text, record) => {
        if (
          (Number(ediorRole.status) === 9 &&
            ediorRole.role === "Organizer" &&
            isEditMeeting === true) ||
          ((Number(ediorRole.status) === 11 ||
            Number(ediorRole.status) === 12) &&
            ediorRole.role === "Agenda Contributor" &&
            isEditMeeting === true)
        ) {
          return { text };
        } else {
          return (
            <Row>
              <Col lg={12} md={12} sm={12}>
                <>
                  <TextField
                    disable={record.isComingApi === true ? true : false}
                    placeholder={t("Participant-title")}
                    labelClass={"d-none"}
                    applyClass={"Organizer_table"}
                    value={
                      record.isComingApi === true
                        ? record.Title
                        : inputValues[record.userID] || ""
                    }
                    change={(e) =>
                      handleInputChange(record.userID, e.target.value)
                    } // Update the inputValues when the user types
                  />
                </>
              </Col>
            </Row>
          );
        }
      },
    },

    {
      title: t("Role"),
      dataIndex: "Role",
      key: "Role",
      width: "80px",

      render: (text, record) => {
        let participantRole = record.participantRole.participantRole;
        if (
          (Number(ediorRole.status) === 9 &&
            ediorRole.role === "Organizer" &&
            isEditMeeting === true) ||
          ((Number(ediorRole.status) === 11 ||
            Number(ediorRole.status) === 12) &&
            ediorRole.role === "Agenda Contributor" &&
            isEditMeeting === true)
        ) {
          return { participantRole };
        } else {
          return (
            <Row>
              <Col lg={12} md={12} sm={12}>
                <>
                  <Select
                    isDisabled={record.isComingApi === true ? true : false}
                    options={particpantsRole}
                    menuPortalTarget={document.body}
                    styles={customStyles}
                    classNamePrefix={"ParticipantRole"}
                    value={
                      record.isComingApi === true
                        ? {
                            value: record.participantRole.participantRoleID,
                            label: record.participantRole.participantRole,
                          }
                        : record.selectedOption
                    }
                    onChange={(selectedOption) =>
                      handleSelectChange(record.userID, selectedOption)
                    }
                  />
                </>
              </Col>
            </Row>
          );
        }
      },
    },

    {
      dataIndex: "Close",
      key: "Close",
      width: "80px",

      render: (text, record) => {
        if (
          (Number(ediorRole.status) === 9 &&
            ediorRole.role === "Organizer" &&
            isEditMeeting === true) ||
          ((Number(ediorRole.status) === 11 ||
            Number(ediorRole.status) === 12) &&
            ediorRole.role === "Agenda Contributor" &&
            isEditMeeting === true)
        ) {
        } else {
          return (
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  {record.isComingApi === true ? (
                    ""
                  ) : (
                    <>
                      <img
                        src={redcrossIcon}
                        className="cursor-pointer "
                        height="21px"
                        width="21px"
                        onClick={() => handleCancelingRow(record)}
                        alt=""
                      />
                    </>
                  )}
                </Col>
              </Row>
            </>
          );
        }
      },
    },
  ];

  //Proposed meeting Page Opens
  const handleProposedmeetingDates = () => {
    setParticipants(false);
    setProposedMeetingDates(true);
  };

  const nextTabOrganizer = () => {
    setAgenda(true);
    setParticipants(false);
  };
  const previousTabOrganizer = () => {
    setAgendaContributors(true);
    setParticipants(false);
  };

  //canceling the participants page
  const handleCancelParticipants = () => {
    dispatch(showCancelModalPartipants(true));
  };

  //Clearing the non saved  participant
  const handleCancelButtonForClearingParticipants = () => {
    let Data = {
      MeetingID: Number(currentMeeting),
    };
    dispatch(GetAllSavedparticipantsAPI(Data, navigate, t));
  };

  //state management For textfield
  const handleInputChange = (userID, newValue) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [userID]: newValue,
    }));
    setrspvRows((prevRowsData) => {
      return prevRowsData.map((row) => {
        if (row.userID === userID) {
          return {
            ...row,
            Title: newValue,
          };
        }
        return row;
      });
    });
  };

  const handleEditFunction = () => {
    setEditableSave(1);
    setrspvRows((prevRows) => {
      return prevRows.map((data) => ({
        ...data,
        isComingApi: false,
      }));
    });
  };

  const handleSaveparticpants = () => {
    let newData = [];
    let copyData = [...rspvRows];
    copyData.forEach((data, index) => {
      newData.push({
        UserID: data.userID,
        Title: data.Title,
        ParticipantRoleID: data.participantRole.participantRoleID,
      });
    });
    if (editableSave === 1) {
      let Data = {
        MeetingParticipants: newData,
        MeetingID: Number(currentMeeting),
        IsParticipantsAddFlow: false,
        NotificationMessage: "",
      };
      dispatch(SaveparticipantsApi(Data, navigate, t));
    } else {
      let Data = {
        MeetingParticipants: newData,
        MeetingID: Number(currentMeeting),
        IsParticipantsAddFlow: true,
        NotificationMessage: "",
      };
      dispatch(SaveparticipantsApi(Data, navigate, t, currentMeeting));
    }
  };

  useEffect(() => {
    if (rspvRows.length > 0) {
      let removedublicates = rspvRows.some(
        (data, index) => data.isComingApi === false
      );
      setIsEditable(removedublicates);
    } else {
      setIsEditable(false);
    }
  }, [rspvRows]);

  return (
    <>
      <section className={styles["defined_Height"]}>
        <Row className="mt-3">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            {(Number(ediorRole.status) === 9 &&
              ediorRole.role === "Organizer" &&
              isEditMeeting === true) ||
            ((Number(ediorRole.status) === 11 ||
              Number(ediorRole.status) === 12) &&
              ediorRole.role === "Agenda Contributor" &&
              isEditMeeting === true) ? null : isEditable ? (
              <>
                <Row>
                  <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                    <Button
                      text={t("Cancel")}
                      className={styles["Cancel_Organization"]}
                      onClick={handleCancelButtonForClearingParticipants}
                    />

                    <Button
                      text={t("Save")}
                      className={styles["Next_Organization"]}
                      onClick={handleSaveparticpants}
                    />
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Button
                  text={t("Edit")}
                  className={styles["Edit_Button_Organizers"]}
                  icon={
                    <img
                      draggable={false}
                      src={EditIcon}
                      width="11.75px"
                      height="11.75px"
                      alt=""
                    />
                  }
                  onClick={handleEditFunction}
                />

                <Button
                  text={t("Add-more")}
                  icon={<img draggable={false} src={addmore} />}
                  className={styles["AddMoreBtn"]}
                  onClick={openAddPartcipantModal}
                />
              </>
            )}
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Table
              column={ParticipantsColoumn}
              scroll={{ y: "42vh" }}
              pagination={false}
              className="Polling_table"
              rows={rspvRows}
            />
          </Col>
        </Row>
      </section>
      <Row className="mt-3">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2"
        >
          {isEditable ? (
            <>
              <div className={styles["definedHeight"]}></div>
            </>
          ) : (
            <>
              {(Number(ediorRole.status) === 9 &&
                ediorRole.role === "Organizer" &&
                isEditMeeting === true) ||
              ((Number(ediorRole.status) === 11 ||
                Number(ediorRole.status) === 12) &&
                ediorRole.role === "Agenda Contributor" &&
                isEditMeeting === true) ? null : (
                <Button
                  text={t("Propose-meeting-dates")}
                  className={styles["Next_Organization"]}
                  onClick={handleProposedmeetingDates}
                />
              )}

              <Button
                text={t("Cancel")}
                className={styles["Cancel_Organization"]}
                onClick={handleCancelParticipants}
              />

              <Button
                text={t("Previous")}
                className={styles["Cancel_Organization"]}
                onClick={previousTabOrganizer}
              />

              <Button
                text={t("Next")}
                className={styles["Cancel_Organization"]}
                onClick={nextTabOrganizer}
              />
              {(Number(ediorRole.status) === 9 &&
                ediorRole.role === "Organizer" &&
                isEditMeeting === true) ||
              ((Number(ediorRole.status) === 11 ||
                Number(ediorRole.status) === 12) &&
                ediorRole.role === "Agenda Contributor" &&
                isEditMeeting === true) ? null : (
                <Button
                  text={t("Published")}
                  className={styles["Next_Organization"]}
                  onClick={handleNextButton}
                />
              )}
            </>
          )}
        </Col>
      </Row>

      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.participantModal && (
        <AddParticipantModal
          setrspvRows={setrspvRows}
          rspvRows={rspvRows}
          currentMeeting={currentMeeting}
        />
      )}
      {NewMeetingreducer.cancelPartipants && (
        <CancelParticipants setSceduleMeeting={setSceduleMeeting} />
      )}
      {/* {proposeMeeting && } */}
    </>
  );
};

export default Participants;
