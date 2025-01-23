import React, { useEffect, useState } from "react";
import styles from "./SceduleProposedMeeting.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Modal, Button, Table } from "../../../../../../../components/elements";
import { useSelector } from "react-redux";
import {
  showSceduleProposedMeeting,
  getUserWiseProposedDatesMainApi,
  getUserProposedWiseApi,
} from "../../../../../../../store/actions/NewMeetingActions";
import BlueTick from "../../../../../../../assets/images/BlueTick.svg";
import moment from "moment";
import { scheduleMeetingMainApi } from "../../../../../../../store/actions/NewMeetingActions";
import {
  newTimeFormaterViewPoll,
  resolutionResultTable,
  utcConvertintoGMT,
} from "../../../../../../../commen/functions/date_formater";
import { convertToArabicNumerals } from "../../../../../../../commen/functions/regex";
import BlackCrossIcon from "../../../../../../../assets/images/BlackCrossIconModals.svg";
const SceduleProposedmeeting = ({
  setDataroomMapFolderId,
  setCurrentMeetingID,
  setSceduleMeeting,
}) => {
  let viewProposeDatePollMeetingID = Number(
    localStorage.getItem("viewProposeDatePollMeetingID")
  );

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sceduleproposedMeeting = useSelector(
    (state) => state.NewMeetingreducer.sceduleproposedMeeting
  );

  // const getUserProposedOrganizerData = useSelector(
  //   (state) => state.NewMeetingreducer.getUserProposedOrganizerData
  // );

  // console.log(getUserProposedOrganizerData, "getUserProposedOrganizerData");

  const userWiseMeetingProposed = useSelector(
    (state) => state.NewMeetingreducer.userWiseMeetingProposed
  );

  console.log("Check213123", userWiseMeetingProposed);

  const [formattedDates, setFormattedDates] = useState([]);
  const [updateTableRows, setUpdateTableRows] = useState([]);
  const [proposedDatesData, setProposedDatesData] = useState([]);

  const [organizerRows, setOrganizerRows] = useState([]);
  const [initialOrganizerRows, setInitialOrganizerRows] = useState([]);
  const [proposedDates, setProposedDates] = useState([]);

  const handleCrossIconClass = () => {
    dispatch(showSceduleProposedMeeting(false));
  };

  // dispatch Api in useEffect
  //Notificaiton When organizer Click the notification that the response dates has been submitted by the participant
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("ProposedMeetingOrganizer")) === true) {
      let NotificationClickProposeMeetingID = localStorage.getItem(
        "ProposedMeetingOrganizerMeetingID"
      );
      // let Data = {
      //   MeetingID: Number(NotificationClickProposeMeetingID),
      // };
      // dispatch(getUserWiseProposedDatesMainApi(navigate, t, Data));
      let Data = {
        MeetingID: Number(NotificationClickProposeMeetingID),
      };
      dispatch(getUserProposedWiseApi(navigate, t, Data, false));
    } else {
      // let Data = {
      //   MeetingID: Number(viewProposeDatePollMeetingID),
      // };
      // dispatch(getUserWiseProposedDatesMainApi(navigate, t, Data));
      let Data = {
        MeetingID: Number(viewProposeDatePollMeetingID),
      };
      dispatch(getUserProposedWiseApi(navigate, t, Data, false));
    }

    return () => {
      localStorage.removeItem("ProposedMeetingOrganizer");
      localStorage.removeItem("ProposedMeetingOrganizerMeetingID");
      localStorage.removeItem("MeetingStatusID");
    };
  }, []);

  // for rendering data in table
  useEffect(() => {
    if (
      userWiseMeetingProposed !== null &&
      userWiseMeetingProposed !== undefined &&
      userWiseMeetingProposed.length > 0
    ) {
      let ProposeDates;

      userWiseMeetingProposed.forEach((datesData, index) => {
        const uniqueData = new Set(
          datesData.selectedProposedDates.map(JSON.stringify)
        );
        console.log(uniqueData, "uniqueDatauniqueData");
        ProposeDates = Array.from(uniqueData).map(JSON.parse);
      });
      setProposedDates(ProposeDates);
      console.log(ProposeDates, "uniqueDatauniqueData");

      setInitialOrganizerRows(userWiseMeetingProposed);
    } else {
      setInitialOrganizerRows([]);
    }
  }, [userWiseMeetingProposed]);

  useEffect(() => {
    const newOrganizerRows = [...initialOrganizerRows];
    // Find the maximum number of selectedProposedDates objects in initialOrganizerRows
    let maxSelectedProposedDates = 0;
    initialOrganizerRows.forEach((organizer) => {
      const numSelectedProposedDates = organizer.selectedProposedDates.length;
      if (numSelectedProposedDates > maxSelectedProposedDates) {
        maxSelectedProposedDates = numSelectedProposedDates;
      }
    });

    setOrganizerRows(newOrganizerRows);
  }, [initialOrganizerRows]);

  // useEffect(() => {
  //   if (Array.isArray(organizerRows) && Array.isArray(proposedDates)) {
  //     const yourNewObject = {
  //       userID: 0,
  //       userName: "Total",
  //       designation: "",
  //       userEmail: "",
  //       title: "",
  //       selectedProposedDates: Array(proposedDates?.length).fill({
  //         proposedDateID: 0,
  //         proposedDate: "",
  //         startTime: "",
  //         endTime: "",
  //         isSelected: false,
  //         isTotal: 0,
  //       }),
  //     };
  //     const updatedOrganizerRows = [...organizerRows, yourNewObject];
  //     setUpdateTableRows(updatedOrganizerRows);
  //     let newDataProposedState = [...proposedDates];
  //     setProposedDatesData(newDataProposedState);
  //     const formattedDates = newDataProposedState
  //       .filter((dates, index) => dates.proposedDate !== "10000101")
  //       .map((date) => {
  //         try {
  //           let datetimeVal = `${date?.proposedDate}${date?.startTime}`;
  //           const formatetDateTime = utcConvertintoGMT(datetimeVal);

  //           return formatetDateTime;
  //         } catch (error) {
  //           console.log(error);
  //         }
  //       });

  //     if (formattedDates) {
  //       setFormattedDates(formattedDates);
  //     }
  //   }
  // }, [organizerRows, proposedDates]);

  useEffect(() => {
    if (Array.isArray(organizerRows) && Array.isArray(proposedDates)) {
      const yourNewObject = {
        userID: 0,
        userName: "Total",
        designation: "",
        userEmail: "",
        title: "",
        selectedProposedDates: Array(proposedDates?.length).fill({
          proposedDateID: 0,
          proposedDate: "",
          startTime: "",
          endTime: "",
          isSelected: false,
          isTotal: 0,
        }),
      };
      const updatedOrganizerRows = [...organizerRows, yourNewObject];
      setUpdateTableRows(updatedOrganizerRows);
      let newDataProposedState = [...proposedDates];
      setProposedDatesData(newDataProposedState);
      const formattedDates = newDataProposedState
        .filter((dates, index) => dates.proposedDate !== "10000101")
        .map((date) => {
          console.log(date, "datedatedate");
          try {
            let datetimeVal = `${date?.proposedDate}${date?.startTime}`;
            const formatetDateTime = utcConvertintoGMT(datetimeVal);

            return formatetDateTime;
          } catch (error) {
            console.log(error);
          }
        });

      if (formattedDates.length > 0) {
        setFormattedDates(formattedDates);
      }
    }
  }, [organizerRows, proposedDates]);

  const toggleActive = (index, record, formattedDate) => {
    if (record !== undefined) {
      setProposedDatesData((newData) =>
        newData.map((proposedData) => ({
          ...proposedData,
          isSelected:
            proposedData.proposedDateID === record.proposedDateID
              ? true
              : false,
        }))
      );
    }
  };

  // Function to count the selected proposed dates for a row
  const countSelectedProposedDatesForColumn = (columnIndex) => {
    if (organizerRows && Array.isArray(organizerRows)) {
      console.log(organizerRows, columnIndex, "organizerRowsorganizerRows");
      const count = organizerRows.reduce((total, row) => {
        console.log(
          row.selectedProposedDates[columnIndex].isSelected,
          "organizerRowsorganizerRows"
        );

        if (
          row &&
          row.selectedProposedDates.length > 0 &&
          row.selectedProposedDates[columnIndex].isSelected
        ) {
          return convertToArabicNumerals(total + 1);
        }
        return convertToArabicNumerals(total);
      }, 0);

      // Add a zero prefix to the count if it's a single digit
      return count < 10
        ? convertToArabicNumerals(`0${count}`)
        : convertToArabicNumerals(count);
    } else {
      return convertToArabicNumerals("00");
    }
  };

  // Api hit for schedule Meeting
  const scheduleHitButton = () => {
    let NotificationClickOrganizerProposedMeeting = JSON.parse(
      localStorage.getItem("ProposedMeetingOrganizer")
    );
    let NotificationClickOrganizerProposedMeetingID = localStorage.getItem(
      "ProposedMeetingOrganizerMeetingID"
    );
    let findIsSelected = proposedDatesData.find(
      (propsedData, index) => propsedData.isSelected === true
    );

    if (findIsSelected) {
      let scheduleMeeting = {
        MeetingID: NotificationClickOrganizerProposedMeeting
          ? Number(NotificationClickOrganizerProposedMeetingID)
          : Number(viewProposeDatePollMeetingID),
        ProposedDateID: findIsSelected.proposedDateID,
      };
      console.log(
        NotificationClickOrganizerProposedMeetingID,
        "MeetingIDMeetingIDMeetingID"
      );
      dispatch(
        scheduleMeetingMainApi(
          navigate,
          t,
          scheduleMeeting,
          setDataroomMapFolderId,
          setCurrentMeetingID,
          setSceduleMeeting,
          NotificationClickOrganizerProposedMeetingID
        )
      );
    }
  };

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
            )}
            <span className={styles["Designation"]}>{record.designation}</span>
          </span>
        </>
      ),
    },

    ...formattedDates.map((formattedDate, index) => {
      let record = proposedDatesData[index + 1];
      console.log(record, "recordrecord");
      console.log(formattedDate, "formattedDate");

      let isFind;
      if (record !== null && record !== undefined) {
        let datetimeVal = `${record?.proposedDate}${record?.startTime}`;
        const formatetDateTime = utcConvertintoGMT(datetimeVal);
        console.log(formatetDateTime, "formatetDateTime");
        if (String(formatetDateTime) === String(formattedDate)) {
          isFind = record;
        }
      }
      let checkisPassed =
        new Date() >
        resolutionResultTable(record.proposedDate + record.startTime);
      console.log(isFind, "isFindisFind");

      console.log(checkisPassed, "formatetDateTimeformatetDateTime");
      return {
        title: (
          <span
            className={
              checkisPassed
                ? styles["Date-Object-Detail_disabled"]
                : isFind !== undefined && isFind.isSelected
                ? styles["Date-Object-Detail_active"]
                : styles["Date-Object-Detail"]
            }
            onClick={() => toggleActive(index, record, formattedDate)}
          >
            <span className={styles["date-time-column"]}>
              {newTimeFormaterViewPoll(formattedDate)}
            </span>
          </span>
        ),
        dataIndex: `selectedProposedDates-${index}`,
        key: `selectedProposedDates-${index}`,
        render: (text, record) => {
          console.log(record, "recordrecordrecord");
          if (record.userName === "Total") {
            const totalDate = record?.selectedProposedDates?.find(
              (date) => date?.isTotal === 0
            );
            console.log(totalDate, "totalDate");
            if (totalDate) {
              return (
                <span className={styles["TotalCount"]}>
                  {countSelectedProposedDatesForColumn(index + 1)}
                </span>
              );
            }
          } else {
            const proposedDate = record?.selectedProposedDates?.find(
              (date) =>
                date.proposedDate === moment(formattedDate).format("YYYYMMDD")
            );
            console.log(proposedDate, "proposedDateasaddad");
            if (proposedDate?.isSelected) {
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
          }
          return null;
        },
      };
    }),

    {
      title: (
        <span className={styles["Date-Object-Detail_disabled"]}>
          {t("None-of-above")}
        </span>
      ),
      dataIndex: "NoneOfAbove",
      key: "NoneOfAbove",
      render: (text, record) => {
        // ye by default blue tick show nahi krega is column ka Total ki row ma
        if (record?.userName === "Total") {
          return null;
        }

        // ye all proposedDates ma isSelected ko check krega ka wo is equal to false
        const allDatedIsUnSelected = record?.selectedProposedDates?.some(
          (date) => date.proposedDate === "10000101" && date.isSelected === true
        );
        console.log(
          allDatedIsUnSelected,
          record?.selectedProposedDates,
          "allDatedIsUnSelected"
        );
        return allDatedIsUnSelected ? (
          <img
            src={BlueTick}
            className={styles["TickIconClass"]}
            width="20.7px"
            height="14.21px"
            alt=""
          />
        ) : null;
      },
    },
  ];

  return (
    <section>
      <Modal
        show={sceduleproposedMeeting}
        setShow={dispatch(showSceduleProposedMeeting)}
        className={styles["main-modal-class"]}
        modalBodyClassName={styles["modal-class-width"]}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showSceduleProposedMeeting(false));
        }}
        dialogClassName={`${styles["modal-class-width"]} ${styles["custom-modal-dialog"]}`}
        size={"xl"}
        ModalTitle={
          <>
            <Row>
              <Col lg={11} md={11} sm={11}>
                <span className={styles["Scedule_Proposed_meeting_heading"]}>
                  {t("Schedule-proposed-meetings")}
                </span>
              </Col>
              <Col lg={1} md={1} sm={1} className="d-flex justify-content-end">
                <img
                  src={BlackCrossIcon}
                  alt=""
                  width={15}
                  onClick={handleCrossIconClass}
                />
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
                    rows={updateTableRows}
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
