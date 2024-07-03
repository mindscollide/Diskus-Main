import React, { useState, useEffect, useRef } from "react";
import styles from "./SelectMinutes.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Col, Row } from "react-bootstrap";
import {
  Button,
  Modal,
  Checkbox,
  AttachmentViewer,
} from "../../../../../../../components/elements";
import AttachmentIcon from "./../../../../../../../assets/images/AttachmentIcon.png";
import { useTranslation } from "react-i18next";

const SelectMinutes = ({
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
  setSelectReviewersArray,allReviewers, setAllReviewers
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { MinutesReducer } = useSelector((state) => state);

  // const [minutesDataAgenda, setMinutesDataAgenda] = useState([]);
  // const [minutesDataGeneral, setMinutesDataGeneral] = useState([]);
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

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

  const showHideDetails = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  console.log(
    "MinutesMinutesMinutesMinutes",
    minuteDataAgenda,
    minuteDataGeneral
  );

  const [totalIds, setTotalIds] = useState([]);

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

  console.log(
    "Lengths: ",
    totalIds,
    selectedMinuteIDs.length,
    selectedMinuteIDs.length > 0,
    selectedMinuteIDs.length === totalIds.length,
    selectedMinuteIDs.length > 0 && selectedMinuteIDs.length === totalIds
  );

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

  console.log("selectedMinutesselectedMinutes", selectedMinuteIDs);

  return (
    <>
      <Row className="mx-50">
        <Col
          lg={12}
          md={12}
          sm={12}
          className={`${styles["agendaViewerHeader"]} text-end `}
        >
          <Checkbox
            label2Class={styles["SelectAll"]}
            label2={t("Select-all-minutes")}
            className="SearchCheckbox "
            name="IsChat"
            onChange={(e) => handleSelectAll(e.target.checked)}
            checked={
              selectedMinuteIDs.length > 0 &&
              selectedMinuteIDs.length === totalIds
            }
            classNameDiv={styles["addReviewersCheckbox"]}
          />
        </Col>
      </Row>
      {/* Agenda Wise Minutes */}

      {minuteDataAgenda !== null ? (
        <>
          {minuteDataAgenda.map((data, index) => {
            console.log("minutesDataAgendaminutesDataAgenda", data);
            return (
              <div key={index}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Checkbox
                      label2Class={styles["agenda-title"]}
                      label2={data.agendaTitle}
                      className="SearchCheckbox"
                      name="IsChat"
                      classNameDiv={styles["agendaTitleCheckbox"]}
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
                {data.isParentData === false ? null : (
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      {data.minuteData.map((parentMinutedata, index) => {
                        const isTruncated =
                          !expandedItems[parentMinutedata.minuteID];
                        return (
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
                                          __html: parentMinutedata.description,
                                        }}
                                      ></span>
                                      <Row>
                                        {(isTruncated &&
                                          parentMinutedata.attachments
                                            .length === 0) ||
                                        (isTruncated &&
                                          parentMinutedata.attachments.length >
                                            0)
                                          ? null
                                          : parentMinutedata.attachments.map(
                                              (filesData, index) => {
                                                console.log(
                                                  "filesDatafilesData",
                                                  filesData
                                                );
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
                                      <span
                                        onClick={() =>
                                          showHideDetails(
                                            parentMinutedata.minuteID
                                          )
                                        }
                                        className={styles["view-details"]}
                                      >
                                        {isTruncated
                                          ? t("View-details")
                                          : t("Hide-details")}
                                      </span>
                                      {parentMinutedata.attachments &&
                                        parentMinutedata.attachments.length >
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
                            classNameDiv={styles["agendaTitleCheckbox"]}
                          />
                        );
                      })}
                    </Col>
                  </Row>
                )}
                {data.subMinutes && data.subMinutes.length > 0
                  ? data.subMinutes.map((subagendaMinuteData, index) => {
                      return (
                        <Row key={index} className="mb-25 ml-25">
                          <Col lg={12} md={12} sm={12}>
                            {subagendaMinuteData.minuteData.length > 0 ? (
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
                                    selectedMinuteIDs.includes(item.minuteID)
                                )}
                                classNameDiv={styles["agendaTitleCheckbox"]}
                              />
                            ) : null}
                            {subagendaMinuteData.minuteData.length > 0
                              ? subagendaMinuteData.minuteData.map(
                                  (minuteDataSubminute) => {
                                    const isTruncated =
                                      !expandedItems[
                                        minuteDataSubminute.minuteID
                                      ];
                                    return (
                                      <Checkbox
                                        key={minuteDataSubminute.minuteID}
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
                                                  {/* <p
                                                  ref={textRef}
                                                  className={
                                                    isTruncated
                                                      ? "m-0 text-truncate"
                                                      : "m-0"
                                                  }
                                                >
                                                  {
                                                    minuteDataSubminute.description
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
                                                        minuteDataSubminute.description,
                                                    }}
                                                  ></span>
                                                  <Row>
                                                    {(isTruncated &&
                                                      minuteDataSubminute
                                                        .attachments.length ===
                                                        0) ||
                                                    (isTruncated &&
                                                      minuteDataSubminute
                                                        .attachments.length > 0)
                                                      ? null
                                                      : minuteDataSubminute.attachments.map(
                                                          (
                                                            filesData,
                                                            index
                                                          ) => {
                                                            console.log(
                                                              "filesDatafilesData",
                                                              filesData
                                                            );
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
                                                        minuteDataSubminute.minuteID
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
                                                  {minuteDataSubminute.attachments &&
                                                    minuteDataSubminute
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
                                        name={`minute-${minuteDataSubminute.minuteID}`}
                                        onChange={(e) =>
                                          handleChildCheckboxChangeSubMinutes(
                                            e.target.checked,
                                            minuteDataSubminute.minuteID
                                          )
                                        }
                                        checked={selectedMinuteIDs.includes(
                                          minuteDataSubminute.minuteID
                                        )}
                                        classNameDiv={
                                          styles["agendaTitleCheckbox"]
                                        }
                                      />
                                    );
                                  }
                                )
                              : null}
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

      {/* General Mintues */}
      {minuteDataGeneral !== null ? (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Checkbox
                label2Class={styles["agenda-title"]}
                label2={t("General-minutes")}
                className="SearchCheckbox "
                name="IsChat"
                onChange={(e) => handleParentCheckboxChange(e.target.checked)}
                checked={minuteDataGeneral.every((item) =>
                  selectedMinuteIDs.includes(item.minuteID)
                )}
                classNameDiv={styles["agendaTitleCheckbox"]}
              />
            </Col>
          </Row>
          {minuteDataGeneral.map((data, index) => {
            const isTruncated = !expandedItems[data.minuteID];
            return (
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Checkbox
                    label2Class={styles["minuteParentLabel"]}
                    label2={
                      <>
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
                                  : data.attachments.map((filesData, index) => {
                                      console.log(
                                        "filesDatafilesData",
                                        filesData
                                      );
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
                                    })}
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
                      handleChildCheckboxChange(e.target.checked, data.minuteID)
                    }
                    checked={selectedMinuteIDs.includes(data.minuteID)}
                    classNameDiv={styles["agendaTitleCheckbox"]}
                  />
                </Col>
              </Row>
            );
          })}
        </>
      ) : null}
    </>
  );
};

export default SelectMinutes;
