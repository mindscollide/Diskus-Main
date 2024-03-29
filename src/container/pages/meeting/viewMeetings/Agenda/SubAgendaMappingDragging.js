import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import { Button, Notification } from "../../../../../components/elements";
import styles from "./Agenda.module.css";
import profile from "../../../../../assets/images/newprofile.png";
import pdfIcon from "../../../../../assets/images/pdf_icon.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
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
import { useDispatch } from "react-redux";
import { Radio } from "antd";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { Upload } from "antd";
import SubUrls from "./SubUrls";
import SubRequestContributor from "./SubRequestContributor";
import dropmdownblack from "../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../assets/images/whiteupper.png";
import { useEffect } from "react";
import {
  getFileExtension,
  getIconSource,
} from "../../../../DataRoom/SearchFunctionality/option";
import { DataRoomDownloadFileApiFunc } from "../../../../../store/actions/DataRoom_actions";
import { timeFormatFunction } from "../../../../../commen/functions/date_formater";

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
  setSubLockArray,
  agendaItemRemovedIndex,
  setAgendaItemRemovedIndex,
  setSubajendaRemoval,
  setsubexpandIndex,
  setExpandSubIndex,
  setSubExpand,
  openAdvancePermissionModal,
  openVoteMOdal,
  editorRole,
  advanceMeetingModalID,
}) => {
  const { t } = useTranslation();
  //Timepicker
  let currentLanguage = localStorage.getItem("i18nextLng");

  const { MeetingAgendaReducer } = useSelector((state) => state);

  const navigate = useNavigate();
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const dispatch = useDispatch();
  const { Dragger } = Upload;
  let currentUserID = localStorage.getItem("userID");

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  //Function For Dragging the SubAgendaItems
  const onSubAgendaDragEnd = (result, index) => {
    console.log(result, index, "resultresultresult");
    if (!result.destination) return; // Dropped outside the list

    const { source, destination } = result;

    // Clone the entire rows array
    const updatedRows = [...rows];

    // Find the source and destination indices
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    // Get the dragged item
    const draggedItem = updatedRows[index].subAgenda[sourceIndex];
    // Remove the item from the source index
    updatedRows[index].subAgenda.splice(sourceIndex, 1);

    // Insert the item at the correct destination index
    updatedRows[index].subAgenda.splice(destinationIndex, 0, draggedItem);

    // Update state with the reordered data
    setRows(updatedRows);
  };

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

  // Function to handle changes in sub-agenda title
  const handleSubAgendaTitleChange = (index, subIndex, e) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedRows = [...rows];
    if (name === "SubTitle") {
      updatedRows[index].subAgenda[subIndex].SubTitle = value;
    }
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda select
  const handleSubAgendaSelectChange = (index, subIndex, value) => {
    const updatedRows = [...rows];
    let SelectValue = {
      value: value.value,
      label: value.label,
    };
    updatedRows[index].subAgenda[subIndex].selectedOption = SelectValue;
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda start date
  const handleSubAgendaStartDateChange = (index, subIndex, date) => {
    const updatedRows = [...rows];
    updatedRows[index].subAgenda[subIndex].startDate = date;
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda end date
  const handleSubAgendaEndDateChange = (index, subIndex, date) => {
    const updatedRows = [...rows];
    updatedRows[index].subAgenda[subIndex].endDate = date;
    setRows(updatedRows);
  };

  //Function For removing Subagendas
  const handleCrossSubAjenda = (index, subIndex) => {
    // dispatch(showAgenItemsRemovedModal(true));
    setAgendaItemRemovedIndex(index);
    setSubajendaRemoval(subIndex);
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

  // Function to handle changes in sub-agenda radio group
  const handleSubAgendaRadioChange = (index, subIndex, e) => {
    let value = e.target.value;
    const updatedRows = [...rows];
    updatedRows[index].subAgenda[subIndex].subSelectRadio = value;
    setRows(updatedRows);
  };

  const lockFunctionActiveSubMenus = (index, subindex) => {
    let cloneSubLockArry = [...subLockArry];

    const parentIndexExists = cloneSubLockArry.findIndex(
      (item) => item.parentIndex === index
    );

    if (parentIndexExists >= 0) {
      const existingParentIndexObj = cloneSubLockArry[parentIndexExists];

      const subIndexExists = existingParentIndexObj.SubIndexArray.findIndex(
        (item) => item.subIndex === subindex
      );

      if (subIndexExists >= 0) {
        existingParentIndexObj.SubIndexArray.splice(subIndexExists, 1);

        // If SubIndexArray is empty, remove the entire parent index object
        if (existingParentIndexObj.SubIndexArray.length === 0) {
          cloneSubLockArry.splice(parentIndexExists, 1);
        }
      } else {
        existingParentIndexObj.SubIndexArray.push({ subIndex: subindex });
      }
    } else {
      let newData = {
        parentIndex: index,
        SubIndexArray: [{ subIndex: subindex }],
      };
      cloneSubLockArry.push(newData);
    }

    setSubLockArray(cloneSubLockArry);
  };

  useEffect(() => {
    if (currentLanguage !== undefined) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);

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

  useEffect(() => {
    if (MeetingAgendaReducer.ResponseMessage === "Vote-casted-successfully") {
      setTimeout(
        setOpen({
          open: true,
          message: t("Thank-you-for-participanting-in-voting"),
        }),
        3000
      );
      dispatch(clearResponseMessage(""));
    }
  }, [MeetingAgendaReducer.ResponseMessage]);

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
                                                <Button
                                                  text={t("Start-voting")}
                                                  className={
                                                    styles["startVotingButton"]
                                                  }
                                                  onClick={() =>
                                                    startVoting(subAgendaData)
                                                  }
                                                />
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
                                                subAgendaData.voteOwner
                                                  ?.currentVotingClosed ? (
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
                                                      <p
                                                        className={
                                                          styles[
                                                            "agendaCreater"
                                                          ]
                                                        }
                                                      >
                                                        {/* {
                                                          subAgendaData?.presenterName
                                                        } */}
                                                        {
                                                          subAgendaData?.presenterName +
                                                            " - (" +
                                                            moment(
                                                              timeFormatFunction(
                                                                data.startDate
                                                              )
                                                            ).format(
                                                              "hh:mm a"
                                                            ) +
                                                            " - " +
                                                            moment(
                                                              timeFormatFunction(
                                                                data.endDate
                                                              )
                                                            ).format("hh:mm a")+")"
                                                          // moment(
                                                          //   subAgendaData?.endDate,
                                                          //   "HHmmss"
                                                          // ).format("hh:mm a") +
                                                        }
                                                      </p>
                                                      {/* <span
                                                      className={
                                                        styles[
                                                          "agendaCreationTime"
                                                        ]
                                                      }
                                                    >
                                                      {
                                                        subAgendaData?.presenterName
                                                      }
                                                    </span> */}
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
                                                {/* <Row className="mt-3">
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles["Agenda_Heading"]
                                                    }
                                                  >
                                                    {t("Attachments")}
                                                  </span>
                                                </Col>
                                              </Row> */}
                                                <Row className="mt-3">
                                                  <Col lg={6} md={6} sm={6}>
                                                    {/* <Radio.Group
                                                    value={
                                                      subAgendaData.subSelectRadio
                                                    }
                                                    onChange={(e) =>
                                                      handleSubAgendaRadioChange(
                                                        index,
                                                        subIndex,
                                                        e
                                                      )
                                                    }
                                                  >
                                                    <Radio value={1}>
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t("Document")}
                                                      </span>
                                                    </Radio>
                                                    <Radio value={2}>
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t("URL")}
                                                      </span>
                                                    </Radio>
                                                    <Radio value={3}>
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t(
                                                          "Request from contributor"
                                                        )}
                                                      </span>
                                                    </Radio>
                                                  </Radio.Group> */}
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
                                                    >
                                                      {subAgendaData.subSelectRadio ===
                                                        1 &&
                                                      Object.keys(
                                                        subAgendaData.subfiles
                                                      ).length > 0 ? (
                                                        <>
                                                          <Row>
                                                            {subAgendaData.subfiles.map(
                                                              (
                                                                filesData,
                                                                fileIndex
                                                              ) => (
                                                                <Col
                                                                  key={
                                                                    fileIndex
                                                                  }
                                                                  lg={3}
                                                                  md={3}
                                                                  sm={12}
                                                                >
                                                                  <div
                                                                    className={
                                                                      styles[
                                                                        "agendaFileAttachedView"
                                                                      ]
                                                                    }
                                                                  >
                                                                    <span
                                                                      className={
                                                                        styles[
                                                                          "agendaFileSpan"
                                                                        ]
                                                                      }
                                                                    >
                                                                      <img
                                                                        draggable={
                                                                          false
                                                                        }
                                                                        src={getIconSource(
                                                                          getFileExtension(
                                                                            filesData.displayAttachmentName
                                                                          )
                                                                        )}
                                                                        alt=""
                                                                      />{" "}
                                                                      <span
                                                                        onClick={() =>
                                                                          downloadDocument(
                                                                            filesData
                                                                          )
                                                                        }
                                                                      >
                                                                        {
                                                                          filesData?.displayAttachmentName
                                                                        }
                                                                      </span>
                                                                    </span>
                                                                  </div>
                                                                </Col>
                                                              )
                                                            )}
                                                          </Row>
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
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default SubAgendaMappingDragging;
