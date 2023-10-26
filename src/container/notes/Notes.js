import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Notes.module.css";
import IconAttachment from "../../assets/images/Icon-Attachment.png";
import EditIcon from "../../assets/images/Edit-Icon.png";
import NotesMainEmpty from "../../assets/images/NotesMain_Empty.svg";
import ModalViewNote from "../modalViewNote/ModalViewNote";
import ModalAddNote from "../modalAddNote/ModalAddNote";
import ModalUpdateNote from "../modalUpdateNote/ModalUpdateNote";
import ClipIcon from "../../assets/images/AttachmentNotes.svg";
import StarIcon from "../../assets/images/Star.svg";
import hollowstar from "../../assets/images/Hollowstar.svg";
import PlusExpand from "../../assets/images/Plus-notesExpand.svg";
import MinusExpand from "../../assets/images/close-accordion.svg";
import EditIconNote from "../../assets/images/EditIconNotes.svg";
import { Pagination, ConfigProvider } from "antd";
import ar_EG from "antd/es/locale/ar_EG";
import en_US from "antd/es/locale/en_US";
import FileIcon, { defaultStyles } from "react-file-icon";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Plus } from "react-bootstrap-icons";
import { Button, Loader, Notification } from "../../components/elements";
import { Accordion, AccordionSummary } from "@material-ui/core";
import { AccordionDetails } from "@mui/material";
import {
  ClearNotesResponseMessage,
  GetNotes,
  GetNotesByIdAPI,
} from "../../store/actions/Notes_actions";
import {
  _justShowDateformat,
  _justShowDay,
} from "../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../commen/functions/customPagination/Paginations";
const Notes = () => {
  //Test Accordian states start
  const [updateNotesModal, setUpdateNotesModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NotesReducer, LanguageReducer } = useSelector((state) => state);
  //Get Current User ID
  const { t } = useTranslation();
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let notesPage = JSON.parse(localStorage.getItem("notesPage"));
  let notesPagesize = localStorage.getItem("notesPageSize");
  const [totalRecords, setTotalRecords] = useState(0);
  // for modal Add notes
  const [addNotes, setAddNotes] = useState(false);

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [showStarIcon, setStarIcon] = useState(false);
  // for modal Update notes
  const [updateShow, setUpdateShow] = useState(false);
  const [notes, setNotes] = useState([]);
  //for view modal notes
  const [viewModalShow, setViewModalShow] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const [isExpand, setExpand] = useState(false);

  useEffect(() => {
    if (notesPagesize !== null && notesPage !== null) {
      let Data = {
        UserID: parseInt(createrID),
        OrganizationID: JSON.parse(OrganizationID),
        Title: "",
        PageNumber: JSON.parse(notesPage),
        Length: JSON.parse(notesPagesize),
      };
      dispatch(GetNotes(navigate, Data, t));
    } else {
      localStorage.setItem("notesPage", 1);
      localStorage.setItem("notesPageSize", 50);
      let Data = {
        UserID: parseInt(createrID),
        OrganizationID: JSON.parse(OrganizationID),
        Title: "",
        PageNumber: 1,
        Length: 50,
      };
      dispatch(GetNotes(navigate, Data, t));
    }
    setAddNotes(false);
    setViewModalShow(false);
    setUpdateShow(false);
    return () => {
      localStorage.removeItem("notesPage");
      localStorage.removeItem("notesPageSize");
    };
  }, []);

  // render Notes Data
  useEffect(() => {
    console.log("check note empty state");
    try {
      if (
        NotesReducer.GetAllNotesResponse !== null &&
        NotesReducer.GetAllNotesResponse !== undefined
      ) {
        console.log("check note empty state");
        setTotalRecords(NotesReducer.GetAllNotesResponse.totalRecords);
        if (NotesReducer.GetAllNotesResponse.getNotes === null) {
          console.log("check note empty state");
          setNotes([]);
        } else if (
          Array.isArray(NotesReducer.GetAllNotesResponse.getNotes) &&
          NotesReducer.GetAllNotesResponse.getNotes.length > 0
        ) {
          console.log("check note empty state");
          let notes = [];
          NotesReducer.GetAllNotesResponse.getNotes.map((data, index) => {
            notes.push({
              date: data.date,
              description: data.description,
              fK_NotesStatus: data.fK_NotesStatus,
              fK_OrganizationID: data.fK_OrganizationID,
              fK_UserID: data.fK_UserID,
              isAttachment: data.isAttachment,
              isStarred: data.isStarred,
              modifiedDate: data.modifiedDate,
              modifiedTime: data.modifiedTime,
              notesAttachments: data.notesAttachments,
              notesStatus: data.notesStatus,
              organizationName: data.organizationName,
              pK_NotesID: data.pK_NotesID,
              time: data.time,
              title: data.title,
              username: data.username,
            });
          });
          setNotes(notes);
        } else if (
          typeof NotesReducer.GetAllNotesResponse.getNotes === "object" &&
          Object.keys(NotesReducer.GetAllNotesResponse.getNotes).length > 0
        ) {
          console.log("check note empty state");
          let notes = [];
          NotesReducer.GetAllNotesResponse.getNotes.map((data, index) => {
            notes.push({
              date: data.date,
              description: data.description,
              fK_NotesStatus: data.fK_NotesStatus,
              fK_OrganizationID: data.fK_OrganizationID,
              fK_UserID: data.fK_UserID,
              isAttachment: data.isAttachment,
              isStarred: data.isStarred,
              modifiedDate: data.modifiedDate,
              modifiedTime: data.modifiedTime,
              notesAttachments: data.notesAttachments,
              notesStatus: data.notesStatus,
              organizationName: data.organizationName,
              pK_NotesID: data.pK_NotesID,
              time: data.time,
              title: data.title,
              username: data.username,
            });
          });
          setNotes(notes);
        } else {
          console.log("check note empty state");
          setNotes([]);
        }
        // if (Object.keys(NotesReducer.GetAllNotesResponse.getNotes).length > 0) {
        //   let notes = [];
        //   NotesReducer.GetAllNotesResponse.getNotes.map((data, index) => {
        //     notes.push({
        //       date: data.date,
        //       description: data.description,
        //       fK_NotesStatus: data.fK_NotesStatus,
        //       fK_OrganizationID: data.fK_OrganizationID,
        //       fK_UserID: data.fK_UserID,
        //       isAttachment: data.isAttachment,
        //       isStarred: data.isStarred,
        //       modifiedDate: data.modifiedDate,
        //       modifiedTime: data.modifiedTime,
        //       notesAttachments: data.notesAttachments,
        //       notesStatus: data.notesStatus,
        //       organizationName: data.organizationName,
        //       pK_NotesID: data.pK_NotesID,
        //       time: data.time,
        //       title: data.title,
        //       username: data.username,
        //     });
        //   });
        //   setNotes(notes);
        // } else {
        //   console.log("check note empty state");
        //   setNotes([]);
        // }
      } else {
        console.log("check note empty state");
        setNotes([]);
      }
    } catch (error) {
      console.log("check note empty state", error);
    }
  }, [NotesReducer.GetAllNotesResponse]);

  //for open Add User Notes Modal
  const modalAddUserModal = async (e) => {
    setAddNotes(true);
  };
  // for open Update User Notes Modal
  const editIconModal = async (id) => {
    console.log(id, "editIconModaleditIconModaleditIconModal");
    dispatch(
      GetNotesByIdAPI(
        navigate,
        id,
        t,
        setViewModalShow,
        setUpdateShow,
        setUpdateNotesModal,
        2
      )
    );
  };

  //for open View User Notes Modal
  const viewNotesModal = async (id, event) => {
    dispatch(
      GetNotesByIdAPI(
        navigate,
        id,
        t,
        setViewModalShow,
        setUpdateShow,
        setUpdateNotesModal,
        1
      )
    );
  };

  const ColorStarIcon = (id, index) => {
    setStarIcon(!showStarIcon);
  };

  const toggleAcordion = (notesID) => {
    console.log(notesID, "notesIDnotesIDnotesID");
    // setExpanded((prev) => (prev === notesID ? true : false));
    setExpand(!isExpand);
    setExpanded(notesID);
  };

  console.log(isExpanded, "isExpandedisExpandedisExpanded");

  const handelChangeNotesPagination = async (current, pageSize) => {
    localStorage.setItem("notesPage", current);
    localStorage.setItem("notesPageSize", pageSize);
    let Data = {
      UserID: parseInt(createrID),
      OrganizationID: JSON.parse(OrganizationID),
      Title: "",
      PageNumber: Number(current),
      Length: Number(pageSize),
    };
    dispatch(GetNotes(navigate, Data, t));
  };

  useEffect(() => {
    console.log("NotesReducerNotesReducer", NotesReducer.ResponseMessage);
    if (
      NotesReducer.ResponseMessage !== "" &&
      NotesReducer.ResponseMessage !== t("Data-available") &&
      NotesReducer.ResponseMessage !== t("No-data-available")
    ) {
      setOpen({
        open: true,
        message: NotesReducer.ResponseMessage,
      });

      setTimeout(() => {
        dispatch(ClearNotesResponseMessage());
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 4000);
    }
  }, [NotesReducer.ResponseMessage]);

  // Function to convert Arabic numerals to Arabic text
  const convertToArabicText = (number) => {
    const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
    const arabicText = number
      .toString()
      .replace(/\d/g, (d) => arabicNumbers[d]);
    return arabicText;
  };
  return (
    <>
      <div className={styles["notescontainer"]}>
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12} className="d-flex gap-4 ">
            <h1 className={styles["notes-heading-size"]}>{t("Notes")}</h1>

            <Button
              text={t("Create-new-note")}
              icon={<Plus width={20} height={20} fontWeight={800} />}
              className={styles["create-note-btn"]}
              onClick={modalAddUserModal}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={12} className={styles["notesViewContainer"]}>
            {/* Test Accordian Body Starts  */}
            {notes.length > 0 && notes !== null && notes !== undefined ? (
              notes.map((data, index) => {
                return (
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <Accordion
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        className={styles["notes_accordion"]}
                        expanded={
                          isExpanded === JSON.parse(data?.pK_NotesID) &&
                          isExpand
                            ? true
                            : false
                        }
                        key={data?.pK_NotesID}
                        // onChange={handleChangeExpanded(data?.pK_NotesID)}
                      >
                        <AccordionSummary
                          disableRipple={true}
                          disableTouchRipple={true}
                          focusRipple={false}
                          radioGroup={false}
                          IconButtonProps={{
                            onClick: () =>
                              toggleAcordion(JSON.parse(data?.pK_NotesID)),
                          }}
                          expandIcon={
                            isExpanded === JSON.parse(data?.pK_NotesID) &&
                            isExpand ? (
                              <img
                                draggable="false"
                                src={MinusExpand}
                                className={styles["MinusIcon"]}
                                alt=""
                              />
                            ) : (
                              <img
                                draggable="false"
                                src={PlusExpand}
                                alt=""
                                className={styles["PlusIcon"]}
                              />
                            )
                          }
                          aria-controls="panel1a-content"
                          className="TestAccordian position-relative"
                        >
                          <Row>
                            <Col lg={6} md={6} sm={12}>
                              <div
                                className={
                                  styles["header-of-collapse-material"]
                                }
                              >
                                <span
                                  className="cursor-pointer"
                                  onClick={() =>
                                    viewNotesModal(data?.pK_NotesID)
                                  }
                                >
                                  {data.title.slice(0, 100)}
                                </span>
                              </div>
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={12}
                              className="d-flex gap-3 align-items-center"
                            >
                              <span
                                onClick={() =>
                                  ColorStarIcon(data?.pK_NotesID, index)
                                }
                              >
                                {data.isStarred ? (
                                  <img
                                    draggable="false"
                                    src={hollowstar}
                                    width="15.86px"
                                    alt=""
                                    height="15.19px"
                                    className={
                                      styles["starIcon-In-Collapse-material"]
                                    }
                                  />
                                ) : (
                                  <img
                                    draggable="false"
                                    src={StarIcon}
                                    width="15.86px"
                                    height="15.19px"
                                    alt=""
                                    className={
                                      styles["starIcon-In-Collapse-material"]
                                    }
                                  />
                                )}
                              </span>
                              {data?.isAttachment ? (
                                <span>
                                  <img
                                    draggable="false"
                                    alt=""
                                    src={ClipIcon}
                                    width="15.96px"
                                    height="14.68px"
                                    className={
                                      styles["attachIcon-In-Collapse-material"]
                                    }
                                  />
                                </span>
                              ) : (
                                <span>
                                  <img draggable="false" width={15} alt="" />
                                </span>
                              )}

                              <span
                                className={
                                  styles["collapse-text-attached-material"]
                                }
                              >
                                {`${_justShowDateformat(
                                  data?.modifiedDate + data?.modifiedTime
                                )} ${" | "} ${_justShowDay(
                                  data?.modifiedDate + data?.modifiedTime
                                )}`}
                              </span>
                              {/* <img draggable="false"
                                src={EditIconNote}
                                width={17}
                                alt=""
                                className={
                                  styles["editIcon-In-Collapse-material"]
                                }
                                onClick={() => editIconModal(data?.pK_NotesID)}
                              /> */}
                            </Col>

                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              className={`${"d-flex justify-content-end align-items-center"} 
                              `}
                            >
                              <img
                                draggable="false"
                                src={EditIconNote}
                                width={17}
                                alt=""
                                className={
                                  styles["editIcon-In-Collapse-material"]
                                }
                                onClick={() => editIconModal(data?.pK_NotesID)}
                              />
                            </Col>
                          </Row>
                        </AccordionSummary>

                        <AccordionDetails key={index}>
                          <Row>
                            <Col
                              sm={12}
                              lg={12}
                              md={12}
                              className={styles["NotesAttachments"]}
                            >
                              {data?.notesAttachments.length > 0
                                ? data?.notesAttachments.map((file, index) => {
                                    var ext = file.displayAttachmentName
                                      .split(".")
                                      .pop();
                                    const first =
                                      file.displayAttachmentName.split(" ")[0];

                                    return (
                                      <Col
                                        sm={12}
                                        lg={2}
                                        md={2}
                                        className={
                                          styles["notes-attachment-icon"]
                                        }
                                      >
                                        {ext === "doc" ? (
                                          <FileIcon
                                            extension={"docx"}
                                            size={78}
                                            type={"document"}
                                            labelColor={"rgba(44, 88, 152)"}
                                          />
                                        ) : ext === "docx" ? (
                                          <FileIcon
                                            extension={"docx"}
                                            size={78}
                                            type={"font"}
                                            labelColor={"rgba(44, 88, 152)"}
                                          />
                                        ) : ext === "xls" ? (
                                          <FileIcon
                                            extension={"xls"}
                                            type={"spreadsheet"}
                                            size={78}
                                            labelColor={"rgba(16, 121, 63)"}
                                          />
                                        ) : ext === "xlsx" ? (
                                          <FileIcon
                                            extension={"xls"}
                                            type={"spreadsheet"}
                                            size={78}
                                            labelColor={"rgba(16, 121, 63)"}
                                          />
                                        ) : ext === "pdf" ? (
                                          <FileIcon
                                            extension={"pdf"}
                                            size={78}
                                            {...defaultStyles.pdf}
                                          />
                                        ) : ext === "png" ? (
                                          <FileIcon
                                            extension={"png"}
                                            size={78}
                                            type={"image"}
                                            labelColor={"rgba(102, 102, 224)"}
                                          />
                                        ) : ext === "txt" ? (
                                          <FileIcon
                                            extension={"txt"}
                                            size={78}
                                            type={"document"}
                                            labelColor={"rgba(52, 120, 199)"}
                                          />
                                        ) : ext === "jpg" ? (
                                          <FileIcon
                                            extension={"jpg"}
                                            size={78}
                                            type={"image"}
                                            labelColor={"rgba(102, 102, 224)"}
                                          />
                                        ) : ext === "jpeg" ? (
                                          <FileIcon
                                            extension={"jpeg"}
                                            size={78}
                                            type={"image"}
                                            labelColor={"rgba(102, 102, 224)"}
                                          />
                                        ) : ext === "gif" ? (
                                          <FileIcon
                                            extension={"gif"}
                                            size={78}
                                            {...defaultStyles.gif}
                                          />
                                        ) : (
                                          <FileIcon
                                            extension={ext}
                                            size={78}
                                            {...defaultStyles.ext}
                                          />
                                        )}

                                        <p
                                          className={
                                            styles["notes-attachment-text"]
                                          }
                                        >
                                          {first}
                                        </p>
                                      </Col>
                                    );
                                  })
                                : null}
                            </Col>
                          </Row>
                        </AccordionDetails>
                      </Accordion>
                    </Col>
                  </Row>
                );
              })
            ) : (
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className={styles["emptyNotesState"]}
                >
                  <img draggable="false" src={NotesMainEmpty} alt="" />
                  <p className={styles["emptystatetext"]}>
                    {t("Notes-you-add-appear-here")}
                  </p>
                </Col>
              </Row>
            )}
          </Col>
          <Col
            sm={12}
            md={12}
            lg={12}
            className="d-flex justify-content-center my-3 pagination-groups-table"
          >
            {notes !== null && notes !== undefined && notes.length > 0 ? (
              <>
                <CustomPagination
                  current={
                    notesPage !== null && notesPage !== undefined
                      ? notesPage
                      : 1
                  }
                  showSizer={true}
                  pageSizeOptionsValues={["30", "50", "100", "200"]}
                  onChange={handelChangeNotesPagination}
                  total={totalRecords}
                  pageSize={notesPagesize !== null ? notesPagesize : 50}
                  className={styles["PaginationStyle-Notes"]}
                />
              </>
            ) : null}
          </Col>
        </Row>
        {/* Test Accordian Ends  */}
      </div>
      {addNotes ? (
        <ModalAddNote addNewModal={addNotes} setAddNewModal={setAddNotes} />
      ) : null}

      {updateShow ? (
        <ModalUpdateNote
          updateNotes={updateShow}
          setUpdateNotes={setUpdateShow}
        />
      ) : null}

      {viewModalShow ? (
        <ModalViewNote
          viewNotes={viewModalShow}
          setViewNotes={setViewModalShow}
        />
      ) : null}
      <Notification message={open.message} open={open.open} setOpen={setOpen} />
      {NotesReducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default Notes;
