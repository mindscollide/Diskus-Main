import React, { useEffect, useState } from "react";
import styles from "./AgendaContritbutorsModal.module.css";
import {
  Modal,
  Button,
  Notification,
  InputSearchFilter,
} from "../../../../../../components/elements";
import {
  showAddAgendaContributor,
  showAgendaContributorsModals,
} from "../../../../../../store/actions/NewMeetingActions";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import { useDispatch, useSelector } from "react-redux";
import CrossIcon from "../../../../../../assets/images/CrossIcon.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { GetAllCommitteesUsersandGroups } from "../../../../../../store/actions/MeetingOrganizers_action";
import GroupIcon from "../../../../../../assets/images/Path 636.png";
import committeeicon from "../../../../../../assets/images/committeedropdown.svg";
const AgendaContributorsModal = ({
  SelectedRSVP,
  rowsData,
  setRowsData,
  setNotificedMembersData,
  currentMeeting,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdowndata, setDropdowndata] = useState([]);
  const [membersOrganizers, setMembersOrganizers] = useState([]);
  const [agendaContributorUsers, setAgendaContributorUsers] = useState("");
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state
  );

  useEffect(() => {
    let newOrganizersData =
      MeetingOrganizersReducer.AllUserCommitteesGroupsData;
    if (newOrganizersData !== null && newOrganizersData !== undefined) {
      let temp = [];
      if (Object.keys(newOrganizersData).length > 0) {
        if (Object.keys(newOrganizersData.groups).length > 0) {
          newOrganizersData.groups.forEach((a, index) => {
            let newData = {
              value: a.groupID,
              label: a.groupName,
              profilePic: GroupIcon,
              type: 1,
            };
            temp.push(newData);
          });
        }
        if (Object.keys(newOrganizersData.committees).length > 0) {
          newOrganizersData.committees.forEach((a, index) => {
            let newData = {
              value: a.committeeID,
              label: a.committeeName,
              profilePic: committeeicon,

              type: 2,
            };
            temp.push(newData);
          });
        }
        if (Object.keys(newOrganizersData.organizationUsers).length > 0) {
          newOrganizersData.organizationUsers.forEach((a, index) => {
            let newData = {
              value: a.userID,
              label: a.userName,
              profilePic: a?.profilePicture?.displayProfilePictureName,
              type: 3,
            };
            temp.push(newData);
          });
        }
        setDropdowndata(temp);
      } else {
        setDropdowndata([]);
      }
    }
  }, [MeetingOrganizersReducer.AllUserCommitteesGroupsData]);

  useEffect(() => {
    let Data = {
      MeetingID: currentMeeting !== null ? Number(currentMeeting) : 0,
    };
    dispatch(GetAllCommitteesUsersandGroups(Data, navigate, t));
  }, []);

  const handleCrossIcon = () => {
    dispatch(showAddAgendaContributor(false));
  };

  const removeContributor = (record) => {
    let removemembersOrganizers = membersOrganizers.filter(
      (data, index) => data.userID !== record.userID
    );
    setMembersOrganizers(removemembersOrganizers);
  };

  const handleClickDone = () => {
    let newData = [...rowsData, ...membersOrganizers];
    // Create a Set to remove duplicates based on userID
    const uniqueData = new Set(newData.map((obj) => obj.userID));
    // Convert the Set back to an array
    newData = [...uniqueData].map((userID) =>
      newData.find((obj) => obj.userID === userID)
    );

    if (membersOrganizers.length === 0) {
      setOpen({
        flag: true,
        message: t("Atleast-one-agenda-contributor-should-be-selected"),
      });
    } else {
      setRowsData(newData);
      dispatch(showAddAgendaContributor(false));
      dispatch(showAgendaContributorsModals(true));
      setNotificedMembersData(newData);
      // Combine the arrays into newData
    }
  };

  const onChangeSearch = (e) => {
    setAgendaContributorUsers(e.target.value.trimStart());
  };

  const onSearch = (name, id, type, item) => {
    let newOrganizersData =
      MeetingOrganizersReducer.AllUserCommitteesGroupsData;
    let tem = [...membersOrganizers];
    if (type === 1) {
      // Groups Search
      let check1 = newOrganizersData.groups.find(
        (data, index) => data.groupID === id
      );
      if (check1 !== undefined) {
        let groupUsers = check1.groupUsers;
        if (Object.keys(groupUsers).length > 0) {
          groupUsers.forEach((gUser, index) => {
            let check2 = membersOrganizers.find(
              (data, index) => data.UserID === gUser.userID
            );
            if (check2 !== undefined) {
            } else {
              let newUser = {
                userName: gUser.userName,
                userID: gUser.userID,
                displayPicture: gUser.profilePicture.displayProfilePictureName,
                email: gUser.emailAddress,
                Title: "",
                agendaListRightsAll:
                  Number(SelectedRSVP.value) === 1 ? true : false,
                isEdit: false,
                isContributedNotified: true,
              };
              tem.push(newUser);
            }
          });
        }
      }
    } else if (type === 2) {
      // Committees Search
      let check1 = newOrganizersData.committees.find(
        (data, index) => data.committeeID === id
      );

      if (check1 !== undefined) {
        let committeesUsers = check1.committeeUsers;
        if (Object.keys(committeesUsers).length > 0) {
          committeesUsers.forEach((cUser, index) => {
            let check2 = membersOrganizers.find(
              (data, index) => data.UserID === cUser.userID
            );
            if (check2 !== undefined) {
            } else {
              let newUser = {
                userName: cUser.userName,
                userID: cUser.userID,
                displayPicture: cUser.profilePicture.displayProfilePictureName,
                email: cUser.emailAddress,
                isContributedNotified: true,
                Title: "",
                agendaListRightsAll:
                  Number(SelectedRSVP.value) === 1 ? true : false,
                isEdit: false,
              };
              tem.push(newUser);
            }
          });
        }
      }
    } else if (type === 3) {
      // User Search
      let check1 = membersOrganizers.find((data, index) => data.UserID === id);

      if (check1 !== undefined) {
      } else {
        let check2 = newOrganizersData.organizationUsers.find(
          (data, index) => data.userID === id
        );
        if (check2 !== undefined) {
          let newUser = {
            userName: check2.userName,
            userID: check2.userID,
            displayPicture: check2.profilePicture.displayProfilePictureName,
            email: check2.emailAddress,
            isContributedNotified: true,
            Title: "",
            agendaListRightsAll:
              Number(SelectedRSVP.value) === 1 ? true : false,
            isEdit: false,
          };
          tem.push(newUser);
        }
      }
    }
    const uniqueData = new Set(tem.map(JSON.stringify));

    const result = Array.from(uniqueData).map(JSON.parse);
    setMembersOrganizers(result);
    setAgendaContributorUsers("");
  };

  //Drop Down Values
  const searchFilterHandler = (value) => {
    let allAssignees = dropdowndata;
    try {
      if (
        allAssignees !== undefined &&
        allAssignees !== null &&
        allAssignees !== []
      ) {
        return allAssignees
          .filter((item) => {
            const searchValue = value.toLowerCase();
            const agendaContributorValue = item.label.toLowerCase();
            return (
              searchValue && agendaContributorValue.startsWith(searchValue)
            );
          })
          .slice(0, 10)
          .map((item) => (
            <div
              onClick={() => onSearch(item.label, item.value, item.type, item)}
              className="dropdown-row-assignee d-flex align-items-center flex-row"
              key={item.pK_UID}
            >
              <img
                draggable="false"
                src={
                  item.type === 3
                    ? `data:image/jpeg;base64,${item?.profilePic}`
                    : item.profilePic
                }
                alt=""
                className="user-img"
              />
              <p className="p-0 m-0">{item.label}</p>
            </div>
          ));
      } else {
      }
    } catch (error) {}
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.agendaContributors}
        setShow={dispatch(showAddAgendaContributor)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showAddAgendaContributor(false));
        }}
        size={"md"}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OverAll_Padding"]}
              >
                <Row>
                  <Col lg={7} md={7} sm={12}>
                    <span className={styles["Add_organization"]}>
                      {t("Add-agenda-contributors")}
                    </span>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <img
                      draggable={false}
                      src={BlackCrossIcon}
                      className={"cursor-pointer"}
                      width="16px"
                      height="16px"
                      alt=""
                      onClick={handleCrossIcon}
                    />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg={12} md={12} sm={12}>
                    <InputSearchFilter
                      placeholder={t("Add-agenda-contributor")}
                      value={agendaContributorUsers}
                      filteredDataHandler={searchFilterHandler(
                        agendaContributorUsers
                      )}
                      // applyClass="assigneeFindInCreateToDo"
                      applyClass={"searchFilterAgendaContributor"}
                      labelClass={"searchFilterAgendaContributorLabel"}
                      disable={dropdowndata.length === 0 ? true : false}
                      change={onChangeSearch}
                    />
                  </Col>
                </Row>

                <Row className={styles["Scroller_For_CreatePollModal2"]}>
                  {membersOrganizers.length > 0
                    ? membersOrganizers.map((data, index) => {
                        return (
                          <>
                            <Col lg={6} md={6} sm={12} className="mt-2">
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={styles["padding_class"]}
                                >
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className={styles["Card_border2"]}>
                                        <Col sm={12} md={10} lg={10}>
                                          <img
                                            draggable={false}
                                            src={`data:image/jpeg;base64,${data?.displayPicture}`}
                                            width="33px"
                                            height="33px"
                                            alt=""
                                          />
                                          <span
                                            className={styles["Name_cards"]}
                                          >
                                            {data.userName}
                                          </span>
                                        </Col>
                                        <Col sm={12} md={2} lg={2}>
                                          <img
                                            draggable={false}
                                            src={CrossIcon}
                                            className="cursor-pointer"
                                            width="14px"
                                            alt=""
                                            height="14px"
                                            onClick={() =>
                                              removeContributor(data)
                                            }
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </>
                        );
                      })
                    : null}
                </Row>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end"
              >
                {membersOrganizers.length > 0 && (
                  <Button
                    text={t("Done")}
                    className={styles["Done_btn_organizor_modal"]}
                    onClick={handleClickDone}
                  />
                )}
              </Col>
            </Row>
          </>
        }
      />
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </section>
  );
};

export default AgendaContributorsModal;
