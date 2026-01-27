import React from "react";
import styles from "./quarterlySubmittedCompliance.module.css";
import { ComplianceEmptyState } from "../../../../../components/elements";

const QuarterlySubmittedCompliance = () => {
  return (
    <>
      <div className={styles["quarterlySubmittedCard"]}>
        <h2 className={styles.cardHeading}>Quarterly Submitted Compliances</h2>
        <ComplianceEmptyState
          type="noQuarterlySubmittedCompliance"
          title="Quarterly compliances not submitted"
          layout="imageRight"
          imgWidth="180px"
        />
      </div>
    </>
    // <div className={styles["quarterlySubmittedCard"]}>Quarterly Submitted Compliances</div>
  );
};

export default QuarterlySubmittedCompliance;
