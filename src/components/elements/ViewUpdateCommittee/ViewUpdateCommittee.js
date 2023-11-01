import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ViewUpdateCommittee.module.css";
import Newprofile from "../../../assets/images/newprofile.png";
import { Paper } from "@material-ui/core";
import { Button, Notification } from "./../../../components/elements";
import { useTranslation } from "react-i18next";
import pdfIcon from "../../../assets/images/pdf_icon.svg";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import file_image from "../../../assets/images/file_image.svg";
import featherupload from "../../../assets/images/featherupload.svg";
import Committee from "../../../container/Committee/Committee";
import { useDispatch, useSelector } from "react-redux";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";
import { Upload } from "antd";
import {
  saveCommitteeDocumentsApi,
  uploadDocumentsCommitteesApi,
} from "../../../store/actions/Committee_actions";
import ViewCommitteeDetails from "../../../container/Committee/ViewCommittee/ViewCommittee";
import Polls from "../../../container/pages/meeting/scedulemeeting/Polls/Polls";

const ViewUpdateCommittee = ({ setViewGroupPage, currentTab }) => {
  console.log("currentTabcurrentTab", currentTab);
  const [currentView, setCurrentView] = useState(1);

  const { t } = useTranslation();
  return (
    <>
      <section className="MontserratSemiBold-600 color-5a5a5a">
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12}>
            <span className={styles["View-Committee-heading"]}>
              {t("View-committee")}
            </span>
          </Col>
        </Row>
        <Paper className={styles["View-Committee-paper"]}>
          <Row>
            <Col sm={12} md={12} lg={12} className="d-flex gap-3 mb-3">
              <Button
                text={t("Committee-detail")}
                className={
                  currentView === 1
                    ? styles["View-committee-details_active"]
                    : styles["View-committee-details"]
                }
                onClick={() => setCurrentView(1)}
              />
              <Button
                text={t("Task-later")}
                className={
                  currentView === 2
                    ? styles["View-committee-details_active"]
                    : styles["View-committee-details"]
                }
                onClick={() => setCurrentView(2)}
              />
              <Button
                text={t("Polls")}
                className={
                  currentView === 3
                    ? styles["View-committee-details_active"]
                    : styles["View-committee-details"]
                }
                onClick={() => setCurrentView(3)}
              />
              <Button
                text={t("Meetings")}
                className={
                  currentView === 4
                    ? styles["View-committee-details_active"]
                    : styles["View-committee-details"]
                }
                onClick={() => setCurrentView(4)}
              />
            </Col>
          </Row>
          {currentView === 1 ? (
            <ViewCommitteeDetails setViewGroupPage={setViewGroupPage} />
          ) : currentView === 2 ? (
            "Task Later"
          ) : currentView === 3 ? (
            <Polls view={2} />
          ) : currentView === 4 ? (
            "Meeting"
          ) : null}
        </Paper>
      </section>
      {/* <Notification open={open.flag} message={open.message} setOpen={setOpen} /> */}
    </>
  );
};

export default ViewUpdateCommittee;
