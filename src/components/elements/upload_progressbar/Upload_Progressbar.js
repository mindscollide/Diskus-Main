import React, { useState } from "react";

/**
 * @component UploadProgressBar
 * @description A basic standalone image upload utility component. Renders a file input
 * that, upon file selection, creates a local object URL and displays the chosen image
 * via an <img> tag. This component is self-contained with no props and is intended as
 * a simple image preview helper. Note: it does not yet implement an actual upload
 * progress indicator despite its name — it currently only previews the selected file
 * locally before any upload occurs.
 *
 * @state {string|undefined} file - Object URL of the selected image file, created via
 *   URL.createObjectURL(). Undefined until the user selects a file.
 *
 * @example
 * <UploadProgressBar />
 */
const UploadProgressBar = () => {
  const [file, setFile] = useState();
  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }
  return (
    <div className="App">
      <h2>Add Image:</h2>
      <input type="file" onChange={handleChange} />
      <img src={file} draggable="false" alt="" />
    </div>
  );
};

export default UploadProgressBar;
