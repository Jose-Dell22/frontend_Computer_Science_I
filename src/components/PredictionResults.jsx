import React from "react";

export default function PredictionResults({ results, hasImage, onPredict, onSegment }) {
  return (
    <div className="results mt-6">

      {hasImage && (
        <div className="flex justify-center gap-4 mb-5">
          <button onClick={onPredict} className="btn btn-main">
            Predict
          </button>

          <button onClick={onSegment} className="btn">
            Segment
          </button>
        </div>
      )}

      {results && results.length > 0 && (
        <>
          <h3 className="text-2xl font-bold text-cyan-300 mb-4">Results</h3>

          {results.map((r, i) => (
            <div
              key={i}
              className="result-item flex justify-between bg-cyan-400/10 px-4 py-3 rounded-xl mb-2 shadow-md backdrop-blur"
            >
              <span className="label text-cyan-300 font-semibold">{r.label}</span>
              <span className="prob text-green-300 font-semibold">
                {r.probability.toFixed(2)}%
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
