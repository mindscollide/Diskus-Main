export const StatusValue = (t, statusValue) => {
  switch (statusValue) {
    case "1":
      return <span className={"meeting-status-value"}>{t("Upcoming")}</span>;
    case "2":
      return <span className={"meeting-status-value"}>{t("Start")}</span>;
    case "3":
      return <span className={"meeting-status-value"}>{t("Completed")}</span>;
    case "4":
      return <span className={"meeting-status-value"}>{t("Cancelled")}</span>;
    case "5":
      return <span className={"meeting-status-value"}>{t("Reschedule")}</span>;
    case "6":
      return <span className={"meeting-status-value"}>{t("Close")}</span>;
    case "7":
      return <span className={"meeting-status-value"}>{t("Delete")}</span>;
    case "8":
      return (
        <span className={"meeting-status-value"}>{t("Not Conducted")}</span>
      );
    case "9":
      return <span className={"meeting-status-value"}>{t("Ended")}</span>;
    case "10":
      return <span className={"meeting-status-value"}>{t("Active")}</span>;
    case "11":
      return <span className={"meeting-status-value"}>{t("Unpublished")}</span>;
    case "12":
      return <span className={"meeting-status-value"}>{t("Proposed")}</span>;
    default:
      break;
  }
};
