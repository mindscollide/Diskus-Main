import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./ViewUpdateCommittee.module.css";
import { Button } from "./../../../components/elements";
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
/**
 * @component ViewUpdateCommittee
 * @description Renders a tabbed detail panel for viewing a committee's information.
 * On mount it reads the `ViewCommitteeID` from localStorage and dispatches
 * `getCommitteesbyCommitteeId` to fetch the committee's data. The panel exposes four
 * tabs — Committee Details, Tasks, Polls, and Meetings — each rendering a dedicated
 * container component. An XLg close icon removes `ViewCommitteeID` from localStorage
 * and hides the panel via `setViewGroupPage`. The active committee status is tracked
 * in local state and propagated to each tab component as `committeeStatus`.
 *
 * @param {Function} setViewGroupPage - Callback invoked with `false` to close/hide this panel.
 * @param {number} [viewCommitteeTab] - Initial tab index to activate on render (1–4).
 *   Defaults to `1` (Committee Details) when omitted or `0`.
 *
 * @example
 * <ViewUpdateCommittee
 *   setViewGroupPage={setShowPanel}
 *   viewCommitteeTab={2}
 * />
 */
const ViewUpdateCommittee = ({ setViewGroupPage, viewCommitteeTab }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    try {
      if (ViewCommitteeID !== null) {
        let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
        let Data = {
          CommitteeID: Number(ViewCommitteeID),
          OrganizationId: OrganizationID,
        };
        dispatch(getCommitteesbyCommitteeId(navigate, Data, t));
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [ViewCommitteeID]);

  const handleClose = () => {
    setViewGroupPage(false);
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
