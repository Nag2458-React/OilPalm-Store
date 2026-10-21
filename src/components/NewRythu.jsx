
import React from "react";

export const NewRythu = () => {
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

          <form>
            <div className="modal-body p-4">

              <h6 className="text-success fw-bold mb-3">
                <i className="bi bi-person-fill me-2"></i>
                Personal Details
              </h6>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Rythu Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter farmer name"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Farm Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">How Many Acres *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter How Many Acres" required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Mobile Number *</label>
                  <input
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
                    type="tel"
                    className="form-control"
                    placeholder="Optional"
                    maxLength="10"
                  />
                </div>
                 <div className="col-md-4">
                  <label className="form-label">Order Recieved Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Order Recieved Date"
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
                    type="text"
                    className="form-control"
                    placeholder="Village"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Mandal *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mandal"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">District *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="District"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">State</label>
                  <select className="form-select" defaultValue="">
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
                  <select className="form-select" defaultValue="Not Contacted">
                    <option>Not Contacted</option>
                    <option>Discussion Done</option>
                    <option>Interested</option>
                    <option>Not Interested</option>
                    <option>Follow-up Required</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Transportation</label>
                  <select className="form-select" defaultValue="Not Contacted">
                    <option>Navatha</option>
                    <option>Cargo</option>
                    <option>RTC</option>
                    <option>Others</option>
                    
                    
                  </select>
                </div>
                 <div className="col-md-3">
                  <label className="form-label">Payment Status</label>
                  <select className="form-select" defaultValue="Not Contacted">
                    <option>Yes</option>
                    <option>No</option>
                 
                    
                    
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Next Follow-up Date</label>
                  <input type="date" className="form-control" />
                </div>

                <div className="col-12">
                  <label className="form-label">Remarks</label>
                  <textarea
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
              >
                Cancel
              </button>

              <button type="reset" className="btn btn-light border">
                Clear
              </button>

              <button type="submit" className="btn btn-success">
                <i className="bi bi-check-circle me-2"></i>
                Save Rythu
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};