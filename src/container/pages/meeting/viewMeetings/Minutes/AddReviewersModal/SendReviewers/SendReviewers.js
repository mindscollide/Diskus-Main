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
  minuteToEdit,
  setMinuteToEdit,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let createrID = localStorage.getItem("userID");

  const { MinutesReducer, toDoListReducer } = useSelector((state) => state);

  const [minutesDataAgenda, setMinutesDataAgenda] = useState([]);
  const [minutesDataGeneral, setMinutesDataGeneral] = useState([]);
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
      setMinutesDataGeneral(MinutesReducer.allMinutesAG.general);
    } else {
      setMinutesDataAgenda([]);
      setMinutesDataGeneral([]);
    }
    return () => {
      setMinutesDataAgenda([]);
      setMinutesDataGeneral([]);
    };
  }, [MinutesReducer.allMinutesAG]);

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

  const editMinuteFunction = (record) => {
    setSelectMinutes(false);
    setSelectReviewers(false);
    setSendReviewers(false);
    setEditReviewer(true);
    setMinuteToEdit(record);
  };

  console.log("allReviewersallReviewers", allReviewers);

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className={styles["height-manage-minutes"]}>
            <Row>
              <Col lg={11} md={11} sm={12}>
                <Checkbox
                  label2Class={styles["SelectAll"]}
                  label2={t("Select-all-minutes")}
                  className="SearchCheckbox "
                  name="IsChat"
                  // checked={checkAllMinutes}
                  //   checked={selectAll}
                  // onChange={handleCheckAll}
                  //   onChange={(event) => SelectAllFunc(event)}
                  classNameDiv={styles["selectAllMinutesCheckbox"]}
                />
              </Col>
              <Col lg={1} md={1} sm={12}></Col>
            </Row>
            {minutesDataAgenda.length > 0 ? (
              <>
                {minutesDataAgenda.map((data, index) => {
                  console.log("minutesDataAgendaminutesDataAgenda", data);
                  return (
                    <div key={index}>
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
                              {data.title}
                            </p>
                          </div>
                        </Col>
                      </Row>
                      {data.items.map((agendaMinuteData, index) => {
                        const isTruncated = !expandedItems[agendaMinuteData.id];
                        return (
                          <div className={styles["agendaTitleCheckbox"]}>
                            <Row key={agendaMinuteData.id}>
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
                                    <Col
                                      className="pr-0"
                                      lg={10}
                                      md={10}
                                      sm={12}
                                    >
                                      <p
                                        ref={textRef}
                                        className={
                                          isTruncated
                                            ? "m-0 text-truncate"
                                            : "m-0"
                                        }
                                      >
                                        {agendaMinuteData.description}
                                      </p>
                                      <Row>
                                        {(isTruncated &&
                                          agendaMinuteData.attachments
                                            .length === 0) ||
                                        (isTruncated &&
                                          agendaMinuteData.attachments.length >
                                            0)
                                          ? null
                                          : agendaMinuteData.attachments.map(
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
                                    <Col
                                      className="d-flex justify-content-end align-items-end gap-2"
                                      lg={2}
                                      md={2}
                                      sm={12}
                                    >
                                      <span
                                        onClick={() =>
                                          showHideDetails(agendaMinuteData.id)
                                        }
                                        className={styles["view-details"]}
                                      >
                                        {isTruncated
                                          ? t("View-details")
                                          : t("Hide-details")}
                                      </span>
                                      {agendaMinuteData.attachments &&
                                        agendaMinuteData.attachments.length >
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
                              </Col>
                              <Col lg={1} md={1} sm={12}>
                                <div
                                  className={styles["image-profile-wrapper"]}
                                >
                                  <img
                                    height={32}
                                    width={32}
                                    className={styles["image-style"]}
                                    src={Avatar}
                                    alt=""
                                  />
                                  <img
                                    onClick={() =>
                                      editMinuteFunction(agendaMinuteData)
                                    }
                                    height={32}
                                    width={32}
                                    className={"cursor-pointer"}
                                    src={EditMinute}
                                    alt=""
                                  />
                                </div>
                              </Col>
                            </Row>
                          </div>
                        );
                      })}
                      {data.subItems && data.subItems.length > 0
                        ? data.subItems.map((subagendaMinuteData, index) => (
                            <Row key={index} className="mb-25 ml-25">
                              <Col lg={12} md={12} sm={12}>
                                <Row>
                                  <Col
                                    lg={11}
                                    md={11}
                                    sm={12}
                                    className="position-relative"
                                  >
                                    <div
                                      className={styles["agendaTitleCheckbox"]}
                                    >
                                      {" "}
                                      <img
                                        className={styles["titleTick"]}
                                        src={TickIcon}
                                        alt=""
                                      />
                                      <p className={styles["agenda-title"]}>
                                        {subagendaMinuteData.title}
                                      </p>
                                    </div>
                                  </Col>
                                  <Col lg={1} md={1} sm={12}></Col>
                                </Row>
                                {subagendaMinuteData.items &&
                                  subagendaMinuteData.items.length > 0 &&
                                  subagendaMinuteData.items.map(
                                    (subItem, subIndex) => {
                                      const isTruncated =
                                        !expandedItems[subItem.id];
                                      return (
                                        <Row>
                                          <Col lg={11} md={11} sm={12}>
                                            <div
                                              className={`${styles["agendaTitleCheckbox"]} position-relative`}
                                            >
                                              <img
                                                className={styles["minuteTick"]}
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
                                                    <p
                                                      ref={textRef}
                                                      className={
                                                        isTruncated
                                                          ? "m-0 text-truncate"
                                                          : "m-0"
                                                      }
                                                    >
                                                      {subItem.description}
                                                    </p>
                                                    <Row>
                                                      {(isTruncated &&
                                                        subItem.attachments
                                                          .length === 0) ||
                                                      (isTruncated &&
                                                        subItem.attachments
                                                          .length > 0)
                                                        ? null
                                                        : subItem.attachments.map(
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
                                                        styles["view-details"]
                                                      }
                                                    >
                                                      {isTruncated
                                                        ? t("View-details")
                                                        : t("Hide-details")}
                                                    </span>
                                                    {subItem.attachments &&
                                                      subItem.attachments
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
                                                  className={
                                                    styles["image-style"]
                                                  }
                                                  src={Avatar}
                                                  alt=""
                                                />
                                                <span
                                                  className={
                                                    styles["reviewer-count"]
                                                  }
                                                >
                                                  +3
                                                </span>
                                              </div>
                                              <img
                                                height={32}
                                                width={32}
                                                className={"cursor-pointer"}
                                                src={EditMinute}
                                                onClick={() =>
                                                  editMinuteFunction(subItem)
                                                }
                                                alt=""
                                              />
                                            </div>
                                          </Col>
                                        </Row>
                                      );
                                    }
                                  )}
                              </Col>
                            </Row>
                          ))
                        : null}
                    </div>
                  );
                })}
              </>
            ) : null}
            {minutesDataGeneral.length > 0 ? (
              <>
                <Row>
                  <Col lg={11} md={11} sm={12}>
                    <Checkbox
                      label2Class={styles["agenda-title"]}
                      label2={t("General-minutes")}
                      className="SearchCheckbox "
                      name="IsChat"
                      //   checked={checkAllMinutes}
                      // checked={Object.values(checkedMinutes).every(Boolean)}
                      //   onChange={() => handleCheckAllGeneral(minutesDataGeneral)}
                      classNameDiv={styles["agendaTitleCheckboxGeneral"]}
                    />
                  </Col>
                  <Col lg={1} md={1} sm={12}></Col>
                </Row>
                {minutesDataGeneral.map((data, index) => {
                  const isTruncated = !expandedItems[data.id];
                  return (
                    <Row>
                      <Col lg={11} md={11} sm={12}>
                        <Checkbox
                          label2Class={styles["minuteParentLabel"]}
                          label2={
                            <>
                              <div className={styles["minuteWrapper"]}>
                                <Row>
                                  <Col className="pr-0" lg={10} md={10} sm={12}>
                                    <p
                                      ref={textRef}
                                      className={
                                        isTruncated
                                          ? "m-0 text-truncate"
                                          : "m-0"
                                      }
                                    >
                                      {data.description}
                                    </p>

                                    <Row>
                                      {(isTruncated &&
                                        data.attachments.length === 0) ||
                                      (isTruncated &&
                                        data.attachments.length > 0)
                                        ? null
                                        : data.attachments.map(
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
                                    {isTruncated ? (
                                      <>
                                        <span
                                          onClick={() =>
                                            showHideDetails(data.id)
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
                                            showHideDetails(data.id)
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
                          name={`minute-${data.id}`}
                          //   checked={checkBoxIds.includes(data)}
                          //   onChange={(e) =>
                          //     checkAllGeneralMinutes(data, minutesDataGeneral)
                          //   }
                          classNameDiv={styles["agendaTitleCheckboxGeneral"]}
                        />
                      </Col>
                    </Row>
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
