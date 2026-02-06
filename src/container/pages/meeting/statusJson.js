import "./Meeting.css";
export const StatusValue = (t, statusValue) => {
  switch (statusValue) {
    case "1":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center ">
            <span className="status-color-upcoming "></span>
            <p className={"meeting-status-value text-center my-0 ms-1"}>
              {t("Upcoming")}
            </p>
          </div>
        </>
      );
    case "2":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center ">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value text-center my-0 ms-1"}>
              {t("Start")}
            </p>
          </div>
        </>
      );
    case "3":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center ">
            <span className="status-color-start"></span>

            <p className={"meeting-status-value text-center my-0 ms-1"}>
              {t("Completed")}
            </p>
          </div>
        </>
      );
    case "4":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center ">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value text-center my-0 ms-1"}>
              {t("Cancelled")}
            </p>
          </div>
        </>
      );
    case "5":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center ">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value text-center my-0 ms-1"}>
              {t("Reschedule")}
            </p>
          </div>
        </>
      );
    case "6":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center ">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value text-center my-0 ms-1"}>
              {t("Close")}
            </p>
          </div>
        </>
      );
    case "7":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center ">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value text-center my-0 ms-1"}>
              {t("Delete")}
            </p>
          </div>
        </>
      );
    case "8":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center ">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value text-center my-0 ms-1"}>
              {t("Not Conducted")}
            </p>
          </div>
        </>
      );
    case "9":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center ">
            <span className="status-color-end"></span>
            <p className={"meeting-status-value text-center my-0 ms-1"}>
              {t("Ended")}
            </p>
          </div>
        </>
      );
    case "10":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center ">
            <span className="status-color-active"></span>
            <p className={"meeting-status-value text-center my-0 ms-1"}>
              {t("Active")}
            </p>
          </div>
        </>
      );
    case "11":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center ">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value text-center my-0 ms-1"}>
              {t("Unpublished")}
            </p>
          </div>
        </>
      );
    case "12":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center ">
            <span className="status-color-start"></span>
            <p className={"meeting-status-value text-center my-0 ms-1"}>
              {t("Proposed")}
            </p>
          </div>
        </>
      );
    default:
      break;
  }
};
