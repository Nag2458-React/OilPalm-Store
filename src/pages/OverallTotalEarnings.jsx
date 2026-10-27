
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const OverallTotalEarnings = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getAmount = (farmer) => {
    const amount = Number(
      farmer.finalAmount ?? farmer.totalAmount ?? 0
    );

    return Number.isFinite(amount) ? amount : 0;
  };

  const formatAmount = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  const getDate = (value) => {
    if (!value) return null;

    if (typeof value.toDate === "function") {
      return value.toDate();
    }

    if (value instanceof Date) return value;

    if (typeof value === "string") {
      const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

      const date = match
        ? new Date(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3])
          )
        : new Date(value);

      return Number.isNaN(date.getTime()) ? null : date;
    }

    if (typeof value === "object" && value.seconds != null) {
      return new Date(value.seconds * 1000);
    }

    if (typeof value === "number") {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    return null;
  };

  const formatDate = (value) => {
    const date = getDate(value);
    return date ? date.toLocaleDateString("en-IN") : "-";
  };

  const fetchEarnings = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "rythulu"));

      const paidFarmers = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (farmer) =>
            String(farmer.paymentStatus ?? "")
              .trim()
              .toLowerCase() === "yes"
        );

      setFarmers(paidFarmers);
    } catch (error) {
      console.error("Overall earnings error:", error);
      alert("Overall earnings details load cheyyadam lo error vachindi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const filteredFarmers = farmers.filter((farmer) => {
    const query = search.trim().toLowerCase();

    return (
      String(farmer.rythuName ?? "").toLowerCase().includes(query) ||
      String(farmer.farmName ?? "").toLowerCase().includes(query) ||
      String(farmer.mobile ?? "").includes(query) ||
      String(farmer.village ?? "").toLowerCase().includes(query) ||
      String(farmer.district ?? "").toLowerCase().includes(query)
    );
  });

  const overallTotal = farmers.reduce(
    (total, farmer) => total + getAmount(farmer),
    0
  );

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-wallet2 text-danger me-2"></i>
            Overall Total Earnings
          </h3>

          <p className="text-muted mb-0">
            All-time paid orders and sales summary
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger"
            onClick={fetchEarnings}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>

          <Link to="/" className="btn btn-dark">
            <i className="bi bi-house me-1"></i>
            Dashboard
          </Link>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4"  style={{width:"30%"}}>
        <div className="card-body p-4">
          <div className="row align-items-center g-3">
            <div className="col-md-8">
              <div className="text-muted mb-2">
                Overall Earnings — All Paid Orders
              </div>

              <h2 className="fw-bold text-danger mb-2">
                {formatAmount(overallTotal)}
              </h2>

              <span className="badge bg-success">
                {farmers.length} Paid Orders / Farmers
              </span>
            </div>

            <div className="col-md-4 text-md-end">
              <i
                className="bi bi-graph-up-arrow text-danger"
                style={{ fontSize: "3rem" }}
              ></i>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <h5 className="fw-bold mb-0">All Paid Sales Details</h5>

            <input
              type="search"
              className="form-control"
              style={{ maxWidth: "320px" }}
              placeholder="Search farmer, mobile, village..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger"></div>
              <p className="mt-2">Loading earnings...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th>S.No</th>
                    <th>Rythu Name</th>
                    <th>Farm Name</th>
                    <th>Mobile</th>
                    <th>Village</th>
                    <th>District</th>
                    <th>Order Date</th>
                    <th>Bottles</th>
                    <th>Kits</th>
                    <th>Payment Status</th>
                    <th>Final Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFarmers.length > 0 ? (
                    filteredFarmers.map((farmer, index) => (
                      <tr key={farmer.id}>
                        <td>{index + 1}</td>
                        <td>{farmer.rythuName || "-"}</td>
                        <td>{farmer.farmName || "-"}</td>
                        <td>{farmer.mobile || "-"}</td>
                        <td>{farmer.village || "-"}</td>
                        <td>{farmer.district || "-"}</td>
                        <td>{formatDate(farmer.orderReceivedDate)}</td>
                        <td>{farmer.bottles ?? 0}</td>
                        <td>{farmer.kits ?? 0}</td>
                        <td>
                          <span className="badge bg-success">
                            Paid
                          </span>
                        </td>
                        <td className="fw-bold text-success">
                          {formatAmount(getAmount(farmer))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center py-4">
                        {search
                          ? "No matching records found."
                          : "Paid orders records levu."}
                      </td>
                    </tr>
                  )}
                </tbody>

                {filteredFarmers.length > 0 && (
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan="10" className="text-end fw-bold">
                        Overall Total
                      </td>
                      <td className="fw-bold text-danger">
                        {formatAmount(overallTotal)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};