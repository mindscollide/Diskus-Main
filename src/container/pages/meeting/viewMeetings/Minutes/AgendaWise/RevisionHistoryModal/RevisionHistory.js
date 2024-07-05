import React, { useState, useEffect, useRef } from "react";
import styles from "./RevisionHistory.module.css";
import { Container, Col, Row } from "react-bootstrap";
import {
  Modal,
  Button,
  AttachmentViewer,
} from "../../../../../../../components/elements";
import DropdownPurple from "./../../Images/Dropdown-Purple.png";
import EditIcon from "./../../Images/Edit-Icon.png";
import { useTranslation } from "react-i18next";
import DefaultAvatar from "./../../../../../../MinutesNewFlow/Images/avatar.png";
import EditCommentModal from "./EditCommentModal/EditComment";
import ConfirmationEditData from "./ConfirmationEdit/ConfirmationEdit";
import ResendMinuteReviewModal from "./ResendForReview/ResendReview";

const RevisionHistory = ({ showRevisionHistory, setShowRevisionHistory }) => {
  const { t } = useTranslation();

  let currentLanguage = localStorage.getItem("i18nextLng");

  const [openReviewerDetail, setOpenReviewerDetail] = useState(false);

  const [editMinute, setEditMinute] = useState(false);
  const [confirmationEdit, setConfirmationEdit] = useState(false);
  const [resendMinuteForReview, setResendMinuteForReview] = useState(false);

  const editMinuteFunction = () => {
    if (editMinute === false) {
      setEditMinute(true);
    } else {
      setEditMinute(false);
    }
  };

  const openCloseReviewerDetail = () => {
    if (openReviewerDetail === false) {
      setOpenReviewerDetail(true);
    } else {
      setOpenReviewerDetail(false);
    }
  };

  return (
    <Modal
      onHide={
        editMinute
          ? () => {
              setEditMinute(false);
              setConfirmationEdit(true);
              setResendMinuteForReview(false);
            }
          : confirmationEdit
          ? () => {
              setEditMinute(true);
              setConfirmationEdit(false);
              setResendMinuteForReview(false);
            }
          : () => setShowRevisionHistory(false)
      }
      show={true}
      className={
        editMinute || confirmationEdit || resendMinuteForReview
          ? ""
          : "FullScreenModal"
      }
      fullscreen={
        editMinute || confirmationEdit || resendMinuteForReview ? false : true
      }
      size={
        editMinute || confirmationEdit || resendMinuteForReview ? "md" : "lg"
      }
      ModalBody={
        editMinute ? (
          <EditCommentModal
            editMinute={editMinute}
            setEditMinute={setEditMinute}
            confirmationEdit={confirmationEdit}
            setConfirmationEdit={setConfirmationEdit}
            resendMinuteForReview={resendMinuteForReview}
            setResendMinuteForReview={setResendMinuteForReview}
          />
        ) : confirmationEdit ? (
          <ConfirmationEditData
            editMinute={editMinute}
            setEditMinute={setEditMinute}
            confirmationEdit={confirmationEdit}
            setConfirmationEdit={setConfirmationEdit}
            resendMinuteForReview={resendMinuteForReview}
            setResendMinuteForReview={setResendMinuteForReview}
          />
        ) : resendMinuteForReview ? (
          <ResendMinuteReviewModal
            editMinute={editMinute}
            setEditMinute={setEditMinute}
            confirmationEdit={confirmationEdit}
            setConfirmationEdit={setConfirmationEdit}
            resendMinuteForReview={resendMinuteForReview}
            setResendMinuteForReview={setResendMinuteForReview}
          />
        ) : (
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div className={styles["gap-subcomments"]}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <p className={styles["Parent-title-heading"]}>
                        {t("Revision-history")}
                      </p>
                    </Col>
                  </Row>
                  <div className={`${styles["barline"]} position-relative`}>
                    <span className={styles["barlinespan"]}></span>
                    {openReviewerDetail === false ? (
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <div className={styles["reviewer-progress-wrapper"]}>
                            <Row>
                              <Col lg={11} md={11} sm={12}>
                                <div
                                  className={styles["reviewer-progress-text"]}
                                >
                                  <p className="m-0">Total: 03</p>
                                  <span>|</span>
                                  <p className="m-0">Accepted: 01</p>
                                  <span>|</span>
                                  <p className="m-0">Rejected: 01</p>
                                  <span>|</span>
                                  <p className="m-0">Pending: 01</p>
                                </div>
                              </Col>
                              <Col lg={1} md={1} sm={12} className="text-end">
                                <img
                                  alt=""
                                  src={DropdownPurple}
                                  className={
                                    openReviewerDetail
                                      ? `${styles["Arrow"]} cursor-pointer`
                                      : `${styles["Arrow_Expanded"]} cursor-pointer`
                                  }
                                  onClick={openCloseReviewerDetail}
                                />
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    ) : (
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <div className={styles["reviewer-progress-wrapper"]}>
                            <Row>
                              <Col lg={11} md={11} sm={12}>
                                <div
                                  className={styles["reviewer-progress-text"]}
                                >
                                  <p>Total: 03</p>
                                  <span>|</span>
                                  <p>Accepted: 01</p>
                                  <span>|</span>
                                  <p>Rejected: 01</p>
                                  <span>|</span>
                                  <p>Pending: 01</p>
                                </div>
                              </Col>
                              <Col lg={1} md={1} sm={12} className="text-end">
                                <img
                                  alt=""
                                  src={DropdownPurple}
                                  className={
                                    openReviewerDetail
                                      ? `${styles["Arrow"]} cursor-pointer`
                                      : `${styles["Arrow_Expanded"]} cursor-pointer`
                                  }
                                  onClick={openCloseReviewerDetail}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-accepted"]}>
                                    Review Accepted:
                                  </span>{" "}
                                  Alessandra Costa, Emily Davis, Matthew Jones,
                                  Christopher Martinez, Elizabeth Garcia, Olivia
                                  Nguyen, Ethan Patel, Madison Kim, Tyler Chen,
                                  Sophia Gupta, Mason Kumar, Ava Wong, Logan
                                  Singh, Jackson Li, Chloe Patel, Noah Patel,
                                  Lily Chang, Lucas Patel, Amelia Tran.
                                </p>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-declined"]}>
                                    Review Rejected:
                                  </span>{" "}
                                  Alex Rodriguez, Samantha Lee.
                                </p>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-pending"]}>
                                    Review Pending:
                                  </span>{" "}
                                  Sarah Jenkins, Joshua Clark, Megan Rodriguez,
                                  Brandon Young.
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    )}
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="position-relative"
                      >
                        {/* First */}

                        <div
                          className={
                            styles["version-control-wrapper-with-more"]
                          }
                        >
                          <span className={styles["with-text"]}>V3.0</span>
                        </div>

                        <div className={styles["uploaded-details"]}>
                          <Row className={styles["inherit-height"]}>
                            <Col lg={9} md={9} sm={12}>
                              <p className={styles["minutes-text"]}>
                                Task updates: Design phase completed, moving to
                                development, discussed resource reallocation to
                                address delays and decided unknown unknown
                                printer took a galley of type a printer took a
                                galley of type a to hold daily check-ins for
                                quicker progress Design phase completed, moving
                                to development, discussed resource reallocation
                                to address delays and decided unknown unknown
                                printer took a galley of type a printer took a
                                galley of type a to hold daily check-ins for
                                quicker progress Design phase completed, moving
                                to development, discussed resource reallocation
                                to address delays and decided unknown unknown
                                printer took a galley of type a printer took a
                                galley of type a to update.
                              </p>
                              <Row className="mt-1">
                                {/* {fileAttachments.length > 0
                        ? fileAttachments.map((data, index) => {
                            console.log(data, "datadatadata");
                            return (
                              <> */}
                                <Col lg={3} md={3} sm={3}>
                                  <AttachmentViewer
                                    // data={data}
                                    id={0}
                                    name={"DummyFile.pdf"}
                                    fk_UID={"1233"}
                                    // handleClickRemove={() => handleRemoveFile(data)}
                                  />
                                </Col>
                                <Col lg={3} md={3} sm={3}>
                                  <AttachmentViewer
                                    // data={data}
                                    id={0}
                                    name={"DummyFile.xls"}
                                    fk_UID={"1233"}
                                    // handleClickRemove={() => handleRemoveFile(data)}
                                  />
                                </Col>
                                <Col lg={3} md={3} sm={3}>
                                  <AttachmentViewer
                                    // data={data}
                                    id={0}
                                    name={"DummyFile.doc"}
                                    fk_UID={"1233"}
                                    // handleClickRemove={() => handleRemoveFile(data)}
                                  />
                                </Col>
                                {/* </>
                            );
                          })
                        : null} */}
                              </Row>
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={12}
                              className="position-relative"
                            >
                              <Row className="m-0">
                                <Col lg={12} md={12} sm={12} className="p-0">
                                  <span className={styles["bar-line"]}></span>
                                  <p className={styles["uploadedbyuser"]}>
                                    Uploaded By
                                  </p>{" "}
                                  <img
                                    className={styles["edit-icon"]}
                                    src={EditIcon}
                                    alt=""
                                    onClick={editMinuteFunction}
                                  />
                                  <div className={styles["gap-ti"]}>
                                    <img
                                      src={DefaultAvatar}
                                      className={styles["Image"]}
                                      alt=""
                                      draggable={false}
                                    />
                                    <p className={styles["agendaCreater"]}>
                                      Alex Rodriguez
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                              <Row
                                className={`${styles["positioning-tb"]} m-0`}
                              >
                                <Col lg={12} md={12} sm={12}>
                                  <p className={styles["time-uploader"]}>
                                    4:00pm,
                                  </p>
                                  <p className={styles["date-uploader"]}>
                                    18th May, 2024
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="position-relative"
                      >
                        <div className={styles["version-control-wrapper"]}>
                          <span></span>
                        </div>
                        <div className={styles["uploaded-details-rejected"]}>
                          <Row className={styles["inherit-height"]}>
                            <Col lg={9} md={9} sm={12}>
                              <p className={styles["minutes-text"]}>
                                Task updates: Design phase completed, moving to
                                development, discussed resource reallocation to
                                address delays and decided unknown unknown
                                printer took a galley of type a printer took a
                                galley of type a to hold daily check-ins for
                                quicker progress Design phase completed, moving
                                to development, discussed resource reallocation
                                to address delays and decided unknown unknown
                                printer took a galley of type a printer took a
                                galley of type a to hold daily check-ins for
                                quicker progress Design phase completed, moving
                                to development, discussed resource reallocation
                                to address delays and decided unknown unknown
                                printer took a galley of type a printer took a
                                galley of type a to update.
                              </p>
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={12}
                              className="position-relative"
                            >
                              <Row className="m-0">
                                <Col lg={12} md={12} sm={12} className="p-0">
                                  <span className={styles["bar-line"]}></span>
                                  <p className={styles["uploadedbyuser"]}>
                                    Uploaded By
                                  </p>
                                  <div className={styles["gap-ti"]}>
                                    <img
                                      src={DefaultAvatar}
                                      className={styles["Image"]}
                                      alt=""
                                      draggable={false}
                                    />
                                    <p className={styles["agendaCreater"]}>
                                      Alex Rodriguez
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                              <Row
                                className={`${styles["positioning-tb"]} m-0`}
                              >
                                <Col lg={12} md={12} sm={12}>
                                  <p className={styles["time-uploader"]}>
                                    4:00pm,
                                  </p>
                                  <p className={styles["date-uploader"]}>
                                    18th May, 2024
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>

                    {openReviewerDetail === false ? (
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <div className={styles["reviewer-progress-wrapper"]}>
                            <Row>
                              <Col lg={11} md={11} sm={12}>
                                <div
                                  className={styles["reviewer-progress-text"]}
                                >
                                  <p className="m-0">Total: 03</p>
                                  <span>|</span>
                                  <p className="m-0">Accepted: 01</p>
                                  <span>|</span>
                                  <p className="m-0">Rejected: 01</p>
                                  <span>|</span>
                                  <p className="m-0">Pending: 01</p>
                                </div>
                              </Col>
                              <Col lg={1} md={1} sm={12} className="text-end">
                                <img
                                  alt=""
                                  src={DropdownPurple}
                                  className={
                                    openReviewerDetail
                                      ? `${styles["Arrow"]} cursor-pointer`
                                      : `${styles["Arrow_Expanded"]} cursor-pointer`
                                  }
                                  onClick={openCloseReviewerDetail}
                                />
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    ) : (
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <div className={styles["reviewer-progress-wrapper"]}>
                            <Row>
                              <Col lg={11} md={11} sm={12}>
                                <div
                                  className={styles["reviewer-progress-text"]}
                                >
                                  <p>Total: 03</p>
                                  <span>|</span>
                                  <p>Accepted: 01</p>
                                  <span>|</span>
                                  <p>Rejected: 01</p>
                                  <span>|</span>
                                  <p>Pending: 01</p>
                                </div>
                              </Col>
                              <Col lg={1} md={1} sm={12} className="text-end">
                                <img
                                  alt=""
                                  src={DropdownPurple}
                                  className={
                                    openReviewerDetail
                                      ? `${styles["Arrow"]} cursor-pointer`
                                      : `${styles["Arrow_Expanded"]} cursor-pointer`
                                  }
                                  onClick={openCloseReviewerDetail}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-accepted"]}>
                                    Review Accepted:
                                  </span>{" "}
                                  Alessandra Costa, Emily Davis, Matthew Jones,
                                  Christopher Martinez, Elizabeth Garcia, Olivia
                                  Nguyen, Ethan Patel, Madison Kim, Tyler Chen,
                                  Sophia Gupta, Mason Kumar, Ava Wong, Logan
                                  Singh, Jackson Li, Chloe Patel, Noah Patel,
                                  Lily Chang, Lucas Patel, Amelia Tran.
                                </p>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-declined"]}>
                                    Review Rejected:
                                  </span>{" "}
                                  Alex Rodriguez, Samantha Lee.
                                </p>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-pending"]}>
                                    Review Pending:
                                  </span>{" "}
                                  Sarah Jenkins, Joshua Clark, Megan Rodriguez,
                                  Brandon Young.
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    )}
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="position-relative"
                      >
                        <div
                          className={
                            styles["version-control-wrapper-with-more"]
                          }
                        >
                          <span className={styles["with-text"]}>V2.0</span>
                        </div>
                        <div className={styles["uploaded-details"]}>
                          <Row className={styles["inherit-height"]}>
                            <Col lg={9} md={9} sm={12}>
                              <p className={styles["minutes-text"]}>
                                Task updates: Design phase completed, moving to
                                development, discussed resource reallocation to
                                address delays and decided unknown unknown
                                printer took a galley of type a printer took a
                                galley of type a to hold daily check-ins for
                                quicker progress Design phase completed, moving
                                to development, discussed resource reallocation
                                to address delays and decided unknown unknown
                                printer took a galley of type a printer took a
                                galley of type a to hold daily check-ins for
                                quicker progress Design phase completed, moving
                                to development, discussed resource reallocation
                                to address delays and decided unknown unknown
                                printer took a galley of type a printer took a
                                galley of type a to update.
                              </p>
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={12}
                              className="position-relative"
                            >
                              <Row className="m-0">
                                <Col lg={12} md={12} sm={12} className="p-0">
                                  <span className={styles["bar-line"]}></span>
                                  <p className={styles["uploadedbyuser"]}>
                                    Uploaded By
                                  </p>
                                  <img
                                    className={styles["edit-icon"]}
                                    src={EditIcon}
                                    alt=""
                                    onClick={editMinuteFunction}
                                  />
                                  <div className={styles["gap-ti"]}>
                                    <img
                                      src={DefaultAvatar}
                                      className={styles["Image"]}
                                      alt=""
                                      draggable={false}
                                    />
                                    <p className={styles["agendaCreater"]}>
                                      Alex Rodriguez
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                              <Row
                                className={`${styles["positioning-tb"]} m-0`}
                              >
                                <Col lg={12} md={12} sm={12}>
                                  <p className={styles["time-uploader"]}>
                                    4:00pm,
                                  </p>
                                  <p className={styles["date-uploader"]}>
                                    18th May, 2024
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                    {openReviewerDetail === false ? (
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <div className={styles["reviewer-progress-wrapper"]}>
                            <Row>
                              <Col lg={11} md={11} sm={12}>
                                <div
                                  className={styles["reviewer-progress-text"]}
                                >
                                  <p className="m-0">Total: 03</p>
                                  <span>|</span>
                                  <p className="m-0">Accepted: 01</p>
                                  <span>|</span>
                                  <p className="m-0">Rejected: 01</p>
                                  <span>|</span>
                                  <p className="m-0">Pending: 01</p>
                                </div>
                              </Col>
                              <Col lg={1} md={1} sm={12} className="text-end">
                                <img
                                  alt=""
                                  src={DropdownPurple}
                                  className={
                                    openReviewerDetail
                                      ? `${styles["Arrow"]} cursor-pointer`
                                      : `${styles["Arrow_Expanded"]} cursor-pointer`
                                  }
                                  onClick={openCloseReviewerDetail}
                                />
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    ) : (
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <div className={styles["reviewer-progress-wrapper"]}>
                            <Row>
                              <Col lg={11} md={11} sm={12}>
                                <div
                                  className={styles["reviewer-progress-text"]}
                                >
                                  <p>Total: 03</p>
                                  <span>|</span>
                                  <p>Accepted: 01</p>
                                  <span>|</span>
                                  <p>Rejected: 01</p>
                                  <span>|</span>
                                  <p>Pending: 01</p>
                                </div>
                              </Col>
                              <Col lg={1} md={1} sm={12} className="text-end">
                                <img
                                  alt=""
                                  src={DropdownPurple}
                                  className={
                                    openReviewerDetail
                                      ? `${styles["Arrow"]} cursor-pointer`
                                      : `${styles["Arrow_Expanded"]} cursor-pointer`
                                  }
                                  onClick={openCloseReviewerDetail}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-accepted"]}>
                                    Review Accepted:
                                  </span>{" "}
                                  Alessandra Costa, Emily Davis, Matthew Jones,
                                  Christopher Martinez, Elizabeth Garcia, Olivia
                                  Nguyen, Ethan Patel, Madison Kim, Tyler Chen,
                                  Sophia Gupta, Mason Kumar, Ava Wong, Logan
                                  Singh, Jackson Li, Chloe Patel, Noah Patel,
                                  Lily Chang, Lucas Patel, Amelia Tran.
                                </p>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-declined"]}>
                                    Review Rejected:
                                  </span>{" "}
                                  Alex Rodriguez, Samantha Lee.
                                </p>
                                <p
                                  className={`${styles["text-wrapper-review"]}`}
                                >
                                  <span className={styles["Review-pending"]}>
                                    Review Pending:
                                  </span>{" "}
                                  Sarah Jenkins, Joshua Clark, Megan Rodriguez,
                                  Brandon Young.
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    )}
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="position-relative"
                      >
                        <div
                          className={
                            styles["version-control-wrapper"]
                          }
                        >
                          <span className={styles["with-text"]}>V1.0</span>
                        </div>
                        <div className={styles["uploaded-details"]}>
                          <Row className={styles["inherit-height"]}>
                            <Col lg={9} md={9} sm={12}>
                              <p className={styles["minutes-text"]}>
                                Task updates: Design phase completed, moving to
                                development, discussed resource reallocation
                              </p>
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={12}
                              className="position-relative"
                            >
                              <Row className="m-0">
                                <Col lg={12} md={12} sm={12} className="p-0">
                                  <span className={styles["bar-line"]}></span>
                                  <p className={styles["uploadedbyuser"]}>
                                    Uploaded By
                                  </p>
                                  <img
                                    className={styles["edit-icon"]}
                                    src={EditIcon}
                                    alt=""
                                    onClick={editMinuteFunction}
                                  />
                                  <div className={styles["gap-ti"]}>
                                    <img
                                      src={DefaultAvatar}
                                      className={styles["Image"]}
                                      alt=""
                                      draggable={false}
                                    />
                                    <p className={styles["agendaCreater"]}>
                                      Alex Rodriguez
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                              <Row
                                className={`${styles["positioning-tb"]} m-0`}
                              >
                                <Col lg={12} md={12} sm={12}>
                                  <p className={styles["time-uploader"]}>
                                    4:00pm,
                                  </p>
                                  <p className={styles["date-uploader"]}>
                                    18th May, 2024
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )
      }
    />
  );
};

export default RevisionHistory;
