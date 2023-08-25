import React, { useState } from "react";
import styles from "./AgendaContributors.module.css";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import addmore from "../../../../../assets/images/addmore.png";
import emptyContributorState from "../../../../../assets/images/emptyStateContributor.svg";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import NotificationIcon from "../../../../../assets/images/greenmail.svg";
import redMailIcon from "../../../../../assets/images/redmail.svg";
import RspvIcon from "../../../../../assets/images/rspvGreen.svg";
import RspcAbstainIcon from "../../../../../assets/images/rspvAbstain.svg";
import Select from "react-select";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Table,
  TextField,
  Loader,
  Notification,
} from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import AgendaContributorsModal from "./AgdendaContributorsModal/AgendaContributorsModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showAddAgendaContributor,
  showAgendaContributorsModals,
  showCrossConfirmationModal,
} from "../../../../../store/actions/NewMeetingActions";
import ModalCrossIcon from "../Organizers/ModalCrossIconClick/ModalCrossIcon";
import NotifyAgendaModal from "./NotifyAgendaContributors/NotifyAgendaModal";
import { notification } from "antd";
const AgendaContributers = ({ setParticipants, setAgendaContributors }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [notificationTable, setNotificationTable] = useState(false);
  const [rspvTable, setrspvTable] = useState(false);

  const shownotifyAgendaContrubutors = () => {
    dispatch(showAgendaContributorsModals(true));
  };

  const openCrossIconModal = () => {
    dispatch(showCrossConfirmationModal(true));
  };

  const data = [
    {
      key: "1",
      Name: (
        <label
          className={styles["Title_desc"]}
          onClick={shownotifyAgendaContrubutors}
        >
          Muahmmad Saif
        </label>
      ),
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      OrganizerTitle: <label className="column-boldness">Organizer</label>,
      Primary: (
        <label className="column-boldness">
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <TextField
                  disable={true}
                  width={"283px"}
                  placeholder={t("Content-title")}
                  labelClass={"d-none"}
                  applyClass={"Organizer_table"}
                />
              </Col>
            </Row>
          </>
        </label>
      ),
      Close: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              <img
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

  const AgendaColoumns = [
    {
      title: t("Name"),
      dataIndex: "Name",
      key: "Name",
      width: "300px",
    },
    {
      title: t("Email"),
      dataIndex: "Email",
      key: "Email",
      width: "300px",
    },

    {
      title: t("contributor-title"),
      dataIndex: "Primary",
      key: "Primary",
      width: "400px",
      //   render: (text, record) => {
      //     return (
      //       <>
      //         <Row>
      //           <Col
      //             sm={12}
      //             md={12}
      //             lg={12}
      //             className="d-flex justify-content-end"
      //           >
      //             <Tooltip placement="topRight" title={t("Edit")}>
      //               <img
      //                 // src={EditIcon}
      //                 className="cursor-pointer"
      //                 width="17.11px"
      //                 height="17.11px"
      //               />
      //             </Tooltip>
      //           </Col>
      //         </Row>
      //       </>
      //     );
      //   },
    },
    {
      dataIndex: "Close",
      key: "Close",
      width: "200px",
    },
  ];

  const notificationData = [
    {
      key: "1",
      Name: <label className={styles["Title_desc"]}>Muahmmad Saif</label>,
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      OrganizerTitle: <label className="column-boldness">Organizer</label>,
      Notification: (
        <>
          <Row>
            <Col lg={6} md={6} sm={6} className="d-flex justify-content-center">
              <img src={NotificationIcon} width="17.64px" height="12.4px" />
              {/* <img src={redMailIcon} width="17.64px" height="12.4px" /> */}
            </Col>
          </Row>
        </>
      ),
      Primary: (
        <label className="column-boldness">
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <TextField
                  disable={true}
                  width={"283px"}
                  placeholder={t("Content-title")}
                  labelClass={"d-none"}
                  applyClass={"Organizer_table"}
                />
              </Col>
            </Row>
          </>
        </label>
      ),
    },
  ];

  const [notificationRows, setNotificationRows] = useState(notificationData);

  const notificationColoumn = [
    {
      title: t("Name"),
      dataIndex: "Name",
      key: "Name",
      width: "300px",
    },
    {
      title: t("Email"),
      dataIndex: "Email",
      key: "Email",
      width: "300px",
    },

    {
      title: t("contributor-title"),
      dataIndex: "Primary",
      key: "Primary",
      width: "400px",
    },
    {
      title: t("Notification1"),
      dataIndex: "Notification",
      key: "Notification",
      width: "200px",
    },
  ];

  const rspvData = [
    {
      key: "1",
      Name: <label className={styles["Title_desc"]}>Muahmmad Saif</label>,
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      OrganizerTitle: <label className="column-boldness">Organizer</label>,
      Notification: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <img src={NotificationIcon} width="17.64px" height="12.4px" />
              {/* <img src={redMailIcon} width="17.64px" height="12.4px" /> */}
            </Col>
          </Row>
        </>
      ),
      rspv: (
        <>
          <img src={RspvIcon} height="30px" width="30px" />
          {/* <img src={RspcAbstainIcon} height="30px" width="30px" /> */}
        </>
      ),
    },
  ];
  const [rspvRows, setrspvRows] = useState(rspvData);

  const rspvColoumn = [
    {
      title: t("Name"),
      dataIndex: "Name",
      key: "Name",
      width: "300px",
    },
    {
      title: t("Email"),
      dataIndex: "Email",
      key: "Email",
      width: "300px",
    },

    {
      title: t("contributor-title"),
      dataIndex: "Primary",
      key: "Primary",
      width: "400px",
    },
    {
      title: t("Notification"),
      dataIndex: "Notification",
      key: "Notification",
      width: "400px",
    },
    {
      title: t("RSPV"),
      dataIndex: "rspv",
      key: "rspv",
      width: "400px",
    },
  ];

  const options = [
    {
      value: "chocolate",
      label: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Options_classs_contributors"]}>
                {t("Grant-access-to-all-agenda-items-and-files")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: "strawberry",
      label: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Options_classs_contributors"]}>
                {t("Grant-access-to-their-own-agenda-items-and-files-only")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const handleNextButton = () => {
    setAgendaContributors(false);
    setParticipants(true);
  };

  const openAddAgendaModal = () => {
    dispatch(showAddAgendaContributor(true));
  };

  const enableNotificatoinTable = () => {
    setNotificationTable(!notificationTable);
  };

  //You Can Enable Rspv Table From Here
  const anableRspvTable = () => {
    setrspvTable(!rspvTable);
  };

  return (
    <>
      <section>
        <Row className="mt-5">
          <Col lg={4} md={4} sm={12}>
            <Select options={options} />
          </Col>
          <Col
            lg={8}
            md={8}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            <Button
              text={t("Edit")}
              className={styles["Edit_Button_Organizers"]}
              icon={<img src={EditIcon} width="11.75px" height="11.75px" />}
              onClick={enableNotificatoinTable}
            />
            <Button
              text={t("Add-more")}
              icon={<img src={addmore} />}
              className={styles["AddMoreBtn"]}
              onClick={openAddAgendaModal}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            {notificationTable ? (
              <>
                <Table
                  column={notificationColoumn}
                  scroll={{ y: "62vh" }}
                  pagination={false}
                  className="Polling_table"
                  rows={notificationRows}
                />
              </>
            ) : rspvTable ? (
              <>
                <Table
                  column={rspvColoumn}
                  scroll={{ y: "62vh" }}
                  pagination={false}
                  className="Polling_table"
                  rows={rspvRows}
                />
              </>
            ) : (
              <>
                <Table
                  column={AgendaColoumns}
                  scroll={{ y: "62vh" }}
                  pagination={false}
                  className="Polling_table"
                  rows={
                    rowsData.length === 0 ? (
                      <>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justifys-content-center"
                          >
                            <img
                              src={emptyContributorState}
                              width="274.05px"
                              height="230.96px"
                            />
                          </Col>
                        </Row>
                      </>
                    ) : (
                      rowsData
                    )
                  }
                />
              </>
            )}
          </Col>
        </Row>
        <Row className="mt-5">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex gap-2 justify-content-end"
          >
            <Button
              text={t("Cancel")}
              className={styles["Cancel_Organization"]}
            />
            <Button
              text={t("Publish")}
              className={styles["Cancel_Organization"]}
            />
            <Button
              text={t("Save")}
              className={styles["Next_Organization"]}
              onClick={handleNextButton}
            />
            <Button
              text={t("Next")}
              className={styles["Next_Organization"]}
              onClick={handleNextButton}
            />
          </Col>
        </Row>
      </section>
      {NewMeetingreducer.agendaContributors && <AgendaContributorsModal />}
      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.notifyAgendaContributors && <NotifyAgendaModal />}
    </>
  );
};

export default AgendaContributers;
