import React, { useState } from "react";
import styles from "./Participants.module.css";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import addmore from "../../../../../assets/images/addmore.png";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import rspvGreenIcon from "../../../../../assets/images/rspvGreen.svg";
import rspvAbstainIcon from "../../../../../assets/images/rspvAbstain.svg";
import { Col, Row, Tab } from "react-bootstrap";
import {
  Button,
  Table,
  TextField,
  Loader,
  Notification,
} from "../../../../../components/elements";
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
import ParticipantsView from "./ParticpantsView/ParticipantsView";
import { CancelParticipants } from "./CancelParticipants/CancelParticipants";
import { useEffect } from "react";

const Participants = ({
  setParticipants,
  setAgenda,
  setProposedMeetingDates,
  setSceduleMeeting,
}) => {
  const [proposeMeeting, setPropseMeeting] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  console.log(
    NewMeetingreducer.getAllSavedparticipants,
    "getAllSavedparticipants"
  );
  const [particiapntsView, setParticiapntsView] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(true);
  const [IsParticipantsAddFlow, setIsParticpantAddFlow] = useState({
    IsParticipantsAddFlow: true,
  });
  const [isEditable, setIsEditable] = useState(false);
  const [particpantsRole, setParticpantsRole] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [editableSave, setEditableSave] = useState(0);
  const [data, setData] = useState([]);
  const [rspvRows, setrspvRows] = useState([]);
  console.log(rspvRows, "rspvRowsrspvRows");
  let currentMeetingID = localStorage.getItem("meetingID");
  console.log(currentMeetingID, "currentMeetingID");
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
      MeetingID: Number(currentMeetingID),
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
        console.log("SaifSaifSaifSaif", { record });
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
      },
    },

    {
      title: t("Role"),
      dataIndex: "Role",
      key: "Role",
      width: "80px",

      render: (text, record) => {
        console.log(record, "isComingApiisComingApiisComingApi");
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
      },
    },

    {
      dataIndex: "Close",
      key: "Close",
      width: "80px",

      render: (text, record) => {
        console.log("recordrecordrecord", { record });
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
                    />
                  </>
                )}
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  //Proposed meeting Page Opens
  const handleProposedmeetingDates = () => {
    setParticipants(false);
    setProposedMeetingDates(true);
  };

  //Enable the view page
  const EnableParticipantsViewPage = () => {
    setParticiapntsView(true);
  };

  //canceling the participants page
  const handleCancelParticipants = () => {
    dispatch(showCancelModalPartipants(true));
  };

  //Clearing the non saved  participant
  const handleCancelButtonForClearingParticipants = () => {
    let Data = {
      MeetingID: Number(currentMeetingID),
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
      console.log(prevRowsData, "prevRowsDataprevRowsData");
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
      console.log(data, "newDatanewDatanewData");
      newData.push({
        UserID: data.userID,
        Title: data.Title,
        ParticipantRoleID: data.participantRole.participantRoleID,
      });
    });
    if (editableSave === 1) {
      let Data = {
        MeetingParticipants: newData,
        MeetingID: Number(currentMeetingID),
        IsParticipantsAddFlow: false,
        NotificationMessage: "",
      };
      console.log({ Data }, "DataData");

      dispatch(SaveparticipantsApi(Data, navigate, t));
    } else {
      let Data = {
        MeetingParticipants: newData,
        MeetingID: Number(currentMeetingID),
        IsParticipantsAddFlow: true,
        NotificationMessage: "",
      };
      console.log({ Data }, "DataData");

      dispatch(SaveparticipantsApi(Data, navigate, t));
    }
  };

  useEffect(() => {
    if (rspvRows.length > 0) {
      let removedublicates = rspvRows.some(
        (data, index) => data.isComingApi === false
      );
      console.log(removedublicates, "removedublicatesremovedublicates");
      setIsEditable(removedublicates);
    } else {
      setIsEditable(false);
    }
  }, [rspvRows]);
  console.log(isEditable, "isEditableisEditableisEditable");

  return (
    <>
      {particiapntsView ? (
        <ParticipantsView />
      ) : (
        <>
          <section className={styles["defined_Height"]}>
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                {isEditable ? (
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
                  <Button
                    text={t("Propose-meeting-dates")}
                    className={styles["Next_Organization"]}
                    onClick={handleProposedmeetingDates}
                  />

                  <Button
                    text={t("Cancel")}
                    className={styles["Cancel_Organization"]}
                    onClick={handleCancelParticipants}
                  />

                  <Button
                    text={t("Previous-meeting")}
                    className={styles["Cancel_Organization"]}
                    onClick={EnableParticipantsViewPage}
                  />

                  <Button
                    text={t("Next")}
                    className={styles["Cancel_Organization"]}
                  />

                  <Button
                    text={t("Published")}
                    className={styles["Next_Organization"]}
                    onClick={handleNextButton}
                  />
                </>
              )}
            </Col>
          </Row>
        </>
      )}

      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.participantModal && (
        <AddParticipantModal setrspvRows={setrspvRows} rspvRows={rspvRows} />
      )}
      {NewMeetingreducer.cancelPartipants && (
        <CancelParticipants setSceduleMeeting={setSceduleMeeting} />
      )}
      {/* {proposeMeeting && } */}
    </>
  );
};

export default Participants;
