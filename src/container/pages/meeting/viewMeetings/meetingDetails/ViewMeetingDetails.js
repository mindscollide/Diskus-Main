import React, { useEffect, useState } from "react";
import styles from "./ViewMeetingDetails.module.css";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Notification,
  Loader,
} from "../../../../../components/elements";
import Messegeblue from "../../../../../assets/images/blue Messege.svg";
import BlueCamera from "../../../../../assets/images/blue Camera.svg";
import ClipboardIcon from "../../../../../assets/images/Clipboard_Icon.png";
import { useDispatch } from "react-redux";
import {
  cleareAllState,
  CleareMessegeNewMeeting,
  ClearMessegeMeetingdetails,
  GetAllMeetingDetailsApiFunc,
  searchNewUserMeeting,
  showGetAllMeetingDetialsInit,
} from "../../../../../store/actions/NewMeetingActions";
import { utcConvertintoGMT } from "../../../../../commen/functions/date_formater";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resolutionResultTable } from "../../../../../commen/functions/date_formater";
import { UpdateOrganizersMeeting } from "../../../../../store/actions/MeetingOrganizers_action";
import CancelButtonModal from "./CancelButtonModal/CancelButtonModal";
import moment from "moment";
import {
  FetchMeetingURLApi,
  FetchMeetingURLClipboard,
} from "../../../../../store/actions/NewMeetingActions";

const ViewMeetingDetails = ({
  setorganizers,
  setmeetingDetails,
  advanceMeetingModalID,
  setViewAdvanceMeetingModal,
  setAdvanceMeetingModalID,
  setMeetingDetails,
  ediorRole,
  setAgenda,
  setEdiorRole,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [cancelModalView, setCancelModalView] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState(0);

  // For cancel with no modal Open
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");
  let currentMeeting = Number(localStorage.getItem("currentMeetingLS"));
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));

  const [rows, setRows] = useState([
    {
      selectedOption: "",
      dateForView: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    },
  ]);

  //For Custom language datepicker
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [meetingDetails, setMeetingDetailsData] = useState({
    MeetingTitle: "",
    MeetingType: 0,
    Location: "",
    Description: "",
    Link: "",
    ReminderFrequency: {
      value: 0,
      label: "",
    },
    ReminderFrequencyTwo: {
      value: 0,
      label: "",
    },
    ReminderFrequencyThree: {
      value: 0,
      label: "",
    },
    Notes: "",
    groupChat: false,
    AllowRSPV: false,
    NotifyMeetingOrganizer: false,
    RecurringOptions: {
      value: 0,
      label: "",
    },
    IsVideoCall: false,
  });

  useEffect(() => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(GetAllMeetingDetailsApiFunc(Data, navigate, t));
    let Data2 = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(
      FetchMeetingURLClipboard(
        Data2,
        navigate,
        t,
        currentUserID,
        currentOrganization
      )
    );
  }, []);

  const handleUpdateNext = () => {
    setmeetingDetails(false);
    setorganizers(true);
  };

  const handleEndDateChange = (index, date) => {
    let newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getUTCHours()).slice(-2);
      const minutes = ("0" + newDate.getUTCMinutes()).slice(-2);
      const seconds = ("0" + newDate.getUTCSeconds()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours.toString().padStart(2, "0")}${minutes
        .toString()
        .padStart(2, "0")}${seconds.toString().padStart(2, "0")}`;

      const updatedRows = [...rows];
      updatedRows[index].endDate = formattedTime;
      updatedRows[index].endTime = newDate;
      setRows(updatedRows);
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  //funciton cancel button
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
    setmeetingDetails(false);
  };

  let endMeetingRequest = {
    MeetingID: Number(advanceMeetingModalID),
    StatusID: 9,
  };

  console.log(NewMeetingreducer.Loading, "NewMeetingreducerNewMeetingreducer");
  // Showing The reposnse messege
  useEffect(() => {
    if (
      NewMeetingreducer.ResponseMessage !== "" &&
      NewMeetingreducer.ResponseMessage !== t("Record-found") &&
      NewMeetingreducer.ResponseMessage !== t("No-record-found")
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
      dispatch(ClearMessegeMeetingdetails());
    } else {
      dispatch(ClearMessegeMeetingdetails());
    }
  }, [NewMeetingreducer.ResponseMessage]);

  //Fetching All Saved Data
  useEffect(() => {
    try {
    } catch {}
    console.log("meetingStatus", NewMeetingreducer);
    if (
      NewMeetingreducer.getAllMeetingDetails !== null &&
      NewMeetingreducer.getAllMeetingDetails !== undefined
    ) {
      let MeetingData =
        NewMeetingreducer.getAllMeetingDetails.advanceMeetingDetails;
      let getmeetingDates = MeetingData.meetingDates;
      let getmeetingRecurrance = MeetingData.meetingRecurrance;
      let getmeetingReminders = MeetingData.meetingReminders;
      let getmeetingStatus = MeetingData.meetingStatus.status;
      console.log("meetingStatus", NewMeetingreducer);
      console.log("meetingStatus", getmeetingStatus);
      setMeetingStatus(Number(getmeetingStatus));
      let getmeetingType = MeetingData.meetingType;
      let wasPublishedFlag = MeetingData.wasMeetingPublished;
      setMeetingDetailsData({
        MeetingTitle: MeetingData.meetingTitle,
        MeetingType: {
          PK_MTID: getmeetingType.pK_MTID,
          Type: getmeetingType.type,
        },
        Location: MeetingData.location,
        Description: MeetingData.description,
        Link: MeetingData.videoCallURl,
        ReminderFrequency: {
          value:
            getmeetingReminders[0] !== undefined
              ? getmeetingReminders[0]?.pK_MRID
              : 0,
          label:
            getmeetingReminders[0] !== undefined
              ? getmeetingReminders[0]?.description
              : "",
        },
        ReminderFrequencyTwo: {
          value:
            getmeetingReminders[1] !== undefined
              ? getmeetingReminders[1]?.pK_MRID
              : 0,
          label:
            getmeetingReminders[1] !== undefined
              ? getmeetingReminders[1]?.description
              : "",
        },
        ReminderFrequencyThree: {
          value:
            getmeetingReminders[2] !== undefined
              ? getmeetingReminders[2]?.pK_MRID
              : 0,
          label:
            getmeetingReminders[2] !== undefined
              ? getmeetingReminders[2]?.description
              : "",
        },
        Notes: MeetingData.notes,
        groupChat: MeetingData.isTalkGroup,
        AllowRSPV: MeetingData.allowRSVP,
        NotifyMeetingOrganizer: MeetingData.notifyAdminOnRSVP,
        RecurringOptions: {
          value: getmeetingRecurrance.recurranceID,
          label: getmeetingRecurrance.recurrance,
        },
        IsVideoCall: MeetingData.isVideo,
      });
      let newDateTimeData = [];
      if (
        getmeetingDates !== null &&
        getmeetingDates !== undefined &&
        getmeetingDates.length > 0
      ) {
        getmeetingDates.forEach((data, index) => {
          newDateTimeData.push({
            selectedOption: data.meetingDate,
            startDate: data.startTime,
            endDate: data.endTime,
            endTime: resolutionResultTable(data.meetingDate + data.endTime),
            startTime: resolutionResultTable(data.meetingDate + data.startTime),
            dateForView: resolutionResultTable(
              data.meetingDate + data.startTime
            ),
          });
        });
      }
      setRows(newDateTimeData);
    }
  }, [NewMeetingreducer.getAllMeetingDetails]);

  const joinMeetingCall = () => {
    let Data = {
      MeetingID: currentMeeting,
    };
    dispatch(
      FetchMeetingURLApi(Data, navigate, t, currentUserID, currentOrganization)
    );
    localStorage.setItem("meetingTitle", meetingDetails.MeetingTitle);
  };

  const copyToClipboard = () => {
    if (
      NewMeetingreducer.CurrentMeetingURL !== undefined &&
      NewMeetingreducer.CurrentMeetingURL !== null &&
      NewMeetingreducer.CurrentMeetingURL !== ""
    ) {
      navigator.clipboard.writeText(NewMeetingreducer.CurrentMeetingURL);
      setOpen({
        ...open,
        flag: true,
        message: "URL copied to clipboard",
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
      }, 3000);
      dispatch(CleareMessegeNewMeeting());
    }
  };

  useEffect(() => {
    if (
      NewMeetingreducer.ResponseMessage !== "" &&
      NewMeetingreducer.ResponseMessage !== t("Data-available") &&
      NewMeetingreducer.ResponseMessage !== t("No-data-available") &&
      NewMeetingreducer.ResponseMessage !== t("Record-found") &&
      NewMeetingreducer.ResponseMessage !== t("No-record-found")
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

  // useEffect(() => {
  //   if (
  //     NewMeetingreducer.CurrentMeetingURL !== null &&
  //     NewMeetingreducer.CurrentMeetingURL !== undefined &&
  //     NewMeetingreducer.CurrentMeetingURL !== ""
  //   ) {
  //     const copyToClipboard = async () => {
  //       try {
  //         await navigator.clipboard.writeText(
  //           NewMeetingreducer.CurrentMeetingURL
  //         );
  //         setOpen({
  //           ...open,
  //           flag: true,
  //           message: "URL copied to clipboard",
  //         });
  //         setTimeout(() => {
  //           setOpen({
  //             ...open,
  //             flag: false,
  //             message: "",
  //           });
  //         }, 3000);
  //         dispatch(CleareMessegeNewMeeting());
  //       } catch (error) {
  //         console.error("Unable to copy text to clipboard", error);
  //       }
  //     };

  //     copyToClipboard();
  //   }
  // }, [NewMeetingreducer.CurrentMeetingURL]);

  console.log("NewMeetingReducerNewMeetingReducer", NewMeetingreducer);
  console.log("meetingDetailsmeetingDetails", meetingDetails);

  return (
    <section>
      {meetingStatus === 10 && (
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
            {Number(ediorRole.status) === 10 &&
            ediorRole.role === "Organizer" &&
            meetingDetails.IsVideoCall === true ? (
              <>
                <Button
                  text={t("End-meeting")}
                  className={styles["LeaveMeetinButton"]}
                  onClick={() =>
                    dispatch(
                      UpdateOrganizersMeeting(
                        navigate,
                        endMeetingRequest,
                        t,
                        4,
                        setViewAdvanceMeetingModal,
                        setAdvanceMeetingModalID
                      )
                    )
                  }
                />
              </>
            ) : meetingDetails.IsVideoCall === true ? (
              <>
                {/* <Button
                  text={t("Join-Video-Call")}
                  className={styles["JoinMeetingButton"]}
                  onClick={joinMeetingCall}
                /> */}
                <Button
                  text={t("Leave-meeting")}
                  className={styles["LeaveMeetinButton"]}
                  onClick={() => {
                    setViewAdvanceMeetingModal(false);
                    setAdvanceMeetingModalID(null);
                  }}
                />
              </>
            ) : (
              <Button
                text={t("Leave-meeting")}
                className={styles["LeaveMeetinButton"]}
                onClick={() => {
                  setViewAdvanceMeetingModal(false);
                  setAdvanceMeetingModalID(null);
                }}
              />
            )}
          </Col>
        </Row>
      )}

      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className={styles["ScrollerMeeting_Active"]}
        >
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Heading_Gray_meeting"]}>
                {meetingDetails.MeetingType?.Type} | {meetingDetails.Location}
              </span>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["MeetingTitle_Heading"]}>
                {meetingDetails.MeetingTitle}
              </span>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["ParaGraph_SavedMeeting"]}>
                {meetingDetails.Description}
              </span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col lg={5} md={5} sm={5}>
              <Row className="mt-1">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["NOtes_heading"]}>{t("Notes")}</span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["ParaGraph_SavedMeeting"]}>
                    {meetingDetails.Notes}
                  </span>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Scedule_OnHeading"]}>
                    {t("Scheduled-on")}
                  </span>
                </Col>
              </Row>
              <Row>
                {rows.map((data, index) => {
                  console.log(data, "datadtatdtatdta");

                  const formattedStartDate = utcConvertintoGMT(
                    data.selectedOption + data.startDate
                  );
                  const formattedEndDate = utcConvertintoGMT(
                    data.selectedOption + data.endDate
                  );

                  console.log(
                    { formattedStartDate, formattedEndDate },
                    "testdatetimt"
                  );
                  return (
                    <Col key={index} lg={12} md={12} sm={12}>
                      <span className={styles["SceduledDateTime"]}>
                        {moment(formattedStartDate).format("HH:MM a")} -{" "}
                        {moment(formattedEndDate).format("HH:MM a")} ,{" "}
                        {moment(formattedEndDate).format("DD MMM YYYY")}
                        {/* {formattedStartDate} */}
                      </span>
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col lg={7} md={7} sm={7}>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex align-items-center gap-1"
                >
                  {meetingDetails.groupChat && (
                    <img
                      src={Messegeblue}
                      height="20.44px"
                      width="25.68px"
                      alt=""
                    />
                  )}
                  {meetingDetails.IsVideoCall && (
                    <>
                      <Button
                        text={t("Join-Video-Call")}
                        className={styles["JoinMeetingButton"]}
                        onClick={joinMeetingCall}
                      />
                      <img
                        src={BlueCamera}
                        height="17.84px"
                        width="27.19px"
                        alt=""
                        className={styles["blue-icon"]}
                      />
                      <img
                        src={ClipboardIcon}
                        height="40px"
                        width="40px"
                        alt=""
                        onClick={() => copyToClipboard()}
                        className={styles["clipboard-icon"]}
                      />
                      {/* <span className={styles["LinkClass"]}>
                        {meetingDetails.Link}
                      </span> */}
                    </>
                  )}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["NOtes_heading"]}>{t("RSVP")}</span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["RspvClassDetails"]}>
                    {meetingDetails.AllowRSPV
                      ? t("RSVP-allowed-and-notify")
                      : t("RSVP-not-allowed")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col lg={6} md={6} sm={6}>
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["NOtes_heading"]}>
                        {t("Reminder-frequency ")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    {meetingDetails.ReminderFrequency && (
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["RspvClassDetails"]}>
                          {meetingDetails.ReminderFrequency.label}
                        </span>
                      </Col>
                    )}

                    {meetingDetails.ReminderFrequencyTwo && (
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["RspvClassDetails"]}>
                          {meetingDetails.ReminderFrequencyTwo.label}
                        </span>
                      </Col>
                    )}
                    {meetingDetails.ReminderFrequencyThree && (
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["RspvClassDetails"]}>
                          {meetingDetails.ReminderFrequencyThree.label}
                        </span>
                      </Col>
                    )}
                  </Row>
                </Col>
                <Col lg={6} md={6} sm={6}>
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["NOtes_heading"]}>
                        {t("Recurring")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["ParaGraph_SavedMeeting"]}>
                        {meetingDetails.RecurringOptions.label}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-2">
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
            className={styles["Next_Meeting_SaveMeeting"]}
            onClick={handleUpdateNext}
          />
        </Col>
      </Row>
      {meetingDetails.MeetingTitle === "" ? <Loader /> : null}
      {cancelModalView && (
        <CancelButtonModal
          setCancelModalView={setCancelModalView}
          cancelModalView={cancelModalView}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          setMeetingDetails={setmeetingDetails}
          setEdiorRole={setEdiorRole}
          setAdvanceMeetingModalID={setAdvanceMeetingModalID}
        />
      )}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </section>
  );
};

export default ViewMeetingDetails;
