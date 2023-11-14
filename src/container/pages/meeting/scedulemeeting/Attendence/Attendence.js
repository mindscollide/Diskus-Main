import React, { useState, useEffect } from "react";
import styles from "./Attendence.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Button, Table, Loader } from "../../../../../components/elements";
import {
  getAllAttendanceMeetingApi,
  saveMeetingAttendanceApi,
} from "../../../../../store/actions/Attendance_Meeting";
import presentIcon from "../../../../../assets/images/Present.svg";
import AbsentIcon from "../../../../../assets/images/absent.svg";
import HomeworkIcon from "../../../../../assets/images/homework.svg";
import whitepresentIcon from "../../../../../assets/images/whitepresent.png";
import whiteAbsentICon from "../../../../../assets/images/whiteabsent.png";
import whiteworkhome from "../../../../../assets/images/whitehomework.png";
import { useSelector } from "react-redux";
const Attendence = ({ currentMeeting, setSceduleMeeting }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //reducer call from Attendance_Reducers
  const { attendanceMeetingReducer } = useSelector((state) => state);
  console.log(attendanceMeetingReducer, "attendanceMeetingReducer");

  let meetingID = Number(localStorage.getItem("meetingID"));

  const [attendenceRows, setAttendenceRows] = useState([]);
  console.log(attendenceRows, "attendenceRowsattendenceRows");

  console.log(meetingID, "meetingIDmeetingID");

  const enablePresent = (record, status) => {
    const updatedRows = attendenceRows.map((row) => {
      if (row.userID === record.userID) {
        return {
          ...row,
          meetingAttendancestatus: {
            ...row.meetingAttendancestatus,
            attendanceStatus: "Present",
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
            attendanceStatus: "Absent",
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
            attendanceStatus: "Remote",
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
              className="d-flex align-items-center gap-4"
            >
              {console.log("attendanceStatusID:", text)}
              {/* Add this line for debugging */}
              {text === 1 ? (
                <>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <section className={styles["PresentBackgroundSection"]}>
                        <img
                          alt="Present-Icon"
                          src={whitepresentIcon}
                          width="22.59px"
                          height="22.59px"
                        />
                        <span>
                          {record.meetingAttendancestatus.attendanceStatus}
                        </span>
                      </section>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <img
                    alt="Present-Pic"
                    src={presentIcon}
                    height="22.59px"
                    width="22.59px"
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
                          alt="Absent-Icon"
                          src={whiteAbsentICon}
                          width="22.59px"
                          height="22.59px"
                        />
                        <span>
                          {record.meetingAttendancestatus.attendanceStatus}
                        </span>
                      </section>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <img
                    alt="Absent-Pic"
                    src={AbsentIcon}
                    height="22.59px"
                    width="22.59px"
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
                          alt="Remote-Icon"
                          src={whiteworkhome}
                          width="22.59px"
                          height="22.59px"
                        />
                        <span>
                          {record.meetingAttendancestatus.attendanceStatus}
                        </span>
                      </section>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <img
                    alt="Remote-Pic"
                    src={HomeworkIcon}
                    height="21.84px"
                    width="21.84px"
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
      attendanceMeetingReducer.attendanceMeetings !== null &&
      attendanceMeetingReducer.attendanceMeetings !== undefined &&
      attendanceMeetingReducer.attendanceMeetings.length > 0
    ) {
      setAttendenceRows(attendanceMeetingReducer.attendanceMeetings);
    } else {
      setAttendenceRows([]);
    }
  }, [attendanceMeetingReducer.attendanceMeetings]);

  console.log(
    attendanceMeetingReducer.attendanceMeetings,
    "attendanceMeetingReducerattendanceMeetings"
  );

  // dispatch Api in useEffect
  useEffect(() => {
    let meetingData = {
      MeetingID: Number(currentMeeting),
    };
    dispatch(getAllAttendanceMeetingApi(navigate, t, meetingData));
  }, []);

  // for save the meeting
  const saveHandler = () => {
    let newData = [];
    attendenceRows.forEach((data, index) => {
      newData.push({
        AttendanceStatusID: data.meetingAttendancestatus.attendanceStatusID,
        UserID: data.userID,
      });
    });
    let Data = {
      MeetingAttendance: newData,
      MeetingID: Number(currentMeeting),
    };
    console.log(Data, "DataData");
    dispatch(saveMeetingAttendanceApi(navigate, t, Data));
  };

  // This is how I can revert Data without Hitting an API
  const revertHandler = () => {
    if (
      attendanceMeetingReducer.attendanceMeetings !== null &&
      attendanceMeetingReducer.attendanceMeetings !== undefined &&
      attendanceMeetingReducer.attendanceMeetings.length > 0
    ) {
      setAttendenceRows(attendanceMeetingReducer.attendanceMeetings);
    } else {
      setAttendenceRows([]);
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
              className="Polling_table"
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
          className="d-flex justify-content-end gap-2 mt-4"
        >
          <Button
            text={t("Save")}
            onClick={() => saveHandler()}
            className={styles["CloneMeetingStyles"]}
          />
          <Button
            text={t("Revert")}
            onClick={() => revertHandler()}
            className={styles["CloneMeetingStyles"]}
          />
        </Col>
      </Row>

      {attendanceMeetingReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default Attendence;
