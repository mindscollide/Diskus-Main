import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./ViewUpdateCommittee.module.css";
import { Paper } from "@material-ui/core";
import { Button } from "./../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCommitteesbyCommitteeId } from "../../../store/actions/Committee_actions";
import ViewCommitteeDetails from "../../../container/Committee/ViewCommittee/ViewCommittee";
import Polls from "../../../container/Committee/ViewPolls/Polls/Polls";
import CommitteeTodo from "../../../container/Committee/ViewTodo/CommitteeTodo.js";
import { XLg } from "react-bootstrap-icons";
const ViewUpdateCommittee = ({ setViewGroupPage, viewCommitteeTab }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const dispatch = useDispatch();
  let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
  const [currentView, setCurrentView] = useState(
    viewCommitteeTab !== undefined && viewCommitteeTab !== 0
      ? viewCommitteeTab
      : 1
  );
  useEffect(() => {
    if (ViewCommitteeID !== null) {
      let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
      let Data = {
        CommitteeID: Number(ViewCommitteeID),
        OrganizationId: OrganizationID,
      };
      dispatch(getCommitteesbyCommitteeId(navigate, Data, t));
    }
  }, [ViewCommitteeID]);
  const handleClose = () => {
    setViewGroupPage(false);
    localStorage.removeItem("ViewCommitteeID");
  };
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
            <Col
              sm={12}
              md={12}
              lg={12}
              className="d-flex justify-content-between"
            >
              <div className="d-flex gap-3 mb-3">
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
                  text={t("Task")}
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
              </div>
              <div>
                <XLg size={"24px"} cursor="pointer" onClick={handleClose} />
              </div>
            </Col>
          </Row>
          {currentView === 1 ? (
            <ViewCommitteeDetails setViewGroupPage={setViewGroupPage} />
          ) : currentView === 2 ? (
            <>
              <CommitteeTodo />
              {/* <Row className="my-3">
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    text={t("Close")}
                    className={styles["closeBtn-view-committee"]}
                    onClick={() => setViewGroupPage(false)}
                  />
                </Col>
              </Row> */}
            </>
          ) : // <TableToDo />
          currentView === 3 ? (
            <>
              <Polls />
              {/* <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    text={t("Close")}
                    className={styles["closeBtn-view-committee"]}
                    onClick={() => setViewGroupPage(false)}
                  />
                </Col>
              </Row> */}
            </>
          ) : currentView === 4 ? (
            <>
              {/* <Meeting /> */}
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    text={t("Close")}
                    className={styles["closeBtn-view-committee"]}
                    onClick={() => setViewGroupPage(false)}
                  />
                </Col>
              </Row>
            </>
          ) : null}
        </Paper>
      </section>
      {/* <Notification open={open.flag} message={open.message} setOpen={setOpen} /> */}
    </>
  );
};

export default ViewUpdateCommittee;
