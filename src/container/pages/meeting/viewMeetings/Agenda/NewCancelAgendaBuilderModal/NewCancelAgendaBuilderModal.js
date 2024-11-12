import React from "react";
import styles from "./NewCancelAgendaBuilderModal.module.css";
import { Button, Modal } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  searchNewUserMeeting,
  showCancelModalAgendaBuilder,
} from "../../../../../../store/actions/NewMeetingActions";
import blackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
const NewCancelAgendaBuilderModal = ({ setSceduleMeeting }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");

  const ShowCancelAgendaBuilderModal = useSelector(
    (state) => state.NewMeetingreducer.cancelAgendaSavedModal
  );

  const handleDiscardBtn = () => {
    dispatch(showCancelModalAgendaBuilder(false));
  };
  const handleContinueBtn = async () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    console.log("chek search meeting");
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
    setSceduleMeeting(false);
    localStorage.setItem("folderDataRoomMeeting", 0);
    dispatch(showCancelModalAgendaBuilder(false));
  };

  return (
    <section>
      <Modal
        show={ShowCancelAgendaBuilderModal}
        setShow={dispatch(showCancelModalAgendaBuilder)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        size={"md"}
        onHide={() => {
          dispatch(showCancelModalAgendaBuilder(false));
        }}
        ModalBody={
          <>
            <section className="p-2">
              <Row>
                <Col lg={11} md={11} sm={11}>
                  <span className={styles["UnsanvedChangesMainHeading"]}>
                    {t("Unsaved-changes")}
                  </span>
                </Col>
                <Col lg={1} md={1} sm={1}>
                  <img
                    src={blackCrossIcon}
                    alt=""
                    className="cursor-pointer"
                    onClick={handleDiscardBtn}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["UnsavedHeading"]}>
                    {t(
                      "You-have-unsaved-changes-if-you-leave-this-page-your-changes"
                    )}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["UnsavedHeading"]}>
                    {t("will-be-lost-do-you-want-to-continue-without-saving")}
                  </span>
                </Col>
              </Row>
            </section>
          </>
        }
        ModalFooter={
          <>
            <section className="p-2">
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-end gap-2"
                >
                  <Button
                    text={t("Discard")}
                    className={styles["DiscardBtn"]}
                    onClick={handleDiscardBtn}
                  />
                  <Button
                    text={t("Continue")}
                    className={styles["ContinueBtn"]}
                    onClick={handleContinueBtn}
                  />
                </Col>
              </Row>
            </section>
          </>
        }
      />
    </section>
  );
};

export default NewCancelAgendaBuilderModal;
