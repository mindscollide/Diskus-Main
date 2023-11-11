import React, { useEffect, useState } from "react";
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
  showVoteAgendaModal,
  showCastVoteAgendaModal,
  showviewVotesAgenda,
} from "../../../../../store/actions/NewMeetingActions";
import styles from "./Agenda.module.css";
import profile from "../../../../../assets/images/newprofile.png";
import pdfIcon from "../../../../../assets/images/pdf_icon.svg";
import { Radio } from "antd";
import Urls from "./Urls";
import RequestContributor from "./RequestContributor";
import SubAgendaMappingDragging from "./SubAgendaMappingDragging";
import dropmdownblack from "../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../assets/images/whiteupper.png";
import ViewVoteModal from "../../scedulemeeting/Agenda/VotingPage/ViewVoteModal/ViewVoteModal";
import CastVoteAgendaModal from "../../scedulemeeting/Agenda/VotingPage/CastVoteAgendaModal/CastVoteAgendaModal";
import {
  getFileExtension,
  getIconSource,
} from "../../../../DataRoom/SearchFunctionality/option";

const ParentAgenda = ({
  data,
  index,
  rows,
  setRows,
  setMainAgendaRemovalIndex,
  agendaItemRemovedIndex,
  setAgendaItemRemovedIndex,
  setSubajendaRemoval,
  ediorRole,
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

  // Function For Expanding Main Agenda See More Options
  const handleExpandedBtn = (index) => {
    setExpandIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const openAdvancePermissionModal = () => {
    dispatch(showAdvancePermissionModal(true));
  };

  const openVoteMOdal = () => {
    dispatch(showVoteAgendaModal(true));
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
        <div ref={provided.innerRef} {...provided.draggableProps}>
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
                          alt=""
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
                            {data.title}
                          </span>
                        </Col>
                        <Col lg={6} md={6} sm={12} className="text-end">
                          {Number(ediorRole.status) === 10 ? (
                            <Button
                              text={t("Start-voting")}
                              className={styles["startVotingButton"]}
                            />
                          ) : null}

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
                                  alt=""
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
                                {data.description}
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
                                <Radio value={1}>
                                  <span
                                    className={styles["Radio_Button_options"]}
                                  >
                                    {t("Document")}
                                  </span>
                                </Radio>
                                <Radio value={2}>
                                  <span
                                    className={styles["Radio_Button_options"]}
                                  >
                                    {t("URL")}
                                  </span>
                                </Radio>
                                <Radio value={3}>
                                  <span
                                    className={styles["Radio_Button_options"]}
                                  >
                                    {t("Request from contributor")}
                                  </span>
                                </Radio>
                              </Radio.Group>
                            </Col>
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
                                {data.selectedRadio === 1 &&
                                  Object.keys(data.files).length > 0 && (
                                    <Row gutter={[16, 16]}>
                                      {data.files.map(
                                        (filesData, fileIndex) => (
                                          <Col
                                            key={fileIndex}
                                            lg={3}
                                            md={3}
                                            sm={12}
                                          >
                                            <div
                                              className={
                                                styles["agendaFileAttachedView"]
                                              }
                                            >
                                              <span
                                                className={
                                                  styles["agendaFileSpan"]
                                                }
                                              >
                                                <img
                                                  draggable={false}
                                                  src={getIconSource(
                                                    getFileExtension(
                                                      filesData.displayAttachmentName
                                                    )
                                                  )}
                                                  alt=""
                                                />{" "}
                                                {
                                                  filesData.displayAttachmentName
                                                }
                                              </span>
                                            </div>
                                          </Col>
                                        )
                                      )}
                                    </Row>
                                  )}

                                {data.selectedRadio === 2 && (
                                  <Urls
                                    data={data}
                                    index={index}
                                    setRows={setRows}
                                    rows={rows}
                                  />
                                )}

                                {data.selectedRadio === 3 && (
                                  <RequestContributor
                                    data={data}
                                    index={index}
                                    setRows={setRows}
                                    rows={rows}
                                  />
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
