import React, { useEffect, useState } from "react";
import styles from "./AgendaContributors.module.css";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Table,
  Notification,
  Loader,
} from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import emptyContributorState from "../../../../../assets/images/emptyStateContributor.svg";
import thumbsup from "../../../../../assets/images/thumbsup.svg";
import thumbsdown from "../../../../../assets/images/thumbsdown.svg";
import AwaitingResponse from "../../../../../assets/images/Awaiting-response.svg";
import TentativelyAccepted from "../../../../../assets/images/Tentatively-accepted.svg";
import { useNavigate } from "react-router-dom";
import {
  CleareMessegeNewMeeting,
  cleareAllState,
  getAllAgendaContributorApi,
  getAllAgendaContributor_fail,
  searchNewUserMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../../store/actions/NewMeetingActions";
import redMailIcon from "../../../../../assets/images/redmail.svg";
import NORSVP from "../../../../../assets/images/No-RSVP.png";
import rspvGreenIcon from "../../../../../assets/images/rspvGreen.svg";
import greenMailIcon from "../../../../../assets/images/greenmail.svg";
import CancelButtonModal from "../meetingDetails/CancelButtonModal/CancelButtonModal";
const AgendaContributers = ({
  setParticipants,
  setAgendaContributors,
  setorganizers,
  setViewAdvanceMeetingModal,
  advanceMeetingModalID,
  setEdiorRole,
  setAdvanceMeetingModalID,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [cancelModalView, setCancelModalView] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  // For cancel with no modal Open
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");

  useEffect(() => {
    let getAllData = {
      MeetingID:
        advanceMeetingModalID !== null ? Number(advanceMeetingModalID) : 0,
    };
    dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
    return () => {
      dispatch(cleareAllState());
    };
  }, []);

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
          isContributedNotified: true,
          attendeeAvailability: AgConData.attendeeAvailability,
        });
      });
      setRowsData(newArr);
    }
  }, [NewMeetingreducer.getAllAgendaContributors]);

  const handleCancelBtn = () => {
    setCancelModalView(true);
  };
  const handleNextBtn = () => {
    setParticipants(true);
    setAgendaContributors(false);
  };
  const handlePreviousBtn = () => {
    setorganizers(true);
    setAgendaContributors(false);
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
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));

    setAgendaContributors(false);
    localStorage.removeItem("folderDataRoomMeeting");
    setEdiorRole({ status: null, role: null });
    setAdvanceMeetingModalID(null);
    // setMeetingDetails(false);
  };

  let allowRSVPValue = NewMeetingreducer?.getAllAgendaContributorsAllowRSVP;
  let AgendaContributorViewColoumns = [];
  if (allowRSVPValue === true) {
    AgendaContributorViewColoumns = [
      {
        title: t("Name"),
        dataIndex: "userName",
        key: "userName",
        align: "left",
        ellipsis: true,
        // width: "300px",
      },

      {
        title: t("Email"),
        dataIndex: "email",
        key: "email",
        align: "left",
        ellipsis: true,
        // width: "400px",
      },
      {
        title: t("Contributor-title"),
        dataIndex: "Title",
        key: "Title",
        align: "left",
        ellipsis: true,
        // width: "300px",
      },

      {
        title: "RSVP",
        dataIndex: "attendeeAvailability",
        key: "attendeeAvailability",
        align: "left",
        ellipsis: true,
        // width: "120px",
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
        //   if (record.isRSVP === true) {
        //     return (
        //       <img
        //         draggable={false}
        //         src={thumbsup}
        //         height="30px"
        //         width="30px"
        //         alt=""
        //       />
        //     );
        //   } else {
        //     return (
        //       <img
        //         draggable={false}
        //         src={thumbsdown}
        //         height="30px"
        //         width="30px"
        //         alt=""
        //       />
        //     );
        //   }
        // },
      },

      {
        title: t("Notification"),
        dataIndex: "isContributedNotified",
        key: "isContributedNotified",
        // width: "180px",
        ellipsis: true,
        render: (text, record) => {
          if (record.isContributedNotified === true) {
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
          } else if (record.isContributedNotified === false) {
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
    AgendaContributorViewColoumns = [
      {
        title: t("Name"),
        dataIndex: "userName",
        key: "userName",
        align: "left",
        ellipsis: true,
        // width: "300px",
        
      },

      {
        title: t("Email"),
        dataIndex: "email",
        key: "email",
        align: "left",
        ellipsis: true,
        // width: "400px",
      },
      {
        title: t("Contributor-title"),
        dataIndex: "Title",
        key: "Title",
        align: "left",
        ellipsis: true,
        // width: "300px",
      },
      {
        title: t("Notification"),
        dataIndex: "isContributedNotified",
        key: "isContributedNotified",
        ellipsis: true,
        // width: "180px",
        render: (text, record) => {
          if (record.isContributedNotified === true) {
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
          } else if (record.isContributedNotified === false) {
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

  useEffect(() => {
    if (
      NewMeetingreducer.ResponseMessage !== "" &&
      NewMeetingreducer.ResponseMessage !== t("No-data-available") &&
      NewMeetingreducer.ResponseMessage !== "" &&
      NewMeetingreducer.ResponseMessage !== t("No-record-found") &&
      NewMeetingreducer.ResponseMessage !== undefined
    ) {
      setOpen({
        ...open,
        flag: true,
        message: NewMeetingreducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
      }, 3000);
      dispatch(CleareMessegeNewMeeting());
    } else {
      dispatch(CleareMessegeNewMeeting());
    }
  }, [NewMeetingreducer.ResponseMessage]);

  console.log("NewMeetingreducerNewMeetingreducer", NewMeetingreducer);

  return (
    <>
      <section>
        <Row>
          <Col lg={12} md={12} sm={12} className={styles["FixedHeight"]}>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={AgendaContributorViewColoumns}
                  scroll={{ y: rowsData.length === 0? "52vh": "36vh" }}
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
          </Col>
        </Row>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            {/* <Button
              text={t("Cancel")}
              className={styles["Cancel_Button_Organizers_view"]}
              onClick={handleCancelBtn}
            /> */}
            <Button
              text={t("Cancel")}
              className={styles["Cancel_Meeting_Details"]}
              onClick={handleCancelMeetingNoPopup}
            />
            {/* <Button
              text={t("Previous")}
              className={styles["Next_Button_Organizers_view"]}
              onClick={handlePreviousBtn}
            /> */}
            <Button
              text={t("Next")}
              className={styles["Next_Button_Organizers_view"]}
              onClick={handleNextBtn}
            />
          </Col>
        </Row>
      </section>
      {cancelModalView && (
        <CancelButtonModal
          setCancelModalView={setCancelModalView}
          cancelModalView={cancelModalView}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          setMeetingDetails={setAgendaContributors}
        />
      )}

      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
      {/* {NewMeetingreducer.Loader2 && <Loader />} */}
    </>
  );
};

export default AgendaContributers;
