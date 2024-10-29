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
  const ChatBoxActiveFlag = useSelector(
    (state) => state.talkFeatureStates.ChatBoxActiveFlag
  );
  const HeaderShowStatus = useSelector(
    (state) => state.talkFeatureStates.HeaderShowStatus
  );
  const RecentChatsFlag = useSelector(
    (state) => state.talkFeatureStates.RecentChatsFlag
  );
  const AddNewChatScreen = useSelector(
    (state) => state.talkFeatureStates.AddNewChatScreen
  );
  const PrivateChatsFlag = useSelector(
    (state) => state.talkFeatureStates.PrivateChatsFlag
  );
  const PrivateGroupChatsFlag = useSelector(
    (state) => state.talkFeatureStates.PrivateGroupChatsFlag
  );
  const CreateGroupScreen = useSelector(
    (state) => state.talkFeatureStates.CreateGroupScreen
  );
  const StarredMessageFlag = useSelector(
    (state) => state.talkFeatureStates.StarredMessageFlag
  );
  const ShoutAllMessageFlag = useSelector(
    (state) => state.talkFeatureStates.ShoutAllMessageFlag
  );
  const CreateShoutAllScreen = useSelector(
    (state) => state.talkFeatureStates.CreateShoutAllScreen
  );
  const BlockedUsersFlag = useSelector(
    (state) => state.talkFeatureStates.BlockedUsersFlag
  );
  const FooterShowStatus = useSelector(
    (state) => state.talkFeatureStates.FooterShowStatus
  );
  return (
    <>
      <div
        className={ChatBoxActiveFlag === true ? "chatBox height" : "chatBox"}
      >
        <Container>
          <div className="chat-inner-content">
            {/* <span className="triangle-overlay-chat" />
            <Triangle className="pointer-chat-icon" /> */}
            {HeaderShowStatus === true ? <TalkHeader /> : null}
            {RecentChatsFlag === true ? <RecentChats /> : null}
            {AddNewChatScreen === true ? <AddNewChat /> : null}
            {PrivateChatsFlag === true ? <PrivateChats /> : null}
            {PrivateGroupChatsFlag === true ? <PrivateGroups /> : null}
            {CreateGroupScreen === true ? <CreateNewGroup /> : null}
            {StarredMessageFlag === true ? <StarredMessagesList /> : null}
            {ShoutAllMessageFlag === true ? <ShoutAll /> : null}
            {CreateShoutAllScreen === true ? <CreateNewShoutAll /> : null}
            {BlockedUsersFlag === true ? <BlockedUsersList /> : null}
            {FooterShowStatus === true ? <TalkFooter /> : null}
          </div>
        </Container>
      </div>
    </>
  );
};

export default MainChatWindow;
