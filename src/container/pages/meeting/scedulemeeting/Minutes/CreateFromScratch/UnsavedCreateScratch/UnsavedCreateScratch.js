import React from "react";
import styles from "./UnsavedCreateScratch.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { showUnsavedForButonCreateFromScratch } from "../../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import { Modal, Button } from "../../../../../../../components/elements";

const UnsavedCreateScratch = ({ setCreateFromSratch }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UnsavedButtonCreateScratch = useSelector(
    (state) => state.NewMeetingreducer.UnsavedButtonCreateScratch
  );
  const handleYesFunctionality = () => {
    dispatch(showUnsavedForButonCreateFromScratch(false));
    setCreateFromSratch(false);
  };

  return (
    <section>
      <Modal
        show={UnsavedButtonCreateScratch}
        setShow={dispatch(showUnsavedForButonCreateFromScratch)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showUnsavedForButonCreateFromScratch(false));
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

export default UnsavedCreateScratch;
