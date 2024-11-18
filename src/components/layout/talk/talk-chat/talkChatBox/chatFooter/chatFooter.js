import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  InsertOTOMessages,
  InsertPrivateGroupMessages,
  InsertBroadcastMessages,
  pushMessageData,
  pushChatData,
  fileUploadData,
} from "../../../../../../store/actions/Talk_action";
import { fileUploadFlag } from "../../../../../../store/actions/Talk_Feature_actions";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";
import ChatSendIcon from "../../../../../../assets/images/Chat-Send-Icon.png";
import UploadChatIcon from "../../../../../../assets/images/Upload-Chat-Icon.png";
import UploadContact from "../../../../../../assets/images/Upload-Contact.png";
import UploadDocument from "../../../../../../assets/images/Upload-Document.png";
import UploadPicVid from "../../../../../../assets/images/Upload-PicVid.png";
import UploadSticker from "../../../../../../assets/images/Upload-Sticker.png";
import DocumentIcon from "../../../../../../assets/images/Document-Icon.png";
import EmojiIcon from "../../../../../../assets/images/Emoji-Select-Icon.png";
import DeleteUploadIcon from "../../../../../../assets/images/Delete-Upload-Icon.png";

const ChatFooter = ({ allOtoMessages, setAllOtoMessages }) => {
  const { talkStateData, talkFeatureStates } = useSelector((state) => state);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  //CURRENT DATE TIME UTC
  let currentDateTime = new Date();
  let changeDateFormatCurrent = moment(currentDateTime).utc();
  let currentDateTimeUtc = moment(changeDateFormatCurrent).format(
    "YYYYMMDDHHmmss"
  );

  //Current user id
  let currentUserId = localStorage.getItem("userID");

  //Current Organization
  let currentOrganizationId = localStorage.getItem("organizationID");

  //Current UserName
  let currentUserName = localStorage.getItem("name");

  const emojiMenuRef = useRef();
  const uploadFileRef = useRef();
  //Input refs
  const inputRef = useRef(null);

  //Input Chat Autofocus state
  const [inputChat, setInputChat] = useState(true);

  //Show Emoji or Not
  const [emojiActive, setEmojiActive] = useState(false);

  //Selected Emoji
  const [emojiSelected, setEmojiSelected] = useState(false);

  //Upload Options
  const [uploadOptions, setUploadOptions] = useState(false);

  //File Upload
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });

  //File Thumbnail States
  const [file, setFile] = useState("");

  const [uploadFileTalk, setUploadFileTalk] = useState({});

  //Message Insert Data
  const [messageSendData, setMessageSendData] = useState({
    SenderID:
      currentUserId != null && currentUserId != undefined
        ? currentUserId.toString()
        : "",
    ReceiverID: "0",
    Body: "",
    MessageActivity: "Direct Message",
    FileName: "",
    FileGeneratedName: "",
    Extension: "",
    AttachmentLocation: "",
    UID: "",
    MessageID: 0,
  });

  function generateGUID() {
    const alphanumericChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomChars = Array.from(
      { length: 14 },
      () =>
        alphanumericChars[Math.floor(Math.random() * alphanumericChars.length)]
    );
    const currentDate = new Date();
    const currentUTCDateTime = currentDate
      .toISOString()
      .replace(/[-:.TZ]/g, "");

    return `${randomChars.join("")}_${currentUTCDateTime}_${currentUserId}_${
      talkStateData.ActiveChatData.id
    }`;
  }

  // Generate the unique ID
  const uniqueId = generateGUID();

  //Response return on click of emoji
  const selectedEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    if (talkStateData.ActiveChatData.isBlock === 0) {
      setMessageSendData({
        ...messageSendData,
        Body: messageSendData.Body + emoji,
      });
      setInputChat(true);
    }
    setEmojiSelected(true);
    setEmojiActive(false);
    setInputChat(true);
  };

  //Emoji on click function
  const emojiClick = () => {
    if (emojiActive === false) {
      setEmojiActive(true);
    } else {
      setEmojiActive(false);
    }
  };

  //Show upload options or Hide
  const showUploadOptions = () => {
    if (
      uploadOptions === false &&
      talkStateData.ActiveChatData.isBlock === 0 &&
      talkFeatureStates.FileUploadFlag === false
    ) {
      setUploadOptions(true);
    } else {
      setUploadOptions(false);
    }
  };

  const deleteFilefromAttachments = (data, index) => {
    let searchIndex = tasksAttachments.TasksAttachments;
    searchIndex.splice(index, 1);
    setTasksAttachments({
      ...tasksAttachments,
      ["TasksAttachments"]: searchIndex,
    });
    setUploadFileTalk({});
  };

  const handleOutsideClick = (event) => {
    if (
      emojiMenuRef.current &&
      !emojiMenuRef.current.contains(event.target) &&
      emojiActive
    ) {
      setEmojiActive(false);
    }
    if (
      uploadFileRef.current &&
      !uploadFileRef.current.contains(event.target) &&
      uploadOptions
    ) {
      setUploadOptions(false);
    }
  };

  //Chat Message json set
  const chatMessageHandler = (e) => {
    setMessageSendData({
      ...messageSendData,
      Body: e.target.value,
    });
  };

  const autoResize = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset the height to auto to calculate the new height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to fit the content

    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
    const maxHeight = lineHeight * 4; // Limit the input to 4 lines
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.overflowY = "scroll"; // Enable vertical scrolling
      textarea.style.height = `${maxHeight}px`; // Set the fixed height
    } else {
      textarea.style.overflowY = "hidden"; // Disable vertical scrolling
    }
  };

  const handleFileUpload = (data, uploadType) => {
    // Different logic for the specific upload type
    if (uploadType === "document") {
      // Handle document upload
      const uploadFilePath = data.target.value;
      const uploadedFile = data.target.files[0];
      var ext = uploadedFile.name.split(".").pop();
      let file = [];
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
          } else if (size === false) {
          } else if (sizezero === false) {
          } else {
            setUploadFileTalk(uploadedFile);
          }

          if (size === false) {
          } else if (sizezero === false) {
          } else {
            setUploadFileTalk(uploadedFile);
          }
        }
      }
      file.push({
        DisplayAttachmentName: uploadedFile.name,
        OriginalAttachmentName: uploadFilePath,
      });

      setUploadOptions(false);
      setUploadFileTalk(uploadedFile);
      setTasksAttachments({ ["TasksAttachments"]: file });
      dispatch(fileUploadFlag(true, "document"));
    } else if (uploadType === "image") {
      const uploadedFile = data.target.files[0];
      var ext = uploadedFile.name.split(".").pop();
      let file = [];
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
          } else if (size === false) {
          } else if (sizezero === false) {
          } else {
            setUploadFileTalk(uploadedFile);
          }

          if (size === false) {
          } else if (sizezero === false) {
          } else {
            setUploadFileTalk(uploadedFile);
          }
        }
      }
      dispatch(fileUploadData(URL.createObjectURL(data.target.files[0])));
      setFile(URL.createObjectURL(data.target.files[0]));
      setUploadOptions(false);
      setUploadFileTalk(uploadedFile);
      dispatch(fileUploadFlag(true, "image"));
    }
  };

  useEffect(() => {
    setMessageSendData({
      ...messageSendData,
      ReceiverID: talkStateData.ActiveChatData.id.toString(),
    });
  }, [talkStateData.ActiveChatData]);

  const sendChat = async () => {
    if (
      (messageSendData.Body !== "" && uploadFileTalk !== {}) ||
      (messageSendData.Body === "" && uploadFileTalk !== {}) ||
      messageSendData.Body !== ""
    ) {
      if (talkStateData.ActiveChatData.messageType === "O") {
        let Data = {
          TalkRequest: {
            ChannelID: parseInt(currentOrganizationId),
            Message: {
              ...messageSendData,
              UID: uniqueId,
            },
          },
        };

        await dispatch(InsertOTOMessages(navigate, Data, uploadFileTalk, t));

        let newMessageOto = {
          messageID: 0,
          senderID: parseInt(currentUserId),
          receiverID: parseInt(messageSendData.ReceiverID),
          messageBody: messageSendData.Body,
          senderName: currentUserName,
          receiverName: talkStateData.ActiveChatData.fullName,
          shoutAll: 0,
          frMessages: "Direct Message",
          broadcastName: "",
          isFlag: 0,
          sentDate: "",
          receivedDate: "",
          seenDate: "",
          currDate: currentDateTimeUtc,
          messageStatus: "Undelivered",
          fileGeneratedName: "",
          fileName: "",
          messageCount: 0,
          attachmentLocation: file,
          uid: "",
          blockCount: 0,
          sourceMessageBody: "Direct Message",
          sourceMessageId: 0,
        };

        let newChat = {
          id: parseInt(messageSendData.ReceiverID),
          fullName: talkStateData.ActiveChatData.fullName,
          imgURL: talkStateData.ActiveChatData.imgURL,
          messageBody: messageSendData.Body,
          messageDate: talkStateData.ActiveChatData.messageDate,
          notiCount: talkStateData.ActiveChatData.notiCount,
          messageType: talkStateData.ActiveChatData.messageType,
          isOnline: talkStateData.ActiveChatData.isOnline,
          isBlock: 0,
          companyName: talkStateData.ActiveChatData.companyName,
          sentDate: "",
          receivedDate: "",
          seenDate: "",
          attachmentLocation: messageSendData.AttachmentLocation,
          senderID: parseInt(messageSendData.SenderID),
          admin: talkStateData.ActiveChatData.admin,
        };

        setMessageSendData({
          ...messageSendData,
          SenderID: currentUserId.toString(),
          ReceiverID: messageSendData.ReceiverID,
          Body: "",
          MessageActivity: "Direct Message",
          FileName: "",
          FileGeneratedName: "",
          Extension: "",
          AttachmentLocation: "",
          UID: "",
          MessageID: 0,
        });

        // await dispatch(pushMessageData(newMessageOto))
        await dispatch(pushChatData(newChat));
        let newData = [...allOtoMessages];
        newData.push(newMessageOto);

        setAllOtoMessages(newData);

        // setAllChatData(updatedArray)
        // setAllOtoMessages([...allOtoMessages, newMessageOto])
      } else if (talkStateData.ActiveChatData.messageType === "G") {
        let Data = {
          TalkRequest: {
            ChannelID: parseInt(currentOrganizationId),
            Message: messageSendData,
          },
        };
        dispatch(InsertPrivateGroupMessages(navigate, Data, uploadFileTalk, t));

        let newMessageGroup = {
          messageID: 0,
          senderID: parseInt(currentUserId),
          receiverID: parseInt(messageSendData.ReceiverID),
          messageBody: messageSendData.Body,
          senderName: currentUserName,
          isFlag: 0,
          sentDate: currentDateTimeUtc,
          currDate: "",
          fileGeneratedName: "",
          fileName: "",
          shoutAll: 0,
          frMessages: "Direct Message",
          messageCount: 0,
          attachmentLocation: "",
          sourceMessageBody: "Direct Message",
          sourceMessageId: 0,
        };

        // setAllGroupMessages([...allGroupMessages, newMessageGroup])

        let newChat = {
          id: parseInt(messageSendData.ReceiverID),
          fullName: talkStateData.ActiveChatData.fullName,
          imgURL: talkStateData.ActiveChatData.imgURL,
          messageBody: messageSendData.Body,
          messageDate: talkStateData.ActiveChatData.messageDate,
          notiCount: talkStateData.ActiveChatData.notiCount,
          messageType: talkStateData.ActiveChatData.messageType,
          isOnline: talkStateData.ActiveChatData.isOnline,
          companyName: talkStateData.ActiveChatData.companyName,
          sentDate: "",
          receivedDate: "",
          seenDate: "",
          attachmentLocation: messageSendData.AttachmentLocation,
          senderID: parseInt(messageSendData.SenderID),
          admin: talkStateData.ActiveChatData.admin,
        };
        setMessageSendData({
          ...messageSendData,
          SenderID: currentUserId.toString(),
          ReceiverID: messageSendData.ReceiverID,
          Body: "",
          MessageActivity: "Direct Message",
          FileName: "",
          FileGeneratedName: "",
          Extension: "",
          AttachmentLocation: "",
          MessageID: 0,
        });

        let sendChat = [...talkStateData.PushChatData];
        sendChat.push(newChat);
        dispatch(pushChatData(sendChat));
      } else if (talkStateData.ActiveChatData.messageType === "B") {
        let Data = {
          TalkRequest: {
            ChannelID: parseInt(currentOrganizationId),
            Message: messageSendData,
          },
        };
        dispatch(InsertBroadcastMessages(navigate, Data, uploadFileTalk, t));
        let newMessage = {
          attachmentLocation: "",
          blockCount: 0,
          broadcastName: talkStateData.ActiveChatData.fullName,
          currDate: currentDateTimeUtc,
          fileGeneratedName: "",
          fileName: "",
          frMessages: "Direct Message",
          isFlag: 0,
          messageBody: messageSendData.Body,
          messageCount: 0,
          messageID: 0,
          messageStatus: "Undelivered",
          receivedDate: "",
          receiverID: parseInt(messageSendData.ReceiverID),
          receiverName: "",
          seenDate: "",
          senderID: parseInt(messageSendData.SenderID),
          senderName: currentUserName,
          sentDate: "",
          shoutAll: 0,
          uid: "",
        };
        let newChat = {
          id: parseInt(messageSendData.ReceiverID),
          fullName: talkStateData.ActiveChatData.fullName,
          imgURL: talkStateData.ActiveChatData.imgURL,
          messageBody: messageSendData.Body,
          messageDate: talkStateData.ActiveChatData.messageDate,
          notiCount: talkStateData.ActiveChatData.notiCount,
          messageType: talkStateData.ActiveChatData.messageType,
          isOnline: talkStateData.ActiveChatData.isOnline,
          companyName: talkStateData.ActiveChatData.companyName,
          sentDate: "",
          receivedDate: "",
          seenDate: "",
          attachmentLocation: messageSendData.AttachmentLocation,
          senderID: parseInt(messageSendData.SenderID),
          admin: talkStateData.ActiveChatData.admin,
        };
        setMessageSendData({
          ...messageSendData,
          SenderID: currentUserId.toString(),
          ReceiverID: messageSendData.ReceiverID,
          Body: "",
          MessageActivity: "Direct Message",
          FileName: "",
          FileGeneratedName: "",
          Extension: "",
          AttachmentLocation: "",
          MessageID: 0,
          UID: "",
        });

        let sendChat = [...talkStateData.PushChatData];
        sendChat.push(newChat);
        dispatch(pushChatData(sendChat));
        // setAllBroadcastMessages([...allBroadcastMessages, newMessage])
      } else {
      }
    } else {
    }
    // setReplyFeature(false)
    setInputChat(true);
    setFile("");
    setTasksAttachments({
      ...tasksAttachments,
      ["TasksAttachments"]: [],
    });
    setUploadFileTalk({});
    dispatch(fileUploadFlag(false, ""));
    dispatch(fileUploadData(""));
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.overflowY = "hidden";
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [emojiActive, uploadOptions]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputChat]);

  useEffect(() => {
    if (emojiSelected) {
      inputRef.current.focus();
      setEmojiSelected(false);
    }
  }, [emojiSelected]);

  return (
    <Row>
      <Col className="positionRelative p-0">
        <div
          className={
            talkFeatureStates.SaveModalFlag === true ||
            talkFeatureStates.PrintModalFlag === true ||
            talkFeatureStates.EmailModalFlag === true
              ? // deleteMessage === true
                "chat-input-section applyBlur"
              : "chat-input-section"
          }
          // className="chat-input-section"
        >
          {talkFeatureStates.FileUploadFlag === false &&
          tasksAttachments.TasksAttachments.length > 0 ? (
            <div className="uploaded-file-section">
              <div className="file-upload">
                <Row>
                  {tasksAttachments.TasksAttachments.length > 0
                    ? tasksAttachments.TasksAttachments.map((data, index) => {
                        var ext = data.DisplayAttachmentName.split(".").pop();

                        const first = data.DisplayAttachmentName.split(" ")[0];
                        return (
                          <Col
                            sm={12}
                            lg={3}
                            md={3}
                            className="chat-upload-icon"
                          >
                            <img
                              draggable="false"
                              src={DocumentIcon}
                              className="attachment-icon"
                              extension={ext}
                            />
                            <p className="chat-upload-text">{first}</p>
                            <div className="delete-uplaoded-file">
                              <img
                                draggable="false"
                                src={DeleteUploadIcon}
                                className="delete-upload-file"
                                onClick={() =>
                                  deleteFilefromAttachments(data, index)
                                }
                                alt=""
                              />
                            </div>
                          </Col>
                        );
                      })
                    : null}
                </Row>
              </div>
            </div>
          ) : null}
          <div className="emoji-section" ref={emojiMenuRef}>
            <div className="emoji-click" onClick={emojiClick}>
              <img draggable="false" src={EmojiIcon} alt="" />
            </div>
            {emojiActive === true ? (
              <Picker
                data={data}
                onEmojiSelect={selectedEmoji}
                disabled={false}
              />
            ) : null}
          </div>
          {talkFeatureStates.FileUploadFlag === false ? (
            <div className="upload-click positionRelative" ref={uploadFileRef}>
              <span className="custom-upload-input">
                <img
                  draggable="false"
                  src={UploadChatIcon}
                  onClick={showUploadOptions}
                />
                {uploadOptions === true ? (
                  <div className="upload-options">
                    <div className="file-upload-options">
                      <label className="image-upload" htmlFor="document-upload">
                        <img draggable="false" src={UploadContact} alt="" />
                      </label>
                      <input
                        id="document-upload"
                        type="file"
                        onChange={(event) =>
                          handleFileUpload(event, "document")
                        }
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        maxfilesize={10000000}
                        accept=".doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg, .gif"
                        style={{ display: "none" }}
                      />
                    </div>
                    <div className="file-upload-options">
                      <label className="image-upload" htmlFor="document-upload">
                        <img draggable="false" src={UploadDocument} alt="" />
                      </label>
                      <input
                        id="document-upload"
                        type="file"
                        onChange={(event) =>
                          handleFileUpload(event, "document")
                        }
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        maxfilesize={10000000}
                        accept=".doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg, .gif"
                        style={{ display: "none" }}
                      />
                    </div>
                    <div className="file-upload-options">
                      <label className="image-upload" htmlFor="sticker-upload">
                        <img draggable="false" src={UploadSticker} alt="" />
                      </label>
                      <input
                        id="sticker-upload"
                        type="file"
                        onChange={(event) =>
                          handleFileUpload(event, "document")
                        }
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        maxfilesize={10000000}
                        accept=".doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg, .gif"
                        style={{ display: "none" }}
                      />
                    </div>
                    <div className="file-upload-options">
                      <label className="image-upload" htmlFor="image-upload">
                        <img draggable="false" src={UploadPicVid} alt="" />
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        onChange={(event) => handleFileUpload(event, "image")}
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        maxfilesize={10000000}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                ) : null}
              </span>
            </div>
          ) : null}

          <div
            className={
              file === ""
                ? "chat-input-field"
                : "chat-input-field no-upload-options"
            }
          >
            <Form>
              <Form.Control
                ref={inputRef}
                value={messageSendData.Body}
                className="chat-message-input"
                name="ChatMessage"
                placeholder={t("Type-a-Message")}
                maxLength={200}
                onChange={chatMessageHandler}
                autoComplete="off"
                disabled={
                  talkStateData.ActiveChatData.isBlock === 1 ? true : false
                }
                autoFocus={inputChat}
                style={{ resize: "none", height: "100%" }} // Update the style of the input field
                as="textarea" // Use textarea instead of input for multi-line input
                rows={1} // Start with a single row
                onInput={autoResize} // Call autoResize function when input changes
                onKeyPress={(event) => {
                  // Check if the key pressed is "Enter" (keyCode 13) and trigger sendChat function
                  if (event.key === "Enter") {
                    event.preventDefault(); // Prevent the default behavior (e.g., new line)
                    sendChat(); // Call your sendChat function
                  }
                }}
              />
            </Form>
          </div>
          <div className="sendChat-click">
            <img
              draggable="false"
              onClick={sendChat}
              src={ChatSendIcon}
              alt=""
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ChatFooter;
