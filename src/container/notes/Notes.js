import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import styles from "./Notes.module.css";
import NotesMainEmpty from "../../assets/images/NotesMain_Empty.svg";
import ModalViewNote from "./modalViewNote/ModalViewNote";
import ModalAddNote from "./modalAddNote/ModalAddNote";
import ModalUpdateNote from "./modalUpdateNote/ModalUpdateNote";
import ClipIcon from "../../assets/images/AttachmentNotes.svg";
import StarIcon from "../../assets/images/Star.svg";
import hollowstar from "../../assets/images/Hollowstar.svg";
import PlusExpand from "../../assets/images/Plus-notesExpand.svg";
import MinusExpand from "../../assets/images/close-accordion.svg";
import EditIconNote from "../../assets/images/EditIconNotes.svg";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Plus } from "react-bootstrap-icons";
import {
  AttachmentViewer,
  Button,
  Notification,
} from "../../components/elements";
import { Tooltip } from "antd";
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
import CustomAccordion from "../../components/elements/accordian/CustomAccordion";
import { showMessage } from "../../components/elements/snack_bar/utill";
const Notes = () => {
  //Test Accordian states start
  const [updateNotesModal, setUpdateNotesModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NotesReducer } = useSelector((state) => state);
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
    severity: "error",
  });
  const [showStarIcon, setStarIcon] = useState(false);
  // for modal Update notes
  const [updateShow, setUpdateShow] = useState(false);
  const [notes, setNotes] = useState([]);
  //for view modal notes
  const [viewModalShow, setViewModalShow] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
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
    } catch (error) {
      console.log(error, "error");
    }
  }, []);

  // render Notes Data
  useEffect(() => {
    try {
      if (
        NotesReducer.GetAllNotesResponse !== null &&
        NotesReducer.GetAllNotesResponse !== undefined
      ) {
        setTotalRecords(NotesReducer.GetAllNotesResponse.totalRecords);
        if (NotesReducer.GetAllNotesResponse.getNotes === null) {
          setNotes([]);
        } else if (
          Array.isArray(NotesReducer.GetAllNotesResponse.getNotes) &&
          NotesReducer.GetAllNotesResponse.getNotes.length > 0
        ) {
          let notes = [];
          NotesReducer.GetAllNotesResponse.getNotes.map((data) => {
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
          let notes = [];
          NotesReducer.GetAllNotesResponse.getNotes.map((data) => {
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
          setNotes([]);
        }
      } else {
        setNotes([]);
      }
    } catch (error) {}
  }, [NotesReducer.GetAllNotesResponse]);

  //for open Add User Notes Modal
  const modalAddUserModal = async (e) => {
    setAddNotes(true);
  };
  // for open Update User Notes Modal
  const editIconModal = async (id) => {
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

  const handleClickExpand = (number) => {
    if (isExpanded === number) {
      setExpanded(false);
    } else {
      setExpanded(number);
    }
  };

  useEffect(() => {
    try {
      if (
        NotesReducer.ResponseMessage !== "" &&
        NotesReducer.ResponseMessage !== t("No-data-available")
      ) {
        showMessage(NotesReducer.ResponseMessage, "success", setOpen);
        dispatch(ClearNotesResponseMessage());
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [NotesReducer.ResponseMessage]);

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
                console.log(data, "datdayaminyamin");
                return (
                  <CustomAccordion
                    StartField={data.title}
                    isExpand={isExpanded}
                    notesID={data.pK_NotesID}
                    handleClickTitleNotes={() =>
                      viewNotesModal(data?.pK_NotesID)
                    }
                    centerField={
                      <>
                        {" "}
                        {data.isStarred ? (
                          <Tooltip placement="bottomLeft" title={t("Starred")}>
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
                          </Tooltip>
                        ) : (
                          <Tooltip
                            placement="bottomLeft"
                            title={t("Unstarred")}
                          >
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
                          </Tooltip>
                        )}
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
                          className={styles["collapse-text-attached-material"]}
                        >
                          {`${_justShowDateformat(
                            data?.modifiedDate + data?.modifiedTime
                          )} ${" | "} ${_justShowDay(
                            data?.modifiedDate + data?.modifiedTime
                          )}`}
                        </span>
                      </>
                    }
                    endField={
                      <>
                        {data.notesAttachments.length > 0 && (
                          <>
                            {isExpanded === JSON.parse(data?.pK_NotesID) ? (
                              <span
                                className={styles["MinusIcon_span"]}
                                onClick={() =>
                                  handleClickExpand(data?.pK_NotesID)
                                }
                              >
                                <img
                                  draggable="false"
                                  src={MinusExpand}
                                  className={styles["MinusIcon"]}
                                  alt=""
                                />
                              </span>
                            ) : (
                              <span
                                className={styles["PlusIcon_span"]}
                                onClick={() =>
                                  handleClickExpand(data?.pK_NotesID)
                                }
                              >
                                <img
                                  draggable="false"
                                  src={PlusExpand}
                                  alt=""
                                  className={styles["PlusIcon"]}
                                  onClick={() =>
                                    handleClickExpand(data?.pK_NotesID)
                                  }
                                />
                              </span>
                            )}
                          </>
                        )}
                        <Tooltip placement="bottomLeft" title={t("Edit")}>
                          <img
                            draggable="false"
                            src={EditIconNote}
                            width={17}
                            alt=""
                            className={styles["editIcon-In-Collapse-material"]}
                            onClick={() => editIconModal(data?.pK_NotesID)}
                          />
                        </Tooltip>
                      </>
                    }
                    attachmentsRow={
                      <>
                        {isExpanded === data?.pK_NotesID && (
                          <Row>
                            <Col
                              sm={12}
                              lg={12}
                              md={12}
                              className={styles["NotesAttachments"]}
                            >
                              {data?.notesAttachments.length > 0
                                ? data?.notesAttachments.map((file) => {
                                    return (
                                      <AttachmentViewer
                                        data={file}
                                        id={0}
                                        name={file.displayAttachmentName}
                                      />
                                    );
                                  })
                                : null}
                            </Col>
                          </Row>
                        )}
                      </>
                    }
                  />
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
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
    </>
  );
};

export default Notes;
