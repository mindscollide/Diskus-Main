import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./VideoNewParticipantList.module.css";
import { Col, Row, Dropdown } from "react-bootstrap";
import CrossIcon from "../../../../../assets/images/VideoCall/Cross_icon_videoCallParticipantWaiting.png";
import { Button, TextField } from "../../../../elements";
import UserImage from "../../../../../assets/images/user.png";
import {
  hideUnHideParticipantGuestMainApi,
  muteUnMuteParticipantMainApi,
  participantWaitingListBox,
  presenterLeaveParticipant,
  presenterNewParticipantJoin,
} from "../../../../../store/actions/VideoFeature_actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  admitRejectAttendeeMainApi,
  removeParticipantMeetingMainApi,
  transferMeetingHostMainApi,
} from "../../../../../store/actions/Guest_Video";
import Menu from "./../../talk-Video/video-images/Menu.png";
import GoldenHandRaised from "./../../talk-Video/video-images/GoldenHandRaised.png";
import MenuRaiseHand from "./../../talk-Video/video-images/Menu-RaiseHand.png";
import VideoDisable from "./../../talk-Video/video-images/Video Disabled Purple.svg";
import VideoOn from "./../../talk-Video/video-images/Video Enabled Purple.svg";
import MicDisabled from "../../talk-Video/video-images/MicOffDisabled.png";
import MicOnEnabled from "../../talk-Video/video-images/MicOnEnabled.png";
import { js2xml } from "xml-js";

const VideoNewParticipantList = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  let roomID = localStorage.getItem("newRoomId");

  let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));

  let meetinHostInfo = JSON.parse(localStorage.getItem("meetinHostInfo"));

  let HostName = localStorage.getItem("name");
  let PresenterHostuserID = Number(localStorage.getItem("userID"));

  const participantWaitingList = useSelector(
    (state) => state.videoFeatureReducer.participantWaitingList
  );

  const getAllParticipantMain = useSelector(
    (state) => state.videoFeatureReducer.getAllParticipantMain
  );

  console.log(getAllParticipantMain.length, "getAllParticipantMain");

  const waitingParticipants = useSelector(
    (state) => state.videoFeatureReducer.waitingParticipantsList
  );

  const NormalizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalizeVideoFlag
  );

  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag
  );
  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag
  );

  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag
  );

  const newJoinPresenterParticipant = useSelector(
    (state) => state.videoFeatureReducer.newJoinPresenterParticipant
  );
  const leavePresenterParticipant = useSelector(
    (state) => state.videoFeatureReducer.leavePresenterParticipant
  );

  console.log(newJoinPresenterParticipant, "newJoinPresenterParticipant");

  console.log(
    { presenterViewHostFlag, presenterViewFlag },
    "presenterViewFlagpresenterViewFlag"
  );

  // For acccept Join name participantList
  // const getNewParticipantsMeetingJoin = useSelector(
  //   (state) => state.videoFeatureReducer.getNewParticipantsMeetingJoin
  // );

  const [filteredParticipants, setFilteredParticipants] = useState([]);
  console.log(filteredParticipants, "filteredParticipants");

  const [filteredWaitingParticipants, setFilteredWaitingParticipants] =
    useState([]);

  console.log(filteredWaitingParticipants, "filteredWaitingParticipants");

  const [searchValue, setSearchValue] = useState("");

  const [isForAll, setIsForAll] = useState(false);

  const handleChangeSearchParticipant = (e) => {
    const { value } = e.target;
    setSearchValue(value);

    // Filter participants based on the search value
    const filtered = getAllParticipantMain.filter((participant) =>
      participant.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredParticipants(filtered);
  };

  // useEffect(() => {
  //   console.log("hell");
  //   let Data = {
  //     RoomID: String(getRoomId),
  //   };
  //   dispatch(participantListWaitingListMainApi(Data, navigate, t));
  // }, []);

  // Update filteredParticipants based on participantList

  useEffect(() => {
    if (Object.keys(getAllParticipantMain).length) {
      console.log("hell");
      setFilteredParticipants(getAllParticipantMain);
    } else {
      setFilteredParticipants([]);
    }
  }, [getAllParticipantMain]);

  useEffect(() => {
    if (
      Object.keys(leavePresenterParticipant).length > 0 &&
      presenterViewFlag &&
      presenterViewHostFlag
    ) {
      // Remove the participant whose guid matches the uid
      const updatedParticipants = filteredParticipants.filter(
        (participant) => participant.guid !== leavePresenterParticipant.uid
      );
      // Update the state with the filtered list
      setFilteredParticipants(updatedParticipants);
      console.log("hell", leavePresenterParticipant);
      dispatch(presenterLeaveParticipant([]));
    }
  }, [leavePresenterParticipant]);

  useEffect(() => {
    if (
      Object.keys(newJoinPresenterParticipant).length > 0 &&
      presenterViewFlag &&
      presenterViewHostFlag
    ) {
      // Step 1: Remove any existing participant with the same userID or guid
      const updatedParticipants = filteredParticipants.filter(
        (participant) =>
          participant.userID !== newJoinPresenterParticipant.userID &&
          participant.guid !== newJoinPresenterParticipant.guid
      );

      // Step 2: Add the new participant
      updatedParticipants.push(newJoinPresenterParticipant);

      // Step 3: Update the state
      setFilteredParticipants(updatedParticipants);
      dispatch(presenterNewParticipantJoin([]));

      console.log(updatedParticipants);
    }
  }, [newJoinPresenterParticipant]);

  // Ensure it listens to participantList updates
  function isEveryoneUnmuted(participants) {
    return !participants.some(
      (participant) => !participant.isHost && participant.mute === true
    );
  }

  useEffect(() => {
    if (filteredParticipants?.length) {
      if (isEveryoneUnmuted(filteredParticipants)) {
        if (isForAll === true) {
          setIsForAll(false);
        }
      } else {
        if (isForAll === false) {
          setIsForAll(true);
        }
      }
    }
  }, [filteredParticipants]);

  // Update filteredWaitingParticipants based on waitingParticipants
  useEffect(() => {
    console.log("hell");
    if (waitingParticipants?.length) {
      console.log(waitingParticipants, "usersDatausersData");

      setFilteredWaitingParticipants(waitingParticipants);
    } else {
      setFilteredWaitingParticipants([]);
    }
  }, [waitingParticipants]);

  const makeHostOnClick = async (usersData) => {
    let newRoomId = localStorage.getItem("newRoomId");
    let data = {
      RoomID: String(newRoomId),
      UID: usersData.guid,
      UserID: usersData.userID,
      MeetingID: currentMeetingID,
    };
    dispatch(transferMeetingHostMainApi(navigate, t, data, 1));
  };

  const muteUnmuteByHost = (usersData, flag) => {
    if (usersData) {
      let roomID = localStorage.getItem("acceptedRoomID");
      let isMeetingVideoHostCheck = JSON.parse(
        localStorage.getItem("isMeetingVideoHostCheck")
      );
      let newRoomID = localStorage.getItem("newRoomId");
      let participantRoomId = localStorage.getItem("participantRoomId");
      let RoomID =
        presenterViewFlag && (presenterViewHostFlag || presenterViewJoinFlag)
          ? roomID
          : isMeetingVideoHostCheck
          ? newRoomID
          : participantRoomId;
      // Mute/Unmute a specific participant
      setFilteredParticipants((prev) =>
        prev.map((participant) =>
          participant.guid === usersData.guid
            ? { ...participant, mute: flag }
            : participant
        )
      );
      if (
        presenterViewFlag &&
        (presenterViewHostFlag || presenterViewJoinFlag)
      ) {
        // Exclude hosts from muting
        const data = {
          RoomID: RoomID,
          IsMuted: flag,
          isForAll: false,
          MuteUnMuteList: [
            {
              UID: usersData.guid, // The participant's UID
            },
          ],
          MeetingID: currentMeetingID,
        };
        dispatch(muteUnMuteParticipantMainApi(navigate, t, data));
      } else if (!usersData.isHost) {
        // Exclude hosts from muting
        const data = {
          RoomID: RoomID,
          IsMuted: flag,
          isForAll: false,
          MuteUnMuteList: [
            {
              UID: usersData.guid, // The participant's UID
            },
          ],
          MeetingID: currentMeetingID,
        };

        dispatch(muteUnMuteParticipantMainApi(navigate, t, data));
      }
    }
  };

  const muteUnmuteAllByHost = (flag) => {
    // Update the isForAll state
    let duplicatesData = [...filteredParticipants];
    // Exclude hosts from the mute/unmute list
    let allUids = [];
    let isHost = JSON.parse(localStorage.getItem("isHost"));
    let isGuid = localStorage.getItem("isGuid");
    let participantUID = localStorage.getItem("participantUID");
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );
    let newRoomID = localStorage.getItem("newRoomId");
    let participantRoomId = localStorage.getItem("participantRoomId");
    let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
    if (presenterViewFlag && presenterViewHostFlag) {
      let currentUserId = isHost ? isGuid : participantUID;
      allUids = duplicatesData
        .filter((participant) => participant.guid !== currentUserId) // Filter out hosts
        .map((participant) => ({
          UID: participant.guid,
        }));
    } else {
      allUids = duplicatesData
        .filter((participant) => !participant.isHost) // Filter out hosts
        .map((participant) => ({
          UID: participant.guid,
        }));
    }

    console.log(allUids, "allUids after excluding hosts");
    let RoomID = presenterViewFlag
      ? roomID
        ? roomID
        : callAcceptedRoomID
      : isMeetingVideoHostCheck
      ? newRoomID
      : participantRoomId;
    console.log(presenterViewFlag, "allUids after excluding hosts");
    console.log(roomID, "allUids after excluding hosts");
    console.log(callAcceptedRoomID, "allUids after excluding hosts");
    console.log(isMeetingVideoHostCheck, "allUids after excluding hosts");
    console.log(newRoomID, "allUids after excluding hosts");
    console.log(participantRoomId, "allUids after excluding hosts");
    const data = {
      RoomID: RoomID,
      IsMuted: !flag,
      isForAll: true, // Pass the current flag
      MuteUnMuteList: allUids,
      MeetingID: currentMeetingID,
    };
    dispatch(muteUnMuteParticipantMainApi(navigate, t, data));
  };

  const hideUnHideVideoParticipantByHost = (usersData, flag) => {
    let roomID = localStorage.getItem("acceptedRoomID");
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );
    let newRoomID = localStorage.getItem("newRoomId");
    let participantRoomId = localStorage.getItem("participantRoomId");
    let RoomID =
      presenterViewFlag && (presenterViewHostFlag || presenterViewJoinFlag)
        ? roomID
        : isMeetingVideoHostCheck
        ? newRoomID
        : participantRoomId;

    let data = {
      RoomID: RoomID,
      HideVideo: flag,
      UIDList: [usersData.guid],
      MeetingID: currentMeetingID,
    };

    // Update the specific participant's hideCamera state in `newParticipants`
    setFilteredParticipants((prev) =>
      prev.map((participant) =>
        participant.guid === usersData.guid
          ? { ...participant, hideCamera: flag }
          : participant
      )
    );

    dispatch(hideUnHideParticipantGuestMainApi(navigate, t, data));
  };

  const removeParticipantMeetingOnClick = (usersData) => {
    let data = {
      RoomID: String(roomID),
      UID: usersData.guid,
      Name: usersData.name,
      MeetingID: currentMeetingID,
    };

    setFilteredParticipants((prev) =>
      prev.filter((participant) => participant.guid !== usersData.guid)
    );

    dispatch(removeParticipantMeetingMainApi(navigate, t, data));
  };

  const handleClickAllAcceptAndReject = (flag) => {
    if (!presenterViewFlag) {
      let Data = {
        MeetingId: filteredWaitingParticipants[0]?.meetingID,
        RoomId: String(roomID),
        IsRequestAccepted: flag === 1 ? true : false,
        AttendeeResponseList: filteredWaitingParticipants.map(
          (participantData, index) => {
            return {
              IsGuest: participantData.isGuest,
              UID: participantData.guid,
              UserID: participantData.userID,
            };
          }
        ),
      };

      dispatch(
        admitRejectAttendeeMainApi(
          Data,
          navigate,
          t,
          true,
          filteredParticipants
        )
      );
    }
  };

  const handleClickAcceptAndReject = (participantInfo, flag) => {
    let Data = {
      MeetingId: currentMeetingID,
      RoomId: String(roomID),
      IsRequestAccepted: flag === 1 ? true : false,
      AttendeeResponseList: [
        {
          IsGuest: participantInfo.isGuest,
          UID: participantInfo.guid,
          UserID: participantInfo.userID,
        },
      ],
    };
    dispatch(
      admitRejectAttendeeMainApi(Data, navigate, t, false, filteredParticipants)
    );
  };

  return (
    <section
      className={
        presenterViewFlag
          ? styles["Waiting-New-Participant-List-For-Presenter"]
          : NormalizeVideoFlag
          ? styles["WaitingParticipantBoxNorm"]
          : filteredWaitingParticipants.length === 0
          ? styles["Waiting-New-Participant-List-when-no-participantwaiting"]
          : styles["Waiting-New-Participant-List"]
      }
    >
      <Row>
        <Col sm={12} md={12} lg={12} className="d-flex justify-content-between">
          <span className={styles["Waiting-New-Participant-List_box_title"]}>
            {t("People")}
          </span>
          <img
            draggable="false"
            src={CrossIcon}
            onClick={() => dispatch(participantWaitingListBox(false))}
            style={{ display: "block", objectFit: "cover", cursor: "pointer" }}
            alt=""
          />
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <TextField
            placeholder={"Search"}
            applyClass={"waitingParticipantsSearchField"}
            // className={styles["text-field-searchclass"]}
            change={handleChangeSearchParticipant}
            value={searchValue}
          />
        </Col>
      </Row>
      {/* Hosts Title Tab  */}
      <Col sm={12} md={12} lg={12}>
        <div className={styles["Waiting-New-Participant-hosttab"]}>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <p className={styles["Waiting-New-Participant-Hosts-Title"]}>
                {presenterViewFlag && presenterViewHostFlag
                  ? t("Presenter")
                  : t("Host")}
              </p>
            </Col>
          </Row>
        </div>
      </Col>

      {/* Host Name List */}
      <Col sm={12} md={12} lg={12}>
        <div className={styles["Waiting-New-Participant-HostNameList"]}>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <p className={styles["Waiting-New-Participant-HostsList-Name"]}>
                {HostName}
              </p>
            </Col>
          </Row>
        </div>
      </Col>

      {/* Participant Mute All */}
      <Col sm={12} md={12} lg={12}>
        <div className={styles["Waiting-New-Participant-hosttab"]}>
          <Row>
            <Col sm={6} md={6} lg={6} className="d-flex justify-content-start">
              <p className={styles["Waiting-New-Participant-Hosts-Title"]}>
                {t("Participants")}
              </p>
            </Col>
            <Col sm={6} md={6} lg={6} className="d-flex justify-content-end">
              {filteredParticipants.length > 1 && (
                <Button
                  text={isForAll ? t("Unmute-all") : t("Mute-all")}
                  className={styles["Waiting-New-Participant-muteAll"]}
                  onClick={() => muteUnmuteAllByHost(isForAll)}
                />
              )}
            </Col>
          </Row>
        </div>
      </Col>

      {/* Participants Name List */}
      <Col sm={12} md={12} lg={12}>
        <div
          className={
            filteredWaitingParticipants.length === 0
              ? styles["Waiting-New-ParticipantNameList-when-nowaiting-data"]
              : styles["Waiting-New-ParticipantNameList"]
          }
        >
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((usersData, index) => {
              console.log(usersData, "usersDatausersData");
              return (
                <>
                  <Row className="hostBorder m-0">
                    <Col
                      className="p-0 d-flex align-items-center"
                      lg={7}
                      md={7}
                      sm={12}
                    >
                      <p className="participant-name">{usersData?.name}</p>
                      {presenterViewFlag ? (
                        presenterViewHostFlag &&
                        PresenterHostuserID === usersData.userID ? (
                          <>
                            <p className={styles["Host-name"]}>
                              <span className={styles["Host-title-name"]}>
                                {t("(Presenter)")}
                              </span>
                            </p>
                          </>
                        ) : (
                          presenterViewJoinFlag === false &&
                          usersData.isHost && (
                            <>
                              <p className={styles["Host-name"]}>
                                <span className={styles["Host-title-name"]}>
                                  {t("(Host)")}
                                </span>
                              </p>
                            </>
                          )
                        )
                      ) : (
                        usersData.isHost && (
                          <>
                            <p className={styles["Host-name"]}>
                              <span className={styles["Host-title-name"]}>
                                {t("(Host)")}
                              </span>
                            </p>
                          </>
                        )
                      )}{" "}
                      {((presenterViewHostFlag && presenterViewFlag) ||
                        meetinHostInfo.isHost) &&
                      usersData.raiseHand ? (
                        <img
                          draggable="false"
                          src={GoldenHandRaised}
                          alt=""
                          width={"22px"}
                          height={"22px"}
                          className="handraised-participant"
                        />
                      ) : (
                        <img
                          draggable="false"
                          src={MenuRaiseHand}
                          alt=""
                          className="handraised-participant"
                        />
                      )}
                      {!presenterViewHostFlag &&
                      !presenterViewJoinFlag &&
                      usersData.isHost ? (
                        JSON.parse(localStorage.getItem("isWebCamEnabled")) ? (
                          <img
                            draggable="false"
                            src={VideoDisable}
                            width="18px"
                            height="18px"
                            alt="Video Disabled"
                            className="handraised-participant"
                          />
                        ) : (
                          <img
                            draggable="false"
                            src={VideoOn}
                            width="18px"
                            height="18px"
                            alt="Video On"
                            className="handraised-participant"
                          />
                        )
                      ) : usersData.hideCamera ? (
                        <img
                          draggable="false"
                          src={VideoDisable}
                          width="18px"
                          height="18px"
                          alt="Video Disabled"
                          className="handraised-participant"
                        />
                      ) : (
                        <img
                          draggable="false"
                          src={VideoOn}
                          width="18px"
                          height="18px"
                          alt="Video On"
                          className="handraised-participant"
                        />
                      )}
                    </Col>

                    <Col
                      className="
                        d-flex
                        justify-content-end
                        align-items-baseline
                        gap-2
                        p-0"
                      lg={5}
                      md={5}
                      sm={12}
                    >
                      {!presenterViewHostFlag &&
                      !presenterViewJoinFlag &&
                      usersData.isHost ? (
                        JSON.parse(localStorage.getItem("isMicEnabled")) ? (
                          <img
                            draggable="false"
                            src={MicDisabled}
                            width="19px"
                            height="19px"
                            alt="Microphone Disabled"
                          />
                        ) : (
                          <img
                            draggable="false"
                            src={MicOnEnabled}
                            width="15px"
                            height="19px"
                            alt="Microphone Enabled"
                          />
                        )
                      ) : usersData.mute ? (
                        <img
                          draggable="false"
                          src={MicDisabled}
                          width="19px"
                          height="19px"
                          alt="Microphone Disabled"
                        />
                      ) : (
                        <img
                          draggable="false"
                          src={MicOnEnabled}
                          width="15px"
                          height="19px"
                          alt="Microphone Enabled"
                        />
                      )}
                      {presenterViewFlag ? (
                        PresenterHostuserID !== usersData.userID ? (
                          <Dropdown>
                            <Dropdown.Toggle className="participant-toggle">
                              <img draggable="false" src={Menu} alt="" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {!presenterViewFlag && !presenterViewHostFlag && (
                                <>
                                  {usersData.isGuest === false ? (
                                    <Dropdown.Item
                                      className="participant-dropdown-item"
                                      onClick={() => makeHostOnClick(usersData)}
                                    >
                                      {t("Make-host")}
                                    </Dropdown.Item>
                                  ) : null}
                                </>
                              )}

                              {!presenterViewFlag && !presenterViewHostFlag && (
                                <>
                                  {usersData.isHost === false ? (
                                    <Dropdown.Item
                                      className="participant-dropdown-item"
                                      onClick={() =>
                                        removeParticipantMeetingOnClick(
                                          usersData
                                        )
                                      }
                                    >
                                      {t("Remove")}
                                    </Dropdown.Item>
                                  ) : null}
                                </>
                              )}
                              {usersData.mute === false ? (
                                <>
                                  <Dropdown.Item
                                    className="participant-dropdown-item"
                                    onClick={() =>
                                      muteUnmuteByHost(usersData, true)
                                    }
                                  >
                                    {t("Mute")}
                                  </Dropdown.Item>
                                </>
                              ) : (
                                <>
                                  <Dropdown.Item
                                    className="participant-dropdown-item"
                                    onClick={() =>
                                      muteUnmuteByHost(usersData, false)
                                    }
                                  >
                                    {t("UnMute")}
                                  </Dropdown.Item>
                                </>
                              )}
                              {usersData.hideCamera === false ? (
                                <>
                                  <Dropdown.Item
                                    className="participant-dropdown-item"
                                    onClick={() => {
                                      hideUnHideVideoParticipantByHost(
                                        usersData,
                                        true
                                      );
                                    }}
                                  >
                                    {t("Hide-video")}
                                  </Dropdown.Item>
                                </>
                              ) : (
                                <>
                                  <Dropdown.Item
                                    className="participant-dropdown-item"
                                    onClick={() => {
                                      hideUnHideVideoParticipantByHost(
                                        usersData,
                                        false
                                      );
                                    }}
                                  >
                                    {t("UnHide-video")}
                                  </Dropdown.Item>
                                </>
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        ) : null
                      ) : (
                        !usersData.isHost && (
                          <Dropdown>
                            <Dropdown.Toggle className="participant-toggle">
                              <img draggable="false" src={Menu} alt="" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {!presenterViewFlag && !presenterViewHostFlag && (
                                <>
                                  {usersData.isGuest === false ? (
                                    <Dropdown.Item
                                      className="participant-dropdown-item"
                                      onClick={() => makeHostOnClick(usersData)}
                                    >
                                      {t("Make-host")}
                                    </Dropdown.Item>
                                  ) : null}
                                </>
                              )}

                              {!presenterViewFlag && !presenterViewHostFlag && (
                                <>
                                  {usersData.isHost === false ? (
                                    <Dropdown.Item
                                      className="participant-dropdown-item"
                                      onClick={() =>
                                        removeParticipantMeetingOnClick(
                                          usersData
                                        )
                                      }
                                    >
                                      {t("Remove")}
                                    </Dropdown.Item>
                                  ) : null}
                                </>
                              )}
                              {usersData.mute === false ? (
                                <>
                                  <Dropdown.Item
                                    className="participant-dropdown-item"
                                    onClick={() =>
                                      muteUnmuteByHost(usersData, true)
                                    }
                                  >
                                    {t("Mute")}
                                  </Dropdown.Item>
                                </>
                              ) : (
                                <>
                                  <Dropdown.Item
                                    className="participant-dropdown-item"
                                    onClick={() =>
                                      muteUnmuteByHost(usersData, false)
                                    }
                                  >
                                    {t("UnMute")}
                                  </Dropdown.Item>
                                </>
                              )}
                              {usersData.hideCamera === false ? (
                                <>
                                  <Dropdown.Item
                                    className="participant-dropdown-item"
                                    onClick={() => {
                                      hideUnHideVideoParticipantByHost(
                                        usersData,
                                        true
                                      );
                                    }}
                                  >
                                    {t("Hide-video")}
                                  </Dropdown.Item>
                                </>
                              ) : (
                                <>
                                  <Dropdown.Item
                                    className="participant-dropdown-item"
                                    onClick={() => {
                                      hideUnHideVideoParticipantByHost(
                                        usersData,
                                        false
                                      );
                                    }}
                                  >
                                    {t("UnHide-video")}
                                  </Dropdown.Item>
                                </>
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        )
                      )}
                    </Col>
                  </Row>
                </>
              );
            })
          ) : (
            <>
              <Row>
                <Col className="d-flex justify-content-center align-item-center">
                  <p>{t("No-participant")}</p>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Col>

      {!presenterViewFlag && !presenterViewHostFlag ? (
        <>
          {filteredWaitingParticipants.length > 0 && (
            <>
              {/* Waiting For Entry Title Tab  */}
              <Col sm={12} md={12} lg={12}>
                <div className={styles["Waiting-New-Participant-hosttab"]}>
                  <Row>
                    <Col sm={12} md={12} lg={12}>
                      <p
                        className={
                          styles["Waiting-New-Participant-Hosts-Title"]
                        }
                      >
                        {t("Waiting-for-entry")}
                      </p>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col sm={12} md={12} lg={12}>
                <div
                  className={
                    NormalizeVideoFlag
                      ? styles["AcceptAndDeniedManual_Nor"]
                      : styles["AcceptAndDeniedManual"]
                  }
                >
                  {filteredWaitingParticipants.length > 0 && (
                    <>
                      <Row className="mb-3">
                        <Col sm={6} md={6} lg={6}>
                          <Button
                            className={
                              styles["Waiting-New-Participant-denyAllBtn"]
                            }
                            text={t("Deny-all")}
                            onClick={() => handleClickAllAcceptAndReject(2)}
                          />
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                          <Button
                            className={
                              styles["Waiting-New-Participant-AcceptAllBtn"]
                            }
                            text={t("Allow-all")}
                            onClick={() => handleClickAllAcceptAndReject(1)}
                          />
                        </Col>
                      </Row>

                      {filteredWaitingParticipants.map((data, index) => (
                        <Row className="mb-2" key={data.guid}>
                          <Col
                            sm={5}
                            md={5}
                            lg={5}
                            className="d-flex align-items-center gap-2"
                          >
                            <img
                              draggable="false"
                              src={UserImage}
                              className={styles["participantImage"]}
                              alt=""
                            />
                            <span className={styles["participant_name"]}>
                              {data.name}
                            </span>
                          </Col>
                          <Col
                            sm={7}
                            md={7}
                            lg={7}
                            className="d-flex align-items-center gap-2"
                          >
                            <Button
                              className={
                                styles[
                                  "Waiting-New-Participant-denyAllBtn-small"
                                ]
                              }
                              text={t("Deny")}
                              onClick={() =>
                                handleClickAcceptAndReject(data, 2)
                              }
                            />
                            <Button
                              className={
                                styles[
                                  "Waiting-New-Participant-AcceptAllBtn-small"
                                ]
                              }
                              text={t("Allow")}
                              onClick={() =>
                                handleClickAcceptAndReject(data, 1)
                              }
                            />
                          </Col>
                        </Row>
                      ))}
                    </>
                  )}
                </div>
              </Col>
            </>
          )}
        </>
      ) : null}
    </section>
  );
};

export default VideoNewParticipantList;
