import React from "react";
import styles from "./FileDetailsModal.module.css";
import { Modal, Table } from "../../../components/elements";
import { showFileDetailsModal } from "../../../store/actions/DataRoom_actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
const FileDetailsModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { DataRoomReducer } = useSelector((state) => state);

  const FileDetails = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Documents")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Documents",
      key: "Documents",
      width: "250px",
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("View")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "View",
      key: "View",
      width: "100px",
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Edit")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Edit",
      key: "Edit",
      width: "150px",
    },
  ];

  //   Dummy data
  const FileData = [
    {
      key: "1",
      Documents: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Row_Details_styles"]}>Saad Fudda</span>
            </Col>
          </Row>
        </>
      ),
      View: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Row_Details_styles"]}>2</span>
            </Col>
          </Row>
        </>
      ),
      Edit: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Row_Details_styles"]}>
                {t("Not-allowed")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
  ];
  return (
    <section>
      <Modal
        show={DataRoomReducer.fileDetials}
        setShow={dispatch(showFileDetailsModal)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showFileDetailsModal(false));
        }}
        size={"md"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["File_name"]}>Dairalogo.pdf</span>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={FileDetails}
                  scroll={{ y: "30vh" }}
                  pagination={false}
                  className="NewMeeting_table"
                  rows={FileData}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default FileDetailsModal;
