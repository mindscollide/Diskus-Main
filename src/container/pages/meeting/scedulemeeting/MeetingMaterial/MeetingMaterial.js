import React, { useEffect, useState } from "react";
import styles from "./MeetingMaterial.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
} from "../../../../../store/actions/NewMeetingActions";
import { getMeetingMaterialAPI } from "../../../../../store/actions/NewMeetingActions";
import {
  getFileExtension,
  getIconSource,
} from "../../../../DataRoom/SearchFunctionality/option"; // Remove the getFileExtensionMeeting import
import PreviousModal from "../meetingDetails/PreviousModal/PreviousModal";
import NextModal from "../meetingDetails/NextModal/NextModal";
import { UpdateOrganizersMeeting } from "../../../../../store/actions/MeetingOrganizers_action";

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
  setDataroomMapFolderId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const meetingMaterialData = useSelector(
    (state) => state.NewMeetingreducer.meetingMaterialData
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
  const [clicks, setClicks] = useState(0);
  const [flag, setFlag] = useState(5);
  const [prevFlag, setprevFlag] = useState(5);
  const [dataCheck, setDataCheck] = useState([]);

  // row state for meeting Material
  const [rows, setRows] = useState([]);

  // Api request on useEffect
  useEffect(() => {
    let meetingMaterialData = {
      MeetingID: Number(currentMeeting),
    };
    dispatch(getMeetingMaterialAPI(navigate, t, meetingMaterialData, rows));
  }, []);

  //onClick of handlerFor View PDF
  const viewHandlerOnclick = (e, data) => {
    e.preventDefault();
    if (clicks === 1) {
      if (dataCheck === data) {
        // Perform the action you want to happen on the double-click here
        window.open(
          `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(data)}`,
          "_blank",
          "noopener noreferrer"
        );
      } else {
        setDataCheck(data);
      }
      // Reset the click count
      setClicks(0);
    } else {
      // Increment the click count
      setClicks(clicks + 1);
      setDataCheck(data);
      // You can add a delay here to reset the click count after a certain time if needed
      setTimeout(() => {
        setClicks(0);
        setDataCheck([]);
      }, 300); // Reset after 300 milliseconds (adjust as needed)
    }
  };

  // Modify your materialColoumn definition to handle parent and child agendas
  const materialColoumn = [
    {
      title: "Document Name",
      dataIndex: "displayFileName",
      key: "displayFileName",
      width: "250px",
      render: (text, record) => {
        const ext = getFileExtension(text);
        const isPdf = ext.toLowerCase() === "pdf"; // Check if the file is a PDF

        const documentData = {
          taskId: record.agendaID,
          commingFrom: 4,
          fileName: text,
          attachmentID: record.attachmentID,
        };
        const documentDataJson = JSON.stringify(documentData);

        return (
          <div>
            <section
              className={styles["docx-name-title"]}
              onClick={(e) =>
                isPdf ? viewHandlerOnclick(e, documentDataJson) : null
              }
              onDoubleClick={(e) =>
                isPdf ? viewHandlerOnclick(e, documentDataJson) : null
              }
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
      width: "250px",
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
  }, [meetingMaterialData]);

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
    setMeetingMaterial(false);
    setMinutes(true);
  };
  const handlePublish = () => {
    let Data = { MeetingID: currentMeeting, StatusID: 1 };
    dispatch(
      UpdateOrganizersMeeting(
        navigate,
        Data,
        t,
        5,
        setPublishState,
        setAdvanceMeetingModalID,
        setViewFlag,
        setEditFlag,
        setCalendarViewModal,
        setSceduleMeeting
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
          <Button
            text={t("Previous")}
            className={styles["Cancel_Classname"]}
            onClick={handlePreviousButtonMeetingMaterial}
          />
          <Button
            text={t("Next")}
            className={styles["Cancel_Classname"]}
            onClick={handleSaveAndNext}
            disableBtn={Number(editorRole.status) === 10 ? false : true}
          />
          <Button
            text={t("Save")}
            className={styles["Cancel_Classname"]}
            onClick={handleSaveAndNext}
          />
          {Number(editorRole.status) === 11 ||
          Number(editorRole.status) === 12 ? (
            <Button
              disableBtn={Number(currentMeeting) === 0 ? true : false}
              text={t("Publish")}
              className={styles["Save_Classname"]}
              onClick={handlePublish}
            />
          ) : isEditMeeting === true ? null : (
            <Button
              disableBtn={Number(currentMeeting) === 0 ? true : false}
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
