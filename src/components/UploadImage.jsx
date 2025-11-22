import React, { useRef } from "react";

export default function UploadImage({ onUpload, imageSource }) {
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    onUpload({
      previewUrl,
      file,
      source: "upload",
    });
  };

  return (
    <div className="upload-wrapper">
      <button
        className="btn btn-main"
        onClick={() => {
          inputRef.current.value = null; 
          inputRef.current.click();
        }}
      >
        Upload Image
      </button>

      <span className="upload-text">
        {imageSource === "camera"
          ? "You took a photo"
          : imageSource === "upload"
          ? "You uploaded an image"
          : "Select an image"}
      </span>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
