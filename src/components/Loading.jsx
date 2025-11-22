import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="flex flex-col items-center mt-6 animate-pulse">
      <FaSpinner className="text-cyan-300 text-5xl mb-3 animate-spin" />
      <p className="text-cyan-300 text-lg font-semibold">Processing...</p>
    </div>
  );
}
