import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CancelPollsModal from "../../../../../Polling/commonPolls/CancelPollsModal";
import { showCancelPolls } from "../../../../../../store/actions/NewMeetingActions";
import {
  resetCreateEditTabs,
  toggleCreateEditMeetingModal,
} from "../../../../../../store/actions/ModalStates_actions";
import {
  listOfMeetingsApi,
  resetCurrentMeetingInfo,
} from "../../../../../../store/actions/NewMeeting2.actions";
import { useMeetingContext } from "../../../../../../context/MeetingContext";

// "Yes" leaves the create/edit meeting screen (same exit as the Minutes unsaved modal).
const CancelPolls = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setEditorRole } = useMeetingContext();

  const committeeInfo = useSelector(
    (state) => state.CommitteeReducer.viewCommitteeDetails,
  );
  const groupInfo = useSelector(
    (state) => state.GroupsReducer.viewGroupDetails,
  );

  const handleYesFunctionality = () => {
    dispatch(showCancelPolls(false));
    dispatch(toggleCreateEditMeetingModal(false));
    dispatch(resetCreateEditTabs());
    dispatch(resetCurrentMeetingInfo());
    setEditorRole({ status: null, role: null, isPrimaryOrganizer: false });

    // Opened from a committee / group: just go back to it.
    if (committeeInfo !== null || groupInfo !== null) return;

    const userID = localStorage.getItem("userID");
    const meetingpageRow = localStorage.getItem("MeetingPageRows");
    const meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
    const currentView = localStorage.getItem("MeetingCurrentView");
    dispatch(
      listOfMeetingsApi(
        navigate,
        t,
        {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(userID),
          PageNumber:
            meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
          Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
          PublishedMeetings: currentView && Number(currentView) === 1,
          ProposedMeetings: currentView && Number(currentView) === 2,
        },
        "",
        {},
      ),
    );
  };

  return <CancelPollsModal onConfirm={handleYesFunctionality} />;
};

export default CancelPolls;
