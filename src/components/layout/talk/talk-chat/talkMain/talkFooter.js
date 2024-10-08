import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addNewChatScreen,
  createGroupScreen,
  createShoutAllScreen,
  headerShowHideStatus,
  footerShowHideStatus,
  footerActionStatus,
  recentChatFlag,
  privateGroupChatFlag,
  shoutallChatFlag,
  privateChatFlag,
} from '../../../../../store/actions/Talk_Feature_actions'
import { Row, Col, Container } from 'react-bootstrap'
import AddChatIcon from '../../../../../assets/images/Add-Plus-Icon.png'

const TalkFooter = () => {
  const dispatch = useDispatch()

  const { talkFeatureStates } = useSelector((state) => state)

  const createBehaviorAction = () => {
    if (talkFeatureStates.RecentChatsFlag === true) {
      dispatch(createGroupScreen(false))
      dispatch(createShoutAllScreen(false))
      dispatch(headerShowHideStatus(false))
      dispatch(footerShowHideStatus(false))
      dispatch(recentChatFlag(false))
      dispatch(footerActionStatus(true))
      dispatch(addNewChatScreen(true))
    } else if (talkFeatureStates.PrivateChatsFlag === true) {
      dispatch(createGroupScreen(false))
      dispatch(createShoutAllScreen(false))
      dispatch(headerShowHideStatus(false))
      dispatch(footerShowHideStatus(false))
      dispatch(recentChatFlag(false))
      dispatch(privateChatFlag(false))
      dispatch(footerActionStatus(true))
      dispatch(addNewChatScreen(true))
    } else if (talkFeatureStates.PrivateGroupChatsFlag === true) {
      dispatch(createShoutAllScreen(false))
      dispatch(addNewChatScreen(false))
      dispatch(headerShowHideStatus(false))
      dispatch(footerShowHideStatus(false))
      dispatch(privateGroupChatFlag(false))
      dispatch(footerActionStatus(true))
      dispatch(createGroupScreen(true))
    } else if (talkFeatureStates.ShoutAllMessageFlag === true) {
      dispatch(addNewChatScreen(false))
      dispatch(createGroupScreen(false))
      dispatch(headerShowHideStatus(false))
      dispatch(footerShowHideStatus(false))
      dispatch(shoutallChatFlag(false))
      dispatch(footerActionStatus(true))
      dispatch(createShoutAllScreen(true))
    }
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <div className="add-chat" onClick={createBehaviorAction}>
              <img draggable="false" src={AddChatIcon} alt="" />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default TalkFooter
