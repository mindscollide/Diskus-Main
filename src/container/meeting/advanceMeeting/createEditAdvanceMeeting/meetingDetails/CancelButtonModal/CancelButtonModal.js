import React, { useContext } from "react";
import styles from "./CancelButtonModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { MeetingContext } from "../../../../../../context/MeetingContext";
import { useNavigate } from "react-router-dom";
import {
  resetCreateEditTabs,
  toggleCreateEditMeetingModal,
} from "../../../../../../store/actions/ModalStates_actions";
import { isFunction } from "../../../../../../commen/functions/utils";
import {
  listOfMeetingsApi,
  resetCurrentMeetingInfo,
} from "../../../../../../store/actions/NewMeeting2.actions";
import { resetViewCommitteeDetails } from "../../../../../../store/actions/Committee_actions";
import { resetViewGroupDetails } from "../../../../../../store/actions/Groups_actions";
const CancelButtonModal = ({ setRows }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { goBackCancelModal, setGoBackCancelModal, setEditorRole } =
    useContext(MeetingContext);

  const committeeInfo = useSelector(
    (state) => state.CommitteeReducer.viewCommitteeDetails,
  );

  const groupInfo = useSelector(
    (state) => state.GroupsReducer.viewGroupDetails,
  );

  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");

  const handleNOFunctionality = () => {
    setGoBackCancelModal(false);
  };

  const handleYesFunctionality = () => {
    const location = localStorage.getItem("navigateLocation");

    const commonReset = () => {
      dispatch(toggleCreateEditMeetingModal(false));
      dispatch(resetCreateEditTabs());
      dispatch(resetCurrentMeetingInfo());
      dispatch(resetViewGroupDetails());
      dispatch(resetViewCommitteeDetails());
      setGoBackCancelModal(false);

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

      isFunction(setRows) && setRows([]);
    } else if (navigateRoutes[location]) {
      commonReset();
      navigate(navigateRoutes[location]);
    }

    localStorage.removeItem("navigateLocation");
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
