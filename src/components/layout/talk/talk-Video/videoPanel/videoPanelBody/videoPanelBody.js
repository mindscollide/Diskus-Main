import React, { useState } from "react";
import { useSelector } from "react-redux";
import VideoPanelBodyRecent from "./videoPanelBodyRecent";
import VideoPanelBodyContact from "./videoPanelBodyContact";

const VideoPanelBody = () => {
  const ContactVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.ContactVideoFlag
  );
  const RecentVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.RecentVideoFlag
  );
  return (
    <>
      {ContactVideoFlag === true ? <VideoPanelBodyContact /> : null}
      {RecentVideoFlag === true ? <VideoPanelBodyRecent /> : null}
    </>
  );
};

export default VideoPanelBody;
