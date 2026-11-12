import React from "react";
import ViewPollsUnPublishedContent from "../../../../../Polling/commonPolls/ViewPollsUnPublishedContent";

const ViewPollsUnPublished = ({ setUnPublished }) => {
  return <ViewPollsUnPublishedContent onClose={() => setUnPublished(false)} />;
};

export default ViewPollsUnPublished;
