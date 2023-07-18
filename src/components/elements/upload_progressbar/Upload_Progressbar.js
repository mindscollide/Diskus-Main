import React, { useState, useEffect } from 'react'

function UploadProgressBar() {
  const [width, setWidth] = useState(1)
  const [intervalId, setIntervalId] = useState(null)
  const elemRef = React.useRef(null)

  useEffect(() => {
    if (width >= 100) {
      clearInterval(intervalId)
    } else {
      setIntervalId(setInterval(frame, 100))
    }

    function frame() {
      setWidth((prevWidth) => prevWidth + 1)
      elemRef.current.style.width = `${width}%`
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [width, intervalId])

  function resetProgressBar() {
    setWidth(1)
    clearInterval(intervalId)
    elemRef.current.style.width = '1%'
  }
  const progressBar = () => { }
  return (
    <div>
      <div id="progress-bar" ref={elemRef} style={{ width: `${width}%` }}></div>
      <button onClick={progressBar}>Start Progress</button>
      <button onClick={resetProgressBar}>Reset Progress</button>
    </div>
  )
}

export default UploadProgressBar
