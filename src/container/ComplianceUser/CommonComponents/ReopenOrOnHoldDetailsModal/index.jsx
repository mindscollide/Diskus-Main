import React, { useEffect, useState } from "react";
import styles from "./ReopenOrOnHoldDetailsModal.module.css";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import {
  AttachmentViewer,
  Button,
  Modal,
} from "../../../../components/elements";
import { formatDateToYMD } from "../commonFunctions";
import downloadIcon from "../../../../assets/images/download.png";
const ReopenOrOnHoldDetailsModal = () => {
  // ReopenOrOnHoldDetailsModal
  const { t } = useTranslation();

  const { isViewDetailsOpen, setIsViewDetailsOpen, complianceDetailsState } =
    useComplianceContext();

  const handleCloseButton = () => {
    setIsViewDetailsOpen(false);
  };
  const [complianceStatusChangeHistory, setComplianceStatusChangeHistory] =
    useState([]);
  useEffect(() => {
    if (
      complianceDetailsState &&
      complianceDetailsState.complianceStatusChangeHistory.length > 0
    ) {
      try {
        setComplianceStatusChangeHistory(
          complianceDetailsState.complianceStatusChangeHistory
        );
      } catch (error) {}
    } else {
      setComplianceStatusChangeHistory([]);
    }
  }, [complianceDetailsState]);
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

  return (
    <Modal
      show={isViewDetailsOpen}
      setShow={isViewDetailsOpen}
      modalFooterClassName={"d-block border-0"}
      modalHeaderClassName={"d-block border-0"}
      size={"xl"}
      ModalTitle={<span className={styles.mainHeading}>{t("Details")}</span>}
      ModalBody={
        <div className={styles.mainBody}>
          {complianceStatusChangeHistory?.map((item) => (
            <div className={styles.detailsBlock} key={item.historyId}>
              <Row>
                <Col sm={12} md={10} lg={10} className={styles.firstCol}>
                  <Row>
                    <div className={styles.textLabel}>{`${t("Reason")}:`}</div>
                    <div className={styles.textValue}>
                      {item.statusChangeReason || "-"}
                    </div>
                  </Row>
                  <Row className="mt-3">
                    <Col sm={12}>
                      <div className={styles.textLabel}>{t("Attachments")}</div>
                    </Col>
                    {item.attachments?.length > 0
                      ? item.attachments.map((file) => (
                          <Col sm={3} md={3} lg={3}>
                            <AttachmentViewer
                              data={file}
                              name={file.displayFileName}
                              id={file.fileId}
                            />
                          </Col>
                        ))
                      : ""}
                  </Row>
                </Col>
                <Col sm={12} md={2} lg={2}>
                  <Row>
                    <div className={styles.textLabel}>{`${t(
                      "Status-updated"
                    )}:`}</div>
                    <div
                      className={styles.textValue}
                      style={{
                        color: getStatusColor(item.toStatus.statusName),
                      }}
                    >
                      {item.toStatus.statusName || "-"}
                    </div>
                  </Row>
                  <Row className="mt-3">
                    <div className={styles.textLabel}>{`${t(
                      "Action-date"
                    )}:`}</div>
                    <div className={styles.textValue}>
                      {formatDateToYMD(item.updatedDueDate) || "-"}
                    </div>
                  </Row>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      }
      ModalFooter={
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex justify-content-end gap-2"
            >
              <Button
                text={t("Close")}
                className={styles["viewDetailCloseBtn"]}
                onClick={handleCloseButton}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default ReopenOrOnHoldDetailsModal;
