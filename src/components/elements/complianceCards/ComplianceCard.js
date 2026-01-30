import React, { memo } from "react";
import { Row, Col, Tag, Progress } from "antd";
import styles from "./ComplianceCard.module.css";

/* 🔹 Criticality Style Logic */
const getCriticalityConfig = (id) => {
  switch (Number(id)) {
    case 1:
      return { text: "High", bg: "#FFDEDE", color: "#F16B6B" };
    case 2:
      return { text: "Medium", bg: "#FFF8E1", color: "#D8A709" };
    case 3:
      return { text: "Low", bg: "#DAF5DC", color: "#55CE5C" };
    default:
      return null;
  }
};

/* 🔹 Authority Style */
const authorityTagStyle = {
  background: "#ECEFFF",
  color: "#6172D6",
  border: "none",
  fontWeight: 700,
  fontSize: "10px",
  fontFamily: "Montserrat",
};

const ComplianceCard = ({
  title,
  dueDate,
  description,
  progress,
  criticalityId,
  authority,
}) => {
  const criticality = getCriticalityConfig(criticalityId);
  const showProgress = progress !== undefined;
  return (
    <>
      <div className={styles.card}>
        {/* Title */}
        <Row>
          <Col span={24}>
            <h3 className={styles.title}>{title}</h3>
          </Col>
        </Row>

        {/* Due Date + Tags */}
        <Row className={styles.metaRow}>
          <Col xs={24} sm={8}>
            <span className={styles.dueDate}>Due: {dueDate}</span>
          </Col>

          <Col xs={24} sm={12} className={styles.tagWrapper}>
            {criticality && (
              <Tag
                style={{
                  background: criticality.bg,
                  color: criticality.color,
                  border: "none",
                  fontWeight: 700,
                  fontSize: "10px",
                  fontFamily: "Montserrat",
                }}
              >
                {criticality.text}
              </Tag>
            )}

            {authority && <Tag style={authorityTagStyle}>{authority}</Tag>}
          </Col>
        </Row>

        {/* Description */}
        <Row>
          <Col span={24}>
            <p className={styles.description}>{description}</p>
          </Col>
        </Row>

        {/* Progress */}
        {showProgress && (
          <Row>
            <Col span={24}>
              <div className={styles.progressWrapper}>
                <div className={styles.progressLabel}>{progress}%</div>
                <Progress
                  percent={progress}
                  className="complianceProgressBarColor"
                  trailColor="#E1E1E1"
                  showInfo={false}
                />
              </div>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default memo(ComplianceCard);
