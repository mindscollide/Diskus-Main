import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Button, Notification } from "../../../../../components/elements";
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
import {
  getFileExtension,
  getIconSource,
} from "../../../../DataRoom/SearchFunctionality/option";
import { DataRoomDownloadFileApiFunc } from "../../../../../store/actions/DataRoom_actions";
import CollapseIcon from "./AV-Images/Collapse-Icon.png";
import DownloadIcon from "./AV-Images/Download-Icon.png";

const ParentAgenda = ({
  data,
  index,
  rows,
  setRows,
  setMainAgendaRemovalIndex,
  agendaItemRemovedIndex,
  setAgendaItemRemovedIndex,
  setSubajendaRemoval,
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
  console.log(data, "datadatadatadata");
  console.log("EditorRoleEditorRole", editorRole);
  const { t } = useTranslation();
  const navigate = useNavigate();
  let currentLanguage = localStorage.getItem("i18nextLng");
  let currentUserID = localStorage.getItem("userID");

  const { NewMeetingreducer, MeetingAgendaReducer } = useSelector(
    (state) => state
  );

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  const dispatch = useDispatch();
  const [mainLock, setmainLock] = useState([]);
  const [subLockArry, setSubLockArray] = useState([]);
  // const [expandSubIndex, setExpandSubIndex] = useState(-1);
  const [expandIndex, setExpandIndex] = useState(-1);
  // const [subexpandIndex, setsubexpandIndex] = useState(-1);
  const [expand, setExpand] = useState(true);
  const [subExpand, setSubExpand] = useState([]);
  //Timepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);

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

  const showMoreFiles = (fileData, name, index) => {
    setFileDataAgenda(fileData);
    setAgendaName(name);
    setAgendaIndex(index);
    setSubAgendaIndex(-1);
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

  const downloadDocument = (record) => {
    console.log("filesDatafilesData", record);

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

  console.log("NewMeetingreducerNewMeetingreducer", NewMeetingreducer);

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
                      <Col lg={12} md={12} sm={12}>
                        <Row key={index + 2} className="mt-4">
                          <Col lg={8} md={8} sm={12}>
                            <span className={styles["AgendaTitle_Heading"]}>
                              {index + 1 + ". " + data.title}
                            </span>
                            {expandIndex === index && expand ? (
                              <span
                                className={styles["ParaGraph_SavedMeeting"]}
                              >
                                {data.description}
                              </span>
                            ) : null}
                          </Col>
                          <Col lg={3} md={3} sm={12} className="p-0">
                            {/* <div className={styles["agendaCreationDetail"]}> */}
                            <Row className="m-0">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex align-items-center justify-content-end gap-3 p-0"
                              >
                                <img
                                  src={`data:image/jpeg;base64,${data?.userProfilePicture?.displayProfilePictureName}`}
                                  className={styles["Image"]}
                                  alt=""
                                  draggable={false}
                                />
                                <p className={styles["agendaCreater"]}>
                                  {data?.presenterName}
                                </p>
                              </Col>
                            </Row>
                            <Row className="m-0">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="p-0"
                              >
                                <p
                                  className={`${styles["agendaCreaterTime"]} MontserratMedium-500`}
                                >
                                  {moment(data?.startDate, "HHmmss").format(
                                    "hh:mm a"
                                  )}
                                  <span className={styles["dashMinute"]}>
                                    -----
                                  </span>
                                  {moment(data?.endDate, "HHmmss").format(
                                    "hh:mm a"
                                  )}
                                </p>
                              </Col>
                            </Row>
                            {/* </div> */}
                          </Col>
                          <Col lg={1} md={1} sm={12} className="p-0">
                            <img
                              draggable={false}
                              src={CollapseIcon}
                              alt=""
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
                        {expandIndex !== index && expand ? (
                          <>
                            {/* {data.selectedRadio === 1 &&
                            Object.keys(data.files).length > 0 ? (
                              <div className={styles["filesParentClass"]}>
                                {data.files.map((filesData, fileIndex) => (
                                  <div
                                    key={fileIndex}
                                    className={styles["agendaFileAttachedView"]}
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
                                            styles["fileNameTruncateStyle"]
                                          }
                                        >
                                          <img
                                            draggable={false}
                                            src={getIconSource(
                                              getFileExtension(
                                                filesData?.displayAttachmentName
                                              )
                                            )}
                                            alt=""
                                          />
                                          <span
                                            onClick={() =>
                                              downloadDocument(filesData)
                                            }
                                            className={
                                              styles["fileNameAttachment"]
                                            }
                                          >
                                            {filesData?.displayAttachmentName}
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
                                ))}
                              </div>
                            ) : data.selectedRadio === 1 &&
                              Object.keys(data.files).length === 0 ? (
                              <span className={styles["NoFiles_Heading"]}>
                                No Files Attached
                              </span>
                            ) : null} */}

                            {data.selectedRadio === 1 &&
                            Object.keys(data.files).length > 0 ? (
                              <div className={styles["filesParentClass"]}>
                                {data.files
                                  .slice(0, 3)
                                  .map((filesData, fileIndex) => (
                                    <div
                                      key={fileIndex}
                                      className={
                                        styles["agendaFileAttachedView"]
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
                                              styles["fileNameTruncateStyle"]
                                            }
                                          >
                                            <img
                                              draggable={false}
                                              src={getIconSource(
                                                getFileExtension(
                                                  filesData?.displayAttachmentName
                                                )
                                              )}
                                              alt=""
                                            />
                                            <span
                                              onClick={() =>
                                                downloadDocument(filesData)
                                              }
                                              className={
                                                styles["fileNameAttachment"]
                                              }
                                            >
                                              {filesData?.displayAttachmentName}
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
                                  ))}
                                {data.files.length > 3 && (
                                  <Button
                                    text={t("More")}
                                    className={styles["Show_More_Button"]}
                                    onClick={() =>
                                      showMoreFiles(
                                        data.files,
                                        data.title,
                                        index
                                      )
                                    }
                                  />
                                )}
                              </div>
                            ) : data.selectedRadio === 1 &&
                              Object.keys(data.files).length === 0 ? (
                              <span className={styles["NoFiles_Heading"]}>
                                No Files Attached
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
                          </>
                        ) : null}
                        {/* </Droppable> */}
                        {expandIndex === index && expand ? (
                          <>
                            {data.selectedRadio === 1 &&
                            Object.keys(data.files).length > 0 ? (
                              <div className={styles["filesParentClass"]}>
                                {data.files
                                  .slice(0, 3)
                                  .map((filesData, fileIndex) => (
                                    <div
                                      key={fileIndex}
                                      className={
                                        styles["agendaFileAttachedView"]
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
                                              styles["fileNameTruncateStyle"]
                                            }
                                          >
                                            <img
                                              draggable={false}
                                              src={getIconSource(
                                                getFileExtension(
                                                  filesData?.displayAttachmentName
                                                )
                                              )}
                                              alt=""
                                            />
                                            <span
                                              onClick={() =>
                                                downloadDocument(filesData)
                                              }
                                              className={
                                                styles["fileNameAttachment"]
                                              }
                                            >
                                              {filesData?.displayAttachmentName}
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
                                  ))}
                                {data.files.length > 3 && (
                                  <Button
                                    text={t("More")}
                                    className={styles["Show_More_Button"]}
                                    onClick={() =>
                                      showMoreFiles(
                                        data.files,
                                        data.title,
                                        index
                                      )
                                    }
                                  />
                                )}
                              </div>
                            ) : data.selectedRadio === 1 &&
                              Object.keys(data.files).length === 0 ? (
                              <span className={styles["NoFiles_Heading"]}>
                                No Files Attached
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
                            <div className={styles["borderDesigningSubAgenda"]}>
                              <SubAgendaMappingDragging
                                data={data}
                                index={index}
                                setRows={setRows}
                                rows={rows}
                                subExpand={subExpand}
                                apllyLockOnParentAgenda={
                                  apllyLockOnParentAgenda
                                }
                                subLockArry={subLockArry}
                                setSubLockArray={setSubLockArray}
                                agendaItemRemovedIndex={agendaItemRemovedIndex}
                                setAgendaItemRemovedIndex={
                                  setAgendaItemRemovedIndex
                                }
                                setSubajendaRemoval={setSubajendaRemoval}
                                setSubExpand={setSubExpand}
                                openAdvancePermissionModal={
                                  openAdvancePermissionModal
                                }
                                openVoteMOdal={openVoteMOdal}
                                advanceMeetingModalID={advanceMeetingModalID}
                                editorRole={editorRole}
                                setFileDataAgenda={setFileDataAgenda}
                                fileDataAgenda={fileDataAgenda}
                                setAgendaName={setAgendaName}
                                agendaName={agendaName}
                                setAgendaIndex={setAgendaIndex}
                                agendaIndex={agendaIndex}
                                setSubAgendaIndex={setSubAgendaIndex}
                                subAgendaIndex={subAgendaIndex}
                                setShowMoreFilesView={setShowMoreFilesView}
                              />
                            </div>
                          </>
                        ) : null}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </span>
              {/* SubAgenda Mapping */}
              {NewMeetingreducer.viewVotesAgenda && <ViewVoteModal />}
              {NewMeetingreducer.castVoteAgendaPage && <CastVoteAgendaModal />}
              {/* sub Ajenda Button */}
              {/* <Row className="mt-3">
            <Col lg={12} md={12} sm={12}>
              <Button
                text={
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center gap-2 align-items-center"
                      >
                        <img
                          draggable={false}
                          src={plusFaddes}
                          height="10.77px"
                          width="10.77px"
                        />
                        <span className={styles["Add_Agen_Heading"]}>
                          {t("Add-sub-agenda")}
                        </span>
                      </Col>
                    </Row>
                  </>
                }
                className={styles["AddMoreBtnAgenda"]}
                onClick={() => {
                  addSubAjendaRows(index);
                }}
              />
            </Col>
          </Row> */}
            </div>
          )}
        </Draggable>
      </div>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default ParentAgenda;