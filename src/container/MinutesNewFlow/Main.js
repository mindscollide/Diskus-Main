import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch } from "react-redux"; // Importing Redux hook
import PendingApproval from "./pendingApprovals/PendingApprovals";
import ReviewMinutes from "./reviewMinutes/ReviewMinutes";
import { Notification } from "../../components/elements";
import { CleareMessegeMinutes } from "../../store/actions/Minutes_action";
import { showMessage } from "../../components/elements/snack_bar/utill";

// Functional component for Minutes Flow section
const MinutesFlow = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook

  const ResponseMessage = useSelector(
    (state) => state.MinutesReducer.ResponseMessage
  );
  const showPendingApprovalsPage = useSelector(
    (state) => state.MinutesReducer.showPendingApprovalsPage
  );
  const showReviewMinutesPage = useSelector(
    (state) => state.MinutesReducer.showReviewMinutesPage
  );
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    if (
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("No-records-found") &&
      ResponseMessage !== "" &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("List-updated-successfully") &&
      ResponseMessage !== t("No-data-available")
    ) {
      showMessage(ResponseMessage, "sucess", setOpen);
      dispatch(CleareMessegeMinutes());
    } else {
      dispatch(CleareMessegeMinutes());
    }
  }, [ResponseMessage]);

  return (
    <>
      {showPendingApprovalsPage === true ? (
        <PendingApproval />
      ) : showReviewMinutesPage === true ? (
        <ReviewMinutes />
      ) : null}

      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
    </>
  );
};

export default MinutesFlow; // Exporting Minutes Flow component
