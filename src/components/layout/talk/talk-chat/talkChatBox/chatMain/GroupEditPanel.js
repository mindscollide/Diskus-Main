import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { Checkbox } from "antd";
import { TextField, Button } from "../../../../../elements";
import {
  GetAllPrivateGroupMembers,
  UpdatePrivateGroup,
} from "../../../../../../store/actions/Talk_action";
import GroupIcon from "../../../../../../assets/images/Group-Icon.png";
import CloseChatIcon from "../../../../../../assets/images/Cross-Chat-Icon.png";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import SingleIcon from "../../../../../../assets/images/Single-Icon.png";

const GroupEditPanel = ({ groupId, channelId, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { talkStateData } = useSelector((state) => state);
  const currentUserId = localStorage.getItem("userID");

  const [orgUsers, setOrgUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [showEditGroupField, setShowEditGroupField] = useState(false);
  const [pendingMemberIds, setPendingMemberIds] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Fetch fresh on every mount (i.e. every time this panel opens).
  useEffect(() => {
    dispatch(
      GetAllPrivateGroupMembers(
        navigate,
        { GroupID: groupId, ChannelID: channelId },
        t,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, channelId]);

  // Own independent copy of the org's user list — not shared with
  // ShoutEditPanel, which fetches its own. The two panels are never open
  // simultaneously (both gated by the parent's activePanel), so this small
  // duplication avoids reintroducing the old bug where a search performed
  // in one panel left the other showing a filtered list.
  useEffect(() => {
    if (
      talkStateData.AllUsers.AllUsersData !== undefined &&
      talkStateData.AllUsers.AllUsersData !== null &&
      talkStateData.AllUsers.AllUsersData.length !== 0
    ) {
      setOrgUsers(talkStateData.AllUsers.AllUsersData.allUsers);
    }
  }, [talkStateData?.AllUsers?.AllUsersData?.allUsers]);

  // Seed the editable group name and the pending-member-id list from the
  // fetch response. pendingMemberIds is this panel's own state — unlike
  // before, unchecking a member here never touches GroupInfoPanel's data.
  useEffect(() => {
    const groupUsers =
      talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
        ?.groupUsers;
    if (groupUsers === undefined || groupUsers === null) return;

    const firstGroupUser = groupUsers[0];
    if (firstGroupUser && firstGroupUser.name) {
      setGroupName(firstGroupUser.name);
    }

    const allUsersList = talkStateData?.AllUsers?.AllUsersData?.allUsers;
    if (allUsersList !== undefined && allUsersList !== null) {
      const groupMembersArray = groupUsers
        .filter((item) => allUsersList.some((user) => user.id === item.userID))
        .map((item) => item.userID);
      setPendingMemberIds(groupMembersArray);
    }
  }, [
    talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
      ?.groupUsers,
  ]);

  const searchGroupEditUser = (e) => {
    setSearchValue(e);
    try {
      if (
        talkStateData.AllUsers.AllUsersData !== undefined &&
        talkStateData.AllUsers.AllUsersData !== null &&
        talkStateData.AllUsers.AllUsersData.length !== 0
      ) {
        if (e !== "") {
          let filteredData = talkStateData.AllUsers.AllUsersData.allUsers.filter(
            (value) => value.fullName.toLowerCase().includes(e.toLowerCase()),
          );
          if (filteredData.length === 0) {
            setOrgUsers(talkStateData.AllUsers.AllUsersData.allUsers);
          } else {
            setOrgUsers(filteredData);
          }
        } else if (e === "" || e === null) {
          setSearchValue("");
          setOrgUsers(talkStateData.AllUsers.AllUsersData.allUsers);
        }
      }
    } catch {}
  };

  const editGroupTitle = () => setShowEditGroupField(true);
  const groupNameHandler = (e) => setGroupName(e.target.value);

  const editGroupUsersCheckedHandler = (id) => {
    setPendingMemberIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const editGroup = () => {
    const editGroupUsersHashCheck = pendingMemberIds.map(
      (value) => value + "#" + 0,
    );
    const data = {
      TalkRequest: {
        UserID: parseInt(currentUserId),
        Group: {
          GroupID: groupId,
          GroupName: groupName,
          Users: editGroupUsersHashCheck.join(","),
        },
      },
    };
    dispatch(UpdatePrivateGroup(data, t, navigate));
    onClose();
  };

  return (
    <>
      <Row className="mt-1">
        <Col lg={4} md={4} sm={12}></Col>
        <Col lg={4} md={4} sm={12} className="d-flex justify-content-center">
          <div className="chat-groupinfo-icon">
            <img draggable="false" src={GroupIcon} width={28} alt="" />
          </div>
        </Col>
        <Col lg={4} md={4} sm={12} className="text-end">
          <img
            className="cursor-pointer"
            draggable="false"
            onClick={onClose}
            src={CloseChatIcon}
            width={10}
            alt=""
          />
        </Col>
      </Row>
      <Row className="">
        <Col lg={2} md={2} sm={12}></Col>
        {showEditGroupField === false ? (
          <Col
            lg={8}
            md={8}
            sm={12}
            className="text-center d-flex align-items-center justify-content-center">
            <p className="groupinfo-groupname m-0">
              {groupName !== undefined && groupName !== null ? groupName : null}
            </p>
            <img
              draggable="false"
              onClick={editGroupTitle}
              className="Edit-Group-Title-Icon cursor-pointer"
              src={EditIcon}
              alt=""
            />
          </Col>
        ) : (
          <Col
            lg={8}
            md={8}
            sm={12}
            className="text-center d-flex align-items-center justify-content-center">
            <TextField
              value={groupName}
              className="chat-message-input"
              name="ChatMessage"
              placeholder={t("Group-Name")}
              maxLength={200}
              change={groupNameHandler}
              autoComplete="off"
              labelclass={"d-none"}
            />
          </Col>
        )}
        <Col lg={2} md={2} sm={12} className="text-end"></Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} style={{ marginBottom: "5px" }}>
          <TextField
            maxLength={200}
            applyClass="form-control2"
            name="Name"
            change={(e) => {
              searchGroupEditUser(e.target.value);
            }}
            value={searchValue}
            placeholder={t("Search-users")}
            labelclass={"d-none"}
          />
        </Col>
      </Row>
      <div className="users-list-groupinfo">
        {orgUsers !== undefined && orgUsers !== null && orgUsers.length > 0
          ? orgUsers.map((dataItem, index) => {
              return (
                <Row style={{ alignItems: "center" }}>
                  <Col lg={12} md={12} sm={12} style={{ paddingRight: "20px" }}>
                    <div className="users-groupinfo">
                      <Checkbox
                        checked={
                          Array.isArray(pendingMemberIds) &&
                          pendingMemberIds.some((item) => item === dataItem.id)
                            ? true
                            : false
                        }
                        onChange={() => editGroupUsersCheckedHandler(dataItem.id)}
                        className="group-edit-users-add"
                      />
                      <div className="chat-profile-icon groupinfo">
                        <img draggable="false" src={SingleIcon} width={15} alt="" />
                      </div>
                      <p className="groupinfo-groupusersname m-0">
                        {dataItem.fullName}
                      </p>
                    </div>
                  </Col>
                </Row>
              );
            })
          : null}
      </div>
      <Row>
        <Col>
          <div className="edit-group-button">
            <Button
              className=" Ok-btn forward-user"
              text={t("Edit-group")}
              onClick={editGroup}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default GroupEditPanel;
