import React, { Fragment, useEffect, useState } from "react";
import styles from "./Resolution.module.css";
import {
  Button,
  TextField,
  TableToDo,
  SelectBox,
} from "../../components/elements";
import { Col, Row } from "react-bootstrap";
import searchicon from "../../assets/images/searchicon.svg";
import results from "../../assets/images/results.svg";
import edit from "../../assets/images/Groupedit.svg";
import thumbsup from "../../assets/images/thumbsup.svg";
import thumbsdown from "../../assets/images/thumbsdown.svg";
import { useTranslation } from "react-i18next";
import ScheduleNewResolution from "../../components/elements/ScheduleNewResolution/ScheduleNewResolution";
import ViewResolution from "../../components/elements/ViewResolution/ViewResolution";
import ResultResolution from "../../components/elements/ResultsPageResoution/ResultResolution";
import VotingPage from "../VotingPage/VotingPage";
import attachment from "../../assets/images/attch.svg";
import ModalResolutionUpdated from "../ModalResolutionUpdated/ModalResolutionUpdated";
import ViewAttachments from "../../components/elements/ViewAttachments/ViewAttachments";
import Cross from "../../assets/images/Cross-Chat-Icon.png";
import EditResolution from "../../components/elements/EditResolution/EditResolution";
import { getResolutionbyResolutionID, getResolutionResult, getResolutions, getVotesDetails } from "../../store/actions/Resolution_actions";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { newTimeFormaterAsPerUTCFullDate } from "../../commen/functions/date_formater";
import EditResolutionIcon from '../../assets/images/Edit_Resolution_Icon.svg'
import ResultResolutionIcon from '../../assets/images/Result_Resolution_Icon.svg'

const Resolution = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { ResolutionReducer } = useSelector(state => state)
  console.log(ResolutionReducer, "ResolutionReducerResolutionReducerResolutionReducer")
  const [newresolution, setNewresolution] = useState(false);
  const [viewresolution, setViewresolution] = useState(false);
  const [resultresolution, setResultresolution] = useState(false);
  const [voteresolution, setVoteresolution] = useState(false);
  const [closedbtntable, setClosedbtntable] = useState(false);
  const [currentbtn, setCurrentbtn] = useState(false);
  const [searchIcon, setSearchIcon] = useState(false);
  const [rows, setRows] = useState([])
  const [resolutionmodalupdated, setRresolutionmodalupdated] = useState(false);
  const [viewattachmentpage, setViewattachmentpage] = useState(false);
  const [editresolutionPage, setEditResoutionPage] = useState(false);
  const [searchResultsArea, setSearchResultsArea] = useState(false);
  const [currentTab, setCurrentTab] = useState(0)

  const showSearchOptions = () => {
    setSearchResultsArea(true);
  };

  const hideSearchOptions = () => {
    setSearchResultsArea(false);
  };
  const resolutionEdit = () => {
    setEditResoutionPage(true);
  };
  const viewAttachmentPageopen = () => {
    setViewattachmentpage(true);
  };
  const resolutionupdatedbtn = () => {
    setRresolutionmodalupdated(true);
  };
  const closeSeachBar = () => {
    setSearchIcon(false);
  };

  const openSearchBox = () => {
    setSearchIcon(true);
  };
  const currentbuttontable = () => {
    setCurrentbtn(true);
    setClosedbtntable(false);
  };
  const allbtntable = () => {
    // setClosedbtntable(false);
    // setCurrentbtn(false);
    // dispatch(getResolutions(3, t))
  };
  const createresolution = () => {
    setNewresolution(true);
  };

  const buttonclosed = () => {
    setClosedbtntable(true);
  };
  const resultpage = () => {
    setResultresolution(true);
    console.log("i am clicked ");
  };
  const viewresolutionpage = () => {
    setViewresolution(true);
  };

  const handleUpdateResolutionAction = (id) => {
    console.log(id, "Asdasdasd")
    dispatch(getResolutionbyResolutionID(id, t, setEditResoutionPage, setViewresolution, 1))
  }
  const viewResolution = (id) => {
    dispatch(getResolutionbyResolutionID(id, t, setEditResoutionPage, setViewresolution, 2))
  }
  const getResultHandle = (id) => {
    dispatch(getResolutionResult(id, t, setResultresolution))
  }
  const getVoteDetailHandler = (id) => {
    dispatch(getVotesDetails(id, t, setVoteresolution))
  }
  const columnsToDo = [
    {
      title: t("Resolution-title"),
      dataIndex: "resolutionTitle",
      key: "resolutionTitle",
      align: "left",
      width: "365px",
      render: (table, data) => {
        console.log(table, data, "checking")
        return <p className="cursor-pointer" onClick={() => viewResolution(data.resolutionID)}>{table}</p>
      }
    },

    {
      title: t("Circulation-dates"),
      dataIndex: "circulationDate",
      key: "circulationDate",
      align: "center",
      width: "134px",
      render: (table, data) => {
        console.log(table, data, "checking")
        return newTimeFormaterAsPerUTCFullDate(table)
      }
    },
    {
      title: t("Voting-deadline"),
      dataIndex: "votingDeadline",
      key: "votingDeadline",
      align: "center",
      width: "133px",
      render: (table, data) => {
        console.log(table, data, "checking")
        return newTimeFormaterAsPerUTCFullDate(table)
      }
    },
    {
      title: t("Decision-dates"),
      dataIndex: "decisionDate",
      key: "decisionDate",
      align: "center",
      width: "115px",
      render: (table, data) => {
        console.log(table, data, "checking")
        return newTimeFormaterAsPerUTCFullDate(table)
      }
    },
    {
      title: t("Decision"),
      dataIndex: "decision",
      key: "decision",
      align: "center",
      width: "76px",
    },
    {
      title: t("Vote"),
      dataIndex: "isVoter",
      align: "Vote",
      key: "isVoter",
      width: "45px",
      render: (table, data) => {
        console.log(table, data, "ssssss")
        if (table === false) {
          return <Button text="Vote" onClick={() => getVoteDetailHandler(data.resolutionID)} />
        } else return
      }
    },
    {
      title: t("Vote-count"),
      dataIndex: "voteCount",
      align: "center",
      key: "voteCount",
      width: "78px",
    },
    {
      title: t("Result"),
      dataIndex: "Result",
      align: "center",
      key: "Result",
      width: "53px",
      render: (table, data) => {
        return <img src={ResultResolutionIcon} onClick={() => getResultHandle(data.resolutionID)} />
      }
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
      width: "39px",
      render: (table, data) => {
        console.log(table, data, "sasdasd")
        return <img src={EditResolutionIcon} onClick={() => handleUpdateResolutionAction(data.resolutionID)} />
      }
    },
  ];

  useEffect(() => {
    dispatch(getResolutions(3, t))
  }, [])
  useEffect(() => {
    if (ResolutionReducer.GetResolutions !== null) {
      setRows(ResolutionReducer.GetResolutions)
    }
  }, [ResolutionReducer.GetResolutions])
  return (
    <>
      <section className={styles["resolution_container"]}>
        {newresolution ? (
          <>
            <ScheduleNewResolution newresolution={newresolution} setNewresolution={setNewresolution} />
          </>
        ) : viewresolution ? (
          <>
            <ViewResolution viewresolution={viewresolution} setViewresolution={setViewresolution} />
          </>
        ) : resultresolution ? (
          <>
            <ResultResolution setResultresolution={setResultresolution} resultresolution={resultresolution} />
          </>
        ) : voteresolution ? (
          <>
            <VotingPage setVoteresolution={setVoteresolution} voteresolution={voteresolution} />
          </>
        ) : viewattachmentpage ? (
          <>
            <ViewAttachments setViewattachmentpage={setViewattachmentpage} viewattachmentpage={viewattachmentpage} />
          </>
        ) : editresolutionPage ? (
          <>
            <EditResolution setViewresolution={setViewresolution} editresolutionPage={editresolutionPage} />
          </>
        ) : (
          <>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <Row>
                  <Col
                    lg={7}
                    md={7}
                    sm={7}
                    className=" d-flex justify-content-start align-items-center  gap-3 "
                  >
                    <span className={styles["Resolution-heading-size"]}>
                      {t("Resolution")}
                    </span>
                    <Button
                      className={styles["create-Resolution-btn"]}
                      text={"Create-new-resolution"}
                      onClick={createresolution}
                    />
                    <Button
                      className={styles["Resolution-All-btn"]}
                      text={t("All")}
                      onClick={allbtntable}

                    />
                    <Button
                      className={styles["Resolution-closed-btn"]}
                      text={t("Closed")}
                      onClick={viewresolutionpage}
                    // onClick={buttonclosed}
                    />
                    <Button
                      className={styles["Resolution-Current-btn"]}
                      text={t("Current")}
                      onClick={currentbuttontable}
                    />
                  </Col>

                  <Col
                    lg={5}
                    md={5}
                    sm={5}
                    className=" d-flex justify-content-end  align-items-center"
                  >
                    <TextField
                      width="455px"
                      name="Title"
                      placeholder={t("Search")}
                      labelClass="textFieldSearch d-none"
                    />
                    <img
                      src={searchicon}
                      height="19px"
                      width="19px"
                      className={styles["Search_Icon"]}
                      onClick={openSearchBox}
                    />
                    {searchIcon ? (
                      <>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={
                              styles["Search_Box_Main_Resolution_page"]
                            }
                          >
                            <Row className="mt-0">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-end"
                              >
                                <span>
                                  <img
                                    src={Cross}
                                    height="16px"
                                    width="16px"
                                    onClick={closeSeachBar}
                                  />
                                </span>
                              </Col>
                            </Row>
                            <Row className="mt-3">
                              <Col
                                lg={6}
                                md={6}
                                sm={6}
                                className="CreateMeetingReminder  select-participant-box"
                              >
                                <SelectBox
                                  name="Participant"
                                  placeholder={t("Circulation_date")}
                                />
                              </Col>
                              <Col
                                lg={6}
                                md={6}
                                sm={6}
                                className="CreateMeetingReminder  select-participant-box"
                              >
                                <SelectBox
                                  name="Participant"
                                  placeholder={t("Voting-deadline")}
                                />
                              </Col>
                            </Row>
                            <Row className="mt-3">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-end gap-3"
                              >
                                <Button
                                  text={t("Reset")}
                                  className={
                                    styles["ResetButton_SearchBar_Resolution"]
                                  }
                                  onClick={hideSearchOptions}
                                />
                                <Button
                                  text={t("Search")}
                                  className={
                                    styles["SearchButton_SearchBar_Resolution"]
                                  }
                                  onClick={showSearchOptions}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </>
                    ) : null}
                  </Col>
                </Row>
              </Col>
            </Row>
            {searchResultsArea ? (
              <>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Search_results"]}>
                      Search Results
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={3} md={3} sm={3}>
                    <Row>
                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        className="CreateMeetingReminder  select-participant-box"
                      >
                        <SelectBox
                          name="Participant"
                          placeholder={t("Circulation_date")}
                        />
                      </Col>
                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        className="CreateMeetingReminder  select-participant-box"
                      >
                        <SelectBox
                          name="Participant"
                          placeholder={t("Voting-deadline")}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            ) : null}
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <TableToDo
                  sortDirections={["descend", "ascend"]}
                  column={columnsToDo}
                  className={"Resolution"}
                  pagination={{
                    pageSize: 50,
                    showSizeChanger: true,
                    pageSizeOptions: ["100 ", "150", "200"],
                  }}
                  loading={{ indicator: <div className={styles["resolution_spinner"]}><Spin /></div>, spinning: ResolutionReducer.Loading }}
                  rows={rows}
                />
              </Col>
            </Row>
          </>
        )}
      </section>
      {resolutionmodalupdated ? (
        <ModalResolutionUpdated
          resolutionupdated={resolutionmodalupdated}
          setResolutionupdated={setRresolutionmodalupdated}
        />
      ) : null}
    </>
  );
};

export default Resolution;
