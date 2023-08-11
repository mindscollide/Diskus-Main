import React from 'react'
import { useSelector } from 'react-redux'
import MainChatWindow from './talkMain/mainChatWindow'
import TalkChat2 from './talkChatBox/chat'

const TalkNew = () => {
  const { talkFeatureStates } = useSelector((state) => state)

  return (
    <>
      <MainChatWindow />
      {talkFeatureStates.ChatBoxActiveFlag === true ? <TalkChat2 /> : null}
    </>
  )
}

export default TalkNew
