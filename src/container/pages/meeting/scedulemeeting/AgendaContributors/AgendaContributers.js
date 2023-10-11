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
import { Button, Table, TextField } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import AgendaContributorsModal from "./AgdendaContributorsModal/AgendaContributorsModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showAddAgendaContributor,
  showAgendaContributorsModals,
  showCancelModalAgendaContributor,
  showCancelModalOrganizers,
  showCrossConfirmationModal,
} from "../../../../../store/actions/NewMeetingActions";
import ModalCrossIcon from "../Organizers/ModalCrossIconClick/ModalCrossIcon";
import tick from "../../../../../assets/images/PNG tick.png";
import NotifyAgendaModal from "./NotifyAgendaContributors/NotifyAgendaModal";
import { notification } from "antd";
import AgendaContributorView from "./AgendaContributorsView/AgendaContributorView";
import CancelAgendaContributor from "./CancelButtonAgendaContributor/CancelAgendaContributor";
const AgendaContributers = ({
  setParticipants,
  setAgendaContributors,
  setSceduleMeeting,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [notificationTable, setNotificationTable] = useState(false);
  const [rspvTable, setrspvTable] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [viewAgendaContributors, setViewAgendaContributors] = useState(false);
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
      //               <img draggable = {false}
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
              <img
                draggable={false}
                src={NotificationIcon}
                width="17.64px"
                height="12.4px"
              />
              {/* <img draggable = {false} src={redMailIcon} width="17.64px" height="12.4px" /> */}
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
              <img
                draggable={false}
                src={NotificationIcon}
                width="17.64px"
                height="12.4px"
              />
              {/* <img draggable = {false} src={redMailIcon} width="17.64px" height="12.4px" /> */}
            </Col>
          </Row>
        </>
      ),
      rsvp: (
        <>
          <img draggable={false} src={RspvIcon} height="30px" width="30px" />
          {/* <img draggable = {false} src={RspcAbstainIcon} height="30px" width="30px" /> */}
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
      title: t("RSVP"),
      dataIndex: "rsvp",
      key: "rsvp",
      width: "400px",
    },
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // React select tick option handled
  const CustomOption = ({ innerProps, label, isSelected }) => (
    <div {...innerProps} className={styles["option"]}>
      {console.log(label, "labellabellabel")}
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["OverAll_padding"]}>
          <Row className="mt-2">
            <Col lg={11} md={11} sm={11}>
              <span className={styles["label_Styles"]}>{label}</span>
            </Col>
            <Col lg={1} md={1} sm={1}>
              {isSelected && <img draggable={false} src={tick} />}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );

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
    // setNotificationTable(!notificationTable);
    dispatch(showCancelModalAgendaContributor(true));
  };

  //You Can Enable Rspv Table From Here
  const anableRspvTable = () => {
    setrspvTable(!rspvTable);
  };

  const EnableViewAgendaContributors = () => {
    setViewAgendaContributors(!viewAgendaContributors);
  };

  return (
    <>
      {viewAgendaContributors ? (
        <AgendaContributorView />
      ) : (
        <>
          <section className="position-relative">
            <Row className="mt-5">
              <Col lg={4} md={4} sm={12}>
                <Select
                  options={options}
                  value={selectedOption}
                  onChange={handleOptionSelect}
                  isSearchable={false}
                  components={{
                    Option: CustomOption,
                  }}
                />
              </Col>
              <Col
                lg={8}
                md={8}
                sm={12}
                className="d-flex justify-content-end gap-3"
              >
                <Button
                  text={t("Add-more")}
                  icon={<img draggable={false} src={addmore} />}
                  className={styles["AddMoreBtn"]}
                  onClick={openAddAgendaModal}
                />
                {selectedOption !== null ? (
                  <>
                    <Button text={"Save"} />
                    <Button text={"Cancel"} />
                  </>
                ) : (
                  <></>
                )}
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
                      locale={{
                        emptyText: (
                          <>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center"
                              >
                                <img
                                  draggable={false}
                                  src={emptyContributorState}
                                  width="274.05px"
                                  height="230.96px"
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center"
                              >
                                <span className={styles["Empty_state_heading"]}>
                                  {t("No-agenda-contributor")}
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center"
                              >
                                <span
                                  className={styles["Empty_state_Subheading"]}
                                >
                                  {t("There-are-no-agenda-contributors")}
                                </span>
                              </Col>
                            </Row>
                          </>
                        ),
                      }}
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
                      locale={{
                        emptyText: (
                          <>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center"
                              >
                                <img
                                  draggable={false}
                                  src={emptyContributorState}
                                  width="274.05px"
                                  height="230.96px"
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center"
                              >
                                <span className={styles["Empty_state_heading"]}>
                                  {t("No-agenda-contributor")}
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center"
                              >
                                <span
                                  className={styles["Empty_state_Subheading"]}
                                >
                                  {t("There-are-no-agenda-contributors")}
                                </span>
                              </Col>
                            </Row>
                          </>
                        ),
                      }}
                      rows={rspvRows}
                    />
                  </>
                ) : (
                  <>
                    <Table
                      column={AgendaColoumns}
                      scroll={{ y: "62vh" }}
                      pagination={false}
                      locale={{
                        emptyText: (
                          <>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center"
                              >
                                <img
                                  draggable={false}
                                  src={emptyContributorState}
                                  width="274.05px"
                                  height="230.96px"
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center"
                              >
                                <span className={styles["Empty_state_heading"]}>
                                  {t("No-agenda-contributor")}
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center"
                              >
                                <span
                                  className={styles["Empty_state_Subheading"]}
                                >
                                  {t("There-are-no-agenda-contributors")}
                                </span>
                              </Col>
                            </Row>
                          </>
                        ),
                      }}
                      className="Polling_table"
                      rows={rowsData}
                    />
                  </>
                )}
              </Col>
            </Row>
          </section>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <section className={styles["Footer_Class"]}>
                <Button
                  text={t("Cancel")}
                  className={styles["Cancel_Organization"]}
                  onClick={enableNotificatoinTable}
                />
                <Button
                  text={t("Save")}
                  className={styles["Cancel_Organization"]}
                />
                <Button
                  text={t("Save-and-publish")}
                  className={styles["Cancel_Organization"]}
                  onClick={EnableViewAgendaContributors}
                />
                <Button
                  text={t("Save-and-next")}
                  className={styles["Next_Organization"]}
                  onClick={handleNextButton}
                />
              </section>
            </Col>
          </Row>
        </>
      )}

      {NewMeetingreducer.agendaContributors && <AgendaContributorsModal />}
      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.notifyAgendaContributors && <NotifyAgendaModal />}
      {NewMeetingreducer.cancelAgendaContributor && (
        <CancelAgendaContributor setSceduleMeeting={setSceduleMeeting} />
      )}
    </>
  );
};

export default AgendaContributers;
