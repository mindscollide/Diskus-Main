import React, { useState } from "react";
import AvatarEditor from "react-avatar-edit";

function AvatarEditorComponent({ onCrop, onClose, onSave }) {
  const [preview, setPreview] = useState(null);

  const handleCrop = (preview) => {
    setPreview(preview);
  };

  const handleClose = () => {
    setPreview(null);
    onClose();
  };

  const handleSave = () => {
    onSave(preview);
    setPreview(null);
  };

  return (
    <div>
      <h2>Avatar Editor</h2>

      <div className="preview-container">
        <AvatarEditor
          width={250}
          height={250}
          onCrop={handleCrop} // Background color (white with 0.6 opacity)
        />
        {preview && <img src={preview} alt="Preview" />}
      </div>
      <div className="button-container">
        <button onClick={handleClose}>Close</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default AvatarEditorComponent;
