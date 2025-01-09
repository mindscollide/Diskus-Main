import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import {
  AttachmentViewer,
  Button,
  Notification,
} from "../../../../../components/elements";
import styles from "./Agenda.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  showCastVoteAgendaModal,
  showviewVotesAgenda,
} from "../../../../../store/actions/NewMeetingActions";
import {
  AgendaVotingStatusUpdate,
  GetAgendaAndVotingInfo,
  GetCurrentAgendaDetails,
  clearResponseMessage,
} from "../../../../../store/actions/MeetingAgenda_action";
import { useDispatch } from "react-redux";
import SubUrls from "./SubUrls";
import SubRequestContributor from "./SubRequestContributor";
import { useEffect } from "react";
import { getFileExtension } from "../../../../DataRoom/SearchFunctionality/option";
import { DataRoomDownloadFileApiFunc } from "../../../../../store/actions/DataRoom_actions";
import { timeFormatFunction } from "../../../../../commen/functions/date_formater";
import { fileFormatforSignatureFlow } from "../../../../../commen/functions/utils";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import { useMeetingContext } from "../../../../../context/MeetingContext";

const SubAgendaMappingDragging = ({
  data,
  index,
  setRows,
  rows,
  apllyLockOnParentAgenda,
  subLockArry,
  setSubLockArray,
  setSubExpand,
  advanceMeetingModalID,
  setFileDataAgenda,
  setAgendaName,
  fileDataAgenda,
  agendaName,
  setShowMoreFilesView,
  setAgendaIndex,
  agendaIndex,
  setSubAgendaIndex,
  subAgendaIndex,
}) => {
  const { t } = useTranslation();
  //Timepicker
  let currentLanguage = localStorage.getItem("i18nextLng");
  const { editorRole } = useMeetingContext();

  const ResponseMessage = useSelector(
    (state) => state.MeetingAgendaReducer.ResponseMessage
  );
  const printFlag = useSelector(
    (state) => state.MeetingAgendaReducer.PrintAgendaFlag
  );

  const exportFlag = useSelector(
    (state) => state.MeetingAgendaReducer.ExportAgendaFlag
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  let currentUserID = localStorage.getItem("userID");

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const apllyLockOnSubAgenda = (parentIndex, subIndex) => {
    const exists = subLockArry.some((item) => {
      if (item.parentIndex === parentIndex) {
        return item.SubIndexArray.some(
          (subItem) => subItem.subIndex === subIndex
        );
      }
      return false;
    });

    return exists;
  };

  // Initialize the subExpand state based on the number of rows and subAgendas
  useEffect(() => {
    const initialState = rows.map((row) =>
      Array(row.subAgenda.length).fill(false)
    );
    setSubExpand(initialState);
  }, [rows]);

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
        `/#/Diskus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };

  const showMoreFiles = (fileData, name, index, subindex) => {
    setFileDataAgenda(fileData);
    setAgendaName(name);
    setAgendaIndex(index);
    setSubAgendaIndex(subindex);
    setShowMoreFilesView(true);
    console.log(
      "Show More Files",
      fileDataAgenda,
      agendaName,
      agendaIndex,
      subAgendaIndex
    );
  };

  // useEffect(() => {
  //   if (ResponseMessage === t("Vote-casted-successfully")) {
  //     showMessage(
  //       t("Thank-you-for-participanting-in-voting"),
  //       "error",
  //       setOpen
  //     );
  //     dispatch(clearResponseMessage(""));
  //   }
  // }, [ResponseMessage]);

  return (
    <>
      {data.subAgenda.length > 0 &&
        data.subAgenda.map((subAgendaData, subIndex) => {
          const isLastIndex = subIndex === data.subAgenda.length - 1;
          const hasNextViewFalse =
            subIndex < data.subAgenda.length - 1 &&
            subAgendaData.canView === false &&
            data.subAgenda[subIndex + 1].canView === true;
          return (
            <>
              <div
                className={
                  subAgendaData.canView === false &&
                  (editorRole.role === "Agenda Contributor" ||
                    editorRole.role === "Participant")
                    ? "d-none"
                    : ""
                }
              >
                <Droppable
                  key={`sub-agenda-${index}-${subIndex}`}
                  droppableId={`sub-agenda-${index}-${subIndex}`}
                  type="SUB_AGENDA"
                >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Draggable
                        key={subAgendaData.subAgendaID}
                        draggableId={`subAgenda-${subAgendaData.subAgendaID}`}
                        index={subIndex}
                        isDragDisabled={true}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className={styles["Subagenda_Scroller"]}
                              >
                                <section
                                  className={styles["Padding_SubAgenda"]}
                                >
                                  <Row
                                    key={subAgendaData.subAgendaID}
                                    className="mt-3"
                                  >
                                    <Col lg={1} md={1} sm={1}></Col>
                                    <Col
                                      lg={11}
                                      md={11}
                                      sm={11}
                                      className={
                                        apllyLockOnParentAgenda(index) ||
                                        apllyLockOnSubAgenda(index, subIndex)
                                          ? styles["SubajendaBox_Inactive"]
                                          : isLastIndex &&
                                            subAgendaData.length === 1
                                          ? `${styles["SubajendaBox"]} ${styles["borderTopNone"]}`
                                          : styles["SubajendaBox"]
                                      }
                                    >
                                      <Row isDragging={snapshot.isDragging}>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className={styles["SubAgendaSection"]}
                                        >
                                          <Row className="mt-2 mb-2">
                                            <Col
                                              lg={8}
                                              md={8}
                                              sm={12}
                                              className="position-relative p-0"
                                            >
                                              <span className="subAgendaBorderClass"></span>

                                              <span
                                                className={
                                                  styles[
                                                    "SubAgendaTitle_Heading"
                                                  ]
                                                }
                                              >
                                                {index +
                                                  1 +
                                                  "." +
                                                  (subIndex + 1) +
                                                  " " +
                                                  subAgendaData.subTitle}
                                              </span>

                                              <span
                                                className={
                                                  styles[
                                                    "SubAgenda_Description"
                                                  ]
                                                }
                                              >
                                                {subAgendaData.description}
                                              </span>
                                            </Col>
                                            <Col
                                              lg={3}
                                              md={3}
                                              sm={12}
                                              className="p-0"
                                            >
                                              <Row className="m-0">
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className="d-flex align-items-center justify-content-end gap-3 p-0"
                                                >
                                                  <img
                                                    src={`data:image/jpeg;base64,${subAgendaData?.userProfilePicture?.displayProfilePictureName}`}
                                                    className={styles["Image"]}
                                                    alt=""
                                                    draggable={false}
                                                  />
                                                  <p
                                                    className={
                                                      styles["agendaCreater"]
                                                    }
                                                  >
                                                    {
                                                      subAgendaData?.presenterName
                                                    }
                                                  </p>
                                                </Col>
                                              </Row>
                                              <Row className="m-0">
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className={
                                                    currentLanguage === "ar"
                                                      ? "p-0 text-start"
                                                      : "p-0 text-end"
                                                  }
                                                >
                                                  {/* <p
                                                    className={`${styles["agendaCreaterTime"]} MontserratMedium-500`}
                                                  >
                                                    {moment(
                                                      timeFormatFunction(
                                                        subAgendaData?.startDate
                                                      )
                                                    ).format("hh:mm a")}
                                                    <span
                                                      className={
                                                        styles["dashMinute"]
                                                      }
                                                    >
                                                      -----
                                                    </span>
                                                    {moment(
                                                      timeFormatFunction(
                                                        subAgendaData?.endDate
                                                      )
                                                    ).format("hh:mm a")}
                                                  </p> */}
                                                  {printFlag === true ||
                                                  exportFlag === true ? null : (
                                                    <>
                                                      {Number(
                                                        subAgendaData.agendaVotingID
                                                      ) !== 0 &&
                                                      Number(
                                                        editorRole.status
                                                      ) === 10 &&
                                                      Number(
                                                        subAgendaData.voteOwner
                                                          .userid
                                                      ) ===
                                                        Number(currentUserID) &&
                                                      !subAgendaData.voteOwner
                                                        ?.currentVotingClosed ? (
                                                        <>
                                                          <Button
                                                            text={t(
                                                              "Start-voting"
                                                            )}
                                                            className={
                                                              styles[
                                                                "startVotingButton"
                                                              ]
                                                            }
                                                            onClick={() =>
                                                              startVoting(
                                                                subAgendaData
                                                              )
                                                            }
                                                          />
                                                          <Button
                                                            text={t(
                                                              "View-votes"
                                                            )}
                                                            className={
                                                              styles[
                                                                "ViewVoteButton"
                                                              ]
                                                            }
                                                            onClick={() =>
                                                              EnableViewVoteModal(
                                                                subAgendaData
                                                              )
                                                            }
                                                          />
                                                        </>
                                                      ) : Number(
                                                          subAgendaData.agendaVotingID
                                                        ) !== 0 &&
                                                        Number(
                                                          editorRole.status
                                                        ) === 10 &&
                                                        Number(
                                                          subAgendaData
                                                            .voteOwner.userid
                                                        ) ===
                                                          Number(
                                                            currentUserID
                                                          ) &&
                                                        subAgendaData.voteOwner
                                                          ?.currentVotingClosed ? (
                                                        <>
                                                          <Button
                                                            text={t(
                                                              "End-voting"
                                                            )}
                                                            className={
                                                              styles[
                                                                "startVotingButton"
                                                              ]
                                                            }
                                                            onClick={() =>
                                                              endVoting(
                                                                subAgendaData
                                                              )
                                                            }
                                                          />
                                                          <Button
                                                            text={t(
                                                              "View-votes"
                                                            )}
                                                            className={
                                                              styles[
                                                                "ViewVoteButton"
                                                              ]
                                                            }
                                                            onClick={() =>
                                                              EnableViewVoteModal(
                                                                subAgendaData
                                                              )
                                                            }
                                                          />
                                                        </>
                                                      ) : editorRole.role ===
                                                          "Organizer" &&
                                                        (subAgendaData.voteOwner
                                                          ?.currentVotingClosed ||
                                                          Number(
                                                            subAgendaData.agendaVotingID
                                                          ) !== 0) ? (
                                                        <>
                                                          <Button
                                                            text={t(
                                                              "View-votes"
                                                            )}
                                                            className={
                                                              styles[
                                                                "ViewVoteButton"
                                                              ]
                                                            }
                                                            onClick={() =>
                                                              EnableViewVoteModal(
                                                                subAgendaData
                                                              )
                                                            }
                                                          />
                                                        </>
                                                      ) : null}

                                                      {Number(
                                                        subAgendaData.agendaVotingID
                                                      ) === 0 ? null : Number(
                                                          editorRole.status
                                                        ) === 10 &&
                                                        Number(
                                                          subAgendaData
                                                            .voteOwner.userid
                                                        ) !==
                                                          Number(
                                                            currentUserID
                                                          ) &&
                                                        subAgendaData.voteOwner
                                                          ?.currentVotingClosed &&
                                                        editorRole.role !==
                                                          "Organizer" ? (
                                                        <Button
                                                          text={
                                                            data?.hasAlreadyVoted
                                                              ? t(
                                                                  "View-your-vote"
                                                                )
                                                              : t(
                                                                  "Cast-your-vote"
                                                                )
                                                          }
                                                          className={
                                                            styles[
                                                              "CastYourVoteButton"
                                                            ]
                                                          }
                                                          onClick={() =>
                                                            EnableCastVoteModal(
                                                              subAgendaData
                                                            )
                                                          }
                                                        />
                                                      ) : null}
                                                    </>
                                                  )}
                                                </Col>
                                              </Row>
                                            </Col>
                                            <Col
                                              lg={1}
                                              md={1}
                                              sm={12}
                                              className="p-0"
                                            ></Col>
                                          </Row>
                                          <>
                                            {
                                              subAgendaData.subSelectRadio ===
                                                1 &&
                                              Object.keys(
                                                subAgendaData.subfiles
                                              ).length > 0 ? (
                                                <div
                                                  className={
                                                    styles[
                                                      "filesParentClassSubAgenda"
                                                    ]
                                                  }
                                                >
                                                  {subAgendaData.subfiles
                                                    .slice(0, 3)
                                                    .map(
                                                      (
                                                        filesData,
                                                        fileIndex
                                                      ) => (
                                                        <AttachmentViewer
                                                          handleClickDownload={() =>
                                                            downloadDocument(
                                                              filesData
                                                            )
                                                          }
                                                          data={filesData}
                                                          name={
                                                            filesData?.displayAttachmentName
                                                          }
                                                          id={Number(
                                                            filesData.originalAttachmentName
                                                          )}
                                                          handleEyeIcon={() =>
                                                            pdfData(
                                                              filesData,
                                                              getFileExtension(
                                                                filesData?.displayAttachmentName
                                                              )
                                                            )
                                                          }
                                                        />
                                                      )
                                                    )}
                                                  {subAgendaData.subfiles
                                                    .length > 3 && (
                                                    <Button
                                                      text={t("More")}
                                                      className={
                                                        styles[
                                                          "Show_More_Button"
                                                        ]
                                                      }
                                                      onClick={() =>
                                                        showMoreFiles(
                                                          subAgendaData.subfiles,
                                                          subAgendaData.subTitle,
                                                          index,
                                                          subIndex
                                                        )
                                                      }
                                                    />
                                                  )}
                                                </div>
                                              ) : data.selectedRadio === 1 &&
                                                Object.keys(
                                                  subAgendaData.subfiles
                                                ).length === 0 ? null : null // <span
                                            }

                                            {subAgendaData.subSelectRadio ===
                                              2 && (
                                              <SubUrls
                                                subAgendaData={subAgendaData}
                                                rows={rows}
                                                setRows={setRows}
                                                index={index}
                                                subIndex={subIndex}
                                              />
                                            )}
                                            {subAgendaData.subSelectRadio ===
                                              3 && (
                                              <SubRequestContributor
                                                subAgendaData={subAgendaData}
                                                rows={rows}
                                                setRows={setRows}
                                                index={index}
                                                subIndex={subIndex}
                                              />
                                            )}
                                          </>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </section>
                                <Row className={isLastIndex ? "d-none" : ""}>
                                  <Col lg={1} md={1} sm={12}></Col>
                                  <Col
                                    lg={11}
                                    md={11}
                                    sm={12}
                                    className="position-relative"
                                  >
                                    {hasNextViewFalse ? null : (
                                      <React.Fragment>
                                        <span
                                          className={`separatorSubAgendaWidth ${
                                            isLastIndex
                                              ? "last-width-class"
                                              : ""
                                          }`}
                                        ></span>
                                        <span
                                          className={`separatorSubAgendaHeight ${
                                            isLastIndex
                                              ? "last-height-class"
                                              : ""
                                          }`}
                                        ></span>
                                      </React.Fragment>
                                    )}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </div>
                        )}
                      </Draggable>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </>
          );
        })}
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default SubAgendaMappingDragging;
