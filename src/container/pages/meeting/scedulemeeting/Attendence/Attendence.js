import React, { useState } from "react";
import styles from "./Attendence.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Button, Table } from "../../../../../components/elements";
import presentIcon from "../../../../../assets/images/Present.svg";
import AbsentIcon from "../../../../../assets/images/absent.svg";
import HomeworkIcon from "../../../../../assets/images/homework.svg";
import whitepresentIcon from "../../../../../assets/images/whitepresent.png";
import whiteAbsentICon from "../../../../../assets/images/whiteabsent.png";
import whiteworkhome from "../../../../../assets/images/whitehomework.png";
const Attendence = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [present, setPresent] = useState(false);
  const [absent, setAbsent] = useState(true);
  const [workhome, setworkhome] = useState(false);

  const enablePresent = () => {
    console.log("present sir");
    setPresent(true);
    setworkhome(false);
    setAbsent(false);
  };

  const enableAbsent = () => {
    setAbsent(true);
    setworkhome(false);
    setPresent(false);
  };

  const enableworkFromHome = () => {
    setworkhome(true);
    setAbsent(false);
    setPresent(false);
  };

  const notificationData = [
    {
      key: "1",
      Name: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["PersonName"]}>Mr. Abdul Qadir</span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Designation"]}>CFO</span>
            </Col>
          </Row>
        </>
      ),
      Email: <label className={styles["Email"]}>mrabdulqadir@gmail.com</label>,
      OrganizerTitle: <label className={styles["Email"]}>Chair Person</label>,
      Primary: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-4"
            >
              {present === true ? (
                <>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <section className={styles["PresentBackgroundSection"]}>
                        <img
                          src={whitepresentIcon}
                          width="22.59px"
                          height="22.59px"
                        />
                        <span>{t("Present")}</span>
                      </section>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <img
                    src={presentIcon}
                    height="22.59px"
                    width="22.59px"
                    className="cursor-pointer"
                    onClick={enablePresent}
                  />
                </>
              )}

              {absent === true ? (
                <>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <section className={styles["AbsentBackgroundSection"]}>
                        <img
                          src={whiteAbsentICon}
                          width="22.59px"
                          height="22.59px"
                        />
                        <span>{t("Absent")}</span>
                      </section>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <img
                    src={AbsentIcon}
                    height="22.59px"
                    width="22.59px"
                    className="cursor-pointer"
                    onClick={enableAbsent}
                  />
                </>
              )}

              {workhome === true ? (
                <>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <section className={styles["WorkFromHomeSection"]}>
                        <img
                          src={whiteworkhome}
                          width="22.59px"
                          height="22.59px"
                        />
                        <span>{t("Absent")}</span>
                      </section>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <img
                    src={HomeworkIcon}
                    height="21.84px"
                    width="21.84px"
                    className="cursor-pointer"
                    onClick={enableworkFromHome}
                  />
                </>
              )}
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const [attendenceRows, setAttendenceRows] = useState(notificationData);

  const AttendenceColoumns = [
    {
      dataIndex: "Name",
      key: "Name",
      width: "120px",
    },

    {
      dataIndex: "Email",
      key: "Email",
      width: "140px",
    },
    {
      dataIndex: "OrganizerTitle",
      key: "OrganizerTitle",
      width: "120px",
    },

    {
      dataIndex: "Primary",
      key: "Primary",
      width: "150px",
    },
  ];

  return (
    <>
      <section className={styles["fixedHeight"]}>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Table
              column={AttendenceColoumns}
              scroll={{ y: "92vh" }}
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
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={t("Clone-meeting")}
            className={styles["CloneMeetingStyles"]}
          />
          <Button text={t("Cancel")} className={styles["CloneMeetingStyles"]} />
        </Col>
      </Row>
    </>
  );
};

export default Attendence;
