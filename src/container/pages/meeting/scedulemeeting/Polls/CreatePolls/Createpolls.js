import React, { useState } from "react";
import styles from "./CreatePolls.module.css";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import {
  Button,
  TextField,
  Checkbox,
} from "../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { regexOnlyForNumberNCharacters } from "../../../../../../commen/functions/regex";
import WhiteCrossIcon from "../../../../../../assets/images/PollCrossIcon.svg";
import plusFaddes from "../../../../../../assets/images/NewBluePLus.svg";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useRef } from "react";
import moment from "moment";
import InputIcon from "react-multi-date-picker/components/input_icon";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Profile from "../../../../../../assets/images/newprofile.png";
import RedCross from "../../../../../../assets/images/CrossIcon.svg";

const Createpolls = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const { NewMeetingreducer } = useSelector((state) => state);
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();

  const [options, setOptions] = useState([
    {
      name: 1,
      value: "",
    },
    {
      name: 2,
      value: "",
    },
    {
      name: 3,
      value: "",
    },
  ]);

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  const [members, setMembers] = useState([
    {
      name: "SAIF UL ISLAM",
    },
    {
      name: "SAIF UL ISLAM",
    },
    {
      name: "SAIF UL ISLAM",
    },
    {
      name: "SAIF UL ISLAM",
    },
    {
      name: "SAIF UL ISLAM",
    },
    {
      name: "SAIF UL ISLAM",
    },
    {
      name: "SAIF UL ISLAM",
    },
    {
      name: "SAIF UL ISLAM",
    },
  ]);

  const HandleCancelFunction = (index) => {
    let optionscross = [...options];
    optionscross.splice(index, 1);
    setOptions(optionscross);
  };

  const HandleOptionChange = (e) => {
    let name = parseInt(e.target.name);
    let newValue = e.target.value;
    let valueCheck = regexOnlyForNumberNCharacters(newValue);
    setOptions((prevState) =>
      prevState.map((item) => {
        return item.name === name ? { ...item, value: valueCheck } : item;
      })
    );
  };

  const allValuesNotEmpty = options.every((item) => item.value !== "");

  const addNewRow = () => {
    console.log("iam clicked");
    if (options.length > 1) {
      if (allValuesNotEmpty) {
        let lastIndex = options.length - 1;
        if (options[lastIndex].value != "") {
          const randomNumber = Math.floor(Math.random() * 100) + 1;
          let newOptions = { name: randomNumber, value: "" };
          setOptions([...options, newOptions]);
        }
      } else {
        setOpen({
          flag: true,
          message: t("Please-fill-options"),
        });
      }
    } else {
      setOpen({
        flag: true,
        message: t("Please-fill-options"),
      });
    }
  };

  return (
    <section>
      <Row>
        <Col lg={6} md={6} sm={6}>
          <Row className="mt-5">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Title_heading"]}>
                {t("Title")} <span className={styles["steric"]}>*</span>
              </span>
            </Col>
          </Row>
          <Row className="mt-1">
            <Col lg={12} md={12} sm={12}>
              <TextField labelClass={"d-none"} />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Title_heading"]}>
                {t("Options")} <span className={styles["steric"]}>*</span>
              </span>
            </Col>
          </Row>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className={styles["Scroller_Meeting_polls"]}
            >
              {options.length > 0
                ? options.map((data, index) => {
                    return (
                      <>
                        {index <= 1 ? (
                          <Row key={index} className="mt-2">
                            <Col lg={12} md={12} sm={12}>
                              <span className="position-relative">
                                <TextField
                                  placeholder={
                                    "Option" + " " + parseInt(index + 1)
                                  }
                                  applyClass={"PollingCreateModal"}
                                  labelClass="d-none"
                                  name={data.name}
                                  maxLength={500}
                                  value={data.value}
                                  change={(e) => HandleOptionChange(e)}
                                />
                              </span>
                            </Col>
                          </Row>
                        ) : (
                          <Row key={index} className="mt-2">
                            <Col lg={12} md={12} sm={12}>
                              <span className="position-relative">
                                <TextField
                                  placeholder={
                                    "Option" + " " + parseInt(index + 1)
                                  }
                                  applyClass={"PollingCreateModal"}
                                  labelClass="d-none"
                                  name={data.name}
                                  value={data.value}
                                  maxLength={500}
                                  change={(e) => HandleOptionChange(e)}
                                  inputicon={
                                    <img
                                      src={WhiteCrossIcon}
                                      width="31.76px"
                                      height="31.76px"
                                      onClick={() =>
                                        HandleCancelFunction(index)
                                      }
                                      className={
                                        styles["Cross-icon-Create_poll"]
                                      }
                                    />
                                  }
                                  iconClassName={
                                    styles["polling_Options_backGround"]
                                  }
                                />
                              </span>
                            </Col>
                          </Row>
                        )}
                      </>
                    );
                  })
                : null}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <Button
                text={
                  <>
                    <Row>
                      <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                        <img
                          src={plusFaddes}
                          width="15.87px"
                          height="15.87px"
                        />
                        <span className={styles["Add_Button_Heading"]}>
                          {t("Add-another-field")}
                        </span>
                      </Col>
                    </Row>
                  </>
                }
                onClick={addNewRow}
                className={styles["Add_another_options"]}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col lg={6} md={6} sm={6} className="d-flex align-items-center">
              <DatePicker
                format={"DD/MM/YYYY"}
                minDate={moment().toDate()}
                placeholder="DD/MM/YYYY"
                render={
                  <InputIcon
                    placeholder="DD/MM/YYYY"
                    className="datepicker_input"
                  />
                }
                editable={false}
                className="datePickerTodoCreate2"
                onOpenPickNewDate={false}
                inputMode=""
                calendar={calendarValue}
                locale={localValue}
                ref={calendRef}
              />
            </Col>
            <Col lg={6} md={6} sm={6}>
              <Row className="mt-2">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex align-items-center gap-2"
                >
                  <Checkbox />
                  <p className={styles["CheckBoxTitle"]}>
                    {t("Allow-multiple-answers")}
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={6} sm={6}>
          <Row>
            <Col lg={12} md={12} sm={12} className={styles["MarginSection"]}>
              <Row className="mt-5">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="group-fields d-flex align-items-center gap-2"
                >
                  <Select
                    classNamePrefix={"Polls_Meeting"}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                  />
                  <Button
                    text={t("ADD")}
                    className={styles["ADD_Btn_CreatePool_Modal"]}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} className={styles["Scroller_Members"]}>
              <Row>
                {members.length > 0
                  ? members.map((data, index) => {
                      return (
                        <>
                          <Col lg={6} md={6} sm={6} className="mt-3">
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <section
                                  className={styles["Outer_Box_Members"]}
                                >
                                  <Row className="mt-2">
                                    <Col
                                      lg={10}
                                      md={10}
                                      sm={10}
                                      className="d-flex gap-2 align-items-center"
                                    >
                                      <img
                                        src={Profile}
                                        height="33px"
                                        width="33px"
                                        className={styles["ProfileStyles"]}
                                      />
                                      <span className={styles["Name_Members"]}>
                                        {data.name}
                                      </span>
                                    </Col>
                                    <Col
                                      lg={2}
                                      md={2}
                                      sm={2}
                                      className="d-flex align-items-center"
                                    >
                                      <img
                                        src={RedCross}
                                        height="14px"
                                        width="14px"
                                        className="cursor-pointer"
                                      />
                                    </Col>
                                  </Row>
                                </section>
                              </Col>
                            </Row>
                          </Col>
                        </>
                      );
                    })
                  : null}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2"
            >
              <Button
                text={t("Cancel")}
                className={styles["Cancel_Button_Meeting_Creat_Polls"]}
              />
              <Button
                text={t("Save")}
                className={styles["Save_Button_Meeting_Creat_Polls"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default Createpolls;
