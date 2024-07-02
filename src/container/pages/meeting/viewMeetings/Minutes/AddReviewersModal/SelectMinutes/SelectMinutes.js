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
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { MinutesReducer } = useSelector((state) => state);

  // const [minutesDataAgenda, setMinutesDataAgenda] = useState([]);
  // const [minutesDataGeneral, setMinutesDataGeneral] = useState([]);
  const [checkAllMinutes, setCheckAllMinutes] = useState(false);
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const [checkedMinutes, setCheckedMinutes] = useState({});
  const [checkBoxIds, setCheckBoxIds] = useState([]);

  console.log("checkedMinutescheckedMinutes", checkedMinutes);
  const [checkedMinutesData, setCheckedMinutesData] = useState([]);

  // useEffect(() => {
  //   if (
  //     MinutesReducer.allMinutesAG !== undefined &&
  //     MinutesReducer.allMinutesAG !== null &&
  //     MinutesReducer.allMinutesAG.length !== 0
  //   ) {
  //     setMinutesDataAgenda(MinutesReducer.allMinutesAG.agendaWise);
  //     setMinutesDataGeneral(MinutesReducer.allMinutesAG.general);
  //   } else {
  //     setMinutesDataAgenda([]);
  //     setMinutesDataGeneral([]);
  //   }
  //   return () => {
  //     setMinutesDataAgenda([]);
  //     setMinutesDataGeneral([]);
  //   };
  // }, [MinutesReducer.allMinutesAG]);

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

  console.log("checkedMinutesDatacheckedMinutesData", checkedMinutesData);

  console.log("MinuteReducerMinuteReducer", MinutesReducer);

  const [selectAll, setSelectAll] = useState(false);
  // const SelectAllFunc = (event) => {
  //   const { checked } = event.target;
  //   let ids = [];
  //   if (checked === false) {
  //     setSelectAll(false);
  //     setCheckAllMinutes(false);
  //     setCheckBoxIds([]);
  //   } else {
  //     console.log(minutesDataAgenda, "minutesDataAgendaminutesDataAgenda");
  //     minutesDataAgenda.forEach((data, index) => {
  //       ids.push(data);
  //       if (data.items.length > 0) {
  //         data.items.forEach((data2, index) => {
  //           ids.push(data2);
  //         });
  //       }
  //       if (data.subItems.length > 0) {
  //         data.subItems.forEach((data3, index) => {
  //           ids.push(data3);
  //           if (data3.items.length > 0) {
  //             data3.items.forEach((data4, index) => {
  //               ids.push(data4);
  //             });
  //           }
  //         });
  //       }
  //     });
  //     // setCheckBoxIds(ids);
  //     const newIds = minutesDataGeneral.map((newData2) => newData2);
  //     setCheckBoxIds((prev) => [...ids, ...newIds]);
  //     setSelectAll(true);
  //     setCheckAllMinutes(true);
  //   }
  //   // setSelectAll(!selectAll);
  // };

  // console.log({ checkBoxIds }, "checkBoxMainHandlecheckBoxMainHandle");

  // const MainAgendaHeadingCheckbox = (data) => {
  //   if (data.items.length > 0) {
  //     const allItemsChecked = data.items.every((newData2) =>
  //       checkBoxIds.includes(newData2)
  //     );

  //     if (allItemsChecked && checkBoxIds.includes(data)) {
  //       // If all items and data.id are checked, remove them
  //       setCheckBoxIds((prev) =>
  //         prev.filter(
  //           (filterId) =>
  //             !data.items.some((item) => item === filterId) && filterId !== data
  //         )
  //       );
  //     } else {
  //       // If not all items or data.id are checked, add them
  //       const newIds = data.items.map((newData2) => newData2);
  //       setCheckBoxIds((prev) => [...new Set([...prev, ...newIds, data])]);
  //     }
  //   }
  // };

  // const MainSubAgendaHeadingCheckbox = (data, subItem) => {
  //   if (subItem.items.length > 0) {
  //     const allItemsChecked = subItem.items.map((newData2) =>
  //       checkBoxIds.includes(newData2)
  //     );
  //     console.log(
  //       allItemsChecked,
  //       "allItemsCheckedallItemsCheckedallItemsChecked"
  //     );
  //     if (allItemsChecked && checkBoxIds.includes(subItem)) {
  //       // If all items and subItem are checked, remove them
  //       setCheckBoxIds((prev) =>
  //         prev.filter(
  //           (filterId) =>
  //             !subItem.items.some((item) => item === filterId) &&
  //             filterId !== subItem
  //         )
  //       );
  //     } else {
  //       // If not all items or subItem are checked, add them
  //       const newIds = subItem.items.map((newData2) => newData2);
  //       setCheckBoxIds((prev) => [...new Set([...prev, ...newIds, subItem])]);
  //     }
  //   }
  // };

  // const MainAgendaSubItem = (agendaID, items) => {
  //   // Check if all items are checked
  //   const allItemsChecked =
  //     items.items.length > 0 &&
  //     items.items.every((item) => checkBoxIds.includes(item));

  //   if (checkBoxIds.includes(agendaID) || allItemsChecked) {
  //     // If agendaID or all items are checked, remove them
  //     setCheckBoxIds((prev) =>
  //       prev.filter((filterId) => filterId !== agendaID)
  //     );
  //   } else {
  //     // If not, add them
  //     setCheckBoxIds((prev) => [...prev, agendaID, items]);
  //   }
  // };

  // const MainSubItemAgendaSubItem = (subAgendaID, subagendaMinuteData) => {
  //   const allItemsChecked =
  //     subagendaMinuteData.items.length > 0 &&
  //     subagendaMinuteData.items.map((item) => checkBoxIds.includes(item));
  //   console.log(
  //     allItemsChecked,
  //     "allItemsCheckedallItemsCheckedallItemsChecked"
  //   );
  //   if (checkBoxIds.includes(subAgendaID)) {
  //     // If subAgendaID or all items are checked, remove them
  //     setCheckBoxIds((prev) =>
  //       prev.filter((filterId) => filterId !== subAgendaID)
  //     );
  //   } else {
  //     // If not, add them
  //     setCheckBoxIds((prev) => [...prev, subAgendaID, subagendaMinuteData]);
  //   }
  // };

  // const checkAllGeneralMinutes = (generalID, minutesDataGeneral) => {
  //   const allItemsChecked =
  //     minutesDataGeneral.length > 0 &&
  //     minutesDataGeneral.every((item) => checkBoxIds.includes(item));

  //   if (checkBoxIds.includes(generalID) || allItemsChecked) {
  //     // setCheckAllMinutes(false);

  //     // If subAgendaID or all items are checked, remove them
  //     setCheckBoxIds((prev) =>
  //       prev.filter((filterId) => filterId !== generalID)
  //     );
  //   } else {
  //     // If not, add them
  //     setCheckAllMinutes(true);
  //     setCheckBoxIds((prev) => [...prev, generalID]);
  //   }
  // };

  // const handleCheckAllGeneral = (minutesDataGeneral) => {
  //   // Check if all items are checked

  //   const allItemsChecked =
  //     minutesDataGeneral.length > 0 &&
  //     minutesDataGeneral.every((item) => checkBoxIds.includes(item));

  //   if (checkAllMinutes || allItemsChecked) {
  //     // If all items and subItem are checked, remove them
  //     setCheckBoxIds((prev) =>
  //       prev.filter(
  //         (filterId) => !minutesDataGeneral.some((item) => item === filterId)
  //       )
  //     );
  //     setCheckAllMinutes(false);
  //   } else {
  //     // If not, add them
  //     setCheckBoxIds((prev) => [...prev, ...minutesDataGeneral]);
  //     setCheckAllMinutes(true);
  //   }
  // };

  console.log(
    "SelectMinutesDataSelectMinutesData",
    minuteDataAgenda,
    minuteDataGeneral
  );

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
            // checked={checkAllMinutes}
            // checked={selectAll}
            // onChange={handleCheckAll}
            // onChange={(event) => SelectAllFunc(event)}
            classNameDiv={styles["addReviewersCheckbox"]}
          />
        </Col>
      </Row>
      {/* Agenda Wise Minutes */}

      {minuteDataAgenda !== null ? (
        <>
          {minuteDataAgenda.map((data, index) => {
            console.log("minutesDataAgendaminutesDataAgenda", data);
            const isTruncated = !expandedItems[data.minuteID];
            return (
              <div key={index}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Checkbox
                      label2Class={styles["agenda-title"]}
                      label2={data.agendaTitle}
                      className="SearchCheckbox"
                      name="IsChat"
                      // checked={checkBoxIds.includes(data)}
                      // onChange={() => MainAgendaHeadingCheckbox(data)}
                      classNameDiv={styles["agendaTitleCheckbox"]}
                    />
                  </Col>
                </Row>
                {data.isParentData === false ? null : (
                  <Row key={data.minuteID}>
                    <Col lg={12} md={12} sm={12}>
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
                                      isTruncated ? "m-0 text-truncate" : "m-0"
                                    }
                                    dangerouslySetInnerHTML={{
                                      __html: data.description,
                                    }}
                                  ></p>
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
                                      showHideDetails(data.minuteID)
                                    }
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
                          </>
                        }
                        className="SearchCheckbox"
                        name={`minute-${data.minuteID}`}
                        // checked={checkBoxIds.includes(data)}
                        // onChange={() =>
                        //   MainAgendaSubItem(data, data)
                        // }
                        // checked={checkedMinutes[data.id]}
                        // onChange={(e) =>
                        //   onChange2(e, data.id)
                        // }
                        classNameDiv={styles["agendaTitleCheckbox"]}
                      />
                    </Col>
                  </Row>
                )}
                {data.subMinutes && data.subMinutes.length > 0
                  ? data.subMinutes.map((subagendaMinuteData, index) => {
                      const isTruncated =
                        !expandedItems[subagendaMinuteData.minuteID];
                      return (
                        <Row key={index} className="mb-25 ml-25">
                          <Col lg={12} md={12} sm={12}>
                            <Checkbox
                              label2Class={styles["agenda-title"]}
                              label2={subagendaMinuteData.agendaTitle}
                              className="SearchCheckbox"
                              name="IsChat"
                              // onChange={() =>
                              //   MainSubAgendaHeadingCheckbox(
                              //     data,
                              //     subagendaMinuteData
                              //   )
                              // }
                              // checked={checkBoxIds.includes(subagendaMinuteData)}
                              // checked={checkAllMinutes}
                              // onChange={(e) =>
                              //   handleChangeTitle(
                              //     e,
                              //     subagendaMinuteData.title
                              //   )
                              // }
                              classNameDiv={styles["agendaTitleCheckbox"]}
                            />

                            <Checkbox
                              key={subagendaMinuteData.minuteID}
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
                                        <p
                                          ref={textRef}
                                          className={
                                            isTruncated
                                              ? "m-0 text-truncate"
                                              : "m-0"
                                          }
                                        >
                                          {subagendaMinuteData.description}
                                        </p>
                                        <Row>
                                          {(isTruncated &&
                                            subagendaMinuteData.attachments
                                              .length === 0) ||
                                          (isTruncated &&
                                            subagendaMinuteData.attachments
                                              .length > 0)
                                            ? null
                                            : subagendaMinuteData.attachments.map(
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
                                              subagendaMinuteData.minuteID
                                            )
                                          }
                                          className={styles["view-details"]}
                                        >
                                          {isTruncated
                                            ? t("View-details")
                                            : t("Hide-details")}
                                        </span>
                                        {subagendaMinuteData.attachments &&
                                          subagendaMinuteData.attachments
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
                                </>
                              }
                              className="SearchCheckbox"
                              name={`minute-${subagendaMinuteData.minuteID}`}
                              // checked={checkBoxIds.includes(subItem)}
                              // onChange={() =>
                              //   MainSubItemAgendaSubItem(
                              //     subItem,
                              //     subagendaMinuteData
                              //   )
                              // }
                              classNameDiv={styles["agendaTitleCheckbox"]}
                            />
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
                // checked={checkAllMinutes}
                // checked={Object.values(checkedMinutes).every(Boolean)}
                // onChange={() => handleCheckAllGeneral(minutesDataGeneral)}
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
                              <p
                                ref={textRef}
                                className={
                                  isTruncated ? "m-0 text-truncate" : "m-0"
                                }
                              >
                                {data.description}
                              </p>

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
                    // checked={checkBoxIds.includes(data)}
                    // onChange={(e) =>
                    //   checkAllGeneralMinutes(data, minutesDataGeneral)
                    // }
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
