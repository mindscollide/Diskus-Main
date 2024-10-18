import React, { useState, useEffect } from "react";
import { Button, Modal } from "../../components/elements";
import Card from "../../components/elements/Card/Card";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./ModalArchivedGroups.module.css";
import GroupIcon from "../../assets/images/Path 636.png";
import right from "../../assets/images/rightchev.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getArcheivedGroups,
  updateGroupStatus,
} from "../../store/actions/Groups_actions";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../commen/functions/customPagination/Paginations";

const ModalArchivedCommittee = ({
  archivedCommittee,
  setArchivedCommittee,
  setUpdateComponentpage,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { GroupsReducer } = useSelector((state) => state);
  const [groupsArheivedData, setGroupsArheivedData] = useState([]);
  const [totalRecords, setTotalrecord] = useState(0);
  let currentGroupPage = JSON.parse(localStorage.getItem("groupsArCurrent"));
  const [uniqCardID, setUniqCardID] = useState(0);
  useEffect(() => {
    if (currentGroupPage !== null && currentGroupPage !== undefined) {
      dispatch(getArcheivedGroups(navigate, t, currentGroupPage));
    } else {
      localStorage.setItem("groupsArCurrent", 1);
      dispatch(getArcheivedGroups(navigate, t, 1));
    }
  }, []);

  useEffect(() => {
    // try{}catch{}
    if (GroupsReducer.realtimeGroupStatus !== null) {
      let status = GroupsReducer.realtimeGroupStatus.groupStatusID;

      if (status === 2) {
        let findGroupIndex =
          GroupsReducer.getAllGroupsResponse.groups.findIndex((data, index) => {
            return data.groupID === GroupsReducer.realtimeGroupStatus.groupID;
          });
        if (findGroupIndex !== -1) {
          let allgroupData = GroupsReducer.getAllGroupsResponse.groups;
          let copygroupData = [...allgroupData];
          copygroupData.unshift({
            groupDescription: allgroupData[findGroupIndex].groupDescription,
            groupID: allgroupData[findGroupIndex].groupID,
            groupMembers: allgroupData[findGroupIndex].groupMembers,
            groupStatusID: status,
            groupTitle: allgroupData[findGroupIndex].groupTitle,
            userCount: allgroupData[findGroupIndex].userCount,
          });
          setGroupsArheivedData(copygroupData);
        }
      } else if (status === 3 || status === 1) {
        setGroupsArheivedData((archGroupData) => {
          return archGroupData.filter(
            (groupData, index) =>
              groupData.groupID !== GroupsReducer.realtimeGroupStatus.groupID
          );
        });
      }
    }
  }, [GroupsReducer.realtimeGroupStatus]);

  useEffect(() => {
    if (
      GroupsReducer.ArcheivedGroups !== null &&
      GroupsReducer.ArcheivedGroups !== undefined
    ) {
      try {
        if (GroupsReducer.ArcheivedGroups.groups.length > 0) {
          setTotalrecord(GroupsReducer.ArcheivedGroups.totalRecords);
          let copyData = [...GroupsReducer.ArcheivedGroups.groups];
          // Create a new copy of committeeMembers array for each committee
          const updateGroups = copyData.map((groups) => ({
            ...groups,
            groupMembers: [...groups.groupMembers],
          }));

          setGroupsArheivedData(updateGroups);
        } else {
          setGroupsArheivedData([]);
        }
      } catch (error) {}
    }
  }, [GroupsReducer.ArcheivedGroups]);

  const updateModal = async (e) => {
    setUpdateComponentpage(true);
  };

  const ViewGroupmodal = () => {};

  const handlechange = (value) => {
    localStorage.setItem("groupsArCurrent", value);
    dispatch(getArcheivedGroups(navigate, t, value));
  };

  const handleArrow = () => {
    if (GroupsReducer.ArcheivedGroups.pageNumbers >= currentGroupPage + 1) {
      let currentPage = currentGroupPage + 1;
      localStorage.setItem("groupsArCurrent", currentPage);
      dispatch(getArcheivedGroups(navigate, t, currentPage));
    }
  };

  const handleChangeStatus = async (e, CardID, setEditdropdown) => {
    //Current Organization
    let currentOrganizationId = localStorage.getItem("organizationID");
    let Data = {
      GroupID: Number(CardID),
      GroupStatusId: Number(e.value),
      OrganizationID: JSON.parse(currentOrganizationId),
    };
    await dispatch(updateGroupStatus(navigate, Data, t, setArchivedCommittee));
  };

  return (
    <>
      <section>
        <div>
          <Modal
            show={archivedCommittee}
            onHide={() => {
              setArchivedCommittee(false);
            }}
            setShow={setArchivedCommittee}
            closeButton={false}
            modalFooterClassName="d-block"
            modalHeaderClassName="d-block"
            centered
            size={archivedCommittee === true ? "xl" : "xl"}
            ModalTitle={
              <>
                <Row>
                  <Col
                    lg={11}
                    md={11}
                    sm={11}
                    className=" d-flex justify-content-start "
                  >
                    <p className={styles["Archived-heading"]}>
                      {t("Archived-groups")}
                    </p>
                  </Col>
                  {GroupsReducer.ArcheivedGroups !== null &&
                  GroupsReducer.ArcheivedGroups !== undefined ? (
                    GroupsReducer.ArcheivedGroups.pageNumbers >=
                    currentGroupPage + 1 ? (
                      <Col
                        lg={1}
                        md={1}
                        sm={1}
                        className=" d-flex justify-content-end mb-4"
                      >
                        <Button
                          icon={
                            <img
                              draggable="false"
                              src={right}
                              width="16.5px"
                              height="33px"
                              className={styles["Arrow_archiveed_icon_groups"]}
                              alt=""
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
                <Container className={styles["Archived_modal_scrollbar"]}>
                  <Row className="text-center ">
                    {groupsArheivedData.length > 0 &&
                    Object.values(groupsArheivedData).length > 0 ? (
                      groupsArheivedData.map((data, index) => {
                        return (
                          <Col sm={12} md={4} lg={4} className="mb-3">
                            <Card
                              setUniqCardID={setUniqCardID}
                              uniqCardID={uniqCardID}
                              CardHeading={data.groupTitle}
                              IconOnClick={updateModal}
                              CardID={data.groupID}
                              onClickFunction={() =>
                                ViewGroupmodal(data.groupID, data.groupStatusID)
                              }
                              titleOnCLick={() =>
                                ViewGroupmodal(data.groupID, data.groupStatusID)
                              }
                              StatusID={data.groupStatusID}
                              creatorId={data.creatorID}
                              profile={data.groupMembers}
                              Icon={
                                <img
                                  draggable="false"
                                  src={GroupIcon}
                                  alt=""
                                  width="32.39px"
                                  height="29.23px"
                                />
                              }
                              BtnText={
                                data.groupStatusID === 2 ? t("View-group") : ""
                              }
                              changeHandleStatus={handleChangeStatus}
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
                </Container>
              </>
            }
            ModalFooter={
              <>
                {groupsArheivedData.length > 0 &&
                Object.values(groupsArheivedData).length > 0 ? (
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
                                <CustomPagination
                                  total={totalRecords}
                                  pageSize={8}
                                  current={currentGroupPage}
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
                ) : null}
              </>
            }
          />
        </div>
      </section>
    </>
  );
};

export default ModalArchivedCommittee;
