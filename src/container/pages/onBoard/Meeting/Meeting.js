import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Paperclip, CameraVideo } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import EditIcon from "../../../../assets/images/Edit-Icon.png";
import CommentIcon from "../../../../assets/images/Comment-Icon.png";
import IconAttachment from "../../../../assets/images/Icon-Attachment.png";
import VideoIcon from "../../../../assets/images/Video-Icon.png";
import { Button, Table } from "../../../../components/elements";
import { useTranslation } from "react-i18next";

export const Meeting = ({ style, pageSize, pagination }) => {
  //For Localization
  const { t } = useTranslation();

  const rowsData = [
    {
      title: t("Routine-Check-Title"),
      status: "Active",
      host: t("Host-Name-Title"),
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      // video: true,
      // edit: true,
    }
  ];
  const rows = [
    {
      title: t("Routine-Check-Title"),
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
      title: t("Title"),
      dataIndex: "title",
      key: "title",
      width: "110px",
      align: "left",
      // sorter: (a, b) => a.title.localeCompare(b.title.toLowerCase),
      // render: (text, record) => (
      //   <i
      //     className="meeting-title"
      //     onClick={(e) => viewModalHandler(record.pK_MDID)}
      //   >
      //     {text}
      //   </i>
      // ),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "8rem",
      // filters: [
      //   {
      //     text: t("Status-Upcoming"),
      //     value: "1",
      //   },
      //   {
      //     text: t("Status-Start"),
      //     value: "2",
      //   },
      //   {
      //     text: t("Status-End"),
      //     value: "3",
      //   },
      //   {
      //     text: t("Status-Cancelled"),
      //     value: "4",
      //   },
      // ],
      // filterIcon: (filtered) => (
      //   <ChevronDown className="filter-chevron-icon-meeting" />
      // ),
      // render: (text, record) => {
      //   if (text === "1") {
      //     return (
      //       <div className="activebtn  ">
      //         <span className="activebtnp">{t("Status-Upcoming")}</span>
      //       </div>
      //     );
      //   } else if (text === "2") {
      //     return (
      //       <div className="activebtn active-start text-center ">
      //         <span className="activebtn">{t("Status-Start")}</span>
      //       </div>
      //     );
      //   } else if (text === "3") {
      //     return (
      //       <div className="activebtn ">
      //         <span className="activebtnp">{t("Status-End")}</span>
      //       </div>
      //     );
      //   } else if (text === "4") {
      //     return (
      //       <div className="activebtn ">
      //         <span className="activebtn">{t("Status-Cancelled")}</span>
      //       </div>
      //     );
      //   }
      // },
    },
    {
      title: t("Organizer"),
      dataIndex: "host",
      key: "host",
      width: "10rem",
      // filters: tableFilterValue,
      // filterIcon: (filtered) => (
      //   <ChevronDown
      //     className={filtered ? "filter-chevron-icon-meeting" : null}
      //   />
      // ),
    },
    {
      title: t("Date-Or-Time"),
      dataIndex: "date_time",
      key: "date_time",
      width: "13rem",
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
      width: "7rem",
      render: (text, record) => {
        return (
          <>
            <span
              className={"margin-left-10"}
            >
              <img
                src={CommentIcon}
                // className="meeting-table-attachment-icon"
                alt=""
              />
            </span>
            <span
              className={"margin-right-10"
              }
            >
              <img src={VideoIcon} className="" alt="" />
            </span>
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
          <Button
            text={t("Start-meeting-button")}
            size="small"
            className={"start-meeting-btn"}
          >
            {t("Start-meeting-button")}
          </Button>
        );
      }
    },
    {
      title: "",
      dataIndex: "pK_MDID",
      key: "pK_MDID",
      width: "4rem",
      render: (text, record) => {

        return (
          <i
            className="meeting-editbutton"

          >
            <img src={EditIcon} alt="" />
          </i>
        );
      }
    },

  ];

  return (
    <Container className={style}>
      <Row>
        <Col className="heading h6 color-primary fw-600  mt-3">
          {t("Meetings")}
        </Col>
      </Row>
      <Row className="mx-1">
        <Col>
          <Table
            column={columns}
            className="hello"
            rows={rowsData}
            pagination={pagination}
          />
        </Col>
      </Row>

      {/* <Header heading="Meetings" button={true} user="Yaqoob" currentUserImage={userImage}  /> */}
    </Container>
  );
};
