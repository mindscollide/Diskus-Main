export const StatusValue = (t, statusValue) => {
  switch (statusValue) {
    case "1":
      return <span>{t("Upcoming")}</span>;
    case "2":
      return <span>{t("Start")}</span>;
    case "3":
      return <span>{t("Completed")}</span>;
    case "4":
      return <span>{t("Cancel")}</span>;
    case "5":
      return <span>{t("Reschedule")}</span>;
    case "6":
      return <span>{t("Close")}</span>;
    case "7":
      return <span>{t("Delete")}</span>;
    case "8":
      return <span>{t("NotConducted")}</span>;
    case "9":
      return <span>{t("End")}</span>;
    case "10":
      return <span>{t("Active")}</span>;
    case "11":
      return <span>{t("Unpublished")}</span>;
    case "12":
      return <span>{t("Proposed")}</span>;
    default:
      break;
  }
};
