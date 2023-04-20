import { Container, Row, Col } from "react-bootstrap";
import styles from "./Committee.module.css";
import editicon from "../../assets/images/Esvg.svg";
import doticon from "../../assets/images/Dsvg.svg";
import { Button, Loader, Notification } from "../../components/elements";
import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import NoCommitteeImg from "../../assets/images/No-Committee.svg";
import picprofile from "../../assets/images/picprofile.png";
import { useTranslation } from "react-i18next";
import archivedbtn from "../../assets/images/archivedbtn.png";
import ModalActivegroup from "../ModalActiveGroup/ModalActivegroup";
import CreateCommittee from "../../components/elements/CreateCommittee/CreateCommittee";
import UpdateCommittee from "../../components/elements/UpdateCommittee/UpdateCommittee";
import ViewUpdateCommittee from "../../components/elements/ViewUpdateCommittee/ViewUpdateCommittee";
import ModalMarketingTeamCommittee from "../ModalMarketingTeamCommittee/ModalMarketingTeamCommittee";
import CommitteeICon from "../../assets/images/CommitteeICon.svg";
// import ModalMarketingTeamCommittee from "../../../container/ModalMarketingTeamCommittee/ModalMarketingTeamCommittee";
import { useDispatch, useSelector } from "react-redux";
import {
  committeeStatusUpdate,
  getallcommitteebyuserid_clear,
  getCommitteesbyCommitteeId,
} from "../../store/actions/Committee_actions";
import { getAllCommitteesByUserIdActions } from "../../store/actions/Committee_actions";
import Card from "../../components/elements/Card/Card";
import ModalArchivedCommittee from "../ModalArchivedCommittee/ModalArchivedCommittee";
import { updateGroupStatus } from "../../store/actions/Groups_actions";

const Committee = () => {
  const { CommitteeReducer } = useSelector((state) => state);
  console.log(CommitteeReducer, "CommitteeReducer");
  const [showModal, setShowModal] = useState(false);
  const [showActiveGroup, setShowActivegroup] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [updateComponentpage, setUpdateComponentpage] = useState(false);
  const [ViewGroupPage, setViewGroupPage] = useState(false);
  const [creategrouppage, setCreategrouppage] = useState(false);
  const [dropdownthreedots, setdropdownthreedots] = useState(false);
  const [marketingTeamModal, setMarketingTeamModal] = useState(false);
  const [committeeID, setCommitteeID] = useState(0)
  const [editdropdown, setEditdropdown] = useState(false);
  const [modalsure, setModalsure] = useState(false);
  const [getcommitteedata, setGetCommitteeData] = useState([]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  //Pagination states
  const [totalLength, setTotalLength] = useState(0);

  const [pagedata, setPagedata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postperpage, setPostperpage] = useState(8);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const Lastpostindex = currentPage * postperpage;
  const firstpostindex = Lastpostindex - postperpage;
  let newdata = getcommitteedata ? getcommitteedata : [];
  const currentposts = newdata.slice(firstpostindex, Lastpostindex);
  const archivedmodaluser = async (e) => {
    setShowModal(true);
  };

  const groupModal = async (e) => {
    setCreategrouppage(true);
  };

  const viewmodal = () => {
    setViewGroupPage(true);
  };

  const ModalMarketing = () => {
    setMarketingTeamModal(true);
  };

  const updateModal = async (e) => {
    setUpdateComponentpage(true);
  };
  const activegroupmodal = () => {
    setShowActivegroup(true);
  };

  const activesuremodal = () => {
    setModalsure(true);
  };

  const showMarketingModal = (id) => {
    setMarketingTeamModal(true)
    setCommitteeID(id)
  }

  const viewUpdateModal = (committeeID, CommitteeStatusID) => {
    console.log(
      committeeID,
      CommitteeStatusID,
      "viewUpdateModalviewUpdateModal"
    );
    let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
    let Data = {
      CommitteeID: JSON.parse(committeeID),
      OrganizationId: OrganizationID,
    };
    dispatch(
      getCommitteesbyCommitteeId(
        Data,
        t,
        setViewGroupPage,
        setUpdateComponentpage,
        CommitteeStatusID
      )
    );
  };
  const handlechange = (value) => {
    console.log("valuevalue", value);
    setCurrentPage(value);

    // setCurrentPage(newdata);
  };
  useEffect(() => {
    if (CommitteeReducer.realtimeCommitteeStatus !== null) {
      let findINdexCommitteeStatus = getcommitteedata.findIndex(
        (data, index) =>
          data.committeeID ===
          CommitteeReducer.realtimeCommitteeStatus.commmitteeID
      );
      console.log(
        "findINdexCommitteeStatusfindINdexCommitteeStatus",
        findINdexCommitteeStatus
      );
      if (findINdexCommitteeStatus !== -1) {
        let newArr = getcommitteedata.map((committeeCard, index) => {
          if (findINdexCommitteeStatus === index) {
            let newData = {
              ...committeeCard,
              committeeStatusID:
                CommitteeReducer.realtimeCommitteeStatus.committeeStatusID,
            };
            return newData;
          }
          return committeeCard;
        });
        setGetCommitteeData(newArr);
      }
    }
  }, [CommitteeReducer.realtimeCommitteeStatus]);
  useEffect(() => {
    if (CommitteeReducer.realtimeCommitteeCreateResponse !== null) {
      console.log(
        CommitteeReducer.realtimeCommitteeCreateResponse.committeeStatusID,
        "committeeStatusID"
      );
      let committeeData = CommitteeReducer.realtimeCommitteeCreateResponse;
      getcommitteedata.unshift({
        committeesTitle: committeeData.committeesTitle,
        committeeID: committeeData.committeeID,
        userCount: committeeData.userCount,
        committeeMembers: committeeData.committeeMembers,
        committeeStatusID: committeeData.committeeStatusID,
      });
      setGetCommitteeData([...getcommitteedata]);
    }
  }, [CommitteeReducer.realtimeCommitteeCreateResponse]);
  const changeHandleStatus = (e, CardID, setEditdropdown) => {
    setEditdropdown(false);
    console.log(
      e,
      CardID,
      "changeHandleStatuschangeHandleStatuschangeHandleStatus"
    );
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
      CommitteeId: JSON.parse(CardID),
      CommitteeStatusId: JSON.parse(e.value),
      OrganizationID: JSON.parse(OrganizationID),
    };
    dispatch(committeeStatusUpdate(Data, t));
  };
  useEffect(() => {
    dispatch(getAllCommitteesByUserIdActions(t));
  }, []);

  useEffect(() => {
    if (
      CommitteeReducer.GetAllCommitteesByUserIDResponse !== null &&
      CommitteeReducer.GetAllCommitteesByUserIDResponse.length > 0
    ) {
      let newArr = [];
      let filteritems =
        CommitteeReducer.GetAllCommitteesByUserIDResponse.filter(
          (data, index) => data.committeeStatusID !== 2
        );
      filteritems.map((data, index) => {
        console.log(CommitteeReducer, "datadatadatadata212");

        newArr.push({
          committeesTitle: data.committeesTitle,
          committeeID: data.committeeID,
          userCount: data.userCount,
          committeeMembers: data.committeeMembers,
          committeeStatusID: data.committeeStatusID,
        });
      });

      setGetCommitteeData(newArr);
      console.log(
        "pagedatapagedata",
        typeof CommitteeReducer.GetAllCommitteesByUserIDResponse
      );
      console.log(
        "pagedatapagedata",
        CommitteeReducer.GetAllCommitteesByUserIDResponse.length
      );
      let Totallength = Math.ceil(filteritems.length / 8);
      console.log("pagedatapagedata", Totallength);

      setTotalLength(filteritems.length);
      if (Totallength >= 10) {
      } else {
        Totallength = Totallength + "0";
      }
      setPagedata(parseInt(Totallength));
    }
  }, [CommitteeReducer.GetAllCommitteesByUserIDResponse]);
  useEffect(() => {
    if (getcommitteedata.length > 0) {
      let Totallength = Math.ceil(getcommitteedata.length / 8);
      console.log("pagedatapagedata", Totallength);

      setTotalLength(getcommitteedata.length);
      if (Totallength >= 10) {
      } else {
        Totallength = Totallength + "0";
      }
      setPagedata(parseInt(Totallength));
    }
  }, [getcommitteedata]);
  console.log("pagedatapagedata", pagedata);

  useEffect(() => {
    if (
      CommitteeReducer.ResponseMessage !== "" &&
      CommitteeReducer.ResponseMessage !== t("Data-available")
    ) {
      setOpen({
        ...open,
        open: true,
        message: CommitteeReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(getallcommitteebyuserid_clear());
    } else {
      dispatch(getallcommitteebyuserid_clear());
    }
  }, [CommitteeReducer.ResponseMessage]);

  return (
    <>
      <Container className={styles["Groupscontainer"]}>
        {creategrouppage ? (
          <>
            <CreateCommittee setCreategrouppage={setCreategrouppage} />
          </>
        ) : updateComponentpage ? (
          <>
            <UpdateCommittee setUpdateComponentpage={setUpdateComponentpage} />
          </>
        ) : ViewGroupPage ? (
          <>
            <ViewUpdateCommittee setViewGroupPage={setViewGroupPage} />
          </>
        ) : (
          <>
            <Row className="mt-3">
              <Col md={6} sm={6} lg={6} className="d-flex gap-3 ">
                <span className={styles["Committee-heading-size"]}>
                  {t("Committees")}
                </span>
                <Button
                  className={styles["create-Committee-btn"]}
                  text={t("Create-new-committee")}
                  onClick={groupModal}
                />
              </Col>

              <Col
                lg={6}
                md={6}
                sm={6}
                className="d-flex justify-content-end m-0 p-0 "
              >
                <Button
                  className={styles["Archived-Group-btn-Committee-section"]}
                  text={t("Archieved-committees")}
                  onClick={archivedmodaluser}
                  icon={
                    <img
                      src={archivedbtn}
                      className={styles["archivedbtnIcon"]}
                    />
                  }
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["Committee-Main_Scrollbar"]}
              >
                <Row className="d-flex text-center  MontserratSemiBold-600 color-5a5a5a m-0 p-0  mt-1">
                  <Col sm={12} md={12} lg={12} className="m-0 p-0 mt-2 ">
                    <Row>
                      {getcommitteedata.length > 0 ? (
                        currentposts.map((data, index) => {
                          if (data.committeeStatusID !== 2) {
                            return (
                              <Card
                                key={index}
                                CardID={data.committeeID}
                                StatusID={data.committeeStatusID}
                                CardHeading={data.committeesTitle}
                                // IconOnClick={updateModal}
                                onClickFunction={() =>
                                  viewUpdateModal(
                                    data.committeeID,
                                    data.committeeStatusID
                                  )
                                }
                                flag={true}
                                assignGroupBtn={() => showMarketingModal(data.committeeID)}
                                profile={data.committeeMembers}
                                changeHandleStatus={changeHandleStatus}
                                Icon={<img src={CommitteeICon} width={30} />}
                                BtnText={
                                  data.committeeStatusID === 1
                                    ? t("View-committee")
                                    : data.committeeStatusID === 2
                                      ? ""
                                      : data.committeeStatusID === 3
                                        ? t("Update-committee")
                                        : ""
                                }
                              />
                            );
                          }
                        })
                      ) : (
                        <Col
                          sm={12}
                          lg={12}
                          md={12}
                          className={styles["CommiiteeNotFoundContainer"]}
                        >
                          <Row>
                            <Col sm={12} md={12} lg={12} className="mb-3">
                              <img src={NoCommitteeImg} />
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className={styles["CommitteeNotFoundText"]}
                            >
                              {t("You-dont-have-any-groups-yet.")}
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className={styles["CommitteeNotFoundText"]}
                            >
                              {t("Click-create-new-group-to-get-started.")}
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className="d-flex justify-content-center mt-3"
                            >
                              <Button
                                className={styles["create-Committee-btn"]}
                                text={t("Create-new-committee")}
                                onClick={groupModal}
                              />
                            </Col>
                          </Row>

                          <p></p>
                          <p></p>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            {getcommitteedata.length > 0 && (
              <Row className="mt-2">
                <Col lg={4} md={4} sm={4}></Col>
                <Col
                  lg={4}
                  md={4}
                  sm={4}
                  className="d-flex justify-content-center "
                >
                  <Container className={styles["PaginationStyle-Committee"]}>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={"pagination-groups-table"}
                      >
                        <Pagination
                          defaultCurrent={currentposts}
                          total={totalLength}
                          onChange={handlechange}
                        />
                        ;
                      </Col>
                    </Row>
                  </Container>
                </Col>
                <Col lg={4} md={4} sm={4}></Col>
              </Row>
            )}
            {/* pagination */}
          </>
        )}
      </Container>
      {CommitteeReducer.Loading ? <Loader /> : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {showModal ? (
        <ModalArchivedCommittee
          archivedCommittee={showModal}
          setArchivedCommittee={setShowModal}
          setViewGroupPage={setViewGroupPage}
        />
      ) : null}

      {showActiveGroup ? (
        <ModalActivegroup
          Activegroup={showActiveGroup}
          setActivegroup={setShowActivegroup}
        />
      ) : null}
      {marketingTeamModal ? (
        <ModalMarketingTeamCommittee
          MarketingTeam={marketingTeamModal}
          setMarketingTeam={setMarketingTeamModal}
          editFlag={editFlag}
          committeeID={committeeID}
          setEditFlag={setEditFlag}
        />
      ) : null}
      {/* {modalsure ? (
        <ModalAreyousureActive
          Activegroup={modalsure}
          setActivegroup={setModalsure}
          editFlag={editFlag}
          setEditFlag={setEditFlag}
        />
      ) : null} */}
    </>
  );
};

export default Committee;
