import React, { useEffect, useState, useRef } from "react";
import styles from "./SceduleProposedMeeting.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import {
  Modal,
  Button,
  Table,
  Loader,
} from "../../../../../../../components/elements";
import { useSelector } from "react-redux";
import { showSceduleProposedMeeting } from "../../../../../../../store/actions/NewMeetingActions";
import BlueTick from "../../../../../../../assets/images/BlueTick.svg";
import moment from "moment";
import { scheduleMeetingMainApi } from "../../../../../../../store/actions/NewMeetingActions";
const SceduleProposedmeeting = ({ organizerRows, proposedDates }) => {
  let viewProposeDatePollMeetingID = Number(
    localStorage.getItem("viewProposeDatePollMeetingID")
  );

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sceduleproposedMeeting = useSelector(
    (state) => state.NewMeetingreducer.sceduleproposedMeeting
  );

  const [isActive, setIsActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectProposedDate, setSelectPropsed] = useState(null);

  const toggleActive = (index, record, formattedDate) => {
    setIsActive(!isActive);
    setActiveIndex(index);
    let newdata2 = [];
    let dateformat = moment(formattedDate).format("YYYYMMDD");

    organizerRows.map((data, index) => {
      if (data.selectedProposedDates.length > 0) {
        data.selectedProposedDates.filter((newData, index) => {
          if (newData.proposedDate === dateformat) {
            return newdata2.push(newData);
          }
        });
      }
    });
    const uniqueData = new Set(newdata2.map(JSON.stringify));
    setSelectPropsed(Array.from(uniqueData).map(JSON.parse));
  };

  const yourNewObject = {
    userID: 0,
    userName: "Total",
    designation: "",
    userEmail: "",
    title: "",
    selectedProposedDates: Array(proposedDates.length).fill({
      proposedDateID: 0,
      proposedDate: "",
      startTime: "",
      endTime: "",
      isSelected: false,
      isTotal: 0,
    }),
  };

  const updatedOrganizerRows = [...organizerRows, yourNewObject];

  // Function to count the selected proposed dates for a row
  const countSelectedProposedDatesForColumn = (columnIndex) => {
    if (organizerRows && Array.isArray(organizerRows)) {
      const count = organizerRows.reduce((total, row) => {
        if (
          row &&
          row.selectedProposedDates.length > 0 &&
          row.selectedProposedDates[columnIndex].isSelected
        ) {
          return total + 1;
        }
        return total;
      }, 0);

      // Add a zero prefix to the count if it's a single digit
      return count < 10 ? `0${count}` : count;
    } else {
      return "00";
    }
  };
  const dateFormat = "YYYYMMDD";
  const formattedDates = proposedDates.map((date) => {
    const formattedDate = moment(date.proposedDate, dateFormat).format(
      "DD MMM, YY"
    );
    return formattedDate;
  });

  // Api hit for schedule Meeting
  const scheduleHitButton = () => {
    let scheduleMeeting = {
      MeetingID: Number(viewProposeDatePollMeetingID),
      ProposedDateID: selectProposedDate[0].proposedDateID,
    };
    dispatch(scheduleMeetingMainApi(navigate, t, scheduleMeeting));
  };

  const totalCounts = formattedDates.map((_, index) => {
    return updatedOrganizerRows.reduce((total, row) => {
      if (row.selectedProposedDates[index].isSelected) {
        return total + 1;
      }
      return total;
    }, 0);
  });

  // Find the index of the date column with the highest total count
  const maxTotalCountIndex = totalCounts.indexOf(Math.max(...totalCounts));

  const scheduleColumn = [
    {
      dataIndex: "userName",
      key: "userName",
      render: (text, record) => (
        <>
          <span className={styles["WidthOFSpan"]}>
            {record.userName === "Total" ? (
              <span
                className={styles["TotalCount_HEading"]}
                title={record.userName}
              >
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

    ...formattedDates.map((formattedDate, index) => {
      const record = organizerRows[index]; // Access the record using the index
      const isSelectedCount = record?.selectedProposedDates?.reduce(
        (count, date) => (date?.isSelected ? count + 1 : count),
        0
      );
      console.log(
        `Date: ${formattedDate}, isSelectedCount: ${isSelectedCount}, maxTotalCountIndex: ${maxTotalCountIndex}`
      );
      const dateDetailClass =
        index === maxTotalCountIndex
          ? `${styles["Date-Object-Detail_active"]}`
          : `${styles["Date-Object-Detail"]}`;

      console.log(record, "recordrecordrecord");
      return {
        title: (
          <span
            className={dateDetailClass}
            onClick={() => toggleActive(index, record, formattedDate)}
          >
            {formattedDate}
          </span>
        ),
        dataIndex: "selectedProposedDates",
        key: `selectedProposedDates-${index}`,
        render: (text, record, columnIndex) => {
          try {
            if (record.userName === "Total") {
              const totalDate = record?.selectedProposedDates?.find(
                (date) => date?.isTotal === 0
              );
              console.log(totalDate, "totaltotaltotaltotal");
              if (totalDate) {
                console.log(totalDate, "totaltotaltotaltotal");
                return (
                  <>
                    <span className={styles["TotalCount"]}>
                      {countSelectedProposedDatesForColumn(index)}
                    </span>
                  </>
                );
              }
            } else if (record.userName !== "Total") {
              if (
                record?.selectedProposedDates &&
                record?.selectedProposedDates[index] &&
                record?.selectedProposedDates[index]?.isSelected
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
      };
    }),
  ];

  return (
    <section>
      <Modal
        show={sceduleproposedMeeting}
        setShow={dispatch(showSceduleProposedMeeting)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showSceduleProposedMeeting(false));
          setActiveIndex(-1);
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
                    scroll={{ x: "22vh", y: "42vh" }}
                    pagination={false}
                    className="SceduleProposedMeeting"
                    rows={updatedOrganizerRows}
                  />
                  <span>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center mt-4"
                      >
                        <Button
                          text={t("Schedule")}
                          className={styles["Schedule-btn-count"]}
                          onClick={scheduleHitButton}
                        />
                      </Col>
                    </Row>
                  </span>
                </Col>
              </Row>
            </section>
          </>
        }
      />
    </section>
  );
};

export default SceduleProposedmeeting;
