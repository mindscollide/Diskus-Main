import React, { useEffect, useState } from "react";
import styles from "./MeetingMaterial.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import backDownArrow from "../../../../../assets/images/downDirect.png";
import upArrow from "../../../../../assets/images/UpperArrow.svg";
import PDFIcon from "../../../../../assets/images/pdf_icon.svg";
import { Button, Table, Loader } from "../../../../../components/elements";
import CancelMeetingMaterial from "./CancelMeetingMaterial/CancelMeetingMaterial";
import { useSelector } from "react-redux";
import {
  showCancelMeetingMaterial,
  searchNewUserMeeting,
  getMeetingMaterialAPI,
} from "../../../../../store/actions/NewMeetingActions";
import {
  getFileExtension,
  getIconSource,
} from "../../../../DataRoom/SearchFunctionality/option"; // Remove the getFileExtensionMeeting import

const MeetingMaterial = ({
  setViewAdvanceMeetingModal,
  advanceMeetingModalID,
  setAdvanceMeetingModalID,
  setMeetingMaterial,
  setAgenda,
  setMinutes,
  ediorRole,
  setEdiorRole,
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

  const [clicks, setClicks] = useState(0);
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
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    setViewAdvanceMeetingModal(false);
    setMeetingMaterial(false);
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

  // Api request on useEffect
  useEffect(() => {
    let meetingMaterialData = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(getMeetingMaterialAPI(navigate, t, meetingMaterialData, rows));
  }, []);

  const handleCancelButton = () => {
    dispatch(showCancelMeetingMaterial(true));
  };
  const handleClickSave = () => {
    setMeetingMaterial(false);

    setMinutes(true);
  };

  const prevHandlerClick = () => {
    setMeetingMaterial(false);
    setAgenda(true);
  };

  const handleSaveAndNext = () => {
    setMeetingMaterial(false);
    setMinutes(true);
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
            text={t("Previous")}
            className={styles["Save_Classname"]}
            onClick={prevHandlerClick}
          />
          <Button
            text={t("Next")}
            onClick={handleClickSave}
            className={styles["Save_Classname"]}
            disableBtn={
              Number(ediorRole.status) === 11 ||
              Number(ediorRole.status) === 12 ||
              Number(ediorRole.status) === 1
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

export default MeetingMaterial;
