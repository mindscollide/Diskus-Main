import React from "react";
import Modal from "../modal/Modal";
import styles from "./CommitteeStatusModa..module.css";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Button from "../button/Button";
import { committeeStatusUpdate } from "../../../store/actions/Committee_actions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

/**
 * @component CommitteeStatusModal
 * @description Renders a confirmation modal that prompts the user before changing a
 * committee's status. The confirmation message is dynamically composed from the
 * `statusUpdateData.CommitteeStatusId` value: 1 = "In-active", 2 = "Archive", 3 = "Active".
 * On confirmation the component dispatches the `committeeStatusUpdate` Redux action which
 * handles the API call and subsequent navigation. On cancellation the modal is simply closed.
 *
 * @param {boolean} isActive - Controls modal visibility; `true` shows the modal.
 * @param {Function} setIsActive - State setter used to open or close the modal.
 * @param {Object} statusUpdateData - Data payload forwarded to the `committeeStatusUpdate` action.
 * @param {number} statusUpdateData.CommitteeStatusId - Numeric status identifier:
 *   `1` = In-active, `2` = Archive, `3` = Active.
 *
 * @example
 * <CommitteeStatusModal
 *   isActive={showModal}
 *   setIsActive={setShowModal}
 *   statusUpdateData={{ CommitteeStatusId: 2, CommitteeID: 10 }}
 * />
 */
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
                                ${t("this-committee")}`}
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
