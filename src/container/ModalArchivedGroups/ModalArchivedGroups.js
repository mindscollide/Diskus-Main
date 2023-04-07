import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
} from "../../components/elements";
import Card from '../../components/elements/Card/Card'
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { Pagination } from "antd";
import { useTranslation } from "react-i18next";
import styles from "./ModalArchivedGroups.module.css";
import CommitteeICon from "../../assets/images/CommitteeICon.svg";
import right from "../../assets/images/rightchev.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import { getbyGroupID } from "../../store/actions/Groups_actions";

const ModalArchivedCommittee = ({
  ModalTitle,
  archivedCommittee,
  setArchivedCommittee,
  setViewGroupPage
}) => {
  const [archivedgroup, setArchivedGroups] = useState(true);
  const [dropdownthreedots, setdropdownthreedots] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const [editdropdown, setEditdropdown] = useState(false);
  const [updateComponentpage, setUpdateComponentpage] = useState(false);
  const { GroupsReducer } = useSelector((state) => state);

  const [groupsArheivedData, setGroupsArheivedData] = useState([])

  const [totalLength, setTotalLength] = useState(0);
  const [pagedata, setPagedata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postperpage, setPostperpage] = useState(8);
  useEffect(() => {
    if (
      GroupsReducer.getAllGroupsResponse !== null &&
      GroupsReducer.getAllGroupsResponse.length > 0
    ) {
      let filterItems = GroupsReducer.getAllGroupsResponse.filter((data, index) => data.groupStatusID === 2);
      setGroupsArheivedData(filterItems)
      console.log("filterItemsfilterItemsfilterItems", filterItems)
      console.log(
        "pagedatapagedata",
        typeof GroupsReducer.getAllGroupsResponse
      );
      console.log(
        "pagedatapagedata",
        GroupsReducer.getAllGroupsResponse.length
      );
      let Totallength = Math.ceil(
        filterItems.length / 8
      );
      console.log("pagedatapagedata", Totallength);

      setTotalLength(filterItems.length);
      if (Totallength >= 10) {
      } else {
        Totallength = Totallength + "0";
      }
      setPagedata(parseInt(Totallength));
    }
  }, [GroupsReducer.getAllGroupsResponse]);
  const Lastpostindex = currentPage * postperpage;
  const firstpostindex = Lastpostindex - postperpage;
  let newdata = groupsArheivedData
    ? groupsArheivedData
    : [];

  const currentposts = newdata.slice(firstpostindex, Lastpostindex);
  console.log("currentposts", currentposts);

  const updateModal = async (e) => {
    setUpdateComponentpage(true);
  };

  const ViewGroupmodal = (groupID, statusID) => {
    console.log(groupID, statusID, "ViewGroupmodalViewGroupmodalViewGroupmodal")
    dispatch(getbyGroupID(groupID, t, setViewGroupPage, setUpdateComponentpage, statusID, setArchivedGroups));
  };
  const handlechange = (value) => {
    console.log("valuevalue", value);
    setCurrentPage(value);
    // setCurrentPage(newdata);
  };

  const handleArrow = () => {
    let count = Math.ceil(groupsArheivedData.length / 8);
    console.log("clicked", count);
    if (currentPage === count) {
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

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
                    icon={<img src={right} width={20} />}
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
                    Object.values(groupsArheivedData).length > 0
                    ? currentposts.map((data, index) => {
                      console.log(data, "datadatadata1111");
                      // if(index+1===Lastpostindex||index+1>=)
                      return (
                        <Card
                          CardHeading={data.groupTitle}
                          IconOnClick={updateModal}
                          onClickFunction={() => ViewGroupmodal(data.groupID, data.groupStatusID)}
                          StatusID={data.groupStatusID}
                          profile={data.groupMembers}
                          Icon={<img src={CommitteeICon} width={30} />}
                          BtnText={data.groupStatusID === 2 ? t("View-group") : ""}
                        />
                      );
                    })
                    : <Row><Col>No Archeived Record Founds</Col></Row>}
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
                            total={totalLength}
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
