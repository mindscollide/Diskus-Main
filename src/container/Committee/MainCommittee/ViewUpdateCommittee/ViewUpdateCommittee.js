import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./ViewUpdateCommittee.module.css";
import { Button } from "./../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getCommitteesbyCommitteeId,
  viewCommitteePageFlag,
} from "../../../../store/actions/Committee_actions";
import ViewCommitteeDetails from "../ViewCommittee/ViewCommittee.js";
import Polls from "../../ViewPolls/Polls/Polls.js";
import CommitteeTodo from "../../ViewTodo/CommitteeTodo.js";
import { XLg } from "react-bootstrap-icons";
import CommitteeMeetingTab from "../../ViewMeeting/Meeting";
import { useSelector } from "react-redux";
import { usePollsContext } from "../../../../context/PollsContext.js";
const ViewUpdateCommittee = ({ setViewGroupPage, viewCommitteeTab }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setviewVotes } = usePollsContext();
  let NotificationClickCommitteeID = localStorage.getItem(
    "NotifcationClickViewCommitteeID"
  );
  const [committeeStatus, setCommitteeStatus] = useState(null);
  const getCommitteeByCommitteeID = useSelector(
    (state) => state.CommitteeReducer.getCommitteeByCommitteeID
  );
  const dispatch = useDispatch();
  let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
  const [currentView, setCurrentView] = useState(
    viewCommitteeTab !== undefined && viewCommitteeTab !== 0
      ? viewCommitteeTab
      : 1
  );

  useEffect(() => {
    return () => {
      setViewGroupPage(false);
      localStorage.removeItem("ViewCommitteeID");
      dispatch(viewCommitteePageFlag(false));
    };
  }, []);
  useEffect(() => {
    try {
      if (ViewCommitteeID !== null || NotificationClickCommitteeID !== null) {
        if (
          JSON.parse(
            localStorage.getItem("NotificationClickCommitteeOperations")
          ) === true
        ) {
          //For Notification Click Redirection User Logic
          let OrganizationID = JSON.parse(
            localStorage.getItem("organizationID")
          );
          let Data = {
            CommitteeID: Number(NotificationClickCommitteeID),
            OrganizationId: OrganizationID,
          };
          dispatch(getCommitteesbyCommitteeId(navigate, Data, t));
        } else {
          // Normal Card Title Click View Logic
          let OrganizationID = JSON.parse(
            localStorage.getItem("organizationID")
          );
          let Data = {
            CommitteeID: Number(ViewCommitteeID),
            OrganizationId: OrganizationID,
          };
          dispatch(getCommitteesbyCommitteeId(navigate, Data, t));
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
    return () => {
      localStorage.removeItem("NotificationClickCommitteeOperations");
      localStorage.removeItem("NotifcationClickViewCommitteeID");
    };
  }, [ViewCommitteeID]);

  const handleClose = () => {
    setViewGroupPage(false);
    setviewVotes(false);
    dispatch(viewCommitteePageFlag(false));
    localStorage.removeItem("ViewCommitteeID");
  };

  useEffect(() => {
    try {
      if (
        getCommitteeByCommitteeID !== null &&
        getCommitteeByCommitteeID !== undefined
      ) {
        let committeeStatusID =
          getCommitteeByCommitteeID.committeeStatus.committeeStatusID;
        setCommitteeStatus(committeeStatusID);
      } else {
        setCommitteeStatus(null);
      }
    } catch {}
  }, [getCommitteeByCommitteeID]);

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
        <span className={styles["View-Committee-paper"]}>
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
            </>
          ) : currentView === 3 ? (
            <>
              <Polls committeeStatus={committeeStatus} />
            </>
          ) : currentView === 4 ? (
            <>
              <CommitteeMeetingTab committeeStatus={committeeStatus} />
            </>
          ) : null}
        </span>
      </section>
    </>
  );
};

export default ViewUpdateCommittee;
