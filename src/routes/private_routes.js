import React, { useEffect } from "react";
import {
  Navigate,
  Outlet,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { getActionValue } from "../commen/functions/utils";
const PrivateRoutes = () => {
  const currentUrl = window.location.href;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  console.log(
    Array.from(searchParams.entries()),
    "searchParamssearchParamssearchParams",
  );
  // Effect hook to perform actions based on the current URL
  useEffect(() => {
    const callRoutingFunction = async () => {
      try {
        if (
          currentUrl
            .toLowerCase()
            .includes(
              "Diskus/Meeting/Useravailabilityformeeting?action=".toLowerCase(),
            )
        ) {
          // const parts = currentUrl.split("/Meeting/")[1];
          // Extract action parameter from URL
          let getValue = getActionValue(
            currentUrl,
            "Useravailabilityformeeting?action=",
          );

          localStorage.setItem("RSVP", getValue);
          // localStorage.setItem("mobilePopUpAppRoute", parts);
        }

        // Action: Data Room
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/dataroom?action=".toLowerCase())
        ) {
          localStorage.setItem("DataRoomEmail", currentUrl);
        }

        if (
          currentUrl
            .toLowerCase()
            .includes("/DisKus/Meeting?viewMeeting_action=".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "viewMeeting_action=");
          localStorage.setItem("viewMeetingLink", getValue);
        }

        // Action : Committee Advance Meeting
        if (
          currentUrl
            .toLowerCase()
            .includes("DisKus/committee?viewMeeting_action".toLowerCase())
        ) {
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("committee_viewMeeting_action", parts);
        }

        if (
          currentUrl
            .toLowerCase()
            .includes("DisKus/groups?viewMeeting_action".toLowerCase())
        ) {
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("groups_viewMeeting_action", parts);
        }

        // Action: Meeting Minute Collaboration
        if (
          currentUrl
            .toLowerCase()
            .includes(
              "Diskus/Meeting/Meetingminutecollaborate?action=".toLowerCase(),
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

        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/committee?Meetingproposed_action=".toLowerCase())
        ) {
          // Add action-specific logic here if needed
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("committee_meetingprop_action", parts);
        }

        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/groups?Meetingproposed_action=".toLowerCase())
        ) {
          // Add action-specific logic here if needed
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("groups_meetingprop_action", parts);
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
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/Committee?Updatemeeting_action=".toLowerCase())
        ) {
          // Add action-specific logic here if needed
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("committee_meetingUpd_action", parts);
        }
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/Groups?Updatemeeting_action=".toLowerCase())
        ) {
          // Add action-specific logic here if needed
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("groups_meetingUpd_action", parts);
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
        // Action: Start Meeting
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/committee?Startmeeting_action=".toLowerCase())
        ) {
          // Add action-specific logic here if needed
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("committee_meetingStr_action", parts);
        }
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/groups?Startmeeting_action=".toLowerCase())
        ) {
          // Add action-specific logic here if needed
          const parts = currentUrl.split("action=")[1];
          localStorage.setItem("groups_meetingStr_action", parts);
        }

        if (
          currentUrl
            .toLowerCase()
            .includes(
              "Diskus/Meeting?Usermeetingproposedatespoll_action=".toLowerCase(),
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

          localStorage.setItem("poUpda", parts);
        }

        // Action: Resolution Reminder
        if (
          currentUrl
            .toLowerCase()
            .includes(
              "Diskus/resolution?Resolutionreminder_action=".toLowerCase(),
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
              "Diskus/resolution?ResolutionNonVoter_action=".toLowerCase(),
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
              "Diskus/Admin/Organizationstatusenable?action=".toLowerCase(),
            )
        ) {
          // Add action-specific logic here if needed
        }

        // Action: Organization Subscription Enable
        if (
          currentUrl
            .toLowerCase()
            .includes(
              "Diskus/Admin/Organizationsubscriptionenable?action=".toLowerCase(),
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

          localStorage.setItem("committeeView_Id", getValue);
        }
        // Committee List View
        if (
          currentUrl
            .toLowerCase()
            .includes("Diskus/committee?action".toLowerCase())
        ) {
          let getValue = getActionValue(currentUrl, "action=");

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
              "/Diskus/documentViewer?documentViewer_action=".toLowerCase(),
            )
        ) {
          let getValue = await getActionValue(
            currentUrl,
            "documentViewer_action=",
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
            "viewMeetingMinutes_action=",
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
      } catch (error) {}
      if (
        currentUrl
          .toLowerCase()
          .includes("/Diskus/Dataroom?signed_cr_action".toLowerCase())
      ) {
        let getValue = getActionValue(currentUrl, "signed_cr_action=");
        localStorage.setItem("docSignedCrAction", getValue);
      }

      // Unified email action handler — save token for post-login redirect
      if (currentUrl.toLowerCase().includes("Diskus/Redirect".toLowerCase())) {
        let getValue = getActionValue(currentUrl, "Redirected?");
        localStorage.setItem("emailActionToken", getValue);
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

  return currentUser && token ? (
    <Outlet />
  ) : (
    <Navigate
      to={
        (currentUrl !== "" &&
          (currentUrl
            .toLowerCase()
            .includes(
              "Diskus/Meeting/Useravailabilityformeeting?action=".toLowerCase(),
            ) ||
            currentUrl
              .toLowerCase()
              .includes("Diskus/dataroom".toLowerCase()) ||
            currentUrl
              .toLowerCase()
              .includes(
                "Diskus/documentViewer?documentViewer_action".toLowerCase(),
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
