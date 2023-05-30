import { Container, Row, Col } from "react-bootstrap";
import styles from "./Groups.module.css";
import { Button, Loader, Modal, Notification } from "../../components/elements";
import NoGroupsData from "../../assets/images/No-Group.svg";
import React, { useEffect, useState } from "react";
import ModalArchivedGroups from "../ModalArchivedGroups/ModalArchivedGroups";
import { Pagination } from "antd";
import { useTranslation } from "react-i18next";
import CreateGroup from "../../components/elements/CreateGroup/CreateGroup";
import UpdateGroupPage from "../../components/elements/updateGroupPage/UpdateGroupPage";
import ViewGrouppage from "../../components/elements/ViewGrouppage/ViewGrouppage";
import archivedbtn from "../../assets/images/archivedbtn.png";
import ModalActivegroup from "../ModalActiveGroup/ModalActivegroup";
import Card from "../../components/elements/Card/Card";
import { useDispatch, useSelector } from "react-redux";
import GroupIcon from "../../assets/images/Path 636.png";

import {
  clearMessagesGroup,
  getbyGroupID,
  getGroups,
  updateGroupStatus,
} from "../../store/actions/Groups_actions";
import { Plus } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const { t } = useTranslation();
  const { GroupsReducer } = useSelector((state) => state);
  const [modalStatusChange, setModalStatusChange] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [showActiveGroup, setShowActivegroup] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateComponentpage, setUpdateComponentpage] = useState(false);
  const [ViewGroupPage, setViewGroupPage] = useState(true);
  const [creategrouppage, setCreategrouppage] = useState(false);
  const [groupsData, setgroupsData] = useState([]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  //Pagination states
  const [totalLength, setTotalLength] = useState(1);
  const [groupStatusUpdateData, setGroupStatusUpdateData] = useState({
    StatusID: 0,
    GroupID: 0,
  });
  const [pagedata, setPagedata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postperpage, setPostperpage] = useState(8);
  const Lastpostindex = currentPage * postperpage;
  const firstpostindex = Lastpostindex - postperpage;
  let newdata = groupsData ? groupsData : [];
  const currentposts = newdata.slice(firstpostindex, Lastpostindex);
  const [uniqCardID, setUniqCardID] = useState(0);
  console.log("currentposts", currentposts);

  const handlechange = (value) => {
    console.log("valuevalue", value);
    setCurrentPage(value);

    // setCurrentPage(newdata);
  };

  const archivedmodaluser = (e) => {
    setShowModal(true);
  };

  const groupModal = async (e) => {
    setCreategrouppage(true);
  };
  // const updateModal = (id) => {
  //   dispatch(getbyGroupID(id, t, setViewGroupPage, setUpdateComponentpage, 2));
  // };

  const viewmodal = (groupID, statusID) => {
    if (statusID === 1) {
      dispatch(
        getbyGroupID(
          navigate,
          groupID,
          t,
          setViewGroupPage,
          setUpdateComponentpage,
          statusID
        )
      );
    } else if (statusID === 2) {
    } else if (statusID === 3) {
      dispatch(
        getbyGroupID(
          navigate,
          groupID,
          t,
          setViewGroupPage,
          setUpdateComponentpage,
          statusID
        )
      );
    }
  };

  const activegroupmodal = () => {
    setShowActivegroup(true);
  };

  const changeHandleStatus = (e, CardID, setEditdropdown) => {
    console.log("changeHandleStatus", e.key);
    setStatusValue(e.key);
    setModalStatusChange(true);
    setEditdropdown(false);
    setGroupStatusUpdateData({
      GroupID: JSON.parse(CardID),
      StatusID: JSON.parse(e.value),
    });
  };
  const handleStatusUpdate = async () => {
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
      GroupID: groupStatusUpdateData.GroupID,
      GroupStatusId: groupStatusUpdateData.StatusID,
      OrganizationID: JSON.parse(OrganizationID),
    };
    await dispatch(updateGroupStatus(navigate, Data, t, setModalStatusChange));
    setGroupStatusUpdateData({
      GroupID: 0,
      StatusID: 0,
    });
    setStatusValue("");
  };
  useEffect(() => {
    setShowModal(false);
    setUpdateComponentpage(false);
    setViewGroupPage(false);
  }, []);
  useEffect(() => {
    if (GroupsReducer.realtimeGroupStatus !== null) {
      let findGroupIndex = groupsData.findIndex(
        (data, index) =>
          data.groupID === GroupsReducer.realtimeGroupStatus.groupID
      );
      console.log(
        "findGroupIndexfindGroupIndexfindGroupIndex",
        findGroupIndex,
        groupsData,
        GroupsReducer.realtimeGroupStatus
      );
      if (findGroupIndex !== -1) {
        let newArr = groupsData.map((data, index) => {
          if (findGroupIndex === index) {
            let newData = {
              ...data,
              groupStatusID: GroupsReducer.realtimeGroupStatus.groupStatusID,
            };
            return newData;
          }
          return data;
        });
        setgroupsData(newArr);
      }
    }
  }, [GroupsReducer.realtimeGroupStatus]);

  useEffect(() => {
    if (GroupsReducer.realtimeGroupCreateResponse !== null) {
      let groupData = GroupsReducer.realtimeGroupCreateResponse;
      console.log(groupData, "groupDatagroupDatagroupDatagroupData");
      groupsData.unshift(groupData);
      setgroupsData([...groupsData]);
    }
  }, [GroupsReducer.realtimeGroupCreateResponse]);

  useEffect(() => {
    if (
      GroupsReducer.getAllGroupsResponse !== null &&
      GroupsReducer.getAllGroupsResponse !== undefined &&
      GroupsReducer.getAllGroupsResponse.length > 0
    ) {
      let newArr = [];
      let arr = GroupsReducer.getAllGroupsResponse.filter(
        (data, index) => data.groupStatusID !== 2
      );
      console.log("arrarr", arr);
      arr.map((data, index) => {
        console.log("datavvvvvvvv", data);
        newArr.push({
          groupDescription: data.groupDescription,
          groupID: data.groupID,
          groupMembers: data.groupMembers,
          groupStatusID: data.groupStatusID,
          groupTitle: data.groupTitle,
          userCount: data.userCount,
        });
      });
      setgroupsData(newArr);
      let Totallength = Math.ceil(arr.length / 8);
      setTotalLength(arr.length);
      if (Totallength >= 10) {
      } else {
        Totallength = Totallength + "0";
      }
      setPagedata(parseInt(Totallength));
    }
  }, [GroupsReducer.getAllGroupsResponse]);

  useEffect(() => {
    if (groupsData.length > 0) {
      let Totallength = Math.ceil(groupsData.length / 8);
      setTotalLength(groupsData.length);
      if (Totallength >= 10) {
      } else {
        Totallength = Totallength + "0";
      }
      setPagedata(parseInt(Totallength));
    }
  }, [groupsData]);

  useEffect(() => {
    if (
      GroupsReducer.ResponseMessage !== "" &&
      GroupsReducer.ResponseMessage !== t("Data-available") &&
      GroupsReducer.ResponseMessage !== t("No-data-available")
    ) {
      setOpen({
        ...open,
        flag: true,
        message: GroupsReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
      }, 3000);
      dispatch(clearMessagesGroup());
    } else {
      dispatch(clearMessagesGroup());
    }
  }, [GroupsReducer.ResponseMessage]);

  useEffect(() => {
    dispatch(getGroups(navigate, t));
  }, []);

  return (
    <>
      <Col className={styles["Groupscontainer"]}>
        {creategrouppage ? (
          <>
            <CreateGroup setCreategrouppage={setCreategrouppage} />
          </>
        ) : updateComponentpage ? (
          <>
            <UpdateGroupPage setUpdateComponentpage={setUpdateComponentpage} />
          </>
        ) : ViewGroupPage ? (
          <>
            <ViewGrouppage setViewGroupPage={setViewGroupPage} />
          </>
        ) : (
          <>
            <Row className="mt-3">
              <Col md={4} sm={4} lg={4} className="d-flex gap-3 ">
                <span className={styles["Groups-heading-size"]}>
                  {t("Groups")}
                </span>
                <Button
                  className={styles["create-Group-btn"]}
                  text={t("Create-new-group")}
                  onClick={groupModal}
                  icon={<Plus width={20} height={20} fontWeight={800} />}
                />
              </Col>

              <Col
                lg={8}
                md={8}
                sm={8}
                className="d-flex justify-content-end gap-1 mt-2 "
              >
                <Button
                  className={styles["Archived-Group-btn"]}
                  text={t("Archived-groups")}
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
              <Col lg={12} sm={12} md={12}>
                <Row className="d-flex text-center  MontserratSemiBold-600 color-5a5a5a m-0 p-0  mt-3">
                  <Col sm={12} md={12} lg={12} className="m-0 p-0">
                    <Row>
                      {groupsData.length > 0 ? (
                        currentposts.map((data, index) => {
                          if (data.groupStatusID !== 2) {
                            return (
                              <Col lg={3} md={3} sm={12} className="mb-3">
                                <Card
                                  setUniqCardID={setUniqCardID}
                                  uniqCardID={uniqCardID}
                                  key={index}
                                  CardID={data.groupID}
                                  StatusID={data.groupStatusID}
                                  flag={false}
                                  Icon={
                                    <img
                                      src={GroupIcon}
                                      height="29.23px"
                                      width="32.39px"
                                    />
                                  }
                                  profile={data.groupMembers}
                                  onClickFunction={() =>
                                    viewmodal(data.groupID, data.groupStatusID)
                                  }
                                  BtnText={
                                    data.groupStatusID === 1
                                      ? t("View-group")
                                      : data.groupStatusID === 2
                                      ? t("View-group")
                                      : data.groupStatusID === 3
                                      ? t("Update-group")
                                      : ""
                                  }
                                  CardHeading={data?.groupTitle}
                                  changeHandleStatus={changeHandleStatus}
                                />
                              </Col>
                            );
                          }
                        })
                      ) : (
                        <Col
                          sm={12}
                          lg={12}
                          md={12}
                          className={styles["NoGroupsData"]}
                        >
                          <Row>
                            <Col>
                              <img src={NoGroupsData} />
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className={styles["NoGroupsDataFoundText"]}
                            >
                              {t("You-dont-have-any-group-yet.")}
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className={styles["NoGroupsDataFoundText"]}
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
                                className={styles["create-Group-btn"]}
                                text={t("Create-new-group")}
                                onClick={groupModal}
                                icon={
                                  <Plus
                                    width={20}
                                    height={20}
                                    fontWeight={800}
                                  />
                                }
                              />
                            </Col>
                          </Row>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* pagination */}
            {groupsData.length > 0 && (
              <Row className="">
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
                          total={pagedata}
                          onChange={handlechange}
                        />
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            )}
          </>
        )}
      </Col>
      {showModal ? (
        <ModalArchivedGroups
          archivedCommittee={showModal}
          setArchivedCommittee={setShowModal}
          setViewGroupPage={setViewGroupPage}
        />
      ) : null}
      {modalStatusChange ? (
        <Modal
          show={modalStatusChange}
          onHide={() => {
            setModalStatusChange(false);
          }}
          setShow={setModalStatusChange}
          modalFooterClassName="d-block"
          centered
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col
                    lg={12}
                    sm={12}
                    md={12}
                    className="d-flex justify-content-center"
                  >
                    <span
                      className={styles["heading-modal-active-contfirmation"]}
                    >
                      {t("Are-you-sure-you-want-to")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    sm={12}
                    md={12}
                    className="d-flex justify-content-center"
                  >
                    <span
                      className={styles["heading-modal-active-contfirmation"]}
                    >
                      {statusValue || ""} {t("this-group?")}
                    </span>
                  </Col>
                </Row>
              </Container>
            </>
          }
          ModalFooter={
            <>
              <Row>
                <Col
                  lg={6}
                  sm={6}
                  md={6}
                  className="d-flex justify-content-end"
                >
                  <Button
                    text={t("Confirm")}
                    className={styles["Confirm-activegroup-modal"]}
                    onClick={handleStatusUpdate}
                  />
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={6}
                  className="d-flex justify-content-start"
                >
                  <Button
                    text={t("Cancel")}
                    className={styles["Cancel-activegroup-modal"]}
                    onClick={() => setModalStatusChange(false)}
                  />
                </Col>
              </Row>
            </>
          }
        />
      ) : null}
      {showActiveGroup ? (
        <ModalActivegroup
          Activegroup={showActiveGroup}
          setActivegroup={setShowActivegroup}
          setViewGroupPage={setViewGroupPage}
        />
      ) : null}

      {GroupsReducer.Loading ? <Loader /> : null}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default Groups;
