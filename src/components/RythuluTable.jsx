
import React, { useState, useEffect, useMemo } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export const RythuluTable = () => {
  const [rythulu, setRythulu] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and date filter states
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchRythulu = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "rythulu"));

      const farmers = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setRythulu(farmers);
    } catch (error) {
      console.error("Farmers fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRythulu();
  }, []);

  // Search + date filtering
  const filteredRythulu = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return rythulu.filter((farmer) => {
      const searchableFields = [
        farmer.rythuName,
        farmer.farmName,
        farmer.mobile,
        farmer.alternateMobile,
        farmer.village,
        farmer.mandal,
        farmer.district,
        farmer.state,
        farmer.pinCode,
        farmer.discussionStatus,
        farmer.paymentStatus,
      ];

      const matchesSearch =
        !search ||
        searchableFields.some((value) =>
          String(value || "").toLowerCase().includes(search)
        );

      // Use orderReceivedDate for date filtering
      const date = String(farmer.orderReceivedDate || "").slice(0, 10);

      const matchesFromDate = !fromDate || (date && date >= fromDate);
      const matchesToDate = !toDate || (date && date <= toDate);

      return matchesSearch && matchesFromDate && matchesToDate;
    });
  }, [rythulu, searchText, fromDate, toDate]);

  const clearFilters = () => {
    setSearchText("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-header bg-success text-white py-3">
        <h5 className="mb-0">
          <i className="bi bi-people-fill me-2"></i>
          Total Rythulu ({filteredRythulu.length})
        </h5>
      </div>

      <div className="card-body">
        {/* Search and date filters */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-lg-4">
            <label className="form-label fw-semibold">
              Search Rythulu
            </label>

            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-search"></i>
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Name, mobile, village..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <label className="form-label fw-semibold">
              From Date
            </label>

            <input
              type="date"
              className="form-control"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="col-6 col-lg-3">
            <label className="form-label fw-semibold">
              To Date
            </label>

            <input
              type="date"
              className="form-control"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="col-12 col-lg-2 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={clearFilters}
            >
              <i className="bi bi-x-circle me-1"></i>
              Clear
            </button>
          </div>
        </div>

        {/* Result summary */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <span className="text-muted">
            Showing <strong>{filteredRythulu.length}</strong> of{" "}
            <strong>{rythulu.length}</strong> Rythulu
          </span>

          {(searchText || fromDate || toDate) && (
            <span className="badge bg-success-subtle text-success border">
              Filters Applied
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-success"
              role="status"
            ></div>
            <p className="mt-2 text-muted">Loading farmers...</p>
          </div>
        ) : filteredRythulu.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-search fs-1 text-muted"></i>
            <p className="mt-2 text-muted">
              No matching Rythulu found.
            </p>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped align-middle">
              <thead className="table-success">
                <tr>
                  <th>S.No</th>
                  <th>Rythu Name</th>
                  <th>Farm Name</th>
                  <th>Acres</th>
                  <th>1 Litre Bottles</th>
                  <th>Kits</th>
                  <th>Mobile</th>
                  <th>Alternate Mobile</th>
                  <th>Order Date</th>
                  <th>Village</th>
                  <th>Mandal</th>
                  <th>District</th>
                  <th>State</th>
                  <th>PIN Code</th>
                  <th>Full Address</th>
                  <th>Discussion Status</th>
                  <th>Transportation</th>
                  <th>Payment Status</th>
                  <th>Next Follow-up</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {filteredRythulu.map((farmer, index) => (
                  <tr key={farmer.id}>
                    <td>{index + 1}</td>
                    <td>{farmer.rythuName || "-"}</td>
                    <td>{farmer.farmName || "-"}</td>
                    <td>{farmer.acres || "-"}</td>
                    <td>{farmer.bottles || "-"}</td>
                    <td>{farmer.kits || "-"}</td>
                    <td>{farmer.mobile || "-"}</td>
                    <td>{farmer.alternateMobile || "-"}</td>
                    <td>{farmer.orderReceivedDate || "-"}</td>
                    <td>{farmer.village || "-"}</td>
                    <td>{farmer.mandal || "-"}</td>
                    <td>{farmer.district || "-"}</td>
                    <td>{farmer.state || "-"}</td>
                    <td>{farmer.pinCode || "-"}</td>
                    <td>{farmer.fullAddress || "-"}</td>
                    <td>{farmer.discussionStatus || "-"}</td>
                    <td>{farmer.transportation || "-"}</td>
                    <td>{farmer.paymentStatus || "-"}</td>
                    <td>{farmer.nextFollowUpDate || "-"}</td>
                    <td>{farmer.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};