import React from "react";
import styles from "./NewDashboard.module.css";
import "./NewDashbaord.css";
import { Container, Col, Row } from "react-bootstrap";
import Stats from "./Stats/Stats";
import NewCalendar from "./Calendar/Calendar";
import Events from "./Events/Events";
import Task from "./Tasks/Task";
import RecentActivity from "./RecentActivity/RecentActivity";
import Notes from "./Notes/Notes";

const NewDashobard = () => {
  return (
    <main className={styles["newDashboard"]}>
      <section className={styles["StatsBox"]}>
        <Row>
          <Col sm={12} md={12} lg={12}>
            <Stats />
          </Col>
        </Row>
      </section>
      <section className={styles["Dashbaords"]}>
        <Row>
          <Col sm={12} md={4} lg={4} className="d-flex flex-column">
            <section className={styles["CalendarBox"]}>
              <NewCalendar />
            </section>
            <section className={styles["EventBox"]}>
              <span className={styles["EventBox_heading"]}>Events</span>
              <section className={styles["Events_content"]}>
                <Events />
              </section>
            </section>
          </Col>
          <Col sm={12} md={4} lg={4} className="d-flex ">
            <section className={styles["Tasks"]}>
              <Task />
            </section>
          </Col>
          <Col sm={12} md={4} lg={4} className="d-flex flex-column gap-2">
            <section className={styles["RecentActivity"]}>
              <RecentActivity />
            </section>
            <section className={styles["Notes"]}>
              <Notes />
            </section>
          </Col>
        </Row>
      </section>
    </main>
  );
};

export default NewDashobard;
