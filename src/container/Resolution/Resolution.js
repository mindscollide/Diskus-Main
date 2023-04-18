import React, { Fragment, useState } from "react";
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
import { getResolutions } from "../../store/actions/Resolution_actions";
import { useDispatch,useSelector } from "react-redux";

const Resolution = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {ResolutionReducer} = useSelector(state => state)
  console.log(ResolutionReducer, "ResolutionReducerResolutionReducerResolutionReducer")
  const [newresolution, setNewresolution] = useState(false);
  const [viewresolution, setViewresolution] = useState(false);
  const [resultresolution, setResultresolution] = useState(false);
  const [voteresolution, setVoteresolution] = useState(false);
  const [closedbtntable, setClosedbtntable] = useState(false);
  const [currentbtn, setCurrentbtn] = useState(false);
  const [searchIcon, setSearchIcon] = useState(false);
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
    setClosedbtntable(false);
    setCurrentbtn(false);
    dispatch(getResolutions(3,t))
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
  const resolutionvoting = () => {
    setVoteresolution(true);
  };
  const columnsToDo = [
    {
      title: t("Resolution-title"),
      dataIndex: "ResolutionTitle",
      key: "ResolutionTitle",
      align: "left",
      width: "365px",
    },

    {
      title: t("Circulation-dates"),
      dataIndex: "CirculationDates",
      key: "CirculationDates",
      align: "center",
      width: "134px",
    },
    {
      title: t("Voting-deadline"),
      dataIndex: "VotingDeadline",
      key: "VotingDeadline",
      align: "center",
      width: "133px",
    },
    {
      title: t("Decision-dates"),
      dataIndex: "DecisionDates",
      key: "DecisionDates",
      align: "center",
      width: "115px",
    },
    {
      title: t("Decision"),
      dataIndex: "Decision",
      key: "Decision",
      align: "center",
      width: "76px",
    },
    {
      title: t("Vote"),
      dataIndex: "Vote",
      align: "center",
      key: "Vote",
      width: "45px",
    },
    {
      title: t("Vote-count"),
      dataIndex: "VoteCount",
      align: "center",
      key: "VoteCount",
      width: "78px",
    },
    {
      title: t("Result"),
      dataIndex: "Result",
      align: "center",
      key: "Result",
      width: "53px",
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
      width: "39px",
    },
  ];

  const columnsClosedbtn = [
    {
      title: t("Resolution-title"),
      dataIndex: "ResolutionTitle",
      key: "ResolutionTitle",
      width: "365px",
      sortDirections: ["descend", "ascend"],
    },

    {
      title: t("Voting-deadline"),
      dataIndex: "VotingDeadline",
      key: "VotingDeadline",
      align: "left",
      width: "155px",
    },
    {
      title: t("Decision-dates"),
      dataIndex: "DecisionDates",
      key: "DecisionDates",
      align: "left",
      width: "153px",
    },
    {
      title: t("Voting-method"),
      dataIndex: "Votingmethod",
      key: "Votingmethod",
      width: "131px",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: t("Attachment"),
      dataIndex: "Attachment",
      key: "Attachment",
      width: "104px",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: t("Vote"),
      dataIndex: "Vote",
      key: "Vote",
      width: "41px",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: t("Decision"),
      dataIndex: "Decision",
      key: "Decision",
      width: "73px",
      sortDirections: ["descend", "ascend"],
    },
  ];

  const columnsCurrentbtntable = [
    {
      title: t("Resolution-title"),
      dataIndex: "ResolutionTitle",
      key: "ResolutionTitle",
      align: "left",
      width: "365px",
    },

    {
      title: t("Circulation-dates"),
      dataIndex: "CirculationDates",
      key: "CirculationDates",
      align: "center",
      width: "134px",
    },
    {
      title: t("Voting-deadline"),
      dataIndex: "VotingDeadline",
      key: "VotingDeadline",
      align: "center",
      width: "133px",
    },
    {
      title: t("Decision-dates"),
      dataIndex: "DecisionDates",
      key: "DecisionDates",
      align: "center",
      width: "115px",
    },
    {
      title: t("Decision"),
      dataIndex: "Decision",
      key: "Decision",
      align: "center",
      width: "76px",
    },
    {
      title: t("Vote"),
      dataIndex: "Vote",
      align: "center",
      key: "Vote",
      width: "46px",
    },
    {
      title: t("Vote-count"),
      dataIndex: "VoteCount",
      align: "center",
      key: "VoteCount",
      width: "78px",
    },
    {
      title: t("Result"),
      dataIndex: "Result",
      align: "center",
      key: "Result",
      width: "53px",
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
      width: "39px",
    },
  ];
  const PkrvPaneldata = [
    {
      key: "1",
      ResolutionTitle: (
        <label className={styles["Resolution-Title"]}>
          Authorization of the officials for handling foreign exchange hey how
          re you hopw you will be fine i am also good here the reason that i
          wrote a letter a to you that i cant come tomoroow because i am
          ssuffering from
        </label>
      ),
      CirculationDates: (
        <label className={styles["circulation_dates"]}>March 6,2023</label>
      ),
      VotingDeadline: (
        <label className={styles["Voting_Dealine"]}>March 6,2023-09:00pm</label>
      ),
      DecisionDates: (
        <label className={styles["Decision_dates"]}>March 6,2023-09:00pm</label>
      ),
      Decision: <label className={styles["Decision"]}>Approved</label>,
      Vote: (
        <Button
          text="Vote"
          className={styles["vote_button"]}
          onClick={resolutionvoting}
        />
      ),
      VoteCount: <label className={styles["vote_count"]}>1/5</label>,
      Result: (
        <span className={styles["results_logo"]}>
          <Button
            icon={
              <img
                src={results}
                width="18px"
                height="22.83px"
                onClick={resultpage}
              />
            }
            className={styles["Result_btn"]}
          />
        </span>
      ),
      Edit: (
        <span className={styles["results_logo"]}>
          <img
            src={edit}
            width="21.59px"
            height="21.59px"
            // onClick={resolutionupdatedbtn}
            onClick={resolutionEdit}
          />
        </span>
      ),
    },
  ];

  const PkrvPaneldataClosedbtn = [
    {
      key: "1",
      ResolutionTitle: (
        <label className={styles["Resolution-Title"]}>
          Authorization of the officials for handling foreign exchange hello how
        </label>
      ),

      VotingDeadline: (
        <label className={styles["Voting_Dealine"]}>March 6,2023-09:00pm</label>
      ),
      DecisionDates: (
        <label className={styles["Decision_dates"]}>March 6,2023-09:00pm</label>
      ),
      Votingmethod: (
        <label className={styles["show_of_hands"]}>Show of hands</label>
      ),
      Attachment: (
        <img
          src={attachment}
          width="21.22"
          height="19.52"
          className={styles["attachment_Icon"]}
          onClick={viewAttachmentPageopen}
        />
      ),
      Vote: (
        <img
          src={thumbsdown}
          height="19.52"
          width="21.22"
          className={styles["thumbs_vote"]}
        />
      ),
      Decision: (
        <span className={styles["Approved_vote_resolution"]}>Approved</span>
      ),
    },
  ];

  const ContentdataCurrentbtn = [
    {
      key: "1",
      ResolutionTitle: (
        <label className={styles["Resolution-Title"]}>
          Authorization of the officials for handling foreign exchange hey how
          re you hopw you will be fine i am also good here the reason that i
          wrote a letter a to you that i cant come tomoroow because i am
          ssuffering from
        </label>
      ),
      CirculationDates: (
        <label className={styles["circulation_dates"]}>March 6,2023</label>
      ),
      VotingDeadline: (
        <label className={styles["Voting_Dealine"]}>March 6,2023-09:00pm</label>
      ),
      DecisionDates: (
        <label className={styles["Decision_dates"]}>March 6,2023-09:00pm</label>
      ),
      Decision: <label className={styles["Decision_pending"]}>Pending</label>,
      Vote: (
        <Button
          text="Vote"
          className={styles["vote_button"]}
          onClick={resolutionvoting}
        />
      ),
      VoteCount: <label className={styles["vote_count"]}>1/5</label>,
      Result: (
        <span className={styles["results_logo"]}>
          <Button
            icon={
              <img
                src={results}
                width="18px"
                height="22.83px"
                onClick={resultpage}
              />
            }
            className={styles["Result_btn"]}
          />
        </span>
      ),
      Edit: (
        <span className={styles["results_logo"]}>
          <img
            src={edit}
            width="21.59px"
            height="21.59px"
            onClick={resolutionupdatedbtn}
          />
        </span>
      ),
    },
  ];
  return (
    <>
      <section className={styles["resolution_container"]}>
        {newresolution ? (
          <>
            <ScheduleNewResolution />
          </>
        ) : viewresolution ? (
          <>
            <ViewResolution />
          </>
        ) : resultresolution ? (
          <ResultResolution />
        ) : voteresolution ? (
          <VotingPage />
        ) : viewattachmentpage ? (
          <>
            <ViewAttachments />
          </>
        ) : editresolutionPage ? (
          <>
            <EditResolution />
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
                {closedbtntable ? (
                  <>
                    <TableToDo
                      sortDirections={["descend", "ascend"]}
                      column={columnsClosedbtn}
                      className={"Resolution"}
                      pagination={{
                        pageSize: 50,
                        showSizeChanger: true,
                        pageSizeOptions: ["100 ", "150", "200"],
                      }}
                      rows={PkrvPaneldataClosedbtn}
                    />
                  </>
                ) : currentbtn ? (
                  <>
                    <TableToDo
                      sortDirections={["descend", "ascend"]}
                      column={columnsCurrentbtntable}
                      className={"Resolution"}
                      pagination={{
                        pageSize: 50,
                        showSizeChanger: true,
                        pageSizeOptions: ["100 ", "150", "200"],
                      }}
                      rows={ContentdataCurrentbtn}
                    />
                  </>
                ) : (
                  <>
                    <TableToDo
                      sortDirections={["descend", "ascend"]}
                      column={columnsToDo}
                      className={"Resolution"}
                      pagination={{
                        pageSize: 50,
                        showSizeChanger: true,
                        pageSizeOptions: ["100 ", "150", "200"],
                      }}
                      rows={PkrvPaneldata}
                    />
                  </>
                )}
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
