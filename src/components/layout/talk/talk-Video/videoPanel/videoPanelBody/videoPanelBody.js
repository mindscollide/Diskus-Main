import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import VideoPanelBodyRecent from './videoPanelBodyRecent'
import VideoPanelBodyContact from './videoPanelBodyContact'

const VideoPanelBody = () => {
  const { videoFeatureReducer } = useSelector((state) => state)

  return (
    <>
      {videoFeatureReducer.contactVideoFlag === true ? (
        <VideoPanelBodyContact />
      ) : null}
      {videoFeatureReducer.recentVideoFlag === true ? (
        <VideoPanelBodyRecent />
      ) : null}
    </>
  )
}

export default VideoPanelBody
