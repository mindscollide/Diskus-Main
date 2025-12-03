import React, { useEffect, useState } from "react";
import CustomModal from "../../../../components/elements/modal/Modal";
import { useSelector } from "react-redux";
import {
  isSameAsToday,
  multiDatePickerDateChangIntoUTC,
  newTimeFormaterAsPerUTCFullDate,
} from "../../../../commen/functions/date_formater";
import styles from "./MoreEvents.module.css";
import { dashboardCalendarEvent } from "../../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMeetingContext } from "../../../../context/MeetingContext";
import { Button } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
const MoreEvents = ({ moreEventModal, setMoreEventModal }) => {
  const { t } = useTranslation();
  const { setEditorRole } = useMeetingContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const moreEventsData = useSelector(
    (state) => state.meetingIdReducer.showMoreUpcomingData
  );
  const userProfileData = useSelector(
    (state) => state.settingReducer?.UserProfileData
  );
  const [moreUpcomingData, setMoreUpcomingData] = useState([]);
  const [todaysMeetings, setTodayMeetings] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [remainingMinutesAgo, setRemainingMinutesAgo] = useState(0);

  const currentUTCDateTime = multiDatePickerDateChangIntoUTC(new Date());
  const currentLanguage = localStorage.getItem("i18nextLng");

  const meetingDashboardCalendarEvent = (data, val) => {
    // Create a shallow copy of the data object to prevent mutation
    
    const dashboardData = {
      isPrimaryOrganizer: data.isPrimaryOrganizer,
      isMinutePublished: data.meetingDetails.isMinutePublished,
      pK_MDID: data.meetingDetails.pK_MDID,
      pK_CEID: data.meetingEvent.pK_CEID,
      fK_TZID: 0,
      fK_CETID: data.meetingEvent.fK_CETID,
      fK_CESID: data.meetingEvent.fK_CESID,
      location: data.meetingEvent.location,
      eventDate: data.meetingEvent.meetingDate,
      startTime: data.meetingEvent.startTime,
      endTime: data.meetingEvent.endTime,
      title: data.meetingDetails.title,
      description: data.meetingDetails.description,
      calenderEventSource: "Diskus",
      calenderEventType: "Meeting",
      timeZone: "Asia/Karachi",
      statusID: data.meetingDetails.statusID,
      participantRoleID: data.participantRoleID,
      isQuickMeeting: data.meetingDetails.isQuickMeeting,
      isChat: data.meetingDetails.isChat,
      isVideoCall: data.meetingDetails.isVideoCall,
      videoCallURL: data.meetingDetails.videoCallURL,
      talkGroupID: data.talkGroupID,
      IsViewOpenOnly: val === 1 ? true : false,
    };
    
    setEditorRole({
      status: String(data.meetingDetails.statusID),
      role:
        data.participantRoleID === 2
          ? "Participant"
          : data.participantRoleID === 4
          ? "Agenda Contributor"
          : "Organizer",
      isPrimaryOrganizer: false,
    });
    // Dispatch and navigate with no mutation
    dispatch(dashboardCalendarEvent({ ...dashboardData }));
    navigate("/Diskus/Meeting");
  };

  useEffect(() => {
    if (moreEventsData !== null && moreEventsData !== undefined) {
      try {
        const { upcomingEvents } = moreEventsData;
        // Separate today's meetings and upcoming meetings
        const todaysMeetingsData = [];
        const upcomingMeetingsData = [];

        if (upcomingEvents.length > 0) {
          upcomingEvents.forEach((upcomingEventsData) => {
            if (!upcomingEventsData?.meetingEvent) {
              console.warn("DataIsMissing", upcomingEventsData);
              return;
            }

            const { isSame } = isSameAsToday(
              `${upcomingEventsData.meetingEvent.meetingDate}${upcomingEventsData.meetingEvent.startTime}`
            );

            if (isSame) {
              todaysMeetingsData.push(upcomingEventsData);
            } else {
              upcomingMeetingsData.push(upcomingEventsData);
            }
          });

          //   setMoreUpcomingData(parsedData);
          setTodayMeetings(todaysMeetingsData);
          setUpcomingMeetings(upcomingMeetingsData);
        }
      } catch (error) {
        
      }
    }
  }, [moreEventsData]);

  useEffect(() => {
    if (userProfileData !== null) {
      let settingConfigurations = userProfileData?.configurations;
      if (
        settingConfigurations !== null &&
        settingConfigurations !== undefined &&
        settingConfigurations.length > 0
      ) {
        let findReminingMinutesAgo = settingConfigurations.find(
          (remainsData, index) =>
            remainsData?.configKey?.toLowerCase() ===
            "Join_Meeting_Before_Minutes".toLowerCase()
        );
        
        if (findReminingMinutesAgo !== undefined) {
          setRemainingMinutesAgo(Number(findReminingMinutesAgo.configValue));
        }
      }
    }
  }, [userProfileData]);

  
  return (
    <CustomModal
      show={moreEventModal}
      size={"md"}
      onHide={() => setMoreEventModal(false)}
      ModalTitle={<>Events</>}
      modalTitleClassName={styles["Moreevents_container_title"]}
      modalHeaderClassName={styles["Moreevents_container_header"]}
      modalBodyClassName={styles["Moreevents_container_body"]}
      ModalBody={
        <>
          <div className={styles["Moreevents_container"]}>
            <>
              {/* Today's Meetings */}
              {todaysMeetings.map((upcomingEventsData, index) => {
                const meetingDateTime =
                  upcomingEventsData?.meetingEvent?.meetingDate +
                  upcomingEventsData?.meetingEvent?.startTime;

                const currentDateObj = new Date(
                  currentUTCDateTime.substring(0, 4), // Year
                  parseInt(currentUTCDateTime.substring(4, 6)) - 1, // Month (0-based)
                  currentUTCDateTime.substring(6, 8), // Day
                  currentUTCDateTime.substring(8, 10), // Hours
                  currentUTCDateTime.substring(10, 12), // Minutes
                  currentUTCDateTime.substring(12, 14) // Seconds
                );

                const meetingDateObj = new Date(
                  meetingDateTime.substring(0, 4), // Year
                  parseInt(meetingDateTime.substring(4, 6)) - 1, // Month (0-based)
                  meetingDateTime.substring(6, 8), // Day
                  meetingDateTime.substring(8, 10), // Hours
                  meetingDateTime.substring(10, 12), // Minutes
                  meetingDateTime.substring(12, 14) // Seconds
                );

                const timeDifference = meetingDateObj - currentDateObj;
                const minutesDifference = Math.floor(
                  timeDifference / (1000 * 60)
                );

                return (
                  <div
                    key={`today-${index}`}
                    className={`${styles["upcoming_events"]} ${styles["event-details"]} ${styles["todayEvent"]} border-0 d-flex align-items-center`}>
                    <div
                      className={
                        (upcomingEventsData.meetingDetails.statusID === 1 &&
                          minutesDifference < remainingMinutesAgo) ||
                        upcomingEventsData.meetingDetails.statusID === 10
                          ? `${styles["event-details-block"]}`
                          : `${styles["event-details-block"]}`
                      }>
                      <p className={styles["events-description"]}>
                        {upcomingEventsData.meetingDetails.title}
                      </p>
                      <p className={styles["events-dateTime"]}>
                        {newTimeFormaterAsPerUTCFullDate(
                          upcomingEventsData.meetingEvent.meetingDate +
                            upcomingEventsData.meetingEvent.startTime,
                          currentLanguage
                        )}
                      </p>
                    </div>
                    {/* Buttons logic (same as before) */}
                    {upcomingEventsData.meetingDetails.statusID === 1 &&
                    upcomingEventsData.participantRoleID === 1 ? (
                      upcomingEventsData.meetingDetails.isQuickMeeting ===
                        true && minutesDifference < remainingMinutesAgo ? (
                        <Button
                          text={t("Start-meeting")}
                          className={styles["Start-Meeting-Upcoming"]}
                          onClick={() => {
                            meetingDashboardCalendarEvent(upcomingEventsData);
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                        />
                      ) : upcomingEventsData.meetingDetails.isQuickMeeting ===
                          false && minutesDifference < remainingMinutesAgo ? (
                        <Button
                          text={t("Start-meeting")}
                          className={styles["Start-Meeting-Upcoming"]}
                          onClick={() => {
                            meetingDashboardCalendarEvent(upcomingEventsData);
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                        />
                      ) : (
                        <Button
                          text={t("View-meeting")}
                          onClick={() => {
                            meetingDashboardCalendarEvent(
                              upcomingEventsData,
                              1
                            );
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                          className={styles["TodayViewMeetingButtonStyles"]}
                        />
                      )
                    ) : upcomingEventsData.meetingDetails.statusID === 10 ? (
                      upcomingEventsData.participantRoleID === 2 ? (
                        <Button
                          text={t("Join-meeting")}
                          className={styles["joining-Meeting-Upcoming"]}
                          onClick={() => {
                            meetingDashboardCalendarEvent(upcomingEventsData);
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                        />
                      ) : upcomingEventsData.participantRoleID === 4 ? (
                        <Button
                          text={t("Join-meeting")}
                          className={styles["joining-Meeting-Upcoming"]}
                          onClick={() => {
                            meetingDashboardCalendarEvent(upcomingEventsData);
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                        />
                      ) : upcomingEventsData.participantRoleID === 1 ? (
                        <Button
                          text={t("Join-meeting")}
                          className={styles["joining-Meeting-Upcoming"]}
                          onClick={() => {
                            meetingDashboardCalendarEvent(upcomingEventsData);
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                        />
                      ) : null
                    ) : (
                      <Button
                        text={t("View-meeting")}
                        onClick={() => {
                          meetingDashboardCalendarEvent(upcomingEventsData, 1);
                          localStorage.setItem(
                            "meetingTitle",
                            upcomingEventsData.meetingDetails.title
                          );
                        }}
                        className={styles["TodayViewMeetingButtonStyles"]}
                      />
                    )}
                  </div>
                );
              })}

              {/* Separator if there are today's meetings */}
              {todaysMeetings.length > 0 && upcomingMeetings.length > 0 && (
                <span className={styles["bordertop"]} />
              )}

              {/* Upcoming Meetings (non-today) */}
              {upcomingMeetings.map((upcomingEventsData, index) => {
                const meetingDateTime =
                  upcomingEventsData?.meetingEvent?.meetingDate +
                  upcomingEventsData?.meetingEvent?.startTime;

                const currentDateObj = new Date(
                  currentUTCDateTime.substring(0, 4), // Year
                  parseInt(currentUTCDateTime.substring(4, 6)) - 1, // Month (0-based)
                  currentUTCDateTime.substring(6, 8), // Day
                  currentUTCDateTime.substring(8, 10), // Hours
                  currentUTCDateTime.substring(10, 12), // Minutes
                  currentUTCDateTime.substring(12, 14) // Seconds
                );

                const meetingDateObj = new Date(
                  meetingDateTime.substring(0, 4), // Year
                  parseInt(meetingDateTime.substring(4, 6)) - 1, // Month (0-based)
                  meetingDateTime.substring(6, 8), // Day
                  meetingDateTime.substring(8, 10), // Hours
                  meetingDateTime.substring(10, 12), // Minutes
                  meetingDateTime.substring(12, 14) // Seconds
                );

                const timeDifference = meetingDateObj - currentDateObj;
                const minutesDifference = Math.floor(
                  timeDifference / (1000 * 60)
                );

                return (
                  <div
                    key={`upcoming-${index}`}
                    className={
                      (upcomingEventsData.meetingDetails.statusID === 1 &&
                        minutesDifference < remainingMinutesAgo) ||
                      upcomingEventsData.meetingDetails.statusID === 10
                        ? `${styles["upcoming_events"]} ${styles["event-details"]} ${styles["todayEvent"]} border-0 d-flex align-items-center`
                        : ` ${styles["event-details"]}  d-flex align-items-center`
                    }>
                    <div
                      className={
                        (upcomingEventsData.meetingDetails.statusID === 1 &&
                          minutesDifference < remainingMinutesAgo) ||
                        upcomingEventsData.meetingDetails.statusID === 10
                          ? `${styles["event-details-block"]}`
                          : `${styles["event-details-block"]}`
                      }>
                      <p className={styles["events-description"]}>
                        {upcomingEventsData.meetingDetails.title}
                      </p>
                      <p className={styles["events-dateTime"]}>
                        {newTimeFormaterAsPerUTCFullDate(
                          upcomingEventsData.meetingEvent.meetingDate +
                            upcomingEventsData.meetingEvent.startTime,
                          currentLanguage
                        )}
                      </p>
                    </div>
                    {/* Buttons logic (same as before) */}
                    {upcomingEventsData.meetingDetails.statusID === 1 &&
                    upcomingEventsData.participantRoleID === 1 ? (
                      upcomingEventsData.meetingDetails.isQuickMeeting ===
                        true && minutesDifference < remainingMinutesAgo ? (
                        <Button
                          text={t("Start-meeting")}
                          className={styles["Start-Meeting-Upcoming"]}
                          onClick={() => {
                            meetingDashboardCalendarEvent(upcomingEventsData);
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                        />
                      ) : upcomingEventsData.meetingDetails.isQuickMeeting ===
                          false && minutesDifference < remainingMinutesAgo ? (
                        <Button
                          text={t("Start-meeting")}
                          className={styles["Start-Meeting-Upcoming"]}
                          onClick={() => {
                            meetingDashboardCalendarEvent(upcomingEventsData);
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                        />
                      ) : (
                        <Button
                          text={t("View-meeting")}
                          onClick={() => {
                            meetingDashboardCalendarEvent(
                              upcomingEventsData,
                              1
                            );
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                          className={styles["ViewMeetingButtonStyles"]}
                        />
                      )
                    ) : upcomingEventsData.meetingDetails.statusID === 10 ? (
                      upcomingEventsData.participantRoleID === 2 ? (
                        <Button
                          text={t("Join-meeting")}
                          className={styles["joining-Meeting-Upcoming"]}
                          onClick={() => {
                            meetingDashboardCalendarEvent(upcomingEventsData);
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                        />
                      ) : upcomingEventsData.participantRoleID === 4 ? (
                        <Button
                          text={t("Join-meeting")}
                          className={styles["joining-Meeting-Upcoming"]}
                          onClick={() => {
                            meetingDashboardCalendarEvent(upcomingEventsData);
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                        />
                      ) : upcomingEventsData.participantRoleID === 1 ? (
                        <Button
                          text={t("Join-meeting")}
                          className={styles["joining-Meeting-Upcoming"]}
                          onClick={() => {
                            meetingDashboardCalendarEvent(upcomingEventsData);
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                        />
                      ) : (
                        <Button
                          text={t("View-meeting")}
                          onClick={() => {
                            meetingDashboardCalendarEvent(
                              upcomingEventsData,
                              1
                            );
                            localStorage.setItem(
                              "meetingTitle",
                              upcomingEventsData.meetingDetails.title
                            );
                          }}
                          className={styles["ViewMeetingButtonStyles"]}
                        />
                      )
                    ) : (
                      <Button
                        text={t("View-meeting")}
                        onClick={() => {
                          meetingDashboardCalendarEvent(upcomingEventsData, 1);
                          localStorage.setItem(
                            "meetingTitle",
                            upcomingEventsData.meetingDetails.title
                          );
                        }}
                        className={styles["ViewMeetingButtonStyles"]}
                      />
                    )}
                  </div>
                );
              })}
            </>
          </div>
        </>
      }
    />
  );
};

export default MoreEvents;
