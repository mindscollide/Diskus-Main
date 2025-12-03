import React, { useState, useEffect, useContext } from "react";
import styles from "./Attendence.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Table,
  Notification,
} from "../../../../../components/elements";
import {
  clearAttendanceResponse,
  getAllAttendanceMeetingApi,
  saveMeetingAttendanceApi,
} from "../../../../../store/actions/Attendance_Meeting";
import presentIcon from "../../../../../assets/images/Present.svg";
import AbsentIcon from "../../../../../assets/images/absent.svg";
import HomeworkIcon from "../../../../../assets/images/homework.svg";
import whitepresentIcon from "../../../../../assets/images/whitepresent.png";
import whiteAbsentICon from "../../../../../assets/images/whiteabsent.png";
import whiteworkhome from "../../../../../assets/images/whitehomework.png";

import CancelButtonModal from "../meetingDetails/CancelButtonModal/CancelButtonModal";

import { useSelector } from "react-redux";
import ModalCancelAttendance from "./ModalCancelAttendence/ModalCancelAttendance";
import {
  searchNewUserMeeting,
  showAttendanceConfirmationModal,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../../store/actions/NewMeetingActions";
import { deepEqual } from "../../../../../commen/functions/CompareArrayObjectValues";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import {
  MeetingContext,
  useMeetingContext,
} from "../../../../../context/MeetingContext";
const Attendence = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");
  const [useCase, setUseCase] = useState(0);
  const {
    setPolls,
    setMinutes,
    setAgenda,
    advanceMeetingModalID,
    setAttendance,
    setViewAdvanceMeetingModal,
    setAdvanceMeetingModalID,
    setEditorRole,
  } = useMeetingContext();
  //reducer call from Attendance_Reducers
  const attendanceConfirmationModal = useSelector(
    (state) => state.NewMeetingreducer.attendanceConfirmationModal
  );

  const ResponseMessage = useSelector(
    (state) => state.attendanceMeetingReducer.ResponseMessage
  );
  const attendanceMeetings = useSelector(
    (state) => state.attendanceMeetingReducer.attendanceMeetings
  );
  const [attendenceRows, setAttendenceRows] = useState([]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [cancelModalView, setCancelModalView] = useState(false);

  const enablePresent = (record, status) => {
    const updatedRows = attendenceRows.map((row) => {
      if (row.userID === record.userID) {
        return {
          ...row,
          meetingAttendancestatus: {
            ...row.meetingAttendancestatus,
            attendanceStatus: t("Present"),
            attendanceStatusID: status,
          },
        };
      }
      return row;
    });
    setAttendenceRows(updatedRows);
  };

  const enableAbsent = (record, status) => {
    const updatedRows = attendenceRows.map((row) => {
      if (row.userID === record.userID) {
        return {
          ...row,
          meetingAttendancestatus: {
            ...row.meetingAttendancestatus,
            attendanceStatus: t("Absent"),
            attendanceStatusID: status,
          },
        };
      }
      return row;
    });
    setAttendenceRows(updatedRows);
  };

  const enableworkFromHome = (record, status) => {
    const updatedRows = attendenceRows.map((row) => {
      if (row.userID === record.userID) {
        return {
          ...row,
          meetingAttendancestatus: {
            ...row.meetingAttendancestatus,
            attendanceStatus: t("Remote"),
            attendanceStatusID: status,
          },
        };
      }
      return row;
    });
    setAttendenceRows(updatedRows);
  };

  const attendanceColumn = [
    {
      dataIndex: "userName",
      key: "userName",
      render: (text, record) => (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["PersonName"]}>{text}</span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Designation"]}>
                {record.designation}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      dataIndex: "email",
      key: "email",
      render: (text) => <label className={styles["Email"]}>{text}</label>,
    },
    {
      dataIndex: "title",
      key: "title",
      render: (text) => <label className={styles["Email"]}>{text}</label>,
    },
    {
      dataIndex: ["meetingAttendancestatus", "attendanceStatusID"],
      key: "meetingAttendancestatus",
      render: (text, record) => (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className='d-flex align-items-center gap-4'>
              {}
              {/* Add this line for debugging */}
              {text === 1 ? (
                <>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <section className={styles["PresentBackgroundSection"]}>
                        <img
                          alt='Present-Icon'
                          src={whitepresentIcon}
                          width='22.59px'
                          height='22.59px'
                        />
                        <span>{t("Present")}</span>
                      </section>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <img
                    alt='Present-Pic'
                    src={presentIcon}
                    height='22.59px'
                    width='22.59px'
                    className={"cursor-pointer"}
                    onClick={() => enablePresent(record, 1)}
                  />
                </>
              )}
              {text === 2 ? (
                <>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <section className={styles["AbsentBackgroundSection"]}>
                        <img
                          alt='Absent-Icon'
                          src={whiteAbsentICon}
                          width='22.59px'
                          height='22.59px'
                        />
                        <span>{t("Absent")}</span>
                      </section>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <img
                    alt='Absent-Pic'
                    src={AbsentIcon}
                    height='22.59px'
                    width='22.59px'
                    className={"cursor-pointer"}
                    onClick={() => enableAbsent(record, 2)}
                  />
                </>
              )}
              {text === 3 ? (
                <>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <section className={styles["WorkFromHomeSection"]}>
                        <img
                          alt='Remote-Icon'
                          src={whiteworkhome}
                          width='22.59px'
                          height='22.59px'
                        />
                        <span>{t("Remote")}</span>
                      </section>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <img
                    alt='Remote-Pic'
                    src={HomeworkIcon}
                    height='21.84px'
                    width='21.84px'
                    className={"cursor-pointer"}
                    onClick={() => enableworkFromHome(record, 3)}
                  />
                </>
              )}
            </Col>
          </Row>
        </>
      ),
    },
  ];
  // for rendering data in table
  useEffect(() => {
    if (
      attendanceMeetings !== null &&
      attendanceMeetings !== undefined &&
      attendanceMeetings.length > 0
    ) {
      setAttendenceRows(attendanceMeetings);
    } else {
      setAttendenceRows([]);
    }
  }, [attendanceMeetings]);

  // dispatch Api in useEffect
  useEffect(() => {
    let meetingData = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(getAllAttendanceMeetingApi(navigate, t, meetingData));
  }, []);

  // for save the meeting

  // Function to handle notification logic
  const handleSaveNotification = () => {
    if (ResponseMessage) {
      showMessage(ResponseMessage, "success", setOpen);

      // Dispatch an action to reset/clear ResponseMessage
      dispatch(clearAttendanceResponse());
    }
  };

  // for save the meeting
  const saveHandler = async () => {
    try {
      let newData = [];
      attendenceRows.forEach((data, index) => {
        newData.push({
          AttendanceStatusID: data.meetingAttendancestatus.attendanceStatusID,
          UserID: data.userID,
        });
      });
      let Data = {
        MeetingAttendance: newData,
        MeetingID: Number(advanceMeetingModalID),
      };

      const response = await dispatch(
        saveMeetingAttendanceApi(navigate, t, Data)
      );

      if (response && response.success) {
        handleSaveNotification();
      } else {
      }
    } catch (error) {
      handleSaveNotification();
      console.error("Error saving attendance:", error);
    }
  };

  // useEffect to handle notifications
  useEffect(() => {
    handleSaveNotification();
  }, [ResponseMessage]);

  // ... (existing code)

  // This is how I can revert Data without Hitting an API
  const revertHandler = () => {
    if (
      attendanceMeetings !== null &&
      attendanceMeetings !== undefined &&
      attendanceMeetings.length > 0
    ) {
      setAttendenceRows(attendanceMeetings);
    } else {
      setAttendenceRows([]);
    }
  };

  const handleCancelBtn = () => {
    let ReducerAttendeceData = deepEqual(attendanceMeetings, attendenceRows);
    if (ReducerAttendeceData) {
      setViewAdvanceMeetingModal(false);
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));

      setAttendance(false);
      let searchData = {
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber:
          meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
        PublishedMeetings:
          currentView && Number(currentView) === 1 ? true : false,
      };
      
      dispatch(searchNewUserMeeting(navigate, searchData, t));
      localStorage.removeItem("folderDataRoomMeeting");
      setEditorRole({ status: null, role: null });
      setAdvanceMeetingModalID(null);
    } else {
      dispatch(showAttendanceConfirmationModal(true));
      setUseCase(2);
    }
  };

  return (
    <>
      <section className={styles["fixedHeight"]}>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Table
              column={attendanceColumn}
              scroll={{ y: "44vh" }}
              pagination={false}
              className='Polling_table'
              rows={attendenceRows}
            />
          </Col>
        </Row>
      </section>

      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className='d-flex justify-content-end gap-2 mt-4'>
          <Button
            text={t("Cancel")}
            className={styles["Cancel_Meeting_Details"]}
            onClick={handleCancelBtn}
          />

          <Button
            text={t("Revert")}
            onClick={() => revertHandler()}
            className={styles["CloneMeetingStyles"]}
          />
          <Button
            text={t("Save")}
            onClick={() => saveHandler()}
            className={styles["CloneMeetingStyles"]}
          />
        </Col>
      </Row>
      {cancelModalView && (
        <CancelButtonModal
          setCancelModalView={setCancelModalView}
          cancelModalView={cancelModalView}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          setAgenda={setAgenda}
          setPolls={setPolls}
          setAttendance={setAttendance}
          setMinutes={setMinutes}
          setAdvanceMeetingModalID={setAdvanceMeetingModalID}
        />
      )}

      {attendanceConfirmationModal && (
        <ModalCancelAttendance
          setAttendance={setAttendance}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          useCase={useCase}
          setPolls={setPolls}
        />
      )}

      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default Attendence;
