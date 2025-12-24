import React, { useEffect, useState } from "react";
import styles from "./ViewProposedMeetingModal.module.css";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Button } from "../../../../../../../components/elements";
import { useDispatch } from "react-redux";
import {
  GetAllMeetingDetialsData,
  ParticipantsData,
  proposedMeetingData,
  searchNewUserMeeting,
} from "../../../../../../../store/actions/NewMeetingActions";
import {
  ProposedMeetingDateViewFormat,
  ProposedMeetingViewDateFormatWithTime,
} from "../../../../../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
const ViewProposedMeetingModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //Getting the Current Language from LocalStorage
  let locale = localStorage.getItem("i18nextLng");

  const MeetingStatusSocket = useSelector(
    (state) => state.meetingIdReducer.MeetingStatusSocket
  );
  //Getting all Proposed meeting Data
  const getAllMeetingDetails = useSelector(
    (state) => state.NewMeetingreducer.getAllMeetingDetails
  );

  //Getting all Proposed meeting Participants
  const getAllSavedparticipantsData = useSelector(
    (state) => state.NewMeetingreducer.getAllSavedparticipants
  );

  //Getting all Proposed meeting Dates
  const getAllProposedDatesData = useSelector(
    (state) => state.NewMeetingreducer.getAllProposedDates
  );

  //Local States
  const [basicmeetingTitle, setBasicMeetingTitle] = useState({
    Title: "",
    Description: "",
    MeetingType: "",
    meetingId: 0,
  });
  const [sendResponseByDate, setSendResponseByDate] = useState("");
  const [partcipatns, setParticipants] = useState([]);
  const [meetingProposedDates, setMeetingProposedDates] = useState([]);

  useEffect(() => {
    return () => {
      dispatch(GetAllMeetingDetialsData());

      dispatch(ParticipantsData());

      dispatch(proposedMeetingData());
    };
  }, []);
  //Meeting Details Data UseEffect
  useEffect(() => {
    try {
      if (
        getAllMeetingDetails.advanceMeetingDetails !== null &&
        getAllMeetingDetails.advanceMeetingDetails !== undefined
      ) {

        console.log(getAllMeetingDetails, "getAllMeetingDetailsgetAllMeetingDetailsgetAllMeetingDetails")
        //For Meeting Title
        setBasicMeetingTitle({
          Title: getAllMeetingDetails.advanceMeetingDetails.meetingTitle,
          Description: getAllMeetingDetails.advanceMeetingDetails.description,
          MeetingType:
            getAllMeetingDetails.advanceMeetingDetails.meetingType.type,
        });
      }
    } catch (error) {
      console.log(error, "errorerrorerror");
    }
  }, [getAllMeetingDetails]);

  //Getting All participatns Data
  useEffect(() => {
    try {
      if (
        getAllSavedparticipantsData.length > 0 &&
        getAllSavedparticipantsData !== undefined
      ) {
        setParticipants(getAllSavedparticipantsData);
      }
    } catch (error) {
      console.log(error, "errorerrorerror");
    }
  }, [getAllSavedparticipantsData]);

  //Getting All Participants Dates Data
  useEffect(() => {
    try {
      if (
        getAllProposedDatesData &&
        getAllProposedDatesData !== null &&
        getAllProposedDatesData !== undefined
      ) {
        setSendResponseByDate(getAllProposedDatesData.deadLineDate);
        setMeetingProposedDates(getAllProposedDatesData.meetingProposedDates);
      } else {
      }
    } catch (error) {
      console.log(error, "errorerrorerrorerror");
    }
  }, [getAllProposedDatesData]);

  //Handling Cancel Button OnClick
  const hadleCancelButtonClick = () => {
    console.log("Click");
    let meetingpageRow = localStorage.getItem("MeetingPageRows");
    let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
    let userID = localStorage.getItem("userID");
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings: false,
    };
    localStorage.removeItem("folderDataRoomMeeting");

    dispatch(searchNewUserMeeting(navigate, searchData, t, 1));
  };

  useEffect(() => {
    if (MeetingStatusSocket !== null && MeetingStatusSocket !== undefined) {
      try {
        let meetingStatusID = MeetingStatusSocket?.meetingStatusID;
        let meetingID = MeetingStatusSocket?.meetingID;

        console.log(MeetingStatusSocket, meetingStatusID, meetingID, "MeetingStatusSocketMeetingStatusSocket")
      } catch (error) {

      }
    }
  }, [MeetingStatusSocket])

  return (
    <>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["ViewProposedMeetingMainHeading"]}>
            {t("View-proposed-meeting")}
          </span>
        </Col>
      </Row>
      <section className={styles["BackGroundPaperEffect"]}>
        <Row className="mt-3">
          <Col lg={6} md={6} sm={6}>
            <div className="d-flex flex-column flex-wrap">
              <span className={styles["MeetingTypeHeading"]}>
                {basicmeetingTitle.MeetingType}
              </span>
              <span className={styles["MeetingTitleTag"]}>
                {basicmeetingTitle.Title}
              </span>
            </div>

            <div className="d-flex flex-column flex-wrap">
              <span className={styles["MeetingDescriptionHeading"]}>
                {t("Description")}
              </span>
              <span className={styles["MeetingDescription"]}>
                {basicmeetingTitle.Description}
              </span>
            </div>
          </Col>
          <Col lg={6} md={6} sm={6}>
            <div className="d-flex flex-column flex-wrap">
              <span className={styles["ProposedOnHeading"]}>
                {t("Proposed-on")}
              </span>
              <Row>
                {Array.isArray(meetingProposedDates) &&
                  meetingProposedDates.length > 0 ? (
                  meetingProposedDates.map((dateData, index) => {
                    console.log(dateData, "dateData");
                    const formattedDate = ProposedMeetingViewDateFormatWithTime(
                      dateData,
                      locale
                    );
                    return (
                      <Col lg={6} md={6} sm={6} className="mt-2" key={index}>
                        <span className={styles["BoxCardDate"]}>
                          {formattedDate}
                        </span>
                      </Col>
                    );
                  })
                ) : (
                  <p>No meeting proposed dates available</p>
                )}
              </Row>
            </div>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <div className="d-flex flex-column flex-wrap">
                  <span className={styles["SendResponseByDateHeading"]}>
                    {t("Send-response-by")}
                  </span>
                  <span className={styles["SendResponseByDate"]}>
                    {ProposedMeetingDateViewFormat(sendResponseByDate, locale)}
                  </span>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <div className="d-flex flex-column flex-wrap">
                  <span className={styles["SendResponseByDateHeading"]}>
                    {t("Participants")}
                  </span>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["ScrollerParticipant"]}
                    >
                      <Row>
                        {partcipatns.length > 0 && partcipatns !== null
                          ? partcipatns.map((data, index) => {
                            return (
                              <>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={6}
                                  key={index}
                                  className="mt-3"
                                >
                                  <span
                                    className={styles["BoxCardParticipant"]}
                                  >
                                    <img
                                      src={`data:image/jpeg;base64,${data?.userProfilePicture?.displayProfilePictureName}`}
                                      alt=""
                                      width={25}
                                    />
                                    <span className={styles["UserName"]}>
                                      {data.userName}
                                    </span>
                                  </span>
                                </Col>
                              </>
                            );
                          })
                          : null}
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
            <Button
              text={t("Cancel")}
              className={styles["CancelButtonViewProposedMeeting"]}
              onClick={hadleCancelButtonClick}
            />
          </Col>
        </Row>
      </section>
    </>
  );
};

export default ViewProposedMeetingModal;
