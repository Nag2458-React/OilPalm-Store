
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const ThisMonthTotalEarnings = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const formatAmount = (value) =>
    Number(value ?? 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  const formatDate = (value) => {
    const date = getDate(value);

    return date
      ? date.toLocaleDateString("en-IN")
      : "-";
  };

  const fetchEarnings = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "rythulu"));

      const now = new Date();
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
      const nextMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );

      const paidFarmers = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((farmer) => {
          const date = getDate(farmer.orderReceivedDate);

          const isThisMonth =
            date &&
            date >= monthStart &&
            date < nextMonthStart;

          const isPaid =
            String(farmer.paymentStatus ?? "")
              .trim()
              .toLowerCase() === "yes";

          return isThisMonth && isPaid;
        });

      setFarmers(paidFarmers);
    } catch (error) {
      console.error("Earnings fetch error:", error);
      alert("Earnings details load cheyyadam lo error vachindi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const filteredFarmers = farmers.filter((farmer) => {
    const query = search.toLowerCase();

    return (
      String(farmer.rythuName ?? "").toLowerCase().includes(query) ||
      String(farmer.farmName ?? "").toLowerCase().includes(query) ||
      String(farmer.mobile ?? "").includes(query) ||
      String(farmer.village ?? "").toLowerCase().includes(query)
    );
  });

  const totalEarnings = farmers.reduce((total, farmer) => {
    const amount = Number(
      farmer.finalAmount ?? farmer.totalAmount ?? 0
    );

    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div >
          <h3 className="fw-bold mb-1">
            <i className="bi bi-currency-rupee me-2 text-success"></i>
            This Month Total Earnings
          </h3>
          <p className="text-muted mb-0">
            Current month paid orders and sales details
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-success"
            onClick={fetchEarnings}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>

          <Link to="/" className="btn btn-dark">
            <i className="bi bi-house me-2"></i>
            Dashboard
          </Link>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4" style={{width:"30%"}}>
        <div className="card-body p-4">
          <div className="row align-items-center g-3">
            <div className="col-md-8">
              <div className="text-muted mb-2">
                Total Earnings — Paid Orders Only
              </div>

              <h2 className="text-success fw-bold mb-0">
                {formatAmount(totalEarnings)}
              </h2>

              <div className="text-muted mt-2">
                Paid farmers: {farmers.length}
              </div>
            </div>

            <div className="col-md-4 text-md-end">
              <i
                className="bi bi-graph-up-arrow text-success"
                style={{ fontSize: "3rem" }}
              ></i>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <h5 className="fw-bold mb-0">Paid Orders Details</h5>

            <input
              type="search"
              className="form-control"
              style={{ maxWidth: "320px" }}
              placeholder="Search farmer, farm, mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success"></div>
              <p className="mt-2 mb-0">Loading earnings...</p>
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
                        <td>{formatDate(farmer.orderReceivedDate)}</td>
                        <td>{farmer.bottles ?? 0}</td>
                        <td>{farmer.kits ?? 0}</td>
                        <td>
                          <span className="badge bg-success">
                            Paid
                          </span>
                        </td>
                        <td className="fw-bold text-success">
                          {formatAmount(
                            farmer.finalAmount ?? farmer.totalAmount ?? 0
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4">
                        {search
                          ? "No matching farmers found."
                          : "This month paid orders levu."}
                      </td>
                    </tr>
                  )}
                </tbody>

                {!loading && filteredFarmers.length > 0 && (
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan="9" className="text-end fw-bold">
                        Total Earnings (all paid orders)
                      </td>
                      <td className="fw-bold text-success">
                        {formatAmount(totalEarnings)}
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