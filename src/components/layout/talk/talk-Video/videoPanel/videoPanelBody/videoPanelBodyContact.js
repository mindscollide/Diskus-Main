import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container, Row, Col } from "react-bootstrap";
import { TextField, Loader, Modal, Button } from "../../../../../elements";
import "./videoPanelBody.css";
import VideoCallIcon from "../../../../../../assets/images/VideoCall-Icon.png";
import { Spin } from "antd";
import { LoaderPanel } from "../../../../../elements";
import { Checkbox } from "antd";
import {
  GetAllVideoCallUsers,
  InitiateVideoCall,
  getVideoRecipentData,
  groupCallRecipients,
  callRequestReceivedMQTT,
  LeaveCall,
} from "../../../../../../store/actions/VideoMain_actions";
import {
  normalizeVideoPanelFlag,
  videoChatPanel,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  leaveCallModal,
  participantPopup,
} from "../../../../../../store/actions/VideoFeature_actions";
import VideoPanelFooter from "../videoPanelFooter/videoPanelFooter";

const VideoPanelBodyContact = () => {
  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  let currentOrganization = Number(localStorage.getItem("organizationID"));

  let currentUserID = Number(localStorage.getItem("userID"));

  let activeCall = JSON.parse(localStorage.getItem("activeCall"));

  let initiateRoomID = localStorage.getItem("initiateCallRoomID");

  let currentCallType = Number(localStorage.getItem("CallType"));

  let callTypeID = Number(localStorage.getItem("callTypeID"));

  let callerID = Number(localStorage.getItem("callerID"));

  const [searchChatValue, setSearchChatValue] = useState("");

  const [allUsers, setAllUsers] = useState([]);

  const [groupCallUsers, setGroupCallUsers] = useState([]);

  const [groupCallActiveUsers, setGroupCallActiveUsers] = useState([]);

  const [initiateVideoModalOto, setInitiateVideoModalOto] = useState(false);

  const [initiateVideoModalGroup, setInitiateVideoModalGroup] = useState(false);

  const groupCallUsersHandler = (data) => {
    if (groupCallUsers.includes(data.userID)) {
      let groupUsersIndex = groupCallUsers.findIndex(
        (userID) => userID === data.userID
      );
      if (groupUsersIndex !== -1) {
        groupCallUsers.splice(groupUsersIndex, 1);
        setGroupCallUsers([...groupCallUsers]);
      }
    } else {
      groupCallUsers.push(data.userID);
      setGroupCallUsers([...groupCallUsers]);
    }
    if (groupCallActiveUsers.includes(data)) {
      let activeGroupCallUsersIndex = groupCallActiveUsers.findIndex(
        (data2, index) => data === data2
      );
      if (activeGroupCallUsersIndex !== -1) {
        groupCallActiveUsers.splice(activeGroupCallUsersIndex, 1);
        setGroupCallActiveUsers([...groupCallActiveUsers]);
      }
    } else {
      groupCallActiveUsers.push(data);
      setGroupCallActiveUsers([...groupCallActiveUsers]);
    }
  };

  console.log("groupCallActiveUsers", groupCallActiveUsers);

  const searchChat = (e) => {
    setSearchChatValue(e);
    try {
      if (
        VideoMainReducer.VideoCallUsersData !== undefined &&
        VideoMainReducer.VideoCallUsersData !== null &&
        VideoMainReducer.VideoCallUsersData.length !== 0
      ) {
        if (e !== "") {
          let filteredData = VideoMainReducer.VideoCallUsersData.users.filter(
            (value) => {
              return value.userName.toLowerCase().includes(e.toLowerCase());
            }
          );
          if (filteredData.length === 0) {
            setAllUsers(VideoMainReducer.VideoCallUsersData.users);
          } else {
            setAllUsers(filteredData);
          }
        } else if (e === "" || e === null) {
          let data = VideoMainReducer.VideoCallUsersData.users;
          setSearchChatValue("");
          setAllUsers(data);
        }
      }
    } catch {}
  };

  useEffect(() => {
    let Data = { OrganizationID: currentOrganization };
    dispatch(GetAllVideoCallUsers(Data, navigate, t));
  }, []);

  console.log("VideoMainReducer", VideoMainReducer);

  //Setting state data of all users
  useEffect(() => {
    if (
      VideoMainReducer.VideoCallUsersData !== undefined &&
      VideoMainReducer.VideoCallUsersData !== null &&
      VideoMainReducer.VideoCallUsersData.length !== 0
    ) {
      setAllUsers(VideoMainReducer?.VideoCallUsersData?.users);
    } else {
      setAllUsers([]);
    }
  }, [VideoMainReducer?.VideoCallUsersData]);

  const otoVideoCall = (userData) => {
    if (activeCall === false) {
      console.log("Video Called User Data", userData);
      let Data = {
        RecipentIDs: [userData.userID],
        CallTypeID: 1,
        OrganizationID: currentOrganization,
      };
      localStorage.setItem("CallType", Data.CallTypeID);
      dispatch(InitiateVideoCall(Data, navigate, t));
      localStorage.setItem("isCaller", true);
      localStorage.setItem("activeCall", true);
      localStorage.setItem("callerID", currentUserID);
      localStorage.setItem("recipentCalledID", userData.userID);
      dispatch(callRequestReceivedMQTT({}, ""));
      dispatch(getVideoRecipentData(userData));
      dispatch(normalizeVideoPanelFlag(true));
      dispatch(videoChatPanel(false));
      console.log("Video Called User Data", Data);
    } else {
      setInitiateVideoModalOto(true);
      // localStorage.setItem('callerID', currentUserID)
      localStorage.setItem("recipentCalledID", userData.userID);
      dispatch(callRequestReceivedMQTT({}, ""));
      dispatch(getVideoRecipentData(userData));
    }
  };

  const initiateGroupCall = () => {
    if (activeCall === false) {
      if (groupCallUsers.length <= 1) {
        console.log("Initiate Group Call Boys Less", groupCallUsers);
      } else {
        let Data = {
          RecipentIDs: groupCallUsers,
          CallTypeID: 2,
          OrganizationID: currentOrganization,
        };
        localStorage.setItem("CallType", Data.CallTypeID);
        dispatch(InitiateVideoCall(Data, navigate, t));
        localStorage.setItem("isCaller", true);
        localStorage.setItem("activeCall", true);
        localStorage.setItem("callerID", currentUserID);
        dispatch(callRequestReceivedMQTT({}, ""));
        dispatch(groupCallRecipients(groupCallActiveUsers));
        // dispatch(getVideoRecipentData(userData))
        dispatch(normalizeVideoPanelFlag(true));
        dispatch(videoChatPanel(false));
        console.log("Initiate Group Call Boys More", groupCallUsers);
      }
    } else {
      setInitiateVideoModalGroup(true);
    }
  };

  const leaveCallHostOto = () => {
    let userCalledID = Number(localStorage.getItem("recipentCalledID"));
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: initiateRoomID,
      IsCaller: true,
      CallTypeID: currentCallType,
    };
    let Data2 = {
      RecipentIDs: [userCalledID],
      CallTypeID: 1,
      OrganizationID: currentOrganization,
    };
    dispatch(LeaveCall(Data, navigate, t));
    dispatch(InitiateVideoCall(Data2, navigate, t));
    localStorage.setItem("isCaller", true);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    setInitiateVideoModalOto(false);
    dispatch(participantPopup(false));
    localStorage.setItem("CallType", Data2.CallTypeID);
    localStorage.setItem("activeCall", true);
    localStorage.setItem("callerID", currentUserID);
    localStorage.setItem("recipentCalledID", userCalledID);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(videoChatPanel(false));
  };

  const leaveCallParticipantOto = () => {
    let roomID = localStorage.getItem("acceptedRoomID");
    let userCalledID = Number(localStorage.getItem("recipentCalledID"));
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: roomID,
      IsCaller: false,
      CallTypeID: callTypeID,
    };
    let Data2 = {
      RecipentIDs: [userCalledID],
      CallTypeID: 1,
      OrganizationID: currentOrganization,
    };
    dispatch(LeaveCall(Data, navigate, t));
    dispatch(InitiateVideoCall(Data2, navigate, t));
    localStorage.setItem("isCaller", true);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    setInitiateVideoModalOto(false);
    dispatch(participantPopup(false));
    localStorage.setItem("CallType", Data2.CallTypeID);
    localStorage.setItem("activeCall", true);
    // localStorage.setItem('callerID', currentUserID)
    // localStorage.setItem('recipentCalledID', userCalledID)
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(videoChatPanel(false));
  };

  const leaveCallHostGroup = () => {
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: initiateRoomID,
      IsCaller: true,
      CallTypeID: currentCallType,
    };
    let Data2 = {
      RecipentIDs: groupCallUsers,
      CallTypeID: 2,
      OrganizationID: currentOrganization,
    };
    dispatch(LeaveCall(Data, navigate, t));
    dispatch(InitiateVideoCall(Data2, navigate, t));
    localStorage.setItem("isCaller", true);
    localStorage.setItem("CallType", Data2.CallTypeID);
    localStorage.setItem("activeCall", true);
    localStorage.setItem("callerID", currentUserID);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(groupCallRecipients(groupCallActiveUsers));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(videoChatPanel(false));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    setInitiateVideoModalGroup(false);
    console.log("Initiate Group Call Boys More", groupCallUsers);
  };

  const leaveCallParticipantGroup = () => {
    let roomID = localStorage.getItem("acceptedRoomID");
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: roomID,
      IsCaller: false,
      CallTypeID: callTypeID,
    };
    let Data2 = {
      RecipentIDs: groupCallUsers,
      CallTypeID: 2,
      OrganizationID: currentOrganization,
    };
    dispatch(LeaveCall(Data, navigate, t));
    dispatch(InitiateVideoCall(Data2, navigate, t));
    localStorage.setItem("isCaller", true);
    localStorage.setItem("CallType", Data2.CallTypeID);
    localStorage.setItem("activeCall", true);
    // localStorage.setItem('callerID', currentUserID)
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(groupCallRecipients(groupCallActiveUsers));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(videoChatPanel(false));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    setInitiateVideoModalGroup(false);
    console.log("Initiate Group Call Boys More", groupCallUsers);
  };

  let buttonText = t("Group-call");

  if (groupCallUsers.length > 0) {
    const formattedLength = String(groupCallUsers.length).padStart(2, "0");
    buttonText += " (" + formattedLength + ")";
  }

  return (
    <>
      <Container>
        {videoFeatureReducer.VideoChatSearchFlag === true ? (
          <Row>
            <Col lg={12} md={12} sm={12} className="mt-2">
              <TextField
                maxLength={200}
                applyClass="form-control2"
                name="Name"
                change={(e) => {
                  searchChat(e.target.value);
                }}
                value={searchChatValue}
                placeholder="Search-Chat"
                labelClass={"d-none"}
              />
            </Col>
          </Row>
        ) : null}
        {allUsers !== undefined &&
        allUsers !== null &&
        allUsers.length > 0 &&
        VideoMainReducer.Loading === false ? (
          allUsers.map((userData, index) => {
            console.log("userData", userData);
            return (
              <Row className="single-chat" key={index}>
                <Col lg={1} md={1} sm={1} className="mt-4">
                  <Checkbox onChange={() => groupCallUsersHandler(userData)} />
                </Col>
                <Col lg={2} md={2} sm={2} className="bottom-border">
                  <div
                    className="video-profile-icon"
                    style={{
                      backgroundImage: `url('data:image/jpeg;base64,${userData.profilePicture.displayProfilePictureName}')`,
                    }}
                  ></div>
                </Col>
                <Col lg={7} md={7} sm={7} className="bottom-border">
                  <div className={"video-block"}>
                    <p className="Video-chat-username m-0">
                      {userData.userName}
                    </p>

                    <p className="video-chat-date m-0">
                      {userData.organizationName}
                    </p>
                  </div>
                </Col>
                <Col lg={2} md={2} sm={2} className="video_call_icon mt-4">
                  <img
                    className="cursor-pointer"
                    src={VideoCallIcon}
                    onClick={() => otoVideoCall(userData)}
                  />
                </Col>
              </Row>
            );
          })
        ) : VideoMainReducer.Loading === true ? (
          <>
            <LoaderPanel
              message={"Safeguarding your data to enhance the experience"}
            />
          </>
        ) : (
          <p>No Users Available</p>
        )}
      </Container>
      <VideoPanelFooter
        groupCallClick={initiateGroupCall}
        groupbtnClassName={
          groupCallUsers.length <= 1 ? "group-btn-gray" : "group-btn"
        }
        buttonText={buttonText}
      />

      <Modal
        show={initiateVideoModalOto}
        onHide={() => {
          setInitiateVideoModalOto(false);
        }}
        setShow={setInitiateVideoModalOto}
        modalFooterClassName="d-none"
        centered
        size={"sm"}
        ModalBody={
          <>
            <Container>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <p> OTO Call Disconnection </p>
                </Col>
              </Row>
              <Row className="mt-3 mb-4">
                <Col
                  lg={12}
                  sm={12}
                  md={12}
                  className="d-flex justify-content-center gap-2"
                >
                  <Button
                    text={
                      callerID === currentUserID || callerID === 0
                        ? t("End Host")
                        : callerID !== currentUserID
                        ? t("End Participant")
                        : null
                    }
                    className="leave-meeting-options__btn leave-meeting-red-button"
                    onClick={
                      callerID === currentUserID || callerID === 0
                        ? leaveCallHostOto
                        : callerID !== currentUserID
                        ? leaveCallParticipantOto
                        : null
                    }
                  />

                  <Button
                    text={t("Cancel")}
                    className="leave-meeting-options__btn leave-meeting-gray-button"
                    onClick={() => setInitiateVideoModalOto(false)}
                  />
                </Col>
              </Row>
            </Container>
          </>
        }
      />

      <Modal
        show={initiateVideoModalGroup}
        onHide={() => {
          setInitiateVideoModalGroup(false);
        }}
        setShow={setInitiateVideoModalGroup}
        modalFooterClassName="d-none"
        centered
        size={"sm"}
        ModalBody={
          <>
            <Container>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <p> Group Call Disconnection </p>
                </Col>
              </Row>
              <Row className="mt-3 mb-4">
                <Col
                  lg={12}
                  sm={12}
                  md={12}
                  className="d-flex justify-content-center gap-2"
                >
                  <Button
                    text={
                      callerID === currentUserID || callerID === 0
                        ? t("End Host")
                        : callerID !== currentUserID
                        ? t("End Participant")
                        : null
                    }
                    className="leave-meeting-options__btn leave-meeting-red-button"
                    onClick={
                      callerID === currentUserID || callerID === 0
                        ? leaveCallHostGroup
                        : callerID !== currentUserID
                        ? leaveCallParticipantGroup
                        : null
                    }
                  />

                  <Button
                    text={t("Cancel")}
                    className="leave-meeting-options__btn leave-meeting-gray-button"
                    onClick={() => setInitiateVideoModalGroup(false)}
                  />
                </Col>
              </Row>
            </Container>
          </>
        }
      />
    </>
  );
};

export default VideoPanelBodyContact;
