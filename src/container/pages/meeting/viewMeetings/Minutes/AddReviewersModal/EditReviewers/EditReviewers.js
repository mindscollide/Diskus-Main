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
  setMinuteDataAgenda,
  minuteDataAgenda,
  setMinuteDataGeneral,
  minuteDataGeneral,
  selectedMinuteIDs,
  setSelectedMinuteIDs,
  selectReviewersArray,
  setSelectReviewersArray,
  minuteToEdit,
  setMinuteToEdit,
  allReviewers,
  setAllReviewers,
  isAgendaMinute,
  setIsAgendaMinute,
  moreMinutes,
  setMoreMinutes,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let createrID = localStorage.getItem("userID");

  const { MinutesReducer, toDoListReducer } = useSelector((state) => state);

  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(true);

  const [selectedReviewersToEdit, setSelectedReviewersToEdit] = useState(
    minuteToEdit.reviewersList
  );
  const [selectAll, setSelectAll] = useState(false);

  // Handle individual checkbox change
  const handleCheckboxChange = (userID) => {
    setSelectedReviewersToEdit((prevSelected) => {
      const newSelected = prevSelected.includes(userID)
        ? prevSelected.filter((id) => id !== userID)
        : [...prevSelected, userID];
      setMinuteToEdit({ ...minuteToEdit, reviewersList: newSelected });
      return newSelected;
    });
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allIDs = allReviewers.map((reviewer) => reviewer.userID);
      setSelectedReviewersToEdit(allIDs);
      setMinuteToEdit({ ...minuteToEdit, reviewersList: allIDs });
    } else {
      setSelectedReviewersToEdit([]);
      setMinuteToEdit({ ...minuteToEdit, reviewersList: [] });
    }
  };

  // Update selectAll state based on selectedReviewers
  useEffect(() => {
    setSelectAll(selectedReviewersToEdit.length === allReviewers.length);
  }, [selectedReviewersToEdit, allReviewers]);

  console.log("Minute Data General Edit Reviewer", minuteDataGeneral);
  console.log("Minute Data Agenda Edit Reviewer", minuteDataAgenda);

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
                      <p className={styles["agenda-title"]}>
                        {MinutesReducer?.EditSingleMinuteData?.agendaTitle ||
                          t("General-minute")}
                      </p>
                    </div>
                  </Col>
                </Row>
                <div className={styles["agendaTitleCheckbox"]}>
                  <Row key={minuteToEdit.minuteID}>
                    <Col lg={12} md={12} sm={12} className="position-relative">
                      <img
                        className={styles["minuteTick"]}
                        src={TickIcon}
                        alt=""
                      />
                      <div className={styles["minuteWrapper"]}>
                        <Row>
                          <Col className="pr-0" lg={10} md={10} sm={12}>
                            <span
                              className="text-truncate description m-0"
                              dangerouslySetInnerHTML={{
                                __html: minuteToEdit.description,
                              }}
                            ></span>
                            <Row>
                              {(isTruncated &&
                                minuteToEdit.attachments.length === 0) ||
                              (isTruncated &&
                                minuteToEdit.attachments.length > 0)
                                ? null
                                : minuteToEdit.attachments.map(
                                    (filesData, index) => {
                                      return (
                                        <Col
                                          lg={3}
                                          md={3}
                                          sm={12}
                                          className="mx-2"
                                        >
                                          <AttachmentViewer
                                            id={filesData.pK_FileID}
                                            name={filesData.displayFileName}
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
              classNameDiv={`${styles["addReviewersCheckbox"]} margin-top-10`}
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            {allReviewers.map((data, index) => {
              return (
                <div className={styles["profile-wrapper"]}>
                  <Checkbox
                    checked={selectedReviewersToEdit.includes(data.userID)}
                    onChange={() => handleCheckboxChange(data.userID)}
                    label2Class={styles["SelectAll"]}
                    label2={
                      <>
                        <div className={styles["image-profile-wrapper"]}>
                          <img
                            height={32}
                            width={32}
                            className={styles["image-style"]}
                            src={`data:image/jpeg;base64,${data.userProfileImg}`}
                            alt=""
                          />
                          <span>{data.userName}</span>
                        </div>
                      </>
                    }
                    className="SearchCheckbox "
                    name="IsChat"
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
