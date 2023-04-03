import { Container, Row, Col } from "react-bootstrap";
import styles from "./Groups.module.css";
import editicon from "../../assets/images/editicon.png";
import doticon from "../../assets/images/doticon.png";
import { Button, Loader, Modal, Notification } from "../../components/elements";
import React, { useEffect, useState } from "react";
import img6 from "../../assets/images/DropDownTWO.svg";
import img7 from "../../assets/images/DropdownSEVEN.svg";
import img3 from "../../assets/images/DropdownTHREE.svg";
import img4 from "../../assets/images/DropdownFOUR.svg";
import img5 from "../../assets/images/DropdownFIVE.svg";
import img1 from "../../assets/images/DropdownONE.svg";
import img2 from "../../assets/images/DropDownTWO.svg";
import ModalArchivedGroups from "../ModalArchivedGroups/ModalArchivedGroups";
import { Pagination } from "antd";
// import ModalViewGroup from "../ModalViewGroup/ModalViewGroup";
import picprofile from "../../assets/images/picprofile.png";
import { useTranslation } from "react-i18next";
import ReactPaginate from "react-paginate";
import CreateGroup from "../../components/elements/CreateGroup/CreateGroup";
import UpdateGroupPage from "../../components/elements/updateGroupPage/UpdateGroupPage";
import ViewGrouppage from "../../components/elements/ViewGrouppage/ViewGrouppage";
import archivedbtn from "../../assets/images/archivedbtn.png";
import { style } from "@mui/system";
import ModalActivegroup from "../ModalActiveGroup/ModalActivegroup";
import Card from '../../components/elements/Card/Card'
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessagesGroup,
  getbyGroupID,
  getGroups,
  updateGroupStatus
} from "../../store/actions/Groups_actions";

const Groups = () => {
  const { t } = useTranslation();

  const [threeDropDownItems, setThreeDropDownItems] = useState([{
    image: "",
    text: ""
  }])
  const { GroupsReducer } = useSelector((state) => state);
  const [modalStatusChange, setModalStatusChange] = useState(false)
  console.log(GroupsReducer, "GroupsReducerGroupsReducerGroupsReducer");
  const [showModal, setShowModal] = useState(false);
  const [showActiveGroup, setShowActivegroup] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const dispatch = useDispatch();
  const [updateComponentpage, setUpdateComponentpage] = useState(false);
  const [ViewGroupPage, setViewGroupPage] = useState(true);
  const [creategrouppage, setCreategrouppage] = useState(false);
  const [groupsData, setgroupsData] = useState([]);

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  //Pagination states
  const [totalLength, setTotalLength] = useState(0);

  const [pagedata, setPagedata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postperpage, setPostperpage] = useState(8);
  const Lastpostindex = currentPage * postperpage;
  const firstpostindex = Lastpostindex - postperpage;
  let newdata = groupsData
    ? groupsData
    : [];
  const currentposts = newdata.slice(firstpostindex, Lastpostindex);
  // const currentposts = newdata.slice(firstpostindex, Lastpostindex);
  console.log("currentposts", currentposts);

  const handlechange = (value) => {
    console.log("valuevalue", value);
    setCurrentPage(value);

    // setCurrentPage(newdata);
  };

  const archivedmodaluser = async (e) => {
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
      dispatch(getbyGroupID(groupID, t, setViewGroupPage, setUpdateComponentpage, statusID));
    } else if (statusID === 2) {

    } else if (statusID === 3) {
      dispatch(getbyGroupID(groupID, t, setViewGroupPage, setUpdateComponentpage, statusID));
    }

  };

  const activegroupmodal = () => {
    setShowActivegroup(true);
  };

  const chandeHandleStatus = (e, CardID) => {
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
      GroupID: JSON.parse(CardID),
      GroupStatusId: JSON.parse(e.value),
      OrganizationID: JSON.parse(OrganizationID)
    }
    dispatch(updateGroupStatus(Data, t))
  }

  useEffect(() => {
    setShowModal(false);
    setUpdateComponentpage(false);
    setViewGroupPage(false);
  }, []);

  useEffect(() => {
    if (
      GroupsReducer.getAllGroupsResponse !== null &&
      GroupsReducer.getAllGroupsResponse !== undefined &&
      GroupsReducer.getAllGroupsResponse.length > 0
    ) {
      let arr = GroupsReducer.getAllGroupsResponse.filter((data, index) => data.groupStatusID === 1 || data.groupStatusID === 3)
      setgroupsData(arr);
      let Totallength = Math.ceil(
        arr.length / 8
      );
      console.log("TotallengthTotallength", Totallength)
      setTotalLength(arr.length);
      if (Totallength >= 10) {
      } else {
        Totallength = Totallength + "0";
      }
      setPagedata(parseInt(Totallength));
    }
  }, [GroupsReducer]);

  useEffect(() => {
    if (GroupsReducer.ResponseMessage !== "") {
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
    }
  }, [GroupsReducer.ResponseMessage]);

  useEffect(() => {
    dispatch(getGroups(t));
  }, []);

  return (
    <>
      <Container fluid="lg" className={styles["Groupscontainer"]}>
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
              <Col md={4} sm={4} lg={4} className="d-flex gap-5 ">
                <span className={styles["Groups-heading-size"]}>Groups</span>
                <Button
                  className={styles["create-Group-btn"]}
                  text=" + Create New Group"
                  onClick={groupModal}
                />
              </Col>

              <Col
                lg={8}
                md={8}
                sm={8}
                className="d-flex justify-content-end gap-1 "
              >
                <Button
                  className={styles["Archived-Group-btn"]}
                  text=" Archieved Groups"
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
                sm={12}
                md={12}
                className={styles["Groups_scroll_bar"]}
              >
                <Row className="d-flex text-center  MontserratSemiBold-600 color-5a5a5a m-0 p-0  mt-1">
                  <Col sm={12} md={12} lg={12} className="m-0 p-0">
                    <Row>
                      {groupsData.length > 0
                        ? currentposts.map((data, index) => {
                          return (<Card key={index}
                            CardID={data.groupID}
                            StatusID={data.groupStatusID}
                            flag={false}
                            profile={data.groupMembers}
                            onClickFunction={() => viewmodal(data.groupID, data.groupStatusID)}
                            BtnText={data.groupStatusID === 1 ? t("View-group") : data.groupStatusID === 2 ? "" : data.groupStatusID === 3 ? t("Update-group") : ""}
                            CardHeading={data?.groupTitle}
                            chandeHandleStatus={chandeHandleStatus}
                          />);

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
                        total={pagedata}
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
      {showModal ? (
        <ModalArchivedGroups
          updateNotes={showModal}
          setUpdateNotes={setShowModal}
          editFlag={editFlag}
          setEditFlag={setEditFlag}
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
                      Are you sure you want to
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
                      Active this group?
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
                    text="Confirm"
                    className={styles["Confirm-activegroup-modal"]}
                  />
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={6}
                  className="d-flex justify-content-start"
                >
                  <Button
                    text="Cancel"
                    className={styles["Cancel-activegroup-modal"]}
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
        />
      ) : null}

      {GroupsReducer.Loading ? <Loader /> : null}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default Groups;
