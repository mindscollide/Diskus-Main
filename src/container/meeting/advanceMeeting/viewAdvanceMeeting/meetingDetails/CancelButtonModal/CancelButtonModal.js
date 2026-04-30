import React, { useContext } from "react";
import styles from "./CancelButtonModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import {
  cleareAllState,
  searchNewUserMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../../../store/actions/NewMeetingActions";
import { MeetingContext } from "../../../../../../context/MeetingContext";
import {
  resetViewTabs,
  toggleViewMeetingModal,
} from "../../../../../../store/actions/ModalStates_actions";
import { resetCurrentMeetingInfo } from "../../../../../../store/actions/NewMeeting2.actions";
const CancelButtonModal = ({
  setCancelModalView,
  cancelModalView,
  setAgenda,
  setPolls,
  setMinutes,
  setAttendance,
  setAdvanceMeetingModalID,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");
  const { setEditorRole } = useContext(MeetingContext);
  const handleNOFunctionality = () => {
    setCancelModalView(false);
  };

  const handleYesFunctionality = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    dispatch(cleareAllState());
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    setCancelModalView(false);
    setEditorRole({ status: null, role: null });
    dispatch(resetCurrentMeetingInfo());
    dispatch(toggleViewMeetingModal(false));
    dispatch(resetViewTabs());
  };

  return (
    <section>
      {" "}
      <section>
        <Modal
          show={cancelModalView}
          setShow={setCancelModalView(true)}
          modalHeaderClassName={"d-block"}
          modalFooterClassName={"d-block"}
          onHide={() => {
            setCancelModalView(false);
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
                    {t("Any-unsaved-changes-will-be")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='d-flex justify-content-center'>
                  <span className={styles["UnsaveheadingFileUpload"]}>
                    {t("Lost-continue")}
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
    </section>
  );
};

export default CancelButtonModal;
