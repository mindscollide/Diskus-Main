import React, { useState, useEffect } from "react";
import styles from "./PrintExportAgendaModal.module.css";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Button, Modal } from "./../../../../../../components/elements";
import {
  printAgenda,
  exportAgenda,
  ExportAgendaPDF,
  PrintMeetingAgenda,
} from "../../../../../../store/actions/MeetingAgenda_action";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import emptyContributorState from "./../../../../../../assets/images/Empty_Agenda_Meeting_view.svg";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ParentAgenda from "./../ParentAgenda";
import AllFilesModal from "./../AllFilesModal/AllFilesModal";
import { onDragEnd } from "./../drageFunction";
import CrossIcon from "./../AV-Images/Cross_Icon.png";

const PrintExportAgendaModal = ({
  setPrintAgendaView,
  advanceMeetingModalID,
  editorRole,
  rows,
  setRows,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const printFlag = useSelector(
    (state) => state.MeetingAgendaReducer.PrintAgendaFlag
  );

  const exportFlag = useSelector(
    (state) => state.MeetingAgendaReducer.ExportAgendaFlag
  );

  const agendaValueFlag = useSelector(
    (state) => state.MeetingAgendaReducer.AgendaViewFlag
  );

  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);

  let currentMeeting = Number(localStorage.getItem("currentMeetingLS"));

  let meetingTitle = localStorage.getItem("meetingTitle");

  // const [rows, setRows] = useState([]);
  const [emptyStateRows, setEmptyStateRows] = useState(false);

  const [showMoreFilesView, setShowMoreFilesView] = useState(false);

  const [fileDataAgenda, setFileDataAgenda] = useState([]);
  const [agendaName, setAgendaName] = useState("");
  const [agendaIndex, setAgendaIndex] = useState(-1);
  const [subAgendaIndex, setSubAgendaIndex] = useState(-1);

  useEffect(() => {
    if (rows.length !== 0) {
      // Check if any of the canView values is true
      const anyCanViewTrue = rows.some((row) => row.canView);

      // Update the emptyStateRows state based on the condition
      setEmptyStateRows(!anyCanViewTrue);
    } else {
      setEmptyStateRows(false);
    }
  }, [rows]);

  const [initialRows, setInitialRows] = useState([]);

  useEffect(() => {
    const initialData = [...rows];
    setRows(initialData);
    setInitialRows(initialData);
  }, []);

  // Modify rows state based on agendaValueFlag
  useEffect(() => {
    const modifiedRows = rows.map((row) => {
      if (agendaValueFlag === 1) {
        return { ...row, subAgenda: [] };
      } else {
        return row;
      }
    });
    setRows(modifiedRows);
  }, [agendaValueFlag]); // Added rows dependency

  // Function to reset rows state to initial state
  const resetRows = () => {
    setRows([...initialRows]); // Revert to initialRows
  };

  const closePrintExportModal = () => {
    setPrintAgendaView(false);
    dispatch(printAgenda(false));
    dispatch(exportAgenda(false));
    resetRows();
  };

  const printExportFeature = () => {
    let Data = {
      PK_MDID: currentMeeting,
      MeetingTitle: meetingTitle,
      IsSubAgendaNeeded: agendaValueFlag === 1 ? false : true,
    };
    if (printFlag === true) {
      dispatch(PrintMeetingAgenda(Data, navigate, t));
    } else if (exportFlag === true) {
      dispatch(ExportAgendaPDF(Data, navigate, t, meetingTitle));
    }
  };

  return (
    <Modal
      show={true}
      modalFooterClassName={"d-block"}
      modalHeaderClassName={"d-block"}
      onHide={closePrintExportModal}
      fullscreen={true}
      className={
        showMoreFilesView ? "PrintExportScreen blurEffect" : "PrintExportScreen"
      }
      ModalTitle={
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className={styles["agendaViewerHeader"]}
            >
              <p className={styles["FileModalTitle"]}>
                {printFlag === true
                  ? t("Print")
                  : exportFlag === true
                  ? t("Export")
                  : null}
              </p>
              <img
                onClick={closePrintExportModal}
                className={styles["image-close"]}
                src={CrossIcon}
                alt=""
              />
            </Col>
          </Row>
        </>
      }
      ModalBody={
        <section>
          {emptyStateRows === true &&
          (editorRole.role === "Agenda Contributor" ||
            editorRole.role === "Participant") ? (
            <section>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center mt-3"
                >
                  <img
                    draggable={false}
                    src={emptyContributorState}
                    width="274.05px"
                    alt=""
                    height="230.96px"
                    className={styles["Image-Add-Agenda"]}
                  />
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center mt-3"
                >
                  <span className={styles["Empty_state_heading"]}>
                    {t("No-agenda-availabe-to-discuss").toUpperCase()}
                  </span>
                </Col>
              </Row>
            </section>
          ) : null}
          <section>
            {emptyStateRows === true &&
            (editorRole.role === "Agenda Contributor" ||
              editorRole.role === "Participant") ? null : (
              <>
                <DragDropContext
                  onDragEnd={(result) => onDragEnd(result, rows, setRows)}
                >
                  <Row className={styles["horizontalSpacing"]}>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["Scroller_Agenda"]}
                    >
                      <Droppable droppableId="board" type="PARENT">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {rows.length > 0 ? (
                              rows.map((data, index) => {
                                return (
                                  <>
                                    <ParentAgenda
                                      data={data}
                                      index={index}
                                      rows={rows}
                                      setRows={setRows}
                                      setFileDataAgenda={setFileDataAgenda}
                                      fileDataAgenda={fileDataAgenda}
                                      setAgendaName={setAgendaName}
                                      agendaName={agendaName}
                                      setAgendaIndex={setAgendaIndex}
                                      agendaIndex={agendaIndex}
                                      setSubAgendaIndex={setSubAgendaIndex}
                                      subAgendaIndex={subAgendaIndex}
                                      setMainAgendaRemovalIndex={
                                        setMainAgendaRemovalIndex
                                      }
                                      agendaItemRemovedIndex={
                                        agendaItemRemovedIndex
                                      }
                                      setAgendaItemRemovedIndex={
                                        setAgendaItemRemovedIndex
                                      }
                                      setSubajendaRemoval={setSubajendaRemoval}
                                      editorRole={editorRole}
                                      advanceMeetingModalID={
                                        advanceMeetingModalID
                                      }
                                      setShowMoreFilesView={
                                        setShowMoreFilesView
                                      }
                                    />
                                  </>
                                );
                              })
                            ) : (
                              <>
                                <Row>
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className="d-flex justify-content-center mt-3"
                                  >
                                    <img
                                      draggable={false}
                                      src={emptyContributorState}
                                      width="274.05px"
                                      alt=""
                                      height="230.96px"
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className="d-flex justify-content-center mt-3"
                                  >
                                    <span
                                      className={styles["Empty_state_heading"]}
                                    >
                                      {t("Add-agenda").toUpperCase()}
                                    </span>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className="d-flex justify-content-center"
                                  >
                                    <span
                                      className={
                                        styles["Empty_state_Subheading"]
                                      }
                                    >
                                      {t(
                                        "Add-some-purpose-start-by-creating-your-agenda"
                                      )}
                                    </span>
                                  </Col>
                                </Row>
                              </>
                            )}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </Col>
                  </Row>
                </DragDropContext>
              </>
            )}
            {showMoreFilesView ? (
              <AllFilesModal
                agendaName={agendaName}
                fileDataAgenda={fileDataAgenda}
                setShowMoreFilesView={setShowMoreFilesView}
                agendaIndex={agendaIndex}
                subAgendaIndex={subAgendaIndex}
                setFileDataAgenda={setFileDataAgenda}
                setAgendaName={setAgendaName}
                setAgendaIndex={setAgendaIndex}
                setSubAgendaIndex={setSubAgendaIndex}
              />
            ) : null}
          </section>
        </section>
      }
      ModalFooter={
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2 p-0"
            >
              <Button
                text={
                  printFlag === true
                    ? t("Print")
                    : exportFlag === true
                    ? t("Export")
                    : null
                }
                className={styles["Send_Notify"]}
                onClick={printExportFeature}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default PrintExportAgendaModal;
