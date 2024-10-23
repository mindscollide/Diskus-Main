import React, { useEffect, useState } from "react";
import styles from "./MeetingMaterial.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Button, Table } from "../../../../../components/elements";
import CancelMeetingMaterial from "./CancelMeetingMaterial/CancelMeetingMaterial";
import { useSelector } from "react-redux";
import {
  showCancelMeetingMaterial,
  searchNewUserMeeting,
  getMeetingMaterialAPI,
  cleareAllState,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../../store/actions/NewMeetingActions";
import {
  getFileExtension,
  getIconSource,
} from "../../../../DataRoom/SearchFunctionality/option"; // Remove the getFileExtensionMeeting import
import { DataRoomDownloadFileApiFunc } from "../../../../../store/actions/DataRoom_actions";
import { Eye } from "react-bootstrap-icons";

const MeetingMaterialPrev = ({
  setViewAdvanceMeetingModal,
  advanceMeetingModalID,
  setAdvanceMeetingModalID,
  setMeetingMaterial,
  setAgenda,
  setMinutes,
  editorRole,
  setEdiorRole,
  setactionsPage,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const meetingMaterialData = useSelector(
    (state) => state.NewMeetingreducer.meetingMaterialData
  );
  const cancelMeetingMaterial = useSelector(
    (state) => state.NewMeetingreducer.cancelMeetingMaterial
  );
  // For cancel with no modal Open
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");

  // row state for meeting Material
  const [rows, setRows] = useState([]);

  // Api request on useEffect
  useEffect(() => {
    let meetingMaterialData = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(getMeetingMaterialAPI(navigate, t, meetingMaterialData, rows));
    return () => {
      dispatch(cleareAllState());

      setRows([]);
    };
  }, []);

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
    } else if (
      editorRole.role === "Participant" &&
      (editorRole.status === "10" || editorRole.status === "1")
    ) {
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
    } else if (editorRole.role === "Participant" && editorRole.status === "9") {
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
                  cursor={ext === "pdf" ? "pointer" : "default"}
                  pointerEvents={ext === "pdf" ? "auto" : "none"}
                  onClick={() => handleDoubeClick(record)}
                />
                <Button
                  disableBtn={ext !== "pdf" ? false : true}
                  text={t("Download")}
                  className={styles["downloadButton"]}
                  onClick={() => handleDoubeClick(record)}
                />
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

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
        console.log("chek search meeting")
        dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.removeItem("folderDataRoomMeeting");
    setViewAdvanceMeetingModal(false);
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
    setactionsPage(false);
  };

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
  }, [meetingMaterialData]);

  const handleClickSave = () => {
    setMinutes(true);
    setMeetingMaterial(false);
  };

  return (
    <section>
      <Row className="mt-5">
        <Col lg={12} md={12} sm={12}>
          <Table
            column={materialColoumn}
            scroll={{ y: "46vh" }}
            pagination={false}
            className="Polling_table"
            rows={rows}
          />
        </Col>
      </Row>
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
      {cancelMeetingMaterial && (
        <CancelMeetingMaterial
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          setEdiorRole={setEdiorRole}
          setAdvanceMeetingModalID={setAdvanceMeetingModalID}
        />
      )}
    </section>
  );
};

export default MeetingMaterialPrev;
