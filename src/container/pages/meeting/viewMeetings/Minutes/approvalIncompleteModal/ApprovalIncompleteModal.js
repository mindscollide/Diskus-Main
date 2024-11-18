import React, { useState, useEffect } from "react";
import styles from "./ApprovalIncompleteModal.module.css";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "../../../../../../components/elements";
import Close from "./../Images/Close.png";
import { convertDateToGMTMinute } from "../../../../../../commen/functions/time_formatter";
import { MeetingPublishedMinutesApi } from "../../../../../../store/actions/Minutes_action";

const ApprovalIncompleteModal = ({
  setApprovalModal,
  setPublishAnywayModal,
  advanceMeetingModalID,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch(); // Redux dispatch hook

  const navigate = useNavigate();

  const { MinutesReducer } = useSelector((state) => state);

  const [rejectedUserData, setRejectedUserData] = useState(null);
  const [pendingUserData, setPendingUserData] = useState(null);
  const [totalRejectedMinutes, setTotalRejectedMinutes] = useState(0);
  const [totalPendingMinutes, setTotalPendingMinutes] = useState(0);
  const [deadlineDate, setDeadLineDate] = useState(0);

  const publishMinutes = () => {
    let Data = { MeetingID: Number(advanceMeetingModalID) };
    dispatch(
      MeetingPublishedMinutesApi(
        Data,
        navigate,
        t,
        setApprovalModal,
        setPublishAnywayModal
      )
    );
  };

  useEffect(() => {
    if (
      MinutesReducer.GetStatsForPublishingMinutesByWorkFlowIdData !== null &&
      MinutesReducer.GetStatsForPublishingMinutesByWorkFlowIdData !== undefined
    ) {
      setRejectedUserData(
        MinutesReducer?.GetStatsForPublishingMinutesByWorkFlowIdData
          ?.rejectedMinutesList
      );
      setPendingUserData(
        MinutesReducer?.GetStatsForPublishingMinutesByWorkFlowIdData
          ?.pendingMinutesList
      );
      setTotalRejectedMinutes(
        MinutesReducer?.GetStatsForPublishingMinutesByWorkFlowIdData
          ?.totalRejected
      );
      setTotalPendingMinutes(
        MinutesReducer?.GetStatsForPublishingMinutesByWorkFlowIdData
          ?.totalPending
      );
      setDeadLineDate(
        MinutesReducer?.GetStatsForPublishingMinutesByWorkFlowIdData?.deadline
      );
    }
  }, [MinutesReducer.GetStatsForPublishingMinutesByWorkFlowIdData]);

  return (
    <Modal
      show={true}
      size="md"
      onHide={() => setApprovalModal(false)}
      modalHeaderClassName="justify-content-end no-padding-top"
      ModalTitle={
        <>
          <Row className="text-end">
            <Col
              onClick={() => setApprovalModal(false)}
              lg={12}
              md={12}
              sm={12}
              className="cursor-pointer"
            >
              <img src={Close} alt="" />
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <p className={styles["approval-confirmation"]}>
                {t(
                  "Approval-status-is-incomplete-do-you-want-to-proceed-with-publishing-the-minutes"
                )}
              </p>
            </Col>
          </Row>
        </>
      }
      modalBodyClassName={styles["modalBodyClass"]}
      ModalBody={
        <>
          <div className={styles["list-section"]}>
            <p className={styles["rejected-heading"]}>
              {t("Total-rejected")} ({totalRejectedMinutes})
            </p>
            <ol className={styles["ordered-list"]}>
              {rejectedUserData?.map((data, index) => {
                return (
                  <li>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.minuteDetail,
                      }}
                      className={styles["remove-p-margin"]}
                    ></div>
                    <p className={styles["users"]}>
                      {data?.listOfUsers.map((users, index) => {
                        return index === data.listOfUsers.length - 1
                          ? `${users}`
                          : `${users},   `;
                      })}
                    </p>
                  </li>
                );
              })}
            </ol>
            <div className={styles["separator"]}></div>
            <p className={styles["pending-heading"]}>
              {t("Total-pending")} ({totalPendingMinutes})
            </p>
            <ol className={styles["ordered-list"]}>
              {pendingUserData?.map((data, index) => {
                return (
                  <li>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.minuteDetail,
                      }}
                      className={styles["remove-p-margin"]}
                    ></div>
                    <p className={styles["users"]}>
                      {data?.listOfUsers.map((users, index) => {
                        return index === data.listOfUsers.length - 1
                          ? `${users}`
                          : `${users},   `;
                      })}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className={styles["deadline-section"]}>
            <p className={styles["deadline-text"]}>
              {t("Deadline")}: {convertDateToGMTMinute(deadlineDate)}
            </p>
          </div>
        </>
      }
      modalFooterClassName={"d-block"}
      ModalFooter={
        <>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className="d-flex align-items-center justify-content-end"
            >
              <Button
                text={t("Cancel")}
                onClick={() => setApprovalModal(false)}
                className={styles["Button_Cancel"]}
              />
              <Button
                text={t("Publish-anyway")}
                onClick={publishMinutes}
                className={styles["Button_Publish"]}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default ApprovalIncompleteModal;
