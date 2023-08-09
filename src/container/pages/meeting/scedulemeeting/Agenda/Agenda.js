import React, { useState } from "react";
import styles from "./Agenda.module.css";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Table,
  TextField,
  Loader,
  Notification,
} from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { Radio } from "antd";
import { useDispatch } from "react-redux";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import desh from "../../../../../assets/images/desh.svg";
import dropmdownblack from "../../../../../assets/images/dropdownblack.svg";
import { useNavigate } from "react-router-dom";
import { message, Upload } from "antd";
import Lock from "../../../../../assets/images/LOCK.svg";
import featherupload from "../../../../../assets/images/featherupload.svg";
import DrapDropIcon from "../../../../../assets/images/DrapDropIcon.svg";
import Key from "../../../../../assets/images/KEY.svg";
import plusFaddes from "../../../../../assets/images/PlusFadded.svg";
import Cast from "../../../../../assets/images/CAST.svg";
import profile from "../../../../../assets/images/newprofile.png";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import line from "../../../../../assets/images/LineAgenda.svg";
const Agenda = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Dragger } = Upload;
  const [value, setValue] = useState(1);
  const [subValue, setSubValue] = useState(1);
  const [expand, setExpand] = useState(true);
  const [subExpand, setSubExpand] = useState(true);
  const [expandIndex, setExpandIndex] = useState(0);
  const [subAjendaRowIndex, setsubAjendaRowIndex] = useState(0);
  const [subexpandIndex, setsubexpandIndex] = useState(0);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [rows, setRows] = useState([
    { title: null, selectedOption: null, startDate: null, endDate: null },
  ]);

  const [subAjendaRows, setSubAjendaRows] = useState([
    {
      subAjendaTitle: null,
      subajendaOptions: null,
      subAjendaStartDate: null,
      subAjendaEndDate: null,
    },
  ]);
  const onChange = (e) => {
    console.log("radiochecked", e.target.value);
    setValue(e.target.value);
  };

  const subAjendaonChange = (e) => {
    console.log("subAjendaonChange", e.target.value);
    setSubValue(e.target.value);
  };
  const props = {
    name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { status } = data.file;
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    customRequest() {},
  };
  const options = [
    {
      value: "chocolate",
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-2 align-items-center"
            >
              <img
                src={profile}
                width="17px"
                height="17px"
                className={styles["Image_class_Agenda"]}
              />
              <span className={styles["Name_Class"]}>Oliver Davis</span>
            </Col>
          </Row>
        </>
      ),
    },
  ];
  const handleExpandedBtn = (index) => {
    console.log(index, "recordrecordrecordrecord");
    setExpandIndex(index);
    setExpand(!expand);
  };
  const addRow = () => {
    setRows([
      ...rows,
      { title: null, selectedOption: null, startDate: null, endDate: null },
    ]);
  };

  const addSubAjendaRows = (index) => {
    setSubAjendaRows([
      ...subAjendaRows,
      {
        subAjendaTitle: null,
        subajendaOptions: null,
        subAjendaStartDate: null,
        subAjendaEndDate: null,
      },
    ]);
    setsubAjendaRowIndex(index);
  };

  const handleCrossIcon = (index) => {
    let optionscross = [...rows];
    optionscross.splice(index, 1);
    setRows(optionscross);
  };

  const handleCrossSubAjenda = (index) => {
    let optionscross = [...subAjendaRows];
    optionscross.splice(index, 1);
    setSubAjendaRows(optionscross);
  };

  const handleSubMenuExpand = (index) => {
    setsubexpandIndex(index);
    setSubExpand(!subExpand);
  };
  console.log(rows, "rowsrowsrowsrowsrowsrows");
  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["Scroller_Agenda"]}>
          {rows.length > 0
            ? rows.map((data, index) => {
                return (
                  <>
                    {index ? (
                      <>
                        <Row className="mt-4 m-0 p-0">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={styles["BackGround_Agenda"]}
                            key={index}
                          >
                            <Row className="mt-2 mb-2">
                              <Col lg={5} md={5} sm={12}>
                                <TextField
                                  applyClass={"AgendaTextField"}
                                  labelClass={"d-none"}
                                  placeholder={t("Agenda-title")}
                                  value={rows.title}
                                />
                              </Col>
                              <Col lg={3} md={3} sm={12}>
                                <Select
                                  options={options}
                                  value={rows.selectedOption}
                                />
                              </Col>
                              <Col
                                sm={12}
                                md={4}
                                lg={4}
                                className="d-flex gap-4 justify-content-start align-items-center"
                              >
                                <DatePicker
                                  arrowClassName="arrowClass"
                                  containerClassName="containerClassTimePicker"
                                  className="timePicker"
                                  disableDayPicker
                                  inputClass="inputTImeMeeting"
                                  format="HH:mm A"
                                  selected={rows.startDate}
                                  plugins={[<TimePicker hideSeconds />]}
                                />
                                <img src={desh} width="19.02px" />
                                <DatePicker
                                  arrowClassName="arrowClass"
                                  containerClassName="containerClassTimePicker"
                                  className="timePicker"
                                  disableDayPicker
                                  inputClass="inputTImeMeeting"
                                  format="HH:mm A"
                                  selected={rows.endDate}
                                  plugins={[<TimePicker hideSeconds />]}
                                />
                                <img
                                  src={dropmdownblack}
                                  width="18.4px"
                                  height="9.2px"
                                  className="cursor-pointer"
                                  onClick={() => {
                                    handleExpandedBtn(index);
                                  }}
                                />
                                <img
                                  src={redcrossIcon}
                                  height="25px"
                                  width="25px"
                                  className={styles["RedCross_Icon_class"]}
                                  onClick={() => {
                                    handleCrossIcon(index);
                                  }}
                                />
                              </Col>
                            </Row>
                            {expandIndex === index && expand === true ? (
                              <>
                                <Row className="mt-3">
                                  <Col lg={12} md={12} sm={12}>
                                    <span className={styles["Agenda_Heading"]}>
                                      {t("Attachments")}
                                    </span>
                                  </Col>
                                </Row>
                                <Row className="mt-3">
                                  <Col lg={6} md={6} sm={6}>
                                    <Radio.Group
                                      onChange={onChange}
                                      value={value}
                                    >
                                      <Radio value={1}>
                                        <span
                                          className={
                                            styles["Radio_Button_options"]
                                          }
                                        >
                                          {t("Document")}
                                        </span>
                                      </Radio>
                                      <Radio value={2}>
                                        <span
                                          className={
                                            styles["Radio_Button_options"]
                                          }
                                        >
                                          {t("URL")}
                                        </span>
                                      </Radio>
                                      <Radio value={3}>
                                        <span
                                          className={
                                            styles["Radio_Button_options"]
                                          }
                                        >
                                          {t("Request from contributor")}
                                        </span>
                                      </Radio>
                                    </Radio.Group>
                                  </Col>
                                  <Col
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    className="d-flex justify-content-end gap-4 align-items-center"
                                  >
                                    <img
                                      src={Key}
                                      width="24.07px"
                                      height="24.09px"
                                    />
                                    <img
                                      src={Cast}
                                      width="25.85px"
                                      height="25.89px"
                                    />
                                    <img
                                      src={Lock}
                                      width="18.87px"
                                      height="26.72px"
                                    />
                                  </Col>
                                </Row>
                                {value === 1 ? (
                                  <>
                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        Hello I am Documents
                                      </Col>
                                    </Row>
                                  </>
                                ) : (
                                  <>
                                    <Row className="mt-4 mb-2">
                                      <Col lg={12} md={12} sm={12}>
                                        <Dragger
                                          {...props}
                                          className={
                                            styles[
                                              "dragdrop_attachment_create_resolution"
                                            ]
                                          }
                                        >
                                          <Row>
                                            <Col
                                              lg={5}
                                              md={5}
                                              sm={12}
                                              className="d-flex justify-content-end align-items-center"
                                            >
                                              <img
                                                src={DrapDropIcon}
                                                width={100}
                                                className={styles["ClassImage"]}
                                              />
                                            </Col>
                                            <Col lg={7} md={7} sm={12}>
                                              <Row className="mt-3">
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className="d-flex justify-content-start"
                                                >
                                                  <span
                                                    className={
                                                      styles[
                                                        "ant-upload-text-Meetings"
                                                      ]
                                                    }
                                                  >
                                                    {t("Drag-file-here")}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className="d-flex justify-content-start"
                                                >
                                                  <span
                                                    className={
                                                      styles[
                                                        "Choose_file_style-Meeting"
                                                      ]
                                                    }
                                                  >
                                                    {t(
                                                      "The-following-file-formats-are"
                                                    )}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className="d-flex justify-content-start"
                                                >
                                                  <span
                                                    className={
                                                      styles[
                                                        "Choose_file_style-Meeting"
                                                      ]
                                                    }
                                                  >
                                                    {t(
                                                      "Docx-ppt-pptx-xls-xlsx-jpeg-jpg-and-png"
                                                    )}
                                                  </span>
                                                </Col>
                                              </Row>
                                            </Col>
                                          </Row>
                                        </Dragger>
                                      </Col>
                                    </Row>
                                  </>
                                )}
                              </>
                            ) : null}
                          </Col>
                        </Row>
                        {/* subajenda Coloumns */}
                        {subAjendaRows.length > 0
                          ? subAjendaRows.map((data, index) => {
                              return (
                                <>
                                  {index >= 0 ? (
                                    <>
                                      <Row className="mt-3">
                                        <Col lg={1} md={1} sm={1}></Col>
                                        <Col
                                          lg={11}
                                          md={11}
                                          sm={11}
                                          className={styles["SubajendaBox"]}
                                        >
                                          <Row className="mt-2 mb-2">
                                            <Col lg={5} md={5} sm={12}>
                                              <TextField
                                                applyClass={"AgendaTextField"}
                                                labelClass={"d-none"}
                                                placeholder={t(
                                                  "Sub-Agenda-title"
                                                )}
                                                value={
                                                  subAjendaRows.subAjendaTitle
                                                }
                                              />
                                            </Col>
                                            <Col lg={3} md={3} sm={12}>
                                              <Select
                                                value={
                                                  subAjendaRows.subajendaOptions
                                                }
                                              />
                                            </Col>
                                            <Col
                                              sm={12}
                                              md={4}
                                              lg={4}
                                              className="d-flex gap-4 justify-content-start align-items-center"
                                            >
                                              <DatePicker
                                                arrowClassName="arrowClass"
                                                containerClassName="containerClassTimePicker"
                                                className="timePicker"
                                                disableDayPicker
                                                inputClass="inputTImeMeeting"
                                                format="HH:mm A"
                                                selected={
                                                  subAjendaRows.subAjendaStartDate
                                                }
                                                plugins={[
                                                  <TimePicker hideSeconds />,
                                                ]}
                                              />
                                              <img src={desh} width="19.02px" />
                                              <DatePicker
                                                arrowClassName="arrowClass"
                                                containerClassName="containerClassTimePicker"
                                                className="timePicker"
                                                disableDayPicker
                                                inputClass="inputTImeMeeting"
                                                format="HH:mm A"
                                                selected={
                                                  subAjendaRows.subAjendaEndDate
                                                }
                                                plugins={[
                                                  <TimePicker hideSeconds />,
                                                ]}
                                              />
                                              <img
                                                src={dropmdownblack}
                                                width="18.4px"
                                                height="9.2px"
                                                className="cursor-pointer"
                                                onClick={() => {
                                                  handleSubMenuExpand(index);
                                                }}
                                              />
                                              <img
                                                src={redcrossIcon}
                                                height="25px"
                                                width="25px"
                                                className={
                                                  styles["RedCross_Icon_class"]
                                                }
                                                onClick={() => {
                                                  handleCrossSubAjenda(index);
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                          {/* Condition for Subajencda */}
                                          {subexpandIndex === index &&
                                          subExpand === true ? (
                                            <>
                                              <Row className="mt-3">
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles["Agenda_Heading"]
                                                    }
                                                  >
                                                    {t("Attachments")}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row className="mt-3">
                                                <Col lg={6} md={6} sm={6}>
                                                  <Radio.Group
                                                    onChange={subAjendaonChange}
                                                    value={subValue}
                                                  >
                                                    <Radio value={1}>
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t("Document")}
                                                      </span>
                                                    </Radio>
                                                    <Radio value={2}>
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t("URL")}
                                                      </span>
                                                    </Radio>
                                                    <Radio value={3}>
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t(
                                                          "Request from contributor"
                                                        )}
                                                      </span>
                                                    </Radio>
                                                  </Radio.Group>
                                                </Col>
                                                <Col
                                                  lg={6}
                                                  md={6}
                                                  sm={6}
                                                  className="d-flex justify-content-end gap-4 align-items-center"
                                                >
                                                  <img
                                                    src={Key}
                                                    width="24.07px"
                                                    height="24.09px"
                                                  />
                                                  <img
                                                    src={Cast}
                                                    width="25.85px"
                                                    height="25.89px"
                                                  />
                                                  <img
                                                    src={Lock}
                                                    width="18.87px"
                                                    height="26.72px"
                                                  />
                                                </Col>
                                              </Row>
                                              <Row className="mt-4 mb-2">
                                                <Col lg={12} md={12} sm={12}>
                                                  <Dragger
                                                    {...props}
                                                    className={
                                                      styles[
                                                        "dragdrop_attachment_create_resolution"
                                                      ]
                                                    }
                                                  >
                                                    <Row>
                                                      <Col
                                                        lg={5}
                                                        md={5}
                                                        sm={12}
                                                        className="d-flex justify-content-end align-items-center"
                                                      >
                                                        <img
                                                          src={DrapDropIcon}
                                                          width={100}
                                                          className={
                                                            styles["ClassImage"]
                                                          }
                                                        />
                                                      </Col>
                                                      <Col
                                                        lg={7}
                                                        md={7}
                                                        sm={12}
                                                      >
                                                        <Row className="mt-3">
                                                          <Col
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            className="d-flex justify-content-start"
                                                          >
                                                            <span
                                                              className={
                                                                styles[
                                                                  "ant-upload-text-Meetings"
                                                                ]
                                                              }
                                                            >
                                                              {t(
                                                                "Drag-file-here"
                                                              )}
                                                            </span>
                                                          </Col>
                                                        </Row>
                                                        <Row>
                                                          <Col
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            className="d-flex justify-content-start"
                                                          >
                                                            <span
                                                              className={
                                                                styles[
                                                                  "Choose_file_style-Meeting"
                                                                ]
                                                              }
                                                            >
                                                              {t(
                                                                "The-following-file-formats-are"
                                                              )}
                                                            </span>
                                                          </Col>
                                                        </Row>
                                                        <Row>
                                                          <Col
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            className="d-flex justify-content-start"
                                                          >
                                                            <span
                                                              className={
                                                                styles[
                                                                  "Choose_file_style-Meeting"
                                                                ]
                                                              }
                                                            >
                                                              {t(
                                                                "Docx-ppt-pptx-xls-xlsx-jpeg-jpg-and-png"
                                                              )}
                                                            </span>
                                                          </Col>
                                                        </Row>
                                                      </Col>
                                                    </Row>
                                                  </Dragger>
                                                </Col>
                                              </Row>
                                            </>
                                          ) : null}
                                        </Col>
                                      </Row>
                                      ;
                                    </>
                                  ) : null}
                                </>
                              );
                            })
                          : null}

                        {/* sub Ajenda Button */}
                        <Row className="mt-3">
                          <Col lg={12} md={12} sm={12}>
                            <Button
                              text={
                                <>
                                  <Row>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="d-flex justify-content-center gap-2 align-items-center"
                                    >
                                      <img
                                        src={plusFaddes}
                                        height="10.77px"
                                        width="10.77px"
                                      />
                                      <span
                                        className={styles["Add_Agen_Heading"]}
                                      >
                                        {t("Add-sub-agenda")}
                                      </span>
                                    </Col>
                                  </Row>
                                </>
                              }
                              className={styles["AddMoreBtnAgenda"]}
                              onClick={() => {
                                addSubAjendaRows(index);
                              }}
                            />
                          </Col>
                        </Row>

                        <Row className="mt-3">
                          <Col lg={12} md={12} sm={12}>
                            <img src={line} width="1249px" />
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <>
                        {/* Second One */}

                        <Row className="mt-4 m-0 p-0">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={styles["BackGround_Agenda"]}
                          >
                            <Row className="mt-2 mb-2">
                              <Col lg={5} md={5} sm={12}>
                                <TextField
                                  applyClass={"AgendaTextField"}
                                  labelClass={"d-none"}
                                  placeholder={t("Agenda-title")}
                                />
                              </Col>
                              <Col lg={3} md={3} sm={12}>
                                <Select options={options} />
                              </Col>
                              <Col
                                sm={12}
                                md={4}
                                lg={4}
                                className="d-flex gap-4 justify-content-start align-items-center"
                              >
                                <DatePicker
                                  arrowClassName="arrowClass"
                                  containerClassName="containerClassTimePicker"
                                  className="timePicker"
                                  disableDayPicker
                                  inputClass="inputTImeMeeting"
                                  format="HH:mm A"
                                  plugins={[<TimePicker hideSeconds />]}
                                />
                                <img src={desh} width="19.02px" />
                                <DatePicker
                                  arrowClassName="arrowClass"
                                  containerClassName="containerClassTimePicker"
                                  className="timePicker"
                                  disableDayPicker
                                  inputClass="inputTImeMeeting"
                                  format="HH:mm A"
                                  plugins={[<TimePicker hideSeconds />]}
                                />
                                <img
                                  src={dropmdownblack}
                                  width="18.4px"
                                  height="9.2px"
                                  className="cursor-pointer"
                                  onClick={handleExpandedBtn}
                                />
                                {/* <img
                                  src={redcrossIcon}
                                  height="25px"
                                  width="25px"
                                  className={styles["RedCross_Icon_class"]}
                                /> */}
                              </Col>
                            </Row>
                            {expandIndex === index && expand === true ? (
                              <>
                                <Row className="mt-3">
                                  <Col lg={12} md={12} sm={12}>
                                    <span className={styles["Agenda_Heading"]}>
                                      {t("Attachments")}
                                    </span>
                                  </Col>
                                </Row>
                                <Row className="mt-3">
                                  <Col lg={6} md={6} sm={6}>
                                    <Radio.Group
                                      onChange={onChange}
                                      value={value}
                                    >
                                      <Radio value={1}>
                                        <span
                                          className={
                                            styles["Radio_Button_options"]
                                          }
                                        >
                                          {t("Document")}
                                        </span>
                                      </Radio>
                                      <Radio value={2}>
                                        <span
                                          className={
                                            styles["Radio_Button_options"]
                                          }
                                        >
                                          {t("URL")}
                                        </span>
                                      </Radio>
                                      <Radio value={3}>
                                        <span
                                          className={
                                            styles["Radio_Button_options"]
                                          }
                                        >
                                          {t("Request from contributor")}
                                        </span>
                                      </Radio>
                                    </Radio.Group>
                                  </Col>
                                  <Col
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    className="d-flex justify-content-end gap-4 align-items-center"
                                  >
                                    <img
                                      src={Key}
                                      width="24.07px"
                                      height="24.09px"
                                    />
                                    <img
                                      src={Cast}
                                      width="25.85px"
                                      height="25.89px"
                                    />
                                    <img
                                      src={Lock}
                                      width="18.87px"
                                      height="26.72px"
                                    />
                                  </Col>
                                </Row>
                                {value === 1 ? (
                                  <>
                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <div
                                          className={styles["Documentdiv"]}
                                        ></div>
                                      </Col>
                                    </Row>
                                  </>
                                ) : (
                                  <>
                                    <Row className="mt-4 mb-2">
                                      <Col lg={12} md={12} sm={12}>
                                        <Dragger
                                          {...props}
                                          className={
                                            styles[
                                              "dragdrop_attachment_create_resolution"
                                            ]
                                          }
                                        >
                                          <Row>
                                            <Col
                                              lg={5}
                                              md={5}
                                              sm={12}
                                              className="d-flex justify-content-end align-items-center"
                                            >
                                              <img
                                                src={DrapDropIcon}
                                                width={100}
                                                className={styles["ClassImage"]}
                                              />
                                            </Col>
                                            <Col lg={7} md={7} sm={12}>
                                              <Row className="mt-3">
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className="d-flex justify-content-start"
                                                >
                                                  <span
                                                    className={
                                                      styles[
                                                        "ant-upload-text-Meetings"
                                                      ]
                                                    }
                                                  >
                                                    {t("Drag-file-here")}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className="d-flex justify-content-start"
                                                >
                                                  <span
                                                    className={
                                                      styles[
                                                        "Choose_file_style-Meeting"
                                                      ]
                                                    }
                                                  >
                                                    {t(
                                                      "The-following-file-formats-are"
                                                    )}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className="d-flex justify-content-start"
                                                >
                                                  <span
                                                    className={
                                                      styles[
                                                        "Choose_file_style-Meeting"
                                                      ]
                                                    }
                                                  >
                                                    {t(
                                                      "Docx-ppt-pptx-xls-xlsx-jpeg-jpg-and-png"
                                                    )}
                                                  </span>
                                                </Col>
                                              </Row>
                                            </Col>
                                          </Row>
                                        </Dragger>
                                      </Col>
                                    </Row>
                                  </>
                                )}
                              </>
                            ) : null}
                          </Col>
                        </Row>
                        {/* subajenda Coloumns */}
                        {subAjendaRows.length > 0
                          ? subAjendaRows.map(() => {
                              return (
                                <>
                                  {index >= 0 ? (
                                    <>
                                      <Row className="mt-3">
                                        <Col lg={1} md={1} sm={1}></Col>
                                        <Col
                                          lg={11}
                                          md={11}
                                          sm={11}
                                          className={styles["SubajendaBox"]}
                                        >
                                          <Row className="mt-2 mb-2">
                                            <Col lg={5} md={5} sm={12}>
                                              <TextField
                                                applyClass={"AgendaTextField"}
                                                labelClass={"d-none"}
                                                placeholder={t(
                                                  "Sub-Agenda-title"
                                                )}
                                              />
                                            </Col>
                                            <Col lg={3} md={3} sm={12}>
                                              <Select />
                                            </Col>
                                            <Col
                                              sm={12}
                                              md={4}
                                              lg={4}
                                              className="d-flex gap-4 justify-content-start align-items-center"
                                            >
                                              <DatePicker
                                                arrowClassName="arrowClass"
                                                containerClassName="containerClassTimePicker"
                                                className="timePicker"
                                                disableDayPicker
                                                inputClass="inputTImeMeeting"
                                                format="HH:mm A"
                                                plugins={[
                                                  <TimePicker hideSeconds />,
                                                ]}
                                              />
                                              <img src={desh} width="19.02px" />
                                              <DatePicker
                                                arrowClassName="arrowClass"
                                                containerClassName="containerClassTimePicker"
                                                className="timePicker"
                                                disableDayPicker
                                                inputClass="inputTImeMeeting"
                                                format="HH:mm A"
                                                plugins={[
                                                  <TimePicker hideSeconds />,
                                                ]}
                                              />
                                              <img
                                                src={dropmdownblack}
                                                width="18.4px"
                                                height="9.2px"
                                                className="cursor-pointer"
                                                onClick={() => {
                                                  handleSubMenuExpand(index);
                                                }}
                                              />
                                              <img
                                                src={redcrossIcon}
                                                height="25px"
                                                width="25px"
                                                className={
                                                  styles["RedCross_Icon_class"]
                                                }
                                                onClick={() => {
                                                  handleCrossSubAjenda(index);
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                          {/* Condition for Subajencda */}
                                          {subexpandIndex === index &&
                                          subExpand === true ? (
                                            <>
                                              <Row className="mt-3">
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles["Agenda_Heading"]
                                                    }
                                                  >
                                                    {t("Attachments")}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row className="mt-3">
                                                <Col lg={6} md={6} sm={6}>
                                                  <Radio.Group
                                                    onChange={subAjendaonChange}
                                                    value={subValue}
                                                  >
                                                    <Radio value={1}>
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t("Document")}
                                                      </span>
                                                    </Radio>
                                                    <Radio value={2}>
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t("URL")}
                                                      </span>
                                                    </Radio>
                                                    <Radio value={3}>
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t(
                                                          "Request from contributor"
                                                        )}
                                                      </span>
                                                    </Radio>
                                                  </Radio.Group>
                                                </Col>
                                                <Col
                                                  lg={6}
                                                  md={6}
                                                  sm={6}
                                                  className="d-flex justify-content-end gap-4 align-items-center"
                                                >
                                                  <img
                                                    src={Key}
                                                    width="24.07px"
                                                    height="24.09px"
                                                  />
                                                  <img
                                                    src={Cast}
                                                    width="25.85px"
                                                    height="25.89px"
                                                  />
                                                  <img
                                                    src={Lock}
                                                    width="18.87px"
                                                    height="26.72px"
                                                  />
                                                </Col>
                                              </Row>
                                              <Row className="mt-4 mb-2">
                                                <Col lg={12} md={12} sm={12}>
                                                  <Dragger
                                                    {...props}
                                                    className={
                                                      styles[
                                                        "dragdrop_attachment_create_resolution"
                                                      ]
                                                    }
                                                  >
                                                    <Row>
                                                      <Col
                                                        lg={5}
                                                        md={5}
                                                        sm={12}
                                                        className="d-flex justify-content-end align-items-center"
                                                      >
                                                        <img
                                                          src={DrapDropIcon}
                                                          width={100}
                                                          className={
                                                            styles["ClassImage"]
                                                          }
                                                        />
                                                      </Col>
                                                      <Col
                                                        lg={7}
                                                        md={7}
                                                        sm={12}
                                                      >
                                                        <Row className="mt-3">
                                                          <Col
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            className="d-flex justify-content-start"
                                                          >
                                                            <span
                                                              className={
                                                                styles[
                                                                  "ant-upload-text-Meetings"
                                                                ]
                                                              }
                                                            >
                                                              {t(
                                                                "Drag-file-here"
                                                              )}
                                                            </span>
                                                          </Col>
                                                        </Row>
                                                        <Row>
                                                          <Col
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            className="d-flex justify-content-start"
                                                          >
                                                            <span
                                                              className={
                                                                styles[
                                                                  "Choose_file_style-Meeting"
                                                                ]
                                                              }
                                                            >
                                                              {t(
                                                                "The-following-file-formats-are"
                                                              )}
                                                            </span>
                                                          </Col>
                                                        </Row>
                                                        <Row>
                                                          <Col
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            className="d-flex justify-content-start"
                                                          >
                                                            <span
                                                              className={
                                                                styles[
                                                                  "Choose_file_style-Meeting"
                                                                ]
                                                              }
                                                            >
                                                              {t(
                                                                "Docx-ppt-pptx-xls-xlsx-jpeg-jpg-and-png"
                                                              )}
                                                            </span>
                                                          </Col>
                                                        </Row>
                                                      </Col>
                                                    </Row>
                                                  </Dragger>
                                                </Col>
                                              </Row>
                                            </>
                                          ) : null}
                                        </Col>
                                      </Row>
                                    </>
                                  ) : null}
                                </>
                              );
                            })
                          : null}

                        {/* sub Ajenda Button */}
                        <Row className="mt-3">
                          <Col lg={12} md={12} sm={12}>
                            <Button
                              text={
                                <>
                                  <Row>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="d-flex justify-content-center gap-2 align-items-center"
                                    >
                                      <img
                                        src={plusFaddes}
                                        height="10.77px"
                                        width="10.77px"
                                      />
                                      <span
                                        className={styles["Add_Agen_Heading"]}
                                      >
                                        {t("Add-sub-agenda")}
                                      </span>
                                    </Col>
                                  </Row>
                                </>
                              }
                              className={styles["AddMoreBtnAgenda"]}
                              onClick={() => {
                                addSubAjendaRows(index);
                              }}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col lg={12} md={12} sm={12}>
                            <img src={line} width="1249px" />
                          </Col>
                        </Row>
                      </>
                    )}
                  </>
                );
              })
            : null}
        </Col>
      </Row>

      <Row className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <Button
            text={
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center gap-2 align-items-center"
                  >
                    <img src={plusFaddes} height="10.77px" width="10.77px" />
                    <span className={styles["Add_Agen_Heading"]}>
                      {t("Add-agenda")}
                    </span>
                  </Col>
                </Row>
              </>
            }
            className={styles["AddMoreBtnAgenda"]}
            onClick={addRow}
          />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={t("Import-previous-agenda")}
            className={styles["Agenda_Buttons"]}
          />
          <Button text={t("Cancel")} className={styles["Agenda_Buttons"]} />
          <Button
            text={t("Save-and-Next")}
            className={styles["Save_Agenda_btn"]}
          />
        </Col>
      </Row>
    </section>
  );
};

export default Agenda;
