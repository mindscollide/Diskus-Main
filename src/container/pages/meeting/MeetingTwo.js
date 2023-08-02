import React from "react";
import styles from "./meetingTwo.module.css";
import searchicon from "../../../assets/images/searchicon.svg";
import { useTranslation } from "react-i18next";
import {
  Button,
  Table,
  TextField,
  Loader,
  Notification,
} from "../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
const NewMeeting = () => {
  const { t } = useTranslation();
  return (
    <section className={styles["NewMeeting_container"]}>
      <Row className="mt-2">
        <Col sm={12} md={6} lg={6} className="d-flex gap-3 align-items-center">
          <span className={styles["NewMeetinHeading"]}>{t("Meetings")}</span>
          <Button
            text={t("Schedule-a-meeting")}
            className={styles["Newmeeting_Scehedule_meet"]}
            icon={<Plus width={20} height={20} fontWeight={800} />}
          />
        </Col>
        <Col
          sm={12}
          md={6}
          lg={6}
          className="d-flex justify-content-end align-items-center"
        >
          <span className="position-relative">
            <TextField
              width={"502px"}
              placeholder={t("Search")}
              applyClass={"meetingSearch"}
              name={"SearchVal"}
              labelClass="d-none"
              // clickIcon={HandleShowSearch}
              inputicon={
                <img
                  src={searchicon}
                  className={styles["Search_Bar_icon_class"]}
                />
              }
              iconClassName={styles["polling_searchinput"]}
            />
          </span>
        </Col>
      </Row>
    </section>
  );
};

export default NewMeeting;
