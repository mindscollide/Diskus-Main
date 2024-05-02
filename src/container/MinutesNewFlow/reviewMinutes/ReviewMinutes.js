import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // Importing translation hook
import styles from "./ReviewMinutes.module.css"; // Importing CSS module
import { useDispatch } from "react-redux"; // Importing Redux hook
import { useNavigate } from "react-router-dom"; // Importing navigation hook
import { Paper, Button } from "../../../components/elements";
import {
  reviewMinutesPage,
  pendingApprovalPage,
  rejectCommentModal,
} from "../../../store/actions/Minutes_action";
import DefaultAvatar from "./../Images/avatar.png";
import RejectCommentModal from "./rejectCommentModal/RejectCommentModal";

// Functional component for pending approvals section
const ReviewMinutes = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook
  const navigate = useNavigate(); // Navigation hook

  const { MinutesReducer } = useSelector((state) => state);

  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");

  const [reviewWrapperScroll, setReviewWrapperScroll] = useState(false);

  const divRef = useRef(null);

  useEffect(() => {
    const div = divRef.current;

    if (div.scrollHeight > div.clientHeight) {
      console.log("Div has scroll");
      setReviewWrapperScroll(true);
    } else {
      console.log("Div doesn't have scroll");
      setReviewWrapperScroll(false);
    }
  }, []); // This effect runs once after the component mounts

  return (
    <section className={styles["pendingApprovalContainer"]}>
      {/* Container for pending approval section */}
      <Row className="my-3 d-flex align-items-center">
        <Col sm={12} md={12} lg={12}>
          <span className={styles["pendingApprovalHeading"]}>
            {t("IT Department Meeting")}
          </span>
        </Col>
      </Row>
      <Paper className={styles["pendingApprovalPaper"]}>
        {/* Paper component for styling */}
        <div className={styles["main-wrapper"]}>
          <Row className="py-3 mx-50">
            <Col sm={12} md={6} lg={6}>
              <span className={styles["pendingApprovalHeading"]}>
                {t("Review Minutes")}
              </span>
            </Col>
            <Col
              sm={12}
              md={6}
              lg={6}
              className="justify-content-end d-flex align-items-center"
            >
              <span className={styles["No-of-reviews"]}>
                Remaining minutes to review: 03
              </span>
              <Button text={t("Accept All")} className={styles["Accept-all"]} />
            </Col>
          </Row>
          <div
            className={
              reviewWrapperScroll
                ? styles["review-minutes-wrapper-scroll"]
                : styles["review-minutes-wrapper"]
            }
            ref={divRef}
          >
            {/* CONTENT */}

            <Row className="mx-50">
              <Col lg={12} md={12} sm={12}>
                <p className={styles["Parent-title-heading"]}>2.1 CEO Speech</p>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} className="position-relative">
                <div className={styles["version-control-wrapper-with-more"]}>
                  <span className={styles["with-text"]}>V1.0</span>
                </div>
                <div className={styles["uploaded-details-rejected"]}>
                  <Row className={styles["inherit-height"]}>
                    <Col lg={8} md={8} sm={12}>
                      <p className={styles["minutes-text"]}>
                        Task updates: Design phase completed, moving to
                        development, discussed resource reallocation to address
                        delays and decided unknown unknown printer took a galley
                        of type a printer took a galley of type a to hold daily
                        check-ins for quicker progress Design phase completed,
                        moving to development, discussed resource reallocation
                        to address delays and decided unknown unknown printer
                        took a galley of type a printer took a galley of type a
                        to hold daily check-ins for quicker progress Design
                        phase completed, moving to development, discussed
                        resource reallocation to address delays and decided
                        unknown unknown printer took a galley of type a printer
                        took a galley of type a to update.
                      </p>
                    </Col>
                    <Col lg={4} md={4} sm={12} className="position-relative">
                      <Row className="m-0">
                        <Col lg={6} md={6} sm={12} className="p-0">
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
                        <Col
                          lg={6}
                          md={6}
                          sm={12}
                          className={
                            currentLanguage === "ar"
                              ? "text-start p-0"
                              : "text-end p-0"
                          }
                        >
                          <Button
                            text={t("Accepted")}
                            className={styles["Reject-comment"]}
                          />
                          <Button
                            text={t("Rejected")}
                            className={styles["Rejected-comment"]}
                            onClick={() => dispatch(rejectCommentModal(true))}
                          />
                          <Button
                            text={t("Hide-comment")}
                            className={styles["Reject-comment"]}
                            onClick={() => dispatch(rejectCommentModal(true))}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <p className={styles["time-uploader"]}>4:00pm,</p>
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
              <Col lg={12} md={12} sm={12} className="position-relative">
                <div className={styles["version-control-wrapper"]}>
                  <span></span>
                </div>
                <div className={styles["uploaded-details"]}>
                  <Row className={styles["inherit-height"]}>
                    <Col lg={8} md={8} sm={12}>
                      <p className={styles["minutes-text"]}>
                        Task updates: Design phase completed, moving to
                        development, discussed resource reallocation
                      </p>
                    </Col>
                    <Col lg={4} md={4} sm={12} className="position-relative">
                      <Row className="m-0">
                        <Col lg={6} md={6} sm={12} className="p-0">
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
                        <Col
                          lg={6}
                          md={6}
                          sm={12}
                          className={
                            currentLanguage === "ar"
                              ? "text-start p-0"
                              : "text-end p-0"
                          }
                        >
                          <Button
                            text={t("Edit")}
                            className={styles["Reject-comment"]}
                          />
                          <Button
                            text={t("Delete")}
                            className={styles["Reject-comment"]}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <p className={styles["time-uploader"]}>4:00pm,</p>
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
              <Col lg={12} md={12} sm={12} className="position-relative">
                <div className={styles["version-control-wrapper-with-more"]}>
                  <span className={styles["with-text"]}>V1.0</span>
                </div>
                <div className={styles["uploaded-details-rejected"]}>
                  <Row className={styles["inherit-height"]}>
                    <Col lg={8} md={8} sm={12}>
                      <p className={styles["minutes-text"]}>
                        Task updates: Design phase completed, moving to
                        development, discussed resource reallocation to address
                        delays and decided unknown unknown printer took a galley
                        of type a printer took a galley of type a to hold daily
                        check-ins for quicker progress Design phase completed,
                        moving to development, discussed resource reallocation
                        to address delays and decided unknown unknown printer
                        took a galley of type a printer took a galley of type a
                        to hold daily check-ins for quicker progress Design
                        phase completed, moving to development, discussed
                        resource reallocation to address delays and decided
                        unknown unknown printer took a galley of type a printer
                        took a galley of type a to update.
                      </p>
                    </Col>
                    <Col lg={4} md={4} sm={12} className="position-relative">
                      <Row className="m-0">
                        <Col lg={6} md={6} sm={12} className="p-0">
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
                        <Col
                          lg={6}
                          md={6}
                          sm={12}
                          className={
                            currentLanguage === "ar"
                              ? "text-start p-0"
                              : "text-end p-0"
                          }
                        >
                          <Button
                            text={t("Accepted")}
                            className={styles["Reject-comment"]}
                          />
                          <Button
                            text={t("Rejected")}
                            className={styles["Rejected-comment"]}
                            onClick={() => dispatch(rejectCommentModal(true))}
                          />
                          <Button
                            text={t("Hide-comment")}
                            className={styles["Reject-comment"]}
                            onClick={() => dispatch(rejectCommentModal(true))}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <p className={styles["time-uploader"]}>4:00pm,</p>
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
              <Col lg={12} md={12} sm={12} className="position-relative">
                <div className={styles["version-control-wrapper-last"]}>
                  <span></span>
                </div>
                <div className={styles["uploaded-details"]}>
                  <Row className={styles["inherit-height"]}>
                    <Col lg={8} md={8} sm={12}>
                      <p className={styles["minutes-text"]}>
                        Task updates: Design phase completed, moving to
                        development, discussed resource reallocation
                      </p>
                    </Col>
                    <Col lg={4} md={4} sm={12} className="position-relative">
                      <Row className="m-0">
                        <Col lg={6} md={6} sm={12} className="p-0">
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
                        <Col
                          lg={6}
                          md={6}
                          sm={12}
                          className={
                            currentLanguage === "ar"
                              ? "text-start p-0"
                              : "text-end p-0"
                          }
                        >
                          <Button
                            text={t("Edit")}
                            className={styles["Reject-comment"]}
                          />
                          <Button
                            text={t("Delete")}
                            className={styles["Reject-comment"]}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <p className={styles["time-uploader"]}>4:00pm,</p>
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
              <Col lg={12} md={12} sm={12}>
                <div className={styles["gap-subcomments"]}>
                  {/* First */}
                  <Row className="mx-50">
                    <Col lg={12} md={12} sm={12}>
                      <p className={styles["Parent-title-heading"]}>
                        2.1 CEO Speech
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="position-relative">
                      <div
                        className={styles["version-control-wrapper-with-more"]}
                      >
                        <span className={styles["with-text"]}>V1.0</span>
                      </div>
                      <div className={styles["uploaded-details-rejected"]}>
                        <Row className={styles["inherit-height"]}>
                          <Col lg={8} md={8} sm={12}>
                            <p className={styles["minutes-text"]}>
                              Task updates: Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to hold daily check-ins for quicker
                              progress Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to hold daily check-ins for quicker
                              progress Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to update.
                            </p>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            className="position-relative"
                          >
                            <Row className="m-0">
                              <Col lg={6} md={6} sm={12} className="p-0">
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
                              <Col
                                lg={6}
                                md={6}
                                sm={12}
                                className={
                                  currentLanguage === "ar"
                                    ? "text-start p-0"
                                    : "text-end p-0"
                                }
                              >
                                <Button
                                  text={t("Accepted")}
                                  className={styles["Reject-comment"]}
                                />
                                <Button
                                  text={t("Rejected")}
                                  className={styles["Rejected-comment"]}
                                  onClick={() =>
                                    dispatch(rejectCommentModal(true))
                                  }
                                />
                                <Button
                                  text={t("Hide-comment")}
                                  className={styles["Reject-comment"]}
                                  onClick={() =>
                                    dispatch(rejectCommentModal(true))
                                  }
                                />
                              </Col>
                            </Row>
                            <Row>
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
                    <Col lg={12} md={12} sm={12} className="position-relative">
                      <div
                        className={styles["version-control-wrapper-with-more"]}
                      >
                        <span className={styles["with-text"]}>V1.0</span>
                      </div>
                      <div className={styles["uploaded-details-accepted"]}>
                        <Row className={styles["inherit-height"]}>
                          <Col lg={8} md={8} sm={12}>
                            <p className={styles["minutes-text"]}>
                              Task updates: Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to hold daily check-ins for quicker
                              progress Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to hold daily check-ins for quicker
                              progress Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to update.
                            </p>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            className="position-relative"
                          >
                            <Row className="m-0">
                              <Col lg={6} md={6} sm={12} className="p-0">
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
                              <Col
                                lg={6}
                                md={6}
                                sm={12}
                                className={
                                  currentLanguage === "ar"
                                    ? "text-start p-0"
                                    : "text-end p-0"
                                }
                              >
                                <Button
                                  text={t("Accepted")}
                                  className={styles["Accepted-comment"]}
                                />
                                <Button
                                  text={t("Reject")}
                                  className={styles["Reject-comment"]}
                                  onClick={() =>
                                    dispatch(rejectCommentModal(true))
                                  }
                                />
                              </Col>
                            </Row>
                            <Row>
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
                    <Col lg={12} md={12} sm={12} className="position-relative">
                      <div className={styles["version-control-wrapper"]}>
                        <span></span>
                      </div>
                      <div className={styles["uploaded-details"]}>
                        <Row className={styles["inherit-height"]}>
                          <Col lg={8} md={8} sm={12}>
                            <p className={styles["minutes-text"]}>
                              Task updates: Design phase completed, moving to
                              development, discussed resource reallocation
                            </p>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            className="position-relative"
                          >
                            <Row className="m-0">
                              <Col lg={6} md={6} sm={12} className="p-0">
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
                              <Col
                                lg={6}
                                md={6}
                                sm={12}
                                className={
                                  currentLanguage === "ar"
                                    ? "text-start p-0"
                                    : "text-end p-0"
                                }
                              >
                                <Button
                                  text={t("Edit")}
                                  className={styles["Reject-comment"]}
                                />
                                <Button
                                  text={t("Delete")}
                                  className={styles["Reject-comment"]}
                                />
                              </Col>
                            </Row>
                            <Row>
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
                    <Col lg={12} md={12} sm={12} className="position-relative">
                      <div
                        className={styles["version-control-wrapper-with-more"]}
                      >
                        <span className={styles["with-text"]}>V1.0</span>
                      </div>
                      <div className={styles["uploaded-details-rejected"]}>
                        <Row className={styles["inherit-height"]}>
                          <Col lg={8} md={8} sm={12}>
                            <p className={styles["minutes-text"]}>
                              Task updates: Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to hold daily check-ins for quicker
                              progress Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to hold daily check-ins for quicker
                              progress Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to update.
                            </p>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            className="position-relative"
                          >
                            <Row className="m-0">
                              <Col lg={6} md={6} sm={12} className="p-0">
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
                              <Col
                                lg={6}
                                md={6}
                                sm={12}
                                className={
                                  currentLanguage === "ar"
                                    ? "text-start p-0"
                                    : "text-end p-0"
                                }
                              >
                                <Button
                                  text={t("Accepted")}
                                  className={styles["Reject-comment"]}
                                />
                                <Button
                                  text={t("Rejected")}
                                  className={styles["Rejected-comment"]}
                                  onClick={() =>
                                    dispatch(rejectCommentModal(true))
                                  }
                                />
                                <Button
                                  text={t("Hide-comment")}
                                  className={styles["Reject-comment"]}
                                  onClick={() =>
                                    dispatch(rejectCommentModal(true))
                                  }
                                />
                              </Col>
                            </Row>
                            <Row>
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
                    <Col lg={12} md={12} sm={12} className="position-relative">
                      <div className={styles["version-control-wrapper-last"]}>
                        <span></span>
                      </div>
                      <div className={styles["uploaded-details"]}>
                        <Row className={styles["inherit-height"]}>
                          <Col lg={8} md={8} sm={12}>
                            <p className={styles["minutes-text"]}>
                              Task updates: Design phase completed, moving to
                              development, discussed resource reallocation
                            </p>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            className="position-relative"
                          >
                            <Row className="m-0">
                              <Col lg={6} md={6} sm={12} className="p-0">
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
                              <Col
                                lg={6}
                                md={6}
                                sm={12}
                                className={
                                  currentLanguage === "ar"
                                    ? "text-start p-0"
                                    : "text-end p-0"
                                }
                              >
                                <Button
                                  text={t("Edit")}
                                  className={styles["Reject-comment"]}
                                />
                                <Button
                                  text={t("Delete")}
                                  className={styles["Reject-comment"]}
                                />
                              </Col>
                            </Row>
                            <Row>
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
                  {/* First End */}
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <p className={styles["Parent-title-heading"]}>
                        2. CEO Speech
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <div className={styles["uploaded-details"]}>
                        <Row className={styles["inherit-height"]}>
                          <Col lg={8} md={8} sm={12}>
                            <p className={styles["minutes-text"]}>
                              Task updates: Design phase completed, moving to
                              development, discussed resource reallocation
                            </p>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            className="position-relative"
                          >
                            <Row className="m-0">
                              <Col lg={6} md={6} sm={12} className="p-0">
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
                              <Col
                                lg={6}
                                md={6}
                                sm={12}
                                className={
                                  currentLanguage === "ar"
                                    ? "text-start p-0"
                                    : "text-end p-0"
                                }
                              >
                                <Button
                                  text={t("Edit")}
                                  className={styles["Reject-comment"]}
                                />
                                <Button
                                  text={t("Delete")}
                                  className={styles["Reject-comment"]}
                                />
                              </Col>
                            </Row>
                            <Row>
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
                    <Col lg={12} md={12} sm={12}>
                      <p className={styles["Parent-title-heading"]}>
                        2.2 CEO Speech
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <div className={styles["uploaded-details"]}>
                        <Row className={styles["inherit-height"]}>
                          <Col lg={8} md={8} sm={12}>
                            <p className={styles["minutes-text"]}>
                              Task updates: Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to hold daily check-ins for quicker
                              progress Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to hold daily check-ins for quicker
                              progress Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to update.
                            </p>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            className="position-relative"
                          >
                            <Row className="m-0">
                              <Col lg={6} md={6} sm={12} className="p-0">
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
                              <Col
                                lg={6}
                                md={6}
                                sm={12}
                                className={
                                  currentLanguage === "ar"
                                    ? "text-start p-0"
                                    : "text-end p-0"
                                }
                              >
                                <Button
                                  text={t("Accept")}
                                  className={styles["Accept-comment"]}
                                />
                                <Button
                                  text={t("Reject")}
                                  className={styles["Reject-comment"]}
                                />
                              </Col>
                            </Row>
                            <Row>
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
              </Col>
            </Row>
          </div>
          <Row className="mx-50">
            <Col
              lg={12}
              md={12}
              sm={12}
              className={currentLanguage === "ar" ? "text-start" : "text-end"}
            >
              <Button
                onClick={() => {
                  dispatch(reviewMinutesPage(false));
                  dispatch(pendingApprovalPage(true));
                }}
                text={t("Cancel")}
                className={styles["Cancel"]}
              />
              <Button
                text={t("Submit-review")}
                className={styles["Submit-review"]}
              />
            </Col>
          </Row>
        </div>
      </Paper>
      {MinutesReducer.rejectCommentModal ? <RejectCommentModal /> : null}
    </section>
  );
};

export default ReviewMinutes; // Exporting pending approval component
