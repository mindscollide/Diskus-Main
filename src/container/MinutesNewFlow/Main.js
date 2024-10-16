import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch } from "react-redux"; // Importing Redux hook
import { useNavigate } from "react-router-dom"; // Importing navigation hook
import PendingApproval from "./pendingApprovals/PendingApprovals";
import ReviewMinutes from "./reviewMinutes/ReviewMinutes";
import { Notification } from "../../components/elements";
import { CleareMessegeMinutes } from "../../store/actions/Minutes_action";
import { showMessage } from "../../components/elements/snack_bar/utill";

// Functional component for Minutes Flow section
const MinutesFlow = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook
  const navigate = useNavigate(); // Navigation hook

  const { MinutesReducer } = useSelector((state) => state);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");

  console.log("MinutesReducerMinutesReducer", MinutesReducer);

  useEffect(() => {
    if (
      MinutesReducer.ResponseMessage !== t("No-record-found") &&
      MinutesReducer.ResponseMessage !== t("No-records-found") &&
      MinutesReducer.ResponseMessage !== "" &&
      MinutesReducer.ResponseMessage !== t("No-record-found") &&
      MinutesReducer.ResponseMessage !== t("List-updated-successfully") &&
      MinutesReducer.ResponseMessage !== t("No-data-available")
    ) {
      showMessage(MinutesReducer.ResponseMessage, "sucess", setOpen);
      dispatch(CleareMessegeMinutes());
    } else {
      dispatch(CleareMessegeMinutes());
    }
  }, [MinutesReducer.ResponseMessage]);

  return (
    <>
      {MinutesReducer.showPendingApprovalsPage === true ? (
        <PendingApproval />
      ) : MinutesReducer.showReviewMinutesPage === true ? (
        <ReviewMinutes />
      ) : null}

      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.flag })}
        severity={open.severity}
      />
    </>
  );
};

export default MinutesFlow; // Exporting Minutes Flow component
