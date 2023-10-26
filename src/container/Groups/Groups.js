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
  groupLoader,
  realtimeGroupStatusResponse,
  updateGroupStatus,
} from "../../store/actions/Groups_actions";
import { Plus } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../commen/functions/customPagination/Paginations";

const Groups = () => {
  const { t } = useTranslation();
  const { GroupsReducer, LanguageReducer } = useSelector((state) => state);
  const [modalStatusChange, setModalStatusChange] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [showActiveGroup, setShowActivegroup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateComponentpage, setUpdateComponentpage] = useState(false);
  const [ViewGroupPage, setViewGroupPage] = useState(true);
  const [creategrouppage, setCreategrouppage] = useState(false);
  const [groupsData, setgroupsData] = useState([]);
  console.log(groupsData, "groupsDatagroupsDatagroupsData");
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [totalLength, setTotalLength] = useState(0);
  const [groupStatusUpdateData, setGroupStatusUpdateData] = useState({
    StatusID: 0,
    GroupID: 0,
  });
  const [uniqCardID, setUniqCardID] = useState(0);
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  const creatorID = localStorage.getItem("userID");

  useEffect(() => {
    setShowModal(false);
    setUpdateComponentpage(false);
    setViewGroupPage(false);
    localStorage.removeItem("groupsArCurrent");
    localStorage.setItem("groupsCurrent", 1);
    dispatch(getGroups(navigate, t, 1));
  }, []);

  useEffect(() => {
    if (GroupsReducer.realtimeGroupStatus !== null) {
      let status = GroupsReducer.realtimeGroupStatus.groupStatusID;
      if (status === 2) {
        let findGroupIndex = groupsData.findIndex(
          (data, index) =>
            data.groupID === GroupsReducer.realtimeGroupStatus.groupID
        );
        if (findGroupIndex !== -1) {
          let newArr = [...groupsData];
          newArr.splice(findGroupIndex, 1);
          setgroupsData(newArr);
          dispatch(realtimeGroupStatusResponse(null));
        }
      } else {
        let findGroupIndex = groupsData.findIndex(
          (data, index) =>
            data.groupID === GroupsReducer.realtimeGroupStatus.groupID
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
    }
  }, [GroupsReducer.realtimeGroupStatus]);

  useEffect(() => {
    if (GroupsReducer.realtimeGroupCreateResponse !== null) {
      let MQttgroupData = GroupsReducer.realtimeGroupCreateResponse;
      setgroupsData([MQttgroupData, ...groupsData]);
    }
  }, [GroupsReducer.realtimeGroupCreateResponse]);

  useEffect(() => {
    try {
      if (
        GroupsReducer.getAllGroupsResponse !== null &&
        GroupsReducer.getAllGroupsResponse !== undefined
      ) {
        if (GroupsReducer.getAllGroupsResponse?.groups?.length > 0) {
          setTotalLength(GroupsReducer.getAllGroupsResponse.totalRecords);
          let newArr = [];
          let arr = GroupsReducer.getAllGroupsResponse.groups;
          arr.map((data, index) => {
            newArr.push(data);
          });
          setgroupsData(newArr);
        } else {
          setgroupsData([]);
        }
      } else {
        setgroupsData([]);
      }
    } catch (error) {}
  }, [GroupsReducer.getAllGroupsResponse]);

  const handlechange = (value) => {
    localStorage.setItem("groupsCurrent", value);
    dispatch(getGroups(navigate, t, value));
  };

  const archivedmodaluser = (e) => {
    setShowModal(true);
  };

  const groupModal = async (e) => {
    setCreategrouppage(true);
  };

  const viewTitleModal = (data) => {
    dispatch(
      getbyGroupID(
        navigate,
        data.groupID,
        t,
        setViewGroupPage,
        setUpdateComponentpage,
        1
      )
    );
  };
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

  return (
    <>
      <div className={styles["Groupscontainer"]}>
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
                      draggable="false"
                      src={archivedbtn}
                      className={styles["archivedbtnIcon"]}
                    />
                  }
                />
              </Col>
            </Row>

            <Row className="mt-4">
              <Col lg={12} sm={12} md={12}>
                <Row
                  className={`${"d-flex text-center MontserratSemiBold-600 color-5a5a5a m-0 p-0"} ${
                    styles["groups_box"]
                  }`}
                >
                  <Col sm={12} md={12} lg={12} className="m-0 p-0">
                    <Row>
                      {groupsData.length > 0 ? (
                        groupsData.map((data, index) => {
                          return (
                            <Col lg={3} md={3} sm={12} className="mb-3">
                              <Card
                                setUniqCardID={setUniqCardID}
                                uniqCardID={uniqCardID}
                                key={index}
                                groupState={true}
                                CardID={data.groupID}
                                StatusID={data.groupStatusID}
                                associatedTags={data.listOfCommittees}
                                creatorId={data.creatorID}
                                flag={false}
                                Icon={
                                  <img
                                    draggable="false"
                                    src={GroupIcon}
                                    height="29.23px"
                                    width="32.39px"
                                  />
                                }
                                titleOnCLick={() => viewTitleModal(data)}
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
                              <img draggable="false" src={NoGroupsData} />
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
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={
                    "pagination-groups-table d-flex justify-content-center"
                  }
                >
                  <span className={styles["PaginationStyle-Committee"]}>
                    <CustomPagination
                      total={totalLength}
                      current={currentPage}
                      pageSize={8}
                      onChange={handlechange}
                      showSizer={false}
                    />
                    {/* <Pagination
                      current={currentPage}
                      total={totalLength}
                      pageSize={8}
                      onChange={handlechange}
                    /> */}
                  </span>
                </Col>
              </Row>
            )}
          </>
        )}
      </div>
      {showModal ? (
        <ModalArchivedGroups
          archivedCommittee={showModal}
          setArchivedCommittee={setShowModal}
          setViewGroupPage={setViewGroupPage}
          setUpdateComponentpage={setUpdateComponentpage}
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

      {GroupsReducer.getAllLoading ||
      GroupsReducer.Loading ||
      LanguageReducer.Loading ? (
        <Loader />
      ) : null}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default Groups;
