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
import DownloadIcon from "./AV-Images/Download-Icon.png";
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
import CollapseIcon from "./AV-Images/Collapse-Icon.png";

const SubAgendaMappingDragging = ({
  data,
  index,
  setRows,
  rows,
  apllyLockOnParentAgenda,
  subLockArry,
  setSubLockArray,
  setSubExpand,
  editorRole,
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

  // Initialize the subExpand state based on the number of rows and subAgendas
  useEffect(() => {
    const initialState = rows.map((row) =>
      Array(row.subAgenda.length).fill(false)
    );
    setSubExpand(initialState);
  }, [rows]);

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
          const isLastIndex = subIndex === data.subAgenda.length - 1;
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
                                          : isLastIndex
                                          ? `${styles["SubajendaBox"]} borderTopNone`
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
                                              {/* <div className={styles["agendaCreationDetail"]}> */}
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
                                                  className="text-end p-0"
                                                >
                                                  <p
                                                    className={`${styles["agendaCreaterTime"]} MontserratMedium-500`}
                                                  >
                                                    {moment(
                                                      subAgendaData?.startDate,
                                                      "HHmmss"
                                                    ).format("hh:mm a")}
                                                    <span
                                                      className={
                                                        styles["dashMinute"]
                                                      }
                                                    >
                                                      -----
                                                    </span>
                                                    {moment(
                                                      subAgendaData?.endDate,
                                                      "HHmmss"
                                                    ).format("hh:mm a")}
                                                  </p>
                                                </Col>
                                              </Row>
                                              {/* </div> */}
                                            </Col>
                                            <Col
                                              lg={1}
                                              md={1}
                                              sm={12}
                                              className="p-0"
                                            ></Col>
                                          </Row>
                                          <>
                                            {subAgendaData.subSelectRadio ===
                                              1 &&
                                            Object.keys(subAgendaData.subfiles)
                                              .length > 0 ? (
                                              <div
                                                className={
                                                  styles["filesParentClass"]
                                                }
                                              >
                                                {subAgendaData.subfiles
                                                  .slice(0, 3)
                                                  .map(
                                                    (filesData, fileIndex) => (
                                                      <div
                                                        key={fileIndex}
                                                        className={
                                                          styles[
                                                            "agendaFileAttachedView"
                                                          ]
                                                        }
                                                      >
                                                        <Row className="m-0 text-center h-100 align-items-center">
                                                          <Col
                                                            lg={10}
                                                            md={10}
                                                            sm={12}
                                                            className={`${styles["borderFileName"]} p-0`}
                                                          >
                                                            <div
                                                              className={
                                                                styles[
                                                                  "fileNameTruncateStyle"
                                                                ]
                                                              }
                                                            >
                                                              <img
                                                                draggable={
                                                                  false
                                                                }
                                                                src={getIconSource(
                                                                  getFileExtension(
                                                                    filesData?.displayAttachmentName
                                                                  )
                                                                )}
                                                                alt=""
                                                              />
                                                              <span
                                                                onClick={() =>
                                                                  downloadDocument(
                                                                    filesData
                                                                  )
                                                                }
                                                                className={
                                                                  styles[
                                                                    "fileNameAttachment"
                                                                  ]
                                                                }
                                                              >
                                                                {
                                                                  filesData?.displayAttachmentName
                                                                }
                                                              </span>
                                                            </div>
                                                          </Col>
                                                          <Col
                                                            lg={2}
                                                            md={2}
                                                            sm={12}
                                                            className="p-0"
                                                          >
                                                            <img
                                                              draggable={false}
                                                              src={DownloadIcon}
                                                              alt=""
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    )
                                                  )}
                                                {subAgendaData.subfiles.length >
                                                  3 && (
                                                  <Button
                                                    text={t("More")}
                                                    className={
                                                      styles["Show_More_Button"]
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
                                              ).length === 0 ? (
                                              <span
                                                className={
                                                  styles["NoFiles_Heading"]
                                                }
                                              >
                                                No Files Attached
                                              </span>
                                            ) : null}
                                            {/* {subAgendaData.subSelectRadio ===
                                              1 &&
                                            Object.keys(subAgendaData.subfiles)
                                              .length > 0 ? (
                                              <>
                                                <div
                                                  className={
                                                    styles[
                                                      "filesSubParentClass"
                                                    ]
                                                  }
                                                >
                                                  {subAgendaData.subfiles.map(
                                                    (filesData, fileIndex) => (
                                                      <div
                                                        key={fileIndex}
                                                        className={
                                                          styles[
                                                            "agendaFileAttachedView"
                                                          ]
                                                        }
                                                      >
                                                        <Row className="m-0 text-center h-100 align-items-center">
                                                          <Col
                                                            lg={10}
                                                            md={10}
                                                            sm={12}
                                                            className={`${styles["borderFileName"]} p-0`}
                                                          >
                                                            <div
                                                              className={
                                                                styles[
                                                                  "fileNameTruncateStyle"
                                                                ]
                                                              }
                                                            >
                                                              <img
                                                                draggable={
                                                                  false
                                                                }
                                                                src={getIconSource(
                                                                  getFileExtension(
                                                                    filesData?.displayAttachmentName
                                                                  )
                                                                )}
                                                                alt=""
                                                              />
                                                              <span
                                                                onClick={() =>
                                                                  downloadDocument(
                                                                    filesData
                                                                  )
                                                                }
                                                                className={
                                                                  styles[
                                                                    "fileNameAttachment"
                                                                  ]
                                                                }
                                                              >
                                                                {
                                                                  filesData?.displayAttachmentName
                                                                }
                                                              </span>
                                                            </div>
                                                          </Col>
                                                          <Col
                                                            lg={2}
                                                            md={2}
                                                            sm={12}
                                                            className="p-0"
                                                          >
                                                            <img
                                                              draggable={false}
                                                              src={DownloadIcon}
                                                              alt=""
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              </>
                                            ) : subAgendaData.subSelectRadio ===
                                                1 &&
                                              Object.keys(
                                                subAgendaData.subfiles
                                              ).length === 0 ? null : null} */}

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
                                    {/* <span className="separatorSubAgendaWidth"></span>
                                    <span className="separatorSubAgendaHeight"></span> */}
                                    <span
                                      className={`separatorSubAgendaWidth ${
                                        isLastIndex ? "last-width-class" : ""
                                      }`}
                                    ></span>
                                    <span
                                      className={`separatorSubAgendaHeight ${
                                        isLastIndex ? "last-height-class" : ""
                                      }`}
                                    ></span>
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
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default SubAgendaMappingDragging;
