import React from "react";
import { useSelector } from "react-redux";
import MainChatWindow from "./talkMain/mainChatWindow";
import TalkChat2 from "./talkChatBox/chat";

const TalkNew = () => {
  const ChatBoxActiveFlag = useSelector(
    (state) => state.talkFeatureStates.ChatBoxActiveFlag
  );
  return (
    <>
      <MainChatWindow />
      {ChatBoxActiveFlag === true ? (
        <TalkChat2
          chatParentHead="chat-messenger-head"
          chatMessageClass="chat-messenger-head"
        />
      ) : null}
    </>
  );
};

export default TalkNew;
