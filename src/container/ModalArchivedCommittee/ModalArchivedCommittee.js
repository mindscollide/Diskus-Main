import React, { useState, useEffect } from "react";
import { Button, Modal } from "../../components/elements";
import Card from "../../components/elements/Card/Card";
import { useDispatch, useSelector } from "react-redux";
import {
  committeeStatusUpdate,
  getAllArcheivedCommittees,
  realtimeCommitteeStatusResponse,
} from "../../store/actions/Committee_actions";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./ModalArchivedCommittee.module.css";
import CommitteeICon from "../../assets/images/CommitteeICon.svg";
import right from "../../assets/images/rightchev.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../commen/functions/customPagination/Paginations";

const ModalArchivedCommittee = ({
  archivedCommittee,
  setArchivedCommittee,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { CommitteeReducer } = useSelector((state) => state);
  const CommitteeReducerrealtimeCommitteeStatus = useSelector(
    (state) => state.CommitteeReducer.realtimeCommitteeStatus
  );
  const [getcommitteedata, setGetCommitteeData] = useState([]);
  const [totalLength, setTotalLength] = useState(0);
  let currentArPage = JSON.parse(localStorage.getItem("CoArcurrentPage"));
  const [uniqCardID, setUniqCardID] = useState(0);
  useEffect(() => {
    if (currentArPage !== undefined && currentArPage !== null) {
      dispatch(getAllArcheivedCommittees(navigate, t, currentArPage));
    } else {
      localStorage.setItem("CoArcurrentPage", 1);
      dispatch(getAllArcheivedCommittees(navigate, t, 1));
    }
    return () => {
      localStorage.removeItem("NotificationClickCommitteeArchived");
    };
  }, []);

  useEffect(() => {
    try {
      if (CommitteeReducerrealtimeCommitteeStatus !== null) {
        const {
          committeeStatusID,
          commmitteeID,
          committeeDetails: {
            creatorID,
            description,
            committeMembers,
            listOfGroups,
            committeeTitle,
            isTalkChatGroup,
          },
          committeeTalkDetails: {
            creationDate,
            creationTime,
            modifiedDate,
            modifiedTime,
            talkGroupID,
          },
        } = CommitteeReducerrealtimeCommitteeStatus;

        const committeeID = Number(commmitteeID);

        const committeeData = {
          committeesTitle: committeeTitle,
          committeeID: committeeID,
          userCount: committeMembers.length,
          committeeStatusID: committeeStatusID,
          description: description,
          creationDate: creationDate,
          creationTime: creationTime,
          creatorID: creatorID,
          modifiedDate: modifiedDate,
          modifiedTime: modifiedTime,
          talkGroupID: talkGroupID,
          isTalk: isTalkChatGroup,
          listOfGroups: [...listOfGroups],
          committeeMembers: [...committeMembers],
        };

        setGetCommitteeData((prevData) => {
          const exists = prevData.some(
            (item) => item.committeeID === committeeID
          );

          if (committeeStatusID === 2) {
            // Remove from list
            return [...prevData, committeeData];
          } else if (committeeStatusID === 1 || committeeStatusID === 3) {
            return exists
              ? prevData.filter((item) => item.committeeID !== committeeID)
              : prevData;
          }
          return prevData;
        });

        dispatch(realtimeCommitteeStatusResponse(null));
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [CommitteeReducerrealtimeCommitteeStatus]);

  useEffect(() => {
    if (
      CommitteeReducer.ArcheivedCommittees &&
      CommitteeReducer.ArcheivedCommittees.committees &&
      CommitteeReducer.ArcheivedCommittees.committees.length > 0
    ) {
      setTotalLength(CommitteeReducer.ArcheivedCommittees.totalRecords);

      let copyData = [...CommitteeReducer.ArcheivedCommittees?.committees];
      // Create a new copy of committeeMembers array for each committee
      const updatedCommittees = copyData.map((committee) => ({
        ...committee,
        committeeMembers: [...committee.committeeMembers],
      }));

      setGetCommitteeData(updatedCommittees); // Update the state with the new array
    }
  }, [CommitteeReducer.ArcheivedCommittees]);

  const handlechange = (value) => {
    localStorage.setItem("CoArcurrentPage", value);
    dispatch(getAllArcheivedCommittees(navigate, t, value));
  };

  const handleArrow = () => {
    if (CommitteeReducer.ArcheivedCommittees.pageNumbers >= currentArPage + 1) {
      let currentPage = currentArPage + 1;
      localStorage.setItem("CoArcurrentPage", currentPage);
      dispatch(getAllArcheivedCommittees(navigate, t, currentPage));
    }
  };

  const handleChangeCommitteeStatus = (e, CardID, setEditdropdown) => {
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
      CommitteeId: JSON.parse(CardID),
      CommitteeStatusId: JSON.parse(e.value),
      OrganizationID: JSON.parse(OrganizationID),
    };
    dispatch(committeeStatusUpdate(navigate, Data, t, setArchivedCommittee));
  };

  const viewCommitteeModal = () => {};

  return (
    <>
      <Modal
        show={archivedCommittee}
        onHide={() => {
          setArchivedCommittee(false);
          localStorage.removeItem("CoArcurrentPage");
        }}
        setShow={setArchivedCommittee}
        closeButton={false}
        modalFooterClassName='d-block'
        modalHeaderClassName='d-block'
        centered
        size={archivedCommittee === true ? "xl" : "xl"}
        ModalTitle={
          <>
            <Row>
              <Col lg={11} md={11} sm={11} className='justify-content-start'>
                <p className={styles["Archived-heading"]}>
                  {t("Archived-committees")}
                </p>
              </Col>
              {CommitteeReducer.ArcheivedCommittees !== null &&
              CommitteeReducer.ArcheivedCommittees !== undefined ? (
                CommitteeReducer.ArcheivedCommittees.pageNumbers >=
                currentArPage + 1 ? (
                  <Col lg={1} md={1} sm={1} className='justify-content-end'>
                    <Button
                      icon={
                        <img
                          draggable='false'
                          src={right}
                          alt=''
                          width='16.5px'
                          height='33px'
                          className={
                            styles["ArrowIcon_modal_archived_comiitee"]
                          }
                        />
                      }
                      onClick={handleArrow}
                      className={styles["ArrowBtn"]}
                    />
                  </Col>
                ) : null
              ) : null}
            </Row>
          </>
        }
        ModalBody={
          <>
            <>
              <Container
                className={
                  CommitteeReducer.Loading
                    ? styles["Archived_modal_scrollbar_Spinner"]
                    : styles["Archived_modal_scrollbar"]
                }>
                {CommitteeReducer.Loading ? (
                  <>
                    <section className='d-flex justify-content-center align-items-center mt-5'></section>
                  </>
                ) : (
                  <Row className='text-center mt-4'>
                    {getcommitteedata.length > 0 &&
                    Object.values(getcommitteedata).length > 0 ? (
                      getcommitteedata.map((data) => {
                        return (
                          <Col lg={4} md={4} sm={12} className='mb-3'>
                            <Card
                              setUniqCardID={setUniqCardID}
                              uniqCardID={uniqCardID}
                              CardID={data.committeeID}
                              CardHeading={data.committeesTitle}
                              creatorId={data.creatorID}
                              onClickFunction={() =>
                                viewCommitteeModal(
                                  data.committeeID,
                                  data.committeeStatusID
                                )
                              }
                              titleOnCLick={() =>
                                viewCommitteeModal(
                                  data.committeeID,
                                  data.committeeStatusID
                                )
                              }
                              changeHandleStatus={handleChangeCommitteeStatus}
                              StatusID={data.committeeStatusID}
                              profile={data.committeeMembers}
                              Icon={
                                <img
                                  draggable='false'
                                  src={CommitteeICon}
                                  width={30}
                                  alt=''
                                />
                              }
                              BtnText={
                                data.committeeStatusID === 2 &&
                                t("View-committee")
                              }
                              flag={true}
                            />
                          </Col>
                        );
                      })
                    ) : (
                      <Row>
                        <Col>{t("No-archived-record-founds")}</Col>
                      </Row>
                    )}
                  </Row>
                )}
              </Container>
            </>
          </>
        }
        ModalFooter={
          <>
            {getcommitteedata.length > 0 &&
            Object.values(getcommitteedata).length > 0 ? (
              <>
                <Row className='d-flex'>
                  <Col lg={4} md={4} sm={4}></Col>
                  <Col lg={4} md={4} sm={4}>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className='d-flex justify-content-center  '>
                      <Container
                        className={
                          styles["PaginationStyle-Committee-Archived_modal"]
                        }>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={"pagination-groups-table"}>
                            <CustomPagination
                              total={totalLength}
                              current={currentArPage}
                              pageSize={8}
                              onChange={handlechange}
                            />
                          </Col>
                        </Row>
                      </Container>
                    </Col>
                  </Col>
                  <Col lg={4} md={4} sm={4}></Col>
                </Row>
              </>
            ) : null}
          </>
        }
      />
    </>
  );
};

export default ModalArchivedCommittee;
