import React, { useState } from "react";
import styles from "./MeetingDetails.module.css";
import { useTranslation } from "react-i18next";
import MeetingVideoChatIcon from "../../../../../assets/images/newElements/Icon feather-video1.png";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import plusFaddes from "../../../../../assets/images/PlusFadded.svg";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Switch,
  TextField,
  Loader,
  Notification,
} from "../../../../../components/elements";
import { Plus } from "react-bootstrap-icons";

const MeetingDetails = () => {
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const [rows, setRows] = useState([
    { selectedOption: null, startDate: null, endDate: null },
  ]);
  const handleSelectChange = (selectedOption) => {
    setOptions({ ...options, selectedOption });
  };

  const handleStartDateChange = (date) => {
    setOptions({ ...options, startDate: date });
  };

  const handleEndDateChange = (date) => {
    setOptions({ ...options, endDate: date });
  };

  const addRow = () => {
    setRows([
      ...rows,
      { selectedOption: null, startDate: null, endDate: null },
    ]);
  };

  const HandleCancelFunction = (index) => {
    let optionscross = [...rows];
    optionscross.splice(index, 1);
    setRows(optionscross);
  };

  console.log(rows, "optionsoptionsoptions");
  return (
    <section>
      <Row>
        {/* First Half */}
        <Col lg={8} md={8} sm={12}>
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
            <Col lg={5} md={5} sm={12}>
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
            <Col lg={5} md={5} sm={12}>
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
            <Col lg={2} md={2} sm={12}>
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  <Button className={styles["Plus_Button_class"]} />
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
              <span className={styles["Scedule_heading"]}>
                {t("Scheduled-on")}
                <span>*</span>
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} className={styles["Scroller_meeting"]}>
              {rows.length > 0
                ? rows.map((data, index) => {
                    return (
                      <>
                        {index <= 1 ? (
                          <Row>
                            <Col lg={12} md={12} sm={12} key={index}>
                              <Row className="mt-2">
                                <Col lg={4} md={4} sm={12}>
                                  <Select
                                    value={rows.selectedOption}
                                    onChange={handleSelectChange}
                                    isSearchable={false}
                                  />
                                </Col>
                                <Col
                                  lg={4}
                                  md={4}
                                  sm={12}
                                  className="timePicker"
                                >
                                  <DatePicker
                                    arrowClassName="arrowClass"
                                    containerClassName="containerClassTimePicker"
                                    className="timePicker"
                                    disableDayPicker
                                    inputClass="inputTIme"
                                    format="HH:mm A"
                                    plugins={[<TimePicker hideSeconds />]}
                                    selected={rows.startDate}
                                    onChange={handleStartDateChange}
                                  />
                                </Col>
                                <Col
                                  lg={3}
                                  md={3}
                                  sm={12}
                                  // className="d-flex justify-content-end"
                                >
                                  <DatePicker
                                    arrowClassName="arrowClass"
                                    containerClassName="containerClassTimePicker"
                                    className="timePicker"
                                    disableDayPicker
                                    inputClass="inputTIme"
                                    format="HH:mm A"
                                    plugins={[<TimePicker hideSeconds />]}
                                    selected={rows.endDate}
                                    onChange={handleEndDateChange}
                                  />
                                </Col>
                                <Col
                                  lg={1}
                                  md={1}
                                  sm={12}
                                  className="d-flex justify-content-end position-relative align-items-center"
                                >
                                  <img
                                    src={redcrossIcon}
                                    width="23px"
                                    height="23px"
                                    className={styles["Cross_icon_class"]}
                                    onClick={() => {
                                      HandleCancelFunction(index);
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        ) : (
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <Row className="mt-2">
                                <Col lg={4} md={4} sm={12}>
                                  <Select
                                    value={data.value}
                                    isSearchable={false}
                                  />
                                </Col>
                                <Col
                                  lg={4}
                                  md={4}
                                  sm={12}
                                  className="timePicker"
                                >
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
                                <Col
                                  lg={3}
                                  md={3}
                                  sm={12}
                                  className="d-flex justify-content-start"
                                >
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
                                <Col
                                  lg={1}
                                  md={1}
                                  sm={12}
                                  className="d-flex justify-content-end position-relative align-items-center"
                                >
                                  <img
                                    src={redcrossIcon}
                                    width="23px"
                                    height="23px"
                                    className={styles["Cross_icon_class"]}
                                    onClick={() => {
                                      HandleCancelFunction(index);
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        )}
                      </>
                    );
                  })
                : null}
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12}>
              <Button
                text={
                  <>
                    <Row className="mt-1">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center gap-2 align-items-center"
                      >
                        <img
                          src={plusFaddes}
                          width="15.87px"
                          height="15.87px"
                        />
                        <span className={styles["Add_dates_label"]}>
                          {t("Add-dates")}
                        </span>
                      </Col>
                    </Row>
                  </>
                }
                className={styles["Add_Dates_Btn_Class"]}
                onClick={addRow}
              />
            </Col>
          </Row>
        </Col>
        {/* Second Half */}
        <Col lg={4} md={4} sm={12}></Col>
      </Row>
    </section>
  );
};

export default MeetingDetails;
