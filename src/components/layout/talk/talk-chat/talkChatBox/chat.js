import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ChatMainBody from "./chatMain/chatMain";

const TalkChat2 = ({ chatParentHead, chatMessageClass }) => {
  return (
    <>
      <div className="positionRelative">
        <div className={chatParentHead}>
          <Container>
            <ChatMainBody chatMessageClass={chatMessageClass} />
          </Container>
        </div>
      </div>
    </>
  );
};

export default TalkChat2;
