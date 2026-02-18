import React, { useState } from "react";
import styles from "./ImportPrevious.module.css";
import {
  Modal,
  Button,
  InputSearchFilter,
  Table,
} from "../../../../../../components/elements";
import { showImportPreviousAgendaModal } from "../../../../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import { Col, Row } from "react-bootstrap";
const ImportPrevious = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [importAgendaData, setImportAgendaData] = useState({
    InputSearchVal: "",
  });
  const data = [
    {
      key: "1",
      Title: (
        <label className={styles["Title_desc"]}>
          Stock and Shareholders Meeting
        </label>
      ),
      Status: <label className="column-boldness">Ended</label>,
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
              <span>{t("Title")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Title",
      key: "Title",
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

  const handleSearchFilter = (e) => {
    let value = e.target.value;
    setImportAgendaData({
      ...importAgendaData,
      InputSearchVal: value,
    });
  };

  return (
    <section>
      <Modal
        show={NewMeetingreducer.importPreviousAgendaModal}
        setShow={dispatch(showImportPreviousAgendaModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showImportPreviousAgendaModal(false));
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
                  <Col lg={10} md={10} sm={10}>
                    <span className={styles["Import_previous_agenda_heading"]}>
                      {t("Import-previous-agenda")}
                    </span>
                  </Col>
                  <Col
                    lg={2}
                    md={2}
                    sm={2}
                    className="d-flex justify-content-end align-items-center"
                  >
                    <img
                      src={BlackCrossIcon}
                      alt=""
                      height="16px"
                      width="16px"
                      className="cursor-pointer"
                      onClick={() => {
                        dispatch(showImportPreviousAgendaModal(false));
                      }}
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
                  <Col lg={9} md={9} sm={9} className="group-fields">
                    <InputSearchFilter
                      value={importAgendaData.InputSearchVal}
                      change={handleSearchFilter}
                      labelclass={"d-none"}
                    />
                  </Col>
                  <Col lg={3} md={3} sm={3}>
                    <Button
                      text={t("Search")}
                      className={styles["Search_Btn_Import"]}
                    />
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
                      className={styles["Cancel_button_IMportAgenda"]}
                    />
                    <Button
                      text={t("Import")}
                      className={styles["Import_button_IMportAgenda"]}
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

export default ImportPrevious;
