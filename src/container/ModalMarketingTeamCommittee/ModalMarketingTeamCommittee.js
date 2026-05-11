import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalMarketingTeamCommittee.module.css";
import {
  Button,
  InputSearchFilter,
  Modal,
  Notification,
} from "../../components/elements";
import Crossicon from "../../assets/images/CrossIcon.svg";
import { useTranslation } from "react-i18next";
import { getAllGroups } from "../../store/actions/Groups_actions";
import Group_Icon from "../../assets/images/Path 636.png";
import { useDispatch, useSelector } from "react-redux";
import { assignGroups } from "../../store/actions/Committee_actions";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../components/elements/snack_bar/utill";
const ModalMarketingTeamCommittee = ({
  ModalTitle,
  MarketingTeam,
  setMarketingTeam,
  committeeID,
  mapgroupsData,
}) => {
  const { t } = useTranslation();
  const { GroupsReducer } = useSelector((state) => state);
  const [Groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [committeeData, setCommitteeData] = useState(null);
  const [groupID, setGroupID] = useState(0);
  const [groupData, setGroupData] = useState([]);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    if (mapgroupsData !== null && mapgroupsData !== undefined) {
      setCommitteeData(mapgroupsData);
    }
  }, [mapgroupsData]);
  const closebtn = async () => {
    setMarketingTeam(false);
  };
  //Drop Down Values
  const searchFilterHandler = (value) => {
    let getAllGroupsData = GroupsReducer.getAllGroups;
    
    if (
      GroupsReducer.getAllGroups != undefined &&
      GroupsReducer.getAllGroups != null &&
      GroupsReducer.getAllGroups != NaN &&
      GroupsReducer.getAllGroups != []
    ) {
      return getAllGroupsData
        .filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.title.toLowerCase();
          return (
            searchTerm &&
            assigneesName.startsWith(searchTerm) &&
            assigneesName !== searchTerm
          );
        })
        .map((item) => (
          <div
            onClick={() => onSearch(item.title, item.pK_GRID)}
            className="dropdown-row-assignee d-flex flex-row align-items-center"
            key={item.pK_GRID}
          >
            <img
              draggable="false"
              src={`data:image/jpeg;base64,${item.displayProfilePictureName}`}
              alt=""
              className="user-img"
            />
            <p className="p-0 m-0">{item.title}</p>
          </div>
        ));
    } else {
    }
  };

  // on Search filter for add members
  const onSearch = (name, id) => {
    
    setGroupName(name);
    setGroupID(id);
  };

  // on Search filter for add members
  const onChangeSearch = (e) => {
    setGroupName(e.target.value.trimStart());
  };

  const handleAdd = () => {
    let findIndexGroupID = data.findIndex((data) => data.GroupID === groupID);
    if (groupID !== 0 && committeeID !== 0) {
      if (findIndexGroupID !== -1) {
        showMessage(t("This-group-already-exist-is-list"), "error", setOpen);
        setGroupName("");
        setGroupID(0);
      } else {
        data.push({
          GroupID: groupID,
          CommitteeId: committeeID,
          CommitteeMappingID: 0,
        });
        groupData.push({
          GroupID: groupID,
          GroupName: groupName,
          CommitteeMappingID: 0,
        });
        setData([...data]);
        setGroupData([...groupData]);
        setGroupName("");
        setGroupID(0);
      }
    }
  };

  const removeHandler = (id) => {
    let newDatafindDex = committeeData[0].listOfGroups.find(
      (data) => data.groupID === id
    );
    let newGroupData = groupData.filter((data, index) => data.GroupID !== id);
    if (newDatafindDex !== undefined) {
      let newData2 = data.map((items, index) => {
        if (newDatafindDex.committeeMappingID === items.CommitteeMappingID) {
          const newData = {
            ...items,
            GroupID: 0,
            CommitteeId: 0,
            CommitteeMappingID: items.CommitteeMappingID,
          };
          return newData;
        }
        return items;
      });
      setData(newData2);
    } else {
      let newGroupData = data.filter((data, index) => data.GroupID !== id);
      setData(newGroupData);
    }
    setGroupData(newGroupData);
  };

  useEffect(() => {
    if (committeeData !== null && committeeData !== undefined) {
      if (committeeData[0].listOfGroups.length > 0) {
        
        let newDataforSend = [];
        let newDataforView = [];
        committeeData[0].listOfGroups.map((listgroupsData, index) => {
          newDataforSend.push({
            GroupID: listgroupsData.groupID,
            CommitteeId: listgroupsData.committeeID,
            CommitteeMappingID: listgroupsData.committeeMappingID,
          });
          
          newDataforView.push({
            GroupID: listgroupsData.groupID,
            GroupName: listgroupsData.groupTitle,
            CommitteeMappingID: listgroupsData.committeeMappingID,
          });
        });
        
        setGroupData(newDataforView);
        setData(newDataforSend);
      }
    }
  }, [committeeData]);
  const handleUpdate = () => {
    if (data.length > 0) {
      let Data = {
        committeeGroupMapping: data,
      };
      dispatch(assignGroups(navigate, Data, t, setMarketingTeam));
    } else {
    }
  };
  useEffect(() => {
    try {
      dispatch(getAllGroups(navigate, t));
    } catch (error) {}
  }, []);
  useEffect(() => {
    if (GroupsReducer.getAllGroups !== null) {
      let newArr = [];
      GroupsReducer.getAllGroups.map((data) => {
        newArr.push({
          GroupID: data.pK_GRID,
          GroupTitle: data.title,
          GroupStatus: data.fK_GRSID,
        });
      });
      setGroups(newArr);
    }
  }, [GroupsReducer.getAllGroups]);
  return (
    <>
      <Container>
        <Modal
          show={MarketingTeam}
          onHide={() => {
            setMarketingTeam(false);
          }}
          setShow={setMarketingTeam}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          size={"md"}
          modalBodyClassName={styles["MarketingTeamModalBody"]}
          ModalBody={
            <>
              <Row>
                <Col lg={12} md={12} sm={12} className="d-flex text-center ">
                  <span className={styles["Marketing-Modal-Heading"]}>
                    {t("Marketing-team-committee")}
                  </span>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col lg={12} md={12} sm={12}>
                  <Row>
                    <Col
                      lg={10}
                      md={10}
                      sm={12}
                      className="d-flex justify-content-start Saved_money_Tagline"
                    >
                      <InputSearchFilter
                        labelclass="d-none"
                        value={groupName}
                        filteredDataHandler={searchFilterHandler(groupName)}
                        change={onChangeSearch}
                      />
                    </Col>
                    <Col lg={2} md={2} sm={12}>
                      <Button
                        className={styles["ADD-MarketingModal-btn"]}
                        text={t("Add")}
                        onClick={handleAdd}
                      />
                    </Col>
                  </Row>
                  <section className={styles["mapping_groups_scroll"]}>
                    {groupData.length > 0
                      ? groupData.map((data) => {
                          return (
                            <Row>
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["marketingDataCol"]}
                              >
                                <Row className="align-items-center my-2 ">
                                  <Col sm={1} md={1} lg={1}>
                                    <span className={styles["group_Icon_Box"]}>
                                      <img
                                        draggable="false"
                                        src={Group_Icon}
                                        alt=""
                                        width={30}
                                        height={30}
                                      />
                                    </span>
                                  </Col>
                                  <Col sm={10} md={10} lg={10}>
                                    <span className="ms-3">
                                      {data.GroupName}
                                    </span>{" "}
                                  </Col>
                                  <Col
                                    sm={1}
                                    md={1}
                                    lg={1}
                                    className="d-flex justify-content-end"
                                  >
                                    <img
                                      draggable="false"
                                      src={Crossicon}
                                      alt=""
                                      onClick={() =>
                                        removeHandler(data.GroupID)
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          );
                        })
                      : null}
                  </section>
                </Col>
              </Row>
            </>
          }
          ModalFooter={
            <>
              <Row className="mt-5">
                <Col
                  lg={12}
                  sm={12}
                  md={12}
                  className="d-flex justify-content-end gap-2"
                >
                  <Button
                    text={t("Close")}
                    className={styles["CloseModal"]}
                    onClick={closebtn}
                  />
                  <Button
                    text={t("Update")}
                    className={styles["Confirm-activegroup-modal"]}
                    onClick={handleUpdate}
                  />
                </Col>
              </Row>
            </>
          }
        />
      </Container>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default ModalMarketingTeamCommittee;
