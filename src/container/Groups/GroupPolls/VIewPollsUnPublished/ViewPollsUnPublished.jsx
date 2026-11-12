import React from "react";
import ViewPollsUnPublishedContent from "../../../Polling/commonPolls/ViewPollsUnPublishedContent";

const ViewPollsUnPublished = ({ setViewUnPublished }) => {
  return (
    <ViewPollsUnPublishedContent onClose={() => setViewUnPublished(false)} />
  );
};

export default ViewPollsUnPublished;
