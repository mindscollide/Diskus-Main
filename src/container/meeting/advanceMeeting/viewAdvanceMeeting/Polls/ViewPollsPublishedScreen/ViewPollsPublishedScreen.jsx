import React from "react";
import ViewPollsPublishedContent from "../../../../../Polling/commonPolls/ViewPollsPublishedContent";
import ViewVotesScreen from "../ViewVotes/ViewVotesScreen";
import { usePollsContext } from "../../../../../../context/PollsContext";

const ViewPollsPublishedScreen = ({ setViewPublishedPoll }) => {
  const { viewVotes, setviewVotes } = usePollsContext();
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
