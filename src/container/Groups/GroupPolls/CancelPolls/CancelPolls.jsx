import React from "react";
import CancelPollsModal from "../../../Polling/commonPolls/CancelPollsModal";

const CancelPolls = ({ setSceduleMeeting }) => {
  return <CancelPollsModal onConfirm={() => setSceduleMeeting(false)} />;
};

export default CancelPolls;
