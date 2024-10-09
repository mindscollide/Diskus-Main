import React from "react";
import styles from "./ViewParticipantsDates.module.css";
import {
  Button,
  Checkbox,
  Notification,
} from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Paper } from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  GetAllMeetingDetailsApiFunc,
  SetMeetingResponseApiFunc,
  getUserProposedWiseApi,
  searchNewUserMeeting,
  viewProposeDateMeetingPageFlag,
} from "../../../../../../store/actions/NewMeetingActions";
import { useEffect } from "react";
import { useState } from "react";
import { resolutionResultTable } from "../../../../../../commen/functions/date_formater";
import moment from "moment";

const ViewParticipantsDates = ({
  setViewProposeDatePoll,
  setCurrentMeetingID,
  setSceduleMeeting,
  setDataroomMapFolderId,
  responseByDate,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("userID");
  let userID = localStorage.getItem("userID");

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  const getAllMeetingDetails = useSelector(
    (state) => state.NewMeetingreducer.getAllMeetingDetails
  );

  const getAllProposedDates = useSelector(
    (state) => state.NewMeetingreducer.getAllProposedDates
  );

  const userWiseMeetingProposed = useSelector(
    (state) => state.NewMeetingreducer.userWiseMeetingProposed
  );

  const [deadline, setDeadline] = useState("");
  const [prposedData, setPrposedData] = useState([]);
  const [sendProposedData, setSendProposedData] = useState([]);
  const [noneOfAbove, setNoneOfAbove] = useState([]);
  const [apiUserID, setApiUserID] = useState("");
  const [meetingDeatils, setMeetingDeatils] = useState({
    MeetingTitle: "",
    MeetingType: "",
    MeetingLocation: "",
    MeetingDiscription: "",
  });
  const [selectAll, setSelectAll] = useState(false);
  let currentMeetingID = Number(
    localStorage.getItem("viewProposeDatePollMeetingID")
  );

  const changeDateStartHandler2 = (date) => {
    let newDate = moment(date).format("DD MMMM YYYY");
    return newDate;
  };

  const callApis = async () => {
    let Data = {
      MeetingID: Number(currentMeetingID),
    };
    await dispatch(getUserProposedWiseApi(navigate, t, Data, false));
    await dispatch(
      GetAllMeetingDetailsApiFunc(
        navigate,
        t,
        Data,
        false,
        setCurrentMeetingID,
        setSceduleMeeting,
        setDataroomMapFolderId
      )
    );
  };

  useEffect(() => {
    callApis();
    return () => {
      localStorage.removeItem("viewProposeDatePollMeetingID");
      setCurrentMeetingID(null);
      setDataroomMapFolderId(null);
    };
  }, []);

  //Previous API for D ates that have to be Inserted new
  useEffect(() => {
    try {
      if (
        userWiseMeetingProposed !== null &&
        userWiseMeetingProposed !== undefined &&
        userWiseMeetingProposed.length > 0
      ) {
        let uniqueDates = new Set();
        let datesarry = [];
        userWiseMeetingProposed.forEach((datesData, index) => {
          console.log(datesData, "datesDatadatesDatadatesData");
          setApiUserID(datesData.userID);
          if (Number(datesData.userID) === Number(currentUserId)) {
            console.log(datesData, "newDatanewDatanewData");
            datesData.selectedProposedDates.forEach((newData, index) => {
              if (
                newData.proposedDate === "10000101" &&
                newData.startTime === "000000" &&
                newData.endTime === "000000"
              ) {
                setSelectAll(newData.isSelected);
              }
            });
          }
          // Loop through the data to find the specific date combination

          if (Number(datesData.userID) === Number(currentUserId)) {
            datesData.selectedProposedDates.forEach((data) => {
              if (
                data.proposedDate !== "10000101" ||
                data.endTime !== "000000" ||
                data.startTime !== "000000"
              ) {
                const uniqueID = data.proposedDateID;
                if (!uniqueDates.has(uniqueID)) {
                  uniqueDates.add(uniqueID);
                  datesarry.push({
                    userID: datesData.userID,
                    endTime: resolutionResultTable(
                      data.proposedDate + data.endTime
                    ),
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
                    isSelected: data.isSelected,
                  });
                }
              }
            });
          }

          //now For Sending Data
          let SenddataObject = [];
          datesData.selectedProposedDates.forEach((data, index) => {
            SenddataObject.push({
              EndtimeSend: data.endTime,
              ProposedDateSend: data.proposedDate,
              proposedDateIDSend: data.proposedDateID,
              StartTimeSend: data.startTime,
              isSelected: data.isSelected,
            });
          });

          // now for the default Data
          let DefaultDate = [];
          datesData.selectedProposedDates.forEach((data, index) => {
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
                isSelected: data.isSelected,
              });
            } else {
            }
          });
          setNoneOfAbove(DefaultDate);
          setPrposedData(datesarry);
          setSendProposedData(SenddataObject);
        });
      } else {
      }
    } catch (error) {
      console.log(error, "catchError");
    }
  }, [userWiseMeetingProposed]);

  //Fetching All Saved Data
  useEffect(() => {
    try {
      if (getAllMeetingDetails !== null && getAllMeetingDetails !== undefined) {
        setMeetingDeatils({
          MeetingTitle: getAllMeetingDetails.advanceMeetingDetails.meetingTitle,
          MeetingType:
            getAllMeetingDetails.advanceMeetingDetails.meetingType.type,
          MeetingLocation: getAllMeetingDetails.advanceMeetingDetails.location,
          MeetingDiscription:
            getAllMeetingDetails.advanceMeetingDetails.description,
        });
      }
    } catch (error) {}
  }, [getAllMeetingDetails]);

  //Previous API for Dates that have to be Removed
  useEffect(() => {
    try {
      if (getAllProposedDates !== null && getAllProposedDates !== undefined) {
        let deadline = getAllProposedDates.deadLineDate;
        setDeadline(deadline);
      }
    } catch (error) {}
  }, [getAllProposedDates]);

  // onChange function for CheckBoxes
  const handleCheckboxChange = (clickedData) => {
    // Clone the prposedData array to avoid mutating the state directly
    const updatedData = [...prposedData];

    // Find the index of the clicked data object in the array
    const dataIndex = updatedData.findIndex(
      (data) => data.proposedDateID === clickedData.proposedDateID
    );

    // If the dataIndex is valid
    if (dataIndex !== -1) {
      // Toggle the isSelected property of the clicked data
      updatedData[dataIndex].isSelected = !updatedData[dataIndex].isSelected;

      // Update the state with the modified array
      setPrposedData(updatedData);
    } else {
      updatedData.splice(dataIndex, 1);
      setPrposedData(updatedData);
    }
    setSelectAll(false);
  };

  const handleSelectAllChange = (event) => {
    if (event.target.checked) {
      setPrposedData((prev) => {
        return prev.map((data, index) => {
          return {
            ...data,
            isSelected: false,
          };
        });
      });
    } else {
      setPrposedData((prev) => {
        return prev.map((data, index) => {
          return {
            ...data,
            isSelected: true,
          };
        });
      });
    }
    setSelectAll(event.target.checked);
  };

  const handleSave = () => {
    let findIsanySelected = prposedData.some(
      (data, index) => data.isSelected === true
    );
    if (selectAll && findIsanySelected === false) {
      let defaultarr = [];
      noneOfAbove.forEach((data, index) => {
        defaultarr.push({
          ProposedDateID: data.proposedDateIDSend,
          ProposedDate: data.ProposedDateSend,
          StartTime: data.StartTimeSend,
          EndTime: data.EndtimeSend,
        });
      });
      let Data = {
        MeetingID: currentMeetingID,
        ProposedDates: defaultarr,
      };
      dispatch(
        SetMeetingResponseApiFunc(Data, navigate, t, setViewProposeDatePoll)
      );
    } else if (findIsanySelected) {
      let newarr = [];
      prposedData.forEach((data, index) => {
        if (data.isSelected) {
          newarr.push({
            ProposedDateID: data.proposedDateID,
            ProposedDate: data.ProposedDateSend,
            StartTime: data.StartTimeSend,
            EndTime: data.EndtimeSend,
          });
        }
      });
      let Data = {
        MeetingID: currentMeetingID,
        ProposedDates: newarr,
      };

      dispatch(
        SetMeetingResponseApiFunc(Data, navigate, t, setViewProposeDatePoll)
      );
    } else if (!selectAll) {
      setOpen({
        flag: true,
        message: t("Please-select-any-of-the-given-options"),
      });
    }
  };

  const handleCancel = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 50,
      PublishedMeetings: false,
    };
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.setItem("MeetingCurrentView", 2);
    setViewProposeDatePoll(false);
    dispatch(viewProposeDateMeetingPageFlag(false));
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
                  {meetingDeatils.MeetingTitle}
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Staff_meeting_Heading"]}>
                  {meetingDeatils.MeetingType}
                  {meetingDeatils.MeetingLocation !== "" &&
                  meetingDeatils.MeetingLocation !== null &&
                  meetingDeatils.MeetingLocation !== undefined ? (
                    <span>({meetingDeatils.MeetingLocation})</span>
                  ) : null}
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <p className={styles["Paragraph_Styles"]}>
                  {meetingDeatils.MeetingDiscription}
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
                          const isChecked =
                            data.isSelected &&
                            Number(data.userID) === Number(currentUserId);

                          return (
                            <Row className="m-0 p-0 mt-2" key={index}>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className={styles["Box_To_Show_Time"]}
                              >
                                <Row className={styles["Inner_Send_class"]}>
                                  <Col lg={10} md={10} sm={12}>
                                    <span className={styles["Time_Class"]}>
                                      {moment(data.startTime).format("hh:mm A")}{" "}
                                      - {moment(data.endTime).format("hh:mm A")}
                                      ,{" "}
                                      {changeDateStartHandler2(
                                        data.proposedDate
                                      )}
                                    </span>
                                  </Col>
                                  <Col lg={2} md={2} sm={2}>
                                    <Checkbox
                                      prefixCls={"ProposedMeeting_Checkbox"}
                                      classNameCheckBoxP="d-none"
                                      checked={isChecked}
                                      onChange={() =>
                                        handleCheckboxChange(data)
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          );
                        })
                      : null}
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Prposed_On_Heading"]}>
                      {t("Send-response-by")}{" "}
                    </span>
                  </Col>
                </Row>

                <Row className="mt-1">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Date"]}>
                      {responseByDate !== undefined
                        ? changeDateStartHandler2(responseByDate)
                        : ""}
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
                          {t("None-of-the-above")}
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
                  onClick={handleCancel}
                />
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </section>
  );
};

export default ViewParticipantsDates;
