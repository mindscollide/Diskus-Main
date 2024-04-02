import React, { useEffect, useState } from "react";
import styles from "./AgendaContributors.module.css";
import addmore from "../../../../../assets/images/addmore.png";
import emptyContributorState from "../../../../../assets/images/emptyStateContributor.svg";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import greenMailIcon from "../../../../../assets/images/greenmail.svg";
import redMailIcon from "../../../../../assets/images/redmail.svg";
import RspvIcon from "../../../../../assets/images/rspvGreen.svg";
import thumbsup from "../../../../../assets/images/thumbsup.svg";
import AwaitingResponse from "../../../../../assets/images/Awaiting-response.svg";
import TentativelyAccepted from "../../../../../assets/images/Tentatively-accepted.svg";
import thumbsdown from "../../../../../assets/images/thumbsdown.svg";
import Select from "react-select";
import { Col, Row } from "react-bootstrap";
import { Button, Table, TextField } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import AgendaContributorsModal from "./AgdendaContributorsModal/AgendaContributorsModal";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import { useNavigate } from "react-router-dom";
import {
  UpdateMeetingUserForAgendaContributor,
  getAllAgendaContributorApi,
  showAddAgendaContributor,
  showAgendaContributorsModals,
  showCancelModalAgendaContributor,
  meetingDetailsGlobalFlag,
  organizersGlobalFlag,
  agendaContributorsGlobalFlag,
  participantsGlobalFlag,
  agendaGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  actionsGlobalFlag,
  pollsGlobalFlag,
  attendanceGlobalFlag,
  uploadGlobalFlag,
} from "../../../../../store/actions/NewMeetingActions";
import ModalCrossIcon from "../Organizers/ModalCrossIconClick/ModalCrossIcon";
import tick from "../../../../../assets/images/PNG tick.png";
import NotifyAgendaModal from "./NotifyAgendaContributors/NotifyAgendaModal";
import CancelAgendaContributor from "./CancelButtonAgendaContributor/CancelAgendaContributor";
import NextModal from "../meetingDetails/NextModal/NextModal";
import PreviousModal from "../meetingDetails/PreviousModal/PreviousModal";
import { UpdateOrganizersMeeting } from "../../../../../store/actions/MeetingOrganizers_action";
const AgendaContributers = ({
  setParticipants,
  setAgendaContributors,
  setSceduleMeeting,
  currentMeeting,
  setCurrentMeetingID,
  editorRole,
  setEdiorRole,
  setEditMeeting,
  isEditMeeting,
  setorganizers,
  setPublishState,
  setAdvanceMeetingModalID,
  setViewFlag,
  setEditFlag,
  setCalendarViewModal,
  setDataroomMapFolderId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [specificUser, setSpecifiUser] = useState(0);
  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state
  );
  const [isEdit, setIsEdit] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isPublishedState, setIsPublishedState] = useState(false);
  const [disbaleIcon, setDisbaleIcon] = useState(false);
  const [isEditFlag, setIsEditFlag] = useState(0);
  const [notifyMessageField, setNotifyMessageField] = useState("");
  const [notificationTable, setNotificationTable] = useState(false);
  const [rspvTable, setrspvTable] = useState(false);
  const [flag, setFlag] = useState(3);
  const [prevFlag, setprevFlag] = useState(3);
  const [selectedOption, setSelectedOption] = useState({
    value: 1,
    label: (
      <>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <span className={styles["Options_classs_contributors"]}>
              {t("Grant-access-to-all-agenda-items-and-files")}
            </span>
          </Col>
        </Row>
      </>
    ),
  });

  const [rowsData, setRowsData] = useState([]);

  const [notifiedMembersData, setNotificedMembersData] = useState(null);

  const [viewAgendaContributors, setViewAgendaContributors] = useState(false);

  const [inputValues, setInputValues] = useState({});

  const shownotifyAgendaContrubutors = (id) => {
    dispatch(showAgendaContributorsModals(true));
    setSpecifiUser(id);
  };

  // const openCrossIconModal = () => {
  //   dispatch(showCrossConfirmationModal(true));
  // };

  useEffect(() => {
    dispatch(showCancelModalAgendaContributor(false));

    let getAllData = {
      MeetingID: currentMeeting !== null ? Number(currentMeeting) : 0,
    };
    dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
  }, []);

  const handleInputChange = (userID, newValue) => {
    // setInputValues((prevInputValues) => ({
    //   ...prevInputValues,
    //   [userID]: newValue,
    // }));
    setRowsData((prevRowsData) => {
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

  const handleRemoveContributor = (record) => {
    let removeData = rowsData.filter(
      (data, index) => data.userID !== record.userID
    );
    setRowsData(removeData);
    if (rowsData.length === 1) {
      setIsEditClicked(true);
    }
  };
  const AgendaColoumns = [
    {
      title: t("Name"),
      dataIndex: "userName",
      key: "userName",
      align: "left",
      width: "80px",
    },
    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      align: "left",
      width: "80px",
    },
    {
      title: t("contributor-title"),
      dataIndex: "Title",
      key: "Title",
      align: "left",
      width: "80px",
      render: (text, record) => {
        if (
          (Number(editorRole.status) === 9 ||
            Number(editorRole.status) === 8 ||
            Number(editorRole.status) === 10) &&
          editorRole.role === "Organizer" &&
          isEditMeeting === true
        ) {
          return <p>{record.Title}</p>;
        } else if (
          editorRole.role === "Agenda Contributor" &&
          isEditMeeting === true
        ) {
          return <p>{record.Title}</p>;
        } else {
          return (
            <Row>
              <Col lg={12} md={12} sm={12}>
                <TextField
                  disable={record.isEdit ? true : false}
                  placeholder={t("Contributor-title")}
                  labelClass={"d-none"}
                  width={"100%"}
                  maxLength={140}
                  applyClass={"Organizer_table"}
                  value={record.Title !== "" ? record.Title : ""} // Use the controlled value
                  change={(e) =>
                    handleInputChange(record.userID, e.target.value)
                  } // Update the inputValues when the user types
                />
              </Col>
            </Row>
          );
        }
      },
    },
    {
      title: t("Notification"),
      dataIndex: "isContributorNotified",
      key: "isContributorNotified",
      align: "center",
      width: "80px",
      className: "notification-class-table",
      render: (text, record) => {
        if (
          ((Number(editorRole.status) === 9 ||
            Number(editorRole.status) === 8 ||
            Number(editorRole.status) === 10) &&
            editorRole.role === "Organizer" &&
            isEditMeeting === true) ||
          (editorRole.role === "Agenda Contributor" && isEditMeeting === true)
        ) {
          return (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <img
                  draggable={false}
                  src={record.isContributorNotified ? greenMailIcon : redMailIcon}
                  className={
                    record.isEdit === true ? "cursor-pointer" : "pe-none"
                  }
                  height="30px"
                  width="30px"
                  alt=""
                />
              </Col>
            </Row>
          );
        } else if (record.isContributorNotified) {
          return (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <img
                  draggable={false}
                  src={record.isContributorNotified ? greenMailIcon : redMailIcon}
                  className={
                    record.isEdit === true ? "cursor-pointer" : "pe-none"
                  }
                  height="30px"
                  width="30px"
                  alt=""
                  onClick={() => shownotifyAgendaContrubutors(record.userID)}
                />
              </Col>
            </Row>
          );
        } else {
          return (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <img
                  draggable={false}
                  src={record.isContributorNotified ? greenMailIcon : redMailIcon}
                  className={
                    record.isEdit === true ? "cursor-pointer" : "pe-none"
                  }
                  height="30px"
                  alt=""
                  width="30px"
                  onClick={() => shownotifyAgendaContrubutors(record.userID)}
                />
              </Col>
            </Row>
          );
        }
      },
    },
    {
      title: "RSVP",
      dataIndex: "attendeeAvailability",
      key: "attendeeAvailability",
      width: "80px",
      render: (text, record) => {
        if (record.attendeeAvailability === 1) {
          return (
            <img
              draggable={false}
              src={AwaitingResponse}
              height="30px"
              width="30px"
              alt=""
            />
          );
        } else if (record.attendeeAvailability === 2) {
          return (
            <img
              draggable={false}
              src={thumbsup}
              height="30px"
              width="30px"
              alt=""
            />
          );
        } else if (record.attendeeAvailability === 3) {
          return (
            <img
              draggable={false}
              src={thumbsdown}
              height="30px"
              width="30px"
              alt=""
            />
          );
        } else if (record.attendeeAvailability === 4) {
          return (
            <img
              draggable={false}
              src={TentativelyAccepted}
              height="30px"
              width="30px"
              alt=""
            />
          );
        }
      },
      // render: (text, record) => {
      //   return (
      //     <>
      //       <Row>
      //         <Col lg={12} md={12} sm={12}>
      //           {((Number(editorRole.status) === 9 ||
      //             Number(editorRole.status) === 8 ||
      //             Number(editorRole.status) === 10) &&
      //             editorRole.role === "Organizer" &&
      //             isEditMeeting === true) ||
      //           (editorRole.role === "Agenda Contributor" &&
      //             isEditMeeting === true) ? (
      //             <img
      //               draggable={false}
      //               src={thumbsup}
      //               className={
      //                 record.isEdit === true ? "cursor-default" : "pe-none"
      //               }
      //               height="30px"
      //               width="30px"
      //               alt=""
      //             />
      //           ) : (
      //             <img
      //               draggable={false}
      //               src={thumbsup}
      //               className={
      //                 record.isEdit === true ? "cursor-default" : "pe-none"
      //               }
      //               height="30px"
      //               width="30px"
      //               alt=""
      //             />
      //           )}

      //           {/* <img draggable = {false} src={RspcAbstainIcon} height="30px" width="30px" /> */}
      //         </Col>
      //       </Row>
      //     </>
      //   );
      // },
    },
    {
      dataIndex: "Close",
      key: "Close",
      width: "80px",
      render: (text, record) => {
        return (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                {!record.isEdit && (
                  <img
                    draggable={false}
                    src={redcrossIcon}
                    width="21.79px"
                    alt=""
                    className="cursor-pointer"
                    height="21.79px"
                    onClick={() => handleRemoveContributor(record)}
                  />
                )}
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  // Filter columns based on the RSVP Condition
  // const finalColumns =
  //   Number(editorRole.status) === 1
  //     ? AgendaColoumns.filter((column) => column.key !== "rsvp")
  //     : AgendaColoumns;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // React select tick option handled
  const CustomOption = ({ innerProps, label, isSelected }) => (
    <div {...innerProps} className={styles["option"]}>
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["OverAll_padding"]}>
          <Row className="mt-2">
            <Col lg={11} md={11} sm={11}>
              <span className={styles["label_Styles"]}>{label}</span>
            </Col>
            <Col lg={1} md={1} sm={1}>
              {isSelected && <img alt="" draggable={false} src={tick} />}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );

  const options = [
    {
      value: 1,
      label: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Options_classs_contributors"]}>
                {t("Grant-access-to-all-agenda-items-and-files")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 2,
      label: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Options_classs_contributors"]}>
                {t("Grant-access-to-their-own-agenda-items-and-files-only")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const handleNextButton = () => {
    // setAgendaContributors(false);
    // setParticipants(true);
    let Data = { MeetingID: currentMeeting, StatusID: 1 };
    dispatch(
      UpdateOrganizersMeeting(
        navigate,
        t,
        5,
        Data,
        setEdiorRole,
        setAdvanceMeetingModalID,
        setDataroomMapFolderId,
        setSceduleMeeting,
        setPublishState,
        setCalendarViewModal
      )
    );
  };

  const openAddAgendaModal = () => {
    setIsEditFlag(0);
    dispatch(showAddAgendaContributor(true));
  };

  const enableNotificatoinTable = () => {
    // setNotificationTable(!notificationTable);
    dispatch(showCancelModalAgendaContributor(true));
  };

  //You Can Enable Rspv Table From Here
  // const anableRspvTable = () => {
  //   setrspvTable(!rspvTable);
  // };

  //Initiate the Add Flow with Empty stae

  const handleInitiatewithEmptyState = () => {
    setIsEditFlag(0);
    dispatch(showAddAgendaContributor(true));
  };

  const nextTabOrganizer = () => {
    // dispatch(ShowNextConfirmationModal(true));
    setAgendaContributors(false);
    setParticipants(true);
    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(false));
    dispatch(participantsGlobalFlag(true));
    dispatch(agendaGlobalFlag(false));
    dispatch(meetingMaterialGlobalFlag(false));
    dispatch(minutesGlobalFlag(false));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(false));
    dispatch(pollsGlobalFlag(false));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
  };
  const previousTabOrganizer = () => {
    // dispatch(showPreviousConfirmationModal(true));
    setorganizers(true);
    setAgendaContributors(false);
  };
  const handleEditBtn = () => {
    setIsEditFlag(1);
    setRowsData((prevRowsData) => {
      return prevRowsData.map((row) => {
        return {
          ...row,
          isEdit: false,
        };
      });
    });
  };

  const handleCancelBtn = () => {
    // if (NewMeetingreducer.getAllAgendaContributors.length > 0) {
    //   let agendaContributorData = [
    //     ...NewMeetingreducer.getAllAgendaContributors,
    //   ];

    //   // Initial values
    //   const initialValues = {};
    //   agendaContributorData.forEach((organizer) => {
    //     initialValues[organizer.userID] = organizer.contributorTitle;
    //   });

    //   setInputValues({ ...initialValues });

    //   let newArr = [];
    //   agendaContributorData.forEach((AgConData, index) => {
    //     newArr.push({
    //       userName: AgConData.userName,
    //       userID: AgConData.userID,
    //       displayPicture: "",
    //       email: AgConData.emailAddress,
    //       IsPrimaryOrganizer: false,
    //       IsOrganizerNotified: false,
    //       Title: AgConData.contributorTitle,
    //       isRSVP: AgConData.rsvp,
    //       isEdit: true,
    //     });
    //   });
    //   setRowsData(newArr);
    // }
    let removenewData = rowsData.filter((data, index) => data.isEdit === true);
    setRowsData(removenewData);
    let getAllData = {
      MeetingID: currentMeeting !== null ? Number(currentMeeting) : 0,
    };
    dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
    setIsEditClicked(false);
    // Create a copy of data with was coming
  };

  const handleSaveBtn = async () => {
    let newData = [];
    let copyData = [...rowsData];

    copyData.forEach((agendamembersData, agendamembersIndex) => {
      newData.push(agendamembersData.userID);
    });

    let Data = {
      MeetingID: currentMeeting,
      MeetingAttendeRoleID: 4,
      UpdatedUsers: newData,
    };
    await dispatch(
      UpdateMeetingUserForAgendaContributor(
        navigate,
        Data,
        t,
        rowsData,
        currentMeeting,
        isEditFlag,
        notifyMessageField
      )
    );
    setNotifyMessageField("");
    setIsEditClicked(false);
  };

  useEffect(() => {
    if (
      NewMeetingreducer.getAllAgendaContributors !== null &&
      NewMeetingreducer.getAllAgendaContributors !== undefined &&
      NewMeetingreducer.getAllAgendaContributors.length > 0
    ) {
      // Create a copy of data with was coming
      let agendaContributorData = [
        ...NewMeetingreducer.getAllAgendaContributors,
      ];

      setIsPublishedState(
        NewMeetingreducer.getAllAgendaContributorsIsPublished
      );

      // // Initial values
      // const initialValues = {};
      // agendaContributorData.forEach((organizer) => {
      //   initialValues[organizer.userID] = organizer.contributorTitle;
      // });

      // setInputValues({ ...initialValues });

      let newArr = [];
      agendaContributorData.forEach((AgConData, index) => {
        newArr.push({
          userName: AgConData.userName,
          userID: AgConData.userID,
          displayPicture: AgConData.userProfilePicture,
          email: AgConData.emailAddress,
          Title: AgConData.contributorTitle,
          isRSVP: AgConData.rsvp,
          isEdit: true,
          isContributorNotified: AgConData.isContributorNotified,
          agendaListRightsAll: AgConData.agendaListRightsAll,
          attendeeAvailability: AgConData.attendeeAvailability,
        });
      });
      setRowsData(newArr);
    } else {
      setRowsData([]);
    }
  }, [NewMeetingreducer.getAllAgendaContributors]);

  useEffect(() => {
    if (rowsData.length > 0) {
      let getifTrue = rowsData.some((data, index) => data.isEdit === false);
      setIsEdit(getifTrue);
    } else {
      setIsEdit(false);
    }
  }, [rowsData]);

  // useEffect(() => {
  //   dispatch(getAgendaAndVotingInfo_success([], ""));
  //   dispatch(GetCurrentAgendaDetails([]));
  //   dispatch(getAgendaVotingDetails_success([], ""));
  //   dispatch(saveFiles_success(null, ""));
  //   dispatch(saveAgendaVoting_success([], ""));
  //   dispatch(addUpdateAdvanceMeetingAgenda_success([], ""));
  //   dispatch(uploadDocument_success(null, ""));
  //   dispatch(getAllVotingResultDisplay_success([], ""));
  // }, []);

  console.log("rowsDatarowsData", rowsData)

  return (
    <>
      <section className="position-relative">
        <Row className="mt-5">
          {((Number(editorRole.status) === 9 ||
            Number(editorRole.status) === 8 ||
            Number(editorRole.status) === 10) &&
            editorRole.role === "Organizer" &&
            isEditMeeting === true) ||
          (editorRole.role === "Agenda Contributor" &&
            isEditMeeting === true) ? (
            <></>
          ) : (
            <Col lg={4} md={4} sm={12}>
              <Select
                options={options}
                value={selectedOption}
                onChange={handleOptionSelect}
                isSearchable={false}
                components={{
                  Option: CustomOption,
                }}
              />
            </Col>
          )}

          <Col
            lg={8}
            md={8}
            sm={12}
            className="d-flex justify-content-end gap-3"
          >
            {((Number(editorRole.status) === 9 ||
              Number(editorRole.status) === 8 ||
              Number(editorRole.status) === 10) &&
              editorRole.role === "Organizer" &&
              isEditMeeting === true) ||
            (editorRole.role === "Agenda Contributor" &&
              isEditMeeting === true) ? (
              <></>
            ) : isEdit || isEditClicked ? (
              <>
                <Button
                  text={t("Cancel")}
                  className={styles["Cancel_button"]}
                  onClick={handleCancelBtn}
                />
                <Button
                  text={t("Save")}
                  onClick={handleSaveBtn}
                  className={styles["Save_button"]}
                />
              </>
            ) : Number(editorRole.status) === 1 ? null : (
              <>
                <Button
                  text={t("Edit")}
                  className={styles["Edit_button"]}
                  icon={
                    <img
                      draggable={false}
                      src={EditIcon}
                      width="11.75px"
                      height="11.75px"
                      alt=""
                    />
                  }
                  onClick={handleEditBtn}
                />
                <Button
                  text={t("Add-more")}
                  icon={<img draggable={false} src={addmore} alt="" />}
                  className={styles["AddMoreBtn"]}
                  onClick={openAddAgendaModal}
                />
              </>
            )}
          </Col>
        </Row>
        <section className={styles["height2"]}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Table
                column={AgendaColoumns}
                scroll={{ y: "62vh" }}
                pagination={false}
                locale={{
                  emptyText: (
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-center"
                        >
                          <img
                            draggable={false}
                            src={emptyContributorState}
                            className="cursor-pointer"
                            width="274.05px"
                            alt=""
                            height="230.96px"
                            onClick={handleInitiatewithEmptyState}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-center"
                        >
                          <span className={styles["Empty_state_heading"]}>
                            {t("No-agenda-contributor")}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-center"
                        >
                          <span className={styles["Empty_state_Subheading"]}>
                            {t("There-are-no-agenda-contributors")}
                          </span>
                        </Col>
                      </Row>
                    </>
                  ),
                }}
                className="Polling_table"
                rows={rowsData}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              {!isEdit && !isEditClicked ? (
                <section className={styles["Footer_Class"]}>
                  <Button
                    text={t("Cancel")}
                    className={styles["Cancel_Organization"]}
                    onClick={enableNotificatoinTable}
                  />
                  {/* <Button
                text={t("Previous")}
                className={styles["publish_button_AgendaContributor"]}
                onClick={previousTabOrganizer}
              /> */}
                  <Button
                    text={t("Next")}
                    className={styles["publish_button_AgendaContributor"]}
                    onClick={nextTabOrganizer}
                  />
                  {/* {((Number(editorRole.status) === 9 ||
                Number(editorRole.status) === 8 ||
                Number(editorRole.status) === 10) &&
                editorRole.role === "Organizer" &&
                isEditMeeting === true) ||
              (editorRole.role === "Agenda Contributor" &&
                isEditMeeting === true) ? null : (
                <Button
                  text={t("Publish")}
                  className={styles["Next_Organization"]}
                  onClick={handleNextButton}
                />
              )} */}
                  {Number(editorRole.status) === 11 ||
                  Number(editorRole.status) === 12 ? (
                    <Button
                      disableBtn={
                        Number(currentMeeting) === 0 ||
                        isPublishedState === false
                          ? true
                          : false
                      }
                      text={t("Publish")}
                      className={styles["Next_Organization"]}
                      onClick={handleNextButton}
                    />
                  ) : isEditMeeting === true ? null : (
                    <Button
                      disableBtn={
                        Number(currentMeeting) === 0 ||
                        isPublishedState === false
                          ? true
                          : false
                      }
                      text={t("Publish")}
                      className={styles["Next_Organization"]}
                      onClick={handleNextButton}
                    />
                  )}
                  {/* {Number(editorRole.status) === 11 ||
              Number(editorRole.status) === 12 ? (
                <Button
                  text={t("Publish")}
                  className={styles["Next_Organization"]}
                  onClick={handleNextButton}
                />
              ) : null} */}
                </section>
              ) : (
                <section className={styles["Footer_Class2"]}></section>
              )}
            </Col>
          </Row>
        </section>
      </section>

      {NewMeetingreducer.agendaContributors && (
        <AgendaContributorsModal
          SelectedRSVP={selectedOption}
          rowsData={rowsData}
          setRowsData={setRowsData}
          setNotificedMembersData={setNotificedMembersData}
          currentMeeting={currentMeeting}
        />
      )}
      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.notifyAgendaContributors && (
        <NotifyAgendaModal
          notifiedMembersData={rowsData}
          setRowsData={setRowsData}
          notifyMessageField={notifyMessageField}
          setNotifyMessageField={setNotifyMessageField}
          specificUser={specificUser}
          setSpecifiUser={setSpecifiUser}
        />
      )}
      {NewMeetingreducer.nextConfirmModal && (
        <NextModal
          setAgendaContributors={setAgendaContributors}
          setParticipants={setParticipants}
          flag={flag}
        />
      )}

      {NewMeetingreducer.ShowPreviousModal && (
        <PreviousModal
          setorganizers={setorganizers}
          setAgendaContributors={setAgendaContributors}
          prevFlag={prevFlag}
        />
      )}

      {NewMeetingreducer.cancelAgendaContributor && (
        <CancelAgendaContributor
          setSceduleMeeting={setSceduleMeeting}
          setRowsData={setRowsData}
        />
      )}
    </>
  );
};

export default AgendaContributers;
