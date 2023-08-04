import React from "react";
import styles from "./ModalOrganizor.module.css";
import {
  Modal,
  Table,
  TextField,
  Loader,
  Notification,
} from "../../../../../../components/elements";
import { showAddUserModal } from "../../../../../../store/actions/NewMeetingActions";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
const ModalOrganizor = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  console.log(
    NewMeetingreducer,
    "NewMeetingreducerNewMeetingreducerNewMeetingreducer"
  );

  const handleCrossIcon = () => {
    dispatch(showAddUserModal(false));
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.adduserModal}
        setShow={dispatch(showAddUserModal)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showAddUserModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col lg={5} md={5} sm={12}>
                <span className={styles["Add_organization"]}>
                  {t("Add-organizers")}
                </span>
              </Col>
              <Col lg={7} md={7} sm={12} className="d-flex justify-content-end">
                <img
                  src={BlackCrossIcon}
                  className={styles["Cross_Icon_Styling"]}
                  width="16px"
                  height="16px"
                  onClick={handleCrossIcon}
                />
              </Col>
            </Row>
          </>
        }
        ModalFooter={<></>}
      />
    </section>
  );
};

export default ModalOrganizor;
