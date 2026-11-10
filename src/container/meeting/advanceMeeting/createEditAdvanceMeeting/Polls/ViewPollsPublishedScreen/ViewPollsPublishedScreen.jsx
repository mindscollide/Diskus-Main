import React, { useState } from "react";
import ViewPollsPublishedContent from "../../../../../Polling/commonPolls/ViewPollsPublishedContent";
import ViewVotesScreen from "../ViewVotes/ViewVotesScreen";

const ViewPollsPublishedScreen = ({ setViewPublishedPoll }) => {
  const [viewVotes, setviewVotes] = useState(false);
  return (
    <ViewPollsPublishedContent
      onClose={() => setViewPublishedPoll(false)}
      viewVotes={viewVotes}
      setviewVotes={setviewVotes}
      viewVotesScreen={<ViewVotesScreen setviewVotes={setviewVotes} />}
      showViewVotesButton={false}
    />
  );
};

export default ViewPollsPublishedScreen;
