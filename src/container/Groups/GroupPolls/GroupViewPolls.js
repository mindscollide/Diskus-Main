import React, { useEffect, useState } from "react";
import styles from "./GroupViewPolls.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BinIcon from "../../../assets/images/bin.svg";
import { Pagination, Tooltip } from "antd";
import { useSelector } from "react-redux";
import addmore from "../../../assets/images/addmore.png";
import { Col, Row } from "react-bootstrap";
import { Button, Table } from "../../../components/elements";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import { ChevronDown } from "react-bootstrap-icons";
import emtystate from "../../../assets/images/EmptyStatesMeetingPolls.svg";
// import Createpolls from "./CreatePolls/Createpolls";
import Createpolls from "../GroupPolls/CreatePolls/CreateGrouppolls";
import CastVotePollsMeeting from "./CastVotePollsMeeting/CastVotePollsMeeting";
import {
  GetAllPollsByMeetingIdApiFunc,
  showCancelPolls,
  showUnsavedPollsMeeting,
} from "../../../store/actions/NewMeetingActions";
import EditPollsMeeting from "./EditPollsMeeting/EditPollsMeeting";
import AfterViewPolls from "./AfterViewPolls/AfterViewPolls";
import CancelPolls from "./CancelPolls/CancelPolls";
import ViewPollsUnPublished from "./VIewPollsUnPublished/ViewPollsUnPublished";
import ViewPollsPublishedScreen from "./ViewPollsPublishedScreen/ViewPollsPublishedScreen";
import { _justShowDateformatBilling } from "../../../commen/functions/date_formater";
import {
  deleteGroupPollApi,
  getPollByPollIdforGroups,
  getPollsByGroupMainApi,
  getPollsByPollIdApi,
} from "../../../store/actions/Polls_actions";
import CustomPagination from "../../../commen/functions/customPagination/Paginations";
const GroupViewPolls = ({
  setSceduleMeeting,
  setPolls,
  setAttendance,
  view,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer, GroupsReducer, PollsReducer } = useSelector(
    (state) => state
  );
  const [votePolls, setvotePolls] = useState(false);
  const [createpoll, setCreatepoll] = useState(false);
  const [editPolls, setEditPolls] = useState(false);
  const [pollsRows, setPollsRows] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [viewUnnPublished, setViewUnPublished] = useState(false);
  const [viewPublishedPoll, setViewPublishedPoll] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [afterViewPolls, setafterViewPolls] = useState(false);
  let currentMeetingID = Number(localStorage.getItem("meetingID"));
  let OrganizationID = localStorage.getItem("organizationID");
  let userID = localStorage.getItem("userID");
  let ViewGroupID = localStorage.getItem("ViewGroupID");

  console.log(GroupsReducer, "GroupsReducerGroupsReducerGroupsReducer");
  const enableAfterSavedViewPolls = () => {
    setafterViewPolls(true);
  };

  const handleCastVotePollMeeting = () => {
    setvotePolls(true);
  };

  const handleEditPollsMeeting = () => {
    setEditPolls(true);
  };

  const handleCacnelbutton = () => {
    dispatch(showCancelPolls(true));
  };

  const handleSaveAndnext = () => {
    setPolls(false);
    setAttendance(true);
  };

  useEffect(() => {
    let Data = {
      GroupID: Number(ViewGroupID),
      OrganizationID: Number(OrganizationID),
      CreatorName: "",
      PollTitle: "",
      PageNumber: 1,
      Length: 50,
    };
    dispatch(getPollsByGroupMainApi(navigate, t, Data));
  }, []);

  useEffect(() => {
    try {
      if (
        PollsReducer.getPollByGroupID !== undefined &&
        PollsReducer.getPollByGroupID !== null
      ) {
        setTotalRecords(PollsReducer.getPollByGroupID.totalRecords);
        let pollsData = PollsReducer.getPollByGroupID.polls;
        let newPollsArray = [];
        pollsData.forEach((data, index) => {
          console.log(data, "datadatadatadata");
          newPollsArray.push(data);
        });
        console.log(newPollsArray, "newPollsArraynewPollsArray");
        setPollsRows(newPollsArray);
      } else {
        setPollsRows([]);
      }
    } catch {}
  }, [PollsReducer.getPollByGroupID]);

  const handleEditBtn = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    dispatch(
      getPollByPollIdforGroups(
        navigate,
        data,
        1,
        t,
        setEditPolls,
        setvotePolls,
        setViewUnPublished,
        setViewPublishedPoll
      )
    );
    // dispatch(showunsavedEditPollsMeetings(false));
  };

  const handleDeletePoll = (record) => {
    let data = {
      PollID: record.pollID,
      GroupID: parseInt(ViewGroupID),
    };
    dispatch(deleteGroupPollApi(navigate, t, data));
  };

  const handleClickonTitle = (record) => {
    // getPollsByGroupMainApi;
    if (record.pollStatus.pollStatusId === 1) {
      let data = {
        PollID: record.pollID,
        UserID: parseInt(userID),
      };
      dispatch(
        getPollsByGroupMainApi(
          navigate,
          data,
          3,
          t,
          setEditPolls,
          setvotePolls,
          setViewUnPublished,
          setViewPublishedPoll
        )
      );
    } else if (record.pollStatus.pollStatusId === 2) {
      let data = {
        PollID: record.pollID,
        UserID: parseInt(userID),
      };
      dispatch(
        getPollsByGroupMainApi(
          navigate,
          data,
          4,
          t,
          setEditPolls,
          setvotePolls,
          setViewUnPublished,
          setViewPublishedPoll
        )
      );
    }
  };
  console.log(pollsRows, "pollsRowspollsRowspollsRows");
  const handleClickVoteCast = (record) => {
    let data = {
      PollID: record.pollID,
      UserID: parseInt(userID),
    };
    dispatch(
      getPollsByGroupMainApi(
        navigate,
        data,
        2,
        t,
        setEditPolls,
        setvotePolls,
        setViewUnPublished,
        setViewPublishedPoll
      )
    );
  };
  const PollsColoumn = [
    {
      title: t("Poll-title"),
      dataIndex: "pollTitle",
      key: "pollTitle",
      width: "300px",
      render: (text, record) => {
        return (
          <span
            className={styles["DateClass"]}
            onClick={
              () => handleClickonTitle(record)
              // navigate("/DisKus/polling", { state: { record, isVote: false } })
            }
          >
            {text}
          </span>
        );
      },
    },

    {
      title: t("Status"),
      dataIndex: "Status",
      key: "Status",
      width: "120px",
      filters: [
        {
          text: t("Published"),
          value: "Published", // Use the actual status value
        },
        {
          text: t("UnPublished"),
          value: "UnPublished", // Use the actual status value
        },
        {
          text: t("Expired"),
          value: "Expired", // Use the actual status value
        },
      ],
      defaultFilteredValue: ["Published", "UnPublished", "Expired"], // Use the actual status values here
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      onFilter: (value, record) =>
        record.pollStatus.status.indexOf(value) === 0,
      render: (text, record) => {
        console.log(record, "recordrecord");
        if (record.pollStatus?.pollStatusId === 2) {
          return <span className="text-success">{t("Published")}</span>;
        } else if (record.pollStatus?.pollStatusId === 1) {
          return <span className="text-success">{t("Unpublished")}</span>;
        } else if (record.pollStatus?.pollStatusId === 3) {
          return <span className="text-success">{t("Expired")}</span>;
        }
      },
    },
    {
      title: t("Due-date"),
      dataIndex: "dueDate",
      key: "dueDate",
      width: "90px",
      sorter: (a, b) =>
        new Date(
          a.dueDate.slice(0, 4),
          a.dueDate.slice(4, 6) - 1,
          a.dueDate.slice(6, 8)
        ) -
        new Date(
          b.dueDate.slice(0, 4),
          b.dueDate.slice(4, 6) - 1,
          b.dueDate.slice(6, 8)
        ),
      sortDirections: ["ascend", "descend"],
      render: (text, record) => {
        return _justShowDateformatBilling(text + "000000");
      },
    },

    {
      title: t("Poll-type"),
      dataIndex: "PollType",
      key: "PollType",
      width: "90px",
    },
    {
      title: t("Created-by"),
      dataIndex: "pollCreator",
      key: "pollCreator",
      width: "110px",
      sorter: (a, b) => a.pollCreator.localeCompare(b.pollCreator),
    },
    {
      title: t("Vote"),
      dataIndex: "Vote",
      width: "70px",
      render: (text, record) => {
        console.log("votevotevotevote", record);
        console.log("votevotevotevote", record.isVoter);
        if (record.pollStatus.pollStatusId === 2) {
          if (record.isVoter) {
            if (record.voteStatus === "Not Voted") {
              return (
                <Button
                  className={styles["Not_Vote_Button_Polls"]}
                  text={t("Vote")}
                  onClick={
                    () => handleClickVoteCast(record)
                    // navigate("/DisKus/polling", {
                    // state: { record, isVote: true },
                    // })
                  }
                />
              );
            } else if (record.voteStatus === "Voted") {
              return (
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={styles["Background-nonvoted-Button"]}
                >
                  <span className={styles["Not-voted"]}>{t("Voted")}</span>
                </Col>
              );
            }
          } else {
            return "";
          }
        } else if (record.pollStatus.pollStatusId === 1) {
          return "";
        } else if (record.pollStatus.pollStatusId === 3) {
          if (record.isVoter) {
            if (record.wasPollPublished) {
              if (record.voteStatus === "Not Voted") {
                return (
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Background-nonvoted-Button"]}
                  >
                    <span className={styles["Not-voted"]}>
                      {t("Not-voted")}
                    </span>
                  </Col>
                );
              } else {
                return (
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Vote_Button_Polls"]}
                  >
                    <span className={styles["Not-voted"]}>{t("Voted")}</span>
                  </Col>
                );
              }
            } else {
              return "";
            }
          } else {
            return "";
          }
        } else {
          return "";
        }
      },
    },
    {
      dataIndex: "Edit",
      width: "50px",
      render: (text, record) => {
        return (
          <>
            {Number(record.pollCreatorID) === Number(userID) ? (
              <>
                <Row>
                  {record.pollStatus.pollStatusId === 3 ? (
                    <>
                      {!record.wasPollPublished ? (
                        <>
                          <Col sm={12} md={5} lg={5}>
                            <Tooltip placement="topRight" title={t("Edit")}>
                              <img
                                src={EditIcon}
                                className="cursor-pointer"
                                width="21.59px"
                                height="21.59px"
                                alt=""
                                draggable="false"
                                onClick={() => handleEditBtn(record)}
                              />
                            </Tooltip>
                          </Col>
                          <Col sm={12} md={5} lg={5}></Col>
                        </>
                      ) : (
                        <>
                          <Col sm={12} md={5} lg={5}></Col>
                          <Col sm={12} md={5} lg={5}>
                            <Tooltip placement="topLeft" title={t("Delete")}>
                              <img
                                src={BinIcon}
                                alt=""
                                className="cursor-pointer"
                                width="21.59px"
                                height="21.59px"
                                draggable="false"
                                onClick={() => handleDeletePoll(record)}
                              />
                            </Tooltip>
                          </Col>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Col sm={12} md={5} lg={5}>
                        <Tooltip placement="topRight" title={t("Edit")}>
                          <img
                            src={EditIcon}
                            className="cursor-pointer"
                            width="21.59px"
                            height="21.59px"
                            alt=""
                            draggable="false"
                            onClick={() => handleEditBtn(record)}
                          />
                        </Tooltip>
                      </Col>
                      <Col sm={12} md={5} lg={5}>
                        <Tooltip placement="topLeft" title={t("Delete")}>
                          <img
                            src={BinIcon}
                            alt=""
                            className="cursor-pointer"
                            width="21.59px"
                            height="21.59px"
                            draggable="false"
                            onClick={() => handleDeletePoll(record)}
                          />
                        </Tooltip>
                      </Col>
                    </>
                  )}
                </Row>
              </>
            ) : null}
          </>
        );
      },
    },
  ];

  const handleCreatepolls = () => {
    dispatch(showUnsavedPollsMeeting(false));
    setCreatepoll(true);
  };
  const handleChangePagination = (current, pageSize) => {
    setPageNumber(current);
    setPageSize(pageSize);
    let Data = {
      GroupID: Number(ViewGroupID),
      OrganizationID: Number(OrganizationID),
      CreatorName: "",
      PollTitle: "",
      PageNumber: 1,
      Length: 50,
    };
    dispatch(getPollsByGroupMainApi(navigate, t, Data));
  };

  return (
    <>
      {afterViewPolls ? (
        <AfterViewPolls />
      ) : (
        <>
          <section>
            {createpoll ? (
              <Createpolls setCreatepoll={setCreatepoll} view={view} />
            ) : votePolls ? (
              <CastVotePollsMeeting setvotePolls={setvotePolls} />
            ) : editPolls ? (
              <EditPollsMeeting setEditPolls={setEditPolls} />
            ) : viewUnnPublished ? (
              <ViewPollsUnPublished setViewUnPublished={setViewUnPublished} />
            ) : viewPublishedPoll ? (
              <ViewPollsPublishedScreen
                setViewPublishedPoll={setViewPublishedPoll}
              />
            ) : (
              <>
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end "
                  >
                    <Button
                      text={t("Create-polls")}
                      icon={<img draggable={false} src={addmore} alt="" />}
                      className={styles["Create_polls_Button"]}
                      onClick={handleCreatepolls}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    {pollsRows.length > 0 ? (
                      <>
                        <section className={styles["MaintainingHeight"]}>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <Table
                                column={PollsColoumn}
                                rows={pollsRows}
                                scroll={{ y: "40vh" }}
                                pagination={false}
                                className="Polling_table"
                              />
                            </Col>
                          </Row>
                        </section>
                        {/* <Row className="mt-5">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-end gap-2"
                          >
                            <Button
                              text={t("Clone-meeting")}
                              className={styles["Cancel_Button_Polls_meeting"]}
                              onClick={enableAfterSavedViewPolls}
                            />

                            <Button
                              text={t("Cancel")}
                              className={styles["Cancel_Button_Polls_meeting"]}
                              onClick={handleCacnelbutton}
                            />

                            <Button
                              text={t("Save")}
                              className={styles["Cancel_Button_Polls_meeting"]}
                            />

                            <Button
                              text={t("Save-and-publish")}
                              className={styles["Cancel_Button_Polls_meeting"]}
                            />

                            <Button
                              text={t("Save-and-next")}
                              className={styles["Save_Button_Polls_meeting"]}
                              onClick={handleSaveAndnext}
                            />
                          </Col>
                        </Row> */}
                      </>
                    ) : (
                      <>
                        <Row className="mt-3">
                          <Col
                            lg={12}
                            ms={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <img
                              draggable={false}
                              src={emtystate}
                              height="230px"
                              width="293.93px"
                              alt=""
                            />
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <span className={styles["EmptyState_heading"]}>
                              {t("No-polls")}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <span className={styles["EmptyState_subHeading"]}>
                              {t(
                                "Be-the-first-to-create-a-poll-and-spark-the-conversation"
                              )}
                            </span>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Col>
                </Row>
                {pollsRows.length > 0 && (
                  <Row>
                    <Col sm={12} md={12} lg={12}>
                      <Row>
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className="pagination-groups-table d-flex justify-content-center my-3"
                        >
                          <CustomPagination
                            pageSizeOptionsValues={["30", "50", "100", "200"]}
                            current={pageNumber}
                            pageSize={pageSize}
                            total={totalRecords}
                            showSizer={totalRecords >= 9 ? true : false}
                            className={styles["PaginationStyle-Resolution"]}
                            onChange={handleChangePagination}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )}
              </>
            )}
            {NewMeetingreducer.cancelPolls && (
              <CancelPolls setSceduleMeeting={setSceduleMeeting} />
            )}
          </section>
        </>
      )}
    </>
  );
};

export default GroupViewPolls;
