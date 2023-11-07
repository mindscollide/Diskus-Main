import React, { useState } from "react";
import { Table } from "../../../components/elements";
import { StatusValue } from "../../pages/meeting/statusJson";
import {
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";
import { Col, Row, Tooltip } from "react-bootstrap";
import { ChevronDown } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import styles from "./Meeting.module.css";
const CommitteeMeetingTab = () => {
  const { t } = useTranslation();
  const [isOrganisers, setIsOrganisers] = useState(false);
  let currentUserId = localStorage.getItem("userID");
  let currentLanguage = localStorage.getItem("i18nextLng");

  const handleViewMeeting = () => {};
  const MeetingColoumns = [
    {
      title: <span>{t("Title")}</span>,
      dataIndex: "title",
      key: "title",
      width: "115px",
      //       render: (text, record) => {
      //         const isOrganiser = record.meetingAttendees.some(
      //           (attendee) =>
      //             Number(attendee.user.pK_UID) === Number(currentUserId) &&
      //             attendee.meetingAttendeeRole.role === "Organizer"
      //         );
      //         return (
      //           <span
      //             className={styles["meetingTitle"]}
      //             onClick={() => {
      //               handleViewMeeting(record.pK_MDID, record.isQuickMeeting);
      //               setIsOrganisers(isOrganiser);
      //             }}
      //           >
      //             {text}
      //           </span>
      //         );
      //       },
      //       sorter: (a, b) => {
      //         return a?.title.toLowerCase().localeCompare(b?.title.toLowerCase());
      //       },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "50px",
      //       filters: [
      //         {
      //           text: t("Active"),
      //           value: "10",
      //         },
      //         {
      //           text: t("Start"),
      //           value: "2",
      //         },
      //         {
      //           text: t("Upcoming"),
      //           value: "1",
      //         },
      //         {
      //           text: t("Ended"),
      //           value: "9",
      //         },
      //         {
      //           text: t("Not-conducted"),
      //           value: "8",
      //         },
      //         {
      //           text: t("Cancelled"),
      //           value: "4",
      //         },
      //       ],
      //       defaultFilteredValue: ["10", "9", "8", "2", "1", "4"],
      //       filterIcon: (filtered) => (
      //         <ChevronDown className="filter-chevron-icon-todolist" />
      //       ),
      //       onFilter: (value, record) =>
      //         record.status.toLowerCase().includes(value.toLowerCase()),
      //       render: (text, record) => {
      //         return StatusValue(t, record.status);
      //       },
    },
    {
      title: t("Organizer"),
      dataIndex: "host",
      key: "host",
      width: "60px",
      //       sorter: (a, b) => {
      //         return a?.host.toLowerCase().localeCompare(b?.host.toLowerCase());
      //       },
      //       render: (text, record) => {
      //         return <span>{text}</span>;
      //       },
    },
    {
      title: t("Date-time"),
      dataIndex: "dateOfMeeting",
      key: "dateOfMeeting",
      width: "115px",
      //       render: (text, record) => {
      //         if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
      //           return (
      //             <span>
      //               {newTimeFormaterAsPerUTCFullDate(
      //                 record.dateOfMeeting + record.meetingStartTime
      //               )}
      //             </span>
      //           );
      //         }
      //       },
      //       sorter: (a, b, sortOrder) => {
      //         const dateA = utcConvertintoGMT(
      //           `${a?.dateOfMeeting}${a?.meetingStartTime}`
      //         );
      //         const dateB = utcConvertintoGMT(
      //           `${b?.dateOfMeeting}${b?.meetingStartTime}`
      //         );
      //         return dateA - dateB;
      //       },
    },
    {
      dataIndex: "Chat",
      key: "Chat",
      width: "36px",
      //       render: (text, record) => {
      //         const isOrganiser = record.meetingAttendees.some(
      //           (attendee) =>
      //             Number(attendee.user.pK_UID) === Number(currentUserId) &&
      //             attendee.meetingAttendeeRole.role === "Organizer"
      //         );
      //         return (
      //           <>
      //             <Row>
      //               <Col sm={12} md={12} lg={12}>
      //                 {record.isAttachment ? (
      //                   <span
      //                     className={
      //                       currentLanguage === "ar"
      //                         ? "margin-left-10"
      //                         : "margin-right-10"
      //                     }
      //                   >
      //                     <Tooltip placement="topRight" title={t("ClipIcon")}>
      //                       <img
      //                         src={ClipIcon}
      //                         className="cursor-pointer"
      //                         // width="14.02px"
      //                         // height="16.03px"
      //                         alt=""
      //                         draggable="false"
      //                       />
      //                     </Tooltip>
      //                   </span>
      //                 ) : (
      //                   <span
      //                     className={
      //                       currentLanguage === "ar"
      //                         ? "margin-left-20"
      //                         : "margin-right-20"
      //                     }
      //                   ></span>
      //                 )}
      //                 {record.isChat ? (
      //                   <span
      //                     className={
      //                       currentLanguage === "ar"
      //                         ? "margin-left-10"
      //                         : "margin-right-10"
      //                     }
      //                     onClick={(e) => groupChatInitiation(record)}
      //                   >
      //                     <Tooltip placement="topLeft" title={t("Chat")}>
      //                       <img
      //                         src={CommentIcon}
      //                         className="cursor-pointer"
      //                         // width="20.06px"
      //                         // height="15.95px"
      //                         alt=""
      //                         draggable="false"
      //                       />
      //                     </Tooltip>
      //                   </span>
      //                 ) : (
      //                   <span
      //                     className={
      //                       currentLanguage === "ar"
      //                         ? "margin-left-20"
      //                         : "margin-right-20"
      //                     }
      //                   ></span>
      //                 )}
      //                 {record.isVideoCall ? (
      //                   <span
      //                     className={
      //                       currentLanguage === "ar"
      //                         ? "margin-left-10"
      //                         : "margin-right-10"
      //                     }
      //                   >
      //                     <img src={VideoIcon} alt="" draggable="false" />
      //                   </span>
      //                 ) : (
      //                   <span
      //                     className={
      //                       currentLanguage === "ar"
      //                         ? "margin-left-20"
      //                         : "margin-right-20"
      //                     }
      //                   ></span>
      //                 )}
      //                 {record.status === "9" && isOrganiser && (
      //                   <Tooltip placement="topLeft" title={t("member")}>
      //                     <img
      //                       src={member}
      //                       className="cursor-pointer"
      //                       width="17.1px"
      //                       height="16.72px"
      //                       alt=""
      //                       draggable="false"
      //                     />
      //                   </Tooltip>
      //                 )}
      //               </Col>
      //             </Row>
      //           </>
      //         );
      //       },
    },
    {
      dataIndex: "Join",
      key: "Join",
      width: "55px",
      //       render: (text, record) => {
      //         const isParticipant = record.meetingAttendees.some(
      //           (attendee) =>
      //             Number(attendee.user.pK_UID) === Number(currentUserId) &&
      //             (attendee.meetingAttendeeRole.role === "Participant" ||
      //               attendee.meetingAttendeeRole.role === "Agenda Contributor")
      //         );
      //         const isOrganiser = record.meetingAttendees.some(
      //           (attendee) =>
      //             Number(attendee.user.pK_UID) === Number(currentUserId) &&
      //             attendee.meetingAttendeeRole.role === "Organizer"
      //         );
      //         const startMeetingRequest = {
      //           MeetingID: Number(record.pK_MDID),
      //           StatusID: 10,
      //         };
      //         if (Number(record.status) === 1) {
      //           if (isParticipant) {
      //           } else {
      //             if (record.isQuickMeeting === true) {
      //               return (
      //                 <Row>
      //                   <Col sm={12} md={12} lg={12}>
      //                     <Button
      //                       text={t("Start-meeting")}
      //                       className={styles["Start-Meeting"]}
      //                       onClick={() => {
      //                         dispatch(
      //                           UpdateOrganizersMeeting(
      //                             navigate,
      //                             startMeetingRequest,
      //                             t,
      //                             4,
      //                             setViewFlag,
      //                             setAdvanceMeetingModalID,
      //                             setViewFlag,
      //                             setEditFlag,
      //                             setCalendarViewModal
      //                           )
      //                         );
      //                         setIsOrganisers(isOrganiser);
      //                       }}
      //                     />
      //                   </Col>
      //                 </Row>
      //               );
      //             } else {
      //               return (
      //                 <Row>
      //                   <Col sm={12} md={12} lg={12}>
      //                     <Button
      //                       text={t("Start-meeting")}
      //                       className={styles["Start-Meeting"]}
      //                       onClick={() => {
      //                         dispatch(
      //                           UpdateOrganizersMeeting(
      //                             navigate,
      //                             startMeetingRequest,
      //                             t,
      //                             3,
      //                             setViewAdvanceMeetingModal,
      //                             setAdvanceMeetingModalID
      //                           )
      //                         );
      //                         setIsOrganisers(isOrganiser);
      //                       }}
      //                     />
      //                   </Col>
      //                 </Row>
      //               );
      //             }
      //           }
      //         } else if (Number(record.status) === 10) {
      //           console.log("check status", record.status);

      //           if (isParticipant) {
      //             return (
      //               <Button
      //                 text={t("Join-meeting")}
      //                 className={styles["joining-Meeting"]}
      //                 onClick={() => {
      //                   handleViewMeeting(record.pK_MDID, record.isQuickMeeting);
      //                   setIsOrganisers(isOrganiser);
      //                 }}
      //               />
      //             );
      //           } else if (isOrganiser) {
      //             return (
      //               <Button
      //                 text={t("Start-join-meeting")}
      //                 className={styles["joining-Meeting"]}
      //                 onClick={() => {
      //                   handleViewMeeting(record.pK_MDID, record.isQuickMeeting);
      //                   setIsOrganisers(isOrganiser);
      //                 }}
      //               />
      //             );
      //           }
      //         } else if (Number(record.status) === 2) {
      //           console.log("check status", record.status);

      //           if (isOrganiser) {
      //             // return (
      //             //   <Button
      //             //     text={t("End-Meeting")}
      //             //     className={styles["End-Meeting"]}
      //             //     onClick={EndMeetingModal}
      //             //   />
      //             // );
      //           } else if (isParticipant) {
      //             // return (
      //             //   <Button
      //             //     text={t("Leave-meeting")}
      //             //     className={styles["End-Meeting"]}
      //             //     onClick={EndMeetingModal}
      //             //   />
      //             // );
      //           }
      //         } else {
      //         }
      //       },
    },
    {
      dataIndex: "Edit",
      key: "Edit",
      width: "33px",
      //       render: (text, record) => {
      //         const isParticipant = record.meetingAttendees.some(
      //           (attendee) =>
      //             Number(attendee.user.pK_UID) === Number(currentUserId) &&
      //             attendee.meetingAttendeeRole.role === "Participant"
      //         );

      //         const isOrganiser = record.meetingAttendees.some(
      //           (attendee) =>
      //             Number(attendee.user.pK_UID) === Number(currentUserId) &&
      //             attendee.meetingAttendeeRole.role === "Organizer"
      //         );

      //         const isAgendaContributor = record.meetingAttendees.some(
      //           (attendee) =>
      //             Number(attendee.user.pK_UID) === Number(currentUserId) &&
      //             attendee.meetingAttendeeRole.role === "Agenda Contributor"
      //         );

      //         const isQuickMeeting = record.isQuickMeeting;
      //         console.log("isQuickMeeting", isQuickMeeting);
      //         console.log("isQuickMeeting", record);

      //         if (isQuickMeeting) {
      //           if (isOrganiser) {
      //             return (
      //               <>
      //                 <Row>
      //                   <Col sm={12} md={12} lg={12}>
      //                     <Tooltip placement="topRight" title={t("Edit")}>
      //                       <img
      //                         src={EditIcon}
      //                         className="cursor-pointer"
      //                         width="17.11px"
      //                         height="17.11px"
      //                         alt=""
      //                         draggable="false"
      //                         onClick={() =>
      //                           handleEditMeeting(
      //                             record.pK_MDID,
      //                             record.isQuickMeeting,
      //                             isAgendaContributor,
      //                             record
      //                           )
      //                         }
      //                       />
      //                     </Tooltip>
      //                   </Col>
      //                 </Row>
      //               </>
      //             );
      //           } else {
      //           }
      //         } else {
      //           if (isParticipant) {
      //           } else if (isOrganiser) {
      //             return (
      //               <>
      //                 <Row>
      //                   <Col sm={12} md={12} lg={12}>
      //                     <Tooltip placement="topRight" title={t("Edit")}>
      //                       <img
      //                         src={EditIcon}
      //                         className="cursor-pointer"
      //                         width="17.11px"
      //                         height="17.11px"
      //                         alt=""
      //                         draggable="false"
      //                         onClick={() =>
      //                           handleEditMeeting(
      //                             record.pK_MDID,
      //                             record.isQuickMeeting,
      //                             isAgendaContributor,
      //                             record
      //                           )
      //                         }
      //                       />
      //                     </Tooltip>
      //                   </Col>
      //                 </Row>
      //               </>
      //             );
      //           } else if (isAgendaContributor) {
      //             return (
      //               <>
      //                 <Row>
      //                   <Col sm={12} md={12} lg={12}>
      //                     <Tooltip placement="topRight" title={t("Edit")}>
      //                       <img
      //                         src={EditIcon}
      //                         className="cursor-pointer"
      //                         width="17.11px"
      //                         height="17.11px"
      //                         alt=""
      //                         draggable="false"
      //                         onClick={() =>
      //                           handleEditMeeting(
      //                             record.pK_MDID,
      //                             record.isQuickMeeting,
      //                             isAgendaContributor,
      //                             record
      //                           )
      //                         }
      //                       />
      //                     </Tooltip>
      //                   </Col>
      //                 </Row>
      //               </>
      //             );
      //           }
      //         }
      //       },
    },
  ];
  return <Table column={MeetingColoumns} />;
};

export default CommitteeMeetingTab;
