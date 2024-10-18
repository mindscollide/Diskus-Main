import React from "react";
import Modal from "../modal/Modal";
import styles from "./CommitteeStatusModa..module.css";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Button from "../button/Button";
import { committeeStatusUpdate } from "../../../store/actions/Committee_actions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const CommitteeStatusModal = ({ isActive, setIsActive, statusUpdateData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleUpdateStatus = () => {
    dispatch(committeeStatusUpdate(navigate, statusUpdateData, t, setIsActive));
  };
  return (
    <>
      <Modal
        show={isActive}
        onHide={() => setIsActive(false)}
        setShow={setIsActive}
        modalFooterClassName="d-block"
        ModalBody={
          <>
            <Row>
              <Col sm={12} md={12} lg={12} className={styles["modalText"]}>
                {`${t("Are-you-sure-you-want-to")} ${
                  statusUpdateData.CommitteeStatusId === 1
                    ? t("In-active")
                    : statusUpdateData.CommitteeStatusId === 2
                    ? t("Archive")
                    : statusUpdateData.CommitteeStatusId === 3
                    ? t("Active")
                    : ""
                }
                                ${t("this committee?")}`}
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col sm={12} md={6} lg={6} className="d-flex justify-content-end">
                <Button
                  className={styles["CancelBtn"]}
                  onClick={() => setIsActive(false)}
                  text={t("Cancel")}
                />
              </Col>
              <Col
                sm={12}
                md={6}
                lg={6}
                className="d-flex justify-content-start"
              >
                <Button
                  className={styles["ProccedBtn"]}
                  onClick={handleUpdateStatus}
                  text={t("Procced")}
                />
              </Col>
            </Row>
          </>
        }
      />
    </>
  );
};

export default CommitteeStatusModal;
