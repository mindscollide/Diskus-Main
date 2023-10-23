import React, { useState } from "react";
import styles from "./ModalFileRequesting.module.css";
import { Modal, TextField } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { requestAccessApi } from "../../../store/actions/DataRoom_actions";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const ModalFileRequesting = ({ RequestFile, setRequestFile }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [requestAccept, setRequestAccept] = useState(false);
  const [message, setMessage] = useState("");
  const handleClickRequestAccess = () => {
    if (message !== "") {
      let Data = {
        Token: "",
        Message: message,
        EmailAddress: "",
      };
      setRequestAccept(true);
      dispatch(requestAccessApi(navigate, t, Data));
    }
  };
  return (
    <Modal
      size="md"
      show={RequestFile}
      setShow={setRequestFile}
      onHide={() => setRequestFile(false)}
      ModalBody={
        requestAccept ? (
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Request_send_heading"]}>
                  {t("Request-send")}
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={12} sm={12} lg={12}>
                <span className={styles["description_request_send"]}>
                  {t(
                    "You-will-get-an-email-letting-you-know-if-file-is-shared-with-you"
                  )}
                </span>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Access_request_modal_heading"]}>
                  {t("You-need-acccess")}
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Sub_line_access_request_modal"]}>
                  {t("Ask-for-access-or-switch-account-with-access")}
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} className="CreateMeetingInput ">
                <TextField
                  applyClass="text-area-dataroom"
                  type="text"
                  as={"textarea"}
                  rows="11"
                  value={message}
                  placeholder={t("Messege(optional)")}
                  required={true}
                  change={(event) => setMessage(event.target.value)}
                />
              </Col>
            </Row>
          </>
        )
      }
      ModalFooter={
        <>
          {requestAccept ? null : (
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    text={t("Request-access")}
                    className={styles["Request_Access_btn"]}
                    onClick={handleClickRequestAccess}
                  />
                </Col>
              </Row>
            </>
          )}
        </>
      }
    />
  );
};

export default ModalFileRequesting;
