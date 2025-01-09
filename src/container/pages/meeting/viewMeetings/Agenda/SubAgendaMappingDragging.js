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
import AttachmentIcon from "../../../../../assets/images/Attachment.svg";
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
import dropmdownblack from "../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../assets/images/whiteupper.png";
import { useEffect } from "react";
import { DataRoomDownloadFileApiFunc } from "../../../../../store/actions/DataRoom_actions";
import { timeFormatFunction } from "../../../../../commen/functions/date_formater";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import { useMeetingContext } from "../../../../../context/MeetingContext";

const SubAgendaMappingDragging = ({
  data,
  index,
  setRows,
  rows,
  subexpandIndex,
  expandSubIndex,
  subExpand,
  apllyLockOnParentAgenda,
  subLockArry,
  setsubexpandIndex,
  setExpandSubIndex,
  setSubExpand,
  advanceMeetingModalID,
}) => {
  const { t } = useTranslation();
  const { editorRole } = useMeetingContext();

  const ResponseMessage = useSelector(
    (state) => state.MeetingAgendaReducer.ResponseMessage
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

  //Function For Handling See More For Subagendas
  const handleSubMenuExpand = (index, subIndex) => {
    // Close all subAgendas in the current row except the one you're expanding
    // const updatedSubExpand = Array(rows[index].subAgenda.length).fill(false);
    // updatedSubExpand[subIndex] = true;

    // setsubexpandIndex(index);
    // setExpandSubIndex(subIndex);
    // setSubExpand(updatedSubExpand);
    // Close all subAgendas in the current row except the one you're expanding
    // If the clicked subAgenda is already open, close it
    const isAlreadyExpanded = subExpand[index][subIndex];

    // Close the clicked subAgenda if it's already expanded
    if (isAlreadyExpanded) {
      setSubExpand((prevSubExpand) => {
        const updatedSubExpand = [...prevSubExpand];
        updatedSubExpand[index][subIndex] = false;
        return updatedSubExpand;
      });
      setsubexpandIndex(-1);
      setExpandSubIndex(-1);
    } else {
      // Close all other subAgendas in the current row except the one you're expanding
      const updatedSubExpand = rows.map((row, i) =>
        i === index ? Array(row.subAgenda.length).fill(false) : subExpand[i]
      );
      updatedSubExpand[index][subIndex] = true;

      setSubExpand(updatedSubExpand);
      setsubexpandIndex(index);
      setExpandSubIndex(subIndex);
    }
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

  // useEffect(() => {
  //   if (ResponseMessage === "Vote-casted-successfully") {
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
                                          : styles["SubajendaBox"]
                                      }
                                    >
                                      <Row isDragging={snapshot.isDragging}>
                                        <Col
                                          lg={1}
                                          md={1}
                                          sm={1}
                                          isDragging={snapshot.isDragging}
                                          {...provided.dragHandleProps}
                                        >
                                          <section
                                            className={styles["backGorund"]}
                                          >
                                            <img
                                              alt=""
                                              width="18.71px"
                                              height="9.36px"
                                              src={
                                                subexpandIndex === index &&
                                                expandSubIndex === subIndex &&
                                                subExpand
                                                  ? blackArrowUpper
                                                  : dropmdownblack
                                              }
                                              className={
                                                subexpandIndex === index &&
                                                expandSubIndex === subIndex &&
                                                subExpand
                                                  ? styles[
                                                      "subAgendaArrowExpand"
                                                    ]
                                                  : styles["SubAgendaArrow"]
                                              }
                                              onClick={() => {
                                                apllyLockOnParentAgenda(
                                                  index
                                                ) ||
                                                  handleSubMenuExpand(
                                                    index,
                                                    subIndex
                                                  );
                                              }}
                                            />
                                          </section>
                                        </Col>
                                        <Col
                                          lg={11}
                                          md={11}
                                          sm={11}
                                          className={styles["SubAgendaSection"]}
                                        >
                                          <Row className="mt-2 mb-2">
                                            <Col lg={6} md={6} sm={12}>
                                              <span
                                                className={
                                                  styles["AgendaTitle_Heading"]
                                                }
                                              >
                                                {subAgendaData.subTitle}
                                              </span>
                                            </Col>
                                            <Col
                                              lg={6}
                                              md={6}
                                              sm={12}
                                              className="text-end"
                                            >
                                              {Number(
                                                subAgendaData.agendaVotingID
                                              ) !== 0 &&
                                              Number(editorRole.status) ===
                                                10 &&
                                              Number(
                                                subAgendaData.voteOwner.userid
                                              ) === Number(currentUserID) &&
                                              !subAgendaData.voteOwner
                                                ?.currentVotingClosed ? (
                                                <>
                                                  <Button
                                                    text={t("Start-voting")}
                                                    className={
                                                      styles[
                                                        "startVotingButton"
                                                      ]
                                                    }
                                                    onClick={() =>
                                                      startVoting(subAgendaData)
                                                    }
                                                  />
                                                  <Button
                                                    text={t("View-votes")}
                                                    className={
                                                      styles["ViewVoteButton"]
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
                                                Number(editorRole.status) ===
                                                  10 &&
                                                Number(
                                                  subAgendaData.voteOwner.userid
                                                ) === Number(currentUserID) &&
                                                subAgendaData.voteOwner
                                                  ?.currentVotingClosed ? (
                                                <>
                                                  <Button
                                                    text={t("End-voting")}
                                                    className={
                                                      styles[
                                                        "startVotingButton"
                                                      ]
                                                    }
                                                    onClick={() =>
                                                      endVoting(subAgendaData)
                                                    }
                                                  />
                                                  <Button
                                                    text={t("View-votes")}
                                                    className={
                                                      styles["ViewVoteButton"]
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
                                                    text={t("View-votes")}
                                                    className={
                                                      styles["ViewVoteButton"]
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
                                                  subAgendaData.voteOwner.userid
                                                ) !== Number(currentUserID) &&
                                                subAgendaData.voteOwner
                                                  ?.currentVotingClosed &&
                                                editorRole.role !==
                                                  "Organizer" ? (
                                                <Button
                                                  text={t("Cast-your-vote")}
                                                  className={
                                                    styles["CastYourVoteButton"]
                                                  }
                                                  onClick={() =>
                                                    EnableCastVoteModal(
                                                      subAgendaData
                                                    )
                                                  }
                                                />
                                              ) : null}
                                            </Col>
                                          </Row>

                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles["Show_More_Styles"]
                                                }
                                                onClick={() =>
                                                  handleSubMenuExpand(
                                                    index,
                                                    subIndex
                                                  )
                                                }
                                              >
                                                {subexpandIndex === index &&
                                                expandSubIndex === subIndex &&
                                                subExpand
                                                  ? t("Hide-details")
                                                  : t("Show-more")}
                                              </span>
                                              {subAgendaData.subfiles.length >
                                              0 ? (
                                                <img
                                                  className={
                                                    styles[
                                                      "AttachmentIconImage"
                                                    ]
                                                  }
                                                  src={AttachmentIcon}
                                                  alt=""
                                                />
                                              ) : null}
                                            </Col>
                                          </Row>
                                          {/* Condition for Subajencda */}
                                          {subexpandIndex === index &&
                                            expandSubIndex === subIndex &&
                                            subExpand && (
                                              <>
                                                <Row className="mt-2">
                                                  <Col lg={12} md={12} sm={12}>
                                                    <div
                                                      className={
                                                        styles[
                                                          "agendaCreationDetail"
                                                        ]
                                                      }
                                                    >
                                                      <img
                                                        src={`data:image/jpeg;base64,${subAgendaData?.userProfilePicture?.displayProfilePictureName}`}
                                                        className={
                                                          styles["Image"]
                                                        }
                                                        alt=""
                                                        draggable={false}
                                                      />
                                                      {/* <p
                                                        className={
                                                          styles[
                                                            "agendaCreater"
                                                          ]
                                                        }
                                                      >
                                                        {subAgendaData?.presenterName +
                                                          " - (" +
                                                          moment(
                                                            timeFormatFunction(
                                                              data.startDate
                                                            )
                                                          ).format("hh:mm a") +
                                                          " - " +
                                                          moment(
                                                            timeFormatFunction(
                                                              data.endDate
                                                            )
                                                          ).format("hh:mm a") +
                                                          ")"}
                                                      </p> */}
                                                    </div>
                                                  </Col>
                                                </Row>
                                                <Row className="mt-2">
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "ParaGraph_SavedMeeting"
                                                        ]
                                                      }
                                                    >
                                                      {
                                                        subAgendaData.description
                                                      }
                                                    </span>
                                                  </Col>
                                                </Row>

                                                <Row className="mt-3">
                                                  <Col lg={6} md={6} sm={6}>
                                                    {subAgendaData.subSelectRadio ===
                                                    1 ? (
                                                      <span
                                                        className={
                                                          styles[
                                                            "Agenda_Heading"
                                                          ]
                                                        }
                                                      >
                                                        {t("Documents")}
                                                      </span>
                                                    ) : subAgendaData.subSelectRadio ===
                                                      2 ? (
                                                      <span
                                                        className={
                                                          styles[
                                                            "Agenda_Heading"
                                                          ]
                                                        }
                                                      >
                                                        {t("URL")}
                                                      </span>
                                                    ) : subAgendaData.subSelectRadio ===
                                                      3 ? (
                                                      <span
                                                        className={
                                                          styles[
                                                            "Agenda_Heading"
                                                          ]
                                                        }
                                                      >
                                                        {t(
                                                          "Request-from-contributor"
                                                        )}
                                                      </span>
                                                    ) : null}
                                                  </Col>
                                                </Row>
                                                <Droppable
                                                  droppableId={`subAgendaID-${subAgendaData.subAgendaID}-parent-${data.ID}-attachments`}
                                                  type="attachment"
                                                >
                                                  {(provided) => (
                                                    <div
                                                      {...provided.droppableProps}
                                                      ref={provided.innerRef}
                                                      className="d-flex flex-wrap gap-2"
                                                    >
                                                      {subAgendaData.subSelectRadio ===
                                                        1 &&
                                                      Object.keys(
                                                        subAgendaData.subfiles
                                                      ).length > 0 ? (
                                                        <>
                                                          {subAgendaData.subfiles.map(
                                                            (
                                                              filesData,
                                                              fileIndex
                                                            ) => (
                                                              <AttachmentViewer
                                                                data={filesData}
                                                                handleClickDownload={() =>
                                                                  downloadDocument(
                                                                    filesData
                                                                  )
                                                                }
                                                                name={
                                                                  filesData.displayAttachmentName
                                                                }
                                                                key={fileIndex}
                                                              />
                                                            )
                                                          )}
                                                        </>
                                                      ) : subAgendaData.subSelectRadio ===
                                                          1 &&
                                                        Object.keys(
                                                          subAgendaData.subfiles
                                                        ).length === 0 ? (
                                                        <span
                                                          className={
                                                            styles[
                                                              "NoFiles_Heading"
                                                            ]
                                                          }
                                                        >
                                                          No Files Attached
                                                        </span>
                                                      ) : null}

                                                      {subAgendaData.subSelectRadio ===
                                                        2 && (
                                                        <SubUrls
                                                          subAgendaData={
                                                            subAgendaData
                                                          }
                                                          rows={rows}
                                                          setRows={setRows}
                                                          index={index}
                                                          subIndex={subIndex}
                                                        />
                                                      )}
                                                      {subAgendaData.subSelectRadio ===
                                                        3 && (
                                                        <SubRequestContributor
                                                          subAgendaData={
                                                            subAgendaData
                                                          }
                                                          rows={rows}
                                                          setRows={setRows}
                                                          index={index}
                                                          subIndex={subIndex}
                                                        />
                                                      )}
                                                    </div>
                                                  )}
                                                </Droppable>
                                              </>
                                            )}
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </section>
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
