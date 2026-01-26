import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./workingDays.module.css";
import CustomSwitch from "../../../../../components/elements/switch_button/Switch";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import { Notification } from "../../../../../components/elements";

const WorkingDays = ({ setOrganizationSetting, organizationSettingData }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // const handleChangeSwitchValue = (checked, name) => {
  //   setOrganizationSetting((organizationSettings) => {
  //     return {
  //       ...organizationSettings,
  //       [name]: checked,
  //     };
  //   });
  // };

  const WORKING_DAY_KEYS = [
    "isMondayWorkingDay",
    "isTuesdayWorkingDay",
    "isWednesdayWorkingDay",
    "isThursdayWorkingDay",
    "isFridayWorkingDay",
    "isSaturdayWorkingDay",
    "isSundayWorkingDay",
  ];

  const handleChangeSwitchValue = (checked, name) => {
    setOrganizationSetting((prev) => {
      // If turning OFF a day
      if (checked === false) {
        const isAnyOtherDayTrue = WORKING_DAY_KEYS.some(
          (key) => key !== name && prev[key] === true
        );

        // Prevent all days from becoming false
        if (!isAnyOtherDayTrue) {
          showMessage(
            t("Please-select-atleast-a-single-day"),
            "error",
            setOpen
          );
          return prev;
        }
      }

      return {
        ...prev,
        [name]: checked,
      };
    });
  };

  return (
    <>
      <Row className="mt-4 mb-4">
        <Col
          sm={12}
          md={12}
          lg={12}
          className={`${styles["selectWorkingDays_main-heading"]} ${"mb-4"}`}
        >
          {t("Select-working-days")}
        </Col>
      </Row>

      <Row className="mt-4">
        <Col
          sm={12}
          md={3}
          lg={3}
          className={
            organizationSettingData.isMondayWorkingDay === true
              ? styles["switchDayStyle"]
              : styles["switchDayStyle_disabled"]
          }
        >
          {t("Monday")}
        </Col>
        <Col sm={12} md={9} lg={9}>
          <CustomSwitch
            checkedValue={organizationSettingData.isMondayWorkingDay}
            name={"isMondayWorkingDay"}
            onChange={(event) =>
              handleChangeSwitchValue(event, "isMondayWorkingDay")
            }
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col
          sm={12}
          md={3}
          lg={3}
          className={
            organizationSettingData.isTuesdayWorkingDay === true
              ? styles["switchDayStyle"]
              : styles["switchDayStyle_disabled"]
          }
        >
          {t("Tuesday")}
        </Col>
        <Col sm={12} md={9} lg={9}>
          <CustomSwitch
            checkedValue={organizationSettingData.isTuesdayWorkingDay}
            name={"isTuesdayWorkingDay"}
            onChange={(event) =>
              handleChangeSwitchValue(event, "isTuesdayWorkingDay")
            }
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col
          sm={12}
          md={3}
          lg={3}
          className={
            organizationSettingData.isWednesdayWorkingDay === true
              ? styles["switchDayStyle"]
              : styles["switchDayStyle_disabled"]
          }
        >
          {t("Wednesday")}
        </Col>
        <Col sm={12} md={9} lg={9}>
          <CustomSwitch
            checkedValue={organizationSettingData.isWednesdayWorkingDay}
            name={"isWednesdayWorkingDay"}
            onChange={(event) =>
              handleChangeSwitchValue(event, "isWednesdayWorkingDay")
            }
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col
          sm={12}
          md={3}
          lg={3}
          className={
            organizationSettingData.isThursdayWorkingDay === true
              ? styles["switchDayStyle"]
              : styles["switchDayStyle_disabled"]
          }
        >
          {t("Thrusday")}
        </Col>
        <Col sm={12} md={9} lg={9}>
          <CustomSwitch
            checkedValue={organizationSettingData.isThursdayWorkingDay}
            name={"isThursdayWorkingDay"}
            onChange={(event) =>
              handleChangeSwitchValue(event, "isThursdayWorkingDay")
            }
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col
          sm={12}
          md={3}
          lg={3}
          className={
            organizationSettingData.isFridayWorkingDay === true
              ? styles["switchDayStyle"]
              : styles["switchDayStyle_disabled"]
          }
        >
          {t("Friday")}
        </Col>
        <Col sm={12} md={9} lg={9}>
          <CustomSwitch
            checkedValue={organizationSettingData.isFridayWorkingDay}
            name={"isFridayWorkingDay"}
            onChange={(event) =>
              handleChangeSwitchValue(event, "isFridayWorkingDay")
            }
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col
          sm={12}
          md={3}
          lg={3}
          className={
            organizationSettingData.isSaturdayWorkingDay === true
              ? styles["switchDayStyle"]
              : styles["switchDayStyle_disabled"]
          }
        >
          {t("Saturday")}
        </Col>
        <Col sm={12} md={9} lg={9}>
          <CustomSwitch
            checkedValue={organizationSettingData.isSaturdayWorkingDay}
            name={"isSaturdayWorkingDay"}
            onChange={(event) =>
              handleChangeSwitchValue(event, "isSaturdayWorkingDay")
            }
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col
          sm={12}
          md={3}
          lg={3}
          className={
            organizationSettingData.isSundayWorkingDay === true
              ? styles["switchDayStyle"]
              : styles["switchDayStyle_disabled"]
          }
        >
          {t("Sunday")}
        </Col>
        <Col sm={12} md={9} lg={9}>
          <CustomSwitch
            checkedValue={organizationSettingData.isSundayWorkingDay}
            name={"isSundayWorkingDay"}
            onChange={(event) =>
              handleChangeSwitchValue(event, "isSundayWorkingDay")
            }
          />
        </Col>
      </Row>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default WorkingDays;
