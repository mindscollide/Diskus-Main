import React, { useEffect } from "react";
import styles from "./AccessDeniedModal.module.css";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AccessDeniedPolls } from "../../../../store/actions/Polls_actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Modal } from "../../../elements";
import AccessDeniedImage from "../../../../assets/images/Frame.png";
const AccessDeniedModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  //Accessing the Global State
  const AccessDeniedGlobalState = useSelector(
    (state) => state.PollsReducer.AccessDeniedPolls
  );

  const handleOnClickAccessDenied = () => {
    dispatch(AccessDeniedPolls(false));
    localStorage.removeItem("resolutionDeleted");
    localStorage.removeItem("AccessDeniedCommittee");
    localStorage.removeItem("AccessDeniedGroups");
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("resolutionDeleted");
      localStorage.removeItem("AccessDeniedCommittee");
      localStorage.removeItem("AccessDeniedGroups");
    };
  }, []);

  return (
    <section>
      <Modal
        show={AccessDeniedGlobalState}
        setShow={dispatch(AccessDeniedPolls)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(AccessDeniedPolls(false));
          localStorage.removeItem("resolutionDeleted");
          localStorage.removeItem("AccessDeniedCommittee");
          localStorage.removeItem("AccessDeniedGroups");
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
                <img src={AccessDeniedImage} alt="" />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center align-items-center"
              >
                <span className={styles["AccessDeninedMainheading"]}>
                  {t("Access-denied")}
                </span>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="f-flex flex-column flex-wrap"
              >
                <span className={styles["DeninedModalSubHeading"]}>
                  {t("It-seems-you-don’t-have-permission-to")}
                </span>
                <span className={styles["DeninedModalSubHeading"]}>
                  {t("Access-this")}&nbsp;
                  {JSON.parse(
                    localStorage.getItem("viewadvanceMeetingTask")
                  ) === true ? (
                    <span className={styles["DeninedModalSubHeading"]}>
                      {"Task"}
                    </span>
                  ) : JSON.parse(
                      localStorage.getItem("ResolutionAccessDenied")
                    ) === true ? (
                    <span className={styles["DeninedModalSubHeading"]}>
                      {"Resolution"}
                    </span>
                  ) : JSON.parse(localStorage.getItem("resolutionDeleted")) ===
                    true ? (
                    <span className={styles["DeninedModalSubHeading"]}>
                      {"Resolution"}
                    </span>
                  ) : JSON.parse(
                      localStorage.getItem("AccessDeniedCommittee")
                    ) === true ? (
                    <span className={styles["DeninedModalSubHeading"]}>
                      {"Committee"}
                    </span>
                  ) : JSON.parse(localStorage.getItem("AccessDeniedGroups")) ===
                    true ? (
                    <span className={styles["DeninedModalSubHeading"]}>
                      {"Group"}
                    </span>
                  ) : (
                    <span className={styles["DeninedModalSubHeading"]}>
                      {"Poll"}
                    </span>
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
                className="d-flex justify-content-center"
              >
                <Button
                  text={t("Close")}
                  className={styles["CloseButtonStyles"]}
                  onClick={handleOnClickAccessDenied}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default AccessDeniedModal;
