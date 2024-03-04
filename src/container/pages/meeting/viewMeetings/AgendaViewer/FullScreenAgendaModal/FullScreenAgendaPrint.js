import React, { useState, useEffect, useRef } from "react";
import styles from "./../Agenda.module.css";
import { useNavigate } from "react-router-dom";
import { Col, Row, Modal } from "react-bootstrap";
import { Button, Notification } from "./../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import CancelMeetingMaterial from "./../CancelMeetingMaterial/CancelMeetingMaterial";
import { useDispatch, useSelector } from "react-redux";
import {
  searchNewUserMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "./../../../../../../store/actions/NewMeetingActions";
import {
  GetAdvanceMeetingAgendabyMeetingID,
  clearAgendaReducerState,
} from "./../../../../../../store/actions/MeetingAgenda_action";
import emptyContributorState from "./../../../../../../assets/images/Empty_Agenda_Meeting_view.svg";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ParentAgenda from "./../ParentAgenda";
import AllFilesModal from "./../AllFilesModal/AllFilesModal";
import ExportAgendaModal from "./../ExportAgendaModal/ExportAgendaModal";
import ParticipantInfoModal from "./../ParticipantInfoModal/ParticipantInfoModal";
import PrintAgendaModal from "./../PrintAgendaModal/PrintAgendaModal";
import SelectAgendaModal from "./../SelectAgendaModal/SelectAgendaModal";
import ShareEmailModal from "./../ShareEmailModal/ShareEmailModal";
import { onDragEnd } from "./../drageFunction";
import CollapseIcon from "./../AV-Images/Collapse-Icon.png";
import ExpandAgendaIcon from "./../AV-Images/Expand-Agenda-Icon.png";
import CollapseAgendaIcon from "./../AV-Images/Collapse-Agenda-Icon.png";
import MenuIcon from "./../AV-Images/Menu-Icon.png";
import ParticipantsInfo from "./../AV-Images/Participants-Icon.png";
import PrintIcon from "./../AV-Images/Print-Icon.png";
import ExportIcon from "./../AV-Images/Export-Icon.png";
import ShareIcon from "./../AV-Images/Share-Icon.png";

const FullScreenAgendaPrint = ({
  setFullScreenView,
  setViewAdvanceMeetingModal,
  advanceMeetingModalID,
  setAdvanceMeetingModalID,
  setMeetingMaterial,
  setMinutes,
  editorRole,
  setEdiorRole,
  setactionsPage,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const GetAdvanceMeetingAgendabyMeetingIDData = useSelector(
    (state) => state.MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData
  );

  const cancelMeetingMaterial = useSelector(
    (state) => state.NewMeetingreducer.cancelMeetingMaterial
  );

  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  // For cancel with no modal Open
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");

  const [rows, setRows] = useState([]);
  const [emptyStateRows, setEmptyStateRows] = useState(false);

  const [agendaSelectOptionView, setAgendaSelectOptionView] = useState(false);
  const [exportAgendaView, setExportAgendaView] = useState(false);
  const [printAgendaView, setPrintAgendaView] = useState(false);
  const [shareEmailView, setShareEmailView] = useState(false);
  const [showMoreFilesView, setShowMoreFilesView] = useState(false);
  const [participantInfoView, setParticipantInfoView] = useState(false);

  const [fileDataAgenda, setFileDataAgenda] = useState([]);
  const [agendaName, setAgendaName] = useState("");
  const [agendaIndex, setAgendaIndex] = useState(-1);
  const [subAgendaIndex, setSubAgendaIndex] = useState(-1);

  useEffect(() => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(GetAdvanceMeetingAgendabyMeetingID(Data, navigate, t));
    return () => {
      dispatch(clearAgendaReducerState());
      setRows([]);
    };
  }, []);

  const handleCancelMeetingNoPopup = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.removeItem("folderDataRoomMeeting");
    setViewAdvanceMeetingModal(false);
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
    setactionsPage(false);
  };

  const handleClickSave = () => {
    setMinutes(true);
    setMeetingMaterial(false);
  };

  useEffect(() => {
    if (
      GetAdvanceMeetingAgendabyMeetingIDData !== null &&
      GetAdvanceMeetingAgendabyMeetingIDData !== undefined &&
      GetAdvanceMeetingAgendabyMeetingIDData.length !== 0
    ) {
      setRows(GetAdvanceMeetingAgendabyMeetingIDData.agendaList);
    }
  }, [GetAdvanceMeetingAgendabyMeetingIDData]);

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

  return (
    <section>
      <Modal
        show={true}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => setFullScreenView(false)}
        size={"xl"}
        className="FullScreenModal"
        ModalTitle={"Test"}
        ModalBody={
          <>
            {emptyStateRows === true &&
            (editorRole.role === "Agenda Contributor" ||
              editorRole.role === "Participant") ? (
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
              </>
            ) : null}
            <>
              <section>
                {emptyStateRows === true &&
                (editorRole.role === "Agenda Contributor" ||
                  editorRole.role === "Participant") ? null : (
                  <>
                    <DragDropContext
                      onDragEnd={(result) => onDragEnd(result, rows, setRows)}
                    >
                      <Row>
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
                                          setSubajendaRemoval={
                                            setSubajendaRemoval
                                          }
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
                                          className={
                                            styles["Empty_state_heading"]
                                          }
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
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end gap-2 mt-2"
                  >
                    <Button
                      text={t("Cancel")}
                      className={styles["Cancel_Meeting_Details"]}
                      onClick={handleCancelMeetingNoPopup}
                    />

                    <Button
                      text={t("Next")}
                      onClick={handleClickSave}
                      className={styles["Save_Classname"]}
                      disableBtn={
                        Number(editorRole.status) === 11 ||
                        Number(editorRole.status) === 12 ||
                        Number(editorRole.status) === 1
                          ? true
                          : false
                      }
                    />
                  </Col>
                </Row>
              </section>
            </>
          </>
        }
        ModalFooter={"Test"}
      />
    </section>
  );
};

export default FullScreenAgendaPrint;
