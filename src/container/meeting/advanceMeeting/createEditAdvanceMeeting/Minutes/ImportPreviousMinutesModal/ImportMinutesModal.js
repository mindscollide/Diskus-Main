import React, { useState } from "react";
import styles from "./ImportMinutesModal.module.css";
import {
  Modal,
  InputSearchFilter,
  Table,
  TextField,
  Button,
} from "../../../../../../components/elements";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import {
  showAfterImportState,
  showImportPreviousMinutes,
} from "../../../../../../store/actions/NewMeetingActions";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";

const ImportMinutesModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const data = [
    {
      key: "1",
      MeetingTitle: (
        <label className={styles["Title_desc"]}>
          Stock and Shareholders Meeting
        </label>
      ),
      Status: <label className={styles["Status"]}>Ended</label>,
      Date: <label className="column-boldness">4:15pm - 26th May, 2020</label>,
    },
  ];
  const [rowsData, setRowsData] = useState(data);
  const MeetingColoumns = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Meeting-title")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "MeetingTitle",
      key: "MeetingTitle",
      width: "250px",
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Status")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Status",
      key: "Status",
      width: "100px",
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Date/Time")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Date",
      key: "Date",
      width: "150px",
    },
  ];

  const handleCrossIconFunction = () => {
    dispatch(showImportPreviousMinutes(false));
  };

  const HandleCancelBtn = () => {
    dispatch(showImportPreviousMinutes(false));
  };

  const handleImportButton = () => {
    dispatch(showImportPreviousMinutes(false));
    dispatch(showAfterImportState(true));
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.ImportPreviousMinutes}
        setShow={dispatch(showImportPreviousMinutes)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showImportPreviousMinutes(false));
        }}
        size={"lg"}
        ModalTitle={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OverAll_Padding"]}
              >
                <Row>
                  <Col lg={11} md={11} sm={11}>
                    <span className={styles["Import-previous-minutes"]}>
                      {t("Import-previous-minutes")}
                    </span>
                  </Col>
                  <Col
                    lg={1}
                    md={1}
                    sm={1}
                    className="d-flex justify-content-end align-items-center"
                  >
                    <img
                      src={BlackCrossIcon}
                      height="16px"
                      width="16px"
                      className="cursor-pointer"
                      onClick={handleCrossIconFunction}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OverAll_Padding"]}
              >
                <Row>
                  <Col
                    lg={12}
                    sm={12}
                    md={12}
                    className={styles["OverAll_Padding"]}
                  >
                    <Row className="mt-3">
                      <Col
                        lg={10}
                        md={10}
                        sm={10}
                        className="ImportPreviousMinutes m-0 p-0"
                      >
                        <InputSearchFilter labelclass={"d-none"} />
                      </Col>
                      <Col lg={2} md={2} sm={2}>
                        <Button
                          text={t("Search")}
                          className={styles["Search_Btn_Minutes_Import"]}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Table
                      column={MeetingColoumns}
                      scroll={{ y: "62vh" }}
                      pagination={false}
                      className="NewMeeting_table"
                      rows={rowsData}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OverAll_Padding"]}
              >
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end gap-2"
                  >
                    <Button
                      text={t("Cancel")}
                      className={styles["Cancel_button_Minutes_Import"]}
                      onClick={HandleCancelBtn}
                    />
                    <Button
                      text={t("Import")}
                      className={styles["Import_Button_Minutes_Previous"]}
                      onClick={handleImportButton}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default ImportMinutesModal;
