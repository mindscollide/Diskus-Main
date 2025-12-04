import React, { useEffect, useState } from "react";
import VideoMain from "./videoCallMain";
import { useSelector } from "react-redux";
import { showMessage } from "../../../elements/snack_bar/utill";
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

  console.log(errorSeverityGuestReducer, "errorSeverityGuestReducer")
  useEffect(() => {
    if (
      ResponseMessageGuestReducer !== null &&
      ResponseMessageGuestReducer !== undefined &&
      ResponseMessageGuestReducer !== "" &&
      errorSeverityGuestReducer !== null
    ) {
      showMessage(
        ResponseMessageGuestReducer,
        errorSeverityGuestReducer,
        setOpen
      );
      setTimeout(() => {
        dispatch(clearMessegesVideoFeature());
        dispatch(clearGuestVideoReducerResponseMessage());
      }, 4000);
    }
  }, [ResponseMessageGuestReducer, errorSeverityGuestReducer]);

  return (
    <>
      <VideoMain />
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default VideoCallScreen;
