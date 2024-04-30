import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./ViewGrouppage.module.css";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import Polls from "../../../container/Groups/GroupPolls/GroupViewPolls";
import ViewGroupTodo from "../../../container/Groups/ViewGroupTodo/ViewGroupTodo";
import ViewUpdateGroup from "../viewUpdateGroup/ViewUpdateGroup";
import { getbyGroupID } from "../../../store/actions/Groups_actions";
import { Button } from "./../../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { XLg } from "react-bootstrap-icons";
import GroupMeeting from "../../../container/Groups/GroupViewMeeting/Meeting";

const ViewGrouppage = ({ setViewGroupPage, currentTab, viewGroupTab }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { GroupsReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [groupStatus, setGroupStatus] = useState(null);
  let ViewGroupID = localStorage.getItem("ViewGroupID");

  const [currentViewGroup, setCurrentViewGroup] = useState(
    viewGroupTab !== undefined && viewGroupTab !== 0 ? viewGroupTab : 1
  );

  useEffect(() => {
    if (ViewGroupID !== null) {
      dispatch(getbyGroupID(navigate, ViewGroupID, t));
    }
  }, []);

  const handleClose = () => {
    localStorage.removeItem("ViewGroupID");
    setViewGroupPage(false);
  };

  useEffect(() => {
    try {
      if (GroupsReducer.getGroupByGroupIdResponse !== null) {
        let groupStatus =
          GroupsReducer.getGroupByGroupIdResponse.groupStatus.groupStatusID;
        setGroupStatus(groupStatus);
      } else {
        setGroupStatus(null);
      }
    } catch {}
  }, [GroupsReducer.getGroupByGroupIdResponse]);
  return (
    <>
      <section className=" color-5a5a5a">
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12}>
            <span className={styles["View-Committee-heading"]}>
              {t("View-group")}
            </span>
          </Col>
        </Row>
        <Paper className={styles["View-group-paper"]}>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className="d-flex justify-content-between"
            >
              <div className="d-flex gap-3 mb-3">
                <Button
                  text={t("Group-details")}
                  className={
                    currentViewGroup === 1
                      ? styles["View-Group-details_active"]
                      : styles["View-Group-details"]
                  }
                  onClick={() => setCurrentViewGroup(1)}
                />
                <Button
                  text={t("Tasks")}
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
              </div>
              <div>
                <XLg size={"24px"} cursor="pointer" onClick={handleClose} />
              </div>
            </Col>
          </Row>

          {currentViewGroup === 1 ? (
            <ViewUpdateGroup
              setViewGroupPage={setViewGroupPage}
              groupStatus={groupStatus}
            />
          ) : currentViewGroup === 2 ? (
            <>
              <ViewGroupTodo groupStatus={groupStatus} />
            </>
          ) : currentViewGroup === 3 ? (
            <>
              <Polls view={2} groupStatus={groupStatus} />
            </>
          ) : currentViewGroup === 4 ? (
            <GroupMeeting groupStatus={groupStatus} />
          ) : null}
        </Paper>
      </section>
    </>
  );
};

export default ViewGrouppage;
