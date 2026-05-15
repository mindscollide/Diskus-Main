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
} from "../../../../components/elements";
import { useSelector } from "react-redux";
import {
  showSceduleProposedMeeting,
  clearProposedWiseData,
} from "../../../../store/actions/NewMeetingActions";
import BlueTick from "../../../../assets/images/BlueTick.svg";
import moment from "moment";
import { scheduleMeetingMainApi } from "../../../../store/actions/NewMeetingActions";
import {
  convertIntoDateObject,
  newTimeFormaterViewPoll,
  resolutionResultTable,
  utcConvertintoGMT,
} from "../../../../commen/functions/date_formater";
// import { convertToArabicNumerals } from "../../../../../../../commen/functions/regex";
import BlackCrossIcon from "../../../../assets/images/BlackCrossIconModals.svg";
import { toggleIsOrganizerProposedMeetingDates } from "../../../../store/actions/ModalStates_actions";
import { scheduleMeetingFromProposedMeetingApi } from "../../../../store/actions/NewMeeting2.actions";
import { useMeetingContext } from "../../../../context/MeetingContext";
// import { showMessage } from "../../../../components/elements/snack_bar/utill";
const SceduleProposedmeeting = () => {
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {setEditorRole} = useMeetingContext()
  const isOrganizerViewPollProposedMeeting = useSelector(
    (state) => state.ModalStatesReducer.isOrganizerRespondProposedMeeting,
  )
    let viewProposeDatePollMeetingID = Number(
    localStorage.getItem("viewProposeDatePollMeetingID"),
  );




  const getUserProposedOrganizerData = useSelector(
    (state) => state.NewMeetingreducer.getUserProposedOrganizerData,
  );

  const [formattedDates, setFormattedDates] = useState([]);
  const [updateTableRows, setUpdateTableRows] = useState([]);
  const [proposedDatesData, setProposedDatesData] = useState([]);

  const [organizerRows, setOrganizerRows] = useState([]);
  const [initialOrganizerRows, setInitialOrganizerRows] = useState([]);
  const [proposedDates, setProposedDates] = useState([]);
  const [currentMeetingId, setCurrentMeetingId] = useState(0);

  // for rendering data in table
  useEffect(() => {
    if (
      getUserProposedOrganizerData !== null &&
      getUserProposedOrganizerData !== undefined &&
      getUserProposedOrganizerData
    ) {
      
      let ProposeDates;

      getUserProposedOrganizerData.response.forEach((datesData, index) => {
        const uniqueData = new Set(
          datesData.selectedProposedDates.map(JSON.stringify),
        );
        ProposeDates = Array.from(uniqueData).map(JSON.parse);
      });
      setCurrentMeetingId(getUserProposedOrganizerData.meetingID);
      setProposedDates(ProposeDates);
      setInitialOrganizerRows(getUserProposedOrganizerData.response);
    } else {
      setInitialOrganizerRows([]);
    }
  }, [getUserProposedOrganizerData]);

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
      const formattedDates = newDataProposedState.map((date) => {
        try {
          let datetimeVal = `${date?.proposedDate}${date?.startTime}`;
          const formatetDateTime = utcConvertintoGMT(datetimeVal);

          return formatetDateTime;
        } catch (error) {
          
        }
      });

      if (formattedDates) {
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
        })),
      );
    }
  };

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

  // Api hit for schedule Meeting
  const scheduleHitButton = () => {
    let findIsSelected = proposedDatesData.find(
      (propsedData, index) => propsedData.isSelected === true,
    );

    if (findIsSelected) {
      dispatch(
        scheduleMeetingFromProposedMeetingApi(
          navigate,
          t,
          {
            MeetingID: Number(currentMeetingId),
            ProposedDateID: findIsSelected.proposedDateID,
          },
          "",
          { role: "Organizer" ,setEditorRole},
        ),
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
      let record = proposedDatesData[index];

      let isFind;
      if (record !== null && record !== undefined) {
        let datetimeVal = `${record?.proposedDate}${record?.startTime}`;
        const formatetDateTime = utcConvertintoGMT(datetimeVal);
        if (String(formatetDateTime) === String(formattedDate)) {
          isFind = record;
        }
      }
      return {
        title: (
          <span
            className={
              isFind !== undefined && isFind.isSelected
                ? styles["Date-Object-Detail_active"]
                : styles["Date-Object-Detail"]
            }
            onClick={() => toggleActive(index, record, formattedDate)}
          >
            <span className={styles["date-time-column"]}>
              {record?.proposedDate === "10000101" &&
              record?.startTime === "000000" &&
              record?.endTime === "000000"
                ? t("None-of-the-above")
                : newTimeFormaterViewPoll(formattedDate)}
            </span>
          </span>
        ),
        dataIndex: `selectedProposedDates-${index}`,
        key: `selectedProposedDates-${index}`,
        align: "center",
        render: (text, record) => {
          console.log(text, record, "CheckTextRecordBoth");
          if (record.userName === "Total") {
            const totalDate = record?.selectedProposedDates?.find(
              (date) => date?.isTotal === 0,
            );
            if (totalDate) {
              return (
                <span className={styles["TotalCount"]}>
                  {countSelectedProposedDatesForColumn(index)}
                </span>
              );
            }
          } else {
            const proposedDate = record?.selectedProposedDates?.find(
              (date) =>
                date.proposedDate === moment(formattedDate).format("YYYYMMDD"),
            );
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
  ];
  return (
    <section>
      <Modal
        show={isOrganizerViewPollProposedMeeting}
        className={styles["main-modal-class"]}
        modalBodyClassName={styles["modal-class-width"]}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(toggleIsOrganizerProposedMeetingDates(false));
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
              <Col
                lg={1}
                md={1}
                sm={1}
                onClick={() =>
                  dispatch(toggleIsOrganizerProposedMeetingDates(false))
                }
                className='d-flex justify-content-end'>
                <img
                  src={BlackCrossIcon}
                  alt=""
                  className="cursor-pointer"
                  width={15}
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
