import React from "react";
import styles from "./createEditCompliance.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CustomButton from "../../../../../components/elements/button/Button";
import ComplainceDetails from "./ComplianceDetails";
import ComplianceChecklist from "./CreateEditViewComplianceChecklist";
import ComplianceTask from "./CreateEditViewComplianceTask";
import { useComplianceContext } from "../../../../../context/ComplianceContext";

const CreateEditCompliance = () => {
  const { t } = useTranslation();
  const {
    complianceInfo,
    checkListTabs,
    setChecklistTabs,
    checklistCount,
    taskCount,
  } = useComplianceContext();

  return (
    <>
      <section className={styles["MainCompliance_Container"]}>
        <Row className="my-2">
          <Col sm={12} md={12} lg={12} className={styles["mainHeading"]}>
            {complianceInfo.complianceId !== 0
              ? complianceInfo.complianceName
              : t("Create-new-compliance")}
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
                  checkListTabs === 1
                    ? styles["createNewComplianceBtn_active"]
                    : styles["createNewComplianceBtn"]
                }
                text={t("Compliance-details")}
                onClick={() => {
                  setChecklistTabs(1);
                }}
              />
              <CustomButton
                className={
                  checkListTabs === 2
                    ? styles["createNewComplianceBtn_active"]
                    : styles["createNewComplianceBtn"]
                }
                disableBtn={complianceInfo.complianceId !== 0 ? false : true}
                text={`${checklistCount} ${t("Checklists")}`}
                onClick={() => {
                  setChecklistTabs(2);
                }}
              />
              <CustomButton
                className={
                  checkListTabs === 3
                    ? styles["createNewComplianceBtn_active"]
                    : styles["createNewComplianceBtn"]
                }
                disableBtn={
                  complianceInfo.complianceId === 0
                    ? true
                    : checklistCount === 0
                    ? true
                    : false
                }
                text={`${taskCount} ${t("Tasks")}`}
                onClick={() => {
                  setChecklistTabs(3);
                }}
              />
            </Col>
          </Row>

          {checkListTabs === 1 && <ComplainceDetails />}
          {checkListTabs === 2 && <ComplianceChecklist />}
          {checkListTabs === 3 && <ComplianceTask />}
        </section>
      </section>
    </>
  );
};

export default CreateEditCompliance;
