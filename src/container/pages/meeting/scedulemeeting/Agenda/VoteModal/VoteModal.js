import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Switch,
  TextField,
  Table,
  Notification,
} from "../../../../../../components/elements";
import styles from "./VoteModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Cast from "../../../../../../assets/images/CAST.svg";
import {
  showVoteAgendaModal,
  showVoteConfirmationModal,
  showAllMeetingParticipantsSuccess,
} from "../../../../../../store/actions/NewMeetingActions";
import { GetAllMeetingOrganizers } from "../../../../../../store/actions/MeetingOrganizers_action";
import {
  SaveAgendaVoting,
  GetAllVotingResultDisplay,
  GetCurrentAgendaDetails,
  getAgendaVotingDetails_success,
} from "../../../../../../store/actions/MeetingAgenda_action";
import { GetAllSavedparticipantsAPI } from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import redcrossIcon from "../../../../../../assets/images/Artboard 9.png";
import Leftploygon from "../../../../../../assets/images/leftdirection.svg";
import Rightploygon from "../../../../../../assets/images/rightdirection.svg";
import Plus from "../../../../../../assets/images/Meeting plus.png";
import { validateInput } from "../../../../../../commen/functions/regex";
import { showMessage } from "../../../../../../components/elements/snack_bar/utill";

const VoteModal = ({ setenableVotingPage, currentMeeting }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let currentAgendaVotingID = Number(
    localStorage.getItem("currentAgendaVotingID")
  );

  const { NewMeetingreducer, MeetingAgendaReducer, MeetingOrganizersReducer } =
    useSelector((state) => state);
  console.log(
    NewMeetingreducer,
    MeetingAgendaReducer,
    MeetingOrganizersReducer,
    ""
  );
  const [addOptions, setAddOptions] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [errorShow, setErrorShow] = useState(false);

  const [agendaDetails, setAgendaDetails] = useState({
    agendaTitle: "",
    agendaId: "",
    agendaVotingID: 2,
    isvotingClosed: false,
    userID: 0,
    voteQuestion: "",
    votingResultDisplay: "",
    votingResultDisplayID: 0,
  });

  const [organizerDropdown, setOrganizersDropdown] = useState([]);

  const [meetingParticipants, setMeetingParticipants] = useState([]);

  const [IsOrganizer, setIsOrganizer] = useState(null);

  const [votingResultDataList, setVotingResultDataList] = useState([]);

  const [voteAnswerValue, setVoteAnswerValue] = useState("");
  const [saveOptions, setSaveOptions] = useState([
    { votingAnswer: "Pending", votingAnswerID: 0, isHidden: true },
    { votingAnswer: t("Yes"), votingAnswerID: 1, isHidden: false },
    { votingAnswer: t("No"), votingAnswerID: 2, isHidden: false },
  ]);

  const plusButtonFunc = () => {
    setAddOptions(true);
  };
  const cancelButtonFunc = () => {
    setAddOptions(false);
  };

  const deleteRow = (recordToDelete) => {
    setMeetingParticipants((prevRowsData) =>
      prevRowsData.filter((record) => record !== recordToDelete)
    );
  };

  const SlideLeft = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft - 300;
  };

  const Slideright = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft + 300;
  };

  const AddOptions = () => {
    const optionExists = saveOptions.some(
      (option) => option.votingAnswer === voteAnswerValue
    );

    if (!optionExists) {
      setAddOptions(false);
      setSaveOptions([
        ...saveOptions,
        {
          votingAnswer: voteAnswerValue,
          votingAnswerID: 0,
          isHidden: false,
        },
      ]);
      setAddOptions(false);
      setVoteAnswerValue("");
    } else {
      showMessage(t("Cannot-add-option-with-same-name"), "error", setOpen);
    }
  };

  const openConfirmationModal = () => {
    dispatch(showVoteAgendaModal(false));
    dispatch(showVoteConfirmationModal(true));
  };

  const handleCrossBtn = (index) => {
    // Create a copy of the saveOptions array
    const updatedSaveOptions = [...saveOptions];
    // Remove the object at the specified index
    updatedSaveOptions.splice(index, 1);
    // Update the state with the modified array
    setSaveOptions(updatedSaveOptions);
  };

  const dropDownSelectOrganizers = (event) => {
    setIsOrganizer(event);
    setAgendaDetails({
      ...agendaDetails,
      userID: event.value,
    });
  };

  const dropDownSelectOptions = (event) => {
    setAgendaDetails({
      ...agendaDetails,
      votingResultDisplayID: event.value,
      votingResultDisplay: event.label,
    });
  };

  const handleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "description") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setAgendaDetails({
          ...agendaDetails,
          voteQuestion: valueCheck,
        });
      } else {
        setAgendaDetails({
          ...agendaDetails,
          voteQuestion: "",
        });
      }
    }
  };

  // Function for the Saved Add TExt filed
  const handleOptionTextChange = (e) => {
    let value = e.target.value;
    setVoteAnswerValue(value);
  };

  const handleChangeVotingAnswer = (e, index) => {
    const updatedSaveOptions = [...saveOptions];
    updatedSaveOptions[index].votingAnswer = e.target.value;
    setSaveOptions(updatedSaveOptions);
  };

  const handleVotingChange = () => {
    setAgendaDetails({
      ...agendaDetails,
      isvotingClosed: false,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let dataForAllOrganizers = { MeetingID: currentMeeting };
        let dataForAllMeetingParticipants = { MeetingID: currentMeeting };

        await dispatch(
          GetAllSavedparticipantsAPI(
            dataForAllMeetingParticipants,
            navigate,
            t,
            false
          )
        );

        await dispatch(
          GetAllMeetingOrganizers(dataForAllOrganizers, navigate, t)
        );

        await dispatch(GetAllVotingResultDisplay(navigate, t));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Add dependencies for re-execution if needed
  console.log(
    "GetCurrentAgendaDetails vote :",
    MeetingAgendaReducer.GetCurrentAgendaDetails
  );
  console.log(
    "getAllSavedparticipants vote : ",
    NewMeetingreducer.getAllSavedparticipants
  );
  console.log(
    "MeetingAgendaVotingDetailsData vote :",
    MeetingAgendaReducer.MeetingAgendaVotingDetailsData
  );
  console.log("agendaDetails vote :", agendaDetails);

  useEffect(() => {
    try {
      if (
        MeetingAgendaReducer.GetCurrentAgendaDetails !== null &&
        MeetingAgendaReducer.GetCurrentAgendaDetails !== undefined &&
        MeetingAgendaReducer.GetCurrentAgendaDetails.length !== 0
      ) {
        setAgendaDetails({
          ...agendaDetails,
          agendaTitle: MeetingAgendaReducer.GetCurrentAgendaDetails.title,
          agendaId: MeetingAgendaReducer.GetCurrentAgendaDetails.iD,
          agendaVotingID:
            MeetingAgendaReducer.GetCurrentAgendaDetails.agendaVotingID,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [MeetingAgendaReducer.GetCurrentAgendaDetails]);

  useEffect(() => {
    try {
      if (
        NewMeetingreducer.getAllSavedparticipants !== undefined &&
        NewMeetingreducer.getAllSavedparticipants !== null &&
        NewMeetingreducer.getAllSavedparticipants.length !== 0 &&
        currentAgendaVotingID === 0
      ) {
        setMeetingParticipants(NewMeetingreducer.getAllSavedparticipants);
      }
    } catch (error) {
      console.log(error);
    }
  }, [NewMeetingreducer.getAllSavedparticipants]);

  const MeetingColoumns = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Name")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "userName",
      key: "userName",
      width: "100px",
      ellipsis: true,
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Role")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "participantTitle",
      key: "participantTitle",
      width: "100px",
      align: "center",
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Email")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "emailAddress",
      key: "emailAddress",
      width: "150px",
      ellipsis: true,
      align: "center",
    },
    {
      dataIndex: "userID",
      key: "userID",
      width: "80px",
      align: "center",

      render: (text, record) => {
        if (record.userID) {
          return (
            <>
              <img
                src={redcrossIcon}
                height='21.79px'
                width='21.79px'
                className='cursor-pointer'
                draggable={false}
                onClick={() => deleteRow(record)}
                alt=''
              />
            </>
          );
        }
      },
    },
  ];

  useEffect(() => {
    if (
      MeetingOrganizersReducer.AllMeetingOrganizersData !== undefined &&
      MeetingOrganizersReducer.AllMeetingOrganizersData !== null &&
      MeetingOrganizersReducer.AllMeetingOrganizersData.length !== 0
    ) {
      let newOrganizerData = [];
      if (
        MeetingOrganizersReducer.AllMeetingOrganizersData.meetingOrganizers
          .length > 0
      ) {
        MeetingOrganizersReducer.AllMeetingOrganizersData.meetingOrganizers.map(
          (oranizerData, index) => {
            return newOrganizerData.push({
              value: oranizerData.userID,
              label: (
                <>
                  <Row>
                    <Col lg={12} md={12} sm={12} className='d-flex gap-2'>
                      <img
                        src={`data:image/jpeg;base64,${oranizerData.userProfilePicture.displayProfilePictureName}`}
                        width='17px'
                        height='17px'
                        className={styles["Image_profile"]}
                        alt=''
                      />
                      <span className={styles["Participant_names"]}>
                        {oranizerData.userName}
                      </span>
                    </Col>
                  </Row>
                </>
              ),
            });
          }
        );
      }

      setOrganizersDropdown(newOrganizerData);
    }
  }, [MeetingOrganizersReducer.AllMeetingOrganizersData]);
  useEffect(() => {
    if (
      MeetingOrganizersReducer.AllMeetingOrganizersData !== undefined &&
      MeetingOrganizersReducer.AllMeetingOrganizersData !== null &&
      MeetingOrganizersReducer.AllMeetingOrganizersData.length !== 0 &&
      MeetingAgendaReducer.MeetingAgendaVotingDetailsData !== undefined &&
      MeetingAgendaReducer.MeetingAgendaVotingDetailsData !== null &&
      MeetingAgendaReducer.MeetingAgendaVotingDetailsData.length !== 0
    ) {
      if (currentAgendaVotingID !== 0) {
        setMeetingParticipants(
          MeetingAgendaReducer.MeetingAgendaVotingDetailsData
            .agendaVotingDetails.votingMembers
        );
      }

      const matchedOrganizer =
        MeetingOrganizersReducer.AllMeetingOrganizersData.meetingOrganizers.find(
          (obj) =>
            obj.userID ===
            MeetingAgendaReducer.MeetingAgendaVotingDetailsData
              .agendaVotingDetails.userID
        );
      console.log("matchedOrganizer", matchedOrganizer);
      if (matchedOrganizer !== undefined) {
        setIsOrganizer({
          value: matchedOrganizer.userID,
          label: (
            <>
              <Row>
                <Col lg={12} md={12} sm={12} className='d-flex gap-2'>
                  <img
                    src={`data:image/jpeg;base64,${matchedOrganizer.userProfilePicture.displayProfilePictureName}`}
                    width='17px'
                    height='17px'
                    className={styles["Image_profile"]}
                    alt=''
                  />
                  <span className={styles["Participant_names"]}>
                    {matchedOrganizer.userName}
                  </span>
                </Col>
              </Row>
            </>
          ),
        });
        setAgendaDetails({
          ...agendaDetails,
          userID: matchedOrganizer.userID,
        });
      }
      console.log("Going in the condition");
      let agendaVotingDetails =
        MeetingAgendaReducer.MeetingAgendaVotingDetailsData.agendaVotingDetails;
      console.log("Going in the condition", agendaVotingDetails);
      setAgendaDetails({
        ...agendaDetails,
        userID: agendaVotingDetails.userID,
        voteQuestion: agendaVotingDetails.voteQuestion,
        // agendaTitle: agendaVotingDetails.title,
        votingResultDisplay: agendaVotingDetails?.votingResultDisplay?.result,
        votingResultDisplayID:
          agendaVotingDetails?.votingResultDisplay?.votingResultDisplayID,
        agendaId: agendaVotingDetails.agendaId,
        agendaVotingID: agendaVotingDetails.agendaVotingID,
        isvotingClosed: false,
      });
      let votingAnswerData = agendaVotingDetails.votingAnswers;
      console.log(votingAnswerData, "votingAnswerDatavotingAnswerData");
      if (Array.isArray(votingAnswerData) && votingAnswerData.length > 0) {
        let newAnswers = [];
        votingAnswerData.forEach((item) => {
          newAnswers.push({
            votingAnswer: item.votingAnswer,
            votingAnswerID: item.votingAnswerID,
            agendaID: item.agendaID,
            isHidden: item.votingAnswer === "Pending" ? true : false,
          });
        });

        setSaveOptions(newAnswers);
      }
    }
  }, [
    MeetingAgendaReducer.MeetingAgendaVotingDetailsData,
    MeetingOrganizersReducer.AllMeetingOrganizersData,
  ]);

  useEffect(() => {
    if (
      MeetingAgendaReducer.VotingResultDisplayData !== undefined &&
      MeetingAgendaReducer.VotingResultDisplayData !== null &&
      MeetingAgendaReducer.VotingResultDisplayData.length !== 0
    ) {
      let newVotingResultData = [];
      MeetingAgendaReducer.VotingResultDisplayData.votingResultDisplays.map(
        (votingOptions, index) => {
          return newVotingResultData.push({
            value: votingOptions.votingResultDisplayID,
            label: (
              <>
                <span>{votingOptions.result}</span>
              </>
            ),
          });
        }
      );
      setVotingResultDataList(newVotingResultData);
    }
  }, [MeetingAgendaReducer.VotingResultDisplayData]);

  const handleVoteSaveModal = () => {
    if (
      agendaDetails.userID !== 0 &&
      agendaDetails.votingResultDisplayID !== 0 &&
      agendaDetails.voteQuestion !== ""
    ) {
      let votingOptionData = saveOptions.map((item) => ({
        AgendaID: agendaDetails.agendaId,
        VotingAnswer: item.votingAnswer,
      }));
      let participantData = meetingParticipants.map((item) => ({
        AgendaID: agendaDetails.agendaId,
        UserID: item.userID,
        AgendaVotingID: agendaDetails.agendaVotingID,
      }));

      console.log("votingOptionData", typeof votingOptionData);
      if (Object.keys(votingOptionData).length > 2) {
        let Data = {
          MeetingID: currentMeeting,
          AgendaVoting: {
            AgendaVotingID: agendaDetails.agendaVotingID,
            AgendaID: agendaDetails.agendaId,
            VoteQuestion: agendaDetails.voteQuestion,
            VotingResultDisplayID: agendaDetails.votingResultDisplayID,
            IsVotingClosed: false,
            UserID: agendaDetails.userID,
            IsAddFlow: agendaDetails.agendaVotingID === 0 ? true : false,
            VotingAnswers: votingOptionData,
            AgendaVotingParticipants: participantData,
          },
        };

        console.log("Save Agenda Voting Data", Data);
        dispatch(SaveAgendaVoting(Data, navigate, t, currentMeeting));
        dispatch(getAgendaVotingDetails_success([], ""));
        setAgendaDetails({
          ...agendaDetails,
          agendaTitle: "",
          agendaId: "",
          agendaVotingID: 0,
          isvotingClosed: false,
          userID: 0,
          voteQuestion: "",
          votingResultDisplay: "",
          votingResultDisplayID: 0,
        });

        setOrganizersDropdown([]);
        setVotingResultDataList([]);
        setMeetingParticipants([]);
        setSaveOptions([
          { votingAnswer: "Pending", votingAnswerID: 0, isHidden: true },
          { votingAnswer: t("Yes"), votingAnswerID: 1, isHidden: false },
          { votingAnswer: t("No"), votingAnswerID: 2, isHidden: false },
        ]);
        dispatch(GetCurrentAgendaDetails([]));
        dispatch(showVoteAgendaModal(false));
      } else {
        showMessage(
          t("Voting-options-should-be-2-or-more-than-2"),
          "error",
          setOpen
        );
      }
    } else {
      setErrorShow(true);
      showMessage(t("Required-fields-should-not-be-empty"), "error", setOpen);
    }
  };

  const closeVotingModal = () => {
    dispatch(showVoteAgendaModal(false));
    setAgendaDetails({
      ...agendaDetails,
      agendaTitle: "",
      agendaId: "",
      agendaVotingID: 0,
      isvotingClosed: false,
      userID: 0,
      voteQuestion: "",
      votingResultDisplay: "",
      votingResultDisplayID: 0,
    });

    setOrganizersDropdown([]);
    setMeetingParticipants([]);
    setVotingResultDataList([]);

    setSaveOptions([
      { votingAnswer: "Pending", votingAnswerID: 0, isHidden: true },
      { votingAnswer: t("Yes"), votingAnswerID: 1, isHidden: false },
      { votingAnswer: t("No"), votingAnswerID: 2, isHidden: false },
    ]);
    dispatch(getAgendaVotingDetails_success([], ""));
    dispatch(showAllMeetingParticipantsSuccess([], "", false));
    localStorage.setItem("currentAgendaVotingID", 0);
  };

  console.log("Going in the agenda Details condition", agendaDetails);

  return (
    <section>
      <Modal
        show={NewMeetingreducer.voteAgendaModal}
        setShow={closeVotingModal}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={closeVotingModal}
        size={"lg"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className={styles["OVer_padding"]}>
                <Row>
                  <Col lg={7} md={7} sm={7} className='d-flex gap-2'>
                    <img src={Cast} height='25.85px' width='25.85px' alt='' />
                    <span className={styles["Voter_modal_heading"]}>
                      {t("Add-vote-item")}
                    </span>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={5}
                    className='d-flex justify-content-end gap-2 align-items-center'>
                    <span className={styles["Vote_switch_heading"]}>
                      {t("Voting") + ":"}
                    </span>
                    <Switch
                      onChange={handleVotingChange}
                      checkedValue={agendaDetails.isvotingClosed}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} className='m-0 p-0'>
                <span className={styles["Bottom_line"]}></span>
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className={styles["OVer_padding"]}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Vote_title"]}>
                      {agendaDetails.agendaTitle}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Vote_question_heading"]}>
                      {t("Vote-question")} <span>*</span>
                    </span>
                  </Col>
                </Row>
                <Row className='mt-2'>
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      applyClass={
                        // error
                        //   ? "text-area-close-New_meeting_error"
                        //   :
                        "text-area-close-New_meeting"
                      }
                      labelclass={"d-none"}
                      type='text'
                      as={"textarea"}
                      value={agendaDetails.voteQuestion}
                      maxLength={500}
                      name={"description"}
                      rows='2'
                      placeholder={t("Question")}
                      required={true}
                      change={handleChange}
                    />
                  </Col>
                  <Row>
                    <Col>
                      <p
                        className={
                          errorShow && agendaDetails.voteQuestion === ""
                            ? ` ${styles["errorMessage-inLogin"]} `
                            : `${styles["errorMessage-inLogin_hidden"]}`
                        }>
                        {t("Please-enter-vote-question")}
                      </p>
                    </Col>
                  </Row>
                </Row>
                <Row className='mt-2'>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Vote_question_heading"]}>
                      {t("Vote-answer")} <span>*</span>
                    </span>
                  </Col>
                </Row>
                {addOptions ? (
                  <>
                    <Row>
                      <Col lg={8} md={8} sm={8}>
                        <TextField
                          labelclass={"d-none"}
                          applyClass={"NewMeetingFileds"}
                          value={voteAnswerValue}
                          change={(e) => handleOptionTextChange(e)}
                        />
                      </Col>
                      <Col lg={2} md={2} sm={2}>
                        <Button
                          text={t("Cancel")}
                          className={styles["Cancell_Btn"]}
                          onClick={cancelButtonFunc}
                        />
                      </Col>
                      <Col lg={2} md={2} sm={2}>
                        <Button
                          text={t("Save")}
                          className={styles["Save_btn"]}
                          onClick={AddOptions}
                        />
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <Row className='mt-2'>
                      <Col
                        lg={1}
                        md={1}
                        sm={1}
                        className='d-flex align-items-center'>
                        <img
                          src={Leftploygon}
                          width='20px'
                          height='15px'
                          onClick={SlideLeft}
                          className='cursor-pointer'
                          alt=''
                        />
                      </Col>

                      <Col
                        lg={10}
                        md={10}
                        sm={10}
                        className='Scroller-x-Meeting'
                        id='Slider'>
                        <Col lg={1} md={1} sm={1}>
                          <Button
                            icon={
                              <Row className='m-2'>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className='d-flex justify-content-center align-items-center p-0'>
                                  <img
                                    src={Plus}
                                    height='20.68px'
                                    width='20.68px'
                                    className={styles["IconClass"]}
                                    alt=''
                                  />
                                </Col>
                              </Row>
                            }
                            className={styles["plus_button"]}
                            onClick={plusButtonFunc}
                          />
                        </Col>
                        <Col lg={10} md={10} sm={10}>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className='d-flex gap-2 '>
                              {saveOptions.length > 0
                                ? saveOptions.map((data, index) => {
                                    if (!data.isHidden) {
                                      return (
                                        <span
                                          className='position-relative'
                                          key={index}>
                                          <TextField
                                            labelclass={"d-none"}
                                            applyClass={
                                              "NewMeetingFileds_withIcon"
                                            }
                                            change={(e) =>
                                              handleChangeVotingAnswer(e, index)
                                            }
                                            width={"145px"}
                                            value={data.votingAnswer}
                                            name={"OptionsAdded"}
                                            iconclassname={
                                              styles["ResCrossIcon"]
                                            }
                                            inputicon={
                                              <img
                                                src={redcrossIcon}
                                                height='21.79px'
                                                width='21.79px'
                                                className='cursor-pointer'
                                                alt=''
                                                onClick={() =>
                                                  handleCrossBtn(index)
                                                }
                                              />
                                            }
                                          />
                                        </span>
                                      );
                                    }
                                  })
                                : null}
                            </Col>
                          </Row>
                        </Col>
                      </Col>
                      <Col
                        lg={1}
                        md={1}
                        sm={1}
                        className='d-flex align-items-center'>
                        <img
                          src={Rightploygon}
                          width='20px'
                          height='15px'
                          onClick={Slideright}
                          className='cursor-pointer'
                          alt=''
                        />
                      </Col>
                    </Row>
                  </>
                )}
                <Row>
                  <Col lg={6} md={6} sm={6}>
                    <Row className='mt-2'>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Vote_modal_heading"]}>
                          {t(
                            "Allow-the-following-individual-to-open/close-voting"
                          )}
                          <span>*</span>
                        </span>
                      </Col>
                    </Row>
                    <Row className='mt-2'>
                      <Col lg={12} md={12} sm={12}>
                        <Select
                          options={organizerDropdown}
                          onChange={dropDownSelectOrganizers}
                          value={IsOrganizer !== null ? IsOrganizer : null}
                          classNamePrefix={"SelectOrganizersSelect_active"}
                          placeholder={t("Add-organizer")}
                          isSearchable={false}
                        />
                      </Col>
                      <Row>
                        <Col>
                          <p
                            className={
                              errorShow && agendaDetails.userID === 0
                                ? ` ${styles["errorMessage-inLogin"]} `
                                : `${styles["errorMessage-inLogin_hidden"]}`
                            }>
                            {t("Please-select-organizers")}
                          </p>
                        </Col>
                      </Row>
                    </Row>
                  </Col>
                  <Col lg={6} md={6} sm={6}>
                    <Row className='mt-2'>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Vote_modal_heading"]}>
                          {t("Results-viewing-option-in-member-portal")}
                          <span>*</span>
                        </span>
                      </Col>
                    </Row>
                    <Row className='mt-2'>
                      <Col lg={12} md={12} sm={12}>
                        <Select
                          options={votingResultDataList}
                          classNamePrefix={"SelectOptions_drop_active"}
                          onChange={dropDownSelectOptions}
                          placeholder={t("Select-option")}
                          value={
                            agendaDetails.votingResultDisplayID === 0
                              ? null
                              : {
                                  value: agendaDetails.votingResultDisplayID,
                                  label: agendaDetails.votingResultDisplay,
                                }
                          }
                          isSearchable={false}
                        />
                      </Col>
                      <Row>
                        <Col>
                          <p
                            className={
                              errorShow &&
                              agendaDetails.votingResultDisplayID === 0
                                ? ` ${styles["errorMessage-inLogin"]} `
                                : `${styles["errorMessage-inLogin_hidden"]}`
                            }>
                            {t("Please-select-any-one-option")}
                          </p>
                        </Col>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <Row className='mt-2'>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Members_Heading"]}>
                      {"Members"} <span>*</span>
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Table
                      column={MeetingColoumns}
                      scroll={{ y: "62vh" }}
                      pagination={false}
                      className='NewMeeting_table AgendaVoting'
                      rows={meetingParticipants}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row className='mt-4'>
              <Col
                lg={12}
                md={12}
                sm={12}
                className='d-flex justify-content-end gap-2'>
                <Button
                  text={t("Cancel")}
                  className={styles["Cancel_Vote_Modal"]}
                  onClick={openConfirmationModal}
                />
                <Button
                  text={t("Save")}
                  className={styles["Save_Vote_Modal"]}
                  onClick={handleVoteSaveModal}
                />
              </Col>
            </Row>
          </>
        }
      />
      <Notification open={open} setOpen={setOpen} />
    </section>
  );
};

export default VoteModal;
