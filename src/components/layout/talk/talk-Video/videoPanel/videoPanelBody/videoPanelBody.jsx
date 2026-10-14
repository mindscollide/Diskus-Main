import React, { useState } from "react";
import { useSelector } from "react-redux";
import VideoPanelBodyRecent from "./videoPanelBodyRecent";
import VideoPanelBodyContact from "./videoPanelBodyContact";

/**
 * @component VideoPanelBody
 * @description Body section of the Talk module's video panel. Acts as a
 * conditional router between the two body sub-views based on Redux flags:
 * renders `VideoPanelBodyContact` when `videoFeatureReducer.ContactVideoFlag`
 * is `true` (contact selection for initiating a call), and
 * `VideoPanelBodyRecent` when `videoFeatureReducer.RecentVideoFlag` is `true`
 * (recent call history). Both flags can be independently toggled, so neither,
 * one, or both views may be visible simultaneously depending on state.
 */
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
