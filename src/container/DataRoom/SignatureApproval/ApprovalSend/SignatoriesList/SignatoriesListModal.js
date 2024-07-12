import React, { useEffect, useState } from "react";
import { Modal, Table } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import NoComments from "../../../../../assets/images/NoComments.png";
import styles from "./SignatoriesList.module.css";

const SignatoriesList = ({
  setSignatoriesList,
  signatories_List,
  signatureListVal,
}) => {
  const { t } = useTranslation();
  const SignatureWorkFlowReducer = useSelector(
    (state) => state.SignatureWorkFlowReducer
  );
  const [members, setMembers] = useState([]);
  const [declineSignatories, setDeclineSignatories] = useState(0);
  const [signedSignatories, setSignedSignatories] = useState(0);
  const [pendingSignatories, setPendingSignatories] = useState(0);
  const [comments, setComments] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  console.log(comments, "commentscomments")
  useEffect(() => {
    if (SignatureWorkFlowReducer.getAllSignatoriesStatusWise !== null) {
      try {
        let declineCommentNewData = [];
        let combinedArray = [];
        const {
          signedSignatories,
          declinedSignatories,
          pendingSignatories,
          declinedComments,
        } = SignatureWorkFlowReducer.getAllSignatoriesStatusWise;

        let newSignedSig = [];
        let newDeclineSig = [];
        let newPendingSig = [];
        if (signedSignatories.length > 0) {
          newSignedSig = signedSignatories.map((signedData) => ({
            ...signedData,
            isSigned: true,
            isDecline: false,
            isPending: false,
          }));
          setSignedSignatories(signedSignatories.length);
        }
        if (declinedSignatories.length > 0) {
          newDeclineSig = declinedSignatories.map((declineData) => ({
            ...declineData,
            isSigned: false,
            isDecline: true,
            isPending: false,
          }));
          setDeclineSignatories(declinedSignatories.length);
        }
        if (pendingSignatories.length > 0) {
          newPendingSig = pendingSignatories.map((pendingData) => ({
            ...pendingData,
            isSigned: false,
            isDecline: false,
            isPending: true,
          }));
          setPendingSignatories(pendingSignatories.length);
        }

        combinedArray = [
          { SignedData: [...newSignedSig] },
          { DeclineData: [...newDeclineSig] },
          { PendingData: [...newPendingSig] },
        ];
        setCombinedData(combinedArray);
        if (declinedComments.length > 0) {
          if (declinedSignatories.length > 0) {
            declinedSignatories.forEach((data) => {
              declinedComments.forEach((data2) => {
                if (data.userID === data2.userId) {
                  let mergedData = { ...data2, ...data };
                  declineCommentNewData.push(mergedData);
                }
              });
            });
          }
          setComments(declineCommentNewData);
        }
      } catch (error) {
        console.log(error, "SignatureWorkFlowReducer");
      }
    }
  }, [SignatureWorkFlowReducer.getAllSignatoriesStatusWise]);

  const formatValue = (value) => (value < 9 ? `0${value}` : value);

  const columns = [
    {
      title: <span> Signed({formatValue(signedSignatories)})</span>,
      dataIndex: "signed",
      key: "signed",
      render: (record) => {
        console.log(record, "recordrecordrecord");
        return (
          <span className="d-flex gap-1  ">
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
        );
      },
    },
    {
      title: <span> Declined({formatValue(declineSignatories)})</span>,
      dataIndex: "declined",
      key: "declined",
      render: (record) =>
        record.userName ? (
          <span className=" d-flex gap-1 align-items-center">
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
      title: <span> Pending Signature({formatValue(pendingSignatories)})</span>,
      dataIndex: "pending",
      key: "pending",
      render: (record) =>
        record.userName ? (
          <span className=" d-flex gap-1 align-items-center ">
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

  const maxRows = Math.max(
    combinedData[0]?.SignedData.length || 0,
    combinedData[1]?.DeclineData.length || 0,
    combinedData[2]?.PendingData.length || 0
  );

  const alignedData = Array.from({ length: maxRows }, (_, index) => ({
    signed: combinedData[0]?.SignedData[index] || {},
    declined: combinedData[1]?.DeclineData[index] || {},
    pending: combinedData[2]?.PendingData[index] || {},
  }));
  console.log(alignedData, "alignedDataalignedData");
  return (
    <Modal
      show={signatories_List}
      setShow={setSignatoriesList}
      modalHeaderClassName={styles["signatories_modal_header"]}
      onHide={() => {
        setSignatoriesList(false);
      }}
      size={"md"}
      modalBodyClassName={"px-3 py-1"}
      ModalBody={
        <>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <h2 className={styles["Signatories_heading"]}>
                {t("Signatories")}
              </h2>
            </Col>
            <Col sm={12} md={12} lg={12} className={styles["signatoriesUsers"]}>
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
            <Col sm={12} md={12} lg={12} className="mt-3">
              <h2 className={styles["Signatories_heading"]}>{t("Comments")}</h2>
            </Col>
            <section className={styles["signatoriesComments"]}>
              <Col sm={12} md={12} lg={12}>
                {comments.length > 0 ? (
                  comments.map((commentData, index) => (
                    <section key={index} className={styles["commentsBox"]}>
                      <Row>
                        <Col sm={1} md={1} lg={1}>
                          <img
                            className={`${styles["signatoriesComment_image"]} rounded-circle`}
                            width={22}
                            height={22}
                            src={`data:image/jpeg;base64,${commentData.userProfileImg}`}
                          />
                        </Col>
                        <Col
                          sm={11}
                          md={11}
                          lg={11}
                          className="d-flex gap-2 flex-column"
                        >
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
                    lg={12}
                    md={12}
                    className="d-flex justify-content-center gap-2 align-items-center flex-column"
                  >
                    <img src={NoComments} width={120} />
                    <span className={styles["No_Comments-Message"]}>
                      {t("No-comments")}
                    </span>
                  </Col>
                )}
              </Col>
            </section>
          </Row>
        </>
      }
    />
  );
};

export default SignatoriesList;
