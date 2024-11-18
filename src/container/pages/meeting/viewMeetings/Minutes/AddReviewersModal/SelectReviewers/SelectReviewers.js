import React, { useState, useEffect, useRef } from "react";
import styles from "./SelectReviewers.module.css";
import { Col, Row } from "react-bootstrap";
import {
  AttachmentViewer,
  Checkbox,
} from "../../../../../../../components/elements";
import AttachmentIcon from "./../../../../../../../assets/images/AttachmentIcon.png";
import TickIcon from "./../../../../../../../assets/images/Tick-Icon.png";
import { useTranslation } from "react-i18next";
import {
  filterDataByIDs,
  filterMinutes,
  hasMinuteData,
} from "../functionsAddReviewers";

const SelectReviewers = ({
  minuteDataAgenda,
  minuteDataGeneral,
  selectedMinuteIDs,
  selectReviewersArray,
  setSelectReviewersArray,
  allReviewers,
  setMinuteReviewDataCheckForEdit,
}) => {
  const { t } = useTranslation();

  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  const [reviewersAgenda, setReviewersAgenda] = useState([]);
  const [reviewersGeneral, setReviewersGeneral] = useState([]);
  const [currentReviewers, setCurrentReviewers] = useState([]);

  const [checkAll, setCheckAll] = useState(false);
  let currentLanguage = localStorage.getItem("i18nextLng");

  useEffect(() => {
    const checkIfTruncated = () => {
      const element = textRef.current;
      if (element) {
        setIsTruncated(element.scrollWidth > element.clientWidth);
      }
    };

    checkIfTruncated();
    window.addEventListener("resize", checkIfTruncated);

    let dummyMinuteDataAgenda = [...minuteDataAgenda];
    const filteredDataAgenda = filterMinutes(
      dummyMinuteDataAgenda,
      selectedMinuteIDs
    );

    let dummyMinuteDataGeneral = [...minuteDataGeneral];

    const filteredDataGeneral = filterDataByIDs(
      dummyMinuteDataGeneral,
      selectedMinuteIDs
    );

    setReviewersAgenda(filteredDataAgenda);
    setReviewersGeneral(filteredDataGeneral);
    setMinuteReviewDataCheckForEdit(selectReviewersArray);
    return () => {
      window.removeEventListener("resize", checkIfTruncated);
      setReviewersAgenda([]);
      setReviewersGeneral([]);
      setCurrentReviewers([]);
      setSelectReviewersArray([]);
      // setSelectedMinuteIDs([]);
    };
  }, []);

  const handleCheckAllChange = (e) => {
    const newCheckedList = e.target.checked
      ? allReviewers.map((r) => r.userID)
      : [];
    setCurrentReviewers(newCheckedList);
    setSelectReviewersArray(newCheckedList);
    setCheckAll(e.target.checked);
  };
  console.log("selectReviewersArray ", selectReviewersArray);
  console.log("selectReviewersArray currentReviewers", currentReviewers);
  const handleCheckboxChange = (userID) => {
    const newCheckedList = selectReviewersArray.includes(userID)
      ? selectReviewersArray.filter((id) => id !== userID)
      : [...selectReviewersArray, userID];

    setCurrentReviewers(newCheckedList);
    setSelectReviewersArray(newCheckedList);
    setCheckAll(newCheckedList.length === allReviewers.length);

    setCurrentReviewers((prevState) => {
      // Helper function to update users without duplication
      const updateUsers = (userList) => {
        if (!userList.includes(userID)) {
          return [...userList, userID];
        }
        return userList;
      };

      return updateUsers(prevState);
    });
  };

  const showHideDetails = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <Row>
        <Col lg={9} md={9} sm={12} className="mt-16p">
          <div className={styles["height-manage-minutes"]}>
            <>
              {reviewersAgenda.map((data, index) => {
                return (
                  <div key={index}>
                    {hasMinuteData(data) && (
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
                    )}
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        {data.minuteData.map((parentMinutedata, index) => {
                          const isTruncated =
                            !expandedItems[parentMinutedata.minuteID];
                          return (
                            <div className={styles["agendaTitleCheckbox"]}>
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
                                  <div className={styles["minuteWrapper"]}>
                                    <Row>
                                      <Col
                                        className={
                                          currentLanguage === "ar"
                                            ? "pl-0"
                                            : "pr-0"
                                        }
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
                                </Col>
                              </Row>
                            </div>
                          );
                        })}
                      </Col>
                    </Row>
                    {data.subMinutes && data.subMinutes.length > 0
                      ? data.subMinutes.map((subagendaMinuteData, index) => {
                          return (
                            <Row
                              key={index}
                              className={
                                currentLanguage === "en" &&
                                subagendaMinuteData.minuteData.length > 0
                                  ? "mb-25 ml-25"
                                  : currentLanguage === "ar" &&
                                    subagendaMinuteData.minuteData.length > 0
                                  ? "mb-25 mr-25"
                                  : ""
                              }
                            >
                              <Col lg={12} md={12} sm={12}>
                                <Row>
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className="position-relative"
                                  >
                                    <div
                                      className={styles["agendaTitleCheckbox"]}
                                    >
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
                                {subagendaMinuteData.minuteData &&
                                  subagendaMinuteData.minuteData.length > 0 &&
                                  subagendaMinuteData.minuteData.map(
                                    (subItem, subIndex) => {
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
                                            className={styles["minuteWrapper"]}
                                          >
                                            <Row>
                                              <Col
                                                className={
                                                  currentLanguage === "ar"
                                                    ? "pl-0"
                                                    : "pr-0"
                                                }
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
                                                    __html: subItem.description,
                                                  }}
                                                ></span>
                                                <Row>
                                                  {(isTruncated &&
                                                    subItem.attachments
                                                      .length === 0) ||
                                                  (isTruncated &&
                                                    subItem.attachments.length >
                                                      0)
                                                    ? null
                                                    : subItem.attachments.map(
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
                                                      subItem.minuteID
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

            {reviewersGeneral.length > 0 && (
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
                {reviewersGeneral.map((data, index) => {
                  console.log(
                    "reviewersGeneralreviewersGeneral",
                    reviewersGeneral
                  );
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
                              <Col
                                className={
                                  currentLanguage === "ar" ? "pl-0" : "pr-0"
                                }
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
                                                name={filesData.displayFileName}
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
                                  onClick={() => showHideDetails(data.minuteID)}
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
