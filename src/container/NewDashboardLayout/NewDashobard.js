import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./NewDashboard.module.css";
import "./NewDashbaord.css";
import { Col, Row } from "react-bootstrap";
import Stats from "./Stats/Stats";
import NewCalendar from "./Calendar/Calendar";
import Events from "./Events/Events";
import Task from "./Tasks/Task";
import RecentActivity from "./RecentActivity/RecentActivity";
import Notes from "./Notes/Notes";
import moment from "moment";
import { Button, Modal } from "../../components/elements";
import VerificationFailedIcon from "../../assets/images/failed.png";
import { useTranslation } from "react-i18next";
import { setLoader } from "../../store/actions/Auth2_actions";
import { useNavigate } from "react-router-dom";
import { GetAllMeetingTypesNewFunction } from "../../store/actions/NewMeetingActions";

const NewDashobard = () => {
  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes
  );

  const [activateBlur, setActivateBlur] = useState(false);
  let Blur = localStorage.getItem("blur");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let lang = localStorage.getItem("i18nextLng");
  useEffect(() => {
    if (lang === "ar") {
      moment.locale(lang);
    } else if (lang === "fr") {
      moment.locale(lang);
    } else if (lang === "en") {
      moment.locale(lang);
    } else {
      moment.locale("en");
    }
  }, [lang]);

  useEffect(() => {
    if (Blur != undefined) {
      setActivateBlur(true);
    } else {
      setActivateBlur(false);
    }
  }, [Blur]);

  useEffect(() => {
    if (
      getALlMeetingTypes.length === 0 &&
      Object.keys(getALlMeetingTypes).length === 0
    ) {
      dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    }
  }, []);

  const closeModal = () => {
    setActivateBlur(false);
    setLoader(false);
    navigate("/");
  };

  return (
    <>
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
      {activateBlur && (
        <Modal
          show={activateBlur}
          setShow={setActivateBlur}
          ButtonTitle={"Block"}
          centered
          size={"md"}
          modalHeaderClassName="d-none"
          ModalBody={
            <>
              <>
                <Row className="mb-1">
                  <Col lg={12} md={12} xs={12} sm={12}>
                    <Row>
                      <Col className="d-flex justify-content-center">
                        <img
                          src={VerificationFailedIcon}
                          width={60}
                          className={"allowModalIcon"}
                          alt=""
                          draggable="false"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-center mt-4">
                        <label className={"allow-limit-modal-p"}>
                          {t(
                            "The-organization-subscription-is-not-active-please-contact-your-admin"
                          )}
                        </label>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            </>
          }
          ModalFooter={
            <>
              <Col sm={12} md={12} lg={12}>
                <Row className="mb-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      className={"Ok-Successfull-btn"}
                      text={t("Ok")}
                      onClick={closeModal}
                    />
                  </Col>
                </Row>
              </Col>
            </>
          }
        />
      )}
    </>
  );
};

export default NewDashobard;
