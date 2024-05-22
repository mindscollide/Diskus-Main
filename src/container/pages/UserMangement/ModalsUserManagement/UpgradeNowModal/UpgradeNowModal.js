import React from "react";
import styles from "./UpgradeNowModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Button, Loader, Modal } from "../../../../../components/elements";
import { showUpgradeNowModal } from "../../../../../store/actions/UserMangementModalActions";
import crossicon from "../../../../../assets/images/BlackCrossIconModals.svg";
import { getLocalStorageItemNonActiveCheck } from "../../../../../commen/functions/utils";
import { useEffect } from "react";
import { userLogOutApiFunc } from "../../../../../store/actions/Auth_Sign_Out";
import { requestOrganizationExtendApi } from "../../../../../store/actions/UserManagementActions";
const UpgradeNowModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { UserManagementModals, Authreducer } = useSelector((state) => state);
  const TrialExpireSelectPac = getLocalStorageItemNonActiveCheck(
    "TrialExpireSelectPac"
  );
  const organizationID = localStorage.getItem("organizationID");
  const UserID = localStorage.getItem("userID");
  const isExtensionAvailable = JSON.parse(
    localStorage.getItem("isExtensionAvailable")
  );

  // new API apply which is requestOrganizationTrialExtend
  const handleForExtenstionRequest = () => {
    let data = {
      OrganizationID: Number(organizationID),
      UserID: Number(UserID),
    };
    dispatch(requestOrganizationExtendApi(navigate, t, data));
  };

  const handleCrossIcon = () => {
    localStorage.removeItem("packageFeatureIDs");
    localStorage.removeItem("LocalUserRoutes");
    localStorage.removeItem("LocalAdminRoutes");
    localStorage.removeItem("VERIFICATION");
    localStorage.removeItem("TrialExpireSelectPac");
    dispatch(userLogOutApiFunc(navigate, t));
  };

  const handleClickhere = () => {
    dispatch(showUpgradeNowModal(false));
  };

  useEffect(() => {
    if (TrialExpireSelectPac) {
      dispatch(showUpgradeNowModal(true));
    } else {
      dispatch(showUpgradeNowModal(false));
      localStorage.removeItem("TrialExpireSelectPac");
    }
  }, [TrialExpireSelectPac]);

  return (
    <section>
      <Modal
        show={UserManagementModals.UpgradeNowModal}
        setShow={dispatch(showUpgradeNowModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        ModalTitle={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end align-items-center"
              >
                <img
                  src={crossicon}
                  alt=""
                  onClick={handleCrossIcon}
                  className="cursor-pointer"
                />
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["Advance_permission_Confirmation"]}>
                  {t("Your-trial-period-is-over")}{" "}
                  <span
                    className={
                      styles["Advance_permission_Confirmation_Click_here"]
                    }
                    onClick={handleClickhere}
                  >
                    {t("Click-here")}
                  </span>{" "}
                  <span className={styles["Advance_permission_Confirmation"]}>
                    {t("please-upgrade-your-Package")}
                  </span>
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
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  className={styles["Yes_confirmation"]}
                  text={t("Still-not-sure")}
                  onClick={handleCrossIcon}
                />
                {isExtensionAvailable && (
                  <Button
                    text={t("Request-an-extention")}
                    className={styles["No_confirmation"]}
                    onClick={handleForExtenstionRequest}
                  />
                )}
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default UpgradeNowModal;
