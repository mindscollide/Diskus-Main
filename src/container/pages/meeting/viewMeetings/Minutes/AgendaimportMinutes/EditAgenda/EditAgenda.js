import React, { useRef, useState } from "react";
import styles from "./EditAgenda.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import profile from "../../../../../../../assets/images/newprofile.png";
import Editicon from "../../../../../../../assets/images/Edit-Icon.png";
import { Col, Row } from "react-bootstrap";
import RedCroseeIcon from "../../../../../../../assets/images/CrossIcon.svg";
import ReactQuill, { Quill } from "react-quill";
import { Button } from "../../../../../../../components/elements";

const EditAgenda = ({ AgendaData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [expanded, setExpanded] = useState(false);
  const [expandIndex, setExpandIndex] = useState(0);
  const [editSpecificAgenda, setEditSpecificAgenda] = useState(false);
  const [editSubAgenda, setEditSubAgenda] = useState(false);
  const [EditMainAgendaIndex, setEditMainAgendaIndex] = useState(0);
  const [editSubAgendaIndex, setEditSubAgendaIndex] = useState(0);

  const toggleExpansion = (index) => {
    setExpandIndex(index);
    setExpanded(!expanded);
  };

  const handleEdituserMain = (index) => {
    setEditMainAgendaIndex(index);
    setEditSpecificAgenda(true);
  };

  const handleEditButton = () => {
    setEditSpecificAgenda(false);
    setEditSubAgenda(false);
  };

  const HandleSubAgendaEdit = (index, subAgendaViewIndex) => {
    setEditMainAgendaIndex(index);
    setEditSubAgendaIndex(subAgendaViewIndex);
    setEditSubAgenda(true);
  };

  var Size = Quill.import("attributors/style/size");
  Size.whitelist = ["14px", "16px", "18px"];
  Quill.register(Size, true);
  var FontAttributor = Quill.import("formats/font");
  var fonts = ["impact", "courier", "comic"];
  FontAttributor.whitelist = fonts;
  Quill.register(FontAttributor, true);
  const editorRef = useRef(null);

  const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }],
        [{ font: ["impact", "courier", "comic", "Montserrat"] }],
        ["bold", "italic", "underline", "blockquote"],
        [{ color: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
      handlers: {},
    },
    clipboard: {
      matchVisual: true,
    },
  };

  return (
    <section>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className={styles["Scroller_Edit_Ageda_Main"]}
        >
          <Row>
            <Col lg={12} md={12} sm={12} className={styles["OverAll_Padding"]}>
              <Row>
                {AgendaData.length > 0
                  ? AgendaData.map((data, index) => {
                      return (
                        <>
                          <Row className={editSpecificAgenda ? "mt-5" : "mt-2"}>
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["Heading_View_Minutes"]}>
                                <span>{index + 1}.</span>
                                {data.MainTitle}
                              </span>
                            </Col>
                          </Row>
                          {EditMainAgendaIndex === index &&
                          editSpecificAgenda === true ? (
                            <>
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={editSubAgenda ? "mb-5" : ""}
                                >
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
                                        className={
                                          styles["quill-height-addNote"]
                                        }
                                      />
                                      <img
                                        draggable={false}
                                        src={RedCroseeIcon}
                                        className={styles["RedCrossForEdit"]}
                                      />
                                    </Col>
                                  </Row>
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
                                          {expandIndex === index &&
                                          expanded === true ? (
                                            <>
                                              {data?.MainHeading?.substring(
                                                0,
                                                190
                                              )}
                                              ...
                                            </>
                                          ) : (
                                            <>{data?.MainHeading}</>
                                          )}

                                          <span
                                            className={
                                              styles["Show_more_Styles"]
                                            }
                                            onClick={() =>
                                              toggleExpansion(index)
                                            }
                                          >
                                            {expanded
                                              ? t("See-more")
                                              : t("See-less")}
                                          </span>
                                        </span>
                                      </Col>
                                    </Row>
                                    <Row className="mt-1">
                                      <Col lg={12} md={12} sm={12}>
                                        <span
                                          className={
                                            styles["Date_Minutes_And_time"]
                                          }
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
                                          draggable={false}
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
                                              className={
                                                styles["Uploaded_heading"]
                                              }
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
                                          draggable={false}
                                          src={Editicon}
                                          height="21.55px"
                                          width="21.55px"
                                          className="cursor-pointer"
                                          onClick={() =>
                                            handleEdituserMain(index)
                                          }
                                        />
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                                <img
                                  draggable={false}
                                  src={RedCroseeIcon}
                                  height="20.76px"
                                  width="20.76px"
                                  className={styles["RedCrossClass"]}
                                />
                              </Col>
                            </>
                          )}

                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={
                                data.SubAgenda.length <= 0
                                  ? styles[
                                      "Scroller_SubAgenda_WhenNO_SubAgenda"
                                    ]
                                  : styles["Scroller_SubAgenda"]
                              }
                            >
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={
                                    styles["OverAll_padding_SubAgenda"]
                                  }
                                >
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className="mt-4 mb-2">
                                        <Col lg={1} md={1} sm={1}></Col>
                                        <Col lg={11} md={11} sm={11}>
                                          {data.SubAgenda.map(
                                            (
                                              subAgendaViewData,
                                              subAgendaViewIndex
                                            ) => {
                                              return (
                                                <>
                                                  {editSubAgendaIndex ===
                                                    subAgendaViewIndex &&
                                                  EditMainAgendaIndex ===
                                                    index &&
                                                  editSubAgenda ? (
                                                    <>
                                                      <Row>
                                                        <Col
                                                          lg={12}
                                                          md={12}
                                                          sm={12}
                                                          //   className=""
                                                        >
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
                                                                // value={data.name}
                                                                placeholder={t(
                                                                  "Note-details"
                                                                )}
                                                                modules={
                                                                  modules
                                                                }
                                                                className={
                                                                  styles[
                                                                    "quill-height-addNote"
                                                                  ]
                                                                }
                                                              />
                                                              <img
                                                                draggable={
                                                                  false
                                                                }
                                                                src={
                                                                  RedCroseeIcon
                                                                }
                                                                className={
                                                                  styles[
                                                                    "RedCrossForEdit"
                                                                  ]
                                                                }
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </Col>
                                                      </Row>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <Col
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        className={
                                                          editSubAgenda
                                                            ? "mt-5"
                                                            : "mt-3"
                                                        }
                                                      >
                                                        <Row>
                                                          <Col
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                          >
                                                            <span
                                                              className={
                                                                styles[
                                                                  "SubAgendaSubTitleHeaeding"
                                                                ]
                                                              }
                                                            >
                                                              1.1.
                                                              <span>
                                                                {
                                                                  subAgendaViewData.SubTitle
                                                                }
                                                              </span>
                                                            </span>
                                                          </Col>
                                                        </Row>
                                                        <Row>
                                                          <Col
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            className={
                                                              styles[
                                                                "Box_Minutes_SubAgenda_Edit"
                                                              ]
                                                            }
                                                          >
                                                            <Row>
                                                              <Col
                                                                lg={8}
                                                                md={8}
                                                                sm={8}
                                                              >
                                                                <Row className="mt-3">
                                                                  <Col
                                                                    lg={12}
                                                                    md={12}
                                                                    sm={12}
                                                                  >
                                                                    <span
                                                                      className={
                                                                        styles[
                                                                          "Title_File"
                                                                        ]
                                                                      }
                                                                    >
                                                                      {expandIndex ===
                                                                        index &&
                                                                      expanded ===
                                                                        true ? (
                                                                        <>
                                                                          {subAgendaViewData?.SubTitle?.substring(
                                                                            0,
                                                                            190
                                                                          )}
                                                                          ...
                                                                        </>
                                                                      ) : (
                                                                        <>
                                                                          {
                                                                            subAgendaViewData?.SubTitle
                                                                          }
                                                                        </>
                                                                      )}

                                                                      <span
                                                                        className={
                                                                          styles[
                                                                            "Show_more_Styles"
                                                                          ]
                                                                        }
                                                                        onClick={() =>
                                                                          toggleExpansion(
                                                                            index
                                                                          )
                                                                        }
                                                                      >
                                                                        {expanded
                                                                          ? t(
                                                                              "See-more"
                                                                            )
                                                                          : t(
                                                                              "See-less"
                                                                            )}
                                                                      </span>
                                                                    </span>
                                                                  </Col>
                                                                </Row>
                                                                <Row className="mt-1">
                                                                  <Col
                                                                    lg={12}
                                                                    md={12}
                                                                    sm={12}
                                                                  >
                                                                    <span
                                                                      className={
                                                                        styles[
                                                                          "Date_Minutes_And_time"
                                                                        ]
                                                                      }
                                                                    >
                                                                      4:00pm,
                                                                      18th May,
                                                                      2020
                                                                    </span>
                                                                  </Col>
                                                                </Row>
                                                              </Col>
                                                              <Col
                                                                lg={4}
                                                                md={4}
                                                                sm={4}
                                                                className="mt-4"
                                                              >
                                                                <Row className="d-flex justify-content-end">
                                                                  <Col
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={2}
                                                                  >
                                                                    <img
                                                                      draggable={
                                                                        false
                                                                      }
                                                                      src={
                                                                        profile
                                                                      }
                                                                      height="39px"
                                                                      width="39px"
                                                                      className={
                                                                        styles[
                                                                          "Profile_minutes"
                                                                        ]
                                                                      }
                                                                    />
                                                                  </Col>
                                                                  <Col
                                                                    lg={6}
                                                                    md={6}
                                                                    sm={6}
                                                                    className={
                                                                      styles[
                                                                        "Line_heigh"
                                                                      ]
                                                                    }
                                                                  >
                                                                    <Row>
                                                                      <Col
                                                                        lg={12}
                                                                        md={12}
                                                                        sm={12}
                                                                      >
                                                                        <span
                                                                          className={
                                                                            styles[
                                                                              "Uploaded_heading"
                                                                            ]
                                                                          }
                                                                        >
                                                                          {t(
                                                                            "Uploaded-by"
                                                                          )}
                                                                        </span>
                                                                      </Col>
                                                                    </Row>
                                                                    <Row>
                                                                      <Col
                                                                        lg={12}
                                                                        md={12}
                                                                        sm={12}
                                                                      >
                                                                        <span
                                                                          className={
                                                                            styles[
                                                                              "Name"
                                                                            ]
                                                                          }
                                                                        >
                                                                          Mehtab
                                                                          Ahmed
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
                                                                      draggable={
                                                                        false
                                                                      }
                                                                      src={
                                                                        Editicon
                                                                      }
                                                                      height="21.55px"
                                                                      width="21.55px"
                                                                      className="cursor-pointer"
                                                                      onClick={() => {
                                                                        HandleSubAgendaEdit(
                                                                          index,
                                                                          subAgendaViewIndex
                                                                        );
                                                                      }}
                                                                    />

                                                                    <img
                                                                      draggable={
                                                                        false
                                                                      }
                                                                      src={
                                                                        RedCroseeIcon
                                                                      }
                                                                      height="20.76px"
                                                                      width="20.76px"
                                                                      className={
                                                                        styles[
                                                                          "RedCrossClassSubAgenda"
                                                                        ]
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </Col>
                                                            </Row>
                                                          </Col>
                                                        </Row>
                                                      </Col>
                                                    </>
                                                  )}
                                                </>
                                              );
                                            }
                                          )}
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </>
                      );
                    })
                  : null}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={t("Clone-meeting")}
            className={styles["Cancel_button_Edit_Agenda_Minutes"]}
            onClick={handleEditButton}
          />
          <Button
            text={t("Cancel")}
            className={styles["Cancel_button_Edit_Agenda_Minutes"]}
            onClick={handleEditButton}
          />
          <Button
            text={t("Save")}
            className={styles["Save_button_Edit_Agenda_Minutes"]}
          />
        </Col>
      </Row>
    </section>
  );
};

export default EditAgenda;
