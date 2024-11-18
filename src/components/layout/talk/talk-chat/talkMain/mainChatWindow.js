import React from "react";
import { useSelector } from "react-redux";
import TalkHeader from "./talkHeader";
import { Triangle } from "react-bootstrap-icons";
import { Container } from "react-bootstrap";
import TalkFooter from "./talkFooter";
import AddNewChat from "../recentChats/addNewChats";
import CreateNewGroup from "../privateGroups/createNewGroup";
import CreateNewShoutAll from "../shoutAll/createShoutAll";
import RecentChats from "../recentChats/recentChats";
import PrivateChats from "../privateChats/privateChats";
import PrivateGroups from "../privateGroups/privateGroups";
import StarredMessagesList from "../starredMessages/starredMessagesList";
import ShoutAll from "../shoutAll/shoutAll";
import BlockedUsersList from "../blockedUsers/blockedUsersList";

const MainChatWindow = () => {
  const { talkFeatureStates } = useSelector((state) => state);

  return (
    <>
      <div
        className={
          talkFeatureStates.ChatBoxActiveFlag === true
            ? "chatBox height"
            : "chatBox"
        }
      >
        <Container>
          <div className="chat-inner-content">
            {/* <span className="triangle-overlay-chat" />
            <Triangle className="pointer-chat-icon" /> */}
            {talkFeatureStates.HeaderShowStatus === true ? (
              <TalkHeader />
            ) : null}
            {talkFeatureStates.RecentChatsFlag === true ? (
              <RecentChats />
            ) : null}
            {talkFeatureStates.AddNewChatScreen === true ? (
              <AddNewChat />
            ) : null}
            {talkFeatureStates.PrivateChatsFlag === true ? (
              <PrivateChats />
            ) : null}
            {talkFeatureStates.PrivateGroupChatsFlag === true ? (
              <PrivateGroups />
            ) : null}
            {talkFeatureStates.CreateGroupScreen === true ? (
              <CreateNewGroup />
            ) : null}
            {talkFeatureStates.StarredMessageFlag === true ? (
              <StarredMessagesList />
            ) : null}
            {talkFeatureStates.ShoutAllMessageFlag === true ? (
              <ShoutAll />
            ) : null}
            {talkFeatureStates.CreateShoutAllScreen === true ? (
              <CreateNewShoutAll />
            ) : null}
            {talkFeatureStates.BlockedUsersFlag === true ? (
              <BlockedUsersList />
            ) : null}
            {talkFeatureStates.FooterShowStatus === true ? (
              <TalkFooter />
            ) : null}
          </div>
        </Container>
      </div>
    </>
  );
};

export default MainChatWindow;
