import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

export const NewRythu = ({onSaveRythu}) => {
    const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());

  try {
    setLoading(true);

    await addDoc(collection(db, "rythulu"), data);

    alert("Rythu data saved successfully!");

    form.reset();

    const modalElement = document.getElementById("newFarmerModal");
    window.bootstrap?.Modal.getInstance(modalElement)?.hide();

    onSaveRythu?.();
  } catch (error) {
    console.error("Firebase error:", error);
    alert("Save failed: " + error.message);
  } finally {
    setLoading(false);
  }
};
  return (
     <div
      className="modal fade"
      id="newFarmerModal"
      tabIndex="-1"
      aria-labelledby="newFarmerModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <div>
              <h5 className="modal-title" id="newFarmerModalLabel">
                <i className="bi bi-person-plus me-2"></i>
                New Rythu Registration
              </h5>
              <small>Enter farmer details below</small>
            </div>

            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <h6 className="text-success fw-bold mb-3">
                <i className="bi bi-person-fill me-2"></i>
                Personal Details
              </h6>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Rythu Name *</label>
                  <input
                    name="rythuName"
                    type="text"
                    className="form-control"
                    placeholder="Enter farmer name"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Farm Name *</label>
                  <input
                    name="farmName"
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">How Many Acres *</label>
                  <input
                    name="acres"
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    placeholder="Enter acres"
                    required
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">How Many 1 Littre Bottles</label>
                  <select
                    name="bottles"
                    className="form-select"
                    defaultValue=""
                  >
                    <option value="">Select Bottles</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">How Many Kits</label>
                  <select
                    name="kits"
                    className="form-select"
                    defaultValue=""
                  >
                    <option value="">Select state</option>
                    <option>1 kIT</option>
                    <option>2 KITS</option>
                    <option>3 KITS</option>
                    <option>4 KITS</option>
                    <option>5 KITS</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Mobile Number *</label>
                  <input
                    name="mobile"
                    type="tel"
                    className="form-control"
                    placeholder="Enter 10-digit mobile number"
                    pattern="[6-9][0-9]{9}"
                    maxLength="10"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Alternate Mobile</label>
                  <input
                    name="alternateMobile"
                    type="tel"
                    className="form-control"
                    placeholder="Optional"
                    maxLength="10"
                    pattern="[6-9][0-9]{9}"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Order Received Date *</label>
                  <input
                    name="orderReceivedDate"
                    type="date"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <hr className="my-4" />

              <h6 className="text-success fw-bold mb-3">
                <i className="bi bi-geo-alt-fill me-2"></i>
                Address Details
              </h6>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Village *</label>
                  <input
                    name="village"
                    type="text"
                    className="form-control"
                    placeholder="Village"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Mandal *</label>
                  <input
                    name="mandal"
                    type="text"
                    className="form-control"
                    placeholder="Mandal"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">District *</label>
                  <input
                    name="district"
                    type="text"
                    className="form-control"
                    placeholder="District"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">State</label>
                  <select
                    name="state"
                    className="form-select"
                    defaultValue=""
                  >
                    <option value="">Select state</option>
                    <option>Telangana</option>
                    <option>Andhra Pradesh</option>
                    <option>Karnataka</option>
                    <option>Tamil Nadu</option>
                    <option>Kerala</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">PIN Code</label>
                  <input
                    name="pinCode"
                    type="text"
                    className="form-control"
                    placeholder="6-digit PIN code"
                    maxLength="6"
                    pattern="[0-9]{6}"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Full Address</label>
                  <textarea
                    name="fullAddress"
                    className="form-control"
                    rows="2"
                    placeholder="Enter full address"
                  ></textarea>
                </div>
              </div>

              <hr className="my-4" />

              <h6 className="text-success fw-bold mb-3">
                <i className="bi bi-chat-dots-fill me-2"></i>
                Discussion Details
              </h6>

              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Discussion Status</label>
                  <select
                    name="discussionStatus"
                    className="form-select"
                    defaultValue=""
                  >
                    <option value="">Select Status</option>
                    <option>Not Contacted</option>
                    <option>Discussion Done</option>
                    <option>Interested</option>
                    <option>Not Interested</option>
                    <option>Follow-up Required</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Transportation</label>
                  <select
                    name="transportation"
                    className="form-select"
                    defaultValue=""
                  >
                    <option value="">Select Transportation</option>
                    <option>Navatha</option>
                    <option>Cargo</option>
                    <option>RTC</option>
                    <option>Others</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Payment Status</label>
                  <select
                    name="paymentStatus"
                    className="form-select"
                    defaultValue=""
                  >
                    <option value="">Select Payment Status</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Next Follow-up Date</label>
                  <input
                    name="nextFollowUpDate"
                    type="date"
                    className="form-control"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Remarks</label>
                  <textarea
                    name="remarks"
                    className="form-control"
                    rows="3"
                    placeholder="Enter discussion details"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="reset"
                className="btn btn-light border"
                disabled={loading}
              >
                Clear
              </button>

              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                <i className="bi bi-check-circle me-2"></i>
                {loading ? "Saving..." : "Save Rythu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};