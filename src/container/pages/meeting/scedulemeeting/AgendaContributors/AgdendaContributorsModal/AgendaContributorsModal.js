import React, { useState } from "react";
import styles from "./AgendaContritbutorsModal.module.css";
import {
  Modal,
  Table,
  TextField,
  Button,
  Loader,
  Notification,
} from "../../../../../../components/elements";
import {
  showAddAgendaContributor,
  showAddUserModal,
} from "../../../../../../store/actions/NewMeetingActions";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import committeicon from "../../../../../../assets/images/Group 2584.png";
import { useDispatch, useSelector } from "react-redux";
import GroupIcon from "../../../../../../assets/images/Path 636.png";
import profile from "../../../../../../assets/images/newprofile.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
const AgendaContributorsModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const data = [
    {
      key: "1",
      Name: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex gap-2">
              <img
                src={profile}
                width="18px"
                height="18px"
                className={styles["Profile"]}
              />
              <span>Muhammad Saif</span>
            </Col>
          </Row>
        </>
      ),
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      Primary: <></>,
    },
    {
      key: "1",
      Name: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex gap-2">
              <img
                src={profile}
                width="18px"
                height="18px"
                className={styles["Profile"]}
              />
              <span>Board Member Committtee</span>
            </Col>
          </Row>
        </>
      ),
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      Primary: <></>,
    },
  ];
  const [rowsData, setRowsData] = useState(data);
  const ModalOrganizorsColoumns = [
    {
      dataIndex: "Name",
      key: "Name",
      width: "280px",
    },

    {
      dataIndex: "Email",
      key: "Email",
      width: "220px",
    },

    {
      dataIndex: "Primary",
      key: "Primary",
      width: "160px",
      render: (text, record) => {
        return (
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex justify-content-end"
              >
                {/* Both Add And remove buttons Are here  */}
                {/* <Button text={t("Add")} className={styles["ADD_Organizers"]} /> */}
                <Button
                  text={t("Remove")}
                  className={styles["remove_Organizers"]}
                />
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  const handleCrossIcon = () => {
    dispatch(showAddAgendaContributor(false));
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.agendaContributors}
        setShow={dispatch(showAddAgendaContributor)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showAddAgendaContributor(false));
        }}
        size={"lg"}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OverAll_Padding"]}
              >
                <Row>
                  <Col lg={7} md={7} sm={12}>
                    <span className={styles["Add_organization"]}>
                      {t("Add-agenda-contributors")}
                    </span>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <img
                      src={BlackCrossIcon}
                      className={"cursor-pointer"}
                      width="16px"
                      height="16px"
                      onClick={handleCrossIcon}
                    />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      labelClass={"d-none"}
                      applyClass={"addOraganizer"}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <Table
                      column={ModalOrganizorsColoumns}
                      scroll={{ y: "62vh" }}
                      pagination={false}
                      className="Polling_table"
                      rows={rowsData}
                    />
                  </Col>
                </Row>
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
                className={styles["OverAll_Padding"]}
              >
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={t("Done")}
                      className={styles["Done_btn_organizor_modal"]}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default AgendaContributorsModal;
