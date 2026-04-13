import React from "react";
import styles from "./DeleteAuthorityModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
// import { deleteOrganizationUserAPI } from "../../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
import { showDeleteAuthorityModal } from "../../../../../store/actions/ManageAuthoriyAction";
import { useAuthorityContext } from "../../../../../context/AuthorityContext";
import { DeleteAuthorityAPI } from "../../../../../store/actions/ComplainSettingActions";
const DeleteAuthorityModal = () => {
  const { t } = useTranslation();

  const { authorityId, searchPayload } = useAuthorityContext();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  //   let userID = localStorage.getItem("userID");

  //   let organizationID = localStorage.getItem("organizationID");
  const ComplianceListData = useSelector(
    (state) => state.ComplainceSettingReducerReducer.ComplianceListData,
  );

  console.log(ComplianceListData, "ComplianceListDataComplianceListData");

  const deleteAuthorityModal = useSelector(
    (state) => state.ManageAuthorityReducer.deleteAuthorityModal,
  );

  const handleCancelButton = () => {
    dispatch(showDeleteAuthorityModal(false));
  };

  const handleProceedButton = () => {
    const data = {
      authorityId: authorityId,
    };
    dispatch(DeleteAuthorityAPI(navigate, data, t, searchPayload));
  };

  return (
    <Modal
      show={deleteAuthorityModal}
      setShow={dispatch(showDeleteAuthorityModal)}
      modalBodyClassName={styles["DeletrAuthorityModal_Body"]}
      modalFooterClassName={"d-block border-0"}
      modalHeaderClassName={"d-block border-0"}
      size={"xl"}
      onHide={() => {
        dispatch(showDeleteAuthorityModal(false));
      }}
      ModalBody={
        <>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className="text-start">
              <div className={styles["ConfirmationHeading"]}>
                {/* {t("Do-you-want-to-delete-this-authority")} */}
                {t("Are-you-sure-you-want-to-delete-this-authority")}
              </div>
              <div className={styles["subConfirmationHeading"]}>
                {/* {t("The-authority-will-be-permanently-deleted")} */}
                {t(
                  "Once deleted, it cannot be recovered. However, all compliance data already created under this authority will remain preserved and unaffected.",
                )}
              </div>

              <p className={styles["PsxHeading"]}>
                {t("List-of-compliances-of-this-authority")}
              </p>
              {/*  Compliance Titles List */}
              {ComplianceListData?.complianceList?.length > 0 && (
                <div className={styles["ComplianceListContainer"]}>
                  {ComplianceListData.complianceList.map((item) => (
                    <div
                      key={item.complianceId}
                      className={styles["ComplianceItem"]}
                    >
                      {item.complianceTitle}
                    </div>
                  ))}
                </div>
              )}
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
              xs={12}
              className="d-flex justify-content-end gap-2 px-5"
            >
              <Button
                text={t("Cancel")}
                className={styles["ProceedButtonStyles"]}
                onClick={handleCancelButton}
              />
              <Button
                text={t("Delete-permanently")}
                className={styles["CancelButton"]}
                onClick={handleProceedButton}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default DeleteAuthorityModal;
