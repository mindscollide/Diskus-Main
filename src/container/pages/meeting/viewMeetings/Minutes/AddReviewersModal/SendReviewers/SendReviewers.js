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
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let createrID = localStorage.getItem("userID");

  const { MinutesReducer, toDoListReducer } = useSelector((state) => state);

  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  const [allReviewers, setAllReviewers] = useState([]);

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

  console.log("MinutesReducerMinutesReducer", MinutesReducer);

  return (
    <>
      <Row>
        <Col lg={11} md={11} sm={12}>
          <Checkbox
            label2Class={styles["SelectAll"]}
            label2={t("Select-all-minutes")}
            className="SearchCheckbox "
            name="IsChat"
            classNameDiv={styles["selectAllMinutesCheckbox"]}
          />
        </Col>
        <Col lg={1} md={1} sm={12}></Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className={styles["height-manage-minutes"]}>
            {minuteDataAgenda !== null ? (
              <>
                {minuteDataAgenda.map((data, index) => {
                  console.log("minutesDataAgendaminutesDataAgenda", data);
                  return (
                    <div key={index}>
                      {data.isChecked ? (
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
                      ) : null}
                      {data.isParentData === false ? null : (
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            {data.minuteData.map((parentMinutedata, index) => {
                              const isTruncated =
                                !expandedItems[parentMinutedata.minuteID];
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
                                              editMinuteFunction(
                                                parentMinutedata
                                              )
                                            }
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
                                          // onChange={(e) =>
                                          //   handleChildCheckboxChangeAgenda(
                                          //     e.target.checked,
                                          //     parentMinutedata.minuteID
                                          //   )
                                          // }
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
                                    : ""
                                }
                              >
                                <Col lg={12} md={12} sm={12}>
                                  {subagendaMinuteData.isChecked ? (
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
                                  ) : null}
                                  {subagendaMinuteData.minuteData &&
                                    subagendaMinuteData.minuteData.length > 0 &&
                                    subagendaMinuteData.minuteData.map(
                                      (subItem, subIndex) => {
                                        const isTruncated =
                                          !expandedItems[subItem.minuteID];
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
                                                        src={Avatar}
                                                        alt=""
                                                      />
                                                      <span
                                                        className={
                                                          styles[
                                                            "reviewer-count"
                                                          ]
                                                        }
                                                      >
                                                        +3
                                                      </span>
                                                    </div>
                                                    <img
                                                      height={32}
                                                      width={32}
                                                      className={
                                                        "cursor-pointer"
                                                      }
                                                      src={EditMinute}
                                                      onClick={() =>
                                                        editMinuteFunction(
                                                          subagendaMinuteData
                                                        )
                                                      }
                                                      alt=""
                                                    />
                                                  </div>
                                                </Col>
                                              </>
                                            ) : (
                                              <Col lg={12} md={12} sm={12}>
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
                                                                      console.log(
                                                                        "filesDatafilesData",
                                                                        filesData
                                                                      );
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
                                                  // onChange={(e) =>
                                                  //   handleChildCheckboxChangeSubMinutes(
                                                  //     e.target.checked,
                                                  //     minuteDataSubminute.minuteID
                                                  //   )
                                                  // }
                                                  // checked={selectedMinuteIDs.includes(
                                                  //   minuteDataSubminute.minuteID
                                                  // )}
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
                {minuteDataGeneral.map((data, index) => {
                  const isTruncated = !expandedItems[data.minuteID];
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
                                  src={Avatar}
                                  alt=""
                                />
                                <span className={styles["reviewer-count"]}>
                                  +3
                                </span>
                              </div>
                              <img
                                height={32}
                                width={32}
                                className={"cursor-pointer"}
                                src={EditMinute}
                                onClick={() => editMinuteFunction(data)}
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
                            // onChange={(e) =>
                            //   handleChildCheckboxChange(
                            //     e.target.checked,
                            //     data.minuteID
                            //   )
                            // }
                            // checked={selectedMinuteIDs.includes(data.minuteID)}
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
