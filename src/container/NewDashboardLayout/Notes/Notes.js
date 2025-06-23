import React, { useEffect, useState } from "react";
import styles from "./Notes.module.css";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import IconAttachment from "../../../assets/images/AttachmentNotes.svg";
import PlusButton from "../../../assets/images/PlusButton.svg";
import Notes_Empty from "../../../assets/images/Notes_Dashboard.png";
import { useDispatch } from "react-redux";
import {
  GetNotes,
  GetNotesByIdAPI,
  GetNotesById_Init,
  getNotes_Init,
} from "../../../store/actions/Notes_actions";
import ModalViewNote from "../../notes/modalViewNote/ModalViewNote";
import { Col, Row } from "react-bootstrap";
import { formatToLocalTimezone } from "../../../commen/functions/date_formater";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import { useNotesContext } from "../../../context/NotesContext";
const Notes = () => {
  const [notes, setNotes] = useState([]);
  const NotesReducer = useSelector((state) => state.NotesReducer);
  const { createNotesModal, setCreateNotesModal } = useNotesContext();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateNotesModalHomePage, setUpdateNotesModalHomePage] =
    useState(false);
  const [getNoteID, setGetNoteID] = useState(0);
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");

  const calApi = async () => {
    // Notes Feature
    if (checkFeatureIDAvailability(6)) {
      await dispatch(getNotes_Init());

      let Data = {
        UserID: parseInt(createrID),
        OrganizationID: JSON.parse(OrganizationID),
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isImages: false,
        isPDF: false,
        isVideos: false,
        isAudios: false,
        isSites: false,
        CreatedDate: "",
        PageNumber: 1,
        Length: 50,
      };

      dispatch(GetNotes(navigate, Data, t));
    }
  };

  useEffect(() => {
    calApi();
  }, []);
  const OpenUpdateNotesModal = async (id) => {
    setGetNoteID(id);
    await dispatch(GetNotesById_Init());
    dispatch(
      GetNotesByIdAPI(
        navigate,
        id,
        t,
        false,
        false,
        setUpdateNotesModalHomePage,
        3
      )
    );
  };
  // render Notes Data
  useEffect(() => {
    try {
      if (
        NotesReducer.GetAllNotesResponse !== null &&
        NotesReducer.GetAllNotesResponse !== undefined
      ) {
        if (NotesReducer.GetAllNotesResponse.getNotes.length > 0) {
          let notes = [];
          NotesReducer.GetAllNotesResponse.getNotes.map((data, index) => {
            notes.push(data);
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

  // render Notes Data
  useEffect(() => {
    try {
      if (
        NotesReducer.GetAllNotesResponse !== null &&
        NotesReducer.GetAllNotesResponse !== undefined
      ) {
        if (NotesReducer.GetAllNotesResponse.getNotes.length > 0) {
          let notes = [];
          NotesReducer.GetAllNotesResponse.getNotes.map((data, index) => {
            notes.push(data);
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

  return (
    <>
      <div className="d-flex justify-content-start mb-2 gap-3">
        <h1 className={styles["noteheading"]}>{t("Notes")}</h1>
        {checkFeatureIDAvailability(6) && (
          <img
            src={PlusButton}
            onClick={() => setCreateNotesModal(true)}
            className="cursor-pointer"
            alt=""
            draggable="false"
          />
        )}
      </div>
      <section className={styles["NotesDashboard"]}>
        {notes.length > 0 ? (
          notes.map((data, index) => {
            if (index <= 11) {
              return (
                <>
                  <div
                    className={styles["notesdescription"]}
                    key={data.pK_NotesID}
                    onClick={() => OpenUpdateNotesModal(data.pK_NotesID)}
                  >
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <p className={styles["notescontent"]}>
                          {data.title.slice(0, 100)}
                        </p>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex gap-2 align-items-center justify-content-between"
                      >
                        <span>
                          {data.isAttachment && (
                            <span>
                              <img
                                src={IconAttachment}
                                width="17.46px"
                                height="16.05px"
                                alt=""
                                draggable="false"
                              />
                            </span>
                          )}
                        </span>
                        <span className={styles["DataTimeDay"]}>
                          {formatToLocalTimezone(data.date + data.time)}
                        </span>
                      </Col>
                    </Row>
                  </div>
                </>
              );
            } else if (index === 12) {
              // Display a different message when index is 12
              return (
                <div key={index} className="d-flex justify-content-center">
                  <p
                    className={styles["ViewMoreLink_notes"]}
                    onClick={() => navigate("/Diskus/Notes")}
                  >
                    {t("View-more")}
                  </p>
                </div>
              );
            }
          })
        ) : (
          <>
            <Row>
              <Col
                sm={12}
                lg={12}
                md={12}
                className="d-flex justify-content-center align-items-center flex-column"
              >
                <img src={Notes_Empty} width={"40%"} alt="" draggable="false" />
                <p className={styles["emptystateNotesDashboard"]}>
                  {t("You-dont-have-any-notes")}
                </p>
              </Col>
            </Row>
          </>
        )}
      </section>
      {updateNotesModalHomePage && (
        <ModalViewNote
          viewNotes={updateNotesModalHomePage}
          setViewNotes={setUpdateNotesModalHomePage}
          flag={true}
          setGetNoteID={setGetNoteID}
        />
      )}
    </>
  );
};

export default Notes;
