import React, { useState } from "react";
import {
  Button,
  Switch,
  Paper,
  Accordian,
} from "../../../../components/elements";
import { Row, Col, Container } from "react-bootstrap";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import styles from "./Organzation.module.css";
import Select from "react-select";

const Organization = () => {
  //for translation
  const { t } = useTranslation();

  const [organizationStates, setOrganizationStates] = useState({
    SynchronizeDocuments: "",
    DisableMeetingScheduling: "",
    EmailOnNewMeeting: "",
    EmailOnEditMeeting: "",
    EmailOnCancelledMeeting: "",
    PushNotificationOnNewMeeting: "",
    PushNotificationOnEditMeeting: "",
    PushNotificationOnCancelledMeeting: "",
  });

  const synchronizeDocuments = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      SynchronizeDocuments: checked,
    });
  };

  const disableMeetingScheduling = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      DisableMeetingScheduling: checked,
    });
  };

  const emailOnNewMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailOnNewMeeting: checked,
    });
  };

  const emailOnEditMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailOnEditMeeting: checked,
    });
  };

  const emailOnCancelledMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailOnCancelledMeeting: checked,
    });
  };

  const pushNotificationOnNewMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationOnNewMeeting: checked,
    });
  };

  const pushNotificationOnEditMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationOnEditMeeting: checked,
    });
  };

  const pushNotificationOnCancelledMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationOnCancelledMeeting: checked,
    });
  };

  return (
    <>
      <Container>
        <Col sm={6} xs={12}>
          <Paper className="py-4 px-4">
            <Row className="">
              <Col lg={12} md={12} sm={12} xs={12}>
                <label className="fs-5">{t("General-Settings-Title")}</label>
              </Col>
            </Row>

            <Row className="mt-1 d-flex align-items-center">
              <Col
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Organization-Time-Zone")}</label>
              </Col>
              <Col
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Select
                  // options={timezone}
                  width="120px"
                  placeholder={t("Please-Select")}
                  className={styles["select-timezone"]}
                  // value={timeZoneValue}
                  // defaultValue={{
                  //   label: timeZoneValue.label,
                  //   value: timeZoneValue.value,
                  // }}
                  // onChange={timezoneChangeHandler}
                />
              </Col>
            </Row>

            <Row className="mt-3 d-flex align-items-center">
              <Col
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="d-flex justify-content-start align-items-center"
              >
                <label>{t("Country-Code-Title")}</label>
              </Col>
              <Col
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Select
                  // options={countrycode}
                  width="120px"
                  placeholder={t("Please-Select")}
                  className={styles["select-timezone"]}
                  // value={countryCodeValue}
                  // defaultValue={{
                  //   label: countryCodeValue.label,
                  //   value: countryCodeValue.value,
                  // }}
                  // onChange={countryCodeChandeHandler}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Synchronize-Documents")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="SynchronizeDocuments"
                  checkedValue={organizationStates.SynchronizeDocuments}
                  onChange={synchronizeDocuments}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Disable-Meeting-Scheduling")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="DisableMeetingScheduling"
                  checkedValue={organizationStates.DisableMeetingScheduling}
                  onChange={disableMeetingScheduling}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Email-On-New-Meeting")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailOnNewMeeting"
                  checkedValue={organizationStates.EmailOnNewMeeting}
                  onChange={emailOnNewMeeting}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Email-On-Edit-Meeting")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailOnEditMeeting"
                  checkedValue={organizationStates.EmailOnEditMeeting}
                  onChange={emailOnEditMeeting}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Email-On-Cancelled-Meeting")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailOnCancelledMeeting"
                  checkedValue={organizationStates.EmailOnCancelledMeeting}
                  onChange={emailOnCancelledMeeting}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Push-Notification-on-New-Meeting")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationOnNewMeeting"
                  checkedValue={organizationStates.PushNotificationOnNewMeeting}
                  onChange={pushNotificationOnNewMeeting}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Push-Notification-on-Edit-Meeting")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationOnEditMeeting"
                  checkedValue={
                    organizationStates.PushNotificationOnEditMeeting
                  }
                  onChange={pushNotificationOnEditMeeting}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Push-Notification-on-Cancelled-Meeting")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationOnCancelledMeeting"
                  checkedValue={
                    organizationStates.PushNotificationOnCancelledMeeting
                  }
                  onChange={pushNotificationOnCancelledMeeting}
                />
              </Col>
            </Row>
          </Paper>
        </Col>
      </Container>
    </>
  );
};

export default Organization;
