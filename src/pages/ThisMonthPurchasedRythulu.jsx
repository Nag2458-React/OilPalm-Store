
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

const getOrderDate = (value) => {
  if (!value) return null;

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (match) {
      return new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3])
      );
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "object" && value.seconds != null) {
    return new Date(value.seconds * 1000);
  }

  return null;
};

const formatDate = (value) => {
  const date = getOrderDate(value);

  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-IN")
    : "-";
};

const formatAmount = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const ThisMonthPurchasedRythulu = () => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPurchasedFarmers = async () => {
    setLoading(true);

    try {
      const snapshot = await getDocs(collection(db, "rythulu"));

      const allFarmers = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

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

      const purchasedFarmers = allFarmers.filter((farmer) => {
        const paymentStatus = String(
          farmer.paymentStatus ?? ""
        ).trim().toLowerCase();

        const orderDate = getOrderDate(farmer.orderReceivedDate);

        return (
          paymentStatus === "yes" &&
          orderDate &&
          !Number.isNaN(orderDate.getTime()) &&
          orderDate >= monthStart &&
          orderDate < nextMonthStart
        );
      });

      purchasedFarmers.sort((a, b) => {
        const dateA = getOrderDate(a.orderReceivedDate)?.getTime() || 0;
        const dateB = getOrderDate(b.orderReceivedDate)?.getTime() || 0;
        return dateB - dateA;
      });

      setFarmers(purchasedFarmers);
    } catch (error) {
      console.error("Purchased farmers fetch error:", error);
      alert("Purchase details load cheyyadam lo error vachindi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedFarmers();
  }, []);

  const filteredFarmers = farmers.filter((farmer) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      farmer.rythuName,
      farmer.farmName,
      farmer.mobile,
      farmer.village,
      farmer.mandal,
      farmer.district,
      farmer.paymentStatus,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="mb-1">This Month Purchased Rythulu</h3>
          <p className="text-muted mb-0">
            Payment Status: Yes | Current month orders only
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={fetchPurchasedFarmers}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>

          <Link to="/" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Dashboard
          </Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted">This Month Paid Orders</div>
              <h2 className="text-success mb-0">{farmers.length}</h2>
              <small className="text-muted">
                Farmers with Payment Status Yes
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-3 align-items-center mb-3">
            <div className="col-12 col-md-8">
              <input
                type="search"
                className="form-control"
                placeholder="Search name, mobile, village..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="col-12 col-md-4 text-md-end">
              <span className="text-muted">
                Showing {filteredFarmers.length} of {farmers.length} farmers
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 mb-0">Loading purchase details...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle text-nowrap">
                <thead className="table-success">
                  <tr>
                    <th>S.No</th>
                    <th>Rythu Name</th>
                    <th>Farm Name</th>
                    <th>Acres</th>
                    <th>1 Litre Bottles</th>
                    <th>Bottle Amount</th>
                    <th>Kits</th>
                    <th>Kit Amount</th>
                    <th>Total Amount</th>
                    <th>Discount</th>
                    <th>Final Amount</th>
                    <th>Mobile</th>
                    <th>Order Date</th>
                    <th>Village</th>
                    <th>Mandal</th>
                    <th>District</th>
                    <th>Payment Status</th>
                    <th>Transportation</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFarmers.length > 0 ? (
                    filteredFarmers.map((farmer, index) => (
                      <tr key={farmer.id}>
                        <td>{index + 1}</td>
                        <td>{farmer.rythuName || "-"}</td>
                        <td>{farmer.farmName || "-"}</td>
                        <td>{farmer.acres ?? "-"}</td>
                        <td>{farmer.bottles ?? "-"}</td>
                        <td>{formatAmount(farmer.bottleAmount)}</td>
                        <td>{farmer.kits || "-"}</td>
                        <td>{formatAmount(farmer.kitAmount)}</td>
                        <td>{formatAmount(farmer.totalAmount)}</td>
                        <td>{formatAmount(farmer.discount)}</td>
                        <td className="fw-bold text-success">
                          {formatAmount(farmer.finalAmount)}
                        </td>
                        <td>{farmer.mobile || "-"}</td>
                        <td>{formatDate(farmer.orderReceivedDate)}</td>
                        <td>{farmer.village || "-"}</td>
                        <td>{farmer.mandal || "-"}</td>
                        <td>{farmer.district || "-"}</td>
                        <td>
                          <span className="badge bg-success">
                            {farmer.paymentStatus}
                          </span>
                        </td>
                        <td>{farmer.transportation || "-"}</td>
                        <td>{farmer.remarks || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={19} className="text-center py-4">
                        No paid farmers found for this month.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};