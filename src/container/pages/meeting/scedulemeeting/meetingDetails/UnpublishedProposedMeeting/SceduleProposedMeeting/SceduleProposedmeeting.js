import React, { useEffect, useState } from "react";
import styles from "./SceduleProposedMeeting.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import {
  Modal,
  Button,
  Table,
  Notification,
} from "../../../../../../../components/elements";
import { useSelector } from "react-redux";
import {
  showSceduleProposedMeeting,
  getUserProposedWiseApi,
} from "../../../../../../../store/actions/NewMeetingActions";
import BlueTick from "../../../../../../../assets/images/BlueTick.svg";
import moment from "moment";
import { scheduleMeetingMainApi } from "../../../../../../../store/actions/NewMeetingActions";
import {
  convertIntoDateObject,
  newTimeFormaterViewPoll,
  resolutionResultTable,
  utcConvertintoGMT,
} from "../../../../../../../commen/functions/date_formater";
import { convertToArabicNumerals } from "../../../../../../../commen/functions/regex";
import BlackCrossIcon from "../../../../../../../assets/images/BlackCrossIconModals.svg";
import { showMessage } from "../../../../../../../components/elements/snack_bar/utill";
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
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
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
      const ProposeDates = Array.from(
        userWiseMeetingProposed
          .flatMap((datesData) => datesData.selectedProposedDates)
          .reduce((map, proposedDate) => {
            // Check if the date already exists in the Map
            if (map.has(proposedDate.proposedDate)) {
              const existing = map.get(proposedDate.proposedDate);

              // Prioritize `isSelected: true`
              if (proposedDate.isSelected) {
                map.set(proposedDate.proposedDate, proposedDate); // Replace if current is true
              } else if (!existing.isSelected) {
                map.set(proposedDate.proposedDate, proposedDate); // Keep one if none are true
              }
            } else {
              // Add the proposed date to the Map
              map.set(proposedDate.proposedDate, proposedDate);
            }
            return map;
          }, new Map())
          .values() // Extract unique values from the Map
      );

      console.log(ProposeDates, "Filtered Unique ProposeDates");

      console.log(ProposeDates, "Filtered ProposeDates");

      setProposedDates(ProposeDates);

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
          isChecked:
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
        if (
          row &&
          row.selectedProposedDates.length > 0 &&
          row.selectedProposedDates[columnIndex]?.isSelected
        ) {
          return total + 1;
        }
        return total;
      }, 0);

      // Add a zero prefix to the count if it's a single digit
      const formattedCount = count < 10 ? `0${count}` : `${count}`;

      return convertToArabicNumerals(formattedCount);
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
      (propsedData, index) => propsedData?.isChecked === true
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
    } else {
      showMessage(t("Please-select-a-date"), "error", setOpen);
    }
  };

  const getCurrentYYYYMMDD = (dateVal) => {
    let convertDateTime = convertIntoDateObject(dateVal);

    return moment(convertDateTime).format("YYYYMMDD");
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
        const formatetDateTime = resolutionResultTable(datetimeVal);
        console.log(
          formatetDateTime,
          String(formatetDateTime) === String(formattedDate),
          String(formatetDateTime),
          String(formattedDate),
          "formatetDateTime"
        );
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
                : isFind !== undefined && isFind?.isChecked
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
                getCurrentYYYYMMDD(date.proposedDate + date.startTime) ===
                moment(formattedDate).format("YYYYMMDD")
            );
            console.log(
              proposedDate,
              record?.selectedProposedDates,
              "proposedDateasaddad selectedProposedDates"
            );
            if (proposedDate?.isSelected) {
              return (
                <Row>
                  <Col lg={8} md={8} sm={8}>
                    <span className="d-flex justify-content-center">
                      <img
                        src={BlueTick}
                        className={styles["TickIconClass"]}
                        width="20.7px"
                        height="14.21px"
                        alt=""
                      />
                    </span>
                  </Col>
                </Row>
              );
            }
          }
          return null;
        },
      };
    }),

    {
      title: () => {
        // Check if `proposedDate: "10000101"` is `isSelected: true` in the reducer
        const isActiveDateSelected = userWiseMeetingProposed?.some((user) =>
          user.selectedProposedDates?.some(
            (date) =>
              date.proposedDate === "10000101" && date.isSelected === true
          )
        );
        console.log(isActiveDateSelected, "isActiveDateSelected");

        return (
          <span
            className={
              isActiveDateSelected
                ? styles["Date-Object-Detail_active"]
                : styles["Date-Object-Detail_disabled"]
            }
          >
            {t("None-of-the-above")}
          </span>
        );
      },
      dataIndex: "NoneOfAbove",
      key: "NoneOfAbove",
      render: (text, record) => {
        const counter = record.selectedProposedDates.filter(
          (date) => date.proposedDate === "10000101" && date.isSelected
        );
        const formattedCounter = String(counter).padStart(2, "0");
        console.log(counter, "countercountercounter");

        if (record?.userName === "Total") {
          return (
            <span className={styles["TotalCount"]}>
              {convertToArabicNumerals(formattedCounter)}
            </span>
          );
        }

        // Check if `proposedDate: "10000101"` is `isSelected: true`
        const allDatedIsUnSelected = record?.selectedProposedDates?.some(
          (date) => date.proposedDate === "10000101" && date.isSelected === true
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
                  className="cursor-pointer"
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
      <Notification open={open} setOpen={setOpen} />
    </section>
  );
};

export default SceduleProposedmeeting;
