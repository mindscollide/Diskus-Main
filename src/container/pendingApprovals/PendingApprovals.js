import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./PendingApprovals.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Paper, ProgressLine } from "../../components/elements";
import { Flex, Progress } from "antd";

const PendingApproval = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const segments = [
    { value: 20, color: "red" },
    { value: 30, color: "blue" },
    { value: 50, color: "green" },
  ];

  return (
    <section className={styles["pendingApprovalContainer"]}>
      <Row className="my-3 d-flex align-items-center">
        <Col sm={12} md={12} lg={12}>
          <span className={styles["pendingApprovalHeading"]}>
            {t("Pending-approval")}
          </span>
        </Col>
      </Row>
      <Row>
        <Paper>
          <Container className="p-0">
            <Row>
              <Col>
                <div className={styles["overallGap"]}>
                  <Button
                    text="Review Minutes"
                    className={styles["activeMinutes"]}
                  />
                  <Button
                    text="Review & Sign"
                    className={styles["inActiveMinutes"]}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-flex">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </Col>
            </Row>
          </Container>
        </Paper>
      </Row>
    </section>
  );
};

export default PendingApproval;
