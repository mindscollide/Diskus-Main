import React, { useEffect, useState } from "react";
import { Modal, Table } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import NoComments from "../../../../../assets/images/NoComments.png";
import styles from "./SignatoriesList.module.css";
import { formatValue } from "../../../../../commen/functions/regex";

const SignatoriesList = ({ setSignatoriesList, signatories_List }) => {
  const { t } = useTranslation();
  const SignatureWorkFlowReducer = useSelector(
    (state) => state.SignatureWorkFlowReducer
  );
  const currentLanguage = localStorage.getItem("i18nextLng");
  const [declineSignatories, setDeclineSignatories] = useState(0);
  const [signedSignatories, setSignedSignatories] = useState(0);
  const [pendingSignatories, setPendingSignatories] = useState(0);
  const [comments, setComments] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [alignedData, setAlignedData] = useState([]);
  const [maxRows, setMaxRows] = useState(0);

  useEffect(() => {
    if (SignatureWorkFlowReducer.getAllSignatoriesStatusWise) {
      try {
        const {
          signedSignatories,
          declinedSignatories,
          pendingSignatories,
          declinedComments,
        } = SignatureWorkFlowReducer.getAllSignatoriesStatusWise;

        let newSignedSig = signedSignatories.map((signedData) => ({
          ...signedData,
          isSigned: true,
          isDecline: false,
          isPending: false,
        }));
        let newDeclineSig = declinedSignatories.map((declineData) => ({
          ...declineData,
          isSigned: false,
          isDecline: true,
          isPending: false,
        }));
        let newPendingSig = pendingSignatories.map((pendingData) => ({
          ...pendingData,
          isSigned: false,
          isDecline: false,
          isPending: true,
        }));

        setSignedSignatories(signedSignatories.length);
        setDeclineSignatories(declinedSignatories.length);
        setPendingSignatories(pendingSignatories.length);

        const combinedArray = [
          { SignedData: newSignedSig },
          { DeclineData: newDeclineSig },
          { PendingData: newPendingSig },
        ];
        setCombinedData(combinedArray);

        if (declinedComments.length > 0) {
          const declineCommentNewData = declinedSignatories.reduce(
            (acc, data) => {
              const comment = declinedComments.find(
                (comment) => comment.userId === data.userID
              );
              if (comment) acc.push({ ...data, ...comment });
              return acc;
            },
            []
          );
          setComments(declineCommentNewData);
        }
      } catch (error) {
        console.error("Error processing signatories data:", error);
      }
    }
  }, [SignatureWorkFlowReducer.getAllSignatoriesStatusWise]);

  useEffect(() => {
    const max = Math.max(
      combinedData[0]?.SignedData?.length || 0,
      combinedData[1]?.DeclineData?.length || 0,
      combinedData[2]?.PendingData?.length || 0
    );
    setMaxRows(max);

    const aligned = Array.from({ length: max }, (_, index) => ({
      signed: combinedData[0]?.SignedData[index] || {},
      declined: combinedData[1]?.DeclineData[index] || {},
      pending: combinedData[2]?.PendingData[index] || {},
    }));
    setAlignedData(aligned);
  }, [combinedData]);

  const columns = [
    {
      title: (
        <span>
          {t("Signed")}({formatValue(signedSignatories, currentLanguage)})
        </span>
      ),
      dataIndex: "signed",
      key: "signed",
      render: (record) =>
        record.userName ? (
          <span className=' d-flex gap-1 align-items-center'>
            <img
              className={`${styles["signatories_image"]} rounded-circle`}
              width={22}
              height={22}
              src={`data:image/jpeg;base64,${record.userProfileImg}`}
              alt={record.userName}
            />
            <span className={styles["signatoriesname_value"]}>
              {record.userName}
            </span>
          </span>
        ) : null,
    },
    {
      title: (
        <span>
          {t("Declined")}({formatValue(declineSignatories, currentLanguage)})
        </span>
      ),
      dataIndex: "declined",
      key: "declined",
      render: (record) =>
        record.userName ? (
          <span className=' d-flex gap-1 align-items-center'>
            <img
              className={`${styles["signatories_image"]} rounded-circle`}
              width={22}
              height={22}
              src={`data:image/jpeg;base64,${record.userProfileImg}`}
              alt={record.userName}
            />
            <span className={styles["signatoriesname_value"]}>
              {record.userName}
            </span>
          </span>
        ) : null,
    },
    {
      title: (
        <span>
          {t("Pending-signature")}(
          {formatValue(pendingSignatories, currentLanguage)})
        </span>
      ),
      dataIndex: "pending",
      key: "pending",
      render: (record) =>
        record.userName ? (
          <span className=' d-flex gap-1 align-items-center'>
            <img
              className={`${styles["signatories_image"]} rounded-circle`}
              width={22}
              height={22}
              src={`data:image/jpeg;base64,${record.userProfileImg}`}
              alt={record.userName}
            />
            <span className={styles["signatoriesname_value"]}>
              {record.userName}
            </span>
          </span>
        ) : null,
    },
  ];

  return (
    <Modal
      show={signatories_List}
      setShow={setSignatoriesList}
      modalHeaderClassName={styles["signatories_modal_header"]}
      onHide={() => setSignatoriesList(false)}
      size={"md"}
      modalBodyClassName={"px-3 py-1"}
      ModalBody={
        <Row>
          <Col sm={12}>
            <h2 className={styles["Signatories_heading"]}>
              {t("Signatories")}
            </h2>
          </Col>
          <Col sm={12} className={styles["signatoriesUsers"]}>
            <Table
              column={columns}
              rows={alignedData}
              pagination={false}
              rowKey={(record, index) => index}
              size={"small"}
              scroll={{ y: "40vh" }}
              className={"SignatoriesList"}
            />
          </Col>
          <Col sm={12} className='mt-3'>
            <h2 className={styles["Signatories_heading"]}>{t("Comments")}</h2>
          </Col>
          <section className={styles["signatoriesComments"]}>
            <Col sm={12}>
              {comments.length > 0 ? (
                comments.map((commentData, index) => (
                  <section key={index} className={styles["commentsBox"]}>
                    <Row>
                      <Col sm={1}>
                        <img
                          className={`${styles["signatoriesComment_image"]} rounded-circle`}
                          width={22}
                          height={22}
                          src={`data:image/jpeg;base64,${commentData.userProfileImg}`}
                          alt={commentData.userName}
                        />
                      </Col>
                      <Col sm={11} className='d-flex gap-2 flex-column'>
                        <span className={styles["Commented_user"]}>
                          {commentData.userName}
                          <span className={styles["declined_text"]}>
                            ({t("Declined")})
                          </span>
                        </span>
                        <span className={styles["commentMessage"]}>
                          {commentData.reason}
                        </span>
                      </Col>
                    </Row>
                  </section>
                ))
              ) : (
                <Col
                  sm={12}
                  className='d-flex justify-content-center gap-2 align-items-center flex-column'>
                  <img src={NoComments} width={120} alt='No Comments' />
                  <span className={styles["No_Comments-Message"]}>
                    {t("No-comments")}
                  </span>
                </Col>
              )}
            </Col>
          </section>
        </Row>
      }
    />
  );
};

export default SignatoriesList;
