import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./ViewUpdateCommittee.module.css";
import { Paper } from "@material-ui/core";
import { AttachmentViewer, Button } from "./../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCommitteesbyCommitteeId } from "../../../store/actions/Committee_actions";
import ViewCommitteeDetails from "../../../container/Committee/ViewCommittee/ViewCommittee";
import Polls from "../../../container/Committee/ViewPolls/Polls/Polls";
import CommitteeTodo from "../../../container/Committee/ViewTodo/CommitteeTodo.js";
import { XLg } from "react-bootstrap-icons";
import CommitteeMeetingTab from "../../../container/Committee/ViewMeeting/Meeting";
import { useSelector } from "react-redux";
const ViewUpdateCommittee = ({ setViewGroupPage, viewCommitteeTab }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [committeeStatus, setCommitteeStatus] = useState(null);
  const { CommitteeReducer } = useSelector((state) => state);
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
  useEffect(() => {
    try {
      if (
        CommitteeReducer.getCommitteeByCommitteeID !== null &&
        CommitteeReducer.getCommitteeByCommitteeID !== undefined
      ) {
        let committeeStatusID =
          CommitteeReducer.getCommitteeByCommitteeID.committeeStatus
            .committeeStatusID;
        setCommitteeStatus(committeeStatusID);
        console.log(
          committeeStatusID,
          "committeeStatusIDcommitteeStatusIDcommitteeStatusID"
        );
      } else {
        setCommitteeStatus(null);
      }
    } catch {}
  }, [CommitteeReducer.getCommitteeByCommitteeID]);
  return (
    <>
      <section className=" color-5a5a5a">
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
                  text={t("Committee-details")}
                  className={
                    currentView === 1
                      ? styles["View-committee-details_active"]
                      : styles["View-committee-details"]
                  }
                  onClick={() => setCurrentView(1)}
                />
                <Button
                  text={t("Tasks")}
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
            <ViewCommitteeDetails
              setViewGroupPage={setViewGroupPage}
              committeeStatus={committeeStatus}
            />
          ) : currentView === 2 ? (
            <>
              <CommitteeTodo committeeStatus={committeeStatus} />
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
              <Polls committeeStatus={committeeStatus} />
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
              <CommitteeMeetingTab committeeStatus={committeeStatus} />
              {/* <Meeting /> */}
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
          ) : null}
        </Paper>
      </section>
      {/* <Notification open={open.flag} message={open.message} setOpen={setOpen} /> */}
    </>
  );
};

export default ViewUpdateCommittee;
