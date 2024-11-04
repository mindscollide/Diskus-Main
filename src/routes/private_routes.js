import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
const PrivateRoutes = () => {
  const currentUrl = window.location.href.toLowerCase();
  console.log(currentUrl, "currentUrlcurrentUrlcurrentUrl");
  const navigate = useNavigate();

  // Effect hook to perform actions based on the current URL
  useEffect(() => {
    // Action: Meeting RSVP
    if (
      currentUrl.includes(
        "DisKus/Meeting/Useravailabilityformeeting?action=".toLowerCase()
      )
    ) {
      // Extract action parameter from URL
      const parts = currentUrl.split("?action=");
      if (parts.length === 2) {
        const remainingString = parts[1];
        // Save RSVP data to local storage
        localStorage.setItem("RSVP", remainingString);
      } else {
        // Clear RSVP data from local storage if condition not met
        localStorage.removeItem("RSVP");
      }
    }

    // Action: Data Room
    if (currentUrl.includes("DisKus/dataroom?action=".toLowerCase())) {
      // Extract action parameter from URL
      const parts = currentUrl.split("?action=");
      if (parts.length === 2) {
        const remainingString = parts[1];
        // Save Data Room email data to local storage
        localStorage.setItem("DataRoomEmail", remainingString);
      } else {
        // Clear Data Room email data from local storage if condition not met
        localStorage.removeItem("DataRoomEmail");
      }
    }

    // Action: Meeting Minute Collaboration
    if (
      currentUrl.includes(
        "DisKus/Meeting/Meetingminutecollaborate?action=".toLowerCase()
      )
    ) {
      // Add action-specific logic here if needed
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("meetingMin", parts);
    }

    // Action: Meeting Proposed
    if (
      currentUrl.includes(
        "DisKus/Meeting?Meetingproposed_action=".toLowerCase()
      )
    ) {
      // Add action-specific logic here if needed
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("meetingprop", parts);
    }

    // Action: Cancel Meeting
    if (
      currentUrl.includes("DisKus/Meeting?Cancelmeeting_action=".toLowerCase())
    ) {
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("meetingCanc", parts);
    }

    // Action: Delete Meeting
    if (
      currentUrl.includes("DisKus/Meeting?Deletemeeting_action=".toLowerCase())
    ) {
      // Add action-specific logic here if needed
      navigate("/Diskus/Meeting");
    }

    // Action: Update Meeting
    if (
      currentUrl.includes("DisKus/Meeting?Updatemeeting_action=".toLowerCase())
    ) {
      // Add action-specific logic here if needed
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("meetingUpd", parts);
    }

    // Action: Start Meeting
    if (
      currentUrl.includes("DisKus/Meeting?Startmeeting_action=".toLowerCase())
    ) {
      // Add action-specific logic here if needed
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("meetingStr", parts);
    }

    if (
      currentUrl.includes(
        "DisKus/Meeting?Usermeetingproposedatespoll_action=".toLowerCase()
      )
    ) {
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("UserMeetPropoDatPoll", parts);
    }

    // Action: Poll Expire
    if (
      currentUrl.includes("DisKus/polling?PollExpire_action=".toLowerCase())
    ) {
      console.log("pollExpirepollExpirepollExpire", currentUrl);
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("pollExpire", parts);
      // Add action-specific logic here if needed
    }

    // Action: Poll Published
    if (
      currentUrl.includes("DisKus/polling?PollPublished_action=".toLowerCase())
    ) {
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("poPub", parts);
      // Add action-specific logic here if needed
    }

    // Action: Poll Update
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/polling?PollUpdated_action=".toLowerCase())
    ) {
      // Add action-specific logic here if needed
      const parts = currentUrl.split("action=")[1];
      console.log(parts, "pollingpolling");

      localStorage.setItem("poUpda", parts);
    }

    // Action: Resolution Reminder
    if (
      currentUrl.includes(
        "DisKus/resolution?Resolutionreminder_action=".toLowerCase()
      )
    ) {
      // Add action-specific logic here if needed
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("resVot", parts);
    }

    if (
      currentUrl.includes(
        "DisKus/resolution?ResolutionVoter_action=".toLowerCase()
      )
    ) {
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("resVot", parts);
    }
    if (
      currentUrl.includes(
        "DisKus/resolution?ResolutionNonVoter_action=".toLowerCase()
      )
    ) {
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("resNonVot", parts);
    }
    // Action: Organization Status Enable
    if (
      currentUrl.includes(
        "DisKus/Admin/Organizationstatusenable?action=".toLowerCase()
      )
    ) {
      // Add action-specific logic here if needed
    }

    // Action: Organization Subscription Enable
    if (
      currentUrl.includes("DisKus/Admin/Organizationsubscriptionenable?action=")
    ) {
      // Add action-specific logic here if needed
    }

    if (currentUrl.includes("GuestVideoCall?validateguest_action")) {
      console.log(currentUrl, "currentUrlcurrentUrlcurrentUrl");
    }
    if (
      currentUrl.includes(
        "DisKus/Meeting?Activeagendaedit_action".toLowerCase()
      )
    ) {
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("mtAgUpdate", parts);
    }
  }, [currentUrl]);

  let Blur = localStorage.getItem("blur");
  let RoleID = Number(localStorage.getItem("roleID"));
  const token =
    localStorage.getItem("token") !== undefined &&
    localStorage.getItem("token") !== null
      ? localStorage.getItem("token")
      : "";
  let currentUser =
    (RoleID === 3 || RoleID === 4) && (Blur === undefined || Blur === null)
      ? true
      : null;
  console.log(
    { currentUser, token },
    "PrivateRoutesPrivateRoutesPrivateRoutes"
  );
  return currentUser && token ? (
    <Outlet />
  ) : (
    <Navigate
      to={
        currentUrl !== "" &&
        (currentUrl.includes(
          "DisKus/Meeting/Useravailabilityformeeting?action="
        ) ||
          currentUrl.includes("DisKus/dataroom") ||
          currentUrl.includes("DisKus/Meeting") ||
          currentUrl.includes("DisKus/polling") ||
          currentUrl.includes("DisKus/groups") ||
          currentUrl.includes("DisKus/committee") ||
          currentUrl.includes("DisKus/resolution"))
          ? "/"
          : currentUser === null && token === ""
          ? "/"
          : "*"
      }
    />
  );
};
export default PrivateRoutes;
