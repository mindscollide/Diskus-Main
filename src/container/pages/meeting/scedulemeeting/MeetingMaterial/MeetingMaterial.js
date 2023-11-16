import React, { useEffect, useState } from "react";
import styles from "./MeetingMaterial.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import backDownArrow from "../../../../../assets/images/downDirect.png";
import upArrow from "../../../../../assets/images/UpperArrow.svg";
import PDFIcon from "../../../../../assets/images/pdf_icon.svg";
import {
  Button,
  Table,
  Loader,
  ResultMessage,
} from "../../../../../components/elements";
import NoMeetingsIcon from "../../../../../assets/images/No-Meetings.png";

import CancelMeetingMaterial from "./CancelMeetingMaterial/CancelMeetingMaterial";
import { useSelector } from "react-redux";
import {
  ShowNextConfirmationModal,
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

const MeetingMaterial = ({
  setSceduleMeeting,
  setMeetingMaterial,
  setMinutes,
  setAgenda,
  currentMeeting,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  console.log(NewMeetingreducer, "parentAgendasparentAgendas");

  const [clicks, setClicks] = useState(0);
  const [flag, setFlag] = useState(5);
  const [prevFlag, setprevFlag] = useState(5);
  const [dataCheck, setDataCheck] = useState([]);

  // row state for meeting Material
  const [rows, setRows] = useState([]);

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
                src={getIconSource(ext)}
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
      NewMeetingreducer.meetingMaterial !== null &&
      NewMeetingreducer.meetingMaterial !== undefined &&
      NewMeetingreducer.meetingMaterial.length > 0
    ) {
      setRows(NewMeetingreducer.meetingMaterial);
    } else {
      setRows([]);
    }
  }, [NewMeetingreducer.meetingMaterial]);

  // Api request on useEffect
  useEffect(() => {
    let meetingMaterialData = {
      MeetingID: Number(currentMeeting),
    };
    dispatch(getMeetingMaterialAPI(navigate, t, meetingMaterialData, rows));
  }, []);

  const handleCancelButton = () => {
    dispatch(showCancelMeetingMaterial(true));
  };

  const handleSaveAndNext = () => {
    // dispatch(ShowNextConfirmationModal(true));
    setMeetingMaterial(false);
    setMinutes(true);
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
          {rows.length === 0 && !NewMeetingreducer.Loading ? (
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
          {/* <Button
            text={t("Cancel")}
            className={styles["Cancel_Classname"]}
            onClick={handleCancelButton}
          /> */}
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
          />
        </Col>
      </Row>
      {NewMeetingreducer.cancelMeetingMaterial && (
        <CancelMeetingMaterial setSceduleMeeting={setSceduleMeeting} />
      )}

      {NewMeetingreducer.nextConfirmModal && (
        <NextModal
          setMinutes={setMinutes}
          setMeetingMaterial={setMeetingMaterial}
          flag={flag}
        />
      )}

      {NewMeetingreducer.ShowPreviousModal && (
        <PreviousModal
          setAgenda={setAgenda}
          setMeetingMaterial={setMeetingMaterial}
          prevFlag={prevFlag}
        />
      )}
      {/* {NewMeetingreducer.Loading ? <Loader /> : null} */}
    </section>
  );
};

export default MeetingMaterial;
