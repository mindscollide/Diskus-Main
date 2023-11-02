import React, { useState } from "react";
import styles from "./Minutes.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import ReactQuill, { Quill } from "react-quill";
import { useRef } from "react";
import { Upload } from "antd";
import featherupload from "../../../../../assets/images/featherupload.svg";
import Leftploygon from "../../../../../assets/images/Polygon 3.svg";
import file_image from "../../../../../assets/images/file_image.svg";
import pdfIcon from "../../../../../assets/images/pdf_icon.svg";
import CrossIcon from "../../../../../assets/images/CrossIcon.svg";
import Rightploygon from "../../../../../assets/images/Polygon right.svg";
// import DrapDropIcon from "../../../../../assets/images/DrapDropIcon.svg";
// import { message, Upload } from "antd";
// import download from "../../../../../assets/images/UploaderIcon.svg";
// import scratch from "../../../../../assets/images/Scracher.svg";
// import AgendaIcon from "../../../../../assets/images/AgendaFull.svg";
// import EditIcon from "../../../../../assets/images/Edit-Icon.png";
// import ImportMinutesModal from "./ImportPreviousMinutesModal/ImportMinutesModal";
// import {
//   showImportPreviousMinutes,
//   showUnsaveMinutesFileUpload,
// } from "../../../../../store/actions/NewMeetingActions";
// import Clip from "../../../../../assets/images/ClipTurned.svg";
// import profile from "../../../../../assets/images/newprofile.png";
// import RedCroseeIcon from "../../../../../assets/images/CrossIcon.svg";
// import UnsavedMinutes from "./UnsavedFileUploadMinutes/UnsavedMinutes";
// import CreateFromScratch from "./CreateFromScratch/CreateFromScratch";
// import AgendaImport from "./AgendaimportMinutes/AgendaImport";
const Minutes = ({ setMinutes }) => {
  // const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { Dragger } = Upload;
  // const { NewMeetingreducer } = useSelector((state) => state);
  // const [uploadbtn, setUploadbtn] = useState(false);
  // const [createFromScratch, setCreateFromScratch] = useState(false);
  // const [attachments, setAttachments] = useState([]);
  // const [afterSaveFiles, setafterSaveFiles] = useState(false);
  // const [agenda, setAgenda] = useState(false);
  // const [afterSaveDocs, setafterSaveDocs] = useState([
  //   {
  //     name: "teams_Collaboration.PDF",
  //   },
  //   {
  //     name: "teams_Collaboration.PDF",
  //   },
  //   {
  //     name: "teams_Collaboration.PDF",
  //   },
  //   {
  //     name: "teams_Collaboration.PDF",
  //   },
  // ]);
  // const [docsName, setDocsName] = useState([
  //   {
  //     name: "teams_Collaboration.PDF",
  //   },
  //   {
  //     name: "teams_Collaboration.PDF",
  //   },
  //   {
  //     name: "teams_Collaboration.PDF",
  //   },
  //   {
  //     name: "teams_Collaboration.PDF",
  //   },
  // ]);
  // const handleImportPreviousModal = () => {
  //   dispatch(showImportPreviousMinutes(true));
  // };

  // const handleUploadButton = () => {
  //   setUploadbtn(true);
  // };

  // const handleUnsaveFileUploadMinues = () => {
  //   dispatch(showUnsaveMinutesFileUpload(true));
  // };

  // const handleSaveFunctionality = () => {
  //   setUploadbtn(false);
  //   setafterSaveFiles(true);
  // };

  // const props = {
  //   name: "file",
  //   // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  //   multiple: true,
  //   showUploadList: false,
  //   onChange(data) {
  //     const { status } = data.file;
  //     console.log(data.file, " datafiledatafiledatafile");
  //     setAttachments([...attachments, data.file.originFileObj]);
  //   },
  //   onDrop(e) {
  //     console.log("Dropped files", e.dataTransfer.files);
  //   },
  //   customRequest() {},
  // };

  // const handleRemoveFiles = (index) => {
  //   let optionscross = [...attachments];
  //   optionscross.splice(index, 1);
  //   setAttachments(optionscross);
  // };

  // const handleEditButton = () => {
  //   setUploadbtn(true);
  // };

  // const handleCreateFromScratch = () => {
  //   setCreateFromScratch(true);
  // };

  // const handleAgenadFile = () => {
  //   setAgenda(true);
  // };
  const [fileSize, setFileSize] = useState(0);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const editorRef = useRef(null);
  const { Dragger } = Upload;
  const [fileForSend, setFileForSend] = useState([]);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [addNoteFields, setAddNoteFields] = useState({
    Description: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const date = new Date();
  var Size = Quill.import("attributors/style/size");
  Size.whitelist = ["14px", "16px", "18px"];
  Quill.register(Size, true);
  console.log("fileSizefileSize", fileSize);
  var FontAttributor = Quill.import("formats/font");
  var fonts = ["impact", "courier", "comic"];
  FontAttributor.whitelist = fonts;
  Quill.register(FontAttributor, true);

  const modules = {
    toolbar: {
      container: [
        {
          size: ["14px", "16px", "18px"],
        },
        { font: ["impact", "courier", "comic", "Montserrat"] },
        { bold: {} },
        { italic: {} },
        { underline: {} },

        { color: [] },
        { background: [] },
        { align: [] },
        { list: "ordered" },
        { list: "bullet" },
      ],
      handlers: {},
    },
  };

  const enterKeyHandler = (event) => {
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      const quill = editorRef.current.getEditor();
      quill.root.setAttribute("autofocus", "");
      quill.focus();
    }
  };
  const onTextChange = (content, delta, source) => {
    const plainText = content.replace(/(<([^>]+)>)/gi, "");
    if (source === "user" && plainText != "") {
      setAddNoteFields({
        ...addNoteFields,
        Description: {
          value: content,
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else {
      setAddNoteFields({
        ...addNoteFields,
        Description: {
          value: "",
          errorMessage: "",
          errorStatus: true,
        },
      });
    }
  };

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { status } = data.file;
      let fileSizeArr;
      if (fileAttachments.length > 9) {
        setOpen({
          flag: true,
          message: t("Not-allowed-more-than-10-files"),
        });
      } else if (fileAttachments.length > 0) {
        let flag = false;
        let sizezero;
        let size;
        fileAttachments.map((arData, index) => {
          if (arData.DisplayAttachmentName === data.file.originFileObj.name) {
            flag = true;
          }
        });
        if (data.file.size > 10485760) {
          size = false;
        } else if (data.file.size === 0) {
          sizezero = false;
        }
        if (size === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            }),
            3000
          );
        } else if (sizezero === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-zero"),
            }),
            3000
          );
        } else if (flag === true) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-already-exists"),
            }),
            3000
          );
        } else {
          let file = {
            DisplayAttachmentName: data.file.name,
            OriginalAttachmentName: data.file.name,
            fileSize: data.file.originFileObj.size,
          };
          setFileAttachments([...fileAttachments, file]);
          fileSizeArr = data.file.originFileObj.size + fileSize;
          setFileForSend([...fileForSend, data.file.originFileObj]);
          setFileSize(fileSizeArr);
          // dispatch(FileUploadToDo(navigate, data.file.originFileObj, t));
        }
      } else {
        let sizezero;
        let size;
        if (data.file.size > 10485760) {
          size = false;
        } else if (data.file.size === 0) {
          sizezero = false;
        }
        if (size === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            }),
            3000
          );
        } else if (sizezero === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-zero"),
            }),
            3000
          );
        } else {
          let file = {
            DisplayAttachmentName: data.file.name,
            OriginalAttachmentName: data.file.name,
            fileSize: data.file.originFileObj.size,
          };
          setFileAttachments([...fileAttachments, file]);
          fileSizeArr = data.file.originFileObj.size + fileSize;
          setFileForSend([...fileForSend, data.file.originFileObj]);
          setFileSize(fileSizeArr);
        }
      }
    },
    onDrop(e) {},
    customRequest() {},
  };

  //Sliders For Attachments

  const SlideLeft = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft - 300;
  };

  const Slideright = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft + 300;
  };

  const handleRemoveFile = (index) => {
    const updatedFies = [...fileAttachments];
    updatedFies.splice(index, 1);
    setFileAttachments(updatedFies);
  };

  return (
    <section>
      <Row className="mt-4">
        <Col lg={6} md={6} sm={6}>
          <Row className={styles["Add-note-QuillRow"]}>
            <Col
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className={styles["Arabic_font_Applied"]}
            >
              <ReactQuill
                ref={editorRef}
                theme="snow"
                value={addNoteFields.Description.value}
                placeholder={t("Note-details")}
                onChange={onTextChange}
                modules={modules}
                className={styles["quill-height-addNote"]}
                style={{
                  direction: currentLanguage === "ar" ? "rtl" : "ltr",
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={6} sm={6}>
          {fileAttachments.length > 0 ? (
            <>
              <Row className="mt-1">
                <Col lg={1} md={1} sm={1} className="mt-4">
                  {fileAttachments.length > 2 ? (
                    <>
                      <Button
                        icon={
                          <img
                            src={Leftploygon}
                            width="20px"
                            height="15px"
                            draggable="false"
                          />
                        }
                        onClick={SlideLeft}
                        className={styles["Leftpolygon"]}
                      />
                    </>
                  ) : null}
                </Col>
                <Col lg={10} md={10} sm={10}>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="ScrolllerFiles_Committees"
                      id="Slider"
                    >
                      {fileAttachments.length > 0
                        ? fileAttachments.map((data, index) => {
                            console.log(data, "datadatadata");
                            return (
                              <>
                                <Col
                                  lg={4}
                                  md={4}
                                  sm={12}
                                  className="position-relative gap-2"
                                >
                                  <span className={styles["Crossicon_Class"]}>
                                    <img
                                      src={CrossIcon}
                                      height="12.68px"
                                      width="12.68px"
                                      onClick={() => handleRemoveFile(index)}
                                    />
                                  </span>
                                  <section className={styles["Outer_Box"]}>
                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <img
                                          src={file_image}
                                          width={"100%"}
                                          alt=""
                                          draggable="false"
                                        />
                                      </Col>
                                    </Row>

                                    <section
                                      className={styles["backGround_name_Icon"]}
                                    >
                                      <Row className="mb-2">
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className={styles["IconTextClass"]}
                                        >
                                          <img
                                            src={pdfIcon}
                                            height="10px"
                                            width="10px"
                                            className={styles["IconPDF"]}
                                          />
                                          <span className={styles["FileName"]}>
                                            {data.DisplayAttachmentName}
                                          </span>
                                        </Col>
                                      </Row>
                                    </section>
                                  </section>
                                </Col>
                              </>
                            );
                          })
                        : null}
                    </Col>
                  </Row>
                </Col>
                <Col lg={1} md={1} sm={1} className="mt-4">
                  {fileAttachments.length > 2 ? (
                    <>
                      <Button
                        icon={
                          <img
                            src={Rightploygon}
                            width="20px"
                            height="15px"
                            draggable="false"
                          />
                        }
                        onClick={Slideright}
                        className={styles["Leftpolygon"]}
                      />
                    </>
                  ) : null}
                </Col>
              </Row>
            </>
          ) : null}

          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <Dragger
                {...props}
                className={styles["dragdrop_attachment_create_resolution"]}
              >
                <p className="ant-upload-drag-icon">
                  <span className={styles["create_resolution_dragger"]}>
                    <img
                      src={featherupload}
                      width="18.87px"
                      height="18.87px"
                      draggable="false"
                    />
                  </span>
                </p>
                <p className={styles["ant-upload-text"]}>
                  {t("Drag-&-drop-or")}
                  <span className={styles["Choose_file_style"]}>
                    {t("Choose-file")}
                  </span>
                  <span className={styles["here_text"]}>{t("Here")}</span>
                </p>
              </Dragger>
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
    // <section>
    //   {NewMeetingreducer.afterImportState === true ? (
    //     <>
    //       <Row>
    //         <Col lg={12} md={12} sm={12} className={styles["Scroller_Minutes"]}>
    //           <Row className="mt-3 gap-3">
    //             {docsName.length > 0
    //               ? docsName.map((data, index) => {
    //                   return (
    //                     <>
    //                       <Col
    //                         lg={6}
    //                         md={6}
    //                         sm={6}
    //                         className={styles["Box_Minutes"]}
    //                       >
    //                         <Row>
    //                           <Col lg={8} md={8} sm={8}>
    //                             <Row className="mt-3">
    //                               <Col
    //                                 lg={12}
    //                                 md={12}
    //                                 sm={12}
    //                                 className="d-flex align-items-center gap-3"
    //                               >
    //                                 <img draggable={false} src={Clip} />
    //                                 <span className={styles["Title_File"]}>
    //                                   {data.name}
    //                                 </span>
    //                               </Col>
    //                             </Row>
    //                             <Row className="mt-1">
    //                               <Col lg={12} md={12} sm={12}>
    //                                 <span
    //                                   className={
    //                                     styles["Date_Minutes_And_time"]
    //                                   }
    //                                 >
    //                                   4:00pm, 18th May, 2020
    //                                 </span>
    //                               </Col>
    //                             </Row>
    //                           </Col>
    //                           <Col lg={4} md={4} sm={4} className="">
    //                             <Row className="mt-3">
    //                               <Col lg={12} md={12} sm={12}>
    //                                 <span
    //                                   className={styles["Uploaded_heading"]}
    //                                 >
    //                                   {t("Uploaded-by")}
    //                                 </span>
    //                               </Col>
    //                             </Row>
    //                             <Row>
    //                               <Col
    //                                 lg={12}
    //                                 md={12}
    //                                 sm={12}
    //                                 className="d-flex gap-2 align-items-center"
    //                               >
    //                                 <img
    //                                   draggable={false}
    //                                   src={profile}
    //                                   height="27px"
    //                                   width="27px"
    //                                   className={styles["Profile_minutes"]}
    //                                 />
    //                                 <span className={styles["Name"]}>
    //                                   Saaf Fudda
    //                                 </span>
    //                               </Col>
    //                             </Row>
    //                           </Col>
    //                         </Row>
    //                         <img
    //                           draggable={false}
    //                           src={RedCroseeIcon}
    //                           height="20.76px"
    //                           width="20.76px"
    //                           className={styles["RedCrossClass"]}
    //                         />
    //                       </Col>
    //                     </>
    //                   );
    //                 })
    //               : null}
    //           </Row>
    //         </Col>
    //       </Row>
    //     </>
    //   ) : uploadbtn ? (
    //     <>
    //       <Row className="mt-5">
    //         <Col lg={12} md={12} sm={12}>
    //           <Dragger
    //             {...props}
    //             className={styles["dragdrop_attachment_create_resolution"]}
    //           >
    //             <Row>
    //               <Col
    //                 lg={5}
    //                 md={5}
    //                 sm={12}
    //                 className="d-flex justify-content-end align-items-center"
    //               >
    //                 <img
    //                   draggable={false}
    //                   src={DrapDropIcon}
    //                   width={100}
    //                   className={styles["ClassImage"]}
    //                 />
    //               </Col>
    //               <Col lg={7} md={7} sm={12}>
    //                 <Row className="mt-3">
    //                   <Col
    //                     lg={12}
    //                     md={12}
    //                     sm={12}
    //                     className="d-flex justify-content-start"
    //                   >
    //                     <span className={styles["ant-upload-text-Meetings"]}>
    //                       {t("Drop-files-here")}
    //                     </span>
    //                   </Col>
    //                 </Row>
    //                 <Row>
    //                   <Col
    //                     lg={12}
    //                     md={12}
    //                     sm={12}
    //                     className="d-flex justify-content-start"
    //                   >
    //                     <span className={styles["Choose_file_style-Meeting"]}>
    //                       {t("The-following-file-formats-are")}
    //                     </span>
    //                   </Col>
    //                 </Row>
    //                 <Row>
    //                   <Col
    //                     lg={12}
    //                     md={12}
    //                     sm={12}
    //                     className="d-flex justify-content-start"
    //                   >
    //                     <span className={styles["Choose_file_style-Meeting"]}>
    //                       {t("Docx-ppt-pptx-xls-xlsx-jpeg-jpg-and-png")}
    //                     </span>
    //                   </Col>
    //                 </Row>
    //               </Col>
    //             </Row>
    //           </Dragger>
    //         </Col>
    //       </Row>
    //       <Row>
    //         <Col lg={12} md={12} sm={12}>
    //           <Row className={styles["Scroller"]}>
    //             {attachments.length > 0
    //               ? attachments.map((data, index) => {
    //                   return (
    //                     <>
    //                       <Col
    //                         lg={6}
    //                         md={6}
    //                         sm={6}
    //                         className={styles["Box_Minutes"]}
    //                       >
    //                         <Row>
    //                           <Col lg={8} md={8} sm={8}>
    //                             <Row className="mt-3">
    //                               <Col
    //                                 lg={12}
    //                                 md={12}
    //                                 sm={12}
    //                                 className="d-flex align-items-center gap-3"
    //                               >
    //                                 <img draggable={false} src={Clip} />
    //                                 <span className={styles["Title_File"]}>
    //                                   {data.name}
    //                                 </span>
    //                               </Col>
    //                             </Row>
    //                             <Row className="mt-1">
    //                               <Col lg={12} md={12} sm={12}>
    //                                 <span
    //                                   className={
    //                                     styles["Date_Minutes_And_time"]
    //                                   }
    //                                 >
    //                                   4:00pm, 18th May, 2020
    //                                 </span>
    //                               </Col>
    //                             </Row>
    //                           </Col>
    //                           <Col lg={4} md={4} sm={4} className="">
    //                             <Row className="mt-3">
    //                               <Col lg={12} md={12} sm={12}>
    //                                 <span
    //                                   className={styles["Uploaded_heading"]}
    //                                 >
    //                                   {t("Uploaded-by")}
    //                                 </span>
    //                               </Col>
    //                             </Row>
    //                             <Row>
    //                               <Col
    //                                 lg={12}
    //                                 md={12}
    //                                 sm={12}
    //                                 className="d-flex gap-2 align-items-center"
    //                               >
    //                                 <img
    //                                   draggable={false}
    //                                   src={profile}
    //                                   height="27px"
    //                                   width="27px"
    //                                   className={styles["Profile_minutes"]}
    //                                 />
    //                                 <span className={styles["Name"]}>
    //                                   Saaf Fudda
    //                                 </span>
    //                               </Col>
    //                             </Row>
    //                           </Col>
    //                         </Row>
    //                         <img
    //                           draggable={false}
    //                           src={RedCroseeIcon}
    //                           height="20.76px"
    //                           width="20.76px"
    //                           className={styles["RedCrossClass"]}
    //                           onClick={() => {
    //                             handleRemoveFiles(index);
    //                           }}
    //                         />
    //                       </Col>
    //                     </>
    //                   );
    //                 })
    //               : null}
    //           </Row>
    //         </Col>
    //       </Row>
    //       <Row className="mt-5">
    //         <Col
    //           lg={12}
    //           md={12}
    //           sm={12}
    //           className="d-flex justify-content-end gap-2"
    //         >
    //           <Button
    //             text={t("Clone-meeting")}
    //             className={styles["Cancel_Minutes_upload_section"]}
    //           />
    //           <Button
    //             text={t("Cancel")}
    //             className={styles["Cancel_Minutes_upload_section"]}
    //             onClick={handleUnsaveFileUploadMinues}
    //           />
    //           <Button
    //             disableBtn={attachments.length <= 0 ? true : false}
    //             text={t("Save")}
    //             className={styles["Save_Minutes_upload_section"]}
    //             onClick={handleSaveFunctionality}
    //           />
    //         </Col>
    //       </Row>
    //     </>
    //   ) : afterSaveFiles ? (
    //     <>
    //       <Row className="mt-3 m-0 p-0">
    //         <Col
    //           lg={12}
    //           md={12}
    //           sm={12}
    //           className="d-flex justify-content-end gap-2"
    //         >
    //           <Button
    //             text={t("Invite-to-contribute")}
    //             className={styles["InviteToContributeButton"]}
    //           />
    //           <Button
    //             text={t("Publish-minutes")}
    //             className={styles["InviteToContributeButton"]}
    //           />
    //           <Button
    //             text={t("Edit")}
    //             icon={
    //               <img
    //                 draggable={false}
    //                 src={EditIcon}
    //                 width="11.75px"
    //                 height="11.75px"
    //               />
    //             }
    //             className={styles["InviteToContributeButton"]}
    //             onClick={handleEditButton}
    //           />
    //         </Col>
    //       </Row>
    //       <Row>
    //         <Col lg={12} md={12} sm={12}>
    //           <Row className={styles["Scroller_On_Save"]}>
    //             {attachments.length > 0
    //               ? attachments.map((data, index) => {
    //                   return (
    //                     <>
    //                       <Col
    //                         lg={6}
    //                         md={6}
    //                         sm={6}
    //                         className={styles["Box_Minutes"]}
    //                       >
    //                         <Row>
    //                           <Col lg={8} md={8} sm={8}>
    //                             <Row className="mt-3">
    //                               <Col
    //                                 lg={12}
    //                                 md={12}
    //                                 sm={12}
    //                                 className="d-flex align-items-center gap-3"
    //                               >
    //                                 <img draggable={false} src={Clip} />
    //                                 <span className={styles["Title_File"]}>
    //                                   {data.name}
    //                                 </span>
    //                               </Col>
    //                             </Row>
    //                             <Row className="mt-1">
    //                               <Col lg={12} md={12} sm={12}>
    //                                 <span
    //                                   className={
    //                                     styles["Date_Minutes_And_time"]
    //                                   }
    //                                 >
    //                                   4:00pm, 18th May, 2020
    //                                 </span>
    //                               </Col>
    //                             </Row>
    //                           </Col>
    //                           <Col lg={4} md={4} sm={4} className="">
    //                             <Row className="mt-3">
    //                               <Col lg={12} md={12} sm={12}>
    //                                 <span
    //                                   className={styles["Uploaded_heading"]}
    //                                 >
    //                                   {t("Uploaded-by")}
    //                                 </span>
    //                               </Col>
    //                             </Row>
    //                             <Row>
    //                               <Col
    //                                 lg={12}
    //                                 md={12}
    //                                 sm={12}
    //                                 className="d-flex gap-2 align-items-center"
    //                               >
    //                                 <img
    //                                   draggable={false}
    //                                   src={profile}
    //                                   height="27px"
    //                                   width="27px"
    //                                   className={styles["Profile_minutes"]}
    //                                 />
    //                                 <span className={styles["Name"]}>
    //                                   Saaf Fudda
    //                                 </span>
    //                               </Col>
    //                             </Row>
    //                           </Col>
    //                         </Row>
    //                       </Col>
    //                     </>
    //                   );
    //                 })
    //               : null}
    //           </Row>
    //         </Col>
    //       </Row>
    //       <Row className="m-0 p-0 mt-5">
    //         <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
    //           <Button
    //             text={t("Save")}
    //             className={styles["Save_Btn_After_save"]}
    //           />
    //         </Col>
    //       </Row>
    //     </>
    //   ) : createFromScratch ? (
    //     <CreateFromScratch />
    //   ) : agenda ? (
    //     <AgendaImport />
    //   ) : (
    //     <>
    //       <Row className="m-0 p-0 mt-3">
    //         <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
    //           <Button
    //             text={t("Import-previous-minutes")}
    //             className={styles["Minustes_Buttons_Import"]}
    //             onClick={handleImportPreviousModal}
    //           />
    //         </Col>
    //       </Row>
    //       <Row className="d-flex justify-content-center gap-4 mt-5">
    //         <Col lg={4} md={4} sm={4} className={styles["Box_For_Options"]}>
    //           <Row className="mt-3">
    //             <Col
    //               lg={12}
    //               md={12}
    //               sm={12}
    //               className="d-flex justify-content-center"
    //             >
    //               <Row>
    //                 <Col lg={12} md={12} sm={12}>
    //                   <Row>
    //                     <Col lg={12} md={12} sm={12} className="mt-4">
    //                       <img
    //                         draggable={false}
    //                         src={download}
    //                         width="161.76px"
    //                         height="161.76px"
    //                       />
    //                     </Col>
    //                   </Row>
    //                 </Col>
    //               </Row>
    //             </Col>
    //           </Row>
    //           <Row className="mt-4">
    //             <Col
    //               lg={12}
    //               md={12}
    //               sm={12}
    //               className="d-flex justify-content-center"
    //             >
    //               <Button
    //                 text={t("Upload")}
    //                 className={styles["Upload_Btn_Styles"]}
    //                 onClick={handleUploadButton}
    //               />
    //             </Col>
    //           </Row>
    //         </Col>
    //         <Col lg={4} md={4} sm={4} className={styles["Box_For_Options"]}>
    //           <Row className="mt-3">
    //             <Col
    //               lg={12}
    //               md={12}
    //               sm={12}
    //               className="d-flex justify-content-center"
    //             >
    //               <Row>
    //                 <Col lg={12} md={12} sm={12}>
    //                   <Row className="mt-4">
    //                     <Col lg={12} md={12} sm={12}>
    //                       <img
    //                         draggable={false}
    //                         src={scratch}
    //                         width="161.76px"
    //                         height="161.76px"
    //                       />
    //                     </Col>
    //                   </Row>
    //                 </Col>
    //               </Row>
    //             </Col>
    //           </Row>
    //           <Row className="mt-4">
    //             <Col
    //               lg={12}
    //               md={12}
    //               sm={12}
    //               className="d-flex justify-content-center"
    //             >
    //               <Button
    //                 text={t("Create-from-scratch")}
    //                 className={styles["Upload_Btn_Styles"]}
    //                 onClick={handleCreateFromScratch}
    //               />
    //             </Col>
    //           </Row>
    //         </Col>
    //         <Col lg={4} md={4} sm={4} className={styles["Box_For_Options"]}>
    //           <Row className="mt-4">
    //             <Col
    //               lg={12}
    //               md={12}
    //               sm={12}
    //               className="d-flex justify-content-center"
    //             >
    //               <Row>
    //                 <Col lg={12} md={12} sm={12}>
    //                   <Row className="mt-2">
    //                     <Col lg={12} md={12} sm={12}>
    //                       <img
    //                         draggable={false}
    //                         src={AgendaIcon}
    //                         width="161.76px"
    //                         height="161.76px"
    //                         className={styles["AgendaIconStyles"]}
    //                       />
    //                     </Col>
    //                   </Row>
    //                 </Col>
    //               </Row>
    //             </Col>
    //           </Row>
    //           <Row className="mt-4">
    //             <Col
    //               lg={12}
    //               md={12}
    //               sm={12}
    //               className="d-flex justify-content-center"
    //             >
    //               <Button
    //                 text={t("Agenda")}
    //                 className={styles["Upload_Btn_Styles"]}
    //                 onClick={handleAgenadFile}
    //               />
    //             </Col>
    //           </Row>
    //         </Col>
    //       </Row>
    //     </>
    //   )}

    //   {NewMeetingreducer.ImportPreviousMinutes && <ImportMinutesModal />}
    //   {NewMeetingreducer.unsaveFileUploadMinutes && (
    //     <UnsavedMinutes setMinutes={setMinutes} />
    //   )}
    // </section>
  );
};

export default Minutes;
