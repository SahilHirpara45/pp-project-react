import React, { useState } from "react";

const PreviewFile = ({ file }) => {
  const [preview, setPreview] = useState(null);
  const reader = new FileReader();
  reader.readAsDataURL(file);

  const isFileImage = (file) => {
    return file && file["type"].split("/")[0] === "image";
  };

  reader.onload = () => {
    setPreview(isFileImage(file) ? reader.result : "/default.svg");
  };

  return (
    <div>
      <div className="mb-2">{file.name}</div>
      <img src={preview} alt="Preview" />
    </div>
  );
};

export default PreviewFile;
