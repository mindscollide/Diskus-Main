import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CancelPollsModal from "../../../../../Polling/commonPolls/CancelPollsModal";
import {
  searchNewUserMeeting,
  showCancelPolls,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../../../store/actions/NewMeetingActions";
import { toggleViewMeetingModal } from "../../../../../../store/actions/ModalStates_actions";

const CancelPolls = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleYesFunctionality = () => {
    let userID = localStorage.getItem("userID");
    let meetingpageRow = localStorage.getItem("MeetingPageRows");
    let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
    let currentView = localStorage.getItem("MeetingCurrentView");
    dispatch(showCancelPolls(false));
    dispatch(toggleViewMeetingModal(false));
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    dispatch(searchNewUserMeeting(navigate, searchData, t));
  };

  return <CancelPollsModal onConfirm={handleYesFunctionality} />;
};

export default CancelPolls;
