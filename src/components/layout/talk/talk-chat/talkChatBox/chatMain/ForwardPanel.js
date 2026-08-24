import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { Checkbox } from "antd";
import { TextField, Button } from "../../../../../elements";
import CloseChatIcon from "../../../../../../assets/images/Cross-Chat-Icon.png";
import SingleIcon from "../../../../../../assets/images/Single-Icon.png";
import GroupIcon from "../../../../../../assets/images/Group-Icon.png";
import ShoutIcon from "../../../../../../assets/images/Shout-Icon.png";

const ForwardPanel = ({
  forwardUsersChecked,
  setForwardUsersChecked,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { talkStateData } = useSelector((state) => state);

  const [allUsersGroupsRooms, setAllUsersGroupsRooms] = useState([]);
  const [searchUserValue, setSearchUserValue] = useState("");

  // Populated by whichever component fetches GetAllUsersGroupsRoomsList on
  // Talk-feature mount; this panel only mounts while activePanel === "forward"
  // so it always syncs fresh from whatever is already in Redux on open.
  useEffect(() => {
    if (
      talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData !==
        undefined &&
      talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData !==
        null &&
      talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData
        .length !== 0
    ) {
      setAllUsersGroupsRooms(
        talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData
          .userInformation,
      );
    }
  }, [
    talkStateData?.AllUsersGroupsRoomsList?.AllUsersGroupsRoomsListData
      ?.userInformation,
  ]);

  const searchUsers = (e) => {
    setSearchUserValue(e);
    try {
      if (
        talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData !==
          undefined &&
        talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData !==
          null &&
        talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData
          .length !== 0
      ) {
        if (e !== "") {
          let filteredData =
            talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData.userInformation.filter(
              (value) => {
                return value.name.toLowerCase().includes(e.toLowerCase());
              },
            );
          if (filteredData.length === 0) {
            setAllUsersGroupsRooms(
              talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData
                .userInformation,
            );
          } else {
            setAllUsersGroupsRooms(filteredData);
          }
        } else if (e === "" || e === null) {
          let data =
            talkStateData.AllUsersGroupsRoomsList.AllUsersGroupsRoomsListData
              .userInformation;
          setSearchUserValue("");
          setAllUsersGroupsRooms(data);
        }
      }
    } catch {}
  };

const forwardUsersCheckedHandler = (data) => {
  setForwardUsersChecked((prev) => {
    const exists = prev.some((user) => user.id === data.id);

    return exists
      ? prev.filter((user) => user.id !== data.id)
      : [...prev, data];
  });
};

  return (
    <>
      <Row className="mt-1">
        <Col lg={6} md={6} sm={12}>
          <p className="fw-bold">{t("Forward-to")}</p>
        </Col>
        <Col lg={6} md={6} sm={12} className="text-end">
          <img
            draggable="false"
            onClick={onCancel}
            src={CloseChatIcon}
            alt=""
            width={10}
            className="cursor-pointer"
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} style={{ marginBottom: "10px" }}>
          <TextField
            maxLength={200}
            applyClass="form-control2"
            name="Name"
            change={(e) => {
              searchUsers(e.target.value);
            }}
            value={searchUserValue}
            placeholder={t("Search-users")}
            labelclass={"d-none"}
          />
        </Col>
      </Row>
      <div className="users-list-forward">
        {allUsersGroupsRooms !== undefined &&
        allUsersGroupsRooms !== null &&
        allUsersGroupsRooms.length > 0
          ? allUsersGroupsRooms.map((dataItem, index) => {
              return (
                <Row style={{ alignItems: "center" }}>
                  <Col lg={2} md={2} sm={2} style={{ paddingTop: "5px" }}>
                    <Checkbox
                      checked={forwardUsersChecked.some(
                        (user) => user.id === dataItem.id,
                      )}
                      onChange={() => forwardUsersCheckedHandler(dataItem)}
                      className=""
                    />
                  </Col>
                  <Col lg={10} md={10} sm={10}>
                    <div className="users-forward">
                      <div className="chat-profile-icon forward">
                        {dataItem.messageType === "O" ? (
                          <>
                            <img
                              draggable="false"
                              src={SingleIcon}
                              width={15}
                              alt=""
                            />
                          </>
                        ) : dataItem.messageType === "G" ? (
                          <>
                            <img
                              draggable="false"
                              src={GroupIcon}
                              width={15}
                              alt=""
                            />
                          </>
                        ) : dataItem.messageType === "B" ? (
                          <>
                            <img
                              draggable="false"
                              src={ShoutIcon}
                              width={15}
                              alt=""
                            />
                          </>
                        ) : (
                          <img
                            draggable="false"
                            src={SingleIcon}
                            width={15}
                            alt=""
                          />
                        )}
                      </div>
                      <p className=" m-0">{dataItem.name}</p>
                    </div>
                  </Col>
                </Row>
              );
            })
          : null}
      </div>
      <Row>
        <Col className="text-center">
          <Button
            className=" Ok-btn forward-user"
            text={t("Forward")}
            onClick={onSubmit}
            disableBtn={forwardUsersChecked.length > 0 ? false : true}
          />
        </Col>
      </Row>
    </>
  );
};

export default ForwardPanel;
