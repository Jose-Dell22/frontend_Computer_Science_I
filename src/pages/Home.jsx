import React, { useRef, useState } from "react";
import UploadImage from "../components/UploadImage";
import CameraCapture from "../components/CameraCapture";
import PredictionResults from "../components/PredictionResults";
import Loading from "../components/Loading";
import ModelSelector from "../components/ModelSelector";
import { API_BASE_URL } from "../config/api";

export default function Home() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState(null);
  const [segmentImage, setSegmentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("efficientnet");
  const [imageSource, setImageSource] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const videoRef = useRef();

  const resetAllStates = () => {
    setPreview(null);
    setSelectedFile(null);
    setResults(null);
    setImageSource(null);
    setSegmentImage(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleIncomingImage = ({ previewUrl, file, source }) => {
    setPreview(previewUrl);
    setSelectedFile(file);
    setResults(null);
    setImageSource(source);
    setIsCameraActive(false);
    setSegmentImage(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleReset = () => {
    resetAllStates();
  };

  const handleApiRequest = async (endpoint, errorMessage, onSuccess) => {
    if (!selectedFile) return alert("No file to send.");

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("model", model);

    try {
      const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || errorMessage);
        setResults(null);
        setLoading(false);
        return;
      }

      onSuccess(data);
      setLoading(false);
    } catch (error) {
      setErrorMessage(errorMessage);
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    await handleApiRequest(
      "predict",
      "Error, could not predict",
      (data) => {
        setResults(data.top3 || []);
        if (data.inserted_id) {
          setSuccessMessage(`Prediction saved with ID: ${data.inserted_id}`);
        }
      }
    );
  };

  const handleSegment = async () => {
    await handleApiRequest(
      "segment",
      "Error, could not segment",
      (data) => {
        setSegmentImage(`${API_BASE_URL}/uploads/segmented/${data.segmented_image}`);
        if (data.segmented_id) {
          setSuccessMessage(`Segmented image saved with ID: ${data.segmented_id}`);
        }
      }
    );
  };

  return (
    <div className="home-wrapper">
      <div className="page-container">

        <h1>AI for Tomato Classification and Segmentation</h1>

        {preview && (
          <ModelSelector
            show={true}
            model={model}
            setModel={setModel}
            showDelete={false}
          />
        )}

        <UploadImage
          onUpload={handleIncomingImage}
          imageSource={imageSource}
        />

        <div className="text-center mb-4">
          <button
            onClick={() => {
              resetAllStates();
              setIsCameraActive(true);
            }}
            className="btn btn-main"
          >
            Activate Camera
          </button>
        </div>

        <CameraCapture
          videoRef={videoRef}
          isActive={isCameraActive}
          onCapture={(data) =>
            handleIncomingImage({
              ...data,
              source: "camera",
            })
          }
          onClose={() => setIsCameraActive(false)}
        />

        {!isCameraActive && preview && (
          <>
            <p className="text-center mt-2">
              Image selected from:{" "}
              <strong>{imageSource === "camera" ? "Camera" : "File"}</strong>
            </p>

            <div className="preview-wrapper">
              <img src={preview} alt="preview" className="preview-image" />
            </div>
          </>
        )}

        {errorMessage && (
          <div className="alert alert-danger text-center">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success text-center">
            {successMessage}
          </div>
        )}

        <PredictionResults
          results={results}
          hasImage={Boolean(preview)}
          onPredict={handlePredict}
          onSegment={handleSegment}
        />

        {segmentImage && (
          <div className="text-center mt-4">
            <h3>Segmented Image</h3>
            <div className="preview-wrapper">
              <img
                src={segmentImage}
                alt="Segmented"
                className="preview-image"
              />
            </div>
          </div>
        )}

        {(results || segmentImage) && (
          <div className="text-center mt-4">
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        )}

        {loading && <Loading />}
      </div>
    </div>
  );
}
