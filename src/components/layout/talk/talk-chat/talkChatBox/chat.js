import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ChatFooter from './chatFooter/chatFooter'
import ChatHeader from './chatHeader/chatHeader'
import ChatMainBody from './chatMain/chatMain'

const TalkChat2 = ({ chatParentHead, chatMessageClass }) => {
  return (
    <>
      <div className="positionRelative">
        <div className={chatParentHead}>
          <Container>
            {/* <ChatHeader /> */}
            <ChatMainBody chatMessageClass={chatMessageClass} />
            {/* <ChatFooter /> */}
          </Container>
        </div>
      </div>
    </>
  )
}

export default TalkChat2
