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
import { showCancelMeetingMaterial } from "../../../../../store/actions/NewMeetingActions";
import { getMeetingMaterialAPI } from "../../../../../store/actions/NewMeetingActions";
import {
  getFileExtension,
  getIconSource,
} from "../../../../DataRoom/SearchFunctionality/option"; // Remove the getFileExtensionMeeting import

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

  // const materialColoumn = [
  //   {
  //     title: t("Document-name"),
  //     dataIndex: "documentName",
  //     key: "documentName",
  //     width: "250px",
  //     render: (text, data) => {
  //       console.log(data, "dattatatatata");
  //       let ext = data.documentName.split(".").pop();
  //       const pdfData = {
  //         taskId: data.agendaID,
  //         commingFrom: 4,
  //         fileName: data.documentName,
  //         attachmentID: data.agendaID,
  //       };
  //       const pdfDataJson = JSON.stringify(pdfData);
  //       console.log(pdfDataJson, "Pdfjajaaj");
  //       if (ext === "pdf") {
  //         return (
  //           <>
  //             <section
  //               className={styles["docx-name-title"]}
  //               onClick={(e) => viewHandlerOnclick(e, pdfDataJson)}
  //             >
  //               <img
  //                 src={getIconSource(getFileExtension(data.documentName))} // Use ext here
  //                 alt=""
  //                 width={"25px"}
  //                 height={"25px"}
  //                 className="me-2"
  //               />

  //               <abbr title={text}>
  //                 <span
  //                   className={styles["docx-name-title"]}
  //                   onDoubleClick={() => {
  //                     console.log("Check double Click");
  //                   }}
  //                 >
  //                   {text}
  //                 </span>
  //               </abbr>
  //             </section>
  //           </>
  //         );
  //       } else {
  //         return (
  //           <section className={styles["docx-name-title"]}>
  //             <img
  //               src={getIconSource(getFileExtension(data.documentName))} // Use ext here
  //               alt=""
  //               width={"25px"}
  //               height={"25px"}
  //               className="me-2"
  //             />
  //             <abbr title={text}>
  //               <span className={styles["docx-name-title"]}>{text}</span>
  //             </abbr>
  //           </section>
  //         );
  //       }
  //     },
  //   },
  //   {
  //     title: t("Agenda-name"),
  //     dataIndex: "agendaName",
  //     key: "agendaName",
  //     width: "250px",
  //     render: (text) => (
  //       <label className={styles["agenda-name-title"]}>{text}</label>
  //     ),
  //   },
  // ];

  // Modify your materialColoumn definition to handle parent and child agendas
  const materialColoumn = [
    {
      title: t("Document-name"),
      dataIndex: "documentName",
      key: "documentName",
      width: "250px",
      render: (text, data) => {
        const ext = getFileExtension(text);
        const isPdf = ext.toLowerCase() === "pdf"; // Check if the file is a PDF

        const parentPdfData = {
          taskId: data.agendaID,
          commingFrom: 4,
          fileName: text,
          attachmentID: data.agendaID,
        };
        const parentPdfDataJson = JSON.stringify(parentPdfData);

        const childAgendaElements = data.childAgendas
          ? data.childAgendas.map((childAgenda) => {
              const childExt = getFileExtension(childAgenda.originalFileName);
              const isChildPdf = childExt.toLowerCase() === "pdf"; // Check if the child file is a PDF

              const childPdfData = {
                taskId: childAgenda.agendaID,
                commingFrom: 4,
                fileName: childAgenda.originalFileName,
                attachmentID: childAgenda.attachmentID,
              };
              const childPdfDataJson = JSON.stringify(childPdfData);

              return (
                <div key={childAgenda.agendaID}>
                  <section
                    className={styles["docx-name-title"]}
                    onClick={(e) =>
                      isChildPdf
                        ? viewHandlerOnclick(e, childPdfDataJson)
                        : null
                    }
                    onDoubleClick={(e) =>
                      isChildPdf
                        ? viewHandlerOnclick(e, childPdfDataJson)
                        : null
                    }
                  >
                    <img
                      src={getIconSource(childExt)}
                      alt=""
                      width={"25px"}
                      height={"25px"}
                      className="me-2"
                    />
                    <abbr title={childAgenda.originalFileName}>
                      <span className={styles["docx-name-title"]}>
                        {childAgenda.originalFileName}
                      </span>
                    </abbr>
                  </section>
                </div>
              );
            })
          : null;

        return (
          <div>
            <section
              className={styles["docx-name-title"]}
              onClick={(e) =>
                isPdf ? viewHandlerOnclick(e, parentPdfDataJson) : null
              }
              onDoubleClick={(e) =>
                isPdf ? viewHandlerOnclick(e, parentPdfDataJson) : null
              }
            >
              <img
                src={getIconSource(ext)}
                alt=""
                width={"25px"}
                height={"25px"}
                className="me-2"
              />
              <abbr title={text}>
                <span className={styles["docx-name-title"]}>{text}</span>
              </abbr>
            </section>
            {childAgendaElements}
          </div>
        );
      },
    },
    {
      title: t("Agenda-name"),
      dataIndex: "agendaName",
      key: "agendaName",
      width: "250px",
      render: (text, data) => {
        const childAgendas = data.childAgendas || [];
        return (
          <div>
            <label className={styles["agenda-name-title"]}>{text}</label>
            {childAgendas.map((childAgenda) => (
              <div
                key={childAgenda.agendaID}
                className={styles["agenda-name-title"]}
              >
                {childAgenda.agendaName}
              </div>
            ))}
          </div>
        );
      },
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
    setMeetingMaterial(false);
    setMinutes(true);
  };

  const handlePreviousButtonMeetingMaterial = () => {
    setMeetingMaterial(false);
    setAgenda(true);
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
          <Button text={t("Save")} className={styles["Cancel_Classname"]} />
          <Button
            text={t("Previous")}
            className={styles["Cancel_Classname"]}
            onClick={handlePreviousButtonMeetingMaterial}
          />
          <Button
            text={t("Next")}
            className={styles["Save_Classname"]}
            onClick={handleSaveAndNext}
          />
        </Col>
      </Row>
      {NewMeetingreducer.cancelMeetingMaterial && (
        <CancelMeetingMaterial setSceduleMeeting={setSceduleMeeting} />
      )}
      {/* {NewMeetingreducer.Loading ? <Loader /> : null} */}
    </section>
  );
};

export default MeetingMaterial;
