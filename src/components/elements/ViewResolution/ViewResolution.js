import React, { useEffect } from "react";
import styles from "./ViewResolution.module.css";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import line from "../../../assets/images/line.png";
import backward from "../../../assets/images/backward.svg";
import forward from "../../../assets/images/forward.svg";
import FileIcon, { defaultStyles } from "react-file-icon";
import { Button, Checkbox } from "./../../../components/elements";
import { useState } from "react";
import EmployeeinfoCard from "../Employeeinfocard/EmployeeinfoCard";
import { useSelector } from "react-redux";
import { newTimeFormaterAsPerUTCFullDate } from "../../../commen/functions/date_formater";
const ViewResolution = ({ setViewresolution }) => {
  const { t } = useTranslation();
  const { ResolutionReducer } = useSelector((state) => state);
  console.log(
    "ResolutionReduceResolutionReduceResolutionReduce",
    ResolutionReducer
  );
  const [voterVeiwResolution, setVoterVeiwResolution] = useState(true);
  const [nonVoterVeiwResolution, setNonVoterViewResolution] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [resolutionData, setResolutionData] = useState(null);
  console.log(
    resolutionData,
    "resolutionDataresolutionDataresolutionDataresolutionData"
  );
  const voterButtonForViewResolution = () => {
    setVoterVeiwResolution(true);
    setNonVoterViewResolution(false);
  };

  const nonVotersForViewResolution = () => {
    setNonVoterViewResolution(true);
    setVoterVeiwResolution(false);
  };
  const handleScroll = (scrollOffset) => {
    const newPosition = scrollPosition + scrollOffset;
    setScrollPosition(newPosition);
  };
  const forwardhorizontal = () => {
    handleScroll(-50);
  };
  const SlideLeft = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft - 300;
  };

  const Slideright = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft + 300;
  };

  const backwardhorizontal = () => {
    handleScroll(50);
  };

  const forwardscroll = () => {
    window.scrollTo({ left: 100, behavior: "smooth" });
  };
  useEffect(() => {
    if (ResolutionReducer.getResolutionbyID !== null) {
      console.log(
        ResolutionReducer.getResolutionbyID,
        "ResolutionReducer.getResolutionbyIDResolutionReducer.getResolutionbyIDResolutionReducer.getResolutionbyID"
      );
      setResolutionData(ResolutionReducer.getResolutionbyID);
    }
  }, [ResolutionReducer.getResolutionbyID]);
  return (
    <section>
      <Row className="my-3">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["View_resolution_heading"]}>
            {t("View-resolution")}
          </span>
        </Col>
      </Row>

      <Paper className={styles["View_resolution_paper"]}>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className={styles["View_resolution_tag_box"]}
          >
            <span className={styles["View_Tag_messege"]}>
              {resolutionData?.resolution.status}
            </span>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Row>
              <Col lg={5} md={5} sm={12}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Details_ViewResolution"]}>
                      {t("Details")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <span
                      className={styles["Heading_Authorize_Viewresolution"]}
                    >
                      {resolutionData?.resolution?.title}
                    </span>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <p className={styles["Paragraph"]}>
                      {resolutionData?.resolution?.notesToVoter}
                    </p>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg={6} md={6} sm={6}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span
                          className={
                            styles["View_resolution_circulationHeading"]
                          }
                        >
                          {t("Circulation")}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Datetime_view_resolution"]}>
                          {newTimeFormaterAsPerUTCFullDate(
                            resolutionData?.resolution.circulationDateTime
                          )}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={6} md={6} sm={6}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Reminder_viewResolution"]}>
                          {t("Reminder-frequency")}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Frequency_Viewresolution"]}>
                          {resolutionData?.resolution?.reminderDescription}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Reminder_viewResolution"]}>
                      {t("Voting-deadline")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Datetime_view_resolution"]}>
                      {newTimeFormaterAsPerUTCFullDate(
                        resolutionData?.resolution?.deadlineDateTime
                      )}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Reminder_viewResolution"]}>
                      {t("Decision-announcement")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Datetime_view_resolution"]}>
                      {newTimeFormaterAsPerUTCFullDate(
                        resolutionData?.resolution?.decisionAnnouncementDateTime
                      )}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["CheckboxAlignmnet"]}
                  >
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="UpdateCheckbox view-resolution d-flex justify-content-start mt-5 FontArabicRegular"
                      >
                        <Checkbox
                          className={`"MontserratSemiBold viewResolution_checkbox`}
                          // prefixCls={"checkbox_viewResolution"}
                          name="IsChat"
                          // disabled={true}
                          label2={t("Make-resolution-public")}
                          label2Class={styles["Public_resolution"]}
                          checked={
                            resolutionData?.resolution?.isResolutionPublic
                          }

                          classNameDiv="checkboxParentClass"
                        ></Checkbox>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col
                lg={1}
                md={1}
                sm={false}
                className="d-flex justify-content-center"
              >
                <span className={styles["line_Viewesolution"]}></span>
              </Col>

              <Col lg={6} md={6} sm={6}>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-start gap-3"
                  >
                    <Button
                      text={t("Voters")}
                      className={
                        voterVeiwResolution
                          ? `${styles["Voters_Btn_viewresolution_Active"]}`
                          : `${styles["Voters_Btn_viewresolution"]}`
                      }
                      onClick={voterButtonForViewResolution}
                    />
                    <Button
                      text={t("Non-voters")}
                      className={
                        nonVoterVeiwResolution
                          ? `${styles["Non_Voters_Btn_viewresolution_Active"]}`
                          : `${styles["Non_Voters_Btn_viewresolution"]}`
                      }
                      onClick={nonVotersForViewResolution}
                    />
                  </Col>
                </Row>

                {voterVeiwResolution ? (
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["scroll-bar-view-resolution"]}
                    >
                      <Row className="mt-4">
                        {resolutionData?.voters.length > 0
                          ? resolutionData?.voters.map((data, index) => {
                            return (
                              <Col lg={6} md={6} sm={6}>
                                <Row>
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className="mt-1"
                                  >
                                    <EmployeeinfoCard
                                      Employeename={data.username}
                                      Employeeemail={data.email}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            );
                          })
                          : null}
                      </Row>
                    </Col>
                  </Row>
                ) : (
                  <Row >
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["scroll-bar-view-resolution"]}
                    >
                      <Row className="mt-4">
                        {resolutionData?.nonVoters.length > 0
                          ? resolutionData?.nonVoters.map((data, index) => {
                            return (
                              <Col lg={6} md={6} sm={6} className="mt-1">
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <EmployeeinfoCard
                                      Employeename={data.username}
                                      Employeeemail={data.email}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            );
                          })
                          : null}
                      </Row>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Attachments_view_resolution"]}>
                      {t("Attachments")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Row className="mt-3">
                      <Col lg={1} md={1} sm={1} className="mt-5">
                        {resolutionData?.attachments.length > 6 ? (
                          <>
                            <Button
                              icon={
                                <img
                                  src={backward}
                                  height="12.41px"
                                  width="16.13px"
                                />
                              }
                              onClick={SlideLeft}
                              className={
                                styles["Backward_button_viewresolution"]
                              }
                            />
                          </>
                        ) : null}
                      </Col>

                      <Col lg={10} md={10} sm={10}>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="Scroller-x-resolution"
                            id="Slider"
                          >
                            {resolutionData?.attachments.length > 0
                              ? resolutionData?.attachments.map(
                                (data, index) => {
                                  var ext = data.displayAttachmentName
                                    .split(".")
                                    .pop();
                                  const first =
                                    data.displayAttachmentName.split(" ")[0];
                                  return (
                                    <>
                                      <Col
                                        sm={12}
                                        lg={2}
                                        md={2}
                                        className="file-icon-viewResolution text-center"
                                      >
                                        {ext === "doc" ? (
                                          <FileIcon
                                            extension={"docx"}
                                            size={78}
                                            type={"document"}
                                            labelColor={"rgba(44, 88, 152)"}
                                          />
                                        ) : ext === "docx" ? (
                                          <FileIcon
                                            extension={"docx"}
                                            size={78}
                                            type={"font"}
                                            labelColor={"rgba(44, 88, 152)"}
                                          />
                                        ) : ext === "xls" ? (
                                          <FileIcon
                                            extension={"xls"}
                                            type={"spreadsheet"}
                                            size={78}
                                            labelColor={"rgba(16, 121, 63)"}
                                          />
                                        ) : ext === "xlsx" ? (
                                          <FileIcon
                                            extension={"xls"}
                                            type={"spreadsheet"}
                                            size={78}
                                            labelColor={"rgba(16, 121, 63)"}
                                          />
                                        ) : ext === "pdf" ? (
                                          <FileIcon
                                            extension={"pdf"}
                                            size={78}
                                            {...defaultStyles.pdf}
                                          />
                                        ) : ext === "png" ? (
                                          <FileIcon
                                            extension={"png"}
                                            size={78}
                                            type={"image"}
                                            labelColor={"rgba(102, 102, 224)"}
                                          />
                                        ) : ext === "txt" ? (
                                          <FileIcon
                                            extension={"txt"}
                                            size={78}
                                            type={"document"}
                                            labelColor={"rgba(52, 120, 199)"}
                                          />
                                        ) : ext === "jpg" ? (
                                          <FileIcon
                                            extension={"jpg"}
                                            size={78}
                                            type={"image"}
                                            labelColor={"rgba(102, 102, 224)"}
                                          />
                                        ) : ext === "jpeg" ? (
                                          <FileIcon
                                            extension={"jpeg"}
                                            size={78}
                                            type={"image"}
                                            labelColor={"rgba(102, 102, 224)"}
                                          />
                                        ) : ext === "gif" ? (
                                          <FileIcon
                                            extension={"gif"}
                                            size={78}
                                            {...defaultStyles.gif}
                                          />
                                        ) : null}
                                        <span className="deleteBtn"></span>
                                        <p className="file-icon-modalmeeting-p text-center FontArabicRegular">
                                          {first}
                                        </p>
                                      </Col>
                                    </>
                                  );
                                }
                              )
                              : null}
                          </Col>
                        </Row>
                      </Col>

                      <Col lg={1} md={1} sm={1} className="mt-5">
                        {resolutionData?.attachments.length > 6 ? (
                          <>
                            <Button
                              icon={
                                <img
                                  src={forward}
                                  height="12.41px"
                                  width="16.13px"
                                />
                              }
                              onClick={Slideright}
                              className={
                                styles["Backward_button_viewresolution"]
                              }
                            />
                          </>
                        ) : null}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={t("Close")}
                      className={styles["CloseButton_ViewResolution"]}
                      onClick={() => setViewresolution(false)}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Paper>
    </section>
  );
};

export default ViewResolution;
