import React, { useContext } from "react";
import styles from "./CancelMeetingmaterial.module.css";
import {
  cleareAllState,
  showCancelMeetingMaterial,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useMeetingContext } from "../../../../../../context/MeetingContext";

const CancelMeetingMaterial = ({
  setViewAdvanceMeetingModal,
  setAdvanceMeetingModalID,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setEditorRole } = useMeetingContext();
  const cancelMeetingMaterial = useSelector(
    (state) => state.NewMeetingreducer.cancelMeetingMaterial
  );
  const handleNOFunctionality = () => {
    dispatch(showCancelMeetingMaterial(false));
  };

  const handleYesFunctionality = () => {
    dispatch(showCancelMeetingMaterial(false));
    setViewAdvanceMeetingModal(false);
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
    dispatch(cleareAllState());
    setEditorRole({ status: null, role: null });
    setAdvanceMeetingModalID(null);
  };

  return (
    <section>
      <Modal
        show={cancelMeetingMaterial}
        setShow={dispatch(showCancelMeetingMaterial)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showCancelMeetingMaterial(false));
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
  );
};

export default CancelMeetingMaterial;
