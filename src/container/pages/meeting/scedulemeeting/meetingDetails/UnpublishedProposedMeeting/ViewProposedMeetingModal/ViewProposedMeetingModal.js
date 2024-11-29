import React, { useEffect, useState } from "react";
import styles from "./ViewProposedMeetingModal.module.css";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import profile from "../../../../../../../assets/images/profile.svg";
import { useSelector } from "react-redux";
import { Button } from "../../../../../../../components/elements";
import { useDispatch } from "react-redux";
import { ProposedMeetingViewFlagAction } from "../../../../../../../store/actions/NewMeetingActions";
const ViewProposedMeetingModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
  });
  const [sendResponseByDate, setSendResponseByDate] = useState("");
  const [partcipatns, setParticipants] = useState([]);

  //Meeting Details Data UseEffect
  useEffect(() => {
    try {
      if (
        getAllMeetingDetails.advanceMeetingDetails !== null &&
        getAllMeetingDetails.advanceMeetingDetails !== undefined
      ) {
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
        getAllProposedDatesData !== null &&
        getAllProposedDatesData !== undefined
      ) {
        setSendResponseByDate(getAllProposedDatesData.deadLineDate);
      } else {
      }
    } catch (error) {
      console.log(error, "errorerrorerrorerror");
    }
  }, [getAllProposedDatesData]);

  //Handling Cancel Button OnClick
  const hadleCancelButtonClick = () => {
    console.log("Click");
    dispatch(ProposedMeetingViewFlagAction(false));
  };

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
                <Col lg={6} md={6} sm={6}>
                  <span className={styles["BoxCardParticipant"]}>
                    03:30 pm - 05:30 pm | 20th May 2024
                  </span>
                </Col>
              </Row>
            </div>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <div className="d-flex flex-column flex-wrap">
                  <span className={styles["SendResponseByDateHeading"]}>
                    {t("Send-response-by")}
                  </span>
                  <span className={styles["SendResponseByDate"]}>
                    {sendResponseByDate}
                  </span>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <div className="d-flex flex-column flex-wrap">
                  <span className={styles["SendResponseByDateHeading"]}>
                    {t("Proposed-on")}
                  </span>
                  <Row>
                    {partcipatns.length > 0 && partcipatns !== null
                      ? partcipatns.map((data, index) => {
                          console.log(data, "datadata");
                          return (
                            <>
                              <Col lg={6} md={6} sm={6} className="mt-2">
                                <span className={styles["BoxCardParticipant"]}>
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
