import React from "react";
import styles from "./reopenedCompliance.module.css";
import {
  ComplianceCard,
  ComplianceEmptyState,
} from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import CustomButton from "../../../../../components/elements/button/Button";
import { useTranslation } from "react-i18next";
import { formatDateToYMD } from "../../../CommonComponents/commonFunctions";
import { useSelector } from "react-redux";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { ViewComplianceDetailsByViewTypeAPI } from "../../../../../store/actions/ComplainSettingActions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const ReopenedCompliance = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    reopendComplianceDashboardFilter,
    setReopendComplianceDashboardFilter,
    setMainComplianceTabs,
    setComplianceAddEditViewState,
    setCreateEditComplaince,
    setShowViewCompliance,
  } = useComplianceContext();

  const GetComplianceReopenDashboardData = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetComplianceReopenDashboardData,
  );

  const complianceListReopen =
    GetComplianceReopenDashboardData?.reopenComplianceList?.slice(0, 3) || [];

  const filterOptions = [
    { label: "Due Date", value: 1 },
    { label: "Criticality", value: 2 },
    { label: "Authority", value: 3 },
  ];

  const hasReopenedCompliance = GetComplianceReopenDashboardData !== null;

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
      {!hasReopenedCompliance && (
        <div className={styles["reopenedComplianceCard"]}>
          <div className={styles.Header}>
            <Row>
              <Col
                md={12}
                lg={12}
                sm={12}
                className="d-flex align-items-center justify-content-start gap-2"
              >
                <h3 className={styles.cardHeading}>Reopened Compliances</h3>
                <Select
                  classNamePrefix="DashbaordSelectDropdown"
                  isSearchable={false}
                  options={filterOptions}
                  value={filterOptions.find(
                    (o) => o.value === reopendComplianceDashboardFilter,
                  )}
                  onChange={(selected) =>
                    setReopendComplianceDashboardFilter(selected.value)
                  }
                />
              </Col>
            </Row>
          </div>
          <ComplianceEmptyState
            type="noComplianceReopenDashboard"
            title="No compliances have been reopened"
            layout="imageTop"
            imgMarginTop="125px"
          />
        </div>
      )}

      {hasReopenedCompliance && (
        <div className={styles["reopenedComplianceCard"]}>
          <div className={styles.Header}>
            <Row>
              <Col
                md={12}
                lg={12}
                sm={12}
                className="d-flex align-items-center justify-content-start gap-4"
              >
                <h3 className={styles.cardHeading}>Reopened Compliances</h3>
                <Select
                  classNamePrefix="DashbaordSelectDropdown"
                  isSearchable={false}
                  options={filterOptions}
                  value={filterOptions.find(
                    (o) => o.value === reopendComplianceDashboardFilter,
                  )}
                  onChange={(selected) =>
                    setReopendComplianceDashboardFilter(selected.value)
                  }
                />
              </Col>
            </Row>
          </div>

          {/* Dynamic Rendering */}
          <div className={styles.CardInsideHeight}>
            {complianceListReopen.map((item) => (
              <ComplianceCard
                key={item.complianceId}
                title={item.complianceTitle}
                dueDate={formatDateToYMD(`${item.dueDate}`)}
                description={item.reopenReason}
                criticalityId={item.criticality} // 1=High, 2=Medium, 3=Low
                authority={item.authorityShortCode}
                showHoverIcon={false}
                onIconClick={() => handleCardClick(item.complianceId)}
                showAttachement={item.isAttachmentAttached}
              />
            ))}
          </div>

          <CustomButton
            text={t("View All Reopened Compliances")}
            className={styles.ViewAllComplianceButton}
            onClick={() => setMainComplianceTabs(2)}
          />
        </div>
      )}
    </>
  );
};

export default ReopenedCompliance;
