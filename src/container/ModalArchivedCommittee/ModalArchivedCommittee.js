import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Modal,
  Notification,
  EmployeeCard,
} from "../../components/elements";
import Card from "../../components/elements/Card/Card";
import { useDispatch, useSelector } from "react-redux";
import {
  getallcommitteebyuserid_clear,
  getCommitteesbyCommitteeId,
} from "../../store/actions/Committee_actions";
import { getAllCommitteesByUserIdActions } from "../../store/actions/Committee_actions";
import { Row, Col, Container } from "react-bootstrap";
import { Pagination } from "antd";
import { useTranslation } from "react-i18next";
import styles from "./ModalArchivedCommittee.module.css";
import CommitteeICon from "../../assets/images/CommitteeICon.svg";
import right from "../../assets/images/rightchev.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";

const ModalArchivedCommittee = ({
  ModalTitle,
  archivedCommittee,
  setArchivedCommittee,
  setViewGroupPage,
}) => {
  const [archivedgroup, setArchivedGroups] = useState(true);
  const [dropdownthreedots, setdropdownthreedots] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [editdropdown, setEditdropdown] = useState(false);
  const [updateComponentpage, setUpdateComponentpage] = useState(false);
  const { CommitteeReducer } = useSelector((state) => state);
  console.log(
    CommitteeReducer,
    "ComitteeGroupsReducerComitteeGroupsReducerComitteeGroupsReducer"
  );
  const [getcommitteedata, setGetCommitteeData] = useState([]);
  const [totalLength, setTotalLength] = useState(0);
  const [pagedata, setPagedata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postperpage, setPostperpage] = useState(6);
  useEffect(() => {
    if (CommitteeReducer.realtimeCommitteeStatus !== null) {
      let findINdexCommitteeStatus =
        CommitteeReducer.GetAllCommitteesByUserIDResponse.findIndex(
          (data, index) =>
            data.committeeID ===
            CommitteeReducer.realtimeCommitteeStatus.commmitteeID
        );
      console.log(
        "findINdexCommitteeStatusfindINdexCommitteeStatus",
        findINdexCommitteeStatus
      );
      if (findINdexCommitteeStatus !== -1) {
        let newArr = CommitteeReducer.GetAllCommitteesByUserIDResponse.map(
          (committeeCard, index) => {
            if (findINdexCommitteeStatus === index) {
              let newData = {
                ...committeeCard,
                committeeStatusID:
                  CommitteeReducer.realtimeCommitteeStatus.committeeStatusID,
              };
              return newData;
            }
            return committeeCard;
          }
        );
        console.log(newArr);
        setGetCommitteeData(newArr);
      }
    }
  }, [CommitteeReducer.realtimeCommitteeStatus]);

  useEffect(() => {
    if (
      CommitteeReducer.GetAllCommitteesByUserIDResponse !== null &&
      CommitteeReducer.GetAllCommitteesByUserIDResponse.length > 0
    ) {
      let newArr = [];
      let filterItems =
        CommitteeReducer.GetAllCommitteesByUserIDResponse.filter(
          (data, index) => data.committeeStatusID === 2
        );
      filterItems.map((data, index) => {
        newArr.push({
          committeesTitle: data.committeesTitle,
          committeeID: data.committeeID,
          userCount: data.userCount,
          committeeMembers: data.committeeMembers,
          committeeStatusID: data.committeeStatusID,
        });
      });
      setGetCommitteeData(newArr);
    }
  }, [CommitteeReducer.GetAllCommitteesByUserIDResponse]);

  const Lastpostindex = currentPage * postperpage;
  const firstpostindex = Lastpostindex - postperpage;
  let newdata = getcommitteedata ? getcommitteedata : [];
  const currentposts = newdata.slice(firstpostindex, Lastpostindex);
  console.log("currentposts", currentposts);

  useEffect(() => {
    if (getcommitteedata !== null && getcommitteedata.length > 0) {
      let Totallength = Math.ceil(getcommitteedata.length / 6);
      if (Totallength >= 10) {
      } else {
        Totallength = Totallength + "0";
      }
      setPagedata(parseInt(Totallength));
    }
  }, [getcommitteedata]);
  const updateModal = async (e) => {
    setUpdateComponentpage(true);
  };

  const handlechange = (value) => {
    console.log("valuevalue", value);
    setCurrentPage(value);

    // setCurrentPage(newdata);
  };

  const handleArrow = () => {
    let count = Math.ceil(getcommitteedata.length / 6);
    console.log("clicked", count);
    if (currentPage === count) {
    } else {
      setCurrentPage(currentPage + 1);
    }
  };
  const viewCommitteeModal = (committeeID, CommitteeStatusID) => {
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
        CommitteeStatusID,
        setArchivedCommittee
      )
    );
  };
  useEffect(() => {
    dispatch(getAllCommitteesByUserIdActions(t));
  }, []);
  // const CarouselStructure = () => {
  //   let curentindex = 0;
  //   let innerindex;
  //   return (
  //     <Carousel interval={null}>
  //       {getcommitteedata.length > 0 &&
  //       Object.values(getcommitteedata).length > 0
  //         ? getcommitteedata.map((data, index) => {
  //             if (index >= curentindex) {
  //               if (index === 0) {
  //                 curentindex = index + 7;
  //                 console.log(curentindex, "datadatadata");
  //               } else if (index === curentindex) {
  //                 curentindex = index + 8;
  //                 console.log(curentindex, "datadatadata");
  //               }
  //               return (
  //                 <Carousel.Item>
  //                   <Row className="text-center">
  //                     {getcommitteedata.length > 0 &&
  //                     Object.values(getcommitteedata).length > 0
  //                       ? currentposts.map((data, index2) => {
  //                           if (index === 0) {
  //                             if (index2 <= curentindex) {
  //                               console.log(innerindex, "datadatadata");
  //                               return (
  //                                 <Card
  //                                   CardHeading={data.committeesTitle}
  //                                   IconOnClick={updateModal}
  //                                   profile={data.groupMembers}
  //                                   Icon={
  //                                     <img src={CommitteeICon} width={30} />
  //                                   }
  //                                   BtnText={t("Update-button")}
  //                                 />
  //                               );
  //                             }
  //                           } else {
  //                             if (
  //                               index2 <= curentindex &&
  //                               index2 > curentindex - 8
  //                             ) {
  //                               console.log(innerindex, "datadatadata");
  //                               return (
  //                                 <Card
  //                                   CardHeading={data.committeesTitle}
  //                                   IconOnClick={updateModal}
  //                                   profile={data.groupMembers}
  //                                   Icon={
  //                                     <img src={CommitteeICon} width={30} />
  //                                   }
  //                                   BtnText={t("Update-button")}
  //                                 />
  //                               );
  //                             }
  //                           }
  //                         })
  //                       : null}
  //                   </Row>
  //                 </Carousel.Item>
  //               );
  //             }
  //           })
  //         : null}
  //     </Carousel>
  //   );
  // };
  return (
    <>
      <Container>
        <Modal
          show={archivedCommittee}
          onHide={() => {
            setArchivedCommittee(false);
          }}
          setShow={setArchivedCommittee}
          // ButtonTitle={ModalTitle}
          closeButton={false}
          modalFooterClassName="d-block"
          modalHeaderClassName="d-block"
          centered
          size={archivedCommittee === true ? "xl" : "xl"}
          ModalTitle={
            <>
              <Row>
                <Col lg={11} md={11} sm={11} className="justify-content-start">
                  <p className={styles["Archived-heading"]}>
                    {t("Archived-committees")}
                  </p>
                </Col>
                <Col lg={1} md={1} sm={1} className="justify-content-end">
                  <Button
                    icon={
                      <img
                        src={right}
                        width="16.5px"
                        height="33px"
                        className={styles["ArrowIcon_modal_archived_comiitee"]}
                      />
                    }
                    onClick={handleArrow}
                    className={styles["ArrowBtn"]}
                  />
                </Col>
              </Row>
            </>
          }
          ModalBody={
            <>
              {/* {CarouselStructure()} */}
              <Container className={styles["Archived_modal_scrollbar"]}>
                <Row className="text-center mt-4">
                  {getcommitteedata.length > 0 &&
                    Object.values(getcommitteedata).length > 0 ? (
                    currentposts.map((data, index) => {
                      console.log(data, "datadatadata");
                      // if(index+1===Lastpostindex||index+1>=)
                      if (data.committeeStatusID === 2) {
                        return (
                          <Col lg={4} md={4} sm={12} className="mb-3">
                            <Card
                              CardHeading={data.committeesTitle}
                              onClickFunction={() =>
                                viewCommitteeModal(
                                  data.committeeID,
                                  data.committeeStatusID
                                )
                              }
                              StatusID={data.committeeStatusID}
                              profile={data.committeeMembers}
                              Icon={<img src={CommitteeICon} width={30} />}
                              BtnText={
                                data.committeeStatusID === 2 &&
                                t("View-committee")
                              }
                            />
                          </Col>
                        );
                      }
                    })
                  ) : (
                    <Row>
                      <Col>{t("No-archived-record-founds")}</Col>
                    </Row>
                  )}
                </Row>
              </Container>
            </>
          }
          ModalFooter={
            <>
              <Row className="d-flex">
                <Col lg={4} md={4} sm={4}></Col>
                <Col lg={4} md={4} sm={4}>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center  "
                  >
                    <Container
                      className={
                        styles["PaginationStyle-Committee-Archived_modal"]
                      }
                    >
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={"pagination-groups-table"}
                        >
                          <Pagination
                            defaultCurrent={currentposts}
                            total={pagedata}
                            current={currentPage}
                            onChange={handlechange}
                          />
                          ;
                        </Col>
                      </Row>
                    </Container>
                  </Col>
                </Col>
                <Col lg={4} md={4} sm={4}></Col>
              </Row>
            </>
          }
        />
      </Container>
    </>
  );
};

export default ModalArchivedCommittee;
