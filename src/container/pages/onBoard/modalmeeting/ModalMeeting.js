import React, { useState } from "react";
import "./ModalMeeting.css";
import {
  TextField,
  Button,
  Checkbox,
  CustomOnboardModal,
  TimePickers,
  EmployeeCard,
  InputSearchFilter,
  CustomDatePicker,
} from "../../../../components/elements";

import { TimeHHMMFormat } from "../../../../commen/functions/date_formater";
import moment from "moment";
import CustomUpload from "../../../../components/elements/upload/Upload";
import FileIcon, { defaultStyles } from "react-file-icon";
import { Row, Col, Container } from "react-bootstrap";
import { CameraVideo } from "react-bootstrap-icons";
import { useTour } from "@reactour/tour";
import { useSelector, useDispatch } from "react-redux";
import {
  showModalOnboard,
  showIsDetailOnboard,
  showIsAgendaOnboard,
  showIsAttendeesOnboard,
  showModalStepsOnboard,
} from "../../../../store/actions/OnBoardStates";
import { useTranslation } from "react-i18next";
import ReactSelect from "react-select";
const ModalMeeting = ({ ModalTitle }) => {
  //For Localization
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { OnBoardModal } = state;
  const { setCurrentStep } = useTour();

  let meetingDateTime =
    TimeHHMMFormat("010101") + ", " + moment("20220505").format("Do MMM, YYYY");

  const changeSelectDetails = () => {
    dispatch(showIsDetailOnboard(true));
    dispatch(showIsAgendaOnboard(false));
    dispatch(showIsAttendeesOnboard(false));
    console.log("Pehla Buton");
  };

  const changeSelectAgenda = () => {
    dispatch(showIsDetailOnboard(false));
    dispatch(showIsAgendaOnboard(true));
    dispatch(showIsAttendeesOnboard(false));
    console.log("Dusra Buton");
  };

  const changeSelectAttendees = () => {
    dispatch(showIsDetailOnboard(false));
    dispatch(showIsAgendaOnboard(false));
    dispatch(showIsAttendeesOnboard(true));
    console.log("3 Buton");
  };

  const navigateToAttendees = () => {
    dispatch(showIsDetailOnboard(false));
    dispatch(showIsAgendaOnboard(false));
    dispatch(showIsAttendeesOnboard(true));
    console.log("agayaattendee");
  };
  const finishTOurButton = () => {
    setCurrentStep(4);
    dispatch(showModalStepsOnboard(false));
    dispatch(showIsDetailOnboard(true));
    dispatch(showIsAttendeesOnboard(false));
    dispatch(showModalOnboard(false));
  };
  return (
    <>
      <Container>
        <CustomOnboardModal
          show={OnBoardModal.show}
          datatut={"meeting-modal"}
          size="md"
          ButtonTitle={ModalTitle}
          ModalBody={
            <>
              <Row className="onboard-details-btn">
                <Col lg={2} md={2} xs={6}>
                  <Button
                    className={
                      OnBoardModal.isDetails
                        ? "btn btn-primary modal-isDetail-upperBtn"
                        : "btn btn-outline-primary modal-isDetail-upperBtn"
                    }
                    text={t("Details")}
                    onClick={changeSelectDetails}
                  />
                </Col>
                <Col lg={2} md={2} xs={6}>
                  <Button
                    className={
                      OnBoardModal.isAgenda
                        ? "btn btn-primary meeting"
                        : "btn btn-outline-primary meeting"
                    }
                    variant={"Primary"}
                    text={t("Agendas")}
                    onClick={changeSelectAgenda}
                    datatut="show-agenda"
                    disableBtn={true}
                  />
                </Col>
                <Col lg={2} md={2} xs={6}>
                  <Button
                    className={
                      OnBoardModal.isAttendees
                        ? "btn btn-primary meeting onboard_atthendees_btn"
                        : "btn btn-outline-primary meeting onboard_atthendees_btn"
                    }
                    variant={"Primary"}
                    text={t("Attendees")}
                    datatut="show-meeting-attendees"
                    onClick={changeSelectAttendees}
                    disableBtn={true}
                  ></Button>
                </Col>
              </Row>
              {OnBoardModal.isDetails ? (
                <>
                  <Row className="mt-3">
                    <Col lg={2} md={2} xs={12} className="CreateMeetingTime">
                      <TimePickers value={"12:15:23"} disable />
                    </Col>
                    <Col lg={2} md={2} xs={12} className="onboard-date-picker">
                      <CustomDatePicker
                        name="MeetingDate"
                        value={meetingDateTime}
                        disabled
                      />
                    </Col>
                    <Col lg={4} md={4} xs={12}></Col>
                    <Col lg={4} md={4} xs={12}>
                      <ReactSelect isDisabled={true} value={t("10 minutes")} />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={1} md={1} xs={12}>
                      <Button
                        text={<CameraVideo />}
                        name="IsVideoCall"
                        className="onboard_detail_camera"
                      />
                    </Col>
                    <Col lg={7} md={7} xs={12} className="CreateMeetingInput">
                      <TextField
                        name="MeetingLocation"
                        applyClass="form-control2"
                        type="text"
                        value={t("Islamabad")}
                        disable
                      />
                    </Col>

                    <Col lg={4} md={4} xs={12} className="UpdateCheckbox mt-2">
                      <Checkbox
                        className="SearchCheckbox"
                        name="IsChat"
                        label={t("Group-chat")}
                        checked={true}
                        classNameDiv="checkboxParentClass"
                      ></Checkbox>
                    </Col>
                  </Row>

                  <Row className="onboard_detail_meetingtitle">
                    <Col lg={12} md={12} xs={12} className="CreateMeetingInput">
                      <TextField
                        name="MeetingTitle"
                        applyClass={"form-control2"}
                        type="text"
                        size="small"
                        value={t("On-board-discussion")}
                        disable
                      />
                    </Col>
                  </Row>

                  <Row className="onboard_detail_description">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="CreateMeetingInput textAreaDiv"
                    >
                      <TextField
                        name="MeetingDescription"
                        applyClass="form-control2 onboard_detail_description_input"
                        type="text"
                        as={"textarea"}
                        rows="5"
                        value={t(
                          "This-meeting-is-create-for-important-discussion-regarding-diskus"
                        )}
                        disable
                      />
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="d-flex justify-content-end"
                    >
                      <Button className={"next-btn"} text={t("Next")} />
                    </Col>
                  </Row>
                </>
              ) : OnBoardModal.isAgenda ? (
                <>
                  <div data-tut="show-attendees" className="onboard_agenda">
                    <Row>
                      <Col
                        lg={7}
                        md={7}
                        xs={12}
                        className="CreateMeetingAgenda margin-bottom-10"
                      >
                        <TextField
                          disable={true}
                          applyClass="form-control2"
                          type="text"
                          placeholder={"Software Requirements"}
                        />
                      </Col>
                      <Col
                        lg={5}
                        md={5}
                        xs={12}
                        className="CreateMeetingAgenda"
                      >
                        <TextField
                          disable={true}
                          applyClass="form-control2"
                          type="text"
                          placeholder={"Reminder"}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="CreateMeetingAgenda"
                      >
                        <TextField
                          disable={true}
                          applyClass="form-control2"
                          type="text"
                          placeholder={"www.google.com"}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="d-flex justify-content-start flex-column margin-left-5"
                      >
                        <label>Attachment</label>
                        <span className="custom-upload-input">
                          <CustomUpload
                            className="UploadFileButton"
                            disable={true}
                          />
                        </span>
                      </Col>
                    </Row>

                    <Row>
                      <Col sm={12} lg={3} md={3} className="onboard_fileIcon">
                        <FileIcon
                          extension={"png"}
                          {...defaultStyles["png"]}
                        ></FileIcon>
                      </Col>
                      <Col sm={12} lg={9} md={9} />
                    </Row>
                  </div>

                  <Row className="mt-5">
                    <Col lg={6} md={6} xs={6} className="onboard_addAgenda">
                      <Button
                        className={"btn btn-primary addAgenda"}
                        text={"+" + t("Add Agenda")}
                        disableBtn={true}
                      />
                    </Col>
                    <Col
                      lg={6}
                      md={6}
                      xs={6}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        onClick={navigateToAttendees}
                        className={"btn btn-primary meeting next"}
                        text="Next"
                        disableBtn={true}
                      />
                    </Col>
                  </Row>
                </>
              ) : OnBoardModal.isAttendees ? (
                <>
                  <Row className="onboard_attendees">
                    <Col
                      lg={5}
                      md={5}
                      xs={12}
                      className="inputSearchFilter CreateMeetingParticipant margin-top-15 margin-bottom-10"
                    >
                      <InputSearchFilter
                        placeholder={t("Add-attendees")}
                        value={"Yaqoob"}
                        disable
                      />
                    </Col>
                    <Col
                      lg={4}
                      md={4}
                      xs={12}
                      className="CreateMeetingReminder margin-top-15 margin-bottom-10"
                    >
                      <ReactSelect value={"Organizer"} isDisabled={true} />
                    </Col>
                    <Col
                      lg={3}
                      md={3}
                      xs={12}
                      className="onboard_add_attendees_btn"
                    >
                      <Button
                        disableBtn={true}
                        className={"btn btn-primary meeting next"}
                        text="Add"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="onboard_attendees_organizer_label"
                    >
                      <label>Organizer</label>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={12} md={12} xs={12}>
                      <EmployeeCard
                        employeeName={"Mr. Yaqoob"}
                        employeeDesignation={"Project Manager, Tresmark"}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="onboard_attendees_participant_label"
                    >
                      <label>{t("Attendees")}</label>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} xs={12}>
                      <>
                        <span>
                          <EmployeeCard
                            employeeName={"Mr. Huzeifa"}
                            employeeDesignation="Sr.Software Eng, Minds Collide"
                          />
                        </span>
                      </>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        className={"btn btn-primary meeting next"}
                        text={t("Finir")}
                        onClick={finishTOurButton}
                        disableBtn={true}
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          }
        />
      </Container>
    </>
  );
};

export default ModalMeeting;
