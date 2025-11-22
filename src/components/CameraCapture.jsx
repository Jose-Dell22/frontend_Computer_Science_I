import React, { useRef, useEffect } from "react";

export default function CameraCapture({ videoRef, onCapture, onClose, isActive }) {
  const canvasRef = useRef();
  const streamRef = useRef(null);

  // Request camera permissions when component is active
  useEffect(() => {
    if (!isActive) {
      // Stop camera when component is inactive
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      return;
    }

    const startCamera = async () => {
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        streamRef.current = stream;

        // Assign stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Error accessing camera. Please allow camera permissions.");
        onClose();
      }
    };

    startCamera();

    // Cleanup function to stop camera when component unmounts or becomes inactive
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isActive, onClose]);

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
