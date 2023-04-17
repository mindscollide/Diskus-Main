import React from "react";
import styles from "./ViewResolution.module.css";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { Col, Container, Row } from "react-bootstrap";
import line from "../../../assets/images/line.png";
import backward from "../../../assets/images/backward.svg";
import forward from "../../../assets/images/forward.svg";
import files from "../../../assets/images/files.svg";
import HorizontalScroll from "react-scroll-horizontal";
import FileIcon, { defaultStyles } from "react-file-icon";
import newprofile from "../../../assets/images/newprofile.png";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
} from "./../../../components/elements";
import { useState } from "react";
import EmployeeinfoCard from "../Employeeinfocard/EmployeeinfoCard";
const ViewResolution = () => {
  const { t } = useTranslation();
  const [voterviewresolution, setVoterviewresolution] = useState(false);
  const [attachments, setAttachments] = useState([
    {
      PK_MAAID: 0,
      DisplayAttachmentName: "test",
      OriginalAttachmentName: "test",
      CreationDateTime: "111111",
      FK_MAID: 0,
    },
    {
      PK_MAAID: 0,
      DisplayAttachmentName: "test",
      OriginalAttachmentName: "test",
      CreationDateTime: "111111",
      FK_MAID: 0,
    },
    {
      PK_MAAID: 0,
      DisplayAttachmentName: "test",
      OriginalAttachmentName: "test",
      CreationDateTime: "111111",
      FK_MAID: 0,
    },
    {
      PK_MAAID: 0,
      DisplayAttachmentName: "test",
      OriginalAttachmentName: "test",
      CreationDateTime: "111111",
      FK_MAID: 0,
    },
    {
      PK_MAAID: 0,
      DisplayAttachmentName: "test",
      OriginalAttachmentName: "test",
      CreationDateTime: "111111",
      FK_MAID: 0,
    },
    {
      PK_MAAID: 0,
      DisplayAttachmentName: "test",
      OriginalAttachmentName: "test",
      CreationDateTime: "111111",
      FK_MAID: 0,
    },
    {
      PK_MAAID: 0,
      DisplayAttachmentName: "test",
      OriginalAttachmentName: "test",
      CreationDateTime: "111111",
      FK_MAID: 0,
    },
    {
      PK_MAAID: 0,
      DisplayAttachmentName: "test",
      OriginalAttachmentName: "test",
      CreationDateTime: "111111",
      FK_MAID: 0,
    },

    {
      PK_MAAID: 0,
      DisplayAttachmentName: "test",
      OriginalAttachmentName: "test",
      CreationDateTime: "111111",
      FK_MAID: 0,
    },
    {
      PK_MAAID: 0,
      DisplayAttachmentName: "test",
      OriginalAttachmentName: "test",
      CreationDateTime: "111111",
      FK_MAID: 0,
    },
    {
      PK_MAAID: 0,
      DisplayAttachmentName: "test",
      OriginalAttachmentName: "test",
      CreationDateTime: "111111",
      FK_MAID: 0,
    },
  ]);
  const [scrollPosition, setScrollPosition] = useState(0);

  const voterButtonForViewResolution = () => {
    setVoterviewresolution(true);
  };

  const nonVotersForViewResolution = () => {
    setVoterviewresolution(false);
  };
  const handleScroll = (scrollOffset) => {
    const newPosition = scrollPosition + scrollOffset;
    setScrollPosition(newPosition);
  };
  const forwardhorizontal = () => {
    handleScroll(-50);
  };

  const backwardhorizontal = () => {
    handleScroll(50);
  };

  const forwardscroll = () => {
    window.scrollTo({ left: 100, behavior: "smooth" });
  };

  return (
    <Container>
      <Row className="mt-2">
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
              {t("Circulated")}
            </span>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Row>
              <Col lg={5} md={5} sm={5}>
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
                      Authorization of Officials for handling
                      <span className={styles["Sub_heading_ViewResolution"]}>
                        foreign exchange
                      </span>
                    </span>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <p>
                      using Lorem Ipsum is that it has a more-or-less normal
                      distribution of letters, as opposed to using 'Content
                      here, content here', making it look like readable English.
                      Many desktop publishing packages and web page editors now
                      use Lorem Ipsum as their default model text, and a search
                      for 'lorem ipsum' will uncover many web sites still in
                      their infancy. Various versions have evolved over the
                      years, sometimes by accident, sometimes on purpose
                      (injected humour and the like).
                    </p>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={6} md={6} sm={6}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span
                          className={
                            styles["View_resolution_circulationHeading"]
                          }
                        >
                          Circulation
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Datetime_view_resolution"]}>
                          4:00pm,18th May,2020
                        </span>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={6} md={6} sm={6}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Reminder_viewResolution"]}>
                          Reminder Frequency
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Frequency_Viewresolution"]}>
                          90 Minutes Ago
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Reminder_viewResolution"]}>
                      Voting Deadline
                    </span>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Datetime_view_resolution"]}>
                      4:00pm,18th May,2020
                    </span>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Reminder_viewResolution"]}>
                      Decision Announcement
                    </span>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Datetime_view_resolution"]}>
                      4:00pm,18th May,2020
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="UpdateCheckbox  d-flex justify-content-start mt-5"
                  >
                    <Checkbox
                      className="SearchCheckbox MontserratSemiBold-600"
                      name="IsChat"
                      label={t("Public-resolution")}
                      classNameDiv="checkboxParentClass"
                    ></Checkbox>
                  </Col>
                </Row>
              </Col>
              <Col lg={1} md={1} sm={false}>
                <img src={line} height="586px" />
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
                      className={styles["Voters_Btn_viewresolution"]}
                      onClick={voterButtonForViewResolution}
                    />
                    <Button
                      text={t("Non-voters")}
                      className={styles["Non_Voters_Btn_viewresolution"]}
                      onClick={nonVotersForViewResolution}
                    />
                  </Col>
                </Row>
                {voterviewresolution ? (
                  <>
                    <Row className="mt-1">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["scroll-bar-view-resolution"]}
                      >
                        <Row className="mt-2">
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Attachments_view_resolution"]}>
                          {t("Attachments")}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["scroll_bar_PDF"]}
                      >
                        <Row className="mt-2">
                          <Col lg={1} md={1} sm={1}>
                            <Button
                              icon={
                                <img
                                  src={backward}
                                  height="12.41px"
                                  width="16.13px"
                                />
                              }
                              className={
                                styles["Backward_button_viewresolution"]
                              }
                              onClick={forwardscroll}
                            />
                          </Col>

                          <Col
                            lg={10}
                            md={10}
                            sm={10}
                            className={styles["scroll_bar_PDF"]}
                          >
                            <HorizontalScroll>
                              {attachments.map((data, index) => {
                                var ext =
                                  data.DisplayAttachmentName.split(".").pop();
                                const first =
                                  data.DisplayAttachmentName.split(" ")[0];
                                return (
                                  <>
                                    <Col
                                      sm={12}
                                      lg={3}
                                      md={3}
                                      className="file-icon-viewResolution"
                                    >
                                      <FileIcon
                                        extension={ext}
                                        {...defaultStyles.ext}
                                      />
                                      <span className="deleteBtn"></span>
                                      <p className="file-icon-modalmeeting-p">
                                        {first}
                                      </p>
                                    </Col>
                                  </>
                                );
                              })}
                            </HorizontalScroll>
                          </Col>

                          <Col lg={1} md={1} sm={1}>
                            <Button
                              icon={
                                <img
                                  src={forward}
                                  height="12.41px"
                                  width="16.13px"
                                />
                              }
                              className={
                                styles["Backward_button_viewresolution"]
                              }
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-end"
                          >
                            <Button
                              text={t("Close")}
                              className={styles["CloseButton_ViewResolution"]}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <Row className="mt-1">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["scroll-bar-view-resolution"]}
                      >
                        <Row className="mt-2">
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <EmployeeinfoCard
                                  Employeename="Saad Fudda"
                                  Employeeemail="Saadfudda@gmail.com"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Attachments_view_resolution"]}>
                          {t("Attachments")}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["scroll_bar_PDF"]}
                      >
                        <Row className="mt-2">
                          <Col lg={1} md={1} sm={1}>
                            <Button
                              icon={
                                <img
                                  src={backward}
                                  height="12.41px"
                                  width="16.13px"
                                />
                              }
                              className={
                                styles["Backward_button_viewresolution"]
                              }
                              onClick={forwardscroll}
                            />
                          </Col>

                          <Col
                            lg={10}
                            md={10}
                            sm={10}
                            className={styles["scroll_bar_PDF"]}
                          >
                            <HorizontalScroll>
                              {attachments.map((data, index) => {
                                var ext =
                                  data.DisplayAttachmentName.split(".").pop();
                                const first =
                                  data.DisplayAttachmentName.split(" ")[0];
                                return (
                                  <>
                                    <Col
                                      sm={12}
                                      lg={3}
                                      md={3}
                                      className="file-icon-viewResolution"
                                    >
                                      <FileIcon
                                        extension={ext}
                                        {...defaultStyles.ext}
                                      />
                                      <span className="deleteBtn"></span>
                                      <p className="file-icon-modalmeeting-p">
                                        {first}
                                      </p>
                                    </Col>
                                  </>
                                );
                              })}
                            </HorizontalScroll>
                          </Col>

                          <Col lg={1} md={1} sm={1}>
                            <Button
                              icon={
                                <img
                                  src={forward}
                                  height="12.41px"
                                  width="16.13px"
                                />
                              }
                              className={
                                styles["Backward_button_viewresolution"]
                              }
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-end"
                          >
                            <Button
                              text={t("Close")}
                              className={styles["CloseButton_ViewResolution"]}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Paper>
    </Container>
  );
};

export default ViewResolution;
