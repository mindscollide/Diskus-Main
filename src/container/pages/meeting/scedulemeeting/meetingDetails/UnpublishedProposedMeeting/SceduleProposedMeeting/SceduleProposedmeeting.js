import React, { useState } from "react";
import styles from "./SceduleProposedMeeting.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Modal, Button, Table } from "../../../../../../../components/elements";
import { useSelector } from "react-redux";
import { showSceduleProposedMeeting } from "../../../../../../../store/actions/NewMeetingActions";
import BlueTick from "../../../../../../../assets/images/BlueTick.svg";
import moment from "moment";
const SceduleProposedmeeting = ({ organizerRows, proposedDates }) => {
  console.log(
    proposedDates,
    "proposedDatesproposedDatesproposedDatesproposedDatesproposedDates"
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);

  console.log(organizerRows, "organizerRowsorganizerRows");

  // Function to count the selected proposed dates for a row
  const countSelectedProposedDates = (organizerRows) => {
    console.log("Row Data:", organizerRows);
    // if (organizerRows.selectedProposedDates) {
    //   console.log("Selected Proposed Dates:", organizerRows.selectedProposedDates);
    //   const count = organizerRows.selectedProposedDates.filter(
    //     (date) => date.isSelected
    //   ).length;
    //   console.log("Count of Selected Proposed Dates:", count);

    //   // Add a zero prefix to the count if it's a single digit
    //   return count < 10 ? `0${count}` : count;
    // } else {
    //   console.log("No selectedProposedDates found.");
    // }
  };

  const dateFormat = "YYYYMMDD";
  const formattedDates = proposedDates.map((date) => {
    const formattedDate = moment(date, dateFormat, true).format("DD MMM, YY");
    return formattedDate;
  });

  const scheduleColumn = [
    {
      dataIndex: "userName",
      key: "userName",
      render: (text, record) => (
        <>
          <span className={styles["WidthOFSpan"]}>
            {record.userName === "Total" ? (
              <span className={styles["TotalCount_HEading"]}>
                {record.userName}
              </span>
            ) : (
              <span className={styles["ParticipantName"]}>
                {record.userName}
              </span>
            )}{" "}
            <span className={styles["Designation"]}>{record.designation}</span>
          </span>
        </>
      ),
    },

    ...formattedDates.map((formattedDate, index) => ({
      title: <span className={styles["DateObject"]}>{formattedDate}</span>,
      dataIndex: "selectedProposedDates",
      key: `selectedProposedDates-${index}`,
      render: (text, record, columnIndex) => {
        try {
          if (record.userName === "Total") {
            const totalDate = record.selectedProposedDates.find(
              (date) => date.isTotal === 0
            );
            if (totalDate) {
              return (
                <span className={styles["TotalCount"]}>
                  {countSelectedProposedDates(record)}
                </span>
              );
            }
          } else if (record.userName !== "Total") {
            // Check if record.selectedProposedDates is defined and has the specific element
            if (
              record.selectedProposedDates &&
              record.selectedProposedDates[index] &&
              record.selectedProposedDates[index].isSelected
            ) {
              return (
                <img
                  src={BlueTick}
                  className={styles["TickIconClass"]}
                  width="20.7px"
                  height="14.21px"
                  alt=""
                />
              );
            }
            return null;
          }
        } catch (error) {}
      },
    })),
  ];

  // this col is for footer
  const totalColumn = [
    {
      dataIndex: "total",
      key: "total",

      render: (text, record) => (
        <>
          <span className={styles["TotalCount_HEading"]}>Total</span>
          <Row>
            <Col lg={9} md={9} sm={9}></Col>
            <Col lg={3} md={3} sm={3} className="">
              <span className={styles["TotalCount"]}>
                {countSelectedProposedDates(record)}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return (
    <section>
      <Modal
        show={NewMeetingreducer.sceduleproposedMeeting}
        setShow={dispatch(showSceduleProposedMeeting)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showSceduleProposedMeeting(false));
        }}
        size={"lg"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Scedule_Proposed_meeting_heading"]}>
                  {t("Schedule-proposed-meetings")}
                </span>
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <section className={styles["OverAll_Padding"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Table
                    column={scheduleColumn}
                    scroll={{ x: "22vh" }}
                    pagination={false}
                    className="SceduleProposedMeeting"
                    rows={organizerRows}
                    // footer={(text, record) => {
                    //   console.log(
                    //     record,
                    //     text,
                    //     "recordrecordrecordrecordrecord"
                    //   );
                    //   return (
                    //     <>
                    //       <span className={styles["TotalCount_HEading"]}>
                    //         Total
                    //       </span>
                    //       <Row>
                    //         <Col lg={9} md={9} sm={9}></Col>
                    //         <Col lg={3} md={3} sm={3} className="">
                    //           <span className={styles["TotalCount"]}>
                    //             {countSelectedProposedDates(organizerRows[0])}
                    //           </span>
                    //         </Col>
                    //       </Row>
                    //     </>
                    //   );
                    // }}
                  />
                </Col>
              </Row>
            </section>
          </>
        }
        // ModalFooter={
        //   <section>
        //     <Row>
        //       <Col lg={12} md={12} sm={12}>
        //         <Table
        //           column={totalColumn}
        //           pagination={false}
        //           // className="SceduleProposedMeeting"
        //           rows={organizerRows}
        //         />
        //       </Col>
        //     </Row>
        //   </section>
        // }
      />
    </section>
  );
};

export default SceduleProposedmeeting;
