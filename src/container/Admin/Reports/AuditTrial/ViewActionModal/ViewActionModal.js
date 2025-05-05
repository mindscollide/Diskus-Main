import React from "react";
import styles from "./ViewActionModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../../../components/elements";
import { useSelector } from "react-redux";
import { AuditTrialViewActionModal } from "../../../../../store/actions/Admin_Organization";
import { Col, Row } from "react-bootstrap";
import CrossIcon from "../../../../../assets/images/BlackCrossIconModals.svg";
const ViewActionModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ViewActionModalGlobalState = useSelector(
    (state) => state.adminReducer.auditTrialViewActionModal
  );

  const dummyData = [
    {
      type: "login",
      timestamp: "2024-10-15 | 09:05 AM",
      status: "Logged In",
    },
    {
      type: "activity",
      timestamp: "2024-10-15 | 9:15 AM",
      description: "Created meeting for Project Kickoff.",
    },
    {
      type: "activity",
      timestamp: "2024-10-15 | 10:30 AM",
      description: 'Assigned task "Draft Budget Proposal" to Team B.',
    },
    {
      type: "activity",
      timestamp: "2024-10-15 | 10:30 AM",
      description: 'Assigned task "Draft Budget Proposal" to Team B.',
    },
    {
      type: "activity",
      timestamp: "2024-10-15 | 10:30 AM",
      description: 'Assigned task "Draft Budget Proposal" to Team B.',
    },
    {
      type: "logout",
      timestamp: "2024-10-15 | 10:45 AM",
      status: "Logged Out",
    },
  ];

  const handleCrossIconClick = () => {
    dispatch(AuditTrialViewActionModal(false));
  };

  return (
    <div>
      <Modal
        show={ViewActionModalGlobalState}
        setShow={dispatch(AuditTrialViewActionModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(AuditTrialViewActionModal(false));
        }}
        size={"lg"}
        ModalTitle={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end"
              >
                <img
                  src={CrossIcon}
                  className="cursor-pointer"
                  alt=""
                  onClick={handleCrossIconClick}
                />
              </Col>
            </Row>
            <Row className="mt-1">
              <Col
                lg={6}
                md={6}
                sm={6}
                className="d-flex justify-content-start"
              >
                <span className={styles["UserNameStyles"]}>
                  {t("User")}
                  <span>:{""}James Miller</span>
                </span>
              </Col>
              <Col lg={6} md={6} sm={6} className="d-flex justify-content-end">
                <span className={styles["UserNameStyles"]}>
                  {t("Interface")}
                  <span>:{""}Web</span>
                </span>
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["ViewActionModal_scroll_bar"]}
              >
                <div className={styles["classOne"]}>
                  {dummyData.map((item, index) => (
                    <span
                      key={index}
                      className={`
                    ${styles["item-base"]}
                    ${
                      item.type === "activity"
                        ? `${styles["item-activity"]}`
                        : ""
                    }
                    ${
                      index !== 0 && item.type !== "activity"
                        ? `${styles["item-border-top"]}`
                        : ""
                    }
                      ${
                        index === 0 && item.type !== "activity"
                          ? `${styles["item-border-Bottom"]}`
                          : ""
                      }
                    `}
                    >
                      {item.type === "activity" ? (
                        <>
                          <span className={styles["InnerSideDescription"]}>
                            {item.timestamp} – {item.description}
                          </span>
                          {index !== dummyData.length - 2 ? (
                            <hr className={styles["H1styles"]} />
                          ) : null}
                        </>
                      ) : (
                        `${item.timestamp} – ${item.status}`
                      )}
                    </span>
                  ))}
                </div>
              </Col>
            </Row>
          </>
        }
        ModalFooter={<></>}
      />
    </div>
  );
};

export default ViewActionModal;
