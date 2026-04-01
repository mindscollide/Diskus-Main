import React from 'react'

/**
 * @component UploadFolder
 * @description A minimal file input that enables whole-folder selection in
 * supported browsers. The non-standard `webkitdirectory`, `mozdirectory`, and
 * `directory` attributes are set so that Chromium-based browsers and Firefox
 * open a directory picker instead of a file picker, allowing the user to select
 * an entire folder at once. The resulting `FileList` contains every file within
 * the chosen directory (including nested files in subdirectories).
 *
 * Note: The `webkitdirectory` attribute is non-standard and may not be supported
 * in all browsers. Always verify compatibility before relying on this component.
 *
 * @param {Function} onChangeFuc - `onChange` handler called with the input event
 *                                 when the user selects a folder. The event's
 *                                 `target.files` will contain the full FileList.
 *
 * @example
 * <UploadFolder onChangeFuc={handleFolderSelect} />
 */
const UploadFolder = ({ onChangeFuc }) => {
    return (
        <input type="file" onChange={onChangeFuc} webkitdirectory mozdirectory directory />
    )
}

export default UploadFolder