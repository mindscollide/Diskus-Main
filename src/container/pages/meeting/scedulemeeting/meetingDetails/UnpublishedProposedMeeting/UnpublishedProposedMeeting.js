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
import { Button, Table } from "../../../../../../components/elements";

const UnpublishedProposedMeeting = () => {
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");

  const data = [
    {
      key: "1",
      pollTitle: (
        <label className={styles["Title_desc"]}>
          Board Member Executive Meeting from Boss's exe Board Member Executive
          Meeting from Boss's exe
        </label>
      ),
      status: <label className="column-boldness">Active</label>,
      Organizer: <label className="column-boldness">Mr. Abdul Qadir</label>,
      Date: <label className="column-boldness"> 3:30pm - 17th May, 2020</label>,
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
          text: t("Active"),
          value: "Active",
          className: currentLanguage,
        },
        {
          text: t("Upcoming"),
          value: "Upcoming",
        },
        {
          text: t("Ended"),
          value: "Ended",
        },
        {
          text: t("Not-conducted"),
          value: "Not conducted",
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
      dataIndex: "MeetingPoll",
      key: "MeetingPoll",
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
    </section>
  );
};

export default UnpublishedProposedMeeting;
