import React, { useState, useEffect } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import "./TalkVideo.css";
import { Triangle } from "react-bootstrap-icons";
import { allAssignessList } from "../../../../store/actions/Get_List_Of_Assignees";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container, Form } from "react-bootstrap";
import { Select, Checkbox } from "antd";
import VideoCallScreen from "../videoCallScreen/VideoCallScreen-2";
import {
  DateDisplayFormat,
  DateSendingFormat,
} from "../../../../commen/functions/date_formater";
import {
  TextField,
  ChatModal,
  InputDatePicker,
  Button,
} from "../../../elements";
import CustomUploadChat from "../../../elements/chat_upload/Chat-Upload";
import SearchIcon from "../../../../assets/images/Search-Icon.png";
import MissedCallIcon from "../../../../assets/images/newElements/MissedCallIcon.png";
import SecurityIcon from "../../../../assets/images/Security-Icon.png";
import FullScreenIcon from "../../../../assets/images/Fullscreen-Icon.png";
import DoubleTickIcon from "../../../../assets/images/DoubleTick-Icon.png";
import CrossIcon from "../../../../assets/images/Cross-Icon.png";
import SecurityIconMessasgeBox from "../../../../assets/images/SecurityIcon-MessasgeBox.png";
import MenuIcon from "../../../../assets/images/Menu-Chat-Icon.png";
import VideoCallIcon from "../../../../assets/images/VideoCall-Icon.png";
import CloseChatIcon from "../../../../assets/images/Cross-Chat-Icon.png";
import SearchChatIcon from "../../../../assets/images/Search-Chat-Icon.png";
import AddChatIcon from "../../../../assets/images/Add-Plus-Icon.png";
import EmojiIcon from "../../../../assets/images/Emoji-Select-Icon.png";
import DeleteUploadIcon from "../../../../assets/images/Delete-Upload-Icon.png";
import ChatSendIcon from "../../../../assets/images/Chat-Send-Icon.png";
import DocumentIcon from "../../../../assets/images/Document-Icon.png";
import { useTranslation } from "react-i18next";
import {
  setOpenVideoCallBox,
  setMaximizeVideoCallBox,
  setMinimizeVideoCallBox,
  setGroupVideoPanel,
} from "../../../../store/actions/VideoCalling_actions";
import { useNavigate } from "react-router-dom";

const TalkVideo = () => {
  //Current User ID
  let createrID = localStorage.getItem("userID");

  const { t } = useTranslation();

  //Current language
  let lang = localStorage.getItem("i18nextLng");

  // Using dispatch To Call APIs
  const dispatch = useDispatch();

  const navigate = useNavigate();

  //Getting api result from the reducer
  const { assignees } = useSelector((state) => state);

  //Opening Chat States
  const [activeChat, setActiveChat] = useState([]);

  const [chatOpen, setChatOpen] = useState(false);

  //For Opening videoScreen
  const [openVideoScreen, setOpenVideoScreen] = useState(false);

  const onClickOpenScreen = () => {
    // setOpenVideoScreen(true);
    // OpenVideoCallBox(true);
  };
  //search chat states
  const [searchChatValue, setSearchChatValue] = useState("");
  const [allChatData, setAllChatData] = useState(assignees.user);

  //Opening Encryption Message
  const [openEncryptionDialogue, setOpenEncryptionDialogue] = useState(false);

  //Chat Filter State
  const [chatFilter, setChatFilter] = useState({
    value: "",
    label: "",
  });

  //File Upload
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });

  //Show Emoji or Not
  const [emojiActive, setEmojiActive] = useState(false);

  //input field of chat states
  const [input, setInput] = useState("");

  //Add Icon States
  const [addNewChat, setAddNewChat] = useState(false);

  //Global Search Filter
  const [globalSearchFilter, setGlobalSearchFilter] = useState(false);

  // Chat Filter Options
  const chatFilterOptions = [
    { className: "talk-chat-filter", label: "Contact", value: 1 },
    { className: "talk-chat-filter", label: "Recent", value: 2 },
  ];

  //Storing all users in a variable
  const allUsersList = assignees.user;
  const [endDatedisable, setEndDatedisable] = useState(true);
  const [chatDateState, setChatDateState] = useState({
    StartDate: "",
    EndDate: "",
  });
  //3 Menus of the state
  const [save, setSave] = useState(false);
  const [print, setPrint] = useState(false);
  const [email, setEmail] = useState(false);
  //Popup Options
  const [todayCheckState, setTodayCheckState] = useState(false);
  const [allCheckState, setAllCheckState] = useState(false);
  const [customCheckState, setCustomCheckState] = useState(false);

  const [isButtonClick, setIsButtonClick] = useState([]);

  const onClickGroupBtnHandler = () => {
    setIsButtonClick(true);
  };

  //Clicking on Security Icon
  const securityDialogue = () => {
    setOpenEncryptionDialogue(true);
  };

  //Clicking on Close Security Icon
  const closeSecurityDialogue = () => {
    setOpenEncryptionDialogue(false);
  };

  //Calling API
  useEffect(() => {
    dispatch(allAssignessList(navigate, t,false));
  }, []);

  //Emoji on click function
  const emojiClick = () => {
    if (emojiActive === false) {
      setEmojiActive(true);
    } else {
      setEmojiActive(false);
    }
  };

  //Response return on click of emoji
  const selectedEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
    setEmojiActive(false);
  };

  //ChatFilter Selection Handler
  const chatFilterHandler = (event) => {
    setChatFilter({
      label: event.label,
      value: event.value,
    });
  };

  //Search Chat
  const searchChat = (e) => {
    setSearchChatValue(e);

    if (e !== "") {
      let filteredData = allUsersList.filter((value) => {
        return value.name.toLowerCase().includes(e.toLowerCase());
      });
      setAllChatData(filteredData);
    } else if (e === "" || e === null) {
      let data = allUsersList;
      setSearchChatValue("");
      setAllChatData(data);
    }
  };

  //search filter global chat
  const searchFilterChat = () => {
    if (globalSearchFilter === false) {
      setGlobalSearchFilter(true);
    } else {
      setGlobalSearchFilter(false);
    }
  };

  //Dropdown state of chat menu (Dot wali)
  const [chatMenuActive, setChatMenuActive] = useState(false);

  // const onClickVideoIcon = async () =>{

  // }

  // for group video call which is open on meeting icon on meeting page
  const videoHandlerforInisiateCall = (flag) => {
    dispatch(setOpenVideoCallBox(flag));
    dispatch(setMaximizeVideoCallBox(false));
    dispatch(setMinimizeVideoCallBox(false));
  };

  //for one to one video call
  const anotherVideoPanelHandler = (flag) => {
    localStorage.setItem("VideoPanelGroup", true);

    dispatch(setGroupVideoPanel(flag));
    dispatch(setMaximizeVideoCallBox(false));
    dispatch(setMinimizeVideoCallBox(false));
  };

  return (
    <>
      <div className={chatOpen === true ? "chatBox height" : "chatBox"}>
        <div className="chat-inner-content">
          <span className="triangle-overlay-chat"></span>
          <Triangle className="pointer-video-icon" />
          <>
            <Container>
              <Row>
                <Col lg={2} md={2} sm={12}>
                  <p className="talk-video-heading">Video</p>
                </Col>
                <Col lg={1} md={1} sm={1} />
                <Col lg={3} md={3} sm={12}>
                  <Select
                    options={chatFilterOptions}
                    defaultValue={chatFilterOptions[0]}
                    onChange={chatFilterHandler}
                    className="videoFilter"
                    popupClassName="talk-chat-filter"
                  />
                </Col>
                <Col lg={5} md={5} sm={12}></Col>

                <Col lg={1} md={1} sm={12} className="p-0">
                  <div className="chat-icons" onClick={searchFilterChat}>
                    <img src={SearchIcon} className="img-cover" />
                  </div>
                </Col>
              </Row>
              {globalSearchFilter === true ? (
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      maxLength={200}
                      applyClass="form-control2"
                      name="Name"
                      change={(e) => {
                        searchChat(e.target.value);
                      }}
                      value={searchChatValue}
                    />
                  </Col>
                </Row>
              ) : null}
            </Container>
            <Container>
              <Row className="single-chat">
                <Col lg={1} md={1} sm={1} className="mt-4">
                  <Checkbox />
                </Col>
                <Col lg={2} md={2} sm={2} className="bottom-border">
                  <div className="video-profile-icon">
                    {/* Bell Notification SVG Code */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="31.188"
                      height="31.186"
                      viewBox="0 0 31.188 31.186"
                    >
                      <g
                        id="Group_1683"
                        data-name="Group 1683"
                        transform="translate(-189.415 78.235)"
                      >
                        <path
                          id="Path_594"
                          data-name="Path 594"
                          d="M220.6-47.049H218.18a13.038,13.038,0,0,0-4.892-10.2,12.728,12.728,0,0,0-8.892-2.939,12.681,12.681,0,0,0-6.291,1.95,13.229,13.229,0,0,0-4.581,4.787,13.087,13.087,0,0,0-1.674,6.385h-2.434a15.387,15.387,0,0,1,2.885-9.01,15.6,15.6,0,0,1,7.585-5.709c-.09-.076-.145-.129-.207-.175a8.863,8.863,0,0,1-3.339-9.641,8.764,8.764,0,0,1,6.6-6.379c.477-.127.975-.171,1.464-.254h1.218c.489.083.987.128,1.464.254a8.694,8.694,0,0,1,6.591,6.382A8.679,8.679,0,0,1,211-62.5c-.261.247-.554.459-.854.705.09.041.151.073.215.1a15.292,15.292,0,0,1,5.562,3.519,15.27,15.27,0,0,1,4.436,8.416c.1.6.164,1.2.244,1.8ZM205.008-75.8a6.6,6.6,0,0,0-6.576,6.563,6.6,6.6,0,0,0,6.579,6.591,6.6,6.6,0,0,0,6.576-6.563A6.6,6.6,0,0,0,205.008-75.8Z"
                          fill="#fff"
                        />
                      </g>
                    </svg>
                    <span className="user-active-status"></span>
                  </div>
                </Col>
                <Col lg={7} md={7} sm={7} className="bottom-border">
                  <div
                    className={"video-block"}
                    //   onClick={() => chatClick(dataItem)}
                  >
                    <p className="Video-chat-username m-0">
                      {" "}
                      <img src={MissedCallIcon} />
                    </p>

                    <p className="video-chat-date m-0">
                      10 Jan, 2023 | Yesterday
                    </p>
                  </div>
                </Col>
                <Col lg={2} md={2} sm={2} className="mt-4">
                  <img
                    src={VideoCallIcon}
                    onClick={() => videoHandlerforInisiateCall(true)}
                  />
                </Col>
              </Row>

              <Row className="single-chat">
                {isButtonClick === true ? (
                  <Col lg={1} md={1} sm={1}>
                    <Button
                      text="Group Call"
                      className="group-btn"
                      onClick={() => anotherVideoPanelHandler(true)}
                      icon={<img src={VideoCallIcon} />}
                    />
                  </Col>
                ) : (
                  <>
                    <Col lg={1} md={1} sm={1} className="mt-4">
                      <Checkbox onClick={onClickGroupBtnHandler} />
                    </Col>
                  </>
                )}

                <Col lg={2} md={2} sm={2} className="bottom-border">
                  <div className="video-profile-icon">
                    {/* Bell Notification SVG Code */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="31.188"
                      height="31.186"
                      viewBox="0 0 31.188 31.186"
                    >
                      <g
                        id="Group_1683"
                        data-name="Group 1683"
                        transform="translate(-189.415 78.235)"
                      >
                        <path
                          id="Path_594"
                          data-name="Path 594"
                          d="M220.6-47.049H218.18a13.038,13.038,0,0,0-4.892-10.2,12.728,12.728,0,0,0-8.892-2.939,12.681,12.681,0,0,0-6.291,1.95,13.229,13.229,0,0,0-4.581,4.787,13.087,13.087,0,0,0-1.674,6.385h-2.434a15.387,15.387,0,0,1,2.885-9.01,15.6,15.6,0,0,1,7.585-5.709c-.09-.076-.145-.129-.207-.175a8.863,8.863,0,0,1-3.339-9.641,8.764,8.764,0,0,1,6.6-6.379c.477-.127.975-.171,1.464-.254h1.218c.489.083.987.128,1.464.254a8.694,8.694,0,0,1,6.591,6.382A8.679,8.679,0,0,1,211-62.5c-.261.247-.554.459-.854.705.09.041.151.073.215.1a15.292,15.292,0,0,1,5.562,3.519,15.27,15.27,0,0,1,4.436,8.416c.1.6.164,1.2.244,1.8ZM205.008-75.8a6.6,6.6,0,0,0-6.576,6.563,6.6,6.6,0,0,0,6.579,6.591,6.6,6.6,0,0,0,6.576-6.563A6.6,6.6,0,0,0,205.008-75.8Z"
                          fill="#fff"
                        />
                      </g>
                    </svg>
                    <span className="user-active-status"></span>
                  </div>
                </Col>
                <Col lg={7} md={7} sm={7} className="bottom-border">
                  <div
                    className={"video-block"}
                    //   onClick={() => chatClick(dataItem)}
                  >
                    <p className="Video-chat-username m-0">
                      {" "}
                      <img src={MissedCallIcon} />
                    </p>

                    <p className="video-chat-date m-0">
                      10 Jan, 2023 | Yesterday
                    </p>
                  </div>
                </Col>
                <Col lg={2} md={2} sm={2} className="mt-4">
                  <img
                    src={VideoCallIcon}
                    onClick={() => anotherVideoPanelHandler(true)}
                  />
                </Col>
              </Row>
            </Container>{" "}
          </>
        </div>
      </div>
    </>
  );
};

export default TalkVideo;
