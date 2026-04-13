import React, { useContext } from "react";
import styles from "./CancelButtonModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import { meetingDetailsGlobalFlag, searchNewUserMeeting } from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import { MeetingContext } from "../../../../../../context/MeetingContext";
import { useNavigate } from "react-router-dom";
import { useNewMeetingContext } from "../../../../../../context/NewMeetingContext";
const CancelButtonModal = ({
  setRows,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { goBackCancelModal, setGoBackCancelModal } =
    useContext(MeetingContext);
  const { setIsCreateEditMeeting, isCreateEditMeeting } =
    useNewMeetingContext();
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");

  const handleNOFunctionality = () => {
    setGoBackCancelModal(false);
  };

  const handleYesFunctionality = () => {
    if (localStorage.getItem("navigateLocation") === "dataroom") {
      setGoBackCancelModal(false);
      setIsCreateEditMeeting(false);
      navigate("/Diskus/dataroom");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "resolution") {
      setIsCreateEditMeeting(false);
      setGoBackCancelModal(false);
      navigate("/Diskus/resolution");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "committee") {
      setIsCreateEditMeeting(false);
      setGoBackCancelModal(false);
      navigate("/Diskus/committee");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "groups") {
      setIsCreateEditMeeting(false);
      setGoBackCancelModal(false);
      navigate("/Diskus/groups");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "polling") {
      setIsCreateEditMeeting(false);
      setGoBackCancelModal(false);
      navigate("/Diskus/polling");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "calendar") {
      setIsCreateEditMeeting(false);
      setGoBackCancelModal(false);
      navigate("/Diskus/calendar");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "todolist") {
      setIsCreateEditMeeting(false);
      setGoBackCancelModal(false);
      navigate("/Diskus/todolist");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "Notes") {
      setIsCreateEditMeeting(false);
      setGoBackCancelModal(false);
      navigate("/Diskus/Notes");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "MainDashBoard") {
      setIsCreateEditMeeting(false);
      navigate("/Diskus/");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "Meeting") {
      setGoBackCancelModal(false);
      let searchData = {
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber:
          meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
        PublishedMeetings:
          currentView && Number(currentView) === 1 ? true : false,
        ProposedMeetings:
          currentView && Number(currentView) === 2 ? true : false,
      };
      console.log("chek search meeting");
      dispatch(searchNewUserMeeting(navigate, searchData, t));
      setGoBackCancelModal(false);
      setIsCreateEditMeeting(false);
      dispatch(meetingDetailsGlobalFlag(true));
      setRows([]);
      // setIsCreateEditMeeting(false);
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
          currentView && Number(currentView) === 1 ? true : false,
        ProposedMeetings:
          currentView && Number(currentView) === 2 ? true : false,
      };
      console.log("chek search meeting");
      dispatch(searchNewUserMeeting(navigate, searchData, t));
      setGoBackCancelModal(false);
      setIsCreateEditMeeting(false);
      dispatch(meetingDetailsGlobalFlag(true));
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
                className='d-flex justify-content-center'>
                <span className={styles["UnsaveheadingFileUpload"]}>
                  {t(
                    "You-have-unsaved-changes-if-you-leave-this-page-your-changes-will-be-lost-do-you-want-to-continue-without-saving"
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
                className='d-flex justify-content-center gap-2'>
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
