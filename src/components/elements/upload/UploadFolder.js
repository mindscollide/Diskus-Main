import React from 'react'

const UploadFolder = ({ onChangeFuc }) => {
    return (
        <input type="file" onChange={onChangeFuc} webkitdirectory mozdirectory directory />
    )
}

export default UploadFolder