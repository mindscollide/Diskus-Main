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

const VideoNewParticipantList = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  let roomID = localStorage.getItem("newRoomId");

  let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));

  let HostName = localStorage.getItem("name");
  const participantWaitingList = useSelector(
    (state) => state.videoFeatureReducer.participantWaitingList
  );

  const participantList = useSelector(
    (state) => state.videoFeatureReducer.getVideoParticpantListandWaitingList
  );

  const waitingParticipants = useSelector(
    (state) => state.videoFeatureReducer.waitingParticipantsList
  );

  const NormalizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalizeVideoFlag
  );

  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag
  );

  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag
  );

  const newJoinPresenterParticipant = useSelector(
    (state) => state.videoFeatureReducer.newJoinPresenterParticipant
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

  const [filteredWaitingParticipants, setFilteredWaitingParticipants] =
    useState([]);

  const [searchValue, setSearchValue] = useState("");

  const [isForAll, setIsForAll] = useState(false);

  const handleChangeSearchParticipant = (e) => {
    const { value } = e.target;
    setSearchValue(value);

    // Filter participants based on the search value
    const filtered = participantList.filter((participant) =>
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
    console.log("hell");
    if (participantList?.length) {
      const uniqueParticipants = participantList.filter(
        (participant, index, self) =>
          participant.userID === 0
            ? self.findIndex((p) => p.guid === participant.guid) === index
            : self.findIndex((p) => p.userID === participant.userID) === index
      );

      setFilteredParticipants(uniqueParticipants);
      console.log(uniqueParticipants, "participantListMainReducer");
    } else {
      setFilteredParticipants([]);
      console.log("participantListMainReducer");
    }
  }, [participantList]);
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

  useEffect(() => {
    console.log("Updated Participants List:", newJoinPresenterParticipant);
  }, [newJoinPresenterParticipant]);

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
    console.log("makeHostOnClick", usersData);

    let newRoomId = localStorage.getItem("newRoomId");
    let data = {
      RoomID: String(newRoomId),
      UID: usersData.guid,
      UserID: usersData.userID,
    };
    dispatch(transferMeetingHostMainApi(navigate, t, data, 1));
  };

  const muteUnmuteByHost = (usersData, flag) => {
    console.log(usersData, "usersData");
    console.log(flag, "usersData");
    if (usersData) {
      // Mute/Unmute a specific participant
      if (!usersData.isHost) {
        // Exclude hosts from muting
        const data = {
          RoomID: roomID,
          IsMuted: flag,
          isForAll: false,
          MuteUnMuteList: [
            {
              UID: usersData.guid, // The participant's UID
            },
          ],
        };
        dispatch(muteUnMuteParticipantMainApi(navigate, t, data));
      } else {
        console.log("Cannot mute/unmute host.");
      }
    }
  };

  const muteUnmuteAllByHost = (flag) => {
    // Update the isForAll state
    let duplicatesData = [...filteredParticipants];
    // Exclude hosts from the mute/unmute list
    const allUids = duplicatesData
      .filter((participant) => !participant.isHost) // Filter out hosts
      .map((participant) => ({
        UID: participant.guid,
      }));

    console.log(allUids, "allUids after excluding hosts");

    const data = {
      RoomID: roomID,
      IsMuted: !flag,
      isForAll: true, // Pass the current flag
      MuteUnMuteList: allUids,
    };
    dispatch(muteUnMuteParticipantMainApi(navigate, t, data));
  };

  const hideUnHideVideoParticipantByHost = (usersData, flag) => {
    console.log("hell");
    console.log(usersData, "akasdaskhdvasdv");

    let data = {
      RoomID: roomID,
      HideVideo: flag,
      UIDList: [usersData.guid],
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
  console.log("filteredParticipants", filteredParticipants);

  const removeParticipantMeetingOnClick = (usersData) => {
    console.log("hell");
    console.log(usersData, "RemoveUserDataa");
    let data = {
      RoomID: String(roomID),
      UID: usersData.guid,
      Name: usersData.name,
    };

    setFilteredParticipants((prev) =>
      prev.filter((participant) => participant.guid !== usersData.guid)
    );

    dispatch(removeParticipantMeetingMainApi(navigate, t, data));
  };

  const handleClickAllAcceptAndReject = (flag) => {
    console.log("hell");
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
      admitRejectAttendeeMainApi(Data, navigate, t, true, filteredParticipants)
    );
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

  const participantsToDisplay =
    presenterViewFlag && presenterViewHostFlag
      ? newJoinPresenterParticipant
      : filteredParticipants;

  console.log(
    participantsToDisplay,
    "participantsToDisplayparticipantsToDisplay"
  );

  return (
    <section
      className={
        presenterViewFlag
          ? styles["Waiting-New-Participant-List-For-Presenter"]
          : NormalizeVideoFlag
          ? styles["WaitingParticipantBoxNorm"]
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
                {t("Hosts")}
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
        <div className={styles["Waiting-New-ParticipantNameList"]}>
          {participantsToDisplay.length > 0 ? (
            participantsToDisplay.map((usersData, index) => {
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
                      {usersData.isHost ? (
                        <>
                          <p className={styles["Host-name"]}>
                            <span className={styles["Host-title-name"]}>
                              {t("(Host)")}
                            </span>
                          </p>
                        </>
                      ) : null}
                      {usersData.raiseHand === true ? (
                        <>
                          <img
                            draggable="false"
                            src={GoldenHandRaised}
                            alt=""
                            width={"22px"}
                            height={"22px"}
                            className="handraised-participant"
                          />
                        </>
                      ) : (
                        <img
                          draggable="false"
                          src={MenuRaiseHand}
                          alt=""
                          className="handraised-participant"
                        />
                      )}
                      {usersData.isHost ? (
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
                      {usersData.isHost ? (
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
                      {!usersData.isHost && (
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
                                      removeParticipantMeetingOnClick(usersData)
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
          {/* Waiting For Entry Title Tab  */}
          <Col sm={12} md={12} lg={12}>
            <div className={styles["Waiting-New-Participant-hosttab"]}>
              <Row>
                <Col sm={12} md={12} lg={12}>
                  <p className={styles["Waiting-New-Participant-Hosts-Title"]}>
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
                        className={styles["Waiting-New-Participant-denyAllBtn"]}
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
                            styles["Waiting-New-Participant-denyAllBtn-small"]
                          }
                          text={t("Deny")}
                          onClick={() => handleClickAcceptAndReject(data, 2)}
                        />
                        <Button
                          className={
                            styles["Waiting-New-Participant-AcceptAllBtn-small"]
                          }
                          text={t("Allow")}
                          onClick={() => handleClickAcceptAndReject(data, 1)}
                        />
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </div>
          </Col>
        </>
      ) : null}
    </section>
  );
};

export default VideoNewParticipantList;
