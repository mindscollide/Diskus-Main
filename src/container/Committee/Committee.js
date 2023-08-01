import { Container, Row, Col } from "react-bootstrap";
import styles from "./Committee.module.css";
import { Button, Loader, Notification } from "../../components/elements";
import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import NoCommitteeImg from "../../assets/images/No-Committee.svg";
import { useTranslation } from "react-i18next";
import archivedbtn from "../../assets/images/archivedbtn.png";
import plusbutton from "../../assets/images/Group 119.svg";
import ModalActivegroup from "../ModalActiveGroup/ModalActivegroup";
import CreateCommittee from "../../components/elements/CreateCommittee/CreateCommittee";
import UpdateCommittee from "../../components/elements/UpdateCommittee/UpdateCommittee";
import ViewUpdateCommittee from "../../components/elements/ViewUpdateCommittee/ViewUpdateCommittee";
import ModalMarketingTeamCommittee from "../ModalMarketingTeamCommittee/ModalMarketingTeamCommittee";
import committeeicon from "../../assets/images/Group 2584.png";
import { useDispatch, useSelector } from "react-redux";
import {
  committeeStatusUpdate,
  getallcommitteebyuserid_clear,
  getCommitteesbyCommitteeId,
  realtimeCommitteeStatusResponse,
} from "../../store/actions/Committee_actions";
import { getAllCommitteesByUserIdActions } from "../../store/actions/Committee_actions";
import Card from "../../components/elements/Card/Card";
import ModalArchivedCommittee from "../ModalArchivedCommittee/ModalArchivedCommittee";
import { useNavigate } from "react-router-dom";

const Committee = () => {
  const { CommitteeReducer } = useSelector((state) => state);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showActiveGroup, setShowActivegroup] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  let currentPage = JSON.parse(localStorage.getItem("CocurrentPage"));
  const [editFlag, setEditFlag] = useState(false);
  const [updateComponentpage, setUpdateComponentpage] = useState(false);
  const [ViewGroupPage, setViewGroupPage] = useState(false);
  const [creategrouppage, setCreategrouppage] = useState(false);
  const [marketingTeamModal, setMarketingTeamModal] = useState(false);
  const [committeeID, setCommitteeID] = useState(0);
  const [modalsure, setModalsure] = useState(false);
  const [getcommitteedata, setGetCommitteeData] = useState([]);
  const [uniqCardID, setUniqCardID] = useState(0);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [mapgroupsData, setMapGroupData] = useState(null);
  useEffect(() => {
    localStorage.removeItem("CoArcurrentPage");
    localStorage.setItem("CocurrentPage", 1);
    dispatch(getAllCommitteesByUserIdActions(navigate, t, 0, 1));
  }, []);

  const archivedmodaluser = async (e) => {
    setShowModal(true);
  };

  const groupModal = async (e) => {
    setCreategrouppage(true);
  };

  const showMarketingModal = (id) => {
    setMarketingTeamModal(true);
    setCommitteeID(id);
    if (getcommitteedata.length > 0) {
      let findMapGroups = getcommitteedata.filter(
        (data, index) => data.committeeID === id
      );
      setMapGroupData(findMapGroups);
      console.log(findMapGroups, "findMapGroupsfindMapGroupsfindMapGroups");
    }
  };

  const viewUpdateModal = (committeeID, CommitteeStatusID) => {
    let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
    let Data = {
      CommitteeID: JSON.parse(committeeID),
      OrganizationId: OrganizationID,
    };
    dispatch(
      getCommitteesbyCommitteeId(
        navigate,
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
    localStorage.setItem("CocurrentPage", value);
    dispatch(getAllCommitteesByUserIdActions(navigate, t, 0, value));
  };

  useEffect(() => {
    if (CommitteeReducer.realtimeCommitteeStatus !== null) {
      console.log(
        "findINdexCommitteeStatusfindINdexCommitteeStatus",
        CommitteeReducer.realtimeCommitteeStatus
      );
      let status = CommitteeReducer.realtimeCommitteeStatus.committeeStatusID;
      if (status === 2) {
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
          let newData = [...getcommitteedata];
          newData.splice(findINdexCommitteeStatus, 1);
          setGetCommitteeData(newData);
          dispatch(realtimeCommitteeStatusResponse(null));
        }
      } else {
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
          dispatch(realtimeCommitteeStatusResponse(null));
        }
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
        listofGroups: committeeData.listOfGroups,
      });
      setGetCommitteeData([...getcommitteedata]);
    }
  }, [CommitteeReducer.realtimeCommitteeCreateResponse]);

  const changeHandleStatus = (e, CardID) => {
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
      CommitteeId: JSON.parse(CardID),
      CommitteeStatusId: JSON.parse(e.value),
      OrganizationID: JSON.parse(OrganizationID),
    };
    dispatch(committeeStatusUpdate(navigate, Data, t));
  };

  useEffect(() => {
    if (
      CommitteeReducer.GetAllCommitteesByUserIDResponse !== null &&
      CommitteeReducer.GetAllCommitteesByUserIDResponse !== undefined &&
      CommitteeReducer.GetAllCommitteesByUserIDResponse.committees.length > 0
    ) {
      setTotalRecords(
        CommitteeReducer.GetAllCommitteesByUserIDResponse.totalRecords
      );
      let newArr = [];
      let filteritems =
        CommitteeReducer.GetAllCommitteesByUserIDResponse.committees;
      filteritems.map((data, index) => {
        console.log(CommitteeReducer, "datadatadatadata212");
        newArr.push({
          committeesTitle: data.committeesTitle,
          committeeID: data.committeeID,
          userCount: data.userCount,
          committeeMembers: data.committeeMembers,
          committeeStatusID: data.committeeStatusID,
          listofGroups: data.listOfGroups,
        });
      });
      setGetCommitteeData(newArr);
    }
  }, [CommitteeReducer.GetAllCommitteesByUserIDResponse]);

  useEffect(() => {
    if (
      CommitteeReducer.ResponseMessage !== "" &&
      CommitteeReducer.ResponseMessage !== t("Data-available") &&
      CommitteeReducer.ResponseMessage !== t("No-data-available")
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
      <Col className={styles["CommitteeContainer"]}>
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
                  icon={
                    <img
                      src={plusbutton}
                      height="7.6px"
                      width="7.6px"
                      className={styles["PLusICon"]}
                    />
                  }
                />
              </Col>

              <Col
                lg={6}
                md={6}
                sm={6}
                className="d-flex justify-content-end mt-2 "
              >
                <Button
                  className={styles["Archived-Group-btn-Committee-section"]}
                  text={t("Archived-committees")}
                  onClick={archivedmodaluser}
                  icon={
                    <img
                      src={archivedbtn}
                      width="18px"
                      height="18px"
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
                // className={styles["Committee-Main_Scrollbar"]}
              >
                <Row
                  className={`${"d-flex text-center committees_box  MontserratSemiBold-600 color-5a5a5a m-0 p-0  mt-1"} ${
                    styles["committess_box"]
                  }`}
                >
                  <Col sm={12} md={12} lg={12} className="m-0 p-0 mt-2 ">
                    <Row>
                      {getcommitteedata.length > 0 ? (
                        getcommitteedata.map((data, index) => {
                          console.log(data, "datadatadata");
                          return (
                            <Col key={index} lg={3} md={3} sm={12} className="mb-3">
                              <Card
                                setUniqCardID={setUniqCardID}
                                uniqCardID={uniqCardID}
                                key={index}
                                CardID={data.committeeID}
                                StatusID={data.committeeStatusID}
                                CardHeading={data.committeesTitle}
                                onClickFunction={() =>
                                  viewUpdateModal(
                                    data.committeeID,
                                    data.committeeStatusID
                                  )
                                }
                                associatedTags={data.listofGroups}
                                flag={true}
                                assignGroupBtn={() =>
                                  showMarketingModal(data.committeeID)
                                }
                                profile={data.committeeMembers}
                                changeHandleStatus={changeHandleStatus}
                                Icon={
                                  <img
                                    src={committeeicon}
                                    width="32.88px"
                                    height="28.19px"
                                  />
                                }
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
                            </Col>
                          );
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
                              {t("You-dont-have-any-committee-yet")}
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className={styles["CommitteeNotFoundText"]}
                            >
                              {t("Click-create-new-committee-to-get-started.")}
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
                          current={currentPage}
                          total={totalRecords}
                          pageSize={8}
                          onChange={handlechange}
                        />
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
      </Col>
      {CommitteeReducer.Loading ? <Loader /> : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {showModal ? (
        <ModalArchivedCommittee
          archivedCommittee={showModal}
          setArchivedCommittee={setShowModal}
          setViewGroupPage={setViewGroupPage}
          setUpdateComponentpage={setUpdateComponentpage}
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
          mapgroupsData={mapgroupsData}
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
