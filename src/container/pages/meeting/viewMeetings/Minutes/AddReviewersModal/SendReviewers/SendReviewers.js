import React, { useState, useEffect, useRef } from "react";
import styles from "./SendReviewers.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Col, Row } from "react-bootstrap";
import {
  AttachmentViewer,
  Checkbox,
} from "../../../../../../../components/elements";
import AttachmentIcon from "./../../../../../../../assets/images/AttachmentIcon.png";
import {
  EditSingleMinute,
  UpdateMinuteFlag,
} from "../../../../../../../store/actions/Minutes_action";
import TickIcon from "./../../../../../../../assets/images/Tick-Icon.png";
import { useTranslation } from "react-i18next";
import { GetAllAssigneesToDoList } from "../../../../../../../store/actions/ToDoList_action";
import Avatar from "./../../../../../../../assets/images/avatar.png";
import EditMinute from "./../../Images/Edit-Minute.png";

const SendReviewers = ({
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
  checkIsCheckAll,
  setCheckIsCheckAll,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let createrID = localStorage.getItem("userID");

  const { MinutesReducer } = useSelector((state) => state);

  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  const [totalIds, setTotalIds] = useState([]);

  const showHideDetails = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const editMinuteFunction = (record, data) => {
    setSelectMinutes(false);
    setSelectReviewers(false);
    setSendReviewers(false);
    setEditReviewer(true);
    setMinuteToEdit(record);
    dispatch(EditSingleMinute(data));
    dispatch(UpdateMinuteFlag(true));
  };

  const findUserProfileImg = (userId, users) => {
    const user = users.find((user) => user.userID === userId);
    return user ? user.userProfileImg : "";
  };

  function updateReviewersList(state, updatedMinute) {
    try {
      // Create a deep copy of the state to avoid mutating the original state
      const newState = JSON.parse(JSON.stringify(state));

      // Helper function to update reviewersList
      const updateMinuteData = (minuteData) => {
        return minuteData.map((minute) => {
          if (minute.minuteID === updatedMinute.minuteID) {
            return {
              ...minute,
              reviewersList: updatedMinute.reviewersList,
            };
          }
          return minute;
        });
      };

      // Update reviewersList in minuteData
      newState.forEach((agenda) => {
        agenda.minuteData = updateMinuteData(agenda.minuteData);

        // Update reviewersList in subMinutes
        agenda.subMinutes.forEach((subMinute) => {
          subMinute.minuteData = updateMinuteData(subMinute.minuteData);
        });
      });

      return newState;
    } catch (error) {
      console.error("Error updating reviewers list:", error);
      return state; // Return the original state if an error occurs
    }
  }

  function updateReviewersListInMinutes(minutes, updatedMinute) {
    try {
      // Create a deep copy of the minutes array to avoid mutating the original array
      const updatedMinutes = minutes.map((minute) => {
        if (minute.minuteID === updatedMinute.minuteID) {
          return {
            ...minute,
            reviewersList: updatedMinute.reviewersList,
          };
        }
        return minute;
      });

      return updatedMinutes;
    } catch {}
  }

  const handleSelectAll = (checked) => {
    try {
      if (checked) {
        // Combine all minute IDs from both agenda and general data into a single array
        const agendaMinuteIDs = minuteDataAgenda.flatMap((item) => [
          ...item.minuteData.map((subItem) => subItem.minuteID),
          ...item.subMinutes.flatMap((subItem) =>
            subItem.minuteData.map((subSubItem) => subSubItem.minuteID)
          ),
        ]);

        const generalMinuteIDs = minuteDataGeneral.map((item) => item.minuteID);

        const allMinuteIDs = [...agendaMinuteIDs, ...generalMinuteIDs];
        setTotalIds(
          minuteDataAgenda.reduce((acc, item) => {
            const agendaMinuteIDs = [
              ...item.minuteData.map((subItem) => subItem.minuteID),
              ...item.subMinutes.flatMap((subItem) =>
                subItem.minuteData.map((subSubItem) => subSubItem.minuteID)
              ),
            ];
            return acc + agendaMinuteIDs.length;
          }, 0) + minuteDataGeneral.length
        );
        setSelectedMinuteIDs(allMinuteIDs);
      } else {
        setSelectedMinuteIDs([]);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleParentCheckboxChangeAgenda = (checked, agendaID) => {
    if (checked) {
      // Add all minute IDs from minuteData for the given agendaID to selectedMinuteIDs
      const agenda = minuteDataAgenda.find(
        (item) => item.agendaID === agendaID
      );
      if (agenda) {
        const allMinuteIDs = agenda.minuteData.map((item) => item.minuteID);
        setSelectedMinuteIDs([...selectedMinuteIDs, ...allMinuteIDs]);
      }
    } else {
      // Remove all minute IDs from minuteData for the given agendaID from selectedMinuteIDs
      const agenda = minuteDataAgenda.find(
        (item) => item.agendaID === agendaID
      );
      if (agenda) {
        const filteredIDs = selectedMinuteIDs.filter(
          (id) => !agenda.minuteData.some((item) => item.minuteID === id)
        );
        setSelectedMinuteIDs(filteredIDs);
      }
    }
  };

  const handleParentCheckboxChangeSubMinutes = (checked, agendaID) => {
    if (checked) {
      // Add all minute IDs from subMinutes for the given agendaID to selectedMinuteIDs
      const agenda = minuteDataAgenda.find(
        (item) => item.agendaID === agendaID
      );
      if (agenda) {
        const allMinuteIDs = agenda.subMinutes.flatMap((subItem) =>
          subItem.minuteData.map((subData) => subData.minuteID)
        );
        setSelectedMinuteIDs([...selectedMinuteIDs, ...allMinuteIDs]);
      }
    } else {
      // Remove all minute IDs from subMinutes for the given agendaID from selectedMinuteIDs
      const agenda = minuteDataAgenda.find(
        (item) => item.agendaID === agendaID
      );
      if (agenda) {
        const filteredIDs = selectedMinuteIDs.filter(
          (id) =>
            !agenda.subMinutes.some((subItem) =>
              subItem.minuteData.some((subData) => subData.minuteID === id)
            )
        );
        setSelectedMinuteIDs(filteredIDs);
      }
    }
  };

  const handleChildCheckboxChangeAgenda = (checked, minuteID) => {
    if (checked) {
      setSelectedMinuteIDs([...selectedMinuteIDs, minuteID]);
    } else {
      setSelectedMinuteIDs(selectedMinuteIDs.filter((id) => id !== minuteID));
    }
  };

  const handleChildCheckboxChangeSubMinutes = (checked, minuteID) => {
    if (checked) {
      setSelectedMinuteIDs([...selectedMinuteIDs, minuteID]);
    } else {
      setSelectedMinuteIDs(selectedMinuteIDs.filter((id) => id !== minuteID));
    }
  };

  const handleParentCheckboxChange = (checked) => {
    try {
      if (checked) {
        // Add all minute IDs from minuteDataGeneral to selectedMinuteIDs
        const allMinuteIDs = minuteDataGeneral.map((item) => item.minuteID);
        setSelectedMinuteIDs([...selectedMinuteIDs, ...allMinuteIDs]);
      } else {
        // Remove all minute IDs from minuteDataGeneral from selectedMinuteIDs
        const filteredIDs = selectedMinuteIDs.filter(
          (id) => !minuteDataGeneral.some((item) => item.minuteID === id)
        );
        setSelectedMinuteIDs(filteredIDs);
      }
    } catch {}
  };

  const handleChildCheckboxChange = (checked, minuteID) => {
    try {
      if (checked) {
        setSelectedMinuteIDs([...selectedMinuteIDs, minuteID]);
      } else {
        setSelectedMinuteIDs(selectedMinuteIDs.filter((id) => id !== minuteID));
      }
    } catch {}
  };

  const checkIsChecked = (minuteDataAgenda, minuteDataGeneral) => {
    // Function to check if all minuteData items are checked
    const allChecked = (data) => {
      return data.every((item) => item.isChecked);
    };

    // Recursive function to check agenda data
    const checkAgenda = (agenda) => {
      for (let item of agenda) {
        if (!item.isChecked && item.minuteData.length > 0) {
          return false;
        }

        if (item.minuteData.length > 0 && !allChecked(item.minuteData)) {
          return false;
        }

        if (item.subMinutes && !checkAgenda(item.subMinutes)) {
          return false;
        }
      }
      return true;
    };

    // Check minuteDataAgenda
    if (!checkAgenda(minuteDataAgenda)) {
      return false;
    }

    // Check minuteDataGeneral
    if (!allChecked(minuteDataGeneral)) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    let result = checkIsChecked(minuteDataAgenda, minuteDataGeneral);
    setCheckIsCheckAll(result);
  }, []);

  useEffect(() => {
    const checkIfTruncated = () => {
      const element = textRef.current;
      if (element) {
        setIsTruncated(element.scrollWidth > element.clientWidth);
      }
    };

    checkIfTruncated();
    window.addEventListener("resize", checkIfTruncated);

    return () => {
      window.removeEventListener("resize", checkIfTruncated);
    };
  }, []);

  useEffect(() => {
    if (MinutesReducer.UpdateMinuteFlag === true) {
      if (isAgendaMinute) {
        const updatedMinuteData = updateReviewersList(
          minuteDataAgenda,
          minuteToEdit
        );
        setMinuteDataAgenda(updatedMinuteData);
        console.log("Updated State after modification:", updatedMinuteData);
      } else {
        const newMinutes = updateReviewersListInMinutes(
          minuteDataGeneral,
          minuteToEdit
        );
        setMinuteDataGeneral(newMinutes);
        console.log("Updated State after modification:", newMinutes);
      }
    } else {
    }
  }, [MinutesReducer.UpdateMinuteFlag]);

  console.log("agendaData", minuteDataAgenda);
  console.log("generalData", minuteDataGeneral);
  console.log("checkIsCheckAll", checkIsCheckAll);

  return (
    <>
      {checkIsCheckAll ? null : (
        <Row>
          <Col lg={11} md={11} sm={12}>
            <Checkbox
              label2Class={styles["SelectAll"]}
              label2={t("Select-all-minutes")}
              className="SearchCheckbox "
              name="IsChat"
              classNameDiv={styles["selectAllMinutesCheckbox"]}
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={
                selectedMinuteIDs.length > 0 &&
                selectedMinuteIDs.length === totalIds
              }
            />
          </Col>
          <Col lg={1} md={1} sm={12}></Col>
        </Row>
      )}
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className={styles["height-manage-minutes"]}>
            {minuteDataAgenda !== null ? (
              <>
                {minuteDataAgenda.map((data, index) => {
                  return (
                    <div key={index}>
                      {data.isChecked && moreMinutes === false ? (
                        <Row>
                          <Col
                            lg={11}
                            md={11}
                            sm={12}
                            className="position-relative"
                          >
                            <div className={styles["agendaTitleCheckbox"]}>
                              <img
                                className={styles["titleTick"]}
                                src={TickIcon}
                                alt=""
                              />
                              <p className={styles["agenda-title"]}>
                                {data.agendaTitle}
                              </p>
                            </div>
                          </Col>
                        </Row>
                      ) : (
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <Checkbox
                              label2Class={styles["agenda-title"]}
                              label2={data.agendaTitle}
                              className="SearchCheckbox"
                              name="IsChat"
                              classNameDiv={styles["agendaTitleToCheckbox"]}
                              onChange={(e) =>
                                handleParentCheckboxChangeAgenda(
                                  e.target.checked,
                                  data.agendaID
                                )
                              }
                              checked={data.minuteData.every((item) =>
                                selectedMinuteIDs.includes(item.minuteID)
                              )}
                            />
                          </Col>
                        </Row>
                      )}
                      {data.isParentData === false ? null : (
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            {data.minuteData.map((parentMinutedata, index) => {
                              const isTruncated =
                                !expandedItems[parentMinutedata.minuteID];
                              const reviewerId =
                                parentMinutedata?.reviewersList?.[0] ?? null;

                              const profileImg = findUserProfileImg(
                                reviewerId,
                                allReviewers
                              );
                              return (
                                <div className={styles["agendaTitleCheckbox"]}>
                                  {parentMinutedata.isChecked ? (
                                    <Row key={parentMinutedata.minuteID}>
                                      <Col
                                        lg={11}
                                        md={11}
                                        sm={12}
                                        className="position-relative"
                                      >
                                        <img
                                          className={styles["minuteTick"]}
                                          src={TickIcon}
                                          alt=""
                                        />
                                        <div
                                          className={styles["minuteWrapper"]}
                                        >
                                          <Row>
                                            <Col
                                              className="pr-0"
                                              lg={10}
                                              md={10}
                                              sm={12}
                                            >
                                              <span
                                                ref={textRef}
                                                className={
                                                  isTruncated
                                                    ? "m-0 text-truncate description"
                                                    : "m-0"
                                                }
                                                dangerouslySetInnerHTML={{
                                                  __html:
                                                    parentMinutedata.description,
                                                }}
                                              ></span>{" "}
                                              <Row>
                                                {(isTruncated &&
                                                  parentMinutedata.attachments
                                                    .length === 0) ||
                                                (isTruncated &&
                                                  parentMinutedata.attachments
                                                    .length > 0)
                                                  ? null
                                                  : parentMinutedata.attachments.map(
                                                      (filesData, index) => {
                                                        return (
                                                          <Col
                                                            lg={3}
                                                            md={3}
                                                            sm={12}
                                                            className="mx-2"
                                                          >
                                                            <AttachmentViewer
                                                              id={0}
                                                              name={
                                                                filesData.fileName
                                                              }
                                                            />
                                                          </Col>
                                                        );
                                                      }
                                                    )}
                                              </Row>
                                            </Col>
                                            <Col
                                              className="d-flex justify-content-end align-items-end gap-2"
                                              lg={2}
                                              md={2}
                                              sm={12}
                                            >
                                              <span
                                                onClick={() =>
                                                  showHideDetails(
                                                    parentMinutedata.minuteID
                                                  )
                                                }
                                                className={
                                                  styles["view-details"]
                                                }
                                              >
                                                {isTruncated
                                                  ? t("View-details")
                                                  : t("Hide-details")}
                                              </span>
                                              {parentMinutedata.attachments &&
                                                parentMinutedata.attachments
                                                  .length > 0 && (
                                                  <img
                                                    width={17}
                                                    height={16}
                                                    src={AttachmentIcon}
                                                    alt=""
                                                  />
                                                )}
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                      <Col lg={1} md={1} sm={12}>
                                        <div
                                          className={
                                            styles["image-profile-wrapper"]
                                          }
                                        >
                                          <div className="position-relative">
                                            <img
                                              height={32}
                                              width={32}
                                              className={styles["image-style"]}
                                              src={
                                                profileImg
                                                  ? `data:image/jpeg;base64,${profileImg}`
                                                  : Avatar
                                              }
                                              alt=""
                                            />
                                            {parentMinutedata.reviewersList
                                              .length > 1 ? (
                                              <span
                                                className={
                                                  styles["reviewer-count"]
                                                }
                                              >
                                                {"+" +
                                                  parentMinutedata.reviewersList
                                                    .length}
                                              </span>
                                            ) : null}
                                          </div>
                                          <img
                                            height={32}
                                            width={32}
                                            className={"cursor-pointer"}
                                            src={EditMinute}
                                            onClick={() => {
                                              editMinuteFunction(
                                                parentMinutedata,
                                                data
                                              );
                                              setIsAgendaMinute(true);
                                            }}
                                            alt=""
                                          />
                                        </div>
                                      </Col>
                                    </Row>
                                  ) : (
                                    <Row>
                                      <Col lg={11} md={11} sm={12}>
                                        <Checkbox
                                          label2Class={
                                            styles["minuteParentLabel"]
                                          }
                                          label2={
                                            <>
                                              <div
                                                className={
                                                  styles["minuteWrapper"]
                                                }
                                              >
                                                <Row>
                                                  <Col
                                                    className="pr-0"
                                                    lg={10}
                                                    md={10}
                                                    sm={12}
                                                  >
                                                    <span
                                                      ref={textRef}
                                                      className={
                                                        isTruncated
                                                          ? "m-0 text-truncate description"
                                                          : "m-0"
                                                      }
                                                      dangerouslySetInnerHTML={{
                                                        __html:
                                                          parentMinutedata.description,
                                                      }}
                                                    ></span>
                                                    <Row>
                                                      {(isTruncated &&
                                                        parentMinutedata
                                                          .attachments
                                                          .length === 0) ||
                                                      (isTruncated &&
                                                        parentMinutedata
                                                          .attachments.length >
                                                          0)
                                                        ? null
                                                        : parentMinutedata.attachments.map(
                                                            (
                                                              filesData,
                                                              index
                                                            ) => {
                                                              return (
                                                                <Col
                                                                  lg={2}
                                                                  md={2}
                                                                  sm={12}
                                                                  className="mx-2"
                                                                >
                                                                  <AttachmentViewer
                                                                    id={0}
                                                                    name={
                                                                      filesData.fileName
                                                                    }
                                                                  />
                                                                </Col>
                                                              );
                                                            }
                                                          )}
                                                    </Row>
                                                  </Col>
                                                  <Col
                                                    className="d-flex justify-content-end align-items-end gap-2"
                                                    lg={2}
                                                    md={2}
                                                    sm={12}
                                                  >
                                                    <span
                                                      onClick={() =>
                                                        showHideDetails(
                                                          parentMinutedata.minuteID
                                                        )
                                                      }
                                                      className={
                                                        styles["view-details"]
                                                      }
                                                    >
                                                      {isTruncated
                                                        ? t("View-details")
                                                        : t("Hide-details")}
                                                    </span>
                                                    {parentMinutedata.attachments &&
                                                      parentMinutedata
                                                        .attachments.length >
                                                        0 && (
                                                        <img
                                                          width={17}
                                                          height={16}
                                                          src={AttachmentIcon}
                                                          alt=""
                                                        />
                                                      )}
                                                  </Col>
                                                </Row>
                                              </div>
                                            </>
                                          }
                                          className="SearchCheckbox"
                                          name={`minute-${parentMinutedata.minuteID}`}
                                          onChange={(e) =>
                                            handleChildCheckboxChangeAgenda(
                                              e.target.checked,
                                              parentMinutedata.minuteID
                                            )
                                          }
                                          checked={selectedMinuteIDs.includes(
                                            parentMinutedata.minuteID
                                          )}
                                          classNameDiv={
                                            styles["agendaTitleToCheckbox"]
                                          }
                                        />
                                      </Col>
                                    </Row>
                                  )}
                                </div>
                              );
                            })}
                          </Col>
                        </Row>
                      )}
                      {data.subMinutes && data.subMinutes.length > 0
                        ? data.subMinutes.map((subagendaMinuteData, index) => {
                            return (
                              <Row
                                key={index}
                                className={
                                  subagendaMinuteData.isChecked
                                    ? "mb-25 ml-25"
                                    : "ml-25"
                                }
                              >
                                <Col lg={12} md={12} sm={12}>
                                  {subagendaMinuteData.isChecked === true &&
                                  (subagendaMinuteData.minuteData.length > 0 ||
                                    moreMinutes === false) ? (
                                    <Row>
                                      <Col
                                        lg={11}
                                        md={11}
                                        sm={12}
                                        className="position-relative"
                                      >
                                        <div
                                          className={
                                            styles["agendaTitleCheckbox"]
                                          }
                                        >
                                          {" "}
                                          <img
                                            className={styles["titleTick"]}
                                            src={TickIcon}
                                            alt=""
                                          />
                                          <p className={styles["agenda-title"]}>
                                            {subagendaMinuteData.agendaTitle}
                                          </p>
                                        </div>
                                      </Col>
                                    </Row>
                                  ) : subagendaMinuteData.isChecked === false &&
                                    (subagendaMinuteData.minuteData.length >
                                      0 ||
                                      moreMinutes === true) ? (
                                    <Checkbox
                                      label2Class={styles["agenda-title"]}
                                      label2={subagendaMinuteData.agendaTitle}
                                      className="SearchCheckbox"
                                      name="IsChat"
                                      onChange={(e) =>
                                        handleParentCheckboxChangeSubMinutes(
                                          e.target.checked,
                                          data.agendaID
                                        )
                                      }
                                      checked={subagendaMinuteData.minuteData.every(
                                        (item) =>
                                          selectedMinuteIDs.includes(
                                            item.minuteID
                                          )
                                      )}
                                      classNameDiv={
                                        styles["agendaTitleToCheckbox"]
                                      }
                                    />
                                  ) : null}
                                  {subagendaMinuteData.minuteData &&
                                    subagendaMinuteData.minuteData.length > 0 &&
                                    subagendaMinuteData.minuteData.map(
                                      (subItem, subIndex) => {
                                        const isTruncated =
                                          !expandedItems[subItem.minuteID];
                                        const reviewerId =
                                          subItem?.reviewersList?.[0] ?? null;

                                        const profileImg = findUserProfileImg(
                                          reviewerId,
                                          allReviewers
                                        );
                                        return (
                                          <Row>
                                            {subItem.isChecked ? (
                                              <>
                                                {" "}
                                                <Col lg={11} md={11} sm={12}>
                                                  <div
                                                    className={`${styles["agendaTitleCheckbox"]} position-relative`}
                                                  >
                                                    <img
                                                      className={
                                                        styles["minuteTick"]
                                                      }
                                                      src={TickIcon}
                                                      alt=""
                                                    />
                                                    <div
                                                      className={
                                                        styles["minuteWrapper"]
                                                      }
                                                    >
                                                      <Row>
                                                        <Col
                                                          className="pr-0"
                                                          lg={10}
                                                          md={10}
                                                          sm={12}
                                                        >
                                                          <span
                                                            ref={textRef}
                                                            className={
                                                              isTruncated
                                                                ? "m-0 text-truncate description"
                                                                : "m-0"
                                                            }
                                                            dangerouslySetInnerHTML={{
                                                              __html:
                                                                subItem.description,
                                                            }}
                                                          ></span>
                                                          <Row>
                                                            {(isTruncated &&
                                                              subItem
                                                                .attachments
                                                                .length ===
                                                                0) ||
                                                            (isTruncated &&
                                                              subItem
                                                                .attachments
                                                                .length > 0)
                                                              ? null
                                                              : subItem.attachments.map(
                                                                  (
                                                                    filesData,
                                                                    index
                                                                  ) => {
                                                                    return (
                                                                      <Col
                                                                        lg={3}
                                                                        md={3}
                                                                        sm={12}
                                                                        className="mx-2"
                                                                      >
                                                                        <AttachmentViewer
                                                                          id={0}
                                                                          name={
                                                                            filesData.fileName
                                                                          }
                                                                        />
                                                                      </Col>
                                                                    );
                                                                  }
                                                                )}
                                                          </Row>
                                                        </Col>
                                                        <Col
                                                          className="d-flex justify-content-end align-items-end gap-2"
                                                          lg={2}
                                                          md={2}
                                                          sm={12}
                                                        >
                                                          <span
                                                            onClick={() =>
                                                              showHideDetails(
                                                                subItem.id
                                                              )
                                                            }
                                                            className={
                                                              styles[
                                                                "view-details"
                                                              ]
                                                            }
                                                          >
                                                            {isTruncated
                                                              ? t(
                                                                  "View-details"
                                                                )
                                                              : t(
                                                                  "Hide-details"
                                                                )}
                                                          </span>
                                                          {subItem.attachments &&
                                                            subItem.attachments
                                                              .length > 0 && (
                                                              <img
                                                                width={17}
                                                                height={16}
                                                                src={
                                                                  AttachmentIcon
                                                                }
                                                                alt=""
                                                              />
                                                            )}
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </div>
                                                </Col>
                                                <Col lg={1} md={1} sm={12}>
                                                  <div
                                                    className={
                                                      styles[
                                                        "image-profile-wrapper"
                                                      ]
                                                    }
                                                  >
                                                    <div className="position-relative">
                                                      <img
                                                        height={32}
                                                        width={32}
                                                        className={
                                                          styles["image-style"]
                                                        }
                                                        src={
                                                          profileImg
                                                            ? `data:image/jpeg;base64,${profileImg}`
                                                            : Avatar
                                                        }
                                                        alt=""
                                                      />
                                                      {subItem.reviewersList
                                                        .length > 1 ? (
                                                        <span
                                                          className={
                                                            styles[
                                                              "reviewer-count"
                                                            ]
                                                          }
                                                        >
                                                          {"+" +
                                                            subItem
                                                              .reviewersList
                                                              .length}
                                                        </span>
                                                      ) : null}
                                                    </div>
                                                    <img
                                                      height={32}
                                                      width={32}
                                                      className={
                                                        "cursor-pointer"
                                                      }
                                                      src={EditMinute}
                                                      onClick={() => {
                                                        editMinuteFunction(
                                                          subItem,
                                                          subagendaMinuteData
                                                        );
                                                        setIsAgendaMinute(true);
                                                      }}
                                                      alt=""
                                                    />
                                                  </div>
                                                </Col>
                                              </>
                                            ) : (
                                              <Col lg={11} md={11} sm={12}>
                                                <Checkbox
                                                  key={subItem.minuteID}
                                                  label2Class={
                                                    styles["minuteParentLabel"]
                                                  }
                                                  label2={
                                                    <>
                                                      <div
                                                        className={
                                                          styles[
                                                            "minuteWrapper"
                                                          ]
                                                        }
                                                      >
                                                        <Row>
                                                          <Col
                                                            className="pr-0"
                                                            lg={10}
                                                            md={10}
                                                            sm={12}
                                                          >
                                                            {/* <p
                                                  ref={textRef}
                                                  className={
                                                    isTruncated
                                                      ? "m-0 text-truncate"
                                                      : "m-0"
                                                  }
                                                >
                                                  {
                                                    subItem.description
                                                  }
                                                </p> */}
                                                            <span
                                                              ref={textRef}
                                                              className={
                                                                isTruncated
                                                                  ? "m-0 text-truncate description"
                                                                  : "m-0"
                                                              }
                                                              dangerouslySetInnerHTML={{
                                                                __html:
                                                                  subItem.description,
                                                              }}
                                                            ></span>
                                                            <Row>
                                                              {(isTruncated &&
                                                                subItem
                                                                  .attachments
                                                                  .length ===
                                                                  0) ||
                                                              (isTruncated &&
                                                                subItem
                                                                  .attachments
                                                                  .length > 0)
                                                                ? null
                                                                : subItem.attachments.map(
                                                                    (
                                                                      filesData,
                                                                      index
                                                                    ) => {
                                                                      return (
                                                                        <Col
                                                                          lg={2}
                                                                          md={2}
                                                                          sm={
                                                                            12
                                                                          }
                                                                          className="mx-2"
                                                                        >
                                                                          <AttachmentViewer
                                                                            id={
                                                                              0
                                                                            }
                                                                            name={
                                                                              filesData.fileName
                                                                            }
                                                                          />
                                                                        </Col>
                                                                      );
                                                                    }
                                                                  )}
                                                            </Row>
                                                          </Col>
                                                          <Col
                                                            className="d-flex justify-content-end align-items-end gap-2"
                                                            lg={2}
                                                            md={2}
                                                            sm={12}
                                                          >
                                                            <span
                                                              onClick={() =>
                                                                showHideDetails(
                                                                  subItem.minuteID
                                                                )
                                                              }
                                                              className={
                                                                styles[
                                                                  "view-details"
                                                                ]
                                                              }
                                                            >
                                                              {isTruncated
                                                                ? t(
                                                                    "View-details"
                                                                  )
                                                                : t(
                                                                    "Hide-details"
                                                                  )}
                                                            </span>
                                                            {subItem.attachments &&
                                                              subItem
                                                                .attachments
                                                                .length > 0 && (
                                                                <img
                                                                  width={17}
                                                                  height={16}
                                                                  src={
                                                                    AttachmentIcon
                                                                  }
                                                                  alt=""
                                                                />
                                                              )}
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </>
                                                  }
                                                  className="SearchCheckbox"
                                                  name={`minute-${subItem.minuteID}`}
                                                  onChange={(e) =>
                                                    handleChildCheckboxChangeSubMinutes(
                                                      e.target.checked,
                                                      subItem.minuteID
                                                    )
                                                  }
                                                  checked={selectedMinuteIDs.includes(
                                                    subItem.minuteID
                                                  )}
                                                  classNameDiv={
                                                    styles[
                                                      "agendaTitleToCheckbox"
                                                    ]
                                                  }
                                                />
                                              </Col>
                                            )}
                                          </Row>
                                        );
                                      }
                                    )}
                                </Col>
                              </Row>
                            );
                          })
                        : null}
                    </div>
                  );
                })}
              </>
            ) : null}

            {minuteDataGeneral !== null ? (
              <>
                {moreMinutes === false ? (
                  <Row>
                    <Col lg={12} md={12} sm={12} className="position-relative">
                      <div className={styles["agendaTitleCheckbox"]}>
                        <img
                          className={styles["titleTick"]}
                          src={TickIcon}
                          alt=""
                        />
                        <p className={styles["agenda-title"]}>
                          {t("General-Minutes")}
                        </p>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        label2Class={styles["agenda-title"]}
                        label2={t("General-minutes")}
                        className="SearchCheckbox "
                        name="IsChat"
                        onChange={(e) =>
                          handleParentCheckboxChange(e.target.checked)
                        }
                        checked={minuteDataGeneral.every((item) =>
                          selectedMinuteIDs.includes(item.minuteID)
                        )}
                        classNameDiv={styles["agendaTitleToCheckbox"]}
                      />
                    </Col>
                  </Row>
                )}
                {minuteDataGeneral.map((data, index) => {
                  const isTruncated = !expandedItems[data.minuteID];
                  const reviewerId = data?.reviewersList?.[0] ?? null;
                  const profileImg = findUserProfileImg(
                    reviewerId,
                    allReviewers
                  );
                  return (
                    <div className={styles["agendaTitleCheckbox"]}>
                      {data.isChecked ? (
                        <Row key={data.id}>
                          <Col
                            lg={11}
                            md={11}
                            sm={12}
                            className="position-relative"
                          >
                            <img
                              className={styles["minuteTick"]}
                              src={TickIcon}
                              alt=""
                            />
                            <div className={styles["minuteWrapper"]}>
                              <Row>
                                <Col className="pr-0" lg={10} md={10} sm={12}>
                                  <span
                                    ref={textRef}
                                    className={
                                      isTruncated
                                        ? "m-0 text-truncate description"
                                        : "m-0"
                                    }
                                    dangerouslySetInnerHTML={{
                                      __html: data.description,
                                    }}
                                  ></span>
                                  <Row>
                                    {(isTruncated &&
                                      data.attachments.length === 0) ||
                                    (isTruncated && data.attachments.length > 0)
                                      ? null
                                      : data.attachments.map(
                                          (filesData, index) => {
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
                                <Col
                                  className="d-flex justify-content-end align-items-end gap-2"
                                  lg={2}
                                  md={2}
                                  sm={12}
                                >
                                  <span
                                    onClick={() => showHideDetails(data.id)}
                                    className={styles["view-details"]}
                                  >
                                    {isTruncated
                                      ? t("View-details")
                                      : t("Hide-details")}
                                  </span>
                                  {data.attachments &&
                                    data.attachments.length > 0 && (
                                      <img
                                        width={17}
                                        height={16}
                                        src={AttachmentIcon}
                                        alt=""
                                      />
                                    )}
                                </Col>
                              </Row>
                            </div>
                          </Col>
                          <Col lg={1} md={1} sm={12}>
                            <div className={styles["image-profile-wrapper"]}>
                              <div className="position-relative">
                                <img
                                  height={32}
                                  width={32}
                                  className={styles["image-style"]}
                                  alt=""
                                  src={
                                    profileImg
                                      ? `data:image/jpeg;base64,${profileImg}`
                                      : Avatar
                                  }
                                />
                                {data.reviewersList.length > 1 ? (
                                  <span className={styles["reviewer-count"]}>
                                    {"+" + data.reviewersList.length}
                                  </span>
                                ) : null}
                              </div>
                              <img
                                height={32}
                                width={32}
                                className={"cursor-pointer"}
                                src={EditMinute}
                                onClick={() => {
                                  editMinuteFunction(data, data);
                                  setIsAgendaMinute(false);
                                }}
                                alt=""
                              />
                            </div>
                          </Col>
                        </Row>
                      ) : (
                        <Col lg={11} md={11} sm={12}>
                          <Checkbox
                            label2Class={styles["minuteParentLabel"]}
                            label2={
                              <>
                                <div className={styles["minuteWrapper"]}>
                                  <Row>
                                    <Col
                                      className="pr-0"
                                      lg={10}
                                      md={10}
                                      sm={12}
                                    >
                                      <span
                                        ref={textRef}
                                        className={
                                          isTruncated
                                            ? "m-0 text-truncate description"
                                            : "m-0"
                                        }
                                        dangerouslySetInnerHTML={{
                                          __html: data.description,
                                        }}
                                      ></span>

                                      <Row>
                                        {(isTruncated &&
                                          data.attachments.length === 0) ||
                                        (isTruncated &&
                                          data.attachments.length > 0)
                                          ? null
                                          : data.attachments.map(
                                              (filesData, index) => {
                                                return (
                                                  <Col
                                                    lg={2}
                                                    md={2}
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
                                    <Col
                                      className="d-flex justify-content-end align-items-end gap-2"
                                      lg={2}
                                      md={2}
                                      sm={12}
                                    >
                                      {isTruncated ? (
                                        <>
                                          <span
                                            onClick={() =>
                                              showHideDetails(data.minuteID)
                                            }
                                            className={styles["view-details"]}
                                          >
                                            {t("View-details")}
                                          </span>
                                          {data.attachments.length !== 0 ? (
                                            <img
                                              width={17}
                                              height={16}
                                              src={AttachmentIcon}
                                              alt=""
                                            />
                                          ) : null}
                                        </>
                                      ) : (
                                        <>
                                          <span
                                            onClick={() =>
                                              showHideDetails(data.minuteID)
                                            }
                                            className={styles["view-details"]}
                                          >
                                            {t("Hide-details")}
                                          </span>
                                          {data.attachments.length !== 0 ? (
                                            <img
                                              width={17}
                                              height={16}
                                              src={AttachmentIcon}
                                              alt=""
                                            />
                                          ) : null}
                                        </>
                                      )}
                                    </Col>
                                  </Row>
                                </div>
                              </>
                            }
                            className="SearchCheckbox "
                            name={`minute-${data.minuteID}`}
                            onChange={(e) =>
                              handleChildCheckboxChange(
                                e.target.checked,
                                data.minuteID
                              )
                            }
                            checked={selectedMinuteIDs.includes(data.minuteID)}
                            classNameDiv={styles["agendaTitleToCheckbox"]}
                          />
                        </Col>
                      )}
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SendReviewers;
