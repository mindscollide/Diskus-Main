import React, { useEffect, useState } from "react";
import styles from "./ViewActionModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "../../../../../components/elements";
import { useSelector } from "react-redux";
import { AuditTrialViewActionModal } from "../../../../../store/actions/Admin_Organization";
import { Col, Row } from "react-bootstrap";
import NoActionsAudits from "../../../../../assets/images/NoActionsAudits.png";
import CrossIcon from "../../../../../assets/images/BlackCrossIconModals.svg";
import Excelicon from "../../../../../assets/images/ExcelIcon.png";
import {
  AuditTrialDateTimeFunction,
  AuditTrialDateTimeFunctionViewActionDetails,
} from "../../../../../commen/functions/date_formater";
const ViewActionModal = ({ viewActionModalDataState }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const locale = localStorage.getItem("i18nextLng");

  console.log(viewActionModalDataState, "viewActionModalDataState");

  //Local state
  const [auditActionsData, setAuditActionsData] = useState([]);

  const ViewActionModalGlobalState = useSelector(
    (state) => state.adminReducer.auditTrialViewActionModal
  );

  const GetUserActionsAuditData = useSelector(
    (state) => state.adminReducer.getAuditActionsData
  );

  console.log(GetUserActionsAuditData, "GetUserActionsAuditData");

  //Extracting the Audit actions data
  useEffect(() => {
    try {
      if (GetUserActionsAuditData && GetUserActionsAuditData !== null) {
        setAuditActionsData(GetUserActionsAuditData.userLoginAuditActions);
      }
    } catch (error) {
      console.log(error, "error");
    }
    return () => {};
  }, []);

  console.log(auditActionsData, "GetUserActionsAuditData");

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
                  <span>
                    :{""}
                    {viewActionModalDataState.userName}
                  </span>
                </span>
              </Col>
              <Col lg={6} md={6} sm={6} className="d-flex justify-content-end">
                <span className={styles["UserNameStyles"]}>
                  {t("Interface")}
                  <span>
                    :{""}{" "}
                    {viewActionModalDataState.deviceID === "1"
                      ? "Web"
                      : viewActionModalDataState.deviceID === "2"
                      ? "Mobile"
                      : "Tablet"}
                  </span>
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
                {/* <div className={styles["classOne"]}>
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
                </div> */}
                <div className={styles["classOne"]}>
                  {/* LOGIN ITEM */}
                  {dummyData
                    .filter((item) => item.type === "login")
                    .map((item, index) => (
                      <span
                        key={`login-${index}`}
                        className={`
                        ${styles["item-base"]}
                        ${styles["item-border-Bottom"]}
                      `}
                      >
                        {`${AuditTrialDateTimeFunctionViewActionDetails(
                          viewActionModalDataState.dateLogin,
                          locale
                        )} – `}
                        {t("Logged-In")}
                      </span>
                    ))}

                  {/* ACTIVITY ITEMS OR NO ACTIVITY MESSAGE */}
                  {auditActionsData.length > 0 ? (
                    auditActionsData.map((item, index, arr) => (
                      <span
                        key={`activity-${index}`}
                        className={`
                          ${styles["item-base"]}
                          ${styles["item-activity"]}
                        `}
                      >
                        <span className={styles["InnerSideDescription"]}>
                          {AuditTrialDateTimeFunctionViewActionDetails(
                            item.datetime,
                            locale
                          )}{" "}
                          – {item.message}
                        </span>
                        {index !== arr.length - 1 && (
                          <hr className={styles["H1styles"]} />
                        )}
                      </span>
                    ))
                  ) : (
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex flex-column flex-wrap justify-content-center align-items-center p-4"
                      >
                        <img src={NoActionsAudits} alt="" width={150} />
                        <span className={styles["NoActivity"]}>
                          {t("No-activity")}
                        </span>
                      </Col>
                    </Row>
                  )}

                  {/* LOGOUT ITEM */}
                  {/* {dummyData
                    .filter((item) => item.type === "logout")
                    .map((item, index) => (
                      <span
                        key={`logout-${index}`}
                        className={`
                        ${styles["item-base"]}
                        ${styles["item-border-top"]}
                      `}
                      >
                        {`${item.timestamp} – ${item.status}`}
                      </span>
                    ))} */}
                </div>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Button
                  text={t("Download")}
                  icon={
                    <>
                      <img src={Excelicon} width={20} alt="" />
                    </>
                  }
                  className={styles["DownloadExcelButton"]}
                />
              </Col>
            </Row>
          </>
        }
      />
    </div>
  );
};

export default ViewActionModal;
