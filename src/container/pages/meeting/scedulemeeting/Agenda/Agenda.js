import React, { useState } from "react";
import styles from "./Agenda.module.css";
import { Col, Row } from "react-bootstrap";
import { Button, TextField } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import desh from "../../../../../assets/images/desh.svg";
import dropmdownblack from "../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../assets/images/whiteupper.png";
import { useNavigate } from "react-router-dom";
import { message, Upload } from "antd";
import Lock from "../../../../../assets/images/LOCK.svg";
import DarkLock from "../../../../../assets/images/BlackLock.svg";
import Key from "../../../../../assets/images/KEY.svg";
import plusFaddes from "../../../../../assets/images/PlusFadded.svg";
import Cast from "../../../../../assets/images/CAST.svg";
import profile from "../../../../../assets/images/newprofile.png";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import line from "../../../../../assets/images/LineAgenda.svg";
import AgenItemremovedModal from "./AgendaItemRemovedModal/AgenItemremovedModal";
import {
  showAdvancePermissionModal,
  showAgenItemsRemovedModal,
  showImportPreviousAgendaModal,
  showMainAgendaItemRemovedModal,
  showVoteAgendaModal,
} from "../../../../../store/actions/NewMeetingActions";
import MainAjendaItemRemoved from "./MainAgendaItemsRemove/MainAjendaItemRemoved";
import AdvancePersmissionModal from "./AdvancePermissionModal/AdvancePersmissionModal";
import PermissionConfirmation from "./AdvancePermissionModal/PermissionConfirmModal/PermissionConfirmation";
import VoteModal from "./VoteModal/VoteModal";
import VoteModalConfirm from "./VoteModal/VoteModalConfirmation/VoteModalConfirm";
import {
  regexOnlyForNumberNCharacters,
  validateInput,
} from "../../../../../commen/functions/regex";
import ImportPrevious from "./ImportPreviousAgenda/ImportPrevious";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { result, startCase } from "lodash";
import SaveAgendaView from "./SavedAgendaView/SaveAgendaView";
import Documents from "./Documents";
import Urls from "./Urls";
import RequestContributor from "./RequestContributor";
import DefaultDragger from "./DefaultDragger";
import SubAgendaMappingDragging from "./SubAgendaMappingDragging";

const Agenda = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const { Dragger } = Upload;
  const [expand, setExpand] = useState(true);
  const [subExpand, setSubExpand] = useState(true);
  const [savedViewAgenda, setsavedViewAgenda] = useState(false);
  const [expandSubIndex, setExpandSubIndex] = useState(0);
  const [expandIndex, setExpandIndex] = useState(0);
  const [subexpandIndex, setsubexpandIndex] = useState(0);
  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);
  const [mainLock, setmainLock] = useState([]);
  const [subLockArry, setSubLockArray] = useState([]);
  const [rows, setRows] = useState([
    {
      ID: "0",
      title: "",
      selectedOption: null,
      startDate: null,
      endDate: null,
      selectedRadio: "0",
      urlFieldMain: "",
      requestContributorURl: "",
      MainNote: "",
      files: [
        {
          FileID: "0",
          name: "MeetingAgendas",
        },
        {
          FileID: "1",
          name: "Saif Meeting",
        },
        {
          FileID: "2",
          name: "Owais Meeting",
        },
        {
          FileID: "3",
          name: "Tresmark",
        },
        {
          FileID: "4",
          name: "Minds Collide",
        },
        {
          FileID: "5",
          name: "Aun File",
        },
        {
          FileID: "6",
          name: "Ali Raza Mamdani",
        },
        {
          FileID: "7",
          name: "Talha",
        },
        {
          FileID: "8",
          name: "Jawad Faisal",
        },
        {
          FileID: "9",
          name: "Fahad Hassan",
        },
        {
          FileID: "10",
          name: "Saroush Yahyas",
        },
      ],
      subAgenda: [
        {
          SubAgendaID: "0",
          SubTitle: "",
          selectedOption: null,
          startDate: null,
          endDate: null,
          subSelectRadio: "0",
          SubAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrl: "",
          subAgendarequestContributorEnterNotes: "",
          Subfiles: [
            {
              name: "MeetingAgendas",
            },
            {
              name: "DiskusMeetings",
            },
            {
              name: "AxisMeetings",
            },
            {
              name: "Bahria Auditoriom Meetings to be published",
            },
            {
              name: "MeetingAgendas",
            },
            {
              name: "MeetingAgendas",
            },
            {
              name: "MeetingAgendas",
            },
            {
              name: "MeetingAgendas",
            },
            {
              name: "MeetingAgendas",
            },
            {
              name: "MeetingAgendas",
            },
          ],
        },
      ],
    },
  ]);

  const options = [
    {
      value: "chocolate",
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-2 align-items-center"
            >
              <img
                draggable={false}
                src={profile}
                width="17px"
                height="17px"
                className={styles["Image_class_Agenda"]}
              />
              <span className={styles["Name_Class"]}>Oliver Davis</span>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  // Function For Expanding Main Agenda See More Options
  const handleExpandedBtn = (index) => {
    console.log(index, "recordrecordrecordrecord");
    setExpandIndex(index);
    setExpand(!expand);
  };

  //Function For Adding Main Agendas
  const addRow = () => {
    const updatedRows = [...rows];
    const nextID = updatedRows.length.toString();
    const newMainAgenda = {
      ID: nextID,
      title: "",
      selectedOption: null,
      startDate: null,
      endDate: null,
      files: [
        {
          name: "MeetingAgendas",
        },
      ],
      urlFieldMain: "",
      requestContributorURl: "",
      MainNote: "",
      subAgenda: [
        {
          ID: "0",
          title: "",
          selectedOption: null,
          startDate: null,
          endDate: null,
          files: [
            {
              name: "MeetingAgendas",
            },
            // ... (other file objects)
          ],
          subSelectRadio: "0", // Initialize selectedRadio to "0" for sub-agenda
          SubAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrl: "",
          subAgendarequestContributorEnterNotes: "",
        },
      ],
    };
    updatedRows.push(newMainAgenda);
    setRows(updatedRows);
    console.log(updatedRows, "updatedRowsupdatedRows");
  };

  //Add Function To Add SubAgendas
  const addSubAjendaRows = (rowAgendaIndex) => {
    const updatedRows = [...rows];
    const nextSubAgendaID = updatedRows[0].subAgenda.length.toString();
    const newSubAgenda = {
      SubAgendaID: nextSubAgendaID,
      SubTitle: "",
      selectedOption: null,
      startDate: null,
      endDate: null,
      subSelectRadio: "0",
      SubAgendaUrlFieldRadio: "",
      subAgendarequestContributorUrl: "",
      subAgendarequestContributorEnterNotes: "",
      Subfiles: [
        {
          name: "MeetingAgendas",
        },
        {
          name: "DiskusMeetings",
        },
        {
          name: "AxisMeetings",
        },
        {
          name: "Bahria Auditoriom Meetings to be published",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
      ],
    };
    updatedRows[rowAgendaIndex].subAgenda.push(newSubAgenda);
    setRows(updatedRows);
  };

  const handleCrossIcon = (index) => {
    dispatch(showMainAgendaItemRemovedModal(true));
    setMainAgendaRemovalIndex(index);
  };

  const openAdvancePermissionModal = () => {
    dispatch(showAdvancePermissionModal(true));
  };

  const openVoteMOdal = () => {
    dispatch(showVoteAgendaModal(true));
  };

  //Lock Functionality For SubAgendas Only
  const lockFunctionActive = (data) => {
    if (mainLock.length === 0) {
      // If state is empty, add the data
      setmainLock([data]);
    } else {
      const existingIndex = mainLock.findIndex((item) => item === data);
      if (existingIndex >= 0) {
        // If parentIndex exists, remove it
        const updatedData = mainLock.filter((item) => item !== data);
        setmainLock(updatedData);
      } else {
        // If parentIndex doesn't exist, add it
        setmainLock([...mainLock, data]);
      }
    }
  };

  //Lock For Main Agenda Will Locks Its childs Also
  const apllyLockOnParentAgenda = (parentIndex) => {
    const exists = mainLock.some((item) => {
      if (item === parentIndex) {
        return true;
      }
      return false;
    });

    return exists;
  };

  // StateManagement of Components
  const handleAgendaItemChange = (index, e) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedAgendaItems = [...rows];
    if (name === "title") {
      updatedAgendaItems[index][name] = value;
    }
    console.log(updatedAgendaItems, "updatedAgendaItemsupdatedAgendaItems");
    setRows(updatedAgendaItems);
  };

  const handleSelectChange = (index, value) => {
    console.log(value, "valuevaluevalue");
    const updatedAgendaItems = [...rows];
    let SelectValue = {
      value: value.value,
      label: value.label,
    };
    updatedAgendaItems[index].selectedOption = SelectValue;
    setRows(updatedAgendaItems);
  };

  // Function to update the startDate for a specific row
  const handleStartDateChange = (index, date) => {
    console.log(date, "datedatedatedatedate");
    const updatedRows = [...rows];
    updatedRows[index].startDate = date;
    setRows(updatedRows);
  };

  // Function to update the endDate for a specific row
  const handleEndDateChange = (index, date) => {
    const updatedRows = [...rows];
    updatedRows[index].endDate = date;
    setRows(updatedRows);
  };

  // Function to update the selected radio option for a specific row
  const handleRadioChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].selectedRadio = value;
    setRows(updatedRows);
  };

  //SubAgenda Statemanagement

  const handlePreviousAgenda = () => {
    dispatch(showImportPreviousAgendaModal(true));
  };

  const handleSavedViewAgenda = () => {
    setsavedViewAgenda(true);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return; // Item dropped outside the list
    const reorderedRows = [...rows];
    const [movedRow] = reorderedRows.splice(result.source.index, 1);
    reorderedRows.splice(result.destination.index, 0, movedRow);
    setRows(reorderedRows);
  };

  return (
    <>
      {savedViewAgenda ? (
        <SaveAgendaView />
      ) : (
        <>
          <section>
            <DragDropContext onDragEnd={onDragEnd}>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={styles["Scroller_Agenda"]}
                >
                  <Droppable
                    key={`main-agenda-${rows.ID}`}
                    droppableId={`main-agenda-${rows.ID}`}
                  >
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <section className={styles["Padding_mainAgenda"]}>
                          {rows.length > 0
                            ? rows.map((data, index) => {
                                console.log("valuevaluevalue", data);
                                return (
                                  <>
                                    <Draggable
                                      key={data.ID}
                                      draggableId={data.ID}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          {/* Main Agenda Items Mapping */}
                                          <span className="position-relative">
                                            <Row
                                              key={data.ID}
                                              className="mt-4 m-0 p-0"
                                            >
                                              <Col
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                key={index + 1}
                                                className={
                                                  apllyLockOnParentAgenda(index)
                                                    ? styles[
                                                        "BackGround_Agenda_InActive"
                                                      ]
                                                    : styles[
                                                        "BackGround_Agenda"
                                                      ]
                                                }
                                              >
                                                <Row>
                                                  <Col
                                                    lg={1}
                                                    md={1}
                                                    sm={1}
                                                    className={
                                                      styles[
                                                        "BackGroundNewImplemented"
                                                      ]
                                                    }
                                                  >
                                                    <Row className="mt-4">
                                                      <Col
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        className="d-flex justify-content-center align-items-center"
                                                      >
                                                        <img
                                                          draggable={false}
                                                          src={
                                                            expandIndex ===
                                                            index
                                                              ? blackArrowUpper
                                                              : dropmdownblack
                                                          }
                                                          width="18.71px"
                                                          height="9.36px"
                                                          className={
                                                            expandIndex ===
                                                            index
                                                              ? styles[
                                                                  "Arrow_Expanded"
                                                                ]
                                                              : styles["Arrow"]
                                                          }
                                                          onClick={() => {
                                                            handleExpandedBtn(
                                                              index
                                                            );
                                                          }}
                                                        />
                                                      </Col>
                                                    </Row>
                                                  </Col>

                                                  <Col lg={11} md={11} sm={11}>
                                                    <section
                                                      className={
                                                        styles[
                                                          "SectionInnerClass"
                                                        ]
                                                      }
                                                    >
                                                      <Row
                                                        key={index + 2}
                                                        className="mt-4"
                                                      >
                                                        <Col
                                                          lg={5}
                                                          md={5}
                                                          sm={12}
                                                        >
                                                          <Row>
                                                            <Col
                                                              lg={12}
                                                              md={12}
                                                              sm={12}
                                                            >
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "Meeting_title_heading"
                                                                  ]
                                                                }
                                                              >
                                                                <span>
                                                                  {index + 1}.
                                                                </span>{" "}
                                                                {t(
                                                                  "Agenda-title"
                                                                )}{" "}
                                                                <span>
                                                                  {index + 1}
                                                                </span>
                                                              </span>
                                                            </Col>
                                                          </Row>
                                                          <TextField
                                                            applyClass={
                                                              "AgendaTextField"
                                                            }
                                                            name={"title"}
                                                            labelClass={
                                                              "d-none"
                                                            }
                                                            placeholder={t(
                                                              "Agenda-title"
                                                            )}
                                                            value={data.title}
                                                            change={(e) =>
                                                              handleAgendaItemChange(
                                                                index,
                                                                e
                                                              )
                                                            }
                                                            disable={
                                                              apllyLockOnParentAgenda(
                                                                index
                                                              )
                                                                ? true
                                                                : false
                                                            }
                                                          />
                                                        </Col>
                                                        <Col
                                                          lg={3}
                                                          md={3}
                                                          sm={12}
                                                        >
                                                          <Row>
                                                            <Col
                                                              lg={12}
                                                              md={12}
                                                              sm={12}
                                                            >
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "Meeting_title_heading"
                                                                  ]
                                                                }
                                                              >
                                                                {t("Presenter")}
                                                              </span>
                                                            </Col>
                                                          </Row>
                                                          <Select
                                                            options={options}
                                                            value={
                                                              data.selectedOption
                                                            }
                                                            onChange={(value) =>
                                                              handleSelectChange(
                                                                index,
                                                                value
                                                              )
                                                            }
                                                            isDisabled={
                                                              apllyLockOnParentAgenda(
                                                                index
                                                              )
                                                                ? true
                                                                : false
                                                            }
                                                          />
                                                        </Col>
                                                        <Col
                                                          sm={12}
                                                          md={4}
                                                          lg={4}
                                                          className="d-flex gap-4 justify-content-start align-items-center"
                                                        >
                                                          <Row>
                                                            <Col
                                                              lg={5}
                                                              md={5}
                                                              sm={5}
                                                            >
                                                              <Row>
                                                                <Col
                                                                  lg={12}
                                                                  md={12}
                                                                  sm={12}
                                                                >
                                                                  <span
                                                                    className={
                                                                      styles[
                                                                        "Meeting_title_heading"
                                                                      ]
                                                                    }
                                                                  >
                                                                    {t(
                                                                      "Start-date"
                                                                    )}
                                                                  </span>
                                                                </Col>
                                                              </Row>
                                                              <DatePicker
                                                                arrowClassName="arrowClass"
                                                                containerClassName="containerClassTimePicker"
                                                                className="timePicker"
                                                                disableDayPicker
                                                                inputClass="inputTImeMeeting"
                                                                format="HH:mm A"
                                                                selected={
                                                                  data.startDate
                                                                }
                                                                plugins={[
                                                                  <TimePicker
                                                                    hideSeconds
                                                                  />,
                                                                ]}
                                                                onChange={(
                                                                  date
                                                                ) =>
                                                                  handleStartDateChange(
                                                                    index,
                                                                    date
                                                                  )
                                                                }
                                                                disabled={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  )
                                                                    ? true
                                                                    : false
                                                                }
                                                              />
                                                            </Col>
                                                            <Col
                                                              lg={2}
                                                              md={2}
                                                              sm={2}
                                                              className="d-flex justify-content-center align-items-center"
                                                            >
                                                              <img
                                                                draggable={
                                                                  false
                                                                }
                                                                src={desh}
                                                                width="19.02px"
                                                              />
                                                            </Col>
                                                            <Col
                                                              lg={5}
                                                              md={5}
                                                              sm={5}
                                                            >
                                                              <Row>
                                                                <Col
                                                                  lg={12}
                                                                  md={12}
                                                                  sm={12}
                                                                >
                                                                  <span
                                                                    className={
                                                                      styles[
                                                                        "Meeting_title_heading"
                                                                      ]
                                                                    }
                                                                  >
                                                                    {t(
                                                                      "End-date"
                                                                    )}
                                                                  </span>
                                                                </Col>
                                                              </Row>
                                                              <DatePicker
                                                                arrowClassName="arrowClass"
                                                                containerClassName="containerClassTimePicker"
                                                                className="timePicker"
                                                                disableDayPicker
                                                                inputClass="inputTImeMeeting"
                                                                format="HH:mm A"
                                                                selected={
                                                                  data.endDate
                                                                }
                                                                plugins={[
                                                                  <TimePicker
                                                                    hideSeconds
                                                                  />,
                                                                ]}
                                                                onChange={(
                                                                  date
                                                                ) =>
                                                                  handleEndDateChange(
                                                                    index,
                                                                    date
                                                                  )
                                                                } // Update end date
                                                                disabled={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  )
                                                                    ? true
                                                                    : false
                                                                }
                                                              />
                                                            </Col>
                                                          </Row>
                                                          {index !== 0 && (
                                                            <img
                                                              draggable={false}
                                                              src={redcrossIcon}
                                                              height="25px"
                                                              width="25px"
                                                              className={
                                                                styles[
                                                                  "RedCross_Icon_class_Main_agenda"
                                                                ]
                                                              }
                                                              onClick={() => {
                                                                handleCrossIcon(
                                                                  index
                                                                );
                                                              }}
                                                            />
                                                          )}
                                                        </Col>
                                                      </Row>
                                                      <Row className="mt-2">
                                                        <Col
                                                          lg={12}
                                                          md={12}
                                                          sm={12}
                                                        >
                                                          <span
                                                            className={
                                                              styles[
                                                                "Show_Details_Tag"
                                                              ]
                                                            }
                                                            onClick={() => {
                                                              handleExpandedBtn(
                                                                index
                                                              );
                                                            }}
                                                          >
                                                            {expand === true
                                                              ? t(
                                                                  "Hide-details"
                                                                )
                                                              : t(
                                                                  "Show-details"
                                                                )}
                                                          </span>
                                                        </Col>
                                                      </Row>
                                                      {expandIndex === index ? (
                                                        <>
                                                          <Row
                                                            key={index + 3}
                                                            className="mt-3"
                                                          >
                                                            <Col
                                                              lg={12}
                                                              md={12}
                                                              sm={12}
                                                            >
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "Agenda_Heading"
                                                                  ]
                                                                }
                                                              >
                                                                {t(
                                                                  "Attachments"
                                                                )}
                                                              </span>
                                                            </Col>
                                                          </Row>
                                                          <Row
                                                            key={index + 4}
                                                            className="mt-3"
                                                          >
                                                            <Col
                                                              lg={6}
                                                              md={6}
                                                              sm={6}
                                                            >
                                                              <Radio.Group
                                                                onChange={(e) =>
                                                                  handleRadioChange(
                                                                    index,
                                                                    e.target
                                                                      .value
                                                                  )
                                                                }
                                                                value={
                                                                  data.value
                                                                }
                                                                disabled={
                                                                  apllyLockOnParentAgenda(
                                                                    index
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
                                                                    {t(
                                                                      "Document"
                                                                    )}
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
                                                                draggable={
                                                                  false
                                                                }
                                                                src={Key}
                                                                width="24.07px"
                                                                height="24.09px"
                                                                className="cursor-pointer"
                                                                onClick={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  )
                                                                    ? ""
                                                                    : openAdvancePermissionModal
                                                                }
                                                              />
                                                              <img
                                                                draggable={
                                                                  false
                                                                }
                                                                src={Cast}
                                                                width="25.85px"
                                                                height="25.89px"
                                                                className="cursor-pointer"
                                                                onClick={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  )
                                                                    ? ""
                                                                    : openVoteMOdal
                                                                }
                                                              />
                                                              <img
                                                                draggable={
                                                                  false
                                                                }
                                                                src={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  )
                                                                    ? DarkLock
                                                                    : Lock
                                                                }
                                                                width="18.87px"
                                                                className={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  )
                                                                    ? styles[
                                                                        "lockBtn_inActive"
                                                                      ]
                                                                    : styles[
                                                                        "lockBtn"
                                                                      ]
                                                                }
                                                                height="26.72px"
                                                                onClick={() =>
                                                                  lockFunctionActive(
                                                                    index
                                                                  )
                                                                }
                                                              />
                                                            </Col>
                                                          </Row>
                                                          {data.selectedRadio ===
                                                          "1" ? (
                                                            <Documents
                                                              data={data}
                                                              index={index}
                                                              setRows={setRows}
                                                              rows={rows}
                                                            />
                                                          ) : data.selectedRadio ===
                                                            "2" ? (
                                                            <Urls
                                                              data={data}
                                                              index={index}
                                                              setRows={setRows}
                                                              rows={rows}
                                                            />
                                                          ) : data.selectedRadio ===
                                                            "3" ? (
                                                            <RequestContributor
                                                              data={data}
                                                              index={index}
                                                              setRows={setRows}
                                                              rows={rows}
                                                            />
                                                          ) : (
                                                            <DefaultDragger
                                                              index={index}
                                                            />
                                                          )}
                                                        </>
                                                      ) : null}
                                                    </section>
                                                  </Col>
                                                </Row>
                                              </Col>
                                            </Row>
                                          </span>
                                          {/* SubAgenda Mapping */}
                                          {
                                            <SubAgendaMappingDragging
                                              data={data}
                                              index={index}
                                              setRows={setRows}
                                              rows={rows}
                                              subexpandIndex={subexpandIndex}
                                              expandSubIndex={expandSubIndex}
                                              subExpand={subExpand}
                                              apllyLockOnParentAgenda={
                                                apllyLockOnParentAgenda
                                              }
                                              subLockArry={subLockArry}
                                              setSubLockArray={setSubLockArray}
                                              agendaItemRemovedIndex={
                                                agendaItemRemovedIndex
                                              }
                                              setAgendaItemRemovedIndex={
                                                setAgendaItemRemovedIndex
                                              }
                                              setSubajendaRemoval={
                                                setSubajendaRemoval
                                              }
                                              setsubexpandIndex={
                                                setsubexpandIndex
                                              }
                                              setExpandSubIndex={
                                                setExpandSubIndex
                                              }
                                              setSubExpand={setSubExpand}
                                              openAdvancePermissionModal={
                                                openAdvancePermissionModal
                                              }
                                              openVoteMOdal={openVoteMOdal}
                                            />
                                          }
                                          {/* sub Ajenda Button */}
                                          <Row className="mt-5">
                                            <Col lg={12} md={12} sm={12}>
                                              <Button
                                                text={
                                                  <>
                                                    <Row>
                                                      <Col
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        className="d-flex justify-content-center gap-2 align-items-center"
                                                      >
                                                        <img
                                                          draggable={false}
                                                          src={plusFaddes}
                                                          height="10.77px"
                                                          width="10.77px"
                                                        />
                                                        <span
                                                          className={
                                                            styles[
                                                              "Add_Agen_Heading"
                                                            ]
                                                          }
                                                        >
                                                          {t("Add-sub-agenda")}
                                                        </span>
                                                      </Col>
                                                    </Row>
                                                  </>
                                                }
                                                className={
                                                  styles["AddMoreBtnAgenda"]
                                                }
                                                onClick={() => {
                                                  addSubAjendaRows(index);
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                        </div>
                                      )}
                                    </Draggable>
                                    {/* Line Seperator */}
                                    <Row className="mt-3">
                                      <Col lg={12} md={12} sm={12}>
                                        <img
                                          draggable={false}
                                          src={line}
                                          className={styles["LineStyles"]}
                                        />
                                      </Col>
                                    </Row>
                                  </>
                                );
                              })
                            : null}
                        </section>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Col>
              </Row>
            </DragDropContext>
            {/* Seperator For Footer */}
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <Button
                  text={
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-center gap-2 align-items-center"
                        >
                          <img
                            draggable={false}
                            src={plusFaddes}
                            height="10.77px"
                            width="10.77px"
                          />
                          <span className={styles["Add_Agen_Heading"]}>
                            {t("Add-agenda")}
                          </span>
                        </Col>
                      </Row>
                    </>
                  }
                  className={styles["AddMoreBtnAgenda"]}
                  onClick={addRow}
                />
              </Col>
            </Row>
            <Row className="mt-5">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Import-previous-agenda")}
                  className={styles["Agenda_Buttons"]}
                  onClick={handlePreviousAgenda}
                />
                <Button
                  text={t("Cancel")}
                  className={styles["Agenda_Buttons"]}
                />
                <Button
                  text={t("Save-and-Next")}
                  className={styles["Save_Agenda_btn"]}
                  onClick={handleSavedViewAgenda}
                />
              </Col>
            </Row>
          </section>
        </>
      )}

      {NewMeetingreducer.agendaItemRemoved && (
        <AgenItemremovedModal
          setRows={setRows}
          setSubajendaRemoval={setSubajendaRemoval}
          agendaItemRemovedIndex={agendaItemRemovedIndex}
        />
      )}
      {NewMeetingreducer.mainAgendaItemRemoved && (
        <MainAjendaItemRemoved
          mainAgendaRemovalIndex={mainAgendaRemovalIndex}
          rows={rows}
          setRows={setRows}
        />
      )}
      {NewMeetingreducer.advancePermissionModal && <AdvancePersmissionModal />}
      {NewMeetingreducer.advancePermissionConfirmation && (
        <PermissionConfirmation />
      )}
      {NewMeetingreducer.voteAgendaModal && <VoteModal />}
      {NewMeetingreducer.voteConfirmationModal && <VoteModalConfirm />}
      {NewMeetingreducer.importPreviousAgendaModal && <ImportPrevious />}
    </>
  );
};

export default Agenda;
