import React, { useRef } from "react";

export default function CameraCapture({ videoRef, onCapture, onClose, isActive }) {
  const canvasRef = useRef();

  const handlePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const previewUrl = canvas.toDataURL("image/png");

    fetch(previewUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "camera_photo.png", { type: "image/png" });
        onCapture({
          previewUrl,
          file,
          source: "camera",
        });
        onClose();
      });
  };

  return (
    <div className="camera-box">
      {isActive && (
        <>
          <video ref={videoRef} autoPlay playsInline />

          <canvas ref={canvasRef} className="hidden" />

          <div className="camera-buttons">
            <button className="btn btn-main" onClick={handlePhoto}>
              Take Photo
            </button>

            <button className="btn" onClick={onClose}>
              Close Camera
            </button>
          </div>
        </>
      )}
    </div>
  );
}
