import React from "react";

export default function ModelSelector({
  show,
  model,
  setModel,
  showDelete,
  onDelete,
}) {
  if (!show) return null;

  return (
    <div className="my-4">
      <label className="text-cyan-300 font-semibold block text-center">
        Select model:
      </label>

      <div className="flex gap-3 items-center mt-2 justify-center">
        <select
          className="model-select"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="efficientnet">EfficientNetV2B3</option>
          <option value="resnet">ResNet50V2</option>
          <option value="xception">Xception</option>
        </select>

        {showDelete && (
          <button
            className="btn bg-red-300 text-black font-bold px-3 py-2 rounded-lg"
            onClick={onDelete}
          >
            Delete option
          </button>
        )}
      </div>
    </div>
  );
}
