import React, { useState, useEffect, useRef } from "react";
import styles from "./EditReviewers.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Col, Row } from "react-bootstrap";
import {
  AttachmentViewer,
  Checkbox,
} from "../../../../../../../components/elements";
import AttachmentIcon from "./../../../../../../../assets/images/AttachmentIcon.png";
import TickIcon from "./../../../../../../../assets/images/Tick-Icon.png";
import { useTranslation } from "react-i18next";
import { GetAllAssigneesToDoList } from "../../../../../../../store/actions/ToDoList_action";

const EditReviewers = ({
  selectMinutes,
  setSelectMinutes,
  selectReviewers,
  setSelectReviewers,
  sendReviewers,
  setSendReviewers,
  editReviewer,
  setEditReviewer,
  minuteToEdit,
  setMinuteToEdit,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let createrID = localStorage.getItem("userID");

  const { MinutesReducer, toDoListReducer } = useSelector((state) => state);

  const [minutesDataAgenda, setMinutesDataAgenda] = useState([]);
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  const [allReviewers, setAllReviewers] = useState([]);

  useEffect(() => {
    if (
      MinutesReducer.allMinutesAG !== undefined &&
      MinutesReducer.allMinutesAG !== null &&
      MinutesReducer.allMinutesAG.length !== 0
    ) {
      setMinutesDataAgenda(MinutesReducer.allMinutesAG.agendaWise);
    } else {
      setMinutesDataAgenda([]);
    }
    return () => {
      setMinutesDataAgenda([]);
    };
  }, [MinutesReducer.allMinutesAG]);

  useEffect(() => {
    dispatch(GetAllAssigneesToDoList(navigate, Number(createrID), t));
  }, []);

  useEffect(() => {
    if (
      toDoListReducer.AllAssigneesData !== null &&
      toDoListReducer.AllAssigneesData !== undefined &&
      toDoListReducer.AllAssigneesData.length !== 0 &&
      Object.keys(toDoListReducer.AllAssigneesData).length !== 0
    ) {
      setAllReviewers(toDoListReducer.AllAssigneesData);
    }
    return () => {
      setAllReviewers([]);
    };
  }, [toDoListReducer.AllAssigneesData]);

  console.log("minuteToEditminuteToEdit", minuteToEdit);

  return (
    <>
      <Row>
        <Col lg={9} md={9} sm={12} className="mt-16p">
          <div className={styles["height-manage-minutes"]}>
            <>
              <div>
                <Row>
                  <Col lg={12} md={12} sm={12} className="position-relative">
                    <div className={styles["agendaTitleCheckbox"]}>
                      <img
                        className={styles["titleTick"]}
                        src={TickIcon}
                        alt=""
                      />
                      <p className={styles["agenda-title"]}>Dummy Title</p>
                    </div>
                  </Col>
                </Row>
                <div className={styles["agendaTitleCheckbox"]}>
                  <Row key={minuteToEdit.id}>
                    <Col lg={12} md={12} sm={12} className="position-relative">
                      <img
                        className={styles["minuteTick"]}
                        src={TickIcon}
                        alt=""
                      />
                      <div className={styles["minuteWrapper"]}>
                        <Row>
                          <Col className="pr-0" lg={10} md={10} sm={12}>
                            <p className="m-0">{minuteToEdit.description}</p>
                            <Row>
                              {(isTruncated &&
                                minuteToEdit.attachments.length === 0) ||
                              (isTruncated &&
                                minuteToEdit.attachments.length > 0)
                                ? null
                                : minuteToEdit.attachments.map(
                                    (filesData, index) => {
                                      console.log(
                                        "filesDatafilesData",
                                        filesData
                                      );
                                      return (
                                        <Col
                                          lg={3}
                                          md={3}
                                          sm={12}
                                          className="mx-2"
                                        >
                                          <AttachmentViewer
                                            id={0}
                                            name={filesData.fileName}
                                          />
                                        </Col>
                                      );
                                    }
                                  )}
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </>
          </div>
        </Col>
        <Col lg={3} md={3} sm={12} className={`${styles["leftBorder"]} mt-16n`}>
          <p className={styles["add-reviewers"]}>{t("Add-reviewers")}</p>
          <div className={styles["list-height"]}>
            <Checkbox
              label2Class={styles["SelectAll"]}
              label2={t("Select-all-reviewers")}
              className="SearchCheckbox "
              name="IsChat"
              // checked={selectAll}
              // onChange={(event) => SelectAllFunc(event)}
              classNameDiv={`${styles["addReviewersCheckbox"]} margin-top-10`}
            />
            {allReviewers.map((data, index) => {
              return (
                <div className={styles["profile-wrapper"]}>
                  <Checkbox
                    label2Class={styles["SelectAll"]}
                    label2={
                      <>
                        <div className={styles["image-profile-wrapper"]}>
                          <img
                            height={32}
                            width={32}
                            className={styles["image-style"]}
                            src={`data:image/jpeg;base64,${data.displayProfilePictureName}`}
                            alt=""
                          />
                          <span>{data.name}</span>
                        </div>
                      </>
                    }
                    className="SearchCheckbox "
                    name="IsChat"
                    // checked={selectAll}
                    // onChange={(event) => SelectAllFunc(event)}
                    classNameDiv={styles["addReviewersCheckbox"]}
                  />
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default EditReviewers;
