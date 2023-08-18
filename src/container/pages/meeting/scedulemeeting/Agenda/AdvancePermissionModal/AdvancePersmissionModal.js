import React from "react";
import styles from "./AdvancePermissionModal.module.css";
import { Modal, Button } from "../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { showAdvancePermissionModal } from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import Key from "../../../../../../assets/images/KEY.svg";
const AdvancePersmissionModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  return (
    <section>
      <Modal
        show={NewMeetingreducer.advancePermissionModal}
        setShow={dispatch(showAdvancePermissionModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showAdvancePermissionModal(false));
        }}
        size={"lg"}
        ModalTitle={
          <>
            <Row>
              <Col
                lg={7}
                md={7}
                sm={12}
                className="d-flex gap-2 align-items-center"
              >
                <img src={Key} height="23.51px" width="23.49px" />
                <span className={styles["Advance_setting_heading"]}>
                  {t("Advanced-permission-settings")}
                </span>
              </Col>
              <Col lg={5} md={5} sm={5}>
                <Row>
                  <Col
                    lg={2}
                    md={2}
                    sm={12}
                    className="d-flex align-items-center"
                  >
                    <span
                      className={styles["Show_Heading_Advance_persmission"]}
                    >
                      {t("Show") + ":"}
                    </span>
                  </Col>
                  <Col lg={10} md={10} sm={10}>
                    <Select classNamePrefix={"AdvancePermission"} />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} className="m-0 p-0">
                <span className={styles["Bottom_line"]}></span>
              </Col>
            </Row>
          </>
        }
        ModalBody={<></>}
      />
    </section>
  );
};

export default AdvancePersmissionModal;
