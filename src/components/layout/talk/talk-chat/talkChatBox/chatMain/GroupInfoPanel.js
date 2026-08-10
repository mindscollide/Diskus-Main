import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { TextField } from "../../../../../elements";
import { newTimeFormaterAsPerUTCTalkDateTime } from "../../../../../../commen/functions/date_formater";
import { GetAllPrivateGroupMembers } from "../../../../../../store/actions/Talk_action";
import GroupIcon from "../../../../../../assets/images/Group-Icon.png";
import CloseChatIcon from "../../../../../../assets/images/Cross-Chat-Icon.png";
import SingleIcon from "../../../../../../assets/images/Single-Icon.png";

const GroupInfoPanel = ({ groupId, channelId, groupCreatedDate, lang, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { talkStateData } = useSelector((state) => state);

  const [groupInfoData, setGroupInfoData] = useState([]);
  const [groupInfoSearchValue, setGroupInfoSearchValue] = useState("");

  // Fetch fresh on every mount (i.e. every time this panel opens) and again
  // if the group changes while it's open — fixes Group Info previously only
  // showing whatever a mount-only effect or Group Edit happened to have
  // fetched earlier, which went stale after switching groups or editing.
  useEffect(() => {
    dispatch(
      GetAllPrivateGroupMembers(navigate, { GroupID: groupId, ChannelID: channelId }, t),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, channelId]);

  useEffect(() => {
    if (
      talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse !==
        undefined &&
      talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse !==
        null &&
      talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
        .length !== 0
    ) {
      setGroupInfoData(
        talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
          ?.groupUsers,
      );
    }
  }, [
    talkStateData?.GetPrivateGroupMembers?.GetPrivateGroupMembersResponse
      ?.groupUsers,
  ]);

  const searchGroupInfoUser = (e) => {
    setGroupInfoSearchValue(e);
    try {
      if (
        talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse !==
          undefined &&
        talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse !==
          null &&
        talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
          .length !== 0
      ) {
        if (e !== "") {
          let filteredData =
            talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse.groupUsers.filter(
              (value) => {
                return value.userName.toLowerCase().includes(e.toLowerCase());
              },
            );
          if (filteredData.length === 0) {
            setGroupInfoData(
              talkStateData.GetPrivateGroupMembers
                .GetPrivateGroupMembersResponse.groupUsers,
            );
          } else {
            setGroupInfoData(filteredData);
          }
        } else if (e === "" || e === null) {
          let data =
            talkStateData.GetPrivateGroupMembers.GetPrivateGroupMembersResponse
              .groupUsers;
          setGroupInfoSearchValue("");
          setGroupInfoData(data);
        }
      }
    } catch {}
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
        <Col lg={8} md={8} sm={12} className="text-center">
          <p className="groupinfo-groupname m-0">
            {groupInfoData === undefined || groupInfoData.length === 0
              ? ""
              : groupInfoData[0].name}
          </p>
          <p className="groupinfo-createdon m-0">
            Created on:{" "}
            {groupInfoData === undefined || groupInfoData.length === 0
              ? ""
              : newTimeFormaterAsPerUTCTalkDateTime(groupCreatedDate, lang)}
          </p>
        </Col>
        <Col lg={2} md={2} sm={12} className="text-end"></Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} style={{ marginBottom: "5px" }}>
          <TextField
            maxLength={200}
            applyClass="form-control2"
            name="Name"
            change={(e) => {
              searchGroupInfoUser(e.target.value);
            }}
            value={groupInfoSearchValue}
            placeholder="Search Users"
            labelclass={"d-none"}
          />
        </Col>
      </Row>
      <div className="users-list-groupinfo">
        {groupInfoData !== undefined &&
        groupInfoData !== null &&
        groupInfoData.length > 0
          ? [
              ...new Map(groupInfoData.map((item) => [item.userID, item])).values(),
            ].map((dataItem, index) => {
              return (
                <Row style={{ alignItems: "center" }}>
                  <Col lg={12} md={12} sm={12} style={{ paddingRight: "20px" }}>
                    <div className="users-groupinfo">
                      <div className="chat-profile-icon groupinfo">
                        <img draggable="false" src={SingleIcon} width={15} alt="" />
                      </div>
                      <p className="groupinfo-groupusersname m-0">
                        {dataItem.userName}

                        {dataItem.adminUser === dataItem.userID ? (
                          <span className="groupinfo-admin">Admin</span>
                        ) : null}
                      </p>
                    </div>
                  </Col>
                </Row>
              );
            })
          : null}
      </div>
    </>
  );
};

export default GroupInfoPanel;
