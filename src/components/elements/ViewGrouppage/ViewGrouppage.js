import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ViewGrouppage.module.css";
import Newprofile from "../../../assets/images/newprofile.png";
import pdfIcon from "../../../assets/images/pdf_icon.svg";
import file_image from "../../../assets/images/file_image.svg";
import featherupload from "../../../assets/images/featherupload.svg";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import Polls from "../../../container/Groups/GroupPolls/GroupViewPolls";
import ViewGroupTodo from "../../../container/Groups/ViewGroupTodo/ViewGroupTodo";

import CreateGroupPolls from "../../../container/Groups/GroupPolls/CreatePolls/CreateGrouppolls";
import ViewUpdateGroup from "../viewUpdateGroup/ViewUpdateGroup";
import { getbyGroupID } from "../../../store/actions/Groups_actions";
import { Upload } from "antd";

import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
} from "./../../../components/elements";
import CrossIcon from "../../../assets/images/cancel_meeting_icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewGrouppage = ({ setViewGroupPage, currentTab, viewGroupTab }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let ViewGroupID = localStorage.getItem("ViewGroupID");

  console.log("currentTabcurrentTab", currentTab);
  const [currentViewGroup, setCurrentViewGroup] = useState(
    viewGroupTab !== undefined && viewGroupTab !== 0 ? viewGroupTab : 1
  );

  useEffect(() => {
    if (ViewGroupID !== 0) {
      dispatch(getbyGroupID(navigate, ViewGroupID, t));
    }
  }, [ViewGroupID]);

  return (
    <section className="MontserratSemiBold-600 color-5a5a5a">
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["View-Committee-heading"]}>
            {t("View-group")}
          </span>
        </Col>
      </Row>
      <Paper className={styles["View-group-paper"]}>
        <Row>
          <Col sm={12} md={12} lg={12} className="d-flex gap-3 mb-3">
            <Button
              text={t("Group-detail")}
              className={
                currentViewGroup === 1
                  ? styles["View-Group-details_active"]
                  : styles["View-Group-details"]
              }
              onClick={() => setCurrentViewGroup(1)}
            />
            <Button
              text={t("Task")}
              className={
                currentViewGroup === 2
                  ? styles["View-Group-details_active"]
                  : styles["View-Group-details"]
              }
              onClick={() => setCurrentViewGroup(2)}
            />
            <Button
              text={t("Polls")}
              className={
                currentViewGroup === 3
                  ? styles["View-Group-details_active"]
                  : styles["View-Group-details"]
              }
              onClick={() => setCurrentViewGroup(3)}
            />
            <Button
              text={t("Meetings")}
              className={
                currentViewGroup === 4
                  ? styles["View-Group-details_active"]
                  : styles["View-Group-details"]
              }
              onClick={() => setCurrentViewGroup(4)}
            />
          </Col>
        </Row>

        {currentViewGroup === 1 ? (
          <ViewUpdateGroup setViewGroupPage={setViewGroupPage} />
        ) : currentViewGroup === 2 ? (
          <>
            <ViewGroupTodo />
            <Row className="my-3 ">
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex justify-content-end"
              >
                <Button
                  text={t("Close")}
                  className={styles["closeBtn-view-Group"]}
                  onClick={() => setViewGroupPage(false)}
                />
              </Col>
            </Row>
          </>
        ) : currentViewGroup === 3 ? (
          <>
            <Polls view={2} />
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex justify-content-end"
              >
                <Button
                  text={t("Close")}
                  className={styles["closeBtn-view-Group"]}
                  onClick={() => setViewGroupPage(false)}
                />
              </Col>
            </Row>
          </>
        ) : currentViewGroup === 4 ? (
          "Meeting"
        ) : null}
      </Paper>
    </section>
  );
};

export default ViewGrouppage;
