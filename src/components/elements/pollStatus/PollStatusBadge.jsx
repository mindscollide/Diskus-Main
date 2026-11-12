import React from "react";
import { useTranslation } from "react-i18next";

// Status cell of the polls tables: coloured dot + label.
// pollStatusId: 1 = Unpublished (grey), 2 = Published (green), 3 = Expired (red).
const STATUS = {
  1: { dot: "userstatus-signal-Unpublished", label: "Unpublished" },
  2: { dot: "userstatus-signal-PublishedPolls", label: "Published" },
  3: { dot: "userstatus-signal-disabled", label: "Expired" },
};

const PollStatusBadge = ({ pollStatusId, center = false }) => {
  const { t } = useTranslation();
  const status = STATUS[Number(pollStatusId)];
  if (!status) return null;
  return (
    <div
      className={
        center
          ? "d-flex justify-content-center align-items-start"
          : "d-flex align-items-start"
      }>
      <span className={status.dot}></span>
      <p className='m-0 userName FontArabicRegular text-nowrap'>{t(status.label)}</p>
    </div>
  );
};

export default PollStatusBadge;
