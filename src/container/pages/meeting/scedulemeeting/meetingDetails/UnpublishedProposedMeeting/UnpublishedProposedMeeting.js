import React, { useState } from "react";
import styles from "./UnpublishedProposedMeeting.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ClipIcon from "../../../../../../assets/images/ClipIcon.png";
import CommentIcon from "../../../../../../assets/images/Comment-Icon.png";
import member from "../../../../../../assets/images/member.svg";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import { Tooltip } from "antd";
import { ChevronDown, Plus } from "react-bootstrap-icons";
import { Progress } from "antd";
import { Button, Table } from "../../../../../../components/elements";
import rspvGreenIcon from "../../../../../../assets/images/rspvGreen.svg";
import DeleteMeetingModal from "./DeleteMeetingModal/DeleteMeetingModal";
import { useSelector } from "react-redux";
import { showDeleteMeetingModal } from "../../../../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UnpublishedProposedMeeting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { NewMeetingreducer } = useSelector((state) => state);
  let currentLanguage = localStorage.getItem("i18nextLng");

  const handleDeleteMeetingModal = () => {
    dispatch(showDeleteMeetingModal(true));
  };

  const data = [
    {
      key: "1",
      pollTitle: (
        <label className={styles["Title_desc"]}>
          Board Member Executive Meeting from Boss's exe Board Member Executive
          Meeting from Boss's exe
        </label>
      ),
      status: <label className="column-boldness">Proposed</label>,
      Organizer: <label className="column-boldness">Mr. Abdul Qadir</label>,
      Date: <label className="column-boldness"> 3:30pm - 17th May, 2020</label>,
      MeetingPoll: (
        <>
          <Row>
            <Col
              lg={8}
              md={8}
              sm={12}
              className="d-flex justify-content-center"
            >
              <span className={styles["RatioClass"]}>3/8</span>
              {/* <img src={rspvGreenIcon} height="17.06px" width="17.06px" /> */}
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Progress
                className="ProgressUNpublishedMeeting"
                percent={30}
                size="small"
              />
            </Col>
          </Row>
        </>
      ),
      sendResponseby: <label> 17th May, 2020</label>,
    },
  ];
  const [tablerowsData, setTablerowsData] = useState(data);
  const MeetingColoumns = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Title")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "pollTitle",
      key: "pollTitle",
      width: "215px",
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "55px",
      filters: [
        {
          text: t("Proposed"),
          value: "Proposed",
          className: currentLanguage,
        },
        {
          text: t("Unpublished"),
          value: "Unpublished",
        },
      ],
      defaultFilteredValue: ["Published", "Unpublished"],
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
    },
    {
      title: t("Organizer"),
      dataIndex: "Organizer",
      key: "Organizer",
      width: "90px",
    },
    {
      title: t("Date-time"),
      dataIndex: "Date",
      key: "Date",
      width: "120px",
    },
    {
      title: t("Meeting-poll"),
      dataIndex: "MeetingPoll",
      key: "MeetingPoll",
      width: "100px",
    },
    {
      title: t("Send-reponse-by"),
      dataIndex: "sendResponseby",
      key: "sendResponseby",
      width: "100px",
    },
    {
      dataIndex: "Chat",
      key: "Chat",
      width: "55px",
      render: (text, record) => {
        return (
          <>
            <Row>
              <Col sm={12} md={12} lg={12} className="d-flex gap-3">
                <Tooltip placement="topRight" title={t("ClipIcon")}>
                  <img
                    src={ClipIcon}
                    className="cursor-pointer"
                    width="14.02px"
                    height="16.03px"
                  />
                </Tooltip>
                <Tooltip placement="topLeft" title={t("Chat")}>
                  <img
                    src={CommentIcon}
                    className="cursor-pointer"
                    width="20.06px"
                    height="15.95px"
                  />
                </Tooltip>
                <Tooltip placement="topLeft" title={t("member")}>
                  <img
                    src={member}
                    className="cursor-pointer"
                    width="17.1px"
                    height="16.72px"
                  />
                </Tooltip>
                <Tooltip placement="topRight" title={t("Edit")}>
                  <img
                    src={EditIcon}
                    className="cursor-pointer"
                    width="17.11px"
                    height="17.11px"
                    onClick={handleDeleteMeetingModal}
                  />
                </Tooltip>
              </Col>
            </Row>
          </>
        );
      },
    },

    {
      dataIndex: "Edit",
      key: "Edit",
      width: "13px",
      render: (text, record) => {
        return (
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex justify-content-end"
              ></Col>
            </Row>
          </>
        );
      },
    },
  ];
  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Table
            column={MeetingColoumns}
            scroll={{ y: "62vh" }}
            pagination={false}
            className="Polling_table"
            rows={tablerowsData}
          />
        </Col>
      </Row>
      {NewMeetingreducer.deleteMeetingModal && <DeleteMeetingModal />}
    </section>
  );
};

export default UnpublishedProposedMeeting;
