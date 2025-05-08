import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  AttachmentViewer,
  Button,
  Notification,
} from "../../../../../components/elements";
import AttachmentIcon from "../../../../../assets/images/Attachment.svg";
import {
  showAdvancePermissionModal,
  showVoteAgendaModal,
  showCastVoteAgendaModal,
  showviewVotesAgenda,
} from "../../../../../store/actions/NewMeetingActions";
import {
  AgendaVotingStatusUpdate,
  GetAgendaAndVotingInfo,
  GetCurrentAgendaDetails,
  clearResponseMessage,
} from "../../../../../store/actions/MeetingAgenda_action";
import styles from "./Agenda.module.css";
import Urls from "./Urls";
import RequestContributor from "./RequestContributor";
import SubAgendaMappingDragging from "./SubAgendaMappingDragging";
import dropmdownblack from "../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../assets/images/whiteupper.png";
import ViewVoteModal from "../../scedulemeeting/Agenda/VotingPage/ViewVoteModal/ViewVoteModal";
import CastVoteAgendaModal from "../../scedulemeeting/Agenda/VotingPage/CastVoteAgendaModal/CastVoteAgendaModal";
import { getFileExtension } from "../../../../DataRoom/SearchFunctionality/option";
import { DataRoomDownloadFileApiFunc } from "../../../../../store/actions/DataRoom_actions";
import { timeFormatFunction } from "../../../../../commen/functions/date_formater";
import { fileFormatforSignatureFlow } from "../../../../../commen/functions/utils";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import { useMeetingContext } from "../../../../../context/MeetingContext";

const ParentAgenda = ({
  data,
  index,
  rows,
  setRows,
  agendaItemRemovedIndex,
  setAgendaItemRemovedIndex,
  setSubajendaRemoval,
  advanceMeetingModalID,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { editorRole } = useMeetingContext();

  let currentUserID = localStorage.getItem("userID");

  const { NewMeetingreducer, MeetingAgendaReducer } = useSelector(
    (state) => state
  );

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const dispatch = useDispatch();
  const [mainLock, setmainLock] = useState([]);
  const [subLockArry, setSubLockArray] = useState([]);
  const [expandSubIndex, setExpandSubIndex] = useState(0);
  const [expandIndex, setExpandIndex] = useState(-1);
  const [subexpandIndex, setsubexpandIndex] = useState(-1);
  const [expand, setExpand] = useState(true);
  const [subExpand, setSubExpand] = useState([]);

  // Function For Expanding Main Agenda See More Options
  const handleExpandedBtn = (index) => {
    setExpandIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const openAdvancePermissionModal = () => {
    dispatch(showAdvancePermissionModal(true));
  };

  const openVoteMOdal = () => {
    dispatch(showVoteAgendaModal(true));
  };

  //Lock For Main Agenda Will Locks Its childs Also
  const apllyLockOnParentAgenda = (parentIndex) => {
    const exists = mainLock.some((item) => {
      if (item === parentIndex) {
        return true;
      }
      return false;
    });

    return exists;
  };

  const EnableViewVoteModal = (record) => {
    dispatch(showviewVotesAgenda(true));
    dispatch(GetCurrentAgendaDetails(record));
  };

  const EnableCastVoteModal = async (record) => {
    let Data = {
      MeetingID: advanceMeetingModalID,
      AgendaID: record.id ? record.id : record.subAgendaID,
      AgendaVotingID: record.agendaVotingID,
    };
    await dispatch(GetAgendaAndVotingInfo(Data, navigate, t));
    dispatch(showCastVoteAgendaModal(true));
    dispatch(GetCurrentAgendaDetails(record));
  };

  //Konsa user vote kar sakta hai
  const checkUserAuthentication = (record) => {
    let flag = record.agendaVoters.find(
      (data, index) => data.userID === Number(currentUserID)
    );
    if (flag) {
      return true;
    } else {
      return false;
    }
  };

  const startVoting = (record) => {
    let Data = {
      MeetingID: advanceMeetingModalID,
      AgendaID: record.id ? record.id : record.subAgendaID,
      AgendaVotingID: record.agendaVotingID,
      DoVotingStart: true,
    };
    dispatch(
      AgendaVotingStatusUpdate(Data, navigate, t, advanceMeetingModalID)
    );
  };

  const endVoting = (record) => {
    let Data = {
      MeetingID: advanceMeetingModalID,
      AgendaID: record.id ? record.id : record.subAgendaID,
      AgendaVotingID: record.agendaVotingID,
      DoVotingStart: false,
    };
    dispatch(
      AgendaVotingStatusUpdate(Data, navigate, t, advanceMeetingModalID)
    );
  };

  const downloadDocument = (record) => {
    let data = {
      FileID: Number(record.originalAttachmentName),
    };
    dispatch(
      DataRoomDownloadFileApiFunc(
        navigate,
        data,
        t,
        record.displayAttachmentName
      )
    );
  };
  const pdfData = (record, ext) => {
    let Data = {
      taskId: Number(record.originalAttachmentName),
      commingFrom: 4,
      fileName: record.displayAttachmentName,
      attachmentID: Number(record.originalAttachmentName),
    };
    let pdfDataJson = JSON.stringify(Data);
    if (fileFormatforSignatureFlow.includes(ext)) {
      window.open(
        `/Diskus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };

  // useEffect(() => {
  //   if (MeetingAgendaReducer.ResponseMessage === "Vote-casted-successfully") {
  //     showMessage(
  //       t("Thank-you-for-participanting-in-voting"),
  //       "success",
  //       setOpen
  //     );
  //     dispatch(clearResponseMessage(""));
  //   }
  // }, [MeetingAgendaReducer.ResponseMessage]);

  return (
    <>
      <div
        className={
          data.canView === false &&
          (editorRole.role === "Agenda Contributor" ||
            editorRole.role === "Participant")
            ? "d-none"
            : ""
        }
      >
        <Draggable
          key={data.id}
          draggableId={data.id}
          index={index}
          isDragDisabled={true}
        >
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.draggableProps}>
              {/* Main Agenda Items Mapping */}
              <span className="position-relative">
                <Row key={data.id} className="mt-4 m-0 p-0">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    key={index + 1}
                    className={
                      apllyLockOnParentAgenda(index)
                        ? styles["BackGround_Agenda_InActive"]
                        : styles["BackGround_Agenda"]
                    }
                  >
                    <Row>
                      <Col
                        lg={1}
                        md={1}
                        sm={1}
                        className={styles["BackGroundNewImplemented"]}
                      >
                        <Row isDragging={snapshot.isDragging}>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center align-items-center"
                            isDragging={snapshot.isDragging}
                            {...provided.dragHandleProps}
                          >
                            <img
                              draggable={false}
                              src={
                                expandIndex === index && expand
                                  ? blackArrowUpper
                                  : dropmdownblack
                              }
                              alt=""
                              width="18.71px"
                              height="9.36px"
                              className={
                                expandIndex === index && expand
                                  ? styles["Arrow_Expanded"]
                                  : styles["Arrow"]
                              }
                              onClick={() => {
                                handleExpandedBtn(index);
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>

                      <Col lg={11} md={11} sm={11}>
                        <section className={styles["SectionInnerClass"]}>
                          <Row key={index + 2} className="mt-4">
                            <Col lg={6} md={6} sm={12}>
                              <span className={styles["AgendaTitle_Heading"]}>
                                {data.title}
                              </span>
                            </Col>
                            <Col
                              lg={6}
                              md={6}
                              sm={12}
                              className="text-end mt-2"
                            >
                              {Number(data.agendaVotingID) !== 0 &&
                              Number(editorRole.status) === 10 &&
                              Number(data.voteOwner.userid) ===
                                Number(currentUserID) &&
                              !data.voteOwner?.currentVotingClosed ? (
                                <>
                                  <Button
                                    text={t("Start-voting")}
                                    className={styles["startVotingButton"]}
                                    onClick={() => startVoting(data)}
                                  />
                                  <Button
                                    text={t("View-votes")}
                                    className={styles["ViewVoteButton"]}
                                    onClick={() => EnableViewVoteModal(data)}
                                  />
                                </>
                              ) : Number(data.agendaVotingID) !== 0 &&
                                Number(editorRole.status) === 10 &&
                                Number(data.voteOwner.userid) ===
                                  Number(currentUserID) &&
                                data.voteOwner?.currentVotingClosed ? (
                                <>
                                  <Button
                                    text={t("End-voting")}
                                    className={styles["startVotingButton"]}
                                    onClick={() => endVoting(data)}
                                  />
                                  <Button
                                    text={t("View-votes")}
                                    className={styles["ViewVoteButton"]}
                                    onClick={() => EnableViewVoteModal(data)}
                                  />
                                </>
                              ) : editorRole.role === "Organizer" &&
                                (Number(data.agendaVotingID) !== 0 ||
                                  data.voteOwner?.currentVotingClosed) ? (
                                <>
                                  <Button
                                    text={t("View-votes")}
                                    className={styles["ViewVoteButton"]}
                                    onClick={() => EnableViewVoteModal(data)}
                                  />
                                </>
                              ) : null}

                              {Number(data.agendaVotingID) ===
                              0 ? null : Number(editorRole.status) === 10 &&
                                Number(data.voteOwner.userid) !==
                                  Number(currentUserID) &&
                                data.voteOwner?.currentVotingClosed &&
                                editorRole.role !== "Organizer" &&
                                checkUserAuthentication(data) ? (
                                <Button
                                  text={t("Cast-your-vote")}
                                  className={styles["CastYourVoteButton"]}
                                  onClick={() => EnableCastVoteModal(data)}
                                />
                              ) : null}
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["Show_Details_Tag"]}
                                onClick={() => {
                                  handleExpandedBtn(index);
                                }}
                              >
                                {expandIndex === index && expand
                                  ? t("Hide-details")
                                  : t("Show-details")}
                              </span>
                              {data.files.length > 0 ? (
                                <img
                                  className={styles["AttachmentIconImage"]}
                                  src={AttachmentIcon}
                                  alt=""
                                />
                              ) : null}
                            </Col>
                          </Row>
                          {expandIndex === index && expand ? (
                            <>
                              <Row className="mt-2">
                                <Col lg={12} md={12} sm={12}>
                                  <div
                                    className={styles["agendaCreationDetail"]}
                                  >
                                    <img
                                      src={`data:image/jpeg;base64,${data?.userProfilePicture?.displayProfilePictureName}`}
                                      className={styles["Image"]}
                                      alt=""
                                      draggable={false}
                                    />
                                    {/* <p className={styles["agendaCreater"]}>
                                      {data?.presenterName +
                                        " - (" +
                                        moment(
                                          timeFormatFunction(data.startDate)
                                        ).format("hh:mm a") +
                                        " - " +
                                        moment(
                                          timeFormatFunction(data.endDate)
                                        ).format("hh:mm a") +
                                        ")"}
                                    </p> */}
                                  </div>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={styles["ParaGraph_SavedMeeting"]}
                                  >
                                    {data.description}
                                  </span>
                                </Col>
                              </Row>
                              <Row key={index + 4} className="mt-3">
                                <Col lg={6} md={6} sm={6}>
                                  {data.selectedRadio === 1 ? (
                                    <span className={styles["Agenda_Heading"]}>
                                      {t("Documents")}
                                    </span>
                                  ) : data.selectedRadio === 2 ? (
                                    <span className={styles["Agenda_Heading"]}>
                                      {t("URL")}
                                    </span>
                                  ) : data.selectedRadio === 3 ? (
                                    <span className={styles["Agenda_Heading"]}>
                                      {t("Request-from-contributor")}
                                    </span>
                                  ) : null}
                                </Col>
                              </Row>
                              <Droppable
                                droppableId={`parent-${data.ID}-parent-attachments`}
                                type="attachment"
                              >
                                {(provided) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="d-flex flex-wrap gap-2 mb-3"
                                  >
                                    {data.selectedRadio === 1 &&
                                    Object.keys(data.files).length > 0 ? (
                                      <>
                                        {data.files.map(
                                          (filesData, fileIndex) => (
                                            <AttachmentViewer
                                              data={filesData}
                                              handleClickDownload={() =>
                                                downloadDocument(filesData)
                                              }
                                              handleEyeIcon={() =>
                                                pdfData(
                                                  filesData,
                                                  getFileExtension(
                                                    filesData?.displayAttachmentName
                                                  )
                                                )
                                              }
                                              id={Number(
                                                filesData.originalAttachmentName
                                              )}
                                              name={
                                                filesData.displayAttachmentName
                                              }
                                              key={fileIndex}
                                            />
                                          )
                                        )}
                                      </>
                                    ) : data.selectedRadio === 1 &&
                                      Object.keys(data.files).length === 0 ? (
                                      <span
                                        className={styles["NoFiles_Heading"]}
                                      >
                                        {t("No-files-attached")}){" "}
                                      </span>
                                    ) : null}

                                    {data.selectedRadio === 2 && (
                                      <Urls
                                        data={data}
                                        index={index}
                                        setRows={setRows}
                                        rows={rows}
                                      />
                                    )}

                                    {data.selectedRadio === 3 && (
                                      <RequestContributor
                                        data={data}
                                        index={index}
                                        setRows={setRows}
                                        rows={rows}
                                      />
                                    )}
                                  </div>
                                )}
                              </Droppable>
                            </>
                          ) : null}
                        </section>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </span>
              {/* SubAgenda Mapping */}
              {
                <SubAgendaMappingDragging
                  data={data}
                  index={index}
                  setRows={setRows}
                  rows={rows}
                  subexpandIndex={subexpandIndex}
                  expandSubIndex={expandSubIndex}
                  subExpand={subExpand}
                  apllyLockOnParentAgenda={apllyLockOnParentAgenda}
                  subLockArry={subLockArry}
                  setSubLockArray={setSubLockArray}
                  agendaItemRemovedIndex={agendaItemRemovedIndex}
                  setAgendaItemRemovedIndex={setAgendaItemRemovedIndex}
                  setSubajendaRemoval={setSubajendaRemoval}
                  setsubexpandIndex={setsubexpandIndex}
                  setExpandSubIndex={setExpandSubIndex}
                  setSubExpand={setSubExpand}
                  openAdvancePermissionModal={openAdvancePermissionModal}
                  openVoteMOdal={openVoteMOdal}
                  advanceMeetingModalID={advanceMeetingModalID}
                  editorRole={editorRole}
                />
              }
              {NewMeetingreducer.viewVotesAgenda && <ViewVoteModal />}
              {NewMeetingreducer.castVoteAgendaPage && <CastVoteAgendaModal />}
            </div>
          )}
        </Draggable>
      </div>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default ParentAgenda;
