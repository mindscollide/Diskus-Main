import React from "react";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { Col, Row } from "react-bootstrap";
import {
  InputfieldwithCount,
  TextAreafieldwithCount,
} from "../../../../../components/elements/input_field/Input_field_withCount";
import { useTranslation } from "react-i18next";
import Select from "react-select";

import styles from "./viewComplianceDetails.module.css";
import { Tag } from "antd";

const ViewComplianceDetails = () => {
  const {
    complianceDetailsState,
    allowedComplianceStatusOptions,
    setComplianceDetailsState,
  } = useComplianceContext();
  const { t } = useTranslation();
  return (
    <>
      <Row className="mt-4">
        <Col sm={12} md={12} lg={12}>
          <TextAreafieldwithCount
            label={`${t("compliance-description")}:`}
            labelClass={styles["labelStyle"]}
            preFixClas={"viewField_TextArea_Name_complianceDetails"}
            value={complianceDetailsState.description}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm={12} md={8} lg={8}>
          <InputfieldwithCount
            label={t("Authority")}
            preFixClas={"viewField_Name"}
            value={complianceDetailsState.authority.label}
            labelClass={styles["labelStyle"]}
            showCount={false}
          />
        </Col>
        <Col sm={12} md={2} lg={2}>
          <div className={`${styles["labelStyle"]} ${styles["Select_label"]}`}>
            {t("Status")}
          </div>
          <div className={styles["Select_Authoriy_div"]}>
            <Select
              isSearchable={true}
              options={allowedComplianceStatusOptions}
              labelInValue={t("Status")}
              onChange={(event) =>
                setComplianceDetailsState((prev) => ({
                  ...prev,
                  status: event,
                }))
              }
              value={complianceDetailsState.status}
              classNamePrefix="Select_status_compliance"
            />
          </div>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm={12} md={2} lg={2}>
          <InputfieldwithCount
            label={`${t("Criticality-level")}:`}
            preFixClas={"viewField_Name"}
            value={complianceDetailsState.criticality.label}
            labelClass={styles["labelStyle"]}
            showCount={false}
          />
        </Col>
        <Col sm={12} md={2} lg={2}>
          <InputfieldwithCount
            label={`${t("Due-date")}:`}
            preFixClas={"viewField_Name"}
            value={complianceDetailsState.dueDate}
            labelClass={styles["labelStyle"]}
            showCount={false}
          />
        </Col>
        <Col sm={12} md={8} lg={8}>
          <div className={styles["tagLabel"]}>Tags</div>
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
      <Row className="mt-2 d-flex">
        <Col sm={12} md={6} lg={6}>
          Checklist
        </Col>
        <Col sm={12} md={6} lg={6}>
          Expand All
        </Col>
      </Row>
    </>
  );
};

export default ViewComplianceDetails;
