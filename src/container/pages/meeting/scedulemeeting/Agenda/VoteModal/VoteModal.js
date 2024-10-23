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
  const [addOptions, setAddOptions] = useState(false);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [agendaDetails, setAgendaDetails] = useState({
    agendaTitle: "",
    agendaId: "",
    agendaVotingID: 2,
    isvotingClosed: false,
    userID: 0,
    voteQuestion: "",
    organizerUserID: 0,
    organizerUserName: "",
    votingResultDisplay: "",
    votingResultDisplayID: 0,
  });

  const [organizers, setOrganizers] = useState([]);

  const [votingResultDisplayData, setVotingResultDisplayData] = useState([]);

  // const [agendaVotingDetails, setAgendaVotingDetails] = useState([]);

  const [meetingParticipants, setMeetingParticipants] = useState([]);

  const [currentAgendaDetails, setCurrentAgendaDetails] = useState([]);

  const [saveOptions, setSaveOptions] = useState([
    { votingAnswer: "Pending", votingAnswerID: 0 },
    { votingAnswer: "Yes", votingAnswerID: 1 },
    { votingAnswer: "No", votingAnswerID: 2 },
  ]);

  const [voteModalAttrbutes, setVoteModalAttrbutes] = useState({
    voteQuestion: "",
    Answer: "",
    OptionsAdded: "",
    SelectOrganizers: 0,
    SelectOptions: 0,
    YesAnswer: "Yes",
    NOAnswer: "No",
    AbstainAnswer: "Abstain",
    Pending: "Pending",
  });

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
      (option) => option.votingAnswer === saveOptions.votingAnswer
    );

    if (!optionExists) {
      setAddOptions(false);
      setSaveOptions([
        ...saveOptions,
        {
          votingAnswer: saveOptions.votingAnswer,
          votingAnswerID: 0,
        },
      ]);
      setAddOptions(false);
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

  const dropDownSelectOrganizers = (e) => {
    console.log("e.target dropdown", e);
    setAgendaDetails({
      ...agendaDetails,
      organizerUserID: e.value,
      organizerUserName: e.label,
    });
  };

  const dropDownSelectOptions = (e) => {
    console.log("e.target dropdown", e);
    setAgendaDetails({
      ...agendaDetails,
      votingResultDisplayID: e.value,
      votingResultDisplay: e.label,
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
    if (name === "Answer") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setVoteModalAttrbutes({
          ...voteModalAttrbutes,
          Answer: valueCheck,
        });
      } else {
        setVoteModalAttrbutes({
          ...voteModalAttrbutes,
          Answer: "",
        });
      }
    }
    if (name === "YesAnswers") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setVoteModalAttrbutes({
          ...voteModalAttrbutes,
          YesAnswer: valueCheck,
        });
      } else {
        setVoteModalAttrbutes({
          ...voteModalAttrbutes,
          YesAnswer: "",
        });
      }
    }
    if (name === "Noanswers") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setVoteModalAttrbutes({
          ...voteModalAttrbutes,
          NOAnswer: valueCheck,
        });
      } else {
        setVoteModalAttrbutes({
          ...voteModalAttrbutes,
          NOAnswer: "",
        });
      }
    }
    if (name === "AbstainAnswers") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setVoteModalAttrbutes({
          ...voteModalAttrbutes,
          AbstainAnswer: valueCheck,
        });
      } else {
        setVoteModalAttrbutes({
          ...voteModalAttrbutes,
          AbstainAnswer: "",
        });
      }
    }
    if (name === "Pending") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setVoteModalAttrbutes({
          ...voteModalAttrbutes,
          Pending: valueCheck,
        });
      } else {
        setVoteModalAttrbutes({
          ...voteModalAttrbutes,
          Pending: "",
        });
      }
    }
  };

  // Function for the Saved Add TExt filed
  const handleOptionTextChange = (e) => {
    let value = e.target.value;
    const updatedOptions = [...saveOptions];
    updatedOptions.votingAnswer = value;
    setSaveOptions(updatedOptions);
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
    let dataForAllOrganizers = { MeetingID: currentMeeting };
    let dataForAllMeetingParticipants = {
      MeetingID: currentMeeting,
    };
    dispatch(
      GetAllSavedparticipantsAPI(
        dataForAllMeetingParticipants,
        navigate,
        t,
        false
      )
    );

    dispatch(GetAllMeetingOrganizers(dataForAllOrganizers, navigate, t));
    dispatch(GetAllVotingResultDisplay(navigate, t));
  }, []);

  useEffect(() => {
    if (
      MeetingAgendaReducer.GetCurrentAgendaDetails !== null &&
      MeetingAgendaReducer.GetCurrentAgendaDetails !== undefined &&
      MeetingAgendaReducer.GetCurrentAgendaDetails.length !== 0
    ) {
      setCurrentAgendaDetails(MeetingAgendaReducer.GetCurrentAgendaDetails);
    } else {
      setCurrentAgendaDetails([]);
    }
  }, [MeetingAgendaReducer.GetCurrentAgendaDetails]);

  useEffect(() => {
    if (currentAgendaDetails.length !== 0) {
      setAgendaDetails({
        ...agendaDetails,
        agendaTitle: currentAgendaDetails.title,
        agendaId: currentAgendaDetails.iD,
        agendaVotingID: currentAgendaDetails.agendaVotingID,
      });
    }
  }, [currentAgendaDetails]);

  useEffect(() => {
    if (currentAgendaVotingID === 0) {
      if (
        NewMeetingreducer.getAllSavedparticipants !== undefined &&
        NewMeetingreducer.getAllSavedparticipants !== null &&
        NewMeetingreducer.getAllSavedparticipants.length !== 0
      ) {
        setMeetingParticipants(NewMeetingreducer.getAllSavedparticipants);
      } else {
        setMeetingParticipants([]);
      }
    } else {
      if (
        MeetingAgendaReducer.MeetingAgendaVotingDetailsData !== undefined &&
        MeetingAgendaReducer.MeetingAgendaVotingDetailsData !== null &&
        MeetingAgendaReducer.MeetingAgendaVotingDetailsData.length !== 0
      ) {
        setMeetingParticipants(
          MeetingAgendaReducer.MeetingAgendaVotingDetailsData
            .agendaVotingDetails.votingMembers
        );
      } else {
        setMeetingParticipants([]);
      }
    }
  }, [
    NewMeetingreducer.getAllSavedparticipants,
    MeetingAgendaReducer.MeetingAgendaVotingDetailsData,
  ]);

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
    },
    {
      dataIndex: "userID",
      key: "userID",
      width: "80px",
      render: (text, record) => {
        if (record.userID) {
          return (
            <>
              <img
                src={redcrossIcon}
                height="21.79px"
                width="21.79px"
                className="cursor-pointer"
                draggable={false}
                onClick={() => deleteRow(record)}
                alt=""
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
      setOrganizers(
        MeetingOrganizersReducer.AllMeetingOrganizersData.meetingOrganizers
      );
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
      console.log(
        "matchedOrganizer",
        MeetingOrganizersReducer.AllMeetingOrganizersData.meetingOrganizers,
        MeetingAgendaReducer.MeetingAgendaVotingDetailsData.agendaVotingDetails
          .userID
      );
      const matchedOrganizer =
        MeetingOrganizersReducer.AllMeetingOrganizersData.meetingOrganizers.find(
          (obj) =>
            obj.userID ===
            MeetingAgendaReducer.MeetingAgendaVotingDetailsData
              .agendaVotingDetails.userID
        );
      console.log("matchedOrganizer", matchedOrganizer);
      if (matchedOrganizer !== undefined) {
        setAgendaDetails({
          ...agendaDetails,
          organizerUserID: matchedOrganizer.userID,
          organizerUserName: (
            <>
              <Row>
                <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                  <img
                    src={`data:image/jpeg;base64,${matchedOrganizer.userProfilePicture.displayProfilePictureName}`}
                    width="17px"
                    height="17px"
                    className={styles["Image_profile"]}
                    alt=""
                  />
                  <span className={styles["Participant_names"]}>
                    {matchedOrganizer.userName}
                  </span>
                </Col>
              </Row>
            </>
          ),
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
        agendaTitle: currentAgendaDetails.title,
        votingResultDisplay: agendaVotingDetails?.votingResultDisplay?.result,
        votingResultDisplayID:
          agendaVotingDetails?.votingResultDisplay?.votingResultDisplayID,
        agendaId: currentAgendaDetails.iD,
        agendaVotingID: agendaVotingDetails.agendaVotingID,
        isvotingClosed: false,
      });
      const newSaveOptions = [...saveOptions];
      let votingAnswerData = agendaVotingDetails.votingAnswers;

      if (Array.isArray(votingAnswerData)) {
        votingAnswerData.forEach((item) => {
          if (
            !newSaveOptions.some(
              (option) => option.votingAnswer === item.votingAnswer
            )
          ) {
            newSaveOptions.push({
              votingAnswer: item.votingAnswer,
              votingAnswerID: item.votingAnswerID,
              agendaID: item.agendaID,
            });
          }
        });
        setSaveOptions(newSaveOptions);
      } else {
        setSaveOptions(saveOptions);
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
      setVotingResultDisplayData(
        MeetingAgendaReducer.VotingResultDisplayData.votingResultDisplays
      );
    }
  }, [MeetingAgendaReducer.VotingResultDisplayData]);

  const optionsIndividualOpenCloseVoting = organizers.map((organizer) => ({
    value: organizer.userID,
    label: (
      <>
        <Row>
          <Col lg={12} md={12} sm={12} className="d-flex gap-2">
            <img
              src={`data:image/jpeg;base64,${organizer.userProfilePicture.displayProfilePictureName}`}
              width="17px"
              height="17px"
              className={styles["Image_profile"]}
              alt=""
            />
            <span className={styles["Participant_names"]}>
              {organizer.userName}
            </span>
          </Col>
        </Row>
      </>
    ),
  }));

  const options = votingResultDisplayData.map((votingResults) => ({
    value: votingResults.votingResultDisplayID,
    label: (
      <>
        <span>{votingResults.result}</span>
      </>
    ),
  }));

  const handleVoteSaveModal = () => {
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
    if (Object.keys(votingOptionData).length >= 2) {
      let Data = {
        MeetingID: currentMeeting,
        AgendaVoting: {
          AgendaVotingID: agendaDetails.agendaVotingID,
          AgendaID: agendaDetails.agendaId,
          VoteQuestion: agendaDetails.voteQuestion,
          VotingResultDisplayID: agendaDetails.votingResultDisplayID,
          IsVotingClosed: false,
          UserID: agendaDetails.organizerUserID,
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
        organizerUserID: 0,
        organizerUserName: "",
        votingResultDisplay: "",
        votingResultDisplayID: 0,
      });
      setVoteModalAttrbutes({
        ...voteModalAttrbutes,
        voteQuestion: "",
        Answer: "",
        OptionsAdded: "",
        SelectOrganizers: 0,
        SelectOptions: 0,
        YesAnswer: "Yes",
        NOAnswer: "No",
        AbstainAnswer: "Abstain",
        Pending: "Pending",
      });
      setOrganizers([]);
      setVotingResultDisplayData([]);
      setMeetingParticipants([]);
      setSaveOptions([
        { votingAnswer: "Pending", votingAnswerID: 0 },
        { votingAnswer: "Yes", votingAnswerID: 1 },
        { votingAnswer: "No", votingAnswerID: 2 },
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
      organizerUserID: 0,
      organizerUserName: "",
      votingResultDisplay: "",
      votingResultDisplayID: 0,
    });
    setVoteModalAttrbutes({
      ...voteModalAttrbutes,
      voteQuestion: "",
      Answer: "",
      OptionsAdded: "",
      SelectOrganizers: 0,
      SelectOptions: 0,
      YesAnswer: "Yes",
      NOAnswer: "No",
      AbstainAnswer: "Abstain",
      Pending: "Pending",
    });
    setOrganizers([]);
    setVotingResultDisplayData([]);
    setMeetingParticipants([]);
    setSaveOptions([
      { votingAnswer: "Pending", votingAnswerID: 0 },
      { votingAnswer: "Yes", votingAnswerID: 1 },
      { votingAnswer: "No", votingAnswerID: 2 },
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
                  <Col lg={7} md={7} sm={7} className="d-flex gap-2">
                    <img src={Cast} height="25.85px" width="25.85px" alt="" />
                    <span className={styles["Voter_modal_heading"]}>
                      {t("Add-vote-item")}
                    </span>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={5}
                    className="d-flex justify-content-end gap-2 align-items-center"
                  >
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
              <Col lg={12} md={12} sm={12} className="m-0 p-0">
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
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      applyClass={
                        // error
                        //   ? "text-area-close-New_meeting_error"
                        //   :
                        "text-area-close-New_meeting"
                      }
                      labelclass={"d-none"}
                      type="text"
                      as={"textarea"}
                      value={agendaDetails.voteQuestion}
                      maxLength={500}
                      name={"description"}
                      rows="2"
                      placeholder={t("Question")}
                      required={true}
                      change={handleChange}
                    />
                  </Col>
                  <Row>
                    <Col>
                      <p
                        className={
                          // error && agendaDetails.voteQuestion === ""
                          //   ? ` ${styles["errorMessage-inLogin"]} `
                          //   :
                          `${styles["errorMessage-inLogin_hidden"]}`
                        }
                      >
                        {t("Please-enter-vote-question")}
                      </p>
                    </Col>
                  </Row>
                </Row>
                <Row className="mt-2">
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
                          value={saveOptions.votingAnswer}
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
                    <Row className="mt-2">
                      <Col
                        lg={1}
                        md={1}
                        sm={1}
                        className="d-flex align-items-center"
                      >
                        <img
                          src={Leftploygon}
                          width="20px"
                          height="15px"
                          onClick={SlideLeft}
                          className="cursor-pointer"
                          alt=""
                        />
                      </Col>

                      <Col
                        lg={10}
                        md={10}
                        sm={10}
                        className="Scroller-x-Meeting"
                        id="Slider"
                      >
                        <Col lg={2} md={2} sm={2}>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <Button
                                icon={
                                  <Row className="m-2">
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="d-flex justify-content-center align-items-center p-0"
                                    >
                                      <img
                                        src={Plus}
                                        height="20.68px"
                                        width="20.68px"
                                        className={styles["IconClass"]}
                                        alt=""
                                      />
                                    </Col>
                                  </Row>
                                }
                                className={styles["plus_button"]}
                                onClick={plusButtonFunc}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={10} md={10} sm={10}>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex gap-2 "
                            >
                              {saveOptions.length > 0
                                ? saveOptions.map((data, index) => {
                                    return (
                                      <span
                                        className="position-relative"
                                        key={index}
                                      >
                                        {data.votingAnswer === "Pending" ? (
                                          <TextField
                                            labelclass={"d-none"}
                                            applyClass={
                                              "NewMeetingFileds_withIcon"
                                            }
                                            width={"145px"}
                                            change={(e) =>
                                              handleChangeVotingAnswer(e, index)
                                            }
                                            value={data.votingAnswer}
                                            name={"OptionsAdded"}
                                            iconclassname={
                                              styles["ResCrossIcon"]
                                            }
                                            disable={true}
                                          />
                                        ) : (
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
                                                height="21.79px"
                                                width="21.79px"
                                                className="cursor-pointer"
                                                alt=""
                                                onClick={() =>
                                                  handleCrossBtn(index)
                                                }
                                              />
                                            }
                                          />
                                        )}
                                      </span>
                                    );
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
                        className="d-flex align-items-center"
                      >
                        <img
                          src={Rightploygon}
                          width="20px"
                          height="15px"
                          onClick={Slideright}
                          className="cursor-pointer"
                          alt=""
                        />
                      </Col>
                    </Row>
                  </>
                )}
                <Row>
                  <Col lg={6} md={6} sm={6}>
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Vote_modal_heading"]}>
                          {t(
                            "Allow-the-following-individual-to-open/close-voting"
                          )}
                          <span>*</span>
                        </span>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <Select
                          options={optionsIndividualOpenCloseVoting}
                          onChange={dropDownSelectOrganizers}
                          value={{
                            value: agendaDetails.organizerUserID,
                            label: agendaDetails.organizerUserName,
                          }}
                          classNamePrefix={"SelectOrganizersSelect_active"}
                          isSearchable={false}
                        />
                      </Col>
                      <Row>
                        <Col>
                          <p
                            className={
                              // error && voteModalAttrbutes.SelectOrganizers === 0
                              //   ? ` ${styles["errorMessage-inLogin"]} `
                              //   :
                              `${styles["errorMessage-inLogin_hidden"]}`
                            }
                          >
                            {t("Please-select-organizers")}
                          </p>
                        </Col>
                      </Row>
                    </Row>
                  </Col>
                  <Col lg={6} md={6} sm={6}>
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Vote_modal_heading"]}>
                          {t("Results-viewing-option-in-member-portal")}
                          <span>*</span>
                        </span>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <Select
                          options={options}
                          classNamePrefix={"SelectOptions_drop_active"}
                          onChange={dropDownSelectOptions}
                          value={{
                            value: agendaDetails.votingResultDisplayID,
                            label: agendaDetails.votingResultDisplay,
                          }}
                          isSearchable={false}
                        />
                      </Col>
                      <Row>
                        <Col>
                          <p
                            className={
                              // error && voteModalAttrbutes.SelectOptions === 0
                              //   ? ` ${styles["errorMessage-inLogin"]} `
                              //   :
                              `${styles["errorMessage-inLogin_hidden"]}`
                            }
                          >
                            {t("Please-select-any-one-option")}
                          </p>
                        </Col>
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-2">
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
                      className="NewMeeting_table AgendaVoting"
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
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
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
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
    </section>
  );
};

export default VoteModal;
