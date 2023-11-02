import React from "react";
import styles from "./CancelButtonModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import { showCancelViewModalmeetingDeitals } from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
const CancelButtonModal = ({
  setViewAdvanceMeetingModal,
  setMeetingDetails,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { NewMeetingreducer } = useSelector((state) => state);

  const handleNOFunctionality = () => {
    dispatch(showCancelViewModalmeetingDeitals(false));
  };

  const handleYesFunctionality = () => {
    setMeetingDetails({
      MeetingTitle: "",
      MeetingType: 0,
      Location: "",
      Description: "",
      Link: "",
      ReminderFrequency: {
        value: 0,
        label: "",
      },
      ReminderFrequencyTwo: {
        value: 0,
        label: "",
      },
      ReminderFrequencyThree: {
        value: 0,
        label: "",
      },
      Notes: "",
      groupChat: false,
      AllowRSPV: false,
      NotifyMeetingOrganizer: false,
      RecurringOptions: {
        value: 0,
        label: "",
      },
      Location: "",
      IsVideoCall: false,
    });
    setViewAdvanceMeetingModal(false);
    dispatch(showCancelViewModalmeetingDeitals(false));
  };

  return (
    <section>
      {" "}
      <section>
        <Modal
          show={NewMeetingreducer.cancelModalMeetingDetails}
          setShow={dispatch(showCancelViewModalmeetingDeitals)}
          modalHeaderClassName={"d-block"}
          modalFooterClassName={"d-block"}
          onHide={() => {
            dispatch(showCancelViewModalmeetingDeitals(false));
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
                    {t("Any-unsaved-changes-will-be")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
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
    </section>
  );
};

export default CancelButtonModal;
