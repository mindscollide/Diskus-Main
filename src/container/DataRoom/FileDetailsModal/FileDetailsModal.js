import React, { useEffect, useState } from "react";
import styles from "./FileDetailsModal.module.css";
import { Modal, Table } from "../../../components/elements";
import { showFileDetailsModal } from "../../../store/actions/DataRoom_actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
const FileDetailsModal = ({ fileDataforAnalyticsCount }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [analyticsCountData, setAnalyticsCountData] = useState([]);
  const fileDetials = useSelector((state) => state.DataRoomReducer.fileDetials);
  const getDataAnalyticsCountDetails = useSelector(
    (state) =>
      state.DataRoomFileAndFoldersDetailsReducer.getDataAnalyticsCountDetails
  );
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
      render: (text, record) => {
        return (
          <span className={styles["sharedUserTitle"]}>
            <img
              src={`data:image/jpeg;base64,${record.sharedUser.base64Img}`}
              width={30}
              height={30}
              className="rounded-circle"
              alt=""
            />
            {record.sharedUser.userName}
          </span>
        );
      },
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
      align: "center",
      render: (text, record) => {
        return <span>{record.viewedCount}</span>;
      },
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
      align: "center",
      render: (text, record) => {
        if (record.sharedUser.permissionID === 1) {
          return <span>{t("Not-allowed")}</span>;
        } else {
          return <span>{record.editedCount}</span>;
        }
      },
    },
  ];

  useEffect(() => {
    if (getDataAnalyticsCountDetails) {
      setAnalyticsCountData(getDataAnalyticsCountDetails);
    }
  }, [getDataAnalyticsCountDetails]);
  return (
    <section>
      <Modal
        show={fileDetials}
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
                <span className={styles["File_name"]}>
                  {fileDataforAnalyticsCount?.name}
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={FileDetails}
                  scroll={{ y: "30vh" }}
                  pagination={false}
                  className="NewMeeting_table"
                  rows={analyticsCountData}
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
