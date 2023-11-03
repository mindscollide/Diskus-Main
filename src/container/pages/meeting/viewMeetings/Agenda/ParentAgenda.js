import React, { useEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../../../components/elements";
import {
  showAdvancePermissionModal,
  showMainAgendaItemRemovedModal,
  showVoteAgendaModal,
  showCastVoteAgendaModal,
  showviewVotesAgenda,
} from "../../../../../store/actions/NewMeetingActions";
import styles from "./Agenda.module.css";
import Cast from "../../../../../assets/images/CAST.svg";
import profile from "../../../../../assets/images/newprofile.png";
import pdfIcon from "../../../../../assets/images/pdf_icon.svg";
import { Radio } from "antd";
import Urls from "./Urls";
import RequestContributor from "./RequestContributor";
import SubAgendaMappingDragging from "./SubAgendaMappingDragging";
import dropmdownblack from "../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../assets/images/whiteupper.png";
import Lock from "../../../../../assets/images/LOCK.svg";
import DarkLock from "../../../../../assets/images/BlackLock.svg";
import Key from "../../../../../assets/images/KEY.svg";
import { getRandomUniqueNumber } from "./drageFunction";
import ViewVoteModal from "../../scedulemeeting/Agenda/VotingPage/ViewVoteModal/ViewVoteModal";
import CastVoteAgendaModal from "../../scedulemeeting/Agenda/VotingPage/CastVoteAgendaModal/CastVoteAgendaModal";

const ParentAgenda = ({
  data,
  index,
  rows,
  setRows,
  setMainAgendaRemovalIndex,
  agendaItemRemovedIndex,
  setAgendaItemRemovedIndex,
  setSubajendaRemoval,
}) => {
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");

  const { NewMeetingreducer } = useSelector((state) => state);

  const dispatch = useDispatch();
  const [mainLock, setmainLock] = useState([]);
  const [subLockArry, setSubLockArray] = useState([]);
  const [expandSubIndex, setExpandSubIndex] = useState(0);
  const [expandIndex, setExpandIndex] = useState(-1);
  const [subexpandIndex, setsubexpandIndex] = useState(-1);
  const [expand, setExpand] = useState(true);
  const [subExpand, setSubExpand] = useState([]);
  //Timepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);

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
    setExpandIndex((prevIndex) => (prevIndex === index ? -1 : index));
    // setExpandIndex(index);
    // setExpand(!expand);
  };
  //Add Function To Add SubAgendas
  const addSubAjendaRows = (rowAgendaIndex) => {
    const updatedRows = [...rows];
    const nextSubAgendaID = updatedRows[0].subAgenda.length.toString();
    const newSubAgenda = {
      SubAgendaID: getRandomUniqueNumber().toString(),
      SubTitle: "",
      selectedOption: null,
      startDate: null,
      endDate: null,
      subSelectRadio: "1",
      SubAgendaUrlFieldRadio: "",
      subAgendarequestContributorUrl: "",
      subAgendarequestContributorEnterNotes: "",
      Subfiles: [],
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

  const EnableViewVoteModal = () => {
    dispatch(showviewVotesAgenda(true));
  };

  const EnableCastVoteModal = () => {
    dispatch(showCastVoteAgendaModal(true));
  };

  return (
    <Draggable
      key={data.ID}
      draggableId={data.ID}
      index={index}
      isDragDisabled={true}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          //   {...provided.dragHandleProps}
        >
          {/* Main Agenda Items Mapping */}
          <span className="position-relative">
            <Row key={data.ID} className="mt-4 m-0 p-0">
              <Col
                lg={12}
                md={12}
                sm={12}
                key={index + 1}
                className={
                  apllyLockOnParentAgenda(index)
                    ? styles["BackGround_Agenda_InActive"]
                    : styles["BackGround_Agenda"]
                }
              >
                <Row>
                  <Col
                    lg={1}
                    md={1}
                    sm={1}
                    className={styles["BackGroundNewImplemented"]}
                  >
                    <Row className="mt-4" isDragging={snapshot.isDragging}>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center align-items-center"
                        isDragging={snapshot.isDragging}
                        {...provided.dragHandleProps}
                      >
                        <img
                          draggable={false}
                          src={
                            expandIndex === index && expand
                              ? blackArrowUpper
                              : dropmdownblack
                          }
                          width="18.71px"
                          height="9.36px"
                          className={
                            expandIndex === index && expand
                              ? styles["Arrow_Expanded"]
                              : styles["Arrow"]
                          }
                          onClick={() => {
                            handleExpandedBtn(index);
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={11} md={11} sm={11}>
                    <section className={styles["SectionInnerClass"]}>
                      <Row key={index + 2} className="mt-4">
                        <Col lg={6} md={6} sm={12}>
                          <span className={styles["AgendaTitle_Heading"]}>
                            1. Get new computers from Techno City Mall. Also,
                            Get a new graphics card for the designer.
                          </span>
                        </Col>
                        <Col lg={6} md={6} sm={12} className="text-end">
                          <Button
                            text={t("Start-voting")}
                            className={styles["startVotingButton"]}
                          />
                          <Button
                            text={t("Cast-your-vote")}
                            className={styles["CastYourVoteButton"]}
                            onClick={EnableCastVoteModal}
                          />
                          <Button
                            text={t("View-votes")}
                            className={styles["ViewVoteButton"]}
                            onClick={EnableViewVoteModal}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={styles["Show_Details_Tag"]}
                            onClick={() => {
                              handleExpandedBtn(index);
                            }}
                          >
                            {expandIndex === index && expand
                              ? t("Hide-details")
                              : t("Show-details")}
                          </span>
                        </Col>
                      </Row>
                      {expandIndex === index && expand ? (
                        <>
                          <Row className="mt-2">
                            <Col lg={12} md={12} sm={12}>
                              <div className={styles["agendaCreationDetail"]}>
                                <img
                                  src={profile}
                                  className={styles["Image"]}
                                />
                                <p className={styles["agendaCreater"]}>
                                  Salman Memon
                                </p>
                                <span className={styles["agendaCreationTime"]}>
                                  12:15 PM - 12:15 PM
                                </span>
                              </div>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["ParaGraph_SavedMeeting"]}
                              >
                                Description
                              </span>
                            </Col>
                          </Row>
                          <Row key={index + 3} className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["Agenda_Heading"]}>
                                {t("Attachments")}
                              </span>
                            </Col>
                          </Row>
                          <Row key={index + 4} className="mt-3">
                            <Col lg={6} md={6} sm={6}>
                              <Radio.Group
                                onChange={(e) =>
                                  handleRadioChange(index, e.target.value)
                                }
                                value={data.selectedRadio}
                                disabled={
                                  apllyLockOnParentAgenda(index) ? true : false
                                }
                              >
                                <Radio value="1">
                                  <span
                                    className={styles["Radio_Button_options"]}
                                  >
                                    {t("Document")}
                                  </span>
                                </Radio>
                                <Radio value="2">
                                  <span
                                    className={styles["Radio_Button_options"]}
                                  >
                                    {t("URL")}
                                  </span>
                                </Radio>
                                <Radio value="3">
                                  <span
                                    className={styles["Radio_Button_options"]}
                                  >
                                    {t("Request from contributor")}
                                  </span>
                                </Radio>
                              </Radio.Group>
                            </Col>
                            {/* <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className="d-flex justify-content-end gap-4 align-items-center"
                            >
                              <img
                                draggable={false}
                                src={Key}
                                width="24.07px"
                                height="24.09px"
                                className="cursor-pointer"
                                onClick={
                                  apllyLockOnParentAgenda(index)
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
                                  apllyLockOnParentAgenda(index)
                                    ? ""
                                    : openVoteMOdal
                                }
                              />
                              <img
                                draggable={false}
                                src={
                                  apllyLockOnParentAgenda(index)
                                    ? DarkLock
                                    : Lock
                                }
                                width="18.87px"
                                className={
                                  apllyLockOnParentAgenda(index)
                                    ? styles["lockBtn_inActive"]
                                    : styles["lockBtn"]
                                }
                                height="26.72px"
                                onClick={() => lockFunctionActive(index)}
                              />
                            </Col> */}
                          </Row>
                          <Droppable
                            droppableId={`parent-${data.ID}-parent-attachments`}
                            type="attachment"
                          >
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {data.selectedRadio === "1" ? (
                                  <>
                                    <Row>
                                      <Col lg={3} md={3} sm={12}>
                                        <div
                                          className={
                                            styles["agendaFileAttachedView"]
                                          }
                                        >
                                          <span
                                            className={styles["agendaFileSpan"]}
                                          >
                                            <img
                                              src={pdfIcon}
                                              alt=""
                                              draggable="false"
                                            />{" "}
                                            Admin Dashboard Design 13 february
                                            prototype - Copy.pdf
                                          </span>
                                        </div>
                                      </Col>
                                      <Col lg={3} md={3} sm={12}>
                                        <div
                                          className={
                                            styles["agendaFileAttachedView"]
                                          }
                                        >
                                          <span
                                            className={styles["agendaFileSpan"]}
                                          >
                                            <img
                                              src={pdfIcon}
                                              alt=""
                                              draggable="false"
                                            />{" "}
                                            Admin Dashboard Design 13 february
                                            prototype - Copy.pdf
                                          </span>
                                        </div>
                                      </Col>
                                      <Col lg={3} md={3} sm={12}>
                                        <div
                                          className={
                                            styles["agendaFileAttachedView"]
                                          }
                                        >
                                          <span
                                            className={styles["agendaFileSpan"]}
                                          >
                                            <img
                                              src={pdfIcon}
                                              alt=""
                                              draggable="false"
                                            />{" "}
                                            Admin Dashboard Design 13 february
                                            prototype - Copy.pdf
                                          </span>
                                        </div>
                                      </Col>
                                      <Col lg={3} md={3} sm={12}>
                                        <div
                                          className={
                                            styles["agendaFileAttachedView"]
                                          }
                                        >
                                          <span
                                            className={styles["agendaFileSpan"]}
                                          >
                                            <img
                                              src={pdfIcon}
                                              alt=""
                                              draggable="false"
                                            />{" "}
                                            Admin Dashboard Design 13 february
                                            prototype - Copy.pdf
                                          </span>
                                        </div>
                                      </Col>
                                    </Row>

                                    {/* <Documents
                                          data={data}
                                          index={index}
                                          setRows={setRows}
                                          rows={rows}
                                          parentId={`parent-${data.ID}`}
                                        />
                                        <DefaultDragger
                                          setRows={setRows}
                                          rows={rows}
                                          index={index}
                                        /> */}
                                  </>
                                ) : data.selectedRadio === "2" ? (
                                  <Urls
                                    data={data}
                                    index={index}
                                    setRows={setRows}
                                    rows={rows}
                                  />
                                ) : data.selectedRadio === "3" ? (
                                  <RequestContributor
                                    data={data}
                                    index={index}
                                    setRows={setRows}
                                    rows={rows}
                                  />
                                ) : (
                                  <></>
                                  //
                                )}
                              </div>
                            )}
                          </Droppable>
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
              apllyLockOnParentAgenda={apllyLockOnParentAgenda}
              subLockArry={subLockArry}
              setSubLockArray={setSubLockArray}
              agendaItemRemovedIndex={agendaItemRemovedIndex}
              setAgendaItemRemovedIndex={setAgendaItemRemovedIndex}
              setSubajendaRemoval={setSubajendaRemoval}
              setsubexpandIndex={setsubexpandIndex}
              setExpandSubIndex={setExpandSubIndex}
              setSubExpand={setSubExpand}
              openAdvancePermissionModal={openAdvancePermissionModal}
              openVoteMOdal={openVoteMOdal}
            />
          }
          {NewMeetingreducer.viewVotesAgenda && <ViewVoteModal />}
          {NewMeetingreducer.castVoteAgendaPage && <CastVoteAgendaModal />}
          {/* sub Ajenda Button */}
          {/* <Row className="mt-3">
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
                          {t("Add-sub-agenda")}
                        </span>
                      </Col>
                    </Row>
                  </>
                }
                className={styles["AddMoreBtnAgenda"]}
                onClick={() => {
                  addSubAjendaRows(index);
                }}
              />
            </Col>
          </Row> */}
        </div>
      )}
    </Draggable>
  );
};

export default ParentAgenda;
