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

const AgendaImport = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [subExpand, setSubExpand] = useState(false);
  const [allowEditMainAgenda, setallowEditMainAgenda] = useState(false);
  const [allowEditSubAgenda, setallowEditSubAgenda] = useState(false);
  const [mainAgendaMinuteRemove, setmainAgendaMinuteRemove] = useState(0);
  const [subAgendaMinuteRemove, setSubAgendaMinuteRemove] = useState(0);
  const [indexForMainEdit, setIndexForMainEdit] = useState(0);
  const [indexForSubAgendaEdit, setIndexForSubAgendaEdit] = useState(0);

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
      ],
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

  return (
    <section>
      <Row className={styles["Scroller"]}>
        {showAgendaMinutes.length > 0
          ? showAgendaMinutes.map((data, index) => {
              console.log(data, "datadatadatadatadata");
              return (
                <>
                  {allowEditMainAgenda &&
                  indexForMainEdit === index &&
                  allowEditMainAgenda === true ? (
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
                            value={data.name}
                            placeholder={t("Note-details")}
                            modules={modules}
                            className={styles["quill-height-addNote"]}
                          />
                          <img
                            src={RedCroseeIcon}
                            className={styles["RedCrossForEdit"]}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-5">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-end gap-2"
                        >
                          <Button
                            text={t("Cancel")}
                            className={styles["CancelButtonOnSaveAgendaImport"]}
                            onClick={cancelEditFunctionality}
                          />
                          <Button
                            text={t("Save")}
                            className={styles["SaveButtonOnSaveAgendaImport"]}
                          />
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Box_Minutes"]}
                      >
                        <Row>
                          <Col lg={9} md={9} sm={9}>
                            <Row className="mt-3">
                              <Col lg={12} md={12} sm={12}>
                                <span className={styles["Title_File"]}>
                                  {expanded ? (
                                    <>{data.name.substring(0, 190)}...</>
                                  ) : (
                                    <>{data.name}</>
                                  )}

                                  <span
                                    className={styles["Show_more_Styles"]}
                                    onClick={toggleExpansion}
                                  >
                                    {expanded ? t("See-more") : t("See-less")}
                                  </span>
                                </span>
                              </Col>
                            </Row>
                            <Row className="mt-1">
                              <Col lg={12} md={12} sm={12}>
                                <span
                                  className={styles["Date_Minutes_And_time"]}
                                >
                                  4:00pm, 18th May, 2020
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={3} md={3} sm={3} className="mt-4">
                            <Row className="d-flex justify-content-end">
                              <Col lg={2} md={2} sm={2}>
                                <img
                                  src={profile}
                                  height="39px"
                                  width="39px"
                                  className={styles["Profile_minutes"]}
                                />
                              </Col>
                              <Col
                                lg={6}
                                md={6}
                                sm={6}
                                className={styles["Line_heigh"]}
                              >
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={styles["Uploaded_heading"]}
                                    >
                                      {t("Uploaded-by")}
                                    </span>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <span className={styles["Name"]}>
                                      Mehtab Ahmed
                                    </span>
                                  </Col>
                                </Row>
                              </Col>
                              <Col
                                lg={3}
                                md={3}
                                sm={3}
                                className="d-flex justify-content-start align-items-center"
                              >
                                <img
                                  src={EditIcon}
                                  height="21.55px"
                                  width="21.55px"
                                  className="cursor-pointer"
                                  onClick={() => {
                                    handleMainAgendaEditOptions(index);
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <img
                          src={RedCroseeIcon}
                          height="20.76px"
                          width="20.76px"
                          className={styles["RedCrossClass"]}
                          onClick={() => {
                            handleRemoveFiles(index);
                          }}
                        />
                      </Col>
                    </>
                  )}

                  <Row className={styles["Sub_Scroller"]}>
                    {data.subAgendaMinute.length > 0
                      ? data.subAgendaMinute.map(
                          (subAgendaData, subAgendaIndex) => {
                            return (
                              <>
                                {indexForSubAgendaEdit === subAgendaIndex &&
                                indexForMainEdit === index &&
                                allowEditSubAgenda ? (
                                  "React Quill"
                                ) : (
                                  <>
                                    {" "}
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="d-flex justify-content-end"
                                    >
                                      <section
                                        className={
                                          styles["Box_Minutes_SubAgenda"]
                                        }
                                      >
                                        <Row>
                                          <Col lg={9} md={9} sm={9}>
                                            <>
                                              <Row className="mt-3">
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles["Title_File"]
                                                    }
                                                  >
                                                    {subExpand ? (
                                                      <>
                                                        {subAgendaData.subAgenda.substring(
                                                          0,
                                                          190
                                                        )}
                                                        ...
                                                      </>
                                                    ) : (
                                                      <>
                                                        {
                                                          subAgendaData.subAgenda
                                                        }
                                                      </>
                                                    )}

                                                    <span
                                                      className={
                                                        styles[
                                                          "Show_more_Styles"
                                                        ]
                                                      }
                                                      onClick={
                                                        SubtoggleExpansion
                                                      }
                                                    >
                                                      {subExpand
                                                        ? t("See-more")
                                                        : t("See-less")}
                                                    </span>
                                                  </span>
                                                </Col>
                                              </Row>
                                            </>

                                            <Row className="mt-1">
                                              <Col lg={12} md={12} sm={12}>
                                                <span
                                                  className={
                                                    styles[
                                                      "Date_Minutes_And_time"
                                                    ]
                                                  }
                                                >
                                                  4:00pm, 18th May, 2020
                                                </span>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col
                                            lg={3}
                                            md={3}
                                            sm={3}
                                            className="mt-4"
                                          >
                                            <Row className="d-flex justify-content-end">
                                              <Col lg={2} md={2} sm={2}>
                                                <img
                                                  src={profile}
                                                  height="39px"
                                                  width="39px"
                                                  className={
                                                    styles["Profile_minutes"]
                                                  }
                                                />
                                              </Col>
                                              <Col
                                                lg={6}
                                                md={6}
                                                sm={6}
                                                className={styles["Line_heigh"]}
                                              >
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "Uploaded_heading"
                                                        ]
                                                      }
                                                    >
                                                      {t("Uploaded-by")}
                                                    </span>
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={styles["Name"]}
                                                    >
                                                      SAIF UL ISLAM
                                                    </span>
                                                  </Col>
                                                </Row>
                                              </Col>
                                              <Col
                                                lg={3}
                                                md={3}
                                                sm={3}
                                                className="d-flex justify-content-start align-items-center"
                                              >
                                                <img
                                                  src={EditIcon}
                                                  height="21.55px"
                                                  width="21.55px"
                                                  className="cursor-pointer"
                                                  onClick={() => {
                                                    EditSubAgendaMinutes(
                                                      index,
                                                      subAgendaIndex
                                                    );
                                                  }}
                                                />
                                              </Col>
                                            </Row>
                                          </Col>
                                        </Row>
                                        <img
                                          src={RedCroseeIcon}
                                          height="20.76px"
                                          width="20.76px"
                                          className={styles["RedCrossClass"]}
                                          onClick={() => {
                                            handleRemoveFilesForSubFiles(
                                              index,
                                              subAgendaIndex
                                            );
                                          }}
                                        />
                                      </section>
                                    </Col>
                                  </>
                                )}
                              </>
                            );
                          }
                        )
                      : null}
                  </Row>
                </>
              );
            })
          : null}
      </Row>
    </section>
  );
};

export default AgendaImport;
