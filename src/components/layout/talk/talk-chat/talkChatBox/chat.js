import React from "react";
import ChatMainBody from "./chatMain/chatMain";

const TalkChat2 = ({ chatParentHead, chatMessageClass }) => {
  return (
    <>
      <div className='positionRelative'>
        <div className={chatParentHead}>
          <ChatMainBody chatMessageClass={chatMessageClass} />
        </div>
      </div>
    </>
  );
};

export default TalkChat2;
