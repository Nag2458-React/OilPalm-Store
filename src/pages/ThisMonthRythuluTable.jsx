
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleString("en-IN");
  }

  if (value instanceof Date) {
    return value.toLocaleString("en-IN");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const getDateInputValue = (value) => {
  if (!value) return "";

  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  if (value instanceof Date) {
    return `${value.getFullYear()}-${String(
      value.getMonth() + 1
    ).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  }

  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
};

const getMonthDate = (value) => {
  if (!value) return null;

  if (typeof value?.toDate === "function") {
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

    return new Date(value);
  }

  if (typeof value === "number") {
    return new Date(value);
  }

  if (typeof value === "object" && value.seconds) {
    return new Date(value.seconds * 1000);
  }

  return null;
};

const fieldLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());

const dateFields = [
  "orderReceivedDate",
  "nextFollowUpDate",
];

const numberFields = [
  "acres",
  "bottles",
  "bottleAmount",
  "kitAmount",
  "totalAmount",
  "discount",
  "finalAmount",
];

const hiddenEditFields = ["id", "createdAt"];

export const ThisMonthRythuluTable = () => {
  const [rythulu, setRythulu] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchRythulu = async () => {
    setLoading(true);

    try {
      const snapshot = await getDocs(collection(db, "rythulu"));

      const allFarmers = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      const today = new Date();
      const monthStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const nextMonthStart = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
      );

      const thisMonthFarmers = allFarmers.filter((farmer) => {
        const date = getMonthDate(farmer.orderReceivedDate);

        return (
          date &&
          !Number.isNaN(date.getTime()) &&
          date >= monthStart &&
          date < nextMonthStart
        );
      });

      thisMonthFarmers.sort((a, b) => {
        const dateA = getMonthDate(a.orderReceivedDate)?.getTime() || 0;
        const dateB = getMonthDate(b.orderReceivedDate)?.getTime() || 0;
        return dateB - dateA;
      });

      setRythulu(thisMonthFarmers);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      alert("Farmers load cheyyadam lo error vachindi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRythulu();
  }, []);

  // All records lo unna fields ni dynamic ga table columns ga chupistundi.


  const filteredFarmers = rythulu.filter((farmer) => {
    const text = search.toLowerCase().trim();

    if (!text) return true;

    return Object.entries(farmer).some(([key, value]) => {
      if (key === "id") return false;

      return (
        fieldLabel(key).toLowerCase().includes(text) ||
        formatValue(value).toLowerCase().includes(text)
      );
    });
  });

  const handleEdit = (farmer) => {
    const formData = {};

    Object.entries(farmer).forEach(([key, value]) => {
      if (hiddenEditFields.includes(key)) return;

      if (dateFields.includes(key)) {
        formData[key] = getDateInputValue(value);
      } else if (value === null || value === undefined) {
        formData[key] = "";
      } else if (typeof value === "object") {
        formData[key] = JSON.stringify(value);
      } else {
        formData[key] = String(value);
      }
    });

    setEditForm(formData);
    setEditingFarmer(farmer);
  };

  const handleInputChange = (key, value) => {
    setEditForm((previous) => {
      const updated = {
        ...previous,
        [key]: value,
      };

      // Bottle/kit/discount amounts ni automatic ga recalculate chestundi.
      if (["bottles", "kits", "discount"].includes(key)) {
        const bottles = Number(updated.bottles || 0);

        const kitText = String(updated.kits || "0");
        const kitMatch = kitText.match(/\d+/);
        const kits = kitMatch ? Number(kitMatch[0]) : 0;

        const bottleAmount = bottles * 750;
        const kitAmount = kits * 1850;
        const totalAmount = bottleAmount + kitAmount;
        const discount = Number(updated.discount || 0);

        updated.bottleAmount = String(bottleAmount);
        updated.kitAmount = String(kitAmount);
        updated.totalAmount = String(totalAmount);
        updated.finalAmount = String(
          Math.max(0, totalAmount - discount)
        );
      }

      return updated;
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingFarmer) return;

    setSaving(true);

    try {
      const updatedData = {};

      Object.entries(editForm).forEach(([key, value]) => {
        if (key === "id" || key === "createdAt") return;

        if (numberFields.includes(key)) {
          updatedData[key] =
            value.trim() === "" ? 0 : Number(value);
        } else {
          updatedData[key] = value;
        }
      });

      await updateDoc(
        doc(db, "rythulu", editingFarmer.id),
        updatedData
      );

      alert("Farmer details updated successfully!");

      setEditingFarmer(null);
      await fetchRythulu();
    } catch (error) {
      console.error("Error updating farmer:", error);
      alert(
        "Update failed. Firestore rules and field values check cheyyandi."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (farmer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${farmer.rythuName || "this farmer"}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(farmer.id);

    try {
      await deleteDoc(doc(db, "rythulu", farmer.id));

      setRythulu((previous) =>
        previous.filter((item) => item.id !== farmer.id)
      );

      alert("Farmer deleted successfully!");
    } catch (error) {
      console.error("Error deleting farmer:", error);
      alert(
        "Delete failed. Firestore delete permission check cheyyandi."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="mb-1">This Month Rythulu</h3>
          <p className="text-muted mb-0">
            Farmers filtered by Order Received Date
          </p>
        </div>

        <Link to="/" className="btn btn-outline-success">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Dashboard
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <input
                type="search"
                className="form-control"
                placeholder="Search any field or value..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="col-md-4 text-md-end">
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={fetchRythulu}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-2 mb-0">Loading farmers...</p>
            </div>
          ) : (
            <>
              <p className="text-muted">
                Showing <strong>{filteredFarmers.length}</strong> of{" "}
                <strong>{rythulu.length}</strong> farmers
              </p>

              
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
        <th style={{ minWidth: "170px" }}>Actions</th>
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
            <td>₹{farmer.bottleAmount ?? 0}</td>
            <td>{farmer.kits || "-"}</td>
            <td>₹{farmer.kitAmount ?? 0}</td>
            <td>₹{farmer.totalAmount ?? 0}</td>
            <td>₹{farmer.discount ?? 0}</td>
            <td className="fw-bold text-success">
              ₹{farmer.finalAmount ?? 0}
            </td>
            <td>{farmer.mobile || "-"}</td>
            <td>{farmer.alternateMobile || "-"}</td>
            <td>{formatValue(farmer.orderReceivedDate)}</td>
            <td>{farmer.village || "-"}</td>
            <td>{farmer.mandal || "-"}</td>
            <td>{farmer.district || "-"}</td>
            <td>{farmer.state || "-"}</td>
            <td>{farmer.pinCode || "-"}</td>
            <td
              className="text-wrap"
              style={{ minWidth: "200px", maxWidth: "300px" }}
            >
              {farmer.fullAddress || "-"}
            </td>
            <td>{farmer.discussionStatus || "-"}</td>
            <td>{farmer.transportation || "-"}</td>
            <td>{farmer.paymentStatus || "-"}</td>
            <td>{formatValue(farmer.nextFollowUpDate)}</td>
            <td
              className="text-wrap"
              style={{ minWidth: "150px", maxWidth: "250px" }}
            >
              {farmer.remarks || "-"}
            </td>

            <td className="text-nowrap">
              <button
                type="button"
                className="btn btn-sm btn-primary me-2"
                onClick={() => handleEdit(farmer)}
              >
                <i className="bi bi-pencil-square me-1"></i>
                Edit
              </button>

              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(farmer)}
                disabled={deletingId === farmer.id}
              >
                <i className="bi bi-trash me-1"></i>
                {deletingId === farmer.id ? "Deleting..." : "Delete"}
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={26} className="text-center py-4">
            No farmers found for this month.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
            </>
          )}
        </div>
      </div>

      {/* Edit Farmer Modal */}
      {editingFarmer && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <form onSubmit={handleUpdate}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    Edit Farmer Details
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditingFarmer(null)}
                    disabled={saving}
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    {Object.entries(editForm).map(([key, value]) => (
                      <div className="col-md-6 col-lg-4" key={key}>
                        <label className="form-label">
                          {fieldLabel(key)}
                        </label>

                        {dateFields.includes(key) ? (
                          <input
                            type="date"
                            className="form-control"
                            value={value}
                            onChange={(event) =>
                              handleInputChange(key, event.target.value)
                            }
                          />
                        ) : key === "remarks" ||
                          key === "fullAddress" ? (
                          <textarea
                            className="form-control"
                            rows="2"
                            value={value}
                            onChange={(event) =>
                              handleInputChange(key, event.target.value)
                            }
                          />
                        ) : (
                          <input
                            type={
                              key === "mobile" ||
                              key === "alternateMobile" ||
                              key === "pinCode"
                                ? "text"
                                : "text"
                            }
                            className="form-control"
                            value={value}
                            onChange={(event) =>
                              handleInputChange(key, event.target.value)
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingFarmer(null)}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};