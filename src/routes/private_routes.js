import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { getActionValue } from "../commen/functions/utils";
import { validateEncryptedStringViewCommitteeDetailLinkApi } from "../store/actions/Committee_actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
const PrivateRoutes = () => {
  const currentUrl = window.location.href;
  console.log(currentUrl, "currentUrlcurrentUrlcurrentUrl");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  // Effect hook to perform actions based on the current URL
  useEffect(() => {
    // Action: Meeting RSVP
    if (
      currentUrl
        .toLowerCase()
        .includes(
          "DisKus/Meeting/Useravailabilityformeeting?action=".toLowerCase()
        )
    ) {
      // Extract action parameter from URL
      const parts = currentUrl.split("?action=".toLowerCase());
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
    if (
      currentUrl.toLowerCase().includes("DisKus/dataroom?action=".toLowerCase())
    ) {
      localStorage.setItem("DataRoomEmail", currentUrl);
    }

    // Action: Meeting Minute Collaboration
    if (
      currentUrl
        .toLowerCase()
        .includes(
          "DisKus/Meeting/Meetingminutecollaborate?action=".toLowerCase()
        )
    ) {
      // Add action-specific logic here if needed
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("meetingMin", parts);
    }

    // Action: Meeting Proposed
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/Meeting?Meetingproposed_action=".toLowerCase())
    ) {
      // Add action-specific logic here if needed
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("meetingprop", parts);
    }

    // Action: Cancel Meeting
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/Meeting?Cancelmeeting_action=".toLowerCase())
    ) {
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("meetingCanc", parts);
    }

    // Action: Delete Meeting
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/Meeting?Deletemeeting_action=".toLowerCase())
    ) {
      // Add action-specific logic here if needed
      navigate("/Diskus/Meeting");
    }

    // Action: Update Meeting
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/Meeting?Updatemeeting_action=".toLowerCase())
    ) {
      // Add action-specific logic here if needed
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("meetingUpd", parts);
    }

    // Action: Start Meeting
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/Meeting?Startmeeting_action=".toLowerCase())
    ) {
      // Add action-specific logic here if needed
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("meetingStr", parts);
    }

    if (
      currentUrl
        .toLowerCase()
        .includes(
          "DisKus/Meeting?Usermeetingproposedatespoll_action=".toLowerCase()
        )
    ) {
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("UserMeetPropoDatPoll", parts);
    }

    // Action: Poll Expire
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/polling?PollExpire_action=".toLowerCase())
    ) {
      console.log("pollExpirepollExpirepollExpire", currentUrl);
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("pollExpire", parts);
      // Add action-specific logic here if needed
    }

    // Action: Poll Published
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/polling?PollPublished_action=".toLowerCase())
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
      currentUrl
        .toLowerCase()
        .includes("DisKus/resolution?Resolutionreminder_action=".toLowerCase())
    ) {
      // Add action-specific logic here if needed
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("resVot", parts);
    }

    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/resolution?ResolutionVoter_action=".toLowerCase())
    ) {
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("resVot", parts);
    }
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/resolution?ResolutionNonVoter_action=".toLowerCase())
    ) {
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("resNonVot", parts);
    }
    // Action: Organization Status Enable
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/Admin/Organizationstatusenable?action=".toLowerCase())
    ) {
      // Add action-specific logic here if needed
    }

    // Action: Organization Subscription Enable
    if (
      currentUrl
        .toLowerCase()
        .includes(
          "DisKus/Admin/Organizationsubscriptionenable?action=".toLowerCase()
        )
    ) {
      // Add action-specific logic here if needed
    }

    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/Meeting?Activeagendaedit_action".toLowerCase())
    ) {
      const parts = currentUrl.split("action=")[1];
      localStorage.setItem("mtAgUpdate", parts);
    }
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/committee?id_action".toLowerCase())
    ) {
      let getValue = getActionValue(currentUrl, "id_action=");
      localStorage.setItem("committeeView_Id", getValue);
    }
    if (
      currentUrl
        .toLowerCase()
        .includes("DisKus/committee?action".toLowerCase())
    ) {
      let getValue = getActionValue(currentUrl, "action=");
      console.log(getValue, "getValuegetValue")
      localStorage.setItem("committeeList", getValue);
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
        (currentUrl
          .toLowerCase()
          .includes(
            "DisKus/Meeting/Useravailabilityformeeting?action=".toLowerCase()
          ) ||
          currentUrl.toLowerCase().includes("DisKus/dataroom".toLowerCase()) ||
          currentUrl.toLowerCase().includes("DisKus/Meeting".toLowerCase()) ||
          currentUrl.toLowerCase().includes("DisKus/polling".toLowerCase()) ||
          currentUrl.toLowerCase().includes("DisKus/groups".toLowerCase()) ||
          currentUrl.toLowerCase().includes("DisKus/committee".toLowerCase()) ||
          currentUrl.toLowerCase().includes("DisKus/resolution".toLowerCase()))
          ? "/"
          : currentUser === null && token === ""
          ? "/"
          : "*"
      }
    />
  );
};
export default PrivateRoutes;
