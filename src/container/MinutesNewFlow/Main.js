import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch } from "react-redux"; // Importing Redux hook
import PendingApproval from "./pendingApprovals/PendingApprovals";
import ReviewMinutes from "./reviewMinutes/ReviewMinutes";
import { Notification } from "../../components/elements";
import { CleareMessegeMinutes } from "../../store/actions/Minutes_action";
import useSnackbar from "../../components/elements/snack_bar/useSnackbar";

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
  const [show, SnackBar] = useSnackbar();

  useEffect(() => {
    if (
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("No-records-found") &&
      ResponseMessage !== "" &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("List-updated-successfully") &&
      ResponseMessage !== t("No-data-available")
    ) {
      show(ResponseMessage, "sucess");
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


    {SnackBar}
    </>
  );
};

export default MinutesFlow; // Exporting Minutes Flow component
