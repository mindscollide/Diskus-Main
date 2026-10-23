import React from "react";
import { Modal, Button } from "../../../../../../components/elements";
import styles from "./UnsavedMinutes.module.css";
import {
  searchNewUserMeeting,
  showUnsaveMinutesFileUpload,
} from "../../../../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import {
  resetCreateEditTabs,
  toggleCreateEditMeetingModal,
} from "../../../../../../store/actions/ModalStates_actions";
import {
  listOfMeetingsApi,
  resetCurrentMeetingInfo,
} from "../../../../../../store/actions/NewMeeting2.actions";
import { useMeetingContext } from "../../../../../../context/MeetingContext";

const UnsavedMinutes = ({}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const NewMeetingreducer = useSelector((state) => state.NewMeetingreducer);

  const { setEditorRole } = useMeetingContext();
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");
  const committeeInfo = useSelector(
    (state) => state.CommitteeReducer.viewCommitteeDetails,
  );

  const groupInfo = useSelector(
    (state) => state.GroupsReducer.viewGroupDetails,
  );

  const handleYesFunctionality = () => {
    const location = localStorage.getItem("navigateLocation");

    const commonReset = () => {
      dispatch(toggleCreateEditMeetingModal(false));
      dispatch(resetCreateEditTabs());
      dispatch(resetCurrentMeetingInfo());
      // dispatch(resetViewGroupDetails());
      // dispatch(resetViewCommitteeDetails());

      setEditorRole({
        status: null,
        role: null,
        isPrimaryOrganizer: false,
      });
    };

    const navigateRoutes = {
      dataroom: "/Diskus/dataroom",
      resolution: "/Diskus/resolution",
      committee: "/Diskus/committee",
      groups: "/Diskus/groups",
      polling: "/Diskus/polling",
      calendar: "/Diskus/calendar",
      todolist: "/Diskus/todolist",
      Notes: "/Diskus/Notes",
      MainDashBoard: "/Diskus/",
    };

    if (committeeInfo !== null) {
      commonReset();
      return;
    }

    if (groupInfo !== null) {
      commonReset();
      return;
    }

    // 🔁 Handle Meeting Case Separately
    if (location === "Meeting" || !location) {
      commonReset();

      dispatch(
        listOfMeetingsApi(
          navigate,
          t,
          {
            Date: "",
            Title: "",
            HostName: "",
            UserID: Number(userID),
            PageNumber:
              meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
            Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
            PublishedMeetings: currentView && Number(currentView) === 1,
            ProposedMeetings: currentView && Number(currentView) === 2,
          },
          "",
          {},
        ),
      );

      //  isFunction(setRows) && setRows([]);
    } else if (navigateRoutes[location]) {
      // commonReset();
      navigate(navigateRoutes[location]);
    }

    localStorage.removeItem("navigateLocation");
    dispatch(showUnsaveMinutesFileUpload(false));
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.unsaveFileUploadMinutes}
        setShow={dispatch(showUnsaveMinutesFileUpload)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showUnsaveMinutesFileUpload(false));
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
                  onClick={() => dispatch(showUnsaveMinutesFileUpload(false))}
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

export default UnsavedMinutes;
