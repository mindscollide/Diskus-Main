import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch } from "react-redux"; // Importing Redux hook
import { useNavigate } from "react-router-dom"; // Importing navigation hook
import PendingApproval from "./pendingApprovals/PendingApprovals";
import ReviewMinutes from "./reviewMinutes/ReviewMinutes";

// Functional component for Minutes Flow section
const MinutesFlow = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook
  const navigate = useNavigate(); // Navigation hook

  const { MinutesReducer } = useSelector((state) => state);

  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");

  console.log("MinutesReducerMinutesReducer", MinutesReducer)

  return MinutesReducer.showPendingApprovalsPage === true ? (
    <PendingApproval />
  ) : MinutesReducer.showReviewMinutesPage === true ? (
    <ReviewMinutes />
  ) : null;
};

export default MinutesFlow; // Exporting Minutes Flow component
