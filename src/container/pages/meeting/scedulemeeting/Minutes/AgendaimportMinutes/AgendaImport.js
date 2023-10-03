import React, { useRef, useState } from "react";
import styles from "./AgendaImport.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import profile from "../../../../../../assets/images/newprofile.png";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import RedCroseeIcon from "../../../../../../assets/images/CrossIcon.svg";
import { Col, Row } from "react-bootstrap";
import ReactQuill, { Quill } from "react-quill";
import { Button } from "../../../../../../components/elements";
import ImportAgendaImport from "./ImportAgendaUnsaved/ImportAgendaImport";
import { useSelector } from "react-redux";
import { showUnsavedModalImportAgenda } from "../../../../../../store/actions/NewMeetingActions";
import AfterSavedAgenda from "./AfterSavedAgenda/AfterSavedAgenda";

const AgendaImport = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [expanded, setExpanded] = useState(false);
  const [subExpand, setSubExpand] = useState(false);
  const [allowEditMainAgenda, setallowEditMainAgenda] = useState(false);
  const [allowEditSubAgenda, setallowEditSubAgenda] = useState(false);
  const [savedAgenda, setsavedAgenda] = useState(false);
  const [mainAgendaMinuteRemove, setmainAgendaMinuteRemove] = useState(0);
  const [subAgendaMinuteRemove, setSubAgendaMinuteRemove] = useState(0);
  const [indexForMainEdit, setIndexForMainEdit] = useState(0);
  const [indexForSubAgendaEdit, setIndexForSubAgendaEdit] = useState(0);
  const [createAnotherMinuteMainAgenda, setCreateAnotherMinuteMainAgenda] =
    useState(false);
  const [createAnotherMinutesSubAgenda, setCreateAnotherMinutesSubAgenda] =
    useState(false);
  const [AgendaData, setAgendaData] = useState([
    {
      MainTitle: "Introduction",
      MainHeading:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
      SubAgenda: [
        {
          SubTitle: "A brief overview of the main subject or theme.",
        },
      ],
    },
    {
      MainTitle: "SEO Report",
      MainHeading:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
      SubAgenda: [],
    },
    {
      MainTitle: "Clossing Report",
      SubAgenda: [],
    },
  ]);

  var Size = Quill.import("attributors/style/size");
  Size.whitelist = ["14px", "16px", "18px"];
  Quill.register(Size, true);
  var FontAttributor = Quill.import("formats/font");
  var fonts = ["impact", "courier", "comic"];
  FontAttributor.whitelist = fonts;
  Quill.register(FontAttributor, true);
  const editorRef = useRef(null);

  console.log(subAgendaMinuteRemove, "mainAgendaMinuteRemove");
  const [showAgendaMinutes, setShowAgendaMinutes] = useState([
    {
      name: "Contrary to popular belis, very popular during the Renaissance. The first line of Lorem Ipsum,Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.",
      subAgendaMinute: [
        {
          subAgenda:
            "Saif ul islam Contrary to popular belis, very popular during theContrary to popular belis, very popular during the Renaissance. The firstContrary to popular belis, very popular during the Renaissance. The firstContrary to popular belis, very popular during the Renaissance. The firstContrary to popular belis, very popular during the Renaissance. The firstContrary to popular belis, very popular during the Renaissance. The firstContrary to popular belis, very popular during the Renaissance. The firstContrary to popular belis, very popular during the Renaissance. The first Renaissance. The first line of Lorem Ipsum,Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.",
        },
        {
          subAgenda: "SubOne",
        },
      ],
    },
    {
      name: "Contrary to popular belis, very popular during the Renaissance. The first line of Lorem Ipsum,Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.",
      subAgendaMinute: [],
    },
  ]);

  const EditSubAgendaMinutes = (index, subAgendaIndex) => {
    setIndexForMainEdit(index);
    setIndexForSubAgendaEdit(subAgendaIndex);
    setallowEditSubAgenda(true);
  };

  const cancelEditFunctionality = () => {
    setallowEditMainAgenda(false);
  };

  const canceLsubAgendaEditFunctionality = () => {
    setallowEditSubAgenda(false);
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const SubtoggleExpansion = () => {
    setSubExpand(!subExpand);
  };

  const handleRemoveFiles = (index) => {
    setmainAgendaMinuteRemove(index);
    let optionscross = [...showAgendaMinutes];
    optionscross.splice(mainAgendaMinuteRemove, 1);
    setShowAgendaMinutes(optionscross);
  };

  const handleRemoveFilesForSubFiles = (index, subAgendaIndex) => {
    setmainAgendaMinuteRemove(index);
    setSubAgendaMinuteRemove(subAgendaIndex);
    let optionscross = [...showAgendaMinutes];
    optionscross[index].subAgendaMinute.splice(subAgendaIndex, 1);
    console.log(optionscross[index], "optionscross[index]");
    console.log(
      optionscross[index].subAgendaMinute.splice(subAgendaIndex, 1),
      "optionscross[index]"
    );
    setShowAgendaMinutes(optionscross);
  };

  const handleMainAgendaEditOptions = (index) => {
    setIndexForMainEdit(index);
    setallowEditMainAgenda(true);
  };

  const enterKeyHandler = (event) => {
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      const quill = editorRef.current.getEditor();
      quill.root.setAttribute("autofocus", "");
      quill.focus();
    }
  };

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

  const HandleCancelButtonImportAgenda = () => {
    dispatch(showUnsavedModalImportAgenda(true));
  };

  const handleSavedFunctionalityImportAgenda = () => {
    setsavedAgenda(true);
  };

  const handleCreateAnotherMinuteMainAgenda = () => {
    setCreateAnotherMinuteMainAgenda(true);
  };

  const handlecreateanotherMinutesSubagenda = () => {
    setCreateAnotherMinutesSubAgenda(true);
  };

  return (
    <section>
      {savedAgenda ? (
        <AfterSavedAgenda AgendaData={AgendaData} />
      ) : (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className={styles["Main_scroller_Agenda_minutes"]}
            >
              <Row>
                {AgendaData.length > 0
                  ? AgendaData.map((createData, createindex) => {
                      return (
                        <>
                          <Col lg={12} md={12} sm={12} className="mt-5">
                            <Row className="mt-2">
                              <Col lg={12} md={12} sm={12}>
                                <span
                                  className={styles["HeadingMinutesAgenda"]}
                                >
                                  {createindex + 1}.
                                  <span>{createData.MainTitle}</span>
                                </span>
                              </Col>
                            </Row>
                            {/* Main Agenda Create Another Minutes */}
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <Button
                                  text={t(
                                    "Create-another-minute-in-this-agenda"
                                  )}
                                  className={
                                    styles["CreateAnotherAgendaButtonStyles"]
                                  }
                                  onClick={handleCreateAnotherMinuteMainAgenda}
                                />
                              </Col>
                            </Row>
                            {createAnotherMinuteMainAgenda ? (
                              <>
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
                                      // value={data.name}
                                      placeholder={t("Note-details")}
                                      modules={modules}
                                      className={styles["quill-height-addNote"]}
                                    />
                                    <img
                                      draggable={false}
                                      src={RedCroseeIcon}
                                      className={styles["RedCrossForEdit"]}
                                    />
                                  </Col>
                                </Row>
                              </>
                            ) : null}

                            {/* subAgenda Mapping */}
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className={
                                  createData.SubAgenda <= 0
                                    ? styles[
                                        "SubAgendaCreateScroller_When_NoSubAgenda_Is"
                                      ]
                                    : styles["SubAgendaCreateScroller"]
                                }
                              >
                                <Row>
                                  {createData.SubAgenda.map(
                                    (
                                      createsubAgendaTitle,
                                      createSubAgendaIndex
                                    ) => {
                                      return (
                                        <>
                                          <Col
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            className="mt-3"
                                          >
                                            <Row className="mt-5">
                                              <Col lg={1} md={1} sm={1}></Col>
                                              <Col lg={11} md={11} sm={11}>
                                                <span
                                                  className={
                                                    styles[
                                                      "HeadingMinutesAgenda"
                                                    ]
                                                  }
                                                >
                                                  1.1.
                                                  <span>
                                                    {
                                                      createsubAgendaTitle.SubTitle
                                                    }
                                                  </span>
                                                </span>
                                              </Col>
                                            </Row>
                                            <Row>
                                              <Col lg={1} md={1} sm={1}></Col>
                                              <Col lg={11} md={11} sm={11}>
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <Button
                                                      text={t(
                                                        "Create-another-minute-in-this-subagenda"
                                                      )}
                                                      className={
                                                        styles[
                                                          "CreateAnotherAgendaButtonStyles"
                                                        ]
                                                      }
                                                      onClick={
                                                        handlecreateanotherMinutesSubagenda
                                                      }
                                                    />
                                                  </Col>
                                                </Row>
                                                {/* Create Minutes Sub Agenda */}
                                                {createAnotherMinutesSubAgenda ? (
                                                  <>
                                                    <Row
                                                      className={
                                                        styles[
                                                          "Add-note-QuillRow"
                                                        ]
                                                      }
                                                    >
                                                      <Col
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                        className={
                                                          styles[
                                                            "Arabic_font_Applied"
                                                          ]
                                                        }
                                                      >
                                                        <ReactQuill
                                                          ref={editorRef}
                                                          theme="snow"
                                                          placeholder={t(
                                                            "Note-details"
                                                          )}
                                                          modules={modules}
                                                          className={
                                                            styles[
                                                              "quill-height-addNote"
                                                            ]
                                                          }
                                                        />
                                                        <img
                                                          draggable={false}
                                                          src={RedCroseeIcon}
                                                          className={
                                                            styles[
                                                              "RedCrossForEdit"
                                                            ]
                                                          }
                                                        />
                                                      </Col>
                                                    </Row>
                                                  </>
                                                ) : null}
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      );
                                    }
                                  )}
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        </>
                      );
                    })
                  : null}
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2"
            >
              <Button
                text={t("Cancel")}
                className={styles["CancelButtonOnSaveAgendaImport"]}
                onClick={HandleCancelButtonImportAgenda}
              />
              <Button
                text={t("Save")}
                className={styles["SaveButtonOnSaveAgendaImport"]}
                onClick={handleSavedFunctionalityImportAgenda}
              />
            </Col>
          </Row>
        </>
      )}

      {NewMeetingreducer.unsavedModalImportAgenda && <ImportAgendaImport />}
    </section>
  );
};

export default AgendaImport;
