import React, { useState } from "react";
import styles from "./OrganizersViewPage.module.css";
import { Button, Table } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const OrganizersViewPage = () => {
  const { t } = useTranslation();

  const notificationData = [
    {
      key: "1",
      Name: <label className={styles["Title_desc"]}>Muahmmad Saif</label>,
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      OrganizerTitle: <label className="column-boldness">Organizer</label>,
      Notification: <label></label>,
      Primary: <label className="column-boldness">Primary</label>,
    },
  ];

  const [notificationRows, setnotificationRows] = useState(notificationData);
  const NotifcatoinColoumns = [
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
  ];
  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["FixedHeight"]}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Table
                column={NotifcatoinColoumns}
                scroll={{ y: "62vh" }}
                pagination={false}
                className="Polling_table"
                rows={notificationRows}
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

export default OrganizersViewPage;
