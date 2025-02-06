import React, { useContext } from "react";
import styles from "./CancelButtonModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import { searchNewUserMeeting } from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import { MeetingContext } from "../../../../../../context/MeetingContext";
import { useNavigate } from "react-router-dom";
const CancelButtonModal = ({
  setSceduleMeeting,
  setMeetingDetails,
  setRows,
  flag,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { goBackCancelModal, setGoBackCancelModal } =
    useContext(MeetingContext);
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
    } else if (localStorage.getItem("navigateLocation") === "resolution") {
      navigate("/Diskus/resolution");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
    } else if (localStorage.getItem("navigateLocation") === "committee") {
      navigate("/Diskus/committee");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
    } else if (localStorage.getItem("navigateLocation") === "groups") {
      navigate("/Diskus/groups");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
    } else if (localStorage.getItem("navigateLocation") === "polling") {
      navigate("/Diskus/polling");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
    } else if (localStorage.getItem("navigateLocation") === "calendar") {
      navigate("/Diskus/calendar");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
    } else if (localStorage.getItem("navigateLocation") === "todolist") {
      navigate("/Diskus/todolist");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
    } else if (localStorage.getItem("navigateLocation") === "Notes") {
      navigate("/Diskus/Notes");
      setSceduleMeeting(false);
      setGoBackCancelModal(false);
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
          currentView && Number(currentView) === 1 ? true : false,
      };
      console.log("chek search meeting");
      dispatch(searchNewUserMeeting(navigate, searchData, t));
      setGoBackCancelModal(false);
      setSceduleMeeting(false);
      setMeetingDetails(true);
      setRows([]);
      setSceduleMeeting(false);
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
      };
      console.log("chek search meeting");
      dispatch(searchNewUserMeeting(navigate, searchData, t));
      setGoBackCancelModal(false);
      setSceduleMeeting(false);
      setMeetingDetails(true);
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
                  {flag
                    ? t("Any-unsaved-changes-will-be-lost-continue")
                    : t(
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
