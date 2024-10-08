import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalCancellResolution.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../../../components/elements";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { cancelResolutionApi } from "../../../store/actions/Resolution_actions";
const ModalCancellResolution2 = ({
  cancelresolution,
  setCancelresolution,
  Id,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resolutioncancel, setResolutioncancel] = useState(false);

  const closebtn = async () => {
    setCancelresolution(false);
  };
  const handleCancelResolution = () => {
    dispatch(
      cancelResolutionApi(
        navigate,
        Id,
        t,
        setResolutioncancel,
        setCancelresolution
      )
    );
  };
  return (
    <>
      <Container>
        <Modal
          show={cancelresolution}
          onHide={() => {
            setCancelresolution(false);
          }}
          setShow={setCancelresolution}
          modalFooterClassName="d-block"
          centered
          size={cancelresolution === true ? "md" : "md"}
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <span className={styles["Heading_For_Active_Sure"]}>
                      {t(
                        "The-resolution-is-currently-circulated-are-you-sure-you-want-to-cancel-the-resolution-before-voting-and-decision-date"
                      )}
                    </span>
                  </Col>
                </Row>
              </Container>
            </>
          }
          ModalFooter={
            <>
              <Row className="mt-3 mb-4">
                <Col
                  lg={12}
                  sm={12}
                  md={12}
                  className="d-flex justify-content-center gap-2"
                >
                  <Button
                    text={t("Discard")}
                    className={
                      styles["Confirm-activegroup-modal-cancel-button"]
                    }
                    onClick={closebtn}
                  />

                  <Button
                    text={t("Confirm")}
                    className={styles["Confirm-activegroup-modal"]}
                    onClick={handleCancelResolution}
                  />
                </Col>
              </Row>
            </>
          }
        />
      </Container>
    </>
  );
};

export default ModalCancellResolution2;
