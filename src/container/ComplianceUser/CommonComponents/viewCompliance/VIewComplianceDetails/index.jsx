import React, { useState } from "react";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import styles from "./viewComplianceDetails.module.css";
import { Tag } from "antd";
import ViewComplianceChecklistAccordian from "../../ViewComplianceChecklistAccordian/index.jsx.js";
import { formatDateToYMD } from "../../commonFunctions.js";

const ViewComplianceDetails = () => {
  const [isComplianceByMe, setIsComplianceByMe] = useState(true);

  const {
    complianceDetailsState,
    allowedComplianceStatusOptions,
    setComplianceDetailsState,
  } = useComplianceContext();
  const { t } = useTranslation();
  console.log(complianceDetailsState, "complianceDetailsState");
  // Functions
  const handleChangeComplianceStatus = (event) => {
    setComplianceDetailsState((prev) => ({
      ...prev,
      status: event,
    }));
  };

  // styling for select:
  const getStatusColor = (status) => {
    switch (status) {
      case "Not Started":
        return "#9E9E9E";
      case "In Progress":
        return "#F5A623";
      case "Completed":
        return "#2ECC71";
      case "Overdue":
        return "#E74C3C";
      case "Submitted for Approval":
        return "#5B6EF5";
      case "Responded":
        return "#4FC3F7";
      case "On Hold":
        return "#26C6DA";
      case "Closed":
        return "#616161";
      default:
        return "#000";
    }
  };
  const statusSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: getStatusColor(state.data.label),
      backgroundColor: state.isFocused ? "#F5F7FF" : "#fff",
      fontWeight: 500,
      cursor: "pointer",
    }),

    menu: (provided, state) => ({
      ...provided,
      width: "160px",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: getStatusColor(state.data.label),
      fontWeight: 600,
    }),

    control: (provided, state) => ({
      ...provided,
      width: "160px",
      minHeight: "36px",
      border: "none",
      borderColor: state.isFocused ? "#6172d6" : "#d9d9d9",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#6172d6",
      },
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <>
      <Row className="mt-3">
        <Col sm={12} md={12} lg={12}>
          <div className={styles["complianceViewLabel"]}>{`${t(
            "Description"
          )}`}</div>
          <div className={styles["complianceViewValue"]}>
            {complianceDetailsState.description}
          </div>
        </Col>
      </Row>
      {isComplianceByMe ? (
        <>
          <Row className="mt-3">
            <Col sm={12} md={8} lg={8}>
              <div className={styles["complianceViewLabel"]}>
                {t("Authority")}
              </div>
              <div className={styles["complianceViewValue"]}>
                {complianceDetailsState.authority.label}
              </div>
            </Col>
            <Col sm={12} md={2} lg={2}>
              <div className={styles["complianceViewLabel"]}>{t("Status")}</div>
              <Select
                isSearchable={false}
                options={allowedComplianceStatusOptions}
                labelInValue={t("Status")}
                onChange={handleChangeComplianceStatus}
                styles={statusSelectStyles}
                value={complianceDetailsState.status}
                // classNamePrefix="Select_status_compliance"
                className={styles.Select_status_compliance}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={12} md={2} lg={2}>
              <div className={styles["complianceViewLabel"]}>{`${t(
                "Criticality-level"
              )}:`}</div>
              <div className={styles["complianceViewValue"]}>
                {complianceDetailsState.criticality.label}
              </div>
            </Col>
            <Col sm={12} md={2} lg={2}>
              <div className={styles["complianceViewLabel"]}>{`${t(
                "Due-date"
              )}:`}</div>
              <div className={styles["complianceViewValue"]}>
                {formatDateToYMD(complianceDetailsState.dueDate)}
              </div>
            </Col>
            <Col sm={12} md={8} lg={8}>
              <div className={styles["complianceViewLabel"]}>{`${t(
                "Tags"
              )}:`}</div>
              {Array.isArray(complianceDetailsState.tags) &&
                complianceDetailsState.tags.length > 0 &&
                complianceDetailsState.tags.map((tag) => (
                  <Tag key={tag.tagID} className={styles["tagsStyle"]}>
                    {tag.tagTitle}
                  </Tag>
                ))}
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row className="mt-3">
            <Col sm={12} md={3} lg={3}>
              <div className={styles["complianceViewLabel"]}>{`${t(
                "Authority"
              )}:`}</div>
              <div className={styles["complianceViewValue"]}>
                {complianceDetailsState.authority.label}
              </div>
            </Col>
            <Col sm={12} md={2} lg={2}>
              <div className={styles["complianceViewLabel"]}>{`${t(
                "Due-date"
              )}:`}</div>
              <div className={styles["complianceViewValue"]}>
                {complianceDetailsState.dueDate}
              </div>
            </Col>
            <Col sm={12} md={2} lg={2}>
              <div className={styles["complianceViewLabel"]}>{`${t(
                "Criticality-level"
              )}:`}</div>
              <div className={styles["complianceViewValue"]}>
                {complianceDetailsState.criticality.label}
              </div>
            </Col>
            <Col sm={12} md={2} lg={2}>
              <div className={styles["complianceViewLabel"]}>{`${t(
                "Status"
              )}:`}</div>
              <div className={styles["complianceViewValue"]}>
                {complianceDetailsState.status.label}
              </div>
            </Col>
            <Col sm={12} md={2} lg={2}>
              <div className={styles["complianceViewLabel"]}>{`${t(
                "Created-by"
              )}:`}</div>
              <div className={styles["complianceViewValue"]}>
                {complianceDetailsState.createdBy}
              </div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm={12} md={12} lg={12}>
              <div className={styles["complianceViewLabel"]}>{`${t(
                "Tags"
              )}:`}</div>
              {Array.isArray(complianceDetailsState.tags) &&
                complianceDetailsState.tags.length > 0 &&
                complianceDetailsState.tags.map((tag) => (
                  <Tag
                    key={tag.tagID}
                    // closable
                    className={styles["tagsStyle"]}
                    onClose={() =>
                      setComplianceDetailsState((prev) => ({
                        ...prev,
                        tags: prev.tags.filter((t) => t.tagID !== tag.tagID),
                      }))
                    }
                  >
                    {tag.tagTitle}
                  </Tag>
                ))}
            </Col>
          </Row>
        </>
      )}

      <ViewComplianceChecklistAccordian />
    </>
  );
};

export default ViewComplianceDetails;
