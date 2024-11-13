import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Container, Form } from "react-bootstrap";
import { TextField, Button } from "../../../../elements";
import { Checkbox } from "antd";
import {
  headerShowHideStatus,
  footerActionStatus,
  footerShowHideStatus,
  shoutallChatFlag,
  createShoutAllScreen,
} from "../../../../../store/actions/Talk_Feature_actions";
import {
  CreateShoutAll,
  GetAllUsers,
} from "../../../../../store/actions/Talk_action";
import CloseChatIcon from "../../../../../assets/images/Cross-Chat-Icon.png";

const CreateNewShoutAll = () => {
  const { talkStateData } = useSelector((state) => state);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  //Current User ID
  let currentUserId = localStorage.getItem("userID");

  //Current Organization
  let currentOrganizationId = localStorage.getItem("organizationID");

  //Create Group Participant Check
  const [noParticipant, setNoParticipant] = useState(false);

  //all users states
  const [allUsers, setAllUsers] = useState([]);

  //Shout Name State for Creation/Modification
  const [shoutNameValue, setShoutNameValue] = useState("");

  //search shout all user states
  const [searchShoutAllUserValue, setSearchShoutAllUserValue] = useState("");

  //Shout All Users Checked
  const [shoutAllUsersChecked, setShoutAllUsersChecked] = useState([]);

  const closeAddShoutAllScreen = async () => {
    await dispatch(createShoutAllScreen(false));
    await dispatch(footerActionStatus(false));
    await dispatch(headerShowHideStatus(true));
    await dispatch(footerShowHideStatus(true));
    await dispatch(shoutallChatFlag(true));
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

  //Search Shout All User
  const searchShoutAllUserUser = (values) => {
    try{
      if (values !== "") {
        setSearchShoutAllUserValue(values);
        let filteredData =
          talkStateData?.AllUsers?.AllUsersData?.allUsers?.filter((value) => {
            return value.fullName
              .toLowerCase()
              .includes(searchShoutAllUserValue.toLowerCase());
          });
          let dataFilteredData=filteredData?filteredData:[]
        if (dataFilteredData.length === 0) {
          setAllUsers(talkStateData?.AllUsers?.AllUsersData?.allUsers);
        } else {
          setAllUsers(dataFilteredData);
        }
      } else if (values === "" || values === null) {
        let data = talkStateData?.AllUsers?.AllUsersData?.allUsers;
        setSearchShoutAllUserValue("");
        setAllUsers(data);
      }
    }catch(error){
      console.error(error)
    }
   
  };

  //On Change Shout All Users
  const shoutAllUsersCheckedHandler = (data, id, index) => {
    if (shoutAllUsersChecked.includes(id)) {
      let groupUserIndex = shoutAllUsersChecked.findIndex(
        (data2, index) => data2 === id
      );
      if (groupUserIndex !== -1) {
        shoutAllUsersChecked.splice(groupUserIndex, 1);
        setShoutAllUsersChecked([...shoutAllUsersChecked]);
      }
    } else {
      shoutAllUsersChecked.push(id);
      setShoutAllUsersChecked([...shoutAllUsersChecked]);
    }
  };

  const createShoutAllList = () => {
    if (shoutAllUsersChecked.length === 0) {
      setNoParticipant(true);
    } else {
      setNoParticipant(false);
      let Data = {
        TalkRequest: {
          UserID: parseInt(currentUserId),
          ChannelID: parseInt(currentOrganizationId),
          Group: {
            GroupName: shoutNameValue,
            Users: shoutAllUsersChecked.toString(),
          },
        },
      };
      dispatch(CreateShoutAll(navigate, Data, t));
      dispatch(createShoutAllScreen(false));
      dispatch(footerActionStatus(false));
      dispatch(headerShowHideStatus(true));
      dispatch(footerShowHideStatus(true));
      dispatch(shoutallChatFlag(true));
    }
  };

  return (
    <>
      <Container>
        <Row className="margin-top-10">
          <Col lg={11} md={11} sm={12}>
            <div className="new-chat">
              <p className="fw-bold m-0">Create a new Shout</p>
            </div>
          </Col>

          <Col lg={1} md={1} sm={12} className="p-0">
            <div
              className="close-addChat-filter"
              onClick={closeAddShoutAllScreen}
            >
              <img draggable="false" src={CloseChatIcon} />
            </div>
          </Col>
        </Row>
        <Row className="margin-top-10">
          <Col lg={12} md={12} sm={12}>
            <TextField
              maxLength={200}
              applyClass="form-control2"
              name="Name"
              placeholder={"List Name"}
              change={(e) => {
                setShoutNameValue(e.target.value);
              }}
              value={shoutNameValue}
              labelclass={"d-none"}
            />
          </Col>
        </Row>
        <Row className="margin-top-5">
          <Col lg={12} md={12} sm={12}>
            <TextField
              maxLength={200}
              applyClass="form-control2"
              name="Name"
              placeholder={t("Search-User")}
              change={(e) => {
                searchShoutAllUserUser(e.target.value);
              }}
              value={searchShoutAllUserValue}
              labelclass={"d-none"}
            />
          </Col>
        </Row>
      </Container>
      <Container>
        <div className="add-group-members-list">
          {allUsers !== undefined && allUsers !== null && allUsers.length > 0
            ? allUsers.map((dataItem, index) => {
                return (
                  <Row className="single-user">
                    <Col lg={2} md={2} sm={2}>
                      <div className="user-profile-icon">
                        {/* User Icon */}
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
                        {/* <span className="user-active-status-group"></span> */}
                      </div>
                    </Col>
                    <Col lg={8} md={8} sm={8}>
                      <div className={"group-add-user"}>
                        <p className="chat-username-group m-0">
                          {dataItem.fullName}
                        </p>
                        <span>{dataItem.companyName}</span>
                      </div>
                    </Col>
                    <Col lg={2} md={2} sm={2}>
                      <Checkbox
                        checked={
                          shoutAllUsersChecked.includes(dataItem.id)
                            ? true
                            : false
                        }
                        onChange={() =>
                          shoutAllUsersCheckedHandler(
                            dataItem,
                            dataItem.id,
                            index
                          )
                        }
                        className="chat-message-checkbox-group"
                      />
                    </Col>
                  </Row>
                );
              })
            : null}
        </div>
      </Container>
      <Container>
        <Row>
          <Col className="text-center">
            {noParticipant === true ? (
              <p className="participant-warning m-0">
                {t("At-least-add-one-participant")}
              </p>
            ) : null}
            <Button
              className=" Ok-btn forward-user"
              text={t("Create-Shout")}
              onClick={createShoutAllList}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateNewShoutAll;
