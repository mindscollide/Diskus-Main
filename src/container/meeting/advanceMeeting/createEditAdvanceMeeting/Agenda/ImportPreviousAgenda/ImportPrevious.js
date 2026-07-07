import React, { useState, useEffect } from "react";
import styles from "./ImportPrevious.module.css";
import {
  Modal,
  Button,
  Table,
  CustomRadio2,
} from "../../../../../../components/elements";
import { showImportPreviousAgendaModal } from "../../../../../../store/actions/NewMeetingActions";
import CustomPagination from "../../../../../../commen/functions/customPagination/Paginations";
import { newTimeFormaterForImportMeetingAgenda } from "../../../../../../commen/functions/date_formater";
import {
  GetAllMeetingForAgendaImport,
  GetAgendaWithMeetingIDForImport,
} from "../../../../../../store/actions/MeetingAgenda_action";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
const ImportPrevious = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer, MeetingAgendaReducer } = useSelector(
    (state) => state
  );
  // const [importAgendaData, setImportAgendaData] = useState({
  //   InputSearchVal: "",
  // });
  const [isPageSize, setIsPageSize] = useState(20);
  const [isCurrent, setIsCurrent] = useState(1);

  const [rowsData, setRowsData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedRow, setSelectedRow] = useState(null);

  const handleRadioChange = (record) => {
    setSelectedRow(record);
    
  };

  const MeetingColoumns = [
    {
      key: "select",
      width: "50px",
      render: (text, record) => (
        <CustomRadio2
          onChange={() => handleRadioChange(record)}
          Optios={record}
          value={[selectedRow]}
        />
      ),
    },
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
      dataIndex: "meetingTitle",
      key: "meetingTitle",
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
      dataIndex: "meetingID",
      key: "meetingID",
      width: "100px",
      render: (text, record) => {
        return <label className="column-boldness">Ended</label>;
      },
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
      dataIndex: "meetingDate",
      key: "meetingDate",
      width: "150px",
      render: (text, record) => {
        if (record.endTime !== null && record.meetingDate !== null) {
          return (
            <label className="column-boldness">
              {newTimeFormaterForImportMeetingAgenda(
                record.meetingDate + record.endTime
              )}
            </label>
          );
        }
      },
    },
  ];

  // const handleSearchFilter = (e) => {
  //   let value = e.target.value;
  //   setImportAgendaData({
  //     ...importAgendaData,
  //     InputSearchVal: value,
  //   });
  // };

  useEffect(() => {
    let Data = {
      PageNumber: 1,
      Length: 20,
    };

    dispatch(GetAllMeetingForAgendaImport(Data, navigate, t));
  }, []);

  const handelChangePagination = async (current, PageSize) => {
    
    let Data = {
      PageNumber: current,
      Length: PageSize,
    };
    setIsCurrent(current);
    setIsPageSize(PageSize);
    await dispatch(GetAllMeetingForAgendaImport(Data, navigate, t));
  };

  useEffect(() => {
    if (
      MeetingAgendaReducer.GetAllMeetingForAgendaImportData !== undefined &&
      MeetingAgendaReducer.GetAllMeetingForAgendaImportData !== null &&
      MeetingAgendaReducer.GetAllMeetingForAgendaImportData.length !== 0
    ) {
      setRowsData(
        MeetingAgendaReducer.GetAllMeetingForAgendaImportData.meetings
      );
      setTotalRecords(
        MeetingAgendaReducer.GetAllMeetingForAgendaImportData.totalRecords
      );
    } else {
      setRowsData([]);
    }
  }, [MeetingAgendaReducer.GetAllMeetingForAgendaImportData]);

  const importAllPreviousAgendas = () => {
    let Data = {
      MeetingID: selectedRow.meetingID,
    };
    dispatch(GetAgendaWithMeetingIDForImport(Data, navigate, t));
    dispatch(showImportPreviousAgendaModal(false));
  };

  const closeImportAgendaModal = () => {
    dispatch(showImportPreviousAgendaModal(false));
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
        size={"xl"}
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
                  <Col lg={10} md={10} sm={12}>
                    <span className={styles["Import_previous_agenda_heading"]}>
                      {t("Import-previous-agenda")}
                    </span>
                  </Col>
                  <Col
                    lg={2}
                    md={2}
                    sm={12}
                    className="d-flex justify-content-end align-items-center"
                  >
                    <img
                      src={BlackCrossIcon}
                      height="16px"
                      width="16px"
                      alt=""
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
                {/* <Row>
                  <Col lg={10} md={10} sm={12} className="group-fields">
                    <InputSearchFilter
                      value={importAgendaData.InputSearchVal}
                      change={handleSearchFilter}
                      labelclass={"d-none"}
                    />
                  </Col>
                  <Col lg={2} md={2} sm={12}>
                    <Button
                      text={t("Search")}
                      className={styles["Search_Btn_Import"]}
                    />
                  </Col>
                </Row> */}
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Table
                      column={MeetingColoumns}
                      scroll={{ y: "30vh" }}
                      pagination={false}
                      className="NewMeeting_table"
                      rows={rowsData}
                    />
                  </Col>
                </Row>
                {rowsData.length > 0 ? (
                  <>
                    <Row className="mt-5">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center "
                      >
                        <Row className={styles["PaginationStyle-Committee"]}>
                          <Col
                            className={"pagination-groups-table"}
                            sm={12}
                            md={12}
                            lg={12}
                          >
                            <CustomPagination
                              current={isCurrent}
                              pageSize={isPageSize}
                              onChange={handelChangePagination}
                              pageSizeOptionsValues={["20", "50", "100", "200"]}
                              total={totalRecords}
                              showSizer={true}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                ) : null}
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
                      onClick={closeImportAgendaModal}
                    />
                    <Button
                      text={t("Import")}
                      className={styles["Import_button_IMportAgenda"]}
                      onClick={importAllPreviousAgendas}
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
