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
  participantListWaitingListMainApi,
  participantWaitingListBox,
} from "../../../../../store/actions/VideoFeature_actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  admitRejectAttendeeMainApi,
  removeParticipantFromVideo,
  removeParticipantMeetingMainApi,
  transferMeetingHostMainApi,
} from "../../../../../store/actions/Guest_Video";
import RaiseHand from "./../../talk-Video/video-images/Raise Hand Purple.svg";
import MicOn from "./../../talk-Video/video-images/Mic Enabled Purple.svg";
import Menu from "./../../talk-Video/video-images/Menu.png";
import GoldenHandRaised from "./../../talk-Video/video-images/GoldenHandRaised.png";
import MenuRaiseHand from "./../../talk-Video/video-images/Menu-RaiseHand.png";
import VideoDisable from "./../../talk-Video/video-images/Video Disabled Purple.svg";
import VideoOn from "./../../talk-Video/video-images/Video Enabled Purple.svg";
import MicDisabled from "../../talk-Video/video-images/MicOffDisabled.png";
import MicOnEnabled from "../../talk-Video/video-images/MicOnEnabled.png";
import { getVideoCallParticipantsGuestMainApi } from "../../../../../store/actions/Guest_Video";

const VideoNewParticipantList = () => {
  console.log("VideoNewParticipantList");

  const { videoFeatureReducer } = useSelector((state) => state);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const participantWaitingList = useSelector(
    (state) => state.videoFeatureReducer.participantWaitingList
  );

  console.log(participantWaitingList, "participantWaitingList");

  const participantList = useSelector(
    (state) => state.videoFeatureReducer.getVideoParticpantListandWaitingList
  );
  console.log(participantList, "participantListMainReducer");

  const waitingParticipants = useSelector(
    (state) => state.videoFeatureReducer.waitingParticipantsList
  );

  console.log(waitingParticipants, "waitingParticipants");

  let getRoomId = localStorage.getItem("newRoomId");

  // For acccept Join name participantList
  // const getNewParticipantsMeetingJoin = useSelector(
  //   (state) => state.videoFeatureReducer.getNewParticipantsMeetingJoin
  // );

  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [filteredWaitingParticipants, setFilteredWaitingParticipants] =
    useState([]);

  const [newParticipants, setNewParticipants] = useState([]);

  const [participantsList, setPartcipantList] = useState([]);
  console.log(filteredParticipants, "filteredParticipants");
  console.log(filteredWaitingParticipants, "filteredWaitingParticipants");
  let roomID = localStorage.getItem("newRoomId");
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));

  let HostName = localStorage.getItem("name");

  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [participantData, setParticipantData] = useState([]);
  const [muteGuest, setMuteGuest] = useState(false);
  const [isForAll, setIsForAll] = useState(false);
  console.log(isForAll, "isForAllisForAll");

  const handleChangeSearchParticipant = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  useEffect(() => {
    let Data = {
      RoomID: String(getRoomId),
    };
    dispatch(participantListWaitingListMainApi(Data, navigate, t));
  }, []);

  // Update filteredParticipants based on participantList
  useEffect(() => {
    if (participantList?.length) {
      const uniqueParticipants = participantList.filter(
        (participant, index, self) =>
          participant.userID === 0
            ? self.findIndex((p) => p.guid === participant.guid) === index
            : self.findIndex((p) => p.userID === participant.userID) === index
      );

      setFilteredParticipants(uniqueParticipants);
    } else {
      setFilteredParticipants([]);
    }
  }, [participantList]); // Ensure it listens to participantList updates

  // Update filteredWaitingParticipants based on waitingParticipants
  useEffect(() => {
    if (waitingParticipants?.length) {
      console.log(waitingParticipants, "usersDatausersData");

      setFilteredWaitingParticipants(waitingParticipants);
    } else {
      setFilteredWaitingParticipants([]);
    }
  }, [waitingParticipants]);

  const makeLeaveOnClick = (usersData) => {
    console.log(usersData.UID, "usersDatausersData");
    let data = {
      RoomID: roomID,
      UID: usersData.guid,
      UserID: usersData.userID,
    };

    dispatch(transferMeetingHostMainApi(navigate, t, data));
  };

  const muteUnmuteByHost = (usersData, flag = true) => {
    setMuteGuest(flag);

    if (usersData) {
      // Mute/Unmute a specific participant
      const data = {
        RoomID: roomID,
        IsMuted: flag,
        MuteUnMuteList: [
          {
            UID: usersData.guid, // The participant's UID
          },
        ],
      };
      dispatch(muteUnMuteParticipantMainApi(navigate, t, data));
    } else {
      // Toggle mute/unmute for all participants
      setIsForAll(flag); // Update the isForAll state
      const allUids = filteredParticipants.map((participant) => ({
        UID: participant.guid,
      }));
      console.log(allUids, "allUidsallUids");

      const data = {
        RoomID: roomID,
        IsMuted: flag,
        isForAll: flag, // Pass the current flag
        MuteUnMuteList: allUids,
      };
      dispatch(muteUnMuteParticipantMainApi(navigate, t, data));
    }
  };

  const hideUnHideVideoParticipantByHost = (usersData, flag) => {
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

  const removeParticipantMeetingOnClick = (usersData) => {
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
    let Data = {
      MeetingId: filteredWaitingParticipants[0]?.meetingID,
      RoomId: String(roomID),
      IsRequestAccepted: flag === 1 ? true : false,
      AttendeeResponseList: filteredWaitingParticipants.map(
        (participantData, index) => {
          console.log(participantData, "mahdahahshahs");
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
    console.log(participantInfo, "participantInfo");
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
        videoFeatureReducer.NormalizeVideoFlag
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
            src={CrossIcon}
            onClick={() => dispatch(participantWaitingListBox(false))}
            style={{ display: "block", objectFit: "cover" }}
          />
        </Col>
        <Col sm={12} md={12} lg={12}>
          <TextField
            placeholder={"Search"}
            // applyClass={"waitingParticipantsSearchField"}
            className={styles["text-field-searchclass"]}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => console.log("Focused!")}
            // change={handleChangeSearchParticipant}
            // value={searchValue}
          />
        </Col>

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
              <Col
                sm={6}
                md={6}
                lg={6}
                className="d-flex justify-content-start"
              >
                <p className={styles["Waiting-New-Participant-Hosts-Title"]}>
                  {t("Participants")}
                </p>
              </Col>
              <Col sm={6} md={6} lg={6} className="d-flex justify-content-end">
                <Button
                  text={isForAll ? t("Unmute-All") : t("Mute-All")}
                  className={styles["Waiting-New-Participant-muteAll"]}
                  onClick={() => muteUnmuteByHost(null, !isForAll)}
                />
              </Col>
            </Row>
          </div>
        </Col>

        {/* Participants Name List */}

        <Col sm={12} md={12} lg={12}>
          <div className={styles["Waiting-New-ParticipantNameList"]}>
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
                        {usersData.isHost ? (
                          <>
                            <p className={styles["Host-name"]}>(Host)</p>
                          </>
                        ) : null}
                        {usersData.raiseHand === true ? (
                          <>
                            <img
                              src={GoldenHandRaised}
                              alt=""
                              width={"22px"}
                              height={"22px"}
                              className="handraised-participant"
                            />
                          </>
                        ) : (
                          <img
                            src={MenuRaiseHand}
                            alt=""
                            className="handraised-participant"
                          />
                        )}
                        {usersData.hideCamera ? (
                          <img
                            src={VideoDisable}
                            width="18px"
                            height="18px"
                            alt=""
                            className="handraised-participant"
                          />
                        ) : (
                          <img
                            src={VideoOn}
                            width="18px"
                            height="18px"
                            alt=""
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
                        {usersData.mute ? (
                          <img
                            src={MicDisabled}
                            width={"22px"}
                            height={"22px"}
                          />
                        ) : (
                          <img src={MicOnEnabled} />
                        )}

                        <Dropdown>
                          <Dropdown.Toggle className="participant-toggle">
                            <img src={Menu} alt="" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              className="participant-dropdown-item"
                              onClick={() => makeLeaveOnClick(usersData)}
                            >
                              {t("Make-host")}
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="participant-dropdown-item"
                              onClick={() =>
                                removeParticipantMeetingOnClick(usersData)
                              }
                            >
                              {t("Remove")}
                            </Dropdown.Item>
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
              videoFeatureReducer.NormalizeVideoFlag
                ? styles["AcceptAndDeniedManual_Nor"]
                : styles["AcceptAndDeniedManual"]
            }
          >
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
                  className={styles["Waiting-New-Participant-AcceptAllBtn"]}
                  text={t("Allow-all")}
                  onClick={() => handleClickAllAcceptAndReject(1)}
                />
              </Col>
            </Row>
            {filteredWaitingParticipants.length > 0 &&
              filteredWaitingParticipants.map((data, index) => {
                console.log(data, "filteredWaitingParticipants");
                return (
                  <Row className="mb-2" key={data.guid}>
                    <Col
                      sm={5}
                      md={5}
                      lg={5}
                      className="d-flex align-items-center gap-2"
                    >
                      <img
                        src={UserImage}
                        className={styles["participantImage"]}
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
                );
              })}
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default VideoNewParticipantList;
