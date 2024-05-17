import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const currentUrl = window.location.href;

  // Effect hook to perform actions based on the current URL
  useEffect(() => {
    // Action: Meeting RSVP
    if (
      currentUrl.includes("DisKus/Meeting/Useravailabilityformeeting?action=")
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
    if (currentUrl.includes("DisKus/dataroom?action=")) {
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
      currentUrl.includes("DisKus/Meeting/Meetingminutecollaborate?action=")
    ) {
      // Add action-specific logic here if needed
    }

    // Action: Meeting Proposed
    if (currentUrl.includes("DisKus/Meeting/Meetingproposed?action=")) {
      // Add action-specific logic here if needed
    }

    // Action: Add Agenda Contributor
    if (currentUrl.includes("DisKus/Meeting?Addagendacontributor_action=")) {
      // Extract action parameter from URL
      // const parts = currentUrl.split("Addagendacontributor_action=")[1];
      // localStorage.setItem("AgCont", parts);
      // console.log(parts, "partspartsparts Addagendacontributor");
      // Add action-specific logic here if needed
    }

    // Action: Update Agenda Contributor
    if (currentUrl.includes("DisKus/Meeting?Updateagendacontributor_action=")) {
      // Add action-specific logic here if needed
      // const parts = currentUrl.split("Updateagendacontributor_action=")[1];
    }

    // Action: Add Organizer
    if (currentUrl.includes("DisKus/Meeting/?Addorganizer_action=")) {
      // Extract action parameter from URL
      // const parts = currentUrl.split("Addorganizer_action=")[1];
      // localStorage.setItem("AdOrg", parts);
      // Add action-specific logic here if needed
    }

    // Action: Update Organizer
    if (currentUrl.includes("DisKus/Meeting?Updateorganizer_action=")) {
      // Add action-specific logic here if needed
    }

    // Action: Cancel Meeting
    if (currentUrl.includes("DisKus/Meeting?Cancelmeeting_action=")) {
      // Add action-specific logic here if needed
    }

    // Action: Delete Meeting
    if (currentUrl.includes("DisKus/Meeting?Deletemeeting_action=")) {
      // Add action-specific logic here if needed
    }

    // Action: Update Meeting
    if (currentUrl.includes("DisKus/Meeting?Updatemeeting_action=")) {
      // Add action-specific logic here if needed
    }

    // Action: Start Meeting
    if (currentUrl.includes("DisKus/Meeting?Startmeeting_action=")) {
      // Add action-specific logic here if needed
    }

    // Action: Poll Expire
    if (currentUrl.includes("DisKus/polling?Pollexpire_action=")) {
      // Add action-specific logic here if needed
    }
    // Action: Poll Expire
    if (currentUrl.includes("DisKus/groups?GroupPollExpire_action=")) {
      // Add action-specific logic here if needed
    }
    // Action: Poll Expire
    if (currentUrl.includes("DisKus/committee?CommitteePollExpire_action=")) {
      // Add action-specific logic here if needed
    }

    // Action: Poll Published
    if (currentUrl.includes("DisKus/polling?PollPublished_action=")) {
      // const parts = currentUrl.split("action=")[1];
      // console.log(parts, "currentUrlcurrentUrlcurrentUrl");
      // localStorage.setItem("poPub", parts);
      // Add action-specific logic here if needed
    }
    // Action: Poll Published
    if (currentUrl.includes("DisKus/groups?GroupPollPublished_action=")) {
      // Add action-specific logic here if needed
    }
    // Action: Poll Published
    if (
      currentUrl.includes("DisKus/committee?CommitteePollPublished_action=")
    ) {
      // Add action-specific logic here if needed
    }

    // Action: Poll Update
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/polling?PollUpdate_action=".toLowerCase())
    ) {
      // Add action-specific logic here if needed
      // const parts = currentUrl.split("action=")[1];
      // console.log(parts, "currentUrlcurrentUrlcurrentUrl");
      // localStorage.setItem("poPub", parts);
    }
    // Action: Poll Update
    if (currentUrl.includes("DisKus/groups?GroupPollUpdate_action=")) {
      // Add action-specific logic here if needed
    }
    // Action: Poll Update
    if (currentUrl.includes("DisKus/committee?CommitteePollUpdate_action=")) {
      // Add action-specific logic here if needed
    }

    // Action: Resolution Reminder
    if (currentUrl.includes("DisKus/reminder?Resolutionreminder_action=")) {
      // Add action-specific logic here if needed
    }

    // Action: Organization Status Enable
    if (
      currentUrl.includes("DisKus/Meeting/Organizationstatusenable?action=")
    ) {
      // Add action-specific logic here if needed
    }

    // Action: Organization Subscription Enable
    if (
      currentUrl.includes(
        "DisKus/Meeting/Organizationsubscriptionenable?action="
      )
    ) {
      // Add action-specific logic here if needed
    }
  }, [currentUrl]);

  // Retrieving data from local storage
  let Blur = localStorage.getItem("blur");
  let currentUserID = localStorage.getItem("userID");
  let RoleID = localStorage.getItem("roleID");
  const token = localStorage.getItem("token") || ""; // Using logical OR to set default value
  let TwoFA = JSON.parse(localStorage.getItem("2fa"));
  let TowApproval = JSON.parse(localStorage.getItem("TowApproval"));

  // State for current user
  const [currentUser, setCurrentUser] = useState(
    RoleID === "3" && (Blur === undefined || Blur === null) ? true : null
  );

  // Rendering logic based on authentication and authorization
  return currentUser && token ? (
    <Outlet /> // Render nested routes if authenticated and authorized
  ) : (
    <Navigate
      to={
        currentUrl !== "" &&
        (currentUrl.includes(
          "DisKus/Meeting/Useravailabilityformeeting?action="
        ) ||
          currentUrl.includes("DisKus/dataroom?action="))
          ? "/"
          : "*" // Redirect to home page or fallback route if not authenticated or authorized
      }
    />
  );
};

export default PrivateRoutes;
