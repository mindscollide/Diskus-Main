import React, { useState } from "react";
import ViewPollsPublishedContent from "../../../../Polling/commonPolls/ViewPollsPublishedContent";
import ViewVotesScreen from "../ViewVotes/ViewVotesScreen";

const ViewPollsPublishedScreen = ({ setSavePollsPublished }) => {
  const [viewVotes, setviewVotes] = useState(false);
  return (
    <ViewPollsPublishedContent
      onClose={() => setSavePollsPublished(false)}
      viewVotes={viewVotes}
      setviewVotes={setviewVotes}
      viewVotesScreen={<ViewVotesScreen setviewVotes={setviewVotes} />}
    />
  );
};

export default ViewPollsPublishedScreen;
