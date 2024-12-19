import React, { useState, useEffect } from "react";
import { Row, Col, Container, Form } from "react-bootstrap";
import { TextField } from "../../../../elements";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  addNewChatScreen,
  headerShowHideStatus,
  footerActionStatus,
  footerShowHideStatus,
  recentChatFlag,
  chatBoxActiveFlag,
} from "../../../../../store/actions/Talk_Feature_actions";
import {
  GetAllUsers,
  GetOTOUserMessages,
  activeChat,
} from "../../../../../store/actions/Talk_action";
import CloseChatIcon from "../../../../../assets/images/Cross-Chat-Icon.png";

const AddNewChat = () => {
  const { talkStateData } = useSelector((state) => state);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  //Current User ID
  let currentUserId = localStorage.getItem("userID");

  //Current Organization
  let currentOrganizationId = localStorage.getItem("organizationID");

  //all users states
  const [allUsers, setAllUsers] = useState([]);

  const [searchChatUserValue, setSearchChatUserValue] = useState("");

  const closeAddChat = () => {
    dispatch(addNewChatScreen(false));
    dispatch(footerActionStatus(false));
    dispatch(headerShowHideStatus(true));
    dispatch(footerShowHideStatus(true));
    dispatch(recentChatFlag(true));
  };

  const chatClickNewChat = (record) => {
    dispatch(chatBoxActiveFlag(true));
    localStorage.setItem("userNameChat", record.fullName);

    let newChatData = {
      admin: 0,
      attachmentLocation: "",
      companyName: record.companyName,
      fullName: record.fullName,
      id: record.id,
      imgURL: record.imgURL,
      isOnline: false,
      messageBody: "",
      messageDate: "",
      messageType: "O",
      notiCount: 0,
      receivedDate: "",
      seenDate: "",
      senderID: 0,
      sentDate: "",
    };
    let chatOTOData = {
      UserID: currentUserId,
      ChannelID: currentOrganizationId,
      OpponentUserId: record.id,
      NumberOfMessages: 50,
      OffsetMessage: 0,
    };
    dispatch(GetOTOUserMessages(navigate, chatOTOData, t));
    dispatch(activeChat(newChatData));
    setSearchChatUserValue("");
    dispatch(addNewChatScreen(false));
    dispatch(footerActionStatus(false));
    dispatch(headerShowHideStatus(true));
    dispatch(footerShowHideStatus(true));
    dispatch(recentChatFlag(true));
  };

  useEffect(() => {
    dispatch(
      GetAllUsers(
        navigate,
        parseInt(currentUserId),
        parseInt(currentOrganizationId),
        t
      )
    );
  }, []);
  let usersData = [
    {
      companyName: "Company9mrdu",
      corporateGroup: "GroupV25",
      email: "rRL5ZObs@test.org",
      fullName: "Emma Taylor Admin",
      id: 9560,
      imgURL: "T.jpg",
      isOnline: false,
    },
    {
      companyName: "Company6JQTa",
      corporateGroup: "GroupJP2",
      email: "SQkIPFc4@test.org",
      fullName: "Emma Johnson Admin",
      id: 4751,
      imgURL: "y.jpg",
      isOnline: true,
    },
    {
      companyName: "CompanyOZHFi",
      corporateGroup: "Groupo6b",
      email: "LNqdvvNt@mail.com",
      fullName: "Ali Doe Admin",
      id: 2834,
      imgURL: "3.jpg",
      isOnline: true,
    },
    {
      companyName: "CompanyhTcja",
      corporateGroup: "GrouppSG",
      email: "cI5cATuh@test.org",
      fullName: "Jane Mamdani Admin",
      id: 3532,
      imgURL: "6.jpg",
      isOnline: true,
    },
    {
      companyName: "CompanyUPD9t",
      corporateGroup: "GroupXz6",
      email: "1uE4hBY1@example.com",
      fullName: "Sara Doe Admin",
      id: 8206,
      imgURL: "W.jpg",
      isOnline: true,
    },
    {
      companyName: "CompanyVa668",
      corporateGroup: "Group5AL",
      email: "K9yeezF7@yopmail.com",
      fullName: "Sara Smith Admin",
      id: 8150,
      imgURL: "x.jpg",
      isOnline: false,
    },
    {
      companyName: "CompanynzwA6",
      corporateGroup: "",
      email: "4Xm8I2Bl@example.com",
      fullName: "Mike Mamdani Admin",
      id: 7212,
      imgURL: "I.jpg",
      isOnline: false,
    },
    {
      companyName: "Company8Mc3l",
      corporateGroup: "",
      email: "8QcdTVIY@mail.com",
      fullName: "Sara Taylor Admin",
      id: 3919,
      imgURL: "X.jpg",
      isOnline: false,
    },
    {
      companyName: "CompanyisqSC",
      corporateGroup: "",
      email: "0nHOhyWB@example.com",
      fullName: "Mike Mamdani Admin",
      id: 2127,
      imgURL: "E.jpg",
      isOnline: false,
    },
    {
      companyName: "Companyl3u1a",
      corporateGroup: "",
      email: "JNMOdIhF@yopmail.com",
      fullName: "Emma Taylor Admin",
      id: 9399,
      imgURL: "8.jpg",
      isOnline: true,
    },
    {
      companyName: "CompanyYlDGw",
      corporateGroup: "Groupx3A",
      email: "Ywz5ydJ1@example.com",
      fullName: "Mike Lee Admin",
      id: 6173,
      imgURL: "8.jpg",
      isOnline: false,
    },
    {
      companyName: "CompanyydhYr",
      corporateGroup: "Grouprqk",
      email: "pUE7ppxQ@example.com",
      fullName: "Sara Smith Admin",
      id: 7859,
      imgURL: "J.jpg",
      isOnline: true,
    },
    {
      companyName: "Company4kBKA",
      corporateGroup: "Group5rJ",
      email: "J2SYZ8Kx@yopmail.com",
      fullName: "Mike Doe Admin",
      id: 6446,
      imgURL: "J.jpg",
      isOnline: false,
    },
    {
      companyName: "Company0XsTI",
      corporateGroup: "GroupBn2",
      email: "EEk8pxQv@mail.com",
      fullName: "Emma Johnson Admin",
      id: 8309,
      imgURL: "1.jpg",
      isOnline: true,
    },
    {
      companyName: "CompanysnPSP",
      corporateGroup: "",
      email: "bC6EyFVX@example.com",
      fullName: "New Doe Admin",
      id: 9980,
      imgURL: "F.jpg",
      isOnline: true,
    },
    {
      companyName: "CompanyGEhP8",
      corporateGroup: "GroupY21",
      email: "JbKqmulm@example.com",
      fullName: "Jane Mamdani Admin",
      id: 5362,
      imgURL: "y.jpg",
      isOnline: true,
    },
    {
      companyName: "CompanyHdNWo",
      corporateGroup: "",
      email: "oJeIVAnn@mail.com",
      fullName: "Jane Lee Admin",
      id: 2029,
      imgURL: "J.jpg",
      isOnline: false,
    },
    {
      companyName: "CompanyOiTYF",
      corporateGroup: "",
      email: "z1RWotsO@example.com",
      fullName: "Ali Taylor Admin",
      id: 8589,
      imgURL: "x.jpg",
      isOnline: false,
    },
    {
      companyName: "CompanyTpzQy",
      corporateGroup: "GroupGx5",
      email: "7BDdWR1X@yopmail.com",
      fullName: "Mike Brown Admin",
      id: 1659,
      imgURL: "3.jpg",
      isOnline: false,
    },
    {
      companyName: "CompanyaeAEq",
      corporateGroup: "GroupaPJ",
      email: "zfEdFTl4@yopmail.com",
      fullName: "Mike Smith Admin",
      id: 4422,
      imgURL: "c.jpg",
      isOnline: false,
    },
  ];

  //Setting state data of all users
  useEffect(() => {
    if (
      talkStateData.AllUsers.AllUsersData !== undefined &&
      talkStateData.AllUsers.AllUsersData !== null &&
      talkStateData.AllUsers.AllUsersData.length !== 0
    ) {
      setAllUsers(talkStateData.AllUsers.AllUsersData.allUsers);
    }
  }, [talkStateData?.AllUsers?.AllUsersData?.allUsers]);

  const searchChatUsers = (e) => {
    setSearchChatUserValue(e);
    try {
      if (
        talkStateData.AllUsers.AllUsersData !== undefined &&
        talkStateData.AllUsers.AllUsersData !== null &&
        talkStateData.AllUsers.AllUsersData.length !== 0
      ) {
        if (e !== "") {
          let filteredData =
            talkStateData.AllUsers.AllUsersData.allUsers.filter((value) => {
              return value.fullName.toLowerCase().includes(e.toLowerCase());
            });
          if (filteredData.length === 0) {
            setAllUsers(talkStateData.AllUsers.AllUsersData.allUsers);
          } else {
            setAllUsers(filteredData);
          }
        } else if (e === "" || e === null) {
          let data = talkStateData.AllUsers.AllUsersData.allUsers;
          setSearchChatUserValue("");
          setAllUsers(data);
        }
      }
    } catch {}
  };

  return (
    <>
      <Container>
        <Row className='margin-top-10'>
          <Col lg={11} md={11} sm={12}>
            <div className='new-chat'>
              <p className='fw-bold m-0'>{t("New Conversation")}</p>
            </div>
          </Col>

          <Col lg={1} md={1} sm={12} className='p-0'>
            <div className='close-addChat-filter' onClick={closeAddChat}>
              <img draggable='false' src={CloseChatIcon} />
            </div>
          </Col>
        </Row>
        <Row className='margin-top-10'>
          <Col lg={12} md={12} sm={12}>
            <TextField
              maxLength={200}
              applyClass='form-control2'
              name='Name'
              change={(e) => {
                searchChatUsers(e.target.value);
              }}
              value={searchChatUserValue}
              labelclass={"d-none"}
            />
          </Col>
        </Row>
      </Container>
      <Container>
        {allUsers !== undefined && allUsers !== null && allUsers.length > 0
          ? allUsers
              .sort((a, b) => a.fullName.localeCompare(b.fullName))
              .map((dataItem, index) => {
                return (
                  <Row className='single-chat' key={index}>
                    <Col lg={2} md={2} sm={2} className='bottom-border'>
                      <div className='chat-profile-icon'>
                        {/* User Icon */}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='31.188'
                          height='31.186'
                          viewBox='0 0 31.188 31.186'>
                          <g
                            id='Group_1683'
                            data-name='Group 1683'
                            transform='translate(-189.415 78.235)'>
                            <path
                              id='Path_594'
                              data-name='Path 594'
                              d='M220.6-47.049H218.18a13.038,13.038,0,0,0-4.892-10.2,12.728,12.728,0,0,0-8.892-2.939,12.681,12.681,0,0,0-6.291,1.95,13.229,13.229,0,0,0-4.581,4.787,13.087,13.087,0,0,0-1.674,6.385h-2.434a15.387,15.387,0,0,1,2.885-9.01,15.6,15.6,0,0,1,7.585-5.709c-.09-.076-.145-.129-.207-.175a8.863,8.863,0,0,1-3.339-9.641,8.764,8.764,0,0,1,6.6-6.379c.477-.127.975-.171,1.464-.254h1.218c.489.083.987.128,1.464.254a8.694,8.694,0,0,1,6.591,6.382A8.679,8.679,0,0,1,211-62.5c-.261.247-.554.459-.854.705.09.041.151.073.215.1a15.292,15.292,0,0,1,5.562,3.519,15.27,15.27,0,0,1,4.436,8.416c.1.6.164,1.2.244,1.8ZM205.008-75.8a6.6,6.6,0,0,0-6.576,6.563,6.6,6.6,0,0,0,6.579,6.591,6.6,6.6,0,0,0,6.576-6.563A6.6,6.6,0,0,0,205.008-75.8Z'
                              fill='#fff'
                            />
                          </g>
                        </svg>
                      </div>
                    </Col>
                    <Col lg={10} md={10} sm={10} className='bottom-border'>
                      <div
                        className={"chat-block add-user-section"}
                        onClick={() => chatClickNewChat(dataItem)}>
                        <p className='chat-username m-0'>{dataItem.fullName}</p>
                      </div>
                    </Col>
                  </Row>
                );
              })
          : null}
      </Container>
    </>
  );
};

export default AddNewChat;
