import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import { TextField } from "../../../../../components/elements";
import styles from "./Agenda.module.css";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import profile from "../../../../../assets/images/newprofile.png";
import pdfIcon from "../../../../../assets/images/pdf_icon.svg";
import { useTranslation } from "react-i18next";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { showAgenItemsRemovedModal } from "../../../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import desh from "../../../../../assets/images/desh.svg";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import { Radio } from "antd";
import Key from "../../../../../assets/images/KEY.svg";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import closedLocked from "../../../../../assets/images/CloseLocked.svg";
import DarkLock from "../../../../../assets/images/BlackLock.svg";
import Lock from "../../../../../assets/images/LOCK.svg";
import Cast from "../../../../../assets/images/CAST.svg";
import { message, Upload } from "antd";
import SubDocumnets from "./SubDocumnets";
import SubUrls from "./SubUrls";
import SubRequestContributor from "./SubRequestContributor";
import SubDedaultDragger from "./SubDedaultDragger";
import dropmdownblack from "../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../assets/images/whiteupper.png";
import { useEffect } from "react";

const SubAgendaMappingDragging = ({
  data,
  index,
  setRows,
  rows,
  subexpandIndex,
  expandSubIndex,
  subExpand,
  apllyLockOnParentAgenda,
  subLockArry,
  setSubLockArray,
  agendaItemRemovedIndex,
  setAgendaItemRemovedIndex,
  setSubajendaRemoval,
  setsubexpandIndex,
  setExpandSubIndex,
  setSubExpand,
  openAdvancePermissionModal,
  openVoteMOdal,
}) => {
  const { t } = useTranslation();
  //Timepicker
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const dispatch = useDispatch();
  const { Dragger } = Upload;

  // SubAgenda Select Options
  const SubAgendaoptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  //Function For Dragging the SubAgendaItems
  const onSubAgendaDragEnd = (result, index) => {
    console.log(result, index, "resultresultresult");
    if (!result.destination) return; // Dropped outside the list

    const { source, destination } = result;

    // Clone the entire rows array
    const updatedRows = [...rows];

    // Find the source and destination indices
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    // Get the dragged item
    const draggedItem = updatedRows[index].subAgenda[sourceIndex];
    console.log(draggedItem, "draggedItemdraggedItem");
    // Remove the item from the source index
    updatedRows[index].subAgenda.splice(sourceIndex, 1);

    // Insert the item at the correct destination index
    updatedRows[index].subAgenda.splice(destinationIndex, 0, draggedItem);

    // Update state with the reordered data
    setRows(updatedRows);
  };

  const apllyLockOnSubAgenda = (parentIndex, subIndex) => {
    const exists = subLockArry.some((item) => {
      if (item.parentIndex === parentIndex) {
        return item.SubIndexArray.some(
          (subItem) => subItem.subIndex === subIndex
        );
      }
      return false;
    });

    return exists;
  };

  // Function to handle changes in sub-agenda title
  const handleSubAgendaTitleChange = (index, subIndex, e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(value, "valuevaluevalue");
    const updatedRows = [...rows];
    if (name === "SubTitle") {
      updatedRows[index].subAgenda[subIndex].SubTitle = value;
    }
    console.log(updatedRows, "SubAgendaTitleSubAgendaTitle");
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda select
  const handleSubAgendaSelectChange = (index, subIndex, value) => {
    const updatedRows = [...rows];
    let SelectValue = {
      value: value.value,
      label: value.label,
    };
    updatedRows[index].subAgenda[subIndex].selectedOption = SelectValue;
    console.log(updatedRows, "SubagendaSelectSubagendaSelect");
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda start date
  const handleSubAgendaStartDateChange = (index, subIndex, date) => {
    const updatedRows = [...rows];
    updatedRows[index].subAgenda[subIndex].startDate = date;
    console.log(updatedRows, "startCasestartCasestartCase");
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda end date
  const handleSubAgendaEndDateChange = (index, subIndex, date) => {
    const updatedRows = [...rows];
    updatedRows[index].subAgenda[subIndex].endDate = date;
    setRows(updatedRows);
  };

  //Function For removing Subagendas
  const handleCrossSubAjenda = (index, subIndex) => {
    dispatch(showAgenItemsRemovedModal(true));
    setAgendaItemRemovedIndex(index);
    setSubajendaRemoval(subIndex);
  };

  // Initialize the subExpand state based on the number of rows and subAgendas
  useEffect(() => {
    const initialState = rows.map((row) =>
      Array(row.subAgenda.length).fill(false)
    );
    setSubExpand(initialState);
  }, [rows]);

  //Function For Handling See More For Subagendas
  const handleSubMenuExpand = (index, subIndex) => {
    // Close all subAgendas in the current row except the one you're expanding
    // const updatedSubExpand = Array(rows[index].subAgenda.length).fill(false);
    // updatedSubExpand[subIndex] = true;

    // setsubexpandIndex(index);
    // setExpandSubIndex(subIndex);
    // setSubExpand(updatedSubExpand);
    // Close all subAgendas in the current row except the one you're expanding
    // If the clicked subAgenda is already open, close it
    const isAlreadyExpanded = subExpand[index][subIndex];

    // Close the clicked subAgenda if it's already expanded
    if (isAlreadyExpanded) {
      setSubExpand((prevSubExpand) => {
        const updatedSubExpand = [...prevSubExpand];
        updatedSubExpand[index][subIndex] = false;
        return updatedSubExpand;
      });
      setsubexpandIndex(-1);
      setExpandSubIndex(-1);
    } else {
      // Close all other subAgendas in the current row except the one you're expanding
      const updatedSubExpand = rows.map((row, i) =>
        i === index ? Array(row.subAgenda.length).fill(false) : subExpand[i]
      );
      updatedSubExpand[index][subIndex] = true;

      setSubExpand(updatedSubExpand);
      setsubexpandIndex(index);
      setExpandSubIndex(subIndex);
    }
  };

  // Function to handle changes in sub-agenda radio group
  const handleSubAgendaRadioChange = (index, subIndex, e) => {
    let value = e.target.value;
    const updatedRows = [...rows];
    updatedRows[index].subAgenda[subIndex].subSelectRadio = value;
    console.log(
      updatedRows,
      "handleSubAgendaRadioChangehandleSubAgendaRadioChange"
    );
    setRows(updatedRows);
  };

  const lockFunctionActiveSubMenus = (index, subindex) => {
    let cloneSubLockArry = [...subLockArry];
    console.log(index, subindex, "findsubIndexfindsubIndexfindsubIndex");

    const parentIndexExists = cloneSubLockArry.findIndex(
      (item) => item.parentIndex === index
    );

    if (parentIndexExists >= 0) {
      const existingParentIndexObj = cloneSubLockArry[parentIndexExists];

      const subIndexExists = existingParentIndexObj.SubIndexArray.findIndex(
        (item) => item.subIndex === subindex
      );

      if (subIndexExists >= 0) {
        existingParentIndexObj.SubIndexArray.splice(subIndexExists, 1);

        // If SubIndexArray is empty, remove the entire parent index object
        if (existingParentIndexObj.SubIndexArray.length === 0) {
          cloneSubLockArry.splice(parentIndexExists, 1);
        }
      } else {
        existingParentIndexObj.SubIndexArray.push({ subIndex: subindex });
      }
    } else {
      let newData = {
        parentIndex: index,
        SubIndexArray: [{ subIndex: subindex }],
      };
      cloneSubLockArry.push(newData);
    }

    setSubLockArray(cloneSubLockArry);
  };

  useEffect(() => {
    if (currentLanguage !== undefined) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(arabic);
        setLocalValue(arabic_ar);
      }
    }
  }, [currentLanguage]);

  return (
    <>
      {data.subAgenda.length > 0 &&
        data.subAgenda.map((subAgendaData, subIndex) => {
          return (
            <>
              <Droppable
                key={`sub-agenda-${index}-${subIndex}`}
                droppableId={`sub-agenda-${index}-${subIndex}`}
                type="SUB_AGENDA"
              >
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Draggable
                      key={subAgendaData.SubAgendaID}
                      draggableId={`subAgenda-${subAgendaData.SubAgendaID}`}
                      index={subIndex}
                      isDragDisabled={true}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={styles["Subagenda_Scroller"]}
                            >
                              <section className={styles["Padding_SubAgenda"]}>
                                <Row
                                  key={subAgendaData.SubAgendaID}
                                  className="mt-3"
                                >
                                  <Col lg={1} md={1} sm={1}></Col>
                                  <Col
                                    lg={11}
                                    md={11}
                                    sm={11}
                                    className={
                                      apllyLockOnParentAgenda(index) ||
                                      apllyLockOnSubAgenda(index, subIndex)
                                        ? styles["SubajendaBox_Inactive"]
                                        : styles["SubajendaBox"]
                                    }
                                  >
                                    <Row isDragging={snapshot.isDragging}>
                                      <Col
                                        lg={1}
                                        md={1}
                                        sm={1}
                                        isDragging={snapshot.isDragging}
                                        {...provided.dragHandleProps}
                                      >
                                        <section
                                          className={styles["backGorund"]}
                                        >
                                          <img
                                            width="18.71px"
                                            height="9.36px"
                                            src={
                                              subexpandIndex === index &&
                                              expandSubIndex === subIndex &&
                                              subExpand
                                                ? blackArrowUpper
                                                : dropmdownblack
                                            }
                                            className={
                                              subexpandIndex === index &&
                                              expandSubIndex === subIndex &&
                                              subExpand
                                                ? styles["subAgendaArrowExpand"]
                                                : styles["SubAgendaArrow"]
                                            }
                                            onClick={() => {
                                              apllyLockOnParentAgenda(index) ||
                                                handleSubMenuExpand(
                                                  index,
                                                  subIndex
                                                );
                                            }}
                                          />
                                        </section>
                                      </Col>
                                      <Col
                                        lg={11}
                                        md={11}
                                        sm={11}
                                        className={styles["SubAgendaSection"]}
                                      >
                                        <Row className="mt-2 mb-2">
                                          <Col lg={12} md={12} sm={12}>
                                            <span
                                              className={
                                                styles["AgendaTitle_Heading"]
                                              }
                                            >
                                              1. Get new computers from Techno
                                              City Mall. Also, Get a new
                                              graphics card for the designer.
                                            </span>
                                          </Col>
                                        </Row>

                                        <Row>
                                          <Col lg={12} md={12} sm={12}>
                                            <span
                                              className={
                                                styles["Show_More_Styles"]
                                              }
                                              onClick={() => {
                                                apllyLockOnParentAgenda(
                                                  index
                                                ) ||
                                                  handleSubMenuExpand(
                                                    index,
                                                    subIndex
                                                  );
                                              }}
                                            >
                                              {subexpandIndex === index &&
                                              expandSubIndex === subIndex &&
                                              subExpand
                                                ? t("Hide-details")
                                                : t("Show-more")}
                                            </span>
                                          </Col>
                                        </Row>
                                        {/* Condition for Subajencda */}
                                        {subexpandIndex === index &&
                                          expandSubIndex === subIndex &&
                                          subExpand && (
                                            <>
                                              <Row className="mt-2">
                                                <Col lg={12} md={12} sm={12}>
                                                  <div
                                                    className={
                                                      styles[
                                                        "agendaCreationDetail"
                                                      ]
                                                    }
                                                  >
                                                    <img
                                                      src={profile}
                                                      className={
                                                        styles["Image"]
                                                      }
                                                    />
                                                    <p
                                                      className={
                                                        styles["agendaCreater"]
                                                      }
                                                    >
                                                      Salman Memon
                                                    </p>
                                                    <span
                                                      className={
                                                        styles[
                                                          "agendaCreationTime"
                                                        ]
                                                      }
                                                    >
                                                      12:15 PM - 12:15 PM
                                                    </span>
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row className="mt-3">
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles["Agenda_Heading"]
                                                    }
                                                  >
                                                    {t("Attachments")}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row className="mt-3">
                                                <Col lg={6} md={6} sm={6}>
                                                  <Radio.Group
                                                    value={
                                                      subAgendaData.subSelectRadio
                                                    }
                                                    onChange={(e) =>
                                                      handleSubAgendaRadioChange(
                                                        index,
                                                        subIndex,
                                                        e
                                                      )
                                                    }
                                                    disabled={
                                                      apllyLockOnParentAgenda(
                                                        index
                                                      ) ||
                                                      apllyLockOnSubAgenda(
                                                        index,
                                                        subIndex
                                                      )
                                                        ? true
                                                        : false
                                                    }
                                                  >
                                                    <Radio value="1">
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t("Document")}
                                                      </span>
                                                    </Radio>
                                                    <Radio value="2">
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t("URL")}
                                                      </span>
                                                    </Radio>
                                                    <Radio value="3">
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t(
                                                          "Request from contributor"
                                                        )}
                                                      </span>
                                                    </Radio>
                                                  </Radio.Group>
                                                </Col>
                                                <Col
                                                  lg={6}
                                                  md={6}
                                                  sm={6}
                                                  className="d-flex justify-content-end gap-4 align-items-center"
                                                >
                                                  <img
                                                    draggable={false}
                                                    src={Key}
                                                    width="24.07px"
                                                    className="cursor-pointer"
                                                    height="24.09px"
                                                    onClick={
                                                      apllyLockOnParentAgenda(
                                                        index
                                                      ) ||
                                                      apllyLockOnSubAgenda(
                                                        index,
                                                        subIndex
                                                      )
                                                        ? ""
                                                        : openAdvancePermissionModal
                                                    }
                                                  />
                                                  <img
                                                    draggable={false}
                                                    src={Cast}
                                                    width="25.85px"
                                                    height="25.89px"
                                                    className="cursor-pointer"
                                                    onClick={
                                                      apllyLockOnParentAgenda(
                                                        index
                                                      ) ||
                                                      apllyLockOnSubAgenda(
                                                        index,
                                                        subIndex
                                                      )
                                                        ? ""
                                                        : openVoteMOdal
                                                    }
                                                  />
                                                  <img
                                                    draggable={false}
                                                    src={
                                                      apllyLockOnParentAgenda(
                                                        index
                                                      )
                                                        ? closedLocked
                                                        : apllyLockOnSubAgenda(
                                                            index,
                                                            subIndex
                                                          )
                                                        ? DarkLock
                                                        : Lock
                                                    }
                                                    width="18.87px"
                                                    height="26.72px"
                                                    className={
                                                      apllyLockOnParentAgenda(
                                                        index
                                                      )
                                                        ? styles[
                                                            "lockBtn_inActive"
                                                          ]
                                                        : apllyLockOnSubAgenda(
                                                            index,
                                                            subIndex
                                                          )
                                                        ? styles[
                                                            "lockBtn_inActive_coursor"
                                                          ]
                                                        : styles["lockBtn"]
                                                    }
                                                    onClick={() => {
                                                      if (
                                                        apllyLockOnParentAgenda(
                                                          index
                                                        )
                                                      ) {
                                                      } else {
                                                        lockFunctionActiveSubMenus(
                                                          index,
                                                          subIndex
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </Col>
                                              </Row>
                                              <Droppable
                                                droppableId={`subAgendaID-${subAgendaData.SubAgendaID}-parent-${data.ID}-attachments`}
                                                type="attachment"
                                              >
                                                {(provided) => (
                                                  <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                  >
                                                    {subAgendaData.subSelectRadio ===
                                                    "1" ? (
                                                      <>
                                                        <Row>
                                                          <Col
                                                            lg={3}
                                                            md={3}
                                                            sm={12}
                                                          >
                                                            <div
                                                              className={
                                                                styles[
                                                                  "agendaFileAttachedView"
                                                                ]
                                                              }
                                                            >
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "agendaFileSpan"
                                                                  ]
                                                                }
                                                              >
                                                                <img
                                                                  src={pdfIcon}
                                                                  alt=""
                                                                  draggable="false"
                                                                />{" "}
                                                                Admin Dashboard
                                                                Design 13
                                                                february
                                                                prototype -
                                                                Copy.pdf
                                                              </span>
                                                            </div>
                                                          </Col>
                                                          <Col
                                                            lg={3}
                                                            md={3}
                                                            sm={12}
                                                          >
                                                            <div
                                                              className={
                                                                styles[
                                                                  "agendaFileAttachedView"
                                                                ]
                                                              }
                                                            >
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "agendaFileSpan"
                                                                  ]
                                                                }
                                                              >
                                                                <img
                                                                  src={pdfIcon}
                                                                  alt=""
                                                                  draggable="false"
                                                                />{" "}
                                                                Admin Dashboard
                                                                Design 13
                                                                february
                                                                prototype -
                                                                Copy.pdf
                                                              </span>
                                                            </div>
                                                          </Col>
                                                          <Col
                                                            lg={3}
                                                            md={3}
                                                            sm={12}
                                                          >
                                                            <div
                                                              className={
                                                                styles[
                                                                  "agendaFileAttachedView"
                                                                ]
                                                              }
                                                            >
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "agendaFileSpan"
                                                                  ]
                                                                }
                                                              >
                                                                <img
                                                                  src={pdfIcon}
                                                                  alt=""
                                                                  draggable="false"
                                                                />{" "}
                                                                Admin Dashboard
                                                                Design 13
                                                                february
                                                                prototype -
                                                                Copy.pdf
                                                              </span>
                                                            </div>
                                                          </Col>
                                                          <Col
                                                            lg={3}
                                                            md={3}
                                                            sm={12}
                                                          >
                                                            <div
                                                              className={
                                                                styles[
                                                                  "agendaFileAttachedView"
                                                                ]
                                                              }
                                                            >
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "agendaFileSpan"
                                                                  ]
                                                                }
                                                              >
                                                                <img
                                                                  src={pdfIcon}
                                                                  alt=""
                                                                  draggable="false"
                                                                />{" "}
                                                                Admin Dashboard
                                                                Design 13
                                                                february
                                                                prototype -
                                                                Copy.pdf
                                                              </span>
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                      </>
                                                    ) : subAgendaData.subSelectRadio ===
                                                      "2" ? (
                                                      <SubUrls
                                                        subAgendaData={
                                                          subAgendaData
                                                        }
                                                        rows={rows}
                                                        setRows={setRows}
                                                        index={index}
                                                        subIndex={subIndex}
                                                      />
                                                    ) : subAgendaData.subSelectRadio ===
                                                      "3" ? (
                                                      <SubRequestContributor
                                                        subAgendaData={
                                                          subAgendaData
                                                        }
                                                        rows={rows}
                                                        setRows={setRows}
                                                        index={index}
                                                        subIndex={subIndex}
                                                      />
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </div>
                                                )}
                                              </Droppable>
                                            </>
                                          )}
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </section>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Draggable>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </>
          );
        })}
    </>
  );
};

export default SubAgendaMappingDragging;
