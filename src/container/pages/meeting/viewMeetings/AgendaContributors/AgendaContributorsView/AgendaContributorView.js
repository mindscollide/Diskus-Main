import React, { useState } from "react";
import styles from "./AgendaContributorView.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "../../../../../../components/elements";
const AgendaContributorView = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const AgendaContributorViewData = [
    {
      key: "1",
      Name: <label className={styles["Title_desc"]}>Saad Fudda</label>,
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      ContributorTitle: (
        <label className="column-boldness">Content Writer</label>
      ),
    },
  ];

  const [agendaContributorsViewRows, setAgendaContributorsViewRows] = useState(
    AgendaContributorViewData
  );
  const AgendaContributorViewColoumns = [
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
      title: t("Contributor-title"),
      dataIndex: "ContributorTitle",
      key: "ContributorTitle",
      width: "300px",
    },
  ];
  return (
    <section>
      <Row className="mt-4">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["Grant_Access_Styles"]}>
            Grant access to their own agenda items and files only
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["FixedHeight"]}>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <Table
                column={AgendaContributorViewColoumns}
                scroll={{ y: "62vh" }}
                pagination={false}
                className="Polling_table"
                rows={agendaContributorsViewRows}
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
            text={t("Clone-meeting")}
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

export default AgendaContributorView;
