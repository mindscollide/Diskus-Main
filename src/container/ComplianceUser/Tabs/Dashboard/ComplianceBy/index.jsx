import React, { useMemo } from "react";
import styles from "./complianceby.module.css";
import {
  ComplianceCard,
  ComplianceEmptyState,
} from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import CustomButton from "../../../../../components/elements/button/Button";
import { useSelector } from "react-redux";
import { formatDateToYMD } from "../../../CommonComponents/commonFunctions";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { ViewComplianceDetailsByViewTypeAPI } from "../../../../../store/actions/ComplainSettingActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const ComplianceBy = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    complianceDashboardFilter,
    setComplianceDashboardFilter,
    setMainComplianceTabs,
    setComplianceAddEditViewState,
    setCreateEditComplaince,
    setShowViewCompliance,
  } = useComplianceContext();

  const GetComplianceByDashboardData = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetComplianceByDashboardData,
  );

  const filterOptions = [
    { label: "Progress", value: 1 },
    { label: "Due Date", value: 2 },
    { label: "Criticality", value: 3 },
    { label: "Authority", value: 4 },
  ];

  const complianceList =
    GetComplianceByDashboardData?.complianceByList?.slice(0, 3) || [];

  const hasDataComplianceBy = GetComplianceByDashboardData !== null;

  const handleCardClick = (complianceId) => {
    console.log(complianceId, "asgvdajsgdv");
    const getViewType = localStorage.getItem("viewType");
    setMainComplianceTabs(2);
    const Data = {
      complianceId: Number(complianceId),
      viewType: Number(getViewType),
    };
    console.log(Data, "DataDataDataData");
    dispatch(
      ViewComplianceDetailsByViewTypeAPI(
        navigate,
        Data,
        t,
        2,
        setComplianceAddEditViewState,
        setCreateEditComplaince,
        setShowViewCompliance,
      ),
    );
  };

  return (
    <>
      {/* Show empty state when no data */}
      {!hasDataComplianceBy && (
        <div className={styles["complianceByCard"]}>
          <div className={styles.Header}>
            <Row>
              <Col
                md={12}
                lg={12}
                sm={12}
                className="d-flex align-items-center justify-content-start gap-2"
              >
                <h3 className={styles.cardHeading}>Compliance By</h3>
                <Select
                  classNamePrefix="DashbaordSelectDropdown"
                  isSearchable={false}
                  options={filterOptions}
                  value={filterOptions.find(
                    (o) => o.value === complianceDashboardFilter,
                  )}
                  onChange={(selected) =>
                    setComplianceDashboardFilter(selected.value)
                  }
                />
              </Col>
            </Row>
          </div>
          <p className={styles.subText}>
            Your progress across different compliance criteria
          </p>
          <ComplianceEmptyState
            type="noComplianceByDashboard"
            title="No compliance records available"
            layout="imageTop"
            imgMarginTop="60px"
          />
        </div>
      )}

      {/* Show when data exists */}
      {hasDataComplianceBy && (
        <>
          <div className={styles["complianceByCard"]}>
            <div className={styles.Header}>
              <Row>
                <Col
                  md={12}
                  lg={12}
                  sm={12}
                  className="d-flex align-items-center justify-content-start gap-4"
                >
                  <h3 className={styles.cardHeading}>Compliance By</h3>
                  <Select
                    classNamePrefix="DashbaordSelectDropdown"
                    isSearchable={false}
                    options={filterOptions}
                    value={filterOptions.find(
                      (o) => o.value === complianceDashboardFilter,
                    )}
                    onChange={(selected) =>
                      setComplianceDashboardFilter(selected.value)
                    }
                  />
                </Col>
              </Row>
            </div>
            <p className={styles.subText}>
              Your progress across different compliance criteria
            </p>

            {/* Dynamic Rendering */}
            <div className={styles.CardInsideHeight}>
              {complianceList.map((item) => (
                <ComplianceCard
                  key={item.complianceId}
                  title={item.complianceTitle}
                  dueDate={formatDateToYMD(`${item.dueDate}`)}
                  progress={item.progressPercentage}
                  criticalityId={item.criticality}
                  authority={item.authorityShortCode}
                  showHoverIcon={true}
                  onIconClick={() => handleCardClick(item.complianceId)}
                />
              ))}
            </div>
            <CustomButton
              text={t("View All Compliances")}
              className={styles.ViewAllCompliancesButton}
              onClick={() => setMainComplianceTabs(2)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ComplianceBy;
