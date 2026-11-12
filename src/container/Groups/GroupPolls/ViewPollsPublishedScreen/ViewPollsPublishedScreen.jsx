import React from "react";
import ViewPollsPublishedContent from "../../../Polling/commonPolls/ViewPollsPublishedContent";
import ViewVotesScreen from "../ViewVotes/ViewVotesScreen";
import { useMeetingContext } from "../../../../context/MeetingContext";
import { useGroupsContext } from "../../../../context/GroupsContext";

const ViewPollsPublishedScreen = () => {
  const { setViewPublishedPoll } = useMeetingContext();
  const { viewVotes, setviewVotes } = useGroupsContext();
  return (
    <ViewPollsPublishedContent
      onClose={() => setViewPublishedPoll(false)}
      viewVotes={viewVotes}
      setviewVotes={setviewVotes}
      viewVotesScreen={<ViewVotesScreen setviewVotes={setviewVotes} />}
    />
  );
};

export default ViewPollsPublishedScreen;
