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
import {
  findUserProfileImg,
  handleCheck,
  checkReviewersListAgenda,
  checkReviewersListGeneral,
} from "../functionsAddReviewers";
import Avatar from "./../../../../../../../assets/images/avatar.png";
import EditMinute from "./../../Images/Edit-Minute.png";

const SelectMinutes = ({
  minuteDataAgenda,
  minuteDataGeneral,
  selectedMinuteIDs,
  setSelectedMinuteIDs,
  allReviewers,
}) => {
  const { t } = useTranslation();

  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const [totalIds, setTotalIds] = useState([]);

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
      setSelectedMinuteIDs([]);
    };
  }, []);

  const showHideDetails = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

  const handleCheckboxChange = (checked, ID, flag) => {
    handleCheck(
      checked,
      ID,
      flag,
      minuteDataAgenda,
      minuteDataGeneral,
      selectedMinuteIDs,
      setSelectedMinuteIDs
    );
  };

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
            return (
              <div key={index}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Checkbox
                      label2Class={styles["agenda-title"]}
                      disabled={
                        checkReviewersListAgenda(minuteDataAgenda)
                          ? true
                          : false
                      }
                      label2={data.agendaTitle}
                      className="SearchCheckbox"
                      name="IsChat"
                      classNameDiv={styles["agendaTitleCheckbox"]}
                      onChange={(e) =>
                        handleCheckboxChange(
                          e.target.checked,
                          data.agendaID,
                          "ParentCheckboxAgenda"
                        )
                      }
                      checked={
                        checkReviewersListAgenda(minuteDataAgenda)
                          ? true
                          : data.minuteData.every((item) =>
                              selectedMinuteIDs.includes(item.minuteID)
                            )
                      }
                    />
                  </Col>
                </Row>
                {data.isParentData === false
                  ? null
                  : data.minuteData.map((parentMinutedata, index) => {
                      const isTruncated =
                        !expandedItems[parentMinutedata.minuteID];
                      const reviewerId =
                        parentMinutedata?.reviewersList?.[0] ?? null;
                      const profileImg = findUserProfileImg(
                        reviewerId,
                        allReviewers
                      );
                      return (
                        <Row>
                          <Col
                            lg={
                              parentMinutedata.reviewersList.length > 0
                                ? 11
                                : 12
                            }
                            md={
                              parentMinutedata.reviewersList.length > 0
                                ? 11
                                : 12
                            }
                            sm={12}
                          >
                            <Checkbox
                              disabled={
                                parentMinutedata.reviewersList.length > 0
                                  ? true
                                  : false
                              }
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
                                            __html:
                                              parentMinutedata.description,
                                          }}
                                        ></span>
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
                                                      lg={2}
                                                      md={2}
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
                                </>
                              }
                              className="SearchCheckbox"
                              name={`minute-${parentMinutedata.minuteID}`}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  e.target.checked,
                                  parentMinutedata.minuteID,
                                  "ParentMinuteCheckbox"
                                )
                              }
                              checked={
                                parentMinutedata.reviewersList.length > 0
                                  ? true
                                  : selectedMinuteIDs.includes(
                                      parentMinutedata.minuteID
                                    )
                              }
                              classNameDiv={styles["agendaTitleCheckbox"]}
                            />
                          </Col>
                          {parentMinutedata.reviewersList.length > 0 ? (
                            <Col lg={1} md={1} sm={12}>
                              <div className={styles["image-profile-wrapper"]}>
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
                                  {parentMinutedata.reviewersList.length > 1 ? (
                                    <span className={styles["reviewer-count"]}>
                                      {"+" +
                                        parentMinutedata.reviewersList.length}
                                    </span>
                                  ) : null}
                                </div>
                                <img
                                  height={32}
                                  width={32}
                                  className={"cursor-pointer"}
                                  src={EditMinute}
                                  // onClick={() => {
                                  //   editMinuteFunction(parentMinutedata, data);
                                  //   setIsAgendaMinute(true);
                                  // }}
                                  alt=""
                                />
                              </div>
                            </Col>
                          ) : null}
                        </Row>
                      );
                    })}
                {data.subMinutes && data.subMinutes.length > 0
                  ? data.subMinutes.map((subagendaMinuteData, index) => {
                      return (
                        <Row key={index} className="mb-25 ml-25">
                          <Col lg={12} md={12} sm={12}>
                            {subagendaMinuteData.minuteData.length > 0 ? (
                              <Checkbox
                                label2Class={styles["agenda-title"]}
                                disabled={
                                  checkReviewersListAgenda(subagendaMinuteData)
                                    ? true
                                    : false
                                }
                                label2={subagendaMinuteData.agendaTitle}
                                className="SearchCheckbox"
                                name="IsChat"
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    e.target.checked,
                                    subagendaMinuteData.agendaID,
                                    "SubAgendaTitleCheckbox"
                                  )
                                }
                                checked={
                                  checkReviewersListAgenda(subagendaMinuteData)
                                    ? true
                                    : subagendaMinuteData.minuteData.every(
                                        (item) =>
                                          selectedMinuteIDs.includes(
                                            item.minuteID
                                          )
                                      )
                                }
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
                                    const reviewerId =
                                      minuteDataSubminute?.reviewersList?.[0] ??
                                      null;
                                    const profileImg = findUserProfileImg(
                                      reviewerId,
                                      allReviewers
                                    );
                                    return (
                                      <Row>
                                        <Col
                                          lg={
                                            minuteDataSubminute.reviewersList
                                              .length > 0
                                              ? 11
                                              : 12
                                          }
                                          md={
                                            minuteDataSubminute.reviewersList
                                              .length > 0
                                              ? 11
                                              : 12
                                          }
                                          sm={12}
                                        >
                                          <Checkbox
                                            key={minuteDataSubminute.minuteID}
                                            disabled={
                                              minuteDataSubminute.reviewersList
                                                .length > 0
                                                ? true
                                                : false
                                            }
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
                                                            minuteDataSubminute.description,
                                                        }}
                                                      ></span>
                                                      <Row>
                                                        {(isTruncated &&
                                                          minuteDataSubminute
                                                            .attachments
                                                            .length === 0) ||
                                                        (isTruncated &&
                                                          minuteDataSubminute
                                                            .attachments
                                                            .length > 0)
                                                          ? null
                                                          : minuteDataSubminute.attachments.map(
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
                                              handleCheckboxChange(
                                                e.target.checked,
                                                minuteDataSubminute.minuteID,
                                                "SubAgendaMinuteCheckbox"
                                              )
                                            }
                                            checked={
                                              minuteDataSubminute.reviewersList
                                                .length > 0
                                                ? true
                                                : selectedMinuteIDs.includes(
                                                    minuteDataSubminute.minuteID
                                                  )
                                            }
                                            classNameDiv={
                                              styles["agendaTitleCheckbox"]
                                            }
                                          />
                                        </Col>
                                        {minuteDataSubminute.reviewersList
                                          .length > 0 ? (
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
                                                  src={
                                                    profileImg
                                                      ? `data:image/jpeg;base64,${profileImg}`
                                                      : Avatar
                                                  }
                                                  // src={Avatar}
                                                  alt=""
                                                />
                                                {minuteDataSubminute
                                                  .reviewersList.length > 1 ? (
                                                  <span
                                                    className={
                                                      styles["reviewer-count"]
                                                    }
                                                  >
                                                    {"+" +
                                                      minuteDataSubminute
                                                        .reviewersList.length}
                                                  </span>
                                                ) : null}
                                              </div>
                                              <img
                                                height={32}
                                                width={32}
                                                className={"cursor-pointer"}
                                                src={EditMinute}
                                                // onClick={() => {
                                                //   editMinuteFunction(parentMinutedata, data);
                                                //   setIsAgendaMinute(true);
                                                // }}
                                                alt=""
                                              />
                                            </div>
                                          </Col>
                                        ) : null}
                                      </Row>
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
                disabled={
                  checkReviewersListGeneral(minuteDataGeneral) ? true : false
                }
                label2={t("General-minutes")}
                className="SearchCheckbox "
                name="IsChat"
                onChange={(e) =>
                  handleCheckboxChange(
                    e.target.checked,
                    0,
                    "GeneralTitleCheckbox"
                  )
                }
                checked={
                  checkReviewersListGeneral(minuteDataGeneral)
                    ? true
                    : minuteDataGeneral.every((item) =>
                        selectedMinuteIDs.includes(item.minuteID)
                      )
                }
                classNameDiv={styles["agendaTitleCheckbox"]}
              />
            </Col>
          </Row>
          {minuteDataGeneral.map((data, index) => {
            const isTruncated = !expandedItems[data.minuteID];
            const reviewerId = data?.reviewersList?.[0] ?? null;
            const profileImg = findUserProfileImg(reviewerId, allReviewers);
            return (
              <Row>
                <Col
                  lg={data.reviewersList.length > 0 ? 11 : 12}
                  md={data.reviewersList.length > 0 ? 11 : 12}
                  sm={12}
                >
                  <Checkbox
                    label2Class={styles["minuteParentLabel"]}
                    disabled={data.reviewersList.length > 0 ? true : false}
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
                                      return (
                                        <Col
                                          lg={2}
                                          md={2}
                                          sm={12}
                                          className="mx-2"
                                        >
                                          <AttachmentViewer
                                            id={filesData.pK_FileID}
                                            name={filesData.displayFileName}
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
                      handleCheckboxChange(
                        e.target.checked,
                        data.minuteID,
                        "GeneralMinuteCheckbox"
                      )
                    }
                    checked={data.reviewersList.length > 0 ? true : selectedMinuteIDs.includes(data.minuteID)}
                    classNameDiv={styles["agendaTitleCheckbox"]}
                  />
                </Col>
                {data.reviewersList.length > 0 ? (
                  <Col lg={1} md={1} sm={12}>
                    <div className={styles["image-profile-wrapper"]}>
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
                          // src={Avatar}
                          alt=""
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
                        // onClick={() => {
                        //   editMinuteFunction(parentMinutedata, data);
                        //   setIsAgendaMinute(true);
                        // }}
                        alt=""
                      />
                    </div>
                  </Col>
                ) : null}
              </Row>
            );
          })}
        </>
      ) : null}
    </>
  );
};

export default SelectMinutes;
