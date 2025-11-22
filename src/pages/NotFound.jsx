import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="home-wrapper">
      <div className="page-container text-center">

        <FaExclamationTriangle className="text-red-400 text-6xl mx-auto mb-6 drop-shadow-lg" />

        <h1 className="text-3xl font-bold text-cyan-300 mb-4">
          Error 404
        </h1>

        <p className="text-gray-300 text-lg mb-6">
          La página que buscas no existe o fue movida.
        </p>

        <Link to="/" className="btn btn-main">
          Volver al inicio
        </Link>

      </div>
    </div>
  );
}
