import React from "react";
import styles from "./NewDashboard.module.css";
import "./NewDashbaord.css";
import { Container, Col, Row } from "react-bootstrap";
import Stats from "./Stats/Stats";
import NewCalendar from "./Calendar/Calendar";
import Events from "./Events/Events";

const NewDashobard = () => {
  return (
    <main className={styles["newDashboard"]}>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <section className={styles["StatsBox"]}>
            <Stats />
          </section>
        </Col>
      </Row>
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
          <Col sm={12} md={4} lg={4}>
            <section className={styles["Tasks"]}>Tasks</section>
          </Col>
          <Col sm={12} md={4} lg={4} className="d-flex flex-column">
            <section className={styles["RecentActivity"]}>Recent Activity</section>
            <section className={styles["Notes"]}>Notes</section>
          </Col>
        </Row>
      </section>
    </main>
  );
};

export default NewDashobard;
