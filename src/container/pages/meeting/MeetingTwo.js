import React, { useEffect, useState } from "react";
import styles from "./meetingTwo.module.css";
import searchicon from "../../../assets/images/searchicon.svg";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import ClipIcon from "../../../assets/images/ClipIcon.png";
import CommentIcon from "../../../assets/images/Comment-Icon.png";
import member from "../../../assets/images/member.svg";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import { useTranslation } from "react-i18next";
import { Pagination, Tooltip } from "antd";
import Select from "react-select";
import {
  Button,
  Table,
  TextField,
  Loader,
  Notification,
} from "../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { ChevronDown, Plus } from "react-bootstrap-icons";
import moment from "moment";
import SceduleMeeting from "./scedulemeeting/SceduleMeeting";
import { useSelector } from "react-redux";
const NewMeeting = () => {
  const { t } = useTranslation();
  const { NewMeetingreducer } = useSelector((state) => state);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [sceduleMeeting, setSceduleMeeting] = useState(false);
  const [searchMeeting, setSearchMeeting] = useState(false);
  // data for rows for first table
  const data = [
    {
      key: "1",
      pollTitle: (
        <label className={styles["Title_desc"]}>
          Board Member Executive Meeting from Boss's exe Board Member Executive
          Meeting from Boss's exe
        </label>
      ),
      status: <label className="column-boldness">Active</label>,
      Organizer: <label className="column-boldness">Mr. Abdul Qadir</label>,
      Date: <label className="column-boldness"> 3:30pm - 17th May, 2020</label>,
    },
  ];
  const [rowsData, setRowsData] = useState(data);
  console.log(rowsData, "rowsDatarowsDatarowsData");
  const HandleShowSearch = () => {
    setSearchMeeting(!searchMeeting);
  };
  const HandleCloseSearchModalMeeting = () => {
    setSearchMeeting(false);
  };

  const openSceduleMeetingPage = () => {
    setSceduleMeeting(true);
  };

  useEffect(() => {
    if (currentLanguage === "ar") {
      moment.locale(currentLanguage);
    } else if (currentLanguage === "fr") {
      moment.locale(currentLanguage);
    } else {
      moment.locale(currentLanguage);
    }
  }, [currentLanguage]);
  const MeetingColoumns = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Title")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "pollTitle",
      key: "pollTitle",
      width: "185px",
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "40px",
      filters: [
        {
          text: t("Active"),
          value: "Active",
          className: currentLanguage,
        },
        {
          text: t("Upcoming"),
          value: "Upcoming",
        },
        {
          text: t("Ended"),
          value: "Ended",
        },
        {
          text: t("Not-conducted"),
          value: "Not conducted",
        },
      ],
      defaultFilteredValue: ["Published", "Unpublished"],
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
    },
    {
      title: t("Organizer"),
      dataIndex: "Organizer",
      key: "Organizer",
      width: "60px",
    },
    {
      title: t("Date-time"),
      dataIndex: "Date",
      key: "Date",
      width: "87px",
    },
    {
      dataIndex: "Chat",
      key: "Chat",
      width: "46px",
      render: (text, record) => {
        return (
          <>
            <Row>
              <Col sm={12} md={12} lg={12} className="d-flex gap-2">
                <Tooltip placement="topRight" title={t("ClipIcon")}>
                  <img
                    src={ClipIcon}
                    className="cursor-pointer"
                    width="14.02px"
                    height="16.03px"
                  />
                </Tooltip>
                <Tooltip placement="topLeft" title={t("Chat")}>
                  <img
                    src={CommentIcon}
                    className="cursor-pointer"
                    width="20.06px"
                    height="15.95px"
                  />
                </Tooltip>
                <Tooltip placement="topLeft" title={t("member")}>
                  <img
                    src={member}
                    className="cursor-pointer"
                    width="17.1px"
                    height="16.72px"
                  />
                </Tooltip>
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      dataIndex: "Join",
      key: "Join",
      width: "55px",
      render: (text, record) => {
        return (
          <>
            <Row>
              <Col sm={12} md={12} lg={12}>
                <Button
                  text={t("Join-meeting")}
                  className={styles["joining-Meeting"]}
                />
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      dataIndex: "Edit",
      key: "Edit",
      width: "33px",
      render: (text, record) => {
        return (
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex justify-content-end"
              >
                <Tooltip placement="topRight" title={t("Edit")}>
                  <img
                    src={EditIcon}
                    className="cursor-pointer"
                    width="17.11px"
                    height="17.11px"
                  />
                </Tooltip>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <section className={styles["NewMeeting_container"]}>
      {sceduleMeeting ? (
        <SceduleMeeting setSceduleMeeting={setSceduleMeeting} />
      ) : (
        <>
          <Row className="mt-2">
            <Col
              sm={12}
              md={6}
              lg={6}
              className="d-flex gap-3 align-items-center"
            >
              <span className={styles["NewMeetinHeading"]}>
                {t("Meetings")}
              </span>
              <Button
                text={t("Schedule-a-meeting")}
                className={styles["Newmeeting_Scehedule_meet"]}
                icon={<Plus width={20} height={20} fontWeight={800} />}
                onClick={openSceduleMeetingPage}
              />
            </Col>
            <Col
              sm={12}
              md={6}
              lg={6}
              className="d-flex justify-content-end align-items-center"
            >
              <span className="position-relative">
                <TextField
                  width={"502px"}
                  placeholder={t("Search")}
                  applyClass={"meetingSearch"}
                  name={"SearchVal"}
                  labelClass="d-none"
                  clickIcon={HandleShowSearch}
                  inputicon={
                    <img
                      src={searchicon}
                      className={styles["Search_Bar_icon_class"]}
                    />
                  }
                  iconClassName={styles["polling_searchinput"]}
                />
                {searchMeeting ? (
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Search-Box_meeting"]}
                      >
                        <Row className="mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-end"
                          >
                            <img
                              src={BlackCrossIcon}
                              className={styles["Cross_Icon_Styling"]}
                              width="16px"
                              height="16px"
                              onClick={HandleCloseSearchModalMeeting}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col lg={12} md={12} sm={12}>
                            <TextField
                              placeholder={t("Meeting-title")}
                              applyClass={"meetinInnerSearch"}
                              labelClass="d-none"
                            />
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col lg={6} md={6} sm={12}>
                            <Select />
                          </Col>
                          <Col lg={6} md={6} sm={12}>
                            <TextField
                              placeholder={t("Organizer-name")}
                              labelClass="d-none"
                              applyClass={"meetinInnerSearch"}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-end gap-2"
                          >
                            <Button
                              text={t("Reset")}
                              className={styles["ResetButtonMeeting"]}
                            />
                            <Button
                              text={t("Search")}
                              className={styles["SearchButtonMeetings"]}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Table
                column={MeetingColoumns}
                scroll={{ y: "62vh" }}
                pagination={false}
                className="Polling_table"
                rows={rowsData}
              />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col lg={4} md={4} sm={4}></Col>
            <Col
              lg={4}
              md={4}
              sm={4}
              className="d-flex justify-content-center "
            >
              <Row className={styles["PaginationStyle-Committee"]}>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={"pagination-groups-table"}
                >
                  <Pagination />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </section>
  );
};

export default NewMeeting;
