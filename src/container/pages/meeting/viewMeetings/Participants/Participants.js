import React, { useState } from "react";
import styles from "./Participants.module.css";
import thumbsup from "../../../../../assets/images/thumbsup.svg";
import thumbsdown from "../../../../../assets/images/thumbsdown.svg";
import AwaitingResponse from "../../../../../assets/images/Awaiting-response.svg";
import TentativelyAccepted from "../../../../../assets/images/Tentatively-accepted.svg";
import emptyContributorState from "../../../../../assets/images/emptyStateContributor.svg";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Table,
  Notification,
  Loader,
} from "../../../../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CleareMessegeNewMeeting,
  GetAllSavedparticipantsAPI,
  cleareAllState,
  searchNewUserMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../../store/actions/NewMeetingActions";
import { useEffect } from "react";
import CancelButtonModal from "../meetingDetails/CancelButtonModal/CancelButtonModal";
import { Tooltip } from "antd";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";

const Participants = ({
  setParticipants,
  setAgenda,
  setAgendaContributors,
  setViewAdvanceMeetingModal,
  advanceMeetingModalID,
  setAdvanceMeetingModalID,
  setEdiorRole,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);

  const [cancelModalView, setCancelModalView] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // For cancel with no modal Open
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");

  //get all saved participants
  useEffect(() => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(GetAllSavedparticipantsAPI(Data, navigate, t, false));
    return () => {
      dispatch(cleareAllState());
      setRowsData([]);
    };
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
            attendeeAvailability: data.attendeeAvailability,
          });
        });
      } else {
        // IsParticipantsAddFlow;
      }

      setRowsData(getAllData);
    }
  }, [NewMeetingreducer.getAllSavedparticipants]);

  const handleNextBtn = () => {
    setAgenda(true);
    setParticipants(false);
  };

  const handleCancelMeetingNoPopup = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    console.log("chek search meeting");
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    setParticipants(false);
    localStorage.removeItem("folderDataRoomMeeting");

    setEdiorRole({ status: null, role: null });
    setAdvanceMeetingModalID(null);
    setViewAdvanceMeetingModal(false);
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
  };

  let allowRSVPValue = NewMeetingreducer?.getAllSavedparticipantsAllowrsvp;
  let ParticipantsViewColoumn = [];
  if (allowRSVPValue === true) {
    ParticipantsViewColoumn = [
      {
        title: t("Name"),
        dataIndex: "userName",
        key: "userName",
        align: "left",
        ellipsis: true,
      },

      {
        title: t("Email"),
        dataIndex: "email",
        key: "email",
        align: "left",
        ellipsis: true,
      },
      {
        title: t("Participant-title"),
        dataIndex: "Title",
        key: "Title",
        align: "center",
        ellipsis: true,
      },

      {
        title: t("Role"),
        dataIndex: "participantRole",
        key: "participantRole",
        align: "left",
        width: "249px",
        render: (text) => (
          <label className="column-boldness">{text.participantRole}</label>
        ),
      },
      {
        title: t("RSVP"),
        dataIndex: "attendeeAvailability",
        key: "attendeeAvailability",
        align: "left",
        width: "120px",
        render: (text, record) => {
          if (record.attendeeAvailability === 1) {
            return (
              <Tooltip placement="bottomLeft" title={t("Response-awaited")}>
                <img
                  draggable={false}
                  src={AwaitingResponse}
                  height="30px"
                  width="30px"
                  alt=""
                />
              </Tooltip>
            );
          } else if (record.attendeeAvailability === 2) {
            return (
              <Tooltip placement="bottomLeft" title={t("Accepted")}>
                <img
                  draggable={false}
                  src={thumbsup}
                  height="30px"
                  width="30px"
                  alt=""
                />
              </Tooltip>
            );
          } else if (record.attendeeAvailability === 3) {
            return (
              <Tooltip placement="bottomLeft" title={t("Rejected")}>
                <img
                  draggable={false}
                  src={thumbsdown}
                  height="30px"
                  width="30px"
                  alt=""
                />
              </Tooltip>
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
      },
    ];
  } else {
    ParticipantsViewColoumn = [
      {
        title: t("Name"),
        dataIndex: "userName",
        key: "userName",
        align: "left",
        ellipsis: true,
      },

      {
        title: t("Email"),
        dataIndex: "email",
        key: "email",
        align: "left",
        ellipsis: true,
      },
      {
        title: t("Participant-title"),
        dataIndex: "Title",
        key: "Title",
        align: "center",
        ellipsis: true,
      },

      {
        title: t("Role"),
        dataIndex: "participantRole",
        key: "participantRole",
        align: "left",
        width: "249px",
        render: (text) => (
          <label className="column-boldness">{text.participantRole}</label>
        ),
      },
    ];
  }

  useEffect(() => {
    if (
      NewMeetingreducer.ResponseMessage !== "" &&
      NewMeetingreducer.ResponseMessage !== t("No-data-available") &&
      NewMeetingreducer.ResponseMessage !== "" &&
      NewMeetingreducer.ResponseMessage !== t("No-record-found")
    ) {
      showMessage(NewMeetingreducer.ResponseMessage, "success", setOpen);
      dispatch(CleareMessegeNewMeeting());
    } else {
      dispatch(CleareMessegeNewMeeting());
    }
  }, [NewMeetingreducer.ResponseMessage]);

  return (
    <>
      <section className={styles["height2"]}>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={ParticipantsViewColoumn}
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
                              width="274.05px"
                              alt=""
                              height="230.96px"
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
                              {t("No-Participant")}
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
          </Col>
        </Row>

        <Row className="mt-5">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            <Button
              text={t("Cancel")}
              className={styles["Cancel_Meeting_Details"]}
              onClick={handleCancelMeetingNoPopup}
            />

            <Button
              text={t("Next")}
              className={styles["Next_Button_Organizers_view"]}
              onClick={handleNextBtn}
            />
          </Col>
        </Row>
        {cancelModalView && (
          <CancelButtonModal
            setCancelModalView={setCancelModalView}
            cancelModalView={cancelModalView}
            setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
            setMeetingDetails={setParticipants}
          />
        )}
        <Notification open={open} setOpen={setOpen} />
      </section>
      {NewMeetingreducer.LoadingParticipants && <Loader />}
    </>
  );
};

export default Participants;
