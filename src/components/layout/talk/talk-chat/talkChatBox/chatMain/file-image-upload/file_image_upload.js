import React from 'react'
import CrossIcon from '../../../../../../../assets/images/Cross-Icon.png'

const FileImageUpload = ({ file, removeFileFunction }) => {
  return (
    <>
      <div className="removeImage-thumbnail">
        <img draggable="false" onClick={removeFileFunction} src={CrossIcon} />
      </div>
      <div className="image-thumbnail">
        <img draggable="false" className="img-cover thumbnailImage" src={file} />
      </div>
    </>
  )
}

export default FileImageUpload
