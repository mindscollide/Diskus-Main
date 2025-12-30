import React, { useState } from "react";
import styles from "./createEditCompliance.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CustomButton from "../../../../../components/elements/button/Button";
import ComplainceDetails from "./ComplianceDetails";
import ComplianceChecklist from "./CreateEditViewComplianceChecklist";
import ComplianceTask from "./CreateEditViewComplianceTask";

const CreateEditCompliance = () => {
  const { t } = useTranslation();
  const [tabs, setTabs] = useState(1);
  const [checklistCount, setChecklistCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);

  return (
    <>
      <section className={styles["MainCompliance_Container"]}>
        <Row className="my-2">
          <Col sm={12} md={12} lg={12} className={styles["mainHeading"]}>
            {t("Create-new-compliance")}
          </Col>
        </Row>
        <section
          className={` ${
            styles["ComplianceInnerSection"]
          } ${"position-relative"}`}
        >
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className="d-flex align-items-left justify-content-start gap-3"
            >
              <CustomButton
                className={
                  tabs === 1
                    ? styles["createNewComplianceBtn_active"]
                    : styles["createNewComplianceBtn"]
                }
                text={t("Compliance-details")}
                onClick={() => {
                  setTabs(1);
                }}
              />
              <CustomButton
                className={
                  tabs === 2
                    ? styles["createNewComplianceBtn_active"]
                    : styles["createNewComplianceBtn"]
                }
                text={`${checklistCount} ${t("Checklists")}`}
                onClick={() => {
                  setTabs(2);
                }}
              />
              <CustomButton
                className={
                  tabs === 3
                    ? styles["createNewComplianceBtn_active"]
                    : styles["createNewComplianceBtn"]
                }
                text={`${taskCount} ${t("Tasks")}`}
                onClick={() => {
                  setTabs(3);
                }}
              />
            </Col>
          </Row>

          {tabs === 1 && <ComplainceDetails />}
          {tabs === 2 && <ComplianceChecklist />}
          {tabs === 3 && <ComplianceTask />}
        </section>
      </section>
    </>
  );
};

export default CreateEditCompliance;
