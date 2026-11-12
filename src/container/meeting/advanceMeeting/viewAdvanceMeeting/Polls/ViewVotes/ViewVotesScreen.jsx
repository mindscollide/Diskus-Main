import React from "react";
import ViewVotesContent from "../../../../../Polling/commonPolls/ViewVotesContent";
import { usePollsContext } from "../../../../../../context/PollsContext";

const ViewVotesScreen = () => {
  const { setviewVotes } = usePollsContext();
  return <ViewVotesContent onClose={() => setviewVotes(false)} />;
};

export default ViewVotesScreen;
