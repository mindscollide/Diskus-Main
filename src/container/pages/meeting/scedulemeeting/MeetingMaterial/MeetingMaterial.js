import React, { useEffect, useState } from "react";
import styles from "./MeetingMaterial.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye } from "react-bootstrap-icons";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Table,
  ResultMessage,
} from "../../../../../components/elements";
import NoMeetingsIcon from "../../../../../assets/images/No-Meetings.png";

import CancelMeetingMaterial from "./CancelMeetingMaterial/CancelMeetingMaterial";
import { useSelector } from "react-redux";
import {
  ShowNextConfirmationModal,
  searchNewUserMeeting,
  showCancelMeetingMaterial,
  showPreviousConfirmationModal,
  meetingDetailsGlobalFlag,
  organizersGlobalFlag,
  agendaContributorsGlobalFlag,
  participantsGlobalFlag,
  agendaGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  actionsGlobalFlag,
  pollsGlobalFlag,
  attendanceGlobalFlag,
  uploadGlobalFlag,
} from "../../../../../store/actions/NewMeetingActions";
import { getMeetingMaterialAPI } from "../../../../../store/actions/NewMeetingActions";
import {
  getFileExtension,
  getIconSource,
} from "../../../../DataRoom/SearchFunctionality/option"; // Remove the getFileExtensionMeeting import
import PreviousModal from "../meetingDetails/PreviousModal/PreviousModal";
import NextModal from "../meetingDetails/NextModal/NextModal";
import { UpdateOrganizersMeeting } from "../../../../../store/actions/MeetingOrganizers_action";
import { DataRoomDownloadFileApiFunc } from "../../../../../store/actions/DataRoom_actions";

const MeetingMaterial = ({
  setSceduleMeeting,
  setMeetingMaterial,
  setMinutes,
  setAgenda,
  currentMeeting,
  setPublishState,
  setAdvanceMeetingModalID,
  setViewFlag,
  setEditFlag,
  setCalendarViewModal,
  editorRole,
  isEditMeeting,
  setactionsPage,
  setDataroomMapFolderId,
  setEdiorRole,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { NewMeetingreducer } = useSelector((state) => state);

  const meetingMaterialData = useSelector(
    (state) => state.NewMeetingreducer.meetingMaterialData
  );
  const isPublishedGlobal = useSelector(
    (state) => state.NewMeetingreducer.meetingMaterialIsPublished
  );
  const Loading = useSelector((state) => state.NewMeetingreducer.Loading);
  const cancelMeetingMaterial = useSelector(
    (state) => state.NewMeetingreducer.cancelMeetingMaterial
  );
  const nextConfirmModal = useSelector(
    (state) => state.NewMeetingreducer.nextConfirmModal
  );
  const ShowPreviousModal = useSelector(
    (state) => state.NewMeetingreducer.ShowPreviousModal
  );

  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let userID = localStorage.getItem("userID");
  const [flag, setFlag] = useState(5);
  const [prevFlag, setprevFlag] = useState(5);
  const [isPublishedState, setIsPublishedState] = useState(false);

  // row state for meeting Material
  const [rows, setRows] = useState([]);

  // Api request on useEffect
  useEffect(() => {
    let meetingMaterialData = {
      MeetingID: Number(currentMeeting),
    };
    dispatch(getMeetingMaterialAPI(navigate, t, meetingMaterialData, rows));
  }, []);
  // handle click open a file in web viewer on new tab
  const handleClickOpenFile = (record) => {
    if (
      (editorRole.role.toLowerCase() === "Organizer".toLowerCase() ||
        editorRole.role.toLowerCase() === "Agenda Contributor".toLowerCase()) &&
      (editorRole.status === "12" ||
        editorRole.status === "11" ||
        editorRole.status === "10" ||
        editorRole.status === "1")
    ) {
      const documentData = {
        taskId: record.agendaID,
        commingFrom: 4,
        fileName: record.displayFileName,
        attachmentID: Number(record.originalFileName),
      };
      const documentDataJson = JSON.stringify(documentData);
      window.open(
        `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(
          documentDataJson
        )}`,
        "_blank",
        "noopener noreferrer"
      );
    } else if (
      editorRole.status === "9" &&
      (editorRole.role === "Agenda Contributor" ||
        editorRole.role === "Organizer")
    ) {
      const documentData = {
        taskId: record.agendaID,
        commingFrom: 4,
        fileName: record.displayFileName,
        attachmentID: Number(record.originalFileName),
        isPermission: 1,
      };
      const documentDataJson = JSON.stringify(documentData);
      window.open(
        `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(
          documentDataJson
        )}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };
  //  handle Click download a file
  const handleClickDownload = (record) => {
    if (
      (editorRole.role.toLowerCase() === "Organizer".toLowerCase() ||
        editorRole.role.toLowerCase() === "Agenda Contributor".toLowerCase()) &&
      (editorRole.status === "12" ||
        editorRole.status === "11" ||
        editorRole.status === "10" ||
        editorRole.status === "1")
    ) {
      let data = {
        FileID: Number(record.originalFileName),
      };
      dispatch(
        DataRoomDownloadFileApiFunc(navigate, data, t, record.displayFileName)
      );
    } else if (
      editorRole.status === "9" &&
      (editorRole.role === "Agenda Contributor" ||
        editorRole.role === "Organizer")
    ) {
      let data = {
        FileID: Number(record.originalFileName),
      };
      dispatch(
        DataRoomDownloadFileApiFunc(navigate, data, t, record.displayFileName)
      );
    }
  };

  const handleDoubeClick = (record) => {
    const ext = getFileExtension(record.displayFileName);

    if (
      (editorRole.role.toLowerCase() === "Organizer".toLowerCase() ||
        editorRole.role.toLowerCase() === "Agenda Contributor".toLowerCase()) &&
      (editorRole.status === "12" ||
        editorRole.status === "11" ||
        editorRole.status === "10" ||
        editorRole.status === "1")
    ) {
      // if meeting active , proposed, upcoming, unpublished then file should be open with editing rights and download and user should be Agenda Contributor or Organizer
      if (ext === "pdf") {
        const documentData = {
          taskId: record.agendaID,
          commingFrom: 4,
          fileName: record.displayFileName,
          attachmentID: Number(record.originalFileName),
        };
        const documentDataJson = JSON.stringify(documentData);
        window.open(
          `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(
            documentDataJson
          )}`,
          "_blank",
          "noopener noreferrer"
        );
      } else {
        let data = {
          FileID: Number(record.originalFileName),
        };
        dispatch(
          DataRoomDownloadFileApiFunc(navigate, data, t, record.displayFileName)
        );
      }
    } else if (
      editorRole.status === "9" &&
      (editorRole.role === "Agenda Contributor" ||
        editorRole.role === "Organizer")
    ) {
      // if meeting has ended and user is Agenda Contribuor or Organizer then user just can view a document
      if (ext === "pdf") {
        const documentData = {
          taskId: record.agendaID,
          commingFrom: 4,
          fileName: record.displayFileName,
          attachmentID: Number(record.originalFileName),
          isPermission: 1,
        };
        const documentDataJson = JSON.stringify(documentData);
        window.open(
          `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(
            documentDataJson
          )}`,
          "_blank",
          "noopener noreferrer"
        );
      } else {
        let data = {
          FileID: Number(record.originalFileName),
        };
        dispatch(
          DataRoomDownloadFileApiFunc(navigate, data, t, record.displayFileName)
        );
      }
    }
    // if (ext.toLowerCase().includes("pdf")) {
    //   const documentData = {
    //     taskId: record.agendaID,
    //     commingFrom: 4,
    //     fileName: record.displayFileName,
    //     attachmentID: Number(record.originalFileName),
    //   };
    //   const documentDataJson = JSON.stringify(documentData);
    //   window.open(
    //     `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(
    //       documentDataJson
    //     )}`,
    //     "_blank",
    //     "noopener noreferrer"
    //   );
    // } else {
    //   let data = {
    //     FileID: Number(record.originalFileName),
    //   };
    //   dispatch(
    //     DataRoomDownloadFileApiFunc(navigate, data, t, record.displayFileName)
    //   );
    // }
  };
  // Modify your materialColoumn definition to handle parent and child agendas
  const materialColoumn = [
    {
      title: "Document Name",
      dataIndex: "displayFileName",
      key: "displayFileName",
      width: "300px",
      render: (text, record) => {
        return (
          <div>
            <section
              className={styles["docx-name-title"]}
              onClick={() => handleDoubeClick(record)}
            >
              <img
                src={getIconSource(getFileExtension(record.displayFileName))}
                alt=""
                width={"25px"}
                height={"25px"}
                className="me-2"
              />
              <abbr title={`${text} - ${record.agendaID}`}>
                <span className={styles["docx-name-title"]}>
                  {text} - {record.agendaID}
                </span>
              </abbr>
            </section>
          </div>
        );
      },
    },
    {
      title: "Agenda Name",
      dataIndex: "agendaName",
      key: "agendaName",
      align: "center",
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      align: "center",
      render: (text, record) => {
        const ext = getFileExtension(record.displayFileName);
        return (
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex gap-3 align-items-center justify-content-center"
              >
                <Eye
                  fontSize={22}
                  cursor={
                    ext === "pdf" ||
                    ext === "doc" ||
                    ext === "docx" ||
                    ext === "xls" ||
                    ext === "xlsx" ||
                    ext === "rtf"
                      ? "pointer"
                      : "default"
                  }
                  pointerEvents={
                    ext === "pdf" ||
                    ext === "doc" ||
                    ext === "docx" ||
                    ext === "xls" ||
                    ext === "xlsx" ||
                    ext === "rtf"
                      ? "auto"
                      : "none"
                  }
                  onClick={() => handleClickOpenFile(record)}
                />
                <Button
                  // disableBtn={ext !== "pdf" ? false : true}
                  text={t("Download")}
                  className={styles["downloadButton"]}
                  onClick={() => handleClickDownload(record)}
                />
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  // To render data in table
  useEffect(() => {
    if (
      meetingMaterialData !== null &&
      meetingMaterialData !== undefined &&
      meetingMaterialData.length > 0
    ) {
      setRows(meetingMaterialData);
    } else {
      setRows([]);
    }
    setIsPublishedState(isPublishedGlobal);
  }, [meetingMaterialData, isPublishedGlobal]);

  console.log("isPublishedGlobalisPublishedGlobal", isPublishedGlobal);

  console.log("NewMeetingreducerNewMeetingreducer", NewMeetingreducer);

  const handleCancelButton = async () => {
    // dispatch(showCancelMeetingMaterial(true));
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
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
    setSceduleMeeting(false);
  };

  const handleSaveAndNext = () => {
    // dispatch(ShowNextConfirmationModal(true));
    // if (
    //   Number(editorRole.status) === 10 &&
    //   editorRole.role === "Agenda Contributor"
    // ) {
    //   setactionsPage(true);
    //   setMeetingMaterial(false);
    // } else {
    //   setMeetingMaterial(false);
    //   setMinutes(true);
    // }
    setMeetingMaterial(false);
    setMinutes(true);
    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(false));
    dispatch(participantsGlobalFlag(false));
    dispatch(agendaGlobalFlag(false));
    dispatch(meetingMaterialGlobalFlag(false));
    dispatch(minutesGlobalFlag(true));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(false));
    dispatch(pollsGlobalFlag(false));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
  };
  const handlePublish = () => {
    let Data = { MeetingID: currentMeeting, StatusID: 1 };
    dispatch(
      UpdateOrganizersMeeting(
        navigate,
        t,
        5,
        Data,
        setEdiorRole,
        setAdvanceMeetingModalID,
        setDataroomMapFolderId,
        setSceduleMeeting,
        setPublishState,
        setCalendarViewModal
      )
    );
  };
  const handlePreviousButtonMeetingMaterial = () => {
    // dispatch(showPreviousConfirmationModal(true));
    setAgenda(true);
    setMeetingMaterial(false);
  };

  return (
    <section>
      <Row className="mt-5">
        <Col lg={12} md={12} sm={12}>
          {rows.length === 0 && !Loading ? (
            <>
              <ResultMessage
                icon={
                  <img
                    alt="NonMeeting"
                    draggable="false"
                    src={NoMeetingsIcon}
                    // className="nodata-table-icon"
                  />
                }
              />
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <span className={styles["No-meeting-material-title"]}>
                    {t("No-Meeting-Material")}
                  </span>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Table
                column={materialColoumn}
                scroll={{ y: "46vh" }}
                pagination={false}
                className="Polling_table"
                rows={rows}
              />
            </>
          )}
        </Col>
      </Row>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2 mt-3"
        >
          {/* <Button
            text={t("Clone-meeting")}
            className={styles["Cancel_Classname"]}
          /> */}
          <Button
            text={t("Cancel")}
            className={styles["Cancel_Classname"]}
            onClick={handleCancelButton}
          />
          {/* <Button text={t("Save")} className={styles["Cancel_Classname"]} /> */}
          {/* <Button
            text={t("Previous")}
            className={styles["Save_Classname"]}
            onClick={handlePreviousButtonMeetingMaterial}
          /> */}
          <Button
            text={t("Next")}
            className={styles["Save_Classname"]}
            onClick={handleSaveAndNext}
            disableBtn={Number(editorRole.status) === 10 ? false : true}
          />
          {/* <Button
            text={t("Save")}
            className={styles["Save_Classname"]}
            onClick={handleSaveAndNext}
          /> */}
          {Number(editorRole.status) === 11 ||
          Number(editorRole.status) === 12 ? (
            <Button
              disableBtn={
                Number(currentMeeting) === 0 || isPublishedState === false
                  ? true
                  : false
              }
              text={t("Publish")}
              className={styles["Save_Classname"]}
              onClick={handlePublish}
            />
          ) : isEditMeeting === true ? null : (
            <Button
              disableBtn={
                Number(currentMeeting) === 0 || isPublishedState === false
                  ? true
                  : false
              }
              text={t("Publish")}
              className={styles["Save_Classname"]}
              onClick={handlePublish}
            />
          )}
          {/* {Number(editorRole.status) === 11 ||
          Number(editorRole.status) === 12 ? (
            <Button
              text={t("Publish")}
              className={styles["Save_Classname"]}
              onClick={handlePublish}
            />
          ) : null} */}
        </Col>
      </Row>
      {cancelMeetingMaterial && (
        <CancelMeetingMaterial setSceduleMeeting={setSceduleMeeting} />
      )}

      {nextConfirmModal && (
        <NextModal
          setMinutes={setMinutes}
          setMeetingMaterial={setMeetingMaterial}
          flag={flag}
        />
      )}

      {ShowPreviousModal && (
        <PreviousModal
          setAgenda={setAgenda}
          setMeetingMaterial={setMeetingMaterial}
          prevFlag={prevFlag}
        />
      )}
    </section>
  );
};

export default MeetingMaterial;
