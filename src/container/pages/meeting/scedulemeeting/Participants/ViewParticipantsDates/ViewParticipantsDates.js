import React from "react";
import styles from "./ViewParticipantsDates.module.css";
import {
  Button,
  Checkbox,
  Notification,
} from "../../../../../../components/elements";
import BackArrow from "../../../../../../assets/images/Back Arrow.svg";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Paper } from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  GetAllProposedMeetingDateApiFunc,
  SetMeetingResponseApiFunc,
} from "../../../../../../store/actions/NewMeetingActions";
import { useEffect } from "react";
import { useState } from "react";
import {
  formatDateToMMDDYY,
  resolutionResultTable,
} from "../../../../../../commen/functions/date_formater";
import moment from "moment";

const ViewParticipantsDates = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [deadline, setDeadline] = useState("");
  const [prposedData, setPrposedData] = useState([]);
  const [sendProposedData, setSendProposedData] = useState([]);
  const [checkedObjects, setCheckedObjects] = useState([]);
  const [noneOfAbove, setNoneOfAbove] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  console.log(checkedObjects, "checkedObjectscheckedObjectscheckedObjects");
  let currentLanguage = localStorage.getItem("i18nextLng");
  let currentMeetingID = Number(localStorage.getItem("meetingID"));

  const changeDateStartHandler2 = (date) => {
    let newDate = moment(date).format("DD MMMM YYYY");
    return newDate;
  };

  useEffect(() => {
    let Data = {
      MeetingID: currentMeetingID,
    };
    dispatch(GetAllProposedMeetingDateApiFunc(Data, navigate, t));
  }, []);

  useEffect(() => {
    try {
      if (
        NewMeetingreducer.getAllProposedDates !== null &&
        NewMeetingreducer.getAllProposedDates !== undefined
      ) {
        console.log(
          NewMeetingreducer.getAllProposedDates,
          "NewMeetingreducergetAllProposedDates"
        );
        let deadline = NewMeetingreducer.getAllProposedDates.deadLineDate;
        setDeadline(deadline);
        let datesarry = [];
        NewMeetingreducer.getAllProposedDates.meetingProposedDates.map(
          (data, index) => {
            datesarry.push({
              endTime: resolutionResultTable(data.proposedDate + data.endTime),
              proposedDate: resolutionResultTable(
                data.proposedDate + data.startTime
              ),
              proposedDateID: data.proposedDateID,
              startTime: resolutionResultTable(
                data.proposedDate + data.startTime
              ),
              EndtimeSend: data.endTime,
              ProposedDateSend: data.proposedDate,
              proposedDateIDSend: data.proposedDateID,
              StartTimeSend: data.startTime,
            });
          }
        );

        let SenddataObject = [];

        NewMeetingreducer.getAllProposedDates.meetingProposedDates.map(
          (data, index) => {
            SenddataObject.push({
              EndtimeSend: data.endTime,
              ProposedDateSend: data.proposedDate,
              proposedDateIDSend: data.proposedDateID,
              StartTimeSend: data.startTime,
            });
          }
        );

        let DefaultDate = [];

        NewMeetingreducer.getAllProposedDates.meetingProposedDates.map(
          (data, index) => {
            console.log(data, "datadatadata");
            if (
              data.proposedDate === "10000101" &&
              data.endTime === "000000" &&
              data.startTime === "000000"
            ) {
              DefaultDate.push({
                EndtimeSend: data.endTime,
                ProposedDateSend: data.proposedDate,
                proposedDateIDSend: data.proposedDateID,
                StartTimeSend: data.startTime,
              });
            } else {
            }
          }
        );
        setNoneOfAbove(DefaultDate);
        setPrposedData(datesarry);
        setSendProposedData(SenddataObject);
      }
    } catch (error) {
      console.error(error);
    }
  }, [NewMeetingreducer.getAllProposedDates]);

  // console.log(prposedData, "prposedDataprposedData");
  console.log(sendProposedData, "prposedDataprposedData");
  const handleCheckboxChange = (data) => {
    if (checkedObjects.includes(data)) {
      setCheckedObjects(checkedObjects.filter((obj) => obj !== data));
      setSelectAll(false); // Uncheck select all if a checkbox is unchecked
    } else {
      setCheckedObjects([...checkedObjects, data]);
    }
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setCheckedObjects([]);
    } else {
      setCheckedObjects([...sendProposedData]);
    }
    setSelectAll(!selectAll);
  };

  const handleSave = () => {
    if (selectAll) {
      let defaultarr = [];
      noneOfAbove.forEach((data, index) => {
        defaultarr.push({
          ProposedDateID: data.proposedDateID,
          ProposedDate: data.ProposedDateSend,
          StartTime: data.StartTimeSend,
          EndTime: data.EndtimeSend,
        });
      });
      let Data = {
        MeetingID: currentMeetingID,
        ProposedDates: defaultarr,
      };
      console.log(Data, "DataDataDataData");
      dispatch(SetMeetingResponseApiFunc(Data, navigate, t));
    } else {
      let newarr = [];
      checkedObjects.forEach((data, index) => {
        newarr.push({
          ProposedDateID: data.proposedDateID,
          ProposedDate: data.ProposedDateSend,
          StartTime: data.StartTimeSend,
          EndTime: data.EndtimeSend,
        });
      });
      let Data = {
        MeetingID: currentMeetingID,
        ProposedDates: newarr,
      };
      console.log(Data, "DataDataDataData");
      dispatch(SetMeetingResponseApiFunc(Data, navigate, t));
    }
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
                    {prposedData.length > 0
                      ? prposedData.map((data, index) => {
                          console.log(data, "lengthlength");
                          return (
                            <>
                              <Row className="m-0 p-0 mt-2">
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={styles["Box_To_Show_Time"]}
                                >
                                  <Row className={styles["Inner_Send_class"]}>
                                    <Col lg={10} md={10} sm={12}>
                                      <span className={styles["Time_Class"]}>
                                        {moment(data.startTime).format(
                                          "HH:MM a"
                                        )}
                                        -{" "}
                                        {moment(data.endTime).format("HH:MM a")}
                                        ,
                                        {changeDateStartHandler2(
                                          data.proposedDate
                                        )}
                                      </span>
                                    </Col>
                                    <Col lg={2} md={2} sm={2}>
                                      <Checkbox
                                        prefixCls={"ProposedMeeting_Checkbox"}
                                        classNameCheckBoxP="d-none"
                                        checked={checkedObjects.includes(data)}
                                        onChange={() =>
                                          handleCheckboxChange(data)
                                        }
                                      />
                                    </Col>
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
                    <span className={styles["Prposed_On_Heading"]}>
                      {t("Send-response-by")}{" "}
                      <span className={styles["Steric_Color"]}>*</span>
                    </span>
                  </Col>
                </Row>

                <Row className="mt-1">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Date"]}>
                      {changeDateStartHandler2(deadline)}
                    </span>
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
                          checked={selectAll}
                          onChange={handleSelectAllChange}
                        />
                      </Col>
                    </Row>
                  </Col>
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
                  text={t("Save")}
                  className={styles["Save_Button_ProposedMeeting"]}
                  onClick={handleSave}
                />

                <Button
                  text={t("Cancel")}
                  className={styles["Cancel_Button_ProposedMeeting"]}
                />
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>
    </section>
  );
};

export default ViewParticipantsDates;
