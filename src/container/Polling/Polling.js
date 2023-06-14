import React, { useState } from "react";
import styles from "./Polling.module.css";
import { Row, Col } from "react-bootstrap";
import { Button, Table, TextField } from "../../components/elements";
import { useTranslation } from "react-i18next";
import searchicon from "../../assets/images/searchicon.svg";
import CreatePolling from "./CreatePolling/CreatePollingModal";
import { ChevronDown, Plus } from "react-bootstrap-icons";
import BlackCrossIcon from "../../assets/images/BlackCrossIconModals.svg";
import EditIcon from "../../assets/images/Edit-Icon.png";
import UpdatePolls from "./UpdatePolls/UpdatePolls";
import plusbutton from "../../assets/images/Group 119.svg";
import ViewPoll from "./ViewPoll/ViewPoll";
import ViewPollProgress from "./ViewPoll/ViewPollProgress/ViewPollProgress";
import PollDetails from "./PollDetails/PollDetails";
import Votepoll from "./VotePoll/Votepoll";
import UpdateSecond from "./UpdateSecond/UpdateSecond";
const Polling = () => {
  const [isCreatePoll, setIsCreatePoll] = useState(false);
  const [isUpdatePoll, setIsUpdatePoll] = useState(false);
  const [viewprogress, setViewprogress] = useState(false);
  const [updatePublished, setUpdatePublished] = useState(false);
  const [isVotePoll, setisVotePoll] = useState(false);
  const [viewPollsDetails, setViewPollsDetails] = useState(false);
  const [isViewPoll, setIsViewPoll] = useState(false);
  const [pollsState, setPollsState] = useState({
    searchValue: "",
  });
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [searchBoxState, setsearchBoxState] = useState({
    searchByName: "",
    searchByTitle: "",
  });
  const [searchpoll, setSearchpoll] = useState(false);
  const showViewProgressBarModal = () => {
    setViewprogress(true);
  };

  const ShowPollsDetailsModal = () => {
    setViewPollsDetails(true);
  };

  const OpenVotePollModal = () => {
    setisVotePoll(true);
  };

  const OpenUpdatePublished = () => {
    setUpdatePublished(true);
  };
  const { t } = useTranslation();
  const PollTableColumns = [
    {
      title: t("Post-title"),
      dataIndex: "title",
      key: "title",
      width: "365px",
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "62px",
      filters: [
        {
          text: t("Published"),
          value: "InProgress",
          className: currentLanguage,
        },
        {
          text: t("Unpublished"),
          value: "Pending",
        },
      ],
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      render: (text, record) => {
        if (text === 1) {
          return <span className="text-success">{t("Published")}</span>;
        } else if (text === 2) {
          return <span className="text-success">{t("Unpublished")}</span>;
        }
      },
    },
    {
      title: t("Due-date"),
      dataIndex: "dueDate",
      key: "dueDate",
      width: "89px",
    },
    {
      title: t("Created-by"),
      dataIndex: "createBy",
      key: "createBy",
      width: "97px",
    },
    {
      title: t("Vote"),
      dataIndex: "vote",
      key: "vote",
      width: "59px",
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      width: "33px",
    },
  ];
  const RowsData = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span
                className={styles["Table_title"]}
                onClick={() => {
                  setIsViewPoll(true);
                }}
              >
                test title
              </span>
            </Col>
          </Row>
        </>
      ),
      status: 1,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Button text={t("Vote")} className={styles["Vote_button_poll"]} />
            </Col>
          </Row>
        </>
      ),
      Edit: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center cursor-pointer"
            >
              <img
                src={EditIcon}
                width="21.59px"
                height="21.59px"
                onClick={() => {
                  setIsUpdatePoll(true);
                }}
              />
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-start"
            >
              <span onClick={showViewProgressBarModal}>
                View Progress Modal
              </span>
            </Col>
          </Row>
        </>
      ),
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-start"
            >
              <Button text={t("Vote")} className={styles["Voted_after"]} />
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span onClick={ShowPollsDetailsModal}>Poll Details</span>
            </Col>
          </Row>
        </>
      ),
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 4,
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span onClick={OpenVotePollModal}>Votepoll</span>
            </Col>
          </Row>
        </>
      ),
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 2,
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span onClick={OpenUpdatePublished}> Update Published </span>
            </Col>
          </Row>
        </>
      ),
      status: 1,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 1,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 1,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
  ];

  const HandleSearchPollsMain = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "SearchVal") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (value !== "") {
        setPollsState({
          ...pollsState,
          searchValue: valueCheck,
        });
      } else {
        setPollsState({
          ...pollsState,
          searchValue: "",
        });
      }
    }
  };

  const HandleSearchboxNameTitle = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "searchbytitle") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (value !== "") {
        setsearchBoxState({
          ...searchBoxState,
          searchByTitle: valueCheck,
        });
      } else {
        setsearchBoxState({
          ...searchBoxState,
          searchByTitle: "",
        });
      }
    }
    if (name === "seachbyname") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (value !== "") {
        setsearchBoxState({
          ...searchBoxState,
          searchByName: valueCheck,
        });
      } else {
        setsearchBoxState({
          ...searchBoxState,
          searchByName: "",
        });
      }
    }
  };

  const ResetSearchBtn = () => {
    setsearchBoxState({
      ...searchBoxState,
      searchByName: "",
      searchByTitle: "",
    });
  };

  const HandleShowSearch = () => {
    setSearchpoll(true);
  };

  const HandleCloseSearchModal = () => {
    setSearchpoll(false);
  };
  return (
    <>
      <section className={styles["Poll_Container"]}>
        <Row className="my-3 d-flex align-items-center">
          <Col sm={12} md={1} lg={1}>
            <span className={styles["Poll_Container__heading"]}>
              {t("Polls")}
            </span>
          </Col>
          <Col sm={12} md={2} lg={2}>
            <Button
              text={t("New")}
              className={styles["new_Poll_Button"]}
              icon={
                <img
                  src={plusbutton}
                  height="7.6px"
                  width="7.6px"
                  className="align-items-center"
                />
              }
              onClick={() => setIsCreatePoll(true)}
            />
          </Col>
          <Col sm={12} md={9} lg={9} className="justify-content-end d-flex ">
            <span className="position-relative">
              <TextField
                // value={filterVal}
                width={"502px"}
                // change={handleFilter}
                placeholder={t("Search")}
                applyClass={"PollingSearchInput"}
                name={"SearchVal"}
                value={pollsState.searchValue}
                change={HandleSearchPollsMain}
                labelClass="d-none"
                clickIcon={HandleShowSearch}
                // onDoubleClick={searchbardropdownShow}

                inputicon={
                  <img
                    src={searchicon}
                    className={styles["Search_Bar_icon_class"]}
                    // className={styles["GlobalSearchFieldICon"]}
                  />
                }
                // clickIcon={SearchiconClickOptions}
                iconClassName={styles["polling_searchinput"]}
              />
              {searchpoll ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["SearhBar_Polls"]}
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
                            onClick={HandleCloseSearchModal}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={6} md={6} sm={6}>
                          <TextField
                            placeholder={t("Search-by-Title")}
                            applyClass={"Search_Modal_Fields"}
                            labelClass="d-none"
                            name={"searchbytitle"}
                            value={searchBoxState.searchByTitle}
                            change={HandleSearchboxNameTitle}
                          />
                        </Col>
                        <Col lg={6} md={6} sm={6}>
                          <TextField
                            placeholder={t("Search-by-name")}
                            applyClass={"Search_Modal_Fields"}
                            labelClass="d-none"
                            name={"seachbyname"}
                            value={searchBoxState.searchByName}
                            change={HandleSearchboxNameTitle}
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
                            className={styles["Reset_Button_polls_SearchModal"]}
                            onClick={ResetSearchBtn}
                          />
                          <Button
                            text={t("Search")}
                            className={
                              styles["Search_Button_polls_SearchModal"]
                            }
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
          <Col sm={12} md={12} lg={12}>
            <Table
              column={PollTableColumns}
              rows={RowsData}
              pagination={{
                pageSize: 50,
                showSizeChanger: true,
                pageSizeOptions: ["100 ", "150", "200"],
              }}
            />
          </Col>
        </Row>
      </section>
      {isCreatePoll && (
        <CreatePolling
          setShowPollingModal={setIsCreatePoll}
          showPollingModal={isCreatePoll}
        />
      )}

      {isUpdatePoll ? (
        <UpdatePolls
          showUpdatepollModal={isUpdatePoll}
          setShowUpdatepollModal={setIsUpdatePoll}
        />
      ) : null}
      {isViewPoll ? (
        <>
          <ViewPoll
            showViewPollModal={isViewPoll}
            setShowViewPollModal={setIsViewPoll}
          />
        </>
      ) : null}
      {viewprogress ? (
        <>
          <ViewPollProgress
            showViewProgress={viewprogress}
            setShowViewProgress={setViewprogress}
          />
        </>
      ) : null}
      {viewPollsDetails ? (
        <>
          <PollDetails
            showpollDetails={viewPollsDetails}
            setShowpollDetails={setViewPollsDetails}
          />
        </>
      ) : null}
      {isVotePoll ? (
        <>
          <Votepoll showVotePoll={isVotePoll} setShowVotePoll={setisVotePoll} />
        </>
      ) : null}
      {updatePublished ? (
        <>
          <UpdateSecond
            showUpdateAfterPublished={updatePublished}
            setShowUpdateAfterPublished={setUpdatePublished}
          />
        </>
      ) : null}
    </>
  );
};

export default Polling;
