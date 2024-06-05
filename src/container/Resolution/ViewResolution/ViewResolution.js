import React, { useEffect } from "react";
import styles from "./ViewResolution.module.css";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import {
  AttachmentViewer,
  Button,
  Checkbox,
} from "../../../components/elements";
import { useState } from "react";
import EmployeeinfoCard from "../../../components/elements/Employeeinfocard/EmployeeinfoCard";
import { useDispatch, useSelector } from "react-redux";
import { newTimeFormaterAsPerUTCFullDate } from "../../../commen/functions/date_formater";
import { viewResolutionModal } from "../../../store/actions/Resolution_actions";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { DataRoomDownloadFileApiFunc } from "../../../store/actions/DataRoom_actions";
import { getFileExtension } from "../../DataRoom/SearchFunctionality/option";
const ViewResolution = ({ setViewresolution }) => {
  const { t } = useTranslation();
  const currentLanguage = localStorage.getItem("i18nextLng");
  const { ResolutionReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [voterVeiwResolution, setVoterVeiwResolution] = useState(true);
  const [nonVoterVeiwResolution, setNonVoterViewResolution] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [resolutionData, setResolutionData] = useState(null);
  
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
  const handleClickDownloadFile = (fileID, fileName) => {
    let data = {
      FileID: Number(fileID),
    };
    dispatch(DataRoomDownloadFileApiFunc(navigate, data, t, fileName));
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

  const handleLinkClick = (data, extension) => {
    let fileExtension = ["pdf", "doc", "docx", "xls", "xlsx"].includes(
      extension
    );
    if (fileExtension) {
      window.open(
        `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(data)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };
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
                          {t("Circulation-date")}
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
                        resolutionData?.resolution?.votingDeadline
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
                          className={`" viewResolution_checkbox`}
                          // prefixCls={"checkbox_viewResolution"}
                          name="IsChat"
                          // disabled={true}
                          label2={t("Make-resolution-public")}
                          label2Class={styles["Public_resolution"]}
                          checked={
                            resolutionData?.resolution?.isResolutionPublic
                          }
                          disabled={true}
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
                                        EmployeePic={data.base64Img}
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
                  <Row>
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
                                        EmployeePic={data.base64Img}
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
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["ViewResolution_attachment"]}
                  >
                    <Row className="mt-3">
                      {resolutionData?.attachments.length > 0
                        ? resolutionData?.attachments.map((data, index) => {
                            const pdfData = {
                              taskId:
                                resolutionData?.resolution.pK_ResolutionID,
                              attachmentID: Number(data.originalAttachmentName),
                              fileName: data.displayAttachmentName,
                              commingFrom: 4,
                            };
                            let fileExtension = getFileExtension(
                              data.displayAttachmentName
                            );
                            const pdfDataJson = JSON.stringify(pdfData);
                            return (
                              <>
                                <Col
                                  sm={4}
                                  lg={4}
                                  md={4}
                                  // className="file-icon-viewResolution text-center"
                                >
                                  <AttachmentViewer
                                    handleClickDownload={() => {
                                      handleClickDownloadFile(
                                        pdfData.attachmentID,
                                        pdfData.fileName
                                      );
                                    }}
                                    data={data}
                                    name={data.displayAttachmentName}
                                    id={Number(data.originalAttachmentName)}
                                    handleEyeIcon={() =>
                                      handleLinkClick(
                                        pdfDataJson,
                                        fileExtension
                                      )
                                    }
                                  />
                                  {/* {ext === "doc" ? (
                                    <span
                                      onClick={() =>
                                        handleClickDownloadFile(
                                          pdfData.attachmentID,
                                          pdfData.fileName
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <FileIcon
                                        extension={"docx"}
                                        size={78}
                                        type={"document"}
                                        labelColor={"rgba(44, 88, 152)"}
                                      />
                                    </span>
                                  ) : ext === "docx" ? (
                                    <span
                                      onClick={() =>
                                        handleClickDownloadFile(
                                          pdfData.attachmentID,
                                          pdfData.fileName
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <FileIcon
                                        extension={"docx"}
                                        size={78}
                                        type={"font"}
                                        labelColor={"rgba(44, 88, 152)"}
                                      />
                                    </span>
                                  ) : ext === "xls" ? (
                                    <span
                                      onClick={() =>
                                        handleClickDownloadFile(
                                          pdfData.attachmentID,
                                          pdfData.fileName
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <FileIcon
                                        extension={"xls"}
                                        type={"spreadsheet"}
                                        size={78}
                                        labelColor={"rgba(16, 121, 63)"}
                                      />
                                    </span>
                                  ) : ext === "xlsx" ? (
                                    <span
                                      onClick={() =>
                                        handleClickDownloadFile(
                                          pdfData.attachmentID,
                                          pdfData.fileName
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <FileIcon
                                        extension={"xls"}
                                        type={"spreadsheet"}
                                        size={78}
                                        labelColor={"rgba(16, 121, 63)"}
                                      />
                                    </span>
                                  ) : ext === "pdf" ? (
                                    <Link
                                      to={`/DisKus/documentViewer?pdfData=${encodeURIComponent(
                                        pdfDataJson
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <FileIcon
                                        extension={"pdf"}
                                        size={78}
                                        {...defaultStyles.pdf}
                                      />
                                    </Link>
                                  ) : ext === "png" ? (
                                    <span
                                      onClick={() =>
                                        handleClickDownloadFile(
                                          pdfData.attachmentID,
                                          pdfData.fileName
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <FileIcon
                                        extension={"png"}
                                        size={78}
                                        type={"image"}
                                        labelColor={"rgba(102, 102, 224)"}
                                      />
                                    </span>
                                  ) : ext === "txt" ? (
                                    <span
                                      onClick={() =>
                                        handleClickDownloadFile(
                                          pdfData.attachmentID,
                                          pdfData.fileName
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <FileIcon
                                        extension={"txt"}
                                        size={78}
                                        type={"document"}
                                        labelColor={"rgba(52, 120, 199)"}
                                      />
                                    </span>
                                  ) : ext === "jpg" ? (
                                    <span
                                      onClick={() =>
                                        handleClickDownloadFile(
                                          pdfData.attachmentID,
                                          pdfData.fileName
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <FileIcon
                                        extension={"jpg"}
                                        size={78}
                                        type={"image"}
                                        labelColor={"rgba(102, 102, 224)"}
                                      />
                                    </span>
                                  ) : ext === "jpeg" ? (
                                    <span
                                      onClick={() =>
                                        handleClickDownloadFile(
                                          pdfData.attachmentID,
                                          pdfData.fileName
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <FileIcon
                                        extension={"jpeg"}
                                        size={78}
                                        type={"image"}
                                        labelColor={"rgba(102, 102, 224)"}
                                      />
                                    </span>
                                  ) : ext === "gif" ? (
                                    <span
                                      onClick={() =>
                                        handleClickDownloadFile(
                                          pdfData.attachmentID,
                                          pdfData.fileName
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <FileIcon
                                        extension={"gif"}
                                        size={78}
                                        {...defaultStyles.gif}
                                      />
                                    </span>
                                  ) : (
                                    <span
                                      onClick={() =>
                                        handleClickDownloadFile(
                                          pdfData.attachmentID,
                                          pdfData.fileName
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <FileIcon
                                        extension={ext}
                                        size={78}
                                        {...defaultStyles.ext}
                                      />
                                    </span>
                                  )}
                                  <span className="deleteBtn"></span>
                                  <p
                                    className="file-icon-modalmeeting-p text-center FontArabicRegular"
                                    title={data.displayAttachmentName}
                                  >
                                    {first}
                                  </p> */}
                                </Col>
                              </>
                            );
                          })
                        : null}
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
                    {/* ArrowRight */}
                    <Button
                      text={
                        currentLanguage === "ar" ? (
                          <ArrowRight size={30} color="#fff" />
                        ) : (
                          <ArrowLeft size={30} color="#fff" />
                        )
                      }
                      className={styles["CloseButton_ViewResolution"]}
                      onClick={() => dispatch(viewResolutionModal(false))}
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
