import React from "react";
import { useSelector } from "react-redux";
import MainChatWindow from "./talkMain/mainChatWindow";
import TalkChat2 from "./talkChatBox/chat";

/**
 * @component TalkNew
 * @description Entry-point wrapper for the Talk messaging module. Renders the
 * main chat window sidebar (MainChatWindow) and conditionally mounts the
 * floating chat box (TalkChat2) when a conversation is active, as indicated by
 * the ChatBoxActiveFlag Redux state flag.
 */
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
