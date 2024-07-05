import React, { useState, useEffect, useRef } from "react";
import styles from "./SelectReviewers.module.css";
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
import { GetAllOrganizationUsersForReview } from "../../../../../../../store/actions/Minutes_action";

const SelectReviewers = ({
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
  allReviewers,
  setAllReviewers,
  isAgendaMinute,
  setIsAgendaMinute,
  moreMinutes,
  setMoreMinutes,
  newSelectedMinutes,
  setNewSelectedMinutes,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { MinutesReducer } = useSelector((state) => state);

  const [minutesDataAgenda, setMinutesDataAgenda] = useState([]);
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  const [checkAll, setCheckAll] = useState(false);

  const handleCheckAllChange = (e) => {
    const newCheckedList = e.target.checked
      ? allReviewers.map((r) => r.userID)
      : [];
    setSelectReviewersArray(newCheckedList);
    setCheckAll(e.target.checked);
  };

  const handleCheckboxChange = (userID) => {
    const newCheckedList = selectReviewersArray.includes(userID)
      ? selectReviewersArray.filter((id) => id !== userID)
      : [...selectReviewersArray, userID];

    setSelectReviewersArray(newCheckedList);
    setCheckAll(newCheckedList.length === allReviewers.length);
  };

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
    dispatch(GetAllOrganizationUsersForReview(navigate, t));
    return () => {
      setSelectReviewersArray([]);
      setSelectedMinuteIDs([]);
      setNewSelectedMinutes([]);
    };
  }, []);

  useEffect(() => {
    if (
      MinutesReducer.GetAllOrganizationUsersForReviewData !== null &&
      MinutesReducer.GetAllOrganizationUsersForReviewData !== undefined &&
      MinutesReducer.GetAllOrganizationUsersForReviewData.length !== 0 &&
      Object.keys(MinutesReducer.GetAllOrganizationUsersForReviewData)
        .length !== 0
    ) {
      setAllReviewers(
        MinutesReducer.GetAllOrganizationUsersForReviewData.organizationUsers
      );
    }
  }, [MinutesReducer.GetAllOrganizationUsersForReviewData]);

  const updateMinutes = (state1, state2, state3) => {
    const checkIds = new Set(state3);

    // Helper function to update minuteData selectively
    const updateMinuteData = (minuteData) => {
      return minuteData.map((minute) => {
        if (checkIds.has(minute.minuteID)) {
          return {
            ...minute,
            isChecked: true,
            reviewersList: [1195, 1199], // Example reviewersList, update as needed
          };
        }
        return minute;
      });
    };

    // Update first state
    const updatedState1 = state1.map((agenda) => {
      const updatedMinuteData = updateMinuteData(agenda.minuteData);
      const updatedSubMinutes = agenda.subMinutes.map((subMinute) => {
        const updatedSubMinuteData = updateMinuteData(subMinute.minuteData);
        const isSubMinuteChecked = updatedSubMinuteData.some(
          (minute) => minute.isChecked
        );

        return {
          ...subMinute,
          minuteData: updatedSubMinuteData,
          isChecked: isSubMinuteChecked,
        };
      });

      const isAgendaChecked =
        updatedMinuteData.some((minute) => minute.isChecked) ||
        updatedSubMinutes.some((subMinute) => subMinute.isChecked);

      return {
        ...agenda,
        minuteData: updatedMinuteData,
        subMinutes: updatedSubMinutes,
        isChecked: isAgendaChecked,
      };
    });

    // Update second state
    const updatedState2 = state2.map((minute) => {
      if (checkIds.has(minute.minuteID)) {
        return {
          ...minute,
          isChecked: true,
          reviewersList: [1195, 1199], // Example reviewersList, update as needed
        };
      }
      return minute;
    });

    return { updatedState1, updatedState2 };
  };

  useEffect(() => {
    try {
      if (moreMinutes === true) {
        const { updatedState1, updatedState2 } = updateMinutes(
          minuteDataAgenda,
          minuteDataGeneral,
          newSelectedMinutes
        );
        setMinuteDataAgenda(updatedState1);
        setMinuteDataGeneral(updatedState2);
      } else {
        const { updatedState1, updatedState2 } = updateMinutes(
          minuteDataAgenda,
          minuteDataGeneral,
          selectedMinuteIDs
        );
        setMinuteDataAgenda(updatedState1);
        setMinuteDataGeneral(updatedState2);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }, []);

  console.log("Minute Data General Select Reviewers", minuteDataGeneral);
  console.log("Minute Data Agenda Select Reviewers", minuteDataAgenda);

  const allUnchecked = (data) => {
    return data.every((item) => !item.isChecked);
  };

  return (
    <>
      <Row>
        <Col lg={9} md={9} sm={12} className="mt-16p">
          <div className={styles["height-manage-minutes"]}>
            {minuteDataAgenda !== null && moreMinutes === false ? (
              <>
                {minuteDataAgenda.map((data, index) => {
                  return (
                    <div key={index}>
                      {data.isChecked ? (
                        <Row>
                          <Col
                            lg={12}
                            md={12}
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
                            {data.minuteData
                              .filter(
                                (parentMinutedata) => parentMinutedata.isChecked
                              )
                              .map((parentMinutedata, index) => {
                                const isTruncated =
                                  !expandedItems[parentMinutedata.minuteID];
                                return (
                                  <div
                                    className={styles["agendaTitleCheckbox"]}
                                  >
                                    <Row key={parentMinutedata.minuteID}>
                                      <Col
                                        lg={12}
                                        md={12}
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
                                                              id={
                                                                filesData.pK_FileID
                                                              }
                                                              name={
                                                                filesData.displayFileName
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
                                    </Row>
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
                                        lg={12}
                                        md={12}
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
                                    subagendaMinuteData.minuteData
                                      .filter((subItem) => subItem.isChecked)
                                      .map((subItem, subIndex) => {
                                        const isTruncated =
                                          !expandedItems[subItem.minuteID];
                                        return (
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
                                                            return (
                                                              <Col
                                                                lg={3}
                                                                md={3}
                                                                sm={12}
                                                                className="mx-2"
                                                              >
                                                                <AttachmentViewer
                                                                  id={
                                                                    filesData.pK_FileID
                                                                  }
                                                                  name={
                                                                    filesData.displayFileName
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
                                                    subItem.attachments.length >
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
                                          </div>
                                        );
                                      })}
                                </Col>
                              </Row>
                            );
                          })
                        : null}
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {minuteDataAgenda.map((data, index) => {
                  return (
                    <div key={index}>
                      {data.isChecked ? (
                        <Row>
                          <Col
                            lg={12}
                            md={12}
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
                            {data.minuteData
                              .filter(
                                (parentMinutedata) =>
                                  parentMinutedata.isChecked &&
                                  parentMinutedata.reviewersList.length === 0
                              )
                              .map((parentMinutedata, index) => {
                                const isTruncated =
                                  !expandedItems[parentMinutedata.minuteID];
                                return (
                                  <div
                                    className={styles["agendaTitleCheckbox"]}
                                  >
                                    <Row key={parentMinutedata.minuteID}>
                                      <Col
                                        lg={12}
                                        md={12}
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
                                                              id={
                                                                filesData.pK_FileID
                                                              }
                                                              name={
                                                                filesData.displayFileName
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
                                    </Row>
                                  </div>
                                );
                              })}
                          </Col>
                        </Row>
                      )}
                      {data.subMinutes && data.subMinutes.length > 0
                        ? data.subMinutes.map((subagendaMinuteData, index) => {
                            let result = subagendaMinuteData.minuteData.every(
                              (subItem) => subItem.isChecked === true
                            );
                            console.log("resultresultresult", result);
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
                                  {subagendaMinuteData.isChecked && !result ? (
                                    <Row>
                                      <Col
                                        lg={12}
                                        md={12}
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
                                    subagendaMinuteData.minuteData
                                      .filter(
                                        (subItem) =>
                                          subItem.isChecked &&
                                          subItem.reviewersList.length === 0
                                      )
                                      .map((subItem, subIndex) => {
                                        const isTruncated =
                                          !expandedItems[subItem.minuteID];
                                        return (
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
                                                            return (
                                                              <Col
                                                                lg={3}
                                                                md={3}
                                                                sm={12}
                                                                className="mx-2"
                                                              >
                                                                <AttachmentViewer
                                                                  id={
                                                                    filesData.pK_FileID
                                                                  }
                                                                  name={
                                                                    filesData.displayFileName
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
                                                    subItem.attachments.length >
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
                                          </div>
                                        );
                                      })}
                                </Col>
                              </Row>
                            );
                          })
                        : null}
                    </div>
                  );
                })}
              </>
            )}

            {minuteDataGeneral !== null && moreMinutes === false ? (
              <>
                {minuteDataGeneral === null ? null : allUnchecked(
                    minuteDataGeneral
                  ) ? null : (
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
                )}
                {minuteDataGeneral
                  .filter((data) => data.isChecked)
                  .map((data, index) => {
                    const isTruncated = !expandedItems[data.minuteID];
                    return (
                      <div className={styles["agendaTitleCheckbox"]}>
                        <Row key={data.id}>
                          <Col
                            lg={12}
                            md={12}
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
                                                  id={filesData.pK_FileID}
                                                  name={
                                                    filesData.displayFileName
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
                        </Row>
                      </div>
                    );
                  })}
              </>
            ) : (
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
                {minuteDataGeneral
                  .filter(
                    (data) => data.isChecked && data.reviewersList.length === 0
                  )
                  .map((data, index) => {
                    const isTruncated = !expandedItems[data.minuteID];
                    return (
                      <div className={styles["agendaTitleCheckbox"]}>
                        <Row key={data.id}>
                          <Col
                            lg={12}
                            md={12}
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
                                                  id={filesData.pK_FileID}
                                                  name={
                                                    filesData.displayFileName
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
                        </Row>
                      </div>
                    );
                  })}
              </>
            )}
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
              checked={checkAll}
              onChange={handleCheckAllChange}
            />
            {allReviewers.map((data, index) => {
              return (
                <div className={styles["profile-wrapper"]}>
                  <Checkbox
                    checked={selectReviewersArray.includes(data.userID)}
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

export default SelectReviewers;
