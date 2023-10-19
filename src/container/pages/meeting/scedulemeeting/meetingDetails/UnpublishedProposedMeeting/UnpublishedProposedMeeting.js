import React, { useState } from "react";
import styles from "./UnpublishedProposedMeeting.module.css";
import { Col, Row, ProgressBar } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ClipIcon from "../../../../../../assets/images/ClipIcon.png";
import CommentIcon from "../../../../../../assets/images/Comment-Icon.png";
import member from "../../../../../../assets/images/member.svg";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import NoMeetingsIcon from "../../../../../../assets/images/No-Meetings.png";
import deleteIcon from "../../../../../../assets/images/delete_dataroom.svg";

import { Tooltip } from "antd";
import successfullPolls from "../../../../../../assets/images/successfull-polls.svg";
import { ChevronDown, Plus } from "react-bootstrap-icons";
import { Progress } from "antd";
import {
  Button,
  ResultMessage,
  Table,
} from "../../../../../../components/elements";
import rspvGreenIcon from "../../../../../../assets/images/rspvGreen.svg";
import VideoIcon from "../../../../../../assets/images/Video-Icon.png";

import DeleteMeetingModal from "./DeleteMeetingModal/DeleteMeetingModal";
import { useSelector } from "react-redux";
import {
  showDeleteMeetingModal,
  showSceduleProposedMeeting,
} from "../../../../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SceduleProposedmeeting from "./SceduleProposedMeeting/SceduleProposedmeeting";
import { useEffect } from "react";
import { StatusValue } from "../../../statusJson";
import {
  _justShowDateformat,
  convertDateinGMT,
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../../../../commen/functions/date_formater";

const UnpublishedProposedMeeting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [rows, setRow] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  let currentLanguage = localStorage.getItem("i18nextLng");

  const handleDeleteMeetingModal = () => {
    dispatch(showDeleteMeetingModal(true));
  };

  const enableScedulePrposedMeetingModal = () => {
    dispatch(showSceduleProposedMeeting(true));
  };
  // Empty text data
  const emptyText = () => {
    return (
      <ResultMessage
        icon={<img src={NoMeetingsIcon} alt="" className="nodata-table-icon" />}
        title={t("No-new-meetings")}
        subTitle={t("Anything-important-thats-needs-discussion")}
      />
    );
  };

  const MeetingColoumns = [
    {
      title: <span>{t("Title")}</span>,
      dataIndex: "title",
      key: "title",
      width: "120px",
      align: "left",
      render: (text, record) => {
        return <span className={styles["meetingTitle"]}>{text}</span>;
      },
      sorter: (a, b) => {
        return a?.title.toLowerCase().localeCompare(b?.title.toLowerCase());
      },
    },
    {
      title: <span> {t("Organizer")}</span>,
      dataIndex: "host",
      key: "host",
      width: "70px",

      sorter: (a, b) => {
        return a?.host.toLowerCase().localeCompare(b?.host.toLowerCase());
      },
      render: (text, record) => {
        return <span>{text}</span>;
      },
    },
    {
      title: t("Date-time"),
      dataIndex: "Date",
      key: "Date",
      width: "95px",

      render: (text, record) => {
        if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
          return (
            <span>
              {newTimeFormaterAsPerUTCFullDate(
                record.dateOfMeeting + record.meetingStartTime
              )}
            </span>
          );
        }
      },
      sorter: (a, b, sortOrder) => {
        const dateA = utcConvertintoGMT(
          `${a?.dateOfMeeting}${a?.meetingStartTime}`
        );
        const dateB = utcConvertintoGMT(
          `${b?.dateOfMeeting}${b?.meetingStartTime}`
        );
        return dateA - dateB;
      },
    },
    {
      dataIndex: "Edit",
      key: "Edit",
      width: "90px",
      render: (text, record) => {
        return (
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex  align-items-center gap-4"
              >
                <img
                  src={deleteIcon}
                  className="cursor-pointer"
                  width="17.03px"
                  height="17.03px"
                  alt=""
                />
                <img
                  src={EditIcon}
                  className="cursor-pointer"
                  width="17.03px"
                  height="17.03px"
                  alt=""
                />

                {/* <img src={EditIcon} width="17.03px" height="17.03px" alt="" /> */}
                <Button
                  text="Publish Meeting"
                  className={styles["publish_meeting_btn"]}
                />
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    try {
      if (
        NewMeetingreducer.searchMeetings !== null &&
        NewMeetingreducer.searchMeetings !== undefined
      ) {
        setTotalRecords(NewMeetingreducer.searchMeetings.totalRecords);
        if (
          NewMeetingreducer.searchMeetings.meetings !== null &&
          NewMeetingreducer.searchMeetings.meetings !== undefined &&
          NewMeetingreducer.searchMeetings.meetings.length > 0
        ) {
          let newRowData = [];
          NewMeetingreducer.searchMeetings.meetings.map((data, index) => {
            newRowData.push({
              dateOfMeeting: data.dateOfMeeting,
              host: data.host,
              isAttachment: data.isAttachment,
              isChat: data.isChat,
              isVideoCall: data.isVideoCall,
              isQuickMeeting: data.isQuickMeeting,
              meetingAgenda: data.meetingAgenda,
              meetingAttendees: data.meetingAttendees,
              meetingEndTime: data.meetingEndTime,
              meetingStartTime: data.meetingStartTime,
              meetingURL: data.meetingURL,
              orignalProfilePictureName: data.orignalProfilePictureName,
              pK_MDID: data.pK_MDID,
              meetingPoll: {
                totalNoOfDirectors: data.meetingPoll.totalNoOfDirectors,
                totalNoOfDirectorsVoted:
                  data.meetingPoll.totalNoOfDirectorsVoted,
              },
              responseDeadLine: data.responseDeadLine,
              status: data.status,
              title: data.title,
              key: index,
            });
          });
          setRow(newRowData);
        }
      } else {
        setRow([]);
      }
    } catch {}
  }, [NewMeetingreducer.searchMeetings]);

  const scroll = {
    y: 800, // Set the desired height for the vertical scroll
  };
  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className="w-100">
          <Table
            column={MeetingColoumns}
            scroll={{ y: "64vh" }}
            pagination={false}
            className="newMeetingTable"
            rows={rows}
            locale={{
              emptyText: emptyText(), // Set your custom empty text here
            }}
            expandable={{
              expandedRowRender: (record) => {
                return record.meetingAgenda.map((data) => (
                  <p className="meeting-expanded-row">
                    {data.objMeetingAgenda.title}
                  </p>
                ));
              },
              rowExpandable: (record) =>
                record.meetingAgenda.length > 0 ? true : false,
            }}
          />
        </Col>
      </Row>
      {NewMeetingreducer.sceduleproposedMeeting && <SceduleProposedmeeting />}
      {NewMeetingreducer.deleteMeetingModal && <DeleteMeetingModal />}
    </section>
  );
};

export default UnpublishedProposedMeeting;
