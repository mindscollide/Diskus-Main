import React, { useEffect, useState } from "react";
import VideoMain from "./videoCallMain";
import { useSelector } from "react-redux";
import { showMessage } from "../../../elements/snack_bar/utill";
import { Notification } from "../../../elements";
import { useDispatch } from "react-redux";
import { clearGuestVideoReducerResponseMessage } from "../../../../store/actions/Guest_Video";

const VideoCallScreen = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const ResponseMessageGuestReducer = useSelector(
    (state) => state.GuestVideoReducer.ResponseMessage
  );
  useEffect(() => {
    if (
      ResponseMessageGuestReducer !== null &&
      ResponseMessageGuestReducer !== undefined &&
      ResponseMessageGuestReducer !== ""
    ) {
      showMessage(ResponseMessageGuestReducer, "error", setOpen);
      setTimeout(() => {
        dispatch(clearGuestVideoReducerResponseMessage());
      }, 4000);
    }
  }, [ResponseMessageGuestReducer]);

  return (
    <>
      <VideoMain />
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default VideoCallScreen;
