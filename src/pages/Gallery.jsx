import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import useGallery from "../hooks/useGallery";
import Loading from "../components/Loading";

export default function Gallery() {
  const { images, loading, error, deleteImage } = useGallery();  // Extract properties from the hook
  const [view, setView] = useState("original");
  const [searchId, setSearchId] = useState("");  // State for ID search
  const [deletingId, setDeletingId] = useState(null);  // State to track which image is being deleted

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/images/no-image-found.jpg';
  };

  const filteredImages = images.filter((img) => {
    const matchesSearch = img.id.toString().includes(searchId);
    
    if (view === "segmented") {
      return matchesSearch && img.segmented_url !== null && img.segmented_url !== undefined;
    }
    
    return matchesSearch;
  });

  const handleDelete = async (img) => {
    const confirmMessage = img.type === 'original' 
      ? "Are you sure you want to delete this image? This will also delete its segmentation if it exists."
      : "Are you sure you want to delete this segmented image?";
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setDeletingId(img.id);
    try {
      const result = await deleteImage(img.id, img.type);
      if (!result.success) {
        alert(`Error: ${result.error || 'Failed to delete image'}`);
      }
    } catch (err) {
      alert(`Error: ${err.message || 'Failed to delete image'}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="home-wrapper">
        <div className="page-container">
          <h1 className="text-3xl font-bold text-center text-cyan-400 mb-8">
            Processed Image Gallery
          </h1>
          <Loading />
        </div>
      </div>
    );
  }
  
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="home-wrapper">
      <div className="page-container">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-8">
          Processed Image Gallery
        </h1>

        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setView("original")}
            className={`btn px-5 py-2 rounded-lg font-semibold transition ${
              view === "original"
                ? "bg-cyan-500 text-black"
                : "bg-[#222] text-cyan-300 border border-cyan-600"
            }`}
          >
            Show uploaded photos
          </button>

          <button
            onClick={() => setView("segmented")}
            className={`btn px-5 py-2 rounded-lg font-semibold transition ${
              view === "segmented"
                ? "bg-cyan-500 text-black"
                : "bg-[#222] text-cyan-300 border border-cyan-600"
            }`}
          >
            Show segmented photos
          </button>
        </div>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by Image ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="px-4 py-2 border border-cyan-600 rounded-lg text-black"
          />
        </div>

        {filteredImages.length === 0 && (
          <p className="text-center text-gray-400">
            {searchId ? "No images found with that ID." : "No images available."}
          </p>
        )}

        {/* IMAGE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="bg-[#111] p-4 rounded-xl shadow-xl border border-cyan-600"
            >
              {view === "original" ? (
                <img
                  src={img.original_url}
                  alt="uploaded image"
                  className="gallery-image border border-cyan-400/40"
                  onError={handleImageError}
                />
              ) : (
                img.segmented_url ? (
                  <img
                    src={img.segmented_url}
                    alt="segmented image"
                    className="gallery-image border border-cyan-400"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="gallery-image-container border border-cyan-400/40">
                    <p className="text-gray-400">No segmented image available</p>
                  </div>
                )
              )}

              <p className="text-cyan-300 mt-3">
                Disease:{" "}
                <span className="text-green-400 font-semibold">
                  {img.prediction || "N/A"}
                </span>
              </p>

              <p className="text-gray-400 text-sm">
                    Uploaded: {new Date(img.created_at).toLocaleString()}
                  </p>

                  <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDelete(img)}
                  disabled={deletingId === img.id}
                  className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                    deletingId === img.id
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                  title="Delete image"
                >
                  <FaTrash />
                  {deletingId === img.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
