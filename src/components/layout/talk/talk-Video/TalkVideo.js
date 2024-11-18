import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import VideoPanel from './videoPanel/videoPanel'

const TalkVideo = () => {
  const { videoFeatureReducer } = useSelector((state) => state)

  return (
    <>{videoFeatureReducer.VideoChatPanel === true ? <VideoPanel /> : null}</>
  )
}

export default TalkVideo
