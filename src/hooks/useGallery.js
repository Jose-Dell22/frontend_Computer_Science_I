import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const transformImages = (data) => {
  if (!data || (!data.classifications && !data.segmentations)) {
    return [];
  }

  const classifications = data.classifications || [];
  const segmentations = data.segmentations || [];
  
  const segmentationMap = new Map();
  segmentations.forEach(seg => {
    if (seg.original?.filename) {
      segmentationMap.set(seg.original.filename, seg);
    }
  });

  const transformedImages = classifications.map(classification => {
    const originalFilename = classification.filename;
    const segmentation = segmentationMap.get(originalFilename);
    const prediction = classification.top3?.[0]?.label || "N/A";

    return {
      id: String(classification._id || classification.id || ''),
      type: 'original',
      original_url: `${API_BASE_URL}/uploads/originals/${originalFilename}`,
      segmented_url: segmentation?.segmented?.filename
        ? `${API_BASE_URL}/uploads/segmented/${segmentation.segmented.filename}`
        : null,
      segmented_id: segmentation ? String(segmentation._id || segmentation.id || '') : null,
      prediction: prediction,
      created_at: classification.created_at
    };
  });

  segmentations.forEach(seg => {
    if (seg.original?.filename) {
      const hasClassification = classifications.some(
        cls => cls.filename === seg.original.filename
      );
      
      if (!hasClassification) {
        transformedImages.push({
          id: String(seg._id || seg.id || ''),
          type: 'segmented',
          original_url: `${API_BASE_URL}/uploads/originals/${seg.original.filename}`,
          segmented_url: seg.segmented?.filename
            ? `${API_BASE_URL}/uploads/segmented/${seg.segmented.filename}`
            : null,
          segmented_id: String(seg._id || seg.id || ''),
          prediction: "N/A",
          created_at: seg.created_at
        });
      }
    }
  });

  transformedImages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return transformedImages;
};

export default function useGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/gallery`);
      if (!res.ok) {
        throw new Error("Error fetching images");
      }

      const data = await res.json();
      const transformedImages = transformImages(data);
      setImages(transformedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("There was an error fetching images. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const deleteImage = async (imageId, imageType) => {
    try {
      const res = await fetch(`${API_BASE_URL}/gallery/${imageId}?type=${imageType}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error deleting image');
      }

      await fetchImages();
      return { success: true };
    } catch (error) {
      console.error("Error deleting image:", error);
      return { success: false, error: error.message || 'Error deleting image' };
    }
  };

  return { images, loading, error, deleteImage };
}
