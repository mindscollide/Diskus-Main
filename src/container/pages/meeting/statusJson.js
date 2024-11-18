export const StatusValue = (t, statusValue) => {
  switch (statusValue) {
    case "1":
      return <span className={"meeting-status-value text-center"}>{t("Upcoming")}</span>;
    case "2":
      return <span className={"meeting-status-value text-center"}>{t("Start")}</span>;
    case "3":
      return <span className={"meeting-status-value text-center"}>{t("Completed")}</span>;
    case "4":
      return <span className={"meeting-status-value text-center"}>{t("Cancelled")}</span>;
    case "5":
      return <span className={"meeting-status-value text-center"}>{t("Reschedule")}</span>;
    case "6":
      return <span className={"meeting-status-value text-center"}>{t("Close")}</span>;
    case "7":
      return <span className={"meeting-status-value text-center"}>{t("Delete")}</span>;
    case "8":
      return (
        <span className={"meeting-status-value text-center"}>{t("Not Conducted")}</span>
      );
    case "9":
      return <span className={"meeting-status-value text-center"}>{t("Ended")}</span>;
    case "10":
      return <span className={"meeting-status-value text-center"}>{t("Active")}</span>;
    case "11":
      return <span className={"meeting-status-value text-center"}>{t("Unpublished")}</span>;
    case "12":
      return <span className={"meeting-status-value text-center"}>{t("Proposed")}</span>;
    default:
      break;
  }
};
