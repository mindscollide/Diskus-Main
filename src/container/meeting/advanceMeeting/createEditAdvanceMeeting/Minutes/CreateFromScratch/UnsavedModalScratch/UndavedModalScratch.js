import React from "react";
import styles from "./UnsavedModalScratch.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { showUnsavedCreateFromScratch } from "../../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import { Modal, Button } from "../../../../../../../components/elements";

const UndavedModalScratch = ({ setEditable }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unsavedModalScratch = useSelector(
    (state) => state.NewMeetingreducer.unsavedModalScratch
  );
  const handleYesFunctionality = () => {
    dispatch(showUnsavedCreateFromScratch(false));
    setEditable(false);
  };

  return (
    <section>
      <Modal
        show={unsavedModalScratch}
        setShow={dispatch(showUnsavedCreateFromScratch)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showUnsavedCreateFromScratch(false));
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

export default UndavedModalScratch;
