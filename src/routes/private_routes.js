import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { getActionValue } from "../commen/functions/utils";
const PrivateRoutes = () => {
  const currentUrl = window.location.href;
  console.log(currentUrl, "currentUrlcurrentUrlcurrentUrl");

  const navigate = useNavigate();

  // Effect hook to perform actions based on the current URL
  useEffect(() => {
    const callRoutingFunction = async () => {
      try {
        if (
          currentUrl
            .toLowerCase()
            .includes(
              "Diskus/Meeting/Useravailabilityformeeting?action=".toLowerCase()
            )
        ) {
          const parts = currentUrl.split("/Meeting/")[1];
          // Extract action parameter from URL
          let getValue = getActionValue(
            currentUrl,
            "Useravailabilityformeeting?action="
          );

          localStorage.setItem("RSVP", getValue);
          localStorage.setItem("mobilePopUpAppRoute", parts);
        }

        // Action: Data Room
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/dataroom?action=".toLowerCase())
        ) {
          localStorage.setItem("DataRoomEmail", currentUrl);
        }

        // Action: Meeting Minute Collaboration
        if (
          currentUrl
            .toLowerCase()
            .includes(
              "Diskus/Meeting/Meetingminutecollaborate?action=".toLowerCase()
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
            .includes("Diskus/Meeting?Meetingproposed_action=".toLowerCase())
        ) {
          // Add action-specific logic here if needed
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("meetingprop", parts);
        }

        // Action: Cancel Meeting
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/Meeting?Cancelmeeting_action=".toLowerCase())
        ) {
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("meetingCanc", parts);
        }

        // Action: Delete Meeting
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/Meeting?Deletemeeting_action=".toLowerCase())
        ) {
          // Add action-specific logic here if needed
          navigate("/Diskus/Meeting");
        }

        // Action: Update Meeting
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/Meeting?Updatemeeting_action=".toLowerCase())
        ) {
          // Add action-specific logic here if needed
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("meetingUpd", parts);
        }

        // Action: Start Meeting
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/Meeting?Startmeeting_action=".toLowerCase())
        ) {
          // Add action-specific logic here if needed
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("meetingStr", parts);
        }

        if (
          currentUrl
            .toLowerCase()
            .includes(
              "Diskus/Meeting?Usermeetingproposedatespoll_action=".toLowerCase()
            )
        ) {
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("UserMeetPropoDatPoll", parts);
        }

        // Action: Poll Expire
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/polling?PollExpire_action=".toLowerCase())
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
            .includes("Diskus/polling?PollPublished_action=".toLowerCase())
        ) {
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("poPub", parts);
          // Add action-specific logic here if needed
        }

        // Action: Poll Update
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/polling?PollUpdated_action=".toLowerCase())
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
            .includes(
              "Diskus/resolution?Resolutionreminder_action=".toLowerCase()
            )
        ) {
          // Add action-specific logic here if needed
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("resVot", parts);
        }

        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/resolution?ResolutionVoter_action=".toLowerCase())
        ) {
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("resVot", parts);
        }
        if (
          currentUrl
            .toLowerCase()
            .includes(
              "Diskus/resolution?ResolutionNonVoter_action=".toLowerCase()
            )
        ) {
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("resNonVot", parts);
        }
        // Action: Organization Status Enable
        if (
          currentUrl
            .toLowerCase()
            .includes(
              "Diskus/Admin/Organizationstatusenable?action=".toLowerCase()
            )
        ) {
          // Add action-specific logic here if needed
        }

        // Action: Organization Subscription Enable
        if (
          currentUrl
            .toLowerCase()
            .includes(
              "Diskus/Admin/Organizationsubscriptionenable?action=".toLowerCase()
            )
        ) {
          // Add action-specific logic here if needed
        }

        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/Meeting?Activeagendaedit_action".toLowerCase())
        ) {
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("mtAgUpdate", parts);
        }
        // Committee View
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/committee?id_action".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "id_action=");
          // let getValue = getActionValue(currentUrl, "id_action=");
          console.log(getValue, "getValuegetValuegetValue");

          localStorage.setItem("committeeView_Id", getValue);
        }
        // Committee List View
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/committee?action".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "action=");
          console.log(getValue, "getValuegetValue");
          localStorage.setItem("committeeList", getValue);
        }
        // Group View
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/groups?id_action".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "id_action=");
          localStorage.setItem("groupView_Id", getValue);
        }
        // Group List View
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/groups?action".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "action=");
          localStorage.setItem("groupList", getValue);
        }
        // Tasks View
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/todolist?id_action".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "id_action=");
          localStorage.setItem("taskListView_Id", getValue);
        }
        // Tasks List View
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/todolist?Tasks_action=".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "Tasks_action=");
          localStorage.setItem("taskListView", getValue);
        }
        if (
          currentUrl
            .toLowerCase()
            .includes(
              "/Diskus/documentViewer?documentViewer_action=".toLowerCase()
            )
        ) {
          let getValue = await getActionValue(
            currentUrl,
            "documentViewer_action="
          );
          localStorage.setItem("documentViewer", getValue);
          navigate("/Diskus/dataroom");
        }
        if (
          currentUrl
            .toLowerCase()
            .includes("/Diskus/dataroom?viewFol_action=".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "viewFol_action=");
          localStorage.setItem("viewFolderLink", getValue);
        }
        if (
          currentUrl
            .toLowerCase()
            .includes("/DisKus/Meeting?viewMeeting_action=".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "viewMeeting_action=");
          localStorage.setItem("viewMeetingLink", getValue);
        }

        if (
          currentUrl
            .toLowerCase()
            .includes("/Diskus/Minutes?MRAP=".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "MRAP=");

          localStorage.setItem("reviewMinutesLink", getValue);
        }

        if (
          currentUrl
            .toLowerCase()
            .includes("/DisKus/Meeting?MRSP=".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "MRSP=");
          localStorage.setItem("reviewSubmittedMinutesLink", getValue);
        }
        if (
          currentUrl
            .toLowerCase()
            .includes("/DisKus/Meeting?viewMeetingMinutes_action".toLowerCase())
        ) {
          let getValue = getActionValue(
            currentUrl,
            "viewMeetingMinutes_action="
          );
          localStorage.setItem("viewPublishMinutesLink", getValue);
        }

        if (
          currentUrl
            .toLowerCase()
            .includes("/Diskus/Minutes?sign_action".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "sign_action=");
          localStorage.setItem("docSignAction", getValue);
        }
        if (
          currentUrl
            .toLowerCase()
            .includes("/Diskus/Minutes?signed_action".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "signed_action=");
          localStorage.setItem("docSignedAction", getValue);
        }
      } catch (error) {
        console.log(error, "errorerrorerrorerror");
      }
      if (
        currentUrl
          .toLowerCase()
          .includes("/Diskus/Dataroom?signed_cr_action".toLowerCase())
      ) {
        let getValue = getActionValue(currentUrl, "signed_cr_action=");
        localStorage.setItem("docSignedCrAction", getValue);
      }
    };
    callRoutingFunction();
    // Action: Meeting RSVP
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
        (currentUrl !== "" &&
          (currentUrl
            .toLowerCase()
            .includes(
              "Diskus/Meeting/Useravailabilityformeeting?action=".toLowerCase()
            ) ||
            currentUrl
              .toLowerCase()
              .includes("Diskus/dataroom".toLowerCase()) ||
            currentUrl
              .toLowerCase()
              .includes(
                "Diskus/documentViewer?documentViewer_action".toLowerCase()
              ) ||
            currentUrl.toLowerCase().includes("Diskus/Meeting".toLowerCase()) ||
            currentUrl.toLowerCase().includes("Diskus/polling".toLowerCase()) ||
            currentUrl.toLowerCase().includes("Diskus/groups".toLowerCase()) ||
            currentUrl
              .toLowerCase()
              .includes("Diskus/committee".toLowerCase()) ||
            currentUrl
              .toLowerCase()
              .includes("Diskus/resolution".toLowerCase()))) ||
        currentUrl.toLowerCase().includes("Diskus/Minutes".toLowerCase())
          ? "/"
          : currentUser === null && token === ""
          ? "/"
          : "*"
      }
    />
  );
};
export default PrivateRoutes;
