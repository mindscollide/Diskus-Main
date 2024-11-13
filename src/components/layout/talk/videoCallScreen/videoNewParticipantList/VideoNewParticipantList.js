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
  removeParticipantFromVideo,
  removeParticipantMeetingMainApi,
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

const VideoNewParticipantList = () => {
  const { videoFeatureReducer } = useSelector((state) => state);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const participantAcceptedName = useSelector(
    (state) => state.videoFeatureReducer.participantNameDataAccept
  );
  const [participantsList, setPartcipantList] = useState([]);
  console.log(participantsList, "participantsListData");
  let roomID = localStorage.getItem("activeRoomID");
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [participantData, setParticipantData] = useState([]);
  const [muteGuest, setMuteGuest] = useState(false);

  const handleChangeSearchParticipant = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  useEffect(() => {
    if (videoFeatureReducer.participantWaitingList.length > 0) {
      try {
        setPartcipantList(videoFeatureReducer.participantWaitingList);
      } catch (error) {
        console.log(error, "errorerror");
      }
    } else {
      setPartcipantList([]);
    }
  }, [videoFeatureReducer.participantWaitingList]);

  useEffect(() => {
    if (
      participantAcceptedName !== null &&
      participantAcceptedName !== undefined &&
      participantAcceptedName.length > 0
    ) {
      // Filter out duplicates based on UID
      const uniqueParticipants = participantAcceptedName.reduce(
        (acc, current) => {
          console.log(acc, "datadatdtad");
          // Only add the current participant if its UID is not already in acc
          if (!acc.find((participant) => participant.UID === current.UID)) {
            acc.push(current);
          }
          return acc;
        },
        []
      );

      setParticipantData(uniqueParticipants);
      console.log(uniqueParticipants, "uniqueParticipants");
    } else {
      setParticipantData([]);
    }
  }, [participantAcceptedName]);

  const muteUnmuteByHost = (usersData, flag) => {
    setMuteGuest(flag);
    let data = {
      RoomID: roomID,
      IsMuted: flag,
      MuteUnMuteList: [
        {
          UID: usersData.UID, // The participant's UID
        },
      ],
    };
    dispatch(
      muteUnMuteParticipantMainApi(navigate, t, data, setParticipantData, flag)
    );
  };

  const hideUnHideVideoParticipantByHost = (usersData, flag) => {
    let data = {
      RoomID: roomID,
      HideVideo: flag,
      UIDList: [usersData.UID],
    };
    dispatch(
      hideUnHideParticipantGuestMainApi(
        navigate,
        t,
        data,
        setParticipantData,
        flag
      )
    );
  };

  const removeParticipantMeetingOnClick = (usersData) => {
    console.log(usersData, "usersData");
    dispatch(removeParticipantFromVideo(usersData.UID));
    let data = {
      RoomID: roomID,
      UID: usersData.UID,
      Name: usersData.Name,
    };

    dispatch(removeParticipantMeetingMainApi(navigate, t, data));
  };

  const handleClickAllAcceptAndReject = (flag) => {
    let Data = {
      MeetingId: participantsList[0].meetingID,
      RoomId: String(roomID),
      AttendeeResponseList: participantsList.map((participantData, index) => {
        return {
          Name: participantData.name,
          UID: participantData.guid,
          Email: participantData.email,
          raiseHand: participantData.raiseHand,
          UserID: participantData.userID,
          IsMuted: participantData.mute,
          HideVideo: participantData.hideCamera,
          IsRequestAccepted: flag === 1 ? true : false,
          IsGuest: participantData.isGuest,
        };
      }),
    };

    dispatch(
      admitRejectAttendeeMainApi(Data, navigate, t, true, participantsList)
    );
  };
  const handleClickAcceptAndReject = (participantInfo, flag) => {
    console.log(participantInfo, "participantInfo");
    let Data = {
      MeetingId: participantInfo.meetingID,
      RoomId: String(roomID),
      AttendeeResponseList: [
        {
          Name: participantInfo.name,
          UID: participantInfo.guid,
          Email: participantInfo.email,
          raiseHand: participantInfo.raiseHand,
          UserID: participantInfo.userID,
          IsMuted: participantInfo.mute,
          HideVideo: participantInfo.hideCamera,
          IsRequestAccepted: flag === 1 ? true : false,
          IsGuest: participantInfo.isGuest,
        },
      ],
    };
    dispatch(
      admitRejectAttendeeMainApi(Data, navigate, t, false, participantsList)
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
        <Col
          sm={12}
          md={12}
          lg={12}
          className="d-flex justify-content-between "
        >
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
            applyClass={"waitingParticipantsSearchField"}
            change={handleChangeSearchParticipant}
            value={searchValue}
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
                  {t("Abdulla Siddique")}
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
                  text={t("Mute-All")}
                  className={styles["Waiting-New-Participant-muteAll"]}
                />
              </Col>
            </Row>
          </div>
        </Col>

        {/* Participants Name List */}

        <Col sm={12} md={12} lg={12}>
          <div className={styles["Waiting-New-ParticipantNameList"]}>
            {participantData.length > 0 ? (
              participantData.map((usersData, index) => {
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
                        <p className="participant-name">{usersData.Name}</p>
                        {usersData.isHandRaise === true ? (
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
                        {usersData.hideVideo ? (
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
                        {usersData.isMute ? (
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
                              //   onClick={() => makeLeaveOnClick(usersData)}
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
                            {usersData.isMute === false ? (
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
                            {usersData.hideVideo === false ? (
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

        {/* <Col sm={12} md={12} lg={12}>
          <div className={styles["Waiting-New-Participant-HostNameList"]}>
            <Row>
              <Col sm={4} md={4} lg={4}>
                <p className={styles["New-ParticipantList-Name"]}>
                  {t("Saif Islam")}
                </p>
              </Col>
              <Col sm={1} md={1} lg={1}>
                <p className={styles["Waiting-New-Participant-HostsList-Name"]}>
                  <img src={RaiseHand} alt="" height="20px" width="20px" />
                </p>
              </Col>
              <Col sm={3} md={3} lg={3} />
              <Col sm={2} md={2} lg={2}>
                <img src={MicOn} alt="" height="20px" width="20px" />
              </Col>
              <Col sm={1} md={1} lg={1}>
                <img src={Menu} alt="" />
              </Col>
            </Row>
            <Row>
              <Col sm={4} md={4} lg={4}>
                <p className={styles["New-ParticipantList-Name"]}>
                  {t("Saad Fuda")}
                </p>
              </Col>
              <Col sm={1} md={1} lg={1}>
                <p className={styles["Waiting-New-Participant-HostsList-Name"]}>
                  <img src={RaiseHand} alt="" height="20px" width="20px" />
                </p>
              </Col>
              <Col sm={3} md={3} lg={3} />
              <Col sm={2} md={2} lg={2}>
                <img src={MicOn} alt="" height="20px" width="20px" />
              </Col>
              <Col sm={1} md={1} lg={1}>
                <img src={Menu} alt="" />
              </Col>
            </Row>
            <Row>
              <Col sm={4} md={4} lg={4}>
                <p className={styles["New-ParticipantList-Name"]}>
                  {t("Ali Mamdani")}
                </p>
              </Col>
              <Col sm={1} md={1} lg={1}>
                <p className={styles["Waiting-New-Participant-HostsList-Name"]}>
                  <img src={RaiseHand} alt="" height="20px" width="20px" />
                </p>
              </Col>
              <Col sm={3} md={3} lg={3} />
              <Col sm={2} md={2} lg={2}>
                <img src={MicOn} alt="" height="20px" width="20px" />
              </Col>
              <Col sm={1} md={1} lg={1}>
                <img src={Menu} alt="" />
              </Col>
            </Row>
          </div>
        </Col> */}

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
            {participantsList?.length > 0 &&
              participantsList.map((data, index) => {
                return (
                  <Row className="mb-2" key={data.uid}>
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
