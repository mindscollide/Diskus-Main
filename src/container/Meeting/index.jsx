import React, { useState } from "react";
import { useMeetingContext } from "../../context/MeetingContext";
import PublishedMeeting from "./PublishMeetings/index";
import DraftMeeting from "./draftMeetings/index";
import UnPublishedMeeting from "./proposedMeeting/index";
import { Col, Row } from "react-bootstrap";
import ReactBootstrapDropdown from "react-bootstrap/Dropdown";
import styles from "./Meeting.module.css";
import { Plus } from "react-bootstrap-icons";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { Checkbox, Dropdown, Menu, Tooltip } from "antd";
import searchicon from "../../assets/images/searchicon.svg";
import BlackCrossIcon from "../../assets/images/BlackCrossIconModals.svg";
import ClipIcon from "../../assets/images/ClipIcon.png";
import VideoIcon from "../../assets/images/Video-Icon.png";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useTranslation } from "react-i18next";
import { checkFeatureIDAvailability } from "../../commen/functions/utils";
import { Button, TextField } from "../../components/elements";
import CustomButton from "../../components/elements/button/Button";
import ProposedMeeting from "./proposedMeeting/index";
import { useNewMeetingContext } from "../../context/NewMeetingContext";
import { useDispatch } from "react-redux";
import { clearMeetingState } from "../../store/actions/NewMeetingActions";
import CreateQuickMeeting from "../QuickMeeting/CreateQuickMeeting/CreateQuickMeeting";
import SceduleMeeting from "./componentComponents/scedulemeeting/SceduleMeeting";
import ProposedNewMeeting from "./componentComponents/ProposedNewMeeting/ProposedNewMeeting";

const MainMeeting = () => {
  const {
    isPublishedMeeting,
    setIsPublishedMeeting,
    isDraftMeetings,
    setIsDraftMeetings,
    isProposedMeeting,
    setIsProposedMeeting,
    quickMeeting,
    setQuickMeeting,
    isAdvanceMeetingCreate,
    setIsAdvanceMeetingCreate,
    isProposedMeetingCreate,
    setIsProposedMeetingCreate,
  } = useNewMeetingContext();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchMeeting, setSearchMeeting] = useState(false);
  const [searchFields, setSearchFeilds] = useState({
    MeetingTitle: "",
    Date: "",
    OrganizerName: "",
    DateView: "",
  });
  const [searchText, setSearchText] = useState("");
  const [entereventIcon, setentereventIcon] = useState(false);

  const HandleShowSearch = () => {
    setSearchMeeting(!searchMeeting);
    setSearchText("");
  };

  const handleClearSearch = async () => {
    setSearchText("");
    setSearchFeilds({
      MeetingTitle: "",
      Date: "",
      OrganizerName: "",
      DateView: "",
    });
    setSearchMeeting(false);
    setentereventIcon(false);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchMeeting(false);
    }
    setentereventIcon(true);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setSearchFeilds({
      ...searchFields,
      MeetingTitle: e.target.value,
    });
    setentereventIcon(true);
  };

  const HandleCloseSearchModalMeeting = () => {
    setSearchMeeting(false);
    setSearchText("");
    setSearchFeilds({
      MeetingTitle: "",
      Date: "",
      OrganizerName: "",
      DateView: "",
    });
    setentereventIcon(false);
  };

  const handleClickMeetingTab = (tab) => {
    if (tab === "published") {
      dispatch(clearMeetingState());
      setIsPublishedMeeting(true);
      setIsDraftMeetings(false);
      setIsProposedMeeting(false);
    } else if (tab === "draft") {
      dispatch(clearMeetingState());
      setIsPublishedMeeting(false);
      setIsDraftMeetings(true);
      setIsProposedMeeting(false);
    } else {
      dispatch(clearMeetingState());
      setIsPublishedMeeting(false);
      setIsDraftMeetings(false);
      setIsProposedMeeting(true);
    }
  };

  const handleClickCreateMeeting = (type) => {
    if (type === "quick") {
      setQuickMeeting(true);
    } else if (type === "advance") {
      setIsAdvanceMeetingCreate(true);
    } else if( type === "prpopsed") {
      setIsProposedMeetingCreate(true);
    }
  };

  if (isAdvanceMeetingCreate) {
    return <SceduleMeeting />;
  }
  if( isProposedMeetingCreate) {
    return <ProposedNewMeeting />
  }

  return (
    <>
      <section className={styles["Meeting_Wrapper"]}>
        <Row className='mt-2'>
          <Col sm={12} md={12} lg={8} className='d-flex align-items-center  '>
            <span className={styles["NewMeetinHeading"]}>{t("Meetings")}</span>
            <span>
              <ReactBootstrapDropdown className='SceduleMeetingButton d-inline-block position-relative ms-2'>
                <ReactBootstrapDropdown.Toggle title={t("Schedule-a-meeting")}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <Plus width={20} height={20} fontWeight={800} />
                      <span> {t("Schedule-a-meeting")}</span>
                    </Col>
                  </Row>
                </ReactBootstrapDropdown.Toggle>

                <ReactBootstrapDropdown.Menu>
                  {checkFeatureIDAvailability(1) ? (
                    <ReactBootstrapDropdown.Item
                      onClick={() => handleClickCreateMeeting("quick")}>
                      {t("Quick-meeting")}
                    </ReactBootstrapDropdown.Item>
                  ) : null}

                  {checkFeatureIDAvailability(9) ? (
                    <ReactBootstrapDropdown.Item
                      onClick={() => handleClickCreateMeeting("advance")}>
                      {t("Advance-meeting")}
                    </ReactBootstrapDropdown.Item>
                  ) : null}

                  {checkFeatureIDAvailability(12) ? (
                    <>
                      <ReactBootstrapDropdown.Item
                        onClick={() => handleClickCreateMeeting("prpopsed")}>
                        {t("Propose-new-meeting")}
                      </ReactBootstrapDropdown.Item>
                    </>
                  ) : null}
                </ReactBootstrapDropdown.Menu>
              </ReactBootstrapDropdown>
            </span>
          </Col>
          <Col sm={12} md={12} lg={4}>
            <div className='position-relative'>
              <TextField
                width={"100%"}
                placeholder={t("Search-on-meeting-title")}
                applyClass={"meetingSearch"}
                name={"SearchVal"}
                labelclass='d-none'
                value={searchText}
                change={handleSearchChange}
                onKeyDown={handleKeyPress}
                inputicon={
                  <>
                    <div className='d-flex gap-2 align-items-center justify-content-end'>
                      {entereventIcon === true ? (
                        <img
                          src={BlackCrossIcon}
                          className='cursor-pointer'
                          onClick={handleClearSearch}
                          alt=''
                          draggable='false'
                        />
                      ) : null}
                      <Tooltip
                        placement='bottomLeft'
                        showArrow={false}
                        title={t("Search-filters")}>
                        <img
                          src={searchicon}
                          className={styles["Search_Bar_icon_class"]}
                          onClick={HandleShowSearch} // Add click functionality here
                          alt=''
                          draggable='false'
                        />
                      </Tooltip>
                    </div>
                  </>
                }
                iconclassname={styles["polling_searchinput"]}
              />
              {searchMeeting ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["Search-Box_meeting"]}>
                      <Row className='mt-2'>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className='d-flex justify-content-end'>
                          <img
                            src={BlackCrossIcon}
                            className={"cursor-pointer"}
                            width='16px'
                            height='16px'
                            onClick={HandleCloseSearchModalMeeting}
                            alt=''
                            draggable='false'
                          />
                        </Col>
                      </Row>
                      <Row className='mt-4'>
                        <Col lg={12} md={12} sm={12}>
                          <TextField
                            placeholder={t("Meeting-title")}
                            applyClass={"meetinInnerSearch"}
                            labelclass='d-none'
                            name='MeetingTitle'
                            value={searchFields.MeetingTitle}
                            //   change={searchMeetingChangeHandler}
                          />
                        </Col>
                      </Row>
                      <Row className='mt-3'>
                        <Col lg={6} md={6} sm={12}>
                          <DatePicker
                            value={searchFields.DateView}
                            format={"DD/MM/YYYY"}
                            placeholder='DD/MM/YYYY'
                            render={
                              <InputIcon
                                placeholder='DD/MM/YYYY'
                                className='datepicker_input'
                              />
                            }
                            editable={false}
                            className='datePickerTodoCreate2'
                            onOpenPickNewDate={false}
                            //   calendar={calendarValue} // Arabic calendar
                            //   locale={localValue} // Arabic locale
                            //   ref={calendRef}
                            //   onFocusedDateChange={meetingDateChangeHandler}
                          />
                        </Col>
                        <Col lg={6} md={6} sm={12}>
                          <TextField
                            placeholder={t("Organizer-name")}
                            labelclass='d-none'
                            name='OrganizerName'
                            applyClass={"meetinInnerSearch"}
                            value={searchFields.OrganizerName}
                            //   change={searchMeetingChangeHandler}
                          />
                        </Col>
                      </Row>
                      <Row className='mt-4'>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className='d-flex justify-content-end gap-2'>
                          <Button
                            text={t("Reset")}
                            className={styles["ResetButtonMeeting"]}
                            //   onClick={handleReset}
                          />
                          <Button
                            text={t("Search")}
                            className={styles["SearchButtonMeetings"]}
                            //   onClick={handleSearch}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : null}
            </div>
          </Col>
        </Row>
        <section className={styles.MeetingListContainer}>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className='d-flex justify-content-start align-items-center gap-2'>
              <CustomButton
                text='Published'
                className={
                  isPublishedMeeting
                    ? styles.tabButton_Active
                    : styles.tabButton
                }
                onClick={() => handleClickMeetingTab("published")}
              />
              <CustomButton
                text='Draft'
                className={
                  isDraftMeetings ? styles.tabButton_Active : styles.tabButton
                }
                onClick={() => handleClickMeetingTab("draft")}
              />
              <CustomButton
                text='Proposed'
                className={
                  isProposedMeeting ? styles.tabButton_Active : styles.tabButton
                }
                onClick={() => handleClickMeetingTab("proposed")}
              />
            </Col>
          </Row>
          {isPublishedMeeting && <PublishedMeeting />}
          {isDraftMeetings && <DraftMeeting />}
          {isProposedMeeting && <ProposedMeeting />}
          {quickMeeting && (
            <CreateQuickMeeting
              setShow={setQuickMeeting}
              show={quickMeeting}
              // this is check from where its called 4 is from Meeting
              checkFlag={4}
            />
          )}
        </section>
      </section>
    </>
  );
};

export default MainMeeting;
