import React from "react";
import { Row, Col } from "react-bootstrap";
import { ChevronDown } from "react-bootstrap-icons";
import EditIcon from "../../../../assets/images/Edit-Icon.png";
import CommentIcon from "../../../../assets/images/Comment-Icon.png";
import VideoIcon from "../../../../assets/images/Video-Icon.png";
import { Table } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import { FaSort } from "react-icons/fa";
import "../Meeting/Onboard-meeting.css";
import CustomButton from "../../../../components/elements/button/Button";

export const Meeting = ({ pagination }) => {
  const { t } = useTranslation();

  const rowsData = [
    {
      title: <strong>{t("Board-Member-Executive")}</strong>,
      status: "Active",
      host: t("Mr-watson"),
      date_time: "9: 00 , 16 May 2020",
      attach: true,
    },
  ];

  const columns = [
    {
      title: (
        <h1>
          {t("Title")}
          <FaSort />
        </h1>
      ),
      dataIndex: "title",
      key: "title",
      width: "220px",
      align: "left",

      render: (text) => <i className="meeting-title">{text}</i>,
    },
    {
      title: (
        <p>
          {t("Status")} <ChevronDown size={15} />
        </p>
      ),
      dataIndex: "status",
      key: "status",
      width: "130px",
      align: "center",
    },
    {
      title: (
        <p>
          {t("Organizer")}
          <strong>
            <FaSort />
          </strong>
        </p>
      ),
      dataIndex: "host",
      key: "host",
      width: "130px",
    },
    {
      title: (
        <p>
          {t("Date-or-time")} <ChevronDown size={15} />
        </p>
      ),
      dataIndex: "date_time",
      key: "date_time",
      width: "200px",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "",
      dataIndex: "attach",
      key: "attach",
      width: "3rem",
      render: (text, record) => {
        return (
          <>
            <div>
              <i>
                <img src={VideoIcon} alt="" />
              </i>
            </div>
          </>
        );
      },
    },

    {
      title: "",
      dataIndex: "attach",
      key: "attach",
      width: "3rem",
      render: () => {
        return (
          <>
            <div>
              <i>
                <img src={CommentIcon} alt="" />
              </i>
            </div>
          </>
        );
      },
    },

    {
      title: "",
      dataIndex: "status",
      key: "status",
      width: "10rem",
      render: () => {
        return (
          <CustomButton
            buttonValue={t("Start-meeting")}
            className={"start-meeting-btn"}
          />
        );
      },
    },
    {
      title: "",
      dataIndex: "pK_MDID",
      key: "pK_MDID",
      width: "4rem",
      render: (text, record) => {
        return (
          <i className="meeting-editbutton">
            <img src={EditIcon} alt="" />
          </i>
        );
      },
    },
  ];

  return (
    <>
      <Row className="mt-3">
        <Col className="Meeting-heading-onboard">{t("Meetings")}</Col>
      </Row>
      <Row>
        <Col>
          <Table
            column={columns}
            className="hello"
            rows={rowsData}
            pagination={pagination}
          />
        </Col>
      </Row>
    </>
  );
};
