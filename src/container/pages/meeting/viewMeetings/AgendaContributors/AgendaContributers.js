import React, { useEffect, useState } from "react";
import styles from "./AgendaContributors.module.css";
import { Col, Row } from "react-bootstrap";
import { Button, Table } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAgendaContributorApi } from "../../../../../store/actions/NewMeetingActions";
import ModalCrossIcon from "../Organizers/ModalCrossIconClick/ModalCrossIcon";
import redMailIcon from "../../../../../assets/images/redmail.svg";
import NORSVP from "../../../../../assets/images/No-RSVP.png";
import rspvGreenIcon from "../../../../../assets/images/rspvGreen.svg";
import greenMailIcon from "../../../../../assets/images/greenmail.svg";
import CancelButtonModal from "../meetingDetails/CancelButtonModal/CancelButtonModal";
const AgendaContributers = ({
  setParticipants,
  setAgendaContributors,
  setorganizers,
  setViewAdvanceMeetingModal,
  advanceMeetingModalID,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [cancelModalView, setCancelModalView] = useState(false);

  const [rowsData, setRowsData] = useState([]);

  useEffect(() => {
    let getAllData = {
      MeetingID:
        advanceMeetingModalID !== null ? Number(advanceMeetingModalID) : 0,
    };
    dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
  }, []);

  useEffect(() => {
    if (
      NewMeetingreducer.getAllAgendaContributors !== null &&
      NewMeetingreducer.getAllAgendaContributors !== undefined &&
      NewMeetingreducer.getAllAgendaContributors.length > 0
    ) {
      // Create a copy of data with was coming
      let agendaContributorData = [
        ...NewMeetingreducer.getAllAgendaContributors,
      ];

      let newArr = [];
      agendaContributorData.forEach((AgConData, index) => {
        newArr.push({
          userName: AgConData.userName,
          userID: AgConData.userID,
          displayPicture: AgConData.userProfilePicture,
          email: AgConData.emailAddress,
          Title: AgConData.contributorTitle,
          isRSVP: AgConData.rsvp,
          isEdit: true,
          isContributedNotified: true,
        });
      });
      setRowsData(newArr);
    }
  }, [NewMeetingreducer.getAllAgendaContributors]);

  const handleCancelBtn = () => {
    setCancelModalView(true);
  };
  const handleNextBtn = () => {
    setParticipants(true);
    setAgendaContributors(false);
  };
  const handlePreviousBtn = () => {
    setorganizers(true);
    setAgendaContributors(false);
  };

  const AgendaContributorViewColoumns = [
    {
      title: t("Name"),
      dataIndex: "userName",
      key: "userName",
      width: "300px",
    },

    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      width: "400px",
    },
    {
      title: t("Contributor-title"),
      dataIndex: "Title",
      key: "Title",
      width: "300px",
    },

    {
      title: t("RSVP"),
      dataIndex: "rsvp",
      key: "rsvp",
      width: "120px",
      render: (text, record) => {
        if (record.isRSVP === true) {
          return (
            <img
              draggable={false}
              src={rspvGreenIcon}
              height="30px"
              width="30px"
              alt=""
            />
          );
        } else {
          return (
            <img
              draggable={false}
              src={NORSVP}
              height="30px"
              width="30px"
              alt=""
            />
          );
        }
      },
    },

    {
      title: t("Notification"),
      dataIndex: "isContributedNotified",
      key: "isContributedNotified",
      width: "180px",
      render: (text, record) => {
        if (record.isContributedNotified === true) {
          return (
            <Row>
              <Col
                lg={7}
                md={7}
                sm={7}
                className="d-flex justify-content-center"
              >
                <img
                  draggable={false}
                  src={greenMailIcon}
                  height="30px"
                  width="30px"
                  alt=""
                />
              </Col>
            </Row>
          );
        } else if (record.isContributedNotified === false) {
          return (
            <Row>
              <Col
                lg={7}
                md={7}
                sm={7}
                className="d-flex justify-content-center"
              >
                <img
                  draggable={false}
                  src={redMailIcon}
                  height="30px"
                  width="30px"
                  alt=""
                />
              </Col>
            </Row>
          );
        }
      },
    },
  ];

  return (
    <>
      <section>
        <Row>
          <Col lg={12} md={12} sm={12} className={styles["FixedHeight"]}>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={AgendaContributorViewColoumns}
                  scroll={{ y: "62vh" }}
                  pagination={false}
                  className="Polling_table"
                  rows={rowsData}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            <Button
              text={t("Cancel")}
              className={styles["Cancel_Button_Organizers_view"]}
              onClick={handleCancelBtn}
            />
            <Button
              text={t("Previous")}
              className={styles["Next_Button_Organizers_view"]}
              onClick={handlePreviousBtn}
            />
            <Button
              text={t("Next")}
              className={styles["Next_Button_Organizers_view"]}
              onClick={handleNextBtn}
            />
          </Col>
        </Row>
      </section>
      {cancelModalView && (
        <CancelButtonModal
          setCancelModalView={setCancelModalView}
          cancelModalView={cancelModalView}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          setMeetingDetails={setAgendaContributors}
        />
      )}
      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
    </>
  );
};

export default AgendaContributers;
