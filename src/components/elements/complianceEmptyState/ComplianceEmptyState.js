import React, { memo } from "react";
import styles from "./ComplianceEmptyState.module.css"; //  CSS MODULE

import QuarterlySubmittedCompliances from "../../../assets/images/QuarterlySubmittedCompliances.png";
import UpcomingCompliance from "../../../assets/images/UpcomingCompliance.png";
import QuarterlyTasks from "../../../assets/images/QuarterlyTasks.png";
import ComplianceByDashboard from "../../../assets/images/ComplianceByDashboard.png";
import ComplianceTasksDashboard from "../../../assets/images/ComplianceTasksDashboard.png";
import ComplianceReopenDashboard from "../../../assets/images/ComplianceReopenDashboard.png";

//  Centralized Image Control
const imageMap = {
  noQuarterlySubmittedCompliance: QuarterlySubmittedCompliances,
  noUpcomingCompliance: UpcomingCompliance,
  noQuarterlyTaskCompliance: QuarterlyTasks,
  noComplianceByDashboard: ComplianceByDashboard,
  noComplianceTaskDashboard: ComplianceTasksDashboard,
  noComplianceReopenDashboard: ComplianceReopenDashboard,
};

const ComplianceEmptyState = ({
  type = "noQuarterlySubmittedCompliance",
  title = "No Data Found",
  description = "",
  layout = "imageLeft", // imageLeft | imageRight | imageTop | imageBottom
  imgWidth = "",
  imgMarginTop,
  className = "",
}) => {
  const imageSrc = imageMap[type] || QuarterlySubmittedCompliances;

  // Prevent invalid layout crash
  const layoutClass = styles[layout] || styles.imageLeft;

  return (
    <div className={`${styles.container} ${layoutClass} ${className}`}>
      <img
        src={imageSrc}
        alt={title}
        className={styles.image}
        style={{ marginTop: imgMarginTop, maxWidth: "100%" }}
        loading="lazy"
      />

      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
};

export default memo(ComplianceEmptyState);
