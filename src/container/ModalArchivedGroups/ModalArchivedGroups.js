import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from "../../components/elements";
import Card from "../../components/elements/Card/Card";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { Pagination } from "antd";
import { useTranslation } from "react-i18next";
import styles from "./ModalArchivedGroups.module.css";
import CommitteeICon from "../../assets/images/CommitteeICon.svg";
import right from "../../assets/images/rightchev.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import { getbyGroupID, getGroups } from "../../store/actions/Groups_actions";

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
  const { GroupsReducer } = useSelector((state) => state);

  const [groupsArheivedData, setGroupsArheivedData] = useState([]);
  const [pagedata, setPagedata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  console.log("postperpage", currentPage);
  const [postperpage, setPostperpage] = useState(6);
  console.log("postperpage", postperpage);
  const Lastpostindex = currentPage * postperpage;
  console.log("postperpage", Lastpostindex);
  const firstpostindex = Lastpostindex - postperpage;
  console.log("postperpage", firstpostindex);

  let newdata = groupsArheivedData ? groupsArheivedData : [];
  const currentposts = newdata.slice(firstpostindex, Lastpostindex);
  console.log("postperpage", currentposts);

  useEffect(() => {
    if (GroupsReducer.realtimeGroupStatus !== null) {
      let findGroupIndex = GroupsReducer.getAllGroupsResponse.findIndex(
        (data, index) => {
          return data.groupID === GroupsReducer.realtimeGroupStatus.groupID;
        }
      );
      if (findGroupIndex !== -1) {
        let newArr = GroupsReducer.getAllGroupsResponse.map((data, index) => {
          if (findGroupIndex === index) {
            let newData = {
              ...data,
              groupStatusID: GroupsReducer.realtimeGroupStatus.groupStatusID,
            };
            return newData;
          }
          return data;
        });
        setGroupsArheivedData(newArr);
      }
    }
  }, [GroupsReducer.realtimeGroupStatus]);

  // useEffect(() => {
  //   console.log("postperpage", GroupsReducer.getAllGroupsResponse);

  //   if (
  //     GroupsReducer.getAllGroupsResponse !== null &&
  //     GroupsReducer.getAllGroupsResponse.length > 0
  //   ) {
  //     let newArr = [];
  //     let filterItems = GroupsReducer.getAllGroupsResponse.filter(
  //       (data, index) => data.groupStatusID === 2
  //     );
  //     console.log("postperpage", filterItems);

  //     GroupsReducer.getAllGroupsResponse.map((data, index) => {
  //       newArr.push(data);
  //     });
  //     console.log("postperpage", newArr);

  //     setGroupsArheivedData(newArr);
  //     let Totallength = Math.ceil(filterItems.length / 6);
  //     setTotalLength(filterItems.length);
  //     if (Totallength >= 10) {
  //     } else {
  //       Totallength = Totallength + "0";
  //     }
  //     setPagedata(parseInt(Totallength));
  //   }
  // }, [GroupsReducer.getAllGroupsResponse]);

  useEffect(() => {
    if (
      GroupsReducer.getAllGroupsResponse !== null &&
      GroupsReducer.getAllGroupsResponse.length > 0
    ) {
      let newArr = [];
      let filterItems = GroupsReducer.getAllGroupsResponse.filter(
        (data, index) => data.groupStatusID === 2
      );
      filterItems.map((data, index) => {
        newArr.push(data);
      });
      setGroupsArheivedData(newArr);
    }
  }, [GroupsReducer.getAllGroupsResponse]);

  useEffect(() => {
    if (groupsArheivedData !== null && groupsArheivedData.length > 0) {
      let Totallength = Math.ceil(groupsArheivedData.length / 6);
      if (Totallength >= 10) {
      } else {
        Totallength = Totallength + "0";
      }
      setPagedata(parseInt(Totallength));
    }
  }, [groupsArheivedData]);

  const updateModal = async (e) => {
    setUpdateComponentpage(true);
  };

  const ViewGroupmodal = (groupID, statusID) => {
    dispatch(
      getbyGroupID(
        groupID,
        t,
        setViewGroupPage,
        setUpdateComponentpage,
        statusID,
        setArchivedGroups
      )
    );
    setArchivedCommittee(false);
  };

  const handlechange = (value) => {
    setCurrentPage(value);
  };

  const handleArrow = () => {
    let count = Math.ceil(groupsArheivedData.length / 6);
    console.log("clicked", count);
    if (currentPage === count) {
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  // useEffect(() => {
  //   dispatch(getGroups(t));
  // }, []);
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
              <Row className="">
                <Col
                  lg={11}
                  md={11}
                  sm={11}
                  className=" justify-content-start "
                >
                  <p className={styles["Archived-heading"]}>
                    {t("Archieved-groups")}
                  </p>
                </Col>
                <Col lg={1} md={1} sm={1} className="justify-content-end">
                  <Button
                    icon={
                      <img
                        src={right}
                        width={20}
                        className={styles["Arrow_archiveed_icon_groups"]}
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
                  {groupsArheivedData.length > 0 &&
                  Object.values(groupsArheivedData).length > 0 ? (
                    currentposts.map((data, index) => {
                      console.log(data, "datadatadata1111");
                      // if(index+1===Lastpostindex||index+1>=)
                      if (data.groupStatusID === 2) {
                        return (
                          <Col sm={12} md={4} lg={4} className="mb-3">
                            <Card
                              CardHeading={data.groupTitle}
                              IconOnClick={updateModal}
                              onClickFunction={() =>
                                ViewGroupmodal(data.groupID, data.groupStatusID)
                              }
                              StatusID={data.groupStatusID}
                              profile={data.groupMembers}
                              Icon={<img src={CommitteeICon} width={30} />}
                              BtnText={
                                data.groupStatusID === 2 ? t("View-group") : ""
                              }
                            />
                          </Col>
                        );
                      }
                    })
                  ) : (
                    <Row>
                      <Col>{t("No-archeived-record-founds")}</Col>
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
