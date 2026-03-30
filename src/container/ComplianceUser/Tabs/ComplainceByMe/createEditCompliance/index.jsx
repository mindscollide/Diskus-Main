import React, { useEffect, useRef } from "react";
import styles from "./createEditCompliance.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CustomButton from "../../../../../components/elements/button/Button";
import ComplainceDetails from "./ComplianceDetails";
import ComplianceChecklist from "./CreateEditViewComplianceChecklist";
import ComplianceTask from "./CreateEditViewComplianceTask";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetComplianceChecklistsByComplianceIdAPI } from "../../../../../store/actions/ComplainSettingActions";
import { formatDateToYMD } from "../../../CommonComponents/commonFunctions";
import ViewCompliance from "../../../CommonComponents/viewCompliance";
import { useSelector } from "react-redux";

const CreateEditCompliance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    complianceInfo,
    checkListTabs,
    checkListData,
    setChecklistTabs,
    checklistCount,
    taskCount,
    complianceAddEditViewState,
    complianceDetailsState,
    showViewCompliance,
    setShowViewCompliance,
    isComplianceCreatOrEdit,
    setIsComplianceCreateOrEdit,
  } = useComplianceContext();
  // Tracking all Loading States
  const modeRef = useRef(complianceAddEditViewState);
  console.log(
    { checkListData, complianceDetailsState },
    "checkListTabscheckListTabs",
  );

  console.log(
    { complianceAddEditViewState, showViewCompliance },
    "complianceAddEditViewState",
  );

  console.log(complianceInfo, "complianceInfo");

  useEffect(() => {
    if (complianceInfo.complianceId !== 0) {
      try {
        const complianceId = { complianceId: complianceInfo.complianceId };
        dispatch(
          GetComplianceChecklistsByComplianceIdAPI(navigate, complianceId, t),
        );
      } catch (error) {}
    }
  }, []);

  useEffect(() => {
    if (complianceDetailsState.complianceId !== 0) {
      try {
        const complianceId = { complianceId: complianceInfo.complianceId };
        dispatch(
          GetComplianceChecklistsByComplianceIdAPI(navigate, complianceId, t),
        );
      } catch (error) {}
    }
  }, []);

  console.log(
    complianceDetailsState,
    "complianceDetailsStatecomplianceDetailsState",
  );

  const getTitle = () => {
    // ✅ Default (including 0, undefined, initial state)
    if (isComplianceCreatOrEdit !== 1 && isComplianceCreatOrEdit !== 2) {
      return t("Create-new-compliance");
    }

    // ✅ When user starts creating & name exists
    if (isComplianceCreatOrEdit === 1) {
      return complianceInfo?.complianceName || t("Create-new-compliance");
    }

    // ✅ Edit mode
    if (isComplianceCreatOrEdit === 2) {
      return `Edit: ${complianceInfo?.complianceName || ""}`;
    }

    return "";
  };

  console.log("createEditComplicance");
  return (
    <>
      <section
        className={styles["MainCompliance_Container"]}
        // ref={ComplianceMain}
      >
        <Row className="my-2 ">
          <Col sm={12} md={9} lg={9} className={styles["mainHeading"]}>
            {getTitle()}
          </Col>

          {}
          <Col sm={12} md={3} lg={3} className={styles["mainHeading2"]}>
            {complianceDetailsState.dueDate !== ""
              ? `Due Date: ${
                  complianceDetailsState.dueDate !== null &&
                  complianceDetailsState.dueDate !== undefined &&
                  complianceDetailsState.dueDate !== "" &&
                  formatDateToYMD(complianceDetailsState.dueDate)
                }`
              : ""}
          </Col>

          {/* <Col sm={12} md={12} lg={12} className={styles["mainHeading"]}>
            {complianceAddEditViewState === 0
              ? t("Create-new-compliance")
              : complianceAddEditViewState === 1
              ? complianceInfo.complianceName !== ""
                ? complianceInfo.complianceName
                : complianceAddEditViewState === 2
                ? `Edit: ${complianceInfo.complianceName}`
                : ""
              : ""} 
          </Col>*/}
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
                disableBtn={
                  complianceInfo.complianceId !== 0
                    ? false
                    : complianceAddEditViewState === 2
                      ? false
                      : true
                }
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
                  complianceAddEditViewState === 2
                    ? false
                    : complianceInfo.complianceId === 0
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
