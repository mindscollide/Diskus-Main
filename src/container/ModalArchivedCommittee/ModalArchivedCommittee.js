import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Modal,
  Notification,
  EmployeeCard,
 
} from "../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import  Card from '../../components/elements/Card/Card'
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
}) => {
  const [archivedgroup, setArchivedGroups] = useState(true);
  const [dropdownthreedots, setdropdownthreedots] = useState(false);
  const { t } = useTranslation();
  const [editdropdown, setEditdropdown] = useState(false);
  const [updateComponentpage, setUpdateComponentpage] = useState(false);
  const { CommitteeReducer } = useSelector((state) => state);
  console.log(
    CommitteeReducer,
    "ComitteeGroupsReducerComitteeGroupsReducerComitteeGroupsReducer"
  );
  const [getcommitteedata, setGetCommitteeData] = useState([
    {
      committeesTitle: "",
      committeeID: 0,
      userCount: 0,
      groupMembers: [],
    },
  ]);
  const [totalLength, setTotalLength] = useState(0);
  const [pagedata, setPagedata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postperpage, setPostperpage] = useState(8);
  useEffect(() => {
    if (
      CommitteeReducer.GetAllCommitteesByUserIDResponse !== null &&
      CommitteeReducer.GetAllCommitteesByUserIDResponse.length > 0
    ) {
      let newArr = [];
      CommitteeReducer.GetAllCommitteesByUserIDResponse.map((data, index) => {
        console.log(CommitteeReducer, "datadatadatadata212");

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
        typeof CommitteeReducer.GetAllCommitteesByUserIDResponse
      );
      console.log(
        "pagedatapagedata",
        CommitteeReducer.GetAllCommitteesByUserIDResponse.length
      );
      let Totallength = Math.ceil(
        CommitteeReducer.GetAllCommitteesByUserIDResponse.length / 8
      );
      console.log("pagedatapagedata", Totallength);

      setTotalLength(CommitteeReducer.GetAllCommitteesByUserIDResponse.length);
      if (Totallength >= 10) {
      } else {
        Totallength = Totallength + "0";
      }
      setPagedata(parseInt(Totallength));
    }
  }, [CommitteeReducer.GetAllCommitteesByUserIDResponse]);
  const Lastpostindex = currentPage * postperpage;
  const firstpostindex = Lastpostindex - postperpage;
  let newdata = CommitteeReducer.GetAllCommitteesByUserIDResponse
    ? CommitteeReducer.GetAllCommitteesByUserIDResponse
    : [];
  const currentposts = newdata.slice(firstpostindex, Lastpostindex);
  console.log("currentposts", currentposts);

  const updateModal = async (e) => {
    setUpdateComponentpage(true);
  };

  const handlechange = (value) => {
    console.log("valuevalue", value);

    setCurrentPage(value);

    // setCurrentPage(newdata);
  };

  const handleArrow = () => {
    let count = Math.ceil(getcommitteedata.length / 8);
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
                <Col lg={6} md={6} sm={6} className=" justify-content-start ">
                  <p className={styles["Archived-heading"]}>
                    {t("Archived-groups")}
                  </p>
                </Col>
                <Col lg={6} md={6} sm={6} className=" justify-content-end">
                  <Button onClick={handleArrow}>
                    {/* <img src={right} width={25} /> */}
                  </Button>
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
                  Object.values(getcommitteedata).length > 0
                    ? currentposts.map((data, index) => {
                        console.log(data, "datadatadata");
                        // if(index+1===Lastpostindex||index+1>=)
                        return (
                          <Card
                            CardHeading={data.committeesTitle}
                            IconOnClick={updateModal}
                            profile={data.groupMembers}
                            Icon={<img src={CommitteeICon} width={30} />}
                            BtnText={t("Update-button")}
                          />
                        );
                      })
                    : null}
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
