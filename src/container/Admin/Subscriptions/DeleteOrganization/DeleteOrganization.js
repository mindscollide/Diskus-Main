import React, { useEffect, useState } from "react";
import styles from "./DeleteOrganization.module.css";
import { Row, Col, Container } from "react-bootstrap";

import {
  Button,
  Loader,
  Modal,
  Notification,
} from "../../../../components/elements";
import deleteOrganizationAction from "../../../../store/actions/Delete_Organization";
import { useDispatch, useSelector } from "react-redux";
import FailedIcon from "../../../../assets/images/failed.png";
import DeletedIcon from "../../../../assets/images/Deleted-Icon.png";
import { FaLaptopHouse } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { cleareMessage } from "../../../../store/actions/Admin_PackageUpgrade";
import { showMessage } from "../../../../components/elements/snack_bar/utill";
const DeleteOrganization = () => {
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const { adminReducer, LanguageReducer } = useSelector((state) => state);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [deleteSuccessModal, setDeleteSuccesModal] = useState(false);
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDeleteOrganization = () => {
    setDeleteConfirmModal(true);
    setDeleteModal(false);
    setDeleteSuccesModal(false);
  };
  const cancelModalDelete = () => {
    setDeleteModal(false);
    setDeleteConfirmModal(false);
    setDeleteSuccesModal(false);
  };
  const openDeleteSuccess = () => {
    let Data = {
      OrganizationID: JSON.parse(OrganizationID),
      RequestingUserID: JSON.parse(createrID),
    };
    localStorage.setItem("deleteContent", true);
    dispatch(
      deleteOrganizationAction(
        navigate,
        Data,
        t,
        setDeleteSuccesModal,
        setDeleteModal,
        setDeleteConfirmModal
      )
    );
  };
  console.log("adminReduceradminReduceradminReducer", adminReducer);
  useEffect(() => {
    if (adminReducer.DeleteOrganizationResponseMessage !== "") {
      showMessage(
        adminReducer.DeleteOrganizationResponseMessage,
        "success",
        setOpen
      );
      dispatch(cleareMessage());
    }
  }, [adminReducer.DeleteOrganizationResponseMessage]);
  return (
    <>
      <Container>
        <Row>
          <Col sm={12} md={12} lg={12} className="mx-auto">
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className={`${" fs-4 mt-4 mb-2"} ${
                  styles["DeleteOrganization_box_heading"]
                }`}
              >
                {t("Delete-organization")}
              </Col>
              <Col
                sm={12}
                lg={12}
                md={12}
                className={styles["DeleteOrganization_content"]}
              >
                <img draggable="false" src={FailedIcon} />
                <p>
                  {t("Opting-to")}
                  <span className={styles["title"]}>
                    {t("Delete-the-organization")}
                  </span>
                  <span className={styles["title_two"]}>
                    {t(
                      "Will-delete-and-remove-all-relevant-data-including-but-not"
                    )}
                  </span>

                  <br />
                  <br />

                  {t(
                    "It-is-requested-that-you-please-make-backup-of-all-your-data"
                  )}
                </p>
                <Button
                  className={styles["deleteOrganization_btn"]}
                  onClick={openDeleteSuccess}
                  text={t("Proceed-to-deletion")}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      {adminReducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.flag })}
        severity={open.severity}
      />
    </>
  );
};

export default DeleteOrganization;
