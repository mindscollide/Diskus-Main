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
import CommitteeMeetingTab from "../../committeeMeetings";
import { useSelector } from "react-redux";
import { usePollsContext } from "../../../../context/PollsContext.js";
import { useCommitteeContext } from "../../../../context/CommitteeContext.js";
const ViewUpdateCommittee = ({
  setViewCommitteePage,
  viewCommitteeTab,
  setViewCommitteeViewTab,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setviewVotes } = usePollsContext();
  const { currentViewCommitteeTabs, setCurrentViewCommitteeTabs } =
    useCommitteeContext();
  let NotificationClickCommitteeID = localStorage.getItem(
    "NotifcationClickViewCommitteeID",
  );
  const [committeeStatus, setCommitteeStatus] = useState(null);
  const getCommitteeByCommitteeID = useSelector(
    (state) => state.CommitteeReducer.getCommitteeByCommitteeID,
  );
  const dispatch = useDispatch();
  let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

  useEffect(() => {
    try {
      if (ViewCommitteeID !== null || NotificationClickCommitteeID !== null) {
        if (
          JSON.parse(
            localStorage.getItem("NotificationClickCommitteeOperations"),
          ) === true
        ) {
          //For Notification Click Redirection User Logic
          let OrganizationID = JSON.parse(
            localStorage.getItem("organizationID"),
          );
          let Data = {
            CommitteeID: Number(NotificationClickCommitteeID),
            OrganizationId: OrganizationID,
          };
          dispatch(getCommitteesbyCommitteeId(navigate, Data, t));
        } else {
          // Normal Card Title Click View Logic
          let OrganizationID = JSON.parse(
            localStorage.getItem("organizationID"),
          );
          let Data = {
            CommitteeID: Number(ViewCommitteeID),
            OrganizationId: OrganizationID,
          };
          dispatch(getCommitteesbyCommitteeId(navigate, Data, t));
        }
      }
    } catch (error) {}
    return () => {
      localStorage.removeItem("NotificationClickCommitteeOperations");
      localStorage.removeItem("NotifcationClickViewCommitteeID");
    };
  }, [ViewCommitteeID]);

  const handleClose = () => {
    setViewCommitteePage(false);
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
    } catch (error) {
      console.log(error);
    }
  }, [getCommitteeByCommitteeID]);

  return (
    <>
      <section className=' color-5a5a5a'>
        <Row className='mt-3'>
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
              className='d-flex justify-content-between'>
              <div className='d-flex gap-3 mb-3'>
                <Button
                  text={t("Committee-details")}
                  className={
                    currentViewCommitteeTabs === 1
                      ? styles["View-committee-details_active"]
                      : styles["View-committee-details"]
                  }
                  onClick={() => setCurrentViewCommitteeTabs(1)}
                />
                <Button
                  text={t("Tasks")}
                  className={
                    currentViewCommitteeTabs === 2
                      ? styles["View-committee-details_active"]
                      : styles["View-committee-details"]
                  }
                  onClick={() => setCurrentViewCommitteeTabs(2)}
                />
                <Button
                  text={t("Polls")}
                  className={
                    currentViewCommitteeTabs === 3
                      ? styles["View-committee-details_active"]
                      : styles["View-committee-details"]
                  }
                  onClick={() => setCurrentViewCommitteeTabs(3)}
                />
                <Button
                  text={t("Meetings")}
                  className={
                    currentViewCommitteeTabs === 4
                      ? styles["View-committee-details_active"]
                      : styles["View-committee-details"]
                  }
                  onClick={() => setCurrentViewCommitteeTabs(4)}
                />
              </div>
              <div>
                <XLg size={"24px"} cursor='pointer' onClick={handleClose} />
              </div>
            </Col>
          </Row>

          {currentViewCommitteeTabs === 1 ? (
            <ViewCommitteeDetails
              setViewCommitteePage={setViewCommitteePage}
              committeeStatus={committeeStatus}
            />
          ) : currentViewCommitteeTabs === 2 ? (
            <>
              <CommitteeTodo committeeStatus={committeeStatus} />
            </>
          ) : currentViewCommitteeTabs === 3 ? (
            <>
              <Polls committeeStatus={committeeStatus} />
            </>
          ) : currentViewCommitteeTabs === 4 ? (
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
