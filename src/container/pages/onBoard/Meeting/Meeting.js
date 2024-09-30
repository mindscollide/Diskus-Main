import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  Paperclip,
  CameraVideo,
  ChevronDown,
  SortAlphaDown,
  CaretDownFill,
  CaretUpFill,
} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import EditIcon from "../../../../assets/images/Edit-Icon.png";
import CommentIcon from "../../../../assets/images/Comment-Icon.png";
import IconAttachment from "../../../../assets/images/Icon-Attachment.png";
import VideoIcon from "../../../../assets/images/Video-Icon.png";
import { Button, Table } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import { FaSort } from "react-icons/fa";
import "../Meeting/Onboard-meeting.css";
import CustomButton from "../../../../components/elements/button/Button";

export const Meeting = ({ style, pageSize, pagination }) => {
  //For Localization
  const { t } = useTranslation();

  const rowsData = [
    {
      title: <strong>{t("Board-Member-Executive")}</strong>,
      status: "Active",
      host: t("Mr-watson"),
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      // video: true,
      // edit: true,
    },
  ];
  const rows = [
    {
      title: t("Routine-check"),
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Board Member Executive Meeting",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },

    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Board Member Executive Meeting",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Not-Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
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

      render: (text, record) => (
        <i
          className='meeting-title'
          // onClick={(e) => viewModalHandler(record.pK_MDID)}
        >
          {text}
        </i>
      ),
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
      // filters: tableFilterValue,
      // filterIcon: (filtered) => (
      //   <ChevronDown
      //     className={filtered ? "filter-chevron-icon-meeting" : null}
      //   />
      // ),
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
      // render: (text, record) => {
      //   if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
      //     return (
      //       moment(record.meetingStartTime, "HHmmss").format("h:mm A") +
      //       ", " +
      //       moment(record.dateOfMeeting, "YYYYMMDD").format("Do MMM, YYYY")
      //     );
      //   }
      // },
      // sorter: (a, b, sortOrder) => {
      //   if (a !== null && b !== null) {
      //     return moment(a.dateOfMeeting, "YYYYMMDD")
      //       .format("Do MMM, YYYY")
      //       .localeCompare(
      //         moment(b.dateOfMeeting, "YYYYMMDD").format("Do MMM, YYYY")
      //       );
      //   }
      //   if (a.dateOfMeeting) {
      //     return sortOrder === "ascend" ? 1 : -1;
      //   }
      //   if (b.dateOfMeeting) {
      //     return sortOrder === "ascend" ? -1 : 1;
      //   }
      //   return 0;
      // },
    },
    {
      title: "",
      dataIndex: "attach",
      key: "attach",
      width: "3rem",
      render: (text, record) => {
        return (
          <>
            {/* <span className={"margin-left-10"}>
              <img
                src={CommentIcon}
                // className="meeting-table-attachment-icon"
                alt=""
              />
            </span>
            <span className={"margin-right-10"}>
              <img src={VideoIcon} className="" alt="" />
            </span> */}
            <div>
              <i>
                <img src={VideoIcon} />
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
      render: (text, record) => {
        return (
          <>
            <div>
              <i>
                <img src={CommentIcon} />
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
      render: (text, record) => {
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
          <i className='meeting-editbutton'>
            <img src={EditIcon} alt='' />
          </i>
        );
      },
    },
  ];

  return (
    <>
      <Row className='mt-3'>
        <Col className='Meeting-heading-onboard'>{t("Meetings")}</Col>
      </Row>
      <Row>
        <Col>
          <Table
            column={columns}
            className='hello'
            rows={rowsData}
            pagination={pagination}
          />
        </Col>
      </Row>
    </>
  );
};
