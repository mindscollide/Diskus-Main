import "./Meeting.css";
export const StatusValue = (t, statusValue) => {
  switch (statusValue) {
    case "1":
      return (
        <>
          <span className="d-inline-flex align-items-center">
            <span className="status-color-upcoming "></span>
            <p className={"meeting-status-value m-0 mx-1"}>{t("Upcoming")}</p>
          </span>
        </>
      );
    case "2":
      return (
        <>
          <span className="d-inline-flex align-items-center">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value  my-0 ms-1"}>{t("Start")}</p>
          </span>
        </>
      );
    case "3":
      return (
        <>
          <span className="d-inline-flex align-items-center">
            <span className="status-color-start"></span>

            <p className={"meeting-status-value  my-0 ms-1"}>
              {t("Completed")}
            </p>
          </span>
        </>
      );
    case "4":
      return (
        <>
          <span className="d-inline-flex align-items-center">
            <span className="status-color-cancelled "></span>
            <p className={"meeting-status-value my-0 ms-1"}>{t("Cancelled")}</p>
          </span>
        </>
      );
    case "5":
      return (
        <>
          <span className="d-inline-flex align-items-center">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value  my-0 ms-1"}>
              {t("Reschedule")}
            </p>
          </span>
        </>
      );
    case "6":
      return (
        <>
          <span className="d-inline-flex align-items-center">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value  my-0 ms-1"}>{t("Close")}</p>
          </span>
        </>
      );
    case "7":
      return (
        <>
          <span className="d-inline-flex align-items-center">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value  my-0 ms-1"}>{t("Delete")}</p>
          </span>
        </>
      );
    case "8":
      return (
        <>
          <span className="d-inline-flex align-items-center">
            <span className="status-color-nonConducted"></span>
            <p className={"meeting-status-value  my-0 ms-1"}>
              {t("Not Conducted")}
            </p>
          </span>
        </>
      );
    case "9":
      return (
        <>
          <span className="d-inline-flex align-items-center">
            <span className="status-color-end"></span>
            <p className={"meeting-status-value  my-0 ms-1"}>{t("Ended")}</p>
          </span>
        </>
      );
    case "10":
      return (
        <>
          <span className="d-inline-flex align-items-center">
            <span className="status-color-active"></span>
            <p className={"meeting-status-value  my-0 ms-1"}>{t("Active")}</p>
          </span>
        </>
      );
    case "11":
      return (
        <>
          <span className="d-inline-flex align-items-center">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value  my-0 ms-1"}>
              {t("Unpublished")}
            </p>
          </span>
        </>
      );
    case "12":
      return (
        <>
          <span className="d-inline-flex align-items-center">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value  my-0 ms-1"}>{t("Proposed")}</p>
          </span>
        </>
      );
    default:
      break;
  }
};
