import React, { useEffect, useMemo } from "react";
import styles from "./SignatoriesList.module.css";
import { Modal } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ProfilePicImg from "../../../../../assets/images/picprofile.png";
import { useState } from "react";
import { useSelector } from "react-redux";
import NoComments from "../../../../../assets/images/NoComments.png";

// console.log(UserList);

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
  const [declineSignatories, setDeclineSignatories] = useState([]);
  const [signedSignatories, setSignedSignatories] = useState([]);
  const [pendingSignatories, setPendingSignatories] = useState([]);
  const [comments, setComments] = useState([]);
  const signatoriesList = useMemo(() => {
    // signatureListVal value is the number of names you want in the list
    const namesArray = [
      "John",
      "Alice",
      "Bob",
      "Emma",
      "Michael",
      "Sophia",
      "William",
      "Olivia",
      "James",
      "Ava",
      "Liam",
      "Isabella",
      "Mason",
      "Mia",
      "Ethan",
      "Emily",
      "Alexander",
      "Charlotte",
      "Daniel",
      "Harper",
    ];

    // Ensure signatureListVal does not exceed the length of namesArray
    const listLength = Math.min(signatureListVal, namesArray.length);

    // Generate the user list based on the specified length
    const UserList = namesArray.slice(0, listLength).map((name) => ({
      name,
      profilePic: ProfilePicImg,
    }));

    return UserList;
  }, [signatureListVal]);

  useEffect(() => {
    if (SignatureWorkFlowReducer.getAllSignatoriesStatusWise !== null) {
      try {
        const {
          signedSignatories,
          declinedSignatories,
          pendingSignatories,
          declinedComments,
        } = SignatureWorkFlowReducer.getAllSignatoriesStatusWise;
        if (signedSignatories.length > 0) {
          setSignedSignatories(signedSignatories);
        }
        if (declinedSignatories.length > 0) {
          setDeclineSignatories(declinedSignatories);
        }
        if (pendingSignatories.length > 0) {
          setPendingSignatories(pendingSignatories);
        }
        if (declinedComments.length > 0) {
          setComments(declinedComments);
        }
      } catch (error) {
        console.log(error, "SignatureWorkFlowReducer");
      }
    }
  }, [SignatureWorkFlowReducer.getAllSignatoriesStatusWise]);
  const formatValue = (value) => (value < 9 ? `0${value}` : value);

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
              <Row>
                <Col sm={4} md={4} lg={4} className={styles["SignedHeading"]}>
                  Signed({formatValue(signedSignatories.length)})
                </Col>
                <Col sm={4} md={4} lg={4} className={styles["DeclineHeading"]}>
                  Decline({formatValue(declineSignatories.length)})
                </Col>
                <Col sm={4} md={4} lg={4} className={styles["PendingHeading"]}>
                  Pending Signature({formatValue(pendingSignatories.length)})
                </Col>
              </Row>
              <section className={styles["signatoriesList_height"]}>
                <Row>
                  <Col sm={4} md={4} lg={4} className="pe-0">
                    {signedSignatories.map((nameValues, index) => {
                      return (
                        <section className="my-4 d-flex gap-1 align-items-center border-bottom ">
                          <img
                            className={`${styles["signatories_image"]} rounded-circle`}
                            width={22}
                            height={22}
                            src={`data:image/jpeg;base64,${nameValues.userProfileImg}`}
                          />
                          <span className={styles["signatoriesname_value"]}>
                            {" "}
                            {nameValues.userName}
                          </span>
                        </section>
                      );
                    })}
                  </Col>
                  <Col sm={4} md={4} lg={4} className="p-0">
                    {declineSignatories.map((nameValues, index) => {
                      return (
                        <section className="my-4 d-flex gap-1 align-items-center border-bottom">
                          <img
                            className={`${styles["signatories_image"]} rounded-circle`}
                            width={22}
                            height={22}
                            src={`data:image/jpeg;base64,${nameValues.userProfileImg}`}
                          />
                          <span className={styles["signatoriesname_value"]}>
                            {" "}
                            {nameValues.userName}
                          </span>
                        </section>
                      );
                    })}
                  </Col>
                  <Col sm={4} md={4} lg={4} className="ps-0">
                    {pendingSignatories.map((nameValues, index) => {
                      return (
                        <section className="my-4 d-flex gap-1 align-items-center border-bottom">
                          <img
                            className={`${styles["signatories_image"]} rounded-circle`}
                            width={22}
                            height={22}
                            src={`data:image/jpeg;base64,${nameValues.userProfileImg}`}
                          />
                          <span className={styles["signatoriesname_value"]}>
                            {" "}
                            {nameValues.userName}
                          </span>
                        </section>
                      );
                    })}
                  </Col>
                </Row>
              </section>
              {/* {signatoriesList.map((nameValues, index) => {
                return (
                  <section className="my-4 d-flex gap-1 align-items-center">
                    <img
                      className="rounded-circle"
                      width={22}
                      height={22}
                      src={nameValues.profilePic}
                    />
                    <span className={styles["signatoriesname_value"]}>
                      {" "}
                      {nameValues.name}
                    </span>
                  </section>
                );
              })} */}
            </Col>
            <Col sm={12} md={12} lg={12}>
              <h2 className={styles["Signatories_heading"]}>{t("Comments")}</h2>
            </Col>
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["signatoriesComments"]}
            >
              {comments.length > 0 ? (
                comments.map((commentData, index) => {
                  return (
                    <>
                      <section className={styles["commentsBox"]}>
                        <Row>
                          <Col sm={1} md={1} lg={1}></Col>
                          <Col
                            sm={11}
                            md={11}
                            lg={11}
                            className="d-flex gap-2 flex-column"
                          >
                            <span>()</span>
                            <span className={styles["commentMessage"]}>
                              {commentData.reason}
                            </span>
                          </Col>
                        </Row>
                      </section>
                    </>
                  );
                })
              ) : (
                <Col
                  sm={12}
                  lg={12}
                  md={12}
                  className="d-flex justify-content-center gap-2 align-items-center flex-column"
                >
                  <img src={NoComments} width={120} />
                  <span className={styles["No_Comments-Message"]}>{t("No-comments")}</span>
                </Col>
              )}
            </Col>
          </Row>
        </>
      }
      closeButton={true}
    />
  );
};

export default SignatoriesList;
