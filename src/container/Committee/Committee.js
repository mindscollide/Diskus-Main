import { Container, Row, Col } from "react-bootstrap";
import styles from "./Committee.module.css";
import editicon from "../../assets/images/Esvg.svg";
import doticon from "../../assets/images/Dsvg.svg";
import { Button, Loader, Notification } from "../../components/elements";
import React, { useEffect, useState } from "react";
import { Pagination } from "antd";

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
import { getallcommitteebyuserid_clear } from "../../store/actions/CommitteeGroup_actions";
import { getAllCommitteesByUserIdActions } from "../../store/actions/CommitteeGroup_actions";
import Card from "../../components/elements/Card/Card";
import ModalArchivedCommittee from "../ModalArchivedCommittee/ModalArchivedCommittee";


const Committee = () => {
  const { ComitteeReducer } = useSelector((state) => state);
  console.log(
    ComitteeReducer,
    "ComitteeReducer"
  );
  const [showModal, setShowModal] = useState(false);
  const [showActiveGroup, setShowActivegroup] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [updateComponentpage, setUpdateComponentpage] = useState(false);
  const [ViewGroupPage, setViewGroupPage] = useState(false);
  const [creategrouppage, setCreategrouppage] = useState(false);
  const [dropdownthreedots, setdropdownthreedots] = useState(false);
  const [marketingTeamModal, setMarketingTeamModal] = useState(false);
  const [editdropdown, setEditdropdown] = useState(false);
  const [modalsure, setModalsure] = useState(false);
  const [getcommitteedata, setGetCommitteeData] = useState([
    {
      committeesTitle: "",
      committeeID: 0,
      userCount: 0,
      groupMembers: [],
    },
  ]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  console.log("getcommitteedatagetcommitteedata", getcommitteedata);
  //Pagination states
  const [totalLength, setTotalLength] = useState(0);

  const [pagedata, setPagedata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postperpage, setPostperpage] = useState(8);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const Lastpostindex = currentPage * postperpage;
  const firstpostindex = Lastpostindex - postperpage;
  let newdata = ComitteeReducer.GetAllCommitteesByUserIDResponse
    ? ComitteeReducer.GetAllCommitteesByUserIDResponse
    : [];
  const currentposts = newdata.slice(firstpostindex, Lastpostindex);
  console.log("currentposts", currentposts);
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

  const handlechange = (value) => {
    console.log("valuevalue", value);
    setCurrentPage(value);

    // setCurrentPage(newdata);
  };

  useEffect(() => {
    // setShowModal(false);
    // setUpdateComponentpage(false);
    // setViewGroupPage(false);
    // setMarketingTeamModal(false);
  }, []);

  useEffect(() => {
    dispatch(getAllCommitteesByUserIdActions(t));
  }, []);

  useEffect(() => {
    if (
      ComitteeReducer.GetAllCommitteesByUserIDResponse !== null &&
      ComitteeReducer.GetAllCommitteesByUserIDResponse.length > 0
    ) {
      let newArr = [];
      ComitteeReducer.GetAllCommitteesByUserIDResponse.map((data, index) => {
        console.log(ComitteeReducer, "datadatadatadata212");

        newArr.push({
          committeesTitle: data.committeesTitle,
          committeeID: data.committeeID,
          userCount: data.userCount,
          groupMembers: data.groupMembers,
        });
      });
      setGetCommitteeData(newArr);
      console.log(
        "pagedatapagedata",
        typeof ComitteeReducer.GetAllCommitteesByUserIDResponse
      );
      console.log(
        "pagedatapagedata",
        ComitteeReducer.GetAllCommitteesByUserIDResponse.length
      );
      let Totallength = Math.ceil(
        ComitteeReducer.GetAllCommitteesByUserIDResponse.length / 8
      );
      console.log("pagedatapagedata", Totallength);

      setTotalLength(ComitteeReducer.GetAllCommitteesByUserIDResponse.length);
      if (Totallength >= 10) {
      } else {
        Totallength = Totallength + "0";
      }
      setPagedata(parseInt(Totallength));
    }
  }, [ComitteeReducer.GetAllCommitteesByUserIDResponse]);
  console.log("pagedatapagedata", pagedata);

  useEffect(() => {
    if (ComitteeReducer.ResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: ComitteeReducer.ResponseMessage,
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
  }, [ComitteeReducer.ResponseMessage]);

  return (
    <>
      <Container className={styles["Groupscontainer"]}>
        {creategrouppage ? (
          <>
            <CreateCommittee />
          </>
        ) : updateComponentpage ? (
          <>
            <UpdateCommittee />
          </>
        ) : ViewGroupPage ? (
          <>
            <ViewUpdateCommittee />
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
                  text={t(" Archieved-groups ")}
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
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["Committee-Main_Scrollbar"]}
              >
                <Row className="d-flex text-center  MontserratSemiBold-600 color-5a5a5a m-0 p-0  mt-1">
                  <Col sm={12} md={12} lg={12} className="m-0 p-0 mt-2 ">
                    <Row>
                      {getcommitteedata.length > 0 &&
                        Object.values(getcommitteedata).length > 0
                        ? currentposts.map((data, index) => {
                          console.log(data, "datadatadata");
                          if (data.committeeStatusID !== 2) {
                            return (
                              <Card
                                key={index}
                                StatusID={data.committeeStatusID}
                                CardHeading={data.committeesTitle}
                                IconOnClick={updateModal}
                                profile={data.groupMembers}
                                Icon={<img src={CommitteeICon} width={30} />}
                                BtnText={t("Update-button")}
                              />
                            )
                          }
                        })
                        : null}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* pagination */}
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
          </>
        )}
      </Container>
      {ComitteeReducer.Loading ? <Loader /> : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {showModal ? (
        <ModalArchivedCommittee
          archivedCommittee={showModal}
          setArchivedCommittee={setShowModal}
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
