import React, { useState } from "react";
import {
  Modal,
  Button,
  Switch,
  TextField,
  Table,
} from "../../../../../../components/elements";
import { Checkbox } from "antd";
import styles from "./VoteModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Cast from "../../../../../../assets/images/CAST.svg";
import {
  showVoteAgendaModal,
  showVoteConfirmationModal,
} from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import redcrossIcon from "../../../../../../assets/images/Artboard 9.png";
import Leftploygon from "../../../../../../assets/images/leftdirection.svg";
import Rightploygon from "../../../../../../assets/images/rightdirection.svg";
import Plus from "../../../../../../assets/images/Meeting plus.png";
import profile from "../../../../../../assets/images/newprofile.png";
import { validateInput } from "../../../../../../commen/functions/regex";
const VoteModal = ({ setenableVotingPage }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [addOptions, setAddOptions] = useState(false);
  const [saveOptions, setSaveOptions] = useState([{ text: "" }]);
  const [voteModalAttrbutes, setVoteModalAttrbutes] = useState({
    VoteQuestion: "",
    Answer: "",
    OptionsAdded: "",
    SelectOrganizers: 0,
    SelectOptions: 0,
    YesAnswer: "Yes",
    NOAnswer: "No",
    AbstainAnswer: "Abstain",
  });
  const plusButtonFunc = () => {
    setAddOptions(true);
  };
  const cancelButtonFunc = () => {
    setAddOptions(false);
  };

  const [rowsData, setRowsData] = useState([]);
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
      dataIndex: "Name",
      key: "Name",
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
      dataIndex: "Role",
      key: "Role",
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
      dataIndex: "Email",
      key: "Email",
      width: "150px",
    },
    {
      title: (
        <>
          <Button
            text={
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Add_more_Class"]}
                  >
                    <span>{t("Add-more")}</span>
                  </Col>
                </Row>
              </>
            }
            className={styles["Add_more_Btn"]}
          />
        </>
      ),
      dataIndex: "Button",
      key: "Button",
      width: "80px",
    },
  ];

  const SlideLeft = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft - 300;
  };

  const Slideright = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft + 300;
  };

  const AddOptions = () => {
    setAddOptions(false);
    setSaveOptions([...saveOptions, saveOptions.text]);
  };

  const optionsIndividualOpenCloseVoting = [
    {
      value: "memebers",
      label: (
        <>
          <Row>
            <Col lg={1} md={1} sm={1} className="">
              <Checkbox></Checkbox>
            </Col>
            <Col lg={11} md={11} sm={11} className="d-flex gap-2">
              <img
                src={profile}
                alt=""
                width="17px"
                height="17px"
                className={styles["Image_profile"]}
              />
              <span className={styles["Participant_names"]}>Oliver Davis</span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: "memebers",
      label: (
        <>
          <Row>
            <Col lg={1} md={1} sm={1} className="">
              <Checkbox></Checkbox>
            </Col>
            <Col lg={11} md={11} sm={11} className="d-flex gap-2">
              <img
                src={profile}
                alt=""
                width="17px"
                height="17px"
                className={styles["Image_profile"]}
              />
              <span className={styles["Participant_names"]}>Oliver Davis</span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: "memebers",
      label: (
        <>
          <Row>
            <Col lg={1} md={1} sm={1} className="">
              <Checkbox></Checkbox>
            </Col>
            <Col lg={11} md={11} sm={11} className="d-flex gap-2">
              <img
                src={profile}
                alt=""
                width="17px"
                height="17px"
                className={styles["Image_profile"]}
              />
              <span className={styles["Participant_names"]}>Oliver Davis</span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: "memebers",
      label: (
        <>
          <Row>
            <Col lg={1} md={1} sm={1} className="">
              <Checkbox></Checkbox>
            </Col>
            <Col lg={11} md={11} sm={11} className="d-flex gap-2">
              <img
                src={profile}
                alt=""
                width="17px"
                height="17px"
                className={styles["Image_profile"]}
              />
              <span className={styles["Participant_names"]}>Oliver Davis</span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: "memebers",
      label: (
        <>
          <Row>
            <Col lg={1} md={1} sm={1} className="">
              <Checkbox></Checkbox>
            </Col>
            <Col lg={11} md={11} sm={11} className="d-flex gap-2">
              <img
                src={profile}
                alt=""
                width="17px"
                height="17px"
                className={styles["Image_profile"]}
              />
              <span className={styles["Participant_names"]}>Oliver Davis</span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: "memebers",
      label: (
        <>
          <Row>
            <Col lg={1} md={1} sm={1} className="">
              <Checkbox></Checkbox>
            </Col>
            <Col lg={11} md={11} sm={11} className="d-flex gap-2">
              <img
                src={profile}
                alt=""
                width="17px"
                height="17px"
                className={styles["Image_profile"]}
              />
              <span className={styles["Participant_names"]}>Oliver Davis</span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: "memebers",
      label: (
        <>
          <Row>
            <Col lg={1} md={1} sm={1} className="">
              <Checkbox></Checkbox>
            </Col>
            <Col lg={11} md={11} sm={11} className="d-flex gap-2">
              <img
                src={profile}
                alt=""
                width="17px"
                height="17px"
                className={styles["Image_profile"]}
              />
              <span className={styles["Participant_names"]}>Oliver Davis</span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: "memebers",
      label: (
        <>
          <Row>
            <Col lg={1} md={1} sm={1} className="">
              <Checkbox></Checkbox>
            </Col>
            <Col lg={11} md={11} sm={11} className="d-flex gap-2">
              <img
                src={profile}
                alt=""
                width="17px"
                height="17px"
                className={styles["Image_profile"]}
              />
              <span className={styles["Participant_names"]}>Oliver Davis</span>
            </Col>
          </Row>
        </>
      ),
    },
  ];
  const options = [
    {
      value: "ShowCount",
      label: (
        <>
          <span>{t("Show-count")}</span>
        </>
      ),
    },
    {
      value: "ShowPercentage",
      label: (
        <>
          <span>{t("Show-percentage")}</span>
        </>
      ),
    },
    {
      value: "VoteBymembers",
      label: (
        <>
          <span>{t("Vote-by-members")}</span>
        </>
      ),
    },
  ];

  const openConfirmationModal = () => {
    dispatch(showVoteAgendaModal(false));
    dispatch(showVoteConfirmationModal(true));
  };

  const handleCrossBtn = (index) => {
    let optionscross = [...saveOptions];
    optionscross.splice(optionscross, index);
    setSaveOptions(optionscross);
  };

  const handleVoteSaveModal = () => {
    dispatch(showVoteAgendaModal(false));
    setenableVotingPage(true);
  };

  const dropDownSelectOrganizers = (e) => {
    setVoteModalAttrbutes({
      ...voteModalAttrbutes,
      SelectOrganizers: e.value,
    });
  };

  const dropDownSelectOptions = (e) => {
    setVoteModalAttrbutes({
      ...voteModalAttrbutes,
      SelectOptions: e.value,
    });
  };

  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "description") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setVoteModalAttrbutes({
          ...voteModalAttrbutes,
          VoteQuestion: valueCheck,
        });
      } else {
        setVoteModalAttrbutes({
          ...voteModalAttrbutes,
          VoteQuestion: "",
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
  };

  // Function for the Saved Add TExt filed
  const handleOptionTextChange = (e) => {
    let value = e.target.value;
    console.log(value, "handleOptionTextChangehandleOptionTextChange");
    const updatedOptions = [...saveOptions];
    updatedOptions.text = value;
    console.log(updatedOptions, "updatedOptionsupdatedOptions");
    setSaveOptions(updatedOptions);
  };

  return (
    <section>
      <Modal
        show={NewMeetingreducer.voteAgendaModal}
        setShow={dispatch(showVoteAgendaModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showVoteAgendaModal(false));
        }}
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
                    <Switch />
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
                      Get new computers from Techno City Mall. Also, Get a ne...
                      Get new computers from Techno City Mall. Also, Get a ne...
                      Get new computers from Techno City Mall. Also, Get a ne...
                      Get new computers from Techno City Mall. Also, Get a ne...
                      Get new computers from Techno City Mall. Also, Get a ne...
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
                      applyClass={ "text-area-close-New_meeting"
                      }
                      labelclass={"d-none"}
                      type="text"
                      as={"textarea"}
                      value={voteModalAttrbutes.VoteQuestion}
                      maxLength={500}
                      name={"description"}
                      rows="2"
                      placeholder={t("Description")}
                      required={true}
                      change={HandleChange}
                    />
                  </Col>
                  <Row>
                    <Col>
                      <p
                        className={ voteModalAttrbutes.VoteQuestion === ""
                            ? ` ${styles["errorMessage-inLogin"]} `
                            : `${styles["errorMessage-inLogin_hidden"]}`
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
                          value={saveOptions.text}
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
                          alt=""
                          width="20px"
                          height="15px"
                          onClick={SlideLeft}
                          className="cursor-pointer"
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
                                        alt=""
                                        height="20.68px"
                                        width="20.68px"
                                        className={styles["IconClass"]}
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
                              <TextField
                                labelclass={"d-none"}
                                applyClass={"NewMeetingFileds"}
                                width={"145px"}
                                name={"YesAnswers"}
                                value={voteModalAttrbutes.YesAnswer}
                                change={HandleChange}
                              />
                              <TextField
                                labelclass={"d-none"}
                                applyClass={"NewMeetingFileds"}
                                width={"145px"}
                                name={"NOAnswers"}
                                value={voteModalAttrbutes.NOAnswer}
                                change={HandleChange}
                              />
                              <TextField
                                labelclass={"d-none"}
                                applyClass={"NewMeetingFileds"}
                                width={"145px"}
                                name={"AbstainAnswers"}
                                value={voteModalAttrbutes.AbstainAnswer}
                                change={HandleChange}
                              />

                              {saveOptions.length > 0
                                ? saveOptions.map((data, index) => {
                                    return (
                                      <>
                                        <>
                                          {index === 0 ? null : (
                                            <>
                                              <span className="position-relative">
                                                <TextField
                                                  labelclass={"d-none"}
                                                  applyClass={
                                                    "NewMeetingFileds_withIcon"
                                                  }
                                                  width={"145px"}
                                                  value={data}
                                                  name={"OptionsAdded"}
                                                  iconclassname={
                                                    styles["ResCrossIcon"]
                                                  }
                                                  inputicon={
                                                    <img
                                                      src={redcrossIcon}
                                                      alt=""
                                                      height="21.79px"
                                                      width="21.79px"
                                                      className="cursor-pointer"
                                                      onClick={() =>
                                                        handleCrossBtn(index)
                                                      }
                                                    />
                                                  }
                                                />
                                              </span>
                                            </>
                                          )}
                                        </>
                                      </>
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
                          alt=""
                          width="20px"
                          height="15px"
                          onClick={Slideright}
                          className="cursor-pointer"
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
                          classNamePrefix={"SelectOrganizersSelect_active"}
                          isSearchable={false}
                        />
                      </Col>
                      <Row>
                        <Col>
                          <p
                            className={voteModalAttrbutes.SelectOrganizers === 0
                                ? ` ${styles["errorMessage-inLogin"]} `
                                : `${styles["errorMessage-inLogin_hidden"]}`
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
                          isSearchable={false}
                        />
                      </Col>
                      <Row>
                        <Col>
                          <p
                            className={voteModalAttrbutes.SelectOptions === 0
                                ? ` ${styles["errorMessage-inLogin"]} `
                                : `${styles["errorMessage-inLogin_hidden"]}`
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
                      className="NewMeeting_table"
                      rows={rowsData}
                    />
                    <Row>
                      <Col>
                        <p
                          className={rowsData.length <= 0
                              ? ` ${styles["errorMessage-inLogin"]} `
                              : `${styles["errorMessage-inLogin_hidden"]}`
                          }
                        >
                          {t("Please-add-members")}
                        </p>
                      </Col>
                    </Row>
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
    </section>
  );
};

export default VoteModal;
