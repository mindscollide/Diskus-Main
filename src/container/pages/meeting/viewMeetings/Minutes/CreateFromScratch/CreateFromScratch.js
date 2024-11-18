import React, { useRef, useState } from "react";
import styles from "./CreateFromScratch.module.css";
import RedCroseeIcon from "../../../../../../assets/images/CrossIcon.svg";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import profile from "../../../../../../assets/images/newprofile.png";
import { Col, Row } from "react-bootstrap";
import ReactQuill, { Quill } from "react-quill";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import { Button } from "../../../../../../components/elements";
import UndavedModalScratch from "./UnsavedModalScratch/UndavedModalScratch";
import { useSelector } from "react-redux";
import {
  showUnsavedCreateFromScratch,
  showUnsavedForButonCreateFromScratch,
} from "../../../../../../store/actions/NewMeetingActions";
import { isHTML } from "../../../../../../commen/functions/html_formater";
import UnsavedCreateScratch from "./UnsavedCreateScratch/UnsavedCreateScratch";

const CreateFromScratch = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editable, setEditable] = useState(false);
  const [createFromSratch, setCreateFromSratch] = useState(false);
  const [editableIndex, setEditableIndex] = useState(0);
  const { NewMeetingreducer } = useSelector((state) => state);

  const [showScratchFiles, setShowScratchFiles] = useState([
    {
      id: 0,
      name: "",
    },
  ]);
  const [quillText, setQuillText] = useState("");
  console.log(quillText, "quillTextquillTextquillText");
  const handleRemoveFiles = (index) => {
    let optionscross = [...showScratchFiles];
    optionscross.splice(index, 1);
    setShowScratchFiles(optionscross);
  };

  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const allowEditOptions = (index) => {
    setEditableIndex(index);
    setEditable(true);
    setCreateFromSratch(false);
  };

  const cancelEditFunctionality = () => {
    dispatch(showUnsavedCreateFromScratch(true));
  };

  const handleCreateFromScratch = () => {
    setCreateFromSratch(true);
    setEditable(false);
  };

  const handleCancelonClickCreateFromScratch = () => {
    dispatch(showUnsavedForButonCreateFromScratch(true));
  };

  const HandleSavingTheMinutes = () => {
    setShowScratchFiles([
      ...showScratchFiles,
      {
        id: showScratchFiles.length + 1,
        name: quillText,
      },
    ]);
    setQuillText("");
    setCreateFromSratch(false);
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
        {
          size: ["12px", "16px", "18px"],
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
  const onTextChange = (content, delta, source) => {
    const plainText = content.replace(/(<([^>]+)>)/gi, "");
    if (source === "user" && plainText != "") {
      setQuillText(content);
    } else {
      setQuillText("");
    }
  };

  return (
    <section>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-center">
          <Button
            text={t("Create-another-from-scratch")}
            className={styles["CreateAnotherScratchBtn"]}
            onClick={handleCreateFromScratch}
          />
        </Col>
      </Row>
      {createFromSratch ? (
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
                value={quillText}
                onChange={onTextChange}
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
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className={styles["CreateFromScratchScroller"]}
        >
          <section className={styles["SaveCreateFromScratch"]}>
            <Row className="mt-5">
              {showScratchFiles.length > 0
                ? showScratchFiles.map((data, index) => {
                    console.log(data, "datadatadatadatadata");
                    return (
                      <>
                        {editableIndex === index && editable ? (
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
                                  draggable={false}
                                  src={RedCroseeIcon}
                                  className={
                                    styles["RedCrossForEdit_AfterSave"]
                                  }
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
                                  className={
                                    styles["CancelButtonOnSaveAgendaImport"]
                                  }
                                  onClick={cancelEditFunctionality}
                                />
                                <Button
                                  text={t("Save")}
                                  className={
                                    styles["SaveButtonOnSaveAgendaImport"]
                                  }
                                />
                              </Col>
                            </Row>
                          </>
                        ) : (
                          <>
                            {index <= 0 ? null : (
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
                                          <span
                                            className={styles["Title_File"]}
                                          >
                                            {expanded ? (
                                              <>
                                                {data.name.substring(0, 190)}...
                                              </>
                                            ) : (
                                              <>{data.name}</>
                                            )}

                                            <span
                                              className={
                                                styles["Show_more_Styles"]
                                              }
                                              onClick={toggleExpansion}
                                            >
                                              {expanded
                                                ? t("See-more")
                                                : t("See-less")}
                                            </span>
                                          </span>
                                          {/* <span className={styles["Title_File"]}>
                                      {isHTML(data.name) && (
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: data.name,
                                          }}
                                        ></span>
                                      )}

                                      <span
                                        className={styles["Show_more_Styles"]}
                                        onClick={toggleExpansion}
                                      >
                                        {expanded
                                          ? t("See-more")
                                          : t("See-less")}
                                      </span>
                                    </span> */}
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
                                            src={EditIcon}
                                            height="21.55px"
                                            width="21.55px"
                                            className="cursor-pointer"
                                            onClick={() => {
                                              allowEditOptions(index);
                                            }}
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
                                    onClick={() => {
                                      handleRemoveFiles(index);
                                    }}
                                  />
                                </Col>
                              </>
                            )}
                          </>
                        )}
                      </>
                    );
                  })
                : null}
            </Row>
          </section>
        </Col>
      </Row>

      <Row className="m-0 p-0 mt-3">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2"
        >
          {/* <Button
            text={t("Cancel")}
            className={styles["CancelButtonOnSaveAgendaImport"]}
          />
          <Button
            text={t("Save")}
            className={styles["SaveButtonOnSaveAgendaImport"]}
          /> */}
        </Col>
      </Row>
      {createFromSratch ? (
        <>
          <Row className="mt-5">
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2"
            >
              <Button
                text={t("Clone-meeting")}
                className={styles["CancelButtonOnSaveAgendaImport"]}
              />

              <Button
                text={t("Cancel")}
                className={styles["CancelButtonOnSaveAgendaImport"]}
                onClick={handleCancelonClickCreateFromScratch}
              />
              <Button
                text={t("Save")}
                className={styles["SaveButtonOnSaveAgendaImport"]}
                onClick={(e) => {
                  HandleSavingTheMinutes(e);
                }}
              />
            </Col>
          </Row>
        </>
      ) : null}

      {NewMeetingreducer.unsavedModalScratch && (
        <UndavedModalScratch setEditable={setEditable} />
      )}
      {NewMeetingreducer.UnsavedButtonCreateScratch && (
        <UnsavedCreateScratch setCreateFromSratch={setCreateFromSratch} />
      )}
    </section>
  );
};

export default CreateFromScratch;
