import React, { useState, useEffect } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import "./TalkVideo.css";
import { Triangle } from "react-bootstrap-icons";
import { allAssignessList } from "../../../../store/actions/Get_List_Of_Assignees";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container, Form } from "react-bootstrap";
import { Select, Checkbox } from "antd";
import VideoCallScreen from "../videoCallScreen/VideoCallScreen";
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
} from "../../../../store/actions/VideoCalling_actions";
const TalkVideo = () => {
  //Current User ID
  let createrID = localStorage.getItem("userID");
  const { t } = useTranslation();
  //Current language
  let lang = localStorage.getItem("i18nextLng");

  // Using dispatch To Call APIs
  const dispatch = useDispatch();

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
    dispatch(allAssignessList(parseInt(createrID), t));
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

  //File Upload click Function
  const uploadFilesToDo = (data) => {
    const uploadFilePath = data.target.value;
    const uploadedFile = data.target.files[0];
    // console.log("uploadFilesToDo", uploadedFile.name);
    var ext = uploadedFile.name.split(".").pop();
    console.log("uploadedFile", uploadedFile.name);
    let file = tasksAttachments.TasksAttachments;
    if (
      ext === "doc" ||
      ext === "docx" ||
      ext === "xls" ||
      ext === "xlsx" ||
      ext === "pdf" ||
      ext === "png" ||
      ext === "txt" ||
      ext === "jpg" ||
      ext === "jpeg" ||
      ext === "gif"
    ) {
      let data;
      let sizezero;
      let size;
      if (file.length > 0) {
        file.map((filename, index) => {
          if (filename.DisplayFileName === uploadedFile.name) {
            data = false;
          }
        });
        if (uploadedFile.size > 10000000) {
          size = false;
        } else if (uploadedFile.size === 0) {
          sizezero = false;
        }
        if (data === false) {
          // setOpen({
          //   flag: true,
          //   message: "File Already Uploaded",
          // });
        } else if (size === false) {
          // setOpen({
          //   flag: true,
          //   message: "File Size Should be Less than 10MB",
          // });
        } else if (sizezero === false) {
          // setOpen({
          //   flag: true,
          //   message: "Selected File is Empty",
          // });
        } else {
          // dispatch(FileUploadToDo(uploadedFile));
        }
      } else {
        let size;
        let sizezero;
        if (uploadedFile.size > 10000000) {
          size = false;
        } else if (uploadedFile.size === 0) {
          sizezero = false;
        }
        if (size === false) {
          // setOpen({
          //   flag: true,
          //   message: "File Size Should be Less than 10MB",
          // });
        } else if (sizezero === false) {
          // setOpen({
          //   flag: true,
          //   message: "Selected File is Empty",
          // });
        } else {
          // dispatch(FileUploadToDo(uploadedFile));
        }
      }
    }
    file.push({
      PK_TAID: 0,
      DisplayAttachmentName: uploadedFile.name,
      OriginalAttachmentName: uploadFilePath,
      CreationDateTime: "",
      FK_TID: 0,
    });
    setTasksAttachments({ ["TasksAttachments"]: file });
  };

  //Delete uploaded File
  const deleteFilefromAttachments = (data, index) => {
    let searchIndex = tasksAttachments.TasksAttachments;
    console.log(
      "firdeleteFilefromAttachmentsdeleteFilefromAttachmentsst",
      index
    );
    searchIndex.splice(index, 1);
    setTasksAttachments({
      ...tasksAttachments,
      ["TasksAttachments"]: searchIndex,
    });
  };

  //ChatFilter Selection Handler
  const chatFilterHandler = (event) => {
    setChatFilter({
      label: event.label,
      value: event.value,
    });
  };

  //Clicking on Chat Function
  const chatClick = (record) => {
    setActiveChat(record);
    setChatOpen(true);
    setAddNewChat(false);
    setGlobalSearchFilter(false);
    setSearchChatValue("");
    setAllChatData(allUsersList);
  };

  const closeChat = () => {
    setChatOpen(false);
  };

  //Add Click Function
  const addChat = () => {
    setAddNewChat(true);
  };

  //Close Add Chat
  const closeAddChat = () => {
    setAddNewChat(false);
  };

  //Search Chat
  const searchChat = (e) => {
    setSearchChatValue(e);
    console.log("Jawad bhai", searchChatValue);
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

  //Managing that state, if show or hide
  const activateChatMenu = () => {
    if (chatMenuActive === false) {
      setChatMenuActive(true);
    } else {
      setChatMenuActive(false);
    }
  };

  //Modal show hide
  // const [show, setShow] = useState(false);

  // for modal create  handler
  const modalHandlerSave = async (e) => {
    // await setShow(true);
    setSave(true);
    setPrint(false);
    setEmail(false);
  };

  const modalHandlerPrint = async (e) => {
    // await setShow(true);
    setSave(false);
    setPrint(true);
    setEmail(false);
  };

  const modalHandlerEmail = async (e) => {
    // await setShow(true);
    setSave(false);
    setPrint(false);
    setEmail(true);
  };

  function onChangeToday(e) {
    setTodayCheckState(e.target.checked);
    setAllCheckState(false);
    setCustomCheckState(false);
    console.log(
      "checkState today",
      todayCheckState,
      allCheckState,
      customCheckState
    );
  }

  function onChangeAll(e) {
    setAllCheckState(e.target.checked);
    setTodayCheckState(false);
    setCustomCheckState(false);
    console.log(
      "checkState all",
      todayCheckState,
      allCheckState,
      customCheckState
    );
  }

  function onChangeCustom(e) {
    setCustomCheckState(e.target.checked);
    setTodayCheckState(false);
    setAllCheckState(false);
    console.log(
      "checkState custom",
      todayCheckState,
      allCheckState,
      customCheckState
    );
  }

  const handleCancel = () => {
    setSave(false);
    setPrint(false);
    setEmail(false);
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
    setEndDatedisable(true);
  };

  const onChangeDate = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    console.log("onChangeDate", name, value);
    if (name === "StartDate" && value != "") {
      setChatDateState({
        ...chatDateState,
        [name]: DateSendingFormat(value),
      });
      setEndDatedisable(false);
    }
    if (name === "EndDate" && value != "") {
      setChatDateState({
        ...chatDateState,
        [name]: DateSendingFormat(value),
      });
    }
    // if (chatDateState.StartDate !== "") {
    //   setEndDatedisable(false);
    // } else {
    //   setEndDatedisable(true);
    // }
  };

  // const onClickVideoIcon = async () =>{

  // }
  const videoHandlerforInisiateCall = (flag) => {
    console.log("videoHandlerforInisiateCall", flag);
    dispatch(setOpenVideoCallBox(flag));
    dispatch(setMaximizeVideoCallBox(false));
    dispatch(setMinimizeVideoCallBox(false));
  };
  return (
    <>
      <div className={chatOpen === true ? "chatBox height" : "chatBox"}>
        <div className="chat-inner-content">
          <span className="triangle-overlay-chat"></span>
          <Triangle className="pointer-video-icon" />
          {addNewChat === false ? (
            <>
              {/* <div
                className={chatOpen === true ? "add-chat height" : "add-chat"}
                onClick={addChat}
              >
                <img src={AddChatIcon} alt="" />
              </div> */}
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
                {/* {openEncryptionDialogue === true ? (
                  <Row className="encryption-box">
                    <Col lg={12} md={12} sm={12} className="text-end">
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={closeSecurityDialogue}
                      >
                        <img src={CrossIcon} style={{ width: "10px" }} />
                      </span>
                    </Col>
                    <Col lg={12} md={12} sm={12}>
                      <div className="encryption-level">
                        <Row>
                          <Col lg={7} md={7} sm={12}>
                            <p className="level-heading">Crypto Level:</p>
                          </Col>
                          <Col
                            lg={5}
                            md={5}
                            sm={12}
                            className="positionRelative"
                          >
                            <p className="level">NIAP +??PQC</p>
                            <span className="securityicon-box">
                              {" "}
                              <img
                                src={SecurityIconMessasgeBox}
                                style={{ width: "17px" }}
                              />
                            </span>
                          </Col>
                        </Row>
                      </div>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <div className="encryption-message">
                            <p>
                              We realize & understand that privacy & security of
                              data is of pivotal requirement for any
                              organization and its users. It is of utmost
                              importance that data flowing between the end user
                              device and the Talk Server is immune to data
                              breaches, data exposure & data leakages. That???s
                              why at Diskus we practice protecting digital
                              information throughout its lifecycle by utilizing
                              multilayered security approach.
                            </p>
                            <p>
                              {" "}
                              Following the NIAP benchmark, that requires
                              outermost layer of all communicating devices must
                              be secured by TLS using NIST validated algorithms
                              (i.e. ECC-384 & AES-256) we make sure that the
                              data in motion is protected to the classification
                              level of Official Top Secret. Securing the
                              communicating endpoints only is not sufficient and
                              doesn???t guarantee end-to-end privacy and
                              authentication and that???s where we utilize Post
                              Quantum Cryptography (PQC) ???Crystals - Kyber??? for
                              end-to-end encryption of data.
                            </p>{" "}
                            <p>
                              PQC are the advanced form of encryption &
                              cryptography algorithms that ensure security and
                              reliability against any threat/attack conducted
                              using any available Quantum Computer A NIST
                              compliant Key agreement along with PQC key
                              agreement generates a unique once per session key
                              and ensures data encrypted using these keys can
                              only be decrypted by intended recipient thus
                              ensuring mutual authentication of a
                              per??session??basis.
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ) : null} */}
              </Container>
              <Container>
                {allChatData.map((dataItem) => {
                  return (
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
                            {dataItem.name} <img src={MissedCallIcon} />
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
                  );
                })}
              </Container>{" "}
            </>
          ) : (
            <>
              <Container>
                <Row className="margin-top-10">
                  <Col lg={6} md={6} sm={12}>
                    <div className="new-chat">
                      <p className="fw-bold m-0">New Conversation</p>
                    </div>
                  </Col>
                  <Col lg={5} md={5} sm={12}></Col>

                  <Col lg={1} md={1} sm={12} className="p-0">
                    <div
                      className="close-addChat-filter"
                      onClick={closeAddChat}
                    >
                      <img src={CloseChatIcon} />
                    </div>
                  </Col>
                </Row>
                <Row className="margin-top-10">
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
              </Container>
              <Container>
                {allChatData.map((dataItem) => {
                  return (
                    <Row className="single-chat">
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
                      {/* <Col lg={10} md={10} sm={10} className="bottom-border">
                        <div
                          className={"chat-block"}
                          onClick={() => chatClick(dataItem)}
                        >
                          <p className="chat-username m-0"> {dataItem.name}</p>
                          <p className="chat-message m-0">
                            <span className="chat-tick-icon">
                              <img src={DoubleTickIcon} className="img-cover" />
                            </span>
                            {dataItem.name}
                          </p>
                          <p className="chat-date m-0">
                            10 Jan, 2023 | Yesterday
                          </p>
                        </div>
                      </Col> */}
                    </Row>
                  );
                })}
              </Container>
            </>
          )}
        </div>
      </div>
      <div className="positionRelative">
        {chatOpen === true ? (
          <div className={"chat-messenger-head"}>
            <Container>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <div
                    className={
                      save === true || print === true || email === true
                        ? "chat-header applyBlur"
                        : "chat-header"
                    }
                  >
                    <Row>
                      <Col lg={2} md={2} sm={12}>
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
                      <Col lg={5} md={5} sm={12}>
                        <p className="chat-username">{activeChat.name}</p>
                      </Col>
                      <Col lg={1} md={1} sm={12}>
                        {" "}
                        <div className="chat-box-icons">
                          <img
                            src={SecurityIcon}
                            // className="img-cover"
                            // style={{ width: "20px", marginTop: "16px" }}
                          />
                        </div>
                      </Col>
                      <Col lg={1} md={1} sm={12}>
                        {" "}
                        <div className="chat-box-icons">
                          <img
                            src={SearchChatIcon}
                            // className="img-cover"
                            // style={{ width: "20px", marginTop: "16px" }}
                          />
                        </div>
                      </Col>
                      <Col lg={1} md={1} sm={12}>
                        {" "}
                        <div
                          className="chat-box-icons positionRelative"
                          onClick={activateChatMenu}
                        >
                          <img src={MenuIcon} />
                          {chatMenuActive === true ? (
                            <div className="dropdown-menus-chat">
                              <span onClick={modalHandlerSave}>Save</span>
                              <span onClick={modalHandlerPrint}>Print</span>
                              <span
                                onClick={modalHandlerEmail}
                                style={{ borderBottom: "none" }}
                              >
                                Email
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={1} md={1} sm={12}>
                        {" "}
                        <div className="chat-box-icons">
                          <img
                            src={VideoCallIcon}
                            // className="img-cover"
                            // style={{ width: "20px", marginTop: "16px" }}
                          />
                        </div>
                      </Col>
                      <Col lg={1} md={1} sm={12}>
                        {" "}
                        <div className="chat-box-icons" onClick={closeChat}>
                          <img
                            src={CloseChatIcon}
                            // className="img-cover"
                            // style={{ width: "20px", marginTop: "16px" }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12} className="p-0">
                  <div className="encryption-level-chat">
                    <Row>
                      <Col lg={7} md={7} sm={12}>
                        <p className="level-heading">Crypto Level:</p>
                      </Col>
                      <Col lg={5} md={5} sm={12} className="positionRelative">
                        <p className="level">NIAP +??PQC</p>

                        <span className="securityicon-box">
                          <img
                            src={SecurityIconMessasgeBox}
                            style={{ width: "17px" }}
                          />
                        </span>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="p-0">
                  <div
                    className={
                      save === true || print === true || email === true
                        ? "chat-section applyBlur"
                        : "chat-section"
                    }
                  ></div>
                </Col>
              </Row>
              <Row>
                <Col className="p-0">
                  <>
                    {save === true ? (
                      <>
                        <div className="chat-menu-popups">
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              {" "}
                              <div className="chat-modal-Heading">
                                <h1>Save Messages</h1>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              {" "}
                              <div className="chat-options">
                                <Checkbox
                                  checked={todayCheckState}
                                  onChange={onChangeToday}
                                >
                                  Today
                                </Checkbox>
                                <Checkbox
                                  checked={allCheckState}
                                  onChange={onChangeAll}
                                >
                                  All
                                </Checkbox>
                                <Checkbox
                                  checked={customCheckState}
                                  onChange={onChangeCustom}
                                >
                                  Custom
                                </Checkbox>
                              </div>
                              {customCheckState === true ? (
                                <Row>
                                  <Col lg={1} md={1} sm={12}></Col>
                                  <Col lg={5} md={5} sm={12}>
                                    <label style={{ marginLeft: "5px" }}>
                                      <b style={{ fontSize: "0.7rem" }}>
                                        {t("Date-from")}
                                      </b>
                                    </label>{" "}
                                    <InputDatePicker
                                      name="StartDate"
                                      size="large"
                                      width="100%"
                                      value={
                                        chatDateState.StartDate
                                          ? DateDisplayFormat(
                                              chatDateState.StartDate
                                            )
                                          : null
                                      }
                                      DateRange
                                      placeholder={t("Select-date")}
                                      change={onChangeDate}
                                    />
                                  </Col>
                                  <Col lg={5} md={5} sm={12}>
                                    <label style={{ marginLeft: "5px" }}>
                                      <b style={{ fontSize: "0.7rem" }}>
                                        {t("Date-to")}
                                      </b>
                                    </label>
                                    <InputDatePicker
                                      name="EndDate"
                                      size="large"
                                      width="100%"
                                      value={
                                        chatDateState.EndDate
                                          ? DateDisplayFormat(
                                              chatDateState.EndDate
                                            )
                                          : null
                                      }
                                      DateRange
                                      placeholder={"Select Date"}
                                      change={onChangeDate}
                                      disable={endDatedisable}
                                    />
                                  </Col>
                                  <Col lg={1} md={1} sm={12}></Col>
                                </Row>
                              ) : null}
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="text-center"
                            >
                              <Button
                                className="MontserratSemiBold Ok-btn"
                                text="Okay"
                                onClick={handleCancel}
                              />
                            </Col>
                          </Row>
                        </div>
                      </>
                    ) : print === true ? (
                      <>
                        <div className="chat-menu-popups">
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              {" "}
                              <div className="chat-modal-Heading">
                                <h1>Print Messages</h1>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              {" "}
                              <div className="chat-options">
                                <Checkbox
                                  checked={todayCheckState}
                                  onChange={onChangeToday}
                                >
                                  Today
                                </Checkbox>
                                <Checkbox
                                  checked={allCheckState}
                                  onChange={onChangeAll}
                                >
                                  All
                                </Checkbox>
                                <Checkbox
                                  checked={customCheckState}
                                  onChange={onChangeCustom}
                                >
                                  Custom
                                </Checkbox>
                              </div>
                              {customCheckState === true ? (
                                <Row>
                                  <Col lg={6} md={6} sm={12}>
                                    <label style={{ marginLeft: "5px" }}>
                                      <b style={{ fontSize: "0.7rem" }}>
                                        Date From
                                      </b>
                                    </label>{" "}
                                    <InputDatePicker
                                      name="StartDate"
                                      size="large"
                                      width="100%"
                                      value={
                                        chatDateState.StartDate
                                          ? DateDisplayFormat(
                                              chatDateState.StartDate
                                            )
                                          : null
                                      }
                                      DateRange
                                      placeholder={"Select Date"}
                                      change={onChangeDate}
                                    />
                                  </Col>
                                  <Col lg={6} md={6} sm={12}>
                                    <label style={{ marginLeft: "5px" }}>
                                      <b style={{ fontSize: "0.7rem" }}>
                                        Date To
                                      </b>
                                    </label>
                                    <InputDatePicker
                                      name="EndDate"
                                      size="large"
                                      width="100%"
                                      value={
                                        chatDateState.EndDate
                                          ? DateDisplayFormat(
                                              chatDateState.EndDate
                                            )
                                          : null
                                      }
                                      DateRange
                                      placeholder={"Select Date"}
                                      change={onChangeDate}
                                      disable={endDatedisable}
                                    />
                                  </Col>
                                </Row>
                              ) : null}
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="text-center"
                            >
                              <Button
                                className="MontserratSemiBold Ok-btn"
                                text="Okay"
                                onClick={handleCancel}
                              />
                            </Col>
                          </Row>
                        </div>
                      </>
                    ) : email === true ? (
                      <>
                        <div className="chat-menu-popups">
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              {" "}
                              <div className="chat-modal-Heading">
                                <h1>Email Messages</h1>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              {" "}
                              <div className="chat-options">
                                <Checkbox
                                  checked={todayCheckState}
                                  onChange={onChangeToday}
                                >
                                  Today
                                </Checkbox>
                                <Checkbox
                                  checked={allCheckState}
                                  onChange={onChangeAll}
                                >
                                  All
                                </Checkbox>
                                <Checkbox
                                  checked={customCheckState}
                                  onChange={onChangeCustom}
                                >
                                  Custom
                                </Checkbox>
                              </div>
                              {customCheckState === true ? (
                                <Row>
                                  <Col lg={6} md={6} sm={12}>
                                    <label style={{ marginLeft: "5px" }}>
                                      <b style={{ fontSize: "0.7rem" }}>
                                        Date From
                                      </b>
                                    </label>{" "}
                                    <InputDatePicker
                                      name="StartDate"
                                      size="large"
                                      width="100%"
                                      value={
                                        chatDateState.StartDate
                                          ? DateDisplayFormat(
                                              chatDateState.StartDate
                                            )
                                          : null
                                      }
                                      DateRange
                                      placeholder={"Select Date"}
                                      change={onChangeDate}
                                    />
                                  </Col>
                                  <Col lg={6} md={6} sm={12}>
                                    <label style={{ marginLeft: "5px" }}>
                                      <b style={{ fontSize: "0.7rem" }}>
                                        Date To
                                      </b>
                                    </label>
                                    <InputDatePicker
                                      name="EndDate"
                                      size="large"
                                      width="100%"
                                      value={
                                        chatDateState.EndDate
                                          ? DateDisplayFormat(
                                              chatDateState.EndDate
                                            )
                                          : null
                                      }
                                      DateRange
                                      placeholder={"Select Date"}
                                      change={onChangeDate}
                                      disable={endDatedisable}
                                    />
                                  </Col>
                                </Row>
                              ) : null}
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="text-center"
                            >
                              <Button
                                className="MontserratSemiBold Ok-btn"
                                text="Okay"
                                onClick={handleCancel}
                              />
                            </Col>
                          </Row>
                        </div>
                      </>
                    ) : null}
                  </>
                </Col>
              </Row>
              <Row>
                <Col className="positionRelative p-0">
                  <div
                    className={
                      save === true || print === true || email === true
                        ? "chat-input-section applyBlur"
                        : "chat-input-section"
                    }
                  >
                    {tasksAttachments.TasksAttachments.length > 0 ? (
                      <div className="uploaded-file-section">
                        <div className="file-upload">
                          <Row>
                            {tasksAttachments.TasksAttachments.length > 0
                              ? tasksAttachments.TasksAttachments.map(
                                  (data, index) => {
                                    var ext =
                                      data.DisplayAttachmentName.split(
                                        "."
                                      ).pop();

                                    const first =
                                      data.DisplayAttachmentName.split(" ")[0];
                                    return (
                                      <Col
                                        sm={12}
                                        lg={3}
                                        md={3}
                                        className="chat-upload-icon"
                                      >
                                        <img
                                          src={DocumentIcon}
                                          className="attachment-icon"
                                          extension={ext}
                                        />
                                        <p className="chat-upload-text">
                                          {first}
                                        </p>
                                        <div className="delete-uplaoded-file">
                                          <img
                                            src={DeleteUploadIcon}
                                            className="delete-upload-file"
                                            onClick={() =>
                                              deleteFilefromAttachments(
                                                data,
                                                index
                                              )
                                            }
                                            alt=""
                                          />
                                        </div>
                                      </Col>
                                    );
                                  }
                                )
                              : null}
                          </Row>
                        </div>
                      </div>
                    ) : null}
                    <div className="emoji-click" onClick={emojiClick}>
                      <img src={EmojiIcon} alt="" />
                    </div>
                    {emojiActive === true ? (
                      <Picker data={data} onEmojiSelect={selectedEmoji} />
                    ) : null}
                    <div className="upload-click">
                      <span className="custom-upload-input">
                        <CustomUploadChat
                          change={uploadFilesToDo}
                          onClick={(event) => {
                            event.target.value = null;
                          }}
                          className="UploadFileButton"
                        />
                      </span>
                    </div>
                    <div className="chat-input-field">
                      <Form.Control
                        value={input}
                        className="chat-message-input"
                        name="ChatMessage"
                        placeholder={"Type a Message"}
                        maxLength={200}
                        onChange={(e) => setInput(e.target.value)}
                      />
                    </div>
                    <div className="sendChat-click">
                      <img src={ChatSendIcon} alt="" />
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        ) : null}
      </div>

      {/* <div>{openVideoScreen === true && <VideoCallScreen setOpenVideoScreen={setOpenVideoScreen} openVideoScreen={openVideoScreen} closeButtonVideoCallFunc={() => setOpenVideoScreen(false)}/>}</div> */}
      {/* {show ? (
        <ChatModal
          show={show}
          setShow={setShow}
          save={save}
          print={print}
          email={email}
        />
      ) : null} */}
    </>
  );
};

export default TalkVideo;
