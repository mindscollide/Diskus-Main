import React, { useEffect, useState } from "react";
import VideoMain from "./videoCallMain";
import { useSelector } from "react-redux";
import { Notification } from "../../../elements";
import { useDispatch } from "react-redux";
import { clearGuestVideoReducerResponseMessage } from "../../../../store/actions/Guest_Video";
import { clearMessegesVideoFeature } from "../../../../store/actions/VideoFeature_actions";

const VideoCallScreen = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const ResponseMessageGuestReducer = useSelector(
    (state) => state.GuestVideoReducer.ResponseMessage
  );
  const errorSeverityGuestReducer = useSelector(
    (state) => state.GuestVideoReducer.errorSeverity
  );



  return (
    <>
      <VideoMain />
      
    </>
  );
};

export default VideoCallScreen;
