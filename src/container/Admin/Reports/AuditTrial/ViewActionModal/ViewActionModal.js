import React, { useEffect, useState } from "react";
import styles from "./ViewActionModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Modal } from "../../../../../components/elements";
import { useSelector } from "react-redux";
import { AuditTrialViewActionModal } from "../../../../../store/actions/Admin_Organization";
import { Col, Row } from "react-bootstrap";
import NoActionsAudits from "../../../../../assets/images/NoActionsAudits.png";
import CrossIcon from "../../../../../assets/images/BlackCrossIconModals.svg";
import Excelicon from "../../../../../assets/images/ExcelIcon.png";
import { AuditTrialDateTimeFunctionViewActionDetails } from "../../../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import { downloadAuditTrialReportApi } from "../../../../../store/actions/Download_action";
const ViewActionModal = ({ viewActionModalDataState }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const locale = localStorage.getItem("i18nextLng");

  

  //Local state
  const [auditActionsData, setAuditActionsData] = useState([]);

  const ViewActionModalGlobalState = useSelector(
    (state) => state.adminReducer.auditTrialViewActionModal
  );

  const GetUserActionsAuditData = useSelector(
    (state) => state.adminReducer.getAuditActionsData
  );

  //Extracting the Audit actions data
  useEffect(() => {
    try {
      if (GetUserActionsAuditData && GetUserActionsAuditData !== null) {
        setAuditActionsData(GetUserActionsAuditData.userLoginAuditActions);
      } else {
        setAuditActionsData([]);
      }
    } catch (error) {
      
    }
    return () => {
      setAuditActionsData([]);
    };
  }, [GetUserActionsAuditData]);

  const handleCrossIconClick = () => {
    dispatch(AuditTrialViewActionModal(false));
  };

  const handleDownloadButton = () => {
    let Data = {
      UserLoginHistoryID: Number(viewActionModalDataState.userLoginHistoryID),
    };

    dispatch(downloadAuditTrialReportApi(navigate, t, Data));
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
                  {""}
                  <span>
                    :&nbsp;
                    {viewActionModalDataState.userName}
                  </span>
                </span>
              </Col>
              <Col lg={6} md={6} sm={6} className="d-flex justify-content-end">
                <span className={styles["UserNameStyles"]}>
                  {t("Interface")}
                  {""}
                  <span>
                    :&nbsp;
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
                <div className={styles["classOne"]}>
                  <span
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
                  <span
                    className={`
                        ${styles["item-base"]}
                        ${styles["item-border-top"]}
                      `}
                  >
                    {`${AuditTrialDateTimeFunctionViewActionDetails(
                      viewActionModalDataState.dateLogOut,
                      locale
                    )} – `}
                    {t("Logged-out")}
                  </span>
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
                  onClick={handleDownloadButton}
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
