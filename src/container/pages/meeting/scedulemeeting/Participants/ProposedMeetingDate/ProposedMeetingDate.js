import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import styles from "./ProposedMeetingDate.module.css";
import { Button, Checkbox } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import BackArrow from "../../../../../../assets/images/Back Arrow.svg";
import redcrossIcon from "../../../../../../assets/images/Artboard 9.png";
import DatePicker from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { DateObject } from "react-multi-date-picker";
import plusFaddes from "../../../../../../assets/images/BluePlus.svg";
import desh from "../../../../../../assets/images/desh.svg";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useDispatch, useSelector } from "react-redux";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import moment from "moment";
import { style } from "@mui/system";
import UnsavedModal from "./UnsavedChangesModal/UnsavedModal";
import { showPrposedMeetingUnsavedModal } from "../../../../../../store/actions/NewMeetingActions";
const ProposedMeetingDate = ({ setProposedMeetingDates }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendRef = useRef();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const { NewMeetingreducer } = useSelector((state) => state);
  const [error, seterror] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [endDateError, setEndDateError] = useState(false);
  const [sendDates, setSendDates] = useState(false);
  const [options, setOptions] = useState([]);
  const [rows, setRows] = useState([
    { selectedOption: "", startDate: "", endDate: "" },
  ]);

  console.log(rows[0].selectedOption, "selectedOptionselectedOption");
  console.log(rows[0].startDate, "selectedOptionselectedOption");
  console.log(rows[0].endDate, "selectedOptionselectedOption");

  const handleStartDateChange = (index, date) => {
    const updatedRows = [...rows];
    updatedRows[index].startDate = date;
    setRows(updatedRows);
  };

  const handleEndDateChange = (index, date) => {
    const updatedRows = [...rows];
    updatedRows[index].endDate = date;
    setRows(updatedRows);
  };

  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    if (isValidRow(lastRow)) {
      setRows([...rows, { selectedOption: "", startDate: "", endDate: "" }]);
    }
  };

  const isValidRow = (row) => {
    return (
      row.selectedOption !== "" && row.startDate !== "" && row.endDate !== ""
    );
  };

  const HandleCancelFunction = (index) => {
    let optionscross = [...rows];
    optionscross.splice(index, 1);
    setRows(optionscross);
  };

  //Onchange Function For DatePicker inAdd datess First
  const changeDateStartHandler = (date, index) => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let DateDate = new Date(date);
    setMeetingDate(meetingDateValueFormat);
    const updatedRows = [...rows];
    updatedRows[index].selectedOption = DateDate;
    setRows(updatedRows);
  };

  const handleSelectChange = (index, selectedOption) => {
    const updatedRows = [...rows];
    updatedRows[index].selectedOption = selectedOption;
    setRows(updatedRows);
    setSelectError(false); // Clear the select error
  };

  const validate = () => {
    // Check if any of the fields are empty
    const hasSelectError = rows.some((row) => row.selectedOption === "");
    const hasStartDateError = rows.some((row) => row.startDate === "");
    const hasEndDateError = rows.some((row) => row.endDate === "");

    setSelectError(hasSelectError);
    setStartDateError(hasStartDateError);
    setEndDateError(hasEndDateError);
  };

  useEffect(() => {
    validate();
  }, [rows]);

  useEffect(() => {
    if (currentLanguage !== undefined) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(arabic);
        setLocalValue(arabic_ar);
      }
    }
  }, [currentLanguage]);

  const handleSend = () => {
    // States For Error Handling
    // seterror(true);
    // setSelectError(true);
    // setStartDateError(true);
    // setEndDateError(true);
    setSendDates(!sendDates);
  };

  const CancelModal = () => {
    dispatch(showPrposedMeetingUnsavedModal(true));
  };

  const handlebackButtonFunctionality = () => {
    setProposedMeetingDates(false);
  };

  return (
    <section>
      <Row className="mt-2">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex align-items-center align-items-center gap-3"
        >
          <img
            draggable={false}
            src={BackArrow}
            width="20.5px"
            height="18.13px"
            className="cursor-pointer"
            onClick={handlebackButtonFunctionality}
          />
          <span className={styles["Prposed_Meeting_heading"]}>
            {t("Propose-meeting-date")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["Paper_styling"]}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Heading_prposed_meeting"]}>
                  IT Departmental Meeting lorem. Aenean posuere libero vel ipsum
                  digniss IT Departmental Meeting lorem. Aenean posuere libero
                  vel ipsum digniss
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Staff_meeting_Heading"]}>
                  Staff Meeting <span>(Conference Room)</span>
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <p className={styles["Paragraph_Styles"]}>
                  Description fits in here. Proin at malesuada lorem. Aenean
                  posuere libero vel ipsum dignissim ultricies viverra non
                  tellus. Fusce aliquet finibus nisl, et hendrerit nisl
                  dignissim at. Praesent luctus rutrum lacinia. Nulla lacinia
                  feugiat sagittis. Aenean at magna aliquet, dignissim ligula
                  quis, ornare ante. Interdum et malesuada fames ac ante ipsum
                  primis in faucibus. Ut diam dui, iaculis nec dui vel, commodo
                  dapibus libero.Vivamus interdum purus sed pellentesque
                  ultricies. Nullam ut nulla libero. Nam libero urna, pharetra
                  et dignissim in, malesuada at urna. Aliquam erat volutpat.
                  Curabitur molestie congue ipsum vitae luctus. Cras sed dolor
                  eget turpis condimentum maximus et sit amet ipsum. Suspendisse
                  non nulla vitae metus tincidunt vulputate. Aenean malesuada
                  lacinia ipsum, vitae porta ex elementum ac. Nulla vestibulum
                  cursus felis, vel molestie nibh mollis sit amet. Suspendisse
                  nec dui semper, lobortis est nec, aliquet felis. Etiam sed
                  odio in diam faucibus pretium.
                </p>
              </Col>
            </Row>
            {sendDates ? (
              <>
                <Row>
                  <Col lg={4} md={4} sm={4}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Prposed_On_Heading"]}>
                          {t("Proposed-on")}
                          <span className={styles["Steric_Color"]}>*</span>
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Scroller_Prposed_Meeting_date"]}
                      >
                        <Row className="m-0 p-0 mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={styles["Box_To_Show_Time"]}
                          >
                            <Row className={styles["Inner_Send_class"]}>
                              <Col lg={10} md={10} sm={10}>
                                <span className={styles["Time_Class"]}>
                                  03:30 pm - 05:30 pm | 17th May, 2020
                                </span>
                              </Col>
                              <Col lg={2} md={2} sm={2}>
                                <Checkbox
                                  prefixCls={"ProposedMeeting_Checkbox"}
                                  classNameCheckBoxP="d-none"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="m-0 p-0 mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={styles["Box_To_Show_Time"]}
                          >
                            <Row className={styles["Inner_Send_class"]}>
                              <Col lg={10} md={10} sm={10}>
                                <span className={styles["Time_Class"]}>
                                  03:30 pm - 05:30 pm | 17th May, 2020
                                </span>
                              </Col>
                              <Col lg={2} md={2} sm={2}>
                                <Checkbox
                                  prefixCls={"ProposedMeeting_Checkbox"}
                                  classNameCheckBoxP="d-none"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="m-0 p-0 mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={styles["Box_To_Show_Time"]}
                          >
                            <Row className={styles["Inner_Send_class"]}>
                              <Col lg={10} md={10} sm={10}>
                                <span className={styles["Time_Class"]}>
                                  03:30 pm - 05:30 pm | 17th May, 2020
                                </span>
                              </Col>
                              <Col lg={2} md={2} sm={2}>
                                <Checkbox
                                  prefixCls={"ProposedMeeting_Checkbox"}
                                  classNameCheckBoxP="d-none"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="m-0 p-0 mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={styles["Box_To_Show_Time"]}
                          >
                            <Row className={styles["Inner_Send_class"]}>
                              <Col lg={10} md={10} sm={10}>
                                <span className={styles["Time_Class"]}>
                                  03:30 pm - 05:30 pm | 17th May, 2020
                                </span>
                              </Col>
                              <Col lg={2} md={2} sm={2}>
                                <Checkbox
                                  prefixCls={"ProposedMeeting_Checkbox"}
                                  classNameCheckBoxP="d-none"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Prposed_On_Heading"]}>
                          {t("Send-response-by")}{" "}
                          <span className={styles["Steric_Color"]}>*</span>
                        </span>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Date"]}>21st May, 2020</span>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    lg={2}
                    md={2}
                    sm={2}
                    className="d-flex justify-content-center mt-4"
                  >
                    <span className={styles["OR_Heading"]}>{"OR"}</span>
                  </Col>

                  <Col lg={4} md={4} sm={4}>
                    <Row className="m-0 p-0 mt-4">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Box_To_Show_Time"]}
                      >
                        <Row className={styles["Inner_Send_class"]}>
                          <Col lg={10} md={10} sm={10}>
                            <span className={styles["Time_Class"]}>
                              None of the above
                            </span>
                          </Col>
                          <Col lg={2} md={2} sm={2}>
                            <Checkbox
                              prefixCls={"ProposedMeeting_Checkbox"}
                              classNameCheckBoxP="d-none"
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col lg={8} md={8} sm={8}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Prposed_On_Heading"]}>
                          {t("Proposed-on")}{" "}
                          <span className={styles["Steric_Color"]}>*</span>
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
                        {rows.length > 0
                          ? rows.map((data, index) => {
                              return (
                                <>
                                  <Row>
                                    <Col lg={12} md={12} sm={12} key={index}>
                                      <Row className="mt-2">
                                        <Col lg={4} md={4} sm={12}>
                                          <DatePicker
                                            selected={rows.selectedOption}
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
                                            onOpenPickNewDate={true}
                                            inputMode=""
                                            calendar={calendarValue}
                                            locale={localValue}
                                            ref={calendRef}
                                            onChange={(value) =>
                                              changeDateStartHandler(
                                                value,
                                                index
                                              )
                                            }
                                          />
                                          <Row>
                                            <Col>
                                              <p
                                                className={
                                                  error &&
                                                  data.selectedOption === ""
                                                    ? ` ${styles["errorMessage-inLogin"]} `
                                                    : `${styles["errorMessage-inLogin_hidden"]}`
                                                }
                                              >
                                                {t(
                                                  "Please-select-data-and-time"
                                                )}
                                              </p>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col
                                          lg={3}
                                          md={3}
                                          sm={3}
                                          className="timePicker"
                                        >
                                          <DatePicker
                                            arrowClassName="arrowClass"
                                            containerClassName="containerClassTimePicker"
                                            className="timePicker"
                                            disableDayPicker
                                            inputClass="inputTImeMeeting"
                                            calendar={calendarValue}
                                            locale={localValue}
                                            format="HH:mm A"
                                            selected={data.startDate}
                                            plugins={[
                                              <TimePicker hideSeconds />,
                                            ]}
                                            onChange={(date) =>
                                              handleStartDateChange(index, date)
                                            }
                                          />
                                        </Col>
                                        <Col
                                          lg={1}
                                          md={1}
                                          sm={12}
                                          className="d-flex justify-content-center align-items-center"
                                        >
                                          <img
                                            draggable={false}
                                            src={desh}
                                            width="19.02px"
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
                                            inputClass="inputTImeMeeting"
                                            calendar={calendarValue}
                                            locale={localValue}
                                            format="HH:mm A"
                                            selected={data.startDate}
                                            plugins={[
                                              <TimePicker hideSeconds />,
                                            ]}
                                            onChange={(date) =>
                                              handleEndDateChange(index, date)
                                            }
                                          />
                                        </Col>
                                        <Col
                                          lg={1}
                                          md={1}
                                          sm={12}
                                          className="d-flex justify-content-end position-relative align-items-center"
                                        >
                                          <img
                                            draggable={false}
                                            src={redcrossIcon}
                                            width="23px"
                                            height="23px"
                                            className={
                                              styles["Cross_icon_class"]
                                            }
                                            onClick={() => {
                                              HandleCancelFunction(index);
                                            }}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col>
                                      <p
                                        className={
                                          error &&
                                          rows.selectedOption === "" &&
                                          rows.startDate === "" &&
                                          rows.endDate === ""
                                            ? ` ${styles["errorMessage-inLogin"]} `
                                            : `${styles["errorMessage-inLogin_hidden"]}`
                                        }
                                      >
                                        {t("Please-select-data-and-time")}
                                      </p>
                                    </Col>
                                  </Row>
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
                              <Row className="mt-1">
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex justify-content-center gap-2 align-items-center"
                                >
                                  <img
                                    draggable={false}
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
                  <Col lg={4} md={4} sm={4}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Prposed_On_Heading"]}>
                          {t("Send-response-by")}{" "}
                          <span className={styles["Steric_Color"]}>*</span>
                        </span>
                      </Col>
                    </Row>
                    <Row className="m-0 p-0 mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Box_for_Send_Request"]}
                      >
                        <span className={styles["Date_Year_Styles"]}>
                          21st May, 2020
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p
                          className={
                            error &&
                            selectError &&
                            startDateError &&
                            endDateError
                              ? ` ${styles["errorMessage-inLogin"]} `
                              : `${styles["errorMessage-inLogin_hidden"]}`
                          }
                        >
                          {t("Please-select-date")}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            )}
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Cancel")}
                  className={styles["Cancel_Button_ProposedMeeting"]}
                  onClick={CancelModal}
                />
                <Button
                  text={t("Send")}
                  className={styles["Save_Button_ProposedMeeting"]}
                  onClick={handleSend}
                />
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>
      {NewMeetingreducer.prposedMeetingUnsavedModal && (
        <UnsavedModal setProposedMeetingDates={setProposedMeetingDates} />
      )}
    </section>
  );
};

export default ProposedMeetingDate;
