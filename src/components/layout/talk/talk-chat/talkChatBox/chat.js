import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ChatFooter from './chatFooter/chatFooter'
import ChatHeader from './chatHeader/chatHeader'
import ChatMainBody from './chatMain/chatMain'

const TalkChat2 = ({ chatMessageClass }) => {
  return (
    <>
      <div className="positionRelative">
        <div className={chatMessageClass}>
          <Container>
            {/* <ChatHeader /> */}
            <ChatMainBody />
            {/* <ChatFooter /> */}
          </Container>
        </div>
      </div>
    </>
  )
}

export default TalkChat2
