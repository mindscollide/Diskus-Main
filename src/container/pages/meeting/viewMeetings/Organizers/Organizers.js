import React, { useState, useEffect } from "react";
import styles from "./Organizers.module.css";
import {
  Button,
  Table,
  Notification,
} from "../../../../../components/elements";
import greenMailIcon from "../../../../../assets/images/greenmail.svg";
import redMailIcon from "../../../../../assets/images/redmail.svg";
import thumbsup from "../../../../../assets/images/thumbsup.svg";
import thumbsdown from "../../../../../assets/images/thumbsdown.svg";
import AwaitingResponse from "../../../../../assets/images/Awaiting-response.svg";
import TentativelyAccepted from "../../../../../assets/images/Tentatively-accepted.svg";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  cleareAllState,
  searchNewUserMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../../store/actions/NewMeetingActions";
import {
  clearResponseMessage,
  GetAllMeetingOrganizers,
} from "../../../../../store/actions/MeetingOrganizers_action";
import CancelButtonModal from "../meetingDetails/CancelButtonModal/CancelButtonModal";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";

const Organizers = ({
  setmeetingDetails,
  setorganizers,
  advanceMeetingModalID,
  setViewAdvanceMeetingModal,
  setAgendaContributors,
  setAdvanceMeetingModalID,
  setEdiorRole,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let currentUserEmail = localStorage.getItem("userEmail");
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentUserName = localStorage.getItem("name");

  // For cancel with no modal Open
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");

  const [cancelModalView, setCancelModalView] = useState(false);

  const { MeetingOrganizersReducer } = useSelector((state) => state);

  const currentOrganizerData = {
    displayPicture: "",
    email: currentUserEmail,
    isChecked: true,
    isPrimaryOrganizer: true,
    isOrganizerNotified: true,
    isRSVP: true,
    organizerTitle: "",
    userID: currentUserID,
    userName: currentUserName,
    isDeletable: false,
  };

  const [rowsData, setRowsData] = useState([currentOrganizerData]);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    if (advanceMeetingModalID) {
      let Data = { MeetingID: advanceMeetingModalID };
      dispatch(GetAllMeetingOrganizers(Data, navigate, t));
    }
    return () => {
      dispatch(cleareAllState());
    };
  }, []);

  let allowRSVPValue =
    MeetingOrganizersReducer?.AllMeetingOrganizersData?.allowRSVP;
  let MeetingColoumns = [];
  if (allowRSVPValue === true) {
    MeetingColoumns = [
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
        title: t("Organizer-title"),
        dataIndex: "organizerTitle",
        key: "organizerTitle",
        align: "center",
        ellipsis: true,
      },

      {
        dataIndex: "isPrimaryOrganizer",
        key: "isPrimaryOrganizer",
        align: "left",
        ellipsis: true,
        render: (text) => (
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-3 align-items-center"
            >
              <label className="column-boldness">
                {text === true ? t("Primary") : t("Non-primary")}
              </label>
            </Col>
          </Row>
        ),
      },
      {
        title: "RSVP",
        dataIndex: "attendeeAvailability",
        key: "attendeeAvailability",
        align: "left",
        ellipsis: true,
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
      },

      {
        title: t("Notification"),
        dataIndex: "isOrganizerNotified",
        key: "isOrganizerNotified",
        ellipsis: true,
        render: (text, record) => {
          if (record.isOrganizerNotified === true) {
            return (
              <Row>
                <Col
                  lg={7}
                  md={7}
                  sm={7}
                  className="d-flex justify-content-center"
                >
                  <img
                    draggable={false}
                    src={greenMailIcon}
                    height="30px"
                    width="30px"
                    alt=""
                  />
                </Col>
              </Row>
            );
          } else if (record.isOrganizerNotified === false) {
            return (
              <Row>
                <Col
                  lg={7}
                  md={7}
                  sm={7}
                  className="d-flex justify-content-center"
                >
                  <img
                    draggable={false}
                    src={redMailIcon}
                    height="30px"
                    width="30px"
                    alt=""
                  />
                </Col>
              </Row>
            );
          }
        },
      },
    ];
  } else {
    MeetingColoumns = [
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
        ellipsis: true,
        align: "left",
      },

      {
        title: t("Email"),
        dataIndex: "email",
        key: "email",
        ellipsis: true,
        align: "left",
      },
      {
        title: t("Organizer-title"),
        dataIndex: "organizerTitle",
        key: "organizerTitle",
        align: "center",
        ellipsis: true,
      },

      {
        dataIndex: "isPrimaryOrganizer",
        key: "isPrimaryOrganizer",
        align: "left",
        ellipsis: true,
        render: (text) => (
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-3 align-items-center"
            >
              <label className="column-boldness w-100">
                {text === true ? t("Primary") : t("Non-primary")}
              </label>
            </Col>
          </Row>
        ),
      },
      {
        title: t("Notification"),
        dataIndex: "isOrganizerNotified",
        key: "isOrganizerNotified",
        ellipsis: true,
        render: (record) => {
          if (record.isOrganizerNotified === true) {
            return (
              <Row>
                <Col
                  lg={7}
                  md={7}
                  sm={7}
                  className="d-flex justify-content-center"
                >
                  <img
                    draggable={false}
                    src={greenMailIcon}
                    height="30px"
                    width="30px"
                    alt=""
                  />
                </Col>
              </Row>
            );
          } else if (record.isOrganizerNotified === false) {
            return (
              <Row>
                <Col
                  lg={7}
                  md={7}
                  sm={7}
                  className="d-flex justify-content-center"
                >
                  <img
                    draggable={false}
                    src={redMailIcon}
                    height="30px"
                    width="30px"
                    alt=""
                  />
                </Col>
              </Row>
            );
          }
        },
      },
    ];
  }

  const nextTabOrganizer = () => {
    setAgendaContributors(true);
    setmeetingDetails(false);
    setorganizers(false);
    setRowsData([]);
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
    setViewAdvanceMeetingModal(false);
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));

    setorganizers(false);
    localStorage.removeItem("folderDataRoomMeeting");
    setEdiorRole({ status: null, role: null });
    setAdvanceMeetingModalID(null);
  };

  useEffect(() => {
    if (
      MeetingOrganizersReducer.AllMeetingOrganizersData !== undefined &&
      MeetingOrganizersReducer.AllMeetingOrganizersData !== null &&
      MeetingOrganizersReducer.AllMeetingOrganizersData.length !== 0
    ) {
      const allMeetingOrganizers =
        MeetingOrganizersReducer.AllMeetingOrganizersData.meetingOrganizers;

      const updatedMeetingOrganizers = allMeetingOrganizers.map(
        (organizer) => ({
          ...organizer,
          disabledNotification: false,
          disabledTitle: true,
          disabledSwitch: true,
          disabledRSVP: false,
          isDeletable: false,
          NotificationMessage: "",
        })
      );

      setRowsData(updatedMeetingOrganizers);
    }
  }, [MeetingOrganizersReducer.AllMeetingOrganizersData]);

  useEffect(() => {
    if (
      MeetingOrganizersReducer.MeetingOrganizersData !== undefined &&
      MeetingOrganizersReducer.MeetingOrganizersData !== null &&
      MeetingOrganizersReducer.MeetingOrganizersData.length !== 0
    ) {
      const updatedRowsData = rowsData.map((organizer) => {
        const matchingOrganizer =
          MeetingOrganizersReducer.MeetingOrganizersData.find(
            (user) => user.userID === organizer.userID
          );

        if (matchingOrganizer) {
          // If a matching organizer is found in the global state, update the properties
          return {
            ...organizer,
            disabledTitle: matchingOrganizer.disabledTitle,
            disabledNotification: matchingOrganizer.disabledNotification,
            disabledSwitch: matchingOrganizer.disabledSwitch,
            disabledRSVP: matchingOrganizer.disabledRSVP,
            email: matchingOrganizer.email,
            isDeletable: matchingOrganizer.isDeletable,
            isOrganizerNotified: matchingOrganizer.isOrganizerNotified,
            isPrimaryOrganizer: matchingOrganizer.isPrimaryOrganizer,
            meetingID: advanceMeetingModalID,
            organizerTitle: matchingOrganizer.organizerTitle,
            rsvp: matchingOrganizer.rsvp,
            userName: matchingOrganizer.userName,
            NotificationMessage: matchingOrganizer.NotificationMessage,
            attendeeAvailability: matchingOrganizer.attendeeAvailability,
          };
        }

        return organizer;
      });

      // Check for any new organizers in MeetingOrganizersData that are not in rowsData
      MeetingOrganizersReducer.MeetingOrganizersData.forEach((organizer) => {
        if (!updatedRowsData.some((user) => user.userID === organizer.userID)) {
          updatedRowsData.push({
            ...organizer,
            disabledTitle: organizer.disabledTitle,
            disabledNotification: organizer.disabledNotification,
            disabledSwitch: organizer.disabledSwitch,
            disabledRSVP: organizer.disabledRSVP,
            email: organizer.email,
            isDeletable: organizer.isDeletable,
            isOrganizerNotified: organizer.isOrganizerNotified,
            isPrimaryOrganizer: organizer.isPrimaryOrganizer,
            meetingID: advanceMeetingModalID,
            organizerTitle: organizer.organizerTitle,
            rsvp: organizer.rsvp,
            userName: organizer.userName,
            NotificationMessage: organizer.NotificationMessage,
            attendeeAvailability: organizer.attendeeAvailability,
          });
        }
      });
      // Set the updated rowsData
      setRowsData(updatedRowsData);
    }
  }, [MeetingOrganizersReducer.MeetingOrganizersData]);

  useEffect(() => {
    const updatedRowsData = [...rowsData];

    MeetingOrganizersReducer.NotificationUpdateData.forEach((data) => {
      const index = updatedRowsData.findIndex(
        (rowData) => rowData.userID === data.userID
      );

      if (index !== -1) {
        updatedRowsData[index] = {
          ...updatedRowsData[index],
          isOrganizerNotified: true,
        };
      }
    });

    // Update the rowsData state with the modified data
    setRowsData(updatedRowsData);
  }, [MeetingOrganizersReducer.NotificationUpdateData]);

  useEffect(() => {
    if (
      MeetingOrganizersReducer.ResponseMessage !== "" ||
      MeetingOrganizersReducer.ResponseMessage !== t("No-record-found") ||
      MeetingOrganizersReducer.ResponseMessage !== t("No-records-found") ||
      MeetingOrganizersReducer.ResponseMessage !== ""
    ) {
      showMessage(MeetingOrganizersReducer.ResponseMessage, "success", setOpen);
      dispatch(clearResponseMessage(""));
    } else {
      dispatch(clearResponseMessage(""));
    }
  }, [MeetingOrganizersReducer.ResponseMessage]);

  return (
    <>
      <section className={`${"position-relative"} ${styles["height2"]}`}>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Table
              column={MeetingColoumns}
              scroll={{
                y: rowsData.length === 0 ? "55vh" : "36vh",
                x: "hidden",
              }}
              pagination={false}
              className="Polling_table"
              rows={rowsData}
            />
          </Col>
        </Row>

        <Row>
          <Col lg={12} md={12} sm={12}>
            <section className={styles["Footer_button"]}>
              <Button
                text={t("Cancel")}
                className={styles["Cancel_Meeting_Details"]}
                onClick={handleCancelMeetingNoPopup}
              />

              <Button
                text={t("Next")}
                className={styles["publish_button_Organization"]}
                onClick={nextTabOrganizer}
              />
            </section>
          </Col>
        </Row>
      </section>

      <Notification open={open} setOpen={setOpen} />

      {cancelModalView && (
        <CancelButtonModal
          setCancelModalView={setCancelModalView}
          cancelModalView={cancelModalView}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          setMeetingDetails={setorganizers}
        />
      )}
    </>
  );
};

export default Organizers;
