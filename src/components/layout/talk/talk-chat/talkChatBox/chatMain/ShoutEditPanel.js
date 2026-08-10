import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { Checkbox } from "antd";
import { TextField, Button } from "../../../../../elements";
import {
  GetActiveUsersByBroadcastID,
  UpdateShoutAll,
} from "../../../../../../store/actions/Talk_action";
import useSnackbar from "../../../../../elements/snack_bar/useSnackbar";
import ShoutIcon from "../../../../../../assets/images/Shout-Icon.png";
import CloseChatIcon from "../../../../../../assets/images/Cross-Chat-Icon.png";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import SingleIcon from "../../../../../../assets/images/Single-Icon.png";

const ShoutEditPanel = ({ broadcastId, channelId, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { talkStateData } = useSelector((state) => state);
  const currentUserId = localStorage.getItem("userID");
  const [show, SnackBar] = useSnackbar();

  const [orgUsers, setOrgUsers] = useState([]);
  const [shoutName, setShoutName] = useState("");
  // Own toggle for the name-edit text field, separate from this panel's
  // visibility (owned by the parent's activePanel). Previously this reused
  // the same flag that gated the whole panel, so once the panel was open the
  // "not editing" branch could never be reached — the name field was
  // permanently stuck in edit mode and the edit-pencil icon did nothing.
  const [showEditShoutNameField, setShowEditShoutNameField] = useState(false);
  const [pendingMemberIds, setPendingMemberIds] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Fetch fresh on every mount (i.e. every time this panel opens).
  useEffect(() => {
    dispatch(
      GetActiveUsersByBroadcastID(
        navigate,
        { TalkRequest: { BroadcastID: broadcastId, ChannelID: channelId } },
        t,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [broadcastId, channelId]);

  // Own independent copy of the org's user list — see GroupEditPanel for why
  // this isn't shared with it.
  useEffect(() => {
    if (
      talkStateData.AllUsers.AllUsersData !== undefined &&
      talkStateData.AllUsers.AllUsersData !== null &&
      talkStateData.AllUsers.AllUsersData.length !== 0
    ) {
      setOrgUsers(talkStateData.AllUsers.AllUsersData.allUsers);
    }
  }, [talkStateData?.AllUsers?.AllUsersData?.allUsers]);

  // Seed the editable shout name and the pending-member-id list.
  useEffect(() => {
    const broadcastUsers =
      talkStateData?.ActiveUsersByBroadcastID?.ActiveUsersByBroadcastIDData
        ?.broadcastUsers;
    if (broadcastUsers === undefined || broadcastUsers === null) return;

    const firstShoutUser = broadcastUsers[0];
    if (firstShoutUser && firstShoutUser.name) {
      setShoutName(firstShoutUser.name);
    }

    const allUsersList = talkStateData?.AllUsers?.AllUsersData?.allUsers;
    if (allUsersList !== undefined && allUsersList !== null) {
      const shoutMembersArray = broadcastUsers
        .filter((item) => allUsersList.some((user) => user.id === item.userID))
        .map((item) => item.userID);
      setPendingMemberIds(shoutMembersArray);
    }
  }, [
    talkStateData?.ActiveUsersByBroadcastID?.ActiveUsersByBroadcastIDData
      ?.broadcastUsers,
  ]);

  const searchShoutEditUser = (e) => {
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

  const editShoutTitle = () => setShowEditShoutNameField(true);
  const shoutNameHandler = (e) => setShoutName(e.target.value);

  const editShoutUsersCheckedHandler = (id) => {
    if (pendingMemberIds.length === 1 && pendingMemberIds.includes(id)) {
      show(t("At least one user must be selected."), "error");
      return;
    }
    setPendingMemberIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const editShoutAll = () => {
    const data = {
      TalkRequest: {
        UserID: parseInt(currentUserId),
        ChannelID: channelId,
        Group: {
          GroupID: broadcastId,
          GroupName: shoutName,
          Users: pendingMemberIds.join(","),
        },
      },
    };
    dispatch(UpdateShoutAll(data, t, navigate));
    onClose();
  };

  return (
    <>
      <Row className="mt-1">
        <Col lg={4} md={4} sm={12}></Col>
        <Col lg={4} md={4} sm={12} className="d-flex justify-content-center">
          <div className="chat-groupinfo-icon">
            <img draggable="false" src={ShoutIcon} width={20} alt="" />
          </div>
        </Col>
        <Col lg={4} md={4} sm={12} className="text-end">
          <img
            draggable="false"
            onClick={onClose}
            src={CloseChatIcon}
            width={10}
            alt=""
            className="cursor-pointer"
          />
        </Col>
      </Row>
      <Row className="">
        <Col lg={2} md={2} sm={12}></Col>
        {showEditShoutNameField === false ? (
          <Col
            lg={8}
            md={8}
            sm={12}
            className="text-center d-flex align-items-center justify-content-center">
            <p className="groupinfo-groupname m-0">
              {shoutName !== undefined && shoutName !== null ? shoutName : null}
            </p>
            <img
              draggable="false"
              onClick={editShoutTitle}
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
              value={shoutName}
              className="chat-message-input"
              name="ChatMessage"
              placeholder={"Shout Name"}
              maxLength={200}
              change={shoutNameHandler}
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
              searchShoutEditUser(e.target.value);
            }}
            value={searchValue}
            placeholder="Search Users"
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
                        onChange={() => editShoutUsersCheckedHandler(dataItem.id)}
                        className="group-edit-users-add"
                      />
                      <div className="chat-profile-icon groupinfo">
                        <img draggable="false" src={SingleIcon} alt="" width={15} />
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
              text={t("Edit-shout")}
              onClick={editShoutAll}
            />
          </div>
        </Col>
      </Row>
      {SnackBar}
    </>
  );
};

export default ShoutEditPanel;
