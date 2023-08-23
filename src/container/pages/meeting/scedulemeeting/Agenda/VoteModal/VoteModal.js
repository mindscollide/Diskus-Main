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
import { useNavigate } from "react-router-dom";
import Cast from "../../../../../../assets/images/CAST.svg";
import { showVoteAgendaModal } from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import redcrossIcon from "../../../../../../assets/images/Artboard 9.png";
import Leftploygon from "../../../../../../assets/images/leftdirection.svg";
import Rightploygon from "../../../../../../assets/images/rightdirection.svg";
import Plus from "../../../../../../assets/images/Meeting plus.png";
import profile from "../../../../../../assets/images/newprofile.png";
const VoteModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [addOptions, setAddOptions] = useState(false);
  const [saveOptions, setSaveOptions] = useState([{ Options: null }]);
  const plusButtonFunc = () => {
    setAddOptions(true);
  };
  const cancelButtonFunc = () => {
    setAddOptions(false);
  };
  const data = [
    {
      key: "1",
      Name: <label className={styles["Title_desc"]}>Muhammad Saif</label>,
      Role: <label className="column-boldness">Content Writer</label>,
      Email: <label className="column-boldness">muhammadsaif@gmail.com</label>,
      Button: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              <img src={redcrossIcon} height="21.79px" width="21.79px" />
            </Col>
          </Row>
        </>
      ),
    },
  ];
  const [rowsData, setRowsData] = useState(data);
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
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Button text={t("Add-more")} className={styles["Add_more_Btn"]} />
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Button",
      key: "Button",
      width: "100px",
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
    setSaveOptions([...saveOptions, { Options: saveOptions.value }]);
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
                    <img src={Cast} height="25.85px" width="25.85px" />
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
                      applyClass="text-area-close-New_meeting"
                      labelClass={"d-none"}
                      type="text"
                      as={"textarea"}
                      maxLength={500}
                      rows="2"
                      placeholder={t("Description")}
                      required={true}
                    />
                  </Col>
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
                          labelClass={"d-none"}
                          applyClass={"NewMeetingFileds"}
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
                                labelClass={"d-none"}
                                applyClass={"NewMeetingFileds"}
                                width={"145px"}
                              />
                              <TextField
                                labelClass={"d-none"}
                                applyClass={"NewMeetingFileds"}
                                width={"145px"}
                              />

                              {saveOptions.length > 0
                                ? saveOptions.map((data, index) => {
                                    return (
                                      <>
                                        <>
                                          <span className="position-relative">
                                            <TextField
                                              labelClass={"d-none"}
                                              applyClass={
                                                "NewMeetingFileds_withIcon"
                                              }
                                              width={"145px"}
                                              value={saveOptions.Options}
                                              iconClassName={
                                                styles["ResCrossIcon"]
                                              }
                                              inputicon={
                                                <img
                                                  src={redcrossIcon}
                                                  height="21.79px"
                                                  width="21.79px"
                                                />
                                              }
                                            />
                                          </span>
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
                        <Select options={optionsIndividualOpenCloseVoting} />
                      </Col>
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
                        <Select options={options} />
                      </Col>
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
                />
                <Button
                  text={t("Save")}
                  className={styles["Save_Vote_Modal"]}
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
