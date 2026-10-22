
import React from "react";
import { RythuluTable } from "../components/RythuluTable";

export const Rythulu = () => {
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-success">
            <i className="bi bi-people-fill me-2"></i>
            Total Rythulu
          </h3>
          <p className="text-muted mb-0">
            Registered farmer details
          </p>
        </div>

        <button
          className="btn btn-outline-success"
          onClick={() => window.history.back()}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </button>
      </div>

      <RythuluTable />
    </div>
  );
};