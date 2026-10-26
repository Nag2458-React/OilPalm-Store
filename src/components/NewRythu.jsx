
import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const NewRythu = ({ onSaveRythu }) => {
  const [loading, setLoading] = useState(false);

  // Product selection states
  const [bottles, setBottles] = useState("");
  const [kits, setKits] = useState("");
  const [discount, setDiscount] = useState("0");

  // Product prices
  const BOTTLE_PRICE = 750;
  const KIT_PRICE = 1850;

  // Calculate selected quantities
  const bottleCount = Number(bottles) || 0;
  const kitCount = Number.parseInt(kits, 10) || 0;

  // Automatic amount calculation
  const bottleAmount = bottleCount * BOTTLE_PRICE;
  const kitAmount = kitCount * KIT_PRICE;

  const totalAmount = bottleAmount + kitAmount;

  const discountAmount = Math.min(
    Math.max(Number(discount) || 0, 0),
    totalAmount
  );

  const finalAmount = totalAmount - discountAmount;

  // Save farmer details to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      setLoading(true);

      await addDoc(collection(db, "rythulu"), {
        ...data,
        bottles: bottles,
        kits: kits,
        bottlePrice: BOTTLE_PRICE,
        kitPrice: KIT_PRICE,
        bottleAmount: bottleAmount,
        kitAmount: kitAmount,
        totalAmount: totalAmount,
        discount: discountAmount,
        finalAmount: finalAmount,
        createdAt: Timestamp.now(),
      });

      alert("Rythu data saved successfully!");

      form.reset();

      setBottles("");
      setKits("");
      setDiscount("0");

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

          {/* Header */}
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

              {/* Personal Details */}
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
                    placeholder="Enter farm name"
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

                {/* Product Quantities */}
                <div className="col-md-6">
                  <label className="form-label">
                    How Many 1 Litre Bottles
                  </label>

                  <select
                    name="bottles"
                    className="form-select"
                    value={bottles}
                    onChange={(e) => setBottles(e.target.value)}
                  >
                    <option value="">Select Bottles</option>
                    <option value="1">1 Bottle</option>
                    <option value="2">2 Bottles</option>
                    <option value="3">3 Bottles</option>
                    <option value="4">4 Bottles</option>
                    <option value="5">5 Bottles</option>
                  </select>

                  <small className="text-muted">
                    Price per bottle: ₹{BOTTLE_PRICE.toLocaleString("en-IN")}
                  </small>
                </div>

                <div className="col-md-6">
                  <label className="form-label">How Many Kits</label>

                  <select
                    name="kits"
                    className="form-select"
                    value={kits}
                    onChange={(e) => setKits(e.target.value)}
                  >
                    <option value="">Select Kits</option>
                    <option value="1 KIT">1 KIT</option>
                    <option value="2 KITS">2 KITS</option>
                    <option value="3 KITS">3 KITS</option>
                    <option value="4 KITS">4 KITS</option>
                    <option value="5 KITS">5 KITS</option>
                  </select>

                  <small className="text-muted">
                    Price per kit: ₹{KIT_PRICE.toLocaleString("en-IN")}
                  </small>
                </div>

                {/* Amount Calculation Section */}
                <div className="col-12">
                  <div className="p-3 p-md-4 rounded-3 border bg-light">
                    <h6 className="text-success fw-bold mb-3">
                      <i className="bi bi-calculator me-2"></i>
                      Product Amount Details
                    </h6>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Bottle Amount (₹)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={bottleAmount.toLocaleString("en-IN")}
                          readOnly
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Kit Amount (₹)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={kitAmount.toLocaleString("en-IN")}
                          readOnly
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Total Amount (₹)
                        </label>
                        <input
                          type="number"
                          name="totalAmount"
                          className="form-control fw-bold"
                          value={totalAmount}
                          readOnly
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Discount Amount (₹)
                        </label>
                        <input
                          type="number"
                          name="discount"
                          className="form-control"
                          min="0"
                          max={totalAmount}
                          step="1"
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                        />
                        <small className="text-muted">
                          Admin can enter a discount up to the total amount.
                        </small>
                      </div>

                      <div className="col-12">
                        <div className="p-3 rounded-3 bg-success text-white d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <div>
                            <div className="small">Final Payable Amount</div>
                            <div className="fs-4 fw-bold">
                              ₹{finalAmount.toLocaleString("en-IN")}
                            </div>
                          </div>

                          <i className="bi bi-cash-coin fs-1"></i>

                          <input
                            type="hidden"
                            name="finalAmount"
                            value={finalAmount}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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

              {/* Address Details */}
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

              {/* Discussion Details */}
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

            {/* Footer */}
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
                onClick={() => {
                  setBottles("");
                  setKits("");
                  setDiscount("0");
                }}
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

