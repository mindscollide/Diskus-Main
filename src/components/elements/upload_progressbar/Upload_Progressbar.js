import React, { useState } from "react";

const UploadProgressBar = () => {
  const [file, setFile] = useState();
  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }
  const progressBar = () => {};
  return (
    <div className="App">
      <h2>Add Image:</h2>
      <input type="file" onChange={handleChange} />
      <img src={file} draggable="false" />
    </div>
  );
};

export default UploadProgressBar;
