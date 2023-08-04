import React, { useState } from "react";
import styles from "./Organizers.module.css";
import {
  Button,
  Table,
  TextField,
  Switch,
  Loader,
  Notification,
} from "../../../../../components/elements";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import addmore from "../../../../../assets/images/addmore.png";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showAddUserModal,
  showCrossConfirmationModal,
} from "../../../../../store/actions/NewMeetingActions";
import ModalOrganizor from "./ModalAddUserOrganizer/ModalOrganizor";
import ModalCrossIcon from "./ModalCrossIconClick/ModalCrossIcon";
const Organizers = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const { NewMeetingreducer } = useSelector((state) => state);
  const openCrossIconModal = () => {
    dispatch(showCrossConfirmationModal(true));
  };
  const data = [
    {
      key: "1",
      Name: <label className={styles["Title_desc"]}>Muahmmad Saif</label>,
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      OrganizerTitle: <label className="column-boldness">Organizer</label>,
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

  const openAddUserModal = () => {
    dispatch(showAddUserModal(true));
  };

  return (
    <>
      <section>
        <Row className="mt-4 m-0 p-0">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            <Button
              text={t("Edit")}
              className={styles["Edit_Button_Organizers"]}
              icon={<img src={EditIcon} width="11.75px" height="11.75px" />}
            />
            <Button
              text={t("Add-more")}
              icon={<img src={addmore} />}
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
        <Row className="mt-4">
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
            <Button text={t("Next")} className={styles["Next_Organization"]} />
          </Col>
        </Row>
      </section>
      {NewMeetingreducer.adduserModal && <ModalOrganizor />}
      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
    </>
  );
};

export default Organizers;
