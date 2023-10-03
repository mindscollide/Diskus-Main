import React, { useState } from "react";
import styles from "./ParticipantsView.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Button, Table } from "../../../../../../components/elements";
const ParticipantsView = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ParticipantsViewData = [
    {
      key: "1",
      Name: <label className={styles["Title_desc"]}>Muahmmad Saif</label>,
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      Participanttitle: <label>Content Writer</label>,
      Role: <label>Participant</label>,
    },
  ];

  const [participantsViewRows, setParticipantsViewRows] =
    useState(ParticipantsViewData);
  const ParticipantsViewColoumn = [
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
      width: "260px",
    },

    {
      title: t("Email"),
      dataIndex: "Email",
      key: "Email",
      width: "280px",
    },
    {
      title: t("Participant-title"),
      dataIndex: "Participanttitle",
      key: "Participanttitle",
      width: "300px",
    },

    {
      title: t("Role"),
      dataIndex: "Role",
      key: "Role",
      width: "249px",
    },
  ];

  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["FixedHeight"]}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Table
                column={ParticipantsViewColoumn}
                scroll={{ y: "62vh" }}
                pagination={false}
                className="Polling_table"
                rows={participantsViewRows}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={t("Clone-meeting")}
            className={styles["Cancel_Button_Organizers_view"]}
          />

          <Button
            text={t("View-poll")}
            className={styles["Cancel_Button_Organizers_view"]}
          />

          <Button
            text={t("Cancel")}
            className={styles["Cancel_Button_Organizers_view"]}
          />
          <Button
            text={t("Next")}
            className={styles["Next_Button_Organizers_view"]}
          />
        </Col>
      </Row>
    </section>
  );
};

export default ParticipantsView;
