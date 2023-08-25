import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import VideoPanelBodyRecent from './videoPanelBodyRecent'
import VideoPanelBodyContact from './videoPanelBodyContact'

const VideoPanelBody = () => {
  const { videoFeatureReducer } = useSelector((state) => state)

  return (
    <>
      {videoFeatureReducer.ContactVideoFlag === true ? (
        <VideoPanelBodyContact />
      ) : null}
      {videoFeatureReducer.RecentVideoFlag === true ? (
        <VideoPanelBodyRecent />
      ) : null}
    </>
  )
}

export default VideoPanelBody
