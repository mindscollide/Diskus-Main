import React, { useState } from "react";
import Select from "react-select";
import styles from "./ProposedMeetingDate.module.css";
import { Button, Checkbox } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import BackArrow from "../../../../../../assets/images/Back Arrow.svg";
import redcrossIcon from "../../../../../../assets/images/Artboard 9.png";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import plusFaddes from "../../../../../../assets/images/BluePlus.svg";
import desh from "../../../../../../assets/images/desh.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { style } from "@mui/system";
import UnsavedModal from "./UnsavedChangesModal/UnsavedModal";
import { showPrposedMeetingUnsavedModal } from "../../../../../../store/actions/NewMeetingActions";
const ProposedMeetingDate = ({ setProposedMeetingDates }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [sendDates, setSendDates] = useState(false);
  const [options, setOptions] = useState([]);
  const [rows, setRows] = useState([
    { selectedOption: "", startDate: "", endDate: "" },
  ]);

  const addRow = () => {
    setRows([...rows, { selectedOption: "", startDate: "", endDate: "" }]);
  };

  const HandleCancelFunction = (index) => {
    let optionscross = [...rows];
    optionscross.splice(index, 1);
    setRows(optionscross);
  };

  const handleStartDateChange = (date) => {
    setOptions({ ...options, startDate: date });
  };

  const handleEndDateChange = (date) => {
    setOptions({ ...options, endDate: date });
  };

  const handleSelectChange = (selectedOption) => {
    setOptions({ ...options, selectedOption });
  };

  const handleSend = () => {
    setSendDates(!sendDates);
  };

  const CancelModal = () => {
    dispatch(showPrposedMeetingUnsavedModal(true));
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
            src={BackArrow}
            width="20.5px"
            height="18.13px"
            className="cursor-pointer"
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
                                          <Select
                                            value={rows.selectedOption}
                                            onChange={handleSelectChange}
                                            isSearchable={false}
                                          />
                                        </Col>
                                        <Col
                                          lg={3}
                                          md={3}
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
                                            plugins={[
                                              <TimePicker hideSeconds />,
                                            ]}
                                            selected={rows.startDate}
                                            onChange={handleStartDateChange}
                                          />
                                        </Col>
                                        <Col
                                          lg={1}
                                          md={1}
                                          sm={12}
                                          className="d-flex justify-content-end align-items-center"
                                        >
                                          <img src={desh} width="19.02px" />
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
                                            plugins={[
                                              <TimePicker hideSeconds />,
                                            ]}
                                            selected={rows.endDate}
                                            onChange={handleEndDateChange}
                                          />
                                        </Col>
                                        {index <= 0 ? null : (
                                          <>
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
                                                className={
                                                  styles["Cross_icon_class"]
                                                }
                                                onClick={() => {
                                                  HandleCancelFunction(index);
                                                }}
                                              />
                                            </Col>
                                          </>
                                        )}
                                      </Row>
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
