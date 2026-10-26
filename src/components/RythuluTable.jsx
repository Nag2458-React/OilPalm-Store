import React, { useState, useEffect, useMemo } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const BOTTLE_PRICE = 750;
const KIT_PRICE = 1850;

const getAmounts = (farmer = {}) => {
  const bottleCount = Number(farmer.bottles) || 0;
  const kitCount = Number.parseInt(farmer.kits, 10) || 0;
  const bottleAmount = bottleCount * BOTTLE_PRICE;
  const kitAmount = kitCount * KIT_PRICE;
  const totalAmount = bottleAmount + kitAmount;
  const discount = Math.min(
    Math.max(Number(farmer.discount) || 0, 0),
    totalAmount
  );

  return {
    bottlePrice: BOTTLE_PRICE,
    kitPrice: KIT_PRICE,
    bottleAmount,
    kitAmount,
    totalAmount,
    discount,
    finalAmount: totalAmount - discount,
  };
};

const formatRupees = (value) =>
  `₹${(Number(value) || 0).toLocaleString("en-IN")}`;

export const RythuluTable = () => {
  const [rythulu, setRythulu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchRythulu = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "rythulu"));
      setRythulu(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    } catch (error) {
      console.error("Farmers fetch error:", error);
      alert("Farmers data load cheyyadam lo error vachindi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRythulu();
  }, []);

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
        farmer.transportation,
        farmer.remarks,
      ];

      const matchesSearch =
        !search ||
        searchableFields.some((value) =>
          String(value || "").toLowerCase().includes(search)
        );

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

  const handleEdit = (farmer) => {
    const withAmounts = { ...farmer, ...getAmounts(farmer) };
    setEditingFarmer(withAmounts);
  };

  const handleEditChange = (name, value) => {
    setEditingFarmer((previous) => {
      if (!previous) return previous;
      const updated = { ...previous, [name]: value };

      // Recalculate amount fields whenever bottles, kits or discount changes.
      if (["bottles", "kits", "discount"].includes(name)) {
        return { ...updated, ...getAmounts(updated) };
      }
      return updated;
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingFarmer) return;

    try {
      setSaving(true);
      const { id, ...rest } = editingFarmer;
      const updatedData = {
        ...rest,
        ...getAmounts(rest),
      };

      await updateDoc(doc(db, "rythulu", id), updatedData);

      setRythulu((previous) =>
        previous.map((farmer) =>
          farmer.id === id ? { ...updatedData, id } : farmer
        )
      );

      setEditingFarmer(null);
      alert("Rythu details successfully updated!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (farmer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${farmer.rythuName || "this farmer"}?`
    );
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "rythulu", farmer.id));
      setRythulu((previous) =>
        previous.filter((item) => item.id !== farmer.id)
      );
      alert("Rythu successfully deleted!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed: " + error.message);
    }
  };

  const editFields = [
    { name: "rythuName", label: "Rythu Name", type: "text" },
    { name: "farmName", label: "Farm Name", type: "text" },
    { name: "acres", label: "Acres", type: "number" },
    {
      name: "bottles",
      label: "How Many 1 Litre Bottles",
      type: "select",
      options: ["1", "2", "3", "4", "5"],
    },
    {
      name: "kits",
      label: "How Many Kits (9 bottles per kit)",
      type: "select",
      options: ["1 KIT", "2 KITS", "3 KITS", "4 KITS", "5 KITS"],
    },
    { name: "mobile", label: "Mobile", type: "tel" },
    { name: "alternateMobile", label: "Alternate Mobile", type: "tel" },
    { name: "orderReceivedDate", label: "Order Date", type: "date" },
    { name: "village", label: "Village", type: "text" },
    { name: "mandal", label: "Mandal", type: "text" },
    { name: "district", label: "District", type: "text" },
    {
      name: "state",
      label: "State",
      type: "select",
      options: ["Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Kerala"],
    },
    { name: "pinCode", label: "PIN Code", type: "text" },
    { name: "fullAddress", label: "Full Address", type: "text" },
    {
      name: "discussionStatus",
      label: "Discussion Status",
      type: "select",
      options: [
        "Not Contacted",
        "Discussion Done",
        "Interested",
        "Not Interested",
        "Follow-up Required",
      ],
    },
    {
      name: "transportation",
      label: "Transportation",
      type: "select",
      options: ["Navatha", "Cargo", "RTC", "Others"],
    },
    {
      name: "paymentStatus",
      label: "Payment Status",
      type: "select",
      options: ["Yes", "No"],
    },
    { name: "nextFollowUpDate", label: "Next Follow-up", type: "date" },
    { name: "remarks", label: "Remarks", type: "text" },
  ];

  return (
    <>
      <div className="card shadow-sm border-0 mt-4">
        <div className="card-header bg-success text-white py-3">
          <h5 className="mb-0">
            <i className="bi bi-people-fill me-2"></i>
            Total Rythulu ({filteredRythulu.length})
          </h5>
        </div>

        <div className="card-body">
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-4">
              <label className="form-label fw-semibold">Search Rythulu</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name, mobile, village, status..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <label className="form-label fw-semibold">From Date</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="col-6 col-lg-3">
              <label className="form-label fw-semibold">To Date</label>
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
                <i className="bi bi-x-circle me-1"></i> Clear
              </button>
            </div>
          </div>

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
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-2 text-muted">Loading farmers...</p>
            </div>
          ) : filteredRythulu.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search fs-1 text-muted"></i>
              <p className="mt-2 text-muted">No matching Rythulu found.</p>
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
                  {filteredRythulu.map((farmer, index) => {
                    const amounts = getAmounts(farmer);
                    return (
                      <tr key={farmer.id}>
                        <td>{index + 1}</td>
                        <td>{farmer.rythuName || "-"}</td>
                        <td>{farmer.farmName || "-"}</td>
                        <td>{farmer.acres || "-"}</td>
                        <td>{farmer.bottles || "-"}</td>
                        <td>{formatRupees(farmer.bottleAmount ?? amounts.bottleAmount)}</td>
                        <td>{farmer.kits || "-"}</td>
                        <td>{formatRupees(farmer.kitAmount ?? amounts.kitAmount)}</td>
                        <td className="fw-semibold">{formatRupees(farmer.totalAmount ?? amounts.totalAmount)}</td>
                        <td>{formatRupees(farmer.discount ?? amounts.discount)}</td>
                        <td className="fw-bold text-success">{formatRupees(farmer.finalAmount ?? amounts.finalAmount)}</td>
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
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              title="Edit farmer"
                              onClick={() => handleEdit(farmer)}
                            >
                              <i className="bi bi-pencil-square me-1"></i>Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              title="Delete farmer"
                              onClick={() => handleDelete(farmer)}
                            >
                              <i className="bi bi-trash me-1"></i>Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Rythu Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Close"
                    onClick={() => setEditingFarmer(null)}
                    disabled={saving}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    {editFields.map((field) => (
                      <div className="col-12 col-md-6 col-lg-4" key={field.name}>
                        <label className="form-label fw-semibold">
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <select
                            className="form-select"
                            value={editingFarmer[field.name] ?? ""}
                            onChange={(e) =>
                              handleEditChange(field.name, e.target.value)
                            }
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            className="form-control"
                            min={field.type === "number" ? "0" : undefined}
                            value={editingFarmer[field.name] ?? ""}
                            onChange={(e) =>
                              handleEditChange(field.name, e.target.value)
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <hr className="my-4" />
                  <h6 className="fw-bold text-success mb-3">
                    <i className="bi bi-currency-rupee me-1"></i>
                    Order Amount Details
                  </h6>

                  <div className="row g-3">
                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        Bottle Price (each)
                      </label>
                      <input className="form-control" value={formatRupees(BOTTLE_PRICE)} readOnly />
                      <small className="text-muted">₹750 per 1 litre bottle</small>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">Bottle Amount</label>
                      <input className="form-control" value={formatRupees(editingFarmer.bottleAmount)} readOnly />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        Kit Price (each)
                      </label>
                      <input className="form-control" value={formatRupees(KIT_PRICE)} readOnly />
                      <small className="text-muted">₹1,850 per kit</small>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">Kit Amount</label>
                      <input className="form-control" value={formatRupees(editingFarmer.kitAmount)} readOnly />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">Total Amount</label>
                      <input className="form-control fw-bold" value={formatRupees(editingFarmer.totalAmount)} readOnly />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">Discount Amount (₹)</label>
                      <input
                        type="number"
                        min="0"
                        max={editingFarmer.totalAmount || 0}
                        className="form-control"
                        value={editingFarmer.discount ?? 0}
                        onChange={(e) => handleEditChange("discount", e.target.value)}
                      />
                      <small className="text-muted">Discount cannot exceed total amount.</small>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">Final Amount</label>
                      <input className="form-control fw-bold text-success" value={formatRupees(editingFarmer.finalAmount)} readOnly />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setEditingFarmer(null)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-1"></i>
                        Update Details
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
