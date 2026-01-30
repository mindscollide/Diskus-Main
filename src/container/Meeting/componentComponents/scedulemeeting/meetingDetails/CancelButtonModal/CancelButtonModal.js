import React from "react";
import styles from "./CancelButtonModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import { searchNewUserMeeting } from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import { useMeetingContext } from "../../../../../../context/MeetingContext";
import { useNavigate } from "react-router-dom";
const CancelButtonModal = ({ setRows, flag, setmeetingDetails }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { goBackCancelModal, setGoBackCancelModal, setSceduleMeeting } =
    useMeetingContext();
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");

  const handleNOFunctionality = () => {
    setGoBackCancelModal(false);
  };

  const handleYesFunctionality = () => {
    if (localStorage.getItem("navigateLocation") === "dataroom") {
      navigate("/Diskus/dataroom");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "resolution") {
      navigate("/Diskus/resolution");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "committee") {
      navigate("/Diskus/committee");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "groups") {
      navigate("/Diskus/groups");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "polling") {
      navigate("/Diskus/polling");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "calendar") {
      navigate("/Diskus/calendar");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "todolist") {
      navigate("/Diskus/todolist");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "Notes") {
      navigate("/Diskus/Notes");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "MainDashBoard") {
      navigate("/Diskus/");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "Meeting") {
      let searchData = {
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber:
          meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
        PublishedMeetings:
          Number(localStorage.getItem("MeetingCurrentView")) === 1
            ? true
            : false,
        ProposedMeetings:
          Number(localStorage.getItem("MeetingCurrentView")) === 2
            ? true
            : false,
      };
      console.log("chek search meeting");
      dispatch(searchNewUserMeeting(navigate, searchData, t));
      setGoBackCancelModal(false);
      setSceduleMeeting(false);
      setmeetingDetails(true);
      setRows([]);
      setSceduleMeeting(false);
      localStorage.removeItem("navigateLocation");
    } else {
      let searchData = {
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber:
          meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
        PublishedMeetings:
          Number(localStorage.getItem("MeetingCurrentView")) === 1
            ? true
            : false,
        ProposedMeetings:
          Number(localStorage.getItem("MeetingCurrentView")) === 2
            ? true
            : false,
      };
      console.log("chek search meeting");
      dispatch(searchNewUserMeeting(navigate, searchData, t));
      setGoBackCancelModal(false);
      setSceduleMeeting(false);
      setmeetingDetails(true);
      setRows([]);
    }
  };

  return (
    <section>
      <Modal
        show={goBackCancelModal}
        setShow={setGoBackCancelModal}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          setGoBackCancelModal(false);
        }}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["UnsaveheadingFileUpload"]}>
                  {t(
                    "You-have-unsaved-changes-if-you-leave-this-page-your-changes-will-be-lost-do-you-want-to-continue-without-saving",
                  )}
                </span>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center gap-2"
              >
                <Button
                  text={t("No")}
                  className={styles["Yes_unsave_File_Upload"]}
                  onClick={handleNOFunctionality}
                />
                <Button
                  text={t("Yes")}
                  className={styles["No_unsave_File_Upload"]}
                  onClick={handleYesFunctionality}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default CancelButtonModal;
