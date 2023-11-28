import React, { useState, useEffect } from "react";
import styles from "./Organizers.module.css";
import {
  Button,
  Table,
  Notification,
} from "../../../../../components/elements";
import greenMailIcon from "../../../../../assets/images/greenmail.svg";
import redMailIcon from "../../../../../assets/images/redmail.svg";
import rspvGreenIcon from "../../../../../assets/images/rspvGreen.svg";
import NORSVP from "../../../../../assets/images/No-RSVP.png";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  cleareAllState,
  searchNewUserMeeting,
} from "../../../../../store/actions/NewMeetingActions";
import {
  clearResponseMessage,
  GetAllMeetingOrganizers,
  getAllMeetingOrganizers_fail,
} from "../../../../../store/actions/MeetingOrganizers_action";
import CancelButtonModal from "../meetingDetails/CancelButtonModal/CancelButtonModal";

const Organizers = ({
  editorRole,
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
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");

  const [viewOrganizers, setviewOrganizers] = useState(false);
  const [cancelModalView, setCancelModalView] = useState(false);

  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state
  );
  console.log(
    MeetingOrganizersReducer,
    NewMeetingreducer,
    "MeetingOrganizersReducerMeetingOrganizersReducer"
  );
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
    setCancelModalView(true);
  };

  useEffect(() => {
    if (advanceMeetingModalID) {
      let Data = { MeetingID: advanceMeetingModalID };
      dispatch(GetAllMeetingOrganizers(Data, navigate, t));
    }
    return () => {
      dispatch(cleareAllState());
    };
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
      render: (text) => <label className="column-boldness">{text}</label>,
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
              alt=""
            />
          );
        } else {
          return (
            <img
              draggable={false}
              src={NORSVP}
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
      width: "180px",
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

  const previousTabOrganizer = () => {
    setAgendaContributors(false);
    setmeetingDetails(true);
    setorganizers(false);
    setRowsData([]);
  };

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
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    setViewAdvanceMeetingModal(false);
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
      MeetingOrganizersReducer.ResponseMessage !== t("Record-found")
    ) {
      setOpen({
        ...open,
        flag: true,
        message: MeetingOrganizersReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
      }, 3000);
      dispatch(clearResponseMessage(""));
    } else {
      dispatch(clearResponseMessage(""));
    }
  }, [MeetingOrganizersReducer.ResponseMessage]);

  return (
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
      <Row>
        <Col lg={12} md={12} sm={12}>
          <section className={styles["Footer_button"]}>
            {/* <Button
              text={t("Cancel")}
              className={styles["Cancel_Organization"]}
              onClick={handleCancelOrganizer}
            /> */}
            <Button
              text={t("Cancel")}
              className={styles["Cancel_Meeting_Details"]}
              onClick={handleCancelMeetingNoPopup}
            />
            <Button
              text={t("Previous")}
              className={styles["publish_button_Organization"]}
              onClick={previousTabOrganizer}
            />

            <Button
              text={t("Next")}
              className={styles["publish_button_Organization"]}
              onClick={nextTabOrganizer}
            />
          </section>
        </Col>
      </Row>

      <Notification setOpen={setOpen} open={open.open} message={open.message} />

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
