import React from "react";
import ViewVotesContent from "../../../../../Polling/commonPolls/ViewVotesContent";

const ViewVotesScreen = ({ setviewVotes }) => {
  return <ViewVotesContent onClose={() => setviewVotes(false)} />;
};

export default ViewVotesScreen;
