import React, { memo, useState } from "react";
import { Row, Col, Tag, Progress } from "antd";
import styles from "./ComplianceCard.module.css";
import GoToIcon from "./../../../assets/images/GoToIcon.png";
import AttachmentIcon from "./../../../assets/images/AttachmentIcon.png";

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
  showHoverIcon = false,
  onIconClick,
  showAttachement = false,
}) => {
  const criticality = getCriticalityConfig(criticalityId);
  const showProgress = progress !== undefined;

  // For Hovered Card Tile goTo Icon
  const [isHovered, setIsHovered] = useState(false);

  // For Attachment Icon show
  const [isAttachmentIcon, setIsAttachmentIcon] = useState(false);

  const handleIconClick = (e) => {
    e.stopPropagation();
    if (onIconClick) {
      onIconClick();
    }
  };

  return (
    <>
      <div
        className={styles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Title */}
        <Row className={styles.titleRow}>
          <Col span={24}>
            <div className={styles.titleContainer}>
              <h3 className={styles.title}>{title}</h3>
              {showHoverIcon && isHovered && (
                <div className={styles.iconContainer} onClick={handleIconClick}>
                  <img
                    src={GoToIcon}
                    alt="Go to"
                    className={styles.hoverIcon}
                  />
                </div>
              )}

              {showAttachement && (
                <div>
                  <img
                    src={AttachmentIcon}
                    alt="Attachment"
                    draggable="false"
                  />
                </div>
              )}
            </div>
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
            {description && (
              <span className={styles.boldLabel}>
                Reopen date and reason:
                <span className={styles.description}>
                  {" "}
                  {description}{" "}
                  <span
                    className={styles.seeMoreClass}
                    onClick={handleIconClick}
                  >
                    See more
                  </span>
                </span>
              </span>
            )}
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
