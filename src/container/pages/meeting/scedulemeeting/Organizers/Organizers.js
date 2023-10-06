import React, { useState } from "react";
import styles from "./Organizers.module.css";
import {
  Button,
  Table,
  TextField,
  Switch,
} from "../../../../../components/elements";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import addmore from "../../../../../assets/images/addmore.png";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import greenMailIcon from "../../../../../assets/images/greenmail.svg";
import redMailIcon from "../../../../../assets/images/redmail.svg";
import rspvGreenIcon from "../../../../../assets/images/rspvGreen.svg";
import rspvAbstainIcon from "../../../../../assets/images/rspvAbstain.svg";
import mail from "../../../../../assets/images/mail.svg";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showAddUserModal,
  showCrossConfirmationModal,
  showNotifyOrganizors,
} from "../../../../../store/actions/NewMeetingActions";
import ModalOrganizor from "./ModalAddUserOrganizer/ModalOrganizor";
import ModalCrossIcon from "./ModalCrossIconClick/ModalCrossIcon";
import NotifyOrganizers from "./NotifyOrganizers/NotifyOrganizers";
import OrganizersViewPage from "./OrganizerViewPage/OrganizersViewPage";
const Organizers = ({ setAgendaContributors, setorganizers }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [viewOrganizers, setviewOrganizers] = useState(false);
  const { NewMeetingreducer } = useSelector((state) => state);
  const openCrossIconModal = () => {
    dispatch(showCrossConfirmationModal(true));
  };
  const openNotifyOrganizorModal = () => {
    dispatch(showNotifyOrganizors(true));
  };
  const data = [
    {
      key: "1",
      Name: (
        <label
          className={styles["Title_desc"]}
          onClick={openNotifyOrganizorModal}
        >
          Muahmmad Saif
        </label>
      ),
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      OrganizerTitle: <label className="column-boldness">Organizer</label>,
      rspv: (
        <>
          <img
            draggable={false}
            src={rspvGreenIcon}
            height="30px"
            width="30px"
          />
          {/* <img draggable = {false} src={rspvAbstainIcon} height="30px" width="30px" /> */}
        </>
      ),
      Notification: (
        <>
          <Row>
            <Col lg={7} md={7} sm={7} className="d-flex justify-content-center">
              <img
                draggable={false}
                src={greenMailIcon}
                height="17.64px"
                width="12.4px"
              />
              {/* <img draggable = {false} src={redMailIcon} height="17.64px" width="12.4px" /> */}
            </Col>
          </Row>
        </>
      ),
      Primary: <label className="column-boldness">Primary</label>,
    },
    {
      key: "1",
      Name: <label className={styles["Title_desc"]}>Muahmmad Saif</label>,
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      OrganizerTitle: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <TextField
                disable={true}
                placeholder={t("Content-title")}
                labelClass={"d-none"}
                applyClass={"Organizer_table"}
              />
            </Col>
          </Row>
        </>
      ),
      Primary: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-3 align-items-center"
            >
              <Switch />
              <label className="column-boldness">Primary</label>
            </Col>
          </Row>
        </>
      ),
      Close: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <img
                draggable={false}
                src={redcrossIcon}
                width="21.79px"
                height="21.79px"
                onClick={openCrossIconModal}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const [rowsData, setRowsData] = useState(data);

  const MeetingColoumns = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Name")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Name",
      key: "Name",
      width: "300px",
    },

    {
      title: t("Email"),
      dataIndex: "Email",
      key: "Email",
      width: "400px",
    },
    {
      title: t("Organizer-title"),
      dataIndex: "OrganizerTitle",
      key: "OrganizerTitle",
      width: "300px",
    },

    {
      dataIndex: "Primary",
      key: "Primary",
      width: "200px",
    },
    {
      title: t("RSPV"),
      dataIndex: "rspv",
      key: "rspv",
      width: "200px",
    },

    {
      title: t("Notification"),
      dataIndex: "Notification",
      key: "Notification",
      width: "200px",
    },
    {
      dataIndex: "Close",
      key: "Close",
      width: "200px",
    },
  ];

  const openAddUserModal = () => {
    dispatch(showAddUserModal(true));
  };

  const handleNextButton = () => {
    setorganizers(false);
    setAgendaContributors(true);
  };

  const EnableOrganizersView = () => {
    setviewOrganizers(!viewOrganizers);
  };

  return (
    <>
      {viewOrganizers ? (
        <OrganizersViewPage />
      ) : (
        <>
          <section className="position-relative">
            <Row className="mt-4 m-0 p-0">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Notification1")}
                  className={styles["Notification_button"]}
                  icon={
                    <img
                      draggable={false}
                      src={mail}
                      width="17.18px"
                      height="12.08px"
                    />
                  }
                />
                <Button
                  text={t("Edit")}
                  className={styles["Edit_Button_Organizers"]}
                  icon={
                    <img
                      draggable={false}
                      src={EditIcon}
                      width="11.75px"
                      height="11.75px"
                    />
                  }
                />
                <Button
                  text={t("Add-more")}
                  icon={<img draggable={false} src={addmore} />}
                  className={styles["AddMoreBtn"]}
                  onClick={openAddUserModal}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={MeetingColoumns}
                  scroll={{ y: "62vh" }}
                  pagination={false}
                  className="Polling_table"
                  rows={rowsData}
                />
              </Col>
            </Row>
          </section>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <section className={styles["Footer_button"]}>
                <Button
                  text={t("Delete-meeting")}
                  className={styles["Cancel_Organization"]}
                />
                <Button
                  text={t("Publish-the-meeting")}
                  className={styles["publish_button_Organization"]}
                  onClick={EnableOrganizersView}
                />
                <Button
                  text={t("Cancel")}
                  className={styles["publish_button_Organization"]}
                />
                <Button
                  text={t("Save")}
                  className={styles["Next_Organization"]}
                  onClick={handleNextButton}
                />
              </section>
            </Col>
          </Row>
        </>
      )}

      {NewMeetingreducer.adduserModal && <ModalOrganizor />}
      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.notifyOrganizors && <NotifyOrganizers />}
    </>
  );
};

export default Organizers;
