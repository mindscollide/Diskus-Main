import React from "react";
import styles from "./MeetingDetails.module.css";
import { useTranslation } from "react-i18next";
import MeetingVideoChatIcon from "../../../../../assets/images/newElements/Icon feather-video1.png";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Switch,
  TextField,
  Loader,
  Notification,
} from "../../../../../components/elements";

const MeetingDetails = () => {
  const { t } = useTranslation();
  return (
    <section>
      <Row>
        {/* First Half */}
        <Col lg={6} md={6} sm={12}>
          <Row className="mt-5">
            <Col lg={12} md={12} sm={12}>
              <TextField
                placeholder={t("Meeting-title")}
                applyClass={"meetinInnerSearch"}
                labelClass="d-none"
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col lg={6} md={6} sm={12}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Meeting_type_heading"]}>
                    {t("Meeting-type")}
                    <span>*</span>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <TextField
                    placeholder={t("Meeting-type")}
                    applyClass={"meetinInnerSearch"}
                    labelClass="d-none"
                  />
                </Col>
              </Row>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Meeting_type_heading"]}>
                    {t("Location")}
                    <span>*</span>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <TextField
                    placeholder={t("Location")}
                    applyClass={"meetinInnerSearch"}
                    labelClass="d-none"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <TextField
                applyClass="text-area-create-resolution"
                type="text"
                as={"textarea"}
                rows="4"
                placeholder={t("Description") + "*"}
                required={true}
                maxLength={500}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col lg={4} md={4} sm={12}>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12} className="d-flex gap-3">
                  <Switch />
                  <span className={styles["Create_group_chat_heading"]}>
                    {t("Create-group-chat")}
                  </span>
                </Col>
              </Row>
            </Col>
            <Col lg={8} md={8} sm={12}>
              <Row>
                <Col lg={1} md={1} sm={12} className="d-flex gap-3 m-0 p-0">
                  <Button
                    icon={
                      <img
                        src={MeetingVideoChatIcon}
                        width="22.32px"
                        height="14.75px"
                        className={styles["Camera_icon"]}
                      />
                    }
                    className={styles["Button_not_active"]}
                  />
                </Col>
                <Col lg={11} md={11} sm={12}>
                  <TextField
                    placeholder={t("Paste-microsoft-team-zoom-link") + "*"}
                    applyClass={"meetinInnerSearch"}
                    labelClass="d-none"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Scedule_heading"]}>
                    {t("Scheduled-on")}
                    <span>*</span>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={styles["Scroller_meeting"]}
                >
                  <Row className="mt-2">
                    <Col lg={4} md={4} sm={12}>
                      <Select />
                    </Col>
                    <Col lg={4} md={4} sm={12} className="timePicker">
                      <DatePicker
                        arrowClassName="arrowClass"
                        containerClassName="containerClassTimePicker"
                        className="timePicker"
                        disableDayPicker
                        inputClass="inputTIme"
                        format="HH:mm A"
                        plugins={[<TimePicker hideSeconds />]}
                      />
                    </Col>
                    <Col lg={4} md={4} sm={12}></Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        {/* First Half */}
        <Col lg={6} md={6} sm={12}></Col>
      </Row>
    </section>
  );
};

export default MeetingDetails;
