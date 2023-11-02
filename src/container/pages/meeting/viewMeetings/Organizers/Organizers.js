import React, { useState, useEffect } from "react";
import styles from "./Organizers.module.css";
import {
  Button,
  Table,
  TextField,
  Switch,
  Loader,
  Notification,
} from "../../../../../components/elements";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import addmore from "../../../../../assets/images/addmore.png";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import greenMailIcon from "../../../../../assets/images/greenmail.svg";
import redMailIcon from "../../../../../assets/images/redmail.svg";
import rspvGreenIcon from "../../../../../assets/images/rspvGreen.svg";
import rspvAbstainIcon from "../../../../../assets/images/rspvAbstain.svg";
import CrossResolution from "../../../../../assets/images/resolutions/cross_icon_resolution.svg";
import NORSVP from "../../../../../assets/images/No-RSVP.png";
import mail from "../../../../../assets/images/mail.svg";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showAddUserModal,
  showCancelModalOrganizers,
  showCrossConfirmationModal,
  showNotifyOrganizors,
  sendRecentNotificationOrganizerModal,
} from "../../../../../store/actions/NewMeetingActions";
import ModalOrganizor from "./ModalAddUserOrganizer/ModalOrganizor";
import ModalCrossIcon from "./ModalCrossIconClick/ModalCrossIcon";
import NotifyOrganizers from "./NotifyOrganizers/NotifyOrganizers";
import SendNotificationOrganizer from "./NotifyOrganizers/SendRecentNotification";
import OrganizersViewPage from "./OrganizerViewPage/OrganizersViewPage";
import {
  SaveMeetingOrganizers,
  clearResponseMessage,
  UpdateOrganizersMeeting,
  GetAllMeetingOrganizers,
  meetingOrganizers,
  selectedMeetingOrganizers,
  saveMeetingFlag,
  editMeetingFlag,
  notificationSendData,
} from "../../../../../store/actions/MeetingOrganizers_action";
import CancelModalOrganizer from "./CancelModalOrganizer/CancelModalOrganizer";

const Organizers = ({
  setAgendaContributors,
  setmeetingDetails,
  setorganizers,
  setParticipants,
  setAgenda,
  setMinutes,
  setactionsPage,
  setAttendance,
  setPolls,
  setMeetingMaterial,
  setSceduleMeeting,
  advanceMeetingModalID,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let currentUserEmail = localStorage.getItem("userEmail");
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentUserName = localStorage.getItem("name");

  const [viewOrganizers, setviewOrganizers] = useState(false);

  const [editState, setEditState] = useState(false);

  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state
  );
  const [inputValues, setInputValues] = useState({});

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
  });

  const handleCancelOrganizer = () => {
    setSceduleMeeting(false);
  };

  useEffect(() => {
    if (advanceMeetingModalID) {
      let Data = { MeetingID: advanceMeetingModalID };
      dispatch(GetAllMeetingOrganizers(Data, navigate, t));
    }
  }, []);

  const MeetingColoumns = [
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
      width: "200px",
      render: (text) => <label className={styles["Title_desc"]}>{text}</label>,
    },

    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      width: "250px",
      render: (text) => <label className="column-boldness">{text}</label>,
    },
    {
      title: t("Organizer-title"),
      dataIndex: "organizerTitle",
      key: "organizerTitle",
      width: "250px",
      render: (text, record) => (
        <Row>
          <Col lg={12} md={12} sm={12}>
            {inputValues[record.userID]}
          </Col>
        </Row>
      ),
    },

    {
      dataIndex: "isPrimaryOrganizer",
      key: "isPrimaryOrganizer",
      width: "200px",
      render: (text, record, rowIndex) => (
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex gap-3 align-items-center"
          >
            <label className="column-boldness">Primary</label>
          </Col>
        </Row>
      ),
    },
    {
      title: t("RSVP"),
      dataIndex: "rsvp",
      key: "rsvp",
      width: "120px",
      render: (text, record) => {
        if (record.isRSVP === true) {
          return (
            <img
              draggable={false}
              src={rspvGreenIcon}
              height="30px"
              width="30px"
            />
          );
        } else {
          return (
            <img draggable={false} src={NORSVP} height="30px" width="30px" />
          );
        }
      },
    },

    {
      title: t("Notification"),
      dataIndex: "isOrganizerNotified",
      key: "isOrganizerNotified",
      width: "180px",
      render: (text, record) => {
        console.log("RSVP", text, record);
        if (record.isOrganizerNotified === true) {
          return (
            <Row>
              <Col
                lg={7}
                md={7}
                sm={7}
                className="d-flex justify-content-center"
              >
                {record.disabledNotification === true ? (
                  <img
                    draggable={false}
                    src={greenMailIcon}
                    height="30px"
                    width="30px"
                  />
                ) : (
                  <img
                    draggable={false}
                    src={greenMailIcon}
                    height="30px"
                    width="30px"
                  />
                )}
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
                {record.disabledNotification === true ? (
                  <img
                    draggable={false}
                    src={redMailIcon}
                    height="30px"
                    width="30px"
                  />
                ) : (
                  <img
                    draggable={false}
                    src={redMailIcon}
                    height="30px"
                    width="30px"
                  />
                )}
              </Col>
            </Row>
          );
        }
      },
    },
    {
      // title: t('RSVP'),
      dataIndex: "isDeletable",
      key: "isDeletable",
      width: "120px",
      render: (text, record) => {
        if (record.isDeletable === true) {
          return (
            <img
              draggable={false}
              src={CrossResolution}
              height="30px"
              width="30px"
            />
          );
        } else {
          return null;
        }
      },
    },
  ];

  const previousTabOrganizer = () => {
    setAgendaContributors(false);
    setmeetingDetails(true);
    setorganizers(false);
    setParticipants(false);
    setAgenda(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
    setRowsData([]);
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
  };

  const nextTabOrganizer = () => {
    // setviewOrganizers(!viewOrganizers)
    // let Data = { meetingID: advanceMeetingModalID, StatusID: 1 };
    // dispatch(UpdateOrganizersMeeting(navigate, Data, t));
    // setRowsData([]);
    setAgendaContributors(true);
    setmeetingDetails(false);
    setorganizers(false);
    setParticipants(false);
    setAgenda(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
    setRowsData([]);
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
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
      console.log("updated Rows Data", updatedMeetingOrganizers);
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
          });
        }
      });

      // Set the updated rowsData
      setRowsData(updatedRowsData);
      console.log("updated Rows Data", updatedRowsData);
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
      MeetingOrganizersReducer.ResponseMessage ===
      "Organizers-saved-successfully"
    ) {
      setTimeout(
        setOpen({
          open: true,
          message: t("Organizers-saved-successfully"),
        }),
        3000
      );
    } else if (
      MeetingOrganizersReducer.ResponseMessage ===
      "Notification-sent-successfully"
    ) {
      setTimeout(
        setOpen({
          open: true,
          message: t("Notification-sent-successfully"),
        }),
        3000
      );
    } else if (
      MeetingOrganizersReducer.ResponseMessage ===
      "Notification-not-sent-successfully"
    ) {
      setTimeout(
        setOpen({
          open: true,
          message: t("Notification-not-sent-successfully"),
        }),
        3000
      );
    }
    dispatch(clearResponseMessage(""));
  }, [MeetingOrganizersReducer.ResponseMessage]);

  return (
    <>
      {viewOrganizers ? (
        <OrganizersViewPage />
      ) : (
        <>
          <section className="position-relative">
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={MeetingColoumns}
                  scroll={{ y: "62vh" }}
                  pagination={false}
                  className="Polling_table"
                  rows={rowsData}
                />
              </Col>
            </Row>
          </section>
          {NewMeetingreducer.notifyOrganizors === false &&
          MeetingOrganizersReducer.SaveMeetingFlag === false &&
          MeetingOrganizersReducer.EditMeetingFlag === false ? (
            <Row>
              <Col lg={12} md={12} sm={12}>
                <section className={styles["Footer_button"]}>
                  <Button
                    text={t("Cancel")}
                    className={styles["Cancel_Organization"]}
                    onClick={handleCancelOrganizer}
                  />

                  <Button
                    text={"Previous"}
                    className={styles["Cancel_Organization"]}
                    onClick={previousTabOrganizer}
                  />

                  <Button
                    text={"Next"}
                    className={styles["publish_button_Organization"]}
                    onClick={nextTabOrganizer}
                  />
                </section>
              </Col>
            </Row>
          ) : null}
        </>
      )}

      <Notification setOpen={setOpen} open={open.open} message={open.message} />

      {NewMeetingreducer.adduserModal && <ModalOrganizor />}
      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.notifyOrganizors && <NotifyOrganizers />}
      {NewMeetingreducer.sendNotificationOrganizerModal === true ? (
        <SendNotificationOrganizer />
      ) : null}
      {NewMeetingreducer.cancelModalOrganizer && (
        <CancelModalOrganizer setSceduleMeeting={setSceduleMeeting} />
      )}
    </>
  );
};

export default Organizers;
